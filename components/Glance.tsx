import { GLANCE } from "@/lib/story";

/**
 * Scribeo Homes at a glance.
 *
 * The most useful five seconds on the site. Six facts, no sentences: a
 * visitor who reads nothing else should still be able to say what this is,
 * what it costs and whether it is worth a visit.
 */
export default function Glance() {
  return (
    <section id="glance" aria-labelledby="glance-heading" className="section-y gutter bg-ground-2">
      <h2 id="glance-heading" className="t-display-m max-w-[18ch] text-ink">
        Scribeo Homes at a glance.
      </h2>

      <dl className="mt-[clamp(2.5rem,6vh,4rem)] grid grid-cols-1 gap-x-[clamp(1.5rem,4vw,3.5rem)] gap-y-[clamp(2rem,5vh,3rem)] sm:grid-cols-2 lg:grid-cols-3">
        {GLANCE.map(({ n, k, v }) => (
          <div key={k} data-reveal className="border-t hair pt-5">
            <span aria-hidden="true" className="t-numeral block text-ink-faint">
              {n}
            </span>
            <dt className="t-label mt-3 text-ink-faint">{k}</dt>
            <dd className="t-display-s mt-2 text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
