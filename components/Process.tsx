"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { process } from "@/lib/data";
import SectionLabel from "./SectionLabel";

export default function Process() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".proc-fill", {
        scaleY: 1,
        ease: "none",
        scrollTrigger: { trigger: ".proc-list", start: "top 60%", end: "bottom 60%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".proc-step").forEach((step) => {
        gsap.to(step, {
          scrollTrigger: {
            trigger: step,
            start: "top 60%",
            end: "bottom 60%",
            toggleClass: { targets: step, className: "is-active" },
          },
        });
        if (!prefersReducedMotion()) {
          gsap.from(step.querySelector(".proc-body"), {
            x: 60,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 80%" },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="process" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-[1fr_1.3fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionLabel index="05">Process</SectionLabel>
          <h2 className="mt-8 font-display text-[13vw] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] lg:text-[6vw]">
            From data
            <br />
            to <span className="font-serif font-normal normal-case italic text-accent">winner</span>
          </h2>
          <p className="mt-8 max-w-sm text-fg/60">
            The same loop on every engagement. Most CRO work stops at a recommendation. I build the change too, so
            ideas get tested in days, not weeks.
          </p>
        </div>

        <ol className="proc-list relative">
          <div className="absolute bottom-0 left-[27px] top-0 w-px bg-line md:left-[35px]">
            <div className="proc-fill h-full origin-top scale-y-0 bg-gradient-to-b from-accent-2 to-accent" />
          </div>
          {process.map((p, i) => (
            <li key={p.step} className="proc-step group relative flex gap-6 pb-20 last:pb-0 md:gap-10">
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line bg-bg font-mono text-sm text-muted transition-all duration-500 group-[.is-active]:border-accent group-[.is-active]:bg-accent group-[.is-active]:text-black md:h-[70px] md:w-[70px]">
                0{i + 1}
              </span>
              <div className="proc-body pt-2 md:pt-4">
                <h3 className="font-display text-3xl font-extrabold tracking-tight text-fg/40 transition-colors duration-500 group-[.is-active]:text-fg md:text-5xl">
                  {p.step}
                </h3>
                <p className="mt-3 max-w-md text-fg/60">{p.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
