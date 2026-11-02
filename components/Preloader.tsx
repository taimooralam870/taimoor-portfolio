"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { markLoaded } from "@/lib/loader";

const words = ["Data", "Hypothesis", "Build", "Test", "Ship"];
// 0-9 plus a trailing 0 so a column can roll from 9 into the next 0 without jumping back.
const strip = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// One fixed-height window per digit; the strip inside slides by whole-em steps.
function Digit({ strip: digits, refCb }: { strip: number[]; refCb: (el: HTMLDivElement | null) => void }) {
  return (
    <span className="relative inline-block h-[1em] overflow-hidden align-top [mask-image:linear-gradient(transparent,black_18%,black_82%,transparent)]">
      <div ref={refCb} className="flex flex-col will-change-transform">
        {digits.map((d, i) => (
          <span key={i} className="block h-[1em] leading-none">
            {d}
          </span>
        ))}
      </div>
    </span>
  );
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const cols = useRef<(HTMLDivElement | null)[]>([]);
  const [word, setWord] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) {
      const id = requestAnimationFrame(() => {
        setDone(true);
        markLoaded();
      });
      return () => cancelAnimationFrame(id);
    }
    document.documentElement.style.overflow = "hidden";
    const counter = { v: 0 };

    // Each column rolls continuously; the higher digits only move while the lower one crosses 9 → 10.
    const render = () => {
      const v = counter.v;
      const ones = v % 10;
      const tens = Math.floor(v / 10) % 10 + Math.max(0, (v % 10) - 9);
      const hundreds = Math.floor(v / 100) + Math.max(0, (v % 100) - 99);
      [hundreds, tens, ones].forEach((pos, i) => {
        const el = cols.current[i];
        if (el) el.style.transform = `translate3d(0, ${-pos}em, 0)`;
      });
      setWord(Math.min(words.length - 1, Math.floor((v / 100) * words.length)));
    };

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setDone(true);
        },
      });
      tl.to(counter, { v: 100, duration: 2.6, ease: "power3.inOut", onUpdate: render })
        .to(".pl-bar", { scaleX: 1, duration: 2.6, ease: "power3.inOut" }, 0)
        .to(".pl-inner", { yPercent: -40, opacity: 0, duration: 0.7, ease: "power3.in" }, "+=0.15")
        // escape this context before telling the page we're done (its callbacks would be scoped here)
        .add(() => setTimeout(markLoaded), "-=0.15")
        .to(root.current, { clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "expo.inOut" }, "-=0.25");
    }, root);
    return () => {
      ctx.revert();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[150] flex flex-col justify-between bg-bg-2 p-6 md:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
      aria-hidden
    >
      <div className="pl-inner flex items-center justify-between font-mono text-xs uppercase tracking-[0.3em] text-muted">
        <span>Taimoor Alam</span>
        <span>Portfolio ©2026</span>
      </div>
      <div className="pl-inner flex flex-col items-start gap-6">
        <div className="h-[1.35em] overflow-hidden font-serif text-4xl italic leading-[1.3] text-accent md:text-6xl">
          <span key={word} className="block animate-[pl-word_0.6s_cubic-bezier(0.16,1,0.3,1)]">
            {words[word]}
          </span>
        </div>
        <div className="flex w-full items-end justify-between">
          <span className="flex font-display text-[32vw] font-extrabold leading-none tracking-tighter tabular-nums md:text-[20vw]">
            <Digit strip={[0, 1]} refCb={(el) => (cols.current[0] = el)} />
            <Digit strip={strip} refCb={(el) => (cols.current[1] = el)} />
            <Digit strip={strip} refCb={(el) => (cols.current[2] = el)} />
          </span>
          <span className="mb-[2vw] hidden font-mono text-xs uppercase tracking-[0.3em] text-muted md:block">
            Loading experience
          </span>
        </div>
        <div className="h-px w-full bg-line">
          <div className="pl-bar h-full origin-left scale-x-0 bg-accent" />
        </div>
      </div>
      <style>{`@keyframes pl-word{from{transform:translateY(105%)}to{transform:none}}`}</style>
    </div>
  );
}
