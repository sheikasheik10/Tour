import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowUpRight, CalendarDays, LogOut, MapPin, Moon, Sparkles, Ticket as TicketIcon } from "lucide-react";
import { leaveTrips } from "@/app/actions";
import { TripsLogin } from "@/components/trips/TripsLogin";
import { TripCalendar } from "@/components/trips/TripCalendar";
import { CancelButton } from "@/components/trips/CancelButton";
import { db } from "@/lib/db";
import { addDays, cn, fmtDate, todayUTC, usd } from "@/lib/format";
import { TRIPS_COOKIE, verify } from "@/lib/session";

export const metadata: Metadata = { title: "My trips" };
export const dynamic = "force-dynamic";

const firstImage = (json: string) => {
  try {
    return (JSON.parse(json) as string[])[0];
  } catch {
    return "/img/villa-twilight.jpg";
  }
};

export default async function TripsPage() {
  const email = verify((await cookies()).get(TRIPS_COOKIE)?.value);

  if (!email)
    return (
      <section className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-ink px-[var(--gutter)] py-32 text-paper">
        <Image src="/img/ella-train-door.jpg" alt="" fill priority sizes="100vw" className="-z-10 object-cover opacity-45" />
        <div className="w-full max-w-md rounded-[2rem] bg-paper p-8 text-ink md:p-10">
          <p className="eyebrow text-clay">My trips</p>
          <h1 className="display mt-4 text-[2.6rem]">
            Welcome <span className="display-italic">back.</span>
          </h1>
          <p className="mt-3 text-ink-soft">Enter your email and any booking reference to see your bookings. No password needed.</p>
          <div className="mt-8">
            <TripsLogin />
          </div>
        </div>
      </section>
    );

  const bookings = await db.booking.findMany({
    where: { email },
    orderBy: { checkIn: "asc" },
    include: {
      stay: { select: { name: true, slug: true, images: true, destination: { select: { name: true } } } },
      room: { select: { name: true } },
      experience: { select: { title: true, slug: true, image: true, startTime: true, destination: { select: { name: true } } } },
    },
  });

  const today = todayUTC();
  const live = bookings.filter((b) => b.status === "confirmed");
  const upcoming = live.filter((b) => (b.checkOut ?? b.checkIn) >= today);
  const past = bookings.filter((b) => !upcoming.includes(b));
  const name = bookings[0]?.guestName.split(" ")[0] ?? "traveller";
  const nights = live.reduce((n, b) => n + (b.nights ?? 0), 0);
  const spent = live.reduce((n, b) => n + b.total, 0);
  const next = upcoming[0];
  const daysToGo = next ? Math.ceil((next.checkIn.getTime() - today.getTime()) / 86_400_000) : null;

  const card = (b: (typeof bookings)[number]) => {
    const isStay = b.kind === "stay";
    const img = isStay ? firstImage(b.stay!.images) : b.experience!.image;
    const title = isStay ? b.stay!.name : b.experience!.title;
    const href = isStay ? `/stays/${b.stay!.slug}` : `/experiences/${b.experience!.slug}`;
    const where = isStay ? b.stay!.destination.name : b.experience!.destination.name;
    const cancellable = b.status === "confirmed" && b.checkIn > today;
    return (
      <li key={b.id} className={cn("grid gap-4 rounded-[1.4rem] bg-paper p-3 sm:grid-cols-[150px_1fr]", b.status === "cancelled" && "opacity-60")}>
        <Link href={href} className="relative aspect-[4/3] overflow-hidden rounded-[1rem] sm:aspect-auto">
          <Image src={img} alt="" fill sizes="150px" className="object-cover" />
        </Link>
        <div className="flex flex-col justify-between gap-3 px-1 py-1 sm:pr-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="coords flex items-center gap-1.5 text-ink-soft">
                {isStay ? <Moon size={12} /> : <TicketIcon size={12} />} {isStay ? `STAY · ${b.room?.name.toUpperCase()}` : "EXPERIENCE"}
              </p>
              <Link href={href} className="display mt-1 block text-[1.5rem] hover:text-clay">
                {title}
              </Link>
              <p className="mt-0.5 inline-flex items-center gap-1 text-sm text-ink-soft">
                <MapPin size={13} /> {where}
              </p>
            </div>
            <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", b.status === "confirmed" ? "bg-moss/15 text-moss" : "bg-clay/15 text-clay")}>
              {b.status === "confirmed" ? "Confirmed" : "Cancelled"}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-line pt-3 text-sm">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays size={14} /> {fmtDate(b.checkIn, { day: "numeric", month: "short", year: "numeric" })}
              {b.checkOut && ` → ${fmtDate(b.checkOut, { day: "numeric", month: "short" })}`}
              {!isStay && ` · ${b.experience!.startTime}`}
            </span>
            <span className="flex items-center gap-4">
              <Link href={`/booking/${b.ref}`} className="font-mono text-xs underline-offset-4 hover:underline">
                {b.ref}
              </Link>
              <b>{usd(b.total)}</b>
              {cancellable && <CancelButton refCode={b.ref} />}
            </span>
          </div>
        </div>
      </li>
    );
  };

  return (
    <section className="min-h-screen bg-paper-2 pb-24">
      <div className="bg-ink pb-24 pt-[calc(var(--header-h)+3rem)] text-paper">
        <div className="container-x flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-saffron">My trips</p>
            <h1 className="display mt-3 text-[clamp(2.6rem,5vw,4.4rem)]">
              Hello, <span className="display-italic text-rose">{name}.</span>
            </h1>
            <p className="mt-2 text-paper/70">{daysToGo !== null ? (daysToGo <= 0 ? "You're travelling now. Enjoy every minute." : `${daysToGo} day${daysToGo === 1 ? "" : "s"} until ${next!.stay?.name ?? next!.experience?.title}.`) : "No upcoming trips yet. The island is waiting."}</p>
          </div>
          <form action={leaveTrips}>
            <button className="inline-flex items-center gap-2 text-sm text-paper/60 hover:text-paper">
              <LogOut size={15} /> Sign out ({email})
            </button>
          </form>
        </div>
      </div>

      <div className="container-x -mt-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-12">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Bookings", String(live.length)],
                ["Nights booked", String(nights)],
                ["Trip total", usd(spent)],
              ].map(([k, v]) => (
                <div key={k} className="rounded-[1.4rem] bg-paper p-5 shadow-[0_20px_40px_-30px_rgb(23_32_26/0.5)]">
                  <p className="coords text-ink-soft">{k.toUpperCase()}</p>
                  <p className="display mt-2 text-[clamp(1.6rem,3vw,2.4rem)]">{v}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 className="display text-[2rem]">Upcoming</h2>
              {upcoming.length ? <ul className="mt-5 space-y-3">{upcoming.map(card)}</ul> : <p className="mt-4 text-ink-soft">Nothing booked ahead yet.</p>}
            </div>

            {past.length > 0 && (
              <div>
                <h2 className="display text-[2rem] text-ink-soft">Past & cancelled</h2>
                <ul className="mt-5 space-y-3">{past.map(card)}</ul>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <TripCalendar
              initial={(next?.checkIn ?? today).toISOString()}
              spans={live.map((b) => ({ start: b.checkIn.toISOString(), end: (b.checkOut ? addDays(b.checkOut, -1) : b.checkIn).toISOString(), kind: b.kind }))}
            />
            <div className="relative overflow-hidden rounded-[1.6rem] bg-clay p-6 text-paper">
              <Sparkles size={22} className="text-saffron" />
              <p className="display mt-4 text-[1.7rem] leading-tight">Make a stay into a journey</p>
              <p className="mt-2 text-sm text-paper/80">Add drivers, train seats and more places. A designer will build it around what you&apos;ve already booked.</p>
              <Link href="/journey" className="btn btn-paper btn-sm mt-5">
                Plan the rest <ArrowUpRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
