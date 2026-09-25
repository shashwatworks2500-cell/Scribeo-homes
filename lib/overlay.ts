/**
 * Overlays and the Back button.
 *
 * Search, the gallery at full size and the phone menu each own the screen
 * while they are open. Opening one pushes a single history entry for the
 * same URL; Back pops that entry and closes the overlay, so it never takes
 * the reader off the page from under something they are looking at.
 *
 * Closing from the interface — Close, Escape, a result's action — steps
 * history back as well. Replacing the entry instead would leave a dead one
 * behind: the next Back would appear to do nothing. closeOverlay() resolves
 * once that traversal has landed, so anything that navigates afterwards
 * (a scroll to the floor plans, a hash push) runs after history is settled
 * rather than racing it.
 */

type Entry = { id: string; close: () => void };

const stack: Entry[] = [];
let consumed: Event | null = null;
let pending: Promise<void> | null = null;
let waiters: (() => void)[] = [];

const settle = () => {
  const w = waiters;
  waiters = [];
  w.forEach((f) => f());
};

function onPop(e: PopStateEvent) {
  const top = stack.pop();
  if (!top) return;
  consumed = e;
  top.close();
  settle();
}

if (typeof window !== "undefined") {
  window.addEventListener("popstate", onPop);
  /* A reload while an overlay entry is current restores that entry with no
     overlay open. Clear the marker so it is an ordinary entry again. */
  try {
    if (history.state?.overlay) {
      const { overlay: _drop, ...rest } = history.state as Record<string, unknown>;
      void _drop;
      history.replaceState(rest, "");
    }
  } catch {}
}

export const isOverlayOpen = () => stack.length > 0;

/**
 * True when a popstate belongs to the overlay system — it closed an overlay,
 * an overlay is still open, or it arrived on an overlay's entry by Forward.
 * Section navigation ignores those.
 */
export const overlayOwns = (e: PopStateEvent) =>
  stack.length > 0 || consumed === e || Boolean((e.state as { overlay?: string } | null)?.overlay);

export function openOverlay(id: string, close: () => void) {
  if (stack.some((s) => s.id === id)) return;
  stack.push({ id, close });
  try {
    history.pushState({ ...((history.state as object | null) ?? {}), overlay: id }, "");
  } catch {}
}

export function closeOverlay(id: string): Promise<void> {
  if (pending) return pending;
  const i = stack.findIndex((s) => s.id === id);
  if (i < 0) return Promise.resolve();

  pending = new Promise<void>((resolve) => {
    /* Should the traversal never arrive — a sandboxed frame, a browser that
       refuses it — close directly rather than leave the overlay stuck. */
    const t = window.setTimeout(() => {
      const k = stack.findIndex((s) => s.id === id);
      if (k >= 0) stack.splice(k, 1)[0].close();
      settle();
    }, 700);
    waiters.push(() => window.clearTimeout(t), resolve);
    history.back();
  }).finally(() => {
    pending = null;
  });
  return pending;
}
