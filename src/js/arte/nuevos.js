/* ===== v72: casa de fraccionamiento, usos mixtos, cicloestación, banco y gasolinera (Domo y Ribera, 4 niveles);
   y en la Ribera, tres especiales de 2×2: parroquia, hotel boutique y alberca pública ===== */
const CASAF_D=['#efe6d4','#e4d2b4','#d9dcd8','#ecd3bd'],CASAF_R=['#e8a33d','#d8664a','#e57d8e','#5aa9a0','#7f9fd6','#a3c77c'];
const DCOL=()=>RIBV?'#2bb3a3':'#f26a21',DCOL2=()=>RIBV?'#f2b632':'#2f5d8a';   // color de marca del distrito
const AUTOC=['#d64545','#f4f4f4','#3a6ea5','#2b2b2b','#9aa0a8','#e0b03b','#6a8f5a'];
// un poste con letrero (tótem): logo simple de bloques
function totem(fx,fy,h,w,bg,draw){const [x,y]=P(fx,fy);px(x-.3,y-h,.8,h,'#5a5f6b');px(x-w/2,y-h-4.5,w,4.5,bg);px(x-w/2,y-h-.5,w,.5,hexShade(bg,-.3));if(draw)draw(x,y-h-4.5)}
// rejas al frente y a la derecha del lote, según el nivel
function rejaLote(gx,gy,L,col){const fr=[[P(gx+.04,gy+.96),P(gx+.96,gy+.96)]];
  for(const e of fr){if(L===1)fenceE(e,3,'#9aa0a8','rgba(160,166,174,.25)',2);else if(L===4){const [a,b]=e;poly([a,b,up(b,2.2),up(a,2.2)],'#f2efe8');line(a[0],a[1]-2.2,b[0],b[1]-2.2,'#d8d3c8');for(let k=1;k<10;k++){const f=k/10;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-4.4,.5,2.2,'#8a5a30')}}
    else fenceE(e,2.6,col||'#33363d',null,2.2)}}
function gasTank(fx,fy,lift){const [x,y]=P(fx,fy),b=y-lift;px(x-2.6,b-2.6,5.2,2.2,'#f4f4f2');ellipse(x-2.6,b-1.5,.8,1.1,'#e4e4e0');ellipse(x+2.6,b-1.5,.8,1.1,'#d8d8d4');px(x-2.2,b-.5,.5,.6,'#777');px(x+1.7,b-.5,.5,.6,'#777');px(x-.4,b-3.3,.8,.7,'#c9a227')}
function solarRoof(x0,y0,x1,y1,lift){topFace(x0,y0,x1,y1,lift+.6,'#23365a');const n=4;for(let k=1;k<n;k++){const a=P(x0+(x1-x0)*k/n,y0),b=P(x0+(x1-x0)*k/n,y1);line(a[0],a[1]-lift-.6,b[0],b[1]-lift-.6,'#5a7bb0')}{const a=P(x0,(y0+y1)/2),b=P(x1,(y0+y1)/2);line(a[0],a[1]-lift-.6,b[0],b[1]-lift-.6,'#5a7bb0')}}

/* ---------- Casa de fraccionamiento: obra gris → pintada con cochera → con terraza → remodelada ---------- */
function artCasaF(t,gx,gy,L,ic){const s=t.s,f=ic?1:Math.max(1,t.f||1),FH=7,PAL=RIBV?CASAF_R:CASAF_D,base=PAL[s%PAL.length],wall=L===1?'#aca79d':L===4?'#f4f2ee':base,wallR=hexShade(wall,-.16),W='#f7f3ea',WR='#ddd8cc';
  quad(gx,gy,.04,.04,.96,.96,L===1?'#b9a688':'#86a85e');quad(gx,gy,.71,.06,.96,.96,L===1?'#a8a196':'#c4beb2');if(L>=2)quad(gx,gy,.32,.66,.46,.96,'#d6cfbf');
  if(L>=2&&!ic)flowers(gx,gy,.06,.7,.3,.9,s);
  const x0=gx+.1,y0=gy+.1,x1=gx+.68,y1=gy+.64,H=f*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const g=box(x0,y0,x1,y1,0,H,'#b0aa9e',wall,wallR);
  if(L===1){for(let v=1.4;v<H;v+=1.4){face(g,'L',0,v,1,.25,hexShade(wall,-.08));face(g,'R',0,v,1,.25,hexShade(wallR,-.08))}}
  else if(L===4){face(g,'L',.06,0,.4,H-1,'#8a5a30');for(let q=0;q<9;q++)face(g,'L',.08+q*.042,.4,.02,H-1.6,'#6e4524');face(g,'R',0,0,1,1,'#cfcac0')}
  else{face(g,'L',0,0,1,1,hexShade(wall,-.3));face(g,'R',0,0,1,1,hexShade(wallR,-.3))}
  // planta baja: puerta y ventana al patio, ventana a la cochera
  const fr=L===1?'#8f8a80':W;
  if(L===4){win(g,'L',.52,.4,.42,FH-2,'#33475a');face(g,'L',.72,0,.012,FH-1.6,'#1c1c1c')}
  else{face(g,'L',.58,0,.18,FH-2.4,L===1?'#5d6168':'#6b4226');face(g,'L',.59,FH-2.4,.16,.4,fr);winF(g,'L',.14,1.8,.3,FH-4,fr,'#2f5079',fr);rejas(g,'L',.14,1.8,.3,FH-4,'#2b2b2b')}
  winF(g,'R',.45,1.8,.3,FH-4,L===1?'#8f8a80':WR,'#2b4b75',L===1?'#8f8a80':WR);if(L<=2)rejas(g,'R',.45,1.8,.3,FH-4,'#2b2b2b');
  for(let fl=1;fl<f;fl++){const v=fl*FH;if(L===2||L===3){face(g,'L',0,v-.3,1,.6,W);face(g,'R',0,v-.3,1,.6,WR)}
    if(L===4){win(g,'L',.5,v+.6,.44,FH-1.8,'#33475a');win(g,'R',.15,v+1.4,.7,FH-3.2,'#2c3f52')}
    else{for(const u of [.14,.56])winF(g,'L',u,v+1.6,.28,FH-3.6,fr,'#2f5079',fr);winF(g,'R',.4,v+1.6,.3,FH-3.6,L===1?'#8f8a80':WR,'#2b4b75',L===1?'#8f8a80':WR);if(L===1)rejas(g,'L',.14,v+1.6,.28,FH-3.6,'#2b2b2b')}
    if(L===3&&fl===1){prot(SD.L,.5,.9,.08,v,.45,W);rail(SD.L,.5,.9,.08,v+.45,'bars','#2b2b2b');const gg=protGeo(SD.L,.5,.9,.08,v+.45);face(gg,'L',.1,1.9,.3,.9,'#3f8f4a');face(gg,'L',.2,2.6,.1,.6,'#e04f9a')}}
  if(L===1&&f===1&&hR(s,3)<.5)minisplit(g,'R',.1,FH-3.4);if(L===2)minisplit(g,'R',.08,H-3.6);
  // techo
  const PH=L===4?1.2:.9,gp=box(x0-.01,y0-.01,x1+.01,y1+.01,H,PH,L===4?'#f4f2ee':'#bdb7ab',L===4?'#f4f2ee':L===1?wall:W,L===4?'#dcd8d0':L===1?wallR:WR);const R=H+PH;topFace(x0+.03,y0+.03,x1-.03,y1-.03,R,L===1?'#9f998d':'#aaa396');
  if(L===1){for(const [a,b] of [[.13,.13],[.65,.13],[.13,.61],[.65,.61]]){const [x,y]=P(gx+a,gy+b);px(x-.25,y-R-3.5,.5,3.5,'#6a5a4a');px(x+.35,y-R-3,.4,3,'#6a5a4a')}tinaco(gx+.4,gy+.3,R,'#1f1f1f');gasTank(gx+.42,gy+.52,R)}
  else if(L===2){tinaco(gx+.32,gy+.28,R,'#1f1f1f');gasTank(gx+.46,gy+.5,R);const A=P(gx+.18,gy+.5),B=P(gx+.3,gy+.6);line(A[0],A[1]-R-4,B[0],B[1]-R-4,'#8a8a8a');for(let q=0;q<3;q++)px(A[0]+(B[0]-A[0])*(q+.5)/3-.5,A[1]+(B[1]-A[1])*(q+.5)/3-R-4,1.2,2,['#f4f4f4','#e57d8e','#3a6ea5'][q])}
  else if(L===3){tinaco(gx+.3,gy+.26,R,'#1f1f1f');lifted(R,()=>{umbH(gx+.48,gy+.46,RIBV?'#2bb3a3':'#f26a21',4,RIBV?'#239a8c':'#d85a18');chairH(gx+.56,gy+.36,'#f4f4f4');planter(gx+.2,gy+.52,.3)})}
  else{solarRoof(x0+.06,y0+.06,gx+.5,y1-.06,R);tinaco(gx+.58,gy+.24,R,'#f0f0ee')}
  // cochera: techo de lámina (N2), losa (N3) o losa con madera (N4); y el carro
  const cc=AUTOC[(s+2)%AUTOC.length];
  if(L>=2){const ch=6.2,top=L===2?'#b8bec6':L===3?'#d8d3c8':'#f2efe8';for(const [a,b] of [[.94,.1],[.94,.6]]){const [x,y]=P(gx+a,gy+b);px(x-.3,y-ch,.7,ch,L===4?'#8a5a30':'#5a5f6b')}
    car(gx+.83,gy+.4,L===4?['#f4f4f4','#2b2b2b','#9aa0a8'][s%3]:cc);box(gx+.69,gy+.08,gx+.96,gy+.66,ch,L===2?.4:.8,top,L===4?'#8a5a30':hexShade(top,-.08),hexShade(top,-.2))}
  else car(gx+.83,gy+.42,cc);
  if(!ic)rejaLote(gx,gy,L);
  if(L>=3)dsort(gx,gy,[[.18,.82,()=>L===4?olive(gx+.18,gy+.82):tree(gx+.18,gy+.82,.55)]]);else if(L===2)planter(gx+.2,gy+.84,.32)}

/* ---------- Usos mixtos: local abajo (farmacia, papelería, lavandería, panadería o tortillería) y departamentos arriba ---------- */
const MIXTO_D=['#efe9df','#e6d6bf','#d6d9dc','#ead9c6'],LOCAL=[['#2f8f5b','farmacia'],['#f2c14e','papeleria'],['#3a7cc0','lavanderia'],['#c97a35','panaderia'],['#e0b13a','tortilleria']];
function localIcon(x,y,k){if(k==='farmacia'){px(x-.4,y-2.2,.8,2.4,'#ffffff');px(x-1.2,y-1.4,2.4,.8,'#ffffff')}else if(k==='papeleria'){line(x-1.6,y,x+1.4,y-2.2,'#2b2b2b');px(x+1,y-2.6,.8,.8,'#e57d8e')}
  else if(k==='lavanderia'){circ(x,y-1.1,1.4,'#ffffff');circ(x,y-1.1,.8,'#9fd0ee')}else if(k==='panaderia'){ellipse(x,y-1,1.8,.9,'#f3d7a0');px(x-1,y-1.3,.4,.6,'#c97a35');px(x+.3,y-1.3,.4,.6,'#c97a35')}else{for(let q=0;q<3;q++)ellipse(x,y-.4-q*.6,1.6,.45,q%2?'#f7e7b4':'#efd894')}}
function artMixto(t,gx,gy,L,ic){const s=t.s,f=ic?3:Math.max(3,t.f||3),FH=7,GF=8.5,ins=.12,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,H=GF+(f-1)*FH+1,SD=sidesOf(x0,y0,x1,y1);SD.L.__s='L';SD.R.__s='R';
  const PAL=RIBV?CASAF_R:MIXTO_D,wall=L===1?'#c9c4ba':PAL[s%PAL.length],wallR=hexShade(wall,-.16),W='#f7f3ea',WR='#ddd8cc',[lc,lk]=LOCAL[(s>>1)%LOCAL.length],on=NIGHT>.2,g=box(x0,y0,x1,y1,0,H,'#b0aa9e',wall,wallR);
  // planta baja: local con aparador y toldo; entrada de los departamentos a la derecha
  face(g,'L',0,0,1,GF,L===4?'#3a3a3a':'#ece7dc');face(g,'R',0,0,1,GF,L===4?'#2e2e2e':'#d3cec2');
  if(L===1){win(g,'L',.05,.3,.9,GF-2.8,'#a9cfe4');face(g,'L',.05,2.6,.9,GF-5.4,'#9ea3aa');for(let v=2.9;v<GF-2.8;v+=.7)face(g,'L',.05,v,.9,.2,'#7f848c')}
  else{win(g,'L',.05,.3,.9,GF-2.8,'#bfe0f0');for(const u of [.35,.65])face(g,'L',u,.3,.016,GF-2.8,'#2b2b2b')}
  face(g,'L',.04,GF-2.4,.92,2,lc);for(let k=0;k<6;k++)face(g,'L',.14+k*.12,GF-1.9,.08,1,'#ffffff');
  if(L>=2){const ga=prot(SD.L,.04,.96,.13,GF-3.3,.9,lc,lc);for(let q=1;q<9;q+=2)face(ga,'L',q/9,0,1/9,.9,'#ffffff')}
  face(g,'R',.56,0,.24,GF-2,L===4?'#8a5a30':'#5a3a24');face(g,'R',.54,GF-2,.28,.4,WR);winF(g,'R',.12,1.6,.3,GF-4,WR,'#2b4b75',WR);
  // letrero de bandera con el ícono del local (de noche se enciende)
  {const [x,y]=fpt(g,'L',.02,GF-1);px(x-3.6,y-.4,3.6,.5,'#3a3a3a');px(x-7,y-5,5,5,lc,on);px(x-7,y-5,5,.5,hexShade(lc,.3),on);localIcon(x-4.5,y-1.2,lk);if(on)glow(x-4.5,y-2.5,7,.7,lc)}
  // departamentos: dos ventanas grandes por cara
  for(let fl=1;fl<f;fl++){const v=GF+(fl-1)*FH;if(L>=2){face(g,'L',0,v-.3,1,.6,L===4?'#8a5a30':W);face(g,'R',0,v-.3,1,.6,L===4?'#6e4524':WR)}
    for(const sd of ['L','R'])for(const u of [.12,.56]){const w=.32,fr=L===1?hexShade(wall,-.12):sd==='L'?W:WR,bal=L>=3&&sd==='L'&&(L===4||(fl+Math.round(u*10))%2===0);
      if(bal){winF(g,sd,u,v+.6,w,FH-1.8,fr,'#2f5079',fr);prot(SD[sd],u-.03,u+w+.03,.08,v,.4,L===4?'#f2efe8':W);rail(SD[sd],u-.03,u+w+.03,.08,v+.4,L===4?'glass':'bars',L===4?'#ffffff':'#2b2b2b');
        const gg=protGeo(SD[sd],u-.03,u+w+.03,.08,v+.4);face(gg,sd,.1,1.9,.3,.9,'#3f8f4a');face(gg,sd,.2,2.6,.12,.6,['#e04f9a','#f2c45a'][fl%2])}
      else{winF(g,sd,u,v+1.6,w,FH-3.4,fr,'#2f5079',fr);if(L===1)rejas(g,sd,u,v+1.6,w,FH-3.4,'#2b2b2b')}if(L===2&&sd==='R'&&u>.5&&fl%2===0)minisplit(g,'R',u+.04,v+.3)}}
  if(L===4)for(const sd of ['L','R'])face(g,sd,.96,GF,.04,H-GF,'#8a5a30');
  // azotea
  box(x0-.01,y0-.01,x1+.01,y1+.01,H,1,'#bdb7ab',L===1?wall:W,L===1?wallR:WR);const R=H+1;topFace(x0+.03,y0+.03,x1-.03,y1-.03,R,'#aaa396');
  if(L===1)tinaco(gx+.36,gy+.3,R,'#1f1f1f');else if(L===2){const gm=cb(gx+.24,gy+.24,gx+.44,gy+.46,R,3.4,'#d8d2c4');face(gm,'L',.3,0,.35,2.6,'#6b4226');minisplit(gm,'R',.1,.4);lifted(R,()=>planter(gx+.7,gy+.32,.3))}
  else{lifted(R,()=>{for(const [a,b] of [[.26,.26],[.26,.62],[.62,.26]]){const [x,y]=P(gx+a,gy+b);px(x-.3,y-6,.7,6,'#7a4e2c')}for(let q=0;q<5;q++){const a=P(gx+.26+q*.09,gy+.24),b=P(gx+.26+q*.09,gy+.64);line(a[0],a[1]-6.1,b[0],b[1]-6.1,'#8a5a30')}
      tableH(gx+.46,gy+.46,'#f7f3ea','#555');chairH(gx+.38,gy+.38,'#2f6f5e');planter(gx+.74,gy+.3,.3);planter(gx+.74,gy+.7,.3)});
    if(L===4){const a=P(x0+.03,y1-.03),b=P(x1-.03,y1-.03);foquitos([a[0],a[1]-R],[b[0],b[1]-R],4.5,7,1.3)}else lifted(R,()=>planter(gx+.4,gy+.72,.3))}}

/* ---------- Cicloestación: anclajes con bicis del color del distrito; luego techo, taller y techo solar ---------- */
function bikeRow(gx,gy,a0,a1,b,n,col,ebike){const A=P(gx+a0,gy+b),B=P(gx+a1,gy+b);line(A[0],A[1]-1.2,B[0],B[1]-1.2,'#5a5f6b');
  for(let k=0;k<n;k++){const f=(k+.5)/n,x=A[0]+(B[0]-A[0])*f,y=A[1]+(B[1]-A[1])*f;px(x-.3,y-2.4,.6,2.4,'#3a3f4a');if(ebike&&NIGHT>.2)px(x-.3,y-2.6,.6,.5,'#59ff9a',true);drawBike(x+.6,y+1.4,-1,col);px(x-1.6,y-3.9,1.4,1,'#2b2b2b')}}
function artCiclo(t,gx,gy,L){const c=DCOL(),c2=DCOL2(),s=t.s;
  quad(gx,gy,.06,.06,.94,.94,'#d6d1c6');for(let k=1;k<6;k++){const a=P(gx+.06+k*.147,gy+.06),b=P(gx+.06+k*.147,gy+.94);line(a[0],a[1],b[0],b[1],'#c8c2b5')}
  const sign=fx=>totem(gx+fx,gy+.2,6,6,c,(x,y)=>{circ(x-1.2,y+2.4,1,'#ffffff');circ(x+1.4,y+2.4,1,'#ffffff');line(x-1.2,y+2.4,x+.2,y+1.2,'#ffffff');line(x+.2,y+1.2,x+1.4,y+2.4,'#ffffff')});
  if(L===1){sign(.22);bikeRow(gx,gy,.3,.86,.52,5,c);planter(gx+.2,gy+.82,.3);return}
  if(L===2){sign(.2);bikeRow(gx,gy,.26,.88,.42,5,c);bikeRow(gx,gy,.26,.88,.78,5,c);
    for(const a of [.3,.84]){const [x,y]=P(gx+a,gy+.42);px(x-.3,y-8,.6,8,'#5a5f6b')}box(gx+.26,gy+.3,gx+.88,gy+.52,8,.5,c,hexShade(c,-.1),hexShade(c,-.25));return}
  if(L===3){const g=cb(gx+.08,gy+.08,gx+.36,gy+.4,0,8,'#f2efe8','#e4e0d6');face(g,'L',.08,0,.84,5.4,'#2b2b2b');win(g,'L',.12,.3,.76,4.8,'#e8c48a');face(g,'L',0,6.2,1,1.4,c);face(g,'R',.2,1.6,.6,3,'#7fb2d4');
    {const [x,y]=fpt(g,'L',.5,0);circ(x-1,y-1.4,1.3,'#2b2b2b');circ(x+1.6,y-1.4,1.3,'#2b2b2b')}
    bikeRow(gx,gy,.44,.9,.3,4,c,true);bikeRow(gx,gy,.2,.9,.7,6,c,true);{const [x,y]=P(gx+.36,gy+.86);px(x-.3,y-4,.8,4,'#3a3f4a');px(x-1,y-4.6,2.2,1,c2)}return}
  // N4: techo solar sobre los anclajes, macetas y bebedero
  bikeRow(gx,gy,.14,.9,.36,6,c,true);bikeRow(gx,gy,.14,.9,.66,6,c,true);
  for(const [a,b] of [[.14,.3],[.9,.3],[.14,.72],[.9,.72]]){const [x,y]=P(gx+a,gy+b);px(x-.3,y-10,.7,10,'#5a5f6b')}
  box(gx+.1,gy+.26,gx+.94,gy+.76,10,.6,'#23365a',hexShade(c,-.05),hexShade(c,-.25));{for(let k=1;k<6;k++){const a=P(gx+.1+k*.14,gy+.26),b=P(gx+.1+k*.14,gy+.76);line(a[0],a[1]-10.6,b[0],b[1]-10.6,'#5a7bb0')}}
  sign(.08);dsort(gx,gy,[[.3,.9,()=>planter(gx+.3,gy+.9,.32)],[.7,.9,()=>planter(gx+.7,gy+.9,.32)]])}

/* ---------- Banco: cajero → sucursal → banco con autobanco → torre financiera ---------- */
function bankLogo(x,y,sc){circ(x,y,1.9*sc,'#c9a227');circ(x,y,1.3*sc,'#1f3a5f');for(const dx of [-.6,0,.6])px(x+dx*sc-.15,y-.6*sc,.3,1.2*sc,'#c9a227');px(x-.9*sc,y-.9*sc,1.8*sc,.3,'#c9a227')}
function artBanco(t,gx,gy,L){const NV='#1f3a5f',GD='#c9a227',ST='#ece7dc',STR='#d6d0c2',on=NIGHT>.2;
  if(L===1){quad(gx,gy,.2,.2,.8,.8,'#d6d1c6');const g=cb(gx+.36,gy+.34,gx+.62,gy+.56,0,10,NV,'#2b4a72');face(g,'L',0,8.4,1,1.2,GD);win(g,'L',.2,3.2,.6,3,'#9fe0ff');face(g,'L',.3,1.6,.4,.8,'#2b2b2b');
    {const [x,y]=fpt(g,'L',.5,10.6);bankLogo(x,y-1.6,.8)}if(on)glow(...fpt(g,'L',.5,4.6),7,.7,'#9fe0ff');
    dsort(gx,gy,[[.2,.74,()=>planter(gx+.2,gy+.74,.3)],[.72,.76,()=>bench(gx+.72,gy+.76,'#5a5f6b')]]);return}
  if(L===2){quad(gx,gy,.06,.06,.94,.94,'#d6d1c6');const H=12,g=cb(gx+.12,gy+.12,gx+.74,gy+.66,0,H,ST,STR);
    for(const u of [0,.32,.64,.96])face(g,'L',u,0,.04,H,'#f6f2e9');win(g,'L',.06,1,.24,7,'#5d86a8');win(g,'L',.38,0,.24,8,'#5d86a8');win(g,'L',.7,1,.24,7,'#5d86a8');
    face(g,'L',0,9,1,2.2,NV);{const [x,y]=fpt(g,'L',.14,9.2);bankLogo(x,y-1.1,.8)}for(let k=0;k<5;k++)face(g,'L',.28+k*.13,9.6,.09,1,GD);
    face(g,'R',.2,2,.3,4.4,'#3a3d45');win(g,'R',.24,4.2,.22,1.6,'#9fe0ff');face(g,'R',.6,1,.3,6,'#5d86a8');
    box(gx+.1,gy+.1,gx+.76,gy+.68,H,.8,'#bdb7ab','#f6f2e9','#dcd6c8');guy(gx+.5,gy+.76,NV);dsort(gx,gy,[[.88,.3,()=>planter(gx+.88,gy+.3,.32)],[.3,.86,()=>planter(gx+.3,gy+.86,.3)]]);return}
  if(L===3){quad(gx,gy,.04,.04,.96,.96,'#cfc9bc');quad(gx,gy,.68,.06,.94,.94,'#a8a196');const H=18,g=cb(gx+.1,gy+.1,gx+.62,gy+.66,0,H,ST,STR);
    for(const u of [0,.32,.64,.96])face(g,'L',u,0,.04,H,'#f6f2e9');for(const v of [1,10])for(const u of [.06,.38,.7])win(g,'L',u,v,.24,6.4,'#5d86a8');face(g,'L',0,7.8,1,1.6,NV);for(let k=0;k<6;k++)face(g,'L',.1+k*.14,8.2,.08,.8,GD);
    face(g,'R',.08,1,.3,5.6,'#5d86a8');face(g,'R',.62,2.4,.3,3,'#3a3d45');win(g,'R',.66,3.2,.22,1.6,'#9fe0ff');for(const v of [10])for(const u of [.08,.56])win(g,'R',u,v,.34,6,'#4f7898');
    box(gx+.08,gy+.08,gx+.64,gy+.68,H,.8,'#bdb7ab','#f6f2e9','#dcd6c8');{const [x,y]=P(gx+.36,gy+.38);bankLogo(x,y-H-5,1.2)}
    car(gx+.82,gy+.6,AUTOC[t.s%AUTOC.length]);for(const b of [.2,.8]){const [x,y]=P(gx+.92,gy+b);px(x-.3,y-8,.7,8,'#5a5f6b')}box(gx+.64,gy+.12,gx+.96,gy+.88,8,.6,NV,NV,hexShade(NV,-.2));{const a=P(gx+.64,gy+.88),b=P(gx+.96,gy+.88);line(a[0],a[1]-8.3,b[0],b[1]-8.3,GD)}
    guy(gx+.4,gy+.78,NV);return}
  // torre financiera: basamento de cantera con columnas, torre de vidrio azul marino con corona dorada
  quad(gx,gy,.04,.04,.96,.96,'#cfc9bc');const ins=.12,x0=gx+ins,y0=gy+ins,x1=gx+1-ins,y1=gy+1-ins,FH=6,PH=13,f=6,i2=.08,H=PH+f*FH;
  const gb=box(x0,y0,x1,y1,0,PH,'#bdb7ab',ST,STR);face(gb,'L',0,0,1,1,'#cfc8b8');win(gb,'L',.08,1,.84,PH-4,'#e8c48a');
  for(const u of [.06,.24,.42,.6,.78]){face(gb,'L',u,1,.07,PH-4,'#f6f2e9');face(gb,'L',u+.07,1,.025,PH-4,'#cfc8b8')}face(gb,'L',0,PH-3,1,3,'#f6f2e9');face(gb,'L',.2,PH-2.4,.6,1.6,NV);
  {const [x,y]=fpt(gb,'L',.12,PH-1.6);bankLogo(x,y,.7)}for(let k=0;k<5;k++)face(gb,'L',.3+k*.1,PH-2,.06,.8,GD);
  for(const u of [.1,.4,.7])win(gb,'R',u,2,.2,PH-6,'#5d86a8');face(gb,'R',0,PH-3,1,3,'#e4ded2');
  box(x0-.01,y0-.01,x1+.01,y1+.01,PH,.6,'#c9c2b4','#f6f2e9','#dcd6c8');
  const tg=box(x0+i2,y0+i2,x1-i2,y1-i2,PH+.6,f*FH,'#bdb7ab','#2b4a72','#203a5c');
  for(let fl=0;fl<f;fl++){const v=fl*FH;for(const sd of ['L','R']){for(const [u,w] of [[.03,.3],[.35,.3],[.67,.3]])win(tg,sd,u,v+.5,w,FH-1,sd==='L'?'#4d78a6':'#3f6890');face(tg,sd,0,v,1,.5,'#c9cdd2')}}
  for(const sd of ['L','R'])face(tg,sd,.47,0,.06,f*FH,'#c9cdd2');
  box(x0+i2-.02,y0+i2-.02,x1-i2+.02,y1-i2+.02,H+.6,1.6,'#bdb7ab',GD,hexShade(GD,-.2));{const [x,y]=P(gx+.5,gy+.5);bankLogo(x,y-H-7,1.6);if(on)glow(x,y-H-7,9,.7,'#ffd86a')}}

/* ---------- Gasolinera: bomba → gasolinera con tótem de precios → con tiendita → con cargadores eléctricos ---------- */
function bomba(fx,fy,c,ev){const g=cb(fx-.04,fy-.03,fx+.04,fy+.03,0,4.6,ev?'#f4f4f2':'#e9e9e6');face(g,'L',0,3.4,1,1,ev?'#3fd16a':c);face(g,'L',.2,1.6,.6,1,NIGHT>.2?'#9fe0ff':'#2b3a4d',NIGHT>.2);if(ev&&NIGHT>.2){const [x,y]=fpt(g,'L',.5,4);glow(x,y,5,.7,'#59ff9a')}}
function precios(fx,fy,h,c){totem(fx,fy,h,7,'#f4f4f2',(x,y)=>{px(x-3.5,y,7,1.2,c);for(let r=0;r<3;r++){px(x-3,y+1.6+r*.95,2,.6,'#2b2b2b');px(x-.4,y+1.5+r*.95,3.4,.8,'#1a1a1a');for(let q=0;q<3;q++)px(x-.1+q*1.05,y+1.6+r*.95,.7,.6,NIGHT>.2?'#ffcc33':'#d84a2a',NIGHT>.2)}})}
function artGas(t,gx,gy,L){const c=DCOL(),c2=DCOL2(),s=t.s,on=NIGHT>.2;
  quad(gx,gy,.04,.04,.96,.96,'#bfbab0');quad(gx,gy,.06,.06,.94,.94,'#c9c4b9');
  if(L===1){const g=cb(gx+.12,gy+.12,gx+.34,gy+.34,0,7,'#f4f4f2');face(g,'L',0,5,1,2,c);win(g,'L',.2,1.6,.6,2.6,'#7fb2d4');
    cb(gx+.46,gy+.5,gx+.66,gy+.58,0,.8,'#e8e4da');bomba(gx+.56,gy+.54,c);for(const [a,b] of [[.44,.44],[.68,.44]]){const [x,y]=P(gx+a,gy+b);px(x-.3,y-8,.6,8,'#9aa0a8')}box(gx+.4,gy+.38,gx+.72,gy+.7,8,.6,'#f4f4f2',c,hexShade(c,-.2));
    precios(gx+.86,gy+.2,6,c);return}
  // marquesina sobre dos islas
  const cx0=gx+.3,cy0=gy+.34,cx1=gx+.86,cy1=gy+.86,CH=9.5;
  const store=()=>{if(L<3)return;const g=cb(gx+.06,gy+.06,gx+.5,gy+.3,0,9,'#f4f4f2');face(g,'L',0,7,1,2,c);win(g,'L',.06,.3,.6,5.6,'#bfe0f0');face(g,'L',.72,0,.2,6,'#3a3d45');for(let k=0;k<4;k++)face(g,'L',.12+k*.12,7.4,.08,1.2,'#ffffff');
    face(g,'R',.2,1,.6,3.4,'#7fb2d4');if(L===4)solarRoof(gx+.08,gy+.08,gx+.48,gy+.28,9);else box(gx+.05,gy+.05,gx+.51,gy+.31,9,.6,'#bdb7ab','#f4f4f2','#dcd8d0')};
  const isl=[.48,.72],pumps=()=>{for(const b of isl){cb(cx0+.04,gy+b-.04,cx1-.04,gy+b+.04,0,.8,'#e8e4da');for(const a of [.42,.68])bomba(gx+a,gy+b,c,L===4&&b===.72&&a===.68)}};
  store();dsort(gx,gy,[[.5,.48,()=>pumps()],[.55,.6,()=>car(gx+.55,gy+.6,AUTOC[s%AUTOC.length],true)],[.5,.84,()=>L===4?car(gx+.5,gy+.84,'#f4f4f4',true):null]]);
  for(const [a,b] of [[.32,.48],[.84,.48],[.32,.72],[.84,.72]]){const [x,y]=P(gx+a,gy+b);px(x-.4,y-CH,.9,CH,'#e9e9e6')}
  const gc=box(cx0,cy0,cx1,cy1,CH,2.4,'#f4f4f2',c,hexShade(c,-.2));face(gc,'L',0,0,1,.7,c2);face(gc,'R',0,0,1,.7,hexShade(c2,-.2));face(gc,'L',0,1.9,1,.5,'#ffffff');face(gc,'R',0,1.9,1,.5,'#e4e4e0');
  if(on){const [x,y]=P((cx0+cx1)/2,(cy0+cy1)/2);glow(x,y-2,16,.55,'#f8f4dc')}
  if(L===4){const [x,y]=P(gx+.2,gy+.82);px(x-.4,y-5,1,5,'#f4f4f2');px(x-.4,y-5,1,1,'#3fd16a',on);if(on)glow(x,y-4,5,.7,'#59ff9a')}
  if(L===3||L===4){const [x,y]=P(gx+.16,gy+.6);cb(gx+.12,gy+.56,gx+.2,gy+.64,0,4,'#2f6db5');px(x-1,y-4.6,2,.6,'#ffffff')}
  precios(gx+.92,gy+.14,12,c)}

/* ---------- Ribera · Parroquia (2×2): atrio con laureles y cruz atrial, fachada de cantera, campanario y cúpula de azulejo ---------- */
function cupula(cx,by,r,tiles){const n=8;ellipse(cx,by,r,r*.3,hexShade(tiles[0],-.35));
  for(let k=0;k<n;k++){const t0=-Math.PI/2+k/n*Math.PI,t1=t0+Math.PI/n,p=[];for(let q=0;q<=6;q++){const ph=q/6*Math.PI/2;p.push([cx+r*Math.cos(ph)*Math.sin(t0),by-r*1.15*Math.sin(ph)])}
    for(let q=6;q>=0;q--){const ph=q/6*Math.PI/2;p.push([cx+r*Math.cos(ph)*Math.sin(t1),by-r*1.15*Math.sin(ph)])}poly(p,k===n-1||k===n-2?hexShade(tiles[k%2],-.15):tiles[k%2])}
  return by-r*1.15}
function artParroquia(t,gx,gy){const on=NIGHT>.2,C='#e6cdaa',CR=hexShade(C,-.16),W='#f6efe2',WR='#ddd5c4';
  // atrio
  quad(gx,gy,.03,.03,1.97,1.97,'#d8cdb8');for(let k=1;k<12;k++){const a=P(gx+.03+k*.16,gy+.03),b=P(gx+.03+k*.16,gy+1.97);line(a[0],a[1],b[0],b[1],'#cbbfa8')}
  const E=edges4(gx,gy,.03,1.97);fenceE(E[0],2.4,'#c9b38c',null,3);fenceE(E[1],2.4,'#c9b38c',null,3);
  // nave (larga hacia el fondo) y crucero con cúpula
  const nx0=gx+.42,nx1=gx+1.18,ny0=gy+.18,ny1=gy+1.22,NH=24,SD=sidesOf(nx0,ny0,nx1,ny1);SD.L.__s='L';SD.R.__s='R';
  const g=box(nx0,ny0,nx1,ny1,0,NH,'#cdbf9f',C,CR);for(let k=0;k<4;k++){face(g,'R',.12+k*.22,4,.06,NH-8,hexShade(CR,-.08));arcoW(g,'R',.16+k*.22,10,.1,8,WR,'#6b5a8a',null)}
  for(const u of [.18,.46,.74])face(g,'R',u-.07,0,.03,NH,hexShade(CR,.08));
  box(nx0-.01,ny0-.01,nx1+.01,ny1+.01,NH,1,'#bfae8c',W,WR);
  {const [x,y]=P((nx0+nx1)/2,gy+.5);const dg=box(nx0+.14,gy+.32,nx1-.14,gy+.74,NH+1,6,'#d8c7a5',C,CR);for(const u of [.2,.5,.8])arcoW(dg,'L',u-.06,1.4,.12,3.4,W,'#5a4a7a',null);const tp=cupula(x,y-NH-7,8.5,['#f2c14e','#2a6fb0']);px(x-1.2,tp-3,2.4,3.2,W);px(x-1.5,tp-3.4,3,.6,'#cdbf9f');px(x-.25,tp-8.4,.5,5,'#c9a227');px(x-1.5,tp-7,3,.5,'#c9a227')}
  // fachada (cara L de la nave) con remate, portada de arco, rosetón y nichos
  face(g,'L',0,0,1,NH,C);for(const u of [0,.3,.7,.97])face(g,'L',u,0,.04,NH,W);face(g,'L',0,NH-1,1,1,W);
  fpoly(g,'L',[[0,NH+1],[1,NH+1],[1,NH+3],[.78,NH+4],[.62,NH+7.5],[.5,NH+9.5],[.38,NH+7.5],[.22,NH+4],[0,NH+3]],C);fpoly(g,'L',[[.47,NH+9.5],[.53,NH+9.5],[.53,NH+13],[.47,NH+13]],'#c9a227');fpoly(g,'L',[[.42,NH+11.4],[.58,NH+11.4],[.58,NH+12],[.42,NH+12]],'#c9a227');
  arcoW(g,'L',.37,0,.26,10,W,'#5a3a24',null,'#d9bf98');face(g,'L',.495,0,.01,8.6,'#3a2414');
  {const [x,y]=fpt(g,'L',.5,16.5);circ(x,y,3.4,W);circ(x,y,2.5,on?'#ffcf6a':'#5a4a7a',on);for(let k=0;k<4;k++){const a=k*Math.PI/4;line(x-Math.cos(a)*2.4,y-Math.sin(a)*2.4,x+Math.cos(a)*2.4,y+Math.sin(a)*2.4,W)}if(on)glow(x,y,8,.6,'#ffcf6a')}
  for(const u of [.12,.85]){arcoW(g,'L',u-.04,12,.08,4,W,'#8a7a62',null);const [x,y]=fpt(g,'L',u,12.6);px(x-.4,y-2.6,.8,2.4,'#f4efe4')}
  // campanario a la derecha de la fachada
  const tx0=nx1+.02,tx1=nx1+.3,ty0=ny1-.3,ty1=ny1,TH=34,tg=box(tx0,ty0,tx1,ty1,0,TH,'#cdbf9f',C,CR);for(const v of [11,22]){face(tg,'L',0,v,1,.8,W);face(tg,'R',0,v,1,.8,WR)}
  {const [x,y]=fpt(tg,'L',.5,17);circ(x,y,1.8,W);circ(x,y,1.3,on?'#fff3c4':'#f4efe4',on);line(x,y,x,y-1,'#2b2b2b');line(x,y,x+.8,y,'#2b2b2b')}
  const bg=box(tx0+.01,ty0+.01,tx1-.01,ty1-.01,TH,9,'#cdbf9f',C,CR);for(const sd of ['L','R']){arcoW(bg,sd,.22,1,.56,6,W,'#3a3550',null);const [x,y]=fpt(bg,sd,.5,3);circ(x,y,1.3,'#b8862b');px(x-.2,y+1,.4,.6,'#7a5a1a')}
  box(tx0-.01,ty0-.01,tx1+.01,ty1+.01,TH+9,1,'#bfae8c',W,WR);{const [x,y]=P((tx0+tx1)/2,(ty0+ty1)/2);const tp=cupula(x,y-TH-10,4,['#f2c14e','#2a6fb0']);px(x-.25,tp-5,.5,5,'#c9a227');px(x-1.3,tp-3.6,2.6,.5,'#c9a227')}
  // atrio: laureles, cruz atrial, bancas, faroles; barda del frente con arco de entrada
  dsort(gx,gy,[[.22,.4,()=>tree(gx+.22,gy+.4,.8)],[.22,1.1,()=>tree(gx+.22,gy+1.1,.85)],[1.6,.5,()=>tree(gx+1.62,gy+.5,.85)],[1.62,1.1,()=>tree(gx+1.62,gy+1.1,.8)],
    [.8,1.6,()=>{const [x,y]=P(gx+.8,gy+1.6);cb(gx+.74,gy+1.54,gx+.86,gy+1.66,0,3,'#cdbf9f');px(x-.4,y-9.5,.8,6.5,'#e6d6b8');px(x-1.6,y-8.2,3.2,.8,'#e6d6b8')}],
    [1.3,1.5,()=>bench(gx+1.3,gy+1.5,'#8a5a30')],[.4,1.62,()=>bench(gx+.4,gy+1.62,'#8a5a30')],[1.75,1.75,()=>lamp(gx+1.75,gy+1.75,12)],[.2,1.8,()=>lamp(gx+.2,gy+1.8,12)]]);
  fenceE(E[2],2.4,'#c9b38c',null,3);{const [a,b]=E[3];fenceE([a,P(gx+.62,gy+1.97)],2.4,'#c9b38c',null,3);fenceE([P(gx+1.02,gy+1.97),b],2.4,'#c9b38c',null,3);const A=P(gx+.64,gy+1.97),B=P(gx+1,gy+1.97);px(A[0]-.5,A[1]-6,1,6,'#e6cdaa');px(B[0]-.5,B[1]-6,1,6,'#e6cdaa');line(A[0],A[1]-6,B[0],B[1]-6,'#e6cdaa');line(A[0],A[1]-6.5,(A[0]+B[0])/2,(A[1]+B[1])/2-8,'#e6cdaa');line((A[0]+B[0])/2,(A[1]+B[1])/2-8,B[0],B[1]-6.5,'#e6cdaa')}
  if(on){const [x,y]=fpt(g,'L',.5,8);glow(x,y,14,.45,'#ffd89a')}}

/* ---------- Ribera · Hotel boutique (2×2) — opción A: casona-hacienda de dos pisos en U, techos de teja, patio con fuente y portales ---------- */
// techo de cuatro aguas de teja sobre un rectángulo (cumbrera a lo largo del lado mayor)
function techoTeja(x0,y0,x1,y1,H,r,c){const o=.035;x0-=o;y0-=o;x1+=o;y1+=o;const cs=hexShade(c,-.18),cd=hexShade(c,-.32),it=[];
  if(x1-x0>=y1-y0){const d=(y1-y0)/2,ym=(y0+y1)/2;it.push({p:[[x0,y0,H],[x1,y0,H],[x1-d,ym,H+r],[x0+d,ym,H+r]],c:cd},{p:[[x0,y1,H],[x1,y1,H],[x1-d,ym,H+r],[x0+d,ym,H+r]],c},{p:[[x1,y0,H],[x1,y1,H],[x1-d,ym,H+r]],c:cs},{p:[[x0,y0,H],[x0,y1,H],[x0+d,ym,H+r]],c:cd,z:-.02})}
  else{const d=(x1-x0)/2,xm=(x0+x1)/2;it.push({p:[[x0,y0,H],[x0,y1,H],[xm,y1-d,H+r],[xm,y0+d,H+r]],c:cd},{p:[[x1,y0,H],[x1,y1,H],[xm,y1-d,H+r],[xm,y0+d,H+r]],c:cs},{p:[[x0,y1,H],[x1,y1,H],[xm,y1-d,H+r]],c},{p:[[x0,y0,H],[x1,y0,H],[xm,y0+d,H+r]],c:cd,z:-.02})}
  paint3(it);
  // hileras de teja en las dos caras que se ven
  if(x1-x0>=y1-y0){const d=(y1-y0)/2,ym=(y0+y1)/2;for(let k=1;k<Math.round((x1-x0)/.07);k++){const x=x0+k*.07;if(x<x0+.02||x>x1-.02)continue;const a=P(x,y1),b=P(Math.min(Math.max(x,x0+d),x1-d),ym);line(a[0],a[1]-H,b[0],b[1]-H-r,hexShade(c,-.1))}}
  else{const d=(x1-x0)/2,xm=(x0+x1)/2;for(let k=1;k<Math.round((y1-y0)/.07);k++){const y=y0+k*.07;const a=P(x1,y),b=P(xm,Math.min(Math.max(y,y0+d),y1-d));line(a[0],a[1]-H,b[0],b[1]-H-r,hexShade(cs,-.1))}}}
function artHotel(t,gx,gy){const on=NIGHT>.2,M='#e3a66a',MR=hexShade(M,-.16),CA='#ead8b4',CAR='#cdb98f',TJ='#c0603f',FH=7,H=FH*2+1;
  quad(gx,gy,.03,.03,1.97,1.97,'#d9cdb4');
  // patio: losetas de barro, fuente, palmas, mesas y bugambilia
  quad(gx,gy,.6,.6,1.42,1.84,'#c98a5a');for(let k=1;k<6;k++){const a=P(gx+.6+k*.137,gy+.6),b=P(gx+.6+k*.137,gy+1.84);line(a[0],a[1],b[0],b[1],'#b87a4c')}for(let k=1;k<9;k++){const a=P(gx+.6,gy+.6+k*.138),b=P(gx+1.42,gy+.6+k*.138);line(a[0],a[1],b[0],b[1],'#b87a4c')}
  const wing=(x0,y0,x1,y1,arcSide)=>{const g=box(gx+x0,gy+y0,gx+x1,gy+y1,0,H,'#b8ad98',M,MR);
    for(const sd of ['L','R']){face(g,sd,0,0,1,1.2,sd==='L'?CAR:hexShade(CAR,-.12));face(g,sd,0,FH-.4,1,.8,sd==='L'?CA:CAR);face(g,sd,0,H-1,1,1,sd==='L'?CA:CAR)}
    for(const sd of ['L','R']){const len=sd==='L'?x1-x0:y1-y0,m=Math.max(1,Math.round(len/.3));
      for(let k=0;k<m;k++){const u=(k+.5)/m;
        if(sd===arcSide)arcoW(g,sd,u-.32/m,0,.64/m,FH-2.2,CA,'#5a4030',null,sd==='L'?CA:CAR);else{winF(g,sd,u-.16/m,1.6,.32/m,FH-4,sd==='L'?CA:CAR,'#4a3a2a',sd==='L'?CA:CAR);face(g,sd,u-.2/m,1.2,.4/m,.3,'#2b2b2b')}
        // piso alto: puertas con balcón de herrería y macetas
        winF(g,sd,u-.14/m,FH+1,.28/m,FH-2.8,sd==='L'?CA:CAR,'#3f5f7a',sd==='L'?CA:CAR);face(g,sd,u-.2/m,FH+.6,.4/m,.4,'#2b2b2b');for(let q=0;q<3;q++)face(g,sd,u-.18/m+q*.13/m,FH+1,.03,1.6,'#2b2b2b')}}
    return g};
  // ala del fondo con torre mirador; alas izquierda y derecha (portales hacia el patio)
  const gB=wing(.1,.1,1.9,.6,'L');
  const tw=box(gx+.12,gy+.12,gx+.44,gy+.44,H,7,'#b8ad98',CA,CAR);for(const sd of ['L','R'])arcoW(tw,sd,.2,1,.6,4.4,CA,on?'#ffcf8a':'#4a3a2a',null);
  techoTeja(.1+gx,.1+gy,1.9+gx,.6+gy,H,6,TJ);techoTeja(gx+.12,gy+.12,gx+.44,gy+.44,H+7,5,TJ);
  const gL=wing(.1,.6,.6,1.6,'R');techoTeja(gx+.1,gy+.6,gx+.6,gy+1.6,H,6,TJ);
  // patio (entre las alas)
  dsort(gx,gy,[[1,1.1,()=>{const [x,y]=P(gx+1,gy+1.1);ellipse(x,y-.6,6,3,'#cfc3a8');ellipse(x,y-1.2,4.6,2.3,on?'#7fd0f0':'#5fb4dc',on);px(x-.4,y-5.4,.8,4.2,'#e6d6b8');ellipse(x,y-5.4,2,1,'#e6d6b8');circ(x,y-6.4,1,'#bfe8f8')}],
    [.8,.8,()=>palm(gx+.8,gy+.8,15)],[1.25,1.45,()=>palm(gx+1.25,gy+1.48,13)],[.78,1.5,()=>{tableH(gx+.78,gy+1.5,'#f4efe4','#555');chairH(gx+.86,gy+1.44,'#2f5d50')}],[1.22,.82,()=>umbH(gx+1.22,gy+.82,'#f4efe4',5,'#e4dccb')]]);
  {const a=fpt(gB,'L',.3,H-.5),b=fpt(gL,'R',.9,H-.5);bulbsH(a,b,8,2)}
  const gR=wing(1.42,.6,1.9,1.6,'L');techoTeja(gx+1.42,gy+.6,gx+1.9,gy+1.6,H,6,TJ);
  bugam(gR,'R',.95,H-.5,10);bugam(gL,'L',.04,H-.5,9);bugam(gB,'R',.05,H-.5,8);
  // barda del frente con portón de arco, letrero de hierro y faroles
  {const A=P(gx+.04,gy+1.9),B=P(gx+1.96,gy+1.9),C1=P(gx+.82,gy+1.9),C2=P(gx+1.18,gy+1.9);for(const [a,b] of [[A,C1],[C2,B]]){poly([a,b,up(b,4),up(a,4)],M);line(a[0],a[1]-4,b[0],b[1]-4,CA)}
    poly([C1,C2,up(C2,7),up(C1,7)],CA);const ar=[];for(let k=0;k<=8;k++){const q=k/8,x=C1[0]+(C2[0]-C1[0])*(.14+.72*q),y=C1[1]+(C2[1]-C1[1])*(.14+.72*q)-5+Math.sin(q*Math.PI)*-1.6;ar.push([x,y])}
    poly([[C1[0]+(C2[0]-C1[0])*.14,C1[1]+(C2[1]-C1[1])*.14],[C1[0]+(C2[0]-C1[0])*.86,C1[1]+(C2[1]-C1[1])*.86],...ar.reverse()],on?'#ffcf8a':'#5a3a24',on);
    const m=[(C1[0]+C2[0])/2,(C1[1]+C2[1])/2];px(m[0]-4,m[1]-11,8,2.8,'#2b2b2b');for(let k=0;k<5;k++)px(m[0]-3.3+k*1.4,m[1]-10.4,.9,1.6,on?'#ffd86a':'#c9a227',on);px(m[0]-3,m[1]-8.2,.4,1.2,'#2b2b2b');px(m[0]+2.6,m[1]-8.2,.4,1.2,'#2b2b2b');
    for(const q of [C1,C2]){px(q[0]-.5,q[1]-9,1.2,2,on?'#ffd89a':'#3a3a3a',on);if(on)glow(q[0],q[1]-8,8,.7,'#ffcf8a')}}
  dsort(gx,gy,[[.3,1.86,()=>planter(gx+.3,gy+1.84,.34)],[1.7,1.86,()=>planter(gx+1.7,gy+1.84,.34)],[1.0,1.98,()=>guy(gx+.96,gy+1.97,'#2f5d50')]])}

/* opción B: hotel art déco junto al río — torre escalonada con aletas verde agua y coral, ventanas de ojo de buey y letrero en la azotea */
function artHotelDeco(t,gx,gy){const on=NIGHT>.2,CR='#f3e7d0',CRR='#d9ccb2',TQ='#2bb3a3',CO='#f08a6b',FH=6;
  quad(gx,gy,.03,.03,1.97,1.97,'#d9d4ca');quad(gx,gy,.03,1.36,1.97,1.97,'#cfc8b8');
  const blk=(x0,y0,x1,y1,f,fins)=>{const H=f*FH+2,g=box(gx+x0,gy+y0,gx+x1,gy+y1,0,H,'#c9bfa9',CR,CRR);face(g,'L',0,0,1,FH,TQ);face(g,'R',0,0,1,FH,hexShade(TQ,-.15));
    for(const sd of ['L','R']){const len=sd==='L'?x1-x0:y1-y0,m=Math.max(2,Math.round(len/.16));for(let k=0;k<m;k++){const u=k/m;for(let fl=1;fl<f;fl++)win(g,sd,u+.18/m,fl*FH+.8,.64/m,FH-1.8,sd==='L'?'#3d6a8a':'#355e7c');if(fins&&k>0)face(g,sd,u-.012,FH,.024,H-FH,sd==='L'?'#ffffff':'#ece4d2')}
      face(g,sd,0,H-2,1,2,CO);for(let k=0;k<m;k++){const [x,y]=fpt(g,sd,(k+.5)/m,H-1);circ(x,y,.8,on?'#ffe6a8':'#f6efe0',on)}}
    return [g,H]};
  const [gl,Hl]=blk(.14,.4,.6,1.08,6,false),[gr,Hr]=blk(1.36,.4,1.84,1.08,6,false);
  const [gc,Hc]=blk(.56,.22,1.4,1.16,9,true);
  // corona escalonada y letrero en la azotea
  const s1=box(gx+.66,gy+.32,gx+1.3,gy+1.06,Hc,4,'#c9bfa9',CR,CRR);face(s1,'L',0,0,1,1,TQ);face(s1,'R',0,0,1,1,hexShade(TQ,-.15));const s2=box(gx+.78,gy+.44,gx+1.18,gy+.94,Hc+4,4,'#c9bfa9',CR,CRR);face(s2,'L',0,3,1,1,CO);face(s2,'R',0,3,1,1,hexShade(CO,-.15));
  {const top=Hc+8,a=P(gx+.7,gy+1.0),b=P(gx+1.26,gy+1.0);for(const q of [a,b])px(q[0]-.3,q[1]-top-9,.6,9,'#5a5f6b');line(a[0],a[1]-top-9,b[0],b[1]-top-9,'#5a5f6b');
    for(let k=0;k<5;k++){const f=(k+.5)/5,x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f-top;px(x-1.3,y-8.6,2.6,5,on?'#ff6fae':'#e85d75',on);px(x-.6,y-7.6,1.2,3,on?'#ffd1e3':'#f6efe0',on)}if(on)glow((a[0]+b[0])/2,(a[1]+b[1])/2-top-6,16,.7,'#ff6fae')}
  // marquesina con foquitos, portero, taxi y palmas
  {const S=sidesOf(gx+.56,gy+.22,gx+1.4,gy+1.16);S.L.__s='L';prot(S.L,.3,.7,.24,FH+.2,1,TQ)}
  {const a=fpt(gc,'L',.3,FH+.2),b=fpt(gc,'L',.7,FH+.2);for(let k=0;k<=8;k++){const f=k/8;px(a[0]+(b[0]-a[0])*f-.5+3.8,a[1]+(b[1]-a[1])*f+1.9,1,1,on?'#ffe19a':'#efe6c4',on)}}
  dsort(gx,gy,[[1.0,1.36,()=>car(gx+1.0,gy+1.38,'#f2c94c',true)],[.74,1.24,()=>guy(gx+.74,gy+1.22,TQ)],[.24,1.5,()=>palm(gx+.24,gy+1.5,15)],[1.72,1.5,()=>palm(gx+1.72,gy+1.52,16)],[.6,1.8,()=>planter(gx+.6,gy+1.8,.34)],[1.4,1.8,()=>planter(gx+1.4,gy+1.8,.34)]])}

/* ---------- Ribera · Alberca pública (2×2): fosa con carriles, trampolín, chapoteadero, vestidores, sombrillas y salvavidas ---------- */
function artAlberca(t,gx,gy){const on=NIGHT>.2,c=DCOL(),s=t.s,open=NIGHT<.5;
  quad(gx,gy,.03,.03,1.97,1.97,'#e6e0d4');for(let k=1;k<10;k++){const a=P(gx+.03+k*.19,gy+.03),b=P(gx+.03+k*.19,gy+1.97);line(a[0],a[1],b[0],b[1],'#dcd5c6')}
  // vestidores al fondo
  const vg=cb(gx+.08,gy+.06,gx+1.92,gy+.34,0,9,'#f4f2ec','#ece8de');face(vg,'L',0,0,1,1.2,c);for(let k=0;k<6;k++){face(vg,'L',.06+k*.16,1.2,.08,5.4,'#3a3d45');face(vg,'L',.06+k*.16,7,.08,.8,k%2?c:'#f2b632')}face(vg,'L',.45,6.4,.3,2,c);for(let k=0;k<4;k++)face(vg,'L',.48+k*.065,6.8,.04,1.2,'#ffffff');
  // alberca: borde, agua, carriles
  const ax0=gx+.28,ay0=gy+.48,ax1=gx+1.62,ay1=gy+1.32;quad(gx,gy,.24,.44,1.66,1.36,'#f4f4f2');
  poly([P(ax0,ay0),P(ax1,ay0),P(ax1,ay1),P(ax0,ay1)],on?'#58c8f0':'#3fb2e0',on);quad(gx,gy,.28,.48,1.62,.56,'#2b8fc4');quad(gx,gy,.28,.48,.36,1.32,'#2f9ad0');
  for(let k=1;k<5;k++){const b=.48+k*.168,A=P(ax0,gy+b),B=P(ax1,gy+b);for(let q=0;q<14;q++){const f0=q/14,f1=(q+.6)/14;line(A[0]+(B[0]-A[0])*f0,A[1]+(B[1]-A[1])*f0,A[0]+(B[0]-A[0])*f1,A[1]+(B[1]-A[1])*f1,q%2?'#ffffff':'#e63946')}}
  if(!on)for(let k=0;k<10;k++){const r=hR(s,k),[x,y]=P(ax0+.1+r*(ax1-ax0-.2),ay0+.06+hR(s,k+20)*(ay1-ay0-.12));if(open&&k<7){px(x-.6,y-1,1.2,1,['#c98e62','#8d5a3b','#e0b48f'][k%3]);px(x-.6,y-1.4,1.2,.5,['#e63946','#f2b632','#2a6fb0','#ffffff'][k%4])}else px(x-1,y-.3,2,.3,'#bfe8f8')}
  if(on){for(const a of [.6,1.0,1.4]){const [x,y]=P(gx+a,gy+.9);glow(x,y,10,.4,'#7fe0ff')}}
  // trampolín y escalerilla
  {const [x,y]=P(gx+1.6,gy+.9);cb(gx+1.62,gy+.82,gx+1.72,gy+.98,0,7,'#f4f4f2');px(x-4,y-7.4,5,.8,c);px(x+3,y-7,.5,7,'#9aa0a8')}
  // chapoteadero
  {const [x,y]=P(gx+1.78,gy+1.62);ellipse(x,y,6,3,'#f4f4f2');ellipse(x,y,4.8,2.2,'#7fd6f0');if(!on&&open){px(x-1,y-1,1,1,'#e0b48f');px(x+1.5,y-.5,1,1,'#c98e62')}}
  // sombrillas, camastros, silla del salvavidas, palmas y barda
  dsort(gx,gy,[[.3,1.6,()=>umbH(gx+.3,gy+1.6,c,6,hexShade(c,-.15))],[.75,1.65,()=>umbH(gx+.75,gy+1.65,'#f2b632',6,'#d99a1c')],[1.2,1.62,()=>umbH(gx+1.2,gy+1.62,c,6,hexShade(c,-.15))],
    [.5,1.8,()=>cb(gx+.42,gy+1.76,gx+.6,gy+1.84,0,.8,'#ffffff')],[.95,1.82,()=>cb(gx+.88,gy+1.78,gx+1.06,gy+1.86,0,.8,'#ffffff')],
    [.16,.9,()=>{const [x,y]=P(gx+.16,gy+.9);px(x-1.2,y-7,.5,7,'#f4f4f2');px(x+.7,y-7,.5,7,'#f4f4f2');px(x-1.2,y-7.6,2.4,1,'#e63946');if(!on&&open){px(x-.6,y-10.5,1.4,1.4,'#c98e62');px(x-.8,y-9.2,1.8,1.8,'#e63946')}}],
    [1.86,.5,()=>palm(gx+1.86,gy+.5,14)],[.1,1.9,()=>palm(gx+.12,gy+1.88,13)]]);
  const E=edges4(gx,gy,.03,1.97);fenceE(E[2],3,'#9aa0a8','rgba(200,220,235,.25)',2);fenceE(E[3],3,'#9aa0a8','rgba(200,220,235,.25)',2)}
