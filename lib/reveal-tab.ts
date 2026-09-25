/**
 * Bring a tab fully into view inside its own sideways-scrolling row, without
 * touching the page's scroll position. (scrollIntoView would also nudge the
 * window natively, behind Lenis's back, and the next smooth scroll would then
 * start from a stale position.)
 */
export function revealInRow(el: HTMLElement | null | undefined) {
  const row = el?.parentElement;
  if (!el || !row || row.scrollWidth <= row.clientWidth) return;
  const r = row.getBoundingClientRect();
  const e = el.getBoundingClientRect();
  const pad = 20;
  if (e.left < r.left + pad) row.scrollBy({ left: e.left - r.left - pad, behavior: "smooth" });
  else if (e.right > r.right - pad) row.scrollBy({ left: e.right - r.right + pad, behavior: "smooth" });
}
