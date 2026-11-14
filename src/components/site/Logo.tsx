import logoImg from "@/assets/logo.png";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <img src={logoImg} alt="Việt Du Ký" className="h-8 w-auto" />
      <span className={`font-display text-xl font-semibold leading-none ${light ? "text-ink-foreground" : "text-foreground"}`}>Việt Du Ký</span>
    </span>
  );
}