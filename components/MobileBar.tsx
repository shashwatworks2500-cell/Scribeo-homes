"use client";

import { CONTACT } from "@/lib/content";

/**
 * The phone action bar.
 *
 * Three ways to start a conversation, fixed to the foot of a phone screen
 * and nowhere else. Deliberately quiet: a hairline, the page's own ground,
 * and the same type as the rest of the site — it should read as part of the
 * page rather than an advertisement stuck on top of it.
 *
 * Sits below the fold of every section because `.dock-clear` reserves the
 * space, and inside the safe area on a notched phone.
 */
const wa = `https://wa.me/91${CONTACT.phone}`;

export default function MobileBar() {
  const item =
    "t-meta flex-1 py-4 text-center text-ink transition-colors duration-200 active:text-travertine";

  return (
    <nav
      aria-label="Contact"
      className="fixed inset-x-0 bottom-0 z-40 border-t hair bg-paper/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex divide-x divide-[var(--color-hair)]">
        <a href={CONTACT.phoneHref} className={item}>
          Call
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className={item}>
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire"))}
          className={`${item} font-medium`}
        >
          Book a visit
        </button>
      </div>
    </nav>
  );
}
