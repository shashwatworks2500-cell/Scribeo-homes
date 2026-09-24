"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { GALLERY } from "@/lib/gallery";

/**
 * The development.
 *
 * A cinematic chapter rather than a grid: one large frame at a time, a
 * counter, and previous/next. Thirty-seven thumbnails is an archive; a
 * sequence you move through is a walk around the place.
 *
 * Full size takes the dark ground, closes on Escape, and moves on the arrow
 * keys. It marks the document as overlaid so the phone action bar stands
 * down while it is open.
 */
export default function Gallery() {
  const [i, setI] = useState(0);
  const [full, setFull] = useState(false);
  const item = GALLERY[i];

  const step = useCallback((d: number) => setI((n) => (n + d + GALLERY.length) % GALLERY.length), []);

  useEffect(() => {
    if (!full) {
      document.documentElement.removeAttribute("data-overlay");
      return;
    }
    document.documentElement.setAttribute("data-overlay", "gallery");
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFull(false);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
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
  }, [full, step]);

  const counter = `${String(i + 1).padStart(2, "0")} / ${GALLERY.length}`;

  return (
    <section id="gallery" aria-labelledby="gal-heading" className="section-y-lg bg-ground-2">
      <div className="shell gutter">
        <div className="grid grid-cols-12 gap-y-4 md:gap-x-[clamp(2rem,5vw,4rem)]">
          <h2 id="gal-heading" className="t-display-m col-span-12 text-ink md:col-span-5">
            The development
          </h2>
          <p className="t-body col-span-12 max-w-[34ch] self-end text-ink-dim md:col-span-6 md:col-start-7">
            Architectural visualisation of a proposed development.
          </p>
        </div>

        <figure className="mt-[clamp(2.5rem,6vh,4rem)]">
          <button
            type="button"
            onClick={() => setFull(true)}
            aria-label={`${item.caption} — view full size`}
            className="block w-full"
          >
            <div className="relative aspect-[3/2] w-full overflow-hidden bg-ground-3 sm:aspect-[16/9]">
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 1400px) 100vw, 1400px"
                quality={84}
                priority={false}
                className={`motion-safe:animate-[fadeIn_420ms_var(--ease-out-quiet)_both] ${
                  item.drawing ? "object-contain p-4" : "object-cover"
                }`}
              />
            </div>
          </button>
          <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-4">
            <div>
              <p className="t-body text-ink">{item.caption}</p>
              <p className="t-meta text-ink-faint">
                {item.category} · {counter}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="btn btn-secondary px-5">
                ←
              </button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="btn btn-secondary px-5">
                →
              </button>
              <button type="button" onClick={() => setFull(true)} className="btn-text ml-2">
                View all
                <span aria-hidden="true" className="arrow text-travertine">→</span>
              </button>
            </div>
          </figcaption>
        </figure>
      </div>

      {full ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption}
          className="fixed inset-0 z-[90] flex flex-col bg-charcoal motion-safe:animate-[fadeIn_200ms_var(--ease-out-quiet)]"
        >
          <div className="flex items-center justify-between gap-5 px-[clamp(1rem,4vw,2.5rem)] py-[clamp(1rem,3vh,1.5rem)]">
            <p className="t-label text-on-dark-dim">{counter}</p>
            <button
              type="button"
              onClick={() => setFull(false)}
              className="t-meta min-h-11 rounded-[6px] border border-[rgba(244,242,237,0.35)] px-4 text-ground transition-colors hover:border-ground"
            >
              Close
            </button>
          </div>
          <div className="relative flex-1">
            <Image src={item.src} alt={item.alt} fill sizes="100vw" quality={88} className="object-contain p-[clamp(0.5rem,3vw,3rem)]" />
          </div>
          <div className="flex items-center justify-between gap-5 px-[clamp(1rem,4vw,2.5rem)] pb-[clamp(1rem,3vh,2rem)]">
            <p className="t-meta text-on-dark-dim">{item.caption}</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="t-meta min-h-11 min-w-11 rounded-[6px] border border-[rgba(244,242,237,0.35)] px-4 text-ground transition-colors hover:border-ground">←</button>
              <button type="button" onClick={() => step(1)} aria-label="Next image" className="t-meta min-h-11 min-w-11 rounded-[6px] border border-[rgba(244,242,237,0.35)] px-4 text-ground transition-colors hover:border-ground">→</button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
