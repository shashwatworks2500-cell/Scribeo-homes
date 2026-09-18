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
          <p data-reveal className="t-eyebrow text-travertine/80">
            03 — Floor plans
          </p>
          <h2 id="plans-heading" className="t-display-m mt-6 max-w-[18ch] text-stone">
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
              borderColor: active === i ? "var(--color-travertine)" : "var(--color-hair)",
              color: active === i ? "var(--color-ink)" : "var(--color-stone-dim)",
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
        className="mt-[clamp(2rem,5vh,3rem)] grid grid-cols-12 gap-[clamp(1.5rem,4vw,3.5rem)]"
      >
        <div className="col-span-12 lg:col-span-8">
          {/* The plan is a drawing on paper: it keeps its own light register
              rather than being forced into the dark palette. */}
          <div className="relative w-full overflow-hidden bg-paper">
            <Image
              src={cfg.plan}
              alt={`${cfg.bhk} floor plan: ${cfg.label}, ${cfg.builtUpSqft} square feet built-up.`}
              width={1200}
              height={900}
              className="h-auto w-full"
              unoptimized
            />
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <h3 className="t-display-s text-stone">{cfg.label}</h3>
          <p className="mt-4 measure text-stone-dim">{cfg.blurb}</p>
          <dl className="mt-8 border-t hair">
            {[
              ["Configuration", cfg.bhk],
              ["Built-up area", `${cfg.builtUpSqft.toLocaleString("en-IN")} sq ft`],
              ["Built-up area", `${cfg.builtUpSqm} m²`],
              ["Price from", cfg.priceFrom],
              ["Price to", cfg.priceTo],
            ].map(([k, v], i) => (
              <div key={`${k}-${i}`} className="flex justify-between gap-4 border-b hair py-3.5">
                <dt className="t-meta text-stone-faint">{k}</dt>
                <dd className="t-meta text-right text-stone">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href="#enquire"
            className="mt-8 inline-flex items-baseline gap-3 border-b border-travertine/50 pb-2 transition-colors duration-300 hover:border-travertine"
          >
            <span className="t-display-s text-stone">Enquire about this plan</span>
            <span aria-hidden="true" className="t-meta text-travertine">→</span>
          </a>
          <p className="t-meta mt-6 text-stone-faint">
            Plans are indicative and not to scale. Dimensions are nominal.
          </p>
        </div>
      </div>
    </section>
  );
}
