"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { DUR, RISE, STAGGER, prefersReducedMotion } from "@/lib/motion";

/**
 * Owns the page's scroll and reveal systems.
 *
 * One provider, one ticker, one ScrollTrigger registration, one teardown.
 * Section components never create their own smooth-scroll or reveal triggers —
 * that is how Lenis and ScrollTrigger end up fighting each other.
 */
export default function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();

    // Reduced motion: no smooth scroll, no reveals. Mark ready so the
    // failsafe in layout.tsx does not strip the (already visible) content.
    if (reduced) {
      root.dataset.motion = "ready";
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Lenis drives scroll position; ScrollTrigger reads it. `syncTouch` stays
       off so touch devices keep native momentum — the brief requires real
       touch scrolling, and synthesised touch always feels wrong. */
    /* lerp, not duration. Duration-based smoothing re-animates to a moving
       target on every wheel tick, which reads as lag; a lerp tracks the real
       scroll position and settles. 0.2 is deliberately tight: it reads as
       native scrolling with the edge taken off, not as gliding on ice.
       wheelMultiplier stays at 1 — anything less makes the page feel like it
       is resisting the input. */
    const lenis = new Lenis({
      lerp: 0.2,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
      autoRaf: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Expose for in-page anchors without a global singleton elsewhere.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const ctx = gsap.context(() => {
      /* Opacity + small rise. Batched so 30 elements cost a handful of
         triggers rather than 30 independent ones. */
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 88%",
        once: true,
        batchMax: 3,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: DUR.entrance,
            ease: "power3.out",
            stagger: STAGGER,
            overwrite: true,
            onComplete: () => batch.forEach((el) => ((el as HTMLElement).style.willChange = "auto")),
          }),
      });

      gsap.set("[data-reveal]", { y: RISE });

      /* Clip reveals: image plates wipe up from their lower edge. One per
         section, never batched with text, so the eye has a single subject. */
      gsap.utils.toArray<HTMLElement>("[data-reveal-clip]").forEach((el) => {
        gsap.to(el, {
          clipPath: "inset(0 0 0% 0)",
          duration: DUR.plate,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onComplete: () => {
            el.style.willChange = "auto";
          },
        });
      });

      /* Parallax, capped. `yPercent` on a deliberately over-tall child so no
         edge can ever be exposed, and it stays on the compositor. */
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 6);
        gsap.fromTo(
          el,
          { yPercent: -amount },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement ?? el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });

    root.dataset.motion = "ready";
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      lenis.off("scroll", onScroll);
      gsap.ticker.remove(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
