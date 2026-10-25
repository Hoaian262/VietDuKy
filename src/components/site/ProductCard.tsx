import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { collections, LOW_STOCK, REGIONS, type Product } from "@/lib/data";
import { discountPct, vnd } from "@/lib/format";
import { addToCart } from "@/lib/store";
import { Button } from "@/components/ui/button";

export function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="text-xs font-medium text-destructive">Hết hàng</span>;
  if (stock <= LOW_STOCK) return <span className="text-xs font-medium text-primary">Chỉ còn {stock}</span>;
  return <span className="text-xs font-medium text-success">Còn hàng</span>;
}

export function ProductCard({ product }: { product: Product }) {
  const pct = discountPct(product.price, product.originalPrice);
  const col = collections.find((c) => c.id === product.collectionId);
  const quickAdd = () => {
    const added = addToCart(product.id, 1, product.variants?.[0]);
    if (added) toast.success(`Đã thêm "${product.name}" vào giỏ hàng`);
    else toast.error("Bạn đã thêm tối đa số lượng còn trong kho");
  };
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-border/70 bg-card transition-shadow hover:shadow-soft">
      <Link to="/product/$slug" params={{ slug: product.slug }} className="relative block aspect-square overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} loading="lazy" width={1024} height={1024}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {pct > 0 && <span className="absolute left-3 top-3 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">-{pct}%</span>}
        {product.nfc && <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-ink-foreground">NFC</span>}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs text-muted-foreground">{REGIONS[product.region]} · {col?.name}</p>
        <h3 className="mt-1 font-display text-lg leading-snug">{product.name}</h3>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-semibold text-foreground">{vnd(product.price)}</span>
          {pct > 0 && <span className="text-sm text-muted-foreground line-through">{vnd(product.originalPrice!)}</span>}
        </div>
        <div className="mt-1"><StockBadge stock={product.stock} /></div>
        <div className="mt-auto flex gap-2 pt-4">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to="/product/$slug" params={{ slug: product.slug }}>Xem chi tiết</Link>
          </Button>
          <Button size="sm" aria-label={`Thêm nhanh ${product.name} vào giỏ`} disabled={product.stock === 0} onClick={quickAdd}><Plus /></Button>
        </div>
      </div>
    </article>
  );
}

export function DemoNote({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-gold/50 bg-accent/60 px-4 py-3 text-sm text-accent-foreground">{children}</p>;
}

export function PageTitle({ eyebrow, title, desc }: { eyebrow?: string; title: string; desc?: string }) {
  return (
    <div className="container-page pb-8 pt-12 md:pt-16">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h1 className="mt-2 text-4xl md:text-5xl">{title}</h1>
      {desc && <p className="mt-3 max-w-2xl text-muted-foreground">{desc}</p>}
    </div>
  );
}
