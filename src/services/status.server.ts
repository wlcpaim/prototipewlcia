// Server-only: grava o estado de integrações do usuário (nunca grava segredos).
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export async function recordStatus(
  supabase: SupabaseClient<Database>,
  userId: string,
  provider: "gemini" | "github",
  patch: { status?: string; last_error?: string | null; checked?: boolean; used?: boolean },
) {
  const now = new Date().toISOString();
  const row: Database["public"]["Tables"]["integration_status"]["Insert"] = {
    user_id: userId,
    provider,
    auth_type: provider === "gemini" ? "API Key (x-goog-api-key)" : "Personal Access Token",
  };
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.last_error !== undefined) row.last_error = patch.last_error;
  if (patch.checked) row.last_checked_at = now;
  if (patch.used) row.last_used_at = now;
  const { error } = await supabase.from("integration_status").upsert(row, { onConflict: "user_id,provider" });
  if (error) console.error("integration_status upsert failed:", error.message);
}
