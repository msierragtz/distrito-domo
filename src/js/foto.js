/* ---------- modo foto, paseo, grabación y time-lapse (v65) ----------
   Modo foto (botón de cámara o tecla F): esconde la interfaz y pausa la simulación (las animaciones siguen);
   se elige la hora, el clima, la temporada y un filtro, y se guarda una foto en PNG grande con pie de foto.
   Paseo: la cámara recorre sola los lugares importantes. Grabar: guarda en video lo que se ve (MP4 o WebM).
   Time-lapse: la ciudad se vuelve a construir en unos segundos, de la mañana a la noche. Para eso el juego
   guarda una foto del mapa cada 30 s de juego (solo lo que cambió) en este navegador; si la partida empezó
   antes de v65, el principio se reconstruye a partir de la ciudad actual. */
// REAL: el estado de juego que se guarda mientras el modo foto o el time-lapse cambian el mapa, la hora o el clima
let REAL=null,PHOTO=null,TL=null,REC=null,PASEO=null;
const FILT={'':{css:'',vig:0},postal:{css:'saturate(1.3) contrast(1.06)',vig:.25},retro:{css:'sepia(.38) saturate(1.25) contrast(1.05) hue-rotate(-8deg)',vig:.55},
  cine:{css:'contrast(1.18) saturate(.82) brightness(.96)',vig:.7},bn:{css:'grayscale(1) contrast(1.15)',vig:.4}};
const realOn=()=>{if(!REAL)REAL={g:S.g,clock:S.clock,ev:S.ev,season:OPT.season};return REAL};
// lo que se guarda es siempre la partida real, aunque en pantalla se vea otra hora o el mapa de hace una hora
function withReal(fn){if(!REAL)return fn();const g=S.g,c=S.clock,e=S.ev;S.g=REAL.g;S.clock=REAL.clock;S.ev=REAL.ev;try{return fn()}finally{S.g=g;S.clock=c;S.ev=e}}
function fmsg(t){const m=$('fMsg');if(!m)return;m.textContent=t;m.hidden=!t;clearTimeout(fmsg.h);if(t)fmsg.h=setTimeout(()=>{m.hidden=true},4500)}
// guardar un archivo: con el permiso de descargas de claude.ai si está, o con un enlace normal fuera de claude.ai
async function saveBlob(fn,blob){let dl=null;try{dl=window.claude&&window.claude.use?await claude.use('downloads'):null}catch(e){}
  if(dl){try{await dl.save({filename:fn,data:blob});return 'ok'}catch(e){const c=e&&e.code;if(c==='declined')return 'no';if(c==='rate_limited')return 'espera';if(c!=='unavailable'&&c!=='not_granted')return 'error'}}
  try{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},5000);return 'ok'}catch(e){return 'error'}}
const stamp=()=>{const d=new Date(),p=n=>String(n).padStart(2,'0');return `${d.getFullYear()}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`};
const hhmm=s=>{const m=Math.max(1,Math.round(s/60)),h=Math.floor(m/60);return h?`${h} h ${String(m%60).padStart(2,'0')} min`:`${m} min`};

/* ===== historia del mapa ===== */
const HKEY=KEY+'.historia';let HIST=null,HLAST=null,HISTT=0;
const tcode=t=>{const a=[t.k,t.s|0];if(t.f)a[2]=t.f;if(t.lv>1)a[3]=t.lv;if(t.o)a[4]=1;if(t.a!=null)a[5]=t.a;if(t.hw)a[6]=1;if(t.p)a[7]=t.p;if(t.b>0||t.ct>0)a[8]=1;return JSON.stringify(a)};
function tdecode(s){const a=JSON.parse(s),t={k:a[0],s:a[1]||0,b:0,ok:true};if(a[2])t.f=a[2];if(a[3])t.lv=a[3];if(a[4])t.o=1;if(a[5]!=null)t.a=a[5];if(a[6])t.hw=1;if(a[7])t.p=a[7];
  if(a[8]){const d=DEFS[t.k];t.bt=(d&&d.bt)||10;t.b=t.bt*.5}return t}
function histLoad(){if(!S.hid)S.hid=Math.random().toString(36).slice(2,9);if(HIST&&HIST.id===S.hid)return;
  try{HIST=JSON.parse(localStorage.getItem(HKEY)||'null')}catch(e){HIST=null}
  if(!HIST||HIST.v!==1||HIST.id!==S.hid||!Array.isArray(HIST.f))HIST={v:1,id:S.hid,iv:30,f:[]};
  HLAST=null;for(const f of HIST.f){if(f.a)HLAST=f.a.slice();else if(HLAST)for(const i in f.d)HLAST[i]=f.d[i]}}
function histSave(){try{let s=JSON.stringify(HIST);while(s.length>6e5&&HIST.f.length>8){histThin();s=JSON.stringify(HIST)}if(!lsPut(HKEY,s)&&HIST.f.length>8){histThin();lsPut(HKEY,JSON.stringify(HIST))}}catch(e){}}
// con muchas fotos, se juntan de dos en dos (la primera, con el mapa completo, se queda)
function histThin(){const F=HIST.f,out=[F[0]];for(let k=1;k<F.length;k+=2){const a=F[k],b=F[k+1];out.push(b?{t:b.t,v:b.v,d:Object.assign({},a.d,b.d)}:a)}HIST.f=out;HIST.iv*=2}
function histSnap(){const codes=S.g.map(tcode),v=Math.round(S.v),t=Math.round(S.playT||0);
  if(!HLAST||!HIST.f.length){HIST.f=[{t,v,a:codes}]}
  else{const d={};let n=0;for(let i=0;i<codes.length;i++)if(codes[i]!==HLAST[i]){d[i]=codes[i];n++}if(!n&&Math.abs(v-HIST.f[HIST.f.length-1].v)<5)return;HIST.f.push({t,v,d})}
  HLAST=codes;if(HIST.f.length>240)histThin();histSave()}
function histStep(dt){if(TITLE||REAL)return;if(!S.fotoTip&&S.maxV>=60&&(S.playT||0)>90){S.fotoTip=1;say('Nuevo: modo foto. Toca el botón de la cámara (o la tecla F) para tomar fotos de tu Distrito, grabar video, dar un paseo con la cámara o ver el time-lapse de cómo creció.')}if(!HIST||HIST.id!==S.hid)histLoad();HISTT+=dt;if(!HIST.f.length||HISTT>=HIST.iv){HISTT=0;histSnap()}}

/* ===== cuadros del time-lapse ===== */
// el principio que no se grabó: de un Distrito vacío a la primera foto, calles primero y luego edificios del centro hacia afuera
function synthFrames(target,v1,t1,n){const B=newGame().g.map(tcode),ch=[],SAME=['ajeno','fabrica','calle','lote','arbol','tanque','reserva','lotedomo','rio'];
  for(let i=0;i<B.length;i++){const a=JSON.parse(B[i])[0],b=JSON.parse(target[i])[0];if(a===b&&SAME.includes(a))B[i]=target[i]}
  for(let i=0;i<target.length;i++)if(target[i]!==B[i])ch.push(i);if(!ch.length)return [];
  const T_=target.map(s=>JSON.parse(s)),isPart=i=>T_[i][0]==='part',street=i=>T_[i][0]==='calle',cx=N/2,cy=N/2+1;
  const dist=new Map();{const q=[];for(let i=0;i<B.length;i++)if(JSON.parse(B[i])[0]==='calle'){dist.set(i,0);q.push(i)}
    while(q.length){const i=q.shift(),x=i%N,y=Math.floor(i/N);for(const [dx,dy] of NB){if(!inb(x+dx,y+dy))continue;const j=idx(x+dx,y+dy);if(dist.has(j)||!street(j))continue;dist.set(j,dist.get(i)+1);q.push(j)}}}
  const r=rng(77),score=new Map();
  for(const i of ch){if(isPart(i))continue;const x=i%N,y=Math.floor(i/N);score.set(i,street(i)?(dist.get(i)||8)/40:.2+.8*(Math.abs(x-cx)+Math.abs(y-cy))/N+r()*.25)}
  const ord=[...score.keys()].sort((a,b)=>score.get(a)-score.get(b)),at=new Map();ord.forEach((i,k)=>at.set(i,1+Math.floor(k/ord.length*(n-2))));
  for(const i of ch)if(isPart(i))at.set(i,at.get(T_[i][5])||1);
  const out=[];for(let j=0;j<n;j++){const c=B.slice();for(const i of ch){const a=at.get(i);if(a>j)continue;const v=T_[i].slice();
      const d=DEFS[v[0]];if(d&&d.per&&v[2]){const f0=d.f0||v[2],gr=Math.min(1,(j-a)/Math.max(1,(n-1-a)*.8));v[2]=Math.min(v[2],f0+Math.floor((v[2]-f0)*gr))}
      if(v[3]>1&&j<a+(n-a)*.6)v[3]=null;if(a===j&&!v[8]&&d&&d.bt>=6)v[8]=1;c[i]=JSON.stringify(v)}
    out.push({c,v:Math.round(v1*j/(n-1)),t:Math.round(t1*j/(n-1))})}
  return out}
function tlFrames(){histLoad();const fr=[];let cur=null;for(const f of HIST.f){if(f.a)cur=f.a.slice();else if(cur){cur=cur.slice();for(const i in f.d)cur[i]=f.d[i]}if(cur)fr.push({c:cur,v:f.v,t:f.t})}
  const now=withReal(()=>S.g.map(tcode)),vNow=Math.round(S.v),tNow=Math.round(S.playT||0);fr.push({c:now,v:vNow,t:tNow});
  // si la grabación empezó con la ciudad ya hecha, se arma el principio
  // con poca historia, todo el crecimiento se reconstruye desde la ciudad de hoy
  if(fr.length<8){const syn=synthFrames(now,vNow,tNow,32);return syn.length?syn:fr}
  const f0=fr[0];if(f0.v>40){const syn=synthFrames(f0.c,f0.v,f0.t,Math.max(14,Math.min(36,48-fr.length)));fr.unshift(...syn.slice(0,-1))}
  // a lo más 150 cuadros, repartidos parejo
  if(fr.length>150){const out=[];for(let k=0;k<150;k++)out.push(fr[Math.round(k*(fr.length-1)/149)]);return out}
  return fr}

/* ===== reproductor ===== */
function tlStart(o){if(TL||TITLE)return false;o=o||{};const fr=tlFrames();if(fr.length<3){fmsg('Todavía no hay historia suficiente: juega unos minutos más.');return false}
  const own=!REAL;realOn();for(const b of ['credits','misbox','loanbox','moneybox','guide','opts'])if($(b))$(b).hidden=true;
  TL={fr,k:-1,t:0,dur:Math.max(10,Math.min(22,fr.length*.2)),end:0,own,rec:!!o.rec,sv:{g:S.g,clock:S.clock,ev:S.ev},pan:[panX,panY,zoom],v:fr[0].v};
  PASEO=null;CAMG=null;INER=null;hover=-1;document.body.classList.add('tl');
  requestAnimationFrame(()=>{resize();zoom=innerWidth<700?1:2;resize();const r=rot(N/2,N/2+1);panX=-(r[0]-r[1])*TW/2*zoom;panY=(N*TH/2-30-(r[0]+r[1])*TH/2+40)*zoom;clampPan()});
  if(TL.rec)recStart();else if(REC)TL.rec=true;fotoSync();return true}
function tlStop(){if(!TL)return;const t=TL;TL=null;S.g=t.sv.g;S.clock=t.sv.clock;S.ev=t.sv.ev;if(t.own)REAL=null;GV++;recompute();walkers=[];EXTRA=[];FUT=null;
  document.body.classList.remove('tl');zoom=t.pan[2];panX=t.pan[0];panY=t.pan[1];requestAnimationFrame(()=>{resize();clampPan()});
  if(REC&&t.rec)recStop();fotoSync()}
function tlStep(rdt){if(!TL)return;TL.t+=rdt;const p=Math.min(1,TL.t/TL.dur),n=TL.fr.length,k=Math.min(n-1,Math.floor(p*n));
  if(k!==TL.k){const prev=TL.k>=0?TL.fr[TL.k].c:null,cur=TL.fr[k].c;TL.k=k;S.g=cur.map(tdecode);GV++;
    if(prev){let m=0;for(let i=0;i<cur.length&&m<16;i++)if(cur[i]!==prev[i]&&S.g[i].k!=='part'&&S.g[i].k!=='calle'&&DEFS[S.g[i].k]){LAND.set(i,T);m++}}}
  const fr=TL.fr[k],nx=TL.fr[Math.min(n-1,k+1)],sub=Math.min(1,p*n-k);TL.v=fr.v+(nx.v-fr.v)*sub;TL.tt=fr.t+(nx.t-fr.t)*sub;
  S.clock=DAY*(.04+p*.68);S.ev=null;
  if(p>=1){TL.end+=rdt;if(!TL.fw){TL.fw=1;celebrate(4);sfx('phase')}if(TL.end>4.8)tlStop()}}
// letreros del time-lapse dentro del dibujo, para que también salgan en el video
function tlHud(){const t=TL;if(!t)return;const H=Math.round(bh*.075),u=Math.max(5,Math.round(bh*.024));ctx.save();ctx.globalAlpha=1;ctx.fillStyle='#0b0f1e';ctx.fillRect(0,0,bw,H);ctx.fillRect(0,bh-H,bw,H);
  ctx.textBaseline='middle';ctx.font=`${u}px "Press Start 2P", monospace`;ctx.textAlign='left';ctx.fillStyle='#f26a21';ctx.fillText(DNAME.toUpperCase(),Math.round(u*1.4),Math.round(H/2));
  ctx.textAlign='right';ctx.fillStyle='#ffffff';ctx.fillText(S.name?`ASÍ CRECIÓ EL DISTRITO DE ${S.name.toUpperCase()}`.slice(0,40):'ASÍ CRECIÓ TU DISTRITO',Math.round(bw-u*1.4),Math.round(H/2));
  ctx.textAlign='left';ctx.font=`${Math.round(u*1.5)}px "Press Start 2P", monospace`;ctx.fillStyle='#ffd84d';ctx.fillText(`${Math.round(t.v).toLocaleString('es-MX')}`,Math.round(u*1.4),Math.round(bh-H/2));
  const w1=ctx.measureText(`${Math.round(t.v).toLocaleString('es-MX')}`).width;ctx.font=`${u}px "Press Start 2P", monospace`;ctx.fillStyle='#ffffff';ctx.fillText('VECINOS',Math.round(u*2+w1),Math.round(bh-H/2));
  ctx.textAlign='right';ctx.font=`${Math.round(u*2.1)}px VT323, monospace`;ctx.fillStyle='#c8cde0';ctx.fillText(`${(t.tt||0)>=60?hhmm(t.tt)+' de juego · ':''}Santa Catarina, N.L.`,Math.round(bw-u*1.4),Math.round(bh-H/2));
  ctx.fillStyle='#f26a21';ctx.fillRect(0,bh-2,Math.round(bw*Math.min(1,t.t/t.dur)),2);ctx.restore()}

/* ===== grabación de video ===== */
const recOk=()=>{try{return !!(window.MediaRecorder&&HTMLCanvasElement.prototype.captureStream)}catch(e){return false}};
function recStart(){if(REC)return;if(!recOk()){fmsg('Este navegador no puede grabar video.');return}
  const mime=['video/mp4;codecs=avc1','video/mp4','video/webm;codecs=vp9','video/webm;codecs=vp8','video/webm'].find(m=>{try{return MediaRecorder.isTypeSupported(m)}catch(e){return false}});
  if(!mime){fmsg('Este navegador no puede grabar video.');return}
  const k=Math.max(1,Math.min(3,Math.floor(1920/cv.width))),c=document.createElement('canvas');c.width=cv.width*k;c.height=cv.height*k;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  let mr;try{mr=new MediaRecorder(c.captureStream(30),{mimeType:mime,videoBitsPerSecond:12e6})}catch(e){fmsg('No se pudo empezar a grabar en este navegador.');return}
  const ch=[];mr.ondataavailable=e=>{if(e.data&&e.data.size)ch.push(e.data)};
  mr.onstop=async()=>{const ext=mime.startsWith('video/mp4')?'mp4':'webm',blob=new Blob(ch,{type:mime.split(';')[0]});if(!blob.size){fmsg('El video salió vacío.');return}
    const r=await saveBlob(`distrito-domo-${stamp()}.${ext}`,blob);fmsg(r==='ok'?`Video guardado (${(blob.size/1048576).toFixed(1)} MB).`:r==='no'?'No se guardó el video.':r==='espera'?'Hay otra descarga pendiente; vuelve a grabar en un momento.':'No se pudo guardar el video.')};
  REC={c,x,mr,t0:performance.now()};mr.start(500);fotoSync();fmsg('Grabando… (máximo 90 s)')}
function recStop(){if(!REC)return;const r=REC;REC=null;try{r.mr.stop()}catch(e){}fotoSync()}
function recFrame(){if(!REC)return;const r=REC,f=PHOTO&&FILT[PHOTO.f];if(f&&f.css&&'filter' in r.x)r.x.filter=f.css;r.x.drawImage(cv,0,0,r.c.width,r.c.height);r.x.filter='none';
  if(f&&f.vig)vignette(r.x,r.c.width,r.c.height,f.vig);if(performance.now()-r.t0>90000)recStop()}

/* ===== foto ===== */
function vignette(x,W,H,a){const g=x.createRadialGradient(W/2,H/2,Math.min(W,H)*.35,W/2,H/2,Math.hypot(W,H)*.55);g.addColorStop(0,'rgba(10,8,20,0)');g.addColorStop(1,`rgba(10,8,20,${a})`);x.fillStyle=g;x.fillRect(0,0,W,H)}
function caption(x,W,H){const u=Math.max(10,Math.round(H*.018)),pad=u,line2=`Santa Catarina, N.L. · ${Math.floor(withReal(()=>S.v)).toLocaleString('es-MX')} vecinos`;
  x.font=`${u}px "Press Start 2P", monospace`;const w1=x.measureText(DNAME.toUpperCase()).width;x.font=`${Math.round(u*1.7)}px VT323, monospace`;const w2=x.measureText(line2).width;
  const bw2=Math.max(w1+u*2.6,w2)+pad*2,bh2=u*4.6,x0=W-bw2-u*1.5,y0=H-bh2-u*1.5;x.fillStyle='rgba(20,24,40,.78)';x.fillRect(x0,y0,bw2,bh2);x.fillStyle='#f26a21';x.fillRect(x0,y0,bw2,Math.max(2,u*.25));
  x.strokeStyle='#f26a21';x.lineWidth=Math.max(2,u*.35);x.beginPath();x.arc(x0+pad+u*.8,y0+pad+u*1.25,u*.8,Math.PI,0);x.stroke();
  x.textBaseline='middle';x.textAlign='left';x.font=`${u}px "Press Start 2P", monospace`;x.fillStyle='#ffffff';x.fillText(DNAME.toUpperCase(),x0+pad+u*2.2,y0+pad+u*.9);
  x.font=`${Math.round(u*1.7)}px VT323, monospace`;x.fillStyle='#c8cde0';x.fillText(line2,x0+pad,y0+pad+u*2.8)}
async function fotoSave(){if(!PHOTO)return;const k=Math.max(1,Math.min(4,Math.round(2400/cv.width))),W=cv.width*k,H=cv.height*k,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');x.imageSmoothingEnabled=false;
  const f=FILT[PHOTO.f];if(f.css&&'filter' in x)x.filter=f.css;x.drawImage(cv,0,0,W,H);x.filter='none';if(f.vig)vignette(x,W,H,f.vig);if(PHOTO.pie)caption(x,W,H);
  const fl=$('fflash');if(fl&&!lowMo()){fl.classList.remove('on');void fl.offsetWidth;fl.classList.add('on')}sfx('foto');
  const blob=await new Promise(r=>{try{c.toBlob(r,'image/png')}catch(e){r(null)}});if(!blob){fmsg('No se pudo armar la foto.');return}
  const r=await saveBlob(`distrito-domo-${stamp()}.png`,blob);fmsg(r==='ok'?`Foto guardada (${W}×${H}).`:r==='no'?'No se guardó la foto.':r==='espera'?'Hay otra descarga pendiente; intenta en un momento.':'No se pudo guardar la foto.')}

/* ===== paseo de cámara ===== */
function paseoPts(){const pts=[],add=i=>{if(i>=0&&!pts.includes(i))pts.push(i)};
  S.g.forEach((t,i)=>{const d=DEFS[t.k];if(t.k==='domo'||(d&&(d.obra||d.trophy))&&!(t.b>0))add(i)});
  S.g.map((t,i)=>[t.k==='torre'?t.f||0:0,i]).filter(a=>a[0]).sort((a,b)=>b[0]-a[0]).slice(0,3).forEach(a=>add(a[1]));
  if(pts.length<4)S.g.forEach((t,i)=>{if(pts.length<6&&(t.k==='plaza'||t.k==='parque'||t.k==='edificio'))add(i)});
  const cx=N/2,cy=N/2;return pts.sort((a,b)=>Math.atan2(Math.floor(a/N)-cy,a%N-cx)-Math.atan2(Math.floor(b/N)-cy,b%N-cx)).slice(0,9)}
function paseoStep(rdt){if(!PASEO||CAMG)return;PASEO.h-=rdt;if(PASEO.h>0)return;const i=PASEO.pts[PASEO.k++%PASEO.pts.length];camTo(i,5.5);PASEO.h=1.6}

/* ===== entrar y salir del modo foto ===== */
function fotoOn(){if(PHOTO||TITLE||TL)return;realOn();for(const b of ['misbox','loanbox','moneybox','guide','opts','credits'])if($(b))$(b).hidden=true;
  PHOTO={f:'',tool,heat:HEAT,pie:true};HEAT=false;tool='ver';hover=-1;document.body.classList.add('foto');
  const hr=(S.clock/DAY*24+6)%24;$('fHora').value=Math.round(hr*4)%96;$('fTemp').value=OPT.season||'auto';
  requestAnimationFrame(()=>{resize();clampPan()});fotoSync();fmsg('Modo foto: arrastra para mover, rueda o pellizco para acercar. La partida está en pausa.')}
function fotoOff(){if(!PHOTO)return;if(TL)tlStop();PASEO=null;if(REC)recStop();const P_=PHOTO;PHOTO=null;
  if(REAL){S.clock=REAL.clock;S.ev=REAL.ev;OPT.season=REAL.season;REAL=null}tool=P_.tool;HEAT=P_.heat;cv.style.filter='';$('fvig').style.opacity=0;
  document.body.classList.remove('foto');requestAnimationFrame(()=>{resize();clampPan()});setCursor();refreshUI(true)}
function fotoSync(){const on=!!PHOTO;const b=$('fotobar');if(!b)return;b.hidden=!on||!!TL;$('tlbar').hidden=!TL;
  if(on){const f=FILT[PHOTO.f];cv.style.filter=f.css||'';$('fvig').style.opacity=f.vig||0;
    $('fHoraT').textContent=clockTxt();const rain=!!(S.ev&&S.ev.id==='lluvia');$('fSol').setAttribute('aria-pressed',!rain);$('fLluvia').setAttribute('aria-pressed',rain);
    $('fPaseo').setAttribute('aria-pressed',!!PASEO);$('fPaseo').disabled=lowMo();$('fRec').setAttribute('aria-pressed',!!REC);$('fRec').textContent=REC?'■ Detener':'● Grabar';$('fRec').hidden=!recOk();$('fPie').setAttribute('aria-pressed',PHOTO.pie)}
  $('tlRec').hidden=!(TL&&REC)}
function fotoStep(rdt){tlStep(rdt);paseoStep(rdt);if(PHOTO&&!TL){const t=$('fHoraT');if(t&&t.textContent!==clockTxt())t.textContent=clockTxt()}}
{const on=(id,ev,fn)=>{const el=$(id);if(el)el.addEventListener(ev,e=>{if(id==='fotob'||id==='tlStop'||PHOTO)fn(e)})};
  on('fotob','click',e=>{e.stopPropagation();PHOTO?fotoOff():fotoOn()});
  on('fSalir','click',()=>fotoOff());on('fFoto','click',()=>fotoSave());
  on('fHora','input',e=>{S.clock=((+e.target.value/4-6+24)%24)/24*DAY;fotoSync()});
  on('fSol','click',()=>{S.ev=null;fotoSync()});on('fLluvia','click',()=>{const ev=EVENTS.find(q=>q.id==='lluvia');S.ev={id:'lluvia',t:ev.dur/2};fotoSync()});
  on('fFiltro','change',e=>{PHOTO.f=e.target.value;fotoSync()});
  on('fTemp','change',e=>{OPT.season=e.target.value;SPRL.clear();fotoSync()});
  on('fPie','click',()=>{PHOTO.pie=!PHOTO.pie;fotoSync()});
  on('fMas','click',()=>zoomAt(zoom+1));on('fMenos','click',()=>zoomAt(zoom-1));on('fGirar','click',()=>turn(1));
  on('fPaseo','click',()=>{PASEO=PASEO?null:{pts:paseoPts(),k:0,h:0};if(PASEO&&!PASEO.pts.length)PASEO=null;fotoSync()});
  on('fRec','click',()=>{REC?recStop():recStart()});
  on('fTL','click',()=>tlStart({}));
  on('tlStop','click',()=>tlStop());
  addEventListener('keydown',e=>{if(TITLE||e.target&&(e.target.tagName==='INPUT'||e.target.tagName==='SELECT'))return;
    if((e.key==='f'||e.key==='F')&&!e.shiftKey&&!e.metaKey&&!e.ctrlKey&&!e.altKey){if(TL)return;PHOTO?fotoOff():fotoOn()}
    else if(e.key==='Escape'){if(TL)tlStop();else if(PHOTO)fotoOff()}})}
