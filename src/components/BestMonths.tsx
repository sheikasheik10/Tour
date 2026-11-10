import { cn, MONTHS, MONTHS_SHORT } from "@/lib/format";

/** Twelve-cell strip; in-season months are filled. */
export function BestMonths({ months, tone = "light", className }: { months: number[]; tone?: "light" | "dark"; className?: string }) {
  const now = new Date().getUTCMonth() + 1;
  return (
    <div className={cn("grid grid-cols-12 gap-1", className)} role="list" aria-label={`Best months: ${months.map((m) => MONTHS[m - 1]).join(", ")}`}>
      {MONTHS_SHORT.map((m, i) => {
        const on = months.includes(i + 1);
        return (
          <div key={m} role="listitem" className="flex flex-col items-center gap-1.5">
            <span
              className={cn(
                "h-8 w-full rounded-md transition-colors",
                on ? "bg-saffron" : tone === "dark" ? "bg-paper/10" : "bg-ink/[0.07]",
                i + 1 === now && "ring-2 ring-offset-2 ring-clay",
                tone === "dark" ? "ring-offset-ink" : "ring-offset-paper",
              )}
            />
            <span className={cn("coords", tone === "dark" ? "text-paper/60" : "text-ink-soft", i + 1 === now && "font-semibold text-clay")}>{m[0]}</span>
          </div>
        );
      })}
    </div>
  );
}
