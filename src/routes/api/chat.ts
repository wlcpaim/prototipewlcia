// POST /api/chat — streaming do Gemini. Verifica o usuário pelo bearer token,
// persiste a mensagem do usuário e a resposta (inclusive parcial se interrompida).
import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { openGeminiStream, textFromGeminiChunk, describeGeminiError } from "@/services/gemini.server";
import { recordStatus } from "@/services/status.server";

function userClient(token: string) {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        h.set("apikey", key);
        h.set("Authorization", `Bearer ${token}`);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
        if (!token) return Response.json({ error: "Não autenticado" }, { status: 401 });
        const supabase = userClient(token);
        const { data: auth, error: authErr } = await supabase.auth.getUser(token);
        if (authErr || !auth.user) return Response.json({ error: "Sessão inválida" }, { status: 401 });
        const userId = auth.user.id;

        const body = (await request.json().catch(() => null)) as { message?: unknown } | null;
        const message = typeof body?.message === "string" ? body.message.trim() : "";
        if (!message) return Response.json({ error: "Mensagem vazia" }, { status: 400 });
        if (message.length > 100_000) return Response.json({ error: "Mensagem muito longa" }, { status: 400 });

        // Conversa única do usuário.
        let { data: conv } = await supabase.from("conversations").select("id").eq("user_id", userId).maybeSingle();
        if (!conv) {
          const ins = await supabase.from("conversations").insert({ user_id: userId, title: message.slice(0, 60) }).select("id").single();
          if (ins.error) return Response.json({ error: ins.error.message }, { status: 500 });
          conv = ins.data;
        }
        const convId = conv.id;

        const userIns = await supabase.from("messages").insert({ conversation_id: convId, user_id: userId, role: "user", content: message });
        if (userIns.error) return Response.json({ error: userIns.error.message }, { status: 500 });

        const { data: history, error: hErr } = await supabase
          .from("messages").select("role, content").eq("conversation_id", convId).order("created_at", { ascending: true });
        if (hErr) return Response.json({ error: hErr.message }, { status: 500 });

        const upstreamAbort = new AbortController();
        request.signal.addEventListener("abort", () => upstreamAbort.abort());

        let upstream: Response;
        try {
          upstream = await openGeminiStream(history as { role: "user" | "model"; content: string }[], upstreamAbort.signal);
        } catch (e) {
          const msg = `Falha de rede ao contatar o Gemini: ${e instanceof Error ? e.message : String(e)}`;
          await recordStatus(supabase, userId, "gemini", { status: "error", last_error: msg });
          return Response.json({ error: msg }, { status: 502 });
        }
        if (!upstream.ok || !upstream.body) {
          const msg = describeGeminiError(upstream.status, await upstream.text());
          console.error("gemini error", msg);
          await recordStatus(supabase, userId, "gemini", { status: "error", last_error: msg });
          return Response.json({ error: msg }, { status: 502 });
        }

        const encoder = new TextEncoder();
        const decoder = new TextDecoder();
        let full = "";
        let saved = false;
        const save = async (stopped: boolean) => {
          if (saved) return;
          saved = true;
          if (full) {
            const r = await supabase.from("messages").insert({ conversation_id: convId, user_id: userId, role: "model", content: full });
            if (r.error) console.error("save model message failed:", r.error.message);
          }
          await supabase.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", convId);
          await recordStatus(supabase, userId, "gemini", { status: "connected", last_error: null, used: true });
          if (stopped) console.info("generation stopped by user");
        };

        const reader = upstream.body.getReader();
        const stream = new ReadableStream<Uint8Array>({
          async start(controller) {
            let buf = "";
            try {
              for (;;) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += decoder.decode(value, { stream: true });
                let idx: number;
                while ((idx = buf.indexOf("\n")) >= 0) {
                  const line = buf.slice(0, idx).trim();
                  buf = buf.slice(idx + 1);
                  if (!line.startsWith("data:")) continue;
                  const text = textFromGeminiChunk(line.slice(5).trim());
                  if (text) { full += text; controller.enqueue(encoder.encode(text)); }
                }
              }
              await save(false);
              controller.close();
            } catch (e) {
              await save(true);
              try { controller.close(); } catch {}
            }
          },
          async cancel() {
            upstreamAbort.abort();
            await save(true);
          },
        });
        return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-cache" } });
      },
    },
  },
});
