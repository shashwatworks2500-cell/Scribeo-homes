import { A } from "@/lib/assets";
import Plate from "./Plate";
import SplitLines from "./SplitLines";

/**
 * A pause between chapters.
 *
 * One portrait plate and one line. The page has been dense for a while by the
 * time it arrives; this exists to give the eye somewhere to rest before the
 * landscape sequence takes over again.
 */
export default function Interstitial() {
  return (
    <section aria-labelledby="pause-heading" className="section-y gutter">
      <div className="grid grid-cols-12 items-center gap-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 sm:col-span-7 md:col-span-5">
          <Plate
            asset={A.vTreeWall}
            ratio="3/4"
            parallax={5}
            sizes="(max-width: 768px) 100vw, 40vw"
            caption="A wall, and the only thing asked to decorate it"
          />
        </div>
        <div className="col-span-12 md:col-span-6 md:col-start-7">
          <h2 id="pause-heading" className="t-display-m max-w-[16ch] text-stone">
            <SplitLines>Most of the design is what was left out.</SplitLines>
          </h2>
          <p data-reveal className="mt-8 measure text-stone-dim">
            No mouldings, no applied ornament, no feature wall. The stone is asked to be stone, and
            a tree is asked to do the rest.
          </p>
          <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-[clamp(1rem,2vw,1.75rem)] sm:grid-cols-2">
            <Plate
              asset={A.vLightCorner}
              ratio="3/4"
              parallax={4}
              sizes="(max-width: 640px) 100vw, 24vw"
              caption="Seven in the morning, on the wall opposite the bed"
            />
            <Plate
              asset={A.vRoofSlab}
              ratio="3/4"
              parallax={4}
              sizes="(max-width: 640px) 100vw, 24vw"
              className="sm:mt-[clamp(1.5rem,5vh,3.5rem)]"
              caption="The slab, from beneath"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
