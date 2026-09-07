import { useState } from "react";
import { useLenis } from "./hooks/useLenis";
import Loader from "./components/Loader";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Experience from "./components/Experience";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PerspectiveGrid from "./components/PerspectiveGrid";
import ContactBackground from "./components/ContactBackground";

/**
 * App shell — Lenis smooth scroll + intro Loader.
 * Loader finish hone ke baad site fade + slight upward drift ke saath reveal.
 *
 * NOTE: Navbar ko reveal wrapper ke bahar rakha hai — kyunki wrapper pe
 * `transform` CSS lagti hai, aur transform ancestor `position: fixed` ko
 * break karta hai (fixed uski taraf snap ho jata hai, viewport ki jagah).
 */
function App() {
  useLenis();

  // Site content visible tab hoga jab loader curtain up ho jaye
  const [ready, setReady] = useState(false);

  return (
    <>
      <Loader brand="ZB" onFinish={() => setReady(true)} />

      {/* Navbar wrapper ke bahar — fixed positioning correct rehti hai */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity 0.6s ease-out",
        }}
      >
        <Navbar />
      </div>

      {/* Content reveal wrapper — fade + drift up */}
      <div
        style={{
          opacity: ready ? 1 : 0,
          transform: ready ? "translateY(0)" : "translateY(20px)",
          transition:
            "opacity 0.9s ease-out, transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="min-h-screen bg-bg-primary text-text-primary"
      >
        <main>
          <Hero />
          <About />
          {/* CinematicZone: Skills → Projects → Experience → Contact
             share the same background layer. Perspective grid fades out
             AND signal transmission fades in during Experience→Contact
             transition — cross-fade se seamless feel. */}
          <div id="cinematic-zone" className="relative" style={{ backgroundColor: "#020617" }}>
            {/* Layer 1: perspective grid — visible during Skills/Projects/Experience,
               fades out as Contact approaches */}
            <PerspectiveGrid triggerSelector="#cinematic-zone" />
            {/* Layer 2: signal transmission — fades IN as Contact approaches,
               overlaps with grid fade-out (cross-fade) */}
            <ContactBackground triggerSelector="#contact" />
            <div className="relative z-10">
              <Skills />
              <Projects />
              <Experience />
              <Contact />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}

/* Ye placeholder sirf setup verify karne ke liye hai — real components ke aane
   par ye hat jayega. */
function SectionPlaceholder({ id, title, height = "min-h-[80vh]" }) {
  return (
    <section
      id={id}
      className={`${height} flex items-center justify-center border-b border-white/5`}
    >
      <div className="text-center">
        <p className="text-xs uppercase tracking-widest text-accent">Section</p>
        <h2 className="text-4xl md:text-6xl font-bold gradient-text mt-2">
          {title}
        </h2>
        <p className="text-text-muted mt-3">Component agli step mein aayega.</p>
      </div>
    </section>
  );
}

export default App;
