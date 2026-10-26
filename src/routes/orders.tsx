import { createFileRoute, Link } from "@tanstack/react-router";
import { ORDER_STATUS } from "@/lib/data";
import { formatDate, vnd } from "@/lib/format";
import { orderStore } from "@/lib/store";
import { DemoNote, PageTitle } from "@/components/site/ProductCard";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Lịch sử đơn hàng – Việt Du Ký" }, { name: "description", content: "Danh sách đơn hàng demo." }, { property: "og:title", content: "Đơn hàng – Việt Du Ký" }, { property: "og:description", content: "Lịch sử đơn hàng demo." }] }),
  component: Orders,
});

function Orders() {
  const orders = orderStore.use();
  return (
    <>
      <PageTitle title="Lịch sử đơn hàng" />
      <div className="container-page max-w-4xl space-y-4">
        <DemoNote>Bao gồm đơn mẫu và đơn demo bạn tạo trên trình duyệt này.</DemoNote>
        {orders.map((o) => (
          <Link key={o.id} to="/order/$id" params={{ id: o.id }} className="flex flex-wrap items-center gap-4 rounded-3xl border border-border bg-card p-5 hover:shadow-soft">
            <img src={o.items[0]?.image} alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
            <div className="flex-1"><p className="font-medium">{o.id}</p><p className="text-sm text-muted-foreground">{formatDate(o.createdAt)} · {o.items.reduce((s, i) => s + i.qty, 0)} sản phẩm</p></div>
            <span className="rounded-full bg-muted px-3 py-1 text-xs">{ORDER_STATUS[o.status]}</span>
            <span className="font-semibold">{vnd(o.total)}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
