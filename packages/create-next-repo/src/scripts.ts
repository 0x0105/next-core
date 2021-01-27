import chalk from "chalk";
import execa from "execa";

export function scriptYarnInstall(targetDir: string) {
  console.log(chalk.inverse("[create-next-repo] $ yarn"));
  return execa("yarn", [], {
    cwd: targetDir,
    stdio: "inherit",
    env: {
      // https://github.com/mbalabash/estimo/blob/master/scripts/findChrome.js#L1
      ESTIMO_DISABLE: "true",
    },
  });
}

export function scriptYarnAddDependencies(targetDir: string) {
  console.log(
    chalk.inverse(
      "[create-next-repo] $ yarn add -D -W @next-core/dev-dependencies"
    )
  );
  return execa("yarn", ["add", "-D", "-W", "@next-core/dev-dependencies"], {
    cwd: targetDir,
    stdio: "inherit",
    env: {
      // https://github.com/mbalabash/estimo/blob/master/scripts/findChrome.js#L1
      ESTIMO_DISABLE: "true",
    },
  });
}

export function scriptYarnExtract(targetDir: string) {
  console.log(chalk.inverse("[create-next-repo] $ yarn extract"));
  return execa("yarn", ["extract"], {
    cwd: targetDir,
    stdio: "inherit",
    env: {
      // https://github.com/mbalabash/estimo/blob/master/scripts/findChrome.js#L1
      ESTIMO_DISABLE: "true",
    },
  });
}
