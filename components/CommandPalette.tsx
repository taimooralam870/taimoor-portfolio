"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { navLinks, profile } from "@/lib/data";
import { scrollToId, getLenis } from "@/lib/scroll";
import { copyEmail } from "./toast";

type Action = { id: string; label: string; hint: string; group: string; run: () => void };

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  const actions = useMemo<Action[]>(
    () => [
      ...[
        { id: "top", label: "Home" },
        ...navLinks,
        { id: "calculator", label: "Revenue calculator" },
        { id: "process", label: "Process" },
        { id: "stack", label: "Stack" },
      ].map(
        (l) => ({ id: `go-${l.id}`, label: `Go to ${l.label}`, hint: "↵", group: "Navigate", run: () => scrollToId(l.id) }),
      ),
      { id: "copy", label: "Copy email address", hint: "⧉", group: "Contact", run: () => copyEmail(profile.email) },
      { id: "mail", label: "Send an email", hint: "↗", group: "Contact", run: () => (window.location.href = `mailto:${profile.email}`) },
      { id: "wa", label: "Message on WhatsApp", hint: "↗", group: "Contact", run: () => window.open(profile.whatsapp, "_blank") },
      { id: "li", label: "Open LinkedIn", hint: "↗", group: "Contact", run: () => window.open(profile.linkedin, "_blank") },
      { id: "cv", label: "Download CV (PDF)", hint: "↓", group: "Contact", run: () => window.open(profile.cv, "_blank") },
      { id: "fun", label: "Surprise me", hint: "✦", group: "Fun", run: () => window.dispatchEvent(new Event("confetti")) },
    ],
    [],
  );

  const results = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  useEffect(() => {
    const reset = () => {
      setQuery("");
      setIndex(0);
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        reset();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    };
    const onOpen = () => {
      reset();
      setOpen(true);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("palette:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("palette:open", onOpen);
    };
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
      requestAnimationFrame(() => input.current?.focus());
    } else {
      lenis?.start();
    }
  }, [open]);

  const run = (a?: Action) => {
    if (!a) return;
    setOpen(false);
    a.run();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (i - 1 + results.length) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      run(results[index]);
    }
  };

  if (!open) return null;

  let lastGroup = "";
  return (
    <div className="fixed inset-0 z-[170] flex items-start justify-center bg-black/60 px-4 pt-[18vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command menu"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-bg-2 shadow-2xl animate-[palette-in_0.35s_cubic-bezier(0.16,1,0.3,1)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-5">
          <span className="text-accent">✦</span>
          <input
            ref={input}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Type a command or search…"
            className="w-full bg-transparent py-5 text-base outline-none placeholder:text-muted"
          />
          <kbd className="rounded-md border border-line px-2 py-1 font-mono text-[10px] text-muted">ESC</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" data-lenis-prevent>
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No results</li>}
          {results.map((a, i) => {
            const header = a.group !== lastGroup ? a.group : null;
            lastGroup = a.group;
            return (
              <li key={a.id}>
                {header && (
                  <div className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-muted">{header}</div>
                )}
                <button
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => run(a)}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                    i === index ? "bg-accent text-black" : "text-fg/80"
                  }`}
                >
                  {a.label}
                  <span className="font-mono text-xs opacity-60">{a.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <style>{`@keyframes palette-in{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
