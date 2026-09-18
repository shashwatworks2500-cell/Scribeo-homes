# Scribeo Homes

A scroll-driven, editorial marketing site for **Scribeo Homes**, a contemporary
residential development. Next.js 15 (App Router) · TypeScript · Tailwind v4 ·
GSAP ScrollTrigger · Lenis.

## Art direction

The palette was derived by sampling the supplied photography rather than chosen
up front. Across the collection, **72% of pixel mass sits in shadow and warm
mid-tone**, so the site is dark-ground and the photographs are the only light
source. The one exception is the supplied location plan — the only drawn, light
asset — which gets its own paper-white section as a deliberate tonal inversion.

Type pairs **Cormorant Garamond** (high-contrast display, echoing the inscribed
roman capitals on the location plan) with **Jost** (geometric grotesque in the
Futura lineage, the typographic tradition of modern architecture) for eyebrows,
navigation, metadata and body.

## The hero

The supplied hero film is **10-bit HEVC, 22.6 Mbps, 3 keyframes across 289
frames**. That does not decode in Chrome or Firefox, and seeking it by
`currentTime` stalls on every scroll tick. So it is decomposed into a still
sequence and composited on a `<canvas>`. Three things then make it feel like
film rather than a slideshow.

**1. Frames are sampled by visual distance, not by time.** The camera in the
source is not linear. Measured across the shot:

| | peak-to-trough velocity | coefficient of variation |
| --- | ---: | ---: |
| source, sampled by time | 9.22× | 50.4% |
| sampled by visual distance | 1.95× | 28.0% |

67 of the 289 source frames are near-static — the film surges around the
halfway mark and almost stops in its final tenth. Sampling at equal cumulative
visual distance (`scripts/pick-frames.py`) means equal scrolling produces equal
visual change, which is the single biggest factor in whether a scrubbed hero
feels expensive or broken.

**2. Sub-frame blending.** Scroll progress maps to a *fractional* index; the
engine draws frame `n`, then `n+1` on top at the fractional alpha. Motion is
continuous rather than snapping between discrete frames.

**3. AVIF, with a WebP fallback.** Measured on a representative frame, AVIF q50
is 25 KB against WebP q72 at 46 KB — 46% smaller at visibly higher fidelity
(the WebP smooths away grass and paving micro-detail). That buys frame density
at lower total weight. Browsers without AVIF get the WebP set, not a broken hero.

| tier | frames | width | AVIF |
| --- | ---: | ---: | ---: |
| desktop (≥768px) | 169 | 1536px | 4.5 MB |
| mobile | 86 | 960px | 1.3 MB |

Net result versus a naive time-sampled WebP sequence: **more frames, 41% less
weight, and measurably more uniform motion.**

The hold is CSS `position: sticky`, not a GSAP pin: no pin-spacer, no reflow on
refresh, and no fight with Lenis. ScrollTrigger only reads progress, and
painting happens on `requestAnimationFrame` so a burst of scroll events cannot
cause two paints in one frame.

## Entry

`Curtain.tsx` covers the moment the hero spends decoding its first frame. It
lifts on a real signal (`hero:ready`, which the hero broadcasts once frame 0 is
painted — measured at ~390 ms) rather than a guessed timer, holds a 620 ms
minimum so it reads as intentional rather than a flicker, caps at 3.2 s, and
hands scrolling back the instant the lift begins.

## Type

`SplitLines.tsx` re-wraps display headings into masked lines that rise from
their own baseline. It measures only after `document.fonts.ready`, because
grouping words into lines before the webfont lands groups the wrong words. It
is progressive by construction: the heading renders as ordinary selectable
markup and is only enhanced on mount, so a failure leaves a heading, not a gap.

## Motion budget

Enforced in `lib/motion.ts`, not aspirational: one focal element moves at a
time; exactly two scrubbed sequences on the page (hero, landscape plates);
parallax only on full-bleed imagery, capped at ±6%; one reveal per section with
at most three staggered children. Every section is complete and legible with all
motion removed, and `prefers-reduced-motion` is a first-class render — no scrub,
no sequence download, no movement.

## Generated assets

The supplied collection is entirely 16:9, which forces every composition into
landscape. Seven 3:4 portrait plates were generated in the same visual language
(same model, same master prompt) to open up the editorial layout: a full-height
façade, the threshold, a tree against a plain wall, a reflecting pool, a
material macro, a roof slab from beneath, and a corner of morning light.

Supplied assets lead; generated plates fill gaps. Where the two competed for a
slot, the supplied frame was restored.

## Assets deliberately not used

- `unlabelled-01` — garbled artefact text rendered into the image
  ("SCRIBBCO HOMES"), unusable on a finished site.
- `bathroom-02` — the one generic façade in the set; weaker than every
  alternative for the sections it could serve.
- `bedroom-01`, `kitchen-01` — near-duplicates of stronger frames already used.

## Content integrity

No price, area, unit count, bedroom count, address or completion date appears
anywhere on the site, because none exists in the supplied material. The details
table states only what is observable in the assets or their art direction, and
the footer declares the imagery as architectural visualisation.

## Deployment

Vercel auto-detects the framework; no `vercel.json` is needed. The canonical
origin is resolved from the platform in `lib/site.ts` — never hardcoded — so
Open Graph images, the canonical link and the sitemap are correct on the
production domain without configuration. Preview deployments serve
`Disallow: /` so throwaway hostnames cannot poison the canonical.

Once a custom domain exists, set `NEXT_PUBLIC_SITE_URL` to it (e.g.
`https://scribeohomes.com`) and it takes priority over the Vercel domain.

## Before going live

`components/Enquire.tsx` uses **`enquiries@example.com`** as a deliberate
placeholder. Replace it with the real enquiry address or point the call to
action at a form endpoint.

## Commands

```bash
npm run dev        # development
npm run build      # production build
npm run typecheck  # tsc --noEmit
```
