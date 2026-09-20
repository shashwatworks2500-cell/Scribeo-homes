/**
 * Asset manifest for Scribeo Homes.
 *
 * Every entry is a supplied asset. `alt` describes what is actually in the
 * frame — written from the source art direction, not guessed from filenames.
 *
 * Two supplied assets are deliberately not listed:
 *  - `unlabelled-01` carries garbled artefact text rendered into the image
 *    ("SCRIBBCO HOMES"), which cannot appear on a finished site.
 *  - `bathroom-02` is the one generic façade in the set and is weaker than
 *    every alternative for the sections it could serve.
 */

export type Asset = {
  src: string;
  alt: string;
  /** Intrinsic dimensions — declared so no image can cause layout shift. */
  w: number;
  h: number;
};

const img = (name: string, alt: string, w = 2048, h = 1152): Asset => ({
  src: `/images/${name}.webp`,
  alt,
  w,
  h,
});

/** 3:4 portrait plate. */
const vimg = (name: string, alt: string): Asset => ({
  src: `/images/${name}.webp`,
  alt,
  w: 1536,
  h: 2048,
});

export const A = {
  masterReference: img(
    "master-reference",
    "The Scribeo Homes development at first light: low limestone and timber volumes set among mature trees, ornamental grasses and a stone pathway curving between them.",
  ),
  exteriorWide: img(
    "exterior-wide-elevated",
    "A single residence framed by mature trees, its stone and timber façade opening onto a lawn through full-height glazing.",
  ),
  establishingDistant: img(
    "establishing-distant",
    "The residences seen from beyond the landscaped edge, long horizontal roof slabs reading through the canopy against a pale dawn sky.",
  ),
  arrivalRoad: img(
    "arrival-road",
    "The internal road curving between mature trees, a cantilevered upper volume of stone and glass above the approach.",
  ),
  facadeStudy: img(
    "facade-study",
    "Close study of the signature façade: tall limestone fins, deeply recessed windows and vertical timber louvres in low morning sun.",
  ),
  materialDetail: img(
    "material-detail",
    "Material detail at the building edge — a travertine beam meeting dark glazing and warm timber, with the row of residences receding behind.",
  ),
  windowAperture: img(
    "window-aperture",
    "A deep recessed window used as an aperture: stone reveal, slim charcoal mullions and the garden reflected across the glass.",
  ),
  entranceThreshold: img(
    "entrance-threshold",
    "The main threshold — a timber-lined opening in a limestone wall, full-height glazing beyond and rough stone paving underfoot.",
  ),
  pavilion: img(
    "pavilion",
    "A small garden pavilion in the same material language, its concrete roof slab floating over glass and travertine beneath mature trees.",
  ),
  garden: img(
    "garden",
    "The landscaped garden at the heart of the development, olive-green canopy and ornamental grasses framing a glazed garden room.",
  ),
  courtyard: img(
    "courtyard",
    "The central courtyard between two residences, stone paving and planting held between limestone walls and deep shaded soffits.",
  ),
  pathway: img(
    "pathway",
    "A stone pathway crossing lawn and ornamental grasses toward a long glazed residence held under a horizontal roof.",
  ),
  benchSeating: img(
    "bench-seating",
    "Two residents seated on a timber and stone bench beside a planted path, dappled morning light across the limestone wall behind them.",
  ),
  livingRoom: img(
    "living-room",
    "A sheltered living terrace: full-height sliding glass under a deep stone soffit, opening to planting and a low outdoor sofa.",
  ),
  indoorOutdoor: img(
    "indoor-outdoor",
    "The indoor-outdoor threshold seen from within — sliding glass panels drawn back so stone floor runs uninterrupted into the garden.",
  ),
  bedroom: img(
    "bedroom-02",
    "A bedroom at dawn with a pivoting circular door swung open, the bed in warm light and a single tree filling the opening beyond.",
  ),
  bedroomAlt: img(
    "bedroom-01",
    "A bedroom opening through full-height glass onto a mature tree and stone terrace, morning light pooling across the travertine floor.",
  ),
  kitchen: img(
    "kitchen-02",
    "A travertine volume with a glazed corner revealing the timber kitchen within, a mature tree in the foreground.",
  ),
  kitchenAlt: img(
    "kitchen-01",
    "The kitchen read from outside: a long stone bench running beneath deep glazing, timber cabinetry visible within.",
  ),
  bathroom: img(
    "bathroom-01",
    "A bathing space of solid travertine — a monolithic basin and bench beside frameless glass opening to planting and distant greenery.",
  ),
  lifestylePathway: img(
    "lifestyle-pathway",
    "A resident walking a stone path between planting toward a tall glazed hall, a broad olive tree casting shade across the route.",
  ),
  lifestyleArrival: img(
    "lifestyle-arrival",
    "A resident approaching the timber entrance door of a stacked limestone residence across open ground at sunrise.",
  ),
  locationMap: {
    src: "/images/square-study.webp",
    alt:
      "Location plan titled Scribeo Homes: the development at the centre of a ring road, surrounded by parklands, green belts, a university campus, a modern art museum, botanical gardens, residential and cultural districts, a lake and a riverfront.",
    w: 2048,
    h: 2048,
  } satisfies Asset,

  /* Vertical plates. The supplied collection is entirely 16:9, which forces
     every composition into landscape; these 3:4 frames were generated in the
     same visual language to open up the editorial layout. */
  vFacade: vimg(
    "v-facade-tall",
    "The signature façade read full height: slender limestone piers, deep timber-lined reveals and dark glazing stacked over three storeys in low morning sun.",
  ),
  vThreshold: vimg(
    "v-threshold",
    "The entrance seen straight on — a tall timber-lined opening cut deep into limestone, glass set well back in shadow, stone paving running to the door.",
  ),
  vTreeWall: vimg(
    "v-tree-wall",
    "A single mature olive tree standing against a broad plain travertine wall, its shadow thrown long and graphic across the stone.",
  ),
  vPool: vimg(
    "v-reflecting-pool",
    "A still reflecting pool holding a perfect mirror of the limestone residence, its glazing and the pale morning sky.",
  ),
  vMaterial: vimg(
    "v-material-macro",
    "Material study at close range: natural teak, a charcoal shadow gap, pale plaster, warm travertine and grey concrete meeting in vertical bands.",
  ),
  vRoofSlab: vimg(
    "v-roof-slab",
    "Looking up beneath a deep cantilevered roof slab, its concrete underside cutting a hard diagonal against pale sky with olive canopy at the corner.",
  ),
  vLightCorner: vimg(
    "v-light-corner",
    "An interior corner at first light, a wedge of warm morning sun laid across pale plaster and a travertine floor.",
  ),

  /* Amenities. Generated in the same visual language as the supplied set. */
  amClubhouse: img("am-clubhouse", "The residents' clubhouse: a low limestone pavilion with a deep shaded colonnade and full-height glazing, an olive tree at the forecourt."),
  amPool: img("am-pool", "The lap pool: a long rectangle of still dark water with limestone coping and a shaded timber deck, mature trees beyond."),
  amFitness: img("am-fitness", "The fitness studio: a double-height concrete room with a full glass wall onto mature greenery and equipment arranged sparsely."),
  amPlay: img("am-play", "The children's play area: timber play structures in soft sand behind a low limestone wall, shaded by mature trees."),
  amTrail: img("am-trail", "The jogging loop: a smooth paved trail curving away between olive trees and ornamental grasses in early morning light."),
  amGreen: img("am-green", "The central green: a wide open lawn held between low limestone residences with mature trees framing both edges."),
  amLounge: img("am-lounge", "The residents' lounge: limestone floor, warm plaster, a long timber bench and low linen seating beside a full-height window."),
  amYoga: img("am-yoga", "The wellness deck: a raised timber platform under a tree canopy, edged by a low limestone wall and ornamental grasses."),
} as const;

/**
 * Hero frame sequence.
 *
 * Frames are sampled at equal cumulative visual distance rather than equal
 * time, so scrolling at a constant rate produces a constant rate of visual
 * change. AVIF is preferred; the WebP set is the fallback for browsers
 * without AVIF support.
 */
/* Frame counts come from the encode manifests rather than being written out
   here. They were hardcoded and drifted the moment the sequence was
   re-encoded: the manifest grew to 177 frames while this still said 154, so
   the scrub would have ended a fifth of the way before the end of the film
   with nothing to show for it. Now there is one source of truth. */
import desktopFrames from "@/scripts/frames/desktop.json";
import mobileFrames from "@/scripts/frames/mobile.json";

/* The film opens on bare ground: the first third is groundworks, and a
   visitor landing on the page met a dirt plot. The sequence now starts where
   the architecture is first readable.

   The two tiers are sampled independently by visual distance, so the same
   moment is not the same frame number in both. The manifests hold each
   frame's index in the source film, which is what makes the two starts
   comparable: desktop f045 is source frame 92, mobile f023 is source frame
   91 — the same shot, one frame apart. Move DESKTOP_FROM and re-derive
   MOBILE_FROM from the manifests rather than guessing a proportion. */
/* The hero directory is versioned, and that is not cosmetic.
   /hero/** is served `public, max-age=31536000, immutable` — a year, never
   revalidated, not even on a hard reload. The frame names are positional
   (f045.webp), not content-addressed, so re-encoding the hero from a new
   source film overwrote every path with different pictures while the old
   bytes stayed pinned in every browser that had already been to the site.
   Those visitors then scrubbed through a mixture of two different films:
   the frames they had cached from the old one, and the frames they had not,
   fetched fresh from the new one. It cannot be reproduced on a cold profile,
   which is why every automated pass came back clean.

   Bump HERO_REV whenever the frames are re-encoded. A new path cannot
   collide with anything already cached, which is what makes `immutable`
   honest rather than a trap. */
const HERO_REV = "r2";

const DESKTOP_FROM = 45;
const MOBILE_FROM = 23;

const DESKTOP_COUNT = (desktopFrames as number[]).length - DESKTOP_FROM + 1;
const MOBILE_COUNT = (mobileFrames as number[]).length - MOBILE_FROM + 1;

export const HERO = {
  avif: {
    desktop: { dir: `/hero/${HERO_REV}/avif/desktop`, count: DESKTOP_COUNT, from: DESKTOP_FROM },
    mobile: { dir: `/hero/${HERO_REV}/avif/mobile`, count: MOBILE_COUNT, from: MOBILE_FROM },
  },
  webp: {
    desktop: { dir: `/hero/${HERO_REV}/webp/desktop`, count: DESKTOP_COUNT, from: DESKTOP_FROM },
    mobile: { dir: `/hero/${HERO_REV}/webp/mobile`, count: MOBILE_COUNT, from: MOBILE_FROM },
  },
  poster: `/hero/${HERO_REV}/poster.webp`,
} as const;

/* The frames the page actually paints first, so the preload in <head> cannot
   drift from DESKTOP_FROM / MOBILE_FROM and fetch a file nothing requests. */
const pad = (n: number) => String(n).padStart(3, "0");
export const HERO_FIRST = {
  desktop: `/hero/${HERO_REV}/avif/desktop/f${pad(DESKTOP_FROM)}.avif`,
  mobile: `/hero/${HERO_REV}/avif/mobile/f${pad(MOBILE_FROM)}.avif`,
} as const;
