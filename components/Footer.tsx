export default function Footer() {
  return (
    <footer className="gutter border-t hair bg-ink py-[clamp(2.5rem,6vh,4rem)]">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="t-eyebrow text-stone">Scribeo&nbsp;Homes</p>
        <p className="t-meta max-w-[46ch] text-stone-faint">
          All imagery on this page is architectural visualisation of a proposed residential
          development. It does not depict a completed building.
        </p>
      </div>
    </footer>
  );
}
