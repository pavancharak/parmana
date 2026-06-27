import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/*.d.ts",
      "**/coverage/**",
      "**/node_modules/**"
    ]
  },

  js.configs.recommended,

  ...tseslint.configs.recommended,

  {
    files: ["packages/**/*.ts"],

    languageOptions: {
      parserOptions: {
        project: false
      }
    },

    rules: {
      "no-console": "off",

      "no-unused-vars": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],

      "@typescript-eslint/no-explicit-any": "warn"
    }
  }
];