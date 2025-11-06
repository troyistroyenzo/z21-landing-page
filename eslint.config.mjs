import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/no-unescaped-entities': 'warn',  // Allow apostrophes/quotes in JSX
      '@typescript-eslint/triple-slash-reference': 'off',  // Allow Next.js auto-generated files
      'prefer-const': 'warn',  // Don't block on let vs const
      '@next/next/no-html-link-for-pages': 'warn',  // Allow <a> tags for now
    },
  },
];

export default eslintConfig;
