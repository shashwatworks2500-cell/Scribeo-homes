import SplitLines from "./SplitLines";
export default function Statement() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(2.5rem,6vh,4.5rem)]">
        <div className="col-span-12 md:col-span-3">
          <p data-reveal className="t-eyebrow text-travertine">
            01 — The idea
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 md:pl-[clamp(0rem,3vw,3rem)]">
          <h2 id="about-heading" className="t-display-l max-w-[24ch] text-ink">
            <SplitLines>A home is not a structure. It is the hour you wake into.</SplitLines>
          </h2>
          {/* Two voices, separated by scale and tone rather than decoration:
              the statement is set larger and in full ink, the aside smaller
              and quieter. A hairline over each marks the column without
              drawing a box around it. */}
          <div className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-[clamp(1.75rem,3.5vw,3.5rem)] md:grid-cols-[1.15fr_1fr]">
            <div data-reveal>
              <span aria-hidden="true" className="mb-6 block h-px w-14 bg-travertine/70" />
              <p className="t-lede measure-wide text-ink">
                Scribeo Homes is a collection of contemporary residences held within mature
                landscape — limestone, warm concrete, glass and teak, arranged so that each room
                opens toward something growing.
              </p>
            </div>
            <div data-reveal>
              <span aria-hidden="true" className="mb-6 block h-px w-14 bg-hair" />
              <p className="measure-wide text-ink-dim">
                The plan is unhurried. Deep reveals keep the sun off the glass until it is wanted.
                Roof slabs run long and low so the buildings read as horizontal against the trees.
                Nothing here is trying to be the tallest thing in the landscape.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
