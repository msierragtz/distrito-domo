/* ===== PALETERÍA, BOLICHE, CINE Y CAMPO DE GOLF (v63) ===== */
// marco local de un edificio de 2×1: u a lo largo (0..2), v a lo ancho (0..1); con t.o=1 va girado
function LF(t,gx,gy){const o=!!t.o,X=(u,v)=>o?gx+v:gx+u,Y=(u,v)=>o?gy+u:gy+v;
  return {X,Y,R:(u0,v0,u1,v1)=>{const a=X(u0,v0),b=Y(u0,v0),c=X(u1,v1),d=Y(u1,v1);return [Math.min(a,c),Math.min(b,d),Math.max(a,c),Math.max(b,d)]},
    p:(u,v)=>P(X(u,v),Y(u,v)),it:(u,v,fn)=>[X(u,v)-gx,Y(u,v)-gy,fn]}}
// la cara visible más larga de una caja: ahí va la fachada
const longSide=g=>Math.hypot(g.B[0]-g.L[0],g.B[1]-g.L[1])>=Math.hypot(g.R[0]-g.B[0],g.R[1]-g.B[1])?'L':'R';
const otherSide=s=>s==='L'?'R':'L';
function paletaIco(x,y,c,lit){px(x-1,y-4,2.5,3.5,c,lit);px(x-1,y-4,2.5,.6,hexShade(c,.3),lit);px(x-.1,y-.5,.6,1.6,'#e8d6b0',lit)}
function coneIco(x,y,s,c1,c2,lit){poly([[x-2*s,y-3*s],[x+2*s,y-3*s],[x,y+1.5*s]],'#d9a05b',lit);circ(x,y-3.6*s,1.9*s,c1,lit);circ(x+.6*s,y-5.4*s,1.4*s,c2,lit);px(x-.3*s,y-7.2*s,.8*s,.8*s,'#d62828',lit)}
function artPaleteria(t,gx,gy,L){
  if(L===1){ // carrito de paletas con sombrilla y campanita
    dsort(gx,gy,[
      [.48,.5,()=>{const g=cb(gx+.34,gy+.42,gx+.62,gy+.58,1.6,5,'#f4f4f4','#ffffff');face(g,'L',0,1,1,1.2,'#2a9d8f');face(g,'R',0,1,1,1.2,'#2a9d8f');
        for(let k=0;k<4;k++){const a=g.L,b=g.B,f=.15+k*.22;paletaIco(a[0]+(b[0]-a[0])*f+.5,a[1]+(b[1]-a[1])*f-1.6-3.2,['#ff6f91','#ffd23f','#7fd0ec','#f26a21'][k])}
        for(const [a,b] of [[.38,.58],[.6,.58]]){const [x,y]=P(gx+a,gy+b);circ(x,y-1,1.5,'#2b2b2b');circ(x,y-1,.5,'#999')}
        const [bx,by]=P(gx+.62,gy+.46);px(bx,by-9,.5,2,'#888');circ(bx+.2,by-9.5,1,'#f2c94c')}],
      [.76,.74,()=>{const [x,y]=P(gx+.76,gy+.74);person(x,y,{shirt:'#f4f4f4',pants:'#3b5a8a',skin:'#c68642',hair:'#2b1d14',front:true,scale:.9})}],
      [.3,.82,()=>stoolH(gx+.3,gy+.82,'#ff6f91')]]);
    {const [x,y]=P(gx+.5,gy+.48);px(x,y-14,.5,12,'#7a7a7a');parasol(x+.25,y-14,8,['#ff6f91','#ffffff'],1.2)}
    {const [x,y]=P(gx+.84,gy+.2);px(x,y-5,.5,5,'#6e4a2c');board(x-3.5,y-10,7.5,5,'#ffffff',[[1,1,5.5,'#ff6f91'],[1,2.5,3.5,'#2a9d8f'],[1,3.5,5,'#2b2b2b']])}
    return}
  if(L===2){ // paletería de barrio: congeladores a la vista y letrero con paleta
    const H=10,g=cb(gx+.16,gy+.18,gx+.68,gy+.7,0,H,'#f6f3ee','#d8d2c8');
    for(let k=0;k<8;k++){face(g,'L',k/8,H-2.4,1/8,1.6,k%2?'#ff6f91':'#ffffff');face(g,'R',k/8,H-2.4,1/8,1.6,k%2?'#ff6f91':'#ffffff')}
    win(g,'L',.06,1.2,.56,5,'#cfe8f2');face(g,'L',.08,1.2,.24,2,'#e8eef2');face(g,'L',.36,1.2,.24,2,'#e8eef2');face(g,'L',.09,3.2,.22,.4,'#7fd0ec');face(g,'L',.37,3.2,.22,.4,'#ffd23f');
    face(g,'L',.7,0,.22,6.2,'#2a9d8f');face(g,'L',.72,.5,.18,5.4,'#bfe3df');
    win(g,'R',.15,1.5,.6,4.5,'#c4e2ee');
    box(gx+.14,gy+.16,gx+.7,gy+.72,H,.8,'#cfc8bc','#bdb6a8','#aaa394');
    {const [x,y]=P(gx+.42,gy+.72);px(x-4,y-H-6.5,8,5,'#2a9d8f');paletaIco(x-1.5,y-H-1.6,'#ff6f91',NIGHT>.2);paletaIco(x+2,y-H-1.6,'#ffd23f',NIGHT>.2);glow(x,y-H-4,8,.6)}
    dsort(gx,gy,[[.84,.34,()=>bench(gx+.84,gy+.36,'#2a9d8f')],[.82,.72,()=>flowerPot(gx+.82,gy+.72,'#ff6f91')],[.3,.86,()=>{const [x,y]=P(gx+.3,gy+.86);px(x,y-5,.5,5,'#6e4a2c');board(x-3,y-10,6.5,5,'#ffffff',[[1,1,4.5,'#ff6f91'],[1,2.5,3,'#2a9d8f']])}]]);
    return}
  if(L===3){ // nevería artesanal: menta, toldo y cono gigante
    const H=12,g=cb(gx+.14,gy+.14,gx+.68,gy+.7,0,H,'#9fe0c9','#e8e2d6');
    face(g,'L',0,0,1,1,'#5fb89a');face(g,'R',0,0,1,1,'#4fa58a');
    win(g,'L',.06,1.4,.56,5.2,'#e9f6f2');for(const [u,c] of [[.12,'#ff9ab4'],[.24,'#fff1b8'],[.36,'#c9a0dc'],[.48,'#8a5a3a']])face(g,'L',u,2,.08,1.2,c);
    face(g,'L',.68,0,.24,6.6,'#3f7f6a');face(g,'L',.7,.5,.2,5.6,'#d6f0e8');
    win(g,'R',.14,1.5,.66,5,'#dff2ec');
    awningL(g,.04,.96,6.8,'#ff9ab4','#ffffff');
    face(g,'L',.14,H-3.4,.72,2.4,'#ffffff');face(g,'L',.2,H-2.8,.5,.6,'#3f7f6a');face(g,'L',.2,H-1.9,.34,.5,'#ff6f91');
    box(gx+.12,gy+.12,gx+.7,gy+.72,H,1,'#fff6e8','#e8dccb','#d8ccba');
    {const [x,y]=P(gx+.4,gy+.42);coneIco(x,y-H-2,2.2,'#ff9ab4','#fff1b8',NIGHT>.2);glow(x,y-H-8,9,.5)}
    dsort(gx,gy,[[.84,.34,()=>{tableH(gx+.84,gy+.34,'#ffffff');chairH(gx+.9,gy+.28,'#ff9ab4')}],[.82,.74,()=>planter(gx+.82,gy+.74,.36)],[.3,.86,()=>bench(gx+.3,gy+.86,'#ff9ab4')]]);
    return}
  // Heladería del Domo: dos pisos retro, cono gigante en la azotea y terraza
  const H=17,g=cb(gx+.12,gy+.12,gx+.7,gy+.72,0,H,'#ffd1dc','#e8d6d2');
  face(g,'L',0,0,1,.8,'#d97a94');face(g,'R',0,0,1,.8,'#c86a84');
  face(g,'L',.04,.8,.92,6.4,'#9fe0c9');win(g,'L',.07,1.2,.86,5.6,'#fff6e8');face(g,'L',.5,1.2,.015,5.6,'#9fe0c9');
  face(g,'R',.06,.8,.6,6.4,'#9fe0c9');win(g,'R',.08,1.2,.56,5.6,'#fff0e0');
  for(let k=0;k<10;k++)face(g,'L',k/10,7.4,.1,1.4,k%2?'#ff6f91':'#ffffff');
  for(const u of [.12,.42,.72])win(g,'L',u,9.6,.18,4.6,'#d6eef6');win(g,'R',.2,9.6,.5,4.6,'#cfe8f2');
  box(gx+.1,gy+.1,gx+.72,gy+.74,H,1,'#f4ece2','#e2d8cc','#d2c8bc');
  lifted(H+1,()=>{dsort(gx,gy,[[.3,.3,()=>{const [x,y]=P(gx+.32,gy+.32);coneIco(x,y-3,2.3,'#ff9ab4','#9fe0c9',NIGHT>.2);glow(x,y-11,10,.7,'#ff9ab4')}],[.56,.58,()=>umbH(gx+.56,gy+.58,'#9fe0c9',5,'#7fcfb6')],[.6,.3,()=>{tableH(gx+.62,gy+.3,'#ffffff');chairH(gx+.68,gy+.26,'#ff6f91')}]])});
  dsort(gx,gy,[[.86,.32,()=>flowerPot(gx+.86,gy+.32,'#ff6f91')],[.84,.7,()=>{tableH(gx+.84,gy+.7,'#ffffff');chairH(gx+.9,gy+.64,'#9fe0c9')}],[.36,.88,()=>bench(gx+.36,gy+.88,'#ff6f91')]]);
}

/* boliche: pino y bola de letrero */
function pinIco(x,y,s,lit){ellipse(x,y-2.2*s,1.6*s,2.2*s,'#ffffff',lit);ellipse(x,y-5.4*s,.9*s,1.4*s,'#ffffff',lit);px(x-.9*s,y-4.3*s,1.8*s,.5*s,'#d62828',lit);px(x-.9*s,y-3.6*s,1.8*s,.4*s,'#d62828',lit);circ(x,y-7*s,.9*s,'#ffffff',lit)}
function ballIco(x,y,s,c,lit){circ(x,y-2*s,2*s,c,lit);px(x-.6*s,y-2.8*s,.5*s,.5*s,'#1c1c1c',lit);px(x+.3*s,y-2.9*s,.5*s,.5*s,'#1c1c1c',lit);px(x-.1*s,y-2.1*s,.5*s,.5*s,'#1c1c1c',lit)}
function artBoliche(t,gx,gy,L){const F=LF(t,gx,gy),on=NIGHT>.2;
  const H=[0,11,13,13,15][L],wall=['','#f2e6c9','#3a6ea5','#2a1f4a','#1f1f22'][L],top=['','#c9b38a','#2c5585','#1c1533','#3a2c20'][L];
  const g=cb(...F.R(.12,.14,1.88,.78),0,H,wall,top),S1=longSide(g),S2=otherSide(S1);
  if(L===1){face(g,S1,0,0,1,1,'#b5322b');face(g,S2,0,0,1,1,'#9a2a24');face(g,S1,0,H-3,1,1.4,'#d62828');face(g,S2,0,H-3,1,1.4,'#b5322b');
    face(g,S1,.42,0,.14,6,'#2a2420');face(g,S1,.44,.5,.1,5,'#c9a46a');for(const u of [.1,.22,.62,.76])win(g,S1,u,2,.08,3.5,'#ffd27a');win(g,S2,.2,2,.6,3.5,'#f2c97e')}
  else if(L===2){face(g,S1,0,0,1,1,'#2c5585');face(g,S1,.06,1,.88,5.6,'#1c2a40');win(g,S1,.08,1.4,.84,4.8,'#bcd6e6');
    for(let k=0;k<5;k++)face(g,S1,.12+k*.16,1.4,.1,.9,'#c9a46a');face(g,S1,0,H-3.4,1,2.2,'#f2c94c');face(g,S1,.3,H-2.9,.4,.6,'#2c5585');face(g,S1,.3,H-2.1,.28,.4,'#2c5585');
    win(g,S2,.15,1.6,.7,4.4,'#aecbdc')}
  else if(L===3){for(let k=0;k<3;k++){face(g,S1,0,2+k*3.6,1,.5,['#ff4fd8','#38e8ff','#ffe14f'][k],on);face(g,S2,0,2+k*3.6,1,.5,['#ff4fd8','#38e8ff','#ffe14f'][k],on)}
    face(g,S1,.4,0,.2,6,'#0e0a1c');face(g,S1,.42,.5,.16,5,'#38e8ff',on);for(const [u,v] of [[.1,9],[.22,6],[.7,10],[.84,6.5],[.58,8.5]])px(...(()=>{const a=g[S1==='L'?'L':'B'],b=g[S1==='L'?'B':'R'];return [a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u-v]})(),1,1,'#ffffff',on);
    {const a=F.p(1,.46);glow(a[0],a[1]-H/2,18,.9,'#ff4fd8')}}
  else{face(g,S1,0,0,1,7,'#2b2b2b');win(g,S1,.04,.6,.92,5.8,'#ffcf87');for(let k=1;k<6;k++)face(g,S1,k/6,.6,.01,5.8,'#2b2b2b');
    for(let u=.03;u<1;u+=.05)face(g,S1,u,7.6,.025,H-8,'#8a5f34');face(g,S1,.3,H-2.6,.4,.8,'#c9a227',on);win(g,S2,.1,1,.8,5.4,'#f2c98a')}
  box(...F.R(.1,.12,1.9,.8),H,.8,top,hexShade(top,-.1),hexShade(top,-.2));
  // letrero: pino gigante en la azotea
  {const a=F.p(1.45,.46),y=a[1]-H-.8;pinIco(a[0],y,L>=3?1.8:1.5,on);if(L>=2)ballIco(a[0]+5,y,1.2,L===3?'#ff4fd8':'#2f6db5',on);glow(a[0],y-8,10,.6,L===3?'#38e8ff':'#ffd27a')}
  if(L===4){const a=F.p(.25,.2),b=F.p(1.15,.2);bulbsH([a[0],a[1]-H-6],[b[0],b[1]-H-6],7,1.5);lifted(H+.8,()=>dsort(gx,gy,[F.it(.4,.5,()=>umbH(F.X(.4,.5),F.Y(.4,.5),'#c9a227',5)),F.it(.8,.5,()=>planter(F.X(.8,.5),F.Y(.8,.5),.3))]))}
  dsort(gx,gy,[F.it(1.92,.9,()=>planter(F.X(1.92,.9),F.Y(1.92,.9),.34)),F.it(.06,.9,()=>bench(F.X(.06,.9),F.Y(.06,.9),L===3?'#ff4fd8':'#a0663a'))]);
}

/* cine: marquesina con focos */
function marquee(g,side,u0,u1,v,col,on){face(g,side,u0,v,u1-u0,2.6,col);face(g,side,u0+.02,v+.6,u1-u0-.04,1.3,'#fff6d8',on);
  const a=side==='L'?g.L:g.B,b=side==='L'?g.B:g.R;for(let k=0;k<=10;k++){const u=u0+(u1-u0)*k/10;px(a[0]+(b[0]-a[0])*u-.3,a[1]+(b[1]-a[1])*u-g.lift-v-3.2,.8,.8,on?'#ffe9a8':'#f2d675',on)}}
function artCine(t,gx,gy,L){const F=LF(t,gx,gy),on=NIGHT>.2;
  const H=[0,14,16,18,24][L],wall=['','#efe2c4','#d9cdb4','#5a6068','#1c1c1f'][L],top=['','#c9b38a','#b8ab92','#3e444c','#2b2b2b'][L];
  const g=cb(...F.R(.12,.14,1.88,.8),0,H,wall,top),S1=longSide(g),S2=otherSide(S1);
  if(L===1){face(g,S1,0,0,1,1.2,'#b5322b');face(g,S2,0,0,1,1.2,'#9a2a24');for(const u of [.15,.5,.85])face(g,S1,u-.015,1.2,.03,H-1.2,'#d9c69c');
    face(g,S1,.38,0,.24,6.2,'#2a2420');face(g,S1,.4,.5,.2,5.2,'#7a1f1f');marquee(g,S1,.28,.72,7,'#d62828',on);win(g,S2,.25,8,.5,3.5,'#f2c97e');
    {const a=F.p(1.6,.8);px(a[0]-1.5,a[1]-H-6,3,12,'#d62828');for(let k=0;k<4;k++)px(a[0]-.7,a[1]-H-4.6+k*2.6,1.4,1.4,on?'#ffe9a8':'#f4efe2',on);glow(a[0],a[1]-H,8,.7,'#ffd27a')}}
  else if(L===2){face(g,S1,0,0,1,1.2,'#7a1f1f');face(g,S2,0,0,1,1.2,'#661a1a');
    for(let k=0;k<4;k++){face(g,S1,.08+k*.23,1.8,.14,4.6,'#2b2b2b');face(g,S1,.09+k*.23,2.1,.12,4,['#e63946','#2f6db5','#f2c94c','#2a9d8f'][k],on)}
    marquee(g,S1,.2,.8,8,'#7a1f1f',on);win(g,S2,.15,9,.7,3.5,'#e8d6a8');face(g,S1,.3,H-3,.4,1.6,'#2b2b2b');face(g,S1,.34,H-2.6,.32,.8,'#ffd27a',on)}
  else if(L===3){face(g,S1,.04,0,.6,6.4,'#1f2226');win(g,S1,.06,.4,.56,5.6,'#bcd6e6');
    {const C=['#ff4f6d','#ff9f40','#ffe14f','#4fd1ff','#9b5de5'];for(let k=0;k<5;k++)face(g,S1,.66+k*.06,4,.06,H-5.5,C[k],on);face(g,S1,.66,3.4,.3,.6,'#1c1c1c')}
    face(g,S1,.06,H-3,.5,1.4,'#1c1c1c');face(g,S1,.1,H-2.6,.4,.6,'#ffffff',on);win(g,S2,.1,1,.8,5,'#aecbdc');
    {const a=F.p(1.4,.8);glow(a[0],a[1]-H/2,14,.8,'#ff9f40')}}
  else{face(g,S1,0,0,1,1,'#7a1f1f');face(g,S1,.3,0,.4,7,'#c9a227');face(g,S1,.32,.4,.36,6.2,'#1c1c1c');win(g,S1,.34,.6,.32,5.6,'#ffd9a0');
    for(const u of [.08,.18,.76,.86]){face(g,S1,u,1,.06,H-3,'#c9a227',on)}marquee(g,S1,.26,.74,8,'#c9a227',on);face(g,S1,.3,H-4,.4,2.4,'#c9a227',on);face(g,S1,.34,H-3.4,.32,1.2,'#1c1c1c');
    win(g,S2,.2,3,.6,H-8,'#3d4a5c');
    {const a=F.p(1,1.02),b=F.p(1,.82);poly([[a[0]-4,a[1]],[a[0]+4,a[1]],[b[0]+3,b[1]],[b[0]-3,b[1]]],'#b5122b')}}
  box(...F.R(.1,.12,1.9,.82),H,1,top,hexShade(top,-.1),hexShade(top,-.2));
  if(L===4){for(const [u,dx] of [[.4,-1],[1.6,1]]){const a=F.p(u,.5);px(a[0]-1,a[1]-H-4,2,3,'#3a3a3a');if(on){ctx.save();ctx.globalAlpha=.1*NIGHT;poly([[a[0]-.8,a[1]-H-4],[a[0]+.8,a[1]-H-4],[a[0]+dx*7+3,a[1]-H-38],[a[0]+dx*7-3,a[1]-H-38]],'#fff3c4',true);ctx.restore()}}}
  dsort(gx,gy,[F.it(1.94,.92,()=>lamp(F.X(1.94,.92),F.Y(1.94,.92))),F.it(.06,.92,()=>planter(F.X(.06,.92),F.Y(.06,.92),.34))]);
}

/* campo de tiro de golf: pasto en toda la huella, casita de salida y banderas */
function golfFlag(fx,fy,c){const [x,y]=P(fx,fy);ellipse(x,y,2.6,1.2,'#d8f0c0');px(x,y-7,.5,7,'#f4f4f4');poly([[x+.5,y-7],[x+3.5,y-6],[x+.5,y-5]],c)}
function artGolf(t,gx,gy,L){const F=LF(t,gx,gy),on=NIGHT>.2;
  // pasto con franjas y tapete de salida
  for(let k=0;k<8;k++)poly([F.p(.04+k*.24,.06),F.p(.28+k*.24,.06),F.p(.28+k*.24,.94),F.p(.04+k*.24,.94)].map(q=>q),k%2?'#6fbf4f':'#64b247');
  poly([F.p(.04,.06),F.p(.5,.06),F.p(.5,.94),F.p(.04,.94)],L>=3?'#7a8a5a':'#8aa060');
  for(const [u,v,r] of [[1.2,.5,.12],[1.6,.3,.1],[1.75,.72,.09]]){const c=F.p(u,v);ellipse(c[0],c[1],r*40,r*20,'#d8f0c0');ellipse(c[0],c[1],r*24,r*12,'#c4e6a8')}
  for(let k=0;k<6;k++){const c=F.p(.7+k*.18,.2+((k*37)%60)/100);px(c[0],c[1]-.6,.8,.8,'#ffffff')}
  const items=[F.it(1.2,.5,()=>golfFlag(F.X(1.2,.5),F.Y(1.2,.5),'#d62828')),F.it(1.6,.3,()=>golfFlag(F.X(1.6,.3),F.Y(1.6,.3),'#f2c94c')),F.it(1.75,.72,()=>golfFlag(F.X(1.75,.72),F.Y(1.75,.72),'#2f6db5'))];
  // red al fondo y a los lados
  {const nh=[0,7,12,14,14][L],E=[[[.6,.04],[1.96,.04],4],[[1.96,.04],[1.96,.96],2]];
    for(const [a,b,n] of E){const A=F.p(...a),B=F.p(...b);for(let k=0;k<=n;k++){const f=k/n,x=A[0]+(B[0]-A[0])*f,y=A[1]+(B[1]-A[1])*f;px(x,y-nh,.5,nh,'#b8bec4')}line(A[0],A[1]-nh,B[0],B[1]-nh,'#d8dde2')}}
  // casita de salida según el nivel
  if(L===1){const g=cb(...F.R(.1,.2,.42,.8),0,6,'#f4efe2','#2f7d55');const s=longSide(g);face(g,s,.1,0,.8,4,'#3a3a3a');face(g,s,.14,.4,.72,3.2,'#2a9d8f');box(...F.R(.08,.18,.44,.82),6,.8,'#2f7d55','#24684a','#1c5a3f')}
  else if(L===2){const g=cb(...F.R(.08,.1,.46,.9),0,7,'#e8e4dc','#3a6ea5');const s=longSide(g);for(let k=0;k<4;k++)face(g,s,.05+k*.24,.4,.18,5,'#2a2a2a');box(...F.R(.06,.08,.48,.92),7,.8,'#3a6ea5','#2c5585','#22466e')}
  else{const g=cb(...F.R(.06,.08,.48,.92),0,L===4?12:11,'#f4efe2','#2f7d55');const s=longSide(g);for(let k=0;k<4;k++){face(g,s,.05+k*.24,.4,.18,4.4,'#2a2a2a');win(g,s,.05+k*.24,6,.18,3.6,'#ffd9a0')}
    box(...F.R(.04,.06,.5,.94),L===4?12:11,1,'#2f7d55','#24684a','#1c5a3f');
    if(L===4){items.push(F.it(.3,1.02,()=>{const [x,y]=P(F.X(.3,1.02),F.Y(.3,1.02));px(x-3,y-3,6,2.5,'#f4f4f4');px(x-3,y-5,6,.6,'#2f7d55');px(x-2.5,y-1,1.2,1,'#1c1c1c');px(x+1.5,y-1,1.2,1,'#1c1c1c')}),F.it(.04,.04,()=>palm(F.X(.02,.02),F.Y(.02,.02),14)))}}
  if(L>=2)for(const u of [.6,1.95])items.push(F.it(u,1,()=>{const [x,y]=P(F.X(u,1),F.Y(u,1));px(x,y-22,.7,22,'#6b7078');px(x-2,y-23,4.5,1.6,on?'#fff6d0':'#cfd3d8',on);glow(x,y-20,14,.8)}));
  items.push(F.it(.55,.5,()=>{for(const v of [.25,.5,.75]){const [x,y]=P(F.X(.55,v),F.Y(.55,v));person(x,y,{shirt:['#f4f4f4','#2f6db5','#e63946'][Math.round(v*4)%3],pants:'#c9b38a',skin:'#c68642',hair:'#2b1d14',front:false,scale:.8})}}));
  dsort(gx,gy,items);
}

