/* ---------- estado ---------- */
let S, stats={cap:0,inc:0,upk:0,counts:{},income:0,sat:.8,sc:{verde:1,com:1,park:1},noise:0,bonus:0}, walkers=[], streets=[];
function rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
/* lotes que se pueden comprar alrededor del Distrito */
const PARCELS={
  W:{name:'Lote poniente',where:'junto a Celestina',unlock:150},E:{name:'Lote oriente',where:'junto a Ágata',unlock:150},
  NW:{name:'Norte poniente',where:'del otro lado de la carretera',unlock:150},NE:{name:'Norte oriente',where:'del otro lado de la carretera',unlock:150},
  WW:{name:'Poniente lejano',where:'más allá de Celestina',unlock:400},EE:{name:'Oriente lejano',where:'más allá de Ágata',unlock:400},
  NN:{name:'Loma norte',where:'al pie de la Sierra',unlock:800},DS:{name:'Planta DeAcero',where:'la fábrica, al sur del Distrito',unlock:1500},DL:{name:'Patios DeAcero',where:'al fondo de la fábrica',unlock:2500},RS:{name:'Lote sur',where:'del otro lado de la avenida sur',unlock:400},RSS:{name:'Sur lejano',where:'al pie del cerro, al sur',unlock:1200},DA:{name:'Terreno DeAcero',where:'cruzando Ordóñez, donde estaba parte de la fábrica',unlock:1200}};
const SIGNS={W:[4,13],E:[25,13],NW:[9,4],NE:[20,4],WW:[1,13],EE:[28,13],NN:[15,1],DA:[15,21],DS:[15,24],DL:[6,27],RS:[9,21],RSS:[22,26]};
const LOANS=[
  {id:'chico',name:'Crédito chico',amt:2000,total:2500,mins:40,req:0},
  {id:'mediano',name:'Crédito mediano',amt:10000,total:13000,mins:40,req:80},
  {id:'grande',name:'Crédito grande',amt:40000,total:54000,mins:50,req:250}];
function takeLoan(id){const L=LOANS.find(l=>l.id===id);if(!L||S.loan||S.maxV<L.req)return false;
  sfx('money');S.$+=L.amt;S.loan={id,name:L.name,left:L.total,pay:L.total/(L.mins*60),total:L.total};recompute();save();
  say(`Banregio te prestó $${fmt(L.amt)}. Pagarás $${(L.total/(L.mins*60)).toFixed(2)} por segundo durante ${L.mins} minutos.`,true);return true}
function canRestructure(){return !!(S.loan&&!S.loan.re&&(S.redT||0)>180)}
function restructure(){if(!canRestructure())return false;const left=S.loan.left*1.1,old=S.loan.pay;
  sfx('money');S.loan={id:S.loan.id,name:'Crédito reestructurado',left,pay:left/3600,total:left,re:1};save();
  say(`Listo: tu crédito quedó en $${fmt(left)} a 60 minutos. Ahora pagas $${S.loan.pay.toFixed(2)} por segundo en vez de $${old.toFixed(2)}.`,true);return true}
function payoffLoan(){if(!S.loan)return false;const c=Math.ceil(S.loan.left);if(S.$<c){say(`Para liquidar te faltan $${fmt(c-S.$)}.`,true);return false}
  sfx('money');S.$-=c;S.loan=null;save();say('¡Liquidaste tu crédito con Banregio!',true);return true}
const LOT_PRICE=[12000,22000,35000,50000,70000,90000,120000],DA_PRICE=150000,LOT_UNLOCK=150;
function parcelOf(x,y){
  if(y>OFF+12){const mid=x>=3&&x<N-3;return y<=OFF+15&&mid?'DA':y<=OFF+19&&mid?'DS':'DL'}
  if(y<OFF){if(y<3||x<3||x>=N-3)return 'NN';return x<N/2?'NW':'NE'}
  if(y>OFF&&y<OFF+12){if(x<3)return 'WW';if(x>=N-3)return 'EE';if(x<OFF)return 'W';if(x>=OFF+16)return 'E'}
  return null}
function legacyGame(){
  const L=16,r=rng(2026), g=[];
  for(let i=0;i<L*L;i++){const y=Math.floor(i/L);g.push({k:y>0&&y<12&&r()<.07?'arbol':'lote',s:Math.floor(r()*1000)})}
  const set=(x,y,k,extra)=>g[y*L+x]=Object.assign({k,s:Math.floor(r()*1000),b:0},extra);
  for(let x=0;x<L;x++){set(x,0,'calle',{hw:1});set(x,12,'calle',{hw:1});for(let y=13;y<L;y++)set(x,y,'fabrica')}
  for(let y=1;y<12;y++){set(4,y,'calle');set(9,y,'calle')}
  for(let x=5;x<9;x++)set(x,5,'calle');
  set(8,11,'tanque');set(5,11,'ladrillo',{f:4,bt:20});set(7,11,'tomates',{bt:8});
  set(6,6,'parque');set(7,6,'parque');set(8,8,'lotedomo');set(5,10,'parque');set(10,11,'palma');
  return g;
}
/* acomoda un mapa de 16x16 al centro del mundo de 24x24 */
function embed(old){
  const g=[],r=rng(77);
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const lx=x-OFF,ly=y-OFF,s=Math.floor(r()*1000);
    if(lx>=0&&lx<16&&ly>=0&&ly<16){g.push(old[ly*16+lx]);continue}
    if(y===OFF||y===OFF+12){g.push({k:'calle',hw:1,s,b:0});continue}
    if(y>OFF+12){const p=parcelOf(x,y);g.push(p?{k:'fabrica',p,s,b:0}:{k:'fabrica',s,b:0});continue}
    g.push({k:'ajeno',p:parcelOf(x,y),s,b:0});
  }
  return g;
}
/* agranda un mundo de 24x24 a 30x30: la ciudad queda igual, al centro */
function grow24(old){const g=[],r=rng(78),D=3;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const ox=x-D,oy=y-D,s=Math.floor(r()*1000);
    if(ox>=0&&ox<24&&oy>=0&&oy<24){const t=old[oy*24+ox];if(t.k==='part'&&t.a!=null)t.a=(Math.floor(t.a/24)+D)*N+t.a%24+D;
      if(t.k==='fabrica'){const p=parcelOf(x,y);if(p)t.p=p}g.push(t);continue}
    if(y===OFF||y===OFF+12){g.push({k:'calle',hw:1,s,b:0});continue}
    if(y>OFF+12){const p=parcelOf(x,y);g.push(p?{k:'fabrica',p,s,b:0}:{k:'fabrica',s,b:0});continue}
    g.push({k:'ajeno',p:parcelOf(x,y),s,b:0})}
  return g}
function reservePlots(g){
  const put=(x0,y0,sz,k)=>{const cells=[];for(let dy=0;dy<sz;dy++)for(let dx=0;dx<sz;dx++){const x=x0+dx,y=y0+dy;if(x<0||y<0||x>=N||y>=N)return false;const t=g[y*N+x];if(!(t.k==='lote'||t.k==='arbol'))return false;cells.push(y*N+x)}
    for(const j of cells)g[j]={k:'reserva',p:k,a:cells[0],s:1,b:0};return true};
  const st=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&g[y*N+x].k==='calle';
  const tryAt=(sz,k,pref)=>{if(g.some(t=>t.k===k||(t.k==='reserva'&&t.p===k)))return;for(const [x,y] of pref)if(put(x,y,sz,k))return;
    for(let y=0;y<N-sz;y++)for(let x=0;x<N-sz;x++){let ok=false;for(let d=0;d<sz;d++)if(st(x-1,y+d)||st(x+sz,y+d)||st(x+d,y-1)||st(x+d,y+sz))ok=true;if(ok&&put(x,y,sz,k))return}};
  tryAt(3,'grandomo',[[14,12]]);tryAt(2,'mercado',[[9,6]]);
}
function newGame(){
  if(DIST==='ribera'){let b=0;try{b=+localStorage.getItem('distritoDomo.riberaBono')||0}catch(e){}return riberaGame(b)}
  const g=embed(legacyGame());
  return {pv2:1,pop:{fam:9,pro:3,est:4},g,v:16,$:600,maxV:16,unl:['ver','calle','edificio','ladrillo','parque','palma','demoler'],fam:16,clock:DAY*.05,t:Date.now(),lots:0};
}
/* el precio depende de cuántos terrenos llevas y del tamaño del terreno (44 lotes = precio base) */
const PSIZE={};const lotPrice=p=>{if(p==='DA')return DA_PRICE;const base=LOT_PRICE[Math.min(Math.max(0,(S.lots||0)-(S.da?1:0)),LOT_PRICE.length-1)];if(!p)return base;if(PSIZE[p]==null)PSIZE[p]=S.g.filter(t=>isParcel(t)&&t.p===p).length||44;return Math.round(base*Math.max(1,PSIZE[p]/44)/1000)*1000};
// partidas de antes: todo terreno ajeno o de la fábrica queda en algún lote a la venta
function parFix(){if(DIST==='ribera')return;for(let i=0;i<S.g.length;i++){const t=S.g[i];if((t.k==='ajeno'||t.k==='fabrica')&&!t.p){const p=parcelOf(i%N,Math.floor(i/N));if(p)t.p=p}}}
const isParcel=t=>t.k==='ajeno'||(t.k==='fabrica'&&!!t.p);
function buyParcel(p){
  const P_=PARCELS[p];if(!P_||S.maxV<P_.unlock)return false;const cost=lotPrice(p);if(S.$<cost)return false;
  S.$-=cost;S.lots=(S.lots||0)+1;if(p==='DA')S.da=1;
  for(let i=0;i<S.g.length;i++){const t=S.g[i];if(isParcel(t)&&t.p===p)S.g[i]={k:p!=='DA'&&Math.random()<.07?'arbol':'lote',s:t.s,b:0}}
  recompute();save();refreshUI(true);
  say(p==='DA'&&DIST==='domo'?`¡Compraste el Terreno DeAcero! La fábrica se achicó y ya no baja la plusvalía de tus edificios. Mantenimiento +${S.lots*8}%.`:`¡Compraste el ${P_.name}! El Distrito crece, pero también el mantenimiento (+${S.lots*8}%) y lo que exigen los vecinos (+${S.lots*3}%).`,true);return true;
}
function serialize(){S.t=Date.now();return withReal(()=>JSON.parse(JSON.stringify(S)))}
let saveN=0;
/* la partida nunca se queda sin guardar por falta de espacio: si la memoria del navegador se llena (dos distritos, sus
   historias del time-lapse y sus copias), se libera en este orden —copias dañadas, historias, respaldos— y se vuelve a intentar */
function lsFree(step){try{const ks=[];for(let i=0;i<localStorage.length;i++)ks.push(localStorage.key(i));
  const del=f=>{let n=0;for(const k of ks)if(k&&f(k)){localStorage.removeItem(k);n++}return n};
  if(step===0)return del(k=>k.includes('.dañada.'));
  if(step===1)return del(k=>k.endsWith('.historia')&&k!==KEY+'.historia');
  if(step===2)return del(k=>k===KEY+'.historia');
  if(step===3)return del(k=>k.endsWith('.respaldo'));
  if(step===4)return del(k=>k.endsWith('.anterior')&&k!==KEY+'.anterior')}catch(e){}return 0}
function lsPut(k,str,crit){const max=crit?5:1;for(let step=0;;step++){try{localStorage.setItem(k,str);return true}catch(e){}
    let n=0;while(step<max&&!(n=lsFree(step)))step++;if(!n)return false}}
function save(now){const str=JSON.stringify(serialize());
  try{const cur=localStorage.getItem(KEY);if(cur&&saveN++%12===0)lsPut(KEY+'.respaldo',cur)}catch(e){}
  lsPut(KEY,str,true);CLOUD.push(str,now)}
/* guardado en la cuenta (claude.ai): la memoria del navegador se puede borrar sola, la cuenta no */
const CLOUD={ref:null,prevRef:null,ready:false,busy:false,lastT:0,pend:null,fail:0,
  push(str,now){if(!this.ready)return;this.pend=str;if(now||Date.now()-this.lastT>30000)this.flush()},
  async flush(){if(!this.ready||this.busy||!this.pend)return;const s=this.pend;this.pend=null;this.busy=true;this.lastT=Date.now();
    try{await this.ref.set({s,t:Date.now(),v:Math.round(S.maxV||0)});this.fail=0}
    catch(e){const c=e&&e.code;if(c==='unavailable'&&this.fail++<3)this.pend=this.pend||s;else if(c!=='resource_exhausted'&&c!=='unavailable')this.ready=false}
    finally{this.busy=false}}};
// las partidas de demostración nunca pisan la copia «anterior»: ahí queda tu partida real
function stashPrev(){if(!S||!S.seen||S.demo||(S.maxV||0)<30)return;const str=JSON.stringify(serialize());
  lsPut(KEY+'.anterior',str)
  if(CLOUD.ready&&CLOUD.prevRef)CLOUD.prevRef.set({s:str,t:Date.now(),v:Math.round(S.maxV||0)}).catch(()=>{})}
function pruneDamaged(){try{const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.startsWith(KEY+'.dañada.'))ks.push(k)}ks.sort();while(ks.length>2)localStorage.removeItem(ks.shift())}catch(e){}}
function parseSave(raw){try{const d=JSON.parse(raw);if(d&&d.g){if(d.g.length===256){d.g=embed(d.g);d.lots=0}if(d.g.length===576)d.g=grow24(d.g);if(d.g.length===N*N)return d}}catch(e){}return null}
function load(){let raw=null;try{raw=localStorage.getItem(KEY)}catch(e){}
  const d=parseSave(raw);if(d)return d;
  let bak=null;try{bak=localStorage.getItem(KEY+'.respaldo')}catch(e){}
  if(raw){try{localStorage.setItem(KEY+'.dañada.'+Date.now(),raw)}catch(e){}} // la dañada se aparta, no se pierde
  const b=parseSave(bak);if(b){b.fromBak=1;return b}return null}

const idx=(x,y)=>y*N+x, inb=(x,y)=>x>=0&&y>=0&&x<N&&y<N;
const NB=[[1,0],[-1,0],[0,1],[0,-1]];
function connected(x,y){return NB.some(([dx,dy])=>inb(x+dx,y+dy)&&S.g[idx(x+dx,y+dy)].k==='calle')}
/* tipos de vecinos y la mezcla que atrae cada vivienda */
const GROUPS=[['fam','Familias'],['pro','Profesionistas'],['est','Estudiantes']],G3=['fam','pro','est'];
const HMIX={casaf:{fam:.70,pro:.20,est:.10},mixto:{est:.40,pro:.40,fam:.20},edificio:{est:.45,fam:.35,pro:.20},ladrillo:{fam:.60,est:.20,pro:.20},torre:{pro:.60,est:.25,fam:.15}};
const PET={fam:.4,pro:.2,est:.1},SPD={fam:1,pro:.8,est:1.3};
/* a quién le sirve cada comercio, y a quién le molesta tenerlo cerca */
// escuela y cancha: su comercio es para familias (sin ganancia propia, así que no son negocios)
const LIKE={mixto:['fam','pro','est'],banco:['pro','fam'],gas:['pro','fam'],alberca:['fam','est'],museo:['fam','pro'],rasca:['pro','est'],beis:['fam','est'],plazacom:['pro','fam','est'],barber:['pro','est'],unas:['fam','pro'],paleteria:['fam','est'],boliche:['fam','est'],gym:['pro'],cine:['pro','fam','est'],golf:['pro'],escuela:['fam'],cancha:['fam'],cultura:['pro','fam','est'],tomates:['pro','fam','est'],cafe:['pro','est'],resto:['pro','fam'],padel:['pro','fam'],oficinas:['pro','est'],bar:['pro','est'],plaza:['fam','est']};
const DISLIKE={oficinas:'fam',bar:'fam',caseta:'est',gas:'fam'},COMG={plaza:3};
const GNAME={fam:'familias',pro:'profesionistas',est:'estudiantes'};
const RENT={fam:.065,pro:.1,est:.045};
const EARN=new Map(); // lo que gana cada negocio (para mostrarlo)
// lo propio de los negocios nuevos (v63)
function bizX(t,x,y,nb){const k=t.k,has=q=>nb.some(n=>n&&n.k===q&&!(n.b>0));
  if(k==='unas')return has('cafe')?1.15:1;if(k==='cafe')return has('unas')?1.15:1;
  if(k==='boliche'){const f=foot(idx(x,y),...DIMT(t))||[];return f.some(j=>{const jx=j%N,jy=Math.floor(j/N);return NB.some(([dx,dy])=>{if(!inb(jx+dx,jy+dy))return false;const q=S.g[anchorOf(idx(jx+dx,jy+dy))];return q&&(q.k==='cafe'||q.k==='resto')&&!(q.b>0)})})?1.2:1}
  if(k==='gym'){for(let yy=Math.max(0,y-3);yy<=Math.min(N-1,y+3);yy++)for(let xx=Math.max(0,x-3);xx<=Math.min(N-1,x+3);xx++){const q=S.g[idx(xx,yy)];if(q.k==='oficinas'&&!(q.b>0)&&Math.abs(xx-x)+Math.abs(yy-y)<=3)return 1.25}return 1}
  if(k==='paleteria')return S.ev&&S.ev.id==='calor'?3:1;return 1}
