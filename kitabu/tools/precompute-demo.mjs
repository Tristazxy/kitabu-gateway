// Runs the app's own on-device pipeline (same code as the phone, same models) over the synthetic
// example data once, in GitHub Actions, and saves the results. The app then shows the example
// instantly, without downloading models first; new feedback is still analysed live on the phone.

import * as T from '@huggingface/transformers';
import { readFile, writeFile } from 'node:fs/promises';
import { setTransformers } from '../src/ai.js';
import { analyze } from '../src/pipeline.js';

T.env.allowLocalModels = false;
T.env.cacheDir = process.env.MODEL_CACHE || '.cache/models';
setTransformers(T);

const demo = JSON.parse(await readFile('public/data/demo.json', 'utf8'));
const QUICK = {
  liked: 'Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.',
  improve: 'The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale.',
};
const jobs = [];
for (const g of demo.guests) for (const box of ['liked', 'improve']) if (g[box]) jobs.push({ id: `${g.id}_${box}`, original: g[box], lang: g.language, box });
for (const box of ['liked', 'improve']) jobs.push({ id: `demo_quick_${box}`, original: QUICK[box], lang: 'en', box });

const entries = {};
for (const j of jobs) {
  const t0 = Date.now();
  const res = await analyze({ original: j.original, lang: j.lang, box: j.box });
  entries[j.id] = { ...res, precomputed: true };
  console.log(j.id, j.lang, res.status, res.sentences.length, 'sentences', `${((Date.now() - t0) / 1000).toFixed(1)}s`);
}
const out = {
  _note: 'Results of the app\'s own on-device pipeline (src/pipeline.js) on the SYNTHETIC example data, run in GitHub Actions so the example opens instantly. Same models and thresholds as the phone.',
  generated: new Date().toISOString(),
  entries,
};
await writeFile('public/data/demo-analysed.json', JSON.stringify(out, null, 1));
console.log('wrote', Object.keys(entries).length, 'entries');
