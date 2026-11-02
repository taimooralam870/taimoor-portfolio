"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { services } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import { spot } from "./About";

const glyphs = ["◐", "◆", "⬡", "↻", "⚡", "⇄"];

export default function Services() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      const tween = gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      gsap.to(".svc-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true },
      });
      // each card tilts slightly as it travels across the viewport
      gsap.utils.toArray<HTMLElement>(".svc-card").forEach((card) => {
        gsap.fromTo(
          card,
          { rotate: 3, y: 40 },
          {
            rotate: -3,
            y: -40,
            ease: "none",
            scrollTrigger: {
              trigger: card,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          },
        );
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={root} id="services" className="relative overflow-hidden bg-bg-2 py-28 lg:flex lg:h-screen lg:items-center lg:py-0">
      <div
        ref={track}
        className="flex flex-col gap-6 px-4 md:px-8 lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:pr-[10vw]"
      >
        <div className="flex shrink-0 flex-col justify-center lg:w-[38vw] lg:pr-8">
          <SectionLabel index="03">Services</SectionLabel>
          <h2 className="mt-8 font-display text-[15vw] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] lg:text-[7vw]">
            What I
            <br />
            <span className="font-serif font-normal normal-case italic text-accent">build</span> for
            <br />
            brands
          </h2>
          <p className="mt-8 max-w-sm text-fg/60">
            The whole Shopify stack, from the theme to checkout to the data, built by someone who measures whether it
            actually converts.
          </p>
          <div className="mt-10 hidden h-px w-64 bg-line lg:block">
            <div className="svc-progress h-full origin-left scale-x-0 bg-accent" />
          </div>
        </div>

        {services.map((s, i) => (
          <article
            key={s.title}
            onPointerMove={spot}
            data-cursor=""
            className="svc-card spotlight group relative flex min-h-[26rem] shrink-0 flex-col justify-between overflow-hidden rounded-[2rem] border border-line bg-bg p-8 transition-colors duration-500 hover:border-accent/50 md:p-10 lg:h-[68vh] lg:w-[30vw] lg:min-w-[380px]"
          >
            <span
              aria-hidden
              className="text-outline pointer-events-none absolute -right-4 -top-10 font-display text-[12rem] font-extrabold leading-none opacity-20 transition-all duration-700 group-hover:-translate-y-2 group-hover:opacity-50"
            >
              0{i + 1}
            </span>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-line text-3xl text-accent transition-all duration-700 group-hover:rotate-[360deg] group-hover:bg-accent group-hover:text-black">
              {glyphs[i]}
            </div>
            <div>
              <h3 className="font-display text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">{s.title}</h3>
              <p className="mt-4 text-fg/60">{s.body}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {s.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-fg/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
