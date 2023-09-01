#!/usr/bin/env node

import { consola } from "consola";
import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { cyan } from "kolorist";

import { getNodeSassVersion, nodeMajorVersion } from "./index";

const log = consola.withTag("node-sass-version-fix");

const nodeSassReg = /"node-sass":.*([".*"])(?=,)/;

async function fix() {
  console.log();
  if (!existsSync("package.json")) {
    log.error("Package.json not found, please confirm the cwd of the project");
    return;
  }

  log.success("The current major version of the node is", nodeMajorVersion);

  const packageJson = await readFile("package.json", { encoding: "utf-8" });

  if (!nodeSassReg.test(packageJson)) {
    log.error(
      `The current project's package.json does not have a ${
        cyan("node-sass")
      } and does not need to be fixed`,
    );
    return;
  }

  const newPackageJson = packageJson.replace(
    nodeSassReg,
    `"node-sass": "${getNodeSassVersion()}"`,
  );

  await writeFile("package.json", newPackageJson);

  if (!existsSync('.npmrc')) {
    await writeFile(".npmrc", "registry=https://registry.npmmirror.com/\nsass_binary_site=https://npm.taobao.org/mirrors/node-sass/")
  }

  log.success(`fix successful, please execute ${cyan("npm install")} again`);
  console.log();
}

fix();
