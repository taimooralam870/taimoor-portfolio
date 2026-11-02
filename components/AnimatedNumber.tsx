"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

const fmt = (v: number, decimals: number) =>
  v.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

// Tweens to `value` whenever it changes, with thousands separators.
export default function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.2,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef({ v: value });

  useEffect(() => {
    const t = gsap.to(current.current, {
      v: value,
      duration,
      ease: "expo.out",
      onUpdate: () => {
        if (ref.current) ref.current.textContent = `${prefix}${fmt(current.current.v, decimals)}${suffix}`;
      },
    });
    return () => {
      t.kill();
    };
  }, [value, prefix, suffix, decimals, duration]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {`${prefix}${fmt(value, decimals)}${suffix}`}
    </span>
  );
}
