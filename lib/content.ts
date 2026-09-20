/**
 * Site content.
 *
 * ── A NOTE ON FIGURES ────────────────────────────────────────────────────
 * Prices, areas, distances and possession dates below are INDICATIVE
 * placeholders. No price list, survey or approval document was supplied for
 * this development, so these are structurally correct but commercially
 * invented. Replace every value in PRICING, DISTANCES and FACTS before this
 * page is used to sell anything. They are collected here, in one file, so
 * that is a single edit rather than a hunt through components.
 */

export const CONTACT = {
  phone: "6388042221",
  phoneHref: "tel:+916388042221",
  phoneDisplay: "+91 63880 42221",
  email: "scribeostudio@gmail.com",
  emailHref: "mailto:scribeostudio@gmail.com",
  hours: "Site visits daily, 7:00 – 11:00 and 16:00 – 19:00",
} as const;

export type Config = {
  id: string;
  label: string;
  bhk: string;
  builtUpSqft: number;
  builtUpSqm: number;
  priceFrom: string;
  priceTo: string;
  plan: string;
  blurb: string;
};

/** Built-up areas are taken from the drawn plans in /public/plans. */
export const CONFIGS: Config[] = [
  {
    id: "1bhk",
    label: "One bedroom",
    bhk: "1 BHK",
    builtUpSqft: 753,
    builtUpSqm: 70,
    priceFrom: "₹48 L",
    priceTo: "₹56 L",
    plan: "/plans/plan-1bhk.svg",
    blurb: "A single aspect plan: living and dining open to the balcony, the bedroom held quietly behind.",
  },
  {
    id: "2bhk",
    label: "Two bedroom",
    bhk: "2 BHK",
    builtUpSqft: 1174,
    builtUpSqm: 109,
    priceFrom: "₹72 L",
    priceTo: "₹86 L",
    plan: "/plans/plan-2bhk.svg",
    blurb: "Two bedrooms with their own bathrooms, a separate utility, and a balcony running the width of the living room.",
  },
  {
    id: "3bhk",
    label: "Three bedroom",
    bhk: "3 BHK",
    builtUpSqft: 1697,
    builtUpSqm: 158,
    priceFrom: "₹1.05 Cr",
    priceTo: "₹1.24 Cr",
    plan: "/plans/plan-3bhk.svg",
    blurb: "A study off the kitchen, a master suite with its own bath, and two further bedrooms along the garden edge.",
  },
  {
    id: "4bhk",
    label: "Four bedroom",
    bhk: "4 BHK",
    builtUpSqft: 2333,
    builtUpSqm: 217,
    priceFrom: "₹1.48 Cr",
    priceTo: "₹1.79 Cr",
    plan: "/plans/plan-4bhk.svg",
    blurb: "Four bedrooms, a family room set apart from the living room, and a kitchen that runs the full depth of the plan.",
  },
];

export const PRICE_RANGE = { min: "₹48 Lakh", max: "₹1.79 Crore" } as const;

export const FACTS = [
  ["Configurations", "1, 2, 3 and 4 BHK"],
  ["Built-up area", "753 – 2,333 sq ft"],
  ["Structure", "RCC frame, warm-grey architectural concrete"],
  ["Façade", "Warm limestone and beige sandstone"],
  ["Possession", "Indicative — confirm with the site office"],
  ["Approvals", "Confirm with the site office"],
] as const;

/** Amenities, grouped the way a visitor actually asks about them. */
export const AMENITIES = [
  {
    group: "Leisure",
    items: [
      "Residents' clubhouse",
      "Outdoor lap pool",
      "Children's pool",
      "Indoor games room",
      "Residents' lounge and library",
      "Multipurpose hall",
    ],
  },
  {
    group: "Wellness",
    items: [
      "Fitness studio",
      "Open-air yoga deck",
      "Jogging and walking loop",
      "Reflexology path",
      "Steam and changing rooms",
      "Half basketball court",
    ],
  },
  {
    group: "Landscape",
    items: [
      "Central green",
      "Mature tree avenue",
      "Reflecting pool",
      "Children's play area",
      "Seating groves",
      "Ornamental grass gardens",
    ],
  },
  {
    group: "Everyday",
    items: [
      "Covered parking",
      "Visitor parking",
      "24 × 7 security and CCTV",
      "Power backup to common areas",
      "Rainwater harvesting",
      "Solar-assisted common lighting",
      "Waste segregation point",
      "EV charging provision",
    ],
  },
] as const;

/**
 * Distances are indicative and should be confirmed against a survey.
 *
 * `dir` is read off the supplied location plan, which states orientation and
 * no scale. `at` places the marker on that drawing by its stated direction —
 * it is a bearing, not a surveyed coordinate, and the section says so.
 */
/**
 * Destinations, with the category a visitor would actually filter by.
 *
 * `kind` classifies the entries already listed here — it does not add places.
 * No healthcare or transport destinations were supplied for this development,
 * so no such filter appears; the section says so rather than inventing one.
 */
export const PLACE_KINDS = ["Leisure", "Culture", "Retail", "Education"] as const;
export type PlaceKind = (typeof PLACE_KINDS)[number];

export const DISTANCES = [
  { place: "Retail hub", kind: "Retail", detail: "Daily shopping and pharmacy", km: 1.2, mins: 4, dir: "North east", at: [72, 30] },
  { place: "Botanical gardens", kind: "Leisure", detail: "Public gardens and glasshouse", km: 2.1, mins: 6, dir: "East", at: [83, 54] },
  { place: "Cultural district", kind: "Culture", detail: "Theatres and galleries", km: 2.8, mins: 8, dir: "South", at: [50, 80] },
  { place: "Modern art museum", kind: "Culture", detail: "Permanent collection", km: 3.4, mins: 9, dir: "South west", at: [30, 66] },
  { place: "University campus", kind: "Education", detail: "Faculties and sports grounds", km: 4.0, mins: 11, dir: "North west", at: [30, 26] },
  { place: "Lake", kind: "Leisure", detail: "Boating and promenade", km: 4.6, mins: 12, dir: "South east", at: [68, 72] },
  { place: "Riverfront", kind: "Leisure", detail: "Riverside walk", km: 5.2, mins: 14, dir: "South west", at: [20, 81] },
  { place: "Parklands", kind: "Leisure", detail: "Protected green belt", km: 5.9, mins: 15, dir: "West", at: [15, 42] },
] as const satisfies readonly { place: string; kind: PlaceKind; detail: string; km: number; mins: number; dir: string; at: readonly [number, number] }[];

export type FaqCategory =
  | "Pricing" | "Buying" | "Finance" | "Construction" | "Amenities" | "Location" | "Documents" | "Booking";
export type Faq = { q: string; a: string; tags: string[]; cat?: FaqCategory };

/**
 * Category is derived from the tags each question already carries rather than
 * hand-assigned, so a new question is filed the moment it is tagged and the
 * two can never disagree. First rule that matches wins.
 */
const CAT_RULES: [FaqCategory, string[]][] = [
  ["Finance", ["loan", "emi", "bank", "nri", "finance", "mortgage"]],
  ["Pricing", ["price", "cost", "rate", "charge", "tax", "stamp", "duty", "maintenance"]],
  ["Booking", ["book", "booking", "token", "visit", "site visit", "viewing", "contact"]],
  ["Documents", ["document", "agreement", "rera", "approval", "legal", "registration", "khata"]],
  ["Construction", ["possession", "handover", "construction", "structure", "quality", "warranty", "progress"]],
  ["Amenities", ["amenity", "amenities", "clubhouse", "pool", "gym", "parking", "pet", "security", "power", "water"]],
  ["Location", ["location", "distance", "nearby", "school", "hospital", "airport", "metro", "road"]],
];

export const categorise = (f: { q: string; a: string; tags: string[] }): FaqCategory => {
  const hay = `${f.q} ${f.tags.join(" ")}`.toLowerCase();
  for (const [cat, words] of CAT_RULES) if (words.some((w) => hay.includes(w))) return cat;
  return "Buying";
};

/** Searchable enquiry index. Tags widen what a query will match. */
export const FAQS: Faq[] = [
  { q: "What configurations are available?", a: "1, 2, 3 and 4 BHK residences, from 753 to 2,333 sq ft of built-up area. Drawn plans for each are in the Residences section.", tags: ["bhk","size","configuration","types","layout","1bhk","2bhk","3bhk","4bhk"] },
  { q: "What is the price range?", a: "Residences begin at ₹48 Lakh for a 1 BHK and run to ₹1.79 Crore for a 4 BHK. Figures shown on this page are indicative; the site office issues the current price list.", tags: ["price","cost","rate","budget","lakh","crore","how much"] },
  { q: "Is the price all-inclusive?", a: "No. Quoted figures are for the residence only. Stamp duty, registration, GST where applicable, and maintenance deposits are additional. Ask the site office for a full cost sheet.", tags: ["price","inclusive","stamp duty","registration","gst","charges","extra"] },
  { q: "Can I book a site visit?", a: `Yes. Call ${"+91 63880 42221"} or use the enquiry form at the foot of this page. Visits run daily, 7:00 – 11:00 and 16:00 – 19:00.`, tags: ["visit","site visit","tour","appointment","see","viewing","book"] },
  { q: "What is the booking amount?", a: "A booking amount reserves a specific unit and is adjusted against the first instalment. The current figure is confirmed by the site office at the time of booking.", tags: ["booking","token","advance","reserve","deposit"] },
  { q: "Do you offer a payment plan?", a: "Construction-linked and possession-linked plans are both available. The schedule is issued with the cost sheet so you can see every milestone before committing.", tags: ["payment","plan","instalment","emi","schedule","milestone"] },
  { q: "Are home loans available?", a: "Yes. The project is prepared for bank and housing-finance approval, and the site office can share the list of empanelled lenders and the documents each requires.", tags: ["loan","bank","finance","mortgage","emi","hdfc","sbi","approval"] },
  { q: "What documents do I need to book?", a: "Identity and address proof, PAN, passport photographs, and the booking amount. For a loan, lenders additionally ask for income proof and bank statements.", tags: ["documents","kyc","pan","aadhaar","paperwork","id"] },
  { q: "When is possession?", a: "Possession timelines are confirmed in writing at booking and are also printed on the allotment letter. Ask the site office for the current schedule for your chosen configuration.", tags: ["possession","handover","ready","completion","date","timeline","when"] },
  { q: "Can I see the construction progress?", a: "Yes. The site is open for progress visits during the hours above, and progress updates are shared with allottees.", tags: ["construction","progress","status","site","update","stage"] },
  { q: "What is the structure built from?", a: "An RCC frame in warm-grey architectural concrete, with a façade of warm limestone and beige sandstone, deep recessed window reveals and horizontal roof slabs.", tags: ["structure","construction","material","rcc","concrete","stone","facade","quality"] },
  { q: "What are the flooring and fittings?", a: "Limestone and warm-neutral stone flooring to living areas, natural teak joinery where a hand touches it, and slim charcoal metal window frames. A full specification sheet is available on request.", tags: ["flooring","fittings","finish","specification","teak","stone","interior","tiles"] },
  { q: "Can I customise the interiors?", a: "Limited customisation is possible if you book early enough in the construction cycle. Structural walls, façade and service routes cannot be altered.", tags: ["custom","customise","change","modify","interior","bespoke"] },
  { q: "Is parking included?", a: "Covered parking is allotted with each residence, and separate visitor parking is provided within the development. EV charging provision is included.", tags: ["parking","car","garage","ev","visitor","vehicle"] },
  { q: "What amenities are included?", a: "A clubhouse, lap pool, fitness studio, yoga deck, jogging loop, children's play area, residents' lounge and a central green, alongside everyday provisions such as security, power backup and rainwater harvesting. The full list is in the Amenities section.", tags: ["amenities","facilities","club","pool","gym","features","what do i get"] },
  { q: "Is there a clubhouse?", a: "Yes — a residents' clubhouse with a lounge and library, indoor games, a multipurpose hall, and changing rooms serving the pool and fitness studio.", tags: ["clubhouse","club","community","hall","lounge"] },
  { q: "Is there a swimming pool?", a: "Yes. An outdoor lap pool in dark stone with a shaded timber deck, and a separate shallow pool for children.", tags: ["pool","swimming","swim","lap","water"] },
  { q: "Is there a gym?", a: "Yes. A double-height fitness studio with a full glass wall onto the landscape, plus an open-air yoga and wellness deck under the tree canopy.", tags: ["gym","fitness","workout","exercise","yoga","wellness"] },
  { q: "Are pets allowed?", a: "Yes, within the association's rules on leashing in common areas and use of the landscaped greens.", tags: ["pets","dog","cat","animal"] },
  { q: "What security is provided?", a: "Gated access with 24 × 7 manned security, CCTV coverage of entries and common areas, and visitor management at the gate.", tags: ["security","safety","cctv","guard","gate","secure"] },
  { q: "Is there power backup?", a: "Power backup covers common areas, lifts and essential services. Backup provision to individual residences is confirmed in the specification sheet.", tags: ["power","backup","generator","electricity","dg"] },
  { q: "How is water supplied?", a: "A treated supply with underground and overhead storage, supported by rainwater harvesting across the site.", tags: ["water","supply","borewell","rainwater","tank","plumbing"] },
  { q: "What are the maintenance charges?", a: "Maintenance is billed per square foot per month and covers security, common-area upkeep, landscaping and equipment servicing. The current rate is confirmed by the site office.", tags: ["maintenance","charges","monthly","upkeep","society","fees"] },
  { q: "Who manages the development after handover?", a: "A facility management team operates the development until the residents' association is formed, after which the association appoints its own managing agent.", tags: ["management","association","society","rwa","facility","after handover"] },
  { q: "Is the project approved?", a: "Approval and registration details are provided in writing at the site office and are printed on the allotment documentation. Please ask to see them before booking.", tags: ["approval","rera","legal","sanction","permission","registered","clearance"] },
  { q: "Is the title clear?", a: "Title documents are available for inspection at the site office, and your solicitor is welcome to review them before you commit.", tags: ["title","legal","ownership","deed","clear","lawyer"] },
  { q: "Can NRIs buy here?", a: "Yes, subject to the usual RBI conditions on residential property. The site office can outline the documentation and remittance route.", tags: ["nri","foreign","overseas","abroad","rbi","international"] },
  { q: "Can I resell before possession?", a: "Transfer before possession is generally permitted subject to the terms of your agreement and a transfer charge. Confirm the specific terms at booking.", tags: ["resell","resale","transfer","sell","assign"] },
  { q: "What is the cancellation policy?", a: "Cancellation terms, including any deduction from the booking amount, are set out in the application form. Read that clause before you pay.", tags: ["cancel","cancellation","refund","withdraw","exit"] },
  { q: "How far is the nearest shopping?", a: "The retail hub is roughly 1.2 km, about four minutes by car. Key distances are listed in full in the Distances section.", tags: ["shopping","retail","market","grocery","shops","distance","near"] },
  { q: "What schools and colleges are nearby?", a: "The university campus is roughly 4 km. Distances to the cultural district, museum and gardens are listed in the Distances section.", tags: ["school","college","university","education","campus","children"] },
  { q: "Is public transport accessible?", a: "The development sits inside the ring road with direct access to the arterial routes shown on the location plan.", tags: ["transport","bus","metro","train","commute","connectivity","road"] },
  { q: "Is the landscape mature or newly planted?", a: "The planting is designed to read as mature, with established trees retained and reinforced rather than a newly turfed site.", tags: ["landscape","trees","garden","green","planting","mature"] },
  { q: "Are the images on this page photographs?", a: "No. All imagery is architectural visualisation of a proposed development and does not depict a completed building. Floor plans are indicative and not to scale.", tags: ["images","photos","real","render","visualisation","accurate","actual"] },
  { q: "How do I get a brochure or price list?", a: `Use the enquiry form below or write to ${"scribeostudio@gmail.com"} and the current brochure, price list and specification sheet will be sent to you.`, tags: ["brochure","price list","pdf","download","details","send","email"] },
  { q: "Who do I contact?", a: `Call ${"+91 63880 42221"} or email ${"scribeostudio@gmail.com"}. The enquiry form at the foot of this page reaches the same team.`, tags: ["contact","phone","email","call","reach","enquiry","talk"] },
];
