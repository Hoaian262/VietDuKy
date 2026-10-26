import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "Về Việt Du Ký – Câu chuyện thương hiệu" }, { name: "description", content: "Sứ mệnh của Việt Du Ký: kể chuyện văn hóa Việt qua art toy và trải nghiệm phygital." }, { property: "og:title", content: "Về Việt Du Ký" }, { property: "og:description", content: "Câu chuyện và sứ mệnh thương hiệu Việt Du Ký." }] }),
  component: About,
});

function About() {
  return (
    <div className="container-page py-14">
      <p className="eyebrow">Về chúng tôi</p>
      <h1 className="mt-3 max-w-3xl text-5xl md:text-6xl">Kể chuyện Việt Nam bằng những món đồ nhỏ</h1>
      <img src={hero} alt="Art toy Việt Du Ký" width={1100} height={1008} className="mt-10 aspect-[16/8] w-full rounded-[2rem] object-cover" />
      <div className="mt-14 grid gap-10 md:grid-cols-3">
        {[
          ["Câu chuyện", "Việt Du Ký ra đời từ mong muốn mang những vùng đất, công trình và nếp sống Việt đến gần người trẻ hơn — qua ngôn ngữ của art toy."],
          ["Sứ mệnh", "Mỗi thiết kế là một lời mời khám phá: người sưu tầm không chỉ sở hữu món đồ, mà còn hiểu câu chuyện phía sau nó."],
          ["Phygital", "Thẻ NFC kết nối món đồ vật lý với Hộ chiếu số, nơi lưu giữ hành trình và nội dung văn hóa của từng bộ sưu tập."],
        ].map(([t, d]) => <div key={t}><h2 className="text-2xl">{t}</h2><p className="mt-3 text-foreground/80">{d}</p></div>)}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">Mô hình kinh doanh D2C: website là kênh bán hàng chính, mạng xã hội giúp xây dựng cộng đồng sưu tầm. (Dự án prototype học thuật.)</p>
      <Button asChild variant="hero" size="lg" className="mt-8"><Link to="/shop">Khám phá bộ sưu tập</Link></Button>
    </div>
  );
}
