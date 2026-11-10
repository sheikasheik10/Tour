"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const CHAPTERS = [
  {
    n: "I",
    title: "The Coast",
    temp: "29°C",
    img: "/img/mirissa-stilt.jpg",
    body: "There are surf breaks, stilt fishermen and Dutch forts all the way round, and one coast is always in season.",
    places: [["Galle Fort", "galle"], ["Mirissa", "mirissa"], ["Arugam Bay", "arugam-bay"], ["Trincomalee", "trincomalee"]],
  },
  {
    n: "II",
    title: "Ancient Kingdoms",
    temp: "31°C",
    img: "/img/sigiriya-aerial.jpg",
    body: "Two thousand years of capitals, from rock fortresses and painted caves to a temple that holds the Buddha's tooth.",
    places: [["Sigiriya", "sigiriya"], ["Kandy", "kandy"]],
  },
  {
    n: "III",
    title: "Tea Country",
    temp: "14°C",
    img: "/img/tea-pluckers.jpg",
    body: "The road climbs to cool, misty ridges covered in tea, the slowest train you will ever love, and a log fire at night.",
    places: [["Ella", "ella"], ["Nuwara Eliya", "nuwara-eliya"]],
  },
  {
    n: "IV",
    title: "The Wild",
    temp: "33°C",
    img: "/img/yala-leopard.jpg",
    body: "There are leopards on the rocks, hundreds of elephants at the reservoirs and sloth bears in the scrub. Go at dawn.",
    places: [["Yala", "yala"], ["Minneriya", "minneriya"]],
  },
];

/** Pinned horizontal scroll on desktop; a simple vertical stack on small screens. */
export function Chapters() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = section.current;
    const tr = track.current;
    if (!el || !tr) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => tr.scrollWidth - window.innerWidth;
      const tween = gsap.to(tr, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      // Parallax inside each panel, tied to the horizontal movement.
      tr.querySelectorAll<HTMLElement>("[data-parallax]").forEach((img) => {
        gsap.fromTo(img, { xPercent: -12 }, { xPercent: 12, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } });
      });
      gsap.to("[data-progress]", { scaleX: 1, ease: "none", scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, scrub: true } });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden bg-paper-2 lg:h-screen">
      <div ref={track} className="flex flex-col gap-6 py-24 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:py-0 lg:pl-[var(--gutter)] lg:pr-[12vw]">
        {/* Intro panel */}
        <div className="container-x shrink-0 lg:w-[34vw] lg:max-w-none lg:p-0">
          <p className="eyebrow text-clay">Four islands in one</p>
          <h2 className="display mt-5 text-[clamp(2.6rem,5vw,5rem)]">
            Three hours&apos; drive between <span className="display-italic">surf and frost.</span>
          </h2>
          <p className="mt-6 max-w-sm text-ink-soft">
            Sri Lanka is small enough to cross in a day, but each region feels like a different country. Here are its four moods.
          </p>
          <div className="mt-10 hidden items-center gap-3 lg:flex">
            <span className="coords text-ink-soft">SCROLL</span>
            <span className="relative h-px w-40 bg-line">
              <span data-progress className="absolute inset-0 origin-left scale-x-0 bg-ink" />
            </span>
          </div>
        </div>

        {CHAPTERS.map((c) => (
          <article key={c.n} className="group relative mx-[var(--gutter)] h-[78vh] min-h-[520px] shrink-0 overflow-hidden rounded-[2rem] bg-ink text-paper lg:mx-0 lg:h-[78vh] lg:w-[62vw] xl:w-[54vw]">
            <div className="absolute inset-[-0%_-14%]" data-parallax>
              <Image src={c.img} alt="" fill sizes="(min-width:1024px) 70vw, 100vw" className="object-cover" />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(200deg,transparent_30%,rgb(16_22_18/0.85))]" />
            <div className="relative flex h-full flex-col justify-between p-7 md:p-10">
              <div className="flex items-start justify-between">
                <span className="display-italic text-[clamp(4rem,9vw,8rem)] leading-none text-paper/90">{c.n}</span>
                <span className="coords rounded-full bg-ink/40 px-3 py-1.5 backdrop-blur">AVG {c.temp}</span>
              </div>
              <div className="max-w-xl">
                <h3 className="display text-[clamp(2.2rem,4.2vw,4rem)]">{c.title}</h3>
                <p className="mt-4 max-w-md text-paper/80">{c.body}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {c.places.map(([name, slug]) => (
                    <Link key={slug} href={`/destinations/${slug}`} className="inline-flex items-center gap-1.5 rounded-full bg-paper/12 px-4 py-2 text-sm backdrop-blur-md ring-1 ring-paper/20 transition hover:bg-paper hover:text-ink">
                      {name} <ArrowUpRight size={14} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
