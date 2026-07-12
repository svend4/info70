import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

const isInside = (candidate, root) => candidate === root || candidate.startsWith(`${root}${sep}`);

export const startStaticPrototypeServer = ({ appUrl, port = Number(process.env.PORT || 4173), host = '127.0.0.1' }) => {
  const publicRoot = resolve(fileURLToPath(new URL('./public/', appUrl)));
  const moduleMap = {
    '/shared/index.js': resolve(fileURLToPath(new URL('../../shared-data/src/index.js', import.meta.url))),
    '/shell/render.js': resolve(fileURLToPath(new URL('../../app-shell/src/render.js', import.meta.url)))
  };

  const server = createServer(async (req, res) => {
    const requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    const filePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const absolutePath = moduleMap[requestPath] || resolve(publicRoot, filePath);

    if (!moduleMap[requestPath] && !isInside(absolutePath, publicRoot)) {
      res.writeHead(403, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Forbidden');
      return;
    }

    try {
      const body = await readFile(absolutePath);
      res.writeHead(200, { 'content-type': types[extname(filePath)] || 'application/octet-stream' });
      res.end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('Not found');
    }
  });

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`App running on http://${host}:${actualPort}`);
  });
  return server;
};
