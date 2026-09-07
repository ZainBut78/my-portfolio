/**
 * ShinyText — React Bits inspired shimmer text
 * ---------------------------------------------
 * Ek animated gradient text jismein shine ki ek stripe left-to-right sweep karti hai.
 * Halka, no dep — inline CSS keyframe se chalta hai.
 *
 * Props:
 *   text: string       — dikhane wala content
 *   speed: number      — sweep ki duration seconds mein (default 4s)
 *   className: string  — Tailwind classes for size/weight
 *   colors: string[]   — gradient colors (default: sky → indigo → sky)
 */
export default function ShinyText({
  text,
  speed = 4,
  className = "text-6xl font-extrabold",
  colors = ["#38bdf8", "#818cf8", "#38bdf8"],
}) {
  const gradient = `linear-gradient(90deg, ${colors[0]} 0%, ${colors[1]} 20%, #ffffff 50%, ${colors[1]} 80%, ${colors[2]} 100%)`;

  return (
    <span
      className={`inline-block ${className}`}
      style={{
        backgroundImage: gradient,
        backgroundSize: "200% 100%",
        backgroundClip: "text",
        WebkitBackgroundClip: "text",
        color: "transparent",
        animation: `shinySweep ${speed}s linear infinite`,
        // Halka glow taake shimmer aur pop kare
        filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))",
      }}
    >
      {text}
      <style>{`
        @keyframes shinySweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </span>
  );
}
