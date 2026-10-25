import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { vnd } from "@/lib/format";
import { placeDemoOrder, userStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DemoNote, PageTitle } from "@/components/site/ProductCard";
import { Row, useCartLines } from "./cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Thanh toán (demo) – Việt Du Ký" }, { name: "description", content: "Thông tin giao hàng và phương thức thanh toán demo." }, { property: "og:title", content: "Thanh toán – Việt Du Ký" }, { property: "og:description", content: "Thanh toán demo Việt Du Ký." }] }),
  component: Checkout,
});

const schema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ và tên."),
  phone: z.string().trim().regex(/^(0|\+84)\d{9}$/, "Số điện thoại chưa đúng định dạng (VD: 0901234567)."),
  email: z.string().trim().email("Email chưa hợp lệ."),
  address: z.string().trim().min(5, "Vui lòng nhập địa chỉ cụ thể."),
  city: z.string().trim().min(2, "Vui lòng nhập tỉnh/thành phố."),
  district: z.string().trim().min(2, "Vui lòng nhập quận/huyện."),
  ward: z.string().trim().min(2, "Vui lòng nhập phường/xã."),
  note: z.string().max(300).optional(),
});
type Form = z.infer<typeof schema>;

function Checkout() {
  const { lines, subtotal, shipping, total } = useCartLines();
  const user = userStore.use();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [payment, setPayment] = useState<"cod" | "bank">("cod");
  const [form, setForm] = useState<Form>({ name: user?.name ?? "", phone: user?.phone ?? "", email: user?.email ?? "", address: "", city: "", district: "", ward: "", note: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});

  if (lines.length === 0) return (
    <div className="container-page py-24 text-center"><h1 className="text-3xl">Chưa có sản phẩm để thanh toán</h1><Button asChild className="mt-6"><Link to="/shop">Về cửa hàng</Link></Button></div>
  );

  const next = () => {
    const r = schema.safeParse(form);
    if (!r.success) {
      const e: typeof errors = {};
      r.error.issues.forEach((i) => { e[i.path[0] as keyof Form] ??= i.message; });
      setErrors(e); return;
    }
    setErrors({}); setStep(2);
  };
  const submit = () => {
    const order = placeDemoOrder({
      customer: form, payment, subtotal, shipping, total,
      items: lines.map((l) => ({ productId: l.productId, name: l.product!.name, price: l.product!.price, qty: l.qty, variant: l.variant, image: l.product!.image })),
    });
    navigate({ to: "/order/$id", params: { id: order.id } });
  };
  const field = (k: keyof Form, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      <input {...props} value={form[k] ?? ""} onChange={(e) => setForm({ ...form, [k]: e.target.value })} aria-invalid={!!errors[k]}
        className={`mt-1 h-11 w-full rounded-xl border bg-card px-4 ${errors[k] ? "border-destructive" : "border-input"}`} />
      {errors[k] && <span className="mt-1 block text-xs text-destructive">{errors[k]}</span>}
    </label>
  );

  return (
    <>
      <PageTitle eyebrow="Thanh toán demo" title="Hoàn tất đơn hàng" />
      <div className="container-page grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <DemoNote>Đây là thanh toán mô phỏng. Không có giao dịch thật nào được thực hiện và hệ thống không thu thập thông tin thẻ hay tài khoản ngân hàng.</DemoNote>
          <ol className="flex gap-3 text-sm">
            {["Thông tin giao hàng", "Thanh toán & xác nhận"].map((t, i) => (
              <li key={t} className={`flex items-center gap-2 ${step === i + 1 ? "font-semibold text-primary" : "text-muted-foreground"}`}>
                <span className={`grid size-6 place-items-center rounded-full text-xs ${step >= i + 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{i + 1}</span>{t}
              </li>
            ))}
          </ol>
          {step === 1 ? (
            <div className="grid gap-4 rounded-3xl border border-border bg-card p-6 md:grid-cols-2">
              <div className="md:col-span-2">{field("name", "Họ và tên *", { autoComplete: "name" })}</div>
              {field("phone", "Số điện thoại *", { inputMode: "tel", autoComplete: "tel" })}
              {field("email", "Email *", { type: "email", autoComplete: "email" })}
              <div className="md:col-span-2">{field("address", "Địa chỉ (số nhà, đường) *", { autoComplete: "street-address" })}</div>
              {field("city", "Tỉnh/Thành phố *")}
              {field("district", "Quận/Huyện *")}
              {field("ward", "Phường/Xã *")}
              {field("note", "Ghi chú giao hàng")}
              <Button size="lg" variant="hero" className="md:col-span-2" onClick={next}>Tiếp tục</Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-3xl border border-border bg-card p-6">
              <h2 className="text-2xl">Phương thức thanh toán</h2>
              {([["cod", "Thanh toán khi nhận hàng (COD)"], ["bank", "Chuyển khoản ngân hàng (minh họa)"]] as const).map(([k, t]) => (
                <label key={k} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 ${payment === k ? "border-primary bg-primary/5" : "border-input"}`}>
                  <input type="radio" name="pay" checked={payment === k} onChange={() => setPayment(k)} />{t}
                </label>
              ))}
              {payment === "bank" && (
                <div className="rounded-2xl bg-muted p-4 text-sm">
                  <p className="font-medium">Hướng dẫn chuyển khoản (DỮ LIỆU MẪU)</p>
                  <p className="mt-1 text-muted-foreground">Ngân hàng: Ngân hàng Mẫu · Số TK: 0000 0000 0000 · Chủ TK: VIET DU KY DEMO · Nội dung: mã đơn hàng. Thông tin này không có thật — vui lòng không chuyển tiền.</p>
                </div>
              )}
              <div className="rounded-2xl bg-muted/60 p-4 text-sm">
                <p className="font-medium">Giao đến: {form.name} · {form.phone}</p>
                <p className="text-muted-foreground">{form.address}, {form.ward}, {form.district}, {form.city}</p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" size="lg" onClick={() => setStep(1)}>Quay lại</Button>
                <Button variant="hero" size="lg" className="flex-1" onClick={submit}>Đặt hàng (demo)</Button>
              </div>
            </div>
          )}
        </div>
        <aside className="h-fit space-y-3 rounded-3xl border border-border bg-card p-6">
          <h2 className="text-2xl">Đơn hàng</h2>
          {lines.map((l) => (
            <div key={l.index} className="flex items-center gap-3 text-sm">
              <img src={l.product!.image} alt="" width={48} height={48} className="size-12 rounded-xl object-cover" />
              <span className="flex-1">{l.product!.name} × {l.qty}</span><span>{vnd(l.product!.price * l.qty)}</span>
            </div>
          ))}
          <div className="space-y-2 border-t border-border pt-3">
            <Row k="Tạm tính" v={vnd(subtotal)} />
            <Row k="Phí vận chuyển" v={shipping ? vnd(shipping) : "Miễn phí"} />
            <Row k="Tổng thanh toán" v={vnd(total)} bold />
          </div>
        </aside>
      </div>
    </>
  );
}
