"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO, frameUrl } from "@/lib/assets";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Scroll-driven hero.
 *
 * The supplied hero film is 10-bit HEVC at 22.6 Mbps with three keyframes in
 * 289 frames: it does not decode in Chrome or Firefox, and seeking it by
 * `currentTime` would stall on every scroll tick. So the film is decomposed
 * into a still sequence and composited on a canvas. That removes the codec
 * problem entirely and makes scrubbing deterministic — forwards, backwards,
 * and at any speed.
 *
 * The hold is CSS `position: sticky`, not a GSAP pin. ScrollTrigger only reads
 * progress. No pin-spacer, no layout reflow on refresh, no fight with Lenis.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);

  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      setReady(true);
      return;
    }

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    /* Tier by viewport, not user-agent: a small window on a desktop should
       not pay for 1536px frames. 73 frames / 2 MB on mobile, 145 / 7.5 MB up. */
    const tier = window.matchMedia("(min-width: 768px)").matches ? HERO.desktop : HERO.mobile;
    const frames: (HTMLImageElement | null)[] = new Array(tier.count).fill(null);

    let disposed = false;
    let current = -1;
    let loadedCount = 0;

    /** Nearest loaded frame to `i` — so scrubbing never blocks on a pending load. */
    const nearest = (i: number) => {
      if (frames[i]) return frames[i];
      for (let r = 1; r < tier.count; r++) {
        if (frames[i - r]) return frames[i - r];
        if (frames[i + r]) return frames[i + r];
      }
      return null;
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    const draw = (i: number) => {
      const img = nearest(i);
      if (!img) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    };

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        if (disposed || frames[i]) return resolve();
        const img = new Image();
        img.decoding = "async";
        img.src = frameUrl(tier.dir, i);
        img.onload = () => {
          if (disposed) return resolve();
          frames[i] = img;
          loadedCount++;
          // First frame, or filling a gap the playhead is sitting on.
          if (current < 0 || nearest(current) === img) draw(current < 0 ? 0 : current);
          resolve();
        };
        img.onerror = () => resolve();
      });

    /* Three-pass load. Frame 0 makes the hero look finished immediately; the
       stride pass makes it scrubbable within a second; the fill pass makes it
       smooth. The playhead always renders the nearest frame it has. */
    const boot = async () => {
      sizeCanvas();
      await load(0);
      if (disposed) return;
      setReady(true);

      const stride = 8;
      const sparse: number[] = [];
      for (let i = stride; i < tier.count; i += stride) sparse.push(i);
      await pool(sparse, 6);
      if (disposed) return;

      const rest: number[] = [];
      for (let i = 1; i < tier.count; i++) if (!frames[i]) rest.push(i);
      await pool(rest, 6);
    };

    /** Bounded-concurrency queue: never open 145 sockets at once. */
    const pool = async (list: number[], limit: number) => {
      let cursor = 0;
      const workers = Array.from({ length: Math.min(limit, list.length) }, async () => {
        while (cursor < list.length && !disposed) await load(list[cursor++]);
      });
      await Promise.all(workers);
    };

    void boot();

    const setOpacity = (el: HTMLElement | null, v: number) => {
      if (el) el.style.opacity = String(Math.max(0, Math.min(1, v)));
    };

    /* Typography tracks the film's own narrative: the opening line holds
       through HIDDEN → REVEAL, clears the frame while the architecture is on
       screen, and the closing line lands on the held final composition. */
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const i = Math.min(tier.count - 1, Math.round(p * (tier.count - 1)));
        if (i !== current) {
          current = i;
          draw(i);
        }
        setOpacity(headlineRef.current, p < 0.5 ? 1 : 1 - (p - 0.5) / 0.18);
        setOpacity(cueRef.current, 1 - p / 0.12);
        setOpacity(closingRef.current, (p - 0.84) / 0.1);
        if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      },
    });

    const onResize = () => {
      sizeCanvas();
      draw(Math.max(current, 0));
    };
    window.addEventListener("resize", onResize);
    // Orientation change reports stale dimensions for a frame on iOS.
    window.addEventListener("orientationchange", () => setTimeout(onResize, 120));

    return () => {
      disposed = true;
      trigger.kill();
      window.removeEventListener("resize", onResize);
      frames.forEach((f) => f && (f.onload = null));
      void loadedCount;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-heading"
      className="relative"
      style={{ height: reduced ? "100svh" : "var(--hero-runway)" }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-ink film-grain">
        {reduced ? (
          /* Reduced motion: the held final composition, as a still. No scrub,
             no sequence download, no movement. */
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={HERO.poster}
            alt="Scribeo Homes at first light: low limestone and timber residences among mature trees, seen across ornamental grasses."
            className="h-full w-full object-cover"
            width={1920}
            height={1080}
          />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              className="h-full w-full"
              aria-hidden="true"
              style={{ opacity: ready ? 1 : 0, transition: "opacity 900ms var(--ease-out-quiet)" }}
            />
            {/* Poster underneath: the hero is never an empty black box. */}
            <div
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-ink bg-cover bg-center"
              style={{ backgroundImage: `url(${HERO.poster})`, filter: "brightness(0.55)" }}
            />
          </>
        )}

        {/* Legibility scrim. Two stops, bottom-weighted — the frames are
            already dark at the edges, so this stays very light. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,10,8,0.55) 0%, rgba(11,10,8,0.08) 38%, rgba(11,10,8,0.20) 72%, rgba(11,10,8,0.78) 100%)",
          }}
        />

        <div className="absolute inset-0 gutter flex flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)]">
          {/* No wordmark here: the fixed navigation already carries it, and
              two "Scribeo Homes" stacked in the same corner reads as a bug. */}
          <div ref={headlineRef}>
            <h1 id="hero-heading" className="t-display-xl max-w-[6.3em] text-stone">
              A place that reveals itself slowly.
            </h1>
          </div>

          <div
            ref={closingRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[clamp(2.5rem,7vh,5rem)] gutter"
            style={{ opacity: 0 }}
          >
            <p className="t-display-m max-w-[20ch] text-stone">Stone, light, and the time between.</p>
          </div>

          <div
            ref={cueRef}
            className="mt-[clamp(2rem,5vh,3.5rem)] flex items-end justify-between gap-6 border-t hair pt-4"
          >
            <p className="t-meta max-w-[24ch] text-stone-dim">
              Contemporary residences set in mature landscape
            </p>
            <div className="flex items-center gap-3">
              <span className="t-meta whitespace-nowrap text-stone-dim">
                Scroll<span className="hidden sm:inline"> to enter</span>
              </span>
              <span aria-hidden="true" className="relative block h-px w-16 bg-hair">
                <span
                  ref={barRef}
                  className="absolute inset-0 block origin-left bg-travertine"
                  style={{ transform: "scaleX(0)" }}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
