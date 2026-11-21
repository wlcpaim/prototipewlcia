import type { ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BrandMark } from "@/components/BrandMark";
import { NAV_ITEMS } from "./nav-items";

/**
 * Sistema de navegação único: a mesma lista renderiza como barra lateral (md+)
 * ou barra inferior (<md) via CSS — nunca as duas ao mesmo tempo.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  }

  const itemCls =
    "grid h-11 w-11 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground";

  return (
    <TooltipProvider delayDuration={200}>
      <div className="pt-safe fixed inset-0 flex flex-col overflow-hidden md:flex-row">
        <nav aria-label="Navegação" className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-sidebar-border bg-sidebar py-4 md:flex">
          <BrandMark className="mb-4 h-9 w-9 text-sm" />
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Tooltip key={to}>
              <TooltipTrigger asChild>
                <Link to={to} aria-label={label} className={itemCls}><Icon className="h-5 w-5" /></Link>
              </TooltipTrigger>
              <TooltipContent side="right">{label}</TooltipContent>
            </Tooltip>
          ))}
          <div className="flex-1" />
          <Tooltip>
            <TooltipTrigger asChild>
              <button type="button" onClick={signOut} aria-label="Sair" className={itemCls}><LogOut className="h-5 w-5" /></button>
            </TooltipTrigger>
            <TooltipContent side="right">Sair</TooltipContent>
          </Tooltip>
        </nav>

        <main className="min-h-0 min-w-0 flex-1 overflow-hidden">{children}</main>

        <nav aria-label="Navegação" className="pb-safe flex shrink-0 items-center justify-around border-t border-sidebar-border bg-sidebar md:hidden">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} aria-label={label} title={label} className={`${itemCls} my-1.5`}><Icon className="h-5 w-5" /></Link>
          ))}
          <button type="button" onClick={signOut} aria-label="Sair" title="Sair" className={`${itemCls} my-1.5`}><LogOut className="h-5 w-5" /></button>
        </nav>
      </div>
    </TooltipProvider>
  );
}
