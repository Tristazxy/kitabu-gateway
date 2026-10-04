import{l as S,t as O,P as W,L as x,e as xa,f as Ma,g as at,i as da,c as tt,a as nt,j as st,k as n,m as y,h as d,n as R,o as We,b as I,d as v,q as Ue,r as Ve,u as ja,v as ce,w as b,x as C,s as N,p as q,y as za,z as it,A as ot,B as lt,C as Ee,S as G,D as rt,E as dt,F as ct,G as ut,H as mt,I as pt,J as gt,K as ca,N as ht,O as ae,Q as ft}from"./ui-UVJ2Ixzs.js";const kt="kitabu",yt=1,La=["guests","entries","bookings","messages","settings"];let Se=null;function wt(){return Se||(Se=new Promise((e,a)=>{const t=indexedDB.open(kt,yt);t.onupgradeneeded=()=>{const s=t.result;for(const l of La)s.objectStoreNames.contains(l)||s.createObjectStore(l,{keyPath:l==="settings"?"key":"id"})},t.onsuccess=()=>e(t.result),t.onerror=()=>a(t.error)}),Se)}function X(e,a,t){return wt().then(s=>new Promise((l,o)=>{const r=s.transaction(e,a),c=r.objectStore(e);let m;Promise.resolve(t(c)).then(g=>{m=g}),r.oncomplete=()=>l(m),r.onerror=()=>o(r.error),r.onabort=()=>o(r.error)}))}function ua(e){return new Promise((a,t)=>{e.onsuccess=()=>a(e.result),e.onerror=()=>t(e.error)})}const f={async all(e){return X(e,"readonly",a=>ua(a.getAll()))},async get(e,a){return X(e,"readonly",t=>ua(t.get(a)))},async put(e,a){return await X(e,"readwrite",t=>{t.put(a)}),a},async putMany(e,a){await X(e,"readwrite",t=>{for(const s of a)t.put(s)})},async del(e,a){await X(e,"readwrite",t=>{t.delete(a)})},async clear(e){await X(e,"readwrite",a=>{a.clear()})},async getSetting(e,a=null){const t=await this.get("settings",e);return t?t.value:a},async setSetting(e,a){return this.put("settings",{key:e,value:a})},async wipeAll(){for(const e of La)await this.clear(e)}};function j(e="id"){return`${e}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,7)}`}const $t=["Jumapili","Jumatatu","Jumanne","Jumatano","Alhamisi","Ijumaa","Jumamosi"],vt=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];function Pe(e){const a=new Date(e);return`${$t[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function E(e){const a=new Date(e);return`${vt[a.getDay()]} ${a.getDate()}/${a.getMonth()+1}`}function ea(e){return e.guests&&e.products.find(a=>a.guests>=3&&a.guests/e.guests>=.4)||null}function Re(e){return`WeKaribu: Wageni wapya. ${Pe(e.date)}: wageni ${e.guests} (${S(e.language,"sw")})${e.guide?`, mwongozaji ${e.guide}`:""}.
Jibu NDIYO kukubali au HAPANA kukataa.
${qe(["BOOK",Ae(e.date),e.guests,e.language,e.leadName||"",e.hostId||"noor"])}`}const Ae=e=>String(e||"").slice(0,10),qe=e=>"WK|"+e.map(a=>String(a??"").replace(/[|\n]/g,"/")).join("|");function bt(e){const a=String(e||"").match(/WK\|[^\n]+/g);if(!a)return null;const t=a[a.length-1].trim().split("|").map(o=>o.trim()),s=t[1],l=o=>/^\d{4}-\d{2}-\d{2}$/.test(o);if(s==="BOOK"||s==="REQ"){const[,,o,r,c,m,g,p]=t;return l(o)?{kind:s,date:o,guests:Math.max(1,Number(r)||1),language:c||"en",leadName:m||"Guest",hostId:g||"noor",referredBy:p||""}:null}if(s==="DAYS"){const[,,o,r]=t;return{kind:s,hostId:o||"noor",days:(r||"").split(",").map(c=>c.trim()).filter(l)}}if(s==="REPORT"){const[,,o,r,c,m]=t;return{kind:s,hostId:o||"noor",period:r||"",guests:Number(c)||0,entries:Number(m)||0,report:String(e).split(/\n?WK\|/)[0].trim()}}return null}function St(e,a){return`WeKaribu booking request: ${`${e.leadName}, ${e.guests} ${e.guests===1?"guest":"guests"}`}, ${E(e.date)}, at ${a.name}${a.town?` (${a.town})`:""}. Language: ${S(e.language,"en")}.${e.referredBy?` Recommended by ${e.referredBy}.`:""}
${qe(["REQ",Ae(e.date),e.guests,e.language,e.leadName,a.id,e.referredBy||""])}`}function xt(e,a,t){return`WeKaribu: ${e} anaweza kupokea wageni / can take guests: ${t.map(s=>E(Ae(s)+"T12:00:00")).join(", ")}.
${qe(["DAYS",a,t.map(Ae).join(",")])}`}function Mt(e,a,t,s){return`${e}
${qe(["REPORT",a,t,s.guests,s.entries])}`}const ma={en:e=>`${e.company}: your visit to ${e.hostName} is confirmed for ${E(e.date)} (${e.guests} guests). Meet at: ${e.meet}. Guide: ${e.guide}. Reply to this number with questions.`,it:e=>`${e.company}: la vostra visita a ${e.hostName} è confermata per ${E(e.date)} (${e.guests} persone). Punto d’incontro: ${e.meet}. Guida: ${e.guide}.`,fr:e=>`${e.company} : votre visite chez ${e.hostName} est confirmée pour ${E(e.date)} (${e.guests} pers.). Rendez-vous : ${e.meet}. Guide : ${e.guide}.`,de:e=>`${e.company}: Ihr Besuch bei ${e.hostName} ist bestätigt für ${E(e.date)} (${e.guests} Pers.). Treffpunkt: ${e.meet}. Guide: ${e.guide}.`,es:e=>`${e.company}: su visita a ${e.hostName} está confirmada para ${E(e.date)} (${e.guests} pers.). Punto de encuentro: ${e.meet}. Guía: ${e.guide}.`,pl:e=>`${e.company}: wizyta u ${e.hostName} potwierdzona na ${E(e.date)} (${e.guests} os.). Miejsce spotkania: ${e.meet}. Przewodnik: ${e.guide}.`,zh:e=>`${e.company}：您在 ${e.hostName} 的参观已确认，时间 ${E(e.date)}（${e.guests} 人）。集合地点：${e.meet}。向导：${e.guide}。`,sw:e=>`${e.company}: ziara yenu kwa ${e.hostName} imethibitishwa ${Pe(e.date)} (wageni ${e.guests}). Kutana: ${e.meet}. Mwongozaji: ${e.guide}.`};function jt(e){return(ma[e.language]||ma.en)({company:e.company||"Tour company",hostName:e.hostName||"the host",date:e.date,guests:e.guests,meet:e.meet||"the village office",guide:e.guide||"-",language:e.language})}const le=e=>`${e} ${e===1?"guest":"guests"}`,pa=e=>`${e} ${e===1?"entry":"entries"}`;function zt(e,a="Noor"){const t=[],s=[];if(t.push(`Kipindi hiki: wageni ${e.guests}, maoni ${e.entries}.`),s.push(`This period: ${le(e.guests)}, ${pa(e.entries)}.`),e.guests===0)return t.push("Bado hakuna maoni. Ongeza maoni ya wageni kwanza."),s.push("No feedback yet. Add guest feedback first."),{sw:t,en:s};e.guests<5&&(t.push(`Tahadhari: maoni bado ni machache (wageni ${e.guests}). Ni mapema kufanya uamuzi mkubwa.`),s.push(`Caution: still little feedback (${le(e.guests)}). Too early for big decisions.`));const o=e.liked.filter(m=>m.id!=="other").slice(0,3);o.length&&(t.push("Walichopenda zaidi: "+o.map(m=>`${O(m.id).sw.split(" (")[0].toLowerCase()} (wageni ${m.guests})`).join("; ")+"."),s.push("What they liked most: "+o.map(m=>`${O(m.id).en.toLowerCase()} (${le(m.guests)})`).join("; ")+"."));const r=e.improve.filter(m=>m.id!=="other").slice(0,3);r.length?(t.push("Wanachotaka kiboreshwe: "+r.map(m=>`${O(m.id).sw.split(" (")[0].toLowerCase()} (wageni ${m.guests})`).join("; ")+"."),s.push("What they want improved: "+r.map(m=>`${O(m.id).en.toLowerCase()} (${le(m.guests)})`).join("; ")+".")):(t.push("Hakuna malalamiko yaliyotajwa."),s.push("No complaints were mentioned.")),e.products.length&&(t.push("Bidhaa ambazo wageni walitaka kununua: "+e.products.map(m=>`${W.find(g=>g.id===m.id).sw} (wageni ${m.guests})`).join("; ")+"."),s.push("Products guests wanted to buy: "+e.products.map(m=>`${W.find(g=>g.id===m.id).en} (${le(m.guests)})`).join("; ")+"."));const c=ea(e);if(c){const m=W.find(g=>g.id===c.id);t.push(`Wazo: wageni ${c.guests} kati ya ${e.guests} walitaka ${m.sw}. Unaweza kufikiria kuuza ${m.sw}. Uamuzi ni wako.`),s.push(`Idea: ${c.guests} of ${e.guests} guests wanted ${m.en}. You could consider selling ${m.en}. The decision is yours.`)}return e.unsure>0&&(t.push(`Sentensi ${e.unsure} hazikueleweka vizuri. Tafadhali ziangalie pamoja na msaidizi wako au mwongozaji.`),s.push(`${e.unsure} ${e.unsure===1?"sentence was":"sentences were"} not understood well. Please check ${e.unsure===1?"it":"them"} with your helper or the guide.`)),e.swahiliEntries>0&&(t.push(`Maoni ${e.swahiliEntries} yameandikwa kwa Kiswahili — yasome mwenyewe.`),s.push(`${pa(e.swahiliEntries)} in Swahili — ${a} reads ${e.swahiliEntries===1?"it":"them"} directly.`)),{sw:t,en:s}}const Fe={sw:{liked:(e,a,t)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunafurahi kwamba ulipenda ${a}. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${t}`,plain:(e,a)=>`Mpendwa ${e}, asante kwa kutembelea shamba letu la kahawa! Tunatumaini ulifurahia ziara yako. Karibu tena wakati wowote, na tafadhali waambie marafiki zako kuhusu sisi. — ${a}`},en:{liked:(e,a,t)=>`Dear ${e}, thank you for visiting our coffee farm! We are glad you enjoyed ${a}. You are always welcome back, and please tell your friends about us. — ${t}`,plain:(e,a)=>`Dear ${e}, thank you for visiting our coffee farm! We hope you enjoyed your visit. You are always welcome back, and please tell your friends about us. — ${a}`},it:{liked:(e,a,t)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Ci fa piacere sapere che hai apprezzato: ${a}. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${t}`,plain:(e,a)=>`Ciao ${e}, grazie per aver visitato la nostra fattoria del caffè! Speriamo che la visita ti sia piaciuta. Torna a trovarci quando vuoi e, se ti fa piacere, parla di noi ai tuoi amici. — ${a}`},fr:{liked:(e,a,t)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous sommes heureux que vous ayez apprécié : ${a}. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${t}`,plain:(e,a)=>`Bonjour ${e}, merci d’avoir visité notre ferme de café ! Nous espérons que la visite vous a plu. Notre porte vous est toujours ouverte — n’hésitez pas à parler de nous à vos amis. — ${a}`},de:{liked:(e,a,t)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Es freut uns, dass Ihnen Folgendes gefallen hat: ${a}. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${t}`,plain:(e,a)=>`Hallo ${e}, vielen Dank für Ihren Besuch auf unserer Kaffeefarm! Wir hoffen, der Besuch hat Ihnen gefallen. Sie sind jederzeit wieder willkommen – erzählen Sie gern Ihren Freunden von uns. — ${a}`},zh:{liked:(e,a,t)=>`${e}您好！感谢您来参观我们的咖啡农场。很高兴您喜欢：${a}。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${t}`,plain:(e,a)=>`${e}您好！感谢您来参观我们的咖啡农场。希望您这次参观愉快。欢迎您随时再来，也欢迎把我们介绍给您的朋友。—— ${a}`},es:{liked:(e,a,t)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Nos alegra saber que disfrutaste: ${a}. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${t}`,plain:(e,a)=>`Hola ${e}, ¡gracias por visitar nuestra finca de café! Esperamos que hayas disfrutado la visita. Vuelve cuando quieras y, si te apetece, háblales de nosotros a tus amigos. — ${a}`},pl:{liked:(e,a,t)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Cieszymy się, że spodobało się Państwu: ${a}. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${t}`,plain:(e,a)=>`Dzień dobry ${e}, dziękujemy za odwiedzenie naszej farmy kawy! Mamy nadzieję, że wizyta się podobała. Zapraszamy ponownie – i prosimy polecić nas znajomym. — ${a}`}};function ga(e,a,t="Noor"){const s=Fe[e.language]?e.language:"en",l=s!==e.language,o=(e.name||"").trim()||(s==="zh"?"":"friend"),r=a?xa.find(m=>m.id===a):null,c=m=>r?Fe[m].liked(o,r.msg[m]||r.msg.en,t):Fe[m].plain(o,t);return{lang:s,text:c(s),sw:c("sw"),usedFallback:l}}const ha={sw:"Asante kutoka shamba la kahawa",en:"Thank you from the coffee farm",it:"Grazie dalla fattoria del caffè",fr:"Merci de la part de la ferme de café",de:"Ein Dankeschön von der Kaffeefarm",zh:"来自咖啡农场的感谢",es:"Gracias desde la finca de café",pl:"Podziękowanie z farmy kawy"};function aa(e,a,t="Noor"){const s=[];s.push(`Ripoti ya maoni — ${a}`),s.push(`Feedback report — ${a}`),s.push(""),s.push(`Wageni / Guests: ${e.guests}`);const l=Object.entries(e.languages).map(([r,c])=>`${x[r]?x[r].en:r} ${c}`).join(", ");l&&s.push(`Lugha / Languages: ${l}`),s.push(""),s.push("Walichopenda / Liked:");for(const r of e.liked.filter(c=>c.id!=="other").slice(0,5))s.push(`  • ${O(r.id).en}: ${r.guests}`);s.push("Kuboresha / To improve:");const o=e.improve.filter(r=>r.id!=="other").slice(0,5);o.length||s.push("  • —");for(const r of o)s.push(`  • ${O(r.id).en}: ${r.guests}`);if(e.products.length){s.push("Bidhaa / Product interest:");for(const r of e.products)s.push(`  • ${W.find(c=>c.id===r.id).en}: ${r.guests}`)}return s.push(""),s.push("Hakuna majina wala namba za wageni. / No guest names or contact details included."),s.push(`Imeidhinishwa na ${t} kabla ya kutumwa. / Approved by ${t} before sharing.`),s.join(`
`)}function ye(e){return!e.confirmed&&(e.topic==="other"||e.sentiment==="unsure"||(e.flags||[]).length>0)}function Lt(e,a,t=new Date){if(a==="all")return!0;const s=new Date(e),l=a==="week"?7:a==="month"?31:3650;return t-s<=l*24*3600*1e3&&s-t<=24*3600*1e3}function It(e,a){const t=Object.fromEntries(a.map(k=>[k.id,k])),s=new Set,l={},o={},r={},c={};let m=0,g=0;const p=(k,u,w,z)=>{k[u]||(k[u]={id:u,guestIds:new Set,quotes:[]}),k[u].guestIds.add(w),z&&k[u].quotes.push(z)};for(const k of e){s.add(k.guestId),k.lang==="sw"&&g++;for(const u of k.sentences||[]){const w=ye(u);w&&m++;const z={entryId:k.id,en:u.en,original:u.original||null,lang:k.lang,flagged:w};u.sentiment==="pos"?p(o,u.topic,k.guestId,z):u.sentiment==="neg"&&p(r,u.topic,k.guestId,z)}for(const u of new Set([...k.products||[],...k.declaredProducts||[]]))p(c,u,k.guestId,null)}for(const k of s){const u=t[k],w=u?u.language:"unknown";l[w]=(l[w]||0)+1}const $=k=>Object.values(k).map(u=>({id:u.id,guests:u.guestIds.size,quotes:u.quotes})).sort((u,w)=>w.guests-u.guests);return{guests:s.size,entries:e.length,liked:$(o),improve:$(r),products:$(c),unsure:m,swahiliEntries:g,languages:l}}function Tt(e,a){const t={};for(const l of e.filter(o=>o.guestId===a))for(const o of l.sentences||[])o.sentiment==="pos"&&o.topic!=="other"&&(t[o.topic]=(t[o.topic]||0)+1);const s=Object.entries(t).sort((l,o)=>o[1]-l[1])[0];return s?s[0]:null}async function Ia(e,a){const{original:t,lang:s,box:l}=e;if(s==="sw")return{english:"",sentences:[],products:[],status:"swahili"};let o;e.english?o=[{original:null,en:e.english}]:o=(await Ma(t,s,a)).pairs;const r=[];for(const k of o)for(const u of at(k.en))r.push({en:u,original:k.original});const c=o.map(k=>k.en).join(" ").trim();if(!r.length)return{english:c,sentences:[],products:da(c),status:"analyzed"};const m=r.map(k=>k.en),g=await tt(m,a),p=await nt(m,a),$=r.map((k,u)=>{var F,be,oe;const w=st(l,p[u]),z=[...w.flags];return g[u].topic==="other"&&z.push("topic-unsure"),(F=x[s])!=null&&F.fallback&&!e.english&&z.push("fallback-pack"),{en:k.en,original:k.original,topic:g[u].topic,topicScore:g[u].score,runnerUp:g[u].runnerUp,sentiment:w.sentiment,moodScore:((be=p[u])==null?void 0:be.score)??null,modelMood:((oe=p[u])==null?void 0:oe.label)??null,flags:z,confirmed:!1}});return{english:c,sentences:$,products:da(c),status:"analyzed"}}let re;async function we(){if(re!==void 0)return re;try{const e=await fetch("audio/sw/manifest.json");re=e.ok?await e.json():null}catch{re=null}return re}const xe=e=>e>=1&&e<=20?`g_${e}`:"g_more";function Bt(e){if(!e.guests)return["no_feedback"];const a=["period",xe(e.guests),"gave_feedback"];e.guests<5&&a.push("few_data");const t=e.liked.filter(o=>o.id!=="other").slice(0,3);if(t.length){a.push("liked_intro");for(const o of t)a.push(`t_${o.id}`,xe(o.guests))}const s=e.improve.filter(o=>o.id!=="other").slice(0,3);if(s.length){a.push("improve_intro");for(const o of s)a.push(`t_${o.id}`,xe(o.guests))}else a.push("no_complaints");if(e.products.length){a.push("products_intro");for(const o of e.products)a.push(`p_${o.id}`,xe(o.guests))}const l=ea(e);return l&&a.push("idea_intro",`p_${l.id}`,"idea_outro"),e.unsure>0&&a.push("unsure"),e.swahiliEntries>0&&a.push("swahili_entries"),a}let Ye=0,ue=null;function Et(){Ye++,ue&&(ue.pause(),ue=null)}async function Ta(e){const a=await we();if(!a||!e.every(s=>a.files[s]))return!1;Et();const t=++Ye;for(const s of e){if(t!==Ye)break;await new Promise(l=>{const o=new Audio(`audio/sw/${a.files[s]}`);ue=o,o.onended=l,o.onerror=l,o.play().catch(l)})}return ue=null,!0}async function At(){const e=await we();e&&await Promise.all(Object.values(e.files).map(a=>fetch(`audio/sw/${a}`).catch(()=>null)))}async function fa(e,a,t,s){t==="sw"&&await Ta([e])||s(a,t)}const Ie={book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5M9 8h7M9 11.5h5"/></svg>',steps:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h3M11 6h9M4 12h3M11 12h9M4 18h3M11 18h9"/></svg>',play:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M10 8.5v7l6-3.5z"/></svg>',speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>'},_=[{icon:Ie.book,title:()=>n("Karibu","Welcome"),body:()=>[n("Wageni wanaandika maoni kwa lugha yao. Wewe unasikia walichosema, kwa Kiswahili.","Guests write feedback in their own language. You hear what they said, in Swahili."),n("Kila kitu kinabaki kwenye simu hii na kinafanya kazi bila mtandao.","Everything stays on this phone and works offline.")]},{icon:Ie.steps,target:'[data-action="go"][data-screen="add"]',title:()=>n("Hatua tatu","Three steps"),list:()=>[n("Mgeni anaandika kwenye kitabu cha karatasi, au unampa simu.","A guest writes in the paper guestbook, or you hand them the phone."),n("Wikendi: piga picha ya ukurasa, au rekodi sauti, au andika.","At the weekend: photograph the page, record a voice note, or type."),n("Sikiliza muhtasari na uwashukuru wageni kwa lugha yao.","Listen to the summary and thank guests in their language.")],body:()=>[n("Maneno ya njano = AI haina uhakika. Angalia wewe mwenyewe.","Yellow = the AI is not sure. Check it yourself.")]},{icon:Ie.play,target:'[data-action="guide-try"], [data-action="speak"]',title:()=>n("Jaribu sasa","Try it now"),body:()=>[n("Mgeni wa kubuni ameandika maoni kwa Kiingereza. Simu itapakua modeli ndogo mara moja (MB 90), kisha ikuonyeshe muhtasari.","An invented guest wrote feedback in English. The phone downloads two small models once (90 MB), then shows you the summary.")],final:!0}];function Dt(e){const a=_[e],t=e===_.length-1,s=_.map((c,m)=>`<span class="${m===e?"on":""}"></span>`).join(""),l=a.list?`<ol class="guide-list">${a.list().map(c=>`<li>${c}</li>`).join("")}</ol>`:"",o=a.body().map(c=>`<p class="lead">${c}</p>`).join(""),r=a.final?`
    <div class="stack" style="margin-top:8px">
      <button class="btn block" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>
      <button class="btn secondary block" data-action="guide-close">${n("Anza bila mfano","Start without it")}</button>
    </div>`:"";return`
  <div class="guide-card" role="document">
    <div class="guide-top">
      <div class="guide-dots" aria-label="${e+1} / ${_.length}">${s}</div>
      <button class="guide-close" data-action="guide-close">${n("Ruka","Skip")} ✕</button>
    </div>
    <div class="guide-icon" aria-hidden="true">${a.icon}</div>
    <h2 id="guide-title">${a.title()} <button class="say" data-action="say" data-clip="${["ui_who","ui_add","ui_summary"][e]||"ui_help"}" data-sw="${[...a.list?a.list():[],...a.body()].join(" ").replace(/"/g,"&quot;")}" data-en="${[...a.list?a.list():[],...a.body()].join(" ").replace(/"/g,"&quot;")}" aria-label="Sikiliza">${Ie.speaker}</button></h2>
    ${l}
    ${o}
    ${r}
    <div class="guide-nav">
      <button class="btn secondary" data-action="guide-prev" ${e===0?"disabled":""}>${n("Rudi","Back")}</button>
      ${t?"":`<button class="btn" data-action="guide-next">${n("Endelea","Next")}</button>`}
    </div>
  </div>`}const Ba=["en","it","fr","de","zh","es","pl","sw","xx"],ka={en:{title:"Thank you for visiting!",intro:"Please tell {host} about your visit, in your own language. It takes one minute.",name:"Your name",liked:"What did you like most?",improve:"What could be better?",buy:"Would you buy something to take home?",coffee:"Coffee",souvenir:"Souvenirs",email:"Email (optional)",consent:"{host} may keep my email and write to me (a thank-you note). I can ask her to delete it at any time.",save:"Save",needText:"Please write something in one of the boxes.",done:"Thank you! Your words have been saved on {host}’s phone.",handBack:"Please give the phone back to {host}.",next:"Next guest",privacy:"Your words stay on this phone. Tour companies only see totals, never your name.",lang:"Language"},it:{title:"Grazie per la visita!",intro:"Racconta a {host} la tua visita, nella tua lingua. Ci vuole un minuto.",name:"Il tuo nome",liked:"Cosa ti è piaciuto di più?",improve:"Cosa potremmo migliorare?",buy:"Compreresti qualcosa da portare a casa?",coffee:"Caffè",souvenir:"Souvenir",email:"Email (facoltativa)",consent:"{host} può conservare la mia email e scrivermi (un ringraziamento). Posso chiederle di cancellarla in qualsiasi momento.",save:"Salva",needText:"Scrivi qualcosa in uno dei due riquadri.",done:"Grazie! Le tue parole sono state salvate sul telefono di {host}.",handBack:"Per favore, restituisci il telefono a {host}.",next:"Prossimo ospite",privacy:"Le tue parole restano su questo telefono. Le agenzie vedono solo i totali, mai il tuo nome.",lang:"Lingua"},fr:{title:"Merci de votre visite !",intro:"Racontez votre visite à {host}, dans votre langue. Cela prend une minute.",name:"Votre nom",liked:"Qu’avez-vous le plus aimé ?",improve:"Qu’est-ce qui pourrait être amélioré ?",buy:"Achèteriez-vous quelque chose à emporter ?",coffee:"Café",souvenir:"Souvenirs",email:"E-mail (facultatif)",consent:"{host} peut conserver mon e-mail et m’écrire (un mot de remerciement). Je peux demander sa suppression à tout moment.",save:"Enregistrer",needText:"Écrivez quelque chose dans l’une des deux cases.",done:"Merci ! Vos mots sont enregistrés sur le téléphone de {host}.",handBack:"Merci de rendre le téléphone à {host}.",next:"Visiteur suivant",privacy:"Vos mots restent sur ce téléphone. Les agences ne voient que des totaux, jamais votre nom.",lang:"Langue"},de:{title:"Danke für Ihren Besuch!",intro:"Erzählen Sie {host} von Ihrem Besuch – in Ihrer eigenen Sprache. Es dauert eine Minute.",name:"Ihr Name",liked:"Was hat Ihnen am besten gefallen?",improve:"Was könnten wir besser machen?",buy:"Würden Sie etwas zum Mitnehmen kaufen?",coffee:"Kaffee",souvenir:"Souvenirs",email:"E-Mail (optional)",consent:"{host} darf meine E-Mail speichern und mir schreiben (ein Dankeschön). Ich kann jederzeit um Löschung bitten.",save:"Speichern",needText:"Bitte schreiben Sie etwas in eines der Felder.",done:"Danke! Ihre Worte sind auf {host}s Telefon gespeichert.",handBack:"Bitte geben Sie das Telefon an {host} zurück.",next:"Nächster Gast",privacy:"Ihre Worte bleiben auf diesem Telefon. Reiseveranstalter sehen nur Summen, nie Ihren Namen.",lang:"Sprache"},zh:{title:"感谢您的来访！",intro:"请用您自己的语言告诉 {host} 这次参观的感受，只需一分钟。",name:"您的名字",liked:"您最喜欢什么？",improve:"有什么可以改进的？",buy:"您想买些东西带回家吗？",coffee:"咖啡",souvenir:"纪念品",email:"电子邮箱（可选）",consent:"{host} 可以保存我的邮箱并给我写信（感谢信）。我可以随时要求她删除。",save:"保存",needText:"请至少在一个框里写点什么。",done:"谢谢！您的留言已保存在 {host} 的手机上。",handBack:"请把手机还给 {host}。",next:"下一位客人",privacy:"您的留言只保存在这部手机上。旅行社只能看到汇总数字，看不到您的名字。",lang:"语言"},es:{title:"¡Gracias por su visita!",intro:"Cuéntele a {host} cómo fue su visita, en su propio idioma. Le llevará un minuto.",name:"Su nombre",liked:"¿Qué le gustó más?",improve:"¿Qué podríamos mejorar?",buy:"¿Compraría algo para llevar a casa?",coffee:"Café",souvenir:"Recuerdos",email:"Correo electrónico (opcional)",consent:"{host} puede guardar mi correo y escribirme (una nota de agradecimiento). Puedo pedirle que lo borre en cualquier momento.",save:"Guardar",needText:"Escriba algo en una de las dos casillas.",done:"¡Gracias! Sus palabras se guardaron en el teléfono de {host}.",handBack:"Por favor, devuelva el teléfono a {host}.",next:"Siguiente visitante",privacy:"Sus palabras se quedan en este teléfono. Las agencias solo ven totales, nunca su nombre.",lang:"Idioma"},pl:{title:"Dziękujemy za wizytę!",intro:"Opowiedz {host} o swojej wizycie we własnym języku. To zajmie minutę.",name:"Twoje imię",liked:"Co podobało się najbardziej?",improve:"Co możemy poprawić?",buy:"Czy kupiłbyś coś do zabrania do domu?",coffee:"Kawa",souvenir:"Pamiątki",email:"E-mail (opcjonalnie)",consent:"{host} może zachować mój e-mail i napisać do mnie (podziękowanie). Mogę w każdej chwili poprosić o jego usunięcie.",save:"Zapisz",needText:"Napisz coś w jednym z pól.",done:"Dziękujemy! Twoje słowa zapisano w telefonie {host}.",handBack:"Oddaj proszę telefon {host}.",next:"Następny gość",privacy:"Twoje słowa zostają w tym telefonie. Biura podróży widzą tylko sumy, nigdy Twojego imienia.",lang:"Język"},sw:{title:"Asante kwa kututembelea!",intro:"Tafadhali mweleze {host} kuhusu ziara yako, kwa lugha yako. Inachukua dakika moja.",name:"Jina lako",liked:"Ulipenda nini zaidi?",improve:"Nini kiboreshwe?",buy:"Ungependa kununua kitu cha kupeleka nyumbani?",coffee:"Kahawa",souvenir:"Zawadi",email:"Barua pepe (hiari)",consent:"{host} anaweza kuhifadhi barua pepe yangu na kuniandikia (ujumbe wa shukrani). Naweza kumwomba aifute wakati wowote.",save:"Hifadhi",needText:"Tafadhali andika kitu kwenye kisanduku kimoja.",done:"Asante! Maneno yako yamehifadhiwa kwenye simu ya {host}.",handBack:"Tafadhali mrudishie {host} simu.",next:"Mgeni anayefuata",privacy:"Maneno yako yanabaki kwenye simu hii. Kampuni za utalii zinaona jumla tu, si jina lako.",lang:"Lugha"}};function Ea(e){const a=ka[e]||{...ka.en,intro:"Please tell {host} about your visit. Write in any language you like; it takes one minute."},t={};for(const[s,l]of Object.entries(a))t[s]=l.replace(/\{host\}/g,y());return t}function Aa(){for(const e of navigator.languages||[navigator.language||"en"]){const a=String(e).slice(0,2).toLowerCase();if(Ba.includes(a))return a}return"en"}const Da={host:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10M10 20v-6h4v6"/></svg>',visitor:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7.5" r="3.5"/><path d="M5 21c.9-4 3.6-6 7-6s6.1 2 7 6"/></svg>',company:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/></svg>'},Ct=Da.visitor;function Nt(){const e={host:"tile-caramel",visitor:"tile-leaf",company:"tile-sky"},a='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',t={host:"ui_host",visitor:"ui_visitor",company:"ui_company"},s=(l,o,r)=>`
    <div class="home-row">
    <button class="home-btn" data-action="choose-role" data-role="${l}">
      <span class="role-icon ${e[l]}" aria-hidden="true">${Da[l]}</span>
      <span class="role-text"><strong>${o}</strong><span class="small muted">${r}</span></span>
    </button><button class="say" data-action="say" data-clip="${t[l]}" data-sw="${d(o+". "+r)}" data-en="${d(o+". "+r)}" aria-label="Sikiliza">${a}</button></div>`;return`
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
  <p class="small muted" style="margin-top:14px">${n("Unaweza kubadilisha baadaye.","You can switch later.")}</p>`}function Ot(e,a,t={}){const s=Ea(e),l={name:"",liked:"",improve:"",email:"",...t},o=Ba.map(r=>`<button class="chip" data-action="visitor-lang" data-lang="${r}" aria-pressed="${r===e}">${d(x[r].native)}</button>`).join("");return a?`
    <div class="card" lang="${e}" style="text-align:center;padding:28px 18px">
      <div class="role-icon" style="margin:0 auto 12px" aria-hidden="true">${Ct}</div>
      <h1>${d(s.done)}</h1>
      <p class="lead" style="font-size:1.1rem">${d(s.handBack)}</p>
      <button class="btn block" style="margin-top:12px" data-action="visitor-next">${d(s.next)}</button>
    </div>
    <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${y()} tu: rudi`,`${y()} only: back`)}</button>`:`
  <div class="row" style="margin-bottom:10px" aria-label="${d(s.lang)}">${o}</div>
  <div class="card" lang="${e}">
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
  <button class="btn small secondary" data-action="visitor-exit">${n(`Kwa ${y()} tu: rudi`,`${y()} only: back`)}</button>`}function Wt({langOptionsHTML:e,today:a,sms:t,report:s}){return`
  <h1>${n("Kwa kampuni ya utalii","For tour companies")}</h1>
  <p class="small muted">${n(`Tuma ratiba ya wageni kwa ${y()}. Anapokea SMS fupi kwa Kiswahili kwenye simu yake ya kawaida.`,`Send a booking to ${y()}. The host gets a short Swahili SMS on a basic phone, no internet needed.`)}</p>
  <div class="card">
    <div class="stack">
      <label class="field">${n(`Namba ya simu ya ${y()}`,`${y()}’s phone number`)}<input type="tel" id="c-phone" placeholder="+255 …" autocomplete="off"></label>
      <div class="grid2">
        <label class="field">${n("Tarehe","Date")}<input type="date" id="c-date" value="${a}" data-change="company-preview"></label>
        <label class="field">${n("Wageni","Guests")}<input type="number" id="c-guests" min="1" value="2" data-change="company-preview"></label>
      </div>
      <label class="field">${n("Lugha ya wageni","Guests’ language")}<select id="c-lang" data-change="company-preview">${e}</select></label>
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
    ${s?`<div class="sms">${d(s)}</div>`:""}
  </div>`}const Te=(e,a)=>a==="sw"?Pe(e):E(e);function Pt(e,a,t=new Date){return a&&a.length?a.filter(s=>new Date(s)>=R(t,-1)).sort():(e.availableOffsets||[]).map(s=>We(R(t,s)))}const Rt='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',Ca='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></svg>',qt=new Set("a an the to of in at on for my our their his her and or with near by from went go visit visited place friend friends told said about some that this is was were are be we i they it like want wanting looking".split(" ")),ya=e=>String(e||"").toLowerCase().replace(/[^\p{L}\p{N}\s]/gu," ").split(/\s+/).filter(a=>a&&!qt.has(a));function Ht(e,a,t=[],s="en",l=null){const o=ya(e);return o.length?a.map(c=>{const m=[c.name,c.town,...c.tags||[],c.blurb].join(" ").toLowerCase(),g=new Set(ya(m));let p=0;const $=[];for(const u of o)(g.has(u)||m.includes(u))&&(p+=c.town.toLowerCase().includes(u)||c.name.toLowerCase().includes(u)?3:1,$.push(u));const k=t.find(u=>o.includes((u.name||"").toLowerCase().split(" ")[0]));return k&&c.id==="noor"&&(p+=6,$.push(n(`${k.name} alitembelea hapa`,`${k.name} visited here`))),l&&l[c.id]!=null&&(p+=l[c.id]*4),{host:c,score:p,reasons:[...new Set($)]}}).sort((c,m)=>m.score-c.score):a.map(c=>({host:c,score:0,reasons:[]}))}function Kt({q:e,hosts:a,lang:t,loading:s,ranked:l,thinking:o}){const r=(e||"").trim(),c=r&&l?l.filter(p=>p.score>0):a.map(p=>({host:p,score:0,reasons:[]})),m=r&&c.length&&c[0].score>=3?c[0]:null,g=(p,$)=>`
    <button class="home-btn ${$?"locked":""}" data-action="open-host" data-id="${p.host.id}">
      <span class="role-icon ${$?"tile-caramel":"tile-leaf"}" aria-hidden="true">${Ca}</span>
      <span class="role-text">${$?`<span class="chip" style="align-self:flex-start;margin-bottom:4px">${n("Mahali pako","Best match")}</span>`:""}<strong>${d(p.host.name)}</strong>
        <span class="small muted">${d(p.host.town)} · ${(p.host.tags||[]).slice(0,3).map(d).join(" · ")}</span>
        ${p.reasons.length?`<span class="small">${n("Kwa nini","Why")}: ${p.reasons.map(d).join(", ")}</span>`:`<span class="small">${n("Lugha","Languages")}: ${p.host.languages.map(k=>d(S(k,t))).join(", ")}</span>`}</span>
    </button>`;return`
  <h1>${n("Tafuta mahali pa kutembelea","Find a place to visit")}</h1>
  <p class="small muted">${n("Andika unachokumbuka: jina la kijiji, jina la rafiki aliyekwenda, au “shamba la kahawa karibu na Moshi”. Simu inatafuta mahali pako.","Type what you remember: a village, the friend who went, or “a coffee farm near Moshi”. The phone finds the place.")}</p>
  <label class="field search">${Rt}<input type="search" id="find-q" value="${d(e||"")}" placeholder="${n("k.m. rafiki yangu Emma alikwenda shamba la kahawa","e.g. my friend Emma went to a coffee farm")}" autocomplete="off" data-input="find-q"></label>
  ${s?`<p class="muted">${n("Inapakia…","Loading…")}</p>`:""}
  ${o?`<p class="small muted">${n("Inalinganisha maana…","Matching by meaning…")}</p>`:""}
  <div class="stack" style="margin-top:12px">
    ${c.length?c.map((p,$)=>g(p,m&&$===0)).join(""):`<div class="notice">${n("Hakuna matokeo. Jaribu jina la kijiji au la rafiki.","No results. Try the name of the village or of your friend.")}</div>`}
  </div>
  <p class="small muted" style="margin-top:14px">${n("Orodha ya mfano (data bandia). Toleo halisi linapata orodha kutoka kwa kampuni ya utalii au ofisi ya utalii.","Example directory (synthetic). The real version gets the list from the tour company or the tourism office.")}</p>
  <div class="row home-links">
    <button class="link-btn" data-action="hand-to-guest">${n("Umeshatembelea? Andika maoni","Already visited? Leave feedback")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
  </div>`}function Ft(e,a,t){const s=r=>O(r)[t].split(" (")[0].toLowerCase(),l=a&&a.guests?{guests:a.guests,liked:a.liked.filter(r=>r.id!=="other").slice(0,3).map(r=>r.id),improve:a.improve.filter(r=>r.id!=="other").slice(0,2).map(r=>r.id),products:a.products.map(r=>r.id)}:e.sample;if(!l||!l.guests)return n("Bado hakuna maoni.","No feedback yet.");const o=[n(`Wageni ${l.guests} wametoa maoni.`,`${l.guests} guests left feedback.`)];if(l.liked.length&&o.push(n(`Walipenda: ${l.liked.map(s).join(", ")}.`,`Loved: ${l.liked.map(s).join(", ")}.`)),l.improve.length&&o.push(n(`Kuboresha: ${l.improve.map(s).join(", ")}.`,`To improve: ${l.improve.map(s).join(", ")}.`)),l.products.length){const r=l.products.map(c=>(W.find(m=>m.id===c)||{})[t]||c);o.push(n(`Bidhaa zinazopatikana: ${r.join(", ")}.`,`For sale: ${r.join(", ")}.`))}return o.join(" ")}function _t({host:e,days:a,selected:t,summaryLine:s,form:l,lang:o,knownGuest:r}){const c={guests:2,language:"en",name:"",email:"",consent:!1,referredBy:"",...l},m=a.length?a.map(p=>`<button class="chip" data-action="book-day" data-day="${p}" aria-pressed="${p===t}">${d(Te(p+"T12:00:00",o))}</button>`).join(""):`<span class="muted">${n("Hakuna siku zilizotangazwa bado. Uliza kampuni ya utalii.","No days published yet. Ask the tour company.")}</span>`,g=Object.entries(x).filter(([p])=>p!=="xx"||!0).map(([p,$])=>`<option value="${p}" ${p===c.language?"selected":""}>${d($[o])}${$.native!==$[o]?` (${d($.native)})`:""}</option>`).join("");return`
  <button class="btn small secondary" data-action="go" data-screen="find" style="margin-bottom:12px">← ${n("Orodha","Places")}</button>
  <div class="card hero-card">
    <div class="hero-art" aria-hidden="true">${Ut}</div>
    <h1 style="margin-top:10px">${d(e.name)}</h1>
    <p class="small muted" style="margin-top:-4px">${d(e.town)} · ${(e.tags||[]).map(d).join(" · ")}</p>
    <p>${d(e.blurb)}</p>
    <div class="row small">
      <span class="chip plain">${n("Lugha","Languages")}: ${e.languages.map(p=>d(S(p,o))).join(", ")}</span>
      <span class="chip plain">${n("Mwongozaji","Guide")}: ${d(e.guide)}</span>
    </div>
    <p class="small muted" style="margin:8px 0 0">${d(e.price)}</p>
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
      ${r?`<div class="notice small">${n(`${d(r.name)} alitembelea hapa (${d(Te(r.visitDate,o))}). Mwenyeji atafurahi kujua.`,`${d(r.name)} visited here (${d(Te(r.visitDate,o))}). The host will be glad to know.`)}</div>`:""}
      <label class="field">${n("Barua pepe (hiari)","Email (optional)")}<input type="email" id="bk-v-email" value="${d(c.email)}" autocomplete="off"></label>
      <label class="check"><input type="checkbox" id="bk-v-consent" ${c.consent?"checked":""}> <span>${n("Mwenyeji anaweza kuhifadhi barua pepe yangu na kuniandikia baada ya ziara.","The host may keep my email and write to me after the visit.")}</span></label>
      <button class="btn block" data-action="book-submit" ${t?"":"disabled"}>${n("Tuma ombi","Send the request")}</button>
      <p class="small muted" style="margin:0">${n("Hakuna malipo hapa. Kampuni ya utalii inathibitisha kwa barua pepe au WhatsApp.","No payment here. The tour company confirms by email or WhatsApp.")}</p>
    </div>
  </div>`}function Gt({host:e,booking:a,lang:t,phrasebook:s,saved:l,audioReady:o,online:r=!0,requestHref:c=""}){const m=`<svg viewBox="0 0 320 170" class="spot-map" role="img" aria-label="map">
    <rect width="320" height="170" rx="12" fill="#E4EFE2"/>
    <path d="M0 120 C 60 90 120 150 200 110 S 290 80 320 100" fill="none" stroke="#8CC6DC" stroke-width="10" stroke-linecap="round"/>
    <path d="M20 40 L70 15 L120 45 L170 10 L230 50 L300 20" fill="none" stroke="#A9C4CE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M40 150 L120 120 L200 140 L300 125" fill="none" stroke="#7DAA5A" stroke-width="8" stroke-linecap="round"/>
    <circle cx="60" cy="140" r="5" fill="#1F4D3A"/><text x="70" y="145" font-size="12" fill="#1F4D3A">Moshi</text>
    <g transform="translate(205 70)"><path d="M0 22 c -14 -16 -14 -32 0 -32 s 14 16 0 32z" fill="#B2452C"/><circle cy="-10" r="5" fill="#fff"/></g>
    <text x="210" y="100" font-size="12" font-weight="700" fill="#1F4D3A">${d(e.town)}</text>
  </svg>`,g=(s||[]).map(p=>`
    <li class="row between"><div><strong lang="sw">${d(p.sw)}</strong><div class="small muted">${d(p.en)} · <i>${d(p.say)}</i></div></div>
      <button class="say" data-action="say-phrase" data-clip="${p.id}" data-text="${d(p.sw)}" aria-label="Listen"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg></button></li>`).join("");return`
  <div class="card" style="text-align:center;padding:22px 18px">
    <div class="role-icon tile-caramel" style="margin:0 auto 10px" aria-hidden="true">${Ca}</div>
    <h1>${r?n("Ombi limetumwa","Request sent"):n("Ombi limehifadhiwa","Request saved")}</h1>
    <p class="lead" style="margin:0">${r?n(`${d(e.company)} itathibitisha kwa barua pepe au WhatsApp. Mwenyeji anapata SMS.`,`${d(e.company)} confirms by email or WhatsApp. The host gets an SMS.`):n("Hakuna mtandao sasa. Tuma ombi lako kwa SMS: linafika bila intaneti.","No internet right now. Send your request by SMS: it arrives without internet.")}</p>
    ${c?`<a class="btn ${r?"secondary":""} block" style="margin-top:12px" href="${c}">${r?n("Tuma pia kwa SMS","Also send by SMS"):n("Tuma ombi kwa SMS","Send the request by SMS")}</a>`:""}
  </div>
  <div class="card">
    <h2>${n("Safari yako","Your trip")} <span class="chip">${n("Imehifadhiwa kwenye simu","Saved on your phone")}</span></h2>
    <p style="margin:0 0 8px"><strong>${d(e.name)}</strong> · ${d(Te(a.date,t))} · ${n("wageni","guests")} ${d(a.guests)} · ${d(S(a.language,t))}</p>
    ${m}
    <dl class="kv" style="margin-top:10px">
      <dt>${n("Mahali pa kukutana","Meeting point")}</dt><dd>${d(e.meet)}</dd>
      <dt>${n("Njia","Getting there")}</dt><dd>${d(e.directions)}</dd>
      <dt>${n("Mwongozaji","Guide")}</dt><dd>${d(e.guide)} · ${d(e.phone)}</dd>
    </dl>
    <div class="row" style="margin-top:10px">
      <a class="btn small secondary" href="geo:${e.lat},${e.lng}?q=${e.lat},${e.lng}(${encodeURIComponent(e.name)})">${n("Fungua kwenye ramani","Open in maps")}</a>
      <a class="btn small secondary" href="https://www.google.com/maps/search/?api=1&query=${e.lat},${e.lng}" target="_blank" rel="noopener">Google Maps</a>
    </div>
    <p class="small muted" style="margin:8px 0 0">${n("Maelezo haya yanabaki kwenye simu yako bila mtandao.","These details stay on your phone, offline.")}</p>
  </div>
  <div class="card">
    <h2>${n("Kiswahili kwa safari yako","Swahili for your trip")} ${l?`<span class="chip">${n("Imepakuliwa","Downloaded")}</span>`:""}</h2>
    <p class="small muted">${n("Lugha ya mwenyeji, imehifadhiwa kwenye simu yako.",`The host’s language, saved on your phone${o?" with sound":""}.`)}</p>
    ${l?`<ul class="list">${g}</ul>`:`<button class="btn block" data-action="download-phrasebook">${n("Pakua misemo 12 (na sauti)","Download 12 phrases (with sound)")}</button>`}
  </div>
  <div class="stack">
    <button class="btn secondary block" data-action="go" data-screen="find">${n("Tafuta mahali pengine","Find another place")}</button>
    <button class="btn secondary block" data-action="switch-role">${n("Maliza","Done")}</button>
  </div>`}const Ut=`<svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="">
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
</svg>`,Me=(e,a,t,s=!1)=>`
  <g class="bamboo" style="animation-delay:${t}s" transform="translate(${e} 1600) ${s?"scale(-1 1)":""}">
    <rect x="-9" y="-${a}" width="18" height="${a}" rx="9" fill="#6E9F4E"/>
    ${[...Array(Math.floor(a/110))].map((l,o)=>`<rect x="-11" y="-${(o+1)*110}" width="22" height="7" rx="3" fill="#4F7A3A"/>`).join("")}
    ${[...Array(Math.floor(a/160))].map((l,o)=>`
      <path d="M0 -${120+o*160} q -70 -30 -120 -10 q 60 40 120 10z" fill="#7DAA5A"/>
      <path d="M0 -${180+o*160} q 60 -40 110 -20 q -50 40 -110 20z" fill="#8DB86A"/>`).join("")}
  </g>`,_e=(e,a,t,s)=>`
  <g class="cloud" style="animation-duration:${s}s" transform="translate(${e} ${a}) scale(${t})" fill="#fff" opacity="0.85">
    <ellipse cx="0" cy="0" rx="90" ry="34"/><ellipse cx="-50" cy="8" rx="50" ry="26"/><ellipse cx="55" cy="6" rx="60" ry="30"/><ellipse cx="10" cy="-18" rx="55" ry="30"/>
  </g>`,je=(e,a,t)=>`
  <ellipse class="leaf" style="animation-delay:${a}s;animation-duration:${t}s" cx="${e}" cy="-30" rx="14" ry="7" fill="#8DB86A" opacity="0.9"/>`,wa=(e,a,t)=>`
  <path class="bird" style="animation-duration:${a}s;animation-delay:${t}s" d="M-16 ${e} q 8 -10 16 0 q 8 -10 16 0" fill="none" stroke="#3E5E46" stroke-width="3" stroke-linecap="round"/>`,Vt=`
<svg viewBox="0 0 1000 1600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE7EE"/><stop offset="0.55" stop-color="#EAF2EA"/><stop offset="1" stop-color="#F4EFE3"/></linearGradient>
    <radialGradient id="nsun"><stop offset="0" stop-color="#FFE7A8"/><stop offset="0.5" stop-color="#F8D57E" stop-opacity="0.9"/><stop offset="1" stop-color="#F8D57E" stop-opacity="0"/></radialGradient>
    <linearGradient id="nriver" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5FA8C7"/><stop offset="1" stop-color="#8CC6DC"/></linearGradient>
  </defs>
  <rect width="1000" height="1600" fill="url(#nsky)"/>
  <circle class="sun" cx="780" cy="260" r="150" fill="url(#nsun)"/>
  <circle cx="780" cy="260" r="60" fill="#FFD36E"/>
  ${_e(120,220,1,70)}${_e(600,140,.7,95)}${_e(900,330,.55,80)}
  ${wa(0,46,0)}${wa(40,58,18)}
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
  ${Me(40,900,0)}${Me(110,700,1.3)}${Me(960,980,.6,!0)}${Me(890,760,2.1,!0)}
  ${je(180,0,14)}${je(520,5,18)}${je(820,9,16)}${je(330,12,20)}
</svg>`,De={mountains:{id:12492499,by:"RD King"},grove:{id:12311788,by:"Anton Lukin"},canopy:{id:6318875,by:"Vanessa Garcia"},cherries:{id:7116757,by:"Matthias Groeneveld"},stream:{id:11902892,by:"Thierry Rossier"},flowers:{id:14482561,by:"Michael Burrows"},dunes:{id:14483416,by:"Dubang chang"},snow:{id:19806018,by:"iPhone Snaps"}},P=Object.keys(De),Na=e=>`Pexels video ${De[e].id} by ${De[e].by}`,Yt=()=>Object.entries(De).map(([e,a])=>`${a.by} (${a.id})`).join(", "),Oa="wekaribu-motion",Jt=12,Wa=900;let H=null,ee=-1,ne=0,M=!0;const pe={},ge=()=>P[Math.max(ee,0)],Zt=()=>M,Qt=()=>matchMedia("(orientation: landscape)").matches&&innerWidth>700,ta=(e,a)=>`bg/${e}${Qt()?"-wide":""}.${a}`;function Xt(){const e=navigator.connection&&navigator.connection.saveData;return navigator.onLine&&!e&&!matchMedia("(prefers-reduced-motion: reduce)").matches}function en(e,a){const t=document.createElement("video");return t.className="bg-video",t.muted=!0,t.loop=!1,t.playsInline=!0,t.autoplay=!1,t.preload="auto",t.setAttribute("muted",""),t.setAttribute("playsinline",""),t.src=ta(a,"mp4"),e.classList.add("has-video"),t.addEventListener("canplay",()=>e.classList.add("video-ready"),{once:!0}),t.addEventListener("error",()=>{t.remove(),e.classList.remove("video-ready","has-video")},{once:!0}),t.addEventListener("timeupdate",()=>{if(!e.classList.contains("on")||!isFinite(t.duration)||t.duration-t.currentTime>(Wa+300)/1e3)return;const s=he(P[He()]).querySelector("video");(!s||s.readyState>=4)&&Ne()}),t.addEventListener("ended",()=>{e.classList.contains("on")&&sa()}),e.appendChild(t),t}function he(e){let a=pe[e];return a||(a=document.createElement("div"),a.className="bg-layer",a.dataset.scene=e,a.innerHTML=`<img class="bg-photo" src="${ta(e,"jpg")}" alt="">`,pe[e]=a,H.appendChild(a)),!a.querySelector("video")&&M&&Xt()&&en(a,e),a}const He=()=>(ee+1)%P.length;function na(e,a){const t=()=>{e.classList.contains("on")&&M&&!document.hidden&&a.play().catch(()=>{})};a.readyState>=4?t():a.addEventListener("canplaythrough",t,{once:!0})}function Ce(e){if(clearTimeout(ne),!M)return;const a=e.querySelector("video"),s=a&&!a.paused&&isFinite(a.duration)&&a.duration>0?a.duration-a.currentTime+5:Jt;ne=setTimeout(Ne,s*1e3)}function an(){const e=Na(ge());for(const a of document.querySelectorAll(".credit"))a.textContent=e}function Pa(e){const a=P[e],t=he(a),s=ee>=0?pe[P[ee]]:null,l=ee<0;if(ee=e,l&&t.classList.add("reset"),t.offsetWidth,t.classList.add("on"),l&&requestAnimationFrame(()=>requestAnimationFrame(()=>t.classList.remove("reset"))),s&&s!==t){s.classList.remove("on"),s.classList.add("out");const r=s.querySelector("video");setTimeout(()=>{if(s.classList.add("reset"),s.classList.remove("out"),r){r.pause();try{r.currentTime=0}catch{}}requestAnimationFrame(()=>requestAnimationFrame(()=>s.classList.remove("reset")))},Wa+100)}const o=t.querySelector("video");o&&M&&(o.addEventListener("playing",()=>{t.classList.contains("on")&&Ce(t)},{once:!0}),na(t,o)),Ce(t),he(P[He()]),an(),H.dispatchEvent(new CustomEvent("scenechange",{detail:{scene:a}}))}function sa(){if(!H||!M||document.hidden)return;const e=he(P[He()]).querySelector("video");if(e&&e.readyState<4){clearTimeout(ne);let a=!1;const t=()=>{a||(a=!0,e.removeEventListener("canplaythrough",t),Ne())};e.addEventListener("canplaythrough",t,{once:!0}),ne=setTimeout(t,4e3);return}Ne()}function Ne(){!H||!M||document.hidden||Pa(He())}function tn(e){M=!!e;try{localStorage.setItem(Oa,M?"1":"0")}catch{}if(!H)return;H.classList.toggle("still",!M);const a=pe[ge()];if(M){if(a){const t=he(ge()).querySelector("video");t&&t.ended?sa():(t&&na(a,t),Ce(a))}}else{clearTimeout(ne);const t=a&&a.querySelector("video");t&&t.pause()}}const nn=()=>tn(!M);function sn(e){H=e;try{M=localStorage.getItem(Oa)!=="0"}catch{M=!0}H.classList.toggle("still",!M),document.addEventListener("visibilitychange",()=>{const t=pe[ge()],s=t&&t.querySelector("video");document.hidden?(clearTimeout(ne),s&&s.pause()):M&&t&&(s&&s.ended?sa():(s&&na(t,s),Ce(t)))});const a=new Image;a.onload=()=>{e.classList.add("real"),Pa(0)},a.onerror=()=>{e.innerHTML=Vt},a.src=ta(P[0],"jpg")}const de=document.getElementById("view"),U=()=>({step:1,guestId:null,inputs:[],results:[]}),i={screen:"home",role:null,guests:[],entries:[],bookings:[],messages:[],installed:[],shared:{voice:!1,topics:!1,mood:!1},online:navigator.onLine,period:"month",add:U(),recording:!1,lastSync:null,shareOk:!1,openGuest:null,guide:{open:!1,step:0},visitor:{lang:"en",saved:!1,draft:{}},hosts:null,find:{q:"",ranked:null,semantic:null,thinking:!1},phrasebook:{phrases:null,saved:!1,audioReady:!1},translate:{lang:"it",text:"",result:""},cloud:{uploads:[]},book:{hostId:null,day:null,form:{},done:null},availableDays:[]};async function J(){const[e,a,t,s]=await Promise.all(["guests","entries","bookings","messages"].map(l=>f.all(l)));Object.assign(i,{guests:e,entries:a,bookings:t,messages:s}),i.lastSync=await f.getSetting("lastSync"),i.role=await f.getSetting("role",null),i.availableDays=await f.getSetting("availableDays",[]),i.cloud.uploads=await f.getSetting("cloudUploads",[]),i.cloud.queue=await f.getSetting("cloudQueue",[]),i.hostDaysBySms=await f.getSetting("hostDaysBySms",{}),Ue(await f.getSetting("hostName","Noor")),document.documentElement.classList.toggle("big-text",await f.getSetting("bigText",!1))}async function Z(){try{i.installed=await mt();for(const e of Object.keys(G))i.shared[e]=await pt(G[e].id)}catch(e){console.warn("model check failed",e)}}const $e=e=>i.guests.find(a=>a.id===e),se=()=>$e(i.add.guestId);function V(){return ut({guests:i.guests,bookings:i.bookings,installed:i.installed,today:new Date})}function ie(){const e=i.entries.filter(t=>t.status!=="pending"&&Lt(t.visitDate||t.createdAt,i.period)),a=It(e,i.guests);return{s:a,entries:e,text:zt(a,y())}}const K=e=>b()==="sw"?Pe(e):E(e),fe=e=>O(e)[b()].split(" (")[0],A=e=>{var a;return`<span class="chip plain lang-pill" title="${d(((a=x[e])==null?void 0:a.native)||e)}">${d(S(e,b()))}</span>`};function on(e){return e==="pos"?`<span class="chip">${te.pos} ${n("Nzuri","Positive")}</span>`:e==="neg"?`<span class="chip neg">${te.neg} ${n("Ya kuboresha","To improve")}</span>`:`<span class="chip warn">${te.unsure} ${n("Haijulikani","Unsure")}</span>`}function ln(e){return e.consent?`<span class="chip">${n("Ameruhusu mawasiliano","May be contacted")}</span>`:`<span class="chip plain">${n("Hakuna ruhusa","No consent")}</span>`}function Ra(e){var a;return(a=x[e])!=null&&a.mt?i.installed.includes(e)?`<span class="chip">${n("Lugha iko tayari","Pack ready")}</span>`:`<span class="chip warn">${n("Pakua lugha","Pack needed")}</span>`:""}const qa={"topic-unsure":["Mada haijulikani","Topic unclear"],conflict:["Inapingana na kisanduku alichoandika","Contradicts the box it was written in"],"low-confidence":["Hisia hazijulikani","Mood unclear"],"no-model":["Hakuna modeli ya hisia","No sentiment model"],"fallback-pack":["Tafsiri ya pakiti ya lugha nyingine (ubora wa chini)","Translated with the other-language pack (lower quality)"]},rn=e=>qa[e][b()==="sw"?0:1];function ia(e){const a=b();return Object.entries(x).map(([t,s])=>`<option value="${t}" ${t===e?"selected":""}>${d(s[a])}${s.native!==s[a]?` (${d(s.native)})`:""}</option>`).join("")}function Ha(e){return[...xa,ft].map(a=>`<option value="${a.id}" ${a.id===e?"selected":""}>${d(a[b()])}</option>`).join("")}const D=()=>`<button class="btn small secondary" data-action="back" style="margin-bottom:12px">← ${n("Nyumbani","Home")}</button>`,Je='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',$a=(e,a,t)=>`<button class="say" data-action="say" data-clip="${e}" data-sw="${d(a)}" data-en="${d(t)}" aria-label="${n("Sikiliza","Listen")}">${Je}</button>`,te={pos:"😊",neg:"😟",unsure:"🤔"};function Ka(e,a,{open:t=!1}={}){const s=e.sentences[a],l=ye(s),o=(s.flags||[]).filter(c=>qa[c]),r=s.original&&e.lang!=="en";return`
  <div class="sent">
    ${r?`<div class="orig" lang="${d(e.lang)}">“${d(s.original)}”</div>`:""}
    ${s.en?`<div class="${r?"small muted":""}">${r?"EN: ":""}${d(s.en)}</div>`:""}
    <div class="tags">
      <span class="chip ${s.topic==="other"?"warn":""}">${d(fe(s.topic))}</span>
      ${on(s.sentiment)}
      ${l?`<span class="chip warn">${n("Angalia","Check")}</span>`:s.confirmed?`<span class="chip plain">${n("Imethibitishwa","Confirmed")}</span>`:""}
    </div>
    ${l&&o.length?`<div class="small muted" style="margin-top:4px">${o.map(rn).join("; ")}</div>`:""}
    <details ${t||l?"open":""} style="margin-top:6px">
      <summary class="small" style="cursor:pointer;color:var(--primary);font-weight:600;min-height:32px">${n("Rekebisha","Correct")}</summary>
      <div class="stack" style="margin-top:6px">
        <label class="field small">${n("Mada","Topic")}
          <select data-change="fix-topic" data-entry="${e.id}" data-idx="${a}">${Ha(s.topic)}</select>
        </label>
        <div class="row">
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="pos" aria-pressed="${s.sentiment==="pos"}">${n("Nzuri","Positive")}</button>
          <button class="btn small secondary" data-action="fix-mood" data-entry="${e.id}" data-idx="${a}" data-mood="neg" aria-pressed="${s.sentiment==="neg"}">${n("Ya kuboresha","To improve")}</button>
          <button class="btn small" data-action="confirm-sent" data-entry="${e.id}" data-idx="${a}">${n("Sawa","OK")}</button>
        </div>
      </div>
    </details>
  </div>`}function dn(e){var t;const a=(t=e.sentences)==null?void 0:t[0];return`
  <div class="sent">
    <div lang="sw">“${d(e.original)}”</div>
    <div class="small muted">${n(`Kiswahili: ${y()} anasoma mwenyewe. Weka mada kwa mkono (hiari).`,`Swahili: ${y()} reads it directly. Tag a topic by hand (optional).`)}</div>
    <div class="row" style="margin-top:6px">
      <select data-change="sw-topic" data-entry="${e.id}" aria-label="Topic">
        <option value="">— ${n("Mada","Topic")} —</option>${Ha(a==null?void 0:a.topic)}
      </select>
    </div>
    <div class="row" style="margin-top:6px">
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="pos" aria-pressed="${(a==null?void 0:a.sentiment)==="pos"}">${n("Nzuri","Positive")}</button>
      <button class="btn small secondary" data-action="sw-mood" data-entry="${e.id}" data-mood="neg" aria-pressed="${(a==null?void 0:a.sentiment)==="neg"}">${n("Ya kuboresha","To improve")}</button>
    </div>
  </div>`}function cn(e){var o;const a=$e(e.guestId),t=e.box==="liked"?n("Walipenda","Liked"):e.box==="improve"?n("Kuboresha","Could be better"):n("Maoni","Feedback"),s=e.source==="photo"?n("Picha","Photo"):e.source==="voice"?n("Sauti","Voice"):n("Imeandikwa","Typed");let l;return e.status==="pending"?l=`<p class="muted">${n("Bado haijachanganuliwa.","Not analysed yet.")}</p><p lang="${d(e.lang)}">“${d(e.original)}”</p>`:e.status==="swahili"?l=dn(e):(o=e.sentences)!=null&&o.length?l=e.sentences.map((r,c)=>Ka(e,c)).join(""):l=`<p lang="${d(e.lang)}">“${d(e.original)}”</p><p class="small muted">${n("Hakuna sentensi za kuchanganua.","No sentences to analyse.")}</p>`,`
  <div class="card flat">
    <div class="card-title">
      <div><strong>${d((a==null?void 0:a.name)||"Mgeni")}</strong> ${A(e.lang)}</div>
      <div class="small muted">${s} · ${t}</div>
    </div>
    ${l}
    ${e.synthetic?`<div class="small muted" style="margin-top:6px">${n("Mfano (data bandia)","Example (synthetic data)")}</div>`:""}
  </div>`}const Ze='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 8h3l2-3h6l2 3h3v11H4z"/><circle cx="12" cy="13" r="3.5"/></svg>',Fa='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',un='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6L8 10z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg>',mn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',pn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="16" rx="2"/><path d="M11 15h2M4 22l3-4M20 22l-3-4"/></svg>',gn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>',hn='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>';function fn(e){const a=r=>r.filter(c=>c.id!=="other").slice(0,3).map(c=>fe(c.id).toLowerCase()).join(", "),t=a(e.liked),s=a(e.improve),l=[n(`Wageni ${e.guests}.`,`${e.guests} ${e.guests===1?"guest":"guests"}.`)];t&&l.push(n(`Walipenda: ${t}.`,`Loved: ${t}.`)),l.push(s?n(`Kuboresha: ${s}.`,`To improve: ${s}.`):n("Hakuna malalamiko.","No complaints."));const o=ea(e);return o&&l.push(n(`Wengi wanataka kununua: ${W.find(r=>r.id===o.id).sw}.`,`Many want to buy: ${W.find(r=>r.id===o.id).en}.`)),l.join(" ")}function kn(){const e=i.entries.filter(u=>u.status==="pending"),{s:a}=ie(),t=i.guests.filter(u=>u.consent&&!i.messages.some(w=>w.guestId===u.id&&w.status==="sent")).length,s=i.bookings.filter(u=>{const w=ae(u.date);return w>=0&&w<=7}),l=V(),o=i.entries.reduce((u,w)=>u+(w.sentences||[]).filter(ye).length,0),r=e.length?`
    <div class="notice warn" style="margin:10px 0 0">
      <strong>${n(`Maoni ${e.length} bado hayajachanganuliwa`,`${e.length} new ${e.length===1?"entry":"entries"} to analyse`)}</strong>
      <button class="btn block" style="margin-top:8px" data-action="analyze-pending">${n("Changanua sasa","Analyse now")}</button>
    </div>`:"",c=a.entries?(()=>{let u=0,w=0;for(const z of i.entries)for(const F of z.sentences||[])F.sentiment==="pos"?u++:F.sentiment==="neg"&&w++;return`<div class="faces"><span>${te.pos} <b>${u}</b></span><span>${te.neg} <b>${w}</b></span>${o?`<span>${te.unsure} <b>${o}</b></span>`:""}</div>`})():"",m=a.entries?`
    <div class="card accent">
      <div class="card-title"><h2>${n("Wageni walisema","What guests said")} ${$a("ui_summary","Wageni walisema. Bonyeza Sikiliza kusikia muhtasari.","What guests said. Tap Listen to hear the summary.")}</h2><span class="small muted">${Oe[i.period]()}</span></div>
      ${c}
      <p class="big-summary" style="margin:0">${d(fn(a))}</p>
      ${o?`<p class="small" style="margin:8px 0 0;color:var(--warn-ink)">${n(`Sentensi ${o} zinahitaji kuangaliwa.`,`${o} ${o===1?"sentence needs":"sentences need"} a check.`)}</p>`:""}
      ${r}
      <div class="grid2" style="margin-top:12px">
        <button class="btn secondary" data-action="speak">${un}${n("Sikiliza","Listen")}</button>
        <button class="btn secondary" data-action="go" data-screen="summary">${n("Maelezo zaidi","Details")} →</button>
      </div>
    </div>`:`
    <div class="card">
      <h2>${n("Wageni walisema","What guests said")}</h2>
      <p class="muted" style="margin:0">${n("Bado hakuna maoni.","No feedback yet.")}</p>
      ${r}
      ${e.length?"":`<button class="btn secondary block" style="margin-top:12px" data-action="guide-try">${n("Jaribu mfano mmoja","Try one example")}</button>`}
    </div>`,g=(u,w,z,F,be="",oe="",Xa="",et="")=>`
    <div class="home-row">
    <button class="home-btn" ${u}>
      <span class="role-icon ${be}" aria-hidden="true">${w}</span>
      <span class="role-text"><strong>${z}</strong><span class="small muted">${F}</span></span>
    </button>${oe?$a(oe,Xa,et):""}</div>`,p=i.bookings.filter(u=>ae(u.date)>=0).sort((u,w)=>new Date(u.date)-new Date(w.date)).slice(0,4),$=p.length?`
    <div class="card">
      <div class="card-title"><h2>${n("Wageni wanaokuja","Reservations")}</h2><button class="btn small secondary" data-action="go" data-screen="week">${n("Zote","All")}</button></div>
      <ul class="list">${p.map(u=>`
        <li class="row between">
          <div><strong>${d(K(u.date))}</strong> · ${d(u.leadName||"Mgeni")} <span class="small muted">· ${n("wageni","guests")} ${d(u.guests)}</span>
            <div class="row small" style="margin-top:4px">${A(u.language)} ${Ra(u.language)} ${u.status==="requested"?`<span class="chip warn">${n("Inasubiri kampuni","Awaiting the company")}</span>`:`<span class="chip">${n("Imethibitishwa","Confirmed")}</span>`}</div></div>
        </li>`).join("")}</ul>
    </div>`:"",k=s.length?n(`Wageni ${s.reduce((u,w)=>u+(Number(w.guests)||1),0)} siku 7 zijazo`,`${s.reduce((u,w)=>u+(Number(w.guests)||1),0)} guests in the next 7 days`)+(l.download.length?` · ${n("pakua","download")} ${l.download.map(u=>S(u,b())).join(", ")}`:""):n("Pokea ratiba kutoka kwa kampuni ya utalii","Get the schedule from the tour company");return`
  ${m}
  ${$}
  <div class="stack">
    ${g('data-action="go" data-screen="add"',Ze,n("Ongeza maoni ya mgeni","Add guest feedback"),n("Picha ya kitabu, sauti au kuandika","Photo of the guestbook, voice or typing"),"tile-caramel","ui_add","Ongeza maoni ya mgeni. Piga picha ya kitabu, rekodi sauti, au andika.","Add guest feedback: photograph the guestbook, record a voice note, or type.")}
    ${g('data-action="hand-to-guest"',pn,n("Mpe mgeni simu aandike","Let a guest write"),n("Kwa lugha yake, kwenye simu hii","In their own language, on this phone"),"tile-leaf","ui_hand","Mpe mgeni simu aandike maoni kwa lugha yake.","Hand the phone to a guest to write in their own language.")}
    ${g('data-action="go" data-screen="guests"',mn,n("Washukuru wageni","Thank guests"),t?n(`Wageni ${t} wanasubiri`,`${t} waiting`):n("Ujumbe kwa lugha ya mgeni","A message in the guest’s language"),"tile-cherry","ui_thank","Washukuru wageni kwa lugha yao.","Thank guests in their own language.")}
    ${g('data-action="go" data-screen="week"',hn,n("Wiki ijayo","Next week"),k,"tile-sky","ui_week","Wiki ijayo. Nani anakuja, na lugha gani.","Next week: who is coming, and which language.")}
  </div>
  <div class="row home-links">
    <button class="link-btn" data-action="go" data-screen="translate">${n("Tafsiri","Translate")}</button>
    <button class="link-btn" data-action="guide-open">${n("Jinsi ya kutumia","How to use")}</button>
    <button class="link-btn" data-action="switch-role">${n("Badilisha upande","Switch side")}</button>
    <button class="link-btn" data-action="go" data-screen="more">${n("Zaidi","More")}</button>
  </div>`}function yn(){i.hosts||oa().then(h);const a=i.bookings.filter(o=>ae(o.date)>=0).sort((o,r)=>new Date(o.date)-new Date(r.date)).filter(o=>ae(o.date)<=7),t=V(),s=o=>`
    <li>
      <div class="row between">
        <strong>${d(K(o.date))}</strong>
        <span class="badge-num" title="guests">${d(o.guests)}</span>
      </div>
      <div class="row small" style="margin-top:6px">
        ${A(o.language)} ${Ra(o.language)}
        ${o.status==="requested"?`<span class="chip warn">${n("Inasubiri kampuni","Awaiting the company")}</span>`:""}
        ${o.guide?`<span class="muted">${n("Mwongozaji","Guide")}: ${d(o.guide)}</span>`:""}
      </div>
      <div class="small muted" style="margin-top:4px">${d(o.leadName||"")}${o.company?` · ${d(o.company)}`:""}${o.referredBy?` · ${n("alipendekezwa na","recommended by")} ${d(o.referredBy)}`:""}</div>
    </li>`,l=[...Array(14)].map((o,r)=>{const c=We(R(new Date,r+1)),m=i.availableDays.includes(c);return`<button class="chip" data-action="toggle-day" data-day="${c}" aria-pressed="${m}">${d(K(c+"T12:00:00"))}</button>`}).join("");return`
  ${D()}
  <h1>${n("Wiki ijayo","Next week")}</h1>

  <div class="card">
    <h2>${n("Siku unazoweza kupokea wageni","Days you can take guests")}</h2>
    <p class="small muted">${n("Wageni wanaziona wanapotafuta mahali, na kampuni ya utalii inapanga kulingana nazo.","Visitors see these when they search for a place, and the tour company books around them.")}</p>
    <div class="row">${l}</div>
  </div>

  <div class="card">
    <h2>${n("Bila mtandao: SMS","No internet? SMS")}</h2>
    <p class="small muted">${n("Tuma siku zako kwa kampuni kwa SMS. Simu ya kawaida inatosha.","Send your days to the tour company by SMS. A basic phone signal is enough.")}</p>
    <a class="btn block ${i.availableDays.length?"":"disabled"}" ${i.availableDays.length?`href="${Y(Ga(),xt(y(),"noor",i.availableDays.filter(o=>ae(o+"T12:00:00")>=0).sort()))}"`:'aria-disabled="true"'}>${n("Tuma siku zangu (SMS)","Send my days (SMS)")}</a>
  </div>
  ${Ua(n("Kampuni ikithibitisha wageni kwa SMS, bandika ujumbe hapa: wageni wanaingia kwenye ratiba yako.","When the company confirms guests by SMS, paste the message here: the guests go straight into your reservations."))}

  <div class="card">
    <button class="btn block" data-action="sync" ${i.online?"":"disabled"}>${n("Pokea ratiba mpya","Get the new schedule")}</button>
    <p class="small muted" style="margin:8px 0 0">${i.lastSync?`${n("Mara ya mwisho","Last updated")}: ${d(new Date(i.lastSync).toLocaleString())}`:n("Bado haijapokelewa. Inahitaji mtandao mara moja.","Not received yet. Needs internet once.")}${i.online?"":` · ${n("Nje ya mtandao","Offline")}`}</p>
  </div>

  ${a.length?`
  <div class="card">
    <h2>${n("Siku 7 zijazo","Next 7 days")}</h2>
    <ul class="list">${a.map(s).join("")}</ul>
  </div>`:`
  <div class="notice">${n("Hakuna wageni waliopangwa siku 7 zijazo.","No guests booked for the next 7 days.")}</div>`}

  <div class="card">
    <h2>${n("Lugha za kuandaa","Languages to prepare")}</h2>
    ${t.download.length?`
      <div class="row">${t.download.map(o=>A(o)).join("")}</div>
      <p class="small muted">${n(`MB ${t.downloadMB}. Tumia Wi-Fi.`,`${t.downloadMB} MB. Use Wi-Fi.`)}</p>
      <button class="btn block" data-action="download-suggested" ${i.online?"":"disabled"}>${n("Pakua sasa","Download now")}</button>
    `:`<p style="margin:0">${n("Lugha zote zinazohitajika ziko tayari.","All needed languages are ready.")}</p>`}
    ${t.removable.length?`
      <hr>
      <p>${n("Lugha nadra zinazoweza kufutwa","Rare languages you can delete")}: ${t.removable.map(o=>A(o)).join(" ")}</p>
      <button class="btn block danger" data-action="delete-removable">${n(`Futa (MB ${t.freeMB})`,`Delete (frees ${t.freeMB} MB)`)}</button>
    `:""}
    <button class="btn small secondary block" style="margin-top:10px" data-action="go" data-screen="langs">${n("Lugha zote kwenye simu","All languages on this phone")}</button>
  </div>

  `}function wn(){const e=i.add,a=`<div class="steps" aria-hidden="true">${[1,2,3].map(t=>`<span class="${e.step>=t?"on":""}"></span>`).join("")}</div>`;return e.step===1?D()+a+_a():e.step===2?D()+a+$n():a+vn()}function _a(){const e=i.bookings.filter(t=>{const s=ae(t.date);return s<=1&&s>=-14}).filter(t=>!i.guests.some(s=>s.bookingId===t.id)).sort((t,s)=>new Date(s.date)-new Date(t.date)),a=i.guests.slice().sort((t,s)=>new Date(s.visitDate)-new Date(t.visitDate)).slice(0,12);return`
  <h1>${n("Mgeni ni nani?","Who is the guest?")}</h1>

  ${e.length?`
  <div class="card">
    <h2>${n("Kutoka kwenye ratiba","From the schedule")}</h2>
    <ul class="list">${e.map(t=>`
      <li class="row between">
        <div><strong>${d(t.leadName||"Mgeni")}</strong> ${A(t.language)}<div class="small muted">${d(K(t.date))} · ${n("wageni","guests")} ${d(t.guests)}</div></div>
        <button class="btn small" data-action="pick-booking" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}

  <div class="card">
    <h2>${n("Mgeni mpya","New guest")}</h2>
    <div class="stack">
      <label class="field">${n("Jina","Name")}<input type="text" id="ng-name" autocomplete="off"></label>
      <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="ng-lang">${ia("en")}</select></label>
      <label class="field">${n("Tarehe ya ziara","Visit date")}<input type="date" id="ng-date" value="${We(new Date)}"></label>
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

  ${a.length?`
  <div class="card">
    <h2>${n("Wageni waliopo","Existing guests")}</h2>
    <ul class="list">${a.map(t=>`
      <li class="row between">
        <div><strong>${d(t.name)}</strong> ${A(t.language)}<div class="small muted">${d(K(t.visitDate))}</div></div>
        <button class="btn small secondary" data-action="pick-guest" data-id="${t.id}">${n("Chagua","Pick")}</button>
      </li>`).join("")}
    </ul>
  </div>`:""}`}function $n(){var o;const e=se();if(!e)return i.add.step=1,_a();const a=((o=x[e.language])==null?void 0:o.mt)&&!i.installed.includes(e.language),t=i.add.inputs.some(r=>r.status==="ready"&&(r.text||"").trim()),s=i.add.inputs.some(r=>r.status==="working"),l=r=>{var k;const c=`
      <select data-change="box" data-id="${r.id}" aria-label="Box">
        <option value="liked" ${r.box==="liked"?"selected":""}>${n("Walipenda (A)","Liked (box A)")}</option>
        <option value="improve" ${r.box==="improve"?"selected":""}>${n("Kuboresha (B)","Could be better (box B)")}</option>
        <option value="unknown" ${r.box==="unknown"?"selected":""}>${n("Haijulikani","Not sure")}</option>
      </select>`,m=r.langHint?`
      <div class="notice warn small">${n(`Inaonekana ni ${S(r.langHint,"sw")}, si ${S(e.language,"sw")}.`,`This looks like ${S(r.langHint,"en")}, not ${S(e.language,"en")}.`)}
        <div class="row" style="margin-top:6px"><button class="btn small secondary" data-action="use-hint" data-lang="${r.langHint}">${n(`Badilisha kuwa ${S(r.langHint,"sw")}`,`Switch to ${S(r.langHint,"en")}`)}</button></div>
      </div>`:"";let g="";r.imageURL&&(g=`<img class="preview-img" src="${r.imageURL}" alt="Photo of the guestbook box">`),r.audioURL&&(g=`<audio controls src="${r.audioURL}" style="width:100%"></audio>`);let p="";return r.status==="working"?p=`<p class="muted">${n("Inasoma…","Reading…")}</p>`:r.status==="error"?p=`<div class="notice neg small">${n("Imeshindwa","Failed")}: ${d(r.error)}</div>`:p=`
        ${(k=r.lowWords)!=null&&k.length?`<div class="notice warn small"><strong>${n("Angalia maneno haya","Check these words")}</strong>${r.lowWords.slice(0,20).map(u=>`<mark class="low">${d(u)}</mark>`).join(" ")}</div>`:""}
        <label class="field small">${r.source==="voice"?n("Alichosema mgeni","What the guest said"):n("Maandishi (rekebisha makosa)","Text (fix any mistakes)")}
          <textarea data-input="input-text" data-id="${r.id}" lang="${d(e.language)}">${d(r.text)}</textarea></label>
        ${r.source==="voice"&&e.language!=="en"&&e.language!=="sw"?`
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
      <div><strong>${d(e.name)}</strong> ${A(e.language)}<div class="small muted">${d(K(e.visitDate))}</div></div>
      <button class="btn small secondary" data-action="change-guest">${n("Badilisha","Change")}</button>
    </div>
  </div>

  ${a?`<div class="notice warn">${n(`Lugha ya ${S(e.language,"sw")} haijapakuliwa. Kuchanganua kutahitaji mtandao mara moja (MB ${Ee}).`,`The ${S(e.language,"en")} pack is not on this phone yet. Analysing needs internet once (${Ee} MB).`)}</div>`:""}

  <div class="grid2">
    <label class="btn big">${Ze}<span class="btn-col">${n("Picha A: Walipenda","Photo of box A: liked")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-liked" class="hidden"></label>
    <label class="btn big">${Ze}<span class="btn-col">${n("Picha B: Kuboresha","Photo of box B: could be better")}</span>
      <input type="file" accept="image/*" capture="environment" data-file="photo-improve" class="hidden"></label>
    <button class="btn big ${i.recording?"danger":"secondary"}" data-action="record">
      ${i.recording?'<span class="rec-dot"></span>':Fa}<span class="btn-col">${i.recording?n("Simamisha","Stop"):n("Rekodi sauti","Record voice")}</span></button>
    <button class="btn big secondary" data-action="add-typed">${gn}<span class="btn-col">${n("Andika","Type")}</span></button>
  </div>
  <label class="small" style="display:block;margin:10px 2px 0;color:var(--primary);font-weight:600;cursor:pointer">
    ${n("Au pakia faili la sauti","Or upload an audio file")}
    <input type="file" accept="audio/*" data-file="audio" class="hidden"></label>

  <div class="stack" style="margin-top:14px">${i.add.inputs.map(l).join("")}</div>

  <button class="btn block" style="margin-top:8px" data-action="run-analysis" ${t&&!s?"":"disabled"}>${n("Changanua","Analyse")}</button>`}function vn(){const e=i.add.results.map(s=>i.entries.find(l=>l.id===s)).filter(Boolean),a=se(),t=e.reduce((s,l)=>s+(l.sentences||[]).filter(ye).length,0);return`
  <h1>${n("Matokeo","Results")}</h1>
  ${t?`<div class="notice warn"><strong>${n(`Sentensi ${t} zinahitaji kuangaliwa`,`${t} ${t===1?"sentence needs":"sentences need"} a check`)}</strong>${n("AI haikuwa na uhakika. Rekebisha au bonyeza “Sawa”.","The AI was not sure. Correct it or press “OK”.")}</div>`:`<div class="notice">${n("Imehifadhiwa. Unaweza kurekebisha chochote hapa chini.","Saved. You can correct anything below.")}</div>`}
  ${e.map(cn).join("")}
  <div class="stack">
    <button class="btn" data-action="finish-add">${n("Maliza","Done")}</button>
    <button class="btn secondary" data-action="more-feedback">${n(`Ongeza maoni mengine ya ${d((a==null?void 0:a.name)||"mgeni")}`,`Add more for ${d((a==null?void 0:a.name)||"this guest")}`)}</button>
  </div>`}const Oe={week:()=>n("Wiki hii","This week"),month:()=>n("Mwezi huu","This month"),all:()=>n("Zote","All time")};function bn(){const e=i.entries.filter(g=>g.status==="pending"),{s:a,entries:t,text:s}=ie(),l=Object.entries(Oe).map(([g,p])=>`<button class="chip" data-action="period" data-period="${g}" aria-pressed="${i.period===g}">${p()}</button>`).join(""),o=(g,p)=>g.filter($=>$.id!=="other").map($=>{const k=a.guests?Math.round($.guests/a.guests*100):0,u=$.quotes.slice(0,5).map(w=>`
      <blockquote class="q">${w.original&&w.lang!=="en"?`<div class="orig" lang="${d(w.lang)}">“${d(w.original)}”</div><div class="trans">EN: ${d(w.en)}</div>`:`<div class="orig">“${d(w.en)}”</div>`}
      ${w.flagged?`<span class="chip warn" style="margin-top:4px">${n("Angalia","Check")}</span>`:""}</blockquote>`).join("");return`
      <div class="topic-row" style="display:block">
        <div class="row between"><strong>${d(fe($.id))}</strong><span class="badge-num ${p?"neg":""}">${$.guests}</span></div>
        <div class="bar ${p?"neg":""}"><span style="width:${k}%"></span></div>
        <details class="quotes"><summary>${n("Maneno ya wageni","What guests said")} (${$.quotes.length})</summary>${u}</details>
      </div>`}).join(""),r=[];for(const g of t)(g.sentences||[]).forEach((p,$)=>{ye(p)&&r.push([g,$])});const c=aa(a,`${Oe[i.period]()}`,y()),m=b();return`
  ${D()}
  <h1>${n("Muhtasari","Summary")}</h1>
  <div class="row" style="margin-bottom:12px">${l}</div>

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
    <div class="card-title"><h2>${n(`Kwa ${y()}`,`For ${y()}`)}</h2>
      <button class="btn small secondary" data-action="speak">${n("Sikiliza","Listen")}</button></div>
    <div class="big-summary" lang="${m}">${s[m].map(g=>`<p>${d(g)}</p>`).join("")}</div>
    <p class="small muted" style="margin:0">${n("Sentensi hizi zimeandikwa na watu; AI inajaza idadi na mada tu.","Human-written sentences; the AI only fills in counts and topics.")}</p>
  </div>

  ${a.liked.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Walichopenda","What they liked")}</h2>${o(a.liked,!1)}</div>`:""}
  ${a.improve.filter(g=>g.id!=="other").length?`<div class="card"><h2>${n("Wanachotaka kiboreshwe","What they want improved")}</h2>${o(a.improve,!0)}</div>`:""}

  ${a.products.length?`
  <div class="card">
    <h2>${n("Bidhaa walizotaka kununua","Products they wanted to buy")}</h2>
    ${a.products.map(g=>{const p=W.find($=>$.id===g.id);return`<div class="topic-row"><strong>${d(p[m])}</strong><span class="badge-num">${g.guests}</span></div>`}).join("")}
  </div>`:""}

  ${r.length?`
  <div class="card">
    <h2>${n("Zinahitaji kuangaliwa","Needs a human check")}</h2>
    ${r.map(([g,p])=>{var $;return`<div class="small muted" style="margin-top:8px">${d((($=$e(g.guestId))==null?void 0:$.name)||"")} · ${d(S(g.lang,m))}</div>${Ka(g,p,{open:!0})}`}).join("")}
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
    ${i.cloud.queue.length?`<p class="small" style="margin:8px 0 0">⏳ ${n(`Ripoti ${i.cloud.queue.length} inasubiri mtandao.`,`${i.cloud.queue.length} report${i.cloud.queue.length===1?"":"s"} waiting for internet.`)}</p>`:""}
    <a class="btn small secondary block ${i.shareOk?"":"disabled"}" id="report-sms" aria-disabled="${!i.shareOk}" style="margin-top:8px" href="${Y(Ga(),Mt(c,"noor",i.period,a))}">${n("Au tuma ripoti kwa SMS (bila mtandao)","Or send the report by SMS (no internet needed)")}</a>
    ${i.cloud.uploads.length?`<p class="small muted" style="margin:8px 0 0">✓ ${n("Imepakiwa","Uploaded")} ${d(new Date(i.cloud.uploads[i.cloud.uploads.length-1].at).toLocaleString())} · ${n("maoni","entries")} ${i.cloud.uploads[i.cloud.uploads.length-1].entries} → ${d(i.cloud.uploads[i.cloud.uploads.length-1].to)}</p>`:`<p class="small muted" style="margin:8px 0 0">${n("Kupakia kunatuma ripoti hii (jumla tu) kwa kampuni ya utalii na ofisi ya utalii, mtandao ukiwepo.","Uploading sends this report (counts only) to the tour company and the tourism office when there is internet.")}</p>`}
  </div>`}
  `}function Sn(){const e=i.guests.slice().sort((a,t)=>new Date(t.visitDate)-new Date(a.visitDate));return e.length?`
  ${D()}
  <h1>${n("Washukuru wageni","Thank guests")}</h1>
  <p class="small muted">${n("Ujumbe umeandikwa na watu kwa kila lugha. Unatuma wewe, na tu kama mgeni alikubali.","Messages are human-written in each language. You send them yourself, and only if the guest agreed.")}</p>
  <div class="card"><ul class="list">${e.map(a=>{const t=i.entries.filter(o=>o.guestId===a.id).length,s=i.messages.some(o=>o.guestId===a.id&&o.status==="sent"),l=i.openGuest===a.id;return`
      <li>
        <div class="row between">
          <div><strong>${d(a.name)}</strong> ${A(a.language)}${a.synthetic?` <span class="chip plain">${n("mfano","example")}</span>`:""}</div>
          <span class="small muted">${d(K(a.visitDate))}</span>
        </div>
        <div class="row small" style="margin-top:6px">${ln(a)} <span class="muted">${n("maoni","entries")}: ${t}</span>
          ${s?`<span class="chip">${n("Shukrani imetumwa","Thanked")}</span>`:""}</div>
        ${a.referredBy?`<div class="small muted" style="margin-top:4px">${n("Alipendekezwa na","Recommended by")}: ${d(a.referredBy)}</div>`:""}
        <div class="row" style="margin-top:8px">
          <button class="btn small ${l?"":"secondary"}" data-action="toggle-draft" data-id="${a.id}">${n("Ujumbe wa shukrani","Thank-you message")}</button>
          <button class="btn small danger" data-action="delete-guest" data-id="${a.id}">${n("Futa","Delete")}</button>
        </div>
        ${l?xn(a):""}
      </li>`}).join("")}</ul></div>`:`${D()}<h1>${n("Wageni","Guests")}</h1>
      <div class="card"><p>${n("Bado hakuna wageni.","No guests yet.")}</p>
      <button class="btn" data-action="go" data-screen="add">${n("Ongeza maoni","Add feedback")}</button></div>`}function xn(e){const a=Tt(i.entries,e.id),t=ga(e,a,y()),s=e.contact||{},l=ha[t.lang]||ha.en;let o;e.consent?s.email?o=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="mailto:${encodeURIComponent(s.email)}?subject=${encodeURIComponent(l)}&body=${encodeURIComponent(t.text)}">${n("Idhinisha na tuma (barua pepe)","Approve and send (email)")}</a>`:s.phone?o=`<a class="btn block" data-action="mark-sent" data-id="${e.id}" data-lang="${t.lang}" href="${Y(s.phone,t.text)}">${n("Idhinisha na tuma (SMS)","Approve and send (SMS)")}</a>`:o=`<div class="notice small">${n("Hakuna barua pepe wala namba ya simu.","No email or phone number.")}</div>`:o=`<div class="notice warn small">${n("Mgeni hakutoa ruhusa ya kuwasiliana. Usitume.","The guest did not agree to be contacted. Do not send.")}</div>`;const r=b();return`
  <div class="stack" style="margin-top:12px">
    ${t.usedFallback?`<div class="notice warn small">${n(`Hakuna kiolezo cha ${S(e.language,"sw")} bado; tumetumia Kiingereza.`,`No ${S(e.language,"en")} template yet; using English.`)}</div>`:""}
    <div class="card flat" lang="${t.lang}"><div class="small muted">${n(`Kwa ${S(t.lang,"sw")}`,`In ${S(t.lang,"en")}`)}</div><p id="draft-${e.id}" style="margin:6px 0 0">${d(t.text)}</p></div>
    ${t.lang!==r?`<div class="card flat" lang="${r}"><div class="small muted">${n("Maana yake","What it says")}</div><p style="margin:6px 0 0">${d(r==="sw"?t.sw:ga({...e,language:"en"},a,y()).text)}</p></div>`:""}
    <p class="small muted" style="margin:0">${a?n(`Mada aliyopenda: ${fe(a)}`,`Liked topic: ${fe(a)}`):n("Hakuna mada iliyo wazi; ujumbe wa jumla.","No clear liked topic; general message.")}</p>
    ${o}
    <button class="btn small secondary" data-action="copy" data-copy-from="draft-${e.id}">${n("Nakili","Copy")}</button>
  </div>`}function Mn(){const e=V(),a=b(),t=l=>{const o=x[l],r=i.installed.includes(l),c=[];return r&&c.push(`<span class="chip">${n("Imepakuliwa","On phone")}</span>`),e.keep.includes(l)&&c.push(`<span class="chip">${n("Inakaa daima","Kept")}</span>`),e.needed.includes(l)&&c.push(`<span class="chip warn">${n("Wiki ijayo","Needed next week")}</span>`),r&&e.removable.includes(l)&&c.push(`<span class="chip plain">${n("Nadra","Rare")}</span>`),`
      <div class="pack">
        <div><strong>${d(o[a])}</strong> <span class="muted small">${d(o.native)} · ${Ee} MB</span>
          <div class="row" style="margin-top:4px">${c.join("")}</div></div>
        ${r?`<button class="btn small danger" data-action="delete-pack" data-lang="${l}">${n("Futa","Delete")}</button>`:`<button class="btn small" data-action="download-pack" data-lang="${l}" ${i.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`},s=l=>{const o=G[l],r=i.shared[l];return`
      <div class="pack">
        <div><strong>${d(o[a])}</strong> <span class="muted small">${o.mb} MB</span></div>
        ${r?`<span class="chip">${n("Tayari","Ready")}</span>`:`<button class="btn small" data-action="download-shared" data-key="${l}" ${i.online?"":"disabled"}>${n("Pakua","Get")}</button>`}
      </div>`};return`
  ${D()}
  <h1>${n("Lugha","Languages")}</h1>
  <p class="small muted">${n(`Kiswahili na Kiingereza daima, pamoja na lugha ${ca} za wageni wengi. Lugha nyingine zinapakuliwa kabla mgeni hajafika na zinaweza kufutwa baadaye.`,`Swahili and English always, plus the ${ca} most common guest languages. Others are downloaded before a visit and can be deleted afterwards.`)}</p>
  <p class="small muted" id="storage-line"></p>

  <div class="card">
    <h2>${n("Modeli za pamoja","Shared models")}</h2>
    <p class="small muted">${n("Zinapakuliwa mara moja, zinafanya kazi kwa lugha zote, bila mtandao.","Downloaded once, used for every language, work offline.")}</p>
    ${Object.keys(G).map(s).join("")}
  </div>

  <div class="card">
    <h2>${n("Lugha za wageni","Guest languages")}</h2>
    ${e.usedDefaults?`<p class="small muted">${n("Bado hakuna historia: tunaanza na Kiitaliano, Kifaransa na Kijerumani (wageni wengi wa Tanzania, NBS 2024).","No history yet: starting with Italian, French and German (Tanzania’s largest such markets, NBS 2024).")}</p>`:""}
    ${e.recommend.length?`
      <div class="notice small" style="margin-top:4px">${n(`Pakua ukiwa na Wi-Fi: ${e.recommend.map(l=>x[l].sw).join(", ")} (MB ${e.recommendMB}).`,`Download on Wi-Fi: ${e.recommend.map(l=>x[l].en).join(", ")} (${e.recommendMB} MB).`)}
        <button class="btn small block" style="margin-top:8px" data-action="download-recommended" ${i.online?"":"disabled"}>${n("Pakua zinazopendekezwa","Download recommended")}</button>
      </div>`:""}
    ${ht().map(t).join("")}
  </div>`}function jn(){const e=i.translate,a=b(),t=e.lang,s=zn.map(l=>`<li class="row between"><div><strong lang="${t}">${d(l[t]||l.en)}</strong><div class="small muted">${d(l[a]||l.en)}</div></div>
    <button class="say" data-action="say-text" data-lang="${t==="xx"?"en":t}" data-text="${d(l[t]||l.en)}" aria-label="${n("Sema kwa sauti","Say it aloud")}">${Je}</button></li>`).join("");return`
  ${D()}
  <h1>${n("Tafsiri","Translate")}</h1>
  <div class="card">
    <label class="field">${n("Lugha ya mgeni","Guest’s language")}<select id="tr-lang" data-change="tr-lang">${ia(e.lang)}</select></label>
    <p class="small muted" style="margin:10px 0 6px">${n("Mpe mgeni simu, bonyeza, aongee. Utasikia kwa Kiingereza.","Hand the guest the phone, press, let them speak. You hear it in English.")}</p>
    <button class="btn big block ${i.recording?"danger":""}" data-action="translate-record">
      ${i.recording?'<span class="rec-dot"></span>':Fa}<span class="btn-col">${i.recording?n("Simamisha","Stop"):n("Mgeni anaongea","Guest speaks")}</span></button>
    ${e.result?`
    <div class="card flat" style="margin-top:12px">
      <div class="row between"><div class="small muted">${n("Kwa Kiingereza","In English")}</div><button class="say" data-action="say-text" data-lang="en" data-text="${d(e.result)}" aria-label="${n("Sikiliza","Listen")}">${Je}</button></div>
      <p style="margin:6px 0 0">${d(e.result)}</p>
      ${e.text&&e.text!==e.result?`<p class="small muted" style="margin:6px 0 0" lang="${t}">${d(e.text)}</p>`:""}
    </div>`:""}
    <details style="margin-top:12px">
      <summary class="small">${n("Au andika / bandika maandishi","Or type / paste text")}</summary>
      <label class="field" style="margin-top:8px">${n("Mgeni aliandika","What the guest wrote")}<textarea id="tr-text" lang="${t}" placeholder="${n("Andika hapa…","Type or paste here…")}">${d(e.text)}</textarea></label>
      <button class="btn secondary block" style="margin-top:10px" data-action="translate-run">${n("Tafsiri kwa Kiingereza","Translate to English")}</button>
    </details>
    <p class="small muted" style="margin:8px 0 0">${n("Inafanyika kwenye simu hii, bila mtandao. Hakuna tafsiri ya mashine kwenda Kiswahili bado; misemo hapa chini imeandikwa na watu.","Runs on this phone, offline. There is no machine translation into Swahili yet; the phrases below are human-written.")}</p>
  </div>
  <div class="card">
    <h2>${n("Mwambie mgeni","Say to the guest")} <span class="small muted">${d(S(e.lang,a))}</span></h2>
    <p class="small muted">${n("Bonyeza spika: simu inasema kwa lugha ya mgeni.","Press the speaker: the phone says it in the guest’s language.")}</p>
    <ul class="list">${s}</ul>
  </div>`}const zn=[{sw:"Karibu!",en:"Welcome!",it:"Benvenuti!",fr:"Bienvenue !",de:"Willkommen!",zh:"欢迎！",es:"¡Bienvenidos!",pl:"Witamy!"},{sw:"Chakula kiko tayari.",en:"Lunch is ready.",it:"Il pranzo è pronto.",fr:"Le déjeuner est prêt.",de:"Das Mittagessen ist fertig.",zh:"午饭准备好了。",es:"La comida está lista.",pl:"Obiad gotowy."},{sw:"Tafadhali andika maoni yako kwenye kitabu.",en:"Please write your feedback in the book.",it:"Scrivete le vostre impressioni nel libro, per favore.",fr:"Écrivez vos impressions dans le livre, s’il vous plaît.",de:"Bitte schreiben Sie Ihre Eindrücke ins Buch.",zh:"请把您的感想写在留言本上。",es:"Por favor, escriban sus comentarios en el libro.",pl:"Proszę wpisać swoje wrażenia do księgi."},{sw:"Kahawa hii ni ya kupeleka nyumbani.",en:"This coffee is to take home.",it:"Questo caffè è da portare a casa.",fr:"Ce café est à emporter.",de:"Dieser Kaffee ist zum Mitnehmen.",zh:"这包咖啡可以带回家。",es:"Este café es para llevar.",pl:"Ta kawa jest na wynos."},{sw:"Asante kwa kuja. Karibu tena!",en:"Thank you for coming. Welcome back any time!",it:"Grazie per essere venuti. Tornate quando volete!",fr:"Merci d’être venus. Revenez quand vous voulez !",de:"Danke für Ihren Besuch. Kommen Sie gern wieder!",zh:"谢谢光临，欢迎再来！",es:"Gracias por venir. ¡Vuelvan cuando quieran!",pl:"Dziękujemy za wizytę. Zapraszamy ponownie!"},{sw:"Njia ni mbaya; tutawasaidia.",en:"The road is bad; we will help you.",it:"La strada è brutta; vi aiutiamo noi.",fr:"La route est mauvaise ; nous vous aiderons.",de:"Der Weg ist schlecht; wir helfen Ihnen.",zh:"路不好走，我们会帮您。",es:"El camino está mal; les ayudaremos.",pl:"Droga jest zła; pomożemy."}];async function Ln(){var a,t;const e=i.translate;if(e.text=((a=document.getElementById("tr-text"))==null?void 0:a.value)||"",!e.text.trim())return v(n("Andika kitu kwanza","Type something first"));if(e.lang==="en")return e.result=e.text.trim(),h();if(e.lang==="sw")return e.result=n("Hii ni Kiswahili tayari.","This is already Swahili; the host reads it directly."),h();if(!((t=x[e.lang])!=null&&t.mt&&!i.installed.includes(e.lang)&&!await Q([["pack",e.lang]]))){N(n("Inatafsiri","Translating"));try{const s=await Ma(e.text.trim(),e.lang,q);e.result=s.english}catch(s){v(s.message,6e3)}finally{I(),await Z(),h()}}}function In(){const e=i.guests.some(a=>a.synthetic);return`
  ${D()}
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
    <p class="small muted">${n("Video za mandhari: Pexels (leseni ya bure)","Background videos: Pexels, free licence")} — ${d(Yt())}.</p>
    <div class="stack">
      <a class="btn secondary" href="https://github.com/Tristazxy/kitabu-gateway#readme" target="_blank" rel="noopener">${n("Msimbo, vyanzo vya data na mipaka","Code, data sources and limits")}</a>
    </div>
  </div>`}function Qe(){var s;const e=l=>{var o,r;return((r=(o=document.getElementById(l))==null?void 0:o.value)==null?void 0:r.trim())||""},a=!!((s=document.getElementById("c-consent"))!=null&&s.checked),t=e("c-date");return{id:j("bk"),date:C(t||R(new Date,3)),guests:Math.max(1,Number(e("c-guests"))||1),leadName:e("c-name")||"Mgeni",language:e("c-lang")||"en",guide:e("c-guide"),company:"",consent:a,email:a?e("c-email"):""}}function Tn(){const e=i.bookings.filter(c=>c.status==="requested").sort((c,m)=>new Date(c.date)-new Date(m.date)),a=i.bookings.filter(c=>c.status==="confirmed"&&c.source==="visitor").slice(-4),t=(i.hosts||[]).find(c=>c.id==="noor")||{meet:"Materuni village office",phone:""},s=c=>Re(c),l=c=>jt({...c,hostName:`${y()}’s farm`,meet:t.meet}),o=c=>`
    <li>
      <div class="row between"><strong>${d(c.leadName)}</strong><span class="badge-num">${d(c.guests)}</span></div>
      <div class="row small" style="margin-top:6px">${d(K(c.date))} ${A(c.language)}${c.referredBy?`<span class="muted">${n("alipendekezwa na","recommended by")} ${d(c.referredBy)}</span>`:""}${c.consent&&c.email?`<span class="muted">${d(c.email)}</span>`:""}</div>
      ${c.status==="requested"?`<button class="btn small block" style="margin-top:8px" data-action="company-confirm" data-id="${c.id}">${n("Thibitisha: SMS kwa mwenyeji na kwa mgeni","Confirm: SMS to the host and to the tourist")}</button>`:`
        <div class="link-line"><span class="chip">${d(y())}</span><span class="link-arrow">⇄</span><span class="chip plain">${d(c.company||"Ondera Coffee Trails")}</span><span class="link-arrow">⇄</span><span class="chip">${d(c.leadName)}</span></div>
        <div class="small muted" style="margin:6px 0 4px">${n("SMS kwa mwenyeji (Kiswahili)","SMS to the host (Swahili)")}</div>
        <div class="sms small">${d(s(c))}</div>
        <a class="btn small secondary block" style="margin-top:6px" href="${Y(t.phone,s(c))}" data-action="sms-sent" data-id="${c.id}" data-to="host">${n(`Tuma kwa ${y()}`,`Send to ${y()}`)} ${c.smsHost?"✓":""}</a>
        <div class="small muted" style="margin:10px 0 4px">${n("SMS kwa mgeni","SMS to the tourist")} (${d(S(c.language,b()))})</div>
        <div class="sms small">${d(l(c))}</div>
        <a class="btn small secondary block" style="margin-top:6px" href="${Y("",l(c))}" data-action="sms-sent" data-id="${c.id}" data-to="tourist">${n(`Tuma kwa ${d(c.leadName)}`,`Send to ${d(c.leadName)}`)} ${c.smsTourist?"✓":""}</a>`}
    </li>`;return(e.length||a.length?`
  <div class="card">
    <h2>${n("Maombi na miunganisho","Requests and connections")}</h2>
    <p class="small muted">${n("Ombi la mgeni linakuja hapa. Ukithibitisha, wote wawili wanapata SMS: mwenyeji kwa Kiswahili, mgeni kwa lugha yake. Hakuna upande unaohitaji intaneti.","A visitor’s request lands here. When you confirm, both sides get an SMS: the host in Swahili, the tourist in their language. Neither side needs internet.")}</p>
    <ul class="list">${[...e,...a].map(o).join("")}</ul>
  </div>`:"")+Ua(n("Ombi la mgeni au siku za mwenyeji zikija kwa SMS, bandika hapa.","A tourist’s request, a host’s days or a host’s report sent by SMS: paste it here."))+Bn()}function Bn(){const e=i.cloud.uploads.slice(-3).reverse(),a=i.entries.filter(s=>s.source==="visitor"),t=new Set(a.map(s=>s.guestId)).size;return!e.length&&!t?"":`
  <div class="card">
    <h2>${n("Maoni yaliyopokelewa","Feedback received")}</h2>
    ${e.length?e.map(s=>`
      <div class="small muted" style="margin-top:6px">${n("Kutoka kwa mwenyeji","From the host")} ${d(s.host)} · ${d(new Date(s.at).toLocaleDateString())} · ${n("maoni","entries")} ${s.entries}${s.viaSms?` · ${n("kwa SMS","by SMS")}`:""}</div>
      <div class="sms small" style="margin-top:4px">${d(s.report)}</div>`).join(""):`<p class="small muted">${n("Mwenyeji bado hajapakia ripoti.","The host has not uploaded a report yet.")}</p>`}
    ${t?`<p class="small" style="margin:10px 0 0">${n(`Kutoka kwa wageni: watu ${t} waliandika kwenye simu ya mwenyeji (jumla tu, hakuna majina).`,`From tourists: ${t} wrote on the host’s phone (counts only, no names).`)}</p>`:""}
  </div>`}function En(){i.hosts||oa().then(h);const e=We(R(new Date,3)),{s:a}=ie(),t=a.entries?aa(a,n("Mfano","Example"),y()):null;return(i.role==="company"?`<button class="btn small secondary" data-action="switch-role" style="margin-bottom:12px">← ${n("Badilisha upande","Switch side")}</button>`:D())+Tn()+Wt({langOptionsHTML:ia("en"),today:e,sms:Re({date:C(e),guests:2,language:"en",guide:""}),report:t})}const An=e=>String(e||"").replace(/[^\d+]/g,""),Y=(e,a)=>`sms:${An(e)}?body=${encodeURIComponent(a)}`,Ga=()=>((i.hosts||[]).find(e=>e.id==="noor")||{}).companyPhone||"";async function Dn(e){const a=bt(e);if(!a)return v(n("Hakuna msimbo wa WeKaribu kwenye ujumbe huu.","No WeKaribu code found in this message."),4e3);if(a.kind==="BOOK"||a.kind==="REQ"){if(i.bookings.find(o=>o.date.slice(0,10)===a.date&&o.leadName===a.leadName&&o.guests===a.guests))return v(n("Tayari iko kwenye orodha.","Already in the list."));const s=ke(a.hostId)||{},l={id:j("bk"),date:C(a.date),guests:a.guests,leadName:a.leadName,language:a.language,guide:s.guide||"",company:s.company||"",consent:!1,email:"",referredBy:a.referredBy,hostId:a.hostId,status:a.kind==="BOOK"?"confirmed":"requested",source:a.kind==="BOOK"?"sms-company":"visitor",createdAt:new Date().toISOString(),viaSms:!0};await f.put("bookings",l),i.bookings.push(l),v(a.kind==="BOOK"?n("Wageni wameongezwa kwenye ratiba.","Booking added to your reservations."):n("Ombi limeongezwa.","Request added."))}else if(a.kind==="DAYS")i.hostDaysBySms[a.hostId]=a.days,await f.setSetting("hostDaysBySms",i.hostDaysBySms),v(n(`Siku za mwenyeji zimepokelewa: ${a.days.length}.`,`Host days received: ${a.days.length}.`));else if(a.kind==="REPORT"){const t=ke(a.hostId)||{},s={id:j("up"),at:new Date().toISOString(),entries:a.entries,guests:a.guests,to:n("Imepokelewa kwa SMS","Received by SMS"),report:a.report,period:a.period,host:t.name?t.name.split("’")[0]:y(),viaSms:!0};i.cloud.uploads.push(s),await f.setSetting("cloudUploads",i.cloud.uploads),v(n("Ripoti imepokelewa.","Report received."))}h()}function Ua(e){return`
  <div class="card">
    <h2>${n("Umepata SMS ya WeKaribu?","Got a WeKaribu SMS?")}</h2>
    <p class="small muted">${e}</p>
    <label class="field"><span>${n("Bandika ujumbe hapa","Paste the message here")}</span><textarea id="sms-in" rows="3" placeholder="WeKaribu: …"></textarea></label>
    <button class="btn block" data-action="sms-import">${n("Ongeza kutoka SMS","Add from the SMS")}</button>
  </div>`}async function oa(){if(i.hosts)return i.hosts;try{const e=await fetch("data/hosts.json");i.hosts=(await e.json()).hosts}catch{i.hosts=[]}return i.hosts}const ke=e=>(i.hosts||[]).find(a=>a.id===e);let va=null;function la(){i.hosts||oa().then(h);const e=i.hosts||[],a=Ht(i.find.q,e,i.guests,b(),i.find.semantic);return Kt({q:i.find.q,hosts:e,lang:b(),loading:!i.hosts,ranked:a,thinking:i.find.thinking})}async function Cn(e){var a;if(!(!i.shared.topics||!i.hosts||!e.trim())){i.find.thinking=!0;try{const t=[e,...i.hosts.map(r=>`${r.name}. ${r.tags.join(", ")}. ${r.blurb}`)],s=await gt(t),l=s[0],o={};i.hosts.forEach((r,c)=>{const m=s[c+1];let g=0;for(let p=0;p<l.length;p++)g+=l[p]*m[p];o[r.id]=Math.max(0,g)}),i.find.semantic=o}catch{}finally{if(i.find.thinking=!1,i.screen==="find"){const t=(a=document.getElementById("find-q"))==null?void 0:a.selectionStart;h();const s=document.getElementById("find-q");s&&(s.focus(),t!=null&&s.setSelectionRange(t,t))}}}}function Nn(){const e=ke(i.book.hostId);if(!e)return i.screen="find",la();const a=e.id==="noor"?ie().s:null,t=Pt(e,e.id==="noor"&&i.availableDays.length?i.availableDays:i.hostDaysBySms[e.id]),s=(i.book.form.referredBy||"").trim().toLowerCase(),l=s&&e.id==="noor"?i.guests.find(o=>(o.name||"").toLowerCase().split(" ")[0]===s.split(" ")[0]):null;return _t({host:e,days:t,selected:i.book.day,summaryLine:Ft(e,a,b()),form:i.book.form,lang:b(),knownGuest:l})}function On(){const e=ke(i.book.hostId);if(!e||!i.book.done)return i.screen="find",la();i.phrasebook.phrases||Wn();const a=i.book.done;return Gt({host:e,booking:a,lang:b(),phrasebook:i.phrasebook.phrases,saved:i.phrasebook.saved,audioReady:i.phrasebook.audioReady,online:i.online,requestHref:Y(e.companyPhone,St(a,e))})}async function Wn(){try{const e=await fetch("data/phrasebook-sw.json");i.phrasebook.phrases=(await e.json()).phrases,i.phrasebook.saved=await f.getSetting("phrasebookSaved",!1);const a=await we();i.phrasebook.audioReady=!!(a&&i.phrasebook.phrases.every(t=>a.files[t.id]))}catch{i.phrasebook.phrases=[]}i.screen==="booked"&&h()}async function Pn(){N(n("Inapakua misemo","Downloading phrases"));try{if("caches"in window){const e=await caches.open("kitabu-phrases-v1");await e.add("data/phrasebook-sw.json").catch(()=>null);const a=await we();a&&await Promise.all(i.phrasebook.phrases.map(t=>a.files[t.id]?e.add(`audio/sw/${a.files[t.id]}`).catch(()=>null):null))}i.phrasebook.saved=!0,await f.setSetting("phrasebookSaved",!0),v(`✓ ${n("Misemo iko kwenye simu yako","Phrases saved on your phone")}`)}finally{I(),h()}}function ve(){var a;const e=t=>{var s;return((s=document.getElementById(t))==null?void 0:s.value)||""};document.getElementById("bk-v-name")&&(i.book.form={guests:Number(e("bk-v-guests"))||2,language:e("bk-v-lang")||"en",name:e("bk-v-name"),email:e("bk-v-email"),consent:!!((a=document.getElementById("bk-v-consent"))!=null&&a.checked),referredBy:e("bk-v-ref")})}async function Rn(){ve();const e=ke(i.book.hostId),a=i.book.form;if(!i.book.day)return v(n("Chagua siku","Pick a day"));if(!a.name.trim())return v(n("Andika jina lako","Add your name"));const t={id:j("bk"),date:C(i.book.day),guests:Math.max(1,a.guests),leadName:a.name.trim(),language:a.language,guide:e.guide,company:e.company,consent:a.consent,email:a.consent?a.email.trim():"",referredBy:a.referredBy.trim(),hostId:e.id,status:"requested",source:"visitor",createdAt:new Date().toISOString()};await f.put("bookings",t),i.bookings.push(t),i.book.done=t,L("booked")}function qn(){const e=a=>{var t;return((t=document.getElementById(a))==null?void 0:t.value)||""};document.getElementById("v-liked")&&(i.visitor.draft={name:e("v-name"),liked:e("v-liked"),improve:e("v-improve"),email:e("v-email")})}async function Hn(){var g,p,$;const e=k=>{var u,w;return((w=(u=document.getElementById(k))==null?void 0:u.value)==null?void 0:w.trim())||""},a=i.visitor.lang,t=Ea(a),s=e("v-liked"),l=e("v-improve");if(!s&&!l){v(t.needText);return}const o=!!((g=document.getElementById("v-consent"))!=null&&g.checked),r=[(p=document.getElementById("v-buy-coffee"))!=null&&p.checked?"coffee":null,($=document.getElementById("v-buy-souvenir"))!=null&&$.checked?"souvenir":null].filter(Boolean),c={id:j("g"),name:e("v-name")||"Mgeni",language:a,visitDate:C(new Date),consent:o,contact:o?{email:e("v-email"),phone:""}:null,source:"visitor",createdAt:new Date().toISOString()};await f.put("guests",c);let m=!0;for(const[k,u]of[["liked",s],["improve",l]])u&&(await f.put("entries",{id:j("fb"),guestId:c.id,lang:a,source:"visitor",box:k,original:u,status:"pending",sentences:[],products:[],declaredProducts:m?r:[],visitDate:c.visitDate,createdAt:new Date().toISOString()}),m=!1);await J(),i.visitor={lang:a,saved:!0,draft:{}},h(),window.scrollTo(0,0)}let T=null,B=null;function ra(){var a;if(T||(T=document.createElement("div"),T.className="guide-backdrop hidden",T.setAttribute("role","dialog"),T.setAttribute("aria-modal","true"),T.setAttribute("aria-labelledby","guide-title"),document.body.appendChild(T),B=document.createElement("div"),B.className="spot hidden",B.innerHTML='<span class="spot-hand">👆</span>',document.body.appendChild(B)),T.classList.toggle("hidden",!i.guide.open),!i.guide.open){T.innerHTML="",B.classList.add("hidden");return}T.innerHTML=Dt(i.guide.step),(a=T.querySelector('[data-action="guide-next"], [data-action="guide-try"]'))==null||a.focus();const e=_[i.guide.step].target&&document.querySelector(_[i.guide.step].target);e?(e.scrollIntoView({block:"start",behavior:"smooth"}),setTimeout(()=>{const t=e.getBoundingClientRect();B.style.left=`${t.left-6}px`,B.style.top=`${t.top-6}px`,B.style.width=`${t.width+12}px`,B.style.height=`${t.height+12}px`,B.classList.remove("hidden")},350)):B.classList.add("hidden")}function Be(e=0){i.guide={open:!0,step:e},ra()}async function Ke(){i.guide.open=!1,ra(),await f.setSetting("guideSeen",!0)}async function Kn(){await Ke();const e="demo_quick";if(!$e(e)){const a={id:e,name:"Emma (mfano)",language:"en",visitDate:C(R(new Date,-1)),consent:!0,contact:{email:"emma@example.com",phone:""},createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",a);const t={liked:"Roasting and grinding the coffee with the family was the best part of our trip. The lunch was delicious.",improve:"The road to the farm was hard to find. I wanted to buy a bag of coffee to take home, but there was none for sale."};for(const s of["liked","improve"])await f.put("entries",{id:`${e}_${s}`,guestId:e,lang:"en",source:"typed",box:s,original:t[s],status:"pending",sentences:[],products:[],visitDate:a.visitDate,createdAt:new Date().toISOString(),synthetic:!0});await J()}i.period="all",i.screen="home",h(),await Za()}const Fn={choose:Nt,home:kn,add:wn,summary:bn,guests:Sn,week:yn,langs:Mn,more:In,company:En,translate:jn,find:la,host:Nn,booked:On,visitor:()=>Ot(i.visitor.lang,i.visitor.saved,i.visitor.draft)};let ba=null;function Va(){const e=document.getElementById("motion-btn");if(!e)return;const a=Zt(),t=a?'<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><rect x="1" y="1" width="3.5" height="10" rx="1" fill="currentColor"/><rect x="7.5" y="1" width="3.5" height="10" rx="1" fill="currentColor"/></svg>':'<svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1.2v9.6L10.5 6z" fill="currentColor"/></svg>';e.innerHTML=`${t} Video`,e.setAttribute("aria-pressed",String(!a)),e.setAttribute("aria-label",a?n("Simamisha mandhari inayosogea","Stop the moving background"):n("Cheza mandhari inayosogea","Play the moving background")),e.title=e.getAttribute("aria-label")}function h(){const e=i.screen;document.body.classList.toggle("mode-visitor",e==="visitor"||e==="choose"),document.body.classList.toggle("mode-choose",e==="choose"),document.body.classList.toggle("home",e==="home");const a=e!==ba;ba=e,de.innerHTML=Fn[e]()+(document.getElementById("nature").classList.contains("real")?`<div class="credit">${d(Na(ge()))}</div>`:""),Va(),de.classList.remove("enter"),a&&(de.offsetWidth,de.classList.add("enter")),document.getElementById("net").textContent=i.online?n("Mtandaoni","Online"):n("Nje ya mtandao","Offline");const t=document.getElementById("lang-btn");t&&(t.textContent=b()==="sw"?"English":"Kiswahili"),i.guide.open&&ra(),e==="langs"&&lt().then(s=>{const l=document.getElementById("storage-line");l&&s&&(l.textContent=n(`Nafasi iliyotumika: MB ${s.usedMB} kati ya MB ${s.quotaMB}`,`Storage used: ${s.usedMB} MB of ${s.quotaMB} MB`))})}function L(e){i.screen=e,e!=="add"&&(i.add=U()),h(),window.scrollTo(0,0)}async function Q(e){if(!e.length)return!0;const a=e.reduce((s,[l,o])=>s+(l==="pack"?Ee:G[o].mb),0);if(!navigator.onLine)return v(n("Hakuna mtandao. Pakua lugha msaidizi akiwa na mtandao.","Offline. Download packs when the helper has internet."),6e3),!1;const t=e.map(([s,l])=>s==="pack"?S(l,b()):G[l][b()]).join(", ");if(!confirm(n(`Pakua mara moja: takriban MB ${a} (${t}). Endelea?`,`One-time download of about ${a} MB (${t}). Continue?`)))return!1;for(const[s,l]of e)N(n("Inapakua","Downloading")+` · ${s==="pack"?S(l,b()):G[l][b()]}`),s==="pack"?await rt(l,q):await dt(l,q);return I(),await Z(),!0}async function Ge(e){const a=e.filter(t=>{var s;return((s=x[t])==null?void 0:s.mt)&&!i.installed.includes(t)}).map(t=>["pack",t]);await Q(a)&&(v(n("Lugha ziko tayari","Packs ready")),h())}async function Sa(e){if(!e.length)return;const a=e.map(t=>S(t,b())).join(", ");if(confirm(n(`Futa ${a}? Zinaweza kupakuliwa tena baadaye.`,`Delete ${a}? They can be downloaded again later.`))){for(const t of e)await ct(x[t].mt);await Z(),v(n("Imefutwa","Deleted")),h()}}async function _n(){if(!navigator.onLine)return v(n("Hakuna mtandao","Offline"));N(n("Inapokea ratiba","Receiving the schedule"));const a=await(await fetch("data/bookings.json",{cache:"no-store"})).json(),t=new Date,s=a.bookings.map(o=>({id:o.id,date:C(R(t,o.dayOffset)),guests:o.guests,leadName:o.leadName,language:o.language,guide:o.guide,company:a.company,consent:!!o.consent,email:o.consent&&o.email||"",synthetic:!0}));await f.putMany("bookings",s),i.bookings=await f.all("bookings"),i.lastSync=new Date().toISOString(),await f.setSetting("lastSync",i.lastSync),I();const l=V();v(l.download.length?n(`Ratiba imepokelewa. Pakua: ${l.download.map(o=>x[o].sw).join(", ")}`,`Schedule received. Download: ${l.download.map(o=>x[o].en).join(", ")}`):n("Ratiba imepokelewa","Schedule received")),h()}async function Gn(){const e=l=>{var o,r;return((r=(o=document.getElementById(l))==null?void 0:o.value)==null?void 0:r.trim())||""},a=e("bk-date");if(!a)return v(n("Weka tarehe","Add a date"));const t=document.getElementById("bk-consent").checked,s={id:j("bk"),date:C(a),guests:Math.max(1,Number(e("bk-guests"))||1),leadName:e("bk-name")||"Mgeni",language:e("bk-lang")||"en",guide:e("bk-guide"),company:"",consent:t,email:t?e("bk-email"):""};await f.put("bookings",s),i.bookings.push(s),v(n("Imehifadhiwa","Saved")),h()}async function Un(e){const a=i.bookings.find(s=>s.id===e);if(!a)return;let t=i.guests.find(s=>s.bookingId===a.id);t||(t={id:j("g"),name:a.leadName||"Mgeni",language:a.language,visitDate:a.date,consent:!!a.consent,contact:a.consent?{email:a.email||"",phone:""}:null,bookingId:a.id,groupSize:a.guests,createdAt:new Date().toISOString(),synthetic:!!a.synthetic},await f.put("guests",t),i.guests.push(t)),i.add=U(),i.add.guestId=t.id,i.add.step=2,h()}async function Vn(){const e=s=>{var l,o;return((o=(l=document.getElementById(s))==null?void 0:l.value)==null?void 0:o.trim())||""},a=document.getElementById("ng-consent").checked,t={id:j("g"),name:e("ng-name")||"Mgeni",language:e("ng-lang")||"en",visitDate:C(e("ng-date")||new Date),consent:a,contact:a?{email:e("ng-email"),phone:e("ng-phone")}:null,referredBy:e("ng-ref"),createdAt:new Date().toISOString()};await f.put("guests",t),i.guests.push(t),i.add=U(),i.add.guestId=t.id,i.add.step=2,h(),window.scrollTo(0,0)}async function Yn(e,a){const t=se(),s={id:j("in"),source:"photo",box:a,text:"",status:"working",imageURL:URL.createObjectURL(e),lowWords:[]};i.add.inputs.push(s),h();try{N(n("Inasoma picha","Reading the photo"));const l=await it(e,t.language,q);Object.assign(s,{text:l.text,lowWords:l.lowWords,confidence:l.confidence,status:"ready"}),l.text||(s.status="error",s.error=n("Hakuna maandishi yaliyopatikana. Jaribu picha ya karibu zaidi na yenye mwanga.","No text found. Try a closer, brighter photo."));const o=await ot(l.text);o&&o!==t.language&&(s.langHint=o)}catch(l){s.status="error",s.error=l.message}finally{I(),h()}}async function Ya(e){const a=se();if(!i.shared.voice&&!await Q([["shared","voice"]]))return;const t={id:j("in"),source:"voice",box:"unknown",text:"",english:"",status:"working",audioURL:URL.createObjectURL(e)};i.add.inputs.push(t),h();try{N(n("Inasikiliza","Listening"));const s=await za(e,a.language,q);Object.assign(t,{text:s.original,english:s.english,status:"ready"}),i.shared.voice=!0}catch(s){t.status="error",t.error=s.message}finally{I(),h()}}let ze=null;async function Jn(){return Ja(Ya)}async function Zn(e){const a=i.translate;if(!(!i.shared.voice&&!await Q([["shared","voice"]]))){N(n("Inasikiliza","Listening"));try{const t=await za(e,a.lang,q);a.text=t.original||"",a.result=t.english||t.original||"",i.shared.voice=!0,I(),h(),a.result&&ce(a.result,"en")}catch(t){v(t.message,6e3)}finally{I(),await Z(),h()}}}async function Ja(e){var l;if(ze){ze.stop();return}if(!((l=navigator.mediaDevices)!=null&&l.getUserMedia)||!window.MediaRecorder){v(n("Simu hii haiwezi kurekodi hapa. Pakia faili la sauti.","Recording is not supported here. Upload an audio file."),5e3);return}const a=await navigator.mediaDevices.getUserMedia({audio:!0}),t=[],s=new MediaRecorder(a);s.ondataavailable=o=>{o.data.size&&t.push(o.data)},s.onstop=()=>{a.getTracks().forEach(r=>r.stop()),ze=null,i.recording=!1;const o=new Blob(t,{type:s.mimeType||"audio/webm"});h(),e(o).catch(r=>v(r.message))},s.start(),ze=s,i.recording=!0,h()}async function Qn(){var l;const e=se(),a=i.add.inputs.filter(o=>o.status==="ready"&&(o.text||"").trim());if(!a.length)return;const t=[];if(e.language!=="sw"){i.shared.topics||t.push(["shared","topics"]),i.shared.mood||t.push(["shared","mood"]);const o=a.some(r=>!(r.source==="voice"&&r.english));(l=x[e.language])!=null&&l.mt&&o&&!i.installed.includes(e.language)&&t.push(["pack",e.language])}if(!await Q(t))return;const s=[];for(const[o,r]of a.entries()){N(`${n("Inachanganua","Analysing")} ${o+1}/${a.length}`);const c=r.source==="voice"&&e.language!=="en"&&e.language!=="sw"?r.english:void 0,m=await Ia({original:r.text.trim(),lang:e.language,box:r.box,english:c},q),g={id:j("fb"),guestId:e.id,lang:e.language,source:r.source,box:r.box,original:r.text.trim(),...m,lowWords:r.lowWords||[],ocrConfidence:r.confidence??null,visitDate:e.visitDate,createdAt:new Date().toISOString()};await f.put("entries",g),i.entries.push(g),s.push(g.id)}I();for(const o of i.add.inputs)o.imageURL&&URL.revokeObjectURL(o.imageURL),o.audioURL&&URL.revokeObjectURL(o.audioURL);i.add.inputs=[],i.add.results=s,i.add.step=3,await Z(),h(),window.scrollTo(0,0)}async function Za(){var s;const e=i.entries.filter(l=>l.status==="pending"),a=[...new Set(e.map(l=>l.lang))],t=[];a.some(l=>l!=="sw")&&(i.shared.topics||t.push(["shared","topics"]),i.shared.mood||t.push(["shared","mood"]));for(const l of a)(s=x[l])!=null&&s.mt&&!i.installed.includes(l)&&t.push(["pack",l]);if(await Q(t)){for(const[l,o]of e.entries()){N(`${n("Inachanganua","Analysing")} ${l+1}/${e.length}`);const r=await Ia({original:o.original,lang:o.lang,box:o.box},q);Object.assign(o,r),await f.put("entries",o)}I(),await Z(),v(`✓ ${n("Imekamilika","Done")}`),h()}}async function me(e){await f.put("entries",e),h()}function Xe(e){const a=i.entries.find(t=>t.id===e.dataset.entry);return a?[a,a.sentences[Number(e.dataset.idx)]]:[null,null]}async function Xn(){const a=await(await fetch("data/demo.json")).json(),t=new Date;for(const s of a.guests){const l={id:s.id,name:s.name,language:s.language,visitDate:C(R(t,s.dayOffset)),consent:s.consent,contact:s.consent?{email:s.email||"",phone:""}:null,createdAt:new Date().toISOString(),synthetic:!0};await f.put("guests",l);for(const o of["liked","improve"])s[o]&&await f.put("entries",{id:`${s.id}_${o}`,guestId:s.id,lang:s.language,source:"typed",box:o,original:s[o],status:"pending",sentences:[],products:[],visitDate:l.visitDate,createdAt:new Date().toISOString(),synthetic:!0})}await J(),i.period="all",L("home"),v(n("Data ya mfano imepakiwa. Bonyeza “Changanua sasa”.","Example data loaded. Tap “Analyse now”."),5e3)}async function es(){for(const e of i.guests.filter(a=>a.synthetic))await f.del("guests",e.id);for(const e of i.entries.filter(a=>a.synthetic||a.id.startsWith("demo_")))await f.del("entries",e.id);for(const e of i.bookings.filter(a=>a.synthetic))await f.del("bookings",e.id);await J(),v(n("Imeondolewa","Removed")),h()}async function as(e){const a=$e(e);if(!(!a||!confirm(n(`Futa ${a.name} na maoni yake yote?`,`Delete ${a.name} and all their feedback?`)))){await f.del("guests",e);for(const t of i.entries.filter(s=>s.guestId===e))await f.del("entries",t.id);for(const t of i.messages.filter(s=>s.guestId===e))await f.del("messages",t.id);await J(),h()}}async function ts(){if(!i.shareOk)return;const{s:e}=ie(),a=aa(e,`${Oe[i.period]()}`,y()),t={id:j("up"),at:new Date().toISOString(),entries:e.entries,guests:e.guests,to:"Ondera Coffee Trails · "+n("Ofisi ya utalii","Tourism office"),report:a,period:i.period,host:y()};if(!navigator.onLine)return i.cloud.queue.push(t),await f.setSetting("cloudQueue",i.cloud.queue),v(n("Hakuna mtandao. Ripoti imehifadhiwa na itapakiwa yenyewe mtandao ukirudi.","Offline. The report is saved and will upload by itself when internet returns."),5e3),h();N(n("Inapakia kwenye wingu","Uploading to the cloud")),await new Promise(s=>setTimeout(s,900)),i.cloud.uploads.push(t),await f.setSetting("cloudUploads",i.cloud.uploads),I(),v(`✓ ${n("Imepakiwa","Uploaded")}`),h()}async function Qa(){if(!navigator.onLine||!i.cloud.queue.length)return;const e=i.cloud.queue.splice(0);for(const a of e)i.cloud.uploads.push({...a,at:new Date().toISOString(),queuedAt:a.at});await f.setSetting("cloudUploads",i.cloud.uploads),await f.setSetting("cloudQueue",i.cloud.queue),v(`✓ ${n(`Ripoti ${e.length} imepakiwa sasa.`,`${e.length} saved report${e.length===1?"":"s"} uploaded now.`)}`),h()}async function ns(){var a;if(!i.shareOk)return;const e=((a=document.getElementById("report-text"))==null?void 0:a.textContent)||"";if(navigator.share)try{await navigator.share({title:"Ripoti ya maoni",text:e})}catch{}else await Ve(e)}async function ss(){const{s:e,text:a}=ie(),t=b();t==="sw"&&await Ta(Bt(e))||ce(a[t].join(" "),t)}async function is(e="home"){i.visitor={lang:Aa(),saved:!1,draft:{}},await f.setSetting("kiosk",e),L("visitor")}async function os(e){if(i.role=e,await f.setSetting("role",e),e==="visitor")return i.book={hostId:null,day:null,form:{},done:null},L("find");L(e==="company"?"company":"home"),e==="host"&&!await f.getSetting("guideSeen",!1)&&Be(0)}const ls={say:e=>fa(e.dataset.clip,b()==="sw"?e.dataset.sw:e.dataset.en,b(),ce),"choose-role":e=>os(e.dataset.role),"open-host":e=>{i.book={hostId:e.dataset.id,day:null,form:{},done:null},L("host")},"download-phrasebook":Pn,"translate-run":Ln,"copy-text":e=>Ve(e.dataset.text||""),"cloud-upload":ts,"sms-import":()=>{var e;return Dn(((e=document.getElementById("sms-in"))==null?void 0:e.value)||"")},"translate-record":()=>Ja(Zn),"say-text":e=>ce(e.dataset.text,e.dataset.lang||"en"),"say-phrase":e=>fa(e.dataset.clip,e.dataset.text,"sw",ce),"book-day":e=>{ve(),i.book.day=e.dataset.day,h()},"book-submit":Rn,"toggle-day":async e=>{const a=e.dataset.day;i.availableDays=i.availableDays.includes(a)?i.availableDays.filter(t=>t!==a):[...i.availableDays,a].sort(),await f.setSetting("availableDays",i.availableDays),h()},"company-confirm":async e=>{const a=i.bookings.find(t=>t.id===e.dataset.id);a&&(a.status="confirmed",a.confirmedAt=new Date().toISOString(),await f.put("bookings",a),v(n("Imethibitishwa. SMS mbili ziko tayari.","Confirmed. Two SMS are ready: host and tourist.")),h())},"sms-sent":async e=>{const a=i.bookings.find(t=>t.id===e.dataset.id);a&&(e.dataset.to==="host"?a.smsHost=new Date().toISOString():a.smsTourist=new Date().toISOString(),await f.put("bookings",a),setTimeout(h,400))},"switch-role":async()=>{i.role=null,await f.setSetting("role",null),L("choose")},back:()=>L("home"),go:e=>L(e.dataset.screen),"toggle-lang":async()=>{ja(b()==="sw"?"en":"sw"),await f.setSetting("lang",b()),h()},"toggle-motion":()=>{nn(),Va()},"hand-to-guest":()=>is(i.screen==="find"?"choose":"home"),"visitor-lang":e=>{qn(),i.visitor.lang=e.dataset.lang,h()},"visitor-save":Hn,"visitor-next":()=>{i.visitor={lang:Aa(),saved:!1,draft:{}},h(),window.scrollTo(0,0)},"visitor-exit":async()=>{const e=await f.getSetting("kiosk","home");e==="home"&&!confirm(n(`Kwa ${y()} tu: rudi nyumbani?`,`${y()} only: back to the home screen?`))||(await f.setSetting("kiosk",!1),L(e==="choose"?"find":"home"))},"company-sms":()=>{var t,s;const e=Qe(),a=((s=(t=document.getElementById("c-phone"))==null?void 0:t.value)==null?void 0:s.trim())||"";if(!a){v(n(`Weka namba ya simu ya ${y()}`,`Add ${y()}’s phone number`));return}window.location.href=Y(a,Re(e))},"company-save":async()=>{const e=Qe();await f.put("bookings",e),i.bookings.push(e),v(n("Imehifadhiwa kwenye ratiba ya simu hii","Saved to this phone’s schedule"))},"toggle-big":async()=>{const e=!document.documentElement.classList.contains("big-text");document.documentElement.classList.toggle("big-text",e),await f.setSetting("bigText",e),h()},"save-host":async()=>{var e;Ue((e=document.getElementById("host-name"))==null?void 0:e.value),await f.setSetting("hostName",y()),v(n(`Jina: ${y()}`,`Name: ${y()}`)),h()},"guide-open":()=>Be(0),"guide-next":()=>Be(Math.min(i.guide.step+1,_.length-1)),"guide-prev":()=>Be(Math.max(i.guide.step-1,0)),"guide-close":Ke,"guide-try":Kn,sync:_n,"add-booking":Gn,"download-pack":e=>Ge([e.dataset.lang]),"download-suggested":()=>Ge(V().download),"download-recommended":()=>Ge(V().recommend),"delete-pack":e=>Sa([e.dataset.lang]),"delete-removable":()=>Sa(V().removable),"download-shared":async e=>{await Q([["shared",e.dataset.key]])&&h()},"pick-booking":e=>Un(e.dataset.id),"pick-guest":e=>{i.add=U(),i.add.guestId=e.dataset.id,i.add.step=2,h(),window.scrollTo(0,0)},"save-new-guest":Vn,"change-guest":()=>{i.add.step=1,h()},"add-typed":()=>{i.add.inputs.push({id:j("in"),source:"typed",box:"liked",text:"",status:"ready"}),h()},record:Jn,"remove-input":e=>{i.add.inputs=i.add.inputs.filter(a=>a.id!==e.dataset.id),h()},"use-hint":async e=>{const a=se();a.language=e.dataset.lang,await f.put("guests",a),i.add.inputs.forEach(t=>{t.langHint=null}),v(`${n("Lugha","Language")}: ${S(a.language,b())}`),h()},"run-analysis":Qn,"finish-add":()=>L("summary"),"more-feedback":()=>{const e=i.add.guestId;i.add=U(),i.add.guestId=e,i.add.step=2,h(),window.scrollTo(0,0)},"fix-mood":async e=>{const[a,t]=Xe(e);t&&(t.sentiment=e.dataset.mood,t.flags=(t.flags||[]).filter(s=>s==="topic-unsure"&&t.topic==="other"),t.confirmed=t.topic!=="other",await me(a))},"confirm-sent":async e=>{const[a,t]=Xe(e);t&&(t.confirmed=!0,t.flags=[],await me(a))},"sw-mood":async e=>{var s;const a=i.entries.find(l=>l.id===e.dataset.entry);if(!a)return;const t=((s=a.sentences)==null?void 0:s[0])||{en:"",original:a.original,topic:"other",flags:[],confirmed:!0,tagged:"human"};t.sentiment=e.dataset.mood,a.sentences=[t],await me(a)},period:e=>{i.period=e.dataset.period,h()},speak:ss,"analyze-pending":Za,share:ns,"toggle-draft":e=>{i.openGuest=i.openGuest===e.dataset.id?null:e.dataset.id,h()},"mark-sent":async e=>{const a={id:j("msg"),guestId:e.dataset.id,lang:e.dataset.lang,status:"sent",at:new Date().toISOString()};await f.put("messages",a),i.messages.push(a),setTimeout(h,400)},copy:e=>{var a;return Ve(((a=document.getElementById(e.dataset.copyFrom))==null?void 0:a.textContent)||"")},"delete-guest":e=>as(e.dataset.id),"load-demo":Xn,"remove-demo":es,wipe:async()=>{if(!confirm(n("Futa data YOTE kwenye simu hii? Haiwezi kurudishwa.","Delete ALL data on this phone? This cannot be undone.")))return;const e=b();await f.wipeAll(),await f.setSetting("lang",e),await J(),i.add=U(),Ue("Noor"),v(n("Data yote imefutwa","All data deleted")),L("choose")}},rs={"company-preview":()=>{const e=document.getElementById("c-sms");e&&(e.textContent=Re(Qe()))},"company-consent":e=>{var a;return(a=document.getElementById("c-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"tr-lang":e=>{var a;i.translate.lang=e.value,i.translate.result="",i.translate.text=((a=document.getElementById("tr-text"))==null?void 0:a.value)||"",h()},"consent-toggle":e=>{var a;return(a=document.getElementById("contact-fields"))==null?void 0:a.classList.toggle("hidden",!e.checked)},"bk-consent-toggle":e=>{var a;return(a=document.getElementById("bk-email-wrap"))==null?void 0:a.classList.toggle("hidden",!e.checked)},box:e=>{const a=i.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.box=e.value)},"fix-topic":async e=>{const[a,t]=Xe(e);t&&(t.topic=e.value,t.flags=(t.flags||[]).filter(s=>s!=="topic-unsure"),t.confirmed=t.topic!=="other"&&t.sentiment!=="unsure",await me(a))},"sw-topic":async e=>{var s;const a=i.entries.find(l=>l.id===e.dataset.entry);if(!a||!e.value)return;const t=((s=a.sentences)==null?void 0:s[0])||{en:"",original:a.original,sentiment:"unsure",flags:[],confirmed:!0,tagged:"human"};t.topic=e.value,a.sentences=[t],await me(a)},"share-ok":e=>{i.shareOk=e.checked;const a=document.getElementById("share-btn");a&&(a.disabled=!e.checked);const t=document.getElementById("cloud-btn");t&&(t.disabled=!e.checked);const s=document.getElementById("report-sms");s&&(s.classList.toggle("disabled",!e.checked),s.setAttribute("aria-disabled",String(!e.checked)))}};let Le=null;const ds={"input-text":e=>{const a=i.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.text=e.value),cs()},"input-english":e=>{const a=i.add.inputs.find(t=>t.id===e.dataset.id);a&&(a.english=e.value)},"find-q":e=>{i.find.q=e.value,i.find.semantic=null,clearTimeout(Le),Le=setTimeout(()=>{const a=e.selectionStart;h();const t=document.getElementById("find-q");t&&(t.focus(),t.setSelectionRange(a,a))},250),clearTimeout(va),va=setTimeout(()=>Cn(e.value),900)},"bk-v-ref":e=>{clearTimeout(Le),Le=setTimeout(()=>{ve(),h();const a=document.getElementById("bk-v-ref");a&&(a.focus(),a.setSelectionRange(a.value.length,a.value.length))},400)}};function cs(){const e=document.querySelector('[data-action="run-analysis"]');if(!e)return;const a=i.add.inputs.some(s=>s.status==="ready"&&(s.text||"").trim()),t=i.add.inputs.some(s=>s.status==="working");e.disabled=!(a&&!t)}document.addEventListener("click",e=>{const a=e.target.closest("[data-action]");if(!a)return;const t=ls[a.dataset.action];t&&(a.tagName==="BUTTON"&&e.preventDefault(),navigator.vibrate&&navigator.vibrate(8),i.guide.open&&a.dataset.action!=="say"&&!a.closest(".guide-card")&&Ke(),Promise.resolve(t(a,e)).catch(s=>{console.error(s),I(),v(`${n("Hitilafu","Error")}: ${s.message}`,6e3)}))});document.addEventListener("change",e=>{var s;const a=e.target;if(a.matches("input[type=file][data-file]")){const l=(s=a.files)==null?void 0:s[0];if(a.value="",!l)return;const o=a.dataset.file;(o==="audio"?Ya(l):Yn(l,o==="photo-liked"?"liked":"improve")).catch(c=>{I(),v(c.message,6e3)});return}const t=rs[a.dataset.change];t&&Promise.resolve(t(a)).catch(l=>v(l.message,6e3))});document.addEventListener("input",e=>{var t;const a=ds[(t=e.target.dataset)==null?void 0:t.input];a&&a(e.target)});document.addEventListener("keydown",e=>{e.key==="Escape"&&i.guide.open&&Ke()});window.addEventListener("online",()=>{i.online=!0,ve(),h(),Qa()});window.addEventListener("offline",()=>{i.online=!1,ve(),h()});async function us(){if(!("caches"in window))return;const e=await caches.open("kitabu-shell-v3"),a=await caches.open("kitabu-libs-v1"),t=new Set([new URL("index.html",location.href).href]);for(const s of performance.getEntriesByType("resource"))t.add(s.name);await Promise.all([...t].map(async s=>{try{const l=new URL(s);if(l.pathname.endsWith("/data/bookings.json"))return;const o=l.origin===location.origin?e:l.hostname==="cdn.jsdelivr.net"?a:null;o&&!await o.match(s)&&await o.add(s)}catch{}}))}async function ms(){const e=await f.getSetting("lang",null);return e||((navigator.languages||[navigator.language||"en"]).some(t=>String(t).toLowerCase().startsWith("sw"))?"sw":"en")}async function ps(){ja(await ms()),await J(),i.screen="choose",sn(document.getElementById("nature")),h(),await Z(),h(),Qa(),"serviceWorker"in navigator&&navigator.serviceWorker.register("sw.js").then(()=>navigator.serviceWorker.ready).then(us).catch(e=>console.warn("Offline cache not available",e)),"speechSynthesis"in window&&speechSynthesis.getVoices(),we().then(e=>{e&&navigator.onLine&&At()})}ps().catch(e=>{console.error(e),de.innerHTML=`<div class="notice neg"><strong>${n("Hitilafu","Error")}</strong>${d(e.message)}</div>`});
