/* ---------- tráfico de las avenidas (v69) ----------
   Cada avenida tiene dos carriles por sentido (las rayas blancas del pavimento): el de afuera, junto a la banqueta, y el de
   adentro, junto a la doble amarilla. Camiones y tráileres van siempre por el de afuera; los coches van por cualquiera.
   Nadie se encima: cada quien frena detrás del de enfrente en su carril. Si un coche se queda atrás de uno lento, pone la
   direccional, revisa que el otro carril esté libre adelante y atrás, y se cambia en casi un segundo; luego, a veces,
   regresa a la derecha. Los camiones se paran en sus paradas y los coches les sacan la vuelta. Todos frenan ante la gente
   que cruza la avenida por el paso peatonal. Luces de freno, direccionales, faros de noche.
   Para dibujarlos sin que uno tape mal a otro, se ordenan por su caja en el piso: el carril de atrás va antes que el de enfrente. */
const LANEY={1:[.845,.615],'-1':[.155,.385]},VLEN={car:.44,suv:.48,pick:.54,mini:.38,bus:1.15,trailer:1.56};
const BUSSTOP={1:[4.5,14.5,24.5],'-1':[25.5,15.5,5.5]};
const CARS=[];{const r=rng(5),cc=['#d64545','#f4f4f4','#3a6ea5','#2b2b2b','#9aa0a8','#e0b03b','#f26a21','#2f6f5e','#7a2a3a'],mods=['car','car','car','suv','suv','pick','mini'];
  for(const row of [OFF,OFF+12])for(let k=0;k<9;k++){const dir=k%2?1:-1,m=mods[Math.floor(r()*mods.length)];CARS.push({row,dir,ln:r()<.6?1:0,sp:1.15+r()*1.15,off:r()*N,c:cc[Math.floor(r()*cc.length)],m,L:VLEN[m]})}
  // camiones urbanos (verde y naranja) en las dos avenidas y tráileres rumbo a Aceros El Cerro; van por el carril de afuera
  for(const row of [OFF,OFF+12])for(const dir of [1,-1]){const o=r()*N,tr=row===OFF+12||dir<0;
    CARS.push({row,dir,ln:0,sp:.9+r()*.12,off:o,type:'bus',L:VLEN.bus});if(tr)CARS.push({row,dir,ln:0,sp:.85+r()*.1,off:o+N/2,type:'trailer',L:VLEN.trailer})}}
let TRFT=0;const ahd=(c,o)=>((((o.x-c.x)*c.dir)%N)+N)%N;
const inLane=(o,l)=>o.ln===l||(o.chg&&o.chg.to===l);
// gente cruzando la avenida: casillas de cruce ocupadas en cada renglón
function crossing(row){const out=[];if(typeof walkers==='undefined')return out;for(const w of walkers){const x=Math.floor(w.X),y=Math.floor(w.Y);if(y===row&&inb(x,y)&&WK.pass[idx(x,y)]===2){out.push(x+.5);continue}
  if(w.st==='walk'&&w.path){const tn=w.path[Math.min(w.pi+1,w.path.length-1)];if(Math.floor(tn/N)===row&&WK.pass[tn]===2)out.push(tn%N+.5)}}return out}
function trafficStep(){const dt=Math.min(.1,Math.max(0,T-TRFT));TRFT=T;
  for(const c of CARS)if(c.x==null){c.x=c.off;c.v=c.sp;c.lat=LANEY[c.dir][c.ln];c.cd=0;c.dw=0;c.lastStop=null;c.brk=0}if(!dt)return;
  const groups=new Map();for(const c of CARS){const k=c.row+'|'+c.dir;(groups.get(k)||groups.set(k,[]).get(k)).push(c)}
  const peds={};for(const row of [OFF,OFF+12])peds[row]=crossing(row);
  for(const L of groups.values()){
    const leader=(c,l)=>{let a=null,g=1e9;for(const o of L){if(o===c||!inLane(o,l))continue;const q=ahd(c,o);if(q>0&&q<g){g=q;a=o}}return [a,g]};
    const follower=(c,l)=>{let a=null,g=1e9;for(const o of L){if(o===c||!inLane(o,l))continue;const q=ahd(o,c);if(q>0&&q<g){g=q;a=o}}return [a,g]};
    for(const c of L){c.cd-=dt;
      // ¿a quién sigo? en mi carril y, si me estoy cambiando, también en el de destino
      let [a,g]=leader(c,c.ln);if(c.chg){const [a2,g2]=leader(c,c.chg.to);if(a2&&g2<g){a=a2;g=g2}}
      const need=a?(c.L+a.L)/2+.28:0;let tv=c.sp;
      if(a&&g<need+1.5)tv=Math.max(0,Math.min(tv,a.v+(g-need)*1.6));
      // gente en el paso peatonal: frenar antes
      for(const px of peds[c.row]){const d=((((px-c.x)*c.dir)%N)+N)%N-c.L/2;if(d>-.1&&d<1.4)tv=Math.min(tv,Math.max(0,(d-.35)*1.8))}
      // parada del camión: frena, espera y sale
      if(c.type==='bus'){if(c.dw>0){c.dw-=dt;tv=0;if(c.dw<=0)c.go=1.2}else{for(const sx of BUSSTOP[c.dir]){if(sx===c.lastStop)continue;const d=((((sx-c.x)*c.dir)%N)+N)%N;if(d<2){tv=Math.min(tv,Math.max(0,d*1.1));if(d<.04&&c.v<.15){c.dw=2.2+Math.random()*1.4;c.lastStop=sx}}}}
        if(c.go>0)c.go-=dt}
      // cambio de carril: solo coches, atorados atrás de uno más lento, con el otro carril libre
      if(!c.type&&!c.chg&&c.cd<=0){const o=1-c.ln,blocked=a&&g<need+1.2&&(a.v<c.sp*.85||a.type),keepR=c.ln===1&&!blocked&&Math.random()<dt*.06;
        if(blocked||keepR){const [fa,fg]=leader(c,o),[ba,bg]=follower(c,o),okA=!fa||fg>(c.L+fa.L)/2+(keepR?2:.7)&&(!blocked||fa.v>(a?a.v:0)+.1||fg>2.5),okB=!ba||bg>(c.L+ba.L)/2+.5+Math.max(0,ba.v-c.v)*1.2;
          if(okA&&okB){c.chg={from:c.ln,to:o,t:0};c.cd=2.5+Math.random()*2}}}
      if(c.chg){c.chg.t+=dt/.95;const k=Math.min(1,c.chg.t),e=k*k*(3-2*k);c.lat=LANEY[c.dir][c.chg.from]+(LANEY[c.dir][c.chg.to]-LANEY[c.dir][c.chg.from])*e;if(k>=1){c.ln=c.chg.to;c.chg=null;c.lat=LANEY[c.dir][c.ln]}}
      const acc=tv>c.v?(c.type?.8:1.3):5.5;c.brk=tv<c.v-.03||c.v<.05&&tv<.05;c.v+=Math.max(-acc*dt,Math.min(acc*dt,tv-c.v));c.x=((c.x+c.dir*c.v*dt)%N+N)%N}}}
// orden de dibujo: los que comparten pantalla se ordenan por su caja en el piso (girada con la vista)
function vehOrder(cars,vb){const bx=c=>{const hl=VLEN[c.type||c.m]/2,hw=c.type?.12:.1,q=[rot(c.fx-hl,c.fy-hw),rot(c.fx+hl,c.fy-hw),rot(c.fx-hl,c.fy+hw),rot(c.fx+hl,c.fy+hw)];
    c.a0=Math.min(...q.map(v=>v[0]));c.a1=Math.max(...q.map(v=>v[0]));c.b0=Math.min(...q.map(v=>v[1]));c.b1=Math.max(...q.map(v=>v[1]));c.dk=(c.a0+c.a1+c.b0+c.b1)/2;c.bk=vb(c.fx,c.fy)};
  for(const c of cars)bx(c);cars.sort((p,q)=>p.dk-q.dk);
  const near=(p,q)=>p.row===q.row&&Math.abs(p.fx-q.fx)<(VLEN[p.type||p.m]+VLEN[q.type||q.m])/2+1,behind=(p,q)=>p.a1<=q.a0+.002||p.b1<=q.b0+.002;
  for(let pass=0;pass<6;pass++){let mv=0;for(let j=1;j<cars.length;j++)for(let i=0;i<j;i++){const p=cars[i],q=cars[j];if(near(p,q)&&behind(q,p)&&!behind(p,q)){cars.splice(j,1);cars.splice(i,0,q);mv=1;break}}if(!mv)break}
  for(let i=0;i<cars.length;i++)for(let j=0;j<i;j++)if(near(cars[i],cars[j])&&cars[i].bk<cars[j].bk)cars[i].bk=cars[j].bk;return cars}
// coches: sedán, camioneta, pick-up y compacto; carrocería levantada para que se vean las llantas
const CARC=new Map();
function carSprite(col,m,dir,nb){const key=`${col}|${m}|${dir}|${ROT}|${nb}|${RES}`;let sp=CARC.get(key);if(sp)return sp;
  const w=40,h=30,c=mkCanvas(w,h),pc=ctx,po={ox:cam.ox,oy:cam.oy},pn=NIGHT,pnc=NCOL;ctx=hdctx(c,false);
  const [rx,ry]=rot(.5,.5);cam.ox=w/2-(rx-ry)*TW/2;cam.oy=h-9-(rx+ry)*TH/2;NIGHT=nb;NCOL=ncol(nb);
  try{const L=VLEN[m],x0=.5-L/2,x1=.5+L/2,y0=.4,y1=.6,s1=shade(col,-.15),s2=shade(col,-.3),gl='#2b3a4d',sg=dir>0?1:-1,fr=dir>0?x1:x0;
    for(const yy of [y0+.02,y1-.02])for(const xx of [x0+.07,x1-.07]){const [px_,py_]=P(xx,yy);ellipse(px_,py_-.6,1.1,.9,'#1c1c1c')}
    if(m==='pick'){const cb=fr-sg*.24,ca=Math.min(cb,fr),cz=Math.max(cb,fr),ba=Math.min(cb,fr-sg*L),bz=Math.max(cb,fr-sg*L);
      box(x0,y0,x1,y1,.8,2.4,col,s1,s2);box(ca+(sg>0?0:.04),y0+.02,cz-(sg>0?.04:0),y1-.02,3.2,2.2,gl,'#22303f','#1a2633');box(ca+(sg>0?.03:.07),y0+.02,cz-(sg>0?.07:.03),y1-.02,5.2,.6,col,s1,s2);
      box(ba+.02,y0+.03,bz-.02,y1-.03,3,.5,s2,s2,s2)}
    else{const hb=m==='suv'?3.2:m==='mini'?2.5:2.6,ch=m==='suv'?2.4:2,i0=m==='suv'?.06:m==='mini'?.08:.1,i1=m==='suv'?.38:m==='mini'?.3:.32;
      box(x0,y0,x1,y1,.8,hb,col,s1,s2);box(x0+i0,y0+.025,x0+i1,y1-.025,.8+hb,ch,gl,'#22303f','#1a2633');if(m==='suv')box(x0+i0,y0+.025,x0+i1,y1-.025,.8+hb+ch,.6,col,s1,s2)}
    // v80: faros y calaveras (encendidos de noche), brillo en el parabrisas y contorno como el de los edificios
    {const rear=dir>0?x0:x1,on=nb>.3;
      if(seen(sg,0)){vq(fr,y0+.025,fr,y0+.065,1.5,2.5,on?'#fff3c0':'#e8e4d6',on);vq(fr,y1-.065,fr,y1-.025,1.5,2.5,on?'#fff3c0':'#e8e4d6',on)}
      if(seen(-sg,0)){vq(rear,y0+.025,rear,y0+.06,1.6,2.5,on?'#ff4a3d':'#a8322a',on);vq(rear,y1-.06,rear,y1-.025,1.6,2.5,on?'#ff4a3d':'#a8322a',on)}
      for(const [ys,n] of [[y1,1],[y0,-1]])if(seen(0,n)){vq(x0+.05,ys,x1-.05,ys,1,1.35,s2);if(!on)vq(fr-sg*.2,ys,fr-sg*.17,ys,m==='pick'?3.6:3.8,m==='pick'?5:5.2,'rgba(255,255,255,.55)',true)}}
    fastOutline(ctx)}
  catch(e){console.warn('auto',m,e)}
  finally{ctx=pc;cam.ox=po.ox;cam.oy=po.oy;NIGHT=pn;NCOL=pnc}
  // al llenarse se sacan los más viejos, no toda la caché de golpe
  sp={c,ax:w/2,ay:h-9};if(CARC.size>400){let n=0;for(const k of CARC.keys()){CARC.delete(k);if(++n>=120)break}}CARC.set(key,sp);return sp}
/* camión urbano y tráiler: se arman con cajas y caras laterales; los detalles solo se pintan en las caras que se ven */
const VEH={bus:{L:1.15,W:.24},trailer:{L:1.56,W:.24}};
function vq(ax,ay,bx,by,v0,v1,col,lit){poly([up(P(ax,ay),v0),up(P(bx,by),v0),up(P(bx,by),v1),up(P(ax,ay),v1)],col,lit)}
function seen(nx,ny){const a=rot(.5+nx,.5+ny),b=rot(.5,.5);return (a[0]-b[0])+(a[1]-b[1])>.001}
function wheel(fx,fy){const [x,y]=P(fx,fy);ellipse(x,y-1,1.5,1.3,'#1c1c1c');px(x-.5,y-1.5,1,.8,'#8a9099')}
function vehBus(dir){const {L,W}=VEH.bus,H=8.4,x0=.5-L/2,x1=.5+L/2,y0=.5-W/2,y1=.5+W/2,fr=dir>0?x1:x0,bk=dir>0?x0:x1,on=NIGHT>.4;
  for(const yy of [y0,y1])for(const f of [.2,.78]){const xx=bk+(fr-bk)*f;wheel(xx,yy)}
  box(x0,y0,x1,y1,1,H-1,'#8fdc7a','#33b24c','#279a3e');
  for(const [ys,n] of [[y1,1],[y0,-1]]){if(!seen(0,n))continue;
    vq(x0,ys,x1,ys,1,2.4,'#1f7a34');const rx=bk+(fr-bk)*.16;vq(bk,ys,rx,ys,1,H,'#f08a24');vq(bk,ys,rx,ys,1,2.4,'#c96a14');
    const w0=bk+(fr-bk)*.2,w1=bk+(fr-bk)*.9;vq(w0,ys,w1,ys,4.2,7.3,on?'#ffe2a0':'#1d2a33',on);
    for(let k=1;k<6;k++){const q=w0+(w1-w0)*k/6;vq(q,ys,q+(fr-bk)*.012,ys,4.2,7.3,'#279a3e')}
    const d0=bk+(fr-bk)*.55;vq(d0,ys,d0+(fr-bk)*.08,ys,1.2,7.3,'#1d2a33');const d1=bk+(fr-bk)*.9;vq(d1,ys,d1+(fr-bk)*.07,ys,1.2,7.3,'#1d2a33')}
  const nf=dir>0?1:-1;
  if(seen(nf,0)){vq(fr,y0,fr,y1,3.4,7.4,'#2a3f55');vq(fr,y0,fr,y1,7.4,8.3,'#ffb43a',on||true);vq(fr,y0+.03,fr,y0+.07,1.6,2.4,'#f4f4f4',true);vq(fr,y1-.07,fr,y1-.03,1.6,2.4,'#f4f4f4',true)}
  if(seen(-nf,0)){vq(bk,y0,bk,y1,1,H,'#f08a24');vq(bk,y0+.04,bk,y1-.04,4.6,7,'#1d2a33');vq(bk,y0+.02,bk,y0+.06,1.8,3.2,'#d62828',true);vq(bk,y1-.06,bk,y1-.02,1.8,3.2,'#d62828',true)}
  const c0=.5-.12,c1=.5+.12;box(c0,y0+.06,c1,y1-.06,H,1.1,'#f6b46a','#f08a24','#c96a14')}
function vehTrailer(dir){const {L,W}=VEH.trailer,x0=.5-L/2,x1=.5+L/2,y0=.5-W/2,y1=.5+W/2,fr=dir>0?x1:x0,bk=dir>0?x0:x1,sg=dir>0?1:-1,on=NIGHT>.4;
  const cabL=.34,cab0=fr-sg*cabL,tr1=cab0-sg*.04,H=10.5;
  for(const yy of [y0,y1]){for(const f of [.06,.14,.62,.7])wheel(bk+(fr-bk)*f,yy);wheel(fr-sg*.07,yy)}
  // caja del remolque: blanca con óxido
  const tx0=Math.min(bk,tr1),tx1=Math.max(bk,tr1);box(tx0,y0,tx1,y1,1.8,H-1.8,'#ece7dc','#d9d2c4','#bdb4a3');
  for(const [ys,n] of [[y1,1],[y0,-1]]){if(!seen(0,n))continue;
    for(let k=1;k<9;k++){const q=tx0+(tx1-tx0)*k/9;vq(q,ys,q+.006,ys,2,H-.4,'#c4bcab')}
    for(const [f,h0,h1] of [[.12,4,9],[.33,2.4,6],[.5,6,10],[.71,2.2,4.6],[.86,5,8.6]]){const q=tx0+(tx1-tx0)*f;vq(q,ys,q+.03,ys,h0,h1,'#a86a3a')}
    vq(tx0,ys,tx1,ys,1.8,2.8,'#9a8f7c');for(let k=0;k<7;k++){const q=tx0+(tx1-tx0)*(k+.3)/7;vq(q,ys,q+.05,ys,2.1,2.5,k%2?'#d62828':'#f4f4f4',on)}}
  if(seen(-sg,0)){vq(bk,y0,bk,y1,1.8,H,'#d9d2c4');vq(bk,(y0+y1)/2-.004,bk,(y0+y1)/2+.004,1.8,H,'#9a8f7c');vq(bk,y0+.02,bk,y0+.06,2,3,'#d62828',true);vq(bk,y1-.06,bk,y1-.02,2,3,'#d62828',true)}
  // cabina roja: cofre bajo y cabina alta
  const ca=Math.min(cab0,fr),cb2=Math.max(cab0,fr),hood=fr-sg*.13,ha=Math.min(hood,fr),hb=Math.max(hood,fr),ka=Math.min(cab0,hood),kb=Math.max(cab0,hood);
  box(ka,y0,kb,y1,1.2,7.4,'#d0634a','#b8442e','#963622');box(ha,y0+.01,hb,y1-.01,1.2,4.4,'#d0634a','#b8442e','#963622');
  box(ka+(sg>0?0:.04),y0+.02,kb-(sg>0?.04:0),y1-.02,8.6,1.6,'#a88a6a','#8a6a4a','#6a4e34');
  for(const [ys,n] of [[y1,1],[y0,-1]]){if(!seen(0,n))continue;const a=cab0+sg*.04,b=hood-sg*.03;vq(a,ys,b,ys,5.2,7.6,on?'#ffe2a0':'#22404f',on);vq(ka,ys,kb,ys,1.2,1.8,'#c9cdd2');vq(cab0+sg*.06,ys,cab0+sg*.1,ys,3,4,'#f4f4f4')}
  if(seen(sg,0)){vq(fr,y0+.03,fr,y1-.03,1.8,4.2,'#c9cdd2');for(let k=0;k<5;k++){const yy=y0+.06+k*.035;vq(fr,yy,fr,yy+.012,2,4,'#6b7078')}vq(fr,y0+.01,fr,y1-.01,1.2,1.8,'#9aa0a8');
    vq(fr,y0+.02,fr,y0+.05,2.6,3.2,'#ffe9b0',true);vq(fr,y1-.05,fr,y1-.02,2.6,3.2,'#ffe9b0',true);vq(hood,y0,hood,y1,5.2,7.6,on?'#ffe2a0':'#22404f',on)}
  // escape cromado detrás de la cabina
  {const [x,y]=P(cab0-sg*.02,y1+.01);px(x-.5,y-12.6,1,11.4,'#c9cdd2');px(x-.5,y-12.6,1,1,'#8a9099')}}
const VEHC=new Map();
function vehSprite(type,dir,nb){const key=`${type}|${dir}|${ROT}|${nb}|${RES}`;let sp=VEHC.get(key);if(sp)return sp;
  const w=84,h=52,c=mkCanvas(w,h),pc=ctx,po={ox:cam.ox,oy:cam.oy},pn=NIGHT,pnc=NCOL;ctx=hdctx(c);
  const [rx,ry]=rot(.5,.5);cam.ox=w/2-(rx-ry)*TW/2;cam.oy=h-12-(rx+ry)*TH/2;NIGHT=nb;NCOL=ncol(nb);
  try{type==='bus'?vehBus(dir):vehTrailer(dir);outline(ctx,1)}catch(e){console.warn('vehículo',type,e)}finally{ctx=pc;cam.ox=po.ox;cam.oy=po.oy;NIGHT=pn;NCOL=pnc}
  sp={c,ax:w/2,ay:h-12};if(VEHC.size>96)VEHC.clear();VEHC.set(key,sp);return sp}
function drawBig(c){const [cx,cy]=P(c.fx,c.fy),V=VEH[c.type];
  ellipse(cx,cy+1,V.L*13,V.L*5,'rgba(0,0,0,.18)',true);
  const s1=vehSprite(c.type,c.dir,NLO);ctx.drawImage(s1.c,rr(cx-s1.ax),rr(cy-s1.ay),s1.c.width/RES,s1.c.height/RES);
  if(NFR){const s2=vehSprite(c.type,c.dir,NHI);ctx.globalAlpha=NFR;ctx.drawImage(s2.c,rr(cx-s2.ax),rr(cy-s2.ay),s2.c.width/RES,s2.c.height/RES);ctx.globalAlpha=1}
  const half=V.L/2,fxF=c.fx+c.dir*half;
  if(NIGHT>.3&&c.type==='bus'){const [sx,sy]=P(fxF,c.fy);glow(sx,sy-8,4,.6,'#ffb43a')}
  // humo del tráiler
  if(c.type==='trailer'&&!lowMo()&&!lowQ()){const sg=c.dir,[x,y]=P(c.fx+sg*(half-.34)-sg*.02,c.fy+.15),col=mx('#8a8a8a','#4a4e66',NIGHT*.8);
    for(let k=0;k<4;k++){const p=((T*.9+k/4+c.sp*7)%1),a=(1-p)*.42;ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-sg*p*9,y-13-p*7,1+p*2.6,0,7);ctx.fill()}ctx.globalAlpha=1}}
// luces: faros y calaveras; freno (más rojo), direccional (ámbar parpadeando) del lado al que se cambia
function carLights(c,L,hw){const fx=c.fx+c.dir*L/2,bxv=c.fx-c.dir*L/2,[x,y]=P(fx,c.fy),[bx,by]=P(bxv,c.fy),n=NIGHT>.3;
  if(n){const [ax,ay]=P(fx+c.dir*(c.type?.7:.55),c.fy);glow(x,y-2,c.type?6:5,.7,'#fff1c8');if(!lowQ()){const ga=ctx.globalAlpha;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,.5*NIGHT)*ga;ctx.translate((x+ax)/2,(y+ay)/2);ctx.rotate(Math.atan2(ay-y,ax-x));ctx.drawImage(gtex('#ffe3a6'),c.type?-14:-11,c.type?-4.5:-3.5,c.type?28:22,c.type?9:7);ctx.restore()}}
  for(const s of [-1,1]){const [rx,ry]=P(bxv,c.fy+s*hw);if(c.brk||n){px(rx-.5,ry-(c.type?3:2.4),1,.8,c.brk?'#ff2a1f':'#b3261e',true);if(c.brk||n)glow(rx,ry-2,c.brk?(n?4:2.6):2.2,c.brk?.8:.5,'#ff3b2f')}}
  const bl=c.chg?Math.sign(LANEY[c.dir][c.chg.to]-LANEY[c.dir][c.chg.from]):c.go>0?Math.sign(LANEY[c.dir][1]-LANEY[c.dir][0]):0;
  if(bl&&(T*3.2)%1<.55)for(const xe of [fx,bxv]){const [qx,qy]=P(xe,c.fy+bl*hw);px(qx-.5,qy-(c.type?3.6:2.6),1,.9,'#ffb020',true);glow(qx,qy-2.4,2.6,.8,'#ffb020')}}
function drawCar(c){
  if(c.type){drawBig(c);carLights(c,VEH[c.type].L,.12);return}
  const [cx,cy]=P(c.fx,c.fy),L=VLEN[c.m];ellipse(cx,cy+.5,L*12,L*5,'rgba(0,0,0,.16)',true);
  const s1=carSprite(c.c,c.m,c.dir,NLO);ctx.drawImage(s1.c,rr(cx-s1.ax),rr(cy-s1.ay),s1.c.width/RES,s1.c.height/RES);
  if(NFR){const s2=carSprite(c.c,c.m,c.dir,NHI);ctx.globalAlpha=NFR;ctx.drawImage(s2.c,rr(cx-s2.ax),rr(cy-s2.ay),s2.c.width/RES,s2.c.height/RES);ctx.globalAlpha=1}
  carLights(c,L,.1)}
