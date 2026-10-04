// WeKaribu — main app: state, screens, actions.
// One home screen; every other screen is one tap away and has a back button.
// The interface shows one language at a time (Swahili or English, following the phone; toggle at the top).

import { db, uid } from './db.js';
import { LANGS, SHARED_MODELS, PACK_MB, packLangs, planPacks, langName, KEEP_TOP_N } from './langs.js';
import { TOPICS, OTHER, topicById, PRODUCTS } from './topics.js';
import { weeklySms, summaryText, thankYou, guideReport, daySw, dayEn, SUBJECTS, bookingSms, strongProduct } from './templates.js';
import { summarize, inPeriod, guestTopLiked, needsCheck } from './summary.js';
import * as ai from './ai.js';
import { analyze } from './pipeline.js';
import { h, L, getLang, setLang, host, setHost, toast, showBusy, progress, hideBusy, speak, isoDate, dayStamp, addDays, daysFromToday, copyText } from './ui.js';
import { summaryClipIds, playClips, prefetchVoice, loadVoiceManifest } from './voice.js';
import { guideHTML, GUIDE_STEPS } from './guide.js';
import { roleChooserHTML, visitorHTML, companyHTML, pickVisitorLang, visitorStrings } from './roles.js';

const view = document.getElementById('view');

const freshAdd = () => ({ step: 1, guestId: null, inputs: [], results: [] });

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
  period: 'month',
  add: freshAdd(),
  recording: false,
  lastSync: null,
  shareOk: false,
  openGuest: null,
  guide: { open: false, step: 0 },
  visitor: { lang: 'en', saved: false, draft: {} },
};

// ---------------------------------------------------------------- data
async function loadAll() {
  const [g, e, b, m] = await Promise.all(['guests', 'entries', 'bookings', 'messages'].map(s => db.all(s)));
  Object.assign(state, { guests: g, entries: e, bookings: b, messages: m });
  state.lastSync = await db.getSetting('lastSync');
  state.role = await db.getSetting('role', null);
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
  if (m === 'pos') return `<span class="chip">${L('Nzuri', 'Positive')}</span>`;
  if (m === 'neg') return `<span class="chip neg">${L('Ya kuboresha', 'To improve')}</span>`;
  return `<span class="chip warn">${L('Haijulikani', 'Unsure')}</span>`;
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

  const summaryCard = s.entries ? `
    <div class="card">
      <div class="card-title"><h2>${L('Wageni walisema', 'What guests said')}</h2><span class="small muted">${PERIODS[state.period]()}</span></div>
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
      ${pending.length ? '' : `<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${L('Jaribu mfano mmoja', 'Try one example')}</button>`}
    </div>`;

  const bigBtn = (attrs, icon, title, sub) => `
    <button class="home-btn" ${attrs}>
      <span class="role-icon" aria-hidden="true">${icon}</span>
      <span class="role-text"><strong>${title}</strong><span class="small muted">${sub}</span></span>
    </button>`;

  const weekSub = next7.length
    ? L(`Wageni ${next7.reduce((n, b) => n + (Number(b.guests) || 1), 0)} siku 7 zijazo`, `${next7.reduce((n, b) => n + (Number(b.guests) || 1), 0)} guests in the next 7 days`)
      + (plan.download.length ? ` · ${L('pakua', 'download')} ${plan.download.map(c => langName(c, getLang())).join(', ')}` : '')
    : L('Pokea ratiba kutoka kwa kampuni ya utalii', 'Get the schedule from the tour company');

  return `
  ${summaryCard}
  <div class="stack">
    ${bigBtn('data-action="go" data-screen="add"', ICON_CAMERA, L('Ongeza maoni ya mgeni', 'Add guest feedback'), L('Picha ya kitabu, sauti au kuandika', 'Photo of the guestbook, voice or typing'))}
    ${bigBtn('data-action="hand-to-guest"', ICON_HAND, L('Mpe mgeni simu aandike', 'Let a guest write'), L('Kwa lugha yake, kwenye simu hii', 'In their own language, on this phone'))}
    ${bigBtn('data-action="go" data-screen="guests"', ICON_MAIL, L('Washukuru wageni', 'Thank guests'), toThank ? L(`Wageni ${toThank} wanasubiri`, `${toThank} waiting`) : L('Ujumbe kwa lugha ya mgeni', 'A message in the guest’s language'))}
    ${bigBtn('data-action="go" data-screen="week"', ICON_CAL, L('Wiki ijayo', 'Next week'), weekSub)}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${L('Jinsi ya kutumia', 'How to use')}</button>
    <button class="link-btn" data-action="switch-role">${L('Badilisha upande', 'Switch side')}</button>
    <button class="link-btn" data-action="go" data-screen="more">${L('Zaidi', 'More')}</button>
  </div>`;
}

// ---------------------------------------------------------------- screen: next week
function screenWeek() {
  const upcoming = state.bookings
    .filter(b => daysFromToday(b.date) >= 0)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const next7 = upcoming.filter(b => daysFromToday(b.date) <= 7);
  const later = upcoming.filter(b => daysFromToday(b.date) > 7);
  const plan = currentPlan();
  const sms = weeklySms(next7);

  const bookingLi = b => `
    <li>
      <div class="row between">
        <strong>${h(day(b.date))}</strong>
        <span class="badge-num" title="guests">${h(b.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${langPill(b.language)} ${packChip(b.language)}
        ${b.guide ? `<span class="muted">${L('Mwongozaji', 'Guide')}: ${h(b.guide)}</span>` : ''}
      </div>
      <div class="small muted" style="margin-top:4px">${h(b.leadName || '')}${b.company ? ` · ${h(b.company)}` : ''}</div>
    </li>`;

  return `
  ${backBtn()}
  <h1>${L('Wiki ijayo', 'Next week')}</h1>

  <div class="card">
    <button class="btn block" data-action="sync" ${state.online ? '' : 'disabled'}>${L('Pokea ratiba mpya', 'Get the new schedule')}</button>
    <p class="small muted" style="margin:8px 0 0">${state.lastSync ? `${L('Mara ya mwisho', 'Last updated')}: ${h(new Date(state.lastSync).toLocaleString())}` : L('Bado haijapokelewa. Inahitaji mtandao mara moja.', 'Not received yet. Needs internet once.')}${state.online ? '' : ` · ${L('Nje ya mtandao', 'Offline')}`}</p>
  </div>

  ${next7.length ? `
  <div class="card">
    <h2>${L('Siku 7 zijazo', 'Next 7 days')}</h2>
    <ul class="list">${next7.map(bookingLi).join('')}</ul>
  </div>` : `
  <div class="notice">${L('Hakuna wageni waliopangwa siku 7 zijazo.', 'No guests booked for the next 7 days.')}</div>`}

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

  <div class="card">
    <h2>${L(`SMS kwa simu ya ${host()}`, `SMS to ${host()}’s basic phone`)}</h2>
    <div class="sms" id="sms-text">${h(sms)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${L('Mfano', 'Preview')} · ${sms.length} ${L('herufi', 'characters')}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${L('Nakili', 'Copy')}</button>
    </div>
  </div>

  ${later.length ? `
  <div class="card">
    <h2>${L('Baadaye', 'Later')}</h2>
    <ul class="list">${later.map(bookingLi).join('')}</ul>
  </div>` : ''}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${L('Ongeza mgeni kwa mkono', 'Add a booking by hand')}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${L('Tarehe', 'Date')}<input type="date" id="bk-date" value="${isoDate(addDays(new Date(), 3))}"></label>
      <div class="grid2">
        <label class="field">${L('Wageni', 'Guests')}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${L('Lugha', 'Language')}<select id="bk-lang">${langOptions('en')}</select></label>
      </div>
      <label class="field">${L('Jina la mgeni mkuu', 'Lead guest name')}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${L('Mwongozaji', 'Guide')}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${L(`Mgeni amekubali ${host()} awasiliane naye`, `Guest agreed that ${host()} may contact them`)}</span></label>
      <label class="field hidden" id="bk-email-wrap">${L('Barua pepe', 'Email')}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${L('Hifadhi', 'Save')}</button>
    </div>
  </details>`;
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

  return `
  <h1>${L('Mgeni ni nani?', 'Who is the guest?')}</h1>

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
    <h2>${L('Mgeni mpya', 'New guest')}</h2>
    <div class="stack">
      <label class="field">${L('Jina', 'Name')}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${L('Lugha ya mgeni', 'Guest’s language')}<select id="ng-lang">${langOptions('en')}</select></label>
      <label class="field">${L('Tarehe ya ziara', 'Visit date')}<input type="date" id="ng-date" value="${isoDate(new Date())}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${L(`Mgeni aliweka alama: ${host()} anaweza kuhifadhi mawasiliano yangu`, `Guest ticked: ${host()} may keep my contact details`)}</span></label>
      <div id="contact-fields" class="stack hidden">
        <label class="field">${L('Barua pepe', 'Email')}<input type="email" id="ng-email" autocomplete="off"></label>
        <label class="field">${L('Simu / WhatsApp', 'Phone / WhatsApp')}<input type="tel" id="ng-phone" autocomplete="off"></label>
      </div>
      <label class="field">${L('Nani alikupendekezea? (hiari)', 'Who recommended us? (optional)')}<input type="text" id="ng-ref" autocomplete="off"></label>
      <button class="btn" data-action="save-new-guest">${L('Endelea', 'Continue')}</button>
    </div>
  </div>

  ${guests.length ? `
  <div class="card">
    <h2>${L('Wageni waliopo', 'Existing guests')}</h2>
    <ul class="list">${guests.map(g => `
      <li class="row between">
        <div><strong>${h(g.name)}</strong> ${langPill(g.language)}<div class="small muted">${h(day(g.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${g.id}">${L('Chagua', 'Pick')}</button>
      </li>`).join('')}
    </ul>
  </div>` : ''}`;
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
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${state.shareOk ? '' : 'disabled'}>${L('Shiriki', 'Share')}</button>
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
    send = `<a class="btn block" data-action="mark-sent" data-id="${g.id}" data-lang="${m.lang}" href="sms:${encodeURIComponent(c.phone)}?body=${encodeURIComponent(m.text)}">${L('Idhinisha na tuma (SMS)', 'Approve and send (SMS)')}</a>`;
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
    <div class="stack">
      <a class="btn secondary" href="eval.html">${L('Jaribio la usahihi', 'Accuracy check')}</a>
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

function screenCompany() {
  const today = isoDate(addDays(new Date(), 3));
  const { s } = currentSummary();
  const report = s.entries ? guideReport(s, L('Mfano', 'Example'), host()) : null;
  const back = state.role === 'company'
    ? `<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${L('Badilisha upande', 'Switch side')}</button>`
    : backBtn();
  return back + companyHTML({
    langOptionsHTML: langOptions('en'), today,
    sms: bookingSms({ date: dayStamp(today), guests: 2, language: 'en', guide: '' }), report,
  });
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
function renderGuide() {
  if (!guideEl) {
    guideEl = document.createElement('div');
    guideEl.className = 'guide-backdrop hidden';
    guideEl.setAttribute('role', 'dialog');
    guideEl.setAttribute('aria-modal', 'true');
    guideEl.setAttribute('aria-labelledby', 'guide-title');
    document.body.appendChild(guideEl);
  }
  guideEl.classList.toggle('hidden', !state.guide.open);
  if (!state.guide.open) { guideEl.innerHTML = ''; return; }
  guideEl.innerHTML = guideHTML(state.guide.step);
  guideEl.querySelector('[data-action="guide-next"], [data-action="guide-try"]')?.focus();
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
  render();
  await analyzePending();
}

// ---------------------------------------------------------------- render
const SCREENS = {
  choose: roleChooserHTML,
  home: screenHome, add: screenAdd, summary: screenSummary, guests: screenGuests, week: screenWeek,
  langs: screenLangs, more: screenMore, company: screenCompany,
  visitor: () => visitorHTML(state.visitor.lang, state.visitor.saved, state.visitor.draft),
};

function render() {
  const sc = state.screen;
  document.body.classList.toggle('mode-visitor', sc === 'visitor' || sc === 'choose');
  document.body.classList.toggle('home', sc === 'home');
  view.innerHTML = SCREENS[sc]();
  document.getElementById('net').textContent = state.online ? L('Mtandaoni', 'Online') : L('Nje ya mtandao', 'Offline');
  const lb = document.getElementById('lang-btn');
  if (lb) lb.textContent = getLang() === 'sw' ? 'English' : 'Kiswahili';
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
  if (!navigator.onLine) {
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
  if (!navigator.onLine) return toast(L('Hakuna mtandao', 'Offline'));
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
    id: uid('g'), name: v('ng-name') || 'Mgeni', language: v('ng-lang') || 'en',
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
async function toggleRecording() {
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
    addAudio(blob).catch(err => toast(err.message));
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
  toast(L('Imekamilika', 'Done'));
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
  await loadAll();
  state.period = 'all';
  go('home');
  toast(L('Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.', 'Example data loaded. Tap “Analyse now”.'), 5000);
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
  if (role === 'visitor') return startVisitor('choose');
  go(role === 'company' ? 'company' : 'home');
  if (role === 'host' && !(await db.getSetting('guideSeen', false))) openGuide(0);
}

const actions = {
  'choose-role': el => chooseRole(el.dataset.role),
  'switch-role': async () => { state.role = null; await db.setSetting('role', null); go('choose'); },
  back: () => go('home'),
  go: el => go(el.dataset.screen),
  'toggle-lang': async () => {
    setLang(getLang() === 'sw' ? 'en' : 'sw');
    await db.setSetting('lang', getLang());
    render();
  },
  'hand-to-guest': () => startVisitor('home'),
  'visitor-lang': el => { captureVisitorDraft(); state.visitor.lang = el.dataset.lang; render(); },
  'visitor-save': saveVisitor,
  'visitor-next': () => { state.visitor = { lang: pickVisitorLang(), saved: false, draft: {} }; render(); window.scrollTo(0, 0); },
  'visitor-exit': async () => {
    const from = await db.getSetting('kiosk', 'home');
    if (from === 'home' && !confirm(L(`Kwa ${host()} tu: rudi nyumbani?`, `${host()} only: back to the home screen?`))) return;
    await db.setSetting('kiosk', false);
    if (from === 'choose') { state.role = null; await db.setSetting('role', null); go('choose'); } else go('home');
  },
  'company-sms': () => {
    const b = readCompanyForm();
    const phone = document.getElementById('c-phone')?.value?.trim() || '';
    if (!phone) { toast(L(`Weka namba ya simu ya ${host()}`, `Add ${host()}’s phone number`)); return; }
    window.location.href = `sms:${encodeURIComponent(phone)}?body=${encodeURIComponent(bookingSms(b))}`;
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
  'share-ok': el => {
    state.shareOk = el.checked;
    const b = document.getElementById('share-btn');
    if (b) b.disabled = !el.checked;
  },
};

const inputHandlers = {
  'input-text': el => { const i = state.add.inputs.find(x => x.id === el.dataset.id); if (i) i.text = el.value; refreshAnalyseButton(); },
  'input-english': el => { const i = state.add.inputs.find(x => x.id === el.dataset.id); if (i) i.english = el.value; },
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

window.addEventListener('online', () => { state.online = true; render(); });
window.addEventListener('offline', () => { state.online = false; render(); });

// Put everything the page already loaded into the offline cache, so the very first visit
// is enough to work offline afterwards (names of built files change with every build).
async function warmCache() {
  if (!('caches' in window)) return;
  const shell = await caches.open('kitabu-shell-v2');
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
  const kiosk = await db.getSetting('kiosk', false);
  if (kiosk) { state.visitor = { lang: pickVisitorLang(), saved: false, draft: {} }; state.screen = 'visitor'; }
  else state.screen = state.role === 'host' ? 'home' : state.role === 'company' ? 'company' : 'choose';
  render();
  if (state.screen === 'home' && !(await db.getSetting('guideSeen', false))) openGuide(0);
  await refreshModels();
  render();
  if ('serviceWorker' in navigator && import.meta.env?.PROD) {
    navigator.serviceWorker.register('sw.js')
      .then(() => navigator.serviceWorker.ready)
      .then(warmCache)
      .catch(err => console.warn('Offline cache not available', err));
  }
  // Voices load asynchronously on some browsers; voice clips are fetched once for offline use.
  if ('speechSynthesis' in window) speechSynthesis.getVoices();
  loadVoiceManifest().then(m => { if (m && navigator.onLine) prefetchVoice(); });
}

start().catch(err => {
  console.error(err);
  view.innerHTML = `<div class="notice neg"><strong>${L('Hitilafu', 'Error')}</strong>${h(err.message)}</div>`;
});
