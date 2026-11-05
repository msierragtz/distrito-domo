/* fondo: cielo y la Sierra Madre (v54: sol, luna, estrellas que titilan, bruma por hora y siluetas de Las Mitras y La Huasteca) */
const ridges=[0,1,2].map(l=>{const r=rng(77+l),pts=[];let h=.5;for(let i=0;i<=70;i++){h+=(r()-.5)*(.5+l*.15)+(r()<.08?.35:0);h=Math.max(.15,Math.min(1,h));pts.push(h)}
  // la capa lejana lleva las coronas de Las Mitras y el lomo con su cuerno; la de en medio, el cañón de La Huasteca
  if(l===0){[.62,.8,.97,.74,1,.7,.93,.66,.86,.6].forEach((v,k)=>pts[14+k]=v);[.55,.72,.86,.9,.78,.62,.58,.66,.84,.96,.82].forEach((v,k)=>pts[50+k]=v)}
  if(l===1){[.8,.9,.95,.5,.22,.16,.3,.88,.92,.85].forEach((v,k)=>pts[34+k]=v)}
  return pts});
const RIDGE=[],RBASE=['#a7b3c2','#8796a8','#6c7c90'],RHAZE=[.6,.38,.2];
const STARS=(()=>{const r=rng(9),a=[];for(let i=0;i<120;i++)a.push([r(),r(),r(),r()<.12?2:1]);return a})();
// dónde va el sol (o la luna) en pantalla: a la altura del arco del día y del lado de donde vienen las sombras
function skyBody(ph){const s=sunAt(ph);if(!s)return null;const th=ph/.5*Math.PI,[ax,ay]=P(N/2,N/2),[bx,by]=P(N/2-s.dx,N/2-s.dy),vx=bx-ax,vy=by-ay,L=Math.hypot(vx,vy)||1;return {vx:vx/L,el:Math.sin(th)}}
function drawBack(sky){
  const g=ctx.createLinearGradient(0,0,0,bh);g.addColorStop(0,sky[0]);g.addColorStop(1,sky[1]);
  ctx.fillStyle=g;ctx.fillRect(0,0,bw,bh);
  const ph=S.clock/DAY,base=cam.oy+N*TH*.2,hz=base-34;
  // estrellas que titilan
  if(NIGHT>.45){const al=Math.min(1,(NIGHT-.45)*1.8);for(const [sx,sy,tw,sz] of STARS){const y=Math.floor(sy*Math.max(30,hz-20));const a=al*(.45+.55*Math.abs(Math.sin(T*(.6+tw*1.7)+tw*20)));if(a<.05)continue;ctx.fillStyle=`rgba(255,255,240,${a.toFixed(2)})`;ctx.fillRect(Math.floor(sx*bw),y,sz,sz);if(sz>1&&a>.7){ctx.fillRect(Math.floor(sx*bw)-1,y+.5,4,1)}}}
  // sol: blanco al mediodía, naranja cerca de la sierra, con halo
  const sun=skyBody(ph);
  if(sun){const x=bw/2+sun.vx*bw*.42,y=hz-sun.el*(hz-18)*.92,low=1-Math.min(1,sun.el*2.2),rad=6+low*3,col=mx('#fff6d6','#ff9a4a',low);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.35+low*.35;ctx.drawImage(gtex(mx('#fff0c0','#ff8a3a',low)),x-rad*6,y-rad*6,rad*12,rad*12);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.fillStyle=col;ctx.beginPath();ctx.arc(x,y,rad,0,7);ctx.fill()}
  // luna llena con sus manchas: sigue el mismo arco doce horas después
  const moon=ph>.5?skyBody(ph-.5):null;
  if(moon&&NIGHT>.15){const x=bw/2+moon.vx*bw*.42,y=hz-moon.el*(hz-18)*.92,a=Math.min(1,(NIGHT-.15)*2);
    ctx.globalCompositeOperation='lighter';ctx.globalAlpha=.25*a;ctx.drawImage(gtex('#9fb4ff'),x-30,y-30,60,60);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    ctx.globalAlpha=a;ctx.fillStyle='#f3efd8';ctx.beginPath();ctx.arc(x,y,5.5,0,7);ctx.fill();ctx.fillStyle='#d6d0b4';ctx.fillRect(Math.round(x-2),Math.round(y-2),2,2);ctx.fillRect(Math.round(x+1),Math.round(y+1),2,1);ctx.fillRect(Math.round(x-1),Math.round(y+2),1,1);ctx.globalAlpha=1}
  // nubes: blancas de día, con panza rosa al atardecer
  if(NIGHT<.6){const ca=1-NIGHT/.6,top=mx('#ffffff',sky[1],.25),bot=mx('#e9f1f8',sky[1],.55);ctx.globalAlpha=ca;
    for(let i=0;i<4;i++){const x=((i*173+T*3*(1+i*.3))%(bw+120))-60,y=18+i*17;ctx.fillStyle=top;ctx.fillRect(Math.round(x),y,34,6);ctx.fillRect(Math.round(x+6),y-4,18,4);ctx.fillStyle=bot;ctx.fillRect(Math.round(x+4),y+6,24,2)}ctx.globalAlpha=1}
  // un avión que cruza de vez en cuando (de noche solo se ven sus luces) y parvadas al amanecer y al atardecer
  {const cyc=95,p=(T%cyc)/30;if(p<1){const x=-20+p*(bw+40),y=hz*.28+Math.sin(T*.07)*4;
    if(NIGHT<.5){ctx.fillStyle=mx('#ffffff',sky[0],.25);ctx.fillRect(Math.round(x),Math.round(y),8,2);ctx.fillRect(Math.round(x)+2,Math.round(y)-2,2,2);ctx.fillRect(Math.round(x)+4,Math.round(y)+1,2,2);
      ctx.fillStyle=`rgba(255,255,255,${(.45*(1-NIGHT*2)).toFixed(2)})`;ctx.fillRect(Math.round(x)-22,Math.round(y)+1,22,1)}
    else{if(Math.floor(T*2)%2){ctx.fillStyle='#ff4040';ctx.fillRect(Math.round(x),Math.round(y),1,1)}if(Math.floor(T*1.3)%3===0){ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x)+5,Math.round(y),1,1)}glow(x+3,y,4,.5,'#ffffff')}}}
  if(NIGHT<.55&&(ph<.14||(ph>.4&&ph<.52))&&!lowMo()){const cyc=40,p=(T%cyc)/22;if(p<1){const x0=bw+20-p*(bw+60),y0=hz*.5;ctx.fillStyle=mx('#2a2f45',sky[1],.25);
    for(let k=0;k<7;k++){const row=Math.ceil(k/2),side=k%2?1:-1,x=Math.round(x0+row*5),y=Math.round(y0+side*row*3+Math.sin(T*3+k)*1),fl=Math.floor(T*6+k)%2;
      ctx.fillRect(x-2,y-fl,2,1);ctx.fillRect(x,y,1,1);ctx.fillRect(x+1,y-fl,2,1)}}}
  // resplandor de la zona metropolitana detrás de la sierra
  if(NIGHT>.2){const gg=ctx.createLinearGradient(0,hz-70,0,hz+10);gg.addColorStop(0,'rgba(255,140,70,0)');gg.addColorStop(1,`rgba(255,140,70,${(.22*NIGHT).toFixed(3)})`);ctx.fillStyle=gg;ctx.fillRect(0,hz-70,bw,80)}
  // la sierra: cada capa se mezcla con el horizonte (más lejos, más bruma) y se oscurece de noche
  const sb=Math.round(ph*48),nk=Math.round(NIGHT*24),rim=sun&&sun.el<.45?(1-sun.el/.45):0,rimSide=sun?Math.sign(sun.vx):0;
  ridges.forEach((pts,l)=>{
    const par=.15+l*.1,w=Math.ceil(bw*1.6),off=Math.round((panX/zoom)*par-bw*.3),hh=46+l*18,y0=Math.round(base-24+l*14),top=y0-hh-2,H=hh+6;
    let rc=RIDGE[l];const key=`${w}|${H}|${nk}|${sb}|${RES}|${OPT.hc?1:0}`;
    if(!rc||rc.key!==key){const c=mkCanvas(w,H),pc=ctx;ctx=hdctx(c,false);
      const col=mx(mx(RBASE[l],sky[1],RHAZE[l]),'#0a0f2c',NIGHT*(.55+l*.12)*(OPT.hc?.6:1));
      try{const pp=[[0,H]];pts.forEach((h,i)=>pp.push([Math.round(i*w/70),hh+2-Math.round(h*hh)]));pp.push([w,H]);ctx.fillStyle=col;rasterPoly(pp);
        // borde encendido del lado del sol cuando está bajo
        if(rim>.05&&l<2){ctx.fillStyle=mxa('#ffe0a0','#ff9a50',rim,.85*rim*(1-l*.35));for(let i=0;i<70;i++){const a=pp[i+1],b=pp[i+2];if((b[1]-a[1])*rimSide<=0)continue;for(let xx=a[0];xx<b[0];xx++){const yy=a[1]+(b[1]-a[1])*(xx-a[0])/(b[0]-a[0]);ctx.fillRect(xx,yy,1,1.5)}}}
        // de noche, lucecitas de las colonias en las faldas del cerro cercano
        if(l===2&&NIGHT>.35){const r=rng(31),al=Math.min(1,(NIGHT-.35)*2);for(let k=0;k<70;k++){const cx=r()*w,n=3+Math.floor(r()*6);for(let q=0;q<n;q++){const xx=Math.round(cx+(r()-.5)*14),yy=Math.round(H-2-r()*r()*Math.min(18,H*.35));
          ctx.fillStyle=r()<.82?`rgba(255,196,120,${(al*(.55+r()*.45)).toFixed(2)})`:`rgba(225,238,255,${(al*.7).toFixed(2)})`;ctx.fillRect(xx,yy,1,1)}}}
      }finally{ctx=pc}
      rc=RIDGE[l]={c,key,col}}
    ctx.drawImage(rc.c,off,top,w,H);if(top+H<bh){ctx.fillStyle=rc.col;ctx.fillRect(off,top+H,w,bh-top-H)}
  });
}
function drawEdges(){
  for(let i=0;i<N;i++){
    const a=Q(i,N),b=Q(i+1,N);poly([a,b,[b[0],b[1]+10],[a[0],a[1]+10]],'#a8744a');poly([a,b,[b[0],b[1]+2],[a[0],a[1]+2]],'#c4ad7c');
    const c=Q(N,i),d=Q(N,i+1);poly([c,d,[d[0],d[1]+10],[c[0],c[1]+10]],'#835833');poly([c,d,[d[0],d[1]+2],[c[0],c[1]+2]],'#b29b6c');
  }
}
