"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS, CONTACT } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Request a private viewing.
 *
 * A single form with five fields asks a stranger to commit before they have
 * decided anything. Three short questions do not: what you are looking for,
 * when you can come, and who to call. The answers to the first two are taps,
 * and only the last step asks anyone to type.
 *
 * It degrades honestly. With JavaScript off, every field of every step is in
 * the DOM inside one <form> that posts by mailto, so the whole enquiry is
 * still submittable — the steps are a way of asking, not a gate.
 */
const TIMES = ["Morning, 7:00 – 11:00", "Evening, 16:00 – 19:00", "Either suits me"] as const;
const STEPS = ["What are you looking for?", "When would you like to come?", "Who shall we call?"] as const;

export default function Contact() {
  const uid = useId();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const headingRef = useRef<HTMLParagraphElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  /* The floor plan section asks for a viewing of a specific plan. Arriving
     with that answer already given means step one is done. */
  useEffect(() => {
    const onAsk = (e: Event) => {
      const c = (e as CustomEvent<{ config?: string }>).detail?.config;
      if (c) {
        setConfig(c);
        setStep(1);
      }
      document.querySelector("#enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("scribeo:enquire", onAsk);
    return () => window.removeEventListener("scribeo:enquire", onAsk);
  }, []);

  const go = useCallback((next: number) => {
    setStep(next);
    setErr("");
    // Moving between questions is a change of context, so say so.
    requestAnimationFrame(() => headingRef.current?.focus());
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const phone = String(f.get("phone") ?? "").trim();
    if (!name || !phone) {
      setErr("A name and a phone number are all we need to call you back.");
      return;
    }
    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      f.get("email") ? `Email: ${f.get("email")}` : null,
      `Looking for: ${config || "Not sure yet"}`,
      `Preferred visit: ${time || "No preference"}`,
      f.get("message") ? `\n${f.get("message")}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    window.location.href = `${CONTACT.emailHref}?subject=${encodeURIComponent(
      "Private viewing — Scribeo Homes",
    )}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };

  const chip = (on: boolean) =>
    `t-meta border px-4 py-2.5 text-left transition-colors duration-300 ${
      on ? "border-travertine bg-travertine text-ground" : "border-rule text-ink-dim hover:border-travertine hover:text-ink"
    }`;
  const field =
    "mt-2 w-full border-b border-rule bg-transparent pb-2.5 text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-travertine";

  return (
    <section id="enquire" aria-labelledby="enq-heading" className="relative scroll-mt-24">
      <div className="relative overflow-hidden bg-ground film-grain">
        <div data-parallax="4" className="absolute inset-0" style={{ top: "-4%", bottom: "-4%" }}>
          <Image src={A.masterReference.src} alt="" fill sizes="100vw" quality={82} className="object-cover" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(251,250,247,0.80) 0%, rgba(251,250,247,0.94) 45%, rgba(251,250,247,0.985) 100%)",
          }}
        />

        <div className="gutter section-y relative">
          <div className="grid grid-cols-12 gap-y-[clamp(2rem,5vw,4.5rem)] md:gap-x-[clamp(2rem,5vw,4.5rem)]">
            <div className="col-span-12 md:col-span-5">
              <p data-reveal className="t-eyebrow text-travertine">
                16 — Private viewing
              </p>
              <h2 id="enq-heading" className="t-display-l mt-6 max-w-[14ch] text-ink">
                <SplitLines>Come at seven. Stay for the *light*.</SplitLines>
              </h2>
              <p data-reveal className="mt-8 measure text-ink-dim">
                Visit the residences, walk the landscape and see the light in person. Viewings are
                arranged privately, one household at a time, early in the day while the shadows are
                still long.
              </p>
              <dl className="mt-[clamp(2rem,5vh,3rem)] border-t hair">
                {[
                  ["Phone", CONTACT.phoneDisplay, CONTACT.phoneHref],
                  ["Email", CONTACT.email, CONTACT.emailHref],
                  ["Visits", CONTACT.hours, null],
                ].map(([k, v, href]) => (
                  <div key={k as string} className="flex justify-between gap-6 border-b hair py-3.5">
                    <dt className="t-meta text-ink-faint">{k}</dt>
                    <dd className="t-meta text-right text-ink">
                      {href ? (
                        <a href={href as string} className="transition-colors hover:text-travertine">
                          {v}
                        </a>
                      ) : (
                        v
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <form ref={formRef} onSubmit={onSubmit} noValidate>
                <div className="flex items-baseline justify-between gap-6 border-b hair pb-4">
                  <p
                    ref={headingRef}
                    tabIndex={-1}
                    aria-live="polite"
                    className="t-display-s text-ink outline-none"
                  >
                    {STEPS[step]}
                  </p>
                  <p className="t-numeral shrink-0 text-ink-faint">
                    {String(step + 1).padStart(2, "0")} / 03
                  </p>
                </div>
                {/* Progress as a rule that fills, not a bar that decorates. */}
                <span aria-hidden="true" className="mt-px block h-px w-full bg-hair">
                  <span
                    className="block h-px origin-left bg-travertine transition-transform duration-500 ease-[var(--ease-out-quiet)]"
                    style={{ transform: `scaleX(${(step + 1) / 3})` }}
                  />
                </span>

                <div className="mt-[clamp(1.5rem,4vh,2.25rem)]">
                  {/* Step 1 */}
                  <fieldset className={step === 0 ? "" : "hidden"}>
                    <legend className="sr-only">What are you looking for?</legend>
                    <div className="flex flex-wrap gap-2">
                      {[...CONFIGS.map((c) => c.bhk), "Not sure yet"].map((c) => (
                        <button key={c} type="button" onClick={() => { setConfig(c); go(1); }} className={chip(config === c)}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Step 2 */}
                  <fieldset className={step === 1 ? "" : "hidden"}>
                    <legend className="sr-only">When would you like to come?</legend>
                    <div className="flex flex-wrap gap-2">
                      {TIMES.map((t) => (
                        <button key={t} type="button" onClick={() => { setTime(t); go(2); }} className={chip(time === t)}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  {/* Step 3. Always in the DOM so a browser without JS can fill
                      and submit the whole thing in one pass. */}
                  <div className={step === 2 ? "" : "hidden js-only-hidden"}>
                    <div className="grid gap-[clamp(1.25rem,3vh,1.75rem)]">
                      <div>
                        <label htmlFor={`${uid}-name`} className="t-meta text-ink-faint">
                          Name <span aria-hidden="true">*</span>
                        </label>
                        <input id={`${uid}-name`} name="name" required autoComplete="name" className={field} placeholder="Your name" />
                      </div>
                      <div className="grid gap-[clamp(1.25rem,3vh,1.75rem)] sm:grid-cols-2">
                        <div>
                          <label htmlFor={`${uid}-phone`} className="t-meta text-ink-faint">
                            Phone <span aria-hidden="true">*</span>
                          </label>
                          <input id={`${uid}-phone`} name="phone" required type="tel" inputMode="tel" autoComplete="tel" className={field} placeholder="Mobile number" />
                        </div>
                        <div>
                          <label htmlFor={`${uid}-email`} className="t-meta text-ink-faint">
                            Email
                          </label>
                          <input id={`${uid}-email`} name="email" type="email" autoComplete="email" className={field} placeholder="Optional" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor={`${uid}-message`} className="t-meta text-ink-faint">
                          Anything else
                        </label>
                        <textarea id={`${uid}-message`} name="message" rows={2} className={`${field} resize-y`} placeholder="A question, or a time that suits you" />
                      </div>
                    </div>

                    {err ? (
                      <p role="alert" className="t-meta mt-5 text-travertine">
                        {err}
                      </p>
                    ) : null}

                    <div className="mt-[clamp(1.5rem,4vh,2.25rem)] flex flex-wrap items-center gap-x-6 gap-y-3">
                      <button type="submit" className="group inline-flex items-baseline gap-4 border-b border-travertine/70 pb-2 transition-colors duration-300 hover:border-travertine">
                        <span className="t-display-s text-ink">Request the viewing</span>
                        <span aria-hidden="true" className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </button>
                      <p className="t-meta text-ink-faint">Opens your email app</p>
                    </div>
                  </div>
                </div>

                {/* A summary of what has been answered, and a way back to change it. */}
                {step > 0 ? (
                  <div className="mt-[clamp(1.5rem,4vh,2.25rem)] flex flex-wrap items-center gap-x-5 gap-y-2 border-t hair pt-4">
                    <button type="button" onClick={() => go(step - 1)} className="t-meta text-ink-dim transition-colors hover:text-ink">
                      ← Back
                    </button>
                    {config ? <span className="t-meta text-ink-faint">Looking for: <span className="text-ink">{config}</span></span> : null}
                    {time ? <span className="t-meta text-ink-faint">Visit: <span className="text-ink">{time}</span></span> : null}
                  </div>
                ) : null}

                <p aria-live="polite" className="t-meta mt-5 text-ink-dim">
                  {sent
                    ? `Your email app should now be open with the request ready to send. If nothing happened, write to ${CONTACT.email} or call ${CONTACT.phoneDisplay}.`
                    : ""}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
