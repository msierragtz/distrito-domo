/* ---------- v75: guía de inicio en 3 pasos, flechas en el mapa y avisos que llegan a tiempo ---------- */
// HINT: una flecha que rebota sobre una casilla del mapa. k='guia' (amarilla, la de la guía) o k='agua' (azul, dónde cabe una Torre de agua)
let HINT=null,GUIA=null,GUIAT=0,AGUAT=0;
const GFLAG='distritoDomo.guia';
// casilla libre, junto a una calle, donde se puede poner k; la más cercana a la casilla «cerca»
function freeSpotFor(k,cerca){let best=-1,bd=1e9;const nx=cerca%N,ny=Math.floor(cerca/N);
  for(let i=0;i<N*N;i++){const t=S.g[i];if(!canBuild(t,k))continue;const x=i%N,y=Math.floor(i/N);if(!connected(x,y))continue;const d=Math.abs(x-nx)+Math.abs(y-ny);if(d<bd){bd=d;best=i}}return best}
// el centro de donde vive la gente (o La Cúpula si todavía no hay vivienda)
function centroVecinos(){const B=stats.B||[];if(!B.length){const i=S.g.findIndex(t=>t.k==='domo'||t.k==='lotedomo');return i>=0?i:idx(OFF+8,OFF+8)}
  let x=0,y=0;for(const b of B){x+=b.x;y+=b.y}return idx(Math.round(x/B.length),Math.round(y/B.length))}
function hintFor(k,cam){if(k!=='torreagua')return;const i=freeSpotFor('torreagua',centroVecinos());if(i<0)return;HINT={i,k:'agua'};if(cam)camTo(i,1,40)}
// la flecha azul aparece sola cuando faltan 250 vecinos para quedarse sin agua y se va cuando ya hay una torre en obra
function aguaStep(){if(GUIA||!S.unl.includes('torreagua')){if(HINT&&HINT.k==='agua')HINT=null;return}
  const left=(stats.wcap||1000)-S.v,obra=S.g.some(t=>t.k==='torreagua'&&t.b>0);
  if(left<=250&&!obra){if(!HINT||HINT.k!=='agua'||!canBuild(S.g[HINT.i],'torreagua'))hintFor('torreagua',false)}
  else if(HINT&&HINT.k==='agua')HINT=null}
function drawHint(){if(!HINT||TITLE||REAL||HEAT)return;const i=HINT.i,t=S.g[i];if(!t)return;const x=i%N,y=Math.floor(i/N),one=!DEFS[t.k]||!MULTI(t.k),[dw,dh]=one?[1,1]:DIMT(t);
  const [cx,cy]=P(x+dw/2,y+dh/2),so=DEFS[t.k]&&t.k!=='calle'?shadowOf(t):null,h=so?Math.min(so[1],40):0,bob=lowMo()?0:Math.abs(Math.sin(T*4))*5;
  const col=HINT.k==='agua'?'#3a8fd6':'#ffd84d',ink='#1f2540';
  ctx.save();const pul=lowMo()?0:.5+.5*Math.sin(T*5);ctx.beginPath();
  [P(x,y),P(x+dw,y),P(x+dw,y+dh),P(x,y+dh)].forEach((q,k)=>k?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.closePath();ctx.globalAlpha=.25+.2*pul;ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=.8;ctx.strokeStyle=col;ctx.lineWidth=2;ctx.stroke();ctx.globalAlpha=1;
  const ay=cy-h-14-bob,arrow=(s)=>{ctx.beginPath();ctx.moveTo(cx-5*s,ay-14*s);ctx.lineTo(cx+5*s,ay-14*s);ctx.lineTo(cx+5*s,ay-5*s);ctx.lineTo(cx+9*s,ay-5*s);ctx.lineTo(cx,ay+5*s);ctx.lineTo(cx-9*s,ay-5*s);ctx.lineTo(cx-5*s,ay-5*s);ctx.closePath()};
  ctx.fillStyle='#fff';arrow(1.75);ctx.fill();ctx.fillStyle=ink;arrow(1.5);ctx.fill();ctx.fillStyle=col;arrow(1.22);ctx.fill();
  if(HINT.k==='agua'){const dy=ay-38;ctx.fillStyle=ink;ctx.beginPath();ctx.arc(cx,dy+2,5.5,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(cx,dy-8);ctx.lineTo(cx+5,dy);ctx.lineTo(cx-5,dy);ctx.fill();
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(cx,dy+2,4,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.moveTo(cx,dy-6);ctx.lineTo(cx+3.6,dy+.5);ctx.lineTo(cx-3.6,dy+.5);ctx.fill()}
  ctx.restore()}
/* --- la guía: 1) vivienda junto a una calle, 2) lo que pide el globito, 3) satisfacción arriba de 50% hasta 40 vecinos --- */
const GMETA=40,NEEDTOOL={verde:'parque',com:'cafe',park:'estac',dog:'dogpark'};
const nCasas=()=>S.g.filter(t=>DEFS[t.k]&&DEFS[t.k].per).length;
const nServ=()=>S.g.filter(t=>{const d=DEFS[t.k];return d&&!d.per&&!d.fixed&&t.k!=='calle'&&t.k!=='domo'}).length;
function peorCasa(){const B=(stats.B||[]).filter(b=>b.wk&&b.worst<.55).sort((a,b)=>a.worst-b.worst);return B[0]||null}
function guiaToca(nueva,veterano){let f=null;try{f=localStorage.getItem(GFLAG)}catch(e){}
  if(veterano&&!f){try{localStorage.setItem(GFLAG,'1')}catch(e){}return false}
  return nueva&&f!=='1'&&DIST==='domo'&&!S.demo}
function guiaPaso(){const p=GUIA&&GUIA.p;
  if(p===1){const casa=S.g.findIndex(t=>DEFS[t.k]&&DEFS[t.k].per);return {t:'Construye vivienda',tool:'edificio',
    d:`Elige Edificio (pestaña Vivienda) y ponlo en un terreno libre junto a una calle: la flecha amarilla te sugiere uno. Cuesta $${fmt(costOf('edificio'))}.`,hint:freeSpotFor('edificio',casa>=0?casa:centroVecinos())}}
  if(p===2){const b=peorCasa(),k=b?NEEDTOOL[b.wk]:'parque',tool=S.unl.includes(k)?k:'parque',T_=b?NEEDTXT[b.wk]:null;
    return {t:'Atiende los globitos',tool,d:b?`Cada edificio muestra un globito con lo que le falta (verde: área verde, naranja: comercio, azul: estacionamiento, café: dog park). Al de la flecha le falta ${T_[0]}: pon ${DEFS[tool].name.toLowerCase()} a unas cuadras.`:`Los edificios muestran un globito con lo que les falta: verde es área verde, naranja comercio, azul estacionamiento y café dog park. Pon un parque o un café cerca de tus edificios.`,hint:b?b.i:-1}}
  if(p===3)return {t:'Más de 50% de satisfacción',tool:null,d:`Los vecinos solo llegan si la satisfacción (arriba, en amarillo) pasa de 50%; abajo de 40% se empiezan a ir. Sigue atendiendo globitos hasta tener ${GMETA} vecinos: van ${Math.floor(S.v+1e-6)}.`,hint:-1};
  return null}
function guiaStart(p){GUIA={p:Math.max(1,Math.min(3,p||1))};S.tuto=GUIA.p;GUIA.base={casas:nCasas(),serv:nServ()};document.body.classList.add('tuto');guiaRender(true)}
function guiaEnd(salto){GUIA=null;S.tuto=9;if(HINT&&HINT.k==='guia')HINT=null;try{localStorage.setItem(GFLAG,'1')}catch(e){}document.body.classList.remove('tuto');
  const g=$('tuto');if(g)g.hidden=true;document.querySelectorAll('.guia').forEach(e=>e.classList.remove('guia'));
  if(!salto){sfx('levelup');celebrate(3);say('¡Listo, ya sabes lo básico! Sigue atendiendo globitos para crecer. Con 150 vecinos se abren los Encargos (arriba) y en el botón ? está todo lo que puedes construir.',true,{p:2})}save()}
function guiaRender(nuevo){const g=$('tuto');if(!g||!GUIA)return;const P_=guiaPaso();if(!P_)return;
  const html=`<div class="pa"><span>Paso ${GUIA.p} de 3 · ${P_.t}</span><button type="button" class="sk">Saltar guía</button></div><p>${P_.d}</p>`;
  if(g.dataset.h!==html){g.dataset.h=html;g.innerHTML=html;g.querySelector('.sk').onclick=e=>{e.stopPropagation();guiaEnd(true);say('Saltaste la guía. En el botón ? tienes todo lo que puedes construir.',true)}}
  g.hidden=false;
  // resaltar la herramienta del paso (y su pestaña mientras no esté a la vista)
  document.querySelectorAll('.guia').forEach(e=>e.classList.remove('guia'));
  if(P_.tool&&tool!==P_.tool&&btns[P_.tool]){btns[P_.tool].classList.add('guia');const tb=tabOf(P_.tool);if(tb&&tb!==TAB){const b=document.querySelector(`#tabs button[data-t="${tb}"]`);if(b)b.classList.add('guia')}}
  if(P_.hint>=0){const was=HINT&&HINT.k==='guia'?HINT.i:-1;HINT={i:P_.hint,k:'guia'};if(nuevo||was!==P_.hint&&was<0)camTo(P_.hint,1,70)}else if(HINT&&HINT.k==='guia')HINT=null}
function guiaStep(dt){GUIAT+=dt;AGUAT+=dt;if(TITLE)return;
  if(AGUAT>.5){AGUAT=0;aguaStep();hitosStep();
    // el consejo del crédito llega cuando hace falta: sin dinero para lo más barato que vale la pena, y ya no a los 9 s de empezar
    if(!S.loanTip&&!S.loan&&!GUIA&&S.maxV>=20&&S.$<Math.min(costOf('edificio'),costOf('parque')+40)){S.loanTip=1;say('Consejo: si te falta dinero para crecer, el botón naranja Crédito, arriba, te presta y lo pagas poco a poco.',false,{p:1})}}
  if(!GUIA||GUIAT<.25)return;GUIAT=0;
  const b=GUIA.base;let listo=false;
  if(GUIA.p===1)listo=nCasas()>b.casas;else if(GUIA.p===2)listo=nServ()>b.serv;else listo=S.v>=GMETA;
  if(listo){if(GUIA.p>=3){guiaEnd(false);return}GUIA.p++;S.tuto=GUIA.p;GUIA.base={casas:nCasas(),serv:nServ()};sfx('unlock');guiaRender(true);return}
  guiaRender(false)}
