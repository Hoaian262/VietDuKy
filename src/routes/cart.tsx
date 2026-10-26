import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { FREE_SHIP_THRESHOLD } from "@/lib/data";
import { vnd } from "@/lib/format";
import { cartStore, setCartQty } from "@/lib/store";
import { Row, useCartLines } from "@/components/site/cart-utils";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/site/ProductCard";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Giỏ hàng – Việt Du Ký" }, { name: "description", content: "Xem và chỉnh sửa giỏ hàng của bạn." }, { property: "og:title", content: "Giỏ hàng – Việt Du Ký" }, { property: "og:description", content: "Giỏ hàng Việt Du Ký." }] }),
  component: CartPage,
});

function CartPage() {
  const { lines, subtotal, shipping, total } = useCartLines();
  if (lines.length === 0) return (
    <div className="container-page py-24 text-center">
      <h1 className="text-4xl">Giỏ hàng đang trống</h1>
      <p className="mt-3 text-muted-foreground">Hãy bắt đầu hành trình sưu tầm của bạn.</p>
      <Button asChild variant="hero" size="lg" className="mt-6"><Link to="/shop">Khám phá cửa hàng</Link></Button>
    </div>
  );
  return (
    <>
      <PageTitle title="Giỏ hàng" />
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="divide-y divide-border rounded-3xl border border-border bg-card">
          {lines.map((l) => (
            <li key={l.index} className="flex gap-4 p-4">
              <img src={l.product!.image} alt={l.product!.name} width={96} height={96} className="size-24 rounded-2xl object-cover" />
              <div className="flex flex-1 flex-col">
                <Link to="/product/$slug" params={{ slug: l.product!.slug }} className="font-display text-lg">{l.product!.name}</Link>
                {l.variant && <p className="text-xs text-muted-foreground">Phiên bản: {l.variant}</p>}
                <p className="text-sm text-muted-foreground">{vnd(l.product!.price)}</p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <div className="flex items-center rounded-full border border-input">
                    <button aria-label="Giảm" className="p-2" onClick={() => setCartQty(l.index, l.qty - 1)}><Minus className="size-4" /></button>
                    <span className="w-8 text-center">{l.qty}</span>
                    <button aria-label="Tăng" className="p-2" onClick={() => setCartQty(l.index, l.qty + 1)}><Plus className="size-4" /></button>
                  </div>
                  <span className="font-semibold">{vnd(l.product!.price * l.qty)}</span>
                  <button aria-label="Xóa sản phẩm" className="p-2 text-muted-foreground hover:text-destructive" onClick={() => cartStore.set((c) => c.filter((_, j) => j !== l.index))}><Trash2 className="size-4" /></button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit space-y-3 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-2xl">Tóm tắt</h2>
          <Row k="Tạm tính" v={vnd(subtotal)} />
          <Row k="Phí vận chuyển (ước tính)" v={shipping ? vnd(shipping) : "Miễn phí"} />
          {shipping > 0 && <p className="text-xs text-muted-foreground">Miễn phí vận chuyển cho đơn từ {vnd(FREE_SHIP_THRESHOLD)}.</p>}
          <div className="border-t border-border pt-3"><Row k="Tổng cộng" v={vnd(total)} bold /></div>
          <Button asChild variant="hero" size="lg" className="w-full"><Link to="/checkout">Tiến hành thanh toán</Link></Button>
          <Button asChild variant="outline" className="w-full"><Link to="/shop">Tiếp tục mua sắm</Link></Button>
        </aside>
      </div>
    </>
  );
}

