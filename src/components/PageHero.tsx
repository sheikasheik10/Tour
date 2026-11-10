import Image from "next/image";
import { cn } from "@/lib/format";

/** Dark image band at the top of inner pages (keeps the header legible). */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
  size = "md",
  className,
}: {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  image: string;
  children?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative isolate flex flex-col justify-end overflow-hidden bg-ink text-paper",
        size === "lg" ? "min-h-[88svh]" : size === "md" ? "min-h-[62svh]" : "min-h-[44svh]",
        className,
      )}
    >
      <Image src={image} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(16_22_18/0.6),rgb(16_22_18/0.15)_35%,rgb(16_22_18/0.85))]" />
      <div className="container-x pb-12 pt-[calc(var(--header-h)+4rem)] md:pb-16">
        <p className="hero-rise eyebrow flex items-center gap-3 text-paper/80">
          <span className="h-px w-10 bg-saffron" /> {eyebrow}
        </p>
        <h1 className="display mt-5 max-w-[18ch] text-[clamp(2.8rem,7vw,6.4rem)]">
          <span className="block overflow-hidden pb-[0.08em]">
            <span className="hero-line block" style={{ animationDelay: "0.1s" }}>
              {title}
            </span>
          </span>
        </h1>
        {intro && (
          <div className="hero-rise mt-6 max-w-xl text-[1.05rem] text-paper/80" style={{ animationDelay: "0.3s" }}>
            {intro}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
