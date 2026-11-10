/* ===== trofeos ===== */
function domoArc(x,y,R,th){arcTop(x,y,R,th,'#f26a21',NIGHT>.2);arcTop(x,y,R,Math.max(.5,th*.3),'#ff9a5c',NIGHT>.2)}
/* 500 B · Kiosco de la música */
function trKiosco(t,gx,gy){
  const [x,y]=P(gx+.5,gy+.5);
  cb(gx+.18,gy+.18,gx+.82,gy+.82,0,2,'#d9c6a5');cb(gx+.24,gy+.24,gx+.76,gy+.76,2,1,'#e8dcc4');
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2,fx=gx+.5+Math.cos(a)*.24,fy=gy+.5+Math.sin(a)*.24,[px0,py0]=P(fx,fy);if(Math.sin(a)+Math.cos(a)<0)px(px0,py0-14,1,11,'#f4f4f4')}
  ellipse(x,y-14,13,6.5,'#1f5a3c');ellipse(x,y-14.5,12,6,'#2f7d55');arcTop(x,y-14,10,10,'#2f7d55');arcTop(x-2,y-15.5,5,1.2,'#59b04f');
  for(let k=0;k<12;k++){const a=k/12*Math.PI*2;px(x+Math.cos(a)*12.5,y-14+Math.sin(a)*6.2,1,1.5,NIGHT>.2?'#ffe19a':'#f4efe2',NIGHT>.2);if(k%3===0)glow(x+Math.cos(a)*12.5,y-13+Math.sin(a)*6.2,5,.5)}
  px(x-.5,y-27,1,3,'#c9a227');circ(x,y-27.5,1.2,'#f2c94c');
  for(let k=0;k<8;k++){const a=k/8*Math.PI*2,fx=gx+.5+Math.cos(a)*.24,fy=gy+.5+Math.sin(a)*.24,[px0,py0]=P(fx,fy);if(Math.sin(a)+Math.cos(a)>=0)px(px0,py0-14,1,11,'#f4f4f4')}
  // atriles y una tuba dorada
  {const [ax,ay]=P(gx+.42,gy+.5);px(ax,ay-6,.5,4,'#3a3a3a');px(ax-1,ay-7,2.5,1,'#3a3a3a');const [bx,by]=P(gx+.6,gy+.48);circ(bx,by-6,2,'#c9a227');px(bx-.5,by-10,1,4,'#c9a227');px(bx-1,by-11,2,1,'#f2c94c')}
  dsort(gx,gy,[[.08,.5,()=>bench(gx+.08,gy+.5,'#7a5a3c')],[.92,.5,()=>bench(gx+.92,gy+.5,'#7a5a3c')],[.12,.12,()=>lamp(gx+.1,gy+.1)],[.9,.9,()=>lamp(gx+.92,gy+.92)]]);
}
/* 1000 B · Mirador del Distrito */
function trMirador(t,gx,gy){
  const SD=sidesOf(gx+.38,gy+.38,gx+.62,gy+.62);SD.L.__s='L';SD.R.__s='R';
  cb(gx+.25,gy+.25,gx+.75,gy+.75,0,2,'#cfc8bc');
  const g=box(gx+.38,gy+.38,gx+.62,gy+.62,2,44,'#d9d4ca','#ece6da','#cdc6b8');
  for(let v=4;v<44;v+=4){face(g,'L',0,v,1,.4,'#d6cfc2');face(g,'R',0,v,1,.4,'#bdb6a8')}
  face(g,'L',.35,0,.3,5,'#3d3d46');for(let v=10;v<40;v+=8)face(g,'R',.4,v,.2,2.5,'#6fa3c7');
  const d=box(gx+.28,gy+.28,gx+.72,gy+.72,46,7,'#3a3f47','#9fd0ee','#7fb0cf');face(d,'L',0,0,1,1,'#2b2b2b');face(d,'R',0,0,1,1,'#2b2b2b');for(const u of [.33,.66]){face(d,'L',u,0,.015,7,'#2b2b2b');face(d,'R',u,0,.015,7,'#2b2b2b')}
  if(NIGHT>.2){face(d,'L',.02,1,.96,5,'rgba(255,226,168,.55)',true);face(d,'R',.02,1,.96,5,'rgba(255,226,168,.45)',true)}
  box(gx+.26,gy+.26,gx+.74,gy+.74,53,1.2,'#f4f3ef','#e6e3dc','#cfccc5');
  const [x,y]=P(gx+.5,gy+.5);domoArc(x,y-60,6,2);px(x-.25,y-68,.5,6,'#555');px(x,y-68,4,2.5,'#f26a21');glow(x,y-50,16,.6);
}
/* 2000 B · Centro Cultural Cañón */
function trCultura(t,gx,gy){
  const H=12,g=cb(gx+.12,gy+.14,gx+.88,gy+.78,0,H,'#f4f2ee','#e6e3dc');
  win(g,'L',.06,0,.88,8,'#ffe2a8');for(const u of [.25,.5,.75])face(g,'L',u,0,.012,8,'#3a3a3a');face(g,'L',.04,8,.92,1,'#3a3a3a');
  win(g,'R',.08,1,.84,6,'#f2d090');
  for(const [u,c] of [[.12,'#d62828'],[.3,'#2a9d8f'],[.48,'#f2c94c'],[.66,'#8e44ad'],[.84,'#3a6ea5']]){face(g,'L',u,H-3.5,.06,3,c)}
  const [x,y]=P(gx+.5,gy+.46);arcTop(x,y-H,15,15,'#f26a21');arcTop(x,y-H,15,2,'#d1561a');arcTop(x-3,y-H-2,7,1.5,'#ff9a5c');
  for(let k=0;k<5;k++){const a=Math.PI*(k+.5)/5;px(x-Math.cos(a)*12,y-H-Math.sin(a)*12,1,1,'#ffe2a8',NIGHT>.2)}
  cb(gx+.18,gy+.8,gx+.82,gy+.86,0,1,'#d9d4ca');cb(gx+.22,gy+.86,gx+.78,gy+.92,0,.5,'#cfc8bc');
  glow(x,y-6,18,.5);
}
/* 3000 A · Teleférico a La Huasteca */
function telGeo(gx,gy){const [tx,ty]=P(gx+.78,gy+.3),[sx,sy]=P(gx+.36,gy+.6);return{tx,ty,a0:[sx,sy-11],a1:[tx-4,ty-41],a2:[tx+20,ty-60]}}
function trTeleferico(t,gx,gy){
  const g=cb(gx+.12,gy+.42,gx+.6,gy+.88,0,9,'#f4f2ee','#3a3f47');win(g,'L',.08,1,.84,5,'#9fd0ee');face(g,'L',0,7,1,2,'#d62828');face(g,'R',0,7,1,2,'#b81f1f');win(g,'R',.1,1,.5,5,'#8cc2e4');
  const G=telGeo(gx,gy),tx=G.tx,ty=G.ty;
  line(tx-4,ty,tx-1,ty-40,'#8a9099',false,2);line(tx+4,ty,tx+1,ty-40,'#8a9099',false,2);for(let v=6;v<38;v+=6){line(tx-4+v*.075,ty-v,tx+4-v*.075,ty-v-6,'#8a9099');line(tx+4-v*.075,ty-v,tx-4+v*.075,ty-v-6,'#8a9099')}
  px(tx-5,ty-42,10,2,'#5a5f6b');
  line(G.a0[0],G.a0[1],G.a1[0],G.a1[1],'#2b2b2b');line(G.a1[0],G.a1[1],G.a2[0],G.a2[1],'#2b2b2b');
  const [lx,ly]=P(gx+.36,gy+.86);px(lx-6,ly-15,12,3,'#1c1c1c');px(lx-5,ly-14.5,10,2,'#f2c94c',NIGHT>.2);
}
function telCabins(gx,gy){const G=telGeo(gx,gy),segs=[[G.a0,G.a1],[G.a1,G.a2]];
  for(let k=0;k<3;k++){let f=((T*.04)+k/3)%1,up=f<.5;f=up?f*2:(1-f)*2;const L1=Math.hypot(G.a1[0]-G.a0[0],G.a1[1]-G.a0[1]),L2=Math.hypot(G.a2[0]-G.a1[0],G.a2[1]-G.a1[1]),d=f*(L1+L2);
    const [p0,p1,q]=d<L1?[G.a0,G.a1,d/L1]:[G.a1,G.a2,(d-L1)/L2],x=p0[0]+(p1[0]-p0[0])*q,y=p0[1]+(p1[1]-p0[1])*q;
    px(x,y,.5,3,'#2b2b2b');px(x-2.5,y+3,5.5,4,'#d62828',true);px(x-2,y+3.5,4.5,1.5,NIGHT>.2?'#ffe9a8':'#9fd0ee',true)}}

