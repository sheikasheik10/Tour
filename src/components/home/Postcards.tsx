import Image from "next/image";

// Placeholder guest notes for the demo: replace with real reviews before launch.
const CARDS = [
  {
    img: "/img/ella-peak-view.jpg",
    from: "Ella",
    date: "14 MAR",
    text: "We missed the 9:30 train at Nine Arches by two minutes. The guide just laughed, made us tea, and we caught the next one. That was the best hour of the whole trip.",
    name: "Hannah & Tom",
    home: "Bristol, UK",
    tilt: "-rotate-3",
  },
  {
    img: "/img/yala-leopard-yawn.jpg",
    from: "Yala",
    date: "02 JUN",
    text: "Our tracker spotted a paw print, switched off the engine and whispered 'wait'. Six minutes later a leopard walked out of the scrub right next to us. I'm still shaking.",
    name: "Priya R.",
    home: "Melbourne, AU",
    tilt: "rotate-2",
  },
  {
    img: "/img/food-hoppers.jpg",
    from: "Galle",
    date: "21 JAN",
    text: "We thought we'd booked a cookery class, but really we were invited into somebody's family. We still use the coconut sambol recipe every Sunday.",
    name: "Lukas Weber",
    home: "Munich, DE",
    tilt: "-rotate-1",
  },
];

export function Postcards() {
  return (
    <section className="overflow-hidden bg-paper-2 py-24 md:py-36">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow text-clay">Postcards</p>
            <h2 className="display mt-5 max-w-[16ch] text-[clamp(2.6rem,5vw,4.6rem)]">
              The bits that <span className="display-italic">weren&apos;t on the plan.</span>
            </h2>
          </div>
          <p className="max-w-xs text-ink-soft">4.9 average from 3,200+ travellers. Here are a few of the stories they sent home.</p>
        </div>

        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {CARDS.map((c) => (
            <figure key={c.name} className={`postcard ${c.tilt} relative p-6 transition-transform duration-700 ease-[var(--ease-out-expo)] hover:rotate-0 hover:scale-[1.02] md:p-7`}>
              <div className="flex items-start justify-between gap-4">
                {/* Postmark */}
                <div className="relative grid h-20 w-20 shrink-0 place-items-center rounded-full border-2 border-clay/50 text-clay/70">
                  <span className="coords text-center leading-tight">
                    {c.from.toUpperCase()}
                    <br />
                    {c.date}
                  </span>
                  <span className="absolute -right-16 top-1/2 h-8 w-14 -translate-y-1/2 bg-[repeating-linear-gradient(180deg,currentColor_0_2px,transparent_2px_7px)] opacity-60" />
                </div>
                <div className="stamp relative h-[110px] w-[90px] shrink-0 rotate-3 shadow-sm">
                  <div className="relative h-full w-full">
                    <Image src={c.img} alt="" fill sizes="90px" className="object-cover" />
                  </div>
                </div>
              </div>
              <blockquote className="display-italic mt-6 text-[1.32rem] leading-[1.35] text-ink-2">&ldquo;{c.text}&rdquo;</blockquote>
              <figcaption className="mt-6 flex items-center justify-between border-t border-dashed border-ink/20 pt-4">
                <span className="font-semibold">{c.name}</span>
                <span className="coords text-ink-soft">{c.home.toUpperCase()}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
