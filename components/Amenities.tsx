"use client";

import { useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { AMENITIES } from "@/lib/content";

/**
 * Amenities, in four categories.
 *
 * Twenty-six provisions used to be listed at once across a pinned stage.
 * That is a specification sheet, not a reason to visit. Each category now
 * shows one photograph and the three or four worth knowing before you come;
 * the rest open in place for anyone who wants the full list.
 */
export default function Amenities() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <section id="amenities" aria-labelledby="amen-heading" className="section-y gutter">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 id="amen-heading" className="t-display-m max-w-[14ch] text-ink">
          What you get.
        </h2>
        <p className="t-meta max-w-[30ch] text-ink-dim">
          Shared provisions, built in the same materials as the homes.
        </p>
      </div>

      <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-x-[clamp(1.5rem,3vw,2.5rem)] gap-y-[clamp(2.5rem,6vh,3.5rem)] sm:grid-cols-2">
        {AMENITIES.map((group) => {
          const shown = open === group.group;
          const lead: readonly string[] = group.lead;
          const rest = group.items.filter((i) => !lead.includes(i));
          const asset = A[group.image];
          return (
            <article key={group.group} data-reveal>
              <div data-reveal-clip className="relative aspect-[16/10] overflow-hidden bg-ground-2">
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 48vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
              <h3 className="t-display-s mt-5 text-ink">{group.group}</h3>
              <ul data-collapsed={!shown} className="mt-3 flex flex-wrap gap-x-2 gap-y-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={`t-meta rounded-full border border-hair px-3 py-1 text-ink-dim ${
                      lead.includes(item) ? "" : "is-extra"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>

              {rest.length ? (
                <>
                  <button
                    type="button"
                    onClick={() => setOpen(shown ? null : group.group)}
                    aria-expanded={shown}
                    className="js-only t-meta mt-4 inline-flex items-baseline gap-2 border-b border-hair pb-0.5 text-ink-dim transition-colors duration-300 hover:border-travertine hover:text-ink"
                  >
                    {shown ? "Show fewer" : `View all ${group.items.length}`}
                    <span aria-hidden="true" className="text-travertine">
                      {shown ? "−" : "+"}
                    </span>
                  </button>
                </>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
