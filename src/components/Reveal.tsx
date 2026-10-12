"use client";

import { useEffect } from "react";

export function RevealObserver() {
  useEffect(() => {
    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const pending = items.filter((el) => el.getBoundingClientRect().top >= window.innerHeight);
    for (const el of items) if (!pending.includes(el)) el.dataset.revealed = "";

    const observer = new IntersectionObserver(
      (entries) => {
        let order = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          el.style.setProperty("--reveal-delay", `${order++ * 80}ms`);
          el.dataset.revealed = "";
          observer.unobserve(el);
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of pending) observer.observe(el);
    document.documentElement.classList.add("reveal");
    return () => observer.disconnect();
  }, []);

  return null;
}
