// Visitor side: find a place, see the days the host can take guests, book.
// The directory (data/hosts.json) is synthetic; the booking goes to the tour company, which sends the
// host an SMS. On this demo phone all three sides share one database, so the request shows up on the
// company screen right away.

import { h, L, isoDate, addDays } from './ui.js';
import { LANGS, langName } from './langs.js';
import { topicById, PRODUCTS } from './topics.js';
import { daySw, dayEn } from './templates.js';

const day = (d, lang) => (lang === 'sw' ? daySw(d) : dayEn(d));

export function hostDays(host, availableSetting, today = new Date()) {
  // The host's own published days win; otherwise the directory's sample offsets.
  if (availableSetting && availableSetting.length) {
    return availableSetting.filter(d => new Date(d) >= addDays(today, -1)).sort();
  }
  return (host.availableOffsets || []).map(o => isoDate(addDays(today, o)));
}

const ICON_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>';
const ICON_PIN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';

export function findHTML({ q, hosts, lang, loading }) {
  const needle = (q || '').trim().toLowerCase();
  const rows = needle
    ? hosts.filter(x => [x.name, x.town, ...(x.tags || [])].join(' ').toLowerCase().includes(needle))
    : hosts;
  const card = x => `
    <button class="home-btn" data-action="open-host" data-id="${x.id}">
      <span class="role-icon tile-leaf" aria-hidden="true">${ICON_PIN}</span>
      <span class="role-text"><strong>${h(x.name)}</strong>
        <span class="small muted">${h(x.town)} · ${(x.tags || []).slice(0, 3).map(h).join(' · ')}</span>
        <span class="small">${L('Lugha', 'Languages')}: ${x.languages.map(c => h(langName(c, lang))).join(', ')}</span></span>
    </button>`;
  return `
  <h1>${L('Tafuta mahali pa kutembelea', 'Find a place to visit')}</h1>
  <p class="small muted">${L('Wenyeji wadogo ambao hawana tovuti wala intaneti. Rafiki akikuambia jina la kijiji, tafuta hapa.', 'Small hosts with no website and no internet. If a friend told you the name of a village, search for it here.')}</p>
  <label class="field search">${ICON_SEARCH}<input type="search" id="find-q" value="${h(q || '')}" placeholder="${L('Kijiji, jina au shughuli… k.m. Materuni', 'Village, name or activity… e.g. Materuni')}" autocomplete="off" data-input="find-q"></label>
  ${loading ? `<p class="muted">${L('Inapakia…', 'Loading…')}</p>` : ''}
  <div class="stack" style="margin-top:12px">
    ${rows.length ? rows.map(card).join('') : `<div class="notice">${L('Hakuna matokeo. Jaribu jina la kijiji.', 'No results. Try the name of the village.')}</div>`}
  </div>
  <p class="small muted" style="margin-top:14px">${L('Orodha ya mfano (data bandia). Toleo halisi linapata orodha kutoka kwa kampuni ya utalii au ofisi ya utalii.', 'Example directory (synthetic). The real version gets the list from the tour company or the tourism office.')}</p>
  <div class="row home-links">
    <button class="link-btn" data-action="hand-to-guest">${L('Umeshatembelea? Andika maoni', 'Already visited? Leave feedback')}</button>
    <button class="link-btn" data-action="switch-role">${L('Badilisha upande', 'Switch side')}</button>
  </div>`;
}

// A public, counts-only line about the host: from the phone's own data when there is any, else the sample.
export function hostSummaryLine(host, s, lang) {
  const name = id => topicById(id)[lang].split(' (')[0].toLowerCase();
  const src = s && s.guests ? {
    guests: s.guests,
    liked: s.liked.filter(x => x.id !== 'other').slice(0, 3).map(x => x.id),
    improve: s.improve.filter(x => x.id !== 'other').slice(0, 2).map(x => x.id),
    products: s.products.map(p => p.id),
  } : host.sample;
  if (!src || !src.guests) return L('Bado hakuna maoni.', 'No feedback yet.');
  const parts = [L(`Wageni ${src.guests} wametoa maoni.`, `${src.guests} guests left feedback.`)];
  if (src.liked.length) parts.push(L(`Walipenda: ${src.liked.map(name).join(', ')}.`, `Loved: ${src.liked.map(name).join(', ')}.`));
  if (src.improve.length) parts.push(L(`Kuboresha: ${src.improve.map(name).join(', ')}.`, `To improve: ${src.improve.map(name).join(', ')}.`));
  if (src.products.length) {
    const ps = src.products.map(id => (PRODUCTS.find(p => p.id === id) || {})[lang] || id);
    parts.push(L(`Bidhaa zinazopatikana: ${ps.join(', ')}.`, `For sale: ${ps.join(', ')}.`));
  }
  return parts.join(' ');
}

export function hostHTML({ host, days, selected, summaryLine, form, lang, knownGuest }) {
  const f = { guests: 2, language: 'en', name: '', email: '', consent: false, referredBy: '', ...form };
  const dayChips = days.length
    ? days.map(d => `<button class="chip" data-action="book-day" data-day="${d}" aria-pressed="${d === selected}">${h(day(d + 'T12:00:00', lang))}</button>`).join('')
    : `<span class="muted">${L('Hakuna siku zilizotangazwa bado. Uliza kampuni ya utalii.', 'No days published yet. Ask the tour company.')}</span>`;
  const langOpts = Object.entries(LANGS).filter(([c]) => c !== 'xx' || true)
    .map(([c, l]) => `<option value="${c}" ${c === f.language ? 'selected' : ''}>${h(l[lang])}${l.native !== l[lang] ? ` (${h(l.native)})` : ''}</option>`).join('');
  return `
  <button class="btn small secondary" data-action="go" data-screen="find" style="margin-bottom:12px">← ${L('Orodha', 'Places')}</button>
  <div class="card hero-card">
    <div class="hero-art" aria-hidden="true">${FARM_ART}</div>
    <h1 style="margin-top:10px">${h(host.name)}</h1>
    <p class="small muted" style="margin-top:-4px">${h(host.town)} · ${(host.tags || []).map(h).join(' · ')}</p>
    <p>${h(host.blurb)}</p>
    <div class="row small">
      <span class="chip plain">${L('Lugha', 'Languages')}: ${host.languages.map(c => h(langName(c, lang))).join(', ')}</span>
      <span class="chip plain">${L('Mwongozaji', 'Guide')}: ${h(host.guide)}</span>
    </div>
    <p class="small muted" style="margin:8px 0 0">${h(host.price)}</p>
  </div>

  <div class="card">
    <h2>${L('Wageni walisema', 'What guests said')}</h2>
    <p style="margin:0">${h(summaryLine)}</p>
    <p class="small muted" style="margin:6px 0 0">${L('Jumla tu, hakuna majina. Imekusanywa kwenye simu ya mwenyeji.', 'Counts only, no names. Collected on the host’s own phone.')}</p>
  </div>

  <div class="card">
    <h2>${L('Weka nafasi', 'Book a visit')}</h2>
    <p class="small muted">${L('Mwenyeji anatangaza siku anazoweza kupokea wageni wiki moja mbele. Ombi lako linakwenda kwa kampuni ya utalii; mwenyeji anapata SMS.', 'The host publishes the days she can take guests a week ahead. Your request goes to the tour company; the host gets an SMS.')}</p>
    <div class="stack">
      <div><div class="field-label">${L('Siku', 'Day')}</div><div class="row">${dayChips}</div></div>
      <div class="grid2">
        <label class="field">${L('Wageni', 'Guests')}<input type="number" id="bk-v-guests" min="1" max="12" value="${f.guests}"></label>
        <label class="field">${L('Lugha yenu', 'Your language')}<select id="bk-v-lang">${langOpts}</select></label>
      </div>
      <label class="field">${L('Jina lako', 'Your name')}<input type="text" id="bk-v-name" value="${h(f.name)}" autocomplete="off"></label>
      <label class="field">${L('Nani alikuambia kuhusu mahali hapa? (hiari)', 'Who told you about this place? (optional)')}<input type="text" id="bk-v-ref" value="${h(f.referredBy)}" autocomplete="off" data-input="bk-v-ref"></label>
      ${knownGuest ? `<div class="notice small">${L(`${h(knownGuest.name)} alitembelea hapa (${h(day(knownGuest.visitDate, lang))}). Mwenyeji atafurahi kujua.`, `${h(knownGuest.name)} visited here (${h(day(knownGuest.visitDate, lang))}). The host will be glad to know.`)}</div>` : ''}
      <label class="field">${L('Barua pepe (hiari)', 'Email (optional)')}<input type="email" id="bk-v-email" value="${h(f.email)}" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-v-consent" ${f.consent ? 'checked' : ''}> <span>${L('Mwenyeji anaweza kuhifadhi barua pepe yangu na kuniandikia baada ya ziara.', 'The host may keep my email and write to me after the visit.')}</span></label>
      <button class="btn block" data-action="book-submit" ${selected ? '' : 'disabled'}>${L('Tuma ombi', 'Send the request')}</button>
      <p class="small muted" style="margin:0">${L('Hakuna malipo hapa. Kampuni ya utalii inathibitisha kwa barua pepe au WhatsApp.', 'No payment here. The tour company confirms by email or WhatsApp.')}</p>
    </div>
  </div>`;
}

export function bookedHTML({ host, booking, lang }) {
  return `
  <div class="card" style="text-align:center;padding:28px 18px">
    <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${ICON_PIN}</div>
    <h1>${L('Ombi limetumwa', 'Request sent')}</h1>
    <p class="lead">${L(`${h(host.company)} itathibitisha. ${h(host.name.split('’')[0])} atapata SMS kwenye simu yake.`, `${h(host.company)} will confirm. The host gets an SMS on a basic phone.`)}</p>
    <div class="card flat" style="text-align:left">
      <div class="small muted">${L('Ombi lako', 'Your request')}</div>
      <p style="margin:6px 0 0"><strong>${h(host.name)}</strong> · ${h(day(booking.date, lang))} · ${L('wageni', 'guests')} ${h(booking.guests)} · ${h(langName(booking.language, lang))}</p>
      ${booking.referredBy ? `<p class="small muted" style="margin:4px 0 0">${L('Alipendekezwa na', 'Recommended by')}: ${h(booking.referredBy)}</p>` : ''}
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="btn block" data-action="go" data-screen="find">${L('Tafuta mahali pengine', 'Find another place')}</button>
      <button class="btn secondary block" data-action="switch-role">${L('Maliza', 'Done')}</button>
    </div>
  </div>`;
}

// Small illustration: hills, sun, a coffee plant with cherries (SVG, no external assets).
export const FARM_ART = `<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
  <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3D9B8"/><stop offset="1" stop-color="#F6EFE6"/></linearGradient></defs>
  <rect width="320" height="120" rx="12" fill="url(#skyg)"/>
  <circle cx="262" cy="34" r="18" fill="#E2A85C"/>
  <path d="M0 96 C 60 60 110 60 170 84 S 280 70 320 92 V120 H0 Z" fill="#8FAE6E"/>
  <path d="M0 108 C 70 84 140 92 200 104 S 300 100 320 108 V120 H0 Z" fill="#5E8A4A"/>
  <path d="M40 112 c 0 -30 10 -50 26 -62" fill="none" stroke="#3E5E30" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="54" cy="70" rx="14" ry="7" transform="rotate(-30 54 70)" fill="#4F7A3C"/>
  <ellipse cx="44" cy="88" rx="14" ry="7" transform="rotate(20 44 88)" fill="#4F7A3C"/>
  <ellipse cx="66" cy="54" rx="13" ry="6" transform="rotate(-50 66 54)" fill="#4F7A3C"/>
  <circle cx="60" cy="82" r="5" fill="#A33F2A"/><circle cx="52" cy="98" r="5" fill="#A33F2A"/><circle cx="70" cy="66" r="5" fill="#C9553C"/><circle cx="46" cy="76" r="4" fill="#C9553C"/>
  <path d="M225 100 h40 l-5 -26 h-30 z" fill="#F6EFE6" stroke="#5B3A24" stroke-width="2"/>
  <path d="M232 90 h26" stroke="#5B3A24" stroke-width="6"/>
  <path d="M266 80 c 8 0 8 14 0 14" fill="none" stroke="#5B3A24" stroke-width="3"/>
  <path d="M238 68 c -4 -6 4 -8 0 -14 M248 66 c -4 -6 4 -8 0 -14" fill="none" stroke="#9A7B63" stroke-width="2" stroke-linecap="round"/>
</svg>`;
