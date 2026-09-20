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
