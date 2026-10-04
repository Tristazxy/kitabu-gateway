// Records a phone-sized walkthrough of the real app with Playwright. It runs in GitHub Actions, where the
// browser can download the real models and run them exactly as a phone browser would.
//
// Phase 1 (not recorded): open the app once, download the shared models and the Italian, German and French
//   packs, then delete the app's own data. The model files stay in the browser cache, like on Noor's phone
//   after the first weekend with Wi-Fi.
// Phase 2 (recorded): a first-time walkthrough of the three roles: host, visitor, tour company.
//
// Output in demo-out/: kitabu-demo.webm, numbered screenshots, chapters.json (captions and the spans where the
// app was busy, which tools/compose_demo.py speeds up and labels as sped up).
// Inputs from tools/demo_assets.py: demo-assets/note-de.png (a printed German note) and demo-assets/voice-fr.wav
// (synthetic French speech). Both are made-up test inputs, not real guests.
// DEMO_MOCK=path/to/module.mjs stubs the CDN libraries for an offline dry run of the clicks (not used in CI).

import { chromium } from 'playwright';
import { mkdir, readdir, rename, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const BASE = process.env.DEMO_URL || 'http://localhost:4173/index.html';
const OUT = 'demo-out';
const PROFILE = 'demo-profile';
const LONG = 15 * 60 * 1000;
const mock = process.env.DEMO_MOCK ? (await import(resolve(process.env.DEMO_MOCK))).default : null;
// A 390x844 phone screen rendered at 2x (CSS zoom), so the recording is a crisp 780x1688.
// (Playwright never upscales the video, so a plain 390-wide viewport would record at 390 px.)
const ZOOM = 2;
const PHONE = {
  viewport: { width: 390 * ZOOM, height: 844 * ZOOM },
  deviceScaleFactor: 1,
  locale: 'en-US',
  timezoneId: 'Africa/Dar_es_Salaam',
  serviceWorkers: mock ? 'block' : 'allow',
};
const zoomScript = `(() => { const z = () => { document.documentElement.style.zoom = '${ZOOM}'; }; if (document.documentElement) z(); document.addEventListener('DOMContentLoaded', z); })();`;

await rm(OUT, { recursive: true, force: true });
await rm(PROFILE, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const log = [];
const watch = (page, tag) => {
  page.on('dialog', d => d.accept());
  page.on('console', m => { if (m.type() === 'error') log.push(`${tag} console: ${m.text()}`); });
  page.on('pageerror', e => log.push(`${tag} pageerror: ${e.message}`));
};

// ------------------------------------------------------------------ phase 1: download models (not recorded)
async function warmUp() {
  const ctx = await chromium.launchPersistentContext(PROFILE, PHONE);
  await ctx.addInitScript(zoomScript);
  if (mock) await mock(ctx);
  const page = ctx.pages()[0] || await ctx.newPage();
  watch(page, 'warm-up');
  try {
  const click = async sel => { await page.locator(sel).first().evaluate(n => n.click()); await page.waitForTimeout(400); };
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await click('[data-action="guide-close"]');
  await click('[data-action="go"][data-screen="more"]');
  await click('[data-action="go"][data-screen="langs"]');
  for (const key of ['topics', 'mood', 'voice']) {
    const sel = `[data-action="download-shared"][data-key="${key}"]`;
    if (!(await page.locator(sel).count())) continue;
    const t = Date.now();
    await click(sel);
    await page.waitForSelector(sel, { state: 'detached', timeout: LONG });
    console.log(`warm-up: ${key} model ready in ${Math.round((Date.now() - t) / 1000)} s`);
  }
  for (const lang of ['it', 'de', 'fr']) {
    const sel = `[data-action="download-pack"][data-lang="${lang}"]`;
    if (!(await page.locator(sel).count())) continue;
    const t = Date.now();
    await click(sel);
    await page.waitForSelector(`[data-action="delete-pack"][data-lang="${lang}"]`, { timeout: LONG });
    console.log(`warm-up: ${lang} pack ready in ${Math.round((Date.now() - t) / 1000)} s`);
  }
  await page.screenshot({ path: `${OUT}/00-warm-up-languages.png` });
  // Delete the app's data (guests, settings, "guide seen"); the model files stay cached.
  await click('[data-action="back"]');
  await click('[data-action="go"][data-screen="more"]');
  await click('[data-action="wipe"]');
  await page.waitForTimeout(1000);
  } finally {
    await ctx.close();
  }
}

// ------------------------------------------------------------------ phase 2: the recorded walkthrough
const chapters = [];
const busySpans = [];
let t0 = 0;
let page;
const now = () => (Date.now() - t0) / 1000;
const chapter = (title, body) => chapters.push({ t: now(), title, body });
const pause = ms => page.waitForTimeout(ms);
let shot = 0;
const snap = name => page.screenshot({ path: `${OUT}/${String(++shot).padStart(2, '0')}-${name}.png` });

// The app is busy (OCR, translation, analysis): the composer speeds these spans up and says so on screen.
async function busy(fn) {
  const a = now();
  try { return await fn(); } finally { busySpans.push([a, now()]); }
}

// Show a tap ring where a finger would press, so viewers can follow.
async function ring(el) {
  const box = await el.boundingBox();
  if (box) await page.evaluate(([x, y]) => window.__tap?.(x, y), [(box.x + box.width / 2) / ZOOM, (box.y + box.height / 2) / ZOOM]);
}
async function show(selector, wait = 600) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: 'attached', timeout: LONG });
  await el.evaluate(n => n.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  await pause(wait);
  return el;
}
async function tap(selector, wait = 600) {
  const el = await show(selector, wait);
  await ring(el);
  await pause(280);
  await el.evaluate(n => n.click());
  await pause(650);
}
async function type(selector, text) {
  const el = await show(selector, 350);
  await ring(el);
  await el.focus();
  await page.keyboard.type(text, { delay: 26 });
  await pause(250);
}
async function choose(selector, value) {
  const el = await show(selector, 350);
  await ring(el);
  await pause(250);
  await page.selectOption(selector, value);
  await pause(700);
}
async function upload(labelText, inputSelector, file) {
  const label = page.locator('label', { has: page.locator(inputSelector) }).first();
  await label.evaluate(n => n.scrollIntoView({ block: 'center', behavior: 'smooth' }));
  await pause(600);
  await ring(label);
  await pause(400);
  await page.setInputFiles(inputSelector, file);
  log.push(`uploaded ${file} via "${labelText}"`);
}
async function scrollBy(px, ms = 1400) {
  await page.evaluate(y => window.scrollBy({ top: y, behavior: 'smooth' }), px);
  await pause(ms);
}
async function scrollTo(selector, block = 'start', ms = 1500) {
  await page.locator(selector).first().evaluate((n, b) => n.scrollIntoView({ block: b, behavior: 'smooth' }), block);
  await pause(ms);
}
async function top(ms = 800) { await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await pause(ms); }
const exists = async sel => (await page.locator(sel).count()) > 0;

async function toHome() {
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await pause(800);
  if (await exists('[data-action="visitor-exit"]')) await tap('[data-action="visitor-exit"]');
  if (await exists('[data-action="guide-close"]')) await tap('[data-action="guide-close"]');
  if (await exists('[data-action="back"]')) await tap('[data-action="back"]');
}

// Each part continues even if an earlier one failed, so one run shows everything that works.
const results = [];
async function part(name, fn) {
  const t = Date.now();
  try {
    await fn();
    results.push(`ok   ${name} (${Math.round((Date.now() - t) / 1000)} s)`);
  } catch (err) {
    results.push(`FAIL ${name}: ${err.message.split('\n')[0]}`);
    await snap(`failed-${name}`).catch(() => {});
    await toHome().catch(e => results.push(`     reset failed: ${e.message.split('\n')[0]}`));
  }
}

async function walkthrough() {
  const ctx = await chromium.launchPersistentContext(PROFILE, { ...PHONE, recordVideo: { dir: OUT, size: PHONE.viewport } });
  t0 = Date.now();
  await ctx.addInitScript(zoomScript);
  if (mock) await mock(ctx);
  await ctx.addInitScript(() => {
    // Phones show their own system font; on the Linux runner use Noto Sans (in the app's font list) rather
    // than the runner's default DejaVu Sans.
    const font = () => {
      const s = document.createElement('style');
      s.textContent = 'body{font-family:"Noto Sans",system-ui,sans-serif !important}';
      document.head.appendChild(s);
    };
    if (document.head) font(); else document.addEventListener('DOMContentLoaded', font);
    window.__tap = (x, y) => {
      const d = document.createElement('div');
      d.style.cssText = `position:fixed;left:${x - 24}px;top:${y - 24}px;width:48px;height:48px;border-radius:50%;`
        + 'background:rgba(36,83,63,.25);border:3px solid rgba(36,83,63,.8);z-index:2147483647;pointer-events:none;'
        + 'transition:transform .45s ease-out,opacity .45s ease-out;';
      document.documentElement.appendChild(d);
      setTimeout(() => { d.style.transform = 'scale(1.7)'; d.style.opacity = '0'; }, 260);
      setTimeout(() => d.remove(), 800);
    };
  });
  page = ctx.pages()[0] || await ctx.newPage();
  watch(page, 'demo');

  try {
    await part('guide', async () => {
      await page.goto(BASE, { waitUntil: 'networkidle' });
      chapter('Kitabu cha Wageni', 'A small AI guestbook for Noor, who runs coffee tours on her family farm in the Tanzanian highlands. Guests write in their own language; Noor hears it in Swahili.');
      await pause(5000);
      await snap('guide-1');
      chapter('A three-step guide', 'Opens by itself the first time. The whole app is one home screen; everything else is one tap away.');
      await tap('[data-action="guide-next"]', 150);
      await pause(4500);
      await snap('guide-2');
      await tap('[data-action="guide-next"]', 150);
      await pause(2500);
    });

    await part('example', async () => {
      chapter('Try one example', 'An invented English-speaking guest. On the phone, the AI splits the feedback into sentences, matches each to a fixed list of 10 topics, and reads the mood.');
      await tap('[data-action="guide-try"]');
      await busy(() => page.waitForSelector('.big-summary', { timeout: LONG }));
      chapter('The home screen', 'What guests said, in two lines, and the four things Noor does: add feedback, hand the phone to a guest, thank guests, see next week.');
      await pause(5000);
      await snap('home-example');
      chapter('Noor’s phone shows it in Swahili', 'The interface follows the phone’s language. The summary is built from human-written Swahili sentences; the AI only fills in counts and topic names. “Sikiliza” reads it aloud.');
      await tap('[data-action="toggle-lang"]');
      await pause(3500);
      await snap('home-swahili');
      // "Listen" plays the recorded Swahili clips; skip it when the clips have not been generated yet.
      const voiceReady = await page.evaluate(async () => {
        try { const m = await (await fetch('audio/sw/manifest.json')).json(); return Object.keys(m.files || {}).length > 0; } catch { return false; }
      });
      if (voiceReady) { await tap('[data-action="speak"]', 300); await pause(4000); }
      await tap('[data-action="toggle-lang"]');
      await pause(800);
      chapter('Details: what guests said', 'Each topic keeps the guests’ own words. Anything the AI is unsure about is marked “Check” for a person to look at.');
      await tap('[data-action="go"][data-screen="summary"]');
      await pause(2500);
      await snap('summary-example');
      await scrollTo('details.quotes', 'center', 1200);
      await tap('details.quotes summary', 300);
      await pause(3000);
      await scrollBy(450);
      await scrollBy(450);
      await pause(1200);
      await top();
      await tap('[data-action="back"]');
    });

    await part('thank-you', async () => {
      await tap('[data-action="go"][data-screen="guests"]');
      chapter('Thank the guest in their language', 'A human-written message in the guest’s language, with its meaning underneath. Noor sends it herself, and only if the guest agreed.');
      await tap('[data-action="toggle-draft"]');
      await scrollTo('.list li', 'start', 1500);
      await pause(3500);
      await snap('thank-you');
      await top();
      await tap('[data-action="back"]');
    });

    await part('visitor', async () => {
      chapter('Hand the phone to a guest', 'The visitor screen speaks 8 languages. Giulia writes in Italian, ticks that she would buy coffee, and agrees to be contacted.');
      await tap('[data-action="hand-to-guest"]');
      await pause(1500);
      await tap('[data-action="visitor-lang"][data-lang="it"]');
      await pause(1000);
      await type('#v-name', 'Giulia');
      await type('#v-liked', 'Tostare e macinare il caffè con la famiglia è stato bellissimo. Il pranzo era delizioso.');
      await type('#v-improve', 'La strada per arrivare era difficile. Vorrei comprare del caffè da portare a casa.');
      await tap('#v-buy-coffee', 300);
      await type('#v-email', 'giulia@example.com');
      await tap('#v-consent', 300);
      await snap('visitor-italian');
      await tap('[data-action="visitor-save"]');
      await pause(3000);
      await snap('visitor-done');
      await tap('[data-action="visitor-exit"]');
    });

    await part('analyse-italian', async () => {
      chapter('Analysed on the phone', 'Italian → English with a translation model on the phone (about 130 MB, downloaded once), then topics and mood. The feedback never leaves the phone.');
      await pause(1500);
      await tap('[data-action="analyze-pending"]');
      await busy(() => page.waitForFunction(() => !document.querySelector('[data-action="analyze-pending"]') && !document.querySelector('.busy:not(.hidden)'), null, { timeout: LONG }));
      chapter('Two guests now', 'Giulia’s wish to buy coffee is counted under products, so Noor (and, if she agrees, the tour company) can see the demand.');
      await pause(4500);
      await snap('home-two-guests');
    });

    await part('photo', async () => {
      await tap('[data-action="go"][data-screen="add"]');
      chapter('A photo of the paper guestbook', 'Lukas wrote in German in box A (what he liked). The text reader on the phone reads the photo; words it is unsure of are shown in yellow for the helper to fix.');
      await type('#ng-name', 'Lukas');
      await choose('#ng-lang', 'de');
      await tap('[data-action="save-new-guest"]');
      await pause(1200);
      await upload('Photo of box A', 'input[data-file="photo-liked"]', 'demo-assets/note-de.png');
      await busy(() => page.waitForFunction(() => {
        const t = document.querySelector('textarea[data-input="input-text"]');
        return (t && t.value.trim().length > 10) || document.querySelector('.notice.neg');
      }, null, { timeout: LONG }));
      if (await exists('.notice.neg')) throw new Error(`OCR failed: ${await page.locator('.notice.neg').first().innerText()}`);
      await scrollTo('.preview-img', 'start', 1500);
      await pause(3000);
      await snap('photo-ocr');
      await scrollTo('textarea[data-input="input-text"]', 'center', 2500);
      await tap('[data-action="run-analysis"]');
      await busy(() => page.waitForSelector('[data-action="finish-add"]', { timeout: LONG }));
      chapter('Results to check', 'Each sentence shows the original, the English, a topic and a mood. A person can correct any label or press “OK”.');
      await pause(4000);
      await snap('photo-results');
      await scrollBy(450);
      await pause(1500);
      await tap('[data-action="finish-add"]');
      await pause(1500);
      await tap('[data-action="back"]');
    });

    await part('voice', async () => {
      await tap('[data-action="go"][data-screen="add"]');
      chapter('A voice message', 'Sophie left a voice message in French. Whisper (about 77 MB, on the phone) writes it down and translates it to English.');
      await type('#ng-name', 'Sophie');
      await choose('#ng-lang', 'fr');
      await tap('[data-action="save-new-guest"]');
      await pause(1000);
      await upload('Upload an audio file', 'input[data-file="audio"]', 'demo-assets/voice-fr.wav');
      await busy(() => page.waitForFunction(() => {
        const t = document.querySelector('textarea[data-input="input-english"]');
        return (t && t.value.trim().length > 5) || document.querySelector('.notice.neg');
      }, null, { timeout: LONG }));
      if (await exists('.notice.neg')) throw new Error(`voice failed: ${await page.locator('.notice.neg').first().innerText()}`);
      await scrollTo('audio', 'start', 1500);
      await pause(3500);
      await snap('voice');
      await tap('[data-action="run-analysis"]');
      await busy(() => page.waitForSelector('[data-action="finish-add"]', { timeout: LONG }));
      await pause(3500);
      await snap('voice-results');
      await tap('[data-action="finish-add"]');
      chapter('Four guests, four languages', 'What guests loved, what to improve, and what they wanted to buy. At the bottom: an anonymous report for the tour company, shared only if Noor agrees.');
      await pause(3500);
      await scrollBy(500);
      await scrollBy(500);
      await scrollBy(500);
      await pause(1500);
      await top();
      await tap('[data-action="back"]');
    });

    await part('company', async () => {
      chapter('The tour company sends a booking', 'The app writes a short Swahili SMS for Noor’s basic phone; the company sends it from its own phone. No internet needed on Noor’s side.');
      await tap('[data-action="go"][data-screen="company"]');
      await type('#c-phone', '+255 700 000 000');
      await choose('#c-lang', 'pl');
      await type('#c-name', 'Anna K.');
      await type('#c-guide', 'Juma');
      await page.locator('#c-guide').evaluate(n => n.dispatchEvent(new Event('change', { bubbles: true })));
      await scrollTo('#c-sms', 'center', 1500);
      await pause(3500);
      await snap('company-sms');
      await tap('[data-action="company-save"]');
      await pause(1500);
      await top();
      await tap('[data-action="back"]');
    });

    await part('next-week', async () => {
      chapter('Next week, and the languages to prepare', 'Polish guests are booked in 3 days, so the app asks to download Polish while the helper has Wi-Fi. Rare languages can be deleted afterwards.');
      await pause(2000);
      await tap('[data-action="go"][data-screen="week"]');
      await pause(2500);
      await scrollTo('.list', 'center', 2500);
      await snap('next-week');
      await scrollBy(450);
      await pause(2000);
      await top();
      await tap('[data-action="go"][data-screen="langs"]');
      chapter('Language packs on the phone', 'Swahili and English are built in. The 3 most common guest languages stay; others are downloaded before a visit and can be deleted afterwards.');
      await pause(2500);
      await scrollBy(500);
      await scrollBy(500);
      await snap('languages');
      await pause(1000);
      await top();
      await tap('[data-action="back"]');
    });

    await part('end', async () => {
      chapter('Kitabu cha Wageni', 'Try it: kitabu-cha-wageni.lovable.app\nCode: github.com/Tristazxy/kitabu-gateway');
      await pause(5000);
    });
  } finally {
    const end = now();
    const video = page.video();
    await ctx.close();
    if (video) await rename(await video.path(), `${OUT}/kitabu-demo.webm`);
    await writeFile(`${OUT}/chapters.json`, JSON.stringify({ chapters, busy: busySpans, end }, null, 2));
  }
}

let failed = false;
try {
  if (!process.env.DEMO_SKIP_WARMUP) await warmUp();
  await walkthrough();
} catch (err) {
  failed = true;
  log.push(`FATAL: ${err.stack || err.message}`);
}
console.log(results.join('\n'));
console.log(log.length ? log.join('\n') : 'no browser errors');
console.log((await readdir(OUT)).join('\n'));
await writeFile(`${OUT}/log.txt`, [...results, '', ...log].join('\n'));
if (failed || results.some(r => r.startsWith('FAIL'))) process.exitCode = 1;
