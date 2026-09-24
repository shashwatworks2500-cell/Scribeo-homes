"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS } from "@/lib/content";
import { PLANS } from "@/lib/plans";

/**
 * Residences.
 *
 * One selector, one residence at a time. Four stacked cards would make the
 * reader scroll to compare what a tab row lets them flick between, and the
 * numbers that decide a purchase — area, price, bedrooms — sit in the same
 * place every time so they can be read across configurations by eye.
 *
 * On a phone the tabs scroll themselves at the screen edge; they never widen
 * the page.
 */
const bedrooms = (id: string) => (PLANS[id]?.rooms ?? []).filter((r) => /bedroom/i.test(r.name)).length;

export default function Residences() {
  const [active, setActive] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const c = CONFIGS[active];

  useEffect(() => {
    const onPick = (e: Event) => {
      const id = (e as CustomEvent<{ id?: string }>).detail?.id;
      const i = CONFIGS.findIndex((x) => x.id === id);
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

  const asset = A[c.image];

  return (
    <section id="residences" aria-labelledby="res-heading" className="section-y-lg bg-ground">
      <div className="shell gutter">
        <div className="grid grid-cols-12 gap-y-4 md:gap-x-[clamp(2rem,5vw,4rem)]">
          <h2 id="res-heading" className="t-display-m col-span-12 text-ink md:col-span-5">
            Residences
          </h2>
          <p className="t-body col-span-12 max-w-[34ch] self-end text-ink-dim md:col-span-6 md:col-start-7">
            Four configurations, 753 to 2,333 sq ft, in a single low-rise development.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Configuration"
          onKeyDown={onKeyDown}
          className="-mx-[clamp(1.25rem,5vw,6.5rem)] mt-[clamp(2.5rem,6vh,4rem)] flex gap-[clamp(1.5rem,4vw,3rem)] overflow-x-auto border-b hair px-[clamp(1.25rem,5vw,6.5rem)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {CONFIGS.map((x, i) => (
            <button
              key={x.id}
              ref={(el) => { tabs.current[i] = el; }}
              role="tab"
              aria-selected={i === active}
              aria-controls="residence-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              className={`relative flex shrink-0 items-baseline gap-3 pb-4 transition-colors duration-300 ${
                i === active ? "text-ink" : "text-ink-faint hover:text-ink-dim"
              }`}
            >
              <span className="t-numeral">{String(i + 1).padStart(2, "0")}</span>
              <span className="t-display-s">{x.bhk}</span>
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-ink transition-transform duration-400 ease-[var(--ease-out-quiet)]"
                style={{ transform: `scaleX(${i === active ? 1 : 0})` }}
              />
            </button>
          ))}
        </div>

        <div
          id="residence-panel"
          role="tabpanel"
          key={c.id}
          className="mt-[clamp(2rem,5vh,3rem)] grid grid-cols-12 gap-y-8 motion-safe:animate-[riseIn_420ms_var(--ease-out-quiet)_both] lg:gap-x-[clamp(2rem,5vw,4rem)]"
        >
          <figure className="col-span-12 lg:col-span-7">
            <div className="relative aspect-[3/2] overflow-hidden bg-ground-2">
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                quality={82}
                className="object-cover"
              />
            </div>
          </figure>

          <div className="col-span-12 lg:col-span-5 lg:self-center">
            <p className="t-display-l text-ink">{c.bhk}</p>
            <p className="t-meta text-ink-faint">{c.label}</p>

            <dl className="mt-8 border-t hair">
              {[
                ["Bedrooms", String(bedrooms(c.id))],
                ["Built-up area", `${c.builtUpSqft.toLocaleString("en-IN")} sq ft`],
                ["Price", `From ${c.priceFrom}`],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 border-b hair py-4">
                  <dt className="t-label text-ink-faint">{k}</dt>
                  <dd className="t-display-s text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
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

            <p className="t-meta mt-6 text-ink-faint">
              Indicative pricing · taxes and statutory charges additional
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
