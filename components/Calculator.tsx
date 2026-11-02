"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { experiments } from "@/lib/data";
import AnimatedNumber from "./AnimatedNumber";
import { scrollToId } from "@/lib/scroll";
import { spot } from "./About";

const presets = [
  ...experiments.map((e) => ({ id: e.id, label: e.name, lift: e.rpv.lift })),
  { id: "conservative", label: "Conservative win", lift: 5 },
];

// Slider position 0-100 maps to 2k-2M visitors on a log scale so small stores get fine control.
const MIN_V = 2000;
const MAX_V = 2_000_000;
const toVisitors = (p: number) => Math.round((MIN_V * Math.pow(MAX_V / MIN_V, p / 100)) / 100) * 100;
const toPos = (v: number) => (Math.log(v / MIN_V) / Math.log(MAX_V / MIN_V)) * 100;

function Slider({
  label,
  value,
  display,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  display: string;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block">
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-[11px] uppercase tracking-widest text-muted">{label}</span>
        <span className="font-display text-2xl font-bold tabular-nums">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range mt-4 w-full"
        style={{ "--pct": `${pct}%` } as React.CSSProperties}
        data-cursor="Drag"
      />
    </label>
  );
}

export default function Calculator() {
  const root = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(toPos(50_000));
  const [rpv, setRpv] = useState(3);
  const [preset, setPreset] = useState(presets[0].id);

  const visitors = toVisitors(pos);
  const lift = presets.find((p) => p.id === preset)!.lift;
  const current = visitors * rpv;
  const extra = current * (lift / 100);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(root.current, {
        y: 100,
        opacity: 0,
        duration: 1.3,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={root}
      id="calculator"
      onPointerMove={spot}
      className="spotlight mt-8 overflow-hidden rounded-[2rem] border border-accent/30 bg-gradient-to-br from-accent/[0.07] via-bg-2 to-accent-2/[0.08]"
    >
      <div className="grid lg:grid-cols-2">
        <div className="space-y-10 border-b border-line p-8 md:p-12 lg:border-b-0 lg:border-r">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-accent">Revenue calculator</span>
            <h3 className="mt-3 font-display text-4xl font-extrabold leading-[0.95] tracking-tight md:text-5xl">
              What would a win like this be worth to <span className="font-serif font-normal italic text-accent">your</span> store?
            </h3>
          </div>

          <Slider
            label="Monthly visitors"
            value={pos}
            display={visitors.toLocaleString("en-US")}
            min={0}
            max={100}
            step={0.1}
            onChange={setPos}
          />
          <Slider
            label="Revenue per visitor"
            value={rpv}
            display={`$${rpv.toFixed(2)}`}
            min={0.5}
            max={25}
            step={0.25}
            onChange={setRpv}
          />

          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Apply the lift from</span>
            <div className="mt-3 flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPreset(p.id)}
                  className={`rounded-full border px-4 py-2 text-sm transition-all duration-300 ${
                    preset === p.id ? "border-accent bg-accent text-black" : "border-line text-fg/70 hover:border-fg/50"
                  }`}
                >
                  {p.label} <span className="font-mono text-xs opacity-70">+{p.lift}%</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-10 p-8 md:p-12">
          <div>
            <span className="font-mono text-[11px] uppercase tracking-widest text-muted">Extra revenue per month</span>
            <div className="mt-2 break-all font-display text-6xl font-extrabold leading-none tracking-tighter text-accent md:text-8xl">
              <AnimatedNumber value={extra} prefix="+$" />
            </div>
            <p className="mt-4 font-display text-2xl font-bold text-fg/80">
              <AnimatedNumber value={extra * 12} prefix="+$" /> <span className="text-base font-normal text-muted">per year</span>
            </p>
          </div>

          <div className="space-y-4">
            {[
              { label: "Today", value: current, width: (100 / (1 + lift / 100)).toFixed(2), cls: "bg-fg/25" },
              { label: "After the win", value: current + extra, width: "100", cls: "bg-gradient-to-r from-accent-2 to-accent" },
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="text-fg/70">{row.label}</span>
                  <span className="font-mono tabular-nums">
                    <AnimatedNumber value={row.value} prefix="$" />
                    <span className="text-muted"> /mo</span>
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-fg/5">
                  <div
                    className={`h-full rounded-full transition-[width] duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${row.cls}`}
                    style={{ width: `${row.width}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="max-w-xs text-xs leading-relaxed text-muted">
              Illustrative only. It applies a past test&apos;s revenue-per-visitor lift to your numbers. Every store is
              different, which is exactly why we test.
            </p>
            <button
              onClick={() => scrollToId("contact")}
              className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-accent"
            >
              Let&apos;s find your win →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
