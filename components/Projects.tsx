"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { projects } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import Magnetic from "./Magnetic";

export default function Projects() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");
      cards.forEach((card, i) => {
        // screenshot drifts inside its browser frame
        gsap.fromTo(
          card.querySelector(".work-shot"),
          { yPercent: -6 },
          {
            yPercent: 0,
            ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "top top", scrub: true },
          },
        );
        // as the next card slides over, this one sinks back
        const next = cards[i + 1];
        if (next) {
          gsap.to(card.querySelector(".work-inner"), {
            scale: 0.94,
            rotateX: 4,
            filter: "brightness(0.75)",
            transformPerspective: 1400,
            ease: "none",
            scrollTrigger: { trigger: next, start: "top bottom", end: "top 15%", scrub: true },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="work" className="relative px-4 py-28 md:px-8 md:py-40">
      <div className="mx-auto max-w-[1600px]">
        <SectionLabel index="04">Selected work</SectionLabel>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display text-[13vw] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] lg:text-[8vw]">
            Stores I&apos;ve <span className="font-serif font-normal normal-case italic text-accent">shaped</span>
          </h2>
          <p className="max-w-sm text-fg/60">
            Health, nutrition and beauty brands I&apos;ve built and scaled on Shopify and Shopify Plus.
          </p>
        </div>

        <div className="mt-16">
          {projects.map((p, i) => (
            <article
              key={p.name}
              className="work-card sticky mb-[8vh] last:mb-0"
              style={{ top: `calc(6rem + ${i * 1.5}rem)` }}
            >
              <div className="work-inner origin-top overflow-hidden rounded-[2rem] border border-line bg-bg-2 will-change-transform">
                <div className="grid lg:grid-cols-[0.85fr_1.5fr]">
                  <div className="flex flex-col justify-between gap-8 p-8 md:p-10">
                    <div>
                      <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
                        <span>
                          0{i + 1} / 0{projects.length}
                        </span>
                        <span className="h-2 w-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 16px ${p.color}` }} />
                      </div>
                      <h3 className="mt-6 font-display text-5xl font-extrabold leading-[0.9] tracking-tight md:text-6xl">
                        {p.name}
                      </h3>
                      <p className="mt-2 font-mono text-xs uppercase tracking-widest" style={{ color: p.color }}>
                        {p.kind}
                      </p>
                      <p className="mt-6 text-fg/65">{p.body}</p>
                      <div className="mt-6 flex flex-wrap gap-2">
                        {p.tags.map((t) => (
                          <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-fg/70">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <Magnetic strength={0.3}>
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-semibold text-black"
                        style={{ background: p.color }}
                      >
                        Visit {p.domain}
                        <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
                      </a>
                    </Magnetic>
                  </div>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="Visit"
                    aria-label={`Open ${p.domain}`}
                    className="group relative block p-3 md:p-6 lg:pl-0"
                  >
                    <div
                      aria-hidden
                      className="absolute inset-10 rounded-full opacity-30 blur-[80px] transition-opacity duration-700 group-hover:opacity-60"
                      style={{ background: p.color }}
                    />
                    <div className="relative overflow-hidden rounded-2xl border border-line bg-[#1a1a1f] shadow-2xl">
                      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                        <span className="ml-3 flex-1 truncate rounded-md bg-white/5 px-3 py-1 text-center font-mono text-[11px] text-fg/50">
                          🔒 {p.domain}
                        </span>
                      </div>
                      <div className="relative aspect-[1800/936] overflow-hidden">
                        <div className="work-shot absolute inset-x-0 -top-[3%] h-[106%]">
                          <Image
                            src={p.image}
                            alt={`${p.name} storefront`}
                            fill
                            sizes="(min-width: 1024px) 60vw, 100vw"
                            className="object-cover object-top transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                          />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
