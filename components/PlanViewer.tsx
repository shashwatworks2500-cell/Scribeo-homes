"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { M, PAD, roomArea, roomDims, type Plan, type Room } from "@/lib/plans";

/**
 * Floor plan viewer.
 *
 * The drawing is an SVG on a fixed grid — 46px to the metre inside an 86px
 * margin — so the same numbers that drew each room place a hotspot over it.
 * Rendering the drawing as an <image> inside an <svg> of that same viewBox
 * means the overlay registers exactly rather than being nudged into place,
 * at any zoom, on any screen.
 *
 * Zoom and pan are one transform on one group: no layout is touched while
 * dragging, so it stays on the compositor. Pointer Events cover mouse, touch
 * and pen with one code path.
 */
type Props = { plan: Plan; label: string; fullscreen?: boolean; onClose?: () => void };

const MIN = 1;
const MAX = 3.2;

export default function PlanViewer({ plan, label, fullscreen = false, onClose }: Props) {
  const [k, setK] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [hover, setHover] = useState<Room | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; id: number } | null>(null);

  const reset = useCallback(() => {
    setK(1);
    setTx(0);
    setTy(0);
  }, []);

  // A new plan starts where the last one did, at rest.
  useEffect(() => reset(), [plan.id, reset]);

  /* Pan is clamped so the drawing can never be dragged out of its own frame:
     at 1x there is nothing to pan, and at 3x you can reach the edges and no
     further. Without this the plan gets lost and the only way back is reset. */
  const clamp = useCallback(
    (nx: number, ny: number, scale: number) => {
      const el = wrapRef.current;
      if (!el) return { x: 0, y: 0 };
      const { width, height } = el.getBoundingClientRect();
      const maxX = (Math.max(0, scale - 1) * width) / 2;
      const maxY = (Math.max(0, scale - 1) * height) / 2;
      return { x: Math.max(-maxX, Math.min(maxX, nx)), y: Math.max(-maxY, Math.min(maxY, ny)) };
    },
    [],
  );

  const zoomTo = useCallback(
    (next: number) => {
      const scale = Math.max(MIN, Math.min(MAX, next));
      setK(scale);
      const c = clamp(tx, ty, scale);
      setTx(c.x);
      setTy(c.y);
    },
    [clamp, tx, ty],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    if (k <= 1) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, tx, ty, id: e.pointerId };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const c = clamp(d.tx + (e.clientX - d.x), d.ty + (e.clientY - d.y), k);
    setTx(c.x);
    setTy(c.y);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (drag.current?.id === e.pointerId) drag.current = null;
  };

  // Escape leaves fullscreen; the plan keeps its own keys otherwise.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const l = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    l?.stop();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      l?.start();
    };
  }, [fullscreen, onClose]);

  const btn =
    "t-meta grid h-9 min-w-9 place-items-center rounded-full border border-rule px-3 text-ink-dim transition-colors duration-200 hover:border-travertine hover:text-ink disabled:opacity-35 disabled:hover:border-rule disabled:hover:text-ink-dim";

  return (
    <div className={fullscreen ? "flex h-full flex-col" : ""}>
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => zoomTo(k > 1 ? 1 : 2)}
        className={`relative w-full touch-none overflow-hidden border border-paper-hair bg-paper ${
          fullscreen ? "flex-1" : ""
        } ${k > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
        style={fullscreen ? undefined : { aspectRatio: "595 / 575" }}
      >
        <svg
          viewBox={`0 0 ${plan.vbW} ${plan.vbH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${label} floor plan, ${plan.rooms.length} rooms`}
          className="h-full w-full select-none"
          style={{
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${k})`,
            transition: drag.current ? "none" : "transform 520ms var(--ease-out-quiet)",
          }}
        >
          <image href={`/plans/plan-${plan.id}.svg`} x="0" y="0" width={plan.vbW} height={plan.vbH} />
          <g>
            {plan.rooms.map((r) => {
              const on = hover?.name === r.name;
              return (
                <rect
                  key={r.name}
                  x={PAD + r.x * M}
                  y={PAD + r.y * M}
                  width={r.w * M}
                  height={r.h * M}
                  fill={on ? "rgba(125,96,56,0.17)" : "transparent"}
                  stroke={on ? "#7d6038" : "transparent"}
                  strokeWidth={2.4}
                  className="transition-[fill,stroke] duration-200"
                  onPointerEnter={() => setHover(r)}
                  onPointerLeave={() => setHover((h) => (h?.name === r.name ? null : h))}
                  onFocus={() => setHover(r)}
                  onBlur={() => setHover(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${r.name}, ${roomDims(r)}, ${roomArea(r)}`}
                />
              );
            })}
          </g>
        </svg>

        {/* The read-out sits outside the transformed group so zoom never
            shrinks the text you are zooming in to read. */}
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-[clamp(0.6rem,1.6vw,1rem)]"
        >
          <span
            className={`t-meta rounded-full bg-paper/92 px-3 py-1.5 text-paper-ink transition-opacity duration-200 ${
              hover ? "opacity-100" : "opacity-0"
            }`}
          >
            {hover ? `${hover.name} · ${roomDims(hover)} · ${roomArea(hover)}` : "​"}
          </span>
          <span className="t-meta rounded-full bg-paper/92 px-3 py-1.5 text-paper-dim">
            {plan.w.toFixed(1)} × {plan.h.toFixed(1)} m
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => zoomTo(k - 0.5)} disabled={k <= MIN} className={btn} aria-label="Zoom out">
          −
        </button>
        <button type="button" onClick={() => zoomTo(k + 0.5)} disabled={k >= MAX} className={btn} aria-label="Zoom in">
          +
        </button>
        <button type="button" onClick={reset} disabled={k === 1 && tx === 0 && ty === 0} className={btn}>
          Reset
        </button>
        {onClose ? (
          <button type="button" onClick={onClose} className={`${btn} ml-auto`}>
            {fullscreen ? "Close" : "Fullscreen"}
          </button>
        ) : null}
        <span className="t-meta ml-auto hidden text-ink-faint sm:inline">
          {k > 1 ? "Drag to pan · double-click to reset" : "Hover a room · double-click to zoom"}
        </span>
      </div>
    </div>
  );
}
