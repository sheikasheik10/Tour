import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Atlas } from "@/components/destinations/Atlas";
import { db } from "@/lib/db";
import { viewDestination } from "@/lib/queries";

export const metadata: Metadata = { title: "Destinations", description: "Ten places across Sri Lanka's coast, ancient kingdoms, tea country and wild parks." };
export const dynamic = "force-dynamic";

export default async function DestinationsPage() {
  const rows = await db.destination.findMany({ orderBy: { order: "asc" }, include: { _count: { select: { stays: true, experiences: true } } } });
  const destinations = rows.map((r) => {
    const d = viewDestination(r);
    return { slug: d.slug, name: d.name, region: d.region, tagline: d.tagline, lat: d.lat, lng: d.lng, heroImage: d.heroImage, bestMonths: d.bestMonths, stays: r._count.stays, experiences: r._count.experiences };
  });

  return (
    <>
      <PageHero
        image="/img/galle-aerial.jpg"
        eyebrow="The atlas"
        title={
          <>
            Ten places, <span className="display-italic">four moods</span>
          </>
        }
        intro="You can see the whole island in two weeks, but you'll want to come back for each of these. Hover a place to find it on the map."
      />
      <section className="bg-paper py-20 md:py-28">
        <div className="container-x">
          <Atlas destinations={destinations} />
        </div>
      </section>
    </>
  );
}
