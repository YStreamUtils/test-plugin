import esbuild from "esbuild";
import fs from "fs";
import path from "path";
import bestzip from "bestzip";
import * as tsj from "ts-json-schema-generator";
import { execSync } from "child_process";

async function build() {
  try {
    if (fs.existsSync("dist")) {
      fs.rmSync("dist", { recursive: true, force: true });
    }
    fs.mkdirSync("dist", { recursive: true });

    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    const manifest = JSON.parse(fs.readFileSync("manifest.json", "utf8"));
    
    manifest.version = pkg.version;
    fs.writeFileSync("manifest.json", JSON.stringify(manifest, null, 2));

    const sanitizedZipName =
      manifest.name.replace(/[^a-zA-Z0-9\-_]/g, "_") + ".zip";

    console.log("Bundling plugin source code...");
    esbuild.buildSync({
      entryPoints: [manifest.entryPoint],
      bundle: true,
      minify: true,
      treeShaking: true,
      format: "esm",
      platform: "neutral",
      target: "es2022",
      outfile: "dist/index.js",
    });

    console.log("Generating type definitions (index.d.ts)...");
    try {
      const ts = await import("typescript").then(m => m.default || m);
      const tsconfigFile = ts.readConfigFile("tsconfig.json", ts.sys.readFile);
      const configParse = ts.parseJsonConfigFileContent(tsconfigFile.config, ts.sys, "./");
      
      const compilerOptions = {
        ...configParse.options,
        declaration: true,
        emitDeclarationOnly: true,
        outFile: "dist/index.d.ts"
      };

      const program = ts.createProgram([manifest.entryPoint], compilerOptions);
      program.emit();
    } catch (tscErr) {
      console.warn("Warning: Type definition generation encountered errors.");
    }

    if (fs.existsSync("src/settings.ts")) {
      console.log(
        "Automatically generating schema.json from src/settings.ts...",
      );

      const config = {
        path: "src/settings.ts",
        tsconfig: "tsconfig.json",
        type: "PluginSettings",
        expose: "export",
        topRef: true,
      };

      const schema = tsj.createGenerator(config).createSchema(config.type);
      fs.writeFileSync("dist/schema.json", JSON.stringify(schema, null, 2));
    }

    fs.writeFileSync("dist/manifest.json", JSON.stringify(manifest, null, 2));

    console.log("Packaging extension artifacts...");
    const archiveItems = ["index.js", "manifest.json"];
    
    if (fs.existsSync("dist/index.d.ts")) archiveItems.push("index.d.ts");
    if (fs.existsSync("dist/schema.json")) archiveItems.push("schema.json");

    await bestzip({
      source: archiveItems,
      cwd: "dist",
      destination: path.join("..", sanitizedZipName),
    });

    console.log(`Success: Created plugin package ${sanitizedZipName}`);
  } catch (err) {
    console.error("Build failure:", err.message || err);
    process.exit(1);
  }
}

build();
