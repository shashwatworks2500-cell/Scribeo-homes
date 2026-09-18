"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Line-masked reveal for display type.
 *
 * Lines rise out from behind their own baseline, which reads as typesetting
 * rather than as a fade. Purpose: hierarchy — it marks where a section begins
 * without any decoration.
 *
 * Words wrapped in asterisks are set in the display italic, e.g.
 * `Restraint, held in *stone*.` The word spans are *moved* into the line
 * masks rather than rebuilt from text, so that styling survives the split.
 *
 * Progressive by construction: the text renders as ordinary, selectable,
 * fully legible markup and is only re-wrapped once the fonts have settled.
 * If anything here fails, the heading is still a heading.
 */
type Part = { text: string; italic: boolean };
/** A word is one or more parts with no whitespace between them, so that
 *  punctuation stays welded to the italic it follows: `*stone*.` is a single
 *  word whose full stop is roman. Splitting on italics before words would
 *  set that stop adrift and print "stone ." */
type Word = Part[];

const parseWords = (src: string): Word[] => {
  const segments: Part[] = src
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((chunk) =>
      chunk.startsWith("*") && chunk.endsWith("*") && chunk.length > 2
        ? { text: chunk.slice(1, -1), italic: true }
        : { text: chunk, italic: false },
    );

  const words: Word[] = [];
  let current: Word = [];
  for (const seg of segments) {
    for (const piece of seg.text.split(/(\s+)/)) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        if (current.length) {
          words.push(current);
          current = [];
        }
      } else {
        current.push({ text: piece, italic: seg.italic });
      }
    }
  }
  if (current.length) words.push(current);
  return words;
};

export default function SplitLines({
  children,
  className = "",
}: {
  children: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const words = useMemo(() => parseWords(children), [children]);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    let ctx: gsap.Context | null = null;
    let cancelled = false;
    const initial = el.innerHTML;

    const build = () => {
      if (cancelled || !el) return;

      // 1. One inline-block span per word. A word may mix roman and italic
      //    parts, which is how `*stone*.` keeps its full stop.
      el.textContent = "";
      const wordSpans: HTMLElement[] = [];
      words.forEach((word) => {
        const w = document.createElement("span");
        w.style.display = "inline-block";
        word.forEach((part) => {
          const node = document.createElement(part.italic ? "em" : "span");
          node.textContent = part.text;
          w.appendChild(node);
        });
        el.appendChild(w);
        el.appendChild(document.createTextNode(" "));
        wordSpans.push(w);
      });
      if (!wordSpans.length) {
        el.innerHTML = initial;
        return;
      }

      // 2. Group by vertical offset into visual lines.
      const lines: HTMLElement[][] = [];
      let lastTop: number | null = null;
      wordSpans.forEach((w) => {
        const top = Math.round(w.offsetTop);
        if (lastTop === null || Math.abs(top - lastTop) > 2) {
          lines.push([]);
          lastTop = top;
        }
        lines[lines.length - 1].push(w);
      });

      // 3. Move the existing spans into masks — never re-create from text,
      //    which would discard the italic elements.
      el.textContent = "";
      const inners: HTMLElement[] = [];
      lines.forEach((line) => {
        const mask = document.createElement("span");
        mask.style.display = "block";
        mask.style.overflow = "hidden";
        // Descenders would otherwise be clipped by the mask.
        mask.style.paddingBottom = "0.14em";
        mask.style.marginBottom = "-0.14em";
        const inner = document.createElement("span");
        inner.style.display = "block";
        inner.style.willChange = "transform";
        line.forEach((w, i) => {
          inner.appendChild(w);
          if (i < line.length - 1) inner.appendChild(document.createTextNode(" "));
        });
        mask.appendChild(inner);
        el.appendChild(mask);
        inners.push(inner);
      });

      ctx = gsap.context(() => {
        gsap.set(inners, { yPercent: 116 });
        gsap.to(inners, {
          yPercent: 0,
          duration: 1.05,
          ease: "power3.out",
          stagger: 0.075,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onComplete: () => inners.forEach((i) => (i.style.willChange = "auto")),
        });
      }, el);
    };

    gsap.registerPlugin(ScrollTrigger);
    // Measuring before webfonts land groups the wrong words into lines.
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts;
    if (fonts?.ready) fonts.ready.then(build).catch(build);
    else build();

    let t = 0;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(() => {
        ctx?.revert();
        ctx = null;
        el.innerHTML = initial;
        build();
      }, 220);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
      ctx?.revert();
      if (el) el.innerHTML = initial;
    };
  }, [children, words]);

  return (
    <span ref={ref} className={className}>
      {words.map((word, i) => (
        <span key={i}>
          {word.map((part, j) =>
            part.italic ? <em key={j}>{part.text}</em> : <span key={j}>{part.text}</span>,
          )}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
