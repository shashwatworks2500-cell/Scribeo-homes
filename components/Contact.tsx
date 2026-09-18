"use client";

import { useId, useState } from "react";
import Image from "next/image";
import { A } from "@/lib/assets";
import { CONFIGS, CONTACT } from "@/lib/content";
import SplitLines from "./SplitLines";

/**
 * Enquiry.
 *
 * There is no backend on this deployment, so the form composes a properly
 * addressed email and hands it to the visitor's mail client. That is a real,
 * working route to the site office rather than a button that silently does
 * nothing — and the phone number and address sit beside it for anyone who
 * would rather not use a form at all.
 *
 * TODO(owner): to capture enquiries server-side instead, POST `body` from
 * onSubmit to an API route or form service and drop the mailto fallback.
 */
export default function Contact() {
  const uid = useId();
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const config = String(fd.get("config") || "").trim();
    const message = String(fd.get("message") || "").trim();

    if (!name || !phone) {
      setErr("Please give a name and a phone number so someone can reply.");
      return;
    }
    setErr(null);

    const body = [
      `Name: ${name}`,
      `Phone: ${phone}`,
      email ? `Email: ${email}` : null,
      config ? `Interested in: ${config}` : null,
      "",
      message || "(no message)",
      "",
      "— sent from the Scribeo Homes website",
    ]
      .filter(Boolean)
      .join("\n");

    const href =
      `${CONTACT.emailHref}?subject=${encodeURIComponent(`Scribeo Homes enquiry — ${name}`)}` +
      `&body=${encodeURIComponent(body)}`;
    window.location.href = href;
    setSent(true);
  };

  const field =
    "mt-2 w-full border-b border-hair bg-transparent pb-2.5 text-stone outline-none transition-colors placeholder:text-stone-faint focus:border-travertine";

  return (
    <section id="enquire" aria-labelledby="enq-heading" className="relative">
      <div className="relative overflow-hidden bg-ink film-grain">
        <div data-parallax="4" className="absolute inset-0" style={{ top: "-4%", bottom: "-4%" }}>
          <Image src={A.masterReference.src} alt="" fill sizes="100vw" quality={82} className="object-cover" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(11,10,8,0.72) 0%, rgba(11,10,8,0.88) 45%, rgba(11,10,8,0.96) 100%)",
          }}
        />

        <div className="gutter section-y relative">
          <div className="grid grid-cols-12 gap-[clamp(2rem,5vw,4.5rem)]">
            <div className="col-span-12 md:col-span-5">
              <p data-reveal className="t-eyebrow text-travertine/85">
                09 — Enquire
              </p>
              <h2 id="enq-heading" className="t-display-l mt-6 max-w-[14ch] text-stone">
                <SplitLines>Come at seven. Stay for the *light*.</SplitLines>
              </h2>
              <p data-reveal className="mt-8 measure text-stone-dim">
                Viewings are arranged privately, one household at a time, early in the day while
                the shadows are still long.
              </p>

              <dl className="mt-[clamp(2rem,5vh,3rem)] border-t hair">
                <div className="flex items-baseline justify-between gap-4 border-b hair py-4">
                  <dt className="t-meta text-stone-faint">Phone</dt>
                  <dd>
                    <a
                      href={CONTACT.phoneHref}
                      className="t-display-s text-stone transition-colors hover:text-travertine"
                    >
                      {CONTACT.phoneDisplay}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b hair py-4">
                  <dt className="t-meta text-stone-faint">Email</dt>
                  <dd>
                    <a
                      href={CONTACT.emailHref}
                      className="t-meta break-all text-stone transition-colors hover:text-travertine"
                    >
                      {CONTACT.email}
                    </a>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b hair py-4">
                  <dt className="t-meta text-stone-faint">Visits</dt>
                  <dd className="t-meta max-w-[22ch] text-right text-stone-dim">{CONTACT.hours}</dd>
                </div>
              </dl>
            </div>

            <div className="col-span-12 md:col-span-6 md:col-start-7">
              <form onSubmit={onSubmit} noValidate className="grid gap-[clamp(1.25rem,3vh,1.75rem)]">
                <div>
                  <label htmlFor={`${uid}-name`} className="t-meta text-stone-faint">
                    Name <span aria-hidden="true">*</span>
                  </label>
                  <input id={`${uid}-name`} name="name" required autoComplete="name" className={field} placeholder="Your name" />
                </div>

                <div className="grid gap-[clamp(1.25rem,3vh,1.75rem)] sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${uid}-phone`} className="t-meta text-stone-faint">
                      Phone <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id={`${uid}-phone`}
                      name="phone"
                      required
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      className={field}
                      placeholder="Mobile number"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${uid}-email`} className="t-meta text-stone-faint">
                      Email
                    </label>
                    <input
                      id={`${uid}-email`}
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={field}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={`${uid}-config`} className="t-meta text-stone-faint">
                    Interested in
                  </label>
                  <select id={`${uid}-config`} name="config" className={`${field} appearance-none`} defaultValue="">
                    <option value="" className="bg-ink">
                      Any configuration
                    </option>
                    {CONFIGS.map((c) => (
                      <option key={c.id} value={`${c.bhk} — ${c.label}`} className="bg-ink">
                        {c.bhk} — {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor={`${uid}-message`} className="t-meta text-stone-faint">
                    Message
                  </label>
                  <textarea
                    id={`${uid}-message`}
                    name="message"
                    rows={3}
                    className={`${field} resize-y`}
                    placeholder="A question, or a time that suits you for a visit"
                  />
                </div>

                {err ? (
                  <p role="alert" className="t-meta text-travertine">
                    {err}
                  </p>
                ) : null}

                <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                  <button
                    type="submit"
                    className="group inline-flex items-baseline gap-4 border-b border-travertine/60 pb-2 transition-colors duration-300 hover:border-travertine"
                  >
                    <span className="t-display-s text-stone">Send enquiry</span>
                    <span
                      aria-hidden="true"
                      className="t-meta text-travertine transition-transform duration-300 group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </button>
                  <p className="t-meta text-stone-faint">Opens your email app</p>
                </div>

                <p aria-live="polite" className="t-meta text-stone-dim">
                  {sent
                    ? `Your email app should now be open with the enquiry ready to send. If nothing happened, write to ${CONTACT.email} or call ${CONTACT.phoneDisplay}.`
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
