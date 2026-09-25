"use client";

import { useEffect, useState } from "react";
import { CONFIGS } from "@/lib/content";
import { PLANS, roomDims } from "@/lib/plans";
import PlanViewer from "./PlanViewer";
import Tabs from "./Tabs";

/**
 * Floor plans.
 *
 * Desktop: 35% information — the configuration, its area, its price, its
 * principal rooms and the one action — beside a 65% drawing. Phone: the
 * selector, then the drawing, then the information and the action beneath
 * it. "View Floor Plan" anywhere on the page arrives here with that plan
 * already chosen.
 */
const KEY = ["Living & Dining", "Master Bedroom", "Bedroom", "Kitchen", "Balcony"];

export default function FloorPlans() {
  const [active, setActive] = useState(2);
  const cfg = CONFIGS[active];
  const rooms = PLANS[cfg.id]?.rooms ?? [];
  const key = KEY.flatMap((n) => {
    const r = rooms.find((x) => x.name === n);
    return r ? [[r.name, roomDims(r)] as const] : [];
  }).slice(0, 4);

  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      const i = CONFIGS.findIndex((c) => c.id === id);
      if (i >= 0) setActive(i);
    };
    window.addEventListener("scribeo:config", onPick);
    return () => window.removeEventListener("scribeo:config", onPick);
  }, []);

  return (
    <section id="plans" aria-labelledby="plans-heading" className="section-y-lg bg-ground-2">
      <div className="shell gutter">
        <h2 id="plans-heading" data-reveal className="t-section text-ink">
          Floor plans
        </h2>

        <div className="mt-[clamp(2rem,4vw,3rem)]">
          <Tabs
            items={CONFIGS.map((x) => ({ id: x.id, label: x.bhk }))}
            active={active}
            onChange={setActive}
            label="Floor plan configuration"
            idPrefix="plan"
            panelId="plan-panel"
          />
        </div>

        <div
          id="plan-panel"
          role="tabpanel"
          aria-labelledby={`plan-tab-${cfg.id}`}
          className="mt-[clamp(2rem,4vw,3.5rem)] grid gap-y-9 lg:grid-cols-[minmax(0,35fr)_minmax(0,65fr)] lg:gap-x-[clamp(2.5rem,4vw,4.5rem)]"
        >
          <div className="order-2 lg:order-1">
            <h3 className="t-sub text-ink">{cfg.bhk}</h3>
            <p className="t-meta mt-1 text-ink-dim">{cfg.label}</p>

            <dl className="mt-7 border-t hair">
              <div className="flex items-baseline justify-between gap-5 border-b hair py-4">
                <dt className="t-label text-ink-dim">Built-up area</dt>
                <dd className="t-value text-ink">{cfg.builtUpSqft.toLocaleString("en-IN")} sq ft</dd>
              </div>
              <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1 border-b hair py-4">
                <dt className="t-label text-ink-dim">Price</dt>
                <dd className="t-value ml-auto whitespace-nowrap text-right text-ink">
                  {cfg.priceFrom} – {cfg.priceTo}
                </dd>
              </div>
            </dl>

            <p className="t-label mt-8 text-ink-dim">Principal rooms</p>
            <dl className="mt-3 border-t hair">
              {key.map(([n, d]) => (
                <div key={n} className="flex items-baseline justify-between gap-5 border-b hair py-3">
                  <dt className="t-meta text-ink-dim">{n}</dt>
                  <dd className="t-meta text-ink">{d}</dd>
                </div>
              ))}
            </dl>

            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: { config: cfg.bhk } }))}
              className="btn btn-primary mt-8 w-full sm:w-auto"
            >
              Request This Plan
            </button>

            <p className="t-meta mt-5 text-ink-dim">Plans are indicative and not to scale. Dimensions are nominal.</p>
          </div>

          <div className="order-1 lg:order-2">
            <PlanViewer key={cfg.id} plan={PLANS[cfg.id]} label={cfg.bhk} />
          </div>
        </div>
      </div>
    </section>
  );
}
