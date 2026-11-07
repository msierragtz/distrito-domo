/* ===== Distrito Ribera: vivienda y negocios con cara propia (v70) =====
   Mismo juego (costos, pisos, niveles), otro barrio: casas pintadas con molduras, postigos y bugambilias; bodegas de ladrillo
   con ventanales de arco y el mural del Cerro de la Silla; la Torre Malecón con su «vela»; y negocios de río: triciclo de pan,
   mariscos y palapa, asadero, depósito y salón cumbiero, aguas frescas, mercadito, coworking en bodega. */
let RIBV=DIST==='ribera';
const RIBC=['#e85d75','#2bb3a3','#f2b632','#7fb7e6','#f08a4b','#9b6bd3','#8cc96b','#f4efe2'];
const hR=(s,q)=>Math.abs(Math.sin(s*3.17+q*12.71)*9137.13)%1;
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
// punto y polígono sobre el plano de una cara (u a lo largo, v hacia arriba); también sirve arriba del techo
const fpt=(g,side,u,v)=>{const A=side==='L'?g.L:g.B,B=side==='L'?g.B:g.R;return [A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u-g.lift-v]};
function fpoly(g,side,pts,col,lit){return poly(pts.map(([u,v])=>fpt(g,side,u,v)),col,lit)}
// ventana encendida de noche con la misma suerte que win()
function wlit(col){WC++;const h=Math.abs(Math.sin(SEED*12.9898+WC*78.233)*43758.5453)%1,on=NIGHT>.2&&h<(NIGHT>.9?WLTH[WLATE]:.46);return on?[h<.2?'#ffe9a8':'#ffc96b',true]:[col,false]}
const archP=(a,b,c,d,r)=>{const p=[[a,b],[c,b],[c,d-r]];for(let k=1;k<8;k++){const q=k/8*Math.PI;p.push([(a+c)/2+(c-a)/2*Math.cos(q),d-r+r*Math.sin(q)])}p.push([a,d-r]);return p};
// ventana o puerta de arco: dovela, marco, vidrio con reflejo, parteluces
function arcoW(g,side,u,v,w,h,frame,glass,mull,dov){const r=Math.min(2.2,h*.32),b0=Math.max(0,v-.6);
  if(dov)fpoly(g,side,archP(u-.05,b0,u+w+.05,v+h+1.3,r+1.3),dov);fpoly(g,side,archP(u-.022,b0,u+w+.022,v+h+.6,r+.6),frame);
  const [gc,on]=wlit(glass);fpoly(g,side,archP(u,v,u+w,v+h,r),gc,on);
  if(mull){face(g,side,u+w/2-.009,v,.018,h-.2,mull,on);face(g,side,u,v+(h-r)*.55,w,.3,mull,on)}
  if(!on&&!(NIGHT>.2)){face(g,side,u+w*.1,v+h*.42,w*.22,.5,'#a9cbe0');face(g,side,u+w*.6,v+h*.2,w*.14,.5,'#86b0d0')}}
// bugambilia: racimos que cuelgan desde arriba por una cara
function bugam(g,side,u,v0,n){const C=['#c2185b','#e04f9a','#d63384','#f06bb0'];for(let k=0;k<n;k++){const j=hR(SEED,k*3+u*9),[x,y]=fpt(g,side,Math.max(.01,Math.min(.99,u+(j-.5)*.09)),v0-k*1.1);circ(x,y,.8+j*.6,k%4===3?'#3f8f4a':C[k%4])}}
function rejas(g,side,u,v,w,h,col){for(let q=1;q<4;q++)face(g,side,u+q*w/4-.006,v,.012,h,col);face(g,side,u,v+h*.5,w,.25,col)}
function tendedero(gx,gy,R,a,b,n,cols){const A=P(gx+a[0],gy+a[1]),B=P(gx+b[0],gy+b[1]);for(const q of [A,B])px(q[0]-.25,q[1]-R-5.5,.5,5.5,'#6e6e6e');line(A[0],A[1]-R-5,B[0],B[1]-R-5,'#8a8a8a');
  for(let q=0;q<n;q++){const f2=(q+.5)/n;px(A[0]+(B[0]-A[0])*f2-.6,A[1]+(B[1]-A[1])*f2-R-5,1.4,2.4-(q%2)*.7,cols[q%cols.length])}}
function foquitos(a,b,h,n,sag){for(const q of [a,b])px(q[0]-.25,q[1]-h,.6,h,'#4a4a4a');bulbsH([a[0],a[1]-h],[b[0],b[1]-h],n,sag)}
function tanqueMadera(fx,fy,lift){const [x,y]=P(fx,fy),b=y-lift;for(const dx of [-2.3,2.3])px(x+dx-.3,b-4,.6,4,'#3a2a1e');px(x-.3,b-3.2,.6,3.2,'#2a1e14');line(x-2.3,b-1,x+2.3,b-3.6,'#3a2a1e');
  const t=b-4;px(x-3,t-6.5,6,6.5,'#9a6a3c');px(x-3,t-6.5,1.6,6.5,'#b9844f');px(x+1.7,t-6.5,1.3,6.5,'#7a5230');for(const v of [1.4,3.5,5.6])px(x-3,t-v,6,.5,'#3a2a1e');
  poly([[x-3.6,t-6.4],[x+3.6,t-6.4],[x,t-10]],'#6a5a48');poly([[x,t-10],[x+3.6,t-6.4],[x+.6,t-6.4]],'#54473a');px(x-.25,t-11,.5,1.2,'#3a2a1e')}

// Casas de la Ribera: cada edificio de un solo color (seis colores en el barrio, uno por edificio), zócalo, molduras blancas,
// postigos y balconcitos de herrería; arriba tinacos, tendedero y un remate
const CASAS=[['#e8a33d','#2f6f5e'],['#d8664a','#2f5d8a'],['#e57d8e','#2f6f5e'],['#5aa9a0','#7a3b2a'],['#7f9fd6','#7a3b2a'],['#a3c77c','#7a3b2a']];
function ribCasas(t,gx,gy,f,LVL,s){const FH=7,ins=.15,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const pal=CASAS[s%CASAS.length],fade=c=>LVL===1?hexShade(c,.3):c,A=fade(pal[0]),C=hexShade(A,-.15),sh=pal[1],W='#f7f1e3',WR='#ddd6c6',can='#e2cfa8',canR='#c8b38c';
  const g=box(x0,y0,x1,y1,0,H,'#bdb7ab',A,C);
  // planta baja
  if(LVL===4){face(g,'L',0,0,1,FH,can);face(g,'R',0,0,1,FH,canR);for(const u of [.05,.29,.53,.77])arcoW(g,'L',u,0,.18,FH-2,'#d6c19a',u<.5?'#6a4a32':'#3d5f7a',null);
    for(const u of [.12,.56])arcoW(g,'R',u,0,.3,FH-2,'#bda67f','#5a3f2a',null);face(g,'L',0,FH-.6,1,.6,'#cdb88f');face(g,'R',0,FH-.6,1,.6,'#b39e78')}
  else{for(const [sd,c] of [['L',A],['R',C]])face(g,sd,0,0,1,1.3,hexShade(c,-.32));
    // tiendita (cortina en N1; abierta con toldo después)
    if(LVL===1){face(g,'L',.05,0,.36,FH-2.2,'#9ea3aa');for(let v=.6;v<FH-2.4;v+=.7)face(g,'L',.05,v,.36,.2,'#7f848c')}
    else{face(g,'L',.05,0,.36,FH-2.2,'#3a2a1e');win(g,'L',.07,.5,.32,FH-3,'#9fc4dc');const ga=prot(SD.L,.04,.42,.07,FH-2.6,.9,sh,sh);for(let q=1;q<7;q+=2)face(ga,'L',q/7,0,1/7,.9,W,NIGHT>.3)}
    face(g,'L',.05,FH-1.7,.36,1.3,W);for(let k=0;k<5;k++)face(g,'L',.09+k*.065,FH-1.4,.04,.7,sh);
    // puerta de madera y ventana con reja
    face(g,'L',.56,0,.13,FH-2.4,'#6b4226');face(g,'L',.565,FH-2.4,.12,.4,W);winF(g,'L',.76,1.6,.16,FH-4,W,'#2f5079',W);rejas(g,'L',.76,1.6,.16,FH-4,'#2b2b2b');
    // derecha: zaguán y ventana
    face(g,'R',.1,0,.34,FH-1.9,'#5a3a24');face(g,'R',.27,0,.012,FH-1.9,'#3a2414');face(g,'R',.08,FH-1.9,.38,.5,WR);winF(g,'R',.6,1.6,.22,FH-4,WR,'#2b4b75',WR);if(LVL===1)rejas(g,'R',.6,1.6,.22,FH-4,'#2b2b2b')}
  // pisos
  const fr=LVL===4?can:W;
  for(let fl=1;fl<f;fl++){const v=fl*FH,wv=v+1.6,wh=FH-3.3;
    if(LVL>=2){face(g,'L',0,v-.35,1,.7,LVL===4?can:W);face(g,'R',0,v-.35,1,.7,LVL===4?canR:WR)}else{face(g,'L',0,v-.2,1,.4,hexShade(A,-.12));face(g,'R',0,v-.2,1,.4,hexShade(C,-.12))}
    const wins=[['L',.14,A],['L',.64,A],['R',.16,C],['R',.6,C]];
    wins.forEach(([sd,u,c],ci)=>{const w=sd==='L'?.2:.22,frc=LVL===1?hexShade(c,.25):sd==='R'?(LVL===4?canR:WR):fr;
      const door=LVL>=2&&sd==='R'&&ci===3&&fl%2===1;
      if(door){winF(g,sd,u,v+.5,w,FH-2.2,frc,'#2b4b75',frc)}else winF(g,sd,u,wv,w,wh,frc,'#2f5079',frc);
      if(LVL===1)rejas(g,sd,u,wv,w,wh,'#2b2b2b');
      else{face(g,sd,u-.055,wv-.3,.045,wh+.6,sh);face(g,sd,u+w+.01,wv-.3,.045,wh+.6,sh)}
      if(door||(LVL>=3&&(fl+ci)%2===0)||(LVL===4&&sd==='L')){const S=SD[sd],y0b=door?v+.2:wv-1.1;prot(S,u-.05,u+w+.05,.07,y0b,.4,sd==='L'?(LVL===4?can:W):(LVL===4?canR:WR));rail(S,u-.05,u+w+.05,.07,y0b+.4,'bars','#2b2b2b');
        const gg=protGeo(S,u-.05,u+w+.05,.07,y0b+.45);for(const q of [.12,.62]){face(gg,sd,q,1.9,.26,.9,'#3f8f4a');face(gg,sd,q+.08,2.6,.1,.6,['#e04f9a','#f2c45a','#e85d4a'][(fl+ci)%3])}}
      else if(LVL>=2&&hR(s,fl*7+ci)<.45){face(g,sd,u+.05,wv-.5,.1,.8,'#b5653a');face(g,sd,u+.04,wv+.3,.12,.7,'#3f8f4a');face(g,sd,u+.08,wv+.8,.04,.4,'#e04f9a')}
      if(LVL===1&&ci===2&&hR(s,fl)<.4)minisplit(g,'R',u+.02,wv-2.4)});}
  // pretil con remate y azotea
  const PH=1.4,gp=box(x0,y0,x1,y1,H,PH,'#bdb7ab',A,C);
  if(LVL>=2){face(gp,'L',0,PH-.6,1,.6,LVL===4?can:W);face(gp,'R',0,PH-.6,1,.6,LVL===4?canR:WR);
    fpoly(g,'L',[[.3,H+PH],[.7,H+PH],[.7,H+PH+1.2],[.58,H+PH+2.1],[.5,H+PH+2.6],[.42,H+PH+2.1],[.3,H+PH+1.2]],A);fpoly(g,'L',[[.3,H+PH+1],[.7,H+PH+1],[.7,H+PH+1.4],[.58,H+PH+2.3],[.5,H+PH+2.9],[.42,H+PH+2.3],[.3,H+PH+1.4]],LVL===4?can:W)}
  const R=H+PH;topFace(x0+.04,y0+.04,x1-.04,y1-.04,R,'#aaa396');
  if(LVL===1){for(const [a,b] of [[.19,.19],[.81,.19],[.19,.81],[.81,.81],[.5,.81]]){const [x,y]=P(gx+a,gy+b);px(x-.25,y-R-3.5,.5,3.5,'#6a5a4a');px(x+.4,y-R-3,.4,3,'#6a5a4a')}
    tinaco(gx+.58,gy+.34,R,'#1f1f1f');tendedero(gx,gy,R,[.27,.62],[.52,.78],5,['#f4f4f4','#d62828','#3a6ea5','#f2c94c'])}
  else if(LVL===2){tinaco(gx+.36,gy+.34,R,'#1f1f1f');tinaco(gx+.58,gy+.3,R,'#1f1f1f');tendedero(gx,gy,R,[.3,.66],[.7,.78],7,['#f4f4f4','#e57d8e','#5aa9a0','#f1c45a']);lifted(R,()=>planter(gx+.76,gy+.36,.3))}
  else if(LVL===3){topFace(x0+.06,y0+.06,gx+.6,gy+.62,R+.1,'#b5653a');for(let q=1;q<8;q++){const a=P(x0+.06+q*.055,y0+.06),b=P(x0+.06+q*.055,gy+.62);line(a[0],a[1]-R-.1,b[0],b[1]-R-.1,'#9a5530')}
    lifted(R,()=>{for(const [a,b] of [[.24,.24],[.24,.58],[.58,.24],[.58,.58]]){const [x,y]=P(gx+a,gy+b);px(x-.3,y-6.5,.7,6.5,'#7a4e2c')}
      for(let q=0;q<5;q++){const a=P(gx+.24+q*.085,gy+.22),b=P(gx+.24+q*.085,gy+.6);line(a[0],a[1]-6.6,b[0],b[1]-6.6,'#8a5a30')}
      chairH(gx+.4,gy+.34,'#2f6f5e');tableH(gx+.46,gy+.44,'#f7f1e3','#555');planter(gx+.76,gy+.3,.32)});tinaco(gx+.74,gy+.66,R,'#1f1f1f');
    {const a=P(x0+.03,y1-.03),b=P(x1-.03,y1-.03);foquitos([a[0],a[1]-R],[b[0],b[1]-R],4.5,6,1.3)}bugam(g,'L',.97,H+PH-.3,9)}
  else{topFace(x0+.06,y0+.06,x1-.06,y1-.06,R+.1,'#6f9a52');lifted(R,()=>{cb(gx+.24,gy+.24,gx+.44,gy+.44,0,1.6,'#b5653a');umbH(gx+.66,gy+.62,'#2f6f5e',4.5,'#24574a');planter(gx+.72,gy+.3,.3)});
    lifted(R+.1,()=>{planter(gx+.3,gy+.3,.4);const fx=gx+.3,fy=gy+.6,[x,y]=P(fx,fy);cb(fx-.09,fy-.07,fx+.09,fy+.07,0,2,'#b5653a');for(const [dx,dy,r,c] of [[-1.6,-3.4,1.8,'#3f8f4a'],[1.4,-3.6,1.8,'#3f8f4a'],[0,-4.4,2,'#7b5bb5'],[-1.8,-4.6,1.2,'#9a7ad6'],[1.8,-4.8,1.2,'#b39be6'],[.4,-5.6,1,'#c9b6f0']])circ(x+dx,y+dy,r,c)})
    {const a=P(x0+.03,y1-.03),b=P(x1-.03,y1-.03);foquitos([a[0],a[1]-R],[b[0],b[1]-R],4.5,7,1.4)}bugam(g,'L',.97,H+PH-.3,11);bugam(g,'R',.04,H+PH-.3,8)}}

// Bodegas del río: ladrillo cálido, ventanales de arco con herrería (verde agua desde N2), letrero pintado de la fábrica,
// tanque de agua de madera; del lado ciego, un anuncio viejo que se vuelve mural del Cerro de la Silla
const BOD=['#c0603f','#b04e36','#c46a48'];
function ribBodega(t,gx,gy,f,LVL,s){const FH=7,ins=.12,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const bw=BOD[s%3],bR=hexShade(bw,-.2),fr=LVL===1?'#2b2b2b':LVL===4?'#1c1c1c':'#2f7f78',dov=hexShade(bw,.16),dovR=hexShade(bR,.14),g=box(x0,y0,x1,y1,0,H,'#9a8f80',bw,bR);
  for(let v=1.6;v<H-.5;v+=1.6){face(g,'L',0,v,1,.4,hexShade(bw,-.07));face(g,'R',0,v,1,.4,hexShade(bR,-.07))}
  for(let fl=1;fl<f;fl++){face(g,'L',0,fl*FH-.2,1,.7,hexShade(bw,-.18));face(g,'R',0,fl*FH-.2,1,.7,hexShade(bR,-.18))}
  for(const u of [0,.48,.96])face(g,'L',u,FH,.04,H-FH,hexShade(bw,.07));
  // planta baja
  if(LVL===1){face(g,'L',.07,0,.44,FH-1.4,'#8f949b');for(let v=.6;v<FH-1.6;v+=.7)face(g,'L',.07,v,.44,.2,'#73787f');prot(SD.L,.04,.54,.1,FH-1.2,.5,'#5a5f6b');
    face(g,'L',.63,0,.14,FH-2.2,'#3a3d45');arcoW(g,'L',.82,1.4,.1,FH-3.4,fr,'#3d6a8a',null)}
  else if(LVL===4){face(g,'L',.04,0,.92,FH-.8,'#1c1c1c');win(g,'L',.07,.4,.86,FH-2,'#5d7f96');for(const u of [.3,.5,.7])face(g,'L',u,.4,.015,FH-2,'#1c1c1c');face(g,'L',.06,FH-1.6,.88,1,'#1c1c1c');face(g,'L',.1,FH-1.4,.5,.5,'#c9a227',NIGHT>.2)}
  else{arcoW(g,'L',.07,0,.38,FH-1.4,fr,'#8fbcd6',fr,dov);arcoW(g,'L',.55,0,.38,FH-1.4,fr,'#8fbcd6',fr,dov)}
  arcoW(g,'R',.62,0,.26,FH-1.6,fr,'#33607f',fr,dovR);face(g,'R',.12,0,.3,FH-1.8,'#3a3d45');
  // pisos: dos ventanales de arco por piso en la izquierda, uno en la derecha (el resto de la derecha es muro ciego)
  for(let fl=1;fl<f;fl++){const v=fl*FH+1.3,h=FH-2.5;
    for(const u of [.08,.56]){arcoW(g,'L',u,v,.34,h,fr,'#3d6a8a',fr,dov);
      if(LVL>=3){const y0b=v-1.1;prot(SD.L,u-.03,u+.37,.07,y0b,.45,'#1f1f1f');rail(SD.L,u-.03,u+.37,.07,y0b+.45,'bars',LVL===3?'#2f7f78':'#1f1f1f');
        if(LVL===4){const gg=protGeo(SD.L,u-.03,u+.37,.07,y0b+.45);for(const q of [.08,.55])face(gg,'L',q,-1.2,.1,3.4,q<.5?'#3f8f4a':'#59b04f');for(const q of [.3,.78])face(gg,'L',q,1.8,.14,.8,'#3f8f4a')}}}
    arcoW(g,'R',.64,v,.24,h,fr,'#33607f',fr,dovR)}
  // muro ciego: anuncio viejo (N1) o mural del Cerro de la Silla al atardecer (N2+)
  {const u0=.06,u1=.54,v0=FH+.8,v1=Math.max(v0+8,Math.min(H-4,FH*4.4)),sh_=c=>hexShade(c,-.12);
    if(LVL===1){fpoly(g,'R',[[u0,v0+2],[u1,v0+2],[u1,v1-2],[u0,v1-2]],'#d9b99a');face(g,'R',u0+.04,v1-5,u1-u0-.08,1.6,'#a8452c');for(let k=0;k<5;k++)face(g,'R',u0+.06+k*.08,v0+4,.05,2,'#8a5a40')}
    else{const n=6,C=['#f6cf6a','#f2a65a','#e57d8e','#a36bb0','#5a5aa0','#38407a'];for(let k=0;k<n;k++)fpoly(g,'R',[[u0,v0+(v1-v0)*k/n],[u1,v0+(v1-v0)*k/n],[u1,v0+(v1-v0)*(k+1)/n],[u0,v0+(v1-v0)*(k+1)/n]],sh_(C[k]));
      const hz=v0+2.2,m=(v1-v0)*.55,sx=u0+(u1-u0)*.62,sv=hz+m*.75;fpoly(g,'R',Array.from({length:10},(_,k)=>{const q=k/9*Math.PI;return [sx+.07*Math.cos(q),hz+m*.35+2.6*Math.sin(q)]}),'#ffe9a0');
      const M=[[0,0],[.06,.25],[.16,.62],[.23,.95],[.29,.72],[.33,.8],[.38,.6],[.5,.38],[.68,.22],[.85,.12],[1,.06],[1,0]];fpoly(g,'R',M.map(([a,b])=>[u0+(u1-u0)*a,hz+m*b]),sh_('#2f5d6a'));
      fpoly(g,'R',[[u0+(u1-u0)*.16,hz+m*.62],[u0+(u1-u0)*.23,hz+m*.95],[u0+(u1-u0)*.26,hz+m*.8],[u0+(u1-u0)*.2,hz+m*.55]],sh_('#46808c'));
      fpoly(g,'R',[[u0,v0],[u1,v0],[u1,hz],[u0,hz]],sh_('#4f9fd0'));for(let k=0;k<3;k++)face(g,'R',u0+.05+k*.15,v0+.8,.07,.4,'#e8f4fb');
      face(g,'R',u0-.015,v0-.4,u1-u0+.03,.4,'#efe3c8');face(g,'R',u0-.015,v1,u1-u0+.03,.4,'#efe3c8')}}
  // letrero pintado de la fábrica en lo alto
  {const v=H-3.2,c=LVL===1?'#e6d5b4':'#f2e8d2';face(g,'L',.06,v,.88,2.4,c);for(let k=0;k<7;k++)face(g,'L',.12+k*.11,v+.6,.07,1.2,LVL===1?hexShade(bw,-.1):LVL===4?'#1c1c1c':'#2f7f78')}
  // cornisa de ladrillo y azotea
  const gc=box(x0-.015,y0-.015,x1+.015,y1+.015,H,1.2,'#8f877a',hexShade(bw,.08),hexShade(bR,.08));face(gc,'L',0,0,1,.4,hexShade(bw,-.2));face(gc,'R',0,0,1,.4,hexShade(bR,-.2));
  const R=H+1.2;topFace(x0+.05,y0+.05,x1-.05,y1-.05,R,LVL===4?'#6f9a52':'#948b7c');
  if(LVL===3){for(const [a,b] of [[.3,.3],[.3,.6]])pyramid(gx+a-.08,gy+b-.08,gx+a+.08,gy+b+.08,R,2.6,'#9fd0ee','#7fb7d6');{const a=P(x0+.04,y1-.04),b=P(x1-.04,y1-.04);foquitos([a[0],a[1]-R],[b[0],b[1]-R],4,7,1.3)}}
  if(LVL===4){lifted(R,()=>{planter(gx+.3,gy+.3,.36);planter(gx+.32,gy+.66,.3);umbH(gx+.56,gy+.7,'#2f7f78',4.5,'#24635d')});{const a=P(x0+.04,y1-.04),b=P(x1-.04,y1-.04);foquitos([a[0],a[1]-R],[b[0],b[1]-R],4,8,1.4)}}
  if(LVL<=2)cb(gx+.26,gy+.26,gx+.44,gy+.44,R,3,'#a8a196');
  tanqueMadera(gx+.68,gy+.32,R)}

// Torre Malecón: blanca, con balcones corridos parejos de un lado y muro de vidrio del otro; franja verde agua en la esquina
// y, arriba, la «vela»: una aleta blanca que se ve desde todo el río
function ribTorre(t,gx,gy,f,LVL){const FH=6,ins=.17,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const W='#f4f3ef',WR='#dad7cf',TQ='#2a9d8f',gl=LVL===1?'#35607f':'#3a86ad',glR=hexShade(gl,-.12),g=box(x0,y0,x1,y1,0,H,'#c9c5bd',W,WR),L2=FH*2;
  // vestíbulo de doble altura con marquesina
  face(g,'L',0,0,1,L2,'#3a4048');win(g,'L',.05,.5,.9,L2-2,'#8fc4e6');for(const u of [.28,.5,.72])face(g,'L',u,.5,.015,L2-2,'#2a3038');face(g,'L',.05,FH,.9,.3,'#2a3038');
  prot(SD.L,.18,.82,.12,FH+.6,.6,W);face(g,'R',0,0,1,L2,'#323840');face(g,'R',.56,0,.32,FH-.8,'#1f242a');win(g,'R',.08,1,.38,L2-3,'#6fa3c7');
  for(let fl=2;fl<f;fl++){const v=fl*FH;
    // izquierda: ventanas recortadas (N1) o muro de vidrio con antepechos blancos (N2+)
    if(LVL===1){for(const u of [.08,.38,.68]){face(g,'L',u-.02,v+.7,.28,FH-2.2,'#e4e2dc');win(g,'L',u,v+1,.24,FH-2.8,gl)}}
    else{const crown=LVL>=3&&fl>=f-3;for(const [u,w] of [[.03,.31],[.35,.3],[.66,.31]])win(g,'L',u,v+(crown?0:.9),w,FH-(crown?0:1.4),gl);face(g,'L',.34,v,.012,FH,W);face(g,'L',.65,v,.012,FH,W);if(!crown)face(g,'L',0,v,1,.9,W);else face(g,'L',0,v,1,.3,hexShade(gl,-.3))}
    // derecha: puertas corredizas detrás de balcones corridos, todos del mismo fondo
    win(g,'R',.05,v+.6,.43,FH-1.8,glR);win(g,'R',.52,v+.6,.43,FH-1.8,glR);
    prot(SD.R,0,1,.075,v-.55,.6,W);rail(SD.R,0,1,.075,v+.05,LVL===1?'bars':'glass',LVL===1?'#e4e2dc':'#ffffff')}
  if(LVL>=2){face(g,'L',.955,L2,.045,H-L2,TQ);face(g,'R',0,L2,.04,H-L2,hexShade(TQ,-.15))}
  // remate
  const gc=box(x0-.02,y0-.02,x1+.02,y1+.02,H,1.6,'#c9c5bd',W,WR);if(LVL>=2){face(gc,'L',0,0,1,.5,TQ);face(gc,'R',0,0,1,.5,hexShade(TQ,-.15))}
  const R=H+1.6;topFace(x0+.05,y0+.05,x1-.05,y1-.05,R,'#bdb9b1');
  if(LVL<=2){const gm=box(gx+.26,gy+.26,gx+.48,gy+.5,R,3.6,'#d8d4cc','#e8e6e0','#cfccc4');face(gm,'R',.3,0,.35,2.6,'#5a5f6b');tinaco(gx+.66,gy+.62,R,'#f0f0ee');tinaco(gx+.7,gy+.36,R,'#f0f0ee')}
  else{ // la vela: aleta blanca con canto verde agua, en el plano de la cara derecha
    if(LVL===4){topFace(x0+.08,y0+.08,gx+.56,gy+.6,R+.1,'#2b8fd0');topFace(x0+.1,y0+.1,gx+.54,gy+.58,R+.2,'#5fc0f0');lifted(R,()=>{palm(gx+.3,gy+.68,8);umbH(gx+.24,gy+.42,'#ffffff',4,'#e4e2dc')});
      {const [a,b]=P(gx+.34,gy+.34);if(!(NIGHT>.2)){px(a-2,b-R-.6,3,.5,'#bfe9ff');px(a+1,b-R+.8,2,.5,'#bfe9ff')}else glow(a,b-R,9,.5,'#7fd0ff')}}
    const hv=LVL===4?22:17,b0=H+1.6,S=[[.16,b0],[1,b0],[1,b0+hv]];for(let k=9;k>=1;k--){const q=k/10;S.push([.16+.84*q,b0+hv*Math.pow(q,.5)])}
    lifted(.6,()=>{cam.ox-=.9;fpoly(g,'R',S,hexShade(TQ,-.1));cam.ox+=.9});fpoly(g,'R',S.map(([u,v])=>[u,v+.8]),TQ);fpoly(g,'R',S,W);for(let k=1;k<5;k++){const u=.16+k*.17,top=b0+hv*Math.pow((u-.16)/.84,.5);fpoly(g,'R',[[u,b0],[u+.018,b0],[u+.018,top-.6],[u,top-.6]],'#e2e0da')}
    const [tx,ty]=fpt(g,'R',1,H+1.6+hv+1);px(tx-.5,ty-.5,1,1,NIGHT>.2?'#ff3b30':'#b33',NIGHT>.2);if(NIGHT>.2){glow(tx,ty,5,.8,'#ff3b30');for(let k=0;k<5;k++){const [lx,ly]=fpt(g,'R',.5+k*.12,H+2.5+hv*(.1+k*.18));glow(lx,ly,4,.45,'#9fe8ff')}}}}

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
