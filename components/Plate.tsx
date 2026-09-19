import Image from "next/image";
import type { Asset } from "@/lib/assets";

type Props = {
  asset: Asset;
  /** Aspect ratio of the crop, e.g. "4/5". Omit to use the asset's own. */
  ratio?: string;
  /** Wipe the plate up from its lower edge on entry. */
  clip?: boolean;
  /** Parallax travel in percent. Capped at 6 — never exposes an edge. */
  parallax?: number;
  priority?: boolean;
  sizes?: string;
  className?: string;
  /** Rendered beneath the plate as a caption. */
  caption?: string;
};

/**
 * An image plate. Owns cropping, the reveal contract and parallax so no
 * section reimplements them — and so the motion budget stays countable.
 */
export default function Plate({
  asset,
  ratio,
  clip = true,
  parallax,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  caption,
}: Props) {
  const hasParallax = typeof parallax === "number" && parallax > 0;
  const travel = Math.min(parallax ?? 0, 6);

  return (
    <figure className={className}>
      <div
        {...(clip ? { "data-reveal-clip": "" } : {})}
        className="relative overflow-hidden bg-ground-2"
        style={{ aspectRatio: ratio ?? `${asset.w}/${asset.h}` }}
      >
        <div
          {...(hasParallax ? { "data-parallax": String(travel) } : {})}
          className="absolute inset-0"
          style={hasParallax ? { top: `-${travel}%`, bottom: `-${travel}%` } : undefined}
        >
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            sizes={sizes}
            priority={priority}
            quality={82}
            className="object-cover"
          />
        </div>
      </div>
      {caption ? (
        <figcaption className="t-meta mt-4 text-ink-faint">{caption}</figcaption>
      ) : null}
    </figure>
  );
}
