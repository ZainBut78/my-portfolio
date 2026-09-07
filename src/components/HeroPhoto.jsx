import { useEffect, useRef, useState } from "react";
import { personal, heroCodeSnippet } from "../data/portfolioData";

/**
 * HeroPhoto — smooth X-ray hover, image-scoped
 * --------------------------------------------
 * Design decisions after client feedback:
 *   - Cross-hair (plus) hataya
 *   - Lens ring ka bara shadow hataya — sirf halka accent border
 *   - Hover sirf IMG ke bounding box par active hota hai (transparent
 *     wide container par nahi)
 *   - Lens position React state se decouple ki hai — mousemove pe direct
 *     DOM transform update hota hai (GPU-accelerated, buttery smooth)
 *   - clipPath bhi requestAnimationFrame ke through directly set hoti hai
 */
export default function HeroPhoto() {
  const wrapRef = useRef(null);
  const imgRef = useRef(null);
  const lensRef = useRef(null);
  const codeLayerRef = useRef(null);
  const rafRef = useRef(0);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [active, setActive] = useState(false);
  const [scanOnce, setScanOnce] = useState(false);

  const LENS_SIZE = 160;

  /* ---------- Panel tilt ---------- */
  const onWrapMove = (e) => {
    const el = wrapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - cy) * 5, ry: (cx - 0.5) * 5 });
  };
  const onWrapLeave = () => setTilt({ rx: 0, ry: 0 });

  /* ---------- X-ray lens tracking (React ko bypass, direct DOM) ---------- */
  const onImgMove = (e) => {
    const img = imgRef.current;
    if (!img) return;
    const r = img.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    // rAF throttle — pointer events per frame max ek update
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      const lens = lensRef.current;
      const codeLayer = codeLayerRef.current;
      if (lens) {
        // Transform (GPU) — koi layout thrash nahi
        lens.style.transform = `translate3d(${x - LENS_SIZE / 2}px, ${y - LENS_SIZE / 2}px, 0)`;
      }
      if (codeLayer) {
        const clip = `circle(${LENS_SIZE / 2}px at ${x}px ${y}px)`;
        codeLayer.style.clipPath = clip;
        codeLayer.style.webkitClipPath = clip;
      }
    });
  };

  const onImgEnter = (e) => {
    setActive(true);
    // Immediately position lens at cursor — avoid initial flash from center
    const img = imgRef.current;
    if (img) {
      const r = img.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const lens = lensRef.current;
      const codeLayer = codeLayerRef.current;
      if (lens) lens.style.transform = `translate3d(${x - LENS_SIZE / 2}px, ${y - LENS_SIZE / 2}px, 0)`;
      if (codeLayer) {
        const clip = `circle(${LENS_SIZE / 2}px at ${x}px ${y}px)`;
        codeLayer.style.clipPath = clip;
        codeLayer.style.webkitClipPath = clip;
        // Live tracking mein transition nahi (instant follow)
        codeLayer.style.transition = "none";
      }
    }
  };

  const onImgLeave = () => {
    setActive(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
    // Circle ko center pe 0 radius pe shrink (smooth close)
    const codeLayer = codeLayerRef.current;
    if (codeLayer) {
      codeLayer.style.transition = "clip-path 400ms ease-out";
      codeLayer.style.clipPath = "circle(0px at 50% 50%)";
      codeLayer.style.webkitClipPath = "circle(0px at 50% 50%)";
    }
  };

  /* ---------- Mobile: intro scan ek dafa ---------- */
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !scanOnce) setScanOnce(true); },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [scanOnce]);

  /* ---------- Cleanup rAF on unmount ---------- */
  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div
      ref={wrapRef}
      onMouseMove={onWrapMove}
      onMouseLeave={onWrapLeave}
      className="relative w-full flex items-end justify-center h-[55vh] sm:h-[70vh] md:h-screen md:max-h-[1100px]"
      style={{
        perspective: "1400px",
      }}
    >
      {/* Halo behind photo */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[90%] pointer-events-none blur-3xl opacity-70"
        style={{
          background:
            "radial-gradient(ellipse at 50% 60%, rgba(168,85,247,0.35), rgba(56,189,248,0.2) 45%, transparent 75%)",
        }}
      />

      {/* Tilt wrapper */}
      <div
        className="relative h-full w-full flex items-end justify-center"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.3s ease-out",
        }}
      >
        {/* Image container — sirf img ki width le ga */}
        <div className="relative h-full inline-block">
          {/* Base photo */}
          <img
            ref={imgRef}
            src={personal.profilePhoto}
            alt={personal.name}
            draggable={false}
            onMouseEnter={onImgEnter}
            onMouseMove={onImgMove}
            onMouseLeave={onImgLeave}
            className="relative h-full w-auto max-w-none select-none block cursor-crosshair"
            style={{
              maskImage:
                "linear-gradient(to bottom, black 60%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 60%, black 85%, transparent 100%)",
              filter: "drop-shadow(0 25px 45px rgba(0,0,0,0.55))",
            }}
          />

          {/* X-ray code layer — img ke oopar overlay, clipPath purely ref se manage */}
          <div
            ref={codeLayerRef}
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              // Initial clip — hidden (0 radius circle)
              clipPath: "circle(0px at 50% 50%)",
              WebkitClipPath: "circle(0px at 50% 50%)",
              transition: "clip-path 400ms ease-out",
              background:
                "radial-gradient(circle at 50% 50%, #030712 0%, #0f172a 60%, #030712 100%)",
              maskImage:
                "linear-gradient(to bottom, black 60%, black 85%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(to bottom, black 60%, black 85%, transparent 100%)",
            }}
          >
            <pre
              className="absolute inset-0 m-0 p-4 font-mono text-[12px] leading-[1.4] whitespace-pre overflow-hidden"
              style={{
                color: "#a5f3fc",
                columnWidth: "180px",
                columnGap: "0.5rem",
                columnFill: "auto",
                animation: "codeScroll 22s linear infinite",
                textShadow:
                  "0 0 8px rgba(56,189,248,0.75), 0 0 2px rgba(255,255,255,0.55)",
              }}
            >
{heroCodeSnippet + "\n\n" + heroCodeSnippet + "\n\n" + heroCodeSnippet + "\n\n" + heroCodeSnippet}
            </pre>
            {/* Subtle scan-lines */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "repeating-linear-gradient(0deg, rgba(56,189,248,0.1) 0px, rgba(56,189,248,0.1) 1px, transparent 1px, transparent 3px)",
                mixBlendMode: "screen",
              }}
            />
          </div>

          {/* Lens ring — halka accent border, koi bara shadow nahi, koi cross-hair nahi */}
          <div
            ref={lensRef}
            aria-hidden
            className="absolute top-0 left-0 pointer-events-none rounded-full"
            style={{
              width: LENS_SIZE,
              height: LENS_SIZE,
              opacity: active ? 1 : 0,
              border: "1.5px solid rgba(56,189,248,0.75)",
              transition: "opacity 250ms ease-out",
              willChange: "transform",
            }}
          />

          {/* Mobile intro-scan */}
          {scanOnce && !active && (
            <div
              aria-hidden
              className="absolute inset-x-0 h-16 pointer-events-none md:hidden"
              style={{
                top: 0,
                background:
                  "linear-gradient(180deg, transparent, rgba(56,189,248,0.35), transparent)",
                animation: "mobileScan 3s ease-in-out 0.5s 1 forwards",
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes codeScroll {
          from { transform: translateY(0);    }
          to   { transform: translateY(-50%); }
        }
        @keyframes mobileScan {
          0%   { top: -10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
