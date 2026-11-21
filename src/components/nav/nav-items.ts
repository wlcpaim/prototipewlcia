import { MessageSquare, Settings } from "lucide-react";

/** Destinos da v0.1: somente Chat e Configurações. */
export const NAV_ITEMS = [
  { to: "/chat", label: "Chat", icon: MessageSquare },
  { to: "/settings", label: "Configurações", icon: Settings },
] as const;
