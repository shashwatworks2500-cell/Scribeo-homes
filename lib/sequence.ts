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

export type Tier = { dir: string; count: number };

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
    return `${this.tier.dir}/f${String(i + 1).padStart(3, "0")}.${ext}`;
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

    const base = this.nearest(i);
    if (!base) return;

    const cover = (c: NonNullable<Cell>) => {
      const s = Math.max(cw / c.w, ch / c.h);
      const dw = c.w * s;
      const dh = c.h * s;
      ctx.drawImage(c.img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    ctx.globalAlpha = 1;
    cover(base);

    // Only blend against a genuinely adjacent, already-decoded frame —
    // blending a distant substitute would read as a cross-dissolve, not motion.
    if (t > 0.012 && i + 1 < this.tier.count) {
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
