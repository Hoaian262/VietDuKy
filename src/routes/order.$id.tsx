import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { ORDER_STATUS } from "@/lib/data";
import { formatDate, vnd } from "@/lib/format";
import { orderStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DemoNote } from "@/components/site/ProductCard";
import { Row } from "./cart";

export const Route = createFileRoute("/order/$id")({
  head: () => ({ meta: [{ title: "Xác nhận đơn hàng – Việt Du Ký" }, { name: "description", content: "Chi tiết đơn hàng demo." }, { property: "og:title", content: "Xác nhận đơn hàng – Việt Du Ký" }, { property: "og:description", content: "Đơn hàng demo Việt Du Ký." }, { name: "robots", content: "noindex" }] }),
  component: OrderPage,
});

function OrderPage() {
  const { id } = Route.useParams();
  const order = orderStore.use().find((o) => o.id === id);
  if (!order) return <div className="container-page py-24 text-center"><h1 className="text-3xl">Không tìm thấy đơn hàng</h1><Button asChild className="mt-6"><Link to="/orders">Xem đơn hàng</Link></Button></div>;
  return (
    <div className="container-page max-w-3xl py-14">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-success" />
        <h1 className="mt-4 text-4xl">Cảm ơn bạn đã đặt hàng!</h1>
        <p className="mt-2 text-muted-foreground">Mã đơn hàng demo: <strong className="text-foreground">{order.id}</strong> · {formatDate(order.createdAt)}</p>
      </div>
      <div className="mt-6"><DemoNote>Đây là đơn hàng mô phỏng, chỉ lưu trên trình duyệt của bạn. Không có thanh toán thật và không có email xác nhận nào được gửi.</DemoNote></div>
      <div className="mt-6 space-y-3 rounded-3xl border border-border bg-card p-6">
        {order.items.map((i, k) => (
          <div key={k} className="flex items-center gap-3 text-sm">
            <img src={i.image} alt="" width={56} height={56} className="size-14 rounded-xl object-cover" />
            <span className="flex-1">{i.name}{i.variant ? ` (${i.variant})` : ""} × {i.qty}</span><span>{vnd(i.price * i.qty)}</span>
          </div>
        ))}
        <div className="space-y-2 border-t border-border pt-3">
          <Row k="Tạm tính" v={vnd(order.subtotal)} />
          <Row k="Phí vận chuyển" v={order.shipping ? vnd(order.shipping) : "Miễn phí"} />
          <Row k="Tổng" v={vnd(order.total)} bold />
          <Row k="Thanh toán" v={order.payment === "cod" ? "COD" : "Chuyển khoản (minh họa)"} />
          <Row k="Trạng thái" v={ORDER_STATUS[order.status]} />
        </div>
        <p className="border-t border-border pt-3 text-sm text-muted-foreground">Giao đến: {order.customer.name}, {order.customer.address}, {order.customer.ward}, {order.customer.district}, {order.customer.city}</p>
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="hero" size="lg"><Link to="/passport/verify">Mở khóa Hộ chiếu số</Link></Button>
        <Button asChild variant="outline" size="lg"><Link to="/shop">Tiếp tục mua sắm</Link></Button>
      </div>
    </div>
  );
}
