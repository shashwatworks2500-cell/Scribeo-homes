"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Line-masked reveal for display type.
 *
 * Lines rise out from behind their own baseline, which reads as typesetting
 * rather than as a fade. Purpose: hierarchy — it tells you where a section
 * begins without any decoration.
 *
 * Progressive by construction: the text renders as ordinary, selectable,
 * fully legible markup, and is only re-wrapped into masked lines once the
 * fonts have settled. If anything here fails, the heading is still a heading.
 */
export default function SplitLines({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;
    const original = children;

    const build = () => {
      if (cancelled || !el) return;

      // 1. Lay the words out individually so their line positions can be read.
      el.textContent = "";
      const words = original.split(/\s+/).filter(Boolean);
      const spans = words.map((w, i) => {
        const s = document.createElement("span");
        s.textContent = i === words.length - 1 ? w : w + " ";
        s.style.display = "inline-block";
        s.style.whiteSpace = "pre";
        el.appendChild(s);
        return s;
      });

      // 2. Group words into visual lines by their vertical offset.
      const lines: string[][] = [];
      let lastTop: number | null = null;
      spans.forEach((s) => {
        const top = Math.round(s.offsetTop);
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          lines.push([]);
          lastTop = top;
        }
        lines[lines.length - 1].push(s.textContent ?? "");
      });

      if (lines.length === 0) {
        el.textContent = original;
        return;
      }

      // 3. Rebuild as masked lines.
      el.textContent = "";
      const inners: HTMLElement[] = [];
      lines.forEach((line) => {
        const mask = document.createElement("span");
        mask.style.display = "block";
        mask.style.overflow = "hidden";
        // Descenders would otherwise be clipped by the mask.
        mask.style.paddingBottom = "0.12em";
        mask.style.marginBottom = "-0.12em";
        const inner = document.createElement("span");
        inner.style.display = "block";
        inner.style.willChange = "transform";
        inner.textContent = line.join("");
        mask.appendChild(inner);
        el.appendChild(mask);
        inners.push(inner);
      });

      ctx = gsap.context(() => {
        gsap.set(inners, { yPercent: 115 });
        gsap.to(inners, {
          yPercent: 0,
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.085,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
          onComplete: () => inners.forEach((i) => (i.style.willChange = "auto")),
        });
      }, el);
    };

    gsap.registerPlugin(ScrollTrigger);
    // Measuring before webfonts land would group the wrong words per line.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(build).catch(build);
    else build();

    const onResize = () => {
      if (!ctx) return;
      ctx.revert();
      ctx = null;
      el.textContent = original;
      build();
    };
    let t = 0;
    const debounced = () => {
      window.clearTimeout(t);
      t = window.setTimeout(onResize, 220);
    };
    window.addEventListener("resize", debounced);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("resize", debounced);
      ctx?.revert();
      if (el) el.textContent = original;
    };
  }, [children]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
