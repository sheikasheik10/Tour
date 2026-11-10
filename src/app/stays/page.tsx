import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SearchBar } from "@/components/SearchBar";
import { StaysExplorer } from "@/components/stays/StaysExplorer";
import { db } from "@/lib/db";
import { cn, fmtDate, nightsBetween, parseDay } from "@/lib/format";
import { getDestinations, getStayCategories, getStays } from "@/lib/queries";

export const metadata: Metadata = { title: "Stays", description: "Handpicked eco lodges, tea bungalows, beach villas and safari camps across Sri Lanka." };
export const dynamic = "force-dynamic";

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function StaysPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const one = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : undefined);
  const destination = one("destination");
  const category = one("category");
  const sort = one("sort") ?? "recommended";
  const guests = Math.max(1, Math.min(12, Number(one("guests")) || 0)) || undefined;
  const checkIn = parseDay(one("checkIn"));
  const checkOut = parseDay(one("checkOut"));
  const datesOk = checkIn && checkOut && nightsBetween(checkIn, checkOut) > 0;

  const [destinations, categories, stays] = await Promise.all([getDestinations(), getStayCategories(), getStays({ destination, category, guests, sort })]);

  // Sold-out check for the requested dates: count overlapping bookings per room in one query.
  const soldOut = new Set<string>();
  if (datesOk) {
    const taken = await db.booking.groupBy({
      by: ["roomId"],
      where: { status: "confirmed", roomId: { not: null }, checkIn: { lt: checkOut! }, checkOut: { gt: checkIn! } },
      _count: { _all: true },
    });
    const takenBy = new Map(taken.map((t) => [t.roomId, t._count._all]));
    const rooms = await db.room.findMany({ where: { stayId: { in: stays.map((s) => s.id) } }, select: { id: true, stayId: true, units: true, sleeps: true } });
    for (const s of stays) {
      const free = rooms.some((r) => r.stayId === s.id && r.sleeps >= (guests ?? 1) && (takenBy.get(r.id) ?? 0) < r.units);
      if (!free) soldOut.add(s.id);
    }
  }

  const keep = new URLSearchParams();
  for (const k of ["destination", "checkIn", "checkOut", "guests", "sort"]) {
    const v = one(k);
    if (v) keep.set(k, v);
  }
  const withParam = (k: string, v?: string) => {
    const q = new URLSearchParams(keep);
    if (category && k !== "category") q.set("category", category);
    if (v) q.set(k, v);
    else q.delete(k);
    return `/stays?${q.toString()}`;
  };
  const detailQuery = new URLSearchParams();
  if (datesOk) {
    detailQuery.set("checkIn", one("checkIn")!);
    detailQuery.set("checkOut", one("checkOut")!);
  }
  if (guests) detailQuery.set("guests", String(guests));

  const dest = destinations.find((d) => d.slug === destination);

  return (
    <>
      <PageHero
        size="sm"
        image={dest?.heroImage ?? "/img/villa-twilight.jpg"}
        eyebrow={dest ? `Stays · ${dest.region}` : "Stays across the island"}
        title={
          dest ? (
            <>
              Stay in <span className="display-italic">{dest.name}</span>
            </>
          ) : (
            <>
              Find your <span className="display-italic">place to stay</span>
            </>
          )
        }
      >
        <div className="mt-10">
          <SearchBar
            destinations={destinations.map((d) => ({ slug: d.slug, name: d.name }))}
            initial={{ destination, checkIn: one("checkIn"), checkOut: one("checkOut"), guests }}
            tone="glass"
          />
        </div>
      </PageHero>

      <section className="bg-paper pb-28 pt-10">
        <div className="container-x">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-6">
            <div className="rail -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-[var(--gutter)]">
              <Link href={withParam("category")} className="chip" data-active={!category}>
                All stays
              </Link>
              {categories.map((c) => (
                <Link key={c} href={withParam("category", c)} className="chip" data-active={category === c}>
                  {c}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-ink-soft">Sort</span>
              {[
                ["recommended", "Recommended"],
                ["price-asc", "Price ↑"],
                ["price-desc", "Price ↓"],
                ["rating", "Rating"],
              ].map(([v, l]) => (
                <Link key={v} href={withParam("sort", v === "recommended" ? undefined : v)} className={cn("rounded-full px-3 py-1.5 transition", sort === v ? "bg-ink text-paper" : "hover:bg-ink/5")}>
                  {l}
                </Link>
              ))}
            </div>
          </div>

          <p className="mt-6 text-ink-soft">
            <span className="font-semibold text-ink">{stays.length - soldOut.size}</span> of {stays.length} stays available
            {datesOk && (
              <>
                {" "}
                for <span className="font-semibold text-ink">{fmtDate(checkIn!, { day: "numeric", month: "short" })} – {fmtDate(checkOut!, { day: "numeric", month: "short" })}</span> ·{" "}
                {nightsBetween(checkIn!, checkOut!)} nights
              </>
            )}
            {guests ? ` · ${guests} guest${guests > 1 ? "s" : ""}` : ""}
          </p>

          <StaysExplorer stays={stays} soldOut={[...soldOut]} query={detailQuery.toString()} />
        </div>
      </section>
    </>
  );
}
