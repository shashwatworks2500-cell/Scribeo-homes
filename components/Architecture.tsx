import { A } from "@/lib/assets";
import Plate from "./Plate";

/**
 * Editorial spread, not a grid. The façade study runs tall and full-bleed to
 * the right edge; the material detail overlaps it from the left at a smaller
 * scale; the window study sits low and wide. Text holds the left margin.
 */
export default function Architecture() {
  return (
    <section id="architecture" aria-labelledby="arch-heading" className="section-y overflow-hidden">
      <div className="gutter">
        <div className="grid grid-cols-12 items-start gap-y-[clamp(2rem,5vh,3.5rem)]">
          <div className="col-span-12 md:col-span-5 md:pr-[clamp(1rem,3vw,3rem)]">
            <p data-reveal className="t-eyebrow text-travertine/80">
              02 — Architecture
            </p>
            <h2 id="arch-heading" data-reveal className="t-display-m mt-6 max-w-[18ch] text-stone">
              Restraint, held in stone.
            </h2>
            <p data-reveal className="mt-8 measure text-stone-dim">
              The language is fixed and repeated: warm limestone and beige sandstone, warm-grey
              architectural concrete, slim charcoal frames, teak used sparingly and only where a
              hand will touch it.
            </p>
            <dl className="mt-[clamp(2rem,4vh,3rem)] border-t hair">
              {[
                ["Primary material", "Warm limestone, beige sandstone"],
                ["Structure", "Warm-grey architectural concrete"],
                ["Openings", "Deep reveals, slim charcoal frames"],
                ["Accent", "Natural teak, used sparingly"],
              ].map(([k, v]) => (
                <div key={k} data-reveal className="flex justify-between gap-6 border-b hair py-4">
                  <dt className="t-meta text-stone-faint">{k}</dt>
                  <dd className="t-meta text-right text-stone">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="col-span-12 md:col-span-7">
            <Plate
              asset={A.facadeStudy}
              ratio="4/5"
              parallax={5}
              sizes="(max-width: 768px) 100vw, 58vw"
              caption="Fig. 01 — Signature façade: limestone fins, recessed glazing, timber louvres"
            />
          </div>
        </div>

        {/* Overlapping lower register: small plate pulled up into the spread. */}
        <div className="mt-[clamp(1.5rem,4vh,3rem)] grid grid-cols-12 items-end gap-y-[clamp(1.5rem,4vh,2.5rem)]">
          <div className="col-span-12 md:col-span-5 md:-mt-[clamp(3rem,10vh,8rem)]">
            <Plate
              asset={A.materialDetail}
              ratio="3/2"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 40vw"
              caption="Fig. 02 — Travertine meeting glass and teak at the building edge"
            />
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <Plate
              asset={A.windowAperture}
              ratio="16/9"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 48vw"
              caption="Fig. 03 — The reveal used as an aperture between room and garden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
