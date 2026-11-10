/* CLÍNICA — 1 Consultorio Buenasalud · 2 Clínica con urgencias · 3 Clínica de especialidades · 4 Hospital Distrito */
function ambulance(gx,gy){const a=cb(gx+.7,gy+.7,gx+.9,gy+.8,.6,3.4,'#f4f4f4');face(a,'L',0,1.4,1,.6,'#d62828');face(a,'R',0,1.4,1,.6,'#b52020');face(a,'L',.7,2,.24,1.2,'#7fb6d8');
  const [x,y]=P(gx+.73,gy+.8),[x2,y2]=P(gx+.88,gy+.8);circ(x,y,.9,'#2b2b2b');circ(x2,y2,.9,'#2b2b2b')}
function redCross(g,u,v,s=1){const on=NIGHT>.2;face(g,'L',u+.08*s,v,.14*s,3.8*s,'#d62828',on);face(g,'L',u,v+1.2*s,.3*s,1.4*s,'#d62828',on)}
function artClinica(t,gx,gy,L){
  if(L===1){ // consultorio: casita blanca con franja turquesa y hojita, puerta de vidrio y un carro en su cajón
    const g=box(gx+.14,gy+.16,gx+.58,gy+.54,0,8,'#e9eeee','#f7f9f9','#dfe5e5');face(g,'L',0,0,1,.8,'#b9bcc2');face(g,'R',0,0,1,.8,'#a5a8ae');
    face(g,'L',0,5.6,1,1.8,'#1aa39a',NIGHT>.2);face(g,'R',0,5.6,1,1.8,'#14857e',NIGHT>.2);
    {const on=NIGHT>.2;face(g,'L',.12,5.9,.06,1.2,'#ffffff',on);face(g,'L',.19,6.2,.04,.6,'#ffffff',on);for(let k=0;k<4;k++)face(g,'L',.3+k*.12,6.3,.08,.5,'#ffffff',on)}
    win(g,'L',.08,1.6,.22,3,'#9fd0ee');win(g,'L',.68,1.6,.22,3,'#9fd0ee');face(g,'L',.38,0,.22,4.6,'#3a4a5a');face(g,'L',.41,0,.16,4.2,'#7fb6d8');win(g,'R',.2,1.6,.6,3,'#8cc2e4');
    box(gx+.12,gy+.14,gx+.6,gy+.56,8,1,'#f7f9f9','#e9eeee','#dfe5e5');
    if(NIGHT>.2){const [x,y]=P(gx+.14,gy+.54);glow(x+6,y-7,10,.55,'#5fe0d6')}
    dsort(gx,gy,[[.8,.3,()=>{const c=cb(gx+.7,gy+.18,gx+.9,gy+.32,.6,2.6,'#3a6ea5');cb(gx+.74,gy+.2,gx+.86,gy+.3,3.2,1.6,'#9fc4dc');const [x,y]=P(gx+.73,gy+.32),[x2,y2]=P(gx+.88,gy+.32);circ(x,y,.8,'#2b2b2b');circ(x2,y2,.8,'#2b2b2b')}],
      [.22,.84,()=>tree(gx+.22,gy+.84,.5)],[.5,.8,()=>{const p=cb(gx+.42,gy+.74,gx+.56,gy+.8,0,1.6,'#9a958c');const [x,y]=P(gx+.49,gy+.77);circ(x,y-2.6,1.6,'#5f9e3f')}]]);return}
  if(L===2){ // clínica con urgencias
    const g=box(gx+.1,gy+.1,gx+.62,gy+.6,0,13,'#e6e6e2','#f6f6f4','#d9d9d4');
    face(g,'L',0,0,1,1,'#b9bcc2');face(g,'R',0,0,1,1,'#a5a8ae');face(g,'L',0,10.2,1,1,'#2f6db5');face(g,'R',0,10.2,1,1,'#26599a');
    for(let k=0;k<3;k++)win(g,'L',.08+k*.32,5.4,.2,3,'#9fd0ee');win(g,'R',.12,5.4,.76,3,'#8cc2e4');
    face(g,'R',.2,0,.5,3.6,'#3a4a5a');face(g,'R',.24,0,.42,3.2,'#7fb6d8');face(g,'R',.14,3.6,.62,1.1,'#d62828');
    redCross(g,.35,1.4);if(NIGHT>.2){const [x,y]=P(gx+.36,gy+.6);glow(x-2,y-6,10,.7,'#ff5a5a')}
    box(gx+.09,gy+.09,gx+.63,gy+.61,13,1,'#f6f6f4','#ececea','#d9d9d4');
    {const [hx,hy]=P(gx+.36,gy+.35);ellipse(hx,hy-14.4,5,2.5,'#3d434c');ellipse(hx,hy-14.4,4.2,2.1,'#4a515b');px(hx-1.5,hy-15.6,.6,2.4,'#f2c94c');px(hx+1,hy-15.6,.6,2.4,'#f2c94c');px(hx-1,hy-14.7,2,.6,'#f2c94c')}
    ambulance(gx,gy);tree(gx+.2,gy+.82,.55);return}
  if(L===3){ // especialidades: cuatro pisos, muro cortina azul, marquesina y cruz en la azotea
    const g=box(gx+.08,gy+.08,gx+.62,gy+.6,0,27,'#e6e6e2','#f6f6f4','#d9d9d4');face(g,'L',0,0,1,1,'#b9bcc2');face(g,'R',0,0,1,1,'#a5a8ae');
    face(g,'L',.1,3,.8,22,'#5a8fb8');for(let k=1;k<6;k++)face(g,'L',.1+k*.133,3,.012,22,'#d9e6ef');for(let v=8;v<25;v+=5.5)face(g,'L',.1,v,.8,.4,'#d9e6ef');
    for(let v=3;v<25;v+=5.5)win(g,'R',.1,v,.8,3.2,'#8cc2e4');face(g,'L',0,24.4,1,1.2,'#2f6db5');face(g,'R',0,24.4,1,1.2,'#26599a');
    face(g,'R',.2,0,.5,3.4,'#7fb6d8');{const m=cb(gx+.62,gy+.18,gx+.72,gy+.5,3.6,.8,'#d62828')}
    box(gx+.07,gy+.07,gx+.63,gy+.61,27,1,'#f6f6f4','#ececea','#d9d9d4');
    {const [x,y]=P(gx+.2,gy+.2),on=NIGHT>.2;px(x-1,y-35,2,6,'#d62828',on);px(x-3,y-33,6,2,'#d62828',on);px(x-.3,y-29,.6,2,'#8a9099');if(on)glow(x,y-32,10,.7,'#ff5a5a')}
    ambulance(gx,gy);tree(gx+.2,gy+.84,.55);return}
  // hospital: base de dos pisos con urgencias y torre de ocho pisos con helipuerto iluminado
  const b=box(gx+.06,gy+.06,gx+.7,gy+.64,0,9,'#e6e6e2','#f6f6f4','#d9d9d4');face(b,'L',0,0,1,1,'#b9bcc2');face(b,'R',0,0,1,1,'#a5a8ae');
  for(let k=0;k<5;k++)win(b,'L',.05+k*.19,3.4,.13,3,'#9fd0ee');face(b,'R',.08,0,.5,3.8,'#7fb6d8');face(b,'R',.04,3.8,.6,1.2,'#d62828');face(b,'L',0,7.6,1,1.2,'#2f6db5');face(b,'R',0,7.6,1,1.2,'#26599a');
  box(gx+.05,gy+.05,gx+.71,gy+.65,9,.8,'#e2e2de','#ececea','#d9d9d4');
  const tw=box(gx+.1,gy+.1,gx+.56,gy+.54,9.8,30,'#e6e6e2','#f6f6f4','#d9d9d4');
  for(let v=2.4;v<24;v+=4.6){win(tw,'L',.06,v,.88,2.6,'#8fc0e2');win(tw,'R',.06,v,.88,2.6,'#7fb0d4')}face(tw,'L',.36,24,.28,5.4,'#f6f6f4');redCross(tw,.35,24.4,1.1);face(tw,'R',0,25.6,1,1.2,'#2f6db5');
  box(gx+.09,gy+.09,gx+.57,gy+.55,39.8,1,'#4a515b','#3d434c','#33383f');
  {const [hx,hy]=P(gx+.33,gy+.32),on=NIGHT>.2;ellipse(hx,hy-41.2,6,3,'#f2c94c',on);ellipse(hx,hy-41.2,5.2,2.6,'#4a515b');px(hx-1.6,hy-42.4,.6,2.4,'#ffffff');px(hx+1,hy-42.4,.6,2.4,'#ffffff');px(hx-1,hy-41.5,2,.6,'#ffffff');if(on)glow(hx,hy-41,12,.6,'#ffe9a0')}
  if(NIGHT>.2){const [x,y]=P(gx+.33,gy+.54);glow(x,y-35,10,.7,'#ff5a5a')}
  ambulance(gx,gy)}
