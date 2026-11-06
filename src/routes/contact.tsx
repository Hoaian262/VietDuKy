import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { DemoNote, PageTitle } from "@/components/site/ProductCard";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Liên hệ & Câu hỏi thường gặp – Việt Du Ký" }, { name: "description", content: "Liên hệ hỗ trợ và giải đáp về đặt hàng, giao hàng, đổi trả, blind box, NFC và Hộ chiếu số." }, { property: "og:title", content: "Liên hệ – Việt Du Ký" }, { property: "og:description", content: "Hỗ trợ khách hàng và FAQ." }] }),
  component: Contact,
});

const FAQ = [
  ["Đặt hàng như thế nào?", "Chọn sản phẩm, thêm vào giỏ và hoàn tất thông tin giao hàng ở bước thanh toán. Bản prototype chỉ tạo đơn mô phỏng."],
  ["Thời gian giao hàng?", "Dự kiến 2–5 ngày làm việc tùy khu vực (thông tin minh họa)."],
  ["Chính sách đổi trả?", "Hỗ trợ đổi trong 7 ngày nếu sản phẩm lỗi do sản xuất, còn nguyên hộp (chính sách mẫu)."],
  ["Blind box là gì?", "Hộp bí ẩn chứa ngẫu nhiên một nhân vật trong dòng sưu tầm. Bạn chỉ biết nhân vật khi mở hộp."],
  ["Điện thoại nào hỗ trợ NFC?", "Phần lớn điện thoại Android hiện nay và iPhone XS trở lên. Hãy bật NFC trong phần cài đặt."],
  ["Hộ chiếu số là gì?", "Nơi lưu các bản sưu tầm số đã mở khóa và câu chuyện văn hóa. Bản demo lưu dữ liệu trên trình duyệt."],
];

function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = z.object({ name: z.string().trim().min(2, "Vui lòng nhập họ tên."), email: z.string().email("Email chưa hợp lệ."), message: z.string().trim().min(10, "Nội dung cần ít nhất 10 ký tự.") }).safeParse(f);
    if (!r.success) return setErr(r.error.issues[0]?.message ?? "Dữ liệu chưa hợp lệ.");
    setErr(""); setSent(true);
  };
  return (
    <>
      <PageTitle eyebrow="Hỗ trợ" title="Liên hệ với Việt Du Ký" />
      <div className="container-page grid gap-10 lg:grid-cols-2">
        <div>
          {sent ? <p role="status" className="rounded-3xl bg-accent p-6">Đã ghi nhận tin nhắn trong bản demo. Chưa có tin nhắn nào thực sự được gửi đi.</p> : (
            <form onSubmit={submit} noValidate className="space-y-4 rounded-3xl border border-border bg-card p-6">
              {(["name", "email"] as const).map((k) => (
                <label key={k} className="block text-sm"><span className="font-medium">{k === "name" ? "Họ và tên" : "Email"}</span>
                  <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} className="mt-1 h-11 w-full rounded-xl border border-input bg-background px-4" /></label>
              ))}
              <label className="block text-sm"><span className="font-medium">Nội dung</span>
                <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} rows={5} className="mt-1 w-full rounded-xl border border-input bg-background p-4" /></label>
              {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
              <Button type="submit" variant="hero" size="lg">Gửi tin nhắn</Button>
            </form>
          )}
          <div className="mt-6"><DemoNote>Thông tin liên hệ mẫu: hotro@vietduky.example · Giờ hỗ trợ 9:00–18:00 (thông tin minh họa, không phải liên hệ thật).</DemoNote></div>
        </div>
        <div>
          <h2 className="text-3xl">Câu hỏi thường gặp</h2>
          <Accordion type="single" collapsible className="mt-4">
            {FAQ.map(([q, a]) => <AccordionItem key={q} value={q!}><AccordionTrigger className="text-left">{q}</AccordionTrigger><AccordionContent>{a}</AccordionContent></AccordionItem>)}
          </Accordion>
        </div>
      </div>
    </>
  );
}
