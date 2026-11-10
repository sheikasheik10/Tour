"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Minus, Plus, Search } from "lucide-react";
import { addDays, cn, toDayString, todayUTC } from "@/lib/format";

type Opt = { slug: string; name: string };

/** Stay search: where / check-in / check-out / guests → /stays?… */
export function SearchBar({
  destinations,
  initial,
  className,
  tone = "light",
}: {
  destinations: Opt[];
  initial?: { destination?: string; checkIn?: string; checkOut?: string; guests?: number };
  className?: string;
  tone?: "light" | "glass";
}) {
  const router = useRouter();
  const today = toDayString(todayUTC());
  const [where, setWhere] = useState(initial?.destination ?? "");
  const [checkIn, setCheckIn] = useState(initial?.checkIn ?? toDayString(addDays(todayUTC(), 21)));
  const [checkOut, setCheckOut] = useState(initial?.checkOut ?? toDayString(addDays(todayUTC(), 25)));
  const [guests, setGuests] = useState(initial?.guests ?? 2);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (where) q.set("destination", where);
    if (checkIn) q.set("checkIn", checkIn);
    if (checkOut) q.set("checkOut", checkOut);
    q.set("guests", String(guests));
    router.push(`/stays?${q.toString()}`);
  }

  const cell = "flex min-w-0 flex-1 flex-col justify-center gap-0.5 px-5 py-3";
  const label = "eyebrow !text-[0.62rem] opacity-60";
  const control = "w-full min-w-0 bg-transparent text-[0.98rem] font-medium outline-none";

  return (
    <form
      onSubmit={submit}
      className={cn(
        "grid w-full grid-cols-2 items-stretch overflow-hidden rounded-[1.6rem] md:flex md:rounded-full",
        tone === "glass"
          ? "bg-paper/90 text-ink shadow-[0_30px_80px_-20px_rgb(0_0_0/0.5)] backdrop-blur-xl"
          : "bg-[#fffaf2] text-ink ring-1 ring-line",
        className,
      )}
      aria-label="Search stays"
    >
      <label className={cn(cell, "col-span-2 border-b border-line md:col-span-1 md:flex-[1.4] md:border-b-0 md:border-r md:pl-7")}>
        <span className={label}>Where</span>
        <select value={where} onChange={(e) => setWhere(e.target.value)} className={cn(control, "cursor-pointer appearance-none")}>
          <option value="">Anywhere on the island</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <label className={cn(cell, "border-b border-r border-line md:border-b-0")}>
        <span className={label}>Check in</span>
        <input
          type="date"
          value={checkIn}
          min={today}
          onChange={(e) => {
            setCheckIn(e.target.value);
            if (e.target.value >= checkOut) setCheckOut(toDayString(addDays(new Date(`${e.target.value}T00:00:00Z`), 2)));
          }}
          className={control}
        />
      </label>
      <label className={cn(cell, "border-b border-line md:border-b-0 md:border-r")}>
        <span className={label}>Check out</span>
        <input type="date" value={checkOut} min={checkIn || today} onChange={(e) => setCheckOut(e.target.value)} className={control} />
      </label>
      <div className={cn(cell, "md:flex-[0.8]")}>
        <span className={label}>Guests</span>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="Fewer guests">
            <Minus size={14} />
          </button>
          <span className="w-5 text-center font-medium tabular-nums" aria-live="polite">
            {guests}
          </span>
          <button type="button" onClick={() => setGuests((g) => Math.min(12, g + 1))} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="More guests">
            <Plus size={14} />
          </button>
        </div>
      </div>
      <div className="flex items-center p-2">
        <button className="btn btn-clay h-14 w-full md:w-auto md:px-8" type="submit">
          <Search size={18} /> Search stays
        </button>
      </div>
    </form>
  );
}
