"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { onLoaded } from "@/lib/loader";
import { roles } from "@/lib/data";
import { scrollToId } from "@/lib/scroll";
import HeroCanvas from "./HeroCanvas";
import Magnetic from "./Magnetic";
import photo from "@/public/images/taimoor.png";

// Bottom fade, intersected with a soft ellipse around the head so both shoulders melt into the background.
const shoulderMask =
  "linear-gradient(to bottom, #000 62%, transparent 86%), radial-gradient(ellipse 62% 72% at 55% 40%, #000 62%, transparent 100%)";
const shoulderFade = {
  maskImage: shoulderMask,
  WebkitMaskImage: shoulderMask,
  maskComposite: "intersect",
  WebkitMaskComposite: "source-in",
} as const;

function NameLines() {
  return (
    <>
      <span aria-hidden className="hero-line-1 block text-[16vw] md:text-[14vw]">
        <span className="hero-name">Taimoor</span>
      </span>
      <span aria-hidden className="hero-line-2 block text-[16vw] md:text-[14vw]">
        <span className="hero-name">Alam</span>
      </span>
    </>
  );
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const role = useRef<HTMLSpanElement>(null);
  const card = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    let roleTimer: ReturnType<typeof setInterval> | undefined;

    const ctx = gsap.context(() => {
      const split = SplitText.create(".hero-name", { type: "chars", mask: "chars" });
      gsap.set(split.chars, { yPercent: 115 });
      gsap.set(".hero-photo", { clipPath: "inset(100% 0 0 0)" });
      gsap.set(".hero-photo img", { scale: 1.2, transformOrigin: "50% 100%" });
      gsap.set(".hero-fade", { y: 24, opacity: 0 });

      // Runs from the preloader's timeline callback, so resolve selectors against our own root.
      const q = gsap.utils.selector(root);
      const intro = () => {
        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
        tl.to(split.chars, { yPercent: 0, duration: 1.4, stagger: 0.045 })
          .to(q(".hero-photo"), { clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.inOut" }, 0.1)
          .to(q(".hero-photo img"), { scale: 1, duration: 2 }, 0.1)
          .to(q(".hero-fade"), { y: 0, opacity: 1, duration: 1, stagger: 0.08 }, 0.6);
      };
      const off = onLoaded(intro);

      // Scroll: the name splits apart and the photo drifts up
      if (!reduced) {
        const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
        gsap.to(".hero-line-1", { xPercent: -18, scrollTrigger: scroll });
        gsap.to(".hero-line-2", { xPercent: 18, scrollTrigger: scroll });
        gsap.to(".hero-photo-wrap", { yPercent: -12, scale: 0.92, scrollTrigger: scroll });
        gsap.to(".hero-bottom", { opacity: 0, y: -40, scrollTrigger: { ...scroll, end: "40% top" } });
      }

      // Letters near the cursor melt from extra-bold to thin (variable font weight axis)
      let offWeight = () => {};
      if (!reduced && window.matchMedia("(pointer: fine)").matches) {
        const chars = split.chars as HTMLElement[];
        const setters = chars.map((c) => gsap.quickTo(c, "fontWeight", { duration: 0.7, ease: "power3" }));
        let frame = 0;
        let mx = -1e4;
        let my = -1e4;
        const update = () => {
          frame = 0;
          const radius = window.innerWidth * 0.2;
          chars.forEach((c, i) => {
            const r = c.getBoundingClientRect();
            const d = Math.hypot(mx - (r.left + r.width / 2), my - (r.top + r.height / 2));
            const t = Math.max(0, 1 - d / radius);
            setters[i](800 - 600 * t * t * (3 - 2 * t));
          });
        };
        const move = (e: PointerEvent) => {
          mx = e.clientX;
          my = e.clientY;
          if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener("pointermove", move);
        offWeight = () => {
          window.removeEventListener("pointermove", move);
          cancelAnimationFrame(frame);
        };
      }

      // Cycle through roles with a scramble
      let i = 0;
      roleTimer = setInterval(() => {
        i = (i + 1) % roles.length;
        gsap.to(role.current, {
          duration: 1.1,
          scrambleText: { text: roles[i], chars: "!<>-_\\/[]{}—=+*^?#01", speed: 0.6 },
        });
      }, 2800);

      return () => {
        off();
        offWeight();
      };
    }, root);

    // Mouse tilt on the photo
    const el = card.current;
    let cleanupTilt = () => {};
    if (el && !reduced && window.matchMedia("(pointer: fine)").matches) {
      const rx = gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3" });
      const ry = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3" });
      const move = (e: PointerEvent) => {
        rx(-((e.clientY / window.innerHeight) * 2 - 1) * 3);
        ry(((e.clientX / window.innerWidth) * 2 - 1) * 4);
      };
      window.addEventListener("pointermove", move);
      cleanupTilt = () => window.removeEventListener("pointermove", move);
    }

    return () => {
      clearInterval(roleTimer);
      cleanupTilt();
      ctx.revert();
    };
  }, []);

  return (
    <section ref={root} id="top" className="relative min-h-[max(760px,100svh)] overflow-hidden md:flex md:min-h-[max(800px,100svh)]">
      <div
        aria-hidden
        className="absolute left-1/2 top-1/2 h-[70vmax] w-[70vmax] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(139,92,246,0.45), rgba(200,255,46,0.08) 50%, transparent 70%)" }}
      />
      <HeroCanvas />

      {/* Photo: sized to the full hero so the head lines up with the top of the name; bleeds off the bottom */}
      <div
        className="hero-photo-wrap pointer-events-none absolute right-[-6%] top-[12%] z-10 h-[50%] md:top-auto [perspective:1000px] md:bottom-[-15%] md:right-[3vw] md:h-[109%]"
        style={{ aspectRatio: "1086 / 1448" }}
      >
        <div aria-hidden className="pointer-events-none absolute inset-[12%_5%_10%_15%] rounded-full bg-[radial-gradient(ellipse,rgba(139,92,246,0.18),transparent_70%)] blur-2xl" />
        <div ref={card} className="pointer-events-auto relative h-full [transform-style:preserve-3d]" data-cursor="Hello!">
          <div className="hero-photo relative h-full overflow-hidden">
            <Image
              src={photo}
              alt="Taimoor Alam in a black jacket, looking left with violet rim lighting"
              fill
              preload
              placeholder="blur"
              sizes="(min-width: 768px) 60vw, 64vw"
              className="object-contain object-bottom brightness-[0.78] contrast-[1.08]"
              style={shoulderFade}
            />
          </div>

          {/* rotating badge */}
          <div className="absolute bottom-[22%] right-[12%] h-20 w-20 [transform:translateZ(60px)] md:bottom-[24%] md:right-[2%] md:h-24 md:w-24">
            <svg viewBox="0 0 100 100" className="animate-spin-slow h-full w-full">
              <defs>
                <path id="circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="var(--accent)" />
              <text className="fill-black font-mono text-[8.5px] font-semibold uppercase">
                {/* textLength = circumference (2π·38) so the phrase wraps the badge exactly once */}
                <textPath href="#circle" textLength="238" lengthAdjust="spacing">
                  Open to new projects • Shopify Plus • CRO •
                </textPath>
              </text>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-2xl text-black">✦</span>
          </div>

          <div className="absolute bottom-[30%] left-[2%] hidden rounded-2xl border border-line bg-bg/70 px-4 py-3 backdrop-blur-xl [transform:translateZ(80px)] md:block">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">Best RPV lift</div>
            <div className="font-display text-2xl font-bold text-accent">+41%</div>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex min-h-[inherit] w-full flex-col px-4 pb-6 pt-24 md:px-8 md:pb-8 md:pt-28">
        <div className="hero-fade flex items-start justify-between font-mono text-[10px] uppercase tracking-[0.25em] text-muted md:text-[11px]">
          <span>
            Portfolio
            <br />
            ©2026
          </span>
          <span className="hidden text-center md:block">
            Shopify Plus · CRO
            <br />
            Health · Supplements · Beauty DTC
          </span>
          <span className="text-right">
            Based in Pakistan
            <br />
            Working worldwide
          </span>
        </div>

        <div className="relative isolate my-6 flex min-h-[400px] flex-1 flex-col justify-end pb-20 md:my-4 md:min-h-[clamp(520px,65svh,760px)] md:justify-center md:pb-0">
          <h1 className="pointer-events-none relative z-20 w-fit select-none font-display font-extrabold uppercase leading-[0.86] tracking-[-0.055em]">
            <span className="sr-only">Taimoor Alam, Shopify Plus Developer and CRO Specialist</span>
            <NameLines />
          </h1>
        </div>

        <div className="hero-bottom grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <div className="hero-fade max-w-xl">
            <div className="mb-3 flex items-center gap-3">
              <span className="pulse-dot h-2 w-2 rounded-full bg-accent" />
              <span ref={role} className="font-serif text-2xl italic text-accent md:text-4xl">
                {roles[0]}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-fg/70 md:text-base">
              I build and scale Shopify Plus stores for health, supplement & beauty brands, and I make them sell
              more with A/B tests I build myself.
            </p>
          </div>
          <div className="hero-fade flex items-center gap-3">
            <Magnetic>
              <button
                onClick={() => scrollToId("lab")}
                data-cursor="Explore"
                className="group flex items-center gap-3 rounded-full bg-accent px-6 py-4 text-sm font-semibold text-black"
              >
                See the results
                <span className="transition-transform duration-500 group-hover:rotate-45">↗</span>
              </button>
            </Magnetic>
            <Magnetic>
              <button
                onClick={() => scrollToId("contact")}
                className="rounded-full border border-line px-6 py-4 text-sm font-medium backdrop-blur transition-colors hover:border-fg"
              >
                Hire me
              </button>
            </Magnetic>
          </div>
        </div>
      </div>
    </section>
  );
}
