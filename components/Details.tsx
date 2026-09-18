import { A } from "@/lib/assets";
import Plate from "./Plate";

/**
 * Property details.
 *
 * Every row below is observable in the supplied assets or stated in their art
 * direction. No price, area, unit count, bedroom count, address, completion
 * date or amenity list appears here, because none of those exist in the
 * material provided — and inventing them is not a design decision.
 */
const ROWS = [
  ["Typology", "Detached and semi-detached residences, two and three storey volumes"],
  ["Primary material", "Warm natural limestone and beige sandstone"],
  ["Structure", "Warm-grey architectural concrete"],
  ["Glazing", "Floor-to-ceiling, deeply recessed, slim charcoal metal frames"],
  ["Joinery", "Natural teak, louvres and door linings"],
  ["Roof", "Horizontal slabs with deep soffits and precise shadow gaps"],
  ["Landscape", "Mature olive and deep-green canopy, ornamental grasses, low shrubs"],
  ["Paving", "Natural stone, laid loose in grass and as continuous terrace"],
  ["Orientation", "Principal openings receive low light from the east and rear"],
  ["Setting", "Low-rise residential, within parkland and green belt"],
  ["Availability", "On enquiry"],
] as const;

export default function Details() {
  return (
    <section id="details" aria-labelledby="det-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-7">
          <p data-reveal className="t-eyebrow text-travertine/80">
            07 — Details
          </p>
          <h2 id="det-heading" data-reveal className="t-display-m mt-6 max-w-[18ch] text-stone">
            What the drawings already say.
          </h2>

          <dl className="mt-[clamp(2.5rem,5vh,3.5rem)] border-t hair">
            {ROWS.map(([k, v]) => (
              <div
                key={k}
                data-reveal
                className="grid gap-1 border-b hair py-[clamp(0.875rem,2vh,1.25rem)] sm:grid-cols-[13rem_1fr] sm:gap-6"
              >
                <dt className="t-meta text-stone-faint">{k}</dt>
                <dd className="text-stone-dim">{v}</dd>
              </div>
            ))}
          </dl>

          <p className="t-meta mt-8 max-w-[52ch] text-stone-faint">
            Specification reflects the architectural visualisation supplied for this project.
            Dimensions, configurations and commercial terms are not published here.
          </p>
        </div>

        <div className="col-span-12 md:col-span-4 md:col-start-9">
          <div className="md:sticky md:top-[18vh]">
            <Plate
              asset={A.establishingDistant}
              ratio="3/4"
              parallax={4}
              sizes="(max-width: 768px) 100vw, 33vw"
              caption="Fig. 05 — The development read from beyond the landscaped edge"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
