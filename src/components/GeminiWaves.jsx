/**
 * GeminiWaves — animated flowing neon waves (blue → purple → pink)
 * -----------------------------------------------------------------
 * Google Gemini style — thin glowing curved lines jo continuously flow
 * karti hain. Sirf SVG hai (no WebGL) — light-weight aur reliable.
 *
 * Har wave ek sinusoidal path hai jo <animate> se subtly phase shift karti hai;
 * multiple waves ek doosre pe stack karti hain to combined neon river banti hai.
 *
 * Usage:
 *   <div className="absolute inset-0"><GeminiWaves /></div>
 */
export default function GeminiWaves({ opacity = 1 }) {
  /* Har wave: base amplitude, base y offset, gradient stroke, duration, delay */
  const waves = [
    { id: "gw-1", stroke: "url(#gwPink)",   y: 260, amp: 60,  dur: 12, w: 3.0, blur: 8 },
    { id: "gw-2", stroke: "url(#gwCyan)",   y: 285, amp: 55,  dur: 14, w: 2.6, blur: 7 },
    { id: "gw-3", stroke: "url(#gwPurple)", y: 310, amp: 65,  dur: 11, w: 2.2, blur: 6 },
    { id: "gw-4", stroke: "url(#gwPink)",   y: 335, amp: 50,  dur: 15, w: 1.8, blur: 5 },
    { id: "gw-5", stroke: "url(#gwCyan)",   y: 360, amp: 58,  dur: 13, w: 1.5, blur: 5 },
    { id: "gw-6", stroke: "url(#gwPurple)", y: 240, amp: 45,  dur: 16, w: 1.4, blur: 5 },
    { id: "gw-7", stroke: "url(#gwPink)",   y: 380, amp: 42,  dur: 17, w: 1.2, blur: 4 },
  ];

  /* Ek smooth sinusoid path banata hai — full width pe multiple cycles.
     Phase shift ke saath call kar ke same shape ke slightly different frames milte hain. */
  const buildWave = (yBase, amp, phase = 0) => {
    const points = [];
    const steps = 60;
    const width = 1600;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      const t = (i / steps) * Math.PI * 4 + phase;
      const y = yBase + Math.sin(t) * amp + Math.sin(t * 0.5 + 1.2) * (amp * 0.3);
      points.push([x, y]);
    }
    // Convert to cubic-smooth path
    let d = `M ${points[0][0]},${points[0][1]}`;
    for (let i = 1; i < points.length; i++) {
      const [x, y] = points[i];
      const [px, py] = points[i - 1];
      const cx = (px + x) / 2;
      d += ` Q ${px},${py} ${cx},${(py + y) / 2}`;
    }
    return d;
  };

  return (
    <svg
      viewBox="0 0 1600 620"
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full"
      style={{ opacity }}
    >
      <defs>
        {/* Neon color gradients — Gemini-style */}
        <linearGradient id="gwPink" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#0891b2" />
          <stop offset="35%"  stopColor="#a855f7" />
          <stop offset="65%"  stopColor="#ec4899" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <linearGradient id="gwCyan" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#38bdf8" />
          <stop offset="50%"  stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
        <linearGradient id="gwPurple" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor="#818cf8" />
          <stop offset="50%"  stopColor="#a855f7" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>

        {/* Glow filter — neon feel */}
        <filter id="gwGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Har wave ke apne path variations — animate karne ke liye */}
        {waves.map((w) => (
          <g key={w.id}>
            <path id={`${w.id}-p0`} d={buildWave(w.y, w.amp, 0)} />
            <path id={`${w.id}-p1`} d={buildWave(w.y, w.amp, Math.PI * 0.5)} />
            <path id={`${w.id}-p2`} d={buildWave(w.y, w.amp, Math.PI)} />
            <path id={`${w.id}-p3`} d={buildWave(w.y, w.amp, Math.PI * 1.5)} />
          </g>
        ))}
      </defs>

      {/* Render har wave — <animate> se path values ke beech morph */}
      <g filter="url(#gwGlow)">
        {waves.map((w) => (
          <path
            key={w.id}
            fill="none"
            stroke={w.stroke}
            strokeWidth={w.w}
            strokeLinecap="round"
            style={{
              filter: `drop-shadow(0 0 ${w.blur}px rgba(168,85,247,0.5))`,
            }}
          >
            <animate
              attributeName="d"
              dur={`${w.dur}s`}
              repeatCount="indefinite"
              values={[
                buildWave(w.y, w.amp, 0),
                buildWave(w.y, w.amp, Math.PI * 0.5),
                buildWave(w.y, w.amp, Math.PI),
                buildWave(w.y, w.amp, Math.PI * 1.5),
                buildWave(w.y, w.amp, Math.PI * 2),
              ].join(";")}
              keyTimes="0;0.25;0.5;0.75;1"
              calcMode="spline"
              keySplines="0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1;0.42 0 0.58 1"
            />
          </path>
        ))}
      </g>

      {/* Sparkle dots — random glowing dots for extra pop */}
      <g>
        {Array.from({ length: 24 }).map((_, i) => {
          const cx = (i * 137) % 1600;
          const cy = 220 + ((i * 79) % 220);
          const r = 1 + (i % 3) * 0.5;
          const dur = 3 + (i % 4);
          const color = i % 3 === 0 ? "#ec4899" : i % 3 === 1 ? "#38bdf8" : "#a855f7";
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={r}
              fill={color}
              style={{ filter: `drop-shadow(0 0 6px ${color})` }}
            >
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur={`${dur}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        })}
      </g>
    </svg>
  );
}
