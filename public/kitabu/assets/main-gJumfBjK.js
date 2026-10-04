import{t as z,P as C,L as b,l as v,e as ma,f as Na,g as Ma,i as da,c as Da,a as Ba,j as La,b as N,d as y,h as c,k as ha,m as Aa,n as J,o as sa,s as P,q as Ea,p as E,r as Ta,u as Pa,v as d,w as Ra,x as L,S as D,y as Oa,z as Ca,A as Wa,B as Ha,C as Ka,D as Ua,E as r,F as _a,G as Y,H as fa,O as Fa,K as ra}from"./ui-CAZ5T4ZW.js";const Ga="kitabu",qa=1,wa=["guests","entries","bookings","messages","settings"];let F=null;function Ya(){return F||(F=new Promise((a,e)=>{const t=indexedDB.open(Ga,qa);t.onupgradeneeded=()=>{const n=t.result;for(const i of wa)n.objectStoreNames.contains(i)||n.createObjectStore(i,{keyPath:i==="settings"?"key":"id"})},t.onsuccess=()=>a(t.result),t.onerror=()=>e(t.error)}),F)}function B(a,e,t){return Ya().then(n=>new Promise((i,s)=>{const l=n.transaction(a,e),u=l.objectStore(a);let p;Promise.resolve(t(u)).then(f=>{p=f}),l.oncomplete=()=>i(p),l.onerror=()=>s(l.error),l.onabort=()=>s(l.error)}))}function ca(a){return new Promise((e,t)=>{a.onsuccess=()=>e(a.result),a.onerror=()=>t(a.error)})}const k={async all(a){return B(a,"readonly",e=>ca(e.getAll()))},async get(a,e){return B(a,"readonly",t=>ca(t.get(e)))},async put(a,e){return await B(a,"readwrite",t=>{t.put(e)}),e},async putMany(a,e){await B(a,"readwrite",t=>{for(const n of e)t.put(n)})},async del(a,e){await B(a,"readwrite",t=>{t.delete(e)})},async clear(a){await B(a,"readwrite",e=>{e.clear()})},async getSetting(a,e=null){const t=await this.get("settings",a);return t?t.value:e},async setSetting(a,e){return this.put("settings",{key:a,value:e})},async wipeAll(){for(const a of wa)await this.clear(a)}};function I(a="id"){return`${a}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const Ja=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],Va=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function T(a){const e=new Date(a);return`${Ja[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Za(a){const e=new Date(a);return`${Va[e.getDay()]} ${e.getDate()}/${e.getMonth()+1}`}function Xa(a){if(!a.length)return"Kitabu: Hakuna wageni waliopangwa wiki ijayo.";const e=a.reduce((n,i)=>n+(Number(i.guests)||1),0),t=a.slice().sort((n,i)=>new Date(n.date)-new Date(i.date)).map(n=>`${T(n.date)}: wageni ${n.guests} (${v(n.language,"sw")})${n.guide?`, mwongozaji ${n.guide}`:""}`);return`Kitabu: Wiki ijayo wageni ${e}.
${t.join(`
`)}
Jibu NDIYO kukubali au HAPANA kukataa.`}function ka(a){return a.guests&&a.products.find(e=>e.guests>=3&&e.guests/a.guests>=.4)||null}function Qa(a){const e=[],t=[];if(e.push(`Kipindi hiki: wageni ${a.guests}, maoni ${a.entries}.`),t.push(`This period: ${a.guests} guests, ${a.entries} feedback entries.`),a.guests===0)return e.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),t.push("No feedback yet. Add guest feedback first."),{sw:e,en:t};a.guests<5&&(e.push(`Tahadhari: maoni bado ni machache (wageni ${a.guests}). Ni mapema kufanya uamuzi mkubwa.`),t.push(`Caution: still little feedback (${a.guests} guests). Too early for big decisions.`));const i=a.liked.filter(u=>u.id!=="other").slice(0,3);i.length&&(e.push("Walichopenda zaidi: "+i.map(u=>`${z(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),t.push("What they liked most: "+i.map(u=>`${z(u.id).en.toLowerCase()} (${u.guests} guests)`).join("; ")+"."));const s=a.improve.filter(u=>u.id!=="other").slice(0,3);s.length?(e.push("Wanachotaka kiboreshwe: "+s.map(u=>`${z(u.id).sw.split(" (")[0].toLowerCase()} (wageni ${u.guests})`).join("; ")+"."),t.push("What they want improved: "+s.map(u=>`${z(u.id).en.toLowerCase()} (${u.guests} guests)`).join("; ")+".")):(e.push("Hakuna malalamiko yaliyotajwa."),t.push("No complaints were mentioned.")),a.products.length&&(e.push("Bidhaa ambazo wageni walitaka kununua: "+a.products.map(u=>`${C.find(p=>p.id===u.id).sw} (wageni ${u.guests})`).join("; ")+"."),t.push("Products guests wanted to buy: "+a.products.map(u=>`${C.find(p=>p.id===u.id).en} (${u.guests} guests)`).join("; ")+"."));const l=ka(a);if(l){const u=C.find(p=>p.id===l.id);e.push(`Wazo: wageni ${l.guests} kati ya ${a.guests} walitaka ${u.sw}. Unaweza kufikiria kuuza ${u.sw}. Uamuzi ni wako.`),t.push(`Idea: ${l.guests} of ${a.guests} guests wanted ${u.en}. You could consider selling ${u.en}. The decision is yours.`)}return a.unsure>0&&(e.push(`Sentensi ${a.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),t.push(`${a.unsure} sentences were not understood well. Please check them with your helper or the guide.`)),a.swahiliEntries>0&&(e.push(`Maoni ${a.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),t.push(`${a.swahiliEntries} entries are in Swahili — Noor reads them directly.`)),{sw:e,en:t}}const X={sw:{liked:(a,e)=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${e}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`,plain:a=>`Mpendwa ${a}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — Noor`},en:{liked:(a,e)=>`Dear ${a}, thank you for visiting our coffee farm! We are glad you enjoyed ${e}. You are always welcome back, and please tell your friends about us. — Noor`,plain:a=>`Dear ${a}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — Noor`},it:{liked:(a,e)=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${e}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`,plain:a=>`Ciao ${a}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — Noor`},fr:{liked:(a,e)=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${e}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`,plain:a=>`Bonjour ${a}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — Noor`},de:{liked:(a,e)=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${e}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`,plain:a=>`Hallo ${a}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — Noor`},zh:{liked:(a,e)=>`${a}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${e}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`,plain:a=>`${a}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— Noor`},es:{liked:(a,e)=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${e}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`,plain:a=>`Hola ${a}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — Noor`},pl:{liked:(a,e)=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${e}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`,plain:a=>`Dzień dobry ${a}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — Noor`}};function ae(a,e){const t=X[a.language]?a.language:"en",n=t!==a.language,i=(a.name||"").trim()||(t==="zh"?"":"friend"),s=e?ma.find(u=>u.id===e):null,l=u=>s?X[u].liked(i,s.msg[u]||s.msg.en):X[u].plain(i);return{lang:t,text:l(t),sw:l("sw"),usedFallback:n}}const ua={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function ee(a,e){const t=[];t.push(`Ripoti ya maoni — ${e}`),t.push(`Feedback report — ${e}`),t.push(""),t.push(`Wageni / Guests: ${a.guests}`);const n=Object.entries(a.languages).map(([s,l])=>`${b[s]?b[s].en:s} ${l}`).join(", ");n&&t.push(`Lugha / Languages: ${n}`),t.push(""),t.push("Walichopenda / Liked:");for(const s of a.liked.filter(l=>l.id!=="other").slice(0,5))t.push(`  • ${z(s.id).en}: ${s.guests}`);t.push("Kuboresha / To improve:");const i=a.improve.filter(s=>s.id!=="other").slice(0,5);i.length||t.push("  • —");for(const s of i)t.push(`  • ${z(s.id).en}: ${s.guests}`);if(a.products.length){t.push("Bidhaa / Product interest:");for(const s of a.products)t.push(`  • ${C.find(l=>l.id===s.id).en}: ${s.guests}`)}return t.push(""),t.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),t.push("Imeidhinishwa na Noor kabla ya kutumwa. / Approved by Noor before sharing."),t.join(`
`)}function V(a){return!a.confirmed&&(a.topic==="other"||a.sentiment==="unsure"||(a.flags||[]).length>0)}function te(a,e,t=new Date){if(e==="all")return!0;const n=new Date(a),i=e==="week"?7:e==="month"?31:3650;return t-n<=i*24*3600*1e3&&n-t<=24*3600*1e3}function ne(a,e){const t=Object.fromEntries(e.map(m=>[m.id,m])),n=new Set,i={},s={},l={},u={};let p=0,f=0;const w=(m,g,$,x)=>{m[g]||(m[g]={id:g,guestIds:new Set,quotes:[]}),m[g].guestIds.add($),x&&m[g].quotes.push(x)};for(const m of a){n.add(m.guestId),m.lang==="sw"&&f++;for(const g of m.sentences||[]){const $=V(g);$&&p++;const x={entryId:m.id,en:g.en,original:g.original||null,lang:m.lang,flagged:$};g.sentiment==="pos"?w(s,g.topic,m.guestId,x):g.sentiment==="neg"&&w(l,g.topic,m.guestId,x)}for(const g of m.products||[])w(u,g,m.guestId,null)}for(const m of n){const g=t[m],$=g?g.language:"unknown";i[$]=(i[$]||0)+1}const j=m=>Object.values(m).map(g=>({id:g.id,guests:g.guestIds.size,quotes:g.quotes})).sort((g,$)=>$.guests-g.guests);return{guests:n.size,entries:a.length,liked:j(s),improve:j(l),products:j(u),unsure:p,swahiliEntries:f,languages:i}}function se(a,e){const t={};for(const i of a.filter(s=>s.guestId===e))for(const s of i.sentences||[])s.sentiment==="pos"&&s.topic!=="other"&&(t[s.topic]=(t[s.topic]||0)+1);const n=Object.entries(t).sort((i,s)=>s[1]-i[1])[0];return n?n[0]:null}async function $a(a,e){const{original:t,lang:n,box:i}=a;if(n==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let s;a.english?s=[{original:null,en:a.english}]:s=(await Na(t,n,e)).pairs;const l=[];for(const m of s)for(const g of Ma(m.en))l.push({en:g,original:m.original});const u=s.map(m=>m.en).join(" ").trim();if(!l.length)return{english:u,sentences:[],products:da(u),status:"analyzed"};const p=l.map(m=>m.en),f=await Da(p,e),w=await Ba(p,e),j=l.map((m,g)=>{var oa,la;const $=La(i,w[g]),x=[...$.flags];return f[g].topic==="other"&&x.push("topic-unsure"),{en:m.en,original:m.original,topic:f[g].topic,topicScore:f[g].score,runnerUp:f[g].runnerUp,sentiment:$.sentiment,moodScore:((oa=w[g])==null?void 0:oa.score)??null,modelMood:((la=w[g])==null?void 0:la.label)??null,flags:x,confirmed:!1}});return{english:u,sentences:j,products:da(u),status:"analyzed"}}let O;async function ia(){if(O!==void 0)return O;try{const a=await fetch("audio/sw/manifest.json");O=a.ok?await a.json():null}catch{O=null}return O}const G=a=>a>=1&&a<=20?`g_${a}`:"g_more";function ie(a){if(!a.guests)return["no_feedback"];const e=["period",G(a.guests),"gave_feedback"];a.guests<5&&e.push("few_data");const t=a.liked.filter(s=>s.id!=="other").slice(0,3);if(t.length){e.push("liked_intro");for(const s of t)e.push(`t_${s.id}`,G(s.guests))}const n=a.improve.filter(s=>s.id!=="other").slice(0,3);if(n.length){e.push("improve_intro");for(const s of n)e.push(`t_${s.id}`,G(s.guests))}else e.push("no_complaints");if(a.products.length){e.push("products_intro");for(const s of a.products)e.push(`p_${s.id}`,G(s.guests))}const i=ka(a);return i&&e.push("idea_intro",`p_${i.id}`,"idea_outro"),a.unsure>0&&e.push("unsure"),a.swahiliEntries>0&&e.push("swahili_entries"),e}let ta=0,W=null;function oe(){ta++,W&&(W.pause(),W=null)}async function le(a){const e=await ia();if(!e||!a.every(n=>e.files[n]))return!1;oe();const t=++ta;for(const n of a){if(t!==ta)break;await new Promise(i=>{const s=new Audio(`audio/sw/${e.files[n]}`);W=s,s.onended=i,s.onerror=i,s.play().catch(i)})}return W=null,!0}async function de(){const a=await ia();a&&await Promise.all(Object.values(a.files).map(e=>fetch(`audio/sw/${e}`).catch(()=>null)))}const ba=document.getElementById("view"),M=()=>({step:1,guestId:null,inputs:[],results:[]}),o={tab:"week",guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:M(),recording:!1,lastSync:null,shareOk:!1,openGuest:null};async function K(){const[a,e,t,n]=await Promise.all(["guests","entries","bookings","messages"].map(s=>k.all(s)));Object.assign(o,{guests:a,entries:e,bookings:t,messages:n}),o.lastSync=await k.getSetting("lastSync");const i=await k.getSetting("showEn",!0);document.body.classList.toggle("hide-en",!i)}async function U(){try{o.installed=await Ka();for(const a of Object.keys(D))o.shared[a]=await Ua(D[a].id)}catch(a){console.warn("model check failed",a)}}const Z=a=>o.guests.find(e=>e.id===a),R=()=>Z(o.add.guestId);function A(){return Ha({guests:o.guests,bookings:o.bookings,installed:o.installed,today:new Date})}function ya(){const a=o.entries.filter(t=>t.status!=="pending"&&te(t.visitDate||t.createdAt,o.period)),e=ne(a,o.guests);return{s:e,entries:a,text:Qa(e)}}const S=a=>`<span class="chip plain lang-pill" title="${c(v(a,"en"))}">${c(v(a,"sw"))}</span>`;function re(a){return a==="pos"?`<span class="chip">${d("Nzuri","positive")}</span>`:a==="neg"?`<span class="chip neg">${d("Ya kuboresha","to improve")}</span>`:`<span class="chip warn">${d("Haijulikani","unsure")}</span>`}function va(a){return a.consent?`<span class="chip">${d("Ameruhusu mawasiliano","consented to contact")}</span>`:`<span class="chip plain">${d("Hakuna ruhusa","no consent")}</span>`}function ce(a){var e;return(e=b[a])!=null&&e.mt?o.installed.includes(a)?`<span class="chip">${d("Lugha iko tayari","pack ready")}</span>`:`<span class="chip warn">${d("Pakua lugha","pack needed")}</span>`:`<span class="chip plain">${d("Haihitaji pakiti","no pack needed")}</span>`}const Q={"topic-unsure":["Mada haijulikani","topic unclear"],conflict:["Inapingana na kisanduku alichoandika","contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","mood unclear"],"no-model":["Hakuna modeli ya hisia","no sentiment model"]};function za(a){return Object.entries(b).map(([e,t])=>`<option value="${e}" ${e===a?"selected":""}>${c(t.sw)} · ${c(t.en)} (${c(t.native)})</option>`).join("")}function ja(a){return[...ma,Fa].map(e=>`<option value="${e.id}" ${e.id===a?"selected":""}>${c(e.sw)} · ${c(e.en)}</option>`).join("")}function xa(a,e,{open:t=!1}={}){const n=a.sentences[e],i=z(n.topic),s=V(n),l=(n.flags||[]).filter(p=>Q[p]),u=n.original&&a.lang!=="en";return`
  <div class="sent">
    ${u?`<div class="orig" lang="${c(a.lang)}">“${c(n.original)}”</div>`:""}
    ${n.en?`<div class="${u?"small muted":""}">${u?"EN: ":""}${c(n.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${n.topic==="other"?"warn":""}">${c(i.sw.split(" (")[0])}<span class="en inline"> · ${c(i.en)}</span></span>
      ${re(n.sentiment)}
      ${s?`<span class="chip warn">${d("Angalia","check")}</span>`:n.confirmed?`<span class="chip plain">${d("Imethibitishwa","confirmed")}</span>`:""}
    </div>
    ${s&&l.length?`<div class="small muted" style="margin-top:4px">${l.map(p=>`${Q[p][0]} <span class="en inline">(${Q[p][1]})</span>`).join("; ")}</div>`:""}
    <details ${t||s?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${d("Rekebisha","correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${r("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${a.id}" data-idx="${e}">${ja(n.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="pos" aria-pressed="${n.sentiment==="pos"}">${d("Nzuri","positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${a.id}" data-idx="${e}" data-mood="neg" aria-pressed="${n.sentiment==="neg"}">${d("Ya kuboresha","to improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${a.id}" data-idx="${e}">${d("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function ue(a){var t;const e=(t=a.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${c(a.original)}”</div>
    <div class="small muted">${d("Kiswahili — Noor anasoma mwenyewe. Weka mada kwa mkono (hiari).","Swahili — Noor reads it herself. Tag a topic by hand (optional).")}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${a.id}" aria-label="Topic">
        <option value="">— ${c("Mada")} · topic —</option>${ja(e==null?void 0:e.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="pos" aria-pressed="${(e==null?void 0:e.sentiment)==="pos"}">${d("Nzuri","positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${a.id}" data-mood="neg" aria-pressed="${(e==null?void 0:e.sentiment)==="neg"}">${d("Ya kuboresha","to improve")}</button>
    </div>
  </div>`}function pe(a){var s,l;const e=Z(a.guestId),t=a.box==="liked"?d("Walipenda","liked box"):a.box==="improve"?d("Kuboresha","could-be-better box"):d("Maoni","feedback"),n=a.source==="photo"?d("Picha","photo"):a.source==="voice"?d("Sauti","voice"):d("Imeandikwa","typed");let i;return a.status==="pending"?i=`<p class="muted">${d("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${c(a.lang)}">“${c(a.original)}”</p>`:a.status==="swahili"?i=ue(a):(s=a.sentences)!=null&&s.length?i=a.sentences.map((u,p)=>xa(a,p)).join(""):i=`<p lang="${c(a.lang)}">“${c(a.original)}”</p><p class="small muted">${d("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${c((e==null?void 0:e.name)||"Mgeni")}</strong> ${S(a.lang)}</div>
      <div class="small muted">${n} · ${t}</div>
    </div>
    ${(l=a.lowWords)!=null&&l.length?`<div class="notice warn small">${d("Maneno ambayo picha haikusomeka vizuri yalirekebishwa na msaidizi.","Words the photo reader was unsure of were checked by the helper.")}</div>`:""}
    ${i}
    ${a.synthetic?`<div class="small muted" style="margin-top:6px">${d("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}function ge(){const a=o.bookings.filter(l=>Y(l.date)>=0).sort((l,u)=>new Date(l.date)-new Date(u.date)),e=a.filter(l=>Y(l.date)<=7),t=a.filter(l=>Y(l.date)>7),n=A(),i=Xa(e),s=l=>`
    <li>
      <div class="row between">
        <strong>${c(T(l.date))} <span class="en inline">· ${c(Za(l.date))}</span></strong>
        <span class="badge-num" title="guests">${c(l.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${S(l.language)} ${ce(l.language)}
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
    <ul class="list">${e.map(s).join("")}</ul>
  </div>`:`
  <div class="notice">${r("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${r("Ujumbe kwa simu ya Noor","SMS to Noor’s basic phone")}</h2>
    <p class="small muted">${d("Huu ndio ujumbe ambao simu ya kawaida ya Noor ingepokea (mfano; toleo halisi litatuma kwa SMS).","This is the text Noor’s feature phone would receive (simulated; the real version sends it as an SMS).")}</p>
    <div class="sms" id="sms-text">${c(i)}</div>
    <div class="row between" style="margin-top:8px">
      <span class="small muted">${i.length} ${d("herufi","characters")}</span>
      <button class="btn small secondary" data-action="copy" data-copy-from="sms-text">${d("Nakili","Copy")}</button>
    </div>
  </div>

  <div class="card">
    <h2>${r("Lugha za kuandaa","Languages to prepare")}</h2>
    ${n.download.length?`
      <p>${d("Pakua kabla wageni hawajafika","Download before the guests arrive")}:</p>
      <div class="row">${n.download.map(l=>S(l)).join("")}</div>
      <p class="small muted">${d(`Takriban MB ${n.downloadMB}. Tumia Wi-Fi au kifurushi cha data.`,`About ${n.downloadMB} MB. Use Wi-Fi or a data bundle.`)}</p>
      <button class="btn block" data-action="download-suggested" ${o.online?"":"disabled"}>${r("Pakua sasa","Download now")}</button>
    `:`<p>${d("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${n.removable.length?`
      <hr>
      <p>${d("Lugha nadra zinazoweza kufutwa ili kuokoa nafasi","Rare languages that can be deleted to save space")}:</p>
      <div class="row">${n.removable.map(l=>S(l)).join("")}</div>
      <button class="btn block danger" data-action="delete-removable" style="margin-top:8px">${r(`Futa (MB ${n.freeMB})`,`Delete (${n.freeMB} MB)`)}</button>
    `:""}
  </div>

  ${t.length?`
  <div class="card">
    <h2>${r("Baadaye","Later")}</h2>
    <ul class="list">${t.map(s).join("")}</ul>
  </div>`:""}

  <details class="card">
    <summary style="cursor:pointer;font-weight:650;min-height:32px">${d("Kwa mwongozaji: ongeza mgeni","For the guide: add a booking")}</summary>
    <div class="stack" style="margin-top:12px">
      <label class="field">${r("Tarehe","Date")}<input type="date" id="bk-date" value="${fa(sa(new Date,3))}"></label>
      <div class="grid2">
        <label class="field">${r("Idadi ya wageni","Number of guests")}<input type="number" id="bk-guests" min="1" value="2"></label>
        <label class="field">${r("Lugha","Language")}<select id="bk-lang">${za("en")}</select></label>
      </div>
      <label class="field">${r("Jina la mgeni mkuu","Lead guest name")}<input type="text" id="bk-name" autocomplete="off"></label>
      <label class="field">${r("Mwongozaji","Guide")}<input type="text" id="bk-guide" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-consent" data-change="bk-consent-toggle"> <span>${r("Mgeni amekubali Noor awasiliane naye","Guest agreed that Noor may contact them")}</span></label>
      <label class="field hidden" id="bk-email-wrap">${r("Barua pepe","Email")}<input type="email" id="bk-email" autocomplete="off"></label>
      <button class="btn" data-action="add-booking">${r("Hifadhi","Save")}</button>
    </div>
  </details>`}function me(){const a=o.add,e=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${a.step>=t?"on":""}"></span>`).join("")}</div>`;return a.step===1?e+Sa():a.step===2?e+we():e+ke()}function Sa(){const a=o.bookings.filter(t=>{const n=Y(t.date);return n<=1&&n>=-14}).filter(t=>!o.guests.some(n=>n.bookingId===t.id)).sort((t,n)=>new Date(n.date)-new Date(t.date)),e=o.guests.slice().sort((t,n)=>new Date(n.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${r("Mgeni ni nani?","Who is the guest?")}</h1>

  ${a.length?`
  <div class="card">
    <h2>${r("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${c(t.leadName||"Mgeni")}</strong> ${S(t.language)}<div class="small muted">${c(T(t.date))} · ${d("wageni","guests")} ${c(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${d("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  ${e.length?`
  <div class="card">
    <h2>${r("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${c(t.name)}</strong> ${S(t.language)}<div class="small muted">${c(T(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${d("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${r("Mgeni mpya","New guest")}</h2>
    <p class="small muted">${d("Andika kutoka kwenye ukurasa wa kitabu cha wageni.","Copy from the guestbook page.")}</p>
    <div class="stack">
      <label class="field">${r("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${r("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${za("en")}</select></label>
      <label class="field">${r("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${fa(new Date)}"></label>
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
  </div>`}const pa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',he='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',fe='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>';function we(){var s;const a=R();if(!a)return o.add.step=1,Sa();const e=((s=b[a.language])==null?void 0:s.mt)&&!o.installed.includes(a.language),t=o.add.inputs.some(l=>l.status==="ready"&&(l.text||"").trim()),n=o.add.inputs.some(l=>l.status==="working"),i=l=>{var m;const u=`
      <select data-change="box" data-id="${l.id}" aria-label="Box">
        <option value="liked" ${l.box==="liked"?"selected":""}>Walipenda · liked</option>
        <option value="improve" ${l.box==="improve"?"selected":""}>Kuboresha · could be better</option>
        <option value="unknown" ${l.box==="unknown"?"selected":""}>Haijulikani · not sure</option>
      </select>`,p=l.langHint?`
      <div class="notice warn small">${d(`Inaonekana ni ${v(l.langHint,"sw")}, si ${v(a.language,"sw")}.`,`This looks like ${v(l.langHint,"en")}, not ${v(a.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${l.langHint}">${d(`Badilisha lugha ya mgeni kuwa ${v(l.langHint,"sw")}`,`Switch guest language to ${v(l.langHint,"en")}`)}</button></div>
      </div>`:"";let f="";l.imageURL&&(f=`<img class="preview-img" src="${l.imageURL}" alt="Photo of the guestbook box">`),l.audioURL&&(f=`<audio controls src="${l.audioURL}" style="width:100%"></audio>`);let w="";return l.status==="working"?w=`<p class="muted">${d("Inasoma…","Reading…")}</p>`:l.status==="error"?w=`<div class="notice neg small">${d("Imeshindwa","Failed")}: ${c(l.error)}</div>`:w=`
        ${(m=l.lowWords)!=null&&m.length?`<div class="notice warn small"><strong>${d("Angalia maneno haya","Check these words")}</strong>${l.lowWords.slice(0,20).map(g=>`<mark class="low">${c(g)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${l.source==="voice"?r("Alichosema mgeni","What the guest said"):r("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${l.id}" lang="${c(a.language)}">${c(l.text)}</textarea></label>
        ${l.source==="voice"&&a.language!=="en"&&a.language!=="sw"?`
        <label class="field small">${r("Tafsiri ya Kiingereza (kutoka kwa modeli ya sauti)","English translation (from the voice model)")}
          <textarea data-input="input-english" data-id="${l.id}" style="min-height:80px">${c(l.english)}</textarea></label>`:""}`,`
    <div class="card flat">
      <div class="card-title"><h3>${l.source==="photo"?r("Picha","Photo"):l.source==="voice"?r("Sauti","Voice"):r("Kuandika","Typed")}</h3><button class="btn small danger" data-action="remove-input" data-id="${l.id}">${d("Ondoa","Remove")}</button></div>
      <div class="stack">
        ${f}
        <label class="field small">${r("Kisanduku","Which box")}${u}</label>
        ${p}
        ${w}
      </div>
    </div>`};return`
  <div class="card">
    <div class="row between">
      <div><strong>${c(a.name)}</strong> ${S(a.language)}<div class="small muted">${c(T(a.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${d("Badilisha","Change")}</button>
    </div>
    <div class="row" style="margin-top:8px">${va(a)}</div>
  </div>

  ${e?`<div class="notice warn">${d(`Lugha ya ${v(a.language,"sw")} haijapakuliwa. Kusoma picha kunawezekana; kuchanganua kutahitaji mtandao mara moja (MB ${L}).`,`The ${v(a.language,"en")} pack is not downloaded. Reading photos works; analysing will need internet once (${L} MB).`)}</div>`:""}

  <h2 class="section-head">${r("Ongeza maoni","Add feedback")}</h2>
  <div class="grid2">
    <label class="btn big">${pa}<span class="btn-col">${r("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${pa}<span class="btn-col">${r("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${o.recording?"danger":"secondary"}" data-action="record">
      ${o.recording?'<span class="rec-dot"></span>':he}<span class="btn-col">${o.recording?r("Simamisha","Stop recording"):r("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${fe}<span class="btn-col">${r("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${d("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${o.add.inputs.map(i).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!n?"":"disabled"}>${r("Changanua","Analyse")}</button>
  <p class="small muted" style="margin-top:8px">${d("Kila kitu kinabaki kwenye simu hii.","Everything stays on this phone.")}</p>`}function ke(){const a=o.add.results.map(n=>o.entries.find(i=>i.id===n)).filter(Boolean),e=R(),t=a.reduce((n,i)=>n+(i.sentences||[]).filter(V).length,0);return`
  <h1>${r("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${d(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} sentences need a check`)}</strong>${d("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct them or press “OK”.")}</div>`:`<div class="notice">${d("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${a.map(pe).join("")}
  <div class="stack">
    <button class="btn" data-action="more-feedback">${r(`Ongeza maoni mengine ya ${c((e==null?void 0:e.name)||"mgeni")}`,"Add more for this guest")}</button>
    <button class="btn secondary" data-action="finish-add">${r("Maliza na uone muhtasari","Finish and see the summary")}</button>
  </div>`}const aa={week:["Wiki hii","This week"],month:["Mwezi huu","This month"],all:["Zote","All time"]};function $e(){const a=o.entries.filter(p=>p.status==="pending"),{s:e,entries:t,text:n}=ya(),i=Object.entries(aa).map(([p,[f,w]])=>`<button class="chip" data-action="period" data-period="${p}" aria-pressed="${o.period===p}">${f}<span class="en inline"> · ${w}</span></button>`).join(""),s=(p,f)=>p.filter(w=>w.id!=="other").map(w=>{const j=z(w.id),m=e.guests?Math.round(w.guests/e.guests*100):0,g=w.quotes.slice(0,5).map($=>`
      <blockquote class="q">${$.original&&$.lang!=="en"?`<div class="orig" lang="${c($.lang)}">“${c($.original)}”</div><div class="trans">EN: ${c($.en)}</div>`:`<div class="orig">“${c($.en)}”</div>`}
      ${$.flagged?`<span class="chip warn" style="margin-top:4px">${d("Angalia","check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><div><strong>${c(j.sw)}</strong><span class="en">${c(j.en)}</span></div><span class="badge-num ${f?"neg":""}">${w.guests}</span></div>
        <div class="bar ${f?"neg":""}"><span style="width:${m}%"></span></div>
        <details class="quotes"><summary>${d("Maneno ya wageni","What guests said")} (${w.quotes.length})</summary>${g}</details>
      </div>`}).join(""),l=[];for(const p of t)(p.sentences||[]).forEach((f,w)=>{V(f)&&l.push([p,w])});const u=ee(e,`${aa[o.period][0]} / ${aa[o.period][1]}`);return`
  <h1>${r("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${i}</div>

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
    <div class="big-summary" lang="sw">${n.sw.map(p=>`<p>${c(p)}</p>`).join("")}</div>
    <div class="en small" style="margin-top:6px">${n.en.map(p=>`<p>${c(p)}</p>`).join("")}</div>
    <p class="small muted">${d("Sentensi hizi zimeandikwa na watu mapema; AI imejaza tu idadi na majina ya mada. Uamuzi ni wa Noor.","These sentences are human-written templates; the AI only fills in counts and topic names. Noor decides.")}</p>
  </div>

  ${e.liked.filter(p=>p.id!=="other").length?`<div class="card"><h2>${r("Walichopenda","What they liked")}</h2>${s(e.liked,!1)}</div>`:""}
  ${e.improve.filter(p=>p.id!=="other").length?`<div class="card"><h2>${r("Wanachotaka kiboreshwe","What they want improved")}</h2>${s(e.improve,!0)}</div>`:""}

  ${e.products.length?`
  <div class="card">
    <h2>${r("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${e.products.map(p=>{const f=C.find(w=>w.id===p.id);return`<div class="topic-row"><div><strong>${c(f.sw)}</strong><span class="en">${c(f.en)}</span></div><span class="badge-num">${p.guests}</span></div>`}).join("")}
    <p class="small muted">${d("Imepatikana kwa maneno maalum (si makisio).","Found by fixed keywords, not guessed.")}</p>
  </div>`:""}

  ${l.length?`
  <div class="card">
    <h2>${r("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    <p class="small muted">${d("AI haikuwa na uhakika. Angalia pamoja na msaidizi au mwongozaji.","The AI was not sure. Check with the helper or the guide.")}</p>
    ${l.map(([p,f])=>{var w;return`<div class="small muted" style="margin-top:8px">${c(((w=Z(p.guestId))==null?void 0:w.name)||"")} · ${c(v(p.lang,"sw"))}</div>${xa(p,f,{open:!0})}`}).join("")}
  </div>`:""}

  <div class="card">
    <h2>${r("Ripoti kwa mwongozaji / kituo cha utalii","Report for the guide / tourism centre")}</h2>
    <p class="small muted">${d("Hakuna majina, namba wala maneno ya wageni. Inatumwa tu Noor akikubali.","No names, contacts or quotes. Shared only if Noor agrees.")}</p>
    <div class="sms" id="report-text">${c(u)}</div>
    <label class="check" style="margin-top:10px"><input type="checkbox" data-change="share-ok" ${o.shareOk?"checked":""}>
      <span>${r("Nimesoma ripoti hii na nakubali ishirikiwe","I have read this report and agree to share it")}</span></label>
    <button class="btn block" id="share-btn" style="margin-top:10px" data-action="share" ${o.shareOk?"":"disabled"}>${r("Shiriki","Share")}</button>
  </div>`}
  `}function be(){const a=o.guests.slice().sort((e,t)=>new Date(t.visitDate)-new Date(e.visitDate));return a.length?`
  <h1>${r("Wageni","Guests")}</h1>
  <p class="small muted">${d("Ujumbe wa shukrani umeandikwa na watu katika kila lugha. AI inachagua tu jambo alilopenda mgeni. Noor anaidhinisha kabla ya kutuma.","Thank-you messages are human-written in each language. The AI only picks what the guest liked. Noor approves before anything is sent.")}</p>
  <div class="card"><ul class="list">${a.map(e=>{const t=o.entries.filter(s=>s.guestId===e.id).length,n=o.messages.some(s=>s.guestId===e.id&&s.status==="sent"),i=o.openGuest===e.id;return`
      <li>
        <div class="row between">
          <div><strong>${c(e.name)}</strong> ${S(e.language)}${e.synthetic?` <span class="chip plain">${d("mfano","example")}</span>`:""}</div>
          <span class="small muted">${c(T(e.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${va(e)} <span class="muted">${d("maoni","entries")}: ${t}</span>
          ${n?`<span class="chip">${d("Shukrani imetumwa","thanks sent")}</span>`:""}</div>
        ${e.referredBy?`<div class="small muted" style="margin-top:4px">${d("Alipendekezwa na","recommended by")}: ${c(e.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${i?"":"secondary"}" data-action="toggle-draft" data-id="${e.id}">${d("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${e.id}">${d("Futa","Delete")}</button>
        </div>
        ${i?ye(e):""}
      </li>`}).join("")}</ul></div>`:`<h1>${r("Wageni","Guests")}</h1>
      <div class="card"><p>${d("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-tab="add">${r("Ongeza maoni","Add feedback")}</button></div>`}function ye(a){const e=se(o.entries,a.id),t=ae(a,e),n=a.contact||{},i=ua[t.lang]||ua.en;let s;return a.consent?n.email?s=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(n.email)}?subject=${encodeURIComponent(i)}&body=${encodeURIComponent(t.text)}">${r("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:n.phone?s=`<a class="btn block" data-action="mark-sent" data-id="${a.id}" data-lang="${t.lang}" href="sms:${encodeURIComponent(n.phone)}?body=${encodeURIComponent(t.text)}">${r("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:s=`<div class="notice small">${d("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:s=`<div class="notice warn small">${d("Mgeni hakutoa ruhusa ya kuwasiliana — usitume ujumbe.","The guest did not consent to contact — do not send.")}</div>`,`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${d(`Hakuna kiolezo cha ${v(a.language,"sw")} bado — tumetumia Kiingereza.`,`No ${v(a.language,"en")} template yet — using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${d(`Kwa ${v(t.lang,"sw")}`,`In ${v(t.lang,"en")}`)}</div><p id="draft-${a.id}" style="margin:6px 0 0">${c(t.text)}</p></div>
    <div class="card flat" lang="sw"><div class="small muted">${d("Maana yake kwa Kiswahili","What it says, in Swahili")}</div><p style="margin:6px 0 0">${c(t.sw)}</p></div>
    <p class="small muted">${e?d(`Mada aliyopenda: ${z(e).sw}`,`Liked topic: ${z(e).en}`):d("Hakuna mada iliyo wazi — ujumbe wa jumla.","No clear liked topic — general message.")}</p>
    ${s}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${a.id}">${d("Nakili","Copy")}</button>
  </div>`}function ve(){const a=A(),e=n=>{const i=b[n],s=o.installed.includes(n),l=[];return a.keep.includes(n)&&l.push(`<span class="chip">${d("Inakaa daima","kept")}</span>`),a.needed.includes(n)&&l.push(`<span class="chip warn">${d("Wiki ijayo","needed next week")}</span>`),s&&a.removable.includes(n)&&l.push(`<span class="chip plain">${d("Nadra","rare")}</span>`),`
      <div class="pack">
        <div><strong>${c(i.sw)}</strong> <span class="muted small">${c(i.native)}</span><span class="en">${c(i.en)} · ${s?"downloaded":"not downloaded"} · ~${L} MB</span>
          <div class="row" style="margin-top:4px">${s?`<span class="chip">${d("Imepakuliwa","on phone")}</span>`:""}${l.join("")}</div></div>
        ${s?`<button class="btn small danger" data-action="delete-pack" data-lang="${n}">${d("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${n}" ${o.online?"":"disabled"}>${d("Pakua","Get")}</button>`}
      </div>`},t=n=>{const i=D[n],s=o.shared[n];return`
      <div class="pack">
        <div><strong>${c(i.sw)}</strong><span class="en">${c(i.en)} · ${c(i.id)} · ~${i.mb} MB</span></div>
        ${s?`<span class="chip">${d("Tayari","ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${n}" ${o.online?"":"disabled"}>${d("Pakua","Get")}</button>`}
      </div>`};return`
  <h1>${r("Lugha","Languages")}</h1>
  <div class="notice">
    <strong>${d(`Lugha ${ra+2} muhimu`,`${ra+2} essential languages`)}</strong>
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
      <div class="notice small" style="margin-top:4px">${d(`Inapendekezwa kupakua ukiwa na Wi-Fi: ${a.recommend.map(n=>b[n].sw).join(", ")} (MB ${a.recommendMB}).`,`Recommended when on Wi-Fi: ${a.recommend.map(n=>b[n].en).join(", ")} (${a.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${o.online?"":"disabled"}>${d("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${_a().map(e).join("")}
    <p class="small muted" style="margin-top:12px">${d(`Kila pakiti ni takriban MB ${L} (modeli ya tafsiri iliyobanwa + data ya kusoma maandishi). Toleo la Android litatumia ML Kit (karibu MB 30 kwa lugha).`,`Each pack is about ${L} MB (quantized translation model + text-reading data). An Android version would use ML Kit (about 30 MB per language).`)}</p>
  </div>`}function ze(){const a=o.guests.some(e=>e.synthetic);return`
  <h1>${r("Zaidi","More")}</h1>

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
  </div>`}const je={week:ge,add:me,summary:$e,guests:be,langs:ve,more:ze};function h(){ba.innerHTML=je[o.tab](),document.querySelectorAll(".tabbar button").forEach(a=>a.setAttribute("aria-current",a.dataset.tab===o.tab?"page":"false")),document.getElementById("net").innerHTML=o.online?d("Mtandaoni","online"):d("Nje ya mtandao","offline"),o.tab==="langs"&&Ra().then(a=>{const e=document.getElementById("storage-line");e&&a&&(e.innerHTML=d(`Nafasi iliyotumika: MB ${a.usedMB} kati ya MB ${a.quotaMB}`,`Storage used: ${a.usedMB} MB of ${a.quotaMB} MB`))})}async function _(a){if(!a.length)return!0;const e=a.reduce((n,[i,s])=>n+(i==="pack"?L:D[s].mb),0);if(!navigator.onLine)return y("Hakuna mtandao. Pakua lugha wikendi msaidizi akiwa na mtandao. · Offline: download packs when connected.",6e3),!1;const t=a.map(([n,i])=>n==="pack"?b[i].en:D[i].en).join(", ");if(!confirm(`Pakua mara moja: takriban MB ${e} (${t}). Endelea?

One-time download of about ${e} MB (${t}). Continue?`))return!1;for(const[n,i]of a)P(n==="pack"?`Inapakua ${b[i].sw} · ${b[i].en} pack`:`Inapakua · ${D[i].en}`),n==="pack"?await Oa(i,E):await Ca(i,E);return N(),await U(),!0}async function ea(a){const e=a.filter(t=>{var n;return((n=b[t])==null?void 0:n.mt)&&!o.installed.includes(t)}).map(t=>["pack",t]);await _(e)&&(y("Lugha ziko tayari · Packs ready"),h())}async function ga(a){if(!a.length)return;const e=a.map(t=>b[t].sw).join(", ");if(confirm(`Futa ${e}? Zinaweza kupakuliwa tena baadaye.

Delete ${a.map(t=>b[t].en).join(", ")}? They can be downloaded again later.`)){for(const t of a)await Wa(b[t].mt);await U(),y("Imefutwa · Deleted"),h()}}async function xe(){if(!navigator.onLine)return y("Hakuna mtandao · Offline");P("Inapokea ratiba · Receiving schedule");const e=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,n=e.bookings.map(s=>({id:s.id,date:J(sa(t,s.dayOffset)),guests:s.guests,leadName:s.leadName,language:s.language,guide:s.guide,company:e.company,consent:!!s.consent,email:s.consent&&s.email||"",synthetic:!0}));await k.putMany("bookings",n),o.bookings=await k.all("bookings"),o.lastSync=new Date().toISOString(),await k.setSetting("lastSync",o.lastSync),N();const i=A();y(i.download.length?`Ratiba imepokelewa. Pakua: ${i.download.map(s=>b[s].sw).join(", ")} · Schedule received.`:"Ratiba imepokelewa · Schedule received"),h()}async function Se(){const a=i=>{var s,l;return((l=(s=document.getElementById(i))==null?void 0:s.value)==null?void 0:l.trim())||""},e=a("bk-date");if(!e)return y("Weka tarehe · Add a date");const t=document.getElementById("bk-consent").checked,n={id:I("bk"),date:J(e),guests:Math.max(1,Number(a("bk-guests"))||1),leadName:a("bk-name")||"Mgeni",language:a("bk-lang")||"en",guide:a("bk-guide"),company:"",consent:t,email:t?a("bk-email"):""};await k.put("bookings",n),o.bookings.push(n),y("Imehifadhiwa · Saved"),h()}async function Ie(a){const e=o.bookings.find(n=>n.id===a);if(!e)return;let t=o.guests.find(n=>n.bookingId===e.id);t||(t={id:I("g"),name:e.leadName||"Mgeni",language:e.language,visitDate:e.date,consent:!!e.consent,contact:e.consent?{email:e.email||"",phone:""}:null,bookingId:e.id,groupSize:e.guests,createdAt:new Date().toISOString(),synthetic:!!e.synthetic},await k.put("guests",t),o.guests.push(t)),o.add=M(),o.add.guestId=t.id,o.add.step=2,h()}async function Ne(){const a=n=>{var i,s;return((s=(i=document.getElementById(n))==null?void 0:i.value)==null?void 0:s.trim())||""},e=document.getElementById("ng-consent").checked,t={id:I("g"),name:a("ng-name")||"Mgeni",language:a("ng-lang")||"en",visitDate:J(a("ng-date")||new Date),consent:e,contact:e?{email:a("ng-email"),phone:a("ng-phone")}:null,referredBy:a("ng-ref"),createdAt:new Date().toISOString()};await k.put("guests",t),o.guests.push(t),o.add=M(),o.add.guestId=t.id,o.add.step=2,h()}async function Me(a,e){const t=R(),n={id:I("in"),source:"photo",box:e,text:"",status:"working",imageURL:URL.createObjectURL(a),lowWords:[]};o.add.inputs.push(n),h();try{P("Inasoma picha · Reading the photo");const i=await Ta(a,t.language,E);Object.assign(n,{text:i.text,lowWords:i.lowWords,confidence:i.confidence,status:"ready"}),i.text||(n.status="error",n.error="Hakuna maandishi yaliyopatikana · No text found. Try a closer, brighter photo.");const s=await Pa(i.text);s&&s!==t.language&&(n.langHint=s)}catch(i){n.status="error",n.error=i.message}finally{N(),h()}}async function Ia(a){const e=R();if(!o.shared.voice&&!await _([["shared","voice"]]))return;const t={id:I("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(a)};o.add.inputs.push(t),h();try{P("Inasikiliza · Listening");const n=await Ea(a,e.language,E);Object.assign(t,{text:n.original,english:n.english,status:"ready"}),o.shared.voice=!0}catch(n){t.status="error",t.error=n.message}finally{N(),h()}}let q=null;async function De(){var n;if(q){q.stop();return}if(!((n=navigator.mediaDevices)!=null&&n.getUserMedia)||!window.MediaRecorder){y("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti. · Recording not supported; upload an audio file.",5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),e=[],t=new MediaRecorder(a);t.ondataavailable=i=>{i.data.size&&e.push(i.data)},t.onstop=()=>{a.getTracks().forEach(s=>s.stop()),q=null,o.recording=!1;const i=new Blob(e,{type:t.mimeType||"audio/webm"});h(),Ia(i).catch(s=>y(s.message))},t.start(),q=t,o.recording=!0,h()}async function Be(){var i;const a=R(),e=o.add.inputs.filter(s=>s.status==="ready"&&(s.text||"").trim());if(!e.length)return;const t=[];if(a.language!=="sw"){o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]);const s=e.some(l=>!(l.source==="voice"&&l.english));(i=b[a.language])!=null&&i.mt&&s&&!o.installed.includes(a.language)&&t.push(["pack",a.language])}if(!await _(t))return;const n=[];for(const[s,l]of e.entries()){P(`Inachanganua ${s+1}/${e.length} · Analysing`);const u=l.source==="voice"&&a.language!=="en"&&a.language!=="sw"?l.english:void 0,p=await $a({original:l.text.trim(),lang:a.language,box:l.box,english:u},E),f={id:I("fb"),guestId:a.id,lang:a.language,source:l.source,box:l.box,original:l.text.trim(),...p,lowWords:l.lowWords||[],ocrConfidence:l.confidence??null,visitDate:a.visitDate,createdAt:new Date().toISOString()};await k.put("entries",f),o.entries.push(f),n.push(f.id)}N();for(const s of o.add.inputs)s.imageURL&&URL.revokeObjectURL(s.imageURL),s.audioURL&&URL.revokeObjectURL(s.audioURL);o.add.inputs=[],o.add.results=n,o.add.step=3,await U(),h()}async function Le(){var n;const a=o.entries.filter(i=>i.status==="pending"),e=[...new Set(a.map(i=>i.lang))],t=[];e.some(i=>i!=="sw")&&(o.shared.topics||t.push(["shared","topics"]),o.shared.mood||t.push(["shared","mood"]));for(const i of e)(n=b[i])!=null&&n.mt&&!o.installed.includes(i)&&t.push(["pack",i]);if(await _(t)){for(const[i,s]of a.entries()){P(`Inachanganua ${i+1}/${a.length} · Analysing`);const l=await $a({original:s.original,lang:s.lang,box:s.box},E);Object.assign(s,l),await k.put("entries",s)}N(),await U(),y("Imekamilika · Done"),h()}}async function H(a){await k.put("entries",a),h()}function na(a){const e=o.entries.find(t=>t.id===a.dataset.entry);return e?[e,e.sentences[Number(a.dataset.idx)]]:[null,null]}async function Ae(){const e=await(await fetch("data/demo.json")).json(),t=new Date;for(const n of e.guests){const i={id:n.id,name:n.name,language:n.language,visitDate:J(sa(t,n.dayOffset)),consent:n.consent,contact:n.consent?{email:n.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await k.put("guests",i);for(const s of["liked","improve"])n[s]&&await k.put("entries",{id:`${n.id}_${s}`,guestId:n.id,lang:n.language,source:"typed",box:s,original:n[s],status:"pending",sentences:[],products:[],visitDate:i.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await K(),o.period="all",o.tab="summary",y("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”. · Example data loaded.",5e3),h()}async function Ee(){for(const a of o.guests.filter(e=>e.synthetic))await k.del("guests",a.id);for(const a of o.entries.filter(e=>e.synthetic||e.id.startsWith("demo_")))await k.del("entries",a.id);for(const a of o.bookings.filter(e=>e.synthetic))await k.del("bookings",a.id);await K(),y("Imeondolewa · Removed"),h()}async function Te(a){const e=Z(a);if(!(!e||!confirm(`Futa ${e.name} na maoni yake yote?

Delete ${e.name} and all their feedback?`))){await k.del("guests",a);for(const t of o.entries.filter(n=>n.guestId===a))await k.del("entries",t.id);for(const t of o.messages.filter(n=>n.guestId===a))await k.del("messages",t.id);await K(),h()}}async function Pe(){var e;if(!o.shareOk)return;const a=((e=document.getElementById("report-text"))==null?void 0:e.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:a})}catch{}else await ha(a)}const Re={go:a=>{o.tab=a.dataset.tab,h(),window.scrollTo(0,0)},"toggle-en":async()=>{const a=!document.body.classList.contains("hide-en");document.body.classList.toggle("hide-en",a),await k.setSetting("showEn",!a)},sync:xe,"add-booking":Se,"download-pack":a=>ea([a.dataset.lang]),"download-suggested":()=>ea(A().download),"download-recommended":()=>ea(A().recommend),"delete-pack":a=>ga([a.dataset.lang]),"delete-removable":()=>ga(A().removable),"download-shared":async a=>{await _([["shared",a.dataset.key]])&&h()},"pick-booking":a=>Ie(a.dataset.id),"pick-guest":a=>{o.add=M(),o.add.guestId=a.dataset.id,o.add.step=2,h()},"save-new-guest":Ne,"change-guest":()=>{o.add.step=1,h()},"add-typed":()=>{o.add.inputs.push({id:I("in"),source:"typed",box:"liked",text:"",status:"ready"}),h()},record:De,"remove-input":a=>{o.add.inputs=o.add.inputs.filter(e=>e.id!==a.dataset.id),h()},"use-hint":async a=>{const e=R();e.language=a.dataset.lang,await k.put("guests",e),o.add.inputs.forEach(t=>{t.langHint=null}),y(`Lugha: ${b[e.language].sw} · ${b[e.language].en}`),h()},"run-analysis":Be,"finish-add":()=>{o.add=M(),o.tab="summary",h(),window.scrollTo(0,0)},"more-feedback":()=>{const a=o.add.guestId;o.add=M(),o.add.guestId=a,o.add.step=2,h()},"fix-mood":async a=>{const[e,t]=na(a);t&&(t.sentiment=a.dataset.mood,t.flags=(t.flags||[]).filter(n=>n==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await H(e))},"confirm-sent":async a=>{const[e,t]=na(a);t&&(t.confirmed=!0,t.flags=[],await H(e))},"sw-mood":async a=>{var n;const e=o.entries.find(i=>i.id===a.dataset.entry);if(!e)return;const t=((n=e.sentences)==null?void 0:n[0])||{en:"",original:e.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=a.dataset.mood,e.sentences=[t],await H(e)},period:a=>{o.period=a.dataset.period,h()},speak:async()=>{const{s:a,text:e}=ya();await le(ie(a))||Aa(e.sw.join(" "))},"analyze-pending":Le,share:Pe,"toggle-draft":a=>{o.openGuest=o.openGuest===a.dataset.id?null:a.dataset.id,h()},"mark-sent":async a=>{const e={id:I("msg"),guestId:a.dataset.id,lang:a.dataset.lang,status:"sent",at:new Date().toISOString()};await k.put("messages",e),o.messages.push(e),setTimeout(h,400)},copy:a=>{var e;return ha(((e=document.getElementById(a.dataset.copyFrom))==null?void 0:e.textContent)||"")},"delete-guest":a=>Te(a.dataset.id),"load-demo":Ae,"remove-demo":Ee,wipe:async()=>{confirm(`Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.

Delete ALL data on this phone? This cannot be undone.`)&&(await k.wipeAll(),await K(),o.add=M(),y("Data yote imefutwa · All data deleted"),h())}},Oe={"consent-toggle":a=>{var e;return(e=document.getElementById("contact-fields"))==null?void 0:e.classList.toggle("hidden",!a.checked)},"bk-consent-toggle":a=>{var e;return(e=document.getElementById("bk-email-wrap"))==null?void 0:e.classList.toggle("hidden",!a.checked)},box:a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.box=a.value)},"fix-topic":async a=>{const[e,t]=na(a);t&&(t.topic=a.value,t.flags=(t.flags||[]).filter(n=>n!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await H(e))},"sw-topic":async a=>{var n;const e=o.entries.find(i=>i.id===a.dataset.entry);if(!e||!a.value)return;const t=((n=e.sentences)==null?void 0:n[0])||{en:"",original:e.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=a.value,e.sentences=[t],await H(e)},"share-ok":a=>{o.shareOk=a.checked;const e=document.getElementById("share-btn");e&&(e.disabled=!a.checked)}},Ce={"input-text":a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.text=a.value),We()},"input-english":a=>{const e=o.add.inputs.find(t=>t.id===a.dataset.id);e&&(e.english=a.value)}};function We(){const a=document.querySelector('[data-action="run-analysis"]');if(!a)return;const e=o.add.inputs.some(n=>n.status==="ready"&&(n.text||"").trim()),t=o.add.inputs.some(n=>n.status==="working");a.disabled=!(e&&!t)}document.addEventListener("click",a=>{const e=a.target.closest("[data-action]");if(!e)return;const t=Re[e.dataset.action];t&&(e.tagName==="BUTTON"&&a.preventDefault(),Promise.resolve(t(e,a)).catch(n=>{console.error(n),N(),y(`Hitilafu · Error: ${n.message}`,6e3)}))});document.addEventListener("change",a=>{var n;const e=a.target;if(e.matches("input[type=file][data-file]")){const i=(n=e.files)==null?void 0:n[0];if(e.value="",!i)return;const s=e.dataset.file;(s==="audio"?Ia(i):Me(i,s==="photo-liked"?"liked":"improve")).catch(u=>{N(),y(u.message,6e3)});return}const t=Oe[e.dataset.change];t&&Promise.resolve(t(e)).catch(i=>y(i.message,6e3))});document.addEventListener("input",a=>{var t;const e=Ce[(t=a.target.dataset)==null?void 0:t.input];e&&e(a.target)});window.addEventListener("online",()=>{o.online=!0,h()});window.addEventListener("offline",()=>{o.online=!1,h()});async function He(){if(!("caches"in window))return;const a=await caches.open("kitabu-shell-v2"),e=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const n of performance.getEntriesByType("resource"))t.add(n.name);await Promise.all([...t].map(async n=>{try{const i=new URL(n);if(i.pathname.endsWith("/data/bookings.json"))return;const s=i.origin===location.origin?a:i.hostname==="cdn.jsdelivr.net"?e:null;s&&!await s.match(n)&&await s.add(n)}catch{}}))}async function Ke(){await K(),h(),await U(),h(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(He).catch(a=>console.warn("Offline cache not available",a)),"speechSynthesis"in window&&speechSynthesis.getVoices(),ia().then(a=>{a&&navigator.onLine&&de()})}Ke().catch(a=>{console.error(a),ba.innerHTML=`<div class="notice neg"><strong>Hitilafu · Error</strong>${c(a.message)}</div>`});
