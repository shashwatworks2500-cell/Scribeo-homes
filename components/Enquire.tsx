import Image from "next/image";
import { A } from "@/lib/assets";
import SplitLines from "./SplitLines";

/**
 * Closing statement.
 *
 * TODO(owner): `enquiries@example.com` is a deliberate placeholder. Replace it
 * with the real enquiry address, or point the call to action at a form
 * endpoint. It is left as example.com rather than an invented address so it
 * cannot be mistaken for a working one.
 */
export default function Enquire() {
  return (
    <section id="enquire" aria-labelledby="enq-heading" className="relative">
      <div className="relative min-h-[96svh] w-full overflow-hidden bg-ink film-grain">
        <div data-parallax="4" className="absolute inset-0" style={{ top: "-4%", bottom: "-4%" }}>
          <Image
            src={A.masterReference.src}
            alt=""
            fill
            sizes="100vw"
            quality={84}
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,10,8,0.62) 0%, rgba(11,10,8,0.42) 40%, rgba(11,10,8,0.88) 100%)",
          }}
        />

        <div className="gutter relative flex min-h-[96svh] flex-col justify-end pb-[clamp(3rem,8vh,5.5rem)]">
          <p data-reveal className="t-eyebrow text-travertine/85">
            08 — Enquire
          </p>
          <h2 id="enq-heading" className="t-display-xl mt-[clamp(1rem,3vh,2rem)] max-w-[15ch] text-stone">
            <SplitLines>Come at seven. Stay for the *light*.</SplitLines>
          </h2>

          <div className="mt-[clamp(2.5rem,6vh,4rem)] grid gap-[clamp(1.5rem,4vw,3rem)] border-t hair pt-[clamp(1.5rem,4vh,2.5rem)] md:grid-cols-12">
            <p data-reveal className="measure text-stone-dim md:col-span-5">
              Viewings are arranged privately, one household at a time, early in the day while the
              shadows are still long.
            </p>
            <div data-reveal className="md:col-span-5 md:col-start-8">
              <a
                href="mailto:enquiries@example.com?subject=Scribeo%20Homes%20%E2%80%94%20private%20viewing"
                className="group inline-flex items-baseline gap-4 border-b border-travertine/50 pb-2 transition-colors duration-300 hover:border-travertine"
              >
                <span className="t-display-s text-stone">Arrange a private viewing</span>
                <span
                  aria-hidden="true"
                  className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </a>
              <p className="t-meta mt-4 text-stone-faint">enquiries@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
