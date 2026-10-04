import{l as x,t as E,P as A,L as S,e as te,f as xe,g as Se,i as qa,c as je,a as ze,j as Me,k as n,m as y,h as d,n as D,o as va,b as N,d as b,q as Ma,r as ne,u as ie,v,w as T,s as U,x as se,y as Le,p as K,z as Be,A as Ie,B as Ce,C as ya,S as O,D as Te,E as Ee,F as Ae,G as De,H as Ne,I as We,K as Ka,J as Oe,N as wa,O as Pe}from"./ui-Be3cjfNx.js";const Re="kitabu",He=1,oe=["guests","entries","bookings","messages","settings"];let ca=null;function Fe(){return ca||(ca=new Promise((a,e)=>{const t=indexedDB.open(Re,He);t.onupgradeneeded=()=>{const i=t.result;for(const l of oe)i.objectStoreNames.contains(l)||i.createObjectStore(l,{keyPath:l==="settings"?"key":"id"})},t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)}),ca)}function _(a,e,t){return Fe().then(i=>new Promise((l,s)=>{const r=i.transaction(a,e),c=r.objectStore(a);let u;Promise.resolve(t(c)).then(p=>{u=p}),r.oncomplete=()=>l(u),r.onerror=()=>s(r.error),r.onabort=()=>s(r.error)}))}function Ua(a){return new Promise((e,t)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})}const f={async all(a){return _(a,"readonly",e=>Ua(e.getAll()))},async get(a,e){return _(a,"readonly",t=>Ua(t.get(e)))},async put(a,e){return await _(a,"readwrite",t=>{t.put(e)}),e},async putMany(a,e){await _(a,"readwrite",t=>{for(const i of e)t.put(i)})},async del(a,e){await _(a,"readwrite",t=>{t.delete(e)})},async clear(a){await _(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const t=await this.get("settings",a);return t?t.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of oe)await this.clear(a)}};function z(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const _e=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],qe=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Na(a){const e=new Date(a);return`${_e[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function le(a){const e=new Date(a);return`${qe[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Wa(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function ea(a){return`WeKaribu: Wageni wapya. ${Na(a.date)}: wageni ${a.guests} (${x(a.language,"sw")})${a.guide?`, mwongozaji ${a.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const Y=a=>`${a} ${a===1?"guest":"guests"}`,Ga=a=>`${a} ${a===1?"entry":"entries"}`;function Ke(a,e="Noor"){const t=[],i=[];if(t.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),i.push(`This period: ${Y(a.guests)}, ${Ga(a.entries)}.`),a.guests===0)return t.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),i.push("No feedback yet. Add guest feedback first."),{sw:t,en:i};a.guests<5&&(t.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),i.push(`Caution: still little feedback (${Y(a.guests)}). Too early for big decisions.`));const s=a.liked.filter(u=>u.id!=="other").slice(0,3);s.length&&(t.push("Walichopenda zaidi: "+s.map(u=>`${E(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),i.push("What they liked most: "+s.map(u=>`${E(u.id).en.toLowerCase()} (${Y(u.guests)})`).join("; ")+"."));const r=a.improve.filter(u=>u.id!=="other").slice(0,3);r.length?(t.push("Wanachotaka kiboreshwe: "+r.map(u=>`${E(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),i.push("What they want improved: "+r.map(u=>`${E(u.id).en.toLowerCase()} (${Y(u.guests)})`).join("; ")+".")):(t.push("Hakuna malalamiko yaliyotajwa."),i.push("No complaints were mentioned.")),a.products.length&&(t.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(u=>`${A.find(p=>p.id===u.id).sw} (wageni ${u.guests})`).join("; ")+"."),i.push("Products guests wanted to buy: "+a.products.map(u=>`${A.find(p=>p.id===u.id).en} (${Y(u.guests)})`).join("; ")+"."));const c=Wa(a);if(c){const u=A.find(p=>p.id===c.id);t.push(`Wazo: wageni ${c.guests} kati ya ${a.guests} walitaka ${u.sw}. Unaweza kufikiria kuuza ${u.sw}. Uamuzi ni wako.`),i.push(`Idea: ${c.guests} of ${a.guests} guests wanted ${u.en}. You could consider selling ${u.en}. The decision is yours.`)}return a.unsure>0&&(t.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),i.push(`${a.unsure} ${a.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${a.unsure===1?"it":"them"} with your helper or the guide.`)),a.swahiliEntries>0&&(t.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),i.push(`${Ga(a.swahiliEntries)} in Swahili — ${e} reads ${a.swahiliEntries===1?"it":"them"} directly.`)),{sw:t,en:i}}const xa={sw:{liked:(a,e,t)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${t}`,plain:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${e}`},en:{liked:(a,e,t)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — ${t}`,plain:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${e}`},it:{liked:(a,e,t)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${t}`,plain:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${e}`},fr:{liked:(a,e,t)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${t}`,plain:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${e}`},de:{liked:(a,e,t)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${t}`,plain:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${e}`},zh:{liked:(a,e,t)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${t}`,plain:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${e}`},es:{liked:(a,e,t)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${t}`,plain:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${e}`},pl:{liked:(a,e,t)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${t}`,plain:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${e}`}};function Va(a,e,t="Noor"){const i=xa[a.language]?a.language:"en",l=i!==a.language,s=(a.name||"").trim()||(i==="zh"?"":"friend"),r=e?te.find(u=>u.id===e):null,c=u=>r?xa[u].liked(s,r.msg[u]||r.msg.en,t):xa[u].plain(s,t);return{lang:i,text:c(i),sw:c("sw"),usedFallback:l}}const Ya={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function re(a,e,t="Noor"){const i=[];i.push(`Ripoti ya maoni — ${e}`),i.push(`Feedback report — ${e}`),i.push(""),i.push(`Wageni / Guests: ${a.guests}`);const l=Object.entries(a.languages).map(([r,c])=>`${S[r]?S[r].en:r} ${c}`).join(", ");l&&i.push(`Lugha / Languages: ${l}`),i.push(""),i.push("Walichopenda / Liked:");for(const r of a.liked.filter(c=>c.id!=="other").slice(0,5))i.push(`  • ${E(r.id).en}: ${r.guests}`);i.push("Kuboresha / To improve:");const s=a.improve.filter(r=>r.id!=="other").slice(0,5);s.length||i.push("  • —");for(const r of s)i.push(`  • ${E(r.id).en}: ${r.guests}`);if(a.products.length){i.push("Bidhaa / Product interest:");for(const r of a.products)i.push(`  • ${A.find(c=>c.id===r.id).en}: ${r.guests}`)}return i.push(""),i.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),i.push(`Imeidhinishwa na ${t} kabla ya kutumwa. / Approved by ${t} before sharing.`),i.join(`
`)}function na(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function Ue(a,e,t=new Date){if(e==="all")return!0;const i=new Date(a),l=e==="week"?7:e==="month"?31:3650;return t-i<=l*24*3600*1e3&&i-t<=24*3600*1e3}function Ge(a,e){const t=Object.fromEntries(e.map(m=>[m.id,m])),i=new Set,l={},s={},r={},c={};let u=0,p=0;const w=(m,h,$,M)=>{m[h]||(m[h]={id:h,guestIds:new Set,quotes:[]}),m[h].guestIds.add($),M&&m[h].quotes.push(M)};for(const m of a){i.add(m.guestId),m.lang==="sw"&&p++;for(const h of m.sentences||[]){const $=na(h);$&&u++;const M={entryId:m.id,en:h.en,original:h.original||null,lang:m.lang,flagged:$};h.sentiment==="pos"?w(s,h.topic,m.guestId,M):h.sentiment==="neg"&&w(r,h.topic,m.guestId,M)}for(const h of new Set([...m.products||[],...m.declaredProducts||[]]))w(c,h,m.guestId,null)}for(const m of i){const h=t[m],$=h?h.language:"unknown";l[$]=(l[$]||0)+1}const g=m=>Object.values(m).map(h=>({id:h.id,guests:h.guestIds.size,quotes:h.quotes})).sort((h,$)=>$.guests-h.guests);return{guests:i.size,entries:a.length,liked:g(s),improve:g(r),products:g(c),unsure:u,swahiliEntries:p,languages:l}}function Ve(a,e){const t={};for(const l of a.filter(s=>s.guestId===e))for(const s of l.sentences||[])s.sentiment==="pos"&&s.topic!=="other"&&(t[s.topic]=(t[s.topic]||0)+1);const i=Object.entries(t).sort((l,s)=>s[1]-l[1])[0];return i?i[0]:null}async function de(a,e){const{original:t,lang:i,box:l}=a;if(i==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let s;a.english?s=[{original:null,en:a.english}]:s=(await xe(t,i,e)).pairs;const r=[];for(const m of s)for(const h of Se(m.en))r.push({en:h,original:m.original});const c=s.map(m=>m.en).join(" ").trim();if(!r.length)return{english:c,sentences:[],products:qa(c),status:"analyzed"};const u=r.map(m=>m.en),p=await je(u,e),w=await ze(u,e),g=r.map((m,h)=>{var V,ra,da;const $=Me(l,w[h]),M=[...$.flags];return p[h].topic==="other"&&M.push("topic-unsure"),(V=S[i])!=null&&V.fallback&&!a.english&&M.push("fallback-pack"),{en:m.en,original:m.original,topic:p[h].topic,topicScore:p[h].score,runnerUp:p[h].runnerUp,sentiment:$.sentiment,moodScore:((ra=w[h])==null?void 0:ra.score)??null,modelMood:((da=w[h])==null?void 0:da.label)??null,flags:M,confirmed:!1}});return{english:c,sentences:g,products:qa(c),status:"analyzed"}}let J;async function Oa(){if(J!==void 0)return J;try{const a=await fetch("audio/sw/manifest.json");J=a.ok?await a.json():null}catch{J=null}return J}const ua=a=>a>=1&&a<=20?`g_${a}`:"g_more";function Ye(a){if(!a.guests)return["no_feedback"];const e=["period",ua(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const t=a.liked.filter(s=>s.id!=="other").slice(0,3);if(t.length){e.push("liked_intro");for(const s of t)e.push(`t_${s.id}`,ua(s.guests))}const i=a.improve.filter(s=>s.id!=="other").slice(0,3);if(i.length){e.push("improve_intro");for(const s of i)e.push(`t_${s.id}`,ua(s.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const s of a.products)e.push(`p_${s.id}`,ua(s.guests))}const l=Wa(a);return l&&e.push("idea_intro",`p_${l.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let La=0,Q=null;function Je(){La++,Q&&(Q.pause(),Q=null)}async function ce(a){const e=await Oa();if(!e||!a.every(i=>e.files[i]))return!1;Je();const t=++La;for(const i of a){if(t!==La)break;await new Promise(l=>{const s=new Audio(`audio/sw/${e.files[i]}`);Q=s,s.onended=l,s.onerror=l,s.play().catch(l)})}return Q=null,!0}async function Ze(){const a=await Oa();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}async function Qe(a,e,t,i){t==="sw"&&await ce([a])||i(e,t)}const fa={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'},W=[{icon:fa.book,title:()=>n("Karibu","Welcome"),body:()=>[n("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),n("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:fa.steps,target:'[data-action="go"][data-screen="add"]',title:()=>n("Hatua tatu","Three steps"),list:()=>[n("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),n("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),n("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[n("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:fa.play,target:'[data-action="guide-try"], [data-action="speak"]',title:()=>n("Jaribu sasa","Try it now"),body:()=>[n("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function Xe(a){const e=W[a],t=a===W.length-1,i=W.map((c,u)=>`<span class="${u===a?"on":""}"></span>`).join(""),l=e.list?`<ol class="guide-list">${e.list().map(c=>`<li>${c}</li>`).join("")}</ol>`:"",s=e.body().map(c=>`<p class="lead">${c}</p>`).join(""),r=e.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${n("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${a+1} / ${W.length}">${i}</div>
      <button class="guide-close" data-action="guide-close">${n("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${e.icon}</div>
    <h2 id="guide-title">${e.title()} <button class="say" data-action="say" data-clip="${["ui_who","ui_add","ui_summary"][a]||"ui_help"}" data-sw="${[...e.list?e.list():[],...e.body()].join(" ").replace(/"/g,"&quot;")}" data-en="${[...e.list?e.list():[],...e.body()].join(" ").replace(/"/g,"&quot;")}" aria-label="Sikiliza">${fa.speaker}</button></h2>
    ${l}
    ${s}
    ${r}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${a===0?"disabled":""}>${n("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${n("Endelea","Next")}</button>`}
    </div>
  </div>`}const ue=["en","it","fr","de","zh","es","pl","sw","xx"],Ja={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function me(a){const e=Ja[a]||{...Ja.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},t={};for(const[i,l]of Object.entries(e))t[i]=l.replace(/\{host\}/g,y());return t}function Pa(){for(const a of navigator.languages||[navigator.language||"en"]){const e=String(a).slice(0,2).toLowerCase();if(ue.includes(e))return e}return"en"}const pe={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'},at=pe.visitor;function et(){const a={host:"tile-caramel",visitor:"tile-leaf",company:"tile-sky"},e='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',t={host:"ui_host",visitor:"ui_visitor",company:"ui_company"},i=(l,s,r)=>`
    <div class="home-row">
    <button class="home-btn" data-action="choose-role" data-role="${l}">
      <span class="role-icon ${a[l]}" aria-hidden="true">${pe[l]}</span>
      <span class="role-text"><strong>${s}</strong><span class="small muted">${r}</span></span>
    </button><button class="say" data-action="say" data-clip="${t[l]}" data-sw="${d(s+". "+r)}" data-en="${d(s+". "+r)}" aria-label="Sikiliza">${e}</button></div>`;return`
  <div class="card welcome">
    <h1 style="margin:0">${n("Karibu!","Welcome!")}</h1>
    <p style="margin:4px 0 0">${n("Wageni wanaandika kwa lugha yao. Mwenyeji anasikia kwa lugha yake. Hakuna usajili.","Guests write in their language. The host hears it in hers. No sign-up.")}</p>
  </div>
  <h2>${n("Wewe ni nani?","Who are you?")} <button class="say" data-action="say" data-clip="ui_who" data-sw="Karibu! Wewe ni nani? Chagua: mwenyeji, mgeni, au kampuni ya utalii." data-en="Welcome! Who are you? Choose: host, visitor, or tour company." aria-label="Sikiliza"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg></button></h2>
  <div class="stack" style="margin-top:12px">
    ${i("host",n("Mwenyeji","Host"),n("Ongeza maoni, sikiliza muhtasari, washukuru wageni.","Add feedback, hear the summary, thank guests."))}
    ${i("visitor",n("Mgeni","Visitor"),n("Tafuta mahali, weka nafasi, andika maoni kwa lugha yako.","Find a place, book a visit, leave feedback in your language."))}
    ${i("company",n("Kampuni ya utalii au mwongozaji","Tour company or guide"),n("Tuma ratiba ya wageni kwa SMS.","Send guest bookings by SMS."))}
  </div>
  <p class="small muted" style="margin-top:14px">${n("Unaweza kubadilisha baadaye.","You can switch later.")}</p>`}function tt(a,e,t={}){const i=me(a),l={name:"",liked:"",improve:"",email:"",...t},s=ue.map(r=>`<button class="chip" data-action="visitor-lang" data-lang="${r}" aria-pressed="${r===a}">${d(S[r].native)}</button>`).join("");return e?`
    <div class="card" lang="${a}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${at}</div>
      <h1>${d(i.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${d(i.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${d(i.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${y()} tu: rudi`,`${y()} only: back`)}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${d(i.lang)}">${s}</div>
  <div class="card" lang="${a}">
    <h1>${d(i.title)}</h1>
    <p>${d(i.intro)}</p>
    <div class="stack">
      <label class="field">${d(i.name)}<input type="text" id="v-name" autocomplete="off" value="${d(l.name)}"></label>
      <label class="field">${d(i.liked)}<textarea id="v-liked">${d(l.liked)}</textarea></label>
      <label class="field">${d(i.improve)}<textarea id="v-improve">${d(l.improve)}</textarea></label>
      <fieldset style="border:0;padding:0;margin:0">
        <legend style="font-weight:600;font-size:.95rem;margin-bottom:6px">${d(i.buy)}</legend>
        <div class="row">
          <label class="check"><input type="checkbox" id="v-buy-coffee"> <span>${d(i.coffee)}</span></label>
          <label class="check"><input type="checkbox" id="v-buy-souvenir"> <span>${d(i.souvenir)}</span></label>
        </div>
      </fieldset>
      <label class="field">${d(i.email)}<input type="email" id="v-email" autocomplete="off" value="${d(l.email)}"></label>
      <label class="check"><input type="checkbox" id="v-consent"> <span>${d(i.consent)}</span></label>
      <button class="btn block" data-action="visitor-save">${d(i.save)}</button>
      <p class="small muted" style="margin:0">${d(i.privacy)}</p>
    </div>
  </div>
  <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${y()} tu: rudi`,`${y()} only: back`)}</button>`}function nt({langOptionsHTML:a,today:e,sms:t,report:i}){return`
  <h1>${n("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${n(`Tuma ratiba ya wageni kwa ${y()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${y()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${n(`Namba ya simu ya ${y()}`,`${y()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${n("Tarehe","Date")}<input type="date" id="c-date" value="${e}" data-change="company-preview"></label>
        <label class="field">${n("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${n("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${a}</select></label>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${n(`Mgeni amekubali ${y()} awasiliane naye`,`The guest agreed that ${y()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${n("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${n(`SMS ambayo ${y()} atapokea`,`The SMS ${y()} will get`)}</h2>
    <div class="sms" id="c-sms">${d(t)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${n(`Tuma SMS kwa ${y()}`,`Send SMS to ${y()}`)}</button>
      <button class="btn secondary" data-action="company-save">${n("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${n(`Unachopokea kutoka kwa ${y()}`,`What you get back from ${y()}`)}</h2>
    <p class="small">${n("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.")}</p>
    ${i?`<div class="sms">${d(i)}</div>`:""}
  </div>`}const ka=(a,e)=>e==="sw"?Na(a):le(a);function it(a,e,t=new Date){return e&&e.length?e.filter(i=>new Date(i)>=D(t,-1)).sort():(a.availableOffsets||[]).map(i=>va(D(t,i)))}const st='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',ge='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>';function ot({q:a,hosts:e,lang:t,loading:i}){const l=(a||"").trim().toLowerCase(),s=l?e.filter(c=>[c.name,c.town,...c.tags||[]].join(" ").toLowerCase().includes(l)):e,r=c=>`
    <button class="home-btn" data-action="open-host" data-id="${c.id}">
      <span class="role-icon tile-leaf" aria-hidden="true">${ge}</span>
      <span class="role-text"><strong>${d(c.name)}</strong>
        <span class="small muted">${d(c.town)} · ${(c.tags||[]).slice(0,3).map(d).join(" · ")}</span>
        <span class="small">${n("Lugha","Languages")}: ${c.languages.map(u=>d(x(u,t))).join(", ")}</span></span>
    </button>`;return`
  <h1>${n("Tafuta mahali pa kutembelea","Find a place to visit")}</h1>
  <p class="small muted">${n("Wenyeji wadogo ambao hawana tovuti wala intaneti. Rafiki akikuambia jina la kijiji, tafuta hapa.","Small hosts with no website and no internet. If a friend told you the name of a village, search for it here.")}</p>
  <label class="field search">${st}<input type="search" id="find-q" value="${d(a||"")}" placeholder="${n("Kijiji, jina au shughuli… k.m. Materuni","Village, name or activity… e.g. Materuni")}" autocomplete="off" data-input="find-q"></label>
  ${i?`<p class="muted">${n("Inapakia…","Loading…")}</p>`:""}
  <div class="stack" style="margin-top:12px">
    ${s.length?s.map(r).join(""):`<div class="notice">${n("Hakuna matokeo. Jaribu jina la kijiji.","No results. Try the name of the village.")}</div>`}
  </div>
  <p class="small muted" style="margin-top:14px">${n("Orodha ya mfano (data bandia). Toleo halisi linapata orodha kutoka kwa kampuni ya utalii au ofisi ya utalii.","Example directory (synthetic). The real version gets the list from the tour company or the tourism office.")}</p>
  <div class="row home-links">
    <button class="link-btn" data-action="hand-to-guest">${n("Umeshatembelea? Andika maoni","Already visited? Leave feedback")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
  </div>`}function lt(a,e,t){const i=r=>E(r)[t].split(" (")[0].toLowerCase(),l=e&&e.guests?{guests:e.guests,liked:e.liked.filter(r=>r.id!=="other").slice(0,3).map(r=>r.id),improve:e.improve.filter(r=>r.id!=="other").slice(0,2).map(r=>r.id),products:e.products.map(r=>r.id)}:a.sample;if(!l||!l.guests)return n("Bado hakuna maoni.","No feedback yet.");const s=[n(`Wageni ${l.guests} wametoa maoni.`,`${l.guests} guests left feedback.`)];if(l.liked.length&&s.push(n(`Walipenda: ${l.liked.map(i).join(", ")}.`,`Loved: ${l.liked.map(i).join(", ")}.`)),l.improve.length&&s.push(n(`Kuboresha: ${l.improve.map(i).join(", ")}.`,`To improve: ${l.improve.map(i).join(", ")}.`)),l.products.length){const r=l.products.map(c=>(A.find(u=>u.id===c)||{})[t]||c);s.push(n(`Bidhaa zinazopatikana: ${r.join(", ")}.`,`For sale: ${r.join(", ")}.`))}return s.join(" ")}function rt({host:a,days:e,selected:t,summaryLine:i,form:l,lang:s,knownGuest:r}){const c={guests:2,language:"en",name:"",email:"",consent:!1,referredBy:"",...l},u=e.length?e.map(w=>`<button class="chip" data-action="book-day" data-day="${w}" aria-pressed="${w===t}">${d(ka(w+"T12:00:00",s))}</button>`).join(""):`<span class="muted">${n("Hakuna siku zilizotangazwa bado. Uliza kampuni ya utalii.","No days published yet. Ask the tour company.")}</span>`,p=Object.entries(S).filter(([w])=>w!=="xx"||!0).map(([w,g])=>`<option value="${w}" ${w===c.language?"selected":""}>${d(g[s])}${g.native!==g[s]?` (${d(g.native)})`:""}</option>`).join("");return`
  <button class="btn small secondary" data-action="go" data-screen="find" style="margin-bottom:12px">← ${n("Orodha","Places")}</button>
  <div class="card hero-card">
    <div class="hero-art" aria-hidden="true">${ct}</div>
    <h1 style="margin-top:10px">${d(a.name)}</h1>
    <p class="small muted" style="margin-top:-4px">${d(a.town)} · ${(a.tags||[]).map(d).join(" · ")}</p>
    <p>${d(a.blurb)}</p>
    <div class="row small">
      <span class="chip plain">${n("Lugha","Languages")}: ${a.languages.map(w=>d(x(w,s))).join(", ")}</span>
      <span class="chip plain">${n("Mwongozaji","Guide")}: ${d(a.guide)}</span>
    </div>
    <p class="small muted" style="margin:8px 0 0">${d(a.price)}</p>
  </div>

  <div class="card">
    <h2>${n("Wageni walisema","What guests said")}</h2>
    <p style="margin:0">${d(i)}</p>
    <p class="small muted" style="margin:6px 0 0">${n("Jumla tu, hakuna majina. Imekusanywa kwenye simu ya mwenyeji.","Counts only, no names. Collected on the host’s own phone.")}</p>
  </div>

  <div class="card">
    <h2>${n("Weka nafasi","Book a visit")}</h2>
    <p class="small muted">${n("Mwenyeji anatangaza siku anazoweza kupokea wageni wiki moja mbele. Ombi lako linakwenda kwa kampuni ya utalii; mwenyeji anapata SMS.","The host publishes the days she can take guests a week ahead. Your request goes to the tour company; the host gets an SMS.")}</p>
    <div class="stack">
      <div><div class="field-label">${n("Siku","Day")}</div><div class="row">${u}</div></div>
      <div class="grid2">
        <label class="field">${n("Wageni","Guests")}<input type="number" id="bk-v-guests" min="1" max="12" value="${c.guests}"></label>
        <label class="field">${n("Lugha yenu","Your language")}<select id="bk-v-lang">${p}</select></label>
      </div>
      <label class="field">${n("Jina lako","Your name")}<input type="text" id="bk-v-name" value="${d(c.name)}" autocomplete="off"></label>
      <label class="field">${n("Nani alikuambia kuhusu mahali hapa? (hiari)","Who told you about this place? (optional)")}<input type="text" id="bk-v-ref" value="${d(c.referredBy)}" autocomplete="off" data-input="bk-v-ref"></label>
      ${r?`<div class="notice small">${n(`${d(r.name)} alitembelea hapa (${d(ka(r.visitDate,s))}). Mwenyeji atafurahi kujua.`,`${d(r.name)} visited here (${d(ka(r.visitDate,s))}). The host will be glad to know.`)}</div>`:""}
      <label class="field">${n("Barua pepe (hiari)","Email (optional)")}<input type="email" id="bk-v-email" value="${d(c.email)}" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-v-consent" ${c.consent?"checked":""}> <span>${n("Mwenyeji anaweza kuhifadhi barua pepe yangu na kuniandikia baada ya ziara.","The host may keep my email and write to me after the visit.")}</span></label>
      <button class="btn block" data-action="book-submit" ${t?"":"disabled"}>${n("Tuma ombi","Send the request")}</button>
      <p class="small muted" style="margin:0">${n("Hakuna malipo hapa. Kampuni ya utalii inathibitisha kwa barua pepe au WhatsApp.","No payment here. The tour company confirms by email or WhatsApp.")}</p>
    </div>
  </div>`}function dt({host:a,booking:e,lang:t}){return`
  <div class="card" style="text-align:center;padding:28px 18px">
    <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${ge}</div>
    <h1>${n("Ombi limetumwa","Request sent")}</h1>
    <p class="lead">${n(`${d(a.company)} itathibitisha. ${d(a.name.split("’")[0])} atapata SMS kwenye simu yake.`,`${d(a.company)} will confirm. The host gets an SMS on a basic phone.`)}</p>
    <div class="card flat" style="text-align:left">
      <div class="small muted">${n("Ombi lako","Your request")}</div>
      <p style="margin:6px 0 0"><strong>${d(a.name)}</strong> · ${d(ka(e.date,t))} · ${n("wageni","guests")} ${d(e.guests)} · ${d(x(e.language,t))}</p>
      ${e.referredBy?`<p class="small muted" style="margin:4px 0 0">${n("Alipendekezwa na","Recommended by")}: ${d(e.referredBy)}</p>`:""}
    </div>
    <div class="stack" style="margin-top:12px">
      <button class="btn block" data-action="go" data-screen="find">${n("Tafuta mahali pengine","Find another place")}</button>
      <button class="btn secondary block" data-action="switch-role">${n("Maliza","Done")}</button>
    </div>
  </div>`}const ct=`<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
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
</svg>`,ma=(a,e,t,i=!1)=>`
  <g class="bamboo" style="animation-delay:${t}s" transform="translate(${a} 1600) ${i?"scale(-1 1)":""}">
    <rect x="-9" y="-${e}" width="18" height="${e}" rx="9" fill="#6E9F4E"/>
    ${[...Array(Math.floor(e/110))].map((l,s)=>`<rect x="-11" y="-${(s+1)*110}" width="22" height="7" rx="3" fill="#4F7A3A"/>`).join("")}
    ${[...Array(Math.floor(e/160))].map((l,s)=>`
      <path d="M0 -${120+s*160} q -70 -30 -120 -10 q 60 40 120 10z" fill="#7DAA5A"/>
      <path d="M0 -${180+s*160} q 60 -40 110 -20 q -50 40 -110 20z" fill="#8DB86A"/>`).join("")}
  </g>`,Sa=(a,e,t,i)=>`
  <g class="cloud" style="animation-duration:${i}s" transform="translate(${a} ${e}) scale(${t})" fill="#fff" opacity="0.85">
    <ellipse cx="0" cy="0" rx="90" ry="34"/><ellipse cx="-50" cy="8" rx="50" ry="26"/><ellipse cx="55" cy="6" rx="60" ry="30"/><ellipse cx="10" cy="-18" rx="55" ry="30"/>
  </g>`,pa=(a,e,t)=>`
  <ellipse class="leaf" style="animation-delay:${e}s;animation-duration:${t}s" cx="${a}" cy="-30" rx="14" ry="7" fill="#8DB86A" opacity="0.9"/>`,Za=(a,e,t)=>`
  <path class="bird" style="animation-duration:${e}s;animation-delay:${t}s" d="M-16 ${a} q 8 -10 16 0 q 8 -10 16 0" fill="none" stroke="#3E5E46" stroke-width="3" stroke-linecap="round"/>`,ut=`
<svg viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE7EE"/><stop offset="0.55" stop-color="#EAF2EA"/><stop offset="1" stop-color="#F4EFE3"/></linearGradient>
    <radialGradient id="nsun"><stop offset="0" stop-color="#FFE7A8"/><stop offset="0.5" stop-color="#F8D57E" stop-opacity="0.9"/><stop offset="1" stop-color="#F8D57E" stop-opacity="0"/></radialGradient>
    <linearGradient id="nriver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5FA8C7"/><stop offset="1" stop-color="#8CC6DC"/></linearGradient>
  </defs>
  <rect width="1000" height="1600" fill="url(#nsky)"/>
  <circle class="sun" cx="780" cy="260" r="150" fill="url(#nsun)"/>
  <circle cx="780" cy="260" r="60" fill="#FFD36E"/>
  ${Sa(120,220,1,70)}${Sa(600,140,.7,95)}${Sa(900,330,.55,80)}
  ${Za(0,46,0)}${Za(40,58,18)}
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
  ${ma(40,900,0)}${ma(110,700,1.3)}${ma(960,980,.6,!0)}${ma(890,760,2.1,!0)}
  ${pa(180,0,14)}${pa(520,5,18)}${pa(820,9,16)}${pa(330,12,20)}
</svg>`,$a={mountains:{id:12492499,by:"RD King"},grove:{id:12311788,by:"Anton Lukin"},canopy:{id:6318875,by:"Vanessa Garcia"},cherries:{id:7116757,by:"Matthias Groeneveld"},stream:{id:11902892,by:"Thierry Rossier"},flowers:{id:14482561,by:"Michael Burrows"},dunes:{id:14483416,by:"Dubang chang"},snow:{id:19806018,by:"iPhone Snaps"}},Ba={choose:"mountains",home:"cherries",add:"canopy",summary:"stream",guests:"flowers",week:"mountains",langs:"snow",more:"snow",company:"dunes",find:"grove",host:"grove",booked:"flowers",visitor:"canopy"},mt=a=>`Pexels video ${$a[a].id} by ${$a[a].by}`,pt=()=>Object.entries($a).map(([a,e])=>`${e.by} (${e.id})`).join(", ");let Ia=null,Qa=null;const ja={},gt=()=>matchMedia("(orientation: landscape)").matches&&innerWidth>700,Ca=(a,e)=>`bg/${a}${gt()?"-wide":""}.${e}`;function ht(){const a=navigator.connection&&navigator.connection.saveData;return navigator.onLine&&!a&&!matchMedia("(prefers-reduced-motion: reduce)").matches}function ft(a){const e=document.createElement("div");if(e.className="bg-layer",e.dataset.scene=a,e.innerHTML=`<img class="bg-photo" src="${Ca(a,"jpg")}" alt="">`,ht()){const t=document.createElement("video");t.className="bg-video",t.muted=!0,t.loop=!0,t.playsInline=!0,t.autoplay=!0,t.preload="metadata",t.setAttribute("muted",""),t.setAttribute("playsinline",""),t.src=Ca(a,"mp4"),t.addEventListener("canplay",()=>e.classList.add("video-ready"),{once:!0}),t.addEventListener("error",()=>t.remove(),{once:!0}),e.appendChild(t)}return e}function he(a){if(!Ia||!$a[a]||a===Qa)return;let e=ja[a];e||(e=ft(a),ja[a]=e,Ia.appendChild(e));for(const[t,i]of Object.entries(ja)){const l=t===a;i.classList.toggle("on",l);const s=i.querySelector("video");s&&(l?s.play().catch(()=>{}):s.pause())}Qa=a}function kt(a,e){Ia=a;const t=new Image;t.onload=()=>{a.classList.add("real"),he(e)},t.onerror=()=>{a.innerHTML=ut},t.src=Ca(e,"jpg")}const Z=document.getElementById("view"),P=()=>({step:1,guestId:null,inputs:[],results:[]}),o={screen:"home",role:null,guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:P(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}},hosts:null,find:{q:""},book:{hostId:null,day:null,form:{},done:null},availableDays:[]};async function F(){const[a,e,t,i]=await Promise.all(["guests","entries","bookings","messages"].map(l=>f.all(l)));Object.assign(o,{guests:a,entries:e,bookings:t,messages:i}),o.lastSync=await f.getSetting("lastSync"),o.role=await f.getSetting("role",null),o.availableDays=await f.getSetting("availableDays",[]),Ma(await f.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await f.getSetting("bigText",!1))}async function ia(){try{o.installed=await Ne();for(const a of Object.keys(O))o.shared[a]=await We(O[a].id)}catch(a){console.warn("model check failed",a)}}const sa=a=>o.guests.find(e=>e.id===a),G=()=>sa(o.add.guestId);function R(){return De({guests:o.guests,bookings:o.bookings,installed:o.installed,today:new Date})}function oa(){const a=o.entries.filter(t=>t.status!=="pending"&&Ue(t.visitDate||t.createdAt,o.period)),e=Ge(a,o.guests);return{s:e,entries:a,text:Ke(e,y())}}const H=a=>v()==="sw"?Na(a):le(a),ta=a=>E(a)[v()].split(" (")[0],I=a=>{var e;return`<span class="chip plain lang-pill" title="${d(((e=S[a])==null?void 0:e.native)||a)}">${d(x(a,v()))}</span>`};function yt(a){return a==="pos"?`<span class="chip">${q.pos} ${n("Nzuri","Positive")}</span>`:a==="neg"?`<span class="chip neg">${q.neg} ${n("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${q.unsure} ${n("Haijulikani","Unsure")}</span>`}function wt(a){return a.consent?`<span class="chip">${n("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${n("Hakuna ruhusa","No consent")}</span>`}function $t(a){var e;return(e=S[a])!=null&&e.mt?o.installed.includes(a)?`<span class="chip">${n("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${n("Pakua lugha","Pack needed")}</span>`:""}const fe={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},vt=a=>fe[a][v()==="sw"?0:1];function ke(a){const e=v();return Object.entries(S).map(([t,i])=>`<option value="${t}" ${t===a?"selected":""}>${d(i[e])}${i.native!==i[e]?` (${d(i.native)})`:""}</option>`).join("")}function ye(a){return[...te,Pe].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${d(e[v()])}</option>`).join("")}const C=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${n("Nyumbani","Home")}</button>`,bt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Xa=(a,e,t)=>`<button class="say" data-action="say" data-clip="${a}" data-sw="${d(e)}" data-en="${d(t)}" aria-label="${n("Sikiliza","Listen")}">${bt}</button>`,q={pos:"😊",neg:"😟",unsure:"🤔"};function we(a,e,{open:t=!1}={}){const i=a.sentences[e],l=na(i),s=(i.flags||[]).filter(c=>fe[c]),r=i.original&&a.lang!=="en";return`
  <div class="sent">
    ${r?`<div class="orig" lang="${d(a.lang)}">“${d(i.original)}”</div>`:""}
    ${i.en?`<div class="${r?"small muted":""}">${r?"EN: ":""}${d(i.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${i.topic==="other"?"warn":""}">${d(ta(i.topic))}</span>
      ${yt(i.sentiment)}
      ${l?`<span class="chip warn">${n("Angalia","Check")}</span>`:i.confirmed?`<span class="chip plain">${n("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${l&&s.length?`<div class="small muted" style="margin-top:4px">${s.map(vt).join("; ")}</div>`:""}
    <details ${t||l?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${n("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${n("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${ye(i.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${i.sentiment==="pos"}">${n("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${i.sentiment==="neg"}">${n("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${n("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function xt(a){var t;const e=(t=a.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${d(a.original)}”</div>
    <div class="small muted">${n(`Kiswahili: ${y()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${y()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${n("Mada","Topic")} —</option>${ye(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${n("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${n("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function St(a){var s;const e=sa(a.guestId),t=a.box==="liked"?n("Walipenda","Liked"):a.box==="improve"?n("Kuboresha","Could be better"):n("Maoni","Feedback"),i=a.source==="photo"?n("Picha","Photo"):a.source==="voice"?n("Sauti","Voice"):n("Imeandikwa","Typed");let l;return a.status==="pending"?l=`<p class="muted">${n("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${d(a.lang)}">“${d(a.original)}”</p>`:a.status==="swahili"?l=xt(a):(s=a.sentences)!=null&&s.length?l=a.sentences.map((r,c)=>we(a,c)).join(""):l=`<p lang="${d(a.lang)}">“${d(a.original)}”</p><p class="small muted">${n("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${d((e==null?void 0:e.name)||"Mgeni")}</strong> ${I(a.lang)}</div>
      <div class="small muted">${i} · ${t}</div>
    </div>
    ${l}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${n("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const Ta='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',jt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',zt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Mt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',Lt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',Bt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',It='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function Ct(a){const e=r=>r.filter(c=>c.id!=="other").slice(0,3).map(c=>ta(c.id).toLowerCase()).join(", "),t=e(a.liked),i=e(a.improve),l=[n(`Wageni ${a.guests}.`,`${a.guests} ${a.guests===1?"guest":"guests"}.`)];t&&l.push(n(`Walipenda: ${t}.`,`Loved: ${t}.`)),l.push(i?n(`Kuboresha: ${i}.`,`To improve: ${i}.`):n("Hakuna malalamiko.","No complaints."));const s=Wa(a);return s&&l.push(n(`Wengi wanataka kununua: ${A.find(r=>r.id===s.id).sw}.`,`Many want to buy: ${A.find(r=>r.id===s.id).en}.`)),l.join(" ")}function Tt(){const a=o.entries.filter(g=>g.status==="pending"),{s:e}=oa(),t=o.guests.filter(g=>g.consent&&!o.messages.some(m=>m.guestId===g.id&&m.status==="sent")).length,i=o.bookings.filter(g=>{const m=wa(g.date);return m>=0&&m<=7}),l=R(),s=o.entries.reduce((g,m)=>g+(m.sentences||[]).filter(na).length,0),r=a.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${n(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} new ${a.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
    </div>`:"",c=e.entries?(()=>{let g=0,m=0;for(const h of o.entries)for(const $ of h.sentences||[])$.sentiment==="pos"?g++:$.sentiment==="neg"&&m++;return`<div class="faces"><span>${q.pos} <b>${g}</b></span><span>${q.neg} <b>${m}</b></span>${s?`<span>${q.unsure} <b>${s}</b></span>`:""}</div>`})():"",u=e.entries?`
    <div class="card accent">
      <div class="card-title"><h2>${n("Wageni walisema","What guests said")} ${Xa("ui_summary","Wageni walisema. Bonyeza Sikiliza kusikia muhtasari.","What guests said. Tap Listen to hear the summary.")}</h2><span class="small muted">${Ea[o.period]()}</span></div>
      ${c}
      <p class="big-summary" style="margin:0">${d(Ct(e))}</p>
      ${s?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${n(`Sentensi ${s} zinahitaji kuangaliwa.`,`${s} ${s===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${r}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${zt}${n("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${n("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${n("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${n("Bado hakuna maoni.","No feedback yet.")}</p>
      ${r}
      ${a.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,p=(g,m,h,$,M="",V="",ra="",da="")=>`
    <div class="home-row">
    <button class="home-btn" ${g}>
      <span class="role-icon ${M}" aria-hidden="true">${m}</span>
      <span class="role-text"><strong>${h}</strong><span class="small muted">${$}</span></span>
    </button>${V?Xa(V,ra,da):""}</div>`,w=i.length?n(`Wageni ${i.reduce((g,m)=>g+(Number(m.guests)||1),0)} siku 7 zijazo`,`${i.reduce((g,m)=>g+(Number(m.guests)||1),0)} guests in the next 7 days`)+(l.download.length?` · ${n("pakua","download")} ${l.download.map(g=>x(g,v())).join(", ")}`:""):n("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${u}
  <div class="stack">
    ${p('data-action="go" data-screen="add"',Ta,n("Ongeza maoni ya mgeni","Add guest feedback"),n("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"),"tile-caramel","ui_add","Ongeza maoni ya mgeni. Piga picha ya kitabu, rekodi sauti, au andika.","Add guest feedback: photograph the guestbook, record a voice note, or type.")}
    ${p('data-action="hand-to-guest"',Lt,n("Mpe mgeni simu aandike","Let a guest write"),n("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"),"tile-leaf","ui_hand","Mpe mgeni simu aandike maoni kwa lugha yake.","Hand the phone to a guest to write in their own language.")}
    ${p('data-action="go" data-screen="guests"',Mt,n("Washukuru wageni","Thank guests"),t?n(`Wageni ${t} wanasubiri`,`${t} waiting`):n("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"),"tile-cherry","ui_thank","Washukuru wageni kwa lugha yao.","Thank guests in their own language.")}
    ${p('data-action="go" data-screen="week"',It,n("Wiki ijayo","Next week"),w,"tile-sky","ui_week","Wiki ijayo. Nani anakuja, na lugha gani.","Next week: who is coming, and which language.")}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${n("Zaidi","More")}</button>
  </div>`}function Et(){const e=o.bookings.filter(s=>wa(s.date)>=0).sort((s,r)=>new Date(s.date)-new Date(r.date)).filter(s=>wa(s.date)<=7),t=R(),i=s=>`
    <li>
      <div class="row between">
        <strong>${d(H(s.date))}</strong>
        <span class="badge-num" title="guests">${d(s.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${I(s.language)} ${$t(s.language)}
        ${s.status==="requested"?`<span class="chip warn">${n("Inasubiri kampuni","Awaiting the company")}</span>`:""}
        ${s.guide?`<span class="muted">${n("Mwongozaji","Guide")}: ${d(s.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${d(s.leadName||"")}${s.company?` · ${d(s.company)}`:""}${s.referredBy?` · ${n("alipendekezwa na","recommended by")} ${d(s.referredBy)}`:""}</div>
    </li>`,l=[...Array(14)].map((s,r)=>{const c=va(D(new Date,r+1)),u=o.availableDays.includes(c);return`<button class="chip" data-action="toggle-day" data-day="${c}" aria-pressed="${u}">${d(H(c+"T12:00:00"))}</button>`}).join("");return`
  ${C()}
  <h1>${n("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <h2>${n("Siku unazoweza kupokea wageni","Days you can take guests")}</h2>
    <p class="small muted">${n("Wageni wanaziona wanapotafuta mahali, na kampuni ya utalii inapanga kulingana nazo.","Visitors see these when they search for a place, and the tour company books around them.")}</p>
    <div class="row">${l}</div>
  </div>

  <div class="card">
    <button class="btn block" data-action="sync" ${o.online?"":"disabled"}>${n("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${o.lastSync?`${n("Mara ya mwisho","Last updated")}: ${d(new Date(o.lastSync).toLocaleString())}`:n("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${o.online?"":` · ${n("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${e.length?`
  <div class="card">
    <h2>${n("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${e.map(i).join("")}</ul>
  </div>`:`
  <div class="notice">${n("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${n("Lugha za kuandaa","Languages to prepare")}</h2>
    ${t.download.length?`
      <div class="row">${t.download.map(s=>I(s)).join("")}</div>
      <p class="small muted">${n(`MB ${t.downloadMB}. Tumia Wi-Fi.`,`${t.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${o.online?"":"disabled"}>${n("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${n("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${t.removable.length?`
      <hr>
      <p>${n("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${t.removable.map(s=>I(s)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${n(`Futa (MB ${t.freeMB})`,`Delete (frees ${t.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${n("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  `}function At(){const a=o.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${a.step>=t?"on":""}"></span>`).join("")}</div>`;return a.step===1?C()+e+$e():a.step===2?C()+e+Dt():e+Nt()}function $e(){const a=o.bookings.filter(t=>{const i=wa(t.date);return i<=1&&i>=-14}).filter(t=>!o.guests.some(i=>i.bookingId===t.id)).sort((t,i)=>new Date(i.date)-new Date(t.date)),e=o.guests.slice().sort((t,i)=>new Date(i.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${n("Mgeni ni nani?","Who is the guest?")}</h1>

  ${a.length?`
  <div class="card">
    <h2>${n("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${d(t.leadName||"Mgeni")}</strong> ${I(t.language)}<div class="small muted">${d(H(t.date))} · ${n("wageni","guests")} ${d(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${n("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${n("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${ke("en")}</select></label>
      <label class="field">${n("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${va(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${n(`Mgeni aliweka alama: ${y()} anaweza kuhifadhi mawasiliano yangu`,`Guest ticked: ${y()} may keep my contact details`)}</span></label>
      <div id="contact-fields" class="stack hidden">
        <label class="field">${n("Barua pepe","Email")}<input type="email" id="ng-email" autocomplete="off"></label>
        <label class="field">${n("Simu / WhatsApp","Phone / WhatsApp")}<input type="tel" id="ng-phone" autocomplete="off"></label>
      </div>
      <label class="field">${n("Nani alikupendekezea? (hiari)","Who recommended us? (optional)")}<input type="text" id="ng-ref" autocomplete="off"></label>
      <button class="btn" data-action="save-new-guest">${n("Endelea","Continue")}</button>
    </div>
  </div>

  ${e.length?`
  <div class="card">
    <h2>${n("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${d(t.name)}</strong> ${I(t.language)}<div class="small muted">${d(H(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function Dt(){var s;const a=G();if(!a)return o.add.step=1,$e();const e=((s=S[a.language])==null?void 0:s.mt)&&!o.installed.includes(a.language),t=o.add.inputs.some(r=>r.status==="ready"&&(r.text||"").trim()),i=o.add.inputs.some(r=>r.status==="working"),l=r=>{var m;const c=`
      <select data-change="box" data-id="${r.id}" aria-label="Box">
        <option value="liked" ${r.box==="liked"?"selected":""}>${n("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${r.box==="improve"?"selected":""}>${n("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${r.box==="unknown"?"selected":""}>${n("Haijulikani","Not sure")}</option>
      </select>`,u=r.langHint?`
      <div class="notice warn small">${n(`Inaonekana ni ${x(r.langHint,"sw")}, si ${x(a.language,"sw")}.`,`This looks like ${x(r.langHint,"en")}, not ${x(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${r.langHint}">${n(`Badilisha kuwa ${x(r.langHint,"sw")}`,`Switch to ${x(r.langHint,"en")}`)}</button></div>
      </div>`:"";let p="";r.imageURL&&(p=`<img class="preview-img" src="${r.imageURL}" alt="Photo of the guestbook box">`),r.audioURL&&(p=`<audio controls src="${r.audioURL}" style="width:100%"></audio>`);let w="";return r.status==="working"?w=`<p class="muted">${n("Inasoma…","Reading…")}</p>`:r.status==="error"?w=`<div class="notice neg small">${n("Imeshindwa","Failed")}: ${d(r.error)}</div>`:w=`
        ${(m=r.lowWords)!=null&&m.length?`<div class="notice warn small"><strong>${n("Angalia maneno haya","Check these words")}</strong>${r.lowWords.slice(0,20).map(h=>`<mark class="low">${d(h)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${r.source==="voice"?n("Alichosema mgeni","What the guest said"):n("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${r.id}" lang="${d(a.language)}">${d(r.text)}</textarea></label>
        ${r.source==="voice"&&a.language!=="en"&&a.language!=="sw"?`
        <label class="field small">${n("Kwa Kiingereza (kutoka kwa modeli ya sauti)","In English (from the voice model)")}
          <textarea data-input="input-english" data-id="${r.id}" style="min-height:80px">${d(r.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${r.source==="photo"?n("Picha","Photo"):r.source==="voice"?n("Sauti","Voice"):n("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${r.id}">${n("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${p}
        <label class="field small">${n("Kisanduku","Which box")}${c}</label>
        ${u}
        ${w}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${d(a.name)}</strong> ${I(a.language)}<div class="small muted">${d(H(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${n("Badilisha","Change")}</button>
    </div>
  </div>

  ${e?`<div class="notice warn">${n(`Lugha ya ${x(a.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${ya}).`,`The ${x(a.language,"en")} pack is not on this phone yet. Analysing needs internet once (${ya} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${Ta}<span class="btn-col">${n("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${Ta}<span class="btn-col">${n("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${o.recording?"danger":"secondary"}" data-action="record">
      ${o.recording?'<span class="rec-dot"></span>':jt}<span class="btn-col">${o.recording?n("Simamisha","Stop"):n("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${Bt}<span class="btn-col">${n("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${n("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${o.add.inputs.map(l).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!i?"":"disabled"}>${n("Changanua","Analyse")}</button>`}function Nt(){const a=o.add.results.map(i=>o.entries.find(l=>l.id===i)).filter(Boolean),e=G(),t=a.reduce((i,l)=>i+(l.sentences||[]).filter(na).length,0);return`
  <h1>${n("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${n(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} ${t===1?"sentence needs":"sentences need"} a check`)}</strong>${n("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${n("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(St).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${n("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${n(`Ongeza maoni mengine ya ${d((e==null?void 0:e.name)||"mgeni")}`,`Add more for ${d((e==null?void 0:e.name)||"this guest")}`)}</button>
  </div>`}const Ea={week:()=>n("Wiki hii","This week"),month:()=>n("Mwezi huu","This month"),all:()=>n("Zote","All time")};function Wt(){const a=o.entries.filter(p=>p.status==="pending"),{s:e,entries:t,text:i}=oa(),l=Object.entries(Ea).map(([p,w])=>`<button class="chip" data-action="period" data-period="${p}" aria-pressed="${o.period===p}">${w()}</button>`).join(""),s=(p,w)=>p.filter(g=>g.id!=="other").map(g=>{const m=e.guests?Math.round(g.guests/e.guests*100):0,h=g.quotes.slice(0,5).map($=>`
      <blockquote class="q">${$.original&&$.lang!=="en"?`<div class="orig" lang="${d($.lang)}">“${d($.original)}”</div><div class="trans">EN: ${d($.en)}</div>`:`<div class="orig">“${d($.en)}”</div>`}
      ${$.flagged?`<span class="chip warn" style="margin-top:4px">${n("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${d(ta(g.id))}</strong><span class="badge-num ${w?"neg":""}">${g.guests}</span></div>
        <div class="bar ${w?"neg":""}"><span style="width:${m}%"></span></div>
        <details class="quotes"><summary>${n("Maneno ya wageni","What guests said")} (${g.quotes.length})</summary>${h}</details>
      </div>`}).join(""),r=[];for(const p of t)(p.sentences||[]).forEach((w,g)=>{na(w)&&r.push([p,g])});const c=re(e,`${Ea[o.period]()}`,y()),u=v();return`
  ${C()}
  <h1>${n("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${l}</div>

  ${a.length?`
  <div class="notice warn">
    <strong>${n(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} ${a.length===1?"entry":"entries"} not analysed yet`)}</strong>
    <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
  </div>`:""}

  ${e.entries===0?a.length?"":`
  <div class="card">
    <p>${n("Bado hakuna maoni kwa kipindi hiki.","No feedback for this period yet.")}</p>
    <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button>
  </div>`:`
  <div class="card">
    <div class="card-title"><h2>${n(`Kwa ${y()}`,`For ${y()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${n("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${u}">${i[u].map(p=>`<p>${d(p)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${n("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${e.liked.filter(p=>p.id!=="other").length?`<div class="card"><h2>${n("Walichopenda","What they liked")}</h2>${s(e.liked,!1)}</div>`:""}
  ${e.improve.filter(p=>p.id!=="other").length?`<div class="card"><h2>${n("Wanachotaka kiboreshwe","What they want improved")}</h2>${s(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${n("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(p=>{const w=A.find(g=>g.id===p.id);return`<div class="topic-row"><strong>${d(w[u])}</strong><span class="badge-num">${p.guests}</span></div>`}).join("")}
  </div>`:""}

  ${r.length?`
  <div class="card">
    <h2>${n("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${r.map(([p,w])=>{var g;return`<div class="small muted" style="margin-top:8px">${d(((g=sa(p.guestId))==null?void 0:g.name)||"")} · ${d(x(p.lang,u))}</div>${we(p,w,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${n("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${n("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${d(c)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${o.shareOk?"checked":""}>
      <span>${n("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${o.shareOk?"":"disabled"}>${n("Shiriki","Share")}</button>
  </div>`}
  `}function Ot(){const a=o.guests.slice().sort((e,t)=>new Date(t.visitDate)-new Date(e.visitDate));return a.length?`
  ${C()}
  <h1>${n("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${n("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const t=o.entries.filter(s=>s.guestId===e.id).length,i=o.messages.some(s=>s.guestId===e.id&&s.status==="sent"),l=o.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${d(e.name)}</strong> ${I(e.language)}${e.synthetic?` <span class="chip plain">${n("mfano","example")}</span>`:""}</div>
          <span class="small muted">${d(H(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${wt(e)} <span class="muted">${n("maoni","entries")}: ${t}</span>
          ${i?`<span class="chip">${n("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${n("Alipendekezwa na","Recommended by")}: ${d(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${l?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${n("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${n("Futa","Delete")}</button>
        </div>
        ${l?Pt(e):""}
      </li>`}).join("")}</ul></div>`:`${C()}<h1>${n("Wageni","Guests")}</h1>
      <div class="card"><p>${n("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button></div>`}function Pt(a){const e=Ve(o.entries,a.id),t=Va(a,e,y()),i=a.contact||{},l=Ya[t.lang]||Ya.en;let s;a.consent?i.email?s=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(i.email)}?subject=${encodeURIComponent(l)}&body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:i.phone?s=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(i.phone)}?body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:s=`<div class="notice small">${n("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:s=`<div class="notice warn small">${n("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const r=v();return`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${n(`Hakuna kiolezo cha ${x(a.language,"sw")} bado; tumetumia Kiingereza.`,`No ${x(a.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${n(`Kwa ${x(t.lang,"sw")}`,`In ${x(t.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${d(t.text)}</p></div>
    ${t.lang!==r?`<div class="card flat" lang="${r}"><div class="small muted">${n("Maana yake","What it says")}</div><p style="margin:6px 0 0">${d(r==="sw"?t.sw:Va({...a,language:"en"},e,y()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${e?n(`Mada aliyopenda: ${ta(e)}`,`Liked topic: ${ta(e)}`):n("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${s}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${n("Nakili","Copy")}</button>
  </div>`}function Rt(){const a=R(),e=v(),t=l=>{const s=S[l],r=o.installed.includes(l),c=[];return r&&c.push(`<span class="chip">${n("Imepakuliwa","On phone")}</span>`),a.keep.includes(l)&&c.push(`<span class="chip">${n("Inakaa daima","Kept")}</span>`),a.needed.includes(l)&&c.push(`<span class="chip warn">${n("Wiki ijayo","Needed next week")}</span>`),r&&a.removable.includes(l)&&c.push(`<span class="chip plain">${n("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${d(s[e])}</strong> <span class="muted small">${d(s.native)} · ${ya} MB</span>
          <div class="row" style="margin-top:4px">${c.join("")}</div></div>
        ${r?`<button class="btn small danger" data-action="delete-pack" data-lang="${l}">${n("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${l}" ${o.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`},i=l=>{const s=O[l],r=o.shared[l];return`
      <div class="pack">
        <div><strong>${d(s[e])}</strong> <span class="muted small">${s.mb} MB</span></div>
        ${r?`<span class="chip">${n("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${l}" ${o.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`};return`
  ${C()}
  <h1>${n("Lugha","Languages")}</h1>
  <p class="small muted">${n(`Kiswahili na Kiingereza daima, pamoja na lugha ${Ka} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Ka} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${n("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${n("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(O).map(i).join("")}
  </div>

  <div class="card">
    <h2>${n("Lugha za wageni","Guest languages")}</h2>
    ${a.usedDefaults?`<p class="small muted">${n("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${a.recommend.length?`
      <div class="notice small" style="margin-top:4px">${n(`Pakua ukiwa na Wi-Fi: ${a.recommend.map(l=>S[l].sw).join(", ")} (MB ${a.recommendMB}).`,`Download on Wi-Fi: ${a.recommend.map(l=>S[l].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${o.online?"":"disabled"}>${n("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${Oe().map(t).join("")}
  </div>`}function Ht(){const a=o.guests.some(e=>e.synthetic);return`
  ${C()}
  <h1>${n("Zaidi","More")}</h1>

  <div class="card">
    <h2>${n("Mwenyeji","Host")}</h2>
    <label class="field">${n("Jina lako (linaonekana kwa wageni na kwenye ujumbe)","Your name (shown to guests and in messages)")}
      <input type="text" id="host-name" value="${d(y())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${n("Hifadhi jina","Save name")}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?n("Herufi za kawaida","Normal text size"):n("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${n("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(y())}" target="_blank" rel="noopener">${n("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
    </div>
  </div>

  <div class="card">
    <h2>${n("Data ya mfano","Example data")}</h2>
    <p class="small muted">${n("Wageni 6 wa kubuni na maoni kwa lugha 5. Si watu halisi.","6 invented guests with feedback in 5 languages. Not real people.")}</p>
    ${a?`<button class="btn danger" data-action="remove-demo">${n("Ondoa data ya mfano","Remove example data")}</button>`:`<button class="btn secondary" data-action="load-demo">${n("Pakia data ya mfano","Load example data")}</button>`}
  </div>

  <div class="card">
    <h2>${n("Faragha","Privacy")}</h2>
    <ul class="small" style="padding-left:18px;margin:0">
      <li>${n("Data yote iko kwenye simu hii tu.","All data stays on this phone.")}</li>
      <li>${n("Mawasiliano ya mgeni yanahifadhiwa tu kwa ruhusa yake.","Guest contact details are kept only with their consent.")}</li>
      <li>${n("Ripoti kwa kampuni haina majina wala maneno ya wageni.","The company report has no names or quotes.")}</li>
    </ul>
    <button class="btn danger block" style="margin-top:12px" data-action="wipe">${n("Futa data zote","Delete all data")}</button>
  </div>

  <div class="card">
    <h2>${n("Kuhusu","About")}</h2>
    <p class="small">${n("Imejengwa kwa Hack-Nation × World Bank Small AI for Development (utalii).","Built for the Hack-Nation × World Bank Small AI for Development hackathon (tourism).")}</p>
    <p class="small muted">${n("Video za mandhari: Pexels (leseni ya bure)","Background videos: Pexels, free licence")} — ${d(pt())}.</p>
    <div class="stack">
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${n("Msimbo, vyanzo vya data na mipaka","Code, data sources and limits")}</a>
    </div>
  </div>`}function Aa(){var i;const a=l=>{var s,r;return((r=(s=document.getElementById(l))==null?void 0:s.value)==null?void 0:r.trim())||""},e=!!((i=document.getElementById("c-consent"))!=null&&i.checked),t=a("c-date");return{id:z("bk"),date:T(t||D(new Date,3)),guests:Math.max(1,Number(a("c-guests"))||1),leadName:a("c-name")||"Mgeni",language:a("c-lang")||"en",guide:a("c-guide"),company:"",consent:e,email:e?a("c-email"):""}}function Ft(){const a=o.bookings.filter(i=>i.status==="requested").sort((i,l)=>new Date(i.date)-new Date(l.date)),e=o.bookings.filter(i=>i.status==="confirmed"&&i.source==="visitor").slice(-3);if(!a.length&&!e.length)return"";const t=i=>`
    <li>
      <div class="row between"><strong>${d(i.leadName)}</strong><span class="badge-num">${d(i.guests)}</span></div>
      <div class="row small" style="margin-top:6px">${d(H(i.date))} ${I(i.language)}${i.referredBy?`<span class="muted">${n("alipendekezwa na","recommended by")} ${d(i.referredBy)}</span>`:""}${i.consent&&i.email?`<span class="muted">${d(i.email)}</span>`:""}</div>
      ${i.status==="requested"?`<button class="btn small block" style="margin-top:8px" data-action="company-confirm" data-id="${i.id}">${n(`Thibitisha na tuma SMS kwa ${y()}`,`Confirm and send the SMS to ${y()}`)}</button>`:`<div class="sms small" style="margin-top:8px">${d(ea(i))}</div><a class="btn small secondary block" style="margin-top:6px" href="sms:?body=${encodeURIComponent(ea(i))}">${n("Fungua kwenye programu ya SMS","Open in the SMS app")}</a>`}
    </li>`;return`
  <div class="card">
    <h2>${n("Maombi mapya kutoka kwa wageni","New requests from visitors")}</h2>
    <p class="small muted">${n("Yametumwa kutoka ukurasa wa “Tafuta mahali”. Ukithibitisha, mwenyeji anapata SMS; haitaji intaneti.","Sent from the “Find a place” page. When you confirm, the host gets an SMS; no internet needed on her side.")}</p>
    <ul class="list">${[...a,...e].map(t).join("")}</ul>
  </div>`}function _t(){const a=va(D(new Date,3)),{s:e}=oa(),t=e.entries?re(e,n("Mfano","Example"),y()):null;return(o.role==="company"?`<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${n("Badilisha upande","Switch side")}</button>`:C())+Ft()+nt({langOptionsHTML:ke("en"),today:a,sms:ea({date:T(a),guests:2,language:"en",guide:""}),report:t})}async function qt(){if(o.hosts)return o.hosts;try{const a=await fetch("data/hosts.json");o.hosts=(await a.json()).hosts}catch{o.hosts=[]}return o.hosts}const Ra=a=>(o.hosts||[]).find(e=>e.id===a);function Ha(){return o.hosts||qt().then(k),ot({q:o.find.q,hosts:o.hosts||[],lang:v(),loading:!o.hosts})}function Kt(){const a=Ra(o.book.hostId);if(!a)return o.screen="find",Ha();const e=a.id==="noor"?oa().s:null,t=it(a,a.id==="noor"?o.availableDays:null),i=(o.book.form.referredBy||"").trim().toLowerCase(),l=i&&a.id==="noor"?o.guests.find(s=>(s.name||"").toLowerCase().split(" ")[0]===i.split(" ")[0]):null;return rt({host:a,days:t,selected:o.book.day,summaryLine:lt(a,e,v()),form:o.book.form,lang:v(),knownGuest:l})}function Ut(){const a=Ra(o.book.hostId);return!a||!o.book.done?(o.screen="find",Ha()):dt({host:a,booking:o.book.done,lang:v()})}function Fa(){var e;const a=t=>{var i;return((i=document.getElementById(t))==null?void 0:i.value)||""};document.getElementById("bk-v-name")&&(o.book.form={guests:Number(a("bk-v-guests"))||2,language:a("bk-v-lang")||"en",name:a("bk-v-name"),email:a("bk-v-email"),consent:!!((e=document.getElementById("bk-v-consent"))!=null&&e.checked),referredBy:a("bk-v-ref")})}async function Gt(){Fa();const a=Ra(o.book.hostId),e=o.book.form;if(!o.book.day)return b(n("Chagua siku","Pick a day"));if(!e.name.trim())return b(n("Andika jina lako","Add your name"));const t={id:z("bk"),date:T(o.book.day),guests:Math.max(1,e.guests),leadName:e.name.trim(),language:e.language,guide:a.guide,company:a.company,consent:e.consent,email:e.consent?e.email.trim():"",referredBy:e.referredBy.trim(),hostId:a.id,status:"requested",source:"visitor",createdAt:new Date().toISOString()};await f.put("bookings",t),o.bookings.push(t),o.book.done=t,j("booked")}function Vt(){const a=e=>{var t;return((t=document.getElementById(e))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(o.visitor.draft={name:a("v-name"),liked:a("v-liked"),improve:a("v-improve"),email:a("v-email")})}async function Yt(){var p,w,g;const a=m=>{var h,$;return(($=(h=document.getElementById(m))==null?void 0:h.value)==null?void 0:$.trim())||""},e=o.visitor.lang,t=me(e),i=a("v-liked"),l=a("v-improve");if(!i&&!l){b(t.needText);return}const s=!!((p=document.getElementById("v-consent"))!=null&&p.checked),r=[(w=document.getElementById("v-buy-coffee"))!=null&&w.checked?"coffee":null,(g=document.getElementById("v-buy-souvenir"))!=null&&g.checked?"souvenir":null].filter(Boolean),c={id:z("g"),name:a("v-name")||"Mgeni",language:e,visitDate:T(new Date),consent:s,contact:s?{email:a("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await f.put("guests",c);let u=!0;for(const[m,h]of[["liked",i],["improve",l]])h&&(await f.put("entries",{id:z("fb"),guestId:c.id,lang:e,source:"visitor",box:m,original:h,status:"pending",sentences:[],products:[],declaredProducts:u?r:[],visitDate:c.visitDate,createdAt:new Date().toISOString()}),u=!1);await F(),o.visitor={lang:e,saved:!0,draft:{}},k(),window.scrollTo(0,0)}let L=null,B=null;function _a(){var e;if(L||(L=document.createElement("div"),L.className="guide-backdrop hidden",L.setAttribute("role","dialog"),L.setAttribute("aria-modal","true"),L.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(L),B=document.createElement("div"),B.className="spot hidden",B.innerHTML='<span class="spot-hand">👆</span>',document.body.appendChild(B)),L.classList.toggle("hidden",!o.guide.open),!o.guide.open){L.innerHTML="",B.classList.add("hidden");return}L.innerHTML=Xe(o.guide.step),(e=L.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||e.focus();const a=W[o.guide.step].target&&document.querySelector(W[o.guide.step].target);a?(a.scrollIntoView({block:"start",behavior:"smooth"}),setTimeout(()=>{const t=a.getBoundingClientRect();B.style.left=`${t.left-6}px`,B.style.top=`${t.top-6}px`,B.style.width=`${t.width+12}px`,B.style.height=`${t.height+12}px`,B.classList.remove("hidden")},350)):B.classList.add("hidden")}function X(a=0){o.guide={open:!0,step:a},_a()}async function ba(){o.guide.open=!1,_a(),await f.setSetting("guideSeen",!0)}async function Jt(){await ba();const a="demo_quick";if(!sa(a)){const e={id:a,name:"Emma (mfano)",language:"en",visitDate:T(D(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",e);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const i of["liked","improve"])await f.put("entries",{id:`${a}_${i}`,guestId:a,lang:"en",source:"typed",box:i,original:t[i],status:"pending",sentences:[],products:[],visitDate:e.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await F()}o.period="all",o.screen="home",k(),await be()}const Zt={choose:et,home:Tt,add:At,summary:Wt,guests:Ot,week:Et,langs:Rt,more:Ht,company:_t,find:Ha,host:Kt,booked:Ut,visitor:()=>tt(o.visitor.lang,o.visitor.saved,o.visitor.draft)};let ae=null;function k(){const a=o.screen;document.body.classList.toggle("mode-visitor",a==="visitor"||a==="choose"),document.body.classList.toggle("mode-choose",a==="choose"),document.body.classList.toggle("home",a==="home");const e=a!==ae;ae=a,he(Ba[a]||"grove"),Z.innerHTML=Zt[a]()+(document.getElementById("nature").classList.contains("real")?`<div class="credit">${d(mt(Ba[a]||"grove"))}</div>`:""),Z.classList.remove("enter"),e&&(Z.offsetWidth,Z.classList.add("enter")),document.getElementById("net").textContent=o.online?n("Mtandaoni","Online"):n("Nje ya mtandao","Offline");const t=document.getElementById("lang-btn");t&&(t.textContent=v()==="sw"?"English":"Kiswahili"),o.guide.open&&_a(),a==="langs"&&Ce().then(i=>{const l=document.getElementById("storage-line");l&&i&&(l.textContent=n(`Nafasi iliyotumika: MB ${i.usedMB} kati ya MB ${i.quotaMB}`,`Storage used: ${i.usedMB} MB of ${i.quotaMB} MB`))})}function j(a){o.screen=a,a!=="add"&&(o.add=P()),k(),window.scrollTo(0,0)}async function la(a){if(!a.length)return!0;const e=a.reduce((i,[l,s])=>i+(l==="pack"?ya:O[s].mb),0);if(!navigator.onLine)return b(n("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const t=a.map(([i,l])=>i==="pack"?x(l,v()):O[l][v()]).join(", ");if(!confirm(n(`Pakua mara moja: takriban MB ${e} (${t}). Endelea?`,`One-time download of about ${e} MB (${t}). Continue?`)))return!1;for(const[i,l]of a)U(n("Inapakua","Downloading")+` · ${i==="pack"?x(l,v()):O[l][v()]}`),i==="pack"?await Te(l,K):await Ee(l,K);return N(),await ia(),!0}async function za(a){const e=a.filter(t=>{var i;return((i=S[t])==null?void 0:i.mt)&&!o.installed.includes(t)}).map(t=>["pack",t]);await la(e)&&(b(n("Lugha ziko tayari","Packs ready")),k())}async function ee(a){if(!a.length)return;const e=a.map(t=>x(t,v())).join(", ");if(confirm(n(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${e}? They can be downloaded again later.`))){for(const t of a)await Ae(S[t].mt);await ia(),b(n("Imefutwa","Deleted")),k()}}async function Qt(){if(!navigator.onLine)return b(n("Hakuna mtandao","Offline"));U(n("Inapokea ratiba","Receiving the schedule"));const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,i=e.bookings.map(s=>({id:s.id,date:T(D(t,s.dayOffset)),guests:s.guests,leadName:s.leadName,language:s.language,guide:s.guide,company:e.company,consent:!!s.consent,email:s.consent&&s.email||"",synthetic:!0}));await f.putMany("bookings",i),o.bookings=await f.all("bookings"),o.lastSync=new Date().toISOString(),await f.setSetting("lastSync",o.lastSync),N();const l=R();b(l.download.length?n(`Ratiba imepokelewa. Pakua: ${l.download.map(s=>S[s].sw).join(", ")}`,`Schedule received. Download: ${l.download.map(s=>S[s].en).join(", ")}`):n("Ratiba imepokelewa","Schedule received")),k()}async function Xt(){const a=l=>{var s,r;return((r=(s=document.getElementById(l))==null?void 0:s.value)==null?void 0:r.trim())||""},e=a("bk-date");if(!e)return b(n("Weka tarehe","Add a date"));const t=document.getElementById("bk-consent").checked,i={id:z("bk"),date:T(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:t,email:t?a("bk-email"):""};await f.put("bookings",i),o.bookings.push(i),b(n("Imehifadhiwa","Saved")),k()}async function an(a){const e=o.bookings.find(i=>i.id===a);if(!e)return;let t=o.guests.find(i=>i.bookingId===e.id);t||(t={id:z("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await f.put("guests",t),o.guests.push(t)),o.add=P(),o.add.guestId=t.id,o.add.step=2,k()}async function en(){const a=i=>{var l,s;return((s=(l=document.getElementById(i))==null?void 0:l.value)==null?void 0:s.trim())||""},e=document.getElementById("ng-consent").checked,t={id:z("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:T(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await f.put("guests",t),o.guests.push(t),o.add=P(),o.add.guestId=t.id,o.add.step=2,k(),window.scrollTo(0,0)}async function tn(a,e){const t=G(),i={id:z("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};o.add.inputs.push(i),k();try{U(n("Inasoma picha","Reading the photo"));const l=await Be(a,t.language,K);Object.assign(i,{text:l.text,lowWords:l.lowWords,confidence:l.confidence,status:"ready"}),l.text||(i.status="error",i.error=n("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const s=await Ie(l.text);s&&s!==t.language&&(i.langHint=s)}catch(l){i.status="error",i.error=l.message}finally{N(),k()}}async function ve(a){const e=G();if(!o.shared.voice&&!await la([["shared","voice"]]))return;const t={id:z("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};o.add.inputs.push(t),k();try{U(n("Inasikiliza","Listening"));const i=await Le(a,e.language,K);Object.assign(t,{text:i.original,english:i.english,status:"ready"}),o.shared.voice=!0}catch(i){t.status="error",t.error=i.message}finally{N(),k()}}let ga=null;async function nn(){var i;if(ga){ga.stop();return}if(!((i=navigator.mediaDevices)!=null&&i.getUserMedia)||!window.MediaRecorder){b(n("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],t=new MediaRecorder(a);t.ondataavailable=l=>{l.data.size&&e.push(l.data)},t.onstop=()=>{a.getTracks().forEach(s=>s.stop()),ga=null,o.recording=!1;const l=new Blob(e,{type:t.mimeType||"audio/webm"});k(),ve(l).catch(s=>b(s.message))},t.start(),ga=t,o.recording=!0,k()}async function sn(){var l;const a=G(),e=o.add.inputs.filter(s=>s.status==="ready"&&(s.text||"").trim());if(!e.length)return;const t=[];if(a.language!=="sw"){o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]);const s=e.some(r=>!(r.source==="voice"&&r.english));(l=S[a.language])!=null&&l.mt&&s&&!o.installed.includes(a.language)&&t.push(["pack",a.language])}if(!await la(t))return;const i=[];for(const[s,r]of e.entries()){U(`${n("Inachanganua","Analysing")} ${s+1}/${e.length}`);const c=r.source==="voice"&&a.language!=="en"&&a.language!=="sw"?r.english:void 0,u=await de({original:r.text.trim(),lang:a.language,box:r.box,english:c},K),p={id:z("fb"),guestId:a.id,lang:a.language,source:r.source,box:r.box,original:r.text.trim(),...u,lowWords:r.lowWords||[],ocrConfidence:r.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await f.put("entries",p),o.entries.push(p),i.push(p.id)}N();for(const s of o.add.inputs)s.imageURL&&URL.revokeObjectURL(s.imageURL),s.audioURL&&URL.revokeObjectURL(s.audioURL);o.add.inputs=[],o.add.results=i,o.add.step=3,await ia(),k(),window.scrollTo(0,0)}async function be(){var i;const a=o.entries.filter(l=>l.status==="pending"),e=[...new Set(a.map(l=>l.lang))],t=[];e.some(l=>l!=="sw")&&(o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]));for(const l of e)(i=S[l])!=null&&i.mt&&!o.installed.includes(l)&&t.push(["pack",l]);if(await la(t)){for(const[l,s]of a.entries()){U(`${n("Inachanganua","Analysing")} ${l+1}/${a.length}`);const r=await de({original:s.original,lang:s.lang,box:s.box},K);Object.assign(s,r),await f.put("entries",s)}N(),await ia(),b(`✓ ${n("Imekamilika","Done")}`),k()}}async function aa(a){await f.put("entries",a),k()}function Da(a){const e=o.entries.find(t=>t.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function on(){const e=await(await fetch("data/demo.json")).json(),t=new Date;for(const i of e.guests){const l={id:i.id,name:i.name,language:i.language,visitDate:T(D(t,i.dayOffset)),consent:i.consent,contact:i.consent?{email:i.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",l);for(const s of["liked","improve"])i[s]&&await f.put("entries",{id:`${i.id}_${s}`,guestId:i.id,lang:i.language,source:"typed",box:s,original:i[s],status:"pending",sentences:[],products:[],visitDate:l.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await F(),o.period="all",j("home"),b(n("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function ln(){for(const a of o.guests.filter(e=>e.synthetic))await f.del("guests",a.id);for(const a of o.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await f.del("entries",a.id);for(const a of o.bookings.filter(e=>e.synthetic))await f.del("bookings",a.id);await F(),b(n("Imeondolewa","Removed")),k()}async function rn(a){const e=sa(a);if(!(!e||!confirm(n(`Futa ${e.name} na maoni yake yote?`,`Delete ${e.name} and all their feedback?`)))){await f.del("guests",a);for(const t of o.entries.filter(i=>i.guestId===a))await f.del("entries",t.id);for(const t of o.messages.filter(i=>i.guestId===a))await f.del("messages",t.id);await F(),k()}}async function dn(){var e;if(!o.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await ne(a)}async function cn(){const{s:a,text:e}=oa(),t=v();t==="sw"&&await ce(Ye(a))||se(e[t].join(" "),t)}async function un(a="home"){o.visitor={lang:Pa(),saved:!1,draft:{}},await f.setSetting("kiosk",a),j("visitor")}async function mn(a){if(o.role=a,await f.setSetting("role",a),a==="visitor")return o.book={hostId:null,day:null,form:{},done:null},j("find");j(a==="company"?"company":"home"),a==="host"&&!await f.getSetting("guideSeen",!1)&&X(0)}const pn={say:a=>Qe(a.dataset.clip,v()==="sw"?a.dataset.sw:a.dataset.en,v(),se),"choose-role":a=>mn(a.dataset.role),"open-host":a=>{o.book={hostId:a.dataset.id,day:null,form:{},done:null},j("host")},"book-day":a=>{Fa(),o.book.day=a.dataset.day,k()},"book-submit":Gt,"toggle-day":async a=>{const e=a.dataset.day;o.availableDays=o.availableDays.includes(e)?o.availableDays.filter(t=>t!==e):[...o.availableDays,e].sort(),await f.setSetting("availableDays",o.availableDays),k()},"company-confirm":async a=>{const e=o.bookings.find(t=>t.id===a.dataset.id);e&&(e.status="confirmed",await f.put("bookings",e),b(n(`Imethibitishwa. SMS kwa ${y()} iko tayari.`,`Confirmed. The SMS to ${y()} is ready.`)),k())},"switch-role":async()=>{o.role=null,await f.setSetting("role",null),j("choose")},back:()=>j("home"),go:a=>j(a.dataset.screen),"toggle-lang":async()=>{ie(v()==="sw"?"en":"sw"),await f.setSetting("lang",v()),k()},"hand-to-guest":()=>un(o.screen==="find"?"choose":"home"),"visitor-lang":a=>{Vt(),o.visitor.lang=a.dataset.lang,k()},"visitor-save":Yt,"visitor-next":()=>{o.visitor={lang:Pa(),saved:!1,draft:{}},k(),window.scrollTo(0,0)},"visitor-exit":async()=>{const a=await f.getSetting("kiosk","home");a==="home"&&!confirm(n(`Kwa ${y()} tu: rudi nyumbani?`,`${y()} only: back to the home screen?`))||(await f.setSetting("kiosk",!1),j(a==="choose"?"find":"home"))},"company-sms":()=>{var t,i;const a=Aa(),e=((i=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:i.trim())||"";if(!e){b(n(`Weka namba ya simu ya ${y()}`,`Add ${y()}’s phone number`));return}window.location.href=`sms:${encodeURIComponent(e)}?body=${encodeURIComponent(ea(a))}`},"company-save":async()=>{const a=Aa();await f.put("bookings",a),o.bookings.push(a),b(n("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const a=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",a),await f.setSetting("bigText",a),k()},"save-host":async()=>{var a;Ma((a=document.getElementById("host-name"))==null?void 0:a.value),await f.setSetting("hostName",y()),b(n(`Jina: ${y()}`,`Name: ${y()}`)),k()},"guide-open":()=>X(0),"guide-next":()=>X(Math.min(o.guide.step+1,W.length-1)),"guide-prev":()=>X(Math.max(o.guide.step-1,0)),"guide-close":ba,"guide-try":Jt,sync:Qt,"add-booking":Xt,"download-pack":a=>za([a.dataset.lang]),"download-suggested":()=>za(R().download),"download-recommended":()=>za(R().recommend),"delete-pack":a=>ee([a.dataset.lang]),"delete-removable":()=>ee(R().removable),"download-shared":async a=>{await la([["shared",a.dataset.key]])&&k()},"pick-booking":a=>an(a.dataset.id),"pick-guest":a=>{o.add=P(),o.add.guestId=a.dataset.id,o.add.step=2,k(),window.scrollTo(0,0)},"save-new-guest":en,"change-guest":()=>{o.add.step=1,k()},"add-typed":()=>{o.add.inputs.push({id:z("in"),source:"typed",box:"liked",text:"",status:"ready"}),k()},record:nn,"remove-input":a=>{o.add.inputs=o.add.inputs.filter(e=>e.id!==a.dataset.id),k()},"use-hint":async a=>{const e=G();e.language=a.dataset.lang,await f.put("guests",e),o.add.inputs.forEach(t=>{t.langHint=null}),b(`${n("Lugha","Language")}: ${x(e.language,v())}`),k()},"run-analysis":sn,"finish-add":()=>j("summary"),"more-feedback":()=>{const a=o.add.guestId;o.add=P(),o.add.guestId=a,o.add.step=2,k(),window.scrollTo(0,0)},"fix-mood":async a=>{const[e,t]=Da(a);t&&(t.sentiment=a.dataset.mood,t.flags=(t.flags||[]).filter(i=>i==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await aa(e))},"confirm-sent":async a=>{const[e,t]=Da(a);t&&(t.confirmed=!0,t.flags=[],await aa(e))},"sw-mood":async a=>{var i;const e=o.entries.find(l=>l.id===a.dataset.entry);if(!e)return;const t=((i=e.sentences)==null?void 0:i[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=a.dataset.mood,e.sentences=[t],await aa(e)},period:a=>{o.period=a.dataset.period,k()},speak:cn,"analyze-pending":be,share:dn,"toggle-draft":a=>{o.openGuest=o.openGuest===a.dataset.id?null:a.dataset.id,k()},"mark-sent":async a=>{const e={id:z("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await f.put("messages",e),o.messages.push(e),setTimeout(k,400)},copy:a=>{var e;return ne(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>rn(a.dataset.id),"load-demo":on,"remove-demo":ln,wipe:async()=>{if(!confirm(n("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const a=v();await f.wipeAll(),await f.setSetting("lang",a),await F(),o.add=P(),Ma("Noor"),b(n("Data yote imefutwa","All data deleted")),j("choose")}},gn={"company-preview":()=>{const a=document.getElementById("c-sms");a&&(a.textContent=ea(Aa()))},"company-consent":a=>{var e;return(e=document.getElementById("c-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,t]=Da(a);t&&(t.topic=a.value,t.flags=(t.flags||[]).filter(i=>i!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await aa(e))},"sw-topic":async a=>{var i;const e=o.entries.find(l=>l.id===a.dataset.entry);if(!e||!a.value)return;const t=((i=e.sentences)==null?void 0:i[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=a.value,e.sentences=[t],await aa(e)},"share-ok":a=>{o.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked)}};let ha=null;const hn={"input-text":a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.text=a.value),fn()},"input-english":a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.english=a.value)},"find-q":a=>{o.find.q=a.value,clearTimeout(ha),ha=setTimeout(()=>{const e=a.selectionStart;k();const t=document.getElementById("find-q");t&&(t.focus(),t.setSelectionRange(e,e))},250)},"bk-v-ref":a=>{clearTimeout(ha),ha=setTimeout(()=>{Fa(),k();const e=document.getElementById("bk-v-ref");e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},400)}};function fn(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=o.add.inputs.some(i=>i.status==="ready"&&(i.text||"").trim()),t=o.add.inputs.some(i=>i.status==="working");a.disabled=!(e&&!t)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const t=pn[e.dataset.action];t&&(e.tagName==="BUTTON"&&a.preventDefault(),navigator.vibrate&&navigator.vibrate(8),o.guide.open&&e.dataset.action!=="say"&&!e.closest(".guide-card")&&ba(),Promise.resolve(t(e,a)).catch(i=>{console.error(i),N(),b(`${n("Hitilafu","Error")}: ${i.message}`,6e3)}))});document.addEventListener("change",a=>{var i;const e=a.target;if(e.matches("input[type=file][data-file]")){const l=(i=e.files)==null?void 0:i[0];if(e.value="",!l)return;const s=e.dataset.file;(s==="audio"?ve(l):tn(l,s==="photo-liked"?"liked":"improve")).catch(c=>{N(),b(c.message,6e3)});return}const t=gn[e.dataset.change];t&&Promise.resolve(t(e)).catch(l=>b(l.message,6e3))});document.addEventListener("input",a=>{var t;const e=hn[(t=a.target.dataset)==null?void 0:t.input];e&&e(a.target)});document.addEventListener("keydown",a=>{a.key==="Escape"&&o.guide.open&&ba()});window.addEventListener("online",()=>{o.online=!0,k()});window.addEventListener("offline",()=>{o.online=!1,k()});async function kn(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const i of performance.getEntriesByType("resource"))t.add(i.name);await Promise.all([...t].map(async i=>{try{const l=new URL(i);if(l.pathname.endsWith("/data/bookings.json"))return;const s=l.origin===location.origin?a:l.hostname==="cdn.jsdelivr.net"?e:null;s&&!await s.match(i)&&await s.add(i)}catch{}}))}async function yn(){const a=await f.getSetting("lang",null);return a||((navigator.languages||[navigator.language||"en"]).some(t=>String(t).toLowerCase().startsWith("sw"))?"sw":"en")}async function wn(){ie(await yn()),await F(),await f.getSetting("kiosk",!1)?(o.visitor={lang:Pa(),saved:!1,draft:{}},o.screen="visitor"):o.screen=o.role==="host"?"home":o.role==="company"?"company":o.role==="visitor"?"find":"choose",kt(document.getElementById("nature"),Ba[o.screen]||"grove"),k(),o.screen==="home"&&!await f.getSetting("guideSeen",!1)&&X(0),await ia(),k(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(kn).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),Oa().then(e=>{e&&navigator.onLine&&Ze()})}wn().catch(a=>{console.error(a),Z.innerHTML=`<div class="notice neg"><strong>${n("Hitilafu","Error")}</strong>${d(a.message)}</div>`});
