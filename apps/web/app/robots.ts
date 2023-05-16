import { BASE_URL } from "@template/configuration";
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // disallow: "/private/",
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
