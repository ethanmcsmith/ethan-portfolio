import { readFile, mkdir, copyFile, stat, readdir } from 'node:fs/promises';
import vm from 'node:vm';
const githubPages = process.argv.includes('--github-pages');
const output = githubPages ? 'dist-github-pages' : 'dist';
const html = await readFile('index.html', 'utf8');
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
await copyFile('index.html', `${output}/index.html`);
await mkdir(`${output}/assets`, { recursive: true });
for (const asset of ['Ethan Reel Compressed.mp4', 'EthanMCSmith Resume.pdf']) {
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
console.log(`Built standalone HTML (${(Buffer.byteLength(html)/1024/1024).toFixed(2)} MB); validated ${count} inline scripts.`);
console.log(`Copied ${mediaCount} linked film videos, thumbnails, and stills.`);
console.log(`Copied ${softwareCount} linked software screenshots and testimonial portraits, preserving nested folders.`);

if (githubPages) console.log('GitHub Pages output: dist-github-pages; original films and reel stream from existing R2 hosting.');
