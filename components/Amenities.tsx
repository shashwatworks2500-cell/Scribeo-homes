"use client";

import { revealInRow } from "@/lib/reveal-tab";
import { useRef, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { AMENITIES } from "@/lib/content";
import { useSwap } from "@/lib/useSwap";

/**
 * Amenities, in the four categories: Leisure, Wellness, Landscape, Everyday.
 *
 * Desktop: category navigation on the left, held in view while the panel
 * beside it is read; the panel is a large picture, a description and the
 * list. Phone: the categories as a row across the top, then the picture,
 * heading, description and list.
 *
 * Changing category crossfades the pictures — all four are stacked and
 * loaded, so it is a true dissolve, never a blank frame — and fades the
 * words out and back in. 440–450ms, no travel beyond a few pixels.
 */
export default function Amenities() {
  const [i, setI] = useState(0);
  const { shown, className } = useSwap(i);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = AMENITIES[shown];

  const pick = (n: number, focus: boolean) => {
    setI(n);
    const el = tabs.current[n];
    if (focus) el?.focus({ preventScroll: true });
    revealInRow(el);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = AMENITIES.length - 1;
    const fwd = e.key === "ArrowRight" || e.key === "ArrowDown";
    const back = e.key === "ArrowLeft" || e.key === "ArrowUp";
    const next = fwd ? (i === last ? 0 : i + 1) : back ? (i === 0 ? last : i - 1) : e.key === "Home" ? 0 : e.key === "End" ? last : null;
    if (next === null) return;
    e.preventDefault();
    pick(next, true);
  };

  return (
    <section id="amenities" aria-labelledby="amen-heading" className="section-y-lg bg-ground">
      <div className="shell gutter">
        <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
          <h2 id="amen-heading" data-reveal className="t-section text-ink lg:col-span-6">
            Amenities
          </h2>
          <p data-reveal className="t-body max-w-[34ch] text-ink-dim lg:col-span-5 lg:col-start-8 lg:self-end">
            Shared provisions, built in the same materials as the homes.
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-y-8 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
          <div
            role="tablist"
            aria-label="Amenity category"
            onKeyDown={onKeyDown}
            className="no-scrollbar -mx-[var(--gutter)] flex gap-[clamp(1.75rem,4vw,3rem)] overflow-x-auto border-b hair px-[var(--gutter)] lg:sticky lg:top-28 lg:col-span-3 lg:mx-0 lg:flex-col lg:gap-0 lg:self-start lg:border-b-0 lg:border-t lg:px-0"
          >
            {AMENITIES.map((g, n) => {
              const on = n === i;
              return (
                <button
                  key={g.group}
                  id={`amen-tab-${n}`}
                  ref={(el) => {
                    tabs.current[n] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  aria-controls="amenity-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => pick(n, false)}
                  className={`relative flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap text-left transition-colors duration-300 lg:min-h-16 lg:border-b lg:border-hair ${
                    on ? "text-ink" : "text-ink-dim hover:text-ink"
                  }`}
                >
                  <span aria-hidden="true" className="t-numeral">
                    {String(n + 1).padStart(2, "0")} /
                  </span>
                  <span className="t-item">{g.group}</span>
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-ink transition-transform duration-500 ease-[var(--ease-out-quiet)]"
                    style={{ transform: `scaleX(${on ? 1 : 0})` }}
                  />
                </button>
              );
            })}
          </div>

          <div id="amenity-panel" role="tabpanel" aria-labelledby={`amen-tab-${shown}`} className="lg:col-span-9">
            <figure className="relative aspect-[4/3] overflow-hidden bg-ground-2 sm:aspect-[16/9]">
              {AMENITIES.map((g, n) => {
                const a = A[g.image];
                return (
                  <Image
                    key={g.group}
                    src={a.src}
                    alt={n === i ? a.alt : ""}
                    aria-hidden={n === i ? undefined : true}
                    fill
                    sizes="(max-width: 1024px) 100vw, 62vw"
                    quality={75}
                    className={`object-cover transition-opacity duration-[450ms] ease-[var(--ease-in-out-quiet)] ${
                      n === i ? "opacity-100" : "opacity-0"
                    }`}
                  />
                );
              })}
            </figure>

            <div className={`mt-8 grid gap-y-6 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)] ${className}`}>
              <div className="md:col-span-5">
                <h3 className="t-sub text-ink">{group.group}</h3>
                <p className="t-body mt-4 text-ink-dim">{group.description}</p>
              </div>
              <ul className="border-t hair md:col-span-7">
                {group.items.map((item) => (
                  <li key={item} className="t-body flex min-h-12 items-center border-b hair py-2 text-ink">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
