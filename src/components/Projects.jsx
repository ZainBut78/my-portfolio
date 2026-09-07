import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { projects } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

/**
 * Projects — 3D tilt cards + magnetic hover in shared GridZone
 * ------------------------------------------------------------
 * Design:
 *  - Section label "// MISSIONS" + big heading
 *  - Cards grid — featured wale bigger, normal wale smaller
 *  - Har card 3D tilt hover (rotateX/Y based on mouse position)
 *  - Glowing accent border jo cursor ke direction pe move karti hai
 *  - Live Demo + Code links jab hover ho tab reveal hote hain
 *  - Cards fly-in with stagger jab section view mein aata hai
 *
 * Note: Background grid App.jsx GridZone se aati hai — is section ka
 * apna bg nahi.
 */
export default function Projects() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const words = headerRef.current?.querySelectorAll("[data-word]") ?? [];
      gsap.from(words, {
        y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      const cards = gridRef.current?.querySelectorAll("[data-card]") ?? [];
      gsap.from(cards, {
        y: 80, opacity: 0, scale: 0.9, rotate: -2,
        stagger: 0.1, duration: 0.9, ease: "power3.out",
        scrollTrigger: {
          trigger: gridRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={rootRef}
      className="relative w-full py-24 md:py-32"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-14">
          <span data-word className="inline-block text-xs font-mono tracking-[0.4em] text-accent">
            // MISSIONS
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {"Recent flights I've flown".split(" ").map((w, i) => (
              <span key={i} data-word className="inline-block mr-3">
                <span className={i === 3 ? "gradient-text glow-text" : "text-text-primary"}>
                  {w}
                </span>
              </span>
            ))}
          </h2>
          <p data-word className="mt-4 text-text-muted max-w-xl mx-auto">
            Each mission — a full-stack production build. Real clients, real revenue.
          </p>
        </div>

        {/* Cards grid: featured 2-col wide, rest 1-col */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {projects.map((p) => (
            <ProjectCard key={p.title} project={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============ Project Card — 3D tilt + magnetic hover ============ */
function ProjectCard({ project }) {
  const cardRef = useRef(null);
  const innerRef = useRef(null);
  const glowRef = useRef(null);

  const onMove = (e) => {
    const el = cardRef.current;
    const inner = innerRef.current;
    const glow = glowRef.current;
    if (!el || !inner) return;
    const r = el.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width;
    const cy = (e.clientY - r.top) / r.height;
    const rotY = (cx - 0.5) * 14;     // horizontal tilt
    const rotX = (0.5 - cy) * 10;     // vertical tilt
    inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    if (glow) {
      // Cursor-following glowing spot (border-like)
      glow.style.background = `radial-gradient(circle 300px at ${cx * 100}% ${cy * 100}%, rgba(56,189,248,0.35), transparent 60%)`;
    }
  };
  const onLeave = () => {
    if (innerRef.current)
      innerRef.current.style.transform = "rotateX(0) rotateY(0)";
    if (glowRef.current)
      glowRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={cardRef}
      data-card
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative group ${project.featured ? "md:col-span-1" : ""}`}
      style={{ perspective: "1200px" }}
    >
      <div
        ref={innerRef}
        className="relative rounded-3xl overflow-hidden border border-white/10 bg-bg-card/50 backdrop-blur will-change-transform"
        style={{
          transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          transformStyle: "preserve-3d",
          boxShadow: [
            "0 30px 80px -30px rgba(0,0,0,0.9)",
            "inset 0 1px 0 rgba(255,255,255,0.05)",
          ].join(", "),
          background:
            "linear-gradient(145deg, rgba(30,41,59,0.65), rgba(15,23,42,0.85))",
        }}
      >
        {/* Cursor-follow glow */}
        <div
          ref={glowRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none transition-[background] duration-200 rounded-3xl"
        />

        {/* Image placeholder — user real image replace karega */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              // Agar image na mile to gradient placeholder dikha do
              e.currentTarget.style.display = "none";
            }}
            draggable={false}
          />
          {/* Fallback gradient placeholder — jab image na ho */}
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(56,189,248,0.2), rgba(168,85,247,0.15), rgba(236,72,153,0.15))",
            }}
          >
            <div className="font-mono text-xs text-text-muted opacity-60 text-center px-4">
              📷 preview
              <br />
              <span className="text-[10px]">{project.image}</span>
            </div>
          </div>
          {/* Image overlay gradient for text readability */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(3,7,18,0.9), transparent)",
            }}
          />
        </div>

        {/* Body */}
        <div className="relative p-6" style={{ transform: "translateZ(20px)" }}>
          {/* Featured badge */}
          {project.featured && (
            <span className="absolute top-4 right-4 inline-flex items-center gap-1 rounded-full bg-accent/15 border border-accent/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest text-accent">
              ★ Featured
            </span>
          )}

          <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-text-muted leading-relaxed mb-4">
            {project.description}
          </p>

          {/* Tech chips */}
          <div className="flex flex-wrap gap-2 mb-5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="text-[11px] font-mono px-2 py-1 rounded-full bg-white/[0.04] border border-white/10 text-text-muted"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action links */}
          <div className="flex gap-3">
            {project.demoUrl && project.demoUrl !== "#" && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full text-bg-primary bg-gradient-to-r from-accent to-accent-2 hover:shadow-[0_0_22px_rgba(56,189,248,0.5)] transition-shadow duration-300"
              >
                <span>Live Demo</span>
                <span aria-hidden>↗</span>
              </a>
            )}
            {project.codeUrl && project.codeUrl !== "#" && (
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full text-text-primary border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-accent/40 transition-colors"
              >
                <span>Code</span>
                <span aria-hidden>{"</>"}</span>
              </a>
            )}
            {(!project.demoUrl || project.demoUrl === "#") &&
             (!project.codeUrl || project.codeUrl === "#") && (
              <span className="text-[11px] text-text-muted font-mono italic">
                links coming soon…
              </span>
            )}
          </div>
        </div>

        {/* Corner accents (3D pop) */}
        <span aria-hidden className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-accent/60 rounded-tl-lg" />
        <span aria-hidden className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-accent-2/60 rounded-br-lg" />
      </div>
    </div>
  );
}
