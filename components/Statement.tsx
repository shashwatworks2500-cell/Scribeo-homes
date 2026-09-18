import SplitLines from "./SplitLines";
export default function Statement() {
  return (
    <section id="about" aria-labelledby="about-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(2.5rem,6vh,4.5rem)]">
        <div className="col-span-12 md:col-span-3">
          <p data-reveal className="t-eyebrow text-travertine/80">
            01 — The idea
          </p>
        </div>
        <div className="col-span-12 md:col-span-9 md:pl-[clamp(0rem,3vw,3rem)]">
          <h2 id="about-heading" className="t-display-l max-w-[24ch] text-stone">
            <SplitLines>A home is not a structure. It is the hour you wake into.</SplitLines>
          </h2>
          <div className="mt-[clamp(2rem,5vh,3.5rem)] grid gap-[clamp(1.5rem,3vw,3rem)] md:grid-cols-2">
            <p data-reveal className="t-lede measure-wide text-stone-dim">
              Scribeo Homes is a collection of contemporary residences held within mature
              landscape — limestone, warm concrete, glass and teak, arranged so that each room
              opens toward something growing.
            </p>
            <p data-reveal className="measure-wide text-stone-faint">
              The plan is unhurried. Deep reveals keep the sun off the glass until it is wanted.
              Roof slabs run long and low so the buildings read as horizontal against the trees.
              Nothing here is trying to be the tallest thing in the landscape.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
