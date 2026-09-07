import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Section-level reveal helper — jab section viewport mein aata hai
 * to andar ke children ko stagger ke saath fade + slide karta hai.
 *
 * Usage:
 *   const ref = useScrollReveal();
 *   <section ref={ref}>...</section>
 *
 * Options: { selector: string, y: number, stagger: number, start: string }
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const {
    selector = "[data-reveal]",
    y = 40,
    stagger = 0.08,
    start = "top 80%",
    duration = 0.9,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const items = el.querySelectorAll(selector);
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.from(items, {
        opacity: 0,
        y,
        duration,
        ease: "power3.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [selector, y, stagger, start, duration]);

  return ref;
}
