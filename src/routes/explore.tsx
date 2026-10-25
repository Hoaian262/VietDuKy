import { createFileRoute } from "@tanstack/react-router";
import { REGIONS, stories, type Region } from "@/lib/data";
import { PageTitle } from "@/components/site/ProductCard";
import { StoryCard } from "@/components/site/StoryCard";

export const Route = createFileRoute("/explore")({
  head: () => ({ meta: [{ title: "Khám phá Việt Nam – Việt Du Ký" }, { name: "description", content: "Những câu chuyện về di sản, kiến trúc và đời sống ba miền phía sau mỗi món đồ." }, { property: "og:title", content: "Khám phá Việt Nam – Việt Du Ký" }, { property: "og:description", content: "Câu chuyện văn hóa ba miền." }] }),
  component: Explore,
});

function Explore() {
  return (
    <>
      <PageTitle eyebrow="Khám phá Việt Nam" title="Mỗi món đồ, một câu chuyện" desc="Nội dung mang tính giới thiệu, do đội ngũ Việt Du Ký biên soạn theo cách diễn giải sáng tạo." />
      <div className="container-page space-y-16">
        {(Object.keys(REGIONS) as Region[]).map((r) => (
          <section key={r}>
            <h2 className="border-b border-border pb-3 text-3xl">{REGIONS[r]}</h2>
            <div className="mt-6 grid gap-6 md:grid-cols-3">{stories.filter((s) => s.region === r).map((s) => <StoryCard key={s.slug} story={s} />)}</div>
          </section>
        ))}
      </div>
    </>
  );
}
