import "server-only";
import type { Destination, Experience, Room, Stay } from "@prisma/client";
import { db } from "./db";

// JSON-string columns are parsed here so the rest of the app sees real arrays.
const arr = <T = string>(s: string): T[] => {
  try {
    return JSON.parse(s) as T[];
  } catch {
    return [];
  }
};

export type DestinationView = Omit<Destination, "bestMonths" | "gallery" | "highlights"> & {
  bestMonths: number[];
  gallery: string[];
  highlights: string[];
};
export type StayView = Omit<Stay, "images" | "amenities"> & { images: string[]; amenities: string[] };
export type ExperienceView = Omit<Experience, "highlights"> & { highlights: string[] };

export const viewDestination = (d: Destination): DestinationView => ({
  ...d,
  bestMonths: arr<number>(d.bestMonths),
  gallery: arr(d.gallery),
  highlights: arr(d.highlights),
});
export const viewStay = (s: Stay): StayView => ({ ...s, images: arr(s.images), amenities: arr(s.amenities) });
export const viewExperience = (e: Experience): ExperienceView => ({ ...e, highlights: arr(e.highlights) });

export async function getDestinations() {
  const rows = await db.destination.findMany({ orderBy: { order: "asc" } });
  return rows.map(viewDestination);
}

export async function getDestination(slug: string) {
  const d = await db.destination.findUnique({
    where: { slug },
    include: {
      stays: { orderBy: { rating: "desc" }, include: { destination: { select: { slug: true, name: true, region: true, lat: true, lng: true } } } },
      experiences: { orderBy: { rating: "desc" }, include: { destination: { select: { slug: true, name: true } } } },
    },
  });
  if (!d) return null;
  return {
    ...viewDestination(d),
    stays: d.stays.map((s) => ({ ...viewStay(s), destination: s.destination })) as StayCardData[],
    experiences: d.experiences.map((e) => ({ ...viewExperience(e), destination: e.destination })) as ExperienceCardData[],
  };
}

export type StayCardData = StayView & { destination: Pick<Destination, "slug" | "name" | "region" | "lat" | "lng"> };

export async function getStays(filter: { destination?: string; category?: string; guests?: number; sort?: string; featured?: boolean } = {}) {
  const rows = await db.stay.findMany({
    where: {
      ...(filter.destination ? { destination: { slug: filter.destination } } : {}),
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.featured ? { featured: true } : {}),
      ...(filter.guests ? { rooms: { some: { sleeps: { gte: filter.guests } } } } : {}),
    },
    include: { destination: { select: { slug: true, name: true, region: true, lat: true, lng: true } } },
    orderBy:
      filter.sort === "price-asc"
        ? { priceFrom: "asc" }
        : filter.sort === "price-desc"
          ? { priceFrom: "desc" }
          : filter.sort === "rating"
            ? { rating: "desc" }
            : [{ featured: "desc" }, { rating: "desc" }],
  });
  return rows.map((r) => ({ ...viewStay(r), destination: r.destination })) as StayCardData[];
}

export async function getStayCategories() {
  const rows = await db.stay.findMany({ select: { category: true }, distinct: ["category"], orderBy: { category: "asc" } });
  return rows.map((r) => r.category);
}

export async function getStay(slug: string) {
  const s = await db.stay.findUnique({
    where: { slug },
    include: { rooms: { orderBy: { price: "asc" } }, destination: true },
  });
  if (!s) return null;
  return { ...viewStay(s), rooms: s.rooms as Room[], destination: viewDestination(s.destination) };
}

export type ExperienceCardData = ExperienceView & { destination: Pick<Destination, "slug" | "name"> };

export async function getExperiences(filter: { category?: string; destination?: string; featured?: boolean } = {}) {
  const rows = await db.experience.findMany({
    where: {
      ...(filter.category ? { category: filter.category } : {}),
      ...(filter.destination ? { destination: { slug: filter.destination } } : {}),
      ...(filter.featured ? { featured: true } : {}),
    },
    include: { destination: { select: { slug: true, name: true } } },
    orderBy: [{ featured: "desc" }, { rating: "desc" }],
  });
  return rows.map((r) => ({ ...viewExperience(r), destination: r.destination })) as ExperienceCardData[];
}

export async function getExperience(slug: string) {
  const e = await db.experience.findUnique({ where: { slug }, include: { destination: true } });
  if (!e) return null;
  return { ...viewExperience(e), destination: viewDestination(e.destination) };
}

/** Rooms of this type still free for every night in [checkIn, checkOut). */
export async function roomsLeft(roomId: string, checkIn: Date, checkOut: Date) {
  const room = await db.room.findUnique({ where: { id: roomId }, select: { units: true } });
  if (!room) return 0;
  const overlapping = await db.booking.count({
    where: { roomId, status: "confirmed", checkIn: { lt: checkOut }, checkOut: { gt: checkIn } },
  });
  return Math.max(0, room.units - overlapping);
}

/** Seats still free on an experience departure (same date). */
export async function seatsLeft(experienceId: string, date: Date) {
  const exp = await db.experience.findUnique({ where: { id: experienceId }, select: { maxGuests: true } });
  if (!exp) return 0;
  const agg = await db.booking.aggregate({
    where: { experienceId, status: "confirmed", checkIn: date },
    _sum: { guests: true },
  });
  return Math.max(0, exp.maxGuests - (agg._sum.guests ?? 0));
}
