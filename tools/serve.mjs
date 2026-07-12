// Dev-Server ohne Abhängigkeiten: statische Dateien aus dem Repo-Root.
// Nutzung: node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = Number(process.argv[2] ?? process.env.PORT ?? 8070);

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json',
  '.md': 'text/plain; charset=utf-8',
};

createServer(async (req, res) => {
  try {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405).end('Method Not Allowed');
      return;
    }
    let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    // Pfad-Traversal verhindern: normalisieren und im Root verankern
    path = normalize(path).replace(/^(\.\.[/\\])+/, '');
    let file = join(ROOT, path);
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end('Forbidden');
      return;
    }
    const s = await stat(file).catch(() => null);
    if (s?.isDirectory()) file = join(file, 'index.html');
    const body = await readFile(file);
    res.writeHead(200, {
      'content-type': TYPES[extname(file)] ?? 'application/octet-stream',
      // Gleiche Politik wie im Produktivbetrieb: nur eigene Quellen
      'content-security-policy': "default-src 'self'",
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('404 – nicht gefunden');
  }
}).listen(PORT, async () => {
  console.log(`Dev-Server läuft: http://localhost:${PORT}`);
  const { readdir } = await import('node:fs/promises');
  const apps = await readdir(join(ROOT, 'apps')).catch(() => []);
  console.log(`  Apps: ${apps.map((a) => `/apps/${a}/`).join('  ')}`);
});
