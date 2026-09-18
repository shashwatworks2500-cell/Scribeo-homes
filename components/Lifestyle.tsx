import Image from "next/image";
import { A } from "@/lib/assets";
import Plate from "./Plate";
import SplitLines from "./SplitLines";

/**
 * The emotional register. One full-bleed plate, one line of type, and enough
 * silence around it that the line has somewhere to land.
 */
export default function Lifestyle() {
  return (
    <section aria-labelledby="life-heading" className="relative">
      <div className="relative h-[92svh] w-full overflow-hidden bg-ink film-grain">
        <div data-parallax="5" className="absolute inset-0" style={{ top: "-5%", bottom: "-5%" }}>
          <Image
            src={A.lifestylePathway.src}
            alt={A.lifestylePathway.alt}
            fill
            sizes="100vw"
            quality={84}
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(11,10,8,0.82) 0%, rgba(11,10,8,0.10) 55%, rgba(11,10,8,0.30) 100%)",
          }}
        />
        <div className="gutter absolute inset-x-0 bottom-0 pb-[clamp(3rem,9vh,6rem)]">
          <p data-reveal className="t-eyebrow text-travertine/85">
            05 — Living here
          </p>
          <h2 id="life-heading" className="t-display-l mt-6 max-w-[22ch] text-stone">
            <SplitLines>The best part of a house is the walk back to it.</SplitLines>
          </h2>
        </div>
      </div>

      <div className="gutter section-y">
        <div className="grid grid-cols-12 items-center gap-[clamp(2rem,5vw,4rem)]">
          <div className="col-span-12 md:col-span-6">
            <Plate
              asset={A.bedroom}
              ratio="16/10"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 48vw"
              caption="The bedroom opens on a pivot; one tree fills the aperture"
            />
          </div>
          <div className="col-span-12 md:col-span-5 md:col-start-8">
            <Plate
              asset={A.lifestyleArrival}
              ratio="4/5"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 40vw"
              className="mb-[clamp(2rem,4vh,3rem)]"
              caption="Arrival, on foot, across open ground"
            />
            <p data-reveal className="t-display-s max-w-[22ch] text-stone">
              Every room was given one thing worth looking at, and then left alone.
            </p>
            <p data-reveal className="mt-6 measure text-stone-faint">
              Openings are placed against what is already growing rather than against the compass.
              The result is a house that is quieter at seven in the morning than it is at noon.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
