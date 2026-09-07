import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getIcon } from "../lib/icons";
import { personal, socials, navLinks } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

/**
 * Footer — cinematic close-out for the site
 * -----------------------------------------
 * Design:
 *  - Top row: ZB logo + tagline + social icon buttons
 *  - Middle: quick nav links (mirroring navbar)
 *  - Bottom: © + year + built-with strip + back-to-top pill
 *  - Bg: subtle gradient + faint grid pattern + accent line at very top
 *  - Reveal: staggered fade-in as footer enters viewport
 */
export default function Footer() {
  const rootRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = rootRef.current?.querySelectorAll("[data-reveal]") ?? [];
      gsap.from(items, {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const scrollTop = () => {
    document.querySelector("#hero")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const year = new Date().getFullYear();

  return (
    <footer
      ref={rootRef}
      className="relative w-full overflow-hidden pt-16 pb-8"
      style={{
        background:
          "linear-gradient(to bottom, rgba(2,6,23,0.9), rgba(3,7,18,1))",
      }}
    >
      {/* Accent top line — full-width gradient */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(56,189,248,0.6), rgba(129,140,248,0.6), rgba(236,72,153,0.6), transparent)",
        }}
      />

      {/* Faint grid pattern */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 40%, transparent 80%)",
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6">

        {/* ============ Top: brand + tagline + socials ============ */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 items-start pb-10 border-b border-white/5">
          {/* Brand */}
          <div data-reveal>
            <div className="flex items-center gap-3">
              <span className="relative w-12 h-12 grid place-items-center">
                <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full" aria-hidden>
                  <defs>
                    <linearGradient id="ftLogoGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#818cf8" />
                    </linearGradient>
                    <clipPath id="ftPhotoClip">
                      <circle cx="20" cy="20" r="12" />
                    </clipPath>
                  </defs>
                  <circle
                    cx="20"
                    cy="20"
                    r="17"
                    fill="none"
                    stroke="url(#ftLogoGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 6"
                    style={{
                      transformOrigin: "20px 20px",
                      animation: "ftRingSpin 8s linear infinite",
                    }}
                  />
                  {/* Glass inner ring */}
                  <circle
                    cx="20"
                    cy="20"
                    r="13"
                    fill="rgba(15,23,42,0.6)"
                    stroke="rgba(56,189,248,0.5)"
                    strokeWidth="0.6"
                  />
                  {/* Hero photo clipped inside */}
                  <image
                    href={personal.profilePhoto}
                    x="4"
                    y="6"
                    width="32"
                    height="32"
                    clipPath="url(#ftPhotoClip)"
                    preserveAspectRatio="xMidYMid slice"
                  />
                </svg>
              </span>
              <div>
                <div className="font-bold text-lg text-text-primary">{personal.name}</div>
                <div className="text-xs text-text-muted font-mono">{personal.role}</div>
              </div>
            </div>

            <p data-reveal className="mt-4 text-sm text-text-muted leading-relaxed max-w-xs">
              {personal.tagline}
            </p>
          </div>

          {/* Quick nav links */}
          <nav data-reveal className="md:justify-self-center">
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">
              // Navigate
            </div>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    className="text-sm text-text-muted hover:text-accent transition-colors"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Socials */}
          <div data-reveal className="md:justify-self-end">
            <div className="text-xs font-mono uppercase tracking-widest text-accent mb-3">
              // Reach out
            </div>
            <div className="flex flex-wrap gap-2">
              {socials.map((s) => {
                const Icon = getIcon(s.icon);
                return (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    className="group relative grid place-items-center w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] hover:border-accent/40 hover:bg-white/[0.06] transition-all"
                    style={{ transition: "all 0.25s ease" }}
                  >
                    {Icon ? (
                      <Icon size={16} color={s.color} />
                    ) : (
                      <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                    )}
                    <span
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-mono text-text-muted opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                    >
                      {s.name}
                    </span>
                  </a>
                );
              })}
            </div>

            {/* Availability chip */}
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-xs font-mono text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              available for work
            </div>
          </div>
        </div>

        {/* ============ Bottom: copyright + built with + back-to-top ============ */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div data-reveal className="text-xs font-mono text-text-muted">
            © {year} {personal.name} · Signed off from {personal.location}
          </div>

          <div data-reveal className="text-xs font-mono text-text-muted flex items-center gap-2">
            <span>Built with</span>
            <span className="text-accent">React</span>
            <span>·</span>
            <span className="text-accent-2">GSAP</span>
            <span>·</span>
            <span className="text-fuchsia-400">Tailwind</span>
            <span>·</span>
            <span className="text-emerald-300">Lenis</span>
          </div>

          {/* Back to top pill */}
          <button
            data-reveal
            type="button"
            onClick={scrollTop}
            className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-mono text-text-primary hover:border-accent/40 hover:bg-white/[0.06] transition-all"
          >
            <span
              aria-hidden
              className="inline-block group-hover:-translate-y-0.5 transition-transform"
            >
              ↑
            </span>
            back to top
          </button>
        </div>
      </div>

      <style>{`
        @keyframes ftRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </footer>
  );
}
