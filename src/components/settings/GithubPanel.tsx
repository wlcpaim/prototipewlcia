import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGithubOverview, selectGithubRepo } from "@/services/integrations.functions";
import { useTestConnection } from "./ConnectionsPanel";
import { Field } from "./Field";
import { fmtDate } from "./StatusBadge";
import { cn } from "@/lib/utils";

export function GithubPanel() {
  const qc = useQueryClient();
  const { data, isLoading, error, refetch } = useQuery({ queryKey: ["github"], queryFn: () => getGithubOverview(), retry: false });
  const { test, testing } = useTestConnection();
  const [saving, setSaving] = useState<string | null>(null);

  async function select(repo: string) {
    setSaving(repo);
    try {
      await selectGithubRepo({ data: { repo } });
      await qc.invalidateQueries({ queryKey: ["github"] });
      toast.success(`Repositório selecionado: ${repo}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    } finally { setSaving(null); }
  }

  if (isLoading) return <p className="text-sm text-muted-foreground">Consultando GitHub…</p>;
  if (error) return (
    <div className="max-w-2xl rounded-xl border border-destructive/40 p-4 text-sm">
      <p className="text-destructive">{error.message}</p>
      <Button size="sm" className="mt-3" onClick={() => refetch()}>Tentar novamente</Button>
    </div>
  );
  if (!data?.configured) return <p className="text-sm text-muted-foreground">GITHUB_TOKEN não está configurado no servidor.</p>;

  const selected = data.repos.find((r) => r.full_name === data.selected);
  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <section className="rounded-xl border bg-card p-4">
        <div className="flex items-center gap-3">
          <img src={data.user.avatar_url} alt="" className="h-10 w-10 rounded-full" />
          <div className="min-w-0">
            <a href={data.user.html_url} target="_blank" rel="noreferrer" className="font-semibold hover:underline">{data.user.login}</a>
            {data.user.name && <p className="truncate text-xs text-muted-foreground">{data.user.name}</p>}
          </div>
        </div>
        <dl className="mt-3">
          <Field label="Autenticação">Personal Access Token (somente servidor, leitura)</Field>
          <Field label="Repositórios autorizados">{data.repos.length}</Field>
          <Field label="Selecionado">{selected ? `${selected.full_name} · ${selected.default_branch} · ${selected.language ?? "—"}` : "Nenhum"}</Field>
        </dl>
        <Button size="sm" className="mt-3" onClick={() => test("github")} disabled={testing !== null}>{testing ? "Testando…" : "Verificar conexão"}</Button>
      </section>
      <section>
        <h3 className="mb-2 text-sm font-semibold">Repositórios</h3>
        <ul className="divide-y rounded-xl border">
          {data.repos.map((r) => (
            <li key={r.id} className={cn("flex items-center gap-3 p-3", r.full_name === data.selected && "bg-accent")}>
              {r.private ? <Lock className="h-4 w-4 shrink-0 text-muted-foreground" /> : <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />}
              <div className="min-w-0 flex-1">
                <a href={r.html_url} target="_blank" rel="noreferrer" className="block truncate text-sm font-medium hover:underline">{r.full_name}</a>
                <p className="truncate text-xs text-muted-foreground">{r.description ?? "Sem descrição"} · atualizado {fmtDate(r.updated_at)}</p>
              </div>
              <Button size="sm" variant={r.full_name === data.selected ? "default" : "secondary"} disabled={saving !== null || r.full_name === data.selected} onClick={() => select(r.full_name)}>
                {r.full_name === data.selected ? "Selecionado" : saving === r.full_name ? "…" : "Selecionar"}
              </Button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
