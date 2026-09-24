import { CONFIGS, PRICE_RANGE, type Config } from "@/lib/content";

/**
 * Residence search.
 *
 * Filters over the project's four configurations. Every option below is
 * derived from CONFIGS, so the ranges cannot drift from the residences they
 * describe, and no option exists that no residence can satisfy.
 *
 * There is deliberately no availability filter: no availability data was
 * supplied for this development, and a control that cannot be answered
 * truthfully is worse than an absent one.
 */

export type Filters = { bhk: string[]; area: string | null; price: string | null };

export const EMPTY: Filters = { bhk: [], area: null, price: null };

const sqft = CONFIGS.map((c) => c.builtUpSqft);
export const AREA_BOUNDS = { min: Math.min(...sqft), max: Math.max(...sqft) };

/** Bands chosen so each one contains at least one residence. */
export const AREA_BANDS = [
  { id: "under-1000", label: "Under 1,000 sq ft", test: (c: Config) => c.builtUpSqft < 1000 },
  { id: "1000-1500", label: "1,000 – 1,500 sq ft", test: (c: Config) => c.builtUpSqft >= 1000 && c.builtUpSqft < 1500 },
  { id: "1500-2000", label: "1,500 – 2,000 sq ft", test: (c: Config) => c.builtUpSqft >= 1500 && c.builtUpSqft < 2000 },
  { id: "over-2000", label: "Over 2,000 sq ft", test: (c: Config) => c.builtUpSqft >= 2000 },
] as const;

/** Price is held as display strings in content, so bands read the numeral. */
const crore = (s: string) => {
  const n = parseFloat(s.replace(/[^\d.]/g, ""));
  return /cr/i.test(s) ? n * 100 : n; // normalise to lakh
};

export const PRICE_BANDS = [
  { id: "under-75", label: `${PRICE_RANGE.min} – ₹75 L`, test: (c: Config) => crore(c.priceFrom) < 75 },
  { id: "75-125", label: "₹75 L – ₹1.25 Cr", test: (c: Config) => crore(c.priceFrom) >= 75 && crore(c.priceFrom) < 125 },
  { id: "over-125", label: `₹1.25 Cr – ${PRICE_RANGE.max}`, test: (c: Config) => crore(c.priceFrom) >= 125 },
] as const;

export function apply(f: Filters): Config[] {
  return CONFIGS.filter((c) => {
    if (f.bhk.length && !f.bhk.includes(c.id)) return false;
    if (f.area && !AREA_BANDS.find((b) => b.id === f.area)?.test(c)) return false;
    if (f.price && !PRICE_BANDS.find((b) => b.id === f.price)?.test(c)) return false;
    return true;
  });
}

export const isEmpty = (f: Filters) => !f.bhk.length && !f.area && !f.price;
