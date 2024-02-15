/** @type {import('next').NextConfig} */
const path = require("path");
const nextRoutes = require("nextjs-routes/config");
const withRoutes = nextRoutes({
    cwd: __dirname,
});

const nextConfig = {
    reactStrictMode: true,
    output: "standalone",
    compress: false,
    compiler: {
        emotion: true,
        removeConsole: process.env.NODE_ENV === "production" && {
            exclude: ["error"],
        },
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to compile - this is due to some build issues with next.js 14.
        ignoreBuildErrors: true,
    },
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

        config.optimization = {
            minimize: false,
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
