/* ---------- interfaz ---------- */
const $=id=>document.getElementById(id);
const fmt=n=>n<1000?String(Math.floor(n)):n<1e6?(n/1e3).toFixed(n<1e4?1:0)+'k':(n/1e6).toFixed(2)+'M';
const toolsEl=$('tools'),btns={};
function makeIcon(k){
  const c=mkCanvas(40,54);
  const prev=ctx,pc={...cam},pn=NIGHT,pr=ROT;try{ctx=hdctx(c);cam.ox=20;cam.oy=36;NIGHT=0;ROT=0;GLOWS=[];
  const t={k,s:k==='edificio'?0:k==='ladrillo'?0:3,f:DEFS[k].f0,b:0};
  if(k==='mejorar'){diamond(0,0,0,'#d3c08d');const cx=20,cy=30,pts=[];for(let k2=0;k2<10;k2++){const r=k2%2?5:12,an=-Math.PI/2+k2*Math.PI/5;pts.push([cx+Math.cos(an)*r,cy+Math.sin(an)*r])}poly(pts,'#ffd84d');poly(pts.map(([a,b])=>[cx+(a-cx)*.5,cy+(b-cy)*.5-1]),'#fff3b0')}
  else if(k==='demoler'){diamond(0,0,0,'#d3c08d');line(13,38,25,48,'#d64545',false,3);line(25,38,13,48,'#d64545',false,3)}
  else if(k==='ver'){diamond(0,0,0,'#d3c08d');handPx(ctx,12,22,1.5)}
  else if(MULTI(k)||k==='tim'||DEFS[k].trophy){GLOWS=null;const sp=makeSprite(t,0,0,0);ctx.imageSmoothingEnabled=false;const sw=sp.c.width/RES,sh2=sp.c.height/RES,sc=Math.min(38/sw,52/sh2);ctx.drawImage(sp.c,rr(20-sw*sc/2),rr(52-sh2*sc),rr(sw*sc),rr(sh2*sc));GLOWS=[]}
  else{drawGround(0,0,k==='calle'?{k:'calle',s:1}:['edificio','ladrillo','torre','oficinas','palma','caseta','mejorar'].includes(k)?{k:'lote',s:1}:t);drawObj(t,0,0,true)}
  GLOWS=null;if(k!=='demoler'&&k!=='ver'&&!MULTI(k)&&k!=='tim'&&!DEFS[k].trophy)outline(ctx);
  }catch(e){console.warn('ícono',k,e)}finally{ctx=prev;Object.assign(cam,pc);NIGHT=pn;ROT=pr;GLOWS=null}return c;
}
/* barra de abajo agrupada: herramientas fijas + pestañas */
const FIXED=['ver','calle','mejorar','demoler'];
const TABS=[['viv','Vivienda',['edificio','ladrillo','torre']],['neg','Negocios',['cafe','tomates','padel','resto','bar','oficinas','barber','unas','paleteria','boliche','gym','cine']],['ser','Servicios',['parque','malecon','plaza','dogpark','cancha','estac','caseta','escuela','clinica','golf','torreagua']],['esp','Especiales',['domo','kiosco','mirador','cultura','teleferico','bosque','museo','rasca','beis','plazacom','metro']]];
const tabOf=k=>{for(const t of TABS)if(t[2].includes(k))return t[0];return FIXED.includes(k)?null:'ser'};
let TAB=(()=>{try{const v=localStorage.getItem('distritoDomo.tab');if(TABS.some(t=>t[0]===v))return v}catch(e){}return 'viv'})();
function setTab(id,quiet){TAB=id;try{localStorage.setItem('distritoDomo.tab',id)}catch(e){}
  for(const k in btns){const tb=tabOf(k);btns[k].hidden=!!tb&&tb!==TAB}
  document.querySelectorAll('#tabs button').forEach(b=>{const on=b.dataset.t===TAB;b.setAttribute('aria-selected',on);b.tabIndex=on?0:-1});
  const tl=$('tools');if(tl&&!quiet)tl.scrollLeft=0;refreshUI(true)}
function buildTabs(){const el=$('tabs');el.innerHTML='';TABS.forEach(([id,name],i)=>{const b=document.createElement('button');b.type='button';b.dataset.t=id;b.setAttribute('role','tab');
  b.innerHTML=`<span class="tn">${name}</span><span class="dot" aria-hidden="true"></span><small class="tl"></small>`;b.title=`${name} (tecla ${i+1})`;b.onclick=()=>setTab(id);el.appendChild(b)})}
function buildTools(){
  toolsEl.innerHTML='';for(const k in btns)delete btns[k];buildTabs();
  [...FIXED,...ORDER.filter(k=>!FIXED.includes(k))].forEach(k=>{if(!DEFS[k]||DEFS[k].hidden)return;
    if(k===ORDER.filter(q=>!FIXED.includes(q))[0]){const sep=document.createElement('span');sep.className='tsep';sep.setAttribute('aria-hidden','true');toolsEl.appendChild(sep)}
    const b=document.createElement('button');b.type='button';b.className='tool box'+(FIXED.includes(k)?' fx':'');b.id='tool-'+k;
    b.appendChild(makeIcon(k));
    b.insertAdjacentHTML('beforeend',`<span class="n">${DEFS[k].name.replace('Estacionamiento','Estaciona\u00ADmiento').replace('Restaurante','Restau\u00ADrante').replace('Centro Cultural','Centro\u00A0Cultural')}</span><span class="c"></span>`);
    b.addEventListener('click',()=>pick(k));toolsEl.appendChild(b);btns[k]=b;
  });
  setTab(TAB,true);
}
/* ficha: qué hace cada cosa, generada de sus datos */
const GN={fam:'familias',pro:'profesionistas',est:'estudiantes'},GL=a=>a.length===3?'todos':a.map(g=>GN[g]).join(' y ');
const SPECIAL=['bosque','museo','rasca','beis','plazacom','metro','clinica','ver','calle','mejorar','demoler','torreagua','domo','kiosco','mirador','cultura','teleferico'];
function infoOf(k){const d=DEFS[k];if(!d)return '';
  if(SPECIAL.includes(k))return d.desc;
  if(d.per){const hm=HMIX[k],top=Object.keys(hm).sort((a,b)=>hm[b]-hm[a])[0];return `Vivienda: ${d.per} vecinos por piso, empieza con ${d.f0} pisos (máx. ${fmaxOf(k)}, uno más por cada nivel). Viven sobre todo ${GN[top]}. Toca uno tuyo con esta herramienta para subirle un piso.`}
  const p=[];if(d.verde)p.push('verde');if(d.com&&LIKE[k])p.push(`comercio para ${GL(LIKE[k])}`);if(COMG[k])p.push('algo de comercio para familias y estudiantes');if(d.park)p.push('estacionamiento');if(d.dog)p.push('espacio para perros (uno alcanza para ~18 vecinos con mascota)');if(d.seg)p.push('controla las fiestas de ~80 estudiantes');
  let t=(p.length?`Da ${p.join(', ')}`:'')+(d.R?` a ${d.R} cuadras`:'')+'.';if(d.val)t+=' Sube la plusvalía alrededor.';
  if(isBiz(k))t+=' Gana según cuántos clientes vivan cerca; si pones otro igual al lado, se reparten la clientela.';else if(d.inc)t+=` Deja $${d.inc}/s.`;
  if(k==='cafe'||k==='resto')t+=' Junto a un parque o plaza gana 50% más.';if(k==='cafe'||k==='unas')t+=k==='cafe'?' Junto a un salón de uñas, los dos ganan 15% más.':' Junto a un café, los dos ganan 15% más.';
  if(k==='boliche')t+=' Ocupa 2 terrenos. Junto a un café o restaurante gana 20% más; de noche se llena.';if(k==='cine')t+=' Ocupa 2 terrenos. Con lluvia gana más en vez de menos.';if(k==='golf')t+=' Ocupa 2 terrenos. Es el área verde más grande que hay.';
  if(k==='gym')t+=' Con Oficinas a 3 cuadras gana 25% más.';if(k==='paleteria')t+=' En una ola de calor gana el triple y refresca a los vecinos de alrededor.';if(k==='barber')t+=' El poste gira todo el día.';
  if(DISLIKE[k])t+=` A los ${GN[DISLIKE[k]]} no les gusta tenerlo cerca.`;if(k==='bar')t+=' De noche hace ruido.';
  return t}
const lvBenefit=t=>t.k==='clinica'?'+30% satisfacción':DEFS[t.k].per?'+1 piso, +25% renta':isBiz(t.k)?'+50% ganancia':'cubre 30% más';
function pick(k){
  if(!S.unl.includes(k)){const m=misOf(k);say(m?`${DEFS[k].name} se abre al cumplir el encargo «${m.name}» (aparece con ${fmt(m.min)} vecinos): ${m.txt}`:`${DEFS[k].name} se desbloquea al llegar a ${DEFS[k].unlock} vecinos.`,true);return}
  tool=k;setCursor();btns[k].classList.remove('new');{const tb=tabOf(k);if(tb&&tb!==TAB)setTab(tb)}refreshTabs();
  if(SZ(k)>1&&S.g.some(t=>t.k==='reserva'&&t.p===k)){say(`${DEFS[k].name}: ${DEFS[k].desc} Toca la esquina de su terreno reservado (cerca naranja) o de cualquier espacio libre de ${SZ(k)}×${SZ(k)}. Cuesta $${fmt(costOf(k))}.`,true);refreshUI(true);return}
  const d=DEFS[k];say(`${d.name}: ${infoOf(k)}${k==='demoler'||k==='mejorar'||k==='calle'||k==='ver'?'':' Cuesta $'+fmt(costOf(k))+' y $'+(d.upk*(d.per?d.f0:1)).toFixed(2)+'/s de mantenimiento.'}`,true);
  refreshUI(true);
}
function markNew(k){btns[k]&&btns[k].classList.add('new');refreshTabs()}
function refreshTabs(){document.querySelectorAll('#tabs button').forEach(b=>{const T_=TABS.find(t=>t[0]===b.dataset.t),ks=T_[2].filter(k=>btns[k]);
  const unl=ks.filter(k=>S.unl.includes(k));b.classList.toggle('has-new',ks.some(k=>btns[k].classList.contains('new')));b.classList.toggle('locked',!unl.length);
  const nx=ks.filter(k=>!S.unl.includes(k)&&DEFS[k].unlock<Infinity).map(k=>DEFS[k].unlock).sort((a,c)=>a-c)[0];b.querySelector('.tl').textContent=!unl.length&&nx?`a los ${nx.toLocaleString('es-MX')}`:''})}
let lastUI=0;
// panel de vecinos plegable: en pantallas chicas empieza plegado; se recuerda lo que elija el jugador
let NMIN=(()=>{try{const v=localStorage.getItem('distritoDomo.panel');if(v)return v==='min'}catch(e){}return (window.innerHeight||900)<720||(window.innerWidth||1200)<700})();
{const el=document.getElementById('needs'),tg=e=>{e.stopPropagation();NMIN=!NMIN;try{localStorage.setItem('distritoDomo.panel',NMIN?'min':'max')}catch(_){}refreshUI(true)};
  el.addEventListener('click',tg);el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();tg(e)}})}
function refreshUI(force){
  if(!force&&T-lastUI<.2)return;lastUI=T;if(force)refreshTabs();
  $('sV').textContent=`${Math.floor(S.v+1e-6).toLocaleString('es-MX')} / ${stats.cap.toLocaleString('es-MX')}`;$('sP').textContent=(S.$<0?'−$':'$')+fmt(Math.abs(S.$));
  const inc=stats.income;$('sI').textContent=(inc<0?'−$':'+$')+(Math.abs(inc)<100?Math.abs(inc).toFixed(1):fmt(Math.abs(inc)));$('sI').parentElement.classList.toggle('bad',inc<0);
  $('sP').parentElement.classList.toggle('bad',S.$<0);
  $('bank').textContent=S.loan?'Crédito · $'+fmt(S.loan.left):'Crédito';
  {const mb=$('misb');if(mb){mb.hidden=!(S.maxV>=MIS_ON);const nr=S.mis?S.mis.ready.length:0,h=`<span class='ic' aria-hidden='true'>★</span><span class='lb'>Encargos</span>${nr?` <span class='nr'>${nr}✓</span>`:''}`;if(mb.dataset.h!==h){mb.dataset.h=h;mb.innerHTML=h;mb.setAttribute('aria-label',nr?`Encargos: ${nr} listos para cobrar`:'Encargos')}mb.classList.toggle('rd',nr>0)}}
  const sat=stats.sat;$('sA').textContent=Math.round(sat*100)+'%';$('satBox').classList.toggle('bad',sat<.4);$('satBox').classList.toggle('warn',sat>=.4&&sat<.6);
  const col=x=>x>=.8?'#2f80c8':x>=.5?'#e0a92b':'#e66100';
  const nf=n=>Math.floor(n).toLocaleString('es-MX'),pop=S.pop,gsr=GROUPS.map(([g,l])=>`<span class="r"><span>${l}</span><em>${nf(pop[g])}</em></span><i><b style="width:${Math.round(stats.gs[g]*100)}%;background:${col(stats.gs[g])}"></b></i>`).join('')+`<span>Fiestas</span><i title="ruido de los estudiantes"><b style="width:${Math.round(Math.min(1,stats.nuis/.2)*100)}%;background:#e66100"></b></i><span style="grid-column:1/3;color:var(--muted)">Con mascota: ${Math.round((stats.petSh||0)*100)}%</span>`;
  const ndEl=$('needs');ndEl.classList.toggle('min',NMIN);ndEl.setAttribute('aria-expanded',!NMIN);
  if(NMIN){let wk=null,wv=1;for(const [k,l] of NEEDS){const v=stats.sc[k];if(v<wv){wv=v;wk=l}}if(S.v>800){const w=Math.min(1,(stats.wcap||1000)/Math.max(1,S.v));if(w<wv){wv=w;wk='Agua'}}
    ndEl.innerHTML=`▸ Vecinos <b>${nf(S.v)}</b> · `+(wv<.6?`<span class="fl">falta ${wk}</span>`:'todo bien')}
  else ndEl.innerHTML=`<span class="hd">Vecinos<span class="tg">▾ ocultar</span></span>`+gsr+`<span class="hd nd">Necesidades</span>`+NEEDS.map(([k,l])=>`<span class="nd">${l}</span><i class="nd"><b style="width:${Math.round(stats.sc[k]*100)}%;background:${col(stats.sc[k])}"></b></i>`).join('')+(S.v>800?(()=>{const w=Math.min(1,(stats.wcap||1000)/Math.max(1,S.v));return `<span class="nd">Agua</span><i class="nd" title="El agua alcanza para ${stats.wcap||1000} vecinos"><b style="width:${Math.round(w*100)}%;background:${col(w>=1?1:w>=.85?.6:.2)}"></b></i>`})():'')+(S.ev?`<span style="grid-column:1/3;color:#c2410c">${stats.ev?stats.ev.name:''} · ${Math.ceil(S.ev.t)}s</span>`:'')+(stats.noise>.01?`<span class="nd">Ruido</span><i class="nd"><b style="width:${Math.round(stats.noise/.12*100)}%;background:#e66100"></b></i>`:'');
  const hr=(S.clock/DAY*24+6)%24,h=Math.floor(hr),m=Math.floor((hr-h)*60/15)*15;
  $('sH').textContent=`${(h%12)||12}:${String(m).padStart(2,'0')} ${h<12?'am':'pm'}`;
  for(const k of ORDER){const b=btns[k],lock=!S.unl.includes(k);
    b.classList.toggle('locked',lock);b.setAttribute('aria-pressed',tool===k);
    const c=b.querySelector('.c');
    if(lock)c.textContent=DEFS[k].unlock===Infinity?'Encargo':`${DEFS[k].unlock} vecinos`;
    else if(k==='demoler')c.textContent='+50%';
    else if(k==='ver')c.textContent='solo mira';
    else if(k==='mejorar'){let mn=Infinity;if(stats.VAL)S.g.forEach((t,i)=>{if(LV[t.k]&&!(t.b>0)&&!(t.lu>0)&&lvOf(t)<4&&stats.VAL[i]>=LVTH[lvOf(t)+1]){const c2=lvCost(t,i);if(c2<mn)mn=c2}});c.textContent=mn<Infinity?'desde $'+fmt(mn):'★ nivel';b.classList.toggle('poor',mn<Infinity&&S.$<mn)}
    else if(DEFS[k].max&&(stats.counts[k]||0)>=DEFS[k].max)c.textContent='Construido';
    else if(DEFS[k].trophy){c.textContent='Gratis';b.classList.remove('poor')}
    else{const cost=costOf(k);c.textContent='$'+fmt(cost);b.classList.toggle('poor',S.$<cost)}}
}
let pendLot=null,pendT=0,pendConv=null,pendConvT=0;
function tileInfo(i){
  const t=S.g[i],x=i%N,y=Math.floor(i/N),v=stats.VAL?Math.round(stats.VAL[i]*100):0,d=DEFS[t.k];
  const near=(stats.A||[]).filter(a=>a.d.val&&Math.abs(a.x-x)+Math.abs(a.y-y)<=a.d.val[1]).map(a=>a.d.name);
  const uniq=[...new Set(near)].slice(0,3);let bad=[];
  for(let yy=Math.max(0,y-3);yy<=Math.min(N-1,y+3);yy++)for(let xx=Math.max(0,x-3);xx<=Math.min(N-1,x+3);xx++){const q=S.g[idx(xx,yy)],dd=Math.abs(xx-x)+Math.abs(yy-y);if(q.hw&&dd<=2)bad.push('ruido de la avenida');if(q.k==='fabrica'&&!S.da&&dd<=3)bad.push('la fábrica')}
  bad=[...new Set(bad)];
  let txt=`${nameOf(t)} · plusvalía ${v}/100`;if(t.k==='tanque'||t.k==='torreagua')txt+=` · el agua alcanza para ${fmt(stats.wcap||1000)} vecinos (hoy hay ${Math.floor(S.v)})`;if(LV[t.k]){const L=lvOf(t);txt+=L<4?` · nivel ${L} de 4 (el siguiente pide plusvalía ${Math.round(LVTH[L+1]*100)} y $${fmt(lvCost(t,i))})`:' · nivel máximo'}
  if(uniq.length)txt+=` · la suben: ${uniq.join(', ')}`;if(bad.length)txt+=` · la baja: ${bad.join(' y ')}`;
  const b=stats.Bi&&stats.Bi.get(i);
  if(b){const falta=Object.keys(b.sc).filter(k=>b.sc[k]<.7).map(k=>NEEDTXT[k][0]);txt+=falta.length?` · le falta cerca: ${falta.join(', ')}`:' · tiene todo cerca'}
  return txt+'.';
}
function renderMoney(){const b=$('moneybox');if(!b||b.hidden)return;const st=stats,m=v=>`${v<0?'−':'+'}$${Math.abs(v).toFixed(Math.abs(v)<100?1:0)}/s`;
  const top=[...EARN.values()].filter(a=>!(S.g[a.i]&&S.g[a.i].b>0)).sort((a,b2)=>b2.earn-a.earn).slice(0,3);
  b.innerHTML=`<h2>¿De dónde sale mi dinero?<button class="x" type="button" aria-label="Cerrar">✕</button></h2>
   <div class="r"><span>Rentas de ${Math.floor(S.v).toLocaleString('es-MX')} vecinos</span><span class="pos">${m(st.rent||0)}</span></div>
   <div class="r"><span>Negocios${bootMul()>1?` (arranque ×${bootMul()} hasta ${(S.maxV<ECO.boot[0]?ECO.boot[0]:ECO.boot[2])} vecinos)`:''}</span><span class="pos">${m(st.biz||0)}</span></div>
   ${st.tour?`<div class="r"><span>Turismo</span><span class="pos">${m(st.tour)}</span></div>`:''}
   <div class="r"><span>Mantenimiento</span><span class="neg">${m(-(st.upk||0))}</span></div>
   ${st.loanPay?`<div class="r"><span>Pago del crédito</span><span class="neg">${m(-st.loanPay)}</span></div>`:''}
   <div class="r t"><span>Total</span><span class="${st.income<0?'neg':'pos'}">${m(st.income||0)}</span></div>
   ${top.length?`<h3>Los negocios que más ganan</h3>`+top.map(a=>`<div class="r"><span>${nameOf(S.g[a.i])} · ${Math.round(a.cust)} clientes</span><span class="pos">${m(a.earn*(st.inc>0?Math.min(1,st.biz/st.inc):1))}</span></div>`).join(''):''}
   <small>Cada negocio gana según cuántos vecinos a los que les gusta viven cerca. Dos iguales juntos se reparten la clientela.</small>`;
  b.querySelector('.x').onclick=()=>{b.hidden=true}}
function renderLoan(){
  const box=document.getElementById('loanbox');if(box.hidden)return;
  let h='<h2>CRÉDITO BANREGIO<button class="x" id="lx" aria-label="Cerrar">✕</button></h2>';
  if(S.loan){const L=S.loan,paid=1-L.left/L.total,mins=Math.ceil(L.left/L.pay/60);
    h+=`<div>${L.name}: te faltan <b>$${fmt(L.left)}</b>.</div><div class="meter"><b style="width:${Math.round(paid*100)}%"></b></div><small style="color:var(--muted)">Pagas $${L.pay.toFixed(2)} por segundo · terminas en unos ${mins} min</small>
      <div class="of"><span>Liquidar ahora</span><small>Pagas lo que falta de una vez</small><button id="lpay" ${S.$<L.left?'disabled':''}>$${fmt(Math.ceil(L.left))}</button></div>`;
    if(L.re)h+=`<small style="color:var(--muted)">Este crédito ya se reestructuró una vez.</small>`;
    else{const ok=canRestructure(),np=L.left*1.1/3600;h+=`<div class="of"><span>Reestructurar</span><small>${ok?`Debes 10% más, pero a 60 min: pagas $${np.toFixed(2)}/s en vez de $${L.pay.toFixed(2)}/s`:'Disponible tras 3 min en números rojos'}</small><button id="lre" ${ok?'':'disabled'}>Reestructurar</button></div>`}}
  else{h+='<div style="color:var(--muted);font-size:16px">Un crédito a la vez. El pago sale solo de tus ingresos cada segundo.</div>';
    for(const L of LOANS){const lock=S.maxV<L.req;
      h+=`<div class="of"><span>${L.name}: <b>$${fmt(L.amt)}</b></span><small>${lock?'Pide '+L.req+' vecinos':'Pagas $'+fmt(L.total)+' en '+L.mins+' min ($'+(L.total/(L.mins*60)).toFixed(2)+'/s)'}</small><button data-l="${L.id}" ${lock?'disabled':''}>Pedir</button></div>`}}
  box.innerHTML=h;
  document.getElementById('lx').onclick=()=>{box.hidden=true};
  const lp=document.getElementById('lpay');if(lp)lp.onclick=()=>{payoffLoan();renderLoan();refreshUI(true)};
  const lr=document.getElementById('lre');if(lr)lr.onclick=()=>{restructure();renderLoan();refreshUI(true)};
  box.querySelectorAll('[data-l]').forEach(b=>b.onclick=()=>{takeLoan(b.dataset.l);renderLoan();refreshUI(true)});
}
function sfx(n){try{JAZZ.sfx(n)}catch(e){}}
function act(i){
  let t=S.g[i];
  if(HEAT){say(tileInfo(i),true);return}
  if(tool==='ver'){say(whatIs(i),true);return}
  if(tool==='mejorar'){if(t.k==='part'){i=t.a;t=S.g[i]}
    if(t.dmg){if(rioWet()){say('Espera a que baje el agua para repararlo.',true);return}const c=Math.round(costOf(t.k)*.4)+20;if(S.$<c){sfx('nope');say(`Repararlo cuesta $${fmt(c)}. Te faltan $${fmt(c-S.$)}.`,true);return}
      sfx('build');S.$-=c;delete t.dmg;recompute();say(`Reparado: ${nameOf(t)}. Costó $${fmt(c)}.`,true);save();refreshUI(true);return}
    if(!LV[t.k]){say('Eso no tiene niveles. Toca un servicio o un edificio.',true);return}
    if(t.b>0||t.ub>0||t.lu>0||t.ct>0){say('Espera a que termine la obra.',true);return}
    const L=lvOf(t);if(L>=4){say(`${nameOf(t)} ya está en su nivel máximo.`,true);return}
    const v=stats.VAL?stats.VAL[i]:0,need=LVTH[L+1],nx=lvName(t,L+1);
    if(v<need){say(`Para convertirlo en ${nx}, la zona necesita plusvalía ${Math.round(need*100)} y hoy tiene ${Math.round(v*100)}. Súbela con parques, plazas y comercio cerca.`,true);return}
    const c=lvCost(t,i);if(S.$<c){sfx('nope');say(`Convertirlo en ${nx} cuesta $${fmt(c)}. Te faltan $${fmt(c-S.$)}.`,true);return}
    sfx('build');S.$-=c;S.lvN=(S.lvN||0)+1;t.lu=LVT[L+1];t.lt=t.lu;recompute();say(`Pagaste $${fmt(c)}. Arrancó la obra: ${nameOf(t)} se convertirá en ${nx}. Tarda ${t.lu} segundos${DEFS[t.k].per?'':' y mientras tanto no atiende a nadie'}.`,true);save();refreshUI(true);return}
  if(isParcel(t)&&PARCELS[t.p]){
    const P=PARCELS[t.p],cost=lotPrice(t.p),nt=S.g.filter(x=>isParcel(x)&&x.p===t.p).length;
    if(S.maxV<P.unlock){say(`${P.name} todavía no está a la venta. Con ${fmt(P.unlock)} vecinos podrás comprarlo.`,true);return}
    if(pendLot===t.p&&Date.now()-pendT<6000){pendLot=null;if(S.$<cost){sfx('nope');say(`Te faltan $${fmt(cost-S.$)} para el ${P.name}.`,true);return}sfx('buy');buyParcel(t.p);return}
    pendLot=t.p;pendT=Date.now();
    say(t.p==='DA'?`${P.name}, ${P.where}: ${nt} terrenos por $${fmt(cost)}. La fábrica se achica y deja de bajar la plusvalía. Toca otra vez para comprarlo.`:`${P.name}, ${P.where}: ${nt} terrenos por $${fmt(cost)}. Más mantenimiento y vecinos un poco más exigentes. Toca otra vez para comprarlo.`,true);return}
  if(tool==='demoler'){
    if(t.k==='part'){i=t.a;t=S.g[i]}
    if(!DEFS[t.k]){say('Aquí no hay nada que demoler.',true);return}
    if(t.k==='tanque'){say('¿El tanque? Ni lo mande Dios. Es el símbolo del Distrito.',true);return}
    if(DEFS[t.k].fixed||t.hw){say('Eso no es del Distrito, no se puede demoler.',true);return}
    sfx('demolish');const refund=Math.round(DEFS[t.k].cost*.5);S.$+=refund;if(MULTI(t.k))for(const j of foot(i,...DIMT(t))||[])S.g[j]={k:'lote',s:S.g[j].s};S.g[i]=t.k==='domo'?{k:'lotedomo',s:t.s}:(t.pu||t.lecho)?{k:'rio',rc:t.rc,s:t.s,b:0}:{k:'lote',s:t.s};recompute();say(`Demoliste: ${DEFS[t.k].name}. Recuperaste $${fmt(refund)}.`,true);save();return}
  const d=DEFS[tool];
  if(t.k===tool&&d.fmax){
    if(t.b>0||t.ub>0||t.ct>0){say('Ese edificio sigue en obra. Espera a que terminen.',true);return}
    if(t.f>=fmaxT(t)){say(`${nameOf(t)} ya llegó al máximo de ${fmaxT(t)} pisos.${lvOf(t)<4?' Con «Mejorar» le cabe un piso más.':''}${(S.phase||1)<3?' En la Fase 3 podrás subir más.':''}`,true);return}
    const c=upCost(t);if(S.$<c){sfx('nope');say(`Subir un piso cuesta $${fmt(c)}. Te faltan $${fmt(c-S.$)}.`,true);return}
    sfx('build');S.$-=c;if(t.k==='torre')S.upT=(S.upT||0)+1;t.ub=d.bt*.4;say(`Pagaste $${c.toLocaleString('es-MX')}. Arrancó la obra: ${d.name} sube a ${t.f+1} pisos.`,true);save();refreshUI(true);return}
  if(tool==='torre'&&(t.k==='edificio'||t.k==='ladrillo')){
    if(t.ct>0){say('Ese edificio ya se está convirtiendo en torre.',true);return}
    if(!canConv(t)){say('Espera a que termine la obra de ese edificio.',true);return}
    if(!S.unl.includes('torre')){say(`La Torre Caliza se desbloquea con ${DEFS.torre.unlock} vecinos.`,true);return}
    const c=convCost(t);
    if(pendConv===i&&Date.now()-pendConvT<6000){pendConv=null;if(S.$<c){sfx('nope');say(`Convertirlo cuesta $${fmt(c)}. Te faltan $${fmt(c-S.$)}.`,true);return}
      sfx('build');S.$-=c;t.ct=DEFS.torre.bt;t.ctt=t.ct;recompute();say(`Arrancó la obra: el ${DEFS[t.k].name.toLowerCase()} se convierte en Torre Caliza. Tarda ${t.ct} segundos y los vecinos siguen viviendo ahí.`,true);save();refreshUI(true);return}
    pendConv=i;pendConvT=Date.now();
    say(`¿Convertir este ${DEFS[t.k].name.toLowerCase()} de ${t.f} pisos en Torre Caliza de ${DEFS.torre.f0}? Cuesta $${fmt(c)} (ya descuenta la mitad de lo que valía). Toca otra vez para confirmar.`,true);return}
  if(MULTI(tool)){const d=DEFS[tool],tf=toolFoot(i),f=tf&&tf.f,[fw,fh]=DIM(tool,0),dm=d.max||(d.sz>1?1:0);
    if(dm&&(stats.counts[tool]||0)>=dm){say(dm===1?`${d.name} es único y ya está construido.`:`Ya tienes ${dm}: ${d.name} llegó a su límite.`,true);return}
    if(!f){say(fw===fh?`${d.name} necesita ${fw}×${fh} terrenos libres. Toca la esquina de arriba de un espacio vacío.`:`${d.name} ocupa ${Math.max(fw,fh)} terrenos libres seguidos. Toca el primero de dos terrenos vacíos juntos.`,true);return}
    if(!footConnected(f)){say(`${d.name} necesita una calle junto a alguno de sus terrenos.`,true);return}
    const cost=costOf(tool);if(S.$<cost){sfx('nope');say(`Te faltan $${fmt(cost-S.$)} para: ${d.name}.`,true);return}
    sfx('build');S.$-=cost;const sd=Math.floor(Math.random()*1000);for(const j of f)S.g[j]={k:'part',a:i,s:sd,b:0};S.g[i]={k:tool,s:sd,b:d.bt,bt:d.bt};if(tf.o)S.g[i].o=1;
    recompute();say(`Arrancó la obra: ${d.name}. Tarda unos ${d.bt} segundos.`,true);save();refreshUI(true);return}
  if(tool==='domo'&&t.k!=='lotedomo'){say(DIST==='ribera'?'El Puente Atirantado va en su terreno reservado, el de la cerca naranja junto al río.':'El Domo va en su terreno reservado, el de la cerca naranja junto a la calle Ágata.',true);return}
  if(tool==='malecon'&&!rioSides(i%N,Math.floor(i/N)).length){say('El malecón va en la orilla: pégalo al río.',true);return}
  if(t.k==='rio'&&LECHO.includes(tool)&&!canBuild(t)){say(S.rio&&S.rio.cr>0?'¡El río está crecido! Espera a que baje.':'El río trae agua: espera a que baje para construir en el lecho.',true);return}
  if(t.k==='rio'&&!canBuild(t)){say('En el río solo van puentes (con Calle) y, cuando está seco, parques, canchas, dog parks y palmas en el lecho.',true);return}
  if(t.k==='reserva'&&tool!==t.p){say(`Este terreno está reservado para el ${DEFS[t.p].name}.`,true);return}
  if(t.k==='lotedomo'&&tool!=='domo'){say(`Este terreno está reservado para ${DIST==='ribera'?'El Puente Atirantado':'El Domo'}.`,true);return}
  if(!canBuild(t)){say('Ese terreno ya está ocupado. Usa Demoler primero.',true);return}
  if(d.max&&(stats.counts[tool]||0)>=d.max){say(d.max===1?`${d.name} es único y ya está construido.`:`Ya tienes ${d.max}: ${d.name} llegó a su límite.`,true);return}
  const brg=t.k==='rio'&&tool==='calle',cost=brg?Math.max(PUENTE_MIN,costOf('calle')*80):costOf(tool);
  if(S.$<cost){sfx('nope');say(`Te faltan $${fmt(cost-S.$)} para: ${brg?'un puente':d.name}. Espera a que los vecinos aporten${S.loan?'':', o pide un crédito con el botón Crédito'}.`,true);return}
  sfx(tool==='calle'?'street':tool==='torreagua'?'buy':'build');S.$-=cost;S.g[i]={k:tool,s:Math.floor(Math.random()*1000),f:d.f0,b:d.bt,bt:d.bt};if(t.k==='rio'){if(brg)S.g[i].pu=1;else S.g[i].lecho=1;S.g[i].rc=t.rc}recompute();if(brg)say(`Construiste un puente sobre el río ($${fmt(cost)}).`,true);else if(t.k==='rio')say(`${d.name} en el lecho del río: sirve mientras esté seco. En la temporada de lluvias queda bajo el agua.`,true);
  if(tool!=='calle'&&!S.g[i].ok)say(`${d.name} necesita una avenida al lado para funcionar.`,true);
  else if(d.bt>=10)say(`Arrancó la obra: ${d.name}. Tarda unos ${d.bt} segundos.`,true);
  save();refreshUI(true);
}

