"use client";

import { CONTACT } from "@/lib/content";

/**
 * The final conversion section.
 *
 * Charcoal, warm white type, one large statement and two actions. No cards,
 * no statistics, no decoration — the quiet last page of a brochure. It sits
 * immediately above the enquiry form it sends you to.
 */
export default function Closer() {
  return (
    <section
      id="visit"
      aria-labelledby="closer-heading"
      className="on-dark section-y-lg bg-charcoal text-ground"
    >
      <div className="shell gutter">
        <p className="t-label text-on-dark-faint">Visit</p>
        <h2 id="closer-heading" className="t-display-l mt-7 max-w-[16ch] text-ground">
          Come and stand in the light.
        </h2>
        <p className="t-body mt-7 max-w-[40ch] text-on-dark-dim">
          Photographs describe a place. An hour on site is the place. Walk the landscape, and see
          where the sun lands at the hour you would actually be home.
        </p>

        <div className="mt-[clamp(2.5rem,7vh,4rem)] flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire"))}
          >
            Book a Site Visit
          </button>
          <a href="#enquire" className="btn btn-secondary">
            Enquire
          </a>
        </div>

        <p className="t-meta mt-8 text-on-dark-faint">{CONTACT.hours}</p>
      </div>
    </section>
  );
}
