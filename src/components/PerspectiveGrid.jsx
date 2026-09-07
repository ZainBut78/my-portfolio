import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * PerspectiveGrid — cinematic 3D background for Skills → Projects → Experience
 * ----------------------------------------------------------------------------
 *  - Sticky, viewport-height, spans grid-zone parent
 *  - Grid perspective-rotated, scroll pe zoom-in + upright + brighten
 *  - Hyperspace star-streams: har star scroll pe center se bahar fly karta hai
 *  - Horizon glow amplify hoti hai
 *  - Camera ka feel: user perspective ke andar dive kar raha
 */
export default function PerspectiveGrid({ triggerSelector }) {
  const wrapRef = useRef(null);
  const gridRef = useRef(null);
  const starsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const trigger = triggerSelector
        ? document.querySelector(triggerSelector)
        : wrapRef.current?.parentElement;
      if (!trigger) return;

      /* ---------- Grid base transform ---------- */
      gsap.set(gridRef.current, {
        transformOrigin: "50% 100%",
        rotationX: 62,
        yPercent: -8,
        scale: 1,
      });

      /* Scroll: grid pans up + zooms in + rotates more upright */
      gsap.to(gridRef.current, {
        backgroundPositionY: "+=2400",
        scale: 2.2,
        rotationX: 74,
        ease: "none",
        scrollTrigger: {
          trigger,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ---------- Hyperspace star streams — scroll pe center se bahar fly ---------- */
      const stars = starsRef.current?.querySelectorAll("[data-star]") ?? [];
      stars.forEach((star, i) => {
        // Har star ki ek unique flight direction — center se outward
        const angle = (i * 137.5) % 360;   // golden angle spread
        const distance = 500 + (i % 5) * 150;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * distance;
        const y = Math.sin(rad) * distance;

        gsap.fromTo(
          star,
          { x: 0, y: 0, scale: 0.3, opacity: 0 },
          {
            x, y,
            scale: 1.6,
            opacity: 1,
            ease: "power2.in",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2,
            },
          },
        );
      });

      /* ---------- Horizon glow brightens ---------- */
      const glow = wrapRef.current?.querySelector("[data-glow]");
      if (glow) {
        gsap.fromTo(
          glow,
          { opacity: 0.5, scale: 1 },
          {
            opacity: 1, scale: 1.6,
            ease: "none",
            scrollTrigger: {
              trigger,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }

      /* ---------- Vignette darkens edges ---------- */
      const vignette = wrapRef.current?.querySelector("[data-vignette]");
      if (vignette) {
        gsap.to(vignette, {
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }

      /* ---------- CROSS-FADE OUT ----------
         Contact section approach karte hi grid fade karti hai — same
         trigger (Contact section) use karta hai jo ContactBackground fade-in
         karta hai, taake dono ki timing exact same rahe (tight crossfade). */
      const contact = document.querySelector("#contact");
      if (contact) {
        gsap.set(wrapRef.current, { opacity: 1 });
        gsap.to(wrapRef.current, {
          opacity: 0,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: contact,
            start: "top bottom",
            end: "top 40%",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
      }
    }, wrapRef);
    return () => ctx.revert();
  }, [triggerSelector]);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none sticky top-0 h-screen w-full overflow-hidden"
      style={{
        marginBottom: "-100vh",
        zIndex: 0,
        perspective: "600px",
      }}
    >
      {/* Grid — bottom-anchored, transform via GSAP */}
      <div
        ref={gridRef}
        className="absolute inset-x-0 bottom-0 h-[160%]"
        style={{
          backgroundImage: [
            "linear-gradient(rgba(56,189,248,0.28) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(56,189,248,0.28) 1px, transparent 1px)",
            "linear-gradient(rgba(56,189,248,0.5) 1.5px, transparent 1.5px)",
            "linear-gradient(90deg, rgba(56,189,248,0.5) 1.5px, transparent 1.5px)",
          ].join(", "),
          backgroundSize: "60px 60px, 60px 60px, 240px 240px, 240px 240px",
          maskImage: "linear-gradient(to top, black 30%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 30%, transparent 100%)",
        }}
      />

      {/* Horizon glow */}
      <div
        data-glow
        className="absolute inset-x-0 top-[28%] h-48"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(56,189,248,0.4), transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      {/* Hyperspace star field — scroll pe center se bahar fly karti hai */}
      <div
        ref={starsRef}
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{ width: 0, height: 0 }}
      >
        {Array.from({ length: 60 }).map((_, i) => {
          const size = 1 + (i % 4) * 0.8;
          const color =
            i % 3 === 0 ? "#38bdf8" :
            i % 3 === 1 ? "#a5f3fc" : "#818cf8";
          return (
            <span
              key={i}
              data-star
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                background: color,
                boxShadow: `0 0 ${size * 4}px currentColor`,
                left: -size / 2,
                top: -size / 2,
                willChange: "transform, opacity",
              }}
            />
          );
        })}
      </div>

      {/* Ambient pulsing dots (independent, non-scroll) */}
      {Array.from({ length: 16 }).map((_, i) => {
        const size = 2 + (i % 3);
        const left = (i * 137) % 100;
        const top = 10 + ((i * 79) % 70);
        const dur = 3 + (i % 5);
        return (
          <span
            key={`amb-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              background: i % 2 === 0 ? "#38bdf8" : "#a5f3fc",
              boxShadow: `0 0 ${size * 3}px currentColor`,
              animation: `dustPulse ${dur}s ease-in-out infinite ${(i * 0.15) % 2}s`,
              opacity: 0.5,
            }}
          />
        );
      })}

      {/* Vignette — edges darken on deeper scroll */}
      <div
        data-vignette
        className="absolute inset-0 opacity-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(2,6,23,0.6) 100%)",
        }}
      />

      <style>{`
        @keyframes dustPulse {
          0%, 100% { opacity: 0.2; transform: translateY(0); }
          50%      { opacity: 1;   transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}
