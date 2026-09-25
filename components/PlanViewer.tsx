"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Icon from "./Icon";
import { M, PAD, roomArea, roomDims, type Plan, type Room } from "@/lib/plans";

/**
 * Floor plan viewer.
 *
 * The drawing is an SVG on a fixed grid — 46px to the metre inside an 86px
 * margin — so the same numbers that drew each room place a hotspot over it,
 * registered exactly at any zoom.
 *
 * The sheet has two parts: the canvas, and a strip along its foot that
 * carries the read-out on the left and − + Reset on the right. The controls
 * float on the paper at the bottom right, but the canvas ends above them, so
 * they never cover any part of the drawing, zoomed or not.
 *
 * Scrolling: at rest the canvas lets vertical swipes through to the page
 * (touch-action: pan-y). Zoomed, a drag pans the drawing instead, and the
 * strip says how to get the page back: Reset. Nothing ever captures the
 * mouse wheel, so a desktop reader scrolling past can never be caught.
 */
type Props = { plan: Plan; label: string };

const MIN = 1;
const MAX = 3;
const STEP = 0.5;

export default function PlanViewer({ plan, label }: Props) {
  const [k, setK] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [room, setRoom] = useState<Room | null>(null);
  const [dragging, setDragging] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; y: number; tx: number; ty: number; id: number; moved: boolean } | null>(null);

  const reset = useCallback(() => {
    setK(1);
    setTx(0);
    setTy(0);
  }, []);

  useEffect(() => {
    reset();
    setRoom(null);
  }, [plan.id, reset]);

  /* Pan is clamped so the drawing can never be dragged out of its own frame. */
  const clamp = useCallback((nx: number, ny: number, scale: number) => {
    const el = wrapRef.current;
    if (!el) return { x: 0, y: 0 };
    const { width, height } = el.getBoundingClientRect();
    const maxX = (Math.max(0, scale - 1) * width) / 2;
    const maxY = (Math.max(0, scale - 1) * height) / 2;
    return { x: Math.max(-maxX, Math.min(maxX, nx)), y: Math.max(-maxY, Math.min(maxY, ny)) };
  }, []);

  const zoomTo = useCallback(
    (next: number) => {
      const scale = Math.max(MIN, Math.min(MAX, next));
      const c = clamp(tx, ty, scale);
      setK(scale);
      setTx(c.x);
      setTy(c.y);
    },
    [clamp, tx, ty],
  );

  /* A drag only starts once the pointer has travelled a few pixels, so a tap
     on a room still selects it while the plan is zoomed. */
  const onPointerDown = (e: React.PointerEvent) => {
    if (k <= 1) return;
    drag.current = { x: e.clientX, y: e.clientY, tx, ty, id: e.pointerId, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved) {
      if (Math.hypot(dx, dy) < 4) return;
      d.moved = true;
      wrapRef.current?.setPointerCapture?.(e.pointerId);
      setDragging(true);
    }
    const c = clamp(d.tx + dx, d.ty + dy, k);
    setTx(c.x);
    setTy(c.y);
  };
  const endDrag = (e: React.PointerEvent) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
  };

  const zoomed = k > 1;
  const readout = room ? `${room.name} · ${roomDims(room)} · ${roomArea(room)}` : `${plan.w.toFixed(1)} × ${plan.h.toFixed(1)} m overall`;

  return (
    <div className="border border-paper-hair bg-paper">
      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => zoomTo(zoomed ? 1 : 2)}
        style={{ touchAction: zoomed ? "none" : "pan-y" }}
        className={`relative aspect-[6/5] w-full overflow-hidden ${zoomed ? (dragging ? "cursor-grabbing" : "cursor-grab") : ""}`}
      >
        <svg
          viewBox={`0 0 ${plan.vbW} ${plan.vbH}`}
          preserveAspectRatio="xMidYMid meet"
          role="img"
          aria-label={`${label} floor plan, ${plan.rooms.length} rooms`}
          className="h-full w-full select-none"
          style={{
            transform: `translate3d(${tx}px, ${ty}px, 0) scale(${k})`,
            transition: dragging ? "none" : "transform 480ms var(--ease-out-quiet)",
          }}
        >
          <image href={`/plans/plan-${plan.id}.svg`} x="0" y="0" width={plan.vbW} height={plan.vbH} />
          <g>
            {plan.rooms.map((r) => {
              const on = room?.name === r.name;
              return (
                <rect
                  key={r.name}
                  x={PAD + r.x * M}
                  y={PAD + r.y * M}
                  width={r.w * M}
                  height={r.h * M}
                  fill={on ? "rgba(79,90,63,0.16)" : "transparent"}
                  stroke={on ? "#4f5a3f" : "transparent"}
                  strokeWidth={2.4}
                  className="cursor-pointer outline-none transition-[fill,stroke] duration-200"
                  onPointerEnter={(e) => e.pointerType === "mouse" && setRoom(r)}
                  onPointerLeave={(e) => e.pointerType === "mouse" && setRoom((h) => (h?.name === r.name ? null : h))}
                  onClick={() => setRoom((h) => (h?.name === r.name ? null : r))}
                  onFocus={() => setRoom(r)}
                  onBlur={() => setRoom(null)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${r.name}, ${roomDims(r)}, ${roomArea(r)}`}
                />
              );
            })}
          </g>
        </svg>
      </div>

      <div className="flex flex-col gap-3 px-[clamp(0.75rem,2vw,1.25rem)] pb-[clamp(0.75rem,2vw,1.25rem)] pt-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
        <div className="min-w-0 flex-1">
          <p aria-live="polite" className="t-meta text-paper-ink">
            {readout}
          </p>
          <p className="t-meta text-paper-dim">
            <span className="hidden md:inline">
              {zoomed ? "Drag to pan · Reset returns to the full plan" : "Point at a room for its size · double-click to zoom"}
            </span>
            <span className="md:hidden">
              {zoomed ? "Drag to move the plan · Reset to scroll the page" : "Tap a room for its size"}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => zoomTo(k - STEP)}
            disabled={k <= MIN}
            aria-label="Zoom out"
            className="btn btn-secondary btn-square"
          >
            <Icon name="minus" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => zoomTo(k + STEP)}
            disabled={k >= MAX}
            aria-label="Zoom in"
            className="btn btn-secondary btn-square"
          >
            <Icon name="plus" className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={reset}
            disabled={!zoomed && tx === 0 && ty === 0}
            aria-label="Reset zoom"
            className="btn btn-secondary"
          >
            <Icon name="reset" className="h-4 w-4" />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
