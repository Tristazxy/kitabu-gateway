import{l as x,t as N,P as W,L as S,e as ue,f as me,g as Ce,i as Ja,c as Ee,a as De,j as Ae,k as n,m as w,h as d,n as O,o as xa,b as T,d as b,q as Ba,r as Ca,u as pe,v,w as D,s as A,x as Ea,p as _,y as Ne,z as We,A as Oe,B as Pe,C as $a,S as F,D as Re,E as He,F as Fe,G as Ke,H as qe,I as _e,J as Ue,K as Ya,N as Ge,O as oa,Q as Ve}from"./ui-CqwbBBOL.js";const Je="kitabu",Ye=1,ge=["guests","entries","bookings","messages","settings"];let ma=null;function Ze(){return ma||(ma=new Promise((a,e)=>{const t=indexedDB.open(Je,Ye);t.onupgradeneeded=()=>{const s=t.result;for(const l of ge)s.objectStoreNames.contains(l)||s.createObjectStore(l,{keyPath:l==="settings"?"key":"id"})},t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)}),ma)}function G(a,e,t){return Ze().then(s=>new Promise((l,o)=>{const r=s.transaction(a,e),c=r.objectStore(a);let m;Promise.resolve(t(c)).then(g=>{m=g}),r.oncomplete=()=>l(m),r.onerror=()=>o(r.error),r.onabort=()=>o(r.error)}))}function Za(a){return new Promise((e,t)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})}const f={async all(a){return G(a,"readonly",e=>Za(e.getAll()))},async get(a,e){return G(a,"readonly",t=>Za(t.get(e)))},async put(a,e){return await G(a,"readwrite",t=>{t.put(e)}),e},async putMany(a,e){await G(a,"readwrite",t=>{for(const s of e)t.put(s)})},async del(a,e){await G(a,"readwrite",t=>{t.delete(e)})},async clear(a){await G(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const t=await this.get("settings",a);return t?t.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of ge)await this.clear(a)}};function M(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const Qe=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],Xe=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Sa(a){const e=new Date(a);return`${Qe[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function E(a){const e=new Date(a);return`${Xe[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Ha(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function ja(a){return`WeKaribu: Wageni wapya. ${Sa(a.date)}: wageni ${a.guests} (${x(a.language,"sw")})${a.guide?`, mwongozaji ${a.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const Qa={en:a=>`${a.company}: your visit to ${a.hostName} is confirmed for ${E(a.date)} (${a.guests} guests). Meet at: ${a.meet}. Guide: ${a.guide}. Reply to this number with questions.`,it:a=>`${a.company}: la vostra visita a ${a.hostName} è confermata per ${E(a.date)} (${a.guests} persone). Punto d’incontro: ${a.meet}. Guida: ${a.guide}.`,fr:a=>`${a.company} : votre visite chez ${a.hostName} est confirmée pour ${E(a.date)} (${a.guests} pers.). Rendez-vous : ${a.meet}. Guide : ${a.guide}.`,de:a=>`${a.company}: Ihr Besuch bei ${a.hostName} ist bestätigt für ${E(a.date)} (${a.guests} Pers.). Treffpunkt: ${a.meet}. Guide: ${a.guide}.`,es:a=>`${a.company}: su visita a ${a.hostName} está confirmada para ${E(a.date)} (${a.guests} pers.). Punto de encuentro: ${a.meet}. Guía: ${a.guide}.`,pl:a=>`${a.company}: wizyta u ${a.hostName} potwierdzona na ${E(a.date)} (${a.guests} os.). Miejsce spotkania: ${a.meet}. Przewodnik: ${a.guide}.`,zh:a=>`${a.company}：您在 ${a.hostName} 的参观已确认，时间 ${E(a.date)}（${a.guests} 人）。集合地点：${a.meet}。向导：${a.guide}。`,sw:a=>`${a.company}: ziara yenu kwa ${a.hostName} imethibitishwa ${Sa(a.date)} (wageni ${a.guests}). Kutana: ${a.meet}. Mwongozaji: ${a.guide}.`};function at(a){return(Qa[a.language]||Qa.en)({company:a.company||"Tour company",hostName:a.hostName||"the host",date:a.date,guests:a.guests,meet:a.meet||"the village office",guide:a.guide||"-",language:a.language})}const aa=a=>`${a} ${a===1?"guest":"guests"}`,Xa=a=>`${a} ${a===1?"entry":"entries"}`;function et(a,e="Noor"){const t=[],s=[];if(t.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),s.push(`This period: ${aa(a.guests)}, ${Xa(a.entries)}.`),a.guests===0)return t.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),s.push("No feedback yet. Add guest feedback first."),{sw:t,en:s};a.guests<5&&(t.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),s.push(`Caution: still little feedback (${aa(a.guests)}). Too early for big decisions.`));const o=a.liked.filter(m=>m.id!=="other").slice(0,3);o.length&&(t.push("Walichopenda zaidi: "+o.map(m=>`${N(m.id).sw.split(" (")[0].toLowerCase()} (wageni ${m.guests})`).join("; ")+"."),s.push("What they liked most: "+o.map(m=>`${N(m.id).en.toLowerCase()} (${aa(m.guests)})`).join("; ")+"."));const r=a.improve.filter(m=>m.id!=="other").slice(0,3);r.length?(t.push("Wanachotaka kiboreshwe: "+r.map(m=>`${N(m.id).sw.split(" (")[0].toLowerCase()} (wageni ${m.guests})`).join("; ")+"."),s.push("What they want improved: "+r.map(m=>`${N(m.id).en.toLowerCase()} (${aa(m.guests)})`).join("; ")+".")):(t.push("Hakuna malalamiko yaliyotajwa."),s.push("No complaints were mentioned.")),a.products.length&&(t.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(m=>`${W.find(g=>g.id===m.id).sw} (wageni ${m.guests})`).join("; ")+"."),s.push("Products guests wanted to buy: "+a.products.map(m=>`${W.find(g=>g.id===m.id).en} (${aa(m.guests)})`).join("; ")+"."));const c=Ha(a);if(c){const m=W.find(g=>g.id===c.id);t.push(`Wazo: wageni ${c.guests} kati ya ${a.guests} walitaka ${m.sw}. Unaweza kufikiria kuuza ${m.sw}. Uamuzi ni wako.`),s.push(`Idea: ${c.guests} of ${a.guests} guests wanted ${m.en}. You could consider selling ${m.en}. The decision is yours.`)}return a.unsure>0&&(t.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),s.push(`${a.unsure} ${a.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${a.unsure===1?"it":"them"} with your helper or the guide.`)),a.swahiliEntries>0&&(t.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),s.push(`${Xa(a.swahiliEntries)} in Swahili — ${e} reads ${a.swahiliEntries===1?"it":"them"} directly.`)),{sw:t,en:s}}const Ma={sw:{liked:(a,e,t)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${t}`,plain:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${e}`},en:{liked:(a,e,t)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — ${t}`,plain:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${e}`},it:{liked:(a,e,t)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${t}`,plain:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${e}`},fr:{liked:(a,e,t)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${t}`,plain:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${e}`},de:{liked:(a,e,t)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${t}`,plain:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${e}`},zh:{liked:(a,e,t)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${t}`,plain:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${e}`},es:{liked:(a,e,t)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${t}`,plain:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${e}`},pl:{liked:(a,e,t)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${t}`,plain:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${e}`}};function ae(a,e,t="Noor"){const s=Ma[a.language]?a.language:"en",l=s!==a.language,o=(a.name||"").trim()||(s==="zh"?"":"friend"),r=e?ue.find(m=>m.id===e):null,c=m=>r?Ma[m].liked(o,r.msg[m]||r.msg.en,t):Ma[m].plain(o,t);return{lang:s,text:c(s),sw:c("sw"),usedFallback:l}}const ee={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function Fa(a,e,t="Noor"){const s=[];s.push(`Ripoti ya maoni — ${e}`),s.push(`Feedback report — ${e}`),s.push(""),s.push(`Wageni / Guests: ${a.guests}`);const l=Object.entries(a.languages).map(([r,c])=>`${S[r]?S[r].en:r} ${c}`).join(", ");l&&s.push(`Lugha / Languages: ${l}`),s.push(""),s.push("Walichopenda / Liked:");for(const r of a.liked.filter(c=>c.id!=="other").slice(0,5))s.push(`  • ${N(r.id).en}: ${r.guests}`);s.push("Kuboresha / To improve:");const o=a.improve.filter(r=>r.id!=="other").slice(0,5);o.length||s.push("  • —");for(const r of o)s.push(`  • ${N(r.id).en}: ${r.guests}`);if(a.products.length){s.push("Bidhaa / Product interest:");for(const r of a.products)s.push(`  • ${W.find(c=>c.id===r.id).en}: ${r.guests}`)}return s.push(""),s.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),s.push(`Imeidhinishwa na ${t} kabla ya kutumwa. / Approved by ${t} before sharing.`),s.join(`
`)}function ra(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function tt(a,e,t=new Date){if(e==="all")return!0;const s=new Date(a),l=e==="week"?7:e==="month"?31:3650;return t-s<=l*24*3600*1e3&&s-t<=24*3600*1e3}function nt(a,e){const t=Object.fromEntries(e.map(k=>[k.id,k])),s=new Set,l={},o={},r={},c={};let m=0,g=0;const p=(k,u,y,j)=>{k[u]||(k[u]={id:u,guestIds:new Set,quotes:[]}),k[u].guestIds.add(y),j&&k[u].quotes.push(j)};for(const k of a){s.add(k.guestId),k.lang==="sw"&&g++;for(const u of k.sentences||[]){const y=ra(u);y&&m++;const j={entryId:k.id,en:u.en,original:u.original||null,lang:k.lang,flagged:y};u.sentiment==="pos"?p(o,u.topic,k.guestId,j):u.sentiment==="neg"&&p(r,u.topic,k.guestId,j)}for(const u of new Set([...k.products||[],...k.declaredProducts||[]]))p(c,u,k.guestId,null)}for(const k of s){const u=t[k],y=u?u.language:"unknown";l[y]=(l[y]||0)+1}const $=k=>Object.values(k).map(u=>({id:u.id,guests:u.guestIds.size,quotes:u.quotes})).sort((u,y)=>y.guests-u.guests);return{guests:s.size,entries:a.length,liked:$(o),improve:$(r),products:$(c),unsure:m,swahiliEntries:g,languages:l}}function st(a,e){const t={};for(const l of a.filter(o=>o.guestId===e))for(const o of l.sentences||[])o.sentiment==="pos"&&o.topic!=="other"&&(t[o.topic]=(t[o.topic]||0)+1);const s=Object.entries(t).sort((l,o)=>o[1]-l[1])[0];return s?s[0]:null}async function he(a,e){const{original:t,lang:s,box:l}=a;if(s==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let o;a.english?o=[{original:null,en:a.english}]:o=(await me(t,s,e)).pairs;const r=[];for(const k of o)for(const u of Ce(k.en))r.push({en:u,original:k.original});const c=o.map(k=>k.en).join(" ").trim();if(!r.length)return{english:c,sentences:[],products:Ja(c),status:"analyzed"};const m=r.map(k=>k.en),g=await Ee(m,e),p=await De(m,e),$=r.map((k,u)=>{var R,ua,X;const y=Ae(l,p[u]),j=[...y.flags];return g[u].topic==="other"&&j.push("topic-unsure"),(R=S[s])!=null&&R.fallback&&!a.english&&j.push("fallback-pack"),{en:k.en,original:k.original,topic:g[u].topic,topicScore:g[u].score,runnerUp:g[u].runnerUp,sentiment:y.sentiment,moodScore:((ua=p[u])==null?void 0:ua.score)??null,modelMood:((X=p[u])==null?void 0:X.label)??null,flags:j,confirmed:!1}});return{english:c,sentences:$,products:Ja(c),status:"analyzed"}}let ea;async function da(){if(ea!==void 0)return ea;try{const a=await fetch("audio/sw/manifest.json");ea=a.ok?await a.json():null}catch{ea=null}return ea}const pa=a=>a>=1&&a<=20?`g_${a}`:"g_more";function it(a){if(!a.guests)return["no_feedback"];const e=["period",pa(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const t=a.liked.filter(o=>o.id!=="other").slice(0,3);if(t.length){e.push("liked_intro");for(const o of t)e.push(`t_${o.id}`,pa(o.guests))}const s=a.improve.filter(o=>o.id!=="other").slice(0,3);if(s.length){e.push("improve_intro");for(const o of s)e.push(`t_${o.id}`,pa(o.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const o of a.products)e.push(`p_${o.id}`,pa(o.guests))}const l=Ha(a);return l&&e.push("idea_intro",`p_${l.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let Da=0,na=null;function ot(){Da++,na&&(na.pause(),na=null)}async function fe(a){const e=await da();if(!e||!a.every(s=>e.files[s]))return!1;ot();const t=++Da;for(const s of a){if(t!==Da)break;await new Promise(l=>{const o=new Audio(`audio/sw/${e.files[s]}`);na=o,o.onended=l,o.onerror=l,o.play().catch(l)})}return na=null,!0}async function lt(){const a=await da();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}async function te(a,e,t,s){t==="sw"&&await fe([a])||s(e,t)}const wa={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'},H=[{icon:wa.book,title:()=>n("Karibu","Welcome"),body:()=>[n("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),n("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:wa.steps,target:'[data-action="go"][data-screen="add"]',title:()=>n("Hatua tatu","Three steps"),list:()=>[n("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),n("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),n("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[n("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:wa.play,target:'[data-action="guide-try"], [data-action="speak"]',title:()=>n("Jaribu sasa","Try it now"),body:()=>[n("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function rt(a){const e=H[a],t=a===H.length-1,s=H.map((c,m)=>`<span class="${m===a?"on":""}"></span>`).join(""),l=e.list?`<ol class="guide-list">${e.list().map(c=>`<li>${c}</li>`).join("")}</ol>`:"",o=e.body().map(c=>`<p class="lead">${c}</p>`).join(""),r=e.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${n("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${a+1} / ${H.length}">${s}</div>
      <button class="guide-close" data-action="guide-close">${n("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${e.icon}</div>
    <h2 id="guide-title">${e.title()} <button class="say" data-action="say" data-clip="${["ui_who","ui_add","ui_summary"][a]||"ui_help"}" data-sw="${[...e.list?e.list():[],...e.body()].join(" ").replace(/"/g,"&quot;")}" data-en="${[...e.list?e.list():[],...e.body()].join(" ").replace(/"/g,"&quot;")}" aria-label="Sikiliza">${wa.speaker}</button></h2>
    ${l}
    ${o}
    ${r}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${a===0?"disabled":""}>${n("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${n("Endelea","Next")}</button>`}
    </div>
  </div>`}const ke=["en","it","fr","de","zh","es","pl","sw","xx"],ne={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function we(a){const e=ne[a]||{...ne.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},t={};for(const[s,l]of Object.entries(e))t[s]=l.replace(/\{host\}/g,w());return t}function Ka(){for(const a of navigator.languages||[navigator.language||"en"]){const e=String(a).slice(0,2).toLowerCase();if(ke.includes(e))return e}return"en"}const ye={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'},dt=ye.visitor;function ct(){const a={host:"tile-caramel",visitor:"tile-leaf",company:"tile-sky"},e='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',t={host:"ui_host",visitor:"ui_visitor",company:"ui_company"},s=(l,o,r)=>`
    <div class="home-row">
    <button class="home-btn" data-action="choose-role" data-role="${l}">
      <span class="role-icon ${a[l]}" aria-hidden="true">${ye[l]}</span>
      <span class="role-text"><strong>${o}</strong><span class="small muted">${r}</span></span>
    </button><button class="say" data-action="say" data-clip="${t[l]}" data-sw="${d(o+". "+r)}" data-en="${d(o+". "+r)}" aria-label="Sikiliza">${e}</button></div>`;return`
  <div class="card welcome">
    <h1 style="margin:0">${n("Karibu!","Welcome!")}</h1>
    <p style="margin:4px 0 0">${n("Wageni wanaandika kwa lugha yao. Mwenyeji anasikia kwa lugha yake. Hakuna usajili.","Guests write in their language. The host hears it in hers. No sign-up.")}</p>
  </div>
  <h2>${n("Wewe ni nani?","Who are you?")} <button class="say" data-action="say" data-clip="ui_who" data-sw="Karibu! Wewe ni nani? Chagua: mwenyeji, mgeni, au kampuni ya utalii." data-en="Welcome! Who are you? Choose: host, visitor, or tour company." aria-label="Sikiliza"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg></button></h2>
  <div class="stack" style="margin-top:12px">
    ${s("host",n("Mwenyeji","Host"),n("Ongeza maoni, sikiliza muhtasari, washukuru wageni.","Add feedback, hear the summary, thank guests."))}
    ${s("visitor",n("Mgeni","Visitor"),n("Tafuta mahali, weka nafasi, andika maoni kwa lugha yako.","Find a place, book a visit, leave feedback in your language."))}
    ${s("company",n("Kampuni ya utalii au mwongozaji","Tour company or guide"),n("Tuma ratiba ya wageni kwa SMS.","Send guest bookings by SMS."))}
  </div>
  <p class="small muted" style="margin-top:14px">${n("Unaweza kubadilisha baadaye.","You can switch later.")}</p>`}function ut(a,e,t={}){const s=we(a),l={name:"",liked:"",improve:"",email:"",...t},o=ke.map(r=>`<button class="chip" data-action="visitor-lang" data-lang="${r}" aria-pressed="${r===a}">${d(S[r].native)}</button>`).join("");return e?`
    <div class="card" lang="${a}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${dt}</div>
      <h1>${d(s.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${d(s.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${d(s.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${w()} tu: rudi`,`${w()} only: back`)}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${d(s.lang)}">${o}</div>
  <div class="card" lang="${a}">
    <h1>${d(s.title)}</h1>
    <p>${d(s.intro)}</p>
    <div class="stack">
      <label class="field">${d(s.name)}<input type="text" id="v-name" autocomplete="off" value="${d(l.name)}"></label>
      <label class="field">${d(s.liked)}<textarea id="v-liked">${d(l.liked)}</textarea></label>
      <label class="field">${d(s.improve)}<textarea id="v-improve">${d(l.improve)}</textarea></label>
      <fieldset style="border:0;padding:0;margin:0">
        <legend style="font-weight:600;font-size:.95rem;margin-bottom:6px">${d(s.buy)}</legend>
        <div class="row">
          <label class="check"><input type="checkbox" id="v-buy-coffee"> <span>${d(s.coffee)}</span></label>
          <label class="check"><input type="checkbox" id="v-buy-souvenir"> <span>${d(s.souvenir)}</span></label>
        </div>
      </fieldset>
      <label class="field">${d(s.email)}<input type="email" id="v-email" autocomplete="off" value="${d(l.email)}"></label>
      <label class="check"><input type="checkbox" id="v-consent"> <span>${d(s.consent)}</span></label>
      <button class="btn block" data-action="visitor-save">${d(s.save)}</button>
      <p class="small muted" style="margin:0">${d(s.privacy)}</p>
    </div>
  </div>
  <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${w()} tu: rudi`,`${w()} only: back`)}</button>`}function mt({langOptionsHTML:a,today:e,sms:t,report:s}){return`
  <h1>${n("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${n(`Tuma ratiba ya wageni kwa ${w()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${w()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${n(`Namba ya simu ya ${w()}`,`${w()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${n("Tarehe","Date")}<input type="date" id="c-date" value="${e}" data-change="company-preview"></label>
        <label class="field">${n("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${n("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${a}</select></label>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${n(`Mgeni amekubali ${w()} awasiliane naye`,`The guest agreed that ${w()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${n("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${n(`SMS ambayo ${w()} atapokea`,`The SMS ${w()} will get`)}</h2>
    <div class="sms" id="c-sms">${d(t)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${n(`Tuma SMS kwa ${w()}`,`Send SMS to ${w()}`)}</button>
      <button class="btn secondary" data-action="company-save">${n("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${n(`Unachopokea kutoka kwa ${w()}`,`What you get back from ${w()}`)}</h2>
    <p class="small">${n("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.")}</p>
    ${s?`<div class="sms">${d(s)}</div>`:""}
  </div>`}const ya=(a,e)=>e==="sw"?Sa(a):E(a);function pt(a,e,t=new Date){return e&&e.length?e.filter(s=>new Date(s)>=O(t,-1)).sort():(a.availableOffsets||[]).map(s=>xa(O(t,s)))}const gt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',$e='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',ht=new Set("a an the to of in at on for my our their his her and or with near by from went go visit visited place friend friends told said about some that this is was were are be we i they it like want wanting looking".split(" ")),se=a=>String(a||"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(e=>e&&!ht.has(e));function ft(a,e,t=[],s="en",l=null){const o=se(a);return o.length?e.map(c=>{const m=[c.name,c.town,...c.tags||[],c.blurb].join(" ").toLowerCase(),g=new Set(se(m));let p=0;const $=[];for(const u of o)(g.has(u)||m.includes(u))&&(p+=c.town.toLowerCase().includes(u)||c.name.toLowerCase().includes(u)?3:1,$.push(u));const k=t.find(u=>o.includes((u.name||"").toLowerCase().split(" ")[0]));return k&&c.id==="noor"&&(p+=6,$.push(n(`${k.name} alitembelea hapa`,`${k.name} visited here`))),l&&l[c.id]!=null&&(p+=l[c.id]*4),{host:c,score:p,reasons:[...new Set($)]}}).sort((c,m)=>m.score-c.score):e.map(c=>({host:c,score:0,reasons:[]}))}function kt({q:a,hosts:e,lang:t,loading:s,ranked:l,thinking:o}){const r=(a||"").trim(),c=r&&l?l.filter(p=>p.score>0):e.map(p=>({host:p,score:0,reasons:[]})),m=r&&c.length&&c[0].score>=3?c[0]:null,g=(p,$)=>`
    <button class="home-btn ${$?"locked":""}" data-action="open-host" data-id="${p.host.id}">
      <span class="role-icon ${$?"tile-caramel":"tile-leaf"}" aria-hidden="true">${$e}</span>
      <span class="role-text">${$?`<span class="chip" style="align-self:flex-start;margin-bottom:4px">${n("Mahali pako","Best match")}</span>`:""}<strong>${d(p.host.name)}</strong>
        <span class="small muted">${d(p.host.town)} · ${(p.host.tags||[]).slice(0,3).map(d).join(" · ")}</span>
        ${p.reasons.length?`<span class="small">${n("Kwa nini","Why")}: ${p.reasons.map(d).join(", ")}</span>`:`<span class="small">${n("Lugha","Languages")}: ${p.host.languages.map(k=>d(x(k,t))).join(", ")}</span>`}</span>
    </button>`;return`
  <h1>${n("Tafuta mahali pa kutembelea","Find a place to visit")}</h1>
  <p class="small muted">${n("Andika unachokumbuka: jina la kijiji, jina la rafiki aliyekwenda, au “shamba la kahawa karibu na Moshi”. Simu inatafuta mahali pako.","Type what you remember: a village, the friend who went, or “a coffee farm near Moshi”. The phone finds the place.")}</p>
  <label class="field search">${gt}<input type="search" id="find-q" value="${d(a||"")}" placeholder="${n("k.m. rafiki yangu Emma alikwenda shamba la kahawa","e.g. my friend Emma went to a coffee farm")}" autocomplete="off" data-input="find-q"></label>
  ${s?`<p class="muted">${n("Inapakia…","Loading…")}</p>`:""}
  ${o?`<p class="small muted">${n("Inalinganisha maana…","Matching by meaning…")}</p>`:""}
  <div class="stack" style="margin-top:12px">
    ${c.length?c.map((p,$)=>g(p,m&&$===0)).join(""):`<div class="notice">${n("Hakuna matokeo. Jaribu jina la kijiji au la rafiki.","No results. Try the name of the village or of your friend.")}</div>`}
  </div>
  <p class="small muted" style="margin-top:14px">${n("Orodha ya mfano (data bandia). Toleo halisi linapata orodha kutoka kwa kampuni ya utalii au ofisi ya utalii.","Example directory (synthetic). The real version gets the list from the tour company or the tourism office.")}</p>
  <div class="row home-links">
    <button class="link-btn" data-action="hand-to-guest">${n("Umeshatembelea? Andika maoni","Already visited? Leave feedback")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
  </div>`}function wt(a,e,t){const s=r=>N(r)[t].split(" (")[0].toLowerCase(),l=e&&e.guests?{guests:e.guests,liked:e.liked.filter(r=>r.id!=="other").slice(0,3).map(r=>r.id),improve:e.improve.filter(r=>r.id!=="other").slice(0,2).map(r=>r.id),products:e.products.map(r=>r.id)}:a.sample;if(!l||!l.guests)return n("Bado hakuna maoni.","No feedback yet.");const o=[n(`Wageni ${l.guests} wametoa maoni.`,`${l.guests} guests left feedback.`)];if(l.liked.length&&o.push(n(`Walipenda: ${l.liked.map(s).join(", ")}.`,`Loved: ${l.liked.map(s).join(", ")}.`)),l.improve.length&&o.push(n(`Kuboresha: ${l.improve.map(s).join(", ")}.`,`To improve: ${l.improve.map(s).join(", ")}.`)),l.products.length){const r=l.products.map(c=>(W.find(m=>m.id===c)||{})[t]||c);o.push(n(`Bidhaa zinazopatikana: ${r.join(", ")}.`,`For sale: ${r.join(", ")}.`))}return o.join(" ")}function yt({host:a,days:e,selected:t,summaryLine:s,form:l,lang:o,knownGuest:r}){const c={guests:2,language:"en",name:"",email:"",consent:!1,referredBy:"",...l},m=e.length?e.map(p=>`<button class="chip" data-action="book-day" data-day="${p}" aria-pressed="${p===t}">${d(ya(p+"T12:00:00",o))}</button>`).join(""):`<span class="muted">${n("Hakuna siku zilizotangazwa bado. Uliza kampuni ya utalii.","No days published yet. Ask the tour company.")}</span>`,g=Object.entries(S).filter(([p])=>p!=="xx"||!0).map(([p,$])=>`<option value="${p}" ${p===c.language?"selected":""}>${d($[o])}${$.native!==$[o]?` (${d($.native)})`:""}</option>`).join("");return`
  <button class="btn small secondary" data-action="go" data-screen="find" style="margin-bottom:12px">← ${n("Orodha","Places")}</button>
  <div class="card hero-card">
    <div class="hero-art" aria-hidden="true">${vt}</div>
    <h1 style="margin-top:10px">${d(a.name)}</h1>
    <p class="small muted" style="margin-top:-4px">${d(a.town)} · ${(a.tags||[]).map(d).join(" · ")}</p>
    <p>${d(a.blurb)}</p>
    <div class="row small">
      <span class="chip plain">${n("Lugha","Languages")}: ${a.languages.map(p=>d(x(p,o))).join(", ")}</span>
      <span class="chip plain">${n("Mwongozaji","Guide")}: ${d(a.guide)}</span>
    </div>
    <p class="small muted" style="margin:8px 0 0">${d(a.price)}</p>
  </div>

  <div class="card">
    <h2>${n("Wageni walisema","What guests said")}</h2>
    <p style="margin:0">${d(s)}</p>
    <p class="small muted" style="margin:6px 0 0">${n("Jumla tu, hakuna majina. Imekusanywa kwenye simu ya mwenyeji.","Counts only, no names. Collected on the host’s own phone.")}</p>
  </div>

  <div class="card">
    <h2>${n("Weka nafasi","Book a visit")}</h2>
    <p class="small muted">${n("Mwenyeji anatangaza siku anazoweza kupokea wageni wiki moja mbele. Ombi lako linakwenda kwa kampuni ya utalii; mwenyeji anapata SMS.","The host publishes the days she can take guests a week ahead. Your request goes to the tour company; the host gets an SMS.")}</p>
    <div class="stack">
      <div><div class="field-label">${n("Siku","Day")}</div><div class="row">${m}</div></div>
      <div class="grid2">
        <label class="field">${n("Wageni","Guests")}<input type="number" id="bk-v-guests" min="1" max="12" value="${c.guests}"></label>
        <label class="field">${n("Lugha yenu","Your language")}<select id="bk-v-lang">${g}</select></label>
      </div>
      <label class="field">${n("Jina lako","Your name")}<input type="text" id="bk-v-name" value="${d(c.name)}" autocomplete="off"></label>
      <label class="field">${n("Nani alikuambia kuhusu mahali hapa? (hiari)","Who told you about this place? (optional)")}<input type="text" id="bk-v-ref" value="${d(c.referredBy)}" autocomplete="off" data-input="bk-v-ref"></label>
      ${r?`<div class="notice small">${n(`${d(r.name)} alitembelea hapa (${d(ya(r.visitDate,o))}). Mwenyeji atafurahi kujua.`,`${d(r.name)} visited here (${d(ya(r.visitDate,o))}). The host will be glad to know.`)}</div>`:""}
      <label class="field">${n("Barua pepe (hiari)","Email (optional)")}<input type="email" id="bk-v-email" value="${d(c.email)}" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-v-consent" ${c.consent?"checked":""}> <span>${n("Mwenyeji anaweza kuhifadhi barua pepe yangu na kuniandikia baada ya ziara.","The host may keep my email and write to me after the visit.")}</span></label>
      <button class="btn block" data-action="book-submit" ${t?"":"disabled"}>${n("Tuma ombi","Send the request")}</button>
      <p class="small muted" style="margin:0">${n("Hakuna malipo hapa. Kampuni ya utalii inathibitisha kwa barua pepe au WhatsApp.","No payment here. The tour company confirms by email or WhatsApp.")}</p>
    </div>
  </div>`}function $t({host:a,booking:e,lang:t,phrasebook:s,saved:l,audioReady:o}){const r=`<svg viewBox="0 0 320 170" class="spot-map" role="img" aria-label="map">
    <rect width="320" height="170" rx="12" fill="#E4EFE2"/>
    <path d="M0 120 C 60 90 120 150 200 110 S 290 80 320 100" fill="none" stroke="#8CC6DC" stroke-width="10" stroke-linecap="round"/>
    <path d="M20 40 L70 15 L120 45 L170 10 L230 50 L300 20" fill="none" stroke="#A9C4CE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 150 L120 120 L200 140 L300 125" fill="none" stroke="#7DAA5A" stroke-width="8" stroke-linecap="round"/>
    <circle cx="60" cy="140" r="5" fill="#1F4D3A"/><text x="70" y="145" font-size="12" fill="#1F4D3A">Moshi</text>
    <g transform="translate(205 70)"><path d="M0 22 c -14 -16 -14 -32 0 -32 s 14 16 0 32z" fill="#B2452C"/><circle cy="-10" r="5" fill="#fff"/></g>
    <text x="210" y="100" font-size="12" font-weight="700" fill="#1F4D3A">${d(a.town)}</text>
  </svg>`,c=(s||[]).map(m=>`
    <li class="row between"><div><strong lang="sw">${d(m.sw)}</strong><div class="small muted">${d(m.en)} · <i>${d(m.say)}</i></div></div>
      <button class="say" data-action="say-phrase" data-clip="${m.id}" data-text="${d(m.sw)}" aria-label="Listen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg></button></li>`).join("");return`
  <div class="card" style="text-align:center;padding:22px 18px">
    <div class="role-icon tile-caramel" style="margin:0 auto 10px" aria-hidden="true">${$e}</div>
    <h1>${n("Ombi limetumwa","Request sent")}</h1>
    <p class="lead" style="margin:0">${n(`${d(a.company)} itathibitisha kwa barua pepe au WhatsApp. Mwenyeji anapata SMS.`,`${d(a.company)} confirms by email or WhatsApp. The host gets an SMS.`)}</p>
  </div>
  <div class="card">
    <h2>${n("Safari yako","Your trip")} <span class="chip">${n("Imehifadhiwa kwenye simu","Saved on your phone")}</span></h2>
    <p style="margin:0 0 8px"><strong>${d(a.name)}</strong> · ${d(ya(e.date,t))} · ${n("wageni","guests")} ${d(e.guests)} · ${d(x(e.language,t))}</p>
    ${r}
    <dl class="kv" style="margin-top:10px">
      <dt>${n("Mahali pa kukutana","Meeting point")}</dt><dd>${d(a.meet)}</dd>
      <dt>${n("Njia","Getting there")}</dt><dd>${d(a.directions)}</dd>
      <dt>${n("Mwongozaji","Guide")}</dt><dd>${d(a.guide)} · ${d(a.phone)}</dd>
    </dl>
    <div class="row" style="margin-top:10px">
      <a class="btn small secondary" href="geo:${a.lat},${a.lng}?q=${a.lat},${a.lng}(${encodeURIComponent(a.name)})">${n("Fungua kwenye ramani","Open in maps")}</a>
      <a class="btn small secondary" href="https://www.google.com/maps/search/?api=1&query=${a.lat},${a.lng}" target="_blank" rel="noopener">Google Maps</a>
    </div>
    <p class="small muted" style="margin:8px 0 0">${n("Maelezo haya yanabaki kwenye simu yako bila mtandao.","These details stay on your phone, offline.")}</p>
  </div>
  <div class="card">
    <h2>${n("Kiswahili kwa safari yako","Swahili for your trip")} ${l?`<span class="chip">${n("Imepakuliwa","Downloaded")}</span>`:""}</h2>
    <p class="small muted">${n("Lugha ya mwenyeji, imehifadhiwa kwenye simu yako.",`The host’s language, saved on your phone${o?" with sound":""}.`)}</p>
    ${l?`<ul class="list">${c}</ul>`:`<button class="btn block" data-action="download-phrasebook">${n("Pakua misemo 12 (na sauti)","Download 12 phrases (with sound)")}</button>`}
  </div>
  <div class="stack">
    <button class="btn secondary block" data-action="go" data-screen="find">${n("Tafuta mahali pengine","Find another place")}</button>
    <button class="btn secondary block" data-action="switch-role">${n("Maliza","Done")}</button>
  </div>`}const vt=`<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
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
</svg>`,ga=(a,e,t,s=!1)=>`
  <g class="bamboo" style="animation-delay:${t}s" transform="translate(${a} 1600) ${s?"scale(-1 1)":""}">
    <rect x="-9" y="-${e}" width="18" height="${e}" rx="9" fill="#6E9F4E"/>
    ${[...Array(Math.floor(e/110))].map((l,o)=>`<rect x="-11" y="-${(o+1)*110}" width="22" height="7" rx="3" fill="#4F7A3A"/>`).join("")}
    ${[...Array(Math.floor(e/160))].map((l,o)=>`
      <path d="M0 -${120+o*160} q -70 -30 -120 -10 q 60 40 120 10z" fill="#7DAA5A"/>
      <path d="M0 -${180+o*160} q 60 -40 110 -20 q -50 40 -110 20z" fill="#8DB86A"/>`).join("")}
  </g>`,Ia=(a,e,t,s)=>`
  <g class="cloud" style="animation-duration:${s}s" transform="translate(${a} ${e}) scale(${t})" fill="#fff" opacity="0.85">
    <ellipse cx="0" cy="0" rx="90" ry="34"/><ellipse cx="-50" cy="8" rx="50" ry="26"/><ellipse cx="55" cy="6" rx="60" ry="30"/><ellipse cx="10" cy="-18" rx="55" ry="30"/>
  </g>`,ha=(a,e,t)=>`
  <ellipse class="leaf" style="animation-delay:${e}s;animation-duration:${t}s" cx="${a}" cy="-30" rx="14" ry="7" fill="#8DB86A" opacity="0.9"/>`,ie=(a,e,t)=>`
  <path class="bird" style="animation-duration:${e}s;animation-delay:${t}s" d="M-16 ${a} q 8 -10 16 0 q 8 -10 16 0" fill="none" stroke="#3E5E46" stroke-width="3" stroke-linecap="round"/>`,bt=`
<svg viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE7EE"/><stop offset="0.55" stop-color="#EAF2EA"/><stop offset="1" stop-color="#F4EFE3"/></linearGradient>
    <radialGradient id="nsun"><stop offset="0" stop-color="#FFE7A8"/><stop offset="0.5" stop-color="#F8D57E" stop-opacity="0.9"/><stop offset="1" stop-color="#F8D57E" stop-opacity="0"/></radialGradient>
    <linearGradient id="nriver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5FA8C7"/><stop offset="1" stop-color="#8CC6DC"/></linearGradient>
  </defs>
  <rect width="1000" height="1600" fill="url(#nsky)"/>
  <circle class="sun" cx="780" cy="260" r="150" fill="url(#nsun)"/>
  <circle cx="780" cy="260" r="60" fill="#FFD36E"/>
  ${Ia(120,220,1,70)}${Ia(600,140,.7,95)}${Ia(900,330,.55,80)}
  ${ie(0,46,0)}${ie(40,58,18)}
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
  ${ga(40,900,0)}${ga(110,700,1.3)}${ga(960,980,.6,!0)}${ga(890,760,2.1,!0)}
  ${ha(180,0,14)}${ha(520,5,18)}${ha(820,9,16)}${ha(330,12,20)}
</svg>`,va={mountains:{id:12492499,by:"RD King"},grove:{id:12311788,by:"Anton Lukin"},canopy:{id:6318875,by:"Vanessa Garcia"},cherries:{id:7116757,by:"Matthias Groeneveld"},stream:{id:11902892,by:"Thierry Rossier"},flowers:{id:14482561,by:"Michael Burrows"},dunes:{id:14483416,by:"Dubang chang"},snow:{id:19806018,by:"iPhone Snaps"}},Aa={choose:"mountains",home:"cherries",add:"canopy",summary:"stream",guests:"flowers",week:"mountains",langs:"snow",more:"snow",company:"dunes",find:"grove",host:"grove",booked:"flowers",visitor:"canopy"},xt=a=>`Pexels video ${va[a].id} by ${va[a].by}`,St=()=>Object.entries(va).map(([a,e])=>`${e.by} (${e.id})`).join(", ");let Na=null,oe=null;const La={},jt=()=>matchMedia("(orientation: landscape)").matches&&innerWidth>700,Wa=(a,e)=>`bg/${a}${jt()?"-wide":""}.${e}`;function zt(){const a=navigator.connection&&navigator.connection.saveData;return navigator.onLine&&!a&&!matchMedia("(prefers-reduced-motion: reduce)").matches}function Mt(a){const e=document.createElement("div");if(e.className="bg-layer",e.dataset.scene=a,e.innerHTML=`<img class="bg-photo" src="${Wa(a,"jpg")}" alt="">`,zt()){const t=document.createElement("video");t.className="bg-video",t.muted=!0,t.loop=!0,t.playsInline=!0,t.autoplay=!0,t.preload="metadata",t.setAttribute("muted",""),t.setAttribute("playsinline",""),t.src=Wa(a,"mp4"),t.addEventListener("canplay",()=>e.classList.add("video-ready"),{once:!0}),t.addEventListener("error",()=>t.remove(),{once:!0}),e.appendChild(t)}return e}function ve(a){if(!Na||!va[a]||a===oe)return;let e=La[a];e||(e=Mt(a),La[a]=e,Na.appendChild(e));for(const[t,s]of Object.entries(La)){const l=t===a;s.classList.toggle("on",l);const o=s.querySelector("video");o&&(l?o.play().catch(()=>{}):o.pause())}oe=a}function It(a,e){Na=a;const t=new Image;t.onload=()=>{a.classList.add("real"),ve(e)},t.onerror=()=>{a.innerHTML=bt},t.src=Wa(e,"jpg")}const ta=document.getElementById("view"),K=()=>({step:1,guestId:null,inputs:[],results:[]}),i={screen:"home",role:null,guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:K(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}},hosts:null,find:{q:"",ranked:null,semantic:null,thinking:!1},phrasebook:{phrases:null,saved:!1,audioReady:!1},translate:{lang:"it",text:"",result:""},cloud:{uploads:[]},book:{hostId:null,day:null,form:{},done:null},availableDays:[]};async function U(){const[a,e,t,s]=await Promise.all(["guests","entries","bookings","messages"].map(l=>f.all(l)));Object.assign(i,{guests:a,entries:e,bookings:t,messages:s}),i.lastSync=await f.getSetting("lastSync"),i.role=await f.getSetting("role",null),i.availableDays=await f.getSetting("availableDays",[]),i.cloud.uploads=await f.getSetting("cloudUploads",[]),Ba(await f.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await f.getSetting("bigText",!1))}async function J(){try{i.installed=await qe();for(const a of Object.keys(F))i.shared[a]=await _e(F[a].id)}catch(a){console.warn("model check failed",a)}}const ca=a=>i.guests.find(e=>e.id===a),Y=()=>ca(i.add.guestId);function q(){return Ke({guests:i.guests,bookings:i.bookings,installed:i.installed,today:new Date})}function Z(){const a=i.entries.filter(t=>t.status!=="pending"&&tt(t.visitDate||t.createdAt,i.period)),e=nt(a,i.guests);return{s:e,entries:a,text:et(e,w())}}const P=a=>v()==="sw"?Sa(a):E(a),la=a=>N(a)[v()].split(" (")[0],B=a=>{var e;return`<span class="chip plain lang-pill" title="${d(((e=S[a])==null?void 0:e.native)||a)}">${d(x(a,v()))}</span>`};function Lt(a){return a==="pos"?`<span class="chip">${V.pos} ${n("Nzuri","Positive")}</span>`:a==="neg"?`<span class="chip neg">${V.neg} ${n("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${V.unsure} ${n("Haijulikani","Unsure")}</span>`}function Tt(a){return a.consent?`<span class="chip">${n("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${n("Hakuna ruhusa","No consent")}</span>`}function be(a){var e;return(e=S[a])!=null&&e.mt?i.installed.includes(a)?`<span class="chip">${n("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${n("Pakua lugha","Pack needed")}</span>`:""}const xe={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},Bt=a=>xe[a][v()==="sw"?0:1];function qa(a){const e=v();return Object.entries(S).map(([t,s])=>`<option value="${t}" ${t===a?"selected":""}>${d(s[e])}${s.native!==s[e]?` (${d(s.native)})`:""}</option>`).join("")}function Se(a){return[...ue,Ve].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${d(e[v()])}</option>`).join("")}const C=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${n("Nyumbani","Home")}</button>`,Ct='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',le=(a,e,t)=>`<button class="say" data-action="say" data-clip="${a}" data-sw="${d(e)}" data-en="${d(t)}" aria-label="${n("Sikiliza","Listen")}">${Ct}</button>`,V={pos:"😊",neg:"😟",unsure:"🤔"};function je(a,e,{open:t=!1}={}){const s=a.sentences[e],l=ra(s),o=(s.flags||[]).filter(c=>xe[c]),r=s.original&&a.lang!=="en";return`
  <div class="sent">
    ${r?`<div class="orig" lang="${d(a.lang)}">“${d(s.original)}”</div>`:""}
    ${s.en?`<div class="${r?"small muted":""}">${r?"EN: ":""}${d(s.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${s.topic==="other"?"warn":""}">${d(la(s.topic))}</span>
      ${Lt(s.sentiment)}
      ${l?`<span class="chip warn">${n("Angalia","Check")}</span>`:s.confirmed?`<span class="chip plain">${n("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${l&&o.length?`<div class="small muted" style="margin-top:4px">${o.map(Bt).join("; ")}</div>`:""}
    <details ${t||l?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${n("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${n("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${Se(s.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${s.sentiment==="pos"}">${n("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${s.sentiment==="neg"}">${n("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${n("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function Et(a){var t;const e=(t=a.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${d(a.original)}”</div>
    <div class="small muted">${n(`Kiswahili: ${w()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${w()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${n("Mada","Topic")} —</option>${Se(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${n("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${n("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function Dt(a){var o;const e=ca(a.guestId),t=a.box==="liked"?n("Walipenda","Liked"):a.box==="improve"?n("Kuboresha","Could be better"):n("Maoni","Feedback"),s=a.source==="photo"?n("Picha","Photo"):a.source==="voice"?n("Sauti","Voice"):n("Imeandikwa","Typed");let l;return a.status==="pending"?l=`<p class="muted">${n("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${d(a.lang)}">“${d(a.original)}”</p>`:a.status==="swahili"?l=Et(a):(o=a.sentences)!=null&&o.length?l=a.sentences.map((r,c)=>je(a,c)).join(""):l=`<p lang="${d(a.lang)}">“${d(a.original)}”</p><p class="small muted">${n("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${d((e==null?void 0:e.name)||"Mgeni")}</strong> ${B(a.lang)}</div>
      <div class="small muted">${s} · ${t}</div>
    </div>
    ${l}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${n("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const Oa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',At='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',Nt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Wt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',Ot='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',Pt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',Rt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function Ht(a){const e=r=>r.filter(c=>c.id!=="other").slice(0,3).map(c=>la(c.id).toLowerCase()).join(", "),t=e(a.liked),s=e(a.improve),l=[n(`Wageni ${a.guests}.`,`${a.guests} ${a.guests===1?"guest":"guests"}.`)];t&&l.push(n(`Walipenda: ${t}.`,`Loved: ${t}.`)),l.push(s?n(`Kuboresha: ${s}.`,`To improve: ${s}.`):n("Hakuna malalamiko.","No complaints."));const o=Ha(a);return o&&l.push(n(`Wengi wanataka kununua: ${W.find(r=>r.id===o.id).sw}.`,`Many want to buy: ${W.find(r=>r.id===o.id).en}.`)),l.join(" ")}function Ft(){const a=i.entries.filter(u=>u.status==="pending"),{s:e}=Z(),t=i.guests.filter(u=>u.consent&&!i.messages.some(y=>y.guestId===u.id&&y.status==="sent")).length,s=i.bookings.filter(u=>{const y=oa(u.date);return y>=0&&y<=7}),l=q(),o=i.entries.reduce((u,y)=>u+(y.sentences||[]).filter(ra).length,0),r=a.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${n(`Maoni ${a.length} bado hayajachanganuliwa`,`${a.length} new ${a.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
    </div>`:"",c=e.entries?(()=>{let u=0,y=0;for(const j of i.entries)for(const R of j.sentences||[])R.sentiment==="pos"?u++:R.sentiment==="neg"&&y++;return`<div class="faces"><span>${V.pos} <b>${u}</b></span><span>${V.neg} <b>${y}</b></span>${o?`<span>${V.unsure} <b>${o}</b></span>`:""}</div>`})():"",m=e.entries?`
    <div class="card accent">
      <div class="card-title"><h2>${n("Wageni walisema","What guests said")} ${le("ui_summary","Wageni walisema. Bonyeza Sikiliza kusikia muhtasari.","What guests said. Tap Listen to hear the summary.")}</h2><span class="small muted">${ba[i.period]()}</span></div>
      ${c}
      <p class="big-summary" style="margin:0">${d(Ht(e))}</p>
      ${o?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${n(`Sentensi ${o} zinahitaji kuangaliwa.`,`${o} ${o===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${r}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${Nt}${n("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${n("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${n("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${n("Bado hakuna maoni.","No feedback yet.")}</p>
      ${r}
      ${a.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,g=(u,y,j,R,ua="",X="",Te="",Be="")=>`
    <div class="home-row">
    <button class="home-btn" ${u}>
      <span class="role-icon ${ua}" aria-hidden="true">${y}</span>
      <span class="role-text"><strong>${j}</strong><span class="small muted">${R}</span></span>
    </button>${X?le(X,Te,Be):""}</div>`,p=i.bookings.filter(u=>oa(u.date)>=0).sort((u,y)=>new Date(u.date)-new Date(y.date)).slice(0,4),$=p.length?`
    <div class="card">
      <div class="card-title"><h2>${n("Wageni wanaokuja","Reservations")}</h2><button class="btn small secondary" data-action="go" data-screen="week">${n("Zote","All")}</button></div>
      <ul class="list">${p.map(u=>`
        <li class="row between">
          <div><strong>${d(P(u.date))}</strong> · ${d(u.leadName||"Mgeni")} <span class="small muted">· ${n("wageni","guests")} ${d(u.guests)}</span>
            <div class="row small" style="margin-top:4px">${B(u.language)} ${be(u.language)} ${u.status==="requested"?`<span class="chip warn">${n("Inasubiri kampuni","Awaiting the company")}</span>`:`<span class="chip">${n("Imethibitishwa","Confirmed")}</span>`}</div></div>
        </li>`).join("")}</ul>
    </div>`:"",k=s.length?n(`Wageni ${s.reduce((u,y)=>u+(Number(y.guests)||1),0)} siku 7 zijazo`,`${s.reduce((u,y)=>u+(Number(y.guests)||1),0)} guests in the next 7 days`)+(l.download.length?` · ${n("pakua","download")} ${l.download.map(u=>x(u,v())).join(", ")}`:""):n("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${m}
  ${$}
  <div class="stack">
    ${g('data-action="go" data-screen="add"',Oa,n("Ongeza maoni ya mgeni","Add guest feedback"),n("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"),"tile-caramel","ui_add","Ongeza maoni ya mgeni. Piga picha ya kitabu, rekodi sauti, au andika.","Add guest feedback: photograph the guestbook, record a voice note, or type.")}
    ${g('data-action="hand-to-guest"',Ot,n("Mpe mgeni simu aandike","Let a guest write"),n("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"),"tile-leaf","ui_hand","Mpe mgeni simu aandike maoni kwa lugha yake.","Hand the phone to a guest to write in their own language.")}
    ${g('data-action="go" data-screen="guests"',Wt,n("Washukuru wageni","Thank guests"),t?n(`Wageni ${t} wanasubiri`,`${t} waiting`):n("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"),"tile-cherry","ui_thank","Washukuru wageni kwa lugha yao.","Thank guests in their own language.")}
    ${g('data-action="go" data-screen="week"',Rt,n("Wiki ijayo","Next week"),k,"tile-sky","ui_week","Wiki ijayo. Nani anakuja, na lugha gani.","Next week: who is coming, and which language.")}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="go" data-screen="translate">${n("Tafsiri","Translate")}</button>
    <button class="link-btn" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${n("Zaidi","More")}</button>
  </div>`}function Kt(){const e=i.bookings.filter(o=>oa(o.date)>=0).sort((o,r)=>new Date(o.date)-new Date(r.date)).filter(o=>oa(o.date)<=7),t=q(),s=o=>`
    <li>
      <div class="row between">
        <strong>${d(P(o.date))}</strong>
        <span class="badge-num" title="guests">${d(o.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${B(o.language)} ${be(o.language)}
        ${o.status==="requested"?`<span class="chip warn">${n("Inasubiri kampuni","Awaiting the company")}</span>`:""}
        ${o.guide?`<span class="muted">${n("Mwongozaji","Guide")}: ${d(o.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${d(o.leadName||"")}${o.company?` · ${d(o.company)}`:""}${o.referredBy?` · ${n("alipendekezwa na","recommended by")} ${d(o.referredBy)}`:""}</div>
    </li>`,l=[...Array(14)].map((o,r)=>{const c=xa(O(new Date,r+1)),m=i.availableDays.includes(c);return`<button class="chip" data-action="toggle-day" data-day="${c}" aria-pressed="${m}">${d(P(c+"T12:00:00"))}</button>`}).join("");return`
  ${C()}
  <h1>${n("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <h2>${n("Siku unazoweza kupokea wageni","Days you can take guests")}</h2>
    <p class="small muted">${n("Wageni wanaziona wanapotafuta mahali, na kampuni ya utalii inapanga kulingana nazo.","Visitors see these when they search for a place, and the tour company books around them.")}</p>
    <div class="row">${l}</div>
  </div>

  <div class="card">
    <button class="btn block" data-action="sync" ${i.online?"":"disabled"}>${n("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${i.lastSync?`${n("Mara ya mwisho","Last updated")}: ${d(new Date(i.lastSync).toLocaleString())}`:n("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${i.online?"":` · ${n("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${e.length?`
  <div class="card">
    <h2>${n("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${e.map(s).join("")}</ul>
  </div>`:`
  <div class="notice">${n("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${n("Lugha za kuandaa","Languages to prepare")}</h2>
    ${t.download.length?`
      <div class="row">${t.download.map(o=>B(o)).join("")}</div>
      <p class="small muted">${n(`MB ${t.downloadMB}. Tumia Wi-Fi.`,`${t.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${i.online?"":"disabled"}>${n("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${n("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${t.removable.length?`
      <hr>
      <p>${n("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${t.removable.map(o=>B(o)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${n(`Futa (MB ${t.freeMB})`,`Delete (frees ${t.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${n("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  `}function qt(){const a=i.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${a.step>=t?"on":""}"></span>`).join("")}</div>`;return a.step===1?C()+e+ze():a.step===2?C()+e+_t():e+Ut()}function ze(){const a=i.bookings.filter(t=>{const s=oa(t.date);return s<=1&&s>=-14}).filter(t=>!i.guests.some(s=>s.bookingId===t.id)).sort((t,s)=>new Date(s.date)-new Date(t.date)),e=i.guests.slice().sort((t,s)=>new Date(s.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${n("Mgeni ni nani?","Who is the guest?")}</h1>

  ${a.length?`
  <div class="card">
    <h2>${n("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${d(t.leadName||"Mgeni")}</strong> ${B(t.language)}<div class="small muted">${d(P(t.date))} · ${n("wageni","guests")} ${d(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${n("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${n("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${qa("en")}</select></label>
      <label class="field">${n("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${xa(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${n(`Mgeni aliweka alama: ${w()} anaweza kuhifadhi mawasiliano yangu`,`Guest ticked: ${w()} may keep my contact details`)}</span></label>
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
        <div><strong>${d(t.name)}</strong> ${B(t.language)}<div class="small muted">${d(P(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function _t(){var o;const a=Y();if(!a)return i.add.step=1,ze();const e=((o=S[a.language])==null?void 0:o.mt)&&!i.installed.includes(a.language),t=i.add.inputs.some(r=>r.status==="ready"&&(r.text||"").trim()),s=i.add.inputs.some(r=>r.status==="working"),l=r=>{var k;const c=`
      <select data-change="box" data-id="${r.id}" aria-label="Box">
        <option value="liked" ${r.box==="liked"?"selected":""}>${n("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${r.box==="improve"?"selected":""}>${n("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${r.box==="unknown"?"selected":""}>${n("Haijulikani","Not sure")}</option>
      </select>`,m=r.langHint?`
      <div class="notice warn small">${n(`Inaonekana ni ${x(r.langHint,"sw")}, si ${x(a.language,"sw")}.`,`This looks like ${x(r.langHint,"en")}, not ${x(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${r.langHint}">${n(`Badilisha kuwa ${x(r.langHint,"sw")}`,`Switch to ${x(r.langHint,"en")}`)}</button></div>
      </div>`:"";let g="";r.imageURL&&(g=`<img class="preview-img" src="${r.imageURL}" alt="Photo of the guestbook box">`),r.audioURL&&(g=`<audio controls src="${r.audioURL}" style="width:100%"></audio>`);let p="";return r.status==="working"?p=`<p class="muted">${n("Inasoma…","Reading…")}</p>`:r.status==="error"?p=`<div class="notice neg small">${n("Imeshindwa","Failed")}: ${d(r.error)}</div>`:p=`
        ${(k=r.lowWords)!=null&&k.length?`<div class="notice warn small"><strong>${n("Angalia maneno haya","Check these words")}</strong>${r.lowWords.slice(0,20).map(u=>`<mark class="low">${d(u)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${r.source==="voice"?n("Alichosema mgeni","What the guest said"):n("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${r.id}" lang="${d(a.language)}">${d(r.text)}</textarea></label>
        ${r.source==="voice"&&a.language!=="en"&&a.language!=="sw"?`
        <label class="field small">${n("Kwa Kiingereza (kutoka kwa modeli ya sauti)","In English (from the voice model)")}
          <textarea data-input="input-english" data-id="${r.id}" style="min-height:80px">${d(r.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${r.source==="photo"?n("Picha","Photo"):r.source==="voice"?n("Sauti","Voice"):n("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${r.id}">${n("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${g}
        <label class="field small">${n("Kisanduku","Which box")}${c}</label>
        ${m}
        ${p}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${d(a.name)}</strong> ${B(a.language)}<div class="small muted">${d(P(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${n("Badilisha","Change")}</button>
    </div>
  </div>

  ${e?`<div class="notice warn">${n(`Lugha ya ${x(a.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${$a}).`,`The ${x(a.language,"en")} pack is not on this phone yet. Analysing needs internet once (${$a} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${Oa}<span class="btn-col">${n("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${Oa}<span class="btn-col">${n("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${i.recording?"danger":"secondary"}" data-action="record">
      ${i.recording?'<span class="rec-dot"></span>':At}<span class="btn-col">${i.recording?n("Simamisha","Stop"):n("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${Pt}<span class="btn-col">${n("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${n("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${i.add.inputs.map(l).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!s?"":"disabled"}>${n("Changanua","Analyse")}</button>`}function Ut(){const a=i.add.results.map(s=>i.entries.find(l=>l.id===s)).filter(Boolean),e=Y(),t=a.reduce((s,l)=>s+(l.sentences||[]).filter(ra).length,0);return`
  <h1>${n("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${n(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} ${t===1?"sentence needs":"sentences need"} a check`)}</strong>${n("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${n("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(Dt).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${n("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${n(`Ongeza maoni mengine ya ${d((e==null?void 0:e.name)||"mgeni")}`,`Add more for ${d((e==null?void 0:e.name)||"this guest")}`)}</button>
  </div>`}const ba={week:()=>n("Wiki hii","This week"),month:()=>n("Mwezi huu","This month"),all:()=>n("Zote","All time")};function Gt(){const a=i.entries.filter(g=>g.status==="pending"),{s:e,entries:t,text:s}=Z(),l=Object.entries(ba).map(([g,p])=>`<button class="chip" data-action="period" data-period="${g}" aria-pressed="${i.period===g}">${p()}</button>`).join(""),o=(g,p)=>g.filter($=>$.id!=="other").map($=>{const k=e.guests?Math.round($.guests/e.guests*100):0,u=$.quotes.slice(0,5).map(y=>`
      <blockquote class="q">${y.original&&y.lang!=="en"?`<div class="orig" lang="${d(y.lang)}">“${d(y.original)}”</div><div class="trans">EN: ${d(y.en)}</div>`:`<div class="orig">“${d(y.en)}”</div>`}
      ${y.flagged?`<span class="chip warn" style="margin-top:4px">${n("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${d(la($.id))}</strong><span class="badge-num ${p?"neg":""}">${$.guests}</span></div>
        <div class="bar ${p?"neg":""}"><span style="width:${k}%"></span></div>
        <details class="quotes"><summary>${n("Maneno ya wageni","What guests said")} (${$.quotes.length})</summary>${u}</details>
      </div>`}).join(""),r=[];for(const g of t)(g.sentences||[]).forEach((p,$)=>{ra(p)&&r.push([g,$])});const c=Fa(e,`${ba[i.period]()}`,w()),m=v();return`
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
    <div class="card-title"><h2>${n(`Kwa ${w()}`,`For ${w()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${n("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${m}">${s[m].map(g=>`<p>${d(g)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${n("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${e.liked.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Walichopenda","What they liked")}</h2>${o(e.liked,!1)}</div>`:""}
  ${e.improve.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Wanachotaka kiboreshwe","What they want improved")}</h2>${o(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${n("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(g=>{const p=W.find($=>$.id===g.id);return`<div class="topic-row"><strong>${d(p[m])}</strong><span class="badge-num">${g.guests}</span></div>`}).join("")}
  </div>`:""}

  ${r.length?`
  <div class="card">
    <h2>${n("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${r.map(([g,p])=>{var $;return`<div class="small muted" style="margin-top:8px">${d((($=ca(g.guestId))==null?void 0:$.name)||"")} · ${d(x(g.lang,m))}</div>${je(g,p,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${n("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${n("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${d(c)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${i.shareOk?"checked":""}>
      <span>${n("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <div class="grid2" style="margin-top:10px">
      <button class="btn" id="share-btn" data-action="share" ${i.shareOk?"":"disabled"}>${n("Shiriki","Share")}</button>
      <button class="btn secondary" id="cloud-btn" data-action="cloud-upload" ${i.shareOk?"":"disabled"}>${n("Pakia kwenye wingu","Upload to cloud")}</button>
    </div>
    ${i.cloud.uploads.length?`<p class="small muted" style="margin:8px 0 0">✓ ${n("Imepakiwa","Uploaded")} ${d(new Date(i.cloud.uploads[i.cloud.uploads.length-1].at).toLocaleString())} · ${n("maoni","entries")} ${i.cloud.uploads[i.cloud.uploads.length-1].entries} → ${d(i.cloud.uploads[i.cloud.uploads.length-1].to)}</p>`:`<p class="small muted" style="margin:8px 0 0">${n("Kupakia kunatuma ripoti hii (jumla tu) kwa kampuni ya utalii na ofisi ya utalii, mtandao ukiwepo.","Uploading sends this report (counts only) to the tour company and the tourism office when there is internet.")}</p>`}
  </div>`}
  `}function Vt(){const a=i.guests.slice().sort((e,t)=>new Date(t.visitDate)-new Date(e.visitDate));return a.length?`
  ${C()}
  <h1>${n("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${n("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const t=i.entries.filter(o=>o.guestId===e.id).length,s=i.messages.some(o=>o.guestId===e.id&&o.status==="sent"),l=i.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${d(e.name)}</strong> ${B(e.language)}${e.synthetic?` <span class="chip plain">${n("mfano","example")}</span>`:""}</div>
          <span class="small muted">${d(P(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Tt(e)} <span class="muted">${n("maoni","entries")}: ${t}</span>
          ${s?`<span class="chip">${n("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${n("Alipendekezwa na","Recommended by")}: ${d(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${l?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${n("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${n("Futa","Delete")}</button>
        </div>
        ${l?Jt(e):""}
      </li>`}).join("")}</ul></div>`:`${C()}<h1>${n("Wageni","Guests")}</h1>
      <div class="card"><p>${n("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button></div>`}function Jt(a){const e=st(i.entries,a.id),t=ae(a,e,w()),s=a.contact||{},l=ee[t.lang]||ee.en;let o;a.consent?s.email?o=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(s.email)}?subject=${encodeURIComponent(l)}&body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:s.phone?o=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(s.phone)}?body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:o=`<div class="notice small">${n("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:o=`<div class="notice warn small">${n("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const r=v();return`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${n(`Hakuna kiolezo cha ${x(a.language,"sw")} bado; tumetumia Kiingereza.`,`No ${x(a.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${n(`Kwa ${x(t.lang,"sw")}`,`In ${x(t.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${d(t.text)}</p></div>
    ${t.lang!==r?`<div class="card flat" lang="${r}"><div class="small muted">${n("Maana yake","What it says")}</div><p style="margin:6px 0 0">${d(r==="sw"?t.sw:ae({...a,language:"en"},e,w()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${e?n(`Mada aliyopenda: ${la(e)}`,`Liked topic: ${la(e)}`):n("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${o}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${n("Nakili","Copy")}</button>
  </div>`}function Yt(){const a=q(),e=v(),t=l=>{const o=S[l],r=i.installed.includes(l),c=[];return r&&c.push(`<span class="chip">${n("Imepakuliwa","On phone")}</span>`),a.keep.includes(l)&&c.push(`<span class="chip">${n("Inakaa daima","Kept")}</span>`),a.needed.includes(l)&&c.push(`<span class="chip warn">${n("Wiki ijayo","Needed next week")}</span>`),r&&a.removable.includes(l)&&c.push(`<span class="chip plain">${n("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${d(o[e])}</strong> <span class="muted small">${d(o.native)} · ${$a} MB</span>
          <div class="row" style="margin-top:4px">${c.join("")}</div></div>
        ${r?`<button class="btn small danger" data-action="delete-pack" data-lang="${l}">${n("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${l}" ${i.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`},s=l=>{const o=F[l],r=i.shared[l];return`
      <div class="pack">
        <div><strong>${d(o[e])}</strong> <span class="muted small">${o.mb} MB</span></div>
        ${r?`<span class="chip">${n("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${l}" ${i.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`};return`
  ${C()}
  <h1>${n("Lugha","Languages")}</h1>
  <p class="small muted">${n(`Kiswahili na Kiingereza daima, pamoja na lugha ${Ya} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Ya} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${n("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${n("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(F).map(s).join("")}
  </div>

  <div class="card">
    <h2>${n("Lugha za wageni","Guest languages")}</h2>
    ${a.usedDefaults?`<p class="small muted">${n("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${a.recommend.length?`
      <div class="notice small" style="margin-top:4px">${n(`Pakua ukiwa na Wi-Fi: ${a.recommend.map(l=>S[l].sw).join(", ")} (MB ${a.recommendMB}).`,`Download on Wi-Fi: ${a.recommend.map(l=>S[l].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${i.online?"":"disabled"}>${n("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${Ge().map(t).join("")}
  </div>`}function Zt(){const a=i.translate,e=v(),t=Qt.map(s=>`<li class="row between"><div><strong lang="${a.lang}">${d(s[a.lang]||s.en)}</strong><div class="small muted">${d(s[e]||s.en)}</div></div><button class="btn small secondary" data-action="copy-text" data-text="${d(s[a.lang]||s.en)}">${n("Nakili","Copy")}</button></li>`).join("");return`
  ${C()}
  <h1>${n("Tafsiri","Translate")}</h1>
  <div class="card">
    <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="tr-lang" data-change="tr-lang">${qa(a.lang)}</select></label>
    <label class="field" style="margin-top:10px">${n("Mgeni alisema au aliandika","What the guest said or wrote")}<textarea id="tr-text" lang="${a.lang}" placeholder="${n("Andika hapa…","Type or paste here…")}">${d(a.text)}</textarea></label>
    <button class="btn block" style="margin-top:10px" data-action="translate-run">${n("Tafsiri kwa Kiingereza","Translate to English")}</button>
    ${a.result?`<div class="card flat" style="margin-top:12px"><div class="small muted">${n("Kwa Kiingereza","In English")}</div><p style="margin:6px 0 0">${d(a.result)}</p></div>`:""}
    <p class="small muted" style="margin:8px 0 0">${n("Inafanyika kwenye simu hii, bila mtandao, kwa pakiti ya lugha. Hakuna tafsiri ya mashine kwenda Kiswahili bado; misemo hapa chini imeandikwa na watu.","Runs on this phone, offline, with the language pack. There is no machine translation into Swahili yet; the phrases below are human-written.")}</p>
  </div>
  <div class="card">
    <h2>${n("Mwambie mgeni","Say to the guest")} <span class="small muted">${d(x(a.lang,e))}</span></h2>
    <ul class="list">${t}</ul>
  </div>`}const Qt=[{sw:"Karibu!",en:"Welcome!",it:"Benvenuti!",fr:"Bienvenue !",de:"Willkommen!",zh:"欢迎！",es:"¡Bienvenidos!",pl:"Witamy!"},{sw:"Chakula kiko tayari.",en:"Lunch is ready.",it:"Il pranzo è pronto.",fr:"Le déjeuner est prêt.",de:"Das Mittagessen ist fertig.",zh:"午饭准备好了。",es:"La comida está lista.",pl:"Obiad gotowy."},{sw:"Tafadhali andika maoni yako kwenye kitabu.",en:"Please write your feedback in the book.",it:"Scrivete le vostre impressioni nel libro, per favore.",fr:"Écrivez vos impressions dans le livre, s’il vous plaît.",de:"Bitte schreiben Sie Ihre Eindrücke ins Buch.",zh:"请把您的感想写在留言本上。",es:"Por favor, escriban sus comentarios en el libro.",pl:"Proszę wpisać swoje wrażenia do księgi."},{sw:"Kahawa hii ni ya kupeleka nyumbani.",en:"This coffee is to take home.",it:"Questo caffè è da portare a casa.",fr:"Ce café est à emporter.",de:"Dieser Kaffee ist zum Mitnehmen.",zh:"这包咖啡可以带回家。",es:"Este café es para llevar.",pl:"Ta kawa jest na wynos."},{sw:"Asante kwa kuja. Karibu tena!",en:"Thank you for coming. Welcome back any time!",it:"Grazie per essere venuti. Tornate quando volete!",fr:"Merci d’être venus. Revenez quand vous voulez !",de:"Danke für Ihren Besuch. Kommen Sie gern wieder!",zh:"谢谢光临，欢迎再来！",es:"Gracias por venir. ¡Vuelvan cuando quieran!",pl:"Dziękujemy za wizytę. Zapraszamy ponownie!"},{sw:"Njia ni mbaya; tutawasaidia.",en:"The road is bad; we will help you.",it:"La strada è brutta; vi aiutiamo noi.",fr:"La route est mauvaise ; nous vous aiderons.",de:"Der Weg ist schlecht; wir helfen Ihnen.",zh:"路不好走，我们会帮您。",es:"El camino está mal; les ayudaremos.",pl:"Droga jest zła; pomożemy."}];async function Xt(){var e,t;const a=i.translate;if(a.text=((e=document.getElementById("tr-text"))==null?void 0:e.value)||"",!a.text.trim())return b(n("Andika kitu kwanza","Type something first"));if(a.lang==="en")return a.result=a.text.trim(),h();if(a.lang==="sw")return a.result=n("Hii ni Kiswahili tayari.","This is already Swahili; the host reads it directly."),h();if(!((t=S[a.lang])!=null&&t.mt&&!i.installed.includes(a.lang)&&!await Q([["pack",a.lang]]))){A(n("Inatafsiri","Translating"));try{const s=await me(a.text.trim(),a.lang,_);a.result=s.english}catch(s){b(s.message,6e3)}finally{T(),await J(),h()}}}function an(){const a=i.guests.some(e=>e.synthetic);return`
  ${C()}
  <h1>${n("Zaidi","More")}</h1>

  <div class="card">
    <h2>${n("Mwenyeji","Host")}</h2>
    <label class="field">${n("Jina lako (linaonekana kwa wageni na kwenye ujumbe)","Your name (shown to guests and in messages)")}
      <input type="text" id="host-name" value="${d(w())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${n("Hifadhi jina","Save name")}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?n("Herufi za kawaida","Normal text size"):n("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${n("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(w())}" target="_blank" rel="noopener">${n("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
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
    <p class="small muted">${n("Video za mandhari: Pexels (leseni ya bure)","Background videos: Pexels, free licence")} — ${d(St())}.</p>
    <div class="stack">
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${n("Msimbo, vyanzo vya data na mipaka","Code, data sources and limits")}</a>
    </div>
  </div>`}function Pa(){var s;const a=l=>{var o,r;return((r=(o=document.getElementById(l))==null?void 0:o.value)==null?void 0:r.trim())||""},e=!!((s=document.getElementById("c-consent"))!=null&&s.checked),t=a("c-date");return{id:M("bk"),date:D(t||O(new Date,3)),guests:Math.max(1,Number(a("c-guests"))||1),leadName:a("c-name")||"Mgeni",language:a("c-lang")||"en",guide:a("c-guide"),company:"",consent:e,email:e?a("c-email"):""}}function en(){const a=i.bookings.filter(c=>c.status==="requested").sort((c,m)=>new Date(c.date)-new Date(m.date)),e=i.bookings.filter(c=>c.status==="confirmed"&&c.source==="visitor").slice(-4),t=(i.hosts||[]).find(c=>c.id==="noor")||{meet:"Materuni village office",phone:""},s=c=>ja(c),l=c=>at({...c,hostName:`${w()}’s farm`,meet:t.meet}),o=c=>`
    <li>
      <div class="row between"><strong>${d(c.leadName)}</strong><span class="badge-num">${d(c.guests)}</span></div>
      <div class="row small" style="margin-top:6px">${d(P(c.date))} ${B(c.language)}${c.referredBy?`<span class="muted">${n("alipendekezwa na","recommended by")} ${d(c.referredBy)}</span>`:""}${c.consent&&c.email?`<span class="muted">${d(c.email)}</span>`:""}</div>
      ${c.status==="requested"?`<button class="btn small block" style="margin-top:8px" data-action="company-confirm" data-id="${c.id}">${n("Thibitisha: SMS kwa mwenyeji na kwa mgeni","Confirm: SMS to the host and to the tourist")}</button>`:`
        <div class="link-line"><span class="chip">${d(w())}</span><span class="link-arrow">⇄</span><span class="chip plain">${d(c.company||"Ondera Coffee Trails")}</span><span class="link-arrow">⇄</span><span class="chip">${d(c.leadName)}</span></div>
        <div class="small muted" style="margin:6px 0 4px">${n("SMS kwa mwenyeji (Kiswahili)","SMS to the host (Swahili)")}</div>
        <div class="sms small">${d(s(c))}</div>
        <a class="btn small secondary block" style="margin-top:6px" href="sms:${encodeURIComponent(t.phone||"")}?body=${encodeURIComponent(s(c))}" data-action="sms-sent" data-id="${c.id}" data-to="host">${n(`Tuma kwa ${w()}`,`Send to ${w()}`)} ${c.smsHost?"✓":""}</a>
        <div class="small muted" style="margin:10px 0 4px">${n("SMS kwa mgeni","SMS to the tourist")} (${d(x(c.language,v()))})</div>
        <div class="sms small">${d(l(c))}</div>
        <a class="btn small secondary block" style="margin-top:6px" href="sms:?body=${encodeURIComponent(l(c))}" data-action="sms-sent" data-id="${c.id}" data-to="tourist">${n(`Tuma kwa ${d(c.leadName)}`,`Send to ${d(c.leadName)}`)} ${c.smsTourist?"✓":""}</a>`}
    </li>`;return(a.length||e.length?`
  <div class="card">
    <h2>${n("Maombi na miunganisho","Requests and connections")}</h2>
    <p class="small muted">${n("Ombi la mgeni linakuja hapa. Ukithibitisha, wote wawili wanapata SMS: mwenyeji kwa Kiswahili, mgeni kwa lugha yake. Hakuna upande unaohitaji intaneti.","A visitor’s request lands here. When you confirm, both sides get an SMS: the host in Swahili, the tourist in their language. Neither side needs internet.")}</p>
    <ul class="list">${[...a,...e].map(o).join("")}</ul>
  </div>`:"")+tn()}function tn(){const a=i.cloud.uploads.slice(-3).reverse(),e=i.entries.filter(s=>s.source==="visitor"),t=new Set(e.map(s=>s.guestId)).size;return!a.length&&!t?"":`
  <div class="card">
    <h2>${n("Maoni yaliyopokelewa","Feedback received")}</h2>
    ${a.length?a.map(s=>`
      <div class="small muted" style="margin-top:6px">${n("Kutoka kwa mwenyeji","From the host")} ${d(s.host)} · ${d(new Date(s.at).toLocaleDateString())} · ${n("maoni","entries")} ${s.entries}</div>
      <div class="sms small" style="margin-top:4px">${d(s.report)}</div>`).join(""):`<p class="small muted">${n("Mwenyeji bado hajapakia ripoti.","The host has not uploaded a report yet.")}</p>`}
    ${t?`<p class="small" style="margin:10px 0 0">${n(`Kutoka kwa wageni: watu ${t} waliandika kwenye simu ya mwenyeji (jumla tu, hakuna majina).`,`From tourists: ${t} wrote on the host’s phone (counts only, no names).`)}</p>`:""}
  </div>`}function nn(){i.hosts||Me().then(h);const a=xa(O(new Date,3)),{s:e}=Z(),t=e.entries?Fa(e,n("Mfano","Example"),w()):null;return(i.role==="company"?`<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${n("Badilisha upande","Switch side")}</button>`:C())+en()+mt({langOptionsHTML:qa("en"),today:a,sms:ja({date:D(a),guests:2,language:"en",guide:""}),report:t})}async function Me(){if(i.hosts)return i.hosts;try{const a=await fetch("data/hosts.json");i.hosts=(await a.json()).hosts}catch{i.hosts=[]}return i.hosts}const _a=a=>(i.hosts||[]).find(e=>e.id===a);let re=null;function Ua(){i.hosts||Me().then(h);const a=i.hosts||[],e=ft(i.find.q,a,i.guests,v(),i.find.semantic);return kt({q:i.find.q,hosts:a,lang:v(),loading:!i.hosts,ranked:e,thinking:i.find.thinking})}async function sn(a){var e;if(!(!i.shared.topics||!i.hosts||!a.trim())){i.find.thinking=!0;try{const t=[a,...i.hosts.map(r=>`${r.name}. ${r.tags.join(", ")}. ${r.blurb}`)],s=await Ue(t),l=s[0],o={};i.hosts.forEach((r,c)=>{const m=s[c+1];let g=0;for(let p=0;p<l.length;p++)g+=l[p]*m[p];o[r.id]=Math.max(0,g)}),i.find.semantic=o}catch{}finally{if(i.find.thinking=!1,i.screen==="find"){const t=(e=document.getElementById("find-q"))==null?void 0:e.selectionStart;h();const s=document.getElementById("find-q");s&&(s.focus(),t!=null&&s.setSelectionRange(t,t))}}}}function on(){const a=_a(i.book.hostId);if(!a)return i.screen="find",Ua();const e=a.id==="noor"?Z().s:null,t=pt(a,a.id==="noor"?i.availableDays:null),s=(i.book.form.referredBy||"").trim().toLowerCase(),l=s&&a.id==="noor"?i.guests.find(o=>(o.name||"").toLowerCase().split(" ")[0]===s.split(" ")[0]):null;return yt({host:a,days:t,selected:i.book.day,summaryLine:wt(a,e,v()),form:i.book.form,lang:v(),knownGuest:l})}function ln(){const a=_a(i.book.hostId);return!a||!i.book.done?(i.screen="find",Ua()):(i.phrasebook.phrases||rn(),$t({host:a,booking:i.book.done,lang:v(),phrasebook:i.phrasebook.phrases,saved:i.phrasebook.saved,audioReady:i.phrasebook.audioReady}))}async function rn(){try{const a=await fetch("data/phrasebook-sw.json");i.phrasebook.phrases=(await a.json()).phrases,i.phrasebook.saved=await f.getSetting("phrasebookSaved",!1);const e=await da();i.phrasebook.audioReady=!!(e&&i.phrasebook.phrases.every(t=>e.files[t.id]))}catch{i.phrasebook.phrases=[]}i.screen==="booked"&&h()}async function dn(){A(n("Inapakua misemo","Downloading phrases"));try{if("caches"in window){const a=await caches.open("kitabu-phrases-v1");await a.add("data/phrasebook-sw.json").catch(()=>null);const e=await da();e&&await Promise.all(i.phrasebook.phrases.map(t=>e.files[t.id]?a.add(`audio/sw/${e.files[t.id]}`).catch(()=>null):null))}i.phrasebook.saved=!0,await f.setSetting("phrasebookSaved",!0),b(`✓ ${n("Misemo iko kwenye simu yako","Phrases saved on your phone")}`)}finally{T(),h()}}function Ga(){var e;const a=t=>{var s;return((s=document.getElementById(t))==null?void 0:s.value)||""};document.getElementById("bk-v-name")&&(i.book.form={guests:Number(a("bk-v-guests"))||2,language:a("bk-v-lang")||"en",name:a("bk-v-name"),email:a("bk-v-email"),consent:!!((e=document.getElementById("bk-v-consent"))!=null&&e.checked),referredBy:a("bk-v-ref")})}async function cn(){Ga();const a=_a(i.book.hostId),e=i.book.form;if(!i.book.day)return b(n("Chagua siku","Pick a day"));if(!e.name.trim())return b(n("Andika jina lako","Add your name"));const t={id:M("bk"),date:D(i.book.day),guests:Math.max(1,e.guests),leadName:e.name.trim(),language:e.language,guide:a.guide,company:a.company,consent:e.consent,email:e.consent?e.email.trim():"",referredBy:e.referredBy.trim(),hostId:a.id,status:"requested",source:"visitor",createdAt:new Date().toISOString()};await f.put("bookings",t),i.bookings.push(t),i.book.done=t,z("booked")}function un(){const a=e=>{var t;return((t=document.getElementById(e))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(i.visitor.draft={name:a("v-name"),liked:a("v-liked"),improve:a("v-improve"),email:a("v-email")})}async function mn(){var g,p,$;const a=k=>{var u,y;return((y=(u=document.getElementById(k))==null?void 0:u.value)==null?void 0:y.trim())||""},e=i.visitor.lang,t=we(e),s=a("v-liked"),l=a("v-improve");if(!s&&!l){b(t.needText);return}const o=!!((g=document.getElementById("v-consent"))!=null&&g.checked),r=[(p=document.getElementById("v-buy-coffee"))!=null&&p.checked?"coffee":null,($=document.getElementById("v-buy-souvenir"))!=null&&$.checked?"souvenir":null].filter(Boolean),c={id:M("g"),name:a("v-name")||"Mgeni",language:e,visitDate:D(new Date),consent:o,contact:o?{email:a("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await f.put("guests",c);let m=!0;for(const[k,u]of[["liked",s],["improve",l]])u&&(await f.put("entries",{id:M("fb"),guestId:c.id,lang:e,source:"visitor",box:k,original:u,status:"pending",sentences:[],products:[],declaredProducts:m?r:[],visitDate:c.visitDate,createdAt:new Date().toISOString()}),m=!1);await U(),i.visitor={lang:e,saved:!0,draft:{}},h(),window.scrollTo(0,0)}let I=null,L=null;function Va(){var e;if(I||(I=document.createElement("div"),I.className="guide-backdrop hidden",I.setAttribute("role","dialog"),I.setAttribute("aria-modal","true"),I.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(I),L=document.createElement("div"),L.className="spot hidden",L.innerHTML='<span class="spot-hand">👆</span>',document.body.appendChild(L)),I.classList.toggle("hidden",!i.guide.open),!i.guide.open){I.innerHTML="",L.classList.add("hidden");return}I.innerHTML=rt(i.guide.step),(e=I.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||e.focus();const a=H[i.guide.step].target&&document.querySelector(H[i.guide.step].target);a?(a.scrollIntoView({block:"start",behavior:"smooth"}),setTimeout(()=>{const t=a.getBoundingClientRect();L.style.left=`${t.left-6}px`,L.style.top=`${t.top-6}px`,L.style.width=`${t.width+12}px`,L.style.height=`${t.height+12}px`,L.classList.remove("hidden")},350)):L.classList.add("hidden")}function sa(a=0){i.guide={open:!0,step:a},Va()}async function za(){i.guide.open=!1,Va(),await f.setSetting("guideSeen",!0)}async function pn(){await za();const a="demo_quick";if(!ca(a)){const e={id:a,name:"Emma (mfano)",language:"en",visitDate:D(O(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",e);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const s of["liked","improve"])await f.put("entries",{id:`${a}_${s}`,guestId:a,lang:"en",source:"typed",box:s,original:t[s],status:"pending",sentences:[],products:[],visitDate:e.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await U()}i.period="all",i.screen="home",h(),await Le()}const gn={choose:ct,home:Ft,add:qt,summary:Gt,guests:Vt,week:Kt,langs:Yt,more:an,company:nn,translate:Zt,find:Ua,host:on,booked:ln,visitor:()=>ut(i.visitor.lang,i.visitor.saved,i.visitor.draft)};let de=null;function h(){const a=i.screen;document.body.classList.toggle("mode-visitor",a==="visitor"||a==="choose"),document.body.classList.toggle("mode-choose",a==="choose"),document.body.classList.toggle("home",a==="home");const e=a!==de;de=a,ve(Aa[a]||"grove"),ta.innerHTML=gn[a]()+(document.getElementById("nature").classList.contains("real")?`<div class="credit">${d(xt(Aa[a]||"grove"))}</div>`:""),ta.classList.remove("enter"),e&&(ta.offsetWidth,ta.classList.add("enter")),document.getElementById("net").textContent=i.online?n("Mtandaoni","Online"):n("Nje ya mtandao","Offline");const t=document.getElementById("lang-btn");t&&(t.textContent=v()==="sw"?"English":"Kiswahili"),i.guide.open&&Va(),a==="langs"&&Pe().then(s=>{const l=document.getElementById("storage-line");l&&s&&(l.textContent=n(`Nafasi iliyotumika: MB ${s.usedMB} kati ya MB ${s.quotaMB}`,`Storage used: ${s.usedMB} MB of ${s.quotaMB} MB`))})}function z(a){i.screen=a,a!=="add"&&(i.add=K()),h(),window.scrollTo(0,0)}async function Q(a){if(!a.length)return!0;const e=a.reduce((s,[l,o])=>s+(l==="pack"?$a:F[o].mb),0);if(!navigator.onLine)return b(n("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const t=a.map(([s,l])=>s==="pack"?x(l,v()):F[l][v()]).join(", ");if(!confirm(n(`Pakua mara moja: takriban MB ${e} (${t}). Endelea?`,`One-time download of about ${e} MB (${t}). Continue?`)))return!1;for(const[s,l]of a)A(n("Inapakua","Downloading")+` · ${s==="pack"?x(l,v()):F[l][v()]}`),s==="pack"?await Re(l,_):await He(l,_);return T(),await J(),!0}async function Ta(a){const e=a.filter(t=>{var s;return((s=S[t])==null?void 0:s.mt)&&!i.installed.includes(t)}).map(t=>["pack",t]);await Q(e)&&(b(n("Lugha ziko tayari","Packs ready")),h())}async function ce(a){if(!a.length)return;const e=a.map(t=>x(t,v())).join(", ");if(confirm(n(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${e}? They can be downloaded again later.`))){for(const t of a)await Fe(S[t].mt);await J(),b(n("Imefutwa","Deleted")),h()}}async function hn(){if(!navigator.onLine)return b(n("Hakuna mtandao","Offline"));A(n("Inapokea ratiba","Receiving the schedule"));const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,s=e.bookings.map(o=>({id:o.id,date:D(O(t,o.dayOffset)),guests:o.guests,leadName:o.leadName,language:o.language,guide:o.guide,company:e.company,consent:!!o.consent,email:o.consent&&o.email||"",synthetic:!0}));await f.putMany("bookings",s),i.bookings=await f.all("bookings"),i.lastSync=new Date().toISOString(),await f.setSetting("lastSync",i.lastSync),T();const l=q();b(l.download.length?n(`Ratiba imepokelewa. Pakua: ${l.download.map(o=>S[o].sw).join(", ")}`,`Schedule received. Download: ${l.download.map(o=>S[o].en).join(", ")}`):n("Ratiba imepokelewa","Schedule received")),h()}async function fn(){const a=l=>{var o,r;return((r=(o=document.getElementById(l))==null?void 0:o.value)==null?void 0:r.trim())||""},e=a("bk-date");if(!e)return b(n("Weka tarehe","Add a date"));const t=document.getElementById("bk-consent").checked,s={id:M("bk"),date:D(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:t,email:t?a("bk-email"):""};await f.put("bookings",s),i.bookings.push(s),b(n("Imehifadhiwa","Saved")),h()}async function kn(a){const e=i.bookings.find(s=>s.id===a);if(!e)return;let t=i.guests.find(s=>s.bookingId===e.id);t||(t={id:M("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await f.put("guests",t),i.guests.push(t)),i.add=K(),i.add.guestId=t.id,i.add.step=2,h()}async function wn(){const a=s=>{var l,o;return((o=(l=document.getElementById(s))==null?void 0:l.value)==null?void 0:o.trim())||""},e=document.getElementById("ng-consent").checked,t={id:M("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:D(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await f.put("guests",t),i.guests.push(t),i.add=K(),i.add.guestId=t.id,i.add.step=2,h(),window.scrollTo(0,0)}async function yn(a,e){const t=Y(),s={id:M("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};i.add.inputs.push(s),h();try{A(n("Inasoma picha","Reading the photo"));const l=await We(a,t.language,_);Object.assign(s,{text:l.text,lowWords:l.lowWords,confidence:l.confidence,status:"ready"}),l.text||(s.status="error",s.error=n("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const o=await Oe(l.text);o&&o!==t.language&&(s.langHint=o)}catch(l){s.status="error",s.error=l.message}finally{T(),h()}}async function Ie(a){const e=Y();if(!i.shared.voice&&!await Q([["shared","voice"]]))return;const t={id:M("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};i.add.inputs.push(t),h();try{A(n("Inasikiliza","Listening"));const s=await Ne(a,e.language,_);Object.assign(t,{text:s.original,english:s.english,status:"ready"}),i.shared.voice=!0}catch(s){t.status="error",t.error=s.message}finally{T(),h()}}let fa=null;async function $n(){var s;if(fa){fa.stop();return}if(!((s=navigator.mediaDevices)!=null&&s.getUserMedia)||!window.MediaRecorder){b(n("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],t=new MediaRecorder(a);t.ondataavailable=l=>{l.data.size&&e.push(l.data)},t.onstop=()=>{a.getTracks().forEach(o=>o.stop()),fa=null,i.recording=!1;const l=new Blob(e,{type:t.mimeType||"audio/webm"});h(),Ie(l).catch(o=>b(o.message))},t.start(),fa=t,i.recording=!0,h()}async function vn(){var l;const a=Y(),e=i.add.inputs.filter(o=>o.status==="ready"&&(o.text||"").trim());if(!e.length)return;const t=[];if(a.language!=="sw"){i.shared.topics||t.push(["shared","topics"]),i.shared.mood||t.push(["shared","mood"]);const o=e.some(r=>!(r.source==="voice"&&r.english));(l=S[a.language])!=null&&l.mt&&o&&!i.installed.includes(a.language)&&t.push(["pack",a.language])}if(!await Q(t))return;const s=[];for(const[o,r]of e.entries()){A(`${n("Inachanganua","Analysing")} ${o+1}/${e.length}`);const c=r.source==="voice"&&a.language!=="en"&&a.language!=="sw"?r.english:void 0,m=await he({original:r.text.trim(),lang:a.language,box:r.box,english:c},_),g={id:M("fb"),guestId:a.id,lang:a.language,source:r.source,box:r.box,original:r.text.trim(),...m,lowWords:r.lowWords||[],ocrConfidence:r.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await f.put("entries",g),i.entries.push(g),s.push(g.id)}T();for(const o of i.add.inputs)o.imageURL&&URL.revokeObjectURL(o.imageURL),o.audioURL&&URL.revokeObjectURL(o.audioURL);i.add.inputs=[],i.add.results=s,i.add.step=3,await J(),h(),window.scrollTo(0,0)}async function Le(){var s;const a=i.entries.filter(l=>l.status==="pending"),e=[...new Set(a.map(l=>l.lang))],t=[];e.some(l=>l!=="sw")&&(i.shared.topics||t.push(["shared","topics"]),i.shared.mood||t.push(["shared","mood"]));for(const l of e)(s=S[l])!=null&&s.mt&&!i.installed.includes(l)&&t.push(["pack",l]);if(await Q(t)){for(const[l,o]of a.entries()){A(`${n("Inachanganua","Analysing")} ${l+1}/${a.length}`);const r=await he({original:o.original,lang:o.lang,box:o.box},_);Object.assign(o,r),await f.put("entries",o)}T(),await J(),b(`✓ ${n("Imekamilika","Done")}`),h()}}async function ia(a){await f.put("entries",a),h()}function Ra(a){const e=i.entries.find(t=>t.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function bn(){const e=await(await fetch("data/demo.json")).json(),t=new Date;for(const s of e.guests){const l={id:s.id,name:s.name,language:s.language,visitDate:D(O(t,s.dayOffset)),consent:s.consent,contact:s.consent?{email:s.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",l);for(const o of["liked","improve"])s[o]&&await f.put("entries",{id:`${s.id}_${o}`,guestId:s.id,lang:s.language,source:"typed",box:o,original:s[o],status:"pending",sentences:[],products:[],visitDate:l.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await U(),i.period="all",z("home"),b(n("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function xn(){for(const a of i.guests.filter(e=>e.synthetic))await f.del("guests",a.id);for(const a of i.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await f.del("entries",a.id);for(const a of i.bookings.filter(e=>e.synthetic))await f.del("bookings",a.id);await U(),b(n("Imeondolewa","Removed")),h()}async function Sn(a){const e=ca(a);if(!(!e||!confirm(n(`Futa ${e.name} na maoni yake yote?`,`Delete ${e.name} and all their feedback?`)))){await f.del("guests",a);for(const t of i.entries.filter(s=>s.guestId===a))await f.del("entries",t.id);for(const t of i.messages.filter(s=>s.guestId===a))await f.del("messages",t.id);await U(),h()}}async function jn(){if(!i.shareOk)return;if(!navigator.onLine)return b(n("Hakuna mtandao. Itapakiwa msaidizi akiunganisha.","Offline. It will upload when the helper connects."),5e3);const{s:a}=Z(),e=Fa(a,`${ba[i.period]()}`,w());A(n("Inapakia kwenye wingu","Uploading to the cloud")),await new Promise(s=>setTimeout(s,900));const t={id:M("up"),at:new Date().toISOString(),entries:a.entries,guests:a.guests,to:"Ondera Coffee Trails · "+n("Ofisi ya utalii","Tourism office"),report:e,period:i.period,host:w()};i.cloud.uploads.push(t),await f.setSetting("cloudUploads",i.cloud.uploads),T(),b(`✓ ${n("Imepakiwa","Uploaded")}`),h()}async function zn(){var e;if(!i.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await Ca(a)}async function Mn(){const{s:a,text:e}=Z(),t=v();t==="sw"&&await fe(it(a))||Ea(e[t].join(" "),t)}async function In(a="home"){i.visitor={lang:Ka(),saved:!1,draft:{}},await f.setSetting("kiosk",a),z("visitor")}async function Ln(a){if(i.role=a,await f.setSetting("role",a),a==="visitor")return i.book={hostId:null,day:null,form:{},done:null},z("find");z(a==="company"?"company":"home"),a==="host"&&!await f.getSetting("guideSeen",!1)&&sa(0)}const Tn={say:a=>te(a.dataset.clip,v()==="sw"?a.dataset.sw:a.dataset.en,v(),Ea),"choose-role":a=>Ln(a.dataset.role),"open-host":a=>{i.book={hostId:a.dataset.id,day:null,form:{},done:null},z("host")},"download-phrasebook":dn,"translate-run":Xt,"copy-text":a=>Ca(a.dataset.text||""),"cloud-upload":jn,"say-phrase":a=>te(a.dataset.clip,a.dataset.text,"sw",Ea),"book-day":a=>{Ga(),i.book.day=a.dataset.day,h()},"book-submit":cn,"toggle-day":async a=>{const e=a.dataset.day;i.availableDays=i.availableDays.includes(e)?i.availableDays.filter(t=>t!==e):[...i.availableDays,e].sort(),await f.setSetting("availableDays",i.availableDays),h()},"company-confirm":async a=>{const e=i.bookings.find(t=>t.id===a.dataset.id);e&&(e.status="confirmed",e.confirmedAt=new Date().toISOString(),await f.put("bookings",e),b(n("Imethibitishwa. SMS mbili ziko tayari.","Confirmed. Two SMS are ready: host and tourist.")),h())},"sms-sent":async a=>{const e=i.bookings.find(t=>t.id===a.dataset.id);e&&(a.dataset.to==="host"?e.smsHost=new Date().toISOString():e.smsTourist=new Date().toISOString(),await f.put("bookings",e),setTimeout(h,400))},"switch-role":async()=>{i.role=null,await f.setSetting("role",null),z("choose")},back:()=>z("home"),go:a=>z(a.dataset.screen),"toggle-lang":async()=>{pe(v()==="sw"?"en":"sw"),await f.setSetting("lang",v()),h()},"hand-to-guest":()=>In(i.screen==="find"?"choose":"home"),"visitor-lang":a=>{un(),i.visitor.lang=a.dataset.lang,h()},"visitor-save":mn,"visitor-next":()=>{i.visitor={lang:Ka(),saved:!1,draft:{}},h(),window.scrollTo(0,0)},"visitor-exit":async()=>{const a=await f.getSetting("kiosk","home");a==="home"&&!confirm(n(`Kwa ${w()} tu: rudi nyumbani?`,`${w()} only: back to the home screen?`))||(await f.setSetting("kiosk",!1),z(a==="choose"?"find":"home"))},"company-sms":()=>{var t,s;const a=Pa(),e=((s=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:s.trim())||"";if(!e){b(n(`Weka namba ya simu ya ${w()}`,`Add ${w()}’s phone number`));return}window.location.href=`sms:${encodeURIComponent(e)}?body=${encodeURIComponent(ja(a))}`},"company-save":async()=>{const a=Pa();await f.put("bookings",a),i.bookings.push(a),b(n("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const a=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",a),await f.setSetting("bigText",a),h()},"save-host":async()=>{var a;Ba((a=document.getElementById("host-name"))==null?void 0:a.value),await f.setSetting("hostName",w()),b(n(`Jina: ${w()}`,`Name: ${w()}`)),h()},"guide-open":()=>sa(0),"guide-next":()=>sa(Math.min(i.guide.step+1,H.length-1)),"guide-prev":()=>sa(Math.max(i.guide.step-1,0)),"guide-close":za,"guide-try":pn,sync:hn,"add-booking":fn,"download-pack":a=>Ta([a.dataset.lang]),"download-suggested":()=>Ta(q().download),"download-recommended":()=>Ta(q().recommend),"delete-pack":a=>ce([a.dataset.lang]),"delete-removable":()=>ce(q().removable),"download-shared":async a=>{await Q([["shared",a.dataset.key]])&&h()},"pick-booking":a=>kn(a.dataset.id),"pick-guest":a=>{i.add=K(),i.add.guestId=a.dataset.id,i.add.step=2,h(),window.scrollTo(0,0)},"save-new-guest":wn,"change-guest":()=>{i.add.step=1,h()},"add-typed":()=>{i.add.inputs.push({id:M("in"),source:"typed",box:"liked",text:"",status:"ready"}),h()},record:$n,"remove-input":a=>{i.add.inputs=i.add.inputs.filter(e=>e.id!==a.dataset.id),h()},"use-hint":async a=>{const e=Y();e.language=a.dataset.lang,await f.put("guests",e),i.add.inputs.forEach(t=>{t.langHint=null}),b(`${n("Lugha","Language")}: ${x(e.language,v())}`),h()},"run-analysis":vn,"finish-add":()=>z("summary"),"more-feedback":()=>{const a=i.add.guestId;i.add=K(),i.add.guestId=a,i.add.step=2,h(),window.scrollTo(0,0)},"fix-mood":async a=>{const[e,t]=Ra(a);t&&(t.sentiment=a.dataset.mood,t.flags=(t.flags||[]).filter(s=>s==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await ia(e))},"confirm-sent":async a=>{const[e,t]=Ra(a);t&&(t.confirmed=!0,t.flags=[],await ia(e))},"sw-mood":async a=>{var s;const e=i.entries.find(l=>l.id===a.dataset.entry);if(!e)return;const t=((s=e.sentences)==null?void 0:s[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=a.dataset.mood,e.sentences=[t],await ia(e)},period:a=>{i.period=a.dataset.period,h()},speak:Mn,"analyze-pending":Le,share:zn,"toggle-draft":a=>{i.openGuest=i.openGuest===a.dataset.id?null:a.dataset.id,h()},"mark-sent":async a=>{const e={id:M("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await f.put("messages",e),i.messages.push(e),setTimeout(h,400)},copy:a=>{var e;return Ca(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>Sn(a.dataset.id),"load-demo":bn,"remove-demo":xn,wipe:async()=>{if(!confirm(n("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const a=v();await f.wipeAll(),await f.setSetting("lang",a),await U(),i.add=K(),Ba("Noor"),b(n("Data yote imefutwa","All data deleted")),z("choose")}},Bn={"company-preview":()=>{const a=document.getElementById("c-sms");a&&(a.textContent=ja(Pa()))},"company-consent":a=>{var e;return(e=document.getElementById("c-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"tr-lang":a=>{var e;i.translate.lang=a.value,i.translate.result="",i.translate.text=((e=document.getElementById("tr-text"))==null?void 0:e.value)||"",h()},"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=i.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,t]=Ra(a);t&&(t.topic=a.value,t.flags=(t.flags||[]).filter(s=>s!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await ia(e))},"sw-topic":async a=>{var s;const e=i.entries.find(l=>l.id===a.dataset.entry);if(!e||!a.value)return;const t=((s=e.sentences)==null?void 0:s[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=a.value,e.sentences=[t],await ia(e)},"share-ok":a=>{i.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked);const t=document.getElementById("cloud-btn");t&&(t.disabled=!a.checked)}};let ka=null;const Cn={"input-text":a=>{const e=i.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.text=a.value),En()},"input-english":a=>{const e=i.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.english=a.value)},"find-q":a=>{i.find.q=a.value,i.find.semantic=null,clearTimeout(ka),ka=setTimeout(()=>{const e=a.selectionStart;h();const t=document.getElementById("find-q");t&&(t.focus(),t.setSelectionRange(e,e))},250),clearTimeout(re),re=setTimeout(()=>sn(a.value),900)},"bk-v-ref":a=>{clearTimeout(ka),ka=setTimeout(()=>{Ga(),h();const e=document.getElementById("bk-v-ref");e&&(e.focus(),e.setSelectionRange(e.value.length,e.value.length))},400)}};function En(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=i.add.inputs.some(s=>s.status==="ready"&&(s.text||"").trim()),t=i.add.inputs.some(s=>s.status==="working");a.disabled=!(e&&!t)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const t=Tn[e.dataset.action];t&&(e.tagName==="BUTTON"&&a.preventDefault(),navigator.vibrate&&navigator.vibrate(8),i.guide.open&&e.dataset.action!=="say"&&!e.closest(".guide-card")&&za(),Promise.resolve(t(e,a)).catch(s=>{console.error(s),T(),b(`${n("Hitilafu","Error")}: ${s.message}`,6e3)}))});document.addEventListener("change",a=>{var s;const e=a.target;if(e.matches("input[type=file][data-file]")){const l=(s=e.files)==null?void 0:s[0];if(e.value="",!l)return;const o=e.dataset.file;(o==="audio"?Ie(l):yn(l,o==="photo-liked"?"liked":"improve")).catch(c=>{T(),b(c.message,6e3)});return}const t=Bn[e.dataset.change];t&&Promise.resolve(t(e)).catch(l=>b(l.message,6e3))});document.addEventListener("input",a=>{var t;const e=Cn[(t=a.target.dataset)==null?void 0:t.input];e&&e(a.target)});document.addEventListener("keydown",a=>{a.key==="Escape"&&i.guide.open&&za()});window.addEventListener("online",()=>{i.online=!0,h()});window.addEventListener("offline",()=>{i.online=!1,h()});async function Dn(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const s of performance.getEntriesByType("resource"))t.add(s.name);await Promise.all([...t].map(async s=>{try{const l=new URL(s);if(l.pathname.endsWith("/data/bookings.json"))return;const o=l.origin===location.origin?a:l.hostname==="cdn.jsdelivr.net"?e:null;o&&!await o.match(s)&&await o.add(s)}catch{}}))}async function An(){const a=await f.getSetting("lang",null);return a||((navigator.languages||[navigator.language||"en"]).some(t=>String(t).toLowerCase().startsWith("sw"))?"sw":"en")}async function Nn(){pe(await An()),await U(),await f.getSetting("kiosk",!1)?(i.visitor={lang:Ka(),saved:!1,draft:{}},i.screen="visitor"):i.screen=i.role==="host"?"home":i.role==="company"?"company":i.role==="visitor"?"find":"choose",It(document.getElementById("nature"),Aa[i.screen]||"grove"),h(),i.screen==="home"&&!await f.getSetting("guideSeen",!1)&&sa(0),await J(),h(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(Dn).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),da().then(e=>{e&&navigator.onLine&&lt()})}Nn().catch(a=>{console.error(a),ta.innerHTML=`<div class="notice neg"><strong>${n("Hitilafu","Error")}</strong>${d(a.message)}</div>`});
