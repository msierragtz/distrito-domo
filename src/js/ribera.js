/* ---------- Distrito Ribera (v66): segundo distrito con un río que lo atraviesa ----------
   Se abre a los 3,000 vecinos del Distrito Domo. Cada distrito es su propia partida (su guardado, su nube y su historia);
   se cambia de uno a otro desde la pantalla de inicio o desde ⚙. El río va casi seco todo el año (se puede jugar en el lecho:
   parques, canchas, dog parks y palmas), se llena en la temporada de lluvias y una vez por temporada crece de golpe y daña
   lo que esté abajo. Las calles lo cruzan con puentes, el malecón luce la orilla y la vista al agua sube la plusvalía. */
const LECHO=['parque','cancha','dogpark','palma'],PUENTE_MIN=400;
// centro del río en cada fila: serpentea de norte a sur
const cxR=y=>15+Math.round(2.4*Math.sin(y/4.6+.6));
const isRio=t=>!!t&&(t.k==='rio'||t.pu===1||t.lecho===1);
const rioW=()=>DIST==='ribera'&&S&&S.rio?S.rio.w:0;
const rioWet=()=>rioW()>.5;
function riberaGame(bono){const r=rng(4242),g=[];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const s=Math.floor(r()*1000),c=cxR(y),inR=Math.abs(x-c)<=1,rc=x===c?1:0,av=y===OFF||y===OFF+12;
    if(inR){g.push(av?{k:'calle',hw:1,pu:1,rc,s,b:0}:{k:'rio',rc,s,b:0});continue}
    if(av){g.push({k:'calle',hw:1,s,b:0});continue}
    if(y>OFF&&y<OFF+12&&x>=OFF&&x<OFF+16){g.push({k:r()<.07?'arbol':'lote',s,b:0});continue}
    g.push({k:'ajeno',p:parcelOf(x,y)||undefined,s,b:0})}
  const at=(x,y)=>g[idx(x,y)],set=(x,y,o)=>{const t=at(x,y);if(t.k==='rio'||t.pu){if(o.k==='calle')g[idx(x,y)]={k:'calle',pu:1,rc:t.rc,s:t.s,b:0};return}g[idx(x,y)]=Object.assign({s:t.s,b:0},o)};
  // calles: una en cada orilla y una que cruza el río con puente
  for(let y=OFF+1;y<OFF+12;y++){set(OFF+3,y,{k:'calle'});set(OFF+13,y,{k:'calle'})}
  for(let x=OFF+3;x<=OFF+13;x++)set(x,OFF+5,{k:'calle'});
  const free=(x,y)=>{const t=at(x,y);return t&&(t.k==='lote'||t.k==='arbol')};
  const near=(x,y,o)=>{for(let d=0;d<4;d++)for(const [dx,dy] of [[0,0],[d,0],[-d,0],[0,d],[0,-d]])if(free(x+dx,y+dy)){set(x+dx,y+dy,o);return}};
  // el terreno del landmark: en la orilla oriente, junto al puente
  {const y=OFF+6,x=cxR(y)+2;if(free(x,y))set(x,y,{k:'lotedomo',s:1});else near(x,y,{k:'lotedomo',s:1})}
  near(OFF+2,OFF+11,{k:'ladrillo',f:4,bt:20});near(OFF+14,OFF+11,{k:'tomates',bt:8});near(OFF+15,OFF+2,{k:'tanque'});
  near(OFF+4,OFF+2,{k:'parque'});near(OFF+4,OFF+8,{k:'parque'});near(OFF+12,OFF+9,{k:'palma'});
  return {pv2:1,pop:{fam:9,pro:3,est:4},g,v:16,$:600+(bono||0),maxV:16,unl:['ver','calle','edificio','ladrillo','parque','palma','demoler'],fam:16,clock:DAY*.05,t:Date.now(),lots:0,dist:'ribera',rio:{t:DAY*2.2,w:.1},bono:bono||0}}

/* ===== el agua: temporada seca, temporada de lluvias y crecida ===== */
const RIOCYC=DAY*10;
function rioFase(){const R=S.rio;if(!R)return 'seco';if(R.cr>0)return 'crecida';const ph=(R.t%RIOCYC)/RIOCYC;return ph>=.65&&ph<.95?'lluvias':'seco'}
function rioStep(dt,quiet){if(DIST!=='ribera')return;const R=S.rio=S.rio||{t:DAY*2.2,w:.1};R.t+=dt;const f0=rioFase()==='lluvias'||R.cr>0;
  const ll=rioFase()!=='seco';
  if(ll!==!!R.ll){R.ll=ll;if(ll){R.cre=DAY*(.5+Math.random()*1.3);R.av=0;if(!quiet){sfx('event');say('Empezó la temporada de lluvias: el río se llena y el lecho queda bajo el agua. Lo que construiste en el lecho no funciona hasta que baje.',true)}
      if(!S.ev){const e=EVENTS.find(q=>q.id==='lluvia');if(e)S.ev={id:'lluvia',t:e.dur}}}
    else{R.cre=null;if(!quiet)say('Terminó la temporada de lluvias: el río baja y el lecho vuelve a servir.',true)}}
  if(R.cre!=null&&ll){R.cre-=dt;if(R.cre<=50&&!R.av){R.av=1;if(!quiet){sfx('nope');say('¡Alerta! El río va a crecer en menos de un minuto. Lo que esté en el lecho se va a dañar y habrá que repararlo.',true)}}
    if(R.cre<=0){R.cre=null;R.cr=75;let n=0;for(const t of S.g)if(t.lecho&&!(t.b>0)&&!t.dmg){t.dmg=1;n++}
      if(!S.ev){const e=EVENTS.find(q=>q.id==='lluvia');if(e)S.ev={id:'lluvia',t:e.dur}}
      if(!quiet){sfx('event');say(n?`¡Creció el río! El agua tapó el lecho y dañó ${n} ${n===1?'cosa':'cosas'}. Cuando baje, repáralas con «Mejorar».`:'¡Creció el río! Por suerte no había nada en el lecho.',true)}}}
  if(R.cr>0)R.cr-=dt;
  const tgt=R.cr>0?1:ll?.64:.1;R.w+=Math.max(-dt*.008,Math.min(dt*(R.cr>0?.05:.012),tgt-R.w));
  const q=Math.round(R.w*14);if(q!==R.q){R.q=q;GV++}
  const wet=R.w>.5;if(wet!==!!R.wet){R.wet=wet;recompute()}
  void f0}

/* ===== dibujo del río ===== */
const midR=(a,b)=>(cxR(a)+cxR(b))/2+.5;
function drawRiver(gx,gy,t){const w=rioW()||.1;
  diamond(gx,gy,0,'#c4b796');speck(gx,gy,t.s,14,['#a99d82','#d6cbb0','#9a9284','#8f8e88','#b8b2a4']);
  ctx.save();const D=[P(gx,gy),P(gx+1,gy),P(gx+1,gy+1),P(gx,gy+1)];ctx.beginPath();D.forEach((p,q)=>q?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.clip();
  const hw=.1+w*1.45;
  for(const y of [gy-1,gy,gy+1]){const xa=midR(y-1,y),xb=midR(y,y+1),q=(h,c)=>poly([P(xa-h,y),P(xa+h,y),P(xb+h,y+1),P(xb-h,y+1)],c);
    q(hw+.14,'#a8946a');q(hw,'#3f84b8');if(hw>.3)q(hw*.45,'#4d92c4')}
  ctx.restore();
  // orillas: borde de concreto y pasto donde empieza la tierra
  for(const [dx,dy,a,b] of [[-1,0,[0,0],[0,1]],[1,0,[1,0],[1,1]],[0,-1,[0,0],[1,0]],[0,1,[0,1],[1,1]]]){const n=inb(gx+dx,gy+dy)?S.g[idx(gx+dx,gy+dy)]:null;if(n&&isRio(n))continue;
    // talud de concreto, como el del río Santa Catarina
    const o=(u,k)=>[gx+u[0]-dx*k,gy+u[1]-dy*k],A=P(...o(a,0)),B=P(...o(b,0)),C=P(...o(b,.16)),D=P(...o(a,.16));
    poly([A,B,C,D],'#b4afa4');line(A[0],A[1],B[0],B[1],'#e3ded2');line(D[0],D[1],C[0],C[1],'#857f72');
    for(let q=1;q<4;q++){const f=q/4,u=[A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f],v=[D[0]+(C[0]-D[0])*f,D[1]+(C[1]-D[1])*f];line(u[0],u[1],v[0],v[1],'#a29c90')}}}
// puentes: la avenida o la calle pasan por encima del río
function drawBridge(gx,gy,t){drawRiver(gx,gy,t);const alongX=t.hw||isSt(gx-1,gy)||isSt(gx+1,gy);
  const band=(u0,u1,c)=>poly(alongX?[P(gx,gy+u0),P(gx+1,gy+u0),P(gx+1,gy+u1),P(gx,gy+u1)]:[P(gx+u0,gy),P(gx+u0,gy+1),P(gx+u1,gy+1),P(gx+u1,gy)],c);
  band(.1,.92,'#2f5f86');band(.08,.9,t.hw?'#8a8f99':'#d9d4ca');band(t.hw?.12:.2,t.hw?.86:.78,t.hw?'#474c57':'#585d69');
  if(t.hw)for(const f of [.2,.6]){const a=P(gx+f,gy+.5);px(a[0]-2,a[1]-1,4,1,'#f2c94c');px(a[0]-2,a[1]+1,4,1,'#f2c94c')}
  else{const c=P(gx+.5,gy+.5),m=alongX?P(gx+.8,gy+.5):P(gx+.5,gy+.8);px(c[0]-1,c[1],2,1,'#f4f4f4');px(m[0]-1,m[1],2,1,'#f4f4f4')}
  for(const u of [.08,.9]){const a=alongX?P(gx,gy+u):P(gx+u,gy),b=alongX?P(gx+1,gy+u):P(gx+u,gy+1);line(a[0],a[1]-2,b[0],b[1]-2,'#c9c4b8');for(let q=0;q<=4;q++){const f=q/4;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-2,1,2,'#a9a49a')}}}
// agua que corre (en vivo): reflejos que bajan por el río; agua sobre lo que se inundó en el lecho
function rioDyn(t,gx,gy){const w=rioW();
  if(t.lecho&&w>.5&&!(t.b>0)){ctx.globalAlpha=Math.min(.8,(w-.5)*3);diamond(gx,gy,.02,'#3f84b8');ctx.globalAlpha=1}
  else if(t.dmg){ctx.globalAlpha=.55;diamond(gx,gy,.04,'#7a6440');ctx.globalAlpha=1;const r=rng(t.s+gx);for(let q=0;q<5;q++){const [x,y]=P(gx+.15+r()*.7,gy+.15+r()*.7);px(x,y-1,2,1,'#5a4a30')}}
  if(w<.12||lowMo()||OPT.low)return;const hw=.1+w*1.45,xa=midR(gy-1,gy),xb=midR(gy,gy+1);
  for(let q=0;q<3;q++){const f=((T*.28+sh01(gx,gy,q))%1),off=(sh01(gx,gy,q+5)-.5)*1.6*hw,x=xa+(xb-xa)*f+off;if(x<gx||x>gx+1)continue;const [sx,sy]=P(x,gy+f);
    ctx.globalAlpha=.55;px(sx-1,sy,2.5,.7,NIGHT>.4?'#9cc7ea':'#d6ecf9',NIGHT>.4);ctx.globalAlpha=1}}

/* ===== malecón y puente atirantado ===== */
function rioSides(gx,gy){const out=[];for(const [dx,dy] of NB){const n=inb(gx+dx,gy+dy)?S.g[idx(gx+dx,gy+dy)]:null;if(n&&isRio(n))out.push([dx,dy])}return out}
function artMalecon(t,gx,gy){const sides=rioSides(gx,gy),on=NIGHT>.25;
  for(const [dx,dy] of (sides.length?sides:[[1,0]])){const a=dx?P(gx+(dx>0?.94:.06),gy+.04):P(gx+.04,gy+(dy>0?.94:.06)),b=dx?P(gx+(dx>0?.94:.06),gy+.96):P(gx+.96,gy+(dy>0?.94:.06));
    for(let q=0;q<=6;q++){const f=q/6;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-4,1,4,'#6b7280')}line(a[0],a[1]-4,b[0],b[1]-4,'#9aa3ad');line(a[0],a[1]-2,b[0],b[1]-2,'#7b8591')}
  for(const [u,v] of [[.25,.25],[.75,.75]]){const [x,y]=P(gx+u,gy+v);px(x,y-12,1,12,'#3d4250');px(x-1,y-13,3,2,on?'#ffe19a':'#e6e1cf',on);glow(x,y-12,9,.7)}
  palm(gx+.3,gy+.72,.8);bench(gx+.62,gy+.38);
  if(t.s%2===0)person(...P(gx+.5,gy+.6),{shirt:'#3fa7d6',pants:'#2b3a55',skin:'#c68642',hair:'#1c1c1c',dx:1,front:true,scale:.8,fr:0})}
// El landmark de Ribera: pilón blanco en forma de «A» con su tablero; los tirantes se pintan en vivo (finos, sin contorno)
// el pilón en A va en la orilla y el tablero cruza hacia el río (a lo largo de x); los tirantes se dibujan en vivo
const ATU=[-1.15,1.95];
function artAtirantado(gx,gy,ic){const H=ic?40:88,on=!ic&&NIGHT>.25,Q=(u,v,h)=>{const p=P(gx+u,gy+v);return [p[0],p[1]-h]};
  box(gx+.3,gy+.12,gx+.7,gy+.88,0,4,'#cfc9bd','#b9b3a7','#a59f93');
  const [a,b]=ATU,dk=7;
  poly([Q(a,.36,dk-2),Q(b,.36,dk-2),Q(b,.64,dk-2),Q(a,.64,dk-2)],'#6b7280');poly([Q(a,.36,dk),Q(b,.36,dk),Q(b,.64,dk),Q(a,.64,dk)],'#9aa1ab');
  poly([Q(a,.4,dk+.2),Q(b,.4,dk+.2),Q(b,.6,dk+.2),Q(a,.6,dk+.2)],'#5b616c');
  for(const v of [.36,.64]){const A=Q(a,v,dk+2),B=Q(b,v,dk+2);line(A[0],A[1],B[0],B[1],on?'#ffb86a':'#e6e1d6')}
  {const A=Q(a,.5,dk+.4),B=Q(b,.5,dk+.4);ctx.globalAlpha=.8;line(A[0],A[1],B[0],B[1],'#f2c94c');ctx.globalAlpha=1}
  const T_=Q(.5,.5,H),L=Q(.5,.16,4),R=Q(.5,.84,4);
  poly([[L[0]-2,L[1]],[L[0]+1.5,L[1]],[T_[0]+.8,T_[1]+8],[T_[0]-1.5,T_[1]+8]],'#f1efe9');poly([[R[0]-1.5,R[1]],[R[0]+2,R[1]],[T_[0]+1.5,T_[1]+8],[T_[0]-.8,T_[1]+8]],'#d9d5cc');
  px(T_[0]-1.5,T_[1],3,9,'#f1efe9');px(T_[0]+.5,T_[1],1,9,'#d9d5cc');{const m=Q(.5,.5,H*.42);px(m[0]-5,m[1],10,1.6,'#d9d5cc')}
  px(T_[0]-.5,T_[1]-2,1.4,1.4,on?'#ff3b30':'#b33',on);if(on)glow(T_[0],T_[1]-1.5,6,.9,'#ff3b30')}
function atirDyn(gx,gy){const H=88,Q=(u,v,h)=>{const p=P(gx+u,gy+v);return [p[0],p[1]-h]},T_=Q(.5,.5,H),n=NIGHT>.3;
  ctx.save();ctx.strokeStyle=n?'#c9d8ee':'#eef1f5';ctx.lineWidth=.45;ctx.globalAlpha=n?.9:.85;ctx.beginPath();
  for(let q=0;q<7;q++){const hy=T_[1]+6+q*3.2;for(const e of ATU){const u=.5+(e-.5)*(.18+q*.13),D=Q(u,.5,7.5);ctx.moveTo(T_[0]+(D[0]<T_[0]?-.6:.6),hy);ctx.lineTo(D[0],D[1])}}
  ctx.stroke();ctx.restore();
  if(n){for(const u of [-.9,-.2,1.2,1.8]){const g=Q(u,.5,8);glow(g[0],g[1],7,.45,'#ffd9a0')}const m=Q(.5,.5,H*.45);glow(m[0],m[1],14,.35,'#cfe2ff')}}

/* ===== los dos distritos ===== */
const DKEY='distritoDomo.distrito',UKEY='distritoDomo.riberaUnl';
const riberaUnl=()=>{try{return localStorage.getItem(UKEY)==='1'}catch(e){return false}};
async function goDist(to){if(to===DIST)return;if(to==='ribera'&&!riberaUnl()){say('El Distrito Ribera se abre cuando el Distrito Domo llega a 3,000 vecinos.',true);return}
  try{const str=JSON.stringify(serialize());localStorage.setItem(KEY,str);if(CLOUD.ready){CLOUD.pend=str;await Promise.race([CLOUD.flush(),new Promise(r=>setTimeout(r,2500))])}}catch(e){}
  try{if(to==='ribera'&&DIST==='domo')localStorage.setItem('distritoDomo.riberaBono',String(Math.min(40000,Math.round((S.maxV||0)*6/500)*500)));localStorage.setItem(DKEY,to)}catch(e){}
  location.reload()}
// en el Distrito Domo: a los 3,000 se abre Ribera (una vez)
function distStep(){if(TITLE||DIST!=='domo'||!S||(S.maxV||0)<3000)return;if(!riberaUnl()){try{localStorage.setItem(UKEY,'1')}catch(e){}distUI()}
  if(!S.ribMsg){S.ribMsg=1;sfx('phase');say('¡Se abrió el Distrito Ribera! Un barrio nuevo junto al río, para empezar de cero con un bono de tu Distrito Domo. Ve desde ⚙ Opciones o desde la pantalla de inicio. Tu Distrito Domo te espera tal como lo dejes.',true)}}
function distUI(){distBind();const u=riberaUnl()||DIST==='ribera';for(const id of ['tdist','odist'])if($(id))$(id).hidden=!u;
  for(const [id,d] of [['tdDomo','domo'],['tdRib','ribera'],['odDomo','domo'],['odRib','ribera']]){const b=$(id);if(b){b.setAttribute('aria-pressed',DIST===d);b.disabled=DIST===d}}}
// en Ribera: nombres, título y textos propios
function distBoot(){if(DIST!=='ribera'){DEFS.malecon.hidden=true;DEFS.malecon.unlock=Infinity;const i=ORDER.indexOf('malecon');if(i>=0)ORDER.splice(i,1);return}
  Object.assign(DEFS.domo,{name:'El Puente Atirantado',desc:'El landmark de la Ribera: un pilón blanco con tirantes sobre el río. Sube mucho la satisfacción. Solo hay uno.'});
  DEFS.lotedomo.name='Terreno del Puente';DEFS.cultura.name='Centro Cultural Ribera';DEFS.museo.name='Museo del Río';SPH.domo=110;
  Object.assign(PARCELS.W,{where:'junto a la calle Sauce'});Object.assign(PARCELS.E,{where:'junto a la calle Álamo'});
  Object.assign(PARCELS.WW,{where:'más allá del Sauce'});Object.assign(PARCELS.EE,{where:'más allá del Álamo'});
  Object.assign(PARCELS.DA,{name:'Ribera sur',where:'cruzando la avenida sur, junto al río'});
  for(const k in LV)if(Array.isArray(LV[k]))LV[k]=LV[k].map(n=>typeof n==='string'?n.replace(' del Domo',' del Río').replace('Domo','Ribera'):n);
  document.title='Distrito Ribera';for(const el of document.querySelectorAll('header h1'))el.firstChild.textContent='DISTRITO RIBERA';
  const tt=document.querySelector('#title .tt');if(tt)tt.innerHTML='DISTRITO<br>RIBERA';document.body.classList.add('ribera')}
let DBOUND=0;function distBind(){if(DBOUND)return;DBOUND=1;const on=(id,d)=>{const el=$(id);if(el)el.addEventListener('click',()=>goDist(d))};on('tdDomo','domo');on('tdRib','ribera');on('odDomo','domo');on('odRib','ribera')}
