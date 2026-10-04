// Renders tools/intro/intro.html frame by frame with Playwright into demo-out/intro-frames/*.png,
// then ffmpeg joins them with the sound from intro_audio.py into demo-out/intro.mp4 (1920x1080, 30 fps).
// Usage: node tools/intro/render_intro.mjs [--preview t]   (--preview writes one PNG at time t and exits)

import { chromium } from 'playwright';
import { mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';

const FPS = 30;
const OUT = 'demo-out';
const FRAMES = `${OUT}/intro-frames`;
const previewAt = process.argv.includes('--preview') ? Number(process.argv[process.argv.indexOf('--preview') + 1] || 2) : null;

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + resolve('tools/intro/intro.html'));
await page.waitForTimeout(300);
const duration = await page.evaluate(() => window.DURATION);

if (previewAt !== null) {
  await page.evaluate(t => window.seek(t), previewAt);
  await page.screenshot({ path: `${OUT}/intro-preview-${previewAt}.png` });
  console.log(`preview at ${previewAt}s -> ${OUT}/intro-preview-${previewAt}.png`);
  await browser.close();
  process.exit(0);
}

await rm(FRAMES, { recursive: true, force: true });
await mkdir(FRAMES, { recursive: true });
const n = Math.round(duration * FPS);
for (let i = 0; i < n; i++) {
  await page.evaluate(t => window.seek(t), i / FPS);
  await page.screenshot({ path: `${FRAMES}/${String(i).padStart(4, '0')}.png`, type: 'png' });
}
await browser.close();
console.log(`rendered ${n} frames (${duration} s)`);

const audio = `${OUT}/intro-audio.wav`;
const args = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', `${FRAMES}/%04d.png`];
if (existsSync(audio)) args.push('-i', audio);
else args.push('-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo');
args.push('-t', String(duration), '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '2', '-shortest', '-movflags', '+faststart', `${OUT}/intro.mp4`);
execFileSync('ffmpeg', args, { stdio: 'inherit' });
await rm(FRAMES, { recursive: true, force: true });
console.log(`${OUT}/intro.mp4 ready${existsSync(audio) ? ' (with sound)' : ' (silent: run intro_audio.py first)'}`);
