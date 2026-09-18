"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { A } from "@/lib/assets";
import { prefersReducedMotion } from "@/lib/motion";

const PLATES = [
  { asset: A.arrivalRoad, label: "The approach", note: "A single road, curving" },
  { asset: A.pathway, label: "The walk", note: "Stone, laid loose in grass" },
  { asset: A.garden, label: "The garden", note: "Mature before we arrived" },
  { asset: A.courtyard, label: "The courtyard", note: "Held between two houses" },
  { asset: A.exteriorWide, label: "The clearing", note: "One house, many trees" },
  { asset: A.pavilion, label: "The pavilion", note: "One room, no walls that matter" },
  { asset: A.benchSeating, label: "The pause", note: "Where the shade falls at seven" },
] as const;

/**
 * One continuous visual sequence through the landscape.
 *
 * Desktop: the section holds while the plate track is scrubbed sideways, so a
 * vertical gesture reads as lateral travel — scroll distance maps 1:1 to
 * pixels of track, which is what makes it feel physical rather than animated.
 *
 * Touch: the same plates as a native snap carousel. A horizontal scrub driven
 * by vertical scroll is a fight on a phone, so it is not shipped there.
 */
export default function Landscape() {
  const sectionRef = useRef<HTMLElement | null>(null);
  /* The sticky plate holder's containing block. The height MUST land here and
     not on <section>: a `hidden md:block` wrapper in between collapses to the
     sticky child's own height, giving it zero travel — it unsticks instantly
     and leaves the rest of the section as an empty black screen. */
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const headingRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const mq = window.matchMedia("(min-width: 768px)");
    if (!mq.matches) return;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return;

    gsap.registerPlugin(ScrollTrigger);
    let distance = 0;

    const measure = () => {
      distance = Math.max(0, track.scrollWidth - window.innerWidth);
      // Scroll runway = one viewport of hold plus exactly the overflow.
      stage.style.height = `calc(100svh + ${distance}px)`;
      return distance;
    };
    measure();

    const ctx = gsap.context(() => {
      gsap.to(track, {
        x: () => -distance,
        ease: "none",
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
          onRefresh: measure,
          // Heading drifts against the plates: same journey, different rate.
          onUpdate: (self) => {
            if (headingRef.current) {
              headingRef.current.style.transform = `translate3d(${self.progress * -5}vw,0,0)`;
              headingRef.current.style.opacity = String(Math.max(0, 1 - self.progress * 2.2));
            }
          },
        },
      });
    }, section);

    const onResize = () => {
      measure();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", onResize);
      stage.style.height = "";
    };
  }, []);

  return (
    <section id="landscape" ref={sectionRef} aria-labelledby="land-heading" className="relative">
      {/* Desktop: sticky hold + scrubbed track */}
      <div ref={stageRef} className="hidden md:block">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
          <div ref={headingRef} className="gutter pointer-events-none absolute top-[14vh] z-10">
            <p className="t-eyebrow text-travertine/80">04 — Landscape</p>
            <h2 id="land-heading" className="t-display-m mt-5 max-w-[20ch] text-stone">
              The ground was here first.
            </h2>
          </div>

          <div ref={trackRef} className="flex items-center gap-[clamp(1.5rem,3vw,3rem)] pl-[clamp(1.25rem,5vw,6.5rem)] pr-[20vw] will-change-transform">
            {PLATES.map((p, i) => (
              <figure key={p.label} className="relative shrink-0" style={{ width: i % 2 === 0 ? "46vw" : "34vw" }}>
                <div
                  className="relative overflow-hidden bg-ink-2"
                  style={{ aspectRatio: i % 2 === 0 ? "16/10" : "4/5" }}
                >
                  <Image
                    src={p.asset.src}
                    alt={p.asset.alt}
                    fill
                    sizes="46vw"
                    quality={80}
                    loading="eager"
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 flex items-baseline justify-between gap-4">
                  <span className="t-meta text-stone">{p.label}</span>
                  <span className="t-meta text-stone-faint">{p.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>

      {/* Touch: native horizontal snap. */}
      <div className="md:hidden">
        <div className="gutter section-y pb-8">
          <p data-reveal className="t-eyebrow text-travertine/80">
            04 — Landscape
          </p>
          <h2 data-reveal className="t-display-m mt-5 max-w-[18ch] text-stone">
            The ground was here first.
          </h2>
        </div>
        <ul
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-[clamp(3rem,8vh,5rem)] pl-5 pr-5"
          style={{ scrollbarWidth: "none" }}
        >
          {PLATES.map((p) => (
            <li key={p.label} className="w-[82vw] shrink-0 snap-center">
              <div className="relative overflow-hidden bg-ink-2" style={{ aspectRatio: "4/5" }}>
                <Image
                  src={p.asset.src}
                  alt={p.asset.alt}
                  fill
                  sizes="82vw"
                  quality={78}
                  className="object-cover"
                />
              </div>
              <p className="t-meta mt-3 text-stone">{p.label}</p>
              <p className="t-meta text-stone-faint">{p.note}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
