"use client";

import { revealInRow } from "@/lib/reveal-tab";
import { useRef } from "react";

/**
 * Configuration tabs — "01 / 1 BHK". Selected: charcoal type and a bottom
 * line; the rest muted. On a phone the row scrolls sideways at the screen
 * edge instead of wrapping or widening the page. Arrow keys, Home and End
 * move between tabs, per the WAI-ARIA tabs pattern.
 */
export default function Tabs({
  items,
  active,
  onChange,
  label,
  idPrefix,
  panelId,
}: {
  items: { id: string; label: string }[];
  active: number;
  onChange: (i: number) => void;
  label: string;
  idPrefix: string;
  panelId: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const pick = (i: number, focus: boolean) => {
    onChange(i);
    const el = refs.current[i];
    if (focus) el?.focus({ preventScroll: true });
    revealInRow(el);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (active === last ? 0 : active + 1)
      : e.key === "ArrowLeft" ? (active === 0 ? last : active - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    pick(next, true);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
      className="no-scrollbar -mx-[var(--gutter)] flex gap-[clamp(1.75rem,4vw,3.5rem)] overflow-x-auto border-b hair px-[var(--gutter)] md:mx-0 md:px-0"
    >
      {items.map((x, i) => {
        const on = i === active;
        return (
          <button
            key={x.id}
            id={`${idPrefix}-tab-${x.id}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="tab"
            aria-selected={on}
            aria-controls={panelId}
            tabIndex={on ? 0 : -1}
            onClick={() => pick(i, false)}
            className={`relative flex min-h-12 shrink-0 items-center gap-2 whitespace-nowrap transition-colors duration-300 ${
              on ? "text-ink" : "text-ink-dim hover:text-ink"
            }`}
          >
            <span aria-hidden="true" className="t-numeral">
              {String(i + 1).padStart(2, "0")} /
            </span>
            <span className="t-item">{x.label}</span>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 -bottom-px h-0.5 origin-left bg-ink transition-transform duration-500 ease-[var(--ease-out-quiet)]"
              style={{ transform: `scaleX(${on ? 1 : 0})` }}
            />
          </button>
        );
      })}
    </div>
  );
}
