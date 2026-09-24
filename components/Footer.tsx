"use client";

import { CONTACT } from "@/lib/content";

/**
 * Footer.
 *
 * Dark, compact, and it does not ask again — the section above already
 * asked. Brand, the five places to go, the contact details already in the
 * project, and the qualifications the page relies on.
 */
const LINKS: [string, string][] = [
  ["#residences", "Residences"],
  ["#amenities", "Amenities"],
  ["#location", "Location"],
  ["#enquire", "Enquire"],
];

export default function Footer() {
  return (
    <footer className="on-dark dock-clear bg-charcoal pt-[clamp(3rem,8vh,5rem)] text-ground">
      <div className="shell gutter">
        <div className="grid grid-cols-12 gap-y-9 md:gap-x-[clamp(2rem,5vw,4rem)]">
          <div className="col-span-12 md:col-span-5">
            <p className="t-display-s text-ground">Scribeo Homes</p>
            <p className="t-meta mt-3 max-w-[26ch] text-on-dark-dim">
              Contemporary low-rise residences surrounded by greenery.
            </p>
          </div>

          <div className="col-span-6 md:col-span-3">
            <p className="t-label text-on-dark-faint">Site office</p>
            <a href={CONTACT.phoneHref} className="t-meta mt-3 block min-h-11 text-ground transition-colors hover:text-travertine">
              {CONTACT.phoneDisplay}
            </a>
            <a href={CONTACT.emailHref} className="t-meta block min-h-11 text-ground transition-colors hover:text-travertine">
              {CONTACT.email}
            </a>
            <p className="t-meta mt-1 max-w-[22ch] text-on-dark-dim">{CONTACT.hours}</p>
          </div>

          <nav aria-label="Footer" className="col-span-6 md:col-span-4">
            <p className="t-label text-on-dark-faint">The page</p>
            <ul className="mt-3">
              {LINKS.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="t-meta flex min-h-11 items-center text-on-dark-dim transition-colors hover:text-ground">
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("scribeo:search"))}
                  className="t-meta flex min-h-11 items-center text-on-dark-dim transition-colors hover:text-ground"
                >
                  Search
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <p className="t-meta mt-[clamp(2.5rem,6vh,3.5rem)] max-w-[72ch] border-t border-[rgba(244,242,237,0.14)] pt-6 text-on-dark-faint">
          Imagery is architectural visualisation of a proposed residential development and does not
          depict a completed building. Plans are indicative and not to scale; dimensions are nominal.
          Prices and distances are indicative and exclusive of duty, registration and taxes.
          Approvals, construction status and possession are available from the site office.
        </p>
        <p className="t-meta mt-4 pb-[clamp(1.5rem,4vh,2.5rem)] text-on-dark-faint">
          © {new Date().getFullYear()} Scribeo Homes
        </p>
      </div>
    </footer>
  );
}
