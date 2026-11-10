import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, MapPin, Star } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { StayBooking } from "@/components/stays/StayBooking";
import { Ticket } from "@/components/Ticket";
import { BestMonths } from "@/components/BestMonths";
import { IslandBase } from "@/components/map/IslandBase";
import { project } from "@/lib/geo";
import { coords } from "@/lib/format";
import { getExperiences, getStay } from "@/lib/queries";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type SP = Promise<Record<string, string | string[] | undefined>>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const stay = await getStay((await params).slug);
  return stay ? { title: stay.name, description: stay.summary } : {};
}

export default async function StayPage({ params, searchParams }: { params: Params; searchParams: SP }) {
  const { slug } = await params;
  const sp = await searchParams;
  const stay = await getStay(slug);
  if (!stay) notFound();
  const nearby = await getExperiences({ destination: stay.destination.slug });
  const str = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const [x, y] = project(stay.destination.lat, stay.destination.lng);

  const intro = (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-ink-soft">
        <span className="inline-flex items-center gap-1.5">
          <Star size={16} className="fill-saffron text-saffron" /> <b className="text-ink">{stay.rating.toFixed(1)}</b> · {stay.reviewCount} reviews
        </span>
        <Link href={`/destinations/${stay.destination.slug}`} className="link-underline inline-flex items-center gap-1.5">
          <MapPin size={16} /> {stay.destination.name}
        </Link>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={16} /> In {stay.checkInTime} · Out {stay.checkOutTime}
        </span>
      </div>
      <p className="display mt-10 text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.25]">{stay.summary}</p>
      <p className="mt-6 max-w-2xl text-[1.05rem] leading-relaxed text-ink-soft">{stay.description}</p>

      <h2 className="eyebrow mt-14 text-ink-soft">What&apos;s here</h2>
      <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        {stay.amenities.map((a) => (
          <li key={a} className="flex items-center gap-3 border-b border-line pb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-clay" /> {a}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <>
      <PageHero
        size="lg"
        image={stay.images[0]}
        eyebrow={`${stay.category} · ${stay.destination.name}`}
        title={stay.name}
        intro={<span className="coords text-paper/70">{coords(stay.destination.lat, stay.destination.lng)}</span>}
      />

      {/* Gallery strip */}
      <section className="bg-paper pt-4">
        <div className="container-x grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...stay.images.slice(1), ...stay.rooms.map((r) => r.image)].slice(0, 4).map((src, i) => (
            <div key={`${src}-${i}`} className="zoom-img relative aspect-[4/3] overflow-hidden rounded-[1.1rem]">
              <Image src={src} alt="" fill sizes="(min-width:768px) 25vw, 50vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-paper pb-24 pt-16 md:pb-32">
        <div className="container-x">
          <StayBooking
            stay={{ id: stay.id, name: stay.name, checkInTime: stay.checkInTime, checkOutTime: stay.checkOutTime }}
            rooms={stay.rooms.map((r) => ({ id: r.id, name: r.name, description: r.description, image: r.image, sleeps: r.sleeps, bed: r.bed, sizeSqm: r.sizeSqm, price: r.price }))}
            initial={{ checkIn: str("checkIn"), checkOut: str("checkOut"), guests: Number(str("guests")) || undefined }}
            intro={intro}
          />
        </div>
      </section>

      {/* Where & when */}
      <section className="bg-paper-2 py-24">
        <div className="container-x grid items-center gap-14 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr]">
          <IslandBase tone="light" graticule={false} className="mx-auto max-w-[280px]">
            {() => (
              <g transform={`translate(${x} ${y})`}>
                <circle r="16" className="origin-center animate-pulse-ring fill-clay/40 [transform-box:fill-box]" />
                <circle r="10" fill="var(--color-clay)" stroke="#fff" strokeWidth="3" />
              </g>
            )}
          </IslandBase>
          <div>
            <p className="eyebrow text-clay">Where & when</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">{stay.destination.name}</h2>
            <p className="mt-3 max-w-xl text-ink-soft">{stay.destination.tagline}</p>
            <p className="eyebrow mt-10 text-ink-soft">Best months to visit</p>
            <BestMonths months={stay.destination.bestMonths} className="mt-4 max-w-xl" />
            <Link href={`/destinations/${stay.destination.slug}`} className="btn btn-ghost mt-10">
              About {stay.destination.name} <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {nearby.length > 0 && (
        <section className="bg-paper py-24">
          <div className="container-x">
            <p className="eyebrow text-clay">While you&apos;re here</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4vw,3.4rem)]">
              Things to do <span className="display-italic">nearby</span>
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {nearby.map((e) => (
                <Ticket key={e.id} exp={e} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
