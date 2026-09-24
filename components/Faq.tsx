import { FAQS } from "@/lib/content";

/**
 * Questions.
 *
 * Title left, accordion right, one answer open at a time — enforced by the
 * browser, not by React. A set of <details> sharing a `name` is an exclusive
 * accordion in HTML, so it needs no state, works with JavaScript off, and
 * every answer is in the served document for a crawler to read.
 *
 * The first eight show at rest. The remaining twenty-eight are rendered and
 * hidden with CSS keyed on html.js, so turning JavaScript off reveals them
 * rather than losing them.
 */
export default function Faq() {
  const ordered = [...FAQS.filter((f) => f.top), ...FAQS.filter((f) => !f.top)];

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-y-lg bg-ground">
      <div className="shell gutter grid grid-cols-12 gap-y-8 lg:gap-x-[clamp(2rem,5vw,4rem)]">
        <div className="col-span-12 lg:col-span-4">
          <h2 id="faq-heading" className="t-display-m text-ink">
            Questions
          </h2>
          <p className="t-body mt-5 max-w-[30ch] text-ink-dim">
            Anything not answered here, the site office will answer on the phone.
          </p>
        </div>

        <div id="faq-list" data-collapsed className="col-span-12 border-t hair lg:col-span-8">
          {ordered.map((f) => (
            <details
              key={f.q}
              name="scribeo-faq"
              className={`group border-b hair ${f.top ? "" : "is-extra"}`}
            >
              <summary className="flex cursor-pointer list-none items-baseline justify-between gap-5 py-5 marker:hidden">
                <span className="t-display-s text-ink">{f.q}</span>
                <span
                  aria-hidden="true"
                  className="t-display-s shrink-0 text-travertine transition-transform duration-300 ease-[var(--ease-out-quiet)] group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="t-body measure-wide pb-6 text-ink-dim">{f.a}</p>
            </details>
          ))}

          {/* Plain checkbox, no script: checking it clears the collapse. */}
          <input id="faq-all" type="checkbox" className="peer sr-only" />
          <label
            htmlFor="faq-all"
            className="btn-text mt-6 cursor-pointer text-ink-dim peer-checked:hidden"
          >
            View all {FAQS.length} questions
            <span aria-hidden="true" className="arrow text-travertine">→</span>
          </label>
          <label
            htmlFor="faq-all"
            className="btn-text mt-6 hidden cursor-pointer text-ink-dim peer-checked:inline-flex"
          >
            Show the first eight
            <span aria-hidden="true" className="arrow text-travertine">→</span>
          </label>
        </div>
      </div>
    </section>
  );
}
