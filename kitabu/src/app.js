// WeKaribu — main app: state, screens, actions.
// One home screen; every other screen is one tap away and has a back button.
// The interface shows one language at a time (Swahili or English, following the phone; toggle at the top).

import { db, uid } from './db.js';
import { LANGS, SHARED_MODELS, PACK_MB, packLangs, planPacks, langName, KEEP_TOP_N } from './langs.js';
import { TOPICS, OTHER, topicById, PRODUCTS } from './topics.js';
import { weeklySms, summaryText, thankYou, guideReport, daySw, dayEn, SUBJECTS, bookingSms, touristSms, strongProduct, parseWkCode, requestSms, availabilitySms, reportSms } from './templates.js';
import { summarize, inPeriod, guestTopLiked, needsCheck } from './summary.js';
import * as ai from './ai.js';
import { analyze } from './pipeline.js';
import { h, L, getLang, setLang, host, setHost, toast, showBusy, progress, hideBusy, speak, isoDate, dayStamp, addDays, daysFromToday, copyText } from './ui.js';
import { summaryClipIds, playClips, prefetchVoice, loadVoiceManifest, sayLabel } from './voice.js';
import { guideHTML, GUIDE_STEPS } from './guide.js';
import { roleChooserHTML, visitorHTML, companyHTML, pickVisitorLang, visitorStrings } from './roles.js';
import { findHTML, hostHTML, tripHTML, hostDays, hostSummaryLine, rankHosts } from './visit.js';
import { mountBackground, currentScene, sceneCredit, allCredits, toggleMotion, motionOn, setOffline } from './nature.js';

const view = document.getElementById('view');

const freshAdd = () => ({ step: 1, guestId: null, inputs: [], results: [], newLang: 'en' });

const state = {
  screen: 'home',      // choose | home | add | summary | guests | week | langs | more | visitor | company
  role: null,          // null (not chosen yet) | host | visitor | company — remembered on this phone
  guests: [],
  entries: [],
  bookings: [],
  messages: [],
  installed: [],
  shared: { voice: false, topics: false, mood: false },
  online: navigator.onLine,
  forceOffline: false, // the Offline button: work as if there were no internet (SMS, on-phone AI, no video)
  period: 'month',
  add: freshAdd(),
  recording: false,
  lastSync: null,
  shareOk: false,
  openGuest: null,
  guide: { open: false, step: 0 },
  visitor: { lang: 'en', saved: false, draft: {} },
  hosts: null,           // directory from data/hosts.json (loaded on first use)
  find: { q: '', ranked: null, semantic: null, thinking: false },
  phrasebook: { phrases: null, saved: false, audioReady: false },
  translate: { lang: 'it', text: '', result: '' },
  cloud: { uploads: [] },
  book: { hostId: null, day: null, form: {}, done: null },
  availableDays: [],     // days the host published (ISO dates)
};

// ---------------------------------------------------------------- data
async function loadAll() {
  const [g, e, b, m] = await Promise.all(['guests', 'entries', 'bookings', 'messages'].map(s => db.all(s)));
  Object.assign(state, { guests: g, entries: e, bookings: b, messages: m });
  state.lastSync = await db.getSetting('lastSync');
  state.role = await db.getSetting('role', null);
  state.availableDays = await db.getSetting('availableDays', []);
  state.cloud.uploads = await db.getSetting('cloudUploads', []);
  state.cloud.queue = await db.getSetting('cloudQueue', []);
  state.forceOffline = await db.getSetting('forceOffline', false);
  state.online = isOnline();
  setOffline(!state.online);
  state.hostDaysBySms = await db.getSetting('hostDaysBySms', {});
  setHost(await db.getSetting('hostName', 'Noor'));
  document.documentElement.classList.toggle('big-text', await db.getSetting('bigText', false));
}

async function refreshModels() {
  try {
    state.installed = await ai.installedPacks();
    for (const k of Object.keys(SHARED_MODELS)) state.shared[k] = await ai.isModelCached(SHARED_MODELS[k].id);
  } catch (err) {
    console.warn('model check failed', err);
  }
}

const guestById = id => state.guests.find(g => g.id === id);
const currentGuest = () => guestById(state.add.guestId);

function currentPlan() {
  return planPacks({ guests: state.guests, bookings: state.bookings, installed: state.installed, today: new Date() });
}

function currentSummary() {
  const entries = state.entries.filter(e => e.status !== 'pending' && inPeriod(e.visitDate || e.createdAt, state.period));
  const s = summarize(entries, state.guests);
  return { s, entries, text: summaryText(s, host()) };
}

// ---------------------------------------------------------------- small render helpers
const day = date => (getLang() === 'sw' ? daySw(date) : dayEn(date));
const tName = id => topicById(id)[getLang()].split(' (')[0];
const langPill = code => `<span class="chip plain lang-pill" title="${h(LANGS[code]?.native || code)}">${h(langName(code, getLang()))}</span>`;

function moodChip(m) {
  if (m === 'pos') return `<span class="chip">${FACE.pos} ${L('Nzuri', 'Positive')}</span>`;
  if (m === 'neg') return `<span class="chip neg">${FACE.neg} ${L('Ya kuboresha', 'To improve')}</span>`;
  return `<span class="chip warn">${FACE.unsure} ${L('Haijulikani', 'Unsure')}</span>`;
}

function consentChip(g) {
  return g.consent
    ? `<span class="chip">${L('Ameruhusu mawasiliano', 'May be contacted')}</span>`
    : `<span class="chip plain">${L('Hakuna ruhusa', 'No consent')}</span>`;
}

function packChip(code) {
  if (!LANGS[code]?.mt) return '';
  return state.installed.includes(code)
    ? `<span class="chip">${L('Lugha iko tayari', 'Pack ready')}</span>`
    : `<span class="chip warn">${L('Pakua lugha', 'Pack needed')}</span>`;
}

const FLAG_TEXT = {
  'topic-unsure': ['Mada haijulikani', 'Topic unclear'],
  'conflict': ['Inapingana na kisanduku alichoandika', 'Contradicts the box it was written in'],
  'low-confidence': ['Hisia hazijulikani', 'Mood unclear'],
  'no-model': ['Hakuna modeli ya hisia', 'No sentiment model'],
  'fallback-pack': ['Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)', 'Translated with the other-language pack (lower quality)'],
};
const flagText = f => FLAG_TEXT[f][getLang() === 'sw' ? 0 : 1];

function langOptions(selected) {
  const lang = getLang();
  return Object.entries(LANGS)
    .map(([c, l]) => `<option value="${c}" ${c === selected ? 'selected' : ''}>${h(l[lang])}${l.native !== l[lang] ? ` (${h(l.native)})` : ''}</option>`)
    .join('');
}

function topicOptions(selected) {
  return [...TOPICS, OTHER]
    .map(t => `<option value="${t.id}" ${t.id === selected ? 'selected' : ''}>${h(t[getLang()])}</option>`)
    .join('');
}

const backBtn = () => `<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${L('Nyumbani', 'Home')}</button>`;

// A small speaker that reads a label aloud (Swahili clip, or the phone's voice). For people who prefer to listen.
const ICON_SPEAKER = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';
const sayBtn = (clipId, sw, en) => `<button class="say" data-action="say" data-clip="${clipId}" data-sw="${h(sw)}" data-en="${h(en)}" aria-label="${L('Sikiliza', 'Listen')}">${ICON_SPEAKER}</button>`;
const FACE = { pos: '😊', neg: '😟', unsure: '🤔' };

// One analyzed sentence with its labels and the controls a person uses to correct it.
function sentenceRow(entry, idx, { open = false } = {}) {
  const s = entry.sentences[idx];
  const check = needsCheck(s);
  const flags = (s.flags || []).filter(f => FLAG_TEXT[f]);
  const showOrig = s.original && entry.lang !== 'en';
  return `
  <div class="sent">
    ${showOrig ? `<div class="orig" lang="${h(entry.lang)}">“${h(s.original)}”</div>` : ''}
    ${s.en ? `<div class="${showOrig ? 'small muted' : ''}">${showOrig ? 'EN: ' : ''}${h(s.en)}</div>` : ''}
    <div class="tags">
      <span class="chip ${s.topic === 'other' ? 'warn' : ''}">${h(tName(s.topic))}</span>
      ${moodChip(s.sentiment)}
      ${check ? `<span class="chip warn">${L('Angalia', 'Check')}</span>` : s.confirmed ? `<span class="chip plain">${L('Imethibitishwa', 'Confirmed')}</span>` : ''}
    </div>
    ${check && flags.length ? `<div class="small muted" style="margin-top:4px">${flags.map(flagText).join('; ')}</div>` : ''}
    <details ${open || check ? 'open' : ''} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${L('Rekebisha', 'Correct')}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${L('Mada', 'Topic')}
          <select data-change="fix-topic" data-entry="${entry.id}" data-idx="${idx}">${topicOptions(s.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${entry.id}" data-idx="${idx}" data-mood="pos" aria-pressed="${s.sentiment === 'pos'}">${L('Nzuri', 'Positive')}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${entry.id}" data-idx="${idx}" data-mood="neg" aria-pressed="${s.sentiment === 'neg'}">${L('Ya kuboresha', 'To improve')}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${entry.id}" data-idx="${idx}">${L('Sawa', 'OK')}</button>
        </div>
      </div>
    </details>
  </div>`;
}

// Swahili entries are read by Noor directly; a person can tag the topic by hand.
function swahiliEntryBlock(entry) {
  const s = entry.sentences?.[0];
  return `
  <div class="sent">
    <div lang="sw">“${h(entry.original)}”</div>
    <div class="small muted">${L(`Kiswahili: ${host()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`, `Swahili: ${host()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${entry.id}" aria-label="Topic">
        <option value="">— ${L('Mada', 'Topic')} —</option>${topicOptions(s?.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${entry.id}" data-mood="pos" aria-pressed="${s?.sentiment === 'pos'}">${L('Nzuri', 'Positive')}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${entry.id}" data-mood="neg" aria-pressed="${s?.sentiment === 'neg'}">${L('Ya kuboresha', 'To improve')}</button>
    </div>
  </div>`;
}

function entryCard(entry) {
  const g = guestById(entry.guestId);
  const boxLabel = entry.box === 'liked' ? L('Walipenda', 'Liked') : entry.box === 'improve' ? L('Kuboresha', 'Could be better') : L('Maoni', 'Feedback');
  const srcLabel = entry.source === 'photo' ? L('Picha', 'Photo') : entry.source === 'voice' ? L('Sauti', 'Voice') : L('Imeandikwa', 'Typed');
  let body;
  if (entry.status === 'pending') {
    body = `<p class="muted">${L('Bado haijachanganuliwa.', 'Not analysed yet.')}</p><p lang="${h(entry.lang)}">“${h(entry.original)}”</p>`;
  } else if (entry.status === 'swahili') {
    body = swahiliEntryBlock(entry);
  } else if (!entry.sentences?.length) {
    body = `<p lang="${h(entry.lang)}">“${h(entry.original)}”</p><p class="small muted">${L('Hakuna sentensi za kuchanganua.', 'No sentences to analyse.')}</p>`;
  } else {
    body = entry.sentences.map((_, i) => sentenceRow(entry, i)).join('');
  }
  return `
  <div class="card flat">
    <div class="card-title">
      <div><strong>${h(g?.name || 'Mgeni')}</strong> ${langPill(entry.lang)}</div>
      <div class="small muted">${srcLabel} · ${boxLabel}</div>
    </div>
    ${body}
    ${entry.synthetic ? `<div class="small muted" style="margin-top:6px">${L('Mfano (data bandia)', 'Example (synthetic data)')}</div>` : ''}
  </div>`;
}

const ICON_CAMERA = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>';
const ICON_TRANSLATE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h8M8 3v2M6 5c0 5 3 8 6 10M11 5c-1 4-4 8-7 10"/><path d="M13 20l4-9 4 9M14.5 17h5"/></svg>';
const ICON_MIC = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>';
const ICON_LISTEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>';
const ICON_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>';
const ICON_HAND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>';
const ICON_PEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';
const ICON_CAL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';

// ---------------------------------------------------------------- screen: home
function shortSummary(s) {
  const names = list => list.filter(x => x.id !== 'other').slice(0, 3).map(x => tName(x.id).toLowerCase()).join(', ');
  const liked = names(s.liked);
  const improve = names(s.improve);
  const parts = [L(`Wageni ${s.guests}.`, `${s.guests} ${s.guests === 1 ? 'guest' : 'guests'}.`)];
  if (liked) parts.push(L(`Walipenda: ${liked}.`, `Loved: ${liked}.`));
  parts.push(improve ? L(`Kuboresha: ${improve}.`, `To improve: ${improve}.`) : L('Hakuna malalamiko.', 'No complaints.'));
  const strong = strongProduct(s);
  if (strong) parts.push(L(`Wengi wanataka kununua: ${PRODUCTS.find(p => p.id === strong.id).sw}.`, `Many want to buy: ${PRODUCTS.find(p => p.id === strong.id).en}.`));
  return parts.join(' ');
}

function screenHome() {
  const pending = state.entries.filter(e => e.status === 'pending');
  const { s } = currentSummary();
  const toThank = state.guests.filter(g => g.consent && !state.messages.some(m => m.guestId === g.id && m.status === 'sent')).length;
  const next7 = state.bookings.filter(b => { const d = daysFromToday(b.date); return d >= 0 && d <= 7; });
  const plan = currentPlan();
  const unsure = state.entries.reduce((n, e) => n + (e.sentences || []).filter(needsCheck).length, 0);

  const pendingBox = pending.length ? `
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${L(`Maoni ${pending.length} bado hayajachanganuliwa`, `${pending.length} new ${pending.length === 1 ? 'entry' : 'entries'} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${L('Changanua sasa', 'Analyse now')}</button>
    </div>` : '';

  const faces = s.entries ? (() => {
    let pos = 0, neg = 0;
    for (const e of state.entries) for (const x of (e.sentences || [])) { if (x.sentiment === 'pos') pos++; else if (x.sentiment === 'neg') neg++; }
    return `<div class="faces"><span>${FACE.pos} <b>${pos}</b></span><span>${FACE.neg} <b>${neg}</b></span>${unsure ? `<span>${FACE.unsure} <b>${unsure}</b></span>` : ''}</div>`;
  })() : '';
  const summaryCard = s.entries ? `
    <div class="card accent">
      <div class="card-title"><h2>${L('Wageni walisema', 'What guests said')} ${sayBtn('ui_summary', 'Wageni walisema. Bonyeza Sikiliza kusikia muhtasari.', 'What guests said. Tap Listen to hear the summary.')}</h2><span class="small muted">${PERIODS[state.period]()}</span></div>
      ${faces}
      <p class="big-summary" style="margin:0">${h(shortSummary(s))}</p>
      ${unsure ? `<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${L(`Sentensi ${unsure} zinahitaji kuangaliwa.`, `${unsure} ${unsure === 1 ? 'sentence needs' : 'sentences need'} a check.`)}</p>` : ''}
      ${pendingBox}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${ICON_LISTEN}${L('Sikiliza', 'Listen')}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${L('Maelezo zaidi', 'Details')} →</button>
      </div>
    </div>` : `
    <div class="card">
      <h2>${L('Wageni walisema', 'What guests said')}</h2>
      <p class="muted" style="margin:0">${L('Bado hakuna maoni.', 'No feedback yet.')}</p>
      ${pendingBox}
      ${pending.length ? '' : `<button class="btn block" style="margin-top:12px" data-action="load-demo">${L('Ona mfano', 'See an example')}</button>`}
    </div>`;

  // One row = one action. The speaker sits inside the row's right edge (a sibling, so the markup stays valid).
  const sayInline = (clipId, sw, en) => `<button class="say-inline" data-action="say" data-clip="${clipId}" data-sw="${h(sw)}" data-en="${h(en)}" aria-label="${L('Sikiliza', 'Listen')}">${ICON_SPEAKER}</button>`;
  const bigBtn = (attrs, icon, title, sub, tile = '', clip = '', sw = '', en = '', extra = '') => `
    <div class="home-row ${clip ? 'has-say' : ''}">
    <button class="home-btn ${extra}" ${attrs}>
      <span class="role-icon ${tile}" aria-hidden="true">${icon}</span>
      <span class="role-text"><strong>${title}</strong><span class="small muted">${sub}</span></span>
    </button>${clip ? sayInline(clip, sw, en) : ''}</div>`;

  const reservations = state.bookings
    .filter(b => daysFromToday(b.date) >= 0).sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);
  const reservationsCard = reservations.length ? `
    <div class="card">
      <div class="card-title"><h2>${L('Wageni wanaokuja', 'Reservations')}</h2><button class="btn small secondary" data-action="go" data-screen="week">${L('Zote', 'All')}</button></div>
      <ul class="list">${reservations.map(b => `
        <li class="row between">
          <div><strong>${h(day(b.date))}</strong> · ${h(b.leadName || 'Mgeni')} <span class="small muted">· ${L('wageni', 'guests')} ${h(b.guests)}</span>
            <div class="row small" style="margin-top:4px">${langPill(b.language)} ${packChip(b.language)} ${b.status === 'requested' ? `<span class="chip warn">${L('Inasubiri kampuni', 'Awaiting the company')}</span>` : `<span class="chip">${L('Imethibitishwa', 'Confirmed')}</span>`}</div></div>
        </li>`).join('')}</ul>
    </div>` : '';
  const weekSub = next7.length
    ? L(`Wageni ${next7.reduce((n, b) => n + (Number(b.guests) || 1), 0)} siku 7 zijazo`, `${next7.reduce((n, b) => n + (Number(b.guests) || 1), 0)} guests in the next 7 days`)
      + (plan.download.length ? ` · ${L('pakua', 'download')} ${plan.download.map(c => langName(c, getLang())).join(', ')}` : '')
    : L('Pokea ratiba kutoka kwa kampuni ya utalii', 'Get the schedule from the tour company');

  return `
  ${summaryCard}
  ${reservationsCard}
  <div class="stack" style="gap:8px">
    ${bigBtn('data-action="go" data-screen="add"', ICON_CAMERA, L('Ongeza maoni ya mgeni', 'Add guest feedback'), L('Picha ya kitabu, sauti au kuandika', 'Photo of the guestbook, voice or typing'), '', 'ui_add', 'Ongeza maoni ya mgeni. Piga picha ya kitabu, rekodi sauti, au andika.', 'Add guest feedback: photograph the guestbook, record a voice note, or type.', 'primary')}
    ${bigBtn('data-action="hand-to-guest"', ICON_HAND, L('Mpe mgeni simu aandike', 'Let a guest write'), L('Kwa lugha yake, kwenye simu hii', 'In their own language, on this phone'), 'tile-leaf', 'ui_hand', 'Mpe mgeni simu aandike maoni kwa lugha yake.', 'Hand the phone to a guest to write in their own language.')}
    ${bigBtn('data-action="go" data-screen="guests"', ICON_MAIL, L('Washukuru wageni', 'Thank guests'), toThank ? L(`Wageni ${toThank} wanasubiri`, `${toThank} waiting`) : L('Ujumbe kwa lugha ya mgeni', 'A message in the guest’s language'), 'tile-cherry', 'ui_thank', 'Washukuru wageni kwa lugha yao.', 'Thank guests in their own language.')}
    ${bigBtn('data-action="go" data-screen="week"', ICON_CAL, L('Wiki ijayo', 'Next week'), weekSub, 'tile-sky', 'ui_week', 'Wiki ijayo. Nani anakuja, na lugha gani.', 'Next week: who is coming, and which language.')}
    ${bigBtn('data-action="go" data-screen="translate"', ICON_TRANSLATE, L('Tafsiri', 'Translate'), L('Mgeni anaongea, unasikia kwa Kiingereza', 'The guest speaks, you hear it in English'), 'tile-sky')}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${L('Jinsi ya kutumia', 'How to use')}</button>
    <button class="link-btn" data-action="switch-role">${L('Badilisha upande', 'Switch side')}</button>
    <button class="link-btn" data-action="go" data-screen="more">${L('Zaidi', 'More')}</button>
  </div>`;
}

// ---------------------------------------------------------------- screen: next week
function screenWeek() {
  if (!state.hosts) loadHosts().then(render);
  const upcoming = state.bookings
    .filter(b => daysFromToday(b.date) >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const next7 = upcoming.filter(b => daysFromToday(b.date) <= 7);
  const plan = currentPlan();

  const bookingLi = b => `
    <li>
      <div class="row between">
        <strong>${h(day(b.date))}</strong>
        <span class="badge-num" title="guests">${h(b.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${langPill(b.language)} ${packChip(b.language)}
        ${b.status === 'requested' ? `<span class="chip warn">${L('Inasubiri kampuni', 'Awaiting the company')}</span>` : ''}
        ${b.guide ? `<span class="muted">${L('Mwongozaji', 'Guide')}: ${h(b.guide)}</span>` : ''}
      </div>
      <div class="small muted" style="margin-top:4px">${h(b.leadName || '')}${b.company ? ` · ${h(b.company)}` : ''}${b.referredBy ? ` · ${L('alipendekezwa na', 'recommended by')} ${h(b.referredBy)}` : ''}</div>
    </li>`;

  const dayChips = [...Array(14)].map((_, i) => {
    const d = isoDate(addDays(new Date(), i + 1));
    const on = state.availableDays.includes(d);
    return `<button class="chip" data-action="toggle-day" data-day="${d}" aria-pressed="${on}">${h(day(d + 'T12:00:00'))}</button>`;
  }).join('');

  return `
  ${backBtn()}
  <h1>${L('Wiki ijayo', 'Next week')}</h1>

  <div class="card">
    <h2>${L('Siku unazoweza kupokea wageni', 'Days you can take guests')}</h2>
    <p class="small muted">${L('Gusa siku. Wageni wanaziona wanapotafuta, na kampuni inapanga kulingana nazo.', 'Tap the days. Visitors see them when they search; the tour company books around them.')}</p>
    <div class="row">${dayChips}</div>
    <a class="btn block ${state.availableDays.length ? '' : 'disabled'}" style="margin-top:12px" ${state.availableDays.length ? `href="${smsHref(companyPhone(), availabilitySms(host(), 'noor', state.availableDays.filter(d => daysFromToday(d + 'T12:00:00') >= 0).sort()))}"` : 'aria-disabled="true"'}>${L('Tuma siku zangu kwa kampuni (SMS)', 'Send my days to the company (SMS)')}</a>
  </div>

  ${next7.length ? `
  <div class="card">
    <h2>${L('Siku 7 zijazo', 'Next 7 days')}</h2>
    <ul class="list">${next7.map(bookingLi).join('')}</ul>
  </div>` : ''}

  <div class="card">
    <h2>${L('Kutoka kwa kampuni', 'From the tour company')}</h2>
    <button class="btn block" data-action="sync" ${state.online ? '' : 'disabled'}>${L('Pokea ratiba mpya', 'Get the new schedule')}</button>
    <p class="small muted" style="margin:8px 0 0">${state.lastSync ? `${L('Mara ya mwisho', 'Last updated')}: ${h(new Date(state.lastSync).toLocaleString())}` : L('Inahitaji mtandao mara moja.', 'Needs internet once.')}${state.online ? '' : ` · ${L('Nje ya mtandao', 'Offline')}`}</p>
    <details style="margin-top:10px">
      <summary>${L('Hakuna mtandao? Bandika SMS ya kampuni', 'No internet? Paste the company’s SMS')}</summary>
      <p class="small muted" style="margin:6px 0 8px">${L('Kampuni ikithibitisha wageni kwa SMS, bandika ujumbe hapa: wageni wanaingia kwenye ratiba yako.', 'When the company confirms guests by SMS, paste the message here: the guests go straight into your reservations.')}</p>
      <label class="field"><span>${L('Ujumbe', 'Message')}</span><textarea id="sms-in" rows="3" placeholder="WeKaribu: …"></textarea></label>
      <button class="btn secondary block" style="margin-top:8px" data-action="sms-import">${L('Ongeza kutoka SMS', 'Add from the SMS')}</button>
    </details>
  </div>

  <div class="card">
    <h2>${L('Lugha za kuandaa', 'Languages to prepare')}</h2>
    ${plan.download.length ? `
      <div class="row">${plan.download.map(c => langPill(c)).join('')}</div>
      <p class="small muted">${L(`MB ${plan.downloadMB}. Tumia Wi-Fi.`, `${plan.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${state.online ? '' : 'disabled'}>${L('Pakua sasa', 'Download now')}</button>
    ` : `<p style="margin:0">${L('Lugha zote zinazohitajika ziko tayari.', 'All needed languages are ready.')}</p>`}
    ${plan.removable.length ? `
      <hr>
      <p>${L('Lugha nadra zinazoweza kufutwa', 'Rare languages you can delete')}: ${plan.removable.map(c => langPill(c)).join(' ')}</p>
      <button class="btn block danger" data-action="delete-removable">${L(`Futa (MB ${plan.freeMB})`, `Delete (frees ${plan.freeMB} MB)`)}</button>
    ` : ''}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${L('Lugha zote kwenye simu', 'All languages on this phone')}</button>
  </div>

  `;
}

// ---------------------------------------------------------------- screen: add feedback
function screenAdd() {
  const a = state.add;
  const steps = `<div class="steps" aria-hidden="true">${[1, 2, 3].map(n => `<span class="${a.step >= n ? 'on' : ''}"></span>`).join('')}</div>`;
  if (a.step === 1) return backBtn() + steps + addStep1();
  if (a.step === 2) return backBtn() + steps + addStep2();
  return steps + addStep3();
}

function addStep1() {
  const recentBookings = state.bookings
    .filter(b => { const d = daysFromToday(b.date); return d <= 1 && d >= -14; })
    .filter(b => !state.guests.some(g => g.bookingId === b.id))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const guests = state.guests.slice().sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate)).slice(0, 12);

  // Common guest languages first, as chips; everything else behind "Other".
  const COMMON = ['en', 'it', 'fr', 'de', 'zh', 'es'];
  const picked = state.add.newLang || 'en';
  const chips = COMMON.map(c => `<button class="chip" data-action="lang-chip" data-lang="${c}" aria-pressed="${picked === c}">${h(langName(c, getLang()))}</button>`).join('')
    + `<button class="chip" data-action="lang-chip" data-lang="other" aria-pressed="${!COMMON.includes(picked)}">${L('Nyingine…', 'Other…')}</button>`;

  return `
  <h1>${L('Ongeza maoni', 'Add feedback')}</h1>

  ${recentBookings.length ? `
  <div class="card">
    <h2>${L('Kutoka kwenye ratiba', 'From the schedule')}</h2>
    <ul class="list">${recentBookings.map(b => `
      <li class="row between">
        <div><strong>${h(b.leadName || 'Mgeni')}</strong> ${langPill(b.language)}<div class="small muted">${h(day(b.date))} · ${L('wageni', 'guests')} ${h(b.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${b.id}">${L('Chagua', 'Pick')}</button>
      </li>`).join('')}
    </ul>
  </div>` : ''}

  <div class="card">
    <h2>${L('Mgeni aliandika kwa lugha gani?', 'Which language did the guest write in?')}</h2>
    <div class="row" style="margin:4px 0 12px">${chips}</div>
    <div class="stack">
      <label class="field ${COMMON.includes(picked) ? 'hidden' : ''}">${L('Lugha', 'Language')}<select id="ng-lang" data-change="ng-lang">${langOptions(picked)}</select></label>
      <label class="field">${L('Jina la mgeni (hiari)', 'Guest’s name (optional)')}<input type="text" id="ng-name" autocomplete="off" placeholder="${L('mfano: Vivian', 'e.g. Vivian')}"></label>
      <details>
        <summary class="small">${L('Zaidi: tarehe, mawasiliano, nani alipendekeza', 'More: date, contact details, who recommended')}</summary>
        <div class="stack" style="margin-top:10px">
          <label class="field">${L('Tarehe ya ziara', 'Visit date')}<input type="date" id="ng-date" value="${isoDate(new Date())}"></label>
          <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
            <span>${L(`Mgeni aliweka alama: ${host()} anaweza kuhifadhi mawasiliano yangu`, `Guest ticked: ${host()} may keep my contact details`)}</span></label>
          <div id="contact-fields" class="stack hidden">
            <label class="field">${L('Barua pepe', 'Email')}<input type="email" id="ng-email" autocomplete="off"></label>
            <label class="field">${L('Simu / WhatsApp', 'Phone / WhatsApp')}<input type="tel" id="ng-phone" autocomplete="off"></label>
          </div>
          <label class="field">${L('Nani alikupendekezea? (hiari)', 'Who recommended us? (optional)')}<input type="text" id="ng-ref" autocomplete="off"></label>
        </div>
      </details>
      <button class="btn" data-action="save-new-guest">${L('Endelea', 'Continue')} →</button>
    </div>
  </div>

  ${guests.length ? `
  <details class="card" style="padding:14px 18px">
    <summary><strong>${L('Mgeni anayerudi?', 'Returning guest?')}</strong> <span class="small muted">${L('Chagua kutoka orodha', 'pick from the list')}</span></summary>
    <ul class="list" style="margin-top:8px">${guests.map(g => `
      <li class="row between">
        <div><strong>${h(g.name)}</strong> ${langPill(g.language)}<div class="small muted">${h(day(g.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${g.id}">${L('Chagua', 'Pick')}</button>
      </li>`).join('')}
    </ul>
  </details>` : ''}`;
}

function addStep2() {
  const g = currentGuest();
  if (!g) { state.add.step = 1; return addStep1(); }
  const needPack = LANGS[g.language]?.mt && !state.installed.includes(g.language);
  const ready = state.add.inputs.some(i => i.status === 'ready' && (i.text || '').trim());
  const working = state.add.inputs.some(i => i.status === 'working');

  const inputCard = i => {
    const boxSel = `
      <select data-change="box" data-id="${i.id}" aria-label="Box">
        <option value="liked" ${i.box === 'liked' ? 'selected' : ''}>${L('Walipenda (A)', 'Liked (box A)')}</option>
        <option value="improve" ${i.box === 'improve' ? 'selected' : ''}>${L('Kuboresha (B)', 'Could be better (box B)')}</option>
        <option value="unknown" ${i.box === 'unknown' ? 'selected' : ''}>${L('Haijulikani', 'Not sure')}</option>
      </select>`;
    const hint = i.langHint ? `
      <div class="notice warn small">${L(`Inaonekana ni ${langName(i.langHint, 'sw')}, si ${langName(g.language, 'sw')}.`, `This looks like ${langName(i.langHint, 'en')}, not ${langName(g.language, 'en')}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${i.langHint}">${L(`Badilisha kuwa ${langName(i.langHint, 'sw')}`, `Switch to ${langName(i.langHint, 'en')}`)}</button></div>
      </div>` : '';
    let media = '';
    if (i.imageURL) media = `<img class="preview-img" src="${i.imageURL}" alt="Photo of the guestbook box">`;
    if (i.audioURL) media = `<audio controls src="${i.audioURL}" style="width:100%"></audio>`;
    let body = '';
    if (i.status === 'working') body = `<p class="muted">${L('Inasoma…', 'Reading…')}</p>`;
    else if (i.status === 'error') body = `<div class="notice neg small">${L('Imeshindwa', 'Failed')}: ${h(i.error)}</div>`;
    else {
      body = `
        ${i.lowWords?.length ? `<div class="notice warn small"><strong>${L('Angalia maneno haya', 'Check these words')}</strong>${i.lowWords.slice(0, 20).map(w => `<mark class="low">${h(w)}</mark>`).join(' ')}</div>` : ''}
        <label class="field small">${i.source === 'voice' ? L('Alichosema mgeni', 'What the guest said') : L('Maandishi (rekebisha makosa)', 'Text (fix any mistakes)')}
          <textarea data-input="input-text" data-id="${i.id}" lang="${h(g.language)}">${h(i.text)}</textarea></label>
        ${i.source === 'voice' && g.language !== 'en' && g.language !== 'sw' ? `
        <label class="field small">${L('Kwa Kiingereza (kutoka kwa modeli ya sauti)', 'In English (from the voice model)')}
          <textarea data-input="input-english" data-id="${i.id}" style="min-height:80px">${h(i.english)}</textarea></label>` : ''}`;
    }
    const srcLabel = i.source === 'photo' ? L('Picha', 'Photo') : i.source === 'voice' ? L('Sauti', 'Voice') : L('Kuandika', 'Typed');
    return `
    <div class="card flat">
      <div class="card-title"><h3>${srcLabel}</h3><button class="btn small danger" data-action="remove-input" data-id="${i.id}">${L('Ondoa', 'Remove')}</button></div>
      <div class="stack">
        ${media}
        <label class="field small">${L('Kisanduku', 'Which box')}${boxSel}</label>
        ${hint}
        ${body}
      </div>
    </div>`;
  };

  return `
  <div class="card">
    <div class="row between">
      <div><strong>${h(g.name)}</strong> ${langPill(g.language)}<div class="small muted">${h(day(g.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${L('Badilisha', 'Change')}</button>
    </div>
  </div>

  ${needPack ? `<div class="notice warn">${L(`Lugha ya ${langName(g.language, 'sw')} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${PACK_MB}).`, `The ${langName(g.language, 'en')} pack is not on this phone yet. Analysing needs internet once (${PACK_MB} MB).`)}</div>` : ''}

  <div class="grid2">
    <label class="btn big">${ICON_CAMERA}<span class="btn-col">${L('Picha A: Walipenda', 'Photo of box A: liked')}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${ICON_CAMERA}<span class="btn-col">${L('Picha B: Kuboresha', 'Photo of box B: could be better')}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${state.recording ? 'danger' : 'secondary'}" data-action="record">
      ${state.recording ? '<span class="rec-dot"></span>' : ICON_MIC}<span class="btn-col">${state.recording ? L('Simamisha', 'Stop') : L('Rekodi sauti', 'Record voice')}</span></button>
    <button class="btn big secondary" data-action="add-typed">${ICON_PEN}<span class="btn-col">${L('Andika', 'Type')}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${L('Au pakia faili la sauti', 'Or upload an audio file')}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${state.add.inputs.map(inputCard).join('')}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${ready && !working ? '' : 'disabled'}>${L('Changanua', 'Analyse')}</button>`;
}

function addStep3() {
  const entries = state.add.results.map(id => state.entries.find(e => e.id === id)).filter(Boolean);
  const g = currentGuest();
  const unsure = entries.reduce((n, e) => n + (e.sentences || []).filter(needsCheck).length, 0);
  return `
  <h1>${L('Matokeo', 'Results')}</h1>
  ${unsure ? `<div class="notice warn"><strong>${L(`Sentensi ${unsure} zinahitaji kuangaliwa`, `${unsure} ${unsure === 1 ? 'sentence needs' : 'sentences need'} a check`)}</strong>${L('AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.', 'The AI was not sure. Correct it or press “OK”.')}</div>`
    : `<div class="notice">${L('Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.', 'Saved. You can correct anything below.')}</div>`}
  ${entries.map(entryCard).join('')}
  <div class="stack">
    <button class="btn" data-action="finish-add">${L('Maliza', 'Done')}</button>
    <button class="btn secondary" data-action="more-feedback">${L(`Ongeza maoni mengine ya ${h(g?.name || 'mgeni')}`, `Add more for ${h(g?.name || 'this guest')}`)}</button>
  </div>`;
}

// ---------------------------------------------------------------- screen: summary (details)
const PERIODS = { week: () => L('Wiki hii', 'This week'), month: () => L('Mwezi huu', 'This month'), all: () => L('Zote', 'All time') };

function screenSummary() {
  const pending = state.entries.filter(e => e.status === 'pending');
  const { s, entries, text } = currentSummary();
  const periodChips = Object.entries(PERIODS).map(([k, label]) =>
    `<button class="chip" data-action="period" data-period="${k}" aria-pressed="${state.period === k}">${label()}</button>`).join('');

  const topicList = (items, neg) => items.filter(x => x.id !== 'other').map(x => {
    const pct = s.guests ? Math.round((x.guests / s.guests) * 100) : 0;
    const quotes = x.quotes.slice(0, 5).map(q => `
      <blockquote class="q">${q.original && q.lang !== 'en' ? `<div class="orig" lang="${h(q.lang)}">“${h(q.original)}”</div><div class="trans">EN: ${h(q.en)}</div>` : `<div class="orig">“${h(q.en)}”</div>`}
      ${q.flagged ? `<span class="chip warn" style="margin-top:4px">${L('Angalia', 'Check')}</span>` : ''}</blockquote>`).join('');
    return `
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${h(tName(x.id))}</strong><span class="badge-num ${neg ? 'neg' : ''}">${x.guests}</span></div>
        <div class="bar ${neg ? 'neg' : ''}"><span style="width:${pct}%"></span></div>
        <details class="quotes"><summary>${L('Maneno ya wageni', 'What guests said')} (${x.quotes.length})</summary>${quotes}</details>
      </div>`;
  }).join('');

  const flagged = [];
  for (const e of entries) (e.sentences || []).forEach((sen, i) => { if (needsCheck(sen)) flagged.push([e, i]); });

  const report = guideReport(s, `${PERIODS[state.period]()}`, host());
  const lang = getLang();

  return `
  ${backBtn()}
  <h1>${L('Muhtasari', 'Summary')}</h1>
  <div class="row" style="margin-bottom:12px">${periodChips}</div>

  ${pending.length ? `
  <div class="notice warn">
    <strong>${L(`Maoni ${pending.length} bado hayajachanganuliwa`, `${pending.length} ${pending.length === 1 ? 'entry' : 'entries'} not analysed yet`)}</strong>
    <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${L('Changanua sasa', 'Analyse now')}</button>
  </div>` : ''}

  ${s.entries === 0 ? (pending.length ? '' : `
  <div class="card">
    <p>${L('Bado hakuna maoni kwa kipindi hiki.', 'No feedback for this period yet.')}</p>
    <button class="btn" data-action="go" data-screen="add">${L('Ongeza maoni', 'Add feedback')}</button>
  </div>`) : `
  <div class="card">
    <div class="card-title"><h2>${L(`Kwa ${host()}`, `For ${host()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${L('Sikiliza', 'Listen')}</button></div>
    <div class="big-summary" lang="${lang}">${text[lang].map(p => `<p>${h(p)}</p>`).join('')}</div>
    <p class="small muted" style="margin:0">${L('Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.', 'Human-written sentences; the AI only fills in counts and topics.')}</p>
  </div>

  ${s.liked.filter(x => x.id !== 'other').length ? `<div class="card"><h2>${L('Walichopenda', 'What they liked')}</h2>${topicList(s.liked, false)}</div>` : ''}
  ${s.improve.filter(x => x.id !== 'other').length ? `<div class="card"><h2>${L('Wanachotaka kiboreshwe', 'What they want improved')}</h2>${topicList(s.improve, true)}</div>` : ''}

  ${s.products.length ? `
  <div class="card">
    <h2>${L('Bidhaa walizotaka kununua', 'Products they wanted to buy')}</h2>
    ${s.products.map(p => { const P = PRODUCTS.find(x => x.id === p.id); return `<div class="topic-row"><strong>${h(P[lang])}</strong><span class="badge-num">${p.guests}</span></div>`; }).join('')}
  </div>` : ''}

  ${flagged.length ? `
  <div class="card">
    <h2>${L('Zinahitaji kuangaliwa', 'Needs a human check')}</h2>
    ${flagged.map(([e, i]) => `<div class="small muted" style="margin-top:8px">${h(guestById(e.guestId)?.name || '')} · ${h(langName(e.lang, lang))}</div>${sentenceRow(e, i, { open: true })}`).join('')}
  </div>` : ''}

  <div class="card">
    <h2>${L('Ripoti kwa kampuni ya utalii', 'Report for the tour company')}</h2>
    <p class="small muted">${L('Hakuna majina, namba wala maneno ya wageni.', 'No names, contacts or quotes.')}</p>
    <div class="sms" id="report-text">${h(report)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${state.shareOk ? 'checked' : ''}>
      <span>${L('Nimeisoma na nakubali ishirikiwe', 'I have read it and agree to share it')}</span></label>
    <div class="grid2" style="margin-top:10px">
      <button class="btn" id="share-btn" data-action="share" ${state.shareOk ? '' : 'disabled'}>${L('Shiriki', 'Share')}</button>
      <button class="btn secondary" id="cloud-btn" data-action="cloud-upload" ${state.shareOk ? '' : 'disabled'}>${L('Pakia kwenye wingu', 'Upload to cloud')}</button>
    </div>
    ${state.cloud.queue.length ? `<p class="small" style="margin:8px 0 0">⏳ ${L(`Ripoti ${state.cloud.queue.length} inasubiri mtandao.`, `${state.cloud.queue.length} report${state.cloud.queue.length === 1 ? '' : 's'} waiting for internet.`)}</p>` : ''}
    <a class="btn small secondary block ${state.shareOk ? '' : 'disabled'}" id="report-sms" aria-disabled="${!state.shareOk}" style="margin-top:8px" href="${smsHref(companyPhone(), reportSms(report, 'noor', state.period, s))}">${L('Au tuma ripoti kwa SMS (bila mtandao)', 'Or send the report by SMS (no internet needed)')}</a>
    ${state.cloud.uploads.length ? `<p class="small muted" style="margin:8px 0 0">✓ ${L('Imepakiwa', 'Uploaded')} ${h(new Date(state.cloud.uploads[state.cloud.uploads.length - 1].at).toLocaleString())} · ${L('maoni', 'entries')} ${state.cloud.uploads[state.cloud.uploads.length - 1].entries} → ${h(state.cloud.uploads[state.cloud.uploads.length - 1].to)}</p>` : `<p class="small muted" style="margin:8px 0 0">${L('Kupakia kunatuma ripoti hii (jumla tu) kwa kampuni ya utalii na ofisi ya utalii, mtandao ukiwepo.', 'Uploading sends this report (counts only) to the tour company and the tourism office when there is internet.')}</p>`}
  </div>`}
  `;
}

// ---------------------------------------------------------------- screen: guests
function screenGuests() {
  const guests = state.guests.slice().sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate));
  if (!guests.length) {
    return `${backBtn()}<h1>${L('Wageni', 'Guests')}</h1>
      <div class="card"><p>${L('Bado hakuna wageni.', 'No guests yet.')}</p>
      <button class="btn" data-action="go" data-screen="add">${L('Ongeza maoni', 'Add feedback')}</button></div>`;
  }
  return `
  ${backBtn()}
  <h1>${L('Washukuru wageni', 'Thank guests')}</h1>
  <p class="small muted">${L('Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.', 'Messages are human-written in each language. You send them yourself, and only if the guest agreed.')}</p>
  <div class="card"><ul class="list">${guests.map(g => {
    const n = state.entries.filter(e => e.guestId === g.id).length;
    const sent = state.messages.some(m => m.guestId === g.id && m.status === 'sent');
    const open = state.openGuest === g.id;
    return `
      <li>
        <div class="row between">
          <div><strong>${h(g.name)}</strong> ${langPill(g.language)}${g.synthetic ? ` <span class="chip plain">${L('mfano', 'example')}</span>` : ''}</div>
          <span class="small muted">${h(day(g.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${consentChip(g)} <span class="muted">${L('maoni', 'entries')}: ${n}</span>
          ${sent ? `<span class="chip">${L('Shukrani imetumwa', 'Thanked')}</span>` : ''}</div>
        ${g.referredBy ? `<div class="small muted" style="margin-top:4px">${L('Alipendekezwa na', 'Recommended by')}: ${h(g.referredBy)}</div>` : ''}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${open ? '' : 'secondary'}" data-action="toggle-draft" data-id="${g.id}">${L('Ujumbe wa shukrani', 'Thank-you message')}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${g.id}">${L('Futa', 'Delete')}</button>
        </div>
        ${open ? draftCard(g) : ''}
      </li>`;
  }).join('')}</ul></div>`;
}

function draftCard(g) {
  const liked = guestTopLiked(state.entries, g.id);
  const m = thankYou(g, liked, host());
  const c = g.contact || {};
  const subject = SUBJECTS[m.lang] || SUBJECTS.en;
  let send;
  if (!g.consent) {
    send = `<div class="notice warn small">${L('Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.', 'The guest did not agree to be contacted. Do not send.')}</div>`;
  } else if (c.email) {
    send = `<a class="btn block" data-action="mark-sent" data-id="${g.id}" data-lang="${m.lang}" href="mailto:${encodeURIComponent(c.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(m.text)}">${L('Idhinisha na tuma (barua pepe)', 'Approve and send (email)')}</a>`;
  } else if (c.phone) {
    send = `<a class="btn block" data-action="mark-sent" data-id="${g.id}" data-lang="${m.lang}" href="${smsHref(c.phone, m.text)}">${L('Idhinisha na tuma (SMS)', 'Approve and send (SMS)')}</a>`;
  } else {
    send = `<div class="notice small">${L('Hakuna barua pepe wala namba ya simu.', 'No email or phone number.')}</div>`;
  }
  const lang = getLang();
  return `
  <div class="stack" style="margin-top:12px">
    ${m.usedFallback ? `<div class="notice warn small">${L(`Hakuna kiolezo cha ${langName(g.language, 'sw')} bado; tumetumia Kiingereza.`, `No ${langName(g.language, 'en')} template yet; using English.`)}</div>` : ''}
    <div class="card flat" lang="${m.lang}"><div class="small muted">${L(`Kwa ${langName(m.lang, 'sw')}`, `In ${langName(m.lang, 'en')}`)}</div><p id="draft-${g.id}" style="margin:6px 0 0">${h(m.text)}</p></div>
    ${m.lang !== lang ? `<div class="card flat" lang="${lang}"><div class="small muted">${L('Maana yake', 'What it says')}</div><p style="margin:6px 0 0">${h(lang === 'sw' ? m.sw : thankYou({ ...g, language: 'en' }, liked, host()).text)}</p></div>` : ''}
    <p class="small muted" style="margin:0">${liked ? L(`Mada aliyopenda: ${tName(liked)}`, `Liked topic: ${tName(liked)}`) : L('Hakuna mada iliyo wazi; ujumbe wa jumla.', 'No clear liked topic; general message.')}</p>
    ${send}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${g.id}">${L('Nakili', 'Copy')}</button>
  </div>`;
}

// ---------------------------------------------------------------- screen: languages
function screenLangs() {
  const plan = currentPlan();
  const lang = getLang();
  const packRow = code => {
    const l = LANGS[code];
    const inst = state.installed.includes(code);
    const tags = [];
    if (inst) tags.push(`<span class="chip">${L('Imepakuliwa', 'On phone')}</span>`);
    if (plan.keep.includes(code)) tags.push(`<span class="chip">${L('Inakaa daima', 'Kept')}</span>`);
    if (plan.needed.includes(code)) tags.push(`<span class="chip warn">${L('Wiki ijayo', 'Needed next week')}</span>`);
    if (inst && plan.removable.includes(code)) tags.push(`<span class="chip plain">${L('Nadra', 'Rare')}</span>`);
    return `
      <div class="pack">
        <div><strong>${h(l[lang])}</strong> <span class="muted small">${h(l.native)} · ${PACK_MB} MB</span>
          <div class="row" style="margin-top:4px">${tags.join('')}</div></div>
        ${inst
          ? `<button class="btn small danger" data-action="delete-pack" data-lang="${code}">${L('Futa', 'Delete')}</button>`
          : `<button class="btn small" data-action="download-pack" data-lang="${code}" ${state.online ? '' : 'disabled'}>${L('Pakua', 'Get')}</button>`}
      </div>`;
  };
  const sharedRow = key => {
    const m = SHARED_MODELS[key];
    const inst = state.shared[key];
    return `
      <div class="pack">
        <div><strong>${h(m[lang])}</strong> <span class="muted small">${m.mb} MB</span></div>
        ${inst ? `<span class="chip">${L('Tayari', 'Ready')}</span>` : `<button class="btn small" data-action="download-shared" data-key="${key}" ${state.online ? '' : 'disabled'}>${L('Pakua', 'Get')}</button>`}
      </div>`;
  };

  return `
  ${backBtn()}
  <h1>${L('Lugha', 'Languages')}</h1>
  <p class="small muted">${L(`Kiswahili na Kiingereza daima, pamoja na lugha ${KEEP_TOP_N} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`, `Swahili and English always, plus the ${KEEP_TOP_N} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${L('Modeli za pamoja', 'Shared models')}</h2>
    <p class="small muted">${L('Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.', 'Downloaded once, used for every language, work offline.')}</p>
    ${Object.keys(SHARED_MODELS).map(sharedRow).join('')}
  </div>

  <div class="card">
    <h2>${L('Lugha za wageni', 'Guest languages')}</h2>
    ${plan.usedDefaults ? `<p class="small muted">${L('Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).', 'No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).')}</p>` : ''}
    ${plan.recommend.length ? `
      <div class="notice small" style="margin-top:4px">${L(`Pakua ukiwa na Wi-Fi: ${plan.recommend.map(c => LANGS[c].sw).join(', ')} (MB ${plan.recommendMB}).`, `Download on Wi-Fi: ${plan.recommend.map(c => LANGS[c].en).join(', ')} (${plan.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${state.online ? '' : 'disabled'}>${L('Pakua zinazopendekezwa', 'Download recommended')}</button>
      </div>` : ''}
    ${packLangs().map(packRow).join('')}
  </div>`;
}

// ---------------------------------------------------------------- screen: translate (host <-> guest, on the phone)
// Guest language -> English runs on the phone (the same packs). Towards the guest, the app offers
// human-written phrases in their language (no machine translation into Swahili exists at this size).
function screenTranslate() {
  const t = state.translate;
  const lang = getLang();
  const guestLang = t.lang;
  const phrases = PHRASES_TO_GUEST.map(ph => `<li class="row between"><div><strong lang="${guestLang}">${h(ph[guestLang] || ph.en)}</strong><div class="small muted">${h(ph[lang] || ph.en)}</div></div>
    <button class="say" data-action="say-text" data-lang="${guestLang === 'xx' ? 'en' : guestLang}" data-text="${h(ph[guestLang] || ph.en)}" aria-label="${L('Sema kwa sauti', 'Say it aloud')}">${ICON_SPEAKER}</button></li>`).join('');
  return `
  ${backBtn()}
  <h1>${L('Tafsiri', 'Translate')}</h1>
  <div class="card">
    <label class="field">${L('Lugha ya mgeni', 'Guest’s language')}<select id="tr-lang" data-change="tr-lang">${langOptions(t.lang)}</select></label>
    <p class="small muted" style="margin:10px 0 6px">${L('Mpe mgeni simu, bonyeza, aongee. Utasikia kwa Kiingereza.', 'Hand the guest the phone, press, let them speak. You hear it in English.')}</p>
    <button class="btn big block ${state.recording ? 'danger' : ''}" data-action="translate-record">
      ${state.recording ? '<span class="rec-dot"></span>' : ICON_MIC}<span class="btn-col">${state.recording ? L('Simamisha', 'Stop') : L('Mgeni anaongea', 'Guest speaks')}</span></button>
    ${t.result ? `
    <div class="card flat" style="margin-top:12px">
      <div class="row between"><div class="small muted">${L('Kwa Kiingereza', 'In English')}</div><button class="say" data-action="say-text" data-lang="en" data-text="${h(t.result)}" aria-label="${L('Sikiliza', 'Listen')}">${ICON_SPEAKER}</button></div>
      <p style="margin:6px 0 0">${h(t.result)}</p>
      ${t.text && t.text !== t.result ? `<p class="small muted" style="margin:6px 0 0" lang="${guestLang}">${h(t.text)}</p>` : ''}
    </div>` : ''}
    <details style="margin-top:12px">
      <summary class="small">${L('Au andika / bandika maandishi', 'Or type / paste text')}</summary>
      <label class="field" style="margin-top:8px">${L('Mgeni aliandika', 'What the guest wrote')}<textarea id="tr-text" lang="${guestLang}" placeholder="${L('Andika hapa…', 'Type or paste here…')}">${h(t.text)}</textarea></label>
      <button class="btn secondary block" style="margin-top:10px" data-action="translate-run">${L('Tafsiri kwa Kiingereza', 'Translate to English')}</button>
    </details>
    <p class="small muted" style="margin:8px 0 0">${L('Inafanyika kwenye simu hii, bila mtandao. Hakuna tafsiri ya mashine kwenda Kiswahili bado; misemo hapa chini imeandikwa na watu.', 'Runs on this phone, offline. There is no machine translation into Swahili yet; the phrases below are human-written.')}</p>
  </div>
  <div class="card">
    <h2>${L('Mwambie mgeni', 'Say to the guest')} <span class="small muted">${h(langName(t.lang, lang))}</span></h2>
    <p class="small muted">${L('Bonyeza spika: simu inasema kwa lugha ya mgeni.', 'Press the speaker: the phone says it in the guest’s language.')}</p>
    <ul class="list">${phrases}</ul>
  </div>`;
}

const PHRASES_TO_GUEST = [
  { sw: 'Karibu!', en: 'Welcome!', it: 'Benvenuti!', fr: 'Bienvenue !', de: 'Willkommen!', zh: '欢迎！', es: '¡Bienvenidos!', pl: 'Witamy!' },
  { sw: 'Chakula kiko tayari.', en: 'Lunch is ready.', it: 'Il pranzo è pronto.', fr: 'Le déjeuner est prêt.', de: 'Das Mittagessen ist fertig.', zh: '午饭准备好了。', es: 'La comida está lista.', pl: 'Obiad gotowy.' },
  { sw: 'Tafadhali andika maoni yako kwenye kitabu.', en: 'Please write your feedback in the book.', it: 'Scrivete le vostre impressioni nel libro, per favore.', fr: 'Écrivez vos impressions dans le livre, s’il vous plaît.', de: 'Bitte schreiben Sie Ihre Eindrücke ins Buch.', zh: '请把您的感想写在留言本上。', es: 'Por favor, escriban sus comentarios en el libro.', pl: 'Proszę wpisać swoje wrażenia do księgi.' },
  { sw: 'Kahawa hii ni ya kupeleka nyumbani.', en: 'This coffee is to take home.', it: 'Questo caffè è da portare a casa.', fr: 'Ce café est à emporter.', de: 'Dieser Kaffee ist zum Mitnehmen.', zh: '这包咖啡可以带回家。', es: 'Este café es para llevar.', pl: 'Ta kawa jest na wynos.' },
  { sw: 'Asante kwa kuja. Karibu tena!', en: 'Thank you for coming. Welcome back any time!', it: 'Grazie per essere venuti. Tornate quando volete!', fr: 'Merci d’être venus. Revenez quand vous voulez !', de: 'Danke für Ihren Besuch. Kommen Sie gern wieder!', zh: '谢谢光临，欢迎再来！', es: 'Gracias por venir. ¡Vuelvan cuando quieran!', pl: 'Dziękujemy za wizytę. Zapraszamy ponownie!' },
  { sw: 'Njia ni mbaya; tutawasaidia.', en: 'The road is bad; we will help you.', it: 'La strada è brutta; vi aiutiamo noi.', fr: 'La route est mauvaise ; nous vous aiderons.', de: 'Der Weg ist schlecht; wir helfen Ihnen.', zh: '路不好走，我们会帮您。', es: 'El camino está mal; les ayudaremos.', pl: 'Droga jest zła; pomożemy.' },
];

async function translateRun() {
  const t = state.translate;
  t.text = document.getElementById('tr-text')?.value || '';
  if (!t.text.trim()) return toast(L('Andika kitu kwanza', 'Type something first'));
  if (t.lang === 'en') { t.result = t.text.trim(); return render(); }
  if (t.lang === 'sw') { t.result = L('Hii ni Kiswahili tayari.', 'This is already Swahili; the host reads it directly.'); return render(); }
  if (LANGS[t.lang]?.mt && !state.installed.includes(t.lang) && !(await confirmDownload([['pack', t.lang]]))) return;
  showBusy(L('Inatafsiri', 'Translating'));
  try {
    const r = await ai.toEnglish(t.text.trim(), t.lang, progress);
    t.result = r.english;
  } catch (err) { toast(err.message, 6000); } finally { hideBusy(); await refreshModels(); render(); }
}

// ---------------------------------------------------------------- screen: more
function screenMore() {
  const demo = state.guests.some(g => g.synthetic);
  return `
  ${backBtn()}
  <h1>${L('Zaidi', 'More')}</h1>

  <div class="card">
    <h2>${L('Mwenyeji', 'Host')}</h2>
    <label class="field">${L('Jina lako (linaonekana kwa wageni na kwenye ujumbe)', 'Your name (shown to guests and in messages)')}
      <input type="text" id="host-name" value="${h(host())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${L('Hifadhi jina', 'Save name')}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${L('Jinsi ya kutumia', 'How to use')}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains('big-text') ? L('Herufi za kawaida', 'Normal text size') : L('Herufi kubwa', 'Large text')}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${L('Lugha kwenye simu', 'Languages on this phone')}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(host())}" target="_blank" rel="noopener">${L('Chapisha ukurasa wa kitabu cha wageni', 'Print the guestbook page')}</a>
    </div>
  </div>

  <div class="card">
    <h2>${L('Data ya mfano', 'Example data')}</h2>
    <p class="small muted">${L('Wageni 6 wa kubuni na maoni kwa lugha 5. Si watu halisi.', '6 invented guests with feedback in 5 languages. Not real people.')}</p>
    ${demo
      ? `<button class="btn danger" data-action="remove-demo">${L('Ondoa data ya mfano', 'Remove example data')}</button>`
      : `<button class="btn secondary" data-action="load-demo">${L('Pakia data ya mfano', 'Load example data')}</button>`}
  </div>

  <div class="card">
    <h2>${L('Faragha', 'Privacy')}</h2>
    <ul class="small" style="padding-left:18px;margin:0">
      <li>${L('Data yote iko kwenye simu hii tu.', 'All data stays on this phone.')}</li>
      <li>${L('Mawasiliano ya mgeni yanahifadhiwa tu kwa ruhusa yake.', 'Guest contact details are kept only with their consent.')}</li>
      <li>${L('Ripoti kwa kampuni haina majina wala maneno ya wageni.', 'The company report has no names or quotes.')}</li>
    </ul>
    <button class="btn danger block" style="margin-top:12px" data-action="wipe">${L('Futa data zote', 'Delete all data')}</button>
  </div>

  <div class="card">
    <h2>${L('Kuhusu', 'About')}</h2>
    <p class="small">${L('Imejengwa kwa Hack-Nation × World Bank Small AI for Development (utalii).', 'Built for the Hack-Nation × World Bank Small AI for Development hackathon (tourism).')}</p>
    <p class="small muted">${L('Video za mandhari: Pexels (leseni ya bure)', 'Background videos: Pexels, free licence')} — ${h(allCredits())}.</p>
    <div class="stack">
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${L('Msimbo, vyanzo vya data na mipaka', 'Code, data sources and limits')}</a>
    </div>
  </div>`;
}

// ---------------------------------------------------------------- tour company screen
function readCompanyForm() {
  const v = id => document.getElementById(id)?.value?.trim() || '';
  const consent = Boolean(document.getElementById('c-consent')?.checked);
  const date = v('c-date');
  return {
    id: uid('bk'), date: dayStamp(date || addDays(new Date(), 3)), guests: Math.max(1, Number(v('c-guests')) || 1),
    leadName: v('c-name') || 'Mgeni', language: v('c-lang') || 'en', guide: v('c-guide'),
    company: '', consent, email: consent ? v('c-email') : '',
  };
}

function requestsHTML() {
  const reqs = state.bookings.filter(b => b.status === 'requested').sort((a, b) => new Date(a.date) - new Date(b.date));
  const confirmed = state.bookings.filter(b => b.status === 'confirmed' && b.source === 'visitor').slice(-4);
  const hostRec = (state.hosts || []).find(x => x.id === 'noor') || { meet: 'Materuni village office', phone: '' };
  const smsHost = b => bookingSms(b);
  const smsTourist = b => touristSms({ ...b, hostName: `${host()}’s farm`, meet: hostRec.meet });
  const row = b => `
    <li>
      <div class="row between"><strong>${h(b.leadName)}</strong><span class="badge-num">${h(b.guests)}</span></div>
      <div class="row small" style="margin-top:6px">${h(day(b.date))} ${langPill(b.language)}${b.referredBy ? `<span class="muted">${L('alipendekezwa na', 'recommended by')} ${h(b.referredBy)}</span>` : ''}${b.consent && b.email ? `<span class="muted">${h(b.email)}</span>` : ''}</div>
      ${b.status === 'requested'
        ? `<button class="btn small block" style="margin-top:8px" data-action="company-confirm" data-id="${b.id}">${L('Thibitisha: SMS kwa mwenyeji na kwa mgeni', 'Confirm: SMS to the host and to the tourist')}</button>`
        : `
        <div class="link-line"><span class="chip">${h(host())}</span><span class="link-arrow">⇄</span><span class="chip plain">${h(b.company || 'Ondera Coffee Trails')}</span><span class="link-arrow">⇄</span><span class="chip">${h(b.leadName)}</span></div>
        <div class="small muted" style="margin:6px 0 4px">${L('SMS kwa mwenyeji (Kiswahili)', 'SMS to the host (Swahili)')}</div>
        <div class="sms small">${h(smsHost(b))}</div>
        <a class="btn small secondary block" style="margin-top:6px" href="${smsHref(hostRec.phone, smsHost(b))}" data-action="sms-sent" data-id="${b.id}" data-to="host">${L(`Tuma kwa ${host()}`, `Send to ${host()}`)} ${b.smsHost ? '✓' : ''}</a>
        <div class="small muted" style="margin:10px 0 4px">${L('SMS kwa mgeni', 'SMS to the tourist')} (${h(langName(b.language, getLang()))})</div>
        <div class="sms small">${h(smsTourist(b))}</div>
        <a class="btn small secondary block" style="margin-top:6px" href="${smsHref('', smsTourist(b))}" data-action="sms-sent" data-id="${b.id}" data-to="tourist">${L(`Tuma kwa ${h(b.leadName)}`, `Send to ${h(b.leadName)}`)} ${b.smsTourist ? '✓' : ''}</a>`}
    </li>`;
  const list = reqs.length || confirmed.length ? `
  <div class="card">
    <h2>${L('Maombi na miunganisho', 'Requests and connections')}</h2>
    <p class="small muted">${L('Ombi la mgeni linakuja hapa. Ukithibitisha, wote wawili wanapata SMS: mwenyeji kwa Kiswahili, mgeni kwa lugha yake. Hakuna upande unaohitaji intaneti.', 'A visitor’s request lands here. When you confirm, both sides get an SMS: the host in Swahili, the tourist in their language. Neither side needs internet.')}</p>
    <ul class="list">${[...reqs, ...confirmed].map(row).join('')}</ul>
  </div>` : '';
  return list + smsImportCard(L('Ombi la mgeni au siku za mwenyeji zikija kwa SMS, bandika hapa.', 'A tourist’s request, a host’s days or a host’s report sent by SMS: paste it here.')) + feedbackInboxHTML();
}

// What the company receives back: the host's uploaded reports and, from tourists, counts only.
function feedbackInboxHTML() {
  const ups = state.cloud.uploads.slice(-3).reverse();
  const touristEntries = state.entries.filter(e => e.source === 'visitor');
  const touristGuests = new Set(touristEntries.map(e => e.guestId)).size;
  if (!ups.length && !touristGuests) return '';
  return `
  <div class="card">
    <h2>${L('Maoni yaliyopokelewa', 'Feedback received')}</h2>
    ${ups.length ? ups.map(u => `
      <div class="small muted" style="margin-top:6px">${L('Kutoka kwa mwenyeji', 'From the host')} ${h(u.host)} · ${h(new Date(u.at).toLocaleDateString())} · ${L('maoni', 'entries')} ${u.entries}${u.viaSms ? ` · ${L('kwa SMS', 'by SMS')}` : ''}</div>
      <div class="sms small" style="margin-top:4px">${h(u.report)}</div>`).join('')
      : `<p class="small muted">${L('Mwenyeji bado hajapakia ripoti.', 'The host has not uploaded a report yet.')}</p>`}
    ${touristGuests ? `<p class="small" style="margin:10px 0 0">${L(`Kutoka kwa wageni: watu ${touristGuests} waliandika kwenye simu ya mwenyeji (jumla tu, hakuna majina).`, `From tourists: ${touristGuests} wrote on the host’s phone (counts only, no names).`)}</p>` : ''}
  </div>`;
}

function screenCompany() {
  if (!state.hosts) loadHosts().then(render);
  const today = isoDate(addDays(new Date(), 3));
  const { s } = currentSummary();
  const report = s.entries ? guideReport(s, L('Mfano', 'Example'), host()) : null;
  const back = state.role === 'company'
    ? `<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${L('Badilisha upande', 'Switch side')}</button>`
    : backBtn();
  return back + requestsHTML() + companyHTML({
    langOptionsHTML: langOptions('en'), today,
    sms: bookingSms({ date: dayStamp(today), guests: 2, language: 'en', guide: '' }), report,
  });
}

// ---------------------------------------------------------------- visitor: find a place and book
// Online means: the phone has internet AND the Offline button is not switched on.
const isOnline = () => navigator.onLine && !state.forceOffline;
async function toggleNet() {
  if (!navigator.onLine && !state.forceOffline) return toast(L('Hakuna mtandao sasa hivi. Kila kitu kwenye simu bado kinafanya kazi.', 'No internet right now. Everything on this phone still works.'), 4000);
  state.forceOffline = !state.forceOffline;
  await db.setSetting('forceOffline', state.forceOffline);
  state.online = isOnline();
  setOffline(!state.online);
  captureBookForm();
  toast(state.online ? L('Mtandaoni: wingu, ratiba na video zinarudi.', 'Online: cloud, schedule and video are back.') : L('Nje ya mtandao: SMS na AI ya simu. Hakuna data inayotumika.', 'Offline mode: SMS and on-phone AI. No data is used.'), 3500);
  render();
  if (state.online) flushCloudQueue();
}

// Phone numbers for sms: links (digits and + only; the demo data carries notes in brackets).
const smsTo = phone => String(phone || '').replace(/[^\d+]/g, '');
const smsHref = (phone, body) => `sms:${smsTo(phone)}?body=${encodeURIComponent(body)}`;
const companyPhone = () => ((state.hosts || []).find(x => x.id === 'noor') || {}).companyPhone || '';

// A WeKaribu SMS pasted into the app, on whichever side received it. Nothing here needs internet.
async function importSms(text) {
  const code = parseWkCode(text);
  if (!code) return toast(L('Hakuna msimbo wa WeKaribu kwenye ujumbe huu.', 'No WeKaribu code found in this message.'), 4000);
  if (code.kind === 'BOOK' || code.kind === 'REQ') {
    const dup = state.bookings.find(b => b.date.slice(0, 10) === code.date && b.leadName === code.leadName && b.guests === code.guests);
    if (dup) return toast(L('Tayari iko kwenye orodha.', 'Already in the list.'));
    const hostRec = hostById(code.hostId) || {};
    const b = {
      id: uid('bk'), date: dayStamp(code.date), guests: code.guests, leadName: code.leadName, language: code.language,
      guide: hostRec.guide || '', company: hostRec.company || '', consent: false, email: '', referredBy: code.referredBy, hostId: code.hostId,
      status: code.kind === 'BOOK' ? 'confirmed' : 'requested', source: code.kind === 'BOOK' ? 'sms-company' : 'visitor', createdAt: new Date().toISOString(), viaSms: true,
    };
    await db.put('bookings', b);
    state.bookings.push(b);
    toast(code.kind === 'BOOK' ? L('Wageni wameongezwa kwenye ratiba.', 'Booking added to your reservations.') : L('Ombi limeongezwa.', 'Request added.'));
  } else if (code.kind === 'DAYS') {
    state.hostDaysBySms[code.hostId] = code.days;
    await db.setSetting('hostDaysBySms', state.hostDaysBySms);
    toast(L(`Siku za mwenyeji zimepokelewa: ${code.days.length}.`, `Host days received: ${code.days.length}.`));
  } else if (code.kind === 'REPORT') {
    const hostRec = hostById(code.hostId) || {};
    const up = { id: uid('up'), at: new Date().toISOString(), entries: code.entries, guests: code.guests, to: L('Imepokelewa kwa SMS', 'Received by SMS'), report: code.report, period: code.period, host: hostRec.name ? hostRec.name.split('’')[0] : host(), viaSms: true };
    state.cloud.uploads.push(up);
    await db.setSetting('cloudUploads', state.cloud.uploads);
    toast(L('Ripoti imepokelewa.', 'Report received.'));
  }
  render();
}

// Shared card: paste an SMS from the other side.
function smsImportCard(hint) {
  return `
  <div class="card">
    <h2>${L('Umepata SMS ya WeKaribu?', 'Got a WeKaribu SMS?')}</h2>
    <p class="small muted">${hint}</p>
    <label class="field"><span>${L('Bandika ujumbe hapa', 'Paste the message here')}</span><textarea id="sms-in" rows="3" placeholder="WeKaribu: …"></textarea></label>
    <button class="btn block" data-action="sms-import">${L('Ongeza kutoka SMS', 'Add from the SMS')}</button>
  </div>`;
}

async function loadHosts() {
  if (state.hosts) return state.hosts;
  try {
    const res = await fetch('data/hosts.json');
    state.hosts = (await res.json()).hosts;
  } catch {
    state.hosts = [];
  }
  return state.hosts;
}

const hostById = id => (state.hosts || []).find(x => x.id === id);

let semanticTimer = null;
function screenFind() {
  if (!state.hosts) loadHosts().then(render);
  const hosts = state.hosts || [];
  const ranked = rankHosts(state.find.q, hosts, state.guests, getLang(), state.find.semantic);
  return findHTML({ q: state.find.q, hosts, lang: getLang(), loading: !state.hosts, ranked, thinking: state.find.thinking });
}

// Meaning-based matching with the on-device topic model (only if it is already on the phone, never a download).
async function semanticRank(query) {
  if (!state.shared.topics || !state.hosts || !query.trim()) return;
  state.find.thinking = true;
  try {
    const texts = [query, ...state.hosts.map(x => `${x.name}. ${x.tags.join(', ')}. ${x.blurb}`)];
    const vecs = await ai.embedTexts(texts);
    const q = vecs[0];
    const sem = {};
    state.hosts.forEach((x, i) => { const v = vecs[i + 1]; let d = 0; for (let k = 0; k < q.length; k++) d += q[k] * v[k]; sem[x.id] = Math.max(0, d); });
    state.find.semantic = sem;
  } catch { /* keyword ranking only */ } finally {
    state.find.thinking = false;
    if (state.screen === 'find') { const pos = document.getElementById('find-q')?.selectionStart; render(); const el = document.getElementById('find-q'); if (el) { el.focus(); if (pos != null) el.setSelectionRange(pos, pos); } }
  }
}

function screenHost() {
  const hostRec = hostById(state.book.hostId);
  if (!hostRec) { state.screen = 'find'; return screenFind(); }
  const live = hostRec.id === 'noor' ? currentSummary().s : null;
  const days = hostDays(hostRec, (hostRec.id === 'noor' && state.availableDays.length) ? state.availableDays : state.hostDaysBySms[hostRec.id]);
  const ref = (state.book.form.referredBy || '').trim().toLowerCase();
  const knownGuest = ref && hostRec.id === 'noor'
    ? state.guests.find(g => (g.name || '').toLowerCase().split(' ')[0] === ref.split(' ')[0]) : null;
  return hostHTML({ host: hostRec, days, selected: state.book.day, summaryLine: hostSummaryLine(hostRec, live, getLang()), form: state.book.form, lang: getLang(), knownGuest });
}

function screenBooked() {
  const hostRec = hostById(state.book.hostId);
  if (!hostRec || !state.book.done) { state.screen = 'find'; return screenFind(); }
  if (!state.phrasebook.phrases) loadPhrasebook();
  const b = state.book.done;
  return tripHTML({
    host: hostRec, booking: b, lang: getLang(), phrasebook: state.phrasebook.phrases, saved: state.phrasebook.saved, audioReady: state.phrasebook.audioReady,
    online: state.online, requestHref: smsHref(hostRec.companyPhone, requestSms(b, hostRec)),
  });
}

async function loadPhrasebook() {
  try {
    const res = await fetch('data/phrasebook-sw.json');
    state.phrasebook.phrases = (await res.json()).phrases;
    state.phrasebook.saved = await db.getSetting('phrasebookSaved', false);
    const m = await loadVoiceManifest();
    state.phrasebook.audioReady = Boolean(m && state.phrasebook.phrases.every(p => m.files[p.id]));
  } catch { state.phrasebook.phrases = []; }
  if (state.screen === 'booked') render();
}

// Keep the phrasebook and its sound on the guest's phone (cache + a setting), so it works with no signal at the farm.
async function downloadPhrasebook() {
  showBusy(L('Inapakua misemo', 'Downloading phrases'));
  try {
    if ('caches' in window) {
      const cache = await caches.open('kitabu-phrases-v1');
      await cache.add('data/phrasebook-sw.json').catch(() => null);
      const m = await loadVoiceManifest();
      if (m) await Promise.all(state.phrasebook.phrases.map(p => (m.files[p.id] ? cache.add(`audio/sw/${m.files[p.id]}`).catch(() => null) : null)));
    }
    state.phrasebook.saved = true;
    await db.setSetting('phrasebookSaved', true);
    toast(`✓ ${L('Misemo iko kwenye simu yako', 'Phrases saved on your phone')}`);
  } finally { hideBusy(); render(); }
}

function captureBookForm() {
  const v = id => document.getElementById(id)?.value || '';
  if (!document.getElementById('bk-v-name')) return;
  state.book.form = {
    guests: Number(v('bk-v-guests')) || 2, language: v('bk-v-lang') || 'en', name: v('bk-v-name'),
    email: v('bk-v-email'), consent: Boolean(document.getElementById('bk-v-consent')?.checked), referredBy: v('bk-v-ref'),
  };
}

async function submitBooking() {
  captureBookForm();
  const hostRec = hostById(state.book.hostId);
  const f = state.book.form;
  if (!state.book.day) return toast(L('Chagua siku', 'Pick a day'));
  if (!f.name.trim()) return toast(L('Andika jina lako', 'Add your name'));
  const b = {
    id: uid('bk'), date: dayStamp(state.book.day), guests: Math.max(1, f.guests), leadName: f.name.trim(), language: f.language,
    guide: hostRec.guide, company: hostRec.company, consent: f.consent, email: f.consent ? f.email.trim() : '',
    referredBy: f.referredBy.trim(), hostId: hostRec.id, status: 'requested', source: 'visitor', createdAt: new Date().toISOString(),
  };
  await db.put('bookings', b);
  state.bookings.push(b);
  state.book.done = b;
  go('booked');
}

function captureVisitorDraft() {
  const v = id => document.getElementById(id)?.value || '';
  if (!document.getElementById('v-liked')) return;
  state.visitor.draft = { name: v('v-name'), liked: v('v-liked'), improve: v('v-improve'), email: v('v-email') };
}

async function saveVisitor() {
  const v = id => document.getElementById(id)?.value?.trim() || '';
  const lang = state.visitor.lang;
  const t = visitorStrings(lang);
  const liked = v('v-liked');
  const improve = v('v-improve');
  if (!liked && !improve) { toast(t.needText); return; }
  const consent = Boolean(document.getElementById('v-consent')?.checked);
  const declared = [
    document.getElementById('v-buy-coffee')?.checked ? 'coffee' : null,
    document.getElementById('v-buy-souvenir')?.checked ? 'souvenir' : null,
  ].filter(Boolean);
  const g = {
    id: uid('g'), name: v('v-name') || 'Mgeni', language: lang, visitDate: dayStamp(new Date()), consent,
    contact: consent ? { email: v('v-email'), phone: '' } : null, // no consent -> nothing stored
    source: 'visitor', createdAt: new Date().toISOString(),
  };
  await db.put('guests', g);
  let first = true;
  for (const [box, text] of [['liked', liked], ['improve', improve]]) {
    if (!text) continue;
    await db.put('entries', {
      id: uid('fb'), guestId: g.id, lang, source: 'visitor', box, original: text, status: 'pending',
      sentences: [], products: [], declaredProducts: first ? declared : [],
      visitDate: g.visitDate, createdAt: new Date().toISOString(),
    });
    first = false;
  }
  await loadAll();
  state.visitor = { lang, saved: true, draft: {} };
  render();
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- first-time guide
let guideEl = null;
let spotEl = null;
function renderGuide() {
  if (!guideEl) {
    guideEl = document.createElement('div');
    guideEl.className = 'guide-backdrop hidden';
    guideEl.setAttribute('role', 'dialog');
    guideEl.setAttribute('aria-modal', 'true');
    guideEl.setAttribute('aria-labelledby', 'guide-title');
    document.body.appendChild(guideEl);
    spotEl = document.createElement('div');
    spotEl.className = 'spot hidden';
    spotEl.innerHTML = '<span class="spot-hand">👆</span>';
    document.body.appendChild(spotEl);
  }
  guideEl.classList.toggle('hidden', !state.guide.open);
  if (!state.guide.open) { guideEl.innerHTML = ''; spotEl.classList.add('hidden'); return; }
  guideEl.innerHTML = guideHTML(state.guide.step);
  guideEl.querySelector('[data-action="guide-next"], [data-action="guide-try"]')?.focus();
  // Spotlight: the step points at the real button on the screen behind the card.
  const target = GUIDE_STEPS[state.guide.step].target && document.querySelector(GUIDE_STEPS[state.guide.step].target);
  if (target) {
    target.scrollIntoView({ block: 'start', behavior: 'smooth' });
    setTimeout(() => {
      const r = target.getBoundingClientRect();
      spotEl.style.left = `${r.left - 6}px`; spotEl.style.top = `${r.top - 6}px`;
      spotEl.style.width = `${r.width + 12}px`; spotEl.style.height = `${r.height + 12}px`;
      spotEl.classList.remove('hidden');
    }, 350);
  } else spotEl.classList.add('hidden');
}
function openGuide(step = 0) {
  state.guide = { open: true, step };
  renderGuide();
}
async function closeGuide() {
  state.guide.open = false;
  renderGuide();
  await db.setSetting('guideSeen', true);
}

// One invented English-speaking guest: needs only the two small shared models (about 90 MB).
async function tryExample() {
  await closeGuide();
  const id = 'demo_quick';
  if (!guestById(id)) {
    const g = {
      id, name: 'Emma (mfano)', language: 'en', visitDate: dayStamp(addDays(new Date(), -1)), consent: true,
      contact: { email: 'emma@example.com', phone: '' }, createdAt: new Date().toISOString(), synthetic: true,
    };
    await db.put('guests', g);
    const text = {
      liked: 'Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.',
      improve: 'The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale.',
    };
    for (const box of ['liked', 'improve']) {
      await db.put('entries', {
        id: `${id}_${box}`, guestId: id, lang: 'en', source: 'typed', box, original: text[box], status: 'pending',
        sentences: [], products: [], visitDate: g.visitDate, createdAt: new Date().toISOString(), synthetic: true,
      });
    }
    await loadAll();
  }
  state.period = 'all';
  state.screen = 'home';
  if (await applyPrecomputed()) { await loadAll(); return render(); }
  render();
  await analyzePending();
}

// ---------------------------------------------------------------- render
const SCREENS = {
  choose: roleChooserHTML,
  home: screenHome, add: screenAdd, summary: screenSummary, guests: screenGuests, week: screenWeek,
  langs: screenLangs, more: screenMore, company: screenCompany, translate: screenTranslate,
  find: screenFind, host: screenHost, booked: screenBooked,
  visitor: () => visitorHTML(state.visitor.lang, state.visitor.saved, state.visitor.draft),
};

let lastScreen = null;
// The top-bar button that freezes or restarts the moving background.
function updateMotionBtn() {
  const b = document.getElementById('motion-btn');
  if (!b) return;
  const on = motionOn();
  const icon = on
    ? '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="1" y="1" width="3.5" height="10" rx="1" fill="currentColor"/><rect x="7.5" y="1" width="3.5" height="10" rx="1" fill="currentColor"/></svg>'
    : '<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1.2v9.6L10.5 6z" fill="currentColor"/></svg>';
  b.innerHTML = `${icon}<span class="btn-word"> Video</span>`;
  b.setAttribute('aria-pressed', String(!on));
  b.setAttribute('aria-label', on ? L('Simamisha mandhari inayosogea', 'Stop the moving background') : L('Cheza mandhari inayosogea', 'Play the moving background'));
  b.title = b.getAttribute('aria-label');
}

function render() {
  const sc = state.screen;
  document.body.classList.toggle('mode-visitor', sc === 'visitor' || sc === 'choose');
  document.body.classList.toggle('mode-choose', sc === 'choose');
  document.body.classList.toggle('home', sc === 'home');
  const changed = sc !== lastScreen;
  lastScreen = sc;
  view.innerHTML = SCREENS[sc]() + (document.getElementById('nature').classList.contains('real') ? `<div class="credit">${h(sceneCredit(currentScene()))}</div>` : '');
  updateMotionBtn();
  // a new screen: its cards rise in one after another
  view.classList.remove('enter');
  if (changed) { void view.offsetWidth; view.classList.add('enter'); }
  const net = document.getElementById('net-btn');
  if (net) {
    net.classList.toggle('off', !state.online);
    net.innerHTML = `<span class="dot"></span>${state.online ? L('Mtandaoni', 'Online') : L('Nje ya mtandao', 'Offline')}`;
    net.setAttribute('aria-pressed', String(!state.online));
    net.title = state.online ? L('Bonyeza kufanya kazi bila mtandao', 'Tap to work offline') : (state.forceOffline ? L('Bonyeza kurudi mtandaoni', 'Tap to go back online') : L('Hakuna mtandao sasa', 'No internet right now'));
  }
  if (!state.online) view.insertAdjacentHTML('afterbegin', `<div class="netbar">${L('Bila mtandao: maoni, muhtasari, tafsiri na ratiba vinafanya kazi kwenye simu hii. Maombi na ripoti huenda kwa SMS.', 'No internet: feedback, summary, translate and reservations work on this phone. Requests and reports go by SMS.')}</div>`);
  const ls = document.getElementById('ui-lang');
  if (ls && ls.value !== getLang()) ls.value = getLang();
  if (state.guide.open) renderGuide();
  if (sc === 'langs') {
    ai.storageEstimate().then(est => {
      const el = document.getElementById('storage-line');
      if (el && est) el.textContent = L(`Nafasi iliyotumika: MB ${est.usedMB} kati ya MB ${est.quotaMB}`, `Storage used: ${est.usedMB} MB of ${est.quotaMB} MB`);
    });
  }
}

function go(screen) {
  state.screen = screen;
  if (screen !== 'add') state.add = freshAdd();
  render();
  window.scrollTo(0, 0);
}

// ---------------------------------------------------------------- model downloads (always confirmed: data costs money)
async function confirmDownload(needs) {
  if (!needs.length) return true;
  const mb = needs.reduce((a, [kind, key]) => a + (kind === 'pack' ? PACK_MB : SHARED_MODELS[key].mb), 0);
  if (!isOnline()) {
    toast(L('Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.', 'Offline. Download packs when the helper has internet.'), 6000);
    return false;
  }
  const names = needs.map(([kind, key]) => (kind === 'pack' ? langName(key, getLang()) : SHARED_MODELS[key][getLang()])).join(', ');
  if (!confirm(L(`Pakua mara moja: takriban MB ${mb} (${names}). Endelea?`, `One-time download of about ${mb} MB (${names}). Continue?`))) return false;
  for (const [kind, key] of needs) {
    showBusy(L('Inapakua', 'Downloading') + ` · ${kind === 'pack' ? langName(key, getLang()) : SHARED_MODELS[key][getLang()]}`);
    if (kind === 'pack') await ai.downloadPack(key, progress);
    else await ai.downloadShared(key, progress);
  }
  hideBusy();
  await refreshModels();
  return true;
}

async function downloadPacks(codes) {
  const needs = codes.filter(c => LANGS[c]?.mt && !state.installed.includes(c)).map(c => ['pack', c]);
  if (await confirmDownload(needs)) { toast(L('Lugha ziko tayari', 'Packs ready')); render(); }
}

async function deletePacks(codes) {
  if (!codes.length) return;
  const names = codes.map(c => langName(c, getLang())).join(', ');
  if (!confirm(L(`Futa ${names}? Zinaweza kupakuliwa tena baadaye.`, `Delete ${names}? They can be downloaded again later.`))) return;
  for (const c of codes) await ai.deleteModel(LANGS[c].mt);
  await refreshModels();
  toast(L('Imefutwa', 'Deleted'));
  render();
}

// ---------------------------------------------------------------- actions
async function syncBookings() {
  if (!isOnline()) return toast(L('Hakuna mtandao', 'Offline'));
  showBusy(L('Inapokea ratiba', 'Receiving the schedule'));
  const res = await fetch('data/bookings.json', { cache: 'no-store' });
  const feed = await res.json();
  const today = new Date();
  const rows = feed.bookings.map(b => ({
    id: b.id, date: dayStamp(addDays(today, b.dayOffset)), guests: b.guests, leadName: b.leadName,
    language: b.language, guide: b.guide, company: feed.company, consent: !!b.consent,
    email: b.consent ? (b.email || '') : '', synthetic: true,
  }));
  await db.putMany('bookings', rows);
  state.bookings = await db.all('bookings');
  state.lastSync = new Date().toISOString();
  await db.setSetting('lastSync', state.lastSync);
  hideBusy();
  const plan = currentPlan();
  toast(plan.download.length
    ? L(`Ratiba imepokelewa. Pakua: ${plan.download.map(c => LANGS[c].sw).join(', ')}`, `Schedule received. Download: ${plan.download.map(c => LANGS[c].en).join(', ')}`)
    : L('Ratiba imepokelewa', 'Schedule received'));
  render();
}

async function addBooking() {
  const v = id => document.getElementById(id)?.value?.trim() || '';
  const date = v('bk-date');
  if (!date) return toast(L('Weka tarehe', 'Add a date'));
  const consent = document.getElementById('bk-consent').checked;
  const row = {
    id: uid('bk'), date: dayStamp(date), guests: Math.max(1, Number(v('bk-guests')) || 1), leadName: v('bk-name') || 'Mgeni',
    language: v('bk-lang') || 'en', guide: v('bk-guide'), company: '', consent, email: consent ? v('bk-email') : '',
  };
  await db.put('bookings', row);
  state.bookings.push(row);
  toast(L('Imehifadhiwa', 'Saved'));
  render();
}

async function pickBooking(id) {
  const b = state.bookings.find(x => x.id === id);
  if (!b) return;
  let g = state.guests.find(x => x.bookingId === b.id);
  if (!g) {
    g = {
      id: uid('g'), name: b.leadName || 'Mgeni', language: b.language, visitDate: b.date, consent: !!b.consent,
      contact: b.consent ? { email: b.email || '', phone: '' } : null, bookingId: b.id, groupSize: b.guests,
      createdAt: new Date().toISOString(), synthetic: !!b.synthetic,
    };
    await db.put('guests', g);
    state.guests.push(g);
  }
  state.add = freshAdd();
  state.add.guestId = g.id;
  state.add.step = 2;
  render();
}

async function saveNewGuest() {
  const v = id => document.getElementById(id)?.value?.trim() || '';
  const consent = document.getElementById('ng-consent').checked;
  const g = {
    id: uid('g'), name: v('ng-name') || 'Mgeni', language: v('ng-lang') || state.add.newLang || 'en',
    visitDate: dayStamp(v('ng-date') || new Date()), consent,
    contact: consent ? { email: v('ng-email'), phone: v('ng-phone') } : null, // no consent -> nothing stored
    referredBy: v('ng-ref'), createdAt: new Date().toISOString(),
  };
  await db.put('guests', g);
  state.guests.push(g);
  state.add = freshAdd();
  state.add.guestId = g.id;
  state.add.step = 2;
  render();
  window.scrollTo(0, 0);
}

async function addPhoto(file, box) {
  const g = currentGuest();
  const item = { id: uid('in'), source: 'photo', box, text: '', status: 'working', imageURL: URL.createObjectURL(file), lowWords: [] };
  state.add.inputs.push(item);
  render();
  try {
    showBusy(L('Inasoma picha', 'Reading the photo'));
    const r = await ai.ocr(file, g.language, progress);
    Object.assign(item, { text: r.text, lowWords: r.lowWords, confidence: r.confidence, status: 'ready' });
    if (!r.text) { item.status = 'error'; item.error = L('Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.', 'No text found. Try a closer, brighter photo.'); }
    const hint = await ai.guessLanguage(r.text);
    if (hint && hint !== g.language) item.langHint = hint;
  } catch (err) {
    item.status = 'error';
    item.error = err.message;
  } finally {
    hideBusy();
    render();
  }
}

async function addAudio(blob) {
  const g = currentGuest();
  if (!state.shared.voice && !(await confirmDownload([['shared', 'voice']]))) return;
  const item = { id: uid('in'), source: 'voice', box: 'unknown', text: '', english: '', status: 'working', audioURL: URL.createObjectURL(blob) };
  state.add.inputs.push(item);
  render();
  try {
    showBusy(L('Inasikiliza', 'Listening'));
    const r = await ai.transcribe(blob, g.language, progress);
    Object.assign(item, { text: r.original, english: r.english, status: 'ready' });
    state.shared.voice = true;
  } catch (err) {
    item.status = 'error';
    item.error = err.message;
  } finally {
    hideBusy();
    render();
  }
}

let recorder = null;
async function toggleRecording() { return toggleRecordingWith(addAudio); }

// Voice translation: the guest speaks, the host hears it in English (Whisper + the language pack, on the phone).
async function translateAudio(blob) {
  const t = state.translate;
  if (!state.shared.voice && !(await confirmDownload([['shared', 'voice']]))) return;
  showBusy(L('Inasikiliza', 'Listening'));
  try {
    const r = await ai.transcribe(blob, t.lang, progress);
    t.text = r.original || '';
    t.result = r.english || r.original || '';
    state.shared.voice = true;
    hideBusy();
    render();
    if (t.result) speak(t.result, 'en');
  } catch (err) {
    toast(err.message, 6000);
  } finally { hideBusy(); await refreshModels(); render(); }
}

async function toggleRecordingWith(onBlob) {
  if (recorder) { recorder.stop(); return; }
  if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
    toast(L('Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.', 'Recording is not supported here. Upload an audio file.'), 5000);
    return;
  }
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const chunks = [];
  const mr = new MediaRecorder(stream);
  mr.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
  mr.onstop = () => {
    stream.getTracks().forEach(t => t.stop());
    recorder = null;
    state.recording = false;
    const blob = new Blob(chunks, { type: mr.mimeType || 'audio/webm' });
    render();
    onBlob(blob).catch(err => toast(err.message));
  };
  mr.start();
  recorder = mr;
  state.recording = true;
  render();
}

async function runAnalysis() {
  const g = currentGuest();
  const inputs = state.add.inputs.filter(i => i.status === 'ready' && (i.text || '').trim());
  if (!inputs.length) return;
  const needs = [];
  if (g.language !== 'sw') {
    if (!state.shared.topics) needs.push(['shared', 'topics']);
    if (!state.shared.mood) needs.push(['shared', 'mood']);
    const needsTranslation = inputs.some(i => !(i.source === 'voice' && i.english));
    if (LANGS[g.language]?.mt && needsTranslation && !state.installed.includes(g.language)) needs.push(['pack', g.language]);
  }
  if (!(await confirmDownload(needs))) return;

  const saved = [];
  for (const [n, i] of inputs.entries()) {
    showBusy(`${L('Inachanganua', 'Analysing')} ${n + 1}/${inputs.length}`);
    const english = i.source === 'voice' && g.language !== 'en' && g.language !== 'sw' ? i.english : undefined;
    const res = await analyze({ original: i.text.trim(), lang: g.language, box: i.box, english }, progress);
    const entry = {
      id: uid('fb'), guestId: g.id, lang: g.language, source: i.source, box: i.box, original: i.text.trim(),
      ...res, lowWords: i.lowWords || [], ocrConfidence: i.confidence ?? null,
      visitDate: g.visitDate, createdAt: new Date().toISOString(),
    };
    await db.put('entries', entry);
    state.entries.push(entry);
    saved.push(entry.id);
  }
  hideBusy();
  for (const i of state.add.inputs) { if (i.imageURL) URL.revokeObjectURL(i.imageURL); if (i.audioURL) URL.revokeObjectURL(i.audioURL); }
  state.add.inputs = [];
  state.add.results = saved;
  state.add.step = 3;
  await refreshModels();
  render();
  window.scrollTo(0, 0);
}

async function analyzePending() {
  const pending = state.entries.filter(e => e.status === 'pending');
  const langs = [...new Set(pending.map(e => e.lang))];
  const needs = [];
  if (langs.some(l => l !== 'sw')) {
    if (!state.shared.topics) needs.push(['shared', 'topics']);
    if (!state.shared.mood) needs.push(['shared', 'mood']);
  }
  for (const l of langs) if (LANGS[l]?.mt && !state.installed.includes(l)) needs.push(['pack', l]);
  if (!(await confirmDownload(needs))) return;
  for (const [n, e] of pending.entries()) {
    showBusy(`${L('Inachanganua', 'Analysing')} ${n + 1}/${pending.length}`);
    const res = await analyze({ original: e.original, lang: e.lang, box: e.box }, progress);
    Object.assign(e, res);
    await db.put('entries', e);
  }
  hideBusy();
  await refreshModels();
  toast(`✓ ${L('Imekamilika', 'Done')}`);
  render();
}

async function saveEntry(entry) {
  await db.put('entries', entry);
  render();
}

function findSentence(el) {
  const entry = state.entries.find(e => e.id === el.dataset.entry);
  if (!entry) return [null, null];
  return [entry, entry.sentences[Number(el.dataset.idx)]];
}

async function loadDemo() {
  const res = await fetch('data/demo.json');
  const demo = await res.json();
  const today = new Date();
  for (const d of demo.guests) {
    const g = {
      id: d.id, name: d.name, language: d.language, visitDate: dayStamp(addDays(today, d.dayOffset)), consent: d.consent,
      contact: d.consent ? { email: d.email || '', phone: '' } : null, createdAt: new Date().toISOString(), synthetic: true,
    };
    await db.put('guests', g);
    for (const box of ['liked', 'improve']) {
      if (!d[box]) continue;
      await db.put('entries', {
        id: `${d.id}_${box}`, guestId: d.id, lang: d.language, source: 'typed', box, original: d[box],
        status: 'pending', sentences: [], products: [], visitDate: g.visitDate, createdAt: new Date().toISOString(), synthetic: true,
      });
    }
  }
  const ready = await applyPrecomputed();
  await loadAll();
  state.period = 'all';
  go('home');
  toast(ready
    ? L('Mfano umepakiwa: hawa ni wageni wa kubuni.', 'Example loaded: these are made-up guests.')
    : L('Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.', 'Example data loaded. Tap “Analyse now”.'), 5000);
}

// The example data was analysed once by the same pipeline in CI (data/demo-analysed.json); use those
// results so the example opens at once. Real feedback is always analysed on this phone.
async function applyPrecomputed() {
  try {
    const res = await fetch('data/demo-analysed.json');
    if (!res.ok) return false;
    const pre = (await res.json()).entries || {};
    const all = await db.all('entries');
    let n = 0;
    for (const e of all) {
      const r = pre[e.id];
      if (!r || e.status !== 'pending') continue;
      Object.assign(e, { english: r.english, sentences: r.sentences, products: r.products, status: r.status, precomputed: true });
      await db.put('entries', e);
      n++;
    }
    return n > 0;
  } catch { return false; }
}

async function removeDemo() {
  for (const g of state.guests.filter(x => x.synthetic)) await db.del('guests', g.id);
  for (const e of state.entries.filter(x => x.synthetic || x.id.startsWith('demo_'))) await db.del('entries', e.id);
  for (const b of state.bookings.filter(x => x.synthetic)) await db.del('bookings', b.id);
  await loadAll();
  toast(L('Imeondolewa', 'Removed'));
  render();
}

async function deleteGuest(id) {
  const g = guestById(id);
  if (!g || !confirm(L(`Futa ${g.name} na maoni yake yote?`, `Delete ${g.name} and all their feedback?`))) return;
  await db.del('guests', id);
  for (const e of state.entries.filter(x => x.guestId === id)) await db.del('entries', e.id);
  for (const m of state.messages.filter(x => x.guestId === id)) await db.del('messages', m.id);
  await loadAll();
  render();
}

// "Cloud" upload: the counts-only report goes to the tour company and the tourism office. On this demo
// phone it is stored locally and appears on the company side; a real deployment posts it to their system.
async function cloudUpload() {
  if (!state.shareOk) return;
  const { s } = currentSummary();
  const report = guideReport(s, `${PERIODS[state.period]()}`, host());
  const up = { id: uid('up'), at: new Date().toISOString(), entries: s.entries, guests: s.guests, to: 'Ondera Coffee Trails · ' + L('Ofisi ya utalii', 'Tourism office'), report, period: state.period, host: host() };
  if (!isOnline()) {
    // kept on the phone and sent by itself the next time there is internet
    state.cloud.queue.push(up);
    await db.setSetting('cloudQueue', state.cloud.queue);
    toast(L('Hakuna mtandao. Ripoti imehifadhiwa na itapakiwa yenyewe mtandao ukirudi.', 'Offline. The report is saved and will upload by itself when internet returns.'), 5000);
    return render();
  }
  showBusy(L('Inapakia kwenye wingu', 'Uploading to the cloud'));
  await new Promise(r => setTimeout(r, 900));
  state.cloud.uploads.push(up);
  await db.setSetting('cloudUploads', state.cloud.uploads);
  hideBusy();
  toast(`✓ ${L('Imepakiwa', 'Uploaded')}`);
  render();
}

async function flushCloudQueue() {
  if (!isOnline() || !state.cloud.queue.length) return;
  const pending = state.cloud.queue.splice(0);
  for (const up of pending) state.cloud.uploads.push({ ...up, at: new Date().toISOString(), queuedAt: up.at });
  await db.setSetting('cloudUploads', state.cloud.uploads);
  await db.setSetting('cloudQueue', state.cloud.queue);
  toast(`✓ ${L(`Ripoti ${pending.length} imepakiwa sasa.`, `${pending.length} saved report${pending.length === 1 ? '' : 's'} uploaded now.`)}`);
  render();
}

async function shareReport() {
  if (!state.shareOk) return;
  const text = document.getElementById('report-text')?.textContent || '';
  if (navigator.share) {
    try { await navigator.share({ title: 'Ripoti ya maoni', text }); } catch { /* user cancelled */ }
  } else {
    await copyText(text);
  }
}

async function readAloud() {
  const { s, text } = currentSummary();
  const lang = getLang();
  // Swahili: natural voice clips (ElevenLabs, made at build time), the phone's own voice as fallback.
  if (lang === 'sw' && await playClips(summaryClipIds(s))) return;
  speak(text[lang].join(' '), lang);
}

async function startVisitor(from = 'home') {
  state.visitor = { lang: pickVisitorLang(), saved: false, draft: {} };
  await db.setSetting('kiosk', from);
  go('visitor');
}

async function chooseRole(role) {
  state.role = role;
  await db.setSetting('role', role);
  if (role === 'visitor') { state.book = { hostId: null, day: null, form: {}, done: null }; return go('find'); }
  go(role === 'company' ? 'company' : 'home');
  // The guide is one tap away (How to use) rather than a wall on the first visit.
}

const actions = {
  say: el => sayLabel(el.dataset.clip, getLang() === 'sw' ? el.dataset.sw : el.dataset.en, getLang(), speak),
  'choose-role': el => chooseRole(el.dataset.role),
  'open-host': el => { state.book = { hostId: el.dataset.id, day: null, form: {}, done: null }; go('host'); },
  'download-phrasebook': downloadPhrasebook,
  'translate-run': translateRun,
  'copy-text': el => copyText(el.dataset.text || ''),
  'cloud-upload': cloudUpload,
  'sms-import': () => importSms(document.getElementById('sms-in')?.value || ''),
  'translate-record': () => toggleRecordingWith(translateAudio),
  'toggle-net': toggleNet,
  'say-text': el => speak(el.dataset.text, el.dataset.lang || 'en'),
  'say-phrase': el => sayLabel(el.dataset.clip, el.dataset.text, 'sw', speak),
  'book-day': el => { captureBookForm(); state.book.day = el.dataset.day; render(); },
  'book-submit': submitBooking,
  'toggle-day': async el => {
    const d = el.dataset.day;
    state.availableDays = state.availableDays.includes(d) ? state.availableDays.filter(x => x !== d) : [...state.availableDays, d].sort();
    await db.setSetting('availableDays', state.availableDays);
    render();
  },
  'company-confirm': async el => {
    const b = state.bookings.find(x => x.id === el.dataset.id);
    if (!b) return;
    b.status = 'confirmed';
    b.confirmedAt = new Date().toISOString();
    await db.put('bookings', b);
    toast(L('Imethibitishwa. SMS mbili ziko tayari.', 'Confirmed. Two SMS are ready: host and tourist.'));
    render();
  },
  'sms-sent': async el => {
    const b = state.bookings.find(x => x.id === el.dataset.id);
    if (!b) return;
    if (el.dataset.to === 'host') b.smsHost = new Date().toISOString(); else b.smsTourist = new Date().toISOString();
    await db.put('bookings', b);
    setTimeout(render, 400);
  },
  'switch-role': async () => { state.role = null; await db.setSetting('role', null); go('choose'); },
  back: () => go('home'),
  go: el => go(el.dataset.screen),
  'toggle-lang': async () => {
    setLang(getLang() === 'sw' ? 'en' : 'sw');
    await db.setSetting('lang', getLang());
    render();
  },
  'toggle-motion': () => { toggleMotion(); updateMotionBtn(); },
  'hand-to-guest': () => startVisitor(state.screen === 'find' ? 'choose' : 'home'),
  'visitor-lang': el => { captureVisitorDraft(); state.visitor.lang = el.dataset.lang; render(); },
  'visitor-save': saveVisitor,
  'visitor-next': () => { state.visitor = { lang: pickVisitorLang(), saved: false, draft: {} }; render(); window.scrollTo(0, 0); },
  'visitor-exit': async () => {
    const from = await db.getSetting('kiosk', 'home');
    if (from === 'home' && !confirm(L(`Kwa ${host()} tu: rudi nyumbani?`, `${host()} only: back to the home screen?`))) return;
    await db.setSetting('kiosk', false);
    if (from === 'choose') go('find'); else go('home');
  },
  'company-sms': () => {
    const b = readCompanyForm();
    const phone = document.getElementById('c-phone')?.value?.trim() || '';
    if (!phone) { toast(L(`Weka namba ya simu ya ${host()}`, `Add ${host()}’s phone number`)); return; }
    window.location.href = smsHref(phone, bookingSms(b));
  },
  'company-save': async () => {
    const b = readCompanyForm();
    await db.put('bookings', b);
    state.bookings.push(b);
    toast(L('Imehifadhiwa kwenye ratiba ya simu hii', 'Saved to this phone’s schedule'));
  },
  'toggle-big': async () => {
    const on = !document.documentElement.classList.contains('big-text');
    document.documentElement.classList.toggle('big-text', on);
    await db.setSetting('bigText', on);
    render();
  },
  'save-host': async () => {
    setHost(document.getElementById('host-name')?.value);
    await db.setSetting('hostName', host());
    toast(L(`Jina: ${host()}`, `Name: ${host()}`));
    render();
  },
  'guide-open': () => openGuide(0),
  'guide-next': () => openGuide(Math.min(state.guide.step + 1, GUIDE_STEPS.length - 1)),
  'guide-prev': () => openGuide(Math.max(state.guide.step - 1, 0)),
  'guide-close': closeGuide,
  'guide-try': tryExample,
  sync: syncBookings,
  'add-booking': addBooking,
  'download-pack': el => downloadPacks([el.dataset.lang]),
  'download-suggested': () => downloadPacks(currentPlan().download),
  'download-recommended': () => downloadPacks(currentPlan().recommend),
  'delete-pack': el => deletePacks([el.dataset.lang]),
  'delete-removable': () => deletePacks(currentPlan().removable),
  'download-shared': async el => { if (await confirmDownload([['shared', el.dataset.key]])) render(); },
  'pick-booking': el => pickBooking(el.dataset.id),
  'pick-guest': el => { state.add = freshAdd(); state.add.guestId = el.dataset.id; state.add.step = 2; render(); window.scrollTo(0, 0); },
  'save-new-guest': saveNewGuest,
  'lang-chip': el => {
    const v = el.dataset.lang;
    state.add.newLang = v === 'other' ? (Object.keys(LANGS).find(c => !['en', 'it', 'fr', 'de', 'zh', 'es'].includes(c)) || 'pl') : v;
    render();
  },
  'change-guest': () => { state.add.step = 1; render(); },
  'add-typed': () => { state.add.inputs.push({ id: uid('in'), source: 'typed', box: 'liked', text: '', status: 'ready' }); render(); },
  record: toggleRecording,
  'remove-input': el => { state.add.inputs = state.add.inputs.filter(i => i.id !== el.dataset.id); render(); },
  'use-hint': async el => {
    const g = currentGuest();
    g.language = el.dataset.lang;
    await db.put('guests', g);
    state.add.inputs.forEach(i => { i.langHint = null; });
    toast(`${L('Lugha', 'Language')}: ${langName(g.language, getLang())}`);
    render();
  },
  'run-analysis': runAnalysis,
  'finish-add': () => go('summary'),
  'more-feedback': () => { const id = state.add.guestId; state.add = freshAdd(); state.add.guestId = id; state.add.step = 2; render(); window.scrollTo(0, 0); },
  'fix-mood': async el => {
    const [entry, s] = findSentence(el);
    if (!s) return;
    s.sentiment = el.dataset.mood;
    s.flags = (s.flags || []).filter(f => f === 'topic-unsure' && s.topic === 'other');
    s.confirmed = s.topic !== 'other';
    await saveEntry(entry);
  },
  'confirm-sent': async el => {
    const [entry, s] = findSentence(el);
    if (!s) return;
    s.confirmed = true;
    s.flags = [];
    await saveEntry(entry);
  },
  'sw-mood': async el => {
    const entry = state.entries.find(e => e.id === el.dataset.entry);
    if (!entry) return;
    const s = entry.sentences?.[0] || { en: '', original: entry.original, topic: 'other', flags: [], confirmed: true, tagged: 'human' };
    s.sentiment = el.dataset.mood;
    entry.sentences = [s];
    await saveEntry(entry);
  },
  period: el => { state.period = el.dataset.period; render(); },
  speak: readAloud,
  'analyze-pending': analyzePending,
  share: shareReport,
  'toggle-draft': el => { state.openGuest = state.openGuest === el.dataset.id ? null : el.dataset.id; render(); },
  'mark-sent': async el => {
    // The link itself opens the email/SMS app; Noor presses send there. We only record it.
    const msg = { id: uid('msg'), guestId: el.dataset.id, lang: el.dataset.lang, status: 'sent', at: new Date().toISOString() };
    await db.put('messages', msg);
    state.messages.push(msg);
    setTimeout(render, 400);
  },
  copy: el => copyText(document.getElementById(el.dataset.copyFrom)?.textContent || ''),
  'delete-guest': el => deleteGuest(el.dataset.id),
  'load-demo': loadDemo,
  'remove-demo': removeDemo,
  wipe: async () => {
    if (!confirm(L('Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.', 'Delete ALL data on this phone? This cannot be undone.'))) return;
    const lang = getLang();
    await db.wipeAll();
    await db.setSetting('lang', lang);
    await loadAll();
    state.add = freshAdd();
    setHost('Noor');
    toast(L('Data yote imefutwa', 'All data deleted'));
    go('choose');
  },
};

const changeHandlers = {
  'company-preview': () => {
    const el = document.getElementById('c-sms');
    if (el) el.textContent = bookingSms(readCompanyForm());
  },
  'company-consent': el => document.getElementById('c-email-wrap')?.classList.toggle('hidden', !el.checked),
  'tr-lang': el => { state.translate.lang = el.value; state.translate.result = ''; state.translate.text = document.getElementById('tr-text')?.value || ''; render(); },
  'consent-toggle': el => document.getElementById('contact-fields')?.classList.toggle('hidden', !el.checked),
  'bk-consent-toggle': el => document.getElementById('bk-email-wrap')?.classList.toggle('hidden', !el.checked),
  box: el => { const i = state.add.inputs.find(x => x.id === el.dataset.id); if (i) i.box = el.value; },
  'fix-topic': async el => {
    const [entry, s] = findSentence(el);
    if (!s) return;
    s.topic = el.value;
    s.flags = (s.flags || []).filter(f => f !== 'topic-unsure');
    s.confirmed = s.topic !== 'other' && s.sentiment !== 'unsure';
    await saveEntry(entry);
  },
  'sw-topic': async el => {
    const entry = state.entries.find(e => e.id === el.dataset.entry);
    if (!entry || !el.value) return;
    const s = entry.sentences?.[0] || { en: '', original: entry.original, sentiment: 'unsure', flags: [], confirmed: true, tagged: 'human' };
    s.topic = el.value;
    entry.sentences = [s];
    await saveEntry(entry);
  },
  // The host's language, chosen in the top-right menu: never only the phone's setting
  'ng-lang': el => { state.add.newLang = el.value; },
  'ui-lang': async el => {
    setLang(el.value === 'sw' ? 'sw' : 'en');
    await db.setSetting('lang', getLang());
    render();
  },
  'share-ok': el => {
    state.shareOk = el.checked;
    const b = document.getElementById('share-btn');
    if (b) b.disabled = !el.checked;
    const c = document.getElementById('cloud-btn');
    if (c) c.disabled = !el.checked;
    const r = document.getElementById('report-sms');
    if (r) { r.classList.toggle('disabled', !el.checked); r.setAttribute('aria-disabled', String(!el.checked)); }
  },
};

let findTimer = null;
const inputHandlers = {
  'input-text': el => { const i = state.add.inputs.find(x => x.id === el.dataset.id); if (i) i.text = el.value; refreshAnalyseButton(); },
  'input-english': el => { const i = state.add.inputs.find(x => x.id === el.dataset.id); if (i) i.english = el.value; },
  'find-q': el => {
    state.find.q = el.value;
    state.find.semantic = null;
    clearTimeout(findTimer);
    findTimer = setTimeout(() => { const pos = el.selectionStart; render(); const q = document.getElementById('find-q'); if (q) { q.focus(); q.setSelectionRange(pos, pos); } }, 250);
    clearTimeout(semanticTimer);
    semanticTimer = setTimeout(() => semanticRank(el.value), 900);
  },
  'bk-v-ref': el => {
    clearTimeout(findTimer);
    findTimer = setTimeout(() => { captureBookForm(); render(); const r = document.getElementById('bk-v-ref'); if (r) { r.focus(); r.setSelectionRange(r.value.length, r.value.length); } }, 400);
  },
};

function refreshAnalyseButton() {
  const b = document.querySelector('[data-action="run-analysis"]');
  if (!b) return;
  const ready = state.add.inputs.some(i => i.status === 'ready' && (i.text || '').trim());
  const working = state.add.inputs.some(i => i.status === 'working');
  b.disabled = !(ready && !working);
}

// ---------------------------------------------------------------- wiring
document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const fn = actions[el.dataset.action];
  if (!fn) return;
  if (el.tagName === 'BUTTON') e.preventDefault();
  if (navigator.vibrate) navigator.vibrate(8);
  if (state.guide.open && el.dataset.action !== 'say' && !el.closest('.guide-card')) closeGuide();
  Promise.resolve(fn(el, e)).catch(err => {
    console.error(err);
    hideBusy();
    toast(`${L('Hitilafu', 'Error')}: ${err.message}`, 6000);
  });
});

document.addEventListener('change', e => {
  const el = e.target;
  if (el.matches('input[type=file][data-file]')) {
    const file = el.files?.[0];
    el.value = '';
    if (!file) return;
    const kind = el.dataset.file;
    const job = kind === 'audio' ? addAudio(file) : addPhoto(file, kind === 'photo-liked' ? 'liked' : 'improve');
    job.catch(err => { hideBusy(); toast(err.message, 6000); });
    return;
  }
  const fn = changeHandlers[el.dataset.change];
  if (fn) Promise.resolve(fn(el)).catch(err => toast(err.message, 6000));
});

document.addEventListener('input', e => {
  const fn = inputHandlers[e.target.dataset?.input];
  if (fn) fn(e.target);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && state.guide.open) closeGuide();
});

window.addEventListener('online', () => { state.online = isOnline(); setOffline(!state.online); captureBookForm(); render(); flushCloudQueue(); });
window.addEventListener('offline', () => { state.online = false; setOffline(true); captureBookForm(); render(); });

// Put everything the page already loaded into the offline cache, so the very first visit
// is enough to work offline afterwards (names of built files change with every build).
async function warmCache() {
  if (!('caches' in window)) return;
  const shell = await caches.open('kitabu-shell-v3');
  const libs = await caches.open('kitabu-libs-v1');
  const urls = new Set([new URL('index.html', location.href).href]);
  for (const e of performance.getEntriesByType('resource')) urls.add(e.name);
  await Promise.all([...urls].map(async u => {
    try {
      const url = new URL(u);
      if (url.pathname.endsWith('/data/bookings.json')) return;
      const cache = url.origin === location.origin ? shell : url.hostname === 'cdn.jsdelivr.net' ? libs : null;
      if (cache && !(await cache.match(u))) await cache.add(u);
    } catch { /* ignore */ }
  }));
}

// Interface language: the saved choice, otherwise the phone's language (Swahili or English).
async function pickUiLang() {
  const saved = await db.getSetting('lang', null);
  if (saved) return saved;
  const tags = navigator.languages || [navigator.language || 'en'];
  return tags.some(t => String(t).toLowerCase().startsWith('sw')) ? 'sw' : 'en';
}

async function start() {
  setLang(await pickUiLang());
  await loadAll();
  // Every launch starts by asking who is holding the phone; the last role is only a memory, never assumed.
  state.screen = 'choose';
  mountBackground(document.getElementById('nature'));
  render();
  await refreshModels();
  render();
  flushCloudQueue();
  if ('serviceWorker' in navigator && import.meta.env?.PROD) {
    navigator.serviceWorker.register('sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then(warmCache)
      .catch(err => console.warn('Offline cache not available', err));
  }
  // Voices load asynchronously on some browsers; voice clips are fetched once for offline use.
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  loadVoiceManifest().then(m => { if (m && isOnline()) prefetchVoice(); });
}

start().catch(err => {
  console.error(err);
  view.innerHTML = `<div class="notice neg"><strong>${L('Hitilafu', 'Error')}</strong>${h(err.message)}</div>`;
});
