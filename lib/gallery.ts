import { A, type Asset } from "@/lib/assets";
import { CONFIGS } from "@/lib/content";

export type GalleryItem = Asset & {
  category: string;
  caption: string;
  drawing?: boolean;
  /** One of the six the section opens on. The rest are behind "View all". */
  pick?: true;
};

const g = (a: Asset, category: string, caption: string, pick?: boolean): GalleryItem =>
  ({ ...a, category, caption, ...(pick ? { pick: true } : {}) });

/**
 * The gallery holds the full collection so the page itself does not have to.
 * Only a handful of images earn a place in the flow of the page; the rest
 * live here, sorted the way someone actually browses a development.
 */
export const GALLERY: GalleryItem[] = [
  g(A.masterReference, "Exteriors", "The development at first light", true),
  g(A.exteriorWide, "Exteriors", "A residence in its clearing"),
  g(A.establishingDistant, "Exteriors", "Read from beyond the landscaped edge"),
  g(A.arrivalRoad, "Exteriors", "The internal road"),
  g(A.facadeStudy, "Exteriors", "The signature façade", true),
  g(A.vFacade, "Exteriors", "Three storeys of one bay"),
  g(A.lifestyleArrival, "Exteriors", "Arrival on foot"),

  g(A.livingRoom, "Interiors", "The sheltered living terrace", true),
  g(A.indoorOutdoor, "Interiors", "The threshold, drawn back", true),
  g(A.bedroom, "Interiors", "The bedroom pivot door"),
  g(A.bedroomAlt, "Interiors", "Morning light across the floor"),
  g(A.kitchen, "Interiors", "The kitchen volume"),
  g(A.kitchenAlt, "Interiors", "The kitchen from the garden"),
  g(A.bathroom, "Interiors", "Solid stone, worked thick"),
  g(A.vLightCorner, "Interiors", "Seven in the morning"),

  g(A.garden, "Landscape", "The garden at the heart", true),
  g(A.courtyard, "Landscape", "The courtyard between two houses"),
  g(A.pathway, "Landscape", "Stone laid loose in grass"),
  g(A.pavilion, "Landscape", "The garden pavilion"),
  g(A.benchSeating, "Landscape", "Where the shade falls at seven"),
  g(A.vPool, "Landscape", "Still enough to hold the sky"),
  g(A.vTreeWall, "Landscape", "One tree, one wall"),
  g(A.lifestylePathway, "Landscape", "The walk back"),

  g(A.amClubhouse, "Amenities", "The residents' clubhouse"),
  g(A.amPool, "Amenities", "The lap pool", true),
  g(A.amFitness, "Amenities", "The fitness studio"),
  g(A.amYoga, "Amenities", "The wellness deck"),
  g(A.amPlay, "Amenities", "The children's play area"),
  g(A.amTrail, "Amenities", "The jogging loop"),
  g(A.amGreen, "Amenities", "The central green"),
  g(A.amLounge, "Amenities", "The residents' lounge"),

  g(A.entranceThreshold, "Details", "The entrance threshold"),
  g(A.vThreshold, "Details", "The door, set back from the weather"),
  g(A.materialDetail, "Details", "Travertine meeting glass and teak"),
  g(A.windowAperture, "Details", "The reveal as an aperture"),
  g(A.vMaterial, "Details", "Teak, shadow gap, plaster, travertine"),
  g(A.vRoofSlab, "Details", "The slab, from beneath"),

  ...CONFIGS.map((c) => ({
    src: c.plan,
    alt: `${c.bhk} floor plan: ${c.label}, ${c.builtUpSqft} square feet built-up.`,
    w: 1200,
    h: 900,
    category: "Floor plans",
    caption: `${c.bhk} · ${c.builtUpSqft.toLocaleString("en-IN")} sq ft`,
    drawing: true,
  })),
];

export const CATEGORIES = [
  "All",
  "Exteriors",
  "Interiors",
  "Landscape",
  "Amenities",
  "Details",
  "Floor plans",
] as const;
