// Renders the text cards of a story file (kind 'card') to demo-out/cards/<card>.png at 1920x1080:
// the WeKaribu wordmark in Inter over one of the app's own background photos, with the card's lines.
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const storyFile = process.env.STORY || 'tools/story-demo.json';
const story = JSON.parse(await readFile(storyFile, 'utf8'));
const OUT = 'demo-out/cards';
await mkdir(OUT, { recursive: true });
const font = (await readFile('public/fonts/inter-latin-wght-normal.woff2')).toString('base64');
const photo = (await readFile(resolve('..', 'public', 'kitabu', 'bg', 'mountains-wide.jpg'))).toString('base64');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = item => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Inter; font-weight: 100 900; src: url(data:font/woff2;base64,${font}) format('woff2-variations'); }
html, body { margin: 0; width: 1920px; height: 1080px; overflow: hidden; font-family: Inter, system-ui, sans-serif; color: #fff; }
.bg { position: absolute; inset: 0; background: url(data:image/jpeg;base64,${photo}) center/cover; }
.shade { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(14, 36, 26, .86) 0%, rgba(14, 36, 26, .72) 55%, rgba(14, 36, 26, .35) 100%); }
.wrap { position: absolute; inset: 0; padding: 120px 140px; display: flex; flex-direction: column; justify-content: center; }
.brand { font-weight: 800; font-size: 40px; letter-spacing: -0.02em; opacity: .92; margin-bottom: 36px; }
.brand span { display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: #7CE0A6; margin-right: 14px; vertical-align: 4px; }
h1 { font-size: 92px; font-weight: 800; letter-spacing: -0.03em; line-height: 1.02; margin: 0 0 40px; max-width: 1400px; }
.line { font-size: 42px; font-weight: 500; line-height: 1.35; margin: 0 0 14px; max-width: 1380px; color: rgba(255,255,255,.94); }
.line.code { font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace; font-size: 38px; background: rgba(255,255,255,.12); padding: 10px 18px; border-radius: 14px; display: inline-block; }
.foot { position: absolute; left: 140px; right: 140px; bottom: 90px; font-size: 28px; font-weight: 500; color: rgba(255,255,255,.72); }
</style></head><body><div class="bg"></div><div class="shade"></div><div class="wrap">
<div class="brand"><span></span>WeKaribu</div>
<h1>${esc(item.title)}</h1>
${(item.lines || []).map(l => `<p class="line ${/^WK\|/.test(l) ? 'code' : ''}">${esc(l)}</p>`).join('')}
</div><div class="foot">${esc(item.foot || '')}</div></body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
for (const item of story.items.filter(i => i.kind === 'card')) {
  await p.setContent(html(item), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${OUT}/${item.card}.png` });
  console.log('card', item.card);
}
await b.close();
