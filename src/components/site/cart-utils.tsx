import { shippingFor, useCart, useProducts } from "@/lib/store";

export function useCartLines() {
  const cart = useCart();
  const products = useProducts();
  const lines = cart.map((c, i) => ({ ...c, index: i, product: products.find((p) => p.id === c.productId) })).filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product!.price * l.qty, 0);
  const shipping = shippingFor(subtotal);
  return { lines, subtotal, shipping, total: subtotal + shipping };
}

export function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return <div className={`flex justify-between text-sm ${bold ? "text-base font-semibold" : ""}`}><span className={bold ? "" : "text-muted-foreground"}>{k}</span><span>{v}</span></div>;
}
