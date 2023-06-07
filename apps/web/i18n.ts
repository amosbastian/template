import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => ({
  messages: (await import(`../../libs/locales/src/lib/${locale}.json`)).default,
}));
