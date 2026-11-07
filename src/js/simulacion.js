function recompute(){
  GV++;EARN.clear();
  let cap=0,inc=0,upk=0,bonus=0,noisy=0,wcap=1000,tour=0,metroB=false;const OB={};const counts={},pts={verde:0,com:0,park:0,dog:0,seg:0};streets=[];
  const B=[],A=[];
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){
    const t=S.g[idx(x,y)],d=DEFS[t.k];
    if(t.k==='calle'&&!t.hw)streets.push([x,y]);
    if(!d)continue;
    counts[t.k]=(counts[t.k]||0)+1;if(t.k==='torreagua'&&!(t.b>0))wcap+=1000;if(t.k==='rasca'&&!(t.b>0))wcap-=300;if(t.k==='metro'&&t.b>0)metroB=true;
    if(t.k==='rio'){t.ok=true;if(t.rc&&y%2===0)A.push({x,y,d:{val:[.035+.06*Math.min(1,rioW()/.6),2]},k:'rio',sz:1});continue}
    if(d.fixed){t.ok=true;bonus+=d.bonus||0;if(d.val)A.push({x,y,d,k:t.k,sz:1});continue}
    if(t.hw){t.ok=true;continue}
    t.ok=t.k==='calle'||(MULTI(t.k)?footConnected(foot(idx(x,y),...DIMT(t))||[idx(x,y)]):connected(x,y));
    const L=lvOf(t);upk+=(d.upk||0)*(d.per?(t.f||1):1)*(1+.4*(L-1));
    if(t.lecho&&(t.dmg||rioWet())){t.ok=false;continue}
    if(!t.ok||t.b>0||(t.lu>0&&!d.per))continue;
    if(t.k==='teleferico')tour+=15;
    if(t.k==='museo'){t.mok=obraTouch(idx(x,y),['parque','plaza','golf','bosque']);if(!t.mok)continue;tour+=10}
    if(d.obra){const [ow,oh]=DIMT(t);OB[t.k]={x:x+(ow-1)/2,y:y+(oh-1)/2,i:idx(x,y)}}
    if(t.k==='beis'&&S.beis&&S.beis.on>0)tour+=BEIS_INC;
    const nb=NB.map(([dx,dy])=>inb(x+dx,y+dy)?S.g[idx(x+dx,y+dy)]:null);
    if(d.per){const c=t.f*d.per;cap+=c;const nz=nb.some(n=>n&&n.hw);if(nz)noisy+=c;B.push({i:idx(x,y),x,y,k:t.k,f:t.f,lv:L,cap:c,noisy:nz,got:{verde:0,park:0,dog:0},gotC:{fam:0,pro:0,est:0},dis:{fam:0,pro:0,est:0}})}
    for(const k in pts)pts[k]+=d[k]||0;
    bonus+=(d.bonus||0)*(t.k==='clinica'?1+.3*(L-1):1);
    if(d.R||d.val){const [fw,fh]=DIMT(t);A.push({x:x+(fw-1)/2,y:y+(fh-1)/2,d,k:t.k,sz:Math.max(fw,fh),m:1+.3*(L-1),vm:1+.25*(L-1)})}
    if(d.inc){t.syn=(t.k==='cafe'||t.k==='resto')&&nb.some(n=>n&&(n.k==='parque'||n.k==='plaza')&&!(n.b>0));const iv=d.inc*(t.syn?1.5:1)*bizX(t,x,y,nb)*(1+.5*(L-1))*ECO.incMul*bootMul();if(!d.obra&&d.R&&LIKE[t.k]&&A.length&&A[A.length-1].k===t.k){A[A.length-1].inc0=iv;A[A.length-1].i=idx(x,y)}else inc+=iv}
  }
  // cercanía: cada servicio reparte lo que ofrece entre los edificios a su alcance, según cuántos vecinos tienen
  const dist=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
  for(const a of A){if(!a.d.R)continue;const inR=B.filter(b=>dist(a,b)<=a.d.R),C=inR.reduce((s,b)=>s+b.cap,0);if(!C)continue;
    const cal=a.k==='paleteria'&&S.ev&&S.ev.id==='calor';for(const k of ['verde','park','dog']){const am=(a.d[k]||0)+(cal&&k==='verde'?3:0)+(a.k==='bosque'&&k==='verde'&&S.ev&&S.ev.id==='calor'?15:0);if(am)for(const b of inR)b.got[k]+=am*(a.m||1)*b.cap/C}}
  // plusvalía de cada terreno
  const VAL=new Float32Array(N*N),neg=new Float32Array(N*N);
  // plusvalía por capas: cada cosa alimenta una sola capa según lo que es; cada capa satura por su cuenta
  const posVerde=new Float32Array(N*N),posCom=new Float32Array(N*N),posPark=new Float32Array(N*N),posDog=new Float32Array(N*N);
  const capaDe=a=>a.d.obra?({v:posVerde,c:posCom,p:posPark})[OBRACAPA[a.k]]:a.d.dog?posDog:(a.d.park&&!a.d.verde)?posPark:isBiz(a.k)?posCom:posVerde;
  for(const a of A){const pv=a.d.val||(a.d.park?PARKVAL:null);if(!pv)continue;const R=pv[1],amt=pv[0]*(a.vm||1),buf=capaDe(a);
    for(let y=Math.max(0,a.y-R);y<=Math.min(N-1,a.y+R);y++)for(let x=Math.max(0,a.x-R);x<=Math.min(N-1,a.x+R);x++){const dd=Math.abs(x-a.x)+Math.abs(y-a.y);if(dd<=R)buf[idx(x,y)]+=amt*(1-dd/(R+1))}}
  for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=S.g[idx(x,y)];
    if(t.hw||(t.k==='fabrica'&&!S.da)){const r=t.hw?2:3,amt=t.hw?.2:.22;
      for(let yy=Math.max(0,y-r);yy<=Math.min(N-1,y+r);yy++)for(let xx=Math.max(0,x-r);xx<=Math.min(N-1,x+r);xx++){const dd=Math.abs(xx-x)+Math.abs(yy-y);if(dd<=r){const j=idx(xx,yy);neg[j]=Math.max(neg[j],amt*(1-dd/(r+1)))}}}}
  // la sombra del rascacielos baja un poco la plusvalía alrededor
  if(OB.rasca){const o=OB.rasca,R3=3;for(let y=Math.max(0,Math.floor(o.y-R3));y<=Math.min(N-1,Math.ceil(o.y+R3));y++)for(let x=Math.max(0,Math.floor(o.x-R3));x<=Math.min(N-1,Math.ceil(o.x+R3));x++){const dd=Math.abs(x-o.x)+Math.abs(y-o.y);if(dd<=R3&&dd>=1){const j=idx(x,y);neg[j]=Math.max(neg[j],.06*(1-dd/(R3+1)))}}}
  const pvx=new Float32Array(N*N);if(S.mis&&S.mis.pv)for(const j of S.mis.pv)pvx[j]=.04;
  for(let i=0;i<N*N;i++){const v=pvx[i]+.15+.28*(1-Math.exp(-posVerde[i]*4))+.32*(1-Math.exp(-posCom[i]*16))+.15*(1-Math.exp(-posPark[i]*60))+.10*(1-Math.exp(-posDog[i]*40));VAL[i]=Math.max(0,Math.min(1,v-neg[i]))}
  for(const b of B){b.val=Math.min(1,VAL[b.i]+(b.k==='torre'?.08:b.f>=7?.05:0)+.05*(b.lv-1))}
  // quién vive en cada edificio: depende del tipo de edificio y de la plusvalía
  const mix={fam:0,pro:0,est:0};let vm=0;
  for(const b of B){const hm=HMIX[b.k],v=b.val,w={fam:hm.fam*(.8+.4*v),pro:hm.pro*(.3+1.4*v)*(1+.3*(b.lv-1)),est:hm.est*(1.4-.8*v)},tw=w.fam+w.pro+w.est;
    b.sh={};for(const g of G3){b.sh[g]=w[g]/tw;mix[g]+=b.cap*w[g]/tw}vm+=b.cap*(.6+.9*v)*(1+ECO.rentLv*(b.lv-1))}
  // comercio: cada negocio atiende solo a los grupos a los que les gusta; algunos molestan a un grupo
  // cada negocio cobra según cuántos vecinos a los que les gusta viven en su radio; si hay otro igual cerca, se reparten la clientela
  {const occ=cap?Math.min(1,S.v/cap):0,cnt=new Map();for(const a of A)if(a.inc0){for(const b of B)if(dist(a,b)<=a.d.R)cnt.set(a.k+'|'+b.i,(cnt.get(a.k+'|'+b.i)||0)+1)}
    for(const a of A)if(a.inc0){let cu=0;for(const b of B)if(dist(a,b)<=a.d.R){let s2=0;for(const g of LIKE[a.k])s2+=b.sh[g];cu+=b.cap*occ*s2/cnt.get(a.k+'|'+b.i)}
      a.cust=cu;a.earn=a.inc0*Math.max(ECO.cMin,Math.min(ECO.cMax,Math.pow(cu/ECO.cRef,ECO.cExp)));if(OB.plazacom&&dist(a,OB.plazacom)<=4)a.earn*=.85;inc+=a.earn;if(a.i!=null)EARN.set(a.i,a)}}
  for(const a of A){const G=LIKE[a.k],amt=(a.d.com||COMG[a.k]||0)*(a.m||1);
    if(G&&amt&&a.d.R){const inR=B.filter(b=>dist(a,b)<=a.d.R);let C=0;for(const b of inR)for(const g of G)C+=b.cap*b.sh[g];
      if(C>0)for(const b of inR)for(const g of G)b.gotC[g]+=amt*b.cap*b.sh[g]/C}
    const dg=DISLIKE[a.k];if(dg)for(const b of B)if(dist(a,b)<=3)b.dis[dg]++;
    if(a.k==='kiosco')for(const b of B)if(dist(a,b)<=4)b.dis.fam-=1.5}
  if(OB.bosque)for(const b of B)if(b.noisy&&dist(b,OB.bosque)<=6)noisy-=b.cap*.6;
  if(OB.beis&&S.beis&&S.beis.on>0)for(const b of B){const d2=dist(b,OB.beis);if(d2<=6)b.pk=2.5;if(d2<=3)b.dis.fam++}
  const Bi=new Map(B.map(b=>[b.i,b]));
  Object.assign(stats,{ob:OB,metro:!!OB.metro,metroB,cap,inc,tour,upkBase:upk,upk,counts,wcap,pts,bonus,mix,B,Bi,A,VAL,valMult:cap?vm/cap:1,noise:cap?.12*noisy/cap:0});
  satCalc();
}
function fixPop(){
  if(!S.pop){const v=S.v;S.pop={fam:v*.45,pro:v*.25,est:v*.3}}
  if('mas' in S.pop||'prob' in S.pop||!('est' in S.pop)){S.pop={fam:(S.pop.fam||0)+(S.pop.mas||0),pro:S.pop.pro||0,est:(S.pop.prob||0)+(S.pop.est||0)};S.arr=null;S.dep=null;S.migG=1}
  S.v=S.pop.fam+S.pop.pro+S.pop.est;
}
/* necesidades por edificio (cercanía) + satisfacción por grupo */
function satCalc(){
  const v=Math.max(S.v,1),p=stats.pts||{seg:0},pop=S.pop,B=stats.B||[];
  const ev=S.ev?EVENTS.find(e=>e.id===S.ev.id):null,m=(ev&&ev.mod)||{};
  const lm=1+.03*(S.lots||0),occ=stats.cap?Math.min(1,S.v/stats.cap):0;
  const petSh=S.v>0?G3.reduce((a,g)=>a+pop[g]*PET[g],0)/S.v:.3;
  const parkOn=Math.max(0,Math.min(1,(S.v-20)/40));
  const rate={verde:1.25*lm*(m.verde||1)/8,com:1.25*lm*(m.com||1)/12,park:1.25*parkOn*lm*(m.park||1)/15*(stats.metro?.7:1),dog:1.25*petSh*lm/18};
  const keys=['verde','com','park','dog'],W={fam:0,pro:0,est:0},scg={fam:{},pro:{},est:{}},sc={},dis={fam:0,pro:0,est:0};
  for(const k of keys){sc[k]=0;for(const g in scg)scg[g][k]=0}
  let wc=0;
  for(const b of B){const occB=b.cap*occ;b.sc={};b.scC={};let worst=1,wk=null;
    for(const k of ['verde','park','dog']){const need=occB*rate[k]*(k==='park'&&b.pk?b.pk:1);b.sc[k]=need<=.3?1:Math.min(1,b.got[k]/need)}
    let cs=0;for(const g of G3){const need=occB*b.sh[g]*rate.com;b.scC[g]=need<=.15?1:Math.min(1,b.gotC[g]/need);cs+=b.sh[g]*b.scC[g]}b.sc.com=cs;
    for(const k of keys)if(b.sc[k]<worst){worst=b.sc[k];wk=k}
    b.worst=worst;b.wk=wk;wc+=b.cap;
    if(wk==='com'){let lo=2;for(const g of G3)if(b.sh[g]>.15&&b.scC[g]<lo){lo=b.scC[g];b.wg=g}}
    for(const k of keys)sc[k]+=b.sc[k]*b.cap;
    for(const g of G3){const w=b.cap*b.sh[g];W[g]+=w;dis[g]+=w*Math.max(-.09,Math.min(.15,.06*b.dis[g]));for(const k of keys)scg[g][k]+=(k==='com'?b.scC[g]:b.sc[k])*w}}
  for(const k of keys){sc[k]=wc?sc[k]/wc:1;for(const g in W)scg[g][k]=W[g]?scg[g][k]/W[g]:1}
  for(const g of G3)dis[g]=W[g]?dis[g]/W[g]:0;
  const night=keyf(NF,S.clock/DAY);
  // fiestas: los estudiantes hacen ruido; cada caseta controla a unos 40; los bares suman de noche
  const loose=Math.max(0,pop.est-80*p.seg);
  const nuis=(stats.counts&&stats.counts.cultura?.7:1)*Math.min(.25,Math.max(0,loose/v-.06)*.5)*Math.min(1,loose/40)*(1+.5*night)+Math.min(.05,.012*((stats.counts||{}).bar||0))*night;
  const noise=stats.noise*((ev&&ev.noiseMul)||1)+(stats.metroB?.03:0),gb=beisOn()?.05:0;
  const wdef=Math.max(0,S.v-(stats.wcap||1000));stats.wpen=Math.min(.16,wdef/500*.16);
  // el corte de agua y la falta de agua son el mismo problema: cuenta el mayor de los dos, no la suma
  const evf=ev?(ev.id==='agua'?-Math.max(0,-(ev.flat||0)-stats.wpen):(ev.flat||0)):0;
  // números rojos: el castigo crece con la deuda en proporción al tamaño del Distrito (antes $255 de deuda ya era el castigo máximo aun con 4,000 vecinos)
  const debt=Math.max(0,-S.$),redP=debt?.08*Math.min(1,debt/(300+S.v*5))+Math.min(.17,debt/(1500+S.v*25)):0;
  const common=stats.bonus-redP+evf-stats.wpen+(S.mis&&S.mis.fx.sat?S.mis.fx.sat.a:0);
  const c=x=>Math.max(0,Math.min(1,x));
  const F=scg.fam,Pr=scg.pro,E=scg.est,pet=g=>PET[g]*.35*(scg[g].dog-1);
  const gs={
    fam:c(.12+.45*F.verde+.18*F.com+.2*F.park-1.5*noise-1.2*nuis-dis.fam+pet('fam')+common+gb),
    pro:c(.06+.12*Pr.verde+.5*Pr.com+.25*Pr.park-1*noise-1.6*nuis-dis.pro+pet('pro')+common),
    est:c(.32+.15*E.verde+.4*E.com+.05*E.park-.3*noise-.2*nuis-dis.est+pet('est')+common+gb)
  };
  let sat=0;for(const g in gs)sat+=gs[g]*pop[g];sat=S.v>0?sat/S.v:gs.fam;
  Object.assign(stats,{sc,scg,gs,nuis,loose,ev,dis,petSh,sat:c(sat)});
}
const convCost=t=>Math.max(0,costOf('torre')-Math.round(DEFS[t.k].cost*.5));
const canConv=t=>(t.k==='edificio'||t.k==='ladrillo')&&!(t.b>0)&&!(t.ub>0)&&!(t.lu>0)&&!(t.ct>0);
const costOf=k=>{const d=DEFS[k];return Math.round(d.cost*Math.pow(d.grow||1,stats.counts[k]||0)*(d.inc&&d.R&&!d.obra?1+(S?S.v:0)/ECO.infl:1))};
const upCost=t=>{const d=DEFS[t.k],F=ECO.fl[t.k]||[d.upc,d.upg];return Math.round(F[0]*Math.pow(F[1],t.f-d.f0))};

function tick(dt,quiet){
  let changed=false;
  for(const t of S.g){
    if(t.b>0){t.b-=dt;if(t.b<=0){t.b=0;changed=true;if(!quiet)landed(S.g.indexOf(t));if(!quiet&&t.bt>=10)sfx('done');if(!quiet&&t.bt>=10)say(`¡Listo! Se terminó de construir: ${DEFS[t.k].name}.`);if(!quiet&&(t.k==='domo'||DEFS[t.k].obra))momento(S.g.indexOf(t));}}
    if(t.lu>0){t.lu-=dt;if(t.lu<=0){t.lu=0;t.lv=lvOf(t)+1;changed=true;if(!quiet){const i=S.g.indexOf(t);sparkle(i);flashAt(i,.9);confetti(i,40);sfx('levelup');say(`¡Listo! Ahora es ${nameOf(t)}, nivel ${t.lv} de 4.`)}}}
    if(t.ct>0){t.ct-=dt;if(t.ct<=0){const was=DEFS[t.k].name;t.ct=0;if(!quiet)landed(S.g.indexOf(t));t.k='torre';t.f=DEFS.torre.f0;t.lv=1;delete t.lu;changed=true;if(!quiet){sfx('done');say(`¡Listo! El ${was.toLowerCase()} ya es una ${DEFS.torre.name} de ${t.f} pisos.`)}}}
    if(t.ub>0){t.ub-=dt;if(t.ub<=0){t.ub=0;t.f++;changed=true;if(!quiet){const i=S.g.indexOf(t);flashAt(i,.5);confetti(i,14)}if(!quiet)say(`${DEFS[t.k].name} terminado: ahora tiene ${t.f} pisos.`)}}
  }
  if(changed)recompute();else satCalc();
  const {cap,sat,gs,mix}=stats,pop=S.pop,before={...pop};
  // llegadas: el ritmo depende de la satisfacción general; el tipo, de la vivienda y de quién está a gusto
  if(sat>=.5&&S.v<cap){
    const k=Math.min(1,(sat-.5)/.45),add=Math.min(cap-S.v,k*(.3+.004*cap)*.56*dt*(stats.metro?1.3:1));
    // cada grupo solo ocupa su parte de los departamentos (mix = lugares para ese grupo)
    const w={};let tot=0;for(const g in pop){const room=Math.max(0,(mix[g]||0)-pop[g]);w[g]=room>0?Math.min(room,(mix[g]||0)*.2+1)*(gs[g]>=.5?1:.3)*SPD[g]:0;tot+=w[g]}
    if(tot>0)for(const g in pop)pop[g]+=Math.min(Math.max(0,(mix[g]||0)-pop[g]),add*w[g]/tot);
  }
  // salidas: cada grupo se va si él está molesto
  for(const g in pop)if(gs[g]<.4&&pop[g]>0)pop[g]=Math.max(0,pop[g]-(.4-gs[g])*2.5*(.1+pop[g]*.006)*dt);
  fixPop();
  for(const g in pop){const room=(mix[g]||0)*1.1;if(pop[g]>room&&room>=0)pop[g]=Math.max(room,pop[g]-Math.max(.2,.05*(pop[g]-room))*dt)}fixPop();
  if(S.v>cap){const tgt=Math.max(cap,S.v-Math.max(1,.2*(S.v-cap))*dt),f=S.v>0?tgt/S.v:0;for(const g in pop)pop[g]*=f;fixPop()}
  stats.upk=stats.upkBase*ECO.upk*(1+S.v/4000)*(1+.08*(S.lots||0));
  let rent=0;for(const g in pop)rent+=pop[g]*RENT[g]*(.5+gs[g]);rent*=stats.valMult||1;
  let biz=Math.min(stats.inc,S.v*ECO.bizCap)*((stats.ev&&stats.ev.incMul)||1);
  if(stats.ev&&stats.ev.id==='lluvia'&&stats.inc>0){let ci=0;for(const [,a] of EARN)if(a.k==='cine')ci+=a.earn;biz+=Math.min(stats.inc,S.v*ECO.bizCap)/stats.inc*ci*.45}
  if(stats.ev&&stats.ev.id==='clasico'&&S.mis&&S.mis.fx.clas)biz*=1.5;
  const lp=S.loan?Math.min(S.loan.pay,S.loan.left/Math.max(dt,1e-6)):0;stats.loanPay=lp;
  stats.rent=rent;stats.biz=biz;stats.income=rent+biz+(stats.tour||0)-stats.upk-lp;
  if(S.loan){S.loan.left-=lp*dt;if(S.loan.left<=.01){S.loan=null;if(!quiet)say('Terminaste de pagar tu crédito con Banregio. Ya puedes pedir otro.',true)}}
  const wasPos=S.$>=0;S.$+=stats.income*dt;if(!quiet&&!wasPos&&S.$>=0)sfx('recover');S.redT=S.$<0?(S.redT||0)+dt:0;
  if(!quiet&&S.loan&&!S.loan.re&&S.redT>180&&!S.reMsg){S.reMsg=1;say('Llevas 3 minutos en números rojos. Banregio te ofrece reestructurar tu crédito: abre Crédito y paga menos por segundo.',true)}
  if(S.redT===0)S.reMsg=0;
  if(!quiet&&wasPos&&S.$<0)say('¡Números rojos! El mantenimiento cuesta más de lo que entra. Los vecinos ya lo notaron.',true);
  S.clock=(S.clock+dt)%DAY;
  if(S.ev){S.ev.t-=dt;if(S.ev.t<=0){const e=EVENTS.find(e=>e.id===S.ev.id);S.ev=null;S.evNext=Math.max(90,150+Math.random()*90-6*(S.lots||0));if(e.id==='clasico'&&S.mis&&S.mis.fx.clas&&!S.mis.st.clasico){delete S.mis.fx.clas;if(!quiet)say('El Clásico dejó 50% más en los negocios. ¡Buen negocio!')}recompute();if(!quiet)say(`Terminó: ${e.name}. Todo vuelve a la normalidad.`)}}
  else if(S.maxV>=20){S.evNext=(S.evNext??120)-dt;if(S.evNext<=0){const fe=S.evForce&&EVENTS.find(q=>q.id===S.evForce),e=fe||(stats.wpen>0&&Math.random()<.6?EVENTS.find(q=>q.id==='agua'):EVENTS[Math.floor(Math.random()*EVENTS.length)]);S.evForce=null;S.ev={id:e.id,t:e.dur};recompute();if(!quiet){sfx('event');say(e.msg,true)}}}
  // estadio: cada 8 minutos hay juego de 2 minutos
  if(stats.ob&&stats.ob.beis){const Bs=S.beis=S.beis||{t:90,on:0};
    if(Bs.on>0){Bs.on-=dt;if(Bs.on<=0){Bs.on=0;Bs.t=BEIS_GAP;recompute();if(!quiet)say(Math.random()<.5?'Se acabó el juego en el Estadio: ganamos en la novena. La afición se va contenta.':'Terminó el juego en el Estadio. Mañana hay revancha.')}}
    else{Bs.t-=dt;if(Bs.t<=0){Bs.on=BEIS_DUR;recompute();if(!quiet){sfx('event');say(`¡Hay juego en el Estadio de Béisbol! Por 2 minutos entran $${BEIS_INC}/s y familias y estudiantes andan felices, pero cerca del estadio falta estacionamiento y hay ruido.`,true)}}}}
  rioStep(dt,quiet);
  if(S.v>S.maxV)S.maxV=S.v;
  {const bm=bootMul();if(bm!==S.bootM){const had=S.bootM!=null;S.bootM=bm;if(had){recompute();if(!quiet&&bm===1)say('Tu Distrito ya creció: se acabó el impulso de arranque y los negocios ganan su precio normal.')}}}
  S.phase=S.phase||1;
  while(S.phase<4&&S.maxV>=[0,0,500,1000,2000][S.phase+1]){S.phase++;if(!quiet){celebrate(7);sfx('phase');say({2:'¡FASE 2! El Distrito ya tiene 500 vecinos. Hasta la música creció.',3:'¡FASE 3! 1,000 vecinos. Las torres ya pueden crecer hasta 36 pisos.',4:'¡2,000 VECINOS! Hasta los metales se suman al jazz. La meta: 3,000 vecinos.'}[S.phase],true)}}
  if(!quiet&&!S.won3&&S.maxV>=3000){S.won3=1;S.winT=S.playT||0;celebrate(7);setTimeout(showCredits,4000)}
  if(!quiet)S.playT=(S.playT||0)+dt;
  // aviso antes de que falte el agua: a 250 vecinos del límite y otra vez a 80; cada torre nueva sube el límite y rearma el aviso
  if(!quiet&&S.unl.includes('torreagua')){const wc=stats.wcap||1000,left=wc-S.v;
    if(left<=250&&left>80&&(S.wWarn||0)<wc){S.wWarn=wc;sfx('event');markNew('torreagua');say(`El agua del Distrito alcanza para ${wc.toLocaleString('es-MX')} vecinos y ya van ${Math.floor(S.v).toLocaleString('es-MX')}. Construye una Torre de agua (pestaña Servicios) antes de que sea demasiado tarde: sin agua la gente se enoja y empieza a irse.`,true)}
    else if(left<=80&&left>0&&(S.wWarn2||0)<wc){S.wWarn2=wc;sfx('event');markNew('torreagua');say(`¡Ya casi no hay agua! Faltan ${Math.max(1,Math.ceil(left))} vecinos para llegar al límite de ${wc.toLocaleString('es-MX')}. Construye una Torre de agua ya.`,true)}}
  if(!quiet&&stats.wpen>0&&!S.wMsg){S.wMsg=1;say(`Ya no alcanza el agua: con más de ${(stats.wcap||1000).toLocaleString('es-MX')} vecinos baja la presión y hay más cortes de agua. Construye otra Torre de agua para surtir a 1,000 vecinos más.`,true)}
  else if(!quiet&&stats.wpen>0&&S.wMsg===2&&S.v>(stats.wcap||1000)+50){S.wMsg=1;say(`Ya son más vecinos que agua: tus torres surten a ${(stats.wcap||1000).toLocaleString('es-MX')}. Construye otra Torre de agua para 1,000 más.`,true)}
  if(stats.wpen===0&&S.wMsg===1&&(stats.wcap||1000)>1000){S.wMsg=2;if(!quiet)say('¡La nueva Torre de agua ya surte al Distrito! Regresó la presión.',true)}
  if(S.pvMsg&&!quiet){S.pvMsg=0;say('Cambió la plusvalía: ahora cada barrio se mide por cuatro cosas a la vez (verde, comercio, estacionamiento y dog park). Tus mejoras se quedan; para el nivel 4 hace falta un barrio completo.',true)}
  if(!S.lotMsg&&S.maxV>=LOT_UNLOCK){S.lotMsg=1;if(!quiet)say(`¡Ya puedes expandir el Distrito! Toca un terreno gris con letrero de SE VENDE. El primero cuesta $${fmt(lotPrice())}.`)}
  S.parMsg=S.parMsg||[];for(const p in PARCELS){const P_=PARCELS[p];if(P_.unlock>LOT_UNLOCK&&S.maxV>=P_.unlock&&!S.parMsg.includes(p)&&S.g.some(t=>isParcel(t)&&t.p===p)){S.parMsg.push(p);if(!quiet){sfx('unlock');say(`¡Nuevo terreno a la venta: ${P_.name}, ${P_.where}! Busca su letrero de SE VENDE.`)}}}
  for(const k of ORDER){
    if(!S.unl.includes(k)&&S.maxV>=DEFS[k].unlock&&DEFS[k].unlock<Infinity){S.unl.push(k);if(!quiet){if(DEFS[k].trophy){celebrate(7);sfx('phase');say(`¡TROFEO! Con ${DEFS[k].unlock.toLocaleString('es-MX')} vecinos te ganaste el ${DEFS[k].name}. Es gratis: búscalo en la barra y ponlo donde quieras.`,true)}else{sfx('unlock');say(`¡Nuevo! Ya puedes construir: ${DEFS[k].name}.`)}markNew(k)}}
  }
  misStep(dt,quiet);
  // mensajes de quién llega y quién se va
  S.arr=S.arr||{fam:0,pro:0,est:0};S.dep=S.dep||{fam:0,pro:0,est:0};
  for(const g in pop){const d=pop[g]-before[g];if(d>0)S.arr[g]+=d;else S.dep[g]-=d}
  if(!quiet){
    const sur=()=>SURN[Math.floor(Math.random()*SURN.length)];
    for(const g in pop){
      if(S.arr[g]>=5){S.arr[g]=0;if(Math.random()<.6)say({
        fam:Math.random()<.4?`Llegó la familia ${sur()} con su perro. Ya preguntaron por el dog park.`:`Se mudó la familia ${sur()} al Distrito. Ya son ${Math.floor(S.v+1e-6)} vecinos.`,
        pro:`Llegó la Ing. ${sur()}, trabaja en Valle y quería vivir cerca.`,
        est:Math.random()<.5?`Llegaron estudiantes de la UDEM al piso de arriba. Ya hubo fiesta hasta las 3 am.`:`Se mudaron unos estudiantes del Tec. Preguntaron dónde está el ${DIST==='ribera'?'mercadito':'Tomates'} más cercano.`}[g])}
      if(S.dep[g]>=3){S.dep[g]=0;say({fam:`Una familia se fue del Distrito. ${complaint('fam')}`,pro:`Un profesionista se mudó a otro lado. ${complaint('pro')}`,
        est:`Unos estudiantes se fueron del Distrito. ${complaint('est')}`}[g])}
    }
    S.hintT=(S.hintT||0)+dt;if(S.hintT>25){S.hintT=0;if(sat<.75&&S.v>3)say(complaint())}
  }
}
/* la queja más urgente: dice qué falta y cuántos edificios no lo tienen cerca */
const COMTXT={fam:'Tomates, restaurante, pádel, plaza, escuela o cancha',pro:'café, Tomates, restaurante, pádel, oficinas o bar',est:'café, Tomates, bar, oficinas o plaza'},COMNEW={fam:['unas','paleteria','boliche','cine'],pro:['barber','unas','gym','cine','golf'],est:['barber','paleteria','boliche','cine']};
const NEEDTXT={verde:['área verde','globito verde','parque, plaza o dog park'],com:['comercio','globito naranja','café, Tomates Market o restaurante'],park:['estacionamiento','globito azul','estacionamiento'],dog:['dog park','globito café','dog park']};
function complaint(g){
  const B=stats.B||[];
  if(S.$<0)return 'Dicen que el Distrito se ve descuidado: sal de números rojos.';
  if(stats.nuis>.08&&g!=='est')return 'Hay quejas por las fiestas de los estudiantes. Una caseta las controla, aunque a los estudiantes no les gusta tenerla cerca.';
  if(g&&stats.dis&&stats.dis[g]>.05)return `A las ${GNAME[g]} no les gusta vivir junto a ${g==='fam'?'bares y oficinas':'casetas'}.`;
  const cnt={verde:0,com:0,park:0,dog:0};for(const b of B)if(b.worst<.55&&b.wk)cnt[b.wk]++;
  const k=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a])[0];
  const who={fam:'Las familias',pro:'Los profesionistas',est:'Los estudiantes'}[g]||'Los vecinos';
  if(cnt[k]>0&&k==='com'){const gc={fam:0,pro:0,est:0};for(const b of B)if(b.worst<.55&&b.wk==='com'&&b.wg)gc[b.wg]++;const gg=g&&gc[g]?g:Object.keys(gc).sort((a,b)=>gc[b]-gc[a])[0];
    const ex=COMNEW[gg].filter(q=>S.unl.includes(q)).map(q=>DEFS[q].name.toLowerCase());return `A los ${GNAME[gg]==='familias'?'papás':GNAME[gg]} de ${cnt[k]===1?'un edificio':cnt[k]+' edificios'} les falta su comercio: pon ${COMTXT[gg]}${ex.length?', '+ex.join(', '):''} a unas cuadras (globito naranja).`}
  if(cnt[k]>0){const T=NEEDTXT[k];return `${who} se quejan: ${cnt[k]===1?'hay un edificio':'hay '+cnt[k]+' edificios'} sin ${T[0]} cerca. Búscalos por el ${T[1]} y pon ${T[2]} a unas cuadras.`}
  if(stats.noise>.08)return `${who} se quejan del ruido de la carretera.`;
  if(S.v>800&&!(stats.counts&&stats.counts.clinica))return 'Con más de 800 vecinos ya urge una clínica: sin urgencias cerca, la gente se siente desprotegida.';
  return `${who} quieren un Distrito más bonito: sube la plusvalía con parques y comercio.`;
}

