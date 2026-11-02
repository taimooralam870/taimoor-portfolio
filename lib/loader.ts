"use client";

// Tiny signal so sections can wait for the preloader to finish before their intro animations.
let loaded = false;
const listeners = new Set<() => void>();

export function markLoaded() {
  loaded = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
}

export function onLoaded(cb: () => void) {
  if (loaded) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
