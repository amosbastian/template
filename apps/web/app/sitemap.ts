import { BASE_URL } from "@template/configuration";

export default async function sitemap() {
  const routes = ["", "/about", "/blog"].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
  }));

  return [...routes];
}
