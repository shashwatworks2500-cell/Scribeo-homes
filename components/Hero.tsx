"use client";

import Image from "next/image";
import { HERO } from "@/lib/assets";

/**
 * The hero.
 *
 * Visual first — the photograph is the whole background and stays vivid.
 * Shade is added only where type sits on it: a band at the top for the
 * navigation, and a low wash under the statement. The statement is left
 * aligned on the page margin (9vw on a desktop) with its centre at 60% of
 * the viewport; on a phone it moves into the lower third, clear of the
 * houses.
 *
 * Entrance: one choreography, 1000ms end to end — visual, brand, headline,
 * facts, actions, then the navigation settles (globals.css). Leaving: the
 * foot of the photograph warms into the soft stone of the next section as
 * it scrolls away, so the page continues out of the image rather than
 * cutting from it (MotionProvider).
 */
const FACTS = ["1–4 BHK", "753–2,333 sq ft", "₹48 L onwards"];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="on-dark relative h-[100svh] min-h-[36rem] overflow-hidden bg-charcoal text-on-dark"
    >
      {/* The supplied file carries a stock-library watermark strip down its
          left edge. The frame starts 4% into the picture so the strip stays
          out of view at every width until a licensed copy replaces it. */}
      <div data-hero-media className="absolute inset-y-0 -left-[4%] right-0">
        <Image
          src={HERO.src}
          alt={HERO.alt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={90}
          className="hero-visual object-cover"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(23,23,23,0.46) 0%, rgba(23,23,23,0.16) 12%, rgba(23,23,23,0) 22%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(23,23,23,0.66) 0%, rgba(23,23,23,0.38) 34%, rgba(23,23,23,0.08) 58%, rgba(23,23,23,0) 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(90deg, rgba(23,23,23,0.42) 0%, rgba(23,23,23,0.2) 34%, rgba(23,23,23,0) 58%)",
        }}
      />
      <div
        aria-hidden="true"
        data-hero-fade
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] opacity-0"
        style={{
          background:
            "linear-gradient(to top, #e9e6de 0%, rgba(233,230,222,0.6) 38%, rgba(233,230,222,0) 100%)",
        }}
      />

      <div className="gutter absolute inset-x-0 bottom-[calc(7rem+env(safe-area-inset-bottom))] md:bottom-auto md:top-[60%] md:-translate-y-1/2">
        <p className="hero-brand t-eyebrow text-on-dark">Scribeo Homes</p>

        <h1 id="hero-heading" className="hero-title t-hero mt-5 max-w-[13ch] text-on-dark md:mt-6">
          Low-rise, held in landscape.
        </h1>

        <ul className="hero-facts t-meta mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-on-dark md:mt-8">
          {FACTS.map((f, i) => (
            <li key={f} className="flex items-center gap-4">
              {i > 0 ? <span aria-hidden="true" className="h-3 w-px bg-on-dark/50" /> : null}
              {f}
            </li>
          ))}
        </ul>

        <div className="hero-actions mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 md:mt-9">
          <a href="#residences" className="btn btn-primary">
            Explore Residences
          </a>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire"))}
          >
            Book a Site Visit
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="hero-cue pointer-events-none absolute bottom-[calc(1.25rem+env(safe-area-inset-bottom))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2.5 md:bottom-10 md:left-auto md:right-[var(--gutter)] md:translate-x-0"
      >
        <span className="t-label text-on-dark">Scroll</span>
        <span className="relative block h-9 w-px overflow-hidden bg-on-dark/35 md:h-12">
          <span className="hero-cue-line absolute inset-x-0 top-0 block h-3 bg-on-dark md:h-4" />
        </span>
      </div>
    </section>
  );
}
