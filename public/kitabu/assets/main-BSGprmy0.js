import{l as v,t as T,P as D,L as x,e as Ce,f as Je,g as Ve,i as Ne,c as Ye,a as Ze,j as Qe,k as n,h as r,b as I,d as $,m as Ee,n as Ae,o as B,q as R,s as H,r as Xe,u as ea,p as W,v as aa,w as ta,x as y,y as na,z as se,S as C,A as ia,B as sa,C as oa,D as la,E as da,F as ra,G as fe,K as Me,H as ca,I as q,O as ua}from"./ui-gXVVOZoJ.js";const ga="kitabu",ma=1,Pe=["guests","entries","bookings","messages","settings"];let ae=null;function pa(){return ae||(ae=new Promise((e,a)=>{const t=indexedDB.open(ga,ma);t.onupgradeneeded=()=>{const i=t.result;for(const o of Pe)i.objectStoreNames.contains(o)||i.createObjectStore(o,{keyPath:o==="settings"?"key":"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>a(t.error)}),ae)}function O(e,a,t){return pa().then(i=>new Promise((o,s)=>{const d=i.transaction(e,a),c=d.objectStore(e);let w;Promise.resolve(t(c)).then(g=>{w=g}),d.oncomplete=()=>o(w),d.onerror=()=>s(d.error),d.onabort=()=>s(d.error)}))}function Ie(e){return new Promise((a,t)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>t(e.error)})}const k={async all(e){return O(e,"readonly",a=>Ie(a.getAll()))},async get(e,a){return O(e,"readonly",t=>Ie(t.get(a)))},async put(e,a){return await O(e,"readwrite",t=>{t.put(a)}),a},async putMany(e,a){await O(e,"readwrite",t=>{for(const i of a)t.put(i)})},async del(e,a){await O(e,"readwrite",t=>{t.delete(a)})},async clear(e){await O(e,"readwrite",a=>{a.clear()})},async getSetting(e,a=null){const t=await this.get("settings",e);return t?t.value:a},async setSetting(e,a){return this.put("settings",{key:e,value:a})},async wipeAll(){for(const e of Pe)await this.clear(e)}};function S(e="id"){return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const ha=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],fa=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function ke(e){const a=new Date(e);return`${ha[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function ka(e){const a=new Date(e);return`${fa[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function wa(e){if(!e.length)return"Kitabu: Hakuna wageni waliopangwa wiki ijayo.";const a=e.reduce((i,o)=>i+(Number(o.guests)||1),0),t=e.slice().sort((i,o)=>new Date(i.date)-new Date(o.date)).map(i=>`${ke(i.date)}: wageni ${i.guests} (${v(i.language,"sw")})${i.guide?`, mwongozaji ${i.guide}`:""}`);return`Kitabu: Wiki ijayo wageni ${a}.
${t.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function we(e){return e.guests&&e.products.find(a=>a.guests>=3&&a.guests/e.guests>=.4)||null}function be(e){return`Kitabu: Wageni wapya. ${ke(e.date)}: wageni ${e.guests} (${v(e.language,"sw")})${e.guide?`, mwongozaji ${e.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.`}const U=e=>`${e} ${e===1?"guest":"guests"}`,Be=e=>`${e} ${e===1?"entry":"entries"}`;function ba(e){const a=[],t=[];if(a.push(`Kipindi hiki: wageni ${e.guests}, maoni ${e.entries}.`),t.push(`This period: ${U(e.guests)}, ${Be(e.entries)}.`),e.guests===0)return a.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),t.push("No feedback yet. Add guest feedback first."),{sw:a,en:t};e.guests<5&&(a.push(`Tahadhari: maoni bado ni machache (wageni ${e.guests}). Ni mapema kufanya uamuzi mkubwa.`),t.push(`Caution: still little feedback (${U(e.guests)}). Too early for big decisions.`));const o=e.liked.filter(c=>c.id!=="other").slice(0,3);o.length&&(a.push("Walichopenda zaidi: "+o.map(c=>`${T(c.id).sw.split(" (")[0].toLowerCase()} (wageni ${c.guests})`).join("; ")+"."),t.push("What they liked most: "+o.map(c=>`${T(c.id).en.toLowerCase()} (${U(c.guests)})`).join("; ")+"."));const s=e.improve.filter(c=>c.id!=="other").slice(0,3);s.length?(a.push("Wanachotaka kiboreshwe: "+s.map(c=>`${T(c.id).sw.split(" (")[0].toLowerCase()} (wageni ${c.guests})`).join("; ")+"."),t.push("What they want improved: "+s.map(c=>`${T(c.id).en.toLowerCase()} (${U(c.guests)})`).join("; ")+".")):(a.push("Hakuna malalamiko yaliyotajwa."),t.push("No complaints were mentioned.")),e.products.length&&(a.push("Bidhaa ambazo wageni walitaka kununua: "+e.products.map(c=>`${D.find(w=>w.id===c.id).sw} (wageni ${c.guests})`).join("; ")+"."),t.push("Products guests wanted to buy: "+e.products.map(c=>`${D.find(w=>w.id===c.id).en} (${U(c.guests)})`).join("; ")+"."));const d=we(e);if(d){const c=D.find(w=>w.id===d.id);a.push(`Wazo: wageni ${d.guests} kati ya ${e.guests} walitaka ${c.sw}. Unaweza kufikiria kuuza ${c.sw}. Uamuzi ni wako.`),t.push(`Idea: ${d.guests} of ${e.guests} guests wanted ${c.en}. You could consider selling ${c.en}. The decision is yours.`)}return e.unsure>0&&(a.push(`Sentensi ${e.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),t.push(`${e.unsure} ${e.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${e.unsure===1?"it":"them"} with your helper or the guide.`)),e.swahiliEntries>0&&(a.push(`Maoni ${e.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),t.push(`${Be(e.swahiliEntries)} in Swahili — Noor reads ${e.swahiliEntries===1?"it":"them"} directly.`)),{sw:a,en:t}}const de={sw:{liked:(e,a)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${a}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`,plain:e=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`},en:{liked:(e,a)=>`Dear ${e}, thank you for visiting our coffee farm! We are glad you enjoyed ${a}. You are always welcome back, and please tell your friends about us. — Noor`,plain:e=>`Dear ${e}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — Noor`},it:{liked:(e,a)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${a}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`,plain:e=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`},fr:{liked:(e,a)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${a}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`,plain:e=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`},de:{liked:(e,a)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${a}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`,plain:e=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`},zh:{liked:(e,a)=>`${e}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${a}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`,plain:e=>`${e}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`},es:{liked:(e,a)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${a}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`,plain:e=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`},pl:{liked:(e,a)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${a}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`,plain:e=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`}};function Le(e,a){const t=de[e.language]?e.language:"en",i=t!==e.language,o=(e.name||"").trim()||(t==="zh"?"":"friend"),s=a?Ce.find(c=>c.id===a):null,d=c=>s?de[c].liked(o,s.msg[c]||s.msg.en):de[c].plain(o);return{lang:t,text:d(t),sw:d("sw"),usedFallback:i}}const Te={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function Oe(e,a){const t=[];t.push(`Ripoti ya maoni — ${a}`),t.push(`Feedback report — ${a}`),t.push(""),t.push(`Wageni / Guests: ${e.guests}`);const i=Object.entries(e.languages).map(([s,d])=>`${x[s]?x[s].en:s} ${d}`).join(", ");i&&t.push(`Lugha / Languages: ${i}`),t.push(""),t.push("Walichopenda / Liked:");for(const s of e.liked.filter(d=>d.id!=="other").slice(0,5))t.push(`  • ${T(s.id).en}: ${s.guests}`);t.push("Kuboresha / To improve:");const o=e.improve.filter(s=>s.id!=="other").slice(0,5);o.length||t.push("  • —");for(const s of o)t.push(`  • ${T(s.id).en}: ${s.guests}`);if(e.products.length){t.push("Bidhaa / Product interest:");for(const s of e.products)t.push(`  • ${D.find(d=>d.id===s.id).en}: ${s.guests}`)}return t.push(""),t.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),t.push("Imeidhinishwa na Noor kabla ya kutumwa. / Approved by Noor before sharing."),t.join(`
`)}function Z(e){return!e.confirmed&&(e.topic==="other"||e.sentiment==="unsure"||(e.flags||[]).length>0)}function va(e,a,t=new Date){if(a==="all")return!0;const i=new Date(e),o=a==="week"?7:a==="month"?31:3650;return t-i<=o*24*3600*1e3&&i-t<=24*3600*1e3}function ya(e,a){const t=Object.fromEntries(a.map(m=>[m.id,m])),i=new Set,o={},s={},d={},c={};let w=0,g=0;const p=(m,u,b,N)=>{m[u]||(m[u]={id:u,guestIds:new Set,quotes:[]}),m[u].guestIds.add(b),N&&m[u].quotes.push(N)};for(const m of e){i.add(m.guestId),m.lang==="sw"&&g++;for(const u of m.sentences||[]){const b=Z(u);b&&w++;const N={entryId:m.id,en:u.en,original:u.original||null,lang:m.lang,flagged:b};u.sentiment==="pos"?p(s,u.topic,m.guestId,N):u.sentiment==="neg"&&p(d,u.topic,m.guestId,N)}for(const u of new Set([...m.products||[],...m.declaredProducts||[]]))p(c,u,m.guestId,null)}for(const m of i){const u=t[m],b=u?u.language:"unknown";o[b]=(o[b]||0)+1}const h=m=>Object.values(m).map(u=>({id:u.id,guests:u.guestIds.size,quotes:u.quotes})).sort((u,b)=>b.guests-u.guests);return{guests:i.size,entries:e.length,liked:h(s),improve:h(d),products:h(c),unsure:w,swahiliEntries:g,languages:o}}function $a(e,a){const t={};for(const o of e.filter(s=>s.guestId===a))for(const s of o.sentences||[])s.sentiment==="pos"&&s.topic!=="other"&&(t[s.topic]=(t[s.topic]||0)+1);const i=Object.entries(t).sort((o,s)=>s[1]-o[1])[0];return i?i[0]:null}async function We(e,a){const{original:t,lang:i,box:o}=e;if(i==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let s;e.english?s=[{original:null,en:e.english}]:s=(await Je(t,i,a)).pairs;const d=[];for(const m of s)for(const u of Ve(m.en))d.push({en:u,original:m.original});const c=s.map(m=>m.en).join(" ").trim();if(!d.length)return{english:c,sentences:[],products:Ne(c),status:"analyzed"};const w=d.map(m=>m.en),g=await Ye(w,a),p=await Ze(w,a),h=d.map((m,u)=>{var Se,je;const b=Qe(o,p[u]),N=[...b.flags];return g[u].topic==="other"&&N.push("topic-unsure"),{en:m.en,original:m.original,topic:g[u].topic,topicScore:g[u].score,runnerUp:g[u].runnerUp,sentiment:b.sentiment,moodScore:((Se=p[u])==null?void 0:Se.score)??null,modelMood:((je=p[u])==null?void 0:je.label)??null,flags:N,confirmed:!1}});return{english:c,sentences:h,products:Ne(c),status:"analyzed"}}let G;async function ve(){if(G!==void 0)return G;try{const e=await fetch("audio/sw/manifest.json");G=e.ok?await e.json():null}catch{G=null}return G}const te=e=>e>=1&&e<=20?`g_${e}`:"g_more";function xa(e){if(!e.guests)return["no_feedback"];const a=["period",te(e.guests),"gave_feedback"];e.guests<5&&a.push("few_data");const t=e.liked.filter(s=>s.id!=="other").slice(0,3);if(t.length){a.push("liked_intro");for(const s of t)a.push(`t_${s.id}`,te(s.guests))}const i=e.improve.filter(s=>s.id!=="other").slice(0,3);if(i.length){a.push("improve_intro");for(const s of i)a.push(`t_${s.id}`,te(s.guests))}else a.push("no_complaints");if(e.products.length){a.push("products_intro");for(const s of e.products)a.push(`p_${s.id}`,te(s.guests))}const o=we(e);return o&&a.push("idea_intro",`p_${o.id}`,"idea_outro"),e.unsure>0&&a.push("unsure"),e.swahiliEntries>0&&a.push("swahili_entries"),a}let ue=0,F=null;function za(){ue++,F&&(F.pause(),F=null)}async function Sa(e){const a=await ve();if(!a||!e.every(i=>a.files[i]))return!1;za();const t=++ue;for(const i of e){if(t!==ue)break;await new Promise(o=>{const s=new Audio(`audio/sw/${a.files[i]}`);F=s,s.onended=o,s.onerror=o,s.play().catch(o)})}return F=null,!0}async function ja(){const e=await ve();e&&await Promise.all(Object.values(e.files).map(a=>fetch(`audio/sw/${a}`).catch(()=>null)))}const re={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>'},_=[{icon:re.book,title:()=>n("Karibu","Welcome"),body:()=>[n("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),n("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:re.steps,title:()=>n("Hatua tatu","Three steps"),list:()=>[n("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),n("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),n("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[n("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:re.play,title:()=>n("Jaribu sasa","Try it now"),body:()=>[n("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function Na(e){const a=_[e],t=e===_.length-1,i=_.map((c,w)=>`<span class="${w===e?"on":""}"></span>`).join(""),o=a.list?`<ol class="guide-list">${a.list().map(c=>`<li>${c}</li>`).join("")}</ol>`:"",s=a.body().map(c=>`<p class="lead">${c}</p>`).join(""),d=a.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${n("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${e+1} / ${_.length}">${i}</div>
      <button class="guide-close" data-action="guide-close">${n("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${a.icon}</div>
    <h2 id="guide-title">${a.title()}</h2>
    ${o}
    ${s}
    ${d}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${e===0?"disabled":""}>${n("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${n("Endelea","Next")}</button>`}
    </div>
  </div>`}const Re=["en","it","fr","de","zh","es","pl","sw"],oe={en:{title:"Thank you for visiting!",intro:"Please tell Noor about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"Noor may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on Noor’s phone.",handBack:"Please give the phone back to Noor.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a Noor la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"Noor può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di Noor.",handBack:"Per favore, restituisci il telefono a Noor.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à Noor, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"Noor peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de Noor.",handBack:"Merci de rendre le téléphone à Noor.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie Noor von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"Noor darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf Noors Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an Noor zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 Noor 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"Noor 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 Noor 的手机上。",handBack:"请把手机还给 Noor。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a Noor cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"Noor puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de Noor.",handBack:"Por favor, devuelva el teléfono a Noor.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz Noor o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"Noor może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie Noor.",handBack:"Oddaj proszę telefon Noor.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze Noor kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"Noor anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya Noor.",handBack:"Tafadhali mrudishie Noor simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function ye(){for(const e of navigator.languages||[navigator.language||"en"]){const a=String(e).slice(0,2).toLowerCase();if(Re.includes(a))return a}return"en"}const Ma='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>';function Ia(e,a,t={}){const i=oe[e]||oe.en,o={name:"",liked:"",improve:"",email:"",...t},s=Re.map(d=>`<button class="chip" data-action="visitor-lang" data-lang="${d}" aria-pressed="${d===e}">${r(x[d].native)}</button>`).join("");return a?`
    <div class="card" lang="${e}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Ma}</div>
      <h1>${r(i.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${r(i.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${r(i.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${n("Kwa Noor tu: rudi","Host only: back")}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${r(i.lang)}">${s}</div>
  <div class="card" lang="${e}">
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
  <button class="btn small secondary" data-action="visitor-exit">${n("Kwa Noor tu: rudi","Host only: back")}</button>`}function Ba({langOptionsHTML:e,today:a,sms:t,report:i}){return`
  <h1>${n("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${n("Tuma ratiba ya wageni kwa Noor. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.","Send a booking to Noor. She gets a short Swahili SMS on her basic phone, no internet needed.")}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${n("Namba ya simu ya Noor","Noor’s phone number")}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${n("Tarehe","Date")}<input type="date" id="c-date" value="${a}" data-change="company-preview"></label>
        <label class="field">${n("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${n("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${e}</select></label>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="c-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="c-guide" autocomplete="off" data-change="company-preview"></label>
      <label class="check"><input type="checkbox" id="c-consent" data-change="company-consent"> <span>${n("Mgeni amekubali Noor awasiliane naye","The guest agreed that Noor may contact them")}</span></label>
      <label class="field hidden" id="c-email-wrap">${n("Barua pepe ya mgeni","Guest email")}<input type="email" id="c-email" autocomplete="off"></label>
    </div>
  </div>
  <div class="card">
    <h2>${n("SMS ambayo Noor atapokea","The SMS Noor will get")}</h2>
    <div class="sms" id="c-sms">${r(t)}</div>
    <div class="stack" style="margin-top:10px">
      <button class="btn" data-action="company-sms">${n("Tuma SMS kwa Noor","Send SMS to Noor")}</button>
      <button class="btn secondary" data-action="company-save">${n("Hifadhi kwenye simu hii (onyesho)","Save on this phone (demo)")}</button>
    </div>
  </div>
  <div class="card">
    <h2>${n("Unachopokea kutoka kwa Noor","What you get back from Noor")}</h2>
    <p class="small">${n("Jumla tu: wageni wangapi, walichopenda, kinachohitaji kuboreshwa, bidhaa walizotaka. Hakuna majina wala maneno ya wageni.","Totals only: how many guests, what they liked, what to improve, products they asked for. No names or quotes.")}</p>
    ${i?`<div class="sms">${r(i)}</div>`:""}
  </div>`}const He=document.getElementById("view"),E=()=>({step:1,guestId:null,inputs:[],results:[]}),l={screen:"home",guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:E(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}}};async function P(){const[e,a,t,i]=await Promise.all(["guests","entries","bookings","messages"].map(o=>k.all(o)));Object.assign(l,{guests:e,entries:a,bookings:t,messages:i}),l.lastSync=await k.getSetting("lastSync"),document.documentElement.classList.toggle("big-text",await k.getSetting("bigText",!1))}async function Q(){try{l.installed=await da();for(const e of Object.keys(C))l.shared[e]=await ra(C[e].id)}catch(e){console.warn("model check failed",e)}}const X=e=>l.guests.find(a=>a.id===e),K=()=>X(l.add.guestId);function A(){return la({guests:l.guests,bookings:l.bookings,installed:l.installed,today:new Date})}function le(){const e=l.entries.filter(t=>t.status!=="pending"&&va(t.visitDate||t.createdAt,l.period)),a=ya(e,l.guests);return{s:a,entries:e,text:ba(a)}}const V=e=>y()==="sw"?ke(e):ka(e),Y=e=>T(e)[y()].split(" (")[0],M=e=>{var a;return`<span class="chip plain lang-pill" title="${r(((a=x[e])==null?void 0:a.native)||e)}">${r(v(e,y()))}</span>`};function La(e){return e==="pos"?`<span class="chip">${n("Nzuri","Positive")}</span>`:e==="neg"?`<span class="chip neg">${n("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${n("Haijulikani","Unsure")}</span>`}function Ta(e){return e.consent?`<span class="chip">${n("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${n("Hakuna ruhusa","No consent")}</span>`}function Da(e){var a;return(a=x[e])!=null&&a.mt?l.installed.includes(e)?`<span class="chip">${n("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${n("Pakua lugha","Pack needed")}</span>`:""}const Ke={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"]},Ca=e=>Ke[e][y()==="sw"?0:1];function $e(e){const a=y();return Object.entries(x).map(([t,i])=>`<option value="${t}" ${t===e?"selected":""}>${r(i[a])}${i.native!==i[a]?` (${r(i.native)})`:""}</option>`).join("")}function Ue(e){return[...Ce,ua].map(a=>`<option value="${a.id}" ${a.id===e?"selected":""}>${r(a[y()])}</option>`).join("")}const j=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${n("Nyumbani","Home")}</button>`;function Ge(e,a,{open:t=!1}={}){const i=e.sentences[a],o=Z(i),s=(i.flags||[]).filter(c=>Ke[c]),d=i.original&&e.lang!=="en";return`
  <div class="sent">
    ${d?`<div class="orig" lang="${r(e.lang)}">“${r(i.original)}”</div>`:""}
    ${i.en?`<div class="${d?"small muted":""}">${d?"EN: ":""}${r(i.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${i.topic==="other"?"warn":""}">${r(Y(i.topic))}</span>
      ${La(i.sentiment)}
      ${o?`<span class="chip warn">${n("Angalia","Check")}</span>`:i.confirmed?`<span class="chip plain">${n("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${o&&s.length?`<div class="small muted" style="margin-top:4px">${s.map(Ca).join("; ")}</div>`:""}
    <details ${t||o?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${n("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${n("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${e.id}" data-idx="${a}">${Ue(i.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="pos" aria-pressed="${i.sentiment==="pos"}">${n("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="neg" aria-pressed="${i.sentiment==="neg"}">${n("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${e.id}" data-idx="${a}">${n("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function Ea(e){var t;const a=(t=e.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${r(e.original)}”</div>
    <div class="small muted">${n("Kiswahili: Noor anasoma mwenyewe. Weka mada kwa mkono (hiari).","Swahili: Noor reads it herself. Tag a topic by hand (optional).")}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${e.id}" aria-label="Topic">
        <option value="">— ${n("Mada","Topic")} —</option>${Ue(a==null?void 0:a.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="pos" aria-pressed="${(a==null?void 0:a.sentiment)==="pos"}">${n("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="neg" aria-pressed="${(a==null?void 0:a.sentiment)==="neg"}">${n("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function Aa(e){var s;const a=X(e.guestId),t=e.box==="liked"?n("Walipenda","Liked"):e.box==="improve"?n("Kuboresha","Could be better"):n("Maoni","Feedback"),i=e.source==="photo"?n("Picha","Photo"):e.source==="voice"?n("Sauti","Voice"):n("Imeandikwa","Typed");let o;return e.status==="pending"?o=`<p class="muted">${n("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${r(e.lang)}">“${r(e.original)}”</p>`:e.status==="swahili"?o=Ea(e):(s=e.sentences)!=null&&s.length?o=e.sentences.map((d,c)=>Ge(e,c)).join(""):o=`<p lang="${r(e.lang)}">“${r(e.original)}”</p><p class="small muted">${n("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${r((a==null?void 0:a.name)||"Mgeni")}</strong> ${M(e.lang)}</div>
      <div class="small muted">${i} · ${t}</div>
    </div>
    ${o}
    ${e.synthetic?`<div class="small muted" style="margin-top:6px">${n("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const ge='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',Pa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',Oa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',Wa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',Ra='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',Ha='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',Ka='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function Ua(e){const a=d=>d.filter(c=>c.id!=="other").slice(0,3).map(c=>Y(c.id).toLowerCase()).join(", "),t=a(e.liked),i=a(e.improve),o=[n(`Wageni ${e.guests}.`,`${e.guests} ${e.guests===1?"guest":"guests"}.`)];t&&o.push(n(`Walipenda: ${t}.`,`Loved: ${t}.`)),o.push(i?n(`Kuboresha: ${i}.`,`To improve: ${i}.`):n("Hakuna malalamiko.","No complaints."));const s=we(e);return s&&o.push(n(`Wengi wanataka kununua: ${D.find(d=>d.id===s.id).sw}.`,`Many want to buy: ${D.find(d=>d.id===s.id).en}.`)),o.join(" ")}function Ga(){const e=l.entries.filter(p=>p.status==="pending"),{s:a}=le(),t=l.guests.filter(p=>p.consent&&!l.messages.some(h=>h.guestId===p.id&&h.status==="sent")).length,i=l.bookings.filter(p=>{const h=q(p.date);return h>=0&&h<=7}),o=A(),s=l.entries.reduce((p,h)=>p+(h.sentences||[]).filter(Z).length,0),d=e.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${n(`Maoni ${e.length} bado hayajachanganuliwa`,`${e.length} new ${e.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
    </div>`:"",c=a.entries?`
    <div class="card">
      <div class="card-title"><h2>${n("Wageni walisema","What guests said")}</h2><span class="small muted">${me[l.period]()}</span></div>
      <p class="big-summary" style="margin:0">${r(Ua(a))}</p>
      ${s?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${n(`Sentensi ${s} zinahitaji kuangaliwa.`,`${s} ${s===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${d}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${Oa}${n("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${n("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${n("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${n("Bado hakuna maoni.","No feedback yet.")}</p>
      ${d}
      ${e.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,w=(p,h,m,u)=>`
    <button class="home-btn" ${p}>
      <span class="role-icon" aria-hidden="true">${h}</span>
      <span class="role-text"><strong>${m}</strong><span class="small muted">${u}</span></span>
    </button>`,g=i.length?n(`Wageni ${i.reduce((p,h)=>p+(Number(h.guests)||1),0)} siku 7 zijazo`,`${i.reduce((p,h)=>p+(Number(h.guests)||1),0)} guests in the next 7 days`)+(o.download.length?` · ${n("pakua","download")} ${o.download.map(p=>v(p,y())).join(", ")}`:""):n("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${c}
  <div class="stack">
    ${w('data-action="go" data-screen="add"',ge,n("Ongeza maoni ya mgeni","Add guest feedback"),n("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"))}
    ${w('data-action="hand-to-guest"',Ra,n("Mpe mgeni simu aandike","Let a guest write"),n("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"))}
    ${w('data-action="go" data-screen="guests"',Wa,n("Washukuru wageni","Thank guests"),t?n(`Wageni ${t} wanasubiri`,`${t} waiting`):n("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"))}
    ${w('data-action="go" data-screen="week"',Ka,n("Wiki ijayo","Next week"),g)}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="go" data-screen="company">${n("Kwa kampuni ya utalii","For tour companies")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${n("Zaidi","More")}</button>
  </div>`}function _a(){const e=l.bookings.filter(d=>q(d.date)>=0).sort((d,c)=>new Date(d.date)-new Date(c.date)),a=e.filter(d=>q(d.date)<=7),t=e.filter(d=>q(d.date)>7),i=A(),o=wa(a),s=d=>`
    <li>
      <div class="row between">
        <strong>${r(V(d.date))}</strong>
        <span class="badge-num" title="guests">${r(d.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${M(d.language)} ${Da(d.language)}
        ${d.guide?`<span class="muted">${n("Mwongozaji","Guide")}: ${r(d.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${r(d.leadName||"")}${d.company?` · ${r(d.company)}`:""}</div>
    </li>`;return`
  ${j()}
  <h1>${n("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <button class="btn block" data-action="sync" ${l.online?"":"disabled"}>${n("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${l.lastSync?`${n("Mara ya mwisho","Last updated")}: ${r(new Date(l.lastSync).toLocaleString())}`:n("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${l.online?"":` · ${n("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${a.length?`
  <div class="card">
    <h2>${n("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${a.map(s).join("")}</ul>
  </div>`:`
  <div class="notice">${n("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${n("Lugha za kuandaa","Languages to prepare")}</h2>
    ${i.download.length?`
      <div class="row">${i.download.map(d=>M(d)).join("")}</div>
      <p class="small muted">${n(`MB ${i.downloadMB}. Tumia Wi-Fi.`,`${i.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${l.online?"":"disabled"}>${n("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${n("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${i.removable.length?`
      <hr>
      <p>${n("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${i.removable.map(d=>M(d)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${n(`Futa (MB ${i.freeMB})`,`Delete (frees ${i.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${n("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  <div class="card">
    <h2>${n("SMS kwa simu ya Noor","SMS to Noor’s basic phone")}</h2>
    <div class="sms" id="sms-text">${r(o)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${n("Mfano","Preview")} · ${o.length} ${n("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${n("Nakili","Copy")}</button>
    </div>
  </div>

  ${t.length?`
  <div class="card">
    <h2>${n("Baadaye","Later")}</h2>
    <ul class="list">${t.map(s).join("")}</ul>
  </div>`:""}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${n("Ongeza mgeni kwa mkono","Add a booking by hand")}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${n("Tarehe","Date")}<input type="date" id="bk-date" value="${fe(R(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${n("Wageni","Guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${n("Lugha","Language")}<select id="bk-lang">${$e("en")}</select></label>
      </div>
      <label class="field">${n("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${n("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${n("Mgeni amekubali Noor awasiliane naye","Guest agreed that Noor may contact them")}</span></label>
      <label class="field hidden" id="bk-email-wrap">${n("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${n("Hifadhi","Save")}</button>
    </div>
  </details>`}function qa(){const e=l.add,a=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${e.step>=t?"on":""}"></span>`).join("")}</div>`;return e.step===1?j()+a+_e():e.step===2?j()+a+Fa():a+Ja()}function _e(){const e=l.bookings.filter(t=>{const i=q(t.date);return i<=1&&i>=-14}).filter(t=>!l.guests.some(i=>i.bookingId===t.id)).sort((t,i)=>new Date(i.date)-new Date(t.date)),a=l.guests.slice().sort((t,i)=>new Date(i.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${n("Mgeni ni nani?","Who is the guest?")}</h1>

  ${e.length?`
  <div class="card">
    <h2>${n("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${r(t.leadName||"Mgeni")}</strong> ${M(t.language)}<div class="small muted">${r(V(t.date))} · ${n("wageni","guests")} ${r(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${n("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${n("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${$e("en")}</select></label>
      <label class="field">${n("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${fe(new Date)}"></label>
      <label class="check"><input type="checkbox" id="ng-consent" data-change="consent-toggle">
        <span>${n("Mgeni aliweka alama: Noor anaweza kuhifadhi mawasiliano yangu","Guest ticked: Noor may keep my contact details")}</span></label>
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
        <div><strong>${r(t.name)}</strong> ${M(t.language)}<div class="small muted">${r(V(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function Fa(){var s;const e=K();if(!e)return l.add.step=1,_e();const a=((s=x[e.language])==null?void 0:s.mt)&&!l.installed.includes(e.language),t=l.add.inputs.some(d=>d.status==="ready"&&(d.text||"").trim()),i=l.add.inputs.some(d=>d.status==="working"),o=d=>{var m;const c=`
      <select data-change="box" data-id="${d.id}" aria-label="Box">
        <option value="liked" ${d.box==="liked"?"selected":""}>${n("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${d.box==="improve"?"selected":""}>${n("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${d.box==="unknown"?"selected":""}>${n("Haijulikani","Not sure")}</option>
      </select>`,w=d.langHint?`
      <div class="notice warn small">${n(`Inaonekana ni ${v(d.langHint,"sw")}, si ${v(e.language,"sw")}.`,`This looks like ${v(d.langHint,"en")}, not ${v(e.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${d.langHint}">${n(`Badilisha kuwa ${v(d.langHint,"sw")}`,`Switch to ${v(d.langHint,"en")}`)}</button></div>
      </div>`:"";let g="";d.imageURL&&(g=`<img class="preview-img" src="${d.imageURL}" alt="Photo of the guestbook box">`),d.audioURL&&(g=`<audio controls src="${d.audioURL}" style="width:100%"></audio>`);let p="";return d.status==="working"?p=`<p class="muted">${n("Inasoma…","Reading…")}</p>`:d.status==="error"?p=`<div class="notice neg small">${n("Imeshindwa","Failed")}: ${r(d.error)}</div>`:p=`
        ${(m=d.lowWords)!=null&&m.length?`<div class="notice warn small"><strong>${n("Angalia maneno haya","Check these words")}</strong>${d.lowWords.slice(0,20).map(u=>`<mark class="low">${r(u)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${d.source==="voice"?n("Alichosema mgeni","What the guest said"):n("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${d.id}" lang="${r(e.language)}">${r(d.text)}</textarea></label>
        ${d.source==="voice"&&e.language!=="en"&&e.language!=="sw"?`
        <label class="field small">${n("Kwa Kiingereza (kutoka kwa modeli ya sauti)","In English (from the voice model)")}
          <textarea data-input="input-english" data-id="${d.id}" style="min-height:80px">${r(d.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${d.source==="photo"?n("Picha","Photo"):d.source==="voice"?n("Sauti","Voice"):n("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${d.id}">${n("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${g}
        <label class="field small">${n("Kisanduku","Which box")}${c}</label>
        ${w}
        ${p}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${r(e.name)}</strong> ${M(e.language)}<div class="small muted">${r(V(e.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${n("Badilisha","Change")}</button>
    </div>
  </div>

  ${a?`<div class="notice warn">${n(`Lugha ya ${v(e.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${se}).`,`The ${v(e.language,"en")} pack is not on this phone yet. Analysing needs internet once (${se} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${ge}<span class="btn-col">${n("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${ge}<span class="btn-col">${n("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${l.recording?"danger":"secondary"}" data-action="record">
      ${l.recording?'<span class="rec-dot"></span>':Pa}<span class="btn-col">${l.recording?n("Simamisha","Stop"):n("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${Ha}<span class="btn-col">${n("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${n("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${l.add.inputs.map(o).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!i?"":"disabled"}>${n("Changanua","Analyse")}</button>`}function Ja(){const e=l.add.results.map(i=>l.entries.find(o=>o.id===i)).filter(Boolean),a=K(),t=e.reduce((i,o)=>i+(o.sentences||[]).filter(Z).length,0);return`
  <h1>${n("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${n(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} ${t===1?"sentence needs":"sentences need"} a check`)}</strong>${n("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${n("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${e.map(Aa).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${n("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${n(`Ongeza maoni mengine ya ${r((a==null?void 0:a.name)||"mgeni")}`,`Add more for ${r((a==null?void 0:a.name)||"this guest")}`)}</button>
  </div>`}const me={week:()=>n("Wiki hii","This week"),month:()=>n("Mwezi huu","This month"),all:()=>n("Zote","All time")};function Va(){const e=l.entries.filter(g=>g.status==="pending"),{s:a,entries:t,text:i}=le(),o=Object.entries(me).map(([g,p])=>`<button class="chip" data-action="period" data-period="${g}" aria-pressed="${l.period===g}">${p()}</button>`).join(""),s=(g,p)=>g.filter(h=>h.id!=="other").map(h=>{const m=a.guests?Math.round(h.guests/a.guests*100):0,u=h.quotes.slice(0,5).map(b=>`
      <blockquote class="q">${b.original&&b.lang!=="en"?`<div class="orig" lang="${r(b.lang)}">“${r(b.original)}”</div><div class="trans">EN: ${r(b.en)}</div>`:`<div class="orig">“${r(b.en)}”</div>`}
      ${b.flagged?`<span class="chip warn" style="margin-top:4px">${n("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${r(Y(h.id))}</strong><span class="badge-num ${p?"neg":""}">${h.guests}</span></div>
        <div class="bar ${p?"neg":""}"><span style="width:${m}%"></span></div>
        <details class="quotes"><summary>${n("Maneno ya wageni","What guests said")} (${h.quotes.length})</summary>${u}</details>
      </div>`}).join(""),d=[];for(const g of t)(g.sentences||[]).forEach((p,h)=>{Z(p)&&d.push([g,h])});const c=Oe(a,`${me[l.period]()}`),w=y();return`
  ${j()}
  <h1>${n("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${o}</div>

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
    <div class="card-title"><h2>${n("Kwa Noor","For Noor")}</h2>
      <button class="btn small secondary" data-action="speak">${n("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${w}">${i[w].map(g=>`<p>${r(g)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${n("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${a.liked.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Walichopenda","What they liked")}</h2>${s(a.liked,!1)}</div>`:""}
  ${a.improve.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Wanachotaka kiboreshwe","What they want improved")}</h2>${s(a.improve,!0)}</div>`:""}

  ${a.products.length?`
  <div class="card">
    <h2>${n("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${a.products.map(g=>{const p=D.find(h=>h.id===g.id);return`<div class="topic-row"><strong>${r(p[w])}</strong><span class="badge-num">${g.guests}</span></div>`}).join("")}
  </div>`:""}

  ${d.length?`
  <div class="card">
    <h2>${n("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${d.map(([g,p])=>{var h;return`<div class="small muted" style="margin-top:8px">${r(((h=X(g.guestId))==null?void 0:h.name)||"")} · ${r(v(g.lang,w))}</div>${Ge(g,p,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${n("Ripoti kwa kampuni ya utalii","Report for the tour company")}</h2>
    <p class="small muted">${n("Hakuna majina, namba wala maneno ya wageni.","No names, contacts or quotes.")}</p>
    <div class="sms" id="report-text">${r(c)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${l.shareOk?"checked":""}>
      <span>${n("Nimeisoma na nakubali ishirikiwe","I have read it and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${l.shareOk?"":"disabled"}>${n("Shiriki","Share")}</button>
  </div>`}
  `}function Ya(){const e=l.guests.slice().sort((a,t)=>new Date(t.visitDate)-new Date(a.visitDate));return e.length?`
  ${j()}
  <h1>${n("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${n("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${e.map(a=>{const t=l.entries.filter(s=>s.guestId===a.id).length,i=l.messages.some(s=>s.guestId===a.id&&s.status==="sent"),o=l.openGuest===a.id;return`
      <li>
        <div class="row between">
          <div><strong>${r(a.name)}</strong> ${M(a.language)}${a.synthetic?` <span class="chip plain">${n("mfano","example")}</span>`:""}</div>
          <span class="small muted">${r(V(a.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${Ta(a)} <span class="muted">${n("maoni","entries")}: ${t}</span>
          ${i?`<span class="chip">${n("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${a.referredBy?`<div class="small muted" style="margin-top:4px">${n("Alipendekezwa na","Recommended by")}: ${r(a.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${o?"":"secondary"}" data-action="toggle-draft" data-id="${a.id}">${n("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${a.id}">${n("Futa","Delete")}</button>
        </div>
        ${o?Za(a):""}
      </li>`}).join("")}</ul></div>`:`${j()}<h1>${n("Wageni","Guests")}</h1>
      <div class="card"><p>${n("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button></div>`}function Za(e){const a=$a(l.entries,e.id),t=Le(e,a),i=e.contact||{},o=Te[t.lang]||Te.en;let s;e.consent?i.email?s=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(i.email)}?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:i.phone?s=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(i.phone)}?body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:s=`<div class="notice small">${n("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:s=`<div class="notice warn small">${n("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const d=y();return`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${n(`Hakuna kiolezo cha ${v(e.language,"sw")} bado; tumetumia Kiingereza.`,`No ${v(e.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${n(`Kwa ${v(t.lang,"sw")}`,`In ${v(t.lang,"en")}`)}</div><p id="draft-${e.id}" style="margin:6px 0 0">${r(t.text)}</p></div>
    ${t.lang!==d?`<div class="card flat" lang="${d}"><div class="small muted">${n("Maana yake","What it says")}</div><p style="margin:6px 0 0">${r(d==="sw"?t.sw:Le({...e,language:"en"},a).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${a?n(`Mada aliyopenda: ${Y(a)}`,`Liked topic: ${Y(a)}`):n("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${s}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${e.id}">${n("Nakili","Copy")}</button>
  </div>`}function Qa(){const e=A(),a=y(),t=o=>{const s=x[o],d=l.installed.includes(o),c=[];return d&&c.push(`<span class="chip">${n("Imepakuliwa","On phone")}</span>`),e.keep.includes(o)&&c.push(`<span class="chip">${n("Inakaa daima","Kept")}</span>`),e.needed.includes(o)&&c.push(`<span class="chip warn">${n("Wiki ijayo","Needed next week")}</span>`),d&&e.removable.includes(o)&&c.push(`<span class="chip plain">${n("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${r(s[a])}</strong> <span class="muted small">${r(s.native)} · ${se} MB</span>
          <div class="row" style="margin-top:4px">${c.join("")}</div></div>
        ${d?`<button class="btn small danger" data-action="delete-pack" data-lang="${o}">${n("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${o}" ${l.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`},i=o=>{const s=C[o],d=l.shared[o];return`
      <div class="pack">
        <div><strong>${r(s[a])}</strong> <span class="muted small">${s.mb} MB</span></div>
        ${d?`<span class="chip">${n("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${o}" ${l.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`};return`
  ${j()}
  <h1>${n("Lugha","Languages")}</h1>
  <p class="small muted">${n(`Kiswahili na Kiingereza daima, pamoja na lugha ${Me} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${Me} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${n("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${n("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(C).map(i).join("")}
  </div>

  <div class="card">
    <h2>${n("Lugha za wageni","Guest languages")}</h2>
    ${e.usedDefaults?`<p class="small muted">${n("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${e.recommend.length?`
      <div class="notice small" style="margin-top:4px">${n(`Pakua ukiwa na Wi-Fi: ${e.recommend.map(o=>x[o].sw).join(", ")} (MB ${e.recommendMB}).`,`Download on Wi-Fi: ${e.recommend.map(o=>x[o].en).join(", ")} (${e.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${l.online?"":"disabled"}>${n("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${ca().map(t).join("")}
  </div>`}function Xa(){const e=l.guests.some(a=>a.synthetic);return`
  ${j()}
  <h1>${n("Zaidi","More")}</h1>

  <div class="card">
    <div class="stack">
      <button class="btn secondary block" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
      <button class="btn secondary block" data-action="toggle-big">${document.documentElement.classList.contains("big-text")?n("Herufi za kawaida","Normal text size"):n("Herufi kubwa","Large text")}</button>
      <button class="btn secondary block" data-action="go" data-screen="langs">${n("Lugha kwenye simu","Languages on this phone")}</button>
      <a class="btn secondary block" href="print/guestbook.html" target="_blank" rel="noopener">${n("Chapisha ukurasa wa kitabu cha wageni","Print the guestbook page")}</a>
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
  </div>`}function pe(){var i;const e=o=>{var s,d;return((d=(s=document.getElementById(o))==null?void 0:s.value)==null?void 0:d.trim())||""},a=!!((i=document.getElementById("c-consent"))!=null&&i.checked),t=e("c-date");return{id:S("bk"),date:B(t||R(new Date,3)),guests:Math.max(1,Number(e("c-guests"))||1),leadName:e("c-name")||"Mgeni",language:e("c-lang")||"en",guide:e("c-guide"),company:"",consent:a,email:a?e("c-email"):""}}function et(){const e=fe(R(new Date,3)),{s:a}=le(),t=a.entries?Oe(a,n("Mfano","Example")):null;return j()+Ba({langOptionsHTML:$e("en"),today:e,sms:be({date:B(e),guests:2,language:"en",guide:""}),report:t})}function at(){const e=a=>{var t;return((t=document.getElementById(a))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(l.visitor.draft={name:e("v-name"),liked:e("v-liked"),improve:e("v-improve"),email:e("v-email")})}async function tt(){var g,p,h;const e=m=>{var u,b;return((b=(u=document.getElementById(m))==null?void 0:u.value)==null?void 0:b.trim())||""},a=l.visitor.lang,t=oe[a]||oe.en,i=e("v-liked"),o=e("v-improve");if(!i&&!o){$(t.needText);return}const s=!!((g=document.getElementById("v-consent"))!=null&&g.checked),d=[(p=document.getElementById("v-buy-coffee"))!=null&&p.checked?"coffee":null,(h=document.getElementById("v-buy-souvenir"))!=null&&h.checked?"souvenir":null].filter(Boolean),c={id:S("g"),name:e("v-name")||"Mgeni",language:a,visitDate:B(new Date),consent:s,contact:s?{email:e("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await k.put("guests",c);let w=!0;for(const[m,u]of[["liked",i],["improve",o]])u&&(await k.put("entries",{id:S("fb"),guestId:c.id,lang:a,source:"visitor",box:m,original:u,status:"pending",sentences:[],products:[],declaredProducts:w?d:[],visitDate:c.visitDate,createdAt:new Date().toISOString()}),w=!1);await P(),l.visitor={lang:a,saved:!0,draft:{}},f(),window.scrollTo(0,0)}let z=null;function xe(){var e;if(z||(z=document.createElement("div"),z.className="guide-backdrop hidden",z.setAttribute("role","dialog"),z.setAttribute("aria-modal","true"),z.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(z)),z.classList.toggle("hidden",!l.guide.open),!l.guide.open){z.innerHTML="";return}z.innerHTML=Na(l.guide.step),(e=z.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||e.focus()}function ie(e=0){l.guide={open:!0,step:e},xe()}async function ze(){l.guide.open=!1,xe(),await k.setSetting("guideSeen",!0)}async function nt(){await ze();const e="demo_quick";if(!X(e)){const a={id:e,name:"Emma (mfano)",language:"en",visitDate:B(R(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await k.put("guests",a);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const i of["liked","improve"])await k.put("entries",{id:`${e}_${i}`,guestId:e,lang:"en",source:"typed",box:i,original:t[i],status:"pending",sentences:[],products:[],visitDate:a.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await P()}l.period="all",l.screen="home",f(),await Fe()}const it={home:Ga,add:qa,summary:Va,guests:Ya,week:_a,langs:Qa,more:Xa,company:et,visitor:()=>Ia(l.visitor.lang,l.visitor.saved,l.visitor.draft)};function f(){const e=l.screen;document.body.classList.toggle("mode-visitor",e==="visitor"),document.body.classList.toggle("home",e==="home"),He.innerHTML=it[e](),document.getElementById("net").textContent=l.online?n("Mtandaoni","Online"):n("Nje ya mtandao","Offline");const a=document.getElementById("lang-btn");a&&(a.textContent=y()==="sw"?"English":"Kiswahili"),l.guide.open&&xe(),e==="langs"&&na().then(t=>{const i=document.getElementById("storage-line");i&&t&&(i.textContent=n(`Nafasi iliyotumika: MB ${t.usedMB} kati ya MB ${t.quotaMB}`,`Storage used: ${t.usedMB} MB of ${t.quotaMB} MB`))})}function L(e){l.screen=e,e!=="add"&&(l.add=E()),f(),window.scrollTo(0,0)}async function ee(e){if(!e.length)return!0;const a=e.reduce((i,[o,s])=>i+(o==="pack"?se:C[s].mb),0);if(!navigator.onLine)return $(n("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const t=e.map(([i,o])=>i==="pack"?v(o,y()):C[o][y()]).join(", ");if(!confirm(n(`Pakua mara moja: takriban MB ${a} (${t}). Endelea?`,`One-time download of about ${a} MB (${t}). Continue?`)))return!1;for(const[i,o]of e)H(n("Inapakua","Downloading")+` · ${i==="pack"?v(o,y()):C[o][y()]}`),i==="pack"?await ia(o,W):await sa(o,W);return I(),await Q(),!0}async function ce(e){const a=e.filter(t=>{var i;return((i=x[t])==null?void 0:i.mt)&&!l.installed.includes(t)}).map(t=>["pack",t]);await ee(a)&&($(n("Lugha ziko tayari","Packs ready")),f())}async function De(e){if(!e.length)return;const a=e.map(t=>v(t,y())).join(", ");if(confirm(n(`Futa ${a}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${a}? They can be downloaded again later.`))){for(const t of e)await oa(x[t].mt);await Q(),$(n("Imefutwa","Deleted")),f()}}async function st(){if(!navigator.onLine)return $(n("Hakuna mtandao","Offline"));H(n("Inapokea ratiba","Receiving the schedule"));const a=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,i=a.bookings.map(s=>({id:s.id,date:B(R(t,s.dayOffset)),guests:s.guests,leadName:s.leadName,language:s.language,guide:s.guide,company:a.company,consent:!!s.consent,email:s.consent&&s.email||"",synthetic:!0}));await k.putMany("bookings",i),l.bookings=await k.all("bookings"),l.lastSync=new Date().toISOString(),await k.setSetting("lastSync",l.lastSync),I();const o=A();$(o.download.length?n(`Ratiba imepokelewa. Pakua: ${o.download.map(s=>x[s].sw).join(", ")}`,`Schedule received. Download: ${o.download.map(s=>x[s].en).join(", ")}`):n("Ratiba imepokelewa","Schedule received")),f()}async function ot(){const e=o=>{var s,d;return((d=(s=document.getElementById(o))==null?void 0:s.value)==null?void 0:d.trim())||""},a=e("bk-date");if(!a)return $(n("Weka tarehe","Add a date"));const t=document.getElementById("bk-consent").checked,i={id:S("bk"),date:B(a),guests:Math.max(1,Number(e("bk-guests"))||1),leadName:e("bk-name")||"Mgeni",language:e("bk-lang")||"en",guide:e("bk-guide"),company:"",consent:t,email:t?e("bk-email"):""};await k.put("bookings",i),l.bookings.push(i),$(n("Imehifadhiwa","Saved")),f()}async function lt(e){const a=l.bookings.find(i=>i.id===e);if(!a)return;let t=l.guests.find(i=>i.bookingId===a.id);t||(t={id:S("g"),name:a.leadName||"Mgeni",language:a.language,visitDate:a.date,consent:!!a.consent,contact:a.consent?{email:a.email||"",phone:""}:null,bookingId:a.id,groupSize:a.guests,createdAt:new Date().toISOString(),synthetic:!!a.synthetic},await k.put("guests",t),l.guests.push(t)),l.add=E(),l.add.guestId=t.id,l.add.step=2,f()}async function dt(){const e=i=>{var o,s;return((s=(o=document.getElementById(i))==null?void 0:o.value)==null?void 0:s.trim())||""},a=document.getElementById("ng-consent").checked,t={id:S("g"),name:e("ng-name")||"Mgeni",language:e("ng-lang")||"en",visitDate:B(e("ng-date")||new Date),consent:a,contact:a?{email:e("ng-email"),phone:e("ng-phone")}:null,referredBy:e("ng-ref"),createdAt:new Date().toISOString()};await k.put("guests",t),l.guests.push(t),l.add=E(),l.add.guestId=t.id,l.add.step=2,f(),window.scrollTo(0,0)}async function rt(e,a){const t=K(),i={id:S("in"),source:"photo",box:a,text:"",status:"working",imageURL:URL.createObjectURL(e),lowWords:[]};l.add.inputs.push(i),f();try{H(n("Inasoma picha","Reading the photo"));const o=await aa(e,t.language,W);Object.assign(i,{text:o.text,lowWords:o.lowWords,confidence:o.confidence,status:"ready"}),o.text||(i.status="error",i.error=n("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const s=await ta(o.text);s&&s!==t.language&&(i.langHint=s)}catch(o){i.status="error",i.error=o.message}finally{I(),f()}}async function qe(e){const a=K();if(!l.shared.voice&&!await ee([["shared","voice"]]))return;const t={id:S("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(e)};l.add.inputs.push(t),f();try{H(n("Inasikiliza","Listening"));const i=await ea(e,a.language,W);Object.assign(t,{text:i.original,english:i.english,status:"ready"}),l.shared.voice=!0}catch(i){t.status="error",t.error=i.message}finally{I(),f()}}let ne=null;async function ct(){var i;if(ne){ne.stop();return}if(!((i=navigator.mediaDevices)!=null&&i.getUserMedia)||!window.MediaRecorder){$(n("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const e=await navigator.mediaDevices.getUserMedia({audio:!0}),a=[],t=new MediaRecorder(e);t.ondataavailable=o=>{o.data.size&&a.push(o.data)},t.onstop=()=>{e.getTracks().forEach(s=>s.stop()),ne=null,l.recording=!1;const o=new Blob(a,{type:t.mimeType||"audio/webm"});f(),qe(o).catch(s=>$(s.message))},t.start(),ne=t,l.recording=!0,f()}async function ut(){var o;const e=K(),a=l.add.inputs.filter(s=>s.status==="ready"&&(s.text||"").trim());if(!a.length)return;const t=[];if(e.language!=="sw"){l.shared.topics||t.push(["shared","topics"]),l.shared.mood||t.push(["shared","mood"]);const s=a.some(d=>!(d.source==="voice"&&d.english));(o=x[e.language])!=null&&o.mt&&s&&!l.installed.includes(e.language)&&t.push(["pack",e.language])}if(!await ee(t))return;const i=[];for(const[s,d]of a.entries()){H(`${n("Inachanganua","Analysing")} ${s+1}/${a.length}`);const c=d.source==="voice"&&e.language!=="en"&&e.language!=="sw"?d.english:void 0,w=await We({original:d.text.trim(),lang:e.language,box:d.box,english:c},W),g={id:S("fb"),guestId:e.id,lang:e.language,source:d.source,box:d.box,original:d.text.trim(),...w,lowWords:d.lowWords||[],ocrConfidence:d.confidence??null,visitDate:e.visitDate,createdAt:new Date().toISOString()};await k.put("entries",g),l.entries.push(g),i.push(g.id)}I();for(const s of l.add.inputs)s.imageURL&&URL.revokeObjectURL(s.imageURL),s.audioURL&&URL.revokeObjectURL(s.audioURL);l.add.inputs=[],l.add.results=i,l.add.step=3,await Q(),f(),window.scrollTo(0,0)}async function Fe(){var i;const e=l.entries.filter(o=>o.status==="pending"),a=[...new Set(e.map(o=>o.lang))],t=[];a.some(o=>o!=="sw")&&(l.shared.topics||t.push(["shared","topics"]),l.shared.mood||t.push(["shared","mood"]));for(const o of a)(i=x[o])!=null&&i.mt&&!l.installed.includes(o)&&t.push(["pack",o]);if(await ee(t)){for(const[o,s]of e.entries()){H(`${n("Inachanganua","Analysing")} ${o+1}/${e.length}`);const d=await We({original:s.original,lang:s.lang,box:s.box},W);Object.assign(s,d),await k.put("entries",s)}I(),await Q(),$(n("Imekamilika","Done")),f()}}async function J(e){await k.put("entries",e),f()}function he(e){const a=l.entries.find(t=>t.id===e.dataset.entry);return a?[a,a.sentences[Number(e.dataset.idx)]]:[null,null]}async function gt(){const a=await(await fetch("data/demo.json")).json(),t=new Date;for(const i of a.guests){const o={id:i.id,name:i.name,language:i.language,visitDate:B(R(t,i.dayOffset)),consent:i.consent,contact:i.consent?{email:i.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await k.put("guests",o);for(const s of["liked","improve"])i[s]&&await k.put("entries",{id:`${i.id}_${s}`,guestId:i.id,lang:i.language,source:"typed",box:s,original:i[s],status:"pending",sentences:[],products:[],visitDate:o.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await P(),l.period="all",L("home"),$(n("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function mt(){for(const e of l.guests.filter(a=>a.synthetic))await k.del("guests",e.id);for(const e of l.entries.filter(a=>a.synthetic||a.id.startsWith("demo_")))await k.del("entries",e.id);for(const e of l.bookings.filter(a=>a.synthetic))await k.del("bookings",e.id);await P(),$(n("Imeondolewa","Removed")),f()}async function pt(e){const a=X(e);if(!(!a||!confirm(n(`Futa ${a.name} na maoni yake yote?`,`Delete ${a.name} and all their feedback?`)))){await k.del("guests",e);for(const t of l.entries.filter(i=>i.guestId===e))await k.del("entries",t.id);for(const t of l.messages.filter(i=>i.guestId===e))await k.del("messages",t.id);await P(),f()}}async function ht(){var a;if(!l.shareOk)return;const e=((a=document.getElementById("report-text"))==null?void 0:a.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:e})}catch{}else await Ee(e)}async function ft(){const{s:e,text:a}=le(),t=y();t==="sw"&&await Sa(xa(e))||Xe(a[t].join(" "),t)}async function kt(){l.visitor={lang:ye(),saved:!1,draft:{}},await k.setSetting("kiosk",!0),L("visitor")}const wt={back:()=>L("home"),go:e=>L(e.dataset.screen),"toggle-lang":async()=>{Ae(y()==="sw"?"en":"sw"),await k.setSetting("lang",y()),f()},"hand-to-guest":kt,"visitor-lang":e=>{at(),l.visitor.lang=e.dataset.lang,f()},"visitor-save":tt,"visitor-next":()=>{l.visitor={lang:ye(),saved:!1,draft:{}},f(),window.scrollTo(0,0)},"visitor-exit":async()=>{confirm(n("Kwa Noor tu: rudi nyumbani?","Host only: back to the home screen?"))&&(await k.setSetting("kiosk",!1),L("home"))},"company-sms":()=>{var t,i;const e=pe(),a=((i=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:i.trim())||"";if(!a){$(n("Weka namba ya simu ya Noor","Add Noor’s phone number"));return}window.location.href=`sms:${encodeURIComponent(a)}?body=${encodeURIComponent(be(e))}`},"company-save":async()=>{const e=pe();await k.put("bookings",e),l.bookings.push(e),$(n("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const e=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",e),await k.setSetting("bigText",e),f()},"guide-open":()=>ie(0),"guide-next":()=>ie(Math.min(l.guide.step+1,_.length-1)),"guide-prev":()=>ie(Math.max(l.guide.step-1,0)),"guide-close":ze,"guide-try":nt,sync:st,"add-booking":ot,"download-pack":e=>ce([e.dataset.lang]),"download-suggested":()=>ce(A().download),"download-recommended":()=>ce(A().recommend),"delete-pack":e=>De([e.dataset.lang]),"delete-removable":()=>De(A().removable),"download-shared":async e=>{await ee([["shared",e.dataset.key]])&&f()},"pick-booking":e=>lt(e.dataset.id),"pick-guest":e=>{l.add=E(),l.add.guestId=e.dataset.id,l.add.step=2,f(),window.scrollTo(0,0)},"save-new-guest":dt,"change-guest":()=>{l.add.step=1,f()},"add-typed":()=>{l.add.inputs.push({id:S("in"),source:"typed",box:"liked",text:"",status:"ready"}),f()},record:ct,"remove-input":e=>{l.add.inputs=l.add.inputs.filter(a=>a.id!==e.dataset.id),f()},"use-hint":async e=>{const a=K();a.language=e.dataset.lang,await k.put("guests",a),l.add.inputs.forEach(t=>{t.langHint=null}),$(`${n("Lugha","Language")}: ${v(a.language,y())}`),f()},"run-analysis":ut,"finish-add":()=>L("summary"),"more-feedback":()=>{const e=l.add.guestId;l.add=E(),l.add.guestId=e,l.add.step=2,f(),window.scrollTo(0,0)},"fix-mood":async e=>{const[a,t]=he(e);t&&(t.sentiment=e.dataset.mood,t.flags=(t.flags||[]).filter(i=>i==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await J(a))},"confirm-sent":async e=>{const[a,t]=he(e);t&&(t.confirmed=!0,t.flags=[],await J(a))},"sw-mood":async e=>{var i;const a=l.entries.find(o=>o.id===e.dataset.entry);if(!a)return;const t=((i=a.sentences)==null?void 0:i[0])||{en:"",original:a.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=e.dataset.mood,a.sentences=[t],await J(a)},period:e=>{l.period=e.dataset.period,f()},speak:ft,"analyze-pending":Fe,share:ht,"toggle-draft":e=>{l.openGuest=l.openGuest===e.dataset.id?null:e.dataset.id,f()},"mark-sent":async e=>{const a={id:S("msg"),guestId:e.dataset.id,lang:e.dataset.lang,status:"sent",at:new Date().toISOString()};await k.put("messages",a),l.messages.push(a),setTimeout(f,400)},copy:e=>{var a;return Ee(((a=document.getElementById(e.dataset.copyFrom))==null?void 0:a.textContent)||"")},"delete-guest":e=>pt(e.dataset.id),"load-demo":gt,"remove-demo":mt,wipe:async()=>{if(!confirm(n("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const e=y();await k.wipeAll(),await k.setSetting("lang",e),await P(),l.add=E(),$(n("Data yote imefutwa","All data deleted")),L("home")}},bt={"company-preview":()=>{const e=document.getElementById("c-sms");e&&(e.textContent=be(pe()))},"company-consent":e=>{var a;return(a=document.getElementById("c-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"consent-toggle":e=>{var a;return(a=document.getElementById("contact-fields"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"bk-consent-toggle":e=>{var a;return(a=document.getElementById("bk-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},box:e=>{const a=l.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.box=e.value)},"fix-topic":async e=>{const[a,t]=he(e);t&&(t.topic=e.value,t.flags=(t.flags||[]).filter(i=>i!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await J(a))},"sw-topic":async e=>{var i;const a=l.entries.find(o=>o.id===e.dataset.entry);if(!a||!e.value)return;const t=((i=a.sentences)==null?void 0:i[0])||{en:"",original:a.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=e.value,a.sentences=[t],await J(a)},"share-ok":e=>{l.shareOk=e.checked;const a=document.getElementById("share-btn");a&&(a.disabled=!e.checked)}},vt={"input-text":e=>{const a=l.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.text=e.value),yt()},"input-english":e=>{const a=l.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.english=e.value)}};function yt(){const e=document.querySelector('[data-action="run-analysis"]');if(!e)return;const a=l.add.inputs.some(i=>i.status==="ready"&&(i.text||"").trim()),t=l.add.inputs.some(i=>i.status==="working");e.disabled=!(a&&!t)}document.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=wt[a.dataset.action];t&&(a.tagName==="BUTTON"&&e.preventDefault(),Promise.resolve(t(a,e)).catch(i=>{console.error(i),I(),$(`${n("Hitilafu","Error")}: ${i.message}`,6e3)}))});document.addEventListener("change",e=>{var i;const a=e.target;if(a.matches("input[type=file][data-file]")){const o=(i=a.files)==null?void 0:i[0];if(a.value="",!o)return;const s=a.dataset.file;(s==="audio"?qe(o):rt(o,s==="photo-liked"?"liked":"improve")).catch(c=>{I(),$(c.message,6e3)});return}const t=bt[a.dataset.change];t&&Promise.resolve(t(a)).catch(o=>$(o.message,6e3))});document.addEventListener("input",e=>{var t;const a=vt[(t=e.target.dataset)==null?void 0:t.input];a&&a(e.target)});document.addEventListener("keydown",e=>{e.key==="Escape"&&l.guide.open&&ze()});window.addEventListener("online",()=>{l.online=!0,f()});window.addEventListener("offline",()=>{l.online=!1,f()});async function $t(){if(!("caches"in window))return;const e=await caches.open("kitabu-shell-v2"),a=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const i of performance.getEntriesByType("resource"))t.add(i.name);await Promise.all([...t].map(async i=>{try{const o=new URL(i);if(o.pathname.endsWith("/data/bookings.json"))return;const s=o.origin===location.origin?e:o.hostname==="cdn.jsdelivr.net"?a:null;s&&!await s.match(i)&&await s.add(i)}catch{}}))}async function xt(){const e=await k.getSetting("lang",null);return e||((navigator.languages||[navigator.language||"en"]).some(t=>String(t).toLowerCase().startsWith("sw"))?"sw":"en")}async function zt(){Ae(await xt()),await P(),await k.getSetting("kiosk",!1)&&(l.visitor={lang:ye(),saved:!1,draft:{}},l.screen="visitor"),f(),l.screen==="home"&&!await k.getSetting("guideSeen",!1)&&ie(0),await Q(),f(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then($t).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),ve().then(e=>{e&&navigator.onLine&&ja()})}zt().catch(e=>{console.error(e),He.innerHTML=`<div class="notice neg"><strong>${n("Hitilafu","Error")}</strong>${r(e.message)}</div>`});
