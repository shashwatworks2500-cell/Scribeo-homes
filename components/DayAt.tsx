"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DAY } from "@/lib/story";
import { prefersReducedMotion } from "@/lib/motion";
import SplitLines from "./SplitLines";

/**
 * A day at Scribeo Homes.
 *
 * Everything else on the page sells the building. This sells the hour. Five
 * moments, each one a time, a line and a frame — the only section here that
 * makes no claim about specification at all, which is exactly why it is the
 * one that has to carry feeling.
 *
 * Desktop pins the frame and scrolls the hours against it. Phone gets the
 * same five moments stacked, each with its own frame, because a pinned
 * sequence on a short screen is a section where nothing happens.
 */
export default function DayAt() {
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
      gsap.utils.toArray<HTMLElement>("[data-hour]").forEach((el, i) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 60%",
          onToggle: (self) => self.isActive && setActive(i),
        });
      });
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        pin: "[data-day-stage]",
        pinSpacing: false,
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="day" aria-labelledby="day-heading" className="section-y bg-ground-2">
      <div className="gutter">
        <p data-reveal className="t-eyebrow text-travertine">
          08 — A day here
        </p>
        <h2 id="day-heading" className="t-display-m mt-6 max-w-[20ch] text-ink">
          <SplitLines>The hours are the *specification*.</SplitLines>
        </h2>
      </div>

      <div className="gutter mt-[clamp(2.5rem,6vh,4rem)] md:grid md:grid-cols-12 md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="md:col-span-5">
          {DAY.map((d, i) => (
            <article
              key={d.time}
              data-hour
              className="border-t hair py-[clamp(1.75rem,5vh,3.5rem)] first:border-t-0 first:pt-0 md:min-h-[74vh] md:py-0 md:flex md:flex-col md:justify-center"
            >
              <div className="relative mb-6 aspect-[4/3] w-full overflow-hidden bg-ground md:hidden">
                <Image src={d.asset.src} alt={d.asset.alt} fill sizes="100vw" quality={80} className="object-cover" />
              </div>
              <div className="flex items-baseline gap-5">
                <span
                  className={`t-display-s tabular-nums transition-colors duration-500 ${
                    i === active ? "text-travertine" : "text-ink-faint"
                  }`}
                >
                  {d.time}
                </span>
                <span className="t-eyebrow text-ink-faint">{d.label}</span>
              </div>
              <p className="t-lede mt-4 measure text-ink">{d.line}</p>
            </article>
          ))}
        </div>

        <div data-day-stage className="hidden md:col-span-6 md:col-start-7 md:block pin-stage pin-stage--short">
          <div className="pin-plate relative aspect-[3/4] w-full overflow-hidden bg-ground">
            {DAY.map((d, i) => (
              <Image
                key={d.time}
                src={d.asset.src}
                alt={d.asset.alt}
                fill
                sizes="50vw"
                quality={84}
                className="object-cover transition-opacity duration-[1100ms] ease-[var(--ease-out-quiet)]"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
            {/* The hour, held over the frame, so the pairing is never in doubt. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-[clamp(1rem,2.5vw,1.75rem)]"
              style={{ background: "linear-gradient(to top, rgba(22,20,15,0.42) 0%, rgba(22,20,15,0) 42%)" }}
            >
              <span className="t-meta text-ground/85">{DAY[active].label}</span>
              <span className="t-meta tabular-nums text-ground/85">{DAY[active].time}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
