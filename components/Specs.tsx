import { SPECS } from "@/lib/story";

/**
 * Specifications.
 *
 * Only what the supplied project information states. The last group exists
 * because a serious buyer will look for approvals, construction status and
 * possession, and the honest answer is that they were not supplied — saying
 * so is worth more than a confident invention, and it tells them exactly
 * where to get it.
 */
export default function Specs() {
  return (
    <section id="specifications" aria-labelledby="spec-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(1.5rem,4vh,2.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="t-eyebrow text-travertine">
            13 — Specifications
          </p>
          <h2 id="spec-heading" className="t-display-m mt-6 max-w-[14ch] text-ink">
            Exactly what you are buying.
          </h2>
          <p data-reveal className="mt-6 measure text-ink-dim">
            Everything the project information states, and a plain note where it does not.
          </p>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          {SPECS.map((g) => (
            <div key={g.group} data-reveal className="mb-[clamp(1.75rem,4vh,2.5rem)] last:mb-0">
              <h3 className="t-eyebrow border-b hair pb-3 text-travertine">{g.group}</h3>
              <dl>
                {g.rows.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-12 gap-x-4 gap-y-1 border-b hair py-3">
                    <dt className="t-meta col-span-12 text-ink-faint sm:col-span-4">{k}</dt>
                    <dd className="t-meta col-span-12 text-ink sm:col-span-8">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
