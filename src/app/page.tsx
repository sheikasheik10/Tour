import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { Manifesto } from "@/components/home/Manifesto";
import { MonsoonMap } from "@/components/home/MonsoonMap";
import { Chapters } from "@/components/home/Chapters";
import { JourneyTeaser } from "@/components/home/JourneyTeaser";
import { Postcards } from "@/components/home/Postcards";
import { StayCard } from "@/components/StayCard";
import { Ticket } from "@/components/Ticket";
import { Reveal } from "@/components/Reveal";
import { getDestinations, getExperiences, getStays } from "@/lib/queries";

export const dynamic = "force-dynamic";

const MARQUEE = ["Sigiriya", "Ella", "Galle Fort", "Yala", "Mirissa", "Kandy", "Trincomalee", "Arugam Bay", "Nuwara Eliya", "Minneriya"];

export default async function Home() {
  const [destinations, stays, experiences] = await Promise.all([getDestinations(), getStays({ featured: true }), getExperiences({ featured: true })]);
  const month = new Date().getUTCMonth() + 1;
  const [lead, ...rest] = stays;

  return (
    <>
      <Intro />
      <Hero destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))} />

      {/* Place-name ribbon */}
      <div className="overflow-hidden border-b border-line bg-paper py-5" aria-hidden="true">
        <div className="marquee">
          {[...MARQUEE, ...MARQUEE].map((p, i) => (
            <span key={i} className="display flex items-center gap-8 pr-8 text-[1.8rem] text-ink/80">
              {i % 2 ? <span className="display-italic">{p}</span> : p}
              <svg viewBox="0 0 20 20" className="h-4 w-4 text-clay" fill="currentColor"><path d="M10 0l2.4 7.6L20 10l-7.6 2.4L10 20l-2.4-7.6L0 10l7.6-2.4z" /></svg>
            </span>
          ))}
        </div>
      </div>

      <Manifesto />

      <MonsoonMap
        initialMonth={month}
        destinations={destinations.map((d) => ({
          slug: d.slug,
          name: d.name,
          region: d.region,
          tagline: d.tagline,
          lat: d.lat,
          lng: d.lng,
          bestMonths: d.bestMonths,
          heroImage: d.heroImage,
        }))}
      />

      {/* Featured stays */}
      <section className="bg-paper py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-clay">Places to stay</p>
              <h2 className="display mt-5 max-w-[15ch] text-[clamp(2.6rem,5vw,4.8rem)]">
                Rooms with a <span className="display-italic">point of view.</span>
              </h2>
            </div>
            <div className="max-w-sm">
              <p className="text-ink-soft">
                We visit every place before it&apos;s listed, from tree-top suites at Sigiriya to a planter&apos;s bungalow in the tea. Book direct, with free changes up
                to 14 days before.
              </p>
              <Link href="/stays" className="btn mt-6">
                All stays <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-16 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-4">
            {lead && (
              <Reveal className="flex flex-col md:col-span-2 lg:row-span-2 [&>a]:flex-1">
                <StayCard stay={lead} size="lg" />
              </Reveal>
            )}
            {rest.slice(0, 4).map((s, i) => (
              <Reveal key={s.id} delay={i * 90}>
                <StayCard stay={s} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Chapters />

      {/* Experiences as tickets */}
      <section className="bg-paper py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-clay">Experiences</p>
              <h2 className="display mt-5 max-w-[16ch] text-[clamp(2.6rem,5vw,4.8rem)]">
                Your ticket to <span className="display-italic">the good stuff.</span>
              </h2>
            </div>
            <Link href="/experiences" className="btn btn-ghost">
              All experiences <ArrowUpRight size={18} />
            </Link>
          </div>
          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {experiences.slice(0, 6).map((e, i) => (
              <Reveal key={e.id} delay={(i % 3) * 90}>
                <Ticket exp={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <JourneyTeaser />
      <Postcards />

      {/* Final call */}
      <section className="relative isolate overflow-hidden bg-ink py-32 text-paper md:py-44">
        <Image src="/img/tea-pluckers.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/30 to-ink/50" />
        <div className="container-x text-center">
          <p className="eyebrow text-saffron">Whenever you&apos;re ready</p>
          <h2 className="display mx-auto mt-6 max-w-[16ch] text-[clamp(3rem,7vw,6.8rem)]">
            The island is <span className="display-italic">waiting for you.</span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link href="/stays" className="btn btn-paper">
              Find a stay <ArrowRight size={18} />
            </Link>
            <Link href="/journey" className="btn btn-ghost text-paper">
              Plan the whole journey
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
