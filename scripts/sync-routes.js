#!/usr/bin/env node
/**
 * sync-routes.js
 *
 * Regenerates each app's src/app/ re-export tree from packages/source/src/app/.
 *
 * Why this exists: Expo Router enforces that the router root must resolve
 * inside the app's project root, so we can't simply point at the shared
 * source from each app. Instead, every app has a real src/app/ directory
 * of one-line re-exports forwarding to the route files in
 * packages/source/src/app/. This script keeps those re-exports in sync.
 *
 * Wired into each app's `prebuild` script (runs from the app dir):
 *   "prebuild": "node ../../scripts/sync-routes.js && expo prebuild --clean"
 *
 * Limitation: only `default` exports are forwarded. A route that needs
 * named exports requires a hand-edited re-export.
 */

const fs = require("fs");
const path = require("path");

const WORKSPACE_ROOT = path.resolve(__dirname, "..");
const SOURCE_PKG = path.join(WORKSPACE_ROOT, "packages", "source");
const SOURCE_APP = path.join(SOURCE_PKG, "src", "app");
const APPS_DIR = path.join(WORKSPACE_ROOT, "apps");

const SOURCE_PKG_NAME = JSON.parse(
  fs.readFileSync(path.join(SOURCE_PKG, "package.json"), "utf8")
).name;

const ROUTE_EXT = /\.(?:ts|tsx|js|jsx)$/;
const SKIP_NAME = /^[.]|\.(?:test|spec)\.|\+(?:api|middleware)\./;

function walk(dir, rel = "") {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const childRel = rel ? `${rel}/${entry.name}` : entry.name;
    const childAbs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walk(childAbs, childRel));
    } else if (entry.isFile() && ROUTE_EXT.test(entry.name) && !SKIP_NAME.test(entry.name)) {
      out.push(childRel);
    }
  }
  return out;
}

function reexportBody(relPath) {
  const noExt = relPath.replace(ROUTE_EXT, "");
  return `export { default } from "${SOURCE_PKG_NAME}/src/app/${noExt}";\n`;
}

function pruneEmpty(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      const sub = path.join(dir, entry.name);
      pruneEmpty(sub);
      if (fs.readdirSync(sub).length === 0) fs.rmdirSync(sub);
    }
  }
}

function syncApp(appDir, sourceFiles) {
  const appAppDir = path.join(appDir, "src", "app");
  fs.mkdirSync(appAppDir, { recursive: true });

  const expected = new Set(sourceFiles);
  let written = 0, skipped = 0, removed = 0;

  for (const rel of sourceFiles) {
    const target = path.join(appAppDir, rel);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const body = reexportBody(rel);
    if (fs.existsSync(target) && fs.readFileSync(target, "utf8") === body) {
      skipped++;
      continue;
    }
    fs.writeFileSync(target, body);
    written++;
  }

  for (const rel of walk(appAppDir)) {
    if (!expected.has(rel)) {
      fs.rmSync(path.join(appAppDir, rel));
      removed++;
    }
  }
  pruneEmpty(appAppDir);

  return { written, skipped, removed };
}

function main() {
  if (!fs.existsSync(SOURCE_APP)) {
    console.error(`sync-routes: ${SOURCE_APP} does not exist`);
    process.exit(1);
  }
  const sourceFiles = walk(SOURCE_APP);

  const apps = fs
    .readdirSync(APPS_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => fs.existsSync(path.join(APPS_DIR, name, "package.json")));

  for (const app of apps) {
    const stats = syncApp(path.join(APPS_DIR, app), sourceFiles);
    console.log(
      `sync-routes ${app}: ${stats.written} written, ${stats.skipped} unchanged, ${stats.removed} removed`
    );
  }
}

main();
