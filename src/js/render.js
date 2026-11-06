/* ---------- contornos, imágenes en caché y sombras ---------- */
const OL=[24,28,48];
function outline(c,pass=RES,rec){
  const w=c.canvas.width,h=c.canvas.height,im=c.getImageData(0,0,w,h),d=im.data,a=new Uint8Array(w*h);
  for(let i=0;i<w*h;i++)a[i]=d[i*4+3]>140?1:0;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=y*w+x;if(a[i])continue;
    if((x>0&&a[i-1])||(x<w-1&&a[i+1])||(y>0&&a[i-w])||(y<h-1&&a[i+w])){const j=i*4;d[j]=OL[0];d[j+1]=OL[1];d[j+2]=OL[2];d[j+3]=215;if(rec)rec.push(i)}}
  c.putImageData(im,0,0);if(pass>1)outline(c,pass-1,rec);
}
// contorno guardado como tiras horizontales [x,y,largo]: se repinta sin leer los pixeles del lienzo
function outlineRuns(idx,w){idx.sort((p,q)=>p-q);const r=[];for(let k=0;k<idx.length;){const i=idx[k];let n=1;while(k+n<idx.length&&idx[k+n]===i+n&&(i+n)%w!==0)n++;r.push(i%w,Math.floor(i/w),n);k+=n}return new Int16Array(r)}
function paintOutline(c,runs){c.save();c.setTransform(1,0,0,1,0,0);c.globalAlpha=1;c.globalCompositeOperation='source-over';c.fillStyle=`rgba(${OL[0]},${OL[1]},${OL[2]},${(215/255).toFixed(3)})`;for(let k=0;k<runs.length;k+=3)c.fillRect(runs[k],runs[k+1],runs[k+2],1);c.restore()}
/* humo de las chimeneas de DeAcero: bocanadas que suben y se van con el viento; de noche, foco rojo y resplandor del horno */
// el humo va en el aire: se pinta después de toda la ciudad para que ningún edificio lo tape
let SMOKEQ=[];
function chimSmoke(gx,gy){const [x,y0]=P(gx+.5,gy+.5),y=y0-9-CHIM_H,n=lowMo()?3:OPT.low?4:7,c=mx('#f2efe9','#8a8ea8',NIGHT*.8),c2=mx('#b9b5ae','#55597a',NIGHT*.8);
  for(let k=0;k<n;k++){const p=lowMo()?k/n:((T*.18+k/n+gx*.13)%1),r=1.6+p*6.5,a=(1-p)*(.75-.2*NIGHT),cx=x+p*p*26+Math.sin(p*6+gx)*1.5,cy=y-2-p*34;if(a<.02)continue;
    ctx.globalAlpha=a;ctx.fillStyle=c2;ctx.beginPath();ctx.arc(cx+.6,cy+.8,r,0,7);ctx.fill();ctx.fillStyle=c;ctx.beginPath();ctx.arc(cx-.3,cy-.3,r*.86,0,7);ctx.fill()}
  ctx.globalAlpha=1;if(NIGHT>.3){if(Math.floor(T*1.2+gx)%2)px(x-.5,y-1,1.5,1.5,'#ff3b2f',true);glow(x,y-1,4,.7,'#ff3b2f');glow(x,y0-3,10,.45,'#ff7a2a')}}
/* vida de la escuela, la cancha y la clínica (v56): niños en el recreo de día, partido en la cancha y torreta de la ambulancia.
   Con «Calidad baja» o «Menos movimiento» se quedan quietos o no salen */
function kid(x,y,c,fr){px(x-.5,y-3,1.4,2,c);px(x-.4,y-4.2,1.2,1.2,'#c98e62');px(x-.5+(fr?.6:0),y-1,.5,1,'#3a3f47');px(x+.4-(fr?.6:0),y-1,.5,1,'#3a3f47')}
function liveSvc(t,gx,gy){const still=lowMo()||OPT.low,L=lvOf(t);
  if(t.k==='escuela'){if(NIGHT>.45||still)return;const Z=[[.62,.75,.2,.1],[.55,.77,.26,.1],[.77,.74,.14,.1],[.66,.7,.22,.18]][L-1],n=[5,4,5,6][L-1];
    for(let k=0;k<n;k++){const an=T*(.9+k*.25)+k*1.7+t.s,fx=gx+Z[0]+Math.cos(an)*Z[2],fy=gy+Z[1]+Math.sin(an)*Z[3],[x,y]=P(fx,fy);
      const c=L===3?(k%2?'#1f3a6b':'#f4f4f4'):['#e5534b','#3a6ea5','#f2c94c','#59cd90','#ff8fb1','#9b5de5'][k];kid(x,y,c,Math.floor(T*6+k)%2)}return}
  if(t.k==='cancha'){if(still)return;const ph=T*.35+t.s,bx=.5+Math.sin(ph)*.3,by=.5+Math.sin(ph*1.7)*.18,hop=Math.abs(Math.sin(T*4+t.s))*1.4,n=[6,6,8,8][L-1];
    const M=L===4?(u=>.25+u*.72):(u=>u);for(let k=0;k<n;k++){const team=k%2,tx=gx+M((team?.62:.38)+Math.sin(ph*1.1+k)*.22+(bx-.5)*.4),ty=gy+M(.2+(k>>1)*(.6/Math.ceil(n/2))+Math.cos(ph*.9+k)*.06),[x,y]=P(tx,ty);kid(x,y,L===1?(team?'#f4f4f4':'#59cd90'):team?'#d62828':'#2f6db5',Math.floor(T*6+k)%2)}
    const [x,y]=P(gx+M(bx),gy+M(by));px(x-.6,y-1.2-hop,1.4,1.4,'#ffffff',true);px(x-.2,y-.8-hop,.6,.6,'#2b2b2b',true);return}
  if(t.k==='clinica'&&L>1){const [x,y]=P(gx+.8,gy+.75),b=still?0:Math.floor(T*3)%2;px(x-1.4,y-5.4,1.2,.8,b?'#ff3b2f':'#7a1a14',true);px(x+.2,y-5.4,1.2,.8,b?'#2f6dff':'#ff3b2f',true);if(NIGHT>.2)glow(x,y-5,6,.6,b?'#4a7bff':'#ff4a3a')}}
/* agua viva: chorros de las fuentes y ondas en el lago */
function liveWater(t,gx,gy){if(lowMo()||OPT.low||t.b>0||t.lu>0)return;const L=lvOf(t);
  let src=null;if(t.k==='parque'&&L===3)src=[.5,.5,-6,6,2.6];else if(t.k==='plaza'&&L===2)src=[.5,.5,-8.5,8,2];
  if(src){const [x,y]=P(gx+src[0],gy+src[1]),top=y+src[2];
    for(let k=0;k<10;k++){const p=(T*1.1+k/10)%1,an=k*2.4+Math.floor((T*1.1+k/10))*1.3,r=p*src[4]*1.4,dx=Math.cos(an)*r,dy=Math.sin(an)*r*.5,h=Math.sin(p*Math.PI)*2.2-p*p*(-src[2]-2.5);
      px(x+dx-.3,top-h+dy+2,.7,.7,p<.5?'#e8f7ff':'#bfe6ff')}
    const pr=(T*.7)%1,rx=2+pr*(src[3]-2);for(let k=0;k<10;k++){const an=k/10*Math.PI*2;px(x+Math.cos(an)*rx-.3,y-.5+Math.sin(an)*rx*.5,.7,.5,`rgba(220,245,255,${(.7*(1-pr)).toFixed(2)})`)}}
  if(t.k==='parque'&&L===4){const [x,y]=P(gx+.54,gy+.56);
    for(let q=0;q<2;q++){const pr=(T*.45+q*.5)%1,ox=Math.sin(q*7.3+Math.floor(T*.45+q*.5)*2.1)*4,oy=Math.cos(q*3.1+Math.floor(T*.45+q*.5)*1.7)*1.5,rx=.8+pr*4;
      for(let k=0;k<12;k++){const an=k/12*Math.PI*2;px(x+ox+Math.cos(an)*rx-.3,y+oy+Math.sin(an)*rx*.5,.6,.4,`rgba(210,240,255,${(.65*(1-pr)).toFixed(2)})`)}}
    if(NIGHT<.5)for(let k=0;k<4;k++){const ph=(T*.6+k*.37)%1;if(ph<.5){const a=Math.sin(ph*2*Math.PI);px(x-6+k*3.6+Math.sin(T+k)*1.2,y-1+((k*5)%3)-1,1,.5,`rgba(255,255,255,${a.toFixed(2)})`)}}}}
/* gente afuera de cafés, restaurantes, bares y Tomates: depende de la hora y de cuántos clientes tiene el negocio */
const VIS=new Map();
function visitorsOf(t,i){const ph=S.clock/DAY,k=t.k;let w=0;
  if(k==='cafe')w=ph<.22?1:ph<.45?.45:ph>.88?.4:0;else if(k==='resto')w=(ph>.24&&ph<.37)||(ph>.5&&ph<.68)?1:.15;else if(k==='bar')w=ph>.52&&ph<.92?1:0;else if(k==='tomates')w=ph<.92&&ph>.0?.45:0;
  if(!w||t.b>0||t.lu>0)return 0;const e=EARN.get(i),cu=e?e.cust||0:0;return Math.min(OPT.low||AUTOLOW?2:4,Math.round(w*(1.6+Math.min(2.4,cu/30))))}
function visitor(i,k,kind){const key=i*8+k;let v=VIS.get(key);if(v)return v;const h=n=>((Math.sin((key+1)*(n+3)*12.9898)*43758.5453)%1+1)%1;
  v={wid:'v'+key,id:'v'+key,ph:h(1)*9,noisy:kind==='est'&&h(4)<.3,st:'visit',ks:[],L:{g:kind,s:1,fem:h(7)<.5,shirt:kind==='pro'?['#2b3a55','#3a3a3a','#5a4a3a'][Math.floor(h(2)*3)]:SHIRTS[Math.floor(h(2)*SHIRTS.length)],vest:kind==='pro'?1:0,pants:PANTS[Math.floor(h(8)*PANTS.length)],skin:SKIN[Math.floor(h(3)*SKIN.length)],hair:HAIR[Math.floor(h(9)*HAIR.length)],long:h(7)<.3,back:kind==='est'?['#d62828','#2a9d8f','#f2c94c'][Math.floor(h(10)*3)]:null,coffee:kind==='pro'&&h(11)<.5,dog:h(5)<.15&&kind!=='est'?(h(6)<.5?'#8a5a2b':'#e8c07a'):null,umb:true}};
  if(VIS.size>800)VIS.clear();VIS.set(key,v);return v}
// dónde se paran: en la banqueta si la calle queda del lado que se ve; si no, en el frente del local
const VSIDE={a:[[.64,-.24,-1,true],[.64,-.06,1,false],[.64,.14,-1,true],[.64,.3,1,false]],b:[[-.24,.64,1,true],[-.06,.64,-1,false],[.14,.64,1,true],[.3,.64,-1,false]],
  c:[[.36,.42,-1,true],[.44,.33,1,false],[.42,.46,1,true],[.33,.44,-1,false]]};
function vslots(gx,gy){const [a,b]=rot(gx+.5,gy+.5),bk=(4-ROT)%4,st=(u,v)=>{const w=rot(a+u,b+v,bk),x=Math.floor(w[0]),y=Math.floor(w[1]);if(!inb(x,y))return false;const q=S.g[idx(x,y)];return q.k==='calle'&&!q.hw};
  return st(1,0)?VSIDE.a:st(0,1)?VSIDE.b:VSIDE.c}
function drawVisitors(t,gx,gy){const i=idx(gx,gy),n=visitorsOf(t,i);if(!n)return;const G=LIKE[t.k]||['pro'],rain=WXA>.3,[a,b]=rot(gx+.5,gy+.5),nbv=NIGHT>.5?1:0;
  const SL=vslots(gx,gy);for(let k=0;k<n;k++){const sl=SL[k],v=visitor(i,k,G[k%G.length]),wp=rot(a+sl[0],b+sl[1],(4-ROT)%4),[X,Y]=P(wp[0],wp[1]),bob=lowMo()?0:(Math.floor(T*1.3+v.ph)%5===0?.5:0);
    ellipse(X+.5,Y+.2,2.4,.8,'rgba(0,0,0,.2)',true);
    const keyS=v.wid+'|s|'+sl[2]+'|'+sl[3]+'|'+nbv+'|'+(rain?1:0)+'|'+RES;let sp=WSPR.get(keyS);
    if(!sp){if(WBUD<=0)continue;WBUD--;const CW=36,CH=36,c=mkCanvas(CW,CH),pc=ctx,pn=NIGHT,pnc=NCOL,pg=GLOWS;ctx=hdctx(c);NIGHT=nbv;NCOL=ncol(nbv);GLOWS=[];
      try{drawLook(v,18,CH-3,'stand',0,sl[2],sl[3],rain);fastOutline(ctx)}catch(e){}finally{GLOWS=pg;ctx=pc;NIGHT=pn;NCOL=pnc}sp={c,ax:18,ay:CH-3};WSPR.set(keyS,sp)}
    ctx.drawImage(sp.c,Math.round((X-sp.ax)*RES)/RES,Math.round((Y-bob-sp.ay)*RES)/RES,sp.c.width/RES,sp.c.height/RES)}}
/* partes animadas: se dibujan en vivo encima de la imagen guardada */
function drawDyn(t,gx,gy){
  const s=t.s;if(SEASON_C)seasonDeco(t,gx,gy);
  if(DIST==='ribera'){if(t.k==='rio'||t.pu||t.lecho||t.dmg)rioDyn(t,gx,gy);if(t.k==='domo'&&!(t.b>0))atirDyn(gx,gy)}
  if(t.k==='parque'||t.k==='plaza')liveWater(t,gx,gy);else if(t.k==='cafe'||t.k==='resto'||t.k==='bar'||t.k==='tomates')drawVisitors(t,gx,gy);
  if((t.k==='escuela'||t.k==='cancha'||t.k==='clinica')&&!(t.b>0))liveSvc(t,gx,gy);
  if(t.k==='dogpark'){const L=lvOf(t),cx=[0,.5,.6,.68,.72][L],cy=[0,.5,.58,.68,.4][L],rr2=[0,.26,.2,.16,.13][L];for(let k=0;k<2;k++){const an=T*(1.2+k*.5)+k*3+s,fx=gx+cx+Math.cos(an)*rr2,fy=gy+cy+Math.sin(an)*rr2,[x,y]=P(fx,fy),dir=Math.cos(an+Math.PI/2)>0?1:-1,c=k?'#e8c07a':'#4a3526';
    px(x-2,y-3,4,2,c);px(x+(dir>0?2:-3),y-4,2,2,c);px(x-2,y-1,1,1,'#333');px(x+1,y-1,1,1,'#333');px(x+(dir>0?-3:2),y-4,1,1,c)}}
  else if(t.k==='teleferico'&&!(t.b>0))telCabins(gx,gy);
  else if(t.k==='caseta'&&NIGHT>.2){const [x,y]=P(gx+.5,gy+.48);px(x,y-13,2,1,Math.floor(T*2)%2?'#3b82f6':'#d62828',true);glow(x,y-13,8,.5)}
  else if(t.k==='fabrica'&&chimney(gx,gy))SMOKEQ.push([gx,gy]);
  else if((t.k==='tanque'||t.k==='torreagua')&&NIGHT>.3){const [x,y]=P(gx+.5,gy+.5);px(x,y-62-27,1,1,Math.floor(T*1.5)%2?'#ff3b3b':'#661111',true)}
  if(t.ub>0){const d=DEFS[t.k],FH=t.k==='torre'?6:7,p=Math.max(0,Math.min(1,1-t.ub/(d.bt*.4))),h0=t.f*FH+3,{C,L,R,F,Bk}=footCorners(gx,gy,1,1,.1),ch=Math.max(1,FH*p);
    for(const c of C)if(c!==Bk)px(c[0]-.5,c[1]-h0-ch,1,ch,'#9c968b');scaffBand(L,F,h0-FH,h0+FH+1,FH);scaffBand(F,R,h0-FH,h0+FH+1,FH);crane(gx,gy,h0+FH)}
  if(t.ct>0){const p=1-t.ct/(t.ctt||60),h=t.f*7+3+p*60;crane(gx,gy,h);scaffold(gx,gy,.14,h*.92)}
  if(t.lu>0){const so=shadowOf(t),hh=so?so[1]:10,{L,R,F}=footCorners(gx,gy,1,1,.06);scaffBand(L,F,0,hh+2,Math.max(4,Math.min(7,hh/3)));scaffBand(F,R,0,hh+2,Math.max(4,Math.min(7,hh/3)));crane(gx,gy,hh+6);const [x,y]=P(gx+.5,gy+.9);px(x-6,y-3,12,2,'#f2c230',true);px(x-6,y-3,2,2,'#1c2033',true);px(x-2,y-3,2,2,'#1c2033',true);px(x+2,y-3,2,2,'#1c2033',true)}
  if(tool==='mejorar'&&LV[t.k]){const L=lvOf(t),so=shadowOf(t),[x,y0]=P(gx+.5,gy+.5),y=Math.round(y0-(so?so[1]:12)-8),can=!(t.lu>0)&&L<4&&stats.VAL&&stats.VAL[idx(gx,gy)]>=LVTH[L+1]&&S.$>=lvCost(t,idx(gx,gy));
    for(let k=0;k<4;k++){const sx=x-7+k*4;px(sx,y,3,3,'#1c2033',true);px(sx+1,y+1,1,1,k<L?'#ffd84d':'#6b7280',true)}if(can&&Math.floor(T*3)%2)px(x+9,y,3,3,'#3fae5a',true);return}
  const b=!REAL&&stats.Bi&&stats.Bi.get(idx(gx,gy));
  if(b&&b.worst<.55&&b.wk&&!HEAT){const so=shadowOf(t),[x,y0]=P(gx+.5,gy+.5),y=Math.round(y0-(so?so[1]:20)-12),bob=Math.floor(T*2+gx)%2;
    const col={verde:'#3fae5a',com:'#f26a21',park:'#3a6ea5',dog:'#8a5a2b'}[b.wk];
    px(x-4,y-4+bob,9,8,'#1c2033',true);px(x-3,y-3+bob,7,6,'#ffffff',true);px(x,y+4+bob,1,2,'#1c2033',true);
    const ic={verde:[[0,-2],[-1,-1],[0,-1],[1,-1],[-2,0],[-1,0],[0,0],[1,0],[2,0],[0,1]],com:[[-2,-1],[-1,-1],[0,-1],[1,-1],[-2,0],[1,0],[2,0],[-2,1],[-1,1],[0,1],[1,1]],
      park:[[-1,-2],[0,-2],[1,-2],[-1,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1]],dog:[[-2,-2],[0,-2],[2,-2],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]]}[b.wk];
    for(const [a,c] of ic)px(x+a,y+c+bob,1,1,col,true)}
}
const CHIM_H=58,chimney=(gx,gy)=>gy===OFF+15&&gx%7===3;
const SPH={_pino:48,_ofrenda:36,_puesto:34,beis:150,museo:120,rasca:190,bosque:120,plazacom:130,metro:110,gym:88,unas:76,barber:72,paleteria:76,boliche:80,cine:110,golf:84,escuela:84,clinica:92,cancha:72,mirador:104,teleferico:110,torre:200,edificio:116,ladrillo:116,oficinas:112,tanque:120,torreagua:120,domo:70,fabrica:40,calle:40,arbol:40,ajeno:44,lotedomo:44};
// caché por nivel de noche: solo 4 niveles (día, tarde, anochecer, noche) y se funden dos a la vez
let WLATE=0,WLPH=-1;
// de noche las ventanas se apagan por pasos y cada edificio va a su ritmo: así se ven apagarse de a poco y no todas a la vez.
// 4 pasos normalmente; 2 en «Calidad baja» o si el aparato va lento (cada paso obliga a redibujar el edificio)
const WLTH=[.5,.4,.31,.22];
function wlOf(i){if(WLPH<0)return 0;const st=OPT.low||AUTOLOW?2:4,o=((Math.sin(i*12.9898)*43758.5453)%1+1)%1,k=Math.max(0,Math.min(st-1,Math.floor(WLPH*(st+.6)-o*1.4)));return st===4?k:k*3}
const SPRL=new Map(),SPR={clear(){SPRL.clear();OUTC.clear()}},LASTSPR=new Map();let sprBudget=0,SPRDL=0,SPRFORCE=0,SPRBT=0;
// contorno de cada edificio: depende solo de su forma, así que se calcula una vez y se reusa en los cuatro niveles de noche
const OUTC=new Map(),LASTMAX=900;
const NLV=[0,1/3,2/3,1];let NLO=0,NHI=0,NFR=0;
// AUTOLOW: si el aparato va lento (cuadros de más de ~42 ms sostenidos) se apaga el fundido de noche, como en «Calidad baja», hasta que se recupere
let AUTOLOW=false,FTA=1/60;
function nightPair(n){const k=Math.min(2,Math.floor(n*3+1e-6));NLO=NLV[k];NHI=NLV[k+1];NFR=Math.max(0,Math.min(1,(n-NLO)*3));if(OPT.low||AUTOLOW){if(NFR>=.5)NLO=NHI;NFR=0}if(NFR<.03){NFR=0}else if(NFR>.97){NLO=NHI;NFR=0}
  for(const k2 of SPRL.keys())if(k2!==NLO&&k2!==NHI)SPRL.delete(k2)}
// tinte que oscurece lo que no tiene luz propia: violeta cálido en la tarde, azul profundo de noche (v54)
const NTINT=[[0,[86,46,96],0],[1/3,[86,46,96],.2],[2/3,[40,30,92],.43],[1,[8,14,48],.63]];
const ncol=n=>{let k=1;while(k<NTINT.length-1&&n>NTINT[k][0])k++;const a=NTINT[k-1],b=NTINT[k],f=Math.max(0,Math.min(1,(n-a[0])/(b[0]-a[0]))),c=a[1].map((v,i)=>Math.round(v+(b[1][i]-v)*f)),al=(a[2]+(b[2]-a[2])*f)*(OPT.hc?.65:1);
  return `rgba(${c},${al.toFixed(3)})`};
function hasObj(t,gx,gy){const k=t.k;if(k==='lote'||k==='part'||k==='rio')return false;if(k==='calle')return !t.hw&&(gx*3+gy)%4===0;if(k==='ajeno')return t.s%9===0||t.s%4===1||Object.values(SIGNS).some(a=>a[0]===gx&&a[1]===gy);return true}
// los negocios brillan de noche para que se encuentren rápido (altura del letrero)
// color del letrero de noche: neón rosa en bares, azul en lo cultural y oficinas, verde en el pádel; lo demás, cálido
const NEON={boliche:'#c38dff',cine:'#ffd27a',gym:'#9fe8ff',bar:'#ff6fae',cultura:'#7fd6ff',oficinas:'#c9dcff',padel:'#8dffb0',caseta:'#9fc4ff'};
const SHOPGLOW={barber:6,unas:6,paleteria:5,gym:8,boliche:10,cine:12,cafe:6,resto:8,bar:8,tomates:8,padel:4,oficinas:10,caseta:6,cultura:12,kiosco:8};
function makeSprite(t,gx,gy,nb,okey){
  const [dw,dh]=DIMT(t),sz=(dw+dh)/2,h=t.k==='fabrica'&&chimney(gx,gy)?84:SPH[t.k]||64,w=t.k==='domo'?84:sz>1?(dw+dh)*17+24:64,c=mkCanvas(w,h);
  const ax=w/2,ay=h-6-(dw+dh)*4,pc=ctx,pcam={ox:cam.ox,oy:cam.oy},pn=NIGHT,pnc=NCOL,pg=GLOWS;
  ctx=hdctx(c);const [rx,ry]=rot(gx+dw/2,gy+dh/2);cam.ox=ax-(rx-ry)*TW/2;cam.oy=ay-(rx+ry)*TH/2;
  NIGHT=nb;NCOL=ncol(nb);GLOWS=[];let glows=[];
  try{drawObj(t,gx,gy,false);if(SHOPGLOW[t.k]&&!(t.b>0)){const [sx,sy]=P(gx+dw/2,gy+dh/2);GLOWS.push([sx,sy-SHOPGLOW[t.k],13+5*(sz-1),.6,NEON[t.k]])}glows=GLOWS.map(g=>[g[0]-ax,g[1]-ay,g[2],g[3],g[4]]);
    const oc=okey&&OUTC.get(okey);if(oc&&oc.w===c.width&&oc.h===c.height)paintOutline(ctx,oc.r);else{const rec=[];outline(ctx,RES,rec);if(okey){if(OUTC.size>2400)OUTC.clear();OUTC.set(okey,{w:c.width,h:c.height,r:outlineRuns(rec,c.width)})}}}
  catch(e){console.warn('dibujo',t.k,e)}
  finally{GLOWS=pg;ctx=pc;cam.ox=pcam.ox;cam.oy=pcam.oy;NIGHT=pn;NCOL=pnc}
  return {c,ax,ay,glows};
}
function getSprite(t,gx,gy,i,nb,ghost){
  const wl=nb===1?wlOf(i):0,base=`${i}|${t.k}|${t.s}|${t.f||0}|${t.lv||1}|${ROT}|${ghost?'g':''}|${wl}`;
  let M=SPRL.get(nb);if(!M){M=new Map();SPRL.set(nb,M)}
  let sp=M.get(base);if(sp)return sp;
  const last=LASTSPR.get(base);
  // sin tiempo en este cuadro: se usa la imagen anterior; si no hay (recién girado), se espera unos cuadros en vez de congelar la pantalla
  // lo que ya tiene imagen anterior espera turno; lo que no tiene (recién girado) se arma con hasta ~35 ms de trabajo por cuadro y al menos dos por cuadro
  if(last){if(sprBudget<=0||performance.now()>SPRDL)return last}else if(SPRBT>35){if(SPRFORCE<=0)return null;SPRFORCE--}
  sprBudget--;if(M.size>1600)M.clear();
  {const t0=performance.now(),pw=WLATE,pre=base.slice(0,base.lastIndexOf('|'));WLATE=wl;try{sp=makeSprite(t,gx,gy,nb,pre)}finally{WLATE=pw}SPRBT+=performance.now()-t0;if(wl)for(let q=0;q<wl;q++){const ok=pre+'|'+q;M.delete(ok);LASTSPR.delete(ok)}}M.set(base,sp);
  // respaldo con tope: se queda la imagen más reciente de cada cosa; las de giros o pisos viejos se van saliendo (antes crecía sin límite)
  LASTSPR.delete(base);LASTSPR.set(base,sp);if(LASTSPR.size>LASTMAX){const it=LASTSPR.keys();for(let k=LASTSPR.size-LASTMAX;k>0;k--)LASTSPR.delete(it.next().value)}return sp;
}
// neón de los bares: zumbido leve y de vez en cuando un parpadeo; cada letrero a su tiempo
function neonF(c,x,y){if(c!=='#ff6fae'||lowMo())return 1;const h=((Math.sin(x*12.9898+y*78.233)*43758.5)%1+1)%1,t=(T*.5+h*13)%9;if(t<.12)return .08;if(t<.2)return 1;if(t<.3)return .25;return .9+.1*Math.sin(T*40+h*9)}
// viento: árboles y palmas se mecen; con lluvia, más fuerte
function swayOf(t,gx,gy){if(lowMo()||OPT.low||AUTOLOW)return 0;const k=t.k;if(!(k==='arbol'||k==='palma'||(k==='ajeno'&&t.s%9===0&&!Object.values(SIGNS).some(a=>a[0]===gx&&a[1]===gy))))return 0;
  const w=WXA>0?.05+.04*WXA:.018;return w*Math.sin(T*1.7+gx*.9+gy*1.7)+w*.45*Math.sin(T*3.3+gx*2.3+gy*.7)}
function drawSprite(sp,gx,gy,sz=1,ng,sh){const [qw,qh]=Array.isArray(sz)?sz:[sz,sz],[cx,cy]=P(gx+qw/2,gy+qh/2);
  if(sh){ctx.save();ctx.translate(rr(cx),rr(cy));ctx.transform(1,0,sh,1,0,0);ctx.drawImage(sp.c,-sp.ax,-sp.ay,sp.c.width/RES,sp.c.height/RES);ctx.restore()}
  else ctx.drawImage(sp.c,rr(cx-sp.ax),rr(cy-sp.ay),sp.c.width/RES,sp.c.height/RES);
  if(!ng)for(const g of sp.glows)glow(cx+g[0],cy+g[1],g[2],g[3]*neonF(g[4],cx,cy),g[4])}
function drawSprN(t,gx,gy,i,sz,a,ghost){const s1=getSprite(t,gx,gy,i,NLO,ghost);if(!s1)return;ctx.globalAlpha=a;const sh=ghost?0:swayOf(t,gx,gy);
  if(!NFR){drawSprite(s1,gx,gy,sz,false,sh);return}
  drawSprite(s1,gx,gy,sz,true,sh);const s2=getSprite(t,gx,gy,i,NHI,ghost);if(s2&&s2!==s1){ctx.globalAlpha=a*NFR;drawSprite(s2,gx,gy,sz,true,sh);ctx.globalAlpha=a}
  const [qw,qh]=Array.isArray(sz)?sz:[sz,sz],[cx,cy]=P(gx+qw/2,gy+qh/2);for(const g of s1.glows)glow(cx+g[0],cy+g[1],g[2],g[3]*neonF(g[4],cx,cy),g[4])}
/* sombras: altura y huella de cada cosa */
function shadowOf(t){const k=t.k;
  if(k==='domo'&&DIST==='ribera')return [.42,88];if(k==='malecon')return [.4,9];
  if(k==='edificio'||k==='ladrillo')return [.1,(t.f||3)*7+3];if(k==='torre')return [.16,(t.f||16)*6+3];
  const L=lvOf(t);
  if(k==='oficinas')return [.14,[0,39,45,57,63][L]];if(k==='tomates')return [[0,.18,.12,.12,.12][L],[0,10,11,11,12][L]];
  if(k==='cafe')return [[0,.36,.12,.12,.1][L],[0,6,12,12,17][L],[0,.62,.6,.66,.7][L]];if(k==='resto')return [[0,.18,.14,.1,.1][L],[0,10,14,9,17][L],[0,.82,.72,.88,.72][L]];
  if(k==='estac')return L===4?[.08,26]:L===3?[.04,9]:null;if(k==='padel')return L===4?[.06,13]:L===2?[.02,16]:null;
  if(k==='caseta')return [.3,L===3?10:11];if(k==='bar')return [[0,.3,.14,.14,.14][L],[0,6,14,13,21][L]];if(k==='kiosco')return [.2,14];if(k==='mirador')return [.38,56];if(k==='cultura')return [.12,26];if(k==='teleferico')return [.14,40];if(k==='tanque'||k==='torreagua')return [.36,78];if(k==='arbol'||k==='ajeno'&&t.s%9===0)return [.34,10];if(k==='palma')return [.4,14];
  if(k==='escuela')return [.07,[0,8,15,22,23][L]];if(k==='clinica')return [.09,[0,9,14,28,41][L]];if(k==='cancha')return L===4?[.12,10]:null;
  if(k==='barber')return [.16,[0,10,12,12,18][L]];if(k==='unas')return [.16,[0,10,12,13,17][L]];if(k==='paleteria')return L===1?[.34,8]:[.14,[0,8,10,12,17][L]];if(k==='gym')return L===1?null:[.12,[0,0,12,13,24][L]];
  if(k==='boliche')return [.12,[0,11,13,13,15][L]];if(k==='cine')return [.12,[0,14,16,18,24][L]];if(k==='golf')return L>=3?[.06,11]:null;
  if(k==='rasca')return [.3,150,.7];if(k==='beis')return [.05,9];if(k==='museo')return [.1,26];if(k==='bosque')return [.1,12];if(k==='plazacom')return [.1,20];if(k==='metro')return [.1,24];
  if(k==='parque')return [.3,7];if(k==='plaza')return [.35,5];if(k==='fabrica')return [0,9];return null}
function hull(pts){pts.sort((a,b)=>a[0]-b[0]||a[1]-b[1]);const cr=(o,a,b)=>(a[0]-o[0])*(b[1]-o[1])-(a[1]-o[1])*(b[0]-o[0]);const lo=[],hi=[];
  for(const p of pts){while(lo.length>=2&&cr(lo[lo.length-2],lo[lo.length-1],p)<=0)lo.pop();lo.push(p)}
  for(let i=pts.length-1;i>=0;i--){const p=pts[i];while(hi.length>=2&&cr(hi[hi.length-2],hi[hi.length-1],p)<=0)hi.pop();hi.push(p)}
  hi.pop();lo.pop();return lo.concat(hi)}
function sunAt(ph){if(ph>=.5)return null;const th=ph/.5*Math.PI,L=Math.min(3.2,.3+2*(1-Math.sin(th)));return {dx:-Math.cos(th)*L,dy:-(.35+.15*Math.sin(th))*L,str:Math.min(1,Math.sin(th)*5)}}
let GC=null,GSH=null,GKEY='';
/* el suelo se pinta en etapas: orillas, filas de terreno, luz de los postes, sombras por fila y mezcla de sombras.
   Si cambió la ciudad (GV o giro) se pinta completo al momento; si solo cambió la hora, se pinta por partes en un
   lienzo de reserva con unos milisegundos por cuadro y se cambia cuando está listo (antes eran ~440 ms de golpe en un celular lento) */
let GB=null,GJOB=null;
function gStep(job,until){const w=N*TW+8,h=N*TH+40,pc=ctx,pcam={ox:cam.ox,oy:cam.oy},pn=NIGHT,pnc=NCOL;
  try{ctx=hdctx(job.c);cam.ox=w/2;cam.oy=4;NIGHT=job.nb;NCOL=ncol(job.nb);
    for(;;){
      if(job.st===0){ctx.clearRect(0,0,w,h);drawEdges();job.st=1;job.y=0}
      else if(job.st===1){for(let x=0;x<N;x++)drawGround(x,job.y,S.g[idx(x,job.y)]);if(++job.y>=N)job.st=2}
      else if(job.st===2){const nb=job.nb;if(nb>.2){for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=S.g[idx(x,y)];if(t.k!=='calle'||t.hw||(x*3+y)%4!==0)continue;const [lx,ly]=P(x+.3,y+.5);
          ctx.save();ctx.translate(lx,ly);ctx.scale(1,.5);const gr=ctx.createRadialGradient(0,0,0,0,0,15);gr.addColorStop(0,`rgba(255,214,140,${(.34*nb).toFixed(3)})`);gr.addColorStop(1,'rgba(255,214,140,0)');ctx.fillStyle=gr;ctx.fillRect(-15,-15,30,30);ctx.restore()}}
        job.sun=sunAt(job.sb/36);if(job.sun&&job.sun.str>.05&&job.nb<.6){hdctx(GSH).clearRect(0,0,w,h);job.st=3;job.y=0}else job.st=5}
      else if(job.st===3){const keep=ctx;ctx=hdctx(GSH);ctx.fillStyle='#0b1030';const sun=job.sun,y=job.y;
        try{for(let x=0;x<N;x++){const t=S.g[idx(x,y)];if(t.b>0)continue;const so=shadowOf(t);if(!so)continue;
          const [ins,hh,ex]=so,[sw,sh]=MULTI(t.k)?DIMT(t):[1,1],x0=x+ins,y0=y+ins,x1=x+sw-1+(ex||1-ins),y1=y+sh-1+(ex||1-ins),L=hh/TH,ln=Math.hypot(sun.dx,sun.dy)*L,cl=ln>4.2?4.2/ln:1,ox=sun.dx*L*cl,oy=sun.dy*L*cl;
          const c=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]];rasterPoly(hull(c.concat(c.map(([a,b])=>[a+ox,b+oy])).map(([a,b])=>P(a,b))))}}finally{ctx=keep}
        if(++job.y>=N)job.st=4}
      else if(job.st===4){ctx.globalAlpha=.3*job.sun.str*(1-job.nb);ctx.drawImage(GSH,0,0,w,h);ctx.globalAlpha=1;job.st=5}
      if(job.st===5)return true;
      if(until&&performance.now()>until)return false}
  }catch(e){console.warn('suelo',e);return true}finally{ctx=pc;cam.ox=pcam.ox;cam.oy=pcam.oy;NIGHT=pn;NCOL=pnc}}
function groundLayer(nb,ph){
  const sb=Math.round(ph*36),key=`${GV}|${ROT}|${nb}|${sb}`,base=`${GV}|${ROT}|`;
  const w=N*TW+8,h=N*TH+40;
  if(!GC){GC=mkCanvas(w,h);GSH=mkCanvas(w,h);GB=null;GJOB=null;GKEY=''}
  if(GKEY===key)return GC;
  if(!GKEY.startsWith(base)){GJOB=null;gStep({c:GC,nb,sb,st:0,y:0});GKEY=key;return GC}
  if(!GB||GB.width!==GC.width)GB=mkCanvas(w,h);
  if(!GJOB||!GJOB.key.startsWith(base))GJOB={key,c:GB,nb,sb,st:0,y:0};
  if(gStep(GJOB,performance.now()+(OPT.low?2:3))){const t=GC;GC=GB;GB=t;GKEY=GJOB.key;GJOB=null}
  return GC;
}
function tileFill(pts){rasterPoly(pts)}
function render(){
  const ph=S.clock/DAY;NIGHT=keyf(NF,ph);NCOL=ncol(NIGHT);LIGHTN=0;
  if(REAL)hover=-1;SEASON_C=SEASON();const nb=Math.round(NIGHT*16)/16;sprBudget=TL?60:14;SPRFORCE=TL?8:2;SPRBT=0;SPRDL=performance.now()+(OPT.low?4:TL?14:6);WBUD=OPT.low?2:5;nightPair(NIGHT);WLPH=ph>.62&&ph<.88?(ph-.62)/.26:-1;
  cam.ox=Math.round(bw/2+panX/zoom);cam.oy=Math.round(bh/2-N*TH/2+panY/zoom+30);
  drawBack(keyf(SKY,ph,true));drawBolt();
  const G=groundLayer(nb,ph);ctx.drawImage(G,cam.ox-G.width/RES/2,cam.oy-4,G.width/RES,G.height/RES);
  if(HEAT&&stats.VAL){ctx.globalAlpha=.72;for(let i=0;i<N*N;i++){const t=S.g[i];if(t.k==='ajeno'||t.hw||t.k==='fabrica')continue;const v=stats.VAL[i],x=i%N,y=Math.floor(i/N);
    ctx.fillStyle=v<.5?mix('#e66100','#fbe7a1',v/.5):mix('#fbe7a1','#2f6fd0',(v-.5)/.5);tileFill([P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)])}ctx.globalAlpha=1}
  if(hover>=0&&!HEAT&&tool!=='mejorar'){const d=DEFS[tool];const R=d&&(d.R||(d.val&&d.val[1]));if(R&&canBuild(S.g[hover])){const hx=hover%N,hy=Math.floor(hover/N);ctx.globalAlpha=.16;ctx.fillStyle='#fff7c2';
    for(let y=Math.max(0,hy-R);y<=Math.min(N-1,hy+R);y++)for(let x=Math.max(0,hx-R);x<=Math.min(N-1,hx+R);x++)if(Math.abs(x-hx)+Math.abs(y-hy)<=R)tileFill([P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)]);ctx.globalAlpha=1}}
  if(hover>=0){const hx=hover%N,hy=Math.floor(hover/N),t=S.g[hover];
    const ti=t.k==='part'?S.g[t.a]:t,ok=tool==='ver'?true:tool==='mejorar'?!!LV[ti.k]&&lvOf(ti)<4&&stats.VAL&&stats.VAL[t.k==='part'?t.a:hover]>=LVTH[lvOf(ti)+1]&&S.$>=lvCost(ti,t.k==='part'?t.a:hover):tool==='demoler'?!!DEFS[t.k]&&!DEFS[t.k].fixed&&!t.hw:canUp(t)?S.$>=upCost(t):tool==='torre'&&canConv(t)?S.$>=convCost(t):canBuild(t)&&S.$>=costOf(tool);
    if(isParcel(t)&&PARCELS[t.p]){const can=S.maxV>=PARCELS[t.p].unlock&&S.$>=lotPrice(t.p);ctx.globalAlpha=.35;ctx.fillStyle=can?'#ffd84d':'#e66100';
      for(let j=0;j<S.g.length;j++)if(isParcel(S.g[j])&&S.g[j].p===t.p){const x=j%N,y=Math.floor(j/N);tileFill([P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)])}ctx.globalAlpha=1}
    else if(MULTI(tool)&&tool!=='demoler'){const tf=toolFoot(hover),[fw,fh]=tf?[tf.w,tf.h]:DIM(tool,0),dm=DEFS[tool].max||(DEFS[tool].sz>1?1:0),okk=tf&&S.$>=costOf(tool)&&!(dm&&stats.counts[tool]>=dm);ctx.globalAlpha=.45;ctx.fillStyle=okk?'#ffffff':'#ff4d4d';
      for(let dy=0;dy<fh;dy++)for(let dx=0;dx<fw;dx++){const x=hx+dx,y=hy+dy;if(inb(x,y))tileFill([P(x,y),P(x+1,y),P(x+1,y+1),P(x,y+1)])}ctx.globalAlpha=1}
    else{ctx.globalAlpha=.45;ctx.fillStyle=ok?'#ffffff':'#ff4d4d';tileFill([P(hx,hy),P(hx+1,hy),P(hx+1,hy+1),P(hx,hy+1)]);ctx.globalAlpha=1}}
  const buckets=Array.from({length:2*N},()=>[]);
  const vb=(x,y)=>{const [a,b]=rot(x,y);return Math.max(0,Math.min(2*N-1,Math.floor(a)+Math.floor(b)))};
  if(!TL){for(const w of walkers)buckets[vb(w.X,w.Y)].push(w);for(const w of EXTRA)buckets[vb(w.X,w.Y)].push(w)}
  trafficStep();const cars=[];for(const c of CARS){cars.push({car:1,fx:c.x,fy:c.row+c.lane+(c.lo||0),c:c.c,dir:c.dir,type:c.type,sp:c.sp})}
  for(const c of cars)buckets[vb(c.fx,c.fy)].push(c);
  // transparencia: lo que está entre el jugador y el terreno bajo el cursor se vuelve vidrio
  let HV=null;if(hover>=0&&!TITLE){const hx=hover%N,hy=Math.floor(hover/N),tf=MULTI(tool)?toolFoot(hover):null,[hw,hh]=tf?[tf.w,tf.h]:MULTI(tool)?DIM(tool,0):[1,1],r=rot(hx+hw/2,hy+hh/2),p=P(hx+hw/2,hy+hh/2);HV={d:r[0]+r[1],x:p[0],y:p[1],w:TW*(.55+.25*(hw+hh-2))}}
  const fade=(t,x,y,sz=1)=>{if(!HV)return 1;const [fw,fh]=Array.isArray(sz)?sz:[sz,sz],r=rot(x+fw/2,y+fh/2);if(r[0]+r[1]<=HV.d)return 1;const so=shadowOf(t),h=so?so[1]:0;if(h<12)return 1;
    const c=P(x+fw/2,y+fh/2),q=(fw+fh)/2;if(Math.abs(c[0]-HV.x)>HV.w+TW*.5*(q-1))return 1;if(HV.y<c[1]-h-10||HV.y>c[1]+TH*.5*q)return 1;return .28};
  const htf=hover>=0&&MULTI(tool)&&tool!=='demoler'?toolFoot(hover):null;
  for(let d=0;d<2*N-1;d++){
    // solo se dibuja lo que cae en pantalla: un edificio ocupa de ~210 px arriba de su terreno a ~12 px abajo
    // en cada diagonal van primero los edificios de varias casillas: lo que está enfrente de su parte de atrás se pinta encima
    for(let pass=0;pass<2;pass++)
    for(let vx=0;vx<N;vx++){const vy=d-vx;if(vy<0||vy>=N)continue;const c=rot(vx+.5,vy+.5,(4-ROT)%4),x=Math.floor(c[0]),y=Math.floor(c[1]),i=idx(x,y),t=S.g[i];
      {const q=P(x+.5,y+.5);if(q[0]<-130||q[0]>bw+130||q[1]<-16||q[1]-215>bh)continue}
      if(t.k==='part'||MULTI(t.k)){if(pass)continue;const a=anchorOf(i),at=S.g[a],dm=DIMT(at),f=foot(a,...dm)||[a];
        let fr=f[0],best=-1;for(const j of f){const r=rot(j%N+.5,Math.floor(j/N)+.5);if(r[0]+r[1]>best){best=r[0]+r[1];fr=j}}
        if(i!==fr)continue;const ax=a%N,ay=Math.floor(a/N);
        if(at.b>0){ctx.globalAlpha=1;buildAnim(at,ax,ay,a,dm)}
        else{{const bo=bounceOf(a);if(bo)lifted(bo,()=>drawSprN(at,ax,ay,a,dm,HEAT?.16:fade(at,ax,ay,dm)));else drawSprN(at,ax,ay,a,dm,HEAT?.16:fade(at,ax,ay,dm))}ctx.globalAlpha=1;if(FLASH.size&&!HEAT){const bo=bounceOf(a);if(bo)lifted(bo,()=>flashDraw(at,ax,ay,a,dm));else flashDraw(at,ax,ay,a,dm)}if(!at.ok&&!REAL)drawNeed(ax,ay)}
        continue}
      if(htf&&i===hover){if(pass)continue;const g={k:tool,s:1,o:htf.o};drawSprN(g,x,y,i,[htf.w,htf.h],.7,true);ctx.globalAlpha=1;continue}
      if(!pass)continue;
      const hsz=MULTI(tool)?2:1;
      if(i===hover&&tool!=='demoler'&&tool!=='mejorar'&&tool!=='ver'&&hsz===1&&canBuild(t)){const dd=DEFS[tool],g={k:tool,s:t.s,f:dd.f0};drawSprN(g,x,y,i,1,.7,true);ctx.globalAlpha=1}
      else if(t.b>0)buildAnim(t,x,y,i,[1,1]);
      else{if(hasObj(t,x,y)){const bo=bounceOf(i);if(bo)lifted(bo,()=>drawSprN(t,x,y,i,1,HEAT?.16:fade(t,x,y)));else drawSprN(t,x,y,i,1,HEAT?.16:fade(t,x,y))}ctx.globalAlpha=1;if(FLASH.size&&!HEAT&&hasObj(t,x,y)){const bo=bounceOf(i);if(bo)lifted(bo,()=>flashDraw(t,x,y,i,1));else flashDraw(t,x,y,i,1)}drawDyn(t,x,y);if(DEFS[t.k]&&!t.ok&&!REAL)drawNeed(x,y)}}
    for(const w of buckets[d]){const q=w.car?P(w.fx,w.fy):P(w.X,w.Y);if(q[0]<-40||q[0]>bw+40||q[1]<-6||q[1]-40>bh)continue;w.car?drawCar(w):drawWalker(w)}
  }
  if(hover>=0&&!HEAT&&!TITLE){const hx=hover%N,hy=Math.floor(hover/N),[hw,hh]=tool==='demoler'||!MULTI(tool)?[1,1]:htf?[htf.w,htf.h]:DIM(tool,0),pts=[P(hx,hy),P(hx+hw,hy),P(hx+hw,hy+hh),P(hx,hy+hh)];
    ctx.save();ctx.beginPath();pts.forEach((q,k)=>k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();
    ctx.fillStyle='rgba(255,255,255,.1)';ctx.fill();ctx.lineJoin='round';ctx.strokeStyle=OPT.hc?'rgba(20,24,40,.9)':'rgba(20,24,40,.55)';ctx.lineWidth=OPT.hc?2.6:1.6;ctx.stroke();ctx.strokeStyle='rgba(255,255,255,.95)';ctx.lineWidth=OPT.hc?1.1:.7;ctx.stroke();ctx.restore()}
  // hora dorada: una luz cálida muy suave al amanecer y al atardecer
  {const gh=Math.max(0,1-Math.abs(ph-.46)/.07),gm=Math.max(0,1-Math.min(Math.abs(ph-.985),Math.abs(ph+.015))/.04),a=.09*Math.max(gh,gm*.7);if(a>.004){ctx.fillStyle=`rgba(255,160,80,${a.toFixed(3)})`;ctx.fillRect(0,0,bw,bh)}}
  for(const [a,b] of SMOKEQ)chimSmoke(a,b);SMOKEQ=[];
  drawWeather(ph);drawCoins();priceTag();placeTag();
  drawFireworks();if(TL)tlHud();seasonStep();
}
// clima: sombras de nubes que pasan de día; tormenta con gotas, charcos y ondas
let DROPS=null,WXA=0,CLOUD_IMG=null;
function drawWeather(ph){
  const rain=S.ev&&S.ev.id==='lluvia'&&!TITLE,ev=rain?EVENTS.find(e=>e.id==='lluvia'):null;
  const target=rain?Math.min(1,(ev.dur-S.ev.t)/8,S.ev.t/8):0;WXA+=(target-WXA)*.05;if(WXA<.003)WXA=0;
  if(!lowMo()&&!OPT.low&&NIGHT<.5){if(!CLOUD_IMG){CLOUD_IMG=document.createElement('canvas');CLOUD_IMG.width=CLOUD_IMG.height=64;const x=CLOUD_IMG.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(16,24,48,1)');g.addColorStop(1,'rgba(16,24,48,0)');x.fillStyle=g;x.fillRect(0,0,64,64)}
    const a=(1-NIGHT*2)*(.07+.1*WXA);ctx.globalAlpha=a;for(let k=0;k<3;k++){const cx=((T*5+k*330)%(bw+420))-210,cy=bh*(.25+.25*k),r=160+40*k;ctx.drawImage(CLOUD_IMG,cx-r,cy-r*.6,r*2,r*1.2)}ctx.globalAlpha=1}
  if(!WXA){BOLT=null;return}
  weatherStep();
  ctx.fillStyle=`rgba(46,58,88,${(.2*WXA).toFixed(3)})`;ctx.fillRect(0,0,bw,bh);rainGlints();
  if(!OPT.low){for(let k=0;k<streets.length;k+=2){const [x,y]=streets[k],[sx,sy]=P(x+.5,y+.5);if(sx<-10||sx>bw+10||sy<-10||sy>bh+10)continue;ctx.fillStyle=`rgba(190,210,235,${(.22*WXA).toFixed(3)})`;ctx.fillRect(Math.round(sx-6),Math.round(sy-1),9,1);ctx.fillRect(Math.round(sx-3),Math.round(sy+1),5,1);
    if(!lowMo()){const p2=(T*1.3+k*.37)%1;if(p2<.5){const r=1+p2*8;ctx.strokeStyle=`rgba(220,235,255,${((.5-p2)*1.1*WXA).toFixed(3)})`;ctx.lineWidth=.5;ctx.beginPath();ctx.ellipse(sx+((k*7)%9)-4,sy+((k*5)%5)-2,r,r/2,0,0,Math.PI*2);ctx.stroke()}}}}
  const nd=Math.round((OPT.low?90:240)*WXA);if(!DROPS){DROPS=[];for(let k=0;k<240;k++)DROPS.push([Math.random(),Math.random(),.7+Math.random()*.6])}
  ctx.strokeStyle=`rgba(205,220,245,${(.55*WXA).toFixed(3)})`;ctx.lineWidth=.6;ctx.beginPath();const sp=lowMo()?.25:1;
  for(let k=0;k<nd;k++){const d=DROPS[k],y=((d[1]*(bh+20)+T*260*d[2]*sp)%(bh+20))-10,x=((d[0]*bw-T*40*d[2]*sp)%bw+bw)%bw;ctx.moveTo(x,y);ctx.lineTo(x-2.5,y+8)}ctx.stroke();boltFlash()}
// monedas: cada negocio suelta, cada tantos segundos, lo que de verdad ganó en ese rato
let COINS=[],COINT=0;const COINACC=new Map();
function drawCoins(){
  const dt=Math.min(.1,Math.max(0,T-COINT));COINT=T;if(TITLE||HEAT||REAL)return;
  if(!S.paused&&EARN.size&&stats.inc>0){const ratio=Math.min(1,(stats.biz||0)/stats.inc),iv=OPT.low?14:6;
    for(const a of EARN.values()){const t=S.g[a.i];if(!t||t.b>0||t.lu>0)continue;let acc=COINACC.has(a.i)?COINACC.get(a.i):Math.random()*iv;acc-=dt;
      if(acc<=0){acc=iv*(.8+Math.random()*.4);const v=Math.round(a.earn*ratio*iv);if(v>=1&&COINS.length<40)COINS.push({i:a.i,v,t:0})}COINACC.set(a.i,acc)}}
  if(!COINS.length)return;ctx.save();ctx.font=`${(15/zoom).toFixed(2)}px VT323, monospace`;ctx.textAlign='center';ctx.textBaseline='alphabetic';
  for(const c of COINS){c.t+=dt;const t=S.g[c.i];const [sw,sh]=t?DIMT(t):[1,1],[x,y]=P(c.i%N+sw/2,Math.floor(c.i/N)+sh/2),so=t?shadowOf(t):null,h=Math.min(40,(so?so[1]:10))+6;
    const k=c.t/2.2,a=k<.15?k/.15:Math.max(0,1-(k-.5)/.5),yy=y-h-(lowMo()?0:k*12);ctx.globalAlpha=a;
    const tx=`+$${c.v}`,w=ctx.measureText(tx).width,cx=Math.round(x+3/zoom);
    ctx.fillStyle='#1f2540';ctx.fillRect(Math.round(cx-w/2-5),Math.round(yy-4),4,4);ctx.fillStyle='#ffd84d';ctx.fillRect(Math.round(cx-w/2-4.5),Math.round(yy-3.5),3,3);ctx.fillStyle='#c9a227';ctx.fillRect(Math.round(cx-w/2-3.5),Math.round(yy-2.5),1,1);
    ctx.fillStyle='#1f2540';ctx.fillText(tx,cx+.5,yy+.5);ctx.fillStyle='#ffe066';ctx.fillText(tx,cx,yy)}
  ctx.restore();COINS=COINS.filter(c=>c.t<2.2)}
// etiqueta con el precio de la mejora del edificio bajo el cursor (piso, nivel o torre)
function priceTag(){TAGW=null;
  if(hover<0||TITLE||HEAT)return;let i=hover,t=S.g[i];if(t.k==='part'){i=t.a;t=S.g[i]}
  if(tool==='ver'){const q=whatShort(i),[sw,sh]=DIMT(t),[x,y]=P(i%N+sw/2,Math.floor(i/N)+sh/2),so=DEFS[t.k]?shadowOf(t):null,h=(so?so[1]:4)+6;TAGW={x:x*zoom,y:Math.max(30,(y-h)*zoom),l1:q[0],l2:q[1],cls:'na'};return}
  const d=DEFS[t.k];if(!d)return;
  let l1=null,c=0,note='';
  if(tool===t.k&&d.fmax&&!(t.b>0)&&!(t.ub>0)&&!(t.ct>0)){if(t.f>=fmaxT(t)){l1=`Máximo: ${t.f} pisos`}else{l1=`Subir a ${t.f+1} pisos`;c=upCost(t);note=`+${d.per} vecinos`}}
  else if(tool==='mejorar'&&LV[t.k]&&!(t.b>0)&&!(t.lu>0)){const L=lvOf(t);if(L>=4)l1='Nivel máximo';else{l1=lvName(t,L+1);c=lvCost(t,i);const v=stats.VAL?stats.VAL[i]:0;if(v<LVTH[L+1])note=`falta plusvalía ${Math.round(LVTH[L+1]*100)}`;else note=lvBenefit(t)}}
  else if(tool==='torre'&&canConv(t)){l1='Convertir en Torre';c=convCost(t)}
  if(!l1)return;
  const [sw,sh]=DIMT(t),[x,y]=P(i%N+sw/2,Math.floor(i/N)+sh/2),so=shadowOf(t),h=(so?so[1]:20)+(d.per?3:6);
  const can=c>0&&S.$>=c&&!note.startsWith('falta'),l2=c?`$${c.toLocaleString('es-MX')}${note?' · '+note:''}`:note;
  TAGW={x:x*zoom,y:Math.max(30,(y-h)*zoom),l1,l2,cls:c?(can?'ok':'no'):'na'}}
let TAGW=null,TAGK='';
/* la manita: qué es cada cosa, en corto (etiqueta) y en largo (mensaje al tocar) */
function whatName(t){if(t.k==='calle')return t.pu?(t.hw?'Puente de la avenida':'Puente'):t.hw?'Avenida':'Calle';if(t.k==='rio')return 'Río';if(t.k==='ajeno')return t.p&&PARCELS[t.p]?PARCELS[t.p].name:'Terreno vecino';if(t.k==='lote')return 'Terreno libre';if(t.k==='arbol')return 'Árbol';
  if(t.k==='fabrica')return t.p&&PARCELS[t.p]?PARCELS[t.p].name:'DeAcero';return nameOf(t)}
function whatShort(i){const t=S.g[i],d=DEFS[t.k],n=whatName(t);
  if(t.b>0||t.ct>0||t.ub>0||t.lu>0)return [n,'en obra'];
  if(t.k==='rio'){const f=rioFase();return [n,f==='crecida'?'¡crecido!':f==='lluvias'?'con agua (temporada de lluvias)':'casi seco: el lecho se puede usar']}
  if(t.dmg)return [n,'dañado por la crecida: repáralo con Mejorar'];if(t.lecho&&rioWet())return [n,'bajo el agua: vuelve cuando baje el río'];
  if(isParcel(t)&&PARCELS[t.p])return [n,S.maxV<PARCELS[t.p].unlock?`a la venta con ${fmt(PARCELS[t.p].unlock)} vecinos`:`se vende: $${fmt(lotPrice(t.p))}`];
  if(t.k==='lote')return [n,'aquí se puede construir'];if(t.k==='lotedomo')return [n,`aquí va ${DEFS.domo.name}`];if(t.k==='calle')return [n,t.hw?'no es del Distrito':'lleva gente y servicios'];
  if(t.k==='fabrica')return [n,S.da?'ya no baja la plusvalía':'baja la plusvalía cerca'];if(t.k==='arbol')return [n,'en terreno libre'];if(t.k==='ajeno')return [n,''];
  if(d&&d.per)return [n,`${t.f} pisos · caben ${(t.f*d.per).toLocaleString('es-MX')} vecinos`];
  if(d&&d.obra)return [n,obraShort(t)];
  const e=EARN.get(i);if(e){const cu=Math.round(e.cust||0);return [n,`gana $${e.earn.toFixed(e.earn<10?1:0)}/s · ${cu} ${cu===1?'cliente':'clientes'} cerca`]}
  if(t.k==='tanque'||t.k==='torreagua')return [n,`agua para ${fmt(stats.wcap||1000)} vecinos`];
  const L=LV[t.k]?lvOf(t):0;if(L)return [n,`nivel ${L} de 4`];if(d&&d.trophy)return [n,'trofeo'];
  const f=(infoOf(t.k)||'').split('.')[0];return [n,f.length&&f.length<46?f[0].toLowerCase()+f.slice(1):'']}
function whatIs(i){let t=S.g[i];if(t.k==='part'){i=t.a;t=S.g[i]}const [n,l2]=whatShort(i),d=DEFS[t.k];
  if(t.b>0)return `${n}: en obra, faltan ${Math.ceil(t.b)} segundos.`;
  if(isParcel(t)&&PARCELS[t.p]){const P_=PARCELS[t.p];return `${P_.name}, ${P_.where}. ${S.maxV<P_.unlock?`Se pone a la venta con ${fmt(P_.unlock)} vecinos.`:`Cuesta $${fmt(lotPrice(t.p))}: elige otra herramienta y tócalo dos veces para comprarlo.`}`}
  if(t.k==='ajeno')return 'Terreno vecino: no es del Distrito y no se puede construir.';
  if(t.k==='lote'||t.k==='arbol'){const r=tileInfo(i).split(' · ').slice(1).join(' · ');return `${t.k==='arbol'?'Árbol en terreno libre':n}. ${connected(i%N,Math.floor(i/N))?'Tiene calle cerca: aquí se puede construir.':'Todavía no le llega una calle; pon una junto para poder construir.'} ${r[0].toUpperCase()+r.slice(1)}`}
  if(t.k==='rio')return `Río: ${whatShort(i)[1]}. Se cruza con puentes (herramienta Calle, $${fmt(Math.max(PUENTE_MIN,costOf('calle')*80))}). Cuando está seco se pueden poner parques, canchas, dog parks y palmas en el lecho, pero en la temporada de lluvias quedan bajo el agua y una crecida los daña.`;
  if(t.k==='lotedomo')return `${DEFS.lotedomo.name}: aquí va ${DEFS.domo.name}, que se desbloquea con ${DEFS.domo.unlock} vecinos y cuesta $${fmt(costOf('domo'))}.`;
  if(t.k==='calle')return t.hw?'Avenida: no es del Distrito. Hace ruido a 2 cuadras.':'Calle: conecta los edificios y por aquí caminan los vecinos.';
  if(t.k==='fabrica')return S.da?'DeAcero: desde que compraste su terreno ya no baja la plusvalía.':'DeAcero: la planta de acero. Baja la plusvalía a 3 cuadras; si compras el Terreno DeAcero deja de hacerlo.';
  let txt=tileInfo(i);if(l2&&!/^nivel/.test(l2))txt=txt.replace(nameOf(t),`${nameOf(t)} (${l2})`);if(d&&d.trophy)txt+=' Es un trofeo.';return txt}
// el dibujo de la manita: sirve para el ícono y para el cursor
const HAND=['     ##','    #WW#','    #WW#','    #WW#','    #WW###','    #WW#WW###','    #WW#WW#WW##',' ## #WW#WW#WW#W#','#WW##WWWWWWWW#W#','#WWW#WWWWWWWWWW#',' #WWWWWWWWWWWWW#','  #WWWWWWWWWWWW#','  #WWWWWWWWWWS#','   #WWWWWWWWWS#','    #WWWWWWWS#','    #SSSSSSSS#','    ##########'];
function handPx(c,x0,y0,s){HAND.forEach((r,y)=>{for(let x=0;x<r.length;x++){const ch=r[x];if(ch===' ')continue;c.fillStyle=ch==='#'?'#1f2540':ch==='S'?'#d6dbea':'#ffffff';c.fillRect(x0+x*s,y0+y*s,s,s)}})}
let HANDCUR=null;function handCursor(){if(HANDCUR)return HANDCUR;try{const c=document.createElement('canvas');c.width=32;c.height=34;handPx(c.getContext('2d'),0,0,2);HANDCUR=`url(${c.toDataURL()}) 11 1, pointer`}catch(e){HANDCUR='pointer'}return HANDCUR}
function setCursor(){const cv2=document.getElementById('cv');if(cv2)cv2.style.cursor=tool==='ver'?handCursor():''}
function placeTag(){const el=document.getElementById('ptag');if(!el)return;if(!TAGW){if(!el.hidden)el.hidden=true;TAGK='';return}
  const k=TAGW.l1+'|'+TAGW.l2+'|'+TAGW.cls;if(k!==TAGK){TAGK=k;el.className='box '+TAGW.cls;el.innerHTML=`<b></b><span></span>`;el.firstChild.textContent=TAGW.l1;el.lastChild.textContent=TAGW.l2||''}
  el.hidden=false;el.style.transform=`translate(${Math.round(TAGW.x)}px,${Math.round(TAGW.y)}px) translate(-50%,-100%)`}

/* los transeúntes viven en transeuntes.js (cómo se ven) y vida.js (a dónde van) */

