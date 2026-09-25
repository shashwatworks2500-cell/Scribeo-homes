"use client";

import { useEffect, useRef } from "react";
import { getLenis } from "@/lib/nav";

/**
 * Animated <details>.
 *
 * The rows are plain <details> rendered on the server, so every answer is in
 * the document and they open and close with scripting off. This wrapper
 * takes over the summary click once the page is running and animates the
 * height, 300ms opening and 300ms closing.
 *
 * `exclusive` keeps one row open at a time. The HTML `name` attribute does
 * that natively without JavaScript, but it closes the other row instantly;
 * here the other row is animated shut while the new one opens, and if the
 * row closing is above the one opening, the page is held so the row the
 * reader chose stays exactly where it was under their pointer — no jump.
 */
const DUR = 300;
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

type Anim = HTMLDetailsElement & { _anim?: Animation };

function closedHeight(d: HTMLDetailsElement) {
  const s = d.querySelector<HTMLElement>(":scope > summary");
  return (s?.offsetHeight ?? 0) + (d.offsetHeight - d.clientHeight);
}

function run(d: Anim, open: boolean, instant: boolean) {
  const from = d.getBoundingClientRect().height;
  d._anim?.cancel();
  d._anim = undefined;
  d.style.overflow = "";
  if (instant) {
    d.open = open;
    delete d.dataset.state;
    return;
  }
  if (open) d.open = true;
  const to = open ? d.getBoundingClientRect().height : closedHeight(d);
  if (Math.abs(to - from) < 1) {
    if (!open) d.open = false;
    delete d.dataset.state;
    return;
  }
  d.dataset.state = open ? "opening" : "closing";
  d.style.overflow = "hidden";
  const anim = d.animate({ height: [`${from}px`, `${to}px`] }, { duration: DUR, easing: EASE, fill: "forwards" });
  d._anim = anim;
  anim.onfinish = () => {
    if (!open) d.open = false;
    d.style.overflow = "";
    delete d.dataset.state;
    anim.cancel();
    d._anim = undefined;
  };
}

/** Keep `anchor` still on screen while rows above it change height. */
function hold(anchor: HTMLElement) {
  const top0 = anchor.getBoundingClientRect().top;
  if (top0 < 0 || top0 > window.innerHeight) return;
  const t0 = performance.now();
  const tick = () => {
    const dy = anchor.getBoundingClientRect().top - top0;
    if (Math.abs(dy) > 0.5) {
      const y = window.scrollY + dy;
      const lenis = getLenis() as unknown as { scrollTo: (y: number, o: object) => void } | undefined;
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true });
      else window.scrollTo(0, y);
    }
    if (performance.now() - t0 < DUR + 60) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function Accordion({
  exclusive = false,
  className,
  id,
  children,
  ...rest
}: {
  exclusive?: boolean;
  className?: string;
  id?: string;
  children: React.ReactNode;
} & Record<`data-${string}`, string | boolean | undefined>) {
  const root = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    /* Exclusivity moves from the attribute to this script, which can animate it. */
    if (exclusive) el.querySelectorAll("details[name]").forEach((d) => d.removeAttribute("name"));

    const onClick = (e: MouseEvent) => {
      const summary = (e.target as Element).closest("summary");
      if (!summary || !el.contains(summary)) return;
      const d = summary.parentElement as Anim | null;
      if (!d || d.tagName !== "DETAILS") return;
      e.preventDefault();
      const instant = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      /* A row part-way through closing counts as closed: clicking it again
         reverses it from wherever it has got to. */
      if (d.open && d.dataset.state !== "closing") {
        run(d, false, instant);
        return;
      }
      if (exclusive) {
        let above = false;
        el.querySelectorAll<Anim>("details[open]").forEach((o) => {
          if (o === d || o.dataset.state === "closing") return;
          if (o.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING) above = true;
          run(o, false, instant);
        });
        if (above && !instant) hold(summary as HTMLElement);
      }
      run(d, true, instant);
    };
    el.addEventListener("click", onClick);
    return () => el.removeEventListener("click", onClick);
  }, [exclusive]);

  return (
    <div ref={root} id={id} className={className} {...rest}>
      {children}
    </div>
  );
}
