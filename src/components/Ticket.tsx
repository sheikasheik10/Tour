import Image from "next/image";
import Link from "next/link";
import type { ExperienceCardData } from "@/lib/queries";
import { cn, usd } from "@/lib/format";

/** Experience card styled as a cardboard railway ticket, with a perforated stub. */
export function Ticket({ exp, className }: { exp: ExperienceCardData; className?: string }) {
  const no = exp.slug.split("").reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 99999, 7).toString().padStart(5, "0");
  return (
    <Link href={`/experiences/${exp.slug}`} className={cn("ticket group min-h-[15rem]", className)} data-tone={exp.category}>
      <div className="relative m-2.5 mr-3 overflow-hidden rounded-[0.8rem]">
        <Image src={exp.image} alt={exp.title} fill sizes="(min-width:1024px) 15vw, 40vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
        <span className="coords absolute bottom-2 left-2 rounded bg-ink/60 px-1.5 py-0.5 text-paper backdrop-blur">Nº {no}</span>
      </div>
      <span className="ticket-perf" />
      <div className="flex flex-col justify-between gap-3 py-4 pl-5 pr-4">
        <div>
          <div className="flex items-center justify-between gap-2">
            <span className="coords font-medium uppercase">{exp.category}</span>
            <span className="coords opacity-60">ADMIT 1</span>
          </div>
          <h3 className="display mt-2 text-[1.35rem] leading-[1.05]">{exp.title}</h3>
          <p className="coords mt-2 opacity-70">{exp.destination.name.toUpperCase()}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 border-t border-dashed border-ink/25 pt-3">
          <p>
            <span className="coords block opacity-60">DEP</span>
            <span className="font-mono text-[0.85rem] font-medium">{exp.startTime}</span>
          </p>
          <p>
            <span className="coords block opacity-60">TIME</span>
            <span className="font-mono text-[0.85rem] font-medium">{exp.duration.replace(" hours", "h")}</span>
          </p>
          <p className="text-right">
            <span className="coords block opacity-60">FARE</span>
            <span className="font-mono text-[0.85rem] font-semibold">{usd(exp.price)}</span>
          </p>
        </div>
      </div>
    </Link>
  );
}
