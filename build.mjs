import { readFile, writeFile, mkdir, copyFile, stat, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
const githubPages = process.argv.includes('--github-pages');
const output = githubPages ? 'dist-github-pages' : 'dist';
let html = await readFile('index.html', 'utf8');
if (!html.startsWith('<!DOCTYPE html>') && !html.startsWith('<!doctype html>')) throw new Error('Missing doctype');
let count = 0;
for (const match of html.matchAll(/<script\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/script\s*>/gi)) {
  if (/type="application\/(?:ld\+)?json"/.test(match[1])) { JSON.parse(match[2]); continue; }
  if (/\bsrc=/.test(match[1])) throw new Error('External executable script remains');
  new vm.Script(match[2], { filename: `inline-script-${++count}.js` });
}
if (/rel="stylesheet"/.test(html)) throw new Error('External stylesheet remains');
if (!html.includes('data-ascii-canvas')) throw new Error('Missing ASCII hero');
await mkdir(output, { recursive: true });

await mkdir(`${output}/assets`, { recursive: true });
for (const asset of ['Ethan Reel Compressed.mp4', 'EthanMCSmith Resume.pdf', 'ethanmcsmith portfolio logo.png']) {
  if (githubPages && asset.endsWith('.mp4')) continue;
  await copyFile(`assets/${asset}`, `${output}/assets/${asset}`);
}
const showcase = [
  ['Steel Hearts', 'Steel Hearts Compressed.mp4', 'SteelHeartsThumbnail.png', 14],
  ['The Civilizing Effect', 'The Civilizing Effect H264.mp4', 'TheCivilizingEffectThumbnail2.png', 12],
  ['The Talking Stage', 'The Talking Stage Compressed.mp4', 'TheTalkingStageThumbnail.png', 11],
];
const folder = 'assets/film showcase assets';
await mkdir(`${output}/${folder}`, { recursive: true });
let mediaCount = 0;
for (const [title, video, thumbnail, count] of showcase) {
  const assets = [video, thumbnail, ...Array.from({length: count}, (_, i) => `${title} Still ${i + 1}.png`)];
  for (const asset of assets) {
    if (githubPages && asset.endsWith('.mp4')) continue;
    if (!(await stat(`${folder}/${asset}`)).size) throw new Error(`Empty film asset: ${asset}`);
    await copyFile(`${folder}/${asset}`, `${output}/${folder}/${asset}`);
    mediaCount++;
  }
}
if (githubPages) {
  for (const filename of ['CNAME', '.nojekyll']) await copyFile(filename, `${output}/${filename}`);
}
let softwareCount = 0;
async function copySoftwareScreenshots(folder) {
  await mkdir(`${output}/${folder}`, { recursive: true });
  for (const file of await readdir(folder, { withFileTypes: true })) {
    const filename = `${folder}/${file.name}`;
    if (file.isDirectory()) { await copySoftwareScreenshots(filename); continue; }
    if (!file.isFile() || !/\.png$/i.test(file.name)) continue;
    if (!(await stat(filename)).size) throw new Error(`Empty software screenshot: ${filename}`);
    await copyFile(filename, `${output}/${filename}`);
    softwareCount++;
  }
}
await copySoftwareScreenshots('assets/software showcase assets');
for (const match of html.matchAll(/(?:src|data-src)="(assets\/software%20showcase%20assets\/[^\"]+)"/g)) {
  await stat(decodeURIComponent(match[1]));
}
await copySoftwareScreenshots('assets/testimonials');
// Content-addressed website screenshots bypass stale browser/CDN cache entries.
// Keep original local paths in source; publish byte-identical, versioned PNGs.
if (githubPages) {
  const urls = [...new Set([...html.matchAll(/(assets\/software%20showcase%20assets\/[^"\s,]*Website[^"\s,]*\.png)/g)].map(match => match[1]))];
  for (const url of urls) {
    const filename = decodeURIComponent(url);
    const data = await readFile(filename);
    const hash = createHash('sha256').update(data).digest('hex').slice(0, 12);
    const versioned = filename.replace(/(?:\.[a-f0-9]{12})?\.png$/i, `.${hash}.png`);
    await writeFile(`${output}/${versioned}`, data);
    const versionedURL = versioned.split('/').map(encodeURIComponent).join('/');
    html = html.replaceAll(url, versionedURL);
  }
  console.log(`Versioned ${urls.length} website screenshots by image content.`);
}
await writeFile(`${output}/index.html`, html);

console.log(`Built standalone HTML (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB); validated ${count} inline scripts.`);
console.log(`Copied ${mediaCount} linked film videos, thumbnails, and stills.`);
console.log(`Copied ${softwareCount} linked software screenshots and testimonial portraits, preserving nested folders.`);

if (githubPages) console.log('GitHub Pages output: dist-github-pages; original films and reel stream from existing R2 hosting.');
