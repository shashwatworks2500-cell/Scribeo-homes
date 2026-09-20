import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { CONFIGS, CONTACT, FAQS, PRICE_RANGE } from "@/lib/content";
import { HERO_FIRST } from "@/lib/assets";
import "./globals.css";

/* Display: high-contrast garamond. Echoes the inscribed roman capitals on the
   supplied location plan and carries the architectural-monograph register. */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/* Sans: geometric grotesque in the Futura lineage — the typographic tradition
   of modern architecture. Used for eyebrows, navigation, metadata and body. */
const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  // Resolved from the platform, never hardcoded — see lib/site.ts.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Contemporary residences set in mature landscape`,
    template: `%s · ${SITE_NAME}`,
  },
  description: `${SITE_DESCRIPTION} 1, 2, 3 and 4 BHK from ${PRICE_RANGE.min}.`,
  keywords: ["Scribeo Homes","1 BHK","2 BHK","3 BHK","4 BHK","residences","floor plans","amenities"],
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_NAME,
    description:
      "Contemporary residences in limestone, warm concrete, glass and teak, set within mature landscape.",
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    images: [{ url: "/hero/poster.webp", width: 1920, height: 1080, alt: "Scribeo Homes at first light" }],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

/* Structured data. Deliberately minimal: name, description, canonical URL and
   the poster frame. No address, price, unit count or rating — none of those
   exist in the supplied material, and inventing them for a rich result would
   be fabricating property facts. */
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ResidentialComplex",
      "@id": `${SITE_URL}#development`,
      name: SITE_NAME,
      url: SITE_URL,
      description: SITE_DESCRIPTION,
      image: `${SITE_URL}/hero/poster.webp`,
      telephone: CONTACT.phoneDisplay,
      email: CONTACT.email,
      numberOfAvailableAccommodationUnits: CONFIGS.length,
      /* Each configuration as an Accommodation, with the areas the page
         prints. Prices are deliberately absent from the markup: they are
         indicative placeholders on this site, and an indicative figure
         published as an offer in structured data is a different claim. */
      containsPlace: CONFIGS.map((c) => ({
        "@type": "Accommodation",
        name: `${c.bhk} — ${c.label}`,
        numberOfRooms: Number.parseInt(c.bhk, 10),
        floorSize: { "@type": "QuantitativeValue", value: c.builtUpSqft, unitCode: "FTK" },
        description: c.blurb,
      })),
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#questions`,
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/hero/poster.webp`,
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    email: CONTACT.email,
    telephone: CONTACT.phoneDisplay,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: CONTACT.phoneDisplay,
      email: CONTACT.email,
      availableLanguage: ["en", "hi"],
    },
  },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#fbfaf7",
  // The page went light; this still said dark, which is what the browser uses
  // to pick form-control and scrollbar rendering.
  colorScheme: "light",
};

/* Progressive enhancement, with a failsafe.
   `js` switches on the hidden-until-revealed styles. If the motion layer never
   boots (JS error, slow chunk, blocked script), the class is removed again and
   the page renders as complete static content. Content is never lost to JS. */
const BOOT = `
document.documentElement.classList.add('js');
setTimeout(function(){
  if(document.documentElement.dataset.motion!=='ready'){
    document.documentElement.classList.remove('js');
  }
},2500);
// Curtain failsafe. The curtain lifts from a React effect; if hydration never
// happens (a chunk 404s, a slow network drops a script), that effect never
// runs and the curtain would cover a fully-rendered page forever. This timer
// is plain inline script with no dependency on the bundle, so it fires
// regardless. CSS keyed on the attribute removes the curtain.
setTimeout(function(){
  if(document.documentElement.dataset.curtain!=='lifted'){
    document.documentElement.dataset.curtain='failsafe';
    document.documentElement.style.overflow='';
  }
},4500);
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        {/* First hero frame, preloaded per tier. `type` means a browser without
            AVIF skips it rather than fetching a file it cannot decode; `media`
            keeps phones off the 1536px set. */}
        <link
          rel="preload"
          as="image"
          href={HERO_FIRST.desktop}
          type="image/avif"
          media="(min-width: 768px)"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href={HERO_FIRST.mobile}
          type="image/avif"
          media="(max-width: 767px)"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-ground t-meta"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
