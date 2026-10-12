(function interactiveBook(){
"use strict";
const originalChapters=[...document.querySelectorAll("section.chapter")];
const originalForeword=document.querySelector("#foreword");
const originalRefs=document.querySelector("#references");
if(!originalChapters.length||!originalForeword)return;
const chapters=originalChapters.map(el=>({el,n:+el.dataset.number,part:+el.dataset.part,title:el.dataset.title,partTitle:el.dataset.parttitle,headings:[...el.querySelectorAll(".prose > h3")].map(e=>e.textContent.trim())}));
const escape=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const $=s=>root.querySelector(s);
const mobile=()=>matchMedia("(max-width:770px)").matches;
const reduce=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const root=document.createElement("div");
root.id="book-portal";root.className="book-portal";
const coverArt=`<svg viewBox="0 0 360 325" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
<defs><linearGradient id="covergold" x1="34" y1="30" x2="309" y2="300" gradientUnits="userSpaceOnUse"><stop stop-color="#5c4235"/><stop offset=".44" stop-color="#e6c78f"/><stop offset=".78" stop-color="#ac8758"/><stop offset="1" stop-color="#5a4437"/></linearGradient>
<radialGradient id="coverfog" cx="0" cy="0" r="1" gradientTransform="translate(175 146) rotate(90) scale(127 160)" gradientUnits="userSpaceOnUse"><stop stop-color="#d7b77d" stop-opacity=".14"/><stop offset="1" stop-color="#cdb17d" stop-opacity="0"/></radialGradient></defs>
<circle cx="177" cy="151" r="139" fill="url(#coverfog)"/>
<path d="M22 232C80 210 119 224 180 200s112 2 157 20" stroke="url(#covergold)" stroke-width="1.1" opacity=".53"/>
<path d="M38 260c66-39 119-37 145-61 22-20 46-41 131-12M49 273c66-44 120-36 149-69 17-18 63-34 120-24" stroke="url(#covergold)" opacity=".26"/>
<path d="M176 229c17 13 46 24 42 35-5 12-44 12-55 25-10 12 8 22 33 28" stroke="#c8a46c" stroke-width="2" opacity=".65"/>
<path d="M172 229c-18 12-26 26-28 39m29-38c24 12 41 29 52 39m-52-39c-1 14 0 25 5 43" stroke="#d3b278" stroke-width="1.2" opacity=".48"/>
<path d="M174 227c-8-52-11-86-6-143m7 142c16-39 24-77 32-123m-36 111c-20-42-42-73-57-100" stroke="url(#covergold)" stroke-width="2.5"/>
<path d="M169 167c-28-24-59-42-91-45m93 48c31-40 53-53 91-61m-93 22c-15-35-42-54-78-58m84 64c24-32 51-49 78-45m-88 27c-12-33-24-54-22-90m37 90c23-34 35-59 27-95" stroke="#d8ba84" stroke-width="1.2" opacity=".77"/>
<g stroke="url(#covergold)" stroke-width=".8" opacity=".55"><path d="M89 76l19 7m-5-20 29 19m42-57-3 38m38-36-14 48m48-34-32 48m50-19-37 27m64 8-51 11M67 103l61 32M54 126l67 24M292 122l-59 27M312 146l-79 20"/></g>
<g fill="#c8a778" opacity=".65"><circle cx="84" cy="90" r="2"/><circle cx="116" cy="60" r="1.6"/><circle cx="143" cy="43" r="2"/><circle cx="184" cy="22" r="1.7"/><circle cx="215" cy="40" r="2"/><circle cx="265" cy="68" r="1.8"/><circle cx="291" cy="103" r="2"/><circle cx="316" cy="140" r="1.3"/><circle cx="59" cy="138" r="1.5"/><circle cx="69" cy="164" r="1.4"/><circle cx="304" cy="177" r="1.5"/></g>
<g fill="#c4a477" opacity=".47"><rect x="80" y="221" width="12" height="17"/><rect x="94" y="210" width="8" height="28"/><rect x="103" y="215" width="14" height="23"/><rect x="120" y="207" width="6" height="31"/><rect x="228" y="205" width="10" height="32"/><rect x="241" y="194" width="9" height="43"/><rect x="253" y="211" width="13" height="26"/><rect x="268" y="200" width="7" height="37"/></g>
<path d="M46 239h268M56 243h253" stroke="#dfc497" stroke-width=".7" opacity=".33"/>
<path d="M117 301c32-30 81-25 110-10" stroke="#a98858" stroke-width=".9" opacity=".32"/>
<circle cx="178" cy="156" r="119" stroke="#c5a06b" stroke-width=".5" opacity=".25" stroke-dasharray="1 7"/>
</svg>`;
root.innerHTML=`
<section class="bp-landing" id="bp-landing" aria-label="Livre fermé">
 <div class="bp-table"></div><div class="bp-lamp"></div>
 <div class="bp-heading"><span class="pretitle">La bibliothèque du dirigeant · Édition 2026</span><h1>Un ouvrage à ouvrir.<br>Une pensée à approfondir.</h1><p>Chaque décision façonne ce qui reste après nous.</p></div>
 <div class="bp-closed-stage"><div class="bp-book-spine"></div><div class="bp-book-block"></div>
 <button type="button" class="bp-closed-cover" id="bp-cover-open" aria-label="Ouvrir le livre">
 <span class="bp-cover-inner"><span class="small">Stratégie · Entreprise · Gouvernance</span>
 <span class="bp-cover-art">${coverArt}</span><span><h2>L’Entrepreneur<br>lucide</h2>
 <p>L’art de bâtir, gouverner, protéger et transmettre une entreprise.</p></span>
 <span class="bp-author">Guede Camus Salomon</span></span><span class="bp-cover-back">Ce qui dure se construit.</span></button></div>
 <button type="button" class="bp-open-prompt" data-action="open">Ouvrir le livre ↗</button>
 <span class="bp-shelf-note">Guede Camus Salomon · Ouvrage interactif</span>
</section>
<section class="bp-reader bp-hidden" id="bp-reader" aria-label="Lecture du livre">
 <header class="bp-readerbar">
  <strong>L’Entrepreneur lucide <span style="color:#c7a66b">·</span> Guede Camus Salomon</strong>
  <nav class="bp-tools" aria-label="Outils de lecture">
   <button class="bp-tool bp-mobile-rail-toggle" type="button" data-action="rail">☰ Menu</button>
   <button class="bp-tool" type="button" data-action="toc">Sommaire</button>
   <button class="bp-tool bp-fullscreen-button" id="bp-fullscreen" type="button" data-action="fullscreen" aria-pressed="false">⛶ Plein écran</button>
   <button class="bp-tool" type="button" data-action="close">Fermer</button>
   <button class="bp-tool" type="button" data-action="print">Imprimer</button>
  </nav>
 </header>
 <div class="bp-reading-layout">
 <aside class="bp-rail" id="bp-rail" aria-label="Table des matières"><h2>Table des matières</h2>
 <input id="bp-filter" type="search" placeholder="Rechercher un chapitre…" aria-label="Rechercher un chapitre">
 <nav id="bp-rail-nav"></nav></aside>
 <div class="bp-readerstage">
  <div class="bp-book-position">
   <div class="bp-spread" id="bp-spread" aria-label="Feuilletez par les coins">
    <article class="bp-paper bp-paper-left" id="bp-page-left"></article>
    <article class="bp-paper bp-paper-right" id="bp-page-right"></article>
    <button class="bp-corner bp-corner-left" type="button" data-grab="-1" aria-label="Saisir le coin pour tourner en arrière"><span>↶</span></button>
    <button class="bp-corner bp-corner-right" type="button" data-grab="1" aria-label="Saisir le coin pour tourner en avant"><span>↷</span></button>
   </div>
  </div>
  <nav class="bp-footer-nav" aria-label="Pagination">
   <button type="button" data-action="prev" id="bp-prev">← Précédent</button>
   <span class="bp-pagecount" id="bp-counter">—</span>
   <button type="button" data-action="next" id="bp-next">Suivant →</button>
  </nav>
 </div></div>
 <button type="button" id="bp-rail-curtain" class="bp-rail-curtain bp-hidden" aria-label="Masquer le sommaire"></button>
</section>`;
document.body.appendChild(root);document.body.classList.add("experience-on");
const landing=$("#bp-landing"),reader=$("#bp-reader"),left=$("#bp-page-left"),right=$("#bp-page-right"),spread=$("#bp-spread"),rail=$("#bp-rail"),curtain=$("#bp-rail-curtain");
const partNames=[...new Set(chapters.map(c=>c.part))].map(part=>({part,title:chapters.find(c=>c.part===part).partTitle}));
const kicker=s=>`<span class="bp-kicker">${escape(s)}</span>`;
const docs=[];
docs.push({id:"title",label:"Page de titre",blocks:[`<div class="bp-titleleaf"><span class="bp-decor">✦</span><h1>L’Entrepreneur<br>lucide</h1><div class="bp-rule"></div><p>L’art de bâtir, gouverner, protéger et transmettre une entreprise.</p><p class="bp-author-title">Guede Camus Salomon</p><small>Édition 2026</small></div>`]});
const f=originalForeword.cloneNode(true);f.querySelector("#book-index")?.remove();f.querySelector(".cover-actions")?.remove();
const fNodes=[...f.children].filter(el=>el.tagName!=="BUTTON"&&!(/Sommaire intégral/i.test(el.textContent)&&el.tagName==="H2"));
docs.push({id:"foreword",label:"Avant-propos",blocks:fNodes.map(el=>el.outerHTML)});
const tocBlocks=[`<h2>Sommaire général</h2>`,`<p>Les chapitres et leurs sous-titres sont tous cliquables. Chaque titre conduit à la page correspondante.</p>`];
for(const part of partNames){
 tocBlocks.push(`<h3 class="bp-toc-part-title">Partie ${part.part} — ${escape(part.title)}</h3>`);
 for(const ch of chapters.filter(c=>c.part===part.part)){
  tocBlocks.push(`<div class="bp-toc-entry bp-toc-flat"><button type="button" data-chapter="${ch.n}"><strong>${String(ch.n).padStart(2,"0")}.</strong> ${escape(ch.title)}</button></div>`);
  ch.headings.forEach((text,i)=>tocBlocks.push(`<div class="bp-toc-subline"><button type="button" data-section="${ch.n}:${i}">${escape(text)}</button></div>`));
 }
}
docs.push({id:"toc",label:"Sommaire",blocks:tocBlocks});
for(const ch of chapters){
 const nodes=[...ch.el.querySelector(".prose").children];
 const blocks=[`<h2>${escape(ch.title)}</h2>`];
 blocks.push(`<div class="bp-internal-toc"><strong>Dans ce chapitre</strong>${ch.headings.map((s,i)=>`<button type="button" data-section="${ch.n}:${i}">${escape(s)}</button>`).join("")}</div>`);
 let num=0;
 for(const e of nodes){
  if(e.tagName==="H3"){blocks.push(`<h3 data-section-anchor="${ch.n}:${num}">${e.innerHTML}</h3>`);num++}
  else blocks.push(e.outerHTML);
 }
 docs.push({id:"chap-"+ch.n,label:"Partie "+ch.part+" · Chapitre "+String(ch.n).padStart(2,"0"),blocks});
}
const rc=originalRefs.cloneNode(true);rc.querySelector("button")?.remove();
docs.push({id:"annexes",label:"Annexes",blocks:[...rc.children].map(el=>el.outerHTML).concat([`<div class="bp-titleleaf"><span class="bp-decor">✦</span><h2>La lucidité se cultive.</h2><p>Comprendre. Construire. Gouverner. Protéger. Transmettre.</p><p class="bp-author-title">Guede Camus Salomon</p></div>`])});
let pages=[],current=0,busy=false,opened=false,opening=false,paginating=false;
let resizeTimeout,drag=null;
const sheetWidth=()=>left.getBoundingClientRect().width;
const sheetHeight=()=>left.getBoundingClientRect().height;
function flatten(blocks){
 const tmp=document.createElement("div");tmp.innerHTML=blocks.join("");
 const out=[];
 for(const node of [...tmp.children]){
  if(node.tagName==="OL"||node.tagName==="UL"){
   // Keep individual list entries independently pageable.
   for(const li of [...node.children]){
    const wrapper=document.createElement(node.tagName);
    wrapper.append(li.cloneNode(true));out.push(wrapper.outerHTML);
   }
  }else out.push(node.outerHTML);
 }
 return out;
}
function paginate(){
 if(paginating)return;
 paginating=true;
 const w=sheetWidth(),h=sheetHeight();
 if(w<30||h<120){paginating=false;return}
 const scratch=document.createElement("article");
 scratch.className="bp-paper bp-paper-left bp-measure";
 scratch.style.cssText=`position:fixed!important;left:-20000px!important;top:0!important;width:${w}px!important;height:${h}px!important;max-height:none!important;min-height:0!important;overflow:hidden!important;visibility:hidden!important;display:block!important;`;
 root.appendChild(scratch);
 const nextPages=[];
 function fits(){return scratch.scrollHeight<=scratch.clientHeight+2}
 for(const doc of docs){
  let first=true,used=0,blocks=flatten(doc.blocks);
  function start(){
   scratch.innerHTML=kicker(doc.label+(first?"":" · suite"));
   used=0;
  }
  function commit(){
   if(!used&&first&&doc.blocks.length)return;
   const anchors=[...scratch.querySelectorAll("[data-section-anchor]")].map(e=>e.dataset.sectionAnchor);
   nextPages.push({html:scratch.innerHTML,docId:doc.id,anchors});
   first=false;start();
  }
  start();
  for(let i=0;i<blocks.length;i++){
   let raw=blocks[i];
   let el=document.createElement("div");el.innerHTML=raw;let node=el.firstElementChild;
   if(!node)continue;
   scratch.appendChild(node);
   if(fits()){used++;continue}
   node.remove();
   if(used){commit();i--;continue}
   // An oversized paragraph is split at word boundaries so no part is hidden.
   const tag=node.tagName;
   const text=node.textContent.trim();
   if(!text||!["P","LI","DIV","H2","H3"].includes(tag)){
    scratch.appendChild(node);used++;commit();continue;
   }
   let words=text.split(/\s+/),remaining=words;
   let guard=0;
   while(remaining.length&&guard++<1000){
    const slice=document.createElement(tag==="LI"?"P":tag);
    slice.className=node.className;
    if(node.hasAttribute("data-section-anchor"))slice.dataset.sectionAnchor=node.dataset.sectionAnchor;
    let low=1,hi=remaining.length,best=0;
    while(low<=hi){
     const mid=(low+hi)>>1;
     slice.textContent=remaining.slice(0,mid).join(" ");
     scratch.appendChild(slice);
     const yes=fits();slice.remove();
     if(yes){best=mid;low=mid+1}else hi=mid-1;
    }
    if(best===0){best=1}
    slice.textContent=remaining.slice(0,best).join(" ");
    scratch.appendChild(slice);used++;
    remaining=remaining.slice(best);
    if(remaining.length)commit();
   }
  }
  if(used||(!blocks.length))commit();
 }
 scratch.remove();
 pages=nextPages;
 current=Math.min(current,Math.max(0,pages.length-1));
 paginating=false;
}
function pageAt(i){return pages[i]?.html||""}
function isMobile(){return mobile()}
function maxIndex(){return Math.max(0,pages.length-1)}
function normalIndex(i){return isMobile()?i:Math.floor(i/2)*2}
function render(i){
 current=Math.max(0,Math.min(normalIndex(i),maxIndex()));
 left.innerHTML=pageAt(current);
 right.innerHTML=isMobile()?"":pageAt(current+1);
 left.scrollTop=0;right.scrollTop=0;
 $("#bp-counter").textContent=isMobile()?`Page ${current+1} / ${pages.length}`:`Pages ${current+1}–${Math.min(current+2,pages.length)} / ${pages.length}`;
 $("#bp-prev").disabled=current===0;
 $("#bp-next").disabled=current+(isMobile()?1:2)>=pages.length;
 root.querySelectorAll("[data-grab]").forEach(b=>{const dir=+b.dataset.grab;b.disabled=dir<0?current===0:current+(isMobile()?1:2)>=pages.length});
 try{localStorage.setItem("elucide_page",String(current))}catch(e){}
}
function targetFor(dir){
 const step=isMobile()?1:2;
 return Math.max(0,Math.min(maxIndex(),normalIndex(current+dir*step)));
}
function createLeaf(dir,toIndex){
 const div=document.createElement("div");
 div.className="bp-flip-leaf "+(dir>0?"bp-forward":"bp-reverse");
 const front=(dir>0)?pageAt(isMobile()?current:current+1):pageAt(current);
 const back=(dir>0)?pageAt(toIndex):pageAt(isMobile()?toIndex:toIndex);
 div.innerHTML=`<div class="bp-flip-face bp-flip-front"><div class="bp-paper">${front}</div></div><div class="bp-flip-face bp-flip-back"><div class="bp-paper">${back}</div></div>`;
 spread.appendChild(div);
 return div;
}
function setUnderlay(toIndex,dir){
 if(isMobile()){left.innerHTML=pageAt(toIndex);return}
 if(dir>0){right.innerHTML=pageAt(toIndex+1)}else{left.innerHTML=pageAt(toIndex)}
}
function restore(){render(current)}
function transform(dir,progress){
 const deg=(dir>0?-180:180)*progress;
 // On narrow screens, pages hinge on the same side.
 const adjusted=isMobile()&&dir<0?-deg:deg;
 return `rotateY(${adjusted}deg)`;
}
function finishTurn(success,toIndex,leaf,dir,fromDrag){
 if(!leaf)return;
 leaf.style.transition="transform 500ms cubic-bezier(.25,.65,.3,1)";
 requestAnimationFrame(()=>leaf.style.transform=transform(dir,success?1:0));
 let done=false;
 const commit=()=>{
  if(done)return;done=true;leaf.remove();spread.classList.remove("bp-busy");
  busy=false;render(success?toIndex:current);
 };
 leaf.addEventListener("transitionend",e=>{if(e.target===leaf&&e.propertyName==="transform")commit()},{once:true});
 setTimeout(commit,650);
}
function turn(dir){
 if(busy)return;
 const to=targetFor(dir);
 if(to===current)return;
 if(reduce()){render(to);return}
 busy=true;spread.classList.add("bp-busy");
 const leaf=createLeaf(dir,to);setUnderlay(to,dir);
 leaf.style.transition="none";leaf.style.transform=transform(dir,0);
 requestAnimationFrame(()=>requestAnimationFrame(()=>finishTurn(true,to,leaf,dir,false)));
}
function startDrag(e,button){
 if(busy||e.button!==0)return;
 const dir=Number(button.dataset.grab),to=targetFor(dir);
 if(to===current)return;
 e.preventDefault();busy=true;spread.classList.add("bp-busy");
 const leaf=createLeaf(dir,to);
 leaf.style.transition="none";leaf.style.transform=transform(dir,0);
 setUnderlay(to,dir);
 drag={id:e.pointerId,dir,to,leaf,startX:e.clientX,progress:0,button};
 button.setPointerCapture(e.pointerId);
}
function moveDrag(e){
 if(!drag||e.pointerId!==drag.id)return;
 const dx=e.clientX-drag.startX;
 const width=isMobile()?spread.clientWidth:spread.clientWidth/2;
 drag.progress=Math.max(0,Math.min(1,-dx*drag.dir/Math.max(1,width)));
 drag.leaf.style.transform=transform(drag.dir,drag.progress);
}
function endDrag(e,canceled=false){
 if(!drag||e.pointerId!==drag.id)return;
 const d=drag;drag=null;
 const accepted=!canceled&&(d.progress>.28||Math.abs(e.clientX-d.startX)<8);
 finishTurn(accepted,d.to,d.leaf,d.dir,true);
}
function gotoDoc(id,section=null){
 if(busy||!opened)return;
 const anchor=section===null?null:`${section}`;
 let dest=pages.findIndex(p=>p.docId===id&&(anchor===null||p.anchors.includes(anchor)));
 if(dest<0)dest=pages.findIndex(p=>p.docId===id);
 if(dest<0)return;
 if(dest===current||(!isMobile()&&normalIndex(dest)===current)){if(anchor){const el=(left.querySelector(`[data-section-anchor="${anchor}"]`)||right.querySelector(`[data-section-anchor="${anchor}"]`));el?.classList.add("bp-target-glow")}return}
 // For long jumps, show target immediately; normal adjacent turns use a turning sheet.
 if(Math.abs(dest-current)>(isMobile()?1:2))render(dest);
 else turn(dest>current?1:-1);
 closeRail();
}
function railHTML(){
 return partNames.map(p=>`<details ${p.part===1?"open":""}><summary>Partie ${p.part} — ${escape(p.title)}</summary>${
 chapters.filter(ch=>ch.part===p.part).map(ch=>`<div class="bp-rail-entry"><button type="button" class="bp-railchapter" data-chapter="${ch.n}">${ch.n}. ${escape(ch.title)}</button>
 <details class="bp-rail-sub"><summary>Sous-titres</summary>${ch.headings.map((h,i)=>`<button type="button" data-section="${ch.n}:${i}">${escape(h)}</button>`).join("")}</details></div>`).join("")
 }</details>`).join("");
}
$("#bp-rail-nav").innerHTML=railHTML();
function closeRail(){rail.classList.remove("bp-visible");$("#bp-rail-curtain").classList.add("bp-hidden")}
function toggleRail(){const shown=rail.classList.toggle("bp-visible");$("#bp-rail-curtain").classList.toggle("bp-hidden",!shown)}
function openBook(){
 if(opened||opening)return;
 opening=true;root.classList.add("bp-portal-opening");
 setTimeout(()=>{landing.classList.add("bp-hidden");reader.classList.remove("bp-hidden");opened=true;opening=false;paginate();render(0);window.scrollTo(0,0)},reduce()?50:1440);
}
function closeBook(){
 if(!opened||busy)return;
 if(document.fullscreenElement===reader)document.exitFullscreen?.();
 reader.classList.remove("bp-focus-mode");reader.classList.add("bp-hidden");
 landing.classList.remove("bp-hidden");opened=false;root.classList.remove("bp-portal-opening");
 closeRail();window.scrollTo(0,0);
}
function refreshDimensions(){
 if(!opened||busy||paginating)return;
 const docId=pages[current]?.docId||"title";
 const oldIndex=pages.slice(0,current+1).filter(p=>p.docId===docId).length-1;
 paginate();
 const positions=pages.map((p,i)=>p.docId===docId?i:-1).filter(i=>i>=0);
 render(positions[Math.min(oldIndex,positions.length-1)]??0);
}
function markFullscreen(){
 const on=document.fullscreenElement===reader||reader.classList.contains("bp-focus-mode");
 const b=$("#bp-fullscreen");b.setAttribute("aria-pressed",String(on));
 b.textContent=on?"⤢ Quitter le plein écran":"⛶ Plein écran";
 document.body.classList.toggle("bp-fullscreen-active",on);
 clearTimeout(resizeTimeout);resizeTimeout=setTimeout(refreshDimensions,160);
}
async function fullscreen(){
 if(document.fullscreenElement===reader){
  try{await document.exitFullscreen()}catch(e){}
  markFullscreen();return;
 }
 if(reader.classList.contains("bp-focus-mode")){
  reader.classList.remove("bp-focus-mode");markFullscreen();return;
 }
 if(reader.requestFullscreen){
  try{await reader.requestFullscreen();markFullscreen();return}catch(e){}
 }
 reader.classList.add("bp-focus-mode");
 markFullscreen();
}
root.addEventListener("click",e=>{
 const jump=e.target.closest("[data-chapter]");
 if(jump){gotoDoc("chap-"+jump.dataset.chapter);return}
 const section=e.target.closest("[data-section]");
 if(section){const raw=section.dataset.section.split(":");gotoDoc("chap-"+raw[0],raw.join(":"));return}
 const btn=e.target.closest("[data-action]");if(!btn)return;
 switch(btn.dataset.action){
  case "open":openBook();break;
  case "close":closeBook();break;
  case "prev":turn(-1);break;
  case "next":turn(1);break;
  case "toc":gotoDoc("toc");break;
  case "rail":toggleRail();break;
  case "fullscreen":fullscreen();break;
  case "print":window.print();break;
 }
});
$("#bp-cover-open").addEventListener("click",openBook);
$("#bp-rail-curtain").addEventListener("click",closeRail);
root.querySelectorAll("[data-grab]").forEach(b=>{
 b.addEventListener("pointerdown",e=>startDrag(e,b));
 b.addEventListener("pointermove",moveDrag);
 b.addEventListener("pointerup",endDrag);
 b.addEventListener("pointercancel",e=>endDrag(e,true));
 b.addEventListener("lostpointercapture",e=>{if(drag&&drag.id===e.pointerId)endDrag(e,true)});
});
$("#bp-filter").addEventListener("input",e=>{
 const query=e.target.value.toLocaleLowerCase("fr").trim();
 $("#bp-rail-nav").querySelectorAll(".bp-rail-entry").forEach(el=>{
  const show=!query||el.textContent.toLocaleLowerCase("fr").includes(query);
  el.hidden=!show;
 });
 $("#bp-rail-nav").querySelectorAll("details:not(.bp-rail-sub)").forEach(d=>{
  d.hidden=!!query&&![...d.querySelectorAll(".bp-rail-entry")].some(el=>!el.hidden);
  if(query&&!d.hidden)d.open=true;
 });
});
document.addEventListener("keydown",e=>{
 if(!opened||e.target.closest("input,textarea,select")||e.ctrlKey||e.metaKey||e.altKey)return;
 if(e.key==="ArrowRight"||e.key==="PageDown"){e.preventDefault();turn(1)}
 if(e.key==="ArrowLeft"||e.key==="PageUp"){e.preventDefault();turn(-1)}
 if(e.key==="Escape"&&reader.classList.contains("bp-focus-mode")){reader.classList.remove("bp-focus-mode");markFullscreen()}
 if(e.key.toLowerCase()==="f"){e.preventDefault();fullscreen()}
});
document.addEventListener("fullscreenchange",markFullscreen);
window.addEventListener("resize",()=>{clearTimeout(resizeTimeout);resizeTimeout=setTimeout(refreshDimensions,220)});
let touch=null;
spread.addEventListener("touchstart",e=>{
 if(e.target.closest("[data-grab]"))return;
 if(e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};
},{passive:true});
spread.addEventListener("touchend",e=>{
 if(!touch)return;
 const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;
 if(Math.abs(dx)>80&&Math.abs(dx)>Math.abs(dy)*1.4)turn(dx<0?1:-1);
 touch=null;
},{passive:true});
})();