"use client";

import { useState } from "react";
import { SPECS, TRUST } from "@/lib/story";

/**
 * Specifications.
 *
 * A reference section. Two columns of accordion on a wide screen so the
 * whole set is legible without a long scroll, one column on a phone. Only
 * what the supplied project information states: anything a buyer would
 * reasonably ask that was not supplied says so rather than guessing.
 */
const GROUPS = [
  ...SPECS,
  { group: "What is indicative, and what is confirmed", rows: TRUST.map((t) => [t.k, t.v] as [string, string]) },
];

function Fold({ group, rows }: { group: string; rows: [string, string][] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b hair">
      <h3>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-5 py-5 text-left"
        >
          <span className="t-display-s text-ink">{group}</span>
          <span
            aria-hidden="true"
            className={`t-display-s shrink-0 text-travertine transition-transform duration-300 ease-[var(--ease-out-quiet)] ${
              open ? "rotate-45" : ""
            }`}
          >
            +
          </span>
        </button>
      </h3>
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-[var(--ease-out-quiet)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <dl className="overflow-hidden">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-12 gap-x-5 gap-y-1 border-t hair py-3.5">
              <dt className="t-label col-span-12 self-center text-ink-faint sm:col-span-4">{k}</dt>
              <dd className="t-meta col-span-12 text-ink sm:col-span-8">{v}</dd>
            </div>
          ))}
          <div className="h-4" />
        </dl>
      </div>
    </div>
  );
}

export default function Specs() {
  const half = Math.ceil(GROUPS.length / 2);
  const columns = [GROUPS.slice(0, half), GROUPS.slice(half)];

  return (
    <section id="specifications" aria-labelledby="spec-heading" className="section-y-lg bg-ground-2">
      <div className="shell gutter">
        <h2 id="spec-heading" className="t-display-m text-ink">
          Specifications
        </h2>
        <div className="mt-[clamp(2rem,5vh,3rem)] grid gap-x-[clamp(2rem,5vw,4rem)] lg:grid-cols-2">
          {columns.map((col, n) => (
            <div key={n} className="border-t hair">
              {col.map((g) => (
                <Fold key={g.group} group={g.group} rows={g.rows as [string, string][]} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
