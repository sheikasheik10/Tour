import { PrismaClient } from "@prisma/client";
import { destinations, experiences, stays } from "./seed-data";

const prisma = new PrismaClient();
const j = (v: unknown) => JSON.stringify(v);

async function main() {
  // Clear in dependency order so the seed can be re-run safely.
  await prisma.booking.deleteMany();
  await prisma.enquiry.deleteMany();
  await prisma.room.deleteMany();
  await prisma.stay.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.destination.deleteMany();

  const ids: Record<string, string> = {};
  for (const [i, d] of destinations.entries()) {
    const row = await prisma.destination.create({
      data: { ...d, bestMonths: j(d.bestMonths), gallery: j(d.gallery), highlights: j(d.highlights), order: i },
    });
    ids[d.slug] = row.id;
  }

  for (const s of stays) {
    const { rooms, destination, images, amenities, ...rest } = s;
    await prisma.stay.create({
      data: {
        ...rest,
        images: j(images),
        amenities: j(amenities),
        destinationId: ids[destination],
        rooms: {
          create: rooms.map(({ factor, ...r }) => ({ ...r, price: Math.round((s.priceFrom * factor) / 5) * 5 })),
        },
      },
    });
  }

  for (const e of experiences) {
    const { destination, highlights, ...rest } = e;
    await prisma.experience.create({ data: { ...rest, highlights: j(highlights), destinationId: ids[destination] } });
  }

  console.log(`Seeded ${destinations.length} destinations, ${stays.length} stays, ${experiences.length} experiences.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
