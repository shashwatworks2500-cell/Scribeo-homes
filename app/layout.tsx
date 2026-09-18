import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site";
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
  description: SITE_DESCRIPTION,
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
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  image: `${SITE_URL}/hero/poster.webp`,
  publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
};

export const viewport: Viewport = {
  themeColor: "#0b0a08",
  colorScheme: "dark",
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
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <link rel="preload" as="image" href="/hero/desktop/f001.webp" fetchPriority="high" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-stone focus:px-4 focus:py-2 focus:text-ink t-meta"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
