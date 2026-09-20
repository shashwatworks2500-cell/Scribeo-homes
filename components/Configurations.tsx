"use client";

import { useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS, PRICE_RANGE } from "@/lib/content";
import { PLANS, roomArea } from "@/lib/plans";
import SplitLines from "./SplitLines";

/** One plate per configuration, so selecting changes what you are looking at. */
const PLATE = {
  "1bhk": A.vLightCorner,
  "2bhk": A.livingRoom,
  "3bhk": A.indoorOutdoor,
  "4bhk": A.exteriorWide,
} as const;

/**
 * Configurations.
 *
 * The first question a visitor has, answered immediately after the hero — and
 * answered as a thing you handle rather than a table you read. Selecting a row
 * changes the plate, the areas, the price and the largest room, and tells the
 * floor plan section further down to open on the same plan. The row is a real
 * link to that section, so it still works with JavaScript off.
 */
export default function Configurations() {
  const [active, setActive] = useState(0);
  const cfg = CONFIGS[active];
  const plan = PLANS[cfg.id];
  const largest = [...plan.rooms].filter((r) => !r.out).sort((a, b) => b.w * b.h - a.w * a.h)[0];

  const pick = (i: number) => {
    setActive(i);
    window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: CONFIGS[i].id } }));
  };

  return (
    <section id="pricing" aria-labelledby="price-heading" className="section-y gutter">
      <div className="grid grid-cols-12 items-end gap-y-[clamp(1.5rem,4vh,2.5rem)]">
        <div className="col-span-12 md:col-span-5">
          <p data-reveal className="t-eyebrow text-travertine">
            05 — Configurations
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

      <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-12 gap-y-[clamp(2rem,5vh,3rem)] lg:gap-x-[clamp(2rem,5vw,4rem)]">
        {/* The list. Each row is a link first and a selector second. */}
        <ul className="col-span-12 border-t hair lg:col-span-7">
          {CONFIGS.map((c, i) => {
            const on = i === active;
            return (
              <li key={c.id} data-reveal className="border-b hair">
                <a
                  href="#residences"
                  aria-current={on ? "true" : undefined}
                  onMouseEnter={() => pick(i)}
                  onFocus={() => pick(i)}
                  onClick={() => pick(i)}
                  className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-[clamp(1.1rem,2.8vh,1.75rem)] transition-colors duration-300"
                >
                  {/* A rule that fills rather than a background that flashes. */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-travertine transition-transform duration-500 ease-[var(--ease-out-quiet)]"
                    style={{ transform: `scaleX(${on ? 1 : 0})` }}
                  />
                  <span className="col-span-7 sm:col-span-3">
                    <span
                      className={`t-display-s block transition-colors duration-300 ${on ? "text-travertine" : "text-ink"}`}
                    >
                      {c.bhk}
                    </span>
                  </span>
                  <span className="col-span-5 sm:col-span-3">
                    <span className="t-meta block text-ink-faint">{c.label}</span>
                  </span>
                  <span className="col-span-6 sm:col-span-3">
                    <span className="t-meta block text-ink-faint">Built-up</span>
                    <span className="t-meta block text-ink">{c.builtUpSqft.toLocaleString("en-IN")} sq ft</span>
                  </span>
                  <span className="col-span-6 sm:col-span-3 text-right sm:text-left">
                    <span className="t-meta block text-ink-faint">From</span>
                    <span className="t-meta block text-ink">{c.priceFrom}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* The plate and the read-out change with the selection. */}
        <div className="col-span-12 lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-ground-2 lg:aspect-[3/4]">
            {CONFIGS.map((c, i) => (
              <Image
                key={c.id}
                src={PLATE[c.id as keyof typeof PLATE].src}
                alt={PLATE[c.id as keyof typeof PLATE].alt}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                quality={82}
                priority={i === 0}
                className="object-cover transition-opacity duration-700 ease-[var(--ease-out-quiet)]"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
          <dl aria-live="polite" className="mt-5 border-t hair">
            {[
              ["Selected", `${cfg.bhk} — ${cfg.label}`],
              ["Largest room", `${largest.name}, ${roomArea(largest)}`],
              ["Footprint", `${plan.w.toFixed(1)} × ${plan.h.toFixed(1)} m`],
              ["Price", `${cfg.priceFrom} — ${cfg.priceTo}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-4 border-b hair py-3">
                <dt className="t-meta text-ink-faint">{k}</dt>
                <dd className="t-meta text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#residences"
            className="group mt-6 inline-flex items-baseline gap-3 border-b border-travertine/70 pb-2 transition-colors duration-300 hover:border-travertine"
          >
            <span className="t-display-s text-ink">See the {cfg.bhk} plan</span>
            <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>

      <p className="t-meta mt-[clamp(1.5rem,4vh,2.5rem)] max-w-[52ch] text-ink-faint">
        Prices are indicative and exclude stamp duty, registration, applicable taxes and maintenance
        deposits. The site office issues the current price list.
      </p>
    </section>
  );
}
