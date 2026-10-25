import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, Fingerprint, Map, Nfc, ShieldCheck, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoNote } from "@/components/site/ProductCard";

export const Route = createFileRoute("/passport/")({
  head: () => ({ meta: [{ title: "Hộ chiếu số Việt Nam – Việt Du Ký" }, { name: "description", content: "Nơi lưu giữ hành trình sưu tầm và những câu chuyện văn hóa phía sau mỗi món đồ Việt Du Ký." }, { property: "og:title", content: "Hộ chiếu số Việt Nam" }, { property: "og:description", content: "Chạm NFC, mở khóa bản sưu tầm số và câu chuyện văn hóa." }] }),
  component: Passport,
});

function Passport() {
  return (
    <>
      <section className="bg-secondary text-secondary-foreground">
        <div className="container-page grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="eyebrow text-gold">Digital Vietnam Passport</p>
            <h1 className="mt-3 text-5xl md:text-6xl">Hộ chiếu số Việt Nam</h1>
            <p className="mt-5 max-w-lg text-lg text-secondary-foreground/80">Nơi lưu giữ hành trình sưu tầm và những câu chuyện văn hóa phía sau mỗi món đồ.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="lg"><Link to="/passport/collection">Mở hộ chiếu của tôi</Link></Button>
              <Button asChild variant="ivoryOutline" size="lg"><Link to="/passport/verify">Mô phỏng chạm NFC</Link></Button>
            </div>
          </div>
          <div className="mx-auto w-full max-w-sm rotate-2 rounded-[2rem] border-4 border-gold/60 bg-ink p-8 text-ink-foreground shadow-soft">
            <p className="eyebrow text-gold">Cộng hòa sưu tầm · Việt Du Ký</p>
            <p className="mt-6 font-display text-3xl">Hộ chiếu số</p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {["Bắc", "Trung", "Nam"].map((r) => <div key={r} className="grid aspect-square place-items-center rounded-full border-2 border-dashed border-gold/70 text-sm text-gold">{r}</div>)}
            </div>
            <p className="mt-6 font-mono text-xs text-ink-foreground/50">VDK&lt;&lt;COLLECTOR&lt;&lt;DEMO&lt;&lt;&lt;&lt;</p>
          </div>
        </div>
      </section>
      <section className="container-page py-20">
        <p className="eyebrow">NFC là gì?</p>
        <h2 className="mt-2 max-w-2xl text-3xl md:text-4xl">Mỗi món đồ có một thẻ NFC nhỏ gắn dưới đế</h2>
        <p className="mt-3 max-w-2xl text-muted-foreground">NFC (giao tiếp tầm gần) cho phép điện thoại đọc thông tin khi chạm gần. Thẻ chứa mã sưu tầm duy nhất, dùng để liên kết món đồ vật lý với bản sưu tầm số.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            { i: Smartphone, t: "1. Bật NFC", d: "Bật NFC trên điện thoại hỗ trợ (phần lớn Android và iPhone XS trở lên)." },
            { i: Nfc, t: "2. Chạm vào đế", d: "Đặt mặt sau điện thoại gần đế sản phẩm trong 1–2 giây." },
            { i: ShieldCheck, t: "3. Xác thực", d: "Hệ thống kiểm tra mã sưu tầm và mở khóa câu chuyện trong hộ chiếu." },
          ].map((s) => <div key={s.t} className="rounded-3xl border border-border bg-card p-6"><s.i className="size-7 text-primary" /><h3 className="mt-4 text-xl">{s.t}</h3><p className="mt-2 text-sm text-muted-foreground">{s.d}</p></div>)}
        </div>
        <h2 className="mt-20 text-3xl md:text-4xl">Lợi ích khi sở hữu bộ sưu tập số</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { i: Fingerprint, t: "Danh tính riêng", d: "Mỗi món đồ có mã sưu tầm và số thứ tự riêng." },
            { i: BookOpen, t: "Câu chuyện văn hóa", d: "Đọc câu chuyện, bối cảnh vùng miền gắn với món đồ." },
            { i: Map, t: "Bản đồ hành trình", d: "Theo dõi tiến độ hoàn thành bộ sưu tập ba miền." },
          ].map((s) => <div key={s.t} className="rounded-3xl bg-accent/60 p-6"><s.i className="size-7 text-secondary" /><h3 className="mt-4 text-xl">{s.t}</h3><p className="mt-2 text-sm text-muted-foreground">{s.d}</p></div>)}
        </div>
        <div className="mt-10"><DemoNote>Bản prototype dùng mô phỏng xác thực trên trình duyệt. Việc xác thực thật cần đầu đọc NFC và kiểm tra phía máy chủ, sẽ được bổ sung ở giai đoạn sau.</DemoNote></div>
      </section>
    </>
  );
}
