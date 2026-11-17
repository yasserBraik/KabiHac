(() => {
'use strict';
/* Content and wording come from data-en.js or data-ar.js; this file only renders and wires up behaviour. */
const {T,NUMBERS,TICKER,ROLES,VENTURES,P,SKILLS,AWARDS,PATENTS,MEDIA,PUBS,TALKS,CERTS}=window.G;
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const go=id=>document.getElementById(id).scrollIntoView({behavior:reduce?'auto':'smooth'});

/* ---------- dateline: today's date ---------- */
try{ $('#hijri').textContent=new Intl.DateTimeFormat(T.hijriLocale,{day:'numeric',month:'long',year:'numeric'}).format(new Date()); }catch(e){}
try{ $('#today').textContent=new Date().toLocaleDateString(T.dateLocale,{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }catch(e){}

/* ---------- toast + copy ---------- */
let tt; const toast=m=>{ const t=$('#toast'); t.textContent=m; t.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('show'),2300); };
async function copy(text,ok){ try{ await navigator.clipboard.writeText(text); toast(ok); }catch(e){ const a=document.createElement('textarea'); a.value=text; a.style.position='fixed'; a.style.opacity=0; document.body.appendChild(a); a.select(); let r=false; try{ r=document.execCommand('copy'); }catch(_){ } a.remove(); toast(r?ok:T.copyBlocked); } }
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy,T.addressCopied)));

/* ---------- render: front page ---------- */
$('#numbers').innerHTML=NUMBERS.map(([n,l])=>`<dt>${n}</dt><dd>${l}</dd>`).join('');
const tick=(copy)=>TICKER.map(([h,pg,t])=>`<a href="${h}"${copy?' tabindex="-1" aria-hidden="true"':''}><b>${pg}</b> ${t}</a>`).join('');
$('#run').innerHTML=tick(false)+tick(true);
const tp=$('#tick-pause');
if(reduce){ $('#run').style.animationPlayState='paused'; tp.textContent=T.play; tp.setAttribute('aria-pressed','true'); }
tp.addEventListener('click',()=>{ const paused=tp.getAttribute('aria-pressed')==='true'; tp.setAttribute('aria-pressed',!paused); tp.textContent=paused?T.pause:T.play; $('#run').style.animationPlayState=paused?'running':'paused'; });

/* ---------- render: business ---------- */
$('#biz').innerHTML=ROLES.map((r,i)=>{
  if(r.rule) return '<hr class="row-rule">';
  const shown=r.pts.slice(0,r.shown), more=r.pts.slice(r.shown);
  const list=a=>`<ul${r.cols?' class="cols-2"':''}>${a.map(p=>`<li>${p}</li>`).join('')}</ul>`;
  return `<article class="story span-${r.span}${r.small?' small':''}">
    <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><span class="dl">${r.when}</span>${r.stamp?`<span class="stamp">${r.stamp}</span>`:''}</div>
    <h3>${r.title}</h3><div class="role">${r.org}</div>
    ${list(shown)}
    ${more.length?`<div class="more" id="more-${i}"><div>${list(more)}${r.tech?`<p style="font-family:var(--type);font-size:12.5px;margin-top:6px;text-align:start">${T.setInType}: ${r.tech}</p>`:''}</div></div><button class="contd" type="button" aria-expanded="false" aria-controls="more-${i}">${T.continued(more.length)}</button>`:''}
  </article>`;
}).join('');
$$('.contd').forEach(b=>b.addEventListener('click',()=>{ const s=b.closest('.story'), o=!s.classList.contains('open'); s.classList.toggle('open',o); b.setAttribute('aria-expanded',o); b.textContent=o?T.fold:T.continued(s.querySelectorAll('.more li').length); }));
$('#ventures').innerHTML=VENTURES.map(v=>`<article><div style="display:flex;justify-content:space-between;gap:8px"><span class="dl kicker">${v.when}</span><span class="stamp${v.closed?' blue':''}">${v.stamp}</span></div><h3>${v.title}</h3><div class="role" style="font-family:var(--display);font-style:italic;margin-bottom:6px">${v.role}</div><p>${v.body}</p></article>`).join('');

/* ---------- render: features ---------- */
const techCount={}; P.forEach(p=>p.tech.forEach(t=>techCount[t]=(techCount[t]||0)+1));
const SUBJ=Object.keys(techCount).filter(t=>techCount[t]>1).sort((a,b)=>techCount[b]-techCount[a]||a.localeCompare(b));
$('#subjects').innerHTML=`<span>${T.subjectsLabel}</span>`+['all',...SUBJ].map((t,i)=>`<button type="button" aria-pressed="${i===0}" data-s="${t}">${t==='all'?T.all:t+' ('+techCount[t]+')'}</button>`).join('');
$('#feat-grid').innerHTML=P.map((p,i)=>`<article class="feat${p.big?' big':''}" data-i="${i}">
  <div class="exhibit"><span class="kicker">${T.feature} ${p.ex} · ${(p.when.match(/\d{4}/)||[''])[0]}</span><span class="stamp">${p.stamp}</span></div>
  <h3>${p.name}</h3>
  <div class="meta">${p.role} · ${p.org}</div>
  <p>${p.deck}</p>
  <div class="figs">${p.figs.map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>
  <button class="btn open" type="button" data-open="${i}">${T.readFull}</button>
</article>`).join('');
$$('#subjects button').forEach(b=>b.addEventListener('click',()=>{ $$('#subjects button').forEach(x=>x.setAttribute('aria-pressed',x===b)); const s=b.dataset.s; $$('.feat').forEach(f=>f.classList.toggle('dim',s!=='all'&&!P[+f.dataset.i].tech.includes(s))); if(s!=='all') toast(T.featHighlighted(s,techCount[s])); }));

/* ---------- reader dialog ---------- */
const reader=$('#reader'), page=$('#r-page'); let rIdx=0, rReturn=null;
const DEMOS={
 mizan(el){ const g=['#2E8B57','#3CB371','#1F6F4A','#5FD38D','#228B22','#4CAF50','#2F9E6E','#66BB6A','#1B5E20','#43A047','#00A86B'];
  el.innerHTML=`<div class="cap"><span>${T.demo.mizan.cap}</span><div class="toggle" role="group" aria-label="${T.demo.compare}"><button type="button" aria-pressed="true" data-v="0">${T.demo.before}</button><button type="button" aria-pressed="false" data-v="1">${T.demo.mizan.after}</button></div></div><div class="sw" style="display:flex;gap:5px;flex-wrap:wrap">${g.map(c=>`<i style="display:block;width:28px;height:28px;background:${c};transition:all .5s"></i>`).join('')}</div><p class="st" style="margin:10px 0 0;font-family:var(--type);font-size:13px;text-align:start">${T.demo.mizan.beforeText}</p>`;
  $$('button',el).forEach(b=>b.addEventListener('click',()=>{ $$('button',el).forEach(x=>x.setAttribute('aria-pressed',x===b)); const a=b.dataset.v==='1'; $$('.sw i',el).forEach((i,k)=>{ i.style.background=a?'#24405E':g[k]; i.style.borderRadius=a?'50%':'0'; }); $('.st',el).textContent=a?T.demo.mizan.afterText:T.demo.mizan.beforeText; })); },
 tele(el){ el.innerHTML=`<div class="cap"><span>${T.demo.tele.cap}</span><div class="toggle" role="group" aria-label="${T.demo.compare}"><button type="button" aria-pressed="false" data-v="b">${T.demo.before}</button><button type="button" aria-pressed="true" data-v="a">${T.demo.after}</button></div></div><div style="font-size:14px">${T.demo.tele.wait}: <b class="w"></b></div><div class="bar" data-k="w"><i></i></div><div style="font-size:14px">${T.demo.tele.dropped}: <b class="d"></b></div><div class="bar" data-k="d"><i></i></div>`;
  const D={b:{w:22,d:20},a:{w:6,d:3}}; const set=v=>{ $('.w',el).textContent=T.demo.tele.minutes(D[v].w); $('.d',el).textContent=D[v].d+'%'; $$('.bar',el).forEach(b=>{ b.classList.toggle('bad',v==='b'); const k=b.dataset.k; $('i',b).style.width=(D[v][k]/(k==='w'?22:20)*100)+'%'; }); };
  $$('button',el).forEach(b=>b.addEventListener('click',()=>{ $$('button',el).forEach(x=>x.setAttribute('aria-pressed',x===b)); set(b.dataset.v); })); set('a'); },
 hirfa(el){ const TX={ltr:['Home › Accounts › Savings','Step 3 of 5','Continue →'],rtl:['الرئيسية ‹ الحسابات ‹ الادخار','الخطوة ٣ من ٥','متابعة ←']};
  el.innerHTML=`<div class="cap"><span>${T.demo.hirfa.cap}</span><div class="toggle" role="group" aria-label="${T.demo.hirfa.label}"><button type="button" aria-pressed="true" data-d="ltr">${T.demo.hirfa.ltr}</button><button type="button" aria-pressed="false" data-d="rtl">${T.demo.hirfa.rtl}</button></div></div><div class="hd" dir="ltr" style="border:1px solid var(--ink);padding:12px;background:var(--paper)"><div class="c" style="font-size:14px;color:var(--ink-2)"></div><div class="s" style="margin-top:6px"></div><div style="height:8px;border:1px solid var(--ink);margin:6px 0;position:relative"><i style="position:absolute;inset-block:0;inset-inline-start:0;width:62%;background:var(--ink)"></i></div><div style="display:flex;justify-content:flex-end"><span class="b" style="background:var(--ink);color:var(--paper);padding:6px 12px;font-size:14px"></span></div></div>`;
  const hd=$('.hd',el), set=d=>{ hd.dir=d; hd.lang=d==='rtl'?'ar':'en'; [$('.c',hd).textContent,$('.s',hd).textContent,$('.b',hd).textContent]=TX[d]; };
  $$('button',el).forEach(b=>b.addEventListener('click',()=>{ $$('button',el).forEach(x=>x.setAttribute('aria-pressed',x===b)); set(b.dataset.d); })); set('ltr'); },
 khatt(el){ el.innerHTML=`<div class="cap"><span>${T.demo.khatt.cap}</span></div><label style="display:block;font-family:var(--type);font-size:12px">${T.demo.khatt.width} <input type="range" min="260" max="640" value="360" data-k="w" style="width:100%;accent-color:#8E2A1E"></label><label style="display:block;font-family:var(--type);font-size:12px;margin-top:6px">${T.demo.khatt.room} <input type="range" min="0" max="10" value="3" data-k="r" style="width:100%;accent-color:#8E2A1E"></label><div class="scr" style="margin:10px auto 0;border:1px solid var(--ink);background:var(--paper);padding:12px;max-width:100%"><p lang="ar" dir="rtl" style="margin:0;font-family:'Libre Caslon Text',serif;text-align:right">النص العربي على الشاشة يحتاج إلى مساحة كي يُقرأ بسهولة.</p></div><p class="ro" style="font-family:var(--type);font-size:12px;margin:8px 0 0;text-align:start"></p>`;
  const scr=$('.scr',el), p=$('p',scr), ro=$('.ro',el); const upd=()=>{ const w=Math.min(+$('[data-k=w]',el).value,el.clientWidth-30), r=+$('[data-k=r]',el).value; const fs=Math.round((15+(w-260)/380*4+r*.7)*10)/10, lh=(1.7+r*.05).toFixed(2), ws=(r*.6).toFixed(1); scr.style.width=w+'px'; Object.assign(p.style,{fontSize:fs+'px',lineHeight:lh,wordSpacing:ws+'px'}); ro.textContent=T.demo.khatt.readout(fs,lh,ws); };
  $$('input',el).forEach(i=>i.addEventListener('input',upd)); upd(); },
 savings(el){ el.innerHTML=`<div class="cap"><span>${T.demo.savings.cap}</span></div><div style="display:grid;grid-template-columns:repeat(3,1fr);text-align:center">${T.demo.savings.steps.map(([a,b,c],i)=>`<div style="${i?'border-inline-start:1px solid var(--hair);':''}padding:4px"><small style="font-family:var(--type);font-size:11px;color:var(--red)">${a}</small><b style="display:block;font-family:var(--display);font-size:30px;font-weight:900">${b}</b><span style="font-size:13px">${c}</span></div>`).join('')}</div>`; },
 qalam(el){ el.innerHTML=`<div class="cap"><span>${T.demo.qalam.cap}</span><div class="toggle" role="group" aria-label="${T.demo.qalam.label}"><button type="button" aria-pressed="true" data-l="en">${T.demo.qalam.std}</button><button type="button" aria-pressed="false" data-l="ar">${T.demo.qalam.expl}</button></div></div><pre style="margin:0;font-family:var(--type);font-size:13.5px;background:var(--paper);border:1px solid var(--ink);padding:10px;direction:ltr">let name = "Yara";\nconsole.log(<u style="text-decoration:wavy underline #8E2A1E">nmae</u>);</pre><div class="e" style="margin-top:8px;border-inline-start:3px solid var(--red);padding:8px 10px;font-size:14px"></div>`;
  const e=$('.e',el), set=l=>{ const ar=l==='ar'; e.dir=ar?'rtl':'ltr'; e.lang=ar?'ar':'en'; e.style.textAlign=ar?'right':'left'; e.style.fontSize=ar?'17px':'14px'; e.textContent=ar?'لم يتم تعريف المتغير nmae. هل تقصد name؟':'ReferenceError: nmae is not defined'; };
  $$('button',el).forEach(b=>b.addEventListener('click',()=>{ $$('button',el).forEach(x=>x.setAttribute('aria-pressed',x===b)); set(b.dataset.l); })); set('en'); },
 dalil(el){ el.innerHTML=`<div class="cap"><span>${T.demo.dalil.cap}</span><button type="button" class="btn" style="padding:3px 8px;font-size:11px" data-run>${T.demo.dalil.again}</button></div><div class="g" style="display:grid;grid-template-columns:repeat(14,1fr);gap:4px">${'<i style="display:block;aspect-ratio:1;border:1px solid var(--ink);transition:background .2s"></i>'.repeat(42)}</div><p style="margin:8px 0 0;font-family:var(--type);font-size:13px;text-align:start"><b class="n">0</b> ${T.demo.dalil.of}</p>`;
  let t; const run=()=>{ clearInterval(t); const c=$$('.g i',el); c.forEach(x=>x.style.background=''); let k=0; if(reduce){ c.forEach(x=>x.style.background='var(--ink)'); $('.n',el).textContent=42; return; } t=setInterval(()=>{ if(k>=42) return clearInterval(t); c[k].style.background='var(--ink)'; k++; $('.n',el).textContent=k; },40); };
  $('[data-run]',el).addEventListener('click',run); run(); }
};
function openReader(i){
  rIdx=(i+P.length)%P.length; const p=P[rIdx]; if(!reader.classList.contains('open')) rReturn=document.activeElement;
  page.innerHTML=`<button class="btn close" type="button" data-rclose>${T.close}</button>
   <div class="top"><span>${T.paper} · ${T.feature} ${p.ex}</span><span>${p.when}</span></div>
   <span class="kicker" style="display:block;margin-top:14px">${p.org}</span>
   <h2 id="r-title">${p.name}</h2>
   <p class="deck">${p.deck}</p>
   <div class="byline"><span>${T.role}: <b>${p.role}</b></span><span>${p.team}</span></div>
   <div class="stats">${p.figs.concat(p.figs.length<3?[[p.tech.length,T.techInStack]]:[]).slice(0,3).map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div>
   <div class="body cols-2">
     <h4>${T.problem}</h4><p${T.dropcap?' class="dropcap"':''}>${p.problem}</p>
     <h4>${T.work}</h4><p>${p.action}</p>
     <div class="pull">${T.quote(p.quote)}</div>
     ${p.result?`<h4>${T.outcome}</h4><p>${p.result}</p>`:''}
     ${p.demo?'<div class="demo" id="r-demo"></div>':''}
     <h4>${T.setInType}</h4><div class="types">${p.tech.map(t=>`<span>${t}</span>`).join('')}</div>
     ${p.link?`<p style="margin-top:12px;text-align:start"><a href="${p.link[1]}" target="_blank" rel="noopener" style="color:var(--red)">${p.link[0]} ${T.finger}</a></p>`:''}
   </div>
   <div class="foot"><button class="btn" type="button" data-rstep="-1">${T.prev(P[(rIdx-1+P.length)%P.length].name)}</button><button class="btn" type="button" data-rstep="1">${T.next(P[(rIdx+1)%P.length].name)}</button></div>`;
  if(p.demo) DEMOS[p.demo]($('#r-demo',page));
  reader.classList.add('open'); reader.setAttribute('aria-hidden','false'); document.body.style.overflow='hidden';
  reader.scrollTop=0;
  // Move focus in once the reader is actually visible; retry briefly while its fade-in starts.
  const close=$('[data-rclose]',page); let tries=0;
  (function focusClose(){ close.focus({preventScroll:true}); if(document.activeElement!==close && ++tries<20) setTimeout(focusClose,25); })();
  $('[data-rclose]',page).addEventListener('click',closeReader);
  $$('[data-rstep]',page).forEach(b=>b.addEventListener('click',()=>openReader(rIdx+ +b.dataset.rstep)));
}
function closeReader(){ reader.classList.remove('open'); reader.setAttribute('aria-hidden','true'); document.body.style.overflow=''; if(rReturn) rReturn.focus({preventScroll:true}); }
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>openReader(+b.dataset.open)));
reader.addEventListener('click',e=>{ if(e.target===reader) closeReader(); });
reader.addEventListener('keydown',e=>{
  if(e.key==='Escape') closeReader();
  if(e.key==='Tab'){ const f=$$('button,a[href],input',page).filter(x=>x.offsetParent!==null); const a=f[0], z=f[f.length-1]; if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus();} else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus();} }
});

/* ---------- render: classifieds ---------- */
const LV=['all','expert','advanced','intermediate'];
$('#class-tools').innerHTML=LV.map((l,i)=>`<button type="button" aria-pressed="${i===0}" data-l="${l}">${T.levels[l]}${l==='all'?'':' ('+SKILLS.filter(s=>s[1]===l).length+')'}</button>`).join('');
$('#ads').innerHTML=`<div class="ad feature"><span class="lvl">${T.wanted.lvl}</span><h3>${T.wanted.title}</h3><p style="text-align:center;margin:6px 0">${T.wanted.body}</p><span class="inq">${T.wanted.inq}</span></div>`+
 SKILLS.map(([n,l,y,tools,pitch])=>`<div class="ad" data-l="${l}"><span class="lvl">${T.levels[l]} · ${T.yrs(y)}</span><h3>${n}</h3><div class="yrs" role="img" aria-label="${T.yearsOf(y)}"><i style="--w:0"></i><span>${y}</span></div><div class="tools">${tools}.</div><span class="inq">${pitch}</span></div>`).join('');
$$('#class-tools button').forEach(b=>b.addEventListener('click',()=>{ $$('#class-tools button').forEach(x=>x.setAttribute('aria-pressed',x===b)); const l=b.dataset.l; $$('.ad[data-l]').forEach(a=>a.classList.toggle('hide',l!=='all'&&a.dataset.l!==l)); }));
const adObs=new IntersectionObserver(([e])=>{ if(!e.isIntersecting) return; $$('.ad[data-l]').forEach((a,i)=>{ const y=SKILLS[i][2]; setTimeout(()=>$('.yrs i',a).style.setProperty('--w',(y/18*100)+'%'),reduce?0:i*80); }); adObs.disconnect(); },{threshold:.15});
adObs.observe($('#ads'));

/* ---------- render: research, honours ---------- */
const li=([a,b,c])=>`<li><small>${a}</small><b>${b}</b><em>${c}</em></li>`;
$('#patents').innerHTML=PATENTS.map(li).join(''); $('#media').innerHTML=MEDIA.map(li).join(''); $('#pubs').innerHTML=PUBS.map(li).join(''); $('#talks').innerHTML=TALKS.map(li).join('');
$('#roll').innerHTML=AWARDS.map(([y,t,o])=>`<li><b>${y}</b><span>${t}</span><em>${o}</em></li>`).join('');

/* ---------- render: certifications ---------- */
const SL=T.certStatus;
$('#notices').innerHTML=CERTS.map(([n,iss,y,st,id,lab])=>`<div class="notice" data-st="${st}" data-q="${(n+' '+iss).replace(/<[^>]+>/g,'').toLowerCase()}"><b>${n}</b><em>${iss}</em><div class="meta"><span>${st==='progress'?id:T.certNo+' '+id}</span><span class="st ${st}">${lab||SL[st]} · ${y}</span></div></div>`).join('');
$('#cert-filters').innerHTML=['all','active','lifetime','progress','expired'].map((k,i)=>`<button type="button" aria-pressed="${i===0}" data-f="${k}">${k==='all'?T.all:SL[k]} (${k==='all'?CERTS.length:CERTS.filter(c=>c[3]===k).length})</button>`).join('');
let cf='all'; const fc=()=>{ const q=$('#cert-q').value.trim().toLowerCase(); let n=0; $$('.notice').forEach(x=>{ const ok=(cf==='all'||x.dataset.st===cf)&&(!q||x.dataset.q.includes(q)); x.classList.toggle('hide',!ok); if(ok)n++; }); $('#notices-empty').hidden=n>0; };
$$('#cert-filters button').forEach(b=>b.addEventListener('click',()=>{ $$('#cert-filters button').forEach(x=>x.setAttribute('aria-pressed',x===b)); cf=b.dataset.f; fc(); }));
$('#cert-q').addEventListener('input',fc);

/* ---------- printing-press canvas ---------- */
(function press(){
  const c=$('#press'), ctx=c.getContext('2d'); let w,h,lines=[],mx=-999,my=-999,raf,vis=true;
  function setup(){ const d=Math.min(devicePixelRatio||1,2); w=c.clientWidth; h=c.clientHeight; c.width=w*d; c.height=h*d; ctx.setTransform(d,0,0,d,0,0); lines=[]; const gap=Math.max(16,h/15);
    for(let y=gap,i=0;y<h-gap/2;y+=gap,i++){ const rtl=i%2===1; const words=[]; let x=-20; while(x<w*2){ const len=rtl?10+Math.random()*46:6+Math.random()*30; words.push({x,len,h:rtl?2.4:5+Math.random()*3}); x+=len+(rtl?9:7); } lines.push({y,rtl,words,off:Math.random()*w,sp:.12+Math.random()*.18}); } }
  function draw(){ ctx.clearRect(0,0,w,h);
    // halftone dots
    for(let y=6;y<h;y+=8) for(let x=6;x<w;x+=8){ const d=Math.hypot(x-w*.62,y-h*.4)/(w*.8); const r=Math.max(0,1.6-d*1.9); if(r>.1){ ctx.fillStyle='rgba(31,26,20,.12)'; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); } }
    for(const L of lines){ if(!reduce) L.off=(L.off+(L.rtl?-L.sp:L.sp)+w)%w;
      ctx.fillStyle=L.rtl?'rgba(142,42,30,.78)':'rgba(31,26,20,.82)';
      for(const W of L.words){ let x=W.x+L.off; x=((x+40)%(w+80)+(w+80))%(w+80)-40; const near=Math.max(0,1-Math.hypot(x-mx,L.y-my)/90); const dy=near*10, sm=near*3;
        if(L.rtl){ ctx.fillRect(x,L.y+dy,W.len,W.h+sm*.3); if(W.len>30){ ctx.beginPath(); ctx.arc(x+W.len*.5,L.y-5+dy,1.5,0,7); ctx.fill(); } }
        else { for(let k=0;k<W.len;k+=4.5) ctx.fillRect(x+k,L.y-W.h+dy+((k*7)%3),2.2+sm*.2,W.h); } } }
  }
  function loop(){ if(vis) draw(); raf=requestAnimationFrame(loop); }
  setup(); addEventListener('resize',()=>{ setup(); draw(); });
  c.parentElement.addEventListener('pointermove',e=>{ const r=c.getBoundingClientRect(); mx=e.clientX-r.left; my=e.clientY-r.top; if(reduce) draw(); });
  c.parentElement.addEventListener('pointerleave',()=>{ mx=my=-999; if(reduce) draw(); });
  new IntersectionObserver(([e])=>vis=e.isIntersecting).observe(c);
  if(reduce) draw(); else loop();
})();

/* ---------- strip: active section, ink bar, mini masthead ---------- */
const strip=$('#strip'), secLinks=$$('.strip a.sec'), bar=$('#ink-bar'), toFront=$('.to-front');
const onScroll=()=>{ const H=document.documentElement.scrollHeight-innerHeight; bar.style.width=(H>0?scrollY/H*100:0)+'%'; strip.classList.toggle('past',strip.getBoundingClientRect().top<=0&&scrollY>200); toFront.classList.toggle('show',scrollY>innerHeight); };
addEventListener('scroll',onScroll,{passive:true}); onScroll();
const spy=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting) secLinks.forEach(a=>a.setAttribute('aria-current',a.getAttribute('href')==='#'+e.target.id)); }),{rootMargin:'-40% 0px -55% 0px'});
['front','business','features','classifieds','research','honours','academy','letters'].forEach(id=>spy.observe(document.getElementById(id)));
$$('[data-front]').forEach(b=>b.addEventListener('click',()=>{ scrollTo({top:0,behavior:reduce?'auto':'smooth'}); }));
const rv=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('inview'); rv.unobserve(e.target);} }),{threshold:.04});
$$('.reveal').forEach(el=>rv.observe(el));

/* ---------- mobile drawer ---------- */
const drawer=$('#drawer'), menu=$('.strip .menu');
const setD=o=>{ drawer.classList.toggle('open',o); menu.setAttribute('aria-expanded',o); document.body.style.overflow=o?'hidden':''; if(o) setTimeout(()=>$('nav a',drawer).focus(),50); else menu.focus(); };
menu.addEventListener('click',()=>setD(true)); $('[data-close]',drawer).addEventListener('click',()=>setD(false));
$$('nav a',drawer).forEach(a=>a.addEventListener('click',()=>{ drawer.classList.remove('open'); menu.setAttribute('aria-expanded',false); document.body.style.overflow=''; }));
drawer.addEventListener('keydown',e=>{ if(e.key==='Escape') setD(false); if(e.key==='Tab'){ const f=$$('a,button',drawer); if(e.shiftKey&&document.activeElement===f[0]){e.preventDefault();f[f.length-1].focus();} else if(!e.shiftKey&&document.activeElement===f[f.length-1]){e.preventDefault();f[0].focus();} } });

/* ---------- print edition (CV download) ---------- */
$$('[data-cv]').forEach(a=>a.addEventListener('click',async e=>{
  if(!window.claude||!window.claude.use) return;
  e.preventDefault();
  try{ const dl=await window.claude.use('downloads'); const r=await fetch(a.getAttribute('href')); if(!r.ok) throw 0; const blob=await r.blob(); if(dl){ await dl.save({filename:T.cvName,data:blob}); toast(T.cvSaved); } else location.href=a.href; }
  catch(err){ if(err&&/declin|cancel|abort/i.test(err.message||err.name||'')) toast(T.cvCancelled); else location.href=a.href; }
}));

/* ---------- language switch: keep the reader's place ---------- */
$$('[data-lang]').forEach(a=>a.addEventListener('click',()=>{ a.href=a.getAttribute('href').split('#')[0]+location.hash; }));

/* ---------- letters to the editor ---------- */
const form=$('#letter'), TO='yara.almansouri@mail.example';
const rules={name:v=>v.trim().length>=2||T.form.name,email:v=>v.trim()?(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||T.form.emailBad):T.form.emailMissing,topic:v=>!!v||T.form.topic,message:v=>v.trim().length>=20||T.form.message(v.trim().length)};
const errFor={name:'l-name-err',email:'l-email-err',topic:'l-topic-err',message:'l-msg-err'};
function check(i){ const r=rules[i.name]; if(!r) return true; const res=r(i.value), ok=res===true; i.setAttribute('aria-invalid',!ok); if(!ok) i.setAttribute('aria-describedby',errFor[i.name]); else i.removeAttribute('aria-describedby'); $('#'+errFor[i.name]).textContent=ok?'':res; return ok; }
$$('[name]',form).forEach(i=>{ i.addEventListener('blur',()=>{ if(i.value) check(i); }); i.addEventListener('input',()=>{ if(i.getAttribute('aria-invalid')==='true') check(i); }); });
$('#l-msg').addEventListener('input',e=>$('#l-count').textContent=T.form.count(e.target.value.length));
form.addEventListener('submit',e=>{ e.preventDefault(); const bad=$$('[name]',form).filter(i=>!check(i)); if(bad.length){ bad[0].focus(); return; }
  const d=Object.fromEntries(new FormData(form)), org=d.org.trim();
  const subject=T.form.subject(d.topic,d.name.trim(),org);
  const body=T.form.body(d.message.trim(),d.name.trim(),d.email.trim(),org);
  $('#sealed-text').textContent=`${T.form.to}: ${TO}\n${T.form.subjectLabel}: ${subject}\n\n${body}`;
  $('#sealed-mail').href=`mailto:${TO}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const s=$('#sealed'); s.classList.add('show'); s.focus({preventScroll:true}); s.scrollIntoView({block:'nearest',behavior:reduce?'auto':'smooth'}); });
$('#sealed-copy').addEventListener('click',()=>copy($('#sealed-text').textContent,T.letterCopied));
})();
