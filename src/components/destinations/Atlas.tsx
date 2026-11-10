"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { IslandBase } from "@/components/map/IslandBase";
import { LABEL_SIDE, project } from "@/lib/geo";
import { cn, MONTHS_SHORT } from "@/lib/format";

type D = { slug: string; name: string; region: string; tagline: string; lat: number; lng: number; heroImage: string; bestMonths: number[]; stays: number; experiences: number };

const REGIONS = ["The Coast", "Ancient Kingdoms", "Tea Country", "The Wild"];

export function Atlas({ destinations }: { destinations: D[] }) {
  const [active, setActive] = useState<string | null>(null);
  const a = destinations.find((d) => d.slug === active);

  return (
    <div className="grid gap-14 lg:grid-cols-[minmax(0,440px)_1fr] xl:gap-24">
      <div className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+2rem)]">
          <div className="relative">
            <IslandBase tone="light" className="max-h-[78vh]">
              {() =>
                destinations.map((d) => {
                  const [x, y] = project(d.lat, d.lng);
                  const on = active === d.slug;
                  const side = LABEL_SIDE[d.slug] ?? "right";
                  return (
                    <Link key={d.slug} href={`/destinations/${d.slug}`} onMouseEnter={() => setActive(d.slug)} onMouseLeave={() => setActive(null)} aria-label={d.name}>
                      <g transform={`translate(${x} ${y})`}>
                        {on && <circle r="14" className="origin-center animate-pulse-ring fill-clay/40 [transform-box:fill-box]" />}
                        <circle r="20" fill="transparent" />
                        <circle r={on ? 10 : 7} fill={on ? "var(--color-clay)" : "var(--color-ink)"} stroke="#fffaf2" strokeWidth="2.5" style={{ transition: "all .3s" }} />
                        <text
                          x={side === "right" ? 15 : -15}
                          y={5}
                          textAnchor={side === "right" ? "start" : "end"}
                          fontFamily="var(--font-mono)"
                          fontSize="14"
                          letterSpacing="1"
                          className={cn("uppercase", on ? "fill-clay" : "fill-ink/60")}
                        >
                          {d.name.split(" & ")[0]}
                        </text>
                      </g>
                    </Link>
                  );
                })
              }
            </IslandBase>
            {a && (
              <div className="pointer-events-none absolute bottom-0 right-0 w-52 overflow-hidden rounded-2xl bg-ink text-paper shadow-2xl">
                <div className="relative aspect-[16/10]">
                  <Image src={a.heroImage} alt="" fill sizes="208px" className="object-cover" />
                </div>
                <p className="display p-3 text-lg">{a.name}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {REGIONS.map((r) => (
          <div key={r}>
            <p className="eyebrow flex items-center gap-4 text-clay">
              {r} <span className="h-px flex-1 bg-line" />
            </p>
            <ul className="mt-4">
              {destinations
                .filter((d) => d.region === r)
                .map((d) => (
                  <li key={d.slug}>
                    <Link
                      href={`/destinations/${d.slug}`}
                      onMouseEnter={() => setActive(d.slug)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(d.slug)}
                      className="group grid grid-cols-[88px_1fr_auto] items-center gap-5 border-b border-line py-5 sm:grid-cols-[120px_1fr_auto]"
                    >
                      <span className="relative aspect-[4/3] overflow-hidden rounded-xl">
                        <Image src={d.heroImage} alt="" fill sizes="120px" className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      </span>
                      <span className="min-w-0">
                        <span className="display block text-[clamp(1.6rem,2.6vw,2.4rem)] transition-colors group-hover:text-clay">{d.name}</span>
                        <span className="mt-1 line-clamp-1 block text-ink-soft">{d.tagline}</span>
                        <span className="coords mt-2 block text-ink-soft">
                          BEST {d.bestMonths.map((m) => MONTHS_SHORT[m - 1].toUpperCase()).join(" · ")} — {d.stays} STAYS · {d.experiences} EXPERIENCES
                        </span>
                      </span>
                      <span className="grid h-11 w-11 place-items-center rounded-full ring-1 ring-line transition group-hover:bg-ink group-hover:text-paper">
                        <ArrowUpRight size={18} />
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
