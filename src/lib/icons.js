/**
 * Icon registry — sirf woh icons import karo jo actually use ho rahi hain.
 * Ye tree-shaking friendly hai (kyunki named imports hain), jabki
 * `import * as SiIcons from "react-icons/si"` poori library bundle mein
 * pull kar leta hai (6MB+).
 *
 * Agar naya icon add karna ho: yahan import karein aur registry mein daalein.
 */
import {
  SiReact,
  SiNodedotjs,
  SiPython,
  SiNextdotjs,
  SiJavascript,
  SiTailwindcss,
  SiThreedotjs,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiN8N,
  SiTensorflow,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiUpwork,
  SiFiverr,
} from "react-icons/si";

import {
  FaEnvelope,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaRobot,
  FaAws,
} from "react-icons/fa";

/* Skill / Social / Contact icons ka lookup map */
export const iconMap = {
  // Simple Icons
  SiReact,
  SiNodedotjs,
  SiPython,
  SiNextdotjs,
  SiJavascript,
  SiTailwindcss,
  SiThreedotjs,
  SiDjango,
  SiFlask,
  SiFastapi,
  SiN8N,
  SiTensorflow,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiUpwork,
  SiFiverr,
  // Font Awesome
  FaEnvelope,
  FaWhatsapp,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaRobot,
  FaAws,
};

/** Look up icon component by name string */
export function getIcon(name) {
  return iconMap[name] || null;
}
