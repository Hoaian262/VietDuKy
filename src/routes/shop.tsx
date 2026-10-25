import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { collections, REGIONS, type Region } from "@/lib/data";
import { useProducts } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { PageTitle, ProductCard } from "@/components/site/ProductCard";

const searchSchema = z.object({
  q: z.string().optional(),
  region: z.enum(["bac", "trung", "nam"]).optional(),
  collection: z.string().optional(),
  price: z.enum(["lt400", "400-500", "gt500"]).optional(),
  stock: z.enum(["in"]).optional(),
  sort: z.enum(["featured", "newest", "asc", "desc"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Cửa hàng – Việt Du Ký" },
      { name: "description", content: "Duyệt art toy, blind box theo vùng miền, bộ sưu tập, mức giá và tình trạng hàng." },
      { property: "og:title", content: "Cửa hàng – Việt Du Ký" },
      { property: "og:description", content: "Art toy văn hóa Việt theo ba miền Bắc, Trung, Nam." },
    ],
  }),
  component: Shop,
});

const sel = "h-10 rounded-full border border-input bg-card px-4 text-sm";

function Shop() {
  const s = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<typeof s>) => navigate({ search: (prev) => ({ ...prev, ...patch }), replace: true });
  const products = useProducts();

  let list = products.filter((p) => {
    if (s.q && !p.name.toLowerCase().includes(s.q.toLowerCase())) return false;
    if (s.region && p.region !== s.region) return false;
    if (s.collection && p.collectionId !== s.collection) return false;
    if (s.price === "lt400" && p.price >= 400000) return false;
    if (s.price === "400-500" && (p.price < 400000 || p.price > 500000)) return false;
    if (s.price === "gt500" && p.price <= 500000) return false;
    if (s.stock === "in" && p.stock === 0) return false;
    return true;
  });
  const sort = s.sort ?? "featured";
  list = [...list].sort((a, b) =>
    sort === "asc" ? a.price - b.price : sort === "desc" ? b.price - a.price
      : sort === "newest" ? b.createdAt.localeCompare(a.createdAt) : Number(b.featured) - Number(a.featured));

  return (
    <>
      <PageTitle eyebrow="Cửa hàng" title="Bộ sưu tập Việt Du Ký" desc="Dữ liệu sản phẩm minh họa cho bản prototype." />
      <div className="container-page">
        <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border bg-card p-3">
          <input value={s.q ?? ""} onChange={(e) => set({ q: e.target.value || undefined })} placeholder="Tìm theo tên…" aria-label="Tìm theo tên sản phẩm" className={`${sel} min-w-48 flex-1`} />
          <select aria-label="Vùng miền" className={sel} value={s.region ?? ""} onChange={(e) => set({ region: (e.target.value || undefined) as Region | undefined })}>
            <option value="">Mọi vùng miền</option>
            {Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select aria-label="Bộ sưu tập" className={sel} value={s.collection ?? ""} onChange={(e) => set({ collection: e.target.value || undefined })}>
            <option value="">Mọi bộ sưu tập</option>
            {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select aria-label="Khoảng giá" className={sel} value={s.price ?? ""} onChange={(e) => set({ price: (e.target.value || undefined) as typeof s.price })}>
            <option value="">Mọi mức giá</option>
            <option value="lt400">Dưới 400.000 ₫</option>
            <option value="400-500">400.000 – 500.000 ₫</option>
            <option value="gt500">Trên 500.000 ₫</option>
          </select>
          <label className="flex items-center gap-2 px-2 text-sm"><input type="checkbox" checked={s.stock === "in"} onChange={(e) => set({ stock: e.target.checked ? "in" : undefined })} />Còn hàng</label>
          <select aria-label="Sắp xếp" className={sel} value={sort} onChange={(e) => set({ sort: e.target.value as typeof s.sort })}>
            <option value="featured">Nổi bật</option>
            <option value="newest">Mới nhất</option>
            <option value="asc">Giá tăng dần</option>
            <option value="desc">Giá giảm dần</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => navigate({ search: {}, replace: true })}>Xóa bộ lọc</Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">{list.length} sản phẩm</p>
        {list.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border p-14 text-center">
            <p className="font-display text-2xl">Không tìm thấy sản phẩm phù hợp</p>
            <p className="mt-2 text-muted-foreground">Thử bỏ bớt bộ lọc hoặc tìm với từ khóa khác.</p>
            <Button className="mt-5" onClick={() => navigate({ search: {}, replace: true })}>Xóa bộ lọc</Button>
          </div>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {list.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </>
  );
}
