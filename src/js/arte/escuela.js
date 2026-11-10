/* ESCUELA — 1 Guardería · 2 Escuela primaria · 3 Colegio privado · 4 Campus Cañón (concreto aparente con un gran pórtico, a la Uni del Valle; ladrillo y prados, a la ASF) */
function flagPole(fx,fy,h=26){const [ax,ay]=P(fx,fy);px(ax,ay-h,.6,h,'#8a9099');px(ax-.5,ay-.6,1.6,.6,'#6b7078');
  px(ax+.6,ay-h+.5,1.6,3.4,'#1f8a4c');px(ax+2.2,ay-h+.5,1.6,3.4,'#ffffff');px(ax+3.8,ay-h+.5,1.6,3.4,'#d62828');px(ax+2.6,ay-h+1.6,.8,1,'#a07a3a')}
function artEscuela(t,gx,gy,L){
  if(L===1){ // guardería: casita de un piso en colores pastel, resbaladilla y columpios
    const g=box(gx+.1,gy+.1,gx+.56,gy+.5,0,7,'#f2c7d6','#f6d77a','#e9c25e');
    for(let k=0;k<4;k++){face(g,'L',.03+k*.24,0,.22,1.4,['#4f8fd0','#e5534b','#59cd90','#f2c94c'][k])}
    for(let k=0;k<3;k++)win(g,'L',.08+k*.3,2.2,.18,2.8,'#9fd0ee');win(g,'R',.2,2.2,.5,2.8,'#8cc2e4');face(g,'L',.4,0,.16,4.4,'#e5534b');
    box(gx+.07,gy+.07,gx+.59,gy+.53,7,1.6,'#ff9f80','#e8774a','#cf6237');
    {const [x,y]=P(gx+.33,gy+.3);circ(x,y-10.6,1.6,'#ffd84d');px(x-.4,y-12.8,.8,.8,'#ffd84d');px(x+1.6,y-10.9,.8,.8,'#ffd84d')}
    dsort(gx,gy,[[.8,.28,()=>slide(gx+.8,gy+.28)],[.82,.66,()=>swings(gx+.84,gy+.64)],[.2,.86,()=>tree(gx+.2,gy+.86,.5)]]);return}
  if(L===2){ // escuela primaria: dos pisos, franja verde, letrero y bandera
    const g=box(gx+.08,gy+.1,gx+.66,gy+.52,0,14,'#e2ddd2','#f4f1ea','#d6d0c4');
    face(g,'L',0,6.6,1,.9,'#2f8f5b');face(g,'R',0,6.6,1,.9,'#257549');face(g,'L',0,0,1,1,'#b9b3a7');face(g,'R',0,0,1,1,'#a49e92');
    for(const v of [2.2,8.6])for(let k=0;k<4;k++)win(g,'L',.06+k*.24,v,.16,3.4,'#9fc4dc');
    for(const v of [2.2,8.6])win(g,'R',.2,v,.6,3.4,'#8cb6d2');
    face(g,'L',.43,0,.14,4.6,'#2f8f5b');face(g,'L',.455,0,.09,4.1,'#3a3f47');face(g,'L',.32,11.4,.36,2,'#2f8f5b');face(g,'L',.36,12,.28,.7,'#ffffff');
    box(gx+.07,gy+.09,gx+.67,gy+.53,14,1.2,'#f4f1ea','#e9e5dc','#d6d0c4');flagPole(gx+.82,gy+.2);return}
  if(L===3){ // colegio privado: ladrillo de tres pisos, ventanas con marco blanco, pórtico de columnas, cancha de básquet y escudo
    const g=box(gx+.06,gy+.08,gx+.6,gy+.54,0,21,'#c9a68a','#a5583c','#8c4a32');
    for(const v of [7,14])face(g,'L',0,v,1,.6,'#efe7da'),face(g,'R',0,v,1,.6,'#d9d0c2');
    for(const v of [2,8.6,15.4])for(let k=0;k<4;k++){face(g,'L',.05+k*.24,v-.4,.18,4.2,'#efe7da');win(g,'L',.065+k*.24,v,.15,3.4,'#a9c8dc')}
    for(const v of [2,8.6,15.4]){face(g,'R',.14,v-.4,.72,4.2,'#d9d0c2');win(g,'R',.16,v,.68,3.4,'#93b8d0')}
    box(gx+.05,gy+.07,gx+.61,gy+.55,21,1.4,'#efe7da','#e2d9cb','#cfc5b5');
    {const [x,y]=P(gx+.33,gy+.31);px(x-2,y-27,4,4.4,'#1f3a6b');px(x-1.3,y-26.4,2.6,2.6,'#f2c94c');px(x-.6,y-25.7,1.2,1.4,'#1f3a6b');px(x-.2,y-23,.4,1,'#8a9099')}
    // pórtico: dos columnas blancas y frontón
    {const c1=P(gx+.6,gy+.24),c2=P(gx+.6,gy+.42);for(const c of [c1,c2])px(c[0]+.6,c[1]-8,1.2,8,'#f4f1ea');poly([[c1[0],c1[1]-8],[c2[0]+2,c2[1]-8],[c2[0]+2,c2[1]-9.6],[(c1[0]+c2[0])/2+1,(c1[1]+c2[1])/2-12],[c1[0],c1[1]-9.6]],'#efe7da')}
    dsort(gx,gy,[[.93,.62,()=>{const [x,y]=P(gx+.93,gy+.76);px(x,y-9,.6,9,'#6b7078');px(x-2,y-11,4,2.6,'#f4f4f4');px(x-.8,y-9.6,1.6,.6,'#e5534b')}],[.86,.16,()=>tree(gx+.86,gy+.16,.62)],[.2,.82,()=>tree(gx+.2,gy+.82,.6)],[.4,.86,()=>tree(gx+.4,gy+.88,.5)]]);
    flagPole(gx+.72,gy+.1,30);return}
  // Campus Cañón: bloque ancho de concreto aparente con un gran pórtico que se atraviesa (a la Uni del Valle), franja y arco naranja del Cañón; edificio de ladrillo junto al prado (a la ASF)
  const conc='#bdb9b2',concL='#d3cfc8',concR='#a8a49d';
  const A=box(gx+.04,gy+.08,gx+.26,gy+.46,0,13,concL,conc,concR);face(A,'R',0,0,1,13,'#77736d');face(A,'R',0,10.5,1,2.5,'#5e5b56');for(const u of [.15,.55])win(A,'L',u,3,.3,6,'#6f8fa8');
  const B=box(gx+.56,gy+.08,gx+.78,gy+.46,0,13,concL,conc,concR);for(const u of [.15,.55]){win(B,'L',u,3,.3,6,'#6f8fa8')}win(B,'R',.1,3,.8,6,'#5f7f98');
  const C=box(gx+.04,gy+.08,gx+.78,gy+.46,13,10,concL,conc,concR);win(C,'L',.04,2,.92,2.4,'#6f8fa8');win(C,'L',.04,5.6,.92,2.4,'#6f8fa8');win(C,'R',.1,2,.8,6,'#5f7f98');
  face(C,'L',0,8.8,1,1.2,'#f26a21',NIGHT>.2);face(C,'R',0,8.8,1,1.2,'#d85a17',NIGHT>.2);
  {const [x,y]=P(gx+.41,gy+.46);arcTop(x,y-26.5,4,1.4,'#f26a21',NIGHT>.2)}
  dsort(gx,gy,[[.89,.24,()=>{const g=box(gx+.82,gy+.04,gx+.98,gy+.44,0,6,'#7a3b28','#a5583c','#8c4a32');for(let k=0;k<2;k++)win(g,'L',.15+k*.45,1.6,.3,2.8,'#a9c8dc');win(g,'R',.1,1.6,.8,2.8,'#93b8d0');face(g,'L',0,5,1,1,'#efe7da');face(g,'R',0,5,1,1,'#d9d0c2');box(gx+.81,gy+.03,gx+.99,gy+.45,6,1,'#5a2a1c','#6a3222','#5a2a1c')}],
    [.86,.66,()=>tree(gx+.86,gy+.66,.6)],[.14,.84,()=>tree(gx+.14,gy+.84,.62)],[.86,.9,()=>tree(gx+.86,gy+.9,.48)]]);
  if(NIGHT>.2){const [x,y]=P(gx+.41,gy+.5);glow(x,y-6,12,.6,'#ffd9a0')}}
