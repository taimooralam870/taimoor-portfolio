"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { navLinks, profile } from "@/lib/data";
import { scrollToId, getLenis } from "@/lib/scroll";
import Magnetic from "./Magnetic";
import Clock from "./Clock";

export default function Nav() {
  const bar = useRef<HTMLElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  // Hide on scroll down, reveal on scroll up; drive the progress bar.
  useEffect(() => {
    let last = 0;
    let hidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      const shouldHide = y > last && y > 200;
      if (shouldHide !== hidden) {
        hidden = shouldHide;
        gsap.to(bar.current, { yPercent: hidden ? -110 : 0, duration: 0.5, ease: "power3.out" });
      }
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section in view.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    navLinks.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      gsap.fromTo(
        menu.current,
        { clipPath: "circle(0% at 100% 0%)" },
        { clipPath: "circle(150% at 100% 0%)", duration: 0.9, ease: "expo.inOut" },
      );
      gsap.fromTo(
        ".menu-link",
        { yPercent: 110 },
        { yPercent: 0, duration: 0.8, stagger: 0.06, ease: "expo.out", delay: 0.35 },
      );
    } else {
      lenis?.start();
    }
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-[80] h-[2px]">
        <div ref={progress} className="h-full origin-left scale-x-0 bg-accent" />
      </div>

      <header ref={bar} className="fixed inset-x-0 top-0 z-[70] px-4 pt-4 md:px-8">
        <nav className="mx-auto flex max-w-[1600px] items-center justify-between rounded-full border border-line bg-bg/60 py-2 pl-5 pr-2 backdrop-blur-xl">
          <button onClick={() => go("top")} className="group flex items-center gap-2" aria-label="Back to top">
            <span className="font-display text-lg font-extrabold tracking-tight">DI</span>
            <span className="h-2 w-2 rounded-full bg-accent transition-transform duration-500 group-hover:scale-150" />
            <span className="hidden font-mono text-[11px] uppercase tracking-widest text-muted sm:inline">
              Shopify × CRO
            </span>
          </button>

          <ul className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => go(l.id)}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                    active === l.id ? "text-black" : "text-fg/70 hover:text-fg"
                  }`}
                >
                  <span
                    className={`absolute inset-0 -z-10 rounded-full bg-accent transition-all duration-500 ${
                      active === l.id ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                  />
                  {l.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted xl:flex">
              PK <Clock />
            </span>
            <button
              onClick={() => window.dispatchEvent(new Event("palette:open"))}
              className="hidden items-center gap-1 rounded-full border border-line px-3 py-2 font-mono text-[11px] text-muted transition-colors hover:border-fg/40 hover:text-fg md:flex"
              aria-label="Open command menu"
            >
              <kbd>⌘</kbd>
              <kbd>K</kbd>
            </button>
            <Magnetic strength={0.25}>
              <a
                href={`mailto:${profile.email}`}
                className="hidden rounded-full bg-fg px-5 py-2.5 text-sm font-medium text-black transition-colors hover:bg-accent sm:block"
              >
                Let&apos;s talk
              </a>
            </Magnetic>
            <button
              onClick={() => setOpen((o) => !o)}
              className="relative z-[75] flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full bg-bg-2 lg:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className={`h-px w-5 bg-fg transition-transform ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
              <span className={`h-px w-5 bg-fg transition-transform ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div
          ref={menu}
          className="fixed inset-0 z-[65] flex flex-col justify-between bg-accent px-6 pb-10 pt-28 text-black lg:hidden"
        >
          <ul className="space-y-1">
            {navLinks.map((l, i) => (
              <li key={l.id} className="overflow-hidden">
                <button
                  onClick={() => go(l.id)}
                  className="menu-link flex items-baseline gap-4 font-display text-6xl font-extrabold tracking-tighter"
                >
                  <span className="font-mono text-xs font-normal">0{i + 1}</span>
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
          <div className="space-y-2 font-mono text-xs uppercase tracking-widest">
            <a href={`mailto:${profile.email}`} className="block break-all">
              {profile.email}
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="block">
              LinkedIn ↗
            </a>
          </div>
        </div>
      )}
    </>
  );
}
