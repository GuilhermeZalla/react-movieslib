import js from '@eslint/js';
import prettier from 'eslint-config-prettier/flat';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'coverage/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    rules: {
      // Keep error diagnostics until the Phase 3 error UI exists; console.log is forbidden.
      'no-console': ['error', { allow: ['error', 'warn'] }],
    },
  },
  {
    files: [
      'src/**/*.{ts,tsx}',
      'e2e/**/*.ts',
      'api/**/*.ts',
      'server/**/*.ts',
      'shared/**/*.ts',
      'vite.config.ts',
      'playwright.config.ts',
    ],
    extends: [...tseslint.configs.strictTypeChecked],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // React callbacks conventionally use shorthand arrows returning void; keep them readable.
      '@typescript-eslint/no-confusing-void-expression': [
        'error',
        { ignoreArrowShorthand: true },
      ],
      // Numeric route IDs/pages are deliberately serialized in template literals.
      // Nullish image paths retain the legacy sentinel URLs filtered by FilmCard/Cast;
      // replacing that image pipeline belongs to Phase 3, not this tooling lot.
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        { allowNumber: true, allowNullish: true },
      ],
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    rules: {
      // All application data requests go through the validated TMDB client.
      'no-restricted-globals': [
        'error',
        { name: 'fetch', message: 'Use src/api/tmdb/client.ts.' },
        { name: 'XMLHttpRequest', message: 'Use src/api/tmdb/client.ts.' },
      ],
      'no-restricted-imports': [
        'error',
        {
          paths: [{ name: 'axios', message: 'Use src/api/tmdb/client.ts.' }],
          patterns: [
            { group: ['axios/*'], message: 'Use src/api/tmdb/client.ts.' },
          ],
        },
      ],
      'no-restricted-properties': [
        'error',
        {
          object: 'window',
          property: 'fetch',
          message: 'Use src/api/tmdb/client.ts.',
        },
        {
          object: 'globalThis',
          property: 'fetch',
          message: 'Use src/api/tmdb/client.ts.',
        },
        {
          object: 'self',
          property: 'fetch',
          message: 'Use src/api/tmdb/client.ts.',
        },
        {
          object: 'window',
          property: 'XMLHttpRequest',
          message: 'Use src/api/tmdb/client.ts.',
        },
      ],
    },
  },
  {
    files: ['src/api/tmdb/client.ts'],
    rules: {
      // This is the one production boundary that may call fetch.
      'no-restricted-globals': [
        'error',
        { name: 'XMLHttpRequest', message: 'Use fetch in this client.' },
      ],
    },
  },
  {
    files: ['src/**/*.{test,spec}.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      // Tests mock and inspect fetch; their network guard blocks real requests.
      'no-restricted-globals': 'off',
      'no-restricted-properties': 'off',
    },
  },
  {
    files: ['src/**/*.tsx'],
    extends: [
      jsxA11y.flatConfigs.recommended,
      reactHooks.configs.flat.recommended,
    ],
    plugins: { react, 'react-refresh': reactRefresh },
    settings: {
      react: { version: '18.2' },
      linkComponents: [{ name: 'Link', linkAttribute: 'to' }],
    },
    rules: {
      'react/no-danger': 'error',
      'jsx-a11y/anchor-is-valid': [
        'error',
        { components: ['Link'], specialLink: ['to'] },
      ],
      'jsx-a11y/control-has-associated-label': 'error',
      'react/jsx-no-target-blank': [
        'error',
        { allowReferrer: false, enforceDynamicLinks: 'always' },
      ],
      // Require both explicit tokens even for internal links: noreferrer alone implies
      // noopener in browsers but does not satisfy this project's security policy.
      'no-restricted-syntax': [
        'error',
        ...['noopener', 'noreferrer'].map((token) => ({
          selector: `JSXOpeningElement:has(JSXAttribute[name.name="target"]:matches([value.value="_blank"], [value.expression.value="_blank"])):not(:has(JSXAttribute[name.name="rel"]:matches([value.value=/\\b${token}\\b/], [value.expression.value=/\\b${token}\\b/])))`,
          message: `target="_blank" requires an explicit ${token} token in rel.`,
        })),
      ],
      // Vite supports constant exports alongside components without breaking Fast Refresh.
      'react-refresh/only-export-components': [
        'error',
        { allowConstantExport: true },
      ],
      'react-hooks/exhaustive-deps': 'error',
    },
  },
  {
    files: [
      'src/components/layout/Aside.tsx',
      'src/components/layout/AsideMobile.tsx',
      'src/pages/people/CastCatalog.tsx',
      'src/pages/person-details/CastDetails.tsx',
      'src/pages/genres/GenresCatalog.tsx',
      'src/pages/movies/MoviesCatalog.tsx',
      'src/pages/movie-details/MovieDetails.tsx',
    ],
    rules: {
      // These legacy fetches assert DTOs without runtime validation. Keep defensive JSON
      // guards until Phase 3 Zod parsing makes static nullability trustworthy (STATUS.md).
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
  {
    files: [
      '*.{js,ts}',
      'scripts/**/*.mjs',
      'e2e/**/*.ts',
      'api/**/*.ts',
      'server/**/*.ts',
    ],
    languageOptions: { globals: globals.node },
  },
  // Prettier owns formatting; this preset disables only conflicting stylistic rules.
  prettier,
);
