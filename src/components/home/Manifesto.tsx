"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Text, with inline photo "pills" between words: [img:path] tokens.
const TEXT =
  "Persian sailors called this island Serendib, and English gave us serendipity: [img:/img/elephants-lake.jpg] finding something wonderful you weren't looking for. We plan journeys with room for that to happen. A leopard on the morning road, [img:/img/food-leaf.jpg] lunch in a stranger's kitchen, [img:/img/ella-train-door.jpg] a train that takes its time.";

const STATS = [
  ["8", "UNESCO World Heritage sites"],
  ["2", "monsoons, so there's always a sunny coast"],
  ["1,340", "km of coastline"],
  ["3 hrs", "between surf and frost"],
];

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(el.querySelectorAll(".reveal-word"), {
        opacity: 1,
        stagger: 0.1,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 45%", scrub: 0.6 },
      });
      gsap.from(el.querySelectorAll(".pill"), {
        width: 0,
        stagger: 0.25,
        ease: "expo.out",
        duration: 1.2,
        scrollTrigger: { trigger: el, start: "top 70%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const tokens = TEXT.split(" ");

  return (
    <section className="relative bg-paper py-28 md:py-40">
      <div className="container-x">
        <div className="mb-12 flex items-center gap-4">
          <span className="eyebrow text-clay">Serendipity, n.</span>
          <span className="h-px flex-1 bg-line" />
          <span className="coords text-ink-soft">EST. ON AN ISLAND</span>
        </div>
        <div ref={ref}>
          <p className="display max-w-[22ch] text-[clamp(2rem,4.6vw,4.4rem)] leading-[1.08]" style={{ maxWidth: "26ch" }}>
            {tokens.map((t, i) => {
              if (t.startsWith("[img:")) {
                const src = t.slice(5, -1);
                return (
                  <span key={i} className="pill relative mx-[0.12em] inline-block h-[0.82em] w-[1.9em] translate-y-[0.08em] overflow-hidden rounded-full align-baseline">
                    <Image src={src} alt="" fill sizes="160px" className="object-cover" />
                  </span>
                );
              }
              const italic = ["serendipity:", "Serendib,"].includes(t);
              return (
                <span key={i} className={`reveal-word ${italic ? "display-italic text-clay" : ""}`}>
                  {t}{" "}
                </span>
              );
            })}
          </p>
        </div>

        <dl className="mt-24 grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
          {STATS.map(([k, v]) => (
            <div key={v}>
              <dt className="display text-[clamp(2.4rem,4vw,3.6rem)] text-tea">{k}</dt>
              <dd className="mt-2 max-w-[18ch] text-ink-soft">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
