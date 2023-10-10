import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonAsString = fs.readFileSync(__dirname + '/../package.json', 'utf-8');
const packageJson = JSON.parse(packageJsonAsString);
process.stdout.write(packageJson.version);
