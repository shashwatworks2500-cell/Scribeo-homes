"use client";

import { useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { AMENITIES } from "@/lib/content";

/**
 * Amenities.
 *
 * Four categories, one open at a time: the navigation stays visible on the
 * left so the reader always knows what else there is, and only the panel on
 * the right changes. Twenty-six provisions listed at once is a specification
 * sheet; four choices with the important ones named is a decision.
 */
export default function Amenities() {
  const [i, setI] = useState(0);
  const group = AMENITIES[i];
  const asset = A[group.image];

  return (
    <section id="amenities" aria-labelledby="amen-heading" className="section-y-lg bg-ground">
      <div className="shell gutter">
        <div className="grid grid-cols-12 gap-y-4 md:gap-x-[clamp(2rem,5vw,4rem)]">
          <h2 id="amen-heading" className="t-display-m col-span-12 text-ink md:col-span-5">
            Amenities
          </h2>
          <p className="t-body col-span-12 max-w-[34ch] self-end text-ink-dim md:col-span-6 md:col-start-7">
            Shared provisions, built in the same materials as the homes.
          </p>
        </div>

        <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-12 gap-y-7 lg:gap-x-[clamp(2rem,5vw,4rem)]">
          {/* Category navigation. A row that scrolls itself on a phone, a
              column that stays put beside the panel on a wide screen. */}
          <div
            role="tablist"
            aria-label="Amenity category"
            aria-orientation="vertical"
            className="-mx-[clamp(1.25rem,5vw,6.5rem)] col-span-12 flex gap-[clamp(1.25rem,3vw,2rem)] overflow-x-auto px-[clamp(1.25rem,5vw,6.5rem)] lg:mx-0 lg:col-span-3 lg:flex-col lg:gap-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {AMENITIES.map((g, n) => (
              <button
                key={g.group}
                role="tab"
                aria-selected={n === i}
                aria-controls="amenity-panel"
                tabIndex={n === i ? 0 : -1}
                onClick={() => setI(n)}
                className={`t-display-s relative shrink-0 whitespace-nowrap pb-3 text-left transition-colors duration-300 lg:border-b lg:border-[var(--color-hair)] lg:py-4 ${
                  n === i ? "text-ink" : "text-ink-faint hover:text-ink-dim"
                }`}
              >
                {g.group}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-px origin-left bg-ink transition-transform duration-400 ease-[var(--ease-out-quiet)]"
                  style={{ transform: `scaleX(${n === i ? 1 : 0})` }}
                />
              </button>
            ))}
          </div>

          <div id="amenity-panel" role="tabpanel" key={group.group} className="col-span-12 lg:col-span-9">
            <div className="relative aspect-[16/9] overflow-hidden bg-ground-2 motion-safe:animate-[fadeIn_420ms_var(--ease-out-quiet)_both]">
              <Image
                src={asset.src}
                alt={asset.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 68vw"
                quality={82}
                className="object-cover"
              />
            </div>
            <ul className="mt-6 grid gap-x-8 gap-y-2 motion-safe:animate-[riseIn_420ms_var(--ease-out-quiet)_both] sm:grid-cols-2">
              {group.items.map((item) => (
                <li key={item} className="t-body border-b hair py-2.5 text-ink-dim">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
