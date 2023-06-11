import { allPosts } from "@template/contentlayer";
import { Mdx } from "@template/ui/blog/server";
import { Avatar, AvatarFallback, AvatarImage, buttonVariants } from "@template/ui/web";
import { classnames, formatDate } from "@template/utility/shared";
import { ChevronLeftIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../../../mdx.css";

interface PostPageProps {
  params: {
    slug: string;
  };
}

async function getPostFromParams(slug: string) {
  const post = allPosts.find((post) => post.slug === slug);

  if (!post) {
    return null;
  }

  return post;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params.slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.ogDescription,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.title,
      description: post.ogDescription,
      type: "article",
      url: post.url,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.ogDescription,
    },
  };
}

export async function generateStaticParams(): Promise<PostPageProps["params"][]> {
  return allPosts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="container relative max-w-3xl py-6 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(post.jsonLd) }} />
      <Link
        href="/blog"
        className={classnames(
          buttonVariants({ variant: "ghost" }),
          "absolute left-[-200px] top-9 hidden xl:inline-flex",
        )}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        See all posts
      </Link>
      <div>
        {post.datePublished ? (
          <span className="flex flex-row gap-2">
            <time dateTime={post.datePublished} className="text-muted-foreground block text-sm">
              Published on {formatDate(post.datePublished)}
            </time>
            {post.dateModified ? (
              <time dateTime={post.dateModified} className="text-muted-foreground block text-sm">
                Updated on {formatDate(post.dateModified)}
              </time>
            ) : null}
          </span>
        ) : null}
        <h1 className="mt-2 inline-block text-4xl font-bold leading-tight lg:text-5xl">{post.title}</h1>
        <div className="mt-4 flex items-center space-x-2 text-sm">
          <Avatar className="h-5 w-5">
            <AvatarImage className="h-10 w-10" src={post.author.image} alt="" />
            <AvatarFallback>{post.author.name}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left leading-tight">
            {post.author.role ? <p className="font-medium">{post.author.role}</p> : null}
            <p className="text-muted-foreground text-[12px]">@{post.author.name}</p>
          </div>
        </div>
      </div>
      {post.image && (
        <Image
          src={post.image}
          alt={post.title}
          width={720}
          height={405}
          className="bg-muted my-8 rounded-md transition-colors"
          priority
        />
      )}
      <Mdx code={post.body.code} />
      <hr className="mt-12" />
      <div className="flex justify-center py-6 lg:py-10">
        <Link href="/blog" className={classnames(buttonVariants({ variant: "ghost" }))}>
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          See all posts
        </Link>
      </div>
    </article>
  );
}

// https://github.com/vercel/next.js/issues/50634
export const dynamic = "force-static";
