"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS, type Config } from "@/lib/content";
import { AREA_BANDS, EMPTY, PRICE_BANDS, apply, isEmpty, type Filters } from "@/lib/search";

/**
 * Residence search.
 *
 * A full-viewport overlay on the warm ground — the page stepping aside, not a
 * dialog floating over it. Four filter groups, a result list, an empty state
 * that offers a way out, and nothing that cannot be answered from the
 * project's own data.
 *
 * Opened by the navigation, the hero, or ⌘K / Ctrl+K. Escape closes. While it
 * is open the page behind it is held still and the phone action bar is
 * hidden, so there is only ever one surface accepting input.
 */

const enquire = (config?: string) =>
  window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: config ? { config } : undefined }));

function Group({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t hair pt-5">
      <legend className="sr-only">{label}</legend>
      <p aria-hidden="true" className="t-label text-ink-faint">
        {label}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`t-meta min-h-12 rounded-[6px] border px-4 transition-colors duration-200 ${
        on
          ? "border-ink bg-ink text-ground"
          : "border-hair text-ink-dim hover:border-rule hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

function ResultCard({ config, close }: { config: Config; close: () => void }) {
  const asset = A[config.image];
  return (
    <li className="grid grid-cols-12 items-center gap-x-6 gap-y-4 border-b hair py-6">
      <div className="col-span-4 sm:col-span-3">
        <div className="relative aspect-[4/3] overflow-hidden bg-ground-2">
          <Image src={asset.src} alt={asset.alt} fill sizes="(max-width: 640px) 33vw, 18vw" quality={72} className="object-cover" />
        </div>
      </div>
      <div className="col-span-8 sm:col-span-5">
        <p className="t-display-s text-ink">{config.bhk}</p>
        <p className="t-meta text-ink-faint">{config.label}</p>
        <p className="t-meta mt-2 text-ink">
          {config.builtUpSqft.toLocaleString("en-IN")} sq ft · from {config.priceFrom}
        </p>
      </div>
      <div className="col-span-12 flex flex-wrap gap-x-7 gap-y-2 sm:col-span-4 sm:justify-end">
        <button
          type="button"
          className="btn-text"
          onClick={() => {
            window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: config.id } }));
            close();
            requestAnimationFrame(() =>
              requestAnimationFrame(() => {
                const el = document.querySelector<HTMLElement>("#plans");
                const lenis = (window as unknown as { __lenis?: { scrollTo: (t: unknown, o?: object) => void } }).__lenis;
                if (el && lenis) lenis.scrollTo(el, { offset: 0, duration: 1.1 });
                else el?.scrollIntoView({ behavior: "smooth", block: "start" });
              }),
            );
          }}
        >
          View plan
          <span aria-hidden="true" className="arrow text-travertine">→</span>
        </button>
        <button type="button" className="btn-text" onClick={() => { close(); enquire(config.bhk); }}>
          Enquire
          <span aria-hidden="true" className="arrow text-travertine">→</span>
        </button>
      </div>
    </li>
  );
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [showing, setShowing] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setShowing(false);
  }, []);

  useEffect(() => {
    const onAsk = () => {
      restoreTo.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        restoreTo.current = document.activeElement as HTMLElement;
        setOpen((v) => !v);
      }
    };
    window.addEventListener("scribeo:search", onAsk);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scribeo:search", onAsk);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /* Hold the page, hide the phone action bar, take focus, restore on close. */
  useEffect(() => {
    if (!open) {
      document.documentElement.removeAttribute("data-overlay");
      restoreTo.current?.focus?.();
      return;
    }
    document.documentElement.setAttribute("data-overlay", "search");
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 60);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.preventDefault(); close(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  if (!open) return null;

  const results = apply(filters);
  const toggleBhk = (id: string) =>
    setFilters((f) => ({ ...f, bhk: f.bhk.includes(id) ? f.bhk.filter((x) => x !== id) : [...f.bhk, id] }));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search residences"
      className="fixed inset-0 z-[95] overflow-y-auto overscroll-contain bg-ground motion-safe:animate-[fadeIn_220ms_var(--ease-out-quiet)]"
    >
      <div className="shell gutter flex min-h-full flex-col py-[clamp(1.25rem,4vh,2.5rem)]">
        <div className="flex items-center justify-between gap-6">
          <p className="t-label text-ink-faint">Search</p>
          <button ref={closeRef} type="button" onClick={close} className="btn btn-secondary">
            Close
          </button>
        </div>

        <h2 className="t-display-l mt-[clamp(2rem,6vh,4rem)] max-w-[14ch] text-ink">
          Find your residence.
        </h2>

        <div className="mt-[clamp(2rem,5vh,3rem)] grid gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-8 lg:grid-cols-3">
          <Group label="Configuration">
            {CONFIGS.map((c) => (
              <Chip key={c.id} on={filters.bhk.includes(c.id)} onClick={() => toggleBhk(c.id)}>
                {c.bhk}
              </Chip>
            ))}
          </Group>
          <Group label="Built-up area">
            {AREA_BANDS.map((b) => (
              <Chip
                key={b.id}
                on={filters.area === b.id}
                onClick={() => setFilters((f) => ({ ...f, area: f.area === b.id ? null : b.id }))}
              >
                {b.label}
              </Chip>
            ))}
          </Group>
          <Group label="Price">
            {PRICE_BANDS.map((b) => (
              <Chip
                key={b.id}
                on={filters.price === b.id}
                onClick={() => setFilters((f) => ({ ...f, price: f.price === b.id ? null : b.id }))}
              >
                {b.label}
              </Chip>
            ))}
          </Group>
        </div>

        <p className="t-meta mt-6 text-ink-faint">
          Availability is not published here. The site office confirms what is currently released.
        </p>

        <div className="mt-[clamp(1.75rem,4vh,2.5rem)] flex flex-wrap items-center gap-4">
          <button type="button" className="btn btn-primary" onClick={() => setShowing(true)}>
            Show residences
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setFilters(EMPTY); setShowing(false); }}
            disabled={isEmpty(filters) && !showing}
          >
            Reset
          </button>
          <span aria-live="polite" className="t-meta text-ink-dim">
            {results.length} of {CONFIGS.length} residences
          </span>
        </div>

        {showing ? (
          <div className="mt-[clamp(2rem,5vh,3rem)] border-t hair pt-2">
            {results.length ? (
              <ul>
                {results.map((c) => (
                  <ResultCard key={c.id} config={c} close={close} />
                ))}
              </ul>
            ) : (
              <div className="py-[clamp(2rem,6vh,4rem)]">
                <p className="t-display-s text-ink">No residences match those preferences.</p>
                <button
                  type="button"
                  className="btn-text mt-4"
                  onClick={() => { setFilters(EMPTY); setShowing(false); }}
                >
                  Clear filters
                  <span aria-hidden="true" className="arrow text-travertine">→</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
