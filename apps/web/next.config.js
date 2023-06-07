//@ts-check

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { composePlugins, withNx } = require("@nx/next");
// @ts-expect-error: ...?
const withNextIntl = require("next-intl/plugin")(
  // This is the default (also the `src` folder is supported out of the box)
  "./i18n.ts",
);

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {
    // Set this to true if you would like to use SVGR
    // See: https://github.com/gregberge/svgr
    svgr: false,
  },
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
    // FIXME: remove uglify-js: https://github.com/vercel/next.js/issues/50042
    serverComponentsExternalPackages: ["mysql2"],
  },
};

const plugins = [
  // Add more Next.js plugins to this list if needed.
  withNx,
  withNextIntl,
];

module.exports = composePlugins(...plugins)(nextConfig);
