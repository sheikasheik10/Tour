import Link from "next/link";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const COLS = [
  {
    title: "Book",
    links: [
      ["Stays", "/stays"],
      ["Experiences", "/experiences"],
      ["Plan a journey", "/journey"],
      ["My trips", "/trips"],
    ],
  },
  {
    title: "Explore",
    links: [
      ["Sigiriya", "/destinations/sigiriya"],
      ["Ella", "/destinations/ella"],
      ["Galle Fort", "/destinations/galle"],
      ["Yala", "/destinations/yala"],
      ["All destinations", "/destinations"],
    ],
  },
  {
    title: "By mood",
    links: [
      ["Wildlife", "/experiences?category=Wildlife"],
      ["Rail & hike", "/experiences?category=Rail+%26+Hike"],
      ["Ocean", "/experiences?category=Ocean"],
      ["Food & tea", "/experiences?category=Food+%26+Tea"],
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-paper">
      <div className="container-x pb-10 pt-24 md:pt-32">
        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow text-saffron">Letters from the island</p>
            <h2 className="display mt-5 max-w-[14ch] text-[clamp(2.4rem,5vw,4.2rem)]">
              One letter a month, written <span className="display-italic text-rose">from somewhere</span> on the island.
            </h2>
            <NewsletterForm />
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLS.map((c) => (
              <div key={c.title}>
                <p className="eyebrow text-paper/50">{c.title}</p>
                <ul className="mt-5 space-y-3">
                  {c.links.map(([label, href]) => (
                    <li key={href}>
                      <Link href={href} className="link-underline text-paper/85 hover:text-paper">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* The greeting: Ayubowan, "may you live long" */}
        <div className="relative mt-24 select-none border-t border-paper/15 pt-10" aria-label="Ayubowan — may you live long">
          <p
            lang="si"
            className="text-center font-[family-name:var(--font-sinhala)] text-[clamp(3.6rem,15vw,15rem)] font-semibold leading-[1.15] text-paper/[0.11]"
            aria-hidden="true"
          >
            ආයුබෝවන්
          </p>
          <p className="absolute inset-x-0 top-1/2 mt-4 -translate-y-1/2 text-center">
            <span className="display-italic text-[clamp(1.6rem,4vw,3rem)] text-paper">Ayubowan.</span>
            <span className="eyebrow mt-2 block text-paper/60">May you live long</span>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-6 border-t border-paper/15 pt-8 text-sm text-paper/55 md:flex-row md:items-center">
          <Logo className="text-paper" />
          <p>© {new Date().getFullYear()} Serendib Journeys · Colombo, Sri Lanka</p>
          <p className="coords">PHOTOGRAPHY VIA UNSPLASH</p>
        </div>
      </div>
    </footer>
  );
}
