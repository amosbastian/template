import { Post } from "@template/contentlayer";
import { Avatar, AvatarFallback, AvatarImage, Badge } from "@template/ui/web";
import { formatDate } from "@template/utility/shared";
import Link from "next/link";

type ArticleCardProps = {
  post: Post;
};

export function ArticleCard({ post }: ArticleCardProps) {
  return (
    <article className="relative isolate flex flex-col gap-8 lg:flex-row">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-square lg:w-64 lg:shrink-0">
        <img
          src={post.image}
          alt=""
          className="bg-background absolute inset-0 h-full w-full rounded-2xl object-cover"
        />
      </div>
      <div>
        <div className="flex items-center gap-x-4 text-xs">
          <time dateTime={post.datePublished} className="text-muted-foreground">
            {formatDate(post.datePublished)}
          </time>
          <Badge variant="secondary">{post.category}</Badge>
        </div>
        <div className="group relative max-w-xl">
          <h3 className="text-foreground group-hover:text-muted-foreground mt-3 text-lg font-semibold leading-6">
            <Link href={post.url}>
              <span className="absolute inset-0" />
              {post.title}
            </Link>
          </h3>
          <p className="text-muted-foreground mt-5 text-sm leading-6">{post.description}</p>
        </div>
        <div className="mt-6 flex border-t border-gray-900/5 pt-6">
          <div className="relative flex items-center gap-x-4">
            <Avatar className="h-5 w-5">
              <AvatarImage className="h-10 w-10" src={post.author.image} alt="" />
              <AvatarFallback>{post.author.name}</AvatarFallback>
            </Avatar>
            <div className="text-sm leading-6">
              <p className="text-foreground font-semibold">
                <span className="absolute inset-0" />
                {post.author.name}
              </p>
              {post.author.role ? <p className="text-muted-foreground">{post.author.role}</p> : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
