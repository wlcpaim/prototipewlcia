import { cn } from "@/lib/utils";
import type { IntegrationState } from "@/types/integrations";

const LABEL: Record<IntegrationState, string> = {
  connected: "Conectado (testado)",
  error: "Erro",
  unknown: "Não testado",
  not_configured: "Não configurado",
};

export function StatusBadge({ state }: { state: IntegrationState }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs",
      state === "connected" && "border-success/40 text-success",
      state === "error" && "border-destructive/40 text-destructive",
      (state === "unknown" || state === "not_configured") && "text-muted-foreground",
    )}>
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current")} />
      {LABEL[state]}
    </span>
  );
}

export function fmtDate(d: string | null) {
  return d ? new Date(d).toLocaleString("pt-BR") : "—";
}
