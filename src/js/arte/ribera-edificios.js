/* ===== Distrito Ribera: vivienda y negocios con cara propia (v70) =====
   Mismo juego (costos, pisos, niveles), otro barrio: casas apiladas de colores con tinacos y bugambilias, bodegas de ladrillo
   convertidas con techo de dientes de sierra, la Torre Malecón con balcones como olas; y negocios de río: triciclo de pan,
   mariscos y palapa, asadero, depósito y salón cumbiero, aguas frescas, mercadito, coworking en bodega. */
let RIBV=DIST==='ribera';
const RIBC=['#e85d75','#2bb3a3','#f2b632','#7fb7e6','#f08a4b','#9b6bd3','#8cc96b','#f4efe2'];
const hR=(s,q)=>Math.abs(Math.sin(s*3.17+q*12.71)*9137.13)%1;
// bugambilia que cae por una cara
function bugam(g,side,u,v0,n){const C=['#c2185b','#e04f9a','#a0164d','#e04f9a'];for(let k=0;k<n;k++){const j=hR(SEED,k*3+u*9);face(g,side,u+(j-.5)*.06,v0-k*.9,.07+j*.05,1,k%5===4?'#3f8f4a':C[k%4])}}
function rejas(g,side,u,v,w,h,col){for(let q=1;q<4;q++)face(g,side,u+q*w/4-.006,v,.012,h,col);face(g,side,u,v+h*.5,w,.25,col)}
// polígonos en el piso (x,y) con altura, ordenados por profundidad: techos de dientes de sierra, palapas
function paint3(items){items.map(it=>{let a=0;for(const [x,y] of it.p){const r=rot(x,y);a+=r[0]+r[1]}return [a/it.p.length+(it.z||0),it]}).sort((p,q)=>p[0]-q[0]).forEach(([,it])=>poly(it.p.map(([x,y,h])=>{const q=P(x,y);return [q[0],q[1]-h]}),it.c,it.lit))}
function sawtooth(x0,y0,x1,y1,lift,n,roof,glass,wall){const it=[],w=(x1-x0)/n,th=4.2;
  for(let k=0;k<n;k++){const a=x0+k*w,b=a+w;
    it.push({p:[[a,y0,lift],[b,y0,lift],[b,y0,lift+th]],c:wall,z:-.01},{p:[[a,y1,lift],[b,y1,lift],[b,y1,lift+th]],c:hexShade(wall,-.12),z:.01},
      {p:[[b,y0,lift],[b,y1,lift],[b,y1,lift+th],[b,y0,lift+th]],c:NIGHT>.25?'#ffd98a':glass,lit:NIGHT>.25},{p:[[a,y0,lift],[a,y1,lift],[b,y1,lift+th],[b,y0,lift+th]],c:roof,z:.005})}
  paint3(it)}
function palapa(x0,y0,x1,y1,lift,h){pyramid(x0,y0,x1,y1,lift,h,'#c9a25a','#a8833f');
  const o=orient([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)]);for(const [A,B] of [[o.L,o.B],[o.B,o.R]])for(let k=0;k<=10;k++){const f=k/10;px(A[0]+(B[0]-A[0])*f-.3,A[1]+(B[1]-A[1])*f-lift-.2,.6,1.4+(k%2)*.6,'#8a6a2c')}}
function vitro(x,y,c){px(x-1.3,y-4.2,2.6,4,'rgba(220,240,250,.85)',true);px(x-1.1,y-3.4,2.2,3.1,c);px(x-1.1,y-3.4,.6,3.1,hexShade(c,.3));px(x-1.4,y-4.6,2.8,.6,'#c9ced6');px(x-.3,y-5,.6,.4,'#9aa1ab')}
function fruitRow(x,y,n){const F=['#e63946','#f2b632','#59b04f','#f08a4b','#9b5de5'];for(let k=0;k<n;k++){px(x+k*1.6,y,1.4,1.2,F[(k+Math.floor(x))%5]);px(x+k*1.6+.3,y-.4,.7,.5,hexShade(F[(k+Math.floor(x))%5],.3))}}
function toldo(g,side,u0,u1,v,d,c1,c2,n=6){const A=side==='L'?g.L:g.B,B=side==='L'?g.B:g.R,o=side==='L'?[-16*d,8*d]:[16*d,8*d],p=(u,h,q)=>[A[0]+(B[0]-A[0])*u+(q?o[0]:0),A[1]+(B[1]-A[1])*u-g.lift-h+(q?o[1]:0)];
  for(let k=0;k<n;k++){const a=u0+(u1-u0)*k/n,b=u0+(u1-u0)*(k+1)/n,c=k%2?c2:c1;poly([p(a,v+2.4),p(b,v+2.4),p(b,v,1),p(a,v,1)],c);poly([p(a,v,1),p(b,v,1),[p(b,v,1)[0],p(b,v,1)[1]+.9],[p(a,v,1)[0],p(a,v,1)[1]+.9]],hexShade(c,-.2))}}
function azotea(x0,y0,x1,y1,H,tin){box(x0-.02,y0-.02,x1+.02,y1+.02,H,.8,'#c9c0ae','#f4f2ec','#d8d4ca');if(tin)tinaco(x0+(x1-x0)*.7,y0+(y1-y0)*.3,H+.8,'#1f1f1f')}
function letrero(x,y,w,bg,fg){px(x,y,w,3.2,bg);px(x,y+2.7,w,.5,hexShade(bg,-.25));for(let k=0;k<Math.floor(w/1.6)-1;k++)px(x+.8+k*1.6,y+1,1,1.2,fg)}

/* ---------- vivienda ---------- */
function ribHousing(t,gx,gy,L,ic){const s=t.s,k=t.k,LVL=ic?1:L;if(k==='torre')return ribTorre(t,gx,gy,ic?6:t.f,LVL);
  const f=ic?(k==='ladrillo'?4:3):t.f;return k==='ladrillo'?ribBodega(t,gx,gy,f,LVL,s):ribCasas(t,gx,gy,f,LVL,s)}
// Casas de la Ribera: cada piso de un color, rejas, tinacos, tendedero y varillas en la azotea; luego terrazas y cantera
function ribCasas(t,gx,gy,f,LVL,s){const FH=7,ins=.15,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1;
  const SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';const c0=s%RIBC.length;
  const colF=fl=>LVL===4?(fl===0?'#d9c4a0':'#f4efe2'):LVL===1&&fl===f-1?'#a9a49a':RIBC[(c0+fl*(LVL===2?3:5))%7];
  const top=LVL===3?Math.max(2,f-1):f,Ht=top*FH+1,g=box(x0,y0,x1,y1,0,Ht,'#bdb7ab',colF(1),hexShade(colF(1),-.17));
  for(let fl=0;fl<top;fl++){const c=colF(fl);face(g,'L',0,fl*FH,1,FH,c);face(g,'R',0,fl*FH,1,FH,hexShade(c,-.17));if(LVL<4){face(g,'L',0,fl*FH,1,.5,hexShade(c,-.25));face(g,'R',0,fl*FH,1,.5,hexShade(c,-.35))}}
  if(LVL===1&&f>1){const v=(f-1)*FH;for(let q=0;q<6;q++){face(g,'L',q/6,v+(q%2)*2.2,1/6,.25,'#8f8a80');face(g,'R',q/6,v+(q%2)*2.2,1/6,.25,'#7f7a70')}}
  // planta baja: tiendita con cortina, puerta de herrería; en cantera, arcos
  if(LVL===4){for(const sd of ['L','R'])for(const u of [.08,.56]){face(g,sd,u,0,.36,FH-1.6,'#3f3a34');face(g,sd,u+.02,FH-1.8,.32,.4,'#c9b38c')}win(g,'L',.1,.6,.32,FH-2.8,'#6fa3c7')}
  else{face(g,'L',.06,0,.56,FH-1.5,'#9aa0a8');for(let v=.6;v<FH-1.7;v+=.8)face(g,'L',.06,v,.56,.25,'#7f858d');letrero(...(()=>{const A=g.L,B=g.B;return [A[0]+(B[0]-A[0])*.1,A[1]+(B[1]-A[1])*.1-FH+.5]})(),7,'#f4efe2',RIBC[(c0+2)%7]);
    face(g,'L',.7,0,.22,FH-2,'#2b2b2b');rejas(g,'L',.7,0,.22,FH-2,'#555');face(g,'R',.55,0,.3,FH-1.5,'#5a3a24');win(g,'R',.1,1.2,.3,FH-3.5,'#5d92b8');rejas(g,'R',.1,1.2,.3,FH-3.5,'#3a3a3a')}
  // pisos de arriba
  for(let fl=1;fl<top;fl++){const v=fl*FH+1.6,wh=FH-3.4,fr=LVL===4?'#2f6f5e':'#f4efe2';
    for(const [sd,us] of [['L',[.12,.6]],['R',[.18,.6]]])for(const u of us){winF(g,sd,u,v,.24,wh,fr,'#2f5079',fr);if(LVL<=2)rejas(g,sd,u,v,.24,wh,LVL===1?'#3a3a3a':'#1f1f1f');
      if(LVL===4){face(g,sd,u-.07,v-.4,.06,wh+.8,'#2f6f5e');face(g,sd,u+.25,v-.4,.06,wh+.8,'#2f6f5e')}
      if(LVL>=2&&hR(s,fl*7+u*10)<.45){face(g,sd,u-.01,v-1.1,.26,.6,'#a0522d');for(let q=0;q<3;q++)face(g,sd,u+.02+q*.08,v-.5,.05,.7,q%2?'#e04f9a':'#3f8f4a')}}
    if(LVL===1&&hR(s,fl)<.35)minisplit(g,'R',.42,v-2)}
  if(LVL>=2)bugam(g,'L',.94,Ht-1,LVL===4?10:7);if(LVL===4)bugam(g,'R',.04,Ht-1,8);
  // remate y azotea
  const R=Ht+(LVL===1?0:1);if(LVL>1){box(x0-.01,y0-.01,x1+.01,y1+.01,Ht,1,LVL===4?'#f4efe2':'#ffffff','#f4f2ec','#d8d4ca')}topFace(x0+.03,y0+.03,x1-.03,y1-.03,R,'#a8a296');
  if(LVL===1){for(const [a,b] of [[.18,.18],[.82,.18],[.18,.82],[.82,.82],[.5,.82]]){const [x,y]=P(gx+a,gy+b);px(x,y-R-4,.5,4,'#5a4a3a');px(x+.6,y-R-3.4,.4,3.4,'#5a4a3a')}
    tinaco(gx+.6,gy+.36,R,'#1f1f1f');const A=P(gx+.26,gy+.7),B=P(gx+.5,gy+.84);line(A[0],A[1]-R-5,B[0],B[1]-R-5,'#777');for(let q=0;q<5;q++){const f2=(q+.5)/5;px(A[0]+(B[0]-A[0])*f2-.5,A[1]+(B[1]-A[1])*f2-R-5,1.5,2.4,RIBC[(q+s)%7])}}
  else if(LVL===2){tinaco(gx+.36,gy+.36,R,'#1f1f1f');tinaco(gx+.58,gy+.3,R,'#1f1f1f');const A=P(gx+.3,gy+.74),B=P(gx+.72,gy+.78);line(A[0],A[1]-R-5,B[0],B[1]-R-5,'#777');
    for(let q=0;q<7;q++){const f2=(q+.5)/7;px(A[0]+(B[0]-A[0])*f2-.5,A[1]+(B[1]-A[1])*f2-R-5,1.4,2.6-(q%2)*.6,['#f4f4f4','#e85d75','#2bb3a3','#f2b632'][q%4])}lifted(R,()=>planter(gx+.78,gy+.34,.3))}
  else if(LVL===3){ // último piso remetido: terraza con pérgola de madera
    const gx0=gx+.38,gy0=gy+.38,c=colF(f-1),g2=box(gx0,gy0,x1-.02,y1-.02,R,FH,'#bdb7ab',c,hexShade(c,-.17));winF(g2,'L',.2,1.6,.4,FH-3.4,'#f4efe2','#2f5079');winF(g2,'R',.2,1.6,.4,FH-3.4,'#f4efe2','#2f5079');
    box(gx0-.01,gy0-.01,x1-.01,y1-.01,R+FH,.8,'#ffffff','#f4f2ec','#d8d4ca');tinaco(gx+.72,gy+.7,R+FH+.8,'#1f1f1f');
    lifted(R,()=>{for(const [a,b] of [[.2,.2],[.2,.6],[.6,.2]]){const [x,y]=P(gx+a,gy+b);px(x,y-6,.6,6,'#7a4e2c')}for(let q=0;q<6;q++){const a=P(gx+.18+q*.07,gy+.18),b=P(gx+.18+q*.07,gy+.62);line(a[0],a[1]-6,b[0],b[1]-6,'#8a5a30')}
      planter(gx+.26,gy+.32,.3);chairH(gx+.42,gy+.24,'#2bb3a3')})}
  else{ // azotea con foquitos y jacaranda al pie
    lifted(R,()=>{umbH(gx+.34,gy+.34,'#2f6f5e',5,'#24574a');planter(gx+.72,gy+.3,.34);tableH(gx+.6,gy+.62,'#f4efe2')});
    {const a=P(x0,y1),b=P(x1,y1);bulbsH([a[0],a[1]-R-4],[b[0],b[1]-R-4],7,1.4)}
    const [jx,jy]=P(gx+.95,gy+.06);px(jx-.5,jy-8,1.2,8,'#5a3a24');for(const [dx,dy,r,c] of [[0,-11,3.4,'#7b5bb5'],[-2,-12.5,2.6,'#9a7ad6'],[2,-13,2.6,'#8a6ac6'],[0,-14.5,2,'#b39be6']])circ(jx+dx,jy+dy,r,c)}}
// Bodegas del río: ladrillo oscuro, ventanales de herrería, techo de dientes de sierra, mural y plantas colgantes
function ribBodega(t,gx,gy,f,LVL,s){const FH=7,ins=.12,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const bw=['#8e3b2a','#7a3324','#9a4a30'][s%3],g=box(x0,y0,x1,y1,0,H,'#9a8f80',bw,hexShade(bw,-.2));
  for(let v=1.5;v<H-.5;v+=1.4){face(g,'L',0,v,1,.35,hexShade(bw,-.1));face(g,'R',0,v,1,.35,hexShade(bw,-.28))}
  for(let fl=1;fl<f;fl++){face(g,'L',0,fl*FH-.4,1,.8,'#6a2a1e');face(g,'R',0,fl*FH-.4,1,.8,'#55221a')}
  // planta baja: portón de bodega y ventanal
  face(g,'L',.06,0,.5,FH-1,'#2b2b2b');win(g,'L',.08,.3,.46,FH-1.6,'#6fa3c7');for(const u of [.2,.32,.44])face(g,'L',u,.3,.012,FH-1.6,'#1c1c1c');face(g,'L',.08,(FH-1.6)/2,.46,.2,'#1c1c1c');
  face(g,'L',.64,0,.28,FH-1.2,'#3a3d45');for(let v=.5;v<FH-1.5;v+=.7)face(g,'L',.64,v,.28,.2,'#2b2e35');face(g,'R',.1,0,.5,FH-1,LVL===4?'#1f3d2e':'#2b2b2b');win(g,'R',.12,.4,.46,FH-1.8,'#5d92b8');
  if(LVL===4){face(g,'R',.08,FH-.6,.6,1.2,'#1f1f1f');face(g,'R',.12,FH-.3,.5,.5,'#c9a227',NIGHT>.2)}
  // pisos: ventanales de fábrica (cuadrícula), arco de ladrillo
  for(let fl=1;fl<f;fl++){const v=fl*FH+1,wh=FH-2.2;
    for(const sd of ['L','R'])for(const u of [.08,.54]){const w=.38;face(g,sd,u-.02,v+wh,w+.04,.9,hexShade(bw,.12));win(g,sd,u,v,w,wh,'#3f6f8f');for(let q=1;q<4;q++)face(g,sd,u+q*w/4,v,.012,wh,'#1c1c1c');face(g,sd,u,v+wh*.5,w,.2,'#1c1c1c');
      if(LVL>=3&&sd==='L'&&u>.5){prot(SD.L,u-.02,u+w+.02,.08,v-1,.5,'#1f1f1f');rail(SD.L,u-.02,u+w+.02,.08,v-.5,'bars','#1f1f1f')}
      if(LVL===4){const gg=g;for(let q=0;q<4;q++)face(gg,sd,u+.04+q*.09,v-1.6-(q%2)*.8,.05,1.6+(q%2)*.8,q%2?'#3f8f4a':'#59b04f')}}}
  // mural del río (L2 en adelante): olas y sol sobre la cara derecha
  if(LVL>=2&&f>=4){const v0=FH*1.2,v1=Math.min(H-2,FH*3.6);face(g,'R',.04,v0,.92,v1-v0,'#2bb3a3');for(let k=0;k<5;k++)face(g,'R',.04,v0+k*(v1-v0)/5,.92,.6,k%2?'#7fb7e6':'#1f8a7f');
    face(g,'R',.56,v1-3.2,.22,2.4,'#f2b632');face(g,'R',.6,v1-2.8,.14,1.6,'#f08a4b');face(g,'R',.1,v0+1,.3,1.2,'#e85d75');face(g,'R',.14,v0+2.2,.2,.6,'#f4efe2')}
  // letrero pintado de la fábrica
  face(g,'L',.1,H-3.4,.8,2.2,'#f4efe2');for(let k=0;k<7;k++)face(g,'L',.14+k*.1,H-2.8,.06,1,LVL===4?'#1f3d2e':'#8e3b2a');
  // techo: dientes de sierra; L3 con tragaluces; L4 con jardín y tanque de madera
  const R=H;box(x0-.01,y0-.01,x1+.01,y1+.01,H,.8,'#6a2a1e','#6a2a1e','#55221a');
  if(LVL===4){topFace(x0+.04,y0+.04,x1-.04,y1-.04,R+.8,'#5f8f4a');lifted(R+.8,()=>{planter(gx+.3,gy+.3,.36);planter(gx+.66,gy+.7,.3);
    const gt=cb(gx+.58,gy+.24,gx+.78,gy+.44,4,6,'#8a5a30','#a0693f');face(gt,'L',0,1.5,1,.4,'#3a2a1e');face(gt,'L',0,4,1,.4,'#3a2a1e');for(const [a,b] of [[.6,.26],[.76,.42]]){const [x,y]=P(gx+a,gy+b);px(x,y-4,.6,4,'#3a2a1e')}})}
  else sawtooth(x0+.02,y0+.02,x1-.02,y1-.02,R+.8,3,LVL===1?'#8f969e':'#6f7680',LVL>=3?'#9fd0ee':'#5a7a8f','#7a3324')}
// Torre Malecón: blanca, losas que salen y entran como olas, vidrio azul; arriba, alberca
function ribTorre(t,gx,gy,f,LVL){const FH=6,ins=.17,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const gl=LVL===1?'#4f7f9f':'#3f8fc4',g=box(x0,y0,x1,y1,0,H,'#e9eef2',LVL===1?'#eef0f2':gl,LVL===1?'#d6dade':hexShade(gl,-.18));
  face(g,'L',0,0,1,FH,'#5a6a7a');face(g,'R',0,0,1,FH,'#4a5866');win(g,'L',.06,.5,.88,FH-1.5,'#8fc4e6');face(g,'R',.6,0,.3,FH-1,'#2e3540');
  for(let fl=1;fl<f;fl++){const v=fl*FH+1;
    if(LVL===1){for(const sd of ['L','R']){win(g,sd,.04,v,.92,FH-2.8,'#3f6f8f');for(let q=1;q<5;q++)face(g,sd,q/5,v,.012,FH-2.8,'#e9eef2')}}
    else for(const sd of ['L','R']){win(g,sd,.02,v-.6,.96,FH-1.4,gl);for(let q=1;q<6;q++)face(g,sd,q/6,v-.6,.01,FH-1.4,hexShade(gl,.35))}
    // losas: en L1 planas; luego, como olas (salen y entran según el piso)
    const d=LVL===1?.03:.05+.06*(.5+.5*Math.sin(fl*.85)),d2=LVL===1?.03:.05+.06*(.5+.5*Math.sin(fl*.85+1.6));
    prot(SD.L,0,1,d,v-1.6,.8,'#f6f8fa');prot(SD.R,0,1,d2,v-1.6,.8,'#e4e8ec');
    if(LVL>=3){rail(SD.L,0,1,d,v-.8,'glass','#ffffff');rail(SD.R,0,1,d2,v-.8,'glass','#ffffff')}else if(LVL===2&&fl%2===0)rail(SD.R,.1,.9,d2,v-.8,'bars','#ffffff')}
  // corona y azotea
  box(x0-.02,y0-.02,x1+.02,y1+.02,H,1.4,'#ffffff','#f6f8fa','#e4e8ec');const R=H+1.4;
  if(LVL===4){topFace(x0+.06,y0+.06,gx+.62,gy+.66,R+.1,'#2b8fd0');topFace(x0+.08,y0+.08,gx+.6,gy+.64,R+.2,'#5fc0f0');lifted(R,()=>{palm(gx+.72,gy+.3,9);umbH(gx+.72,gy+.72,'#ffffff',4,'#e4e2dc')});
    const [x,y]=P(gx+.5,gy+.5);glow(x,y-R,10,.5,'#7fd0ff')}
  else if(LVL===3){const g2=box(x0+.12,y0+.12,x1-.12,y1-.12,R,4,'#ffffff',gl,hexShade(gl,-.18));face(g2,'L',0,3,1,1,'#ffffff');face(g2,'R',0,3,1,1,'#e4e8ec')}
  else{cb(gx+.3,gy+.3,gx+.5,gy+.5,R,3,'#d6dade');tinaco(gx+.68,gy+.66,R,'#f0f0ee')}
  if(LVL>=2){const [x,y]=P(gx+.5,gy+.5);px(x-.5,y-R-(LVL===3?9:5),1,1,NIGHT>.2?'#ff3b30':'#b33',NIGHT>.2);if(NIGHT>.2)glow(x,y-R-(LVL===3?9:5),5,.8,'#ff3b30')}}

/* ---------- negocios ---------- */
const RIBART={edificio:ribHousing,ladrillo:ribHousing,torre:ribHousing,cafe:ribCafe,resto:ribResto,bar:ribBar,paleteria:ribPaleta,tomates:ribMercado,oficinas:ribOfi};
const RIBLV={cafe:['Triciclo de pan dulce','Café de esquina','Tostador en bodega','Café terraza al río'],resto:['Coctelería El Güero','Palapa de mariscos','Asadero del Río','Terraza al río'],
  bar:['Depósito El Puente','Cervecería en bodega','Salón cumbiero','Azotea al río'],paleteria:['Aguas frescas','Paletería rosa','Nevería y raspados','Nevería La Ribereña'],
  tomates:['Puesto de frutas','Mercadito de la Ribera','Mercado techado','Mercado gourmet'],oficinas:['Oficinas en bodega','Coworking del Río','Corporativo de ladrillo','Corporativo verde'],
  edificio:['Casas de la Ribera','Casas pintadas','Casas con terraza','Casas de cantera'],ladrillo:['Bodegas del río','Lofts con mural','Lofts con tragaluz','Bodega boutique'],torre:['Torre Malecón','Torre Malecón Plus','Torre Malecón Premium','Torre Malecón Sky']};
function ribCafe(t,gx,gy,L){const s=t.s;
  if(L===1){dsort(gx,gy,[ // triciclo con canasta de pan, sombrilla y bancos
    [.46,.46,()=>{const g=cb(gx+.38,gy+.4,gx+.58,gy+.54,2,3.2,'#2bb3a3','#7fd6cc');face(g,'L',0,2,1,.6,'#f4efe2');for(const [a,b] of [[.36,.56],[.62,.56],[.62,.4]]){const [x,y]=P(gx+a,gy+b);circ(x,y-1.2,1.4,'#2b2b2b');circ(x,y-1.2,.6,'#9aa1ab')}
      const [x,y]=P(gx+.48,gy+.46);ellipse(x,y-6.4,3.6,1.3,'#c98a3a');for(let q=0;q<5;q++)px(x-2.8+q*1.2,y-7.6-(q%2)*.5,1.1,.9,['#f2b632','#e85d75','#f4efe2','#c98a3a','#f2b632'][q])}],
    [.74,.72,()=>stoolH(gx+.74,gy+.72,'#e85d75')],[.6,.84,()=>stoolH(gx+.6,gy+.84,'#f2b632')]]);
    {const [x,y]=P(gx+.5,gy+.46);px(x,y-13,.5,13,'#7a7a7a');parasol(x+.25,y-13,7.5,['#2bb3a3','#ffffff'],1.2)}
    {const [x,y]=P(gx+.16,gy+.84);px(x,y-5,.5,5,'#6e4a2c');letrero(x-3.5,y-9,7.5,'#f4efe2','#2bb3a3')}return}
  if(L===2){const H=12,c=['#2bb3a3','#e85d75','#f2b632'][s%3],g=cb(gx+.14,gy+.14,gx+.6,gy+.62,0,H,c,'#d8d3c9'); // café de esquina con azulejo y toldo
    for(let q=0;q<10;q++){face(g,'L',q/10,0,.1,2,(q%2)?'#2a5ea8':'#f4efe2');face(g,'R',q/10,0,.1,2,(q%2)?'#24508f':'#d8d3c9')}
    face(g,'L',.1,2,.36,6,'#3a2a1e');win(g,'L',.12,2.5,.32,5,'#9fc4dc');face(g,'L',.56,2,.34,5,'#3a2a1e');win(g,'L',.58,2.5,.3,4,'#9fc4dc');win(g,'R',.14,2.5,.4,5,'#8cb6d2');
    toldo(g,'L',.04,.96,7.6,.1,'#ffffff','#f2b632',7);letrero(...(()=>{const A=g.L,B=g.B;return [A[0]+(B[0]-A[0])*.2,A[1]+(B[1]-A[1])*.2-H+.5]})(),8,'#f4efe2','#3a2a1e');
    azotea(gx+.14,gy+.14,gx+.6,gy+.62,H,1);bugam(g,'R',.92,H-.5,6);
    dsort(gx,gy,[[.8,.3,()=>{chairH(gx+.86,gy+.26,'#d62828');tableH(gx+.78,gy+.32,'#f4f4f4','#888');chairH(gx+.7,gy+.38,'#d62828')}],[.4,.82,()=>{chairH(gx+.48,gy+.78,'#d62828');tableH(gx+.4,gy+.84,'#f4f4f4','#888')}]]);return}
  if(L===3){const H=13,g=cb(gx+.12,gy+.12,gx+.64,gy+.66,0,H,'#8e3b2a','#9a8f80'); // tostador en bodega: portón de cristal, foquitos, bici
    for(let v=1.2;v<H;v+=1.3){face(g,'L',0,v,1,.3,'#7a3324');face(g,'R',0,v,1,.3,'#6a2a1e')}face(g,'L',.06,0,.88,8,'#1c1c1c');win(g,'L',.08,.4,.84,7.2,'#c9e2f0');for(let q=1;q<6;q++)face(g,'L',.08+q*.14,.4,.012,7.2,'#1c1c1c');for(const v of [2.8,5.2])face(g,'L',.08,v,.84,.2,'#1c1c1c');
    win(g,'R',.12,1,.5,6,'#8cb6d2');face(g,'R',.1,9,.8,2.4,'#1c1c1c');face(g,'R',.16,9.6,.5,1.2,'#f2b632',NIGHT>.2);sawtooth(gx+.12,gy+.12,gx+.64,gy+.66,H,2,'#6f7680','#9fd0ee','#7a3324');
    {const a=P(gx+.12,gy+.72),b=P(gx+.66,gy+.72);bulbsH([a[0],a[1]-10],[b[0],b[1]-10],6,1.4)}
    dsort(gx,gy,[[.82,.4,()=>{const [x,y]=P(gx+.82,gy+.4);circ(x-2.4,y-2,1.8,'#2b2b2b');circ(x-2.4,y-2,1.1,'#ece8e0');circ(x+2.4,y-2,1.8,'#2b2b2b');circ(x+2.4,y-2,1.1,'#ece8e0');line(x-2.4,y-2,x,y-4.4,'#e85d75');line(x,y-4.4,x+2.4,y-2,'#e85d75')}],
      [.5,.84,()=>{tableH(gx+.5,gy+.84,'#a0693f');stoolH(gx+.6,gy+.78,'#2b2b2b');stoolH(gx+.4,gy+.9,'#2b2b2b')}]]);return}
  // café terraza: dos pisos blancos, terraza con sombrillas, bugambilia
  const H=18,g=cb(gx+.12,gy+.12,gx+.62,gy+.68,0,H,'#f4efe2','#d8d3c9');face(g,'L',0,0,1,1,'#2bb3a3');face(g,'R',0,0,1,1,'#239a8c');
  win(g,'L',.08,1.5,.4,6,'#9fc4dc');win(g,'L',.54,1.5,.38,6,'#9fc4dc');face(g,'R',.1,0,.3,7,'#2bb3a3');win(g,'R',.5,1.5,.4,6,'#8cb6d2');
  for(const u of [.08,.54])winF(g,'L',u,10,.36,5,'#2bb3a3','#2f5079');winF(g,'R',.5,10,.4,5,'#2bb3a3','#2f5079');
  toldo(g,'L',.04,.96,7.2,.09,'#ffffff','#2bb3a3',7);bugam(g,'L',.06,H-.5,9);
  box(gx+.1,gy+.1,gx+.64,gy+.7,H,.8,'#c98a5a','#f4f2ec','#d8d4ca');lifted(H+.8,()=>{umbH(gx+.28,gy+.3,'#2bb3a3',5,'#239a8c');umbH(gx+.52,gy+.52,'#f2b632',5,'#d99a1c');planter(gx+.56,gy+.2,.3)});
  {const a=P(gx+.1,gy+.7),b=P(gx+.64,gy+.7);bulbsH([a[0],a[1]-H-4],[b[0],b[1]-H-4],6,1.2)}
  dsort(gx,gy,[[.8,.4,()=>{chairH(gx+.86,gy+.36,'#f4f4f4');tableH(gx+.8,gy+.42,'#a0693f')}],[.8,.8,()=>planter(gx+.82,gy+.82,.36)]])}
function ribResto(t,gx,gy,L){const s=t.s;
  if(L===1){dsort(gx,gy,[ // coctelería: carrito blanco y azul con hielera, bancos de plástico
    [.44,.44,()=>{const g=cb(gx+.3,gy+.36,gx+.58,gy+.52,1.4,4.4,'#f4f4f4','#ffffff');face(g,'L',0,0,1,1.4,'#2a5ea8');face(g,'L',.1,2,.8,1.6,'#7fb7e6');for(const [a,b] of [[.34,.54],[.56,.54]]){const [x,y]=P(gx+a,gy+b);circ(x,y-1,1.4,'#2b2b2b')}
      const [x,y]=P(gx+.44,gy+.44);for(let k=0;k<3;k++){px(x-2.4+k*1.8,y-8.4,1.4,2,'rgba(220,240,250,.9)',true);px(x-2.4+k*1.8,y-7.6,1.4,1.2,['#e85d75','#f08a4b','#e85d75'][k])}}],
    [.68,.66,()=>{tableH(gx+.68,gy+.66,'#e85d75','#b84a5e');stoolH(gx+.78,gy+.6,'#2a5ea8');stoolH(gx+.58,gy+.76,'#2a5ea8')}],[.3,.82,()=>{stoolH(gx+.3,gy+.82,'#e85d75');stoolH(gx+.2,gy+.76,'#2a5ea8')}]]);
    {const [x,y]=P(gx+.46,gy+.44);px(x,y-13,.5,13,'#7a7a7a');parasol(x+.25,y-13,8,['#2a5ea8','#ffffff'],1.2)}
    {const [sx,sy]=P(gx+.12,gy+.62);px(sx,sy-6,.5,6,'#6e4a2c');px(sx-4.5,sy-11,9.5,5,'#f4f4f4');px(sx-3.2,sy-9.6,5,2,'#2a5ea8');px(sx+1.8,sy-9.2,1.4,1.2,'#2a5ea8');px(sx-2.4,sy-9.2,.6,.6,'#ffffff')}return}
  if(L===2){ // palapa de mariscos con techo de palma
    dsort(gx,gy,[[.3,.3,()=>{const g=cb(gx+.16,gy+.16,gx+.4,gy+.36,0,7,'#f4efe2','#d8d3c9');face(g,'L',.2,0,.5,5,'#3a2a1e');face(g,'R',.2,2,.6,2.5,'#2a5ea8')}],
      [.62,.62,()=>{tableH(gx+.62,gy+.6,'#a0693f');chairH(gx+.72,gy+.54,'#f4f4f4');chairH(gx+.52,gy+.7,'#f4f4f4')}],[.42,.78,()=>{tableH(gx+.42,gy+.8,'#a0693f');chairH(gx+.5,gy+.76,'#f4f4f4')}]]);
    for(const [a,b] of [[.2,.2],[.82,.2],[.2,.82],[.82,.82]]){const [x,y]=P(gx+a,gy+b);px(x-.4,y-11,.9,11,'#7a4e2c')}
    palapa(gx+.08,gy+.08,gx+.94,gy+.94,11,9);
    {const [sx,sy]=P(gx+.9,gy+.5);px(sx,sy-6,.5,6,'#6e4a2c');px(sx-4,sy-10.5,8.5,4.5,'#2bb3a3');px(sx-2.6,sy-9,4.4,1.8,'#f4f4f4');px(sx+1.8,sy-8.8,1.2,1.2,'#f4f4f4')}return}
  if(L===3){ // asadero: muros ocre, chimenea con humo, parrilla afuera
    const H=12,g=cb(gx+.12,gy+.12,gx+.6,gy+.6,0,H,'#d9a441','#c9c1b2');face(g,'L',0,0,1,1.4,'#7a4e2c');face(g,'R',0,0,1,1.4,'#6a4326');
    face(g,'L',.08,1.4,.4,6,'#3a2a1e');win(g,'L',.1,2,.36,5,'#ffcf8a');face(g,'L',.58,1.4,.32,6.5,'#5a3a24');win(g,'R',.12,2,.5,5,'#e8c08a');
    for(let k=0;k<7;k++)face(g,'L',k/7,8,1/7,1.6,k%2?'#f4efe2':'#c0392b',NIGHT>.3&&!(k%2));letrero(...(()=>{const A=g.L,B=g.B;return [A[0]+(B[0]-A[0])*.15,A[1]+(B[1]-A[1])*.15-H+.6]})(),9,'#3a2a1e','#f2b632');
    box(gx+.1,gy+.1,gx+.62,gy+.62,H,.8,'#a0522d','#8a4526','#733a20');const gc=cb(gx+.44,gy+.16,gx+.54,gy+.26,H+.8,5,'#b5653a');{const [x,y]=P(gx+.49,gy+.21);smokeH(x,y-H-7)}
    dsort(gx,gy,[[.8,.32,()=>{const g2=cb(gx+.72,gy+.26,gx+.9,gy+.38,0,3.4,'#2b2b2b');const [x,y]=P(gx+.81,gy+.32);for(let q=0;q<4;q++)px(x-2+q*1.2,y-4.4,.8,.6,NIGHT>.2?'#ff7a1a':'#c0392b',NIGHT>.2);smokeH(x,y-6);glow(x,y-4,6,.7,'#ff7a1a')}],
      [.6,.82,()=>{tableH(gx+.6,gy+.82,'#a0693f');chairH(gx+.7,gy+.78,'#2b2b2b');chairH(gx+.5,gy+.88,'#2b2b2b')}]]);return}
  // terraza al río: dos pisos de madera y vidrio, deck, foquitos y palmeras
  const H=17,g=cb(gx+.14,gy+.12,gx+.6,gy+.58,0,H,'#f4efe2','#d8d3c9');face(g,'L',0,0,1,8,'#7a4e2c');face(g,'R',0,0,1,8,'#6a4326');win(g,'L',.06,1,.88,6,'#ffcf8a');for(let q=1;q<5;q++)face(g,'L',q/5,1,.012,6,'#3a2a1e');win(g,'R',.1,1,.8,6,'#e8c08a');
  win(g,'L',.08,10,.84,5.5,'#9fc4dc');win(g,'R',.1,10,.8,5.5,'#8cb6d2');azotea(gx+.14,gy+.12,gx+.6,gy+.58,H);
  topFace(gx+.06,gy+.62,gx+.94,gy+.94,1,'#a0693f');for(let q=0;q<8;q++){const a=P(gx+.06+q*.11,gy+.62),b=P(gx+.06+q*.11,gy+.94);line(a[0],a[1]-1,b[0],b[1]-1,'#8a5530')}
  dsort(gx,gy,[[.34,.76,()=>{tableH(gx+.34,gy+.78,'#f4efe2','#555');chairH(gx+.44,gy+.72,'#2b2b2b')}],[.7,.82,()=>{tableH(gx+.7,gy+.82,'#f4efe2','#555');chairH(gx+.8,gy+.76,'#2b2b2b')}],[.86,.3,()=>palm(gx+.86,gy+.3,13)]]);
  {const a=P(gx+.06,gy+.94),b=P(gx+.94,gy+.94);for(const q of [a,b])px(q[0]-.3,q[1]-9,.7,9,'#5a3a24');bulbsH([a[0],a[1]-9],[b[0],b[1]-9],8,1.6)}}
function ribBar(t,gx,gy,L){const s=t.s;
  if(L===1){const H=11,g=cb(gx+.18,gy+.18,gx+.6,gy+.6,0,H,'#f2b632','#d8d3c9'); // depósito de esquina: refri, cartones, toldo
    face(g,'L',0,0,1,1.2,'#2a5ea8');face(g,'L',.08,1.2,.5,6.4,'#2b2b2b');face(g,'L',.12,1.6,.2,5.6,'#d8e8f0',NIGHT>.2);face(g,'L',.34,1.6,.2,5.6,'#d8e8f0',NIGHT>.2);for(const v of [3,5])face(g,'L',.12,v,.42,.25,'#f2b632');
    face(g,'R',.2,0,.4,6.4,'#9aa0a8');for(let v=.5;v<6;v+=.8)face(g,'R',.2,v,.4,.2,'#7f858d');letrero(...(()=>{const A=g.L,B=g.B;return [A[0]+(B[0]-A[0])*.1,A[1]+(B[1]-A[1])*.1-H+.6]})(),8,'#2a5ea8','#f4efe2');
    azotea(gx+.18,gy+.18,gx+.6,gy+.6,H,1);
    dsort(gx,gy,[[.74,.36,()=>{for(let k=0;k<3;k++)cb(gx+.7,gy+.32,gx+.82,gy+.42,k*1.6,1.6,['#f2b632','#c0392b','#f2b632'][k])}],[.6,.8,()=>{stoolH(gx+.6,gy+.8,'#f2b632');stoolH(gx+.72,gy+.72,'#2a5ea8')}]]);
    if(NIGHT>.2){const [x,y]=P(gx+.3,gy+.62);glow(x,y-5,8,.8,'#bfe9ff')}return}
  if(L===2){const H=13,g=cb(gx+.12,gy+.12,gx+.62,gy+.62,0,H,'#8e3b2a','#9a8f80'); // cervecería en bodega: portón abierto, barriles, mesa larga
    for(let v=1.2;v<H;v+=1.3){face(g,'L',0,v,1,.3,'#7a3324');face(g,'R',0,v,1,.3,'#6a2a1e')}face(g,'L',.08,0,.6,7.4,'#1c1c1c');win(g,'L',.1,.4,.56,6.6,'#e8b46a');face(g,'L',.08,7.4,.6,.6,'#3a3d45');
    face(g,'R',.14,6,.6,3,'#f4efe2');face(g,'R',.2,6.6,.48,1.8,'#c9a227',NIGHT>.2);sawtooth(gx+.12,gy+.12,gx+.62,gy+.62,H,2,'#6f7680','#5a7a8f','#7a3324');
    dsort(gx,gy,[[.82,.3,()=>{for(const [a,b] of [[.8,.26],[.88,.36]]){const g2=cb(gx+a-.05,gy+b-.05,gx+a+.05,gy+b+.05,0,4,'#7a4e2c');face(g2,'L',0,1,1,.4,'#3a3a3a');face(g2,'L',0,3,1,.4,'#3a3a3a')}}],
      [.46,.84,()=>{tableH(gx+.38,gy+.84,'#a0693f');tableH(gx+.54,gy+.84,'#a0693f');stoolH(gx+.3,gy+.92,'#3a3a3a');stoolH(gx+.62,gy+.78,'#3a3a3a')}]]);
    {const a=P(gx+.1,gy+.7),b=P(gx+.66,gy+.7);bulbsH([a[0],a[1]-11],[b[0],b[1]-11],6,1.4)}return}
  if(L===3){const H=14,g=cb(gx+.12,gy+.12,gx+.64,gy+.64,0,H,'#3a2a6a','#2a2048'); // salón cumbiero: luces de colores, bocinas, papel picado
    face(g,'L',.3,0,.4,7,'#1c1c1c');win(g,'L',.32,.4,.36,6.4,'#ff6fae');for(const u of [.06,.76])face(g,'L',u,0,.16,4.6,'#1c1c1c');for(const u of [.06,.76]){face(g,'L',u+.04,1,.08,1.2,'#555');face(g,'L',u+.04,2.8,.08,1.2,'#555')}
    face(g,'L',.08,8.2,.84,3.2,'#1c1c1c');for(let k=0;k<6;k++)face(g,'L',.12+k*.13,8.8,.09,2,['#ff6fae','#59cd90','#f2b632','#7fb7e6','#ff6fae','#f08a4b'][k],NIGHT>.15);
    win(g,'R',.12,2,.3,4,'#9b6bd3');win(g,'R',.52,2,.3,4,'#9b6bd3');box(gx+.1,gy+.1,gx+.66,gy+.66,H,.8,'#f2b632','#e0a020','#c88a14');
    {const a=P(gx+.1,gy+.78),b=P(gx+.7,gy+.78);papel([a[0],a[1]-12],[b[0],b[1]-12],8)}
    if(NIGHT>.15){const [x,y]=P(gx+.38,gy+.64);for(const [dx,c] of [[-4,'#ff6fae'],[0,'#59cd90'],[4,'#7fb7e6']])glow(x+dx,y-10,7,.6,c)}
    dsort(gx,gy,[[.82,.4,()=>agave(gx+.84,gy+.38)],[.7,.84,()=>agave(gx+.7,gy+.84,.8)]]);return}
  // bar de azotea: dos pisos con terraza arriba, foquitos y sombrillas
  const H=18,g=cb(gx+.12,gy+.12,gx+.66,gy+.66,0,H,'#1f3d4a','#16303a');face(g,'L',.1,0,.8,7,'#0f1f26');win(g,'L',.12,.5,.76,6,'#ffcf8a');for(let q=1;q<4;q++)face(g,'L',.12+q*.19,.5,.012,6,'#0f1f26');
  win(g,'L',.1,10,.8,5,'#5d92b8');win(g,'R',.1,10,.8,5,'#4f86b0');win(g,'R',.1,1,.5,5,'#e8c08a');face(g,'L',.1,8,.8,1.2,'#2bb3a3',NIGHT>.2);
  box(gx+.1,gy+.1,gx+.68,gy+.68,H,.8,'#a0693f','#e4e0d8','#cfcac2');lifted(H+.8,()=>{umbH(gx+.3,gy+.3,'#f4efe2',5,'#d8d3c9');umbH(gx+.56,gy+.56,'#e85d75',5,'#c94a60');palm(gx+.6,gy+.2,8)});
  {const a=P(gx+.1,gy+.68),b=P(gx+.68,gy+.68);bulbsH([a[0],a[1]-H-4],[b[0],b[1]-H-4],7,1.2)}
  dsort(gx,gy,[[.84,.84,()=>planter(gx+.84,gy+.84,.36)]])}
function ribPaleta(t,gx,gy,L){
  if(L===1){dsort(gx,gy,[ // aguas frescas: mesa con vitroleros
    [.46,.46,()=>{const g=cb(gx+.28,gy+.38,gx+.62,gy+.54,0,3.6,'#f4efe2','#ffffff');face(g,'L',0,0,1,3.6,'#e85d75');for(let k=0;k<6;k++)face(g,'L',k/6,2.6,1/6,1,k%2?'#ffffff':'#e85d75');
      const [x,y]=P(gx+.46,gy+.46);[['#f4efe2',-4.5],['#c0392b',-1.5],['#7a4e2c',1.5],['#8cc96b',4.5]].forEach(([c,dx])=>vitro(x+dx,y-3.6,c))}],
    [.76,.72,()=>stoolH(gx+.76,gy+.72,'#2bb3a3')]]);
    {const [x,y]=P(gx+.5,gy+.4);px(x,y-17,.5,17,'#7a7a7a');parasol(x+.25,y-17,8,['#e85d75','#ffffff'],1.2)}
    {const [x,y]=P(gx+.14,gy+.82);px(x,y-5,.5,5,'#6e4a2c');letrero(x-3.5,y-9,7.5,'#e85d75','#ffffff')}return}
  if(L===2){const H=11,g=cb(gx+.16,gy+.16,gx+.62,gy+.62,0,H,'#ff8fb1','#d8d3c9'); // paletería rosa con paleta gigante
    face(g,'L',.08,0,.5,6.6,'#3a2a1e');win(g,'L',.1,.4,.46,6,'#bfe0f0');face(g,'L',.68,0,.24,6,'#ffffff');win(g,'R',.14,1,.5,5,'#bfe0f0');
    azotea(gx+.16,gy+.16,gx+.62,gy+.62,H);
    {const [x,y]=P(gx+.4,gy+.4);px(x-.4,y-H-4,.8,4,'#d9b36a');px(x-2.4,y-H-12,4.8,8,'#e85d75');px(x-2.4,y-H-12,1.4,8,'#ff8fb1');px(x-2.4,y-H-6,4.8,1.4,'#f4efe2')}
    dsort(gx,gy,[[.8,.4,()=>{const g2=cb(gx+.74,gy+.34,gx+.88,gy+.46,0,4,'#ffffff');face(g2,'L',0,1,1,1.4,'#2bb3a3')}],[.5,.84,()=>{stoolH(gx+.5,gy+.84,'#ff8fb1');stoolH(gx+.62,gy+.78,'#2bb3a3')}]]);return}
  if(L===3){const H=12,g=cb(gx+.12,gy+.12,gx+.62,gy+.62,0,H,'#9fe3d0','#d8d3c9'); // nevería y raspados: menta, toldo, bancas
    face(g,'L',.08,0,.84,6.4,'#3a2a1e');win(g,'L',.1,.4,.8,5.8,'#d8f0f8');for(const [u,c] of [[.16,'#d62828'],[.3,'#59cd90'],[.44,'#f2b632'],[.58,'#7a4e2c'],[.72,'#9b6bd3']])face(g,'L',u,4,.08,1.2,c,NIGHT>.2);win(g,'R',.14,1,.5,5,'#c8e8f0');
    toldo(g,'L',.04,.96,6.8,.1,'#ffffff','#2bb3a3',7);azotea(gx+.12,gy+.12,gx+.62,gy+.62,H,1);
    {const [x,y]=P(gx+.38,gy+.64);px(x-3.4,y-H+1,7,3,'#ffffff');px(x-2,y-H+1.5,1.2,2,'#e85d75');px(x-.4,y-H+1.5,1.2,2,'#2bb3a3');px(x+1.2,y-H+1.5,1.2,2,'#f2b632')}
    dsort(gx,gy,[[.82,.3,()=>{for(const a of [.78,.9]){const [x,y]=P(gx+a,gy+.3);px(x-2,y-2.5,4,1,'#a0693f');px(x-1.6,y-1.5,.5,1.5,'#555');px(x+1.2,y-1.5,.5,1.5,'#555')}}],[.5,.84,()=>planter(gx+.5,gy+.84,.34)]]);return}
  // nevería La Ribereña: retro de dos colores con cono luminoso
  const H=14,g=cb(gx+.12,gy+.12,gx+.64,gy+.64,0,H,'#f4efe2','#d8d3c9');face(g,'L',0,0,1,5,'#e85d75');face(g,'R',0,0,1,5,'#c94a60');win(g,'L',.06,.6,.88,6.4,'#d8f0f8');for(let q=1;q<5;q++)face(g,'L',.06+q*.176,.6,.012,6.4,'#f4efe2');
  win(g,'R',.12,1,.6,6,'#c8e8f0');face(g,'L',0,8,1,.8,'#2bb3a3');box(gx+.1,gy+.1,gx+.66,gy+.66,H,1,'#e85d75','#d64d68','#b84058');
  {const [x,y]=P(gx+.38,gy+.38),on=NIGHT>.2,b=y-H-1;poly([[x-3.2,b-9],[x+3.2,b-9],[x,b]],'#e8b46a',on);for(let q=1;q<4;q++)line(x-3.2+q*.9,b-9+q*.3,x-.2+q*.5,b-2,'#c98f45',on);circ(x,b-11,3.6,'#ff8fb1',on);circ(x-1,b-12.4,1.8,'#ffd1e0',on);px(x-.5,b-15.4,1.2,1.2,'#d62828',on);if(on)glow(x,b-10,12,.9,'#ff8fb1')}
  dsort(gx,gy,[[.8,.36,()=>{chairH(gx+.86,gy+.32,'#2bb3a3');tableH(gx+.8,gy+.38,'#ffffff','#888')}],[.5,.84,()=>{chairH(gx+.56,gy+.8,'#e85d75');tableH(gx+.5,gy+.86,'#ffffff','#888')}]])}
function ribMercado(t,gx,gy,L){
  if(L===1){dsort(gx,gy,[ // puesto de frutas: tablones, cajas, lona
    [.46,.46,()=>{for(const [a,b] of [[.3,.38],[.62,.38],[.3,.6],[.62,.6]]){const [x,y]=P(gx+a,gy+b);px(x,y-9,.6,9,'#7a4e2c')}
      const g=cb(gx+.28,gy+.38,gx+.64,gy+.6,2.4,1,'#a0693f');const [x,y]=P(gx+.46,gy+.48);fruitRow(x-4,y-4.4,6)}],
    [.76,.7,()=>{for(let k=0;k<2;k++){const g2=cb(gx+.7,gy+.64,gx+.84,gy+.76,k*1.8,1.8,'#c98a3a');}const [x,y]=P(gx+.77,gy+.7);fruitRow(x-1.6,y-4.4,2)}],
    [.3,.8,()=>{const g2=cb(gx+.24,gy+.74,gx+.38,gy+.86,0,1.8,'#c98a3a');const [x,y]=P(gx+.31,gy+.8);fruitRow(x-1.6,y-2.6,2)}]]);
    {const o=orient([P(gx+.24,gy+.32),P(gx+.7,gy+.32),P(gx+.7,gy+.66),P(gx+.24,gy+.66)]),h=10;poly([up(o.T,h+1),up(o.R,h),up(o.B,h-1),up(o.L,h)],'#2bb3a3');poly([up(o.L,h),up(o.B,h-1),up(o.B,h-1.8),up(o.L,h-.8)],'#239a8c')}return}
  if(L===2){const H=9,g=cb(gx+.12,gy+.12,gx+.66,gy+.66,0,H,'#f4efe2','#d8d3c9'); // mercadito: frente abierto, techo de lámina
    face(g,'L',.04,0,.92,6.4,'#3a2a1e');for(let k=0;k<3;k++){const u=.08+k*.3;face(g,'L',u,1.4,.24,1.2,'#a0693f');for(let q=0;q<3;q++)face(g,'L',u+.02+q*.07,2.6,.05,.8,['#e63946','#f2b632','#59b04f'][(q+k)%3],NIGHT>.25)}
    face(g,'R',.1,0,.4,6,'#2b2b2b');for(let v=.6;v<5.6;v+=.8)face(g,'R',.1,v,.4,.2,'#555');letrero(...(()=>{const A=g.L,B=g.B;return [A[0]+(B[0]-A[0])*.12,A[1]+(B[1]-A[1])*.12-H+.4]})(),10,'#2bb3a3','#f4efe2');
    pyramid(gx+.08,gy+.08,gx+.7,gy+.7,H,3,'#9aa0a8','#7f858d');
    dsort(gx,gy,[[.82,.4,()=>{const g2=cb(gx+.76,gy+.3,gx+.9,gy+.5,0,2.4,'#c98a3a');const [x,y]=P(gx+.83,gy+.4);fruitRow(x-2.4,y-3.2,3)}],[.5,.84,()=>{const g2=cb(gx+.38,gy+.78,gx+.62,gy+.9,0,2.4,'#c98a3a');const [x,y]=P(gx+.5,gy+.84);fruitRow(x-3,y-3.2,4)}]]);return}
  if(L===3){const H=10,g=cb(gx+.08,gy+.1,gx+.8,gy+.72,0,H,'#e8d8b8','#d8d3c9'); // mercado techado con bóveda de lámina
    for(const sd of ['L','R'])for(let k=0;k<4;k++){const u=.04+k*.24;face(g,sd,u,0,.18,6.8,'#3a2a1e');face(g,sd,u+.01,6.8,.16,.6,RIBC[k%5]);face(g,sd,u+.01,1.6,.16,1,'#a0693f',NIGHT>.25)}
    {const it=[],x0=gx+.06,x1=gx+.82,y0=gy+.08,y1=gy+.74,n=8;for(let k=0;k<n;k++){const a=y0+(y1-y0)*k/n,b=y0+(y1-y0)*(k+1)/n,ha=H+Math.sin(Math.PI*k/n)*5,hb=H+Math.sin(Math.PI*(k+1)/n)*5;it.push({p:[[x0,a,ha],[x1,a,ha],[x1,b,hb],[x0,b,hb]],c:k%2?'#b8bec6':'#a8aeb6'})}
      it.push({p:[[x1,y0,H],[x1,y1,H],...Array.from({length:n+1},(_,k)=>[x1,y1-(y1-y0)*k/n,H+Math.sin(Math.PI*(n-k)/n)*5])],c:'#e8d8b8',z:-.5});paint3(it)}
    {const [x,y]=P(gx+.44,gy+.74);letrero(x-6,y-H-1,12,'#2bb3a3','#f4efe2')}
    dsort(gx,gy,[[.88,.82,()=>{const [x,y]=P(gx+.88,gy+.84);px(x,y-8,.5,8,'#555');parasol(x+.25,y-8,4.5,['#f2b632','#ffffff'],.9)}]]);return}
  // mercado gourmet: herrería verde, vidrio, banderines
  const H=14,g=cb(gx+.08,gy+.1,gx+.8,gy+.72,0,H,'#2f6f5e','#24574a');for(const sd of ['L','R']){win(g,sd,.04,.6,.92,H-3,'#bfe0f0');for(let q=1;q<6;q++)face(g,sd,.04+q*.153,.6,.02,H-3,'#2f6f5e');face(g,sd,.04,7,.92,.4,'#2f6f5e')}
  for(let k=0;k<3;k++)face(g,'L',.12+k*.3,1,.16,1.2,'#a0693f',NIGHT>.25);{const it=[],x0=gx+.06,x1=gx+.82,y0=gy+.08,y1=gy+.74,n=8;for(let k=0;k<n;k++){const a=y0+(y1-y0)*k/n,b=y0+(y1-y0)*(k+1)/n,ha=H+Math.sin(Math.PI*k/n)*5,hb=H+Math.sin(Math.PI*(k+1)/n)*5;it.push({p:[[x0,a,ha],[x1,a,ha],[x1,b,hb],[x0,b,hb]],c:k%2?'#3f8f7a':'#357a68'})}paint3(it)}
  {const a=P(gx+.06,gy+.8),b=P(gx+.84,gy+.8);papel([a[0],a[1]-8],[b[0],b[1]-8],9)}dsort(gx,gy,[[.9,.86,()=>planter(gx+.9,gy+.86,.34)]])}
function ribOfi(t,gx,gy,L,ic){const ins=.14,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,FH=6,f=ic?4:[0,5,6,7,8][L],H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const bw='#8e3b2a',sb=L>=3?Math.max(3,f-3):f,Hb=sb*FH+1,g=box(x0,y0,x1,y1,0,Hb,'#9a8f80',bw,hexShade(bw,-.2));
  for(let v=1.5;v<Hb-.5;v+=1.4){face(g,'L',0,v,1,.35,hexShade(bw,-.1));face(g,'R',0,v,1,.35,hexShade(bw,-.28))}
  face(g,'L',.06,0,.88,FH-1,'#1c1c1c');win(g,'L',.08,.4,.84,FH-1.8,'#9fc4dc');for(let q=1;q<5;q++)face(g,'L',.08+q*.168,.4,.012,FH-1.8,'#1c1c1c');face(g,'R',.3,0,.36,FH-1,'#2e2f36');
  for(let fl=1;fl<sb;fl++){const v=fl*FH+.8;for(const sd of ['L','R']){win(g,sd,.06,v,.88,FH-2,'#3f6f8f');for(let q=1;q<6;q++)face(g,sd,.06+q*.147,v,.012,FH-2,'#1c1c1c');face(g,sd,.06,v+(FH-2)/2,.88,.15,'#1c1c1c')}}
  if(L>=2){const v0=FH+1,v1=Math.min(Hb-1,FH*3.4);face(g,'R',.06,v0,.88,v1-v0,'#f2b632');face(g,'R',.06,v0,.88,.8,'#e85d75');for(let k=0;k<4;k++)face(g,'R',.14+k*.2,v0+1.6+(k%2)*1.4,.12,1.6,['#2bb3a3','#e85d75','#2a5ea8','#59b04f'][k])}
  if(L>=3){const i2=.06,g2=box(x0+i2,y0+i2,x1-i2,y1-i2,Hb,H-Hb,'#c9c5bd',L===4?'#5f9f7a':'#7fb0cf',L===4?'#4f8a68':'#6a9cbd');
    for(let fl=sb;fl<f;fl++){const v=fl*FH-Hb+1;for(const sd of ['L','R']){win(g2,sd,.04,v,.92,FH-1.6,L===4?'#6fb08a':'#5d92b8');for(let q=1;q<5;q++)face(g2,sd,q/5,v,.01,FH-1.6,'#dfe8ee')}}
    if(L===4)for(const sd of ['L','R'])for(let q=0;q<9;q++)face(g2,sd,.05+q*.1,1+(q%3)*2,.06,H-Hb-2-(q%3)*2,q%2?'#3f8f4a':'#59b04f');
    box(x0+i2-.01,y0+i2-.01,x1-i2+.01,y1-i2+.01,H,.8,'#e4e0d8','#d8d4ca','#c9c5bd');if(L===4){topFace(x0+i2+.03,y0+i2+.03,x1-i2-.03,y1-i2-.03,H+.8,'#5f8f4a');lifted(H+.8,()=>{planter(gx+.36,gy+.36,.34);planter(gx+.64,gy+.6,.3)})}}
  else{box(x0-.01,y0-.01,x1+.01,y1+.01,Hb,.8,'#6a2a1e','#6a2a1e','#55221a');sawtooth(x0+.02,y0+.02,x1-.02,y1-.02,Hb+.8,3,'#6f7680',L===2?'#9fd0ee':'#5a7a8f','#7a3324')}
  if(L===2){dsort(gx,gy,[[.92,.5,()=>{const [x,y]=P(gx+.94,gy+.5);for(const dx of [-3,3]){circ(x+dx-1.5,y-2,1.4,'#2b2b2b');circ(x+dx+1.5,y-2,1.4,'#2b2b2b');line(x+dx-1.5,y-2,x+dx+1.5,y-2,'#2bb3a3')}}]])}}
