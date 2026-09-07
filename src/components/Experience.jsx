import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { experience } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

/**
 * Experience — vertical timeline with scroll-scrub line-draw
 * ----------------------------------------------------------
 * Design:
 *  - Center vertical accent line jo scroll ke saath draw hoti hai
 *    (scaleY 0 → 1 tied to ScrollTrigger scrub)
 *  - Har entry alternate side pe (left / right) — desktop pe
 *  - Mobile: sab left-aligned single column
 *  - Har entry card mein: period tag, role, company, location, stack chips,
 *    achievement points
 *  - Node dots on the line jo fill hote hain jab card in-view aata hai
 *
 * Grid bg App.jsx GridZone se aata hai — apna bg nahi.
 */
export default function Experience() {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const headerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* Header words reveal */
      const words = headerRef.current?.querySelectorAll("[data-word]") ?? [];
      gsap.from(words, {
        y: 40, opacity: 0, stagger: 0.06, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: headerRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      /* Center line draws top → bottom as user scrolls */
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 60%",
            end: "bottom 80%",
            scrub: true,
          },
        },
      );

      /* Each entry: fade + slide from side + node dot fill */
      const entries = rootRef.current?.querySelectorAll("[data-entry]") ?? [];
      entries.forEach((entry) => {
        const isLeft = entry.dataset.side === "left";
        const dot = entry.querySelector("[data-node]");
        const card = entry.querySelector("[data-card]");
        gsap.fromTo(
          card,
          { x: isLeft ? -60 : 60, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 0.9, ease: "power3.out",
            scrollTrigger: {
              trigger: entry,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          },
        );
        if (dot) {
          gsap.fromTo(
            dot,
            { scale: 0.4, backgroundColor: "rgba(56,189,248,0.15)" },
            {
              scale: 1,
              backgroundColor: "#38bdf8",
              boxShadow: "0 0 22px rgba(56,189,248,0.8), 0 0 40px rgba(129,140,248,0.4)",
              ease: "back.out(1.6)",
              duration: 0.5,
              scrollTrigger: {
                trigger: entry,
                start: "top 75%",
                toggleActions: "play none none reverse",
              },
            },
          );
        }
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={rootRef}
      className="relative w-full py-24 md:py-32"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16 md:mb-24">
          <span data-word className="inline-block text-xs font-mono tracking-[0.4em] text-accent">
            // FLIGHT LOG
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
            {"Where I've flown".split(" ").map((w, i) => (
              <span key={i} data-word className="inline-block mr-3">
                <span className={i === 2 ? "gradient-text glow-text" : "text-text-primary"}>
                  {w}
                </span>
              </span>
            ))}
          </h2>
          <p data-word className="mt-4 text-text-muted max-w-xl mx-auto">
            Recent missions — the record of where craft met client.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center vertical line */}
          <div
            aria-hidden
            className="absolute left-4 md:left-1/2 top-0 bottom-0 w-[2px] md:-translate-x-1/2"
            style={{
              background: "rgba(255,255,255,0.06)",
            }}
          >
            {/* Actual draw-in line */}
            <span
              ref={lineRef}
              className="absolute inset-0 block"
              style={{
                background:
                  "linear-gradient(to bottom, #38bdf8, #818cf8, #ec4899, transparent)",
                boxShadow: "0 0 16px rgba(56,189,248,0.6)",
              }}
            />
          </div>

          {/* Entries */}
          <ul className="relative space-y-14 md:space-y-20">
            {experience.map((entry, i) => {
              const side = i % 2 === 0 ? "left" : "right";
              return (
                <li
                  key={entry.company + entry.period}
                  data-entry
                  data-side={side}
                  className="relative pl-12 md:pl-0"
                >
                  {/* Node dot */}
                  <span
                    data-node
                    className="absolute left-4 md:left-1/2 top-2 w-4 h-4 rounded-full md:-translate-x-1/2 z-10"
                    style={{
                      backgroundColor: "rgba(56,189,248,0.15)",
                      border: "2px solid rgba(56,189,248,0.5)",
                    }}
                  />

                  {/* Card wrapper — alternates sides on md+ */}
                  <div
                    className={`md:grid md:grid-cols-2 md:gap-16 ${
                      side === "right" ? "md:direction-rtl" : ""
                    }`}
                  >
                    <div
                      className={
                        side === "left"
                          ? "md:col-start-1 md:pr-10 md:text-right"
                          : "md:col-start-2 md:pl-10"
                      }
                    >
                      <div
                        data-card
                        className="relative rounded-2xl border border-white/10 backdrop-blur p-5 md:p-6"
                        style={{
                          background:
                            "linear-gradient(145deg, rgba(30,41,59,0.65), rgba(15,23,42,0.85))",
                          boxShadow:
                            "0 30px 60px -30px rgba(56,189,248,0.35), inset 0 1px 0 rgba(255,255,255,0.04)",
                        }}
                      >
                        {/* Period tag */}
                        <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-accent mb-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                          {entry.period}
                        </span>

                        {/* Role + Company */}
                        <h3 className="text-lg md:text-xl font-bold text-text-primary">
                          {entry.role}
                        </h3>
                        <div className="text-sm text-accent-2 mt-0.5">
                          {entry.company}
                        </div>
                        {entry.location && (
                          <div className="text-xs text-text-muted mt-1 font-mono">
                            {entry.location}
                          </div>
                        )}

                        {/* Stack chips */}
                        {entry.stack && (
                          <div className={`flex flex-wrap gap-1.5 mt-3 mb-4 ${side === "left" ? "md:justify-end" : ""}`}>
                            {entry.stack.map((t) => (
                              <span
                                key={t}
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 text-text-muted"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Achievement points */}
                        <ul className="space-y-2 mt-3">
                          {entry.points.map((p, pi) => (
                            <li
                              key={pi}
                              className={`text-sm text-text-muted leading-relaxed relative pl-4 ${
                                side === "left" ? "md:pl-0 md:pr-4 md:text-right" : ""
                              }`}
                            >
                              <span
                                aria-hidden
                                className={`absolute top-2 w-1 h-1 rounded-full bg-accent ${
                                  side === "left" ? "left-0 md:left-auto md:right-0" : "left-0"
                                }`}
                              />
                              {p}
                            </li>
                          ))}
                        </ul>

                        {/* Corner accents */}
                        <span aria-hidden className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-accent/50 rounded-tl-lg" />
                        <span aria-hidden className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-accent-2/50 rounded-br-lg" />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
