"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { DISTANCES, PLACE_KINDS, type PlaceKind } from "@/lib/content";
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
 *
 * Filtering narrows both instruments at once. A marker that has been filtered
 * out is dimmed rather than removed, so the shape of the surroundings stays
 * legible while you look at one part of it.
 *
 * Two kinds of highlight, not one. Hover is a glance and evaporates; a click —
 * or an arrival from "Life around you" — pins a place and survives the pointer
 * wandering over the list on its way somewhere else. Hover wins while it
 * lasts, then hands back to whatever was pinned.
 */
export default function Location() {
  const [hover, setHover] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [kind, setKind] = useState<PlaceKind | null>(null);
  const shown = hover ?? pinned ?? -1;

  /* Which categories actually occur. Printing a filter that matches nothing
     is worse than printing no filter at all. */
  const kinds = useMemo(
    () => PLACE_KINDS.filter((k) => DISTANCES.some((d) => d.kind === k)),
    [],
  );
  const inFilter = (i: number) => kind === null || DISTANCES[i].kind === kind;

  const filterTo = (k: PlaceKind | null) => {
    setKind(k);
    setPinned((q) => (q !== null && k !== null && DISTANCES[q].kind !== k ? null : q));
    setHover(null);
  };

  /* "Life around you" names places; clicking one brings the reader here with
     that place lit, rather than to a list they then have to search. */
  useEffect(() => {
    const onPlace = (e: Event) => {
      const place = (e as CustomEvent<{ place?: string }>).detail?.place;
      const i = DISTANCES.findIndex((d) => d.place === place);
      if (i < 0) return;
      setKind(null);
      setHover(null);
      setPinned(i);
      document.getElementById("distances")?.scrollIntoView({ behavior: "smooth", block: "center" });
    };
    window.addEventListener("scribeo:place", onPlace);
    return () => window.removeEventListener("scribeo:place", onPlace);
  }, []);

  return (
    <section id="location" aria-labelledby="loc-heading" className="section-y bg-ground-3">
      <div className="gutter">
        <p data-reveal className="t-eyebrow text-travertine">
          11 — Location
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
                    const lit = inFilter(i);
                    const on = i === shown && lit;
                    return (
                      <button
                        key={d.place}
                        type="button"
                        tabIndex={lit ? 0 : -1}
                        aria-hidden={lit ? undefined : true}
                        onMouseEnter={() => setHover(i)}
                        onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                        onFocus={() => setHover(i)}
                        onBlur={() => setHover(null)}
                        onClick={() => setPinned((q) => (q === i ? null : i))}
                        aria-label={`${d.place}, ${d.dir}, ${d.km.toFixed(1)} km`}
                        className="absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-400 ease-[var(--ease-out-quiet)]"
                        style={{ left: `${d.at[0]}%`, top: `${d.at[1]}%`, opacity: lit ? 1 : 0.22 }}
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

            <div role="group" aria-label="Filter destinations" className="mt-7 flex flex-wrap gap-2">
              {[null, ...kinds].map((k) => {
                const on = kind === k;
                return (
                  <button
                    key={k ?? "all"}
                    type="button"
                    onClick={() => filterTo(k)}
                    aria-pressed={on}
                    className={`t-meta rounded-full border px-3.5 py-1.5 transition-colors duration-300 ${
                      on
                        ? "border-travertine bg-travertine text-paper"
                        : "border-hair text-ink-dim hover:border-rule hover:text-ink"
                    }`}
                  >
                    {k ?? "All"}
                  </button>
                );
              })}
            </div>

            <ol className="mt-[clamp(1.25rem,3vh,2rem)] border-t hair">
              {DISTANCES.map((d, i) => {
                if (!inFilter(i)) return null;
                const on = i === shown;
                return (
                  <li key={d.place} data-reveal className="border-b hair">
                    <button
                      type="button"
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover((h) => (h === i ? null : h))}
                      onFocus={() => setHover(i)}
                      onBlur={() => setHover(null)}
                      onClick={() => setPinned((q) => (q === i ? null : i))}
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
              Distances are indicative, measured by road, and should be confirmed on site. No
              healthcare or transport distances have been supplied for this development; the site
              office has them.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
