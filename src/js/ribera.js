/* ---------- Distrito Ribera (v66): segundo distrito con un río que lo atraviesa ----------
   Se abre a los 3,000 vecinos del Distrito Cañón. Cada distrito es su propia partida (su guardado, su nube y su historia);
   se cambia de uno a otro desde la pantalla de inicio o desde ⚙. El río va casi seco todo el año (se puede jugar en el lecho:
   parques, canchas, dog parks y palmas), se llena en la temporada de lluvias y una vez por temporada crece de golpe y daña
   lo que esté abajo. Las calles lo cruzan con puentes, el malecón luce la orilla y la vista al agua sube la plusvalía. */
const LECHO=['parque','cancha','dogpark','palma'],PUENTE_MIN=400,LMY=OFF+5;
// centro del río en cada fila: serpentea de norte a sur
// en la Ribera, lo que queda al sur de la avenida también se vende (en el Cañón ahí está la fábrica)
const ribParcel=(x,y)=>y>OFF+12?(y<=OFF+15&&x>=3&&x<N-3?'RS':'RSS'):parcelOf(x,y);
const cxR=y=>15+Math.round(2.4*Math.sin(y/4.6+.6));
const isRio=t=>!!t&&(t.k==='rio'||t.pu===1||t.lecho===1);
const rioW=()=>DIST==='ribera'&&S&&S.rio?S.rio.w:0;
const rioWet=()=>rioW()>.5;
function riberaGame(bono){const r=rng(4242),g=[];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const s=Math.floor(r()*1000),c=cxR(y),inR=Math.abs(x-c)<=1,rc=x===c?1:0,av=y===OFF||y===OFF+12;
    if(inR){g.push(av?{k:'calle',hw:1,pu:1,rc,s,b:0}:{k:'rio',rc,s,b:0});continue}
    if(av){g.push({k:'calle',hw:1,s,b:0});continue}
    if(y>OFF&&y<OFF+12&&x>=OFF&&x<OFF+16){g.push({k:r()<.07?'arbol':'lote',s,b:0});continue}
    g.push({k:'ajeno',p:ribParcel(x,y),s,b:0})}
  const at=(x,y)=>g[idx(x,y)],set=(x,y,o)=>{const t=at(x,y);if(t.k==='rio'||t.pu){if(o.k==='calle')g[idx(x,y)]={k:'calle',pu:1,rc:t.rc,s:t.s,b:0};return}g[idx(x,y)]=Object.assign({s:t.s,b:0},o)};
  // calles: una en cada orilla y una que cruza el río con puente
  for(let y=OFF+1;y<OFF+12;y++){set(OFF+3,y,{k:'calle'});set(OFF+13,y,{k:'calle'})}
  for(let x=OFF+3;x<=OFF+13;x++)set(x,OFF+5,{k:'calle'});
  const free=(x,y)=>{const t=at(x,y);return t&&(t.k==='lote'||t.k==='arbol')};
  const near=(x,y,o)=>{for(let d=0;d<4;d++)for(const [dx,dy] of [[0,0],[d,0],[-d,0],[0,d],[0,-d]])if(free(x+dx,y+dy)){set(x+dx,y+dy,o);return}};
  // el landmark va sobre el puente de en medio: su casilla central queda reservada (con conos) hasta construirlo
  {const y=LMY,x=cxR(y);g[idx(x,y)]={k:'lotedomo',pu:1,rc:1,s:1,b:0}}
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
  if(w<.12||lowMo()||lowQ())return;const hw=.1+w*1.45,xa=midR(gy-1,gy),xb=midR(gy,gy+1);
  for(let q=0;q<3;q++){const f=((T*.28+sh01(gx,gy,q))%1),off=(sh01(gx,gy,q+5)-.5)*1.6*hw,x=xa+(xb-xa)*f+off;if(x<gx||x>gx+1)continue;const [sx,sy]=P(x,gy+f);
    ctx.globalAlpha=.55;px(sx-1,sy,2.5,.7,NIGHT>.4?'#9cc7ea':'#d6ecf9',NIGHT>.4);ctx.globalAlpha=1}}

/* ===== malecón y puente atirantado ===== */
function rioSides(gx,gy){const out=[];for(const [dx,dy] of NB){const n=inb(gx+dx,gy+dy)?S.g[idx(gx+dx,gy+dy)]:null;if(n&&isRio(n))out.push([dx,dy])}return out}
function artMalecon(t,gx,gy){const sides=rioSides(gx,gy),on=NIGHT>.25;
  for(const [dx,dy] of (sides.length?sides:[[1,0]])){const a=dx?P(gx+(dx>0?.94:.06),gy+.04):P(gx+.04,gy+(dy>0?.94:.06)),b=dx?P(gx+(dx>0?.94:.06),gy+.96):P(gx+.96,gy+(dy>0?.94:.06));
    for(let q=0;q<=6;q++){const f=q/6;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-5,1.2,5,'#f4f2ec')}line(a[0],a[1]-5,b[0],b[1]-5,'#ffffff',false,1.5);line(a[0],a[1]-3,b[0],b[1]-3,'#2bb3a3');line(a[0],a[1]-1.4,b[0],b[1]-1.4,'#d8d4ca')}
  for(const [u,v] of [[.25,.25],[.75,.75]]){const [x,y]=P(gx+u,gy+v);px(x,y-12,1,12,'#3d4250');px(x-1,y-13,3,2,on?'#ffe19a':'#e6e1cf',on);glow(x,y-12,9,.7)}
  {const p0=P(gx+.25,gy+.25),p1=P(gx+.75,gy+.75);bulbsH([p0[0],p0[1]-12],[p1[0],p1[1]-12],6,2)}
  palm(gx+.3,gy+.72,.8);bench(gx+.62,gy+.38);
  if(t.s%2===0)person(...P(gx+.5,gy+.6),{shirt:'#3fa7d6',pants:'#2b3a55',skin:'#c68642',hair:'#1c1c1c',dx:1,front:true,scale:.8,fr:0})}
// El landmark de Ribera va sobre el río, en el puente de en medio: el tablero cubre las 3 casillas del cruce (u de -1 a 2)
// y el pilón en «A» se planta en el agua, a horcajadas del tablero. Los tirantes se pintan en vivo (finos, sin contorno).
const ATU=[-1,2],DKH=2.5;
function artLmSign(gx,gy){const Q=(u,v,h)=>{const p=P(gx+u,gy+v);return [p[0],p[1]-h]};
  for(const [u,v] of [[.14,.3],[.14,.7],[.86,.3],[.86,.7]]){const [x,y]=Q(u,v,0);px(x-2,y,5,1,'#b4501a');px(x-1,y-4,3,4,'#f26a21');px(x-1,y-3,3,1,'#ffffff');px(x,y-5,1,1,'#f26a21')}
  const [x,y]=Q(.5,.18,0);px(x,y-15,1,15,'#555');px(x-8,y-24,17,10,'#2f7fb8');px(x-8,y-24,17,1,'#5fa6d6');
  for(let q=0;q<6;q++){px(x-q*.9,y-16-q*1.2,1,1,'#fff');px(x+q*.9,y-16-q*1.2,1,1,'#fff')}px(x-4,y-17,9,1,'#ffffff')}
function artAtirantado(gx,gy,ic){const H=ic?40:86,on=!ic&&NIGHT>.25,Q=(u,v,h)=>{const p=P(gx+u,gy+v);return [p[0],p[1]-h]};
  if(ic){box(gx+.2,gy+.2,gx+.8,gy+.8,0,3,'#cfc9bd','#b9b3a7','#a59f93')}
  const [a,b]=ATU;
  // pilas en el agua bajo las patas del pilón
  for(const v of [.12,.88])box(gx+.38,gy+v-.08,gx+.62,gy+v+.08,0,3,'#bdb7aa','#a49e91','#8f897d');
  // tablero: canto, carriles, banquetas blancas y barandal
  poly([Q(a,.34,DKH-2.5),Q(b,.34,DKH-2.5),Q(b,.66,DKH-2.5),Q(a,.66,DKH-2.5)],'#7c8290');
  poly([Q(a,.34,DKH),Q(b,.34,DKH),Q(b,.66,DKH),Q(a,.66,DKH)],'#eceae4');
  poly([Q(a,.39,DKH+.1),Q(b,.39,DKH+.1),Q(b,.61,DKH+.1),Q(a,.61,DKH+.1)],'#555b67');
  {const A=Q(a,.5,DKH+.2),B=Q(b,.5,DKH+.2);for(let q=0;q<12;q++){if(q%2)continue;const f0=q/12,f1=(q+1)/12;line(A[0]+(B[0]-A[0])*f0,A[1]+(B[1]-A[1])*f0,A[0]+(B[0]-A[0])*f1,A[1]+(B[1]-A[1])*f1,'#f2c94c')}}
  for(const v of [.34,.66]){const A=Q(a,v,DKH+2.4),B=Q(b,v,DKH+2.4);line(A[0],A[1],B[0],B[1],on?'#ffcf8a':'#f4f2ec');
    for(let q=0;q<=12;q++){const f=q/12;px(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f,1,2.4,'#b9b6ae')}}
  // pilón en «A»: dos patas desde las pilas hasta la cima, travesaño bajo el tablero y aguja con luz roja
  const T_=Q(.5,.5,H),L0=Q(.5,.12,3),R0=Q(.5,.88,3),M=[T_[0],T_[1]+10];
  poly([[L0[0]-1.6,L0[1]],[L0[0]+1.6,L0[1]],[M[0]+1,M[1]],[M[0]-1,M[1]]],'#f4f2ec');poly([[R0[0]-1.6,R0[1]],[R0[0]+1.6,R0[1]],[M[0]+1.4,M[1]],[M[0]-.6,M[1]]],'#d8d4ca');
  {const l=Q(.5,.24,DKH-1),r=Q(.5,.76,DKH-1);line(l[0],l[1],r[0],r[1],'#d8d4ca');line(l[0],l[1]+1,r[0],r[1]+1,'#b9b6ae')}
  {const l=[L0[0]+(M[0]-L0[0])*.55,L0[1]+(M[1]-L0[1])*.55],r=[R0[0]+(M[0]-R0[0])*.55,R0[1]+(M[1]-R0[1])*.55];line(l[0],l[1],r[0],r[1],'#e6e3db')}
  px(T_[0]-1.5,T_[1],3,10.5,'#f4f2ec');px(T_[0]+.5,T_[1],1,10.5,'#d8d4ca');
  px(T_[0]-.5,T_[1]-2,1.4,1.4,on?'#ff3b30':'#b33',on);if(on)glow(T_[0],T_[1]-1.5,6,.9,'#ff3b30')}
function atirDyn(gx,gy){const H=86,Q=(u,v,h)=>{const p=P(gx+u,gy+v);return [p[0],p[1]-h]},T_=Q(.5,.5,H),n=NIGHT>.3;
  ctx.save();ctx.strokeStyle=n?'#c9d8ee':'#ffffff';ctx.lineWidth=.45;ctx.globalAlpha=n?.9:.8;ctx.beginPath();
  for(let q=0;q<8;q++){const hy=T_[1]+5+q*2.6;for(const e of ATU){const u=.5+(e-.5)*(.16+q*.115),D=Q(u,.5,DKH+.6);ctx.moveTo(T_[0]+(D[0]<T_[0]?-.6:.6),hy);ctx.lineTo(D[0],D[1])}}
  ctx.stroke();ctx.restore();
  if(n){for(const u of [-.7,0,1,1.7])for(const v of [.34,.66]){const g=Q(u,v,DKH+2.4);glow(g[0],g[1],6,.4,'#ffd9a0')}const m=Q(.5,.5,H*.5);glow(m[0],m[1],16,.35,'#cfe2ff')}}
// partidas de v66: el terreno del landmark estaba en la orilla; ahora va sobre el puente de en medio
function ribFix(){if(DIST!=='ribera'||!S||!S.g)return;for(let i=0;i<S.g.length;i++){const q=S.g[i];if(q.k==='ajeno')q.p=ribParcel(i%N,Math.floor(i/N))}
  const c=idx(cxR(LMY),LMY),t=S.g[c];
  if(S.g.some(q=>q.k==='domo')||(t&&t.k==='lotedomo'))return;
  for(let i=0;i<S.g.length;i++)if(S.g[i].k==='lotedomo')S.g[i]={k:'lote',s:S.g[i].s,b:0};
  if(t&&(t.k==='calle'||t.k==='rio'))S.g[c]={k:'lotedomo',pu:1,rc:1,s:1,b:0}}

/* ===== los dos distritos =====
   El cambio se ve así: tarjeta «¡Se abrió el Distrito Ribera!» a los 3,000 (después de la pantalla de los 3,000), botón «Distritos»
   arriba con las dos ciudades, pantalla de viaje mientras se guarda y se recarga, y al llegar, título de cine y la cámara al landmark. */
const DKEY='distritoDomo.distrito',UKEY='distritoDomo.riberaUnl',VKEY='distritoDomo.viaje';
const riberaUnl=()=>{try{return localStorage.getItem(UKEY)==='1'}catch(e){return false}};
const bonoDe=mv=>Math.min(40000,Math.round((mv||0)*6/500)*500);
const DN={domo:'Distrito Cañón',ribera:'Distrito Ribera'};
const EMB={domo:'<svg viewBox="0 0 30 18" aria-hidden="true"><path d="M3 17 A12 12 0 0 1 27 17" fill="none" stroke="#f26a21" stroke-width="4"/></svg>',
  ribera:'<svg viewBox="0 0 30 18" aria-hidden="true"><path d="M1 15.5h28" stroke="#2f7fb8" stroke-width="2.6"/><path d="M11 17 L15 1.5 L19 17" fill="none" stroke="#2f7fb8" stroke-width="2.4"/><path d="M15 3.5 L2 14.5 M15 3.5 L28 14.5 M15 7 L6 14.5 M15 7 L24 14.5" stroke="#2f7fb8" stroke-width=".9"/></svg>'};
let RIBW=0,VIAJE=null;
function viajeShow(to,fade,txt,sub){const v=$('viaje');if(!v)return;v.querySelector('.em').innerHTML=EMB[to];v.querySelector('b').textContent=txt;v.querySelector('small').textContent=sub||'';
  v.classList.toggle('rib',to==='ribera');v.hidden=false;if(fade){void v.offsetWidth}v.classList.add('on')}
function viajeHide(){const v=$('viaje');if(!v)return;v.classList.remove('on');setTimeout(()=>{v.hidden=true},700)}
async function goDist(to){if(to===DIST||goDist.on)return;if(to==='ribera'&&!riberaUnl()){say('El Distrito Ribera se abre cuando el Distrito Cañón llega a 3,000 vecinos.',true);return}
  goDist.on=1;for(const b of ['distbox','ribnew','credits','opts','misbox'])if($(b))$(b).hidden=true;sfx('phase');
  viajeShow(to,true,`Viajando al ${DN[to]}`,TITLE?'':`Guardando tu ${DN[DIST]}…`);const t0=performance.now();
  if(!TITLE)try{const str=JSON.stringify(serialize());if(!lsPut(KEY,str,true)&&!CLOUD.ready){goDist.on=0;viajeHide();say(`No pude guardar tu ${DN[DIST]}: la memoria del navegador está llena. Descarga una copia antes de cambiar de distrito.`,true);return}if(CLOUD.ready){CLOUD.pend=str;await Promise.race([CLOUD.flush(),new Promise(r=>setTimeout(r,2500))])}}catch(e){}
  try{if(to==='ribera'&&DIST==='domo')localStorage.setItem('distritoDomo.riberaBono',String(bonoDe(S.maxV)));localStorage.setItem(DKEY,to);localStorage.setItem(VKEY,JSON.stringify({to,t:Date.now()}))}catch(e){}
  if(!TITLE)$('viaje').querySelector('small').textContent=`Tu ${DN[DIST]} quedó guardado, tal como está.`;
  await new Promise(r=>setTimeout(r,Math.max(250,1500-(performance.now()-t0))));location.reload()}
// al arrancar: ¿venimos de un viaje? entonces la pantalla de viaje sigue puesta y se entra directo, sin pantalla de inicio
function viajeBoot(){try{const o=JSON.parse(localStorage.getItem(VKEY)||'null');localStorage.removeItem(VKEY);VIAJE=o&&o.to===DIST&&Date.now()-o.t<90000?o:null}catch(e){VIAJE=null}
  if(VIAJE)viajeShow(DIST,false,`Llegando al ${DN[DIST]}`,'');return !!VIAJE}
function llegada(nuevo){const el=$('cine'),i=S.g.findIndex(t=>t.k==='domo'||t.k==='lotedomo');viajeHide();
  if(el){el.querySelector('b').textContent=DNAME.toUpperCase();
    el.querySelector('small').textContent=nuevo?(DIST==='ribera'?'Un barrio nuevo a la orilla del río':'Santa Catarina, Nuevo León'):`${fmt(Math.round(S.v))} vecinos te esperaban`;
    CINE={t:0,dur:4.2,slow:false};el.hidden=false;void el.offsetWidth;el.classList.add('on')}
  if(i>=0&&!lowMo())setTimeout(()=>camTo(i,2.2),350)}
// la primera vez en Ribera: qué tiene de distinto, en tres mensajes
function ribIntro(who){const b=+(S.bono||0);
  say(`¡Bienvenido al Distrito Ribera${who}! Empiezas de cero con $${fmt(S.$)}${b?`: $600 del Distrito más $${fmt(b)} de bono de tu Distrito Cañón`:''}.`,true);
  say('El río va casi seco: en el lecho puedes poner parques, canchas, dog parks y palmas. En la temporada de lluvias se llena, y si crece daña lo que haya abajo.');
  say(`Para cruzar el río usa Calle encima del agua: hace un puente. El puente de en medio, el de los conos, es para ${DEFS.domo.name}.`)}
// en el Distrito Cañón: a los 3,000 se abre Ribera. La tarjeta sale una vez, después de la pantalla de los 3,000
function distStep(){if(TITLE||DIST!=='domo'||!S||(S.maxV||0)<3000)return;if(!riberaUnl()){try{localStorage.setItem(UKEY,'1')}catch(e){}RIBW=performance.now();distUI()}
  if(S.ribCard||performance.now()-RIBW<7000)return;const cr=$('credits');if((cr&&!cr.hidden)||CINE||PHOTO||TL||goDist.on)return;
  S.ribCard=1;S.ribMsg=1;ribNewShow()}
function ribNewShow(){const box=$('ribnew');if(!box)return;sfx('phase');
  box.innerHTML=`<svg class="rill" viewBox="0 0 240 96" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><rect width="240" height="96" fill="#bfe3f5"/><path d="M0 60 L34 40 L62 50 L104 26 L146 48 L186 32 L240 54 V96 H0Z" fill="#9aa8bd"/><rect y="62" width="240" height="34" fill="#e2d3ad"/>
    <path d="M0 84 C50 72 96 90 146 78 S214 70 240 74 L240 86 C214 82 180 92 146 90 S50 86 0 96Z" fill="#3f84b8"/><path d="M8 84 C60 76 100 90 146 82" stroke="#9cc7ea" stroke-width="1" fill="none"/>
    <path d="M20 66 A13 13 0 0 1 46 66" stroke="#f26a21" stroke-width="5" fill="none"/><rect x="18" y="66" width="30" height="3" fill="#c9bfa5"/>
    <rect x="92" y="74" width="74" height="4" fill="#eceae4"/><rect x="92" y="78" width="74" height="2" fill="#7c8290"/>
    <path d="M122 82 L129 20 L136 82" fill="none" stroke="#f4f2ec" stroke-width="3"/><path d="M129 24 L96 74 M129 27 L104 74 M129 30 L112 74 M129 33 L120 74 M129 24 L162 74 M129 27 L154 74 M129 30 L146 74 M129 33 L138 74" stroke="#fff" stroke-width=".8"/>
    <circle cx="129" cy="18.5" r="1.8" fill="#ff3b30"/></svg>
    <h2>¡Se abrió el Distrito Ribera!</h2>
    <ul><li>Un barrio nuevo, cruzado por un río que va seco casi todo el año y crece en la temporada de lluvias.</li>
    <li>Empiezas de cero, con <b>$${fmt(600+bonoDe(S.maxV))}</b> (incluye un bono de tu Distrito Cañón).</li>
    <li>Tu Distrito Cañón se queda tal cual: regresas cuando quieras con el botón <b>⇄ Cambiar</b>, junto al nombre del distrito, arriba a la izquierda.</li></ul>
    <div class="cbtns"><button id="rnGo" type="button" class="go">Ir al Distrito Ribera</button><button id="rnNo" type="button">Ahora no</button></div>`;
  box.hidden=false;$('rnGo').onclick=()=>goDist('ribera');$('rnNo').onclick=()=>{box.hidden=true;$('distb').classList.add('new');say('Cuando quieras ir al Distrito Ribera, toca «⇄ Cambiar», junto al nombre del distrito, arriba a la izquierda.',true)}}
// panel «Distritos»: las dos ciudades, cuántos vecinos tiene cada una (lo guardado en este navegador) y un botón para ir
function distInfo(d){if(d===DIST)return {v:Math.round(S.v||0),seen:1};let p=null;try{p=JSON.parse(localStorage.getItem(d==='ribera'?'distritoDomo.ribera.v1':'distritoDomo.v4')||'null')}catch(e){}
  return p&&p.g?{v:Math.round(p.v||0),seen:!!p.seen}:null}
function renderDist(){const box=$('distbox');if(!box)return;const unl=riberaUnl()||DIST==='ribera';
  const card=d=>{const here=d===DIST,lk=d==='ribera'&&!unl,inf=distInfo(d);
    const nv=n=>Math.round(n).toLocaleString('es-MX'),sub=here?`${nv(inf.v)} vecinos · estás aquí`:lk?`Se abre a los 3,000 vecinos del Cañón (vas en ${nv(S.maxV||0)})`:inf&&inf.seen?`${nv(inf.v)} vecinos te esperan, en pausa`:d==='ribera'?`Nuevo: un barrio con río. Llegas con $${fmt(600+bonoDe(DIST==='domo'?S.maxV:0))}`:'Tu partida del Cañón';
    return `<div class="dcard${here?' here':''}${lk?' lk':''}"><span class="em">${EMB[d]}</span><div class="dt"><b>${DN[d]}</b><small>${sub}</small></div>${here?'<span class="aq">Aquí</span>':lk?'<span class="aq">🔒</span>':`<button type="button" data-d="${d}">Ir →</button>`}</div>`};
  box.innerHTML=`<h2>Tus distritos<button class="x" type="button" aria-label="Cerrar">✕</button></h2>${card('domo')}${card('ribera')}<p class="dn">Cada distrito guarda su propia partida. El que dejes se queda en pausa, tal como está.</p>`;
  box.querySelector('.x').onclick=()=>{box.hidden=true};for(const b of box.querySelectorAll('button[data-d]'))b.onclick=()=>goDist(b.dataset.d)}
let DBOUND=0;function distBind(){if(DBOUND)return;DBOUND=1;const on=(id,d)=>{const el=$(id);if(el)el.addEventListener('click',()=>goDist(d))};on('tdDomo','domo');on('tdRib','ribera');
  const b=$('distb');if(b)b.addEventListener('click',e=>{e.stopPropagation();const x=$('distbox');x.hidden=!x.hidden;b.classList.remove('new');for(const o of ['misbox','loanbox','moneybox'])if($(o))$(o).hidden=true;if(!x.hidden)renderDist()})}
function distUI(){distBind();const u=riberaUnl()||DIST==='ribera';for(const id of ['tdist','distb'])if($(id))$(id).hidden=!u;
  const lab=d=>{const inf=distInfo(d);return inf&&inf.seen?`${DN[d].replace('Distrito ','')} · ${fmt(inf.v)}`:d==='ribera'?'Ribera · nuevo':'Cañón'};
  for(const [id,d] of [['tdDomo','domo'],['tdRib','ribera']]){const b=$(id);if(b){b.setAttribute('aria-pressed',DIST===d);b.disabled=DIST===d;if(S)b.textContent=lab(d)}}}
// en Ribera: nombres, título y textos propios
function distBoot(){if(DIST!=='ribera'){for(const k of ['malecon','alberca','parroquia','hotel']){DEFS[k].hidden=true;DEFS[k].unlock=Infinity;const i=ORDER.indexOf(k);if(i>=0)ORDER.splice(i,1)}return}
  Object.assign(DEFS.domo,{name:'El Puente Atirantado',desc:'El emblema de la Ribera: un pilón blanco en A con tirantes, sobre el puente de en medio del río. Sube mucho la satisfacción. Solo hay uno.'});
  // los trofeos del Cañón no van en la Ribera (el menú de especiales se hacía enorme)
  for(const k of ['kiosco','mirador','cultura','teleferico']){DEFS[k].hidden=true;DEFS[k].unlock=Infinity;const i=ORDER.indexOf(k);if(i>=0)ORDER.splice(i,1)}
  DEFS.lotedomo.name='Terreno del Puente';DEFS.cultura.name='Centro Cultural Ribera';DEFS.museo.name='Museo del Río';SPH.domo=110;
  Object.assign(PARCELS.W,{where:'junto a la calle Sauce'});Object.assign(PARCELS.E,{where:'junto a la calle Álamo'});
  Object.assign(PARCELS.WW,{where:'más allá del Sauce'});Object.assign(PARCELS.EE,{where:'más allá del Álamo'});
  Object.assign(PARCELS.DA,{name:'Ribera sur',where:'cruzando la avenida sur, junto al río'});
  for(const k in LV)if(Array.isArray(LV[k]))LV[k]=LV[k].map(n=>typeof n==='string'?n.replace(' del Cañón',' del Río').replace('Cañón','Ribera'):n);
  // v70: vivienda y negocios con cara propia (arte/ribera-edificios.js): sus nombres por nivel, sin las marcas del Cañón
  for(const k in RIBLV){LV[k]=RIBLV[k].slice();delete VARN[k]}
  Object.assign(DEFS.edificio,{name:'Casas de la Ribera',desc:'Casas pintadas, cada edificio de su color; 6 vecinos por piso: sobre todo estudiantes, luego familias. Tócalo otra vez para subirle un piso.'});
  Object.assign(DEFS.ladrillo,{name:'Bodegas del río',desc:'Bodegas de ladrillo convertidas en departamentos, con tanque de agua de madera: las prefieren las familias. Tócalo otra vez para subirle un piso.'});
  DEFS.torre.name='Torre Malecón';Object.assign(DEFS.tomates,{name:'Mercadito de la Ribera',desc:'Mercadito abierto día y noche: le sirve a todos.'});
  for(const k in COMTXT)COMTXT[k]=COMTXT[k].replace('Jitomates','mercadito');NEEDTXT.com[2]=NEEDTXT.com[2].replace('Jitomates Market','mercadito');
  document.title='Distrito Ribera';for(const el of document.querySelectorAll('header h1'))el.firstChild.textContent='DISTRITO RIBERA';
  const tt=document.querySelector('#title .tt');if(tt)tt.innerHTML='DISTRITO<br>RIBERA';document.body.classList.add('ribera')}

