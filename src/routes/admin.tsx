import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { collections, digitalCollectibles, LOW_STOCK, ORDER_STATUS, REGIONS, products as seed, type OrderStatus, type Product, type Region } from "@/lib/data";
import { formatDate, vnd } from "@/lib/format";
import { orderStore, passportStore, productStore, useProducts } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Quản trị (demo) – Việt Du Ký" }, { name: "description", content: "Bảng quản trị minh họa." }, { property: "og:title", content: "Quản trị demo" }, { property: "og:description", content: "Admin demo Việt Du Ký." }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const TABS = ["Tổng quan", "Sản phẩm", "Đơn hàng", "Tồn kho", "Sưu tầm số", "Phân tích"] as const;
const card = "rounded-2xl border border-border bg-card p-5";
const inp = "h-10 rounded-lg border border-input bg-background px-3 text-sm";

function Admin() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tổng quan");
  return (
    <div className="flex min-h-screen bg-muted/50">
      <aside className="hidden w-60 shrink-0 bg-sidebar p-5 text-sidebar-foreground md:block">
        <Link to="/"><Logo light /></Link>
        <nav className="mt-8 space-y-1">
          {TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`block w-full rounded-lg px-3 py-2 text-left text-sm ${tab === t ? "bg-sidebar-accent text-sidebar-primary" : "hover:bg-sidebar-accent/60"}`}>{t}</button>)}
        </nav>
      </aside>
      <main className="flex-1 p-5 md:p-8">
        <div className="mb-4 flex gap-2 overflow-x-auto md:hidden">{TABS.map((t) => <button key={t} onClick={() => setTab(t)} className={`shrink-0 rounded-full border px-3 py-1 text-sm ${tab === t ? "bg-primary text-primary-foreground" : "bg-card"}`}>{t}</button>)}</div>
        <p className="mb-6 rounded-xl border border-gold/50 bg-accent px-4 py-3 text-sm">Khu vực quản trị DEMO: không có xác thực và chỉ thao tác trên dữ liệu mẫu lưu ở trình duyệt. Hệ thống thật cần đăng nhập, phân quyền và kiểm soát truy cập phía máy chủ.</p>
        <h1 className="mb-6 text-3xl">{tab}</h1>
        {tab === "Tổng quan" && <Overview />}
        {tab === "Sản phẩm" && <Products />}
        {tab === "Đơn hàng" && <Orders />}
        {tab === "Tồn kho" && <Inventory />}
        {tab === "Sưu tầm số" && <Collectibles />}
        {tab === "Phân tích" && <Analytics />}
      </main>
    </div>
  );
}

function useSeries() {
  const orders = orderStore.use().filter((o) => o.status !== "cancelled");
  const byDay: Record<string, { date: string; orders: number; revenue: number }> = {};
  orders.forEach((o) => { const d = (byDay[o.createdAt] ??= { date: o.createdAt.slice(5), orders: 0, revenue: 0 }); d.orders++; d.revenue += o.total; });
  return { orders, series: Object.keys(byDay).sort().map((k) => byDay[k]) };
}

function Overview() {
  const products = useProducts();
  const { orders, series } = useSeries();
  const all = orderStore.use();
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[["Tổng đơn", all.length], ["Sản phẩm", products.length], ["Sắp hết hàng", products.filter((p) => p.stock <= LOW_STOCK).length], ["Doanh thu demo", vnd(orders.reduce((s, o) => s + o.total, 0))]].map(([k, v]) => (
          <div key={k} className={card}><p className="text-sm text-muted-foreground">{k}</p><p className="mt-2 font-display text-2xl">{v}</p></div>
        ))}
      </div>
      <div className={card}><h2 className="mb-4 text-xl">Doanh thu theo ngày (mẫu)</h2>
        <div className="h-64"><ResponsiveContainer><BarChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="date" fontSize={12} /><YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} /><Tooltip formatter={(v: number) => vnd(v)} /><Bar dataKey="revenue" fill="var(--primary)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </div>
      <div className={card}><h2 className="mb-3 text-xl">Đơn gần đây</h2>
        {all.slice(0, 5).map((o) => <div key={o.id} className="flex justify-between border-t border-border py-2 text-sm"><span>{o.id}</span><span>{ORDER_STATUS[o.status]}</span><span className="font-medium">{vnd(o.total)}</span></div>)}
      </div>
    </div>
  );
}

const empty = (): Product => ({ id: `p${Date.now()}`, slug: "", name: "", collectionId: collections[0]!.id, region: "bac", price: 0, stock: 0, image: seed[0]!.image, gallery: [], description: "", specs: {}, nfc: true, featured: false, createdAt: new Date().toISOString().slice(0, 10) });

function Products() {
  const products = useProducts();
  const [q, setQ] = useState("");
  const [region, setRegion] = useState("");
  const [edit, setEdit] = useState<Product | null>(null);
  const [err, setErr] = useState("");
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) && (!region || p.region === region));
  const save = () => {
    if (!edit) return;
    if (edit.name.trim().length < 2) return setErr("Tên sản phẩm cần ít nhất 2 ký tự.");
    if (edit.price <= 0) return setErr("Giá bán phải lớn hơn 0.");
    if (edit.originalPrice && edit.originalPrice < edit.price) return setErr("Giá gốc phải lớn hơn hoặc bằng giá bán.");
    const slug = edit.slug || edit.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/gi, "d").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const p = { ...edit, slug, gallery: [edit.image] };
    productStore.set((ps) => (ps.some((x) => x.id === p.id) ? ps.map((x) => (x.id === p.id ? p : x)) : [...ps, p]));
    setEdit(null); setErr("");
  };
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <input className={inp} placeholder="Tìm sản phẩm…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className={inp} value={region} onChange={(e) => setRegion(e.target.value)}><option value="">Mọi vùng</option>{Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <Button className="ml-auto" onClick={() => setEdit(empty())}>+ Thêm sản phẩm</Button>
        <Button variant="outline" onClick={() => confirm("Khôi phục toàn bộ dữ liệu sản phẩm mẫu?") && productStore.set(seed)}>Khôi phục mẫu</Button>
      </div>
      {edit && (
        <div className={`${card} grid gap-3 md:grid-cols-3`}>
          <label className="text-sm md:col-span-2">Tên<input className={`${inp} mt-1 w-full`} value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></label>
          <label className="text-sm">URL ảnh<input className={`${inp} mt-1 w-full`} value={edit.image} onChange={(e) => setEdit({ ...edit, image: e.target.value })} /></label>
          <label className="text-sm">Giá bán<input type="number" className={`${inp} mt-1 w-full`} value={edit.price} onChange={(e) => setEdit({ ...edit, price: +e.target.value })} /></label>
          <label className="text-sm">Giá gốc (giảm giá)<input type="number" className={`${inp} mt-1 w-full`} value={edit.originalPrice ?? ""} onChange={(e) => setEdit({ ...edit, originalPrice: e.target.value ? +e.target.value : undefined })} /></label>
          <label className="text-sm">Tồn kho<input type="number" min={0} className={`${inp} mt-1 w-full`} value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: Math.max(0, +e.target.value) })} /></label>
          <label className="text-sm">Vùng<select className={`${inp} mt-1 w-full`} value={edit.region} onChange={(e) => setEdit({ ...edit, region: e.target.value as Region })}>{Object.entries(REGIONS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></label>
          <label className="text-sm">Bộ sưu tập<select className={`${inp} mt-1 w-full`} value={edit.collectionId} onChange={(e) => setEdit({ ...edit, collectionId: e.target.value })}>{collections.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={edit.nfc} onChange={(e) => setEdit({ ...edit, nfc: e.target.checked })} />Có NFC</label>
          <label className="text-sm md:col-span-3">Mô tả<textarea className="mt-1 w-full rounded-lg border border-input bg-background p-3 text-sm" value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></label>
          {err && <p className="text-sm text-destructive md:col-span-3">{err}</p>}
          <div className="flex gap-2 md:col-span-3"><Button onClick={save}>Lưu</Button><Button variant="outline" onClick={() => { setEdit(null); setErr(""); }}>Hủy</Button></div>
        </div>
      )}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left"><tr>{["Sản phẩm", "Vùng", "Giá", "Tồn", "NFC", ""].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p.id} className="border-t border-border">
              <td className="flex items-center gap-3 p-3"><img src={p.image} alt="" width={40} height={40} className="size-10 rounded-lg object-cover" />{p.name}</td>
              <td className="p-3">{REGIONS[p.region]}</td><td className="p-3">{vnd(p.price)}</td><td className="p-3">{p.stock}</td><td className="p-3">{p.nfc ? "Có" : "Không"}</td>
              <td className="space-x-2 whitespace-nowrap p-3 text-right">
                <Button size="sm" variant="outline" onClick={() => setEdit(p)}>Sửa</Button>
                <Button size="sm" variant="destructive" onClick={() => confirm(`Xóa "${p.name}"?`) && productStore.set((ps) => ps.filter((x) => x.id !== p.id))}>Xóa</Button>
              </td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function Orders() {
  const orders = orderStore.use();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className={card}>
          <div className="flex flex-wrap items-center gap-3">
            <button className="font-medium text-primary" onClick={() => setOpen(open === o.id ? null : o.id)}>{o.id}</button>
            <span className="text-sm text-muted-foreground">{formatDate(o.createdAt)} · {o.customer.name}</span>
            <span className="ml-auto font-semibold">{vnd(o.total)}</span>
            <select aria-label="Trạng thái đơn" className={inp} value={o.status} onChange={(e) => orderStore.set((os) => os.map((x) => (x.id === o.id ? { ...x, status: e.target.value as OrderStatus } : x)))}>
              {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          {open === o.id && (
            <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
              {o.items.map((i, k) => <p key={k}>{i.name} × {i.qty} — {vnd(i.price * i.qty)}</p>)}
              <p className="text-muted-foreground">Giao đến: {o.customer.address}, {o.customer.ward}, {o.customer.district}, {o.customer.city} · {o.customer.phone}</p>
              <p className="text-muted-foreground">Thanh toán: {o.payment === "cod" ? "COD" : "Chuyển khoản (minh họa)"} · Ship: {vnd(o.shipping)}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Inventory() {
  const products = useProducts();
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {products.map((p) => (
        <div key={p.id} className={`${card} flex items-center gap-4 ${p.stock <= LOW_STOCK ? "border-primary" : ""}`}>
          <img src={p.image} alt="" width={48} height={48} className="size-12 rounded-lg object-cover" />
          <div className="flex-1"><p className="font-medium">{p.name}</p>{p.stock <= LOW_STOCK && <p className="text-xs text-primary">{p.stock === 0 ? "Hết hàng" : "Tồn kho thấp"}</p>}</div>
          <input type="number" min={0} aria-label={`Tồn kho ${p.name}`} className={`${inp} w-24`} value={p.stock} onChange={(e) => productStore.set((ps) => ps.map((x) => (x.id === p.id ? { ...x, stock: Math.max(0, +e.target.value || 0) } : x)))} />
        </div>
      ))}
    </div>
  );
}

function Collectibles() {
  const products = useProducts();
  const unlocked = passportStore.use();
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="bg-muted text-left"><tr>{["Mã sưu tầm", "Số thứ tự", "Sản phẩm", "Bộ sưu tập", "Trạng thái (demo)"].map((h) => <th key={h} className="p-3 font-medium">{h}</th>)}</tr></thead>
        <tbody>{digitalCollectibles.map((d) => { const p = products.find((x) => x.id === d.productId); return (
          <tr key={d.id} className="border-t border-border"><td className="p-3 font-mono">{d.id}</td><td className="p-3">{d.serial}</td><td className="p-3">{p?.name ?? "—"}</td><td className="p-3">{collections.find((c) => c.id === p?.collectionId)?.name}</td>
            <td className="p-3">{unlocked[d.id] ? <span className="text-success">Đã kích hoạt (mô phỏng)</span> : <span className="text-muted-foreground">Chưa kích hoạt</span>}</td></tr>
        ); })}</tbody>
      </table>
    </div>
  );
}

function Analytics() {
  const { orders, series } = useSeries();
  const products = useProducts();
  const sold: Record<string, number> = {};
  orders.forEach((o) => o.items.forEach((i) => (sold[i.name] = (sold[i.name] ?? 0) + i.qty)));
  const best = Object.entries(sold).map(([name, qty]) => ({ name, qty })).sort((a, b) => b.qty - a.qty).slice(0, 5);
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className={card}><h2 className="mb-3 text-xl">Đơn hàng theo ngày</h2><div className="h-56"><ResponsiveContainer><LineChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="date" fontSize={12} /><YAxis allowDecimals={false} fontSize={12} /><Tooltip /><Line dataKey="orders" stroke="var(--secondary)" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
      <div className={card}><h2 className="mb-3 text-xl">Doanh thu theo ngày</h2><div className="h-56"><ResponsiveContainer><LineChart data={series}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="date" fontSize={12} /><YAxis fontSize={12} tickFormatter={(v) => `${v / 1000}k`} /><Tooltip formatter={(v: number) => vnd(v)} /><Line dataKey="revenue" stroke="var(--primary)" strokeWidth={2} /></LineChart></ResponsiveContainer></div></div>
      <div className={card}><h2 className="mb-3 text-xl">Bán chạy nhất</h2>{best.map((b) => <div key={b.name} className="flex justify-between border-t border-border py-2 text-sm"><span>{b.name}</span><span className="font-medium">{b.qty}</span></div>)}</div>
      <div className={card}><h2 className="mb-3 text-xl">Tồn kho</h2><div className="h-56"><ResponsiveContainer><BarChart data={products.map((p) => ({ name: p.name.split(" –")[0], stock: p.stock }))}><XAxis dataKey="name" fontSize={10} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="stock" fill="var(--gold)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></div>
    </div>
  );
}
