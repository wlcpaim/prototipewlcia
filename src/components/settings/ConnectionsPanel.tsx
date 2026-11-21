import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { testGeminiConnection, testGithubConnection } from "@/services/integrations.functions";
import { integrationsQuery } from "./integrations-query";
import { StatusBadge, fmtDate } from "./StatusBadge";
import { Field } from "./Field";
import type { IntegrationProvider } from "@/types/integrations";

export function useTestConnection() {
  const qc = useQueryClient();
  const [testing, setTesting] = useState<IntegrationProvider | null>(null);
  async function test(p: IntegrationProvider) {
    setTesting(p);
    try {
      const r = p === "gemini" ? await testGeminiConnection() : await testGithubConnection();
      if (r.ok) toast.success(`${p === "gemini" ? "Gemini" : "GitHub"}: conexão confirmada`);
      else toast.error(r.error ?? "Falha no teste");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setTesting(null);
      qc.invalidateQueries({ queryKey: ["integrations"] });
    }
  }
  return { test, testing };
}

export function ConnectionsPanel({ onConfigure }: { onConfigure: (p: IntegrationProvider) => void }) {
  const { data, isLoading, error } = useQuery(integrationsQuery);
  const { test, testing } = useTestConnection();
  if (isLoading) return <p className="text-sm text-muted-foreground">Carregando conexões…</p>;
  if (error) return <p className="text-sm text-destructive">{error.message}</p>;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {data?.map((i) => (
        <section key={i.provider} className="rounded-xl border bg-card p-4">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold">{i.name}</h3>
            <StatusBadge state={i.status} />
          </div>
          <dl className="mt-3">
            <Field label="Provedor">{i.vendor}</Field>
            <Field label="Autenticação">{i.auth_type}</Field>
            <Field label="Última verificação">{fmtDate(i.last_checked_at)}</Field>
            {i.last_error && <Field label="Erro"><span className="text-destructive">{i.last_error}</span></Field>}
          </dl>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => onConfigure(i.provider)}>Configurar</Button>
            <Button size="sm" onClick={() => test(i.provider)} disabled={testing !== null}>
              {testing === i.provider ? "Testando…" : "Testar conexão"}
            </Button>
          </div>
        </section>
      ))}
    </div>
  );
}
