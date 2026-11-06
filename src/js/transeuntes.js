/* ---------- transeúntes: cómo se ven (v68) ----------
   Figuras con volumen y caminado de 6 cuadros (piernas que dan el paso, brazos que se mueven al revés, el cuerpo sube y baja),
   carrera con el cuerpo inclinado, y poses: parado, sentado, platicando, señalando, en bici, en patineta, en silla de ruedas.
   Cada quien lleva lo suyo: mochila, saco y portafolio o café, niño o carriola, perro con correa, paraguas, sombrero, garrafón,
   playera del Clásico, cartulina de protesta, bolsa del mandado, bastón, uniforme, casco de obra.
   Cada figura se dibuja una vez por cuadro de animación y se guarda en caché con contorno delgado.
   Dónde caminan y qué hacen está en vida.js. */
const HAIR=['#2b1d14','#3a2a1e','#5a3a22','#1c1c1c','#8a6a3a','#c9a35a','#9a9a9a'],PANTS=['#3b5a8a','#2b2b2b','#b8a27a','#4a4f5a','#6a3a3a','#2f4f6a'];
const SHIRTS=['#e63946','#457b9d','#f26a21','#2a9d8f','#9b5de5','#ffbe0b','#f4f4f4','#2b2b2b','#ff8fb1','#59cd90'],SKIN=['#f1c27d','#c68642','#8d5524','#e0ac69','#f6d3b3'];
const whash=(w,k)=>{const v=Math.sin(w.ph*91.3+k*17.7)*43758.5;return v-Math.floor(v)};
// el cuerpo. pose: walk, run, stand, sit, ride (bici), point (señala), talk (platica). fr: cuadro de 0 a 5
function body(x,y,o){
  const s=o.s||1,dx=o.dx,pose=o.pose,ph=(o.fr||0)/6*6.2832,sh=v=>hexShade(v,-.18);
  const legH=2.6*s,torH=3.2*s,headH=2.4*s;
  let a=0,l0=0,l1=0,bob=0,lean=0,sw=0;
  if(pose==='walk'){a=Math.sin(ph);bob=Math.abs(a)*.5;l0=Math.max(0,Math.cos(ph))*.6;l1=Math.max(0,-Math.cos(ph))*.6;sw=-a}
  else if(pose==='run'){a=Math.sin(ph)*1.5;bob=Math.abs(Math.sin(ph))*.8;l0=Math.max(0,Math.cos(ph))*1.2;l1=Math.max(0,-Math.cos(ph))*1.2;lean=dx*.5;sw=-Math.sin(ph)*1.6}
  else if(pose==='push'){a=.9;l1=.4}
  let ty;
  if(pose==='sit'||pose==='ride'){
    const hy=pose==='ride'?y-4.4*s:y-1.7*s;ty=hy-torH;
    if(pose==='sit'){px(x-1*s,hy-.9*s,2.7*s,1*s,o.pants);px(x+dx*1.3*s-.3,hy,1*s,y-hy-.5,sh(o.pants));px(x+dx*1.3*s-.5,y-.5,1.4*s,.5,o.shoe||'#1c1c1c')}
    else{const up=(o.fr||0)%2;for(const [k,lx] of [[0,-.6],[1,.5]]){const hi=k===up?1.4:0,L=(3.3-hi)*s;px(x+lx*s+dx*.5,hy,1*s,L,k?sh(o.pants):o.pants);px(x+lx*s+dx*.5-.1,hy+L-.4,1.3*s,.5,'#1c1c1c')}}
  }else{
    const by=y-legH+bob,L0=x-1*s+dx*a*.55*s,L1=x+.5*s-dx*a*.55*s;
    const leg=(lx,lift,c)=>{const h=legH-bob-lift;if(o.shorts){px(lx,by,1*s,h*.45,c);px(lx,by+h*.45,1*s,h*.55,o.skin)}else px(lx,by,1*s,h,c);px(lx-(dx<0?.3:0),y-.5-lift,1.3*s,.5,o.shoe||'#1c1c1c')};
    leg(L1,l1,sh(o.pants));leg(L0,l0,o.pants);
    if(o.skirt){px(x-1.5*s,by-.2,3.4*s,1.5*s,o.skirt);px(x-1.5*s,by+.6*s,3.4*s,.4,hexShade(o.skirt,-.25))}
    ty=by-torH;
  }
  const tx=x+lean;
  px(tx-1.2*s,ty,2.9*s,torH,o.shirt);px(tx+.9*s,ty,.8*s,torH,hexShade(o.shirt,-.22));
  if(o.stripes){px(tx-.7*s,ty,.6*s,torH,o.stripes);px(tx+.5*s,ty,.6*s,torH,o.stripes)}
  if(o.vest){px(tx-1.2*s,ty,2.9*s,torH,o.vest);px(tx-.1*s,ty,.6*s,torH*.8,'#f4f4f4')}
  if(o.hiviz){px(tx-1.2*s,ty+.3,2.9*s,torH-.3,'#ff7a1a');px(tx-1.2*s,ty+torH*.55,2.9*s,.5,'#f6f2b8')}
  if(o.apron)px(tx-.9*s,ty+1.2*s,2.3*s,torH-1,'#f4f4f4');
  if(o.rebozo){px(tx-1.5*s,ty-.1,3.4*s,1.3*s,o.rebozo);px(tx+(dx>0?-1.5:1.1)*s,ty+1.2*s,.9*s,1.8*s,o.rebozo)}
  // brazos: se mueven al revés de las piernas
  const armL=torH-1,ac=hexShade(o.shirt,-.1),ac2=hexShade(o.shirt,-.3),xl=tx-1.6*s,xr=tx+1.7*s,fr2=(o.fr||0)%2;
  if(pose==='point'){const up=dx>0?xr:xl;px(up,ty-2.2*s+fr2*.4,.6*s,2.6*s,dx>0?ac2:ac);px(up,ty-2.7*s+fr2*.4,.7*s,.7*s,o.skin);px(dx>0?xl:xr,ty+.6,.6*s,armL,dx>0?ac:ac2)}
  else if(pose==='ride'){px(tx+(dx>0?.8:-2.6)*s,ty+.8,1.8*s,.6*s,ac);px(tx+dx*2.6*s-.2,ty+.8,.6*s,.6*s,o.skin)}
  else if(pose==='talk'&&fr2){px(dx>0?xl:xr,ty+.6,.6*s,armL,dx>0?ac:ac2);px(tx+(dx>0?1.6:-2.6)*s,ty+1.1,1*s,.6*s,dx>0?ac2:ac);px(tx+dx*2.4*s-.2,ty+.9,.6*s,.6*s,o.skin)}
  else{const run=pose==='run',lh=run?armL-1.1:armL,vy=sw*(run?.45:.25)*s,hx2=sw*(run?.2:.3)*s;px(xl+dx*hx2,ty+.6+Math.max(0,vy),.6*s,lh,ac);px(xr-dx*hx2,ty+.6+Math.max(0,-vy),.6*s,lh,ac2)}
  // cabeza
  const hy=ty-headH+(pose==='run'?.3:0);
  px(tx-.9*s,hy+.3,2.3*s,headH,o.skin);
  if(o.front){px(tx-.9*s,hy,2.3*s,.9*s,o.hair);px(tx-.9*s,hy+.9*s,.5*s,.7*s,o.hair);px(tx+(dx>0?.6:-.3)*s,hy+1.3*s,.4*s,.4*s,'#1c1c1c')}
  else px(tx-.9*s,hy,2.3*s,1.8*s,o.hair);
  if(o.long){if(o.front)px(tx+(dx>0?-1.2:1)*s,hy+.5,.6*s,2.4*s,o.hair);else px(tx-.9*s,hy+1.6*s,2.3*s,1.4*s,o.hair)}
  return {ty,hy,tx,torH}}
// para los dibujos de edificios que traen gente quieta (estadio, museo, temporadas): la firma de antes
function person(x,y,o){const f=o.fr||0,r=body(x,y,{s:o.scale||1,dx:o.dx==null?-1:o.dx,front:o.front,pose:f?'walk':'stand',fr:f===1?1:f===3?4:0,shirt:o.shirt,pants:o.pants,skin:o.skin,hair:o.hair,vest:o.acc&&o.acc.vest});return {ty:r.ty,hy:r.hy}}
function drawDog(x,y,c,dx,fr,mode){const sh=hexShade(c,-.3),f=fr%2;
  if(mode==='sniff'){px(x-1.5,y-2.8,3.2,1.6,c);px(x+(dx>0?1.3:-2.5),y-1.9,1.5,1.3,c);px(x+(dx>0?2.6:-2.7),y-1.3,.5,.5,'#1c1c1c');px(x+(dx>0?-2.1:1.7),y-4-(f?.4:0),.5,1.2,c);
    for(const lx of [-1.3,-.5,.4,.9])px(x+lx,y-1.3,.6,1.3,sh);return}
  px(x-1.5,y-3,3.2,1.8,c);px(x+(dx>0?1.2:-2.2),y-4,1.4,1.5,c);px(x+(dx>0?2.3:-2.4),y-3.6,.6,.6,'#1c1c1c');px(x+(dx>0?1.4:-1.7),y-4.5,.5,.6,sh);
  px(x-1.3,y-1.2,.6,1.2+f*.3,sh);px(x-.5,y-1.2,.6,1.5-f*.3,sh);px(x+.3,y-1.2,.6,1.2+f*.3,sh);px(x+.9,y-1.2,.6,1.5-f*.3,sh);px(x+(dx>0?-2:1.6),y-3.8-(f?.3:0),.5,1,c)}
function drawBike(x,y,dx,c){for(const k of [-1,1]){const wx=x+dx*k*2.6;circ(wx,y-1.6,1.6,'#1c1c1c');circ(wx,y-1.6,1,'#8a919c');px(wx-.3,y-1.9,.6,.6,'#3a3a3a')}
  line(x-dx*2.6,y-1.6,x-dx*.3,y-3.9,c);line(x-dx*.3,y-3.9,x+dx*2.6,y-1.6,c);line(x-dx*.3,y-3.9,x+dx*1.8,y-4.3,c);line(x+dx*2.6,y-1.6,x+dx*1.8,y-4.5,c);
  px(x+dx*1.8-.5,y-5.1,1.3,.6,'#1c1c1c');px(x-dx*.5-.7,y-4.5,1.6,.5,'#1c1c1c')}
function drawChair(x,y,dx,ty,fr){circ(x-dx*.4,y-1.9,1.9,'#2b2b2b');circ(x-dx*.4,y-1.9,1.25,'#9aa1ab');
  if(fr%2)px(x-dx*.4-.25,y-3,.5,2.2,'#2b2b2b');else px(x-dx*.4-1.1,y-2.15,2.2,.5,'#2b2b2b');circ(x+dx*1.9,y-.6,.6,'#2b2b2b');
  px(x-dx*1.7-.25,ty-.4,.5,2.6,'#2b2b2b');line(x-dx*.4,y-1.9,x+dx*1.6,y-1,'#2b2b2b')}
function signIcon(x,y,need){
  if(need==='verde'){circ(x,y-.6,1.1,'#2f9e44');px(x-.25,y+.3,.5,.9,'#7a4e2c')}
  else if(need==='com'){px(x-1,y-.9,2,1.8,'#f26a21');px(x-.6,y-1.4,1.2,.4,'#7a4e2c')}
  else if(need==='park'){px(x-1.1,y-1.3,2.2,2.4,'#2f6fd0');px(x-.5,y-.9,.4,1.6,'#fff');px(x-.5,y-.9,1,.4,'#fff');px(x+.3,y-.9,.3,.9,'#fff');px(x-.5,y-.3,1,.4,'#fff')}
  else if(need==='dog'){for(const [a,b] of [[-.9,-.9],[-.1,-1.3],[.7,-.9]])px(x+a,y+b,.6,.6,'#5a3a22');px(x-.6,y-.3,1.4,1.1,'#5a3a22')}
  else{px(x-1,y-1,.5,.5,'#1c1c24');px(x-.2,y-.4,.5,.5,'#1c1c24');px(x+.6,y-1.1,.5,.5,'#1c1c24')}}
const JERSEY=[{shirt:'#f4f4f4',stripes:'#2456a6'},{shirt:'#f2c230',pants:'#1d3c78'}];
// una persona completa con lo que lleva; (x,y) es donde pisa
function drawLook(w,x,y,pose,fr,dx,front,rain){
  const L=w.L,se=SEASON_C,h12=whash(w,12),s=L.s||1,R=whash(w,14);
  const npc=L.g==='worker'||L.g==='vendor'||L.g==='play',cat=!npc&&se==='muertos'&&h12<.3,verde=!npc&&se==='patrias'&&h12<.32&&L.g!=='pro',santa=!npc&&se==='navidad'&&h12<.22;
  let shirt=L.shirt,pants=L.pants,stripes=null;
  if(L.jersey!=null){const J=JERSEY[L.jersey];shirt=J.shirt;stripes=J.stripes||null;if(J.pants)pants=J.pants}
  if(verde)shirt=h12<.2?'#1f8a4c':'#f4f4f4';if(cat&&L.g!=='pro')shirt=['#1c1c24','#7a2a5a','#3a1f4a'][Math.floor(whash(w,13)*3)];
  const o={s,dx,front,pose,fr,shirt,pants,skin:cat?'#f1ece4':L.skin,hair:L.hair,long:L.long,shorts:L.jog||L.g==='play',stripes,vest:L.vest&&L.jersey==null?shirt:null,hiviz:L.hardhat,rebozo:L.rebozo,skirt:L.skirt,apron:L.apron,shoe:L.jog||L.g==='play'?'#f4f4f4':null};
  if(L.bike)drawBike(x,y,dx,L.bike);
  const yy=L.skate?y-.9:y;
  if(L.skate){px(x-2.6,y-1,5.2,.6,'#7a4e2c');px(x-2,y-.5,.8,.5,'#f2c94c');px(x+1.2,y-.5,.8,.5,'#f2c94c')}
  // la carriola y el niño van del lado de atrás
  const back=dx>0?-1:1;
  if(L.stroller&&pose!=='sit'){const cx=x+dx*3.6;px(cx-1.6,y-3.4,3.2,2.2,'#2a6a8a');px(cx-1.6,y-4.4,1.8,1,'#1f4f6a');circ(cx-1.2,y-.4,.6,'#1c1c1c');circ(cx+1.2,y-.4,.6,'#1c1c1c')}
  if(L.kid&&pose!=='sit'){const kx=x+back*3.2;const kp=pose==='walk'||pose==='run'?pose:pose==='point'?'point':'stand';
    const k=body(kx,y,{s:.62,dx,front,pose:kp,fr:(fr+3)%6,shirt:L.uni?'#f4f4f4':L.kid,pants:L.uni?'#1d2a55':'#3b5a8a',skin:L.skin,hair:HAIR[Math.floor(whash(w,3)*4)]});
    if(L.uni&&!front)px(kx-.9,k.ty+.3,1.6,1.6,'#c0392b')}
  const r=body(x,yy,o);
  if(L.wheel)drawChair(x,y,dx,r.ty,fr);
  const hx=r.tx,hy=r.hy,hand=x+(dx>0?2:-2.6)*s,handY=r.ty+r.torH-.6;
  // cabeza: casco, sombrero, gorra, cinta; temporadas
  if(L.hardhat){px(hx-1.1*s,hy-.5,2.7*s,1.5*s,'#f2c230');px(hx-1.4*s,hy+.8,3.3*s,.5,'#d9a81a')}
  else if(L.hat||(verde&&h12<.06)){px(hx-2.4*s,hy+.3,5.8*s,.7,'#d9b36a');px(hx-1*s,hy-1.2,2.6*s,1.7,'#d9b36a');px(hx-1*s,hy,2.6*s,.4,'#c0392b')}
  else if(L.cap){px(hx-.9*s,hy-.2,2.3*s,1*s,L.cap);px(hx+(dx>0?1.1:-1.9)*s,hy+.6,1.1*s,.5,hexShade(L.cap,-.25))}
  else if(santa){px(hx-1.1,hy-1,2.7,1.2,'#d62828');px(hx+(dx>0?.9:-1.1),hy-1.8,1.1,1,'#d62828');px(hx+(dx>0?1.6:-1.7),hy-2.2,1,1,'#ffffff');px(hx-1.1,hy,2.7,.5,'#ffffff')}
  if(L.jog)px(hx-.9*s,hy+.6,2.3*s,.5,'#e63946');
  if(cat){if(front){px(hx-.5,hy+1.1,.6,.6,'#1c1c24');px(hx+.6,hy+1.1,.6,.6,'#1c1c24');px(hx,hy+2,.5,.4,'#1c1c24')}for(let q=0;q<3;q++)px(hx-1+q,hy-.4-(q===1?.3:0),.9,.9,['#ff5d8f','#ff9f1c','#d62828'][q])}
  // espalda y manos
  if(L.back){if(!front)px(hx-1.4*s,r.ty+.4,2.6*s,2.4*s,L.back);else px(hx-1.2*s,r.ty+.3,.5*s,2.2*s,'#7a4e2c')}
  if(L.brief&&pose!=='sit'&&pose!=='ride')px(x+(dx>0?2:-2.8),y-4.3,1.6,1.3,'#5a3a22');
  if(L.coffee&&pose!=='ride'){px(hand,handY-.6,.9,1.2,'#f4efe2');px(hand,handY-.6,.9,.3,'#7a4e2c')}
  if(L.phone&&NIGHT>.4&&!L.coffee)px(x+(dx>0?1.6:-1.6),hy+2,.6,.8,'#bfe9ff',true);
  if(L.bag&&pose!=='sit'){const bx=x+(dx>0?1.9:-3.2);px(bx,y-3.7,1.6,2,'#efeae0');px(bx,y-3.2,1.6,.4,'#d62828');px(bx,y-2.4,1.6,.4,'#2456a6')}
  if(L.cane)line(hand+.3,handY,hand+dx*.8+.3,y-.2,'#5a3a22');
  if(L.garrafon){const gx=x+(dx>0?1.8:-3.8);px(gx,y-4.8,2,2.8,'#8fd0f5');px(gx+1.4,y-4.8,.6,2.8,'#5fa6d6');px(gx+.5,y-5.4,1,.6,'#2a6ab8')}
  if(w.snack==='paleta'){px(hand+.3,handY-.2,.3,1.2,'#d9b36a');px(hand-.1,handY-1.8,1.1,1.7,['#ff5d8f','#ffd84d','#9b5de5'][Math.floor(R*3)])}
  else if(w.snack==='elote'){px(hand,handY-1.6,.9,2.2,'#f2c230');px(hand+.6,handY-1.2,.4,1.6,'#6aa84f')}
  else if(w.snack==='raspado'){px(hand-.1,handY-.9,1.2,1.4,'#f4f4f4');px(hand-.1,handY-1.6,1.2,.8,['#d62828','#59cd90','#ffbe0b'][Math.floor(R*3)])}
  if(L.sign){const sx=x+(dx>0?1.9:-2.4)*s;px(sx,hy-2.6,.5,r.ty-hy+3.6,'#8a6a3a');const bx=sx-2.4;px(bx-.3,hy-6.4,5.6,4,'#5a4630');px(bx,hy-6.1,5,3.4,'#f8f4e8');signIcon(bx+2.5,hy-4.1,L.sign)}
  if(L.dog&&w.st!=='stay'){const ddx=x+back*5,dm=w.st==='sniff'?'sniff':'walk';drawDog(ddx,y,L.dog,dx,fr,dm);line(ddx+(dx>0?1.6:-1.6),y-3.4,x+(dx>0?-1.6:1.6),handY-.5,'#c0392b')}
  if(w.noisy&&NIGHT>.3)px(x+(dx>0?2.1:-2.6),r.ty+.6,.8,1.4,'#f2c94c',true);
  if(rain&&L.umb&&!L.bike&&!L.hardhat){px(hx+.2,hy-4.2,.4,4.2,'#3a3a3a');parasol(hx+.4,hy-4,4.2,[['#d62828','#2a9d8f','#f2c94c','#3a6ea5'][Math.floor(whash(w,11)*4)],'#1c1c24'],.9)}
}
// carrito de elotes o de raspados, con su vendedor detrás
function drawCartSpr(w,x,y,dx){const el=w.typ==='elote',c=el?'#f2c230':'#f4f4f4',tr=el?'#4f8a3a':'#2f7fb8';
  body(x-dx*3.2,y-.2,{s:1,dx,front:true,pose:'stand',fr:0,shirt:w.L.shirt,pants:w.L.pants,skin:w.L.skin,hair:w.L.hair,apron:1});
  px(x-dx*3.2-1,y-9.4,2.4,.9,'#f4f4f4');
  px(x-3,y-4.6,6,2.9,c);px(x-3,y-4.9,6,.5,hexShade(c,.25));px(x-3,y-2.2,6,.5,tr);px(x+1.6,y-4.6,1.4,2.9,hexShade(c,-.15));
  if(el){px(x-2.2,y-5.9,1.6,1.1,'#9aa1ab');px(x-2.4,y-6.1,2,.4,'#c9ced6')}else for(let q=0;q<3;q++)px(x-2.2+q*1.1,y-6.2,.7,1.4,['#d62828','#59cd90','#ffbe0b'][q]);
  circ(x-2,y-1,1,'#2b2b2b');circ(x+2,y-1,1,'#2b2b2b');px(x-.2,y-12,.4,7.4,'#555');parasol(x,y-12,5.2,[el?'#4f8a3a':'#d62828','#f4f4f4'],1.2)}
const WSPR=new Map();let WBUD=0,OLA=null,OLB=null;
// contorno rápido para la gente: la silueta en oscuro, corrida un pixel a cada lado y puesta detrás (sin leer pixeles del lienzo)
function fastOutline(c){const cv=c.canvas,w=cv.width,h=cv.height;
  if(!OLA||OLA.width<w||OLA.height<h){OLA=document.createElement('canvas');OLA.width=w;OLA.height=h;OLB=document.createElement('canvas');OLB.width=w;OLB.height=h}
  const a=OLA.getContext('2d'),b=OLB.getContext('2d');a.setTransform(1,0,0,1,0,0);b.setTransform(1,0,0,1,0,0);a.globalCompositeOperation='source-over';a.clearRect(0,0,OLA.width,OLA.height);b.clearRect(0,0,OLB.width,OLB.height);
  a.drawImage(cv,0,0);a.globalCompositeOperation='source-in';a.fillStyle=`rgb(${OL[0]},${OL[1]},${OL[2]})`;a.fillRect(0,0,w,h);a.globalCompositeOperation='source-over';
  for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])b.drawImage(OLA,0,0,w,h,dx,dy,w,h);
  c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='destination-over';c.globalAlpha=215/255;c.drawImage(OLB,0,0,w,h,0,0,w,h);c.restore()}
function blitFlip(sp,X,Y,flip){const x=Math.round((X-sp.ax)*RES)/RES,y=Math.round((Y-sp.ay)*RES)/RES,w=sp.c.width/RES,h=sp.c.height/RES;
  if(!flip){ctx.drawImage(sp.c,x,y,w,h);return}ctx.save();ctx.translate(Math.round(X*RES)/RES*2,0);ctx.scale(-1,1);ctx.drawImage(sp.c,x,y,w,h);ctx.restore()}
function wsprDrop(w){if(w.ks){for(const k of w.ks)WSPR.delete(k);w.ks.length=0}}
function bubble(x,y,ic){const t=T*3;px(x-3.6,y-5.2,7.2,4.6,'#ffffff',true);px(x-3.2,y-5.6,6.4,.4,'#ffffff',true);px(x-3.2,y-.6,6.4,.4,'#ffffff',true);px(x-1.6,y-.2,1.2,1,'#ffffff',true);
  if(ic==='heart'){px(x-1.4,y-4.2,1.1,1,'#e63946',true);px(x+.3,y-4.2,1.1,1,'#e63946',true);px(x-1.4,y-3.3,2.8,1,'#e63946',true);px(x-.8,y-2.4,1.6,.8,'#e63946',true)}
  else if(ic==='note'){px(x+.4,y-4.6,.5,3,'#1f2540',true);px(x+.4,y-4.6,1.4,.5,'#1f2540',true);px(x-.6,y-2.2,1.3,1,'#1f2540',true)}
  else if(ic==='ball'){circ(x,y-3,1.4,'#1f2540',true);circ(x,y-3,1,'#ffffff',true);px(x-.3,y-3.3,.6,.6,'#1f2540',true)}
  else for(let q=0;q<3;q++)px(x-2.2+q*1.6,y-3.4,1,1,Math.floor(t)%3===q?'#1f2540':'#9aa3b8',true)}
function drawWalker(w){
  if(w.ent==='ball'){const [bx,by]=P(w.X,w.Y);ctx.globalAlpha=w.a;ellipse(bx,by+.2,1.2,.45,'rgba(0,0,0,.25)',true);circ(bx,by-1-(w.h||0),.9,'#ffffff');px(bx-.3,by-1.3-(w.h||0),.5,.5,'#1c1c1c');ctx.globalAlpha=1;return}
  if(w.ent==='goal'){const [gx,gy]=P(w.X,w.Y);ctx.globalAlpha=w.a;for(const [ox,c] of [[-3,'#d62828'],[2,'#2456a6']]){px(gx+ox-.8,gy-1.6,1.8,1.6,c);px(gx+ox-.8,gy-1.9,1.8,.4,hexShade(c,.3))}ctx.globalAlpha=1;return}
  const [X0,Y0]=P(w.X,w.Y),X=X0,Y=Y0-(w.lift||0),nb=NIGHT>.5?1:0,rain=S.ev&&S.ev.id==='lluvia';
  if(w.ent==='cart'){const key='cart|'+w.typ+'|'+nb+'|'+RES+'|'+w.id;let sp=WSPR.get(key);
    if(!sp){const CW=36,CH=34,c=mkCanvas(CW,CH),pc=ctx,pn=NIGHT,pnc=NCOL,pg=GLOWS;ctx=hdctx(c);NIGHT=nb;NCOL=ncol(nb);GLOWS=[];try{drawCartSpr(w,18,CH-3,1);fastOutline(ctx)}catch(e){}finally{GLOWS=pg;ctx=pc;NIGHT=pn;NCOL=pnc}sp={c,ax:18,ay:CH-3};WSPR.set(key,sp);(w.ks||(w.ks=[])).push(key)}
    ctx.globalAlpha=w.a;ellipse(X,Y+.3,4,1.2,'rgba(0,0,0,.22)',true);blitFlip(sp,X,Y,w.dx<0);
    if(w.typ==='elote'&&!lowMo())for(let q=0;q<2;q++){const k=(T*.6+q*.5)%1;ctx.globalAlpha=w.a*.35*(1-k);px(X-1.6+Math.sin(T*2+q)*.6,Y-6-k*5,1,1,'#ffffff',true)}
    if(NIGHT>.35)glow(X,Y-8,9,.8,'#ffd9a0');ctx.globalAlpha=1;return}
  const pose=w.pose,fr=pose==='walk'||pose==='run'?w.fr:pose==='ride'||w.L.wheel||pose==='talk'||pose==='point'?w.fr%2:0,dx=w.dx,front=w.front,rv=rain&&w.L.umb?1:0;
  const key=w.id+'|'+pose+'|'+fr+'|'+(front?1:0)+'|'+nb+'|'+rv+'|'+RES+'|'+(SEASON_C||'')+'|'+(w.snack||'')+'|'+(w.st==='sniff'?1:0);let sp=WSPR.get(key);
  if(!sp&&WBUD<=0&&w.lastSp)sp=w.lastSp;
  if(!sp){WBUD--;if(WSPR.size>2600){let n=0;for(const k of WSPR.keys()){WSPR.delete(k);if(++n>600)break}}
    const CW=36,CH=36,c=mkCanvas(CW,CH),pc=ctx,pn=NIGHT,pnc=NCOL,pg=GLOWS;ctx=hdctx(c);NIGHT=nb;NCOL=ncol(nb);GLOWS=[];
    try{drawLook(w,18,CH-3,pose,fr,1,front,rain);fastOutline(ctx)}catch(e){}finally{GLOWS=pg;ctx=pc;NIGHT=pn;NCOL=pnc}sp={c,ax:18,ay:CH-3};WSPR.set(key,sp);(w.ks||(w.ks=[])).push(key)}
  w.lastSp=sp;const a=w.a==null?1:w.a;
  ctx.globalAlpha=a;ellipse(X+.5,Y0+.2,2.6*(w.L.s||1),.9,'rgba(0,0,0,.22)',true);if(w.L.dog&&w.st!=='stay')ellipse(X+(dx>0?-5:5),Y0+.2,2.2,.7,'rgba(0,0,0,.2)',true);
  blitFlip(sp,X,Y,dx<0);ctx.globalAlpha=1;
  if(w.noisy&&NIGHT>.3&&Math.floor(T*2+w.ph)%3===0)glow(X,Y-8,6,.6);
  if(w.bub&&a>.8)bubble(X+dx*2,Y-12*(w.L.s||1)-(w.L.sign?6:0),w.bub.ic);
  if(VOZ&&VOZ.w===w){const b=Math.round(Math.sin(T*5)*1.2*RES)/RES,yy=Y-14*(w.L.s||1)-(w.L.sign?7:0)+b;px(X-2,yy-2,5,1,'#ffffff',true);px(X-1.5,yy-1,4,1,'#ffffff',true);px(X-1,yy,3,1,'#ffffff',true);px(X-.5,yy+1,2,1,'#ffffff',true);px(X-2,yy-3,5,1,'#1f2540',true)}
}
