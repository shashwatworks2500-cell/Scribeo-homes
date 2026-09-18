"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { A } from "@/lib/assets";
import SplitLines from "./SplitLines";

/**
 * Property highlights as an editorial index rather than a card grid.
 *
 * Desktop: the list holds the left column; a sticky plate on the right changes
 * as each entry takes the reading position. Mobile: the list and its images
 * interleave, because a sticky panel on a phone steals the whole screen.
 */
const ITEMS = [
  {
    n: "01",
    title: "Threshold",
    body: "Arrival is a room of its own — a timber-lined opening cut deep into limestone, with the glass set well back from the weather.",
    asset: A.entranceThreshold,
  },
  {
    n: "02",
    title: "Between",
    body: "Sliding panels draw back until the stone floor runs uninterrupted into the garden. The boundary is a decision, not a wall.",
    asset: A.indoorOutdoor,
  },
  {
    n: "03",
    title: "Living",
    body: "A sheltered terrace under a deep soffit: shade when the sun is high, full light when it is low, and planting close enough to hear.",
    asset: A.livingRoom,
  },
  {
    n: "04",
    title: "Repose",
    body: "The bedroom opens on a pivot. One tree fills the aperture, and the first light of the day lands on the floor before the bed.",
    asset: A.bedroom,
  },
  {
    n: "05",
    title: "Preparation",
    body: "A travertine volume with a glazed corner — timber cabinetry within, the canopy of a mature tree immediately outside it.",
    asset: A.kitchen,
  },
  {
    n: "06",
    title: "Bathing",
    body: "Solid stone, worked thick: a monolithic basin and bench beside frameless glass, with planting brought right to the threshold.",
    asset: A.bathroom,
  },
] as const;

export default function Residence() {
  const [active, setActive] = useState(0);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const nodes = itemRefs.current.filter(Boolean) as HTMLLIElement[];
    if (!nodes.length) return;

    // Whichever entry is nearest the reading line owns the sticky plate.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const i = nodes.indexOf(e.target as HTMLLIElement);
            if (i >= 0) setActive(i);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section id="residence" aria-labelledby="res-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-x-[clamp(1.5rem,4vw,4rem)]">
        <div className="col-span-12 md:col-span-5">
          <p data-reveal className="t-eyebrow text-travertine/80">
            03 — The residence
          </p>
          <h2 id="res-heading" className="t-display-m mt-6 max-w-[16ch] text-stone">
            <SplitLines>Six rooms, and the light in each.</SplitLines>
          </h2>

          <ol className="mt-[clamp(2.5rem,6vh,4rem)] border-t hair">
            {ITEMS.map((item, i) => (
              <li
                key={item.n}
                ref={(el) => {
                  itemRefs.current[i] = el;
                }}
                className="border-b hair py-[clamp(1.5rem,3.5vh,2.5rem)]"
                aria-current={active === i ? "true" : undefined}
              >
                <div data-reveal className="flex gap-5">
                  <span
                    className="t-numeral pt-1 transition-colors duration-500"
                    style={{ color: active === i ? "var(--color-travertine)" : "var(--color-stone-faint)" }}
                  >
                    {item.n}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="t-display-s transition-colors duration-500"
                      style={{ color: active === i ? "var(--color-stone)" : "var(--color-stone-dim)" }}
                    >
                      {item.title}
                    </h3>
                    <p className="mt-3 measure-wide text-stone-faint">{item.body}</p>
                    {/* Mobile: the plate belongs to its entry. */}
                    <div className="mt-6 md:hidden">
                      <Image
                        src={item.asset.src}
                        alt={item.asset.alt}
                        width={item.asset.w}
                        height={item.asset.h}
                        sizes="100vw"
                        quality={80}
                        className="w-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Desktop sticky plate. aria-hidden: every image is already described
            in the mobile render above, so screen readers are not told twice. */}
        <div className="col-span-6 col-start-7 hidden md:block" aria-hidden="true">
          <div className="sticky top-[18vh]">
            <div className="relative overflow-hidden bg-ink-2" style={{ aspectRatio: "4/5" }}>
              {ITEMS.map((item, i) => (
                <Image
                  key={item.n}
                  src={item.asset.src}
                  alt=""
                  fill
                  sizes="50vw"
                  quality={82}
                  className="object-cover transition-opacity duration-[900ms]"
                  style={{
                    opacity: active === i ? 1 : 0,
                    transitionTimingFunction: "var(--ease-in-out-quiet)",
                  }}
                />
              ))}
            </div>
            <p className="t-meta mt-4 flex justify-between text-stone-faint">
              <span>{ITEMS[active].title}</span>
              <span>
                {ITEMS[active].n} / {String(ITEMS.length).padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
