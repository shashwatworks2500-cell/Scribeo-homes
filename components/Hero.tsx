"use client";

import Image from "next/image";
import { HERO } from "@/lib/assets";

/**
 * The hero.
 *
 * Visual first, and the visual is the whole background. The information
 * panel sits low-left and is deliberately quieter than the architecture
 * behind it: brand, statement, the three facts that matter, two actions.
 *
 * The entrance is one choreography of about 900ms — visual, brand, headline,
 * facts, actions — so the page composes itself once rather than each element
 * arriving on its own schedule. Under reduced motion everything is simply
 * present.
 */
const FACTS = ["1 – 4 BHK", "753 – 2,333 sq ft", "₹48 L onwards"];

export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-[100svh] min-h-[38rem] flex-col justify-end overflow-hidden bg-ground-2"
    >
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={90}
        className="object-cover motion-safe:animate-[heroIn_1100ms_var(--ease-out-quiet)_both]"
      />

      {/* Legibility only. A vertical wash for the navigation and the panel,
          and a horizontal one so the statement has a ground on the left. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(244,242,237,0.66) 0%, rgba(244,242,237,0.10) 26%, rgba(244,242,237,0.44) 62%, rgba(244,242,237,0.96) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(244,242,237,0.88) 0%, rgba(244,242,237,0.66) 30%, rgba(244,242,237,0.32) 52%, rgba(244,242,237,0.06) 72%, rgba(244,242,237,0) 84%)",
        }}
      />

      <div className="relative shell w-full gutter pb-[clamp(4.5rem,14vh,9rem)]">
        <p className="t-label text-travertine motion-safe:animate-[riseIn_500ms_var(--ease-out-quiet)_120ms_both]">
          Scribeo Homes
        </p>

        <h1
          id="hero-heading"
          className="t-display-xl mt-5 max-w-[11ch] text-ink motion-safe:animate-[riseIn_700ms_var(--ease-out-quiet)_260ms_both]"
        >
          Low-rise, held in landscape.
        </h1>

        <ul className="mt-[clamp(1.5rem,4vh,2.25rem)] flex flex-wrap items-center gap-x-6 gap-y-2 motion-safe:animate-[riseIn_600ms_var(--ease-out-quiet)_520ms_both]">
          {FACTS.map((f, i) => (
            <li key={f} className="t-meta flex items-center gap-6 text-ink">
              {i > 0 ? <span aria-hidden="true" className="hidden h-3 w-px bg-hair sm:block" /> : null}
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-[clamp(1.5rem,4vh,2.25rem)] flex flex-col gap-3 motion-safe:animate-[riseIn_600ms_var(--ease-out-quiet)_680ms_both] sm:flex-row sm:items-center sm:gap-4">
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

      {/* Scroll indicator. Quiet, and it retires once the reader has moved. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[clamp(1.5rem,4vh,2.5rem)] left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 motion-safe:animate-[riseIn_600ms_var(--ease-out-quiet)_840ms_both] sm:left-auto sm:right-[clamp(1.25rem,5vw,6.5rem)] sm:translate-x-0"
      >
        <span className="t-label text-ink-faint">Scroll</span>
        <span className="relative block h-12 w-px bg-hair">
          <span className="absolute inset-x-0 top-0 block h-4 bg-travertine motion-safe:animate-[scrollCue_2400ms_var(--ease-in-out-quiet)_infinite]" />
        </span>
      </div>
    </section>
  );
}
