import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { personal } from "../data/portfolioData";
import HeroPhoto from "./HeroPhoto";
import GeminiWaves from "./GeminiWaves";
import ShinyText from "./ShinyText";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hero — 3-column layout
 *  LEFT   : "Hi, I'm Zain Butt" + role + Hire Me / Contact Me buttons
 *  CENTER : full-height photo with X-ray hover + neon Gemini waves
 *  RIGHT  : tagline + Download Resume button
 *  Mobile : sab stack — info top, photo middle, resume/tagline bottom
 */
export default function Hero() {
  const rootRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const photoWrapRef = useRef(null);

  /* ---------- Intro reveal ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftEls  = leftRef.current?.querySelectorAll("[data-reveal]");
      const rightEls = rightRef.current?.querySelectorAll("[data-reveal]");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(photoWrapRef.current, { y: 60, opacity: 0, scale: 0.95, duration: 1.1 }, 0);
      tl.from(leftEls,  { y: 24, opacity: 0, stagger: 0.08, duration: 0.7 }, 0.2);
      tl.from(rightEls, { y: 24, opacity: 0, stagger: 0.08, duration: 0.7 }, 0.35);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ---------- Scroll-linked parallax ---------- */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to("[data-hero-info]", {
        yPercent: -20, opacity: 0.4, ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-photo]", {
        yPercent: -10, ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-waves]", {
        yPercent: -6, ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="relative min-h-screen w-full flex items-end justify-center overflow-hidden"
    >
      {/* ---- Background: flowing Gemini waves ---- */}
      <div
        data-hero-waves
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          maskImage:
            "radial-gradient(ellipse 95% 85% at 50% 50%, black 45%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 85% at 50% 50%, black 45%, transparent 100%)",
        }}
      >
        <GeminiWaves opacity={0.9} />
      </div>

      {/* ---- Bottom vignette — next section mein smooth transition ---- */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-40 pointer-events-none z-[5]"
        style={{
          background:
            "linear-gradient(to bottom, transparent, var(--color-bg-primary))",
        }}
      />

      {/* ---- 3-column grid: LEFT info + CENTER photo + RIGHT resume ---- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-6 md:pb-0 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-4 items-end min-h-screen">

        {/* ============ LEFT: name + role + primary CTAs ============ */}
        <div
          ref={leftRef}
          data-hero-info
          className="order-2 md:order-1 md:col-span-3 flex flex-col justify-center pb-8 md:pb-24"
        >
          {/* Role chip */}
          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 backdrop-blur px-3 py-1 text-xs font-medium text-accent w-fit mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {personal.role}
          </div>

          {/* Headline — "Hi, I'm" (regular) + "Zain Butt" (shiny) */}
          <h1 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
            <span data-reveal className="block text-text-primary">Hi, I'm</span>
            <span data-reveal className="block mt-1">
              <ShinyText
                text={personal.name}
                className="text-5xl sm:text-6xl md:text-6xl lg:text-7xl font-extrabold"
              />
            </span>
          </h1>

          {/* CTAs — Hire Me + Contact Me */}
          <div className="mt-8 flex flex-col sm:flex-row md:flex-col gap-3 w-full max-w-[240px]">
            <CTAButton
              data-reveal
              href="#contact"
              variant="primary"
              icon="✦"
              label="Hire Me"
            />
            <CTAButton
              data-reveal
              href="#contact"
              variant="ghost"
              icon="✉"
              label="Contact Me"
            />
          </div>
        </div>

        {/* ============ CENTER: photo ============ */}
        <div
          data-hero-photo
          ref={photoWrapRef}
          className="order-1 md:order-2 md:col-span-6 flex items-end justify-center"
        >
          <HeroPhoto />
        </div>

        {/* ============ RIGHT: tagline + download resume ============ */}
        <div
          ref={rightRef}
          data-hero-info
          className="order-3 md:col-span-3 flex flex-col justify-center md:items-end text-left md:text-right pb-8 md:pb-24"
        >
          {/* Small label */}
          <div data-reveal className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-400/10 backdrop-blur px-3 py-1 text-xs font-medium text-fuchsia-300 w-fit md:ml-auto mb-5">
            <span className="font-mono">🐍</span>
            {personal.subRole}
          </div>

          {/* Tagline — accent decorative bar + text */}
          <div data-reveal className="relative max-w-xs md:ml-auto">
            <span
              aria-hidden
              className="absolute -left-1 top-0 bottom-0 w-[2px] rounded-full md:left-auto md:-right-1"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, #38bdf8, #818cf8, transparent)",
              }}
            />
            <p className="pl-4 md:pl-0 md:pr-4 text-base md:text-lg text-text-muted leading-relaxed">
              {personal.tagline}
            </p>
          </div>

          {/* Download Resume button — clean download (no new tab) */}
          <div data-reveal className="mt-8 w-full md:flex md:justify-end">
            <CTAButton
              href={personal.resumeUrl}
              variant="primary"
              icon="⬇"
              label="Download Resume"
              download="Zain-Butt-Resume.pdf"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CTA Button — magnetic hover ============ */
function CTAButton({ href, variant, icon, label, external, download, ...rest }) {
  const ref = useRef(null);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width / 2;
    const cy = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${cx * 0.15}px, ${cy * 0.25}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0, 0)";
  };
  const handleClick = (e) => {
    if (!external && href?.startsWith("#")) {
      e.preventDefault();
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const base =
    "relative inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold whitespace-nowrap will-change-transform min-w-[180px]";
  const primary =
    "text-bg-primary bg-gradient-to-r from-accent to-accent-2 hover:shadow-[0_0_28px_rgba(56,189,248,0.55)]";
  const ghost =
    "text-text-primary border border-white/15 bg-bg-primary/50 backdrop-blur hover:bg-white/[0.06] hover:border-accent/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]";

  return (
    <a
      ref={ref}
      href={href}
      onClick={handleClick}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      download={download || undefined}
      style={{
        transition:
          "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
      }}
      className={`${base} ${variant === "primary" ? primary : ghost}`}
      {...rest}
    >
      <span aria-hidden className="text-base">{icon}</span>
      <span>{label}</span>
    </a>
  );
}
