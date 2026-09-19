import { A } from "@/lib/assets";
import Plate from "./Plate";
import SplitLines from "./SplitLines";

/**
 * The material story. Deliberately one plate, not six: the rest of the
 * collection lives in the gallery, and this section only has to establish
 * what the buildings are made of.
 */
export default function Architecture() {
  return (
    <section id="architecture" aria-labelledby="arch-heading" className="section-y gutter overflow-hidden">
      <div className="grid grid-cols-12 items-center gap-y-[clamp(2rem,5vh,3.5rem)]">
        <div className="col-span-12 md:col-span-5 md:pr-[clamp(1rem,3vw,3rem)]">
          <p data-reveal className="t-eyebrow text-travertine">
            02 — Architecture
          </p>
          <h2 id="arch-heading" className="t-display-m mt-6 max-w-[18ch] text-ink">
            <SplitLines>Restraint, held in *stone*.</SplitLines>
          </h2>
          <p data-reveal className="mt-8 measure text-ink-dim">
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
                <dt className="t-meta text-ink-faint">{k}</dt>
                <dd className="t-meta text-right text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <Plate
            asset={A.vFacade}
            ratio="4/5"
            parallax={5}
            sizes="(max-width: 768px) 100vw, 48vw"
            caption="Three storeys of one bay — limestone piers, deep reveals, timber louvres"
          />
        </div>
      </div>
    </section>
  );
}
