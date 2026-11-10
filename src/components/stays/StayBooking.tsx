"use client";

import Image from "next/image";
import { useActionState, useEffect, useMemo, useState } from "react";
import { ArrowLeft, BedDouble, Check, Loader2, Maximize2, Minus, Plus, ShieldCheck, Users } from "lucide-react";
import { bookStay } from "@/app/actions";
import { addDays, cn, fmtDate, nightsBetween, parseDay, toDayString, todayUTC, usd } from "@/lib/format";
import { quote } from "@/lib/pricing";

type Room = { id: string; name: string; description: string; image: string; sleeps: number; bed: string; sizeSqm: number; price: number };

export function StayBooking({
  stay,
  rooms,
  initial,
  intro,
}: {
  stay: { id: string; name: string; checkInTime: string; checkOutTime: string };
  rooms: Room[];
  initial: { checkIn?: string; checkOut?: string; guests?: number };
  intro: React.ReactNode;
}) {
  const today = toDayString(todayUTC());
  const [checkIn, setCheckIn] = useState(initial.checkIn ?? toDayString(addDays(todayUTC(), 21)));
  const [checkOut, setCheckOut] = useState(initial.checkOut ?? toDayString(addDays(todayUTC(), 24)));
  const [guests, setGuests] = useState(initial.guests ?? 2);
  const [roomId, setRoomId] = useState(() => (rooms.find((r) => r.sleeps >= (initial.guests ?? 2)) ?? rooms[0]).id);
  const [step, setStep] = useState<1 | 2>(1);
  const [left, setLeft] = useState<number | null>(null);
  const [checking, setChecking] = useState(false);
  const [state, action, pending] = useActionState(bookStay, null);

  const room = rooms.find((r) => r.id === roomId)!;
  const a = parseDay(checkIn);
  const b = parseDay(checkOut);
  const nights = a && b ? nightsBetween(a, b) : 0;
  const valid = nights > 0 && nights <= 30 && checkIn >= today;
  const fits = guests <= room.sleeps;
  const price = useMemo(() => quote(room.price, Math.max(nights, 0)), [room.price, nights]);

  // Live availability for the chosen room and dates.
  useEffect(() => {
    if (!valid) return setLeft(null);
    const ctrl = new AbortController();
    setChecking(true);
    const t = setTimeout(() => {
      fetch(`/api/availability?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`, { signal: ctrl.signal })
        .then((r) => r.json())
        .then((d) => setLeft(typeof d.left === "number" ? d.left : null))
        .catch(() => {})
        .finally(() => setChecking(false));
    }, 250);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [roomId, checkIn, checkOut, valid]);

  const canReserve = valid && fits && left !== 0;

  return (
    <div className="grid gap-14 lg:grid-cols-[1fr_400px] xl:gap-20">
      <div className="min-w-0">
        {intro}

        <h2 id="rooms" className="display mt-20 text-[2.4rem]">
          Rooms <span className="display-italic text-ink-soft">& suites</span>
        </h2>
        <ul className="mt-8 space-y-4">
          {rooms.map((r) => {
            const on = r.id === roomId;
            return (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    setRoomId(r.id);
                    setStep(1);
                    if (guests > r.sleeps) setGuests(r.sleeps);
                  }}
                  className={cn(
                    "group grid w-full gap-5 rounded-[1.4rem] p-3 text-left transition sm:grid-cols-[200px_1fr_auto] sm:items-center",
                    on ? "bg-ink text-paper" : "bg-paper-2 hover:bg-paper-3",
                  )}
                  aria-pressed={on}
                >
                  <span className="relative block aspect-[4/3] overflow-hidden rounded-[1rem]">
                    <Image src={r.image} alt="" fill sizes="200px" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </span>
                  <span className="block px-2 sm:px-0">
                    <span className="display block text-[1.5rem]">{r.name}</span>
                    <span className={cn("mt-1 block text-[0.92rem]", on ? "text-paper/70" : "text-ink-soft")}>{r.description}</span>
                    <span className={cn("mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.82rem]", on ? "text-paper/80" : "text-ink-soft")}>
                      <span className="inline-flex items-center gap-1.5"><Users size={14} /> Sleeps {r.sleeps}</span>
                      <span className="inline-flex items-center gap-1.5"><BedDouble size={14} /> {r.bed}</span>
                      <span className="inline-flex items-center gap-1.5"><Maximize2 size={14} /> {r.sizeSqm} m²</span>
                    </span>
                  </span>
                  <span className="flex items-center justify-between gap-4 px-2 pb-2 sm:block sm:px-4 sm:pb-0 sm:text-right">
                    <span className="display block text-[1.6rem]">{usd(r.price)}</span>
                    <span className={cn("block text-xs", on ? "text-paper/60" : "text-ink-soft")}>per night</span>
                    <span className={cn("mt-2 inline-flex h-7 items-center gap-1 rounded-full px-3 text-xs font-semibold", on ? "bg-saffron text-ink" : "ring-1 ring-line")}>
                      {on ? (
                        <>
                          <Check size={13} /> Selected
                        </>
                      ) : (
                        "Select"
                      )}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Booking card */}
      <aside className="lg:pt-2">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] rounded-[1.8rem] bg-[#fffaf2] p-6 shadow-[0_40px_80px_-40px_rgb(23_32_26/0.35)] ring-1 ring-line">
          <div className="flex items-baseline justify-between">
            <p>
              <span className="display text-[2rem]">{usd(room.price)}</span>
              <span className="text-ink-soft"> / night</span>
            </p>
            <p className="coords text-ink-soft">{room.name.toUpperCase()}</p>
          </div>

          {step === 1 ? (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <label className="field">
                  <span>Check in</span>
                  <input
                    type="date"
                    className="input"
                    value={checkIn}
                    min={today}
                    onChange={(e) => {
                      setCheckIn(e.target.value);
                      if (e.target.value >= checkOut) setCheckOut(toDayString(addDays(new Date(`${e.target.value}T00:00:00Z`), 2)));
                    }}
                  />
                </label>
                <label className="field">
                  <span>Check out</span>
                  <input type="date" className="input" value={checkOut} min={checkIn} onChange={(e) => setCheckOut(e.target.value)} />
                </label>
              </div>
              <div className="field">
                <span>Guests</span>
                <div className="input flex items-center justify-between">
                  <span>
                    {guests} guest{guests > 1 ? "s" : ""}
                  </span>
                  <span className="flex items-center gap-2">
                    <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="Fewer guests">
                      <Minus size={14} />
                    </button>
                    <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="More guests">
                      <Plus size={14} />
                    </button>
                  </span>
                </div>
              </div>

              <div className="min-h-6 text-sm" aria-live="polite">
                {!valid ? (
                  <p className="text-clay">Choose a check-out after check-in (max 30 nights).</p>
                ) : !fits ? (
                  <p className="text-clay">The {room.name} sleeps {room.sleeps}. Pick a larger room for {guests} guests.</p>
                ) : checking ? (
                  <p className="inline-flex items-center gap-2 text-ink-soft">
                    <Loader2 size={14} className="animate-spin" /> Checking availability…
                  </p>
                ) : left === 0 ? (
                  <p className="text-clay">Fully booked for these dates. Try other dates or another room.</p>
                ) : left !== null ? (
                  <p className="inline-flex items-center gap-2 text-moss">
                    <Check size={15} /> Available{left <= 2 ? `, only ${left} left at this price` : ""}
                  </p>
                ) : null}
              </div>

              {valid && (
                <dl className="space-y-2 border-t border-dashed border-line pt-4 text-[0.95rem]">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">
                      {usd(room.price)} × {nights} night{nights > 1 ? "s" : ""}
                    </dt>
                    <dd>{usd(price.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Taxes & service (12%)</dt>
                    <dd>{usd(price.taxes)}</dd>
                  </div>
                  <div className="flex justify-between border-t border-line pt-3 text-lg font-semibold">
                    <dt>Total</dt>
                    <dd>{usd(price.total)}</dd>
                  </div>
                </dl>
              )}

              <button type="button" className="btn btn-clay h-14 w-full" disabled={!canReserve || checking} onClick={() => setStep(2)}>
                Reserve
              </button>
              <p className="flex items-center justify-center gap-2 text-center text-xs text-ink-soft">
                <ShieldCheck size={14} /> No charge today. Free changes up to 14 days before.
              </p>
            </div>
          ) : (
            <form action={action} className="mt-5 space-y-4">
              <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink">
                <ArrowLeft size={14} /> Change dates or room
              </button>
              <div className="rounded-2xl bg-paper-2 p-4 text-sm">
                <p className="font-semibold">{stay.name}</p>
                <p className="text-ink-soft">
                  {room.name} · {guests} guest{guests > 1 ? "s" : ""}
                </p>
                <p className="mt-2">
                  {fmtDate(checkIn, { weekday: "short", day: "numeric", month: "short" })} → {fmtDate(checkOut, { weekday: "short", day: "numeric", month: "short" })} · {nights} night{nights > 1 ? "s" : ""}
                </p>
                <p className="mt-2 flex justify-between border-t border-line pt-2 font-semibold">
                  <span>Total</span> <span>{usd(price.total)}</span>
                </p>
              </div>
              <input type="hidden" name="roomId" value={roomId} />
              <input type="hidden" name="checkIn" value={checkIn} />
              <input type="hidden" name="checkOut" value={checkOut} />
              <input type="hidden" name="guests" value={guests} />
              <GuestFields errors={state?.fieldErrors} />
              {state?.error && <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay-2">{state.error}</p>}
              <button className="btn btn-clay h-14 w-full" disabled={pending}>
                {pending ? <Loader2 size={18} className="animate-spin" /> : null}
                {pending ? "Confirming…" : `Confirm booking · ${usd(price.total)}`}
              </button>
              <p className="text-center text-xs text-ink-soft">
                Check-in from {stay.checkInTime} · Check-out by {stay.checkOutTime}
              </p>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}

/** Controlled so values survive React's post-action form reset when validation fails. */
export function GuestFields({ errors }: { errors?: Record<string, string> }) {
  const [v, setV] = useState({ guestName: "", email: "", phone: "", country: "", notes: "" });
  const bind = (k: keyof typeof v) => ({ name: k, value: v[k], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value })) });
  const err = (k: string) => errors?.[k] && <em className="text-xs not-italic text-clay">{errors[k]}</em>;
  return (
    <>
      <label className="field">
        <span>Full name</span>
        <input {...bind("guestName")} className="input" autoComplete="name" required />
        {err("guestName")}
      </label>
      <label className="field">
        <span>Email</span>
        <input {...bind("email")} type="email" className="input" autoComplete="email" required />
        {err("email")}
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="field">
          <span>Phone</span>
          <input {...bind("phone")} type="tel" className="input" autoComplete="tel" />
        </label>
        <label className="field">
          <span>Country</span>
          <input {...bind("country")} className="input" autoComplete="country-name" />
        </label>
      </div>
      <label className="field">
        <span>Anything we should know?</span>
        <textarea {...bind("notes")} rows={2} className="input" placeholder="Dietary needs, celebrations, arrival time…" />
      </label>
    </>
  );
}
