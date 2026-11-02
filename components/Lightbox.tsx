"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { getLenis } from "@/lib/scroll";

export default function Lightbox({
  src,
  alt,
  caption,
  onClose,
}: {
  src: string;
  alt: string;
  caption?: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [onClose]);

  // Portal to <body>: a transformed ancestor would otherwise trap position: fixed.
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
      data-cursor="Close"
      className="fixed inset-0 z-[170] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-[lb-in_0.4s_ease-out] md:p-10"
    >
      <figure
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-6xl overflow-hidden rounded-3xl border border-line bg-white shadow-2xl animate-[lb-zoom_0.6s_cubic-bezier(0.16,1,0.3,1)]"
        data-lenis-prevent
      >
        <Image src={src} alt={alt} width={1558} height={912} className="h-auto w-full" sizes="(min-width: 1200px) 1152px, 100vw" />
        {caption && (
          <figcaption className="border-t border-black/10 bg-bg-2 px-6 py-4 font-mono text-xs uppercase tracking-widest text-fg/70">
            {caption}
          </figcaption>
        )}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black text-white transition-transform hover:rotate-90"
        >
          ✕
        </button>
      </figure>
      <style>{`@keyframes lb-in{from{opacity:0}to{opacity:1}}@keyframes lb-zoom{from{opacity:0;transform:translateY(40px) scale(.94)}to{opacity:1;transform:none}}`}</style>
    </div>,
    document.body,
  );
}
