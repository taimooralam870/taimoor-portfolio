"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { toast } from "./toast";

const secrets = ["taimoor", "shopify", "hire"];
const colors = ["#c8ff2e", "#8b5cf6", "#ff5c39", "#efeee9", "#38bdf8"];

export function burst(x = window.innerWidth / 2, y = window.innerHeight * 0.6) {
  if (prefersReducedMotion()) return;
  const layer = document.createElement("div");
  layer.className = "pointer-events-none fixed inset-0 z-[180] overflow-hidden";
  document.body.appendChild(layer);
  const r = gsap.utils.random;
  for (let i = 0; i < 140; i++) {
    const p = document.createElement("i");
    const size = r(6, 14);
    Object.assign(p.style, {
      position: "absolute",
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size * r(0.4, 1)}px`,
      background: colors[i % colors.length],
      borderRadius: i % 3 === 0 ? "999px" : "2px",
    });
    layer.appendChild(p);
    gsap
      .timeline()
      .to(p, { x: r(-0.5, 0.5) * window.innerWidth, y: -r(150, window.innerHeight * 0.6), rotation: r(-360, 360), duration: r(0.6, 1), ease: "power3.out" })
      .to(p, { y: `+=${window.innerHeight}`, rotation: `+=${r(-540, 540)}`, opacity: 0, duration: r(1.4, 2.2), ease: "power1.in" });
  }
  gsap.delayedCall(3.4, () => layer.remove());
}

export default function EasterEgg() {
  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea") || e.metaKey || e.ctrlKey || e.key.length !== 1) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-12);
      const hit = secrets.find((s) => buffer.endsWith(s));
      if (hit) {
        buffer = "";
        burst();
        toast(hit === "hire" ? "Great decision. Scroll down to say hi ✦" : "✦ You found the secret. Now let's build something.");
      }
    };
    const onConfetti = () => burst();
    window.addEventListener("keydown", onKey);
    window.addEventListener("confetti", onConfetti);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("confetti", onConfetti);
    };
  }, []);

  return null;
}
