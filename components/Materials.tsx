"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MATERIALS } from "@/lib/story";
import { prefersReducedMotion } from "@/lib/motion";
import SplitLines from "./SplitLines";

/**
 * Architectural philosophy, told as four materials.
 *
 * The specification was true and unreadable — a definition list of four rows
 * that nobody finishes. The same four facts are now a chapter each: the plate
 * is pinned and the text scrolls against it, so the material is on screen the
 * whole time you are being told what it does.
 *
 * With reduced motion or no JavaScript this degrades to four stacked
 * chapters, each with its own plate, which is the same content in the same
 * order — nothing is only available to the animation.
 */
export default function Materials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;
    // Pinning only earns its place where there is height to pin against.
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 620px)");
    if (!mq.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const steps = gsap.utils.toArray<HTMLElement>("[data-material-step]");
      steps.forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 62%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: "[data-material-stage]",
        pinSpacing: false,
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="architecture" aria-labelledby="arch-heading" className="section-y">
      <div className="gutter">
        <p data-reveal className="t-eyebrow text-travertine">
          03 — Architecture
        </p>
        <h2 id="arch-heading" className="t-display-m mt-6 max-w-[18ch] text-ink">
          <SplitLines>Four materials. *Nothing else.*</SplitLines>
        </h2>
      </div>

      <div className="gutter mt-[clamp(2.5rem,6vh,4rem)] md:grid md:grid-cols-12 md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        {/* Stage: one plate, cross-faded. Pinned on desktop, inline otherwise. */}
        <div
          data-material-stage
          className="hidden md:col-span-6 md:block pin-stage"
        >
          <div className="pin-plate relative aspect-[4/5] w-full overflow-hidden bg-ground-2">
            {MATERIALS.map((m, i) => (
              <Image
                key={m.id}
                src={m.asset.src}
                alt={m.asset.alt}
                fill
                sizes="50vw"
                quality={84}
                priority={i === 0}
                className="object-cover transition-opacity duration-[900ms] ease-[var(--ease-out-quiet)]"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          {MATERIALS.map((m, i) => (
            <article
              key={m.id}
              data-material-step
              className="border-t hair py-[clamp(2rem,6vh,4.5rem)] first:border-t-0 first:pt-0 md:min-h-[78vh] md:py-0 md:flex md:flex-col md:justify-center"
            >
              {/* On a phone each chapter carries its own plate: there is no
                  pinned stage to look at, so the material has to be here. */}
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden bg-ground-2 md:hidden">
                <Image src={m.asset.src} alt={m.asset.alt} fill sizes="100vw" quality={80} className="object-cover" />
              </div>
              <p className="t-eyebrow text-travertine">{m.label}</p>
              <h3 className="t-display-s mt-5 max-w-[16ch] text-ink">{m.title}</h3>
              <p className="mt-5 measure text-ink-dim">{m.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
