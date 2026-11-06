/* puntero: tocar construye, arrastrar mueve el mapa */
let down=null;
function tileAt(e){
  const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)/zoom,my=(e.clientY-r.top)/zoom;
  const a=(mx-cam.ox)/(TW/2),b=(my-cam.oy)/(TH/2),w=rot((a+b)/2,(b-a)/2,(4-ROT)%4),x=Math.floor(w[0]),y=Math.floor(w[1]);
  return inb(x,y)?idx(x,y):-1;
}
const PTRS=new Map();let PINCH=null,wAcc=0,wLast=0;
cv.addEventListener('pointerdown',e=>{CAMG=null;INER=null;if(PASEO){PASEO=null;fotoSync()}PTRS.set(e.pointerId,{x:e.clientX,y:e.clientY});try{cv.setPointerCapture(e.pointerId)}catch(er){}
  if(PTRS.size>=2){const [p,q]=[...PTRS.values()];PINCH={d:Math.hypot(p.x-q.x,p.y-q.y)||1};down=null;hover=-1;return}
  down={x:e.clientX,y:e.clientY,px:panX,py:panY,drag:false,lt:performance.now(),lx:panX,ly:panY,vx:0,vy:0};hover=tileAt(e)});
cv.addEventListener('pointermove',e=>{if(PTRS.has(e.pointerId))PTRS.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(PINCH){if(PTRS.size>=2){const [p,q]=[...PTRS.values()],d=Math.hypot(p.x-q.x,p.y-q.y)||1,r=cv.getBoundingClientRect(),mx=(p.x+q.x)/2-r.left,my=(p.y+q.y)/2-r.top;
    if(!ZA&&d/PINCH.d>1.35){zoomAt(zoom+1,mx,my);PINCH.d=d}else if(!ZA&&d/PINCH.d<.74){zoomAt(zoom-1,mx,my);PINCH.d=d}}return}
  if(down){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(Math.hypot(dx,dy)>7)down.drag=true;
    if(down.drag){if(FOLLOW){FOLLOW=null;if(VOZ)vozSync()}panX=down.px+dx;panY=down.py+dy;clampPan();hover=-1;const now=performance.now();if(now-down.lt>12){const s=(now-down.lt)/1000,vx=(panX-down.lx)/s,vy=(panY-down.ly)/s;down.vx=down.vx*.35+vx*.65;down.vy=down.vy*.35+vy*.65;down.lt=now;down.lx=panX;down.ly=panY}return}}
  hover=tileAt(e)});
cv.addEventListener('pointerup',e=>{PTRS.delete(e.pointerId);if(PINCH){if(PTRS.size<2)PINCH=null;down=null;if(e.pointerType!=='mouse')hover=-1;return}
  if(down&&!down.drag){const i=tileAt(e),w=walkerAt(e,i);if(w)vozOpen(w);else if(i>=0&&!REAL)act(i)}
  else if(down&&down.drag&&!lowMo()&&performance.now()-down.lt<100){const sp=Math.hypot(down.vx,down.vy);if(sp>90){const k=Math.min(1,1600/sp);INER={vx:down.vx*k,vy:down.vy*k}}}
  down=null;if(e.pointerType!=='mouse')hover=-1});
cv.addEventListener('pointercancel',e=>{PTRS.delete(e.pointerId);if(PTRS.size<2)PINCH=null;down=null});
cv.addEventListener('pointerleave',()=>{if(!down)hover=-1});
cv.addEventListener('wheel',e=>{e.preventDefault();const now=performance.now();if(now-wLast>250)wAcc=0;wLast=now;wAcc+=e.deltaMode===1?e.deltaY*33:e.deltaMode===2?e.deltaY*400:e.deltaY;
  if(Math.abs(wAcc)>=60&&!ZA){const r=cv.getBoundingClientRect();zoomAt(zoom+(wAcc<0?1:-1),e.clientX-r.left,e.clientY-r.top);wAcc=0}},{passive:false});
function setZoom(z){zoomAt(z)}
// la cámara no se sale del Distrito: el centro de la pantalla siempre queda sobre el rombo del mapa
function clampPan(){const x=panX/zoom,y=panY/zoom+30,hw=N*TW/2*.88,hh=N*TH/2*.88,f=Math.abs(x)/hw+Math.abs(y)/hh;
  if(f>1){panX=x/f*zoom;panY=(y/f-30)*zoom}}
function centerCam(){panX=0;panY=0}
cv.addEventListener('dblclick',e=>{if(tileAt(e)<0)centerCam()});
$('zin').onclick=()=>setZoom(zoom+1);$('zout').onclick=()=>setZoom(zoom-1);
function turn(d){ROT=(ROT+d+4)%4;hover=-1;SPRL.clear();try{localStorage.setItem(KEY+'.rot',ROT)}catch(e){}}
$('rl').onclick=()=>turn(-1);$('rr').onclick=()=>turn(1);
try{ROT=(+localStorage.getItem(KEY+'.rot')||0)%4}catch(e){}
let resetArm=0;
$('reset').onclick=()=>{
  if(Date.now()-resetArm>600&&Date.now()-resetArm<4000){stashPrev();S=newGame();recompute();walkers=[];EXTRA=[];FUT=null;vozClose();save();say('Distrito nuevo. ¡A construir! Si fue sin querer, tu partida anterior quedó guardada: recarga la página y toca "Recuperar anterior".',true);$('reset').textContent='Reiniciar';resetArm=0;return}
  if(Date.now()-resetArm<=600)return;resetArm=Date.now();$('reset').textContent='¿Seguro? Toca otra vez';setTimeout(()=>{$('reset').textContent='Reiniciar'},4000)};
let lastInfo=-1;setInterval(()=>{if(hover<0||hover===lastInfo)return;
  if(HEAT){lastInfo=hover;say(tileInfo(hover),true);return}
  if(tool==='mejorar'){let i=hover,t=S.g[i];if(t.k==='part'){i=t.a;t=S.g[i]}if(!LV[t.k])return;lastInfo=hover;const L=lvOf(t);
    if(t.lu>0){say(`${nameOf(t)} está en obra.`,true);return}
    if(L>=4){say(`${nameOf(t)} ya está en su nivel máximo.`,true);return}
    const v=Math.round((stats.VAL?stats.VAL[i]:0)*100),need=Math.round(LVTH[L+1]*100),c=lvCost(t,i);
    say(`${nameOf(t)} → ${lvName(t,L+1)}: cuesta $${fmt(c)} y pide plusvalía ${need} (aquí hay ${v}).${v<need?' Todavía no se puede.':S.$<c?' Te falta dinero.':' Toca para mejorar.'}`,true)}},250);
addEventListener('keydown',e=>{if(TITLE||e.target&&e.target.tagName==='INPUT')return;if(e.key==='v'||e.key==='V'){$('heat').click()}const n=parseInt(e.key);if(n>=1&&n<=TABS.length&&!e.metaKey&&!e.ctrlKey)setTab(TABS[n-1][0]);if((e.key===' '||e.key==='p'||e.key==='P')&&!(e.target&&e.target.tagName==='SELECT')&&!e.repeat){e.preventDefault();setPause(!PAUSED)}if(e.key==='q'||e.key==='Q')turn(-1);if(e.key==='e'||e.key==='E')turn(1);if(e.key==='Escape'){hover=-1;if(!document.querySelector('#guide:not([hidden]),#opts:not([hidden])')&&tool!=='ver')pick('ver')}
  if((e.key==='c'||e.key==='C')&&!e.shiftKey&&!e.metaKey&&!e.ctrlKey)centerCam();
  // atajos del presentador (Shift + letra): para enseñar la tormenta y el atardecer sin esperar al azar
  if(e.shiftKey&&!e.metaKey&&!e.ctrlKey&&!e.altKey&&!e.repeat){
    if(e.code==='KeyL'){const ev=EVENTS.find(q=>q.id==='lluvia');S.ev={id:ev.id,t:ev.dur};sfx('event');say(ev.msg,true)}
    if(e.code==='KeyN'){S.clock=172.5;say('Son las 5:30 pm: ya viene el atardecer.',true)}
    if(e.code==='KeyD')setDemo(!document.body.classList.contains('demo'),true);
    if(e.code==='KeyF')perfShow(!PERF.on);
    if(e.code==='KeyH'){S.clock=(S.clock+DAY/16)%DAY;say('Adelanté la hora: '+clockTxt()+'.',true)}}});
function clockTxt(){const hr=(S.clock/DAY*24+6)%24,h=Math.floor(hr),m=Math.floor((hr-h)*60/15)*15;return `${(h%12)||12}:${String(m).padStart(2,'0')} ${h<12?'am':'pm'}`}
