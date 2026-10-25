import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { REGIONS, stories } from "@/lib/data";
import { useProducts } from "@/lib/store";
import { ProductCard } from "@/components/site/ProductCard";

export const Route = createFileRoute("/stories/$slug")({
  loader: ({ params }) => {
    const story = stories.find((s) => s.slug === params.slug);
    if (!story) throw notFound();
    return { story };
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.story.title} – Việt Du Ký` : "Câu chuyện – Việt Du Ký";
    const d = loaderData?.story.intro ?? "Câu chuyện văn hóa Việt Du Ký.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "article" }] };
  },
  component: StoryPage,
});

function StoryPage() {
  const { story } = Route.useLoaderData();
  const products = useProducts().filter((p) => story.productIds.includes(p.id));
  return (
    <article className="container-page max-w-4xl py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground"><Link to="/explore">Khám phá Việt Nam</Link> / {REGIONS[story.region]}</nav>
      <h1 className="mt-4 text-4xl md:text-6xl">{story.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{story.intro}</p>
      <img src={story.image} alt={story.title} width={1024} height={1024} className="mt-8 aspect-[16/10] w-full rounded-[2rem] object-cover" />
      <div className="mx-auto mt-10 max-w-2xl space-y-8 text-lg leading-relaxed">
        <section><h2 className="text-2xl">Bối cảnh văn hóa</h2>{story.background.map((b, i) => <p key={i} className="mt-3 text-foreground/85">{b}</p>)}</section>
        <section><h2 className="text-2xl">Vùng miền</h2><p className="mt-3 text-foreground/85">{story.regionalContext}</p></section>
        <section className="rounded-3xl bg-accent/60 p-6"><h2 className="text-2xl">Kết nối với món đồ sưu tầm</h2><p className="mt-3 text-foreground/85">{story.connection}</p></section>
        <p className="text-sm text-muted-foreground">Lưu ý: nội dung mang tính giới thiệu và sáng tạo, không thay thế tài liệu lịch sử chính thống.</p>
      </div>
      <h2 className="mt-14 text-3xl">Sản phẩm liên quan</h2>
      <div className="mt-6 grid grid-cols-2 gap-4 md:gap-6">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </article>
  );
}
