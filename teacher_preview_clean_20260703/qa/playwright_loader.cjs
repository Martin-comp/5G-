const path = require("path");

function tryRequire(target) {
  try {
    return require(target);
  } catch (error) {
    if (error && error.code === "MODULE_NOT_FOUND") {
      return null;
    }
    throw error;
  }
}

function loadPlaywright() {
  const home = process.env.HOME || "/Users/ny";
  const candidates = [
    process.env.PLAYWRIGHT_MODULE_PATH,
    "playwright",
    path.join(home, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright"),
    path.join(home, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@playwright/test")
  ].filter(Boolean);

  for (const candidate of candidates) {
    const loaded = tryRequire(candidate);
    if (loaded && loaded.chromium) {
      return loaded;
    }
  }

  throw new Error(
    "Cannot load Playwright. Set PLAYWRIGHT_MODULE_PATH or use the bundled Codex runtime node_modules path."
  );
}

module.exports = { loadPlaywright };
