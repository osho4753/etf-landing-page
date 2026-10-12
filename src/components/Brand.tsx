import Link from "next/link";
export function Brand() {
  return (
    <Link href="/" className="inline-flex items-center gap-2 font-display text-lg font-extrabold tracking-tight" aria-label="TrustOne – úvod">
      <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
        <rect width="28" height="28" rx="8" fill="var(--color-pine)" />
        <path d="M11 9.5 15 7v14" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <circle cx="20.5" cy="20.5" r="2.5" fill="var(--color-gold)" />
      </svg>
      TrustOne
    </Link>
  );
}
