"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CONFIGS } from "@/lib/content";
import { PLANS } from "@/lib/plans";
import PlanViewer from "./PlanViewer";
import SplitLines from "./SplitLines";

/**
 * Floor plans.
 *
 * The plans are drawn SVG, not renders: room names, dimensions and the
 * dimension chain have to be readable, and generated imagery produces
 * unreadable lettering.
 *
 * The switcher is a real ARIA tablist — arrow keys move between plans, Home
 * and End jump to the ends, each panel is labelled by its tab — and it is the
 * same selection the configurations table drives, so choosing a plan up the
 * page brings you to the drawing for it.
 */
export default function FloorPlans() {
  const [active, setActive] = useState(0);
  const [full, setFull] = useState(false);
  const uid = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  /* The configurations table and the plan viewer are one product: selecting a
     configuration anywhere selects it here. An event rather than shared state
     so neither section has to know the other exists. */
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
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = active === last ? 0 : active + 1;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = active === 0 ? last : active - 1;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = last;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  const closeFull = useCallback(() => setFull(false), []);
  const cfg = CONFIGS[active];
  const plan = PLANS[cfg.id];

  return (
    <section ref={sectionRef} id="residences" aria-labelledby="plans-heading" className="section-y gutter">
      <p data-reveal className="t-eyebrow text-travertine">
        06 — Floor plans
      </p>
      <h2 id="plans-heading" className="t-display-m mt-6 max-w-[18ch] text-ink">
        <SplitLines>Every room given *something to face*.</SplitLines>
      </h2>

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
          <PlanViewer plan={plan} label={cfg.label} onClose={() => setFull(true)} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <h3 className="t-display-s text-ink">{cfg.label}</h3>
          <p className="mt-4 measure text-ink-dim">{cfg.blurb}</p>
          <dl className="mt-8 border-t hair">
            {[
              ["Configuration", cfg.bhk],
              ["Rooms drawn", `${plan.rooms.length}`],
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
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: { config: cfg.bhk } }))}
            className="group mt-8 inline-flex items-baseline gap-3 border-b border-travertine/70 pb-2 transition-colors duration-300 hover:border-travertine"
          >
            <span className="t-display-s text-ink">Request a private viewing</span>
            <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
          <p className="t-meta mt-6 text-ink-faint">
            Plans are indicative and not to scale. Dimensions are nominal.
          </p>
        </div>
      </div>

      {full ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${cfg.label} floor plan, full screen`}
          className="fixed inset-0 z-[97] flex flex-col bg-ground p-[clamp(0.75rem,2.5vw,1.75rem)]"
        >
          <div className="mb-3 flex items-baseline justify-between gap-6">
            <p className="t-eyebrow text-travertine">
              {cfg.bhk} — {cfg.label}
            </p>
            <p className="t-meta text-ink-faint">{cfg.builtUpSqft.toLocaleString("en-IN")} sq ft</p>
          </div>
          <PlanViewer plan={plan} label={cfg.label} fullscreen onClose={closeFull} />
        </div>
      ) : null}
    </section>
  );
}
