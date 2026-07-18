import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8'
};

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'no-referrer',
  'cache-control': 'no-store',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'"
};

const isInside = (candidate, root) => candidate === root || candidate.startsWith(`${root}${sep}`);

const sendText = (req, res, status, body) => {
  res.writeHead(status, { ...securityHeaders, 'content-type': 'text/plain; charset=utf-8' });
  res.end(req.method === 'HEAD' ? undefined : body);
};

export const startStaticPrototypeServer = ({ appUrl, port = Number(process.env.PORT || 4173), host = '127.0.0.1' }) => {
  const publicRoot = resolve(fileURLToPath(new URL('./public/', appUrl)));
  const moduleMap = {
    '/shared/index.js': resolve(fileURLToPath(new URL('../../shared-data/src/index.js', import.meta.url))),
    '/shell/render.js': resolve(fileURLToPath(new URL('../../app-shell/src/render.js', import.meta.url))),
    '/shell/styles.css': resolve(fileURLToPath(new URL('../../app-shell/src/styles.css', import.meta.url)))
  };

  const server = createServer(async (req, res) => {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { ...securityHeaders, 'allow': 'GET, HEAD', 'content-type': 'text/plain; charset=utf-8' });
      res.end('Method not allowed');
      return;
    }

    let requestPath;
    try {
      requestPath = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname);
    } catch {
      sendText(req, res, 400, 'Bad request');
      return;
    }

    const filePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
    const absolutePath = moduleMap[requestPath] || resolve(publicRoot, filePath);

    if (!moduleMap[requestPath] && !isInside(absolutePath, publicRoot)) {
      sendText(req, res, 403, 'Forbidden');
      return;
    }

    try {
      const body = await readFile(absolutePath);
      res.writeHead(200, { ...securityHeaders, 'content-type': types[extname(filePath)] || 'application/octet-stream' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch {
      sendText(req, res, 404, 'Not found');
    }
  });

  server.listen(port, host, () => {
    const address = server.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`App running on http://${host}:${actualPort}`);
  });
  return server;
};
