"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "./Icon";
import { GALLERY, type GalleryItem } from "@/lib/gallery";
import { closeOverlay, openOverlay } from "@/lib/overlay";
import { getLenis } from "@/lib/nav";

/**
 * The development — a cinematic chapter, not a grid.
 *
 * Desktop: one featured frame at 70vw × 65vh, bled off the left edge; beside
 * it, the caption and a small view of the next picture, which is itself the
 * way forward. Beneath: the counter, Previous, Next and View all. Changing
 * picture is a crossfade, with both neighbours already fetched.
 *
 * Phone and tablet: one picture per screen width in a native scroll-snap
 * track — a swipe is a real swipe, with the platform's own momentum — and
 * the counter and two arrows directly beneath, where a thumb finds them.
 *
 * Full screen: charcoal, the picture centred, Close top right, the counter,
 * Previous and Next, Escape, the arrow keys, and swipe. It is an overlay,
 * so Back closes it rather than leaving the page.
 */
const N = GALLERY.length;
const pad = (n: number) => String(n + 1).padStart(2, "0");
const portrait = (g: GalleryItem) => g.h > g.w;
const fit = (g: GalleryItem) => (g.drawing ? "object-contain p-4 sm:p-6" : portrait(g) ? "object-contain" : "object-cover");
const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Index of the slide a scroll-snap track is resting on. */
const slideAt = (el: HTMLElement) => Math.round(el.scrollLeft / Math.max(1, el.clientWidth));

function Lightbox({ start, onClose, onIndex }: { start: number; onClose: () => void; onIndex: (at: number) => void }) {
  const [k, setK] = useState(start);
  const track = useRef<HTMLDivElement | null>(null);
  const dialog = useRef<HTMLDivElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement | null>(null);
  const kRef = useRef(start);
  kRef.current = k;

  /* Land on the chosen picture before the first paint. */
  useLayoutEffect(() => {
    const el = track.current;
    if (el) el.scrollLeft = start * el.clientWidth;
    closeBtn.current?.focus();
  }, [start]);

  const go = useCallback((d: number) => {
    const el = track.current;
    if (!el) return;
    const to = Math.max(0, Math.min(N - 1, slideAt(el) + d));
    el.scrollTo({ left: to * el.clientWidth, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab") {
        /* Keep focus inside the dialog. */
        const f = dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled)");
        if (!f?.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  /* Keep the resting slide under the reader when the screen rotates. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      el.scrollLeft = kRef.current * el.clientWidth;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const item = GALLERY[k];
  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-label="Gallery, full screen"
      data-lenis-prevent
      className="on-dark fixed inset-0 z-[90] flex flex-col bg-charcoal text-on-dark motion-safe:animate-[fadeIn_220ms_var(--ease-out-quiet)]"
    >
      <div className="gutter flex items-center justify-between gap-5 py-[clamp(0.75rem,2.5vh,1.25rem)]">
        <p className="t-meta text-on-dark-dim" aria-live="polite">
          <span className="text-on-dark">{pad(k)}</span> / {N}
          <span className="sr-only">: {item.caption}</span>
        </p>
        <button ref={closeBtn} type="button" onClick={onClose} className="btn btn-secondary">
          <Icon name="close" className="h-4 w-4" />
          Close
        </button>
      </div>

      <div
        ref={track}
        onScroll={(e) => {
          const at = slideAt(e.currentTarget);
          if (at !== kRef.current) {
            setK(at);
            onIndex(at);
          }
        }}
        className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-contain"
      >
        {GALLERY.map((g, j) => (
          <figure key={g.src} className="relative h-full w-full shrink-0 snap-center snap-always">
            <Image
              src={g.src}
              alt={g.alt}
              fill
              sizes="100vw"
              quality={90}
              loading={Math.abs(j - k) <= 1 ? "eager" : "lazy"}
              className={`object-contain ${g.drawing ? "bg-paper p-6" : "p-[clamp(0.25rem,2vw,2.5rem)]"}`}
            />
          </figure>
        ))}
      </div>

      <div className="gutter flex items-center justify-between gap-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <p className="t-meta min-w-0 truncate text-on-dark-dim">
          {item.caption}
          <span className="hidden sm:inline"> · {item.category}</span>
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => go(-1)} disabled={k === 0} aria-label="Previous image" className="btn btn-secondary btn-square">
            <Icon name="arrow-left" className="h-4 w-4" />
          </button>
          <button type="button" onClick={() => go(1)} disabled={k === N - 1} aria-label="Next image" className="btn btn-secondary btn-square">
            <Icon name="arrow-right" className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Gallery() {
  const [i, setI] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [full, setFull] = useState<number | null>(null);
  const [near, setNear] = useState(false);
  const section = useRef<HTMLElement | null>(null);
  const track = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const atRef = useRef(0);
  const iRef = useRef(0);
  iRef.current = i;

  /* Fetch neighbours only once the chapter is close, never at page load. */
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "800px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Desktop: step with a crossfade, wrapping at the ends. */
  const step = useCallback((d: number) => {
    setPrev(iRef.current);
    setI((iRef.current + d + N) % N);
  }, []);

  /* Phone: the track is the source of truth; buttons move it. */
  const slide = useCallback((d: number) => {
    const el = track.current;
    if (!el) return;
    const to = Math.max(0, Math.min(N - 1, slideAt(el) + d));
    el.scrollTo({ left: to * el.clientWidth, behavior: reduced() ? "auto" : "smooth" });
  }, []);

  /* Whenever the track is (re)laid out — first show, rotation, crossing the
     breakpoint — put it on the current picture. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      if (el.clientWidth) el.scrollLeft = iRef.current * el.clientWidth;
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const openFull = (at: number) => {
    restoreTo.current = document.activeElement as HTMLElement;
    atRef.current = at;
    setFull(at);
  };

  /* Full screen is an overlay: history entry, page held still, action bar
     down, focus returned to what opened it. */
  useEffect(() => {
    if (full === null) return;
    openOverlay("gallery", () => setFull(null));
    const root = document.documentElement;
    root.setAttribute("data-overlay", "gallery");
    getLenis()?.stop();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      if (root.getAttribute("data-overlay") === "gallery") root.removeAttribute("data-overlay");
      document.body.style.overflow = before;
      getLenis()?.start();
      /* However it was closed — Close, Escape or Back — the chapter is left
         on the picture the reader was looking at. */
      const at = atRef.current;
      setPrev(null);
      setI(at);
      const el = track.current;
      if (el?.clientWidth) el.scrollLeft = at * el.clientWidth;
      restoreTo.current?.focus?.();
    };
  }, [full]);

  const closeFull = useCallback(() => void closeOverlay("gallery"), []);
  const onIndex = useCallback((at: number) => {
    atRef.current = at;
  }, []);

  const item = GALLERY[i];
  const next = (i + 1) % N;
  const before = (i - 1 + N) % N;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  return (
    <section ref={section} id="gallery" aria-labelledby="gal-heading" className="section-y-lg overflow-hidden bg-ground-2">
      <div className="shell gutter grid gap-y-5 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
        <h2 id="gal-heading" data-reveal className="t-section text-ink lg:col-span-6">
          The development
        </h2>
        <p data-reveal className="t-body max-w-[34ch] text-ink-dim lg:col-span-5 lg:col-start-8 lg:self-end">
          Architectural visualisation of a proposed development.
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        Image {i + 1} of {N}: {item.caption}
      </p>

      {/* Desktop stage */}
      <div
        onKeyDown={onKeyDown}
        aria-roledescription="carousel"
        aria-label="Development pictures"
        className="mt-[clamp(2.5rem,5vw,4rem)] hidden lg:grid lg:grid-cols-[70vw_minmax(0,1fr)] lg:gap-x-[clamp(2rem,3vw,3.5rem)]"
      >
        <button
          type="button"
          onClick={() => openFull(i)}
          aria-label={`${item.caption} — view full screen`}
          className="group relative h-[65vh] min-h-[26rem] w-[70vw] overflow-hidden bg-ground"
        >
          {prev !== null && prev !== i ? (
            <Image
              key={`p-${prev}`}
              src={GALLERY[prev].src}
              alt=""
              fill
              sizes="70vw"
              quality={75}
              className={fit(GALLERY[prev])}
            />
          ) : null}
          <Image
            key={`c-${i}`}
            src={item.src}
            alt={item.alt}
            fill
            sizes="70vw"
            quality={75}
            className={`${fit(item)} ${prev !== null ? "motion-safe:animate-[fadeIn_450ms_var(--ease-in-out-quiet)_both]" : ""}`}
          />
          <span className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-[6px] bg-ground/90 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            <Icon name="expand" className="h-4 w-4" />
          </span>
        </button>

        {/* Neighbours, fetched ahead so the crossfade never waits. */}
        {near ? (
          <div aria-hidden="true" className="hidden">
            {[next, before].map((n) => (
              <Image key={`w-${n}`} src={GALLERY[n].src} alt="" width={16} height={9} sizes="70vw" quality={75} loading="eager" />
            ))}
          </div>
        ) : null}

        <div className="flex min-w-0 flex-col justify-between gap-8 pr-[var(--gutter)]">
          <div>
            <p className="t-label text-accent">{item.category}</p>
            <p className="t-sub mt-3 text-ink">{item.caption}</p>
          </div>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label={`Next image: ${GALLERY[next].caption}`}
            className="group block w-full max-w-[17rem] text-left"
          >
            <span className="t-label flex items-center gap-2 text-ink-dim">
              Next
              <Icon name="arrow-right" className="arrow h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </span>
            <span className="relative mt-3 block aspect-[4/3] w-full overflow-hidden bg-ground">
              <Image
                src={GALLERY[next].src}
                alt=""
                fill
                sizes="18vw"
                quality={75}
                className={`${fit(GALLERY[next])} transition-transform duration-700 ease-[var(--ease-out-quiet)] group-hover:scale-[1.03]`}
              />
            </span>
            <span className="t-meta mt-3 block truncate text-ink-dim">{GALLERY[next].caption}</span>
          </button>
        </div>

        <div className="shell gutter col-span-2 mt-8 flex w-full items-center justify-between gap-6">
          <p className="t-meta text-ink-dim">
            <span className="text-ink">{pad(i)}</span> / {N}
          </p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => step(-1)} aria-label="Previous image" className="btn btn-secondary btn-square">
              <Icon name="arrow-left" className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label="Next image" className="btn btn-secondary btn-square">
              <Icon name="arrow-right" className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => openFull(i)} className="btn-text ml-5">
              View all
              <Icon name="arrow-right" className="arrow h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Phone and tablet track */}
      <div className="mt-[clamp(2rem,6vw,3rem)] lg:hidden">
        <div
          ref={track}
          aria-roledescription="carousel"
          aria-label="Development pictures — swipe to move between them"
          onScroll={(e) => {
            const at = slideAt(e.currentTarget);
            if (at !== iRef.current) {
              setPrev(null);
              setI(at);
            }
          }}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {GALLERY.map((g, j) => (
            <div key={g.src} className="w-full shrink-0 snap-center snap-always">
              <button
                type="button"
                onClick={() => openFull(j)}
                tabIndex={j === i ? 0 : -1}
                aria-label={`${g.caption} — view full screen`}
                className={`relative block aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2] ${g.drawing ? "bg-paper" : "bg-ground"}`}
              >
                <Image
                  src={g.src}
                  alt={j === i ? g.alt : ""}
                  fill
                  sizes="100vw"
                  quality={75}
                  loading={near && Math.abs(j - i) <= 1 ? "eager" : "lazy"}
                  className={fit(g)}
                />
              </button>
            </div>
          ))}
        </div>

        <div className="gutter mt-5">
          <p className="t-label text-accent">{item.category}</p>
          <p className="t-body mt-1 text-ink">{item.caption}</p>
          <div className="mt-4 flex items-center justify-between gap-4">
            <p className="t-meta text-ink-dim">
              <span className="text-ink">{pad(i)}</span> / {N}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => slide(-1)} disabled={i === 0} aria-label="Previous image" className="btn btn-secondary btn-square">
                <Icon name="arrow-left" className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => slide(1)} disabled={i === N - 1} aria-label="Next image" className="btn btn-secondary btn-square">
                <Icon name="arrow-right" className="h-4 w-4" />
              </button>
            </div>
          </div>
          <button type="button" onClick={() => openFull(i)} className="btn-text mt-2">
            View all {N}
            <Icon name="arrow-right" className="arrow h-4 w-4" />
          </button>
        </div>
      </div>

      {full !== null ? <Lightbox start={full} onClose={closeFull} onIndex={onIndex} /> : null}
    </section>
  );
}
