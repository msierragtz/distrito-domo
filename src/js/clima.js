/* ---------- clima (v65): reflejos en los charcos y relámpagos ----------
   De noche con lluvia, cada poste y cada negocio con letrero dejan un reflejo que tiembla sobre el piso mojado.
   Los relámpagos caen detrás de la ciudad (sobre la sierra), iluminan todo un instante y el trueno llega después.
   Con «Menos movimiento» no hay destellos: solo se oye el trueno. */
let BOLT=null,BOLTN=6,BOLTT=0;
function glint(x,y,c,a,s,len){const n=len||7;ctx.globalAlpha=Math.min(1,a*.9);ctx.drawImage(gtex(c),x-9,y-2.5,18,6.5);ctx.fillStyle=c;
  for(let k=0;k<n;k++){const w=(4.2-k*.42)*(.65+.35*Math.sin(T*6+k*1.7+s)),al=a*(1-k/(n+.5));if(al<.01||w<=.2)continue;
    ctx.globalAlpha=al;ctx.fillRect(Math.round((x-w/2+(lowMo()?0:Math.sin(T*3.1+k*.9+s)*.7))*RES)/RES,y+k*1.6,w,.6)}}
function rainGlints(){if(lowQ()||NIGHT<.25||!WXA)return;const a=WXA*Math.min(1,(NIGHT-.25)*2.2);
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(const [x,y] of streets){if((x*3+y)%4!==0)continue;const [sx,sy]=P(x+.16,y+.5);if(sx<-20||sx>bw+20||sy<-20||sy>bh+30)continue;glint(sx+.5,sy+1.5,'#ffd9a0',a*.85,x*7+y,8)}
  for(const e of EARN.values()){const t=S.g[e.i];if(!t||t.b>0)continue;const [dw,dh]=DIMT(t),[sx,sy]=P(e.i%N+dw/2,Math.floor(e.i/N)+dh/2);if(sx<-30||sx>bw+30||sy<-20||sy>bh+30)continue;
    glint(sx,sy+2+TH*.25*(dw+dh-2),NEON[t.k]||'#ffb86a',a*.6,e.i,6)}
  ctx.restore();ctx.globalAlpha=1}
// rayo: una línea quebrada con una rama, de arriba de la pantalla hasta la sierra
function mkBolt(){const x0=bw*(.08+Math.random()*.84),y1=bh*(.18+Math.random()*.12),pts=[[x0,-4]];let x=x0,y=-4;
  while(y<y1){y+=4+Math.random()*7;x+=(Math.random()-.5)*12;pts.push([x,y])}const k=2+Math.floor(Math.random()*(pts.length-3)),br=[pts[k]];let bx=pts[k][0],by=pts[k][1];
  for(let q=0;q<4;q++){by+=4+Math.random()*5;bx+=(Math.random()<.5?-1:1)*(3+Math.random()*6);br.push([bx,by])}return {pts,br}}
function weatherStep(){const dt=Math.min(.1,Math.max(0,T-BOLTT));BOLTT=T;if(TITLE||WXA<.55){BOLT=null;return}
  BOLTN-=dt;if(BOLTN<=0){BOLTN=5+Math.random()*9;if(!lowMo())BOLT={t:0,...mkBolt()};setTimeout(()=>sfx('trueno'),350+Math.random()*1300)}
  if(BOLT){BOLT.t+=dt;if(BOLT.t>.42)BOLT=null}}
const boltK=()=>{if(!BOLT)return 0;const t=BOLT.t;return t<.06?1:t<.12?.25:t<.2?.85:t<.42?Math.max(0,.6-(t-.2)*2.6):0};
function drawBolt(){const k=boltK();if(!k)return;ctx.save();ctx.globalCompositeOperation='lighter';
  for(const [w,c,al] of [[4,'#7f9cff',.35],[1.6,'#e8eeff',1]]){ctx.strokeStyle=c;ctx.globalAlpha=al*k;ctx.lineWidth=w;ctx.lineJoin='round';
    for(const L of [BOLT.pts,BOLT.br]){ctx.beginPath();L.forEach((p,q)=>q?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.stroke()}}
  ctx.restore()}
function boltFlash(){const k=boltK();if(!k)return;ctx.fillStyle=`rgba(214,226,255,${(k*(.12+.16*NIGHT)).toFixed(3)})`;ctx.fillRect(0,0,bw,bh)}
