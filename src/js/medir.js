/* ---------- v77: medir sin servidor. Cada partida anota en qué minuto cruzó cada hito y en qué días se abrió;
   «Compartir mi avance» (en Opciones) lo copia como texto para pegarlo en un comentario o un mensaje ---------- */
const HITOS=[100,500,1000,2000,3000];
const hoyTxt=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
// -1 = la partida ya había pasado ese hito antes de que se midiera
function hitosStep(){if(!S.hitos){S.hitos={};for(const h of HITOS)if((S.maxV||0)>=h)S.hitos[h]=-1}
  for(const h of HITOS)if(S.hitos[h]==null&&(S.maxV||0)>=h)S.hitos[h]=Math.round(S.playT||0)}
function diaHoy(){if(!Array.isArray(S.dias))S.dias=[];const d=hoyTxt();if(!S.dias.includes(d)){S.dias.push(d);if(S.dias.length>90)S.dias.shift()}}
function avanceTxt(){hitosStep();const nv=n=>Math.round(n).toLocaleString('es-MX'),m=s=>Math.max(1,Math.round(s/60));
  const hs=HITOS.filter(h=>S.hitos[h]!=null).map(h=>S.hitos[h]<0?`${nv(h)} (antes de medir)`:`${nv(h)} en ${m(S.hitos[h])} min`);
  let ne=0;try{ne=JSON.parse(localStorage.getItem(KEY+'.errores')||'[]').reduce((a,e)=>a+(e.n||1),0)}catch(e){}
  const guia=S.tuto===9?'terminada o saltada':S.tuto>0?`en el paso ${S.tuto}`:'no la vio',tc=(()=>{try{return matchMedia('(pointer:coarse)').matches}catch(e){return false}})();
  return [`Distrito Sierra v${VER} · ${DNAME}`,
    `Vecinos: ${nv(S.v)} (máximo ${nv(S.maxV||0)}) · satisfacción ${Math.round((stats.sat||0)*100)}%`,
    `Tiempo de juego: ${m(S.playT||0)} min en ${(S.dias||[]).length||1} día${((S.dias||[]).length||1)===1?'':'s'}`,
    `Hitos: ${hs.length?hs.join(', '):'todavía ninguno'}`,
    `Guía: ${guia} · ${tc?'celular o tableta':'computadora'}${lowQ()?' · modo ahorro':''} · errores: ${ne}`].join('\n')}
async function avanceCopy(){const t=avanceTxt();let ok=false;
  try{await navigator.clipboard.writeText(t);ok=true}catch(e){try{const a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();ok=document.execCommand('copy');a.remove()}catch(e2){}}
  const o=$('oAv');if(o){o.hidden=false;o.textContent=t}
  say(ok?'Copié tu avance: pégalo en un comentario o mándalo por mensaje.':'No pude copiarlo solo: selecciona el texto de Opciones y cópialo.',true);return ok}
