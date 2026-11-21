import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { APP_NAME, APP_VERSION } from "@/config/app";
import { BrandMark } from "@/components/BrandMark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WLC IA — Entrar" },
      { name: "description", content: "WLC IA: chat com Gemini, integrações e infraestrutura transparente." },
      { property: "og:title", content: "WLC IA" },
      { property: "og:description", content: "Chat com Gemini, integrações e infraestrutura transparente." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Landing,
});

const GoogleG = () => (
  <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>
);

function Landing() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/chat", replace: true });
    });
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session) navigate({ to: "/chat", replace: true });
    });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function signIn() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) {
      toast.error(`Falha no login: ${result.error.message}`);
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/chat", replace: true });
  }

  return (
    <main className="pt-safe pb-safe flex min-h-dvh flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <BrandMark className="mx-auto h-14 w-14" />
        <h1 className="mt-6 text-4xl font-semibold tracking-tight">{APP_NAME}</h1>
        <p className="mt-3 text-muted-foreground">
          Chat com Gemini e uma central de infraestrutura transparente: banco, conexões e GitHub.
        </p>
        <button
          type="button"
          onClick={signIn}
          disabled={busy}
          className="mt-10 inline-flex h-11 w-full items-center justify-center gap-[10px] rounded-full border border-[#8E918F] bg-[#131314] px-3 text-sm font-medium text-[#E3E3E3] transition-opacity disabled:opacity-60"
        >
          <GoogleG />
          {busy ? "Abrindo Google…" : "Continuar com Google"}
        </button>
        <p className="mt-8 font-mono text-xs text-muted-foreground">v{APP_VERSION}</p>
      </div>
    </main>
  );
}
