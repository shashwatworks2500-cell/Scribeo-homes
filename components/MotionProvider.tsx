"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { DUR, RISE, STAGGER, prefersReducedMotion } from "@/lib/motion";
import { ORDER, onFrame } from "@/lib/frame";

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

    /* Scroll restoration is off (see BOOT in app/layout), so the page owns
       where it lands. That is true whether or not motion is reduced, so the
       destination handling is set up before anything else and falls back to
       an instant native scroll when there is no Lenis to ask. */
    const jump = (hash: string, smooth: boolean) => {
      const el = hash && hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      if (lenis) lenis.scrollTo(el ?? 0, { offset: 0, immediate: !smooth, force: true });
      else if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      else window.scrollTo(0, 0);
    };
    /* Back and forward move between the sections the reader visited, rather
       than leaving the site. Nav pushes the entry; this consumes it. */
    const onPop = () => jump(location.hash, !reduced);
    window.addEventListener("popstate", onPop);
    /* An explicit #hash is honoured once the page has settled enough for the
       destination to be where it will finally be — not before. */
    const settle = window.setTimeout(() => {
      if (location.hash) jump(location.hash, false);
    }, 260);

    // Reduced motion: no smooth scroll, no reveals. Mark ready so the
    // failsafe in layout.tsx does not strip the (already visible) content.
    if (reduced) {
      root.dataset.motion = "ready";
      return () => {
        window.removeEventListener("popstate", onPop);
        window.clearTimeout(settle);
      };
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

    /* Lenis goes first in the frame; everything that reads scroll is ordered
       after it (see lib/frame.ts). lagSmoothing off so returning to a
       backgrounded tab does not produce one enormous catch-up step. */
    const stopFrame = onFrame((time) => lenis.raf(time * 1000), ORDER.scroll);
    gsap.ticker.lagSmoothing(0);

    /* A phone's address bar sliding away fires a resize. Rebuilding every
       trigger for that throws the reader down the page for no reason, so
       ScrollTrigger is told to ignore a height-only change on touch. */
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* Deliberately NOT re-anchoring the reader to their content on resize.
       Measured: a 1440x900 -> 1200x820 resize part-way down leaves scrollY
       exactly where it was and nothing jumps; what changes is that narrower
       text is taller, so the content above the reader grows. That is what
       every browser does and what readers expect. An anchor that moved the
       page to keep the same paragraph under the eye could not reliably win
       against the scroll position ScrollTrigger and Lenis each set while
       finishing a refresh, and a half-working one introduces exactly the
       jump this page must never have. */

    // Expose for in-page anchors without a global singleton elsewhere.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const ctx = gsap.context(() => {
      /* Opacity + small rise. Batched so 30 elements cost a handful of
         triggers rather than 30 independent ones. */
      /* 94%, not 88%. A flick that lands with an element's top at 89% of the
         viewport left it sitting in plain sight at zero opacity until the next
         scroll — measurable, and reproducible on the distance index. Nothing
         inside the viewport is allowed to be blank at rest, so the trigger
         fires as the element clears the lower edge rather than well after. */
      ScrollTrigger.batch("[data-reveal]", {
        start: "top 94%",
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
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
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

    /* Refresh again once the webfonts land. Every start and end above was
       measured against fallback metrics; the text reflows when Cormorant and
       Jost arrive, and each of those numbers is then wrong by the difference.
       This is why a trigger could fire in the wrong place on a cold load. */
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    /* And once the hero has painted, because its runway is the tallest
       measurement on the page. */
    const onHeroReady = () => ScrollTrigger.refresh();
    window.addEventListener("hero:ready", onHeroReady, { once: true });

    return () => {
      ctx.revert();
      lenis.off("scroll", onScroll);
      window.removeEventListener("hero:ready", onHeroReady);
      window.removeEventListener("popstate", onPop);
      window.clearTimeout(settle);
      stopFrame();
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
