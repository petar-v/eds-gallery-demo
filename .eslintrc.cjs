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
    ignorePatterns: ["next.config.js"],
    rules: {
        "chakra-ui/props-order": 2,
        "chakra-ui/props-shorthand": 2,
        "chakra-ui/require-specific-component": 2,
        "react/react-in-jsx-scope": 0,
        "no-unused-vars": 0,
        "@typescript-eslint/no-unused-vars": 0,
        "@typescript-eslint/no-unsafe-assignment": 0,
        "@typescript-eslint/no-unsafe-argument": 0,
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-unsafe-member-access": 0,
        "@typescript-eslint/no-unsafe-return": 0,
    },
};
