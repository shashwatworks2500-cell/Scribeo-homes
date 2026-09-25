"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { closeOverlay, openOverlay } from "@/lib/overlay";
import { getLenis as lenis, goTo, openSearch } from "@/lib/nav";

/**
 * The header. Brand left, three chapters centred, Search and Enquire right —
 * nothing else. Fixed, and always there: Search, the chapters and the enquiry
 * are reachable from any point on the page, not only on the way back up.
 *
 * Over the hero it is transparent with warm white type on the photograph's
 * own top shade; the moment the page moves it becomes a warm, nearly solid
 * surface with charcoal type.
 */
const LINKS = [
  { href: "#residences", label: "Residences" },
  { href: "#amenities", label: "Amenities" },
  { href: "#location", label: "Location" },
] as const;

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const shut = useCallback(() => closeOverlay("menu"), []);

  /* The phone menu is an overlay like any other: it holds the page still,
     hides the action bar, answers Escape and Back, and gives focus back to
     the button that opened it. Widening past the phone layout closes it, so
     a rotated tablet can never be left with a locked page behind a panel
     that is no longer displayed. */
  useEffect(() => {
    if (!open) return;
    openOverlay("menu", () => setOpen(false));
    const root = document.documentElement;
    root.setAttribute("data-overlay", "menu");
    lenis()?.stop();
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("button, a")?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") void shut();
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && void shut();
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
      if (root.getAttribute("data-overlay") === "menu") root.removeAttribute("data-overlay");
      document.body.style.overflow = "";
      lenis()?.start();
      toggleRef.current?.focus();
    };
  }, [open, shut]);

  const follow = async (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (open) await shut();
    goTo(href);
  };

  const light = !solid && !open;
  const tone = light ? "text-on-dark" : "text-ink";
  const quiet = light ? "text-on-dark hover:text-white" : "text-ink-dim hover:text-ink";

  return (
    <>
      <header
        className="nav-settle fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500 ease-[var(--ease-out-quiet)]"
        style={{
          backgroundColor: light ? "transparent" : "rgba(244, 242, 237, 0.97)",
          backdropFilter: solid && !open ? "blur(8px)" : "none",
          borderColor: solid && !open ? "var(--color-hair)" : "transparent",
        }}
      >
        <div className="gutter grid h-16 grid-cols-[1fr_auto] items-center gap-6 md:h-[4.75rem] md:grid-cols-[1fr_auto_1fr]">
          <a
            href="#top"
            onClick={(e) => follow(e, "#top")}
            className={`t-eyebrow justify-self-start whitespace-nowrap transition-colors duration-300 ${tone}`}
          >
            Scribeo Homes
          </a>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-[clamp(1.75rem,3vw,3rem)]">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => follow(e, l.href)}
                    className={`t-nav inline-flex min-h-11 items-center transition-colors duration-300 ${quiet}`}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center justify-self-end gap-[clamp(1.25rem,2.4vw,2.25rem)]">
            <button
              type="button"
              onClick={() => (open ? shut().then(openSearch) : openSearch())}
              aria-keyshortcuts="Meta+K Control+K"
              className={`group inline-flex min-h-11 items-center gap-2 transition-colors duration-300 ${quiet}`}
            >
              <span className="transition-transform duration-300 ease-[var(--ease-out-quiet)] group-hover:-translate-y-px group-hover:translate-x-px">
                <Icon name="search" className="h-4 w-4" />
              </span>
              <span className="t-nav">Search</span>
            </button>
            <a
              href="#enquire"
              onClick={(e) => follow(e, "#enquire")}
              className={`t-nav hidden min-h-11 items-center transition-colors duration-300 md:inline-flex ${tone} ${
                light ? "hover:text-white" : "hover:text-accent"
              }`}
            >
              <span className={`border-b pb-1 ${light ? "border-on-dark/60" : "border-ink/40"}`}>Enquire</span>
            </a>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => (open ? void shut() : setOpen(true))}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className={`t-nav inline-flex min-h-11 items-center md:hidden ${tone}`}
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      <div id="mobile-menu" ref={panelRef} hidden={!open} data-lenis-prevent className="fixed inset-0 z-40 overflow-y-auto bg-ground md:hidden">
        <nav aria-label="Menu" className="gutter flex min-h-full flex-col justify-center py-24">
          <ul className="border-t hair">
            {LINKS.map((l, i) => (
              <li key={l.href} className="border-b hair">
                <a href={l.href} onClick={(e) => follow(e, l.href)} className="flex min-h-16 items-center gap-5 text-ink">
                  <span className="t-numeral text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="t-value">{l.label}</span>
                </a>
              </li>
            ))}
            <li className="border-b hair">
              <a href="#enquire" onClick={(e) => follow(e, "#enquire")} className="flex min-h-16 items-center gap-5 text-ink">
                <span className="t-numeral text-accent">04</span>
                <span className="t-value">Enquire</span>
              </a>
            </li>
          </ul>
          <button
            type="button"
            onClick={() => shut().then(openSearch)}
            className="btn btn-secondary mt-10 self-start"
          >
            <Icon name="search" className="h-4 w-4" />
            Search
          </button>
        </nav>
      </div>
    </>
  );
}
