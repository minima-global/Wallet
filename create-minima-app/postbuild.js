// eslint-disable-next-line

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const packageJsonAsString = fs.readFileSync(
  __dirname + "/../package.json",
  "utf-8"
);
const packageJson = JSON.parse(packageJsonAsString);

let dAppConf = fs.readFileSync("./build/dapp.conf", "utf-8");
dAppConf = dAppConf.replace("{{name}}", capitalize(packageJson.name));
// dAppConf = dAppConf.replace("{{name}}", packageJson.name);
dAppConf = dAppConf.replace("{{version}}", packageJson.version);
dAppConf = dAppConf.replace("{{description}}", packageJson.description);

fs.writeFileSync("./build/dapp.conf", dAppConf);
