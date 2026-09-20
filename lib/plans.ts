import { CONFIGS } from "@/lib/content";

/**
 * Floor plan geometry, in metres, matching scripts/plans.py exactly.
 *
 * The drawings are SVG on a fixed grid — 46px to the metre inside an 86px
 * margin — so the same numbers that drew a room can place a hotspot over it.
 * The viewer renders the drawing as an <image> inside an <svg> of that same
 * viewBox, which is why the overlay registers to the millimetre instead of
 * being nudged into place.
 */
export const M = 46;
export const PAD = 86;

export type Room = { x: number; y: number; w: number; h: number; name: string; wet?: boolean; out?: boolean };
export type Plan = { id: string; vbW: number; vbH: number; w: number; h: number; rooms: Room[] };

const r = (x: number, y: number, w: number, h: number, name: string, kind?: "wet" | "out"): Room => ({
  x, y, w, h, name, wet: kind === "wet", out: kind === "out",
});

const build = (id: string, w: number, h: number, rooms: Room[]): Plan => ({
  id, w, h, rooms,
  // Math.floor, not round: the generator truncates, and a one-pixel
  // disagreement stretches the drawing inside its own viewBox.
  vbW: Math.floor(w * M) + PAD * 2,
  vbH: Math.floor(h * M) + PAD * 2 + 54,
});

export const PLANS: Record<string, Plan> = {
  "1bhk": build("1bhk", 9.2, 7.6, [
    r(0, 0, 5.4, 4.6, "Living & Dining"), r(5.4, 0, 3.8, 2.6, "Kitchen"),
    r(5.4, 2.6, 3.8, 2.0, "Bath", "wet"), r(0, 4.6, 5.4, 3.0, "Bedroom"),
    r(5.4, 4.6, 3.8, 3.0, "Balcony", "out"),
  ]),
  "2bhk": build("2bhk", 11.6, 9.4, [
    r(0, 0, 6.2, 1.6, "Balcony", "out"), r(0, 1.6, 6.2, 4.4, "Living & Dining"),
    r(6.2, 0, 5.4, 3.2, "Kitchen"), r(6.2, 3.2, 2.6, 2.8, "Bath 1", "wet"),
    r(8.8, 3.2, 2.8, 2.8, "Utility", "wet"), r(0, 6.0, 6.0, 3.4, "Master Bedroom"),
    r(6.0, 6.0, 3.4, 3.4, "Bedroom 2"), r(9.4, 6.0, 2.2, 3.4, "Bath 2", "wet"),
  ]),
  "3bhk": build("3bhk", 14.6, 10.8, [
    r(0, 0, 7.6, 1.8, "Balcony", "out"), r(0, 1.8, 7.6, 5.2, "Living & Dining"),
    r(7.6, 0, 7.0, 3.6, "Kitchen"), r(7.6, 3.6, 3.4, 3.4, "Utility", "wet"),
    r(11.0, 3.6, 3.6, 3.4, "Study"), r(0, 7.0, 5.0, 3.8, "Master Bedroom"),
    r(5.0, 7.0, 2.4, 3.8, "Master Bath", "wet"), r(7.4, 7.0, 3.6, 3.8, "Bedroom 2"),
    r(11.0, 7.0, 3.6, 3.8, "Bedroom 3"),
  ]),
  "4bhk": build("4bhk", 17.2, 12.6, [
    r(0, 0, 8.4, 2.0, "Balcony", "out"), r(0, 2.0, 8.4, 5.8, "Living & Dining"),
    r(8.4, 0, 8.8, 3.8, "Kitchen"), r(8.4, 3.8, 4.0, 4.0, "Utility", "wet"),
    r(12.4, 3.8, 3.0, 4.0, "Family Room"), r(15.4, 3.8, 1.8, 4.0, "Bath 3", "wet"),
    r(0, 7.8, 5.6, 4.8, "Master Bedroom"), r(5.6, 7.8, 2.6, 4.8, "Master Bath", "wet"),
    r(8.2, 7.8, 3.2, 4.8, "Bedroom 2"), r(11.4, 7.8, 3.2, 4.8, "Bedroom 3"),
    r(14.6, 7.8, 2.6, 4.8, "Bedroom 4"),
  ]),
};

/** Metres to feet and inches, the way a plan is actually read aloud. */
export const feet = (m: number) => {
  const total = m * 3.280839895;
  const ft = Math.floor(total);
  const inch = Math.round((total - ft) * 12);
  return inch === 12 ? `${ft + 1}′ 0″` : `${ft}′ ${inch}″`;
};

export const roomDims = (room: Room) => `${feet(room.w)} × ${feet(room.h)}`;
export const roomArea = (room: Room) => `${Math.round(room.w * room.h * 10.7639)} sq ft`;

/** Every plan must correspond to a configuration, and vice versa. */
export const planFor = (configId: string) => PLANS[configId];
export const CONFIG_IDS = CONFIGS.map((c) => c.id);
