import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, MapPin, Star, Sunrise, Users } from "lucide-react";
import { ExperienceBooking } from "@/components/experiences/ExperienceBooking";
import { StayCard } from "@/components/StayCard";
import { getExperience, getStays } from "@/lib/queries";

export const dynamic = "force-dynamic";
type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const e = await getExperience((await params).slug);
  return e ? { title: e.title, description: e.summary } : {};
}

export default async function ExperiencePage({ params }: { params: Params }) {
  const exp = await getExperience((await params).slug);
  if (!exp) notFound();
  const stays = (await getStays({ destination: exp.destination.slug })).slice(0, 2);

  const facts = [
    [Clock, "Duration", exp.duration],
    [Sunrise, "Departs", exp.startTime],
    [Users, "Group", `Up to ${exp.maxGuests}`],
    [Star, "Rated", `${exp.rating.toFixed(1)} / 5`],
  ] as const;

  return (
    <>
      {/* Split hero: image left, title right */}
      <section className="grid min-h-[92svh] bg-ink text-paper lg:grid-cols-[1.15fr_1fr]">
        <div className="relative min-h-[56svh]">
          <Image src={exp.image} alt={exp.title} fill priority sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-transparent lg:to-ink/30" />
        </div>
        <div className="flex flex-col justify-end p-[var(--gutter)] pb-14 lg:pt-[calc(var(--header-h)+4rem)]">
          <p className="hero-rise eyebrow flex items-center gap-3 text-saffron">
            <span className="h-px w-10 bg-saffron" /> {exp.category}
          </p>
          <h1 className="display mt-5 text-[clamp(2.6rem,5vw,4.8rem)]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="hero-line block">{exp.title}</span>
            </span>
          </h1>
          <p className="hero-rise mt-5 max-w-md text-[1.05rem] text-paper/75" style={{ animationDelay: ".25s" }}>
            {exp.summary}
          </p>
          <Link href={`/destinations/${exp.destination.slug}`} className="link-underline mt-6 inline-flex w-fit items-center gap-2 text-paper/80">
            <MapPin size={16} /> {exp.destination.name}
          </Link>
          <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-paper/15 sm:grid-cols-4">
            {facts.map(([Icon, k, v]) => (
              <div key={k} className="bg-ink p-4">
                <dt className="coords flex items-center gap-1.5 text-paper/50">
                  <Icon size={13} /> {k.toUpperCase()}
                </dt>
                <dd className="mt-1.5 font-medium">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-[1fr_420px] xl:gap-20">
          <div>
            <p className="display text-[clamp(1.6rem,2.6vw,2.2rem)] leading-[1.3]">{exp.description}</p>
            <h2 className="eyebrow mt-14 text-ink-soft">Included</h2>
            <ul className="mt-5 space-y-3">
              {exp.highlights.map((h) => (
                <li key={h} className="flex items-center gap-3 border-b border-line pb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-clay" /> {h}
                </li>
              ))}
            </ul>
            <div className="mt-14 rounded-[1.6rem] bg-paper-2 p-7">
              <p className="eyebrow text-clay">Our promise</p>
              <p className="mt-3 max-w-xl text-ink-soft">
                Guides are paid fairly and booked directly. Wildlife is watched at a respectful distance with engines off, and we never offer elephant rides or captive-animal shows.
              </p>
            </div>
          </div>
          <aside>
            <div className="sticky top-[calc(var(--header-h)+1.5rem)]">
              <ExperienceBooking exp={{ id: exp.id, title: exp.title, price: exp.price, maxGuests: exp.maxGuests, startTime: exp.startTime }} />
            </div>
          </aside>
        </div>
      </section>

      {stays.length > 0 && (
        <section className="bg-paper-2 py-24">
          <div className="container-x">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="display text-[clamp(2.2rem,4vw,3.4rem)]">
                Stay nearby in <span className="display-italic">{exp.destination.name}</span>
              </h2>
              <Link href={`/stays?destination=${exp.destination.slug}`} className="btn btn-ghost">
                All stays here <ArrowUpRight size={18} />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2">
              {stays.map((s) => (
                <StayCard key={s.id} stay={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
