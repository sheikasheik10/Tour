import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-screen place-items-center overflow-hidden bg-ink px-[var(--gutter)] text-center text-paper">
      <Image src="/img/tea-mist.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover opacity-40" />
      <div>
        <p className="coords text-paper/60">0.000°N 0.000°E</p>
        <h1 className="display mt-6 text-[clamp(3rem,9vw,8rem)]">
          Lost in <span className="display-italic text-rose">the mist.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-paper/75">This page wandered off the trail. Some of the best finds happen by accident, but this isn&apos;t one of them.</p>
        <Link href="/" className="btn btn-paper mt-10">
          Back to the island
        </Link>
      </div>
    </section>
  );
}
