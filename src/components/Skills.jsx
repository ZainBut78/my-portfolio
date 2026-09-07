import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getIcon } from "../lib/icons";
import { skills } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

/**
 * Skills — "flight radar" style section
 * -------------------------------------
 * Reference image ke mutabik:
 *  - Animated perspective grid bg (blue lines receding into distance)
 *  - Grid scroll-linked animate hoti hai (upar chalti hai jab user scroll kare)
 *  - Corner altitude markers: 26,000 ft / 18,000 ft
 *  - "// STACK" label + big title "The instruments I fly with"
 *  - Skill chips fly in with stagger (React Bits inspired)
 */
export default function Skills() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const chipsRef = useRef(null);

  /* ---------- Header + chips reveal (grid ab shared component se) ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header — word stagger */
      const words = headerRef.current?.querySelectorAll("[data-word]") ?? [];
      gsap.from(words, {
        y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* Chips — fly in from below with stagger + slight rotation */
      const chipEls = chipsRef.current?.querySelectorAll("[data-chip]") ?? [];
      gsap.from(chipEls, {
        y: 80,
        opacity: 0,
        scale: 0.7,
        rotate: -8,
        stagger: 0.05,
        duration: 0.9,
        ease: "back.out(1.4)",
        scrollTrigger: {
          trigger: chipsRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={rootRef}
      className="relative min-h-[110vh] w-full overflow-hidden py-24 md:py-32"
    >
      {/* Grid ab shared PerspectiveGrid component se aati hai (App.jsx mein) */}

      {/* ============ Corner altitude markers ============ */}
      <AltitudeMarker top left>26,000 ft</AltitudeMarker>
      <AltitudeMarker bottom left>18,000 ft</AltitudeMarker>

      {/* ============ Content ============ */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <span data-word className="inline-block text-xs font-mono tracking-[0.4em] text-accent">
            // STACK
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {"The instruments I fly with".split(" ").map((w, i, arr) => (
              <span key={i} data-word className="inline-block mr-3">
                <span className={i === 3 ? "gradient-text glow-text" : "text-text-primary"}>
                  {w}
                </span>
              </span>
            ))}
          </h2>
        </div>

        {/* Skill chips — organized by row from data */}
        <div
          ref={chipsRef}
          className="flex flex-col gap-4 md:gap-6 items-center"
        >
          {/* Split into rows by data.row */}
          {[0, 1, 2, 3, 4].map((r) => {
            const rowItems = skills.filter((s) => s.row === r);
            if (!rowItems.length) return null;
            return (
              <div
                key={r}
                className="flex flex-wrap justify-center gap-3 md:gap-4"
              >
                {rowItems.map((s, i) => (
                  <SkillChip key={s.name} skill={s} index={r * 10 + i} />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes chipFly {
          0%   { transform: translate(0, 0)     rotate(0deg); }
          25%  { transform: translate(4px, -6px)  rotate(0.6deg); }
          50%  { transform: translate(-3px, -10px) rotate(-0.4deg); }
          75%  { transform: translate(-5px, -4px)  rotate(0.3deg); }
          100% { transform: translate(3px, 2px)   rotate(-0.5deg); }
        }
      `}</style>
    </section>
  );
}

/* ---------- Skill chip — flying pill with magnetic tilt hover ----------
   - Continuous "flying" motion: har chip apne unique delay pe halka bob karta hai
   - Magnetic hover (React Bits inspired): cursor ke direction mein chip tilt
     karta hai (rotateX/Y based on mouse position within chip) — 3D pop feel
*/
function SkillChip({ skill, index }) {
  const Icon = getIcon(skill.icon);
  const chipRef = useRef(null);
  const innerRef = useRef(null);

  const onMove = (e) => {
    const el = chipRef.current;
    const inner = innerRef.current;
    if (!el || !inner) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;   // 0..1
    const cy = (e.clientY - r.top) / r.height;   // 0..1
    const rotY = (cx - 0.5) * 30;                // horizontal tilt
    const rotX = (0.5 - cy) * 20;                // vertical tilt
    // Cursor ki taraf halka pull (magnetic effect)
    const pullX = (cx - 0.5) * 8;
    const pullY = (cy - 0.5) * 8;
    inner.style.transform = `translate(${pullX}px, ${pullY}px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.08)`;
  };
  const onLeave = () => {
    const inner = innerRef.current;
    if (inner) inner.style.transform = "translate(0,0) rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div
      ref={chipRef}
      data-chip
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative"
      style={{
        perspective: "600px",
        // Har chip apna offset — natural drift (0.4s se 2.4s ke beech)
        animation: `chipFly ${5 + (index % 4)}s ease-in-out ${(index * 0.2) % 3}s infinite alternate`,
      }}
    >
      <div
        ref={innerRef}
        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-bg-primary/70 backdrop-blur px-4 py-2.5 cursor-default overflow-hidden will-change-transform"
        style={{
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.05), 0 8px 30px -12px rgba(56,189,248,0.35)",
          transition:
            "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease, border-color 0.35s ease",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Halo on hover — color-tinted glow */}
        <span
          aria-hidden
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${skill.color}33, transparent 70%)`,
          }}
        />
        {Icon ? (
          <Icon size={18} color={skill.color} />
        ) : (
          <span className="w-[18px] h-[18px] rounded-full" style={{ backgroundColor: skill.color }} />
        )}
        <span className="relative text-sm font-mono text-text-primary">
          {skill.name}
        </span>
      </div>
    </div>
  );
}

/* ---------- Corner altitude marker ---------- */
function AltitudeMarker({ top, bottom, left, right, children }) {
  const pos = [
    top ? "top-6" : "",
    bottom ? "bottom-6" : "",
    left ? "left-6" : "",
    right ? "right-6" : "",
  ].join(" ");
  return (
    <div
      className={`absolute ${pos} z-10 flex items-center gap-3 pointer-events-none`}
    >
      <span
        aria-hidden
        className="w-2 h-2 rounded-full bg-accent"
        style={{ boxShadow: "0 0 8px rgba(56,189,248,0.8)" }}
      />
      <span className="font-mono text-xs tracking-widest text-text-muted uppercase">
        {children}
      </span>
      {/* Extend line */}
      <span
        aria-hidden
        className="w-24 h-[1px]"
        style={{
          background:
            "linear-gradient(to right, rgba(56,189,248,0.4), transparent)",
        }}
      />
    </div>
  );
}
