import { fixupConfigRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import prettier from "eslint-plugin-prettier";
import { defineConfig } from "eslint/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default defineConfig([
  {
    files: ["packages/**/*.{js,ts,tsx}"],
    extends: fixupConfigRules(compat.extends("@react-native", "prettier")),
    plugins: { prettier },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react-native/no-inline-styles": "off",
      "prettier/prettier": [
        "error",
        {
          singleQuote: true,
          trailingComma: "es5",
          printWidth: 80,
          tabWidth: 2,
          semi: true,
          bracketSpacing: true,
          arrowParens: "always",
          endOfLine: "lf",
        },
      ],
    },
  },
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/build/",
      "**/ios/",
      "**/android/",
    ],
  },
]);
