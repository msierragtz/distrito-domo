/* cancha dibujada dentro de un rectángulo del terreno (franjas, líneas, círculo y áreas) */
function pitchIn(gx,gy,x0,y0,x1,y1,turf,str,lc){const W=x1-x0,H=y1-y0,Q=(u,v)=>P(gx+x0+u*W,gy+y0+v*H);
  poly([Q(0,0),Q(1,0),Q(1,1),Q(0,1)],turf);for(let k=1;k<6;k+=2)poly([Q(k/6,0),Q((k+1)/6,0),Q((k+1)/6,1),Q(k/6,1)],str);
  const R=[[.06,.06],[.94,.06],[.94,.94],[.06,.94]].map(([u,v])=>Q(u,v));for(let q=0;q<4;q++){const a=R[q],b=R[(q+1)%4];line(a[0],a[1],b[0],b[1],lc)}
  {const a=Q(.5,.06),b=Q(.5,.94);line(a[0],a[1],b[0],b[1],lc)}const c=Q(.5,.5);spans(ellRows(c[0],c[1],3.6*W,1.8*W),lc);spans(ellRows(c[0],c[1],2.8*W,1.3*W),turf);
  for(const ua of [.06,.94]){const sg=ua<.5?1:-1,pts=[Q(ua,.3),Q(ua+sg*.16,.3),Q(ua+sg*.16,.7),Q(ua,.7)];for(let q=0;q<3;q++)line(pts[q][0],pts[q][1],pts[q+1][0],pts[q+1][1],lc)}}
/* CANCHA — 1 Cancha de barrio · 2 Pasto sintético con malla · 3 Unidad deportiva con vestidores · 4 Estadio de barrio. El pasto y las líneas van en el suelo */
function goalPost(gx,gy,xa,netA=.45,y0=.4,y1=.6){const a=P(gx+xa,gy+y0),b=P(gx+xa,gy+y1),h=4;px(a[0]-.3,a[1]-h,.7,h,'#ffffff');px(b[0]-.3,b[1]-h,.7,h,'#ffffff');line(a[0],a[1]-h,b[0],b[1]-h,'#ffffff');
  if(netA){const sg=xa<.5?-1:1,c=P(gx+xa+sg*.05,gy+y0),d=P(gx+xa+sg*.05,gy+y1);poly([[a[0],a[1]-h],[b[0],b[1]-h],[d[0],d[1]-1],[c[0],c[1]-1]],`rgba(235,240,245,${netA})`,true)}}
function lightPole(gx,gy,a,b,h=20){const [x,y]=P(gx+a,gy+b),on=NIGHT>.2;px(x,y-h,.6,h,'#6b7078');px(x-1.5,y-h-1,3.5,1.6,on?'#fff7d6':'#c9cdd2',on);glow(x,y-h,16,.6,'#fff2c8')}
function artCancha(t,gx,gy,L){
  if(L===1){goalPost(gx,gy,.1,0);goalPost(gx,gy,.9,0);cb(gx+.42,gy+.93,gx+.6,gy+.98,0,1.2,'#8a5a3a');{const [x,y]=P(gx+.97,gy+.06);px(x,y-9,.6,9,'#6b7078');px(x-.5,y-10,1.6,1,NIGHT>.2?'#ffe19a':'#c9cdd2',NIGHT>.2);glow(x,y-9,10,.5)}return}
  const fence=(h)=>{const w=courtWalls(gx,gy,h,'rgba(190,200,210,.16)');return w};
  if(L===2){const w=fence(6);w.back();goalPost(gx,gy,.1);goalPost(gx,gy,.9);for(const [a,b] of [[.02,.98],[.98,.02]])lightPole(gx,gy,a,b);w.front();return}
  if(L===3){ // vestidores atrás a la izquierda y gradas atrás a la derecha
    const v=cb(gx+.0,gy+.18,gx+.07,gy+.82,0,6,'#e6dfd3');face(v,'R',.1,0,.8,1,'#2f6db5');for(let k=0;k<4;k++)face(v,'L',.15+k*.2,2.4,.1,2,'#7fb6d8');box(gx-.01,gy+.17,gx+.08,gy+.83,6,1,'#2f6db5','#26599a','#1f4a80');
    {cb(gx+.18,gy+.0,gx+.82,gy+.07,0,2,'#b9b4ad');cb(gx+.18,gy+.0,gx+.82,gy+.035,2,1.6,'#d6d0c4');for(let k=0;k<5;k++){const [x,y]=P(gx+.24+k*.13,gy+.03);px(x,y-4.6,1,1.2,['#d62828','#2f6db5','#f2c94c','#2f8f5b','#f4f4f4'][k])}}
    const w=fence(5);w.back();goalPost(gx,gy,.1);goalPost(gx,gy,.9);for(const [a,b] of [[.02,.02],[.02,.98],[.98,.02],[.98,.98]])lightPole(gx,gy,a,b,18);w.front();return}
  stadium(t,gx,gy)}
// tribuna escalonada: filas que suben hacia afuera, con afición en cada escalón. side 0 = lado izquierdo de atrás, 1 = lado derecho de atrás
function stand(t,gx,gy,side,from,to,rows,lit){const CROWD=['#d62828','#f4f4f4','#2f6db5','#f2c94c','#f26a21','#f4f4f4'],dp=.25/rows,rise=2.4;
  for(let r=rows-1;r>=0;r--){const o0=.25-dp*(r+1),o1=.25-dp*r,h=rise*(r+1);
    const g=side?box(gx+from,gy+o0,gx+to,gy+o1,0,h,'#d8d3c8','#9aa0a8','#b4b9c0'):box(gx+o0,gy+from,gx+o1,gy+to,0,h,'#d8d3c8','#b4b9c0','#9aa0a8');
    const n=Math.round((to-from)*18);for(let k=0;k<n;k++){const f=from+(k+.5)/n*(to-from),[x,y]=side?P(gx+f,gy+(o0+o1)/2):P(gx+(o0+o1)/2,gy+f);
      if(((k*7+r*3+t.s)%9)<7)px(x-.4,y-h-1.2,.9,1.2,CROWD[(k*5+r*2+t.s)%6],lit)}}}
function floodMast(gx,gy,a,b,h){const [x,y]=P(gx+a,gy+b),on=NIGHT>.2;px(x-.3,y-h,.8,h,'#6b7078');for(let v=4;v<h-2;v+=4)line(x-1,y-v,x+1,y-v-3,'#8a9099');
  px(x-2.6,y-h-3.6,5.6,3.8,'#3a3f47');for(let i=0;i<3;i++)for(let j=0;j<2;j++)px(x-2.1+i*1.8,y-h-3.1+j*1.7,1.2,1.1,on?'#fffbe6':'#c9cdd2',on);
  if(on){glow(x+.3,y-h-1.6,9,.9,'#fff6d8')}}
function adBoards(gx,gy){const on=NIGHT>.2;for(const [u0,v0,u1,v1] of [[.25,.985,.97,.985],[.985,.25,.985,.97]]){const a=P(gx+u0,gy+v0),b=P(gx+u1,gy+v1);poly([a,b,up(b,1.3),up(a,1.3)],'#f26a21',on);
  for(let q=1;q<8;q++){const f=q/8;px(a[0]+(b[0]-a[0])*f-.6,a[1]+(b[1]-a[1])*f-1,1.2,.5,'#ffffff',on)}}}
function scoreBoard(gx,gy,lift){const g=box(gx+.02,gy+.02,gx+.2,gy+.2,lift,6,'#3a3f47','#1c1c1c','#2b2b2b');const on=true;face(g,'L',.1,1.2,.35,2.6,'#ffd84d',on);face(g,'L',.55,1.2,.35,2.6,'#ff7a3a',on);face(g,'R',.15,1.2,.7,2.6,'#3fd0ff',on);if(NIGHT>.2){const [x,y]=P(gx+.2,gy+.2);glow(x,y-lift-3,7,.6,'#ffd9a0')}}
// estadio de barrio: dos tribunas escalonadas al fondo (en L), marcador en la esquina, vallas naranjas y dos torres de reflectores
function stadium(t,gx,gy){const on=NIGHT>.2;
  box(gx+0,gy+0,gx+.25,gy+.25,0,9.6,'#d8d3c8','#b4b9c0','#9aa0a8');scoreBoard(gx,gy,9.6);
  stand(t,gx,gy,0,.25,1,4,on);stand(t,gx,gy,1,.25,1,4,on);
  adBoards(gx,gy);goalPost(gx,gy,.29,.35,.53,.69);goalPost(gx,gy,.93,.35,.53,.69);
  floodMast(gx,gy,.03,.97,24);floodMast(gx,gy,.97,.03,24);
  if(on){const [x,y]=P(gx+.61,gy+.61);glow(x,y-2,16,.55,'#fff2d0')}}
function artPadel(t,gx,gy,L){
  if(L===1){const w=courtWalls(gx,gy,6,'rgba(200,230,255,.22)');w.back();net(gx,gy);w.front();
    if(NIGHT>.2){const [x,y]=P(gx+.06,gy+.06);px(x,y-14,.5,14,'#555');glow(x,y-14,14,.5)}return}
  if(L===2){const w=courtWalls(gx,gy,6,'rgba(200,230,255,.22)');w.back();net(gx,gy);w.front();
    for(const [a,b] of [[.04,.04],[.96,.04],[.04,.96],[.96,.96]]){const [x,y]=P(gx+a,gy+b);px(x,y-16,1,16,'#c9cdd2')}
    const o=edges4(gx,gy,.02);poly([up(P(gx+.02,gy+.02),16),up(P(gx+.98,gy+.02),16),up(P(gx+.98,gy+.98),16),up(P(gx+.02,gy+.98),16)],'rgba(250,250,250,.78)',true);
    for(const e of o)line(e[0][0],e[0][1]-16,e[1][0],e[1][1]-16,'#d0d4d9');
    {const a=P(gx+.5,gy+.02),b=P(gx+.5,gy+.98);line(a[0],a[1]-17,b[0],b[1]-17,'#e4e7ea')}
    glow(P(gx+.5,gy+.5)[0],P(gx+.5,gy+.5)[1]-12,16,.5);return}
  if(L===3){ // club: lonas con logo, marcador y torres de luz
    const w=courtWalls(gx,gy,6,'rgba(200,230,255,.22)');
    {const F4=edges4(gx,gy,.06);for(const [a,b] of F4.slice(0,2)){poly([a,b,up(b,2.5),up(a,2.5)],'#2a9d8f');for(let k=1;k<4;k++){const f=k/4;px(a[0]+(b[0]-a[0])*f-1,a[1]+(b[1]-a[1])*f-2,2,1,'#ffffff')}}}
    {const [x,y]=P(gx+.06,gy+.06);px(x,y-12,.5,4,'#555');px(x-3,y-15,6.5,3.5,'#1c1c1c');px(x-2.5,y-14.5,2,1.5,'#ffd84d',true);px(x+.5,y-14.5,2,1.5,'#59cd90',true)}
    w.back();net(gx,gy);w.front();
    for(const a of [[.06,.06],[.94,.94]]){const [x,y]=P(gx+a[0],gy+a[1]);px(x,y-15,.5,15,'#555');px(x-1,y-15.5,2.5,1,NIGHT>.2?'#ffffff':'#bbb',NIGHT>.2);glow(x,y-15,14,.6)}
    return}
  // club deportivo privado: nave de cristal con techo de vigas
  const w=courtWalls(gx,gy,13,'rgba(170,215,240,.32)');w.back();net(gx,gy);w.front();
  const o=edges4(gx,gy,.06);for(const e of o)line(e[0][0],e[0][1]-13,e[1][0],e[1][1]-13,'#2b2b2b',false,2);
  for(let k=1;k<6;k++){const a=P(gx+.06+k*.147,gy+.06),b=P(gx+.06+k*.147,gy+.94);line(a[0],a[1]-13,b[0],b[1]-13,'#3a3a3a')}
  for(const [a,b] of [[.06,.06],[.94,.06],[.06,.94],[.94,.94]]){const [x,y]=P(gx+a,gy+b);px(x-.5,y-13,1,13,'#2b2b2b')}
  if(NIGHT>.2){const [x,y]=P(gx+.5,gy+.5);glow(x,y-8,22,.6)}
}

