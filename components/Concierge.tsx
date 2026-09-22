"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { AMENITIES, CONFIGS, CONTACT, DISTANCES } from "@/lib/content";
import { PRICE_SUMMARY, STARTERS, resolve, suggest, type Answer } from "@/lib/concierge";

/**
 * The concierge.
 *
 * A command panel over the site's own content: ⌘K or the navigation opens it,
 * a question resolves deterministically (lib/concierge.ts), and the answer
 * comes back as a card with somewhere to go — not a list of links to search
 * through. It is a navigation layer as much as an answer layer.
 *
 * Nothing here can invent a fact. Every number rendered below is read from
 * CONFIGS, AMENITIES, DISTANCES or CONTACT, and the one branch with no data
 * says so and offers the site office.
 */

/**
 * Send the reader somewhere on the page.
 *
 * Close FIRST. The panel stops Lenis while it is open so the page cannot
 * scroll behind it, and Lenis only restarts in that effect's cleanup — so a
 * scrollTo issued before closing was handed to a stopped instance and
 * silently did nothing. Closing, then scrolling on the next frame, means the
 * scroll is always given to a running one.
 */
const go = (hash: string, close: () => void) => {
  close();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLElement>(hash);
      const lenis = (window as unknown as { __lenis?: { scrollTo: (t: unknown, o?: object) => void } }).__lenis;
      if (el && lenis) lenis.scrollTo(el, { offset: 0, duration: 1.1 });
      else el?.scrollIntoView({ behavior: "smooth", block: "start" });
      if (el && location.hash !== hash) history.pushState(null, "", hash);
    });
  });
};

const enquire = (config?: string) =>
  window.dispatchEvent(new CustomEvent("scribeo:enquire", { detail: config ? { config } : undefined }));

/* ── shared pieces ──────────────────────────────────────────────────────── */

function Action({ children, onClick, primary = false }: { children: React.ReactNode; onClick: () => void; primary?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`t-meta rounded-full px-4 py-2 transition-colors duration-200 ${
        primary
          ? "bg-ground text-ink hover:bg-paper"
          : "border border-ground/25 text-ground/85 hover:border-ground/60 hover:text-ground"
      }`}
    >
      {children}
    </button>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[1rem] border border-ground/15 bg-ground/[0.04] p-5">{children}</div>;
}

function ConfigCard({ id, close }: { id: string; close: () => void }) {
  const c = CONFIGS.find((x) => x.id === id)!;
  return (
    <Card>
      <p className="t-display-m text-ground">{c.bhk}</p>
      <p className="t-meta mt-1 text-ground/55">{c.label}</p>
      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <dt className="t-label text-ground/45">Built-up</dt>
          <dd className="t-display-s mt-1 text-ground">{c.builtUpSqft.toLocaleString("en-IN")} sq ft</dd>
        </div>
        <div>
          <dt className="t-label text-ground/45">From</dt>
          <dd className="t-display-s mt-1 text-ground">{c.priceFrom}</dd>
        </div>
      </dl>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Action
          primary
          onClick={() => {
            window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: c.id } }));
            go("#plans", close);
          }}
        >
          View plan
        </Action>
        <Action onClick={() => { close(); enquire(c.bhk); }}>Enquire</Action>
      </div>
      <p className="t-meta mt-4 text-ground/40">Indicative pricing · taxes and statutory charges additional</p>
    </Card>
  );
}

/* ── the answer ─────────────────────────────────────────────────────────── */

function Result({ answer, close }: { answer: Answer; close: () => void }) {
  switch (answer.kind) {
    case "config":
      return <ConfigCard id={answer.config.id} close={close} />;

    case "configs":
    case "price":
      return (
        <div className="space-y-4">
          {answer.kind === "price" ? (
            <Card>
              <p className="t-label text-ground/45">Price range</p>
              <p className="t-display-m mt-2 text-ground">{PRICE_SUMMARY}</p>
              <p className="t-meta mt-3 text-ground/40">
                Indicative · exclusive of duty, registration and taxes
              </p>
            </Card>
          ) : null}
          <ul className="grid gap-3 sm:grid-cols-2">
            {CONFIGS.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: c.id } }));
                    go("#plans", close);
                  }}
                  className="w-full rounded-[0.9rem] border border-ground/15 bg-ground/[0.04] p-4 text-left transition-colors duration-200 hover:border-ground/40"
                >
                  <span className="t-display-s block text-ground">{c.bhk}</span>
                  <span className="t-meta mt-1 block text-ground/60">
                    {c.builtUpSqft.toLocaleString("en-IN")} sq ft · from {c.priceFrom}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      );

    case "plans":
      return (
        <Card>
          <p className="t-label text-ground/45">Floor plans</p>
          <p className="t-display-s mt-2 text-ground">Choose a configuration.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {CONFIGS.map((c) => (
              <Action
                key={c.id}
                primary={c.id === answer.configId}
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: c.id } }));
                  go("#plans", close);
                }}
              >
                {c.bhk}
              </Action>
            ))}
          </div>
        </Card>
      );

    case "amenities":
      return (
        <div className="space-y-3">
          {AMENITIES.filter((g) => !answer.group || g.group === answer.group).map((g) => (
            <Card key={g.group}>
              <p className="t-display-s text-ground">{g.group}</p>
              <p className="t-meta mt-2 text-ground/60">{g.lead.join(" · ")}</p>
            </Card>
          ))}
          <Action primary onClick={() => go("#amenities", close)}>
            View all amenities
          </Action>
        </div>
      );

    case "location":
      return (
        <div className="space-y-3">
          {(answer.place ? [answer.place] : DISTANCES.slice(0, 5)).map((d) => (
            <div key={d.place} className="flex items-baseline justify-between gap-5 border-b border-ground/12 pb-2.5">
              <span className="t-display-s text-ground">{d.place}</span>
              <span className="t-meta shrink-0 text-ground/60">
                {d.km.toFixed(1)} km · {d.mins} min
              </span>
            </div>
          ))}
          <p className="t-meta text-ground/40">Indicative, measured by road, to be confirmed on site.</p>
          <Action primary onClick={() => go("#location", close)}>
            View location
          </Action>
        </div>
      );

    case "visit":
      return (
        <Card>
          <p className="t-display-s text-ground">Book a private site visit</p>
          <p className="t-meta mt-2 text-ground/60">{CONTACT.hours}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Action primary onClick={() => { close(); enquire(); }}>Book a visit</Action>
            <Action onClick={() => { window.location.href = CONTACT.phoneHref; }}>
              Call {CONTACT.phoneDisplay}
            </Action>
          </div>
        </Card>
      );

    case "contact":
      return (
        <Card>
          <p className="t-label text-ground/45">Site office</p>
          <p className="t-display-s mt-2 text-ground">{CONTACT.phoneDisplay}</p>
          <p className="t-meta mt-1 text-ground/60">{CONTACT.email}</p>
          <p className="t-meta mt-3 text-ground/60">{CONTACT.hours}</p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Action primary onClick={() => { window.location.href = CONTACT.phoneHref; }}>Call</Action>
            <Action onClick={() => { window.location.href = CONTACT.emailHref; }}>Email</Action>
          </div>
        </Card>
      );

    case "gallery":
      return (
        <Card>
          <p className="t-display-s text-ground">Photography and drawings</p>
          <p className="t-meta mt-2 text-ground/60">
            Exteriors, interiors, landscape, amenities and the floor plans.
          </p>
          <div className="mt-5">
            <Action primary onClick={() => go("#gallery", close)}>
              View the gallery
            </Action>
          </div>
        </Card>
      );

    case "faq":
      return (
        <div className="space-y-3">
          {answer.faqs.map((f) => (
            <Card key={f.q}>
              <p className="t-display-s text-ground">{f.q}</p>
              <p className="measure-wide mt-2 text-ground/70">{f.a}</p>
            </Card>
          ))}
          <Action primary onClick={() => go("#faq", close)}>
            All questions
          </Action>
        </div>
      );

    default:
      return (
        <Card>
          <p className="t-display-s text-ground">
            That information isn&rsquo;t available here yet.
          </p>
          <p className="t-meta mt-2 text-ground/60">
            The Scribeo Homes team has the current details.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Action primary onClick={() => { close(); enquire(); }}>Contact us</Action>
            <Action onClick={() => { window.location.href = CONTACT.phoneHref; }}>
              Call {CONTACT.phoneDisplay}
            </Action>
          </div>
        </Card>
      );
  }
}

/* ── the panel ──────────────────────────────────────────────────────────── */

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);
  /* -1 until the reader steps into the list with the arrows. Enter submits
     what they typed; it only takes a suggestion once they have chosen one.
     Submitting the top suggestion on Enter meant typing "3 BHK" and getting
     whichever FAQ happened to rank first. */
  const [active, setActive] = useState(-1);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const restoreTo = useRef<HTMLElement | null>(null);
  const uid = useId();

  const close = useCallback(() => {
    setOpen(false);
    setQ("");
    setSubmitted(null);
    setActive(-1);
  }, []);

  const ask = useCallback((text: string) => {
    setQ(text);
    setSubmitted(text);
    setActive(-1);
  }, []);

  /* Open from anywhere: the navigation, the hero, ⌘K or Ctrl+K. */
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
    window.addEventListener("scribeo:ask", onAsk);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scribeo:ask", onAsk);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  /* Hold the page still behind the panel and give focus to the field. */
  useEffect(() => {
    if (!open) {
      restoreTo.current?.focus?.();
      return;
    }
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  const tips = useMemo(() => (submitted ? [] : suggest(q)), [q, submitted]);
  const rows = q.trim() && !submitted ? tips : [];
  const answer = submitted ? resolve(submitted) : null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      ask(active >= 0 && rows[active] ? rows[active] : q);
      return;
    }
    if (!rows.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1 >= rows.length ? 0 : i + 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? rows.length - 1 : i - 1));
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Scribeo Homes concierge"
      className="fixed inset-0 z-[95] flex items-end justify-center sm:items-start sm:pt-[clamp(3rem,12vh,7rem)]"
    >
      <button
        type="button"
        aria-label="Close the concierge"
        onClick={close}
        className="absolute inset-0 bg-ink/45 backdrop-blur-[3px] motion-safe:animate-[fadeIn_200ms_var(--ease-out-quiet)]"
      />

      <div className="concierge-panel relative flex max-h-[92svh] w-full flex-col overflow-hidden rounded-t-[1.4rem] bg-ink text-ground sm:max-w-[42rem] sm:rounded-[1.4rem]">
        <div className="flex items-baseline justify-between gap-5 border-b border-ground/12 px-[clamp(1.1rem,3vw,1.75rem)] pb-4 pt-[clamp(1.1rem,3vh,1.5rem)]">
          <div>
            <p className="t-label text-ground/45">Concierge</p>
            <p className="t-meta mt-1 text-ground/60">How can we help?</p>
          </div>
          <button
            type="button"
            onClick={close}
            className="t-meta shrink-0 rounded-full border border-ground/25 px-3.5 py-1.5 text-ground/70 transition-colors duration-200 hover:border-ground/60 hover:text-ground"
          >
            Close
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-ground/12 px-[clamp(1.1rem,3vw,1.75rem)] py-4">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-ground/40" fill="none" stroke="currentColor" strokeWidth="1.3">
            <circle cx="7" cy="7" r="4.6" />
            <path d="M10.4 10.4 14 14" strokeLinecap="square" />
          </svg>
          <input
            ref={inputRef}
            id={`${uid}-input`}
            type="text"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setSubmitted(null);
              setActive(-1);
            }}
            onKeyDown={onKeyDown}
            role="combobox"
            aria-expanded={rows.length > 0}
            aria-controls={`${uid}-list`}
            aria-activedescendant={active >= 0 && rows[active] ? `${uid}-opt-${active}` : undefined}
            aria-label="Ask about price, plans, amenities or location"
            autoComplete="off"
            placeholder="Ask about price, plans, amenities, location…"
            className="t-concierge w-full bg-transparent text-ground outline-none placeholder:text-ground/35"
          />
          <kbd aria-hidden="true" className="t-meta hidden shrink-0 text-ground/30 sm:block">
            esc
          </kbd>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain px-[clamp(1.1rem,3vw,1.75rem)] py-[clamp(1.1rem,3vh,1.5rem)]">
          {answer ? (
            <Result answer={answer} close={close} />
          ) : rows.length ? (
            <ul id={`${uid}-list`} role="listbox" aria-label="Suggestions">
              {rows.map((s, i) => (
                <li key={s} role="option" id={`${uid}-opt-${i}`} aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => ask(s)}
                    className={`t-concierge block w-full rounded-lg px-3 py-2.5 text-left transition-colors duration-150 ${
                      i === active ? "bg-ground/10 text-ground" : "text-ground/70"
                    }`}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="t-label text-ground/40">Popular questions</p>
              <ul className="mt-4 space-y-1">
                {STARTERS.map((s, i) => (
                  <li key={s} style={{ animationDelay: `${i * 28}ms` }} className="motion-safe:animate-[riseIn_320ms_var(--ease-out-quiet)_both]">
                    <button
                      type="button"
                      onClick={() => ask(s)}
                      className="t-concierge block w-full rounded-lg px-3 py-2.5 text-left text-ground/75 transition-colors duration-150 hover:bg-ground/10 hover:text-ground"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
