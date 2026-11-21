// Server-only: chamadas à API oficial do Gemini. A chave vem de process.env.GEMINI_API_KEY.
// Chaves no formato "AQ." exigem o cabeçalho x-goog-api-key (não ?key=).
import { GEMINI_BASE_URL, GEMINI_MODEL } from "@/config/app";
import type { ChatRole } from "@/types/chat";

function apiKey(): string {
  const k = process.env["GEMINI_API_KEY"];
  if (!k) throw new Error("GEMINI_API_KEY não está configurada no servidor.");
  return k;
}

export function describeGeminiError(status: number, body: string): string {
  try {
    const j = JSON.parse(body) as { error?: { message?: string; status?: string } };
    if (j.error?.message) return `Gemini ${status} ${j.error.status ?? ""}: ${j.error.message}`.trim();
  } catch {}
  return `Gemini ${status}: ${body.slice(0, 300)}`;
}

/** Abre um streaming SSE de streamGenerateContent. */
export async function openGeminiStream(
  history: { role: ChatRole; content: string }[],
  signal: AbortSignal,
): Promise<Response> {
  return fetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse`, {
    method: "POST",
    signal,
    headers: { "x-goog-api-key": apiKey(), "content-type": "application/json" },
    body: JSON.stringify({
      contents: history.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
    }),
  });
}

/** Extrai o texto de um evento SSE do Gemini. */
export function textFromGeminiChunk(json: string): string {
  try {
    const j = JSON.parse(json) as {
      candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
    };
    return (j.candidates?.[0]?.content?.parts ?? [])
      .filter((p) => !p.thought)
      .map((p) => p.text ?? "")
      .join("");
  } catch {
    return "";
  }
}

/** Teste real: consulta o modelo configurado e faz uma geração mínima. */
export async function testGemini(): Promise<{ ok: boolean; error: string | null; model: string }> {
  if (!process.env["GEMINI_API_KEY"]) return { ok: false, error: "GEMINI_API_KEY não configurada.", model: GEMINI_MODEL };
  const res = await fetch(`${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent`, {
    method: "POST",
    headers: { "x-goog-api-key": apiKey(), "content-type": "application/json" },
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "ping" }] }], generationConfig: { maxOutputTokens: 16 } }),
  });
  if (!res.ok) return { ok: false, error: describeGeminiError(res.status, await res.text()), model: GEMINI_MODEL };
  return { ok: true, error: null, model: GEMINI_MODEL };
}
