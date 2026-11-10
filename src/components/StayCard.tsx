import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { StayCardData } from "@/lib/queries";
import { cn, usd } from "@/lib/format";

export function StayCard({ stay, size = "md", query, className }: { stay: StayCardData; size?: "md" | "lg"; query?: string; className?: string }) {
  return (
    <Link href={`/stays/${stay.slug}${query ? `?${query}` : ""}`} className={cn("group flex flex-col", className)}>
      <div className={cn("zoom-img relative overflow-hidden rounded-[1.4rem] bg-paper-3", size === "lg" ? "aspect-[4/5] lg:aspect-auto lg:min-h-[420px] lg:flex-1" : "aspect-[4/5]")}>
        <Image src={stay.images[0]} alt={stay.name} fill sizes={size === "lg" ? "(min-width:1024px) 50vw, 100vw" : "(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"} className="object-cover" />
        {stay.images[1] && (
          <Image
            src={stay.images[1]}
            alt=""
            fill
            sizes="(min-width:1024px) 25vw, 50vw"
            className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3.5">
          <span className="rounded-full bg-paper/90 px-3 py-1 text-[0.72rem] font-semibold tracking-wide text-ink backdrop-blur">{stay.category}</span>
          <span className="inline-flex items-center gap-1 rounded-full bg-ink/55 px-2.5 py-1 text-[0.75rem] font-semibold text-paper backdrop-blur">
            <Star size={12} className="fill-saffron text-saffron" /> {stay.rating.toFixed(1)}
          </span>
        </div>
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="coords text-ink-soft">{stay.destination.name.toUpperCase()}</p>
          <h3 className={cn("display mt-1.5 transition-colors group-hover:text-clay", size === "lg" ? "text-[2rem]" : "text-[1.5rem]")}>{stay.name}</h3>
          <p className="mt-1.5 line-clamp-2 text-[0.92rem] text-ink-soft">{stay.summary}</p>
        </div>
        <p className="shrink-0 text-right">
          <span className="block text-[0.7rem] text-ink-soft">from</span>
          <span className="display text-[1.4rem]">{usd(stay.priceFrom)}</span>
          <span className="block text-[0.7rem] text-ink-soft">/ night</span>
        </p>
      </div>
    </Link>
  );
}
