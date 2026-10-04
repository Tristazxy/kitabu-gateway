import{l as v,t as C,P as A,L as S,e as Ka,f as le,g as de,i as Aa,c as re,a as ce,j as ue,k as t,h as r,m as T,n as Q,o as k,b as N,d as x,q as fa,r as Ua,u as qa,v as D,s as U,w as me,x as pe,p as K,y as ge,z as he,A as $,B as fe,C as ua,S as E,D as ke,E as we,F as ye,G as be,H as $e,I as ve,K as Na,J as xe,N as V,O as Se}from"./ui-BcsZZw4Z.js";const je="kitabu",ze=1,Fa=["guests","entries","bookings","messages","settings"];let oa=null;function Me(){return oa||(oa=new Promise((a,e)=>{const n=indexedDB.open(je,ze);n.onupgradeneeded=()=>{const i=n.result;for(const o of Fa)i.objectStoreNames.contains(o)||i.createObjectStore(o,{keyPath:o==="settings"?"key":"id"})},n.onsuccess=()=>a(n.result),n.onerror=()=>e(n.error)}),oa)}function H(a,e,n){return Me().then(i=>new Promise((o,l)=>{const d=i.transaction(a,e),c=d.objectStore(a);let u;Promise.resolve(n(c)).then(m=>{u=m}),d.oncomplete=()=>o(u),d.onerror=()=>l(d.error),d.onabort=()=>l(d.error)}))}function Ea(a){return new Promise((e,n)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>n(a.error)})}const g={async all(a){return H(a,"readonly",e=>Ea(e.getAll()))},async get(a,e){return H(a,"readonly",n=>Ea(n.get(e)))},async put(a,e){return await H(a,"readwrite",n=>{n.put(e)}),e},async putMany(a,e){await H(a,"readwrite",n=>{for(const i of e)n.put(i)})},async del(a,e){await H(a,"readwrite",n=>{n.delete(e)})},async clear(a){await H(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const n=await this.get("settings",a);return n?n.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of Fa)await this.clear(a)}};function z(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const Ie=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],Be=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function ma(a){const e=new Date(a);return`${Ie[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function _a(a){const e=new Date(a);return`${Be[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Te(a){if(!a.length)return"WeKaribu: Hakuna wageni waliopangwa wiki ijayo.";const e=a.reduce((i,o)=>i+(Number(o.guests)||1),0),n=a.slice().sort((i,o)=>new Date(i.date)-new Date(o.date)).map(i=>`${ma(i.date)}: wageni ${i.guests} (${v(i.language,"sw")})${i.guide?`, mwongozaji ${i.guide}`:""}`);return`WeKaribu: Wiki ijayo wageni ${e}.
${n.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function va(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function X(a){return`WeKaribu: Wageni wapya. ${ma(a.date)}: wageni ${a.guests} (${v(a.language,"sw")})${a.guide?`, mwongozaji ${a.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const F=a=>`${a} ${a===1?"guest":"guests"}`,Wa=a=>`${a} ${a===1?"entry":"entries"}`;function Le(a,e="Noor"){const n=[],i=[];if(n.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),i.push(`This period: ${F(a.guests)}, ${Wa(a.entries)}.`),a.guests===0)return n.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),i.push("No feedback yet. Add guest feedback first."),{sw:n,en:i};a.guests<5&&(n.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),i.push(`Caution: still little feedback (${F(a.guests)}). Too early for big decisions.`));const l=a.liked.filter(u=>u.id!=="other").slice(0,3);l.length&&(n.push("Walichopenda zaidi: "+l.map(u=>`${C(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),i.push("What they liked most: "+l.map(u=>`${C(u.id).en.toLowerCase()} (${F(u.guests)})`).join("; ")+"."));const d=a.improve.filter(u=>u.id!=="other").slice(0,3);d.length?(n.push("Wanachotaka kiboreshwe: "+d.map(u=>`${C(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),i.push("What they want improved: "+d.map(u=>`${C(u.id).en.toLowerCase()} (${F(u.guests)})`).join("; ")+".")):(n.push("Hakuna malalamiko yaliyotajwa."),i.push("No complaints were mentioned.")),a.products.length&&(n.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(u=>`${A.find(m=>m.id===u.id).sw} (wageni ${u.guests})`).join("; ")+"."),i.push("Products guests wanted to buy: "+a.products.map(u=>`${A.find(m=>m.id===u.id).en} (${F(u.guests)})`).join("; ")+"."));const c=va(a);if(c){const u=A.find(m=>m.id===c.id);n.push(`Wazo: wageni ${c.guests} kati ya ${a.guests} walitaka ${u.sw}. Unaweza kufikiria kuuza ${u.sw}. Uamuzi ni wako.`),i.push(`Idea: ${c.guests} of ${a.guests} guests wanted ${u.en}. You could consider selling ${u.en}. The decision is yours.`)}return a.unsure>0&&(n.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),i.push(`${a.unsure} ${a.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${a.unsure===1?"it":"them"} with your helper or the guide.`)),a.swahiliEntries>0&&(n.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),i.push(`${Wa(a.swahiliEntries)} in Swahili — ${e} reads ${a.swahiliEntries===1?"it":"them"} directly.`)),{sw:n,en:i}}const pa={sw:{liked:(a,e,n)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${n}`,plain:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${e}`},en:{liked:(a,e,n)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — ${n}`,plain:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${e}`},it:{liked:(a,e,n)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${n}`,plain:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${e}`},fr:{liked:(a,e,n)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${n}`,plain:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${e}`},de:{liked:(a,e,n)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${n}`,plain:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${e}`},zh:{liked:(a,e,n)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${n}`,plain:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${e}`},es:{liked:(a,e,n)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${n}`,plain:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${e}`},pl:{liked:(a,e,n)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${n}`,plain:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${e}`}};function Oa(a,e,n="Noor"){const i=pa[a.language]?a.language:"en",o=i!==a.language,l=(a.name||"").trim()||(i==="zh"?"":"friend"),d=e?Ka.find(u=>u.id===e):null,c=u=>d?pa[u].liked(l,d.msg[u]||d.msg.en,n):pa[u].plain(l,n);return{lang:i,text:c(i),sw:c("sw"),usedFallback:o}}const Pa={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function Ga(a,e,n="Noor"){const i=[];i.push(`Ripoti ya maoni — ${e}`),i.push(`Feedback report — ${e}`),i.push(""),i.push(`Wageni / Guests: ${a.guests}`);const o=Object.entries(a.languages).map(([d,c])=>`${S[d]?S[d].en:d} ${c}`).join(", ");o&&i.push(`Lugha / Languages: ${o}`),i.push(""),i.push("Walichopenda / Liked:");for(const d of a.liked.filter(c=>c.id!=="other").slice(0,5))i.push(`  • ${C(d.id).en}: ${d.guests}`);i.push("Kuboresha / To improve:");const l=a.improve.filter(d=>d.id!=="other").slice(0,5);l.length||i.push("  • —");for(const d of l)i.push(`  • ${C(d.id).en}: ${d.guests}`);if(a.products.length){i.push("Bidhaa / Product interest:");for(const d of a.products)i.push(`  • ${A.find(c=>c.id===d.id).en}: ${d.guests}`)}return i.push(""),i.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),i.push(`Imeidhinishwa na ${n} kabla ya kutumwa. / Approved by ${n} before sharing.`),i.join(`
`)}function ea(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function De(a,e,n=new Date){if(e==="all")return!0;const i=new Date(a),o=e==="week"?7:e==="month"?31:3650;return n-i<=o*24*3600*1e3&&i-n<=24*3600*1e3}function Ce(a,e){const n=Object.fromEntries(e.map(w=>[w.id,w])),i=new Set,o={},l={},d={},c={};let u=0,m=0;const p=(w,h,b,I)=>{w[h]||(w[h]={id:h,guestIds:new Set,quotes:[]}),w[h].guestIds.add(b),I&&w[h].quotes.push(I)};for(const w of a){i.add(w.guestId),w.lang==="sw"&&m++;for(const h of w.sentences||[]){const b=ea(h);b&&u++;const I={entryId:w.id,en:h.en,original:h.original||null,lang:w.lang,flagged:b};h.sentiment==="pos"?p(l,h.topic,w.guestId,I):h.sentiment==="neg"&&p(d,h.topic,w.guestId,I)}for(const h of new Set([...w.products||[],...w.declaredProducts||[]]))p(c,h,w.guestId,null)}for(const w of i){const h=n[w],b=h?h.language:"unknown";o[b]=(o[b]||0)+1}const y=w=>Object.values(w).map(h=>({id:h.id,guests:h.guestIds.size,quotes:h.quotes})).sort((h,b)=>b.guests-h.guests);return{guests:i.size,entries:a.length,liked:y(l),improve:y(d),products:y(c),unsure:u,swahiliEntries:m,languages:o}}function Ae(a,e){const n={};for(const o of a.filter(l=>l.guestId===e))for(const l of o.sentences||[])l.sentiment==="pos"&&l.topic!=="other"&&(n[l.topic]=(n[l.topic]||0)+1);const i=Object.entries(n).sort((o,l)=>l[1]-o[1])[0];return i?i[0]:null}async function Va(a,e){const{original:n,lang:i,box:o}=a;if(i==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let l;a.english?l=[{original:null,en:a.english}]:l=(await le(n,i,e)).pairs;const d=[];for(const w of l)for(const h of de(w.en))d.push({en:h,original:w.original});const c=l.map(w=>w.en).join(" ").trim();if(!d.length)return{english:c,sentences:[],products:Aa(c),status:"analyzed"};const u=d.map(w=>w.en),m=await re(u,e),p=await ce(u,e),y=d.map((w,h)=>{var La,Da,Ca;const b=ue(o,p[h]),I=[...b.flags];return m[h].topic==="other"&&I.push("topic-unsure"),(La=S[i])!=null&&La.fallback&&!a.english&&I.push("fallback-pack"),{en:w.en,original:w.original,topic:m[h].topic,topicScore:m[h].score,runnerUp:m[h].runnerUp,sentiment:b.sentiment,moodScore:((Da=p[h])==null?void 0:Da.score)??null,modelMood:((Ca=p[h])==null?void 0:Ca.label)??null,flags:I,confirmed:!1}});return{english:c,sentences:y,products:Aa(c),status:"analyzed"}}let _;async function xa(){if(_!==void 0)return _;try{const a=await fetch("audio/sw/manifest.json");_=a.ok?await a.json():null}catch{_=null}return _}const la=a=>a>=1&&a<=20?`g_${a}`:"g_more";function Ne(a){if(!a.guests)return["no_feedback"];const e=["period",la(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const n=a.liked.filter(l=>l.id!=="other").slice(0,3);if(n.length){e.push("liked_intro");for(const l of n)e.push(`t_${l.id}`,la(l.guests))}const i=a.improve.filter(l=>l.id!=="other").slice(0,3);if(i.length){e.push("improve_intro");for(const l of i)e.push(`t_${l.id}`,la(l.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const l of a.products)e.push(`p_${l.id}`,la(l.guests))}const o=va(a);return o&&e.push("idea_intro",`p_${o.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let ka=0,J=null;function Ee(){ka++,J&&(J.pause(),J=null)}async function We(a){const e=await xa();if(!e||!a.every(i=>e.files[i]))return!1;Ee();const n=++ka;for(const i of a){if(n!==ka)break;await new Promise(o=>{const l=new Audio(`audio/sw/${e.files[i]}`);J=l,l.onended=o,l.onerror=o,l.play().catch(o)})}return J=null,!0}async function Oe(){const a=await xa();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}const ga={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>'},G=[{icon:ga.book,title:()=>t("Karibu","Welcome"),body:()=>[t("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),t("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:ga.steps,title:()=>t("Hatua tatu","Three steps"),list:()=>[t("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),t("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),t("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[t("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:ga.play,title:()=>t("Jaribu sasa","Try it now"),body:()=>[t("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function Pe(a){const e=G[a],n=a===G.length-1,i=G.map((c,u)=>`<span class="${u===a?"on":""}"></span>`).join(""),o=e.list?`<ol class="guide-list">${e.list().map(c=>`<li>${c}</li>`).join("")}</ol>`:"",l=e.body().map(c=>`<p class="lead">${c}</p>`).join(""),d=e.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${t("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${t("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${a+1} / ${G.length}">${i}</div>
      <button class="guide-close" data-action="guide-close">${t("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${e.icon}</div>
    <h2 id="guide-title">${e.title()}</h2>
    ${o}
    ${l}
    ${d}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${a===0?"disabled":""}>${t("Rudi","Back")}</button>
      ${n?"":`<button class="btn" data-action="guide-next">${t("Endelea","Next")}</button>`}
    </div>
  </div>`}const ca=(a,e)=>e==="sw"?ma(a):_a(a);function Re(a,e,n=new Date){return e&&e.length?e.filter(i=>new Date(i)>=T(n,-1)).sort():(a.availableOffsets||[]).map(i=>Q(T(n,i)))}const He='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',Ja='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';function Ke({q:a,hosts:e,lang:n,loading:i}){const o=(a||"").trim().toLowerCase(),l=o?e.filter(c=>[c.name,c.town,...c.tags||[]].join(" ").toLowerCase().includes(o)):e,d=c=>`
    <button class="home-btn" data-action="open-host" data-id="${c.id}">
      <span class="role-icon tile-leaf" aria-hidden="true">${Ja}</span>
      <span class="role-text"><strong>${r(c.name)}</strong>
        <span class="small muted">${r(c.town)} · ${(c.tags||[]).slice(0,3).map(r).join(" · ")}</span>
        <span class="small">${t("Lugha","Languages")}: ${c.languages.map(u=>r(v(u,n))).join(", ")}</span></span>
    </button>`;return`
  <h1>${t("Tafuta mahali pa kutembelea","Find a place to visit")}</h1>
  <p class="small muted">${t("Wenyeji wadogo ambao hawana tovuti wala intaneti. Rafiki akikuambia jina la kijiji, tafuta hapa.","Small hosts with no website and no internet. If a friend told you the name of a village, search for it here.")}</p>
  <label class="field search">${He}<input type="search" id="find-q" value="${r(a||"")}" placeholder="${t("Kijiji, jina au shughuli… k.m. Materuni","Village, name or activity… e.g. Materuni")}" autocomplete="off" data-input="find-q"></label>
  ${i?`<p class="muted">${t("Inapakia…","Loading…")}</p>`:""}
  <div class="stack" style="margin-top:12px">
    ${l.length?l.map(d).join(""):`<div class="notice">${t("Hakuna matokeo. Jaribu jina la kijiji.","No results. Try the name of the village.")}</div>`}
  </div>
  <p class="small muted" style="margin-top:14px">${t("Orodha ya mfano (data bandia). Toleo halisi linapata orodha kutoka kwa kampuni ya utalii au ofisi ya utalii.","Example directory (synthetic). The real version gets the list from the tour company or the tourism office.")}</p>
  <div class="row home-links">
    <button class="link-btn" data-action="hand-to-guest">${t("Umeshatembelea? Andika maoni","Already visited? Leave feedback")}</button>
    <button class="link-btn" data-action="switch-role">${t("Badilisha upande","Switch side")}</button>
  </div>`}function Ue(a,e,n){const i=d=>C(d)[n].split(" (")[0].toLowerCase(),o=e&&e.guests?{guests:e.guests,liked:e.liked.filter(d=>d.id!=="other").slice(0,3).map(d=>d.id),improve:e.improve.filter(d=>d.id!=="other").slice(0,2).map(d=>d.id),products:e.products.map(d=>d.id)}:a.sample;if(!o||!o.guests)return t("Bado hakuna maoni.","No feedback yet.");const l=[t(`Wageni ${o.guests} wametoa maoni.`,`${o.guests} guests left feedback.`)];if(o.liked.length&&l.push(t(`Walipenda: ${o.liked.map(i).join(", ")}.`,`Loved: ${o.liked.map(i).join(", ")}.`)),o.improve.length&&l.push(t(`Kuboresha: ${o.improve.map(i).join(", ")}.`,`To improve: ${o.improve.map(i).join(", ")}.`)),o.products.length){const d=o.products.map(c=>(A.find(u=>u.id===c)||{})[n]||c);l.push(t(`Bidhaa zinazopatikana: ${d.join(", ")}.`,`For sale: ${d.join(", ")}.`))}return l.join(" ")}function qe({host:a,days:e,selected:n,summaryLine:i,form:o,lang:l,knownGuest:d}){const c={guests:2,language:"en",name:"",email:"",consent:!1,referredBy:"",...o},u=e.length?e.map(p=>`<button class="chip" data-action="book-day" data-day="${p}" aria-pressed="${p===n}">${r(ca(p+"T12:00:00",l))}</button>`).join(""):`<span class="muted">${t("Hakuna siku zilizotangazwa bado. Uliza kampuni ya utalii.","No days published yet. Ask the tour company.")}</span>`,m=Object.entries(S).filter(([p])=>p!=="xx"||!0).map(([p,y])=>`<option value="${p}" ${p===c.language?"selected":""}>${r(y[l])}${y.native!==y[l]?` (${r(y.native)})`:""}</option>`).join("");return`
  <button class="btn small secondary" data-action="go" data-screen="find" style="margin-bottom:12px">← ${t("Orodha","Places")}</button>
  <div class="card hero-card">
    <div class="hero-art" aria-hidden="true">${Ya}</div>
    <h1 style="margin-top:10px">${r(a.name)}</h1>
    <p class="small muted" style="margin-top:-4px">${r(a.town)} · ${(a.tags||[]).map(r).join(" · ")}</p>
    <p>${r(a.blurb)}</p>
    <div class="row small">
      <span class="chip plain">${t("Lugha","Languages")}: ${a.languages.map(p=>r(v(p,l))).join(", ")}</span>
      <span class="chip plain">${t("Mwongozaji","Guide")}: ${r(a.guide)}</span>
    </div>
    <p class="small muted" style="margin:8px 0 0">${r(a.price)}</p>
  </div>

  <div class="card">
    <h2>${t("Wageni walisema","What guests said")}</h2>
    <p style="margin:0">${r(i)}</p>
    <p class="small muted" style="margin:6px 0 0">${t("Jumla tu, hakuna majina. Imekusanywa kwenye simu ya mwenyeji.","Counts only, no names. Collected on the host’s own phone.")}</p>
  </div>

  <div class="card">
    <h2>${t("Weka nafasi","Book a visit")}</h2>
    <p class="small muted">${t("Mwenyeji anatangaza siku anazoweza kupokea wageni wiki moja mbele. Ombi lako linakwenda kwa kampuni ya utalii; mwenyeji anapata SMS.","The host publishes the days she can take guests a week ahead. Your request goes to the tour company; the host gets an SMS.")}</p>
    <div class="stack">
      <div><div class="field-label">${t("Siku","Day")}</div><div class="row">${u}</div></div>
      <div class="grid2">
        <label class="field">${t("Wageni","Guests")}<input type="number" id="bk-v-guests" min="1" max="12" value="${c.guests}"></label>
        <label class="field">${t("Lugha yenu","Your language")}<select id="bk-v-lang">${m}</select></label>
      </div>
      <label class="field">${t("Jina lako","Your name")}<input type="text" id="bk-v-name" value="${r(c.name)}" autocomplete="off"></label>
      <label class="field">${t("Nani alikuambia kuhusu mahali hapa? (hiari)","Who told you about this place? (optional)")}<input type="text" id="bk-v-ref" value="${r(c.referredBy)}" autocomplete="off" data-input="bk-v-ref"></label>
      ${d?`<div class="notice small">${t(`${r(d.name)} alitembelea hapa (${r(ca(d.visitDate,l))}). Mwenyeji atafurahi kujua.`,`${r(d.name)} visited here (${r(ca(d.visitDate,l))}). The host will be glad to know.`)}</div>`:""}
      <label class="field">${t("Barua pepe (hiari)","Email (optional)")}<input type="email" id="bk-v-email" value="${r(c.email)}" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-v-consent" ${c.consent?"checked":""}> <span>${t("Mwenyeji anaweza kuhifadhi barua pepe yangu na kuniandikia baada ya ziara.","The host may keep my email and write to me after the visit.")}</span></label>
      <button class="btn block" data-action="book-submit" ${n?"":"disabled"}>${t("Tuma ombi","Send the request")}</button>
      <p class="small muted" style="margin:0">${t("Hakuna malipo hapa. Kampuni ya utalii inathibitisha kwa barua pepe au WhatsApp.","No payment here. The tour company confirms by email or WhatsApp.")}</p>
    </div>
  </div>`}function Fe({host:a,booking:e,lang:n}){return`
  <div class="card" style="text-align:center;padding:28px 18px">
    <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Ja}</div>
    <h1>${t("Ombi limetumwa","Request sent")}</h1>
    <p class="lead">${t(`${r(a.company)} itathibitisha. ${r(a.name.split("’")[0])} atapata SMS kwenye simu yake.`,`${r(a.company)} will confirm. The host gets an SMS on a basic phone.`)}</p>
    <div class="card flat" style="text-align:left">
      <div class="small muted">${t("Ombi lako","Your request")}</div>
      <p style="margin:6px 0 0"><strong>${r(a.name)}</strong> · ${r(ca(e.date,n))} · ${t("wageni","guests")} ${r(e.guests)} · ${r(v(e.language,n))}</p>
      ${e.referredBy?`<p class="small muted" style="margin:4px 0 0">${t("Alipendekezwa na","Recommended by")}: ${r(e.referredBy)}</p>`:""}
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="btn block" data-action="go" data-screen="find">${t("Tafuta mahali pengine","Find another place")}</button>
      <button class="btn secondary block" data-action="switch-role">${t("Maliza","Done")}</button>
    </div>
  </div>`}const Ya=`<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
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
</svg>`,Za=["en","it","fr","de","zh","es","pl","sw","xx"],Ra={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function Qa(a){const e=Ra[a]||{...Ra.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},n={};for(const[i,o]of Object.entries(e))n[i]=o.replace(/\{host\}/g,k());return n}function Sa(){for(const a of navigator.languages||[navigator.language||"en"]){const e=String(a).slice(0,2).toLowerCase();if(Za.includes(e))return e}return"en"}const Xa={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'},_e=Xa.visitor;function Ge(){const a={host:"tile-caramel",visitor:"tile-leaf",company:"tile-sky"},e=(n,i,o)=>`
    <button class="home-btn" data-action="choose-role" data-role="${n}">
      <span class="role-icon ${a[n]}" aria-hidden="true">${Xa[n]}</span>
      <span class="role-text"><strong>${i}</strong><span class="small muted">${o}</span></span>
    </button>`;return`
  <div class="hero" aria-hidden="true">${Ya}
    <div class="hero-text"><h1>${t("Karibu!","Welcome!")}</h1><p>${t("Wageni wanaandika kwa lugha yao. Mwenyeji anasikia kwa lugha yake.","Guests write in their language. The host hears it in hers.")}</p></div>
  </div>
  <h2>${t("Wewe ni nani?","Who are you?")}</h2>
  <div class="stack" style="margin-top:12px">
    ${e("host",t("Mwenyeji","Host"),t("Ongeza maoni, sikiliza muhtasari, washukuru wageni.","Add feedback, hear the summary, thank guests."))}
    ${e("visitor",t("Mgeni","Visitor"),t("Tafuta mahali, weka nafasi, andika maoni kwa lugha yako.","Find a place, book a visit, leave feedback in your language."))}
    ${e("company",t("Kampuni ya utalii au mwongozaji","Tour company or guide"),t("Tuma ratiba ya wageni kwa SMS.","Send guest bookings by SMS."))}
  </div>
  <p class="small muted" style="margin-top:14px">${t("Unaweza kubadilisha baadaye.","You can switch later.")}</p>`}function Ve(a,e,n={}){const i=Qa(a),o={name:"",liked:"",improve:"",email:"",...n},l=Za.map(d=>`<button class="chip" data-action="visitor-lang" data-lang="${d}" aria-pressed="${d===a}">${r(S[d].native)}</button>`).join("");return e?`
    <div class="card" lang="${a}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${_e}</div>
      <h1>${r(i.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${r(i.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${r(i.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${t(`Kwa ${k()} tu: rudi`,`${k()} only: back`)}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${r(i.lang)}">${l}</div>
  <div class="card" lang="${a}">
    <h1>${r(i.title)}</h1>
    <p>${r(i.intro)}</p>
    <div class="stack">
      <label class="field">${r(i.name)}<input type="text" id="v-name" autocomplete="off" value="${r(o.name)}"></label>
      <label class="field">${r(i.liked)}<textarea id="v-liked">${r(o.liked)}</textarea></label>
      <label class="field">${r(i.improve)}<textarea id="v-improve">${r(o.improve)}</textarea></label>
      <fieldset style="border:0;padding:0;margin:0">
        <legend style="font-weight:600;font-size:.95rem;margin-bottom:6px">${r(i.buy)}</legend>
        <div class="row">
          <label class="check"><input type="checkbox" id="v-buy-coffee"> <span>${r(i.coffee)}</span></label>
          <label class="check"><input type="checkbox" id="v-buy-souvenir"> <span>${r(i.souvenir)}</span></label>
        </div>
      </fieldset>
      <label class="field">${r(i.email)}<input type="email" id="v-email" autocomplete="off" value="${r(o.email)}"></label>
      <label class="check"><input type="checkbox" id="v-consent"> <span>${r(i.consent)}</span></label>
      <button class="btn block" data-action="visitor-save">${r(i.save)}</button>
      <p class="small muted" style="margin:0">${r(i.privacy)}</p>
    </div>
  </div>
  <button class="btn small secondary" data-action="visitor-exit">${t(`Kwa ${k()} tu: rudi`,`${k()} only: back`)}</button>`}function Je({langOptionsHTML:a,today:e,sms:n,report:i}){return`
  <h1>${t("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${t(`Tuma ratiba ya wageni kwa ${k()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${k()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${t(`Namba ya simu ya ${k()}`,`${k()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${t("Tarehe","Date")}<input type="date" id="c-date" value="${e}" data-change="company-preview"></label>
        <label class="field">${t("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${t("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${a}</select></label>
      <label class="field">${t("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${t("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${t(`Mgeni amekubali ${k()} awasiliane naye`,`The guest agreed that ${k()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${t("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${t(`SMS ambayo ${k()} atapokea`,`The SMS ${k()} will get`)}</h2>
    <div class="sms" id="c-sms">${r(n)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${t(`Tuma SMS kwa ${k()}`,`Send SMS to ${k()}`)}</button>
      <button class="btn secondary" data-action="company-save">${t("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${t(`Unachopokea kutoka kwa ${k()}`,`What you get back from ${k()}`)}</h2>
    <p class="small">${t("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.")}</p>
    ${i?`<div class="sms">${r(i)}</div>`:""}
  </div>`}const ae=document.getElementById("view"),W=()=>({step:1,guestId:null,inputs:[],results:[]}),s={screen:"home",role:null,guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:W(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}},hosts:null,find:{q:""},book:{hostId:null,day:null,form:{},done:null},availableDays:[]};async function R(){const[a,e,n,i]=await Promise.all(["guests","entries","bookings","messages"].map(o=>g.all(o)));Object.assign(s,{guests:a,entries:e,bookings:n,messages:i}),s.lastSync=await g.getSetting("lastSync"),s.role=await g.getSetting("role",null),s.availableDays=await g.getSetting("availableDays",[]),fa(await g.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await g.getSetting("bigText",!1))}async function ta(){try{s.installed=await $e();for(const a of Object.keys(E))s.shared[a]=await ve(E[a].id)}catch(a){console.warn("model check failed",a)}}const na=a=>s.guests.find(e=>e.id===a),q=()=>na(s.add.guestId);function O(){return be({guests:s.guests,bookings:s.bookings,installed:s.installed,today:new Date})}function ia(){const a=s.entries.filter(n=>n.status!=="pending"&&De(n.visitDate||n.createdAt,s.period)),e=Ce(a,s.guests);return{s:e,entries:a,text:Le(e,k())}}const P=a=>$()==="sw"?ma(a):_a(a),aa=a=>C(a)[$()].split(" (")[0],B=a=>{var e;return`<span class="chip plain lang-pill" title="${r(((e=S[a])==null?void 0:e.native)||a)}">${r(v(a,$()))}</span>`};function Ye(a){return a==="pos"?`<span class="chip">${t("Nzuri","Positive")}</span>`:a==="neg"?`<span class="chip neg">${t("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${t("Haijulikani","Unsure")}</span>`}function Ze(a){return a.consent?`<span class="chip">${t("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${t("Hakuna ruhusa","No consent")}</span>`}function Qe(a){var e;return(e=S[a])!=null&&e.mt?s.installed.includes(a)?`<span class="chip">${t("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${t("Pakua lugha","Pack needed")}</span>`:""}const ee={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},Xe=a=>ee[a][$()==="sw"?0:1];function ja(a){const e=$();return Object.entries(S).map(([n,i])=>`<option value="${n}" ${n===a?"selected":""}>${r(i[e])}${i.native!==i[e]?` (${r(i.native)})`:""}</option>`).join("")}function te(a){return[...Ka,Se].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${r(e[$()])}</option>`).join("")}const L=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${t("Nyumbani","Home")}</button>`;function ne(a,e,{open:n=!1}={}){const i=a.sentences[e],o=ea(i),l=(i.flags||[]).filter(c=>ee[c]),d=i.original&&a.lang!=="en";return`
  <div class="sent">
    ${d?`<div class="orig" lang="${r(a.lang)}">“${r(i.original)}”</div>`:""}
    ${i.en?`<div class="${d?"small muted":""}">${d?"EN: ":""}${r(i.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${i.topic==="other"?"warn":""}">${r(aa(i.topic))}</span>
      ${Ye(i.sentiment)}
      ${o?`<span class="chip warn">${t("Angalia","Check")}</span>`:i.confirmed?`<span class="chip plain">${t("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${o&&l.length?`<div class="small muted" style="margin-top:4px">${l.map(Xe).join("; ")}</div>`:""}
    <details ${n||o?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${t("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${t("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${te(i.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${i.sentiment==="pos"}">${t("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${i.sentiment==="neg"}">${t("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${t("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function at(a){var n;const e=(n=a.sentences)==null?void 0:n[0];return`
  <div class="sent">
    <div lang="sw">“${r(a.original)}”</div>
    <div class="small muted">${t(`Kiswahili: ${k()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${k()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${t("Mada","Topic")} —</option>${te(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${t("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${t("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function et(a){var l;const e=na(a.guestId),n=a.box==="liked"?t("Walipenda","Liked"):a.box==="improve"?t("Kuboresha","Could be better"):t("Maoni","Feedback"),i=a.source==="photo"?t("Picha","Photo"):a.source==="voice"?t("Sauti","Voice"):t("Imeandikwa","Typed");let o;return a.status==="pending"?o=`<p class="muted">${t("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${r(a.lang)}">“${r(a.original)}”</p>`:a.status==="swahili"?o=at(a):(l=a.sentences)!=null&&l.length?o=a.sentences.map((d,c)=>ne(a,c)).join(""):o=`<p lang="${r(a.lang)}">“${r(a.original)}”</p><p class="small muted">${t("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${r((e==null?void 0:e.name)||"Mgeni")}</strong> ${B(a.lang)}</div>
      <div class="small muted">${i} · ${n}</div>
    </div>
    ${o}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${t("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const wa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',tt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',nt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',it='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',st='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',ot='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',lt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function dt(a){const e=d=>d.filter(c=>c.id!=="other").slice(0,3).map(c=>aa(c.id).toLowerCase()).join(", "),n=e(a.liked),i=e(a.improve),o=[t(`Wageni ${a.guests}.`,`${a.guests} ${a.guests===1?"guest":"guests"}.`)];n&&o.push(t(`Walipenda: ${n}.`,`Loved: ${n}.`)),o.push(i?t(`Kuboresha: ${i}.`,`To improve: ${i}.`):t("Hakuna malalamiko.","No complaints."));const l=va(a);return l&&o.push(t(`Wengi wanataka kununua: ${A.find(d=>d.id===l.id).sw}.`,`Many want to buy: ${A.find(d=>d.id===l.id).en}.`)),o.join(" ")}function rt(){const a=s.entries.filter(p=>p.status==="pending"),{s:e}=ia(),n=s.guests.filter(p=>p.consent&&!s.messages.some(y=>y.guestId===p.id&&y.status==="sent")).length,i=s.bookings.filter(p=>{const y=V(p.date);return y>=0&&y<=7}),o=O(),l=s.entries.reduce((p,y)=>p+(y.sentences||[]).filter(ea).length,0),d=a.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${t(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} new ${a.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${t("Changanua sasa","Analyse now")}</button>
    </div>`:"",c=e.entries?`
    <div class="card accent">
      <div class="card-title"><h2>${t("Wageni walisema","What guests said")}</h2><span class="small muted">${ya[s.period]()}</span></div>
      <p class="big-summary" style="margin:0">${r(dt(e))}</p>
      ${l?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${t(`Sentensi ${l} zinahitaji kuangaliwa.`,`${l} ${l===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${d}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${nt}${t("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${t("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${t("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${t("Bado hakuna maoni.","No feedback yet.")}</p>
      ${d}
      ${a.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${t("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,u=(p,y,w,h,b="")=>`
    <button class="home-btn" ${p}>
      <span class="role-icon ${b}" aria-hidden="true">${y}</span>
      <span class="role-text"><strong>${w}</strong><span class="small muted">${h}</span></span>
    </button>`,m=i.length?t(`Wageni ${i.reduce((p,y)=>p+(Number(y.guests)||1),0)} siku 7 zijazo`,`${i.reduce((p,y)=>p+(Number(y.guests)||1),0)} guests in the next 7 days`)+(o.download.length?` · ${t("pakua","download")} ${o.download.map(p=>v(p,$())).join(", ")}`:""):t("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${c}
  <div class="stack">
    ${u('data-action="go" data-screen="add"',wa,t("Ongeza maoni ya mgeni","Add guest feedback"),t("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"),"tile-caramel")}
    ${u('data-action="hand-to-guest"',st,t("Mpe mgeni simu aandike","Let a guest write"),t("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"),"tile-leaf")}
    ${u('data-action="go" data-screen="guests"',it,t("Washukuru wageni","Thank guests"),n?t(`Wageni ${n} wanasubiri`,`${n} waiting`):t("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"),"tile-cherry")}
    ${u('data-action="go" data-screen="week"',lt,t("Wiki ijayo","Next week"),m,"tile-sky")}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${t("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="switch-role">${t("Badilisha upande","Switch side")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${t("Zaidi","More")}</button>
  </div>`}function ct(){const a=s.bookings.filter(c=>V(c.date)>=0).sort((c,u)=>new Date(c.date)-new Date(u.date)),e=a.filter(c=>V(c.date)<=7),n=a.filter(c=>V(c.date)>7),i=O(),o=Te(e),l=c=>`
    <li>
      <div class="row between">
        <strong>${r(P(c.date))}</strong>
        <span class="badge-num" title="guests">${r(c.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${B(c.language)} ${Qe(c.language)}
        ${c.status==="requested"?`<span class="chip warn">${t("Inasubiri kampuni","Awaiting the company")}</span>`:""}
        ${c.guide?`<span class="muted">${t("Mwongozaji","Guide")}: ${r(c.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${r(c.leadName||"")}${c.company?` · ${r(c.company)}`:""}${c.referredBy?` · ${t("alipendekezwa na","recommended by")} ${r(c.referredBy)}`:""}</div>
    </li>`,d=[...Array(14)].map((c,u)=>{const m=Q(T(new Date,u+1)),p=s.availableDays.includes(m);return`<button class="chip" data-action="toggle-day" data-day="${m}" aria-pressed="${p}">${r(P(m+"T12:00:00"))}</button>`}).join("");return`
  ${L()}
  <h1>${t("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <h2>${t("Siku unazoweza kupokea wageni","Days you can take guests")}</h2>
    <p class="small muted">${t("Wageni wanaziona wanapotafuta mahali, na kampuni ya utalii inapanga kulingana nazo.","Visitors see these when they search for a place, and the tour company books around them.")}</p>
    <div class="row">${d}</div>
  </div>

  <div class="card">
    <button class="btn block" data-action="sync" ${s.online?"":"disabled"}>${t("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${s.lastSync?`${t("Mara ya mwisho","Last updated")}: ${r(new Date(s.lastSync).toLocaleString())}`:t("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${s.online?"":` · ${t("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${e.length?`
  <div class="card">
    <h2>${t("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${e.map(l).join("")}</ul>
  </div>`:`
  <div class="notice">${t("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${t("Lugha za kuandaa","Languages to prepare")}</h2>
    ${i.download.length?`
      <div class="row">${i.download.map(c=>B(c)).join("")}</div>
      <p class="small muted">${t(`MB ${i.downloadMB}. Tumia Wi-Fi.`,`${i.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${s.online?"":"disabled"}>${t("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${t("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${i.removable.length?`
      <hr>
      <p>${t("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${i.removable.map(c=>B(c)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${t(`Futa (MB ${i.freeMB})`,`Delete (frees ${i.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${t("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  <div class="card">
    <h2>${t(`SMS kwa simu ya ${k()}`,`SMS to ${k()}’s basic phone`)}</h2>
    <div class="sms" id="sms-text">${r(o)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${t("Mfano","Preview")} · ${o.length} ${t("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${t("Nakili","Copy")}</button>
    </div>
  </div>

  ${n.length?`
  <div class="card">
    <h2>${t("Baadaye","Later")}</h2>
    <ul class="list">${n.map(l).join("")}</ul>
  </div>`:""}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${t("Ongeza mgeni kwa mkono","Add a booking by hand")}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${t("Tarehe","Date")}<input type="date" id="bk-date" value="${Q(T(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${t("Wageni","Guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${t("Lugha","Language")}<select id="bk-lang">${ja("en")}</select></label>
      </div>
      <label class="field">${t("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${t("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${t(`Mgeni amekubali ${k()} awasiliane naye`,`Guest agreed that ${k()} may contact them`)}</span></label>
      <label class="field hidden" id="bk-email-wrap">${t("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${t("Hifadhi","Save")}</button>
    </div>
  </details>`}function ut(){const a=s.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(n=>`<span class="${a.step>=n?"on":""}"></span>`).join("")}</div>`;return a.step===1?L()+e+ie():a.step===2?L()+e+mt():e+pt()}function ie(){const a=s.bookings.filter(n=>{const i=V(n.date);return i<=1&&i>=-14}).filter(n=>!s.guests.some(i=>i.bookingId===n.id)).sort((n,i)=>new Date(i.date)-new Date(n.date)),e=s.guests.slice().sort((n,i)=>new Date(i.visitDate)-new Date(n.visitDate)).slice(0,12);return`
  <h1>${t("Mgeni ni nani?","Who is the guest?")}</h1>

  ${a.length?`
  <div class="card">
    <h2>${t("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(n=>`
      <li class="row between">
        <div><strong>${r(n.leadName||"Mgeni")}</strong> ${B(n.language)}<div class="small muted">${r(P(n.date))} · ${t("wageni","guests")} ${r(n.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${n.id}">${t("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${t("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${t("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${t("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${ja("en")}</select></label>
      <label class="field">${t("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${Q(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${t(`Mgeni aliweka alama: ${k()} anaweza kuhifadhi mawasiliano yangu`,`Guest ticked: ${k()} may keep my contact details`)}</span></label>
      <div id="contact-fields" class="stack hidden">
        <label class="field">${t("Barua pepe","Email")}<input type="email" id="ng-email" autocomplete="off"></label>
        <label class="field">${t("Simu / WhatsApp","Phone / WhatsApp")}<input type="tel" id="ng-phone" autocomplete="off"></label>
      </div>
      <label class="field">${t("Nani alikupendekezea? (hiari)","Who recommended us? (optional)")}<input type="text" id="ng-ref" autocomplete="off"></label>
      <button class="btn" data-action="save-new-guest">${t("Endelea","Continue")}</button>
    </div>
  </div>

  ${e.length?`
  <div class="card">
    <h2>${t("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${e.map(n=>`
      <li class="row between">
        <div><strong>${r(n.name)}</strong> ${B(n.language)}<div class="small muted">${r(P(n.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${n.id}">${t("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function mt(){var l;const a=q();if(!a)return s.add.step=1,ie();const e=((l=S[a.language])==null?void 0:l.mt)&&!s.installed.includes(a.language),n=s.add.inputs.some(d=>d.status==="ready"&&(d.text||"").trim()),i=s.add.inputs.some(d=>d.status==="working"),o=d=>{var w;const c=`
      <select data-change="box" data-id="${d.id}" aria-label="Box">
        <option value="liked" ${d.box==="liked"?"selected":""}>${t("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${d.box==="improve"?"selected":""}>${t("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${d.box==="unknown"?"selected":""}>${t("Haijulikani","Not sure")}</option>
      </select>`,u=d.langHint?`
      <div class="notice warn small">${t(`Inaonekana ni ${v(d.langHint,"sw")}, si ${v(a.language,"sw")}.`,`This looks like ${v(d.langHint,"en")}, not ${v(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${d.langHint}">${t(`Badilisha kuwa ${v(d.langHint,"sw")}`,`Switch to ${v(d.langHint,"en")}`)}</button></div>
      </div>`:"";let m="";d.imageURL&&(m=`<img class="preview-img" src="${d.imageURL}" alt="Photo of the guestbook box">`),d.audioURL&&(m=`<audio controls src="${d.audioURL}" style="width:100%"></audio>`);let p="";return d.status==="working"?p=`<p class="muted">${t("Inasoma…","Reading…")}</p>`:d.status==="error"?p=`<div class="notice neg small">${t("Imeshindwa","Failed")}: ${r(d.error)}</div>`:p=`
        ${(w=d.lowWords)!=null&&w.length?`<div class="notice warn small"><strong>${t("Angalia maneno haya","Check these words")}</strong>${d.lowWords.slice(0,20).map(h=>`<mark class="low">${r(h)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${d.source==="voice"?t("Alichosema mgeni","What the guest said"):t("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${d.id}" lang="${r(a.language)}">${r(d.text)}</textarea></label>
        ${d.source==="voice"&&a.language!=="en"&&a.language!=="sw"?`
        <label class="field small">${t("Kwa Kiingereza (kutoka kwa modeli ya sauti)","In English (from the voice model)")}
          <textarea data-input="input-english" data-id="${d.id}" style="min-height:80px">${r(d.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${d.source==="photo"?t("Picha","Photo"):d.source==="voice"?t("Sauti","Voice"):t("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${d.id}">${t("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${m}
        <label class="field small">${t("Kisanduku","Which box")}${c}</label>
        ${u}
        ${p}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${r(a.name)}</strong> ${B(a.language)}<div class="small muted">${r(P(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${t("Badilisha","Change")}</button>
    </div>
  </div>

  ${e?`<div class="notice warn">${t(`Lugha ya ${v(a.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${ua}).`,`The ${v(a.language,"en")} pack is not on this phone yet. Analysing needs internet once (${ua} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${wa}<span class="btn-col">${t("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${wa}<span class="btn-col">${t("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${s.recording?"danger":"secondary"}" data-action="record">
      ${s.recording?'<span class="rec-dot"></span>':tt}<span class="btn-col">${s.recording?t("Simamisha","Stop"):t("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${ot}<span class="btn-col">${t("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${t("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${s.add.inputs.map(o).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${n&&!i?"":"disabled"}>${t("Changanua","Analyse")}</button>`}function pt(){const a=s.add.results.map(i=>s.entries.find(o=>o.id===i)).filter(Boolean),e=q(),n=a.reduce((i,o)=>i+(o.sentences||[]).filter(ea).length,0);return`
  <h1>${t("Matokeo","Results")}</h1>
  ${n?`<div class="notice warn"><strong>${t(`Sentensi ${n} zinahitaji kuangaliwa`,`${n} ${n===1?"sentence needs":"sentences need"} a check`)}</strong>${t("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${t("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(et).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${t("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${t(`Ongeza maoni mengine ya ${r((e==null?void 0:e.name)||"mgeni")}`,`Add more for ${r((e==null?void 0:e.name)||"this guest")}`)}</button>
  </div>`}const ya={week:()=>t("Wiki hii","This week"),month:()=>t("Mwezi huu","This month"),all:()=>t("Zote","All time")};function gt(){const a=s.entries.filter(m=>m.status==="pending"),{s:e,entries:n,text:i}=ia(),o=Object.entries(ya).map(([m,p])=>`<button class="chip" data-action="period" data-period="${m}" aria-pressed="${s.period===m}">${p()}</button>`).join(""),l=(m,p)=>m.filter(y=>y.id!=="other").map(y=>{const w=e.guests?Math.round(y.guests/e.guests*100):0,h=y.quotes.slice(0,5).map(b=>`
      <blockquote class="q">${b.original&&b.lang!=="en"?`<div class="orig" lang="${r(b.lang)}">“${r(b.original)}”</div><div class="trans">EN: ${r(b.en)}</div>`:`<div class="orig">“${r(b.en)}”</div>`}
      ${b.flagged?`<span class="chip warn" style="margin-top:4px">${t("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${r(aa(y.id))}</strong><span class="badge-num ${p?"neg":""}">${y.guests}</span></div>
        <div class="bar ${p?"neg":""}"><span style="width:${w}%"></span></div>
        <details class="quotes"><summary>${t("Maneno ya wageni","What guests said")} (${y.quotes.length})</summary>${h}</details>
      </div>`}).join(""),d=[];for(const m of n)(m.sentences||[]).forEach((p,y)=>{ea(p)&&d.push([m,y])});const c=Ga(e,`${ya[s.period]()}`,k()),u=$();return`
  ${L()}
  <h1>${t("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${o}</div>

  ${a.length?`
  <div class="notice warn">
    <strong>${t(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} ${a.length===1?"entry":"entries"} not analysed yet`)}</strong>
    <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${t("Changanua sasa","Analyse now")}</button>
  </div>`:""}

  ${e.entries===0?a.length?"":`
  <div class="card">
    <p>${t("Bado hakuna maoni kwa kipindi hiki.","No feedback for this period yet.")}</p>
    <button class="btn" data-action="go" data-screen="add">${t("Ongeza maoni","Add feedback")}</button>
  </div>`:`
  <div class="card">
    <div class="card-title"><h2>${t(`Kwa ${k()}`,`For ${k()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${t("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${u}">${i[u].map(m=>`<p>${r(m)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${t("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${e.liked.filter(m=>m.id!=="other").length?`<div class="card"><h2>${t("Walichopenda","What they liked")}</h2>${l(e.liked,!1)}</div>`:""}
  ${e.improve.filter(m=>m.id!=="other").length?`<div class="card"><h2>${t("Wanachotaka kiboreshwe","What they want improved")}</h2>${l(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${t("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(m=>{const p=A.find(y=>y.id===m.id);return`<div class="topic-row"><strong>${r(p[u])}</strong><span class="badge-num">${m.guests}</span></div>`}).join("")}
  </div>`:""}

  ${d.length?`
  <div class="card">
    <h2>${t("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${d.map(([m,p])=>{var y;return`<div class="small muted" style="margin-top:8px">${r(((y=na(m.guestId))==null?void 0:y.name)||"")} · ${r(v(m.lang,u))}</div>${ne(m,p,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${t("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${t("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${r(c)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${s.shareOk?"checked":""}>
      <span>${t("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${s.shareOk?"":"disabled"}>${t("Shiriki","Share")}</button>
  </div>`}
  `}function ht(){const a=s.guests.slice().sort((e,n)=>new Date(n.visitDate)-new Date(e.visitDate));return a.length?`
  ${L()}
  <h1>${t("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${t("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const n=s.entries.filter(l=>l.guestId===e.id).length,i=s.messages.some(l=>l.guestId===e.id&&l.status==="sent"),o=s.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${r(e.name)}</strong> ${B(e.language)}${e.synthetic?` <span class="chip plain">${t("mfano","example")}</span>`:""}</div>
          <span class="small muted">${r(P(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Ze(e)} <span class="muted">${t("maoni","entries")}: ${n}</span>
          ${i?`<span class="chip">${t("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${t("Alipendekezwa na","Recommended by")}: ${r(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${o?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${t("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${t("Futa","Delete")}</button>
        </div>
        ${o?ft(e):""}
      </li>`}).join("")}</ul></div>`:`${L()}<h1>${t("Wageni","Guests")}</h1>
      <div class="card"><p>${t("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${t("Ongeza maoni","Add feedback")}</button></div>`}function ft(a){const e=Ae(s.entries,a.id),n=Oa(a,e,k()),i=a.contact||{},o=Pa[n.lang]||Pa.en;let l;a.consent?i.email?l=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${n.lang}" href="mailto:${encodeURIComponent(i.email)}?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(n.text)}">${t("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:i.phone?l=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${n.lang}" href="sms:${encodeURIComponent(i.phone)}?body=${encodeURIComponent(n.text)}">${t("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:l=`<div class="notice small">${t("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:l=`<div class="notice warn small">${t("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const d=$();return`
  <div class="stack" style="margin-top:12px">
    ${n.usedFallback?`<div class="notice warn small">${t(`Hakuna kiolezo cha ${v(a.language,"sw")} bado; tumetumia Kiingereza.`,`No ${v(a.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${n.lang}"><div class="small muted">${t(`Kwa ${v(n.lang,"sw")}`,`In ${v(n.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${r(n.text)}</p></div>
    ${n.lang!==d?`<div class="card flat" lang="${d}"><div class="small muted">${t("Maana yake","What it says")}</div><p style="margin:6px 0 0">${r(d==="sw"?n.sw:Oa({...a,language:"en"},e,k()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${e?t(`Mada aliyopenda: ${aa(e)}`,`Liked topic: ${aa(e)}`):t("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${l}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${t("Nakili","Copy")}</button>
  </div>`}function kt(){const a=O(),e=$(),n=o=>{const l=S[o],d=s.installed.includes(o),c=[];return d&&c.push(`<span class="chip">${t("Imepakuliwa","On phone")}</span>`),a.keep.includes(o)&&c.push(`<span class="chip">${t("Inakaa daima","Kept")}</span>`),a.needed.includes(o)&&c.push(`<span class="chip warn">${t("Wiki ijayo","Needed next week")}</span>`),d&&a.removable.includes(o)&&c.push(`<span class="chip plain">${t("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${r(l[e])}</strong> <span class="muted small">${r(l.native)} · ${ua} MB</span>
          <div class="row" style="margin-top:4px">${c.join("")}</div></div>
        ${d?`<button class="btn small danger" data-action="delete-pack" data-lang="${o}">${t("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${o}" ${s.online?"":"disabled"}>${t("Pakua","Get")}</button>`}
      </div>`},i=o=>{const l=E[o],d=s.shared[o];return`
      <div class="pack">
        <div><strong>${r(l[e])}</strong> <span class="muted small">${l.mb} MB</span></div>
        ${d?`<span class="chip">${t("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${o}" ${s.online?"":"disabled"}>${t("Pakua","Get")}</button>`}
      </div>`};return`
  ${L()}
  <h1>${t("Lugha","Languages")}</h1>
  <p class="small muted">${t(`Kiswahili na Kiingereza daima, pamoja na lugha ${Na} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Na} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${t("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${t("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(E).map(i).join("")}
  </div>

  <div class="card">
    <h2>${t("Lugha za wageni","Guest languages")}</h2>
    ${a.usedDefaults?`<p class="small muted">${t("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${a.recommend.length?`
      <div class="notice small" style="margin-top:4px">${t(`Pakua ukiwa na Wi-Fi: ${a.recommend.map(o=>S[o].sw).join(", ")} (MB ${a.recommendMB}).`,`Download on Wi-Fi: ${a.recommend.map(o=>S[o].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${s.online?"":"disabled"}>${t("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${xe().map(n).join("")}
  </div>`}function wt(){const a=s.guests.some(e=>e.synthetic);return`
  ${L()}
  <h1>${t("Zaidi","More")}</h1>

  <div class="card">
    <h2>${t("Mwenyeji","Host")}</h2>
    <label class="field">${t("Jina lako (linaonekana kwa wageni na kwenye ujumbe)","Your name (shown to guests and in messages)")}
      <input type="text" id="host-name" value="${r(k())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${t("Hifadhi jina","Save name")}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${t("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?t("Herufi za kawaida","Normal text size"):t("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${t("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(k())}" target="_blank" rel="noopener">${t("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
    </div>
  </div>

  <div class="card">
    <h2>${t("Data ya mfano","Example data")}</h2>
    <p class="small muted">${t("Wageni 6 wa kubuni na maoni kwa lugha 5. Si watu halisi.","6 invented guests with feedback in 5 languages. Not real people.")}</p>
    ${a?`<button class="btn danger" data-action="remove-demo">${t("Ondoa data ya mfano","Remove example data")}</button>`:`<button class="btn secondary" data-action="load-demo">${t("Pakia data ya mfano","Load example data")}</button>`}
  </div>

  <div class="card">
    <h2>${t("Faragha","Privacy")}</h2>
    <ul class="small" style="padding-left:18px;margin:0">
      <li>${t("Data yote iko kwenye simu hii tu.","All data stays on this phone.")}</li>
      <li>${t("Mawasiliano ya mgeni yanahifadhiwa tu kwa ruhusa yake.","Guest contact details are kept only with their consent.")}</li>
      <li>${t("Ripoti kwa kampuni haina majina wala maneno ya wageni.","The company report has no names or quotes.")}</li>
    </ul>
    <button class="btn danger block" style="margin-top:12px" data-action="wipe">${t("Futa data zote","Delete all data")}</button>
  </div>

  <div class="card">
    <h2>${t("Kuhusu","About")}</h2>
    <p class="small">${t("Imejengwa kwa Hack-Nation × World Bank Small AI for Development (utalii).","Built for the Hack-Nation × World Bank Small AI for Development hackathon (tourism).")}</p>
    <div class="stack">
      <a class="btn secondary" href="eval.html">${t("Jaribio la usahihi","Accuracy check")}</a>
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${t("Msimbo, vyanzo vya data na mipaka","Code, data sources and limits")}</a>
    </div>
  </div>`}function ba(){var i;const a=o=>{var l,d;return((d=(l=document.getElementById(o))==null?void 0:l.value)==null?void 0:d.trim())||""},e=!!((i=document.getElementById("c-consent"))!=null&&i.checked),n=a("c-date");return{id:z("bk"),date:D(n||T(new Date,3)),guests:Math.max(1,Number(a("c-guests"))||1),leadName:a("c-name")||"Mgeni",language:a("c-lang")||"en",guide:a("c-guide"),company:"",consent:e,email:e?a("c-email"):""}}function yt(){const a=s.bookings.filter(i=>i.status==="requested").sort((i,o)=>new Date(i.date)-new Date(o.date)),e=s.bookings.filter(i=>i.status==="confirmed"&&i.source==="visitor").slice(-3);if(!a.length&&!e.length)return"";const n=i=>`
    <li>
      <div class="row between"><strong>${r(i.leadName)}</strong><span class="badge-num">${r(i.guests)}</span></div>
      <div class="row small" style="margin-top:6px">${r(P(i.date))} ${B(i.language)}${i.referredBy?`<span class="muted">${t("alipendekezwa na","recommended by")} ${r(i.referredBy)}</span>`:""}${i.consent&&i.email?`<span class="muted">${r(i.email)}</span>`:""}</div>
      ${i.status==="requested"?`<button class="btn small block" style="margin-top:8px" data-action="company-confirm" data-id="${i.id}">${t(`Thibitisha na tuma SMS kwa ${k()}`,`Confirm and send the SMS to ${k()}`)}</button>`:`<div class="sms small" style="margin-top:8px">${r(X(i))}</div><a class="btn small secondary block" style="margin-top:6px" href="sms:?body=${encodeURIComponent(X(i))}">${t("Fungua kwenye programu ya SMS","Open in the SMS app")}</a>`}
    </li>`;return`
  <div class="card">
    <h2>${t("Maombi mapya kutoka kwa wageni","New requests from visitors")}</h2>
    <p class="small muted">${t("Yametumwa kutoka ukurasa wa “Tafuta mahali”. Ukithibitisha, mwenyeji anapata SMS; haitaji intaneti.","Sent from the “Find a place” page. When you confirm, the host gets an SMS; no internet needed on her side.")}</p>
    <ul class="list">${[...a,...e].map(n).join("")}</ul>
  </div>`}function bt(){const a=Q(T(new Date,3)),{s:e}=ia(),n=e.entries?Ga(e,t("Mfano","Example"),k()):null;return(s.role==="company"?`<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${t("Badilisha upande","Switch side")}</button>`:L())+yt()+Je({langOptionsHTML:ja("en"),today:a,sms:X({date:D(a),guests:2,language:"en",guide:""}),report:n})}async function $t(){if(s.hosts)return s.hosts;try{const a=await fetch("data/hosts.json");s.hosts=(await a.json()).hosts}catch{s.hosts=[]}return s.hosts}const za=a=>(s.hosts||[]).find(e=>e.id===a);function Ma(){return s.hosts||$t().then(f),Ke({q:s.find.q,hosts:s.hosts||[],lang:$(),loading:!s.hosts})}function vt(){const a=za(s.book.hostId);if(!a)return s.screen="find",Ma();const e=a.id==="noor"?ia().s:null,n=Re(a,a.id==="noor"?s.availableDays:null),i=(s.book.form.referredBy||"").trim().toLowerCase(),o=i&&a.id==="noor"?s.guests.find(l=>(l.name||"").toLowerCase().split(" ")[0]===i.split(" ")[0]):null;return qe({host:a,days:n,selected:s.book.day,summaryLine:Ue(a,e,$()),form:s.book.form,lang:$(),knownGuest:o})}function xt(){const a=za(s.book.hostId);return!a||!s.book.done?(s.screen="find",Ma()):Fe({host:a,booking:s.book.done,lang:$()})}function Ia(){var e;const a=n=>{var i;return((i=document.getElementById(n))==null?void 0:i.value)||""};document.getElementById("bk-v-name")&&(s.book.form={guests:Number(a("bk-v-guests"))||2,language:a("bk-v-lang")||"en",name:a("bk-v-name"),email:a("bk-v-email"),consent:!!((e=document.getElementById("bk-v-consent"))!=null&&e.checked),referredBy:a("bk-v-ref")})}async function St(){Ia();const a=za(s.book.hostId),e=s.book.form;if(!s.book.day)return x(t("Chagua siku","Pick a day"));if(!e.name.trim())return x(t("Andika jina lako","Add your name"));const n={id:z("bk"),date:D(s.book.day),guests:Math.max(1,e.guests),leadName:e.name.trim(),language:e.language,guide:a.guide,company:a.company,consent:e.consent,email:e.consent?e.email.trim():"",referredBy:e.referredBy.trim(),hostId:a.id,status:"requested",source:"visitor",createdAt:new Date().toISOString()};await g.put("bookings",n),s.bookings.push(n),s.book.done=n,j("booked")}function jt(){const a=e=>{var n;return((n=document.getElementById(e))==null?void 0:n.value)||""};document.getElementById("v-liked")&&(s.visitor.draft={name:a("v-name"),liked:a("v-liked"),improve:a("v-improve"),email:a("v-email")})}async function zt(){var m,p,y;const a=w=>{var h,b;return((b=(h=document.getElementById(w))==null?void 0:h.value)==null?void 0:b.trim())||""},e=s.visitor.lang,n=Qa(e),i=a("v-liked"),o=a("v-improve");if(!i&&!o){x(n.needText);return}const l=!!((m=document.getElementById("v-consent"))!=null&&m.checked),d=[(p=document.getElementById("v-buy-coffee"))!=null&&p.checked?"coffee":null,(y=document.getElementById("v-buy-souvenir"))!=null&&y.checked?"souvenir":null].filter(Boolean),c={id:z("g"),name:a("v-name")||"Mgeni",language:e,visitDate:D(new Date),consent:l,contact:l?{email:a("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await g.put("guests",c);let u=!0;for(const[w,h]of[["liked",i],["improve",o]])h&&(await g.put("entries",{id:z("fb"),guestId:c.id,lang:e,source:"visitor",box:w,original:h,status:"pending",sentences:[],products:[],declaredProducts:u?d:[],visitDate:c.visitDate,createdAt:new Date().toISOString()}),u=!1);await R(),s.visitor={lang:e,saved:!0,draft:{}},f(),window.scrollTo(0,0)}let M=null;function Ba(){var a;if(M||(M=document.createElement("div"),M.className="guide-backdrop hidden",M.setAttribute("role","dialog"),M.setAttribute("aria-modal","true"),M.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(M)),M.classList.toggle("hidden",!s.guide.open),!s.guide.open){M.innerHTML="";return}M.innerHTML=Pe(s.guide.step),(a=M.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||a.focus()}function Y(a=0){s.guide={open:!0,step:a},Ba()}async function Ta(){s.guide.open=!1,Ba(),await g.setSetting("guideSeen",!0)}async function Mt(){await Ta();const a="demo_quick";if(!na(a)){const e={id:a,name:"Emma (mfano)",language:"en",visitDate:D(T(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await g.put("guests",e);const n={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const i of["liked","improve"])await g.put("entries",{id:`${a}_${i}`,guestId:a,lang:"en",source:"typed",box:i,original:n[i],status:"pending",sentences:[],products:[],visitDate:e.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await R()}s.period="all",s.screen="home",f(),await oe()}const It={choose:Ge,home:rt,add:ut,summary:gt,guests:ht,week:ct,langs:kt,more:wt,company:bt,find:Ma,host:vt,booked:xt,visitor:()=>Ve(s.visitor.lang,s.visitor.saved,s.visitor.draft)};function f(){const a=s.screen;document.body.classList.toggle("mode-visitor",a==="visitor"||a==="choose"),document.body.classList.toggle("mode-choose",a==="choose"),document.body.classList.toggle("home",a==="home"),ae.innerHTML=It[a](),document.getElementById("net").textContent=s.online?t("Mtandaoni","Online"):t("Nje ya mtandao","Offline");const e=document.getElementById("lang-btn");e&&(e.textContent=$()==="sw"?"English":"Kiswahili"),s.guide.open&&Ba(),a==="langs"&&fe().then(n=>{const i=document.getElementById("storage-line");i&&n&&(i.textContent=t(`Nafasi iliyotumika: MB ${n.usedMB} kati ya MB ${n.quotaMB}`,`Storage used: ${n.usedMB} MB of ${n.quotaMB} MB`))})}function j(a){s.screen=a,a!=="add"&&(s.add=W()),f(),window.scrollTo(0,0)}async function sa(a){if(!a.length)return!0;const e=a.reduce((i,[o,l])=>i+(o==="pack"?ua:E[l].mb),0);if(!navigator.onLine)return x(t("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const n=a.map(([i,o])=>i==="pack"?v(o,$()):E[o][$()]).join(", ");if(!confirm(t(`Pakua mara moja: takriban MB ${e} (${n}). Endelea?`,`One-time download of about ${e} MB (${n}). Continue?`)))return!1;for(const[i,o]of a)U(t("Inapakua","Downloading")+` · ${i==="pack"?v(o,$()):E[o][$()]}`),i==="pack"?await ke(o,K):await we(o,K);return N(),await ta(),!0}async function ha(a){const e=a.filter(n=>{var i;return((i=S[n])==null?void 0:i.mt)&&!s.installed.includes(n)}).map(n=>["pack",n]);await sa(e)&&(x(t("Lugha ziko tayari","Packs ready")),f())}async function Ha(a){if(!a.length)return;const e=a.map(n=>v(n,$())).join(", ");if(confirm(t(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${e}? They can be downloaded again later.`))){for(const n of a)await ye(S[n].mt);await ta(),x(t("Imefutwa","Deleted")),f()}}async function Bt(){if(!navigator.onLine)return x(t("Hakuna mtandao","Offline"));U(t("Inapokea ratiba","Receiving the schedule"));const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),n=new Date,i=e.bookings.map(l=>({id:l.id,date:D(T(n,l.dayOffset)),guests:l.guests,leadName:l.leadName,language:l.language,guide:l.guide,company:e.company,consent:!!l.consent,email:l.consent&&l.email||"",synthetic:!0}));await g.putMany("bookings",i),s.bookings=await g.all("bookings"),s.lastSync=new Date().toISOString(),await g.setSetting("lastSync",s.lastSync),N();const o=O();x(o.download.length?t(`Ratiba imepokelewa. Pakua: ${o.download.map(l=>S[l].sw).join(", ")}`,`Schedule received. Download: ${o.download.map(l=>S[l].en).join(", ")}`):t("Ratiba imepokelewa","Schedule received")),f()}async function Tt(){const a=o=>{var l,d;return((d=(l=document.getElementById(o))==null?void 0:l.value)==null?void 0:d.trim())||""},e=a("bk-date");if(!e)return x(t("Weka tarehe","Add a date"));const n=document.getElementById("bk-consent").checked,i={id:z("bk"),date:D(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:n,email:n?a("bk-email"):""};await g.put("bookings",i),s.bookings.push(i),x(t("Imehifadhiwa","Saved")),f()}async function Lt(a){const e=s.bookings.find(i=>i.id===a);if(!e)return;let n=s.guests.find(i=>i.bookingId===e.id);n||(n={id:z("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await g.put("guests",n),s.guests.push(n)),s.add=W(),s.add.guestId=n.id,s.add.step=2,f()}async function Dt(){const a=i=>{var o,l;return((l=(o=document.getElementById(i))==null?void 0:o.value)==null?void 0:l.trim())||""},e=document.getElementById("ng-consent").checked,n={id:z("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:D(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await g.put("guests",n),s.guests.push(n),s.add=W(),s.add.guestId=n.id,s.add.step=2,f(),window.scrollTo(0,0)}async function Ct(a,e){const n=q(),i={id:z("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};s.add.inputs.push(i),f();try{U(t("Inasoma picha","Reading the photo"));const o=await ge(a,n.language,K);Object.assign(i,{text:o.text,lowWords:o.lowWords,confidence:o.confidence,status:"ready"}),o.text||(i.status="error",i.error=t("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const l=await he(o.text);l&&l!==n.language&&(i.langHint=l)}catch(o){i.status="error",i.error=o.message}finally{N(),f()}}async function se(a){const e=q();if(!s.shared.voice&&!await sa([["shared","voice"]]))return;const n={id:z("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};s.add.inputs.push(n),f();try{U(t("Inasikiliza","Listening"));const i=await pe(a,e.language,K);Object.assign(n,{text:i.original,english:i.english,status:"ready"}),s.shared.voice=!0}catch(i){n.status="error",n.error=i.message}finally{N(),f()}}let da=null;async function At(){var i;if(da){da.stop();return}if(!((i=navigator.mediaDevices)!=null&&i.getUserMedia)||!window.MediaRecorder){x(t("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],n=new MediaRecorder(a);n.ondataavailable=o=>{o.data.size&&e.push(o.data)},n.onstop=()=>{a.getTracks().forEach(l=>l.stop()),da=null,s.recording=!1;const o=new Blob(e,{type:n.mimeType||"audio/webm"});f(),se(o).catch(l=>x(l.message))},n.start(),da=n,s.recording=!0,f()}async function Nt(){var o;const a=q(),e=s.add.inputs.filter(l=>l.status==="ready"&&(l.text||"").trim());if(!e.length)return;const n=[];if(a.language!=="sw"){s.shared.topics||n.push(["shared","topics"]),s.shared.mood||n.push(["shared","mood"]);const l=e.some(d=>!(d.source==="voice"&&d.english));(o=S[a.language])!=null&&o.mt&&l&&!s.installed.includes(a.language)&&n.push(["pack",a.language])}if(!await sa(n))return;const i=[];for(const[l,d]of e.entries()){U(`${t("Inachanganua","Analysing")} ${l+1}/${e.length}`);const c=d.source==="voice"&&a.language!=="en"&&a.language!=="sw"?d.english:void 0,u=await Va({original:d.text.trim(),lang:a.language,box:d.box,english:c},K),m={id:z("fb"),guestId:a.id,lang:a.language,source:d.source,box:d.box,original:d.text.trim(),...u,lowWords:d.lowWords||[],ocrConfidence:d.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await g.put("entries",m),s.entries.push(m),i.push(m.id)}N();for(const l of s.add.inputs)l.imageURL&&URL.revokeObjectURL(l.imageURL),l.audioURL&&URL.revokeObjectURL(l.audioURL);s.add.inputs=[],s.add.results=i,s.add.step=3,await ta(),f(),window.scrollTo(0,0)}async function oe(){var i;const a=s.entries.filter(o=>o.status==="pending"),e=[...new Set(a.map(o=>o.lang))],n=[];e.some(o=>o!=="sw")&&(s.shared.topics||n.push(["shared","topics"]),s.shared.mood||n.push(["shared","mood"]));for(const o of e)(i=S[o])!=null&&i.mt&&!s.installed.includes(o)&&n.push(["pack",o]);if(await sa(n)){for(const[o,l]of a.entries()){U(`${t("Inachanganua","Analysing")} ${o+1}/${a.length}`);const d=await Va({original:l.original,lang:l.lang,box:l.box},K);Object.assign(l,d),await g.put("entries",l)}N(),await ta(),x(t("Imekamilika","Done")),f()}}async function Z(a){await g.put("entries",a),f()}function $a(a){const e=s.entries.find(n=>n.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function Et(){const e=await(await fetch("data/demo.json")).json(),n=new Date;for(const i of e.guests){const o={id:i.id,name:i.name,language:i.language,visitDate:D(T(n,i.dayOffset)),consent:i.consent,contact:i.consent?{email:i.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await g.put("guests",o);for(const l of["liked","improve"])i[l]&&await g.put("entries",{id:`${i.id}_${l}`,guestId:i.id,lang:i.language,source:"typed",box:l,original:i[l],status:"pending",sentences:[],products:[],visitDate:o.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await R(),s.period="all",j("home"),x(t("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function Wt(){for(const a of s.guests.filter(e=>e.synthetic))await g.del("guests",a.id);for(const a of s.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await g.del("entries",a.id);for(const a of s.bookings.filter(e=>e.synthetic))await g.del("bookings",a.id);await R(),x(t("Imeondolewa","Removed")),f()}async function Ot(a){const e=na(a);if(!(!e||!confirm(t(`Futa ${e.name} na maoni yake yote?`,`Delete ${e.name} and all their feedback?`)))){await g.del("guests",a);for(const n of s.entries.filter(i=>i.guestId===a))await g.del("entries",n.id);for(const n of s.messages.filter(i=>i.guestId===a))await g.del("messages",n.id);await R(),f()}}async function Pt(){var e;if(!s.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await Ua(a)}async function Rt(){const{s:a,text:e}=ia(),n=$();n==="sw"&&await We(Ne(a))||me(e[n].join(" "),n)}async function Ht(a="home"){s.visitor={lang:Sa(),saved:!1,draft:{}},await g.setSetting("kiosk",a),j("visitor")}async function Kt(a){if(s.role=a,await g.setSetting("role",a),a==="visitor")return s.book={hostId:null,day:null,form:{},done:null},j("find");j(a==="company"?"company":"home"),a==="host"&&!await g.getSetting("guideSeen",!1)&&Y(0)}const Ut={"choose-role":a=>Kt(a.dataset.role),"open-host":a=>{s.book={hostId:a.dataset.id,day:null,form:{},done:null},j("host")},"book-day":a=>{Ia(),s.book.day=a.dataset.day,f()},"book-submit":St,"toggle-day":async a=>{const e=a.dataset.day;s.availableDays=s.availableDays.includes(e)?s.availableDays.filter(n=>n!==e):[...s.availableDays,e].sort(),await g.setSetting("availableDays",s.availableDays),f()},"company-confirm":async a=>{const e=s.bookings.find(n=>n.id===a.dataset.id);e&&(e.status="confirmed",await g.put("bookings",e),x(t(`Imethibitishwa. SMS kwa ${k()} iko tayari.`,`Confirmed. The SMS to ${k()} is ready.`)),f())},"switch-role":async()=>{s.role=null,await g.setSetting("role",null),j("choose")},back:()=>j("home"),go:a=>j(a.dataset.screen),"toggle-lang":async()=>{qa($()==="sw"?"en":"sw"),await g.setSetting("lang",$()),f()},"hand-to-guest":()=>Ht(s.screen==="find"?"choose":"home"),"visitor-lang":a=>{jt(),s.visitor.lang=a.dataset.lang,f()},"visitor-save":zt,"visitor-next":()=>{s.visitor={lang:Sa(),saved:!1,draft:{}},f(),window.scrollTo(0,0)},"visitor-exit":async()=>{const a=await g.getSetting("kiosk","home");a==="home"&&!confirm(t(`Kwa ${k()} tu: rudi nyumbani?`,`${k()} only: back to the home screen?`))||(await g.setSetting("kiosk",!1),j(a==="choose"?"find":"home"))},"company-sms":()=>{var n,i;const a=ba(),e=((i=(n=document.getElementById("c-phone"))==null?void 0:n.value)==null?void 0:i.trim())||"";if(!e){x(t(`Weka namba ya simu ya ${k()}`,`Add ${k()}’s phone number`));return}window.location.href=`sms:${encodeURIComponent(e)}?body=${encodeURIComponent(X(a))}`},"company-save":async()=>{const a=ba();await g.put("bookings",a),s.bookings.push(a),x(t("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const a=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",a),await g.setSetting("bigText",a),f()},"save-host":async()=>{var a;fa((a=document.getElementById("host-name"))==null?void 0:a.value),await g.setSetting("hostName",k()),x(t(`Jina: ${k()}`,`Name: ${k()}`)),f()},"guide-open":()=>Y(0),"guide-next":()=>Y(Math.min(s.guide.step+1,G.length-1)),"guide-prev":()=>Y(Math.max(s.guide.step-1,0)),"guide-close":Ta,"guide-try":Mt,sync:Bt,"add-booking":Tt,"download-pack":a=>ha([a.dataset.lang]),"download-suggested":()=>ha(O().download),"download-recommended":()=>ha(O().recommend),"delete-pack":a=>Ha([a.dataset.lang]),"delete-removable":()=>Ha(O().removable),"download-shared":async a=>{await sa([["shared",a.dataset.key]])&&f()},"pick-booking":a=>Lt(a.dataset.id),"pick-guest":a=>{s.add=W(),s.add.guestId=a.dataset.id,s.add.step=2,f(),window.scrollTo(0,0)},"save-new-guest":Dt,"change-guest":()=>{s.add.step=1,f()},"add-typed":()=>{s.add.inputs.push({id:z("in"),source:"typed",box:"liked",text:"",status:"ready"}),f()},record:At,"remove-input":a=>{s.add.inputs=s.add.inputs.filter(e=>e.id!==a.dataset.id),f()},"use-hint":async a=>{const e=q();e.language=a.dataset.lang,await g.put("guests",e),s.add.inputs.forEach(n=>{n.langHint=null}),x(`${t("Lugha","Language")}: ${v(e.language,$())}`),f()},"run-analysis":Nt,"finish-add":()=>j("summary"),"more-feedback":()=>{const a=s.add.guestId;s.add=W(),s.add.guestId=a,s.add.step=2,f(),window.scrollTo(0,0)},"fix-mood":async a=>{const[e,n]=$a(a);n&&(n.sentiment=a.dataset.mood,n.flags=(n.flags||[]).filter(i=>i==="topic-unsure"&&n.topic==="other"),n.confirmed=n.topic!=="other",await Z(e))},"confirm-sent":async a=>{const[e,n]=$a(a);n&&(n.confirmed=!0,n.flags=[],await Z(e))},"sw-mood":async a=>{var i;const e=s.entries.find(o=>o.id===a.dataset.entry);if(!e)return;const n=((i=e.sentences)==null?void 0:i[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};n.sentiment=a.dataset.mood,e.sentences=[n],await Z(e)},period:a=>{s.period=a.dataset.period,f()},speak:Rt,"analyze-pending":oe,share:Pt,"toggle-draft":a=>{s.openGuest=s.openGuest===a.dataset.id?null:a.dataset.id,f()},"mark-sent":async a=>{const e={id:z("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await g.put("messages",e),s.messages.push(e),setTimeout(f,400)},copy:a=>{var e;return Ua(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>Ot(a.dataset.id),"load-demo":Et,"remove-demo":Wt,wipe:async()=>{if(!confirm(t("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const a=$();await g.wipeAll(),await g.setSetting("lang",a),await R(),s.add=W(),fa("Noor"),x(t("Data yote imefutwa","All data deleted")),j("choose")}},qt={"company-preview":()=>{const a=document.getElementById("c-sms");a&&(a.textContent=X(ba()))},"company-consent":a=>{var e;return(e=document.getElementById("c-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=s.add.inputs.find(n=>n.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,n]=$a(a);n&&(n.topic=a.value,n.flags=(n.flags||[]).filter(i=>i!=="topic-unsure"),n.confirmed=n.topic!=="other"&&n.sentiment!=="unsure",await Z(e))},"sw-topic":async a=>{var i;const e=s.entries.find(o=>o.id===a.dataset.entry);if(!e||!a.value)return;const n=((i=e.sentences)==null?void 0:i[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};n.topic=a.value,e.sentences=[n],await Z(e)},"share-ok":a=>{s.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked)}};let ra=null;const Ft={"input-text":a=>{const e=s.add.inputs.find(n=>n.id===a.dataset.id);e&&(e.text=a.value),_t()},"input-english":a=>{const e=s.add.inputs.find(n=>n.id===a.dataset.id);e&&(e.english=a.value)},"find-q":a=>{s.find.q=a.value,clearTimeout(ra),ra=setTimeout(()=>{const e=a.selectionStart;f();const n=document.getElementById("find-q");n&&(n.focus(),n.setSelectionRange(e,e))},250)},"bk-v-ref":a=>{clearTimeout(ra),ra=setTimeout(()=>{Ia(),f();const e=document.getElementById("bk-v-ref");e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},400)}};function _t(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=s.add.inputs.some(i=>i.status==="ready"&&(i.text||"").trim()),n=s.add.inputs.some(i=>i.status==="working");a.disabled=!(e&&!n)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const n=Ut[e.dataset.action];n&&(e.tagName==="BUTTON"&&a.preventDefault(),Promise.resolve(n(e,a)).catch(i=>{console.error(i),N(),x(`${t("Hitilafu","Error")}: ${i.message}`,6e3)}))});document.addEventListener("change",a=>{var i;const e=a.target;if(e.matches("input[type=file][data-file]")){const o=(i=e.files)==null?void 0:i[0];if(e.value="",!o)return;const l=e.dataset.file;(l==="audio"?se(o):Ct(o,l==="photo-liked"?"liked":"improve")).catch(c=>{N(),x(c.message,6e3)});return}const n=qt[e.dataset.change];n&&Promise.resolve(n(e)).catch(o=>x(o.message,6e3))});document.addEventListener("input",a=>{var n;const e=Ft[(n=a.target.dataset)==null?void 0:n.input];e&&e(a.target)});document.addEventListener("keydown",a=>{a.key==="Escape"&&s.guide.open&&Ta()});window.addEventListener("online",()=>{s.online=!0,f()});window.addEventListener("offline",()=>{s.online=!1,f()});async function Gt(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),n=new Set([new URL("index.html",location.href).href]);for(const i of performance.getEntriesByType("resource"))n.add(i.name);await Promise.all([...n].map(async i=>{try{const o=new URL(i);if(o.pathname.endsWith("/data/bookings.json"))return;const l=o.origin===location.origin?a:o.hostname==="cdn.jsdelivr.net"?e:null;l&&!await l.match(i)&&await l.add(i)}catch{}}))}async function Vt(){const a=await g.getSetting("lang",null);return a||((navigator.languages||[navigator.language||"en"]).some(n=>String(n).toLowerCase().startsWith("sw"))?"sw":"en")}async function Jt(){qa(await Vt()),await R(),await g.getSetting("kiosk",!1)?(s.visitor={lang:Sa(),saved:!1,draft:{}},s.screen="visitor"):s.screen=s.role==="host"?"home":s.role==="company"?"company":s.role==="visitor"?"find":"choose",f(),s.screen==="home"&&!await g.getSetting("guideSeen",!1)&&Y(0),await ta(),f(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(Gt).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),xa().then(e=>{e&&navigator.onLine&&Oe()})}Jt().catch(a=>{console.error(a),ae.innerHTML=`<div class="notice neg"><strong>${t("Hitilafu","Error")}</strong>${r(a.message)}</div>`});
