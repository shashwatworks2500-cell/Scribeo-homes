"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { GALLERY, CATEGORIES, type GalleryItem } from "@/lib/gallery";
import SplitLines from "./SplitLines";

type Lenis = { stop: () => void; start: () => void };
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

/**
 * Gallery.
 *
 * The page shows only the images that carry its argument; the full collection
 * lives here, behind one button, sorted by how someone actually browses a
 * development. Opening it does not navigate away, so the reader keeps their
 * place on the page.
 *
 * Accessibility: the overlay is a modal dialog — focus moves in, Tab is
 * confined to it, Escape steps back one level (lightbox, then dialog), and
 * focus returns to the button that opened it. Scrolling behind is locked,
 * Lenis included.
 */
const PREVIEW = GALLERY.filter((i) =>
  ["Exteriors", "Interiors", "Landscape", "Amenities"].includes(i.category),
).filter((_, i) => i % 4 === 0).slice(0, 4);

export default function Gallery() {
  const [open, setOpen] = useState(false);
  const [cat, setCat] = useState<string>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const openerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const items = cat === "All" ? GALLERY : GALLERY.filter((i) => i.category === cat);

  const close = useCallback(() => {
    setLightbox(null);
    setOpen(false);
    openerRef.current?.focus();
  }, []);

  // Scroll lock + focus entry
  useEffect(() => {
    if (!open) return;
    const l = lenis();
    l?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = dialogRef.current?.querySelector<HTMLElement>("button, a");
    first?.focus();
    return () => {
      l?.start();
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape steps back one level; Tab is confined to the dialog.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (lightbox !== null) setLightbox(null);
        else close();
        return;
      }
      if (lightbox !== null) {
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setLightbox((i) => (i === null ? null : (i + 1) % items.length));
        }
        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length));
        }
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, lightbox, items.length, close]);

  const shot = lightbox !== null ? items[lightbox] : null;

  return (
    <section id="gallery" aria-labelledby="gal-heading" className="section-y gutter">
      <div className="grid grid-cols-12 items-end gap-y-6">
        <div className="col-span-12 md:col-span-6">
          <p data-reveal className="t-eyebrow text-travertine">
            05 — Gallery
          </p>
          <h2 id="gal-heading" className="t-display-m mt-6 max-w-[16ch] text-ink">
            <SplitLines>The whole of it, *in one place*.</SplitLines>
          </h2>
        </div>
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <p data-reveal className="measure text-ink-dim">
            {GALLERY.length} images and drawings across exteriors, interiors, landscape,
            amenities, material details and floor plans.
          </p>
          <button
            ref={openerRef}
            type="button"
            data-reveal
            onClick={() => setOpen(true)}
            className="group mt-7 inline-flex items-baseline gap-4 border-b border-travertine/70 pb-2 transition-colors duration-300 hover:border-travertine"
          >
            <span className="t-display-s text-ink">View gallery</span>
            <span
              aria-hidden="true"
              className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
        </div>
      </div>

      <ul className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-2 gap-[clamp(0.625rem,1.4vw,1.25rem)] lg:grid-cols-4">
        {PREVIEW.map((item) => (
          <li key={item.src} data-reveal>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group relative block w-full overflow-hidden bg-ground-2"
              style={{ aspectRatio: "4/5" }}
              aria-label={`Open gallery at ${item.caption}`}
            >
              <Image
                src={item.src}
                alt=""
                fill
                sizes="(max-width: 1024px) 50vw, 24vw"
                quality={76}
                className="object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                style={{ transitionTimingFunction: "var(--ease-out-quiet)" }}
              />
            </button>
          </li>
        ))}
      </ul>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery"
          ref={dialogRef}
          className="fixed inset-0 z-[95] flex flex-col bg-ground"
        >
          <div className="gutter flex items-center justify-between gap-6 border-b hair py-5">
            <p className="t-eyebrow text-travertine">Gallery</p>
            <button type="button" onClick={close} className="t-meta text-ink hover:text-travertine">
              Close
            </button>
          </div>

          <div className="gutter flex gap-2 overflow-x-auto border-b hair py-4" style={{ scrollbarWidth: "none" }}>
            {CATEGORIES.map((c) => {
              const n = c === "All" ? GALLERY.length : GALLERY.filter((i) => i.category === c).length;
              const on = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setCat(c);
                    setLightbox(null);
                  }}
                  aria-pressed={on}
                  className="t-meta shrink-0 border px-4 py-2 transition-colors duration-300"
                  style={{
                    borderColor: on ? "var(--color-travertine)" : "var(--color-rule)",
                    backgroundColor: on ? "var(--color-travertine)" : "transparent",
                    color: on ? "var(--color-ground)" : "var(--color-ink-dim)",
                  }}
                >
                  {c} <span className="opacity-60">{n}</span>
                </button>
              );
            })}
          </div>

          <div className="gutter flex-1 overflow-y-auto py-[clamp(1.5rem,4vh,2.5rem)]">
            <ul className="grid grid-cols-2 gap-[clamp(0.625rem,1.4vw,1.25rem)] md:grid-cols-3 xl:grid-cols-4">
              {items.map((item, i) => (
                <li key={item.src}>
                  <button
                    type="button"
                    onClick={() => setLightbox(i)}
                    className="group block w-full text-left"
                    aria-label={`Enlarge: ${item.caption}`}
                  >
                    <span
                      className="relative block w-full overflow-hidden"
                      style={{
                        aspectRatio: "4/3",
                        backgroundColor: item.drawing ? "var(--color-paper)" : "var(--color-ground-2)",
                      }}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 24vw"
                        quality={74}
                        unoptimized={item.drawing}
                        className={
                          item.drawing
                            ? "object-contain p-3"
                            : "object-cover transition-transform duration-[900ms] group-hover:scale-[1.04]"
                        }
                      />
                    </span>
                    <span className="t-meta mt-3 block text-ink-faint group-hover:text-ink">
                      {item.caption}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {shot ? (
            <div
              role="dialog"
              aria-modal="true"
              aria-label={shot.caption}
              className="absolute inset-0 z-10 flex flex-col bg-ground/97"
            >
              <div className="gutter flex items-center justify-between gap-6 py-5">
                <p className="t-meta text-ink-faint">
                  {lightbox! + 1} / {items.length}
                </p>
                <button
                  type="button"
                  onClick={() => setLightbox(null)}
                  className="t-meta text-ink hover:text-travertine"
                >
                  Back to grid
                </button>
              </div>
              <div className="relative flex-1 px-[clamp(1rem,4vw,4rem)] pb-4">
                <Image
                  src={shot.src}
                  alt={shot.alt}
                  fill
                  sizes="100vw"
                  quality={86}
                  unoptimized={shot.drawing}
                  className={shot.drawing ? "object-contain" : "object-contain"}
                />
              </div>
              <div className="gutter flex items-center justify-between gap-6 pb-6">
                <button
                  type="button"
                  onClick={() => setLightbox((i) => (i === null ? null : (i - 1 + items.length) % items.length))}
                  className="t-meta text-ink hover:text-travertine"
                >
                  ← Previous
                </button>
                <p className="t-meta max-w-[46ch] text-center text-ink-dim">{shot.caption}</p>
                <button
                  type="button"
                  onClick={() => setLightbox((i) => (i === null ? null : (i + 1) % items.length))}
                  className="t-meta text-ink hover:text-travertine"
                >
                  Next →
                </button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
