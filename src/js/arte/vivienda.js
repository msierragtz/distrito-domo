/* ---------- vivienda: arquitectura con volumen ---------- */
function geo(x0,y0,x1,y1,lift){const o=orient([P(x0,y0),P(x1,y0),P(x1,y1),P(x0,y1)]);return{T:o.T,R:o.R,B:o.B,L:o.L,lift}}
function sidesOf(x0,y0,x1,y1){const C=[[x0,y0],[x1,y0],[x1,y1],[x0,y1]],S=C.map(([a,b])=>P(a,b));let iB=0,iR=0,iL=0;
  S.forEach((p,i)=>{if(p[1]>S[iB][1])iB=i;if(p[0]>S[iR][0])iR=i;if(p[0]<S[iL][0])iL=i});const cx=(x0+x1)/2,cy=(y0+y1)/2;
  const mk=(a,b)=>{const A=C[a],B=C[b],mx=(A[0]+B[0])/2-cx,my=(A[1]+B[1])/2-cy;return{a:A,b:B,n:Math.abs(mx)>Math.abs(my)?[Math.sign(mx),0]:[0,Math.sign(my)]}};
  return{L:mk(iL,iB),R:mk(iB,iR)}}
function protRect(sd,u0,u1,d0,d1){const A=sd.a,B=sd.b,pt=(u,d)=>[A[0]+(B[0]-A[0])*u+sd.n[0]*d,A[1]+(B[1]-A[1])*u+sd.n[1]*d];
  const q=[pt(u0,d0),pt(u1,d0),pt(u0,d1),pt(u1,d1)];return[Math.min(...q.map(p=>p[0])),Math.min(...q.map(p=>p[1])),Math.max(...q.map(p=>p[0])),Math.max(...q.map(p=>p[1]))]}
function prot(sd,u0,u1,d,lift,h,col,top){const r=protRect(sd,u0,u1,0,d);return box(r[0],r[1],r[2],r[3],lift,h,top||hexShade(col,.18),col,hexShade(col,-.2))}
function protGeo(sd,u0,u1,d,lift){const r=protRect(sd,u0,u1,0,d);return geo(r[0],r[1],r[2],r[3],lift)}
/* ventana con marco, vidrio con reflejo y repisa */
function winF(g,side,u,v,w,h,frame,glass,sill){face(g,side,u-.015,v-.5,w+.03,h+1,frame);win(g,side,u,v,w,h,glass||'#2f5079');
  if(!(NIGHT>.2)){face(g,side,u,v+h-.5,w*.45,.5,'#7fa6c9');face(g,side,u+w*.6,v+h-1,w*.2,.5,'#5d84ad')}
  face(g,side,u-.03,v-1,w+.06,.5,sill||'#f4f2ec')}
/* barandal: barrotes, vidrio o herrería */
function rail(sd,u0,u1,d,lift,kind,col){const g=protGeo(sd,u0,u1,d,lift),side=sd===undefined?'R':sd.__s,other=side==='R'?'L':'R';
  if(kind==='glass'){face(g,side,0,0,1,2,'rgba(190,230,255,.5)',true);face(g,other,0,0,1,2,'rgba(190,230,255,.5)',true);face(g,side,0,2,1,.5,col);face(g,other,0,2,1,.5,col);return}
  const n=Math.max(4,Math.round((u1-u0)*22));for(let k=0;k<=n;k++)face(g,side,k/n-.006,0,.012,2,col);face(g,side,0,2,1,.5,col);face(g,other,0,2,1,.5,col);face(g,other,.5,0,.1,2,col)}
function tinaco(fx,fy,lift,col){const [x,y]=P(fx,fy);const c2=hexShade(col,.25);px(x-2,y-lift-5,4,5,col);px(x-2,y-lift-5,1,5,c2);px(x-2,y-lift-5.5,4,.5,hexShade(col,-.2));px(x-1,y-lift-6,2,.5,hexShade(col,-.2))}
function minisplit(g,side,u,v){face(g,side,u,v,.13,1.5,'#eef0f2');face(g,side,u+.02,v+.3,.09,.4,'#9aa0a8');face(g,side,u,v-.5,.13,.5,'rgba(0,0,0,.15)',true)}

function drawHousing(t,gx,gy,ic){
  const s=t.s,k=t.k,tw=k==='torre',lad=k==='ladrillo',LVL=ic?1:lvOf(t),f=ic?(tw?6:lad?4:3):t.f,FH=tw?6:7;
  const hh=q=>Math.abs(Math.sin(SEED*3.17+q*12.71)*9137.13)%1;
  if(tw)return drawTower(t,gx,gy,f,FH,LVL,hh);
  const ins=lad?.12:.15,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1;
  const pal=lad?LAD[s%LAD.length]:EDI[s%EDI.length];
  const wall=lad?(LVL>=2?hexShade(pal.w,.05):pal.w):[pal.w,'#e9e4d8',['#e8a87c','#9ec5ab','#f2d58a','#b9cde0'][s%4],'#cfcac2','#f1ece2'][LVL];
  const SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const g=box(x0,y0,x1,y1,0,H,'#bdb7ab',wall,hexShade(wall,-.17));
  if(!ic&&LVL===3)corona(x0,y0,x1,y1,H,LVL);
  // ladrillo: hiladas y franjas de concreto
  if(lad){for(let v=FH+1;v<H-.5;v+=1.5){face(g,'L',0,v,1,.5,hexShade(pal.w,-.08));face(g,'R',0,v,1,.5,hexShade(pal.w,-.24))}
    for(let fl=1;fl<f;fl++){const v=fl*FH;face(g,'L',0,v-.5,1,1.5,'#e8e2d6');face(g,'R',0,v-.5,1,1.5,'#cfc8ba')}}
  // luz: un poco más oscuro abajo, más claro arriba
  face(g,'L',0,FH,1,1,'rgba(0,0,0,.08)',true);face(g,'R',0,FH,1,1,'rgba(0,0,0,.1)',true);
  // planta baja
  const sb=lad&&LVL===4?'#1f4d3a':pal.b;
  face(g,'L',0,0,1,FH,sb);face(g,'R',0,0,1,FH,hexShade(sb,-.15));
  win(g,'L',.06,.5,.88,FH-3,'#6fa3c7');for(const u of [.3,.5,.7])face(g,'L',u,.5,.015,FH-3,hexShade(sb,-.35));
  if(!(NIGHT>.2))face(g,'L',.06,FH-3,.4,.5,'#a9cbe0');
  win(g,'R',.06,.5,.42,FH-3,'#5d92b8');face(g,'R',.6,0,.3,FH-1.5,'#2e2f36');face(g,'R',.64,0,.22,FH-2,'#45464f');
  {const aw=lad&&LVL===4?'#1f4d3a':LVL===4?'#2b2b2b':['#f26a21','#2a9d8f','#d62828','#3a6ea5'][s%4],ga=prot(SD.L,.02,.98,.08,FH-2.6,1,aw,aw);
    for(let q=0;q<14;q++)if(q%2)face(ga,'L',q/14,0,1/14,1,'#ffffff',NIGHT>.3);}
  {const gc=prot(SD.R,.56,.94,.07,FH-1.2,.6,LVL===4?lvCol():'#5a5f6b');}
  if(lad&&LVL===4){face(g,'R',.06,FH-1.6,.44,1,'#1f4d3a');face(g,'R',.1,FH-1.4,.36,.5,lvCol(),NIGHT>.2)}
  // pisos
  const big=LVL===3,cols=big?[.07,.55]:lad?[.08,.3,.58,.8]:[.07,.36,.65],ww=big?.36:lad?.14:.22,fr=big||lad&&LVL===3?'#1c1c1c':lad?(LVL===2?'#f4f2ec':'#e2d6c4'):LVL===2?'#ffffff':'#e8e4dc';
  const bal=!lad,railK=LVL===4?'glass':'bars',railC=LVL===4?lvCol():LVL===2?'#ffffff':LVL===3?'#1c1c1c':'#3a3a3a';
  for(let fl=1;fl<f;fl++){const v=fl*FH+1.5,wh=FH-3.2;
    // cara izquierda: ventanas
    for(let ci=0;ci<cols.length;ci++){const u=cols[ci];winF(g,'L',u,v,ww,wh,fr,'#2f5079',lad?'#e8e2d6':undefined);
      if(big){face(g,'L',u+ww/2-.006,v,.012,wh,'#1c1c1c');face(g,'L',u,v+wh/2,ww,.25,'#1c1c1c')}
      if(LVL<=2&&!big&&hh(fl*11+ci)<.13)minisplit(g,'L',u+.02,v-2.6)}
    if(!lad&&!big)for(const u of [.3,.59])face(g,'L',u,v-1.5,.05,FH,LVL===4?'#a0693f':hexShade(wall,-.06));
    // cara derecha
    if(bal){ // balcón corrido que sale del edificio
      for(const u of [.1,.54]){winF(g,'R',u,v-.8,.34,FH-2.4,big?'#1c1c1c':fr,'#2b4b75',hexShade(wall,-.25));face(g,'R',u+.17,v-.8,.012,FH-2.4,big?'#1c1c1c':fr)}
      face(g,'R',.04,v-1.5,.92,.8,'rgba(0,0,0,.22)',true);
      const slabC=LVL===4?'#f4f2ec':LVL===3?'#9a958c':'#e4e0d8';prot(SD.R,.03,.97,.09,v-1.8,1,slabC,LVL===4?'#a0693f':undefined);
      rail(SD.R,.03,.97,.09,v-.8,railK,railC);
      if(LVL===1&&hh(fl*5+2)<.25){const gg=protGeo(SD.R,.03,.97,.09,v-.8),u=.2+hh(fl*3)*.45;for(let q=0;q<5;q++)face(gg,'R',u+q*.05,.4,.035,1.1+(q%2)*.4,['#d62828','#f4f4f4','#3a6ea5','#f2c94c','#59b04f'][(q+fl)%5],false)}
      if(LVL>=2&&hh(fl*13)<.3){const gg=protGeo(SD.R,.03,.97,.09,v-.8),u=.15+hh(fl)*.6;face(gg,'R',u,1.6,.08,1.2,'#3f9a3c');face(gg,'R',u+.02,2.4,.05,.6,'#59b04f')}}
    else{ // ladrillo: ventanas con balconcito de herrería
      for(let ci=0;ci<cols.length;ci++){const u=cols[ci];winF(g,'R',u,v,ww,wh,fr,'#29476e','#cfc8ba');
        if(big){face(g,'R',u+ww/2-.006,v,.012,wh,'#1c1c1c')}
        else if((ci+fl)%2===0){prot(SD.R,u-.02,u+ww+.02,.05,v-1,.5,'#3a3a3a');rail(SD.R,u-.02,u+ww+.02,.05,v-.5,'bars',LVL===2?'#f4f2ec':'#2b2b2b')}}}
  }
  // escalera de emergencia (lofts industriales)
  if(lad&&LVL===3){for(let fl=1;fl<f;fl++){const v=fl*FH;prot(SD.L,.66,.97,.08,v,.5,'#1f1f1f');rail(SD.L,.66,.97,.08,v+.5,'bars','#1f1f1f');
      if(fl<f-1){const gg=protGeo(SD.L,.66,.97,.08,v+.5),p0=[gg.L[0]+(gg.B[0]-gg.L[0])*(fl%2?.1:.9),gg.L[1]+(gg.B[1]-gg.L[1])*(fl%2?.1:.9)-gg.lift],p1=[gg.L[0]+(gg.B[0]-gg.L[0])*(fl%2?.9:.1),gg.L[1]+(gg.B[1]-gg.L[1])*(fl%2?.9:.1)-gg.lift-FH+.5];line(p0[0],p0[1],p1[0],p1[1],'#1f1f1f')}}}
  // remate y pretil
  const cap=LVL===4?(lad?lvCol():lvCol()):lad?'#e8e2d6':LVL===2?'#ffffff':'#d8d3c9';
  box(x0-.01,y0-.01,x1+.01,y1+.01,H,1.2,cap,cap,hexShade(cap,-.18));topFace(x0+.04,y0+.04,x1-.04,y1-.04,H+1.2,lad?'#9a8f80':'#a8a296');
  const R=H+1.2;
  // azotea
  if(LVL===4&&!lad){topFace(x0+.08,y0+.08,gx+.6,gy+.62,R+.1,'#3f8fc4');topFace(x0+.1,y0+.1,gx+.58,gy+.6,R+.2,'#5fb3e6');
    {const [a,b]=P(gx+.4,gy+.4);if(!(NIGHT>.2)){px(a-2,b-R-.5,3,.5,'#bfe9ff');px(a+1,b-R+1,2,.5,'#bfe9ff')}else glow(a,b-R,10,.5)}
    lifted(R,()=>{for(const [a,b] of [[.74,.3],[.74,.62]])umbH(gx+a,gy+b,'#ffffff',4,'#e4e2dc');cb(gx+.66,gy+.74,gx+.84,gy+.8,0,.6,'#f4f4f4')})}
  else if(lad&&LVL===4){topFace(x0+.06,y0+.06,x1-.06,y1-.06,R+.1,'#a0663a');
    lifted(R,()=>{umbH(gx+.32,gy+.32,'#1f4d3a',5,'#16382a');umbH(gx+.6,gy+.6,'#1f4d3a',5,'#16382a');planter(gx+.76,gy+.26,.38)});
    {const a=P(x0,y1),b=P(x1,y1);bulbsH([a[0],a[1]-R-4],[b[0],b[1]-R-4],8,1.5)}}
  else if(LVL===3){topFace(x0+.08,y0+.08,gx+.62,gy+.62,R+.1,'#a0663a');for(let q=1;q<9;q++){const a=P(x0+.08+q*.05,y0+.08),b=P(x0+.08+q*.05,gy+.62);line(a[0],a[1]-R-.1,b[0],b[1]-R-.1,'#8a5530')}
    lifted(R,()=>{umbH(gx+.4,gy+.4,'#f4efe2',6);planter(gx+.76,gy+.3,.36);planter(gx+.74,gy+.72,.36)})}
  else{ // cuarto de máquinas, tinacos, minisplits, antena
    const gr=box(gx+.22,gy+.22,gx+.42,gy+.42,R,4,'#d8d3c9','#cfc9bd','#b6b0a4');face(gr,'R',.3,0,.35,2.8,'#5a5f6b');
    const tc=LVL===1?'#1f1f1f':'#f0f0ee';tinaco(gx+.56,gy+.62,R,tc);tinaco(gx+.76,gy+.7,R,tc);
    cb(gx+.62,gy+.26,gx+.78,gy+.36,R,1.6,'#e8ecef');
    if(s%3===0){const [ax,ay]=P(gx+.72,gy+.46);px(ax,ay-R-9,.5,9,'#666');px(ax-2,ay-R-7,4.5,.5,'#666');px(ax-1.5,ay-R-5.5,3.5,.5,'#666')}
    if(LVL===1){const A=P(gx+.26,gy+.72),B=P(gx+.46,gy+.84);line(A[0],A[1]-R-5,B[0],B[1]-R-5,'#777');for(let q=0;q<5;q++){const f2=(q+.5)/5;px(A[0]+(B[0]-A[0])*f2-.5,A[1]+(B[1]-A[1])*f2-R-5,1.5,2.5-(q%2)*.5,['#f4f4f4','#d62828','#3a6ea5','#f2c94c','#59b04f'][q])}}
    if(LVL===2)lifted(R,()=>planter(gx+.3,gy+.72,.35))}
}

function drawTower(t,gx,gy,f,FH,LVL,hh){
  const ins=.17,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=f*FH+1;
  // cada torre tiene su remate y su tono según dónde está: dos vecinas nunca son iguales
  const rv=((gx+2*gy)%3+3)%3,tn=((gx+gy)%2+2)%2;
  const stone=tn?['','#e8dfcd','#e6ddcb','#e2dacb','#e8dfcd'][LVL]:['','#f4f3ef','#f2f0ea','#eeece6','#f4f3ef'][LVL],stoneR=hexShade(stone,-.12);
  const setb=LVL>=2,sbF=setb?Math.max(3,Math.floor(f*(LVL===4?.66:.78))):f,Hs=sbF*FH+1,i2=LVL===4?.07:.05;
  const SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const g=box(x0,y0,x1,y1,0,Hs,'#c9c5bd',stone,stoneR);
  const g2=setb?box(x0+i2,y0+i2,x1-i2,y1-i2,Hs,H-Hs,'#c9c5bd',LVL>=3?'#9fc9e2':stone,LVL>=3?'#7fb0cf':stoneR):null;
  const SD2=setb?sidesOf(x0+i2,y0+i2,x1-i2,y1-i2):null;if(SD2){SD2.L.__s='L';SD2.R.__s='R'}
  // planta baja: lobby
  face(g,'L',0,0,1,FH,'#8d877e');face(g,'R',0,0,1,FH,'#78726a');win(g,'L',.06,.5,.88,FH-1.5,'#6fa3c7');win(g,'R',.06,.5,.5,FH-1.5,'#5d92b8');face(g,'R',.64,0,.24,FH-1,'#3d3d46');
  for(const u of [.3,.55,.8])face(g,'L',u,.5,.015,FH-1.5,'#5a554f');
  prot(SD.L,.02,.98,.07,FH-.6,.6,LVL===4?'#a0693f':'#5a554f');prot(SD.R,.02,.98,.07,FH-.6,.6,LVL===4?'#8a5a36':'#4a4640');
  const floorsOf=(gg,a,b,base,glassy)=>{for(let fl=a;fl<b;fl++){const v=fl*FH-base+1.2,wh=FH-2.6;
    for(const side of ['L','R']){
      if(LVL===1){for(const u of [.1,.32,.54,.76])winF(gg,side,u,v,.14,wh,'#e6e3dc','#2f5079','#ffffff')}
      else if(glassy){face(gg,side,0,v-1.2,1,.9,'#f4f3ef');win(gg,side,.02,v,.96,wh+.6,'#4f86b0');for(let q=1;q<8;q++)face(gg,side,q/8,v,.01,wh+.6,'#dfe8ee')}
      else{for(const u of [.08,.56]){winF(gg,side,u,v,.36,wh,'#e6e3dc','#2f5079','#ffffff');for(let q=1;q<4;q++)face(gg,side,u+q*.09,v,.012,wh,'#e6e3dc')}}}}};
  floorsOf(g,1,sbF,0,LVL===3&&false);if(setb)floorsOf(g2,sbF,f,Hs,LVL>=3);
  if(LVL<=2||!setb){for(const [gg,h0,h1] of [[g,FH,Hs]].concat(setb&&LVL<3?[[g2,0,H-Hs]]:[])){face(gg,'L',.94,h0,.06,h1-h0,'#e2dfd8');face(gg,'R',0,h0,.06,h1-h0,'#c9c5bd');if(LVL>=2){face(gg,'L',.465,h0,.07,h1-h0,'#e6e3dc');face(gg,'R',.465,h0,.07,h1-h0,'#cbc7bf')}}}
  if(LVL===1){const bc=['#dcd8d0','#c98a5a','#7f9bb0'][rv];for(let fl=1;fl<f;fl+=3){face(g,'L',0,fl*FH,1,.6,bc);face(g,'R',0,fl*FH,1,.6,hexShade(bc,-.12))}}
  // esquinas de cristal (Plus en adelante)
  if(LVL>=2){face(g,'L',0,FH,.05,Hs-FH,'#8fd3ff',NIGHT>.2);face(g,'R',.95,FH,.05,Hs-FH,'#7cc3ee',NIGHT>.2)}
  // balcones
  if(LVL===2)for(let fl=2;fl<sbF;fl+=2){const v=fl*FH;prot(SD.R,.56,.97,.07,v-.6,.8,'#ffffff');rail(SD.R,.56,.97,.07,v+.2,'bars','#9aa0a8')}
  if(LVL>=3)for(let fl=2;fl<sbF;fl++){const v=fl*FH,side=fl%2?SD.R:SD.L;prot(side,.52,.97,.08,v-.6,.8,LVL===4?'#f4f3ef':'#ffffff',LVL===4?'#a0693f':undefined);rail(side,.52,.97,.08,v+.2,'glass','#c9cdd2')}
  // jardín vertical en la esquina (Sky)
  if(LVL===4){for(const side of ['L','R'])for(let v=FH;v<Hs-1;v+=1.5){const u=side==='L'?.0:.92;face(g,side,u,v,.08,1,(v*2)%3<1?'#3f8f3a':'#59b04f')}}
  // azotea del cuerpo bajo / terraza
  if(setb){topFace(x0+.01,y0+.01,x1-.01,y1-.01,Hs+.05,LVL===4?'#5fa84a':'#c9c5bd');
    if(LVL===4){rail(SD.R,0,1,.01,Hs,'glass','#c9cdd2');rail(SD.L,0,1,.01,Hs,'glass','#c9cdd2');lifted(Hs,()=>{tree(x0+.04,y1-.03,.34);tree(x1-.03,y0+.04,.3);tree(x1-.04,y1-.06,.36)})}}
  const R=H;
  if(LVL<=2&&rv>0){ // terraza con pérgola o azotea jardín
    const ia=LVL>=2?i2:0,X0=x0+ia,Y0=y0+ia,X1=x1-ia,Y1=y1-ia;
    box(X0-.01,Y0-.01,X1+.01,Y1+.01,R,1,'#e6e3dc',stone,stoneR);const R1=R+1;
    if(rv===1){topFace(X0+.04,Y0+.04,X1-.04,Y1-.04,R1+.05,'#a0663a');for(let q=1;q<7;q++){const a=P(X0+.04+q*.08,Y0+.04),b=P(X0+.04+q*.08,Y1-.04);line(a[0],a[1]-R1-.1,b[0],b[1]-R1-.1,'#8a5530')}
      for(const [a,b] of [[.3,.3],[.62,.3],[.3,.6],[.62,.6]])cb(gx+a,gy+b,gx+a+.03,gy+b+.03,R1,4.5,'#6b4226');
      for(let q=0;q<5;q++){const u=.3+q*.08;cb(gx+u,gy+.28,gx+u+.025,gy+.66,R1+4.5,.5,'#7a4a2a')}
      lifted(R1,()=>{planter(gx+.24,gy+.72,.34);planter(gx+.74,gy+.26,.3)});cb(gx+.66,gy+.68,gx+.8,gy+.76,R1,.7,'#f4f4f4')}
    else{topFace(X0+.04,Y0+.04,X1-.04,Y1-.04,R1+.05,'#5fa84a');topFace(X0+.08,Y0+.08,gx+.5,gy+.5,R1+.1,'#4e9a3e');
      lifted(R1,()=>{tree(gx+.34,gy+.36,.34);tree(gx+.64,gy+.62,.3);planter(gx+.72,gy+.3,.3)});
      cb(gx+.24,gy+.66,gx+.36,gy+.78,R1,2.2,'#d8d3c9')}
    return}
  if(LVL===1){ // azotea sencilla: tinacos y antena
    box(x0-.01,y0-.01,x1+.01,y1+.01,R,1,'#e6e3dc','#e6e3dc','#cfccc5');const R1=R+1;
    tinaco(gx+.4,gy+.6,R1,'#f0f0ee');tinaco(gx+.6,gy+.66,R1,'#f0f0ee');cb(gx+.3,gy+.3,gx+.46,gy+.42,R1,1.6,'#e8ecef');
    const [ax,ay]=P(gx+.62,gy+.4);px(ax,ay-R1-10,.5,10,'#666');px(ax-2,ay-R1-8,4.5,.5,'#666');return}
  if(LVL===2){box(x0+i2+.03,y0+i2+.03,x1-i2-.03,y1-i2-.03,R,2,'#e9e7e1','#f4f3ef','#d9d6cf');const R2=R+2;
    box(gx+.38,gy+.38,gx+.62,gy+.62,R2,4,'#d4d0c8','#c9c5bd','#b3aea5');const [ax,ay]=P(gx+.5,gy+.5);px(ax,ay-R2-14,.5,10,'#555');px(ax-.25,ay-R2-14.5,1,1,'#ff3b3b',NIGHT>.2);glow(ax,ay-R2-14,5,.8);return}
  if(LVL===3){ // corona iluminada con aletas
    const gc=box(x0+i2+.02,y0+i2+.02,x1-i2-.02,y1-i2-.02,R,3,'#e9e7e1','#f4f3ef','#d9d6cf');{const cc=['#ffe19a','#bfe9ff','#ffc9a6'][rv];face(gc,'L',0,.8,1,1.4,cc,NIGHT>.2);face(gc,'R',0,.8,1,1.4,hexShade(cc,-.06),NIGHT>.2)}
    const R2=R+3,so=sidesOf(x0+i2+.02,y0+i2+.02,x1-i2-.02,y1-i2-.02);for(const sd of [so.L,so.R])for(const u of [.15,.5,.85]){const r=protRect(sd,u-.02,u+.02,-.04,.02);box(r[0],r[1],r[2],r[3],R2,7,'#ffffff','#f4f3ef','#d9d6cf')}
    const [cx,cy]=P(gx+.5,y1-i2);glow(cx,cy-R-2,16,.8);return}
  // Sky: remate de cristal y helipuerto
  const gc=box(x0+i2+.02,y0+i2+.02,x1-i2-.02,y1-i2-.02,R,4,'#bfe2f2','#9fd0ee','#7fb0cf');face(gc,'L',0,0,1,4,'rgba(255,255,255,.15)',true);
  const R2=R+4;
  if(rv===1){topFace(x0+i2+.03,y0+i2+.03,x1-i2-.03,y1-i2-.03,R2,'#d9d6cf');topFace(x0+i2+.08,y0+i2+.08,gx+.62,gy+.62,R2+.1,'#3f8fc4');topFace(x0+i2+.1,y0+i2+.1,gx+.6,gy+.6,R2+.2,'#5fb3e6');
    lifted(R2,()=>{cb(gx+.68,gy+.28,gx+.84,gy+.34,0,.6,'#f4f4f4');cb(gx+.66,gy+.72,gx+.82,gy+.78,0,.6,'#f4f4f4');planter(gx+.76,gy+.52,.26)});return}
  if(rv===2){topFace(x0+i2+.03,y0+i2+.03,x1-i2-.03,y1-i2-.03,R2,'#5fa84a');lifted(R2,()=>{tree(gx+.38,gy+.4,.32);tree(gx+.62,gy+.62,.28);planter(gx+.7,gy+.32,.28)});return}
  topFace(x0+i2+.03,y0+i2+.03,x1-i2-.03,y1-i2-.03,R2,'#3a3f47');const [hx,hy]=P(gx+.5,gy+.5);
  ellipse(hx,hy-R2,5.5,2.75,'#f2c94c');ellipse(hx,hy-R2,4.5,2.25,'#3a3f47');px(hx-1.5,hy-R2-1,.5,2,'#f4f4f4');px(hx+1,hy-R2-1,.5,2,'#f4f4f4');px(hx-1,hy-R2-.25,2,.5,'#f4f4f4');
  for(const [a,b] of [[.3,.3],[.7,.3],[.3,.7],[.7,.7]]){const [x,y]=P(gx+a,gy+b);px(x,y-R2-.5,.5,.5,NIGHT>.2?'#59cd90':'#3fae5a',true)}
}


