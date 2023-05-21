export const BASE_URL = process.env["NODE_ENV"] === "production" ? "https://example.com" : "http://localhost:4200";
export const BRAND_NAME = "Template";
export const BRAND_DESCRIPTION =
  "A Next.js 13 application with authentication and payments, built with PlanetScale, Drizzle ORM, Lucia and Tailwind";

export const ADMIN_ROLE = "admin";
export const MEMBER_ROLE = "member";
export const ROLES = [ADMIN_ROLE, MEMBER_ROLE] as const;
