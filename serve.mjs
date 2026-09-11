import { createServer } from 'node:http';
import { stat, readdir } from 'node:fs/promises';
import { createReadStream } from 'node:fs';
const host = '127.0.0.1';
const port = 4173;
const files = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/index.html', ['index.html', 'text/html; charset=utf-8']],
  ['/assets/Ethan Reel Compressed.mp4', ['assets/Ethan Reel Compressed.mp4', 'video/mp4']],
  ['/assets/EthanMCSmith Resume.pdf', ['assets/EthanMCSmith Resume.pdf', 'application/pdf']],
]);
async function registerShowcaseFolder(folder) {
  for (const file of await readdir(new URL(`${folder}/`, import.meta.url), { withFileTypes: true })) {
    const filename = `${folder}/${file.name}`;
    if (file.isDirectory()) { await registerShowcaseFolder(filename); continue; }
    if (!file.isFile() || !/\.(mp4|png)$/i.test(file.name)) continue;
    files.set(`/${filename}`, [filename, /\.mp4$/i.test(file.name) ? 'video/mp4' : 'image/png']);
  }
}
await registerShowcaseFolder('assets/film showcase assets');
await registerShowcaseFolder('assets/software showcase assets');
await registerShowcaseFolder('assets/testimonials');
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, `http://${host}`).pathname);
    if (pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
    if (!files.has(pathname)) { res.writeHead(404); return res.end('Not found'); }
    if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405, { Allow: 'GET, HEAD' }); return res.end(); }
    const [filename, type] = files.get(pathname);
    const file = new URL(filename, import.meta.url);
    const { size } = await stat(file);
    const headers = { 'Content-Type': type, 'Cache-Control': type.startsWith('text/html') ? 'no-store' : 'private, max-age=3600', 'Accept-Ranges': 'bytes' };
    let start = 0, end = size - 1, status = 200;
    if (req.headers.range) {
      const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
      if (range && (range[1] || range[2])) {
        start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
        end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      } else start = size;
      if (start > end || start >= size) { res.writeHead(416, { ...headers, 'Content-Range': `bytes */${size}` }); return res.end(); }
      status = 206;
      headers['Content-Range'] = `bytes ${start}-${end}/${size}`;
    }
    res.writeHead(status, { ...headers, 'Content-Length': end - start + 1 });
    if (req.method === 'HEAD') return res.end();
    const stream = createReadStream(file, { start, end });
    stream.on('error', () => res.destroy());
    res.on('close', () => stream.destroy());
    stream.pipe(res);
  } catch { if (!res.headersSent) res.writeHead(500); res.end('Unable to serve file'); }
}).listen(port, host, () => console.log(`Local: http://${host}:${port}`));
