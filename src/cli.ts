#!/usr/bin/env node

import { consola } from "consola";
import { existsSync } from "fs";
import { writeFile } from "fs/promises";
import { cyan } from "kolorist";
import { resolve } from "path";

import { fixPackageJson, nodeMajorVersion } from "./index";

const log = consola.withTag("node-sass-version-fix");

async function fix() {
  console.log();

  const _cwd = process.cwd();
  const rc = resolve(_cwd, ".npmrc");
  const packageJson = resolve(_cwd, "package.json");

  if (!existsSync(packageJson)) {
    log.error("Package.json not found, please confirm the cwd of the project");
    return;
  }

  log.success("The current major version of the node is", nodeMajorVersion);

  await fixPackageJson(packageJson);

  if (!existsSync(rc)) {
    await writeFile(
      rc,
      "registry=https://registry.npmmirror.com/\nsass_binary_site=https://npm.taobao.org/mirrors/node-sass/",
    );
  }

  log.success(`fix successful, please execute ${cyan("npm install")} again`);
  console.log();
}

fix();
