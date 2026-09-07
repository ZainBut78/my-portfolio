import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// GSAP ScrollTrigger register (idempotent)
gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis smooth scroll ko poori app ke saath wrap karta hai
 * aur GSAP ScrollTrigger ke saath sync rakhta hai.
 *
 * Isse har section ka scroll-linked animation smooth chalega.
 */
export function useLenis() {
  useEffect(() => {
    // Lenis instance banao — heavy, buttery scroll ke liye
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false, // mobile pe native scroll better feel deta hai
    });

    // Har frame pe Lenis ko GSAP ticker ke through update karo
    function raf(time) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger ko Lenis ke scroll events se update rakho
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);
}
