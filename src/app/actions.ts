"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { nightsBetween, parseDay, todayUTC } from "@/lib/format";
import { quote, STYLE_RATES } from "@/lib/pricing";
import { makeRef } from "@/lib/ref";
import { ADMIN_COOKIE, safeEqual, sign, TRIPS_COOKIE, verify } from "@/lib/session";

export type FormState = { error?: string; fieldErrors?: Record<string, string>; ok?: boolean; ref?: string } | null;

const guest = {
  guestName: z.string().trim().min(2, "Please tell us your name").max(80),
  email: z.string().trim().toLowerCase().email("That email doesn't look right"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  country: z.string().trim().max(60).optional().or(z.literal("")),
  notes: z.string().trim().max(800).optional().or(z.literal("")),
};

function fieldErrors(err: z.ZodError) {
  const out: Record<string, string> = {};
  for (const i of err.issues) out[String(i.path[0])] ??= i.message;
  return out;
}

const cookieOpts = { httpOnly: true, sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 30, secure: process.env.NODE_ENV === "production" };

async function rememberGuest(email: string) {
  (await cookies()).set(TRIPS_COOKIE, sign(email), cookieOpts);
}

/* ───────────────────────────── Stay booking ───────────────────────────── */

const StayBooking = z.object({
  roomId: z.string().min(1),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.coerce.number().int().min(1).max(12),
  ...guest,
});

export async function bookStay(_: FormState, form: FormData): Promise<FormState> {
  const parsed = StayBooking.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const checkIn = parseDay(d.checkIn);
  const checkOut = parseDay(d.checkOut);
  if (!checkIn || !checkOut) return { error: "Choose your check-in and check-out dates." };
  if (checkIn < todayUTC()) return { error: "Check-in can't be in the past." };
  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) return { error: "Check-out must be after check-in." };
  if (nights > 30) return { error: "For stays longer than 30 nights, send us a journey request instead." };

  const room = await db.room.findUnique({ where: { id: d.roomId }, include: { stay: { select: { id: true } } } });
  if (!room) return { error: "That room is no longer available." };
  if (d.guests > room.sleeps) return { error: `The ${room.name} sleeps up to ${room.sleeps}. Pick a larger room or add a second booking.` };

  const price = quote(room.price, nights);
  const ref = makeRef("SRD");

  // Count-then-insert inside one transaction so two guests can't take the last room.
  const result = await db.$transaction(async (tx) => {
    const taken = await tx.booking.count({
      where: { roomId: room.id, status: "confirmed", checkIn: { lt: checkOut }, checkOut: { gt: checkIn } },
    });
    if (taken >= room.units) return null;
    return tx.booking.create({
      data: {
        ref,
        kind: "stay",
        checkIn,
        checkOut,
        nights,
        guests: d.guests,
        guestName: d.guestName,
        email: d.email,
        phone: d.phone || null,
        country: d.country || null,
        notes: d.notes || null,
        ...price,
        stayId: room.stay.id,
        roomId: room.id,
      },
    });
  });
  if (!result) return { error: "Someone just booked the last one for those dates. Try other dates or another room." };

  await rememberGuest(d.email);
  redirect(`/booking/${ref}`);
}

/* ─────────────────────────── Experience booking ─────────────────────────── */

const ExperienceBooking = z.object({
  experienceId: z.string().min(1),
  date: z.string(),
  guests: z.coerce.number().int().min(1).max(20),
  ...guest,
});

export async function bookExperience(_: FormState, form: FormData): Promise<FormState> {
  const parsed = ExperienceBooking.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const date = parseDay(d.date);
  if (!date) return { error: "Pick a date." };
  if (date < todayUTC()) return { error: "That date has already passed." };

  const exp = await db.experience.findUnique({ where: { id: d.experienceId } });
  if (!exp) return { error: "That experience is no longer available." };

  const price = quote(exp.price, d.guests);
  const ref = makeRef("SRD");

  const result = await db.$transaction(async (tx) => {
    const agg = await tx.booking.aggregate({
      where: { experienceId: exp.id, status: "confirmed", checkIn: date },
      _sum: { guests: true },
    });
    const left = exp.maxGuests - (agg._sum.guests ?? 0);
    if (left < d.guests) return { left };
    await tx.booking.create({
      data: {
        ref,
        kind: "experience",
        checkIn: date,
        guests: d.guests,
        guestName: d.guestName,
        email: d.email,
        phone: d.phone || null,
        country: d.country || null,
        notes: d.notes || null,
        ...price,
        experienceId: exp.id,
      },
    });
    return null;
  });
  if (result) return { error: result.left > 0 ? `Only ${result.left} seat${result.left === 1 ? "" : "s"} left that day.` : "That departure is full. Try another date." };

  await rememberGuest(d.email);
  redirect(`/booking/${ref}`);
}

/* ───────────────────────────── Journey enquiry ───────────────────────────── */

const Enquiry = z.object({
  name: z.string().trim().min(2, "Please tell us your name").max(80),
  email: z.string().trim().toLowerCase().email("That email doesn't look right"),
  startDate: z.string(),
  travellers: z.coerce.number().int().min(1).max(30),
  style: z.enum(Object.keys(STYLE_RATES) as [keyof typeof STYLE_RATES, ...(keyof typeof STYLE_RATES)[]]),
  route: z.string(),
  notes: z.string().trim().max(1500).optional().or(z.literal("")),
});
const RouteStops = z.array(z.object({ slug: z.string(), nights: z.number().int().min(1).max(14) })).min(1, "Add at least one stop").max(12);

export async function sendEnquiry(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Enquiry.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const start = parseDay(d.startDate);
  if (!start || start < todayUTC()) return { error: "Choose a start date in the future.", fieldErrors: { startDate: "Pick a future date" } };

  let stops: z.infer<typeof RouteStops>;
  try {
    stops = RouteStops.parse(JSON.parse(d.route));
  } catch {
    return { error: "Add at least one stop to your route on the map." };
  }
  const known = await db.destination.findMany({ where: { slug: { in: stops.map((s) => s.slug) } }, select: { slug: true, name: true } });
  const names = new Map(known.map((k) => [k.slug, k.name]));
  const route = stops.filter((s) => names.has(s.slug)).map((s) => ({ ...s, name: names.get(s.slug) }));
  if (!route.length) return { error: "Add at least one stop to your route on the map." };

  const totalNights = route.reduce((n, s) => n + s.nights, 0);
  const ref = makeRef("JRN");
  await db.enquiry.create({
    data: {
      ref,
      name: d.name,
      email: d.email,
      startDate: start,
      travellers: d.travellers,
      style: d.style,
      budget: `~$${(STYLE_RATES[d.style].perNight * totalNights * d.travellers).toLocaleString("en-US")}`,
      route: JSON.stringify(route),
      notes: d.notes || null,
    },
  });
  return { ok: true, ref };
}

/* ─────────────────────────────── My trips ─────────────────────────────── */

const Lookup = z.object({
  email: z.string().trim().toLowerCase().email("That email doesn't look right"),
  ref: z.string().trim().toUpperCase().min(4, "Enter a booking reference"),
});

export async function openTrips(_: FormState, form: FormData): Promise<FormState> {
  const parsed = Lookup.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: "Please check the highlighted fields.", fieldErrors: fieldErrors(parsed.error) };
  const booking = await db.booking.findFirst({ where: { ref: parsed.data.ref, email: parsed.data.email } });
  if (!booking) return { error: "We couldn't find a booking with that email and reference." };
  await rememberGuest(parsed.data.email);
  redirect("/trips");
}

export async function leaveTrips() {
  (await cookies()).delete(TRIPS_COOKIE);
  redirect("/trips");
}

export async function cancelBooking(form: FormData) {
  const email = verify((await cookies()).get(TRIPS_COOKIE)?.value);
  const ref = String(form.get("ref") ?? "");
  if (!email || !ref) return;
  const b = await db.booking.findUnique({ where: { ref } });
  if (!b || b.email !== email || b.status !== "confirmed" || b.checkIn <= todayUTC()) return;
  await db.booking.update({ where: { ref }, data: { status: "cancelled" } });
  revalidatePath("/trips");
  revalidatePath(`/booking/${ref}`);
}

/* ─────────────────────────────── Newsletter ─────────────────────────────── */

export async function subscribe(_: FormState, form: FormData): Promise<FormState> {
  const email = z.string().trim().toLowerCase().email().safeParse(form.get("email"));
  if (!email.success) return { error: "That email doesn't look right." };
  await db.subscriber.upsert({ where: { email: email.data }, update: {}, create: { email: email.data } });
  return { ok: true };
}

/* ───────────────────────────────── Admin ───────────────────────────────── */

export async function adminLogin(_: FormState, form: FormData): Promise<FormState> {
  const key = String(form.get("key") ?? "");
  const expected = process.env.ADMIN_KEY;
  if (!expected || !safeEqual(key, expected)) return { error: "Wrong key." };
  (await cookies()).set(ADMIN_COOKIE, sign("admin"), { ...cookieOpts, maxAge: 60 * 60 * 8 });
  redirect("/admin");
}

export async function adminLogout() {
  (await cookies()).delete(ADMIN_COOKIE);
  redirect("/admin");
}

export async function adminSetEnquiryStatus(form: FormData) {
  if (verify((await cookies()).get(ADMIN_COOKIE)?.value) !== "admin") return;
  const id = String(form.get("id") ?? "");
  const status = String(form.get("status") ?? "");
  if (!["new", "in-progress", "sent", "closed"].includes(status)) return;
  await db.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}
