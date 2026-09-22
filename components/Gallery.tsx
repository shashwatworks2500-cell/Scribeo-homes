"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { CATEGORIES, GALLERY } from "@/lib/gallery";

/**
 * The gallery.
 *
 * Six pictures at rest, the whole collection behind one control. Thirty-seven
 * images shown at once is an archive; six chosen ones are an argument, and
 * anyone who wants the archive is one tap away from it.
 *
 * The filter only appears once the full set is open — a row of categories
 * above six images is furniture with nothing to do.
 */
export default function Gallery() {
  const [all, setAll] = useState(false);
  const [cat, setCat] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const shown = useMemo(() => {
    if (!all) return GALLERY.filter((g) => g.pick);
    return cat === "All" ? GALLERY : GALLERY.filter((g) => g.category === cat);
  }, [all, cat]);

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i === null ? i : (i + 1) % shown.length));
      if (e.key === "ArrowLeft") setLightbox((i) => (i === null ? i : (i - 1 + shown.length) % shown.length));
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
  }, [lightbox, shown.length]);

  const open = lightbox === null ? null : shown[lightbox];

  return (
    <section id="gallery" aria-labelledby="gal-heading" className="section-y gutter">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 id="gal-heading" className="t-display-m max-w-[14ch] text-ink">
          The development.
        </h2>
        <p className="t-meta max-w-[30ch] text-ink-dim">
          Architectural visualisation of a proposed development.
        </p>
      </div>

      {all ? (
        <div role="group" aria-label="Filter the gallery" className="mt-[clamp(1.75rem,4vh,2.5rem)] flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`t-meta rounded-full border px-3.5 py-1.5 transition-colors duration-300 ${
                cat === c
                  ? "border-travertine bg-travertine text-paper"
                  : "border-hair text-ink-dim hover:border-rule hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      ) : null}

      <ul className="mt-[clamp(1.75rem,4vh,2.5rem)] grid grid-cols-2 gap-[clamp(0.75rem,2vw,1.5rem)] lg:grid-cols-3">
        {shown.map((item, i) => (
          <li key={item.src} data-reveal>
            <button
              type="button"
              onClick={() => setLightbox(i)}
              className="group block w-full text-left"
              aria-label={`${item.caption} — open larger`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-ground-2">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 32vw"
                  quality={78}
                  className={`transition-transform duration-[900ms] ease-[var(--ease-out-quiet)] group-hover:scale-[1.03] ${
                    item.drawing ? "object-contain p-2" : "object-cover"
                  }`}
                />
              </div>
              <p className="t-meta mt-2.5 text-ink-dim">{item.caption}</p>
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => {
          setAll((v) => !v);
          setCat("All");
        }}
        aria-expanded={all}
        className="t-meta mt-6 inline-flex items-baseline gap-2 border-b border-hair pb-0.5 text-ink-dim transition-colors duration-300 hover:border-travertine hover:text-ink"
      >
        {all ? "Show a selection" : `View all ${GALLERY.length}`}
        <span aria-hidden="true" className="text-travertine">
          {all ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.caption}
          className="fixed inset-0 z-[80] flex items-center justify-center p-[clamp(0.75rem,3vw,3rem)]"
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setLightbox(null)}
            className="absolute inset-0 bg-ink/70 backdrop-blur-[2px]"
          />
          <figure className="relative max-h-full w-full max-w-[72rem]">
            <div className="relative mx-auto aspect-[3/2] w-full bg-ink/40">
              <Image
                src={open.src}
                alt={open.alt}
                fill
                sizes="90vw"
                quality={88}
                className={open.drawing ? "object-contain p-4" : "object-contain"}
              />
            </div>
            <figcaption className="t-meta mt-3 flex items-baseline justify-between gap-5 text-ground/80">
              <span>{open.caption}</span>
              <span className="shrink-0 text-ground/50">
                {(lightbox ?? 0) + 1} / {shown.length}
              </span>
            </figcaption>
          </figure>
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="t-meta absolute right-[clamp(0.75rem,3vw,3rem)] top-[clamp(0.75rem,3vw,3rem)] rounded-full border border-ground/30 px-4 py-2 text-ground/80 transition-colors hover:border-ground/70 hover:text-ground"
          >
            Close
          </button>
        </div>
      ) : null}
    </section>
  );
}
