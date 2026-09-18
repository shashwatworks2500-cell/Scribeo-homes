/**
 * Canonical site origin.
 *
 * Hardcoding a production URL is the classic deploy-day bug: Open Graph and
 * Twitter image paths resolve against the wrong origin and every share preview
 * breaks. Resolve it from the platform instead, in priority order:
 *
 *  1. NEXT_PUBLIC_SITE_URL      — an explicit custom domain, once one exists
 *  2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *  3. VERCEL_URL                — this specific deployment (preview builds)
 *  4. localhost                 — local development
 */
const fromEnv =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

export const SITE_URL = fromEnv.replace(/\/$/, "");

/** True only on a Vercel production deployment. */
export const IS_PRODUCTION = process.env.VERCEL_ENV === "production";

export const SITE_NAME = "Scribeo Homes";
export const SITE_DESCRIPTION =
  "Scribeo Homes is a collection of contemporary residences in limestone, warm concrete, glass and teak, set within mature landscape and organised around light, threshold and privacy.";
