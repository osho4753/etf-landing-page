"use client";

import { useEffect, useState } from "react";
import { CtaLink } from "./CtaLink";
import { useLead } from "./LeadProvider";

export function StickyCta() {
  const { lead } = useLead();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById("formular");
    let formInView = false;
    const io = new IntersectionObserver(([e]) => {
      formInView = e.isIntersecting;
      onScroll();
    });
    if (target) io.observe(target);
    function onScroll() {
      const depth = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setVisible(depth > 0.12 && !formInView);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  if (lead) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-20 border-t border-line bg-paper/95 px-4 py-3 backdrop-blur transition-transform md:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      aria-hidden={!visible}
    >
      <CtaLink href="#formular" location="sticky" className="flex h-12 items-center justify-center rounded-xl bg-pine text-base font-bold text-white">
        Osobní přehled zdarma →
      </CtaLink>
    </div>
  );
}
