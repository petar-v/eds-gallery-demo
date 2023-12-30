/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        webpackBuildWorker: true,
        instrumentationHook: true,
        serverActions: {
            bodySizeLimit: "15mb",
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    webpack: (config, { isServer }) => {
        config.externals = {
            "better-sqlite3": "commonjs better-sqlite3",
        };

        if (isServer) {
            config.resolve.fallback = {
                fs: false,
            };
        }

        return config;
    },
};

module.exports = nextConfig;
