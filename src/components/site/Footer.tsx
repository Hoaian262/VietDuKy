import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo light />
          <p className="mt-4 max-w-sm text-sm text-ink-foreground/70">Art toy & blind box lấy cảm hứng từ văn hóa Việt Nam. Mỗi món đồ là một câu chuyện, kết nối với Hộ chiếu số qua NFC.</p>
          <p className="mt-4 text-xs text-ink-foreground/50">Đây là website mẫu (prototype) phục vụ dự án học thuật. Sản phẩm, giá và đơn hàng là dữ liệu minh họa.</p>
        </div>
        <div>
          <h3 className="mb-3 font-sans text-sm font-semibold text-gold">Mua sắm</h3>
          <ul className="space-y-2 text-sm text-ink-foreground/75">
            <li><Link to="/shop">Cửa hàng</Link></li>
            <li><Link to="/cart">Giỏ hàng</Link></li>
            <li><Link to="/orders">Đơn hàng</Link></li>
            <li><Link to="/passport">Hộ chiếu số</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-3 font-sans text-sm font-semibold text-gold">Việt Du Ký</h3>
          <ul className="space-y-2 text-sm text-ink-foreground/75">
            <li><Link to="/about">Về chúng tôi</Link></li>
            <li><Link to="/explore">Khám phá Việt Nam</Link></li>
            <li><Link to="/contact">Liên hệ & FAQ</Link></li>
            <li><Link to="/admin">Quản trị (demo)</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 py-5 text-center text-xs text-ink-foreground/50">© 2026 Việt Du Ký · Prototype</div>
    </footer>
  );
}
