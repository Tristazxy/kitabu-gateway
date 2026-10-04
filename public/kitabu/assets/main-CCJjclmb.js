import{t as x,P as U,L as $,l as v,e as $a,f as Pa,g as Ca,i as pa,c as Wa,a as Oa,j as Ra,k as r,m as d,b as N,d as y,h as c,n as ya,o as Ha,q as G,r as ta,s as O,u as Ka,p as C,v as Ua,w as _a,x as Fa,y as T,S as D,z as Ga,A as qa,B as Ya,C as Ja,D as Va,E as Za,F as Xa,G as Q,H as va,O as Qa,K as ha}from"./ui-B1ps2bKp.js";const ae="kitabu",ee=1,za=["guests","entries","bookings","messages","settings"];let V=null;function te(){return V||(V=new Promise((a,e)=>{const t=indexedDB.open(ae,ee);t.onupgradeneeded=()=>{const n=t.result;for(const s of za)n.objectStoreNames.contains(s)||n.createObjectStore(s,{keyPath:s==="settings"?"key":"id"})},t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)}),V)}function L(a,e,t){return te().then(n=>new Promise((s,i)=>{const l=n.transaction(a,e),u=l.objectStore(a);let g;Promise.resolve(t(u)).then(k=>{g=k}),l.oncomplete=()=>s(g),l.onerror=()=>i(l.error),l.onabort=()=>i(l.error)}))}function ma(a){return new Promise((e,t)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})}const f={async all(a){return L(a,"readonly",e=>ma(e.getAll()))},async get(a,e){return L(a,"readonly",t=>ma(t.get(e)))},async put(a,e){return await L(a,"readwrite",t=>{t.put(e)}),e},async putMany(a,e){await L(a,"readwrite",t=>{for(const n of e)t.put(n)})},async del(a,e){await L(a,"readwrite",t=>{t.delete(e)})},async clear(a){await L(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const t=await this.get("settings",a);return t?t.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of za)await this.clear(a)}};function I(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const ne=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],ie=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function W(a){const e=new Date(a);return`${ne[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function se(a){const e=new Date(a);return`${ie[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function oe(a){if(!a.length)return"Kitabu: Hakuna wageni waliopangwa wiki ijayo.";const e=a.reduce((n,s)=>n+(Number(s.guests)||1),0),t=a.slice().sort((n,s)=>new Date(n.date)-new Date(s.date)).map(n=>`${W(n.date)}: wageni ${n.guests} (${v(n.language,"sw")})${n.guide?`, mwongozaji ${n.guide}`:""}`);return`Kitabu: Wiki ijayo wageni ${e}.
${t.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function xa(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function le(a){const e=[],t=[];if(e.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),t.push(`This period: ${a.guests} guests, ${a.entries} feedback entries.`),a.guests===0)return e.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),t.push("No feedback yet. Add guest feedback first."),{sw:e,en:t};a.guests<5&&(e.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),t.push(`Caution: still little feedback (${a.guests} guests). Too early for big decisions.`));const s=a.liked.filter(u=>u.id!=="other").slice(0,3);s.length&&(e.push("Walichopenda zaidi: "+s.map(u=>`${x(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),t.push("What they liked most: "+s.map(u=>`${x(u.id).en.toLowerCase()} (${u.guests} guests)`).join("; ")+"."));const i=a.improve.filter(u=>u.id!=="other").slice(0,3);i.length?(e.push("Wanachotaka kiboreshwe: "+i.map(u=>`${x(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),t.push("What they want improved: "+i.map(u=>`${x(u.id).en.toLowerCase()} (${u.guests} guests)`).join("; ")+".")):(e.push("Hakuna malalamiko yaliyotajwa."),t.push("No complaints were mentioned.")),a.products.length&&(e.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(u=>`${U.find(g=>g.id===u.id).sw} (wageni ${u.guests})`).join("; ")+"."),t.push("Products guests wanted to buy: "+a.products.map(u=>`${U.find(g=>g.id===u.id).en} (${u.guests} guests)`).join("; ")+"."));const l=xa(a);if(l){const u=U.find(g=>g.id===l.id);e.push(`Wazo: wageni ${l.guests} kati ya ${a.guests} walitaka ${u.sw}. Unaweza kufikiria kuuza ${u.sw}. Uamuzi ni wako.`),t.push(`Idea: ${l.guests} of ${a.guests} guests wanted ${u.en}. You could consider selling ${u.en}. The decision is yours.`)}return a.unsure>0&&(e.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),t.push(`${a.unsure} sentences were not understood well. Please check them with your helper or the guide.`)),a.swahiliEntries>0&&(e.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),t.push(`${a.swahiliEntries} entries are in Swahili — Noor reads them directly.`)),{sw:e,en:t}}const ia={sw:{liked:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`,plain:a=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`},en:{liked:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — Noor`,plain:a=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — Noor`},it:{liked:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`,plain:a=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`},fr:{liked:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`,plain:a=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`},de:{liked:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`,plain:a=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`},zh:{liked:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`,plain:a=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`},es:{liked:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`,plain:a=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`},pl:{liked:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`,plain:a=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`}};function de(a,e){const t=ia[a.language]?a.language:"en",n=t!==a.language,s=(a.name||"").trim()||(t==="zh"?"":"friend"),i=e?$a.find(u=>u.id===e):null,l=u=>i?ia[u].liked(s,i.msg[u]||i.msg.en):ia[u].plain(s);return{lang:t,text:l(t),sw:l("sw"),usedFallback:n}}const ka={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function re(a,e){const t=[];t.push(`Ripoti ya maoni — ${e}`),t.push(`Feedback report — ${e}`),t.push(""),t.push(`Wageni / Guests: ${a.guests}`);const n=Object.entries(a.languages).map(([i,l])=>`${$[i]?$[i].en:i} ${l}`).join(", ");n&&t.push(`Lugha / Languages: ${n}`),t.push(""),t.push("Walichopenda / Liked:");for(const i of a.liked.filter(l=>l.id!=="other").slice(0,5))t.push(`  • ${x(i.id).en}: ${i.guests}`);t.push("Kuboresha / To improve:");const s=a.improve.filter(i=>i.id!=="other").slice(0,5);s.length||t.push("  • —");for(const i of s)t.push(`  • ${x(i.id).en}: ${i.guests}`);if(a.products.length){t.push("Bidhaa / Product interest:");for(const i of a.products)t.push(`  • ${U.find(l=>l.id===i.id).en}: ${i.guests}`)}return t.push(""),t.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),t.push("Imeidhinishwa na Noor kabla ya kutumwa. / Approved by Noor before sharing."),t.join(`
`)}function na(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function ce(a,e,t=new Date){if(e==="all")return!0;const n=new Date(a),s=e==="week"?7:e==="month"?31:3650;return t-n<=s*24*3600*1e3&&n-t<=24*3600*1e3}function ue(a,e){const t=Object.fromEntries(e.map(h=>[h.id,h])),n=new Set,s={},i={},l={},u={};let g=0,k=0;const w=(h,p,b,S)=>{h[p]||(h[p]={id:p,guestIds:new Set,quotes:[]}),h[p].guestIds.add(b),S&&h[p].quotes.push(S)};for(const h of a){n.add(h.guestId),h.lang==="sw"&&k++;for(const p of h.sentences||[]){const b=na(p);b&&g++;const S={entryId:h.id,en:p.en,original:p.original||null,lang:h.lang,flagged:b};p.sentiment==="pos"?w(i,p.topic,h.guestId,S):p.sentiment==="neg"&&w(l,p.topic,h.guestId,S)}for(const p of h.products||[])w(u,p,h.guestId,null)}for(const h of n){const p=t[h],b=p?p.language:"unknown";s[b]=(s[b]||0)+1}const j=h=>Object.values(h).map(p=>({id:p.id,guests:p.guestIds.size,quotes:p.quotes})).sort((p,b)=>b.guests-p.guests);return{guests:n.size,entries:a.length,liked:j(i),improve:j(l),products:j(u),unsure:g,swahiliEntries:k,languages:s}}function ge(a,e){const t={};for(const s of a.filter(i=>i.guestId===e))for(const i of s.sentences||[])i.sentiment==="pos"&&i.topic!=="other"&&(t[i.topic]=(t[i.topic]||0)+1);const n=Object.entries(t).sort((s,i)=>i[1]-s[1])[0];return n?n[0]:null}async function ja(a,e){const{original:t,lang:n,box:s}=a;if(n==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let i;a.english?i=[{original:null,en:a.english}]:i=(await Pa(t,n,e)).pairs;const l=[];for(const h of i)for(const p of Ca(h.en))l.push({en:p,original:h.original});const u=i.map(h=>h.en).join(" ").trim();if(!l.length)return{english:u,sentences:[],products:pa(u),status:"analyzed"};const g=l.map(h=>h.en),k=await Wa(g,e),w=await Oa(g,e),j=l.map((h,p)=>{var ua,ga;const b=Ra(s,w[p]),S=[...b.flags];return k[p].topic==="other"&&S.push("topic-unsure"),{en:h.en,original:h.original,topic:k[p].topic,topicScore:k[p].score,runnerUp:k[p].runnerUp,sentiment:b.sentiment,moodScore:((ua=w[p])==null?void 0:ua.score)??null,modelMood:((ga=w[p])==null?void 0:ga.label)??null,flags:S,confirmed:!1}});return{english:u,sentences:j,products:pa(u),status:"analyzed"}}let K;async function ca(){if(K!==void 0)return K;try{const a=await fetch("audio/sw/manifest.json");K=a.ok?await a.json():null}catch{K=null}return K}const Z=a=>a>=1&&a<=20?`g_${a}`:"g_more";function pe(a){if(!a.guests)return["no_feedback"];const e=["period",Z(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const t=a.liked.filter(i=>i.id!=="other").slice(0,3);if(t.length){e.push("liked_intro");for(const i of t)e.push(`t_${i.id}`,Z(i.guests))}const n=a.improve.filter(i=>i.id!=="other").slice(0,3);if(n.length){e.push("improve_intro");for(const i of n)e.push(`t_${i.id}`,Z(i.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const i of a.products)e.push(`p_${i.id}`,Z(i.guests))}const s=xa(a);return s&&e.push("idea_intro",`p_${s.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let da=0,_=null;function he(){da++,_&&(_.pause(),_=null)}async function me(a){const e=await ca();if(!e||!a.every(n=>e.files[n]))return!1;he();const t=++da;for(const n of a){if(t!==da)break;await new Promise(s=>{const i=new Audio(`audio/sw/${e.files[n]}`);_=i,i.onended=s,i.onerror=s,i.play().catch(s)})}return _=null,!0}async function ke(){const a=await ca();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}const B={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',print:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 9V3h10v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M7 14h10v7H7z"/></svg>',camera:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',listen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>',mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',calendar:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>'},E=[{icon:B.book,title:["Karibu kwenye Kitabu cha Wageni","Welcome to Kitabu cha Wageni"],body:[["Wageni wanaandika maoni kwenye kitabu cha karatasi, kwa lugha yao. Programu hii inayasoma na kukueleza kwa Kiswahili walichopenda na wanachotaka kiboreshwe.","Guests write feedback in a paper guestbook, in their own language. This app reads it and tells you in Swahili what they loved and what they want improved."],["Kila kitu kinabaki kwenye simu hii, na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline."]]},{icon:B.print,title:["1 · Weka kitabu mezani","1 · Put the guestbook on the table"],body:[["Chapisha ukurasa wa kitabu cha wageni. Mgeni anaandika kwenye kisanduku A (alichopenda) na B (kinachoweza kuboreshwa), na anaweka alama kama anakubali uwasiliane naye.","Print the guestbook page. Guests fill box A (what they liked) and box B (what could be better), and tick if you may contact them."]],link:{href:"print/guestbook.html",label:["Fungua ukurasa wa kuchapisha","Open the printable page"]}},{icon:B.camera,title:["2 · Wikendi: ongeza maoni","2 · At the weekend: add the feedback"],body:[["Msaidizi (k.m. binti yako) anabonyeza “Ongeza maoni”, anachagua mgeni, kisha anapiga picha ya kisanduku A na B.","Your helper (e.g. your daughter) taps “Add feedback”, picks the guest, then photographs box A and box B."],["Unaweza pia kurekodi sauti ya mgeni au kuandika. Maneno ya njano hayakusomeka vizuri — yarekebishe.","You can also record the guest’s voice or type. Yellow words were hard to read — correct them."]]},{icon:B.listen,title:["3 · Changanua na usikilize","3 · Analyse and listen"],body:[["Bonyeza “Changanua”. Programu inatafsiri na kupanga maoni. Fungua “Muhtasari” na ubonyeze “Sikiliza” kusikia muhtasari kwa Kiswahili.","Tap “Analyse”. The app translates and sorts the comments. Open “Summary” and tap “Listen” to hear it in Swahili."],["“Angalia” ya njano = AI haina uhakika. Iangalie pamoja na msaidizi wako.","Yellow “Check” = the AI is not sure. Look at it with your helper."]]},{icon:B.mail,title:["4 · Washukuru wageni","4 · Thank your guests"],body:[["Katika “Wageni”, fungua ujumbe wa shukrani. Umeandikwa kwa lugha ya mgeni, na maana yake kwa Kiswahili iko chini yake.","In “Guests”, open the thank-you message. It is in the guest’s language, with its Swahili meaning underneath."],["Unatuma wewe mwenyewe, na tu kama mgeni alikubali. AI haitumi chochote.","You send it yourself, and only if the guest agreed. The AI never sends anything."]]},{icon:B.calendar,title:["5 · Wiki ijayo na lugha","5 · Next week and languages"],body:[["Msaidizi akiunganisha mtandao, “Wiki ijayo” inapokea ratiba ya wageni kutoka kwa mwongozaji na kuandaa lugha zao. Simu yako ya kawaida inapata ujumbe mfupi.","When the helper connects, “Next week” receives the guest schedule from the tour company and prepares their languages. Your basic phone gets an SMS."]]},{icon:B.play,title:["Jaribu sasa","Try it now"],body:[["Mgeni wa kubuni ameandika maoni kwa Kiingereza. Programu itapakua modeli ndogo mara moja (takriban MB 90), kisha itakuonyesha muhtasari.","An invented guest wrote feedback in English. The app downloads small models once (about 90 MB), then shows you the summary."]],final:!0}];function we(a){const e=E[a],t=a===E.length-1,n=E.map((u,g)=>`<span class="${g===a?"on":""}"></span>`).join(""),s=e.body.map(([u,g])=>`<p class="lead">${u}</p><p class="en" style="margin-top:-4px">${g}</p>`).join(""),i=e.link?`<a class="btn secondary block" href="${e.link.href}" target="_blank" rel="noopener" style="margin-top:6px">${r(e.link.label[0],e.link.label[1])}</a>`:"",l=e.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${r("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-demo">${r("Pakia wageni 6 wa mfano","Load 6 example guests")}</button>
      <p class="small muted" style="margin:0">${d("Wageni 6 wanahitaji lugha 3 zaidi (takriban MB 480 jumla).","6 guests need 3 more languages (about 480 MB in total).")}</p>
      <button class="btn secondary block" data-action="guide-close">${r("Anza kutumia","Start using it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="Hatua ${a+1} kati ya ${E.length} · step ${a+1} of ${E.length}">${n}</div>
      <button class="guide-close" data-action="guide-close">${d("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${e.icon}</div>
    <h2 id="guide-title">${e.title[0]}<span class="en">${e.title[1]}</span></h2>
    ${s}
    ${i}
    ${l}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${a===0?"disabled":""}>${r("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${r("Endelea","Next")}</button>`}
    </div>
  </div>`}const Sa=document.getElementById("view"),A=()=>({step:1,guestId:null,inputs:[],results:[]}),o={tab:"week",guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:A(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0}};async function R(){const[a,e,t,n]=await Promise.all(["guests","entries","bookings","messages"].map(i=>f.all(i)));Object.assign(o,{guests:a,entries:e,bookings:t,messages:n}),o.lastSync=await f.getSetting("lastSync");const s=await f.getSetting("showEn",!0);document.body.classList.toggle("hide-en",!s)}async function q(){try{o.installed=await Va();for(const a of Object.keys(D))o.shared[a]=await Za(D[a].id)}catch(a){console.warn("model check failed",a)}}const Y=a=>o.guests.find(e=>e.id===a),H=()=>Y(o.add.guestId);function P(){return Ja({guests:o.guests,bookings:o.bookings,installed:o.installed,today:new Date})}function Ma(){const a=o.entries.filter(t=>t.status!=="pending"&&ce(t.visitDate||t.createdAt,o.period)),e=ue(a,o.guests);return{s:e,entries:a,text:le(e)}}const M=a=>`<span class="chip plain lang-pill" title="${c(v(a,"en"))}">${c(v(a,"sw"))}</span>`;function fe(a){return a==="pos"?`<span class="chip">${d("Nzuri","positive")}</span>`:a==="neg"?`<span class="chip neg">${d("Ya kuboresha","to improve")}</span>`:`<span class="chip warn">${d("Haijulikani","unsure")}</span>`}function Ia(a){return a.consent?`<span class="chip">${d("Ameruhusu mawasiliano","consented to contact")}</span>`:`<span class="chip plain">${d("Hakuna ruhusa","no consent")}</span>`}function be(a){var e;return(e=$[a])!=null&&e.mt?o.installed.includes(a)?`<span class="chip">${d("Lugha iko tayari","pack ready")}</span>`:`<span class="chip warn">${d("Pakua lugha","pack needed")}</span>`:`<span class="chip plain">${d("Haihitaji pakiti","no pack needed")}</span>`}const sa={"topic-unsure":["Mada haijulikani","topic unclear"],conflict:["Inapingana na kisanduku alichoandika","contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","mood unclear"],"no-model":["Hakuna modeli ya hisia","no sentiment model"]};function Na(a){return Object.entries($).map(([e,t])=>`<option value="${e}" ${e===a?"selected":""}>${c(t.sw)} · ${c(t.en)} (${c(t.native)})</option>`).join("")}function Ba(a){return[...$a,Qa].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${c(e.sw)} · ${c(e.en)}</option>`).join("")}function Aa(a,e,{open:t=!1}={}){const n=a.sentences[e],s=x(n.topic),i=na(n),l=(n.flags||[]).filter(g=>sa[g]),u=n.original&&a.lang!=="en";return`
  <div class="sent">
    ${u?`<div class="orig" lang="${c(a.lang)}">“${c(n.original)}”</div>`:""}
    ${n.en?`<div class="${u?"small muted":""}">${u?"EN: ":""}${c(n.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${n.topic==="other"?"warn":""}">${c(s.sw.split(" (")[0])}<span class="en inline"> · ${c(s.en)}</span></span>
      ${fe(n.sentiment)}
      ${i?`<span class="chip warn">${d("Angalia","check")}</span>`:n.confirmed?`<span class="chip plain">${d("Imethibitishwa","confirmed")}</span>`:""}
    </div>
    ${i&&l.length?`<div class="small muted" style="margin-top:4px">${l.map(g=>`${sa[g][0]} <span class="en inline">(${sa[g][1]})</span>`).join("; ")}</div>`:""}
    <details ${t||i?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${d("Rekebisha","correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${r("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${Ba(n.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${n.sentiment==="pos"}">${d("Nzuri","positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${n.sentiment==="neg"}">${d("Ya kuboresha","to improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${d("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function $e(a){var t;const e=(t=a.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${c(a.original)}”</div>
    <div class="small muted">${d("Kiswahili — Noor anasoma mwenyewe. Weka mada kwa mkono (hiari).","Swahili — Noor reads it herself. Tag a topic by hand (optional).")}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${c("Mada")} · topic —</option>${Ba(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${d("Nzuri","positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${d("Ya kuboresha","to improve")}</button>
    </div>
  </div>`}function ye(a){var i,l;const e=Y(a.guestId),t=a.box==="liked"?d("Walipenda","liked box"):a.box==="improve"?d("Kuboresha","could-be-better box"):d("Maoni","feedback"),n=a.source==="photo"?d("Picha","photo"):a.source==="voice"?d("Sauti","voice"):d("Imeandikwa","typed");let s;return a.status==="pending"?s=`<p class="muted">${d("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${c(a.lang)}">“${c(a.original)}”</p>`:a.status==="swahili"?s=$e(a):(i=a.sentences)!=null&&i.length?s=a.sentences.map((u,g)=>Aa(a,g)).join(""):s=`<p lang="${c(a.lang)}">“${c(a.original)}”</p><p class="small muted">${d("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${c((e==null?void 0:e.name)||"Mgeni")}</strong> ${M(a.lang)}</div>
      <div class="small muted">${n} · ${t}</div>
    </div>
    ${(l=a.lowWords)!=null&&l.length?`<div class="notice warn small">${d("Maneno ambayo picha haikusomeka vizuri yalirekebishwa na msaidizi.","Words the photo reader was unsure of were checked by the helper.")}</div>`:""}
    ${s}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${d("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}function ve(){const a=o.bookings.filter(l=>Q(l.date)>=0).sort((l,u)=>new Date(l.date)-new Date(u.date)),e=a.filter(l=>Q(l.date)<=7),t=a.filter(l=>Q(l.date)>7),n=P(),s=oe(e),i=l=>`
    <li>
      <div class="row between">
        <strong>${c(W(l.date))} <span class="en inline">· ${c(se(l.date))}</span></strong>
        <span class="badge-num" title="guests">${c(l.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${M(l.language)} ${be(l.language)}
        ${l.guide?`<span class="muted">${d("Mwongozaji","guide")}: ${c(l.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${c(l.leadName||"")}${l.company?` · ${c(l.company)}`:""}</div>
    </li>`;return`
  <h1>${r("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <div class="card-title"><h2>${r("Ratiba kutoka kwa mwongozaji","Schedule from the tour company")}</h2></div>
    <p class="small muted">${d("Msaidizi (k.m. binti yako wikendi) akiunganisha mtandao, ratiba mpya inapakuliwa na lugha zinazohitajika zinaandaliwa.","When the helper connects (e.g. the daughter at the weekend), the new schedule downloads and the needed languages are prepared.")}</p>
    <button class="btn block" data-action="sync" ${o.online?"":"disabled"}>${r("Pokea ratiba mpya","Receive new schedule")}</button>
    <p class="small muted" style="margin-top:8px">${o.lastSync?`${d("Mara ya mwisho","last synced")}: ${c(new Date(o.lastSync).toLocaleString())}`:d("Bado haijapokelewa","not synced yet")}${o.online?"":` · ${d("Nje ya mtandao","offline")}`}</p>
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
    <div class="sms" id="sms-text">${c(s)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${s.length} ${d("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${d("Nakili","Copy")}</button>
    </div>
  </div>

  <div class="card">
    <h2>${r("Lugha za kuandaa","Languages to prepare")}</h2>
    ${n.download.length?`
      <p>${d("Pakua kabla wageni hawajafika","Download before the guests arrive")}:</p>
      <div class="row">${n.download.map(l=>M(l)).join("")}</div>
      <p class="small muted">${d(`Takriban MB ${n.downloadMB}. Tumia Wi-Fi au kifurushi cha data.`,`About ${n.downloadMB} MB. Use Wi-Fi or a data bundle.`)}</p>
      <button class="btn block" data-action="download-suggested" ${o.online?"":"disabled"}>${r("Pakua sasa","Download now")}</button>
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
      <label class="field">${r("Tarehe","Date")}<input type="date" id="bk-date" value="${va(ta(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${r("Idadi ya wageni","Number of guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${r("Lugha","Language")}<select id="bk-lang">${Na("en")}</select></label>
      </div>
      <label class="field">${r("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${r("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${r("Mgeni amekubali Noor awasiliane naye","Guest agreed that Noor may contact them")}</span></label>
      <label class="field hidden" id="bk-email-wrap">${r("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${r("Hifadhi","Save")}</button>
    </div>
  </details>`}function ze(){const a=o.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${a.step>=t?"on":""}"></span>`).join("")}</div>`;return a.step===1?e+Da():a.step===2?e+Se():e+Me()}function Da(){const a=o.bookings.filter(t=>{const n=Q(t.date);return n<=1&&n>=-14}).filter(t=>!o.guests.some(n=>n.bookingId===t.id)).sort((t,n)=>new Date(n.date)-new Date(t.date)),e=o.guests.slice().sort((t,n)=>new Date(n.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${r("Mgeni ni nani?","Who is the guest?")}</h1>

  ${a.length?`
  <div class="card">
    <h2>${r("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${c(t.leadName||"Mgeni")}</strong> ${M(t.language)}<div class="small muted">${c(W(t.date))} · ${d("wageni","guests")} ${c(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${d("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  ${e.length?`
  <div class="card">
    <h2>${r("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${c(t.name)}</strong> ${M(t.language)}<div class="small muted">${c(W(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${d("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${r("Mgeni mpya","New guest")}</h2>
    <p class="small muted">${d("Andika kutoka kwenye ukurasa wa kitabu cha wageni.","Copy from the guestbook page.")}</p>
    <div class="stack">
      <label class="field">${r("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${r("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${Na("en")}</select></label>
      <label class="field">${r("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${va(new Date)}"></label>
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
  </div>`}const wa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',xe='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',je='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';function Se(){var i;const a=H();if(!a)return o.add.step=1,Da();const e=((i=$[a.language])==null?void 0:i.mt)&&!o.installed.includes(a.language),t=o.add.inputs.some(l=>l.status==="ready"&&(l.text||"").trim()),n=o.add.inputs.some(l=>l.status==="working"),s=l=>{var h;const u=`
      <select data-change="box" data-id="${l.id}" aria-label="Box">
        <option value="liked" ${l.box==="liked"?"selected":""}>Walipenda · liked</option>
        <option value="improve" ${l.box==="improve"?"selected":""}>Kuboresha · could be better</option>
        <option value="unknown" ${l.box==="unknown"?"selected":""}>Haijulikani · not sure</option>
      </select>`,g=l.langHint?`
      <div class="notice warn small">${d(`Inaonekana ni ${v(l.langHint,"sw")}, si ${v(a.language,"sw")}.`,`This looks like ${v(l.langHint,"en")}, not ${v(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${l.langHint}">${d(`Badilisha lugha ya mgeni kuwa ${v(l.langHint,"sw")}`,`Switch guest language to ${v(l.langHint,"en")}`)}</button></div>
      </div>`:"";let k="";l.imageURL&&(k=`<img class="preview-img" src="${l.imageURL}" alt="Photo of the guestbook box">`),l.audioURL&&(k=`<audio controls src="${l.audioURL}" style="width:100%"></audio>`);let w="";return l.status==="working"?w=`<p class="muted">${d("Inasoma…","Reading…")}</p>`:l.status==="error"?w=`<div class="notice neg small">${d("Imeshindwa","Failed")}: ${c(l.error)}</div>`:w=`
        ${(h=l.lowWords)!=null&&h.length?`<div class="notice warn small"><strong>${d("Angalia maneno haya","Check these words")}</strong>${l.lowWords.slice(0,20).map(p=>`<mark class="low">${c(p)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${l.source==="voice"?r("Alichosema mgeni","What the guest said"):r("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${l.id}" lang="${c(a.language)}">${c(l.text)}</textarea></label>
        ${l.source==="voice"&&a.language!=="en"&&a.language!=="sw"?`
        <label class="field small">${r("Tafsiri ya Kiingereza (kutoka kwa modeli ya sauti)","English translation (from the voice model)")}
          <textarea data-input="input-english" data-id="${l.id}" style="min-height:80px">${c(l.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${l.source==="photo"?r("Picha","Photo"):l.source==="voice"?r("Sauti","Voice"):r("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${l.id}">${d("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${k}
        <label class="field small">${r("Kisanduku","Which box")}${u}</label>
        ${g}
        ${w}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${c(a.name)}</strong> ${M(a.language)}<div class="small muted">${c(W(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${d("Badilisha","Change")}</button>
    </div>
    <div class="row" style="margin-top:8px">${Ia(a)}</div>
  </div>

  ${e?`<div class="notice warn">${d(`Lugha ya ${v(a.language,"sw")} haijapakuliwa. Kusoma picha kunawezekana; kuchanganua kutahitaji mtandao mara moja (MB ${T}).`,`The ${v(a.language,"en")} pack is not downloaded. Reading photos works; analysing will need internet once (${T} MB).`)}</div>`:""}

  <h2 class="section-head">${r("Ongeza maoni","Add feedback")}</h2>
  <div class="grid2">
    <label class="btn big">${wa}<span class="btn-col">${r("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${wa}<span class="btn-col">${r("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${o.recording?"danger":"secondary"}" data-action="record">
      ${o.recording?'<span class="rec-dot"></span>':xe}<span class="btn-col">${o.recording?r("Simamisha","Stop recording"):r("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${je}<span class="btn-col">${r("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${d("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${o.add.inputs.map(s).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!n?"":"disabled"}>${r("Changanua","Analyse")}</button>
  <p class="small muted" style="margin-top:8px">${d("Kila kitu kinabaki kwenye simu hii.","Everything stays on this phone.")}</p>`}function Me(){const a=o.add.results.map(n=>o.entries.find(s=>s.id===n)).filter(Boolean),e=H(),t=a.reduce((n,s)=>n+(s.sentences||[]).filter(na).length,0);return`
  <h1>${r("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${d(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} sentences need a check`)}</strong>${d("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct them or press “OK”.")}</div>`:`<div class="notice">${d("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(ye).join("")}
  <div class="stack">
    <button class="btn" data-action="more-feedback">${r(`Ongeza maoni mengine ya ${c((e==null?void 0:e.name)||"mgeni")}`,"Add more for this guest")}</button>
    <button class="btn secondary" data-action="finish-add">${r("Maliza na uone muhtasari","Finish and see the summary")}</button>
  </div>`}const oa={week:["Wiki hii","This week"],month:["Mwezi huu","This month"],all:["Zote","All time"]};function Ie(){const a=o.entries.filter(g=>g.status==="pending"),{s:e,entries:t,text:n}=Ma(),s=Object.entries(oa).map(([g,[k,w]])=>`<button class="chip" data-action="period" data-period="${g}" aria-pressed="${o.period===g}">${k}<span class="en inline"> · ${w}</span></button>`).join(""),i=(g,k)=>g.filter(w=>w.id!=="other").map(w=>{const j=x(w.id),h=e.guests?Math.round(w.guests/e.guests*100):0,p=w.quotes.slice(0,5).map(b=>`
      <blockquote class="q">${b.original&&b.lang!=="en"?`<div class="orig" lang="${c(b.lang)}">“${c(b.original)}”</div><div class="trans">EN: ${c(b.en)}</div>`:`<div class="orig">“${c(b.en)}”</div>`}
      ${b.flagged?`<span class="chip warn" style="margin-top:4px">${d("Angalia","check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><div><strong>${c(j.sw)}</strong><span class="en">${c(j.en)}</span></div><span class="badge-num ${k?"neg":""}">${w.guests}</span></div>
        <div class="bar ${k?"neg":""}"><span style="width:${h}%"></span></div>
        <details class="quotes"><summary>${d("Maneno ya wageni","What guests said")} (${w.quotes.length})</summary>${p}</details>
      </div>`}).join(""),l=[];for(const g of t)(g.sentences||[]).forEach((k,w)=>{na(k)&&l.push([g,w])});const u=re(e,`${oa[o.period][0]} / ${oa[o.period][1]}`);return`
  <h1>${r("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${s}</div>

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
    <div class="big-summary" lang="sw">${n.sw.map(g=>`<p>${c(g)}</p>`).join("")}</div>
    <div class="en small" style="margin-top:6px">${n.en.map(g=>`<p>${c(g)}</p>`).join("")}</div>
    <p class="small muted">${d("Sentensi hizi zimeandikwa na watu mapema; AI imejaza tu idadi na majina ya mada. Uamuzi ni wa Noor.","These sentences are human-written templates; the AI only fills in counts and topic names. Noor decides.")}</p>
  </div>

  ${e.liked.filter(g=>g.id!=="other").length?`<div class="card"><h2>${r("Walichopenda","What they liked")}</h2>${i(e.liked,!1)}</div>`:""}
  ${e.improve.filter(g=>g.id!=="other").length?`<div class="card"><h2>${r("Wanachotaka kiboreshwe","What they want improved")}</h2>${i(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${r("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(g=>{const k=U.find(w=>w.id===g.id);return`<div class="topic-row"><div><strong>${c(k.sw)}</strong><span class="en">${c(k.en)}</span></div><span class="badge-num">${g.guests}</span></div>`}).join("")}
    <p class="small muted">${d("Imepatikana kwa maneno maalum (si makisio).","Found by fixed keywords, not guessed.")}</p>
  </div>`:""}

  ${l.length?`
  <div class="card">
    <h2>${r("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    <p class="small muted">${d("AI haikuwa na uhakika. Angalia pamoja na msaidizi au mwongozaji.","The AI was not sure. Check with the helper or the guide.")}</p>
    ${l.map(([g,k])=>{var w;return`<div class="small muted" style="margin-top:8px">${c(((w=Y(g.guestId))==null?void 0:w.name)||"")} · ${c(v(g.lang,"sw"))}</div>${Aa(g,k,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${r("Ripoti kwa mwongozaji / kituo cha utalii","Report for the guide / tourism centre")}</h2>
    <p class="small muted">${d("Hakuna majina, namba wala maneno ya wageni. Inatumwa tu Noor akikubali.","No names, contacts or quotes. Shared only if Noor agrees.")}</p>
    <div class="sms" id="report-text">${c(u)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${o.shareOk?"checked":""}>
      <span>${r("Nimesoma ripoti hii na nakubali ishirikiwe","I have read this report and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${o.shareOk?"":"disabled"}>${r("Shiriki","Share")}</button>
  </div>`}
  `}function Ne(){const a=o.guests.slice().sort((e,t)=>new Date(t.visitDate)-new Date(e.visitDate));return a.length?`
  <h1>${r("Wageni","Guests")}</h1>
  <p class="small muted">${d("Ujumbe wa shukrani umeandikwa na watu katika kila lugha. AI inachagua tu jambo alilopenda mgeni. Noor anaidhinisha kabla ya kutuma.","Thank-you messages are human-written in each language. The AI only picks what the guest liked. Noor approves before anything is sent.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const t=o.entries.filter(i=>i.guestId===e.id).length,n=o.messages.some(i=>i.guestId===e.id&&i.status==="sent"),s=o.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${c(e.name)}</strong> ${M(e.language)}${e.synthetic?` <span class="chip plain">${d("mfano","example")}</span>`:""}</div>
          <span class="small muted">${c(W(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Ia(e)} <span class="muted">${d("maoni","entries")}: ${t}</span>
          ${n?`<span class="chip">${d("Shukrani imetumwa","thanks sent")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${d("Alipendekezwa na","recommended by")}: ${c(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${s?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${d("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${d("Futa","Delete")}</button>
        </div>
        ${s?Be(e):""}
      </li>`}).join("")}</ul></div>`:`<h1>${r("Wageni","Guests")}</h1>
      <div class="card"><p>${d("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-tab="add">${r("Ongeza maoni","Add feedback")}</button></div>`}function Be(a){const e=ge(o.entries,a.id),t=de(a,e),n=a.contact||{},s=ka[t.lang]||ka.en;let i;return a.consent?n.email?i=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(n.email)}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(t.text)}">${r("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:n.phone?i=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(n.phone)}?body=${encodeURIComponent(t.text)}">${r("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:i=`<div class="notice small">${d("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:i=`<div class="notice warn small">${d("Mgeni hakutoa ruhusa ya kuwasiliana — usitume ujumbe.","The guest did not consent to contact — do not send.")}</div>`,`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${d(`Hakuna kiolezo cha ${v(a.language,"sw")} bado — tumetumia Kiingereza.`,`No ${v(a.language,"en")} template yet — using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${d(`Kwa ${v(t.lang,"sw")}`,`In ${v(t.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${c(t.text)}</p></div>
    <div class="card flat" lang="sw"><div class="small muted">${d("Maana yake kwa Kiswahili","What it says, in Swahili")}</div><p style="margin:6px 0 0">${c(t.sw)}</p></div>
    <p class="small muted">${e?d(`Mada aliyopenda: ${x(e).sw}`,`Liked topic: ${x(e).en}`):d("Hakuna mada iliyo wazi — ujumbe wa jumla.","No clear liked topic — general message.")}</p>
    ${i}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${d("Nakili","Copy")}</button>
  </div>`}function Ae(){const a=P(),e=n=>{const s=$[n],i=o.installed.includes(n),l=[];return a.keep.includes(n)&&l.push(`<span class="chip">${d("Inakaa daima","kept")}</span>`),a.needed.includes(n)&&l.push(`<span class="chip warn">${d("Wiki ijayo","needed next week")}</span>`),i&&a.removable.includes(n)&&l.push(`<span class="chip plain">${d("Nadra","rare")}</span>`),`
      <div class="pack">
        <div><strong>${c(s.sw)}</strong> <span class="muted small">${c(s.native)}</span><span class="en">${c(s.en)} · ${i?"downloaded":"not downloaded"} · ~${T} MB</span>
          <div class="row" style="margin-top:4px">${i?`<span class="chip">${d("Imepakuliwa","on phone")}</span>`:""}${l.join("")}</div></div>
        ${i?`<button class="btn small danger" data-action="delete-pack" data-lang="${n}">${d("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${n}" ${o.online?"":"disabled"}>${d("Pakua","Get")}</button>`}
      </div>`},t=n=>{const s=D[n],i=o.shared[n];return`
      <div class="pack">
        <div><strong>${c(s.sw)}</strong><span class="en">${c(s.en)} · ${c(s.id)} · ~${s.mb} MB</span></div>
        ${i?`<span class="chip">${d("Tayari","ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${n}" ${o.online?"":"disabled"}>${d("Pakua","Get")}</button>`}
      </div>`};return`
  <h1>${r("Lugha","Languages")}</h1>
  <div class="notice">
    <strong>${d(`Lugha ${ha+2} muhimu`,`${ha+2} essential languages`)}</strong>
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
    ${Object.keys(D).map(t).join("")}
  </div>

  <div class="card">
    <h2>${r("Lugha za wageni","Guest language packs")}</h2>
    <p class="small muted">${a.usedDefaults?d("Bado hakuna historia ya kutosha: tunatumia nchi zinazoleta wageni wengi Tanzania (NBS 2024): Italia, Ufaransa, Ujerumani.","Not enough history yet: using Tanzania’s top non-African, non-English source markets (NBS 2024): Italy, France, Germany."):d("Lugha zinazokaa zimechaguliwa kutoka historia ya wageni wa Noor.","Kept languages are chosen from Noor’s own guest history.")}</p>
    ${a.recommend.length?`
      <div class="notice small" style="margin-top:4px">${d(`Inapendekezwa kupakua ukiwa na Wi-Fi: ${a.recommend.map(n=>$[n].sw).join(", ")} (MB ${a.recommendMB}).`,`Recommended when on Wi-Fi: ${a.recommend.map(n=>$[n].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${o.online?"":"disabled"}>${d("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${Xa().map(e).join("")}
    <p class="small muted" style="margin-top:12px">${d(`Kila pakiti ni takriban MB ${T} (modeli ya tafsiri iliyobanwa + data ya kusoma maandishi). Toleo la Android litatumia ML Kit (karibu MB 30 kwa lugha).`,`Each pack is about ${T} MB (quantized translation model + text-reading data). An Android version would use ML Kit (about 30 MB per language).`)}</p>
  </div>`}function De(){const a=o.guests.some(e=>e.synthetic);return`
  <h1>${r("Zaidi","More")}</h1>

  <div class="card">
    <h2>${r("Jinsi ya kutumia","How to use it")}</h2>
    <button class="btn block" data-action="guide-open">${r("Fungua mwongozo","Open the guide")}</button>
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
  </div>`}let z=null;function La(){var a;if(z||(z=document.createElement("div"),z.className="guide-backdrop hidden",z.setAttribute("role","dialog"),z.setAttribute("aria-modal","true"),z.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(z)),z.classList.toggle("hidden",!o.guide.open),!o.guide.open){z.innerHTML="";return}z.innerHTML=we(o.guide.step),(a=z.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||a.focus()}function aa(a=0){o.guide={open:!0,step:a},La()}async function ea(){o.guide.open=!1,La(),await f.setSetting("guideSeen",!0)}async function Le(){await ea();const a="demo_quick";if(!Y(a)){const e={id:a,name:"Emma (mfano)",language:"en",visitDate:G(ta(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",e);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const n of["liked","improve"])await f.put("entries",{id:`${a}_${n}`,guestId:a,lang:"en",source:"typed",box:n,original:t[n],status:"pending",sentences:[],products:[],visitDate:e.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await R()}o.period="all",o.tab="summary",m(),await Ta()}const Ee={week:ve,add:ze,summary:Ie,guests:Ne,langs:Ae,more:De};function m(){Sa.innerHTML=Ee[o.tab](),document.querySelectorAll(".tabbar button").forEach(a=>a.setAttribute("aria-current",a.dataset.tab===o.tab?"page":"false")),document.getElementById("net").innerHTML=o.online?d("Mtandaoni","online"):d("Nje ya mtandao","offline"),o.tab==="langs"&&Fa().then(a=>{const e=document.getElementById("storage-line");e&&a&&(e.innerHTML=d(`Nafasi iliyotumika: MB ${a.usedMB} kati ya MB ${a.quotaMB}`,`Storage used: ${a.usedMB} MB of ${a.quotaMB} MB`))})}async function J(a){if(!a.length)return!0;const e=a.reduce((n,[s,i])=>n+(s==="pack"?T:D[i].mb),0);if(!navigator.onLine)return y("Hakuna mtandao. Pakua lugha wikendi msaidizi akiwa na mtandao. · Offline: download packs when connected.",6e3),!1;const t=a.map(([n,s])=>n==="pack"?$[s].en:D[s].en).join(", ");if(!confirm(`Pakua mara moja: takriban MB ${e} (${t}). Endelea?

One-time download of about ${e} MB (${t}). Continue?`))return!1;for(const[n,s]of a)O(n==="pack"?`Inapakua ${$[s].sw} · ${$[s].en} pack`:`Inapakua · ${D[s].en}`),n==="pack"?await Ga(s,C):await qa(s,C);return N(),await q(),!0}async function la(a){const e=a.filter(t=>{var n;return((n=$[t])==null?void 0:n.mt)&&!o.installed.includes(t)}).map(t=>["pack",t]);await J(e)&&(y("Lugha ziko tayari · Packs ready"),m())}async function fa(a){if(!a.length)return;const e=a.map(t=>$[t].sw).join(", ");if(confirm(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.

Delete ${a.map(t=>$[t].en).join(", ")}? They can be downloaded again later.`)){for(const t of a)await Ya($[t].mt);await q(),y("Imefutwa · Deleted"),m()}}async function Te(){if(!navigator.onLine)return y("Hakuna mtandao · Offline");O("Inapokea ratiba · Receiving schedule");const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,n=e.bookings.map(i=>({id:i.id,date:G(ta(t,i.dayOffset)),guests:i.guests,leadName:i.leadName,language:i.language,guide:i.guide,company:e.company,consent:!!i.consent,email:i.consent&&i.email||"",synthetic:!0}));await f.putMany("bookings",n),o.bookings=await f.all("bookings"),o.lastSync=new Date().toISOString(),await f.setSetting("lastSync",o.lastSync),N();const s=P();y(s.download.length?`Ratiba imepokelewa. Pakua: ${s.download.map(i=>$[i].sw).join(", ")} · Schedule received.`:"Ratiba imepokelewa · Schedule received"),m()}async function Pe(){const a=s=>{var i,l;return((l=(i=document.getElementById(s))==null?void 0:i.value)==null?void 0:l.trim())||""},e=a("bk-date");if(!e)return y("Weka tarehe · Add a date");const t=document.getElementById("bk-consent").checked,n={id:I("bk"),date:G(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:t,email:t?a("bk-email"):""};await f.put("bookings",n),o.bookings.push(n),y("Imehifadhiwa · Saved"),m()}async function Ce(a){const e=o.bookings.find(n=>n.id===a);if(!e)return;let t=o.guests.find(n=>n.bookingId===e.id);t||(t={id:I("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await f.put("guests",t),o.guests.push(t)),o.add=A(),o.add.guestId=t.id,o.add.step=2,m()}async function We(){const a=n=>{var s,i;return((i=(s=document.getElementById(n))==null?void 0:s.value)==null?void 0:i.trim())||""},e=document.getElementById("ng-consent").checked,t={id:I("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:G(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await f.put("guests",t),o.guests.push(t),o.add=A(),o.add.guestId=t.id,o.add.step=2,m()}async function Oe(a,e){const t=H(),n={id:I("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};o.add.inputs.push(n),m();try{O("Inasoma picha · Reading the photo");const s=await Ua(a,t.language,C);Object.assign(n,{text:s.text,lowWords:s.lowWords,confidence:s.confidence,status:"ready"}),s.text||(n.status="error",n.error="Hakuna maandishi yaliyopatikana · No text found. Try a closer, brighter photo.");const i=await _a(s.text);i&&i!==t.language&&(n.langHint=i)}catch(s){n.status="error",n.error=s.message}finally{N(),m()}}async function Ea(a){const e=H();if(!o.shared.voice&&!await J([["shared","voice"]]))return;const t={id:I("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};o.add.inputs.push(t),m();try{O("Inasikiliza · Listening");const n=await Ka(a,e.language,C);Object.assign(t,{text:n.original,english:n.english,status:"ready"}),o.shared.voice=!0}catch(n){t.status="error",t.error=n.message}finally{N(),m()}}let X=null;async function Re(){var n;if(X){X.stop();return}if(!((n=navigator.mediaDevices)!=null&&n.getUserMedia)||!window.MediaRecorder){y("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti. · Recording not supported; upload an audio file.",5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],t=new MediaRecorder(a);t.ondataavailable=s=>{s.data.size&&e.push(s.data)},t.onstop=()=>{a.getTracks().forEach(i=>i.stop()),X=null,o.recording=!1;const s=new Blob(e,{type:t.mimeType||"audio/webm"});m(),Ea(s).catch(i=>y(i.message))},t.start(),X=t,o.recording=!0,m()}async function He(){var s;const a=H(),e=o.add.inputs.filter(i=>i.status==="ready"&&(i.text||"").trim());if(!e.length)return;const t=[];if(a.language!=="sw"){o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]);const i=e.some(l=>!(l.source==="voice"&&l.english));(s=$[a.language])!=null&&s.mt&&i&&!o.installed.includes(a.language)&&t.push(["pack",a.language])}if(!await J(t))return;const n=[];for(const[i,l]of e.entries()){O(`Inachanganua ${i+1}/${e.length} · Analysing`);const u=l.source==="voice"&&a.language!=="en"&&a.language!=="sw"?l.english:void 0,g=await ja({original:l.text.trim(),lang:a.language,box:l.box,english:u},C),k={id:I("fb"),guestId:a.id,lang:a.language,source:l.source,box:l.box,original:l.text.trim(),...g,lowWords:l.lowWords||[],ocrConfidence:l.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await f.put("entries",k),o.entries.push(k),n.push(k.id)}N();for(const i of o.add.inputs)i.imageURL&&URL.revokeObjectURL(i.imageURL),i.audioURL&&URL.revokeObjectURL(i.audioURL);o.add.inputs=[],o.add.results=n,o.add.step=3,await q(),m()}async function Ta(){var n;const a=o.entries.filter(s=>s.status==="pending"),e=[...new Set(a.map(s=>s.lang))],t=[];e.some(s=>s!=="sw")&&(o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]));for(const s of e)(n=$[s])!=null&&n.mt&&!o.installed.includes(s)&&t.push(["pack",s]);if(await J(t)){for(const[s,i]of a.entries()){O(`Inachanganua ${s+1}/${a.length} · Analysing`);const l=await ja({original:i.original,lang:i.lang,box:i.box},C);Object.assign(i,l),await f.put("entries",i)}N(),await q(),y("Imekamilika · Done"),m()}}async function F(a){await f.put("entries",a),m()}function ra(a){const e=o.entries.find(t=>t.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function ba(){const e=await(await fetch("data/demo.json")).json(),t=new Date;for(const n of e.guests){const s={id:n.id,name:n.name,language:n.language,visitDate:G(ta(t,n.dayOffset)),consent:n.consent,contact:n.consent?{email:n.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",s);for(const i of["liked","improve"])n[i]&&await f.put("entries",{id:`${n.id}_${i}`,guestId:n.id,lang:n.language,source:"typed",box:i,original:n[i],status:"pending",sentences:[],products:[],visitDate:s.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await R(),o.period="all",o.tab="summary",y("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”. · Example data loaded.",5e3),m()}async function Ke(){for(const a of o.guests.filter(e=>e.synthetic))await f.del("guests",a.id);for(const a of o.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await f.del("entries",a.id);for(const a of o.bookings.filter(e=>e.synthetic))await f.del("bookings",a.id);await R(),y("Imeondolewa · Removed"),m()}async function Ue(a){const e=Y(a);if(!(!e||!confirm(`Futa ${e.name} na maoni yake yote?

Delete ${e.name} and all their feedback?`))){await f.del("guests",a);for(const t of o.entries.filter(n=>n.guestId===a))await f.del("entries",t.id);for(const t of o.messages.filter(n=>n.guestId===a))await f.del("messages",t.id);await R(),m()}}async function _e(){var e;if(!o.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await ya(a)}const Fe={"guide-open":()=>aa(0),"guide-next":()=>aa(Math.min(o.guide.step+1,E.length-1)),"guide-prev":()=>aa(Math.max(o.guide.step-1,0)),"guide-close":ea,"guide-try":Le,"guide-demo":async()=>{await ea(),await ba()},go:a=>{o.tab=a.dataset.tab,m(),window.scrollTo(0,0)},"toggle-en":async()=>{const a=!document.body.classList.contains("hide-en");document.body.classList.toggle("hide-en",a),await f.setSetting("showEn",!a)},sync:Te,"add-booking":Pe,"download-pack":a=>la([a.dataset.lang]),"download-suggested":()=>la(P().download),"download-recommended":()=>la(P().recommend),"delete-pack":a=>fa([a.dataset.lang]),"delete-removable":()=>fa(P().removable),"download-shared":async a=>{await J([["shared",a.dataset.key]])&&m()},"pick-booking":a=>Ce(a.dataset.id),"pick-guest":a=>{o.add=A(),o.add.guestId=a.dataset.id,o.add.step=2,m()},"save-new-guest":We,"change-guest":()=>{o.add.step=1,m()},"add-typed":()=>{o.add.inputs.push({id:I("in"),source:"typed",box:"liked",text:"",status:"ready"}),m()},record:Re,"remove-input":a=>{o.add.inputs=o.add.inputs.filter(e=>e.id!==a.dataset.id),m()},"use-hint":async a=>{const e=H();e.language=a.dataset.lang,await f.put("guests",e),o.add.inputs.forEach(t=>{t.langHint=null}),y(`Lugha: ${$[e.language].sw} · ${$[e.language].en}`),m()},"run-analysis":He,"finish-add":()=>{o.add=A(),o.tab="summary",m(),window.scrollTo(0,0)},"more-feedback":()=>{const a=o.add.guestId;o.add=A(),o.add.guestId=a,o.add.step=2,m()},"fix-mood":async a=>{const[e,t]=ra(a);t&&(t.sentiment=a.dataset.mood,t.flags=(t.flags||[]).filter(n=>n==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await F(e))},"confirm-sent":async a=>{const[e,t]=ra(a);t&&(t.confirmed=!0,t.flags=[],await F(e))},"sw-mood":async a=>{var n;const e=o.entries.find(s=>s.id===a.dataset.entry);if(!e)return;const t=((n=e.sentences)==null?void 0:n[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=a.dataset.mood,e.sentences=[t],await F(e)},period:a=>{o.period=a.dataset.period,m()},speak:async()=>{const{s:a,text:e}=Ma();await me(pe(a))||Ha(e.sw.join(" "))},"analyze-pending":Ta,share:_e,"toggle-draft":a=>{o.openGuest=o.openGuest===a.dataset.id?null:a.dataset.id,m()},"mark-sent":async a=>{const e={id:I("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await f.put("messages",e),o.messages.push(e),setTimeout(m,400)},copy:a=>{var e;return ya(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>Ue(a.dataset.id),"load-demo":ba,"remove-demo":Ke,wipe:async()=>{confirm(`Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.

Delete ALL data on this phone? This cannot be undone.`)&&(await f.wipeAll(),await R(),o.add=A(),y("Data yote imefutwa · All data deleted"),m())}},Ge={"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,t]=ra(a);t&&(t.topic=a.value,t.flags=(t.flags||[]).filter(n=>n!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await F(e))},"sw-topic":async a=>{var n;const e=o.entries.find(s=>s.id===a.dataset.entry);if(!e||!a.value)return;const t=((n=e.sentences)==null?void 0:n[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=a.value,e.sentences=[t],await F(e)},"share-ok":a=>{o.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked)}},qe={"input-text":a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.text=a.value),Ye()},"input-english":a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.english=a.value)}};function Ye(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=o.add.inputs.some(n=>n.status==="ready"&&(n.text||"").trim()),t=o.add.inputs.some(n=>n.status==="working");a.disabled=!(e&&!t)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const t=Fe[e.dataset.action];t&&(e.tagName==="BUTTON"&&a.preventDefault(),Promise.resolve(t(e,a)).catch(n=>{console.error(n),N(),y(`Hitilafu · Error: ${n.message}`,6e3)}))});document.addEventListener("change",a=>{var n;const e=a.target;if(e.matches("input[type=file][data-file]")){const s=(n=e.files)==null?void 0:n[0];if(e.value="",!s)return;const i=e.dataset.file;(i==="audio"?Ea(s):Oe(s,i==="photo-liked"?"liked":"improve")).catch(u=>{N(),y(u.message,6e3)});return}const t=Ge[e.dataset.change];t&&Promise.resolve(t(e)).catch(s=>y(s.message,6e3))});document.addEventListener("input",a=>{var t;const e=qe[(t=a.target.dataset)==null?void 0:t.input];e&&e(a.target)});document.addEventListener("keydown",a=>{a.key==="Escape"&&o.guide.open&&ea()});window.addEventListener("online",()=>{o.online=!0,m()});window.addEventListener("offline",()=>{o.online=!1,m()});async function Je(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const n of performance.getEntriesByType("resource"))t.add(n.name);await Promise.all([...t].map(async n=>{try{const s=new URL(n);if(s.pathname.endsWith("/data/bookings.json"))return;const i=s.origin===location.origin?a:s.hostname==="cdn.jsdelivr.net"?e:null;i&&!await i.match(n)&&await i.add(n)}catch{}}))}async function Ve(){await R(),m(),await f.getSetting("guideSeen",!1)||aa(0),await q(),m(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(Je).catch(a=>console.warn("Offline cache not available",a)),"speechSynthesis"in window&&speechSynthesis.getVoices(),ca().then(a=>{a&&navigator.onLine&&ke()})}Ve().catch(a=>{console.error(a),Sa.innerHTML=`<div class="notice neg"><strong>Hitilafu · Error</strong>${c(a.message)}</div>`});
