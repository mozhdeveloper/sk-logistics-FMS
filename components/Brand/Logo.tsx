import Image from "next/image";

interface LogoProps {
  /** size in pixels for the icon tile */
  size?: number;
  /** show wordmark next to the icon */
  showWordmark?: boolean;
  /** force light text (use on dark backgrounds) */
  light?: boolean;
  /** wordmark visual scale */
  wordmarkSize?: "sm" | "md" | "lg";
  className?: string;
}

const WORDMARK_TEXT: Record<NonNullable<LogoProps["wordmarkSize"]>, string> = {
  sm: "text-base",
  md: "text-2xl",
  lg: "text-3xl",
};
const TAGLINE_TEXT: Record<NonNullable<LogoProps["wordmarkSize"]>, string> = {
  sm: "text-[8px] tracking-[0.3em] mt-0.5",
  md: "text-[10px] tracking-[0.4em] mt-1",
  lg: "text-[11px] tracking-[0.4em] mt-1",
};

/**
 * SK Logistics Services brand logo.
 * Uses the actual logo image from /public/logo.jpg.
 */
export function Logo({
  size = 56,
  showWordmark = true,
  light = false,
  wordmarkSize = "md",
  className = "",
}: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative shrink-0 rounded-xl overflow-hidden bg-white shadow-md ring-1 ring-brand-border"
        style={{ width: size, height: size }}
      >
        <Image
          src="/logo.jpg"
          alt="SK Logistics Services"
          fill
          sizes={`${size}px`}
          className="object-contain p-1"
          priority
        />
      </div>
      {showWordmark && (
        <div className="text-left leading-none">
          <div
            className={`font-display ${WORDMARK_TEXT[wordmarkSize]} font-black italic tracking-tight ${
              light ? "text-white" : "text-brand-charcoal"
            }`}
          >
            SK <span className="text-brand-red">LOGISTICS</span>
          </div>
          <div
            className={`${TAGLINE_TEXT[wordmarkSize]} font-bold ${
              light ? "text-brand-red-light" : "text-brand-red"
            }`}
          >
            SERVICES
          </div>
        </div>
      )}
    </div>
  );
}

export default Logo;
