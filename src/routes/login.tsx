import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { userStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { DemoNote } from "@/components/site/ProductCard";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Đăng nhập (demo) – Việt Du Ký" }, { name: "description", content: "Đăng nhập tài khoản demo Việt Du Ký." }, { property: "og:title", content: "Đăng nhập – Việt Du Ký" }, { property: "og:description", content: "Đăng nhập demo." }] }),
  component: () => <AuthForm mode="login" />,
});

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const navigate = useNavigate();
  const [f, setF] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState<Record<string, string>>({});
  const schema = z.object({
    name: mode === "register" ? z.string().trim().min(2, "Vui lòng nhập họ tên.") : z.string().optional(),
    email: z.string().trim().email("Email chưa hợp lệ."),
    password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự."),
  });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse(f);
    if (!r.success) { const o: Record<string, string> = {}; r.error.issues.forEach((i) => (o[String(i.path[0])] ??= i.message)); return setErr(o); }
    // Demo only: password is never stored.
    userStore.set({ name: f.name || f.email.split("@")[0], email: f.email });
    navigate({ to: "/account" });
  };
  const input = (k: keyof typeof f, label: string, type = "text") => (
    <label className="block text-sm"><span className="font-medium">{label}</span>
      <input type={type} value={f[k] ?? ""} onChange={(e) => setF({ ...f, [k]: e.target.value })} aria-invalid={!!err[k]} className={`mt-1 h-11 w-full rounded-xl border bg-card px-4 ${err[k] ? "border-destructive" : "border-input"}`} />
      {err[k] && <span className="mt-1 block text-xs text-destructive">{err[k]}</span>}
    </label>
  );
  return (
    <div className="container-page max-w-md py-16">
      <h1 className="text-4xl">{mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}</h1>
      <div className="mt-4"><DemoNote>Đăng nhập demo: chỉ lưu tên và email trên trình duyệt, không lưu mật khẩu, không có tài khoản thật trên máy chủ.</DemoNote></div>
      <form onSubmit={submit} noValidate className="mt-6 space-y-4">
        {mode === "register" && input("name", "Họ và tên")}
        {input("email", "Email", "email")}
        {input("password", "Mật khẩu", "password")}
        <Button type="submit" variant="hero" size="lg" className="w-full">{mode === "login" ? "Đăng nhập" : "Đăng ký"}</Button>
      </form>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {mode === "login" ? <>Chưa có tài khoản? <Link to="/register" className="text-primary">Đăng ký</Link></> : <>Đã có tài khoản? <Link to="/login" className="text-primary">Đăng nhập</Link></>}
      </p>
    </div>
  );
}
