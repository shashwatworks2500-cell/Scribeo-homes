"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Icon from "./Icon";
import { A } from "@/lib/assets";
import { CONFIGS, type Config } from "@/lib/content";
import { AREA_BANDS, EMPTY, PRICE_BANDS, apply, isEmpty, type Filters } from "@/lib/search";
import { closeOverlay, isOverlayOpen, openOverlay } from "@/lib/overlay";
import { getLenis, goTo } from "@/lib/nav";

/**
 * Search.
 *
 * A full-viewport overlay on the warm ground: SEARCH and Close across the
 * top, "Find your residence.", then four filter groups — Configuration,
 * Area, Price, Availability — with Show Residences and Reset beneath.
 * Every option is derived from the project's own four configurations.
 * Availability is not published for this development, so that group states
 * the project's own wording instead of offering a filter it cannot answer.
 *
 * Opened by the navigation, the footer or ⌘K / Ctrl+K; closed by Close,
 * Escape or Back. While it is open the page behind is held still, the phone
 * action bar is hidden, and focus stays inside.
 */
function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="min-w-0 border-t hair pt-5">
      <legend className="sr-only">{label}</legend>
      <p aria-hidden="true" className="t-label text-ink-dim">
        {label}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={`t-meta inline-flex min-h-12 items-center gap-2 rounded-[6px] border px-4 transition-colors duration-200 ${
        on ? "border-ink bg-ink text-ground" : "border-rule text-ink hover:border-ink hover:bg-ground-2"
      }`}
    >
      {on ? <Icon name="check" className="h-3.5 w-3.5" /> : null}
      {children}
    </button>
  );
}

function ResultCard({ config, onPlan, onEnquire }: { config: Config; onPlan: () => void; onEnquire: () => void }) {
  const asset = A[config.image];
  return (
    <li className="grid grid-cols-[7rem_1fr] items-center gap-x-5 gap-y-4 border-b hair py-6 sm:grid-cols-[11rem_1fr_auto] sm:gap-x-8">
      <div className="relative aspect-[4/3] overflow-hidden bg-ground-2">
        <Image src={asset.src} alt="" fill sizes="(max-width: 640px) 112px, 176px" quality={75} className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className="t-value text-ink">{config.bhk}</p>
        <p className="t-meta text-ink-dim">{config.label}</p>
        <p className="t-meta mt-2 text-ink">
          {config.builtUpSqft.toLocaleString("en-IN")} sq ft · from {config.priceFrom}
        </p>
      </div>
      <div className="col-span-2 flex flex-wrap gap-x-8 gap-y-1 sm:col-span-1 sm:flex-col sm:items-start">
        <button type="button" className="btn-text" onClick={onPlan}>
          View plan
          <Icon name="arrow-right" className="arrow h-4 w-4" />
        </button>
        <button type="button" className="btn-text" onClick={onEnquire}>
          Enquire
          <Icon name="arrow-right" className="arrow h-4 w-4" />
        </button>
      </div>
    </li>
  );
}

export default function Search() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [showing, setShowing] = useState(false);
  const dialog = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const openRef = useRef(false);
  openRef.current = open;

  const close = useCallback(() => closeOverlay("search"), []);

  useEffect(() => {
    const show = () => {
      if (openRef.current || isOverlayOpen()) return;
      restoreTo.current = document.activeElement as HTMLElement;
      setOpen(true);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (openRef.current) void close();
        else show();
      }
    };
    window.addEventListener("scribeo:search", show);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scribeo:search", show);
      window.removeEventListener("keydown", onKey);
    };
  }, [close]);

  useEffect(() => {
    if (!open) return;
    openOverlay("search", () => {
      setOpen(false);
      setShowing(false);
    });
    const root = document.documentElement;
    root.setAttribute("data-overlay", "search");
    getLenis()?.stop();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => closeRef.current?.focus(), 40);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        void close();
      } else if (e.key === "Tab") {
        const f = dialog.current?.querySelectorAll<HTMLElement>("button:not(:disabled), a[href]");
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
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      if (root.getAttribute("data-overlay") === "search") root.removeAttribute("data-overlay");
      document.body.style.overflow = before;
      getLenis()?.start();
      restoreTo.current?.focus?.({ preventScroll: true });
    };
  }, [open, close]);

  if (!open) return null;

  const results = apply(filters);
  const toggleBhk = (id: string) =>
    setFilters((f) => ({ ...f, bhk: f.bhk.includes(id) ? f.bhk.filter((x) => x !== id) : [...f.bhk, id] }));
  const reset = () => {
    setFilters(EMPTY);
    setShowing(false);
  };
  const show = () => {
    setShowing(true);
    requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };
  const viewPlan = async (c: Config) => {
    await close();
    window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: c.id } }));
    goTo("#plans");
  };
  const enquire = async (c: Config) => {
    await close();
    window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: { config: c.bhk } }));
  };

  return (
    <div
      ref={dialog}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-heading"
      data-lenis-prevent
      className="fixed inset-0 z-[95] overflow-y-auto overscroll-contain bg-ground motion-safe:animate-[fadeIn_220ms_var(--ease-out-quiet)]"
    >
      <div className="shell gutter flex min-h-full flex-col pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <div className="flex h-16 items-center justify-between gap-6 md:h-[4.75rem]">
          <p className="t-label text-ink-dim">Search</p>
          <button ref={closeRef} type="button" onClick={() => void close()} className="btn btn-secondary">
            <Icon name="close" className="h-4 w-4" />
            Close
          </button>
        </div>

        <h2 id="search-heading" className="t-section mt-[clamp(1.5rem,5vh,3.5rem)] max-w-[14ch] text-ink">
          Find your residence.
        </h2>

        <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-8 md:grid-cols-2 lg:grid-cols-4">
          <Group label="Configuration">
            {CONFIGS.map((c) => (
              <Chip key={c.id} on={filters.bhk.includes(c.id)} onClick={() => toggleBhk(c.id)}>
                {c.bhk}
              </Chip>
            ))}
          </Group>
          <Group label="Area">
            {AREA_BANDS.map((b) => (
              <Chip key={b.id} on={filters.area === b.id} onClick={() => setFilters((f) => ({ ...f, area: f.area === b.id ? null : b.id }))}>
                {b.label}
              </Chip>
            ))}
          </Group>
          <Group label="Price">
            {PRICE_BANDS.map((b) => (
              <Chip key={b.id} on={filters.price === b.id} onClick={() => setFilters((f) => ({ ...f, price: f.price === b.id ? null : b.id }))}>
                {b.label}
              </Chip>
            ))}
          </Group>
          <Group label="Availability">
            <p className="t-body text-ink-dim">Details available from the site office.</p>
          </Group>
        </div>

        <div className="mt-[clamp(2rem,5vh,3rem)] flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
          <button type="button" className="btn btn-primary sm:min-w-[15rem]" onClick={show}>
            Show Residences
          </button>
          <button type="button" className="btn btn-secondary" onClick={reset} disabled={isEmpty(filters) && !showing}>
            Reset
          </button>
          <p aria-live="polite" className="t-meta text-ink-dim sm:ml-2">
            {results.length} of {CONFIGS.length} residences match
          </p>
        </div>

        {showing ? (
          <div ref={resultsRef} className="mt-[clamp(2rem,5vh,3rem)] scroll-mt-6 border-t hair">
            {results.length ? (
              <ul aria-label="Matching residences">
                {results.map((c) => (
                  <ResultCard key={c.id} config={c} onPlan={() => viewPlan(c)} onEnquire={() => enquire(c)} />
                ))}
              </ul>
            ) : (
              <div className="py-[clamp(2.5rem,7vh,4.5rem)]">
                <p className="t-value text-ink">No residences match those preferences.</p>
                <button type="button" className="btn-text mt-3" onClick={reset}>
                  Clear filters
                  <Icon name="arrow-right" className="arrow h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
