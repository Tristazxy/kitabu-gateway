import{l as $,t as S,P as F,L as y,e as Ma,f as _a,g as Ga,i as $a,c as Fa,a as qa,j as Va,k as r,m as d,h as c,b as I,d as v,n as Ia,o as Ya,q as B,r as R,s as K,u as Ja,p as H,v as Za,w as Qa,x as Xa,y as P,S as A,z as ae,A as ee,B as te,C as ne,D as ie,E as se,F as ha,G as oe,H as ta,O as le,K as xa}from"./ui-c2BRFzY9.js";const de="kitabu",re=1,Ba=["guests","entries","bookings","messages","settings"];let X=null;function ce(){return X||(X=new Promise((a,e)=>{const t=indexedDB.open(de,re);t.onupgradeneeded=()=>{const n=t.result;for(const o of Ba)n.objectStoreNames.contains(o)||n.createObjectStore(o,{keyPath:o==="settings"?"key":"id"})},t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)}),X)}function C(a,e,t){return ce().then(n=>new Promise((o,i)=>{const l=n.transaction(a,e),u=l.objectStore(a);let m;Promise.resolve(t(u)).then(w=>{m=w}),l.oncomplete=()=>o(m),l.onerror=()=>i(l.error),l.onabort=()=>i(l.error)}))}function za(a){return new Promise((e,t)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})}const k={async all(a){return C(a,"readonly",e=>za(e.getAll()))},async get(a,e){return C(a,"readonly",t=>za(t.get(e)))},async put(a,e){return await C(a,"readwrite",t=>{t.put(e)}),e},async putMany(a,e){await C(a,"readwrite",t=>{for(const n of e)t.put(n)})},async del(a,e){await C(a,"readwrite",t=>{t.delete(e)})},async clear(a){await C(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const t=await this.get("settings",a);return t?t.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of Ba)await this.clear(a)}};function j(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const ue=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],me=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function D(a){const e=new Date(a);return`${ue[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function pe(a){const e=new Date(a);return`${me[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function ge(a){if(!a.length)return"Kitabu: Hakuna wageni waliopangwa wiki ijayo.";const e=a.reduce((n,o)=>n+(Number(o.guests)||1),0),t=a.slice().sort((n,o)=>new Date(n.date)-new Date(o.date)).map(n=>`${D(n.date)}: wageni ${n.guests} (${$(n.language,"sw")})${n.guide?`, mwongozaji ${n.guide}`:""}`);return`Kitabu: Wiki ijayo wageni ${e}.
${t.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function La(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function ka(a){return`Kitabu: Wageni wapya. ${D(a.date)}: wageni ${a.guests} (${$(a.language,"sw")})${a.guide?`, mwongozaji ${a.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}function he(a){const e=[],t=[];if(e.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),t.push(`This period: ${a.guests} guests, ${a.entries} feedback entries.`),a.guests===0)return e.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),t.push("No feedback yet. Add guest feedback first."),{sw:e,en:t};a.guests<5&&(e.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),t.push(`Caution: still little feedback (${a.guests} guests). Too early for big decisions.`));const o=a.liked.filter(u=>u.id!=="other").slice(0,3);o.length&&(e.push("Walichopenda zaidi: "+o.map(u=>`${S(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),t.push("What they liked most: "+o.map(u=>`${S(u.id).en.toLowerCase()} (${u.guests} guests)`).join("; ")+"."));const i=a.improve.filter(u=>u.id!=="other").slice(0,3);i.length?(e.push("Wanachotaka kiboreshwe: "+i.map(u=>`${S(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),t.push("What they want improved: "+i.map(u=>`${S(u.id).en.toLowerCase()} (${u.guests} guests)`).join("; ")+".")):(e.push("Hakuna malalamiko yaliyotajwa."),t.push("No complaints were mentioned.")),a.products.length&&(e.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(u=>`${F.find(m=>m.id===u.id).sw} (wageni ${u.guests})`).join("; ")+"."),t.push("Products guests wanted to buy: "+a.products.map(u=>`${F.find(m=>m.id===u.id).en} (${u.guests} guests)`).join("; ")+"."));const l=La(a);if(l){const u=F.find(m=>m.id===l.id);e.push(`Wazo: wageni ${l.guests} kati ya ${a.guests} walitaka ${u.sw}. Unaweza kufikiria kuuza ${u.sw}. Uamuzi ni wako.`),t.push(`Idea: ${l.guests} of ${a.guests} guests wanted ${u.en}. You could consider selling ${u.en}. The decision is yours.`)}return a.unsure>0&&(e.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),t.push(`${a.unsure} sentences were not understood well. Please check them with your helper or the guide.`)),a.swahiliEntries>0&&(e.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),t.push(`${a.swahiliEntries} entries are in Swahili — Noor reads them directly.`)),{sw:e,en:t}}const oa={sw:{liked:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`,plain:a=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`},en:{liked:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — Noor`,plain:a=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — Noor`},it:{liked:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`,plain:a=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`},fr:{liked:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`,plain:a=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`},de:{liked:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`,plain:a=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`},zh:{liked:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`,plain:a=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`},es:{liked:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`,plain:a=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`},pl:{liked:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`,plain:a=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`}};function ke(a,e){const t=oa[a.language]?a.language:"en",n=t!==a.language,o=(a.name||"").trim()||(t==="zh"?"":"friend"),i=e?Ma.find(u=>u.id===e):null,l=u=>i?oa[u].liked(o,i.msg[u]||i.msg.en):oa[u].plain(o);return{lang:t,text:l(t),sw:l("sw"),usedFallback:n}}const ja={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function Ta(a,e){const t=[];t.push(`Ripoti ya maoni — ${e}`),t.push(`Feedback report — ${e}`),t.push(""),t.push(`Wageni / Guests: ${a.guests}`);const n=Object.entries(a.languages).map(([i,l])=>`${y[i]?y[i].en:i} ${l}`).join(", ");n&&t.push(`Lugha / Languages: ${n}`),t.push(""),t.push("Walichopenda / Liked:");for(const i of a.liked.filter(l=>l.id!=="other").slice(0,5))t.push(`  • ${S(i.id).en}: ${i.guests}`);t.push("Kuboresha / To improve:");const o=a.improve.filter(i=>i.id!=="other").slice(0,5);o.length||t.push("  • —");for(const i of o)t.push(`  • ${S(i.id).en}: ${i.guests}`);if(a.products.length){t.push("Bidhaa / Product interest:");for(const i of a.products)t.push(`  • ${F.find(l=>l.id===i.id).en}: ${i.guests}`)}return t.push(""),t.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),t.push("Imeidhinishwa na Noor kabla ya kutumwa. / Approved by Noor before sharing."),t.join(`
`)}function sa(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function we(a,e,t=new Date){if(e==="all")return!0;const n=new Date(a),o=e==="week"?7:e==="month"?31:3650;return t-n<=o*24*3600*1e3&&n-t<=24*3600*1e3}function fe(a,e){const t=Object.fromEntries(e.map(g=>[g.id,g])),n=new Set,o={},i={},l={},u={};let m=0,w=0;const f=(g,p,b,N)=>{g[p]||(g[p]={id:p,guestIds:new Set,quotes:[]}),g[p].guestIds.add(b),N&&g[p].quotes.push(N)};for(const g of a){n.add(g.guestId),g.lang==="sw"&&w++;for(const p of g.sentences||[]){const b=sa(p);b&&m++;const N={entryId:g.id,en:p.en,original:p.original||null,lang:g.lang,flagged:b};p.sentiment==="pos"?f(i,p.topic,g.guestId,N):p.sentiment==="neg"&&f(l,p.topic,g.guestId,N)}for(const p of new Set([...g.products||[],...g.declaredProducts||[]]))f(u,p,g.guestId,null)}for(const g of n){const p=t[g],b=p?p.language:"unknown";o[b]=(o[b]||0)+1}const x=g=>Object.values(g).map(p=>({id:p.id,guests:p.guestIds.size,quotes:p.quotes})).sort((p,b)=>b.guests-p.guests);return{guests:n.size,entries:a.length,liked:x(i),improve:x(l),products:x(u),unsure:m,swahiliEntries:w,languages:o}}function be(a,e){const t={};for(const o of a.filter(i=>i.guestId===e))for(const i of o.sentences||[])i.sentiment==="pos"&&i.topic!=="other"&&(t[i.topic]=(t[i.topic]||0)+1);const n=Object.entries(t).sort((o,i)=>i[1]-o[1])[0];return n?n[0]:null}async function Aa(a,e){const{original:t,lang:n,box:o}=a;if(n==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let i;a.english?i=[{original:null,en:a.english}]:i=(await _a(t,n,e)).pairs;const l=[];for(const g of i)for(const p of Ga(g.en))l.push({en:p,original:g.original});const u=i.map(g=>g.en).join(" ").trim();if(!l.length)return{english:u,sentences:[],products:$a(u),status:"analyzed"};const m=l.map(g=>g.en),w=await Fa(m,e),f=await qa(m,e),x=l.map((g,p)=>{var ya,va;const b=Va(o,f[p]),N=[...b.flags];return w[p].topic==="other"&&N.push("topic-unsure"),{en:g.en,original:g.original,topic:w[p].topic,topicScore:w[p].score,runnerUp:w[p].runnerUp,sentiment:b.sentiment,moodScore:((ya=f[p])==null?void 0:ya.score)??null,modelMood:((va=f[p])==null?void 0:va.label)??null,flags:N,confirmed:!1}});return{english:u,sentences:x,products:$a(u),status:"analyzed"}}let _;async function wa(){if(_!==void 0)return _;try{const a=await fetch("audio/sw/manifest.json");_=a.ok?await a.json():null}catch{_=null}return _}const aa=a=>a>=1&&a<=20?`g_${a}`:"g_more";function ye(a){if(!a.guests)return["no_feedback"];const e=["period",aa(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const t=a.liked.filter(i=>i.id!=="other").slice(0,3);if(t.length){e.push("liked_intro");for(const i of t)e.push(`t_${i.id}`,aa(i.guests))}const n=a.improve.filter(i=>i.id!=="other").slice(0,3);if(n.length){e.push("improve_intro");for(const i of n)e.push(`t_${i.id}`,aa(i.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const i of a.products)e.push(`p_${i.id}`,aa(i.guests))}const o=La(a);return o&&e.push("idea_intro",`p_${o.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let ua=0,q=null;function ve(){ua++,q&&(q.pause(),q=null)}async function $e(a){const e=await wa();if(!e||!a.every(n=>e.files[n]))return!1;ve();const t=++ua;for(const n of a){if(t!==ua)break;await new Promise(o=>{const i=new Audio(`audio/sw/${e.files[n]}`);q=i,i.onended=o,i.onerror=o,i.play().catch(o)})}return q=null,!0}async function xe(){const a=await wa();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}const L={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',listen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>'},W=[{icon:L.book,title:["Karibu kwenye Kitabu cha Wageni","Welcome to Kitabu cha Wageni"],body:[["Wageni wanaandika maoni kwenye kitabu cha karatasi, kwa lugha yao. Programu hii inayasoma na kukueleza kwa Kiswahili walichopenda na wanachotaka kiboreshwe.","Guests write feedback in a paper guestbook, in their own language. This app reads it and tells you in Swahili what they loved and what they want improved."],["Kila kitu kinabaki kwenye simu hii, na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline."]]},{icon:L.print,title:["1 · Weka kitabu mezani","1 · Put the guestbook on the table"],body:[["Chapisha ukurasa wa kitabu cha wageni. Mgeni anaandika kwenye kisanduku A (alichopenda) na B (kinachoweza kuboreshwa), na anaweka alama kama anakubali uwasiliane naye.","Print the guestbook page. Guests fill box A (what they liked) and box B (what could be better), and tick if you may contact them."]],extra:["Au bonyeza “Mpe mgeni simu”: mgeni anaandika mwenyewe, kwa lugha yake, kwenye simu yako.","Or tap “Hand the phone to a guest”: they type it themselves, in their language, on your phone."],link:{href:"print/guestbook.html",label:["Fungua ukurasa wa kuchapisha","Open the printable page"]}},{icon:L.camera,title:["2 · Wikendi: ongeza maoni","2 · At the weekend: add the feedback"],body:[["Msaidizi (k.m. binti yako) anabonyeza “Ongeza maoni”, anachagua mgeni, kisha anapiga picha ya kisanduku A na B.","Your helper (e.g. your daughter) taps “Add feedback”, picks the guest, then photographs box A and box B."],["Unaweza pia kurekodi sauti ya mgeni au kuandika. Maneno ya njano hayakusomeka vizuri — yarekebishe.","You can also record the guest’s voice or type. Yellow words were hard to read — correct them."]]},{icon:L.listen,title:["3 · Changanua na usikilize","3 · Analyse and listen"],body:[["Bonyeza “Changanua”. Programu inatafsiri na kupanga maoni. Fungua “Muhtasari” na ubonyeze “Sikiliza” kusikia muhtasari kwa Kiswahili.","Tap “Analyse”. The app translates and sorts the comments. Open “Summary” and tap “Listen” to hear it in Swahili."],["“Angalia” ya njano = AI haina uhakika. Iangalie pamoja na msaidizi wako.","Yellow “Check” = the AI is not sure. Look at it with your helper."]]},{icon:L.mail,title:["4 · Washukuru wageni","4 · Thank your guests"],body:[["Katika “Wageni”, fungua ujumbe wa shukrani. Umeandikwa kwa lugha ya mgeni, na maana yake kwa Kiswahili iko chini yake.","In “Guests”, open the thank-you message. It is in the guest’s language, with its Swahili meaning underneath."],["Unatuma wewe mwenyewe, na tu kama mgeni alikubali. AI haitumi chochote.","You send it yourself, and only if the guest agreed. The AI never sends anything."]]},{icon:L.calendar,title:["5 · Wiki ijayo na lugha","5 · Next week and languages"],body:[["Msaidizi akiunganisha mtandao, “Wiki ijayo” inapokea ratiba ya wageni kutoka kwa mwongozaji na kuandaa lugha zao. Simu yako ya kawaida inapata ujumbe mfupi.","When the helper connects, “Next week” receives the guest schedule from the tour company and prepares their languages. Your basic phone gets an SMS."]]},{icon:L.play,title:["Jaribu sasa","Try it now"],body:[["Mgeni wa kubuni ameandika maoni kwa Kiingereza. Programu itapakua modeli ndogo mara moja (takriban MB 90), kisha itakuonyesha muhtasari.","An invented guest wrote feedback in English. The app downloads small models once (about 90 MB), then shows you the summary."]],final:!0}];function ze(a){const e=W[a],t=a===W.length-1,n=W.map((u,m)=>`<span class="${m===a?"on":""}"></span>`).join(""),o=[...e.body,...e.extra?[e.extra]:[]].map(([u,m])=>`<p class="lead">${u}</p><p class="en" style="margin-top:-4px">${m}</p>`).join(""),i=e.link?`<a class="btn secondary block" href="${e.link.href}" target="_blank" rel="noopener" style="margin-top:6px">${r(e.link.label[0],e.link.label[1])}</a>`:"",l=e.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${r("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-demo">${r("Pakia wageni 6 wa mfano","Load 6 example guests")}</button>
      <p class="small muted" style="margin:0">${d("Wageni 6 wanahitaji lugha 3 zaidi (takriban MB 480 jumla).","6 guests need 3 more languages (about 480 MB in total).")}</p>
      <button class="btn secondary block" data-action="guide-close">${r("Anza kutumia","Start using it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="Hatua ${a+1} kati ya ${W.length} · step ${a+1} of ${W.length}">${n}</div>
      <button class="guide-close" data-action="guide-close">${d("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${e.icon}</div>
    <h2 id="guide-title">${e.title[0]}<span class="en">${e.title[1]}</span></h2>
    ${o}
    ${i}
    ${l}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${a===0?"disabled":""}>${r("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${r("Endelea","Next")}</button>`}
    </div>
  </div>`}const Da=["en","it","fr","de","zh","es","pl","sw"],na={en:{title:"Thank you for visiting!",intro:"Please tell Noor about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"Noor may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on Noor’s phone.",handBack:"Please give the phone back to Noor.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a Noor la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"Noor può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di Noor.",handBack:"Per favore, restituisci il telefono a Noor.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à Noor, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"Noor peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de Noor.",handBack:"Merci de rendre le téléphone à Noor.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie Noor von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"Noor darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf Noors Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an Noor zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 Noor 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"Noor 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 Noor 的手机上。",handBack:"请把手机还给 Noor。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a Noor cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"Noor puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de Noor.",handBack:"Por favor, devuelva el teléfono a Noor.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz Noor o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"Noor może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie Noor.",handBack:"Oddaj proszę telefon Noor.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze Noor kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"Noor anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya Noor.",handBack:"Tafadhali mrudishie Noor simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function Ea(){for(const a of navigator.languages||[navigator.language||"en"]){const e=String(a).slice(0,2).toLowerCase();if(Da.includes(e))return e}return"en"}const Ca={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'};function je(){const a=(e,t,n,o,i)=>`
    <button class="role-card" data-action="choose-role" data-role="${e}">
      <span class="role-icon" aria-hidden="true">${Ca[e]}</span>
      <span class="role-text"><strong>${t}</strong><span class="en">${n}</span>
        <span class="small">${o}</span><span class="en">${i}</span></span>
    </button>`;return`
  <h1>${r("Karibu! Wewe ni nani?","Welcome! Who are you?")}</h1>
  <div class="stack" style="margin-top:12px">
    ${a("host","Mwenyeji wa shamba (Noor)","Farm host","Ongeza maoni, sikiliza muhtasari, washukuru wageni.","Add feedback, hear the summary, thank guests.")}
    ${a("visitor","Mgeni","Visitor","Andika maoni yako kwa lugha yako, kwenye simu ya Noor.","Leave feedback in your own language, on Noor’s phone.")}
    ${a("company","Kampuni ya utalii au mwongozaji","Tour company or guide","Tuma ratiba ya wageni kwa Noor kwa ujumbe mfupi.","Send guest bookings to Noor by SMS.")}
  </div>
  <p class="small muted" style="margin-top:14px">${d("Unaweza kubadilisha baadaye kwenye ⋯ (Zaidi).","You can switch later under ⋯ (More).")}</p>`}function Se(a,e,t={}){const n=na[a]||na.en,o={name:"",liked:"",improve:"",email:"",...t},i=Da.map(l=>`<button class="chip" data-action="visitor-lang" data-lang="${l}" aria-pressed="${l===a}">${c(y[l].native)}</button>`).join("");return e?`
    <div class="card" lang="${a}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Ca.visitor}</div>
      <h1>${c(n.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${c(n.handBack)}</p>
      <p class="small muted" lang="sw">Mgeni amemaliza — Noor, chukua simu. <span class="en inline">· The guest is done — Noor, take the phone.</span></p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${c(n.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${d("Kwa Noor tu: rudi","Host only: back")}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${c(n.lang)}">${i}</div>
  <div class="card" lang="${a}">
    <h1>${c(n.title)}</h1>
    <p>${c(n.intro)}</p>
    <div class="stack">
      <label class="field">${c(n.name)}<input type="text" id="v-name" autocomplete="off" value="${c(o.name)}"></label>
      <label class="field">${c(n.liked)}<textarea id="v-liked">${c(o.liked)}</textarea></label>
      <label class="field">${c(n.improve)}<textarea id="v-improve">${c(o.improve)}</textarea></label>
      <fieldset style="border:0;padding:0;margin:0">
        <legend style="font-weight:600;font-size:.95rem;margin-bottom:6px">${c(n.buy)}</legend>
        <div class="row">
          <label class="check"><input type="checkbox" id="v-buy-coffee"> <span>${c(n.coffee)}</span></label>
          <label class="check"><input type="checkbox" id="v-buy-souvenir"> <span>${c(n.souvenir)}</span></label>
        </div>
      </fieldset>
      <label class="field">${c(n.email)}<input type="email" id="v-email" autocomplete="off" value="${c(o.email)}"></label>
      <label class="check"><input type="checkbox" id="v-consent"> <span>${c(n.consent)}</span></label>
      <button class="btn block" data-action="visitor-save">${c(n.save)}</button>
      <p class="small muted" style="margin:0">${c(n.privacy)}</p>
    </div>
  </div>
  <button class="btn small secondary" data-action="visitor-exit">${d("Kwa Noor tu: rudi","Host only: back")}</button>`}function Ne({langOptionsHTML:a,today:e,sms:t,report:n}){return`
  <h1>${r("Kwa kampuni ya utalii","For tour companies and guides")}</h1>
  <p class="small muted">${d("Tuma ratiba ya wageni kwa Noor. Atapokea ujumbe mfupi kwa Kiswahili kwenye simu yake ya kawaida — hahitaji intaneti.","Send guest bookings to Noor. She receives a short Swahili SMS on her basic phone — no internet needed.")}</p>
  <div class="card">
    <h2>${r("Ratiba mpya","New booking")}</h2>
    <div class="stack">
      <label class="field">${r("Namba ya simu ya Noor","Noor’s phone number")}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${r("Tarehe","Date")}<input type="date" id="c-date" value="${e}" data-change="company-preview"></label>
        <label class="field">${r("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${r("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${a}</select></label>
      <label class="field">${r("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${r("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${r("Mgeni amekubali Noor awasiliane naye","The guest agreed that Noor may contact them")}</span></label>
      <label class="field hidden" id="c-email-wrap">${r("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${r("Ujumbe ambao Noor atapokea","The SMS Noor will receive")}</h2>
    <div class="sms" id="c-sms">${c(t)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${r("Tuma SMS kwa Noor","Send SMS to Noor")}</button>
      <button class="btn secondary" data-action="company-save">${r("Hifadhi kwenye simu hii (onyesho)","Save on this device (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${r("Utapokea nini kutoka kwa Noor?","What do you receive from Noor?")}</h2>
    <p class="small">${d("Ripoti ya jumla tu: idadi ya wageni, walichopenda, wanachotaka kiboreshwe, bidhaa walizotaka. Hakuna majina, namba wala maneno ya wageni. Noor anaamua kama aitume.","Only a summary report: number of guests, what they liked, what they want improved, products they asked for. No names, contacts or quotes. Noor decides whether to send it.")}</p>
    ${n?`<div class="sms">${c(n)}</div>`:""}
  </div>
  <button class="btn small secondary" data-action="switch-role">${d("Badilisha jukumu","Switch role")}</button>`}const G=document.getElementById("view"),T=()=>({step:1,guestId:null,inputs:[],results:[]}),s={tab:"week",guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:T(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},role:null,visitor:{lang:"en",saved:!1,draft:{}}};async function E(){const[a,e,t,n]=await Promise.all(["guests","entries","bookings","messages"].map(i=>k.all(i)));Object.assign(s,{guests:a,entries:e,bookings:t,messages:n}),s.lastSync=await k.getSetting("lastSync"),s.role=await k.getSetting("role",null);const o=await k.getSetting("showEn",!0);document.body.classList.toggle("hide-en",!o),document.documentElement.classList.toggle("big-text",await k.getSetting("bigText",!1))}async function J(){try{s.installed=await ie();for(const a of Object.keys(A))s.shared[a]=await se(A[a].id)}catch(a){console.warn("model check failed",a)}}const Z=a=>s.guests.find(e=>e.id===a),U=()=>Z(s.add.guestId);function O(){return ne({guests:s.guests,bookings:s.bookings,installed:s.installed,today:new Date})}function fa(){const a=s.entries.filter(t=>t.status!=="pending"&&we(t.visitDate||t.createdAt,s.period)),e=fe(a,s.guests);return{s:e,entries:a,text:he(e)}}const M=a=>`<span class="chip plain lang-pill" title="${c($(a,"en"))}">${c($(a,"sw"))}</span>`;function Me(a){return a==="pos"?`<span class="chip">${d("Nzuri","positive")}</span>`:a==="neg"?`<span class="chip neg">${d("Ya kuboresha","to improve")}</span>`:`<span class="chip warn">${d("Haijulikani","unsure")}</span>`}function Wa(a){return a.consent?`<span class="chip">${d("Ameruhusu mawasiliano","consented to contact")}</span>`:`<span class="chip plain">${d("Hakuna ruhusa","no consent")}</span>`}function Ie(a){var e;return(e=y[a])!=null&&e.mt?s.installed.includes(a)?`<span class="chip">${d("Lugha iko tayari","pack ready")}</span>`:`<span class="chip warn">${d("Pakua lugha","pack needed")}</span>`:`<span class="chip plain">${d("Haihitaji pakiti","no pack needed")}</span>`}const la={"topic-unsure":["Mada haijulikani","topic unclear"],conflict:["Inapingana na kisanduku alichoandika","contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","mood unclear"],"no-model":["Hakuna modeli ya hisia","no sentiment model"]};function ba(a){return Object.entries(y).map(([e,t])=>`<option value="${e}" ${e===a?"selected":""}>${c(t.sw)} · ${c(t.en)} (${c(t.native)})</option>`).join("")}function Pa(a){return[...Ma,le].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${c(e.sw)} · ${c(e.en)}</option>`).join("")}function Oa(a,e,{open:t=!1}={}){const n=a.sentences[e],o=S(n.topic),i=sa(n),l=(n.flags||[]).filter(m=>la[m]),u=n.original&&a.lang!=="en";return`
  <div class="sent">
    ${u?`<div class="orig" lang="${c(a.lang)}">“${c(n.original)}”</div>`:""}
    ${n.en?`<div class="${u?"small muted":""}">${u?"EN: ":""}${c(n.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${n.topic==="other"?"warn":""}">${c(o.sw.split(" (")[0])}<span class="en inline"> · ${c(o.en)}</span></span>
      ${Me(n.sentiment)}
      ${i?`<span class="chip warn">${d("Angalia","check")}</span>`:n.confirmed?`<span class="chip plain">${d("Imethibitishwa","confirmed")}</span>`:""}
    </div>
    ${i&&l.length?`<div class="small muted" style="margin-top:4px">${l.map(m=>`${la[m][0]} <span class="en inline">(${la[m][1]})</span>`).join("; ")}</div>`:""}
    <details ${t||i?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${d("Rekebisha","correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${r("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${Pa(n.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${n.sentiment==="pos"}">${d("Nzuri","positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${n.sentiment==="neg"}">${d("Ya kuboresha","to improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${d("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function Be(a){var t;const e=(t=a.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${c(a.original)}”</div>
    <div class="small muted">${d("Kiswahili — Noor anasoma mwenyewe. Weka mada kwa mkono (hiari).","Swahili — Noor reads it herself. Tag a topic by hand (optional).")}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${c("Mada")} · topic —</option>${Pa(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${d("Nzuri","positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${d("Ya kuboresha","to improve")}</button>
    </div>
  </div>`}function Le(a){var i,l;const e=Z(a.guestId),t=a.box==="liked"?d("Walipenda","liked box"):a.box==="improve"?d("Kuboresha","could-be-better box"):d("Maoni","feedback"),n=a.source==="photo"?d("Picha","photo"):a.source==="voice"?d("Sauti","voice"):d("Imeandikwa","typed");let o;return a.status==="pending"?o=`<p class="muted">${d("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${c(a.lang)}">“${c(a.original)}”</p>`:a.status==="swahili"?o=Be(a):(i=a.sentences)!=null&&i.length?o=a.sentences.map((u,m)=>Oa(a,m)).join(""):o=`<p lang="${c(a.lang)}">“${c(a.original)}”</p><p class="small muted">${d("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${c((e==null?void 0:e.name)||"Mgeni")}</strong> ${M(a.lang)}</div>
      <div class="small muted">${n} · ${t}</div>
    </div>
    ${(l=a.lowWords)!=null&&l.length?`<div class="notice warn small">${d("Maneno ambayo picha haikusomeka vizuri yalirekebishwa na msaidizi.","Words the photo reader was unsure of were checked by the helper.")}</div>`:""}
    ${o}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${d("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}function Te(){const a=s.bookings.filter(l=>ta(l.date)>=0).sort((l,u)=>new Date(l.date)-new Date(u.date)),e=a.filter(l=>ta(l.date)<=7),t=a.filter(l=>ta(l.date)>7),n=O(),o=ge(e),i=l=>`
    <li>
      <div class="row between">
        <strong>${c(D(l.date))} <span class="en inline">· ${c(pe(l.date))}</span></strong>
        <span class="badge-num" title="guests">${c(l.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${M(l.language)} ${Ie(l.language)}
        ${l.guide?`<span class="muted">${d("Mwongozaji","guide")}: ${c(l.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${c(l.leadName||"")}${l.company?` · ${c(l.company)}`:""}</div>
    </li>`;return`
  <div class="card">
    <h2>${r("Unataka kufanya nini?","What do you want to do?")}</h2>
    <div class="grid2">
      <button class="btn big secondary" data-action="go" data-tab="add">${ma}<span class="btn-col">${r("Ongeza maoni","Add feedback")}</span></button>
      <button class="btn big secondary" data-action="go" data-tab="summary">${Ee}<span class="btn-col">${r("Sikiliza muhtasari","Hear the summary")}</span></button>
      <button class="btn big secondary" data-action="go" data-tab="guests">${Ce}<span class="btn-col">${r("Washukuru wageni","Thank guests")}</span></button>
      <button class="btn big" data-action="hand-to-guest">${We}<span class="btn-col">${r("Mpe mgeni simu","Hand the phone to a guest")}</span></button>
    </div>
  </div>

  <h1>${r("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <div class="card-title"><h2>${r("Ratiba kutoka kwa mwongozaji","Schedule from the tour company")}</h2></div>
    <p class="small muted">${d("Msaidizi (k.m. binti yako wikendi) akiunganisha mtandao, ratiba mpya inapakuliwa na lugha zinazohitajika zinaandaliwa.","When the helper connects (e.g. the daughter at the weekend), the new schedule downloads and the needed languages are prepared.")}</p>
    <button class="btn block" data-action="sync" ${s.online?"":"disabled"}>${r("Pokea ratiba mpya","Receive new schedule")}</button>
    <p class="small muted" style="margin-top:8px">${s.lastSync?`${d("Mara ya mwisho","last synced")}: ${c(new Date(s.lastSync).toLocaleString())}`:d("Bado haijapokelewa","not synced yet")}${s.online?"":` · ${d("Nje ya mtandao","offline")}`}</p>
  </div>

  ${e.length?`
  <div class="card">
    <h2>${r("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${e.map(i).join("")}</ul>
  </div>`:`
  <div class="notice">${r("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${r("Ujumbe kwa simu ya Noor","SMS to Noor’s basic phone")}</h2>
    <p class="small muted">${d("Huu ndio ujumbe ambao simu ya kawaida ya Noor ingepokea (mfano; toleo halisi litatuma kwa SMS).","This is the text Noor’s feature phone would receive (simulated; the real version sends it as an SMS).")}</p>
    <div class="sms" id="sms-text">${c(o)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${o.length} ${d("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${d("Nakili","Copy")}</button>
    </div>
  </div>

  <div class="card">
    <h2>${r("Lugha za kuandaa","Languages to prepare")}</h2>
    ${n.download.length?`
      <p>${d("Pakua kabla wageni hawajafika","Download before the guests arrive")}:</p>
      <div class="row">${n.download.map(l=>M(l)).join("")}</div>
      <p class="small muted">${d(`Takriban MB ${n.downloadMB}. Tumia Wi-Fi au kifurushi cha data.`,`About ${n.downloadMB} MB. Use Wi-Fi or a data bundle.`)}</p>
      <button class="btn block" data-action="download-suggested" ${s.online?"":"disabled"}>${r("Pakua sasa","Download now")}</button>
    `:`<p>${d("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${n.removable.length?`
      <hr>
      <p>${d("Lugha nadra zinazoweza kufutwa ili kuokoa nafasi","Rare languages that can be deleted to save space")}:</p>
      <div class="row">${n.removable.map(l=>M(l)).join("")}</div>
      <button class="btn block danger" data-action="delete-removable" style="margin-top:8px">${r(`Futa (MB ${n.freeMB})`,`Delete (${n.freeMB} MB)`)}</button>
    `:""}
  </div>

  ${t.length?`
  <div class="card">
    <h2>${r("Baadaye","Later")}</h2>
    <ul class="list">${t.map(i).join("")}</ul>
  </div>`:""}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${d("Kwa mwongozaji: ongeza mgeni","For the guide: add a booking")}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${r("Tarehe","Date")}<input type="date" id="bk-date" value="${ha(R(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${r("Idadi ya wageni","Number of guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${r("Lugha","Language")}<select id="bk-lang">${ba("en")}</select></label>
      </div>
      <label class="field">${r("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${r("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${r("Mgeni amekubali Noor awasiliane naye","Guest agreed that Noor may contact them")}</span></label>
      <label class="field hidden" id="bk-email-wrap">${r("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${r("Hifadhi","Save")}</button>
    </div>
  </details>`}function Ae(){const a=s.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${a.step>=t?"on":""}"></span>`).join("")}</div>`;return a.step===1?e+Ha():a.step===2?e+Oe():e+He()}function Ha(){const a=s.bookings.filter(t=>{const n=ta(t.date);return n<=1&&n>=-14}).filter(t=>!s.guests.some(n=>n.bookingId===t.id)).sort((t,n)=>new Date(n.date)-new Date(t.date)),e=s.guests.slice().sort((t,n)=>new Date(n.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${r("Mgeni ni nani?","Who is the guest?")}</h1>
  <p class="hint small muted">${d("Chagua mgeni, kisha ongeza picha, sauti au maandishi yake.","Pick the guest, then add their photo, voice or text.")}</p>

  ${a.length?`
  <div class="card">
    <h2>${r("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${c(t.leadName||"Mgeni")}</strong> ${M(t.language)}<div class="small muted">${c(D(t.date))} · ${d("wageni","guests")} ${c(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${d("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  ${e.length?`
  <div class="card">
    <h2>${r("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${c(t.name)}</strong> ${M(t.language)}<div class="small muted">${c(D(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${d("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${r("Mgeni mpya","New guest")}</h2>
    <p class="small muted">${d("Andika kutoka kwenye ukurasa wa kitabu cha wageni.","Copy from the guestbook page.")}</p>
    <div class="stack">
      <label class="field">${r("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${r("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${ba("en")}</select></label>
      <label class="field">${r("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${ha(new Date)}"></label>
      <label class="field">${r("Nani alikupendekezea? (hiari)","Who recommended us? (optional)")}<input type="text" id="ng-ref" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${r("Mgeni aliweka alama: “Noor anaweza kuhifadhi mawasiliano yangu na kuniandikia”","Guest ticked: “Noor may keep my contact details and write to me”")}</span></label>
      <div id="contact-fields" class="stack hidden">
        <label class="field">${r("Barua pepe","Email")}<input type="email" id="ng-email" autocomplete="off"></label>
        <label class="field">${r("Simu / WhatsApp","Phone / WhatsApp")}<input type="tel" id="ng-phone" autocomplete="off"></label>
      </div>
      <p class="small muted">${d("Bila alama hiyo, mawasiliano hayahifadhiwi.","Without that tick, no contact details are stored.")}</p>
      <button class="btn" data-action="save-new-guest">${r("Endelea","Continue")}</button>
    </div>
  </div>`}const ma='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',De='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',Ee='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Ce='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',We='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',Pe='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';function Oe(){var i;const a=U();if(!a)return s.add.step=1,Ha();const e=((i=y[a.language])==null?void 0:i.mt)&&!s.installed.includes(a.language),t=s.add.inputs.some(l=>l.status==="ready"&&(l.text||"").trim()),n=s.add.inputs.some(l=>l.status==="working"),o=l=>{var g;const u=`
      <select data-change="box" data-id="${l.id}" aria-label="Box">
        <option value="liked" ${l.box==="liked"?"selected":""}>Walipenda · liked</option>
        <option value="improve" ${l.box==="improve"?"selected":""}>Kuboresha · could be better</option>
        <option value="unknown" ${l.box==="unknown"?"selected":""}>Haijulikani · not sure</option>
      </select>`,m=l.langHint?`
      <div class="notice warn small">${d(`Inaonekana ni ${$(l.langHint,"sw")}, si ${$(a.language,"sw")}.`,`This looks like ${$(l.langHint,"en")}, not ${$(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${l.langHint}">${d(`Badilisha lugha ya mgeni kuwa ${$(l.langHint,"sw")}`,`Switch guest language to ${$(l.langHint,"en")}`)}</button></div>
      </div>`:"";let w="";l.imageURL&&(w=`<img class="preview-img" src="${l.imageURL}" alt="Photo of the guestbook box">`),l.audioURL&&(w=`<audio controls src="${l.audioURL}" style="width:100%"></audio>`);let f="";return l.status==="working"?f=`<p class="muted">${d("Inasoma…","Reading…")}</p>`:l.status==="error"?f=`<div class="notice neg small">${d("Imeshindwa","Failed")}: ${c(l.error)}</div>`:f=`
        ${(g=l.lowWords)!=null&&g.length?`<div class="notice warn small"><strong>${d("Angalia maneno haya","Check these words")}</strong>${l.lowWords.slice(0,20).map(p=>`<mark class="low">${c(p)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${l.source==="voice"?r("Alichosema mgeni","What the guest said"):r("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${l.id}" lang="${c(a.language)}">${c(l.text)}</textarea></label>
        ${l.source==="voice"&&a.language!=="en"&&a.language!=="sw"?`
        <label class="field small">${r("Tafsiri ya Kiingereza (kutoka kwa modeli ya sauti)","English translation (from the voice model)")}
          <textarea data-input="input-english" data-id="${l.id}" style="min-height:80px">${c(l.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${l.source==="photo"?r("Picha","Photo"):l.source==="voice"?r("Sauti","Voice"):r("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${l.id}">${d("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${w}
        <label class="field small">${r("Kisanduku","Which box")}${u}</label>
        ${m}
        ${f}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${c(a.name)}</strong> ${M(a.language)}<div class="small muted">${c(D(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${d("Badilisha","Change")}</button>
    </div>
    <div class="row" style="margin-top:8px">${Wa(a)}</div>
  </div>

  ${e?`<div class="notice warn">${d(`Lugha ya ${$(a.language,"sw")} haijapakuliwa. Kusoma picha kunawezekana; kuchanganua kutahitaji mtandao mara moja (MB ${P}).`,`The ${$(a.language,"en")} pack is not downloaded. Reading photos works; analysing will need internet once (${P} MB).`)}</div>`:""}

  <h2 class="section-head">${r("Ongeza maoni","Add feedback")}</h2>
  <div class="grid2">
    <label class="btn big">${ma}<span class="btn-col">${r("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${ma}<span class="btn-col">${r("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${s.recording?"danger":"secondary"}" data-action="record">
      ${s.recording?'<span class="rec-dot"></span>':De}<span class="btn-col">${s.recording?r("Simamisha","Stop recording"):r("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${Pe}<span class="btn-col">${r("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${d("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${s.add.inputs.map(o).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!n?"":"disabled"}>${r("Changanua","Analyse")}</button>
  <p class="small muted" style="margin-top:8px">${d("Kila kitu kinabaki kwenye simu hii.","Everything stays on this phone.")}</p>`}function He(){const a=s.add.results.map(n=>s.entries.find(o=>o.id===n)).filter(Boolean),e=U(),t=a.reduce((n,o)=>n+(o.sentences||[]).filter(sa).length,0);return`
  <h1>${r("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${d(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} sentences need a check`)}</strong>${d("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct them or press “OK”.")}</div>`:`<div class="notice">${d("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(Le).join("")}
  <div class="stack">
    <button class="btn" data-action="more-feedback">${r(`Ongeza maoni mengine ya ${c((e==null?void 0:e.name)||"mgeni")}`,"Add more for this guest")}</button>
    <button class="btn secondary" data-action="finish-add">${r("Maliza na uone muhtasari","Finish and see the summary")}</button>
  </div>`}const da={week:["Wiki hii","This week"],month:["Mwezi huu","This month"],all:["Zote","All time"]};function Re(){const a=s.entries.filter(m=>m.status==="pending"),{s:e,entries:t,text:n}=fa(),o=Object.entries(da).map(([m,[w,f]])=>`<button class="chip" data-action="period" data-period="${m}" aria-pressed="${s.period===m}">${w}<span class="en inline"> · ${f}</span></button>`).join(""),i=(m,w)=>m.filter(f=>f.id!=="other").map(f=>{const x=S(f.id),g=e.guests?Math.round(f.guests/e.guests*100):0,p=f.quotes.slice(0,5).map(b=>`
      <blockquote class="q">${b.original&&b.lang!=="en"?`<div class="orig" lang="${c(b.lang)}">“${c(b.original)}”</div><div class="trans">EN: ${c(b.en)}</div>`:`<div class="orig">“${c(b.en)}”</div>`}
      ${b.flagged?`<span class="chip warn" style="margin-top:4px">${d("Angalia","check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><div><strong>${c(x.sw)}</strong><span class="en">${c(x.en)}</span></div><span class="badge-num ${w?"neg":""}">${f.guests}</span></div>
        <div class="bar ${w?"neg":""}"><span style="width:${g}%"></span></div>
        <details class="quotes"><summary>${d("Maneno ya wageni","What guests said")} (${f.quotes.length})</summary>${p}</details>
      </div>`}).join(""),l=[];for(const m of t)(m.sentences||[]).forEach((w,f)=>{sa(w)&&l.push([m,f])});const u=Ta(e,`${da[s.period][0]} / ${da[s.period][1]}`);return`
  <h1>${r("Muhtasari","Summary")}</h1>
  <p class="hint small muted">${d("Hapa unasikia na kusoma walichosema wageni. Bonyeza “Sikiliza”.","Here you hear and read what guests said. Tap “Listen”.")}</p>
  <div class="row" style="margin-bottom:12px">${o}</div>

  ${a.length?`
  <div class="notice warn">
    <strong>${d(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} entries not analysed yet`)}</strong>
    <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${r("Changanua sasa","Analyse now")}</button>
  </div>`:""}

  ${e.entries===0?a.length?"":`
  <div class="card">
    <p>${d("Bado hakuna maoni kwa kipindi hiki.","No feedback for this period yet.")}</p>
    <div class="stack">
      <button class="btn" data-action="go" data-tab="add">${r("Ongeza maoni","Add feedback")}</button>
      <button class="btn secondary" data-action="load-demo">${r("Pakia mfano (data bandia)","Load example (synthetic data)")}</button>
    </div>
  </div>`:`
  <div class="card">
    <div class="card-title"><h2>${r("Kwa Noor","For Noor")}</h2>
      <button class="btn small secondary" data-action="speak" aria-label="Read aloud">${d("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="sw">${n.sw.map(m=>`<p>${c(m)}</p>`).join("")}</div>
    <div class="en small" style="margin-top:6px">${n.en.map(m=>`<p>${c(m)}</p>`).join("")}</div>
    <p class="small muted">${d("Sentensi hizi zimeandikwa na watu mapema; AI imejaza tu idadi na majina ya mada. Uamuzi ni wa Noor.","These sentences are human-written templates; the AI only fills in counts and topic names. Noor decides.")}</p>
  </div>

  ${e.liked.filter(m=>m.id!=="other").length?`<div class="card"><h2>${r("Walichopenda","What they liked")}</h2>${i(e.liked,!1)}</div>`:""}
  ${e.improve.filter(m=>m.id!=="other").length?`<div class="card"><h2>${r("Wanachotaka kiboreshwe","What they want improved")}</h2>${i(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${r("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(m=>{const w=F.find(f=>f.id===m.id);return`<div class="topic-row"><div><strong>${c(w.sw)}</strong><span class="en">${c(w.en)}</span></div><span class="badge-num">${m.guests}</span></div>`}).join("")}
    <p class="small muted">${d("Imepatikana kwa maneno maalum (si makisio).","Found by fixed keywords, not guessed.")}</p>
  </div>`:""}

  ${l.length?`
  <div class="card">
    <h2>${r("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    <p class="small muted">${d("AI haikuwa na uhakika. Angalia pamoja na msaidizi au mwongozaji.","The AI was not sure. Check with the helper or the guide.")}</p>
    ${l.map(([m,w])=>{var f;return`<div class="small muted" style="margin-top:8px">${c(((f=Z(m.guestId))==null?void 0:f.name)||"")} · ${c($(m.lang,"sw"))}</div>${Oa(m,w,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${r("Ripoti kwa mwongozaji / kituo cha utalii","Report for the guide / tourism centre")}</h2>
    <p class="small muted">${d("Hakuna majina, namba wala maneno ya wageni. Inatumwa tu Noor akikubali.","No names, contacts or quotes. Shared only if Noor agrees.")}</p>
    <div class="sms" id="report-text">${c(u)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${s.shareOk?"checked":""}>
      <span>${r("Nimesoma ripoti hii na nakubali ishirikiwe","I have read this report and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${s.shareOk?"":"disabled"}>${r("Shiriki","Share")}</button>
  </div>`}
  `}function Ke(){const a=s.guests.slice().sort((e,t)=>new Date(t.visitDate)-new Date(e.visitDate));return a.length?`
  <h1>${r("Wageni","Guests")}</h1>
  <p class="small muted">${d("Ujumbe wa shukrani umeandikwa na watu katika kila lugha. AI inachagua tu jambo alilopenda mgeni. Noor anaidhinisha kabla ya kutuma.","Thank-you messages are human-written in each language. The AI only picks what the guest liked. Noor approves before anything is sent.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const t=s.entries.filter(i=>i.guestId===e.id).length,n=s.messages.some(i=>i.guestId===e.id&&i.status==="sent"),o=s.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${c(e.name)}</strong> ${M(e.language)}${e.synthetic?` <span class="chip plain">${d("mfano","example")}</span>`:""}</div>
          <span class="small muted">${c(D(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Wa(e)} <span class="muted">${d("maoni","entries")}: ${t}</span>
          ${n?`<span class="chip">${d("Shukrani imetumwa","thanks sent")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${d("Alipendekezwa na","recommended by")}: ${c(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${o?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${d("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${d("Futa","Delete")}</button>
        </div>
        ${o?Ue(e):""}
      </li>`}).join("")}</ul></div>`:`<h1>${r("Wageni","Guests")}</h1>
      <div class="card"><p>${d("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-tab="add">${r("Ongeza maoni","Add feedback")}</button></div>`}function Ue(a){const e=be(s.entries,a.id),t=ke(a,e),n=a.contact||{},o=ja[t.lang]||ja.en;let i;return a.consent?n.email?i=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(n.email)}?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(t.text)}">${r("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:n.phone?i=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(n.phone)}?body=${encodeURIComponent(t.text)}">${r("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:i=`<div class="notice small">${d("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:i=`<div class="notice warn small">${d("Mgeni hakutoa ruhusa ya kuwasiliana — usitume ujumbe.","The guest did not consent to contact — do not send.")}</div>`,`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${d(`Hakuna kiolezo cha ${$(a.language,"sw")} bado — tumetumia Kiingereza.`,`No ${$(a.language,"en")} template yet — using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${d(`Kwa ${$(t.lang,"sw")}`,`In ${$(t.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${c(t.text)}</p></div>
    <div class="card flat" lang="sw"><div class="small muted">${d("Maana yake kwa Kiswahili","What it says, in Swahili")}</div><p style="margin:6px 0 0">${c(t.sw)}</p></div>
    <p class="small muted">${e?d(`Mada aliyopenda: ${S(e).sw}`,`Liked topic: ${S(e).en}`):d("Hakuna mada iliyo wazi — ujumbe wa jumla.","No clear liked topic — general message.")}</p>
    ${i}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${d("Nakili","Copy")}</button>
  </div>`}function _e(){const a=O(),e=n=>{const o=y[n],i=s.installed.includes(n),l=[];return a.keep.includes(n)&&l.push(`<span class="chip">${d("Inakaa daima","kept")}</span>`),a.needed.includes(n)&&l.push(`<span class="chip warn">${d("Wiki ijayo","needed next week")}</span>`),i&&a.removable.includes(n)&&l.push(`<span class="chip plain">${d("Nadra","rare")}</span>`),`
      <div class="pack">
        <div><strong>${c(o.sw)}</strong> <span class="muted small">${c(o.native)}</span><span class="en">${c(o.en)} · ${i?"downloaded":"not downloaded"} · ~${P} MB</span>
          <div class="row" style="margin-top:4px">${i?`<span class="chip">${d("Imepakuliwa","on phone")}</span>`:""}${l.join("")}</div></div>
        ${i?`<button class="btn small danger" data-action="delete-pack" data-lang="${n}">${d("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${n}" ${s.online?"":"disabled"}>${d("Pakua","Get")}</button>`}
      </div>`},t=n=>{const o=A[n],i=s.shared[n];return`
      <div class="pack">
        <div><strong>${c(o.sw)}</strong><span class="en">${c(o.en)} · ${c(o.id)} · ~${o.mb} MB</span></div>
        ${i?`<span class="chip">${d("Tayari","ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${n}" ${s.online?"":"disabled"}>${d("Pakua","Get")}</button>`}
      </div>`};return`
  <h1>${r("Lugha","Languages")}</h1>
  <div class="notice">
    <strong>${d(`Lugha ${xa+2} muhimu`,`${xa+2} essential languages`)}</strong>
    ${d("Kiswahili na Kiingereza daima, pamoja na lugha 3 za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.","Swahili and English always, plus the 3 most common guest languages. Others are downloaded before a guest arrives and can be deleted afterwards.")}
  </div>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${r("Lugha kuu","Core languages")}</h2>
    <div class="pack"><div><strong>Kiswahili</strong><span class="en">Swahili · Noor’s language: all screens, summaries and messages are human-written templates, no download</span></div><span class="chip">${d("Ndani","built in")}</span></div>
    <div class="pack"><div><strong>Kiingereza</strong><span class="en">English · the pivot language the classifier works in, no download</span></div><span class="chip">${d("Ndani","built in")}</span></div>
  </div>

  <div class="card">
    <h2>${r("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${d("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(A).map(t).join("")}
  </div>

  <div class="card">
    <h2>${r("Lugha za wageni","Guest language packs")}</h2>
    <p class="small muted">${a.usedDefaults?d("Bado hakuna historia ya kutosha: tunatumia nchi zinazoleta wageni wengi Tanzania (NBS 2024): Italia, Ufaransa, Ujerumani.","Not enough history yet: using Tanzania’s top non-African, non-English source markets (NBS 2024): Italy, France, Germany."):d("Lugha zinazokaa zimechaguliwa kutoka historia ya wageni wa Noor.","Kept languages are chosen from Noor’s own guest history.")}</p>
    ${a.recommend.length?`
      <div class="notice small" style="margin-top:4px">${d(`Inapendekezwa kupakua ukiwa na Wi-Fi: ${a.recommend.map(n=>y[n].sw).join(", ")} (MB ${a.recommendMB}).`,`Recommended when on Wi-Fi: ${a.recommend.map(n=>y[n].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${s.online?"":"disabled"}>${d("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${oe().map(e).join("")}
    <p class="small muted" style="margin-top:12px">${d(`Kila pakiti ni takriban MB ${P} (modeli ya tafsiri iliyobanwa + data ya kusoma maandishi). Toleo la Android litatumia ML Kit (karibu MB 30 kwa lugha).`,`Each pack is about ${P} MB (quantized translation model + text-reading data). An Android version would use ML Kit (about 30 MB per language).`)}</p>
  </div>`}function Ge(){const a=s.guests.some(e=>e.synthetic);return`
  <h1>${r("Zaidi","More")}</h1>

  <div class="card">
    <h2>${r("Jinsi ya kutumia","How to use it")}</h2>
    <div class="stack">
      <button class="btn block" data-action="guide-open">${r("Fungua mwongozo","Open the guide")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?r("Herufi za kawaida","Normal text size"):r("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="switch-role">${r("Badilisha jukumu (mwenyeji, mgeni, kampuni)","Switch role (host, visitor, company)")}</button>
    </div>
  </div>

  <div class="card">
    <h2>${r("Kurasa za kuchapisha","Printable pages")}</h2>
    <div class="stack">
      <a class="btn secondary" href="print/guestbook.html" target="_blank" rel="noopener">${r("Ukurasa wa kitabu cha wageni","Guestbook page")}</a>
      <a class="btn secondary" href="print/sales-log.html" target="_blank" rel="noopener">${r("Daftari la mauzo","Sales log page")}</a>
      <p class="small muted" style="margin:0">${d("Kusoma daftari la mauzo kwa picha ni hatua inayofuata.","Reading the sales log from a photo is the next step.")}</p>
    </div>
  </div>

  <div class="card">
    <h2>${r("Data ya mfano","Example data")}</h2>
    <p class="small muted">${d("Wageni 6 wa kubuni na maoni kwa Kiitaliano, Kifaransa, Kichina, Kiingereza na Kiswahili. Ni data bandia, imeandikwa na timu.","6 invented guests with feedback in Italian, French, Chinese, English and Swahili. Synthetic, written by the team.")}</p>
    ${a?`<button class="btn danger" data-action="remove-demo">${r("Ondoa data ya mfano","Remove example data")}</button>`:`<button class="btn secondary" data-action="load-demo">${r("Pakia data ya mfano","Load example data")}</button>`}
  </div>

  <div class="card">
    <h2>${r("Faragha","Privacy")}</h2>
    <ul class="small" style="padding-left:18px;margin:0">
      <li>${d("Data yote iko kwenye simu hii tu (hakuna seva).","All data stays on this phone (no server).")}</li>
      <li>${d("Mawasiliano ya mgeni yanahifadhiwa tu akiweka alama ya ruhusa.","Guest contact details are stored only with the consent tick.")}</li>
      <li>${d("Ripoti ya mwongozaji haina majina, namba wala maneno ya wageni.","The guide report has no names, contacts or quotes.")}</li>
      <li>${d("Simu ikipotea: weka nenosiri kwenye simu; data inaweza kufutwa hapa.","If the phone is lost: use a phone lock; data can be wiped here.")}</li>
    </ul>
    <button class="btn danger block" style="margin-top:12px" data-action="wipe">${r("Futa data zote","Delete all data")}</button>
  </div>

  <div class="card">
    <h2>${r("Kuhusu","About")}</h2>
    <p class="small">${d("Imejengwa kwa Hack-Nation × World Bank Small AI for Development (utalii).","Built for the Hack-Nation × World Bank Small AI for Development hackathon (tourism track).")}</p>
    <div class="stack">
      <a class="btn secondary" href="eval.html">${r("Jaribio la usahihi","Accuracy check")}</a>
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${r("Vyanzo vya data na mipaka","Data sources and limits")}</a>
    </div>
  </div>`}function pa(){var n;const a=o=>{var i,l;return((l=(i=document.getElementById(o))==null?void 0:i.value)==null?void 0:l.trim())||""},e=!!((n=document.getElementById("c-consent"))!=null&&n.checked),t=a("c-date");return{id:j("bk"),date:B(t||R(new Date,3)),guests:Math.max(1,Number(a("c-guests"))||1),leadName:a("c-name")||"Mgeni",language:a("c-lang")||"en",guide:a("c-guide"),company:"",consent:e,email:e?a("c-email"):""}}function Fe(){const a=ha(R(new Date,3)),{s:e}=fa(),t=e.entries?Ta(e,"Mfano · Example"):null;return Ne({langOptionsHTML:ba("en"),today:a,sms:ka({date:B(a),guests:2,language:"en",guide:""}),report:t})}function qe(){const a=e=>{var t;return((t=document.getElementById(e))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(s.visitor.draft={name:a("v-name"),liked:a("v-liked"),improve:a("v-improve"),email:a("v-email")})}async function Ve(){var w,f,x;const a=g=>{var p,b;return((b=(p=document.getElementById(g))==null?void 0:p.value)==null?void 0:b.trim())||""},e=s.visitor.lang,t=na[e]||na.en,n=a("v-liked"),o=a("v-improve");if(!n&&!o){v(t.needText);return}const i=!!((w=document.getElementById("v-consent"))!=null&&w.checked),l=[(f=document.getElementById("v-buy-coffee"))!=null&&f.checked?"coffee":null,(x=document.getElementById("v-buy-souvenir"))!=null&&x.checked?"souvenir":null].filter(Boolean),u={id:j("g"),name:a("v-name")||"Mgeni",language:e,visitDate:B(new Date),consent:i,contact:i?{email:a("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await k.put("guests",u);let m=!0;for(const[g,p]of[["liked",n],["improve",o]])p&&(await k.put("entries",{id:j("fb"),guestId:u.id,lang:e,source:"visitor",box:g,original:p,status:"pending",sentences:[],products:[],declaredProducts:m?l:[],visitDate:u.visitDate,createdAt:new Date().toISOString()}),m=!1);await E(),s.visitor={lang:e,saved:!0,draft:{}},h(),window.scrollTo(0,0)}let z=null;function Ra(){var a;if(z||(z=document.createElement("div"),z.className="guide-backdrop hidden",z.setAttribute("role","dialog"),z.setAttribute("aria-modal","true"),z.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(z)),z.classList.toggle("hidden",!s.guide.open),!s.guide.open){z.innerHTML="";return}z.innerHTML=ze(s.guide.step),(a=z.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||a.focus()}function V(a=0){s.guide={open:!0,step:a},Ra()}async function ia(){s.guide.open=!1,Ra(),await k.setSetting("guideSeen",!0)}async function Ye(){await ia();const a="demo_quick";if(!Z(a)){const e={id:a,name:"Emma (mfano)",language:"en",visitDate:B(R(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await k.put("guests",e);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const n of["liked","improve"])await k.put("entries",{id:`${a}_${n}`,guestId:a,lang:"en",source:"typed",box:n,original:t[n],status:"pending",sentences:[],products:[],visitDate:e.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await E()}s.period="all",s.tab="summary",h(),await Ua()}const Je={week:Te,add:Ae,summary:Re,guests:Ke,langs:_e,more:Ge};function h(){const a=s.role||"choose";for(const e of["choose","visitor","company"])document.body.classList.toggle(`mode-${e}`,a===e);document.body.classList.toggle("no-tabs",a!=="host"),a==="choose"?G.innerHTML=je():a==="visitor"?G.innerHTML=Se(s.visitor.lang,s.visitor.saved,s.visitor.draft):a==="company"?G.innerHTML=Fe():G.innerHTML=Je[s.tab](),document.querySelectorAll(".tabbar button").forEach(e=>e.setAttribute("aria-current",e.dataset.tab===s.tab?"page":"false")),document.getElementById("net").innerHTML=s.online?d("Mtandaoni","online"):d("Nje ya mtandao","offline"),s.tab==="langs"&&Xa().then(e=>{const t=document.getElementById("storage-line");t&&e&&(t.innerHTML=d(`Nafasi iliyotumika: MB ${e.usedMB} kati ya MB ${e.quotaMB}`,`Storage used: ${e.usedMB} MB of ${e.quotaMB} MB`))})}async function Q(a){if(!a.length)return!0;const e=a.reduce((n,[o,i])=>n+(o==="pack"?P:A[i].mb),0);if(!navigator.onLine)return v("Hakuna mtandao. Pakua lugha wikendi msaidizi akiwa na mtandao. · Offline: download packs when connected.",6e3),!1;const t=a.map(([n,o])=>n==="pack"?y[o].en:A[o].en).join(", ");if(!confirm(`Pakua mara moja: takriban MB ${e} (${t}). Endelea?

One-time download of about ${e} MB (${t}). Continue?`))return!1;for(const[n,o]of a)K(n==="pack"?`Inapakua ${y[o].sw} · ${y[o].en} pack`:`Inapakua · ${A[o].en}`),n==="pack"?await ae(o,H):await ee(o,H);return I(),await J(),!0}async function ra(a){const e=a.filter(t=>{var n;return((n=y[t])==null?void 0:n.mt)&&!s.installed.includes(t)}).map(t=>["pack",t]);await Q(e)&&(v("Lugha ziko tayari · Packs ready"),h())}async function Sa(a){if(!a.length)return;const e=a.map(t=>y[t].sw).join(", ");if(confirm(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.

Delete ${a.map(t=>y[t].en).join(", ")}? They can be downloaded again later.`)){for(const t of a)await te(y[t].mt);await J(),v("Imefutwa · Deleted"),h()}}async function Ze(){if(!navigator.onLine)return v("Hakuna mtandao · Offline");K("Inapokea ratiba · Receiving schedule");const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,n=e.bookings.map(i=>({id:i.id,date:B(R(t,i.dayOffset)),guests:i.guests,leadName:i.leadName,language:i.language,guide:i.guide,company:e.company,consent:!!i.consent,email:i.consent&&i.email||"",synthetic:!0}));await k.putMany("bookings",n),s.bookings=await k.all("bookings"),s.lastSync=new Date().toISOString(),await k.setSetting("lastSync",s.lastSync),I();const o=O();v(o.download.length?`Ratiba imepokelewa. Pakua: ${o.download.map(i=>y[i].sw).join(", ")} · Schedule received.`:"Ratiba imepokelewa · Schedule received"),h()}async function Qe(){const a=o=>{var i,l;return((l=(i=document.getElementById(o))==null?void 0:i.value)==null?void 0:l.trim())||""},e=a("bk-date");if(!e)return v("Weka tarehe · Add a date");const t=document.getElementById("bk-consent").checked,n={id:j("bk"),date:B(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:t,email:t?a("bk-email"):""};await k.put("bookings",n),s.bookings.push(n),v("Imehifadhiwa · Saved"),h()}async function Xe(a){const e=s.bookings.find(n=>n.id===a);if(!e)return;let t=s.guests.find(n=>n.bookingId===e.id);t||(t={id:j("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await k.put("guests",t),s.guests.push(t)),s.add=T(),s.add.guestId=t.id,s.add.step=2,h()}async function at(){const a=n=>{var o,i;return((i=(o=document.getElementById(n))==null?void 0:o.value)==null?void 0:i.trim())||""},e=document.getElementById("ng-consent").checked,t={id:j("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:B(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await k.put("guests",t),s.guests.push(t),s.add=T(),s.add.guestId=t.id,s.add.step=2,h()}async function et(a,e){const t=U(),n={id:j("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};s.add.inputs.push(n),h();try{K("Inasoma picha · Reading the photo");const o=await Za(a,t.language,H);Object.assign(n,{text:o.text,lowWords:o.lowWords,confidence:o.confidence,status:"ready"}),o.text||(n.status="error",n.error="Hakuna maandishi yaliyopatikana · No text found. Try a closer, brighter photo.");const i=await Qa(o.text);i&&i!==t.language&&(n.langHint=i)}catch(o){n.status="error",n.error=o.message}finally{I(),h()}}async function Ka(a){const e=U();if(!s.shared.voice&&!await Q([["shared","voice"]]))return;const t={id:j("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};s.add.inputs.push(t),h();try{K("Inasikiliza · Listening");const n=await Ja(a,e.language,H);Object.assign(t,{text:n.original,english:n.english,status:"ready"}),s.shared.voice=!0}catch(n){t.status="error",t.error=n.message}finally{I(),h()}}let ea=null;async function tt(){var n;if(ea){ea.stop();return}if(!((n=navigator.mediaDevices)!=null&&n.getUserMedia)||!window.MediaRecorder){v("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti. · Recording not supported; upload an audio file.",5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],t=new MediaRecorder(a);t.ondataavailable=o=>{o.data.size&&e.push(o.data)},t.onstop=()=>{a.getTracks().forEach(i=>i.stop()),ea=null,s.recording=!1;const o=new Blob(e,{type:t.mimeType||"audio/webm"});h(),Ka(o).catch(i=>v(i.message))},t.start(),ea=t,s.recording=!0,h()}async function nt(){var o;const a=U(),e=s.add.inputs.filter(i=>i.status==="ready"&&(i.text||"").trim());if(!e.length)return;const t=[];if(a.language!=="sw"){s.shared.topics||t.push(["shared","topics"]),s.shared.mood||t.push(["shared","mood"]);const i=e.some(l=>!(l.source==="voice"&&l.english));(o=y[a.language])!=null&&o.mt&&i&&!s.installed.includes(a.language)&&t.push(["pack",a.language])}if(!await Q(t))return;const n=[];for(const[i,l]of e.entries()){K(`Inachanganua ${i+1}/${e.length} · Analysing`);const u=l.source==="voice"&&a.language!=="en"&&a.language!=="sw"?l.english:void 0,m=await Aa({original:l.text.trim(),lang:a.language,box:l.box,english:u},H),w={id:j("fb"),guestId:a.id,lang:a.language,source:l.source,box:l.box,original:l.text.trim(),...m,lowWords:l.lowWords||[],ocrConfidence:l.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await k.put("entries",w),s.entries.push(w),n.push(w.id)}I();for(const i of s.add.inputs)i.imageURL&&URL.revokeObjectURL(i.imageURL),i.audioURL&&URL.revokeObjectURL(i.audioURL);s.add.inputs=[],s.add.results=n,s.add.step=3,await J(),h()}async function Ua(){var n;const a=s.entries.filter(o=>o.status==="pending"),e=[...new Set(a.map(o=>o.lang))],t=[];e.some(o=>o!=="sw")&&(s.shared.topics||t.push(["shared","topics"]),s.shared.mood||t.push(["shared","mood"]));for(const o of e)(n=y[o])!=null&&n.mt&&!s.installed.includes(o)&&t.push(["pack",o]);if(await Q(t)){for(const[o,i]of a.entries()){K(`Inachanganua ${o+1}/${a.length} · Analysing`);const l=await Aa({original:i.original,lang:i.lang,box:i.box},H);Object.assign(i,l),await k.put("entries",i)}I(),await J(),v("Imekamilika · Done"),h()}}async function Y(a){await k.put("entries",a),h()}function ga(a){const e=s.entries.find(t=>t.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function Na(){const e=await(await fetch("data/demo.json")).json(),t=new Date;for(const n of e.guests){const o={id:n.id,name:n.name,language:n.language,visitDate:B(R(t,n.dayOffset)),consent:n.consent,contact:n.consent?{email:n.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await k.put("guests",o);for(const i of["liked","improve"])n[i]&&await k.put("entries",{id:`${n.id}_${i}`,guestId:n.id,lang:n.language,source:"typed",box:i,original:n[i],status:"pending",sentences:[],products:[],visitDate:o.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await E(),s.period="all",s.tab="summary",v("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”. · Example data loaded.",5e3),h()}async function it(){for(const a of s.guests.filter(e=>e.synthetic))await k.del("guests",a.id);for(const a of s.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await k.del("entries",a.id);for(const a of s.bookings.filter(e=>e.synthetic))await k.del("bookings",a.id);await E(),v("Imeondolewa · Removed"),h()}async function st(a){const e=Z(a);if(!(!e||!confirm(`Futa ${e.name} na maoni yake yote?

Delete ${e.name} and all their feedback?`))){await k.del("guests",a);for(const t of s.entries.filter(n=>n.guestId===a))await k.del("entries",t.id);for(const t of s.messages.filter(n=>n.guestId===a))await k.del("messages",t.id);await E(),h()}}async function ot(){var e;if(!s.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await Ia(a)}async function ca(a){s.role=a,await k.setSetting("role",a),a==="visitor"&&(s.visitor={lang:Ea(),saved:!1,draft:{}}),a==="host"&&(s.tab="week"),h(),window.scrollTo(0,0),a==="host"&&!await k.getSetting("guideSeen",!1)&&V(0)}const lt={"choose-role":a=>ca(a.dataset.role),"switch-role":async()=>{s.role=null,await k.setSetting("role",null),h(),window.scrollTo(0,0)},"hand-to-guest":()=>ca("visitor"),"visitor-lang":a=>{qe(),s.visitor.lang=a.dataset.lang,h()},"visitor-save":Ve,"visitor-next":()=>{s.visitor={lang:Ea(),saved:!1,draft:{}},h(),window.scrollTo(0,0)},"visitor-exit":async()=>{confirm(`Kwa Noor tu: rudi kwenye programu ya mwenyeji?

Host only: go back to the host app?`)&&await ca("host")},"company-sms":()=>{var t,n;const a=pa(),e=((n=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:n.trim())||"";if(!e){v("Weka namba ya simu ya Noor · Add Noor’s phone number");return}window.location.href=`sms:${encodeURIComponent(e)}?body=${encodeURIComponent(ka(a))}`},"company-save":async()=>{const a=pa();await k.put("bookings",a),s.bookings.push(a),v("Imehifadhiwa kwenye ratiba ya simu hii · Saved to this device’s schedule")},"toggle-big":async()=>{const a=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",a),await k.setSetting("bigText",a),h()},"guide-open":()=>V(0),"guide-next":()=>V(Math.min(s.guide.step+1,W.length-1)),"guide-prev":()=>V(Math.max(s.guide.step-1,0)),"guide-close":ia,"guide-try":Ye,"guide-demo":async()=>{await ia(),await Na()},go:a=>{s.tab=a.dataset.tab,h(),window.scrollTo(0,0)},"toggle-en":async()=>{const a=!document.body.classList.contains("hide-en");document.body.classList.toggle("hide-en",a),await k.setSetting("showEn",!a)},sync:Ze,"add-booking":Qe,"download-pack":a=>ra([a.dataset.lang]),"download-suggested":()=>ra(O().download),"download-recommended":()=>ra(O().recommend),"delete-pack":a=>Sa([a.dataset.lang]),"delete-removable":()=>Sa(O().removable),"download-shared":async a=>{await Q([["shared",a.dataset.key]])&&h()},"pick-booking":a=>Xe(a.dataset.id),"pick-guest":a=>{s.add=T(),s.add.guestId=a.dataset.id,s.add.step=2,h()},"save-new-guest":at,"change-guest":()=>{s.add.step=1,h()},"add-typed":()=>{s.add.inputs.push({id:j("in"),source:"typed",box:"liked",text:"",status:"ready"}),h()},record:tt,"remove-input":a=>{s.add.inputs=s.add.inputs.filter(e=>e.id!==a.dataset.id),h()},"use-hint":async a=>{const e=U();e.language=a.dataset.lang,await k.put("guests",e),s.add.inputs.forEach(t=>{t.langHint=null}),v(`Lugha: ${y[e.language].sw} · ${y[e.language].en}`),h()},"run-analysis":nt,"finish-add":()=>{s.add=T(),s.tab="summary",h(),window.scrollTo(0,0)},"more-feedback":()=>{const a=s.add.guestId;s.add=T(),s.add.guestId=a,s.add.step=2,h()},"fix-mood":async a=>{const[e,t]=ga(a);t&&(t.sentiment=a.dataset.mood,t.flags=(t.flags||[]).filter(n=>n==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await Y(e))},"confirm-sent":async a=>{const[e,t]=ga(a);t&&(t.confirmed=!0,t.flags=[],await Y(e))},"sw-mood":async a=>{var n;const e=s.entries.find(o=>o.id===a.dataset.entry);if(!e)return;const t=((n=e.sentences)==null?void 0:n[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=a.dataset.mood,e.sentences=[t],await Y(e)},period:a=>{s.period=a.dataset.period,h()},speak:async()=>{const{s:a,text:e}=fa();await $e(ye(a))||Ya(e.sw.join(" "))},"analyze-pending":Ua,share:ot,"toggle-draft":a=>{s.openGuest=s.openGuest===a.dataset.id?null:a.dataset.id,h()},"mark-sent":async a=>{const e={id:j("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await k.put("messages",e),s.messages.push(e),setTimeout(h,400)},copy:a=>{var e;return Ia(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>st(a.dataset.id),"load-demo":Na,"remove-demo":it,wipe:async()=>{confirm(`Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.

Delete ALL data on this phone? This cannot be undone.`)&&(await k.wipeAll(),await E(),s.add=T(),v("Data yote imefutwa · All data deleted"),h())}},dt={"company-preview":()=>{const a=document.getElementById("c-sms");a&&(a.textContent=ka(pa()))},"company-consent":a=>{var e;return(e=document.getElementById("c-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=s.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,t]=ga(a);t&&(t.topic=a.value,t.flags=(t.flags||[]).filter(n=>n!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await Y(e))},"sw-topic":async a=>{var n;const e=s.entries.find(o=>o.id===a.dataset.entry);if(!e||!a.value)return;const t=((n=e.sentences)==null?void 0:n[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=a.value,e.sentences=[t],await Y(e)},"share-ok":a=>{s.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked)}},rt={"input-text":a=>{const e=s.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.text=a.value),ct()},"input-english":a=>{const e=s.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.english=a.value)}};function ct(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=s.add.inputs.some(n=>n.status==="ready"&&(n.text||"").trim()),t=s.add.inputs.some(n=>n.status==="working");a.disabled=!(e&&!t)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const t=lt[e.dataset.action];t&&(e.tagName==="BUTTON"&&a.preventDefault(),Promise.resolve(t(e,a)).catch(n=>{console.error(n),I(),v(`Hitilafu · Error: ${n.message}`,6e3)}))});document.addEventListener("change",a=>{var n;const e=a.target;if(e.matches("input[type=file][data-file]")){const o=(n=e.files)==null?void 0:n[0];if(e.value="",!o)return;const i=e.dataset.file;(i==="audio"?Ka(o):et(o,i==="photo-liked"?"liked":"improve")).catch(u=>{I(),v(u.message,6e3)});return}const t=dt[e.dataset.change];t&&Promise.resolve(t(e)).catch(o=>v(o.message,6e3))});document.addEventListener("input",a=>{var t;const e=rt[(t=a.target.dataset)==null?void 0:t.input];e&&e(a.target)});document.addEventListener("keydown",a=>{a.key==="Escape"&&s.guide.open&&ia()});window.addEventListener("online",()=>{s.online=!0,h()});window.addEventListener("offline",()=>{s.online=!1,h()});async function ut(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const n of performance.getEntriesByType("resource"))t.add(n.name);await Promise.all([...t].map(async n=>{try{const o=new URL(n);if(o.pathname.endsWith("/data/bookings.json"))return;const i=o.origin===location.origin?a:o.hostname==="cdn.jsdelivr.net"?e:null;i&&!await i.match(n)&&await i.add(n)}catch{}}))}async function mt(){await E(),h(),s.role==="host"&&!await k.getSetting("guideSeen",!1)&&V(0),await J(),h(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(ut).catch(a=>console.warn("Offline cache not available",a)),"speechSynthesis"in window&&speechSynthesis.getVoices(),wa().then(a=>{a&&navigator.onLine&&xe()})}mt().catch(a=>{console.error(a),G.innerHTML=`<div class="notice neg"><strong>Hitilafu · Error</strong>${c(a.message)}</div>`});
