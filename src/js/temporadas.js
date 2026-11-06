/* ---------- temporadas a fondo (v65): Día de Muertos, Navidad y Fiestas Patrias ----------
   Todo se pinta en vivo encima de la imagen guardada de cada casilla (no cambia la caché de edificios),
   así que aparece y desaparece con la fecha o con la opción del jugador sin redibujar la ciudad. */
const sh01=(gx,gy,k)=>{const v=Math.sin(gx*127.1+gy*311.7+k*74.7)*43758.5453;return v-Math.floor(v)};
// parpadeo de flama: cada veladora a su ritmo
function flick(a,b,k){if(lowMo())return .9;return .78+.22*Math.sin(T*(8+k)+a*3.1+b*1.7)*Math.sin(T*(5.3+k*.7)+b*.9+k)}
function veladora(x,y,k,ng){px(x-.5,y-1.6,1.2,1.6,'#f2ead8');px(x-.5,y-1.6,1.2,.4,'#c98a3e');const f=flick(x,y,k||0);
  if(NIGHT>.25){px(x-.1,y-2.7,.6,1.1,f>.88?'#fff3b0':'#ffc24a',true);if(!ng)glow(x+.2,y-2.3,4.5+2*f,.6*f,'#ffb347')}else px(x-.1,y-2.4,.5,.7,'#ffb347',true)}
const XMAS=['#ff3b3b','#ffd84d','#3fd16a','#4fa8ff','#ff8fd0','#ffffff'];
const blink=(k,s)=>lowMo()||Math.floor(T*1.7+k*.41+s)%3!==0;
function bulb(x,y,c,on,ng){px(x-.5,y-.5,1.2,1.2,on?c:hexShade(c,-.5),on&&NIGHT>.2);if(on&&!ng&&NIGHT>.3&&!OPT.low&&!AUTOLOW)glow(x+.1,y+.1,3.6,.6,c)}
// cable colgado entre dos puntos: un trazo (antes, pixel por pixel)
function wire(a,b,lift,sag,c){ctx.strokeStyle=NIGHT>.3?'#1c2030':c;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(a[0],a[1]-lift);ctx.quadraticCurveTo((a[0]+b[0])/2,(a[1]+b[1])/2-lift+sag*2,b[0],b[1]-lift);ctx.stroke()}
// ¿es la noche del Grito? (15 y 16 de septiembre, o mes patrio elegido a mano), de 10 pm a 1 am del juego
const gritoNow=()=>SEASON_C==='patrias'&&GRITO()&&NIGHT>.6&&(()=>{const ph=S.clock/DAY;return ph>.66&&ph<.79})();
// año nuevo: 31 de diciembre y 1 de enero, o Navidad elegida a mano
const ANYO=()=>{if(SEASON_C!=='navidad')return false;if(OPT.season==='navidad')return true;const d=new Date();return (d.getMonth()===11&&d.getDate()===31)||(d.getMonth()===0&&d.getDate()===1)};
let GRITO_XY=null,SEAMSG='';

// adornos grandes de las plazas: la parte quieta se guarda como imagen (con contorno, como los edificios) y solo las luces se pintan en vivo
function decoSpr(k,t,gx,gy){const d={k,s:t.s|0};drawSprN(d,gx,gy,idx(gx,gy),1,1);ctx.globalAlpha=1}
// altar de muertos: tres escalones, arco de cempasúchil, fotos, calaveritas, pan; veladoras en vivo
function ofrenda(gx,gy,live){const c=gx+.7,d=gy+.7,[x,y]=P(c,d),on=NIGHT>.3;
  if(live){for(let q=0;q<6;q++)veladora(x-6+q*2.4,y+2.2+(q%2?.7:0),q,q%2);return}
  box(c-.2,d-.2,c+.2,d+.2,0,3,'#f4efe2','#e6dac2','#d2c4a8');box(c-.14,d-.14,c+.14,d+.14,3,3,'#f4efe2','#9b5de5','#7a44c4');box(c-.08,d-.08,c+.08,d+.08,6,3,'#f4efe2','#ff5d8f','#d6457a');
  for(let a=0;a<=10;a++){const an=Math.PI*a/10;px(x-Math.cos(an)*6.5-.6,y-10.5-Math.sin(an)*6.5,1.5,1.5,a%2?'#ff9f1c':'#ffc23a',on)}
  px(x-2.2,y-13.2,1.7,2.2,'#2a2a34');px(x-1.9,y-12.9,1.1,1.2,'#c9b79a');px(x+.6,y-13.2,1.7,2.2,'#6b4f2a');px(x+.9,y-12.9,1.1,1.2,'#d8c3a5');
  for(const sx of [-4,3.2]){px(x+sx,y-7.4,1.4,1.3,'#ffffff');px(x+sx+.2,y-7,.4,.4,'#1c1c24');px(x+sx+.8,y-7,.4,.4,'#1c1c24')}
  px(x-1,y-6.6,2.2,1,'#c98a3e');px(x-.5,y-7,1.2,.5,'#e0a85a');
  for(let q=0;q<5;q++){const [px2,py2]=P(c-.3+q*.1,d+.26);px(px2,py2-1,1.2,1.2,q%2?'#ff9f1c':'#ffc23a')}}
// pino navideño: árbol, estrella y regalos en la imagen; foquitos que parpadean y brillo de la estrella en vivo
function pino(gx,gy,live){const [x,y]=P(gx+.64,gy+.66),b=y-3,on=NIGHT>.3,ty=b-25.5;
  if(live){const r=rng(gx*31+gy*17);for(let q=0;q<18;q++){const lv=r(),u=1+lv*20,hw=(1-lv)*9.5*r();const xx=x+(r()<.5?-hw:hw),yy=b-u;bulb(xx,yy,XMAS[q%XMAS.length],blink(q,gx+gy),q%3)}
    if(on)glow(x+.2,ty,9+(lowMo()?0:Math.sin(T*2)*1.5),.9,'#ffe27a');return}
  px(x-.8,b-1,1.8,4,'#6b4423');
  for(const [u,w,h] of [[0,10,9],[6,8.5,8],[11,7,7],[15.5,5,6.5],[19,3,5]]){poly([[x-w,b-u],[x+w,b-u],[x,b-u-h]],'#24783f');poly([[x+.5,b-u],[x+w,b-u],[x+.5,b-u-h]],'#1b6233')}
  px(x-.6,ty-1.6,1.6,3.6,'#ffd84d',true);px(x-1.6,ty-.6,3.6,1.6,'#ffd84d',true);px(x-.1,ty-.1,.6,.6,'#fff7c2',true);
  for(const [dx2,c] of [[-6,'#d62828'],[5,'#3a6ea5'],[-2,'#ffd84d']]){px(x+dx2,b+1,2.6,2,c);px(x+dx2+1,b+1,.6,2,'#ffffff')}}
// puesto de antojitos del 15 de septiembre: toldo tricolor y comal en la imagen; foquitos en vivo
function puesto(gx,gy,live){const c=gx+.72,d=gy+.7,[x,y]=P(c,d),on=NIGHT>.3;
  if(live){for(let q=0;q<5;q++)bulb(x-6+q*3,y-12+(q%2?.5:0),['#ffd84d','#ffffff','#ff8a3a'][q%3],true,q%2);return}
  cb(c-.17,d-.1,c+.17,d+.1,0,4,'#8a5a2b');
  for(let q=0;q<3;q++)px(x-6+q*4,y-11,4,2.4,['#1f8a4c','#ffffff','#d62828'][q],on);px(x-6,y-8.6,12,.6,'#5a3a22');px(x-5.5,y-8.6,.6,4.8,'#5a3a22');px(x+5,y-8.6,.6,4.8,'#5a3a22');
  px(x-2.5,y-5,5,.8,'#2b2b2b');for(let q=0;q<3;q++)px(x-2+q*1.8,y-5.6,1.2,.6,['#ffd84d','#d62828','#59cd90'][q])}
const artOfrenda=(t,gx,gy)=>ofrenda(gx,gy,false),artPino=(t,gx,gy)=>pino(gx,gy,false),artPuesto=(t,gx,gy)=>puesto(gx,gy,false);
// piñata de estrella colgada en los parques (posadas)
function pinata(gx,gy){const [x,y0]=P(gx+.6,gy+.42),sw=lowMo()?0:Math.sin(T*1.4+gx)*1.2,y=y0-17;line(x,y-8,x+sw,y,'#8a8f99');
  const cx=x+sw;circ(cx,y+1,2.2,'#ff5d8f');for(let q=0;q<5;q++){const an=-Math.PI/2+q*Math.PI*2/5;line(cx,y+1,cx+Math.cos(an)*5,y+1+Math.sin(an)*4,['#ffd84d','#3fa7d6','#59cd90','#f26a21','#9b5de5'][q],false,1.2)}}
// gente en la plaza del Grito, frente a El Domo
function gritoCrowd(x,y){const r=rng(915);const ppl=[];for(let q=0;q<26;q++){const a=r()*Math.PI,rr2=12+r()*24;ppl.push([x+Math.cos(a)*rr2*1.25-6,y+4+Math.sin(a)*rr2*.32,q])}
  ppl.sort((a,b)=>a[1]-b[1]);const fr=lowMo()?0:Math.floor(T*4);
  for(const [px2,py2,q] of ppl){const jump=(q+fr)%5===0&&!lowMo()?1:0;person(px2,py2-jump,{shirt:['#1f8a4c','#ffffff','#d62828','#1f8a4c','#2b3a55'][q%5],pants:'#2b2b2b',skin:['#c68642','#e0ac69','#8d5524','#f1c27d'][q%4],hair:'#1c1c1c',dx:1,front:true,scale:.7,fr:0});
    if(q%4===0){px(px2+1,py2-9-jump,.4,4,'#8a8f99');px(px2+1.4,py2-9-jump,1,1.6,'#1f8a4c',true);px(px2+2.4,py2-9-jump,1,1.6,'#ffffff',true);px(px2+3.4,py2-9-jump,1,1.6,'#d62828',true)}}}
// El Domo en cada temporada: guirnalda de cempasúchil y veladoras, foquitos navideños, o tricolor de noche con el Grito
function domoSeason(gx,gy,se){const [x,y0]=P(gx+.5,gy+.5),y=y0-2,R=30,on=NIGHT>.3;
  if(se==='muertos'){for(let a=0;a<=22;a++){const an=Math.PI*a/22;px(x-Math.cos(an)*(R+3.4)-.7,y-Math.sin(an)*(R+3.4)-.7,1.7,1.7,a%2?'#ff9f1c':'#ffc23a',on)}
    for(const s of [-1,1])for(let q=0;q<4;q++)veladora(x+s*(R-3+q*1.7),y+2.5+q*.7,q+(s>0?4:0),q%2)}
  else if(se==='navidad'){for(let a=0;a<=26;a++){const an=Math.PI*a/26;bulb(x-Math.cos(an)*(R+3.6),y-Math.sin(an)*(R+3.6),XMAS[a%XMAS.length],blink(a,gx),a%2)}}
  else if(se==='patrias'){
    if(on){for(const [x0,x1,c] of [[x-R-6,x-R/3,'#2fae5a'],[x-R/3,x+R/3,'#ffffff'],[x+R/3,x+R+6,'#ff3b3b']]){ctx.save();ctx.beginPath();ctx.rect(x0,y-R-8,x1-x0,R+10);ctx.clip();arcTop(x,y,R+2.5,5,c,true);ctx.restore()}
      for(let k=0;k<=6;k++){const an=Math.PI*k/6;glow(x-Math.cos(an)*R,y-Math.sin(an)*R,10,.65,k<2?'#2fd16a':k<5?'#ffffff':'#ff4040')}}
    else for(const s of [-1,1]){const fx=x+s*(R+1);px(fx,y-14,.6,14,'#8a8f99');px(fx+.6,y-14,2,3,'#1f8a4c',true);px(fx+2.6,y-14,2,3,'#ffffff',true);px(fx+4.6,y-14,2,3,'#d62828',true)}
    if(gritoNow()){GRITO_XY=[x,y-R-10];gritoCrowd(x,y0);
      if(!lowMo()||Math.floor(T*2)%2){ctx.save();ctx.font='6px "Press Start 2P", monospace';ctx.textAlign='center';const tx='¡VIVA MÉXICO!',w=ctx.measureText(tx).width+8;
        ctx.fillStyle='rgba(20,24,40,.85)';ctx.fillRect(Math.round(x-w/2),Math.round(y-R-26),Math.round(w),11);ctx.fillStyle='#1f8a4c';ctx.fillRect(Math.round(x-w/2),Math.round(y-R-26),Math.round(w/3),1.5);ctx.fillStyle='#ffffff';ctx.fillRect(Math.round(x-w/6),Math.round(y-R-26),Math.round(w/3),1.5);ctx.fillStyle='#d62828';ctx.fillRect(Math.round(x+w/6),Math.round(y-R-26),Math.round(w/3)+1,1.5);
        ctx.fillStyle='#ffffff';ctx.fillText(tx,Math.round(x),Math.round(y-R-17));ctx.restore()}}}}

function seasonDeco(t,gx,gy){const se=SEASON_C;if(!se)return;const k=t.k,on=NIGHT>.3;
  if(k==='calle'&&!t.hw){
    if((gx+gy)%2===0){const a=P(gx+.08,gy+.5),b=P(gx+.92,gy+.5),lift=17;
      if(se==='navidad'){const sag=f=>3*Math.sin(f*Math.PI);wire(a,b,lift,3,'#2b2f3a');
        for(let q=0;q<7;q++){const f=(q+.5)/7;bulb(a[0]+(b[0]-a[0])*f,a[1]+(b[1]-a[1])*f-lift+sag(f)+1,XMAS[(q+gx+gy)%XMAS.length],blink(q,gx*3+gy),q%2)}}
      else{const cols=se==='patrias'?['#1f8a4c','#ffffff','#d62828']:['#ff5d8f','#f26a21','#9b5de5','#3fa7d6','#59cd90','#ffd84d'];
        wire(a,b,lift,1.5,'#555');
        for(let q=0;q<5;q++){const f=(q+.5)/5,xx=a[0]+(b[0]-a[0])*f,yy=a[1]+(b[1]-a[1])*f-lift+3*Math.sin(f*Math.PI)+(lowMo()?0:Math.sin(T*3+q+gx)*.4);
          px(xx-2,yy,4,4,cols[(q+gx+gy)%cols.length],NIGHT>.3);px(xx-1,yy+1,1,1,'rgba(255,255,255,.55)',true);px(xx,yy+2,1,1,'rgba(255,255,255,.4)',true);if(NIGHT>.5&&se==='patrias'&&q===2)glow(xx,yy+1,5,.5)}}}
    // postes: bandera en el mes patrio; pétalos de cempasúchil en Muertos
    if((gx*3+gy)%4===0&&se==='patrias'){const [x,y]=P(gx+.16,gy+.5);const wv=lowMo()?0:Math.sin(T*4+gx+gy)*.4;px(x+1,y-12+wv,1.6,2.2,'#1f8a4c',true);px(x+2.6,y-12+wv,1.6,2.2,'#ffffff',true);px(x+4.2,y-12+wv,1.6,2.2,'#d62828',true)}
    if(se==='muertos'){for(let q=0;q<4;q++){const u=sh01(gx,gy,q),v=sh01(gx,gy,q+9);if(u<.5){const [x,y]=P(gx+.15+u*1.4,gy+.2+v*.6);px(x,y,1,.6,q%2?'#ff9f1c':'#ffc23a')}}}
    return}
  if((k==='parque'||k==='plaza')&&!(t.b>0)){const r=rng(gx*131+gy*977+7),cols=se==='patrias'?['#1f8a4c','#ffffff','#d62828']:se==='navidad'?['#d62828','#c21f3a','#2f8f4a']:['#f2a20c','#ff7b00','#f2a20c'];
    for(let q=0;q<9;q++){const [x,y]=P(gx+.15+r()*.7,gy+.15+r()*.7);px(x,y-1,2,2,cols[q%cols.length]);if(se==='navidad'&&q%3!==2)px(x+.5,y-.5,1,1,'#ffd84d')}
    if(k==='plaza'){const dk=se==='muertos'?'_ofrenda':se==='navidad'?'_pino':se==='patrias'&&sh01(gx,gy,3)<.6?'_puesto':null;
      if(dk){decoSpr(dk,t,gx,gy);({_ofrenda:ofrenda,_pino:pino,_puesto:puesto})[dk](gx,gy,true)}}
    else if(se==='navidad'&&sh01(gx,gy,4)<.6)pinata(gx,gy);
    else if(se==='muertos'&&on){for(let q=0;q<3;q++){const [x,y]=P(gx+.3+q*.18,gy+.72);veladora(x,y,q,q!==1)}}
    return}
  if(k==='domo'&&!(t.b>0)&&DIST==='domo'){domoSeason(gx,gy,se);return}
  if((k==='torre'||k==='edificio'||k==='ladrillo')&&!(t.b>0)){
    if(se==='patrias'&&(gx+2*gy)%3===0){const so=shadowOf(t),[x,y]=P(gx+.5,gy+.5),top=y-(so?so[1]:60)-2;
      px(x,top-16,.6,16,'#8a8f99');const w=10,h=6,wv=lowMo()?0:Math.sin(T*4+gx)*.5;px(x+.5,top-12+wv,w/3,h,'#1f8a4c',true);px(x+.5+w/3,top-12+wv,w/3,h,'#ffffff',true);px(x+.5+2*w/3,top-12+wv,w/3,h,'#d62828',true);px(x+.5+w/2-1,top-10+wv,2,2,'#8a5a2b',true)}
    else if(se==='muertos'&&sh01(gx,gy,1)<.45){const {F}=footCorners(gx,gy,1,1,.08);for(let q=0;q<3;q++)veladora(F[0]-3+q*2.6,F[1]-.5-(q===1?.8:0),q,q!==1);px(F[0]+4.5,F[1]-2.4,2.2,2.2,'#ff9f1c');px(F[0]+4.9,F[1]-.4,1.4,.8,'#8a5a2b')}
    else if(se==='navidad'&&(OPT.low?sh01(gx,gy,2)<.35:sh01(gx,gy,2)<.8)){const so=shadowOf(t);if(!so)return;const h=so[1],{L,R,F}=footCorners(gx,gy,1,1,so[0]-.02);
      let q=0;for(const [A,B] of [[L,F],[F,R]])for(let s=(A===F?1:0);s<=3;s++){const f=s/3;bulb(A[0]+(B[0]-A[0])*f,A[1]+(B[1]-A[1])*f-h,XMAS[(q+gx)%XMAS.length],blink(q,gx+gy),q++%2)}}}
}
// momentos de temporada: el Grito una vez por noche y año nuevo
function seasonStep(){if(TITLE)return;const ph=S.clock/DAY;
  if(SEASON_C==='patrias'&&gritoNow()){if(SEAMSG!=='grito'){SEAMSG='grito';if(!REAL){sfx('phase');say(DIST==='domo'?'¡Viva México! ¡Viva el Distrito Domo! El Grito se da frente a El Domo: busca los fuegos artificiales.':'¡Viva México! ¡Viva el Distrito Ribera! Cohetes tricolor sobre el río.',true)}}}
  else if(SEASON_C==='navidad'&&ANYO()&&NIGHT>.7){if(SEAMSG!=='anyo'){SEAMSG='anyo';if(!REAL)say('¡Feliz año nuevo! Cohetes sobre todo el Distrito.',true)}}
  else if(ph<.5)SEAMSG='';
  if(!gritoNow())GRITO_XY=null}
