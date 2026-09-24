"use client";

import { useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { DISTANCES } from "@/lib/content";

/**
 * Where it is.
 *
 * The plan, and the five places worth knowing first. The full index opens
 * behind one control rather than filling the screen — this used to be a
 * category-filtered instrument beside a paragraph of prose, which was more
 * apparatus than the question deserves.
 *
 * Markers are placed by the bearing printed on the supplied plan. That
 * drawing states orientation and no scale, so they are directions rather
 * than surveyed positions, and the caption says exactly that.
 */
const FIRST = 5;

export default function Location() {
  const [all, setAll] = useState(false);
  const [hover, setHover] = useState<number | null>(null);


  return (
    <section id="location" aria-labelledby="loc-heading" className="section-y gutter">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 id="loc-heading" className="t-display-m max-w-[16ch] text-ink">
          Everything important, close by.
        </h2>
        <p className="t-body max-w-[32ch] text-ink-dim">
          Inside the ring road, with parkland and green belt on three sides.
        </p>
      </div>

      {/* No per-row reveal on the index. The three rows behind "View all"
          start display:none, and a reveal trigger never fires for an element
          with no layout — so they would have appeared at opacity zero the
          moment someone expanded the list. A short list needs no entrance
          animation anyway. */}
      <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-12 gap-y-[clamp(2rem,5vh,3rem)] lg:gap-x-[clamp(2rem,5vw,4rem)]">
        <figure className="col-span-12 lg:col-span-7">
          <div className="relative w-full overflow-hidden border border-paper-hair bg-paper">
            <Image
              src={A.locationMap.src}
              alt={A.locationMap.alt}
              width={A.locationMap.w}
              height={A.locationMap.h}
              sizes="(max-width: 1024px) 100vw, 56vw"
              quality={90}
              className="w-full"
            />
            {DISTANCES.map((d, i) => {
              const lit = hover === i;
              const dim = !all && i >= FIRST;
              return (
                <span
                  key={d.place}
                  aria-hidden="true"
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ease-[var(--ease-out-quiet)]"
                  style={{
                    left: `${d.at[0]}%`,
                    top: `${d.at[1]}%`,
                    width: lit ? 18 : 9,
                    height: lit ? 18 : 9,
                    opacity: dim ? 0.24 : 1,
                    borderColor: "var(--color-travertine)",
                    backgroundColor: lit ? "var(--color-travertine)" : "rgba(251,250,247,0.85)",
                  }}
                />
              );
            })}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-ground"
            />
          </div>
          <figcaption className="t-meta mt-4 text-ink-faint">
            Location plan. Markers show the direction stated on the drawing; it carries no scale.
          </figcaption>
        </figure>

        <div id="distances" className="col-span-12 scroll-mt-28 lg:col-span-5">
          <ol data-collapsed={!all} className="border-t hair">
            {DISTANCES.map((d, i) => (
              <li
                key={d.place}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                className={`flex items-baseline justify-between gap-5 border-b hair py-[clamp(0.8rem,2vh,1.1rem)] ${
                  i >= FIRST ? "is-extra" : ""
                }`}
              >
                <span className="t-display-s text-ink">{d.place}</span>
                <span className="t-meta shrink-0 text-ink-dim">
                  {d.km.toFixed(1)} km · {d.mins} min
                </span>
              </li>
            ))}
          </ol>

          {DISTANCES.length > FIRST ? (
            <button
              type="button"
              onClick={() => setAll((v) => !v)}
              aria-expanded={all}
              className="js-only btn-text mt-5 text-ink-dim"
            >
              {all ? "Show fewer" : `View all ${DISTANCES.length} distances`}
              <span aria-hidden="true" className="arrow text-travertine">
                →
              </span>
            </button>
          ) : null}

          <p className="t-meta mt-6 text-ink-faint">
            Distances are indicative, measured by road, and should be confirmed on site. No
            healthcare or transport distances have been supplied; the site office has them.
          </p>
        </div>
      </div>
    </section>
  );
}
