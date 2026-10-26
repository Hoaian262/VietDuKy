import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { orderStore, passportStore, userStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DemoNote } from "@/components/site/ProductCard";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Tài khoản – Việt Du Ký" }, { name: "description", content: "Thông tin tài khoản demo." }, { property: "og:title", content: "Tài khoản – Việt Du Ký" }, { property: "og:description", content: "Tài khoản demo." }] }),
  component: Account,
});

function Account() {
  const user = userStore.use();
  const orders = orderStore.use();
  const passport = passportStore.use();
  const navigate = useNavigate();
  if (!user) return (
    <div className="container-page py-24 text-center"><h1 className="text-3xl">Bạn chưa đăng nhập</h1>
      <div className="mt-6 flex justify-center gap-3"><Button asChild variant="hero"><Link to="/login">Đăng nhập</Link></Button><Button asChild variant="outline"><Link to="/register">Đăng ký</Link></Button></div></div>
  );
  return (
    <div className="container-page max-w-4xl py-12">
      <h1 className="text-4xl">Xin chào, {user.name}</h1>
      <div className="mt-4"><DemoNote>Tài khoản demo, chỉ lưu trên trình duyệt này.</DemoNote></div>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6"><p className="text-sm text-muted-foreground">Hồ sơ</p><p className="mt-2 font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div>
        <Link to="/orders" className="rounded-3xl border border-border bg-card p-6 hover:shadow-soft"><p className="text-sm text-muted-foreground">Đơn hàng</p><p className="mt-2 font-display text-4xl">{orders.length}</p><p className="text-sm text-primary">Xem lịch sử →</p></Link>
        <Link to="/passport/collection" className="rounded-3xl bg-secondary p-6 text-secondary-foreground"><p className="text-sm text-secondary-foreground/70">Hộ chiếu số</p><p className="mt-2 font-display text-4xl text-gold">{Object.keys(passport).length}</p><p className="text-sm">Mở hộ chiếu →</p></Link>
      </div>
      <Button variant="outline" className="mt-8" onClick={() => { userStore.set(null); navigate({ to: "/" }); }}>Đăng xuất</Button>
    </div>
  );
}
