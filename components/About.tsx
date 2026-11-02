"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import SectionLabel from "./SectionLabel";
import Counter from "./Counter";
import { stats } from "@/lib/data";

export default function About() {
  const root = useRef<HTMLElement>(null);
 
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(".about-text", { type: "words" });
      gsap.fromTo(
        split.words,
        { opacity: 0.12 },
        {
          opacity: 1,
          stagger: 0.1,
          ease: "none",
          scrollTrigger: { trigger: ".about-text", start: "top 80%", end: "bottom 45%", scrub: true },
        },
      );
      gsap.from(".stat-card", {
        y: 80,
        opacity: 0,
        duration: 1.1,
        stagger: 0.12,
        ease: "expo.out",
        scrollTrigger: { trigger: ".stats-grid", start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="about" className="relative px-4 py-28 md:px-8 md:py-44">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="01">About</SectionLabel>

        <p className="about-text mt-10 max-w-[1300px] font-display text-[8.5vw] font-bold leading-[1.02] tracking-tight md:text-[4.6vw]">
          I&apos;m a Shopify developer who doesn&apos;t guess. For 4+ years I&apos;ve built and scaled{" "}
          <span className="font-serif font-normal italic text-accent">Shopify Plus</span> stores for health,
          supplement & beauty brands in the US, UK, EU & Canada. I form hypotheses from data, build the variants
          myself in Liquid & JavaScript, and <span className="font-serif font-normal italic text-accent">ship
          the winners.</span>
        </p>

        <div className="stats-grid mt-24 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="stat-card spotlight group flex min-h-64 flex-col justify-between bg-bg p-8" onPointerMove={spot}>
              <span className="font-mono text-xs text-muted">0{i + 1}</span>
              <div>
                <div className="font-display text-7xl font-extrabold tracking-tighter transition-colors duration-500 group-hover:text-accent md:text-8xl">
                  <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
                </div>
                <p className="mt-3 max-w-[16rem] text-sm text-fg/60">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function spot(e: React.PointerEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
}
