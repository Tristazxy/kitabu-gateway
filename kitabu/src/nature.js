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
<svg viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
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

// Real-nature backgrounds: eight short Pexels clips (free licence) that play in turn behind the app,
// each once and forwards. During the last seconds of a clip the next one fades in slowly on top of it
// while both are still moving, so the picture never freezes or jumps; offline (or with data-saver /
// reduced motion) the still frames take turns the same way. The "Video" button in the top bar freezes it.
// Files live in public/kitabu/bg/ (served, not rebuilt): <scene>.mp4 / <scene>-wide.mp4 and .jpg posters.
export const SCENES = {
  mountains: { id: 12492499, by: 'RD King' },
  grove: { id: 12311788, by: 'Anton Lukin' },
  canopy: { id: 6318875, by: 'Vanessa Garcia' },
  cherries: { id: 7116757, by: 'Matthias Groeneveld' },
  stream: { id: 11902892, by: 'Thierry Rossier' },
  flowers: { id: 14482561, by: 'Michael Burrows' },
  dunes: { id: 14483416, by: 'Dubang chang' },
  snow: { id: 19806018, by: 'iPhone Snaps' },
};
export const PLAYLIST = Object.keys(SCENES);
export const sceneCredit = scene => `Pexels video ${SCENES[scene].id} by ${SCENES[scene].by}`;
export const allCredits = () => Object.entries(SCENES).map(([k, v]) => `${v.by} (${v.id})`).join(', ');

const MOTION_KEY = 'wekaribu-motion';
const PHOTO_SECONDS = 12;   // how long each still frame stays when the video cannot play
const FADE_MS = 2400;       // must match the opacity transition in app.css

let root = null;
let index = -1;
let timer = 0;
let motion = true;
const layers = {};

export const currentScene = () => PLAYLIST[Math.max(index, 0)];
export const motionOn = () => motion;

const wide = () => matchMedia('(orientation: landscape)').matches && innerWidth > 700;
const sceneFile = (scene, ext) => `bg/${scene}${wide() ? '-wide' : ''}.${ext}`;

let offline = false; // the app's Offline button (or no connection): still frames only, no clip downloads
function canPlayVideo() {
  const saveData = navigator.connection && navigator.connection.saveData;
  return navigator.onLine && !offline && !saveData && !matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function setOffline(flag) {
  offline = !!flag;
  if (!root) return;
  const el = layers[currentScene()];
  if (!el) return;
  const v = el.querySelector('video');
  if (offline) {
    if (v) { v.pause(); el.classList.remove('video-ready'); } // back to the still frame
    arm(el);
  } else if (motion) {
    const nv = layerFor(currentScene()).querySelector('video');
    if (nv) { if (nv.readyState >= 3) el.classList.add('video-ready'); startVideo(el, nv); }
    arm(el);
  }
}

function addVideo(el, scene) {
  const v = document.createElement('video');
  v.className = 'bg-video';
  v.muted = true; v.loop = false; v.playsInline = true; v.autoplay = false; v.preload = 'auto';
  v.setAttribute('muted', ''); v.setAttribute('playsinline', '');
  v.src = sceneFile(scene, 'mp4');
  el.classList.add('has-video');
  v.addEventListener('canplay', () => { if (canPlayVideo()) el.classList.add('video-ready'); });
  v.addEventListener('error', () => { v.remove(); el.classList.remove('video-ready', 'has-video'); }, { once: true });
  // each clip plays exactly once, forwards; the next one fades in during its last seconds,
  // or as soon as it is ready if the clip ended first
  const isCurrent = () => PLAYLIST[index] === scene; // the old clip stays visible while the next fades in
  v.addEventListener('timeupdate', () => {
    if (!isCurrent() || !isFinite(v.duration) || v.duration - v.currentTime > (FADE_MS + 300) / 1000) return;
    const nv = layerFor(PLAYLIST[nextIndex()]).querySelector('video');
    if (!nv || nv.readyState >= 4) next();
  });
  v.addEventListener('ended', () => { if (isCurrent()) advance(); });
  el.appendChild(v);
  return v;
}

function layerFor(scene) {
  let el = layers[scene];
  if (!el) {
    el = document.createElement('div');
    el.className = 'bg-layer';
    el.dataset.scene = scene;
    el.innerHTML = `<img class="bg-photo" src="${sceneFile(scene, 'jpg')}" alt="">`;
    layers[scene] = el;
    root.appendChild(el);
  }
  if (!el.querySelector('video') && motion && canPlayVideo()) addVideo(el, scene);
  return el;
}

const nextIndex = () => (index + 1) % PLAYLIST.length;

// Start a clip only once the browser expects to play it through without stalling.
function startVideo(el, v) {
  const go = () => { if (el.classList.contains('on') && motion && canPlayVideo() && !document.hidden) v.play().catch(() => {}); };
  if (v.readyState >= 4) go();
  else v.addEventListener('canplaythrough', go, { once: true });
}

// Keep the show going even when the video never starts (low-power mode, offline, slow network).
function arm(el) {
  clearTimeout(timer);
  if (!motion) return;
  const v = el.querySelector('video');
  const playing = v && !v.paused && isFinite(v.duration) && v.duration > 0;
  const seconds = playing ? v.duration - v.currentTime + 5 : PHOTO_SECONDS;
  timer = setTimeout(next, seconds * 1000);
}

function updateCredit() {
  const text = sceneCredit(currentScene());
  for (const c of document.querySelectorAll('.credit')) c.textContent = text;
}

let zTop = 0;
function show(i) {
  const scene = PLAYLIST[i];
  const el = layerFor(scene);
  const prev = index >= 0 ? layers[PLAYLIST[index]] : null;
  const first = index < 0;
  index = i;
  el.style.zIndex = String(++zTop); // the new scene fades in on top of the old one
  if (first) el.classList.add('reset'); // the opening scene is simply there, no fade yet
  void el.offsetWidth; // the start state is applied before the transition
  el.classList.add('on');
  if (first) requestAnimationFrame(() => requestAnimationFrame(() => el.classList.remove('reset')));
  if (prev && prev !== el) {
    // the old scene keeps playing underneath until the new one is fully there, then it is stopped and rewound
    setTimeout(() => {
      prev.classList.remove('on');
      const pv = prev.querySelector('video');
      if (pv) { pv.pause(); try { pv.currentTime = 0; } catch (e) { /* not seekable yet */ } }
    }, FADE_MS + 100);
  }
  const v = el.querySelector('video');
  if (v && motion && canPlayVideo()) {
    if (v.readyState >= 3) el.classList.add('video-ready');
    v.addEventListener('playing', () => { if (el.classList.contains('on')) arm(el); }, { once: true });
    startVideo(el, v);
  } else if (v) {
    el.classList.remove('video-ready'); // offline or data-saver: the still frame
  }
  arm(el);
  layerFor(PLAYLIST[nextIndex()]); // the next clip downloads while this one plays
  updateCredit();
  root.dispatchEvent(new CustomEvent('scenechange', { detail: { scene } }));
}

// The current clip has ended: move on as soon as the next one is ready to play through
// (holding the last frame for at most a few seconds), so the scroll never lands on a stalled clip.
function advance() {
  if (!root || !motion || document.hidden) return;
  const nv = layerFor(PLAYLIST[nextIndex()]).querySelector('video');
  if (nv && nv.readyState < 4) {
    clearTimeout(timer);
    let done = false;
    const go = () => { if (done) return; done = true; nv.removeEventListener('canplaythrough', go); next(); };
    nv.addEventListener('canplaythrough', go, { once: true });
    timer = setTimeout(go, 4000);
    return;
  }
  next();
}

function next() {
  if (!root || !motion || document.hidden) return;
  show(nextIndex());
}

export function setMotion(on) {
  motion = !!on;
  try { localStorage.setItem(MOTION_KEY, motion ? '1' : '0'); } catch (e) { /* private mode */ }
  if (!root) return;
  root.classList.toggle('still', !motion);
  const el = layers[currentScene()];
  if (!motion) {
    clearTimeout(timer);
    const v = el && el.querySelector('video');
    if (v) v.pause();
  } else if (el) {
    const v = layerFor(currentScene()).querySelector('video');
    if (v && v.ended) advance();
    else { if (v) startVideo(el, v); arm(el); }
  }
}
export const toggleMotion = () => setMotion(!motion);

export function mountBackground(el) {
  root = el;
  try { motion = localStorage.getItem(MOTION_KEY) !== '0'; } catch (e) { motion = true; }
  root.classList.toggle('still', !motion);
  document.addEventListener('visibilitychange', () => {
    const cur = layers[currentScene()];
    const v = cur && cur.querySelector('video');
    if (document.hidden) { clearTimeout(timer); if (v) v.pause(); }
    else if (motion && cur) {
      if (v && v.ended) advance();
      else { if (v) startVideo(cur, v); arm(cur); }
    }
  });
  const probe = new Image();
  probe.onload = () => { el.classList.add('real'); show(0); };
  probe.onerror = () => { el.innerHTML = NATURE_SVG; };
  probe.src = sceneFile(PLAYLIST[0], 'jpg');
}
