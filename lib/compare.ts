import { CONFIGS, type Config } from "@/lib/content";
import { PLANS, roomDims, type Room } from "@/lib/plans";

/**
 * The comparison table, derived rather than written.
 *
 * Every cell below is computed from the drawn plans in `plans.ts` and the
 * configuration record in `content.ts`. Nothing is typed in twice, so a room
 * that moves on a drawing moves in the comparison too, and there is no second
 * set of numbers to fall out of date. Price bands remain the indicative
 * placeholders declared at the top of content.ts.
 */

export type Cell = { text: string; present: boolean };
export type Row = { label: string; note?: string; cells: Record<string, Cell> };

const NONE: Cell = { text: "—", present: false };
const has = (text: string): Cell => ({ text, present: true });

const find = (rooms: Room[], test: (r: Room) => boolean) => rooms.find(test);
const count = (rooms: Room[], test: (r: Room) => boolean) => rooms.filter(test).length;

const isBedroom = (r: Room) => /bedroom/i.test(r.name);
const isBath = (r: Room) => /bath/i.test(r.name);

const dimsOf = (rooms: Room[], test: (r: Room) => boolean): Cell => {
  const room = find(rooms, test);
  return room ? has(roomDims(room)) : NONE;
};

/** One column of the table: a configuration and the plan that belongs to it. */
export const COLUMNS: Config[] = CONFIGS;

export function buildRows(): Row[] {
  const spec = (fn: (c: Config, rooms: Room[]) => Cell): Record<string, Cell> =>
    Object.fromEntries(CONFIGS.map((c) => [c.id, fn(c, PLANS[c.id].rooms)]));

  return [
    {
      label: "Built-up area",
      cells: spec((c) => has(`${c.builtUpSqft.toLocaleString("en-IN")} sq ft`)),
    },
    {
      label: "Built-up, metric",
      cells: spec((c) => has(`${c.builtUpSqm} sq m`)),
    },
    { label: "Bedrooms", cells: spec((_c, rooms) => has(String(count(rooms, isBedroom)))) },
    { label: "Bathrooms", cells: spec((_c, rooms) => has(String(count(rooms, isBath)))) },
    {
      label: "Living & dining",
      cells: spec((_c, rooms) => dimsOf(rooms, (r) => /living/i.test(r.name))),
    },
    {
      label: "Master bedroom",
      cells: spec((_c, rooms) => dimsOf(rooms, (r) => /master bedroom/i.test(r.name))),
    },
    { label: "Kitchen", cells: spec((_c, rooms) => dimsOf(rooms, (r) => /kitchen/i.test(r.name))) },
    {
      label: "Balcony",
      cells: spec((_c, rooms) => dimsOf(rooms, (r) => Boolean(r.out))),
    },
    {
      label: "Separate utility",
      cells: spec((_c, rooms) => (find(rooms, (r) => /utility/i.test(r.name)) ? has("Yes") : NONE)),
    },
    { label: "Study", cells: spec((_c, rooms) => dimsOf(rooms, (r) => /study/i.test(r.name))) },
    {
      label: "Family room",
      cells: spec((_c, rooms) => dimsOf(rooms, (r) => /family/i.test(r.name))),
    },
    {
      label: "Price band",
      note: "Indicative",
      cells: spec((c) => has(`${c.priceFrom} – ${c.priceTo}`)),
    },
  ];
}

/** True when the shown columns do not all say the same thing. */
export const differs = (row: Row, ids: string[]) =>
  new Set(ids.map((id) => row.cells[id]?.text)).size > 1;
