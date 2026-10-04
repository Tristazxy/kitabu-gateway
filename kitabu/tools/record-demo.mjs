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
  await click('[data-role="host"]');
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
  // Delete the app's data; the model files stay cached. Then seed the story: the host already has a
  // season of analysed feedback (the synthetic example guests), so the visitor side has something to show.
  await click('[data-action="back"]');
  await click('[data-action="go"][data-screen="more"]');
  await click('[data-action="wipe"]');
  await page.waitForTimeout(1000);
  await click('[data-role="host"]');
  await click('[data-action="guide-close"]');
  await click('[data-action="go"][data-screen="more"]');
  await click('[data-action="load-demo"]');
  await page.waitForTimeout(800);
  await click('[data-action="analyze-pending"]');
  await page.waitForFunction(() => !document.querySelector('[data-action="analyze-pending"]') && !document.querySelector('.busy:not(.hidden)'), null, { timeout: LONG });
  console.log('warm-up: example guests analysed');
  await click('[data-action="switch-role"]');
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
  if (await exists('body.mode-company [data-action="switch-role"], .home-btn[data-role]') && !(await exists('[data-role="host"]'))) await tap('[data-action="switch-role"]');
  if (await exists('[data-role="host"]')) await tap('[data-role="host"]');
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
        + 'background:rgba(91,58,36,.25);border:3px solid rgba(91,58,36,.8);z-index:2147483647;pointer-events:none;'
        + 'transition:transform .45s ease-out,opacity .45s ease-out;';
      document.documentElement.appendChild(d);
      setTimeout(() => { d.style.transform = 'scale(1.7)'; d.style.opacity = '0'; }, 260);
      setTimeout(() => d.remove(), 800);
    };
  });
  page = ctx.pages()[0] || await ctx.newPage();
  watch(page, 'demo');

  try {
    await part('find', async () => {
      await page.goto(BASE, { waitUntil: 'networkidle' });
      await pause(1500);
      await tap('[data-role="visitor"]');
      await pause(1500);
      chapter('Find a place', 'Visitors search a village or a name. Small hosts with no website appear with counts-only feedback and the days they can take guests, which they publish a week ahead.');
      await type('#find-q', 'Materuni');
      await pause(1800);
      await snap('find');
      await tap('[data-action="open-host"]');
      await pause(2500);
      await snap('host');
      await scrollTo('[data-action="book-day"]', 'center', 2200);
    });

    await part('book', async () => {
      chapter('Book a visit', 'Saturday, two guests, English. “Who told you about this place?” links the booking to a past guest. The request goes to the tour company; no payment here.');
      await tap('[data-action="book-day"]');
      await type('#bk-v-name', 'Vivian & Frank');
      await type('#bk-v-ref', 'Emma');
      await pause(1500);
      await type('#bk-v-email', 'vivian@example.com');
      await tap('#bk-v-consent', 300);
      await snap('book-form');
      await tap('[data-action="book-submit"]');
      await pause(3500);
      await snap('booked');
    });

    await part('company', async () => {
      await tap('[data-action="switch-role"]');
      await pause(1000);
      await tap('[data-role="company"]');
      chapter('Confirmed: an SMS for a basic phone', 'The tour company sees the request, confirms it, and sends the host a plain SMS from its own phone. No internet needed on the host’s side.');
      await pause(1500);
      await tap('[data-action="company-confirm"]');
      await pause(1200);
      await scrollTo('.sms', 'center', 1500);
      await pause(3000);
      await snap('company-sms');
      await top();
      await tap('[data-action="switch-role"]');
      await pause(800);
      await tap('[data-role="host"]');
      if (await exists('[data-action="guide-close"]')) await tap('[data-action="guide-close"]');
    });

    await part('host-week', async () => {
      chapter('Next week, on the helper’s phone', 'The booking is in next week’s list with the language pack already on the phone. Rare languages are downloaded before a visit and deleted afterwards.');
      await pause(1500);
      await tap('[data-action="go"][data-screen="week"]');
      await pause(1500);
      await scrollTo('.list', 'center', 2000);
      await snap('host-week');
      await scrollBy(450);
      await pause(2000);
      await top();
      await tap('[data-action="back"]');
    });

    await part('visitor-write', async () => {
      chapter('Vivian writes on Noor’s phone', 'The host hands over the phone. The screen is in the guest’s language: what they liked, what could be better, what they would buy, and a consent tick.');
      await tap('[data-action="hand-to-guest"]');
      await pause(1500);
      if (await exists('[data-action="visitor-lang"][data-lang="en"]')) await tap('[data-action="visitor-lang"][data-lang="en"]', 300);
      await type('#v-name', 'Vivian');
      await type('#v-liked', 'Roasting and grinding the coffee with Noor’s family was the best morning of our trip. The lunch was delicious.');
      await type('#v-improve', 'The road up was hard to find. We would have bought a bag of beans to take home.');
      await tap('#v-buy-coffee', 300);
      await type('#v-email', 'vivian@example.com');
      await tap('#v-consent', 300);
      await snap('visitor-write');
      await tap('[data-action="visitor-save"]');
      await pause(2500);
      await tap('[data-action="visitor-exit"]');
    });

    await part('photo', async () => {
      await tap('[data-action="go"][data-screen="add"]');
      chapter('A photo of the guestbook', 'Lukas wrote in German in box A. A text reader on the phone reads the photo; words it is unsure of are shown in yellow for a helper to fix.');
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
      await pause(2500);
      await snap('photo-ocr');
      await tap('[data-action="run-analysis"]');
      await busy(() => page.waitForSelector('[data-action="finish-add"]', { timeout: LONG }));
      await pause(3000);
      await snap('photo-results');
      await tap('[data-action="finish-add"]');
      await pause(800);
      await tap('[data-action="back"]');
    });

    await part('voice', async () => {
      await tap('[data-action="go"][data-screen="add"]');
      chapter('A voice note', 'Sophie left a voice message in French. Whisper, on the phone, writes it down and translates it to English.');
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
      await pause(2500);
      await snap('voice');
      await tap('[data-action="run-analysis"]');
      await busy(() => page.waitForSelector('[data-action="finish-add"]', { timeout: LONG }));
      await pause(2500);
      await tap('[data-action="finish-add"]');
      await pause(800);
      await tap('[data-action="back"]');
    });

    await part('weekend', async () => {
      chapter('The week, in Swahili', 'The helper taps Analyse. Translation, topics and mood run on the phone. The summary is human-written Swahili with the AI’s counts filled in; “Sikiliza” reads it aloud with recorded clips.');
      await pause(800);
      if (await exists('[data-action="analyze-pending"]')) {
        await tap('[data-action="analyze-pending"]');
        await busy(() => page.waitForFunction(() => !document.querySelector('[data-action="analyze-pending"]') && !document.querySelector('.busy:not(.hidden)'), null, { timeout: LONG }));
      }
      await pause(2500);
      await snap('home-week');
      await tap('[data-action="toggle-lang"]');
      await pause(2500);
      await snap('home-swahili');
      const voiceReady = await page.evaluate(async () => {
        try { const m = await (await fetch('audio/sw/manifest.json')).json(); return Object.keys(m.files || {}).length > 0; } catch { return false; }
      });
      if (voiceReady) { await tap('[data-action="speak"]', 300); await pause(5000); }
      await tap('[data-action="toggle-lang"]');
      await pause(600);
    });

    await part('details', async () => {
      chapter('Check what the AI was unsure about', 'Each topic keeps the guests’ own words. Sentences the model is unsure about are marked “Check”, with a one-tap correction.');
      await tap('[data-action="go"][data-screen="summary"]');
      await pause(2000);
      await snap('summary');
      await scrollTo('details.quotes', 'center', 1200);
      await tap('details.quotes summary', 300);
      await pause(2500);
      await scrollBy(500);
      await scrollBy(500);
      await pause(1200);
      await top();
      await tap('[data-action="back"]');
    });

    await part('thanks', async () => {
      chapter('A thank-you for Vivian', 'A human-written note in the guest’s language, with its meaning underneath. Sent only with consent, and only when the host taps send.');
      await tap('[data-action="go"][data-screen="guests"]');
      await pause(1200);
      await tap('[data-action="toggle-draft"]');
      await scrollTo('.list li', 'start', 1500);
      await pause(3500);
      await snap('thank-you');
      await top();
      await tap('[data-action="back"]');
    });

    await part('report', async () => {
      chapter('A report for the tour company', 'Counts only: how many guests, what they liked, what to improve, what they wanted to buy. No names, no quotes. Shared only if the host agrees.');
      await tap('[data-action="go"][data-screen="summary"]');
      await pause(800);
      await scrollTo('#report-text', 'center', 1800);
      await pause(1500);
      await tap('input[data-change="share-ok"]', 300);
      await pause(2500);
      await snap('report');
      await top();
      await tap('[data-action="back"]');
    });

    await part('languages', async () => {
      chapter('Our take on localising AI', 'Models stay language-agnostic (English pivot); every word a person reads is human-written in their language. Swahili and English are built in; guest packs come and go; Chagga is not pretended.');
      await tap('[data-action="go"][data-screen="more"]');
      await tap('[data-action="go"][data-screen="langs"]');
      await pause(2500);
      await scrollBy(500);
      await scrollBy(500);
      await snap('languages');
      await pause(1500);
      await top();
      await pause(800);
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
