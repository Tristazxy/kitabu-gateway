// Small UI helpers: escaping, one-language labels, toast, busy/progress panel, speech, dates.

export function h(v) {
  return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------- interface language: one at a time (Swahili or English) ----------
let lang = 'sw';
export const getLang = () => lang;
export function setLang(code) {
  lang = code === 'sw' ? 'sw' : 'en';
  document.documentElement.lang = lang;
}
// Every label is written twice in the code; only the current language is shown.
export const L = (sw, en) => (lang === 'sw' ? sw : en);
export const Li = L;

// The host's name (Noor in the design case). Any farm or homestay can put its own name here.
let hostName = 'Noor';
export const host = () => hostName;
export function setHost(name) {
  hostName = String(name || '').trim().slice(0, 40) || 'Noor';
}

let toastTimer = null;
export function toast(msg, ms = 3200) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), ms);
}

// ---------- busy panel with progress ----------
let busyEl = null;
function ensureBusy() {
  if (busyEl) return busyEl;
  busyEl = document.createElement('div');
  busyEl.className = 'busy hidden';
  busyEl.setAttribute('role', 'status');
  busyEl.setAttribute('aria-live', 'polite');
  busyEl.innerHTML = '<div class="busy-label"></div><div class="progress"><span></span></div><div class="progress-label"></div>';
  document.body.appendChild(busyEl);
  return busyEl;
}
export function showBusy(label) {
  const el = ensureBusy();
  el.querySelector('.busy-label').textContent = label;
  el.querySelector('.progress > span').style.width = '0%';
  el.querySelector('.progress-label').textContent = '';
  el.classList.remove('hidden');
}
export function progress(p) {
  const el = ensureBusy();
  el.classList.remove('hidden');
  if (p.label) el.querySelector('.busy-label').textContent = p.label;
  const f = Math.max(0, Math.min(1, p.fraction || 0));
  el.querySelector('.progress > span').style.width = `${Math.round(f * 100)}%`;
  el.querySelector('.progress-label').textContent = p.total
    ? `${(p.loaded / 1e6).toFixed(0)} / ${(p.total / 1e6).toFixed(0)} MB`
    : p.done ? L('Tayari', 'Ready') : `${Math.round(f * 100)}%`;
}
export function hideBusy() {
  if (busyEl) busyEl.classList.add('hidden');
}

// ---------- speech: the phone's own voice (used when there is no recorded clip) ----------
export function speak(text, code = 'sw') {
  if (!('speechSynthesis' in window)) {
    toast(L('Simu hii haiwezi kusoma kwa sauti.', 'This phone cannot read aloud.'));
    return;
  }
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.toLowerCase().startsWith(code));
  const u = new SpeechSynthesisUtterance(text);
  u.lang = voice ? voice.lang : code === 'sw' ? 'sw-KE' : 'en-US';
  if (voice) u.voice = voice;
  else if (code === 'sw') toast(L('Simu hii haina sauti ya Kiswahili; matamshi yanaweza kuwa mabaya.', 'No Swahili voice on this phone; pronunciation may be off.'), 5000);
  u.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// ---------- dates ----------
export function isoDate(d) {
  const x = new Date(d);
  const m = String(x.getMonth() + 1).padStart(2, '0');
  const day = String(x.getDate()).padStart(2, '0');
  return `${x.getFullYear()}-${m}-${day}`;
}
// Dates are stored as local noon ("YYYY-MM-DDT12:00:00", no zone) so the weekday never shifts by timezone.
export function dayStamp(d) {
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) return `${d}T12:00:00`;
  return `${isoDate(d)}T12:00:00`;
}
export function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
export function daysFromToday(dateStr) {
  const a = new Date(isoDate(new Date()) + 'T00:00:00');
  const b = new Date(isoDate(dateStr) + 'T00:00:00');
  return Math.round((b - a) / 86400000);
}
export function parseLocalDate(s) {
  // "YYYY-MM-DD" -> local midnight (avoids the UTC shift of new Date("YYYY-MM-DD"))
  const [y, m, d] = String(s).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast(L('Imenakiliwa', 'Copied'));
  } catch {
    toast(L('Imeshindwa kunakili', 'Could not copy'));
  }
}
