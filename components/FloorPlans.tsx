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
    <section id="plans" aria-labelledby="plans-heading" className="section-y gutter bg-ground-2">
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
          className="-mx-[clamp(1.1rem,5vw,2rem)] flex max-w-full snap-x gap-1 overflow-x-auto px-[clamp(1.1rem,5vw,2rem)] sm:mx-0 sm:inline-flex sm:rounded-full sm:border sm:border-hair sm:p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              className={`t-meta shrink-0 snap-start rounded-full px-4 py-2 transition-colors duration-300 ${
                i === active
                  ? "bg-travertine text-paper shadow-[inset_0_0_0_1px_var(--color-travertine)]"
                  : "border border-hair text-ink-dim hover:border-rule hover:text-ink sm:border-transparent"
              }`}
            >
              {c.bhk}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[clamp(2rem,5vh,3rem)] grid grid-cols-12 gap-y-8 lg:gap-x-[clamp(2rem,5vw,4rem)]">
        <div className="col-span-12 lg:col-span-8">
          <PlanViewer key={cfg.id} plan={PLANS[cfg.id]} label={cfg.bhk} />
        </div>

        <div className="col-span-12 lg:col-span-4">
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
            className="group mt-7 inline-flex items-baseline gap-3 border-b border-travertine pb-2"
          >
            <span className="t-display-s text-ink">Request this plan</span>
            <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>

          <p className="t-meta mt-6 text-ink-faint">
            Plans are indicative and not to scale. Dimensions are nominal.
          </p>
        </div>
      </div>
    </section>
  );
}
