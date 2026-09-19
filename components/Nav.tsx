"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#pricing", label: "Configurations" },
  { href: "#residences", label: "Floor plans" },
  { href: "#amenities", label: "Amenities" },
  { href: "#gallery", label: "Gallery" },
  { href: "#enquire", label: "Enquire" },
] as const;

type Lenis = { scrollTo: (t: string | HTMLElement, o?: Record<string, unknown>) => void };

/** Focuses the docked concierge rather than opening a second surface. */
function AskTrigger({ variant = "bar" }: { variant?: "bar" | "icon" | "row" }) {
  const ask = () => window.dispatchEvent(new CustomEvent("scribeo:ask"));
  const glass = (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.3">
      <circle cx="7" cy="7" r="4.6" />
      <path d="M10.4 10.4 14 14" strokeLinecap="square" />
    </svg>
  );
  if (variant === "icon")
    return (
      <button type="button" onClick={ask} aria-label="Ask the concierge" className="text-ink transition-colors duration-200 hover:text-travertine">
        <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[1.05rem] w-[1.05rem]" fill="none" stroke="currentColor" strokeWidth="1.3">
          <circle cx="7" cy="7" r="4.6" />
          <path d="M10.4 10.4 14 14" strokeLinecap="square" />
        </svg>
      </button>
    );
  if (variant === "row")
    return (
      <button type="button" onClick={ask} className="t-meta flex w-full items-center gap-3 border-b border-rule pb-3 text-left text-ink-dim transition-colors duration-200 hover:border-travertine hover:text-ink">
        {glass}
        <span>Ask the concierge</span>
      </button>
    );
  return (
    <button type="button" onClick={ask} className="t-meta flex items-center gap-2.5 border-b border-rule pb-1.5 text-ink-dim transition-colors duration-200 hover:border-travertine hover:text-ink">
      {glass}
      <span>Concierge</span>
      <kbd aria-hidden="true" className="t-numeral text-ink-faint">⌘K</kbd>
    </button>
  );
}

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const lastY = useRef(0);
  const progressRef = useRef<HTMLSpanElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  /* Reveal on scroll up, retreat on scroll down. The bar never occupies the
     frame while the reader is moving forward through the page. */
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      // Reading progress. Orientation only — it never moves anything else.
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      if (!open) setHidden(y > lastY.current && y > 220);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  // Escape closes, focus returns to the control that opened it.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock the page behind the mobile panel, Lenis included.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const el = document.querySelector<HTMLElement>(href);
    if (!el) return;
    e.preventDefault();
    setOpen(false);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis) lenis.scrollTo(el, { offset: 0, duration: 1.3 });
    else el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-[transform,background-color,border-color] duration-500"
        style={{
          transform: hidden ? "translateY(-100%)" : "translateY(0)",
          transitionTimingFunction: "var(--ease-in-out-quiet)",
          backgroundColor: solid && !open ? "rgba(251,250,247,0.88)" : "transparent",
          backdropFilter: solid && !open ? "blur(10px)" : "none",
          borderBottom: `1px solid ${solid && !open ? "var(--color-hair)" : "transparent"}`,
        }}
      >
        <div className="gutter flex h-[clamp(4rem,9vh,5.5rem)] items-center justify-between">
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            className="t-eyebrow text-ink transition-colors duration-200 hover:text-travertine"
          >
            Scribeo&nbsp;Homes
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-[clamp(1.25rem,2.2vw,2.5rem)]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className="t-meta text-ink-dim transition-colors duration-200 hover:text-ink"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li className="ml-[clamp(0.5rem,1.4vw,1.5rem)]">
                <AskTrigger />
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-5 md:hidden">
            <AskTrigger variant="icon" />
            <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="t-meta relative z-50 text-ink"
          >
            {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <span aria-hidden="true" className="block h-px w-full bg-transparent">
          <span
            ref={progressRef}
            className="block h-px w-full origin-left bg-travertine"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </header>

      {/* Mobile panel: full-bleed, typographic, same register as the page. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-40 bg-ground md:hidden"
      >
        <nav aria-label="Primary" className="gutter flex h-full flex-col justify-center">
          <div className="mb-[clamp(2rem,5vh,3rem)]">
            <AskTrigger variant="row" />
          </div>
          <ul className="space-y-[clamp(1rem,3.2vh,2rem)]">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="t-display-m flex items-baseline gap-5 text-ink"
                >
                  <span className="t-numeral text-travertine">{String(i + 1).padStart(2, "0")}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
