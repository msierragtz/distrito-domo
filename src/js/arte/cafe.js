/* ===== CAFÉ ===== */
function artCafe(t,gx,gy,L){
  if(L===1){ // café de olla: carrito con sombrilla
    dsort(gx,gy,[
      [.48,.48,()=>{const g=cb(gx+.36,gy+.4,gx+.62,gy+.56,1.5,4.5,'#8a5a3a','#b07a4e');face(g,'L',0,2.5,1,.5,'#f2c94c');
        for(const [a,b] of [[.4,.56],[.58,.56]]){const [x,y]=P(gx+a,gy+b);circ(x,y-1,1.5,'#2b2b2b');circ(x,y-1,.5,'#888')}
        const [x,y]=P(gx+.46,gy+.46);circ(x,y-8,2.5,'#a0522d');px(x-2,y-9,4,.5,'#c46a3a');px(x-1,y-11,2.5,1,'#5a2d17');smokeH(x,y-11);
        px(x+3.5,y-8,1.5,1.5,'#f4efe2');px(x+5,y-8.5,1.5,2,'#f4efe2')}],
      
      [.72,.7,()=>stoolH(gx+.72,gy+.7,'#2f6db5')],[.62,.82,()=>stoolH(gx+.6,gy+.82,'#d62828')]]);
    {const [x,y]=P(gx+.5,gy+.46);px(x,y-12,.5,12,'#7a7a7a');parasol(x+.25,y-12,7.5,['#f26a21','#ffffff'],1.2)}
    {const [x,y]=P(gx+.15,gy+.86);px(x,y-5,.5,5,'#6e4a2c');board(x-3.5,y-10,7.5,5,'#f4efe2',[[1,1,5.5,'#8a5a3a'],[1,2.5,4,'#8a5a3a'],[1,3.5,5,'#2b2b2b']])}
    return}
  if(L===2){ // cafetería de barrio
    const H=12,g=cb(gx+.12,gy+.12,gx+.6,gy+.62,0,H,'#c2603e','#b9b3a7');
    face(g,'L',0,0,1,1,'#7a3a22');face(g,'R',0,0,1,1,'#6a3220');
    win(g,'L',.08,1.5,.84,5,'#7fb2d4');face(g,'L',.5,1.5,.02,5,'#3a3a3a');win(g,'R',.12,1.5,.4,5,'#6aa0c4');face(g,'R',.62,0,.26,6.5,'#3d3d46');
    for(let k=0;k<7;k++)face(g,'L',k/7,7,1/7,2,k%2?'#ffffff':'#2a9d8f',NIGHT>.3&&k%2===0);
    face(g,'L',.1,9.5,.8,2,'#f4efe2');face(g,'L',.15,10,.5,.75,'#7a3a22');
    box(gx+.1,gy+.1,gx+.62,gy+.64,H,1,'#5a4a40','#4a3c34','#3a2e28');
    dsort(gx,gy,[
      [.78,.3,()=>{chairH(gx+.86,gy+.25,'#2b2b2b');tableH(gx+.78,gy+.31,'#e8e2d6');chairH(gx+.7,gy+.38,'#2b2b2b')}],
      [.4,.8,()=>{chairH(gx+.48,gy+.76,'#2b2b2b');tableH(gx+.4,gy+.82,'#e8e2d6');chairH(gx+.32,gy+.88,'#2b2b2b')}],
      [.8,.78,()=>{const [x,y]=P(gx+.8,gy+.78);board(x-2,y-6.5,4.5,5,'#2b2b2b',[[.5,.5,3.5,'#f4f4f4'],[.5,2,2.5,'#ffd84d'],[.5,3,3,'#f4f4f4']]);px(x-2,y-1.5,.5,1.5,'#555');px(x+2,y-1.5,.5,1.5,'#555')}]]);
    return}
  if(L===3){ // café de especialidad
    const H=12,g=cb(gx+.12,gy+.12,gx+.62,gy+.66,0,H,'#d9b98c','#3a3a3a');
    for(let u=.03;u<1;u+=.06){face(g,'L',u,6.5,.02,H-6.5,'#c4a173');face(g,'R',u,6.5,.02,H-6.5,'#b08c60')}
    face(g,'L',.06,0,.88,6.5,'#1f1f1f');win(g,'L',.09,.5,.82,5.5,'#9fc4dc');face(g,'L',.5,.5,.02,5.5,'#1f1f1f');
    face(g,'R',.06,0,.5,6.5,'#1f1f1f');win(g,'R',.09,.5,.44,5.5,'#8cb6d2');
    {const [x,y]=P(gx+.36,gy+.66);px(x-3,y-H+1,6,3,'#1f1f1f');px(x-2,y-H+1.5,3,2,'#f4efe2',NIGHT>.2);px(x+1,y-H+2,1,1,'#f4efe2',NIGHT>.2);glow(x,y-H+2,8,.5)}
    box(gx+.1,gy+.1,gx+.64,gy+.68,H,.5,'#2b2b2b','#222','#1a1a1a');
    dsort(gx,gy,[
      [.82,.3,()=>planter(gx+.84,gy+.24,.42)],
      [.78,.62,()=>{const [x,y]=P(gx+.78,gy+.62);circ(x-2.5,y-2,2,'#2b2b2b');circ(x-2.5,y-2,1.3,'#ece8e0');circ(x+2.5,y-2,2,'#2b2b2b');circ(x+2.5,y-2,1.3,'#ece8e0');line(x-2.5,y-2,x,y-4.5,'#2a9d8f');line(x,y-4.5,x+2.5,y-2,'#2a9d8f');line(x-1,y-4.5,x+1.5,y-4.5,'#2a9d8f');px(x-1.5,y-5.5,1.5,.5,'#2b2b2b')}],
      [.4,.82,()=>{const [x,y]=P(gx+.4,gy+.84);board(x-2,y-6,4.5,4.5,'#2b2b2b',[[.5,.5,3.5,'#f4f4f4'],[.5,2,2,'#f4f4f4']]);line(x-2,y-1.5,x-2.5,y,'#5a4632');line(x+2,y-1.5,x+2.5,y,'#5a4632')}],
      ]);
    return}
  // brunch y concept store: dos pisos, enredadera, terraza
  const H=17,g=cb(gx+.1,gy+.1,gx+.62,gy+.7,0,H,'#f4f2ee','#c9c5bd');
  face(g,'L',.04,0,.92,7,'#2b2b2b');win(g,'L',.07,.5,.86,6,'#ffe2a8');face(g,'L',.5,.5,.02,6,'#2b2b2b');
  face(g,'R',.06,0,.6,7,'#2b2b2b');win(g,'R',.09,.5,.54,6,'#f2d090');
  win(g,'L',.1,9.5,.35,5,'#9fc4dc');win(g,'L',.55,9.5,.35,5,'#9fc4dc');win(g,'R',.15,9.5,.5,5,'#8cb6d2');
  for(const [u,v] of [[.0,7],[.06,9],[.02,12],[.1,14.5],[.9,8],[.86,11]]){face(g,'L',u,v,.1,2,'#3f8f3a');face(g,'L',u+.04,v+1,.06,1.5,'#59b04f')}
  for(const [u,v] of [[.8,8],[.86,11.5],[.76,14]]){face(g,'R',u,v,.12,2.5,'#2f7a2c');face(g,'R',u+.05,v+1,.06,1.5,'#4a9a3f')}
  face(g,'L',.06,7.2,.88,1.5,'#59cd90');
  topFace(gx+.14,gy+.14,gx+.58,gy+.66,H+.2,'#b07a4e');
  for(let k=1;k<6;k++){const a=P(gx+.14+k*.075,gy+.14),b=P(gx+.14+k*.075,gy+.66);line(a[0],a[1]-H-.2,b[0],b[1]-H-.2,'#9a6a42')}
  lifted(H,()=>{umbH(gx+.28,gy+.3,'#59cd90',6,'#3fae6a');umbH(gx+.46,gy+.52,'#ffffff',6,'#ddd4c2')});
  {const a=P(gx+.12,gy+.68),b=P(gx+.6,gy+.68);bulbsH([a[0],a[1]-H-4],[b[0],b[1]-H-4],7,2)}
  dsort(gx,gy,[
    [.8,.32,()=>{chairH(gx+.88,gy+.27,'#f4f4f4');tableH(gx+.8,gy+.33,'#59cd90','#888');chairH(gx+.72,gy+.4,'#f4f4f4')}],
    [.82,.72,()=>planter(gx+.84,gy+.74,.45)]]);
}

