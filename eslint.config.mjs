import eslint from "@eslint/js";
import angular from "angular-eslint";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";

/** @type { import("eslint").Linter.Config[] } */
const config = tseslint.config(
  eslintConfigPrettier,
  eslintPluginPrettierRecommended,
  {
    name: "Library TypeScript",
    files: ["src/**/*.ts"],
    ignores: ["projects/**/*", "node_modules/**/*", "dist/**/*"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        project: "./tsconfig.lint.json",
      },
    },
    rules: {
      "no-console": "error",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["matMultiSort", "matTableColumnConfig"],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["mat-multi-sort", "mat-table-column-config"],
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/unbound-method": [
        "error",
        {
          ignoreStatic: true,
        },
      ],
      // TODO: Remove this rule once we have a way to test the component change detection strategy, see #261
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
        },
      ],
    },
  },
  {
    name: "Demo TypeScript",
    files: ["projects/demo/**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: "module",
        project: "./tsconfig.lint.json",
      },
    },
    rules: {
      "no-console": "error",
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/unbound-method": [
        "error",
        {
          ignoreStatic: true,
        },
      ],
      // TODO: Remove this rule once we have a way to test the component change detection strategy, see #261
      "@angular-eslint/prefer-on-push-component-change-detection": "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: false,
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);

/** @type { import("eslint").Linter.Config[] } */
export default config;
