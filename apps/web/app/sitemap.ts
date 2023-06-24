import { BASE_URL } from "@template/configuration";
import { allPosts } from "@template/contentlayer";

export default async function sitemap() {
  const blogPosts = allPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.dateModified ?? post.datePublished,
  }));

  const routes = ["", "/about", "/blog"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
  }));

  return [...routes, ...blogPosts];
}
