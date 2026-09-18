import { A } from "@/lib/assets";
import Plate from "./Plate";
import SplitLines from "./SplitLines";

/**
 * Editorial spread, not a grid.
 *
 * The lower register is a vertical triptych — three portrait plates at
 * staggered heights. Portrait is the natural format for a façade, a material
 * and a threshold, and it is the one composition the supplied 16:9-only
 * collection could not do.
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
            <h2 id="arch-heading" className="t-display-m mt-6 max-w-[18ch] text-stone">
              <SplitLines>Restraint, held in *stone*.</SplitLines>
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

        {/* Vertical triptych. Staggered on a wide screen so the eye travels;
            a swipeable row on a phone, where three stacked portrait plates
            would cost two and a half screens of scrolling on their own. */}
        <div className="mt-[clamp(3rem,9vh,7rem)]">
          <ul className="-mx-[clamp(1.25rem,5vw,6.5rem)] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[clamp(1.25rem,5vw,6.5rem)] pb-2 sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-[clamp(1rem,2.5vw,2.25rem)] sm:overflow-visible sm:px-0 sm:pb-0"
              style={{ scrollbarWidth: "none" }}>
            <li className="w-[70vw] shrink-0 snap-center sm:w-auto">
              <Plate
                asset={A.vFacade}
                ratio="3/4"
                parallax={4}
                sizes="(max-width: 640px) 70vw, 31vw"
                caption="Fig. 02 — Three storeys of one bay"
              />
            </li>
            <li className="w-[70vw] shrink-0 snap-center sm:w-auto sm:mt-[clamp(2rem,7vh,5.5rem)]">
              <Plate
                asset={A.vMaterial}
                ratio="3/4"
                parallax={4}
                sizes="(max-width: 640px) 70vw, 31vw"
                caption="Fig. 03 — Teak, shadow gap, plaster, travertine, concrete"
              />
            </li>
            <li className="w-[70vw] shrink-0 snap-center sm:w-auto sm:mt-[clamp(1rem,3.5vh,2.75rem)]">
              <Plate
                asset={A.vThreshold}
                ratio="3/4"
                parallax={4}
                sizes="(max-width: 640px) 70vw, 31vw"
                caption="Fig. 04 — The door, set back from the weather"
              />
            </li>
          </ul>
        </div>

        <div className="mt-[clamp(2.5rem,7vh,5rem)] grid grid-cols-12 items-end gap-y-[clamp(1.5rem,4vh,2.5rem)]">
          <div className="col-span-12 md:col-span-5">
            <Plate
              asset={A.materialDetail}
              ratio="3/2"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 40vw"
              caption="Fig. 05 — Travertine meeting glass and teak at the building edge"
            />
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            <Plate
              asset={A.windowAperture}
              ratio="16/9"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 48vw"
              caption="Fig. 06 — The reveal used as an aperture between room and garden"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
