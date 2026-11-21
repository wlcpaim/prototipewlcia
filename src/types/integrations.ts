export type IntegrationProvider = "gemini" | "github";
export type IntegrationState = "unknown" | "connected" | "error" | "not_configured";
export interface IntegrationStatus {
  provider: IntegrationProvider;
  name: string;
  vendor: string;
  auth_type: string;
  status: IntegrationState;
  last_checked_at: string | null;
  last_used_at: string | null;
  last_error: string | null;
}
