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
sequence and composited on a `<canvas>`:

| tier | frames | width | weight |
| --- | --- | --- | --- |
| desktop (≥768px) | 145 (every 2nd) | 1536px | ~7.5 MB |
| mobile | 73 (every 4th) | 960px | ~2.0 MB |

This removes the codec problem entirely and makes scrubbing deterministic in
both directions. Frames load in three passes — first frame, then every 8th, then
the remainder — and the playhead always paints the nearest frame it already has,
so the hero is interactive long before it is complete.

The hold is CSS `position: sticky`, not a GSAP pin: no pin-spacer, no reflow on
refresh, and no fight with Lenis. ScrollTrigger only reads progress.

Regenerate the sequence from a source film with:

```bash
ffmpeg -i hero.mp4 -vf "select=not(mod(n\,2)),scale=1536:-2" -vsync 0 \
  -c:v libwebp -q:v 72 -compression_level 5 -f image2 public/hero/desktop/f%03d.webp
```

## Motion budget

Enforced in `lib/motion.ts`, not aspirational: one focal element moves at a
time; exactly two scrubbed sequences on the page (hero, landscape plates);
parallax only on full-bleed imagery, capped at ±6%; one reveal per section with
at most three staggered children. Every section is complete and legible with all
motion removed, and `prefers-reduced-motion` is a first-class render — no scrub,
no sequence download, no movement.

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
