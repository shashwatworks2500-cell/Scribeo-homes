import { CONTACT } from "@/lib/content";

/**
 * Minimal footer.
 *
 * The visit section directly above already asks for the appointment, so this
 * does not ask again. Contact details, four links, the qualifications, and
 * nothing else — the closing statement and the second call to action that
 * used to live here were the same request made twice in a row.
 */
const LINKS: [string, string][] = [
  ["#residences", "Residences"],
  ["#plans", "Floor plans"],
  ["#amenities", "Amenities"],
  ["#location", "Location"],
  ["#specifications", "Specifications"],
  ["#faq", "Questions"],
];

export default function Footer() {
  return (
    <footer className="gutter dock-clear border-t hair bg-ground-2 pt-[clamp(2.5rem,7vh,4rem)]">
      <div className="grid grid-cols-12 gap-y-9 md:gap-x-[clamp(2rem,5vw,4rem)]">
        <div className="col-span-12 md:col-span-4">
          <p className="t-display-s text-ink">Scribeo Homes</p>
          <p className="t-meta mt-3 max-w-[24ch] text-ink-dim">
            Contemporary low-rise residences surrounded by greenery.
          </p>
        </div>

        <div className="col-span-6 md:col-span-4">
          <p className="t-label text-ink-faint">Site office</p>
          <a
            href={CONTACT.phoneHref}
            className="t-meta mt-3 block text-ink transition-colors hover:text-travertine"
          >
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={CONTACT.emailHref}
            className="t-meta block text-ink transition-colors hover:text-travertine"
          >
            {CONTACT.email}
          </a>
          <p className="t-meta mt-2 max-w-[22ch] text-ink-dim">{CONTACT.hours}</p>
        </div>

        <nav aria-label="Footer" className="col-span-6 md:col-span-4">
          <p className="t-label text-ink-faint">The page</p>
          <ul className="mt-3 space-y-1">
            {LINKS.map(([href, label]) => (
              <li key={href}>
                <a href={href} className="t-meta text-ink-dim transition-colors hover:text-travertine">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className="t-meta mt-[clamp(2rem,5vh,3rem)] max-w-[70ch] border-t hair pt-5 text-ink-faint">
        Imagery is architectural visualisation of a proposed residential development and does not
        depict a completed building. Plans are indicative and not to scale; dimensions are nominal.
        Prices and distances are indicative and exclusive of duty, registration and taxes. Approvals,
        construction status and possession are available from the site office.
      </p>
      <p className="t-meta mt-4 pb-[clamp(1.5rem,4vh,2.5rem)] text-ink-faint">
        © {new Date().getFullYear()} Scribeo Homes
      </p>
    </footer>
  );
}
