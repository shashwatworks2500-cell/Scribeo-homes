/**
 * Motion tokens for Scribeo Homes.
 *
 * Budget:
 *  - Entrances: opacity, a short rise, or a clip wipe — grouped, never one
 *    trigger per element.
 *  - Scroll-linked: the hero's foot warming into the next section, and
 *    capped parallax on large desktop imagery only. Nothing on text or
 *    controls, nothing on phones.
 *  - State changes 300–500ms (residence swap, amenity crossfade, accordion).
 *  - Everything is legible and complete with all motion removed.
 */

export const DUR = {
  /** Micro-feedback: hover, focus, press. */
  micro: 0.18,
  /** State change on a single element. */
  state: 0.42,
  /** Content entrance — long enough to read as intentional, not slow. */
  entrance: 0.9,
  /** Large image or full-bleed reveal. */
  plate: 1.15,
} as const;

export const EASE = {
  /** Decelerating, no overshoot — the house curve. */
  quiet: "cubic-bezier(0.16, 1, 0.3, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

/** Stagger between siblings in one group. Never more than three. */
export const STAGGER = 0.085;

/** Distance a revealing element travels, in px. Small: motion is a hint. */
export const RISE = 18;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
