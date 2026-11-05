/* ===== ESTACIONAMIENTO ===== */
function artEstac(t,gx,gy,L){
  const s=t.s,cols=['#d64545','#f4f4f4','#3a6ea5','#2b2b2b','#9aa0a8','#e0b03b'];
  if(L===1){dsort(gx,gy,[[.3,.3,()=>car(gx+.3,gy+.3,cols[s%6],true)],[.66,.62,()=>car(gx+.66,gy+.64,cols[(s+2)%6])],
      [.8,.24,()=>{const [x,y]=P(gx+.8,gy+.24);px(x,y-7,.5,7,'#6e4a2c');px(x+.5,y-7,3,2,'#ff7a00');px(x+.5,y-5,2,1,'#ff7a00');px(x-3,y-2,2,2,'#d62828');px(x-3,y-2.5,2,.5,'#f4f4f4');poly([[x+3,y],[x+6,y],[x+4.5,y-4]],'#ff7a00');px(x+3.5,y-2,2,.5,'#ffffff')}],
      [.3,.78,()=>{const [x,y]=P(gx+.3,gy+.78);px(x-1,y-2,2,2,'#d62828');px(x-1,y-2.5,2,.5,'#f4f4f4')}]]);return}
  if(L===2){dsort(gx,gy,[[.26,.62,()=>car(gx+.26,gy+.62,cols[s%6])],[.5,.62,()=>car(gx+.5,gy+.62,cols[(s+1)%6])],[.74,.66,()=>car(gx+.74,gy+.66,cols[(s+3)%6])],
      [.16,.2,()=>{const g=cb(gx+.08,gy+.12,gx+.24,gy+.28,0,6,'#f4f4f2');face(g,'L',0,4.5,1,1.5,'#2f6db5');win(g,'R',.15,2,.7,2,'#7fb2d4')}],
      [.5,.2,()=>{const a=P(gx+.28,gy+.2),b=P(gx+.7,gy+.2);for(let k=0;k<8;k++){const f=k/8,f2=(k+1)/8;line(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-4,a[0]+(b[0]-a[0])*f2,a[1]+(b[1]-a[1])*f2-4,k%2?'#ffffff':'#d62828',false,2)}px(a[0]-.5,a[1]-4,1.5,4,'#555')}]]);return}
  if(L===3){dsort(gx,gy,[[.3,.3,()=>car(gx+.3,gy+.3,cols[s%6],true)],[.3,.7,()=>car(gx+.3,gy+.7,cols[(s+2)%6],true)],[.72,.5,()=>car(gx+.72,gy+.5,cols[(s+4)%6],true)]]);
    for(const [a,b] of [[.08,.08],[.92,.08],[.08,.92],[.92,.92],[.5,.08],[.5,.92]]){const [x,y]=P(gx+a,gy+b);px(x,y-9,1,9,'#8a9099')}
    poly([up(P(gx+.04,gy+.04),9),up(P(gx+.96,gy+.04),9),up(P(gx+.96,gy+.96),9),up(P(gx+.04,gy+.96),9)],'#1f3d66');
    for(let k=0;k<4;k++)for(let j=0;j<4;j++){const a=.07+k*.225,b=.07+j*.225;poly([up(P(gx+a,gy+b),9.2),up(P(gx+a+.2,gy+b),9.2),up(P(gx+a+.2,gy+b+.2),9.2),up(P(gx+a,gy+b+.2),9.2)],(k+j)%2?'#3a6ea5':'#335f90')}
    {const e=edges4(gx,gy,.04);for(const q of e.slice(2))line(q[0][0],q[0][1]-9,q[1][0],q[1][1]-9,'#c9cdd2')}
    return}
  // torre de estacionamiento
  const H=26,g=cb(gx+.08,gy+.08,gx+.92,gy+.92,0,H,'#9aa0a8','#80868e');
  for(let v=1;v<H-2;v+=6.5){face(g,'L',.04,v,.92,4,'#2f343c');face(g,'R',.04,v,.92,4,'#2a2e35');
    for(let k=0;k<4;k++){const u=.1+k*.22,c=cols[(k+Math.round(v)+s)%6];face(g,'L',u,v,.14,1.8,c);face(g,'L',u+.02,v+1.8,.1,.8,'#2b3a4d')}}
  face(g,'R',.7,0,.25,H,'#b9bec4');for(let v=2;v<H;v+=3)face(g,'R',.7,v,.25,.5,'#8a9099');
  {const [x,y]=P(gx+.5,gy+.92);px(x-3.5,y-H-5,7.5,4,'#1c1c1c');px(x-3,y-H-4.5,6.5,3,'#3fae5a',NIGHT>.2);px(x-2,y-H-3.5,4.5,1,'#c9f5d2',NIGHT>.2);glow(x,y-H-3,9,.6)}
}

/* ===== CASETA ===== */
function barrier(gx,gy,a,b,h=5){const p=P(gx+a,gy+b),q=P(gx+a,gy+b-.5);px(p[0],p[1]-h,1.5,h,'#555');for(let k=0;k<6;k++){const f=k/6,f2=(k+1)/6;line(p[0]+(q[0]-p[0])*f,p[1]-h+(q[1]-p[1])*f,p[0]+(q[0]-p[0])*f2,p[1]-h+(q[1]-p[1])*f2,k%2?'#ffffff':'#d62828',false,2)}}
function artCaseta(t,gx,gy,L){
  if(L===1){const g=cb(gx+.34,gy+.32,gx+.62,gy+.6,0,9,'#9aa0a8','#8a9099');for(let u=.05;u<1;u+=.12){face(g,'L',u,0,.03,9,'#8a9099');face(g,'R',u,0,.03,9,'#7a8088')}
    win(g,'L',.2,4,.6,2.5,'#7fb2d4');box(gx+.3,gy+.28,gx+.66,gy+.64,9,1,'#8a9099','#7a8088','#6a7078');barrier(gx,gy,.78,.84);return}
  if(L===2){{const [x,y]=P(gx+.18,gy+.2);px(x,y-15,1,15,'#555');for(const d of [-1,1]){px(x+(d>0?1:-3),y-15,3,1.5,'#e8e8e8');px(x+(d>0?3.5:-3.5),y-14.5,.5,.5,'#d62828',NIGHT>.2)}}
    const g=cb(gx+.32,gy+.3,gx+.68,gy+.66,0,10,'#f2f2f0','#cfcac2');face(g,'L',0,7,1,3,'#2f5d8c');face(g,'R',0,7,1,3,'#264b73');
    win(g,'L',.15,3,.7,3,'#7fb2d4');win(g,'R',.15,3,.7,3,'#6aa0c4');box(gx+.28,gy+.26,gx+.72,gy+.7,10,1.5,'#3a3a3a','#2b2b2b','#222');
    barrier(gx,gy,.78,.84);return}
  if(L===3){const g=cb(gx+.18,gy+.2,gx+.7,gy+.62,0,10,'#e8ecef','#3a4048');face(g,'L',0,8,1,2,'#2f5d8c');face(g,'R',0,8,1,2,'#264b73');
    face(g,'L',.08,2,.84,4.5,'#0f1b2d');for(let k=0;k<4;k++)face(g,'L',.12+k*.2,2.5,.16,1.6,['#4fb0e0','#59cd90','#4fb0e0','#ffd84d'][k],true);for(let k=0;k<4;k++)face(g,'L',.12+k*.2,4.4,.16,1.6,['#59cd90','#4fb0e0','#4fb0e0','#4fb0e0'][k],true);
    win(g,'R',.15,2,.7,4,'#6aa0c4');
    {const [x,y]=P(gx+.5,gy+.4);px(x,y-24,1,14,'#9aa0a8');for(let v=12;v<24;v+=3)line(x-1.5,y-v,x+1.5,y-v-3,'#9aa0a8');px(x,y-25,1,1,'#ff3b3b',true);glow(x,y-25,6,.7)}
    {const [x,y]=P(gx+.3,gy+.3);ellipse(x+1,y-13,3,2,'#f4f4f4');px(x+1,y-13,.5,2,'#888')}
    barrier(gx,gy,.82,.86);return}
  // seguridad privada 24/7
  const g=cb(gx+.3,gy+.28,gx+.66,gy+.64,0,11,'#3a3f47','#2b2f36');for(const s2 of ['L','R']){face(g,s2,.15,5,.7,.8,'#8fd3ff',true)}face(g,'L',0,9.5,1,1.5,'#c9a227');
  box(gx+.26,gy+.24,gx+.7,gy+.68,11,1.5,'#1f2228','#16181c','#101215');
  barrier(gx,gy,.8,.86,6);
  dsort(gx,gy,[[.2,.8,()=>{car(gx+.2,gy+.8,'#f4f4f4');const [x,y]=P(gx+.2,gy+.8);px(x-1.5,y-5,1.5,1,Math.floor(T*4)%2?'#3b82f6':'#d62828',true);px(x,y-5,1.5,1,Math.floor(T*4)%2?'#d62828':'#3b82f6',true)}],
    [.14,.2,()=>{const [x,y]=P(gx+.14,gy+.2);px(x,y-18,1,18,'#555');px(x-2,y-19,5,2,'#e8e8e8');px(x-1.5,y-18.5,4,1,NIGHT>.2?'#fffbe0':'#cfcfcf',NIGHT>.2);glow(x,y-18,14,.8)}],
    ]);
}

