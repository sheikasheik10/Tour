"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Check, Loader2, Minus, Plane, Plus, RotateCcw, X } from "lucide-react";
import { sendEnquiry } from "@/app/actions";
import { IslandBase } from "@/components/map/IslandBase";
import { AIRPORT, LABEL_SIDE, project, smoothPath } from "@/lib/geo";
import { addDays, cn, toDayString, todayUTC, usd } from "@/lib/format";
import { STYLE_RATES, type TravelStyle } from "@/lib/pricing";

type D = { slug: string; name: string; region: string; lat: number; lng: number; heroImage: string };
type Stop = { slug: string; nights: number };

const PRESETS: { name: string; blurb: string; stops: Stop[] }[] = [
  {
    name: "The Classic",
    blurb: "Rock, temple, tea, leopards, beach",
    stops: [
      { slug: "sigiriya", nights: 3 },
      { slug: "kandy", nights: 2 },
      { slug: "nuwara-eliya", nights: 2 },
      { slug: "ella", nights: 2 },
      { slug: "yala", nights: 2 },
      { slug: "mirissa", nights: 3 },
      { slug: "galle", nights: 2 },
    ],
  },
  {
    name: "Tea & Temples",
    blurb: "Slow and high, by train",
    stops: [
      { slug: "kandy", nights: 3 },
      { slug: "nuwara-eliya", nights: 3 },
      { slug: "ella", nights: 3 },
    ],
  },
  {
    name: "East-coast summer",
    blurb: "For June to September",
    stops: [
      { slug: "sigiriya", nights: 2 },
      { slug: "minneriya", nights: 2 },
      { slug: "trincomalee", nights: 4 },
      { slug: "arugam-bay", nights: 4 },
    ],
  },
  {
    name: "Wild & Coast",
    blurb: "Safaris, then salt water",
    stops: [
      { slug: "yala", nights: 3 },
      { slug: "mirissa", nights: 4 },
      { slug: "galle", nights: 3 },
    ],
  },
];

export function JourneyBuilder({ destinations }: { destinations: D[] }) {
  const [stops, setStops] = useState<Stop[]>(PRESETS[0].stops);
  const [travellers, setTravellers] = useState(2);
  const [style, setStyle] = useState<TravelStyle>("Boutique");
  const [state, action, pending] = useActionState(sendEnquiry, null);
  const [form, setForm] = useState({ name: "", email: "", startDate: toDayString(addDays(todayUTC(), 60)), notes: "" });

  const bySlug = useMemo(() => new Map(destinations.map((d) => [d.slug, d])), [destinations]);
  const nights = stops.reduce((n, s) => n + s.nights, 0);
  const estimate = STYLE_RATES[style].perNight * nights * travellers;

  const pts: [number, number][] = [project(AIRPORT.lat, AIRPORT.lng), ...stops.map((s) => bySlug.get(s.slug)).filter(Boolean).map((d) => project(d!.lat, d!.lng))];
  const route = smoothPath(pts, 0.6);

  const toggle = (slug: string) =>
    setStops((s) => (s.some((x) => x.slug === slug) ? s.filter((x) => x.slug !== slug) : s.length >= 12 ? s : [...s, { slug, nights: 2 }]));
  const bump = (i: number, d: number) => setStops((s) => s.map((x, k) => (k === i ? { ...x, nights: Math.max(1, Math.min(14, x.nights + d)) } : x)));
  const move = (i: number, d: number) =>
    setStops((s) => {
      const j = i + d;
      if (j < 0 || j >= s.length) return s;
      const c = [...s];
      [c[i], c[j]] = [c[j], c[i]];
      return c;
    });

  if (state?.ok)
    return (
      <div className="mx-auto max-w-2xl rounded-[2rem] bg-paper p-10 text-center text-ink md:p-14">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-moss text-paper">
          <Check size={28} />
        </span>
        <h2 className="display mt-6 text-[clamp(2.2rem,4vw,3.4rem)]">Your route is with us.</h2>
        <p className="mt-4 text-ink-soft">
          A travel designer in Colombo will reply to <b className="text-ink">{form.email}</b> within one working day with a costed itinerary, train seats and stays.
        </p>
        <p className="coords mt-8 inline-block rounded-full bg-paper-2 px-5 py-2.5 text-[0.85rem]">REF · {state.ref}</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/stays" className="btn">
            Browse stays meanwhile
          </Link>
          <Link href="/" className="btn btn-ghost">
            Back home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] xl:gap-16">
      {/* Map */}
      <div className="lg:sticky lg:top-[calc(var(--header-h)+1rem)] lg:self-start">
        <p className="coords mb-4 text-center text-paper/60">TAP A PLACE TO ADD OR REMOVE IT</p>
        <div className="mx-auto max-w-[min(480px,44vh)] lg:max-w-[min(480px,44vh)]">
          <IslandBase label="Your route on the map of Sri Lanka">
            {() => (
              <>
                {pts.length > 1 && (
                  <>
                    <path d={route} fill="none" stroke="rgb(243 237 226 / .25)" strokeWidth="7" strokeLinecap="round" />
                    <path key={route} d={route} fill="none" stroke="var(--color-saffron)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 9" className="journey-dash" />
                  </>
                )}
                {(() => {
                  const [x, y] = pts[0];
                  return (
                    <g transform={`translate(${x} ${y})`}>
                      <circle r="13" fill="var(--color-paper)" />
                      <Plane x={-7} y={-7} width={14} height={14} color="#17201a" />
                      <text x={-20} y={5} textAnchor="end" fontSize="13" fontFamily="var(--font-mono)" className="fill-paper/70">
                        CMB
                      </text>
                    </g>
                  );
                })()}
                {destinations.map((d) => {
                  const [x, y] = project(d.lat, d.lng);
                  const idx = stops.findIndex((s) => s.slug === d.slug);
                  const on = idx >= 0;
                  const side = LABEL_SIDE[d.slug] ?? "right";
                  return (
                    <g
                      key={d.slug}
                      transform={`translate(${x} ${y})`}
                      onClick={() => toggle(d.slug)}
                      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), toggle(d.slug))}
                      role="button"
                      tabIndex={0}
                      aria-pressed={on}
                      aria-label={`${on ? "Remove" : "Add"} ${d.name}`}
                      className="cursor-pointer outline-none [&:focus-visible>circle:nth-child(2)]:stroke-saffron"
                    >
                      <circle r="24" fill="transparent" />
                      <circle r={on ? 15 : 8} fill={on ? "var(--color-saffron)" : "var(--color-tea)"} stroke={on ? "#17201a" : "rgb(243 237 226 / .7)"} strokeWidth={on ? 2.5 : 2} style={{ transition: "r .3s, fill .3s" }} />
                      {on && (
                        <text textAnchor="middle" y="5" fontSize="14" fontWeight="700" fontFamily="var(--font-mono)" fill="#17201a">
                          {idx + 1}
                        </text>
                      )}
                      <text
                        x={side === "right" ? (on ? 22 : 15) : on ? -22 : -15}
                        y={5}
                        textAnchor={side === "right" ? "start" : "end"}
                        fontSize="14"
                        letterSpacing="1"
                        fontFamily="var(--font-mono)"
                        className={cn("uppercase", on ? "fill-paper" : "fill-paper/50")}
                      >
                        {d.name.split(" & ")[0]}
                      </text>
                    </g>
                  );
                })}
              </>
            )}
          </IslandBase>
        </div>
      </div>

      {/* Planner panel */}
      <div className="rounded-[2rem] bg-paper p-6 text-ink md:p-8">
        <p className="eyebrow text-clay">Start from a favourite</p>
        <div className="rail -mx-6 mt-3 flex gap-2 overflow-x-auto px-6 md:-mx-8 md:px-8">
          {PRESETS.map((p) => (
            <button key={p.name} type="button" onClick={() => setStops(p.stops)} className="shrink-0 rounded-2xl bg-paper-2 px-4 py-3 text-left transition hover:bg-ink hover:text-paper">
              <span className="block font-semibold">{p.name}</span>
              <span className="block text-xs opacity-70">{p.blurb}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <p className="display text-[1.8rem]">
            Your route <span className="text-ink-soft">· {nights} nights</span>
          </p>
          {stops.length > 0 && (
            <button type="button" onClick={() => setStops([])} className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-clay">
              <RotateCcw size={14} /> Clear
            </button>
          )}
        </div>

        <ol className="mt-4">
          <li className="flex items-center gap-3 border-b border-line py-3 text-ink-soft">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-paper">
              <Plane size={15} />
            </span>
            Land in Colombo
          </li>
          {stops.length === 0 && <li className="py-8 text-center text-ink-soft">Tap places on the map to build your route.</li>}
          {stops.map((s, i) => {
            const d = bySlug.get(s.slug);
            if (!d) return null;
            return (
              <li key={s.slug} className="flex items-center gap-3 border-b border-line py-3">
                <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full">
                  <Image src={d.heroImage} alt="" fill sizes="44px" className="object-cover" />
                  <span className="absolute inset-0 grid place-items-center bg-ink/45 font-mono text-sm font-bold text-paper">{i + 1}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-semibold">{d.name}</span>
                  <span className="coords text-ink-soft">{d.region.toUpperCase()}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <button type="button" onClick={() => bump(i, -1)} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label={`Fewer nights in ${d.name}`}>
                    <Minus size={13} />
                  </button>
                  <span className="w-12 text-center text-sm tabular-nums">
                    {s.nights} <span className="text-ink-soft">nt</span>
                  </span>
                  <button type="button" onClick={() => bump(i, 1)} className="grid h-7 w-7 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label={`More nights in ${d.name}`}>
                    <Plus size={13} />
                  </button>
                </span>
                <span className="flex flex-col">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="text-ink-soft hover:text-ink disabled:opacity-25" aria-label="Move earlier">
                    <ArrowUp size={14} />
                  </button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === stops.length - 1} className="text-ink-soft hover:text-ink disabled:opacity-25" aria-label="Move later">
                    <ArrowDown size={14} />
                  </button>
                </span>
                <button type="button" onClick={() => toggle(s.slug)} className="text-ink-soft hover:text-clay" aria-label={`Remove ${d.name}`}>
                  <X size={16} />
                </button>
              </li>
            );
          })}
        </ol>

        {/* Style + travellers */}
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {(Object.keys(STYLE_RATES) as TravelStyle[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setStyle(k)}
              className={cn("rounded-2xl p-4 text-left ring-1 transition", style === k ? "bg-ink text-paper ring-ink" : "ring-line hover:ring-ink")}
              aria-pressed={style === k}
            >
              <span className="block font-semibold">{k}</span>
              <span className="mt-1 block text-xs opacity-70">{STYLE_RATES[k].label}</span>
              <span className="coords mt-3 block opacity-80">~{usd(STYLE_RATES[k].perNight)}/PERSON/NIGHT</span>
            </button>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between rounded-2xl bg-paper-2 p-5">
          <div>
            <p className="coords text-ink-soft">ESTIMATE · {travellers} TRAVELLER{travellers > 1 ? "S" : ""}</p>
            <p className="display mt-1 text-[2.2rem]">{nights ? usd(estimate) : "—"}</p>
            <p className="text-xs text-ink-soft">Includes stays, a private driver and guides. Flights not included.</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setTravellers((t) => Math.max(1, t - 1))} className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="Fewer travellers">
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-semibold tabular-nums">{travellers}</span>
            <button type="button" onClick={() => setTravellers((t) => Math.min(30, t + 1))} className="grid h-9 w-9 place-items-center rounded-full ring-1 ring-line hover:bg-ink hover:text-paper" aria-label="More travellers">
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Enquiry */}
        <form action={action} className="mt-8 space-y-4 border-t border-line pt-8">
          <p className="display text-[1.6rem]">Send it to a travel designer</p>
          <input type="hidden" name="route" value={JSON.stringify(stops)} />
          <input type="hidden" name="travellers" value={travellers} />
          <input type="hidden" name="style" value={style} />
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="field">
              <span>Your name</span>
              <input name="name" className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
              {state?.fieldErrors?.name && <em className="text-xs not-italic text-clay">{state.fieldErrors.name}</em>}
            </label>
            <label className="field">
              <span>Email</span>
              <input name="email" type="email" className="input" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
              {state?.fieldErrors?.email && <em className="text-xs not-italic text-clay">{state.fieldErrors.email}</em>}
            </label>
          </div>
          <label className="field">
            <span>Arriving around</span>
            <input name="startDate" type="date" className="input" min={toDayString(addDays(todayUTC(), 1))} value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
          </label>
          <label className="field">
            <span>Anything else?</span>
            <textarea name="notes" rows={3} className="input" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Honeymoon, kids' ages, must-sees, a hotel you've had your eye on…" />
          </label>
          {state?.error && <p className="rounded-xl bg-clay/10 p-3 text-sm text-clay-2">{state.error}</p>}
          <button className="btn btn-clay h-14 w-full" disabled={pending || stops.length === 0}>
            {pending && <Loader2 size={18} className="animate-spin" />}
            {pending ? "Sending…" : "Request my itinerary. It's free."}
          </button>
        </form>
      </div>
    </div>
  );
}
