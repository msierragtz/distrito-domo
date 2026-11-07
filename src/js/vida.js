/* ---------- vida en la calle (v68) ----------
   Cada persona sale de un edificio (se asoma por la puerta), camina por la banqueta de su derecha hasta un lugar que le gusta
   según su grupo y la hora, y entra; en parques, plazas y malecón se queda un rato sentada o platicando. Otras regresan a casa
   o salen a dar la vuelta con el perro, a correr o en patineta. En el camino pasan cosas: dos se paran a platicar, el perro
   olfatea un árbol, alguien se queda viendo una obra, hay fila en el carrito de elotes, con tormenta corren a cubrirse,
   con fuegos artificiales se paran a señalar. Lo que pasa en el Distrito se nota en la calle: sombreros y paletas en la ola
   de calor, garrafones en el corte de agua, playeras en el Clásico, gente rumbo al estadio, cartulinas si a un edificio le
   falta algo. En Ribera: corredores junto al río, cascarita en el lecho seco y curiosos en el puente cuando crece el río.
   Al tocar a alguien se ve quién es, dónde vive, a dónde va y qué piensa («La voz de la calle»), y se le puede seguir. */
let EXTRA=[],WID=0,VOZ=null,FOLLOW=null,FUT=null,FWON=false,VTIP=0;
const OPENK=new Set(['parque','plaza','dogpark','malecon','bosque','kiosco','mirador']),HOMEK=new Set(['edificio','ladrillo','torre','casaf','mixto']);
const WSKIP=new Set(['ciclo','calle','rio','lotedomo','reserva','fabrica','tanque','torreagua','palma','estac','caseta','teleferico']);
const GUST={fam:{alberca:2.5,parroquia:2,banco:.6,gas:.3,mixto:.8,parque:3,plaza:3,escuela:3,tomates:2,resto:1.5,paleteria:2,cine:1.4,boliche:1.4,cancha:2,dogpark:1,clinica:.5,museo:1.2,plazacom:2,kiosco:1.6,domo:1.5,malecon:3,unas:1,cultura:1,bosque:3,mirador:1,beis:.3,padel:.6},
  pro:{banco:2,gas:.6,hotel:.6,mixto:1,oficinas:4,rasca:4,cafe:3,resto:2.5,gym:2.5,bar:1.4,padel:1.5,golf:1.5,barber:1,cine:1,plazacom:1.5,metro:3,museo:1,parque:1,plaza:1,malecon:1.5,tomates:1,unas:.6,domo:1,bosque:1.5,cultura:.8},
  est:{alberca:2,mixto:1,cafe:2,bar:3,cine:2,boliche:2,paleteria:2,cancha:1.5,plaza:2,parque:1.5,barber:1,kiosco:2,cultura:2,metro:2,tomates:1,plazacom:2,mirador:1,malecon:2,domo:1.5,beis:.3}};
const FASE={ma:{banco:1.4,parroquia:.8,alberca:.4,oficinas:3,rasca:3,escuela:4,metro:3,cafe:1.6,gym:1.4,bar:.05,cine:.15,boliche:.15,kiosco:.4},
  di:{resto:1.6,parque:1.2,plaza:1.2,escuela:.6,paleteria:1.4,oficinas:.8,rasca:.8,bar:.3},
  ta:{bar:2,cine:2.2,boliche:2,gym:1.6,resto:1.6,parque:1.2,malecon:1.5,oficinas:.25,rasca:.25,escuela:.05,kiosco:1.6},
  no:{alberca:0,banco:.05,parroquia:.15,bar:3,kiosco:1.4,cine:1,oficinas:0,rasca:0,escuela:0,parque:.3,plaza:.5,cafe:.3,tomates:.2,dogpark:.3,malecon:.6}};
const FN={f:['María','Lupita','Sofía','Ana','Carmen','Daniela','Fernanda','Paty','Rosa','Valeria','Ximena','Laura','Mónica','Elena'],m:['José','Juan','Luis','Carlos','Diego','Jorge','Memo','Alejandro','Rodrigo','Toño','Beto','Emilio','Héctor','Raúl']};
const pickA=(a,r)=>a[Math.min(a.length-1,Math.floor(r*a.length))];
const hora=()=>(S.clock/DAY*24+6)%24,faseH=h=>h>=6&&h<10?'ma':h>=10&&h<17?'di':h>=17&&h<22?'ta':'no';
const rainNow=()=>!!(S.ev&&S.ev.id==='lluvia'),evId=()=>S.ev&&S.ev.id;
const floodNow=()=>DIST==='ribera'&&typeof rioW==='function'&&(rioFase()==='crecida'||rioW()>.62);
const ctr=i=>[i%N+.5,Math.floor(i/N)+.5],SWK=.31;

/* ===== por dónde se camina: calles (no avenidas), cruces de avenida en línea recta y el Puente Atirantado ===== */
const WK={st:null,pass:new Uint8Array(N*N),lift:new Uint8Array(N*N),green:new Uint8Array(N*N),brg:new Uint8Array(N*N),D:[],H:[],Htot:0,sites:[],siteDoor:new Map(),bizDoor:new Set(),riv:[],carts:[]};
const okWalk=t=>t&&((t.k==='calle'&&!t.hw)||((t.k==='domo'||t.k==='lotedomo')&&t.pu));
function wkBuild(){if(WK.st===streets)return;WK.st=streets;const ps=WK.pass,G=S.g;ps.fill(0);WK.lift.fill(0);WK.green.fill(0);WK.brg.fill(0);
  for(let i=0;i<N*N;i++){const t=G[i];if(okWalk(t)){ps[i]=1;if(t.k==='domo'&&!(t.b>0))WK.lift[i]=1;if(t.pu)WK.brg[i]=1}}
  const w1=(a,b)=>inb(a,b)&&ps[idx(a,b)]===1;
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=idx(x,y),t=G[i];if(!(t.k==='calle'&&t.hw)||t.pu)continue;if(w1(x,y-1)&&w1(x,y+1))ps[i]=2;else if(w1(x-1,y)&&w1(x+1,y))ps[i]=3}
  const D=[],H=[],sites=[];WK.siteDoor.clear();WK.bizDoor.clear();WK.riv=[];
  for(let i=0;i<N*N;i++){const t=G[i];if(t.k==='part')continue;const d=DEFS[t.k];if(!d||WSKIP.has(t.k)||(d.hidden&&t.k!=='domo'))continue;if(t.k==='domo'&&t.pu)continue;
    const f=MULTI(t.k)?(foot(i,...DIMT(t))||[i]):[i],fs=new Set(f),doors=[];
    for(const j of f){const x=j%N,y=Math.floor(j/N);for(const [a,b] of NB){const u=x+a,v=y+b;if(!inb(u,v))continue;const k=idx(u,v);if(!fs.has(k)&&ps[k]===1&&!WK.lift[k]&&!doors.some(q=>q[0]===k))doors.push([k,j])}}
    if(t.k==='arbol'||t.k==='parque'||t.k==='palma'||t.k==='bosque'||t.k==='plaza')for(const j of f){const x=j%N,y=Math.floor(j/N);for(const [a,b] of NB)if(inb(x+a,y+b))WK.green[idx(x+a,y+b)]=1}
    if(!doors.length)continue;
    const [fw,fh]=MULTI(t.k)?DIMT(t):[1,1],e={i,k:t.k,doors,cx:i%N+fw/2,cy:Math.floor(i/N)+fh/2,open:OPENK.has(t.k)};
    if(t.b>0){sites.push(e);for(const q of doors)WK.siteDoor.set(q[0],e);continue}
    if(!t.ok&&!d.fixed)continue;if(t.lecho&&(t.dmg||(typeof rioWet==='function'&&rioWet())))continue;
    if(HOMEK.has(t.k)){e.cap=(t.f||1)*(d.per||1);H.push(e)}else{D.push(e);if(!e.open&&d.inc)for(const q of doors)WK.bizDoor.add(q[0])}}
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=idx(x,y);if(ps[i]!==1)continue;if(NB.some(([a,b])=>{const n=inb(x+a,y+b)?G[idx(x+a,y+b)]:null;return n&&(n.k==='rio'||n.k==='malecon'||n.lecho)}))WK.riv.push(i)}
  WK.D=D;WK.H=H;WK.Htot=H.reduce((a,e)=>a+e.cap,0);WK.sites=sites;
  // lugares para los carritos: junto a plazas, parques y malecón (los mismos mientras no cambie el mapa)
  const nC=S.v<60?0:Math.min(3,1+Math.floor(S.v/800)),pri={plaza:0,parque:1,malecon:1,bosque:2,kiosco:2};
  WK.carts=D.filter(e=>e.open&&pri[e.k]!=null).sort((a,b)=>pri[a.k]-pri[b.k]||a.i-b.i).filter((e,k,A)=>A.slice(0,k).every(o=>Math.abs(o.cx-e.cx)+Math.abs(o.cy-e.cy)>4)).slice(0,nC).map(e=>({e,d:e.doors[0]}))}
const BQ=new Int16Array(N*N),BP=new Int16Array(N*N);let BROT=0;
function bfs(a,b){if(a===b)return [a];BP.fill(-1);BP[a]=a;let h=0,t=0;BQ[t++]=a;const ps=WK.pass,r=(BROT++)%4;
  while(h<t){const c=BQ[h++];if(c===b)break;const x=c%N,y=Math.floor(c/N);
    for(let q=0;q<4;q++){const [dx,dy]=NB[(q+r)%4],u=x+dx,v=y+dy;if(!inb(u,v))continue;const n=idx(u,v);if(BP[n]>=0||!ps[n])continue;
      if((ps[n]===2||ps[c]===2)&&dx)continue;if((ps[n]===3||ps[c]===3)&&dy)continue;BP[n]=c;BQ[t++]=n}}
  if(BP[b]<0)return null;const p=[b];let c=b;while(c!==a){c=BP[c];p.push(c)}return p.reverse()}

/* ===== quién sale, de dónde y a dónde ===== */
function wantN(){const h=hora();let f=h<5||h>=23?.3:h<7?.6:h<17?1:h<22?1.15:.6;const ev=evId();if(ev==='lluvia')f*=.65;if(ev==='calor')f*=.75;if(ev==='bazar'||ev==='clasico')f*=1.15;if(beisOn())f*=1.2;
  const cap=OPT.low?18:innerWidth<700?55:80;return Math.max(0,Math.min(cap,Math.floor(Math.min(S.v/6,streets.length*1.3)*f)))}
function homeOf(){const H=WK.H;if(!H.length)return null;let r=Math.random()*WK.Htot;for(const e of H){r-=e.cap;if(r<=0)return e}return H[H.length-1]}
function grpOf(e){const b=stats.Bi&&stats.Bi.get(e.i),v=Math.max(1,S.v),sh=(b&&b.sh)||{fam:S.pop.fam/v,pro:S.pop.pro/v,est:S.pop.est/v};let r=Math.random();for(const g of G3){r-=sh[g]||0;if(r<=0)return g}return 'fam'}
function pickDest(g,home,w){const fz=FASE[faseH(hora())],ev=evId(),G=GUST[g]||GUST.fam;let tot=0;const c=[];
  for(const e of WK.D){let s=G[e.k]||0;if(!s)continue;const m=fz[e.k];if(m!=null)s*=m;
    if(ev==='lluvia'&&e.open)s*=.15;if(ev==='calor'){if(e.k==='paleteria')s*=5;else if(e.open)s*=1.3}if(ev==='clasico'&&(e.k==='bar'||e.k==='resto'))s*=3;if(ev==='bazar'&&e.k==='plaza')s*=4;
    if(e.k==='beis'&&beisOn())s*=40;if(e.k==='dogpark'&&w.L&&w.L.dog)s*=6;
    if(home)s*=Math.exp(-(Math.abs(e.cx-home.cx)+Math.abs(e.cy-home.cy))/7);if(s>0){tot+=s;c.push([s,e])}}
  if(!tot)return null;let r=Math.random()*tot;for(const [s,e] of c){r-=s;if(r<=0)return e}return c[c.length-1][1]}
function doorOf(e,near){if(near==null)return e.doors[Math.floor(Math.random()*e.doors.length)];let best=e.doors[0],bd=1e9;const nx=near%N,ny=Math.floor(near/N);
  for(const d of e.doors){const q=Math.abs(d[0]%N-nx)+Math.abs(Math.floor(d[0]/N)-ny);if(q<bd){bd=q;best=d}}return best}
function strollTo(from){const fx=from%N,fy=Math.floor(from/N);let pool=DIST==='ribera'&&WK.riv.length&&Math.random()<.7?WK.riv:null;
  for(let k=0;k<12;k++){const i=pool?pool[Math.floor(Math.random()*pool.length)]:(()=>{const s=streets[Math.floor(Math.random()*streets.length)];return s?idx(s[0],s[1]):from})();
    const d=Math.abs(i%N-fx)+Math.abs(Math.floor(i/N)-fy);if(d>=4&&d<=12&&WK.pass[i]===1)return i}return null}
function mkLook(w){const R=Math.random,g=w.g,ev=evId(),L={g,s:1};
  L.fem=R()<.5;L.skin=pickA(SKIN,R());L.hair=pickA(HAIR,R());L.pants=pickA(PANTS,R());L.shirt=pickA(SHIRTS,R());L.long=L.fem&&R()<.65;
  if(g==='pro'){L.shirt=pickA(['#2b3a55','#3a3a3a','#5a4a3a','#4a5568'],R());L.vest=1;if(R()<.5)L.brief=1;else L.coffee=1;L.phone=R()<.4}
  if(g==='est')L.back=pickA(['#d62828','#2a9d8f','#f2c94c','#9b5de5'],R());
  if(R()<(PET[g]||.2)*.55)L.dog=pickA(['#8a5a2b','#e8c07a','#2b2b2b','#f4f4f4','#a0522d'],R());
  if(g==='fam'&&!L.dog){const r=R();if(r<.4)L.kid=pickA(['#ff8fb1','#59cd90','#ffd84d','#3fa7d6'],R());else if(r<.55)L.stroller=1}
  // gente de todas las edades y maneras de moverse
  const v=R();
  if(g==='fam'&&v<.12){L.old=1;L.hair='#cfcfcf';L.kid=L.stroller=null;if(L.fem){L.rebozo=pickA(['#7a2a5a','#2a6a8a','#8a5a2b'],R());L.bag=1;L.long=0}else L.cane=1}
  else if(g==='pro'&&v<.06){L.old=1;L.hair='#bdbdbd';L.cane=1;L.brief=L.coffee=0}
  if(!L.old&&!L.dog&&!L.kid&&!L.stroller&&R()<.03)L.wheel=1;
  else if(g==='est'&&!L.dog&&R()<.12)L.skate=1;
  else if((g==='est'||g==='pro')&&!L.dog&&R()<.08+.05*Math.min(3,(stats.counts&&stats.counts.ciclo)||0))L.bike=(stats.counts&&stats.counts.ciclo&&R()<.5)?DCOL():pickA(['#e63946','#2a9d8f','#1d3557','#f2c94c'],R());
  if(L.fem&&g!=='pro'&&!L.old&&R()<.25)L.skirt=pickA(['#7a2a5a','#2a6a8a','#c0392b','#3a3a3a'],R());
  // lo que pasa en el Distrito
  if(ev==='calor'&&R()<.55){if(R()<.6)L.hat=1;else L.cap=pickA(['#d62828','#f4f4f4','#2456a6'],R());if(R()<.45)w.snack='paleta'}
  if(ev==='agua'&&!L.wheel&&!L.bike&&!L.skate&&R()<.35)L.garrafon=1;
  if(ev==='clasico'&&R()<.55)L.jersey=R()<.5?0:1;
  L.umb=R()<.55;
  return L}
function mkName(w){const L=w.L,fn=pickA(FN[L.fem?'f':'m'],whash(w,21)),ap=pickA(SURN,whash(w,22));
  if(L.g==='kid'||L.g==='play')return fn;if(L.g==='worker'||L.g==='vendor')return `${L.fem?'Doña':'Don'} ${fn}`;if(L.old)return `${L.fem?'Doña':'Don'} ${fn} ${ap}`;
  if(L.g==='pro')return `${pickA(L.fem?['Ing.','Lic.','Arq.','Dra.']:['Ing.','Lic.','Arq.','Dr.'],whash(w,23))} ${fn} ${ap}`;return `${fn} ${ap}`}
function newW(g){return {id:++WID,g,ph:Math.random()*9,sp:.42+Math.random()*.18,a:1,cyc:Math.random()*6,X:0,Y:0,ox:0,oy:0,dx:1,front:true,pose:'walk',fr:0,st:'walk',t:0,ks:[]}}
const protesters=()=>walkers.reduce((n,w)=>n+(w.L&&w.L.sign?1:0),0);
function spawn(init){wkBuild();const home=homeOf();if(!home)return null;const g=grpOf(home),w=newW(g),h=hora();w.home=home.i;
  w.L=mkLook(w);w.jog=!w.L.dog&&!w.L.wheel&&!w.L.bike&&!w.L.old&&((h>=6&&h<9)||(h>=18&&h<21))&&Math.random()<.13&&!rainNow();
  if(w.jog){Object.assign(w.L,{jog:1,shirt:pickA(['#ff5d8f','#59cd90','#3fa7d6','#ffbe0b','#f4f4f4'],Math.random()),pants:'#2b2b2b',back:null,brief:0,coffee:0,kid:null,stroller:null,skirt:null,skate:null,vest:null})}
  if(g==='est'&&(h>=21||h<3)&&Math.random()<.5)w.noisy=1;
  let kind=w.L.dog||w.jog||(w.L.skate&&Math.random()<.5)?'stroll':Math.random()<.5?'out':'back';
  if(kind!=='stroll'){w.dest=pickDest(g,home,w);if(!w.dest)kind='stroll'}
  if(w.dest&&w.dest.k==='beis'&&beisOn()){w.L.cap='#c0392b';if(Math.random()<.5)w.L.shirt='#f4f4f4'}
  if(w.dest&&w.dest.k==='escuela'&&w.L.kid)w.L.uni=1;
  const b=stats.Bi&&stats.Bi.get(home.i);if(b&&b.worst<.42&&b.wk&&protesters()<4&&!w.L.bike&&!w.L.skate&&Math.random()<.4)w.L.sign=b.wk;
  const hd=doorOf(home,w.dest?w.dest.doors[0][0]:null);let path,from,to;
  if(kind==='stroll'){const far=strollTo(hd[0]);const p1=far!=null&&bfs(hd[0],far),p2=p1&&bfs(far,hd[0]);if(!p2)return null;path=p1.concat(p2.slice(1));from=to={e:home,d:hd};w.trip=w.L.dog?'perro':w.jog?'correr':w.L.skate?'patineta':'vuelta'}
  else{const dd=doorOf(w.dest,hd[0]),out=kind==='out',A=out?hd:dd,B=out?dd:hd;path=bfs(A[0],B[0]);if(!path)return null;from={e:out?home:w.dest,d:A};to={e:out?w.dest:home,d:B};w.trip=kind}
  w.path=path;w.from=from;w.to=to;w.pi=0;w.u=0;
  if(w.L.old)w.sp*=.62;if(w.jog)w.sp*=2.1;if(w.L.bike)w.sp*=2.6;if(w.L.skate)w.sp*=1.8;if(w.L.garrafon)w.sp*=.8;if(evId()==='calor')w.sp*=.85;
  w.nm=mkName(w);
  if(init&&path.length>1){w.pi=Math.floor(Math.random()*(path.length-1));w.u=Math.random();w.st='walk';w.a=0}else{w.st='exit';w.t=0;w.a=0}
  place(w,0,true);return w}
// niños de uniforme rumbo a la escuela (mañana) o de regreso (después de la una)
function spawnSchool(){const h=hora();if(!((h>=7&&h<8.6)||(h>=13&&h<14.6)))return;const es=WK.D.filter(e=>e.k==='escuela');if(!es.length||!WK.H.length)return;
  const sc=es[Math.floor(Math.random()*es.length)],home=homeOf(),hd=doorOf(home,sc.doors[0][0]),dd=doorOf(sc,hd[0]),go=h<10,path=go?bfs(hd[0],dd[0]):bfs(dd[0],hd[0]);if(!path)return;
  const n=2+Math.floor(Math.random()*2);for(let k=0;k<n;k++){const w=newW('kid');w.home=home.i;w.dest=sc;w.trip=go?'out':'back';w.L={g:'kid',s:.72,fem:Math.random()<.5,skin:pickA(SKIN,Math.random()),hair:pickA(HAIR,Math.random()),shirt:'#f4f4f4',pants:'#1d2a55',back:pickA(['#d62828','#2a9d8f','#f2c94c','#9b5de5'],Math.random()),umb:Math.random()<.5};
    if(w.L.fem&&Math.random()<.6){w.L.skirt='#7a1f2b';w.L.long=Math.random()<.7}w.sp=.5+Math.random()*.1;w.path=path;w.from={e:go?home:sc,d:go?hd:dd};w.to={e:go?sc:home,d:go?dd:hd};w.pi=0;w.u=0;w.st='exit';w.t=-k*.6;w.a=0;w.nm=mkName(w);place(w,0,true);walkers.push(w)}}

/* ===== moverse ===== */
function setSt(w,st,t){w.st=st;w.t=t}
function faceTo(w,tx,ty){const p=P(w.X,w.Y),q=P(tx,ty);w.dx=q[0]-p[0]<-.01?-1:1;w.front=q[1]-p[1]>=-.01}
function segDir(w){const p=w.path,a=p[Math.min(w.pi,p.length-1)],b=p[Math.min(w.pi+1,p.length-1)];if(a===b){const z=p[Math.max(0,w.pi-1)];return [a%N-z%N,Math.floor(a/N)-Math.floor(z/N)]}return [b%N-a%N,Math.floor(b/N)-Math.floor(a/N)]}
function doorVec(d){const [sx,sy]=ctr(d[0]),[bx,by]=ctr(d[1]);return [bx-sx,by-sy]}
// coloca a la persona: centro de la calle + banqueta de su derecha (las bicis van por el arroyo)
function place(w,dt,snap){const p=w.path,a=p[Math.min(w.pi,p.length-1)],b=p[Math.min(w.pi+1,p.length-1)],[ax,ay]=ctr(a),[bx,by]=ctr(b),u=Math.max(0,w.u);
  const x=ax+(bx-ax)*u,y=ay+(by-ay)*u,[dx,dy]=segDir(w),sw=w.L.bike?.1:SWK,tx=-dy*sw,ty=dx*sw,k=snap?1:Math.min(1,dt*5);
  w.ox+=(tx-w.ox)*k;w.oy+=(ty-w.oy)*k;w.cx=x;w.cy=y;w.X=x+w.ox;w.Y=y+w.oy;const ti=idx(Math.floor(x),Math.floor(y));w.lift=WK.lift[ti]?2.5:0;
  if(dx||dy){const P0=P(x,y),P1=P(x+dx,y+dy);w.dx=P1[0]-P0[0]<-.01?-1:1;w.front=P1[1]-P0[1]>=-.01}}
function walkPose(w,moved){const run=w.jog||(rainNow()&&!w.L.umb&&!w.L.bike&&!w.L.wheel&&!w.L.skate&&w.L.g!=='kid');
  if(w.L.bike){w.pose='ride';w.cyc+=moved*5}else if(w.L.wheel){w.pose='sit';w.cyc+=moved*5}
  else if(w.L.skate){w.cyc+=moved*4;w.pose=Math.floor(w.cyc)%6<1?'push':'stand'}else{w.pose=run?'run':'walk';w.cyc+=moved*(run?10:16)/(w.L.s||1)}
  w.fr=Math.floor(w.cyc)%6;return run}
function onTile(w,ti){if(w.L.bike||w.L.g==='kid')return;const R=Math.random();
  if(w.L.dog&&WK.green[ti]&&!w.sn&&R<.22){w.sn=1;setSt(w,'sniff',1.8+Math.random()*1.5);return}
  const site=WK.siteDoor.get(ti);if(site&&R<.3&&walkers.filter(o=>o.st==='watch'&&o.wt===site).length<2){setSt(w,'watch',4+Math.random()*4);w.wt=site;faceTo(w,site.cx,site.cy);return}
  const ct=EXTRA.find(c=>c.ent==='cart'&&c.tile===ti&&c.a>.9);if(ct&&!w.snack&&!w.jog&&R<.4&&ct.q<2){ct.q++;w.qc=ct;w.qn=ct.q;setSt(w,'queue',4+Math.random()*3);return}
  if(rainNow()&&!w.L.umb&&!w.L.wheel&&WK.bizDoor.has(ti)&&!w.sh&&R<.25){w.sh=1;setSt(w,'shelter',6+Math.random()*6);const e=WK.D.find(q=>q.doors.some(d=>d[0]===ti));if(e){const d=e.doors.find(q=>q[0]===ti),[vx,vy]=doorVec(d);w.shv=[vx*.4,vy*.4];faceTo(w,w.cx-vx,w.cy-vy)}return}
  if(WK.brg[ti]&&floodNow()&&!w.fl&&R<.6){w.fl=1;setSt(w,'river',5+Math.random()*4);return}}
function stepW(w,dt){
  if(w.bub){w.bub.t-=dt;if(w.bub.t<=0)w.bub=null}
  const st=w.st;
  if(st==='exit'){w.t+=dt*w.sp/.45;if(w.t<0){w.a=0;return true}const d=w.from.d,[vx,vy]=doorVec(d),[sx,sy]=ctr(d[0]),[dx,dy]=segDir(w),sw=w.L.bike?.1:SWK,tx=-dy*sw,ty=dx*sw,k=Math.min(1,w.t);
    w.ox=vx*.47*(1-k)+tx*k;w.oy=vy*.47*(1-k)+ty*k;w.cx=sx;w.cy=sy;w.X=sx+w.ox;w.Y=sy+w.oy;w.a=Math.min(1,w.t*1.6);w.lift=0;walkPose(w,dt*w.sp*.6);faceTo(w,sx-vx+tx,sy-vy+ty);
    if(w.t>=1){w.st='walk';w.a=1}return true}
  if(st==='walk'){if(w.a<1)w.a=Math.min(1,w.a+dt*2);const ti=w.path[Math.min(w.pi,w.path.length-1)],cross=WK.pass[ti]>1;let sp=w.sp*(cross?1.5:1);const run=walkPose(w,0);if(run&&!w.jog)sp*=1.6;
    const mv=sp*dt;w.u+=mv;walkPose(w,mv);
    while(w.u>=1&&w.pi<w.path.length-1){w.u-=1;w.pi++;const n=w.path[w.pi];if(!WK.pass[n]){setSt(w,'leave',0);break}if(w.pi<w.path.length-1)onTile(w,n);if(w.st!=='walk')break}
    if(w.pi>=w.path.length-1){w.u=0;const e=w.to.e;w.t=0;w.st=e&&e.open&&w.trip!=='back'?'in':'enter';if(w.st==='in'){const [fx,fy]=ctr(w.to.d[1]),[vx,vy]=doorVec(w.to.d);w.spot=[fx+(Math.random()-.5)*.5-vx*.1,fy+(Math.random()-.5)*.5-vy*.1]}}
    place(w,dt);return true}
  if(st==='enter'){w.t+=dt*w.sp/.45;const d=w.to.d,[vx,vy]=doorVec(d),[sx,sy]=ctr(d[0]),k=Math.min(1,w.t);w.X=sx+w.ox*(1-k)+vx*.47*k;w.Y=sy+w.oy*(1-k)+vy*.47*k;w.a=1-k;walkPose(w,dt*w.sp*.6);faceTo(w,sx+vx,sy+vy);
    if(w.t>=1)return false;return true}
  if(st==='in'||st==='out'){const tgt=st==='in'?w.spot:ctr(w.path[0]),dx=tgt[0]-w.X,dy=tgt[1]-w.Y,dd=Math.hypot(dx,dy),mv=w.sp*dt;faceTo(w,tgt[0],tgt[1]);walkPose(w,mv);
    if(dd<=mv){w.X=tgt[0];w.Y=tgt[1];if(st==='in'){const sit=!w.L.wheel&&!w.jog&&!w.L.dog&&w.to.e.k!=='dogpark'&&Math.random()<.55;setSt(w,'stay',6+Math.random()*10);w.pose=sit?'sit':'stand';w.sit=sit;if(w.L.dog)w.dogrun=1}
      else{w.st='walk';w.pi=0;w.u=0;w.ox=w.X-tgt[0];w.oy=w.Y-tgt[1]}}else{w.X+=dx/dd*mv;w.Y+=dy/dd*mv}w.lift=0;return true}
  if(st==='stay'){w.t-=dt;w.pose=w.sit?'sit':w.bub?'talk':'stand';w.fr=Math.floor(T*2.5)%2;if(w.t<=0){const home=WK.H.find(e=>e.i===w.home)||homeOf();if(!home)return false;const hd=doorOf(home,w.to.d[0]),p=bfs(w.to.d[0],hd[0]);
      if(!p){setSt(w,'leave',0);return true}w.from=w.to;w.to={e:home,d:hd};w.path=p;w.trip='back';w.st='out';w.dest=w.from.e;w.dogrun=0}return true}
  if(st==='leave'){w.a-=dt*1.5;return w.a>0}
  // paradas en el camino
  w.t-=dt;
  if(st==='chat'){w.pose='talk';w.fr=Math.floor(T*2.2+w.ph)%2}
  else if(st==='look'||st==='river'){w.pose='point';w.fr=Math.floor(T*3+w.ph)%2;if(st==='look'&&FWON)w.t=Math.max(w.t,1.2);if(st==='river'){const [dx,dy]=segDir(w),s=Math.sign(w.ox*-dy+w.oy*dx)||1;faceTo(w,w.cx-dy*s*2,w.cy+dx*s*2)}}
  else if(st==='shelter'){w.pose='stand';w.X+=((w.cx+(w.shv?w.shv[0]:0))-w.X)*Math.min(1,dt*3);w.Y+=((w.cy+(w.shv?w.shv[1]:0))-w.Y)*Math.min(1,dt*3);if(!rainNow())w.t=Math.min(w.t,.5)}
  else if(st==='queue'){w.pose='stand';const c=w.qc;if(c){const [sx,sy]=segDir(w);const qx=c.X+sx*.3*w.qn,qy=c.Y+sy*.3*w.qn;w.X+=(qx-w.X)*Math.min(1,dt*3);w.Y+=(qy-w.Y)*Math.min(1,dt*3);faceTo(w,c.X,c.Y)}
    if(w.t<=0&&c){c.q=Math.max(0,c.q-1);w.snack=c.typ;w.qc=null}}
  else w.pose='stand';
  if(w.t<=0){w.st='walk';w.bub=null}return true}
// pláticas: dos que van por la misma banqueta y se cruzan, o dos sentados en el mismo parque
function chats(dt){let on=walkers.filter(w=>w.st==='chat').length;const M=new Map();
  for(const w of walkers){if(w.st==='stay'){const k='s'+w.to.d[1];(M.get(k)||M.set(k,[]).get(k)).push(w);continue}
    if(w.st!=='walk'||w.L.bike||w.L.skate||w.jog||w.cc||w.L.g==='kid')continue;const k=Math.floor(w.cx)*N+Math.floor(w.cy);(M.get(k)||M.set(k,[]).get(k)).push(w)}
  for(const [k,L] of M){if(L.length<2)continue;
    if(typeof k==='string'){if(!L.some(w=>w.bub)&&Math.random()<dt*.35){const w=L[Math.floor(Math.random()*L.length)];w.bub={ic:pickA(['dots','dots','heart','note'],Math.random()),t:2.6};const o=L.find(q=>q!==w);if(o){faceTo(w,o.X,o.Y);faceTo(o,w.X,w.Y)}}continue}
    if(on>=3)continue;for(let i=0;i<L.length-1;i++){const a=L[i],b=L[i+1];if(Math.abs(a.ox-b.ox)+Math.abs(a.oy-b.oy)>.2||Math.hypot(a.X-b.X,a.Y-b.Y)>.5||Math.random()>dt*.7)continue;
      const t=3.5+Math.random()*3;setSt(a,'chat',t);setSt(b,'chat',t);a.cc=b.cc=1;faceTo(a,b.X,b.Y);faceTo(b,a.X,a.Y);a.bub={ic:evId()==='clasico'?'ball':'dots',t:t*.5};on++;break}}
  for(const w of walkers)if(w.st==='chat'&&!w.bub&&w.t>1.2&&Math.random()<dt*.5)w.bub={ic:pickA(['dots','heart','note'],Math.random()),t:1.6}}

/* ===== los que no van a ningún lado: trabajadores de obra, carritos y la cascarita del río ===== */
function extras(dt){const h=hora(),keep=new Set();
  // un maestro de obras por cada obra (hasta 4), con casco y chaleco, viendo cómo va
  for(const e of WK.sites.slice(0,4)){const id='o'+e.i;keep.add(id);let w=EXTRA.find(q=>q.key===id);
    if(!w){w=newW('worker');w.key=id;w.ent='person';w.L={g:'worker',s:1,fem:Math.random()<.15,skin:pickA(SKIN,Math.random()),hair:pickA(HAIR,Math.random()),shirt:'#5a6a7a',pants:'#3b5a8a',hardhat:1};w.nm=mkName(w);w.a=0;w.st='work';w.site=e;
      const d=e.doors[0],[vx,vy]=doorVec(d),[sx,sy]=ctr(d[0]);w.X=sx+vx*.3+(Math.random()-.5)*.3*Math.abs(vy)*2;w.Y=sy+vy*.3+(Math.random()-.5)*.3*Math.abs(vx)*2;w.cx=sx;w.cy=sy;EXTRA.push(w)}
    w.a=Math.min(1,w.a+dt);faceTo(w,e.cx,e.cy);const ph=(T+w.ph*3)%5.2;w.pose=ph<1.4?'point':'stand';w.fr=Math.floor(T*2)%2}
  // carritos de elotes (mañana y noche) o raspados (mediodía y con calor)
  const cartOn=h>=9&&h<22&&!rainNow()&&!TITLE;
  WK.carts.forEach((c,k)=>{const id='c'+c.e.i;keep.add(id);let w=EXTRA.find(q=>q.key===id);
    if(!w){w=newW('vendor');w.key=id;w.ent='cart';w.L={g:'vendor',s:1,fem:Math.random()<.3,skin:pickA(SKIN,Math.random()),hair:pickA(HAIR,Math.random()),shirt:pickA(['#457b9d','#e63946','#59cd90'],Math.random()),pants:'#3b5a8a'};w.nm=mkName(w);w.a=0;w.q=0;w.tile=c.d[0];
      const [vx,vy]=doorVec(c.d),[sx,sy]=ctr(c.d[0]);w.X=sx+vx*.34;w.Y=sy+vy*.34;w.cx=sx;w.cy=sy;faceTo(w,sx-vx,sy-vy);w.ce=c.e;EXTRA.push(w)}
    w.typ=evId()==='calor'||(h>=12&&h<17)?'raspado':'elote';w.a=Math.max(0,Math.min(1,w.a+(cartOn?dt:-dt)))});
  if(FUT)for(const q of FUT.all)keep.add(q.key);
  EXTRA=EXTRA.filter(w=>{if(keep.has(w.key))return w.ent!=='cart'||w.a>0||cartOn;if(w.ent==='person'&&w.a>0){w.a-=dt;return true}wsprDrop(w);return false})}
function futSpot(){const g=S.g;for(let y=OFF+1;y<=OFF+8;y++){const c=cxR(y);if(cxR(y+1)!==c||cxR(y+2)!==c)continue;if([y,y+1,y+2].includes(LMY))continue;
    let ok=true;for(let yy=y;yy<y+3&&ok;yy++)for(let x=c-1;x<=c+1;x++){const t=g[idx(x,yy)];if(!t||t.k!=='rio')ok=false}if(ok)return [c+.5,y+1.5]}return null}
function futStep(dt){const h=hora(),on=DIST==='ribera'&&!TITLE&&S.v>=20&&rioW()<.3&&!(S.rio&&S.rio.cr>0)&&!rainNow()&&h>=8&&h<19.5;
  if(on&&!FUT){const sp=futSpot();if(sp){const [cx,cy]=sp,pl=[],R=Math.random;
      for(let k=0;k<6;k++){const w=newW('play');w.key='f'+k;w.ent='person';const tm=k%2;w.L={g:'play',s:.72,fem:R()<.3,skin:pickA(SKIN,R()),hair:pickA(HAIR,R()),shirt:tm?'#f4f4f4':'#e63946',pants:tm?'#2456a6':'#2b2b2b'};w.nm=mkName(w);
        w.hx=cx+(k%3-1)*.6;w.hy=cy+(tm?.7:-.7)+(R()-.5)*.3;w.X=w.hx;w.Y=w.hy;w.a=0;w.st='play';w.kcd=0;pl.push(w)}
      const ball={key:'fb',ent:'ball',X:cx,Y:cy,h:0,a:0,fly:0},goals=[{key:'fg0',ent:'goal',X:cx,Y:cy-1.4,a:0},{key:'fg1',ent:'goal',X:cx,Y:cy+1.4,a:0}];
      FUT={cx,cy,pl,ball,all:[...pl,ball,...goals],off:0};EXTRA.push(...FUT.all)}}
  if(!FUT)return;const F=FUT,B=F.ball;F.off=!on;
  for(const q of F.all)q.a=Math.max(0,Math.min(1,q.a+(F.off?-dt:dt)));if(F.off&&B.a<=0){for(const q of F.all)wsprDrop(q);const s=new Set(F.all);EXTRA=EXTRA.filter(q=>!s.has(q));FUT=null;return}
  if(B.fly){B.k+=dt/B.dur;const k=Math.min(1,B.k);B.X=B.x0+(B.x1-B.x0)*k;B.Y=B.y0+(B.y1-B.y0)*k;B.h=Math.sin(k*Math.PI)*B.hh;if(k>=1){B.fly=0;B.h=0}}
  let near=null,nd=1e9;for(const p of F.pl){const d=Math.hypot(p.X-B.X,p.Y-B.Y);if(d<nd){nd=d;near=p}}
  for(const p of F.pl){p.kcd-=dt;const chase=p===near&&!B.fly,tx=chase?B.X:p.hx+Math.sin(T*.7+p.ph)*.25,ty=chase?B.Y:p.hy+Math.cos(T*.5+p.ph)*.2,dx=tx-p.X,dy=ty-p.Y,dd=Math.hypot(dx,dy),mv=Math.min(dd,(chase?1.4:.6)*dt);
    if(dd>.02){p.X+=dx/dd*mv;p.Y+=dy/dd*mv}p.X=Math.max(F.cx-1.2,Math.min(F.cx+1.2,p.X));p.Y=Math.max(F.cy-1.35,Math.min(F.cy+1.35,p.Y));
    const moving=mv>.004;p.pose=moving?'run':'stand';if(moving){p.cyc+=mv*10/.72;faceTo(p,tx,ty)}else faceTo(p,B.X,B.Y);p.fr=Math.floor(p.cyc)%6;
    if(chase&&dd<.12&&p.kcd<=0){const others=F.pl.filter(q=>q!==p),to=others[Math.floor(Math.random()*others.length)],gx=to.X+(Math.random()-.5)*.3,gy=to.Y+(Math.random()-.5)*.3,L=Math.hypot(gx-B.X,gy-B.Y);
      Object.assign(B,{fly:1,k:0,x0:B.X,y0:B.Y,x1:gx,y1:gy,dur:Math.max(.25,L/2.4),hh:2+L*2.5});p.kcd=.8;p.pose='walk';p.fr=1}}}

/* ===== el ciclo ===== */
let SPAWNT=0,SCHT=0;
function updWalkers(dt){if(!S||!streets)return;wkBuild();WBUD=OPT.low?2:innerWidth<700?5:8;
  const want=wantN();
  if(walkers.length<want*.5&&want>4){for(let k=0;k<want*2&&walkers.length<want;k++){const w=spawn(true);if(w)walkers.push(w)}}
  SPAWNT-=dt;if(walkers.length<want&&SPAWNT<=0){const w=spawn(false);if(w)walkers.push(w);SPAWNT=.35}
  if(walkers.length>want+3){const w=walkers.find(q=>q.st==='walk'&&q!==VOZ?.w);if(w)setSt(w,'leave',0)}
  SCHT-=dt;if(SCHT<=0){SCHT=6;if(Math.random()<.5)spawnSchool()}
  // fuegos artificiales: la gente se para a verlos
  const fw=!TITLE&&!lowMo()&&(FWQ>0||!!GRITO_XY||(ANYO()&&NIGHT>.7));if(fw&&!FWON)for(const w of walkers)if((w.st==='walk'||w.st==='stay')&&w.L.g!=='kid'&&!w.L.bike&&Math.random()<.45){w.prevSt=w.st;setSt(w,'look',3)}FWON=fw;
  walkers=walkers.filter(w=>{if(w.st==='look'&&w.t<=0&&w.prevSt==='stay'){w.st='stay';w.t=3}const ok=stepW(w,dt);if(!ok)wsprDrop(w);return ok});
  chats(dt);extras(dt);if(DIST==='ribera')futStep(dt);
  // curiosos en el puente cuando crece el río
  if(floodNow()&&walkers.filter(w=>w.st==='river').length<3&&Math.random()<dt*.5){const w=walkers.find(q=>q.st==='walk'&&WK.brg[q.path[Math.min(q.pi+1,q.path.length-1)]]);if(w)w.fl=0}
  if(VOZ){VOZ.t-=dt;if(VOZ.t<=0){VOZ.t=.5;vozSync()}}
  if(!TITLE&&!S.vozTip&&S.seen&&(VTIP+=dt)>45){S.vozTip=1;say('Nuevo: toca a una persona en la calle para saber quién es, a dónde va y qué piensa. Hasta la puedes seguir con la cámara.')}}

/* ===== La voz de la calle ===== */
const VOZNEED={verde:['Ojalá hubiera un parque más cerca de mi edificio.','En mi cuadra no hay ni un árbol. Hace falta verde.'],park:['Cada noche le doy vueltas a la cuadra para estacionarme.','Aquí no hay dónde dejar el carro.'],
  dog:['Mi perro necesita un dog park cerca.','No hay dónde soltar a los perros en todo el barrio.'],com:['Para todo hay que salir del barrio: no hay nada cerca.']};
const SIGNTXT={verde:'¡Queremos un parque! Por eso traigo mi cartulina.',park:'¡Queremos estacionamiento! Ya no hay dónde dejar el carro.',dog:'¡Un dog park para el barrio! Los perros también son vecinos.',com:'¡Queremos negocios cerca! Para todo hay que salir del barrio.'};
const art=n=>/[aá]$|ería$|ción$/.test(n.split(' ')[0])?'una':'un';
function missingLike(w,b){const g=w.L.g;if(!b)return null;const ks=Object.keys(LIKE).filter(k=>LIKE[k].includes(g)&&S.unl.includes(k)&&DEFS[k]&&DEFS[k].R&&!DEFS[k].obra&&!DEFS[k].hidden);
  const have=new Set();for(const a of stats.A||[])if(a.d&&a.d.R&&Math.abs(a.x-b.x)+Math.abs(a.y-b.y)<=a.d.R)have.add(a.k);const miss=ks.filter(k=>!have.has(k));return miss.length?pickA(miss,whash(w,31)):null}
function pensar(w){const L=w.L,R=whash(w,30),ev=evId(),b=stats.Bi&&stats.Bi.get(w.home),dn=w.dest?nameOf(S.g[w.dest.i]):'';
  if(L.g==='worker')return pickA(['Si no llueve, la terminamos a tiempo.','Ya vamos en la losa. Quedó bien derechita.','Esta obra va a quedar de lujo.'],R);
  if(L.g==='vendor')return w.typ==='elote'?'¡Elotes y esquites! ¿Con todo?':'¡Raspados de tamarindo, de limón y de mango!';
  if(L.g==='play')return pickA(['¡Pásala, pásala!','En secas el río es nuestra cancha.','¡Gol! Bueno, casi.'],R);
  if(L.g==='kid')return w.trip==='out'?'Hoy hay examen de mate…':'¡Ya salimos! Vamos por un raspado.';
  if(L.sign)return SIGNTXT[L.sign]||VOZNEED.verde[0];
  if(ev&&R<.65){if(ev==='lluvia')return L.umb?'Qué bueno que traje paraguas.':'¡Se soltó el agua y yo sin paraguas!';
    if(ev==='calor')return w.snack==='paleta'?'Con este calor, una paleta es lo único que ayuda.':L.hat?'Cuarenta grados: sin sombrero no salgo.':'¡Qué calor! Ojalá hubiera más sombra.';
    if(ev==='agua')return L.garrafon?'Sin agua otra vez: a cargar garrafones.':'Dicen que el agua regresa en la tarde.';
    if(ev==='clasico')return L.jersey!=null?'¡Hoy ganamos! Voy a verlo con los compas.':'Con el Clásico no hay dónde estacionarse.';
    if(ev==='bazar')return 'Voy al bazar de la plaza a ver qué encuentro.';if(ev==='obra')return 'El ruido de la obra en la avenida no para.'}
  if(w.dest&&w.dest.k==='beis'&&beisOn())return '¡Hay juego! Voy al estadio con la familia.';
  if(DIST==='ribera'&&R<.5){if(floodNow())return '¡Mira cómo viene el río! Nunca lo había visto así.';if(typeof rioWet==='function'&&rioWet())return 'Con las lluvias el río se ve precioso.';if(w.jog)return 'Correr junto al río es lo mejor del barrio.'}
  if(b&&b.worst<.6&&b.wk){if(b.wk==='com'){const m=missingLike(w,b);if(m){const n=DEFS[m].name.toLowerCase();return `Ojalá abrieran ${art(n)} ${n} por aquí.`}}if(b.wk==='dog'&&!L.dog)return 'Los vecinos con perro andan batallando: no hay dog park.';return pickA(VOZNEED[b.wk]||VOZNEED.verde,R*1.7%1)}
  if(b&&b.noisy&&R<.5)return 'La avenida no me deja dormir.';
  if(w.jog)return 'Cinco kilómetros antes del trabajo.';if(L.dog)return 'Dicen que yo saco a pasear al perro. Es al revés.';if(L.skate)return 'Ojalá pusieran un skatepark.';
  if(L.wheel)return b&&b.worst>.7?'Las banquetas de este barrio están bien parejas.':'Ojalá hubiera rampas en todas las esquinas.';
  if(L.old)return 'Llevo toda la vida en Santa Catarina y nunca lo había visto tan bonito.';
  if(w.dest&&dn&&R<.6){const home=WK.H.find(e=>e.i===w.home),d=home?Math.round(Math.abs(home.cx-w.dest.cx)+Math.abs(home.cy-w.dest.cy)):0;return d<=3?`Me encanta tener ${dn} a ${d<=1?'una cuadra':d+' cuadras'}.`:`${dn} me queda lejos, pero vale la pena.`}
  return {fam:'Este barrio es bueno para los niños.',pro:'Vivo cerca de todo. Hasta camino al trabajo.',est:'Aquí hay ambiente y la renta me alcanza.'}[L.g]||'Qué bonito está el Distrito.'}
function rol(w){const L=w.L,f=L.fem;if(L.g==='worker')return f?'maestra de obras':'maestro de obras';if(L.g==='vendor')return w.typ==='elote'?'vende elotes':'vende raspados';if(L.g==='play')return 'juega en el río';if(L.g==='kid')return 'va a la primaria';
  let r={fam:L.old?(f?'abuelita del barrio':'abuelito del barrio'):L.kid||L.stroller?(f?'mamá':'papá'):(f?'vecina':'vecino'),pro:'profesionista',est:'estudiante'}[L.g]||'vecino';
  if(L.dog)r+=' · con su perro';if(L.jog||w.jog)r+=' · sale a correr';if(L.wheel)r+=' · en silla de ruedas';if(L.sign)r+=' · protesta';return r}
function ahora(w){const n=e=>e?nameOf(S.g[e.i]):'';const st=w.st;
  if(w.L.g==='worker')return `Trabaja en la obra: ${n(w.site)}`;if(w.L.g==='vendor')return `Vende junto a: ${n(w.ce)}`;if(w.L.g==='play')return 'Juega una cascarita en el lecho seco del río';
  if(st==='chat')return 'Se paró a platicar';if(st==='queue')return `Hace fila para ${w.qc&&w.qc.typ==='raspado'?'un raspado':'un elote'}`;if(st==='watch')return 'Se quedó viendo la obra';if(st==='shelter')return 'Se cubre de la lluvia';
  if(st==='river')return 'Se asomó a ver el río';if(st==='look')return 'Ve los fuegos artificiales';if(st==='sniff')return 'Espera a que su perro olfatee';
  if(st==='stay')return `Está en: ${n(w.to.e)}`;if(st==='in')return `Llegó a: ${n(w.to.e)}`;
  if(w.trip==='perro')return 'Saca a pasear a su perro';if(w.trip==='correr')return 'Sale a correr';if(w.trip==='patineta')return 'Anda en patineta por el barrio';if(w.trip==='vuelta')return 'Sale a dar la vuelta';
  if(w.trip==='back')return w.from&&w.from.e&&w.from.e.i!==w.home?`Regresa a su casa de: ${n(w.from.e)}`:'Regresa a su casa';return `Va a: ${n(w.to.e)}`}
function vozOpen(w){if(REAL){FOLLOW=FOLLOW===w?null:w;if(typeof fmsg==='function')fmsg(FOLLOW?`Siguiendo a ${w.nm}. Arrastra el mapa para soltar.`:'Ya no sigues a nadie.');VOZ=FOLLOW?{w,t:0,th:pensar(w),gone:0}:null;return}
  sfx('click');VOZ={w,t:0,th:pensar(w),gone:0};for(const o of ['misbox','loanbox','moneybox','distbox'])if($(o))$(o).hidden=true;$('vozbox').hidden=false;vozSync()}
function vozClose(){VOZ=null;FOLLOW=null;const b=$('vozbox');if(b)b.hidden=true}
function vozSync(){const box=$('vozbox');if(!VOZ||!box||REAL)return;const w=VOZ.w,alive=walkers.includes(w)||EXTRA.includes(w);
  if(!alive&&!VOZ.gone){VOZ.gone=1;if(FOLLOW===w)FOLLOW=null}
  const home=w.home!=null&&S.g[w.home]&&DEFS[S.g[w.home].k]?nameOf(S.g[w.home]):null;
  const now=VOZ.gone?(w.st==='enter'?`Entró a: ${w.to&&w.to.e?nameOf(S.g[w.to.e.i]):'su edificio'}`:'Se fue'):ahora(w);
  box.innerHTML=`<h2><span>${w.nm}</span><button class="x" type="button" aria-label="Cerrar">✕</button></h2><p class="vr">${rol(w)}</p><p class="vq">«${VOZ.th}»</p>
    <dl>${home?`<dt>Vive en</dt><dd>${home}</dd>`:''}<dt>Ahora</dt><dd>${now}</dd></dl>
    <div class="vb">${VOZ.gone?'':`<button id="vzF" type="button"${FOLLOW===w?' class="on"':''}>${FOLLOW===w?'Dejar de seguir':'Seguir con la cámara'}</button>`}</div>`;
  box.querySelector('.x').onclick=vozClose;const f=$('vzF');if(f)f.onclick=()=>{FOLLOW=FOLLOW===w?null:w;vozSync()}}
// la cámara acompaña a quien sigues (también en el modo foto)
function followStep(rdt){const w=FOLLOW;if(!w)return;if(!(walkers.includes(w)||EXTRA.includes(w))){FOLLOW=null;if(VOZ)vozSync();return}
  const [a,b]=rot(w.X,w.Y),x1=-(a-b)*TW/2*zoom,y1=(N*TH/2-30-(a+b)*TH/2+6)*zoom,k=Math.min(1,rdt*3);panX+=(x1-panX)*k;panY+=(y1-panY)*k;clampPan()}
// ¿tocaste a alguien? (en la calle, con «¿Qué es?», o donde no se puede construir con la herramienta que traes)
function walkerAt(e,i){const t=i>=0?S.g[i]:null;if(!REAL&&tool!=='ver'&&t&&(canBuild(t)||tool==='demoler'||tool==='mejorar'))return null;
  const r=cv.getBoundingClientRect(),mx=(e.clientX-r.left)/zoom,my=(e.clientY-r.top)/zoom,tol=Math.max(3.5,11/zoom);let best=null,bd=1e9;
  for(const w of walkers.concat(EXTRA)){if(w.ent==='ball'||w.ent==='goal'||(w.a!=null&&w.a<.5))continue;const [sx,sy0]=P(w.X,w.Y),sy=sy0-(w.lift||0),h=(w.ent==='cart'?12:11)*(w.L.s||1);
    if(Math.abs(mx-sx)>tol+(w.ent==='cart'?3:0)||my<sy-h-tol*.5||my>sy+tol*.6)continue;const d=Math.abs(mx-sx)+Math.abs(my-(sy-h/2))*.5;if(d<bd){bd=d;best=w}}
  return best}
