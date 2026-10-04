import{T as v,M as y,h as l,L as k,t as g,s as b,c as T,p as w,a as A,b as f,d as x}from"./ui-CMgT3-_c.js";function O(e,s){let t=0,o=0,n=0,i=0,r=0;const c=[];e.forEach((a,h)=>{const u=s[h].topic;if(a.topic==="other"){i++,u==="other"?r++:c.push({text:a.text,gold:a.topic,pred:u,score:s[h].score});return}t++,u!=="other"&&(o++,u===a.topic?n++:c.push({text:a.text,gold:a.topic,pred:u,score:s[h].score}))});const d=(a,h)=>h?Number((a/h*100).toFixed(1)):null;return{n:e.length,accuracy:d(n,t),precisionWhenAnswered:d(n,o),coverage:d(o,t),abstainOnOther:d(r,i),errors:c}}function E(e,s,t){let o=0,n=0,i=0;const r=[];e.forEach((d,a)=>{if(!d.mood)return;o++;const h=s[a];h.score<t||(n++,h.label===d.mood?i++:r.push({text:d.text,gold:d.mood,pred:h.label,score:h.score}))});const c=(d,a)=>a?Number((d/a*100).toFixed(1)):null;return{n:o,accuracy:c(i,o),precisionWhenAnswered:c(i,n),coverage:c(n,o),errors:r}}const L=document.getElementById("eval"),p=e=>e==null?"—":`${e}%`;function j(e){return e!=null&&e.length?`<ul class="small" style="padding-left:18px">${e.slice(0,12).map(s=>`<li>“${l(s.text)}” — expected <b>${l(g(s.gold).en||s.gold)}</b>, got <b>${l(g(s.pred).en||s.pred)}</b>${s.score!==void 0?` (${s.score})`:""}</li>`).join("")}</ul>`:'<p class="small muted">No errors.</p>'}function $(e,s){const t=s||e,o=(e==null?void 0:e.translation)||{},n=e==null?void 0:e.flores;L.innerHTML=`
  <h1>Accuracy check <span class="en">Jaribio la usahihi</span></h1>
  <div class="notice">
    <strong>What is measured</strong>
    The same code the app runs on the phone. Topic sorting and sentiment are scored on a <b>synthetic</b> labeled set written by the team
    (not real guests, so scores may be optimistic). Translation packs are also scored on <b>FLORES-200</b>, a published benchmark.
    When the model is below its confidence threshold the app says “not sure — ask a person” instead of guessing; “answered” shows how often that did not happen.
  </div>

  ${t?`
  <div class="card">
    <h2>Topic sorting <span class="en">${l(t===s?"run in this browser":`automatic run · ${new Date(e.generated).toLocaleString()}`)}</span></h2>
    <dl class="kv">
      <dt>Items</dt><dd>${t.topics.n}</dd>
      <dt>Accuracy</dt><dd><b>${p(t.topics.accuracy)}</b></dd>
      <dt>Precision when answered</dt><dd>${p(t.topics.precisionWhenAnswered)}</dd>
      <dt>Answered (not “not sure”)</dt><dd>${p(t.topics.coverage)}</dd>
      <dt>Said “not sure” on off-topic text</dt><dd>${p(t.topics.abstainOnOther)}</dd>
      <dt>Threshold</dt><dd>similarity ≥ ${v}</dd>
    </dl>
    <details class="quotes"><summary>Mistakes</summary>${j(t.topics.errors)}</details>
  </div>
  <div class="card">
    <h2>Sentiment <span class="en">when the guestbook box is unknown (voice notes)</span></h2>
    <dl class="kv">
      <dt>Items with a clear mood</dt><dd>${t.mood.n}</dd>
      <dt>Accuracy</dt><dd><b>${p(t.mood.accuracy)}</b></dd>
      <dt>Precision when answered</dt><dd>${p(t.mood.precisionWhenAnswered)}</dd>
      <dt>Answered</dt><dd>${p(t.mood.coverage)}</dd>
      <dt>Threshold</dt><dd>confidence ≥ ${y}</dd>
    </dl>
  </div>`:'<div class="notice warn">No automatic results yet. They appear after the GitHub accuracy run finishes. You can run the topic and sentiment check here.</div>'}

  ${Object.keys(o).length?`
  <div class="card">
    <h2>Translation packs <span class="en">guest language → English</span></h2>
    <p class="small muted">chrF: 0–100, higher is better (character overlap with a reference translation).</p>
    <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:.9rem">
      <thead><tr><th align="left">Language</th><th align="right">chrF synthetic</th><th align="right">Topic after translation</th><th align="right">chrF FLORES-200</th></tr></thead>
      <tbody>${Object.entries(o).map(([i,r])=>{var c,d,a;return`
        <tr style="border-top:1px solid var(--line)"><td>${l(((c=k[i])==null?void 0:c.en)||i)}<div class="small muted">${l(r.model)}</div></td>
        ${r.error?`<td colspan="3" class="small muted">failed: ${l(r.error)}</td>`:`<td align="right">${r.chrF}</td><td align="right">${r.topicAfterTranslation.correct}/${r.topicAfterTranslation.total}</td>
        <td align="right">${((a=(d=n==null?void 0:n.results)==null?void 0:d[i])==null?void 0:a.chrF)??"—"}</td>`}</tr>`}).join("")}
      </tbody></table></div>
    ${n!=null&&n.error?`<p class="small muted">FLORES-200 was not run: ${l(n.error)}</p>`:n?`<p class="small muted">FLORES-200 ${l(n.split)}, first ${n.sentences} sentences per language (CC BY-SA 4.0).</p>`:""}
    <details class="quotes"><summary>Example translations</summary>
      ${Object.entries(o).map(([i,r])=>(r.samples||[]).slice(0,3).map(c=>`<blockquote class="q"><div class="orig">${l(c.src)}</div><div class="trans">model: ${l(c.hyp)}</div><div class="trans">reference: ${l(c.ref)}</div></blockquote>`).join("")).join("")}
    </details>
  </div>`:""}

  <div class="card">
    <h2>Run here <span class="en">downloads about 90 MB once (topic + sentiment models)</span></h2>
    <button class="btn block" id="run">Run topic and sentiment check in this browser</button>
  </div>

  <div class="card">
    <h2>Known limits</h2>
    <ul class="small" style="padding-left:18px;margin:0">
      <li>The labeled set is synthetic and small (48 sentences); real guest feedback is needed to confirm these numbers.</li>
      <li>No small, browser-ready translation model covers Swahili or Chagga, so Noor reads Swahili templates, not machine translation.</li>
      <li>Handwriting recognition is not scored here; low-confidence words are always shown to the helper for correction.</li>
    </ul>
  </div>`,document.getElementById("run").addEventListener("click",F)}let m=null;async function F(){try{const s=await(await fetch("data/eval-set.json")).json();b("Running topic check");const t=s.topics.map(i=>i.text),o=await T(t,w);b("Running sentiment check");const n=await A(t,w);f(),$(m,{topics:O(s.topics,o),mood:E(s.topics,n,y)})}catch(e){f(),x(`Error: ${e.message}`,6e3)}}async function N(){try{const e=await fetch("data/eval-results.json",{cache:"no-store"});m=e.ok?await e.json():null}catch{m=null}$(m,null)}N();
