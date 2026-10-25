import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { useCart, userStore } from "@/lib/store";
import { Logo } from "./Logo";

const NAV = [
  { to: "/", label: "Trang chủ" },
  { to: "/shop", label: "Cửa hàng" },
  { to: "/explore", label: "Khám phá Việt Nam" },
  { to: "/passport", label: "Hộ chiếu số" },
  { to: "/about", label: "Về Việt Du Ký" },
] as const;

export function Header() {
  const cart = useCart();
  const user = userStore.use();
  const count = cart.reduce((s, c) => s + c.qty, 0);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <button className="lg:hidden" aria-label="Mở menu" onClick={() => setOpen(true)}><Menu className="size-5" /></button>
        <Link to="/" aria-label="Việt Du Ký – Trang chủ"><Logo /></Link>
        <nav className="ml-8 hidden gap-7 lg:flex" aria-label="Điều hướng chính">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }}
              className="text-sm text-foreground/75 transition-colors hover:text-primary"
              activeProps={{ className: "text-primary font-medium" }}>{n.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <button aria-label="Tìm kiếm" onClick={() => setSearch((s) => !s)} className="rounded-full p-2 hover:bg-muted"><Search className="size-5" /></button>
          <Link to={user ? "/account" : "/login"} aria-label="Tài khoản" className="rounded-full p-2 hover:bg-muted"><User className="size-5" /></Link>
          <Link to="/cart" aria-label={`Giỏ hàng, ${count} sản phẩm`} className="relative rounded-full p-2 hover:bg-muted">
            <ShoppingBag className="size-5" />
            {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">{count}</span>}
          </Link>
        </div>
      </div>
      {search && (
        <form className="container-page pb-3" onSubmit={(e) => { e.preventDefault(); setSearch(false); navigate({ to: "/shop", search: { q } }); }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm sản phẩm, ví dụ: Hội An…" aria-label="Từ khóa tìm kiếm"
            className="h-11 w-full rounded-full border border-input bg-card px-5 text-sm" />
        </form>
      )}
      {open && (
        <div className="fixed inset-0 z-50 bg-ink/40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="h-full w-72 bg-background p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-8 flex items-center justify-between"><Logo /><button aria-label="Đóng menu" onClick={() => setOpen(false)}><X className="size-5" /></button></div>
            <nav className="flex flex-col gap-4">
              {NAV.map((n) => <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="font-display text-xl">{n.label}</Link>)}
              <Link to="/contact" onClick={() => setOpen(false)} className="font-display text-xl">Liên hệ</Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
