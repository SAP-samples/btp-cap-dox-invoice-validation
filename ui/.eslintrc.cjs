module.exports = {
    env: { browser: true, es2020: true },
    extends: [
        "eslint:recommended",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended-type-checked"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
        tsconfigRootDir: __dirname
    },
    plugins: ["react-refresh", "@typescript-eslint"],
    rules: {
        "react-refresh/only-export-components": "warn",
        "no-duplicate-imports": "warn",
        "prefer-const": "warn",
        camelcase: "warn",
        "no-var": "warn",
        "no-duplicate-imports": "warn",
        "@typescript-eslint/ban-ts-comment": "off",
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksVoidReturn: false
            }
        ],
        "@typescript-eslint/no-unsafe-assignment": "warn",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unsafe-argument": "warn",
        "@typescript-eslint/no-unsafe-member-access": "warn",
        "@typescript-eslint/no-unsafe-call": "warn",
        "@typescript-eslint/no-unsafe-return": "warn"
    }
};
