"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { profile } from "@/lib/data";
import { scrollToId } from "@/lib/scroll";
import SectionLabel from "./SectionLabel";
import Magnetic from "./Magnetic";
import Clock from "./Clock";
import { copyEmail } from "./toast";

const links = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "WhatsApp", href: profile.whatsapp },
  { label: "View CV", href: profile.cv },
];

export default function Contact() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(".contact-title", { type: "chars,lines", mask: "lines" });
      gsap.from(split.chars, {
        yPercent: 120,
        rotate: 8,
        duration: 1.2,
        stagger: 0.02,
        ease: "expo.out",
        scrollTrigger: { trigger: ".contact-title", start: "top 80%" },
      });
      gsap.fromTo(
        ".footer-name span",
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.04,
          ease: "expo.out",
          duration: 1.4,
          scrollTrigger: { trigger: ".footer-name", start: "top 95%" },
        },
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="contact" className="relative overflow-hidden px-4 pt-28 md:px-8 md:pt-40">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[50rem] w-[80rem] -translate-x-1/2 rounded-full bg-accent/10 blur-[160px]"
      />
      <div className="relative mx-auto max-w-[1600px]">
        <SectionLabel index="07">Contact</SectionLabel>

        <h2 className="contact-title mt-10 font-display text-[15vw] font-extrabold uppercase leading-[0.85] tracking-[-0.05em] lg:text-[10vw]">
          Let&apos;s make
          <br />
          your store <span className="font-serif font-normal normal-case italic text-accent">sell</span>
        </h2>

        <div className="mt-16 grid gap-12 border-t border-line pt-12 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-24">
          <Magnetic strength={0.4}>
            <a
              href={`mailto:${profile.email}`}
              data-cursor="Write"
              className="group relative flex h-48 w-48 items-center justify-center overflow-hidden rounded-full bg-accent text-black md:h-60 md:w-60"
            >
              <span className="absolute inset-0 origin-bottom scale-y-0 rounded-full bg-fg transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-y-100" />
              <span className="relative text-center font-display text-xl font-extrabold uppercase leading-tight md:text-2xl">
                Get in
                <br />
                touch ↗
              </span>
            </a>
          </Magnetic>

          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Email</span>
              <button
                onClick={() => copyEmail(profile.email)}
                data-cursor="Copy"
                className="group mt-2 block text-left font-display text-base font-bold break-all sm:text-xl md:text-2xl"
              >
                <span className="bg-gradient-to-r from-accent to-accent bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-1 transition-[background-size] duration-500 group-hover:bg-[length:100%_2px]">
                  {profile.email}
                </span>
              </button>
              <span className="mt-6 block font-mono text-[11px] uppercase tracking-widest text-muted">Phone / WhatsApp</span>
              <a href={profile.whatsapp} target="_blank" rel="noreferrer" className="mt-2 block font-display text-xl font-bold md:text-2xl">
                {profile.phone}
              </a>
            </div>
            <div className="space-y-6">
              <div>
                <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Local time · UTC+5</span>
                <p className="mt-2 font-display text-xl font-bold md:text-2xl">
                  <Clock seconds />
                </p>
                <p className="text-sm text-fg/60">{profile.location}. Remote, overlapping with US, UK & EU hours.</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm transition-colors hover:border-accent hover:bg-accent hover:text-black"
                    >
                      {l.label} <span aria-hidden>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative mx-auto mt-28 max-w-[1600px]">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-6 font-mono text-[11px] uppercase tracking-widest text-muted">
          <span>© 2026 Taimoor Alam</span>
          <span className="hidden md:inline">Psst… type &ldquo;shopify&rdquo; anywhere</span>
          <button onClick={() => scrollToId("top")} className="transition-colors hover:text-accent" data-cursor="Up">
            Back to top ↑
          </button>
        </div>
        <div
          aria-hidden
          className="footer-name flex select-none justify-between overflow-hidden pb-[2vw] font-display text-[18vw] font-extrabold uppercase leading-[0.78] tracking-[-0.05em]"
        >
          {"TAIMOOR".split("").map((c, i) => (
            <span
              key={i}
              className="inline-block text-transparent transition-all duration-300 [-webkit-text-stroke:1px_var(--accent)] hover:-translate-y-4 hover:text-accent"
            >
              {c}
            </span>
          ))}
        </div>
      </footer>
    </section>
  );
}
