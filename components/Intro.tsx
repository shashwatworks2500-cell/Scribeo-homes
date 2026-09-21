import Image from "next/image";
import { INTRO } from "@/lib/story";

/**
 * The visual introduction.
 *
 * Three photographs, three sentences. This replaced five chapters — the
 * landscape, four materials, a day in five hours, six principles and the
 * neighbourhood as a week — which between them made the same argument
 * repeatedly and at length. The pictures make it faster.
 */
export default function Intro() {
  return (
    <section id="about" aria-labelledby="intro-heading" className="section-y">
      <h2 id="intro-heading" className="sr-only">
        The setting, the architecture and the rooms
      </h2>

      <div className="flex flex-col gap-[clamp(3rem,9vh,7rem)]">
        {INTRO.map(({ eyebrow, title, line, asset }, i) => (
          <article
            key={eyebrow}
            className={`gutter grid grid-cols-12 items-center gap-y-7 md:gap-x-[clamp(2rem,5vw,4.5rem)] ${
              i % 2 ? "md:[&>figure]:order-2" : ""
            }`}
          >
            <figure className="col-span-12 md:col-span-7">
              <div data-reveal-clip className="relative aspect-[4/3] overflow-hidden bg-ground-2">
                <Image
                  src={asset.src}
                  alt={asset.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 56vw"
                  quality={84}
                  className="object-cover"
                />
              </div>
            </figure>
            <div className="col-span-12 md:col-span-5">
              <p data-reveal className="t-label text-travertine">
                {eyebrow}
              </p>
              <h3 data-reveal className="t-display-m mt-5 max-w-[16ch] text-ink">
                {title}
              </h3>
              <p data-reveal className="mt-5 measure text-ink-dim">
                {line}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
