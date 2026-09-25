import { GLANCE } from "@/lib/story";

/**
 * At a glance.
 *
 * The basic questions answered in under five seconds, and nothing
 * decorative: a large editorial heading on the left, the information matrix
 * on the right — six rows, each a small number, a label and a large value.
 * On a phone the rows simply stack, one divider apiece; six tiny cards would
 * be harder to scan, not easier.
 */
export default function Glance() {
  return (
    <section id="glance" aria-labelledby="glance-heading" className="section-y bg-ground-2">
      <div className="shell gutter grid grid-cols-12 gap-y-10 lg:gap-x-[clamp(2rem,4vw,4rem)]">
        <h2 id="glance-heading" data-reveal className="t-major col-span-12 max-w-[12ch] text-ink lg:col-span-5">
          Scribeo Homes at a glance.
        </h2>

        <dl data-reveal className="col-span-12 border-t hair lg:col-span-7 lg:self-end">
          {GLANCE.map(({ n, k, v }) => (
            <div
              key={k}
              className="grid grid-cols-[2.75rem_1fr] items-baseline gap-y-1.5 border-b hair py-5 md:grid-cols-[3.5rem_minmax(0,0.9fr)_minmax(0,1.4fr)] md:py-6"
            >
              <span aria-hidden="true" className="t-numeral text-accent">
                {n}
              </span>
              <dt className="t-label text-ink-dim">{k}</dt>
              <dd className="t-value col-start-2 text-ink md:col-start-3">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
