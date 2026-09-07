import { useEffect, useState } from "react";
import { personal } from "../data/portfolioData";

/**
 * Loader — cinematic intro screen
 * -------------------------------
 * - Poora screen dark bhar deta hai
 * - Beech mein gradient logo/initials + percentage counter animate hota hai
 * - ~1.6s baad curtain upar ki taraf slide ho ke site reveal karta hai
 * - Repeat visit pe skip (sessionStorage flag)
 *
 * Usage: <Loader onFinish={() => setReady(true)} />
 *
 * Note: hum yahan framer-motion ke bajaye plain CSS transitions use kar rahe
 * hain — Lenis/GSAP ticker ke saath yeh zyada reliable hai.
 */
export default function Loader({ onFinish, brand = "P" }) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState("show"); // "show" | "exit" | "gone"

  useEffect(() => {
    // NOTE: sessionStorage skip hata diya — user chahte hain har refresh pe
    // loader chale (portfolio first-time impact + testing dono ke liye).

    // Percentage counter — 0 se 100 tak ~1.6s mein pahonchega
    const duration = 1600;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      // Ease-out cubic — pehle tez, aakhir mein slow (organic feel)
      const eased = 1 - Math.pow(1 - t, 3);
      setPercent(Math.round(eased * 100));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Progress khatm — thoda hold, phir curtain uthega
        setTimeout(() => {
          setPhase("exit");
          setTimeout(() => {
            setPhase("gone");
            onFinish?.();
          }, 950);
        }, 350);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (phase === "gone") return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-bg-primary"
      style={{
        // Exit hote hi upar slide ho ke reveal — CSS transition, easy on Lenis
        transform: phase === "exit" ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.9s cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
      }}
    >
      {/* Ambient glow — accent color ki soft aura */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.12), transparent 60%)",
        }}
      />

      {/* Center stack: brand mark + counter + progress bar */}
      <div className="relative flex flex-col items-center gap-8 px-8">
        {/* Brand mark — bigger dual ring + hero photo in center */}
        <div className="relative animate-[loaderPop_0.8s_ease-out]">
          <svg
            viewBox="0 0 200 200"
            className="w-44 h-44 md:w-56 md:h-56"
            aria-hidden
          >
            <defs>
              <linearGradient id="loaderGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
              {/* Circular mask for photo */}
              <clipPath id="loaderPhotoClip">
                <circle cx="100" cy="100" r="62" />
              </clipPath>
            </defs>

            {/* Rotating outer dashed ring */}
            <circle
              cx="100"
              cy="100"
              r="94"
              fill="none"
              stroke="url(#loaderGrad)"
              strokeWidth="1.5"
              strokeDasharray="8 12"
              style={{
                transformOrigin: "100px 100px",
                animation: "loaderSpin 6s linear infinite",
              }}
            />

            {/* Middle progress ring — pathLength percent draw */}
            <circle
              cx="100"
              cy="100"
              r="76"
              fill="none"
              stroke="url(#loaderGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="100"
              strokeDashoffset={100 - percent}
              style={{
                transform: "rotate(-90deg)",
                transformOrigin: "100px 100px",
                filter: "drop-shadow(0 0 10px rgba(56,189,248,0.7))",
                transition: "stroke-dashoffset 0.15s linear",
              }}
            />

            {/* Inner glass ring around photo */}
            <circle
              cx="100"
              cy="100"
              r="64"
              fill="rgba(15,23,42,0.6)"
              stroke="rgba(56,189,248,0.5)"
              strokeWidth="1"
            />

            {/* Hero photo — clipped to circle */}
            <image
              href={personal.profilePhoto}
              x="30"
              y="35"
              width="140"
              height="140"
              clipPath="url(#loaderPhotoClip)"
              preserveAspectRatio="xMidYMid slice"
              style={{
                filter: "drop-shadow(0 0 12px rgba(56,189,248,0.5))",
              }}
            />

            {/* Subtle scan line across photo */}
            <line
              x1="38"
              x2="162"
              y1="100"
              y2="100"
              stroke="rgba(56,189,248,0.6)"
              strokeWidth="0.6"
              style={{ animation: "loaderScan 2s ease-in-out infinite" }}
            />
          </svg>

          {/* Brand tag beneath photo — subtle */}
          <span
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-bg-primary/85 backdrop-blur px-3 py-1 text-[10px] font-mono uppercase tracking-widest border border-white/10 text-text-primary"
            aria-hidden
          >
            <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
            {brand}
          </span>
        </div>

        {/* Counter */}
        <div className="flex items-baseline gap-1 font-mono text-text-primary">
          <span className="text-2xl md:text-3xl font-semibold tabular-nums">
            {String(percent).padStart(3, "0")}
          </span>
          <span className="text-text-muted text-sm">%</span>
        </div>

        {/* Progress bar */}
        <div className="w-56 md:w-72 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${percent}%`,
              background: "linear-gradient(90deg, #38bdf8, #818cf8)",
              boxShadow: "0 0 10px rgba(56,189,248,0.6)",
              transition: "width 0.15s linear",
            }}
          />
        </div>

        <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
          Booting portfolio…
        </p>
      </div>

      {/* Inline keyframes — is loader ke liye local */}
      <style>{`
        @keyframes loaderSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes loaderPop {
          from { transform: scale(0.7); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
        @keyframes loaderScan {
          0%   { transform: translateY(-60px); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { transform: translateY(60px);  opacity: 0; }
        }
      `}</style>
    </div>
  );
}
