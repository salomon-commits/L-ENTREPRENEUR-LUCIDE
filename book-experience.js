(function bookApp(){
  "use strict";
  const chapterNodes=[...document.querySelectorAll("section.chapter")];
  const foreword=document.querySelector("#foreword"),refs=document.querySelector("#references");
  if(!chapterNodes.length||!foreword)return;
  const chapters=chapterNodes.map(el=>({
    id:el.id,number:Number(el.dataset.number),part:el.dataset.part,
    partTitle:el.dataset.parttitle,title:el.dataset.title,
    headings:[...el.querySelectorAll(".prose > h3")].map(x=>x.textContent.trim()),el
  }));
  const parts=[...new Set(chapters.map(c=>c.part))].map(id=>({id,title:chapters.find(c=>c.part===id).partTitle}));
  const emblem=`<svg viewBox="0 0 340 270" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
   <defs><linearGradient id="etch" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d7bc8b" stop-opacity=".12"/><stop offset=".5" stop-color="#f0d4a3" stop-opacity=".77"/><stop offset="1" stop-color="#b38d5b" stop-opacity=".12"/></linearGradient></defs>
   <g stroke="url(#etch)" stroke-width=".85">
    <circle cx="170" cy="144" r="132" opacity=".55"/><circle cx="170" cy="144" r="116" opacity=".5"/>
    <circle cx="170" cy="144" r="97"/><circle cx="170" cy="144" r="84" opacity=".42"/>
    <path d="M95 99h75v20h-47v26h47v20h-47v25h47" stroke-width="1.8"/>
    <path d="M245 190h-75v-25h47v-20h-47v-26h47V99h-47" stroke-width="1.8"/>
    <path d="M170 25v235M52 144h236" stroke-dasharray="1 9" opacity=".27"/>
    <path d="M170 97c-14 20-29 37-29 49 0 16 12 29 29 29s29-13 29-29c0-12-15-29-29-49Z" stroke-width="1.4"/>
    <path d="M170 1v45m0 197v26M27 144h46m194 0h46" stroke-width=".7"/>
    <path d="M125 39l12 25m78 0 12-25M66 198l28-11m152 0 28 11" opacity=".6"/>
   </g><circle cx="170" cy="144" r="3.5" fill="#efcea0" opacity=".85"/></svg>`;
  const portal=document.createElement("div");
  portal.id="book-portal";portal.className="book-portal";
  portal.innerHTML=`
   <section class="bp-landing" id="bp-landing" aria-label="Livre fermé">
    <div class="bp-table"></div><div class="bp-lamp"></div>
    <div class="bp-heading"><span class="pretitle">La bibliothèque du dirigeant · édition 2026</span>
      <h1>Un ouvrage à ouvrir.<br>Une pensée à approfondir.</h1>
      <p>La lucidité ne se révèle pas au premier regard.</p></div>
    <div class="bp-closed-stage"><div class="bp-book-spine"></div><div class="bp-book-block"></div>
     <button class="bp-closed-cover" type="button" id="bp-cover-open" aria-label="Ouvrir le livre L'Entrepreneur lucide">
      <span class="bp-cover-inner"><span class="small">Traité d'entrepreneuriat · Stratégie & gouvernance</span>
       <span class="bp-cover-art">${emblem}</span>
       <span><h2>L’Entrepreneur<br>lucide</h2><p>L’art de bâtir, gouverner, protéger et transmettre une entreprise.</p></span>
       <span class="bp-author">Guede Camus Salomon</span></span>
      <span class="bp-cover-back">L’art de voir au-delà.</span>
     </button></div>
    <button class="bp-open-prompt" data-bp-action="open" type="button">Ouvrir le livre <span aria-hidden="true">↗</span></button>
    <span class="bp-shelf-note">Un livre interactif de Guede Camus Salomon</span>
   </section>
   <div class="bp-reader bp-hidden" id="bp-reader">
    <header class="bp-readerbar"><strong>L’Entrepreneur lucide <span style="color:#c7a66b">·</span> Guede Camus Salomon</strong>
     <nav class="bp-tools"><button class="bp-tool bp-mobile-rail-toggle" data-bp-action="rail" type="button">☰ Sommaire</button>
      <button class="bp-tool" data-bp-action="toc" type="button">Sommaire</button>
      <button class="bp-tool" data-bp-action="close" type="button">Fermer le livre</button>
      <button class="bp-tool" data-bp-action="print" type="button">Imprimer</button></nav></header>
    <div class="bp-reading-layout">
     <aside class="bp-rail" id="bp-rail" aria-label="Table des matières"><h2>Table des matières</h2>
      <input id="bp-filter" type="search" placeholder="Rechercher un chapitre…" aria-label="Rechercher un chapitre">
      <nav id="bp-rail-nav"></nav></aside>
     <div class="bp-readerstage"><div class="bp-book-position">
       <div class="bp-spread" id="bp-spread" aria-live="polite">
        <article id="bp-page-left" class="bp-paper bp-paper-left"></article>
        <article id="bp-page-right" class="bp-paper bp-paper-right"></article>
        <button class="bp-turn-edge" type="button" data-bp-action="prev" aria-label="Tourner la page vers l'arrière">‹</button>
        <button class="bp-turn-edge" type="button" data-bp-action="next" aria-label="Tourner la page vers l'avant">›</button>
       </div></div>
      <nav class="bp-footer-nav">
       <button type="button" data-bp-action="prev" id="bp-prev">← Précédent</button>
       <span id="bp-counter" class="bp-pagecount"></span>
       <button type="button" data-bp-action="next" id="bp-next">Suivant →</button>
      </nav></div></div>
    <button id="bp-rail-curtain" class="bp-rail-curtain bp-hidden" type="button" aria-label="Fermer le sommaire"></button>
   </div>`;
  document.body.appendChild(portal);
  document.body.classList.add("experience-on");
  const $=sel=>portal.querySelector(sel);
  const landing=$("#bp-landing"),reader=$("#bp-reader"),left=$("#bp-page-left"),right=$("#bp-page-right"),
    spread=$("#bp-spread"),rail=$("#bp-rail"),curtain=$("#bp-rail-curtain"),
    counter=$("#bp-counter"),prev=$("#bp-prev"),next=$("#bp-next");
  const mobile=()=>window.matchMedia("(max-width:770px)").matches;
  const reduced=()=>window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const kicker=s=>`<span class="bp-kicker">${esc(s)}</span>`;
  let current=0,side=0,busy=false,opened=false,opening=false;
  const count=chapters.length+3;
  function titlePage(){
    return kicker("Page de titre")+`<div class="bp-titleleaf">
      <span class="bp-decor">✦</span><h1>L’Entrepreneur<br>lucide</h1><div class="bp-rule"></div>
      <p>L’art de bâtir, gouverner, protéger et transmettre une entreprise.</p>
      <div class="bp-author-title">Guede Camus Salomon</div><small>Édition 2026</small></div>`;
  }
  function prefacePage(){
    const copy=foreword.cloneNode(true);
    copy.querySelector("#book-index")?.remove();
    copy.querySelector(".cover-actions")?.remove();
    const heads=copy.querySelectorAll("h2");
    if(heads.length>1)heads[heads.length-1].remove();
    return kicker("Avant-propos")+copy.innerHTML;
  }
  function tocGroup(part){
    return `<div class="bp-toc-group"><h3>Partie ${esc(part.id)} — ${esc(part.title)}</h3>`+
      chapters.filter(c=>c.part===part.id).map(c=>{
        const subs=c.headings.map((h,i)=>`<button type="button" data-bp-unit="${c.number+1}" data-bp-heading="${i}">↳ ${esc(h)}</button>`).join("");
        return `<div class="bp-toc-entry"><div class="bp-toc-row">
          <button type="button" class="bp-toc-link" data-bp-unit="${c.number+1}">${String(c.number).padStart(2,"0")}. ${esc(c.title)}</button>
          <button type="button" class="bp-toc-expand" data-bp-expand="${c.number}" aria-label="Afficher les sous-titres du chapitre ${c.number}" aria-expanded="false">+</button>
          </div><div class="bp-toc-sub" id="bp-sub-${c.number}">${subs}</div></div>`;
      }).join("")+"</div>";
  }
  function tocSpread(){
    return {left:kicker("Sommaire interactif")+
      "<h2>Table des matières</h2><p>Choisissez un chapitre ou le symbole + pour découvrir ses sous-titres cliquables.</p>"+
      parts.slice(0,5).map(tocGroup).join(""),
      right:kicker("Les dix parties")+"<h2>Du risque à la transmission</h2>"+
      parts.slice(5).map(tocGroup).join("")};
  }
  function chapterSpread(ch){
    const nodes=[...ch.el.querySelector(".prose").children];
    const pre=[],groups=[];let group=null;
    for(const node of nodes){
      if(node.tagName==="H3"){group=[node];groups.push(group)}
      else if(group)group.push(node);else pre.push(node);
    }
    let key=0;
    function groupHTML(chunks){
      return chunks.map(g=>g.map(node=>{
        if(node.tagName==="H3"){
          const copy=node.cloneNode(true);
          copy.id=`bp-head-${ch.number}-${key++}`;
          return copy.outerHTML;
        }
        return node.outerHTML;
      }).join("")).join("");
    }
    const first=groupHTML(groups.slice(0,1)),rest=groupHTML(groups.slice(1));
    const internal=`<div class="bp-internal-toc"><strong>Dans ce chapitre</strong>${
      ch.headings.map((h,i)=>`<button type="button" data-bp-unit="${ch.number+1}" data-bp-heading="${i}">${esc(h)}</button>`).join("")
    }</div>`;
    return {left:kicker(`Partie ${ch.part} · Chapitre ${String(ch.number).padStart(2,"0")}`)+
      `<h2>${esc(ch.title)}</h2>`+pre.map(x=>x.outerHTML).join("")+internal+first,
      right:kicker(`Chapitre ${String(ch.number).padStart(2,"0")} · suite`)+
      "<h2>Approfondir la réflexion</h2>"+rest+
      "<p class=\"bp-bookmark\">La connaissance devient utile lorsqu’elle éclaire une décision vérifiable.</p>"};
  }
  function lastSpread(){
    const c=refs.cloneNode(true);c.querySelector("button")?.remove();
    return {left:kicker("Annexes et références")+"<h2>Pour aller plus loin</h2>"+c.innerHTML,
      right:kicker("Fin de l’ouvrage")+`<div class="bp-titleleaf"><span class="bp-decor">✦</span>
      <h1>La lucidité se cultive.</h1><p>Comprendre. Construire. Gouverner. Protéger. Transmettre.</p>
      <div class="bp-rule"></div><span class="bp-author-title">Guede Camus Salomon</span>
      <button class="bp-tool bp-primary" type="button" data-bp-unit="1">Revoir le sommaire</button></div>`};
  }
  function unit(i){
    if(i===0)return {left:titlePage(),right:prefacePage()};
    if(i===1)return tocSpread();
    if(i===count-1)return lastSpread();
    return chapterSpread(chapters[i-2]);
  }
  function render(i,s=0){
    current=i;side=s;
    const u=unit(i);
    left.innerHTML=mobile()?(s===0?u.left:u.right):u.left;
    right.innerHTML=u.right;
    left.scrollTop=0;right.scrollTop=0;
    counter.textContent=mobile()?`${i*2+s+1} / ${count*2}`:`${i+1} / ${count}`;
    prev.disabled=i===0&&(!mobile()||s===0);
    next.disabled=i===count-1&&(!mobile()||s===1);
    portal.querySelectorAll(".bp-railchapter").forEach(el=>el.classList.toggle("active",Number(el.dataset.bpUnit)===i));
    try{localStorage.setItem("elucide_reader",JSON.stringify({unit:i,side:s}))}catch(e){}
  }
  function headingSide(k){return k===0?0:1}
  function focusHeading(i,k){
    const page=mobile()?left:(headingSide(k)===0?left:right);
    const h=page.querySelector(`#bp-head-${i-1}-${k}`);
    if(h)page.scrollTo({top:h.offsetTop-page.offsetTop-25,behavior:"smooth"});
  }
  function gotoUnit(i,k=null){
    if(busy||i<0||i>=count)return;
    const targetSide=(mobile()&&k!==null)?headingSide(k):0;
    if(i===current&&(!mobile()||side===targetSide)){
      if(k!==null)focusHeading(i,k);closeRail();return;
    }
    flip(i,targetSide,i<current?-1:1,()=>{if(k!==null)focusHeading(i,k)});
    closeRail();
  }
  function flip(i,s,dir,onDone){
    if(busy)return;
    if(reduced()){render(i,s);onDone?.();return}
    busy=true;spread.classList.add("bp-busy");
    const old=unit(current),newUnit=unit(i);
    const from=mobile()?(side===0?old.left:old.right):(dir===1?old.right:old.left);
    const to=mobile()?(s===0?newUnit.left:newUnit.right):(dir===1?newUnit.left:newUnit.right);
    const leaf=document.createElement("div");
    leaf.className="bp-flip-leaf "+(dir===1?"bp-forward":"bp-reverse");
    leaf.innerHTML=`<div class="bp-flip-face bp-flip-front"><div class="bp-paper">${from}</div></div>
      <div class="bp-flip-face bp-flip-back"><div class="bp-paper">${to}</div></div>`;
    spread.appendChild(leaf);
    if(mobile())left.innerHTML=to;
    else if(dir===1)right.innerHTML=newUnit.right;
    else left.innerHTML=newUnit.left;
    let done=false;
    function finish(){
      if(done)return;done=true;leaf.remove();spread.classList.remove("bp-busy");
      render(i,s);busy=false;onDone?.();
    }
    leaf.addEventListener("transitionend",e=>{if(e.target===leaf&&e.propertyName==="transform")finish()},{once:true});
    requestAnimationFrame(()=>requestAnimationFrame(()=>leaf.classList.add("bp-flipping")));
    setTimeout(finish,1270);
  }
  function step(dir){
    if(busy)return;
    if(mobile()){
      if(dir===1){if(side===0)flip(current,1,1);else if(current<count-1)flip(current+1,0,1)}
      else {if(side===1)flip(current,0,-1);else if(current>0)flip(current-1,1,-1)}
    }else if(current+dir>=0&&current+dir<count)flip(current+dir,0,dir);
  }
  function showReader(){
    landing.classList.add("bp-hidden");reader.classList.remove("bp-hidden");opened=true;render(0,0);window.scrollTo(0,0);
  }
  function openBook(){
    if(opening||opened)return;opening=true;
    portal.classList.add("bp-portal-opening");
    setTimeout(()=>{showReader();opening=false},reduced()?80:1480);
  }
  function closeBook(){
    if(busy||!opened)return;
    opened=false;reader.classList.add("bp-hidden");landing.classList.remove("bp-hidden");
    portal.classList.remove("bp-portal-opening");closeRail();window.scrollTo(0,0);
  }
  function closeRail(){rail.classList.remove("bp-visible");curtain.classList.add("bp-hidden")}
  function toggleRail(){
    const visible=rail.classList.toggle("bp-visible");
    curtain.classList.toggle("bp-hidden",!visible);
  }
  $("#bp-rail-nav").innerHTML=parts.map(p=>`<details ${p.id==="1"?"open":""}>
    <summary>Partie ${esc(p.id)} — ${esc(p.title)}</summary>${
      chapters.filter(c=>c.part===p.id).map(c=>`<button type="button" class="bp-railchapter"
      data-bp-unit="${c.number+1}">${c.number}. ${esc(c.title)}</button>`).join("")
    }</details>`).join("");
  portal.addEventListener("click",e=>{
    const expand=e.target.closest("[data-bp-expand]");
    if(expand){
      const x=portal.querySelector("#bp-sub-"+expand.dataset.bpExpand);
      const visible=x.classList.toggle("is-visible");
      expand.textContent=visible?"−":"+";
      expand.setAttribute("aria-expanded",String(visible));
      return;
    }
    const link=e.target.closest("[data-bp-unit]");
    if(link){
      gotoUnit(Number(link.dataset.bpUnit),link.hasAttribute("data-bp-heading")?Number(link.dataset.bpHeading):null);
      return;
    }
    const btn=e.target.closest("[data-bp-action]");
    if(!btn)return;
    switch(btn.dataset.bpAction){
      case "open":openBook();break;case "close":closeBook();break;
      case "prev":step(-1);break;case "next":step(1);break;
      case "toc":gotoUnit(1);break;case "rail":toggleRail();break;
      case "print":window.print();break;
    }
  });
  $("#bp-cover-open").addEventListener("click",openBook);
  curtain.addEventListener("click",closeRail);
  $("#bp-filter").addEventListener("input",e=>{
    const q=e.target.value.toLocaleLowerCase("fr").trim();
    $("#bp-rail-nav").querySelectorAll("details").forEach(d=>{
      let hits=0;d.querySelectorAll(".bp-railchapter").forEach(b=>{
        const found=!q||b.textContent.toLocaleLowerCase("fr").includes(q);
        b.hidden=!found;if(found)hits++;
      });
      d.hidden=!hits;if(q&&hits)d.open=true;
    });
  });
  document.addEventListener("keydown",e=>{
    if(!opened||e.target.matches("input,textarea,select")||e.ctrlKey||e.altKey||e.metaKey)return;
    if(e.key==="ArrowRight"){e.preventDefault();step(1)}
    if(e.key==="ArrowLeft"){e.preventDefault();step(-1)}
    if(e.key==="Escape")closeRail();
  });
  let t=null;
  spread.addEventListener("touchstart",e=>{
    if(e.touches.length===1)t={x:e.touches[0].clientX,y:e.touches[0].clientY};
  },{passive:true});
  spread.addEventListener("touchend",e=>{
    if(!t)return;
    const dx=e.changedTouches[0].clientX-t.x,dy=e.changedTouches[0].clientY-t.y;
    if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.3)step(dx<0?1:-1);
    t=null;
  },{passive:true});
  window.addEventListener("resize",()=>{if(opened&&!busy)render(current,mobile()?side:0)});
})();