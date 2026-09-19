"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Entry sequence.
 *
 * The hero needs a moment to decode its first frames; without a curtain that
 * moment reads as a flash of empty dark. This turns the wait into the first
 * deliberate thing you see, and lifts on real readiness (the hero broadcasts
 * `hero:ready`) rather than on a guessed timer.
 *
 * Two hard rules: it never blocks longer than CAP, and it is inert to
 * assistive technology — the page beneath is complete the whole time.
 */
const CAP_MS = 3200;
/** Below this the lift reads as a flicker rather than a considered entry. */
const MIN_MS = 620;

export default function Curtain() {
  const [lifting, setLifting] = useState(false);
  const [gone, setGone] = useState(false);
  const barRef = useRef<HTMLSpanElement | null>(null);
  const lifted = useRef(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setGone(true);
      return;
    }

    const mounted = Date.now();
    const lift = () => {
      if (lifted.current) return;
      const waited = Date.now() - mounted;
      if (waited < MIN_MS) {
        window.setTimeout(lift, MIN_MS - waited);
        return;
      }
      lifted.current = true;
      // Tell the inline failsafe to stand down: React has this.
      document.documentElement.dataset.curtain = "lifted";
      setLifting(true);
      // Hand scrolling back the moment the lift starts. Holding it for the
      // full slide means ~1.1s where the page looks ready but ignores input.
      document.documentElement.style.overflow = "";
      window.setTimeout(() => setGone(true), 1150);
    };

    const onProgress = (e: Event) => {
      const v = (e as CustomEvent<number>).detail ?? 0;
      if (barRef.current) barRef.current.style.transform = `scaleX(${Math.max(0.04, v)})`;
    };

    window.addEventListener("hero:progress", onProgress);
    window.addEventListener("hero:ready", lift);
    const cap = window.setTimeout(lift, CAP_MS);

    // Scrolling is meaningless while the curtain is down, and a scroll that
    // "does nothing" feels broken — so hold position until it lifts.
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("hero:progress", onProgress);
      window.removeEventListener("hero:ready", lift);
      window.clearTimeout(cap);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (gone) document.documentElement.style.overflow = "";
  }, [gone]);

  if (gone) return null;

  return (
    <div
      id="entry-curtain"
      aria-hidden="true"
      className="fixed inset-0 z-[90] flex items-center justify-center bg-ground"
      style={{
        transform: lifting ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 1100ms cubic-bezier(0.76, 0, 0.24, 1)",
      }}
    >
      <div
        className="flex flex-col items-center gap-6"
        style={{
          opacity: lifting ? 0 : 1,
          transition: "opacity 420ms ease-out",
        }}
      >
        <p className="t-eyebrow text-ink" style={{ letterSpacing: "0.42em" }}>
          Scribeo&nbsp;Homes
        </p>
        <span className="relative block h-px w-[clamp(7rem,22vw,12rem)] bg-hair">
          <span
            ref={barRef}
            className="absolute inset-0 block origin-left bg-travertine"
            style={{ transform: "scaleX(0.04)", transition: "transform 420ms var(--ease-out-quiet)" }}
          />
        </span>
      </div>
    </div>
  );
}
