import { queryOptions } from "@tanstack/react-query";
import { listIntegrations } from "@/services/integrations.functions";

export const integrationsQuery = queryOptions({ queryKey: ["integrations"], queryFn: () => listIntegrations() });
