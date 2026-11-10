/* ===== OBRAS GRANDES (v64): estadio, museo, rascacielos, bosque, plaza comercial y metro ===== */
const CROWD=['#d62828','#f4f4f4','#2f6db5','#f2c94c','#f26a21','#2f8f5b','#9b5de5','#1c1c1c'];
function quad(gx,gy,a0,b0,a1,b1,col,lit){poly([P(gx+a0,gy+b0),P(gx+a1,gy+b0),P(gx+a1,gy+b1),P(gx+a0,gy+b1)],col,lit)}
function crowdOn(gx,gy,a0,b0,a1,b1,lift,n,seed){const r=rng(seed);for(let k=0;k<n;k++){const [x,y]=P(gx+a0+r()*(a1-a0),gy+b0+r()*(b1-b0));px(x,y-lift-1.5,1,1.5,CROWD[Math.floor(r()*CROWD.length)])}}
function lightTower(fx,fy,h,on){const [x,y]=P(fx,fy);px(x,y-h,1,h,'#6b7078');for(let v=4;v<h-3;v+=4){px(x-.5,y-v,2,.5,'#8a9099')}
  px(x-4,y-h-4,9,4,'#3a3f47');for(let i=0;i<4;i++)for(let j=0;j<2;j++)px(x-3.5+i*2.2,y-h-3.5+j*1.8,1.5,1.2,on?'#fffbe0':'#cfd3d8',on);if(on)glow(x,y-h-2,22,.9,'#fff6d0')}

/* Estadio de Béisbol · 3×3: diamante, gradas en L, torres de luz y pizarra */
function artBeis(t,gx,gy){const on=NIGHT>.2;
  quad(gx,gy,.03,.03,2.97,2.97,'#3f8f3a');
  for(let k=0;k<10;k++)quad(gx,gy,.65+k*.23,.65,.76+k*.23,2.86,'#4c9c42');
  quad(gx,gy,2.82,.62,2.94,2.94,'#b9875a');quad(gx,gy,.62,2.82,2.94,2.94,'#b9875a');
  quad(gx,gy,.72,.72,1.95,1.95,'#c8955f');quad(gx,gy,.98,.98,1.72,1.72,'#4c9c42');
  {const [x,y]=P(gx+1.35,gy+1.35);ellipse(x,y,3,1.5,'#c8955f');px(x-.5,y-.5,1.5,.5,'#ffffff')}
  for(const [a,b] of [[.84,.84],[1.86,.86],[1.86,1.86],[.86,1.86]]){const [x,y]=P(gx+a,gy+b);px(x-1,y-.5,2,1,'#ffffff')}
  {const h=P(gx+.84,gy+.84),a=P(gx+2.94,gy+.84),b=P(gx+.84,gy+2.94);line(h[0],h[1],a[0],a[1],'#f4f4f4');line(h[0],h[1],b[0],b[1],'#f4f4f4')}
  // barda del jardín con anuncios
  {const E=[[P(gx+2.95,gy+.62),P(gx+2.95,gy+2.95)],[P(gx+.62,gy+2.95),P(gx+2.95,gy+2.95)]];for(const [A,B] of E)for(let q=0;q<8;q++){const f0=q/8,f1=(q+1)/8,pa=[A[0]+(B[0]-A[0])*f0,A[1]+(B[1]-A[1])*f0],pb=[A[0]+(B[0]-A[0])*f1,A[1]+(B[1]-A[1])*f1];
    poly([pa,pb,up(pb,2.6),up(pa,2.6)],q%2?'#1f5a3c':['#f26a21','#2f6db5','#f2c94c','#d62828'][q%4/1|0],on&&q%2===0)}}
  // gradas en L detrás de home, de atrás hacia adelante
  const tiers=[[.05,.18,13],[.18,.32,10],[.32,.46,7],[.46,.6,4]];
  for(const [a,b,h] of tiers){cb(gx+.05,gy+a,gx+2.6,gy+b,0,h,'#9aa0a8','#c9ccd2');cb(gx+a,gy+.05,gx+b,gy+2.6,0,h,'#9aa0a8','#c9ccd2')}
  for(const [a,b,h] of tiers){crowdOn(gx,gy,.2,a+.02,2.5,b-.02,h,46,7+h);crowdOn(gx,gy,a+.02,.2,b-.02,2.5,h,46,19+h)}
  // techo sobre la última fila y palcos
  box(gx+.03,gy+.03,gx+2.62,gy+.2,15,1.2,'#f4f4f4','#d8dbe0','#c4c8ce');box(gx+.03,gy+.03,gx+.2,gy+2.62,15,1.2,'#f4f4f4','#d8dbe0','#c4c8ce');
  {const g=cb(gx+.05,gy+.05,gx+.5,gy+.5,0,15,'#e8e4dc','#f4f2ee');face(g,'L',.06,9,.88,4,'#3d5a75');face(g,'R',.06,9,.88,4,'#3d5a75');win(g,'L',.1,9.5,.8,3,'#9fc4dc');win(g,'R',.1,9.5,.8,3,'#9fc4dc');face(g,'L',0,13.4,1,1.2,'#f26a21',on);face(g,'R',0,13.4,1,1.2,'#f26a21',on);box(gx+.03,gy+.03,gx+.52,gy+.52,15,1,'#f26a21','#d85a14','#c04e10')}
  // pizarra al fondo, sobre el final de la grada
  {const [x,y]=P(gx+1.75,gy+.1);px(x-5,y-22,1,8,'#3a3f47');px(x+9,y-22,1,8,'#3a3f47');px(x-7,y-33,19,11,'#1c1c1c');px(x-6,y-32,17,2,'#f26a21',on);
    for(let i=0;i<11;i++)px(x-5.5+i*1.5,y-28.5,.8,.8,i%3?'#ffd84d':'#59e08a',on);for(let i=0;i<11;i++)px(x-5.5+i*1.5,y-26,.8,.8,i%4?'#ffd84d':'#ff5d5d',on);if(on)glow(x+3,y-27,12,.6,'#ffd27a')}
  lightTower(gx+.08,gy+2.85,44,on);lightTower(gx+2.85,gy+.08,44,on);
  // jugadores
  dsort(gx,gy,[[1.35,1.35,()=>{const [x,y]=P(gx+1.35,gy+1.35);person(x,y-1,{shirt:'#f4f4f4',pants:'#f4f4f4',skin:'#c68642',hair:'#1c1c1c',front:true,scale:.8})}],
    [.9,.9,()=>{const [x,y]=P(gx+.9,gy+.9);person(x,y,{shirt:'#2f6db5',pants:'#f4f4f4',skin:'#e0ac69',hair:'#1c1c1c',front:false,scale:.8})}],
    [1.86,.92,()=>{const [x,y]=P(gx+1.86,gy+.92);person(x,y,{shirt:'#f4f4f4',pants:'#f4f4f4',skin:'#8d5524',hair:'#1c1c1c',front:true,scale:.8})}],
    [2.3,2.2,()=>{const [x,y]=P(gx+2.3,gy+2.2);person(x,y,{shirt:'#f4f4f4',pants:'#f4f4f4',skin:'#c68642',hair:'#1c1c1c',front:true,scale:.8})}]]);
}

/* Museo del Cañón · 2×2: volúmenes de concreto blanco, atrio de vidrio y el arco naranja sobre la explanada */
function artMuseo(t,gx,gy){const on=NIGHT>.2;
  quad(gx,gy,.03,.03,1.97,1.97,'#e8e2d6');for(let k=1;k<8;k++){const a=P(gx+k*.25,gy+.04),b=P(gx+k*.25,gy+1.96);line(a[0],a[1],b[0],b[1],'#d8d0c2')}
  quad(gx,gy,1.25,1.25,1.85,1.85,'#7fc4e0');quad(gx,gy,1.32,1.32,1.78,1.78,'#9fd8ee');
  const g=cb(gx+.12,gy+.12,gx+1.15,gy+.95,0,20,'#f4f2ee','#ffffff');
  face(g,'L',0,0,1,1,'#d8d4cc');face(g,'R',0,0,1,1,'#ccc8c0');for(const u of [.15,.45,.75]){face(g,'L',u,4,.1,13,'#e6e2da');face(g,'R',u,4,.1,13,'#dedad2')}
  face(g,'L',.08,14,.84,2,'#f26a21',on);face(g,'L',.2,14.5,.6,.9,'#ffd2b0',on);
  for(const [u,c] of [[.12,'#d62828'],[.42,'#2f6db5'],[.72,'#f2c94c']])face(g,'R',u,6,.12,8,c);
  box(gx+.1,gy+.1,gx+1.17,gy+.97,20,1,'#e8e4dc','#d8d4cc','#c8c4bc');
  const g2=cb(gx+.12,gy+.95,gx+.95,gy+1.85,0,11,'#bcd6e6','#e8e4dc');win(g2,'L',.05,1,.9,9,'#bcd6e6');win(g2,'R',.05,1,.9,9,'#aecbdc');for(const u of [.25,.5,.75]){face(g2,'L',u,1,.012,9,'#8a9aa8');face(g2,'R',u,1,.012,9,'#8a9aa8')}
  box(gx+.1,gy+.93,gx+.97,gy+1.87,11,.8,'#f4f2ee','#e2ded6','#d2cec6');
  const g3=cb(gx+1.15,gy+.12,gx+1.85,gy+.95,0,8,'#bcd6e6','#e8e4dc');win(g3,'L',.05,1,.9,6,'#cfe4ee');win(g3,'R',.05,1,.9,6,'#c4dce6');box(gx+1.13,gy+.1,gx+1.87,gy+.97,8,.8,'#f4f2ee','#e2ded6','#d2cec6');
  // el arco naranja, de esquina a esquina sobre la explanada
  {const c=P(gx+1.55,gy+1.55);arcTop(c[0],c[1],22,3.2,'#f26a21',on);arcTop(c[0],c[1],22,1,'#ff9a5c',on);if(on)glow(c[0],c[1]-18,16,.6,'#f26a21')}
  dsort(gx,gy,[[1.1,1.9,()=>{const [x,y]=P(gx+1.1,gy+1.9);cb(gx+1.05,gy+1.85,gx+1.15,gy+1.95,0,3,'#2b2b2b');circ(x,y-6,2.2,'#c9a227')}],
    [1.9,1.1,()=>{cb(gx+1.85,gy+1.02,gx+1.95,gy+1.18,0,5,'#d62828')}],[1.95,1.95,()=>lamp(gx+1.95,gy+1.95)],[.05,1.95,()=>planter(gx+.05,gy+1.95,.4)],
    [1.6,1.95,()=>{const [x,y]=P(gx+1.6,gy+1.95);person(x,y,{shirt:'#f26a21',pants:'#2b2b2b',skin:'#e0ac69',hair:'#3a2a1e',front:true,scale:.85})}],
    [1.95,1.55,()=>{const [x,y]=P(gx+1.95,gy+1.55);person(x,y,{shirt:'#2f6db5',pants:'#c9b38a',skin:'#8d5524',hair:'#1c1c1c',front:true,scale:.85})}]]);
}

/* Rascacielos de oficinas · 2×2: basamento, torre de vidrio con remates y antena */
function artRasca(t,gx,gy){if(RASCA2)return artRasca2(t,gx,gy);const on=NIGHT>.2;
  quad(gx,gy,.03,.03,1.97,1.97,'#d9d4ca');
  const b=cb(gx+.12,gy+.12,gx+1.88,gy+1.88,0,9,'#d8d4cc','#4a4f56');win(b,'L',.04,.6,.92,6.6,'#ffe2a8');win(b,'R',.04,.6,.92,6.6,'#f2d090');for(let k=1;k<8;k++){face(b,'L',k/8,.6,.01,6.6,'#3a3f47');face(b,'R',k/8,.6,.01,6.6,'#3a3f47')}
  box(gx+.1,gy+.1,gx+1.9,gy+1.9,9,1,'#8a9099','#c9c5bd','#b9b5ad');
  const H=96,g=cb(gx+.4,gy+.4,gx+1.6,gy+1.6,10,H,'#2c4a6e','#3a5a80');
  for(let v=2;v<H-2;v+=3.2){win(g,'L',.04,v,.92,2.2,'#5f86b0');win(g,'R',.04,v,.92,2.2,'#4f769f')}
  for(let k=1;k<6;k++){face(g,'L',k/6,0,.012,H,'#1c2c40');face(g,'R',k/6,0,.012,H,'#1c2c40')}
  if(!on){face(g,'L',.55,30,.12,40,'rgba(255,255,255,.12)',true);face(g,'L',.7,20,.06,50,'rgba(255,255,255,.1)',true)}
  box(gx+.38,gy+.38,gx+1.62,gy+1.62,10+H,1.2,'#1c2c40','#2c4a6e','#24405e');
  const g2=cb(gx+.6,gy+.6,gx+1.4,gy+1.4,11.2+H,14,'#2c4a6e','#3a5a80');for(let v=2;v<12;v+=3.2){win(g2,'L',.06,v,.88,2.2,'#5f86b0');win(g2,'R',.06,v,.88,2.2,'#4f769f')}
  box(gx+.58,gy+.58,gx+1.42,gy+1.42,25.2+H,1.5,'#c9a227','#a8861d','#8a6d14');
  {const [x,y]=P(gx+1,gy+1),top=y-H-27;px(x,top-22,1,22,'#9aa0a6');px(x-1.5,top-6,4,1,'#9aa0a6');circ(x+.5,top-23,1.2,'#ff3b30',true);if(on)glow(x+.5,top-23,8,1,'#ff3b30');
    face(g,'L',.3,H-7,.4,3.4,'#c9a227',on);face(g,'L',.34,H-6.2,.32,1.8,'#1c2c40')}
  dsort(gx,gy,[[1.95,.6,()=>planter(gx+1.95,gy+.6,.38)],[.6,1.95,()=>planter(gx+.6,gy+1.95,.38)],[1.95,1.95,()=>lamp(gx+1.95,gy+1.95)],
    [1.3,1.97,()=>{const [x,y]=P(gx+1.3,gy+1.97);person(x,y,{shirt:'#2b2b2b',pants:'#2b2b2b',skin:'#e0ac69',hair:'#3a2a1e',front:true,scale:.85})}]]);
}

/* Bosque urbano · 3×3: arboleda densa, sendero, estanque con muelle y kiosco de madera */
function artBosque(t,gx,gy){const on=NIGHT>.2,r=rng(311);
  quad(gx,gy,.03,.03,2.97,2.97,'#4f8f3a');speck(gx,gy,9,30,['#5a9c44','#467f34'],.05);speck(gx+1,gy+1,5,30,['#5a9c44','#467f34'],.05);speck(gx+2,gy+2,7,30,['#5a9c44','#467f34'],.05);
  {const c=P(gx+2.1,gy+.95);ellipse(c[0],c[1],22,10,'#3f7fa8');ellipse(c[0]-2,c[1]-1,17,7,'#5aa0c8');ellipse(c[0]+3,c[1]-2,5,1.5,'#9fd0ec');
    for(let k=0;k<6;k++){const a=k/6*Math.PI*2;px(c[0]+Math.cos(a)*20,c[1]+Math.sin(a)*9,1.5,1,'#6fae4f')}}
  // sendero en curva
  const path=[[.0,2.4],[.6,2.2],[1.1,1.8],[1.5,1.6],[1.8,1.9],[2.3,2.3],[3.0,2.5]];
  for(let k=0;k<path.length-1;k++){const [a0,b0]=path[k],[a1,b1]=path[k+1];for(let s=0;s<6;s++){const f=s/6,a=a0+(a1-a0)*f,b=b0+(b1-b0)*f;const [x,y]=P(gx+a,gy+b);ellipse(x,y,5,2.5,'#c9ad7a')}}
  {const [x,y]=P(gx+1.55,gy+1.0);cb(gx+1.5,gy+.92,gx+1.75,gy+1.0,0,1.2,'#a0703f')}
  const items=[];const avoid=(a,b)=>{if(Math.hypot(a-2.1,(b-.95)*1.6)<.75)return true;for(const [pa,pb] of path)if(Math.hypot(a-pa,b-pb)<.3)return true;return a>1.25&&a<1.85&&b>1.25&&b<1.85};
  for(let k=0;k<70;k++){const a=.15+r()*2.7,b=.15+r()*2.7;if(avoid(a,b))continue;const kind=r();items.push([a,b,kind<.12?()=>palm(gx+a,gy+b,12+r()*5):kind<.22?()=>willow(gx+a,gy+b):()=>tree(gx+a,gy+b,.55+r()*.4)])}
  items.push([1.55,1.55,()=>{const g=cb(gx+1.38,gy+1.38,gx+1.72,gy+1.72,0,6,'#a0703f','#7a4e2c');for(const [a,b] of [[1.4,1.4],[1.7,1.4],[1.4,1.7],[1.7,1.7]]){const [x,y]=P(gx+a,gy+b);px(x,y-9,.8,9,'#6e4a2c')}pyramid(gx+1.32,gy+1.32,gx+1.78,gy+1.78,9,6,'#7a4e2c','#5a3720')}]);
  for(const [a,b] of [[.7,2.15],[2.0,2.15],[1.2,1.65]])items.push([a,b,()=>bench(gx+a,gy+b,'#7a5a3c')]);
  for(const [a,b] of [[.35,2.3],[1.0,1.9],[2.1,2.2],[2.8,2.45]])items.push([a,b,()=>lamp(gx+a,gy+b,10)]);
  items.push([2.0,2.35,()=>{const [x,y]=P(gx+2.0,gy+2.35);person(x,y,{shirt:'#e63946',pants:'#2b2b2b',skin:'#e0ac69',hair:'#3a2a1e',front:true,scale:.8})}]);
  items.push([.9,2.05,()=>{const [x,y]=P(gx+.9,gy+2.05);person(x,y,{shirt:'#2a9d8f',pants:'#3b5a8a',skin:'#8d5524',hair:'#1c1c1c',front:false,scale:.8});dogH(gx+.98,gy+2.1,'#c9a35a')}]);
  {const [x,y]=P(gx+.1,gy+2.5);px(x,y-8,.6,8,'#6e4a2c');board(x-6,y-14,12,6,'#2f5a2c',[[1.5,1.5,9,'#f4efe2'],[1.5,3,6,'#f2c94c']])}
  dsort(gx,gy,items);
}

/* Plaza comercial · 3×3: edificio en L con tiendas, atrio de vidrio, estacionamiento y tótem */
function artPlazaCom(t,gx,gy){const on=NIGHT>.2;
  quad(gx,gy,.03,.03,2.97,2.97,'#5d626c');
  for(let k=0;k<6;k++){const a=P(gx+1.5+k*.24,gy+1.55),b=P(gx+1.5+k*.24,gy+2.1);line(a[0],a[1],b[0],b[1],'#e8e8e8');const c=P(gx+1.5+k*.24,gy+2.3),d=P(gx+1.5+k*.24,gy+2.85);line(c[0],c[1],d[0],d[1],'#e8e8e8')}
  quad(gx,gy,1.3,1.3,2.97,1.45,'#cfc8bc');quad(gx,gy,1.3,1.3,1.45,2.97,'#cfc8bc');
  const shops=['#d62828','#2f6db5','#f2c94c','#2a9d8f','#9b5de5','#f26a21','#e63946','#59b04f'];
  const A=cb(gx+.1,gy+.1,gx+2.9,gy+1.25,0,14,'#ece6da','#d8d2c6');
  face(A,'L',0,0,1,6.5,'#2b2b2b');for(let k=0;k<7;k++){win(A,'L',.02+k*.14,.5,.12,5.4,'#ffe2a8');face(A,'L',.02+k*.14,6.8,.12,2.4,shops[k%8],on);face(A,'L',.04+k*.14,7.4,.08,.8,'#ffffff',on)}
  face(A,'R',0,0,1,6.5,'#2b2b2b');for(let k=0;k<3;k++){win(A,'R',.05+k*.31,.5,.25,5.4,'#f2d090');face(A,'R',.05+k*.31,6.8,.25,2.4,shops[(k+3)%8],on)}
  box(gx+.08,gy+.08,gx+2.92,gy+1.27,14,1,'#c9c3b7','#b9b3a7','#a9a397');
  lifted(15,()=>{for(let k=0;k<5;k++)quad(gx,gy,.3+k*.5,.45,.55+k*.5,.75,'#bcd6e6');for(const a of [.4,1.4,2.4])cb(gx+a,gy+.18,gx+a+.18,gy+.32,0,2.5,'#9aa0a8')});
  const B=cb(gx+.1,gy+1.25,gx+1.25,gy+2.9,0,14,'#ece6da','#d8d2c6');
  face(B,'R',0,0,1,6.5,'#2b2b2b');for(let k=0;k<7;k++){win(B,'R',.02+k*.14,.5,.12,5.4,'#f2d090');face(B,'R',.02+k*.14,6.8,.12,2.4,shops[(k+5)%8],on)}
  face(B,'L',0,0,1,6.5,'#2b2b2b');win(B,'L',.1,.5,.8,5.4,'#ffe2a8');
  box(gx+.08,gy+1.23,gx+1.27,gy+2.92,14,1,'#c9c3b7','#b9b3a7','#a9a397');
  lifted(15,()=>{for(let k=0;k<3;k++)quad(gx,gy,.45,1.6+k*.45,.75,1.85+k*.45,'#bcd6e6');cb(gx+.18,gy+2.4,gx+.32,gy+2.58,0,2.5,'#9aa0a8')});
  // atrio de vidrio en la esquina
  const C=cb(gx+.85,gy+.85,gx+1.5,gy+1.5,0,20,'#bcd6e6','#e8e4dc');win(C,'L',.04,.5,.92,18,'#cfe4ee');win(C,'R',.04,.5,.92,18,'#c4dce6');for(const u of [.33,.66]){face(C,'L',u,.5,.012,18,'#8a9aa8');face(C,'R',u,.5,.012,18,'#8a9aa8')}
  for(let v=5;v<20;v+=5){face(C,'L',0,v,1,.4,'#8a9aa8');face(C,'R',0,v,1,.4,'#8a9aa8')}
  {const c=P(gx+1.5,gy+1.5);arcTop(c[0],c[1]-20.5,8,2,'#f26a21',on)}
  box(gx+.83,gy+.83,gx+1.52,gy+1.52,20,1,'#e8e4dc','#d8d4cc','#c8c4bc');
  {const c=P(gx+1.18,gy+1.52);px(c[0]-8,c[1]-17,16,3,'#1f2540');px(c[0]-6,c[1]-16,12,1,'#f2c94c',on);if(on)glow(c[0],c[1]-15,14,.7,'#ffd27a')}
  const cars=[];const cc=['#d64545','#f4f4f4','#3a6ea5','#2b2b2b','#9aa0a8','#e0b03b'];let q=0;
  for(const b of [1.72,2.55])for(let k=0;k<6;k++){if((k+b*3|0)%3===1)continue;const a=1.62+k*.24;cars.push([a,b,()=>car(gx+a,gy+b,cc[(q++)%cc.length],false)])}
  cars.push([2.88,1.62,()=>{const [x,y]=P(gx+2.88,gy+1.62);px(x-.5,y-26,2,26,'#3a3f47');px(x-5,y-40,11,15,'#1f2540');px(x-4,y-39,9,3,'#f26a21',on);for(let i=0;i<3;i++)px(x-4,y-35+i*3,9,2,shops[i+1],on);if(on)glow(x,y-33,14,.7,'#ffd27a')}]);
  for(const [a,b] of [[1.38,2.0],[2.0,1.38],[2.9,1.6]])cars.push([a,b,()=>lamp(gx+a,gy+b,12)]);
  cars.push([1.4,1.55,()=>{const [x,y]=P(gx+1.4,gy+1.6);person(x,y,{shirt:'#ff6fae',pants:'#3b5a8a',skin:'#e0ac69',hair:'#3a2a1e',front:true,scale:.85})}]);
  dsort(gx,gy,cars);
}

/* Estación del Metro · 2×2: viaducto elevado, andén techado, tren y estación a nivel de calle */
function artMetro(t,gx,gy){const on=NIGHT>.2;
  quad(gx,gy,.03,.03,1.97,1.97,'#d9d4ca');quad(gx,gy,.05,.68,1.95,1.32,'#bdb7ab');
  const D=18;
  for(const a of [.25,1.0,1.75])cb(gx+a-.07,gy+.92,gx+a+.07,gy+1.08,0,D,'#b8b3a8','#cfc9bd');
  // estación a nivel de calle
  const S2=cb(gx+.15,gy+1.38,gx+1.45,gy+1.9,0,9,'#e8e4dc','#cfc9bd');win(S2,'L',.06,.6,.6,6,'#cfe4ee');face(S2,'L',.7,0,.24,6.8,'#2b2b2b');face(S2,'L',.72,.4,.2,6,'#9fc4dc');win(S2,'R',.1,.6,.8,6,'#c4dce6');
  face(S2,'L',0,7.2,1,1.4,'#f26a21',on);box(gx+.13,gy+1.36,gx+1.47,gy+1.92,9,.8,'#cfc9bd','#bfb9ad','#afa99d');
  {const [x,y]=P(gx+.08,gy+1.96);px(x,y-16,1,16,'#3a3f47');circ(x+.5,y-19,4,'#f26a21',on);px(x-1.5,y-21,1,4,'#ffffff',on);px(x+2,y-21,1,4,'#ffffff',on);px(x-.5,y-20.5,1,1,'#ffffff',on);px(x+.5,y-20,1,1,'#ffffff',on);px(x+1,y-20.5,1,1,'#ffffff',on);if(on)glow(x+.5,y-19,10,.8,'#f26a21')}
  // escalera al andén
  {const s0=1.55,s1=1.85;poly([P(gx+s0,gy+1.95),P(gx+s1,gy+1.95),up(P(gx+s1,gy+1.32),D),up(P(gx+s0,gy+1.32),D)],'#9aa0a6');for(let k=1;k<10;k++){const f=k/10,a=P(gx+s0,gy+1.95-f*.63),b=P(gx+s1,gy+1.95-f*.63);line(a[0],a[1]-D*f,b[0],b[1]-D*f,'#7a8088')}}
  // viaducto con andén
  box(gx+.02,gy+.7,gx+1.98,gy+1.3,D,2.2,'#cfc9bd','#a8a296','#989286');
  quad(gx,gy,.02,1.12,1.98,1.3,'#e8e4dc');
  // tren
  const tr=cb(gx+.08,gy+.78,gx+1.9,gy+1.1,D+2.2,7,'#f4f4f4','#ffffff');for(const s of ['L','R']){face(tr,s,0,1,1,1.2,'#f26a21');face(tr,s,0,5.6,1,.6,'#2f8f5b')}
  for(let k=0;k<8;k++)win(tr,'L',.03+k*.12,2.6,.08,2.4,'#7fa8c8');win(tr,'R',.2,2.6,.6,2.4,'#7fa8c8');
  // techo del andén
  for(const a of [.3,1.0,1.7]){const [x,y]=P(gx+a,gy+1.25);px(x,y-D-14,.8,12,'#6b7078')}
  box(gx+.05,gy+.72,gx+1.95,gy+1.32,D+14,1,'#2f8f5b','#24704a','#1c5a3c');
  {const a=P(gx+.05,gy+1.32),b=P(gx+1.95,gy+1.32);for(let k=0;k<6;k++){const f=(k+.5)/6;px(a[0]+(b[0]-a[0])*f-1,a[1]+(b[1]-a[1])*f-D-13,2,1,on?'#fff6d0':'#cfd3d8',on)}if(on)glow((a[0]+b[0])/2,(a[1]+b[1])/2-D-10,22,.6)}
  dsort(gx,gy,[[1.9,1.95,()=>lamp(gx+1.9,gy+1.95,11)],[.1,1.95,()=>planter(gx+.1,gy+1.95,.36)],[.4,.4,()=>tree(gx+.4,gy+.35,.6)],[1.5,.35,()=>tree(gx+1.5,gy+.35,.55)],
    [1.2,1.98,()=>{const [x,y]=P(gx+1.2,gy+1.98);person(x,y,{shirt:'#2f6db5',pants:'#2b2b2b',skin:'#c68642',hair:'#1c1c1c',front:true,scale:.85})}]]);
}


/* Rascacielos de oficinas, versión pulida (v79, en espera de aprobación): tres cuerpos escalonados con terrazas ajardinadas,
   aletas blancas en las esquinas, una franja del color del distrito de arriba abajo que se enciende de noche, vestíbulo de
   doble altura con marquesina y remate en aguja. */
let RASCA2=false;
function artRasca2(t,gx,gy){const on=NIGHT>.2,ac=distCol(),W='#eef1f4',WS='#cfd6de';
  quad(gx,gy,.03,.03,1.97,1.97,'#d9d4ca');quad(gx,gy,.08,.08,1.92,1.92,'#cfc8bb');
  // podio con vestíbulo de doble altura, siempre encendido
  const b=cb(gx+.12,gy+.12,gx+1.88,gy+1.88,0,10,'#dcd8d0','#4a4f56');
  for(const sd of ['L','R']){face(b,sd,.04,.8,.92,7.4,on?(sd==='L'?'#ffe2a8':'#f2d090'):(sd==='L'?'#bfe0f0':'#a6cfe6'),on);for(let k=1;k<10;k++)face(b,sd,k/10,.8,.012,7.4,'#3a3f47');face(b,sd,.04,4.4,.92,.5,'#3a3f47');
    face(b,sd,0,8.4,1,1.6,ac,on);face(b,sd,0,8.4,1,.4,hexShade(ac,-.25),on)}
  face(b,'L',.4,.8,.2,5.6,on?'#fff3c8':'#e8f4fb',on);face(b,'L',.495,.8,.01,5.6,'#3a3f47');
  box(gx+.1,gy+.1,gx+1.9,gy+1.9,10,1.2,'#9aa0a8',W,WS);
  const lifted=(lift,fn)=>{const o=cam.oy;cam.oy-=lift;try{fn()}finally{cam.oy=o}};
  const tier=(ins,lift,h,logo)=>{const g=cb(gx+ins,gy+ins,gx+2-ins,gy+2-ins,lift,h,'#2f5d8a','#3f6f9e');
    for(let v=1.4;v<h-1.6;v+=3){win(g,'L',.07,v,.86,2,'#86b6dc');win(g,'R',.07,v,.86,2,'#5f93bf');face(g,'L',.07,v+2,.86,1,'#24486e');face(g,'R',.07,v+2,.86,1,'#1c3a5a')}
    for(const u of [.26,.74]){face(g,'L',u,0,.012,h,'#1c3a5a');face(g,'R',u,0,.012,h,'#162f4a')}
    for(const sd of ['L','R']){face(g,sd,0,0,.06,h,sd==='L'?W:WS);face(g,sd,.94,0,.06,h,sd==='L'?W:WS);face(g,sd,.46,0,.08,h,ac,on);face(g,sd,.46,0,.015,h,hexShade(ac,-.3),on)}
    if(!on){face(g,'L',.14,h*.25,.07,h*.55,'rgba(255,255,255,.16)',true);face(g,'L',.24,h*.15,.03,h*.6,'rgba(255,255,255,.1)',true)}
    if(logo){face(g,'L',.12,h-6.4,.3,3.6,W,on);for(let q=0;q<3;q++)face(g,'L',.15+q*.085,h-5.6,.05,2,'#1c3a5a',on)}
    box(gx+ins-.02,gy+ins-.02,gx+2-ins+.02,gy+2-ins+.02,lift+h,1.2,'#8a9099',W,WS);return lift+h+1.2};
  // terrazas ajardinadas en cada escalón: arbolitos en las tres esquinas que se ven
  const garden=(ins,lift)=>{const c=[[ins+.07,ins+.07],[2-ins-.07,ins+.07],[2-ins-.07,2-ins-.07],[ins+.07,2-ins-.07]].map(q=>({q,y:P(gx+q[0],gy+q[1])[1]})).sort((a,b_)=>a.y-b_.y).slice(1);
    lifted(lift,()=>{for(const {q} of c){const [x,y]=P(gx+q[0],gy+q[1]);px(x-2,y-2,4,2,'#3a3a3a');tree(gx+q[0],gy+q[1],.34)}})};
  let top=tier(.34,11.2,44);const l1=top;top=tier(.46,top,34);garden(.34,l1);const l2=top;top=tier(.58,top,22,true);garden(.46,l2);
  // remate: banda de luz y aguja
  box(gx+.6,gy+.6,gx+1.4,gy+1.4,top,2,'#9aa0a8',on?'#fff6d8':W,on?'#f0e2b0':WS);pyramid(gx+.68,gy+.68,gx+1.32,gy+1.32,top+2,13,'#dfe6ee','#b4c0cc');
  {const [x,y]=P(gx+1,gy+1),ty=y-top-15;px(x,ty-15,1,15,'#9aa0a6');px(x-1.5,ty-5,4,1,'#9aa0a6');circ(x+.5,ty-16,1.2,'#ff3b30',true);
    if(on){glow(x+.5,ty-16,8,1,'#ff3b30');glow(x,y-top-2,26,.7,'#fff0c0');glow(x,y-60,30,.35,ac)}}
  dsort(gx,gy,[[1.95,.6,()=>planter(gx+1.95,gy+.6,.38)],[.6,1.95,()=>planter(gx+.6,gy+1.95,.38)],[1.95,1.95,()=>lamp(gx+1.95,gy+1.95)],[1.95,1.3,()=>planter(gx+1.95,gy+1.3,.34)],
    [1.3,1.97,()=>{const [x,y]=P(gx+1.3,gy+1.97);person(x,y,{shirt:'#2b2b2b',pants:'#2b2b2b',skin:'#e0ac69',hair:'#3a2a1e',front:true,scale:.85})}],
    [1.05,1.97,()=>{const [x,y]=P(gx+1.05,gy+1.97);person(x,y,{shirt:'#f4f4f4',pants:'#3a4a6a',skin:'#c68642',hair:'#1c1c1c',front:true,scale:.85})}]]);
}
