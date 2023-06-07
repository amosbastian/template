import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "@template/locales";

export default createMiddleware({
  // A list of all locales that are supported
  locales,
  // If this locale is matched, pathnames work without a prefix (e.g. `/about`)
  defaultLocale,
});

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
