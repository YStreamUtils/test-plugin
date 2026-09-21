import fs from 'fs';
import bestzip from 'bestzip';

const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const zipName = `${manifest.name}.zip`;

bestzip({
  source: 'dist/*',
  destination: zipName
})
.then(() => {
  process.exit(0);
})
.catch((err) => {
  process.exit(1);
});
