const CARS=[];{const r=rng(5),cc=['#d64545','#f4f4f4','#3a6ea5','#2b2b2b','#9aa0a8','#e0b03b','#f26a21'];
  for(const row of [OFF,OFF+12])for(let k=0;k<7;k++){const dir=k%2?1:-1;CARS.push({row,lane:dir>0?.32:.68,dir,sp:1.2+r()*1.2,off:r()*N,c:cc[Math.floor(r()*cc.length)]})}
  // camiones urbanos (verde y naranja) en las dos avenidas y tráileres rumbo a DeAcero por la de abajo; van más lento que los coches
  // en cada carril, el camión y el tráiler van a la misma velocidad y a media avenida de distancia: así nunca se enciman
  for(const row of [OFF,OFF+12])for(const dir of [1,-1]){const o=r()*N,sp=.82+r()*.1,tr=row===OFF+12||dir<0;
    CARS.push({row,lane:dir>0?.32:.68,dir,sp,off:o,type:'bus'});if(tr)CARS.push({row,lane:dir>0?.32:.68,dir,sp,off:o+N/2,type:'trailer'})}}
// tráfico (v65): cada vehículo lleva su posición y su velocidad. Si alcanza al de enfrente en su carril, frena;
// un coche que se queda atrás de un camión o tráiler lo rebasa por el lado de adentro y regresa a su carril
const VLEN={car:.5,bus:1.15,trailer:1.56};let TRFT=0;
function trafficStep(){const dt=Math.min(.1,Math.max(0,T-TRFT));TRFT=T;for(const c of CARS)if(c.x==null){c.x=c.off;c.v=c.sp;c.lo=0;c.stuck=0}if(!dt)return;
  const lanes=new Map();for(const c of CARS){const key=c.row+'|'+c.dir;if(!lanes.has(key))lanes.set(key,[]);lanes.get(key).push(c)}
  for(const L of lanes.values()){
    for(const c of L){let ahead=null,gap=1e9;
      for(const o of L){if(o===c||(c.pass&&o.type))continue;if(!!o.pass!==!!c.pass&&!o.type)continue;const g=(((o.x-c.x)*c.dir)%N+N)%N;if(g>0&&g<gap){gap=g;ahead=o}}
      const need=ahead?(VLEN[c.type||'car']+VLEN[ahead.type||'car'])/2+.3:0;let tv=c.sp;
      if(ahead&&gap<need+1.4)tv=Math.max(0,Math.min(c.sp,ahead.v+(gap-need)*1.6));
      // atorado atrás de uno grande: rebasa
      if(!c.type&&!c.pass&&ahead&&ahead.type&&gap<need+.5){c.stuck+=dt;if(c.stuck>1.2){c.pass=ahead;c.stuck=0}}else if(!c.pass)c.stuck=0;
      if(c.pass){tv=c.sp*1.15;const g2=(((c.x-c.pass.x)*c.dir)%N+N)%N;if(g2>0&&g2<N/2&&g2>(VLEN.car+VLEN[c.pass.type])/2+.25&&!L.some(o=>o!==c&&!o.pass&&Math.min((((o.x-c.x)%N)+N)%N,(((c.x-o.x)%N)+N)%N)<(VLEN.car+VLEN[o.type||'car'])/2+.2))c.pass=null}
      const acc=tv>c.v?1.2:5;c.v+=Math.max(-acc*dt,Math.min(acc*dt,tv-c.v));c.x=((c.x+c.dir*c.v*dt)%N+N)%N;
      const lo=c.pass?(c.dir>0?.13:-.13):0;c.lo+=(lo-c.lo)*Math.min(1,dt*4)}}}
const CARC=new Map();
function carSprite(col,nb){const key=`${col}|${ROT}|${nb}|${RES}`;let sp=CARC.get(key);if(sp)return sp;
  const w=36,h=26,c=mkCanvas(w,h),pc=ctx,po={ox:cam.ox,oy:cam.oy},pn=NIGHT,pnc=NCOL;ctx=hdctx(c,false);
  const [rx,ry]=rot(.5,.5);cam.ox=w/2-(rx-ry)*TW/2;cam.oy=h-8-(rx+ry)*TH/2;NIGHT=nb;NCOL=ncol(nb);
  try{const x0=.28,y0=.39;box(x0,y0,x0+.44,y0+.22,0,3,col,shade(col,-.15),shade(col,-.3));box(x0+.1,y0+.03,x0+.32,y0+.19,3,2,'#2b3a4d','#22303f','#1a2633')}
  finally{ctx=pc;cam.ox=po.ox;cam.oy=po.oy;NIGHT=pn;NCOL=pnc}
  sp={c,ax:w/2,ay:h-8};if(CARC.size>160)CARC.clear();CARC.set(key,sp);return sp}
/* camión urbano y tráiler: se arman con cajas y caras laterales; los detalles solo se pintan en las caras que se ven */
const VEH={bus:{L:1.15,W:.28},trailer:{L:1.56,W:.28}};
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
  const half=V.L/2,fxF=c.fx+c.dir*half,fxB=c.fx-c.dir*half;
  if(NIGHT>.3){const [x,y]=P(fxF,c.fy),[ax,ay]=P(fxF+c.dir*.7,c.fy),[bx,by]=P(fxB,c.fy);glow(x,y-3,6,.8,'#fff1c8');
    if(!OPT.low){const ga=ctx.globalAlpha;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,.55*NIGHT)*ga;ctx.translate((x+ax)/2,(y+ay)/2);ctx.rotate(Math.atan2(ay-y,ax-x));ctx.drawImage(gtex('#ffe3a6'),-14,-4.5,28,9);ctx.restore()}
    glow(bx,by-3,3,.7,'#ff3b2f');if(c.type==='bus'){const [sx,sy]=P(fxF,c.fy);glow(sx,sy-8,4,.6,'#ffb43a')}}
  // humo del tráiler
  if(c.type==='trailer'&&!lowMo()&&!OPT.low){const sg=c.dir,[x,y]=P(c.fx+sg*(half-.34)-sg*.02,c.fy+.15),col=mx('#8a8a8a','#4a4e66',NIGHT*.8);
    for(let k=0;k<4;k++){const p=((T*.9+k/4+c.sp*7)%1),a=(1-p)*.42;ctx.globalAlpha=a;ctx.fillStyle=col;ctx.beginPath();ctx.arc(x-sg*p*9,y-13-p*7,1+p*2.6,0,7);ctx.fill()}ctx.globalAlpha=1}}
function drawCar(c){
  if(c.type){drawBig(c);return}
  const x0=c.fx-.22,y0=c.fy-.11,[cx,cy]=P(c.fx,c.fy);
  const s1=carSprite(c.c,NLO);ctx.drawImage(s1.c,rr(cx-s1.ax),rr(cy-s1.ay),s1.c.width/RES,s1.c.height/RES);
  if(NFR){const s2=carSprite(c.c,NHI);ctx.globalAlpha=NFR;ctx.drawImage(s2.c,rr(cx-s2.ax),rr(cy-s2.ay),s2.c.width/RES,s2.c.height/RES);ctx.globalAlpha=1}
  if(NIGHT>.3){const fx=c.dir>0?x0+.44:x0,[x,y]=P(fx,c.fy),[ax,ay]=P(fx+c.dir*.55,c.fy),[bx,by]=P(c.dir>0?x0:x0+.44,c.fy);
    glow(x,y-2,5,.7,'#fff1c8');if(!OPT.low){const ga=ctx.globalAlpha;ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=Math.min(1,.5*NIGHT)*ga;ctx.translate((x+ax)/2,(y+ay)/2);ctx.rotate(Math.atan2(ay-y,ax-x));ctx.drawImage(gtex('#ffe3a6'),-11,-3.5,22,7);ctx.restore()}
    glow(bx,by-2,2.5,.6,'#ff3b2f')}
}
