"use client";

import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { HERO } from "@/lib/assets";
import { FrameSequence, supportsAvif } from "@/lib/sequence";
import { prefersReducedMotion } from "@/lib/motion";

/** Broadcast so the entry curtain can lift on real readiness, not a timer. */
const signalReady = () => window.dispatchEvent(new CustomEvent("hero:ready"));
const signalProgress = (v: number) =>
  window.dispatchEvent(new CustomEvent("hero:progress", { detail: v }));

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headlineRef = useRef<HTMLDivElement | null>(null);
  const cueRef = useRef<HTMLDivElement | null>(null);
  const closingRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLSpanElement | null>(null);

  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setReduced(true);
      signalProgress(1);
      signalReady();
      return;
    }

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let seq: FrameSequence | null = null;
    let disposed = false;
    let progress = 0;
    let raf = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
    };

    /* Paint on rAF rather than inside the scroll callback: scroll events can
       outpace the compositor, and painting twice in one frame is wasted work. */
    let dirty = true;
    const tick = () => {
      if (disposed) return;
      if (dirty && seq) {
        seq.draw(ctx, progress);
        dirty = false;
      }
      raf = requestAnimationFrame(tick);
    };

    const boot = async () => {
      const useAvif = await supportsAvif();
      if (disposed) return;
      const wide = window.matchMedia("(min-width: 768px)").matches;
      const set = useAvif ? HERO.avif : HERO.webp;
      seq = new FrameSequence(wide ? set.desktop : set.mobile);

      sizeCanvas();
      raf = requestAnimationFrame(tick);

      // Pass 1 — first frame. The hero stops being a placeholder.
      await seq.load(0);
      if (disposed) return;
      dirty = true;
      canvas.style.opacity = "1";
      signalProgress(0.45);
      // The hero is already showing real footage and will paint the nearest
      // frame it holds for any scroll position, so there is nothing left to
      // wait for. The curtain enforces its own minimum so this cannot flash.
      signalReady();

      // Pass 2 — a coarse spread, so the whole shot is scrubbable early.
      const stride = 6;
      const sparse: number[] = [];
      for (let i = stride; i < seq.count; i += stride) sparse.push(i);
      await seq.pool(sparse, 8, () => {
        dirty = true;
        signalProgress(0.25 + 0.55 * (seq ? seq.progress : 0));
      });
      if (disposed) return;
      signalProgress(0.9);

      // Pass 3 — fill everything, for blend-quality smoothness.
      const rest: number[] = [];
      for (let i = 1; i < seq.count; i++) rest.push(i);
      await seq.pool(rest, 8, () => {
        dirty = true;
      });
      signalProgress(1);
    };

    void boot();

    const setOpacity = (el: HTMLElement | null, v: number) => {
      if (el) el.style.opacity = String(Math.max(0, Math.min(1, v)));
    };

    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        progress = self.progress;
        dirty = true;
        // Type tracks the film: the opening line holds through the reveal,
        // clears while the architecture is on screen, and the closing line
        // lands on the final held composition.
        setOpacity(headlineRef.current, self.progress < 0.5 ? 1 : 1 - (self.progress - 0.5) / 0.18);
        setOpacity(cueRef.current, 1 - self.progress / 0.12);
        setOpacity(closingRef.current, (self.progress - 0.84) / 0.1);
        if (barRef.current) barRef.current.style.transform = `scaleX(${self.progress})`;
      },
    });

    const onResize = () => {
      sizeCanvas();
      dirty = true;
    };
    window.addEventListener("resize", onResize);
    const onOrient = () => setTimeout(onResize, 120);
    window.addEventListener("orientationchange", onOrient);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      trigger.kill();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrient);
      seq?.dispose();
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
        {/* Portrait viewports get a band rather than a full-bleed cover — see
            .hero-stage in globals.css for why. The scrims live inside it so
            they grade the film and nothing else: on portrait the navigation
            and the headline already sit on ink and need no help. */}
        <div className="hero-stage overflow-hidden">
          {reduced ? (
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
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ink bg-cover bg-center"
                style={{ backgroundImage: `url(${HERO.poster})`, filter: "brightness(0.5)" }}
              />
              <canvas
                ref={canvasRef}
                className="relative block h-full w-full"
                aria-hidden="true"
                style={{ opacity: 0, transition: "opacity 700ms var(--ease-out-quiet)" }}
              />
            </>
          )}

          {/* Two scrims, not one. The vertical pass seats the navigation and
              the metadata row; the horizontal pass gives the headline a ground
              to sit on, because midway through the sequence the frame fills
              with pale render and light-on-light stops being readable. An
              automated contrast check cannot see this — it measures CSS
              colours, not the canvas underneath. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(11,10,8,0.58) 0%, rgba(11,10,8,0.06) 34%, rgba(11,10,8,0.20) 68%, rgba(11,10,8,0.84) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg, rgba(11,10,8,0.62) 0%, rgba(11,10,8,0.34) 26%, rgba(11,10,8,0.06) 52%, rgba(11,10,8,0) 68%)",
            }}
          />
        </div>

        <div className="absolute inset-0 gutter flex flex-col justify-end pb-[clamp(2.5rem,7vh,5rem)]">
          <div ref={headlineRef}>
            <h1 id="hero-heading" className="t-display-xl max-w-[6.3em] text-stone">
              A place that reveals <em>itself</em> slowly.
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
