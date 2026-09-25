/**
 * In-page navigation.
 *
 * Every link to a section on this page goes through goTo(): one smooth
 * scroll (instant under reduced motion), and one history entry, so the
 * address bar names what the reader is looking at and Back returns to the
 * section they came from instead of leaving the site. MotionProvider routes
 * plain in-page anchors here too, so no link can bypass it.
 */
type Lenis = {
  scrollTo: (t: HTMLElement | number, o?: Record<string, unknown>) => void;
  stop: () => void;
  start: () => void;
};

export const getLenis = () => (window as unknown as { __lenis?: Lenis }).__lenis;

export const openSearch = () => window.dispatchEvent(new CustomEvent("scribeo:search"));

export function goTo(href: string, { record = true }: { record?: boolean } = {}) {
  const el = href.length > 1 ? document.querySelector<HTMLElement>(href) : null;
  if (!el) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenis();
  /* The destination is measured from the live scroll position, not from
     Lenis's internal one, which can trail by a frame after any native
     scroll (keyboard, find-in-page) and would land the page short. */
  if (lenis) lenis.scrollTo(Math.round(el.getBoundingClientRect().top + window.scrollY), { duration: 1.2, force: true });
  else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  if (record && location.hash !== href) history.pushState(null, "", href);
}
