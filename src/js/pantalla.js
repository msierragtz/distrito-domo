/* medidor de rendimiento (Shift+F): ms que tarda en dibujarse cada cuadro y cuadros por segundo */
const PERF={on:false,r:0,f:0,n:0,t:0,el:null};
function perfShow(v){PERF.on=v;if(!PERF.el){PERF.el=document.createElement('div');PERF.el.id='perf';document.getElementById('stage').appendChild(PERF.el)}PERF.el.hidden=!v}
function perfStep(rms,fdt){PERF.r=PERF.r*.95+rms*.05;PERF.f=PERF.f*.95+fdt*.05;if(!PERF.on)return;PERF.t+=fdt;if(PERF.t<.25)return;PERF.t=0;
  PERF.el.textContent=`dibujo ${PERF.r.toFixed(1)} ms · ${Math.round(1/Math.max(.001,PERF.f))} fps · luces ${LIGHTN} · ${bw}×${bh}@${RES}${AUTOLOW?' · ahorro':''}`}
function setDemo(on,tell){document.body.classList.toggle('demo',on);try{localStorage.setItem(KEY+'.presentador',on?'1':'')}catch(e){}
  if(tell)say(on?'Modo presentador: Reiniciar oculto. Shift+L tormenta · Shift+N atardecer · C centra la vista · Shift+D para salir.':'Modo presentador apagado.',true)}
try{if(localStorage.getItem(KEY+'.presentador')==='1')setDemo(true,false)}catch(e){}

function resize(){
  const r=cv.parentElement.getBoundingClientRect();
  const nr=Math.max(1,Math.min(2,Math.round(zoom*(window.devicePixelRatio||1))));
  if(nr!==RES){RES=nr;SPR.clear();LASTSPR.clear();GC=null;GSH=null;GB=null;GJOB=null;GKEY=''}
  bw=Math.ceil(r.width/zoom);bh=Math.ceil(r.height/zoom);cv.width=bw*RES;cv.height=bh*RES;ctx.setTransform(RES,0,0,RES,0,0);ctx.imageSmoothingEnabled=false;
}
addEventListener('resize',resize);
/* aviso de girar: solo si el celular de verdad está acostado y la pantalla queda muy chaparra; nunca atrapa al jugador */
{let giraSkip=false;
 const devLandscape=()=>{try{const t=screen.orientation&&screen.orientation.type;if(t)return t.startsWith('landscape')}catch(e){}
   if(typeof window.orientation==='number')return Math.abs(window.orientation)===90;return innerWidth>innerHeight};
 const checkGira=()=>{let coarse=false;try{coarse=matchMedia('(pointer:coarse)').matches}catch(e){}
   document.body.classList.toggle('gira',!giraSkip&&coarse&&innerHeight<500&&innerWidth>innerHeight&&devLandscape())};
 addEventListener('resize',checkGira);addEventListener('orientationchange',()=>setTimeout(checkGira,250));
 try{screen.orientation&&screen.orientation.addEventListener('change',()=>setTimeout(checkGira,250))}catch(e){}
 document.getElementById('giraok').onclick=()=>{giraSkip=true;checkGira()};checkGira()}
try{if(innerHeight>=820)document.getElementById('thelp').open=true}catch(e){}

