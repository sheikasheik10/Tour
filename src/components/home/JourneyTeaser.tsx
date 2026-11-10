"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Plane } from "lucide-react";
import { IslandBase } from "@/components/map/IslandBase";
import { AIRPORT, project, smoothPath } from "@/lib/geo";

gsap.registerPlugin(ScrollTrigger);

const STOPS = [
  { name: "Arrive", lat: AIRPORT.lat, lng: AIRPORT.lng, nights: 0 },
  { name: "Sigiriya", lat: 7.957, lng: 80.7603, nights: 3 },
  { name: "Kandy", lat: 7.2906, lng: 80.6337, nights: 2 },
  { name: "Nuwara Eliya", lat: 6.9497, lng: 80.7891, nights: 2 },
  { name: "Ella", lat: 6.8667, lng: 81.0466, nights: 2 },
  { name: "Yala", lat: 6.3725, lng: 81.5185, nights: 2 },
  { name: "Mirissa", lat: 5.9483, lng: 80.4716, nights: 3 },
  { name: "Galle", lat: 6.0329, lng: 80.2168, nights: 2 },
];

const PTS = STOPS.map((s) => project(s.lat, s.lng));
const ROUTE = smoothPath(PTS, 0.7);

export function JourneyTeaser() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const path = el.querySelector<SVGPathElement>("[data-route]");
    const stops = el.querySelectorAll("[data-stop]");
    const items = el.querySelectorAll("[data-item]");
    if (!path) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const len = path.getTotalLength();
    const ctx = gsap.context(() => {
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 65%", end: "bottom 70%", scrub: 0.8 } });
      tl.to(path, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      stops.forEach((s, i) => tl.from(s, { scale: 0, transformOrigin: "center", duration: 0.06, ease: "back.out(3)" }, (i / (stops.length - 1)) * 0.95));
      items.forEach((s, i) => tl.from(s, { opacity: 0.15, x: -10, duration: 0.08 }, (i / (items.length - 1)) * 0.95));
    }, el);
    return () => ctx.revert();
  }, []);

  const total = STOPS.reduce((n, s) => n + s.nights, 0);

  return (
    <section className="bg-paper py-24 md:py-36">
      <div ref={ref} className="container-x grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
        <div className="order-2 lg:order-1">
          <p className="eyebrow text-clay">Made to measure</p>
          <h2 className="display mt-5 text-[clamp(2.6rem,5vw,4.8rem)]">
            Draw your route. <span className="display-italic">We&apos;ll do the rest.</span>
          </h2>
          <p className="mt-6 max-w-md text-ink-soft">
            Tap places on the map, set how many nights you want in each, and our team in Colombo will send back a costed itinerary with drivers,
            train seats and stays, usually within a day.
          </p>

          <ol className="mt-10 max-w-md">
            {STOPS.map((s, i) => (
              <li key={s.name} data-item className="flex items-center gap-4 border-b border-line py-3">
                <span className="coords w-6 text-ink-soft">{String(i).padStart(2, "0")}</span>
                <span className="flex-1 font-medium">
                  {i === 0 ? (
                    <span className="inline-flex items-center gap-2">
                      <Plane size={15} /> Colombo airport
                    </span>
                  ) : (
                    s.name
                  )}
                </span>
                <span className="coords text-ink-soft">{s.nights ? `${s.nights} NIGHTS` : "DAY 1"}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/journey" className="btn btn-clay">
              Open the journey builder <ArrowRight size={18} />
            </Link>
            <span className="text-sm text-ink-soft">The Classic: {total} nights</span>
          </div>
        </div>

        <div className="order-1 mx-auto w-full max-w-[460px] lg:order-2">
          <IslandBase tone="light" label="The Classic route around Sri Lanka">
            {() => (
              <g>
                <path d={ROUTE} fill="none" stroke="rgb(23 32 26 / .14)" strokeWidth="3" strokeDasharray="1 8" strokeLinecap="round" />
                <path data-route d={ROUTE} fill="none" stroke="var(--color-clay)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                {PTS.map(([x, y], i) => (
                  <g key={i} data-stop transform={`translate(${x} ${y})`}>
                    <circle r={i === 0 ? 11 : 13} fill={i === 0 ? "var(--color-ink)" : "var(--color-paper)"} stroke="var(--color-clay)" strokeWidth="2.5" />
                    <text textAnchor="middle" y="4.5" fontSize="12" fontFamily="var(--font-mono)" fontWeight="600" fill={i === 0 ? "var(--color-paper)" : "var(--color-ink)"}>
                      {i === 0 ? "✈" : i}
                    </text>
                  </g>
                ))}
              </g>
            )}
          </IslandBase>
        </div>
      </div>
    </section>
  );
}
