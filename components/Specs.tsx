import { SPECS, TRUST } from "@/lib/story";

/**
 * Specifications.
 *
 * A reference section, not a story. It opens on what the building is made
 * of and everything else sits behind a native <details>, which works with
 * JavaScript off and needs no component state. The qualifications the rest
 * of the page relies on are kept here too, where someone looking for them
 * would go.
 */
export default function Specs() {
  const [first, ...rest] = SPECS;

  return (
    <section id="specifications" aria-labelledby="spec-heading" className="section-y gutter bg-ground-2">
      <h2 id="spec-heading" className="t-display-m max-w-[14ch] text-ink">
        Specifications.
      </h2>

      <div className="mt-[clamp(2rem,5vh,3rem)] max-w-[52rem]">
        <dl className="border-t hair">
          {first.rows.map(([k, v]) => (
            <div key={k} data-reveal className="grid grid-cols-12 gap-x-5 gap-y-1 border-b hair py-3.5">
              <dt className="t-label col-span-12 self-center text-ink-faint sm:col-span-4">{k}</dt>
              <dd className="t-meta col-span-12 text-ink sm:col-span-8">{v}</dd>
            </div>
          ))}
        </dl>

        {rest.map((group) => (
          <details key={group.group} className="group border-b hair">
            <summary className="t-meta flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-ink marker:hidden">
              <span>{group.group}</span>
              <span
                aria-hidden="true"
                className="t-display-s shrink-0 text-travertine transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <dl className="pb-2">
              {group.rows.map(([k, v]) => (
                <div key={k} className="grid grid-cols-12 gap-x-5 gap-y-1 border-t hair py-3.5">
                  <dt className="t-label col-span-12 self-center text-ink-faint sm:col-span-4">{k}</dt>
                  <dd className="t-meta col-span-12 text-ink sm:col-span-8">{v}</dd>
                </div>
              ))}
            </dl>
          </details>
        ))}

        <details className="group border-b hair">
          <summary className="t-meta flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-ink marker:hidden">
            <span>What is indicative, and what is confirmed</span>
            <span
              aria-hidden="true"
              className="t-display-s shrink-0 text-travertine transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <dl className="pb-2">
            {TRUST.map(({ k, v }) => (
              <div key={k} className="grid grid-cols-12 gap-x-5 gap-y-1 border-t hair py-3.5">
                <dt className="t-label col-span-12 self-center text-ink-faint sm:col-span-4">{k}</dt>
                <dd className="t-meta col-span-12 text-ink sm:col-span-8">{v}</dd>
              </div>
            ))}
          </dl>
        </details>
      </div>
    </section>
  );
}
