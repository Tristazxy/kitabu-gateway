import{l as v,t as A,P as E,L as S,e as Ua,f as me,g as pe,i as Na,c as ge,a as he,j as fe,k as t,h as r,m as L,n as ea,o as w,b as N,d as x,q as va,r as Fa,u as Ga,v as $,w as D,s as F,x as Va,y as ke,p as U,z as we,A as ye,B as be,C as ka,S as O,D as $e,E as ve,F as xe,G as Se,H as je,I as ze,K as Wa,J as Me,N as Z,O as Ie}from"./ui-CMgT3-_c.js";const Be="kitabu",Te=1,Ja=["guests","entries","bookings","messages","settings"];let ua=null;function Le(){return ua||(ua=new Promise((a,e)=>{const n=indexedDB.open(Be,Te);n.onupgradeneeded=()=>{const i=n.result;for(const o of Ja)i.objectStoreNames.contains(o)||i.createObjectStore(o,{keyPath:o==="settings"?"key":"id"})},n.onsuccess=()=>a(n.result),n.onerror=()=>e(n.error)}),ua)}function K(a,e,n){return Le().then(i=>new Promise((o,l)=>{const d=i.transaction(a,e),c=d.objectStore(a);let u;Promise.resolve(n(c)).then(m=>{u=m}),d.oncomplete=()=>o(u),d.onerror=()=>l(d.error),d.onabort=()=>l(d.error)}))}function Oa(a){return new Promise((e,n)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>n(a.error)})}const f={async all(a){return K(a,"readonly",e=>Oa(e.getAll()))},async get(a,e){return K(a,"readonly",n=>Oa(n.get(e)))},async put(a,e){return await K(a,"readwrite",n=>{n.put(e)}),e},async putMany(a,e){await K(a,"readwrite",n=>{for(const i of e)n.put(i)})},async del(a,e){await K(a,"readwrite",n=>{n.delete(e)})},async clear(a){await K(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const n=await this.get("settings",a);return n?n.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of Ja)await this.clear(a)}};function z(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const Ce=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],De=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function wa(a){const e=new Date(a);return`${Ce[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Ya(a){const e=new Date(a);return`${De[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Ae(a){if(!a.length)return"WeKaribu: Hakuna wageni waliopangwa wiki ijayo.";const e=a.reduce((i,o)=>i+(Number(o.guests)||1),0),n=a.slice().sort((i,o)=>new Date(i.date)-new Date(o.date)).map(i=>`${wa(i.date)}: wageni ${i.guests} (${v(i.language,"sw")})${i.guide?`, mwongozaji ${i.guide}`:""}`);return`WeKaribu: Wiki ijayo wageni ${e}.
${n.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function Ia(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function ta(a){return`WeKaribu: Wageni wapya. ${wa(a.date)}: wageni ${a.guests} (${v(a.language,"sw")})${a.guide?`, mwongozaji ${a.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const J=a=>`${a} ${a===1?"guest":"guests"}`,Pa=a=>`${a} ${a===1?"entry":"entries"}`;function Ee(a,e="Noor"){const n=[],i=[];if(n.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),i.push(`This period: ${J(a.guests)}, ${Pa(a.entries)}.`),a.guests===0)return n.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),i.push("No feedback yet. Add guest feedback first."),{sw:n,en:i};a.guests<5&&(n.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),i.push(`Caution: still little feedback (${J(a.guests)}). Too early for big decisions.`));const l=a.liked.filter(u=>u.id!=="other").slice(0,3);l.length&&(n.push("Walichopenda zaidi: "+l.map(u=>`${A(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),i.push("What they liked most: "+l.map(u=>`${A(u.id).en.toLowerCase()} (${J(u.guests)})`).join("; ")+"."));const d=a.improve.filter(u=>u.id!=="other").slice(0,3);d.length?(n.push("Wanachotaka kiboreshwe: "+d.map(u=>`${A(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),i.push("What they want improved: "+d.map(u=>`${A(u.id).en.toLowerCase()} (${J(u.guests)})`).join("; ")+".")):(n.push("Hakuna malalamiko yaliyotajwa."),i.push("No complaints were mentioned.")),a.products.length&&(n.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(u=>`${E.find(m=>m.id===u.id).sw} (wageni ${u.guests})`).join("; ")+"."),i.push("Products guests wanted to buy: "+a.products.map(u=>`${E.find(m=>m.id===u.id).en} (${J(u.guests)})`).join("; ")+"."));const c=Ia(a);if(c){const u=E.find(m=>m.id===c.id);n.push(`Wazo: wageni ${c.guests} kati ya ${a.guests} walitaka ${u.sw}. Unaweza kufikiria kuuza ${u.sw}. Uamuzi ni wako.`),i.push(`Idea: ${c.guests} of ${a.guests} guests wanted ${u.en}. You could consider selling ${u.en}. The decision is yours.`)}return a.unsure>0&&(n.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),i.push(`${a.unsure} ${a.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${a.unsure===1?"it":"them"} with your helper or the guide.`)),a.swahiliEntries>0&&(n.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),i.push(`${Pa(a.swahiliEntries)} in Swahili — ${e} reads ${a.swahiliEntries===1?"it":"them"} directly.`)),{sw:n,en:i}}const ba={sw:{liked:(a,e,n)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${n}`,plain:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${e}`},en:{liked:(a,e,n)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — ${n}`,plain:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${e}`},it:{liked:(a,e,n)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${n}`,plain:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${e}`},fr:{liked:(a,e,n)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${n}`,plain:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${e}`},de:{liked:(a,e,n)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${n}`,plain:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${e}`},zh:{liked:(a,e,n)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${n}`,plain:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${e}`},es:{liked:(a,e,n)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${n}`,plain:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${e}`},pl:{liked:(a,e,n)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${n}`,plain:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${e}`}};function Ra(a,e,n="Noor"){const i=ba[a.language]?a.language:"en",o=i!==a.language,l=(a.name||"").trim()||(i==="zh"?"":"friend"),d=e?Ua.find(u=>u.id===e):null,c=u=>d?ba[u].liked(l,d.msg[u]||d.msg.en,n):ba[u].plain(l,n);return{lang:i,text:c(i),sw:c("sw"),usedFallback:o}}const Ha={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function Za(a,e,n="Noor"){const i=[];i.push(`Ripoti ya maoni — ${e}`),i.push(`Feedback report — ${e}`),i.push(""),i.push(`Wageni / Guests: ${a.guests}`);const o=Object.entries(a.languages).map(([d,c])=>`${S[d]?S[d].en:d} ${c}`).join(", ");o&&i.push(`Lugha / Languages: ${o}`),i.push(""),i.push("Walichopenda / Liked:");for(const d of a.liked.filter(c=>c.id!=="other").slice(0,5))i.push(`  • ${A(d.id).en}: ${d.guests}`);i.push("Kuboresha / To improve:");const l=a.improve.filter(d=>d.id!=="other").slice(0,5);l.length||i.push("  • —");for(const d of l)i.push(`  • ${A(d.id).en}: ${d.guests}`);if(a.products.length){i.push("Bidhaa / Product interest:");for(const d of a.products)i.push(`  • ${E.find(c=>c.id===d.id).en}: ${d.guests}`)}return i.push(""),i.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),i.push(`Imeidhinishwa na ${n} kabla ya kutumwa. / Approved by ${n} before sharing.`),i.join(`
`)}function ia(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function Ne(a,e,n=new Date){if(e==="all")return!0;const i=new Date(a),o=e==="week"?7:e==="month"?31:3650;return n-i<=o*24*3600*1e3&&i-n<=24*3600*1e3}function We(a,e){const n=Object.fromEntries(e.map(p=>[p.id,p])),i=new Set,o={},l={},d={},c={};let u=0,m=0;const y=(p,h,b,M)=>{p[h]||(p[h]={id:h,guestIds:new Set,quotes:[]}),p[h].guestIds.add(b),M&&p[h].quotes.push(M)};for(const p of a){i.add(p.guestId),p.lang==="sw"&&m++;for(const h of p.sentences||[]){const b=ia(h);b&&u++;const M={entryId:p.id,en:h.en,original:h.original||null,lang:p.lang,flagged:b};h.sentiment==="pos"?y(l,h.topic,p.guestId,M):h.sentiment==="neg"&&y(d,h.topic,p.guestId,M)}for(const h of new Set([...p.products||[],...p.declaredProducts||[]]))y(c,h,p.guestId,null)}for(const p of i){const h=n[p],b=h?h.language:"unknown";o[b]=(o[b]||0)+1}const g=p=>Object.values(p).map(h=>({id:h.id,guests:h.guestIds.size,quotes:h.quotes})).sort((h,b)=>b.guests-h.guests);return{guests:i.size,entries:a.length,liked:g(l),improve:g(d),products:g(c),unsure:u,swahiliEntries:m,languages:o}}function Oe(a,e){const n={};for(const o of a.filter(l=>l.guestId===e))for(const l of o.sentences||[])l.sentiment==="pos"&&l.topic!=="other"&&(n[l.topic]=(n[l.topic]||0)+1);const i=Object.entries(n).sort((o,l)=>l[1]-o[1])[0];return i?i[0]:null}async function Qa(a,e){const{original:n,lang:i,box:o}=a;if(i==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let l;a.english?l=[{original:null,en:a.english}]:l=(await me(n,i,e)).pairs;const d=[];for(const p of l)for(const h of pe(p.en))d.push({en:h,original:p.original});const c=l.map(p=>p.en).join(" ").trim();if(!d.length)return{english:c,sentences:[],products:Na(c),status:"analyzed"};const u=d.map(p=>p.en),m=await ge(u,e),y=await he(u,e),g=d.map((p,h)=>{var V,ra,ca;const b=fe(o,y[h]),M=[...b.flags];return m[h].topic==="other"&&M.push("topic-unsure"),(V=S[i])!=null&&V.fallback&&!a.english&&M.push("fallback-pack"),{en:p.en,original:p.original,topic:m[h].topic,topicScore:m[h].score,runnerUp:m[h].runnerUp,sentiment:b.sentiment,moodScore:((ra=y[h])==null?void 0:ra.score)??null,modelMood:((ca=y[h])==null?void 0:ca.label)??null,flags:M,confirmed:!1}});return{english:c,sentences:g,products:Na(c),status:"analyzed"}}let Y;async function Ba(){if(Y!==void 0)return Y;try{const a=await fetch("audio/sw/manifest.json");Y=a.ok?await a.json():null}catch{Y=null}return Y}const ma=a=>a>=1&&a<=20?`g_${a}`:"g_more";function Pe(a){if(!a.guests)return["no_feedback"];const e=["period",ma(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const n=a.liked.filter(l=>l.id!=="other").slice(0,3);if(n.length){e.push("liked_intro");for(const l of n)e.push(`t_${l.id}`,ma(l.guests))}const i=a.improve.filter(l=>l.id!=="other").slice(0,3);if(i.length){e.push("improve_intro");for(const l of i)e.push(`t_${l.id}`,ma(l.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const l of a.products)e.push(`p_${l.id}`,ma(l.guests))}const o=Ia(a);return o&&e.push("idea_intro",`p_${o.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let xa=0,Q=null;function Re(){xa++,Q&&(Q.pause(),Q=null)}async function Xa(a){const e=await Ba();if(!e||!a.every(i=>e.files[i]))return!1;Re();const n=++xa;for(const i of a){if(n!==xa)break;await new Promise(o=>{const l=new Audio(`audio/sw/${e.files[i]}`);Q=l,l.onended=o,l.onerror=o,l.play().catch(o)})}return Q=null,!0}async function He(){const a=await Ba();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}async function _e(a,e,n,i){n==="sw"&&await Xa([a])||i(e,n)}const ha={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'},W=[{icon:ha.book,title:()=>t("Karibu","Welcome"),body:()=>[t("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),t("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:ha.steps,target:'[data-action="go"][data-screen="add"]',title:()=>t("Hatua tatu","Three steps"),list:()=>[t("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),t("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),t("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[t("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:ha.play,target:'[data-action="guide-try"], [data-action="speak"]',title:()=>t("Jaribu sasa","Try it now"),body:()=>[t("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function Ke(a){const e=W[a],n=a===W.length-1,i=W.map((c,u)=>`<span class="${u===a?"on":""}"></span>`).join(""),o=e.list?`<ol class="guide-list">${e.list().map(c=>`<li>${c}</li>`).join("")}</ol>`:"",l=e.body().map(c=>`<p class="lead">${c}</p>`).join(""),d=e.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${t("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${t("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${a+1} / ${W.length}">${i}</div>
      <button class="guide-close" data-action="guide-close">${t("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${e.icon}</div>
    <h2 id="guide-title">${e.title()} <button class="say" data-action="say" data-clip="${["ui_who","ui_add","ui_summary"][a]||"ui_help"}" data-sw="${[...e.list?e.list():[],...e.body()].join(" ").replace(/"/g,"&quot;")}" data-en="${[...e.list?e.list():[],...e.body()].join(" ").replace(/"/g,"&quot;")}" aria-label="Sikiliza">${ha.speaker}</button></h2>
    ${o}
    ${l}
    ${d}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${a===0?"disabled":""}>${t("Rudi","Back")}</button>
      ${n?"":`<button class="btn" data-action="guide-next">${t("Endelea","Next")}</button>`}
    </div>
  </div>`}const fa=(a,e)=>e==="sw"?wa(a):Ya(a);function qe(a,e,n=new Date){return e&&e.length?e.filter(i=>new Date(i)>=L(n,-1)).sort():(a.availableOffsets||[]).map(i=>ea(L(n,i)))}const Ue='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',ae='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';function Fe({q:a,hosts:e,lang:n,loading:i}){const o=(a||"").trim().toLowerCase(),l=o?e.filter(c=>[c.name,c.town,...c.tags||[]].join(" ").toLowerCase().includes(o)):e,d=c=>`
    <button class="home-btn" data-action="open-host" data-id="${c.id}">
      <span class="role-icon tile-leaf" aria-hidden="true">${ae}</span>
      <span class="role-text"><strong>${r(c.name)}</strong>
        <span class="small muted">${r(c.town)} · ${(c.tags||[]).slice(0,3).map(r).join(" · ")}</span>
        <span class="small">${t("Lugha","Languages")}: ${c.languages.map(u=>r(v(u,n))).join(", ")}</span></span>
    </button>`;return`
  <h1>${t("Tafuta mahali pa kutembelea","Find a place to visit")}</h1>
  <p class="small muted">${t("Wenyeji wadogo ambao hawana tovuti wala intaneti. Rafiki akikuambia jina la kijiji, tafuta hapa.","Small hosts with no website and no internet. If a friend told you the name of a village, search for it here.")}</p>
  <label class="field search">${Ue}<input type="search" id="find-q" value="${r(a||"")}" placeholder="${t("Kijiji, jina au shughuli… k.m. Materuni","Village, name or activity… e.g. Materuni")}" autocomplete="off" data-input="find-q"></label>
  ${i?`<p class="muted">${t("Inapakia…","Loading…")}</p>`:""}
  <div class="stack" style="margin-top:12px">
    ${l.length?l.map(d).join(""):`<div class="notice">${t("Hakuna matokeo. Jaribu jina la kijiji.","No results. Try the name of the village.")}</div>`}
  </div>
  <p class="small muted" style="margin-top:14px">${t("Orodha ya mfano (data bandia). Toleo halisi linapata orodha kutoka kwa kampuni ya utalii au ofisi ya utalii.","Example directory (synthetic). The real version gets the list from the tour company or the tourism office.")}</p>
  <div class="row home-links">
    <button class="link-btn" data-action="hand-to-guest">${t("Umeshatembelea? Andika maoni","Already visited? Leave feedback")}</button>
    <button class="link-btn" data-action="switch-role">${t("Badilisha upande","Switch side")}</button>
  </div>`}function Ge(a,e,n){const i=d=>A(d)[n].split(" (")[0].toLowerCase(),o=e&&e.guests?{guests:e.guests,liked:e.liked.filter(d=>d.id!=="other").slice(0,3).map(d=>d.id),improve:e.improve.filter(d=>d.id!=="other").slice(0,2).map(d=>d.id),products:e.products.map(d=>d.id)}:a.sample;if(!o||!o.guests)return t("Bado hakuna maoni.","No feedback yet.");const l=[t(`Wageni ${o.guests} wametoa maoni.`,`${o.guests} guests left feedback.`)];if(o.liked.length&&l.push(t(`Walipenda: ${o.liked.map(i).join(", ")}.`,`Loved: ${o.liked.map(i).join(", ")}.`)),o.improve.length&&l.push(t(`Kuboresha: ${o.improve.map(i).join(", ")}.`,`To improve: ${o.improve.map(i).join(", ")}.`)),o.products.length){const d=o.products.map(c=>(E.find(u=>u.id===c)||{})[n]||c);l.push(t(`Bidhaa zinazopatikana: ${d.join(", ")}.`,`For sale: ${d.join(", ")}.`))}return l.join(" ")}function Ve({host:a,days:e,selected:n,summaryLine:i,form:o,lang:l,knownGuest:d}){const c={guests:2,language:"en",name:"",email:"",consent:!1,referredBy:"",...o},u=e.length?e.map(y=>`<button class="chip" data-action="book-day" data-day="${y}" aria-pressed="${y===n}">${r(fa(y+"T12:00:00",l))}</button>`).join(""):`<span class="muted">${t("Hakuna siku zilizotangazwa bado. Uliza kampuni ya utalii.","No days published yet. Ask the tour company.")}</span>`,m=Object.entries(S).filter(([y])=>y!=="xx"||!0).map(([y,g])=>`<option value="${y}" ${y===c.language?"selected":""}>${r(g[l])}${g.native!==g[l]?` (${r(g.native)})`:""}</option>`).join("");return`
  <button class="btn small secondary" data-action="go" data-screen="find" style="margin-bottom:12px">← ${t("Orodha","Places")}</button>
  <div class="card hero-card">
    <div class="hero-art" aria-hidden="true">${ee}</div>
    <h1 style="margin-top:10px">${r(a.name)}</h1>
    <p class="small muted" style="margin-top:-4px">${r(a.town)} · ${(a.tags||[]).map(r).join(" · ")}</p>
    <p>${r(a.blurb)}</p>
    <div class="row small">
      <span class="chip plain">${t("Lugha","Languages")}: ${a.languages.map(y=>r(v(y,l))).join(", ")}</span>
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
      ${d?`<div class="notice small">${t(`${r(d.name)} alitembelea hapa (${r(fa(d.visitDate,l))}). Mwenyeji atafurahi kujua.`,`${r(d.name)} visited here (${r(fa(d.visitDate,l))}). The host will be glad to know.`)}</div>`:""}
      <label class="field">${t("Barua pepe (hiari)","Email (optional)")}<input type="email" id="bk-v-email" value="${r(c.email)}" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-v-consent" ${c.consent?"checked":""}> <span>${t("Mwenyeji anaweza kuhifadhi barua pepe yangu na kuniandikia baada ya ziara.","The host may keep my email and write to me after the visit.")}</span></label>
      <button class="btn block" data-action="book-submit" ${n?"":"disabled"}>${t("Tuma ombi","Send the request")}</button>
      <p class="small muted" style="margin:0">${t("Hakuna malipo hapa. Kampuni ya utalii inathibitisha kwa barua pepe au WhatsApp.","No payment here. The tour company confirms by email or WhatsApp.")}</p>
    </div>
  </div>`}function Je({host:a,booking:e,lang:n}){return`
  <div class="card" style="text-align:center;padding:28px 18px">
    <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${ae}</div>
    <h1>${t("Ombi limetumwa","Request sent")}</h1>
    <p class="lead">${t(`${r(a.company)} itathibitisha. ${r(a.name.split("’")[0])} atapata SMS kwenye simu yake.`,`${r(a.company)} will confirm. The host gets an SMS on a basic phone.`)}</p>
    <div class="card flat" style="text-align:left">
      <div class="small muted">${t("Ombi lako","Your request")}</div>
      <p style="margin:6px 0 0"><strong>${r(a.name)}</strong> · ${r(fa(e.date,n))} · ${t("wageni","guests")} ${r(e.guests)} · ${r(v(e.language,n))}</p>
      ${e.referredBy?`<p class="small muted" style="margin:4px 0 0">${t("Alipendekezwa na","Recommended by")}: ${r(e.referredBy)}</p>`:""}
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="btn block" data-action="go" data-screen="find">${t("Tafuta mahali pengine","Find another place")}</button>
      <button class="btn secondary block" data-action="switch-role">${t("Maliza","Done")}</button>
    </div>
  </div>`}const ee=`<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
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
</svg>`,te=["en","it","fr","de","zh","es","pl","sw","xx"],_a={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function ne(a){const e=_a[a]||{..._a.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},n={};for(const[i,o]of Object.entries(e))n[i]=o.replace(/\{host\}/g,w());return n}function Ta(){for(const a of navigator.languages||[navigator.language||"en"]){const e=String(a).slice(0,2).toLowerCase();if(te.includes(e))return e}return"en"}const ie={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'},Ye=ie.visitor;function Ze(){const a={host:"tile-caramel",visitor:"tile-leaf",company:"tile-sky"},e='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',n={host:"ui_host",visitor:"ui_visitor",company:"ui_company"},i=(o,l,d)=>`
    <div class="home-row">
    <button class="home-btn" data-action="choose-role" data-role="${o}">
      <span class="role-icon ${a[o]}" aria-hidden="true">${ie[o]}</span>
      <span class="role-text"><strong>${l}</strong><span class="small muted">${d}</span></span>
    </button><button class="say" data-action="say" data-clip="${n[o]}" data-sw="${r(l+". "+d)}" data-en="${r(l+". "+d)}" aria-label="Sikiliza">${e}</button></div>`;return`
  <div class="hero" aria-hidden="true">${ee}
    <div class="hero-text"><h1>${t("Karibu!","Welcome!")}</h1><p>${t("Wageni wanaandika kwa lugha yao. Mwenyeji anasikia kwa lugha yake.","Guests write in their language. The host hears it in hers.")}</p></div>
  </div>
  <h2>${t("Wewe ni nani?","Who are you?")} <button class="say" data-action="say" data-clip="ui_who" data-sw="Karibu! Wewe ni nani? Chagua: mwenyeji, mgeni, au kampuni ya utalii." data-en="Welcome! Who are you? Choose: host, visitor, or tour company." aria-label="Sikiliza"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg></button></h2>
  <div class="stack" style="margin-top:12px">
    ${i("host",t("Mwenyeji","Host"),t("Ongeza maoni, sikiliza muhtasari, washukuru wageni.","Add feedback, hear the summary, thank guests."))}
    ${i("visitor",t("Mgeni","Visitor"),t("Tafuta mahali, weka nafasi, andika maoni kwa lugha yako.","Find a place, book a visit, leave feedback in your language."))}
    ${i("company",t("Kampuni ya utalii au mwongozaji","Tour company or guide"),t("Tuma ratiba ya wageni kwa SMS.","Send guest bookings by SMS."))}
  </div>
  <p class="small muted" style="margin-top:14px">${t("Unaweza kubadilisha baadaye.","You can switch later.")}</p>`}function Qe(a,e,n={}){const i=ne(a),o={name:"",liked:"",improve:"",email:"",...n},l=te.map(d=>`<button class="chip" data-action="visitor-lang" data-lang="${d}" aria-pressed="${d===a}">${r(S[d].native)}</button>`).join("");return e?`
    <div class="card" lang="${a}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Ye}</div>
      <h1>${r(i.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${r(i.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${r(i.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${t(`Kwa ${w()} tu: rudi`,`${w()} only: back`)}</button>`:`
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
  <button class="btn small secondary" data-action="visitor-exit">${t(`Kwa ${w()} tu: rudi`,`${w()} only: back`)}</button>`}function Xe({langOptionsHTML:a,today:e,sms:n,report:i}){return`
  <h1>${t("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${t(`Tuma ratiba ya wageni kwa ${w()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${w()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${t(`Namba ya simu ya ${w()}`,`${w()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${t("Tarehe","Date")}<input type="date" id="c-date" value="${e}" data-change="company-preview"></label>
        <label class="field">${t("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${t("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${a}</select></label>
      <label class="field">${t("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${t("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${t(`Mgeni amekubali ${w()} awasiliane naye`,`The guest agreed that ${w()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${t("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${t(`SMS ambayo ${w()} atapokea`,`The SMS ${w()} will get`)}</h2>
    <div class="sms" id="c-sms">${r(n)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${t(`Tuma SMS kwa ${w()}`,`Send SMS to ${w()}`)}</button>
      <button class="btn secondary" data-action="company-save">${t("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${t(`Unachopokea kutoka kwa ${w()}`,`What you get back from ${w()}`)}</h2>
    <p class="small">${t("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.")}</p>
    ${i?`<div class="sms">${r(i)}</div>`:""}
  </div>`}const se=document.getElementById("view"),P=()=>({step:1,guestId:null,inputs:[],results:[]}),s={screen:"home",role:null,guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:P(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}},hosts:null,find:{q:""},book:{hostId:null,day:null,form:{},done:null},availableDays:[]};async function _(){const[a,e,n,i]=await Promise.all(["guests","entries","bookings","messages"].map(o=>f.all(o)));Object.assign(s,{guests:a,entries:e,bookings:n,messages:i}),s.lastSync=await f.getSetting("lastSync"),s.role=await f.getSetting("role",null),s.availableDays=await f.getSetting("availableDays",[]),va(await f.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await f.getSetting("bigText",!1))}async function sa(){try{s.installed=await je();for(const a of Object.keys(O))s.shared[a]=await ze(O[a].id)}catch(a){console.warn("model check failed",a)}}const oa=a=>s.guests.find(e=>e.id===a),G=()=>oa(s.add.guestId);function R(){return Se({guests:s.guests,bookings:s.bookings,installed:s.installed,today:new Date})}function la(){const a=s.entries.filter(n=>n.status!=="pending"&&Ne(n.visitDate||n.createdAt,s.period)),e=We(a,s.guests);return{s:e,entries:a,text:Ee(e,w())}}const H=a=>$()==="sw"?wa(a):Ya(a),na=a=>A(a)[$()].split(" (")[0],T=a=>{var e;return`<span class="chip plain lang-pill" title="${r(((e=S[a])==null?void 0:e.native)||a)}">${r(v(a,$()))}</span>`};function at(a){return a==="pos"?`<span class="chip">${q.pos} ${t("Nzuri","Positive")}</span>`:a==="neg"?`<span class="chip neg">${q.neg} ${t("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${q.unsure} ${t("Haijulikani","Unsure")}</span>`}function et(a){return a.consent?`<span class="chip">${t("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${t("Hakuna ruhusa","No consent")}</span>`}function tt(a){var e;return(e=S[a])!=null&&e.mt?s.installed.includes(a)?`<span class="chip">${t("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${t("Pakua lugha","Pack needed")}</span>`:""}const oe={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},nt=a=>oe[a][$()==="sw"?0:1];function La(a){const e=$();return Object.entries(S).map(([n,i])=>`<option value="${n}" ${n===a?"selected":""}>${r(i[e])}${i.native!==i[e]?` (${r(i.native)})`:""}</option>`).join("")}function le(a){return[...Ua,Ie].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${r(e[$()])}</option>`).join("")}const C=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${t("Nyumbani","Home")}</button>`,it='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Ka=(a,e,n)=>`<button class="say" data-action="say" data-clip="${a}" data-sw="${r(e)}" data-en="${r(n)}" aria-label="${t("Sikiliza","Listen")}">${it}</button>`,q={pos:"😊",neg:"😟",unsure:"🤔"};function de(a,e,{open:n=!1}={}){const i=a.sentences[e],o=ia(i),l=(i.flags||[]).filter(c=>oe[c]),d=i.original&&a.lang!=="en";return`
  <div class="sent">
    ${d?`<div class="orig" lang="${r(a.lang)}">“${r(i.original)}”</div>`:""}
    ${i.en?`<div class="${d?"small muted":""}">${d?"EN: ":""}${r(i.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${i.topic==="other"?"warn":""}">${r(na(i.topic))}</span>
      ${at(i.sentiment)}
      ${o?`<span class="chip warn">${t("Angalia","Check")}</span>`:i.confirmed?`<span class="chip plain">${t("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${o&&l.length?`<div class="small muted" style="margin-top:4px">${l.map(nt).join("; ")}</div>`:""}
    <details ${n||o?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${t("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${t("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${le(i.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${i.sentiment==="pos"}">${t("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${i.sentiment==="neg"}">${t("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${t("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function st(a){var n;const e=(n=a.sentences)==null?void 0:n[0];return`
  <div class="sent">
    <div lang="sw">“${r(a.original)}”</div>
    <div class="small muted">${t(`Kiswahili: ${w()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${w()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${t("Mada","Topic")} —</option>${le(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${t("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${t("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function ot(a){var l;const e=oa(a.guestId),n=a.box==="liked"?t("Walipenda","Liked"):a.box==="improve"?t("Kuboresha","Could be better"):t("Maoni","Feedback"),i=a.source==="photo"?t("Picha","Photo"):a.source==="voice"?t("Sauti","Voice"):t("Imeandikwa","Typed");let o;return a.status==="pending"?o=`<p class="muted">${t("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${r(a.lang)}">“${r(a.original)}”</p>`:a.status==="swahili"?o=st(a):(l=a.sentences)!=null&&l.length?o=a.sentences.map((d,c)=>de(a,c)).join(""):o=`<p lang="${r(a.lang)}">“${r(a.original)}”</p><p class="small muted">${t("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${r((e==null?void 0:e.name)||"Mgeni")}</strong> ${T(a.lang)}</div>
      <div class="small muted">${i} · ${n}</div>
    </div>
    ${o}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${t("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const Sa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',lt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',dt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',rt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',ct='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',ut='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',mt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function pt(a){const e=d=>d.filter(c=>c.id!=="other").slice(0,3).map(c=>na(c.id).toLowerCase()).join(", "),n=e(a.liked),i=e(a.improve),o=[t(`Wageni ${a.guests}.`,`${a.guests} ${a.guests===1?"guest":"guests"}.`)];n&&o.push(t(`Walipenda: ${n}.`,`Loved: ${n}.`)),o.push(i?t(`Kuboresha: ${i}.`,`To improve: ${i}.`):t("Hakuna malalamiko.","No complaints."));const l=Ia(a);return l&&o.push(t(`Wengi wanataka kununua: ${E.find(d=>d.id===l.id).sw}.`,`Many want to buy: ${E.find(d=>d.id===l.id).en}.`)),o.join(" ")}function gt(){const a=s.entries.filter(g=>g.status==="pending"),{s:e}=la(),n=s.guests.filter(g=>g.consent&&!s.messages.some(p=>p.guestId===g.id&&p.status==="sent")).length,i=s.bookings.filter(g=>{const p=Z(g.date);return p>=0&&p<=7}),o=R(),l=s.entries.reduce((g,p)=>g+(p.sentences||[]).filter(ia).length,0),d=a.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${t(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} new ${a.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${t("Changanua sasa","Analyse now")}</button>
    </div>`:"",c=e.entries?(()=>{let g=0,p=0;for(const h of s.entries)for(const b of h.sentences||[])b.sentiment==="pos"?g++:b.sentiment==="neg"&&p++;return`<div class="faces"><span>${q.pos} <b>${g}</b></span><span>${q.neg} <b>${p}</b></span>${l?`<span>${q.unsure} <b>${l}</b></span>`:""}</div>`})():"",u=e.entries?`
    <div class="card accent">
      <div class="card-title"><h2>${t("Wageni walisema","What guests said")} ${Ka("ui_summary","Wageni walisema. Bonyeza Sikiliza kusikia muhtasari.","What guests said. Tap Listen to hear the summary.")}</h2><span class="small muted">${ja[s.period]()}</span></div>
      ${c}
      <p class="big-summary" style="margin:0">${r(pt(e))}</p>
      ${l?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${t(`Sentensi ${l} zinahitaji kuangaliwa.`,`${l} ${l===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${d}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${dt}${t("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${t("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${t("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${t("Bado hakuna maoni.","No feedback yet.")}</p>
      ${d}
      ${a.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${t("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,m=(g,p,h,b,M="",V="",ra="",ca="")=>`
    <div class="home-row">
    <button class="home-btn" ${g}>
      <span class="role-icon ${M}" aria-hidden="true">${p}</span>
      <span class="role-text"><strong>${h}</strong><span class="small muted">${b}</span></span>
    </button>${V?Ka(V,ra,ca):""}</div>`,y=i.length?t(`Wageni ${i.reduce((g,p)=>g+(Number(p.guests)||1),0)} siku 7 zijazo`,`${i.reduce((g,p)=>g+(Number(p.guests)||1),0)} guests in the next 7 days`)+(o.download.length?` · ${t("pakua","download")} ${o.download.map(g=>v(g,$())).join(", ")}`:""):t("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${u}
  <div class="stack">
    ${m('data-action="go" data-screen="add"',Sa,t("Ongeza maoni ya mgeni","Add guest feedback"),t("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"),"tile-caramel","ui_add","Ongeza maoni ya mgeni. Piga picha ya kitabu, rekodi sauti, au andika.","Add guest feedback: photograph the guestbook, record a voice note, or type.")}
    ${m('data-action="hand-to-guest"',ct,t("Mpe mgeni simu aandike","Let a guest write"),t("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"),"tile-leaf","ui_hand","Mpe mgeni simu aandike maoni kwa lugha yake.","Hand the phone to a guest to write in their own language.")}
    ${m('data-action="go" data-screen="guests"',rt,t("Washukuru wageni","Thank guests"),n?t(`Wageni ${n} wanasubiri`,`${n} waiting`):t("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"),"tile-cherry","ui_thank","Washukuru wageni kwa lugha yao.","Thank guests in their own language.")}
    ${m('data-action="go" data-screen="week"',mt,t("Wiki ijayo","Next week"),y,"tile-sky","ui_week","Wiki ijayo. Nani anakuja, na lugha gani.","Next week: who is coming, and which language.")}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${t("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="switch-role">${t("Badilisha upande","Switch side")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${t("Zaidi","More")}</button>
  </div>`}function ht(){const a=s.bookings.filter(c=>Z(c.date)>=0).sort((c,u)=>new Date(c.date)-new Date(u.date)),e=a.filter(c=>Z(c.date)<=7),n=a.filter(c=>Z(c.date)>7),i=R(),o=Ae(e),l=c=>`
    <li>
      <div class="row between">
        <strong>${r(H(c.date))}</strong>
        <span class="badge-num" title="guests">${r(c.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${T(c.language)} ${tt(c.language)}
        ${c.status==="requested"?`<span class="chip warn">${t("Inasubiri kampuni","Awaiting the company")}</span>`:""}
        ${c.guide?`<span class="muted">${t("Mwongozaji","Guide")}: ${r(c.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${r(c.leadName||"")}${c.company?` · ${r(c.company)}`:""}${c.referredBy?` · ${t("alipendekezwa na","recommended by")} ${r(c.referredBy)}`:""}</div>
    </li>`,d=[...Array(14)].map((c,u)=>{const m=ea(L(new Date,u+1)),y=s.availableDays.includes(m);return`<button class="chip" data-action="toggle-day" data-day="${m}" aria-pressed="${y}">${r(H(m+"T12:00:00"))}</button>`}).join("");return`
  ${C()}
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
      <div class="row">${i.download.map(c=>T(c)).join("")}</div>
      <p class="small muted">${t(`MB ${i.downloadMB}. Tumia Wi-Fi.`,`${i.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${s.online?"":"disabled"}>${t("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${t("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${i.removable.length?`
      <hr>
      <p>${t("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${i.removable.map(c=>T(c)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${t(`Futa (MB ${i.freeMB})`,`Delete (frees ${i.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${t("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  <div class="card">
    <h2>${t(`SMS kwa simu ya ${w()}`,`SMS to ${w()}’s basic phone`)}</h2>
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
      <label class="field">${t("Tarehe","Date")}<input type="date" id="bk-date" value="${ea(L(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${t("Wageni","Guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${t("Lugha","Language")}<select id="bk-lang">${La("en")}</select></label>
      </div>
      <label class="field">${t("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${t("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${t(`Mgeni amekubali ${w()} awasiliane naye`,`Guest agreed that ${w()} may contact them`)}</span></label>
      <label class="field hidden" id="bk-email-wrap">${t("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${t("Hifadhi","Save")}</button>
    </div>
  </details>`}function ft(){const a=s.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(n=>`<span class="${a.step>=n?"on":""}"></span>`).join("")}</div>`;return a.step===1?C()+e+re():a.step===2?C()+e+kt():e+wt()}function re(){const a=s.bookings.filter(n=>{const i=Z(n.date);return i<=1&&i>=-14}).filter(n=>!s.guests.some(i=>i.bookingId===n.id)).sort((n,i)=>new Date(i.date)-new Date(n.date)),e=s.guests.slice().sort((n,i)=>new Date(i.visitDate)-new Date(n.visitDate)).slice(0,12);return`
  <h1>${t("Mgeni ni nani?","Who is the guest?")}</h1>

  ${a.length?`
  <div class="card">
    <h2>${t("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(n=>`
      <li class="row between">
        <div><strong>${r(n.leadName||"Mgeni")}</strong> ${T(n.language)}<div class="small muted">${r(H(n.date))} · ${t("wageni","guests")} ${r(n.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${n.id}">${t("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${t("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${t("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${t("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${La("en")}</select></label>
      <label class="field">${t("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${ea(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${t(`Mgeni aliweka alama: ${w()} anaweza kuhifadhi mawasiliano yangu`,`Guest ticked: ${w()} may keep my contact details`)}</span></label>
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
        <div><strong>${r(n.name)}</strong> ${T(n.language)}<div class="small muted">${r(H(n.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${n.id}">${t("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function kt(){var l;const a=G();if(!a)return s.add.step=1,re();const e=((l=S[a.language])==null?void 0:l.mt)&&!s.installed.includes(a.language),n=s.add.inputs.some(d=>d.status==="ready"&&(d.text||"").trim()),i=s.add.inputs.some(d=>d.status==="working"),o=d=>{var p;const c=`
      <select data-change="box" data-id="${d.id}" aria-label="Box">
        <option value="liked" ${d.box==="liked"?"selected":""}>${t("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${d.box==="improve"?"selected":""}>${t("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${d.box==="unknown"?"selected":""}>${t("Haijulikani","Not sure")}</option>
      </select>`,u=d.langHint?`
      <div class="notice warn small">${t(`Inaonekana ni ${v(d.langHint,"sw")}, si ${v(a.language,"sw")}.`,`This looks like ${v(d.langHint,"en")}, not ${v(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${d.langHint}">${t(`Badilisha kuwa ${v(d.langHint,"sw")}`,`Switch to ${v(d.langHint,"en")}`)}</button></div>
      </div>`:"";let m="";d.imageURL&&(m=`<img class="preview-img" src="${d.imageURL}" alt="Photo of the guestbook box">`),d.audioURL&&(m=`<audio controls src="${d.audioURL}" style="width:100%"></audio>`);let y="";return d.status==="working"?y=`<p class="muted">${t("Inasoma…","Reading…")}</p>`:d.status==="error"?y=`<div class="notice neg small">${t("Imeshindwa","Failed")}: ${r(d.error)}</div>`:y=`
        ${(p=d.lowWords)!=null&&p.length?`<div class="notice warn small"><strong>${t("Angalia maneno haya","Check these words")}</strong>${d.lowWords.slice(0,20).map(h=>`<mark class="low">${r(h)}</mark>`).join(" ")}</div>`:""}
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
        ${y}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${r(a.name)}</strong> ${T(a.language)}<div class="small muted">${r(H(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${t("Badilisha","Change")}</button>
    </div>
  </div>

  ${e?`<div class="notice warn">${t(`Lugha ya ${v(a.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${ka}).`,`The ${v(a.language,"en")} pack is not on this phone yet. Analysing needs internet once (${ka} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${Sa}<span class="btn-col">${t("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${Sa}<span class="btn-col">${t("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${s.recording?"danger":"secondary"}" data-action="record">
      ${s.recording?'<span class="rec-dot"></span>':lt}<span class="btn-col">${s.recording?t("Simamisha","Stop"):t("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${ut}<span class="btn-col">${t("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${t("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${s.add.inputs.map(o).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${n&&!i?"":"disabled"}>${t("Changanua","Analyse")}</button>`}function wt(){const a=s.add.results.map(i=>s.entries.find(o=>o.id===i)).filter(Boolean),e=G(),n=a.reduce((i,o)=>i+(o.sentences||[]).filter(ia).length,0);return`
  <h1>${t("Matokeo","Results")}</h1>
  ${n?`<div class="notice warn"><strong>${t(`Sentensi ${n} zinahitaji kuangaliwa`,`${n} ${n===1?"sentence needs":"sentences need"} a check`)}</strong>${t("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${t("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(ot).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${t("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${t(`Ongeza maoni mengine ya ${r((e==null?void 0:e.name)||"mgeni")}`,`Add more for ${r((e==null?void 0:e.name)||"this guest")}`)}</button>
  </div>`}const ja={week:()=>t("Wiki hii","This week"),month:()=>t("Mwezi huu","This month"),all:()=>t("Zote","All time")};function yt(){const a=s.entries.filter(m=>m.status==="pending"),{s:e,entries:n,text:i}=la(),o=Object.entries(ja).map(([m,y])=>`<button class="chip" data-action="period" data-period="${m}" aria-pressed="${s.period===m}">${y()}</button>`).join(""),l=(m,y)=>m.filter(g=>g.id!=="other").map(g=>{const p=e.guests?Math.round(g.guests/e.guests*100):0,h=g.quotes.slice(0,5).map(b=>`
      <blockquote class="q">${b.original&&b.lang!=="en"?`<div class="orig" lang="${r(b.lang)}">“${r(b.original)}”</div><div class="trans">EN: ${r(b.en)}</div>`:`<div class="orig">“${r(b.en)}”</div>`}
      ${b.flagged?`<span class="chip warn" style="margin-top:4px">${t("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${r(na(g.id))}</strong><span class="badge-num ${y?"neg":""}">${g.guests}</span></div>
        <div class="bar ${y?"neg":""}"><span style="width:${p}%"></span></div>
        <details class="quotes"><summary>${t("Maneno ya wageni","What guests said")} (${g.quotes.length})</summary>${h}</details>
      </div>`}).join(""),d=[];for(const m of n)(m.sentences||[]).forEach((y,g)=>{ia(y)&&d.push([m,g])});const c=Za(e,`${ja[s.period]()}`,w()),u=$();return`
  ${C()}
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
    <div class="card-title"><h2>${t(`Kwa ${w()}`,`For ${w()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${t("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${u}">${i[u].map(m=>`<p>${r(m)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${t("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${e.liked.filter(m=>m.id!=="other").length?`<div class="card"><h2>${t("Walichopenda","What they liked")}</h2>${l(e.liked,!1)}</div>`:""}
  ${e.improve.filter(m=>m.id!=="other").length?`<div class="card"><h2>${t("Wanachotaka kiboreshwe","What they want improved")}</h2>${l(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${t("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(m=>{const y=E.find(g=>g.id===m.id);return`<div class="topic-row"><strong>${r(y[u])}</strong><span class="badge-num">${m.guests}</span></div>`}).join("")}
  </div>`:""}

  ${d.length?`
  <div class="card">
    <h2>${t("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${d.map(([m,y])=>{var g;return`<div class="small muted" style="margin-top:8px">${r(((g=oa(m.guestId))==null?void 0:g.name)||"")} · ${r(v(m.lang,u))}</div>${de(m,y,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${t("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${t("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${r(c)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${s.shareOk?"checked":""}>
      <span>${t("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${s.shareOk?"":"disabled"}>${t("Shiriki","Share")}</button>
  </div>`}
  `}function bt(){const a=s.guests.slice().sort((e,n)=>new Date(n.visitDate)-new Date(e.visitDate));return a.length?`
  ${C()}
  <h1>${t("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${t("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const n=s.entries.filter(l=>l.guestId===e.id).length,i=s.messages.some(l=>l.guestId===e.id&&l.status==="sent"),o=s.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${r(e.name)}</strong> ${T(e.language)}${e.synthetic?` <span class="chip plain">${t("mfano","example")}</span>`:""}</div>
          <span class="small muted">${r(H(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${et(e)} <span class="muted">${t("maoni","entries")}: ${n}</span>
          ${i?`<span class="chip">${t("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${t("Alipendekezwa na","Recommended by")}: ${r(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${o?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${t("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${t("Futa","Delete")}</button>
        </div>
        ${o?$t(e):""}
      </li>`}).join("")}</ul></div>`:`${C()}<h1>${t("Wageni","Guests")}</h1>
      <div class="card"><p>${t("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${t("Ongeza maoni","Add feedback")}</button></div>`}function $t(a){const e=Oe(s.entries,a.id),n=Ra(a,e,w()),i=a.contact||{},o=Ha[n.lang]||Ha.en;let l;a.consent?i.email?l=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${n.lang}" href="mailto:${encodeURIComponent(i.email)}?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(n.text)}">${t("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:i.phone?l=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${n.lang}" href="sms:${encodeURIComponent(i.phone)}?body=${encodeURIComponent(n.text)}">${t("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:l=`<div class="notice small">${t("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:l=`<div class="notice warn small">${t("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const d=$();return`
  <div class="stack" style="margin-top:12px">
    ${n.usedFallback?`<div class="notice warn small">${t(`Hakuna kiolezo cha ${v(a.language,"sw")} bado; tumetumia Kiingereza.`,`No ${v(a.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${n.lang}"><div class="small muted">${t(`Kwa ${v(n.lang,"sw")}`,`In ${v(n.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${r(n.text)}</p></div>
    ${n.lang!==d?`<div class="card flat" lang="${d}"><div class="small muted">${t("Maana yake","What it says")}</div><p style="margin:6px 0 0">${r(d==="sw"?n.sw:Ra({...a,language:"en"},e,w()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${e?t(`Mada aliyopenda: ${na(e)}`,`Liked topic: ${na(e)}`):t("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${l}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${t("Nakili","Copy")}</button>
  </div>`}function vt(){const a=R(),e=$(),n=o=>{const l=S[o],d=s.installed.includes(o),c=[];return d&&c.push(`<span class="chip">${t("Imepakuliwa","On phone")}</span>`),a.keep.includes(o)&&c.push(`<span class="chip">${t("Inakaa daima","Kept")}</span>`),a.needed.includes(o)&&c.push(`<span class="chip warn">${t("Wiki ijayo","Needed next week")}</span>`),d&&a.removable.includes(o)&&c.push(`<span class="chip plain">${t("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${r(l[e])}</strong> <span class="muted small">${r(l.native)} · ${ka} MB</span>
          <div class="row" style="margin-top:4px">${c.join("")}</div></div>
        ${d?`<button class="btn small danger" data-action="delete-pack" data-lang="${o}">${t("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${o}" ${s.online?"":"disabled"}>${t("Pakua","Get")}</button>`}
      </div>`},i=o=>{const l=O[o],d=s.shared[o];return`
      <div class="pack">
        <div><strong>${r(l[e])}</strong> <span class="muted small">${l.mb} MB</span></div>
        ${d?`<span class="chip">${t("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${o}" ${s.online?"":"disabled"}>${t("Pakua","Get")}</button>`}
      </div>`};return`
  ${C()}
  <h1>${t("Lugha","Languages")}</h1>
  <p class="small muted">${t(`Kiswahili na Kiingereza daima, pamoja na lugha ${Wa} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Wa} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${t("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${t("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(O).map(i).join("")}
  </div>

  <div class="card">
    <h2>${t("Lugha za wageni","Guest languages")}</h2>
    ${a.usedDefaults?`<p class="small muted">${t("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${a.recommend.length?`
      <div class="notice small" style="margin-top:4px">${t(`Pakua ukiwa na Wi-Fi: ${a.recommend.map(o=>S[o].sw).join(", ")} (MB ${a.recommendMB}).`,`Download on Wi-Fi: ${a.recommend.map(o=>S[o].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${s.online?"":"disabled"}>${t("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${Me().map(n).join("")}
  </div>`}function xt(){const a=s.guests.some(e=>e.synthetic);return`
  ${C()}
  <h1>${t("Zaidi","More")}</h1>

  <div class="card">
    <h2>${t("Mwenyeji","Host")}</h2>
    <label class="field">${t("Jina lako (linaonekana kwa wageni na kwenye ujumbe)","Your name (shown to guests and in messages)")}
      <input type="text" id="host-name" value="${r(w())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${t("Hifadhi jina","Save name")}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${t("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?t("Herufi za kawaida","Normal text size"):t("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${t("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(w())}" target="_blank" rel="noopener">${t("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
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
  </div>`}function za(){var i;const a=o=>{var l,d;return((d=(l=document.getElementById(o))==null?void 0:l.value)==null?void 0:d.trim())||""},e=!!((i=document.getElementById("c-consent"))!=null&&i.checked),n=a("c-date");return{id:z("bk"),date:D(n||L(new Date,3)),guests:Math.max(1,Number(a("c-guests"))||1),leadName:a("c-name")||"Mgeni",language:a("c-lang")||"en",guide:a("c-guide"),company:"",consent:e,email:e?a("c-email"):""}}function St(){const a=s.bookings.filter(i=>i.status==="requested").sort((i,o)=>new Date(i.date)-new Date(o.date)),e=s.bookings.filter(i=>i.status==="confirmed"&&i.source==="visitor").slice(-3);if(!a.length&&!e.length)return"";const n=i=>`
    <li>
      <div class="row between"><strong>${r(i.leadName)}</strong><span class="badge-num">${r(i.guests)}</span></div>
      <div class="row small" style="margin-top:6px">${r(H(i.date))} ${T(i.language)}${i.referredBy?`<span class="muted">${t("alipendekezwa na","recommended by")} ${r(i.referredBy)}</span>`:""}${i.consent&&i.email?`<span class="muted">${r(i.email)}</span>`:""}</div>
      ${i.status==="requested"?`<button class="btn small block" style="margin-top:8px" data-action="company-confirm" data-id="${i.id}">${t(`Thibitisha na tuma SMS kwa ${w()}`,`Confirm and send the SMS to ${w()}`)}</button>`:`<div class="sms small" style="margin-top:8px">${r(ta(i))}</div><a class="btn small secondary block" style="margin-top:6px" href="sms:?body=${encodeURIComponent(ta(i))}">${t("Fungua kwenye programu ya SMS","Open in the SMS app")}</a>`}
    </li>`;return`
  <div class="card">
    <h2>${t("Maombi mapya kutoka kwa wageni","New requests from visitors")}</h2>
    <p class="small muted">${t("Yametumwa kutoka ukurasa wa “Tafuta mahali”. Ukithibitisha, mwenyeji anapata SMS; haitaji intaneti.","Sent from the “Find a place” page. When you confirm, the host gets an SMS; no internet needed on her side.")}</p>
    <ul class="list">${[...a,...e].map(n).join("")}</ul>
  </div>`}function jt(){const a=ea(L(new Date,3)),{s:e}=la(),n=e.entries?Za(e,t("Mfano","Example"),w()):null;return(s.role==="company"?`<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${t("Badilisha upande","Switch side")}</button>`:C())+St()+Xe({langOptionsHTML:La("en"),today:a,sms:ta({date:D(a),guests:2,language:"en",guide:""}),report:n})}async function zt(){if(s.hosts)return s.hosts;try{const a=await fetch("data/hosts.json");s.hosts=(await a.json()).hosts}catch{s.hosts=[]}return s.hosts}const Ca=a=>(s.hosts||[]).find(e=>e.id===a);function Da(){return s.hosts||zt().then(k),Fe({q:s.find.q,hosts:s.hosts||[],lang:$(),loading:!s.hosts})}function Mt(){const a=Ca(s.book.hostId);if(!a)return s.screen="find",Da();const e=a.id==="noor"?la().s:null,n=qe(a,a.id==="noor"?s.availableDays:null),i=(s.book.form.referredBy||"").trim().toLowerCase(),o=i&&a.id==="noor"?s.guests.find(l=>(l.name||"").toLowerCase().split(" ")[0]===i.split(" ")[0]):null;return Ve({host:a,days:n,selected:s.book.day,summaryLine:Ge(a,e,$()),form:s.book.form,lang:$(),knownGuest:o})}function It(){const a=Ca(s.book.hostId);return!a||!s.book.done?(s.screen="find",Da()):Je({host:a,booking:s.book.done,lang:$()})}function Aa(){var e;const a=n=>{var i;return((i=document.getElementById(n))==null?void 0:i.value)||""};document.getElementById("bk-v-name")&&(s.book.form={guests:Number(a("bk-v-guests"))||2,language:a("bk-v-lang")||"en",name:a("bk-v-name"),email:a("bk-v-email"),consent:!!((e=document.getElementById("bk-v-consent"))!=null&&e.checked),referredBy:a("bk-v-ref")})}async function Bt(){Aa();const a=Ca(s.book.hostId),e=s.book.form;if(!s.book.day)return x(t("Chagua siku","Pick a day"));if(!e.name.trim())return x(t("Andika jina lako","Add your name"));const n={id:z("bk"),date:D(s.book.day),guests:Math.max(1,e.guests),leadName:e.name.trim(),language:e.language,guide:a.guide,company:a.company,consent:e.consent,email:e.consent?e.email.trim():"",referredBy:e.referredBy.trim(),hostId:a.id,status:"requested",source:"visitor",createdAt:new Date().toISOString()};await f.put("bookings",n),s.bookings.push(n),s.book.done=n,j("booked")}function Tt(){const a=e=>{var n;return((n=document.getElementById(e))==null?void 0:n.value)||""};document.getElementById("v-liked")&&(s.visitor.draft={name:a("v-name"),liked:a("v-liked"),improve:a("v-improve"),email:a("v-email")})}async function Lt(){var m,y,g;const a=p=>{var h,b;return((b=(h=document.getElementById(p))==null?void 0:h.value)==null?void 0:b.trim())||""},e=s.visitor.lang,n=ne(e),i=a("v-liked"),o=a("v-improve");if(!i&&!o){x(n.needText);return}const l=!!((m=document.getElementById("v-consent"))!=null&&m.checked),d=[(y=document.getElementById("v-buy-coffee"))!=null&&y.checked?"coffee":null,(g=document.getElementById("v-buy-souvenir"))!=null&&g.checked?"souvenir":null].filter(Boolean),c={id:z("g"),name:a("v-name")||"Mgeni",language:e,visitDate:D(new Date),consent:l,contact:l?{email:a("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await f.put("guests",c);let u=!0;for(const[p,h]of[["liked",i],["improve",o]])h&&(await f.put("entries",{id:z("fb"),guestId:c.id,lang:e,source:"visitor",box:p,original:h,status:"pending",sentences:[],products:[],declaredProducts:u?d:[],visitDate:c.visitDate,createdAt:new Date().toISOString()}),u=!1);await _(),s.visitor={lang:e,saved:!0,draft:{}},k(),window.scrollTo(0,0)}let I=null,B=null;function Ea(){var e;if(I||(I=document.createElement("div"),I.className="guide-backdrop hidden",I.setAttribute("role","dialog"),I.setAttribute("aria-modal","true"),I.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(I),B=document.createElement("div"),B.className="spot hidden",B.innerHTML='<span class="spot-hand">👆</span>',document.body.appendChild(B)),I.classList.toggle("hidden",!s.guide.open),!s.guide.open){I.innerHTML="",B.classList.add("hidden");return}I.innerHTML=Ke(s.guide.step),(e=I.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||e.focus();const a=W[s.guide.step].target&&document.querySelector(W[s.guide.step].target);a?(a.scrollIntoView({block:"start",behavior:"smooth"}),setTimeout(()=>{const n=a.getBoundingClientRect();B.style.left=`${n.left-6}px`,B.style.top=`${n.top-6}px`,B.style.width=`${n.width+12}px`,B.style.height=`${n.height+12}px`,B.classList.remove("hidden")},350)):B.classList.add("hidden")}function X(a=0){s.guide={open:!0,step:a},Ea()}async function ya(){s.guide.open=!1,Ea(),await f.setSetting("guideSeen",!0)}async function Ct(){await ya();const a="demo_quick";if(!oa(a)){const e={id:a,name:"Emma (mfano)",language:"en",visitDate:D(L(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",e);const n={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const i of["liked","improve"])await f.put("entries",{id:`${a}_${i}`,guestId:a,lang:"en",source:"typed",box:i,original:n[i],status:"pending",sentences:[],products:[],visitDate:e.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await _()}s.period="all",s.screen="home",k(),await ue()}const Dt={choose:Ze,home:gt,add:ft,summary:yt,guests:bt,week:ht,langs:vt,more:xt,company:jt,find:Da,host:Mt,booked:It,visitor:()=>Qe(s.visitor.lang,s.visitor.saved,s.visitor.draft)};function k(){const a=s.screen;document.body.classList.toggle("mode-visitor",a==="visitor"||a==="choose"),document.body.classList.toggle("mode-choose",a==="choose"),document.body.classList.toggle("home",a==="home"),se.innerHTML=Dt[a](),document.getElementById("net").textContent=s.online?t("Mtandaoni","Online"):t("Nje ya mtandao","Offline");const e=document.getElementById("lang-btn");e&&(e.textContent=$()==="sw"?"English":"Kiswahili"),s.guide.open&&Ea(),a==="langs"&&be().then(n=>{const i=document.getElementById("storage-line");i&&n&&(i.textContent=t(`Nafasi iliyotumika: MB ${n.usedMB} kati ya MB ${n.quotaMB}`,`Storage used: ${n.usedMB} MB of ${n.quotaMB} MB`))})}function j(a){s.screen=a,a!=="add"&&(s.add=P()),k(),window.scrollTo(0,0)}async function da(a){if(!a.length)return!0;const e=a.reduce((i,[o,l])=>i+(o==="pack"?ka:O[l].mb),0);if(!navigator.onLine)return x(t("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const n=a.map(([i,o])=>i==="pack"?v(o,$()):O[o][$()]).join(", ");if(!confirm(t(`Pakua mara moja: takriban MB ${e} (${n}). Endelea?`,`One-time download of about ${e} MB (${n}). Continue?`)))return!1;for(const[i,o]of a)F(t("Inapakua","Downloading")+` · ${i==="pack"?v(o,$()):O[o][$()]}`),i==="pack"?await $e(o,U):await ve(o,U);return N(),await sa(),!0}async function $a(a){const e=a.filter(n=>{var i;return((i=S[n])==null?void 0:i.mt)&&!s.installed.includes(n)}).map(n=>["pack",n]);await da(e)&&(x(t("Lugha ziko tayari","Packs ready")),k())}async function qa(a){if(!a.length)return;const e=a.map(n=>v(n,$())).join(", ");if(confirm(t(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${e}? They can be downloaded again later.`))){for(const n of a)await xe(S[n].mt);await sa(),x(t("Imefutwa","Deleted")),k()}}async function At(){if(!navigator.onLine)return x(t("Hakuna mtandao","Offline"));F(t("Inapokea ratiba","Receiving the schedule"));const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),n=new Date,i=e.bookings.map(l=>({id:l.id,date:D(L(n,l.dayOffset)),guests:l.guests,leadName:l.leadName,language:l.language,guide:l.guide,company:e.company,consent:!!l.consent,email:l.consent&&l.email||"",synthetic:!0}));await f.putMany("bookings",i),s.bookings=await f.all("bookings"),s.lastSync=new Date().toISOString(),await f.setSetting("lastSync",s.lastSync),N();const o=R();x(o.download.length?t(`Ratiba imepokelewa. Pakua: ${o.download.map(l=>S[l].sw).join(", ")}`,`Schedule received. Download: ${o.download.map(l=>S[l].en).join(", ")}`):t("Ratiba imepokelewa","Schedule received")),k()}async function Et(){const a=o=>{var l,d;return((d=(l=document.getElementById(o))==null?void 0:l.value)==null?void 0:d.trim())||""},e=a("bk-date");if(!e)return x(t("Weka tarehe","Add a date"));const n=document.getElementById("bk-consent").checked,i={id:z("bk"),date:D(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:n,email:n?a("bk-email"):""};await f.put("bookings",i),s.bookings.push(i),x(t("Imehifadhiwa","Saved")),k()}async function Nt(a){const e=s.bookings.find(i=>i.id===a);if(!e)return;let n=s.guests.find(i=>i.bookingId===e.id);n||(n={id:z("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await f.put("guests",n),s.guests.push(n)),s.add=P(),s.add.guestId=n.id,s.add.step=2,k()}async function Wt(){const a=i=>{var o,l;return((l=(o=document.getElementById(i))==null?void 0:o.value)==null?void 0:l.trim())||""},e=document.getElementById("ng-consent").checked,n={id:z("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:D(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await f.put("guests",n),s.guests.push(n),s.add=P(),s.add.guestId=n.id,s.add.step=2,k(),window.scrollTo(0,0)}async function Ot(a,e){const n=G(),i={id:z("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};s.add.inputs.push(i),k();try{F(t("Inasoma picha","Reading the photo"));const o=await we(a,n.language,U);Object.assign(i,{text:o.text,lowWords:o.lowWords,confidence:o.confidence,status:"ready"}),o.text||(i.status="error",i.error=t("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const l=await ye(o.text);l&&l!==n.language&&(i.langHint=l)}catch(o){i.status="error",i.error=o.message}finally{N(),k()}}async function ce(a){const e=G();if(!s.shared.voice&&!await da([["shared","voice"]]))return;const n={id:z("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};s.add.inputs.push(n),k();try{F(t("Inasikiliza","Listening"));const i=await ke(a,e.language,U);Object.assign(n,{text:i.original,english:i.english,status:"ready"}),s.shared.voice=!0}catch(i){n.status="error",n.error=i.message}finally{N(),k()}}let pa=null;async function Pt(){var i;if(pa){pa.stop();return}if(!((i=navigator.mediaDevices)!=null&&i.getUserMedia)||!window.MediaRecorder){x(t("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],n=new MediaRecorder(a);n.ondataavailable=o=>{o.data.size&&e.push(o.data)},n.onstop=()=>{a.getTracks().forEach(l=>l.stop()),pa=null,s.recording=!1;const o=new Blob(e,{type:n.mimeType||"audio/webm"});k(),ce(o).catch(l=>x(l.message))},n.start(),pa=n,s.recording=!0,k()}async function Rt(){var o;const a=G(),e=s.add.inputs.filter(l=>l.status==="ready"&&(l.text||"").trim());if(!e.length)return;const n=[];if(a.language!=="sw"){s.shared.topics||n.push(["shared","topics"]),s.shared.mood||n.push(["shared","mood"]);const l=e.some(d=>!(d.source==="voice"&&d.english));(o=S[a.language])!=null&&o.mt&&l&&!s.installed.includes(a.language)&&n.push(["pack",a.language])}if(!await da(n))return;const i=[];for(const[l,d]of e.entries()){F(`${t("Inachanganua","Analysing")} ${l+1}/${e.length}`);const c=d.source==="voice"&&a.language!=="en"&&a.language!=="sw"?d.english:void 0,u=await Qa({original:d.text.trim(),lang:a.language,box:d.box,english:c},U),m={id:z("fb"),guestId:a.id,lang:a.language,source:d.source,box:d.box,original:d.text.trim(),...u,lowWords:d.lowWords||[],ocrConfidence:d.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await f.put("entries",m),s.entries.push(m),i.push(m.id)}N();for(const l of s.add.inputs)l.imageURL&&URL.revokeObjectURL(l.imageURL),l.audioURL&&URL.revokeObjectURL(l.audioURL);s.add.inputs=[],s.add.results=i,s.add.step=3,await sa(),k(),window.scrollTo(0,0)}async function ue(){var i;const a=s.entries.filter(o=>o.status==="pending"),e=[...new Set(a.map(o=>o.lang))],n=[];e.some(o=>o!=="sw")&&(s.shared.topics||n.push(["shared","topics"]),s.shared.mood||n.push(["shared","mood"]));for(const o of e)(i=S[o])!=null&&i.mt&&!s.installed.includes(o)&&n.push(["pack",o]);if(await da(n)){for(const[o,l]of a.entries()){F(`${t("Inachanganua","Analysing")} ${o+1}/${a.length}`);const d=await Qa({original:l.original,lang:l.lang,box:l.box},U);Object.assign(l,d),await f.put("entries",l)}N(),await sa(),x(`✓ ${t("Imekamilika","Done")}`),k()}}async function aa(a){await f.put("entries",a),k()}function Ma(a){const e=s.entries.find(n=>n.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function Ht(){const e=await(await fetch("data/demo.json")).json(),n=new Date;for(const i of e.guests){const o={id:i.id,name:i.name,language:i.language,visitDate:D(L(n,i.dayOffset)),consent:i.consent,contact:i.consent?{email:i.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",o);for(const l of["liked","improve"])i[l]&&await f.put("entries",{id:`${i.id}_${l}`,guestId:i.id,lang:i.language,source:"typed",box:l,original:i[l],status:"pending",sentences:[],products:[],visitDate:o.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await _(),s.period="all",j("home"),x(t("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function _t(){for(const a of s.guests.filter(e=>e.synthetic))await f.del("guests",a.id);for(const a of s.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await f.del("entries",a.id);for(const a of s.bookings.filter(e=>e.synthetic))await f.del("bookings",a.id);await _(),x(t("Imeondolewa","Removed")),k()}async function Kt(a){const e=oa(a);if(!(!e||!confirm(t(`Futa ${e.name} na maoni yake yote?`,`Delete ${e.name} and all their feedback?`)))){await f.del("guests",a);for(const n of s.entries.filter(i=>i.guestId===a))await f.del("entries",n.id);for(const n of s.messages.filter(i=>i.guestId===a))await f.del("messages",n.id);await _(),k()}}async function qt(){var e;if(!s.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await Fa(a)}async function Ut(){const{s:a,text:e}=la(),n=$();n==="sw"&&await Xa(Pe(a))||Va(e[n].join(" "),n)}async function Ft(a="home"){s.visitor={lang:Ta(),saved:!1,draft:{}},await f.setSetting("kiosk",a),j("visitor")}async function Gt(a){if(s.role=a,await f.setSetting("role",a),a==="visitor")return s.book={hostId:null,day:null,form:{},done:null},j("find");j(a==="company"?"company":"home"),a==="host"&&!await f.getSetting("guideSeen",!1)&&X(0)}const Vt={say:a=>_e(a.dataset.clip,$()==="sw"?a.dataset.sw:a.dataset.en,$(),Va),"choose-role":a=>Gt(a.dataset.role),"open-host":a=>{s.book={hostId:a.dataset.id,day:null,form:{},done:null},j("host")},"book-day":a=>{Aa(),s.book.day=a.dataset.day,k()},"book-submit":Bt,"toggle-day":async a=>{const e=a.dataset.day;s.availableDays=s.availableDays.includes(e)?s.availableDays.filter(n=>n!==e):[...s.availableDays,e].sort(),await f.setSetting("availableDays",s.availableDays),k()},"company-confirm":async a=>{const e=s.bookings.find(n=>n.id===a.dataset.id);e&&(e.status="confirmed",await f.put("bookings",e),x(t(`Imethibitishwa. SMS kwa ${w()} iko tayari.`,`Confirmed. The SMS to ${w()} is ready.`)),k())},"switch-role":async()=>{s.role=null,await f.setSetting("role",null),j("choose")},back:()=>j("home"),go:a=>j(a.dataset.screen),"toggle-lang":async()=>{Ga($()==="sw"?"en":"sw"),await f.setSetting("lang",$()),k()},"hand-to-guest":()=>Ft(s.screen==="find"?"choose":"home"),"visitor-lang":a=>{Tt(),s.visitor.lang=a.dataset.lang,k()},"visitor-save":Lt,"visitor-next":()=>{s.visitor={lang:Ta(),saved:!1,draft:{}},k(),window.scrollTo(0,0)},"visitor-exit":async()=>{const a=await f.getSetting("kiosk","home");a==="home"&&!confirm(t(`Kwa ${w()} tu: rudi nyumbani?`,`${w()} only: back to the home screen?`))||(await f.setSetting("kiosk",!1),j(a==="choose"?"find":"home"))},"company-sms":()=>{var n,i;const a=za(),e=((i=(n=document.getElementById("c-phone"))==null?void 0:n.value)==null?void 0:i.trim())||"";if(!e){x(t(`Weka namba ya simu ya ${w()}`,`Add ${w()}’s phone number`));return}window.location.href=`sms:${encodeURIComponent(e)}?body=${encodeURIComponent(ta(a))}`},"company-save":async()=>{const a=za();await f.put("bookings",a),s.bookings.push(a),x(t("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const a=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",a),await f.setSetting("bigText",a),k()},"save-host":async()=>{var a;va((a=document.getElementById("host-name"))==null?void 0:a.value),await f.setSetting("hostName",w()),x(t(`Jina: ${w()}`,`Name: ${w()}`)),k()},"guide-open":()=>X(0),"guide-next":()=>X(Math.min(s.guide.step+1,W.length-1)),"guide-prev":()=>X(Math.max(s.guide.step-1,0)),"guide-close":ya,"guide-try":Ct,sync:At,"add-booking":Et,"download-pack":a=>$a([a.dataset.lang]),"download-suggested":()=>$a(R().download),"download-recommended":()=>$a(R().recommend),"delete-pack":a=>qa([a.dataset.lang]),"delete-removable":()=>qa(R().removable),"download-shared":async a=>{await da([["shared",a.dataset.key]])&&k()},"pick-booking":a=>Nt(a.dataset.id),"pick-guest":a=>{s.add=P(),s.add.guestId=a.dataset.id,s.add.step=2,k(),window.scrollTo(0,0)},"save-new-guest":Wt,"change-guest":()=>{s.add.step=1,k()},"add-typed":()=>{s.add.inputs.push({id:z("in"),source:"typed",box:"liked",text:"",status:"ready"}),k()},record:Pt,"remove-input":a=>{s.add.inputs=s.add.inputs.filter(e=>e.id!==a.dataset.id),k()},"use-hint":async a=>{const e=G();e.language=a.dataset.lang,await f.put("guests",e),s.add.inputs.forEach(n=>{n.langHint=null}),x(`${t("Lugha","Language")}: ${v(e.language,$())}`),k()},"run-analysis":Rt,"finish-add":()=>j("summary"),"more-feedback":()=>{const a=s.add.guestId;s.add=P(),s.add.guestId=a,s.add.step=2,k(),window.scrollTo(0,0)},"fix-mood":async a=>{const[e,n]=Ma(a);n&&(n.sentiment=a.dataset.mood,n.flags=(n.flags||[]).filter(i=>i==="topic-unsure"&&n.topic==="other"),n.confirmed=n.topic!=="other",await aa(e))},"confirm-sent":async a=>{const[e,n]=Ma(a);n&&(n.confirmed=!0,n.flags=[],await aa(e))},"sw-mood":async a=>{var i;const e=s.entries.find(o=>o.id===a.dataset.entry);if(!e)return;const n=((i=e.sentences)==null?void 0:i[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};n.sentiment=a.dataset.mood,e.sentences=[n],await aa(e)},period:a=>{s.period=a.dataset.period,k()},speak:Ut,"analyze-pending":ue,share:qt,"toggle-draft":a=>{s.openGuest=s.openGuest===a.dataset.id?null:a.dataset.id,k()},"mark-sent":async a=>{const e={id:z("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await f.put("messages",e),s.messages.push(e),setTimeout(k,400)},copy:a=>{var e;return Fa(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>Kt(a.dataset.id),"load-demo":Ht,"remove-demo":_t,wipe:async()=>{if(!confirm(t("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const a=$();await f.wipeAll(),await f.setSetting("lang",a),await _(),s.add=P(),va("Noor"),x(t("Data yote imefutwa","All data deleted")),j("choose")}},Jt={"company-preview":()=>{const a=document.getElementById("c-sms");a&&(a.textContent=ta(za()))},"company-consent":a=>{var e;return(e=document.getElementById("c-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=s.add.inputs.find(n=>n.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,n]=Ma(a);n&&(n.topic=a.value,n.flags=(n.flags||[]).filter(i=>i!=="topic-unsure"),n.confirmed=n.topic!=="other"&&n.sentiment!=="unsure",await aa(e))},"sw-topic":async a=>{var i;const e=s.entries.find(o=>o.id===a.dataset.entry);if(!e||!a.value)return;const n=((i=e.sentences)==null?void 0:i[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};n.topic=a.value,e.sentences=[n],await aa(e)},"share-ok":a=>{s.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked)}};let ga=null;const Yt={"input-text":a=>{const e=s.add.inputs.find(n=>n.id===a.dataset.id);e&&(e.text=a.value),Zt()},"input-english":a=>{const e=s.add.inputs.find(n=>n.id===a.dataset.id);e&&(e.english=a.value)},"find-q":a=>{s.find.q=a.value,clearTimeout(ga),ga=setTimeout(()=>{const e=a.selectionStart;k();const n=document.getElementById("find-q");n&&(n.focus(),n.setSelectionRange(e,e))},250)},"bk-v-ref":a=>{clearTimeout(ga),ga=setTimeout(()=>{Aa(),k();const e=document.getElementById("bk-v-ref");e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},400)}};function Zt(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=s.add.inputs.some(i=>i.status==="ready"&&(i.text||"").trim()),n=s.add.inputs.some(i=>i.status==="working");a.disabled=!(e&&!n)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const n=Vt[e.dataset.action];n&&(e.tagName==="BUTTON"&&a.preventDefault(),navigator.vibrate&&navigator.vibrate(8),s.guide.open&&e.dataset.action!=="say"&&!e.closest(".guide-card")&&ya(),Promise.resolve(n(e,a)).catch(i=>{console.error(i),N(),x(`${t("Hitilafu","Error")}: ${i.message}`,6e3)}))});document.addEventListener("change",a=>{var i;const e=a.target;if(e.matches("input[type=file][data-file]")){const o=(i=e.files)==null?void 0:i[0];if(e.value="",!o)return;const l=e.dataset.file;(l==="audio"?ce(o):Ot(o,l==="photo-liked"?"liked":"improve")).catch(c=>{N(),x(c.message,6e3)});return}const n=Jt[e.dataset.change];n&&Promise.resolve(n(e)).catch(o=>x(o.message,6e3))});document.addEventListener("input",a=>{var n;const e=Yt[(n=a.target.dataset)==null?void 0:n.input];e&&e(a.target)});document.addEventListener("keydown",a=>{a.key==="Escape"&&s.guide.open&&ya()});window.addEventListener("online",()=>{s.online=!0,k()});window.addEventListener("offline",()=>{s.online=!1,k()});async function Qt(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),n=new Set([new URL("index.html",location.href).href]);for(const i of performance.getEntriesByType("resource"))n.add(i.name);await Promise.all([...n].map(async i=>{try{const o=new URL(i);if(o.pathname.endsWith("/data/bookings.json"))return;const l=o.origin===location.origin?a:o.hostname==="cdn.jsdelivr.net"?e:null;l&&!await l.match(i)&&await l.add(i)}catch{}}))}async function Xt(){const a=await f.getSetting("lang",null);return a||((navigator.languages||[navigator.language||"en"]).some(n=>String(n).toLowerCase().startsWith("sw"))?"sw":"en")}async function an(){Ga(await Xt()),await _(),await f.getSetting("kiosk",!1)?(s.visitor={lang:Ta(),saved:!1,draft:{}},s.screen="visitor"):s.screen=s.role==="host"?"home":s.role==="company"?"company":s.role==="visitor"?"find":"choose",k(),s.screen==="home"&&!await f.getSetting("guideSeen",!1)&&X(0),await sa(),k(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(Qt).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),Ba().then(e=>{e&&navigator.onLine&&He()})}an().catch(a=>{console.error(a),se.innerHTML=`<div class="notice neg"><strong>${t("Hitilafu","Error")}</strong>${r(a.message)}</div>`});
