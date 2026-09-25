"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { DUR, RISE, STAGGER, prefersReducedMotion } from "@/lib/motion";
import { ORDER, onFrame } from "@/lib/frame";
import { overlayOwns } from "@/lib/overlay";
import { goTo } from "@/lib/nav";

/**
 * Owns the page's scroll, navigation and reveal systems.
 *
 * One provider, one ticker, one ScrollTrigger registration, one teardown.
 * Section components never create their own smooth-scroll or reveal
 * triggers — that is how Lenis and ScrollTrigger end up fighting.
 */
export default function MotionProvider() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = prefersReducedMotion();

    /* Scroll restoration is off (BOOT in app/layout), so the page owns where
       it lands, with or without motion. */
    const jump = (hash: string, smooth: boolean) => {
      const el = hash && hash.length > 1 ? document.querySelector<HTMLElement>(hash) : null;
      const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
      const y = el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : 0;
      if (lenis) lenis.scrollTo(y, { immediate: !smooth, force: true });
      else if (el) el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      else window.scrollTo(0, 0);
    };
    /* Back and Forward move between the sections the reader visited. A
       popstate that belongs to an overlay — it closed Search, the gallery or
       the menu — is not a section change and must not move the page. */
    const onPop = (e: PopStateEvent) => {
      if (overlayOwns(e)) return;
      jump(location.hash, !reduced);
    };
    window.addEventListener("popstate", onPop);

    /* Every plain in-page link goes through goTo(): one smooth scroll, one
       history entry. Links that handle themselves call preventDefault first. */
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const href = a.getAttribute("href") ?? "";
      if (href.length < 2 || !document.querySelector(href)) return;
      e.preventDefault();
      goTo(href);
    };
    document.addEventListener("click", onClick);

    const settle = window.setTimeout(() => {
      if (location.hash) jump(location.hash, false);
    }, 260);

    if (reduced) {
      root.dataset.motion = "ready";
      return () => {
        window.removeEventListener("popstate", onPop);
        document.removeEventListener("click", onClick);
        window.clearTimeout(settle);
      };
    }

    gsap.registerPlugin(ScrollTrigger);

    /* Lenis drives scroll position; ScrollTrigger reads it. Touch keeps
       native momentum (syncTouch off). A tight lerp reads as native
       scrolling with the edge taken off, not as gliding. */
    const lenis = new Lenis({
      lerp: 0.2,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      syncTouch: false,
      autoRaf: false,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);
    const stopFrame = onFrame((time) => lenis.raf(time * 1000), ORDER.scroll);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.config({ ignoreMobileResize: true });
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      /* Reveals: opacity and a short rise, batched so related elements
         arrive together rather than each on its own schedule. */
      gsap.set("[data-reveal]", { y: RISE });
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
          }),
      });

      /* Clip reveals: an image plate wipes up from its lower edge. */
      gsap.utils.toArray<HTMLElement>("[data-reveal-clip]").forEach((el) => {
        gsap.to(el, {
          clipPath: "inset(0 0 0% 0)",
          duration: DUR.plate,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });

      /* Leaving the hero: its foot warms into the next section's stone, so
         the page continues out of the photograph instead of cutting. One
         opacity, cheap enough to keep on a phone. */
      const fade = document.querySelector<HTMLElement>("[data-hero-fade]");
      if (fade) {
        gsap.fromTo(
          fade,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: fade.parentElement, start: "top top", end: "bottom 40%", scrub: true },
          },
        );
      }
    });

    /* Parallax only on large desktop imagery, capped, never on text or
       controls. Phones and tablets get none. */
    mm.add("(min-width: 1024px)", () => {
      const media = document.querySelector<HTMLElement>("[data-hero-media]");
      if (media) {
        gsap.fromTo(
          media,
          { yPercent: 0 },
          {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: media.parentElement, start: "top top", end: "bottom top", scrub: true },
          },
        );
      }
      gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
        const amount = Number(el.dataset.parallax || 5);
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
    /* Every trigger was measured against fallback font metrics; measure
       again once the webfonts have landed and the text has reflowed. */
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      mm.revert();
      ctx.revert();
      lenis.off("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
      window.clearTimeout(settle);
      stopFrame();
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
      delete root.dataset.motion;
    };
  }, []);

  return null;
}
