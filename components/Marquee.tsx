"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { marqueeWords } from "@/lib/data";

// Two counter-scrolling rows whose speed and skew react to scroll velocity.
export default function Marquee() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const rows = gsap.utils.toArray<HTMLElement>(".marquee-track", root.current);
    const state = rows.map((_, i) => ({ x: 0, dir: i % 2 === 0 ? -1 : 1 }));
    let boost = 0;
    let skew = 0;

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        boost = gsap.utils.clamp(-25, 25, v / 120);
        state.forEach((s, i) => (s.dir = (i % 2 === 0 ? -1 : 1) * (self.direction === 1 ? 1 : -1)));
      },
    });

    const tick = (_t: number, delta: number) => {
      boost *= 0.92;
      skew += (boost * 0.4 - skew) * 0.1;
      rows.forEach((row, i) => {
        const s = state[i];
        const half = row.scrollWidth / 2;
        s.x += s.dir * (0.05 * delta + Math.abs(boost));
        if (s.x <= -half) s.x += half;
        if (s.x > 0) s.x -= half;
        row.style.transform = `translate3d(${s.x}px,0,0) skewX(${skew}deg)`;
      });
    };
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      st.kill();
    };
  }, []);

  const row = (outline: boolean) =>
    [...marqueeWords, ...marqueeWords].map((w, i) => (
      <span key={i} className="flex shrink-0 items-center gap-8 pr-8">
        <span className={outline ? "text-outline" : ""}>{w}</span>
        <span className="text-accent">✦</span>
      </span>
    ));

  return (
    <div ref={root} className="relative overflow-hidden border-y border-line bg-bg py-6 md:py-10" aria-hidden>
      <div className="-rotate-2 space-y-2">
        <div className="marquee-track flex w-max font-display text-5xl font-extrabold uppercase tracking-tight md:text-8xl">
          {row(false)}
        </div>
        <div className="marquee-track flex w-max font-display text-5xl font-extrabold uppercase tracking-tight md:text-8xl">
          {row(true)}
        </div>
      </div>
    </div>
  );
}
