/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
    reactStrictMode: true,

    experimental: {
        webpackBuildWorker: true,
        serverActions: {
            bodySizeLimit: "10mb",
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

        return config;
    },
};

module.exports = nextConfig;
