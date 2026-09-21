import fs from 'fs';
import { execSync } from 'child_process';

const newVersion = process.env.npm_package_version;

if (!newVersion) {
  console.error('This script must be run via the "npm version" command.');
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
manifest.version = newVersion;

fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2) + '\n');

execSync('git add manifest.json');
