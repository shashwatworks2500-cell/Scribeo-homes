import { CONFIGS, PRICE_RANGE } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Price band. The first question a visitor has, answered immediately after the
 * hero rather than buried at the foot of the page.
 */
export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="price-heading" className="section-y gutter">
      <div className="grid grid-cols-12 items-end gap-y-[clamp(1.5rem,4vh,2.5rem)]">
        <div className="col-span-12 md:col-span-5">
          <p data-reveal className="t-eyebrow text-travertine">
            01 — Configurations
          </p>
          <h2 id="price-heading" className="t-display-m mt-6 max-w-[16ch] text-ink">
            <SplitLines>Four plans. One *language*.</SplitLines>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <p data-reveal className="t-meta text-ink-faint">Price range</p>
          <p data-reveal className="t-display-l mt-3 text-ink">
            {PRICE_RANGE.min}
            <span className="mx-[0.3em] text-travertine">—</span>
            {PRICE_RANGE.max}
          </p>
        </div>
      </div>

      <ul className="mt-[clamp(2.5rem,6vh,4rem)] border-t hair">
        {CONFIGS.map((c) => (
          <li key={c.id} data-reveal className="border-b hair">
            <a
              href="#residences"
              className="group grid grid-cols-12 items-baseline gap-x-4 gap-y-2 py-[clamp(1.25rem,3vh,2rem)] transition-colors duration-300 hover:bg-ground-2/60"
            >
              <span className="col-span-4 sm:col-span-2">
                <span className="t-display-s block text-ink transition-colors group-hover:text-travertine">
                  {c.bhk}
                </span>
              </span>
              <span className="col-span-8 sm:col-span-3">
                <span className="t-meta block text-ink-dim">{c.label}</span>
              </span>
              <span className="col-span-6 sm:col-span-3">
                <span className="t-meta block text-ink-faint">Built-up</span>
                <span className="t-meta block text-ink">
                  {c.builtUpSqft.toLocaleString("en-IN")} sq ft
                </span>
              </span>
              <span className="col-span-6 sm:col-span-3">
                <span className="t-meta block text-ink-faint">From</span>
                <span className="t-meta block text-ink">{c.priceFrom}</span>
              </span>
              <span
                aria-hidden="true"
                className="col-span-12 text-right text-travertine transition-transform duration-300 group-hover:translate-x-1 sm:col-span-1"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="t-meta mt-6 max-w-[62ch] text-ink-faint">
        Prices are indicative and exclude stamp duty, registration, applicable taxes and
        maintenance deposits. The site office issues the current price list.
      </p>
    </section>
  );
}
