/* ---------- juice (v64): obra piso por piso, destello y confeti, momentos de cámara, zoom suave e inercia ---------- */
// destello: la imagen del edificio se vuelve a pintar encima en modo «luz» y se apaga en unas décimas
const FLASH=new Map();
function flashAt(i,dur=.6){FLASH.set(i,{t:T,d:dur})}
function flashOf(i){const f=FLASH.get(i);if(!f)return 0;const p=(T-f.t)/f.d;if(p>=1||p<0){FLASH.delete(i);return 0}return (1-p)*(1-p)}
function flashDraw(t,gx,gy,i,sz){const f=flashOf(i);if(!f)return;const s=getSprite(t,gx,gy,i,NLO);if(!s)return;
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=f*(lowMo()?.35:.7);drawSprite(s,gx,gy,sz,true,0);ctx.restore()}
// confeti: papelitos de colores que salen del techo, caen meciéndose y giran
const CONF_C=['#f26a21','#ffd84d','#ff5d8f','#3fa7d6','#59cd90','#ffffff','#9b5de5'];
function confetti(i,n){const t=S.g[i];if(!t)return;const [dw,dh]=DIMT(t),[x,y]=P(i%N+dw/2,Math.floor(i/N)+dh/2),so=DEFS[t.k]?shadowOf(t):null,top=y-(so?so[1]:20)-6;
  n=Math.round(n*(lowMo()?.3:lowQ()?.5:1));
  for(let k=0;k<n;k++){const an=-Math.PI/2+(Math.random()-.5)*2.4,sp=24+Math.random()*34;FW.push({x:x+(Math.random()-.5)*8*dw,y:top,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1.8+Math.random()*1.4,c:CONF_C[k%CONF_C.length],cf:1,ph:Math.random()*6.3})}}

// obra en construcción: cimientos, luego la imagen terminada sube piso por piso con andamio, malla y columnas; al final se quita el andamio
function scaffBand(A,B,h0,h1,FH){const pole='#7d808a',plank='#c08a4a';if(h1<=h0)return;
  for(let k=0;k<=3;k++){const f=k/3,x=Math.round(A[0]+(B[0]-A[0])*f),y=A[1]+(B[1]-A[1])*f+1;px(x,y-h1,1,h1-h0,pole)}
  for(let v=h0+FH;v<=h1+.5;v+=FH)line(A[0],A[1]-v+1,B[0],B[1]-v+1,plank)}
function footCorners(gx,gy,dw,dh,ins=0){const C=[P(gx+ins,gy+ins),P(gx+dw-ins,gy+ins),P(gx+dw-ins,gy+dh-ins),P(gx+ins,gy+dh-ins)];let L=C[0],R=C[0],Bk=C[0],F=C[0];
  for(const c of C){if(c[0]<L[0])L=c;if(c[0]>R[0])R=c;if(c[1]<Bk[1])Bk=c;if(c[1]>F[1])F=c}return {C,L,R,Bk,F}}
function buildAnim(t,gx,gy,i,dm){const d=DEFS[t.k];if(!d)return;const [dw,dh]=dm,bt=t.bt||d.bt||1;
  if(bt<4){drawObj(t,gx,gy);return}
  const p=Math.max(0,Math.min(1,1-t.b/bt)),fin=Object.assign({},t,{b:0}),so=shadowOf(fin);
  const H=Math.max(8,d.per?(t.f||d.f0)*(t.k==='torre'?6:7)+3:so?so[1]:Math.min(40,(SPH[t.k]||64)*.3));
  const FH=d.per?(t.k==='torre'?6:7):H>40?8:H>18?6:Math.max(4,H/2),nF=Math.max(1,Math.round(H/FH));
  const q=p<.14?0:Math.min(1,(p-.14)/.8),fl=Math.min(nF,Math.floor(q*nF+1e-6)),fr=Math.min(1,q*nF-fl),h=fl>=nF?H:fl*FH;
  // la huella de la estructura que sube: la de la sombra (en el rascacielos, solo la torre); lo bajo y ancho (estadio, bosque, plaza) sube sin losa
  const ins=so?so[0]:.1,ex=so&&so[2]!=null?so[2]:1-ins,tall=d.per||H>=36||(dw===1&&dh===1&&H>=14);
  const K=footCorners(gx+ins,gy+ins,dw-1+ex-ins,dh-1+ex-ins),up=(c,v)=>[c[0],c[1]-v];
  if(fl===0){const k=footCorners(gx,gy,dw,dh,.08);poly(k.C,'#7a5c3e');const r=rng((t.s||1)*31+7+i),n=Math.round(5*dw*dh*Math.min(1,p/.14+.2));
    for(let k2=0;k2<n;k2++){const [x,y]=P(gx+.18+r()*(dw-.36),gy+.18+r()*(dh-.36));px(x,y-3,1,3,'#8a8f98')}}
  else{const s=getSprite(fin,gx,gy,i,NLO),{L,R,Bk,F}=footCorners(gx,gy,dw,dh);
    if(s){ctx.save();if(fl<nF){const a=up(L,h),b=up(Bk,h),c=up(R,h);ctx.beginPath();ctx.moveTo(a[0]-60,a[1]);ctx.lineTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.lineTo(c[0],c[1]);ctx.lineTo(c[0]+60,c[1]);ctx.lineTo(c[0]+60,F[1]+80);ctx.lineTo(a[0]-60,F[1]+80);ctx.closePath();ctx.clip()}
      drawSprite(s,gx,gy,[dw,dh],true,0);ctx.restore()}
    if(fl<nF&&tall)poly(K.C.map(c=>up(c,h)),'#b8b2a6')}
  if(fl<nF&&fl+fr>0&&tall){const ch=Math.max(1,FH*fr);for(const c of K.C){if(c===K.Bk)continue;px(c[0]-.5,c[1]-h-ch,1,ch,'#9c968b')}
    const top=h+FH+1;scaffBand(K.L,K.F,0,top,FH);scaffBand(K.F,K.R,0,top,FH);
    ctx.globalAlpha=.32;poly([up(K.L,h),up(K.F,h),up(K.F,top),up(K.L,top)],'#3f8f4a');poly([up(K.F,h),up(K.R,h),up(K.R,top),up(K.F,top)],'#357a3f');ctx.globalAlpha=1}
  else if(fl<nF&&fl+fr>0){const {L,R,F}=footCorners(gx,gy,dw,dh,.04),top=h+3;scaffBand(L,F,0,top,Math.max(3,top/2));scaffBand(F,R,0,top,Math.max(3,top/2))}
  if(d.bt>=20||dw>1)crane(gx+dw-1,gy,H+10)}

/* momentos: al terminar La Cúpula o una obra grande la cámara viaja hacia ella, sale una cortinilla de cine y (en La Cúpula) el tiempo va en cámara lenta */
let CINE=null,TS=1,CAMG=null,INER=null,ZA=null;
const MOMSUB={beis:'Ya hay estadio: cada 8 minutos hay juego.',museo:'El Museo del Cañón abre sus puertas.',rasca:'El edificio más alto del Distrito ya se ve desde la sierra.',bosque:'Sombra y aire fresco para todo el Distrito.',plazacom:'Abrió la Plaza comercial: todo el Distrito va de compras.',metro:'Llegó el Metro: menos coches y más vecinos.'};
function camGlide(x1,y1,dur){if(lowMo())return;CAMG={x0:panX,y0:panY,x1,y1,t:0,dur}}
function camTo(i,dur,dy){const t=S.g[i],[dw,dh]=DIMT(t),[a,b]=rot(i%N+dw/2,Math.floor(i/N)+dh/2),so=shadowOf(t),hh=so?so[1]:30;
  const x1=-(a-b)*TW/2*zoom,y1=(N*TH/2-30-(a+b)*TH/2+hh*.45)*zoom+(dy||0);camGlide(x1,y1,dur)}
function momento(i){const t=S.g[i];if(TITLE||!t||!DEFS[t.k])return;const dom=t.k==='domo',el=$('cine');
  camTo(i,1.4);flashAt(i,1.6);confetti(i,dom?90:60);celebrate(dom?6:4);sfx('phase');
  CINE={t:0,dur:dom?5.4:4.2,slow:dom&&!lowMo()};
  if(el){el.querySelector('b').textContent=dom?(DIST==='ribera'?'¡EL PUENTE ATIRANTADO ESTÁ LISTO!':'¡LA CÚPULA ESTÁ LISTA!'):`¡${DEFS[t.k].name.toUpperCase()}!`;el.querySelector('small').textContent=dom?(DIST==='ribera'?'El pilón blanco ya cruza el río: la Ribera tiene su emblema.':'El arco naranja ya es parte del cielo de Santa Catarina.'):MOMSUB[t.k]||'';
    el.hidden=false;void el.offsetWidth;el.classList.add('on')}}
// cámara: viaje suave, inercia al soltar el arrastre, cámara lenta y zoom animado; corre con el tiempo real (no se frena en pausa)
function camStep(rdt){
  if(CAMG){CAMG.t+=rdt;const p=Math.min(1,CAMG.t/CAMG.dur),e=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2;panX=CAMG.x0+(CAMG.x1-CAMG.x0)*e;panY=CAMG.y0+(CAMG.y1-CAMG.y0)*e;clampPan();if(p>=1)CAMG=null}
  if(INER&&!down){panX+=INER.vx*rdt;panY+=INER.vy*rdt;const px0=panX,py0=panY;clampPan();if(px0!==panX||py0!==panY){INER.vx*=.5;INER.vy*=.5}const k=Math.exp(-rdt*4.2);INER.vx*=k;INER.vy*=k;if(Math.hypot(INER.vx,INER.vy)<6)INER=null}
  let tgt=1;if(CINE){CINE.t+=rdt;if(CINE.slow&&CINE.t>.3&&CINE.t<2.8)tgt=.3;
    if(CINE.t>=CINE.dur){CINE=null;const el=$('cine');if(el){el.classList.remove('on');setTimeout(()=>{if(!CINE)el.hidden=true},600)}}}
  TS+=(tgt-TS)*Math.min(1,rdt*5);if(Math.abs(TS-1)<.01)TS=1;
  zoomStep(performance.now())}
// zoom suave: los niveles siguen siendo enteros (pixel art nítido), pero el cambio se anima con una escala CSS sobre el punto que se toca.
// al acercar se agranda la imagen vieja y al final se cambia; al alejar se cambia primero y la nueva se encoge desde grande: nunca se ven orillas vacías
function zoomAt(z,cx,cy){z=Math.max(1,Math.min(5,z));if(z===zoom||ZA)return;const r=cv.getBoundingClientRect();if(cx==null){cx=r.width/2;cy=r.height/2}
  const z1=zoom,dx=cx-r.width/2,dy=cy-r.height/2;CAMG=null;
  const apply=()=>{const u=panX/z1,v=panY/z1;zoom=z;panX=(dx/z-dx/z1+u)*z;panY=(dy/z-dy/z1+v)*z;resize();clampPan()};
  if(lowMo()){apply();return}
  if(z>z1)ZA={t0:performance.now(),dur:170,from:1,to:z/z1,ox:cx,oy:cy,end:apply};
  else{apply();ZA={t0:performance.now(),dur:170,from:z1/z,to:1,ox:cx,oy:cy,end:null}}
  zoomStep(performance.now())}
function zoomStep(now){if(!ZA)return;const p=Math.min(1,(now-ZA.t0)/ZA.dur),e=1-Math.pow(1-p,3),s=ZA.from+(ZA.to-ZA.from)*e;
  cv.style.transformOrigin=`${ZA.ox}px ${ZA.oy}px`;cv.style.transform=`scale(${s.toFixed(4)})`;
  if(p>=1){const f=ZA.end;ZA=null;if(f)f();cv.style.transform=''}}
function sparkle(i){const [x,y]=P(i%N+.5,Math.floor(i/N)+.5);for(let k=0;k<22;k++){const an=k/22*Math.PI*2,sp=10+Math.random()*16;FW.push({x,y:y-14,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp-12,l:.9+Math.random()*.4,c:k%2?'#ffd84d':'#ffffff'})}}
function drawFireworks(){
  const dt=Math.min(.05,T-FWlast);FWlast=T;
  // noche del Grito: cohetes verde, blanco y rojo de vez en cuando
  // año nuevo: cohetes de todos colores
  if(ANYO()&&NIGHT>.7&&!TITLE&&!lowMo()&&Math.random()<dt*.45){const cx=bw*(.1+Math.random()*.8),cy=bh*(.06+Math.random()*.3),col=CONF_C[Math.floor(Math.random()*CONF_C.length)],np=lowQ()?14:30;
    for(let k=0;k<np;k++){const an=k/np*Math.PI*2,sp=18+Math.random()*24;FW.push({x:cx,y:cy,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1.2+Math.random()*.5,c:col})}}
  // el Grito: los cohetes salen sobre La Cúpula
  if(GRITO_XY&&!TITLE&&!lowMo()&&Math.random()<dt*2.2){const cx=GRITO_XY[0]+(Math.random()-.5)*90,cy=GRITO_XY[1]-20-Math.random()*60,col=['#1f8a4c','#ffffff','#d62828'][Math.floor(Math.random()*3)],np=lowQ()?16:36;
    for(let k=0;k<np;k++){const an=k/np*Math.PI*2,sp=22+Math.random()*28;FW.push({x:cx,y:cy,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1.4+Math.random()*.6,c:col})}}
  if(SEASON_C==='patrias'&&NIGHT>.7&&!TITLE&&!lowMo()&&Math.random()<dt*(GRITO()?.5:.08)){const cx=bw*(.15+Math.random()*.7),cy=bh*(.08+Math.random()*.25),col=['#1f8a4c','#ffffff','#d62828'][Math.floor(Math.random()*3)],np=lowQ()?14:28;
    for(let k=0;k<np;k++){const an=k/np*Math.PI*2,sp=20+Math.random()*22;FW.push({x:cx,y:cy,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1.2+Math.random()*.5,c:col})}}
  if(FWQ>0){FWQ-=dt;if(Math.random()<dt*2.2){const cx=bw*(.15+Math.random()*.7),cy=bh*(.1+Math.random()*.3),col=['#f26a21','#ffd84d','#ff5d8f','#3fa7d6','#59cd90','#ffffff'][Math.floor(Math.random()*6)];
    const np=lowMo()?10:lowQ()?16:34;for(let k=0;k<np;k++){const an=k/np*Math.PI*2,sp=22+Math.random()*26;FW.push({x:cx,y:cy,vx:Math.cos(an)*sp,vy:Math.sin(an)*sp,l:1.3+Math.random()*.5,c:col})}}}
  FW=FW.filter(p=>(p.l-=dt)>0);
  for(const p of FW){if(p.cf){p.vy=Math.min(16,p.vy+26*dt);p.vx*=.96;p.x+=(p.vx+Math.sin(T*6+p.ph)*9)*dt;p.y+=p.vy*dt;ctx.globalAlpha=Math.min(1,p.l*1.5);ctx.fillStyle=p.c;const w=Math.sin(T*9+p.ph)>0;ctx.fillRect(Math.round(p.x),Math.round(p.y),w?2:1,w?1:2);continue}p.vy+=(p.dust?4:30)*dt;p.vx*=.985;p.x+=p.vx*dt;p.y+=p.vy*dt;ctx.globalAlpha=Math.min(1,p.l);ctx.fillStyle=p.c;ctx.fillRect(Math.round(p.x),Math.round(p.y),p.l>.6?2:1,p.l>.6?2:1)}
  ctx.globalAlpha=1;
}
function showCredits(){
  const box=document.getElementById('credits'),m=Math.max(1,Math.round((S.winT||S.playT||0)/60)),h=Math.floor(m/60),tm=h?`${h} h ${m%60} min`:`${m} min`;
  box.innerHTML=`<h2>¡${DNAME.toUpperCase()} COMPLETO!</h2><p>${S.name?'¡Felicidades, '+S.name+'! ':''}3,000 vecinos viven en el Distrito, y ya es el corazón de Santa Catarina.</p>
    <p class="ctime">Lo lograste en <b>${tm}</b> de juego</p>
    <p><b>${Math.round(S.maxV).toLocaleString('es-MX')}</b> vecinos · <b>${S.lots||0}</b> terrenos comprados</p>
    <p class="cr">${S.name?'Jugó: '+S.name+' · ':''}Idea y dirección: Mauricio · Programación, pixel art y jazz: Claude</p><div class="cbtns"><button id="crtl" type="button">▶ Ver cómo creció</button>${DIST==='domo'?'<button id="crrib" type="button">Ir al Distrito Ribera</button>':''}<button id="crok" type="button">Seguir jugando</button></div>`;
  box.hidden=false;document.getElementById('crok').onclick=()=>{box.hidden=true};document.getElementById('crtl').onclick=()=>{box.hidden=true;tlStart({})};{const b=document.getElementById('crrib');if(b)b.onclick=()=>{try{localStorage.setItem('distritoDomo.riberaUnl','1')}catch(e){}goDist('ribera')}}
}
