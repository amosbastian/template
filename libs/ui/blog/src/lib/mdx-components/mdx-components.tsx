import * as React from "react";
import NextImage, { StaticImageData } from "next/image";
import { useMDXComponent } from "next-contentlayer/hooks";
import { classnames } from "@template/utility/shared";

interface ImageProps {
  src: StaticImageData | string;
  alt: string;
  width: number;
  height: number;
}

const Image = (props: ImageProps) => {
  return (
    <NextImage
      className="bg-muted my-8 w-full rounded-md object-contain transition-colors"
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
      style={{ height: props.height }}
    />
  );
};

const components = {
  h1: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className={classnames("mt-2 scroll-m-20 text-4xl font-bold tracking-tight", className)} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={classnames(
        "mt-10 scroll-m-20 border-b pb-1 text-3xl font-semibold tracking-tight first:mt-0",
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className={classnames("mt-8 scroll-m-20 text-2xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className={classnames("mt-8 scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5 className={classnames("mt-8 scroll-m-20 text-lg font-semibold tracking-tight", className)} {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6 className={classnames("mt-8 scroll-m-20 text-base font-semibold tracking-tight", className)} {...props}>
      {children}
    </h6>
  ),
  a: ({ children, className, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className={classnames("font-medium underline underline-offset-4", className)} {...props}>
      {children}
    </a>
  ),
  p: ({ children, className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={classnames("leading-7 [&:not(:first-child)]:mt-6", className)} {...props}>
      {children}
    </p>
  ),
  ul: ({ children, className, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className={classnames("my-6 ml-6 list-disc", className)} {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, className, ...props }: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className={classnames("my-6 ml-6 list-decimal", className)} {...props}>
      {children}
    </ol>
  ),
  li: ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className={classnames("mt-2", className)} {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, className, ...props }: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className={classnames("[&>*]:text-muted-foreground mt-6 border-l-2 pl-6 italic", className)} {...props}>
      {children}
    </blockquote>
  ),
  img: ({ className, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img className={classnames("rounded-md border", className)} alt={alt} {...props} />
  ),
  hr: ({ ...props }: React.HTMLAttributes<HTMLHRElement>) => <hr className="my-4 md:my-8" {...props} />,
  table: ({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table className={classnames("w-full", className)} {...props}>
        {children}
      </table>
    </div>
  ),
  tr: ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className={classnames("even:bg-muted m-0 border-t p-0", className)} {...props} />
  ),
  th: ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={classnames(
        "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={classnames(
        "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
        className,
      )}
      {...props}
    >
      {children}
    </td>
  ),
  pre: ({ children, className, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className={classnames("mb-4 mt-6 overflow-x-auto rounded-lg border bg-black py-4", className)} {...props}>
      {children}
    </pre>
  ),
  code: ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <code
      className={classnames("relative rounded border px-[0.3rem] py-[0.2rem] font-mono text-sm", className)}
      {...props}
    >
      {children}
    </code>
  ),
  Image,
};

interface MdxProps {
  code: string;
}

export function Mdx({ code }: MdxProps) {
  const Component = useMDXComponent(code);

  return (
    <div className="mdx">
      <Component components={components} />
    </div>
  );
}
