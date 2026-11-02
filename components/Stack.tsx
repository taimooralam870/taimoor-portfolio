"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { stack } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import { spot } from "./About";

export default function Stack() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".stack-group").forEach((g) => {
        gsap.from(g.querySelectorAll(".chip"), {
          y: 40,
          opacity: 0,
          scale: 0.8,
          duration: 0.8,
          stagger: 0.03,
          ease: "back.out(2)",
          scrollTrigger: { trigger: g, start: "top 85%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Chips jump away from the pointer, then settle back
  const nudge = (e: React.PointerEvent<HTMLElement>) => {
    if (prefersReducedMotion()) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const dx = (r.left + r.width / 2 - e.clientX) / r.width;
    const dy = (r.top + r.height / 2 - e.clientY) / r.height;
    gsap.fromTo(
      el,
      { x: dx * 18, y: dy * 18, rotate: dx * 8 },
      { x: 0, y: 0, rotate: 0, duration: 1, ease: "elastic.out(1, 0.35)", overwrite: true },
    );
  };

  return (
    <section ref={root} id="stack" className="relative border-t border-line px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="06">Toolbox</SectionLabel>
        <h2 className="mt-8 font-display text-[13vw] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] lg:text-[7vw]">
          The <span className="text-outline">stack</span>
        </h2>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {stack.map((g, i) => (
            <div
              key={g.group}
              onPointerMove={spot}
              className="stack-group spotlight rounded-[2rem] border border-line bg-bg-2 p-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-extrabold">{g.group}</h3>
                <span className="font-mono text-xs text-muted">
                  {String(g.items.length).padStart(2, "0")} / 0{i + 1}
                </span>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item}
                    onPointerEnter={nudge}
                    className="chip rounded-full border border-line bg-bg px-4 py-2 text-sm text-fg/80 transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-black"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] border border-line p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Education</span>
            <p className="mt-3 font-display text-xl font-bold">Bachelor of Business & Information Technology (BBIT)</p>
            <p className="mt-1 text-sm text-fg/60">Virtual University of Pakistan, in progress</p>
          </div>
          <div className="rounded-[2rem] border border-line p-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Languages</span>
            <div className="mt-3 flex gap-8">
              <div>
                <p className="font-display text-xl font-bold">English</p>
                <p className="text-sm text-fg/60">Fluent</p>
              </div>
              <div>
                <p className="font-display text-xl font-bold">Urdu</p>
                <p className="text-sm text-fg/60">Native</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
