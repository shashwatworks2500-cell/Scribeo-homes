"use client";

import { CONTACT } from "@/lib/content";
import { openSearch } from "@/lib/nav";

/**
 * Footer. Dark and compact: the brand, the five places to go — Residences,
 * Amenities, Location, Search, Enquire — the contact details already in the
 * project, and the qualifications the page relies on. Every link is a
 * 44px target on a phone.
 */
const LINK = "t-meta inline-flex min-h-11 items-center text-on-dark-dim transition-colors duration-200 hover:text-on-dark";

export default function Footer() {
  return (
    <footer className="on-dark dock-clear border-t border-on-dark-hair bg-charcoal text-on-dark">
      <div className="shell gutter pt-[clamp(3rem,7vw,5rem)]">
        <div className="grid gap-y-10 md:grid-cols-12 md:gap-x-[clamp(2rem,4vw,4rem)]">
          <div className="md:col-span-5">
            <p className="t-eyebrow text-on-dark">Scribeo Homes</p>
            <p className="t-meta mt-4 max-w-[30ch] text-on-dark-dim">
              Contemporary low-rise residences surrounded by greenery.
            </p>
          </div>

          <nav aria-label="Footer" className="md:col-span-3">
            <p className="t-label text-on-dark-faint">The page</p>
            <ul className="mt-2">
              {[
                ["#residences", "Residences"],
                ["#amenities", "Amenities"],
                ["#location", "Location"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className={LINK}>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <button type="button" onClick={openSearch} className={LINK}>
                  Search
                </button>
              </li>
              <li>
                <a href="#enquire" className={LINK}>
                  Enquire
                </a>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="t-label text-on-dark-faint">Site office</p>
            <ul className="mt-2">
              <li>
                <a href={CONTACT.phoneHref} className={`${LINK} text-on-dark`}>
                  {CONTACT.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={CONTACT.emailHref} className={`${LINK} text-on-dark`}>
                  {CONTACT.email}
                </a>
              </li>
            </ul>
            <p className="t-meta mt-2 max-w-[28ch] text-on-dark-dim">{CONTACT.hours}</p>
          </div>
        </div>

        <p className="t-meta mt-[clamp(2.5rem,6vw,3.5rem)] max-w-[80ch] border-t border-on-dark-hair pt-6 text-on-dark-faint">
          Imagery is architectural visualisation of a proposed residential development and does not depict a completed
          building. Plans are indicative and not to scale; dimensions are nominal. Prices are indicative and exclusive of
          duty, registration and taxes. Distances are measured by road and to be confirmed on site. Approvals,
          construction status and possession are available from the site office.
        </p>
        <p suppressHydrationWarning className="t-meta mt-3 pb-[clamp(1.5rem,4vw,2.5rem)] text-on-dark-faint">
          © {new Date().getFullYear()} Scribeo Homes
        </p>
      </div>
    </footer>
  );
}
