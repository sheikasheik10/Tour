"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { cn } from "@/lib/format";

const NAV = [
  { href: "/stays", label: "Stays", img: "/img/villa-twilight.jpg" },
  { href: "/experiences", label: "Experiences", img: "/img/yala-leopard.jpg" },
  { href: "/destinations", label: "Destinations", img: "/img/sigiriya-aerial.jpg" },
  { href: "/journey", label: "Plan a journey", img: "/img/ella-nine-arches.jpg" },
];

export function Header() {
  const pathname = usePathname();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);

  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      if (y > 240 && y > last + 2) setHidden(true);
      else if (y < last - 2 || y <= 240) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu on navigation; lock scroll while it's open.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) window.__lenis?.stop();
    else window.__lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-[transform,background-color,color,box-shadow] duration-500 ease-[var(--ease-out-expo)]",
          hidden && !open ? "-translate-y-full" : "translate-y-0",
          solid && !open ? "bg-paper/85 text-ink shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl" : "bg-transparent text-paper",
        )}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="Serendib home" className="relative z-10">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={cn("link-underline text-[0.92rem] font-medium", pathname.startsWith(n.href) && "bg-[length:100%_1px]")}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/trips" className="link-underline hidden text-[0.92rem] font-medium sm:inline">
              My trips
            </Link>
            <Link href="/stays" className={cn("btn btn-sm hidden sm:inline-flex", solid ? "" : "btn-paper")}>
              Book a stay
            </Link>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="relative z-10 grid h-11 w-11 place-items-center rounded-full ring-1 ring-current/30 lg:hidden"
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen menu (mobile / tablet) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-tea text-paper transition-[clip-path] duration-700 ease-[var(--ease-in-out-quart)] lg:hidden",
          open ? "[clip-path:inset(0_0_0_0)]" : "pointer-events-none [clip-path:inset(0_0_100%_0)]",
        )}
        aria-hidden={!open}
      >
        <div className="absolute inset-0 opacity-25">
          {NAV.map((n, i) => (
            <Image key={n.href} src={n.img} alt="" fill sizes="100vw" className={cn("object-cover transition-opacity duration-700", hover === i ? "opacity-100" : "opacity-0")} />
          ))}
        </div>
        <div className="container-x relative flex h-full flex-col justify-between pb-10 pt-[calc(var(--header-h)+3rem)]">
          <ul className="space-y-2">
            {NAV.map((n, i) => (
              <li key={n.href} className="overflow-hidden pb-[0.14em]">
                <Link
                  href={n.href}
                  onMouseEnter={() => setHover(i)}
                  onFocus={() => setHover(i)}
                  className={cn(
                    "display flex items-baseline gap-4 text-[clamp(2.6rem,11vw,5rem)] transition-transform duration-700 ease-[var(--ease-out-expo)]",
                    open ? "translate-y-0" : "translate-y-full",
                  )}
                  style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
                >
                  <span className="coords text-saffron">0{i + 1}</span>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/20 pt-6">
            <Link href="/trips" className="inline-flex items-center gap-2 text-lg">
              My trips <ArrowUpRight size={18} />
            </Link>
            <span className="coords text-paper/60">7.873°N 80.771°E · SRI LANKA</span>
          </div>
        </div>
      </div>
    </>
  );
}
