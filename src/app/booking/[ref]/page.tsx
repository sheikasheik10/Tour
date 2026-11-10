import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { db } from "@/lib/db";
import { fmtDate, usd } from "@/lib/format";

export const metadata: Metadata = { title: "Your booking", robots: { index: false } };
export const dynamic = "force-dynamic";

const first = (json: string) => {
  try {
    return (JSON.parse(json) as string[])[0];
  } catch {
    return "/img/villa-twilight.jpg";
  }
};

export default async function BookingPage({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params;
  const b = await db.booking.findUnique({
    where: { ref: ref.toUpperCase() },
    include: {
      stay: { select: { name: true, slug: true, images: true, checkInTime: true, destination: { select: { name: true } } } },
      room: { select: { name: true } },
      experience: { select: { title: true, slug: true, image: true, startTime: true, duration: true, destination: { select: { name: true } } } },
    },
  });
  if (!b) notFound();

  const isStay = b.kind === "stay";
  const img = isStay ? first(b.stay!.images) : b.experience!.image;
  const title = isStay ? b.stay!.name : b.experience!.title;
  const where = isStay ? b.stay!.destination.name : b.experience!.destination.name;
  const cancelled = b.status === "cancelled";

  const rows: [string, string][] = isStay
    ? [
        ["Check in", `${fmtDate(b.checkIn, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} · from ${b.stay!.checkInTime}`],
        ["Check out", fmtDate(b.checkOut!, { weekday: "short", day: "numeric", month: "short", year: "numeric" })],
        ["Room", `${b.room!.name} · ${b.nights} night${b.nights === 1 ? "" : "s"}`],
        ["Guests", String(b.guests)],
      ]
    : [
        ["Date", fmtDate(b.checkIn, { weekday: "short", day: "numeric", month: "short", year: "numeric" })],
        ["Departs", `${b.experience!.startTime} · ${b.experience!.duration}`],
        ["People", String(b.guests)],
      ];

  return (
    <section className="relative isolate min-h-screen overflow-hidden bg-tea px-[var(--gutter)] pb-24 pt-[calc(var(--header-h)+3rem)] text-paper">
      <Image src={img} alt="" fill sizes="100vw" className="-z-10 object-cover opacity-25 blur-sm" />
      <div className="mx-auto max-w-3xl">
        <div className="hero-rise flex flex-col items-center text-center">
          <span className={`grid h-16 w-16 place-items-center rounded-full ${cancelled ? "bg-clay" : "bg-saffron text-ink"}`}>
            <Check size={28} />
          </span>
          <h1 className="display mt-6 text-[clamp(2.6rem,5vw,4.2rem)]">
            {cancelled ? (
              "This booking was cancelled."
            ) : (
              <>
                You&apos;re going to <span className="display-italic text-rose">{where}.</span>
              </>
            )}
          </h1>
          {!cancelled && <p className="mt-3 text-paper/75">We&apos;ve saved everything below. Keep your reference handy for My trips.</p>}
        </div>

        {/* Boarding-pass style confirmation */}
        <div className="hero-rise mt-12 overflow-hidden rounded-[1.8rem] bg-paper text-ink shadow-2xl" style={{ animationDelay: ".15s" }}>
          <div className="relative h-48 md:h-56">
            <Image src={img} alt="" fill sizes="768px" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            <div className="absolute inset-x-6 bottom-5 text-paper">
              <p className="coords text-paper/70">{isStay ? "STAY" : "EXPERIENCE"} · {where.toUpperCase()}</p>
              <p className="display mt-1 text-[clamp(1.8rem,3.5vw,2.6rem)]">{title}</p>
            </div>
          </div>
          <div className="grid md:grid-cols-[1fr_220px]">
            <dl className="grid gap-5 p-6 sm:grid-cols-2 md:p-8">
              {rows.map(([k, v]) => (
                <div key={k}>
                  <dt className="coords text-ink-soft">{k.toUpperCase()}</dt>
                  <dd className="mt-1 font-medium">{v}</dd>
                </div>
              ))}
              <div>
                <dt className="coords text-ink-soft">LEAD GUEST</dt>
                <dd className="mt-1 font-medium">{b.guestName}</dd>
              </div>
            </dl>
            <div className="relative border-t-2 border-dashed border-line p-6 md:border-l-2 md:border-t-0 md:p-8">
              <span className="absolute -left-3 -top-3 hidden h-6 w-6 rounded-full bg-tea md:block" />
              <span className="absolute -bottom-3 -left-3 hidden h-6 w-6 rounded-full bg-tea md:block" />
              <p className="coords text-ink-soft">REFERENCE</p>
              <p className="mt-1 font-mono text-2xl font-semibold tracking-wider">{b.ref}</p>
              <div className="mt-6 space-y-1 text-sm">
                <p className="flex justify-between text-ink-soft">
                  <span>Subtotal</span> <span>{usd(b.subtotal)}</span>
                </p>
                <p className="flex justify-between text-ink-soft">
                  <span>Taxes & service</span> <span>{usd(b.taxes)}</span>
                </p>
                <p className="flex justify-between border-t border-line pt-2 text-lg font-semibold">
                  <span>Total</span> <span>{usd(b.total)}</span>
                </p>
              </div>
              <p className="mt-3 text-xs text-ink-soft">Pay at the property. No charge has been made.</p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/trips" className="btn btn-paper">
            Go to My trips <ArrowRight size={18} />
          </Link>
          <Link href="/experiences" className="btn btn-ghost text-paper">
            Add an experience
          </Link>
        </div>
      </div>
    </section>
  );
}
