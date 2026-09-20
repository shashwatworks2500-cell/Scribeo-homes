"use client";

import { useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { DISTANCES } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Location, and what is around it, as one thing.
 *
 * They were two sections: a drawing you could not interrogate, then a list of
 * distances with nothing to point at. Together they answer the question
 * properly — the index and the plan are the same instrument, and pointing at
 * either end lights up the other.
 *
 * The markers are placed by the bearing printed on the supplied plan. That
 * drawing states orientation and no scale, so these are directions rather
 * than surveyed positions, and the caption says exactly that.
 */
export default function Location() {
  const [active, setActive] = useState<number | null>(null);
  const shown = active ?? -1;

  return (
    <section id="location" aria-labelledby="loc-heading" className="section-y bg-ground-3">
      <div className="gutter">
        <p data-reveal className="t-eyebrow text-travertine">
          10 — Location
        </p>
        <h2 id="loc-heading" className="t-display-m mt-6 max-w-[17ch] text-ink">
          <SplitLines>Held inside the green. *Not outside the city.*</SplitLines>
        </h2>

        <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-12 gap-y-[clamp(2rem,5vh,3rem)] lg:gap-x-[clamp(2rem,5vw,4rem)]">
          {/* The plan, with a marker per destination. Sticky on a tall screen
              so the index scrolls against it instead of away from it. */}
          <div className="col-span-12 lg:col-span-7">
            <div className="lg:sticky lg:top-[clamp(5rem,12vh,7rem)]">
              <figure data-reveal className="relative">
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
                    const on = i === shown;
                    return (
                      <button
                        key={d.place}
                        type="button"
                        onMouseEnter={() => setActive(i)}
                        onMouseLeave={() => setActive((a) => (a === i ? null : a))}
                        onFocus={() => setActive(i)}
                        onBlur={() => setActive(null)}
                        aria-label={`${d.place}, ${d.dir}, ${d.km.toFixed(1)} km`}
                        className="absolute -translate-x-1/2 -translate-y-1/2"
                        style={{ left: `${d.at[0]}%`, top: `${d.at[1]}%` }}
                      >
                        <span
                          aria-hidden="true"
                          className="block rounded-full border transition-all duration-300 ease-[var(--ease-out-quiet)]"
                          style={{
                            width: on ? 18 : 9,
                            height: on ? 18 : 9,
                            borderColor: "var(--color-travertine)",
                            backgroundColor: on ? "var(--color-travertine)" : "rgba(251,250,247,0.85)",
                          }}
                        />
                      </button>
                    );
                  })}
                  {/* The development itself, always marked. */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-ground"
                  />
                </div>
                <figcaption className="t-meta mt-4 text-ink-dim">
                  Fig. 04 — Location plan. Markers show the direction stated on the drawing; it
                  carries no scale.
                </figcaption>
              </figure>
            </div>
          </div>

          {/* The index. Reading order is nearest first. */}
          <div id="distances" className="col-span-12 scroll-mt-28 lg:col-span-5">
            <p data-reveal className="t-eyebrow text-travertine">
              Key distances
            </p>
            <p data-reveal className="mt-5 measure text-ink-dim">
              The development sits inside the ring road, with parkland and green belt on three
              sides and the cultural quarter reachable without leaving it.
            </p>
            <ol className="mt-[clamp(1.5rem,4vh,2.5rem)] border-t hair">
              {DISTANCES.map((d, i) => {
                const on = i === shown;
                return (
                  <li key={d.place} data-reveal className="border-b hair">
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onMouseLeave={() => setActive((a) => (a === i ? null : a))}
                      onFocus={() => setActive(i)}
                      onBlur={() => setActive(null)}
                      aria-pressed={on}
                      className="relative grid w-full grid-cols-12 items-baseline gap-x-3 gap-y-1 py-[clamp(0.7rem,1.8vh,1rem)] text-left"
                    >
                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-travertine transition-transform duration-400 ease-[var(--ease-out-quiet)]"
                        style={{ transform: `scaleX(${on ? 1 : 0})` }}
                      />
                      <span className="t-numeral col-span-2 text-ink-faint sm:col-span-1">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="col-span-10 sm:col-span-6">
                        <span
                          className={`t-display-s block transition-colors duration-300 ${on ? "text-travertine" : "text-ink"}`}
                        >
                          {d.place}
                        </span>
                        <span className="t-meta block text-ink-faint">{d.dir}</span>
                      </span>
                      <span className="col-span-12 text-right sm:col-span-5">
                        <span className="t-meta block text-ink">{d.km.toFixed(1)} km</span>
                        <span className="t-meta block text-ink-faint">{d.mins} min drive</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
            <p className="t-meta mt-5 text-ink-faint">
              Distances are indicative, measured by road, and should be confirmed on site.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
