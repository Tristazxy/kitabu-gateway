// First-time guide: opens automatically on the first visit and from the "?" button.
// Swahili first, English underneath (hidden with the EN toggle like the rest of the app).

import { L, Li } from './ui.js';

const I = {
  book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',
  print: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  listen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',
};

export const GUIDE_STEPS = [
  {
    icon: I.book,
    title: ['Karibu kwenye Kitabu cha Wageni', 'Welcome to Kitabu cha Wageni'],
    body: [
      ['Wageni wanaandika maoni kwenye kitabu cha karatasi, kwa lugha yao. Programu hii inayasoma na kukueleza kwa Kiswahili walichopenda na wanachotaka kiboreshwe.',
        'Guests write feedback in a paper guestbook, in their own language. This app reads it and tells you in Swahili what they loved and what they want improved.'],
      ['Kila kitu kinabaki kwenye simu hii, na kinafanya kazi bila mtandao.', 'Everything stays on this phone and works offline.'],
    ],
  },
  {
    icon: I.print,
    title: ['1 · Weka kitabu mezani', '1 · Put the guestbook on the table'],
    body: [
      ['Chapisha ukurasa wa kitabu cha wageni. Mgeni anaandika kwenye kisanduku A (alichopenda) na B (kinachoweza kuboreshwa), na anaweka alama kama anakubali uwasiliane naye.',
        'Print the guestbook page. Guests fill box A (what they liked) and box B (what could be better), and tick if you may contact them.'],
    ],
    extra: ['Au bonyeza “Mpe mgeni simu”: mgeni anaandika mwenyewe, kwa lugha yake, kwenye simu yako.',
      'Or tap “Hand the phone to a guest”: they type it themselves, in their language, on your phone.'],
    link: { href: 'print/guestbook.html', label: ['Fungua ukurasa wa kuchapisha', 'Open the printable page'] },
  },
  {
    icon: I.camera,
    title: ['2 · Wikendi: ongeza maoni', '2 · At the weekend: add the feedback'],
    body: [
      ['Msaidizi (k.m. binti yako) anabonyeza “Ongeza maoni”, anachagua mgeni, kisha anapiga picha ya kisanduku A na B.',
        'Your helper (e.g. your daughter) taps “Add feedback”, picks the guest, then photographs box A and box B.'],
      ['Unaweza pia kurekodi sauti ya mgeni au kuandika. Maneno ya njano hayakusomeka vizuri — yarekebishe.',
        'You can also record the guest’s voice or type. Yellow words were hard to read — correct them.'],
    ],
  },
  {
    icon: I.listen,
    title: ['3 · Changanua na usikilize', '3 · Analyse and listen'],
    body: [
      ['Bonyeza “Changanua”. Programu inatafsiri na kupanga maoni. Fungua “Muhtasari” na ubonyeze “Sikiliza” kusikia muhtasari kwa Kiswahili.',
        'Tap “Analyse”. The app translates and sorts the comments. Open “Summary” and tap “Listen” to hear it in Swahili.'],
      ['“Angalia” ya njano = AI haina uhakika. Iangalie pamoja na msaidizi wako.', 'Yellow “Check” = the AI is not sure. Look at it with your helper.'],
    ],
  },
  {
    icon: I.mail,
    title: ['4 · Washukuru wageni', '4 · Thank your guests'],
    body: [
      ['Katika “Wageni”, fungua ujumbe wa shukrani. Umeandikwa kwa lugha ya mgeni, na maana yake kwa Kiswahili iko chini yake.',
        'In “Guests”, open the thank-you message. It is in the guest’s language, with its Swahili meaning underneath.'],
      ['Unatuma wewe mwenyewe, na tu kama mgeni alikubali. AI haitumi chochote.', 'You send it yourself, and only if the guest agreed. The AI never sends anything.'],
    ],
  },
  {
    icon: I.calendar,
    title: ['5 · Wiki ijayo na lugha', '5 · Next week and languages'],
    body: [
      ['Msaidizi akiunganisha mtandao, “Wiki ijayo” inapokea ratiba ya wageni kutoka kwa mwongozaji na kuandaa lugha zao. Simu yako ya kawaida inapata ujumbe mfupi.',
        'When the helper connects, “Next week” receives the guest schedule from the tour company and prepares their languages. Your basic phone gets an SMS.'],
    ],
  },
  {
    icon: I.play,
    title: ['Jaribu sasa', 'Try it now'],
    body: [
      ['Mgeni wa kubuni ameandika maoni kwa Kiingereza. Programu itapakua modeli ndogo mara moja (takriban MB 90), kisha itakuonyesha muhtasari.',
        'An invented guest wrote feedback in English. The app downloads small models once (about 90 MB), then shows you the summary.'],
    ],
    final: true,
  },
];

export function guideHTML(step) {
  const s = GUIDE_STEPS[step];
  const last = step === GUIDE_STEPS.length - 1;
  const dots = GUIDE_STEPS.map((_, i) => `<span class="${i === step ? 'on' : ''}"></span>`).join('');
  const body = [...s.body, ...(s.extra ? [s.extra] : [])].map(([sw, en]) => `<p class="lead">${sw}</p><p class="en" style="margin-top:-4px">${en}</p>`).join('');
  const link = s.link
    ? `<a class="btn secondary block" href="${s.link.href}" target="_blank" rel="noopener" style="margin-top:6px">${L(s.link.label[0], s.link.label[1])}</a>`
    : '';
  const final = s.final ? `
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${L('Jaribu mfano mmoja', 'Try one example')}</button>
      <button class="btn secondary block" data-action="guide-demo">${L('Pakia wageni 6 wa mfano', 'Load 6 example guests')}</button>
      <p class="small muted" style="margin:0">${Li('Wageni 6 wanahitaji lugha 3 zaidi (takriban MB 480 jumla).', '6 guests need 3 more languages (about 480 MB in total).')}</p>
      <button class="btn secondary block" data-action="guide-close">${L('Anza kutumia', 'Start using it')}</button>
    </div>` : '';
  return `
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="Hatua ${step + 1} kati ya ${GUIDE_STEPS.length} · step ${step + 1} of ${GUIDE_STEPS.length}">${dots}</div>
      <button class="guide-close" data-action="guide-close">${Li('Ruka', 'Skip')} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${s.icon}</div>
    <h2 id="guide-title">${s.title[0]}<span class="en">${s.title[1]}</span></h2>
    ${body}
    ${link}
    ${final}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${step === 0 ? 'disabled' : ''}>${L('Rudi', 'Back')}</button>
      ${last ? '' : `<button class="btn" data-action="guide-next">${L('Endelea', 'Next')}</button>`}
    </div>
  </div>`;
}
