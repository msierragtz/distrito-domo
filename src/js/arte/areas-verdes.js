/* ===== PARQUE ===== */
function slide(fx,fy){const [x,y]=P(fx,fy);px(x-3,y-9,.5,9,'#d62828');px(x-1,y-9,.5,9,'#d62828');for(let v=2;v<9;v+=2)px(x-3,y-v,2.5,.5,'#d62828');px(x-3.5,y-10,3.5,1,'#f2c94c');line(x-.5,y-9,x+5,y-1,'#2f6db5',false,2)}
function swings(fx,fy){const [x,y]=P(fx,fy);line(x-6,y,x-4,y-10,'#3a6ea5');line(x-2,y,x-4,y-10,'#3a6ea5');line(x+4,y,x+6,y-10,'#3a6ea5');line(x+8,y,x+6,y-10,'#3a6ea5');px(x-4,y-10.5,10,1,'#3a6ea5');
  for(const sx of [-1,3]){px(x+sx,y-10,.5,6,'#777');px(x+sx+1.5,y-10,.5,6,'#777');px(x+sx-.5,y-4,3,.75,'#f26a21')}}
function willow(fx,fy){const [x,y]=P(fx,fy);px(x-.5,y-8,1.5,8,'#6e4a2c');circ(x,y-11,5,'#6d9a45');for(let k=-4;k<=4;k+=1.5)px(x+k,y-11+Math.abs(k)*.3,.5,6-Math.abs(k)*.5,k%3?'#8bb35a':'#5c8a3a');circ(x-1,y-13,3,'#8bb35a')}
function artParque(t,gx,gy,L){
  if(L===1){dsort(gx,gy,[[.28,.28,()=>tree(gx+.28,gy+.28,.8)],[.72,.68,()=>tree(gx+.72,gy+.68,.75)],[.66,.32,()=>bench(gx+.66,gy+.32)],[.3,.72,()=>{const [x,y]=P(gx+.3,gy+.72);px(x,y,1,1,'#fff27a');px(x+3,y+1,1,1,'#ff8fb1')}]]);return}
  if(L===2){poly([P(gx+.5,gy+.55),P(gx+.85,gy+.55),P(gx+.85,gy+.88),P(gx+.5,gy+.88)],'#e8d29c');
    dsort(gx,gy,[[.2,.22,()=>tree(gx+.2,gy+.22,.7)],[.82,.18,()=>tree(gx+.82,gy+.18,.62)],[.4,.4,()=>swings(gx+.42,gy+.42)],[.68,.72,()=>slide(gx+.68,gy+.72)],[.24,.78,()=>bench(gx+.24,gy+.78)]]);return}
  if(L===3){for(const [a0,b0,a1,b1] of [[.44,.04,.56,.96],[.04,.44,.96,.56]])poly([P(gx+a0,gy+b0),P(gx+a1,gy+b0),P(gx+a1,gy+b1),P(gx+a0,gy+b1)],'#d8cfbf');
    {const [x,y]=P(gx+.5,gy+.5);ellipse(x,y,7,3.5,'#b9b3a7');ellipse(x,y-.5,6,3,'#4fa6d8');ellipse(x-1,y-1,3,1.5,'#8fd3ff');px(x-.5,y-6,1,5.5,'#bfe6ff',true);px(x-1.5,y-6.5,3,1,'#e0f4ff',true)}
    dsort(gx,gy,[...[[.2,.2],[.8,.2],[.2,.8],[.8,.8]].map(([a,b])=>[a,b,()=>{tree(gx+a,gy+b,.6);flowers(gx,gy,a-.12,b-.12,a+.12,b+.12,a*10+b)}]),
      [.62,.34,()=>bench(gx+.64,gy+.32,'#7a5a3c')],[.36,.68,()=>bench(gx+.34,gy+.68,'#7a5a3c')],[.3,.48,()=>lamp(gx+.32,gy+.4,9)]]);return}
  // parque con lago
  {const [x,y]=P(gx+.54,gy+.56);ellipse(x,y,11,5.5,'#7a9e5a');ellipse(x,y,10,5,'#3f8fc4');ellipse(x-1,y-.5,8,4,'#4fa6d8');px(x-5,y-1,3,.5,'#bfe9ff');px(x+2,y+1.5,4,.5,'#bfe9ff');
    px(x+4,y-2,3,1.5,'#f4f4f4');px(x+4.5,y-3,1,1,'#f4f4f4');px(x+7,y-2.5,.5,.5,'#f2a33a');px(x-6,y+1,2,1,'#f4f4f4')}
  {const a=P(gx+.3,gy+.56),b=P(gx+.42,gy+.56);for(let k=0;k<5;k++){const f=k/4,x=a[0]+(b[0]-a[0])*f,y=a[1]+(b[1]-a[1])*f-1.5-Math.sin(f*Math.PI)*1.5;px(x-1,y,2.5,1,'#a0663a');px(x-1,y-1.5,.5,1.5,'#7a4e2c')}}
  dsort(gx,gy,[[.16,.22,()=>willow(gx+.16,gy+.22)],[.84,.2,()=>willow(gx+.86,gy+.2)],[.2,.86,()=>tree(gx+.2,gy+.86,.6)],[.86,.86,()=>bench(gx+.86,gy+.86)]]);
}

/* ===== PLAZA ===== */
function gazebo(fx,fy,col){for(const [a,b] of [[-.12,-.12],[.12,-.12],[-.12,.12],[.12,.12]]){const [x,y]=P(fx+a,fy+b);px(x,y-8,.5,8,'#f4f4f4')}cb(fx-.14,fy-.14,fx+.14,fy+.14,0,1,'#d9d4ca');const [x,y]=P(fx,fy);ellipse(x,y-8,6,3,hexShade(col,-.2));arcTop(x,y-8,5.5,5.5,col);arcTop(x-1,y-9,3,1,hexShade(col,.3));px(x-.25,y-14.5,.5,1.5,'#f4f4f4')}
function artPlaza(t,gx,gy,L){
  if(L===1){dsort(gx,gy,[[.5,.5,()=>gazebo(gx+.5,gy+.5,'#2f6db5')],[.18,.7,()=>bench(gx+.18,gy+.7,'#9aa0a8')],[.76,.24,()=>bench(gx+.78,gy+.22,'#9aa0a8')],[.8,.8,()=>lamp(gx+.82,gy+.8)]]);return}
  if(L===2){{const [x,y]=P(gx+.5,gy+.5);ellipse(x,y,8,4,'#cbb894');ellipse(x,y-.5,7,3.5,'#4fa6d8');cb(gx+.46,gy+.46,gx+.54,gy+.54,0,3,'#cbb894');ellipse(x,y-4,3,1.5,'#4fa6d8');px(x-.5,y-8,1,4,'#bfe6ff',true);px(x-1.5,y-8.5,3,1,'#e0f4ff',true)}
    dsort(gx,gy,[[.16,.5,()=>cb(gx+.12,gy+.36,gx+.2,gy+.64,0,2,'#d9c6a5')],[.5,.86,()=>cb(gx+.36,gy+.82,gx+.64,gy+.9,0,2,'#d9c6a5')],[.16,.16,()=>lamp(gx+.14,gy+.14)],[.86,.86,()=>lamp(gx+.88,gy+.88)]]);return}
  if(L===3){dsort(gx,gy,[
      [.5,.5,()=>{cb(gx+.4,gy+.4,gx+.6,gy+.6,0,2,'#d9d4ca');const [x,y]=P(gx+.5,gy+.5);poly([[x-4,y-2],[x-1,y-2],[x+3,y-16],[x,y-16]],'#f26a21');poly([[x-1,y-2],[x+4,y-2],[x+5,y-12],[x+2,y-14]],'#d1561a');circ(x+5,y-17,2.5,'#f26a21')}],
      [.16,.2,()=>planter(gx+.16,gy+.2,.5)],[.84,.8,()=>planter(gx+.84,gy+.8,.5)],
      [.2,.72,()=>cb(gx+.12,gy+.66,gx+.3,gy+.76,0,1.5,'#2b2b2b')],[.74,.24,()=>cb(gx+.7,gy+.12,gx+.8,gy+.32,0,1.5,'#2b2b2b')]]);return}
  // paseo comercial
  dsort(gx,gy,[
    [.18,.3,()=>{const g=cb(gx+.04,gy+.06,gx+.3,gy+.5,0,8,'#f4f2ee','#c9c5bd');win(g,'L',.1,.5,.8,4,'#ffe2a8');win(g,'R',.1,.5,.8,4,'#f2d090');for(let k=0;k<4;k++)face(g,'L',k/4,5,.25,1.5,k%2?'#fff':'#d62828')}],
    [.3,.18,()=>{const g=cb(gx+.34,gy+.04,gx+.7,gy+.26,0,8,'#e9c46a','#c9c5bd');win(g,'L',.1,.5,.8,4,'#ffe2a8');win(g,'R',.1,.5,.8,4,'#f2d090');for(let k=0;k<4;k++)face(g,'L',k/4,5,.25,1.5,k%2?'#fff':'#2a9d8f')}],
    [.6,.6,()=>{for(const [a,b] of [[.42,.42],[.92,.42],[.42,.92],[.92,.92]]){const [x,y]=P(gx+a,gy+b);px(x,y-10,1,10,'#4a3a2c')}
      for(let k=0;k<6;k++){const b=.44+k*.095,A=P(gx+.4,gy+b),B=P(gx+.94,gy+b);line(A[0],A[1]-10,B[0],B[1]-10,'#7a5a3c')}
      {const a=P(gx+.42,gy+.42),b=P(gx+.92,gy+.92);bulbsH([a[0],a[1]-10],[b[0],b[1]-10],8,3)}}],
    [.62,.7,()=>{chairH(gx+.7,gy+.64,'#2b2b2b');tableH(gx+.62,gy+.7,'#f4f4f4')}]]);
}

/* ===== DOG PARK (los perros que corren se dibujan en vivo) ===== */
function artDog(t,gx,gy,L){
  if(L===1){fenced(gx,gy,.05,5,'#8d9299','rgba(190,196,204,.25)',()=>{
      dsort(gx,gy,[[.8,.22,()=>tree(gx+.8,gy+.22,.62)],[.22,.5,()=>{const [x,y]=P(gx+.22,gy+.5);px(x-.5,y-5,1.5,5,'#9aa0a8');px(x-1.5,y-5.5,3.5,.5,'#c2c7cd');px(x-.5,y-6,1.5,.5,'#5fb3e6')}],[.3,.82,()=>bench(gx+.3,gy+.82,'#9aa0a8')]]);
    });return}
  if(L===2){poly([P(gx+.1,gy+.1),P(gx+.52,gy+.1),P(gx+.52,gy+.48),P(gx+.1,gy+.48)],'#c9ae7c');
    fenced(gx,gy,.05,4,'#8d9299','rgba(190,196,204,.18)',()=>{
      dsort(gx,gy,[
        [.3,.28,()=>{const A=P(gx+.14,gy+.28),B=P(gx+.46,gy+.28),M=P(gx+.3,gy+.28);poly([A,[M[0],M[1]-9],M],'#f2c230');poly([[M[0],M[1]-9],B,M],'#3a6ea5');px(M[0]-4,M[1]-4,2.5,.5,'#ffffff');px(M[0]+2,M[1]-4,2.5,.5,'#ffffff')}],
        [.76,.3,()=>{const [x,y]=P(gx+.76,gy+.3);arcTop(x,y,6,2.5,'#d62828');arcTop(x,y,6,.5,'#ff8a8a');px(x-2,y-1.5,4.5,1.5,'#5a1010')}],
        [.26,.8,()=>{const [x,y]=P(gx+.26,gy+.8);px(x-3,y-8,.5,8,'#3a6ea5');px(x+3,y-8,.5,8,'#3a6ea5');px(x-3,y-8,6.5,.5,'#3a6ea5');circ(x+.25,y-4,2.5,'#2b2b2b');circ(x+.25,y-4,1,'#86c95a')}],
        ...[.56,.68,.8].map((a,k)=>[a,.74+k*.05,()=>{const [x,y]=P(gx+a,gy+.74+k*.05);for(let v=0;v<7;v+=1.5)px(x,y-v-1.5,.5,1.5,v%3?'#ffffff':'#d62828')}]),
        ]);
    });return}
  if(L===3){fenced(gx,gy,.05,4,'#8a5a34',null,()=>{
      dsort(gx,gy,[
        [.28,.28,()=>{const g=cb(gx+.12,gy+.12,gx+.42,gy+.4,0,9,'#f4efe2','#e9e2d2');win(g,'L',.1,1,.8,4,'#7fb2d4');face(g,'R',.1,1,.8,4,NIGHT>.2?'#ffd27a':'#6aa0c4',NIGHT>.2);
          for(let k=0;k<5;k++){face(g,'L',k*.2,5.5,.2,1.5,k%2?'#ffffff':'#2f7d55');face(g,'R',k*.2,5.5,.2,1.5,k%2?'#ffffff':'#2f7d55')}
          box(gx+.1,gy+.1,gx+.44,gy+.42,9,1,'#5a4632','#4a3a2a','#3a2c20')}],
        [.72,.28,()=>umbH(gx+.74,gy+.26,'#2f7d55',7,'#256a47')],[.26,.74,()=>umbH(gx+.24,gy+.76,'#f4efe2',7,'#ddd4c2')],
        ]);
    },2.5);return}
  // club canino: pasto rayado, alberca para perros, edificio con azotea verde
  for(let k=0;k<5;k++){const a=.08+k*.17;poly([P(gx+a,gy+.08),P(gx+a+.085,gy+.08),P(gx+a+.085,gy+.92),P(gx+a,gy+.92)],'#7fca58')}
  poly([P(gx+.54,gy+.62),P(gx+.9,gy+.62),P(gx+.9,gy+.9),P(gx+.54,gy+.9)],'#f4f4f4');poly([P(gx+.57,gy+.65),P(gx+.87,gy+.65),P(gx+.87,gy+.87),P(gx+.57,gy+.87)],'#4fb0e0',true);
  {const [x,y]=P(gx+.72,gy+.76);px(x-3,y,3,.5,'#bfe9ff',true);px(x+1,y+1.5,2.5,.5,'#bfe9ff',true)}
  fenced(gx,gy,.04,3,'#d9dde2','rgba(200,230,255,.3)',()=>{
    dsort(gx,gy,[
      [.25,.3,()=>{const g=cb(gx+.08,gy+.08,gx+.44,gy+.56,0,11,'#f4f4f2','#e6e6e2');face(g,'L',0,0,1,1.5,'#2a9d8f');face(g,'R',0,0,1,1.5,'#22867a');
        face(g,'L',.06,2,.88,5.5,'#9fd0ee',true);face(g,'R',.06,2,.6,5.5,NIGHT>.2?'#ffe2a8':'#8cc2e4',true);face(g,'R',.72,0,.2,7.5,'#2b2b2b');
        face(g,'L',.15,8,.7,2,'#2a9d8f',NIGHT>.2);const p=[.3,.5,.7];for(const u of p)face(g,'L',u,8.5,.06,1,'#ffffff',NIGHT>.2);
        box(gx+.06,gy+.06,gx+.46,gy+.58,11,1,'#d9d6cf','#c9c5bd','#b3aea5');topFace(gx+.11,gy+.11,gx+.41,gy+.53,12.2,'#7fca58');
        const [x,y]=P(gx+.26,gy+.32);glow(x,y-9,10,.6)}],
      [.86,.24,()=>planter(gx+.86,gy+.22,.5)],[.2,.84,()=>planter(gx+.2,gy+.84,.5)]]);
  });
}

