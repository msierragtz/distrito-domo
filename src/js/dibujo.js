/* ---------- dibujo ---------- */
const cv=document.getElementById('cv');let ctx=cv.getContext('2d');
let zoom=window.innerWidth<600?2:3,panX=0,panY=0,bw=0,bh=0,cam={ox:0,oy:0},T=0,hover=-1,tool='edificio',WC=0,SEED=0;
let ROT=0,GV=0,HEAT=false,TITLE=true,PAUSED=false;
function setPause(v){PAUSED=v;const b=document.getElementById('pauseb');if(b){b.setAttribute('aria-pressed',v);b.textContent=v?'▶':'❚❚';b.setAttribute('aria-label',v?'Seguir (barra espaciadora o P)':'Pausa (barra espaciadora o P)')}const pb=document.getElementById('pausebar');if(pb)pb.hidden=!v;if(v&&S)save()}
/* rotación de 90° en 90°: mundo -> vista */
const rot=(x,y,r=ROT)=>r===0?[x,y]:r===1?[N-y,x]:r===2?[N-x,N-y]:[y,N-x];
const Q=(vx,vy)=>[cam.ox+(vx-vy)*TW/2,cam.oy+(vx+vy)*TH/2];
const P=(fx,fy)=>{const [a,b]=rot(fx,fy);return Q(a,b)};
function orient(pts){let T_=pts[0],B=pts[0],L=pts[0],R=pts[0];for(const p of pts){if(p[1]<T_[1])T_=p;if(p[1]>B[1])B=p;if(p[0]<L[0])L=p;if(p[0]>R[0])R=p}return{T:T_,R,B,L}}
const SH=new Map();
function hexShade(hex,a){const c=hex2(hex),t=a<0?0:255,p=Math.abs(a);return '#'+c.map(v=>Math.round(v+(t-v)*p).toString(16).padStart(2,'0')).join('')}
function shade(hex,a){const key=hex+a;if(SH.has(key))return SH.get(key);let c=hex2(hex);const t=a<0?0:255,p=Math.abs(a);c=c.map(v=>Math.round(v+(t-v)*p));const r=`rgb(${c})`;SH.set(key,r);return r}
/* dibujo pixel por pixel: bordes nítidos, sin suavizado del navegador */
/* HD: todo se mide en las unidades de siempre, pero se pinta con RES pixeles por unidad */
let RES=2;const rr=v=>Math.round(v*RES)/RES;
function hdctx(c,rd){const x=c.getContext('2d',rd===false?undefined:{willReadFrequently:true});x.setTransform(RES,0,0,RES,0,0);x.imageSmoothingEnabled=false;return x}
function mkCanvas(w,h){const c=document.createElement('canvas');c.width=Math.ceil(w*RES);c.height=Math.ceil(h*RES);return c}
const XS=[];
function rasterPoly(pts){
  let y0=Infinity,y1=-Infinity;for(const p of pts){if(p[1]<y0)y0=p[1];if(p[1]>y1)y1=p[1]}
  y0=Math.round(y0*RES);y1=Math.round(y1*RES);const n=pts.length,u=1/RES;
  for(let y=y0;y<y1;y++){const sy=(y+.5)/RES;XS.length=0;
    for(let i=0;i<n;i++){const a=pts[i],b=pts[(i+1)%n];if((a[1]<=sy&&b[1]>sy)||(b[1]<=sy&&a[1]>sy))XS.push(a[0]+(sy-a[1])/(b[1]-a[1])*(b[0]-a[0]))}
    XS.sort((p,q)=>p-q);for(let i=0;i+1<XS.length;i+=2){const xa=Math.round(XS[i]*RES),xb=Math.round(XS[i+1]*RES);if(xb>xa)ctx.fillRect(xa*u,y*u,(xb-xa)*u,u)}}
}
function poly(pts,c,lit){ctx.fillStyle=pcol(c);rasterPoly(pts);if(!lit&&NIGHT>0){ctx.fillStyle=NCOL;rasterPoly(pts)}return pts}
function spans(rows,c,lit){const u=1/RES;ctx.fillStyle=pcol(c);for(const r of rows)ctx.fillRect(r[0],r[1],r[2],u);if(!lit&&NIGHT>0){ctx.fillStyle=NCOL;for(const r of rows)ctx.fillRect(r[0],r[1],r[2],u)}}
function ellRows(cx,cy,rx,ry){const out=[];for(let y=Math.round((cy-ry)*RES);y<Math.round((cy+ry)*RES);y++){const dy=((y+.5)/RES-cy)/ry;if(Math.abs(dy)>=1)continue;const w=rx*Math.sqrt(1-dy*dy),a=rr(cx-w),b=rr(cx+w);if(b>a)out.push([a,y/RES,b-a])}return out}
function circ(x,y,r,c,lit){spans(ellRows(x,y,r,r),c,lit)}
function ellipse(x,y,rx,ry,c,lit){spans(ellRows(x,y,rx,ry),c,lit)}
/* arco superior grueso (para El Domo y los logos) */
function arcTop(cx,cy,R,th,c,lit){const out=[],Ri=R-th;for(let yd=Math.round((cy-R)*RES);yd<Math.round(cy*RES);yd++){const y=yd/RES,dy=cy-(yd+.5)/RES;if(dy<0||dy>=R)continue;const ho=Math.sqrt(R*R-dy*dy),hi=dy<Ri?Math.sqrt(Ri*Ri-dy*dy):0;
  const a=rr(cx-ho),b=rr(cx-hi),e=rr(cx+hi),f=rr(cx+ho);if(b>a)out.push([a,y,b-a]);if(f>e&&e>=b)out.push([e,y,f-e]);else if(f>b&&e<b)out[out.length-1]=[a,y,f-a]}spans(out,c,lit)}
function line(x0,y0,x1,y1,c,lit,w=1){const u=1/RES;w=w===1?1:w*RES;x0=Math.round(x0*RES);y0=Math.round(y0*RES);x1=Math.round(x1*RES);y1=Math.round(y1*RES);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;const pts=[];
  for(let k=0;k<500;k++){pts.push([x0,y0,w]);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx}if(e2<=dx){e+=dx;y0+=sy}}
  ctx.fillStyle=pcol(c);for(const p of pts)ctx.fillRect(p[0]*u,p[1]*u,w*u,w*u);if(!lit&&NIGHT>0){ctx.fillStyle=NCOL;for(const p of pts)ctx.fillRect(p[0]*u,p[1]*u,w*u,w*u)}}
/* temporadas: mes patrio (septiembre), Día de Muertos (25 oct – 3 nov) y Navidad (1 dic – 6 ene), según la fecha real o la opción del jugador; los adornos están en temporadas.js */
function SEASON(){if(OPT.season&&OPT.season!=='auto')return OPT.season==='none'?null:OPT.season;const d=new Date(),m=d.getMonth()+1,dd=d.getDate();
  if(m===9)return 'patrias';if((m===10&&dd>=25)||(m===11&&dd<=3))return 'muertos';if(m===12||(m===1&&dd<=6))return 'navidad';return null}
const GRITO=()=>{const d=new Date();return SEASON()==='patrias'&&(OPT.season==='patrias'||(d.getMonth()===8&&(d.getDate()===15||d.getDate()===16)))};
let SEASON_C=null,FWS=0;
/* variedad: cada restaurante, café o bar cambia sus colores de toldos y letreros */
let PSW=null;const pcol=c=>PSW&&PSW[c]||c;
const RED=['#d62828','#c23a2e','#a8322a','#e04a3a','#b81f1f','#e5534b'];
const mkPal=(src,dst)=>Object.fromEntries(src.map((c,i)=>[c,dst[i%dst.length]]));
const VARP={
  resto:[mkPal(RED,['#2a9d8f','#23877b','#1c6f65','#33b3a3','#20796f','#33b3a3']),mkPal(RED,['#e8a33d','#cf8f2f','#b37a26','#f0b44f','#c98a2a','#f0b44f']),mkPal(RED,['#3f8f4a','#357a3f','#2b6634','#4fa45a','#2f7a3a','#4fa45a'])],
  cafe:[mkPal(RED.concat(['#2a9d8f','#f26a21']),['#3a6ea5','#325f8f','#284d75','#4a82bd','#2c5a8a','#4a82bd','#e5534b','#2a9d8f']),mkPal(RED.concat(['#2a9d8f','#f26a21']),['#7a4e2c','#6a4326','#57371f','#8c5c36','#5e3c22','#8c5c36','#e8a33d','#59cd90']),mkPal(RED.concat(['#2a9d8f','#f26a21']),['#9b5de5','#8549c9','#6f3bab','#ad73f0','#7a43bb','#ad73f0','#2a9d8f','#ff8fb1'])],
  bar:[mkPal(['#f2c94c','#d62828','#2f7d55'],['#ff8fb1','#3a6ea5','#7a3e8c']),mkPal(['#f2c94c','#d62828','#2f7d55'],['#59cd90','#e8a33d','#1f4d6b']),mkPal(['#f2c94c','#d62828','#2f7d55'],['#ffffff','#2a9d8f','#b03a2e'])]};
{const EX={resto:[{'#f26a21':'#2a9d8f','#3fa38a':'#d62828','#33876f':'#a8322a','#7a4e2c':'#4a5a6a'},{'#f26a21':'#d62828','#3fa38a':'#3a6ea5','#33876f':'#2c5a8a','#7a4e2c':'#8a5a3a'},{'#f26a21':'#9b5de5','#3fa38a':'#e8a33d','#33876f':'#c98a2a','#7a4e2c':'#3a3a3a'}],
  cafe:[{'#7a3a22':'#2c5a8a','#c2603e':'#4a82bd','#6a3220':'#284d75','#59cd90':'#ff8fb1'},{'#7a3a22':'#3f6b3a','#c2603e':'#6aa35a','#6a3220':'#2f522b','#59cd90':'#f2c94c'},{'#7a3a22':'#5a2d6e','#c2603e':'#9b5de5','#6a3220':'#47235a','#59cd90':'#3fa7d6'}],
  bar:[{'#1f5a3c':'#2c5a8a','#184a31':'#284d75','#7a4e2c':'#4a3a5a','#c97b4f':'#8a6aa8','#5a3a24':'#33283f'},{'#1f5a3c':'#b37a26','#184a31':'#8a5e1d','#7a4e2c':'#3f5a3a','#c97b4f':'#6a8a5a','#5a3a24':'#2c3f29'},{'#1f5a3c':'#8a2c22','#184a31':'#6a2219','#7a4e2c':'#5a5f6b','#c97b4f':'#9aa0ab','#5a3a24':'#3a3d45'}]};
 for(const k in EX)EX[k].forEach((m,i)=>Object.assign(VARP[k][i],m))}
delete VARP.resto; // cada línea de restaurante ya tiene su propio dibujo
function px(x,y,w,h,c,lit){x=rr(x);y=rr(y);ctx.fillStyle=pcol(c);ctx.fillRect(x,y,w,h);if(!lit&&NIGHT>0){ctx.fillStyle=NCOL;ctx.fillRect(x,y,w,h)}}
let GLOWS=null;
// halos de luz (v54): una textura guardada y mezcla aditiva, así la luz suma sobre la noche en vez de tapar
const GTEX={};let LIGHTN=0;
function gtex(c){let t=GTEX[c];if(t)return t;t=document.createElement('canvas');t.width=t.height=64;const x=t.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);
  const [r,gg,b]=c3(c);g.addColorStop(0,`rgba(${r},${gg},${b},1)`);g.addColorStop(.25,`rgba(${r},${gg},${b},.55)`);g.addColorStop(.6,`rgba(${r},${gg},${b},.16)`);g.addColorStop(1,`rgba(${r},${gg},${b},0)`);x.fillStyle=g;x.fillRect(0,0,64,64);return GTEX[c]=t}
function glow(x,y,r,a,c){if(GLOWS){GLOWS.push([x,y,r,a,c]);return}if(NIGHT<.15)return;const ga=ctx.globalAlpha,k=Math.min(1,a*NIGHT*(OPT.hc?.6:.85))*ga;if(k<.01)return;
  LIGHTN++;ctx.globalCompositeOperation='lighter';ctx.globalAlpha=k;ctx.drawImage(gtex(c||'#ffb86a'),x-r*1.25,y-r*1.25,r*2.5,r*2.5);ctx.globalAlpha=ga;ctx.globalCompositeOperation='source-over'}
const up=(p,d)=>[p[0],p[1]-d];
function box(x0,y0,x1,y1,lift,h,top,left,right){
  const {T:T_,R,B,L}=orient([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)]);
  poly([up(L,lift),up(B,lift),up(B,lift+h),up(L,lift+h)],left);
  poly([up(B,lift),up(R,lift),up(R,lift+h),up(B,lift+h)],right);
  poly([up(T_,lift+h),up(R,lift+h),up(B,lift+h),up(L,lift+h)],top);
  return{T:T_,R,B,L,lift};
}
function face(g,side,u,v,du,dv,col,lit){
  const A=side==='L'?g.L:g.B,Bp=side==='L'?g.B:g.R;
  const p=(uu,vv)=>[A[0]+(Bp[0]-A[0])*uu,A[1]+(Bp[1]-A[1])*uu-g.lift-vv];
  return poly([p(u,v),p(u+du,v),p(u+du,v+dv),p(u,v+dv)],col,lit);
}
/* ventana que se enciende de noche según una semilla */
function win(g,side,u,v,du,dv,col){
  WC++;const h=Math.abs(Math.sin(SEED*12.9898+WC*78.233)*43758.5453)%1;
  const lit=NIGHT>.2&&h<(NIGHT>.9?WLTH[WLATE]:.46);
  face(g,side,u,v,du,dv,lit?(h<.2?'#ffe9a8':'#ffc96b'):col,lit);
}
function pyramid(x0,y0,x1,y1,lift,h,cl,cr){
  const o=orient([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)]),T_=up(o.T,lift),R=up(o.R,lift),B=up(o.B,lift),L=up(o.L,lift);
  const c=P((x0+x1)/2,(y0+y1)/2),A=[c[0],c[1]-lift-h];
  poly([L,T_,A],shade(cl,.15));poly([T_,R,A],shade(cr,.15));poly([L,B,A],cl);poly([B,R,A],cr);
}
function topFace(x0,y0,x1,y1,lift,col){const o=orient([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)]);poly([up(o.T,lift),up(o.R,lift),up(o.B,lift),up(o.L,lift)],col)}
function diamond(gx,gy,ins,col){poly([P(gx+ins,gy+ins),P(gx+1-ins,gy+ins),P(gx+1-ins,gy+1-ins),P(gx+ins,gy+1-ins)],col)}
function tree(fx,fy,sz){
  const [x,y]=P(fx,fy);px(x-1,y-5*sz,2,5*sz,'#6e4a2c');
  circ(x,y-8*sz,5*sz,'#3f6a2c');circ(x+.5,y-8.5*sz,4.4*sz,'#4c7432');circ(x-1,y-9*sz,3.4*sz,'#6d9a45');circ(x-2,y-10.5*sz,1.4*sz,'#9cc463');
  if(sz>.55){px(x+3*sz,y-6*sz,1,1,'#2f5422');px(x-4*sz,y-7*sz,1,1,'#2f5422');px(x+1,y-12*sz,1,1,'#b6d97a')}
}
function palm(fx,fy,h){
  const [x,y]=P(fx,fy);px(x,y-h,1,h,'#8a6a45');px(x+1,y-h+2,1,h-2,'#6e5236');
  for(let a=0;a<6;a++){const an=a/6*Math.PI*2+.3,mx=x+Math.cos(an)*4,my=y-h-2+Math.sin(an)*1.5,ex=x+Math.cos(an)*8,ey=y-h+3+Math.sin(an)*3;
    line(x,y-h,mx,my,a%2?'#3f8f3a':'#4fa846');line(mx,my,ex,ey,'#357a31');line(x,y-h+1,mx,my+1,'#2e6b2b')}
}
function crane(gx,gy,H){
  const [x,y]=P(gx+.92,gy+.55),top=y-H-14,sw=Math.sin(T*1.3)*2;
  px(x,top,2,H+14,'#f2c230');for(let k=top+3;k<y;k+=5)px(x,k,2,1,'#b88f12');
  px(x-24,top,32,2,'#f2c230');px(x+5,top+2,4,3,'#555');
  px(x-17+sw,top+2,1,9,'#444');px(x-18+sw,top+11,3,2,'#444');
}
function scaffold(gx,gy,ins,H){
  const g=box(gx+ins,gy+ins,gx+1-ins,gy+1-ins,0,Math.max(2,H),'#9a9a9a','#c8c4bc','#aeaaa2');
  for(let v=6;v<H;v+=7){face(g,'L',0,v,1,1,'#7c7c7c');face(g,'R',0,v,1,1,'#6c6c6c')}
  face(g,'L',.2,0,.15,Math.max(2,H),'#e07b39');
}

/* puntos de textura dentro de un terreno, siempre iguales para el mismo terreno */
function speck(gx,gy,seed,n,cols,ins=.08){const r=rng(seed*7919+gx*131+gy*977);for(let k=0;k<n;k++){const [x,y]=P(gx+ins+r()*(1-2*ins),gy+ins+r()*(1-2*ins));px(x,y,r()<.3?2:1,1,cols[Math.floor(r()*cols.length)])}}
const isSt=(x,y)=>inb(x,y)&&S.g[idx(x,y)].k==='calle';
function drawGround(gx,gy,t){
  const k=t.k;
  if(k==='rio'){drawRiver(gx,gy,t);return}if(t.pu){drawBridge(gx,gy,t);return}
  if(k==='malecon'){diamond(gx,gy,0,'#d9d4ca');diamond(gx,gy,.06,'#b98b5a');for(let u=.12;u<.95;u+=.12){const a=P(gx+u,gy+.08),b=P(gx+u,gy+.92);line(a[0],a[1],b[0],b[1],'#a07548')}return}
  if(k==='calle'&&t.hw){
    diamond(gx,gy,0,'#474c57');speck(gx,gy,t.s,6,['#40454f','#4f5460']);
    for(const f of [.2,.6]){const a=P(gx+f,gy+.5);px(a[0]-2,a[1]-1,4,1,'#f2c94c');px(a[0]-2,a[1]+1,4,1,'#f2c94c')}
    for(const f of [.1,.55]){const a=P(gx+f,gy+.25),b=P(gx+f,gy+.75);px(a[0],a[1],3,1,'#e8e8e8');px(b[0],b[1],3,1,'#e8e8e8')}
    for(const f of [.05,.95]){const a=P(gx,gy+f),b=P(gx+1,gy+f);line(a[0],a[1],b[0],b[1],'#8a8f99')}
  }else if(k==='calle'){
    diamond(gx,gy,0,'#d9d4ca');
    // juntas de la banqueta
    for(let u=.1;u<1;u+=.2){for(const [a,b] of [[u,.05],[.05,u],[u,.95],[.95,u]]){const [x,y]=P(gx+a,gy+b);px(x,y,1,1,'#c3bdb1')}}
    diamond(gx,gy,.1,'#9a958c');diamond(gx,gy,.12,'#585d69');
    speck(gx,gy,t.s,7,['#4f5460','#626774','#535864'],.16);
    if(t.s%7===0){const [x,y]=P(gx+.6,gy+.4);px(x-1,y,3,1,'#3a3e47');px(x,y-1,1,1,'#3a3e47');px(x,y+1,1,1,'#3a3e47')}
    if(t.s%5===1){const [x,y]=P(gx+.35,gy+.6);px(x,y,4,2,'#4a4e58')}
    const c=P(gx+.5,gy+.5),nb=[[1,0],[-1,0],[0,1],[0,-1]].filter(([dx,dy])=>isSt(gx+dx,gy+dy));
    const mids={'1,0':P(gx+1,gy+.5),'-1,0':P(gx,gy+.5),'0,1':P(gx+.5,gy+1),'0,-1':P(gx+.5,gy)};
    if(nb.length<=2)for(const [dx,dy] of nb){const m=mids[dx+','+dy];for(const f of [.3,.72])px(c[0]+(m[0]-c[0])*f-1,c[1]+(m[1]-c[1])*f,2,1,'#f4f4f4')}
    else for(const [dx,dy] of nb){ // cruce peatonal en las esquinas
      for(let q=0;q<5;q++){const w=.24+q*.13,[x,y]=dx?P(gx+(dx>0?.86:.14),gy+w):P(gx+w,gy+(dy>0?.86:.14));px(x-1,y,3,1,'#ececec')}}
  }else if(k==='golf'||(k==='part'&&S.g[t.a]&&S.g[t.a].k==='golf')){
    diamond(gx,gy,0,'#d9d4ca');diamond(gx,gy,.03,'#64b247');speck(gx,gy,t.s,10,['#5aa63f','#74c050'],.06);
  }else if(k==='plaza'||k==='barber'||k==='unas'||k==='boliche'||k==='cine'||((k==='paleteria'||k==='gym')&&lvOf(t)>1)||((k==='cafe'||k==='resto'||k==='bar')&&lvOf(t)>1)||(k==='tomates'&&lvOf(t)>1)||k==='domo'||k==='tanque'||k==='torreagua'||k==='kiosco'||k==='mirador'||k==='cultura'||k==='teleferico'||k==='lotedomo'||k==='part'||k==='reserva'){
    diamond(gx,gy,0,'#e6dfd3');diamond(gx,gy,.25,'#ddd4c5');
    for(let u=.2;u<1;u+=.2){const a=P(gx+u,gy+.04),b=P(gx+u,gy+.96),c=P(gx+.04,gy+u),d=P(gx+.96,gy+u);line(a[0],a[1],b[0],b[1],'#d3c9b8');line(c[0],c[1],d[0],d[1],'#d3c9b8')}
  }else if(k==='parque'||k==='dogpark'){
    diamond(gx,gy,0,'#d9d4ca');diamond(gx,gy,.05,k==='parque'?'#74c050':'#86c95a');
    speck(gx,gy,t.s,12,k==='parque'?['#62a843','#8bd463','#5c9e3f']:['#76b84d','#9bd96e']);
    if(k==='dogpark'){diamond(gx,gy,.36,'#c9ae7c');speck(gx,gy,t.s+3,4,['#b89a68'],.38)}
  }else if(k==='cancha'&&lvOf(t)===4){ // estadio: explanada de concreto y la cancha en la parte de enfrente
    diamond(gx,gy,0,'#bdb7ab');diamond(gx,gy,.02,'#cfc8bb');pitchIn(gx,gy,.25,.25,.97,.97,'#4fa64a','#5cb455','#f4f4f4');
  }else if(k==='cancha'){ // por nivel: llanero con tierra → sintético → unidad deportiva → estadio con vallas
    const L=lvOf(t),turf=L===1?'#79ad4f':'#4fa64a',str=L===1?'#86b85a':'#5cb455';
    diamond(gx,gy,0,L>=3?'#cfc8bb':'#d9d4ca');diamond(gx,gy,.04,turf);
    for(let k2=0;k2<6;k2++)if(k2%2)poly([P(gx+.08+k2*.14,gy+.08),P(gx+.22+k2*.14,gy+.08),P(gx+.22+k2*.14,gy+.92),P(gx+.08+k2*.14,gy+.92)],str);
    if(L===1){speck(gx,gy,t.s,14,['#b59a68','#a88d5c','#c2a776'],.14);for(const [a,b] of [[.16,.5],[.84,.5],[.5,.5]]){const [x,y]=P(gx+a,gy+b);ellipse(x,y,4,2,'#b8a070')}}
    const lc=L===1?'#e8e4d8':'#f4f4f4',L4=edges4(gx,gy,.1);for(const e of L4)line(e[0][0],e[0][1],e[1][0],e[1][1],lc);
    {const a=P(gx+.5,gy+.1),b=P(gx+.5,gy+.9);line(a[0],a[1],b[0],b[1],lc)}
    spans(ellRows(...P(gx+.5,gy+.5),3.6,1.8),lc);spans(ellRows(...P(gx+.5,gy+.5),2.8,1.3),turf);
    for(const xa of [.1,.9]){const sg=xa<.5?1:-1;const pts=[P(gx+xa,gy+.3),P(gx+xa+sg*.14,gy+.3),P(gx+xa+sg*.14,gy+.7),P(gx+xa,gy+.7)];for(let q=0;q<3;q++)line(pts[q][0],pts[q][1],pts[q+1][0],pts[q+1][1],lc)}
    if(L===4){const E=edges4(gx,gy,.06);for(const [a,b] of E.slice(2)){for(let q=0;q<6;q++){const f0=q/6,f1=(q+1)/6;poly([[a[0]+(b[0]-a[0])*f0,a[1]+(b[1]-a[1])*f0],[a[0]+(b[0]-a[0])*f1,a[1]+(b[1]-a[1])*f1],[a[0]+(b[0]-a[0])*f1,a[1]+(b[1]-a[1])*f1-1.6],[a[0]+(b[0]-a[0])*f0,a[1]+(b[1]-a[1])*f0-1.6]],['#f26a21','#2f6db5','#f2c94c','#d62828','#ffffff','#2f8f5b'][(q+t.s)%6])}}}
  }else if(k==='escuela'){ // patio según el nivel
    const L=lvOf(t);diamond(gx,gy,0,'#d9d4ca');
    if(L===1){diamond(gx,gy,.04,'#7cc35a');speck(gx,gy,t.s,8,['#6cb34b','#8fd36a']);poly([P(gx+.62,gy+.58),P(gx+.92,gy+.58),P(gx+.92,gy+.92),P(gx+.62,gy+.92)],'#e2c98f');poly([P(gx+.2,gy+.62),P(gx+.5,gy+.62),P(gx+.5,gy+.9),P(gx+.2,gy+.9)],'#4f8fd0');speck(gx,gy,t.s+5,5,['#d1b57a'],.65)}
    else if(L===4){diamond(gx,gy,.03,'#6db556');speck(gx,gy,t.s,10,['#5ea648','#7cc562']);
      for(const [a0,b0,a1,b1] of [[.34,.0,.48,1],[0,.6,1,.68]])poly([P(gx+a0,gy+b0),P(gx+a1,gy+b0),P(gx+a1,gy+b1),P(gx+a0,gy+b1)],'#e6dfd3')}
    else{diamond(gx,gy,.04,'#cfc8bb');
      const court=L===2?[.18,.6,.92,.94,'#4f9a7a']:[.6,.58,.94,.94,'#3f6f9e'];poly([P(gx+court[0],gy+court[1]),P(gx+court[2],gy+court[1]),P(gx+court[2],gy+court[3]),P(gx+court[0],gy+court[3])],court[4]);
      {const c=court,L4=[[c[0]+.04,c[1]+.04],[c[2]-.04,c[1]+.04],[c[2]-.04,c[3]-.04],[c[0]+.04,c[3]-.04]].map(([a,b])=>P(gx+a,gy+b));for(let q=0;q<4;q++){const a=L4[q],b=L4[(q+1)%4];line(a[0],a[1],b[0],b[1],'#f4f4f4')}
       const m1=P(gx+(c[0]+c[2])/2,gy+c[1]+.04),m2=P(gx+(c[0]+c[2])/2,gy+c[3]-.04);line(m1[0],m1[1],m2[0],m2[1],'#f4f4f4')}
      if(L===2)for(const [a,b] of [[.08,.7],[.08,.78],[.08,.86]]){const [x,y]=P(gx+a,gy+b);px(x-1,y,3,1,'#f2c94c')}
      else{poly([P(gx+.04,gy+.62),P(gx+.5,gy+.62),P(gx+.5,gy+.96),P(gx+.04,gy+.96)],'#7cc35a');speck(gx,gy,t.s+2,4,['#6cb34b'],.7)}}
  }else if(k==='clinica'){ // explanada; del nivel 2 en adelante, cajones para la ambulancia
    const L=lvOf(t);diamond(gx,gy,0,'#e6dfd3');diamond(gx,gy,.25,'#ddd4c5');
    if(L===1){poly([P(gx+.64,gy+.1),P(gx+.96,gy+.1),P(gx+.96,gy+.42),P(gx+.64,gy+.42)],'#585d69');const a=P(gx+.64,gy+.38),b=P(gx+.96,gy+.38);line(a[0],a[1],b[0],b[1],'#f4f4f4')}
    else{for(const f of [.66,.8]){const a=P(gx+f,gy+.66),b=P(gx+f,gy+.94);line(a[0],a[1],b[0],b[1],'#f4f4f4')}
      const [x,y]=P(gx+.82,gy+.84);px(x-2,y-1,4,1,'#d62828');px(x-.5,y-2.5,1,4,'#d62828')}
  }else if(k==='padel'){
    diamond(gx,gy,0,'#d9d4ca');diamond(gx,gy,.06,'#2f6db5');diamond(gx,gy,.14,'#3a7fcc');
    const a=P(gx+.5,gy+.08),b=P(gx+.5,gy+.92);line(a[0],a[1],b[0],b[1],'#ffffff');
    const c=P(gx+.14,gy+.5),d=P(gx+.86,gy+.5);line(c[0],c[1],d[0],d[1],'#cfe1f5');
  }else if(k==='fabrica'){
  }else if(k==='ajeno'){
    diamond(gx,gy,0,(gx+gy)%2?'#b3a47f':'#ad9e79');speck(gx,gy,t.s,9,['#9c8d68','#8e9a5c','#c2b38c','#7f8c52']);
  }else if(k==='estac'&&lvOf(t)===1){
    diamond(gx,gy,0,'#c9b48a');speck(gx,gy,t.s,10,['#b39d72','#d8c79c','#a68f66']);
  }else if(k==='estac'){
    diamond(gx,gy,0,'#d9d4ca');diamond(gx,gy,.06,'#4f535e');speck(gx,gy,t.s,5,['#474b55','#5a5e69'],.1);
    for(const f of [.25,.5,.75]){const a=P(gx+f,gy+.1),b=P(gx+f,gy+.4);line(a[0],a[1],b[0],b[1],'#e8e8e8')}
  }else{
    diamond(gx,gy,0,(gx+gy)%2?'#dac897':'#d3c08d');
    speck(gx,gy,t.s,9,['#c9b582','#e3d3a6','#c2ad79']);
    if(t.s%5===0){const [x,y]=P(gx+.3+(t.s%7)/12,gy+.55);px(x,y,2,1,'#93b558');px(x+1,y-1,1,1,'#93b558');px(x-1,y-1,1,1,'#7fa04a')}
    if(t.s%11===0){const [x,y]=P(gx+.7,gy+.3);px(x,y,2,1,'#a8977a');px(x+1,y-1,1,1,'#bcae95')}
  }
}

