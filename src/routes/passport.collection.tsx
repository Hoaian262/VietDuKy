import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Lock } from "lucide-react";
import { collections, digitalCollectibles, REGIONS, type Region } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { passportStore, useProducts, userStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DemoNote } from "@/components/site/ProductCard";

export const Route = createFileRoute("/passport/collection")({
  head: () => ({ meta: [{ title: "Bộ sưu tập số của tôi – Việt Du Ký" }, { name: "description", content: "Xem các bản sưu tầm số đã mở khóa trong Hộ chiếu số." }, { property: "og:title", content: "Bộ sưu tập số – Việt Du Ký" }, { property: "og:description", content: "Hộ chiếu số Việt Nam (demo)." }] }),
  component: Collection,
});

function Collection() {
  const unlocked = passportStore.use();
  const products = useProducts();
  const user = userStore.use();
  const [region, setRegion] = useState<Region | "">("");
  const [series, setSeries] = useState("");
  const owned = Object.keys(unlocked).length;
  const pct = Math.round((owned / digitalCollectibles.length) * 100);
  const items = digitalCollectibles
    .map((d) => ({ ...d, product: products.find((p) => p.id === d.productId)!, date: unlocked[d.id] }))
    .filter((d) => d.product && (!region || d.product.region === region) && (!series || d.product.collectionId === series));

  return (
    <div className="container-page py-12">
      <div className="grid gap-6 rounded-[2rem] bg-ink p-8 text-ink-foreground md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="grid size-20 place-items-center rounded-full bg-gold font-display text-3xl text-gold-foreground">{(user?.name ?? "Nhà sưu tầm")[0]}</div>
        <div>
          <p className="eyebrow text-gold">Hồ sơ nhà sưu tầm (demo)</p>
          <h1 className="mt-1 text-3xl">{user?.name ?? "Nhà sưu tầm mẫu"}</h1>
          <p className="text-sm text-ink-foreground/60">Mã hộ chiếu: VDK-PASS-DEMO-0001</p>
        </div>
        <div className="flex gap-8">
          <div><p className="font-display text-4xl text-gold">{owned}</p><p className="text-xs text-ink-foreground/60">Đã sở hữu</p></div>
          <div><p className="font-display text-4xl text-gold">{pct}%</p><p className="text-xs text-ink-foreground/60">Hoàn thành</p></div>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-foreground/10 md:col-span-3"><div className="h-full bg-gold transition-all" style={{ width: `${pct}%` }} /></div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(["", "bac", "trung", "nam"] as const).map((r) => (
          <button key={r} onClick={() => setRegion(r)} aria-pressed={region === r} className={`rounded-full border px-4 py-2 text-sm ${region === r ? "border-primary bg-primary text-primary-foreground" : "border-input"}`}>{r ? REGIONS[r] : "Tất cả"}</button>
        ))}
        <select aria-label="Dòng sưu tầm" value={series} onChange={(e) => setSeries(e.target.value)} className="h-10 rounded-full border border-input bg-card px-4 text-sm">
          <option value="">Mọi dòng sưu tầm</option>
          {collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <Button asChild variant="hero" className="ml-auto"><Link to="/passport/verify">+ Mở khóa món mới</Link></Button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((d) => (
          <article key={d.id} className={`overflow-hidden rounded-3xl border bg-card ${d.date ? "border-gold" : "border-border"}`}>
            <div className="relative aspect-square">
              <img src={d.product.image} alt={d.product.name} loading="lazy" width={1024} height={1024} className={`size-full object-cover ${d.date ? "" : "opacity-30 grayscale"}`} />
              {!d.date && <div className="absolute inset-0 grid place-items-center"><Lock className="size-8 text-muted-foreground" /></div>}
            </div>
            <div className="p-4">
              <p className="font-mono text-xs text-muted-foreground">{d.id}</p>
              <h3 className="mt-1 font-display text-lg">{d.date ? d.product.name : "Chưa mở khóa"}</h3>
              <p className="text-xs text-muted-foreground">{REGIONS[d.product.region]} · {d.date ? `Mở khóa ${formatDate(d.date)}` : "Chạm NFC để mở khóa"}</p>
              {d.date && d.product.storySlug && <Link to="/stories/$slug" params={{ slug: d.product.storySlug }} className="mt-2 inline-block text-xs font-medium text-primary">Đọc câu chuyện →</Link>}
            </div>
          </article>
        ))}
      </div>
      <div className="mt-8"><DemoNote>Dữ liệu nhà sưu tầm là mẫu minh họa và chỉ lưu trên trình duyệt này.</DemoNote></div>
    </div>
  );
}
