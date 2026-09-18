"use client";

import { useEffect, useRef, useState } from "react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#architecture", label: "Architecture" },
  { href: "#residence", label: "Residence" },
  { href: "#landscape", label: "Landscape" },
  { href: "#enquire", label: "Enquire" },
] as const;

type Lenis = { scrollTo: (t: string | HTMLElement, o?: Record<string, unknown>) => void };

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
          backgroundColor: solid && !open ? "rgba(11,10,8,0.82)" : "transparent",
          backdropFilter: solid && !open ? "blur(10px)" : "none",
          borderBottom: `1px solid ${solid && !open ? "var(--color-hair)" : "transparent"}`,
        }}
      >
        <div className="gutter flex h-[clamp(4rem,9vh,5.5rem)] items-center justify-between">
          <a
            href="#top"
            onClick={(e) => go(e, "#top")}
            className="t-eyebrow text-stone transition-colors duration-200 hover:text-travertine"
          >
            Scribeo&nbsp;Homes
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-[clamp(1.5rem,2.6vw,3rem)]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => go(e, l.href)}
                    className="t-meta text-stone-dim transition-colors duration-200 hover:text-stone"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="t-meta relative z-50 text-stone md:hidden"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
        <span aria-hidden="true" className="block h-px w-full bg-transparent">
          <span
            ref={progressRef}
            className="block h-px w-full origin-left bg-travertine/45"
            style={{ transform: "scaleX(0)" }}
          />
        </span>
      </header>

      {/* Mobile panel: full-bleed, typographic, same register as the page. */}
      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-40 bg-ink md:hidden"
      >
        <nav aria-label="Primary" className="gutter flex h-full flex-col justify-center">
          <ul className="space-y-[clamp(1rem,3.2vh,2rem)]">
            {LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => go(e, l.href)}
                  className="t-display-m flex items-baseline gap-5 text-stone"
                >
                  <span className="t-numeral text-travertine/70">{String(i + 1).padStart(2, "0")}</span>
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
