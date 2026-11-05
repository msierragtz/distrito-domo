/* ===== BAR: micheladas → cantina → mezcalería → bar de azotea ===== */
function agave(fx,fy,s=1){const [x,y]=P(fx,fy);cb(fx-.05,fy-.05,fx+.05,fy+.05,0,2.5,'#b5653a');for(const [dx,h] of [[-2,4],[-1,5.5],[0,6],[1,5],[2,3.5]])line(x,y-2.5,x+dx*1.6*s,y-2.5-h*s,'#5f8f6a');px(x-.5,y-4,1,1.5,'#7fb08a')}
function papel(p0,p1,n){const C=['#e5534b','#f2c94c','#3a6ea5','#59b04f','#ff8fb1'];line(p0[0],p0[1],p1[0],p1[1],'#555');for(let k=0;k<n;k++){const f=(k+.5)/n;px(p0[0]+(p1[0]-p0[0])*f-.75,p0[1]+(p1[1]-p0[1])*f,1.5,2,C[k%C.length],false)}}
function artBar(t,gx,gy,L){
  if(L===1){ // puesto de micheladas
    dsort(gx,gy,[
      [.42,.42,()=>{const g=cb(gx+.3,gy+.34,gx+.58,gy+.5,0,5,'#d62828','#f4f4f4');face(g,'L',0,3.5,1,1.5,'#f4f4f4');face(g,'L',.1,1,.8,1.5,'#f2c94c');
        const [x,y]=P(gx+.44,gy+.42);for(let k=0;k<3;k++){px(x-2+k*1.8,y-7,1,2,['#f2c94c','#c0392b','#f2c94c'][k]);px(x-2+k*1.8,y-7.5,1,.5,'#d64545')}}],
      [.66,.34,()=>{const g=cb(gx+.6,gy+.28,gx+.74,gy+.4,0,3.5,'#3a6ea5','#e8ecef');face(g,'L',0,2.5,1,1,'#e8ecef')}],
      [.66,.66,()=>{tableH(gx+.66,gy+.66,'#f2c94c','#b8861d');stoolH(gx+.76,gy+.6,'#d62828');stoolH(gx+.56,gy+.76,'#d62828')}],
      [.3,.8,()=>{tableH(gx+.3,gy+.8,'#f2c94c','#b8861d');stoolH(gx+.4,gy+.74,'#3a6ea5');stoolH(gx+.2,gy+.86,'#d62828')}]]);
    {const [x,y]=P(gx+.46,gy+.44);px(x,y-12,.5,12,'#7a7a7a');parasol(x+.25,y-12,8,['#d62828','#f2c94c'],1.2)}
    {const [sx,sy]=P(gx+.1,gy+.6);px(sx,sy-6,.5,6,'#6e4a2c');board(sx-4.5,sy-11,9.5,5,'#f4efe2',[[1,1,7.5,'#d62828'],[1,2.5,5,'#d62828'],[1,3.5,6.5,'#2b2b2b']])}
    return}
  if(L===2){ // cantina con puertas de vaivén
    const H=13,g=cb(gx+.14,gy+.14,gx+.66,gy+.72,0,H,'#2f7d55','#c9c1b2');
    face(g,'L',0,0,1,1.2,'#1f5a3c');face(g,'R',0,0,1,1.2,'#184a31');
    face(g,'L',.38,0,.24,6,'#2a2420');face(g,'L',.4,1.5,.09,3.5,'#c49a5c');face(g,'L',.51,1.5,.09,3.5,'#c49a5c');
    win(g,'L',.08,2,.22,4,'#ffd27a');win(g,'L',.7,2,.22,4,'#ffd27a');win(g,'R',.2,2,.6,4,'#f2c97e');
    face(g,'L',.04,H-4,.92,3,'#f4efe2');face(g,'L',.1,H-3.4,.8,.9,'#2f7d55');face(g,'L',.1,H-2.1,.55,.6,'#d62828');
    {const [x,y]=P(gx+.66,gy+.4);px(x-3,y-H+3,5,2.5,'#1c1c1c');px(x-2.5,y-H+3.5,4,1.5,'#ff5d5d',NIGHT>.2);glow(x,y-H+4,8,.7)}
    box(gx+.12,gy+.12,gx+.68,gy+.74,H,1,'#5a4a40','#4a3c34','#3a2e28');
    dsort(gx,gy,[[.84,.4,()=>{const g2=cb(gx+.78,gy+.3,gx+.9,gy+.48,0,3,'#b5653a');}],[.84,.76,()=>{stoolH(gx+.84,gy+.76,'#2f7d55');stoolH(gx+.74,gy+.86,'#2f7d55')}]]);
    return}
  if(L===3){ // mezcalería: adobe, agaves y papel picado
    const H=12,g=cb(gx+.14,gy+.14,gx+.64,gy+.7,0,H,'#c97b4f','#a8603d');
    for(let v=2;v<H;v+=2.5){face(g,'L',0,v,1,.3,'#b86d45');face(g,'R',0,v,1,.3,'#9a5a39')}
    face(g,'L',.36,0,.28,7,'#5a3a24');face(g,'L',.39,.5,.22,6,'#7a4e2c');face(g,'L',.5,.5,.01,6,'#5a3a24');
    win(g,'L',.08,2.5,.2,3.5,'#ffcf87');win(g,'L',.72,2.5,.2,3.5,'#ffcf87');win(g,'R',.25,2.5,.5,3.5,'#f2b866');
    face(g,'L',.2,H-3,.6,2,'#2b2118');face(g,'L',.24,H-2.6,.52,1.2,'#e9b45a',NIGHT>.2);
    box(gx+.12,gy+.12,gx+.66,gy+.72,H,1,'#7a4e2c','#6a4226','#5a3720');
    {const a=P(gx+.66,gy+.18),b=P(gx+.94,gy+.18),c=P(gx+.94,gy+.9);px(b[0],b[1]-10,.5,10,'#6e4a2c');px(c[0],c[1]-10,.5,10,'#6e4a2c');
      papel([a[0],a[1]-H+1],[b[0],b[1]-10],6);papel([b[0],b[1]-10],[c[0],c[1]-10],7)}
    dsort(gx,gy,[[.82,.36,()=>{tableH(gx+.82,gy+.36,'#7a4e2c');stoolH(gx+.9,gy+.3,'#c97b4f')}],[.8,.7,()=>{tableH(gx+.8,gy+.7,'#7a4e2c');stoolH(gx+.72,gy+.78,'#c97b4f')}],
      [.24,.86,()=>agave(gx+.24,gy+.86)],[.52,.88,()=>agave(gx+.52,gy+.88,.8)]]);
    return}
  // bar de azotea: edificio de 3 pisos con terraza iluminada
  const H=20,g=cb(gx+.14,gy+.14,gx+.86,gy+.86,0,H,'#2b2b2b','#3a3a3a');
  for(let fl=0;fl<3;fl++){const v=fl*6.5+.8;for(const sd of ['L','R']){win(sd==='L'?g:g,sd,.06,v,.88,4.5,fl===0?'#ffcf87':'#3d5a75');if(fl>0)for(let q=1;q<4;q++)face(g,sd,q/4,v,.012,4.5,'#2b2b2b')}}
  face(g,'L',.3,5.4,.4,1,'#ff5d8f',true);glow(...P(gx+.5,gy+.86).map((q,i)=>i?q-6:q),10,.7);
  box(gx+.12,gy+.12,gx+.88,gy+.88,H,.8,'#a0663a','#4a3a2c','#3a2c20');
  const R=H+.8;
  {const SD=sidesOf(gx+.12,gy+.12,gx+.88,gy+.88);SD.L.__s='L';SD.R.__s='R';rail(SD.L,0,1,.01,R,'glass','#c9a227');rail(SD.R,0,1,.01,R,'glass','#c9a227')}
  lifted(R,()=>{umbH(gx+.32,gy+.34,'#f4efe2',5);umbH(gx+.66,gy+.62,'#f4efe2',5);cb(gx+.6,gy+.2,gx+.82,gy+.32,0,2.5,'#7a4e2c');planter(gx+.26,gy+.72,.34)});
  {const a=P(gx+.14,gy+.14),b=P(gx+.86,gy+.14),c=P(gx+.86,gy+.86);bulbsH([a[0],a[1]-R-6],[b[0],b[1]-R-6],7,2);bulbsH([b[0],b[1]-R-6],[c[0],c[1]-R-6],7,2)}
}

