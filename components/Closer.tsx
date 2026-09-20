"use client";

import Image from "next/image";
import { A } from "@/lib/assets";
import { CONTACT } from "@/lib/content";

/**
 * The close.
 *
 * One image, one line, one thing to do. Everything on this page has been
 * building an argument that cannot be finished in a browser — the light is
 * the product, and the light has to be stood in.
 *
 * The first draft set the type over the photograph. Measured against the
 * composited backdrop it failed AA at the 11px eyebrow (3.95:1 against 4.5),
 * and washing the image out far enough to fix that left a photograph with
 * nothing in it. So the two are separated: the image runs full bleed and is
 * allowed to be an image, then dissolves into the page, and the type sits on
 * paper where it can be read. Nothing is scrubbed here — this is where the
 * scrolling stops.
 */
export default function Closer() {
  return (
    <section id="visit" aria-labelledby="closer-heading" className="relative bg-ground">
      <div className="relative h-[clamp(15rem,44vh,26rem)] overflow-hidden">
        <Image
          src={A.vLightCorner.src}
          alt={A.vLightCorner.alt}
          fill
          sizes="100vw"
          quality={86}
          className="object-cover"
        />
        {/* The dissolve: the photograph does not stop, it becomes the page. */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-3/5"
          style={{
            background:
              "linear-gradient(to bottom, rgba(251,250,247,0) 0%, rgba(251,250,247,0.55) 52%, var(--color-ground) 100%)",
          }}
        />
      </div>

      <div className="gutter pb-[clamp(3.5rem,10vh,7rem)] pt-[clamp(1.5rem,4vh,3rem)]">
        <div className="grid grid-cols-12 gap-y-8 md:gap-x-[clamp(2rem,5vw,4.5rem)]">
          <div className="col-span-12 md:col-span-7">
            <p data-reveal className="t-eyebrow text-travertine">
              Visit
            </p>
            <h2 id="closer-heading" className="t-display-l mt-6 max-w-[15ch] text-ink">
              Come and stand in the light.
            </h2>
          </div>
          <div className="col-span-12 md:col-span-5 md:self-end">
            <p data-reveal className="measure text-ink-dim">
              Photographs describe a place. An hour on site is the place. Walk the landscape, put
              your hand on the stone, and see where the sun lands at the hour you would actually
              be home.
            </p>
          </div>
        </div>

        <div className="mt-[clamp(2.25rem,6vh,3.5rem)] flex flex-wrap items-center gap-x-8 gap-y-4 border-t hair pt-[clamp(1.5rem,4vh,2.5rem)]">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire"))}
            className="group inline-flex items-baseline gap-3 border-b border-travertine pb-2 transition-colors duration-300"
          >
            <span className="t-display-s text-ink">Request a private viewing</span>
            <span
              aria-hidden="true"
              className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </button>
          <a
            href={CONTACT.phoneHref}
            className="t-meta border-b border-hair pb-1.5 text-ink-dim transition-colors duration-300 hover:border-rule hover:text-ink"
          >
            Or call {CONTACT.phoneDisplay}
          </a>
          <span className="ml-auto">
            <span className="t-meta block text-ink-faint">{CONTACT.hours}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
