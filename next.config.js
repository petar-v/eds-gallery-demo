/** @type {import('next').NextConfig} */
const path = require("path");
const nextRoutes = require("nextjs-routes/config");
const withRoutes = nextRoutes({
    cwd: __dirname,
});

const nextConfig = {
    reactStrictMode: true,
    experimental: {
        webpackBuildWorker: true,
        instrumentationHook: true,
        typedRoutes: true,
        serverActions: {
            bodySizeLimit: "15mb",
        },
    },
    sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
    },
    async rewrites() {
        return [
            {
                source: "/notebook-:id",
                destination: "/:id",
            },
            {
                source: "/:id/:title",
                destination: "/:id",
            },
        ];
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

module.exports = withRoutes(nextConfig);
