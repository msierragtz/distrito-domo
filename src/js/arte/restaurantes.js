/* ===== RESTAURANTE ===== */
function restoOld(t,gx,gy,L){
  if(L===1){ // puesto de barbacoa
    dsort(gx,gy,[
      [.4,.42,()=>{const g=cb(gx+.33,gy+.35,gx+.49,gy+.5,0,5.5,'#3a3a3a','#555');face(g,'L',0,1.5,1,.5,'#2b2b2b');face(g,'R',0,1.5,1,.5,'#2b2b2b');face(g,'L',0,4,1,.5,'#2b2b2b');face(g,'R',0,4,1,.5,'#2b2b2b');
        const [x,y]=P(gx+.41,gy+.425);px(x-3,y-6,6,.5,'#e05a24',true);px(x-2,y-6.5,4,.5,'#ffb347',true);glow(x,y-6,6,.6);smokeH(x,y-7)}],
      [.62,.36,()=>{const g=cb(gx+.56,gy+.3,gx+.72,gy+.42,0,4,'#e8ecef');face(g,'L',0,2.5,1,1.5,'#2f6db5');face(g,'R',0,2.5,1,1.5,'#25589a')}],
      
      [.62,.64,()=>tableH(gx+.62,gy+.64,'#d62828','#b81f1f')],
      [.76,.6,()=>chairH(gx+.77,gy+.6,'#d62828')],[.56,.8,()=>chairH(gx+.56,gy+.8,'#2f6db5')],[.74,.82,()=>chairH(gx+.74,gy+.82,'#d62828')]]);
    for(const [a,b] of [[.2,.18],[.8,.18],[.2,.74],[.8,.74]]){const [x,y]=P(gx+a,gy+b);px(x,y-11,1,11,'#8d9096')}
    {const g=box(gx+.16,gy+.14,gx+.84,gy+.78,10,1.2,'#e04a3a','#c23a2e','#a8322a');for(let k=0;k<10;k++){face(g,'L',k/10,-.8,.06,.8,k%2?'#ffffff':'#c23a2e');face(g,'R',k/10,-.8,.06,.8,k%2?'#ececec':'#a8322a')}}
    const [sx,sy]=P(gx+.08,gy+.9);px(sx,sy-6,1,6,'#6e4a2c');board(sx-5,sy-12,11,6,'#f4efe2',[[1,1,9,'#d62828'],[1,2,9,'#d62828'],[1,3.5,6,'#d62828'],[1,4.5,8,'#2b2b2b']]);
    return}
  if(L===2){ // lonchería
    const H=14,g=cb(gx+.14,gy+.14,gx+.62,gy+.72,0,H,'#f1d27a','#c9c1b2');
    face(g,'L',0,0,1,1.5,'#3fa38a');face(g,'R',0,0,1,1.5,'#33876f');
    face(g,'L',.08,1.5,.84,5,'#2a2420');for(let k=0;k<4;k++)face(g,'L',.15+k*.2,2,.1,2,'#c9b38a');
    face(g,'L',.08,6.5,.84,4.5,'#a9adb3');for(let v=6.9;v<11;v+=.8)face(g,'L',.08,v,.84,.25,'#8b9096');face(g,'L',.08,6.5,.84,.5,'#6e737a');
    face(g,'L',.04,H-2.5,.92,2.5,'#ffffff');face(g,'L',.08,H-2,.4,.75,'#d62828');face(g,'L',.52,H-2,.4,.75,'#2f6db5');face(g,'L',.1,H-1,.7,.5,'#2b2b2b');
    win(g,'R',.15,4,.3,4.5,'#7fb2d4');win(g,'R',.55,4,.3,4.5,'#7fb2d4');face(g,'R',.12,3.5,.76,.5,'#3fa38a');
    box(gx+.12,gy+.12,gx+.64,gy+.74,H,1,'#b9b3a7','#a8a296','#948e83');
    {const [x,y]=P(gx+.3,gy+.32);px(x-1.5,y-H-5.5,3.5,5,'#1c1c1c');px(x-1.5,y-H-6,3.5,.5,'#3a3a3a')}
    dsort(gx,gy,[
      [.82,.35,()=>{chairH(gx+.9,gy+.3,'#d62828');tableH(gx+.82,gy+.36,'#d62828');chairH(gx+.72,gy+.44,'#d62828')}],
      [.82,.75,()=>{chairH(gx+.9,gy+.7,'#d62828');tableH(gx+.82,gy+.76,'#d62828');chairH(gx+.72,gy+.84,'#d62828')}],
      [.44,.88,()=>{const [x,y]=P(gx+.44,gy+.88);board(x-2.5,y-7.5,5.5,6,'#2b2b2b',[[.5,.5,4.5,'#f4f4f4'],[.5,2,3,'#f2c94c'],[.5,3.5,4,'#f4f4f4']]);px(x-2.5,y-1.5,.5,1.5,'#555');px(x+2.5,y-1.5,.5,1.5,'#555')}],
      ]);
    return}
  if(L===3){ // hamburguesas: contenedores
    const H=9,g=cb(gx+.1,gy+.12,gx+.42,gy+.88,0,H,'#2b2b2b','#3a3a3a');
    for(let u=.03;u<1;u+=.05)face(g,'R',u,0,.02,H,'#474747');for(let u=.06;u<1;u+=.12)face(g,'L',u,0,.04,H,'#3f3f3f');
    face(g,'R',.18,2,.64,4.5,NIGHT>.2?'#ffd27a':'#e8b45a',NIGHT>.2);face(g,'R',.18,6,.64,1,'#f26a21');
    const g2=cb(gx+.12,gy+.14,gx+.4,gy+.55,H,7,'#f26a21','#e07b39');for(let u=.04;u<1;u+=.07)face(g2,'R',u,0,.025,7,'#d6601f');
    {const [x,y]=P(gx+.26,gy+.5);px(x-6.5,y-H-14,13.5,4.5,'#1c1c1c');px(x-5.5,y-H-13,11.5,2.5,'#ff5d8f',NIGHT>.2);for(const k of [-3.5,-.5,2.5])px(x+k,y-H-13,.5,2.5,'#1c1c1c');glow(x,y-H-12,12,.9)}
    const pA=P(gx+.92,gy+.12),pB=P(gx+.92,gy+.88);
    dsort(gx,gy,[
      [.62,.3,()=>cb(gx+.56,gy+.18,gx+.66,gy+.48,0,2.5,'#a0663a')],[.62,.7,()=>cb(gx+.56,gy+.55,gx+.66,gy+.85,0,2.5,'#a0663a')],
      [.78,.3,()=>cb(gx+.74,gy+.2,gx+.8,gy+.46,0,1.5,'#7a4e2c')],[.78,.7,()=>cb(gx+.74,gy+.57,gx+.8,gy+.83,0,1.5,'#7a4e2c')],
      ]);
    px(pA[0],pA[1]-14,1,14,'#555');px(pB[0],pB[1]-14,1,14,'#555');
    {const s1=P(gx+.42,gy+.2),s2=P(gx+.42,gy+.8);bulbsH([s1[0],s1[1]-H-2],[pA[0],pA[1]-14],8,3);bulbsH([s2[0],s2[1]-H-2],[pB[0],pB[1]-14],8,3)}
    return}
  // restaurante de autor
  const H=17,g=cb(gx+.1,gy+.1,gx+.56,gy+.72,0,H,'#b3aea6','#9d978e');
  for(let v=3.5;v<H;v+=3.5){face(g,'L',0,v,1,.25,'#a49f96');face(g,'R',0,v,1,.25,'#8c877f')}
  face(g,'L',.05,0,.9,9.5,'#ffe2a8',true);for(const u of [.33,.64])face(g,'L',u,0,.02,9.5,'#3a3a3a');face(g,'L',.05,9,.9,.5,'#3a3a3a');
  for(const u of [.15,.45,.75]){face(g,'L',u,1.5,.08,2.5,'#7a5a3c');face(g,'L',u-.02,4,.12,.5,'#5a4632')}
  face(g,'R',.06,0,.5,9.5,'#f2d090',true);face(g,'R',.66,0,.25,7.5,'#3a3a3a');
  box(gx+.06,gy+.06,gx+.6,gy+.76,H,1.5,'#6b665f','#5a554f','#48443f');
  {const [x,y]=P(gx+.06,gy+.42);px(x-1,y-7,3,1,'#c9a227');px(x,y-6,1,6,'#3a3a3a');glow(x,y-6,10,.5)}
  dsort(gx,gy,[
    [.78,.3,()=>{chairH(gx+.86,gy+.25,'#2b2b2b');tableH(gx+.78,gy+.31,'#ffffff','#888');chairH(gx+.7,gy+.38,'#2b2b2b')}],
    [.78,.62,()=>{chairH(gx+.86,gy+.57,'#2b2b2b');tableH(gx+.78,gy+.63,'#ffffff','#888');chairH(gx+.7,gy+.7,'#2b2b2b')}],
    [.3,.9,()=>olive(gx+.3,gy+.88)]]);
  for(const [a,b] of [[.62,.14],[.94,.14],[.62,.9],[.94,.9]]){const [x,y]=P(gx+a,gy+b);px(x,y-11,1,11,'#4a3a2c')}
  for(let k=0;k<10;k++){const b=.15+k*.083,A=P(gx+.6,gy+b),B=P(gx+.96,gy+b);line(A[0],A[1]-11,B[0],B[1]-11,'#7a5a3c')}
  for(const a of [.62,.94]){const A=P(gx+a,gy+.14),B=P(gx+a,gy+.9);line(A[0],A[1]-11,B[0],B[1]-11,'#4a3a2c',false,2)}
}

/* ===== RESTAURANTES: cuatro líneas, cada una con su comida (hamburguesas, pollos, tacos y carne, mariscos) ===== */
// íconos de letrero
function burgerIco(x,y,s,lit){ellipse(x,y-3.2*s,4*s,1.6*s,'#e0a050',lit);ellipse(x,y-2*s,4.3*s,.9*s,'#59b04f',lit);ellipse(x,y-1.3*s,4.2*s,1*s,'#5a3320',lit);px(x-4*s,y-.9*s,8*s,.6*s,'#f2c94c',lit);ellipse(x,y-.1*s,3.9*s,1.1*s,'#d69445',lit);px(x-1.5*s,y-4*s,.6*s,.5*s,'#f4efe2',lit);px(x+1*s,y-3.6*s,.6*s,.5*s,'#f4efe2',lit)}
function drumIco(x,y,s,lit){ellipse(x-1*s,y-1.5*s,3*s,2.2*s,'#c9772e',lit);ellipse(x-1.5*s,y-2.2*s,1.4*s,.8*s,'#e39a4c',lit);px(x+1.5*s,y-1.6*s,2.6*s,.9*s,'#f4efe2',lit);circ(x+4.3*s,y-1.9*s,.8*s,'#f4efe2',lit);circ(x+4.3*s,y-.9*s,.8*s,'#f4efe2',lit)}
function tacoIco(x,y,s,lit){arcTop(x,y,3.6*s,1.4*s,'#f2c94c',lit);for(let k=-2;k<=2;k++)px(x+k*1.2*s-.5*s,y-2.6*s+Math.abs(k)*.4*s,1*s,1*s,k%2?'#59b04f':'#d62828',lit);px(x-3.4*s,y-.4*s,6.8*s,.5*s,'#e0b040',lit)}
function shrimpIco(x,y,s,lit){const c='#ff8c69',d='#e2603f';for(let k=0;k<7;k++){const an=Math.PI*(.15+k*.12),r=3.2*s;circ(x+Math.cos(an)*r,y-Math.sin(an)*r*.9,(1.35-k*.11)*s,k%2?c:d,lit)}
  px(x-3.9*s,y+.2*s,1.6*s,.8*s,d,lit);px(x-4.5*s,y-.3*s,1*s,1.6*s,c,lit);px(x+2.7*s,y-2.7*s,.6*s,.6*s,'#1c1c1c',lit);line(x+3.2*s,y-2.8*s,x+5.5*s,y-4.8*s,'#e2603f',lit);line(x+3*s,y-2.4*s,x+5.8*s,y-3.2*s,'#e2603f',lit)}
function cornIco(x,y,s,lit){ellipse(x,y-2*s,1.4*s,3*s,'#f2c94c',lit);for(let k=0;k<3;k++)px(x-.9*s,y-4*s+k*1.6*s,1.8*s,.4*s,'#d9a520',lit);px(x-.3*s,y+.5*s,.6*s,1.5*s,'#7a4e2c',lit);px(x+1*s,y-1.5*s,1*s,2.5*s,'#7fb05a',lit)}
// letrero alto en poste con ícono
function poleSign(fx,fy,h,bg,ico,lit=NIGHT>.2){const [x,y]=P(fx,fy);px(x,y-h,1,h,'#555');px(x-6,y-h-9,13,9,'#1c1c1c');px(x-5.5,y-h-8.5,12,8,bg,lit);ico(x+.5,y-h-2,1,lit);if(lit)glow(x,y-h-4,11,.7)}
function roofSign(fx,fy,H,bg,ico,w=15){const [x,y]=P(fx,fy),lit=NIGHT>.2;px(x-.5,y-H-3,1,3,'#3a3a3a');px(x-w/2-.5,y-H-13,w+1,10.5,'#1c1c1c');px(x-w/2,y-H-12.5,w,9.5,bg,lit);ico(x,y-H-5,1.15,lit);if(lit)glow(x,y-H-8,14,.8)}
function cart(fx,fy,top,body,deco){const g=cb(fx-.13,fy-.08,fx+.13,fy+.08,1.5,4,body);const [x,y]=P(fx,fy);for(const dx of [-4,3])circ(x+dx,y,1.3,'#2b2b2b');if(deco)deco(g,x,y);return g}
function shopBox(gx,gy,x0,y0,x1,y1,H,wall,wallR,trim){const g=box(gx+x0,gy+y0,gx+x1,gy+y1,0,H,trim||'#b9b3a7',wall,wallR||hexShade(wall,-.16));box(gx+x0-.02,gy+y0-.02,gx+x1+.02,gy+y1+.02,H,1,trim||'#b9b3a7',hexShade(trim||'#b9b3a7',-.05),hexShade(trim||'#b9b3a7',-.2));return g}
function awningL(g,u0,u1,v,c1,c2){for(let k=0;k<8;k++){const u=u0+(u1-u0)*k/8;face(g,'L',u,v,(u1-u0)/8,1.6,k%2?c2:c1)}}
function tablesSet(gx,gy,cT,cC,spots){return spots.map(([a,b])=>[a,b,()=>{chairH(gx+a+.07,gy+b-.05,cC);tableH(gx+a,gy+b,cT);chairH(gx+a-.08,gy+b+.08,cC)}])}

function artResto(t,gx,gy,L){const ln=t.s==null?0:(t.s>>2)%4;t.__gx=gx;t.__gy=gy;try{return RESTO[ln][L-1](t,gx,gy)}finally{delete t.__gx;delete t.__gy}}
const RESTO=[
 // A · hamburguesas
 [t=>restoOld(t,t.__gx,t.__gy,1),t=>restoOld(t,t.__gx,t.__gy,2),t=>restoOld(t,t.__gx,t.__gy,3),
  (t,gx,gy)=>{ // Chochomos: hamburguesería de dos pisos con hamburguesa gigante
   const H=18,g=shopBox(gx,gy,.1,.1,.6,.7,H,'#2b2b2b','#232323','#3a3a3a');
   face(g,'L',.05,0,.9,8,NIGHT>.2?'#ffd27a':'#f0c27a',NIGHT>.2);for(const u of [.35,.65])face(g,'L',u,0,.02,8,'#1c1c1c');face(g,'L',0,8,1,1.4,'#e0a050');
   face(g,'R',.1,0,.35,6.5,'#3d3d3d');face(g,'R',.55,2,.35,5,NIGHT>.2?'#ffd27a':'#f0c27a',NIGHT>.2);face(g,'R',0,8,1,1.4,'#c98a3a');
   for(const u of [.1,.4,.7]){face(g,'L',u,11,.2,4.5,'#4a4f5a');face(g,'L',u+.02,11.5,.16,3.5,NIGHT>.2?'#ffe9a8':'#9fc4dc',NIGHT>.2)}
   {const [x,y]=P(gx+.35,gy+.4);burgerIco(x,y-H-2,2.2,NIGHT>.2);if(NIGHT>.2)glow(x,y-H-6,16,.8)}
   dsort(gx,gy,tablesSet(gx,gy,'#e0a050','#2b2b2b',[[.8,.3],[.8,.66]]).concat([[.3,.9,()=>planter(gx+.3,gy+.88,.35)]]));
  }],
 // B · pollos
 [(t,gx,gy)=>{ // Pollos al carbón: asador giratorio
   dsort(gx,gy,[[.45,.45,()=>{const g=cb(gx+.3,gy+.36,gx+.6,gy+.52,0,5,'#3a3a3a','#555');face(g,'L',0,4,1,.6,'#2b2b2b');const [x,y]=P(gx+.45,gy+.44);
      px(x-6,y-9.5,12,.5,'#8d9096');for(const dx of [-4,0,4]){ellipse(x+dx,y-8.5,1.8,1.3,'#c9772e',true);px(x+dx-.5,y-9.4,1,.5,'#e39a4c',true)}px(x-5,y-5.5,10,.5,'#e05a24',true);glow(x,y-6,7,.7);smokeH(x+1,y-11)}],
     ...tablesSet(gx,gy,'#f2c94c','#d62828',[[.75,.7]])]);
   for(const [a,b] of [[.22,.2],[.78,.2],[.22,.72],[.78,.72]]){const [x,y]=P(gx+a,gy+b);px(x,y-12,1,12,'#8d9096')}
   {const g=box(gx+.18,gy+.16,gx+.82,gy+.76,11,1.2,'#f2c94c','#e0b040','#c99a30');for(let k=0;k<10;k++){face(g,'L',k/10,-.8,.06,.8,k%2?'#d62828':'#e0b040');face(g,'R',k/10,-.8,.06,.8,k%2?'#b81f1f':'#c99a30')}}
   poleSign(gx+.1,gy+.9,6,'#f2c94c',drumIco)},
  (t,gx,gy)=>{ // El Pollo Pillo: local amarillo con pierna en el techo
   const H=13,g=shopBox(gx,gy,.14,.14,.62,.72,H,'#f2c94c','#d9b03a');
   face(g,'L',.06,0,.88,6.5,'#7fb2d4');for(const u of [.33,.66])face(g,'L',u,0,.02,6.5,'#d62828');awningL(g,0,1,6.5,'#d62828','#ffffff');
   face(g,'R',.2,2,.6,4,'#7fb2d4');face(g,'R',0,H-2,1,1,'#d62828');face(g,'L',0,H-2,1,1,'#d62828');
   {const [x,y]=P(gx+.38,gy+.43);drumIco(x-1,y-H-4,1.7,NIGHT>.2);if(NIGHT>.2)glow(x,y-H-5,12,.7)}
   dsort(gx,gy,tablesSet(gx,gy,'#f4f4f4','#d62828',[[.82,.32],[.82,.7]]))},
  (t,gx,gy)=>{ // Bison Mad Wings: bar de alitas oscuro con neón
   const H=12,g=shopBox(gx,gy,.1,.12,.58,.8,H,'#4a3a32','#3b2e28','#2b2b2b');
   for(let v=1.5;v<H;v+=1.5){face(g,'L',0,v,1,.2,'#5a463c');face(g,'R',0,v,1,.2,'#46362f')}
   face(g,'L',.08,1,.84,5,NIGHT>.2?'#ffb066':'#c98a5a',NIGHT>.2);face(g,'L',.1,1.3,.3,4.4,'#2b5a8a',true);face(g,'L',.5,0,.2,6,'#1c1c1c');
   {const [x,y]=P(gx+.34,gy+.46);px(x-8,y-H-9,16,7,'#1c1c1c');drumIco(x-2,y-H-3.5,1.3,true);px(x+3,y-H-7,4,.8,'#ff5d2a',true);px(x+3,y-H-5.5,4,.8,'#ff5d2a',true);glow(x,y-H-6,14,.9)}
   dsort(gx,gy,[[.8,.3,()=>{cb(gx+.74,gy+.22,gx+.86,gy+.4,0,2.2,'#7a4e2c');cb(gx+.72,gy+.2,gx+.88,gy+.42,2.2,.4,'#8a5a3a')}],[.8,.66,()=>{cb(gx+.74,gy+.58,gx+.86,gy+.76,0,2.2,'#7a4e2c');cb(gx+.72,gy+.56,gx+.88,gy+.78,2.2,.4,'#8a5a3a')}],
     [.92,.9,()=>{const g2=cb(gx+.88,gy+.86,gx+.96,gy+.94,0,3,'#9aa0a8');face(g2,'L',0,1,1,.4,'#6e737a')}]]);
   {const a=P(gx+.6,gy+.15),b=P(gx+.95,gy+.15);bulbsH([a[0],a[1]-10],[b[0],b[1]-8],6,2)}},
  (t,gx,gy)=>{ // Panacea: blanco, ventanales y terraza con plantas
   const H=16,g=shopBox(gx,gy,.1,.1,.58,.72,H,'#f4f3ef','#dcd9d2','#c9c5bd');
   face(g,'L',.05,0,.9,7.5,NIGHT>.2?'#ffe2a8':'#bcd9e8',NIGHT>.2);for(const u of [.3,.55,.8])face(g,'L',u,0,.02,7.5,'#9a958c');
   face(g,'L',.05,9.5,.9,4,NIGHT>.2?'#ffe2a8':'#bcd9e8',NIGHT>.2);face(g,'L',0,8,1,1,'#c9a227');face(g,'R',.1,9.5,.8,4,'#bcd9e8');face(g,'R',0,8,1,1,'#b08f20');
   for(let u=.04;u<1;u+=.12){face(g,'L',u,H-1.5,.06,1.5,'#59b04f')}
   {const [x,y]=P(gx+.1,gy+.42);px(x-1,y-7.5,3,1,'#c9a227');px(x,y-6.5,1,6.5,'#3a3a3a');drumIco(x+.5,y-9,.9,NIGHT>.2)}
   dsort(gx,gy,[[.8,.3,()=>{tableH(gx+.8,gy+.3,'#ffffff','#888');umbH(gx+.8,gy+.3,'#2f7d55',8)}],[.8,.68,()=>{tableH(gx+.8,gy+.68,'#ffffff','#888');umbH(gx+.8,gy+.68,'#2f7d55',8)}],
     [.95,.5,()=>planter(gx+.95,gy+.5,.32)],[.4,.9,()=>olive(gx+.4,gy+.88)]])}],
 // C · tacos y carne
 [(t,gx,gy)=>{ // Tacos a vapor: triciclo con canasta
   dsort(gx,gy,[[.5,.5,()=>{cart(gx+.5,gy+.5,null,'#c9ccd1',(g,x,y)=>{const c=cb(gx+.42,gy+.44,gx+.56,gy+.56,5.5,4,'#c9a06a');face(c,'L',0,0,1,4,'#b38a55');face(c,'L',0,1.5,1,.4,'#8a6a3a');face(c,'L',0,3,1,.4,'#8a6a3a');smokeH(x,y-12)});
      const [x,y]=P(gx+.5,gy+.5);umbH(gx+.62,gy+.58,'#d62828',14,'#ffffff')}],[.78,.75,()=>{chairH(gx+.78,gy+.75,'#2f6db5')}]]);
   poleSign(gx+.15,gy+.88,5,'#f4efe2',tacoIco)},
  (t,gx,gy)=>{ // Tacos de asada: lona, asador y mesas
   dsort(gx,gy,[[.4,.4,()=>{const g=cb(gx+.25,gy+.3,gx+.58,gy+.46,0,4.5,'#c9ccd1');face(g,'L',0,3.5,1,1,'#3a3a3a');const [x,y]=P(gx+.42,gy+.38);px(x-6,y-5.5,10,.6,'#e05a24',true);glow(x,y-5,7,.6);smokeH(x-2,y-7);
      const c=cb(gx+.48,gy+.33,gx+.54,gy+.39,4.5,6,'#b5652a');face(c,'L',0,1,1,.8,'#d98a3a');face(c,'L',0,3.5,1,.8,'#d98a3a')}],
     ...tablesSet(gx,gy,'#d62828','#d62828',[[.75,.32],[.75,.7],[.4,.78]])]);
   for(const [a,b] of [[.16,.16],[.9,.16],[.16,.88],[.9,.88]]){const [x,y]=P(gx+a,gy+b);px(x,y-12,1,12,'#8d9096')}
   {const g=box(gx+.12,gy+.12,gx+.94,gy+.92,11,.6,'#2f6db5','#25589a','#1d4a80');face(g,'L',0,-.4,1,.4,'#ffffff');face(g,'R',0,-.4,1,.4,'#ececec')}
   poleSign(gx+.06,gy+.5,4,'#ffffff',tacoIco)},
  (t,gx,gy)=>{ // Asador La Pampa: casa de ladrillo con chimenea y parrilla
   const H=12,g=shopBox(gx,gy,.1,.12,.6,.72,H,'#a8522f','#8a4227','#6e4a2c');
   for(let v=1;v<H;v+=1.2){face(g,'L',0,v,1,.25,'#963f22');face(g,'R',0,v,1,.25,'#7a351c')}
   face(g,'L',.1,1,.35,5,NIGHT>.2?'#ffcf87':'#7fb2d4',NIGHT>.2);face(g,'L',.55,0,.3,6.5,'#5a3a24');face(g,'R',.2,2,.6,4,NIGHT>.2?'#ffcf87':'#7fb2d4',NIGHT>.2);
   face(g,'L',0,7.5,1,2.2,'#f4efe2');face(g,'L',.1,8.1,.8,.5,'#6e4a2c');face(g,'L',.1,8.9,.5,.4,'#6e4a2c');
   {const c=cb(gx+.44,gy+.18,gx+.54,gy+.28,H,6,'#8a4227');const [x,y]=P(gx+.49,gy+.23);smokeH(x,y-H-7)}
   dsort(gx,gy,[[.8,.35,()=>{const p=cb(gx+.74,gy+.26,gx+.9,gy+.44,0,3.5,'#6e737a');const [x,y]=P(gx+.82,gy+.35);px(x-3,y-4,6,.6,'#e05a24',true);glow(x,y-4,6,.6);smokeH(x,y-6)}],
     ...tablesSet(gx,gy,'#6e4a2c','#3a3a3a',[[.82,.72]])])},
  (t,gx,gy)=>{ // La Regional: casona norteña de cantera con arcos y terraza
   const H=17,g=shopBox(gx,gy,.08,.08,.62,.74,H,'#e9d5b0','#d2bd96','#b98a5a');
   for(const u of [.08,.4,.72]){face(g,'L',u,0,.2,6.5,'#5a3a24');face(g,'L',u+.03,0,.14,5.5,NIGHT>.2?'#ffcf87':'#6a4a32',NIGHT>.2)}
   for(const u of [.1,.42,.74]){face(g,'L',u,9,.16,4.5,'#5a3a24');face(g,'L',u+.02,9.4,.12,3.6,NIGHT>.2?'#ffe2a8':'#9fc4dc',NIGHT>.2);face(g,'L',u-.02,8.6,.2,.5,'#b98a5a')}
   face(g,'R',.15,0,.3,6.5,'#5a3a24');face(g,'R',.6,9,.25,4.5,'#9fc4dc');face(g,'L',0,7,1,1,'#b98a5a');face(g,'R',0,7,1,1,'#9c7048');
   {const [x,y]=P(gx+.35,gy+.41);px(x-9,y-H-8,18,7,'#5a3a24');px(x-8.5,y-H-7.5,17,6,'#f4efe2',NIGHT>.2);tacoIco(x-4,y-H-2.5,.9,NIGHT>.2);px(x+.5,y-H-6,6,.6,'#5a3a24');px(x+.5,y-H-4.5,4.5,.6,'#d62828');if(NIGHT>.2)glow(x,y-H-5,14,.7)}
   dsort(gx,gy,[[.82,.3,()=>{tableH(gx+.82,gy+.3,'#f4efe2','#555');umbH(gx+.82,gy+.3,'#d62828',8,'#b81f1f')}],[.82,.68,()=>{tableH(gx+.82,gy+.68,'#f4efe2','#555');umbH(gx+.82,gy+.68,'#d62828',8,'#b81f1f')}],[.35,.9,()=>planter(gx+.35,gy+.88,.36)]])}],
 // D · elotes y mariscos
 [(t,gx,gy)=>{ // Elotes asados: carrito
   dsort(gx,gy,[[.5,.5,()=>{cart(gx+.5,gy+.5,null,'#f2c94c',(g,x,y)=>{face(g,'L',.1,.8,.8,2,'#d62828');for(const dx of [-3,-1,1,3]){cornIco(x+dx,y-7.2,.55,true)}const [cx,cy]=P(gx+.5,gy+.5);px(cx-4,cy-6,8,.5,'#e05a24',true);glow(cx,cy-6,6,.6);smokeH(cx+1,cy-9)});
      umbH(gx+.6,gy+.6,'#59cd90',14,'#ffffff')}],[.78,.75,()=>chairH(gx+.78,gy+.75,'#d62828')]]);
   poleSign(gx+.15,gy+.88,5,'#f4efe2',cornIco)},
  (t,gx,gy)=>{ // Sushi Troll: local de madera oscura con farol rojo
   const H=12,g=shopBox(gx,gy,.14,.14,.6,.72,H,'#3a2e28','#2e241f','#1c1c1c');
   face(g,'L',.06,0,.88,6,NIGHT>.2?'#ffe2a8':'#9fc4dc',NIGHT>.2);for(let k=0;k<5;k++)face(g,'L',.08+k*.17,4.3,.15,1.7,'#d62828');face(g,'L',0,6,1,.6,'#7a4e2c');
   face(g,'R',.2,1.5,.6,4,'#9fc4dc');face(g,'L',0,H-2.5,1,2,'#f4efe2');face(g,'L',.1,H-2,.35,1,'#ff8c69');face(g,'L',.1,H-2,.35,.3,'#ffffff');face(g,'L',.55,H-2,.35,1,'#ff8c69');
   {const [x,y]=P(gx+.14,gy+.5);px(x-.25,y-10,.5,2,'#555');circ(x,y-6.5,2.2,'#d62828',NIGHT>.2);px(x-2,y-6.7,4,.4,'#8a1a1a',NIGHT>.2);if(NIGHT>.2)glow(x,y-6.5,8,.8)}
   {const [x,y]=P(gx+.37,gy+.43);shrimpIco(x,y-H-3,1.2,NIGHT>.2);if(NIGHT>.2)glow(x,y-H-4,10,.6)}
   dsort(gx,gy,[[.82,.32,()=>{cb(gx+.76,gy+.24,gx+.9,gy+.4,0,1.5,'#7a4e2c');chairH(gx+.9,gy+.3,'#2b2b2b')}],[.82,.7,()=>{cb(gx+.76,gy+.62,gx+.9,gy+.78,0,1.5,'#7a4e2c');chairH(gx+.9,gy+.68,'#2b2b2b')}],[.4,.9,()=>planter(gx+.4,gy+.88,.3)]])},
  (t,gx,gy)=>{ // Mariscos el Mikas: azul y blanco con camarón gigante
   const H=11,g=shopBox(gx,gy,.1,.14,.56,.72,H,'#ffffff','#e4e8ec','#2f6db5');
   face(g,'L',0,0,1,2,'#2f6db5');face(g,'R',0,0,1,2,'#25589a');face(g,'L',.08,2.5,.84,4.5,'#9fc4dc');for(const u of [.36,.64])face(g,'L',u,2.5,.02,4.5,'#2f6db5');
   for(let k=0;k<8;k++)face(g,'L',k/8,7.5,1/8,1.5,k%2?'#2f6db5':'#ffffff');face(g,'R',.2,3,.6,3.5,'#9fc4dc');
   {const [x,y]=P(gx+.33,gy+.43);shrimpIco(x,y-H-5,2,NIGHT>.2);if(NIGHT>.2)glow(x,y-H-6,14,.8)}
   dsort(gx,gy,tablesSet(gx,gy,'#2f6db5','#ffffff',[[.8,.3],[.8,.66]]).concat([[.92,.9,()=>{const c=cb(gx+.86,gy+.84,gx+.97,gy+.95,0,3,'#2f6db5');face(c,'L',0,1,1,.6,'#ffffff')}]]))},
  (t,gx,gy)=>{ // Señora Katana: negro con acentos rojos, faroles y bambú
   const H=17,g=shopBox(gx,gy,.1,.1,.6,.72,H,'#1f1f22','#18181a','#7a1f1f');
   face(g,'L',.05,0,.9,7,NIGHT>.2?'#ffd9a0':'#5a3a2a',NIGHT>.2);for(let k=1;k<6;k++)face(g,'L',k/6,0,.015,7,'#1c1c1c');face(g,'L',0,7,1,1,'#b52a2a');face(g,'R',0,7,1,1,'#8f2020');
   for(let k=0;k<6;k++)face(g,'L',.06+k*.15,9.5,.08,5,'#2a2a2e');face(g,'R',.15,9.5,.7,5,'#2a2a2e');
   {const [x,y]=P(gx+.35,gy+.41);px(x-8,y-H-11,16,10,'#7a1f1f');px(x-7.5,y-H-10.5,15,9,'#1c1c1c');shrimpIco(x,y-H-3.5,1.5,true);glow(x,y-H-6,15,.9)}
   {const a=P(gx+.62,gy+.12),b=P(gx+.96,gy+.12);px(a[0],a[1]-11,1,11,'#2a2a2e');px(b[0],b[1]-11,1,11,'#2a2a2e');for(let k=0;k<4;k++){const f=(k+.5)/4,x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f-10;circ(x,y+1.5,1.6,'#d62828',NIGHT>.2);if(NIGHT>.2)glow(x,y+1.5,5,.6)}}
   dsort(gx,gy,[[.8,.35,()=>{tableH(gx+.8,gy+.35,'#2a2a2e','#555');chairH(gx+.88,gy+.3,'#7a1f1f')}],[.8,.72,()=>{tableH(gx+.8,gy+.72,'#2a2a2e','#555');chairH(gx+.88,gy+.67,'#7a1f1f')}],
     [.95,.9,()=>{for(const d of [0,.04,.08]){const [x,y]=P(gx+.92+d,gy+.92-d);px(x,y-12,.8,12,'#6f9a3a');px(x-1,y-12,2,1,'#86b04a')}}]])}]
];

