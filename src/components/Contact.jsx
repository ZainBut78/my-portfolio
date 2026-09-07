import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import emailjs from "@emailjs/browser";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import { socials, contactCaption } from "../data/portfolioData";

gsap.registerPlugin(ScrollTrigger);

/**
 * EmailJS config — aap ye 3 values .env ya yahan direct dalein.
 * setup:  1) emailjs.com pe account banayein
 *         2) service + template banayein
 *         3) values yahan replace karein
 * Aap chahen to Vite env vars use karein (VITE_EMAILJS_*).
 */
const EMAILJS = {
  serviceId:  import.meta.env.VITE_EMAILJS_SERVICE_ID  || "YOUR_SERVICE_ID",
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID",
  publicKey:  import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "YOUR_PUBLIC_KEY",
};

/**
 * Contact — signal transmission style
 * -----------------------------------
 * Layout:
 *  LEFT   : caption + contact channel cards (email, whatsapp, github, linkedin,
 *           upwork, fiverr — with icons + magnetic hover)
 *  RIGHT  : contact form (EmailJS)
 *  BG     : ContactBackground (sonar rings + rotating constellation + stars)
 */
export default function Contact() {
  const rootRef = useRef(null);
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle"); // idle | sending | success | error

  /* Scroll reveal */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const leftEls  = leftRef.current?.querySelectorAll("[data-reveal]") ?? [];
      const rightEls = rightRef.current?.querySelectorAll("[data-reveal]") ?? [];
      gsap.from(leftEls, {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
      gsap.from(rightEls, {
        y: 30, opacity: 0, stagger: 0.08, duration: 0.8, ease: "power3.out",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  /* ---------- EmailJS form submit ---------- */
  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    try {
      await emailjs.sendForm(
        EMAILJS.serviceId,
        EMAILJS.templateId,
        formRef.current,
        { publicKey: EMAILJS.publicKey },
      );
      setStatus("success");
      formRef.current?.reset();
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  return (
    <section
      id="contact"
      ref={rootRef}
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      {/* Note: 3D bg (ContactBackground) ab App.jsx cinematic-zone mein hai,
         sticky ke saath overlap kar ke perspective grid se cross-fade karta hai. */}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-16 items-start">

        {/* ============ LEFT: caption + channel cards ============ */}
        <div ref={leftRef} className="flex flex-col">
          {/* Section label */}
          <span data-reveal className="inline-flex items-center gap-2 self-start text-xs font-mono tracking-[0.4em] text-accent mb-4">
            <span className="w-8 h-[1px] bg-accent" />
            // TRANSMIT
          </span>

          {/* Big headline */}
          <h2 data-reveal className="text-4xl sm:text-5xl md:text-5xl font-extrabold leading-[1.1] tracking-tight mb-4">
            <span className="gradient-text glow-text">
              {contactCaption.headline}
            </span>
          </h2>

          {/* Sub caption */}
          <p data-reveal className="text-base md:text-lg text-text-muted leading-relaxed mb-10 max-w-lg">
            {contactCaption.sub}
          </p>

          {/* Channel cards */}
          <div data-reveal className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {socials.map((s) => (
              <ChannelCard key={s.name} social={s} />
            ))}
          </div>
        </div>

        {/* ============ RIGHT: form ============ */}
        <div ref={rightRef} className="relative">
          <div
            className="relative rounded-3xl border border-white/10 backdrop-blur p-6 md:p-8"
            style={{
              background:
                "linear-gradient(145deg, rgba(30,41,59,0.55), rgba(15,23,42,0.8))",
              boxShadow: [
                "0 30px 80px -30px rgba(56,189,248,0.35)",
                "inset 0 1px 0 rgba(255,255,255,0.05)",
              ].join(", "),
            }}
          >
            {/* Corner accents */}
            <span aria-hidden className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-accent/70 rounded-tl-lg" />
            <span aria-hidden className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-accent-2/70 rounded-tr-lg" />
            <span aria-hidden className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-accent-2/70 rounded-bl-lg" />
            <span aria-hidden className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-accent/70 rounded-br-lg" />

            <div data-reveal className="mb-6">
              <h3 className="text-2xl font-bold text-text-primary">
                Send a signal
              </h3>
              <p className="text-sm text-text-muted mt-1">
                Fill in — I reply within 24h.
              </p>
            </div>

            <form
              ref={formRef}
              onSubmit={onSubmit}
              className="space-y-4"
            >
              <FormField data-reveal label="Your name" name="user_name" type="text" placeholder="e.g. Ali Khan" required />
              <FormField data-reveal label="Email" name="user_email" type="email" placeholder="you@example.com" required />
              <FormField data-reveal label="Subject" name="subject" type="text" placeholder="Full-time role / project brief" />
              <FormField
                data-reveal
                label="Message"
                name="message"
                textarea
                placeholder="Tell me about your project — scope, timeline, stack…"
                required
              />

              <div data-reveal className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="relative inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-bg-primary bg-gradient-to-r from-accent to-accent-2 hover:shadow-[0_0_28px_rgba(56,189,248,0.55)] transition-shadow duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === "sending" ? (
                    <>
                      <span
                        aria-hidden
                        className="w-4 h-4 rounded-full border-2 border-bg-primary border-t-transparent animate-spin"
                      />
                      Transmitting…
                    </>
                  ) : (
                    <>
                      Send message
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>

                {status === "success" && (
                  <span className="text-sm text-emerald-400 flex items-center gap-1">
                    ✓ Signal received. I'll reply soon.
                  </span>
                )}
                {status === "error" && (
                  <span className="text-sm text-rose-400 flex items-center gap-1">
                    ⚠ Failed — please try email directly.
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Form field with floating label style ---------- */
function FormField({ label, name, type = "text", placeholder, textarea, required, ...rest }) {
  const inputCls =
    "w-full rounded-xl bg-bg-primary/40 border border-white/10 px-4 py-3 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/25 transition-all";
  return (
    <label className="block" {...rest}>
      <span className="block text-xs font-mono tracking-widest uppercase text-text-muted mb-1.5">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          placeholder={placeholder}
          required={required}
          rows={5}
          className={`${inputCls} resize-none`}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          className={inputCls}
        />
      )}
    </label>
  );
}

/* ---------- Channel card — icon + label with magnetic hover ---------- */
function ChannelCard({ social }) {
  const ref = useRef(null);
  const Icon =
    FaIcons[social.icon] || SiIcons[social.icon] || null;

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = e.clientX - r.left - r.width / 2;
    const cy = e.clientY - r.top - r.height / 2;
    el.style.transform = `translate(${cx * 0.08}px, ${cy * 0.18}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <a
      ref={ref}
      href={social.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), border-color 0.3s ease, box-shadow 0.3s ease",
      }}
      className="group relative flex items-center gap-3 rounded-2xl border border-white/10 bg-bg-card/40 backdrop-blur p-4 hover:border-accent/40 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]"
    >
      {/* Icon */}
      <span
        className="flex-shrink-0 grid place-items-center w-10 h-10 rounded-xl"
        style={{
          background: `${social.color}22`,
          border: `1px solid ${social.color}55`,
        }}
      >
        {Icon ? (
          <Icon size={18} color={social.color} />
        ) : (
          <span className="w-2 h-2 rounded-full" style={{ background: social.color }} />
        )}
      </span>

      <div className="min-w-0">
        <div className="text-sm font-semibold text-text-primary">{social.name}</div>
        <div className="text-[11px] text-text-muted font-mono truncate">
          {social.label}
        </div>
      </div>

      {/* Arrow */}
      <span
        aria-hidden
        className="ml-auto text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all"
      >
        ↗
      </span>
    </a>
  );
}
