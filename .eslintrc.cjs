module.exports = {
    extends: [
        "eslint:recommended",
        "next/core-web-vitals",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["chakra-ui"],
    parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ["next.config.js", "README.md"],
    rules: {
        "chakra-ui/props-order": 2,
        "chakra-ui/props-shorthand": 2,
        "chakra-ui/require-specific-component": 2,
        "@typescript-eslint/no-unsafe-argument": 0,
        "@typescript-eslint/no-unsafe-member-access": 0,
        "@typescript-eslint/no-unsafe-call": 0,
    },
};
