"use client";

import { useEffect, useState } from "react";
import { ISLAND_PATH, MAP_H, MAP_W } from "@/lib/map";

let played = false; // once per full page load

/** Opening curtain: the island draws itself, the name rises, the curtain lifts. */
export function Intro() {
  const [show, setShow] = useState(() => !played);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (!show) return;
    played = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.__lenis?.stop();
    const t1 = setTimeout(() => setLeaving(true), reduce ? 0 : 1900);
    const t2 = setTimeout(() => {
      setShow(false);
      window.__lenis?.start();
    }, reduce ? 50 : 2900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.__lenis?.start();
    };
  }, [show]);

  if (!show) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[70] grid place-items-center bg-tea text-paper transition-[clip-path] duration-1000 ease-[var(--ease-in-out-quart)]"
      style={{ clipPath: leaving ? "inset(0 0 100% 0)" : "inset(0 0 0 0)" }}
    >
      <div className="flex flex-col items-center gap-6">
        <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="h-[34vh] w-auto">
          <path d={ISLAND_PATH} fill="none" stroke="currentColor" strokeWidth={2.4} pathLength={1} className="intro-draw" />
          <path d={ISLAND_PATH} className="intro-fill fill-paper/10" />
        </svg>
        <div className="overflow-hidden">
          <p className="display-italic intro-word text-[clamp(2.4rem,6vw,4rem)] leading-none">Serendib</p>
        </div>
        <p className="coords intro-fade text-paper/60">7.873°N 80.771°E</p>
      </div>
      <style>{`
        .intro-draw { stroke-dasharray: 1; stroke-dashoffset: 1; animation: intro-draw 1.6s cubic-bezier(.65,0,.35,1) forwards; }
        .intro-fill { opacity: 0; animation: soft-rise .8s 1.1s ease forwards; }
        .intro-word { animation: line-rise 1s .5s cubic-bezier(.16,1,.3,1) both; }
        .intro-fade { animation: soft-rise 1s .8s cubic-bezier(.16,1,.3,1) both; }
        @keyframes intro-draw { to { stroke-dashoffset: 0; } }
      `}</style>
    </div>
  );
}
