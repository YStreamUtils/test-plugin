import fs from "fs";

const newVersion = process.env.npm_package_version;

if (!newVersion) {
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
manifest.version = newVersion;

fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2) + "\n");
