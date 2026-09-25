"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Swap what a panel shows with an exit and an entrance instead of a cut.
 *
 * When `value` changes, the panel keeps showing the old value while it
 * plays `.swap-out` (140ms), then shows the new value with `.swap-in`
 * (300ms) — 440ms end to end, inside the specified 300–500ms. A second
 * change mid-swap simply restarts the exit, so rapid clicking never shows a
 * stale panel. Under reduced motion the swap is immediate.
 */
export function useSwap<T>(value: T, outMs = 140) {
  const [shown, setShown] = useState(value);
  const [phase, setPhase] = useState<"idle" | "out" | "in">("idle");
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      setPhase("idle");
      return;
    }
    setPhase("out");
    const t = window.setTimeout(() => {
      setShown(value);
      setPhase("in");
    }, outMs);
    return () => window.clearTimeout(t);
  }, [value, outMs]);

  const className = phase === "out" ? "swap-out" : phase === "in" ? "swap-in" : "";
  return { shown, phase, className } as const;
}
