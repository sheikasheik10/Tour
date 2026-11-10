# Serendib — Sri Lanka journeys & stays

A tourism and booking site for Sri Lanka. Guests can book stays and experiences, and send a custom journey request. Built with Next.js 15 (App Router), Prisma and Tailwind CSS v4, with GSAP and Lenis for motion.

## Run it

```bash
npm install          # also generates the Prisma client
npm run db:push      # create the tables in prisma/dev.db (SQLite)
npm run db:seed      # load destinations, stays, rooms and experiences
npm run dev          # http://localhost:3000
```

The admin dashboard is at `/admin`. Its key is `ADMIN_KEY` in `.env`, which defaults to `serendib-admin`; change it before deploying.

## What's in it

| Route | What it does |
| --- | --- |
| `/` | Home: hero carousel, interactive monsoon map, horizontal "four regions" scroll, stays, experiences shown as railway tickets, and the route teaser |
| `/stays` | Search by destination, dates and guests; category filter, sort, a sold-out check for your dates, and a map with price tags |
| `/stays/[slug]` | Gallery, rooms, live availability, price breakdown and a two-step booking form |
| `/experiences`, `/experiences/[slug]` | Ticket-style listings and seat-limited booking per departure date |
| `/destinations`, `/destinations/[slug]` | Atlas with a linked map, best-months strip, plus stays and experiences for each place |
| `/journey` | Journey builder: tap places on the map, set nights, pick a style, and send a request (saved as an `Enquiry`) |
| `/trips` | Guest dashboard (email plus any booking ref): upcoming and past bookings, a calendar, and cancellation |
| `/booking/[ref]` | Boarding-pass style confirmation |
| `/admin` | Bookings, enquiries (with status updates) and subscriber count |

Overbooking is prevented on the server: each `Room` has `units`, and the availability count and the insert run in one transaction.

## Moving to your own database

The app talks to the database only through Prisma, so switching is a configuration change:

1. In `prisma/schema.prisma`, set `provider` to `"postgresql"` (or `"mysql"`, `"sqlserver"`, etc.).
2. In `.env`, set `DATABASE_URL` to your connection string, e.g.
   `DATABASE_URL="postgresql://user:password@host:5432/serendib?sslmode=require"`
3. Run `npm run db:push && npm run db:seed`.

List-like fields such as images, amenities and best months are stored as JSON strings, so the schema works the same on every provider.

Optionally set `SESSION_SECRET` in `.env` to sign the guest and admin cookies with a separate secret. Without it, they're signed with `ADMIN_KEY`.

## Content & credits

- Destination, stay and experience content lives in `prisma/seed-data.ts`. The stays and the guest postcards on the home page are placeholder content for the demo; replace them with real properties and reviews before launch.
- Photography is from [Unsplash](https://unsplash.com) (Unsplash License) and stored locally in `public/img`.
- The Sri Lanka outline is from [geoBoundaries](https://www.geoboundaries.org) (CC BY 4.0), projected into `src/lib/map.ts`.
