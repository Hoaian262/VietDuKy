import { createFileRoute } from "@tanstack/react-router";
import { AuthForm } from "./login";

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Đăng ký (demo) – Việt Du Ký" }, { name: "description", content: "Tạo tài khoản demo Việt Du Ký." }, { property: "og:title", content: "Đăng ký – Việt Du Ký" }, { property: "og:description", content: "Đăng ký demo." }] }),
  component: () => <AuthForm mode="register" />,
});
