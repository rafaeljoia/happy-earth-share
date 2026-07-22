export function SunflowerLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
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
            fill="oklch(0.86 0.16 92)"
            transform={`rotate(${i * 30})`}
          />
        ))}
        <circle r="9" fill="oklch(0.35 0.08 60)" />
        <circle r="6" fill="oklch(0.25 0.06 50)" />
      </g>
    </svg>
  );
}
