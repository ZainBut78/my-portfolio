import { useEffect, useRef, useState } from "react";
import { navLinks, personal } from "../data/portfolioData";

/**
 * Navbar — scroll-aware, animated, cinematic
 * -------------------------------------------
 * Features:
 *  - Scroll pe blur + darken (top pe transparent, scroll hote hi frosted)
 *  - Animated logo mark (rotating gradient ring + "ZB" gradient text)
 *  - Har link ke neeche magnetic gliding pill indicator jo active link tak
 *    smoothly move karti hai (spring feel)
 *  - Har link hover pe magnetic pull effect
 *  - Active section auto-detect (IntersectionObserver ke through)
 *  - Mobile: full-screen animated menu with staggered link reveal
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState(navLinks[0]?.href ?? "#hero");
  const [hoveredHref, setHoveredHref] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Link elements refs — pill ki position calculate karne ke liye
  const linkRefs = useRef({});
  const navRef = useRef(null);
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0, opacity: 0 });

  /* ---------- Scroll aware background ---------- */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- Active section detect (scroll-based) ----------
     Jo section navbar ke thoda neeche wale check line ko cross kar chuka ho
     (yaani us ka top viewport ke ~30% se upar aa gaya ho), wo active. */
  useEffect(() => {
    const sections = navLinks
      .map((l) => document.querySelector(l.href))
      .filter(Boolean);
    if (!sections.length) return;

    let raf = 0;
    const detect = () => {
      const marker = window.innerHeight * 0.3;
      let current = navLinks[0].href;
      for (const s of sections) {
        const rect = s.getBoundingClientRect();
        if (rect.top <= marker) current = `#${s.id}`;
      }
      setActiveHref(current);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        detect();
      });
    };
    detect();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* ---------- Pill indicator position ---------- */
  useEffect(() => {
    const targetHref = hoveredHref || activeHref;
    const el = linkRefs.current[targetHref];
    const container = navRef.current;
    if (!el || !container) {
      setPillStyle((s) => ({ ...s, opacity: 0 }));
      return;
    }
    const elRect = el.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    setPillStyle({
      left: elRect.left - cRect.left,
      width: elRect.width,
      opacity: 1,
    });
  }, [activeHref, hoveredHref, scrolled]);

  /* ---------- Smooth scroll to section ---------- */
  const go = (href) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <header
        className={[
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-bg-primary/90 backdrop-blur-md border-b border-white/10 shadow-[0_10px_40px_-20px_rgba(56,189,248,0.35)]"
            : "bg-transparent border-b border-transparent",
        ].join(" ")}
      >
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          {/* -------- Logo -------- */}
          <a href="#hero" onClick={go("#hero")} className="group relative flex items-center gap-3">
            {/* Rotating gradient ring + hero photo circle inside */}
            <span className="relative w-11 h-11 grid place-items-center">
              <svg viewBox="0 0 40 40" className="absolute inset-0 w-full h-full">
                <defs>
                  <linearGradient id="navLogoGrad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                  <clipPath id="navPhotoClip">
                    <circle cx="20" cy="20" r="12" />
                  </clipPath>
                </defs>
                <circle
                  cx="20"
                  cy="20"
                  r="17"
                  fill="none"
                  stroke="url(#navLogoGrad)"
                  strokeWidth="1.5"
                  strokeDasharray="4 6"
                  style={{
                    transformOrigin: "20px 20px",
                    animation: "navRingSpin 8s linear infinite",
                  }}
                />
                {/* Inner solid ring — glass border around photo */}
                <circle
                  cx="20"
                  cy="20"
                  r="13"
                  fill="rgba(15,23,42,0.6)"
                  stroke="rgba(56,189,248,0.5)"
                  strokeWidth="0.6"
                />
                {/* Hero photo clipped to circle */}
                <image
                  href={personal.profilePhoto}
                  x="4"
                  y="6"
                  width="32"
                  height="32"
                  clipPath="url(#navPhotoClip)"
                  preserveAspectRatio="xMidYMid slice"
                />
              </svg>
            </span>
            <span className="hidden sm:block text-sm md:text-base font-semibold text-text-primary group-hover:text-accent transition-colors">
              Zain Butt
            </span>
          </a>

          {/* -------- Desktop links -------- */}
          <ul
            ref={navRef}
            className="hidden md:flex relative items-center gap-1 text-sm"
            onMouseLeave={() => setHoveredHref(null)}
          >
            {/* Magnetic pill — active link ke neeche glide karti hai */}
            <span
              aria-hidden
              className="absolute top-1/2 -translate-y-1/2 h-8 rounded-full pointer-events-none"
              style={{
                left: pillStyle.left,
                width: pillStyle.width,
                opacity: pillStyle.opacity,
                background:
                  "linear-gradient(90deg, rgba(56,189,248,0.18), rgba(129,140,248,0.18))",
                border: "1px solid rgba(56,189,248,0.35)",
                boxShadow: "0 0 20px rgba(56,189,248,0.25)",
                transition:
                  "left 0.5s cubic-bezier(0.22, 1, 0.36, 1), width 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease",
              }}
            />

            {navLinks.map((l) => {
              const isActive = activeHref === l.href;
              return (
                <li key={l.href}>
                  <a
                    ref={(el) => (linkRefs.current[l.href] = el)}
                    href={l.href}
                    onClick={go(l.href)}
                    onMouseEnter={() => setHoveredHref(l.href)}
                    className={[
                      "relative z-10 inline-block px-4 py-2 rounded-full font-medium transition-colors duration-300",
                      isActive
                        ? "text-text-primary"
                        : "text-text-muted hover:text-text-primary",
                    ].join(" ")}
                  >
                    {l.label}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* -------- Desktop CTA -------- */}
          <a
            href="#contact"
            onClick={go("#contact")}
            className="hidden md:inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full text-bg-primary bg-gradient-to-r from-accent to-accent-2 hover:shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-shadow duration-300"
          >
            Let's talk
            <span aria-hidden>→</span>
          </a>

          {/* -------- Mobile hamburger -------- */}
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 grid place-items-center rounded-full border border-white/10 bg-white/5"
          >
            <span
              className="absolute w-5 h-[2px] bg-text-primary rounded-full transition-transform duration-300"
              style={{ transform: menuOpen ? "translateY(0) rotate(45deg)" : "translateY(-5px)" }}
            />
            <span
              className="absolute w-5 h-[2px] bg-text-primary rounded-full transition-opacity duration-300"
              style={{ opacity: menuOpen ? 0 : 1 }}
            />
            <span
              className="absolute w-5 h-[2px] bg-text-primary rounded-full transition-transform duration-300"
              style={{ transform: menuOpen ? "translateY(0) rotate(-45deg)" : "translateY(5px)" }}
            />
          </button>
        </nav>
      </header>

      {/* -------- Mobile full-screen menu -------- */}
      <div
        aria-hidden={!menuOpen}
        className="md:hidden fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-bg-primary/95 backdrop-blur-xl transition-all duration-500"
        style={{
          clipPath: menuOpen
            ? "circle(150% at calc(100% - 32px) 36px)"
            : "circle(0% at calc(100% - 32px) 36px)",
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        {/* Ambient glow inside overlay */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(56,189,248,0.12), transparent 60%)",
          }}
        />

        <ul className="relative flex flex-col items-center gap-2">
          {navLinks.map((l, i) => (
            <li
              key={l.href}
              style={{
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${0.15 + i * 0.06}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + i * 0.06}s`,
              }}
            >
              <a
                href={l.href}
                onClick={go(l.href)}
                className={[
                  "block text-3xl font-bold px-6 py-3 tracking-tight transition-colors",
                  activeHref === l.href
                    ? "gradient-text"
                    : "text-text-primary hover:text-accent",
                ].join(" ")}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li
            style={{
              opacity: menuOpen ? 1 : 0,
              transform: menuOpen ? "translateY(0)" : "translateY(20px)",
              transition: `opacity 0.5s ease ${0.15 + navLinks.length * 0.06}s, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${0.15 + navLinks.length * 0.06}s`,
            }}
            className="mt-6"
          >
            <a
              href="#contact"
              onClick={go("#contact")}
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-full text-bg-primary bg-gradient-to-r from-accent to-accent-2"
            >
              Let's talk <span aria-hidden>→</span>
            </a>
          </li>
        </ul>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes navRingSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}
