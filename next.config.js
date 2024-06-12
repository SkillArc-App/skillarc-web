/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        // matching all API routes
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          {
            key: 'Access-Control-Allow-Headers',
            value:
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      {
        source: '/admin/jobs/:id',
        destination: '/admin/jobs/:id/the-basics',
        permanent: false
      },
      {
        source: '/invites/seekers/:id',
        destination: '/jobs',
        permanent: false
      },
      {
        source: '/onboarding',
        destination: '/onboarding/loading',
        permanent: false
      },
      {
        source: '/coaches',
        destination: '/coaches/seekers',
        permanent: false
      },
      {
        source: '/my_jobs',
        destination: '/my_jobs/recently-viewed',
        permanent: false
      },
      {
        source: '/employers/jobs',
        destination: '/employers/jobs/all',
        permanent: false
      },
      {
        source: '/coaches/contexts/:id',
        destination: '/coaches/contexts/:id/notes',
        permanent: false
      },
    ]
  }
}

module.exports = nextConfig


// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,

    org: "sentry-cylindrical-51654",
    project: "javascript-nextjs",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,
  }
);
