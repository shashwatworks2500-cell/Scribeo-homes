"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { search, SUGGESTIONS, type Entry, type Kind } from "@/lib/search";

/**
 * Site search.
 *
 * One field that answers a buyer's question wherever they are on the page, so
 * they are not required to find the question index first. It searches the same
 * content the page renders — questions, configurations, amenities, distances,
 * gallery categories, sections and contact details — from lib/search.ts, which
 * builds its index from those modules rather than restating them.
 *
 * Choosing a result does the thing rather than just scrolling near it: a
 * question opens at its answer, a gallery category opens the gallery already
 * filtered, a phone number dials.
 *
 * Keyboard: Cmd/Ctrl-K or "/" opens, arrows move, Enter chooses, Escape
 * closes and returns focus to whatever opened it.
 */

type Lenis = {
  stop: () => void;
  start: () => void;
  scrollTo: (t: string | HTMLElement, o?: Record<string, unknown>) => void;
};
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

const KIND_ORDER: Kind[] = ["Question", "Configuration", "Section", "Nearby", "Amenity", "Gallery", "Contact"];

export default function Search() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const openerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => search(q), [q]);

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setActive(0);
    openerRef.current?.focus();
  }, []);

  /* Opened by the nav trigger, by Cmd/Ctrl-K, or by "/" — but never by "/"
     typed into a field, which would hijack someone filling in the form. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing = !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openerRef.current = document.activeElement as HTMLElement;
        setOpen(true);
      }
    };
    const onOpen = (e: Event) => {
      openerRef.current = (e as CustomEvent<{ opener?: HTMLElement }>).detail?.opener ?? null;
      setOpen(true);
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("scribeo:search", onOpen);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scribeo:search", onOpen);
    };
  }, [open]);

  // Lock the page behind the panel, Lenis included.
  useEffect(() => {
    if (!open) return;
    const l = lenis();
    l?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      l?.start();
      document.body.style.overflow = prev;
    };
  }, [open]);

  const choose = useCallback(
    (entry: Entry) => {
      // tel: and mailto: are navigations, not in-page jumps.
      if (!entry.href.startsWith("#")) {
        window.location.href = entry.href;
        setOpen(false);
        setQ("");
        return;
      }
      setOpen(false);
      setQ("");
      setActive(0);

      // The panel is unmounting; let it release the scroll lock before moving.
      requestAnimationFrame(() => {
        if (entry.kind === "Gallery" && entry.category) {
          window.dispatchEvent(new CustomEvent("scribeo:gallery", { detail: { category: entry.category } }));
          return;
        }
        let target: HTMLElement | null = null;
        if (entry.faq !== undefined) {
          const d = document.getElementById(`faq-q-${entry.faq}`) as HTMLDetailsElement | null;
          if (d) {
            d.open = true;
            target = d;
          }
        }
        target = target ?? document.querySelector<HTMLElement>(entry.href);
        if (!target) return;
        const l = lenis();
        if (l) l.scrollTo(target, { offset: -96, duration: 1.2 });
        else target.scrollIntoView({ behavior: "smooth", block: "start" });
        // Move reading position too, not just the viewport.
        target.setAttribute("tabindex", "-1");
        setTimeout(() => target?.focus({ preventScroll: true }), 900);
      });
    },
    [],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
    } else if (e.key === "Home") {
      setActive(0);
    } else if (e.key === "End") {
      setActive(Math.max(0, flat.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = flat[active];
      if (r) choose(r);
    } else if (e.key === "Tab") {
      // The panel is modal: keep focus inside it.
      const f = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!f || !f.length) return;
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

  // Keep the highlighted row in view as the arrows walk the list.
  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  useEffect(() => setActive(0), [q]);

  /* Grouped for reading, but a group never outranks a better match in another
     group: groups are ordered by their own best result, so the strongest hit
     is always the first row on screen. `flat` is that same rendered order, and
     the arrow keys walk it — indexing the ungrouped score order instead would
     send the highlight jumping between groups. */
  const grouped = useMemo(() => {
    const by = new Map<Kind, Entry[]>();
    for (const r of results) {
      const list = by.get(r.kind);
      if (list) list.push(r);
      else by.set(r.kind, [r]);
    }
    return [...by.entries()].sort(
      (a, b) =>
        results.indexOf(a[1][0]) - results.indexOf(b[1][0]) ||
        KIND_ORDER.indexOf(a[0]) - KIND_ORDER.indexOf(b[0]),
    );
  }, [results]);

  const flat = useMemo(() => grouped.flatMap(([, list]) => list), [grouped]);
  const indexOf = (e: Entry) => flat.indexOf(e);

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[96] flex flex-col bg-ground/[0.97] backdrop-blur-lg sm:items-center sm:pt-[12vh]"
          onKeyDown={onKeyDown}
        >
          {/* Clicking the ground closes, the way a dialog scrim does. */}
          <button
            type="button"
            aria-label="Close search"
            tabIndex={-1}
            onClick={close}
            className="absolute inset-0 cursor-default"
          />

          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Search this site"
            className="relative flex max-h-full w-full flex-col sm:max-w-[46rem]"
          >
            <div className="gutter flex items-center gap-4 border-b hair py-5 sm:px-8">
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-travertine" fill="none" stroke="currentColor" strokeWidth="1.3">
                <circle cx="7" cy="7" r="4.6" />
                <path d="M10.4 10.4 14 14" strokeLinecap="square" />
              </svg>
              <input
                ref={inputRef}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                enterKeyHint="search"
                aria-label="Search questions, plans, amenities and distances"
                aria-controls="search-results"
                aria-expanded={results.length > 0}
                placeholder="Search price, plans, amenities, distances…"
                className="t-lede w-full bg-transparent py-1 text-ink outline-none placeholder:text-ink-faint"
              />
              <button type="button" onClick={close} className="t-meta shrink-0 text-ink-dim hover:text-ink">
                Close
              </button>
            </div>

            <div
              id="search-results"
              ref={listRef}
              className="gutter flex-1 overflow-y-auto py-5 sm:px-8"
            >
              <p aria-live="polite" className="sr-only">
                {q ? `${results.length} result${results.length === 1 ? "" : "s"} for ${q}` : ""}
              </p>

              {!q ? (
                <>
                  <p className="t-meta text-ink-faint">Try</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setQ(s);
                          inputRef.current?.focus();
                        }}
                        className="t-meta border border-rule px-3.5 py-1.5 text-ink-dim transition-colors duration-200 hover:border-travertine hover:text-ink"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              ) : results.length === 0 ? (
                <div>
                  <p className="t-display-s text-ink">No match for &ldquo;{q}&rdquo;.</p>
                  <p className="mt-3 measure text-ink-dim">
                    Try a plainer word — &ldquo;price&rdquo;, &ldquo;loan&rdquo;, &ldquo;parking&rdquo; — or ask us directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => choose({ id: "x", kind: "Section", title: "Enquire", tags: [], href: "#enquire" })}
                    className="t-display-s mt-6 inline-flex items-baseline gap-3 border-b border-travertine/70 pb-1 text-ink transition-colors duration-300 hover:border-travertine"
                  >
                    Ask us <span aria-hidden="true" className="t-meta text-travertine">→</span>
                  </button>
                </div>
              ) : (
                grouped.map(([kind, list]) => (
                  <section key={kind} className="mb-7 last:mb-0">
                    <h2 className="t-eyebrow border-b hair pb-3 text-travertine">{kind}</h2>
                    <ul>
                      {list.map((r) => {
                        const i = indexOf(r);
                        return (
                          <li key={r.id}>
                            <button
                              type="button"
                              data-active={i === active}
                              onMouseMove={() => setActive(i)}
                              onClick={() => choose(r)}
                              className="flex w-full flex-col items-start gap-1 border-b hair py-3 text-left transition-colors duration-150 data-[active=true]:bg-ground-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-5"
                            >
                              <span className="t-faq text-ink">{r.title}</span>
                              {r.detail ? (
                                <span className="t-meta text-ink-faint sm:shrink-0">{r.detail}</span>
                              ) : null}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

/**
 * The control that opens it. Separate because the navigation bar is
 * transformed, and a transformed ancestor becomes the containing block for
 * position: fixed — the panel would be trapped inside the header.
 */
export function SearchTrigger({ variant = "bar" }: { variant?: "bar" | "icon" | "row" }) {
  const openPanel = (ev: React.MouseEvent<HTMLButtonElement>) => {
    window.dispatchEvent(
      new CustomEvent("scribeo:search", { detail: { opener: ev.currentTarget } }),
    );
  };
  const glass = (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.4 10.4 14 14" strokeLinecap="square" />
    </svg>
  );

  if (variant === "icon") {
    return (
      <button type="button" onClick={openPanel} aria-label="Search this site" className="text-ink transition-colors duration-200 hover:text-travertine">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="7" cy="7" r="4.6" />
          <path d="M10.4 10.4 14 14" strokeLinecap="square" />
        </svg>
      </button>
    );
  }

  if (variant === "row") {
    return (
      <button
        type="button"
        onClick={openPanel}
        className="t-meta flex w-full items-center gap-3 border-b border-rule pb-3 text-left text-ink-dim transition-colors duration-200 hover:border-travertine hover:text-ink"
      >
        {glass}
        <span>Search price, plans, amenities…</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openPanel}
      className="t-meta flex items-center gap-2.5 border-b border-rule pb-1.5 text-ink-dim transition-colors duration-200 hover:border-travertine hover:text-ink"
    >
      {glass}
      <span>Search</span>
      <kbd aria-hidden="true" className="t-numeral text-ink-faint">⌘K</kbd>
    </button>
  );
}
