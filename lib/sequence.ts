/**
 * Frame-sequence engine for the scroll hero.
 *
 * Three things make this feel like film rather than a slideshow:
 *
 * 1. FRAMES ARE SAMPLED BY VISUAL DISTANCE, NOT BY TIME. The source film's
 *    camera is not linear — measured peak-to-trough velocity across the shot
 *    was 9.2x, with 67 of 289 frames nearly static. Sampling at equal
 *    cumulative visual distance (done at build time) collapses that to 1.95x,
 *    so equal scrolling produces equal visual change.
 *
 * 2. SUB-FRAME BLENDING. Progress maps to a fractional index; the engine draws
 *    frame n, then n+1 at the fractional alpha on top. Motion is continuous
 *    instead of snapping between discrete frames — this is what removes the
 *    last of the stepping that sampling alone cannot.
 *
 * 3. AVIF WITH A WEBP FALLBACK. AVIF q50 measured 46% smaller than WebP q72 at
 *    visibly higher fidelity, which buys frame density at lower total weight.
 *    Browsers without AVIF get the WebP set rather than a broken hero.
 */

/**
 * `count` frames beginning at `from` (a 1-based file number, default 1).
 * The offset exists because the film's opening is groundworks — the plot
 * before anything is built — and a property page should open on architecture.
 * The unused frames stay on disk so the start point is one number to move.
 */
export type Tier = { dir: string; count: number; from?: number };

type Cell = { img: CanvasImageSource; w: number; h: number } | null;

/** One-shot AVIF capability probe, cached. */
let avifPromise: Promise<boolean> | null = null;
export function supportsAvif(): Promise<boolean> {
  if (!avifPromise) {
    avifPromise = new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.width > 0);
      img.onerror = () => resolve(false);
      // Smallest valid AVIF payload.
      img.src =
        "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAEAAAABAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIABoAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEDQgMgkQAAAAB8dSLfI=";
    });
  }
  return avifPromise;
}

export class FrameSequence {
  private cells: Cell[];
  private tier: Tier;
  private disposed = false;
  private loaded = 0;
  /** In flight, so parallel workers never fetch the same frame twice. */
  private pending = new Set<number>();

  constructor(tier: Tier) {
    this.tier = tier;
    this.cells = new Array(tier.count).fill(null);
  }

  get count() {
    return this.tier.count;
  }
  get progress() {
    return this.loaded / this.tier.count;
  }

  private url(i: number) {
    const ext = this.tier.dir.includes("/avif/") ? "avif" : "webp";
    const n = (this.tier.from ?? 1) + i;
    return `${this.tier.dir}/f${String(n).padStart(3, "0")}.${ext}`;
  }

  /** Nearest already-decoded frame, so scrubbing never waits on the network. */
  private nearest(i: number): Cell {
    if (this.cells[i]) return this.cells[i];
    for (let r = 1; r < this.tier.count; r++) {
      if (this.cells[i - r]) return this.cells[i - r];
      if (this.cells[i + r]) return this.cells[i + r];
    }
    return null;
  }

  async load(i: number): Promise<void> {
    if (this.disposed || this.cells[i]) return;
    try {
      const res = await fetch(this.url(i));
      if (!res.ok || this.disposed) return;
      const blob = await res.blob();
      if (this.disposed) return;
      // createImageBitmap decodes off the main thread — the scrub keeps its
      // frame budget while the rest of the sequence streams in behind it.
      if (typeof createImageBitmap === "function") {
        const bmp = await createImageBitmap(blob);
        if (this.disposed) return bmp.close();
        this.cells[i] = { img: bmp, w: bmp.width, h: bmp.height };
      } else {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        await new Promise<void>((done) => {
          img.onload = () => done();
          img.onerror = () => done();
          img.src = url;
        });
        if (this.disposed) return;
        this.cells[i] = { img, w: img.naturalWidth, h: img.naturalHeight };
      }
      this.loaded++;
    } catch {
      /* a single missing frame is survivable: nearest() covers the gap */
    }
  }

  /** Bounded-concurrency queue — never opens 169 sockets at once. */
  async pool(list: number[], limit: number, onTick?: () => void) {
    let cursor = 0;
    await Promise.all(
      Array.from({ length: Math.min(limit, list.length) }, async () => {
        while (cursor < list.length && !this.disposed) {
          await this.load(list[cursor++]);
          onTick?.();
        }
      }),
    );
  }

  /**
   * Load everything still missing, nearest to where the reader is looking
   * first.
   *
   * Filling in index order meant the frames on screen were the last to
   * arrive: on a cold load only a quarter of the sequence existed, so the
   * scrub spent its first minute showing substitutes. This keeps the working
   * set around the playhead, so the frame you are looking at is the next one
   * fetched.
   */
  async fill(focus: () => number, limit: number, onTick?: () => void) {
    const nextMissing = () => {
      const f = Math.round(Math.max(0, Math.min(1, focus())) * (this.tier.count - 1));
      let best = -1;
      let bestD = Infinity;
      for (let i = 0; i < this.tier.count; i++) {
        if (this.cells[i] || this.pending.has(i)) continue;
        const d = Math.abs(i - f);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      }
      return best;
    };

    await Promise.all(
      Array.from({ length: limit }, async () => {
        for (;;) {
          if (this.disposed) return;
          const i = nextMissing();
          if (i < 0) return;
          this.pending.add(i);
          await this.load(i);
          this.pending.delete(i);
          onTick?.();
        }
      }),
    );
  }

  /**
   * Paint at a fractional position in [0,1].
   * Draws the base frame, then blends the next one at the fractional alpha.
   */
  draw(ctx: CanvasRenderingContext2D, p: number) {
    const cw = ctx.canvas.width;
    const ch = ctx.canvas.height;
    if (!cw || !ch) return;

    const f = Math.max(0, Math.min(1, p)) * (this.tier.count - 1);
    const i = Math.floor(f);
    const t = f - i;

    /* The exact frame if it is decoded, otherwise the closest one that is.
       Which of those two it is matters below: `nearest` can be a long way
       from `i`, and blending it against frame i+1 composites two unrelated
       moments of the film into one picture. On a cold load, with most of the
       sequence still in flight, that is most of the time — which is why the
       hero showed two developments ghosted over each other. */
    const exact = this.cells[i];
    const base = exact ?? this.nearest(i);
    if (!base) return;

    const cover = (c: NonNullable<Cell>) => {
      const s = Math.max(cw / c.w, ch / c.h);
      const dw = c.w * s;
      const dh = c.h * s;
      ctx.drawImage(c.img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    ctx.globalAlpha = 1;
    cover(base);

    // Blend only when BOTH sides are the real thing: the exact base frame and
    // its true successor. A substitute base gets drawn alone — a frame that is
    // slightly behind reads as motion; two frames averaged reads as a fault.
    if (exact && t > 0.012 && i + 1 < this.tier.count) {
      const next = this.cells[i + 1];
      if (next) {
        ctx.globalAlpha = t;
        cover(next);
        ctx.globalAlpha = 1;
      }
    }
  }

  dispose() {
    this.disposed = true;
    for (const c of this.cells) {
      if (c && "close" in c.img && typeof (c.img as ImageBitmap).close === "function") {
        (c.img as ImageBitmap).close();
      }
    }
    this.cells = [];
  }
}
