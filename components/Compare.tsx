"use client";

import { useEffect, useMemo, useState } from "react";
import { CONFIGS } from "@/lib/content";
import { buildRows, differs } from "@/lib/compare";

/**
 * Compare residences.
 *
 * Nobody buys a flat by reading four plans in sequence and holding the
 * differences in their head. This puts the chosen plans beside each other and
 * says only what actually differs between them — the rest is folded away by
 * default, because a row that reads the same four times is not information.
 *
 * How many columns fit is a question about the viewport, not about taste, so
 * the cap is measured rather than guessed. Choosing a fifth on a phone drops
 * the oldest rather than refusing the click.
 */

const capFor = (w: number) => (w < 720 ? 2 : w < 1100 ? 3 : 4);

export default function Compare() {
  const rows = useMemo(() => buildRows(), []);
  const [sel, setSel] = useState<string[]>(["2bhk", "3bhk"]);
  const [onlyDiff, setOnlyDiff] = useState(true);
  const [cap, setCap] = useState(2);

  /* Measure the cap, then keep it measured. Dropping from four columns to two
     on a rotate must also drop the columns, or the table overflows its page. */
  useEffect(() => {
    const read = () => {
      const next = capFor(window.innerWidth);
      setCap(next);
      setSel((s) => (s.length > next ? s.slice(s.length - next) : s));
    };
    read();
    window.addEventListener("resize", read, { passive: true });
    return () => window.removeEventListener("resize", read);
  }, []);

  const toggle = (id: string) =>
    setSel((s) => {
      if (s.includes(id)) return s.length === 1 ? s : s.filter((x) => x !== id);
      const next = [...s, id];
      return next.length > cap ? next.slice(next.length - cap) : next;
    });

  /* Keep the printed order the same as the rest of the page, whatever order
     they were picked in — a table that reshuffles as you click is unreadable. */
  const shown = CONFIGS.filter((c) => sel.includes(c.id)).map((c) => c.id);
  const visible = rows.filter((r) => !onlyDiff || differs(r, shown));
  const hidden = rows.length - visible.length;

  const columns = `clamp(5.5rem,20vw,11rem) repeat(${shown.length}, minmax(0,1fr))`;

  return (
    <section id="compare" aria-labelledby="compare-heading" className="section-y bg-ground-2">
      <div className="gutter">
        <div className="grid grid-cols-12 gap-y-6 md:gap-x-[clamp(2rem,5vw,4rem)]">
          <div className="col-span-12 md:col-span-5">
            <p data-reveal className="t-eyebrow text-travertine">
              07 — Compare
            </p>
            <h2 id="compare-heading" className="t-display-m mt-6 max-w-[15ch] text-ink">
              Side by side, only what differs.
            </h2>
          </div>
          <p data-reveal className="col-span-12 measure self-end text-ink-dim md:col-span-6 md:col-start-7">
            Every figure below is read off the drawn plan, so the table and the drawing can never
            disagree. Choose {cap === 2 ? "two" : `up to ${cap}`} to place beside each other.
          </p>
        </div>

        {/* Choosers, and the fold. */}
        <div className="mt-[clamp(2rem,5vh,3rem)] flex flex-wrap items-center gap-x-2.5 gap-y-3">
          {CONFIGS.map((c) => {
            const on = sel.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => toggle(c.id)}
                aria-pressed={on}
                className={`t-meta rounded-full border px-4 py-2 transition-colors duration-300 ${
                  on
                    ? "border-travertine bg-travertine text-paper"
                    : "border-hair text-ink-dim hover:border-rule hover:text-ink"
                }`}
              >
                {c.bhk}
              </button>
            );
          })}
          <label className="t-meta ml-auto inline-flex cursor-pointer select-none items-center gap-2.5 text-ink-dim">
            <input
              type="checkbox"
              checked={onlyDiff}
              onChange={(e) => setOnlyDiff(e.target.checked)}
              className="h-4 w-4 accent-[var(--color-travertine)]"
            />
            Differences only
          </label>
        </div>

        {/* The table. A grid rather than a <table> so the header can carry a
            plan link and the cells can wrap; the roles put it back. */}
        {/* Table and footnote share one measure, so the fold count and the
            link stay under the columns they describe. */}
        <div style={{ maxWidth: `min(100%, ${11 + 19 * shown.length}rem)` }}>
        <div role="table" aria-label="Residences compared" className="mt-[clamp(1.75rem,4vh,2.5rem)]">
          <div role="row" className="grid items-end gap-x-3 border-b border-rule/50 pb-4" style={{ gridTemplateColumns: columns }}>
            <span role="columnheader" className="t-meta text-ink-faint">
              Residence
            </span>
            {shown.map((id) => {
              const c = CONFIGS.find((x) => x.id === id)!;
              return (
                <span key={id} role="columnheader" className="min-w-0">
                  <span className="t-display-s block text-ink">{c.bhk}</span>
                  <span className="t-meta mt-1 block text-ink-faint">{c.label}</span>
                </span>
              );
            })}
          </div>

          {visible.map((row) => {
            const diff = differs(row, shown);
            return (
              <div
                key={row.label}
                role="row"
                className="grid items-baseline gap-x-3 border-b hair py-[clamp(0.7rem,1.8vh,1rem)]"
                style={{ gridTemplateColumns: columns }}
              >
                <span role="rowheader" className="t-meta min-w-0 text-ink-faint">
                  {row.label}
                  {row.note ? <span className="mt-0.5 block text-ink-faint/70">{row.note}</span> : null}
                </span>
                {shown.map((id) => {
                  const cell = row.cells[id];
                  return (
                    <span
                      key={id}
                      role="cell"
                      className={`t-meta min-w-0 ${
                        !cell.present ? "text-ink-faint/60" : diff ? "text-ink" : "text-ink-dim"
                      }`}
                    >
                      {cell.text}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
          <p className="t-meta text-ink-faint">
            {hidden > 0
              ? `${hidden} row${hidden === 1 ? "" : "s"} identical across these plans, hidden.`
              : "All rows shown."}{" "}
            Dimensions are nominal and taken from the drawings; price bands are indicative.
          </p>
          <button
            type="button"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("scribeo:config", { detail: { id: shown[shown.length - 1] } }));
              document.getElementById("residences")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="group inline-flex items-baseline gap-3 border-b border-travertine/70 pb-1.5 transition-colors duration-300 hover:border-travertine"
          >
            <span className="t-meta text-ink">Open the plan</span>
            <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
        </div>
      </div>
    </section>
  );
}
