/**
 * The icon set. One family, drawn on a 24px grid with a 1.5px stroke that
 * stays 1.5px at every size (non-scaling), square ends, mitred joins — the
 * same precise line the floor plans are drawn in. Nothing on the site uses a
 * text glyph or an emoji as an icon.
 */
const PATHS = {
  search: "M16 16L20.5 20.5M17.5 10.5a7 7 0 1 1-14 0a7 7 0 0 1 14 0Z",
  close: "M6 6L18 18M18 6L6 18",
  plus: "M12 5V19M5 12H19",
  minus: "M5 12H19",
  "chevron-down": "M6 9.5L12 15.5L18 9.5",
  "arrow-right": "M4 12H19.5M13.5 6L19.5 12L13.5 18",
  "arrow-left": "M20 12H4.5M10.5 6L4.5 12L10.5 18",
  reset: "M4 12a8 8 0 1 0 2.35-5.66M4 4.5V8.5H8",
  expand: "M4 9V4H9M15 4H20V9M20 15V20H15M9 20H4V15",
  check: "M5 12.5L9.5 17L19 7.5",
  alert: "M12 7.5V13M12 16V16.5M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z",
} as const;

export type IconName = keyof typeof PATHS;

export default function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="square"
      strokeLinejoin="miter"
      className={`shrink-0 ${className}`}
      data-icon={name}
    >
      <path d={PATHS[name]} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
