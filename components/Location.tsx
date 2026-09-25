"use client";

import { useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { DISTANCES } from "@/lib/content";

/**
 * Location — what is around here?
 *
 * Desktop: the plan at 55%, the destinations at 45%. Phone: the plan, then
 * the list, every row at least 64px. Each destination gives its name, the
 * distance and the travel time. Pointing at a row lights its marker;
 * clicking or tapping it selects it — the row holds its state, the marker
 * stays lit and is named on the plan — until another is chosen or it is
 * tapped again.
 *
 * Markers are placed by the bearing printed on the supplied plan. That
 * drawing states orientation and no scale, so they are directions rather
 * than surveyed positions, and the caption says exactly that.
 */
const FIRST = 5;

export default function Location() {
  const [all, setAll] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const lit = hover ?? picked;

  return (
    <section id="location" aria-labelledby="loc-heading" className="section-y bg-ground">
      <div className="shell gutter">
        <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
          <h2 id="loc-heading" data-reveal className="t-section max-w-[14ch] text-ink lg:col-span-7">
            Everything important, close by.
          </h2>
          <p data-reveal className="t-body max-w-[34ch] text-ink-dim lg:col-span-4 lg:col-start-9 lg:self-end">
            Inside the ring road, with parkland and green belt on three sides.
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-y-9 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:gap-x-[clamp(2.5rem,4vw,4.5rem)]">
          <figure className="lg:sticky lg:top-28 lg:self-start">
            <div className="relative w-full overflow-hidden border border-paper-hair bg-paper">
              <Image
                src={A.locationMap.src}
                alt={A.locationMap.alt}
                width={A.locationMap.w}
                height={A.locationMap.h}
                sizes="(max-width: 1024px) 100vw, 46vw"
                quality={88}
                className="w-full"
              />
              {DISTANCES.map((d, i) => {
                const on = lit === i;
                const chosen = picked === i;
                const dim = !all && i >= FIRST && !on;
                return (
                  <span
                    key={d.place}
                    aria-hidden="true"
                    className="pointer-events-none absolute"
                    style={{ left: `${d.at[0]}%`, top: `${d.at[1]}%` }}
                  >
                    <span
                      className="absolute left-0 top-0 block -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent transition-all duration-300 ease-[var(--ease-out-quiet)]"
                      style={{
                        width: on ? 20 : 11,
                        height: on ? 20 : 11,
                        opacity: dim ? 0.3 : 1,
                        backgroundColor: on ? "var(--color-accent)" : "var(--color-paper)",
                        boxShadow: on ? "0 0 0 6px rgba(79,90,63,0.18)" : "none",
                      }}
                    />
                    {on ? (
                      <span
                        className={`t-meta absolute bottom-4 left-0 -translate-x-1/2 whitespace-nowrap rounded-[4px] px-2 py-1 ${
                          chosen ? "bg-ink text-ground" : "bg-paper text-paper-ink ring-1 ring-paper-hair"
                        }`}
                      >
                        {d.place} · {d.km.toFixed(1)} km
                      </span>
                    ) : null}
                  </span>
                );
              })}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-ground"
              />
            </div>
            <figcaption className="t-meta mt-4 text-ink-dim">
              Location plan. Markers show the direction stated on the drawing; it carries no scale.
            </figcaption>
          </figure>

          <div>
            <ul data-collapsed={!all} className="border-t hair" aria-label="Destinations">
              {DISTANCES.map((d, i) => {
                const chosen = picked === i;
                return (
                  <li key={d.place} className={`border-b hair ${i >= FIRST ? "is-extra" : ""}`}>
                    <button
                      type="button"
                      aria-pressed={chosen}
                      onClick={() => setPicked((p) => (p === i ? null : i))}
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover((h) => (h === i ? null : h))}
                      className={`grid min-h-16 w-full grid-cols-[1fr_auto] items-center gap-x-5 px-3 py-3 text-left transition-colors duration-300 -mx-3 box-content ${
                        chosen ? "bg-ground-2" : "hover:bg-ground-2/60"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="t-item flex items-center gap-2.5 text-ink">
                          <span
                            aria-hidden="true"
                            className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${chosen ? "bg-accent" : "bg-hair"}`}
                          />
                          {d.place}
                        </span>
                        <span className="t-meta mt-0.5 block pl-4 text-ink-dim">{d.detail}</span>
                      </span>
                      <span className="t-meta text-right text-ink">
                        {d.km.toFixed(1)} km
                        <span className="block text-ink-dim">{d.mins} min</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {DISTANCES.length > FIRST ? (
              <button type="button" onClick={() => setAll((v) => !v)} aria-expanded={all} className="js-only btn-text mt-4">
                {all ? "Show fewer" : `View all ${DISTANCES.length} destinations`}
                <span className="arrow inline-flex">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-4 w-4 transition-transform duration-300 ${all ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="square">
                    <path d="M6 9.5L12 15.5L18 9.5" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              </button>
            ) : null}

            <p className="t-meta mt-6 text-ink-dim">
              Distances are indicative, measured by road, and should be confirmed on site. Travel times are by car.
              No healthcare or transport distances have been supplied; the site office has them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
