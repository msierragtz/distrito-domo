/* ===== BARBERÍA, SALÓN DE UÑAS Y GIMNASIO (propuesta v63) ===== */
function bpole(fx,fy,h=7){const [x,y]=P(fx,fy);px(x-1,y-h-1,2.5,1,'#9aa0a6');px(x-1,y-1,2.5,1,'#9aa0a6');
  const C=['#e63946','#ffffff','#1d4e9e','#ffffff'];for(let k=0;k<h-2;k++){px(x-.5,y-h+k,.75,1,C[k%4],NIGHT>.2);px(x+.25,y-h+k,.75,1,C[(k+1)%4],NIGHT>.2)}
  circ(x+.25,y-h-1.8,1,'#c9ced6');glow(x,y-h/2,6,.6)}
function mustache(x,y,c,lit){px(x-3,y,2.5,1,c,lit);px(x+1,y,2.5,1,c,lit);px(x-.5,y-.5,1.5,1,c,lit);px(x-3.5,y-.5,1,.5,c,lit);px(x+3,y-.5,1,.5,c,lit)}
function awningR(g,u0,u1,v,c1,c2){for(let k=0;k<6;k++){const u=u0+(u1-u0)*k/6;face(g,'R',u,v,(u1-u0)/6,1.6,k%2?c2:c1)}}
function flowerPot(fx,fy,c){const [x,y]=P(fx,fy);px(x-1.5,y-2.5,3,2.5,'#b5653a');px(x-1.5,y-2.5,3,.5,'#8a4a2a');for(const [dx,dy] of [[-1.5,-4],[0,-5],[1.5,-4],[-.5,-3.5],[.8,-3.2]])px(x+dx-.5,y+dy,1,1,'#3f8f3a');for(const [dx,dy] of [[-1.5,-4.5],[0,-5.5],[1.5,-4.5]])px(x+dx-.5,y+dy,1,1,c)}
function chairIn(g,side,u,v,c){face(g,side,u,v,.08,1.6,c);face(g,side,u+.06,v,.03,3.2,hexShade(c,-.2))}

function artBarber(t,gx,gy,L){
  if(L===1){ // Barber Barrio: local chiquito pintado a mano
    const H=10,g=cb(gx+.18,gy+.2,gx+.66,gy+.68,0,H,'#5fb8b0','#c9c1b2');
    face(g,'L',0,0,1,.8,'#3f8f88');face(g,'R',0,0,1,.8,'#357a74');
    face(g,'L',.56,0,.22,6,'#2a2420');face(g,'L',.58,.5,.18,5,'#6a8fa0');
    win(g,'L',.1,2,.38,4,'#9fd0e0');chairIn(g,'L',.2,2,'#d62828');
    win(g,'R',.2,2,.55,4,'#8cc4d6');
    face(g,'L',.06,H-3.2,.88,2.4,'#f4efe2');face(g,'L',.1,H-2.6,.5,.6,'#d62828');face(g,'L',.1,H-1.6,.7,.5,'#1d4e9e');
    box(gx+.16,gy+.18,gx+.68,gy+.7,H,.8,'#8a8378','#7a7368','#6a6358');
    dsort(gx,gy,[[.78,.66,()=>bpole(gx+.78,gy+.66,7)],[.36,.84,()=>{chairH(gx+.4,gy+.82,'#2f6db5')}],[.84,.34,()=>flowerPot(gx+.84,gy+.34,'#e63946')]]);
    return}
  if(L===2){ // Estética para caballeros: toldo de rayas, vitrina y bigote
    const H=12,g=cb(gx+.14,gy+.14,gx+.68,gy+.7,0,H,'#f4f2ee','#c9c5bd');
    face(g,'L',0,0,1,1,'#2b2b2b');face(g,'R',0,0,1,1,'#222');
    win(g,'L',.06,1.5,.5,5,'#a8cbe0');chairIn(g,'L',.14,1.5,'#7a1f1f');chairIn(g,'L',.36,1.5,'#7a1f1f');
    face(g,'L',.64,0,.24,6.5,'#2b2b2b');face(g,'L',.66,.5,.2,5.5,'#9fc4dc');
    win(g,'R',.12,1.5,.7,5,'#98c2da');
    awningL(g,.04,.96,6.6,'#c1121f','#ffffff');awningR(g,.04,.96,6.6,'#c1121f','#ffffff');
    face(g,'L',.08,H-3,.84,2.4,'#1f1f1f');{const a=P(gx+.38,gy+.7);mustache(a[0],a[1]-H+1.8,'#f2c94c',NIGHT>.2)}
    box(gx+.12,gy+.12,gx+.7,gy+.72,H,1,'#3a3a3a','#2e2e2e','#242424');
    dsort(gx,gy,[[.8,.7,()=>bpole(gx+.8,gy+.72,8)],[.86,.34,()=>bench(gx+.86,gy+.36,'#2b2b2b')],[.3,.86,()=>flowerPot(gx+.3,gy+.86,'#ffffff')]]);
    return}
  if(L===3){ // Barber Hipster: tabique negro, madera, foquitos y bici
    const H=12,g=cb(gx+.14,gy+.14,gx+.66,gy+.7,0,H,'#2b2b2b','#3a3a3a');
    for(let v=1;v<H;v+=1.5){face(g,'L',0,v,1,.25,'#383838');face(g,'R',0,v,1,.25,'#303030')}
    face(g,'L',.04,0,.6,6.5,'#7a4e2c');win(g,'L',.08,.6,.52,5.4,'#ffcf87');for(const u of [.22,.36,.5])face(g,'L',u,.6,.015,5.4,'#7a4e2c');
    chairIn(g,'L',.14,.8,'#5a3a24');chairIn(g,'L',.4,.8,'#5a3a24');
    face(g,'L',.7,0,.22,6.5,'#5a3a24');face(g,'L',.73,.5,.16,5.5,'#7a4e2c');
    win(g,'R',.15,1.5,.6,4.5,'#f2b866');
    face(g,'L',.12,H-3.6,.76,2.8,'#c49a5c');face(g,'L',.16,H-3,.68,1.6,'#5a3a24');
    {const a=P(gx+.42,gy+.7);mustache(a[0],a[1]-H+4.2,'#ff8a3d',NIGHT>.2);glow(a[0],a[1]-H+4,8,.7,'#ff8a3d')}
    box(gx+.12,gy+.12,gx+.68,gy+.72,H,.8,'#1c1c1c','#161616','#121212');
    {const a=P(gx+.12,gy+.74),b=P(gx+.68,gy+.74);bulbsH([a[0],a[1]-H+1],[b[0],b[1]-H+1],6,1.5)}
    dsort(gx,gy,[[.8,.72,()=>bpole(gx+.8,gy+.74,8)],[.84,.34,()=>{const [x,y]=P(gx+.84,gy+.36);circ(x-3,y-2,2,'#2b2b2b');circ(x-3,y-2,1.3,'#c9c1b2');circ(x+2,y-2,2,'#2b2b2b');circ(x+2,y-2,1.3,'#c9c1b2');line(x-3,y-2,x-.5,y-4.5,'#2a9d8f');line(x-.5,y-4.5,x+2,y-2,'#2a9d8f');line(x-1.5,y-4.5,x+1,y-4.5,'#2a9d8f')}],[.32,.86,()=>planter(gx+.32,gy+.86,.36)]]);
    return}
  // Spa for Men: dos pisos, celosía de madera, letras doradas y bambú
  const H=18,g=cb(gx+.12,gy+.12,gx+.7,gy+.72,0,H,'#2e3238','#3a3f46');
  face(g,'L',.04,0,.92,7,'#1f2226');win(g,'L',.06,.5,.88,6,'#ffd9a0');face(g,'L',.5,.5,.015,6,'#1f2226');
  face(g,'R',.06,0,.6,7,'#1f2226');win(g,'R',.08,.5,.56,6,'#f2c98a');
  for(let u=.04;u<.96;u+=.07)face(g,'L',u,8.5,.035,8,'#a0703f');for(let u=.06;u<.66;u+=.07)face(g,'R',u,8.5,.035,8,'#8a5f34');
  face(g,'L',.2,7.2,.6,1,'#c9a227',NIGHT>.2);face(g,'L',.28,7.45,.44,.4,'#f2d675',NIGHT>.2);
  box(gx+.1,gy+.1,gx+.72,gy+.74,H,1,'#4a4f56','#3a3f46','#2e3238');
  dsort(gx,gy,[[.84,.3,()=>planter(gx+.84,gy+.3,.36)],[.84,.66,()=>{const [x,y]=P(gx+.84,gy+.68);cb(gx+.78,gy+.62,gx+.9,gy+.74,0,2.5,'#2e3238');for(const dx of [-2,-.5,1,2.5])px(x+dx,y-13,.5,11,'#6a9a3a');for(const [dx,dy] of [[-2.5,-12],[0,-14],[2,-11],[-1,-9],[1.5,-7]])px(x+dx,y+dy,1.5,.5,'#8fc25a')}],[.4,.86,()=>bpole(gx+.42,gy+.84,8)]]);
}

function artUnas(t,gx,gy,L){
  if(L===1){ // Salón de uñas: localito rosa con letrero pintado
    const H=10,g=cb(gx+.18,gy+.2,gx+.66,gy+.68,0,H,'#f4b6c2','#e8e2d6');
    face(g,'L',0,0,1,.8,'#d98a9a');face(g,'R',0,0,1,.8,'#c87a8a');
    win(g,'L',.08,2,.42,4,'#bfe0ea');face(g,'L',.14,2.6,.3,.6,'#f4efe2');
    face(g,'L',.58,0,.22,6,'#7a4e5a');face(g,'L',.6,.5,.18,5,'#e8c0c8');
    win(g,'R',.2,2,.55,4,'#b0d6e2');
    face(g,'L',.08,H-3,.84,2.2,'#ffffff');face(g,'L',.12,H-2.4,.46,.6,'#d6247a');face(g,'L',.12,H-1.5,.3,.5,'#d6247a');
    box(gx+.16,gy+.18,gx+.68,gy+.7,H,.8,'#e0a4b0','#c88a96','#b07a86');
    dsort(gx,gy,[[.82,.66,()=>{const [x,y]=P(gx+.82,gy+.66);px(x,y-5,.5,5,'#6e4a2c');board(x-3,y-10,6.5,5,'#ffffff',[[1,1,4.5,'#d6247a'],[1,2.5,3,'#d6247a'],[1,3.5,4,'#2b2b2b']])}],[.84,.32,()=>flowerPot(gx+.84,gy+.32,'#ff6fae')],[.34,.84,()=>flowerPot(gx+.34,gy+.84,'#f2c94c')]]);
    return}
  if(L===2){ // Nail Art: lila, vitrina grande y neón rosa
    const H=12,g=cb(gx+.14,gy+.14,gx+.68,gy+.7,0,H,'#b9a3d9','#d8d2c8');
    face(g,'L',0,0,1,1,'#7e6aa6');face(g,'R',0,0,1,1,'#6d5a94');
    win(g,'L',.06,1.5,.56,5,'#c8e2ee');chairIn(g,'L',.12,1.5,'#ff8fb1');chairIn(g,'L',.36,1.5,'#ff8fb1');
    face(g,'L',.68,0,.22,6.5,'#4a3a66');face(g,'L',.7,.5,.18,5.5,'#d8c8ee');
    win(g,'R',.12,1.5,.7,5,'#b8d8e8');
    awningL(g,.04,.96,6.6,'#8a6fc0','#ffffff');
    face(g,'L',.14,H-3.4,.72,2.4,'#3a2e52');face(g,'L',.18,H-2.8,.5,.6,'#ff6fae',true);face(g,'L',.18,H-1.9,.36,.5,'#ff6fae',true);
    {const a=P(gx+.42,gy+.7);glow(a[0],a[1]-H+2,9,.8,'#ff6fae')}
    {const a=P(gx+.68,gy+.42);px(a[0]-1,a[1]-H+3,2,3,'#ff6fae',true);px(a[0]-1.5,a[1]-H+1.5,3,1.5,'#ff6fae',true);px(a[0]-.5,a[1]-H+.8,1,.8,'#ffd1e3',true);glow(a[0],a[1]-H+2,6,.7,'#ff6fae')}
    box(gx+.12,gy+.12,gx+.7,gy+.72,H,1,'#5a4a7a','#4a3c66','#3c3054');
    dsort(gx,gy,[[.84,.34,()=>flowerPot(gx+.84,gy+.34,'#ff6fae')],[.82,.72,()=>flowerPot(gx+.82,gy+.72,'#b9a3d9')],[.32,.86,()=>bench(gx+.32,gy+.86,'#f4f2ee')]]);
    return}
  if(L===3){ // Ponte Chula: fiusha y dorado, arco de flores
    const H=13,g=cb(gx+.14,gy+.14,gx+.68,gy+.7,0,H,'#d6247a','#e8e2d6');
    face(g,'L',0,0,1,1.2,'#a3185c');face(g,'R',0,0,1,1.2,'#8e1450');
    face(g,'L',.04,0,.6,7,'#f2c94c');win(g,'L',.07,.5,.54,6,'#ffd9e6');chairIn(g,'L',.12,.6,'#ffffff');chairIn(g,'L',.34,.6,'#ffffff');
    face(g,'L',.7,0,.22,7,'#f2c94c');face(g,'L',.72,.5,.18,6,'#ffe9f2');
    win(g,'R',.12,1.5,.7,5,'#ffcde0');
    face(g,'L',.08,H-4.6,.84,3.6,'#ffffff');face(g,'L',.12,H-3.8,.6,.8,'#d6247a',NIGHT>.2);face(g,'L',.12,H-2.5,.76,.8,'#d6247a',NIGHT>.2);
    {const a=P(gx+.42,gy+.7);glow(a[0],a[1]-H+3,10,.8,'#ff6fae')}
    for(let k=0;k<9;k++){const f=k/8,a=P(gx+.14+.54*f,gy+.7),yy=a[1]-7.6-Math.sin(f*Math.PI)*1.6;circ(a[0],yy,1,['#ff6fae','#ffffff','#f2c94c'][k%3],NIGHT>.2)}
    box(gx+.12,gy+.12,gx+.7,gy+.72,H,1,'#f2c94c','#c9a227','#a8861d');
    dsort(gx,gy,[[.84,.34,()=>flowerPot(gx+.84,gy+.34,'#ff6fae')],[.82,.72,()=>flowerPot(gx+.82,gy+.72,'#ffffff')],[.34,.86,()=>{const [x,y]=P(gx+.34,gy+.86);px(x,y-5,.5,5,'#c9a227');board(x-3,y-10,6.5,5,'#d6247a',[[1,1,4.5,'#ffffff'],[1,2.5,3,'#f2c94c'],[1,3.5,4,'#ffffff']])}]]);
    return}
  // Spa for Women: dos pisos rubor y oro rosa, terraza con jardín
  const H=17,g=cb(gx+.12,gy+.12,gx+.7,gy+.72,0,H,'#f6dfe2','#e8d6d2');
  face(g,'L',0,0,1,.8,'#d8a48f');face(g,'R',0,0,1,.8,'#c48f7a');
  face(g,'L',.04,.8,.92,6.4,'#d8a48f');win(g,'L',.06,1.2,.88,5.6,'#ffe6dc');face(g,'L',.5,1.2,.015,5.6,'#d8a48f');
  face(g,'R',.06,.8,.6,6.4,'#d8a48f');win(g,'R',.08,1.2,.56,5.6,'#ffd8cc');
  for(const u of [.1,.4,.7]){win(g,'L',u,9.5,.2,5,'#cfe4ec');const a=g.L,b=g.B,ax=a[0]+(b[0]-a[0])*(u+.1),ay=a[1]+(b[1]-a[1])*(u+.1);arcTop(ax,ay-14.5,2.2,.6,'#d8a48f')}
  for(const u of [.2,.55])win(g,'R',u,9.5,.22,5,'#c4dce6');
  face(g,'L',.24,7.4,.52,.9,'#b07a68',NIGHT>.2);face(g,'L',.3,7.6,.4,.4,'#ffe6dc',NIGHT>.2);
  box(gx+.1,gy+.1,gx+.72,gy+.74,H,1,'#c9b0a8','#b8a098','#a89088');
  lifted(H+1,()=>{umbH(gx+.3,gy+.32,'#ffb6c8',5,'#ff9ab4');planter(gx+.6,gy+.26,.3);planter(gx+.24,gy+.64,.3);umbH(gx+.56,gy+.58,'#ffffff',5,'#f0e4e0')});
  dsort(gx,gy,[[.84,.3,()=>flowerPot(gx+.84,gy+.3,'#ff6fae')],[.84,.68,()=>planter(gx+.84,gy+.68,.36)],[.36,.86,()=>flowerPot(gx+.36,gy+.86,'#ffffff')]]);
}

function gymMan(fx,fy,sh,a){const [x,y]=P(fx,fy);person(x,y,{shirt:sh,pants:'#2b2b2b',skin:'#c68642',hair:'#2b1b0f',front:true,scale:.9,fr:a||0})}
function artGym(t,gx,gy,L){
  if(L===1){ // Aparatos en el parque: piso de hule y fierros pintados
    topFace(gx+.12,gy+.12,gx+.88,gy+.88,0,'#3f8f3a');topFace(gx+.2,gy+.2,gx+.8,gy+.8,.3,'#b5543a');
    const bar=(x0,y0,x1,y1,h,c)=>{const a=P(x0,y0),b=P(x1,y1);px(a[0],a[1]-h,.75,h,c);px(b[0],b[1]-h,.75,h,c);line(a[0],a[1]-h,b[0]+.5,b[1]-h,c)};
    dsort(gx,gy,[
      [.3,.3,()=>tree(gx+.16,gy+.16,.55)],
      [.4,.3,()=>{bar(gx+.3,gy+.3,gx+.56,gy+.3,11,'#f2c94c');const a=P(gx+.43,gy+.3);gymMan(gx+.43,gy+.3,'#e63946');}],
      [.66,.46,()=>{bar(gx+.62,gy+.36,gx+.62,gy+.6,5,'#2f6db5');bar(gx+.7,gy+.36,gx+.7,gy+.6,5,'#2f6db5')}],
      [.36,.66,()=>{const [x,y]=P(gx+.36,gy+.66);px(x-3,y-1.5,6,1.5,'#2f6db5');px(x-2.5,y-6,1,4.5,'#f2c94c');px(x+1.5,y-6,1,4.5,'#f2c94c');line(x-2,y-6,x+2,y-6,'#f2c94c');px(x-.5,y-3,1.5,1.5,'#555')}],
      [.62,.74,()=>{gymMan(gx+.62,gy+.74,'#2a9d8f',1)}],
      [.86,.86,()=>bench(gx+.86,gy+.86,'#a0663a')]]);
    {const [x,y]=P(gx+.14,gy+.78);px(x,y-6,.5,6,'#4a4f5a');board(x-3.5,y-11,7.5,5,'#3f8f3a',[[1,1,5.5,'#ffffff'],[1,2.5,4,'#f2c94c']])}
    return}
  if(L===2){ // Start Fit: caja blanca, franja amarilla y caminadoras a la vista
    const H=12,g=cb(gx+.14,gy+.14,gx+.7,gy+.72,0,H,'#f4f2ee','#c9c5bd');
    face(g,'L',0,0,1,.8,'#3a3a3a');face(g,'R',0,0,1,.8,'#2e2e2e');
    win(g,'L',.04,1,.68,6,'#bcd6e6');win(g,'R',.06,1,.88,6,'#aecbdc');
    for(const u of [.1,.28,.46]){face(g,'L',u,1,.1,1.2,'#2b2b2b');face(g,'L',u+.07,1,.03,3.4,'#555')}
    for(const u of [.14,.4,.66]){face(g,'R',u,1,.12,1.2,'#2b2b2b');face(g,'R',u+.09,1,.03,3.4,'#555')}
    face(g,'L',.76,0,.2,6.5,'#2b2b2b');face(g,'L',.78,.5,.16,5.5,'#9fc4dc');
    face(g,'L',0,7.4,1,2.2,'#ffcc00');face(g,'R',0,7.4,1,2.2,'#e6b800');
    face(g,'L',.14,7.8,.5,.6,'#1f1f1f');face(g,'L',.14,8.7,.34,.4,'#1f1f1f');
    box(gx+.12,gy+.12,gx+.72,gy+.74,H,.8,'#5a5a5a','#4a4a4a','#3a3a3a');
    dsort(gx,gy,[[.84,.34,()=>planter(gx+.84,gy+.34,.34)],[.86,.72,()=>bench(gx+.86,gy+.72,'#2b2b2b')]]);
    return}
  if(L===3){ // Cañón Box: nave de lámina, cortina arriba y llantas afuera
    const H=13,g=cb(gx+.12,gy+.12,gx+.74,gy+.74,0,H,'#8b9096','#7a7f86');
    for(let u=.02;u<1;u+=.05){face(g,'L',u,0,.012,H,'#6f747a');face(g,'R',u,0,.012,H,'#62676d')}
    face(g,'L',.08,0,.56,8,'#1c1c1c');
    for(let k=0;k<4;k++)face(g,'L',.12+k*.14,0,.02,7,'#f26a21',NIGHT>.2);face(g,'L',.1,6.6,.52,.5,'#f26a21',NIGHT>.2);
    face(g,'L',.08,8,.56,1.2,'#5a5f66');
    win(g,'R',.14,4,.7,3,'#c0d4e0');
    face(g,'L',0,H-2,1,1.2,'#f26a21');face(g,'R',0,H-2,1,1.2,'#d85a14');
    {const A=g.L,B=g.B,ax=A[0]+(B[0]-A[0])*.36,ay=A[1]+(B[1]-A[1])*.36;arcTop(ax,ay-10.6,3,1,'#f26a21',NIGHT>.2);glow(ax,ay-10,7,.6,'#f26a21')}
    box(gx+.1,gy+.1,gx+.76,gy+.76,H,.8,'#6f747a','#5a5f66','#4a4f56');
    {const [x,y]=P(gx+.4,gy+.66);gymMan(gx+.4,gy+.7,'#f26a21')}
    dsort(gx,gy,[
      [.84,.3,()=>{const [x,y]=P(gx+.84,gy+.3);ellipse(x,y-1.5,4,2,'#1c1c1c');ellipse(x,y-1.5,2,1,'#3a3a3a');ellipse(x,y-3.5,4,2,'#222');ellipse(x,y-3.5,2,1,'#3a3a3a')}],
      [.86,.56,()=>{const [x,y]=P(gx+.86,gy+.56);circ(x-2,y-1.5,1.5,'#2b2b2b');px(x-2.5,y-3.8,1,1,'#2b2b2b');circ(x+1.5,y-1.5,1.5,'#f26a21');px(x+1,y-3.8,1,1,'#2b2b2b')}],
      [.36,.86,()=>{const [x,y]=P(gx+.36,gy+.86);px(x-4,y-1.5,8,.75,'#9aa0a6');px(x-4.5,y-2.5,1.5,3,'#1c1c1c');px(x+3,y-2.5,1.5,3,'#1c1c1c')}]]);
    return}
  // Wellness Elite: tres pisos de vidrio, aletas de madera y alberca en la azotea
  const H=24,g=cb(gx+.1,gy+.1,gx+.76,gy+.76,0,H,'#e8e4dc','#d8d4cc');
  for(let fl=0;fl<3;fl++){const v=fl*7.8+.6;win(g,'L',.04,v,.92,6.6,fl===0?'#ffe6c0':'#bcd6e6');win(g,'R',.04,v,.92,6.6,fl===0?'#f2d8b0':'#aecbdc');face(g,'L',0,v+6.6,1,.6,'#e8e4dc');face(g,'R',0,v+6.6,1,.6,'#d8d4cc')}
  for(let u=.12;u<.96;u+=.12){face(g,'L',u,8.4,.03,15,'#a0703f');face(g,'R',u,8.4,.03,15,'#8a5f34')}
  for(const [u,s] of [[.2,'#2a9d8f'],[.5,'#e9c46a']]){face(g,'L',u,9.2,.08,2.2,s);face(g,'L',u+.02,11.4,.04,1.2,'#c68642')}
  face(g,'L',.3,6.6,.4,1,'#2a9d8f',NIGHT>.2);
  box(gx+.08,gy+.08,gx+.78,gy+.78,H,.8,'#c9c5bd','#b9b5ad','#a9a59d');
  lifted(H+.8,()=>{topFace(gx+.2,gy+.36,gx+.6,gy+.66,.3,'#4fb3d9');topFace(gx+.24,gy+.4,gx+.56,gy+.62,.4,'#7fd0ec');planter(gx+.68,gy+.2,.3);umbH(gx+.66,gy+.6,'#ffffff',5,'#e8e4dc')});
  dsort(gx,gy,[[.88,.3,()=>planter(gx+.88,gy+.3,.36)],[.88,.7,()=>planter(gx+.88,gy+.7,.36)],[.4,.9,()=>{const [x,y]=P(gx+.4,gy+.9);px(x,y-6,.5,6,'#4a4f5a');board(x-3.5,y-11,7.5,5,'#1f3a3a',[[1,1,5.5,'#e9c46a'],[1,2.5,4,'#ffffff']])}]]);
}

