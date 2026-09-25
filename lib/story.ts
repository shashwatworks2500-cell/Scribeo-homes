import { A, type Asset } from "@/lib/assets";

/**
 * The narrative content that survives the restructure.
 *
 * What was here — a landscape chapter, four material chapters, five hours of
 * a day, six principles and a neighbourhood read as a week — answered the
 * question "what is this place like?" five separate times, at length. It now
 * answers it three times, in three sentences, against three photographs.
 * Nothing factual was lost: everything a buyer needs to decide lives in the
 * glance, the residences, the specifications and the FAQ.
 */

/** 01 — The whole project in six facts. Read in five seconds, not five minutes. */
export const GLANCE: { n: string; k: string; v: string }[] = [
  { n: "01", k: "Configurations", v: "1–4 BHK" },
  { n: "02", k: "Built-up area", v: "753–2,333 sq ft" },
  { n: "03", k: "Price", v: "₹48 L – ₹1.79 Cr" },
  { n: "04", k: "Type", v: "Low-rise residences" },
  { n: "05", k: "Setting", v: "Mature landscape" },
  { n: "06", k: "Viewings", v: "Daily, by appointment" },
];

/** 02 — Three pictures, three sentences. The visual argument, compressed. */
export const INTRO: { eyebrow: string; title: string; line: string; asset: Asset }[] = [
  {
    eyebrow: "The setting",
    title: "Low-rise homes shaped around the landscape.",
    line: "The trees were here first and the plan was drawn to keep them.",
    asset: A.vTreeWall,
  },
  {
    eyebrow: "The architecture",
    title: "Limestone, warm concrete, teak.",
    line: "Deep reveals keep the sun off the glass until it is wanted.",
    asset: A.facadeStudy,
  },
  {
    eyebrow: "Inside",
    title: "Rooms planned around where the light lands.",
    line: "Full-height glazing slides away and the terrace becomes the room.",
    asset: A.indoorOutdoor,
  },
];

/**
 * 07 — Specifications.
 *
 * Only what the supplied project information actually states. Anything a
 * buyer would reasonably ask that was not supplied says so rather than
 * guessing: an invented specification is worse than an absent one.
 */
export const SPECS: { group: string; rows: [string, string][] }[] = [
  {
    group: "Structure and envelope",
    rows: [
      ["Structure", "RCC frame; warm-grey architectural concrete, left as cast"],
      ["Façade", "Warm limestone and beige sandstone"],
      ["Roof", "Deep cantilevered slabs, exposed soffit"],
      ["Windows", "Full-height glazing, deep reveals, slim charcoal frames"],
      ["Joinery", "Natural teak"],
    ],
  },
  {
    group: "Inside",
    rows: [
      ["Flooring", "Natural stone"],
      ["Walls", "Pale plaster"],
      ["Layouts", "1, 2, 3 and 4 BHK — see the floor plans"],
    ],
  },
  {
    group: "The development",
    rows: [
      ["Landscape", "Mature planting retained; central green"],
      ["Parking", "Covered, plus visitor parking"],
      ["Security", "24 × 7 security and CCTV"],
      ["Power", "Backup to common areas"],
      ["Water", "Rainwater harvesting"],
      ["Vehicles", "EV charging provision"],
    ],
  },
  {
    group: "Not yet published",
    rows: [
      ["Approvals and registration", "Details available from the site office"],
      ["Construction status", "Details available from the site office"],
      ["Possession", "Details available from the site office"],
      ["Payment schedule", "Details available from the site office"],
    ],
  },
];

/** The qualifications the page relies on, kept with the specifications. */
export const TRUST: { k: string; v: string }[] = [
  { k: "Drawings", v: "Indicative layouts, not to scale; dimensions nominal" },
  { k: "Imagery", v: "Architectural visualisation of a proposed development" },
  { k: "Pricing", v: "Indicative and exclusive of duty, registration and taxes" },
  { k: "Distances", v: "Measured by road and to be confirmed on site" },
];

/**
 * The fuller statement behind a specification row, where the project already
 * makes one. Every sentence here is an existing FAQ answer, quoted rather
 * than paraphrased, so opening a row adds detail without adding a claim.
 * Rows with nothing further to say show their value alone.
 */
export const SPEC_DETAIL: Record<string, string> = {
  Structure:
    "An RCC frame in warm-grey architectural concrete, with a façade of warm limestone and beige sandstone, deep recessed window reveals and horizontal roof slabs.",
  Windows: "Slim charcoal metal window frames.",
  Joinery: "Natural teak joinery where a hand touches it.",
  Flooring: "Limestone and warm-neutral stone flooring to living areas. A full specification sheet is available on request.",
  Landscape:
    "The planting is designed to read as mature, with established trees retained and reinforced rather than a newly turfed site.",
  Parking:
    "Covered parking is allotted with each residence, and separate visitor parking is provided within the development.",
  Security:
    "Gated access with 24 × 7 manned security, CCTV coverage of entries and common areas, and visitor management at the gate.",
  Power:
    "Power backup covers common areas, lifts and essential services. Backup provision to individual residences is confirmed in the specification sheet.",
  Water: "A treated supply with underground and overhead storage, supported by rainwater harvesting across the site.",
};
