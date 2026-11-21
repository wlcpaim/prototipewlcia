import { cn } from "@/lib/utils";

/** Marca WLC IA: monograma geométrico. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("grid place-items-center rounded-2xl bg-primary text-primary-foreground", className)} aria-hidden="true">
      <span className="font-mono text-[0.95em] font-bold tracking-tighter">W/</span>
    </div>
  );
}
