"use client";

import { useEffect, useState } from "react";

/**
 * The phone action bar.
 *
 * Exactly two actions, per the specification. It appears once the hero has
 * been passed — offering to book before the reader has seen anything would
 * be pushy — and stands down whenever an overlay owns the screen or the
 * soft keyboard is up, so it can never sit on top of what it interrupts.
 */
export default function MobileBar() {
  const [past, setPast] = useState(false);
  const [keyboard, setKeyboard] = useState(false);

  useEffect(() => {
    const hero = document.querySelector('[aria-labelledby="hero-heading"]');
    const onScroll = () => setPast(window.scrollY > (hero?.getBoundingClientRect().height ?? 600) * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    /* A soft keyboard shrinks the visual viewport without a resize event.
       When it is up, the bar would sit on the keyboard rather than the page. */
    const vv = window.visualViewport;
    const onVV = () => setKeyboard(!!vv && vv.height < window.innerHeight * 0.75);
    vv?.addEventListener("resize", onVV);
    return () => {
      window.removeEventListener("scroll", onScroll);
      vv?.removeEventListener("resize", onVV);
    };
  }, []);

  const hidden = !past || keyboard;

  return (
    <nav
      data-mobile-bar
      aria-label="Book or enquire"
      aria-hidden={hidden}
      className="fixed inset-x-0 bottom-0 z-40 border-t hair bg-ground/95 backdrop-blur-md transition-transform duration-500 ease-[var(--ease-out-quiet)] md:hidden"
      style={{
        paddingBottom: "env(safe-area-inset-bottom)",
        transform: hidden ? "translateY(110%)" : "none",
        visibility: hidden ? "hidden" : "visible",
      }}
    >
      <div className="flex gap-3 px-4 py-3">
        <button
          type="button"
          className="btn btn-primary flex-1"
          onClick={() => window.dispatchEvent(new CustomEvent("scribeo:enquire"))}
        >
          Book a Site Visit
        </button>
        <a href="#enquire" className="btn btn-secondary flex-1">
          Enquire
        </a>
      </div>
    </nav>
  );
}
