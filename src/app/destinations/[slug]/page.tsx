import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { BestMonths } from "@/components/BestMonths";
import { StayCard } from "@/components/StayCard";
import { Ticket } from "@/components/Ticket";
import { Reveal } from "@/components/Reveal";
import { coords, seasonRange } from "@/lib/format";
import { getDestination, getDestinations } from "@/lib/queries";

export const dynamic = "force-dynamic";
type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const d = await getDestination((await params).slug);
  return d ? { title: d.name, description: d.tagline } : {};
}

export default async function DestinationPage({ params }: { params: Params }) {
  const { slug } = await params;
  const [d, all] = await Promise.all([getDestination(slug), getDestinations()]);
  if (!d) notFound();
  const i = all.findIndex((x) => x.slug === slug);
  const next = all[(i + 1) % all.length];
  const range = seasonRange(d.bestMonths);

  return (
    <>
      <PageHero size="lg" image={d.heroImage} eyebrow={`${d.region} · ${coords(d.lat, d.lng)}`} title={d.name} intro={d.tagline} />

      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1.3fr_1fr] lg:gap-24">
          <div>
            <p className="display text-[clamp(1.7rem,2.8vw,2.5rem)] leading-[1.25]">{d.description}</p>
            <ul className="mt-12 flex flex-wrap gap-2">
              {d.highlights.map((h) => (
                <li key={h} className="chip">
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-[1.8rem] bg-paper-2 p-7 lg:self-start">
            <p className="eyebrow text-clay">When to go</p>
            <p className="display mt-3 text-[1.8rem]">{d.coast === "east" ? "East-coast season" : d.coast === "west" ? "South-west season" : "Best months"}</p>
            {range && <p className="mt-1 text-ink-soft">Mostly {range}</p>}
            <BestMonths months={d.bestMonths} className="mt-6" />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={`/stays?destination=${d.slug}`} className="btn btn-sm">
                Stays here <ArrowRight size={15} />
              </Link>
              <Link href="/journey" className="btn btn-ghost btn-sm">
                Add to a journey
              </Link>
            </div>
          </div>
        </div>

        {/* Gallery mosaic */}
        <div className="container-x mt-20 grid auto-rows-[220px] grid-cols-2 gap-3 md:auto-rows-[260px] md:grid-cols-4">
          {d.gallery.map((src, k) => (
            <Reveal key={src} delay={k * 80} className={k === 0 ? "col-span-2 row-span-2" : k === 3 ? "col-span-2" : ""}>
              <div className="zoom-img relative h-full overflow-hidden rounded-[1.2rem]">
                <Image src={src} alt="" fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {d.stays.length > 0 && (
        <section className="bg-paper-2 py-24">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="display text-[clamp(2.2rem,4vw,3.6rem)]">
                Where to <span className="display-italic">stay</span>
              </h2>
              <Link href={`/stays?destination=${d.slug}`} className="btn btn-ghost">
                Check dates <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {d.stays.map((s) => (
                <StayCard key={s.id} stay={s} />
              ))}
            </div>
          </div>
        </section>
      )}

      {d.experiences.length > 0 && (
        <section className="bg-paper py-24">
          <div className="container-x">
            <h2 className="display text-[clamp(2.2rem,4vw,3.6rem)]">
              What to <span className="display-italic">do</span>
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {d.experiences.map((e) => (
                <Ticket key={e.id} exp={e} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next destination */}
      <Link href={`/destinations/${next.slug}`} className="group relative isolate block overflow-hidden bg-ink py-28 text-paper">
        <Image src={next.heroImage} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-50 transition-transform duration-[2s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-paper/70">Next stop</p>
            <p className="display mt-4 text-[clamp(3rem,8vw,7rem)]">{next.name}</p>
          </div>
          <span className="grid h-20 w-20 place-items-center rounded-full bg-paper text-ink transition-transform duration-700 group-hover:rotate-[-45deg]">
            <ArrowRight size={28} />
          </span>
        </div>
      </Link>
    </>
  );
}
