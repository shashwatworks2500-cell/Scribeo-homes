import Image from "next/image";
import { A } from "@/lib/assets";
import SplitLines from "./SplitLines";

/**
 * Tonal shift. Every other section sits on the page ground; this one sits on
 * a warmer tint, so the drawing has a surface of its own and the page keeps a
 * change of register at its two-thirds point. Surroundings below are read off
 * the plan itself; no distances or place names are claimed, because the plan
 * states none.
 */
const SURROUNDINGS = [
  ["Parklands", "West"],
  ["University campus", "North west"],
  ["Retail hubs", "North east"],
  ["Botanical gardens", "East"],
  ["Modern art museum", "South west"],
  ["Cultural districts", "South"],
  ["Lake", "South east"],
  ["Riverfront", "South west"],
] as const;

export default function Location() {
  return (
    <section
      id="location"
      aria-labelledby="loc-heading"
      className="bg-ground-3 text-ink"
    >
      <div className="gutter section-y">
        <div className="grid grid-cols-12 gap-y-[clamp(2rem,5vw,4.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
          <div className="col-span-12 md:col-span-5">
            <p data-reveal className="t-eyebrow text-travertine">
              07 — Location
            </p>
            <h2 id="loc-heading" className="t-display-m mt-6 max-w-[16ch]">
              <SplitLines>Held inside the green, not outside the city.</SplitLines>
            </h2>
            <p data-reveal className="mt-8 measure text-ink-dim">
              The development sits at the centre of the plan, inside the ring, with parkland and
              green belt on three sides and the cultural quarter within the same ring road.
            </p>

            <dl className="mt-[clamp(2rem,4vh,3rem)] border-t" style={{ borderColor: "var(--color-paper-hair)" }}>
              {SURROUNDINGS.map(([place, dir]) => (
                <div
                  key={place}
                  data-reveal
                  className="flex items-baseline justify-between gap-6 border-b py-3.5"
                  style={{ borderColor: "var(--color-paper-hair)" }}
                >
                  <dt className="t-meta">{place}</dt>
                  <dd className="t-meta" style={{ color: "var(--color-ink-dim)" }}>
                    {dir}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="t-meta mt-6" style={{ color: "var(--color-ink-dim)" }}>
              Orientation read from the supplied location plan. No scale is stated on the drawing.
            </p>
          </div>

          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <figure data-reveal>
              <Image
                src={A.locationMap.src}
                alt={A.locationMap.alt}
                width={A.locationMap.w}
                height={A.locationMap.h}
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="w-full"
              />
              <figcaption className="t-meta mt-4" style={{ color: "var(--color-ink-dim)" }}>
                Fig. 04 — Location plan
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
