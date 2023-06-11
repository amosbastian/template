import { BRAND_NAME } from "@template/configuration";
import { allPosts } from "@template/contentlayer";
import { ArticleCard } from "@template/ui/blog/server";
import { compareDesc } from "date-fns";

export const metadata = {
  title: "Blog",
  description: `Read all about ${BRAND_NAME}`,
};

export default async function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => {
      return compareDesc(new Date(a.datePublished), new Date(b.datePublished));
    });

  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-4xl">
          <h2 className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">From the blog</h2>
          <p className="text-muted-foreground mt-2 text-lg leading-8">
            Learn how to grow your business with our expert advice.
          </p>
          <div className="mt-16 space-y-20 lg:mt-20 lg:space-y-20">
            {posts.map((post) => (
              <ArticleCard key={post._id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// https://github.com/vercel/next.js/issues/50634
export const dynamic = "force-static";
