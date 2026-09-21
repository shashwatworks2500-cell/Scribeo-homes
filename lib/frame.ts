import gsap from "gsap";

/**
 * The page's single animation loop.
 *
 * There were three: gsap's ticker driving Lenis, one inside the hero painting
 * the film, and one inside the cursor. Three loops means three arbitrary
 * positions in the frame, so the hero could paint before the scroll position
 * it was painting for had been updated — the film trailing the scroll by a
 * frame, worst exactly when the reader moves fastest.
 *
 * One loop, explicitly ordered. Scroll is resolved first, everything that
 * reads scroll runs after it, in the same frame.
 */

export const ORDER = {
  /** Lenis advances the scroll position and ScrollTrigger reads it. */
  scroll: 0,
  /** Anything whose output is a function of scroll. */
  scrubbed: 20,
  /** Pointer-driven decoration, which nothing else depends on. */
  pointer: 40,
} as const;

type Cb = (time: number) => void;
const subs: { fn: Cb; order: number }[] = [];
let running = false;

const tick = (time: number) => {
  // Indexed, not for-of: a callback may unsubscribe itself mid-frame.
  for (let i = 0; i < subs.length; i++) subs[i].fn(time);
};

/** Subscribe to the frame. Returns the unsubscribe. */
export function onFrame(fn: Cb, order: number = ORDER.scrubbed) {
  subs.push({ fn, order });
  subs.sort((a, b) => a.order - b.order);
  if (!running) {
    gsap.ticker.add(tick);
    running = true;
  }
  return () => {
    const i = subs.findIndex((s) => s.fn === fn);
    if (i >= 0) subs.splice(i, 1);
    if (subs.length === 0 && running) {
      gsap.ticker.remove(tick);
      running = false;
    }
  };
}
