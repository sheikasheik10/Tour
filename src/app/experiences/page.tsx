import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Ticket } from "@/components/Ticket";
import { Reveal } from "@/components/Reveal";
import { getExperiences } from "@/lib/queries";

export const metadata: Metadata = { title: "Experiences", description: "Leopard safaris, the blue train to Ella, whale watching, village cookery and more." };
export const dynamic = "force-dynamic";

const CATEGORIES = ["Wildlife", "Culture", "Rail & Hike", "Ocean", "Food & Tea", "Adventure"];

export default async function ExperiencesPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const { category } = await searchParams;
  const active = CATEGORIES.includes(category ?? "") ? category : undefined;
  const list = await getExperiences({ category: active });

  return (
    <>
      <PageHero
        image="/img/elephants-lake.jpg"
        eyebrow="Experiences"
        title={
          <>
            Tickets to <span className="display-italic">the good stuff</span>
          </>
        }
        intro="Small groups, local guides and fair prices, every one tested by our team. Book a seat for a single morning, or add a few to your journey."
      />
      <section className="bg-paper pb-28 pt-10">
        <div className="container-x">
          <div className="rail -mx-[var(--gutter)] flex gap-2 overflow-x-auto border-b border-line px-[var(--gutter)] pb-6">
            <Link href="/experiences" className="chip" data-active={!active}>
              Everything
            </Link>
            {CATEGORIES.map((c) => (
              <Link key={c} href={`/experiences?category=${encodeURIComponent(c)}`} className="chip" data-active={active === c}>
                {c}
              </Link>
            ))}
          </div>
          <p className="mt-6 text-ink-soft">
            <span className="font-semibold text-ink">{list.length}</span> experience{list.length === 1 ? "" : "s"}
            {active ? ` in ${active}` : ""}
          </p>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {list.map((e, i) => (
              <Reveal key={e.id} delay={(i % 3) * 80}>
                <Ticket exp={e} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
