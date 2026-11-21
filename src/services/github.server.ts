// Server-only: leitura da API GitHub com o token GITHUB_TOKEN. Somente operações GET.
import { GITHUB_API_URL } from "@/config/app";

export async function githubGet<T>(path: string): Promise<T> {
  const token = process.env["GITHUB_TOKEN"];
  if (!token) throw new Error("GITHUB_TOKEN não está configurado no servidor.");
  const res = await fetch(`${GITHUB_API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "WLC-IA",
    },
  });
  const body = await res.text();
  if (!res.ok) {
    let msg = body.slice(0, 300);
    try { msg = (JSON.parse(body) as { message?: string }).message ?? msg; } catch {}
    throw new Error(`GitHub ${res.status}: ${msg}`);
  }
  return JSON.parse(body) as T;
}
