import Image from "next/image";
import { A } from "@/lib/assets";
import { AMENITIES } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Amenities: one strong image, then the whole list in the open.
 * Visitors scan this section rather than read it, so nothing is hidden behind
 * a carousel or an accordion — every provision is on the page at once.
 */
export default function Amenities() {
  return (
    <section id="amenities" aria-labelledby="amen-heading" className="section-y">
      <div className="gutter">
        <div className="grid grid-cols-12 items-end gap-y-6">
          <div className="col-span-12 md:col-span-7">
            <p data-reveal className="t-eyebrow text-travertine/80">
              04 — Amenities
            </p>
            <h2 id="amen-heading" className="t-display-m mt-6 max-w-[18ch] text-stone">
              <SplitLines>Shared ground, *properly made*.</SplitLines>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9">
            <p data-reveal className="measure text-stone-dim">
              Twenty-six provisions across leisure, wellness, landscape and the everyday — built
              in the same materials as the residences rather than bolted on afterwards.
            </p>
          </div>
        </div>
      </div>

      <figure data-reveal-clip className="relative mt-[clamp(2.5rem,6vh,4rem)] h-[clamp(20rem,58vh,36rem)] w-full overflow-hidden bg-ink-2">
        <div data-parallax="5" className="absolute inset-0" style={{ top: "-5%", bottom: "-5%" }}>
          <Image
            src={A.amClubhouse.src}
            alt={A.amClubhouse.alt}
            fill
            sizes="100vw"
            quality={84}
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(11,10,8,0.72) 0%, rgba(11,10,8,0.05) 55%)" }}
        />
        <figcaption className="gutter absolute inset-x-0 bottom-0 pb-[clamp(1.5rem,4vh,2.5rem)]">
          <span className="t-meta text-stone">The residents' clubhouse</span>
        </figcaption>
      </figure>

      <div className="gutter mt-[clamp(2.5rem,6vh,4rem)]">
        <div className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(2rem,5vh,3rem)] sm:grid-cols-2 lg:grid-cols-4">
          {AMENITIES.map((group) => (
            <div key={group.group} data-reveal>
              <h3 className="t-eyebrow border-b hair pb-4 text-travertine/80">{group.group}</h3>
              <ul className="mt-5 space-y-2.5">
                {group.items.map((item) => (
                  <li key={item} className="flex gap-3 text-stone-dim">
                    <span aria-hidden="true" className="mt-[0.62em] h-px w-3 shrink-0 bg-travertine/50" />
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
