export default [
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                ecmaVersion: 2022,
                sourceType: "module"
            }
        },
        rules: {}
    }
];
