"use client";

import { useEffect, useRef, useState } from "react";
import { CONFIGS } from "@/lib/content";
import { PLANS, roomDims } from "@/lib/plans";
import PlanViewer from "./PlanViewer";

/**
 * Floor plans.
 *
 * Choose a configuration, see it large, zoom it, ask for it. The screen used
 * to carry a full specification table beside the drawing; what helps someone
 * choose is the drawing itself and four room sizes, so that is what is here.
 */

const KEY = ["Living & Dining", "Master Bedroom", "Bedroom", "Kitchen", "Balcony"];

export default function FloorPlans() {
  const [active, setActive] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const cfg = CONFIGS[active];
  const rooms = PLANS[cfg.id]?.rooms ?? [];
  const key = KEY.flatMap((n) => {
    const r = rooms.find((x) => x.name === n);
    return r ? [[r.name, roomDims(r)] as const] : [];
  }).slice(0, 4);

  /* Choosing a residence elsewhere on the page brings its plan up here. */
  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      const i = CONFIGS.findIndex((c) => c.id === id);
      if (i >= 0) setActive(i);
    };
    window.addEventListener("scribeo:config", onPick);
    return () => window.removeEventListener("scribeo:config", onPick);
  }, []);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = CONFIGS.length - 1;
    let next: number | null = null;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="plans" aria-labelledby="plans-heading" className="section-y-lg bg-ground-2">
      <div className="shell gutter">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5">
        <h2 id="plans-heading" className="t-display-m max-w-[13ch] text-ink">
          Floor plans.
        </h2>

        {/* Segmented selector. One control, four states, no scrolling. */}
        <div
          role="tablist"
          aria-label="Configuration"
          onKeyDown={onKeyDown}
          /* -mx-gutter + px lets the row bleed to the screen edge and scroll
             itself on a narrow phone, instead of widening the page. */
          className="-mx-[clamp(1.25rem,5vw,6.5rem)] flex max-w-full gap-[clamp(1.25rem,3vw,2rem)] overflow-x-auto px-[clamp(1.25rem,5vw,6.5rem)] sm:mx-0 sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CONFIGS.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              role="tab"
              aria-selected={i === active}
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`t-display-s relative shrink-0 pb-3 transition-colors duration-300 ${
                i === active ? "text-ink" : "text-ink-faint hover:text-ink-dim"
              }`}
            >
              {c.bhk}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-400 ease-[var(--ease-out-quiet)]"
                style={{ transform: `scaleX(${i === active ? 1 : 0})` }}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[clamp(2rem,5vh,3rem)] grid grid-cols-12 gap-y-8 lg:gap-x-[clamp(2rem,5vw,4rem)]">
        {/* Information first in the source so a screen reader and a phone
            both meet the numbers before the drawing; the grid puts it left
            of a 65% canvas on a wide screen. */}
        <div className="order-2 col-span-12 lg:order-1 lg:col-span-4">
          <p className="t-label text-travertine">{cfg.label}</p>
          <p className="t-display-m mt-3 text-ink">
            {cfg.builtUpSqft.toLocaleString("en-IN")} <span className="t-display-s">sq ft</span>
          </p>
          <p className="t-meta mt-2 text-ink-dim">
            {cfg.priceFrom} – {cfg.priceTo}
          </p>

          <dl className="mt-7 border-t hair">
            {key.map(([n, d]) => (
              <div key={n} className="flex items-baseline justify-between gap-5 border-b hair py-3">
                <dt className="t-meta text-ink-dim">{n}</dt>
                <dd className="t-meta text-ink">{d}</dd>
              </div>
            ))}
          </dl>

          <button
            type="button"
            onClick={() =>
              window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: { config: cfg.bhk } }))
            }
            className="btn btn-primary mt-7"
          >
            Request This Plan
          </button>

          <p className="t-meta mt-6 text-ink-faint">
            Plans are indicative and not to scale. Dimensions are nominal.
          </p>
        </div>

        <div className="order-1 col-span-12 lg:order-2 lg:col-span-8">
          <PlanViewer key={cfg.id} plan={PLANS[cfg.id]} label={cfg.bhk} />
        </div>
      </div>
      </div>
    </section>
  );
}
