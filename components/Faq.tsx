"use client";

import { useMemo, useState, useId } from "react";
import { FAQS } from "@/lib/content";
import { CONTACT } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Searchable enquiry index.
 *
 * Every question is rendered as a native <details>, so with JavaScript off the
 * whole index is still present, expandable and findable with the browser's own
 * find-in-page. Search narrows it; it is not required to use it.
 *
 * Matching runs over the question, the answer and a tag list, so "how much",
 * "emi" or "rera" find the right entry without the exact wording.
 */
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9₹ ]+/g, " ").replace(/\s+/g, " ").trim();

export default function Faq() {
  const [q, setQ] = useState("");
  const uid = useId();

  const results = useMemo(() => {
    const needle = normalise(q);
    if (!needle) return FAQS;
    const words = needle.split(" ").filter(Boolean);
    return FAQS.map((f) => {
      const hay = normalise(`${f.q} ${f.a} ${f.tags.join(" ")}`);
      const title = normalise(f.q);
      let score = 0;
      for (const w of words) {
        if (title.includes(w)) score += 3;
        else if (f.tags.some((t) => normalise(t).includes(w))) score += 2;
        else if (hay.includes(w)) score += 1;
      }
      return { f, score };
    })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((r) => r.f);
  }, [q]);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(2rem,5vw,4.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="t-eyebrow text-travertine/80">
            08 — Questions
          </p>
          <h2 id="faq-heading" className="t-display-m mt-6 max-w-[14ch] text-stone">
            <SplitLines>Ask before you *ask us*.</SplitLines>
          </h2>
          <p data-reveal className="mt-8 measure text-stone-dim">
            {FAQS.length} answers on price, payment, approvals, specification, amenities and
            handover. Search in plain words — &ldquo;how much&rdquo;, &ldquo;loan&rdquo;,
            &ldquo;possession&rdquo;.
          </p>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <div data-reveal>
            <label htmlFor={`${uid}-search`} className="t-meta block text-stone-faint">
              Search questions
            </label>
            <div className="mt-3 flex items-center gap-3 border-b border-hair pb-3 focus-within:border-travertine">
              <span aria-hidden="true" className="text-travertine">
                ⌕
              </span>
              <input
                id={`${uid}-search`}
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="price, home loan, possession, parking, pets…"
                autoComplete="off"
                aria-describedby={`${uid}-count`}
                className="w-full bg-transparent text-stone outline-none placeholder:text-stone-faint"
              />
              {q ? (
                <button
                  type="button"
                  onClick={() => setQ("")}
                  className="t-meta shrink-0 text-stone-faint hover:text-stone"
                >
                  Clear
                </button>
              ) : null}
            </div>
            <p id={`${uid}-count`} aria-live="polite" className="t-meta mt-3 text-stone-faint">
              {results.length} {results.length === 1 ? "answer" : "answers"}
              {q ? ` for “${q}”` : ""}
            </p>
          </div>

          {results.length === 0 ? (
            <div className="mt-8 border-t hair pt-8">
              <p className="t-display-s text-stone">No answer for that yet.</p>
              <p className="mt-4 measure text-stone-dim">
                Call{" "}
                <a href={CONTACT.phoneHref} className="text-travertine underline-offset-4 hover:underline">
                  {CONTACT.phoneDisplay}
                </a>{" "}
                or{" "}
                <a href="#enquire" className="text-travertine underline-offset-4 hover:underline">
                  send the question
                </a>{" "}
                and someone will reply directly.
              </p>
            </div>
          ) : (
            <ul className="mt-8 border-t hair">
              {results.map((f) => (
                <li key={f.q} className="border-b hair">
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-[clamp(0.8rem,1.9vh,1.05rem)] text-stone marker:hidden">
                      <span className="t-faq">{f.q}</span>
                      <span
                        aria-hidden="true"
                        className="t-meta shrink-0 text-travertine transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="measure-wide pb-[clamp(0.9rem,2.1vh,1.2rem)] text-stone-dim">{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
