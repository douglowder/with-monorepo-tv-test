// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // Resolve the shared package's `@/*` and `@/assets/*` aliases through the
    // apps' tsconfig paths so import/no-unresolved passes across the monorepo.
    settings: {
      'import/resolver': {
        typescript: {
          project: ['apps/*/tsconfig.json'],
          alwaysTryTypes: true,
        },
        node: true,
      },
    },
  },
]);
