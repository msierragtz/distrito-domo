import sys,re
src=open(sys.argv[1]).read()
hook="""window.__dd={get S(){return S},act,setTool:k=>{tool=k},recompute,DEFS,N,idx,LV,
 setSTV(v){STV=v;SPR.clear();LASTSPR.clear()},lc:(t,i)=>lvCost(t,i),cmpOutline(){const out={};const ks=['torre','edificio','ladrillo','cafe','resto','bar','padel','parque','plaza','escuela','clinica','cancha','domo','oficinas','tomates','dogpark','estac','caseta'];
  for(const k of ks){for(const lv of [1,4]){const t={k,s:5,lv,b:0,f:(DEFS[k]&&DEFS[k].f0)||0};const a=makeSprite(t,3,3,1);makeSprite(t,3,3,0,'cmp|'+k+lv);const b=makeSprite(t,3,3,1,'cmp|'+k+lv);
   const A=a.c.getContext('2d').getImageData(0,0,a.c.width,a.c.height).data,B=b.c.getContext('2d').getImageData(0,0,b.c.width,b.c.height).data;let n=0,mx=0;for(let i=0;i<A.length;i++){const dd=Math.abs(A[i]-B[i]);if(dd>2)n++;if(dd>mx)mx=dd}out[k+lv]=[n,mx,A.length/4]}}OUTC.clear();return out},
 missing(){let n=0,tot=0;const M=SPRL.get(NLO)||new Map();for(let i=0;i<N*N;i++){const t=S.g[i];if(t.k==='lote'||t.k==='part'||!hasObj(t,i%N,Math.floor(i/N))||t.b>0)continue;const q=P(i%N+.5,Math.floor(i/N)+.5);if(q[0]<-130||q[0]>bw+130||q[1]<-16||q[1]-215>bh)continue;tot++;const base=`${i}|${t.k}|${t.s}|${t.f||0}|${t.lv||1}|${ROT}||${NLO===1?WLATE:0}`;if(!M.get(base)&&!LASTSPR.get(base))n++}return n+' de '+tot},
 vehTile(type,dir,r,nb){const pr=ROT;ROT=r;VEHC.clear();const sp=vehSprite(type,dir,nb);ROT=pr;const c=document.createElement('canvas');c.width=sp.c.width;c.height=sp.c.height;const x=c.getContext('2d');x.fillStyle=nb?'#2a2f45':'#585d69';x.fillRect(0,0,c.width,c.height);x.drawImage(sp.c,0,0);VEHC.clear();return c.toDataURL()},
 cacheMB(){let px=0,n=0;const add=c=>{if(c&&c.width){px+=c.width*c.height;n++}};for(const M of SPRL.values())for(const sp of M.values())add(sp.c);const seen=new Set();for(const M of SPRL.values())for(const sp of M.values())seen.add(sp);for(const sp of LASTSPR.values())if(!seen.has(sp))add(sp.c);for(const sp of WSPR.values())add(sp.c);for(const sp of CARC.values())add(sp.c||sp);if(GC){add(GC);add(GSH)}for(const r of RIDGE)if(r)add(r.c);return {canvases:n,MB:+(px*4/1048576).toFixed(1),spr:[...SPRL.values()].reduce((a,M)=>a+M.size,0),last:LASTSPR.size,walk:WSPR.size}},
 timeRecompute(n){const t0=performance.now();for(let k=0;k<n;k++)recompute();return (performance.now()-t0)/n},
 timeTick(n){const t0=performance.now();for(let k=0;k<n;k++)tick(1/60,true);return (performance.now()-t0)/n},
 timeSave(){const t0=performance.now();const str=JSON.stringify(serialize());const t1=performance.now();return {ms:+(t1-t0).toFixed(1),KB:Math.round(str.length/1024)}},
 setRot(r){ROT=r},tile(k,lv,nb,ts){const t={k,s:ts||5,lv,b:0,f:0},W=110,H=124,c=mkCanvas(W,H),pc=ctx,pcam={ox:cam.ox,oy:cam.oy},pn=NIGHT,pnc=NCOL,pg=GLOWS,pr=ROT;
  try{ROT=0;ctx=hdctx(c);cam.ox=W/2;cam.oy=H-26;NIGHT=nb;NCOL=ncol(nb);GLOWS=null;drawGround(0,0,t);const sp=makeSprite(t,0,0,nb);cam.ox=W/2;cam.oy=H-26;NIGHT=nb;NCOL=ncol(nb);drawSprite(sp,0,0);liveSvc(t,0,0)}finally{ctx=pc;cam.ox=pcam.ox;cam.oy=pcam.oy;NIGHT=pn;NCOL=pnc;GLOWS=pg;ROT=pr}return c.toDataURL()},
 reset(){GKEY='';GC=null;SPR.clear();LASTSPR.clear();RIDGE.length=0},setPan(x,y,z){panX=x;panY=y;if(z){zoom=z;resize()}},setPause,
 get T(){return T},get cur(){return cur},P,get stats(){return stats},get cam(){return cam},get zoom(){return zoom},wi:typeof whatIs!=="undefined"?whatIs:null,ws:typeof whatShort!=="undefined"?whatShort:null,get NIGHT(){return NIGHT},tick,EVENTS,get perf(){return typeof PERF!=="undefined"?{r:PERF.r,f:PERF.f}:null}};
"""
anchor="window.claude?.hot?.snapshot?.("
assert anchor in src
src=src.replace(anchor,hook+anchor,1)
if 'refreshUI();render();' in src:
  src=src.replace('refreshUI();render();','refreshUI();{const __r0=performance.now();render();window.__rt=(window.__rt||0)*.97+(performance.now()-__r0)*.03}',1)
else:
  src=src.replace('render();perfStep(performance.now()-r0,rdt)','render();window.__rt=(window.__rt||0)*.97+(performance.now()-r0)*.03;perfStep(performance.now()-r0,rdt)',1)
assert '__rt' in src
open(sys.argv[2],'w').write(src)
