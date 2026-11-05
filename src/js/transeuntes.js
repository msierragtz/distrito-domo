/* transeúntes: figuras con volumen, caminado de 4 cuadros y algo de cada grupo (mochila, saco, niño o carriola, perro con correa, paraguas).
   Cada uno se dibuja una vez por cuadro de animación y se guarda en caché con contorno delgado. */
const HAIR=['#2b1d14','#3a2a1e','#5a3a22','#1c1c1c','#8a6a3a','#c9a35a','#9a9a9a'],PANTS=['#3b5a8a','#2b2b2b','#b8a27a','#4a4f5a','#6a3a3a','#2f4f6a'];
const whash=(w,k)=>{const v=Math.sin(w.ph*91.3+k*17.7)*43758.5;return v-Math.floor(v)};
function wdir(w){const [a,b]=P(w.x,w.y),[c,d]=P(w.tx+.5,w.ty+.5);return {dx:(c-a)<-.01?-1:1,front:d>=b-.01}}
function person(x,y,o){const {shirt,pants,skin,hair,dx,front,scale=1,acc,fr=0}=o,s=scale,st=[0,1,0,-1][fr];
  const legH=2.6*s,torH=3.2*s,headH=2.4*s,top=y-legH-torH-headH;
  px(x-1*s,y-legH,1*s,legH-(st>0?.5:0),pants);px(x+.5*s,y-legH,1*s,legH-(st<0?.5:0),hexShade(pants,-.15));
  px(x-1*s+(st>0?-.5:0),y-.5,1.2*s,.5,'#1c1c1c');px(x+.5*s+(st<0?.5:0),y-.5,1.2*s,.5,'#1c1c1c');
  const ty=y-legH-torH;px(x-1.2*s,ty,2.9*s,torH,shirt);px(x+.9*s,ty,.8*s,torH,hexShade(shirt,-.22));
  if(acc&&acc.vest){px(x-1.2*s,ty,2.9*s,torH,acc.vest);px(x-.1*s,ty,.6*s,torH*.8,'#f4f4f4')}
  px(x-1.6*s,ty+.6+(st>0?.4:0),.6*s,torH-1,hexShade(shirt,-.1));px(x+1.7*s,ty+.6+(st<0?.4:0),.6*s,torH-1,hexShade(shirt,-.3));
  px(x-.9*s,top+.3,2.3*s,headH,skin);
  if(front){px(x-.9*s,top,2.3*s,.9*s,hair);px(x-.9*s,top+.9*s,.5*s,.7*s,hair);px(x+(dx>0?.6:-.3)*s,top+1.3*s,.4*s,.4*s,'#1c1c1c')}else px(x-.9*s,top,2.3*s,1.8*s,hair);
  return {ty,hy:top}}
function drawPerson(w,x,y,dx,front,fr,rain){
  const hair=HAIR[Math.floor(whash(w,1)*HAIR.length)],pants=PANTS[Math.floor(whash(w,2)*PANTS.length)];
  let shirt=w.noisy?'#1d1d1d':w.c,acc=null;
  if(w.kind==='pro'){shirt=['#2b3a55','#3a3a3a','#5a4a3a'][Math.floor(whash(w,5)*3)];acc={vest:shirt}}
  const r=person(x,y,{shirt,pants,skin:w.skin,hair,dx,front,acc,fr});
  if(w.kind==='est'){if(!front)px(x-1.4,r.ty+.4,2.6,2.4,['#d62828','#2a9d8f','#f2c94c','#9b5de5'][Math.floor(whash(w,6)*4)]);else px(x-1.2,r.ty+.3,.5,2.2,'#7a4e2c')}
  if(w.kind==='pro'){if(whash(w,7)<.5)px(x+(dx>0?2:-2.8),y-4.3,1.6,1.3,'#5a3a22');else{px(x+(dx>0?2:-2),r.ty+1.2,.9,1.2,'#f4efe2');px(x+(dx>0?2:-2),r.ty+1.2,.9,.3,'#7a4e2c')}
    if(NIGHT>.4&&whash(w,8)<.4)px(x+(dx>0?1.6:-1.6),r.hy+2,.6,.8,'#bfe9ff',true)}
  if(w.kind==='fam'&&!w.dog){if(whash(w,10)<.6){const kx=x+(dx>0?-3.2:3.2);person(kx,y,{shirt:['#ff8fb1','#59cd90','#ffd84d','#3fa7d6'][Math.floor(whash(w,9)*4)],pants:'#3b5a8a',skin:w.skin,hair:HAIR[Math.floor(whash(w,3)*4)],dx,front,scale:.62,fr:(fr+2)%4});line(x+(dx>0?-1.6:1.6),r.ty+2.5,kx+(dx>0?.8:-.8),y-3.6,'#1c1c24')}
    else{const cx=x+(dx>0?3.4:-3.4);px(cx-1.6,y-3.4,3.2,2.2,'#2a6a8a');px(cx-1.6,y-4.4,1.8,1,'#1f4f6a');circ(cx-1.2,y-.4,.6,'#1c1c1c');circ(cx+1.2,y-.4,.6,'#1c1c1c');line(x+(dx>0?1.8:-1.8),r.ty+1.5,cx+(dx>0?-1.4:1.4),y-3.6,'#555')}}
  if(w.noisy&&NIGHT>.3)px(x+(dx>0?2.1:-2.6),r.ty+.6,.8,1.4,'#f2c94c',true);
  if(rain){px(x+.2,r.hy-4.2,.4,4.2,'#3a3a3a');parasol(x+.4,r.hy-4,4.2,[['#d62828','#2a9d8f','#f2c94c','#3a6ea5'][Math.floor(whash(w,11)*4)],'#1c1c24'],.9)}
  if(w.dog){const ddx=x+(dx>0?-5:5),b2=fr%2,c=w.dog;px(ddx-1.5,y-3,3.2,1.8,c);px(ddx+(dx>0?1.2:-2.2),y-4,1.4,1.5,c);px(ddx+(dx>0?2.3:-2.4),y-3.6,.6,.6,'#1c1c1c');
    px(ddx-1.3,y-1.2,.6,1.2+b2*.3,hexShade(c,-.3));px(ddx+.9,y-1.2,.6,1.5-b2*.3,hexShade(c,-.3));px(ddx+(dx>0?-2:1.6),y-3.8,.5,1,c);line(ddx+(dx>0?1.6:-1.6),y-3.4,x+(dx>0?-1.6:1.6),y-4.5,'#c0392b')}}
const WSPR=new Map();let WID=0,WBUD=0;
function drawWalker(w){
  const [X0,Y]=P(w.x,w.y),X=X0+w.lane*.8,{dx,front}=wdir(w),fr=lowMo()?0:Math.floor(T*7+w.ph)%4,rain=S.ev&&S.ev.id==='lluvia',nb=NIGHT>.5?1:0;
  if(w.wid==null)w.wid=++WID;
  if(!w.kind){const r=whash(w,4)*Math.max(1,S.v),p=S.pop;w.kind=w.noisy?'est':r<p.fam?'fam':r<p.fam+p.pro?'pro':'est'}
  ellipse(X+.5,Y+.2,2.6,.9,'rgba(0,0,0,.22)',true);if(w.dog)ellipse(X+(dx>0?-5:5),Y+.2,2.2,.7,'rgba(0,0,0,.2)',true);
  const key=w.wid+'|'+fr+'|'+dx+'|'+front+'|'+nb+'|'+(rain?1:0)+'|'+RES;let sp=WSPR.get(key);
  if(!sp&&WBUD<=0&&w.lastSp)sp=w.lastSp;
  if(!sp){WBUD--;if(WSPR.size>1200)WSPR.clear();const CW=30,CH=30,c=mkCanvas(CW,CH),pc=ctx,pn=NIGHT,pnc=NCOL,pg=GLOWS;ctx=hdctx(c);NIGHT=nb;NCOL=ncol(nb);GLOWS=[];
    try{drawPerson(w,15,CH-3,dx,front,fr,rain);outline(ctx,1)}catch(e){}finally{GLOWS=pg;ctx=pc;NIGHT=pn;NCOL=pnc}sp={c,ax:15,ay:CH-3};WSPR.set(key,sp)}w.lastSp=sp;
  ctx.drawImage(sp.c,Math.round((X-sp.ax)*RES)/RES,Math.round((Y-sp.ay)*RES)/RES,sp.c.width/RES,sp.c.height/RES);
  if(w.noisy&&NIGHT>.3&&Math.floor(T*2+w.ph)%3===0)glow(X,Y-8,6,.6)}

