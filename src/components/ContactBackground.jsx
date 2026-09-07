import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * ContactBackground — "signal transmission" cinematic bg
 * ------------------------------------------------------
 * Contact section ka apna alag 3D animated bg — grid ke baad shift feel de.
 *
 * Elements:
 *  - Concentric pulsing rings (sonar/radio waves) center se emanate karti hain
 *  - Rotating constellation of connected dots (network / broadcast web)
 *  - Ambient stars + soft glow orbs
 *  - Scroll pe: constellation rotate accelerate hoti hai, rings expand faster,
 *    aur camera zoom-in ka feel deta hai
 */
export default function ContactBackground({ triggerSelector }) {
  const wrapRef = useRef(null);
  const constellationRef = useRef(null);
  const ringsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = triggerSelector
        ? document.querySelector(triggerSelector)
        : wrapRef.current?.parentElement;
      if (!trigger) return;

      /* ---------- CROSS-FADE IN ----------
         Same trigger + range as PerspectiveGrid ka fade-out — dono
         simultaneously animate hote hain, tight crossfade. */
      // Base state — force hidden initial
      gsap.set(wrapRef.current, { opacity: 0 });
      gsap.to(wrapRef.current, {
        opacity: 1,
        ease: "none",
        immediateRender: false,
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "top 40%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /* Constellation rotates + scales slowly on scroll */
      gsap.to(constellationRef.current, {
        rotate: 60,
        scale: 1.2,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* Rings SVG scales + brightens on scroll */
      gsap.fromTo(
        ringsRef.current,
        { scale: 0.85 },
        {
          scale: 1.15,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    }, wrapRef);
    return () => ctx.revert();
  }, [triggerSelector]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden"
      style={{
        // Same sticky-negative-margin pattern jaisi PerspectiveGrid
        marginBottom: "-100vh",
        zIndex: 1,   // grid ke oopar layer taake cross-fade sahi lage
      }}
    >
      {/* Layer 1: subtle background gradient — deep navy → purple → dark */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.12), rgba(168,85,247,0.08) 30%, #030712 70%)",
        }}
      />

      {/* Layer 2: pulsing sonar rings — SVG */}
      <div
        ref={ringsRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "50% 50%" }}
      >
        <svg
          viewBox="-200 -200 400 400"
          className="w-[130vh] h-[130vh] max-w-[1600px] max-h-[1600px]"
        >
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#818cf8" />
            </linearGradient>
          </defs>
          {/* 6 rings — each with animated stroke + fade */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              cx="0"
              cy="0"
              r={40 + i * 25}
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth={i % 2 === 0 ? 1.2 : 0.7}
              strokeDasharray={i % 2 === 0 ? "0" : "4 6"}
              style={{
                opacity: 0.6 - i * 0.06,
                transformOrigin: "0 0",
                animation: `sonarPulse ${5 + i * 0.8}s ease-in-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
          {/* Center core dot with glow */}
          <circle
            cx="0"
            cy="0"
            r="4"
            fill="#38bdf8"
            style={{
              filter: "drop-shadow(0 0 8px #38bdf8) drop-shadow(0 0 16px #818cf8)",
              animation: "corePulse 2.5s ease-in-out infinite",
            }}
          />
        </svg>
      </div>

      {/* Layer 3: rotating constellation of dots + connecting lines */}
      <div
        ref={constellationRef}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformOrigin: "50% 50%" }}
      >
        <svg viewBox="-400 -400 800 800" className="w-[90vh] h-[90vh] max-w-[1200px] max-h-[1200px]">
          {(() => {
            // 14 dots orbiting at random radii
            const dots = Array.from({ length: 14 }).map((_, i) => {
              const angle = (i * (360 / 14)) * (Math.PI / 180);
              const radius = 180 + ((i * 47) % 180);
              return {
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                size: 2 + (i % 4),
              };
            });
            // Connect each dot to next few — cobweb-like
            const lines = [];
            for (let i = 0; i < dots.length; i++) {
              for (let j = i + 1; j < dots.length; j++) {
                const dx = dots[i].x - dots[j].x;
                const dy = dots[i].y - dots[j].y;
                const d = Math.hypot(dx, dy);
                if (d < 260) lines.push({ a: dots[i], b: dots[j], op: 1 - d / 260 });
              }
            }
            return (
              <>
                <g>
                  {lines.map((l, idx) => (
                    <line
                      key={idx}
                      x1={l.a.x}
                      y1={l.a.y}
                      x2={l.b.x}
                      y2={l.b.y}
                      stroke="#38bdf8"
                      strokeWidth="0.4"
                      opacity={l.op * 0.4}
                    />
                  ))}
                </g>
                <g>
                  {dots.map((d, idx) => (
                    <circle
                      key={idx}
                      cx={d.x}
                      cy={d.y}
                      r={d.size}
                      fill={idx % 3 === 0 ? "#ec4899" : idx % 3 === 1 ? "#38bdf8" : "#a5f3fc"}
                      style={{
                        filter: `drop-shadow(0 0 ${d.size * 3}px currentColor)`,
                        animation: `constellationTwinkle ${3 + (idx % 5)}s ease-in-out ${idx * 0.2}s infinite`,
                      }}
                    />
                  ))}
                </g>
              </>
            );
          })()}
        </svg>
      </div>

      {/* Layer 4: ambient stars — non-scroll */}
      {Array.from({ length: 40 }).map((_, i) => {
        const size = 1 + (i % 3);
        const left = (i * 137) % 100;
        const top = (i * 79) % 100;
        const dur = 3 + (i % 5);
        return (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: i % 2 === 0 ? "#38bdf8" : "#a5f3fc",
              boxShadow: `0 0 ${size * 4}px currentColor`,
              opacity: 0.35,
              animation: `starTwinkle ${dur}s ease-in-out infinite ${(i * 0.13) % 2}s`,
            }}
          />
        );
      })}

      <style>{`
        @keyframes sonarPulse {
          0%, 100% { transform: scale(1);   opacity: var(--o, 0.6); }
          50%      { transform: scale(1.08); opacity: 0.85; }
        }
        @keyframes corePulse {
          0%, 100% { transform: scale(1);   }
          50%      { transform: scale(1.8); }
        }
        @keyframes constellationTwinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%      { opacity: 1;   transform: scale(1.4); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.2; }
          50%      { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
}
