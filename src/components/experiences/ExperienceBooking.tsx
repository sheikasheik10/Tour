"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import { bookExperience } from "@/app/actions";
import { GuestFields } from "@/components/stays/StayBooking";
import { addDays, toDayString, todayUTC, usd } from "@/lib/format";
import { quote } from "@/lib/pricing";

export function ExperienceBooking({ exp }: { exp: { id: string; title: string; price: number; maxGuests: number; startTime: string } }) {
  const today = toDayString(addDays(todayUTC(), 1));
  const [date, setDate] = useState(toDayString(addDays(todayUTC(), 14)));
  const [guests, setGuests] = useState(2);
  const [left, setLeft] = useState<number | null>(null);
  const [state, action, pending] = useActionState(bookExperience, null);
  const price = quote(exp.price, guests);

  useEffect(() => {
    if (!date) return;
    const ctrl = new AbortController();
    fetch(`/api/availability?experienceId=${exp.id}&date=${date}`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setLeft(typeof d.left === "number" ? d.left : null))
      .catch(() => {});
    return () => ctrl.abort();
  }, [date, exp.id]);

  const tooMany = left !== null && guests > left;

  return (
    <form action={action} className="rounded-[1.8rem] bg-[#fffaf2] p-6 shadow-[0_40px_80px_-40px_rgb(23_32_26/0.35)] ring-1 ring-line">
      <p>
        <span className="display text-[2rem]">{usd(exp.price)}</span>
        <span className="text-ink-soft"> / person</span>
      </p>
      <input type="hidden" name="experienceId" value={exp.id} />
      <input type="hidden" name="guests" value={guests} />
      <div className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="field">
            <span>Date</span>
            <input type="date" name="date" className="input" value={date} min={today} onChange={(e) => setDate(e.target.value)} required />
          </label>
          <div className="field">
            <span>People</span>
            <div className="input flex items-center justify-between !px-2">
              <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="Fewer people">
                <Minus size={14} />
              </button>
              <span className="font-medium tabular-nums">{guests}</span>
              <button type="button" onClick={() => setGuests((g) => Math.min(exp.maxGuests, g + 1))} className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="More people">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
        <p className="min-h-5 text-sm" aria-live="polite">
          {left === 0 ? (
            <span className="text-clay">This departure is full. Try another date.</span>
          ) : tooMany ? (
            <span className="text-clay">Only {left} seat{left === 1 ? "" : "s"} left that day.</span>
          ) : left !== null ? (
            <span className="inline-flex items-center gap-2 text-moss">
              <Check size={15} /> {left} of {exp.maxGuests} seats free · departs {exp.startTime}
            </span>
          ) : null}
        </p>

        <GuestFields errors={state?.fieldErrors} />

        <dl className="space-y-2 border-t border-dashed border-line pt-4 text-[0.95rem]">
          <div className="flex justify-between">
            <dt className="text-ink-soft">
              {usd(exp.price)} × {guests}
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
        {state?.error && <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay-2">{state.error}</p>}
        <button className="btn btn-clay h-14 w-full" disabled={pending || left === 0 || tooMany}>
          {pending && <Loader2 size={18} className="animate-spin" />}
          {pending ? "Booking…" : `Book ${guests} seat${guests > 1 ? "s" : ""} · ${usd(price.total)}`}
        </button>
        <p className="flex items-center justify-center gap-2 text-xs text-ink-soft">
          <ShieldCheck size={14} /> Free cancellation up to 48 hours before
        </p>
      </div>
    </form>
  );
}
