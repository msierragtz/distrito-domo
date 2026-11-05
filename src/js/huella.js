const SZ=k=>(DEFS[k]&&DEFS[k].sz)||1;
// huella en el mapa: w a lo largo de x, h a lo largo de y; o=1 la gira (un 2×1 se vuelve 1×2)
const DIM=(k,o)=>{const d=DEFS[k];if(!d)return [1,1];const w=d.fw||d.sz||1,h=d.fh||d.sz||1;return o?[h,w]:[w,h]};
const DIMT=t=>DIM(t.k,t.o);
const MULTI=k=>{const d=DEFS[k];return !!d&&((d.sz||1)>1||(d.fw||1)>1||(d.fh||1)>1)};
function anchorOf(i){const t=S.g[i];return t.k==='part'?t.a:i}
function foot(i,w,h){if(h==null)h=w;const x=i%N,y=Math.floor(i/N),out=[];for(let dy=0;dy<h;dy++)for(let dx=0;dx<w;dx++){if(!inb(x+dx,y+dy))return null;out.push(idx(x+dx,y+dy))}return out}
function footFree(i,w,h,k=tool){const f=foot(i,w,h);return f&&f.every(j=>S.g[j].k==='lote'||S.g[j].k==='arbol'||(S.g[j].k==='reserva'&&S.g[j].p===k))?f:null}
// dónde cabe la herramienta: primero a lo largo, si no, girada; con calle junto si se puede
function toolFoot(i,k=tool){const out=[];for(const o of (DIM(k,0)[0]===DIM(k,0)[1]?[0]:[0,1])){const [w,h]=DIM(k,o),f=footFree(i,w,h,k);if(f)out.push({f,o,w,h})}
  return out.find(q=>footConnected(q.f))||out[0]||null}
function footConnected(f){return f.some(j=>connected(j%N,Math.floor(j/N)))}
const canBuild=(t,k=tool)=>k==='domo'?t.k==='lotedomo':(t.k==='lote'||t.k==='arbol');
const fmaxOf=k=>DEFS[k].fmax+((S.phase||1)>=3?(k==='torre'?10:2):0);
const fmaxT=t=>fmaxOf(t.k)+(lvOf(t)-1); // cada nivel de vivienda permite un piso más
const canUp=t=>t.k===tool&&DEFS[tool].fmax&&!(t.b>0)&&!(t.ub>0)&&!(t.ct>0)&&t.f<fmaxT(t);

