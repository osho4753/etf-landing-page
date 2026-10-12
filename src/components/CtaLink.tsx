"use client";

import { track } from "@/lib/track";

type Props = {
  href: string;
  location: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

export function CtaLink({ href, location, className, children, onClick }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => {
        track("cta_click", { location, target: href.replace("#", "") });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}
