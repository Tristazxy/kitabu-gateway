// Renders every scene of tools/intro/story.html to demo-out/scenes/<id>.mp4 (silent, 1920x1080, 30 fps).
// Usage: node tools/intro/render_scenes.mjs                 (all scenes)
//        node tools/intro/render_scenes.mjs --preview kitchen 3.5   (one PNG at a time, for checking)

import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const FPS = 30;
const OUT = 'demo-out/scenes';
const args = process.argv.slice(2);
const preview = args.includes('--preview') ? { id: args[args.indexOf('--preview') + 1], t: Number(args[args.indexOf('--preview') + 2] || 2) } : null;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve('tools/intro/story.html'));
await page.waitForTimeout(300);
const scenes = await page.evaluate(() => window.SCENES);

if (preview) {
  await page.evaluate(id => window.setScene(id), preview.id);
  await page.evaluate(t => window.seek(t), preview.t);
  const file = `demo-out/scene-${preview.id}-${preview.t}.png`;
  await page.screenshot({ path: file });
  console.log(file);
  await browser.close();
  process.exit(0);
}

for (const [id, duration] of Object.entries(scenes)) {
  const frames = `${OUT}/frames-${id}`;
  await rm(frames, { recursive: true, force: true });
  await mkdir(frames, { recursive: true });
  await page.evaluate(i => window.setScene(i), id);
  const n = Math.round(duration * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.seek(t), i / FPS);
    await page.screenshot({ path: `${frames}/${String(i).padStart(4, '0')}.png`, type: 'png' });
  }
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${frames}/%04d.png`,
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', `${OUT}/${id}.mp4`], { stdio: 'inherit' });
  await rm(frames, { recursive: true, force: true });
  console.log(`scene ${id}: ${n} frames (${duration} s)`);
}
await browser.close();
