import { CONTACT } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="gutter dock-clear border-t hair bg-ground pt-[clamp(2.5rem,6vh,4rem)]">
      <div className="grid grid-cols-12 gap-y-8">
        <div className="col-span-12 md:col-span-4">
          <p className="t-eyebrow text-ink">Scribeo&nbsp;Homes</p>
          <p className="t-meta mt-4 max-w-[26ch] text-ink-faint">
            Contemporary residences set in mature landscape.
          </p>
        </div>

        <div className="col-span-6 md:col-span-3">
          <p className="t-meta text-ink-faint">Enquiries</p>
          <a
            href={CONTACT.phoneHref}
            className="t-display-s mt-3 block text-ink transition-colors hover:text-travertine"
          >
            {CONTACT.phoneDisplay}
          </a>
          <a
            href={CONTACT.emailHref}
            className="t-meta mt-3 block break-all text-ink-dim transition-colors hover:text-travertine"
          >
            {CONTACT.email}
          </a>
        </div>

        <div className="col-span-6 md:col-span-2">
          <p className="t-meta text-ink-faint">Visits</p>
          <p className="t-meta mt-3 max-w-[18ch] text-ink-dim">{CONTACT.hours}</p>
        </div>

        <div className="col-span-12 md:col-span-3">
          <p className="t-meta max-w-[42ch] text-ink-faint">
            All imagery is architectural visualisation of a proposed residential development and
            does not depict a completed building. Floor plans, prices and distances are indicative.
          </p>
        </div>
      </div>
    </footer>
  );
}
