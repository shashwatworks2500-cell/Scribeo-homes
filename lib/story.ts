import { A, type Asset } from "@/lib/assets";

/**
 * The narrative content: the chapters that carry the project rather than
 * specify it. Everything here is written from the supplied art direction and
 * the material palette already stated in the project information — no figure,
 * date or claim is invented. Specifications live in content.ts.
 */

export type Chapter = { id: string; label: string; title: string; body: string; asset: Asset };

/** 03 — The landscape. The one claim the project actually makes about itself. */
export const LANDSCAPE: { lead: string; body: string; plates: { asset: Asset; caption: string }[] } = {
  lead: "The landscape is not *around* the architecture. It is part of it.",
  body:
    "The trees were here first and the plan was drawn to keep them. Roof slabs run long and low so the buildings sit under the canopy rather than above it. From the far edge you read the trees before you read the houses.",
  plates: [
    { asset: A.vTreeWall, caption: "A mature olive held against plain travertine" },
    { asset: A.garden, caption: "The garden at the centre of the plan" },
    { asset: A.pathway, caption: "Stone laid through grasses, not over them" },
    { asset: A.amGreen, caption: "The central green, held between the residences" },
  ],
};

/** 04 — Architectural philosophy, told as four materials rather than a spec list. */
export const MATERIALS: Chapter[] = [
  {
    id: "stone",
    label: "01 — Stone",
    title: "Warm limestone, beige sandstone.",
    body:
      "The primary material, and the reason the buildings hold their colour through the day. Piers run full height; the coursing is deliberately quiet so the stone reads as mass rather than pattern.",
    asset: A.facadeStudy,
  },
  {
    id: "concrete",
    label: "02 — Concrete",
    title: "Warm grey, left as it was cast.",
    body:
      "Structure that is allowed to be seen. Roof slabs cantilever far enough to keep sun off the glass until it is wanted, and the soffit is the ceiling — there is nothing applied to it.",
    asset: A.vRoofSlab,
  },
  {
    id: "timber",
    label: "03 — Timber",
    title: "Natural teak, only where a hand goes.",
    body:
      "Used sparingly and on purpose: door leaves, reveals, the lining of a threshold. It is the one warm thing you touch on the way in, and it is not used anywhere you would not.",
    asset: A.entranceThreshold,
  },
  {
    id: "light",
    label: "04 — Light",
    title: "The material that changes.",
    body:
      "Deep reveals, a slim charcoal frame, and a plain wall to receive what comes through. The rooms are planned around where the sun lands rather than around the view.",
    asset: A.vLightCorner,
  },
];

/** 07 — A day, told in five hours. Times are illustrative of orientation. */
export const DAY: { time: string; label: string; line: string; asset: Asset }[] = [
  {
    time: "06:15",
    label: "Morning",
    line: "First light comes in low through the trees and lands on a plain wall.",
    asset: A.vLightCorner,
  },
  {
    time: "07:30",
    label: "The walk",
    line: "The loop runs the length of the landscape and back without crossing a road.",
    asset: A.lifestylePathway,
  },
  {
    time: "09:00",
    label: "Breakfast",
    line: "The glass slides away and the terrace becomes the room you are already in.",
    asset: A.livingRoom,
  },
  {
    time: "18:20",
    label: "Evening",
    line: "The canopy moves, the stone holds its warmth, and the shadows get long.",
    asset: A.benchSeating,
  },
  {
    time: "21:15",
    label: "Night",
    line: "The water goes still and the development reads as one quiet line of light.",
    asset: A.vPool,
  },
];

/** 12 — What a serious buyer needs in writing before they visit. */
export const TRUST: { k: string; v: string }[] = [
  { k: "Development", v: "Contemporary low-rise residences in mature landscape" },
  { k: "Configurations", v: "1, 2, 3 and 4 BHK" },
  { k: "Drawings", v: "Indicative layouts, not to scale; dimensions nominal" },
  { k: "Imagery", v: "Architectural visualisation of a proposed development" },
  { k: "Pricing", v: "Indicative and exclusive of duty, registration and taxes" },
  { k: "Distances", v: "Measured by road and to be confirmed on site" },
];

/** 02 — Everything a first-time visitor needs in one line. */
export const GLANCE: { k: string; v: string }[] = [
  { k: "Configurations", v: "1 – 4 BHK" },
  { k: "Built-up area", v: "753 – 2,333 sq ft" },
  { k: "Price", v: "₹48 L – ₹1.79 Cr" },
  { k: "Setting", v: "Mature landscape" },
  { k: "Viewings", v: "Daily, by appointment" },
];

/** 04 — Why this one. Six principles, each earned by something on the page. */
export const PRINCIPLES: { n: string; title: string; line: string; asset: Asset; href: string }[] = [
  { n: "01", title: "Mature landscape", line: "The trees were here first and the plan was drawn to keep them.", asset: A.vTreeWall, href: "#landscape" },
  { n: "02", title: "Low-rise architecture", line: "Long horizontal roof slabs, so the buildings sit under the canopy.", asset: A.establishingDistant, href: "#architecture" },
  { n: "03", title: "Indoor and outdoor", line: "Glass slides away and the terrace becomes the room you were in.", asset: A.indoorOutdoor, href: "#day" },
  { n: "04", title: "Plans that face something", line: "Every room is placed against a window, a court or a tree.", asset: A.windowAperture, href: "#residences" },
  { n: "05", title: "A private community", line: "Twenty-six shared provisions, built in the same materials.", asset: A.amClubhouse, href: "#amenities" },
  { n: "06", title: "Inside the ring road", line: "Parkland on three sides and the cultural quarter without leaving it.", asset: A.pathway, href: "#location" },
];

/**
 * 13 — Specifications.
 *
 * Only what the supplied project information actually states. Anything a
 * buyer would reasonably ask that was not supplied says so rather than
 * guessing: an invented specification is worse than an absent one.
 */
export const SPECS: { group: string; rows: [string, string][] }[] = [
  {
    group: "Structure and envelope",
    rows: [
      ["Structure", "Warm-grey architectural concrete, left as cast"],
      ["Façade", "Warm limestone and beige sandstone"],
      ["Roof", "Deep cantilevered slabs, exposed soffit"],
      ["Windows", "Deep reveals, slim charcoal frames"],
      ["Joinery", "Natural teak, used where a hand goes"],
    ],
  },
  {
    group: "Inside",
    rows: [
      ["Flooring", "Natural stone"],
      ["Walls", "Pale plaster"],
      ["Openings", "Full-height glazing to terraces"],
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
      ["Lighting", "Solar-assisted common lighting"],
      ["Vehicles", "EV charging provision"],
      ["Waste", "Segregation point"],
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

/** 12 — The neighbourhood as hours rather than pins. */
export const AROUND: { when: string; line: string; places: string[] }[] = [
  { when: "Morning", line: "Coffee, the loop, and the gardens before the heat.", places: ["Botanical gardens", "Parklands", "Retail hub"] },
  { when: "Day", line: "Campus, errands and everything inside the ring road.", places: ["University campus", "Retail hub"] },
  { when: "Evening", line: "Theatres, the permanent collection, dinner after.", places: ["Cultural district", "Modern art museum"] },
  { when: "Weekend", line: "Water, long walks, and the green belt on three sides.", places: ["Lake", "Riverfront", "Parklands"] },
];
