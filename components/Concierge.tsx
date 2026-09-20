"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CONTACT, FAQS } from "@/lib/content";
import { search, STARTERS, type Entry } from "@/lib/search";

/**
 * The concierge.
 *
 * One field, docked at the foot of the page and present on every screen, so a
 * question never requires finding the right section first. It replaces the
 * question index outright: the thirty-six answers are still here, but they are
 * something the concierge knows rather than a wall you scroll past.
 *
 * Closed it is a pale pill. Open, the pill and the panel above it invert to
 * ink, so the answer has a ground of its own and the page behind stops
 * competing for the eye.
 *
 * Choosing does the thing: a question opens its answer in place, a section
 * scrolls, a gallery category opens the gallery filtered, a number dials.
 */

type Lenis = {
  stop: () => void;
  start: () => void;
  scrollTo: (t: string | HTMLElement, o?: Record<string, unknown>) => void;
};
const lenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);

  // A placeholder that clips mid-word is worse than a shorter one. The long
  // form only appears where there is room for all of it.
  const [roomy, setRoomy] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const sync = () => setRoomy(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const uid = "concierge";

  const results = useMemo(() => (q.trim() ? search(q) : []), [q]);
  const rows: Entry[] = q.trim() ? results : STARTERS;

  const close = useCallback(() => {
    setOpen(false);
    setAnswer(null);
    inputRef.current?.blur();
  }, []);

  const reset = useCallback(() => {
    setQ("");
    setAnswer(null);
    setActive(0);
    inputRef.current?.focus();
  }, []);

  /* Cmd/Ctrl-K and "/" reach it from anywhere. "/" is ignored while a field
     has focus, so it cannot hijack someone filling in the enquiry form. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const typing =
        !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    };
    const onAsk = () => {
      setOpen(true);
      inputRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("scribeo:ask", onAsk);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scribeo:ask", onAsk);
    };
  }, []);

  // A click anywhere else closes it. The page keeps scrolling underneath —
  // this is a dock, not a modal, and locking the page would be a lie.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open, close]);

  useEffect(() => {
    setActive(0);
    setAnswer(null);
  }, [q]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView({ block: "nearest" });
  }, [active, rows.length]);

  const choose = useCallback(
    (entry: Entry, index: number) => {
      // A starter is a question someone has not finished asking yet: it fills
      // the field with the words that find the answer, rather than jumping.
      if (entry.query) {
        setQ(entry.query);
        inputRef.current?.focus();
        return;
      }
      // A question is answered here. There is no section left to send anyone to.
      if (entry.faq !== undefined) {
        setActive(index);
        setAnswer((a) => (a === entry.faq ? null : entry.faq!));
        return;
      }
      if (!entry.href.startsWith("#")) {
        window.location.href = entry.href;
        close();
        return;
      }
      close();
      setQ("");
      requestAnimationFrame(() => {
        if (entry.kind === "Gallery" && entry.category) {
          window.dispatchEvent(new CustomEvent("scribeo:gallery", { detail: { category: entry.category } }));
          return;
        }
        const target = document.querySelector<HTMLElement>(entry.href);
        if (!target) return;
        const l = lenis();
        if (l) l.scrollTo(target, { offset: -88, duration: 1.1 });
        else target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    },
    [close],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (answer !== null) setAnswer(null);
      else if (q) reset();
      else close();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (rows.length ? (i + 1) % rows.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const r = rows[active];
      if (r) choose(r, active);
    }
  };

  const shownAnswer = answer !== null ? FAQS[answer] : null;

  return (
    <div
      ref={rootRef}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[95] flex justify-center px-[clamp(0.75rem,3vw,2rem)] pb-[clamp(0.75rem,2.4vh,1.5rem)]"
    >
      <div className="pointer-events-auto w-full max-w-[56rem]">
        {/* Panel. Mounted only while open so it cannot eat a tap through the
            page, and translated rather than height-animated so the whole
            thing stays on the compositor. */}
        {open ? (
          <div
            id={`${uid}-panel`}
            role="listbox"
            aria-label="Concierge results"
            ref={listRef}
            className="concierge-panel mb-3 max-h-[min(62vh,34rem)] overflow-y-auto rounded-[1.4rem] bg-ink px-[clamp(1.1rem,2.4vw,2rem)] py-[clamp(1.1rem,2.2vh,1.6rem)] text-ground shadow-[0_24px_60px_-28px_rgba(22,20,15,0.55)]"
          >
            <div className="flex items-baseline justify-between gap-6 border-b border-ground/15 pb-4">
              <p className="t-eyebrow text-ground/55">Concierge</p>
              <p className="t-meta hidden text-right text-ground/40 sm:block">
                A sentence is fine — budget, plan, amenity, distance.
              </p>
            </div>

            {rows.length === 0 ? (
              <div className="py-8">
                <p className="t-display-s text-ground">No match for &ldquo;{q}&rdquo;.</p>
                <p className="mt-3 measure text-ground/55">
                  Try a plainer word — price, loan, parking, possession — or ask us directly.
                </p>
              </div>
            ) : (
              <ul>
                {rows.map((r, i) => {
                  const isOpen = r.faq !== undefined && answer === r.faq;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        id={`${uid}-opt-${i}`}
                        role="option"
                        aria-selected={i === active}
                        aria-expanded={r.faq !== undefined ? isOpen : undefined}
                        data-active={i === active}
                        onMouseMove={() => setActive(i)}
                        onClick={() => choose(r, i)}
                        className="flex w-full items-baseline justify-between gap-6 border-b border-ground/10 py-[clamp(0.7rem,1.6vh,1rem)] text-left transition-colors duration-150 data-[active=true]:text-ground"
                      >
                        <span className="t-concierge text-ground/90">{r.title}</span>
                        {r.faq !== undefined ? (
                          <span
                            aria-hidden="true"
                            className={`t-meta shrink-0 text-ground/40 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                          >
                            +
                          </span>
                        ) : (
                          <span className="t-meta shrink-0 text-ground/40">{r.detail}</span>
                        )}
                      </button>
                      {isOpen && shownAnswer ? (
                        <p className="measure-wide border-b border-ground/10 pb-5 pt-1 text-ground/65">
                          {shownAnswer.a}
                        </p>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            )}

            <p className="t-meta mt-5 text-ground/35">
              {FAQS.length} answers and the whole catalogue, read in your browser. No model, no network.
            </p>
          </div>
        ) : null}

        {/* The bar. It inverts with the panel so the pair reads as one object. */}
        <div
          className={`flex items-center gap-2 rounded-full pl-2 pr-2 transition-colors duration-300 ${
            open
              ? "bg-ink text-ground shadow-[0_18px_44px_-24px_rgba(22,20,15,0.6)]"
              : "bg-ground text-ink shadow-[0_14px_40px_-22px_rgba(22,20,15,0.45)] ring-1 ring-hair"
          }`}
        >
          <button
            type="button"
            onClick={() => {
              if (open && (q || answer !== null)) reset();
              else if (open) close();
              else {
                setOpen(true);
                inputRef.current?.focus();
              }
            }}
            aria-label={open ? "Clear" : "Open the concierge"}
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full transition-colors duration-200 ${
              open ? "text-ground/70 hover:text-ground" : "text-ink-dim hover:text-ink"
            }`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              {open ? <path d="M5 5l10 10M15 5L5 15" strokeLinecap="square" /> : <path d="M10 4v12M4 10h12" strokeLinecap="square" />}
            </svg>
          </button>

          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={`${uid}-panel`}
            aria-activedescendant={open && rows.length ? `${uid}-opt-${active}` : undefined}
            aria-autocomplete="list"
            aria-label="Ask the concierge"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
            placeholder={roomy ? "Ask about price, plans, amenities, distances…" : "Ask the concierge…"}
            className={`t-concierge-input min-w-0 flex-1 bg-transparent py-3.5 outline-none ${
              open ? "text-ground placeholder:text-ground/40" : "text-ink placeholder:text-ink-faint"
            }`}
          />

          <button
            type="button"
            onClick={() => {
              const r = rows[active];
              if (r) choose(r, active);
              else {
                setOpen(true);
                inputRef.current?.focus();
              }
            }}
            aria-label="Ask"
            className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors duration-200 ${
              open
                ? "border-ground/25 text-ground hover:border-ground/60"
                : "border-hair text-ink-dim hover:border-travertine hover:text-ink"
            }`}
          >
            <svg viewBox="0 0 20 20" aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M10 16V5M5 9.5 10 4.5l5 5" strokeLinecap="square" />
            </svg>
          </button>

          {/* The conversion path, in the same object rather than a second
              floating pill competing for the same corner. */}
          <a
            href="#enquire"
            data-cursor="open"
            onClick={close}
            className={`t-meta ml-1 hidden shrink-0 rounded-full px-5 py-3 transition-colors duration-300 lg:inline-block ${
              open ? "bg-ground text-ink hover:bg-ground/85" : "bg-ink text-ground hover:bg-travertine"
            }`}
          >
            Request a private viewing
          </a>
        </div>

        {/* Phone: the three things someone actually does, thumb-height. */}
        <div className="mt-2 grid grid-cols-3 gap-2 lg:hidden">
          <a
            href="#enquire"
            onClick={close}
            className="t-meta grid h-11 place-items-center rounded-full bg-ink text-ground transition-colors duration-300 hover:bg-travertine"
          >
            Enquire
          </a>
          <a
            href={CONTACT.phoneHref}
            className="t-meta grid h-11 place-items-center rounded-full bg-ground text-ink ring-1 ring-hair transition-colors duration-300 hover:ring-travertine"
          >
            Call
          </a>
          <a
            href={`https://wa.me/91${CONTACT.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="t-meta grid h-11 place-items-center rounded-full bg-ground text-ink ring-1 ring-hair transition-colors duration-300 hover:ring-travertine"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
