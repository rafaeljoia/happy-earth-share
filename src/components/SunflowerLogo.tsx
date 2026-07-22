export function SunflowerLogo({
  size = 40,
  className = "",
  animated = false,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={`${animated ? "sunflower-spin" : ""} ${className}`.trim()}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(32 32)">
        {Array.from({ length: 12 }).map((_, i) => (
          <ellipse
            key={i}
            cx="0"
            cy="-18"
            rx="6"
            ry="12"
            fill="oklch(0.8 0.14 88)"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <circle r="9" fill="oklch(0.35 0.08 60)" />
        <circle r="6" fill="oklch(0.25 0.06 50)" />
      </g>
    </svg>
  );
}
