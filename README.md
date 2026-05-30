# Expo Router TV monorepo demo 👋

This is an Expo monorepo template that builds the same source for Apple TV, Android TV, iOS, iPadOS, Android, and web. Two thin app shells under `apps/` share a single source package under `packages/source/`.

It uses

- the [React Native TV fork](https://github.com/react-native-tvos/react-native-tvos), which supports both phone and TV targets from one React Native runtime
- the [React Native TV config plugin](https://github.com/react-native-tvos/config-tv/tree/main/packages/config-tv), enabled only in the TV app's `app.json`
- npm/yarn workspaces declared via the root `package.json#workspaces` field (pnpm users add their own `pnpm-workspace.yaml`)

The application code is based on the [revamped default project template](https://expo.dev/changelog/sdk-55-beta#revamped-default-project-template) introduced in SDK 55 (specifically the `with-router-tv` example), reorganized for a monorepo.

## 🚀 How to use

#### Creating a new project

```sh
npx create-expo-app -e with-monorepo-tv
cd <your-project>
yarn       # or npm install
```

#### Mobile development

```sh
cd apps/mobile
yarn prebuild   # syncs route re-exports, then runs expo prebuild --clean
yarn ios        # iOS / iPadOS
yarn android    # Android
yarn web        # local web dev server
```

#### TV development

```sh
cd apps/tv
yarn prebuild   # syncs re-exports, then runs `EXPO_TV=1 expo prebuild --clean`
yarn ios        # Apple TV
yarn android    # Android TV
```

> The `EXPO_TV=1` env var is only needed at **prebuild** time — it switches the `@react-native-tvos/config-tv` plugin into TV mode when generating native projects. Subsequent `yarn ios`/`yarn android` runs operate on the already-TV-configured native project and don't need it. EAS Build profiles in `apps/tv/eas.json` set `env.EXPO_TV=1` because EAS runs prebuild during build.

## Monorepo structure

```
with-monorepo-tv/
├── package.json                  # workspaces declaration
├── scripts/sync-routes.js        # generates app re-export trees
├── apps/
│   ├── mobile/                   # phones + tablets + web shell
│   └── tv/                       # Apple TV + Android TV shell
└── packages/
    └── source/                   # the actual application code
        ├── src/                  # routes, components, hooks, constants, global.css
        └── assets/               # icons, images, fonts, tv_icons
```

Everything substantive lives in `packages/source/`. The app shells are deliberately thin — each contains only its own `package.json`, `app.json`, `metro.config.js`, `tsconfig.json`, `eas.json`, and a generated `src/app/` tree of one-line re-exports.

### Sharing routes via re-export

Expo Router enforces that the router root must resolve **inside** the app's project root — paths that escape (e.g. `../../packages/source/src/app`) are rejected with `INVALID_ROUTER_ROOT`. The validation lives in `@expo/cli/.../metro/router.js` (`getRouterDirectoryModuleIdWithManifest`); the babel-side resolution lives in `babel-preset-expo/.../common.js` (`getExpoRouterAbsoluteAppRoot`).

A symlink from `apps/<name>/src/app` to `packages/source/src/app` passes the validation but Metro/babel's `require.context` enumeration through the symlink is unreliable — routes deeper than the top level can fail to register.

Each app therefore carries a real `src/app/` directory of one-line re-exports:

```ts
// apps/mobile/src/app/explore.tsx
export { default } from "with-monorepo-tv-source/src/app/explore";
```

These re-exports are committed to the repo, but **edit routes only in `packages/source/src/app/`** — `scripts/sync-routes.js` regenerates the re-export trees automatically.

### `scripts/sync-routes.js`

Runs as part of each app's `prebuild` script (before `expo prebuild --clean`). It

- walks `packages/source/src/app/` and emits a one-line re-export at the matching path under every `apps/*/src/app/`
- deletes app-side files that no longer have a counterpart in source (so removing a shared route propagates)
- preserves group routes like `(tabs)/` and dynamic segments like `[id]/` by copying the path verbatim
- is idempotent — files with matching content are left alone, so it produces no spurious git churn

You can also run it manually at any time:

```sh
yarn sync-routes      # from the workspace root
```

**Limitation:** only `default` exports are mirrored. A route that needs named exports requires a hand-edited re-export.

### Why `reset-project` is omitted

The `with-router-tv` template ships a `reset-project` script that moves the starter code to `app-example/` and creates a blank `src/app/`. That script doesn't have a clean story for the monorepo layout — it's unclear whether "reset" should target the shared package, the re-export trees, or both, and the re-exports would have to be rebuilt regardless.

For a fresh start in this template, clear `packages/source/src/app/`, add your own routes, then run:

```sh
yarn sync-routes
```

to regenerate the app re-export trees.

### ESLint and `@/*` imports

The source uses `@/components/...`, `@/hooks/...`, `@/assets/...` aliases throughout. The apps' `tsconfig.json` files map these correctly, but `expo lint` (which generates `.eslintrc.js` extending `expo`) only configures the **node** import resolver — `@/*` paths will show as unresolved under `import/no-unresolved`.

If you run `expo lint` and want those imports to resolve, drop a root `.eslintrc.js` like:

```js
module.exports = {
  extends: 'expo',
  settings: {
    'import/resolver': {
      typescript: {
        project: ['apps/*/tsconfig.json'],
        alwaysTryTypes: true,
      },
      node: true,
    },
  },
};
```

`eslint-import-resolver-typescript` is pulled in transitively by recent `eslint-plugin-import` versions.

## Deploy

Deploy on all platforms with Expo Application Services (EAS).

- Deploy the website: `cd apps/mobile && yarn deploy` — [Learn more](https://docs.expo.dev/eas/hosting/get-started/)
- Build for iOS/Android/TV with `cd apps/<x> && npx eas-cli build` — [Learn more](https://expo.dev/eas)

## Learn more

- [Expo documentation](https://docs.expo.dev/)
- [Building Expo apps for TV](https://docs.expo.dev/guides/building-for-tv/)
- [Working with monorepos](https://docs.expo.dev/guides/monorepos/)

## Join the community

- [Expo on GitHub](https://github.com/expo/expo)
- [Discord community](https://chat.expo.dev)
