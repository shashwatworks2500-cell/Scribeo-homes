import { AMENITIES, CONFIGS, CONTACT, DISTANCES, FAQS, PRICE_RANGE } from "@/lib/content";
import { CATEGORIES } from "@/lib/gallery";

/**
 * Site search index.
 *
 * Built from the same modules the page renders, so there is nothing to keep in
 * step by hand: add a question, an amenity or a configuration and it becomes
 * searchable in the same commit. Nothing here is a second copy of the content.
 */
export type Kind = "Question" | "Configuration" | "Amenity" | "Nearby" | "Gallery" | "Section" | "Contact";

export type Entry = {
  id: string;
  kind: Kind;
  title: string;
  /** Secondary line shown beside the title. */
  detail?: string;
  /** Searched, not necessarily shown. */
  body?: string;
  tags: string[];
  href: string;
  /** Index into FAQS, so a question can be opened as well as scrolled to. */
  faq?: number;
  /** Gallery category to preselect. */
  category?: string;
  /** A starter runs this rather than navigating. */
  query?: string;
};

const SECTIONS: Entry[] = [
  { id: "s-pricing", kind: "Section", title: "Configurations and price range",
    detail: `${PRICE_RANGE.min} — ${PRICE_RANGE.max}`, href: "#pricing",
    tags: ["price", "cost", "rate", "budget", "configurations", "bhk", "how much", "lakh", "crore"] },
  { id: "s-landscape", kind: "Section", title: "The landscape",
    detail: "Held inside mature planting", href: "#landscape",
    tags: ["landscape", "garden", "trees", "green", "planting", "outdoors"] },
  { id: "s-day", kind: "Section", title: "A day here",
    detail: "Five hours, from first light", href: "#day",
    tags: ["day", "lifestyle", "morning", "evening", "light", "living here"] },
  { id: "s-trust", kind: "Section", title: "In writing",
    detail: "What is confirmed and what is indicative", href: "#trust",
    tags: ["trust", "legal", "disclaimer", "indicative", "confirmed", "rera", "approval"] },
  { id: "s-plans", kind: "Section", title: "Floor plans",
    detail: "1, 2, 3 and 4 BHK layouts", href: "#residences",
    tags: ["floor plan", "layout", "blueprint", "drawing", "plan", "carpet", "built-up", "area", "sq ft"] },
  { id: "s-amenities", kind: "Section", title: "Amenities",
    detail: `${AMENITIES.reduce((n, g) => n + g.items.length, 0)} provisions in ${AMENITIES.length} groups`,
    href: "#amenities", tags: ["amenities", "facilities", "clubhouse", "pool", "gym", "features"] },
  { id: "s-gallery", kind: "Section", title: "Gallery",
    detail: "Photography and drawings by category", href: "#gallery",
    tags: ["gallery", "photos", "images", "pictures", "views", "renders"] },
  { id: "s-distances", kind: "Section", title: "Key distances",
    detail: `${DISTANCES.length} places within a short drive`, href: "#distances",
    tags: ["distance", "nearby", "near", "how far", "connectivity", "location", "km"] },
  { id: "s-location", kind: "Section", title: "Location",
    detail: "The plan, and what is around it", href: "#location",
    tags: ["location", "map", "address", "where", "site", "plan"] },
  { id: "s-enquire", kind: "Section", title: "Request a private viewing",
    detail: "Three questions, then we call", href: "#enquire",
    tags: ["enquire", "enquiry", "contact", "visit", "book", "site visit", "form", "call back"] },
];

const CONTACTS: Entry[] = [
  { id: "c-phone", kind: "Contact", title: CONTACT.phoneDisplay, detail: "Call the site office",
    href: CONTACT.phoneHref, tags: ["phone", "call", "number", "mobile", "contact", "talk"] },
  { id: "c-email", kind: "Contact", title: CONTACT.email, detail: "Email an enquiry",
    href: CONTACT.emailHref, tags: ["email", "mail", "write", "contact"] },
  { id: "c-hours", kind: "Contact", title: CONTACT.hours, detail: "Visiting hours",
    href: "#enquire", tags: ["hours", "timing", "open", "when", "visit", "site visit"] },
];

export const INDEX: Entry[] = [
  ...SECTIONS,
  ...CONFIGS.map<Entry>((c, i) => ({
    id: `cfg-${c.id}`, kind: "Configuration", title: `${c.bhk} — ${c.label}`,
    detail: `${c.builtUpSqft.toLocaleString("en-IN")} sq ft · from ${c.priceFrom}`,
    body: c.blurb, href: "#residences", category: "Floor plans",
    tags: [c.bhk, c.bhk.replace(" ", ""), c.label, "floor plan", "layout", "price", "area",
           `${c.builtUpSqft}`, c.priceFrom, c.priceTo, ["one", "two", "three", "four"][i] ?? ""],
  })),
  ...AMENITIES.flatMap((g) =>
    g.items.map<Entry>((item) => ({
      id: `am-${item}`, kind: "Amenity", title: item, detail: g.group,
      href: "#amenities", tags: [g.group, "amenity", "facility"],
    })),
  ),
  ...DISTANCES.map<Entry>((d) => ({
    id: `d-${d.place}`, kind: "Nearby", title: d.place,
    detail: `${d.km.toFixed(1)} km · ${d.mins} min drive`, body: d.detail,
    href: "#distances", tags: ["distance", "nearby", "how far", "drive", `${d.km}`, "km"],
  })),
  ...CATEGORIES.filter((c) => c !== "All").map<Entry>((c) => ({
    id: `g-${c}`, kind: "Gallery", title: c, detail: "Open in the gallery",
    href: "#gallery", category: c, tags: ["gallery", "photos", "images", c],
  })),
  ...FAQS.map<Entry>((f, i) => ({
    id: `q-${i}`, kind: "Question", title: f.q, body: f.a, tags: f.tags,
    href: "#enquire", faq: i, detail: "Answer",
  })),
  ...CONTACTS,
];

const normalise = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9₹ ]+/g, " ").replace(/\s+/g, " ").trim();

/** Cheap singular/plural and shorthand folding, so "photos" finds "photo". */
const stem = (w: string) => (w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w);

const HAY = INDEX.map((e) => ({
  title: normalise(e.title),
  tags: e.tags.filter(Boolean).map(normalise),
  body: normalise(`${e.detail ?? ""} ${e.body ?? ""}`),
}));

/** Ordering when scores tie: the things a buyer most often wants first. */
const KIND_RANK: Record<Kind, number> = {
  Question: 0, Configuration: 1, Section: 2, Nearby: 3, Amenity: 4, Gallery: 5, Contact: 6,
};

export function search(query: string, limit = 24, strict = false): Entry[] {
  const needle = normalise(query);
  if (!needle) return [];
  const words = needle.split(" ").filter(Boolean).map(stem);

  /* A token of one or two characters must match a whole word, not a substring.
     "3 bhk" was surfacing the site phone number, because "63880" contains a 3,
     and "Who do I contact?", whose answer carries that number. Everything the
     index holds is normalised to single-spaced alphanumerics, so a space test
     is an exact word boundary. */
  const matchers = words.map((w) =>
    w.length > 2
      ? (hay: string) => hay.includes(w)
      : (hay: string) => new RegExp(`(^| )${w}( |$)`).test(hay),
  );

  const scored: { e: Entry; score: number }[] = [];

  for (let i = 0; i < INDEX.length; i++) {
    const h = HAY[i];
    let score = 0;
    let matchedAll = true;
    for (let k = 0; k < words.length; k++) {
      const w = words[k];
      const hit = matchers[k];
      let s = 0;
      if (hit(h.title)) s = h.title.startsWith(w) ? 5 : 4;
      else if (h.tags.some(hit)) s = 2;
      else if (hit(h.body)) s = 1;
      if (s === 0) matchedAll = false;
      score += s;
    }
    // The whole phrase appearing verbatim beats the sum of its words.
    if (words.length > 1 && (h.title.includes(needle) || h.body.includes(needle))) score += 4;
    // Every word matching somewhere is worth more than one word matching well.
    if (matchedAll && words.length > 1) score += 2;
    if (score > 0 && (!strict || matchedAll)) scored.push({ e: INDEX[i], score });
  }

  return scored
    .sort((a, b) =>
      b.score - a.score ||
      KIND_RANK[a.e.kind] - KIND_RANK[b.e.kind] ||
      a.e.title.length - b.e.title.length)
    .slice(0, limit)
    .map((r) => r.e);
}

/**
 * What the concierge offers before anything is typed.
 *
 * Each starter says one thing and runs another: the label is how a person
 * would ask, the query is the words that actually discriminate. Counting the
 * label instead would either be meaningless — "what", "does" and "it" match
 * nothing, so a strict count is zero — or inflated, because a loose count of
 * a five-word sentence pulls in half the index. The number beside each row is
 * a strict count of its query, so it is the number of things you will see.
 */
const STARTER_QUERIES: { label: string; query: string }[] = [
  { label: "What does it cost", query: "price" },
  { label: "Show me a three bedroom", query: "3 bhk" },
  { label: "Can I get a home loan", query: "home loan" },
  { label: "When is possession", query: "possession" },
  { label: "What is nearby", query: "nearby" },
];

export const STARTERS: Entry[] = STARTER_QUERIES.map(({ label, query }) => {
  const n = search(query, 99, true).length;
  return {
    id: `starter-${query}`,
    kind: "Section",
    title: label,
    detail: `${n} ${n === 1 ? "answer" : "answers"}`,
    tags: [],
    href: "#enquire",
    query,
  };
});
