"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Icon from "./Icon";
import { CONFIGS, CONTACT } from "@/lib/content";
import { goTo } from "@/lib/nav";

/**
 * The final conversion section — #enquire.
 *
 * Charcoal, warm white type, one large statement, and the two actions: Book
 * a Site Visit, which is the form beside it, and Enquire, which writes to
 * the site office. No cards, no statistics.
 *
 * The form asks exactly what a visit needs — configuration, preferred date,
 * name, phone, email — and every state is visible:
 *
 *   idle        the fields, ready
 *   focus       the underline brightens and the label lifts to full white
 *   error       each problem named under its field, focus on the first
 *   submitting  the button holds and says it is opening your email app
 *   success     the email app took the request — what was sent, and what next
 *   failure     nothing opened — call, write, or copy the request instead
 *
 * The request is sent from the visitor's own email app (there is no server
 * behind this site), so "submitted" is judged by the page losing focus to
 * that app within two seconds. If it does not, the failure state says so
 * plainly and offers the other routes, rather than claiming a success.
 *
 * With scripting off the fields still render, and the action becomes a
 * direct link to write to the site office. (A mailto form action would do
 * the same job, but browsers flag it as an insecure form target on HTTPS.)
 */
type Status = "idle" | "submitting" | "success" | "failed";
type Errors = Partial<Record<"config" | "date" | "name" | "phone" | "email", string>>;

const OPTIONS = [...CONFIGS.map((c) => c.bhk), "Not sure yet"];

function compose(f: Record<string, string>) {
  return [
    `Name: ${f.name}`,
    `Phone: ${f.phone}`,
    `Email: ${f.email}`,
    `Looking for: ${f.config}`,
    `Preferred date: ${f.date}`,
  ].join("\n");
}

const mailto = (body: string) =>
  `${CONTACT.emailHref}?subject=${encodeURIComponent("Site visit request — Scribeo Homes")}&body=${encodeURIComponent(body)}`;

function validate(f: Record<string, string>): Errors {
  const e: Errors = {};
  if (!f.config) e.config = "Choose a configuration, or “Not sure yet”.";
  if (!f.date) e.date = "Choose a date for your visit.";
  if (!f.name.trim()) e.name = "Tell us your name.";
  if ((f.phone.match(/\d/g) ?? []).length < 10) e.phone = "Add a phone number with at least 10 digits.";
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) e.email = "Check the email address — it needs an @ and a domain.";
  return e;
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group">
      <label htmlFor={id} className="t-label text-on-dark-dim transition-colors duration-200 group-focus-within:text-on-dark">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="t-meta mt-2 flex items-center gap-2 text-on-dark-error">
          <Icon name="alert" className="h-4 w-4" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function Contact() {
  const uid = useId();
  const [config, setConfig] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<Record<string, string> | null>(null);
  const [copied, setCopied] = useState(false);
  const [minDate, setMinDate] = useState<string | undefined>(undefined);
  const [js, setJs] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  /* Tomorrow, computed on the device so it is the visitor's tomorrow and the
     server render never disagrees with the client about what day it is. */
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    const p = (n: number) => String(n).padStart(2, "0");
    setMinDate(`${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`);
    setJs(true);
  }, []);

  /* "Book a Site Visit" and "Request This Plan" anywhere on the page land
     here, with the configuration already chosen when they know it. */
  useEffect(() => {
    const onAsk = (e: Event) => {
      const c = (e as CustomEvent<{ config?: string }>).detail?.config;
      if (c) setConfig(c);
      setStatus((s) => (s === "success" || s === "failed" ? "idle" : s));
      goTo("#book", { record: false });
      if (location.hash !== "#enquire") history.pushState(null, "", "#enquire");
      window.setTimeout(() => {
        const target = formRef.current?.querySelector<HTMLElement>(c ? "input[name='name']" : "input[name='config']");
        target?.focus({ preventScroll: true });
      }, 700);
    };
    window.addEventListener("scribeo:enquire", onAsk);
    return () => window.removeEventListener("scribeo:enquire", onAsk);
  }, []);

  const read = (): Record<string, string> => {
    const f = new FormData(formRef.current!);
    const g = (k: string) => String(f.get(k) ?? "");
    return { config: g("config"), date: g("date"), name: g("name").trim(), phone: g("phone").trim(), email: g("email").trim() };
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const f = read();
    const errs = validate(f);
    setErrors(errs);
    const first = (Object.keys(errs) as (keyof Errors)[])[0];
    if (first) {
      formRef.current?.querySelector<HTMLElement>(`[name='${first}']`)?.focus();
      return;
    }

    setStatus("submitting");
    setSent(f);
    setCopied(false);

    /* Hand-off to the email app. If the page loses focus or is hidden inside
       two seconds, the app took it; otherwise it did not open. */
    let done = false;
    const finish = (ok: boolean) => {
      if (done) return;
      done = true;
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onLeave);
      window.clearTimeout(timer);
      setStatus(ok ? "success" : "failed");
      requestAnimationFrame(() => resultRef.current?.focus({ preventScroll: true }));
    };
    const onLeave = () => finish(true);
    const onHide = () => document.visibilityState === "hidden" && finish(true);
    window.addEventListener("blur", onLeave);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onLeave);
    const timer = window.setTimeout(() => finish(false), 2000);
    window.location.href = mailto(compose(f));
  };

  const copy = useCallback(async () => {
    if (!sent) return;
    try {
      await navigator.clipboard.writeText(`To: ${CONTACT.email}\nSubject: Site visit request — Scribeo Homes\n\n${compose(sent)}`);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }, [sent]);

  const input =
    "t-body mt-2 block min-h-12 w-full rounded-none border-0 border-b bg-transparent pb-2 text-on-dark outline-none transition-colors duration-200 placeholder:text-on-dark-faint focus:border-on-dark focus-visible:outline-none [color-scheme:dark]";
  const line = (bad?: string) => (bad ? "border-on-dark-error" : "border-on-dark-faint");
  const describe = (k: keyof Errors) => (errors[k] ? `${uid}-${k}-error` : undefined);

  return (
    <section id="enquire" aria-labelledby="enq-heading" className="on-dark section-y-lg bg-charcoal text-on-dark">
      <div className="shell gutter grid gap-y-14 lg:grid-cols-12 lg:gap-x-[clamp(2rem,4vw,4rem)]">
        <div className="lg:col-span-5">
          <p className="t-label text-on-dark-dim">Visit</p>
          <h2 id="enq-heading" className="t-major mt-6 max-w-[12ch] text-on-dark">
            Come and stand in the light.
          </h2>
          <p className="t-body mt-7 max-w-[38ch] text-on-dark-dim">
            Photographs describe a place. An hour on site is the place. Walk the landscape, and see where the sun
            lands at the hour you would actually be home.
          </p>

          <dl className="mt-10 border-t border-on-dark-hair">
            {[
              ["Phone", CONTACT.phoneDisplay, CONTACT.phoneHref],
              ["Email", CONTACT.email, CONTACT.emailHref],
              ["Visits", CONTACT.hours.replace(/^Site visits d/, "D"), null],
            ].map(([k, v, href]) => (
              <div key={k as string} className="flex min-h-14 items-center justify-between gap-6 border-b border-on-dark-hair py-2">
                <dt className="t-label text-on-dark-dim">{k}</dt>
                <dd className="t-meta text-right text-on-dark">
                  {href ? (
                    <a href={href as string} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                      {v}
                    </a>
                  ) : (
                    v
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <a
            href={`${CONTACT.emailHref}?subject=${encodeURIComponent("Enquiry — Scribeo Homes")}`}
            className="btn btn-secondary mt-8"
          >
            Enquire
            <Icon name="arrow-right" className="arrow h-4 w-4" />
          </a>
        </div>

        <div id="book" className="scroll-mt-24 lg:col-span-6 lg:col-start-7">
          <h3 className="t-sub text-on-dark">Book a Site Visit</h3>

          {status === "success" && sent ? (
            <div ref={resultRef} tabIndex={-1} role="status" className="mt-8 border-t border-on-dark-hair pt-8 outline-none">
              <p className="flex items-center gap-3 text-on-dark">
                <span className="grid h-9 w-9 place-items-center rounded-[6px] bg-on-dark text-ink">
                  <Icon name="check" className="h-4 w-4" />
                </span>
                <span className="t-value">Your request is in your email app.</span>
              </p>
              <p className="t-body mt-5 text-on-dark-dim">
                Send it, and the site office will reply to confirm a time on {sent.date}. Nothing arrived in your email
                app? Call {CONTACT.phoneDisplay}.
              </p>
              <dl className="mt-6 border-t border-on-dark-hair">
                {[
                  ["Looking for", sent.config],
                  ["Preferred date", sent.date],
                  ["Name", sent.name],
                  ["Phone", sent.phone],
                  ["Email", sent.email],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 border-b border-on-dark-hair py-3">
                    <dt className="t-meta text-on-dark-dim">{k}</dt>
                    <dd className="t-meta text-right text-on-dark">{v}</dd>
                  </div>
                ))}
              </dl>
              <button type="button" onClick={() => setStatus("idle")} className="btn-text mt-5">
                Change the details
                <Icon name="arrow-right" className="arrow h-4 w-4" />
              </button>
            </div>
          ) : null}

          {status === "failed" && sent ? (
            <div ref={resultRef} tabIndex={-1} role="alert" className="mt-8 border-t border-on-dark-hair pt-8 outline-none">
              <p className="flex items-center gap-3 text-on-dark">
                <Icon name="alert" className="h-6 w-6 text-on-dark-error" />
                <span className="t-value">Your email app didn’t open.</span>
              </p>
              <p className="t-body mt-5 text-on-dark-dim">
                The request is ready — send it another way. Call the site office, write to them directly, or copy the
                request and paste it into any email.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href={CONTACT.phoneHref} className="btn btn-primary">
                  Call {CONTACT.phoneDisplay}
                </a>
                <button type="button" onClick={copy} className="btn btn-secondary">
                  {copied ? <Icon name="check" className="h-4 w-4" /> : null}
                  {copied ? "Copied" : "Copy the request"}
                </button>
              </div>
              <p className="t-meta mt-5 text-on-dark-dim">
                Or write to{" "}
                <a href={mailto(compose(sent))} className="text-on-dark underline underline-offset-4">
                  {CONTACT.email}
                </a>
                .
              </p>
              <button type="button" onClick={() => setStatus("idle")} className="btn-text mt-3">
                Back to the form
                <Icon name="arrow-right" className="arrow h-4 w-4" />
              </button>
            </div>
          ) : null}

          <form
            ref={formRef}
            onSubmit={onSubmit}
            noValidate={js}
            aria-busy={status === "submitting"}
            hidden={status === "success" || status === "failed"}
            className="mt-8"
          >
            <fieldset aria-describedby={describe("config")} aria-invalid={Boolean(errors.config)}>
              <legend className="t-label text-on-dark-dim">Configuration</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {OPTIONS.map((o) => (
                  <label
                    key={o}
                    className={`t-meta relative inline-flex min-h-12 cursor-pointer items-center rounded-[6px] border px-4 transition-colors duration-200 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-on-dark ${
                      config === o
                        ? "border-on-dark bg-on-dark text-ink"
                        : `${errors.config ? "border-on-dark-error" : "border-on-dark-faint"} text-on-dark hover:border-on-dark`
                    }`}
                  >
                    <input
                      type="radio"
                      name="config"
                      value={o}
                      required
                      checked={config === o}
                      onChange={() => {
                        setConfig(o);
                        setErrors((x) => ({ ...x, config: undefined }));
                      }}
                      className="sr-only"
                    />
                    {o}
                  </label>
                ))}
              </div>
              {errors.config ? (
                <p id={`${uid}-config-error`} className="t-meta mt-2 flex items-center gap-2 text-on-dark-error">
                  <Icon name="alert" className="h-4 w-4" />
                  {errors.config}
                </p>
              ) : null}
            </fieldset>

            <div className="mt-8 grid gap-8 sm:grid-cols-2">
              <Field id={`${uid}-date`} label="Preferred date" error={errors.date}>
                <input
                  id={`${uid}-date`}
                  name="date"
                  type="date"
                  required
                  min={minDate}
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={describe("date")}
                  onChange={() => setErrors((x) => ({ ...x, date: undefined }))}
                  className={`${input} ${line(errors.date)}`}
                />
              </Field>
              <Field id={`${uid}-name`} label="Name" error={errors.name}>
                <input
                  id={`${uid}-name`}
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describe("name")}
                  onChange={() => errors.name && setErrors((x) => ({ ...x, name: undefined }))}
                  className={`${input} ${line(errors.name)}`}
                />
              </Field>
              <Field id={`${uid}-phone`} label="Phone" error={errors.phone}>
                <input
                  id={`${uid}-phone`}
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  required
                  autoComplete="tel"
                  placeholder="Mobile number"
                  aria-invalid={Boolean(errors.phone)}
                  aria-describedby={describe("phone")}
                  onChange={() => errors.phone && setErrors((x) => ({ ...x, phone: undefined }))}
                  className={`${input} ${line(errors.phone)}`}
                />
              </Field>
              <Field id={`${uid}-email`} label="Email" error={errors.email}>
                <input
                  id={`${uid}-email`}
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describe("email")}
                  onChange={() => errors.email && setErrors((x) => ({ ...x, email: undefined }))}
                  className={`${input} ${line(errors.email)}`}
                />
              </Field>
            </div>

            {Object.values(errors).some(Boolean) ? (
              <p role="alert" className="t-meta mt-8 text-on-dark-error">
                {Object.values(errors).filter(Boolean).length === 1
                  ? "One detail needs attention."
                  : `${Object.values(errors).filter(Boolean).length} details need attention.`}
              </p>
            ) : null}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <noscript>
                <a href={CONTACT.emailHref} className="btn btn-primary">
                  Write to the site office
                </a>
              </noscript>
              <button type="submit" aria-disabled={status === "submitting"} className="js-only btn btn-primary">
                {status === "submitting" ? (
                  <>
                    <span aria-hidden="true" className="h-4 w-4 rounded-full border-[1.5px] border-ink/25 border-t-ink motion-safe:animate-[spin_700ms_linear_infinite]" />
                    Opening your email app…
                  </>
                ) : (
                  "Book a Site Visit"
                )}
              </button>
              <p className="t-meta text-on-dark-dim">Sends from your own email app. All fields are required.</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
