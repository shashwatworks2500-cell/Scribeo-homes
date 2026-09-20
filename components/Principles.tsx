"use client";

import { useState } from "react";
import Image from "next/image";
import { PRINCIPLES } from "@/lib/story";
import SplitLines from "./SplitLines";

/**
 * Why this one.
 *
 * Six principles, each of which is a promise the rest of the page has to keep
 * — so each row links to the section that keeps it. Hovering brings up the
 * evidence; the row is a real link either way.
 */
export default function Principles() {
  const [active, setActive] = useState(0);

  return (
    <section id="why" aria-labelledby="why-heading" className="section-y gutter">
      <p data-reveal className="t-eyebrow text-travertine">
        03 — Why here
      </p>
      <h2 id="why-heading" className="t-display-m mt-6 max-w-[18ch] text-ink">
        <SplitLines>Six decisions, made *once*.</SplitLines>
      </h2>

      <div className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-12 gap-y-[clamp(2rem,5vh,3rem)] lg:gap-x-[clamp(2rem,5vw,4rem)]">
        <ol className="col-span-12 border-t hair lg:col-span-7">
          {PRINCIPLES.map((pr, i) => {
            const on = i === active;
            return (
              <li key={pr.n} data-reveal className="border-b hair">
                <a
                  href={pr.href}
                  data-cursor="view"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group relative grid grid-cols-12 items-baseline gap-x-4 gap-y-1 py-[clamp(1rem,2.6vh,1.6rem)]"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-travertine transition-transform duration-500 ease-[var(--ease-out-quiet)]"
                    style={{ transform: `scaleX(${on ? 1 : 0})` }}
                  />
                  <span className="t-numeral col-span-2 text-ink-faint sm:col-span-1">{pr.n}</span>
                  <span className="col-span-10 sm:col-span-5">
                    <span className={`t-display-s block transition-colors duration-300 ${on ? "text-travertine" : "text-ink"}`}>
                      {pr.title}
                    </span>
                  </span>
                  <span className="col-span-12 sm:col-span-6">
                    <span className="t-meta block text-ink-dim">{pr.line}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ol>

        <div className="col-span-12 lg:col-span-5">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-ground-2 lg:sticky lg:top-[clamp(5rem,12vh,7rem)] lg:aspect-[3/4]">
            {PRINCIPLES.map((pr, i) => (
              <Image
                key={pr.n}
                src={pr.asset.src}
                alt={pr.asset.alt}
                fill
                sizes="(max-width: 1024px) 100vw, 38vw"
                quality={82}
                priority={i === 0}
                className="object-cover transition-opacity duration-700 ease-[var(--ease-out-quiet)]"
                style={{ opacity: i === active ? 1 : 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
