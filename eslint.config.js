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
    files: ['src/**/*.{ts,tsx}', 'vite.config.ts'],
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
      'src/components/common/aside/aside.tsx',
      'src/components/common/asideMobile/asideMobile.tsx',
      'src/components/home/castCatalog/castCatalog.tsx',
      'src/components/home/castDetails/castDetails.tsx',
      'src/components/home/genresCatalog/genresCatalog.tsx',
      'src/components/home/moviesCatalog/moviesCatalog.tsx',
      'src/components/movie-details/movie-details.tsx',
    ],
    rules: {
      // These legacy fetches assert DTOs without runtime validation. Keep defensive JSON
      // guards until Phase 3 Zod parsing makes static nullability trustworthy (STATUS.md).
      '@typescript-eslint/no-unnecessary-condition': 'off',
    },
  },
  {
    files: [
      'src/components/common/aside/aside.tsx',
      'src/components/common/asideMobile/asideMobile.tsx',
    ],
    rules: {
      // Only the two legacy Genres dropdown anchors are deferred to Phase 6 (STATUS.md).
      // scripts/lint.mjs rejects every warning outside those exact source locations.
      'jsx-a11y/anchor-is-valid': [
        'warn',
        { components: ['Link'], specialLink: ['to'] },
      ],
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/interactive-supports-focus': 'warn',
    },
  },
  {
    files: ['*.{js,ts}', 'scripts/**/*.mjs'],
    languageOptions: { globals: globals.node },
  },
  // Prettier owns formatting; this preset disables only conflicting stylistic rules.
  prettier,
);
