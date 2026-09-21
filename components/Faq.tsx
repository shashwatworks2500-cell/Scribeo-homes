"use client";

import { useState } from "react";
import { FAQS } from "@/lib/content";

/**
 * Questions.
 *
 * Eight at rest — the ones a buyer asks first — and the remaining
 * twenty-eight behind one control. This was a thirty-six question index with
 * its own search field and eight category filters, which is a good tool and
 * far too much furniture for a page whose job is to get someone to visit.
 *
 * Native <details> throughout, so every answer is in the served HTML and
 * open to search engines and to a reader with JavaScript off.
 */
export default function Faq() {
  const [all, setAll] = useState(false);
  /* Every question is rendered; the overflow is hidden with CSS, not
     omitted, so the answers stay in the served HTML with JavaScript off. */
  const ordered = [...FAQS.filter((f) => f.top), ...FAQS.filter((f) => !f.top)];

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-y gutter">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <h2 id="faq-heading" className="t-display-m max-w-[14ch] text-ink">
          Questions.
        </h2>
        <p className="t-meta max-w-[30ch] text-ink-dim">
          Anything not answered here, the site office will answer on the phone.
        </p>
      </div>

      <div
        data-collapsed={!all}
        className="mt-[clamp(2rem,5vh,3rem)] max-w-[52rem] border-t hair"
      >
        {ordered.map((f) => (
          <details key={f.q} className={`group border-b hair ${f.top ? "" : "is-extra"}`}>
            <summary className="flex cursor-pointer list-none items-baseline justify-between gap-5 py-4 marker:hidden">
              <span className="t-display-s text-ink">{f.q}</span>
              <span
                aria-hidden="true"
                className="t-display-s shrink-0 text-travertine transition-transform duration-300 group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="measure-wide pb-5 text-ink-dim">{f.a}</p>
          </details>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setAll((v) => !v)}
        aria-expanded={all}
        className="js-only t-meta mt-6 inline-flex items-baseline gap-2 border-b border-hair pb-0.5 text-ink-dim transition-colors duration-300 hover:border-travertine hover:text-ink"
      >
        {all ? "Show the first eight" : `View all ${FAQS.length} questions`}
        <span aria-hidden="true" className="text-travertine">
          {all ? "−" : "+"}
        </span>
      </button>
    </section>
  );
}
