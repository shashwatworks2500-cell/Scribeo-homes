"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import { ORDER, onFrame } from "@/lib/frame";

/**
 * A cursor that says what a thing will do.
 *
 * Desktop and fine pointers only, and off entirely under reduced motion: on a
 * touch screen there is no cursor to replace, and a lagging dot behind a
 * finger is the definition of a gimmick. The native cursor is never hidden —
 * this rides alongside it, so nothing is lost if the script fails.
 */
const LABELS: { sel: string; label: string }[] = [
  { sel: "[data-cursor='view']", label: "View" },
  { sel: "[data-cursor='explore']", label: "Explore" },
  { sel: "[data-cursor='open']", label: "Open" },
  { sel: "[data-cursor='drag']", label: "Drag" },
];

export default function Cursor() {
  const [on, setOn] = useState(false);
  const [label, setLabel] = useState("");
  const dot = useRef<HTMLDivElement | null>(null);
  const pos = useRef({ x: -100, y: -100 });
  const shown = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
    if (!mq.matches) return;
    setOn(true);

    const move = (e: PointerEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      const t = e.target as Element | null;
      const hit = t ? LABELS.find((l) => t.closest(l.sel)) : undefined;
      setLabel(hit ? hit.label : "");
    };
    window.addEventListener("pointermove", move, { passive: true });

    /* Park it off screen before the first pointer move. The loop below does
       nothing until there is a delta to work through, so without this the
       dot renders at its CSS origin — the top-left corner of the page. */
    const park = () => {
      if (dot.current) {
        dot.current.style.transform =
          `translate3d(${shown.current.x}px, ${shown.current.y}px, 0) translate(-50%, -50%)`;
      }
    };
    park();

    /* On the page's single loop, last: nothing reads the cursor's position.
       It also stops doing arithmetic once the dot has caught up, so a still
       pointer costs nothing. */
    const tick = () => {
      const dx = pos.current.x - shown.current.x;
      const dy = pos.current.y - shown.current.y;
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) return;
      // Trails the pointer rather than tracking it exactly: the lag is the
      // whole effect, and it keeps the element off the input thread.
      shown.current.x += dx * 0.22;
      shown.current.y += dy * 0.22;
      if (dot.current) {
        dot.current.style.transform = `translate3d(${shown.current.x}px, ${shown.current.y}px, 0) translate(-50%, -50%)`;
      }
    };
    const stopFrame = onFrame(tick, ORDER.pointer);

    return () => {
      window.removeEventListener("pointermove", move);
      stopFrame();
      setOn(false);
    };
  }, []);

  if (!on) return null;

  return (
    <div
      ref={dot}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[99] grid place-items-center rounded-full border border-ink/25 bg-ground/70 backdrop-blur-[2px] transition-[width,height,background-color,border-color] duration-300 ease-[var(--ease-out-quiet)]"
      style={{ width: label ? 76 : 14, height: label ? 76 : 14 }}
    >
      <span
        className="t-numeral select-none text-ink transition-opacity duration-200"
        style={{ opacity: label ? 1 : 0 }}
      >
        {label}
      </span>
    </div>
  );
}
