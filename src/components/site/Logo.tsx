export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <circle cx="16" cy="16" r="15" className="fill-primary" />
        <path d="M6 19 Q16 5 26 19 Z" className="fill-gold" />
        <path d="M9 22h14" className="stroke-ivory" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <span className={`font-display text-xl font-semibold leading-none ${light ? "text-ink-foreground" : "text-foreground"}`}>Việt Du Ký</span>
    </span>
  );
}
