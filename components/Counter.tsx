"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

// Counts up from 0 the first time it scrolls into view.
export default function Counter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const render = () => (el.textContent = `${prefix}${obj.v.toFixed(decimals)}${suffix}`);
    render();
    const tween = gsap.to(obj, {
      v: value,
      duration: 2,
      ease: "power3.out",
      onUpdate: render,
      scrollTrigger: { trigger: el, start: "top 90%" },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, prefix, suffix, decimals]);

  return (
    <span ref={ref} suppressHydrationWarning>
      {`${prefix}${value.toFixed(decimals)}${suffix}`}
    </span>
  );
}
