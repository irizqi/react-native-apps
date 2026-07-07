import { config } from "@monoriz/eslint-config/react-internal";
import globals from "globals";

export default [
  ...config,
  {
    ignores: [".expo/**", "dist/**", "web-build/**", "android/**", "ios/**"],
  },
  {
    files: ["*.config.js", "metro.config.js"],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
];
