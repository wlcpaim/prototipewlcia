import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getGeminiInfo } from "@/services/integrations.functions";
import { integrationsQuery } from "./integrations-query";
import { useTestConnection } from "./ConnectionsPanel";
import { StatusBadge, fmtDate } from "./StatusBadge";
import { Field } from "./Field";

export function GeminiPanel() {
  const info = useQuery({ queryKey: ["gemini-info"], queryFn: () => getGeminiInfo() });
  const list = useQuery(integrationsQuery);
  const g = list.data?.find((i) => i.provider === "gemini");
  const { test, testing } = useTestConnection();
  return (
    <section className="max-w-2xl rounded-xl border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Gemini</h3>
        {g && <StatusBadge state={g.status} />}
      </div>
      <dl className="mt-3">
        <Field label="Provedor">Google (API oficial Gemini)</Field>
        <Field label="Modelo configurado"><span className="font-mono">{info.data?.model ?? "…"}</span></Field>
        <Field label="Método de autenticação">API Key no cabeçalho x-goog-api-key (somente servidor)</Field>
        <Field label="API Key">{info.data ? (info.data.keyConfigured ? "Configurada no servidor (GEMINI_API_KEY)" : "Não configurada") : "…"}</Field>
        <Field label="Última verificação">{fmtDate(g?.last_checked_at ?? null)}</Field>
        <Field label="Última utilização">{fmtDate(g?.last_used_at ?? null)}</Field>
        <Field label="Último erro"><span className={g?.last_error ? "text-destructive" : ""}>{g?.last_error ?? "—"}</span></Field>
      </dl>
      <p className="mt-3 text-xs text-muted-foreground">A chave é guardada como segredo do servidor e nunca é enviada ao navegador. Para trocá-la, atualize o segredo GEMINI_API_KEY nas configurações do projeto.</p>
      <Button className="mt-3" size="sm" onClick={() => test("gemini")} disabled={testing !== null}>
        {testing ? "Testando…" : "Testar conexão real"}
      </Button>
    </section>
  );
}
