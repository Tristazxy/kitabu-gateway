// Two screens for other people holding the phone:
//   visitor  — Noor hands her phone to a guest, who writes feedback in their own language
//   company  — a tour company or guide sends a booking to Noor as a Swahili SMS
// Everything stays on the device; there is no server.

import { h, L, host } from './ui.js';
import { LANGS } from './langs.js';

export const VISITOR_LANGS = ['en', 'it', 'fr', 'de', 'zh', 'es', 'pl', 'sw', 'xx'];

// Human-written visitor-screen text in each language.
export const V = {
  en: {
    title: 'Thank you for visiting!', intro: 'Please tell {host} about your visit, in your own language. It takes one minute.',
    name: 'Your name', liked: 'What did you like most?', improve: 'What could be better?',
    buy: 'Would you buy something to take home?', coffee: 'Coffee', souvenir: 'Souvenirs', email: 'Email (optional)',
    consent: '{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.',
    save: 'Save', needText: 'Please write something in one of the boxes.',
    done: 'Thank you! Your words have been saved on {host}’s phone.', handBack: 'Please give the phone back to {host}.',
    next: 'Next guest', privacy: 'Your words stay on this phone. Tour companies only see totals, never your name.', lang: 'Language',
  },
  it: {
    title: 'Grazie per la visita!', intro: 'Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.',
    name: 'Il tuo nome', liked: 'Cosa ti è piaciuto di più?', improve: 'Cosa potremmo migliorare?',
    buy: 'Compreresti qualcosa da portare a casa?', coffee: 'Caffè', souvenir: 'Souvenir', email: 'Email (facoltativa)',
    consent: '{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.',
    save: 'Salva', needText: 'Scrivi qualcosa in uno dei due riquadri.',
    done: 'Grazie! Le tue parole sono state salvate sul telefono di {host}.', handBack: 'Per favore, restituisci il telefono a {host}.',
    next: 'Prossimo ospite', privacy: 'Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.', lang: 'Lingua',
  },
  fr: {
    title: 'Merci de votre visite !', intro: 'Racontez votre visite à {host}, dans votre langue. Cela prend une minute.',
    name: 'Votre nom', liked: 'Qu’avez-vous le plus aimé ?', improve: 'Qu’est-ce qui pourrait être amélioré ?',
    buy: 'Achèteriez-vous quelque chose à emporter ?', coffee: 'Café', souvenir: 'Souvenirs', email: 'E-mail (facultatif)',
    consent: '{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.',
    save: 'Enregistrer', needText: 'Écrivez quelque chose dans l’une des deux cases.',
    done: 'Merci ! Vos mots sont enregistrés sur le téléphone de {host}.', handBack: 'Merci de rendre le téléphone à {host}.',
    next: 'Visiteur suivant', privacy: 'Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.', lang: 'Langue',
  },
  de: {
    title: 'Danke für Ihren Besuch!', intro: 'Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.',
    name: 'Ihr Name', liked: 'Was hat Ihnen am besten gefallen?', improve: 'Was könnten wir besser machen?',
    buy: 'Würden Sie etwas zum Mitnehmen kaufen?', coffee: 'Kaffee', souvenir: 'Souvenirs', email: 'E-Mail (optional)',
    consent: '{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.',
    save: 'Speichern', needText: 'Bitte schreiben Sie etwas in eines der Felder.',
    done: 'Danke! Ihre Worte sind auf {host}s Telefon gespeichert.', handBack: 'Bitte geben Sie das Telefon an {host} zurück.',
    next: 'Nächster Gast', privacy: 'Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.', lang: 'Sprache',
  },
  zh: {
    title: '感谢您的来访！', intro: '请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。',
    name: '您的名字', liked: '您最喜欢什么？', improve: '有什么可以改进的？',
    buy: '您想买些东西带回家吗？', coffee: '咖啡', souvenir: '纪念品', email: '电子邮箱（可选）',
    consent: '{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。',
    save: '保存', needText: '请至少在一个框里写点什么。',
    done: '谢谢！您的留言已保存在 {host} 的手机上。', handBack: '请把手机还给 {host}。',
    next: '下一位客人', privacy: '您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。', lang: '语言',
  },
  es: {
    title: '¡Gracias por su visita!', intro: 'Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.',
    name: 'Su nombre', liked: '¿Qué le gustó más?', improve: '¿Qué podríamos mejorar?',
    buy: '¿Compraría algo para llevar a casa?', coffee: 'Café', souvenir: 'Recuerdos', email: 'Correo electrónico (opcional)',
    consent: '{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.',
    save: 'Guardar', needText: 'Escriba algo en una de las dos casillas.',
    done: '¡Gracias! Sus palabras se guardaron en el teléfono de {host}.', handBack: 'Por favor, devuelva el teléfono a {host}.',
    next: 'Siguiente visitante', privacy: 'Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.', lang: 'Idioma',
  },
  pl: {
    title: 'Dziękujemy za wizytę!', intro: 'Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.',
    name: 'Twoje imię', liked: 'Co podobało się najbardziej?', improve: 'Co możemy poprawić?',
    buy: 'Czy kupiłbyś coś do zabrania do domu?', coffee: 'Kawa', souvenir: 'Pamiątki', email: 'E-mail (opcjonalnie)',
    consent: '{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.',
    save: 'Zapisz', needText: 'Napisz coś w jednym z pól.',
    done: 'Dziękujemy! Twoje słowa zapisano w telefonie {host}.', handBack: 'Oddaj proszę telefon {host}.',
    next: 'Następny gość', privacy: 'Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.', lang: 'Język',
  },
  sw: {
    title: 'Asante kwa kututembelea!', intro: 'Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.',
    name: 'Jina lako', liked: 'Ulipenda nini zaidi?', improve: 'Nini kiboreshwe?',
    buy: 'Ungependa kununua kitu cha kupeleka nyumbani?', coffee: 'Kahawa', souvenir: 'Zawadi', email: 'Barua pepe (hiari)',
    consent: '{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.',
    save: 'Hifadhi', needText: 'Tafadhali andika kitu kwenye kisanduku kimoja.',
    done: 'Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.', handBack: 'Tafadhali mrudishie {host} simu.',
    next: 'Mgeni anayefuata', privacy: 'Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.', lang: 'Lugha',
  },
};

// Visitor-screen strings with the host's name filled in.
export function visitorStrings(lang) {
  const t = V[lang] || { ...V.en, intro: 'Please tell {host} about your visit. Write in any language you like; it takes one minute.' };
  const out = {};
  for (const [k, v] of Object.entries(t)) out[k] = v.replace(/\{host\}/g, host());
  return out;
}

export function pickVisitorLang() {
  for (const tag of navigator.languages || [navigator.language || 'en']) {
    const code = String(tag).slice(0, 2).toLowerCase();
    if (VISITOR_LANGS.includes(code)) return code;
  }
  return 'en';
}

const ICON_VISITOR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>';

export function visitorHTML(lang, saved, draft = {}) {
  const t = visitorStrings(lang);
  const d = { name: '', liked: '', improve: '', email: '', ...draft };
  const chips = VISITOR_LANGS.map(c => `<button class="chip" data-action="visitor-lang" data-lang="${c}" aria-pressed="${c === lang}">${h(LANGS[c].native)}</button>`).join('');
  if (saved) {
    return `
    <div class="card" lang="${lang}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${ICON_VISITOR}</div>
      <h1>${h(t.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${h(t.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${h(t.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${L(`Kwa ${host()} tu: rudi`, `${host()} only: back`)}</button>`;
  }
  return `
  <div class="row" style="margin-bottom:10px" aria-label="${h(t.lang)}">${chips}</div>
  <div class="card" lang="${lang}">
    <h1>${h(t.title)}</h1>
    <p>${h(t.intro)}</p>
    <div class="stack">
      <label class="field">${h(t.name)}<input type="text" id="v-name" autocomplete="off" value="${h(d.name)}"></label>
      <label class="field">${h(t.liked)}<textarea id="v-liked">${h(d.liked)}</textarea></label>
      <label class="field">${h(t.improve)}<textarea id="v-improve">${h(d.improve)}</textarea></label>
      <fieldset style="border:0;padding:0;margin:0">
        <legend style="font-weight:600;font-size:.95rem;margin-bottom:6px">${h(t.buy)}</legend>
        <div class="row">
          <label class="check"><input type="checkbox" id="v-buy-coffee"> <span>${h(t.coffee)}</span></label>
          <label class="check"><input type="checkbox" id="v-buy-souvenir"> <span>${h(t.souvenir)}</span></label>
        </div>
      </fieldset>
      <label class="field">${h(t.email)}<input type="email" id="v-email" autocomplete="off" value="${h(d.email)}"></label>
      <label class="check"><input type="checkbox" id="v-consent"> <span>${h(t.consent)}</span></label>
      <button class="btn block" data-action="visitor-save">${h(t.save)}</button>
      <p class="small muted" style="margin:0">${h(t.privacy)}</p>
    </div>
  </div>
  <button class="btn small secondary" data-action="visitor-exit">${L(`Kwa ${host()} tu: rudi`, `${host()} only: back`)}</button>`;
}

export function companyHTML({ langOptionsHTML, today, sms, report }) {
  return `
  <h1>${L('Kwa kampuni ya utalii', 'For tour companies')}</h1>
  <p class="small muted">${L(`Tuma ratiba ya wageni kwa ${host()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`, `Send a booking to ${host()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${L(`Namba ya simu ya ${host()}`, `${host()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${L('Tarehe', 'Date')}<input type="date" id="c-date" value="${today}" data-change="company-preview"></label>
        <label class="field">${L('Wageni', 'Guests')}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${L('Lugha ya wageni', 'Guests’ language')}<select id="c-lang" data-change="company-preview">${langOptionsHTML}</select></label>
      <label class="field">${L('Jina la mgeni mkuu', 'Lead guest name')}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${L('Mwongozaji', 'Guide')}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${L(`Mgeni amekubali ${host()} awasiliane naye`, `The guest agreed that ${host()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${L('Barua pepe ya mgeni', 'Guest email')}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${L(`SMS ambayo ${host()} atapokea`, `The SMS ${host()} will get`)}</h2>
    <div class="sms" id="c-sms">${h(sms)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${L(`Tuma SMS kwa ${host()}`, `Send SMS to ${host()}`)}</button>
      <button class="btn secondary" data-action="company-save">${L('Hifadhi kwenye simu hii (onyesho)', 'Save on this phone (demo)')}</button>
    </div>
  </div>
  <div class="card">
    <h2>${L(`Unachopokea kutoka kwa ${host()}`, `What you get back from ${host()}`)}</h2>
    <p class="small">${L('Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.', 'Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.')}</p>
    ${report ? `<div class="sms">${h(report)}</div>` : ''}
  </div>`;
}
