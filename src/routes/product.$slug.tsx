import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Heart, Minus, Nfc, Plus } from "lucide-react";
import { toast } from "sonner";
import { collections, products as seed, REGIONS, stories } from "@/lib/data";
import { discountPct, vnd } from "@/lib/format";
import { addToCart, cartQtyFor, useCart, useProducts, wishlistStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { ProductCard, StockBadge } from "@/components/site/ProductCard";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => {
    const p = seed.find((x) => x.slug === params.slug);
    const title = p ? `${p.name} – Việt Du Ký` : "Sản phẩm – Việt Du Ký";
    const desc = p?.description ?? "Chi tiết sản phẩm Việt Du Ký.";
    return { meta: [{ title }, { name: "description", content: desc }, { property: "og:title", content: title }, { property: "og:description", content: desc }, { property: "og:type", content: "product" }] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const products = useProducts();
  const cart = useCart();
  const wishlist = wishlistStore.use();
  const p = products.find((x) => x.slug === slug);
  const [img, setImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [variant, setVariant] = useState<string | undefined>(undefined);

  if (!p) return (
    <div className="container-page py-24 text-center">
      <h1 className="text-3xl">Không tìm thấy sản phẩm</h1>
      <Button asChild className="mt-6"><Link to="/shop">Về cửa hàng</Link></Button>
    </div>
  );
  const v = variant ?? p.variants?.[0];
  const pct = discountPct(p.price, p.originalPrice);
  const remaining = Math.max(0, p.stock - cartQtyFor(p.id, cart));
  const col = collections.find((c) => c.id === p.collectionId);
  const story = stories.find((s) => s.slug === p.storySlug);
  const related = products.filter((x) => x.id !== p.id && x.region === p.region).concat(products.filter((x) => x.region !== p.region)).slice(0, 4);
  const liked = wishlist.includes(p.id);

  const add = () => {
    const added = addToCart(p.id, qty, v);
    if (added === 0) { toast.error("Số lượng trong giỏ đã đạt mức tồn kho hiện có."); return; }
    toast.success(`Đã thêm ${added} × "${p.name}" vào giỏ hàng`, { action: { label: "Xem giỏ", onClick: () => (window.location.href = "/cart") } });
    setQty(1);
  };

  return (
    <div className="container-page pb-28 pt-8 md:pb-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <Link to="/">Trang chủ</Link> / <Link to="/shop">Cửa hàng</Link> / <span className="text-foreground">{p.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="overflow-hidden rounded-3xl bg-muted"><img src={p.gallery[img] ?? p.image} alt={p.name} width={1024} height={1024} className="aspect-square w-full object-cover" /></div>
          <div className="mt-3 flex gap-3">
            {p.gallery.map((g, i) => (
              <button key={i} onClick={() => setImg(i)} aria-label={`Ảnh ${i + 1}`} className={`overflow-hidden rounded-2xl border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                <img src={g} alt="" loading="lazy" width={1024} height={1024} className="size-20 object-cover" />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">{REGIONS[p.region]} · {col?.name}</p>
          <h1 className="mt-2 text-4xl md:text-5xl">{p.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-semibold">{vnd(p.price)}</span>
            {pct > 0 && <><span className="text-lg text-muted-foreground line-through">{vnd(p.originalPrice!)}</span><span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">-{pct}%</span></>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Giá minh họa (demo)</p>
          <p className="mt-5 text-foreground/80">{p.description}</p>

          {p.variants && (
            <fieldset className="mt-6"><legend className="text-sm font-medium">Phiên bản</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {p.variants.map((x) => (
                  <button key={x} onClick={() => setVariant(x)} aria-pressed={x === v}
                    className={`rounded-full border px-4 py-2 text-sm ${x === v ? "border-primary bg-primary/10 text-primary" : "border-input"}`}>{x}</button>
                ))}
              </div>
            </fieldset>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-input">
              <button aria-label="Giảm số lượng" className="p-3" onClick={() => setQty((q) => Math.max(1, q - 1))}><Minus className="size-4" /></button>
              <span className="w-8 text-center" aria-live="polite">{qty}</span>
              <button aria-label="Tăng số lượng" className="p-3" disabled={qty >= remaining} onClick={() => setQty((q) => Math.min(remaining, q + 1))}><Plus className="size-4" /></button>
            </div>
            <div><StockBadge stock={p.stock} />{p.stock > 0 && <p className="text-xs text-muted-foreground">Có thể thêm {remaining} sản phẩm</p>}</div>
          </div>

          <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-border bg-background p-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0">
            <Button size="lg" variant="hero" className="flex-1" disabled={remaining === 0} onClick={add}>
              {p.stock === 0 ? "Hết hàng" : remaining === 0 ? "Đã đạt giới hạn tồn kho" : "Thêm vào giỏ hàng"}
            </Button>
            <Button size="lg" variant="outline" aria-label={liked ? "Bỏ yêu thích" : "Thêm vào yêu thích"} aria-pressed={liked}
              onClick={() => { wishlistStore.set((w) => (liked ? w.filter((x) => x !== p.id) : [...w, p.id])); toast(liked ? "Đã bỏ khỏi danh sách yêu thích" : "Đã thêm vào danh sách yêu thích"); }}>
              <Heart className={liked ? "fill-primary text-primary" : ""} />
            </Button>
          </div>

          <dl className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
            {Object.entries(p.specs).map(([k, val]) => (
              <div key={k} className="flex justify-between px-5 py-3 text-sm"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{val}</dd></div>
            ))}
          </dl>

          {p.nfc && (
            <div className="mt-6 flex gap-4 rounded-3xl bg-secondary p-5 text-secondary-foreground">
              <Nfc className="size-8 shrink-0 text-gold" />
              <div>
                <h2 className="text-lg">Kết nối Hộ chiếu số</h2>
                <p className="mt-1 text-sm text-secondary-foreground/80">Sản phẩm có thẻ NFC. Chạm điện thoại để mở khóa bản sưu tầm số và câu chuyện văn hóa.</p>
                <Link to="/passport/verify" className="mt-2 inline-block text-sm font-medium text-gold">Thử mô phỏng xác thực →</Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {story && (
        <section className="mt-16 grid items-center gap-8 rounded-[2rem] bg-accent/60 p-6 md:grid-cols-[1fr_1.4fr] md:p-10">
          <img src={story.image} alt={story.title} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full rounded-3xl object-cover" />
          <div>
            <p className="eyebrow">Câu chuyện phía sau</p>
            <h2 className="mt-2 text-3xl">{story.title}</h2>
            <p className="mt-3 text-foreground/80">{story.intro} {story.connection}</p>
            <Link to="/stories/$slug" params={{ slug: story.slug }} className="mt-4 inline-block font-medium text-primary">Đọc câu chuyện →</Link>
          </div>
        </section>
      )}

      <section className="mt-16">
        <h2 className="text-3xl">Có thể bạn cũng thích</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">{related.map((r) => <ProductCard key={r.id} product={r} />)}</div>
      </section>
    </div>
  );
}
