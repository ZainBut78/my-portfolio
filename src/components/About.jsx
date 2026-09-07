import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal, stats } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

/**
 * About — cinematic split layout with scroll-in animated avatar
 * -------------------------------------------------------------
 * Design:
 *   LEFT  : 3D glass avatar panel — flies in from left (x:-200, rot:-10)
 *           on scroll, tilts on mouse move
 *   RIGHT : "About Me" section label + big headline + bio + animated
 *           stats counters
 *   BG    : 2 floating gradient orbs + subtle grid mask
 *   Reveal: heading word-by-word, bio + stats stagger on scroll into view
 */
export default function About() {
  const rootRef = useRef(null);
  const avatarWrapRef = useRef(null);
  const avatarPanelRef = useRef(null);
  const headingRef = useRef(null);
  const bioRef = useRef(null);
  const statsRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  /* ---------- Panel tilt (mouse-based 3D depth) ---------- */
  const onPanelMove = (e) => {
    const el = avatarPanelRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - cy) * 8, ry: (cx - 0.5) * 8 });
  };
  const onPanelLeave = () => setTilt({ rx: 0, ry: 0 });

  /* ---------- Scroll-triggered avatar flight in ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Avatar — flies in from left with rotation, matches Hero cinematic language */
      gsap.fromTo(
        avatarWrapRef.current,
        { x: -220, opacity: 0, rotate: -10, scale: 0.9 },
        {
          x: 0, opacity: 1, rotate: 0, scale: 1,
          duration: 1.3, ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        },
      );

      /* Heading — word stagger */
      const words = headingRef.current?.querySelectorAll("[data-word]") ?? [];
      gsap.from(words, {
        y: 30, opacity: 0, stagger: 0.06, duration: 0.7, ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      /* Bio */
      gsap.from(bioRef.current, {
        y: 20, opacity: 0, duration: 0.8, ease: "power3.out", delay: 0.15,
        scrollTrigger: {
          trigger: bioRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* Stats — stagger in AND run counter animation */
      const items = statsRef.current?.querySelectorAll("[data-stat]") ?? [];
      gsap.from(items, {
        y: 24, opacity: 0, stagger: 0.1, duration: 0.7, ease: "power3.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
          onEnter: () => runCounters(items),
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={rootRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center py-24 md:py-32"
    >
      {/* ---- Section transition curtain from Hero (top edge) ---- */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-32 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, transparent, var(--color-bg-primary))",
        }}
      />

      {/* ---- Ambient background — floating orbs + grid ---- */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[520px] h-[520px] rounded-full blur-3xl opacity-30"
          style={{
            top: "10%", right: "-8%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.35), transparent 70%)",
            animation: "aboutOrb1 22s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[460px] h-[460px] rounded-full blur-3xl opacity-25"
          style={{
            bottom: "5%", left: "-10%",
            background:
              "radial-gradient(circle, rgba(56,189,248,0.35), transparent 70%)",
            animation: "aboutOrb2 26s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      {/* ---- Content grid ---- */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid md:grid-cols-12 gap-10 md:gap-14 items-center">

        {/* ============ LEFT: 3D glass avatar panel ============ */}
        <div
          ref={avatarWrapRef}
          className="md:col-span-5 flex justify-center md:justify-start"
        >
          <div
            ref={avatarPanelRef}
            onMouseMove={onPanelMove}
            onMouseLeave={onPanelLeave}
            className="relative w-full max-w-[380px] aspect-[4/5]"
            style={{ perspective: "1400px" }}
          >
            {/* Depth halo behind panel */}
            <div
              aria-hidden
              className="absolute -inset-4 blur-3xl opacity-60 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.28), rgba(168,85,247,0.25) 45%, transparent 75%)",
              }}
            />

            {/* Glass panel — tilts */}
            <div
              className="relative h-full w-full rounded-3xl overflow-hidden"
              style={{
                transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 0.3s ease-out",
                background:
                  "linear-gradient(145deg, rgba(30,41,59,0.7), rgba(15,23,42,0.9))",
                border: "1px solid rgba(129,140,248,0.35)",
                boxShadow: [
                  "0 30px 80px -20px rgba(129,140,248,0.35)",
                  "0 20px 60px -30px rgba(0,0,0,0.9)",
                  "inset 0 1px 0 rgba(255,255,255,0.06)",
                ].join(", "),
              }}
            >
              {/* Photo */}
              <img
                src={personal.avatar}
                alt={`${personal.name} — about`}
                className="absolute inset-0 w-full h-full object-cover object-center select-none"
                draggable={false}
                style={{
                  // Soft edges — glass ke saath blend
                  maskImage:
                    "radial-gradient(ellipse 90% 100% at 50% 50%, black 70%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 90% 100% at 50% 50%, black 70%, transparent 100%)",
                }}
              />

              {/* Vignette overlay for glass feel */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, transparent 55%, rgba(3,7,18,0.6) 100%)",
                }}
              />

              {/* Corner accents */}
              <span aria-hidden className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-accent-2/80 rounded-tl-lg" />
              <span aria-hidden className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-accent/80 rounded-tr-lg" />
              <span aria-hidden className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-accent/80 rounded-bl-lg" />
              <span aria-hidden className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-accent-2/80 rounded-br-lg" />

              {/* Floating tech chip */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-bg-primary/85 backdrop-blur px-4 py-2 text-xs font-mono text-text-primary border border-white/10"
                style={{
                  transform: "translate(-50%, 0) translateZ(40px)",
                  boxShadow: "0 12px 30px -10px rgba(56,189,248,0.35)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                &lt;/&gt;  crafting since 2021
              </div>
            </div>
          </div>
        </div>

        {/* ============ RIGHT: content ============ */}
        <div className="md:col-span-7 flex flex-col">
          {/* Section label */}
          <span className="inline-flex items-center gap-2 self-start text-xs uppercase tracking-[0.35em] text-accent mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            About Me
          </span>

          {/* Big headline — word stagger */}
          <h2
            ref={headingRef}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-6"
          >
            {"A developer who builds things that feel alive.".split(" ").map((w, i, arr) => {
              const emphasize = ["builds", "alive."].includes(w);
              return (
                <span key={i} data-word className="inline-block mr-3">
                  <span className={emphasize ? "gradient-text glow-text" : "text-text-primary"}>
                    {w}
                  </span>
                </span>
              );
            })}
          </h2>

          {/* Bio */}
          <p
            ref={bioRef}
            className="text-base md:text-lg text-text-muted leading-relaxed max-w-2xl mb-10"
          >
            {personal.bio}
          </p>

          {/* Stats grid */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-4 md:gap-6 max-w-lg"
          >
            {stats.map((s) => (
              <div
                key={s.label}
                data-stat
                className="relative rounded-2xl border border-white/10 bg-bg-card/40 backdrop-blur px-4 py-5 md:px-6 md:py-6"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(30,41,59,0.6), rgba(15,23,42,0.7))",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                <div
                  className="text-3xl md:text-4xl font-extrabold gradient-text"
                  data-stat-value
                  data-target={s.value}
                >
                  {s.value}
                </div>
                <div className="mt-1 text-xs md:text-sm text-text-muted">
                  {s.label}
                </div>
                {/* Corner accent */}
                <span aria-hidden className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Component-local keyframes */}
      <style>{`
        @keyframes aboutOrb1 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(-40px,30px) scale(1.08); }
        }
        @keyframes aboutOrb2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%      { transform: translate(40px,-30px) scale(1.05); }
        }
      `}</style>
    </section>
  );
}

/* ---------- Utility: animate number counters in stat cards ---------- */
function runCounters(cards) {
  cards.forEach((card) => {
    const valueEl = card.querySelector("[data-stat-value]");
    if (!valueEl) return;
    const raw = valueEl.getAttribute("data-target") ?? "";
    // Extract leading number from "20+", "3+" etc.
    const match = raw.match(/(\d+)/);
    if (!match) return;
    const target = parseInt(match[1], 10);
    const suffix = raw.slice(match[0].length);
    const start = performance.now();
    const duration = 1200;

    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(target * eased);
      valueEl.textContent = `${current}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}
