import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatabasePanel } from "@/components/settings/DatabasePanel";
import { ConnectionsPanel } from "@/components/settings/ConnectionsPanel";
import { GeminiPanel } from "@/components/settings/GeminiPanel";
import { GithubPanel } from "@/components/settings/GithubPanel";

type Tab = "database" | "connections" | "gemini" | "github";
const TABS: Tab[] = ["database", "connections", "gemini", "github"];

export const Route = createFileRoute("/_authenticated/settings")({
  validateSearch: (s: Record<string, unknown>): { tab: Tab } => ({
    tab: TABS.includes(s["tab"] as Tab) ? (s["tab"] as Tab) : "database",
  }),
  head: () => ({
    meta: [
      { title: "Configurações — WLC IA" },
      { name: "description", content: "Central de infraestrutura do WLC IA: banco, conexões, Gemini e GitHub." },
      { property: "og:title", content: "Configurações — WLC IA" },
      { property: "og:description", content: "Central de infraestrutura do WLC IA." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { tab } = Route.useSearch();
  const navigate = Route.useNavigate();
  const go = (t: Tab) => navigate({ search: { tab: t }, replace: true });
  return (
    <div className="flex h-full flex-col">
      <header className="flex h-12 shrink-0 items-center border-b px-4">
        <h1 className="text-sm font-semibold">Configurações</h1>
      </header>
      <Tabs value={tab} onValueChange={(v) => go(v as Tab)} className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 overflow-x-auto border-b px-3 py-2">
          <TabsList>
            <TabsTrigger value="database">Banco de Dados</TabsTrigger>
            <TabsTrigger value="connections">Conexões API</TabsTrigger>
            <TabsTrigger value="gemini">Gemini</TabsTrigger>
            <TabsTrigger value="github">GitHub</TabsTrigger>
          </TabsList>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-4">
          <TabsContent value="database" className="mt-0"><DatabasePanel /></TabsContent>
          <TabsContent value="connections" className="mt-0"><ConnectionsPanel onConfigure={(p) => go(p)} /></TabsContent>
          <TabsContent value="gemini" className="mt-0"><GeminiPanel /></TabsContent>
          <TabsContent value="github" className="mt-0"><GithubPanel /></TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
