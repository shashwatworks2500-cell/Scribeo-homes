import { TRUST } from "@/lib/story";
import { CONTACT } from "@/lib/content";

/**
 * What a serious buyer needs in writing.
 *
 * Quiet luxury is not the same as withheld information. Every qualification
 * the rest of the page relies on — that the imagery is visualisation, that the
 * plans are indicative, that the prices exclude duty — is collected here in
 * one place instead of being scattered in small print under each section.
 */
export default function Trust() {
  return (
    <section id="trust" aria-labelledby="trust-heading" className="section-y gutter">
      <div className="grid grid-cols-12 gap-y-[clamp(1.5rem,4vh,2.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p data-reveal className="t-eyebrow text-travertine">
            15 — Before you decide
          </p>
          <h2 id="trust-heading" className="t-display-s mt-6 max-w-[16ch] text-ink">
            What we are, stated plainly.
          </h2>
          <p data-reveal className="mt-6 measure text-ink-dim">
            Anything not listed here has not been confirmed. Ask the concierge or the site office
            and you will get the same answer in both places.
          </p>
        </div>
        <dl className="col-span-12 border-t hair md:col-span-7 md:col-start-6">
          {TRUST.map(({ k, v }) => (
            <div key={k} data-reveal className="grid grid-cols-12 gap-x-4 gap-y-1 border-b hair py-3.5">
              <dt className="t-meta col-span-12 text-ink-faint sm:col-span-4">{k}</dt>
              <dd className="t-meta col-span-12 text-ink sm:col-span-8">{v}</dd>
            </div>
          ))}
          <div className="grid grid-cols-12 gap-x-4 gap-y-1 border-b hair py-3.5">
            <dt className="t-meta col-span-12 text-ink-faint sm:col-span-4">Site office</dt>
            <dd className="t-meta col-span-12 text-ink sm:col-span-8">
              {CONTACT.hours} · {CONTACT.phoneDisplay}
            </dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
