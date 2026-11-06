import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Nfc, ShoppingBag, BookOpen } from "lucide-react";
import { z } from "zod";
import hero from "@/assets/hero.jpg";
import { collections, stories, REGIONS } from "@/lib/data";
import { newsletterStore, useProducts } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { StoryCard } from "@/components/site/StoryCard";
import { DemoNote, ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Việt Du Ký – Chạm vào Việt Nam, sưu tầm những câu chuyện" },
      { name: "description", content: "Art toy và blind box lấy cảm hứng từ di sản, kiến trúc và câu chuyện ba miền Việt Nam, kèm Hộ chiếu số NFC." },
      { property: "og:title", content: "Việt Du Ký – Chạm vào Việt Nam" },
      { property: "og:description", content: "Sưu tầm art toy văn hóa Việt và mở khóa Hộ chiếu số Việt Nam." },
    ],
  }),
  component: Home,
});

function Home() {
  const products = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 6);
  return (
    <>
      <section className="relative overflow-hidden bg-ink text-ink-foreground">
        <div className="container-page grid items-center gap-10 py-14 md:grid-cols-2 md:py-20">
          <div className="fade-up">
            <p className="eyebrow text-gold">Art toy · Blind box · Phygital</p>
            <h1 className="mt-4 text-5xl leading-[1.05] md:text-6xl lg:text-7xl">Gom hồn Việt<br /><em className="text-gold">vào từng món nhỏ</em> lưu dấu nghìn câu chuyện.</h1>
            <p className="mt-6 max-w-md text-lg text-ink-foreground/75">Mỗi món đồ sưu tầm là một hành trình khám phá những vùng đất, di sản và câu chuyện Việt Nam.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="lg"><Link to="/shop">Khám phá bộ sưu tập <ArrowRight /></Link></Button>
              <Button asChild variant="ivoryOutline" size="lg"><Link to="/passport">Khám phá Hộ chiếu số</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-[2.5rem] bg-motif opacity-40" aria-hidden />
            <img src={hero} alt="Hai nhân vật art toy mặc áo dài, đội nón lá và cầm đèn lồng trên nền ruộng bậc thang" width={1100} height={1008}
              className="relative aspect-[11/10] w-full rounded-[2rem] object-cover" />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="flex items-end justify-between gap-4">
          <div><p className="eyebrow">Bộ sưu tập</p><h2 className="mt-2 text-3xl md:text-4xl">Hành trình ba miền</h2></div>
          <Link to="/shop" className="hidden text-sm font-medium text-primary md:block">Xem tất cả →</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {collections.map((c) => (
            <Link key={c.id} to="/shop" search={{ region: c.region }} className="group relative overflow-hidden rounded-3xl">
              <img src={c.image} alt={c.name} loading="lazy" width={1024} height={1024} className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-background/90 p-5 backdrop-blur">
                <p className="eyebrow">{REGIONS[c.region]}</p>
                <h3 className="mt-1 text-2xl">{c.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{c.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page pb-20">
        <p className="eyebrow">Nổi bật</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Món đồ được yêu thích</h2>
        <div className="mt-3"><DemoNote>Sản phẩm và giá dưới đây là dữ liệu minh họa cho bản prototype, không phải hàng tồn kho thật.</DemoNote></div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-3">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      <section className="bg-secondary py-20 text-secondary-foreground">
        <div className="container-page">
          <p className="eyebrow text-gold">Trải nghiệm Phygital</p>
          <h2 className="mt-2 max-w-2xl text-3xl md:text-4xl">Từ món đồ trên kệ đến hành trình trong Hộ chiếu số</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: ShoppingBag, t: "Sưu tầm", d: "Chọn và sở hữu một món đồ Việt Du Ký có gắn thẻ NFC." },
              { icon: Nfc, t: "Chạm NFC", d: "Chạm điện thoại hỗ trợ NFC vào đế sản phẩm." },
              { icon: BookOpen, t: "Mở khóa hộ chiếu số", d: "Xác thực món đồ, khám phá danh tính số và câu chuyện văn hóa." },
            ].map((s, i) => (
              <div key={s.t} className="rounded-3xl border border-secondary-foreground/15 p-7">
                <div className="flex items-center justify-between"><s.icon className="size-7 text-gold" /><span className="font-display text-5xl text-secondary-foreground/20">0{i + 1}</span></div>
                <h3 className="mt-6 text-2xl">{s.t}</h3>
                <p className="mt-2 text-secondary-foreground/75">{s.d}</p>
              </div>
            ))}
          </div>
          <Button asChild variant="gold" size="lg" className="mt-10"><Link to="/passport">Khám phá Hộ chiếu số</Link></Button>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="eyebrow">Câu chuyện</p>
        <h2 className="mt-2 text-3xl md:text-4xl">Mỗi món đồ, một câu chuyện Việt Nam</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {stories.slice(0, 3).map((s) => <StoryCard key={s.slug} story={s} />)}
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!z.string().email().safeParse(email).success) return setError("Vui lòng nhập email hợp lệ.");
    if (!consent) return setError("Vui lòng đồng ý nhận thông tin để tiếp tục.");
    newsletterStore.set((l) => (l.includes(email) ? l : [...l, email]));
    setError(""); setDone(true);
  };
  return (
    <section className="container-page">
      <div className="relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-primary-foreground md:px-14">
        <div className="absolute inset-0 bg-motif opacity-30" aria-hidden />
        <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="eyebrow text-gold">Cộng đồng sưu tầm</p>
            <h2 className="mt-2 text-3xl md:text-4xl">Cùng nhau lưu giữ những mảnh ghép Việt Nam.</h2>
          </div>
          {done ? (
            <p role="status" className="rounded-2xl bg-primary-foreground/15 p-5">Cảm ơn bạn! Đăng ký đã được ghi nhận trong bản demo (lưu trên trình duyệt). Chưa có email nào được gửi đi.</p>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-3">
              <div className="flex gap-2">
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email của bạn" aria-label="Email"
                  className="h-12 flex-1 rounded-full bg-background px-5 text-foreground" />
                <Button variant="ink" size="lg" type="submit">Đăng ký</Button>
              </div>
              <label className="flex items-start gap-2 text-sm text-primary-foreground/85">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1" />
                Tôi đồng ý nhận thông tin về bộ sưu tập mới. Có thể hủy bất cứ lúc nào.
              </label>
              {error && <p role="alert" className="text-sm font-medium text-gold">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
