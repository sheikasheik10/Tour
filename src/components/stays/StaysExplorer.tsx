"use client";

import Link from "next/link";
import { useState } from "react";
import { StayCard } from "@/components/StayCard";
import { IslandBase } from "@/components/map/IslandBase";
import { project } from "@/lib/geo";
import type { StayCardData } from "@/lib/queries";
import { cn, usd } from "@/lib/format";

/** Results grid + a sticky island map with price-tag pins that track hover. */
export function StaysExplorer({ stays, soldOut, query }: { stays: StayCardData[]; soldOut: string[]; query: string }) {
  const [active, setActive] = useState<string | null>(null);
  const out = new Set(soldOut);

  // Nudge price tags apart: if a tag would overlap one already placed, push it
  // sideways (alternating) until it's clear. Tags are 64×26 in map units.
  const placed: { x: number; y: number }[] = [];
  const pins = stays.map((s) => {
    const [x0, y0] = project(s.destination.lat, s.destination.lng);
    let x = x0;
    let y = y0;
    for (let k = 1; placed.some((p) => Math.abs(p.x - x) < 68 && Math.abs(p.y - y) < 30) && k < 12; k++) {
      x = x0 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 74;
      y = y0 + (k > 2 ? 32 : 0);
    }
    placed.push({ x, y });
    return { s, x, y, x0, y0 };
  });

  if (!stays.length)
    return (
      <div className="mt-16 rounded-3xl bg-paper-2 p-12 text-center">
        <p className="display text-3xl">Nothing matches just yet.</p>
        <p className="mt-3 text-ink-soft">Try another category or destination, or let us plan it for you.</p>
        <Link href="/journey" className="btn mt-8">
          Plan a journey instead
        </Link>
      </div>
    );

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_440px]">
      <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2">
        {stays.map((s) => (
          <div key={s.id} onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} className={cn("relative transition-opacity", out.has(s.id) && "opacity-55")}>
            <StayCard stay={s} query={query} />
            {out.has(s.id) && <span className="absolute left-3.5 top-12 rounded-full bg-clay px-3 py-1 text-[0.72rem] font-semibold text-paper">Sold out for your dates</span>}
          </div>
        ))}
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-[1.8rem] bg-paper-2 p-6">
          <p className="eyebrow text-ink-soft">On the map</p>
          <IslandBase tone="light" graticule={false} className="mt-4 max-h-[70vh]">
            {() =>
              pins.map(({ s, x, y, x0, y0 }) => {
                const on = active === s.id;
                const w = 64;
                return (
                  <Link key={s.id} href={`/stays/${s.slug}${query ? `?${query}` : ""}`} onMouseEnter={() => setActive(s.id)} onMouseLeave={() => setActive(null)} aria-label={`${s.name}, ${usd(s.priceFrom)} per night`}>
                    {(x !== x0 || y !== y0) && <line x1={x0} y1={y0} x2={x} y2={y - 6} stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth={1.2} />}
                    <circle cx={x0} cy={y0} r={3.5} fill="var(--color-ink)" />
                    <g transform={`translate(${x} ${y})`} className="cursor-pointer" style={{ transition: "transform .3s" }}>
                      <g transform={on ? "scale(1.25)" : "scale(1)"} style={{ transition: "transform .3s" }}>
                        <rect x={-w / 2} y={-34} width={w} height={26} rx={13} fill={on ? "var(--color-clay)" : out.has(s.id) ? "#cbbfa8" : "var(--color-ink)"} />
                        <path d="M-6,-9 L0,-1 L6,-9Z" fill={on ? "var(--color-clay)" : out.has(s.id) ? "#cbbfa8" : "var(--color-ink)"} />
                        <text y={-16} textAnchor="middle" fontSize="13" fontWeight="600" fill="#f3ede2" fontFamily="var(--font-sans)">
                          {usd(s.priceFrom)}
                        </text>
                      </g>
                    </g>
                  </Link>
                );
              })
            }
          </IslandBase>
          {active && (
            <p className="mt-2 truncate text-center text-sm">
              <span className="font-semibold">{stays.find((s) => s.id === active)?.name}</span>
              <span className="text-ink-soft"> · {stays.find((s) => s.id === active)?.destination.name}</span>
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
