"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS } from "@/lib/content";
import { PLANS } from "@/lib/plans";
import { useSwap } from "@/lib/useSwap";
import Tabs from "./Tabs";

/**
 * Residences — the primary discovery area.
 *
 * One selector, one residence at a time: the picture on the left, and on
 * the right the numbers that decide a purchase, always in the same place so
 * they can be compared across configurations by eye. Changing residence
 * fades and lifts the old panel away and settles the new one in (440ms);
 * the four photographs are stacked and already decoded, so the swap never
 * waits on a download.
 */
const bedrooms = (id: string) => (PLANS[id]?.rooms ?? []).filter((r) => /bedroom/i.test(r.name)).length;

export default function Residences() {
  const [active, setActive] = useState(2);
  const { shown, className } = useSwap(active);
  const c = CONFIGS[shown];

  /* Search and the floor plans can choose a residence from elsewhere. */
  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      const i = CONFIGS.findIndex((x) => x.id === id);
      if (i >= 0) setActive(i);
    };
    window.addEventListener("scribeo:config", onPick);
    return () => window.removeEventListener("scribeo:config", onPick);
  }, []);

  return (
    <section id="residences" aria-labelledby="res-heading" className="section-y-lg bg-ground">
      <div className="shell gutter">
        <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
          <h2 id="res-heading" data-reveal className="t-section text-ink lg:col-span-6">
            Residences
          </h2>
          <p data-reveal className="t-body max-w-[34ch] text-ink-dim lg:col-span-5 lg:col-start-8 lg:self-end">
            Four configurations, 753 to 2,333 sq ft, in a single low-rise development.
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)]">
          <Tabs
            items={CONFIGS.map((x) => ({ id: x.id, label: x.bhk }))}
            active={active}
            onChange={setActive}
            label="Residence configuration"
            idPrefix="res"
            panelId="residence-panel"
          />
        </div>

        <div
          id="residence-panel"
          role="tabpanel"
          aria-labelledby={`res-tab-${c.id}`}
          className={`mt-[clamp(2rem,4vw,3.5rem)] grid gap-y-9 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)] ${className}`}
        >
          <figure className="relative aspect-[3/2] overflow-hidden bg-ground-2 lg:col-span-7">
            {CONFIGS.map((x, i) => {
              const a = A[x.image];
              return (
                <Image
                  key={x.id}
                  src={a.src}
                  alt={i === shown ? a.alt : ""}
                  aria-hidden={i === shown ? undefined : true}
                  fill
                  sizes="(max-width: 1024px) 100vw, 52vw"
                  quality={82}
                  className={`object-cover ${i === shown ? "opacity-100" : "opacity-0"}`}
                />
              );
            })}
          </figure>

          <div className="lg:col-span-5 lg:self-center">
            <h3 className="t-sub text-ink">{c.bhk}</h3>
            <p className="t-meta mt-1 text-ink-dim">{c.label}</p>

            <dl className="mt-7 border-t hair">
              {[
                ["Bedrooms", String(bedrooms(c.id))],
                ["Built-up area", `${c.builtUpSqft.toLocaleString("en-IN")} sq ft`],
                ["Price", `From ${c.priceFrom}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b hair py-4">
                  <dt className="t-label text-ink-dim">{k}</dt>
                  <dd className="t-value text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <a
                href="#plans"
                className="btn btn-primary"
                onClick={() => window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: c.id } }))}
              >
                View Floor Plan
              </a>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: { config: c.bhk } }))}
              >
                Book a Site Visit
              </button>
            </div>

            <p className="t-meta mt-6 text-ink-dim">Indicative pricing · taxes and statutory charges additional</p>
          </div>
        </div>
      </div>
    </section>
  );
}
