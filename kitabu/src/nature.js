// The living background: mountains, a river, bamboo, a few leaves and birds. Plain SVG + CSS animation
// (transforms only, so it stays cheap on a small phone; it stops entirely with prefers-reduced-motion).

const bamboo = (x, h, delay, flip = false) => `
  <g class="bamboo" style="animation-delay:${delay}s" transform="translate(${x} 1600) ${flip ? 'scale(-1 1)' : ''}">
    <rect x="-9" y="-${h}" width="18" height="${h}" rx="9" fill="#6E9F4E"/>
    ${[...Array(Math.floor(h / 110))].map((_, i) => `<rect x="-11" y="-${(i + 1) * 110}" width="22" height="7" rx="3" fill="#4F7A3A"/>`).join('')}
    ${[...Array(Math.floor(h / 160))].map((_, i) => `
      <path d="M0 -${120 + i * 160} q -70 -30 -120 -10 q 60 40 120 10z" fill="#7DAA5A"/>
      <path d="M0 -${180 + i * 160} q 60 -40 110 -20 q -50 40 -110 20z" fill="#8DB86A"/>`).join('')}
  </g>`;

const cloud = (x, y, s, dur) => `
  <g class="cloud" style="animation-duration:${dur}s" transform="translate(${x} ${y}) scale(${s})" fill="#fff" opacity="0.85">
    <ellipse cx="0" cy="0" rx="90" ry="34"/><ellipse cx="-50" cy="8" rx="50" ry="26"/><ellipse cx="55" cy="6" rx="60" ry="30"/><ellipse cx="10" cy="-18" rx="55" ry="30"/>
  </g>`;

const leaf = (x, delay, dur) => `
  <ellipse class="leaf" style="animation-delay:${delay}s;animation-duration:${dur}s" cx="${x}" cy="-30" rx="14" ry="7" fill="#8DB86A" opacity="0.9"/>`;

const bird = (y, dur, delay) => `
  <path class="bird" style="animation-duration:${dur}s;animation-delay:${delay}s" d="M-16 ${y} q 8 -10 16 0 q 8 -10 16 0" fill="none" stroke="#3E5E46" stroke-width="3" stroke-linecap="round"/>`;

export const NATURE_SVG = `
<svg viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE7EE"/><stop offset="0.55" stop-color="#EAF2EA"/><stop offset="1" stop-color="#F4EFE3"/></linearGradient>
    <radialGradient id="nsun"><stop offset="0" stop-color="#FFE7A8"/><stop offset="0.5" stop-color="#F8D57E" stop-opacity="0.9"/><stop offset="1" stop-color="#F8D57E" stop-opacity="0"/></radialGradient>
    <linearGradient id="nriver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5FA8C7"/><stop offset="1" stop-color="#8CC6DC"/></linearGradient>
  </defs>
  <rect width="1000" height="1600" fill="url(#nsky)"/>
  <circle class="sun" cx="780" cy="260" r="150" fill="url(#nsun)"/>
  <circle cx="780" cy="260" r="60" fill="#FFD36E"/>
  ${cloud(120, 220, 1, 70)}${cloud(600, 140, 0.7, 95)}${cloud(900, 330, 0.55, 80)}
  ${bird(0, 46, 0)}${bird(40, 58, 18)}
  <!-- far mountains, misty -->
  <path d="M-50 760 L120 560 L260 690 L400 500 L560 680 L700 540 L860 700 L1050 580 L1050 1000 L-50 1000z" fill="#A9C4CE"/>
  <path d="M400 500 L440 560 L360 560z M700 540 L735 592 L665 592z" fill="#F4F8F8" opacity="0.9"/>
  <rect x="-50" y="700" width="1100" height="120" fill="#E6EEEF" opacity="0.55"/>
  <!-- mid mountains -->
  <path d="M-50 900 L150 700 L330 840 L520 660 L720 860 L900 720 L1050 880 L1050 1100 L-50 1100z" fill="#6F9A8A"/>
  <!-- hills -->
  <path d="M-50 1000 C 150 920 350 940 520 1000 S 850 1040 1050 980 L1050 1600 L-50 1600z" fill="#7DAA5A"/>
  <path d="M-50 1120 C 200 1060 420 1090 620 1140 S 900 1160 1050 1110 L1050 1600 L-50 1600z" fill="#5E8F4A"/>
  <!-- river -->
  <path d="M-50 1200 C 150 1180 260 1260 420 1240 S 700 1180 1050 1230 L1050 1330 C 760 1290 620 1330 420 1340 S 160 1300 -50 1320z" fill="url(#nriver)"/>
  <g class="flow" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity="0.55" stroke-dasharray="40 70">
    <path d="M-50 1250 C 150 1230 260 1300 420 1282 S 700 1225 1050 1272"/>
    <path class="flow2" d="M-50 1290 C 180 1270 300 1320 460 1310 S 720 1265 1050 1300"/>
  </g>
  <path d="M-50 1330 C 300 1360 700 1380 1050 1330 L1050 1600 L-50 1600z" fill="#5E8F4A"/>
  <!-- bamboo at the edges -->
  ${bamboo(40, 900, 0)}${bamboo(110, 700, 1.3)}${bamboo(960, 980, 0.6, true)}${bamboo(890, 760, 2.1, true)}
  ${leaf(180, 0, 14)}${leaf(520, 5, 18)}${leaf(820, 9, 16)}${leaf(330, 12, 20)}
</svg>`;
