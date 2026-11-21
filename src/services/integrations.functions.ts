import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { testGemini } from "./gemini.server";
import { githubGet } from "./github.server";
import { recordStatus } from "./status.server";
import { GEMINI_MODEL } from "@/config/app";
import type { IntegrationStatus, IntegrationState } from "@/types/integrations";

const META = {
  gemini: { name: "Gemini", vendor: "Google", auth_type: "API Key (x-goog-api-key)", secret: "GEMINI_API_KEY" },
  github: { name: "GitHub", vendor: "GitHub", auth_type: "Personal Access Token", secret: "GITHUB_TOKEN" },
} as const;

export const listIntegrations = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<IntegrationStatus[]> => {
    const { data, error } = await context.supabase.from("integration_status").select("*").eq("user_id", context.userId);
    if (error) throw new Error(error.message);
    return (Object.keys(META) as (keyof typeof META)[]).map((p) => {
      const row = data?.find((r) => r.provider === p);
      const configured = Boolean(process.env[META[p].secret]);
      return {
        provider: p,
        name: META[p].name,
        vendor: META[p].vendor,
        auth_type: META[p].auth_type,
        status: (configured ? (row?.status ?? "unknown") : "not_configured") as IntegrationState,
        last_checked_at: row?.last_checked_at ?? null,
        last_used_at: row?.last_used_at ?? null,
        last_error: row?.last_error ?? null,
      };
    });
  });

export const testGeminiConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const r = await testGemini();
    await recordStatus(context.supabase, context.userId, "gemini", { status: r.ok ? "connected" : "error", last_error: r.error, checked: true });
    return r;
  });

export const getGeminiInfo = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async () => ({ model: GEMINI_MODEL, keyConfigured: Boolean(process.env["GEMINI_API_KEY"]) }));

interface GhUser { login: string; name: string | null; avatar_url: string; html_url: string; public_repos: number }
interface GhRepo { id: number; full_name: string; private: boolean; description: string | null; default_branch: string; updated_at: string; html_url: string; language: string | null; stargazers_count: number }

export const testGithubConnection = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    try {
      const u = await githubGet<GhUser>("/user");
      await recordStatus(context.supabase, context.userId, "github", { status: "connected", last_error: null, checked: true });
      return { ok: true as const, login: u.login, error: null };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      await recordStatus(context.supabase, context.userId, "github", { status: "error", last_error: msg, checked: true });
      return { ok: false as const, login: null, error: msg };
    }
  });

export const getGithubOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    if (!process.env["GITHUB_TOKEN"]) return { configured: false as const };
    const [user, repos, sel] = await Promise.all([
      githubGet<GhUser>("/user"),
      githubGet<GhRepo[]>("/user/repos?per_page=100&sort=updated"),
      context.supabase.from("github_selection").select("repo_full_name").eq("user_id", context.userId).maybeSingle(),
    ]);
    await recordStatus(context.supabase, context.userId, "github", { status: "connected", last_error: null, used: true });
    return {
      configured: true as const,
      user: { login: user.login, name: user.name, avatar_url: user.avatar_url, html_url: user.html_url },
      repos: repos.map((r) => ({ id: r.id, full_name: r.full_name, private: r.private, description: r.description, default_branch: r.default_branch, updated_at: r.updated_at, html_url: r.html_url, language: r.language, stars: r.stargazers_count })),
      selected: sel.data?.repo_full_name ?? null,
    };
  });

export const selectGithubRepo = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { repo: string }) => {
    if (!/^[\w.-]+\/[\w.-]+$/.test(input.repo)) throw new Error("Repositório inválido");
    return input;
  })
  .handler(async ({ data, context }) => {
    // Confirma que o repositório é acessível pelo token antes de salvar.
    await githubGet(`/repos/${data.repo}`);
    const { error } = await context.supabase.from("github_selection").upsert({ user_id: context.userId, repo_full_name: data.repo, updated_at: new Date().toISOString() });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
