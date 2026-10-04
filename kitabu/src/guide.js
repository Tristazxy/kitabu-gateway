// First-time guide: three short steps. Opens by itself on the first visit, and from "How to use".

import { L } from './ui.js';

const I = {
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',
  steps: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',
  speaker: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',
};

export const GUIDE_STEPS = [
  {
    icon: I.book,
    title: () => L('Karibu', 'Welcome'),
    body: () => [
      L('Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.',
        'Guests write feedback in their own language. You hear what they said, in Swahili.'),
      L('Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.',
        'Everything stays on this phone and works offline.'),
    ],
  },
  {
    icon: I.steps,
    target: '[data-action="go"][data-screen="add"]',
    title: () => L('Hatua tatu', 'Three steps'),
    list: () => [
      L('Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.', 'A guest writes in the paper guestbook, or you hand them the phone.'),
      L('Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.', 'At the weekend: photograph the page, record a voice note, or type.'),
      L('Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.', 'Listen to the summary and thank guests in their language.'),
    ],
    body: () => [L('Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.', 'Yellow = the AI is not sure. Check it yourself.')],
  },
  {
    icon: I.play,
    target: '[data-action="guide-try"], [data-action="speak"]',
    title: () => L('Jaribu sasa', 'Try it now'),
    body: () => [
      L('Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.',
        'An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.'),
    ],
    final: true,
  },
];

export function guideHTML(step) {
  const s = GUIDE_STEPS[step];
  const last = step === GUIDE_STEPS.length - 1;
  const dots = GUIDE_STEPS.map((_, i) => `<span class="${i === step ? 'on' : ''}"></span>`).join('');
  const list = s.list ? `<ol class="guide-list">${s.list().map(t => `<li>${t}</li>`).join('')}</ol>` : '';
  const body = s.body().map(t => `<p class="lead">${t}</p>`).join('');
  const final = s.final ? `
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${L('Jaribu mfano mmoja', 'Try one example')}</button>
      <button class="btn secondary block" data-action="guide-close">${L('Anza bila mfano', 'Start without it')}</button>
    </div>` : '';
  return `
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${step + 1} / ${GUIDE_STEPS.length}">${dots}</div>
      <button class="guide-close" data-action="guide-close">${L('Ruka', 'Skip')} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${s.icon}</div>
    <h2 id="guide-title">${s.title()} <button class="say" data-action="say" data-clip="${['ui_who', 'ui_add', 'ui_summary'][step] || 'ui_help'}" data-sw="${[...(s.list ? s.list() : []), ...s.body()].join(' ').replace(/"/g, '&quot;')}" data-en="${[...(s.list ? s.list() : []), ...s.body()].join(' ').replace(/"/g, '&quot;')}" aria-label="Sikiliza">${I.speaker}</button></h2>
    ${list}
    ${body}
    ${final}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${step === 0 ? 'disabled' : ''}>${L('Rudi', 'Back')}</button>
      ${last ? '' : `<button class="btn" data-action="guide-next">${L('Endelea', 'Next')}</button>`}
    </div>
  </div>`;
}
