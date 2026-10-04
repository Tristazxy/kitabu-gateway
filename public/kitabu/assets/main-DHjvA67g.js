import{l as v,t as N,P as C,L as z,e as Ae,f as Qe,g as Xe,i as Ie,c as ea,a as aa,j as ta,k as n,m as f,h as r,b as T,d as y,n as Pe,o as We,q as Oe,r as L,u as H,s as K,v as na,w as ia,p as R,x as sa,y as oa,z as x,A as la,B as oe,S as E,C as da,D as ra,E as ca,F as ua,G as ga,H as ma,I as fe,K as Be,J as pa,N as F,O as ha}from"./ui-BK4wAuFa.js";const fa="kitabu",ka=1,Re=["guests","entries","bookings","messages","settings"];let te=null;function wa(){return te||(te=new Promise((e,a)=>{const t=indexedDB.open(fa,ka);t.onupgradeneeded=()=>{const i=t.result;for(const s of Re)i.objectStoreNames.contains(s)||i.createObjectStore(s,{keyPath:s==="settings"?"key":"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>a(t.error)}),te)}function O(e,a,t){return wa().then(i=>new Promise((s,o)=>{const d=i.transaction(e,a),u=d.objectStore(e);let c;Promise.resolve(t(u)).then(g=>{c=g}),d.oncomplete=()=>s(c),d.onerror=()=>o(d.error),d.onabort=()=>o(d.error)}))}function Te(e){return new Promise((a,t)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>t(e.error)})}const w={async all(e){return O(e,"readonly",a=>Te(a.getAll()))},async get(e,a){return O(e,"readonly",t=>Te(t.get(a)))},async put(e,a){return await O(e,"readwrite",t=>{t.put(a)}),a},async putMany(e,a){await O(e,"readwrite",t=>{for(const i of a)t.put(i)})},async del(e,a){await O(e,"readwrite",t=>{t.delete(a)})},async clear(e){await O(e,"readwrite",a=>{a.clear()})},async getSetting(e,a=null){const t=await this.get("settings",e);return t?t.value:a},async setSetting(e,a){return this.put("settings",{key:e,value:a})},async wipeAll(){for(const e of Re)await this.clear(e)}};function j(e="id"){return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const $a=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],ba=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function ke(e){const a=new Date(e);return`${$a[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function va(e){const a=new Date(e);return`${ba[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function ya(e){if(!e.length)return"WeKaribu: Hakuna wageni waliopangwa wiki ijayo.";const a=e.reduce((i,s)=>i+(Number(s.guests)||1),0),t=e.slice().sort((i,s)=>new Date(i.date)-new Date(s.date)).map(i=>`${ke(i.date)}: wageni ${i.guests} (${v(i.language,"sw")})${i.guide?`, mwongozaji ${i.guide}`:""}`);return`WeKaribu: Wiki ijayo wageni ${a}.
${t.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function we(e){return e.guests&&e.products.find(a=>a.guests>=3&&a.guests/e.guests>=.4)||null}function $e(e){return`WeKaribu: Wageni wapya. ${ke(e.date)}: wageni ${e.guests} (${v(e.language,"sw")})${e.guide?`, mwongozaji ${e.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const G=e=>`${e} ${e===1?"guest":"guests"}`,Le=e=>`${e} ${e===1?"entry":"entries"}`;function xa(e,a="Noor"){const t=[],i=[];if(t.push(`Kipindi hiki: wageni ${e.guests}, maoni ${e.entries}.`),i.push(`This period: ${G(e.guests)}, ${Le(e.entries)}.`),e.guests===0)return t.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),i.push("No feedback yet. Add guest feedback first."),{sw:t,en:i};e.guests<5&&(t.push(`Tahadhari: maoni bado ni machache (wageni ${e.guests}). Ni mapema kufanya uamuzi mkubwa.`),i.push(`Caution: still little feedback (${G(e.guests)}). Too early for big decisions.`));const o=e.liked.filter(c=>c.id!=="other").slice(0,3);o.length&&(t.push("Walichopenda zaidi: "+o.map(c=>`${N(c.id).sw.split(" (")[0].toLowerCase()} (wageni ${c.guests})`).join("; ")+"."),i.push("What they liked most: "+o.map(c=>`${N(c.id).en.toLowerCase()} (${G(c.guests)})`).join("; ")+"."));const d=e.improve.filter(c=>c.id!=="other").slice(0,3);d.length?(t.push("Wanachotaka kiboreshwe: "+d.map(c=>`${N(c.id).sw.split(" (")[0].toLowerCase()} (wageni ${c.guests})`).join("; ")+"."),i.push("What they want improved: "+d.map(c=>`${N(c.id).en.toLowerCase()} (${G(c.guests)})`).join("; ")+".")):(t.push("Hakuna malalamiko yaliyotajwa."),i.push("No complaints were mentioned.")),e.products.length&&(t.push("Bidhaa ambazo wageni walitaka kununua: "+e.products.map(c=>`${C.find(g=>g.id===c.id).sw} (wageni ${c.guests})`).join("; ")+"."),i.push("Products guests wanted to buy: "+e.products.map(c=>`${C.find(g=>g.id===c.id).en} (${G(c.guests)})`).join("; ")+"."));const u=we(e);if(u){const c=C.find(g=>g.id===u.id);t.push(`Wazo: wageni ${u.guests} kati ya ${e.guests} walitaka ${c.sw}. Unaweza kufikiria kuuza ${c.sw}. Uamuzi ni wako.`),i.push(`Idea: ${u.guests} of ${e.guests} guests wanted ${c.en}. You could consider selling ${c.en}. The decision is yours.`)}return e.unsure>0&&(t.push(`Sentensi ${e.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),i.push(`${e.unsure} ${e.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${e.unsure===1?"it":"them"} with your helper or the guide.`)),e.swahiliEntries>0&&(t.push(`Maoni ${e.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),i.push(`${Le(e.swahiliEntries)} in Swahili — ${a} reads ${e.swahiliEntries===1?"it":"them"} directly.`)),{sw:t,en:i}}const de={sw:{liked:(e,a,t)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${a}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${t}`,plain:(e,a)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${a}`},en:{liked:(e,a,t)=>`Dear ${e}, thank you for visiting our coffee farm! We are glad you enjoyed ${a}. You are always welcome back, and please tell your friends about us. — ${t}`,plain:(e,a)=>`Dear ${e}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${a}`},it:{liked:(e,a,t)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${a}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${t}`,plain:(e,a)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${a}`},fr:{liked:(e,a,t)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${a}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${t}`,plain:(e,a)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${a}`},de:{liked:(e,a,t)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${a}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${t}`,plain:(e,a)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${a}`},zh:{liked:(e,a,t)=>`${e}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${a}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${t}`,plain:(e,a)=>`${e}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${a}`},es:{liked:(e,a,t)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${a}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${t}`,plain:(e,a)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${a}`},pl:{liked:(e,a,t)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${a}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${t}`,plain:(e,a)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${a}`}};function De(e,a,t="Noor"){const i=de[e.language]?e.language:"en",s=i!==e.language,o=(e.name||"").trim()||(i==="zh"?"":"friend"),d=a?Ae.find(c=>c.id===a):null,u=c=>d?de[c].liked(o,d.msg[c]||d.msg.en,t):de[c].plain(o,t);return{lang:i,text:u(i),sw:u("sw"),usedFallback:s}}const Ne={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function He(e,a,t="Noor"){const i=[];i.push(`Ripoti ya maoni — ${a}`),i.push(`Feedback report — ${a}`),i.push(""),i.push(`Wageni / Guests: ${e.guests}`);const s=Object.entries(e.languages).map(([d,u])=>`${z[d]?z[d].en:d} ${u}`).join(", ");s&&i.push(`Lugha / Languages: ${s}`),i.push(""),i.push("Walichopenda / Liked:");for(const d of e.liked.filter(u=>u.id!=="other").slice(0,5))i.push(`  • ${N(d.id).en}: ${d.guests}`);i.push("Kuboresha / To improve:");const o=e.improve.filter(d=>d.id!=="other").slice(0,5);o.length||i.push("  • —");for(const d of o)i.push(`  • ${N(d.id).en}: ${d.guests}`);if(e.products.length){i.push("Bidhaa / Product interest:");for(const d of e.products)i.push(`  • ${C.find(u=>u.id===d.id).en}: ${d.guests}`)}return i.push(""),i.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),i.push(`Imeidhinishwa na ${t} kabla ya kutumwa. / Approved by ${t} before sharing.`),i.join(`
`)}function Q(e){return!e.confirmed&&(e.topic==="other"||e.sentiment==="unsure"||(e.flags||[]).length>0)}function za(e,a,t=new Date){if(a==="all")return!0;const i=new Date(e),s=a==="week"?7:a==="month"?31:3650;return t-i<=s*24*3600*1e3&&i-t<=24*3600*1e3}function Sa(e,a){const t=Object.fromEntries(a.map(p=>[p.id,p])),i=new Set,s={},o={},d={},u={};let c=0,g=0;const h=(p,m,b,M)=>{p[m]||(p[m]={id:m,guestIds:new Set,quotes:[]}),p[m].guestIds.add(b),M&&p[m].quotes.push(M)};for(const p of e){i.add(p.guestId),p.lang==="sw"&&g++;for(const m of p.sentences||[]){const b=Q(m);b&&c++;const M={entryId:p.id,en:m.en,original:m.original||null,lang:p.lang,flagged:b};m.sentiment==="pos"?h(o,m.topic,p.guestId,M):m.sentiment==="neg"&&h(d,m.topic,p.guestId,M)}for(const m of new Set([...p.products||[],...p.declaredProducts||[]]))h(u,m,p.guestId,null)}for(const p of i){const m=t[p],b=m?m.language:"unknown";s[b]=(s[b]||0)+1}const $=p=>Object.values(p).map(m=>({id:m.id,guests:m.guestIds.size,quotes:m.quotes})).sort((m,b)=>b.guests-m.guests);return{guests:i.size,entries:e.length,liked:$(o),improve:$(d),products:$(u),unsure:c,swahiliEntries:g,languages:s}}function ja(e,a){const t={};for(const s of e.filter(o=>o.guestId===a))for(const o of s.sentences||[])o.sentiment==="pos"&&o.topic!=="other"&&(t[o.topic]=(t[o.topic]||0)+1);const i=Object.entries(t).sort((s,o)=>o[1]-s[1])[0];return i?i[0]:null}async function Ke(e,a){const{original:t,lang:i,box:s}=e;if(i==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let o;e.english?o=[{original:null,en:e.english}]:o=(await Qe(t,i,a)).pairs;const d=[];for(const p of o)for(const m of Xe(p.en))d.push({en:m,original:p.original});const u=o.map(p=>p.en).join(" ").trim();if(!d.length)return{english:u,sentences:[],products:Ie(u),status:"analyzed"};const c=d.map(p=>p.en),g=await ea(c,a),h=await aa(c,a),$=d.map((p,m)=>{var Se,je,Me;const b=ta(s,h[m]),M=[...b.flags];return g[m].topic==="other"&&M.push("topic-unsure"),(Se=z[i])!=null&&Se.fallback&&!e.english&&M.push("fallback-pack"),{en:p.en,original:p.original,topic:g[m].topic,topicScore:g[m].score,runnerUp:g[m].runnerUp,sentiment:b.sentiment,moodScore:((je=h[m])==null?void 0:je.score)??null,modelMood:((Me=h[m])==null?void 0:Me.label)??null,flags:M,confirmed:!1}});return{english:u,sentences:$,products:Ie(u),status:"analyzed"}}let _;async function be(){if(_!==void 0)return _;try{const e=await fetch("audio/sw/manifest.json");_=e.ok?await e.json():null}catch{_=null}return _}const ne=e=>e>=1&&e<=20?`g_${e}`:"g_more";function Ma(e){if(!e.guests)return["no_feedback"];const a=["period",ne(e.guests),"gave_feedback"];e.guests<5&&a.push("few_data");const t=e.liked.filter(o=>o.id!=="other").slice(0,3);if(t.length){a.push("liked_intro");for(const o of t)a.push(`t_${o.id}`,ne(o.guests))}const i=e.improve.filter(o=>o.id!=="other").slice(0,3);if(i.length){a.push("improve_intro");for(const o of i)a.push(`t_${o.id}`,ne(o.guests))}else a.push("no_complaints");if(e.products.length){a.push("products_intro");for(const o of e.products)a.push(`p_${o.id}`,ne(o.guests))}const s=we(e);return s&&a.push("idea_intro",`p_${s.id}`,"idea_outro"),e.unsure>0&&a.push("unsure"),e.swahiliEntries>0&&a.push("swahili_entries"),a}let ue=0,J=null;function Ia(){ue++,J&&(J.pause(),J=null)}async function Ba(e){const a=await be();if(!a||!e.every(i=>a.files[i]))return!1;Ia();const t=++ue;for(const i of e){if(t!==ue)break;await new Promise(s=>{const o=new Audio(`audio/sw/${a.files[i]}`);J=o,o.onended=s,o.onerror=s,o.play().catch(s)})}return J=null,!0}async function Ta(){const e=await be();e&&await Promise.all(Object.values(e.files).map(a=>fetch(`audio/sw/${a}`).catch(()=>null)))}const re={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>'},q=[{icon:re.book,title:()=>n("Karibu","Welcome"),body:()=>[n("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),n("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:re.steps,title:()=>n("Hatua tatu","Three steps"),list:()=>[n("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),n("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),n("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[n("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:re.play,title:()=>n("Jaribu sasa","Try it now"),body:()=>[n("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function La(e){const a=q[e],t=e===q.length-1,i=q.map((u,c)=>`<span class="${c===e?"on":""}"></span>`).join(""),s=a.list?`<ol class="guide-list">${a.list().map(u=>`<li>${u}</li>`).join("")}</ol>`:"",o=a.body().map(u=>`<p class="lead">${u}</p>`).join(""),d=a.final?`
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
    ${o}
    ${d}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${e===0?"disabled":""}>${n("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${n("Endelea","Next")}</button>`}
    </div>
  </div>`}const Ue=["en","it","fr","de","zh","es","pl","sw","xx"],Ce={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function Ge(e){const a=Ce[e]||{...Ce.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},t={};for(const[i,s]of Object.entries(a))t[i]=s.replace(/\{host\}/g,f());return t}function ve(){for(const e of navigator.languages||[navigator.language||"en"]){const a=String(e).slice(0,2).toLowerCase();if(Ue.includes(a))return a}return"en"}const Da='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>';function Na(e,a,t={}){const i=Ge(e),s={name:"",liked:"",improve:"",email:"",...t},o=Ue.map(d=>`<button class="chip" data-action="visitor-lang" data-lang="${d}" aria-pressed="${d===e}">${r(z[d].native)}</button>`).join("");return a?`
    <div class="card" lang="${e}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Da}</div>
      <h1>${r(i.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${r(i.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${r(i.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${f()} tu: rudi`,`${f()} only: back`)}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${r(i.lang)}">${o}</div>
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
  <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${f()} tu: rudi`,`${f()} only: back`)}</button>`}function Ca({langOptionsHTML:e,today:a,sms:t,report:i}){return`
  <h1>${n("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${n(`Tuma ratiba ya wageni kwa ${f()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${f()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${n(`Namba ya simu ya ${f()}`,`${f()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${n("Tarehe","Date")}<input type="date" id="c-date" value="${a}" data-change="company-preview"></label>
        <label class="field">${n("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${n("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${e}</select></label>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${n(`Mgeni amekubali ${f()} awasiliane naye`,`The guest agreed that ${f()} may contact them`)}</span></label>
      <label class="field hidden" id="c-email-wrap">${n("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${n(`SMS ambayo ${f()} atapokea`,`The SMS ${f()} will get`)}</h2>
    <div class="sms" id="c-sms">${r(t)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${n(`Tuma SMS kwa ${f()}`,`Send SMS to ${f()}`)}</button>
      <button class="btn secondary" data-action="company-save">${n("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${n(`Unachopokea kutoka kwa ${f()}`,`What you get back from ${f()}`)}</h2>
    <p class="small">${n("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni. Mwenyeji anaamua kama aitume.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes. The host decides whether to send it.")}</p>
    ${i?`<div class="sms">${r(i)}</div>`:""}
  </div>`}const _e=document.getElementById("view"),A=()=>({step:1,guestId:null,inputs:[],results:[]}),l={screen:"home",guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:A(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}}};async function W(){const[e,a,t,i]=await Promise.all(["guests","entries","bookings","messages"].map(s=>w.all(s)));Object.assign(l,{guests:e,entries:a,bookings:t,messages:i}),l.lastSync=await w.getSetting("lastSync"),We(await w.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await w.getSetting("bigText",!1))}async function X(){try{l.installed=await ga();for(const e of Object.keys(E))l.shared[e]=await ma(E[e].id)}catch(e){console.warn("model check failed",e)}}const ee=e=>l.guests.find(a=>a.id===e),U=()=>ee(l.add.guestId);function P(){return ua({guests:l.guests,bookings:l.bookings,installed:l.installed,today:new Date})}function le(){const e=l.entries.filter(t=>t.status!=="pending"&&za(t.visitDate||t.createdAt,l.period)),a=Sa(e,l.guests);return{s:a,entries:e,text:xa(a,f())}}const Y=e=>x()==="sw"?ke(e):va(e),Z=e=>N(e)[x()].split(" (")[0],B=e=>{var a;return`<span class="chip plain lang-pill" title="${r(((a=z[e])==null?void 0:a.native)||e)}">${r(v(e,x()))}</span>`};function Ea(e){return e==="pos"?`<span class="chip">${n("Nzuri","Positive")}</span>`:e==="neg"?`<span class="chip neg">${n("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${n("Haijulikani","Unsure")}</span>`}function Aa(e){return e.consent?`<span class="chip">${n("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${n("Hakuna ruhusa","No consent")}</span>`}function Pa(e){var a;return(a=z[e])!=null&&a.mt?l.installed.includes(e)?`<span class="chip">${n("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${n("Pakua lugha","Pack needed")}</span>`:""}const qe={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},Wa=e=>qe[e][x()==="sw"?0:1];function ye(e){const a=x();return Object.entries(z).map(([t,i])=>`<option value="${t}" ${t===e?"selected":""}>${r(i[a])}${i.native!==i[a]?` (${r(i.native)})`:""}</option>`).join("")}function Fe(e){return[...Ae,ha].map(a=>`<option value="${a.id}" ${a.id===e?"selected":""}>${r(a[x()])}</option>`).join("")}const I=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${n("Nyumbani","Home")}</button>`;function Je(e,a,{open:t=!1}={}){const i=e.sentences[a],s=Q(i),o=(i.flags||[]).filter(u=>qe[u]),d=i.original&&e.lang!=="en";return`
  <div class="sent">
    ${d?`<div class="orig" lang="${r(e.lang)}">“${r(i.original)}”</div>`:""}
    ${i.en?`<div class="${d?"small muted":""}">${d?"EN: ":""}${r(i.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${i.topic==="other"?"warn":""}">${r(Z(i.topic))}</span>
      ${Ea(i.sentiment)}
      ${s?`<span class="chip warn">${n("Angalia","Check")}</span>`:i.confirmed?`<span class="chip plain">${n("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${s&&o.length?`<div class="small muted" style="margin-top:4px">${o.map(Wa).join("; ")}</div>`:""}
    <details ${t||s?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${n("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${n("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${e.id}" data-idx="${a}">${Fe(i.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="pos" aria-pressed="${i.sentiment==="pos"}">${n("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="neg" aria-pressed="${i.sentiment==="neg"}">${n("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${e.id}" data-idx="${a}">${n("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function Oa(e){var t;const a=(t=e.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${r(e.original)}”</div>
    <div class="small muted">${n(`Kiswahili: ${f()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${f()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${e.id}" aria-label="Topic">
        <option value="">— ${n("Mada","Topic")} —</option>${Fe(a==null?void 0:a.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="pos" aria-pressed="${(a==null?void 0:a.sentiment)==="pos"}">${n("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="neg" aria-pressed="${(a==null?void 0:a.sentiment)==="neg"}">${n("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function Ra(e){var o;const a=ee(e.guestId),t=e.box==="liked"?n("Walipenda","Liked"):e.box==="improve"?n("Kuboresha","Could be better"):n("Maoni","Feedback"),i=e.source==="photo"?n("Picha","Photo"):e.source==="voice"?n("Sauti","Voice"):n("Imeandikwa","Typed");let s;return e.status==="pending"?s=`<p class="muted">${n("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${r(e.lang)}">“${r(e.original)}”</p>`:e.status==="swahili"?s=Oa(e):(o=e.sentences)!=null&&o.length?s=e.sentences.map((d,u)=>Je(e,u)).join(""):s=`<p lang="${r(e.lang)}">“${r(e.original)}”</p><p class="small muted">${n("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${r((a==null?void 0:a.name)||"Mgeni")}</strong> ${B(e.lang)}</div>
      <div class="small muted">${i} · ${t}</div>
    </div>
    ${s}
    ${e.synthetic?`<div class="small muted" style="margin-top:6px">${n("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const ge='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',Ha='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',Ka='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Ua='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',Ga='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',_a='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',qa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function Fa(e){const a=d=>d.filter(u=>u.id!=="other").slice(0,3).map(u=>Z(u.id).toLowerCase()).join(", "),t=a(e.liked),i=a(e.improve),s=[n(`Wageni ${e.guests}.`,`${e.guests} ${e.guests===1?"guest":"guests"}.`)];t&&s.push(n(`Walipenda: ${t}.`,`Loved: ${t}.`)),s.push(i?n(`Kuboresha: ${i}.`,`To improve: ${i}.`):n("Hakuna malalamiko.","No complaints."));const o=we(e);return o&&s.push(n(`Wengi wanataka kununua: ${C.find(d=>d.id===o.id).sw}.`,`Many want to buy: ${C.find(d=>d.id===o.id).en}.`)),s.join(" ")}function Ja(){const e=l.entries.filter(h=>h.status==="pending"),{s:a}=le(),t=l.guests.filter(h=>h.consent&&!l.messages.some($=>$.guestId===h.id&&$.status==="sent")).length,i=l.bookings.filter(h=>{const $=F(h.date);return $>=0&&$<=7}),s=P(),o=l.entries.reduce((h,$)=>h+($.sentences||[]).filter(Q).length,0),d=e.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${n(`Maoni ${e.length} bado hayajachanganuliwa`,`${e.length} new ${e.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
    </div>`:"",u=a.entries?`
    <div class="card">
      <div class="card-title"><h2>${n("Wageni walisema","What guests said")}</h2><span class="small muted">${me[l.period]()}</span></div>
      <p class="big-summary" style="margin:0">${r(Fa(a))}</p>
      ${o?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${n(`Sentensi ${o} zinahitaji kuangaliwa.`,`${o} ${o===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${d}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${Ka}${n("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${n("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${n("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${n("Bado hakuna maoni.","No feedback yet.")}</p>
      ${d}
      ${e.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,c=(h,$,p,m)=>`
    <button class="home-btn" ${h}>
      <span class="role-icon" aria-hidden="true">${$}</span>
      <span class="role-text"><strong>${p}</strong><span class="small muted">${m}</span></span>
    </button>`,g=i.length?n(`Wageni ${i.reduce((h,$)=>h+(Number($.guests)||1),0)} siku 7 zijazo`,`${i.reduce((h,$)=>h+(Number($.guests)||1),0)} guests in the next 7 days`)+(s.download.length?` · ${n("pakua","download")} ${s.download.map(h=>v(h,x())).join(", ")}`:""):n("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${u}
  <div class="stack">
    ${c('data-action="go" data-screen="add"',ge,n("Ongeza maoni ya mgeni","Add guest feedback"),n("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"))}
    ${c('data-action="hand-to-guest"',Ga,n("Mpe mgeni simu aandike","Let a guest write"),n("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"))}
    ${c('data-action="go" data-screen="guests"',Ua,n("Washukuru wageni","Thank guests"),t?n(`Wageni ${t} wanasubiri`,`${t} waiting`):n("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"))}
    ${c('data-action="go" data-screen="week"',qa,n("Wiki ijayo","Next week"),g)}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="go" data-screen="company">${n("Kwa kampuni ya utalii","For tour companies")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${n("Zaidi","More")}</button>
  </div>`}function Va(){const e=l.bookings.filter(d=>F(d.date)>=0).sort((d,u)=>new Date(d.date)-new Date(u.date)),a=e.filter(d=>F(d.date)<=7),t=e.filter(d=>F(d.date)>7),i=P(),s=ya(a),o=d=>`
    <li>
      <div class="row between">
        <strong>${r(Y(d.date))}</strong>
        <span class="badge-num" title="guests">${r(d.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${B(d.language)} ${Pa(d.language)}
        ${d.guide?`<span class="muted">${n("Mwongozaji","Guide")}: ${r(d.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${r(d.leadName||"")}${d.company?` · ${r(d.company)}`:""}</div>
    </li>`;return`
  ${I()}
  <h1>${n("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <button class="btn block" data-action="sync" ${l.online?"":"disabled"}>${n("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${l.lastSync?`${n("Mara ya mwisho","Last updated")}: ${r(new Date(l.lastSync).toLocaleString())}`:n("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${l.online?"":` · ${n("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${a.length?`
  <div class="card">
    <h2>${n("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${a.map(o).join("")}</ul>
  </div>`:`
  <div class="notice">${n("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${n("Lugha za kuandaa","Languages to prepare")}</h2>
    ${i.download.length?`
      <div class="row">${i.download.map(d=>B(d)).join("")}</div>
      <p class="small muted">${n(`MB ${i.downloadMB}. Tumia Wi-Fi.`,`${i.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${l.online?"":"disabled"}>${n("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${n("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${i.removable.length?`
      <hr>
      <p>${n("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${i.removable.map(d=>B(d)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${n(`Futa (MB ${i.freeMB})`,`Delete (frees ${i.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${n("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  <div class="card">
    <h2>${n(`SMS kwa simu ya ${f()}`,`SMS to ${f()}’s basic phone`)}</h2>
    <div class="sms" id="sms-text">${r(s)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${n("Mfano","Preview")} · ${s.length} ${n("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${n("Nakili","Copy")}</button>
    </div>
  </div>

  ${t.length?`
  <div class="card">
    <h2>${n("Baadaye","Later")}</h2>
    <ul class="list">${t.map(o).join("")}</ul>
  </div>`:""}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${n("Ongeza mgeni kwa mkono","Add a booking by hand")}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${n("Tarehe","Date")}<input type="date" id="bk-date" value="${fe(H(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${n("Wageni","Guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${n("Lugha","Language")}<select id="bk-lang">${ye("en")}</select></label>
      </div>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${n(`Mgeni amekubali ${f()} awasiliane naye`,`Guest agreed that ${f()} may contact them`)}</span></label>
      <label class="field hidden" id="bk-email-wrap">${n("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${n("Hifadhi","Save")}</button>
    </div>
  </details>`}function Ya(){const e=l.add,a=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${e.step>=t?"on":""}"></span>`).join("")}</div>`;return e.step===1?I()+a+Ve():e.step===2?I()+a+Za():a+Qa()}function Ve(){const e=l.bookings.filter(t=>{const i=F(t.date);return i<=1&&i>=-14}).filter(t=>!l.guests.some(i=>i.bookingId===t.id)).sort((t,i)=>new Date(i.date)-new Date(t.date)),a=l.guests.slice().sort((t,i)=>new Date(i.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${n("Mgeni ni nani?","Who is the guest?")}</h1>

  ${e.length?`
  <div class="card">
    <h2>${n("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${r(t.leadName||"Mgeni")}</strong> ${B(t.language)}<div class="small muted">${r(Y(t.date))} · ${n("wageni","guests")} ${r(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${n("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${n("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${ye("en")}</select></label>
      <label class="field">${n("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${fe(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${n(`Mgeni aliweka alama: ${f()} anaweza kuhifadhi mawasiliano yangu`,`Guest ticked: ${f()} may keep my contact details`)}</span></label>
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
        <div><strong>${r(t.name)}</strong> ${B(t.language)}<div class="small muted">${r(Y(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function Za(){var o;const e=U();if(!e)return l.add.step=1,Ve();const a=((o=z[e.language])==null?void 0:o.mt)&&!l.installed.includes(e.language),t=l.add.inputs.some(d=>d.status==="ready"&&(d.text||"").trim()),i=l.add.inputs.some(d=>d.status==="working"),s=d=>{var p;const u=`
      <select data-change="box" data-id="${d.id}" aria-label="Box">
        <option value="liked" ${d.box==="liked"?"selected":""}>${n("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${d.box==="improve"?"selected":""}>${n("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${d.box==="unknown"?"selected":""}>${n("Haijulikani","Not sure")}</option>
      </select>`,c=d.langHint?`
      <div class="notice warn small">${n(`Inaonekana ni ${v(d.langHint,"sw")}, si ${v(e.language,"sw")}.`,`This looks like ${v(d.langHint,"en")}, not ${v(e.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${d.langHint}">${n(`Badilisha kuwa ${v(d.langHint,"sw")}`,`Switch to ${v(d.langHint,"en")}`)}</button></div>
      </div>`:"";let g="";d.imageURL&&(g=`<img class="preview-img" src="${d.imageURL}" alt="Photo of the guestbook box">`),d.audioURL&&(g=`<audio controls src="${d.audioURL}" style="width:100%"></audio>`);let h="";return d.status==="working"?h=`<p class="muted">${n("Inasoma…","Reading…")}</p>`:d.status==="error"?h=`<div class="notice neg small">${n("Imeshindwa","Failed")}: ${r(d.error)}</div>`:h=`
        ${(p=d.lowWords)!=null&&p.length?`<div class="notice warn small"><strong>${n("Angalia maneno haya","Check these words")}</strong>${d.lowWords.slice(0,20).map(m=>`<mark class="low">${r(m)}</mark>`).join(" ")}</div>`:""}
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
        ${h}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${r(e.name)}</strong> ${B(e.language)}<div class="small muted">${r(Y(e.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${n("Badilisha","Change")}</button>
    </div>
  </div>

  ${a?`<div class="notice warn">${n(`Lugha ya ${v(e.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${oe}).`,`The ${v(e.language,"en")} pack is not on this phone yet. Analysing needs internet once (${oe} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${ge}<span class="btn-col">${n("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${ge}<span class="btn-col">${n("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${l.recording?"danger":"secondary"}" data-action="record">
      ${l.recording?'<span class="rec-dot"></span>':Ha}<span class="btn-col">${l.recording?n("Simamisha","Stop"):n("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${_a}<span class="btn-col">${n("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${n("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${l.add.inputs.map(s).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!i?"":"disabled"}>${n("Changanua","Analyse")}</button>`}function Qa(){const e=l.add.results.map(i=>l.entries.find(s=>s.id===i)).filter(Boolean),a=U(),t=e.reduce((i,s)=>i+(s.sentences||[]).filter(Q).length,0);return`
  <h1>${n("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${n(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} ${t===1?"sentence needs":"sentences need"} a check`)}</strong>${n("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${n("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${e.map(Ra).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${n("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${n(`Ongeza maoni mengine ya ${r((a==null?void 0:a.name)||"mgeni")}`,`Add more for ${r((a==null?void 0:a.name)||"this guest")}`)}</button>
  </div>`}const me={week:()=>n("Wiki hii","This week"),month:()=>n("Mwezi huu","This month"),all:()=>n("Zote","All time")};function Xa(){const e=l.entries.filter(g=>g.status==="pending"),{s:a,entries:t,text:i}=le(),s=Object.entries(me).map(([g,h])=>`<button class="chip" data-action="period" data-period="${g}" aria-pressed="${l.period===g}">${h()}</button>`).join(""),o=(g,h)=>g.filter($=>$.id!=="other").map($=>{const p=a.guests?Math.round($.guests/a.guests*100):0,m=$.quotes.slice(0,5).map(b=>`
      <blockquote class="q">${b.original&&b.lang!=="en"?`<div class="orig" lang="${r(b.lang)}">“${r(b.original)}”</div><div class="trans">EN: ${r(b.en)}</div>`:`<div class="orig">“${r(b.en)}”</div>`}
      ${b.flagged?`<span class="chip warn" style="margin-top:4px">${n("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${r(Z($.id))}</strong><span class="badge-num ${h?"neg":""}">${$.guests}</span></div>
        <div class="bar ${h?"neg":""}"><span style="width:${p}%"></span></div>
        <details class="quotes"><summary>${n("Maneno ya wageni","What guests said")} (${$.quotes.length})</summary>${m}</details>
      </div>`}).join(""),d=[];for(const g of t)(g.sentences||[]).forEach((h,$)=>{Q(h)&&d.push([g,$])});const u=He(a,`${me[l.period]()}`,f()),c=x();return`
  ${I()}
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
    <div class="card-title"><h2>${n(`Kwa ${f()}`,`For ${f()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${n("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${c}">${i[c].map(g=>`<p>${r(g)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${n("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${a.liked.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Walichopenda","What they liked")}</h2>${o(a.liked,!1)}</div>`:""}
  ${a.improve.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Wanachotaka kiboreshwe","What they want improved")}</h2>${o(a.improve,!0)}</div>`:""}

  ${a.products.length?`
  <div class="card">
    <h2>${n("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${a.products.map(g=>{const h=C.find($=>$.id===g.id);return`<div class="topic-row"><strong>${r(h[c])}</strong><span class="badge-num">${g.guests}</span></div>`}).join("")}
  </div>`:""}

  ${d.length?`
  <div class="card">
    <h2>${n("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${d.map(([g,h])=>{var $;return`<div class="small muted" style="margin-top:8px">${r((($=ee(g.guestId))==null?void 0:$.name)||"")} · ${r(v(g.lang,c))}</div>${Je(g,h,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${n("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${n("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${r(u)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${l.shareOk?"checked":""}>
      <span>${n("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${l.shareOk?"":"disabled"}>${n("Shiriki","Share")}</button>
  </div>`}
  `}function et(){const e=l.guests.slice().sort((a,t)=>new Date(t.visitDate)-new Date(a.visitDate));return e.length?`
  ${I()}
  <h1>${n("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${n("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${e.map(a=>{const t=l.entries.filter(o=>o.guestId===a.id).length,i=l.messages.some(o=>o.guestId===a.id&&o.status==="sent"),s=l.openGuest===a.id;return`
      <li>
        <div class="row between">
          <div><strong>${r(a.name)}</strong> ${B(a.language)}${a.synthetic?` <span class="chip plain">${n("mfano","example")}</span>`:""}</div>
          <span class="small muted">${r(Y(a.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Aa(a)} <span class="muted">${n("maoni","entries")}: ${t}</span>
          ${i?`<span class="chip">${n("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${a.referredBy?`<div class="small muted" style="margin-top:4px">${n("Alipendekezwa na","Recommended by")}: ${r(a.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${s?"":"secondary"}" data-action="toggle-draft" data-id="${a.id}">${n("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${a.id}">${n("Futa","Delete")}</button>
        </div>
        ${s?at(a):""}
      </li>`}).join("")}</ul></div>`:`${I()}<h1>${n("Wageni","Guests")}</h1>
      <div class="card"><p>${n("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button></div>`}function at(e){const a=ja(l.entries,e.id),t=De(e,a,f()),i=e.contact||{},s=Ne[t.lang]||Ne.en;let o;e.consent?i.email?o=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(i.email)}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:i.phone?o=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(i.phone)}?body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:o=`<div class="notice small">${n("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:o=`<div class="notice warn small">${n("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const d=x();return`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${n(`Hakuna kiolezo cha ${v(e.language,"sw")} bado; tumetumia Kiingereza.`,`No ${v(e.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${n(`Kwa ${v(t.lang,"sw")}`,`In ${v(t.lang,"en")}`)}</div><p id="draft-${e.id}" style="margin:6px 0 0">${r(t.text)}</p></div>
    ${t.lang!==d?`<div class="card flat" lang="${d}"><div class="small muted">${n("Maana yake","What it says")}</div><p style="margin:6px 0 0">${r(d==="sw"?t.sw:De({...e,language:"en"},a,f()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${a?n(`Mada aliyopenda: ${Z(a)}`,`Liked topic: ${Z(a)}`):n("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${o}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${e.id}">${n("Nakili","Copy")}</button>
  </div>`}function tt(){const e=P(),a=x(),t=s=>{const o=z[s],d=l.installed.includes(s),u=[];return d&&u.push(`<span class="chip">${n("Imepakuliwa","On phone")}</span>`),e.keep.includes(s)&&u.push(`<span class="chip">${n("Inakaa daima","Kept")}</span>`),e.needed.includes(s)&&u.push(`<span class="chip warn">${n("Wiki ijayo","Needed next week")}</span>`),d&&e.removable.includes(s)&&u.push(`<span class="chip plain">${n("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${r(o[a])}</strong> <span class="muted small">${r(o.native)} · ${oe} MB</span>
          <div class="row" style="margin-top:4px">${u.join("")}</div></div>
        ${d?`<button class="btn small danger" data-action="delete-pack" data-lang="${s}">${n("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${s}" ${l.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`},i=s=>{const o=E[s],d=l.shared[s];return`
      <div class="pack">
        <div><strong>${r(o[a])}</strong> <span class="muted small">${o.mb} MB</span></div>
        ${d?`<span class="chip">${n("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${s}" ${l.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`};return`
  ${I()}
  <h1>${n("Lugha","Languages")}</h1>
  <p class="small muted">${n(`Kiswahili na Kiingereza daima, pamoja na lugha ${Be} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Be} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
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
      <div class="notice small" style="margin-top:4px">${n(`Pakua ukiwa na Wi-Fi: ${e.recommend.map(s=>z[s].sw).join(", ")} (MB ${e.recommendMB}).`,`Download on Wi-Fi: ${e.recommend.map(s=>z[s].en).join(", ")} (${e.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${l.online?"":"disabled"}>${n("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${pa().map(t).join("")}
  </div>`}function nt(){const e=l.guests.some(a=>a.synthetic);return`
  ${I()}
  <h1>${n("Zaidi","More")}</h1>

  <div class="card">
    <h2>${n("Mwenyeji","Host")}</h2>
    <label class="field">${n("Jina lako (linaonekana kwa wageni na kwenye ujumbe)","Your name (shown to guests and in messages)")}
      <input type="text" id="host-name" value="${r(f())}" autocomplete="off" maxlength="40"></label>
    <button class="btn secondary block" style="margin-top:10px" data-action="save-host">${n("Hifadhi jina","Save name")}</button>
  </div>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?n("Herufi za kawaida","Normal text size"):n("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${n("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html?host=${encodeURIComponent(f())}" target="_blank" rel="noopener">${n("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
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
  </div>`}function pe(){var i;const e=s=>{var o,d;return((d=(o=document.getElementById(s))==null?void 0:o.value)==null?void 0:d.trim())||""},a=!!((i=document.getElementById("c-consent"))!=null&&i.checked),t=e("c-date");return{id:j("bk"),date:L(t||H(new Date,3)),guests:Math.max(1,Number(e("c-guests"))||1),leadName:e("c-name")||"Mgeni",language:e("c-lang")||"en",guide:e("c-guide"),company:"",consent:a,email:a?e("c-email"):""}}function it(){const e=fe(H(new Date,3)),{s:a}=le(),t=a.entries?He(a,n("Mfano","Example"),f()):null;return I()+Ca({langOptionsHTML:ye("en"),today:e,sms:$e({date:L(e),guests:2,language:"en",guide:""}),report:t})}function st(){const e=a=>{var t;return((t=document.getElementById(a))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(l.visitor.draft={name:e("v-name"),liked:e("v-liked"),improve:e("v-improve"),email:e("v-email")})}async function ot(){var g,h,$;const e=p=>{var m,b;return((b=(m=document.getElementById(p))==null?void 0:m.value)==null?void 0:b.trim())||""},a=l.visitor.lang,t=Ge(a),i=e("v-liked"),s=e("v-improve");if(!i&&!s){y(t.needText);return}const o=!!((g=document.getElementById("v-consent"))!=null&&g.checked),d=[(h=document.getElementById("v-buy-coffee"))!=null&&h.checked?"coffee":null,($=document.getElementById("v-buy-souvenir"))!=null&&$.checked?"souvenir":null].filter(Boolean),u={id:j("g"),name:e("v-name")||"Mgeni",language:a,visitDate:L(new Date),consent:o,contact:o?{email:e("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await w.put("guests",u);let c=!0;for(const[p,m]of[["liked",i],["improve",s]])m&&(await w.put("entries",{id:j("fb"),guestId:u.id,lang:a,source:"visitor",box:p,original:m,status:"pending",sentences:[],products:[],declaredProducts:c?d:[],visitDate:u.visitDate,createdAt:new Date().toISOString()}),c=!1);await W(),l.visitor={lang:a,saved:!0,draft:{}},k(),window.scrollTo(0,0)}let S=null;function xe(){var e;if(S||(S=document.createElement("div"),S.className="guide-backdrop hidden",S.setAttribute("role","dialog"),S.setAttribute("aria-modal","true"),S.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(S)),S.classList.toggle("hidden",!l.guide.open),!l.guide.open){S.innerHTML="";return}S.innerHTML=La(l.guide.step),(e=S.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||e.focus()}function se(e=0){l.guide={open:!0,step:e},xe()}async function ze(){l.guide.open=!1,xe(),await w.setSetting("guideSeen",!0)}async function lt(){await ze();const e="demo_quick";if(!ee(e)){const a={id:e,name:"Emma (mfano)",language:"en",visitDate:L(H(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await w.put("guests",a);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const i of["liked","improve"])await w.put("entries",{id:`${e}_${i}`,guestId:e,lang:"en",source:"typed",box:i,original:t[i],status:"pending",sentences:[],products:[],visitDate:a.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await W()}l.period="all",l.screen="home",k(),await Ze()}const dt={home:Ja,add:Ya,summary:Xa,guests:et,week:Va,langs:tt,more:nt,company:it,visitor:()=>Na(l.visitor.lang,l.visitor.saved,l.visitor.draft)};function k(){const e=l.screen;document.body.classList.toggle("mode-visitor",e==="visitor"),document.body.classList.toggle("home",e==="home"),_e.innerHTML=dt[e](),document.getElementById("net").textContent=l.online?n("Mtandaoni","Online"):n("Nje ya mtandao","Offline");const a=document.getElementById("lang-btn");a&&(a.textContent=x()==="sw"?"English":"Kiswahili"),l.guide.open&&xe(),e==="langs"&&la().then(t=>{const i=document.getElementById("storage-line");i&&t&&(i.textContent=n(`Nafasi iliyotumika: MB ${t.usedMB} kati ya MB ${t.quotaMB}`,`Storage used: ${t.usedMB} MB of ${t.quotaMB} MB`))})}function D(e){l.screen=e,e!=="add"&&(l.add=A()),k(),window.scrollTo(0,0)}async function ae(e){if(!e.length)return!0;const a=e.reduce((i,[s,o])=>i+(s==="pack"?oe:E[o].mb),0);if(!navigator.onLine)return y(n("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const t=e.map(([i,s])=>i==="pack"?v(s,x()):E[s][x()]).join(", ");if(!confirm(n(`Pakua mara moja: takriban MB ${a} (${t}). Endelea?`,`One-time download of about ${a} MB (${t}). Continue?`)))return!1;for(const[i,s]of e)K(n("Inapakua","Downloading")+` · ${i==="pack"?v(s,x()):E[s][x()]}`),i==="pack"?await da(s,R):await ra(s,R);return T(),await X(),!0}async function ce(e){const a=e.filter(t=>{var i;return((i=z[t])==null?void 0:i.mt)&&!l.installed.includes(t)}).map(t=>["pack",t]);await ae(a)&&(y(n("Lugha ziko tayari","Packs ready")),k())}async function Ee(e){if(!e.length)return;const a=e.map(t=>v(t,x())).join(", ");if(confirm(n(`Futa ${a}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${a}? They can be downloaded again later.`))){for(const t of e)await ca(z[t].mt);await X(),y(n("Imefutwa","Deleted")),k()}}async function rt(){if(!navigator.onLine)return y(n("Hakuna mtandao","Offline"));K(n("Inapokea ratiba","Receiving the schedule"));const a=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,i=a.bookings.map(o=>({id:o.id,date:L(H(t,o.dayOffset)),guests:o.guests,leadName:o.leadName,language:o.language,guide:o.guide,company:a.company,consent:!!o.consent,email:o.consent&&o.email||"",synthetic:!0}));await w.putMany("bookings",i),l.bookings=await w.all("bookings"),l.lastSync=new Date().toISOString(),await w.setSetting("lastSync",l.lastSync),T();const s=P();y(s.download.length?n(`Ratiba imepokelewa. Pakua: ${s.download.map(o=>z[o].sw).join(", ")}`,`Schedule received. Download: ${s.download.map(o=>z[o].en).join(", ")}`):n("Ratiba imepokelewa","Schedule received")),k()}async function ct(){const e=s=>{var o,d;return((d=(o=document.getElementById(s))==null?void 0:o.value)==null?void 0:d.trim())||""},a=e("bk-date");if(!a)return y(n("Weka tarehe","Add a date"));const t=document.getElementById("bk-consent").checked,i={id:j("bk"),date:L(a),guests:Math.max(1,Number(e("bk-guests"))||1),leadName:e("bk-name")||"Mgeni",language:e("bk-lang")||"en",guide:e("bk-guide"),company:"",consent:t,email:t?e("bk-email"):""};await w.put("bookings",i),l.bookings.push(i),y(n("Imehifadhiwa","Saved")),k()}async function ut(e){const a=l.bookings.find(i=>i.id===e);if(!a)return;let t=l.guests.find(i=>i.bookingId===a.id);t||(t={id:j("g"),name:a.leadName||"Mgeni",language:a.language,visitDate:a.date,consent:!!a.consent,contact:a.consent?{email:a.email||"",phone:""}:null,bookingId:a.id,groupSize:a.guests,createdAt:new Date().toISOString(),synthetic:!!a.synthetic},await w.put("guests",t),l.guests.push(t)),l.add=A(),l.add.guestId=t.id,l.add.step=2,k()}async function gt(){const e=i=>{var s,o;return((o=(s=document.getElementById(i))==null?void 0:s.value)==null?void 0:o.trim())||""},a=document.getElementById("ng-consent").checked,t={id:j("g"),name:e("ng-name")||"Mgeni",language:e("ng-lang")||"en",visitDate:L(e("ng-date")||new Date),consent:a,contact:a?{email:e("ng-email"),phone:e("ng-phone")}:null,referredBy:e("ng-ref"),createdAt:new Date().toISOString()};await w.put("guests",t),l.guests.push(t),l.add=A(),l.add.guestId=t.id,l.add.step=2,k(),window.scrollTo(0,0)}async function mt(e,a){const t=U(),i={id:j("in"),source:"photo",box:a,text:"",status:"working",imageURL:URL.createObjectURL(e),lowWords:[]};l.add.inputs.push(i),k();try{K(n("Inasoma picha","Reading the photo"));const s=await sa(e,t.language,R);Object.assign(i,{text:s.text,lowWords:s.lowWords,confidence:s.confidence,status:"ready"}),s.text||(i.status="error",i.error=n("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const o=await oa(s.text);o&&o!==t.language&&(i.langHint=o)}catch(s){i.status="error",i.error=s.message}finally{T(),k()}}async function Ye(e){const a=U();if(!l.shared.voice&&!await ae([["shared","voice"]]))return;const t={id:j("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(e)};l.add.inputs.push(t),k();try{K(n("Inasikiliza","Listening"));const i=await ia(e,a.language,R);Object.assign(t,{text:i.original,english:i.english,status:"ready"}),l.shared.voice=!0}catch(i){t.status="error",t.error=i.message}finally{T(),k()}}let ie=null;async function pt(){var i;if(ie){ie.stop();return}if(!((i=navigator.mediaDevices)!=null&&i.getUserMedia)||!window.MediaRecorder){y(n("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const e=await navigator.mediaDevices.getUserMedia({audio:!0}),a=[],t=new MediaRecorder(e);t.ondataavailable=s=>{s.data.size&&a.push(s.data)},t.onstop=()=>{e.getTracks().forEach(o=>o.stop()),ie=null,l.recording=!1;const s=new Blob(a,{type:t.mimeType||"audio/webm"});k(),Ye(s).catch(o=>y(o.message))},t.start(),ie=t,l.recording=!0,k()}async function ht(){var s;const e=U(),a=l.add.inputs.filter(o=>o.status==="ready"&&(o.text||"").trim());if(!a.length)return;const t=[];if(e.language!=="sw"){l.shared.topics||t.push(["shared","topics"]),l.shared.mood||t.push(["shared","mood"]);const o=a.some(d=>!(d.source==="voice"&&d.english));(s=z[e.language])!=null&&s.mt&&o&&!l.installed.includes(e.language)&&t.push(["pack",e.language])}if(!await ae(t))return;const i=[];for(const[o,d]of a.entries()){K(`${n("Inachanganua","Analysing")} ${o+1}/${a.length}`);const u=d.source==="voice"&&e.language!=="en"&&e.language!=="sw"?d.english:void 0,c=await Ke({original:d.text.trim(),lang:e.language,box:d.box,english:u},R),g={id:j("fb"),guestId:e.id,lang:e.language,source:d.source,box:d.box,original:d.text.trim(),...c,lowWords:d.lowWords||[],ocrConfidence:d.confidence??null,visitDate:e.visitDate,createdAt:new Date().toISOString()};await w.put("entries",g),l.entries.push(g),i.push(g.id)}T();for(const o of l.add.inputs)o.imageURL&&URL.revokeObjectURL(o.imageURL),o.audioURL&&URL.revokeObjectURL(o.audioURL);l.add.inputs=[],l.add.results=i,l.add.step=3,await X(),k(),window.scrollTo(0,0)}async function Ze(){var i;const e=l.entries.filter(s=>s.status==="pending"),a=[...new Set(e.map(s=>s.lang))],t=[];a.some(s=>s!=="sw")&&(l.shared.topics||t.push(["shared","topics"]),l.shared.mood||t.push(["shared","mood"]));for(const s of a)(i=z[s])!=null&&i.mt&&!l.installed.includes(s)&&t.push(["pack",s]);if(await ae(t)){for(const[s,o]of e.entries()){K(`${n("Inachanganua","Analysing")} ${s+1}/${e.length}`);const d=await Ke({original:o.original,lang:o.lang,box:o.box},R);Object.assign(o,d),await w.put("entries",o)}T(),await X(),y(n("Imekamilika","Done")),k()}}async function V(e){await w.put("entries",e),k()}function he(e){const a=l.entries.find(t=>t.id===e.dataset.entry);return a?[a,a.sentences[Number(e.dataset.idx)]]:[null,null]}async function ft(){const a=await(await fetch("data/demo.json")).json(),t=new Date;for(const i of a.guests){const s={id:i.id,name:i.name,language:i.language,visitDate:L(H(t,i.dayOffset)),consent:i.consent,contact:i.consent?{email:i.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await w.put("guests",s);for(const o of["liked","improve"])i[o]&&await w.put("entries",{id:`${i.id}_${o}`,guestId:i.id,lang:i.language,source:"typed",box:o,original:i[o],status:"pending",sentences:[],products:[],visitDate:s.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await W(),l.period="all",D("home"),y(n("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function kt(){for(const e of l.guests.filter(a=>a.synthetic))await w.del("guests",e.id);for(const e of l.entries.filter(a=>a.synthetic||a.id.startsWith("demo_")))await w.del("entries",e.id);for(const e of l.bookings.filter(a=>a.synthetic))await w.del("bookings",e.id);await W(),y(n("Imeondolewa","Removed")),k()}async function wt(e){const a=ee(e);if(!(!a||!confirm(n(`Futa ${a.name} na maoni yake yote?`,`Delete ${a.name} and all their feedback?`)))){await w.del("guests",e);for(const t of l.entries.filter(i=>i.guestId===e))await w.del("entries",t.id);for(const t of l.messages.filter(i=>i.guestId===e))await w.del("messages",t.id);await W(),k()}}async function $t(){var a;if(!l.shareOk)return;const e=((a=document.getElementById("report-text"))==null?void 0:a.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:e})}catch{}else await Pe(e)}async function bt(){const{s:e,text:a}=le(),t=x();t==="sw"&&await Ba(Ma(e))||na(a[t].join(" "),t)}async function vt(){l.visitor={lang:ve(),saved:!1,draft:{}},await w.setSetting("kiosk",!0),D("visitor")}const yt={back:()=>D("home"),go:e=>D(e.dataset.screen),"toggle-lang":async()=>{Oe(x()==="sw"?"en":"sw"),await w.setSetting("lang",x()),k()},"hand-to-guest":vt,"visitor-lang":e=>{st(),l.visitor.lang=e.dataset.lang,k()},"visitor-save":ot,"visitor-next":()=>{l.visitor={lang:ve(),saved:!1,draft:{}},k(),window.scrollTo(0,0)},"visitor-exit":async()=>{confirm(n(`Kwa ${f()} tu: rudi nyumbani?`,`${f()} only: back to the home screen?`))&&(await w.setSetting("kiosk",!1),D("home"))},"company-sms":()=>{var t,i;const e=pe(),a=((i=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:i.trim())||"";if(!a){y(n(`Weka namba ya simu ya ${f()}`,`Add ${f()}’s phone number`));return}window.location.href=`sms:${encodeURIComponent(a)}?body=${encodeURIComponent($e(e))}`},"company-save":async()=>{const e=pe();await w.put("bookings",e),l.bookings.push(e),y(n("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const e=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",e),await w.setSetting("bigText",e),k()},"save-host":async()=>{var e;We((e=document.getElementById("host-name"))==null?void 0:e.value),await w.setSetting("hostName",f()),y(n(`Jina: ${f()}`,`Name: ${f()}`)),k()},"guide-open":()=>se(0),"guide-next":()=>se(Math.min(l.guide.step+1,q.length-1)),"guide-prev":()=>se(Math.max(l.guide.step-1,0)),"guide-close":ze,"guide-try":lt,sync:rt,"add-booking":ct,"download-pack":e=>ce([e.dataset.lang]),"download-suggested":()=>ce(P().download),"download-recommended":()=>ce(P().recommend),"delete-pack":e=>Ee([e.dataset.lang]),"delete-removable":()=>Ee(P().removable),"download-shared":async e=>{await ae([["shared",e.dataset.key]])&&k()},"pick-booking":e=>ut(e.dataset.id),"pick-guest":e=>{l.add=A(),l.add.guestId=e.dataset.id,l.add.step=2,k(),window.scrollTo(0,0)},"save-new-guest":gt,"change-guest":()=>{l.add.step=1,k()},"add-typed":()=>{l.add.inputs.push({id:j("in"),source:"typed",box:"liked",text:"",status:"ready"}),k()},record:pt,"remove-input":e=>{l.add.inputs=l.add.inputs.filter(a=>a.id!==e.dataset.id),k()},"use-hint":async e=>{const a=U();a.language=e.dataset.lang,await w.put("guests",a),l.add.inputs.forEach(t=>{t.langHint=null}),y(`${n("Lugha","Language")}: ${v(a.language,x())}`),k()},"run-analysis":ht,"finish-add":()=>D("summary"),"more-feedback":()=>{const e=l.add.guestId;l.add=A(),l.add.guestId=e,l.add.step=2,k(),window.scrollTo(0,0)},"fix-mood":async e=>{const[a,t]=he(e);t&&(t.sentiment=e.dataset.mood,t.flags=(t.flags||[]).filter(i=>i==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await V(a))},"confirm-sent":async e=>{const[a,t]=he(e);t&&(t.confirmed=!0,t.flags=[],await V(a))},"sw-mood":async e=>{var i;const a=l.entries.find(s=>s.id===e.dataset.entry);if(!a)return;const t=((i=a.sentences)==null?void 0:i[0])||{en:"",original:a.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=e.dataset.mood,a.sentences=[t],await V(a)},period:e=>{l.period=e.dataset.period,k()},speak:bt,"analyze-pending":Ze,share:$t,"toggle-draft":e=>{l.openGuest=l.openGuest===e.dataset.id?null:e.dataset.id,k()},"mark-sent":async e=>{const a={id:j("msg"),guestId:e.dataset.id,lang:e.dataset.lang,status:"sent",at:new Date().toISOString()};await w.put("messages",a),l.messages.push(a),setTimeout(k,400)},copy:e=>{var a;return Pe(((a=document.getElementById(e.dataset.copyFrom))==null?void 0:a.textContent)||"")},"delete-guest":e=>wt(e.dataset.id),"load-demo":ft,"remove-demo":kt,wipe:async()=>{if(!confirm(n("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const e=x();await w.wipeAll(),await w.setSetting("lang",e),await W(),l.add=A(),y(n("Data yote imefutwa","All data deleted")),D("home")}},xt={"company-preview":()=>{const e=document.getElementById("c-sms");e&&(e.textContent=$e(pe()))},"company-consent":e=>{var a;return(a=document.getElementById("c-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"consent-toggle":e=>{var a;return(a=document.getElementById("contact-fields"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"bk-consent-toggle":e=>{var a;return(a=document.getElementById("bk-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},box:e=>{const a=l.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.box=e.value)},"fix-topic":async e=>{const[a,t]=he(e);t&&(t.topic=e.value,t.flags=(t.flags||[]).filter(i=>i!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await V(a))},"sw-topic":async e=>{var i;const a=l.entries.find(s=>s.id===e.dataset.entry);if(!a||!e.value)return;const t=((i=a.sentences)==null?void 0:i[0])||{en:"",original:a.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=e.value,a.sentences=[t],await V(a)},"share-ok":e=>{l.shareOk=e.checked;const a=document.getElementById("share-btn");a&&(a.disabled=!e.checked)}},zt={"input-text":e=>{const a=l.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.text=e.value),St()},"input-english":e=>{const a=l.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.english=e.value)}};function St(){const e=document.querySelector('[data-action="run-analysis"]');if(!e)return;const a=l.add.inputs.some(i=>i.status==="ready"&&(i.text||"").trim()),t=l.add.inputs.some(i=>i.status==="working");e.disabled=!(a&&!t)}document.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=yt[a.dataset.action];t&&(a.tagName==="BUTTON"&&e.preventDefault(),Promise.resolve(t(a,e)).catch(i=>{console.error(i),T(),y(`${n("Hitilafu","Error")}: ${i.message}`,6e3)}))});document.addEventListener("change",e=>{var i;const a=e.target;if(a.matches("input[type=file][data-file]")){const s=(i=a.files)==null?void 0:i[0];if(a.value="",!s)return;const o=a.dataset.file;(o==="audio"?Ye(s):mt(s,o==="photo-liked"?"liked":"improve")).catch(u=>{T(),y(u.message,6e3)});return}const t=xt[a.dataset.change];t&&Promise.resolve(t(a)).catch(s=>y(s.message,6e3))});document.addEventListener("input",e=>{var t;const a=zt[(t=e.target.dataset)==null?void 0:t.input];a&&a(e.target)});document.addEventListener("keydown",e=>{e.key==="Escape"&&l.guide.open&&ze()});window.addEventListener("online",()=>{l.online=!0,k()});window.addEventListener("offline",()=>{l.online=!1,k()});async function jt(){if(!("caches"in window))return;const e=await caches.open("kitabu-shell-v2"),a=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const i of performance.getEntriesByType("resource"))t.add(i.name);await Promise.all([...t].map(async i=>{try{const s=new URL(i);if(s.pathname.endsWith("/data/bookings.json"))return;const o=s.origin===location.origin?e:s.hostname==="cdn.jsdelivr.net"?a:null;o&&!await o.match(i)&&await o.add(i)}catch{}}))}async function Mt(){const e=await w.getSetting("lang",null);return e||((navigator.languages||[navigator.language||"en"]).some(t=>String(t).toLowerCase().startsWith("sw"))?"sw":"en")}async function It(){Oe(await Mt()),await W(),await w.getSetting("kiosk",!1)&&(l.visitor={lang:ve(),saved:!1,draft:{}},l.screen="visitor"),k(),l.screen==="home"&&!await w.getSetting("guideSeen",!1)&&se(0),await X(),k(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(jt).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),be().then(e=>{e&&navigator.onLine&&Ta()})}It().catch(e=>{console.error(e),_e.innerHTML=`<div class="notice neg"><strong>${n("Hitilafu","Error")}</strong>${r(e.message)}</div>`});
