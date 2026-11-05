/* ---------- arte HD por nivel (medidas en unidades del mapa; los .5 son el pixel fino) ---------- */
function lifted(h,fn){cam.oy-=h;fn();cam.oy+=h}
function cb(x0,y0,x1,y1,lift,h,c,top){return box(x0,y0,x1,y1,lift,h,top||hexShade(c,.2),c,hexShade(c,-.22))}
function dsort(gx,gy,items){items.map(it=>{const r=rot(gx+it[0],gy+it[1]);return[r[0]+r[1],it[2]]}).sort((p,q)=>p[0]-q[0]).forEach(p=>p[1]())}
function edges4(gx,gy,a,b){b=b===undefined?1-a:b;const E=[[[a,a],[b,a]],[[a,a],[a,b]],[[b,a],[b,b]],[[a,b],[b,b]]];return E.map(e=>e.map(([u,v])=>P(gx+u,gy+v))).sort((p,q)=>(p[0][1]+p[1][1])-(q[0][1]+q[1][1]))}
function fenceE(e,h,col,mesh,step=3){const [a,b]=e,A=up(a,h),B=up(b,h);if(mesh)poly([a,b,B,A],mesh,true);const n=Math.max(2,Math.round(Math.hypot(b[0]-a[0],b[1]-a[1])/step));for(let k=0;k<=n;k++){const f=k/n;px(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-h,.5,h,col)}line(A[0],A[1],B[0],B[1],col)}
function fenced(gx,gy,ins,h,col,mesh,inner,step){const E=edges4(gx,gy,ins);fenceE(E[0],h,col,mesh,step);fenceE(E[1],h,col,mesh,step);inner();fenceE(E[2],h,col,mesh,step);fenceE(E[3],h,col,mesh,step)}
function guy(fx,fy,c,skin){const [x,y]=P(fx,fy);px(x-.5,y-2,1,2,'#33363d');px(x+.5,y-2,1,2,'#2a2d33');px(x-1,y-5,3,3,c);px(x-1,y-5,.5,3,hexShade(c,-.2));px(x-.5,y-7,2,2,skin||'#c98e62');px(x-.5,y-7.5,2,1,'#2b2118')}
function chairH(fx,fy,c){const [x,y]=P(fx,fy),d=hexShade(c,-.3);px(x-.5,y-2.5,2,1,c);px(x-.5,y-1.5,.5,1.5,d);px(x+1,y-1.5,.5,1.5,d);px(x+1,y-4.5,1,2,c)}
function tableH(fx,fy,c,leg){const [x,y]=P(fx,fy);px(x-2.5,y-4,5.5,1,c);px(x-2.5,y-3,5.5,.5,hexShade(c,-.25));px(x,y-3,1,3,leg||'#555')}
function stoolH(fx,fy,c){const [x,y]=P(fx,fy);px(x-1,y-2,2,2,hexShade(c,-.2));px(x-1,y-2.5,2,1,c)}
function parasol(x,y,rx,cols,rise=1){const ry=rx/2,n=cols.length*2,c=[x,y-rise];
  for(let k=0;k<n;k++){const a0=k/n*Math.PI*2,a1=(k+1)/n*Math.PI*2,pts=[c];for(let q=0;q<=4;q++){const a=a0+(a1-a0)*q/4;pts.push([x+Math.cos(a)*rx,y+Math.sin(a)*ry])}poly(pts,cols[k%cols.length])}
  for(let k=0;k<=12;k++){const a=k/12*Math.PI;px(x+Math.cos(a)*rx-.25,y+Math.sin(a)*ry,.5,.5,'rgba(0,0,0,.25)',true)}}
function umbH(fx,fy,col,h=7,col2){const [x,y]=P(fx,fy);px(x,y-h,.5,h,'#7a7a7a');parasol(x+.25,y-h,4,[col,col2||hexShade(col,-.12)],.8)}
function dogH(fx,fy,c,flip){const [x,y]=P(fx,fy),d=flip?-1:1;px(x-2,y-3,4,1.5,c);px(x+(d>0?1.5:-2.5),y-4.5,1.5,1.5,c);px(x+(d>0?2.5:-2.5),y-3.5,.5,.5,'#222');px(x-1.5,y-1.5,.5,1.5,c);px(x+1,y-1.5,.5,1.5,c);px(x+(d>0?-2.5:2),y-4,.5,1,c)}
function bulbsH(p0,p1,n,sag){const on=NIGHT>.2,Y=f=>p0[1]+(p1[1]-p0[1])*f+Math.sin(f*Math.PI)*sag,X=f=>p0[0]+(p1[0]-p0[0])*f;
  for(let k=0;k<n;k++)line(X(k/n),Y(k/n),X((k+1)/n),Y((k+1)/n),'#3a3a3a');
  for(let k=0;k<=n;k++){const x=X(k/n),y=Y(k/n);px(x,y+.5,1,1,on?'#ffe19a':'#efe6c4',on);if(k%2===0)glow(x,y+1,5,.55)}}
function smokeH(x,y){for(const [dx,dy,r,a] of [[0,-2,1,.5],[1,-4.5,1.5,.42],[0,-7.5,2,.32],[1.5,-11,2,.22]])circ(x+dx,y+dy,r,`rgba(232,232,232,${a})`,true)}
function olive(fx,fy){const [x,y]=P(fx,fy);cb(fx-.06,fy-.06,fx+.06,fy+.06,0,3.5,'#8a8178');px(x-.5,y-8.5,1,5,'#6e5a44');circ(x,y-10.5,3.5,'#6f8150');circ(x-1,y-11.5,2.5,'#879a62');circ(x+1.5,y-10,1.5,'#7d8f5a');px(x-1.5,y-13,1,1,'#b9c78f')}
function planter(fx,fy,sz){cb(fx-.06,fy-.06,fx+.06,fy+.06,0,2.5,'#3a3a3a');tree(fx,fy,sz||.4)}
function board(x,y,w,h,bg,lines){px(x,y,w,h,bg);px(x,y+h-.5,w,.5,hexShade(bg,-.2));for(const [dx,dy,lw,c] of lines)px(x+dx,y+dy,lw,.5,c)}
function lamp(fx,fy,h=11){const [x,y]=P(fx,fy);px(x,y-h,.5,h,'#4a4f5a');px(x-.5,y-h-.5,1.5,1,NIGHT>.2?'#ffe19a':'#cfcfcf',NIGHT>.2);glow(x,y-h+1,8,.55)}
function bench(fx,fy,col='#a0663a'){cb(fx-.08,fy-.03,fx+.08,fy+.03,0,1.5,col)}
function car(fx,fy,col,horiz){const w=horiz?.16:.09,d=horiz?.09:.16;cb(fx-w,fy-d,fx+w,fy+d,0,2,col);cb(fx-w*.6,fy-d*.6,fx+w*.6,fy+d*.6,2,1.5,'#2b3a4d','#2b3a4d')}
function flowers(gx,gy,a0,b0,a1,b1,seed){const r=rng(seed);for(let k=0;k<8;k++){const [x,y]=P(gx+a0+r()*(a1-a0),gy+b0+r()*(b1-b0));px(x,y-1,1,1,['#ff8fb1','#ffd84d','#ffffff','#e5534b'][k%4])}}

