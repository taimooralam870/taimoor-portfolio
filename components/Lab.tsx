"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, prefersReducedMotion } from "@/lib/gsap";
import { experiments, type Experiment, type Metric } from "@/lib/data";
import SectionLabel from "./SectionLabel";
import { spot } from "./About";
import AnimatedNumber from "./AnimatedNumber";
import Lightbox from "./Lightbox";
import Calculator from "./Calculator";

type Mode = "control" | "variant";

function format(m: Metric, v: number) {
  return `${m.prefix ?? ""}${v.toFixed(m.decimals ?? 0)}${m.suffix ?? ""}`;
}

function TweenNumber({ metric, mode }: { metric: Metric; mode: Mode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const val = useRef({ v: metric.control ?? 0 });

  useEffect(() => {
    if (metric.control === undefined || metric.variant === undefined) return;
    const target = mode === "variant" ? metric.variant : metric.control;
    const t = gsap.to(val.current, {
      v: target,
      duration: 1.4,
      ease: "expo.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = format(metric, val.current.v);
      },
    });
    return () => {
      t.kill();
    };
  }, [mode, metric]);

  if (metric.control === undefined) return null;
  return (
    <span ref={ref} suppressHydrationWarning>
      {format(metric, metric.control)}
    </span>
  );
}

function MetricRow({ metric, mode }: { metric: Metric; mode: Mode }) {
  const variant = mode === "variant";
  const base = 100 / (1 + metric.lift / 100);
  return (
    <div className="group">
      <div className="mb-2 flex items-baseline justify-between gap-4 text-sm">
        <span className="text-fg/70">{metric.label}</span>
        <span className="flex items-baseline gap-3 font-mono">
          {metric.control !== undefined && (
            <span className="text-fg/80">
              <TweenNumber metric={metric} mode={mode} />
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-xs transition-all duration-500 ${
              variant ? "bg-accent/15 text-accent" : "bg-fg/5 text-muted"
            }`}
          >
            {variant ? `+${metric.lift}%` : "baseline"}
          </span>
        </span>
      </div>
      <div className="relative h-2 overflow-hidden rounded-full bg-fg/5">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
            variant ? "bg-gradient-to-r from-accent-2 to-accent" : "bg-fg/25"
          }`}
          style={{ width: `${variant ? 100 : base}%` }}
        />
        <div className="absolute inset-y-0 w-px bg-fg/50" style={{ left: `${base}%` }} />
      </div>
    </div>
  );
}

function ExperimentCard({ exp }: { exp: Experiment }) {
  const root = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("control");
  const [proofOpen, setProofOpen] = useState(false);
  const closeProof = useCallback(() => setProofOpen(false), []);
  const touched = useRef(false);

  // Flip to the variant automatically the first time the card is in view.
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: root.current,
      start: "top 55%",
      once: true,
      onEnter: () => {
        setTimeout(() => !touched.current && setMode("variant"), 600);
      },
    });
    return () => st.kill();
  }, []);

  const pick = (m: Mode) => {
    touched.current = true;
    setMode(m);
  };
  const variant = mode === "variant";

  return (
    <div
      ref={root}
      onPointerMove={spot}
      className="exp-card spotlight grid overflow-hidden rounded-[2rem] border border-line bg-bg-2/80 backdrop-blur lg:grid-cols-[1fr_1.15fr]"
    >
      <div className="flex flex-col justify-between gap-10 border-b border-line p-8 md:p-12 lg:border-b-0 lg:border-r">
        <div>
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-muted">
            <span>Test #{exp.index}</span>
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full ${variant ? "bg-accent pulse-dot" : "bg-muted"}`} />
              {variant ? "Winner shipped" : "Control"}
            </span>
          </div>
          <h3 className="mt-6 font-display text-4xl font-extrabold leading-none tracking-tight md:text-5xl">{exp.name}</h3>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-accent">{exp.surface}</p>
          <div className="mt-8">
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Hypothesis</span>
            <p className="mt-2 font-serif text-xl italic leading-snug text-fg/85 md:text-2xl">&ldquo;{exp.hypothesis}&rdquo;</p>
          </div>
        </div>

        <div role="radiogroup" aria-label="Show results for" className="relative grid w-full max-w-sm grid-cols-2 rounded-full border border-line p-1">
          <span
            className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
            style={{ transform: variant ? "translateX(100%)" : "none" }}
          />
          {(["control", "variant"] as Mode[]).map((m) => (
            <button
              key={m}
              role="radio"
              aria-checked={mode === m}
              onClick={() => pick(m)}
              className={`relative z-10 rounded-full py-3 text-sm font-medium capitalize transition-colors duration-500 ${
                mode === m ? "text-black" : "text-fg/60 hover:text-fg"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{exp.headline.label}</span>
          <div className="mt-3 flex flex-wrap items-end gap-x-6 gap-y-2">
            <span
              className={`font-display text-[15vw] font-extrabold leading-none tracking-tighter transition-colors duration-700 sm:text-7xl md:text-9xl ${
                variant ? "text-accent" : "text-fg"
              }`}
            >
              <TweenNumber metric={exp.headline} mode={mode} />
            </span>
            <span
              className={`mb-2 rounded-full border px-4 py-2 font-mono text-lg transition-all duration-700 ${
                variant ? "translate-y-0 border-accent text-accent opacity-100" : "translate-y-3 border-line text-muted opacity-0"
              }`}
            >
              ▲ +{exp.headline.lift}%
            </span>
          </div>
          <p className="mt-3 font-mono text-xs text-muted">
            Control {format(exp.headline, exp.headline.control!)} → Variant {format(exp.headline, exp.headline.variant!)}
          </p>
        </div>

        <div className="space-y-5">
          {exp.metrics.map((m) => (
            <MetricRow key={m.label} metric={m} mode={mode} />
          ))}
        </div>
      </div>

      <div className="grid gap-px border-t border-line bg-line sm:grid-cols-3 lg:col-span-2 lg:grid-cols-[1fr_1fr_1fr_1.2fr]">
        {exp.estimates.map((e) => (
          <div key={e.label} className="bg-bg-2 px-8 py-6 md:px-12">
            <div className="font-mono text-[10px] uppercase tracking-widest text-muted">{e.label}</div>
            <div
              className={`mt-1 font-display text-3xl font-extrabold tracking-tight transition-colors duration-700 md:text-4xl ${
                variant ? "text-fg" : "text-fg/25"
              }`}
            >
              <AnimatedNumber value={variant ? e.value : 0} prefix={e.prefix} duration={1.8} />
            </div>
          </div>
        ))}
        <button
          onClick={() => setProofOpen(true)}
          data-cursor="Proof"
          className="group relative flex items-center gap-4 overflow-hidden bg-bg-2 px-8 py-5 text-left sm:col-span-3 lg:col-span-1"
        >
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-white">
            <Image
              src={exp.proof}
              alt=""
              fill
              sizes="96px"
              className="object-cover object-left-top transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          <div>
            <div className="font-mono text-[10px] uppercase tracking-widest text-accent">Straight from Intelligems</div>
            <div className="mt-1 text-sm font-medium">
              View the Intelligems report <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </div>
          </div>
        </button>
      </div>

      {proofOpen && (
        <Lightbox
          src={exp.proof}
          alt={`Intelligems report: ${exp.name}`}
          caption={`Intelligems · ${exp.name} vs control · key metrics`}
          onClose={closeProof}
        />
      )}
    </div>
  );
}

export default function Lab() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const split = SplitText.create(".lab-title", { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.2,
        stagger: 0.1,
        ease: "expo.out",
        scrollTrigger: { trigger: ".lab-title", start: "top 85%" },
      });
      gsap.utils.toArray<HTMLElement>(".exp-card").forEach((card) => {
        gsap.from(card, {
          y: 120,
          rotateX: 12,
          opacity: 0,
          transformPerspective: 1200,
          duration: 1.4,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 90%" },
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="lab" className="relative px-4 py-28 md:px-8 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-40 h-[40rem] w-[40rem] rounded-full bg-accent-2/20 blur-[160px]"
      />
      <div className="relative mx-auto max-w-[1600px]">
        <SectionLabel index="02">The Lab</SectionLabel>
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-end">
          <h2 className="lab-title font-display text-[11vw] font-extrabold uppercase leading-[0.85] tracking-[-0.04em] lg:text-[8vw]">
            Real tests.
            <br />
            <span className="text-gradient">Real revenue.</span>
          </h2>
          <p className="max-w-md text-fg/65 lg:justify-self-end">
            Opinions don&apos;t grow a store, tested changes do. These are results from A/B tests I designed, built and
            ran in Intelligems, measured against control. Flip the switch to compare.
          </p>
        </div>

        <div className="mt-20 space-y-8">
          {experiments.map((e) => (
            <ExperimentCard key={e.id} exp={e} />
          ))}
        </div>

        <Calculator />
      </div>
    </section>
  );
}
