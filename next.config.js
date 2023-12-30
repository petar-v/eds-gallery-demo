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
    webpack: (config) => {
        config.module.rules.push({
            test: /\.txt$/i,
            loader: "raw-loader",
        });
        config.module.rules.push({
            test: /\.ndjson$/i,
            loader: "raw-loader",
        });

        config.externals = {
            "better-sqlite3": "commonjs better-sqlite3",
        };

        return config;
    },
};

module.exports = nextConfig;
