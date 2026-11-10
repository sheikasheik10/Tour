"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, CloudRain, Pause, Play, Sun } from "lucide-react";
import { IslandBase } from "@/components/map/IslandBase";
import { LABEL_SIDE, MAP_H, MAP_W, MONSOON, project, RAIN_EAST, RAIN_WEST } from "@/lib/geo";
import { cn, MONTHS, MONTHS_SHORT } from "@/lib/format";

export type MapDestination = {
  slug: string;
  name: string;
  region: string;
  tagline: string;
  lat: number;
  lng: number;
  bestMonths: number[];
  heroImage: string;
};

// Monsoon wind arrows, in map space.
const WIND_SW = ["M-60,900 C40,820 90,760 170,700", "M-20,1010 C110,930 190,880 290,830", "M120,1070 C230,1000 320,960 420,930"];
const WIND_NE = ["M700,40 C620,120 560,170 470,230", "M720,240 C640,300 590,340 520,400", "M700,470 C640,520 600,560 560,610"];

export function MonsoonMap({ destinations, initialMonth }: { destinations: MapDestination[]; initialMonth: number }) {
  const [month, setMonth] = useState(initialMonth);
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  const m = MONSOON[month];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => setMonth((x) => (x % 12) + 1), 1600);
    return () => clearInterval(t);
  }, [playing]);

  const inSeason = useMemo(() => {
    const good = destinations.filter((d) => d.bestMonths.includes(month));
    // No perfect fit (October)? Offer the inland culture trail, which copes best with showers.
    return good.length ? good : destinations.filter((d) => d.region === "Ancient Kingdoms");
  }, [destinations, month]);
  const fallback = !destinations.some((d) => d.bestMonths.includes(month));
  const hovered = destinations.find((d) => d.slug === hover);

  const sunAt = m.wet === "west" ? project(7.6, 81.35) : m.wet === "east" ? project(6.5, 80.3) : project(7.4, 80.8);
  const rainW = m.wet === "west" ? 1 : m.wet === "both" ? 0.55 : 0;
  const rainE = m.wet === "east" ? 1 : m.wet === "both" ? 0.55 : 0;

  return (
    <section className="relative overflow-hidden bg-tea py-24 text-paper md:py-32" id="when-to-go">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1fr_1.05fr]">
        {/* Left — narrative + controls */}
        <div>
          <p className="eyebrow text-saffron">When to go</p>
          <h2 className="display mt-5 text-[clamp(2.6rem,5.4vw,5rem)]">
            There&apos;s always <span className="display-italic text-rose">a sunny side.</span>
          </h2>
          <p className="mt-6 max-w-lg text-paper/75">
            Two monsoons take turns over the island, so while one coast gets rain, the other has sunshine. Slide through the year to see where the weather is
            good.
          </p>

          <div className="mt-12 flex items-end justify-between gap-6">
            <div>
              <p className="coords text-paper/50">{m.name.toUpperCase()}</p>
              <p className="display mt-2 text-[clamp(3rem,6vw,5.4rem)] leading-none" aria-live="polite">
                {MONTHS[month - 1]}
              </p>
            </div>
            <button onClick={() => setPlaying((p) => !p)} className="btn btn-ghost btn-sm text-paper" aria-pressed={playing}>
              {playing ? <Pause size={15} /> : <Play size={15} />} {playing ? "Pause" : "Play the year"}
            </button>
          </div>

          {/* Month scrubber */}
          <div className="relative mt-8">
            <div className="grid grid-cols-12">
              {MONTHS_SHORT.map((label, i) => {
                const mo = i + 1;
                const wet = MONSOON[mo].wet;
                return (
                  <button key={label} onClick={() => { setMonth(mo); setPlaying(false); }} className="group flex flex-col items-center gap-2 pb-1" aria-label={MONTHS[i]}>
                    <span
                      className={cn(
                        "w-full border-l border-paper/20 transition-all duration-500",
                        mo === month ? "h-10 border-saffron border-l-2" : "h-5 group-hover:h-7",
                      )}
                    />
                    <span className={cn("coords transition-colors", mo === month ? "text-saffron" : "text-paper/45")}>{label[0]}</span>
                    <span className={cn("h-1 w-1 rounded-full", wet === "west" ? "bg-[#7fb3c8]" : wet === "east" ? "bg-rose" : wet === "both" ? "bg-paper/50" : "bg-saffron")} />
                  </button>
                );
              })}
            </div>
            <input
              type="range"
              min={1}
              max={12}
              value={month}
              onChange={(e) => { setMonth(Number(e.target.value)); setPlaying(false); }}
              className="absolute inset-x-0 top-0 h-10 w-full cursor-ew-resize opacity-0"
              aria-label="Month"
            />
          </div>

          <p className="mt-8 flex max-w-lg gap-3 text-paper/85">
            <CloudRain size={20} className="mt-0.5 shrink-0 text-[#9cc3d2]" />
            {m.note}
          </p>

          <div className="mt-10">
            <p className="eyebrow text-paper/50">{fallback ? `Best bets for ${MONTHS[month - 1]}` : `In season in ${MONTHS[month - 1]} · ${inSeason.length}`}</p>
            <ul className="rail -mx-[var(--gutter)] mt-4 flex gap-3 overflow-x-auto px-[var(--gutter)] pb-2">
              {inSeason.map((d) => (
                <li key={d.slug} className="shrink-0">
                  <Link
                    href={`/destinations/${d.slug}`}
                    onMouseEnter={() => setHover(d.slug)}
                    onMouseLeave={() => setHover(null)}
                    className="group flex items-center gap-3 rounded-full bg-paper/[0.07] p-1.5 pr-5 ring-1 ring-paper/10 transition hover:bg-paper hover:text-ink"
                  >
                    <span className="relative h-10 w-10 overflow-hidden rounded-full">
                      <Image src={d.heroImage} alt="" fill sizes="40px" className="object-cover" />
                    </span>
                    <span className="text-sm font-medium">{d.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right — the map */}
        <div className="relative mx-auto w-full max-w-[min(420px,58vh)]">
          <IslandBase
            label={`Map of Sri Lanka showing ${m.name} in ${MONTHS[month - 1]}`}
            under={() => (
              <>
                <defs>
                  <pattern id="rain" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(28)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke="#9cc3d2" strokeWidth="1.6" strokeLinecap="round" />
                    <animateTransform attributeName="patternTransform" type="translate" from="0 0" to="0 10" dur="0.6s" repeatCount="indefinite" additive="sum" />
                  </pattern>
                  <radialGradient id="sun-glow">
                    <stop offset="0" stopColor="#d4a046" stopOpacity="0.55" />
                    <stop offset="1" stopColor="#d4a046" stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx={sunAt[0]} cy={sunAt[1]} r={m.wet === "both" ? 0 : 330} fill="url(#sun-glow)" className="transition-all duration-1000" />
                <path d={RAIN_WEST} fill="url(#rain)" style={{ opacity: rainW * 0.55, transition: "opacity 0.8s" }} />
                <path d={RAIN_WEST} fill="#0e2230" style={{ opacity: rainW * 0.28, transition: "opacity 0.8s" }} />
                <path d={RAIN_EAST} fill="url(#rain)" style={{ opacity: rainE * 0.55, transition: "opacity 0.8s" }} />
                <path d={RAIN_EAST} fill="#0e2230" style={{ opacity: rainE * 0.28, transition: "opacity 0.8s" }} />
              </>
            )}
          >
            {() => (
              <>
                {/* Wind */}
                <g fill="none" stroke="#9cc3d2" strokeWidth="1.6" strokeLinecap="round" strokeDasharray="3 10" className="wind-flow">
                  {WIND_SW.map((d) => (
                    <path key={d} d={d} style={{ opacity: m.wet === "west" ? 0.8 : 0, transition: "opacity .8s" }} />
                  ))}
                  {WIND_NE.map((d) => (
                    <path key={d} d={d} style={{ opacity: m.wet === "east" ? 0.8 : 0, transition: "opacity .8s" }} />
                  ))}
                </g>

                {/* Pins */}
                {destinations.map((d) => {
                  const [x, y] = project(d.lat, d.lng);
                  const good = d.bestMonths.includes(month);
                  const side = LABEL_SIDE[d.slug] ?? "right";
                  const active = hover === d.slug;
                  return (
                    <Link
                      key={d.slug}
                      href={`/destinations/${d.slug}`}
                      onMouseEnter={() => setHover(d.slug)}
                      onMouseLeave={() => setHover(null)}
                      onFocus={() => setHover(d.slug)}
                      onBlur={() => setHover(null)}
                      aria-label={`${d.name}${good ? ", in season" : ""}`}
                    >
                      <g transform={`translate(${x} ${y})`} className="cursor-pointer">
                        {good && <circle r="9" className="origin-center animate-pulse-ring fill-saffron/50 [transform-box:fill-box]" />}
                        <circle r="22" fill="transparent" />
                        <circle r={active ? 10 : 7} className={cn("transition-all duration-300", good ? "fill-saffron" : "fill-tea")} stroke={good ? "#17201a" : "rgb(243 237 226 / .6)"} strokeWidth={good ? 2 : 1.5} />
                        <text
                          x={side === "right" ? 16 : -16}
                          y={5}
                          textAnchor={side === "right" ? "start" : "end"}
                          fontFamily="var(--font-mono)"
                          fontSize="14"
                          letterSpacing="1.2"
                          className={cn("uppercase transition-all duration-300", good ? "fill-paper" : "fill-paper/40", active && "fill-saffron")}
                        >
                          {d.name.split(" & ")[0]}
                        </text>
                      </g>
                    </Link>
                  );
                })}
              </>
            )}
          </IslandBase>

          {/* Hover card */}
          {hovered && (() => {
            const [x, y] = project(hovered.lat, hovered.lng);
            const left = (x / MAP_W) * 100;
            const top = (y / MAP_H) * 100;
            const flip = left > 55;
            return (
              <div
                className="pointer-events-none absolute z-10 w-56 overflow-hidden rounded-2xl bg-paper text-ink shadow-2xl"
                style={{ left: `${left}%`, top: `${top}%`, transform: `translate(${flip ? "calc(-100% - 22px)" : "22px"}, -50%)` }}
              >
                <div className="relative aspect-[16/10]">
                  <Image src={hovered.heroImage} alt="" fill sizes="224px" className="object-cover" />
                  <span className={cn("absolute left-2 top-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[0.7rem] font-semibold", hovered.bestMonths.includes(month) ? "bg-saffron text-ink" : "bg-ink/70 text-paper")}>
                    {hovered.bestMonths.includes(month) ? <Sun size={12} /> : <CloudRain size={12} />}
                    {hovered.bestMonths.includes(month) ? "In season" : "Shoulder season"}
                  </span>
                </div>
                <div className="p-3.5">
                  <p className="coords text-ink-soft">{hovered.region.toUpperCase()}</p>
                  <p className="display mt-1 text-xl">{hovered.name}</p>
                  <p className="mt-1 text-[0.82rem] leading-snug text-ink-soft">{hovered.tagline}</p>
                  <p className="mt-2 inline-flex items-center gap-1 text-[0.8rem] font-semibold text-clay">
                    Explore <ArrowUpRight size={14} />
                  </p>
                </div>
              </div>
            );
          })()}

          <div className="mt-6 flex flex-wrap justify-center gap-5 text-[0.78rem] text-paper/60">
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-saffron" /> In season</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full ring-1 ring-paper/60" /> Shoulder</span>
            <span className="inline-flex items-center gap-2"><span className="h-2.5 w-4 bg-[repeating-linear-gradient(118deg,#9cc3d2_0_2px,transparent_2px_6px)]" /> Monsoon rain</span>
          </div>
        </div>
      </div>
    </section>
  );
}
