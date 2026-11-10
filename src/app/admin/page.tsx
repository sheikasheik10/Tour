import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { adminLogout, adminSetEnquiryStatus } from "@/app/actions";
import { AdminLogin } from "@/components/AdminLogin";
import { Logo } from "@/components/Logo";
import { db } from "@/lib/db";
import { cn, fmtDate, todayUTC, usd } from "@/lib/format";
import { ADMIN_COOKIE, verify } from "@/lib/session";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const ok = verify((await cookies()).get(ADMIN_COOKIE)?.value) === "admin";

  if (!ok)
    return (
      <section className="grid min-h-screen place-items-center bg-ink px-[var(--gutter)] text-ink">
        <div className="w-full max-w-sm rounded-[1.6rem] bg-paper p-8">
          <Logo />
          <p className="mt-6 text-ink-soft">Bookings & enquiries dashboard</p>
          <AdminLogin />
        </div>
      </section>
    );

  const [bookings, enquiries, subs] = await Promise.all([
    db.booking.findMany({ orderBy: { createdAt: "desc" }, take: 200, include: { stay: { select: { name: true } }, room: { select: { name: true } }, experience: { select: { title: true } } } }),
    db.enquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.subscriber.count(),
  ]);
  const confirmed = bookings.filter((b) => b.status === "confirmed");
  const revenue = confirmed.reduce((n, b) => n + b.total, 0);
  const upcoming = confirmed.filter((b) => b.checkIn >= todayUTC()).length;

  return (
    <section className="min-h-screen bg-paper-2 pb-20">
      <header className="bg-ink text-paper">
        <div className="container-x flex h-16 items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <form action={adminLogout}>
            <button className="text-sm text-paper/70 hover:text-paper">Sign out</button>
          </form>
        </div>
      </header>
      <div className="container-x pt-10">
        <h1 className="display text-[2.6rem]">Dashboard</h1>
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Confirmed bookings", String(confirmed.length)],
            ["Upcoming", String(upcoming)],
            ["Booked value", usd(revenue)],
            ["Subscribers", String(subs)],
          ].map(([k, v]) => (
            <div key={k} className="rounded-2xl bg-paper p-5">
              <p className="coords text-ink-soft">{k.toUpperCase()}</p>
              <p className="display mt-2 text-3xl">{v}</p>
            </div>
          ))}
        </div>

        <h2 className="display mt-14 text-2xl">Journey enquiries</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-paper">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="coords text-ink-soft">
              <tr className="border-b border-line">
                {["Ref", "Received", "Name", "Start", "Pax", "Style", "Route", "Est.", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-normal">
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {enquiries.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-ink-soft">
                    No enquiries yet.
                  </td>
                </tr>
              )}
              {enquiries.map((e) => {
                const route = (JSON.parse(e.route) as { name: string; nights: number }[]).map((r) => `${r.name} (${r.nights})`).join(" → ");
                return (
                  <tr key={e.id} className="border-b border-line align-top last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{e.ref}</td>
                    <td className="px-4 py-3">{fmtDate(e.createdAt)}</td>
                    <td className="px-4 py-3">
                      {e.name}
                      <br />
                      <span className="text-ink-soft">{e.email}</span>
                    </td>
                    <td className="px-4 py-3">{fmtDate(e.startDate)}</td>
                    <td className="px-4 py-3">{e.travellers}</td>
                    <td className="px-4 py-3">{e.style}</td>
                    <td className="max-w-xs px-4 py-3 text-ink-soft">
                      {route}
                      {e.notes && <em className="mt-1 block not-italic text-ink">“{e.notes}”</em>}
                    </td>
                    <td className="px-4 py-3">{e.budget}</td>
                    <td className="px-4 py-3">
                      <form action={adminSetEnquiryStatus} className="flex gap-1">
                        <input type="hidden" name="id" value={e.id} />
                        <select name="status" defaultValue={e.status} className="rounded-lg bg-paper-2 px-2 py-1">
                          {["new", "in-progress", "sent", "closed"].map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                        <button className="rounded-lg bg-ink px-2 py-1 text-xs text-paper">Save</button>
                      </form>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="display mt-14 text-2xl">Bookings</h2>
        <div className="mt-4 overflow-x-auto rounded-2xl bg-paper">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="coords text-ink-soft">
              <tr className="border-b border-line">
                {["Ref", "Booked", "Guest", "What", "Dates", "Pax", "Total", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 font-normal">
                    {h.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-ink-soft">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {bookings.map((b) => (
                <tr key={b.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link href={`/booking/${b.ref}`} className="hover:underline">
                      {b.ref}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{fmtDate(b.createdAt)}</td>
                  <td className="px-4 py-3">
                    {b.guestName}
                    <br />
                    <span className="text-ink-soft">{b.email}</span>
                  </td>
                  <td className="px-4 py-3">{b.kind === "stay" ? `${b.stay?.name} · ${b.room?.name}` : b.experience?.title}</td>
                  <td className="px-4 py-3">
                    {fmtDate(b.checkIn, { day: "numeric", month: "short" })}
                    {b.checkOut && ` → ${fmtDate(b.checkOut, { day: "numeric", month: "short" })}`}
                  </td>
                  <td className="px-4 py-3">{b.guests}</td>
                  <td className="px-4 py-3 font-semibold">{usd(b.total)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", b.status === "confirmed" ? "bg-moss/15 text-moss" : "bg-clay/15 text-clay")}>{b.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
