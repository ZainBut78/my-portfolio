/**
 * portfolioData.js
 * -----------------
 * Sari personal information yahan rakhi hai. Components mein kabhi
 * hardcode nahi karna — yehi single source of truth hai.
 *
 * Jab user apna real data de, yeh file update karni hai.
 */

export const personal = {
  name: "Zain Butt",
  headline: "Hi, I'm Zain Butt",       // Hero ka bara text
  role: "Full Stack Developer",         // Primary role tag
  subRole: "Python Backend Specialist", // Secondary — powered-by-Python emphasis
  tagline: "Turning ideas into fast, beautiful full-stack applications.",
  bio: `Passionate Full Stack Web Developer with hands-on freelance experience delivering production-grade web applications for international clients across ride-hailing, e-commerce, and AI-integrated domains.

Specialized in building end-to-end solutions from concept to deployment — combining React.js for elegant, responsive frontends with the power of Node.js and Python (Django, Flask, FastAPI) on the backend. Successfully delivered a complete Uber-style ride-hailing platform for a Dubai-based transport company, along with multiple full-stack e-commerce systems and AI-integrated web applications.

Comfortable working across the entire stack — from designing scalable database schemas and RESTful APIs, to deploying production applications with Docker, Nginx, and PM2. Looking to bring my problem-solving mindset, self-driven work ethic, and proven client-delivery track record to a full-time role where I can build products that create real business impact.`,
  location: "Pakistan",
  email: "zainbutt787899@gmail.com",
  resumeUrl: "/Zain_Butt_Designer_Resume.pdf",  // public/Zain_Butt_Designer_Resume.pdf
  profilePhoto: "/hero-photo.png",      // Hero ka real photo (transparent PNG) — X-ray hover ke liye
  avatar: "/about-me.jpg",              // About section ka scroll-in avatar
};

/**
 * Hero section ke CTA buttons — user ne chaaron rakhne ke liye kaha hai.
 * variant: "primary" = accent gradient fill; "ghost" = outline glass button
 */
export const heroCTAs = [
  { label: "View Projects",    href: "#projects", variant: "primary", icon: "→"  },
  { label: "Hire Me",          href: "#contact",  variant: "primary", icon: "✦"  },
  { label: "Download Resume",  href: personal.resumeUrl, variant: "ghost", icon: "⬇", download: "Zain-Butt-Resume.pdf" },
  { label: "Contact Me",       href: "#contact",  variant: "ghost",   icon: "✉"  },
];

/**
 * Contact channels — Contact section mein cards ban ke show honge.
 * Aap URLs mein apne real profile links dalein (TODO markers wale).
 */
export const socials = [
  {
    name: "Gmail",
    label: "zainbutt787899@gmail.com",
    url: "mailto:zainbutt787899@gmail.com",
    icon: "FaEnvelope",
    color: "#EA4335",
    kind: "email",
  },
  {
    name: "WhatsApp",
    label: "+92 XXX XXXXXXX",           // TODO: real number
    url: "https://wa.me/92XXXXXXXXXX",    // TODO: real number without +/spaces
    icon: "FaWhatsapp",
    color: "#25D366",
    kind: "chat",
  },
  {
    name: "GitHub",
    label: "github.com/ZainBut78",
    url: "https://github.com/ZainBut78",
    icon: "FaGithub",
    color: "#f1f5f9",
    kind: "code",
  },
  {
    name: "LinkedIn",
    label: "linkedin.com/in/zain-butt-669650434",
    url: "https://www.linkedin.com/in/zain-butt-669650434/",
    icon: "FaLinkedin",
    color: "#0A66C2",
    kind: "network",
  },
  {
    name: "Upwork",
    label: "upwork.com/freelancers/~01fa40e8781687992d",
    url: "https://www.upwork.com/freelancers/~01fa40e8781687992d?mp_source=share",
    icon: "SiUpwork",
    color: "#14A800",
    kind: "freelance",
  },
  {
    name: "Fiverr",
    label: "fiverr.com/your-id",
    url: "https://www.fiverr.com/your-id", // TODO: real profile
    icon: "SiFiverr",
    color: "#1DBF73",
    kind: "freelance",
  },
];

/* Contact section ka caption — form ke oopar dikhta hai */
export const contactCaption = {
  headline: "Let's build something remarkable.",
  sub: "Available for full-time roles and freelance builds — fast replies, cleaner code, honest scope.",
};

export const navLinks = [
  { label: "Home",       href: "#hero" },
  { label: "About",      href: "#about" },
  { label: "Skills",     href: "#skills" },
  { label: "Projects",   href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact",    href: "#contact" },
];

export const stats = [
  { value: "3+",  label: "Years experience" },
  { value: "20+", label: "Projects shipped" },
  { value: "10+", label: "Happy clients" },
];

/**
 * Skills — flight-radar style flat list. Har chip mein react-icons se icon,
 * accent color, aur "row" property jo perspective grid ke different rows
 * pe fly-in position dega.
 */
export const skills = [
  // Row 0 — flagship
  { name: "React",             icon: "SiReact",         color: "#61DAFB", row: 0 },
  { name: "Node.js",           icon: "SiNodedotjs",     color: "#8CC84B", row: 0 },
  { name: "Python",            icon: "SiPython",        color: "#3776AB", row: 0 },

  // Row 1 — frontend + JS ecosystem
  { name: "Next.js",           icon: "SiNextdotjs",     color: "#f1f5f9", row: 1 },
  { name: "JavaScript",        icon: "SiJavascript",    color: "#F7DF1E", row: 1 },
  { name: "Tailwind",          icon: "SiTailwindcss",   color: "#38bdf8", row: 1 },
  { name: "Three.js",          icon: "SiThreedotjs",    color: "#f1f5f9", row: 1 },

  // Row 2 — Python backend frameworks (user emphasize)
  { name: "Django",            icon: "SiDjango",        color: "#0C4B33", row: 2 },
  { name: "Flask",             icon: "SiFlask",         color: "#f1f5f9", row: 2 },
  { name: "FastAPI",           icon: "SiFastapi",       color: "#009688", row: 2 },

  // Row 3 — AI / automation stack
  { name: "n8n Workflows",     icon: "SiN8N",           color: "#EA4B71", row: 3 },
  { name: "AI Agents",         icon: "SiOpenai",        color: "#f1f5f9", row: 3 },
  { name: "AI / ML Marketing", icon: "SiTensorflow",    color: "#FF6F00", row: 3 },

  // Row 4 — infra / DB / dev tools
  { name: "PostgreSQL",        icon: "SiPostgresql",    color: "#336791", row: 4 },
  { name: "Redis",             icon: "SiRedis",         color: "#DC382D", row: 4 },
  { name: "Docker",            icon: "SiDocker",        color: "#2496ED", row: 4 },
  { name: "AWS",               icon: "SiAmazon",        color: "#FF9900", row: 4 },
];

/**
 * Projects — real data yahan add karein.
 * -------------------------------------------------------------------
 * Har project object ke fields:
 *   title       : Project ka naam
 *   description : 1-2 line description
 *   tech        : Technology tags array (chip form mein dikhenge)
 *   image       : /projects/xyz.jpg — file public/projects/ folder mein rakhein
 *   demoUrl     : Live demo link (agar hai)
 *   codeUrl     : GitHub / repo link
 *   featured    : true → card bara dikhega grid mein (highlight)
 *
 * NAYA PROJECT ADD KARNE KE STEPS:
 *   1. `public/projects/` folder mein image drop karein (e.g. uber-clone.jpg)
 *   2. Neeche array mein naya object add karein — image field: "/projects/uber-clone.jpg"
 *   3. demoUrl / codeUrl mein real links dalein
 *   4. tech array mein technologies list karein
 */
export const projects = [
  {
    title: "Uber-Style Ride-Hailing Platform",
    description:
      "Complete production ride-hailing platform delivered for a Dubai-based transport company — driver + rider apps, dispatch logic, real-time tracking.",
    tech: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
    image: "",   // TODO: /projects/uber-clone.jpg — screenshot public/projects/ mein drop karein
    demoUrl: "#",                            // TODO: real link
    codeUrl: "#",                            // TODO: real link
    featured: true,
  },
  {
    title: "AI-Integrated E-Commerce Suite",
    description:
      "Full-stack e-commerce platform with AI product recommendations, smart search and automated marketing workflows.",
    tech: ["Next.js", "Python", "FastAPI", "PostgreSQL", "AI/ML"],
    image: "",   // TODO: /projects/ecommerce.jpg
    demoUrl: "#",
    codeUrl: "#",
    featured: true,
  },
  {
    title: "n8n Workflow Automations",
    description:
      "Custom n8n pipelines connecting CRMs, payment gateways and AI agents — cutting manual ops time by ~70% for freelance clients.",
    tech: ["n8n", "Node.js", "AI Agents", "APIs"],
    image: "",   // TODO: /projects/n8n.jpg
    demoUrl: "#",
    codeUrl: "#",
    featured: false,
  },
  {
    title: "Django + React Admin Portal",
    description:
      "Multi-tenant admin dashboard with granular role-based access, audit logging and real-time analytics widgets.",
    tech: ["Django", "React", "PostgreSQL", "Tailwind"],
    image: "",   // TODO: /projects/admin-portal.jpg
    demoUrl: "#",
    codeUrl: "#",
    featured: false,
  },
];

/**
 * Experience timeline — sabse latest sabse upar.
 * Har entry:
 *   role, company, period, location, stack (small chips), points (achievement bullets)
 * Aap real details / dates / company names replace kar sakte hain.
 */
export const experience = [
  {
    role: "Freelance Full-Stack Developer",
    company: "Self-Employed",
    period: "2025 — Present",
    location: "Remote · Pakistan",
    stack: ["React", "Node.js", "Python", "n8n", "AI Agents"],
    points: [
      "Shipped 8+ production-grade full-stack apps for clients across Dubai, US and UK.",
      "Built AI-driven automation flows in n8n saving clients ~70% ops time.",
      "Delivered end-to-end: architecture, DB design, backend APIs, React frontends, Docker deploy.",
    ],
  },
  {
    role: "Full-Stack Contractor",
    company: "Dubai Transport Co. (NDA)",
    period: "2025",
    location: "Contract · Remote for Dubai",
    stack: ["React", "Node.js", "PostgreSQL", "Redis", "Docker"],
    points: [
      "Led development of an Uber-style ride-hailing platform (rider + driver apps + dispatch).",
      "Designed real-time trip tracking with Redis geospatial + WebSocket, sub-second latency.",
      "Deployed to production on AWS with Nginx + PM2, handling live client operations.",
    ],
  },
  {
    role: "AI-Integrated E-Commerce Developer",
    company: "Multiple International Clients",
    period: "2024 — 2025",
    location: "Freelance · Remote",
    stack: ["Next.js", "Django", "FastAPI", "AI/ML"],
    points: [
      "Built AI product recommendation + smart-search engines for 3 e-commerce brands.",
      "Integrated OpenAI + custom fine-tuned models into checkout and marketing flows.",
      "Automated marketing campaigns with n8n + AI agents, boosting conversion ~30%.",
    ],
  },
  {
    role: "Freelance Web Developer",
    company: "Upwork / Direct Clients",
    period: "2024",
    location: "Remote",
    stack: ["React", "Flask", "MongoDB"],
    points: [
      "Shipped 12+ freelance projects — landing pages, admin dashboards, REST APIs.",
      "Built long-term client relationships; 100% job success rate on Upwork.",
      "Early exploration into AI-integrated apps that later became a specialty.",
    ],
  },
];

/**
 * Hero X-ray effect ke liye Python code snippet — profile photo ke
 * neeche layer karke show hoga. Coding vibe communicate karne ke liye
 * chuna gaya hai; user apni pasand ka code baad mein swap kar sakta hai.
 */
export const heroCodeSnippet = `
def build_portfolio(dev):
    stack = ["React", "Three.js", "GSAP",
             "Python", "Node.js", "AI"]
    for tech in stack:
        dev.master(tech)
    return dev.ship("cinematic")

class FullStackDeveloper:
    def __init__(self, name):
        self.name = name
        self.passion = 0xC0DE
        self.coffee = float("inf")

    def solve(self, problem):
        while not problem.solved:
            self.think()
            self.code()
        return "shipped"

async def daily_routine():
    await wake_up()
    coffee = brew(strength="max")
    while sun_is_up():
        write_code()
        fix_bugs()
        ship_features()

# On mouse hover — reveal the developer
if cursor.is_over(photo):
    show(python_soul)
`.trim();
