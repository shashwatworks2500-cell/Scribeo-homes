import Image from "next/image";
import { HERO } from "@/lib/assets";

/**
 * The hero.
 *
 * One photograph, held for the height of the screen. This replaced a
 * scroll-scrubbed frame sequence: no canvas, no decode engine, no runway to
 * scroll through before the page begins, and nothing for the reader to wait
 * for. The section is exactly one viewport tall, so the first content section
 * begins where the screen ends.
 *
 * `priority` and the matching preload in <head> make this the page's first
 * fetch, and the declared intrinsic size means the space is reserved before a
 * byte of it arrives — the layout never shifts when it lands.
 */
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative flex h-[100svh] flex-col justify-end overflow-hidden bg-ground-2"
    >
      <Image
        src={HERO.src}
        alt={HERO.alt}
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={90}
        className="object-cover"
      />

      {/* Two scrims. The vertical pass seats the navigation at the top and the
          metadata row at the foot; the horizontal pass gives the headline a
          ground to sit on, because the left of the frame is mid-tone foliage
          and lawn where dark-on-dark stops being readable. Composited
          contrast is measured against the rendered pixels, not these values. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(251,250,247,0.72) 0%, rgba(251,250,247,0.14) 26%, rgba(251,250,247,0.42) 62%, rgba(251,250,247,0.97) 100%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(251,250,247,0.90) 0%, rgba(251,250,247,0.70) 30%, rgba(251,250,247,0.36) 50%, rgba(251,250,247,0.08) 70%, rgba(251,250,247,0) 82%)",
        }}
      />

      <div className="relative gutter pb-[clamp(2.5rem,7vh,5rem)]">
        <h1 id="hero-heading" className="t-display-xl max-w-[6.3em] text-ink">
          A place that reveals <em>itself</em> slowly.
        </h1>

        <div className="mt-[clamp(2rem,5vh,3.5rem)] flex items-end justify-between gap-6 border-t hair pt-4">
          <p className="t-meta max-w-[24ch] text-ink-dim">
            Contemporary residences set in mature landscape
          </p>
          <a
            href="#glance"
            className="t-meta group flex items-center gap-3 whitespace-nowrap text-ink-dim transition-colors duration-300 hover:text-ink"
          >
            <span>
              Scroll<span className="hidden sm:inline"> to enter</span>
            </span>
            <span
              aria-hidden="true"
              className="block h-px w-16 origin-left bg-hair transition-transform duration-500 ease-[var(--ease-out-quiet)] group-hover:scale-x-110"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
