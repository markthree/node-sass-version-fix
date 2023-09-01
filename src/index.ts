import { version } from "process";
import { readFile, writeFile } from "fs/promises";

const [major] = version.slice(1).split(".");

export const nodeMajorVersion = Number(major);

export function getNodeSassVersion() {
  switch (nodeMajorVersion) {
    case 20:
      return "^9.0.0";
    case 19:
    case 18:
      return "^8.0.0";
    case 17:
      return "^7.0.3";
    case 16:
    case 15:
      return "^6.0.1";
    case 14:
      return "^4.14.1";
    default:
      break;
  }
}

export const nodeSassReg = /"node-sass":.*([".*"])(?=,)/;

export async function fixPackageJson(file = "package.json") {
  const packageJson = await readFile(file, { encoding: "utf-8" });
  const newPackageJson = packageJson.replace(
    nodeSassReg,
    `"node-sass": "${getNodeSassVersion()}"`,
  );
  await writeFile(file, newPackageJson);
}
