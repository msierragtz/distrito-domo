/* bot de balance: juega con la lógica real del juego (dentro del cierre), acelerado */
function __botRun(cfg){
  let seed=cfg.seed>>>0;const rnd=()=>{seed=(seed+0x6D2B79F5)>>>0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296};
  const oldR=Math.random;Math.random=rnd;const oldSave=save;save=()=>{};const oldSay=say;say=()=>{};
  try{
  prep(newGame());S.seen=1;recompute();
  const free=()=>{const o=[];for(let i=0;i<N*N;i++){const t=S.g[i];if((t.k==='lote'||t.k==='arbol')&&connected(i%N,Math.floor(i/N)))o.push(i)}return o};
  const dist=(i,j)=>Math.abs(i%N-j%N)+Math.abs(Math.floor(i/N)-Math.floor(j/N));
  const ok=k=>S.unl.includes(k)&&DEFS[k]&&!(DEFS[k].max&&(stats.counts[k]||0)>=DEFS[k].max);
  const put=(k,i)=>{const m=S.$,before=S.g[i].k;tool=k;act(i);return S.$<m||S.g[i].k!==before};
  const L={t:0,ms:{},log:[],builds:0,ups:0,floors:0,lots:0,idle:0,red:0,peakCash:0,sat:[],tAgua:0,tSat:0,tLleno:0,tRico:0,tPobre:0};
  const MS=[100,300,500,1000,2000,3000,4000,5000];
  const COMF={fam:['tomates','resto','escuela','plaza','unas','paleteria','boliche','cine'],pro:['cafe','resto','oficinas','padel','barber','gym','cine'],est:['cafe','bar','tomates','barber','paleteria','boliche']};
  const wantNeed=(b)=>{const k=b.wk;if(k==='verde')return ok('cancha')&&cfg.smart&&rnd()<.3?['cancha','parque']:['parque','plaza'];if(k==='park')return['estac'];if(k==='dog')return['dogpark'];
    const g=b.wg||'fam';return COMF[g]};
  const cheapestHome=()=>{let best=null;
    for(const t of S.g){const d=DEFS[t.k];if(!d||!d.per||t.b>0||t.ub>0||t.ct>0||t.lu>0)continue;if(t.f>=fmaxT(t))continue;const c=upCost(t)/d.per;if(!best||c<best.c)best={c,i:S.g.indexOf(t),k:t.k}}
    const fl=free();if(fl.length){for(const k of ['edificio','ladrillo','torre']){if(!ok(k))continue;const d=DEFS[k],c=costOf(k)/(d.f0*d.per)*(cfg.smart?1:.7);if(!best||c<best.c)best={c,i:fl[Math.floor(rnd()*fl.length)],k,nw:1}}}
    return best};
  const growStreets=()=>{let n=0;const cand=[];for(let i=0;i<N*N;i++){const t=S.g[i],x=i%N,y=Math.floor(i/N);if(!(t.k==='lote'||t.k==='arbol'))continue;if(!connected(x,y))continue;if(x%3===0||y%4===0)cand.push(i)}
    for(const i of cand.sort(()=>rnd()-.5)){if(n>=3)break;if(put('calle',i))n++}return n};
  const buyLot=()=>{const ps=[];for(const p in PARCELS){if(S.maxV<PARCELS[p].unlock)continue;const i=S.g.findIndex(t=>isParcel(t)&&t.p===p);if(i>=0)ps.push([lotPrice(p),i,p])}ps.sort((a,b)=>a[0]-b[0]);
    if(!ps.length)return false;const [c,i]=ps[0];if(S.$<c+cfg.reserve)return false;tool='calle';pendLot=null;act(i);act(i);if(!isParcel(S.g[i])){L.lots++;return true}return false};
  const turn=()=>{let acts=0;const A=()=>++acts>=cfg.acts;
    if(cfg.mis!==false&&typeof misClaim==='function'&&S.mis&&S.mis.ready.length){for(const id of [...S.mis.ready]){misClaim(id);L.misT=L.misT||{};L.misT[id]=Math.round(L.t0||0)}}
    if(cfg.mis!==false&&typeof misSwap==='function'&&S.mis&&!(S.mis.swapT>0)){for(const tp of ['barrio','vecinos','reto']){const id=S.mis.on[tp],st=id&&S.mis.st[id];if(st&&!S.mis.ready.includes(id)&&(S.mis.clk-(st.t0||0))>900){misSwap(tp);L.swaps=(L.swaps||0)+1;break}}}
    if(cfg.neglectAt&&S.maxV>=cfg.neglectAt){const h=cheapestHome();if(h&&S.$>=(h.nw?costOf(h.k):upCost(S.g[h.i]))){put(h.k,h.i)}return}
    if(cfg.water&&ok('torreagua')&&(stats.wpen>0||S.v>(stats.wcap||1000)*.9)&&S.$>=costOf('torreagua')+cfg.reserve){const fl=free();if(fl.length&&put('torreagua',fl[Math.floor(rnd()*fl.length)])){L.builds++;if(A())return}}
    // obras grandes: si ya se abrieron y alcanza el dinero, se pone la primera que quepa
    if(cfg.smart&&typeof OBRAS!=='undefined'){for(const k of OBRAS){if(!ok(k)||S.$<costOf(k)*1.15+cfg.reserve)continue;let at=-1;for(let i=0;i<N*N&&at<0;i++){const tf=toolFoot(i,k);if(tf&&footConnected(tf.f))at=i}
      if(at>=0&&put(k,at)){L.builds++;L.obras=L.obras||{};L.obras[k]=Math.round(L.t0||0);if(A())return}break}}
    if(cfg.domo&&ok('domo')&&S.$>=costOf('domo')+cfg.reserve){const i=S.g.findIndex(t=>t.k==='lotedomo');if(i>=0&&put('domo',i)){L.builds++;if(A())return}}
    // necesidades del edificio peor atendido
    if(!(cfg.ignore&&rnd()<cfg.ignore)){const B=(stats.B||[]).filter(b=>b.wk&&b.worst<cfg.needT).sort((a,b)=>a.worst-b.worst);
      for(const b of B.slice(0,cfg.smart?3:1)){const ks=wantNeed(b).filter(ok);if(!ks.length)continue;const fl=free().filter(j=>dist(j,b.i)<=3).sort((p,q)=>dist(p,b.i)-dist(q,b.i));if(!fl.length)continue;
        for(const k of ks){if(S.$<costOf(k)+cfg.reserve)continue;if(put(k,fl[0])){L.builds++;break}}if(A())return}}
    // más vivienda cuando ya se está llenando
    if(stats.cap===0||S.v>=stats.cap*cfg.fill){const h=cheapestHome();if(h){const c=h.nw?costOf(h.k):upCost(S.g[h.i]);if(S.$>=c+cfg.reserve){if(put(h.k,h.i)){h.nw?L.builds++:L.floors++;if(A())return}}}}
    // terrenos: calles nuevas y compra de terrenos
    if(free().length<cfg.minLots){if(!growStreets()&&cfg.buy&&rnd()<cfg.buy)buyLot()}
    else if(cfg.buy&&S.$>cfg.reserve*4&&rnd()<cfg.buy*.3)buyLot();
    // mejorar
    if(cfg.up&&rnd()<cfg.up&&stats.VAL){const c=[];S.g.forEach((t,i)=>{if(LV[t.k]&&!(t.b>0)&&!(t.lu>0)&&lvOf(t)<4&&stats.VAL[i]>=LVTH[lvOf(t)+1])c.push([lvCost(t,i)*(isBiz(t.k)?.7:1),i])});c.sort((a,b)=>a[0]-b[0]);
      for(const [cc,i] of c.slice(0,2)){if(S.$<cc+cfg.reserve)break;if(put('mejorar',i)){L.ups++;if(A())return}}}
    // el novato a veces construye un negocio o adorno al azar
    if(cfg.random&&rnd()<cfg.random){const ks=['cafe','bar','parque','palma','padel','tomates','plaza'].filter(ok),fl=free();if(ks.length&&fl.length){const k=ks[Math.floor(rnd()*ks.length)];if(S.$>=costOf(k)+cfg.reserve&&put(k,fl[Math.floor(rnd()*fl.length)]))L.builds++}}
    if(!acts)L.idle++};
  let next=0,lastV=0,stuck=0;const dt=1;
  for(let t=0;t<cfg.maxT;t+=dt){
    tick(dt,true);L.t0=t;if(S.$<0)L.red+=dt;if(stats.wpen>0)L.tAgua+=dt;if(stats.sat<.5)L.tSat+=dt;if(stats.cap&&S.v>=stats.cap*.97)L.tLleno+=dt;if(S.$>20000+S.v*20)L.tRico+=dt;if(S.$<300)L.tPobre+=dt;if(S.$>L.peakCash)L.peakCash=S.$;
    if(t>=next){next=t+cfg.every*(.7+rnd()*.6);turn()}
    if(S.v>=3000&&t%30===0&&typeof lowG==='function'){const B_=L.big=L.big||{lowG:0,proSat:0,park:0,green:0,gst:0,biz:0,biz4:0,cines3:0,cineUnl:0,pro:0};B_.lowG=Math.max(B_.lowG,+lowG().toFixed(2));if(S.pop.pro>=400)B_.proSat=Math.max(B_.proSat,+stats.gs.pro.toFixed(2));B_.pro=Math.max(B_.pro,Math.round(S.pop.pro));
      B_.park=Math.max(B_.park,+stats.sc.park.toFixed(2));B_.green=Math.max(B_.green,greenCnt());B_.gst=Math.max(B_.gst,greenStreets());const bs=bizStreet();B_.biz=Math.max(B_.biz,bs.d);B_.biz4=Math.max(B_.biz4,bs.l4);B_.cines3=Math.max(B_.cines3,mCnt(q=>q.k==='cine'&&lvOf(q)>=3));B_.cineUnl=S.unl.includes('cine')?1:0;B_.on=Object.values(S.mis.on).join(',')}
    for(const m of MS)if(L.ms[m]==null&&S.v>=m)L.ms[m]=t;
    if(t%10===0){L.hist=L.hist||[];L.hist.push(S.v);if(L.hist.length>7)L.hist.shift();if(!L.drop&&L.hist.length===7&&S.v<L.hist[0]*.9&&L.hist[0]>800){const g=stats.gs||{};
      L.drop={t,de:Math.round(L.hist[0]),a:Math.round(S.v),gs:Object.fromEntries(Object.entries(g).map(([k,v])=>[k,+v.toFixed(2)])),pop:Object.fromEntries(Object.entries(S.pop).map(([k,v])=>[k,Math.round(v)])),mix:Object.fromEntries(Object.entries(stats.mix||{}).map(([k,v])=>[k,Math.round(v)])),
        sc:Object.fromEntries(Object.entries(stats.sc||{}).map(([k,v])=>[k,+v.toFixed(2)])),ev:S.ev&&S.ev.id,wpen:+(stats.wpen||0).toFixed(2),nuis:+(stats.nuis||0).toFixed(2),noise:+(stats.noise||0).toFixed(2),dis:stats.dis&&Object.fromEntries(Object.entries(stats.dis).map(([k,v])=>[k,+v.toFixed(2)])),dinero:Math.round(S.$),ingreso:+(stats.income||0).toFixed(1),cap:Math.round(stats.cap)}}}
    if(t%60===0){L.log.push([t,Math.round(S.v),Math.round(S.$),+stats.sat.toFixed(2),Math.round(stats.cap)]);L.sat.push(stats.sat)}
    if(cfg.stop&&S.v>=cfg.stop){L.ms.fin=t;break}}
  L.t=Math.min(cfg.maxT,L.ms.fin||cfg.maxT);L.vFin=Math.round(S.v);L.cash=Math.round(S.$);L.lv4=S.g.filter(t=>LV[t.k]&&lvOf(t)===4).length;L.lvAll=S.g.filter(t=>LV[t.k]).map(t=>lvOf(t)).reduce((a,b)=>a+b,0);
  L.torres=S.g.filter(t=>t.k==='torre').length;L.misN=S.mis?S.mis.done.length:0;L.nuevos=['barber','unas','paleteria','boliche','gym','cine','golf'].map(k=>k+':'+S.g.filter(t=>t.k===k).length).join(' ');L.agua=S.g.filter(t=>t.k==='torreagua').length;L.misBig=S.mis?S.mis.done.filter(id=>MISI[id]&&MISI[id].big):[];L.domo=S.g.some(t=>t.k==='domo');
  return L}finally{Math.random=oldR;save=oldSave;say=oldSay}}
window.__bot=__botRun;
