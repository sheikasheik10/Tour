import { NextResponse, type NextRequest } from "next/server";
import { nightsBetween, parseDay } from "@/lib/format";
import { roomsLeft, seatsLeft } from "@/lib/queries";

// GET /api/availability?roomId=..&checkIn=yyyy-mm-dd&checkOut=yyyy-mm-dd
// GET /api/availability?experienceId=..&date=yyyy-mm-dd
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;

  const roomId = q.get("roomId");
  if (roomId) {
    const a = parseDay(q.get("checkIn"));
    const b = parseDay(q.get("checkOut"));
    if (!a || !b || nightsBetween(a, b) < 1) return NextResponse.json({ error: "bad dates" }, { status: 400 });
    return NextResponse.json({ left: await roomsLeft(roomId, a, b) });
  }

  const experienceId = q.get("experienceId");
  if (experienceId) {
    const d = parseDay(q.get("date"));
    if (!d) return NextResponse.json({ error: "bad date" }, { status: 400 });
    return NextResponse.json({ left: await seatsLeft(experienceId, d) });
  }

  return NextResponse.json({ error: "missing roomId or experienceId" }, { status: 400 });
}
