"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import { CONFIGS } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Floor plans.
 *
 * The plans are drawn SVG, not renders: room names, dimensions and the
 * dimension chain have to be readable, and generated imagery produces
 * unreadable lettering.
 *
 * The switcher is a real ARIA tablist — arrow keys move between plans, Home
 * and End jump to the ends, and each panel is labelled by its tab.
 */
export default function FloorPlans() {
  const [active, setActive] = useState(0);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = CONFIGS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const cfg = CONFIGS[active];

  return (
    <section id="residences" aria-labelledby="plans-heading" className="section-y gutter">
      <div className="grid grid-cols-12 items-end gap-y-6">
        <div className="col-span-12 md:col-span-7">
          <p data-reveal className="t-eyebrow text-travertine">
            03 — Floor plans
          </p>
          <h2 id="plans-heading" className="t-display-m mt-6 max-w-[18ch] text-ink">
            <SplitLines>Every room given *something to face*.</SplitLines>
          </h2>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Floor plan configurations"
        onKeyDown={onKeyDown}
        className="mt-[clamp(2rem,5vh,3rem)] flex flex-wrap gap-2 border-b hair pb-4"
      >
        {CONFIGS.map((c, i) => (
          <button
            key={c.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            role="tab"
            type="button"
            id={`${uid}-tab-${c.id}`}
            aria-selected={active === i}
            aria-controls={`${uid}-panel-${c.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className="t-meta border px-5 py-2.5 transition-colors duration-300"
            style={{
              borderColor: active === i ? "var(--color-travertine)" : "var(--color-rule)",
              color: active === i ? "var(--color-ground)" : "var(--color-ink-dim)",
              backgroundColor: active === i ? "var(--color-travertine)" : "transparent",
            }}
          >
            {c.bhk}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`${uid}-panel-${cfg.id}`}
        aria-labelledby={`${uid}-tab-${cfg.id}`}
        className="mt-[clamp(2rem,5vh,3rem)] grid grid-cols-12 gap-y-[clamp(1.5rem,4vw,3.5rem)] lg:gap-x-[clamp(1.5rem,4vw,3.5rem)]"
      >
        <div className="col-span-12 lg:col-span-8">
          {/* The plan is a drawing on a sheet. The page is light too now, so the
              sheet needs a hairline edge or it dissolves into the page.

              The sheet's ratio is fixed, and every drawing is contained inside
              it. The four plans are 595x575, 705x658, 843x722 and 963x805 —
              1.04 to 1.20 — and the box previously declared 1200x900 (1.33),
              so it reserved the wrong space and grew 204px the moment a plan
              decoded, shifting everything below it. A single ratio, set to the
              tallest of the four, both reserves the space exactly and stops
              the page resizing every time someone switches tab. */}
          <div
            className="relative w-full overflow-hidden border border-paper-hair bg-paper"
            style={{ aspectRatio: "595 / 575" }}
          >
            <Image
              src={cfg.plan}
              alt={`${cfg.bhk} floor plan: ${cfg.label}, ${cfg.builtUpSqft} square feet built-up.`}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-contain"
              unoptimized
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <h3 className="t-display-s text-ink">{cfg.label}</h3>
          <p className="mt-4 measure text-ink-dim">{cfg.blurb}</p>
          <dl className="mt-8 border-t hair">
            {[
              ["Configuration", cfg.bhk],
              ["Built-up area", `${cfg.builtUpSqft.toLocaleString("en-IN")} sq ft`],
              ["Built-up area", `${cfg.builtUpSqm} m²`],
              ["Price from", cfg.priceFrom],
              ["Price to", cfg.priceTo],
            ].map(([k, v], i) => (
              <div key={`${k}-${i}`} className="flex justify-between gap-4 border-b hair py-3.5">
                <dt className="t-meta text-ink-faint">{k}</dt>
                <dd className="t-meta text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#enquire"
            className="mt-8 inline-flex items-baseline gap-3 border-b border-travertine/70 pb-2 transition-colors duration-300 hover:border-travertine"
          >
            <span className="t-display-s text-ink">Enquire about this plan</span>
            <span aria-hidden="true" className="t-meta text-travertine">→</span>
          </a>
          <p className="t-meta mt-6 text-ink-faint">
            Plans are indicative and not to scale. Dimensions are nominal.
          </p>
        </div>
      </div>
    </section>
  );
}
