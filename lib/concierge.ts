import { AMENITIES, CONFIGS, CONTACT, DISTANCES, FAQS, PRICE_RANGE, type Config, type Faq } from "@/lib/content";

/**
 * The concierge's brain.
 *
 * Deterministic intent detection over the site's own structured content —
 * no model, no network, no key. Every answer is assembled from CONFIGS,
 * AMENITIES, DISTANCES, FAQS and CONTACT, so it cannot state anything the
 * page does not already state. When nothing matches it says so and offers
 * the site office rather than guessing.
 *
 * The old implementation ranked one flat text index and returned a list of
 * links. This returns typed answers the panel renders as cards, because
 * "3 BHK" deserves the area, the price and a way to open the plan — not a
 * row that scrolls you somewhere to go and look.
 */

export type Answer =
  | { kind: "config"; config: Config; emphasis: "price" | "area" | "plain" }
  | { kind: "configs" }
  | { kind: "price" }
  | { kind: "plans"; configId?: string }
  | { kind: "amenities"; group?: string }
  | { kind: "location"; place?: (typeof DISTANCES)[number] }
  | { kind: "visit" }
  | { kind: "contact" }
  | { kind: "gallery" }
  | { kind: "faq"; faqs: Faq[] }
  | { kind: "none" };

/* ── intent vocabulary ──────────────────────────────────────────────────── */

const WORDS: Record<string, number> = { one: 1, two: 2, three: 3, four: 4, "1": 1, "2": 2, "3": 3, "4": 4 };

const RE = {
  bhk: /\b(one|two|three|four|1|2|3|4)\s*(?:bhk|bed(?:room)?s?)\b/,
  plan: /\b(floor\s*plans?|plans?|layouts?|blueprints?|drawings?)\b/,
  price: /\b(price|prices|pricing|cost|costs|much|budget|rate|rates|lakh|lakhs|crore|cr|expensive|afford)\b|₹/,
  area: /\b(area|areas|size|sizes|sq\s*ft|square\s*feet|built[\s-]?up|carpet|big)\b/,
  amenityGeneric: /\b(amenit\w*|facilit\w*|feature[s]?|provision[s]?)\b/,
  amenitySpecific: /\b(club\w*|pool|gym|fitness|yoga|park(?:ing)?|security|cctv|play\w*|garden[s]?|green|ev|charg\w*|power|backup|water|lounge|library|games)\b/,
  location: /\b(location|locate[d]?|where|near|nearby|nearest|distance[s]?|far|km|kilomet\w*|min(?:ute)?s?|connectivity|around|surround\w*)\b/,
  visit: /\b(visit|viewing|appointment|book|tour|site\s*visit|see\s+(?:it|the|this)|come)\b/,
  /* Not a bare "number": "what is the RERA number" is not a request for the
     site office's phone. It has to be attached to a way of reaching someone. */
  contact: /\b(contact|call|calling|phone|email|e-mail|mail|whats\s*app|whatsapp|reach|speak|talk)\b|\b(phone|contact|mobile)\s*number\b/,
  gallery: /\b(galler\w*|photo\w*|image[s]?|picture[s]?|render\w*|look[s]?\s+like|views?)\b/,
};

const normalise = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9₹\s]/g, " ").replace(/\s+/g, " ").trim();

const bhkIn = (q: string): Config | undefined => {
  const m = RE.bhk.exec(q);
  if (!m) return undefined;
  const n = WORDS[m[1]];
  return CONFIGS.find((c) => c.bhk.startsWith(String(n)));
};

const groupIn = (q: string) => AMENITIES.find((g) => q.includes(g.group.toLowerCase()))?.group;

const placeIn = (q: string) =>
  DISTANCES.find((d) => {
    const words = normalise(d.place).split(" ").filter((w) => w.length > 3);
    return words.some((w) => q.includes(w));
  });

/* ── FAQ matching ───────────────────────────────────────────────────────── */

const STOP = new Set([
  "a","an","and","any","are","as","at","be","by","can","do","does","for","from","have","how","i",
  "in","is","it","me","much","my","of","on","or","that","the","there","these","this","to","was",
  "what","when","which","will","with","you","your","me","we","us",
]);

function matchFaqs(q: string, limit = 3): Faq[] {
  const words = q.split(" ").filter((w) => w.length > 2 && !STOP.has(w));
  if (!words.length) return [];
  const scored = FAQS.map((f) => {
    const hay = normalise(`${f.q} ${f.a} ${f.tags.join(" ")}`);
    const title = normalise(f.q);
    let score = 0;
    for (const w of words) {
      if (title.includes(w)) score += 4;
      else if (hay.includes(w)) score += 1;
    }
    if (words.every((w) => hay.includes(w))) score += 2;
    return { f, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((r) => r.f);
}

/* ── resolution ─────────────────────────────────────────────────────────── */

/**
 * Order matters. A query naming a configuration is about that configuration
 * whatever else it says; only then does the verb decide which face of it to
 * show. Generic intents come after, and the FAQ catches everything else.
 */
export function resolve(raw: string): Answer {
  const q = normalise(raw);
  if (!q) return { kind: "none" };

  const config = bhkIn(q);
  const wantsPlan = RE.plan.test(q);
  const wantsPrice = RE.price.test(q);
  const wantsArea = RE.area.test(q);

  if (config) {
    if (wantsPlan) return { kind: "plans", configId: config.id };
    return { kind: "config", config, emphasis: wantsPrice ? "price" : wantsArea ? "area" : "plain" };
  }

  if (wantsPlan) return { kind: "plans" };
  if (RE.visit.test(q)) return { kind: "visit" };
  if (wantsPrice) return { kind: "price" };
  if (RE.gallery.test(q)) return { kind: "gallery" };

  if (RE.location.test(q)) {
    const place = placeIn(q);
    return { kind: "location", place };
  }

  /* A named category — "leisure", "wellness" — shows that category. The
     generic word shows all four. A specific provision a visitor names —
     "parking", "gym" — is a question, and the FAQ answers it properly; the
     category list would only tell them it exists. */
  const group = groupIn(q);
  if (group) return { kind: "amenities", group };
  if (RE.amenitySpecific.test(q)) {
    const faqs = matchFaqs(q, 2);
    if (faqs.length) return { kind: "faq", faqs };
    return { kind: "amenities" };
  }
  if (RE.amenityGeneric.test(q)) return { kind: "amenities" };

  if (RE.contact.test(q)) return { kind: "contact" };
  if (/\b(configuration|configurations|bhk|options|types|residences?|apartments?|homes?|units?)\b/.test(q))
    return { kind: "configs" };

  const faqs = matchFaqs(q);
  if (faqs.length) return { kind: "faq", faqs };
  return { kind: "none" };
}

/* ── typeahead ──────────────────────────────────────────────────────────── */

/** Concrete follow-ups for a partial query, so the field feels like it knows. */
export function suggest(raw: string): string[] {
  const q = normalise(raw);
  if (q.length < 2) return [];
  const out: string[] = [];
  const add = (s: string) => {
    if (out.length < 5 && !out.includes(s)) out.push(s);
  };

  if ("price".startsWith(q) || RE.price.test(q)) {
    add("Price range");
    CONFIGS.forEach((c) => add(`${c.bhk} price`));
  }
  if ("floor plans".startsWith(q) || RE.plan.test(q)) {
    add("Floor plans");
    CONFIGS.forEach((c) => add(`${c.bhk} floor plan`));
  }
  if ("amenities".startsWith(q) || RE.amenityGeneric.test(q) || RE.amenitySpecific.test(q)) {
    add("Amenities");
    AMENITIES.forEach((g) => add(g.group));
  }
  if ("location".startsWith(q) || RE.location.test(q)) {
    add("Location");
    DISTANCES.slice(0, 4).forEach((d) => add(`Distance to ${d.place.toLowerCase()}`));
  }
  if ("book a site visit".startsWith(q) || RE.visit.test(q)) add("Book a site visit");
  if ("contact".startsWith(q) || RE.contact.test(q)) add("Contact the site office");

  if (out.length < 5) {
    for (const f of matchFaqs(q, 5 - out.length)) add(f.q);
  }
  return out;
}

/** What the panel offers before a word is typed. */
export const STARTERS = [
  "How much does a 3 BHK cost?",
  "What configurations are available?",
  "Show me the 2 BHK floor plan",
  "What amenities are available?",
  "How far is the retail hub?",
  "How can I book a site visit?",
] as const;

export const PRICE_SUMMARY = `${PRICE_RANGE.min} – ${PRICE_RANGE.max}`;
export { CONTACT };
