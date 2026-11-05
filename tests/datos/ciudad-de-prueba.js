(()=>{const d=__dd,S=d.S,N=d.N;let r=12345;const R=()=>(r=(r*16807)%2147483647)/2147483647;
S.$=1e9;S.unl=Object.keys(d.DEFS);S.maxV=2600;S.phase=3;S.seen=1;
const set=(k,i)=>{d.setTool(k);d.act(i)};
// especiales primero
const want=['domo','torreagua','mirador','cultura','kiosco'];
for(const k of want){for(let i=0;i<N*N;i++){const t=S.g[i];if(t.k===(k==='domo'?'lotedomo':'lote')){const before=JSON.stringify(S.g[i]);set(k,i);if(S.g[i].k===k||S.g[i].k!=='lote'&&S.g[i].k!=='lotedomo')break}}}
const types=['escuela','clinica','cancha','cancha','escuela','edificio','edificio','ladrillo','torre','torre','cafe','resto','bar','oficinas','parque','arbol','plaza','palma','estac','tomates','dogpark','padel'];
for(let i=0;i<N*N;i++){const x=i%N,y=Math.floor(i/N),t=S.g[i];if(t.k!=='lote')continue;if(i<N*N/2&&['escuela','clinica','cancha'].some(k=>(S.g.filter(q=>q.k===k).length<(k==='clinica'?1:2)))&&x%4&&y%5){const k=['escuela','clinica','cancha'].find(k=>S.g.filter(q=>q.k===k).length<(k==='clinica'?1:2));set(k,i);continue}
  if(x%4===0||y%5===0){set('calle',i);continue}
  const k=types[Math.floor(R()*types.length)];if(!d.DEFS[k])continue;set(k,i)}
for(const t of S.g){if(t.b>0)t.b=0;t.ct=0;t.ub=0;t.lu=0;const D=d.DEFS[t.k];if(D&&D.fmax){t.f=Math.max(t.f||0,Math.floor((D.f0||1)+R()*(D.fmax-(D.f0||1))))}if(d.LV[t.k])t.lv=1+Math.floor(R()*4)}
d.recompute();d.reset();d.setPause(true);d.setPan(0,0,2);
return 'ok'})()
