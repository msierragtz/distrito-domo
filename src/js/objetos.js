const LAD=[{w:'#a8452c',b:'#5e2a1d',bal:'#f2efe8'},{w:'#b5533a',b:'#4a4a4a',bal:'#ece8e0'},{w:'#94402b',b:'#6b6b6b',bal:'#d9c6a5'}];
const EDI=[{w:'#eeebe4',b:'#b5653a',bal:'#7a5a3c'},{w:'#cfccc5',b:'#8c8f94',bal:'#7a5a3c'},{w:'#f3f0ea',b:'#9b9da3',bal:'#a0693f'},{w:'#e2d9cb',b:'#a8573a',bal:'#5f4630'}];
function forSale(gx,gy,lift){const [x,y]=P(gx+.5,gy+.5);px(x,y-10-lift,1,10,'#555');px(x+6,y-10-lift,1,10,'#555');px(x-2,y-19-lift,11,9,'#f26a21');px(x-1,y-18-lift,9,1,'#ffffff');
      px(x+2,y-16-lift,3,1,'#fff');px(x+1,y-15-lift,1,1,'#fff');px(x+2,y-14-lift,3,1,'#fff');px(x+5,y-13-lift,1,1,'#fff');px(x+2,y-12-lift,3,1,'#fff');px(x+3,y-17-lift,1,6,'#fff')}
function drawObj(t,gx,gy,ic){const kit=!ic&&!(t.b>0)&&kitFor(t),L=kit?lvOf(t):0;if(kit)kitBase(t,gx,gy,L);drawObj0(t,gx,gy,ic);if(kit)kitFront(t,gx,gy,L)}
function drawObj0(t,gx,gy,ic){
  const s=t.s,d=DEFS[t.k];WC=0;SEED=s+gx*7+gy*13;
  if(d&&t.b>0&&!ic){
    const p=1-t.b/t.bt,tall=d.per,H=tall?(d.f0*(t.k==='torre'?6:7)+3):(d.bt>=20?40:10);
    scaffold(gx,gy,tall?.12:.22,H*p);
    if(d.bt>=20)crane(gx,gy,H);
    return;
  }
  if(RIBV&&RIBART[t.k]){PSW=null;RIBART[t.k](t,gx,gy,ic?1:lvOf(t),ic);return}
  const ART={casaf:artCasaF,mixto:artMixto,ciclo:artCiclo,banco:artBanco,gas:artGas,parroquia:artParroquia,hotel:artHotel,alberca:artAlberca,malecon:artMalecon,_ofrenda:artOfrenda,_pino:artPino,_puesto:artPuesto,kiosco:trKiosco,mirador:trMirador,cultura:trCultura,teleferico:trTeleferico,bar:artBar,resto:artResto,cafe:artCafe,tomates:artTomates,padel:artPadel,escuela:artEscuela,beis:artBeis,museo:artMuseo,rasca:artRasca,bosque:artBosque,plazacom:artPlazaCom,metro:artMetro,barber:artBarber,unas:artUnas,gym:artGym,paleteria:artPaleteria,boliche:artBoliche,cine:artCine,golf:artGolf,clinica:artClinica,cancha:artCancha,parque:artParque,plaza:artPlaza,dogpark:artDog,estac:artEstac,caseta:artCaseta,oficinas:artOfi};
  if(ART[t.k]){const v=!ic&&VARP[t.k]?(t.s>>2)%4:0;PSW=v?VARP[t.k][v-1]:null;try{ART[t.k](t,gx,gy,ic?1:lvOf(t),ic)}finally{PSW=null}return}
  switch(t.k){
  case 'arbol':tree(gx+.5,gy+.5,.8+(s%4)*.08);break;
  case 'calle':if((gx*3+gy)%4===0){const [x,y]=P(gx+.16,gy+.5);px(x,y-13,1,13,'#4a4f5a');px(x-1,y-14,3,1,'#4a4f5a');px(x,y-13,1,1,NIGHT>.2?'#ffe19a':'#cfcfcf',NIGHT>.2);glow(x+.5,y-11,9,.55)}break;
  case 'palma':palm(gx+.3,gy+.35,13+(s%3)*2);palm(gx+.7,gy+.7,11+(s%4)*2);break;
  case 'edificio':case 'ladrillo':case 'torre':drawHousing(t,gx,gy,ic);break;
  case 'ajeno':{
    const sign=SIGNS[t.p];
    if(sign&&sign[0]===gx&&sign[1]===gy)forSale(gx,gy,0)
    else if(t.s%9===0)tree(gx+.5,gy+.5,.6);
    else if(t.s%4===1){for(const [a,b,z] of [[.35,.4,1],[.62,.6,.8],[.45,.7,.6]]){const [x,y]=P(gx+a,gy+b);px(x-2*z,y-3*z,4*z,3*z,'#6f8a4a');px(x-1.5*z,y-4*z,3*z,1,'#86a35a');px(x-2*z,y-1,4*z,1,'#566d38')}}
    break}
  case 'reserva':{
    const E=[[P(gx+.06,gy+.06),P(gx+.94,gy+.06)],[P(gx+.06,gy+.06),P(gx+.06,gy+.94)],[P(gx+.94,gy+.06),P(gx+.94,gy+.94)],[P(gx+.06,gy+.94),P(gx+.94,gy+.94)]];
    for(const [a,b] of E)for(let k=0;k<=8;k+=2){const f=k/8;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-3,1,3,k%4?'#f26a21':'#ffffff')}
    if(t.a===idx(gx,gy)){const [x,y]=P(gx+.5,gy+.5);px(x,y-14,1,14,'#555');px(x-8,y-22,17,9,'#f26a21');px(x-6,y-20,13,1,'#fff');
      if(t.p==='mercado'){px(x-5,y-18,3,3,'#ffd23f');px(x-1,y-18,3,3,'#2a9d8f');px(x+3,y-18,3,3,'#d62828')}else arcTop(x+.5,y-15,5,2,'#ffffff')}
    break}
  case 'lotedomo':{
    if(t.pu&&DIST==='ribera'){artLmSign(gx,gy);break}
    const E=[[P(gx+.06,gy+.06),P(gx+.94,gy+.06)],[P(gx+.06,gy+.06),P(gx+.06,gy+.94)],[P(gx+.94,gy+.06),P(gx+.94,gy+.94)],[P(gx+.06,gy+.94),P(gx+.94,gy+.94)]];
    for(const [a,b] of E)for(let k=0;k<=8;k++){const f=k/8;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-3,1,3,k%2?'#f26a21':'#ffffff')}
    const [x,y]=P(gx+.5,gy+.5);px(x,y-12,1,12,'#555');px(x-6,y-18,13,7,'#f26a21');
    arcTop(x+.5,y-12,4,1.5,'#ffffff');
    break}
  case 'fabrica':{
    const g=box(gx,gy,gx+1,gy+1,0,9,'#c9cdd2','#a9adb3','#8e9298');
    for(const f of [.2,.45,.7,.95]){const a=up(P(gx+f,gy),9),b=up(P(gx+f,gy+1),9);line(a[0],a[1],b[0],b[1],'#b6bbc1')}
    if(gy===OFF+13)face(g,'L',.1,2,.8,4,'#7d8288');
    if(t.p&&SIGNS[t.p]){const sg=SIGNS[t.p];if(sg[0]===gx&&sg[1]===gy)forSale(gx,gy,9)}
    if(chimney(gx,gy)){const c=cb(gx+.38,gy+.38,gx+.62,gy+.62,9,CHIM_H,'#b9b4ad');for(const v of [CHIM_H-10,CHIM_H-6])face(c,'L',0,v,1,2,'#c8452f'),face(c,'B',0,v,1,2,'#a5381f')}
    break}
  case 'tanque':case 'torreagua':{
    const [x,y]=P(gx+.5,gy+.5),h=ic?24:62,r=ic?9:14;
    px(x-7,y-h,3,h-1,'#e9e9e9');px(x+5,y-h,3,h-1,'#cfcfcf');px(x-1,y-h-2,3,h,'#f4f4f4');
    poly([[x-5,y-h],[x+5,y-h],[x+3,y-h+6],[x-3,y-h+6]],'#e2e2e2');
    {const cy=y-h-r*.7,main=ellRows(x,cy,r,r*.95),scx=x+r*.55,scy=y-h-r*.4,sh=[];
      for(const [a,yy,w] of main){const dy=(yy+.5-scy)/r;if(Math.abs(dy)<1){const hw=r*Math.sqrt(1-dy*dy),c0=Math.max(a,Math.round(scx-hw)),c1=Math.min(a+w,Math.round(scx+hw));if(c1>c0)sh.push([c0,yy,c1-c0])}}
      spans(main,'#f6f6f6');spans(sh,'#dcdcdc')}
    circ(x-r*.4,y-h-r*1.1,ic?1.5:2.5,'#ffffff');
    // cada torre de agua nueva lleva otro color: naranja, verde azulado, azul
    let ord=0;if(!ic&&t.k==='torreagua'){ord=1;const me=idx(gx,gy);for(let j=0;j<me;j++)if(S.g[j].k==='torreagua')ord++}
    const lc=['#f26a21','#2a9d8f','#3a6ea5','#c9a227','#9b5de5','#d62828'][ord%6];
    arcTop(x-r*.25,y-h-r*.55,r*.36,ic?1:2,lc);
    px(x-r*.05,y-h-r*.65,ic?3:6,1,'#5a5a5a');px(x-r*.05,y-h-r*.45,ic?3:5,1,'#5a5a5a');
    if(ord>0){const band=ellRows(x,y-h-r*.7,r,r*.95).filter(([a,yy])=>Math.abs(yy-(y-h-r*.05))<1.6);spans(band,lc)}
    break}
  case 'domo':{
    if(DIST==='ribera'){artAtirantado(gx,gy,ic);break}
    const [x,y]=P(gx+.5,gy+.5),R=ic?15:30;
    box(gx+.05,gy+.4,gx+.2,gy+.6,0,3,'#3a3a3a','#2b2b2b','#222');box(gx+.4,gy+.05,gx+.6,gy+.2,0,3,'#3a3a3a','#2b2b2b','#222');
    const on=!ic&&NIGHT>.25;arcTop(x,y-2,R+(ic?1.5:2.5),ic?3:5,on?'#e85f1c':'#f26a21',on);arcTop(x,y-2,R+(ic?1.5:2.5),1,on?'#ffc08a':'#ff9a5c',on);
    for(let k=0;k<=6;k++){const an=Math.PI*k/6;glow(x-Math.cos(an)*R,y-2-Math.sin(an)*R,9,.5,'#ff8a3a')}
    break}
  }
}
/* ---------- v79: kit de nivel. Lo mismo para todos los edificios con niveles, encima de su dibujo propio:
   banqueta alrededor (guarnición → adoquín → piedra con filo del color del distrito), vida al frente (maceta → farol → jardinera)
   y, donde el dibujo lo pide con corona(), un remate que rompe la silueta. Todo va dentro del sprite del edificio: no hay sprites de más. ---------- */
let KIT=true; // aprobado por Mauricio el 9 nov 2026
const distCol=()=>(RIBV||DIST==='ribera')?'#2bb3a3':'#f26a21';
const lvCol=()=>KIT?distCol():'#c9a227'; // acento del nivel 4 (antes dorado)
const KITNO=new Set(['parque','dogpark','plaza','estac','cancha','golf','padel','ciclo','gas','malecon','alberca','parroquia','hotel','domo','torreagua','caseta','calle']);
const kitFor=t=>{const d=DEFS[t.k];return KIT&&d&&LV[t.k]&&!d.obra&&!d.trophy&&!d.sz&&!KITNO.has(t.k)&&(d.per||isBiz(t.k)||t.k==='escuela'||t.k==='clinica'||t.k==='oficinas'||t.k==='banco')};
function ring(gx,gy,a,b,col){const o=[[a,a],[1-a,a],[1-a,1-a],[a,1-a]],n=[[b,b],[1-b,b],[1-b,1-b],[b,1-b]];
  for(let q=0;q<4;q++){const r=(q+1)%4;poly([P(gx+o[q][0],gy+o[q][1]),P(gx+o[r][0],gy+o[r][1]),P(gx+n[r][0],gy+n[r][1]),P(gx+n[q][0],gy+n[q][1])],col)}}
function kitBase(t,gx,gy,L){if(L<2)return;
  if(L===2){ring(gx,gy,0,.045,'#c9c2b4');return}
  if(L===3){ring(gx,gy,0,.09,'#c4ad8c');for(let q=0;q<10;q++){const u=.05+q*.1;for(const [a,b] of [[[u,0],[u,.09]],[[u,.91],[u,1]],[[0,u],[.09,u]],[[.91,u],[1,u]]]){const p0=P(gx+a[0],gy+a[1]),p1=P(gx+b[0],gy+b[1]);line(p0[0],p0[1],p1[0],p1[1],'#a8916f')}}return}
  ring(gx,gy,0,.1,'#b7b0a4');ring(gx,gy,.035,.06,'#d8d2c6');ring(gx,gy,.1,.13,distCol())}
function kitFront(t,gx,gy,L){if(L<2)return;
  // esquinas en pantalla: la de enfrente (B), la izquierda (Lc) y la derecha (R)
  const C=[[0,0],[1,0],[1,1],[0,1]].map(c=>({c,p:P(gx+c[0],gy+c[1])}));const B=C.reduce((m,q)=>q.p[1]>m.p[1]?q:m),Lc=C.reduce((m,q)=>q.p[0]<m.p[0]?q:m),R=C.reduce((m,q)=>q.p[0]>m.p[0]?q:m);
  const at=(A,k,ins=.07)=>{const cx=.5,cy=.5,x=A.c[0]+(B.c[0]-A.c[0])*k,y=A.c[1]+(B.c[1]-A.c[1])*k;return [gx+x+(cx-x)*ins*2,gy+y+(cy-y)*ins*2]};
  const pot=(f,col)=>{const [x,y]=P(f[0],f[1]);px(x-1.5,y-2,3,2,col);px(x-2.5,y-5,5,3,'#3f8f4a');px(x-1.5,y-6,3,1,'#6db56a')};
  if(L<4)pot(at(Lc,.3),'#9a5a3a');
  if(L>=3){const [x,y]=P(...at(R,.22));px(x,y-13,1,13,'#4a4f5a');px(x-1,y-14,3,2,'#ffe19a',NIGHT>.2);glow(x+.5,y-12,9,.6)}
  if(L===4){const f=at(Lc,.3,.09),[x,y]=P(f[0],f[1]);px(x-3,y-2,6,2,distCol());px(x-3,y-3,6,1,hexShade(distCol(),.25));tree(f[0],f[1],.42)}}
// remate: lo llama cada dibujo con el rectángulo de su azotea. Nivel 3: cornisa clara; nivel 4: corona del color del distrito, más ancha que el edificio
function corona(x0,y0,x1,y1,H,L,roof){if(!KIT||L<3)return;const c=L===4?distCol():'#efe9dc',o=L===4?.03:.02,hh=L===4?3:1.6;
  box(x0-o,y0-o,x1+o,y1+o,H-hh,hh,roof||'#bdb7ab',c,hexShade(c,-.18));
  if(L===4){box(x0-o,y0-o,x1+o,y1+o,H-hh-.8,.8,roof||'#bdb7ab','#fff3e0',hexShade('#fff3e0',-.15));if(NIGHT>.3){const [x,y]=P((x0+x1)/2,(y0+y1)/2);glow(x,y-H,16,.5,distCol())}}}
function drawNeed(gx,gy){
  if(Math.floor(T*2)%2)return;const [x,y]=P(gx+.5,gy+.5);
  circ(x,y-30,4.5,'#fff',true);px(x-.5,y-33,1,4,'#d64545',true);px(x-.5,y-28,1,1,'#d64545',true);
}
