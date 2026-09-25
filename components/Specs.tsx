import { SPECS, SPEC_DETAIL } from "@/lib/story";
import Accordion from "./Accordion";
import Icon from "./Icon";

/**
 * Specifications — the project's own fourteen categories, Structure through
 * Vehicles, each a row with its label and a chevron that opens its value and,
 * where the project states one, the fuller detail. Two columns of accordion
 * on a desktop, one on a phone. No cards.
 *
 * What has not been published yet says so, in the same place, rather than
 * leaving a buyer to wonder whether it was forgotten.
 */
const ROWS = SPECS.filter((g) => g.group !== "Not yet published").flatMap((g) => g.rows);
const PENDING = SPECS.find((g) => g.group === "Not yet published")?.rows.map(([k]) => k) ?? [];

function Row({ label, value }: { label: string; value: string }) {
  const detail = SPEC_DETAIL[label];
  return (
    <details className="border-b hair">
      <summary className="flex min-h-16 cursor-pointer items-center justify-between gap-5 py-4">
        <span className="t-item text-ink">{label}</span>
        <Icon name="chevron-down" className="chevron h-5 w-5 text-ink-dim" />
      </summary>
      <div className="pb-6 pr-10">
        <p className="t-body text-ink">{value}</p>
        {detail ? <p className="t-body mt-2 text-ink-dim">{detail}</p> : null}
      </div>
    </details>
  );
}

export default function Specs() {
  const half = Math.ceil(ROWS.length / 2);
  const columns = [ROWS.slice(0, half), ROWS.slice(half)];

  return (
    <section id="specifications" aria-labelledby="spec-heading" className="section-y-lg bg-ground-2">
      <div className="shell gutter">
        <div className="grid gap-y-5 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
          <h2 id="spec-heading" data-reveal className="t-section text-ink lg:col-span-6">
            Specifications
          </h2>
          <p data-reveal className="t-body max-w-[34ch] text-ink-dim lg:col-span-5 lg:col-start-8 lg:self-end">
            Only what the project information states. A full specification sheet is available on request.
          </p>
        </div>

        <Accordion className="mt-[clamp(2.5rem,5vw,4rem)] grid gap-x-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-2">
          {columns.map((col, n) => (
            <div key={n} className={`border-t hair ${n === 1 ? "border-t-0 lg:border-t" : ""}`}>
              {col.map(([label, value]) => (
                <Row key={label} label={label} value={value} />
              ))}
            </div>
          ))}
        </Accordion>

        {PENDING.length ? (
          <div className="mt-10 grid gap-y-2 border-t hair pt-6 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)]">
            <p className="t-label text-ink-dim md:col-span-3">Not yet published</p>
            <p className="t-meta text-ink md:col-span-9">
              {PENDING.map((k, i) => (i ? k.toLowerCase() : k)).join(", ").replace(/, ([^,]*)$/, " and $1")}: details are
              available from the site office.
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
