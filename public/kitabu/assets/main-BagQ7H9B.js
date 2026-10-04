import{l as y,t as N,P as C,L as S,e as We,f as ea,g as aa,i as Be,c as ta,a as na,j as ia,k as n,m as k,h as r,b as L,d as v,n as ue,o as Pe,q as Oe,r as D,u as H,s as K,v as sa,w as oa,p as R,x as la,y as da,z as x,A as ra,B as oe,S as E,C as ca,D as ua,E as ga,F as ma,G as pa,H as ha,I as ke,K as Te,J as fa,N as F,O as ka}from"./ui-B2qevl1x.js";const wa="kitabu",ba=1,Re=["guests","entries","bookings","messages","settings"];let ne=null;function $a(){return ne||(ne=new Promise((e,a)=>{const t=indexedDB.open(wa,ba);t.onupgradeneeded=()=>{const i=t.result;for(const s of Re)i.objectStoreNames.contains(s)||i.createObjectStore(s,{keyPath:s==="settings"?"key":"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>a(t.error)}),ne)}function O(e,a,t){return $a().then(i=>new Promise((s,l)=>{const d=i.transaction(e,a),u=d.objectStore(e);let c;Promise.resolve(t(u)).then(g=>{c=g}),d.oncomplete=()=>s(c),d.onerror=()=>l(d.error),d.onabort=()=>l(d.error)}))}function Le(e){return new Promise((a,t)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>t(e.error)})}const p={async all(e){return O(e,"readonly",a=>Le(a.getAll()))},async get(e,a){return O(e,"readonly",t=>Le(t.get(a)))},async put(e,a){return await O(e,"readwrite",t=>{t.put(a)}),a},async putMany(e,a){await O(e,"readwrite",t=>{for(const i of a)t.put(i)})},async del(e,a){await O(e,"readwrite",t=>{t.delete(a)})},async clear(e){await O(e,"readwrite",a=>{a.clear()})},async getSetting(e,a=null){const t=await this.get("settings",e);return t?t.value:a},async setSetting(e,a){return this.put("settings",{key:e,value:a})},async wipeAll(){for(const e of Re)await this.clear(e)}};function j(e="id"){return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const ya=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],va=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function we(e){const a=new Date(e);return`${ya[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function xa(e){const a=new Date(e);return`${va[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function Sa(e){if(!e.length)return"WeKaribu: Hakuna wageni waliopangwa wiki ijayo.";const a=e.reduce((i,s)=>i+(Number(s.guests)||1),0),t=e.slice().sort((i,s)=>new Date(i.date)-new Date(s.date)).map(i=>`${we(i.date)}: wageni ${i.guests} (${y(i.language,"sw")})${i.guide?`, mwongozaji ${i.guide}`:""}`);return`WeKaribu: Wiki ijayo wageni ${a}.
${t.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function be(e){return e.guests&&e.products.find(a=>a.guests>=3&&a.guests/e.guests>=.4)||null}function $e(e){return`WeKaribu: Wageni wapya. ${we(e.date)}: wageni ${e.guests} (${y(e.language,"sw")})${e.guide?`, mwongozaji ${e.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const G=e=>`${e} ${e===1?"guest":"guests"}`,De=e=>`${e} ${e===1?"entry":"entries"}`;function za(e,a="Noor"){const t=[],i=[];if(t.push(`Kipindi hiki: wageni ${e.guests}, maoni ${e.entries}.`),i.push(`This period: ${G(e.guests)}, ${De(e.entries)}.`),e.guests===0)return t.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),i.push("No feedback yet. Add guest feedback first."),{sw:t,en:i};e.guests<5&&(t.push(`Tahadhari: maoni bado ni machache (wageni ${e.guests}). Ni mapema kufanya uamuzi mkubwa.`),i.push(`Caution: still little feedback (${G(e.guests)}). Too early for big decisions.`));const l=e.liked.filter(c=>c.id!=="other").slice(0,3);l.length&&(t.push("Walichopenda zaidi: "+l.map(c=>`${N(c.id).sw.split(" (")[0].toLowerCase()} (wageni ${c.guests})`).join("; ")+"."),i.push("What they liked most: "+l.map(c=>`${N(c.id).en.toLowerCase()} (${G(c.guests)})`).join("; ")+"."));const d=e.improve.filter(c=>c.id!=="other").slice(0,3);d.length?(t.push("Wanachotaka kiboreshwe: "+d.map(c=>`${N(c.id).sw.split(" (")[0].toLowerCase()} (wageni ${c.guests})`).join("; ")+"."),i.push("What they want improved: "+d.map(c=>`${N(c.id).en.toLowerCase()} (${G(c.guests)})`).join("; ")+".")):(t.push("Hakuna malalamiko yaliyotajwa."),i.push("No complaints were mentioned.")),e.products.length&&(t.push("Bidhaa ambazo wageni walitaka kununua: "+e.products.map(c=>`${C.find(g=>g.id===c.id).sw} (wageni ${c.guests})`).join("; ")+"."),i.push("Products guests wanted to buy: "+e.products.map(c=>`${C.find(g=>g.id===c.id).en} (${G(c.guests)})`).join("; ")+"."));const u=be(e);if(u){const c=C.find(g=>g.id===u.id);t.push(`Wazo: wageni ${u.guests} kati ya ${e.guests} walitaka ${c.sw}. Unaweza kufikiria kuuza ${c.sw}. Uamuzi ni wako.`),i.push(`Idea: ${u.guests} of ${e.guests} guests wanted ${c.en}. You could consider selling ${c.en}. The decision is yours.`)}return e.unsure>0&&(t.push(`Sentensi ${e.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),i.push(`${e.unsure} ${e.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${e.unsure===1?"it":"them"} with your helper or the guide.`)),e.swahiliEntries>0&&(t.push(`Maoni ${e.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),i.push(`${De(e.swahiliEntries)} in Swahili — ${a} reads ${e.swahiliEntries===1?"it":"them"} directly.`)),{sw:t,en:i}}const de={sw:{liked:(e,a,t)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${a}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${t}`,plain:(e,a)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${a}`},en:{liked:(e,a,t)=>`Dear ${e}, thank you for visiting our coffee farm! We are glad you enjoyed ${a}. You are always welcome back, and please tell your friends about us. — ${t}`,plain:(e,a)=>`Dear ${e}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${a}`},it:{liked:(e,a,t)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${a}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${t}`,plain:(e,a)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${a}`},fr:{liked:(e,a,t)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${a}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${t}`,plain:(e,a)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${a}`},de:{liked:(e,a,t)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${a}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${t}`,plain:(e,a)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${a}`},zh:{liked:(e,a,t)=>`${e}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${a}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${t}`,plain:(e,a)=>`${e}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${a}`},es:{liked:(e,a,t)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${a}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${t}`,plain:(e,a)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${a}`},pl:{liked:(e,a,t)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${a}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${t}`,plain:(e,a)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${a}`}};function Ne(e,a,t="Noor"){const i=de[e.language]?e.language:"en",s=i!==e.language,l=(e.name||"").trim()||(i==="zh"?"":"friend"),d=a?We.find(c=>c.id===a):null,u=c=>d?de[c].liked(l,d.msg[c]||d.msg.en,t):de[c].plain(l,t);return{lang:i,text:u(i),sw:u("sw"),usedFallback:s}}const Ce={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function He(e,a,t="Noor"){const i=[];i.push(`Ripoti ya maoni — ${a}`),i.push(`Feedback report — ${a}`),i.push(""),i.push(`Wageni / Guests: ${e.guests}`);const s=Object.entries(e.languages).map(([d,u])=>`${S[d]?S[d].en:d} ${u}`).join(", ");s&&i.push(`Lugha / Languages: ${s}`),i.push(""),i.push("Walichopenda / Liked:");for(const d of e.liked.filter(u=>u.id!=="other").slice(0,5))i.push(`  • ${N(d.id).en}: ${d.guests}`);i.push("Kuboresha / To improve:");const l=e.improve.filter(d=>d.id!=="other").slice(0,5);l.length||i.push("  • —");for(const d of l)i.push(`  • ${N(d.id).en}: ${d.guests}`);if(e.products.length){i.push("Bidhaa / Product interest:");for(const d of e.products)i.push(`  • ${C.find(u=>u.id===d.id).en}: ${d.guests}`)}return i.push(""),i.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),i.push(`Imeidhinishwa na ${t} kabla ya kutumwa. / Approved by ${t} before sharing.`),i.join(`
`)}function X(e){return!e.confirmed&&(e.topic==="other"||e.sentiment==="unsure"||(e.flags||[]).length>0)}function ja(e,a,t=new Date){if(a==="all")return!0;const i=new Date(e),s=a==="week"?7:a==="month"?31:3650;return t-i<=s*24*3600*1e3&&i-t<=24*3600*1e3}function Ma(e,a){const t=Object.fromEntries(a.map(h=>[h.id,h])),i=new Set,s={},l={},d={},u={};let c=0,g=0;const f=(h,m,$,I)=>{h[m]||(h[m]={id:m,guestIds:new Set,quotes:[]}),h[m].guestIds.add($),I&&h[m].quotes.push(I)};for(const h of e){i.add(h.guestId),h.lang==="sw"&&g++;for(const m of h.sentences||[]){const $=X(m);$&&c++;const I={entryId:h.id,en:m.en,original:m.original||null,lang:h.lang,flagged:$};m.sentiment==="pos"?f(l,m.topic,h.guestId,I):m.sentiment==="neg"&&f(d,m.topic,h.guestId,I)}for(const m of new Set([...h.products||[],...h.declaredProducts||[]]))f(u,m,h.guestId,null)}for(const h of i){const m=t[h],$=m?m.language:"unknown";s[$]=(s[$]||0)+1}const b=h=>Object.values(h).map(m=>({id:m.id,guests:m.guestIds.size,quotes:m.quotes})).sort((m,$)=>$.guests-m.guests);return{guests:i.size,entries:e.length,liked:b(l),improve:b(d),products:b(u),unsure:c,swahiliEntries:g,languages:s}}function Ia(e,a){const t={};for(const s of e.filter(l=>l.guestId===a))for(const l of s.sentences||[])l.sentiment==="pos"&&l.topic!=="other"&&(t[l.topic]=(t[l.topic]||0)+1);const i=Object.entries(t).sort((s,l)=>l[1]-s[1])[0];return i?i[0]:null}async function Ke(e,a){const{original:t,lang:i,box:s}=e;if(i==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let l;e.english?l=[{original:null,en:e.english}]:l=(await ea(t,i,a)).pairs;const d=[];for(const h of l)for(const m of aa(h.en))d.push({en:m,original:h.original});const u=l.map(h=>h.en).join(" ").trim();if(!d.length)return{english:u,sentences:[],products:Be(u),status:"analyzed"};const c=d.map(h=>h.en),g=await ta(c,a),f=await na(c,a),b=d.map((h,m)=>{var je,Me,Ie;const $=ia(s,f[m]),I=[...$.flags];return g[m].topic==="other"&&I.push("topic-unsure"),(je=S[i])!=null&&je.fallback&&!e.english&&I.push("fallback-pack"),{en:h.en,original:h.original,topic:g[m].topic,topicScore:g[m].score,runnerUp:g[m].runnerUp,sentiment:$.sentiment,moodScore:((Me=f[m])==null?void 0:Me.score)??null,modelMood:((Ie=f[m])==null?void 0:Ie.label)??null,flags:I,confirmed:!1}});return{english:u,sentences:b,products:Be(u),status:"analyzed"}}let _;async function ye(){if(_!==void 0)return _;try{const e=await fetch("audio/sw/manifest.json");_=e.ok?await e.json():null}catch{_=null}return _}const ie=e=>e>=1&&e<=20?`g_${e}`:"g_more";function Ba(e){if(!e.guests)return["no_feedback"];const a=["period",ie(e.guests),"gave_feedback"];e.guests<5&&a.push("few_data");const t=e.liked.filter(l=>l.id!=="other").slice(0,3);if(t.length){a.push("liked_intro");for(const l of t)a.push(`t_${l.id}`,ie(l.guests))}const i=e.improve.filter(l=>l.id!=="other").slice(0,3);if(i.length){a.push("improve_intro");for(const l of i)a.push(`t_${l.id}`,ie(l.guests))}else a.push("no_complaints");if(e.products.length){a.push("products_intro");for(const l of e.products)a.push(`p_${l.id}`,ie(l.guests))}const s=be(e);return s&&a.push("idea_intro",`p_${s.id}`,"idea_outro"),e.unsure>0&&a.push("unsure"),e.swahiliEntries>0&&a.push("swahili_entries"),a}let ge=0,J=null;function Ta(){ge++,J&&(J.pause(),J=null)}async function La(e){const a=await ye();if(!a||!e.every(i=>a.files[i]))return!1;Ta();const t=++ge;for(const i of e){if(t!==ge)break;await new Promise(s=>{const l=new Audio(`audio/sw/${a.files[i]}`);J=l,l.onended=s,l.onerror=s,l.play().catch(s)})}return J=null,!0}async function Da(){const e=await ye();e&&await Promise.all(Object.values(e.files).map(a=>fetch(`audio/sw/${a}`).catch(()=>null)))}const re={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>'},q=[{icon:re.book,title:()=>n("Karibu","Welcome"),body:()=>[n("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),n("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:re.steps,title:()=>n("Hatua tatu","Three steps"),list:()=>[n("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),n("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),n("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[n("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:re.play,title:()=>n("Jaribu sasa","Try it now"),body:()=>[n("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function Na(e){const a=q[e],t=e===q.length-1,i=q.map((u,c)=>`<span class="${c===e?"on":""}"></span>`).join(""),s=a.list?`<ol class="guide-list">${a.list().map(u=>`<li>${u}</li>`).join("")}</ol>`:"",l=a.body().map(u=>`<p class="lead">${u}</p>`).join(""),d=a.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${n("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${e+1} / ${q.length}">${i}</div>
      <button class="guide-close" data-action="guide-close">${n("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${a.icon}</div>
    <h2 id="guide-title">${a.title()}</h2>
    ${s}
    ${l}
    ${d}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${e===0?"disabled":""}>${n("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${n("Endelea","Next")}</button>`}
    </div>
  </div>`}const Ue=["en","it","fr","de","zh","es","pl","sw","xx"],Ee={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function Ge(e){const a=Ee[e]||{...Ee.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},t={};for(const[i,s]of Object.entries(a))t[i]=s.replace(/\{host\}/g,k());return t}function ve(){for(const e of navigator.languages||[navigator.language||"en"]){const a=String(e).slice(0,2).toLowerCase();if(Ue.includes(a))return a}return"en"}const _e={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'},Ca=_e.visitor;function Ea(){const e=(a,t,i)=>`
    <button class="home-btn" data-action="choose-role" data-role="${a}">
      <span class="role-icon" aria-hidden="true">${_e[a]}</span>
      <span class="role-text"><strong>${t}</strong><span class="small muted">${i}</span></span>
    </button>`;return`
  <h1>${n("Karibu! Wewe ni nani?","Welcome! Who are you?")}</h1>
  <div class="stack" style="margin-top:12px">
    ${e("host",n("Mwenyeji","Host"),n("Ongeza maoni, sikiliza muhtasari, washukuru wageni.","Add feedback, hear the summary, thank guests."))}
    ${e("visitor",n("Mgeni","Visitor"),n("Andika maoni yako kwa lugha yako.","Leave feedback in your own language."))}
    ${e("company",n("Kampuni ya utalii au mwongozaji","Tour company or guide"),n("Tuma ratiba ya wageni kwa SMS.","Send guest bookings by SMS."))}
  </div>
  <p class="small muted" style="margin-top:14px">${n("Unaweza kubadilisha baadaye.","You can switch later.")}</p>`}function Aa(e,a,t={}){const i=Ge(e),s={name:"",liked:"",improve:"",email:"",...t},l=Ue.map(d=>`<button class="chip" data-action="visitor-lang" data-lang="${d}" aria-pressed="${d===e}">${r(S[d].native)}</button>`).join("");return a?`
    <div class="card" lang="${e}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Ca}</div>
      <h1>${r(i.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${r(i.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${r(i.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${k()} tu: rudi`,`${k()} only: back`)}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${r(i.lang)}">${l}</div>
  <div class="card" lang="${e}">
    <h1>${r(i.title)}</h1>
    <p>${r(i.intro)}</p>
    <div class="stack">
      <label class="field">${r(i.name)}<input type="text" id="v-name" autocomplete="off" value="${r(s.name)}"></label>
      <label class="field">${r(i.liked)}<textarea id="v-liked">${r(s.liked)}</textarea></label>
      <label class="field">${r(i.improve)}<textarea id="v-improve">${r(s.improve)}</textarea></label>
      <fieldset style="border:0;padding:0;margin:0">
        <legend style="font-weight:600;font-size:.95rem;margin-bottom:6px">${r(i.buy)}</legend>
        <div class="row">
          <label class="check"><input type="checkbox" id="v-buy-coffee"> <span>${r(i.coffee)}</span></label>
          <label class="check"><input type="checkbox" id="v-buy-souvenir"> <span>${r(i.souvenir)}</span></label>
        </div>
      </fieldset>
      <label class="field">${r(i.email)}<input type="email" id="v-email" autocomplete="off" value="${r(s.email)}"></label>
      <label class="check"><input type="checkbox" id="v-consent"> <span>${r(i.consent)}</span></label>
      <button class="btn block" data-action="visitor-save">${r(i.save)}</button>
      <p class="small muted" style="margin:0">${r(i.privacy)}</p>
    </div>
  </div>
  <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${k()} tu: rudi`,`${k()} only: back`)}</button>`}function Wa({langOptionsHTML:e,today:a,sms:t,report:i}){return`
  <h1>${n("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${n(`Tuma ratiba ya wageni kwa ${k()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${k()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${n(`Namba ya simu ya ${k()}`,`${k()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${n("Tarehe","Date")}<input type="date" id="c-date" value="${a}" data-change="company-preview"></label>
        <label class="field">${n("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${n("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${e}</select></label>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${n(`Mgeni amekubali ${k()} awasiliane naye`,`The guest agreed that ${k()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${n("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${n(`SMS ambayo ${k()} atapokea`,`The SMS ${k()} will get`)}</h2>
    <div class="sms" id="c-sms">${r(t)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${n(`Tuma SMS kwa ${k()}`,`Send SMS to ${k()}`)}</button>
      <button class="btn secondary" data-action="company-save">${n("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${n(`Unachopokea kutoka kwa ${k()}`,`What you get back from ${k()}`)}</h2>
    <p class="small">${n("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.")}</p>
    ${i?`<div class="sms">${r(i)}</div>`:""}
  </div>`}const qe=document.getElementById("view"),A=()=>({step:1,guestId:null,inputs:[],results:[]}),o={screen:"home",role:null,guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:A(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}}};async function P(){const[e,a,t,i]=await Promise.all(["guests","entries","bookings","messages"].map(s=>p.all(s)));Object.assign(o,{guests:e,entries:a,bookings:t,messages:i}),o.lastSync=await p.getSetting("lastSync"),o.role=await p.getSetting("role",null),ue(await p.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await p.getSetting("bigText",!1))}async function ee(){try{o.installed=await pa();for(const e of Object.keys(E))o.shared[e]=await ha(E[e].id)}catch(e){console.warn("model check failed",e)}}const ae=e=>o.guests.find(a=>a.id===e),U=()=>ae(o.add.guestId);function W(){return ma({guests:o.guests,bookings:o.bookings,installed:o.installed,today:new Date})}function le(){const e=o.entries.filter(t=>t.status!=="pending"&&ja(t.visitDate||t.createdAt,o.period)),a=Ma(e,o.guests);return{s:a,entries:e,text:za(a,k())}}const Z=e=>x()==="sw"?we(e):xa(e),Q=e=>N(e)[x()].split(" (")[0],T=e=>{var a;return`<span class="chip plain lang-pill" title="${r(((a=S[e])==null?void 0:a.native)||e)}">${r(y(e,x()))}</span>`};function Pa(e){return e==="pos"?`<span class="chip">${n("Nzuri","Positive")}</span>`:e==="neg"?`<span class="chip neg">${n("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${n("Haijulikani","Unsure")}</span>`}function Oa(e){return e.consent?`<span class="chip">${n("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${n("Hakuna ruhusa","No consent")}</span>`}function Ra(e){var a;return(a=S[e])!=null&&a.mt?o.installed.includes(e)?`<span class="chip">${n("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${n("Pakua lugha","Pack needed")}</span>`:""}const Fe={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},Ha=e=>Fe[e][x()==="sw"?0:1];function xe(e){const a=x();return Object.entries(S).map(([t,i])=>`<option value="${t}" ${t===e?"selected":""}>${r(i[a])}${i.native!==i[a]?` (${r(i.native)})`:""}</option>`).join("")}function Je(e){return[...We,ka].map(a=>`<option value="${a.id}" ${a.id===e?"selected":""}>${r(a[x()])}</option>`).join("")}const B=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${n("Nyumbani","Home")}</button>`;function Ve(e,a,{open:t=!1}={}){const i=e.sentences[a],s=X(i),l=(i.flags||[]).filter(u=>Fe[u]),d=i.original&&e.lang!=="en";return`
  <div class="sent">
    ${d?`<div class="orig" lang="${r(e.lang)}">“${r(i.original)}”</div>`:""}
    ${i.en?`<div class="${d?"small muted":""}">${d?"EN: ":""}${r(i.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${i.topic==="other"?"warn":""}">${r(Q(i.topic))}</span>
      ${Pa(i.sentiment)}
      ${s?`<span class="chip warn">${n("Angalia","Check")}</span>`:i.confirmed?`<span class="chip plain">${n("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${s&&l.length?`<div class="small muted" style="margin-top:4px">${l.map(Ha).join("; ")}</div>`:""}
    <details ${t||s?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${n("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${n("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${e.id}" data-idx="${a}">${Je(i.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="pos" aria-pressed="${i.sentiment==="pos"}">${n("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="neg" aria-pressed="${i.sentiment==="neg"}">${n("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${e.id}" data-idx="${a}">${n("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function Ka(e){var t;const a=(t=e.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${r(e.original)}”</div>
    <div class="small muted">${n(`Kiswahili: ${k()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${k()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${e.id}" aria-label="Topic">
        <option value="">— ${n("Mada","Topic")} —</option>${Je(a==null?void 0:a.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="pos" aria-pressed="${(a==null?void 0:a.sentiment)==="pos"}">${n("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="neg" aria-pressed="${(a==null?void 0:a.sentiment)==="neg"}">${n("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function Ua(e){var l;const a=ae(e.guestId),t=e.box==="liked"?n("Walipenda","Liked"):e.box==="improve"?n("Kuboresha","Could be better"):n("Maoni","Feedback"),i=e.source==="photo"?n("Picha","Photo"):e.source==="voice"?n("Sauti","Voice"):n("Imeandikwa","Typed");let s;return e.status==="pending"?s=`<p class="muted">${n("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${r(e.lang)}">“${r(e.original)}”</p>`:e.status==="swahili"?s=Ka(e):(l=e.sentences)!=null&&l.length?s=e.sentences.map((d,u)=>Ve(e,u)).join(""):s=`<p lang="${r(e.lang)}">“${r(e.original)}”</p><p class="small muted">${n("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${r((a==null?void 0:a.name)||"Mgeni")}</strong> ${T(e.lang)}</div>
      <div class="small muted">${i} · ${t}</div>
    </div>
    ${s}
    ${e.synthetic?`<div class="small muted" style="margin-top:6px">${n("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const me='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',Ga='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',_a='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',qa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',Fa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',Ja='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',Va='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function Ya(e){const a=d=>d.filter(u=>u.id!=="other").slice(0,3).map(u=>Q(u.id).toLowerCase()).join(", "),t=a(e.liked),i=a(e.improve),s=[n(`Wageni ${e.guests}.`,`${e.guests} ${e.guests===1?"guest":"guests"}.`)];t&&s.push(n(`Walipenda: ${t}.`,`Loved: ${t}.`)),s.push(i?n(`Kuboresha: ${i}.`,`To improve: ${i}.`):n("Hakuna malalamiko.","No complaints."));const l=be(e);return l&&s.push(n(`Wengi wanataka kununua: ${C.find(d=>d.id===l.id).sw}.`,`Many want to buy: ${C.find(d=>d.id===l.id).en}.`)),s.join(" ")}function Za(){const e=o.entries.filter(f=>f.status==="pending"),{s:a}=le(),t=o.guests.filter(f=>f.consent&&!o.messages.some(b=>b.guestId===f.id&&b.status==="sent")).length,i=o.bookings.filter(f=>{const b=F(f.date);return b>=0&&b<=7}),s=W(),l=o.entries.reduce((f,b)=>f+(b.sentences||[]).filter(X).length,0),d=e.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${n(`Maoni ${e.length} bado hayajachanganuliwa`,`${e.length} new ${e.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
    </div>`:"",u=a.entries?`
    <div class="card">
      <div class="card-title"><h2>${n("Wageni walisema","What guests said")}</h2><span class="small muted">${pe[o.period]()}</span></div>
      <p class="big-summary" style="margin:0">${r(Ya(a))}</p>
      ${l?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${n(`Sentensi ${l} zinahitaji kuangaliwa.`,`${l} ${l===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${d}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${_a}${n("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${n("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${n("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${n("Bado hakuna maoni.","No feedback yet.")}</p>
      ${d}
      ${e.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,c=(f,b,h,m)=>`
    <button class="home-btn" ${f}>
      <span class="role-icon" aria-hidden="true">${b}</span>
      <span class="role-text"><strong>${h}</strong><span class="small muted">${m}</span></span>
    </button>`,g=i.length?n(`Wageni ${i.reduce((f,b)=>f+(Number(b.guests)||1),0)} siku 7 zijazo`,`${i.reduce((f,b)=>f+(Number(b.guests)||1),0)} guests in the next 7 days`)+(s.download.length?` · ${n("pakua","download")} ${s.download.map(f=>y(f,x())).join(", ")}`:""):n("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${u}
  <div class="stack">
    ${c('data-action="go" data-screen="add"',me,n("Ongeza maoni ya mgeni","Add guest feedback"),n("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"))}
    ${c('data-action="hand-to-guest"',Fa,n("Mpe mgeni simu aandike","Let a guest write"),n("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"))}
    ${c('data-action="go" data-screen="guests"',qa,n("Washukuru wageni","Thank guests"),t?n(`Wageni ${t} wanasubiri`,`${t} waiting`):n("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"))}
    ${c('data-action="go" data-screen="week"',Va,n("Wiki ijayo","Next week"),g)}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${n("Zaidi","More")}</button>
  </div>`}function Qa(){const e=o.bookings.filter(d=>F(d.date)>=0).sort((d,u)=>new Date(d.date)-new Date(u.date)),a=e.filter(d=>F(d.date)<=7),t=e.filter(d=>F(d.date)>7),i=W(),s=Sa(a),l=d=>`
    <li>
      <div class="row between">
        <strong>${r(Z(d.date))}</strong>
        <span class="badge-num" title="guests">${r(d.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${T(d.language)} ${Ra(d.language)}
        ${d.guide?`<span class="muted">${n("Mwongozaji","Guide")}: ${r(d.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${r(d.leadName||"")}${d.company?` · ${r(d.company)}`:""}</div>
    </li>`;return`
  ${B()}
  <h1>${n("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <button class="btn block" data-action="sync" ${o.online?"":"disabled"}>${n("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${o.lastSync?`${n("Mara ya mwisho","Last updated")}: ${r(new Date(o.lastSync).toLocaleString())}`:n("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${o.online?"":` · ${n("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${a.length?`
  <div class="card">
    <h2>${n("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${a.map(l).join("")}</ul>
  </div>`:`
  <div class="notice">${n("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${n("Lugha za kuandaa","Languages to prepare")}</h2>
    ${i.download.length?`
      <div class="row">${i.download.map(d=>T(d)).join("")}</div>
      <p class="small muted">${n(`MB ${i.downloadMB}. Tumia Wi-Fi.`,`${i.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${o.online?"":"disabled"}>${n("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${n("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${i.removable.length?`
      <hr>
      <p>${n("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${i.removable.map(d=>T(d)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${n(`Futa (MB ${i.freeMB})`,`Delete (frees ${i.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${n("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  <div class="card">
    <h2>${n(`SMS kwa simu ya ${k()}`,`SMS to ${k()}’s basic phone`)}</h2>
    <div class="sms" id="sms-text">${r(s)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${n("Mfano","Preview")} · ${s.length} ${n("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${n("Nakili","Copy")}</button>
    </div>
  </div>

  ${t.length?`
  <div class="card">
    <h2>${n("Baadaye","Later")}</h2>
    <ul class="list">${t.map(l).join("")}</ul>
  </div>`:""}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${n("Ongeza mgeni kwa mkono","Add a booking by hand")}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${n("Tarehe","Date")}<input type="date" id="bk-date" value="${ke(H(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${n("Wageni","Guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${n("Lugha","Language")}<select id="bk-lang">${xe("en")}</select></label>
      </div>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${n(`Mgeni amekubali ${k()} awasiliane naye`,`Guest agreed that ${k()} may contact them`)}</span></label>
      <label class="field hidden" id="bk-email-wrap">${n("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${n("Hifadhi","Save")}</button>
    </div>
  </details>`}function Xa(){const e=o.add,a=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${e.step>=t?"on":""}"></span>`).join("")}</div>`;return e.step===1?B()+a+Ye():e.step===2?B()+a+et():a+at()}function Ye(){const e=o.bookings.filter(t=>{const i=F(t.date);return i<=1&&i>=-14}).filter(t=>!o.guests.some(i=>i.bookingId===t.id)).sort((t,i)=>new Date(i.date)-new Date(t.date)),a=o.guests.slice().sort((t,i)=>new Date(i.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${n("Mgeni ni nani?","Who is the guest?")}</h1>

  ${e.length?`
  <div class="card">
    <h2>${n("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${r(t.leadName||"Mgeni")}</strong> ${T(t.language)}<div class="small muted">${r(Z(t.date))} · ${n("wageni","guests")} ${r(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${n("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${n("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${xe("en")}</select></label>
      <label class="field">${n("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${ke(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${n(`Mgeni aliweka alama: ${k()} anaweza kuhifadhi mawasiliano yangu`,`Guest ticked: ${k()} may keep my contact details`)}</span></label>
      <div id="contact-fields" class="stack hidden">
        <label class="field">${n("Barua pepe","Email")}<input type="email" id="ng-email" autocomplete="off"></label>
        <label class="field">${n("Simu / WhatsApp","Phone / WhatsApp")}<input type="tel" id="ng-phone" autocomplete="off"></label>
      </div>
      <label class="field">${n("Nani alikupendekezea? (hiari)","Who recommended us? (optional)")}<input type="text" id="ng-ref" autocomplete="off"></label>
      <button class="btn" data-action="save-new-guest">${n("Endelea","Continue")}</button>
    </div>
  </div>

  ${a.length?`
  <div class="card">
    <h2>${n("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${r(t.name)}</strong> ${T(t.language)}<div class="small muted">${r(Z(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function et(){var l;const e=U();if(!e)return o.add.step=1,Ye();const a=((l=S[e.language])==null?void 0:l.mt)&&!o.installed.includes(e.language),t=o.add.inputs.some(d=>d.status==="ready"&&(d.text||"").trim()),i=o.add.inputs.some(d=>d.status==="working"),s=d=>{var h;const u=`
      <select data-change="box" data-id="${d.id}" aria-label="Box">
        <option value="liked" ${d.box==="liked"?"selected":""}>${n("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${d.box==="improve"?"selected":""}>${n("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${d.box==="unknown"?"selected":""}>${n("Haijulikani","Not sure")}</option>
      </select>`,c=d.langHint?`
      <div class="notice warn small">${n(`Inaonekana ni ${y(d.langHint,"sw")}, si ${y(e.language,"sw")}.`,`This looks like ${y(d.langHint,"en")}, not ${y(e.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${d.langHint}">${n(`Badilisha kuwa ${y(d.langHint,"sw")}`,`Switch to ${y(d.langHint,"en")}`)}</button></div>
      </div>`:"";let g="";d.imageURL&&(g=`<img class="preview-img" src="${d.imageURL}" alt="Photo of the guestbook box">`),d.audioURL&&(g=`<audio controls src="${d.audioURL}" style="width:100%"></audio>`);let f="";return d.status==="working"?f=`<p class="muted">${n("Inasoma…","Reading…")}</p>`:d.status==="error"?f=`<div class="notice neg small">${n("Imeshindwa","Failed")}: ${r(d.error)}</div>`:f=`
        ${(h=d.lowWords)!=null&&h.length?`<div class="notice warn small"><strong>${n("Angalia maneno haya","Check these words")}</strong>${d.lowWords.slice(0,20).map(m=>`<mark class="low">${r(m)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${d.source==="voice"?n("Alichosema mgeni","What the guest said"):n("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${d.id}" lang="${r(e.language)}">${r(d.text)}</textarea></label>
        ${d.source==="voice"&&e.language!=="en"&&e.language!=="sw"?`
        <label class="field small">${n("Kwa Kiingereza (kutoka kwa modeli ya sauti)","In English (from the voice model)")}
          <textarea data-input="input-english" data-id="${d.id}" style="min-height:80px">${r(d.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${d.source==="photo"?n("Picha","Photo"):d.source==="voice"?n("Sauti","Voice"):n("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${d.id}">${n("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${g}
        <label class="field small">${n("Kisanduku","Which box")}${u}</label>
        ${c}
        ${f}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${r(e.name)}</strong> ${T(e.language)}<div class="small muted">${r(Z(e.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${n("Badilisha","Change")}</button>
    </div>
  </div>

  ${a?`<div class="notice warn">${n(`Lugha ya ${y(e.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${oe}).`,`The ${y(e.language,"en")} pack is not on this phone yet. Analysing needs internet once (${oe} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${me}<span class="btn-col">${n("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${me}<span class="btn-col">${n("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${o.recording?"danger":"secondary"}" data-action="record">
      ${o.recording?'<span class="rec-dot"></span>':Ga}<span class="btn-col">${o.recording?n("Simamisha","Stop"):n("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${Ja}<span class="btn-col">${n("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${n("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${o.add.inputs.map(s).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!i?"":"disabled"}>${n("Changanua","Analyse")}</button>`}function at(){const e=o.add.results.map(i=>o.entries.find(s=>s.id===i)).filter(Boolean),a=U(),t=e.reduce((i,s)=>i+(s.sentences||[]).filter(X).length,0);return`
  <h1>${n("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${n(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} ${t===1?"sentence needs":"sentences need"} a check`)}</strong>${n("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${n("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${e.map(Ua).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${n("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${n(`Ongeza maoni mengine ya ${r((a==null?void 0:a.name)||"mgeni")}`,`Add more for ${r((a==null?void 0:a.name)||"this guest")}`)}</button>
  </div>`}const pe={week:()=>n("Wiki hii","This week"),month:()=>n("Mwezi huu","This month"),all:()=>n("Zote","All time")};function tt(){const e=o.entries.filter(g=>g.status==="pending"),{s:a,entries:t,text:i}=le(),s=Object.entries(pe).map(([g,f])=>`<button class="chip" data-action="period" data-period="${g}" aria-pressed="${o.period===g}">${f()}</button>`).join(""),l=(g,f)=>g.filter(b=>b.id!=="other").map(b=>{const h=a.guests?Math.round(b.guests/a.guests*100):0,m=b.quotes.slice(0,5).map($=>`
      <blockquote class="q">${$.original&&$.lang!=="en"?`<div class="orig" lang="${r($.lang)}">“${r($.original)}”</div><div class="trans">EN: ${r($.en)}</div>`:`<div class="orig">“${r($.en)}”</div>`}
      ${$.flagged?`<span class="chip warn" style="margin-top:4px">${n("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${r(Q(b.id))}</strong><span class="badge-num ${f?"neg":""}">${b.guests}</span></div>
        <div class="bar ${f?"neg":""}"><span style="width:${h}%"></span></div>
        <details class="quotes"><summary>${n("Maneno ya wageni","What guests said")} (${b.quotes.length})</summary>${m}</details>
      </div>`}).join(""),d=[];for(const g of t)(g.sentences||[]).forEach((f,b)=>{X(f)&&d.push([g,b])});const u=He(a,`${pe[o.period]()}`,k()),c=x();return`
  ${B()}
  <h1>${n("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${s}</div>

  ${e.length?`
  <div class="notice warn">
    <strong>${n(`Maoni ${e.length} bado hayajachanganuliwa`,`${e.length} ${e.length===1?"entry":"entries"} not analysed yet`)}</strong>
    <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
  </div>`:""}

  ${a.entries===0?e.length?"":`
  <div class="card">
    <p>${n("Bado hakuna maoni kwa kipindi hiki.","No feedback for this period yet.")}</p>
    <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button>
  </div>`:`
  <div class="card">
    <div class="card-title"><h2>${n(`Kwa ${k()}`,`For ${k()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${n("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${c}">${i[c].map(g=>`<p>${r(g)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${n("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${a.liked.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Walichopenda","What they liked")}</h2>${l(a.liked,!1)}</div>`:""}
  ${a.improve.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Wanachotaka kiboreshwe","What they want improved")}</h2>${l(a.improve,!0)}</div>`:""}

  ${a.products.length?`
  <div class="card">
    <h2>${n("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${a.products.map(g=>{const f=C.find(b=>b.id===g.id);return`<div class="topic-row"><strong>${r(f[c])}</strong><span class="badge-num">${g.guests}</span></div>`}).join("")}
  </div>`:""}

  ${d.length?`
  <div class="card">
    <h2>${n("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${d.map(([g,f])=>{var b;return`<div class="small muted" style="margin-top:8px">${r(((b=ae(g.guestId))==null?void 0:b.name)||"")} · ${r(y(g.lang,c))}</div>${Ve(g,f,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${n("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${n("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${r(u)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${o.shareOk?"checked":""}>
      <span>${n("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${o.shareOk?"":"disabled"}>${n("Shiriki","Share")}</button>
  </div>`}
  `}function nt(){const e=o.guests.slice().sort((a,t)=>new Date(t.visitDate)-new Date(a.visitDate));return e.length?`
  ${B()}
  <h1>${n("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${n("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${e.map(a=>{const t=o.entries.filter(l=>l.guestId===a.id).length,i=o.messages.some(l=>l.guestId===a.id&&l.status==="sent"),s=o.openGuest===a.id;return`
      <li>
        <div class="row between">
          <div><strong>${r(a.name)}</strong> ${T(a.language)}${a.synthetic?` <span class="chip plain">${n("mfano","example")}</span>`:""}</div>
          <span class="small muted">${r(Z(a.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Oa(a)} <span class="muted">${n("maoni","entries")}: ${t}</span>
          ${i?`<span class="chip">${n("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${a.referredBy?`<div class="small muted" style="margin-top:4px">${n("Alipendekezwa na","Recommended by")}: ${r(a.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${s?"":"secondary"}" data-action="toggle-draft" data-id="${a.id}">${n("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${a.id}">${n("Futa","Delete")}</button>
        </div>
        ${s?it(a):""}
      </li>`}).join("")}</ul></div>`:`${B()}<h1>${n("Wageni","Guests")}</h1>
      <div class="card"><p>${n("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button></div>`}function it(e){const a=Ia(o.entries,e.id),t=Ne(e,a,k()),i=e.contact||{},s=Ce[t.lang]||Ce.en;let l;e.consent?i.email?l=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(i.email)}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:i.phone?l=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(i.phone)}?body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:l=`<div class="notice small">${n("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:l=`<div class="notice warn small">${n("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const d=x();return`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${n(`Hakuna kiolezo cha ${y(e.language,"sw")} bado; tumetumia Kiingereza.`,`No ${y(e.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${n(`Kwa ${y(t.lang,"sw")}`,`In ${y(t.lang,"en")}`)}</div><p id="draft-${e.id}" style="margin:6px 0 0">${r(t.text)}</p></div>
    ${t.lang!==d?`<div class="card flat" lang="${d}"><div class="small muted">${n("Maana yake","What it says")}</div><p style="margin:6px 0 0">${r(d==="sw"?t.sw:Ne({...e,language:"en"},a,k()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${a?n(`Mada aliyopenda: ${Q(a)}`,`Liked topic: ${Q(a)}`):n("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${l}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${e.id}">${n("Nakili","Copy")}</button>
  </div>`}function st(){const e=W(),a=x(),t=s=>{const l=S[s],d=o.installed.includes(s),u=[];return d&&u.push(`<span class="chip">${n("Imepakuliwa","On phone")}</span>`),e.keep.includes(s)&&u.push(`<span class="chip">${n("Inakaa daima","Kept")}</span>`),e.needed.includes(s)&&u.push(`<span class="chip warn">${n("Wiki ijayo","Needed next week")}</span>`),d&&e.removable.includes(s)&&u.push(`<span class="chip plain">${n("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${r(l[a])}</strong> <span class="muted small">${r(l.native)} · ${oe} MB</span>
          <div class="row" style="margin-top:4px">${u.join("")}</div></div>
        ${d?`<button class="btn small danger" data-action="delete-pack" data-lang="${s}">${n("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${s}" ${o.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`},i=s=>{const l=E[s],d=o.shared[s];return`
      <div class="pack">
        <div><strong>${r(l[a])}</strong> <span class="muted small">${l.mb} MB</span></div>
        ${d?`<span class="chip">${n("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${s}" ${o.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`};return`
  ${B()}
  <h1>${n("Lugha","Languages")}</h1>
  <p class="small muted">${n(`Kiswahili na Kiingereza daima, pamoja na lugha ${Te} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Te} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${n("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${n("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(E).map(i).join("")}
  </div>

  <div class="card">
    <h2>${n("Lugha za wageni","Guest languages")}</h2>
    ${e.usedDefaults?`<p class="small muted">${n("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${e.recommend.length?`
      <div class="notice small" style="margin-top:4px">${n(`Pakua ukiwa na Wi-Fi: ${e.recommend.map(s=>S[s].sw).join(", ")} (MB ${e.recommendMB}).`,`Download on Wi-Fi: ${e.recommend.map(s=>S[s].en).join(", ")} (${e.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${o.online?"":"disabled"}>${n("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${fa().map(t).join("")}
  </div>`}function ot(){const e=o.guests.some(a=>a.synthetic);return`
  ${B()}
  <h1>${n("Zaidi","More")}</h1>

  <div class="card">
    <h2>${n("Mwenyeji","Host")}</h2>
    <label class="field">${n("Jina lako (linaonekana kwa wageni na kwenye ujumbe)","Your name (shown to guests and in messages)")}
      <input type="text" id="host-name" value="${r(k())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${n("Hifadhi jina","Save name")}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?n("Herufi za kawaida","Normal text size"):n("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${n("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(k())}" target="_blank" rel="noopener">${n("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
    </div>
  </div>

  <div class="card">
    <h2>${n("Data ya mfano","Example data")}</h2>
    <p class="small muted">${n("Wageni 6 wa kubuni na maoni kwa lugha 5. Si watu halisi.","6 invented guests with feedback in 5 languages. Not real people.")}</p>
    ${e?`<button class="btn danger" data-action="remove-demo">${n("Ondoa data ya mfano","Remove example data")}</button>`:`<button class="btn secondary" data-action="load-demo">${n("Pakia data ya mfano","Load example data")}</button>`}
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
    <div class="stack">
      <a class="btn secondary" href="eval.html">${n("Jaribio la usahihi","Accuracy check")}</a>
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${n("Msimbo, vyanzo vya data na mipaka","Code, data sources and limits")}</a>
    </div>
  </div>`}function he(){var i;const e=s=>{var l,d;return((d=(l=document.getElementById(s))==null?void 0:l.value)==null?void 0:d.trim())||""},a=!!((i=document.getElementById("c-consent"))!=null&&i.checked),t=e("c-date");return{id:j("bk"),date:D(t||H(new Date,3)),guests:Math.max(1,Number(e("c-guests"))||1),leadName:e("c-name")||"Mgeni",language:e("c-lang")||"en",guide:e("c-guide"),company:"",consent:a,email:a?e("c-email"):""}}function lt(){const e=ke(H(new Date,3)),{s:a}=le(),t=a.entries?He(a,n("Mfano","Example"),k()):null;return(o.role==="company"?`<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${n("Badilisha upande","Switch side")}</button>`:B())+Wa({langOptionsHTML:xe("en"),today:e,sms:$e({date:D(e),guests:2,language:"en",guide:""}),report:t})}function dt(){const e=a=>{var t;return((t=document.getElementById(a))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(o.visitor.draft={name:e("v-name"),liked:e("v-liked"),improve:e("v-improve"),email:e("v-email")})}async function rt(){var g,f,b;const e=h=>{var m,$;return(($=(m=document.getElementById(h))==null?void 0:m.value)==null?void 0:$.trim())||""},a=o.visitor.lang,t=Ge(a),i=e("v-liked"),s=e("v-improve");if(!i&&!s){v(t.needText);return}const l=!!((g=document.getElementById("v-consent"))!=null&&g.checked),d=[(f=document.getElementById("v-buy-coffee"))!=null&&f.checked?"coffee":null,(b=document.getElementById("v-buy-souvenir"))!=null&&b.checked?"souvenir":null].filter(Boolean),u={id:j("g"),name:e("v-name")||"Mgeni",language:a,visitDate:D(new Date),consent:l,contact:l?{email:e("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await p.put("guests",u);let c=!0;for(const[h,m]of[["liked",i],["improve",s]])m&&(await p.put("entries",{id:j("fb"),guestId:u.id,lang:a,source:"visitor",box:h,original:m,status:"pending",sentences:[],products:[],declaredProducts:c?d:[],visitDate:u.visitDate,createdAt:new Date().toISOString()}),c=!1);await P(),o.visitor={lang:a,saved:!0,draft:{}},w(),window.scrollTo(0,0)}let z=null;function Se(){var e;if(z||(z=document.createElement("div"),z.className="guide-backdrop hidden",z.setAttribute("role","dialog"),z.setAttribute("aria-modal","true"),z.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(z)),z.classList.toggle("hidden",!o.guide.open),!o.guide.open){z.innerHTML="";return}z.innerHTML=Na(o.guide.step),(e=z.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||e.focus()}function V(e=0){o.guide={open:!0,step:e},Se()}async function ze(){o.guide.open=!1,Se(),await p.setSetting("guideSeen",!0)}async function ct(){await ze();const e="demo_quick";if(!ae(e)){const a={id:e,name:"Emma (mfano)",language:"en",visitDate:D(H(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await p.put("guests",a);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const i of["liked","improve"])await p.put("entries",{id:`${e}_${i}`,guestId:e,lang:"en",source:"typed",box:i,original:t[i],status:"pending",sentences:[],products:[],visitDate:a.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await P()}o.period="all",o.screen="home",w(),await Qe()}const ut={choose:Ea,home:Za,add:Xa,summary:tt,guests:nt,week:Qa,langs:st,more:ot,company:lt,visitor:()=>Aa(o.visitor.lang,o.visitor.saved,o.visitor.draft)};function w(){const e=o.screen;document.body.classList.toggle("mode-visitor",e==="visitor"||e==="choose"),document.body.classList.toggle("home",e==="home"),qe.innerHTML=ut[e](),document.getElementById("net").textContent=o.online?n("Mtandaoni","Online"):n("Nje ya mtandao","Offline");const a=document.getElementById("lang-btn");a&&(a.textContent=x()==="sw"?"English":"Kiswahili"),o.guide.open&&Se(),e==="langs"&&ra().then(t=>{const i=document.getElementById("storage-line");i&&t&&(i.textContent=n(`Nafasi iliyotumika: MB ${t.usedMB} kati ya MB ${t.quotaMB}`,`Storage used: ${t.usedMB} MB of ${t.quotaMB} MB`))})}function M(e){o.screen=e,e!=="add"&&(o.add=A()),w(),window.scrollTo(0,0)}async function te(e){if(!e.length)return!0;const a=e.reduce((i,[s,l])=>i+(s==="pack"?oe:E[l].mb),0);if(!navigator.onLine)return v(n("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const t=e.map(([i,s])=>i==="pack"?y(s,x()):E[s][x()]).join(", ");if(!confirm(n(`Pakua mara moja: takriban MB ${a} (${t}). Endelea?`,`One-time download of about ${a} MB (${t}). Continue?`)))return!1;for(const[i,s]of e)K(n("Inapakua","Downloading")+` · ${i==="pack"?y(s,x()):E[s][x()]}`),i==="pack"?await ca(s,R):await ua(s,R);return L(),await ee(),!0}async function ce(e){const a=e.filter(t=>{var i;return((i=S[t])==null?void 0:i.mt)&&!o.installed.includes(t)}).map(t=>["pack",t]);await te(a)&&(v(n("Lugha ziko tayari","Packs ready")),w())}async function Ae(e){if(!e.length)return;const a=e.map(t=>y(t,x())).join(", ");if(confirm(n(`Futa ${a}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${a}? They can be downloaded again later.`))){for(const t of e)await ga(S[t].mt);await ee(),v(n("Imefutwa","Deleted")),w()}}async function gt(){if(!navigator.onLine)return v(n("Hakuna mtandao","Offline"));K(n("Inapokea ratiba","Receiving the schedule"));const a=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,i=a.bookings.map(l=>({id:l.id,date:D(H(t,l.dayOffset)),guests:l.guests,leadName:l.leadName,language:l.language,guide:l.guide,company:a.company,consent:!!l.consent,email:l.consent&&l.email||"",synthetic:!0}));await p.putMany("bookings",i),o.bookings=await p.all("bookings"),o.lastSync=new Date().toISOString(),await p.setSetting("lastSync",o.lastSync),L();const s=W();v(s.download.length?n(`Ratiba imepokelewa. Pakua: ${s.download.map(l=>S[l].sw).join(", ")}`,`Schedule received. Download: ${s.download.map(l=>S[l].en).join(", ")}`):n("Ratiba imepokelewa","Schedule received")),w()}async function mt(){const e=s=>{var l,d;return((d=(l=document.getElementById(s))==null?void 0:l.value)==null?void 0:d.trim())||""},a=e("bk-date");if(!a)return v(n("Weka tarehe","Add a date"));const t=document.getElementById("bk-consent").checked,i={id:j("bk"),date:D(a),guests:Math.max(1,Number(e("bk-guests"))||1),leadName:e("bk-name")||"Mgeni",language:e("bk-lang")||"en",guide:e("bk-guide"),company:"",consent:t,email:t?e("bk-email"):""};await p.put("bookings",i),o.bookings.push(i),v(n("Imehifadhiwa","Saved")),w()}async function pt(e){const a=o.bookings.find(i=>i.id===e);if(!a)return;let t=o.guests.find(i=>i.bookingId===a.id);t||(t={id:j("g"),name:a.leadName||"Mgeni",language:a.language,visitDate:a.date,consent:!!a.consent,contact:a.consent?{email:a.email||"",phone:""}:null,bookingId:a.id,groupSize:a.guests,createdAt:new Date().toISOString(),synthetic:!!a.synthetic},await p.put("guests",t),o.guests.push(t)),o.add=A(),o.add.guestId=t.id,o.add.step=2,w()}async function ht(){const e=i=>{var s,l;return((l=(s=document.getElementById(i))==null?void 0:s.value)==null?void 0:l.trim())||""},a=document.getElementById("ng-consent").checked,t={id:j("g"),name:e("ng-name")||"Mgeni",language:e("ng-lang")||"en",visitDate:D(e("ng-date")||new Date),consent:a,contact:a?{email:e("ng-email"),phone:e("ng-phone")}:null,referredBy:e("ng-ref"),createdAt:new Date().toISOString()};await p.put("guests",t),o.guests.push(t),o.add=A(),o.add.guestId=t.id,o.add.step=2,w(),window.scrollTo(0,0)}async function ft(e,a){const t=U(),i={id:j("in"),source:"photo",box:a,text:"",status:"working",imageURL:URL.createObjectURL(e),lowWords:[]};o.add.inputs.push(i),w();try{K(n("Inasoma picha","Reading the photo"));const s=await la(e,t.language,R);Object.assign(i,{text:s.text,lowWords:s.lowWords,confidence:s.confidence,status:"ready"}),s.text||(i.status="error",i.error=n("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const l=await da(s.text);l&&l!==t.language&&(i.langHint=l)}catch(s){i.status="error",i.error=s.message}finally{L(),w()}}async function Ze(e){const a=U();if(!o.shared.voice&&!await te([["shared","voice"]]))return;const t={id:j("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(e)};o.add.inputs.push(t),w();try{K(n("Inasikiliza","Listening"));const i=await oa(e,a.language,R);Object.assign(t,{text:i.original,english:i.english,status:"ready"}),o.shared.voice=!0}catch(i){t.status="error",t.error=i.message}finally{L(),w()}}let se=null;async function kt(){var i;if(se){se.stop();return}if(!((i=navigator.mediaDevices)!=null&&i.getUserMedia)||!window.MediaRecorder){v(n("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const e=await navigator.mediaDevices.getUserMedia({audio:!0}),a=[],t=new MediaRecorder(e);t.ondataavailable=s=>{s.data.size&&a.push(s.data)},t.onstop=()=>{e.getTracks().forEach(l=>l.stop()),se=null,o.recording=!1;const s=new Blob(a,{type:t.mimeType||"audio/webm"});w(),Ze(s).catch(l=>v(l.message))},t.start(),se=t,o.recording=!0,w()}async function wt(){var s;const e=U(),a=o.add.inputs.filter(l=>l.status==="ready"&&(l.text||"").trim());if(!a.length)return;const t=[];if(e.language!=="sw"){o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]);const l=a.some(d=>!(d.source==="voice"&&d.english));(s=S[e.language])!=null&&s.mt&&l&&!o.installed.includes(e.language)&&t.push(["pack",e.language])}if(!await te(t))return;const i=[];for(const[l,d]of a.entries()){K(`${n("Inachanganua","Analysing")} ${l+1}/${a.length}`);const u=d.source==="voice"&&e.language!=="en"&&e.language!=="sw"?d.english:void 0,c=await Ke({original:d.text.trim(),lang:e.language,box:d.box,english:u},R),g={id:j("fb"),guestId:e.id,lang:e.language,source:d.source,box:d.box,original:d.text.trim(),...c,lowWords:d.lowWords||[],ocrConfidence:d.confidence??null,visitDate:e.visitDate,createdAt:new Date().toISOString()};await p.put("entries",g),o.entries.push(g),i.push(g.id)}L();for(const l of o.add.inputs)l.imageURL&&URL.revokeObjectURL(l.imageURL),l.audioURL&&URL.revokeObjectURL(l.audioURL);o.add.inputs=[],o.add.results=i,o.add.step=3,await ee(),w(),window.scrollTo(0,0)}async function Qe(){var i;const e=o.entries.filter(s=>s.status==="pending"),a=[...new Set(e.map(s=>s.lang))],t=[];a.some(s=>s!=="sw")&&(o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]));for(const s of a)(i=S[s])!=null&&i.mt&&!o.installed.includes(s)&&t.push(["pack",s]);if(await te(t)){for(const[s,l]of e.entries()){K(`${n("Inachanganua","Analysing")} ${s+1}/${e.length}`);const d=await Ke({original:l.original,lang:l.lang,box:l.box},R);Object.assign(l,d),await p.put("entries",l)}L(),await ee(),v(n("Imekamilika","Done")),w()}}async function Y(e){await p.put("entries",e),w()}function fe(e){const a=o.entries.find(t=>t.id===e.dataset.entry);return a?[a,a.sentences[Number(e.dataset.idx)]]:[null,null]}async function bt(){const a=await(await fetch("data/demo.json")).json(),t=new Date;for(const i of a.guests){const s={id:i.id,name:i.name,language:i.language,visitDate:D(H(t,i.dayOffset)),consent:i.consent,contact:i.consent?{email:i.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await p.put("guests",s);for(const l of["liked","improve"])i[l]&&await p.put("entries",{id:`${i.id}_${l}`,guestId:i.id,lang:i.language,source:"typed",box:l,original:i[l],status:"pending",sentences:[],products:[],visitDate:s.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await P(),o.period="all",M("home"),v(n("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function $t(){for(const e of o.guests.filter(a=>a.synthetic))await p.del("guests",e.id);for(const e of o.entries.filter(a=>a.synthetic||a.id.startsWith("demo_")))await p.del("entries",e.id);for(const e of o.bookings.filter(a=>a.synthetic))await p.del("bookings",e.id);await P(),v(n("Imeondolewa","Removed")),w()}async function yt(e){const a=ae(e);if(!(!a||!confirm(n(`Futa ${a.name} na maoni yake yote?`,`Delete ${a.name} and all their feedback?`)))){await p.del("guests",e);for(const t of o.entries.filter(i=>i.guestId===e))await p.del("entries",t.id);for(const t of o.messages.filter(i=>i.guestId===e))await p.del("messages",t.id);await P(),w()}}async function vt(){var a;if(!o.shareOk)return;const e=((a=document.getElementById("report-text"))==null?void 0:a.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:e})}catch{}else await Pe(e)}async function xt(){const{s:e,text:a}=le(),t=x();t==="sw"&&await La(Ba(e))||sa(a[t].join(" "),t)}async function Xe(e="home"){o.visitor={lang:ve(),saved:!1,draft:{}},await p.setSetting("kiosk",e),M("visitor")}async function St(e){if(o.role=e,await p.setSetting("role",e),e==="visitor")return Xe("choose");M(e==="company"?"company":"home"),e==="host"&&!await p.getSetting("guideSeen",!1)&&V(0)}const zt={"choose-role":e=>St(e.dataset.role),"switch-role":async()=>{o.role=null,await p.setSetting("role",null),M("choose")},back:()=>M("home"),go:e=>M(e.dataset.screen),"toggle-lang":async()=>{Oe(x()==="sw"?"en":"sw"),await p.setSetting("lang",x()),w()},"hand-to-guest":()=>Xe("home"),"visitor-lang":e=>{dt(),o.visitor.lang=e.dataset.lang,w()},"visitor-save":rt,"visitor-next":()=>{o.visitor={lang:ve(),saved:!1,draft:{}},w(),window.scrollTo(0,0)},"visitor-exit":async()=>{const e=await p.getSetting("kiosk","home");e==="home"&&!confirm(n(`Kwa ${k()} tu: rudi nyumbani?`,`${k()} only: back to the home screen?`))||(await p.setSetting("kiosk",!1),e==="choose"?(o.role=null,await p.setSetting("role",null),M("choose")):M("home"))},"company-sms":()=>{var t,i;const e=he(),a=((i=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:i.trim())||"";if(!a){v(n(`Weka namba ya simu ya ${k()}`,`Add ${k()}’s phone number`));return}window.location.href=`sms:${encodeURIComponent(a)}?body=${encodeURIComponent($e(e))}`},"company-save":async()=>{const e=he();await p.put("bookings",e),o.bookings.push(e),v(n("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const e=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",e),await p.setSetting("bigText",e),w()},"save-host":async()=>{var e;ue((e=document.getElementById("host-name"))==null?void 0:e.value),await p.setSetting("hostName",k()),v(n(`Jina: ${k()}`,`Name: ${k()}`)),w()},"guide-open":()=>V(0),"guide-next":()=>V(Math.min(o.guide.step+1,q.length-1)),"guide-prev":()=>V(Math.max(o.guide.step-1,0)),"guide-close":ze,"guide-try":ct,sync:gt,"add-booking":mt,"download-pack":e=>ce([e.dataset.lang]),"download-suggested":()=>ce(W().download),"download-recommended":()=>ce(W().recommend),"delete-pack":e=>Ae([e.dataset.lang]),"delete-removable":()=>Ae(W().removable),"download-shared":async e=>{await te([["shared",e.dataset.key]])&&w()},"pick-booking":e=>pt(e.dataset.id),"pick-guest":e=>{o.add=A(),o.add.guestId=e.dataset.id,o.add.step=2,w(),window.scrollTo(0,0)},"save-new-guest":ht,"change-guest":()=>{o.add.step=1,w()},"add-typed":()=>{o.add.inputs.push({id:j("in"),source:"typed",box:"liked",text:"",status:"ready"}),w()},record:kt,"remove-input":e=>{o.add.inputs=o.add.inputs.filter(a=>a.id!==e.dataset.id),w()},"use-hint":async e=>{const a=U();a.language=e.dataset.lang,await p.put("guests",a),o.add.inputs.forEach(t=>{t.langHint=null}),v(`${n("Lugha","Language")}: ${y(a.language,x())}`),w()},"run-analysis":wt,"finish-add":()=>M("summary"),"more-feedback":()=>{const e=o.add.guestId;o.add=A(),o.add.guestId=e,o.add.step=2,w(),window.scrollTo(0,0)},"fix-mood":async e=>{const[a,t]=fe(e);t&&(t.sentiment=e.dataset.mood,t.flags=(t.flags||[]).filter(i=>i==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await Y(a))},"confirm-sent":async e=>{const[a,t]=fe(e);t&&(t.confirmed=!0,t.flags=[],await Y(a))},"sw-mood":async e=>{var i;const a=o.entries.find(s=>s.id===e.dataset.entry);if(!a)return;const t=((i=a.sentences)==null?void 0:i[0])||{en:"",original:a.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=e.dataset.mood,a.sentences=[t],await Y(a)},period:e=>{o.period=e.dataset.period,w()},speak:xt,"analyze-pending":Qe,share:vt,"toggle-draft":e=>{o.openGuest=o.openGuest===e.dataset.id?null:e.dataset.id,w()},"mark-sent":async e=>{const a={id:j("msg"),guestId:e.dataset.id,lang:e.dataset.lang,status:"sent",at:new Date().toISOString()};await p.put("messages",a),o.messages.push(a),setTimeout(w,400)},copy:e=>{var a;return Pe(((a=document.getElementById(e.dataset.copyFrom))==null?void 0:a.textContent)||"")},"delete-guest":e=>yt(e.dataset.id),"load-demo":bt,"remove-demo":$t,wipe:async()=>{if(!confirm(n("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const e=x();await p.wipeAll(),await p.setSetting("lang",e),await P(),o.add=A(),ue("Noor"),v(n("Data yote imefutwa","All data deleted")),M("choose")}},jt={"company-preview":()=>{const e=document.getElementById("c-sms");e&&(e.textContent=$e(he()))},"company-consent":e=>{var a;return(a=document.getElementById("c-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"consent-toggle":e=>{var a;return(a=document.getElementById("contact-fields"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"bk-consent-toggle":e=>{var a;return(a=document.getElementById("bk-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},box:e=>{const a=o.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.box=e.value)},"fix-topic":async e=>{const[a,t]=fe(e);t&&(t.topic=e.value,t.flags=(t.flags||[]).filter(i=>i!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await Y(a))},"sw-topic":async e=>{var i;const a=o.entries.find(s=>s.id===e.dataset.entry);if(!a||!e.value)return;const t=((i=a.sentences)==null?void 0:i[0])||{en:"",original:a.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=e.value,a.sentences=[t],await Y(a)},"share-ok":e=>{o.shareOk=e.checked;const a=document.getElementById("share-btn");a&&(a.disabled=!e.checked)}},Mt={"input-text":e=>{const a=o.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.text=e.value),It()},"input-english":e=>{const a=o.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.english=e.value)}};function It(){const e=document.querySelector('[data-action="run-analysis"]');if(!e)return;const a=o.add.inputs.some(i=>i.status==="ready"&&(i.text||"").trim()),t=o.add.inputs.some(i=>i.status==="working");e.disabled=!(a&&!t)}document.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=zt[a.dataset.action];t&&(a.tagName==="BUTTON"&&e.preventDefault(),Promise.resolve(t(a,e)).catch(i=>{console.error(i),L(),v(`${n("Hitilafu","Error")}: ${i.message}`,6e3)}))});document.addEventListener("change",e=>{var i;const a=e.target;if(a.matches("input[type=file][data-file]")){const s=(i=a.files)==null?void 0:i[0];if(a.value="",!s)return;const l=a.dataset.file;(l==="audio"?Ze(s):ft(s,l==="photo-liked"?"liked":"improve")).catch(u=>{L(),v(u.message,6e3)});return}const t=jt[a.dataset.change];t&&Promise.resolve(t(a)).catch(s=>v(s.message,6e3))});document.addEventListener("input",e=>{var t;const a=Mt[(t=e.target.dataset)==null?void 0:t.input];a&&a(e.target)});document.addEventListener("keydown",e=>{e.key==="Escape"&&o.guide.open&&ze()});window.addEventListener("online",()=>{o.online=!0,w()});window.addEventListener("offline",()=>{o.online=!1,w()});async function Bt(){if(!("caches"in window))return;const e=await caches.open("kitabu-shell-v2"),a=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const i of performance.getEntriesByType("resource"))t.add(i.name);await Promise.all([...t].map(async i=>{try{const s=new URL(i);if(s.pathname.endsWith("/data/bookings.json"))return;const l=s.origin===location.origin?e:s.hostname==="cdn.jsdelivr.net"?a:null;l&&!await l.match(i)&&await l.add(i)}catch{}}))}async function Tt(){const e=await p.getSetting("lang",null);return e||((navigator.languages||[navigator.language||"en"]).some(t=>String(t).toLowerCase().startsWith("sw"))?"sw":"en")}async function Lt(){Oe(await Tt()),await P(),await p.getSetting("kiosk",!1)?(o.visitor={lang:ve(),saved:!1,draft:{}},o.screen="visitor"):o.screen=o.role==="host"?"home":o.role==="company"?"company":"choose",w(),o.screen==="home"&&!await p.getSetting("guideSeen",!1)&&V(0),await ee(),w(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(Bt).catch(a=>console.warn("Offline cache not available",a)),"speechSynthesis"in window&&speechSynthesis.getVoices(),ye().then(a=>{a&&navigator.onLine&&Da()})}Lt().catch(e=>{console.error(e),qe.innerHTML=`<div class="notice neg"><strong>${n("Hitilafu","Error")}</strong>${r(e.message)}</div>`});
