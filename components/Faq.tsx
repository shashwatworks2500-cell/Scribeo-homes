"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { FAQS, categorise, type FaqCategory } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * The question index, back as a section and browsable as well as searchable.
 *
 * The concierge answers a question you already have; this is for the ones you
 * do not know to ask yet. Categories come from each question's own tags, so
 * filing happens at the point of writing rather than in a second list that
 * rots. Every answer is a native <details>, so the whole index works with no
 * JavaScript and with the browser's own find-in-page.
 */
const normalise = (s: string) => s.toLowerCase().replace(/[^a-z0-9₹ ]+/g, " ").replace(/\s+/g, " ").trim();

const ENTRIES = FAQS.map((f, i) => ({ ...f, i, cat: categorise(f) }));
const CATEGORIES = ["All", ...Array.from(new Set(ENTRIES.map((e) => e.cat)))] as const;

export default function Faq() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"All" | FaqCategory>("All");
  const deferred = useDeferredValue(q);

  const results = useMemo(() => {
    const pool = cat === "All" ? ENTRIES : ENTRIES.filter((e) => e.cat === cat);
    const needle = normalise(deferred);
    if (!needle) return pool;
    const words = needle.split(" ").filter(Boolean);
    return pool
      .map((f) => {
        const title = normalise(f.q);
        const hay = normalise(`${f.q} ${f.a} ${f.tags.join(" ")}`);
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
  }, [deferred, cat]);

  const countFor = (c: string) => (c === "All" ? ENTRIES.length : ENTRIES.filter((e) => e.cat === c).length);

  return (
    <section id="faq" aria-labelledby="faq-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(1.5rem,4vh,2.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="t-eyebrow text-travertine">
            14 — Questions
          </p>
          <h2 id="faq-heading" className="t-display-m mt-6 max-w-[14ch] text-ink">
            <SplitLines>Ask before you *ask us*.</SplitLines>
          </h2>
          <p data-reveal className="mt-6 measure text-ink-dim">
            {ENTRIES.length} answers on price, payment, approvals, specification, amenities and
            handover. Search in plain words, or browse by subject.
          </p>
        </div>

        <div className="col-span-12 md:col-span-7 md:col-start-6">
          <label htmlFor="faq-search" className="t-meta text-ink-faint">
            Search your question
          </label>
          <input
            id="faq-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
            placeholder="price, home loan, possession, parking, pets…"
            className="t-lede mt-2 w-full border-b border-rule bg-transparent pb-3 text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-travertine"
          />

          <div className="mt-5 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => {
              const on = cat === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c as "All" | FaqCategory)}
                  aria-pressed={on}
                  className="t-meta border px-3.5 py-1.5 transition-colors duration-300"
                  style={{
                    borderColor: on ? "var(--color-travertine)" : "var(--color-rule)",
                    backgroundColor: on ? "var(--color-travertine)" : "transparent",
                    color: on ? "var(--color-ground)" : "var(--color-ink-dim)",
                  }}
                >
                  {c} <span className="opacity-60">{countFor(c)}</span>
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="t-meta mt-5 text-ink-faint">
            {results.length} {results.length === 1 ? "answer" : "answers"}
            {q ? ` for “${q}”` : cat !== "All" ? ` in ${cat}` : ""}
          </p>

          {results.length === 0 ? (
            <p className="t-display-s mt-6 text-ink">
              Nothing matches that. Ask the concierge, or the site office.
            </p>
          ) : (
            <ul className="mt-2 border-t hair">
              {results.map((f) => (
                <li key={f.q} className="border-b hair">
                  <details id={`faq-q-${f.i}`} className="group scroll-mt-28">
                    <summary className="flex cursor-pointer list-none items-baseline justify-between gap-6 py-[clamp(0.8rem,1.9vh,1.05rem)] text-ink marker:hidden">
                      <span className="t-faq">{f.q}</span>
                      <span
                        aria-hidden="true"
                        className="t-meta shrink-0 text-travertine transition-transform duration-300 group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <p className="measure-wide pb-5 text-ink-dim">{f.a}</p>
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
