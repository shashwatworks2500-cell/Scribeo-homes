import { CONTACT } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * The last page of the catalogue.
 *
 * A statement at full display size, one thing to do, and then the details in
 * small type underneath — the order a printed brochure closes in, rather than
 * a sitemap with a copyright line.
 */
export default function Footer() {
  return (
    <footer className="gutter dock-clear border-t hair bg-ground pt-[clamp(3rem,9vh,6rem)]">
      <h2 className="t-display-l max-w-[13ch] text-ink">
        <SplitLines>Come at seven. Stay for the *light*.</SplitLines>
      </h2>

      <a
        href="#enquire"
        data-cursor="open"
        className="group mt-[clamp(1.75rem,4vh,2.75rem)] inline-flex items-baseline gap-4 border-b border-travertine/70 pb-2 transition-colors duration-300 hover:border-travertine"
      >
        <span className="t-display-s text-ink">Request a private viewing</span>
        <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </a>

      <div className="mt-[clamp(3rem,8vh,5rem)] grid grid-cols-12 gap-y-9 border-t hair pt-[clamp(1.75rem,4vh,2.5rem)]">
        <div className="col-span-12 md:col-span-4">
          <p className="t-eyebrow text-ink">Scribeo&nbsp;Homes</p>
          <p className="t-meta mt-4 max-w-[26ch] text-ink-faint">
            A contemporary residential development, held within mature landscape.
          </p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="t-meta text-ink-faint">Enquiries</p>
          <a href={CONTACT.phoneHref} className="t-display-s mt-3 block text-ink transition-colors hover:text-travertine">
            {CONTACT.phoneDisplay}
          </a>
          <a href={CONTACT.emailHref} className="t-meta mt-3 block break-all text-ink-dim transition-colors hover:text-travertine">
            {CONTACT.email}
          </a>
        </div>

        <div className="col-span-6 md:col-span-2">
          <p className="t-meta text-ink-faint">Visits</p>
          <p className="t-meta mt-3 max-w-[18ch] text-ink-dim">{CONTACT.hours}</p>
        </div>

        <nav aria-label="Footer" className="col-span-12 md:col-span-3">
          <p className="t-meta text-ink-faint">The page</p>
          <ul className="mt-3 space-y-1.5">
            {[
              ["#landscape", "The landscape"],
              ["#architecture", "Architecture"],
              ["#pricing", "Configurations"],
              ["#residences", "Floor plans"],
              ["#compare", "Compare"],
              ["#amenities", "Amenities"],
              ["#location", "Location"],
              ["#around", "Life around you"],
              ["#trust", "In writing"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="t-meta text-ink-dim transition-colors hover:text-travertine">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="t-meta mt-[clamp(2rem,5vh,3rem)] max-w-[62ch] border-t hair pt-5 text-ink-faint">
        All imagery is architectural visualisation of a proposed residential development and does
        not depict a completed building. Floor plans, prices and distances are indicative and to be
        confirmed on site.
      </p>
    </footer>
  );
}
