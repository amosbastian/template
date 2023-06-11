import { defineDocumentType, defineNestedType, makeSource } from "contentlayer/source-files";
import { join } from "path";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { BASE_URL } from "./libs/configuration/src";

const SEO = defineNestedType(() => ({
  name: "SEO",
  fields: {
    title: {
      type: "string",
    },
    description: {
      type: "string",
    },
  },
}));

const Author = defineNestedType(() => ({
  name: "Author",
  fields: {
    name: {
      type: "string",
      required: true,
    },
    image: {
      type: "string",
      required: true,
    },
    role: {
      type: "string",
    },
  },
}));

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
    ogDescription: {
      type: "string",
      description: "Descriptiption used in OG metadata",
      required: false,
    },
    published: {
      type: "boolean",
      default: true,
    },
    image: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
      description: "The description of the post",
      required: true,
    },
    datePublished: {
      type: "date",
      description: "The date the post was published",
      required: true,
    },
    dateModified: {
      type: "date",
      description: "The date the post was last modified",
      required: false,
    },
    seo: {
      type: "nested",
      of: SEO,
      required: false,
    },
    author: {
      type: "nested",
      of: Author,
      required: true,
    },
    category: {
      type: "enum",
      options: ["Article", "Case study", "Video", "Comparison"],
      required: false,
      default: "Article",
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (post) => `/blog/${post._raw.flattenedPath}`,
    },
    readingTime: {
      type: "json",
      resolve: (post) => readingTime(post.body.raw),
    },
    slug: {
      type: "string",
      resolve: (post) => post._raw.sourceFileName.replace(".mdx", ""),
    },
    jsonLd: {
      type: "json",
      resolve: (document) => ({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: document.title,
        datePublished: document.datePublished,
        dateModified: document.dateModified,
        description: document.description,
        image: document.image ? `${BASE_URL}${document.image}` : `${BASE_URL}/api/og?title=${document.title}`,
        url: `${BASE_URL}/blog/${document._raw.flattenedPath}`,
        author: {
          "@type": "Person",
          name: document.author.name,
          image: document.author.image,
        },
      }),
    },
  },
}));

export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: `**/*.mdx`,
  contentType: "mdx",
  fields: {
    title: {
      type: "string",
      description: "The title of the post",
      required: true,
    },
  },
  computedFields: {
    url: {
      type: "string",
      resolve: (page) => `/${page._raw.flattenedPath}`,
    },
  },
}));

export default makeSource({
  contentDirPath: join(process.cwd(), "./apps/web/posts"),
  documentTypes: [Page, Post],
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["anchor"],
            ariaLabel: "Link to section",
          },
        },
      ],
    ],
  },
});
