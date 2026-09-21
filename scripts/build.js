import esbuild from 'esbuild';
import fs from 'fs';

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));

if (!manifest.name || !manifest.entryPoint || !manifest.className) {
  process.exit(1);
}

try {
  esbuild.buildSync({
    entryPoints: [manifest.entryPoint],
    bundle: true,
    minifySyntax: true,
    minifyWhitespace: true,
    format: 'iife',
    outfile: 'dist/index.js',
  });
} catch (err) {
  process.exit(1);
}
