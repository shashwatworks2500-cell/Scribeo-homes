"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { A } from "@/lib/assets";
import { AMENITIES } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/motion";
import SplitLines from "./SplitLines";

/** One plate per group, so the list and the picture are never out of step. */
const PLATE = [A.amClubhouse, A.amFitness, A.amGreen, A.amPlay];

/**
 * Amenities as four experiences rather than twenty-six bullet points.
 *
 * The provisions are all still on the page at once — nothing is hidden behind
 * a carousel, because people scan this section rather than read it — but the
 * plate follows the group you are reading, so leisure looks like leisure and
 * landscape looks like landscape instead of one clubhouse standing in for all
 * four.
 */
export default function Amenities() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const section = sectionRef.current;
    if (!section) return;
    const mq = window.matchMedia("(min-width: 768px) and (min-height: 620px)");
    if (!mq.matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-amenity-group]").forEach((el, i) => {
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
        pin: "[data-amenity-stage]",
        pinSpacing: false,
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const total = AMENITIES.reduce((n, g) => n + g.items.length, 0);

  return (
    <section ref={sectionRef} id="amenities" aria-labelledby="amen-heading" className="section-y">
      <div className="gutter">
        <p data-reveal className="t-eyebrow text-travertine">
          08 — Amenities
        </p>
        <h2 id="amen-heading" className="t-display-m mt-6 max-w-[18ch] text-ink">
          <SplitLines>Shared ground, *properly made*.</SplitLines>
        </h2>
        <p data-reveal className="mt-6 measure text-ink-dim">
          {total} provisions across leisure, wellness, landscape and the everyday — built in the
          same materials as the residences rather than bolted on afterwards.
        </p>
      </div>

      <div className="gutter mt-[clamp(2.5rem,6vh,4rem)] md:grid md:grid-cols-12 md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div data-amenity-stage className="hidden md:col-span-6 md:block pin-stage pin-stage--short">
          <div className="pin-plate relative aspect-[4/5] w-full overflow-hidden bg-ground-2">
            {PLATE.map((p, i) => (
              <Image
                key={p.src}
                src={p.src}
                alt={p.alt}
                fill
                sizes="50vw"
                quality={84}
                priority={i === 0}
                className="object-cover transition-opacity duration-[900ms] ease-[var(--ease-out-quiet)]"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 p-[clamp(1rem,2.5vw,1.75rem)]"
              style={{ background: "linear-gradient(to top, rgba(22,20,15,0.4) 0%, rgba(22,20,15,0) 46%)" }}
            >
              <span className="t-meta text-ground/85">{AMENITIES[active].group}</span>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 md:col-start-8">
          {AMENITIES.map((group, i) => (
            <div
              key={group.group}
              data-amenity-group
              className="border-t hair py-[clamp(1.75rem,5vh,3rem)] first:border-t-0 first:pt-0 md:min-h-[74vh] md:py-0 md:flex md:flex-col md:justify-center"
            >
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden bg-ground-2 md:hidden">
                <Image src={PLATE[i].src} alt={PLATE[i].alt} fill sizes="100vw" quality={80} className="object-cover" />
              </div>
              <div className="flex items-baseline justify-between gap-4 border-b hair pb-4">
                <h3 className={`t-display-s transition-colors duration-500 ${i === active ? "text-travertine" : "text-ink"}`}>
                  {group.group}
                </h3>
                <span className="t-meta text-ink-faint">{group.items.length}</span>
              </div>
              <ul className="mt-5 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-ink-dim">
                    <span aria-hidden="true" className="mt-[0.62em] h-px w-3 shrink-0 bg-travertine/70" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
