import { GLANCE } from "@/lib/story";

/**
 * The project in one line, immediately after the hero.
 *
 * A visitor should know what this is, what it costs and what it is made of
 * before they have decided whether to keep scrolling. Everything here is
 * repeated in full further down; this is the index, not the argument.
 */
export default function Glance() {
  return (
    <section id="glance" aria-label="The project at a glance" className="gutter border-y hair bg-ground-2">
      <dl className="grid grid-cols-2 gap-x-[clamp(1rem,3vw,2.5rem)] gap-y-7 py-[clamp(1.75rem,4vh,2.75rem)] sm:grid-cols-3 lg:grid-cols-5">
        {GLANCE.map(({ k, v }) => (
          <div key={k}>
            <dt className="t-meta text-ink-faint">{k}</dt>
            <dd className="t-display-s mt-1.5 text-ink">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
