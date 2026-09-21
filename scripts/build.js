import esbuild from "esbuild";
import fs from "fs";
import { spawnSync } from "child_process";
import bestzip from "bestzip";

async function build() {
  if (fs.existsSync("dist")) {
    fs.rmSync("dist", { recursive: true, force: true });
  }

  const files = fs.readdirSync(".");
  for (const file of files) {
    if (file.endsWith(".zip")) {
      fs.unlinkSync(file);
    }
  }

  fs.mkdirSync("dist", { recursive: true });

  const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));

  if (!manifest.name || !manifest.entryPoint || !manifest.className) {
    process.exit(1);
  }

  function runTool(command, args) {
    const result = spawnSync(command, args, { stdio: "inherit", shell: true });
    if (result.status !== 0) {
      process.exit(result.status || 1);
    }
  }

  try {
    esbuild.buildSync({
      entryPoints: [manifest.entryPoint],
      bundle: true,
      minifySyntax: true,
      minifyWhitespace: true,
      format: "iife",
      outfile: "dist/index.js",
    });
  } catch (err) {
    process.exit(1);
  }

  if (fs.existsSync("src/settings.ts")) {
    runTool("typescript-json-schema", [
      "src/settings.ts",
      "PluginSettings",
      "--required",
      "--out",
      "dist/schema.json",
    ]);
  } else if (fs.existsSync("src/schema.json")) {
    fs.copyFileSync("src/schema.json", "dist/schema.json");
  }

  if (fs.existsSync("src/index.ts")) {
    runTool("tsc", [
      "--emitDeclarationOnly",
      "--declaration",
      "--declarationDir",
      "dist",
    ]);
  } else if (fs.existsSync("src/index.d.ts")) {
    fs.copyFileSync("src/index.d.ts", "dist/index.d.ts");
  }

  try {
    fs.copyFileSync("manifest.json", "dist/manifest.json");
  } catch (err) {
    process.exit(1);
  }

  const zipName = `${manifest.name}.zip`;
  try {
    try {
      await bestzip({
        source: "*",
        cwd: "dist",
        destination: `../${zipName}`,
      });
    } catch (err) {
      process.exit(1);
    }
  } catch (err) {
    process.exit(1);
  }
}

build();
