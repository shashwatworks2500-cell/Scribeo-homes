import { DISTANCES } from "@/lib/content";
import SplitLines from "./SplitLines";

/** Key distances, set as an editorial index rather than a map of pins. */
export default function Distances() {
  return (
    <section id="distances" aria-labelledby="dist-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(2rem,5vw,4.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="t-eyebrow text-travertine">
            06 — Distances
          </p>
          <h2 id="dist-heading" className="t-display-m mt-6 max-w-[14ch] text-ink">
            <SplitLines>Everything within *a short drive*.</SplitLines>
          </h2>
          <p data-reveal className="mt-8 measure text-ink-dim">
            The development sits inside the ring road, with parkland and green belt on three sides
            and the cultural quarter reachable without leaving it.
          </p>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <ul className="border-t hair">
            {DISTANCES.map((d) => (
              <li
                key={d.place}
                data-reveal
                className="grid grid-cols-12 items-baseline gap-x-4 gap-y-1 border-b hair py-[clamp(0.875rem,2.2vh,1.25rem)]"
              >
                <span className="col-span-7 sm:col-span-5">
                  <span className="t-display-s block text-ink">{d.place}</span>
                </span>
                <span className="col-span-12 sm:col-span-4">
                  <span className="t-meta block text-ink-faint">{d.detail}</span>
                </span>
                <span className="col-span-12 sm:col-span-3 text-right">
                  <span className="t-meta block text-travertine">{d.km.toFixed(1)} km</span>
                  <span className="t-meta block text-ink-faint">{d.mins} min drive</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="t-meta mt-6 text-ink-faint">
            Distances are indicative, measured by road, and should be confirmed on site.
          </p>
        </div>
      </div>
    </section>
  );
}
