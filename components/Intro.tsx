import Image from "next/image";
import { INTRO } from "@/lib/story";

/**
 * Three editorial moments, three compositions — so the rhythm changes as the
 * reader moves rather than repeating one two-column block.
 *
 *   01 The setting       60% photograph, 40% text.
 *   02 The architecture  inverted: 40% text, 60% photograph.
 *   03 Inside            a full-width picture. Its right third is the dark
 *                        interior wall, so on a wide screen the words sit
 *                        there, on the photograph's own shadow; on a phone
 *                        that wall is cropped away and they sit beneath it.
 */
function Words({ eyebrow, title, line, id }: { eyebrow: string; title: string; line: string; id: string }) {
  return (
    <div data-reveal>
      <p className="t-label text-accent">{eyebrow}</p>
      <h2 id={id} className="t-major mt-5 max-w-[13ch] text-ink md:mt-6">
        {title}
      </h2>
      <p className="t-body measure mt-6 text-ink-dim md:mt-7">{line}</p>
    </div>
  );
}

export default function Intro() {
  const [setting, architecture, inside] = INTRO;

  return (
    <>
      <section id="setting" aria-labelledby="setting-heading" className="section-y">
        <div className="shell gutter grid items-center gap-y-9 lg:grid-cols-[3fr_2fr] lg:gap-x-[clamp(3rem,6vw,6.5rem)]">
          <figure data-reveal-clip className="relative aspect-[4/5] overflow-hidden bg-ground-2 lg:aspect-[5/6]">
            <Image
              src={setting.asset.src}
              alt={setting.asset.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={84}
              className="object-cover"
            />
          </figure>
          <Words id="setting-heading" {...setting} />
        </div>
      </section>

      <section id="architecture" aria-labelledby="architecture-heading" className="pb-[clamp(4.5rem,18vw,6.875rem)] lg:pb-[clamp(7.5rem,9vw,9.5rem)]">
        <div className="shell gutter grid items-center gap-y-9 lg:grid-cols-[2fr_3fr] lg:gap-x-[clamp(3rem,6vw,6.5rem)]">
          <figure data-reveal-clip className="relative aspect-[4/3] overflow-hidden bg-ground-2 lg:order-2">
            <Image
              src={architecture.asset.src}
              alt={architecture.asset.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={84}
              className="object-cover"
            />
          </figure>
          <div className="lg:order-1">
            <Words id="architecture-heading" {...architecture} />
          </div>
        </div>
      </section>

      <section id="inside" aria-labelledby="inside-heading" className="relative pb-[clamp(4.5rem,18vw,6.875rem)] lg:pb-0">
        <figure className="relative aspect-[4/5] overflow-hidden bg-charcoal sm:aspect-[16/10] lg:aspect-auto lg:h-[88vh] lg:min-h-[36rem]">
          <div data-parallax="5" className="absolute inset-x-0 -inset-y-[6%]">
            <Image
              src={inside.asset.src}
              alt={inside.asset.alt}
              fill
              sizes="100vw"
              quality={84}
              className="object-cover object-[42%_50%] lg:object-center"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden lg:block"
            style={{ background: "linear-gradient(270deg, rgba(23,23,23,0.5) 0%, rgba(23,23,23,0.22) 34%, rgba(23,23,23,0) 56%)" }}
          />
        </figure>
        <div className="shell gutter mt-9 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-end lg:justify-end lg:pb-[clamp(3.5rem,9vh,6rem)]">
          <div data-reveal className="lg:w-[min(30rem,34vw)]">
            <p className="t-label text-accent lg:text-on-dark-dim">{inside.eyebrow}</p>
            <h2 id="inside-heading" className="t-major mt-5 max-w-[13ch] text-ink md:mt-6 lg:text-on-dark">
              {inside.title}
            </h2>
            <p className="t-body measure mt-6 text-ink-dim md:mt-7 lg:text-on-dark-dim">{inside.line}</p>
          </div>
        </div>
      </section>
    </>
  );
}
