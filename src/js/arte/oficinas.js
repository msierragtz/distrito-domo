/* ===== OFICINAS con volumen ===== */
function artOfi(t,gx,gy,L,ic){
  const ins=.14,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,FH=6,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const hh=q=>Math.abs(Math.sin(SEED*3.17+q*12.71)*9137.13)%1;
  if(L===1){ // concreto con ventanas corridas y parasoles
    const f=ic?4:6,H=f*FH+1,g=box(x0,y0,x1,y1,0,H,'#bdb7ab','#d9d6cf','#bcb8b0');
    face(g,'L',0,0,1,FH,'#6b6f78');face(g,'R',0,0,1,FH,'#5a5e66');win(g,'L',.06,.5,.88,FH-1.5,'#6fa3c7');face(g,'R',.35,0,.3,FH-1,'#2e2f36');
    prot(SD.R,.3,.7,.1,FH-.8,.6,'#5a5e66');
    for(let fl=1;fl<f;fl++){const v=fl*FH+1;for(const sd of ['L','R']){win(g,sd,.04,v,.92,3.2,'#4f6f8a');for(let q=1;q<6;q++)face(g,sd,q/6,v,.012,3.2,'#c4bfb5');if(!(NIGHT>.2))face(g,sd,.04,v+2.7,.4,.5,'#7f9fba')}
      prot(SD.L,.02,.98,.06,v+3.2,.5,'#e8e4dc');prot(SD.R,.02,.98,.06,v+3.2,.5,'#d0ccc4')}
    box(x0-.01,y0-.01,x1+.01,y1+.01,H,1,'#d9d6cf','#d9d6cf','#bcb8b0');const R=H+1;
    box(gx+.26,gy+.26,gx+.5,gy+.46,R,3,'#c9cdd2','#b8bcc1','#a2a6ab');cb(gx+.58,gy+.56,gx+.76,gy+.7,R,2,'#e8ecef');{const [fx,fy]=P(gx+.67,gy+.63);circ(fx,fy-R-2,1.3,'#8a9099')}
    return}
  if(L===2){ // coworking: planta baja de cristal, volúmenes de color en voladizo, terraza
    const f=ic?4:7,H=f*FH+1,g=box(x0,y0,x1,y1,0,H,'#bdb7ab','#ecebe7','#cfcdc7');
    win(g,'L',0,0,1,FH,'#ffe2a8');win(g,'R',0,0,1,FH,'#f2d090');for(const u of [.25,.5,.75]){face(g,'L',u,0,.015,FH,'#2b2b2b');face(g,'R',u,0,.015,FH,'#2b2b2b')}
    for(let fl=1;fl<f;fl++){const v=fl*FH+1;for(const sd of ['L','R'])for(const u of [.06,.38,.7])winF(g,sd,u,v,.24,3.4,'#2b2b2b','#3d6a8f','#2b2b2b')}
    const cols=['#f26a21','#2a9d8f','#ffd84d'];
    for(const [fl,sd,u0,c] of [[2,SD.L,.55,0],[4,SD.R,.1,1],[5,SD.L,.08,2]].filter(q=>q[0]<f)){const gb=prot(sd,u0,u0+.38,.12,fl*FH,FH-.5,cols[c]);win(gb,sd.__s,.1,1.2,.8,3,'#3d6a8f')}
    {const [x,y]=P(gx+.92,gy+.5);for(let q=0;q<3;q++){const [bx,by]=P(gx+.94,gy+.3+q*.12);px(bx-1.5,by-1.5,3,.5,'#2b2b2b');circ(bx-1.5,by-1,1,'#2b2b2b');circ(bx+1.5,by-1,1,'#2b2b2b')}}
    box(x0-.01,y0-.01,x1+.01,y1+.01,H,1,'#2b2b2b','#2b2b2b','#1f1f1f');const R=H+1;topFace(x0+.04,y0+.04,x1-.04,y1-.04,R,'#a0663a');
    lifted(R,()=>{umbH(gx+.34,gy+.36,'#f26a21',5);umbH(gx+.62,gy+.62,'#2a9d8f',5);planter(gx+.76,gy+.28,.36)});
    {const a=P(x0,y1),b=P(x1,y1);bulbsH([a[0],a[1]-R-4],[b[0],b[1]-R-4],7,1.5)}
    return}
  if(L===3){ // corporativo: muro cortina azul, corona escalonada y letrero
    const f=ic?5:9,H=f*FH+1,g=box(x0,y0,x1,y1,0,H,'#8aa3b1','#5f9fc0','#3f7fa3');
    face(g,'L',0,0,1,FH,'#2f3c48');face(g,'R',0,0,1,FH,'#26313b');win(g,'L',.06,.5,.88,FH-1,'#8fc2dc');face(g,'L',.4,0,.2,FH-1,'#1e2a36');
    prot(SD.L,.25,.75,.12,FH-.6,.8,'#2f3c48');
    for(let fl=1;fl<f;fl++){const v=fl*FH;for(const sd of ['L','R']){win(g,sd,0,v+.5,1,FH-1,sd==='L'?'#5f9fc0':'#3f7fa3');face(g,sd,0,v,1,.5,'#2f5f7a');for(let q=1;q<8;q++)face(g,sd,q/8,v,.008,FH,'#2f5f7a');
      if(!(NIGHT>.2)&&fl%3===0)face(g,sd,.1,v+3,.3,.5,'#9fd0ee')}}
    for(const sd of ['L','R'])face(g,sd,0,FH,.03,H-FH,'#1e3d52');
    const R=H,gc=box(x0+.06,y0+.06,x1-.06,y1-.06,R,4,'#8aa3b1','#4f8fb0','#356f93');
    {const [x,y]=P(gx+.5,y1-.06);px(x-5,y-R-3,10,2.5,'#f4f4f4',NIGHT>.2);px(x-4,y-R-2.5,3,1.5,'#2f5f7a');px(x,y-R-2.5,3.5,1.5,'#2f5f7a');glow(x,y-R-2,10,.6)}
    box(gx+.36,gy+.36,gx+.64,gy+.64,R+4,3,'#c9cdd2','#b8bcc1','#a2a6ab');
    return}
  // corporativo verde: terrazas con jardín en voladizo, aletas de madera, paneles solares
  const f=ic?5:10,H=f*FH+1,g=box(x0,y0,x1,y1,0,H,'#7fca58','#cfe6f2','#a9d4ea');
  face(g,'L',0,0,1,FH,'#2b2b2b');face(g,'R',0,0,1,FH,'#1f1f1f');win(g,'L',.06,.5,.88,FH-1,'#ffe2a8');win(g,'R',.06,.5,.5,FH-1,'#f2d090');
  for(let fl=1;fl<f;fl++){const v=fl*FH;for(const sd of ['L','R']){win(g,sd,.02,v+.5,.96,FH-1,sd==='L'?'#8fc2dc':'#78acc8');face(g,sd,0,v,1,.5,'#f4f4f2');for(let q=1;q<6;q++)face(g,sd,q/6,v+.5,.03,FH-1,'#a0693f')}
    const sd=fl%2?SD.L:SD.R,u0=fl%4<2?.08:.5,gt=prot(sd,u0,u0+.42,.12,v-.6,.8,'#f4f4f2');
    const gg=protGeo(sd,u0,u0+.42,.12,v+.2);for(let q=0;q<5;q++)face(gg,sd.__s,q*.2+.02,0,.16,1.4+(q%2)*.6,q%2?'#3f8f3a':'#59b04f')}
  box(x0-.01,y0-.01,x1+.01,y1+.01,H,1,'#f4f4f2','#f4f4f2','#dcdcd8');const R=H+1;topFace(x0+.04,y0+.04,x1-.04,y1-.04,R,'#7fca58');
  for(let k=0;k<3;k++){const a=.22+k*.12;const r=[gx+a,gy+.22,gx+a+.1,gy+.46];poly([up(P(r[0],r[1]),R+1.5),up(P(r[2],r[1]),R+1.5),up(P(r[2],r[3]),R+.5),up(P(r[0],r[3]),R+.5)],'#1f3d66')}
  lifted(R,()=>{tree(gx+.66,gy+.66,.42);tree(gx+.38,gy+.72,.34)});
}

