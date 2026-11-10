"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { cn } from "@/lib/format";

const SLIDES = [
  {
    slug: "sigiriya",
    img: "/img/sigiriya-aerial.jpg",
    place: "Sigiriya",
    chapter: "Ancient Kingdoms",
    coords: "7.957°N  80.760°E",
    lines: ["Climb the lion's rock", "at first light."],
    body: "A fifth-century sky palace above a forest full of elephants. Get to the gate before sunrise.",
  },
  {
    slug: "ella",
    img: "/img/ella-nine-arches.jpg",
    place: "Ella",
    chapter: "Tea Country",
    coords: "6.867°N  81.047°E",
    lines: ["Wait for the blue train", "on the ninth arch."],
    body: "Seven hours of tea, tunnels and cloud forest, then a valley that's best seen from a hammock.",
  },
  {
    slug: "mirissa",
    img: "/img/mirissa-stilt.jpg",
    place: "Mirissa",
    chapter: "The Coast",
    coords: "5.948°N  80.472°E",
    lines: ["Slow down with the", "stilt fishermen."],
    body: "Crescent bays, warm surf and blue whales offshore, from December to April.",
  },
  {
    slug: "yala",
    img: "/img/yala-leopard.jpg",
    place: "Yala",
    chapter: "The Wild",
    coords: "6.373°N  81.519°E",
    lines: ["Meet the island's", "quietest resident."],
    body: "No park on Earth has more leopards. Go out at dawn with a tracker who knows each one by name.",
  },
];

const DURATION = 8000;

export function Hero({ destinations }: { destinations: { slug: string; name: string }[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const layers = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);
  const root = useRef<HTMLElement>(null);
  const busy = useRef(false);
  const progress = useRef<HTMLSpanElement>(null);

  const n = SLIDES.length;
  const upcoming = [1, 2, 3].map((k) => (index + k) % n);

  /** Grow the incoming slide out of the card that was clicked. */
  const goTo = useCallback(
    (next: number, fromCard?: HTMLElement | null) => {
      if (busy.current || next === index) return;
      const incoming = layers.current[next];
      const host = root.current;
      if (!incoming || !host) return setIndex(next);
      busy.current = true;

      const h = host.getBoundingClientRect();
      const r = fromCard?.getBoundingClientRect();
      const from = r
        ? `inset(${r.top - h.top}px ${h.right - r.right}px ${h.bottom - r.bottom}px ${r.left - h.left}px round 18px)`
        : "inset(0px 0px 0px 100% round 0px)";

      layers.current.forEach((l, i) => l && gsap.set(l, { zIndex: i === next ? 3 : i === index ? 2 : 1 }));
      const img = incoming.querySelector("img");
      gsap.fromTo(incoming, { clipPath: from }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 1.25, ease: "expo.inOut", onComplete: () => void (busy.current = false) });
      if (img) gsap.fromTo(img, { scale: 1.35 }, { scale: 1.08, duration: 1.6, ease: "expo.out" });
      setIndex(next);
    },
    [index],
  );

  // Autoplay with a visible progress line.
  useEffect(() => {
    if (paused) return;
    const bar = progress.current;
    const tween = bar ? gsap.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: DURATION / 1000, ease: "none" }) : null;
    const t = setTimeout(() => goTo((index + 1) % n, cards.current[(index + 1) % n]), DURATION);
    return () => {
      clearTimeout(t);
      tween?.kill();
    };
  }, [index, paused, goTo, n]);

  // Slow drift on the active image.
  useEffect(() => {
    const img = layers.current[index]?.querySelector("img");
    if (!img) return;
    const t = gsap.to(img, { scale: 1, duration: DURATION / 1000 + 2, ease: "none" });
    return () => void t.kill();
  }, [index]);

  const s = SLIDES[index];

  return (
    <section
      ref={root}
      className="relative isolate flex min-h-[max(100svh,760px)] flex-col overflow-hidden bg-ink text-paper"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured places"
    >
      {/* Background layers */}
      {SLIDES.map((sl, i) => (
        <div
          key={sl.slug}
          ref={(el) => void (layers.current[i] = el)}
          className="absolute inset-0 -z-10"
          style={{ zIndex: i === 0 ? 2 : 1 }}
          aria-hidden={i !== index}
        >
          <Image src={sl.img} alt="" fill priority={i === 0} sizes="100vw" className="scale-[1.08] object-cover" />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[linear-gradient(180deg,rgb(16_22_18/0.55)_0%,rgb(16_22_18/0.05)_28%,rgb(16_22_18/0.15)_55%,rgb(16_22_18/0.88)_100%)]" />
      <div className="pointer-events-none absolute inset-0 z-[5] bg-[radial-gradient(90%_70%_at_0%_100%,rgb(16_22_18/0.75),transparent_60%)]" />

      {/* Giant wordmark (after the StayGo reference): sits in the sky, behind the text */}
      <p
        aria-hidden="true"
        className="display pointer-events-none absolute inset-x-0 top-[calc(var(--header-h)+0.5vh)] z-[6] select-none text-center text-[clamp(5rem,21vw,22rem)] leading-[0.8] text-paper/[0.16] [-webkit-text-stroke:1px_rgb(243_237_226/0.35)]"
      >
        Serendib
      </p>

      <div className="container-x relative z-10 mt-auto grid gap-10 pb-6 pt-[calc(var(--header-h)+6rem)] lg:grid-cols-[1.25fr_1fr] lg:items-end">
        {/* Copy */}
        <div key={index} className="min-w-0">
          <p className="hero-rise flex items-center gap-3 text-paper/80" style={{ animationDelay: "0.25s" }}>
            <span className="h-px w-10 bg-saffron" />
            <span className="eyebrow">{s.chapter}</span>
            <span className="coords hidden text-paper/70 sm:inline">· {s.coords}</span>
          </p>
          <h1 className="display mt-5 text-[clamp(2.7rem,6.3vw,6.2rem)] lg:w-[min(72rem,88vw)] lg:whitespace-nowrap">
            {s.lines.map((l, i) => (
              <span key={l} className="block overflow-hidden pb-[0.08em]">
                <span className="hero-line block" style={{ animationDelay: `${0.35 + i * 0.09}s` }}>
                  {i === s.lines.length - 1 ? <span className="display-italic">{l}</span> : l}
                </span>
              </span>
            ))}
          </h1>
          <p className="hero-rise mt-6 max-w-md text-[1.05rem] text-paper/80" style={{ animationDelay: "0.6s" }}>
            {s.body}
          </p>
          <div className="hero-rise mt-8 flex flex-wrap gap-3" style={{ animationDelay: "0.7s" }}>
            <Link href={`/destinations/${s.slug}`} className="btn btn-paper">
              Explore {s.place} <ArrowUpRight size={18} />
            </Link>
            <Link href="/journey" className="btn btn-ghost text-paper">
              Plan a journey
            </Link>
          </div>
        </div>

        {/* Upcoming cards + controls (Beyond Miles-style rail) */}
        <div className="hidden lg:block">
          <div className="flex justify-end gap-3">
            {upcoming.map((i, k) => (
              <button
                key={SLIDES[i].slug}
                ref={(el) => void (cards.current[i] = el)}
                onClick={(e) => goTo(i, e.currentTarget)}
                className="group relative aspect-[3/4] w-[clamp(7rem,10vw,9.5rem)] overflow-hidden rounded-[18px] text-left ring-1 ring-paper/25 transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-2"
                style={{ transitionDelay: `${k * 40}ms` }}
                aria-label={`Show ${SLIDES[i].place}`}
              >
                <Image src={SLIDES[i].img} alt="" fill sizes="160px" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent" />
                <span className="absolute inset-x-3 bottom-3">
                  <span className="coords block text-paper/60">0{i + 1}</span>
                  <span className="display text-xl">{SLIDES[i].place}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-4">
            <button onClick={() => goTo((index - 1 + n) % n)} className="grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-paper/40 transition hover:bg-paper hover:text-ink" aria-label="Previous">
              <ArrowLeft size={18} />
            </button>
            <button onClick={() => goTo((index + 1) % n, cards.current[(index + 1) % n])} className="grid h-11 w-11 shrink-0 place-items-center rounded-full ring-1 ring-paper/40 transition hover:bg-paper hover:text-ink" aria-label="Next">
              <ArrowRight size={18} />
            </button>
            <span className="relative h-px flex-1 bg-paper/25">
              <span ref={progress} className="absolute inset-0 origin-left bg-paper" />
            </span>
            <span className="display tabular-nums text-[2.6rem] leading-none">
              0{index + 1}
              <span className="text-base text-paper/50"> / 0{n}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile dots */}
      <div className="container-x relative z-10 flex gap-2 pb-4 lg:hidden">
        {SLIDES.map((sl, i) => (
          <button key={sl.slug} onClick={() => goTo(i)} className={cn("h-1 flex-1 rounded-full transition-colors", i === index ? "bg-paper" : "bg-paper/30")} aria-label={`Show ${sl.place}`} />
        ))}
      </div>

      <div className="container-x relative z-10 pb-8">
        <SearchBar destinations={destinations} tone="glass" />
      </div>
    </section>
  );
}
