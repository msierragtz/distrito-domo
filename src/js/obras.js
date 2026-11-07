/* ---------- obras grandes (v64): se abren con encargos desde 3,000 vecinos; una de cada una ---------- */
const OBRAS=['bosque','museo','rasca','beis','plazacom','metro'];
// a qué capa de plusvalía alimenta cada obra: verde, comercio o estacionamiento
const OBRACAPA={bosque:'v',museo:'v',beis:'c',rasca:'c',plazacom:'c',metro:'p',alberca:'v',parroquia:'v',hotel:'c'};
const BEIS_INC=90,BEIS_GAP=480,BEIS_DUR=120,BODA_GAP=420,BODA_DUR=60;
// ¿algún terreno pegado a la huella es de uno de estos tipos?
function obraTouch(i,kinds){const t=S.g[i],f=foot(i,...DIMT(t))||[i];return f.some(j=>{const jx=j%N,jy=Math.floor(j/N);return NB.some(([dx,dy])=>{if(!inb(jx+dx,jy+dy))return false;const q=S.g[anchorOf(idx(jx+dx,jy+dy))];return q&&kinds.includes(q.k)&&!(q.b>0)})})}
const beisOn=()=>!!(S.beis&&S.beis.on>0&&stats.ob&&stats.ob.beis);
// la etiqueta corta de la manita para cada obra
function obraShort(t){const k=t.k;
  if(k==='beis')return beisOn()?`¡hay juego! +$${BEIS_INC}/s`:`siguiente juego en ${Math.max(1,Math.ceil(((S.beis&&S.beis.t)||BEIS_GAP)/60))} min`;
  if(k==='museo')return t.mok?'los turistas dejan $10/s':'le falta un parque o plaza pegado';
  if(k==='rasca')return `deja $${DEFS.rasca.inc}/s · gasta agua de 300`;
  if(k==='bosque')return 'el área verde más grande';
  if(k==='plazacom')return `deja $${DEFS.plazacom.inc}/s · comercio para todos`;
  if(k==='metro')return '−30% de estacionamiento';
  if(k==='alberca')return S.ev&&S.ev.id==='calor'?'¡llena por el calor! +$12/s':NIGHT>.5?'cerrada: abre en la mañana':'verde y comercio a 5 cuadras';
  if(k==='parroquia')return S.boda&&S.boda.on>0?'¡hay boda! negocios cerca +50%':`siguiente boda en ${Math.max(1,Math.ceil(((S.boda&&S.boda.t)||BODA_GAP)/60))} min`;
  if(k==='hotel')return `los turistas dejan $${Math.round(stats.hotelT||20)}/s`;return ''}
