import Image from "next/image";
import { HERO } from "@/lib/assets";
import { PRICE_RANGE } from "@/lib/content";

/**
 * The hero.
 *
 * Visual first: one photograph, one line, four facts and two things to do.
 * No paragraph. A visitor who reads only this screen should already know
 * what is for sale, roughly what it costs, and how to see it.
 *
 * The fact strip is deliberately the same four numbers the glance repeats
 * below — the one repetition worth keeping, because it is what converts.
 */
const FACTS = [
  "1 – 4 BHK",
  "753 – 2,333 sq ft",
  `${PRICE_RANGE.min} onwards`,
  "Mature landscape, inside the ring road",
];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-[100svh] flex-col justify-end overflow-hidden bg-ground-2"
    >
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={90}
        className="object-cover"
      />

      {/* Two scrims: the vertical pass seats the navigation and the fact
          strip, the horizontal pass gives the headline a ground to sit on.
          Composited contrast is measured against rendered pixels, not these
          values — see the contrast suite. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(251,250,247,0.70) 0%, rgba(251,250,247,0.12) 24%, rgba(251,250,247,0.46) 60%, rgba(251,250,247,0.98) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(251,250,247,0.90) 0%, rgba(251,250,247,0.70) 30%, rgba(251,250,247,0.34) 52%, rgba(251,250,247,0.06) 72%, rgba(251,250,247,0) 84%)",
        }}
      />

      <div className="relative gutter pb-[clamp(2rem,6vh,4rem)]">
        <h1 id="hero-heading" className="t-display-xl max-w-[11ch] text-ink">
          Scribeo Homes
        </h1>
        <p className="mt-5 max-w-[30ch] text-ink-dim sm:text-[1.0625rem]">
          Contemporary low-rise residences surrounded by greenery.
        </p>

        <ul className="mt-[clamp(1.75rem,4vh,2.5rem)] flex flex-wrap items-center gap-x-5 gap-y-2 border-t hair pt-5">
          {FACTS.map((f, i) => (
            <li key={f} className="t-meta flex items-center gap-5 text-ink">
              {i > 0 ? (
                <span aria-hidden="true" className="hidden h-3 w-px bg-hair sm:block" />
              ) : null}
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(1.5rem,4vh,2.25rem)] flex flex-wrap items-center gap-x-7 gap-y-3">
          <a
            href="#residences"
            className="t-meta rounded-full bg-ink px-6 py-3 text-paper transition-colors duration-300 hover:bg-travertine"
          >
            Explore residences
          </a>
          <a
            href="#enquire"
            className="t-meta border-b border-travertine/70 pb-1 text-ink transition-colors duration-300 hover:border-travertine"
          >
            Book a site visit
          </a>
        </div>
      </div>
    </section>
  );
}
