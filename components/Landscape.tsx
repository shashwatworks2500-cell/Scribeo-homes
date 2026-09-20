"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LANDSCAPE } from "@/lib/story";
import { prefersReducedMotion } from "@/lib/motion";
import SplitLines from "./SplitLines";

/**
 * The landscape chapter.
 *
 * The project's one real claim is that it sits inside mature planting rather
 * than beside it, so this is the section that has to be felt rather than read.
 * A single plate holds the frame while the page scrolls past it, growing from
 * a column to the full measure, and the statement sits in the space it leaves.
 * One pinned move, one scrub — the restraint is the point.
 */
export default function Landscape() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const plateRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    const plate = plateRef.current;
    const inner = innerRef.current;
    if (!section || !plate || !inner) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // The plate widens as the section passes. Width, not scale: scaling an
      // image this large softens it, and the crop is the composition.
      gsap.fromTo(
        plate,
        { clipPath: "inset(0% 22% 0% 22%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          scrollTrigger: { trigger: section, start: "top 70%", end: "top 5%", scrub: 0.6 },
        },
      );
      // A slow push inside the frame, capped so no edge is ever exposed.
      gsap.fromTo(
        inner,
        { scale: 1.12 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.8 },
        },
      );
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="landscape" aria-labelledby="land-heading" className="section-y overflow-hidden">
      <div className="gutter">
        <p data-reveal className="t-eyebrow text-travertine">
          02 — The landscape
        </p>
        <h2 id="land-heading" className="t-display-l mt-6 max-w-[17ch] text-ink">
          <SplitLines>{LANDSCAPE.lead}</SplitLines>
        </h2>
      </div>

      <div
        ref={plateRef}
        className="relative mt-[clamp(2.5rem,6vh,4.5rem)] aspect-[16/10] w-full overflow-hidden bg-ground-2 md:aspect-[21/9]"
      >
        <div ref={innerRef} className="absolute inset-0 will-change-transform">
          <Image
            src={LANDSCAPE.plates[0].asset.src}
            alt={LANDSCAPE.plates[0].asset.alt}
            fill
            sizes="100vw"
            quality={84}
            className="object-cover"
          />
        </div>
      </div>

      <div className="gutter mt-[clamp(2rem,5vh,3.5rem)]">
        <div className="grid grid-cols-12 gap-y-[clamp(1.5rem,4vh,2.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
          <p className="col-span-12 md:col-span-4">
            <span className="t-meta text-ink-faint">{LANDSCAPE.plates[0].caption}</span>
          </p>
          <p data-reveal className="col-span-12 measure-wide text-ink-dim md:col-span-7 md:col-start-6">
            {LANDSCAPE.body}
          </p>
        </div>

        {/* Three supporting plates, unequal on purpose: a row of identical
            thumbnails would read as a gallery, and this is still one page. */}
        <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-12 gap-[clamp(0.75rem,2vw,1.5rem)]">
          {LANDSCAPE.plates.slice(1).map((p, i) => (
            <figure
              key={p.asset.src}
              data-reveal
              className={
                i === 0
                  ? "col-span-12 sm:col-span-7"
                  : i === 1
                    ? "col-span-6 sm:col-span-5 sm:mt-[clamp(2rem,6vh,4rem)]"
                    : "col-span-6 sm:col-span-5 sm:col-start-3"
              }
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-ground-2">
                <Image
                  src={p.asset.src}
                  alt={p.asset.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 40vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
              <figcaption className="t-meta mt-3 text-ink-faint">{p.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
