import { Link } from "@tanstack/react-router";
import { REGIONS, type Story } from "@/lib/data";

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="group">
      <Link to="/stories/$slug" params={{ slug: story.slug }} className="block overflow-hidden rounded-3xl">
        <img src={story.image} alt={story.title} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </Link>
      <p className="mt-4 text-xs text-muted-foreground">{REGIONS[story.region]}</p>
      <h3 className="mt-1 text-xl">{story.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{story.intro}</p>
      <Link to="/stories/$slug" params={{ slug: story.slug }} className="mt-3 inline-block text-sm font-medium text-primary">Đọc câu chuyện →</Link>
    </article>
  );
}
