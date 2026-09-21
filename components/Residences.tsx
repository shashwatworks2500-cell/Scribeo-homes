"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS, CONTACT, type Config } from "@/lib/content";
import { PLANS, roomDims } from "@/lib/plans";

/**
 * Find your residence.
 *
 * Four cards, four facts each: what it is, how big, what it costs, what it
 * looks like. Everything else — the plan, the room dimensions, the price
 * band — opens in a panel, so the page stays a place to choose from rather
 * than a document to read.
 *
 * Dimensions come from the drawn plans, so the card and the drawing cannot
 * disagree.
 */

const KEY_ROOMS = ["Living & Dining", "Master Bedroom", "Bedroom", "Kitchen", "Balcony"];

function keyDimensions(id: string) {
  const rooms = PLANS[id]?.rooms ?? [];
  return KEY_ROOMS.flatMap((name) => {
    const room = rooms.find((r) => r.name === name);
    return room ? [{ name: room.name, dims: roomDims(room) }] : [];
  });
}

const bedrooms = (id: string) => (PLANS[id]?.rooms ?? []).filter((r) => /bedroom/i.test(r.name)).length;
const baths = (id: string) => (PLANS[id]?.rooms ?? []).filter((r) => /bath/i.test(r.name)).length;

function Detail({ config, onClose }: { config: Config; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${config.bhk} — ${config.label}`}
      className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center"
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]"
      />
      <div className="relative max-h-[92svh] w-full overflow-y-auto overscroll-contain bg-paper sm:max-w-[46rem]">
        <div className="gutter py-[clamp(1.75rem,4vh,2.75rem)]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="t-label text-travertine">{config.label}</p>
              <h3 className="t-display-m mt-2 text-ink">{config.bhk}</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="t-meta -mr-1 shrink-0 border-b border-hair pb-0.5 text-ink-dim transition-colors hover:border-rule hover:text-ink"
            >
              Close
            </button>
          </div>

          <div className="mt-7 border border-paper-hair bg-ground-2">
            <Image
              src={config.plan}
              alt={`${config.bhk} floor plan`}
              width={843}
              height={722}
              className="h-auto w-full"
            />
          </div>

          <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
            {[
              ["Built-up", `${config.builtUpSqft.toLocaleString("en-IN")} sq ft`],
              ["Bedrooms", String(bedrooms(config.id))],
              ["Bathrooms", String(baths(config.id))],
              ["Price band", `${config.priceFrom} – ${config.priceTo}`],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="t-label text-ink-faint">{k}</dt>
                <dd className="t-display-s mt-1.5 text-ink">{v}</dd>
              </div>
            ))}
          </dl>

          <dl className="mt-7 border-t hair">
            {keyDimensions(config.id).map(({ name, dims }) => (
              <div key={name} className="flex items-baseline justify-between gap-6 border-b hair py-3">
                <dt className="t-meta text-ink-dim">{name}</dt>
                <dd className="t-meta text-ink">{dims}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
            <button
              type="button"
              onClick={() => {
                onClose();
                window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: { config: config.bhk } }));
              }}
              className="group inline-flex items-baseline gap-3 border-b border-travertine pb-2"
            >
              <span className="t-display-s text-ink">Request details</span>
              <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
            <a
              href={CONTACT.phoneHref}
              className="t-meta border-b border-hair pb-1 text-ink-dim transition-colors hover:border-rule hover:text-ink"
            >
              Or call {CONTACT.phoneDisplay}
            </a>
          </div>

          <p className="t-meta mt-6 text-ink-faint">
            Plans are indicative and not to scale; dimensions are nominal. Prices are indicative.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Residences() {
  const [open, setOpen] = useState<Config | null>(null);

  return (
    <section id="residences" aria-labelledby="res-heading" className="section-y gutter">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 id="res-heading" className="t-display-m max-w-[14ch] text-ink">
          Find your residence.
        </h2>
        <p className="t-meta max-w-[30ch] text-ink-dim">
          Four layouts, 753 to 2,333 sq ft. Open one for its plan and room sizes.
        </p>
      </div>

      <ul className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-x-[clamp(1.25rem,3vw,2.5rem)] gap-y-[clamp(2rem,5vh,3rem)] sm:grid-cols-2 lg:grid-cols-4">
        {CONFIGS.map((c) => (
          <li key={c.id} data-reveal>
            <button
              type="button"
              onClick={() => setOpen(c)}
              className="group block w-full text-left"
              aria-label={`${c.bhk}, ${c.builtUpSqft} square feet, from ${c.priceFrom} — view plan`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-ground-2">
                <Image
                  src={A[c.image].src}
                  alt={A[c.image].alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                  quality={80}
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quiet)] group-hover:scale-[1.03]"
                />
              </div>
              <p className="t-display-s mt-5 text-ink">{c.bhk}</p>
              <p className="t-meta mt-1 text-ink-dim">
                {c.builtUpSqft.toLocaleString("en-IN")} sq ft · from {c.priceFrom}
              </p>
              <span className="t-meta mt-3 inline-flex items-baseline gap-2 border-b border-travertine/60 pb-0.5 text-ink transition-colors duration-300 group-hover:border-travertine">
                View plan
                <span aria-hidden="true" className="text-travertine transition-transform duration-300 group-hover:translate-x-0.5">
                  →
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {open ? <Detail config={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
