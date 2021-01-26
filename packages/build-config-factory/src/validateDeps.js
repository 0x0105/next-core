const path = require("path");
const { isEmpty } = require("lodash");

module.exports = function validateDeps(scope) {
  const packageJson = require(path.join(process.cwd(), "package.json"));

  if (scope === "bricks") {
    if (!isEmpty(packageJson.dependencies)) {
      throw new Error(
        scope +
          "/*` should not have any `dependencies`, use `peerDependencies` for `@next-dll/*` and `devDependencies` for others instead."
      );
    }
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    if (
      devDependencies.some(
        (name) =>
          name.startsWith("@next-bricks/") ||
          name.startsWith("@next-legacy-templates/") ||
          name.startsWith("@next-micro-apps/") ||
          name.startsWith("@bricks/") ||
          name.startsWith("@templates/") ||
          name.startsWith("@micro-apps/")
      )
    ) {
      throw new Error(
        scope +
          "/*` should never have devDependencies of templates or micro-apps or other bricks."
      );
    }
    if (
      devDependencies.includes("@next-core/brick-dll") ||
      devDependencies.some((pkg) => pkg.startsWith("@next-dll/"))
    ) {
      throw new Error(
        scope +
          "/*` should never have `devDependencies` of `@next-core/brick-dll` or `@next-dll/*`."
      );
    }
    if (
      devDependencies.includes("@easyops/brick-dll") ||
      devDependencies.some((pkg) => pkg.startsWith("@dll/"))
    ) {
      throw new Error(
        scope +
          "/*` should never have `devDependencies` of `@easyops/brick-dll` or `@dll/*`."
      );
    }
    const peerDependencies = Object.keys(packageJson.peerDependencies || {});
    if (
      peerDependencies.some(
        (pkg) =>
          !pkg.startsWith("@next-dll/") &&
          !pkg.startsWith("@next-bricks/") &&
          !pkg.startsWith("@bricks/")
      )
    ) {
      throw new Error(
        "`@" +
          scope +
          "/*` should only have `peerDependencies` of `@next-dll/*` or `@next-bricks/*`(`@bricks/*`)."
      );
    }
  } else if (scope === "micro-apps" || scope === "templates") {
    if (!isEmpty(packageJson.dependencies)) {
      throw new Error(
        scope +
          "/*` should not have any `dependencies`, use `peerDependencies` for bricks and templates, use `devDependencies` for others."
      );
    }
    const peerDependencies = Object.keys(packageJson.peerDependencies || {});
    if (
      peerDependencies.some(
        (name) =>
          !(
            name.startsWith("@next-bricks/") ||
            name.startsWith("@next-legacy-templates/") ||
            name.startsWith("@bricks/") ||
            name.startsWith("@templates/")
          )
      )
    ) {
      throw new Error(
        "`@" +
          scope +
          "/*` should only contain bricks and templates in `peerDependencies`, use `devDependencies` for others."
      );
    }
    const peerDependenciesVersions = Object.values(
      packageJson.peerDependencies || {}
    );
    if (peerDependenciesVersions.some((version) => !/[>^]/.test(version))) {
      throw new Error(
        "`@" +
          scope +
          "/*` should always contain a `^` or `>=` in it's `peerDependencies` version."
      );
    }
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    if (
      devDependencies.some(
        (name) =>
          name.startsWith("@next-bricks/") ||
          name.startsWith("@next-legacy-templates/") ||
          name.startsWith("@bricks/") ||
          name.startsWith("@templates/")
      )
    ) {
      throw new Error(
        "`@" +
          scope +
          "/*` should only contain bricks and templates in `peerDependencies`."
      );
    }
  }

  if (scope === "bricks" || scope === "templates") {
    if (packageJson.sideEffects !== true) {
      throw new Error(
        "`@" + scope + "/*` should always set `sideEffects: true`."
      );
    }
  } else if (scope === "micro-apps") {
    if (packageJson.sideEffects === true) {
      throw new Error(
        "`@" + scope + "/*` should always not set `sideEffects: true`."
      );
    }
  }
};
