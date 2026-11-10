import type { Metadata } from "next";
import { JourneyBuilder } from "@/components/journey/JourneyBuilder";
import { getDestinations } from "@/lib/queries";

export const metadata: Metadata = { title: "Plan a journey", description: "Draw your own route around Sri Lanka and get a costed itinerary from a local travel designer." };
export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const destinations = await getDestinations();
  return (
    <section className="relative min-h-screen bg-tea pb-24 pt-[calc(var(--header-h)+3.5rem)] text-paper">
      <div className="container-x">
        <div className="mb-14 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="hero-rise eyebrow flex items-center gap-3 text-saffron">
              <span className="h-px w-10 bg-saffron" /> Journey builder
            </p>
            <h1 className="display mt-5 text-[clamp(2.8rem,6vw,5.6rem)]">
              <span className="block overflow-hidden pb-[0.08em]">
                <span className="hero-line block">
                  Draw your <span className="display-italic text-rose">island.</span>
                </span>
              </span>
            </h1>
          </div>
          <p className="hero-rise max-w-sm text-paper/75" style={{ animationDelay: ".2s" }}>
            Pick places, set the nights and choose a style. A designer in Colombo will turn it into a real itinerary with drivers, train seats and
            stays, at no cost.
          </p>
        </div>
        <JourneyBuilder destinations={destinations.map((d) => ({ slug: d.slug, name: d.name, region: d.region, lat: d.lat, lng: d.lng, heroImage: d.heroImage }))} />
      </div>
    </section>
  );
}
