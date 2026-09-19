import { FAQS } from "@/lib/content";

/**
 * The answers, for a browser that will not run the concierge.
 *
 * The question index is no longer a section of the page — the concierge owns
 * it. That is a fair trade for someone whose JavaScript is running and a total
 * loss for someone whose is not, so the same thirty-six answers are served
 * inside <noscript>: no cost when the script runs, the whole index when it
 * does not. Native <details>, so it is expandable and findable with the
 * browser's own find-in-page.
 */
export default function QuestionsNoScript() {
  return (
    <noscript>
      <section id="answers" aria-labelledby="answers-heading" className="section-y gutter">
        <p className="t-eyebrow text-travertine">Questions</p>
        <h2 id="answers-heading" className="t-display-m mt-6 max-w-[14ch] text-ink">
          Ask before you ask us.
        </h2>
        <ul className="mt-[clamp(2rem,5vh,3rem)] border-t hair">
          {FAQS.map((f) => (
            <li key={f.q} className="border-b hair">
              <details className="group">
                <summary className="t-faq cursor-pointer list-none py-[clamp(0.8rem,1.9vh,1.05rem)] text-ink marker:hidden">
                  {f.q}
                </summary>
                <p className="measure-wide pb-5 text-ink-dim">{f.a}</p>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </noscript>
  );
}
