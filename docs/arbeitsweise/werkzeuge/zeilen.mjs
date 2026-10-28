// Aufruf: node zeilen.mjs <app> …  – zeigt die Zeilen, die der Wertungs-Scanner in den Apps beanstandet
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { appGruende, ohneKommentare, istMigrationsZeile } from '/home/user/info70/packages/kinderschutz/src/bewertung-stand.mjs';
for (const slug of process.argv.slice(2)) {
  const dir = join('/home/user/info70/apps', slug);
  const dateien = [
    ...(await readdir(dir, { withFileTypes: true })).filter((e) => e.isFile() && /\.(mjs|html|json)$/.test(e.name)).map((e) => e.name),
    ...(await readdir(join(dir, 'daten'), { withFileTypes: true }).catch(() => [])).filter((e) => e.isFile() && e.name.endsWith('.json')).map((e) => `daten/${e.name}`),
  ];
  console.log(`== ${slug}`);
  for (const f of dateien) {
    const text = await readFile(join(dir, f), 'utf8');
    if (!appGruende(f, text).length) continue;
    const zeilen = text.split('\n');
    const js = /\.m?js$/.test(f);
    const q = js ? ohneKommentare(text).split('\n') : zeilen;
    q.forEach((z, i) => {
      if (js && istMigrationsZeile(z)) return;
      if (appGruende(f, z).length) console.log(`${f}: ${z.trim().slice(0, 170)}`);
    });
  }
}
