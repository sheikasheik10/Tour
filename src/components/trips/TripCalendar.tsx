"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn, MONTHS } from "@/lib/format";

type Span = { start: string; end: string; kind: string };

/** Month calendar with booked nights / experience days marked. */
export function TripCalendar({ spans, initial }: { spans: Span[]; initial: string }) {
  const [cursor, setCursor] = useState(() => {
    const d = new Date(initial);
    return { y: d.getUTCFullYear(), m: d.getUTCMonth() };
  });

  const marks = useMemo(() => {
    const map = new Map<string, "stay" | "experience" | "both">();
    for (const s of spans) {
      const a = new Date(s.start);
      const b = new Date(s.end);
      for (let d = new Date(a); d <= b; d.setUTCDate(d.getUTCDate() + 1)) {
        const k = d.toISOString().slice(0, 10);
        const prev = map.get(k);
        map.set(k, prev && prev !== s.kind ? "both" : (s.kind as "stay" | "experience"));
      }
    }
    return map;
  }, [spans]);

  const first = new Date(Date.UTC(cursor.y, cursor.m, 1));
  const offset = (first.getUTCDay() + 6) % 7; // Monday first
  const days = new Date(Date.UTC(cursor.y, cursor.m + 1, 0)).getUTCDate();
  const today = new Date().toISOString().slice(0, 10);
  const shift = (d: number) => setCursor(({ y, m }) => ({ y: m + d < 0 ? y - 1 : m + d > 11 ? y + 1 : y, m: (m + d + 12) % 12 }));

  return (
    <div className="rounded-[1.6rem] bg-ink-2 p-5 text-paper">
      <div className="flex items-center justify-between">
        <p className="eyebrow">
          {MONTHS[cursor.m]} {cursor.y}
        </p>
        <div className="flex gap-1">
          <button onClick={() => shift(-1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper/10" aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => shift(1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-paper/10" aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
          <span key={i} className="coords py-1 text-paper/45">
            {d}
          </span>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <span key={`o${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const k = new Date(Date.UTC(cursor.y, cursor.m, i + 1)).toISOString().slice(0, 10);
          const mark = marks.get(k);
          return (
            <span
              key={k}
              className={cn(
                "grid aspect-square place-items-center rounded-full text-sm tabular-nums",
                mark === "stay" && "bg-saffron font-semibold text-ink",
                mark === "experience" && "bg-rose font-semibold text-ink",
                mark === "both" && "bg-[linear-gradient(135deg,var(--color-saffron)_50%,var(--color-rose)_50%)] font-semibold text-ink",
                !mark && k === today && "ring-1 ring-paper/60",
                !mark && "text-paper/75",
              )}
            >
              {i + 1}
            </span>
          );
        })}
      </div>
      <div className="mt-4 flex gap-4 text-xs text-paper/60">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-saffron" /> Stay</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose" /> Experience</span>
      </div>
    </div>
  );
}
