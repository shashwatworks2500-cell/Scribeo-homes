import { FAQS } from "@/lib/content";
import Accordion from "./Accordion";
import Icon from "./Icon";

/**
 * Questions. Large editorial title on the left, accordion on the right; on a
 * phone the title comes first.
 *
 * Only one answer is open at a time. The rows are <details> sharing a
 * `name`, which the browser enforces on its own with scripting off; with it
 * on, Accordion animates both rows — 300ms opening, 300ms closing — and
 * holds the page still so nothing jumps.
 *
 * The first eight show at rest. The other twenty-eight are rendered and
 * hidden with CSS keyed on html.js, so a reader without JavaScript, and any
 * crawler, still gets all thirty-six.
 */
export default function Faq() {
  const ordered = [...FAQS.filter((f) => f.top), ...FAQS.filter((f) => !f.top)];

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-y-lg bg-ground">
      <div className="shell gutter grid gap-y-10 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="faq-heading" data-reveal className="t-section text-ink">
              Questions
            </h2>
            <p className="t-body mt-5 max-w-[30ch] text-ink-dim">
              Anything not answered here, the site office will answer on the phone.
            </p>
          </div>
        </div>

        <Accordion exclusive id="faq-list" data-collapsed className="border-t hair lg:col-span-8">
          {ordered.map((f) => (
            <details key={f.q} name="scribeo-faq" className={`border-b hair ${f.top ? "" : "is-extra"}`}>
              <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-6 py-4">
                <span className="t-item text-ink">{f.q}</span>
                <Icon name="chevron-down" className="chevron h-5 w-5 text-ink-dim" />
              </summary>
              <p className="t-body measure-wide pb-7 pr-10 text-ink-dim">{f.a}</p>
            </details>
          ))}

          {/* Plain checkbox, no script: checking it clears the collapse. */}
          <input id="faq-all" type="checkbox" className="peer sr-only" />
          <label htmlFor="faq-all" className="js-only mt-5 block w-fit cursor-pointer peer-checked:!hidden">
            <span className="btn-text">
              View all {FAQS.length} questions
              <Icon name="chevron-down" className="arrow h-4 w-4" />
            </span>
          </label>
          <label htmlFor="faq-all" className="mt-5 hidden w-fit cursor-pointer peer-checked:!block">
            <span className="btn-text">
              Show the first eight
              <Icon name="chevron-down" className="arrow h-4 w-4 rotate-180" />
            </span>
          </label>
        </Accordion>
      </div>
    </section>
  );
}
