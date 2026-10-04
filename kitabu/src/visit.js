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

// Understands a sentence, not just a keyword: "my friend Emma went to a coffee place near Moshi".
// Scores each host on the words that match, on a friend's name found in the host's guest list,
// and (when the on-device topic model is already on the phone) on meaning. Returns ranked matches
// with the reasons, so the best one can be shown as "locked".
const STOP = new Set('a an the to of in at on for my our their his her and or with near by from went go visit visited place friend friends told said about some that this is was were are be we i they it like want wanting looking'.split(' '));
const words = str => String(str || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter(w => w && !STOP.has(w));

export function rankHosts(query, hosts, guests = [], lang = 'en', semantic = null) {
  const qw = words(query);
  if (!qw.length) return hosts.map(x => ({ host: x, score: 0, reasons: [] }));
  const out = hosts.map(x => {
    const hay = [x.name, x.town, ...(x.tags || []), x.blurb].join(' ').toLowerCase();
    const hayWords = new Set(words(hay));
    let score = 0;
    const reasons = [];
    for (const w of qw) {
      if (hayWords.has(w) || hay.includes(w)) {
        score += (x.town.toLowerCase().includes(w) || x.name.toLowerCase().includes(w)) ? 3 : 1;
        reasons.push(w);
      }
    }
    // a friend's name: the host's own guest list (only on the host's phone; here the demo guests)
    const friend = guests.find(g => qw.includes((g.name || '').toLowerCase().split(' ')[0]));
    if (friend && x.id === 'noor') { score += 6; reasons.push(L(`${friend.name} alitembelea hapa`, `${friend.name} visited here`)); }
    if (semantic && semantic[x.id] != null) score += semantic[x.id] * 4;
    return { host: x, score, reasons: [...new Set(reasons)] };
  });
  return out.sort((a, b) => b.score - a.score);
}

export function findHTML({ q, hosts, lang, loading, ranked, thinking }) {
  const needle = (q || '').trim();
  const rows = needle && ranked ? ranked.filter(r => r.score > 0) : hosts.map(x => ({ host: x, score: 0, reasons: [] }));
  const best = needle && rows.length && rows[0].score >= 3 ? rows[0] : null;
  const card = (r, locked) => `
    <button class="home-btn ${locked ? 'locked' : ''}" data-action="open-host" data-id="${r.host.id}">
      <span class="role-icon ${locked ? 'tile-caramel' : 'tile-leaf'}" aria-hidden="true">${ICON_PIN}</span>
      <span class="role-text">${locked ? `<span class="chip" style="align-self:flex-start;margin-bottom:4px">${L('Mahali pako', 'Best match')}</span>` : ''}<strong>${h(r.host.name)}</strong>
        <span class="small muted">${h(r.host.town)} · ${(r.host.tags || []).slice(0, 3).map(h).join(' · ')}</span>
        ${r.reasons.length ? `<span class="small">${L('Kwa nini', 'Why')}: ${r.reasons.map(h).join(', ')}</span>` : `<span class="small">${L('Lugha', 'Languages')}: ${r.host.languages.map(c => h(langName(c, lang))).join(', ')}</span>`}</span>
    </button>`;
  return `
  <h1>${L('Tafuta mahali pa kutembelea', 'Find a place to visit')}</h1>
  <p class="small muted">${L('Andika unachokumbuka: jina la kijiji, jina la rafiki aliyekwenda, au “shamba la kahawa karibu na Moshi”. Simu inatafuta mahali pako.', 'Type what you remember: a village, the friend who went, or “a coffee farm near Moshi”. The phone finds the place.')}</p>
  <label class="field search">${ICON_SEARCH}<input type="search" id="find-q" value="${h(q || '')}" placeholder="${L('k.m. rafiki yangu Emma alikwenda shamba la kahawa', 'e.g. my friend Emma went to a coffee farm')}" autocomplete="off" data-input="find-q"></label>
  ${loading ? `<p class="muted">${L('Inapakia…', 'Loading…')}</p>` : ''}
  ${thinking ? `<p class="small muted">${L('Inalinganisha maana…', 'Matching by meaning…')}</p>` : ''}
  <div class="stack" style="margin-top:12px">
    ${rows.length ? rows.map((r, i) => card(r, best && i === 0)).join('') : `<div class="notice">${L('Hakuna matokeo. Jaribu jina la kijiji au la rafiki.', 'No results. Try the name of the village or of your friend.')}</div>`}
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

export function tripHTML({ host, booking, lang, phrasebook, saved, audioReady, online = true, requestHref = '' }) {
  const map = `<svg viewBox="0 0 320 170" class="spot-map" role="img" aria-label="map">
    <rect width="320" height="170" rx="12" fill="#E4EFE2"/>
    <path d="M0 120 C 60 90 120 150 200 110 S 290 80 320 100" fill="none" stroke="#8CC6DC" stroke-width="10" stroke-linecap="round"/>
    <path d="M20 40 L70 15 L120 45 L170 10 L230 50 L300 20" fill="none" stroke="#A9C4CE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 150 L120 120 L200 140 L300 125" fill="none" stroke="#7DAA5A" stroke-width="8" stroke-linecap="round"/>
    <circle cx="60" cy="140" r="5" fill="#1F4D3A"/><text x="70" y="145" font-size="12" fill="#1F4D3A">Moshi</text>
    <g transform="translate(205 70)"><path d="M0 22 c -14 -16 -14 -32 0 -32 s 14 16 0 32z" fill="#B2452C"/><circle cy="-10" r="5" fill="#fff"/></g>
    <text x="210" y="100" font-size="12" font-weight="700" fill="#1F4D3A">${h(host.town)}</text>
  </svg>`;
  const phrases = (phrasebook || []).map(p => `
    <li class="row between"><div><strong lang="sw">${h(p.sw)}</strong><div class="small muted">${h(p.en)} · <i>${h(p.say)}</i></div></div>
      <button class="say" data-action="say-phrase" data-clip="${p.id}" data-text="${h(p.sw)}" aria-label="Listen">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'}</button></li>`).join('');
  return `
  <div class="card" style="text-align:center;padding:22px 18px">
    <div class="role-icon tile-caramel" style="margin:0 auto 10px" aria-hidden="true">${ICON_PIN}</div>
    <h1>${online ? L('Ombi limetumwa', 'Request sent') : L('Ombi limehifadhiwa', 'Request saved')}</h1>
    <p class="lead" style="margin:0">${online
      ? L(`${h(host.company)} itathibitisha kwa barua pepe au WhatsApp. Mwenyeji anapata SMS.`, `${h(host.company)} confirms by email or WhatsApp. The host gets an SMS.`)
      : L('Hakuna mtandao sasa. Tuma ombi lako kwa SMS: linafika bila intaneti.', 'No internet right now. Send your request by SMS: it arrives without internet.')}</p>
    ${requestHref ? `<a class="btn ${online ? 'secondary' : ''} block" style="margin-top:12px" href="${requestHref}">${online ? L('Tuma pia kwa SMS', 'Also send by SMS') : L('Tuma ombi kwa SMS', 'Send the request by SMS')}</a>` : ''}
  </div>
  <div class="card">
    <h2>${L('Safari yako', 'Your trip')} <span class="chip">${L('Imehifadhiwa kwenye simu', 'Saved on your phone')}</span></h2>
    <p style="margin:0 0 8px"><strong>${h(host.name)}</strong> · ${h(day(booking.date, lang))} · ${L('wageni', 'guests')} ${h(booking.guests)} · ${h(langName(booking.language, lang))}</p>
    ${map}
    <dl class="kv" style="margin-top:10px">
      <dt>${L('Mahali pa kukutana', 'Meeting point')}</dt><dd>${h(host.meet)}</dd>
      <dt>${L('Njia', 'Getting there')}</dt><dd>${h(host.directions)}</dd>
      <dt>${L('Mwongozaji', 'Guide')}</dt><dd>${h(host.guide)} · ${h(host.phone)}</dd>
    </dl>
    <div class="row" style="margin-top:10px">
      <a class="btn small secondary" href="geo:${host.lat},${host.lng}?q=${host.lat},${host.lng}(${encodeURIComponent(host.name)})">${L('Fungua kwenye ramani', 'Open in maps')}</a>
      <a class="btn small secondary" href="https://www.google.com/maps/search/?api=1&query=${host.lat},${host.lng}" target="_blank" rel="noopener">Google Maps</a>
    </div>
    <p class="small muted" style="margin:8px 0 0">${L('Maelezo haya yanabaki kwenye simu yako bila mtandao.', 'These details stay on your phone, offline.')}</p>
  </div>
  <div class="card">
    <h2>${L('Kiswahili kwa safari yako', 'Swahili for your trip')} ${saved ? `<span class="chip">${L('Imepakuliwa', 'Downloaded')}</span>` : ''}</h2>
    <p class="small muted">${L('Lugha ya mwenyeji, imehifadhiwa kwenye simu yako.', `The host’s language, saved on your phone${audioReady ? ' with sound' : ''}.`)}</p>
    ${saved ? `<ul class="list">${phrases}</ul>` : `<button class="btn block" data-action="download-phrasebook">${L('Pakua misemo 12 (na sauti)', 'Download 12 phrases (with sound)')}</button>`}
  </div>
  <div class="stack">
    <button class="btn secondary block" data-action="go" data-screen="find">${L('Tafuta mahali pengine', 'Find another place')}</button>
    <button class="btn secondary block" data-action="switch-role">${L('Maliza', 'Done')}</button>
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
