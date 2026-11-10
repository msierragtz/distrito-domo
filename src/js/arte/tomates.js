/* ===== TOMATES MARKET ===== */
function tomatoLogo(x,y,r,lit){circ(x,y,r,'#e2342b',lit);circ(x-r*.35,y-r*.3,r*.3,'#ff8a80',lit);px(x-1,y-r-1,2.5,1,'#3fa34d',lit);px(x-.5,y-r-1.5,1,.5,'#2e7d3a',lit)}
function artTomates(t,gx,gy,L){
  if(L===1){ // tiendita de esquina
    const H=10,g=cb(gx+.18,gy+.18,gx+.72,gy+.72,0,H,'#f2e6c9','#b9b3a7');
    face(g,'L',0,0,1,.75,'#c9b38a');face(g,'R',0,0,1,.75,'#b49e76');
    face(g,'L',.1,.75,.5,5,'#2a2420');face(g,'L',.1,5.75,.5,1,'#8b9096');
    face(g,'L',.05,7,.9,2.5,'#e2342b');face(g,'L',.12,7.5,.6,.5,'#ffffff');face(g,'L',.12,8.5,.45,.5,'#ffffff');
    win(g,'R',.2,2,.6,3.5,'#7fb2d4');face(g,'R',.2,2,.6,.5,'#e2342b');
    box(gx+.16,gy+.16,gx+.74,gy+.74,H,.75,'#a8a296','#948e83','#837d72');
    {const [x,y]=P(gx+.35,gy+.35);px(x-1.5,y-H-5,3,4.5,'#1c1c1c')}
    {const [x,y]=P(gx+.6,gy+.6);px(x,y-H-6,.8,6,'#6e4a2c');tomatoLogo(x+.4,y-H-8,2.4,NIGHT>.2)}
    dsort(gx,gy,[
      [.78,.4,()=>{const g2=cb(gx+.74,gy+.3,gx+.86,gy+.46,0,7,'#f4f4f4');face(g2,'L',0,5.5,1,1.5,'#d62828');win(g2,'L',.15,1,.7,4,'#9fd0ee')}],
      [.5,.84,()=>{for(let k=0;k<3;k++){const [x,y]=P(gx+.42+k*.08,gy+.84);px(x-1,y-2-(k%2),2.5,2,k===1?'#2f6db5':'#d62828');px(x-1,y-2.5-(k%2),2.5,.5,'#f2c94c')}}],
      ]);
    return}
  if(L===2){ // Tomates 24 horas
    const H=11,g=cb(gx+.12,gy+.12,gx+.88,gy+.88,0,H,'#f4f2ee','#d8d3cb');
    face(g,'L',0,7,1,4,'#e2342b');face(g,'R',0,7,1,4,'#c22a22');
    win(g,'L',.06,1,.88,5.5,'#9fd0ee');for(const u of [.3,.55,.8])face(g,'L',u,1,.015,5.5,'#9aa0a8');
    win(g,'R',.1,1,.45,5.5,'#8cc2e4');face(g,'R',.62,0,.26,6,'#3d3d46');
    face(g,'L',.15,8,.55,2,'#ffffff',NIGHT>.2);face(g,'L',.75,8,.18,2,'#ffd84d',NIGHT>.2);
    {const [x,y]=P(gx+.3,gy+.3);tomatoLogo(x,y-16,3.5,NIGHT>.2);glow(x,y-16,10,.6)}
    dsort(gx,gy,[[.06,.5,()=>{const g2=cb(gx+.02,gy+.42,gx+.1,gy+.56,0,6,'#5a5f6b');face(g2,'R',.2,3,.6,2,'#4fb0e0',true)}]]);
    return}
  if(L===3){ // Tomates Gourmet
    const H=11,g=cb(gx+.12,gy+.12,gx+.82,gy+.8,0,H,'#2f7a5a','#d8d3cb');
    win(g,'L',.06,1,.88,5.5,'#ffe2a8');for(const u of [.33,.66])face(g,'L',u,1,.02,5.5,'#16382a');
    face(g,'R',.08,0,.4,6.5,'#ffe2a8',true);face(g,'R',.55,0,.3,6.5,'#16382a');
    for(let k=0;k<7;k++)face(g,'L',k/7,6.5,1/7,1.5,k%2?'#f4efe2':'#2f7a5a');
    face(g,'L',.2,8.5,.6,1.5,'#c9a227',NIGHT>.2);
    box(gx+.1,gy+.1,gx+.84,gy+.82,H,.75,'#2a6a4e','#24574a','#1c4539');
    {const [x,y]=P(gx+.46,gy+.46);tomatoLogo(x,y-H-4.4,3.4,NIGHT>.2);glow(x,y-H-4,10,.5)}
    dsort(gx,gy,[...[.24,.42,.6].map((a,k)=>[a,.9,()=>{const g2=cb(gx+a-.07,gy+.84,gx+a+.07,gy+.95,0,2.5,'#a0663a');const [x,y]=P(gx+a,gy+.9);for(let j=0;j<5;j++)px(x-2+j,y-3-(j%2)*.5,1,1,['#e2342b','#f2c94c','#59b04f','#f26a21','#8e44ad'][(j+k)%5])}]),
      [.9,.3,()=>planter(gx+.92,gy+.24,.4)]]);
    return}
  // Tomates Signature: caja de cristal, techo verde
  const H=12,g=cb(gx+.12,gy+.12,gx+.84,gy+.84,0,H,'#cfe6f2','#7fca58');
  win(g,'L',0,0,1,H,'#bfe2f2');win(g,'R',0,0,1,H,'#a9d4ea');
  for(const u of [0,.25,.5,.75,1]){face(g,'L',u-.01,0,.02,H,'#2b2b2b');face(g,'R',u-.01,0,.02,H,'#2b2b2b')}
  face(g,'L',0,H-1,1,1,'#2b2b2b');face(g,'R',0,H-1,1,1,'#2b2b2b');face(g,'L',0,5.5,1,.5,'#2b2b2b');face(g,'R',0,5.5,1,.5,'#2b2b2b');
  if(NIGHT>.2){face(g,'L',.02,0,.96,5.5,'rgba(255,226,168,.5)',true)}
  for(let k=0;k<6;k++){const r=rng(k+gx*9);const [x,y]=P(gx+.2+r()*.6,gy+.2+r()*.6);px(x,y-H-1,1.5,1,'#59b04f')}
  dsort(gx,gy,[
    [.92,.5,()=>{const [x,y]=P(gx+.92,gy+.5);px(x,y-13,1,13,'#2b2b2b');tomatoLogo(x+.5,y-15,3,NIGHT>.2);glow(x,y-15,9,.6)}],
    [.3,.94,()=>planter(gx+.3,gy+.94,.4)],[.66,.94,()=>planter(gx+.66,gy+.94,.4)]]);
}

