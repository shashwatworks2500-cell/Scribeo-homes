"use client";

import { AROUND } from "@/lib/story";
import { DISTANCES } from "@/lib/content";

/**
 * Life around you.
 *
 * The distance table answers "how far"; it does not answer "and then what".
 * This reads the same eight destinations back as four parts of a week, and
 * every place named is a live control: it lights that marker on the plan
 * above rather than leaving the reader to go and find it.
 *
 * Drive times are pulled from the same table, so there is one set of numbers
 * on this page and not two.
 */
export default function Around() {
  const mins = (place: string) => DISTANCES.find((d) => d.place === place)?.mins;

  const go = (place: string) =>
    window.dispatchEvent(new CustomEvent("scribeo:place", { detail: { place } }));

  return (
    <section id="around" aria-labelledby="around-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(2rem,5vh,3rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="t-eyebrow text-travertine">
            12 — Life around you
          </p>
          <h2 id="around-heading" className="t-display-m mt-6 max-w-[14ch] text-ink">
            A week, not a radius.
          </h2>
          <p data-reveal className="mt-6 measure text-ink-dim">
            Touch a place and it lights on the plan above. Times are the drive times from the
            index — the same numbers, read a different way.
          </p>
        </div>

        <ol className="col-span-12 border-t hair md:col-span-7 md:col-start-6">
          {AROUND.map((part) => (
            <li
              key={part.when}
              data-reveal
              className="grid grid-cols-12 gap-x-4 gap-y-3 border-b hair py-[clamp(1.25rem,3vh,1.9rem)]"
            >
              <p className="t-eyebrow col-span-12 text-ink-faint sm:col-span-3">{part.when}</p>
              <div className="col-span-12 sm:col-span-9">
                <p className="t-display-s max-w-[28ch] text-ink">{part.line}</p>
                <div className="mt-4 flex flex-wrap gap-x-2 gap-y-2">
                  {part.places.map((place) => {
                    const m = mins(place);
                    return (
                      <button
                        key={place}
                        type="button"
                        onClick={() => go(place)}
                        className="t-meta group inline-flex items-baseline gap-2 rounded-full border border-hair px-3.5 py-1.5 text-ink-dim transition-colors duration-300 hover:border-travertine hover:text-ink"
                      >
                        {place}
                        {m ? (
                          <span className="text-ink-faint transition-colors duration-300 group-hover:text-travertine">
                            {m} min
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
