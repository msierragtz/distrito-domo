/* ---------- encargos (v63): siempre hay 3 activos, uno de cada tipo; ninguno castiga si no se cumple ---------- */
const MTIPO={barrio:'Barrio',vecinos:'Vecinos',reto:'Reto'};
const mBuilt=k=>{let n=0;for(const t of S.g)if(t.k===k&&!(t.b>0))n++;return n};
const mCnt=fn=>{let n=0;for(const t of S.g)if(DEFS[t.k]&&!(t.b>0)&&fn(t))n++;return n};
// la calle con más cosas de cierto tipo a sus lados: tramos rectos de calle, en filas y columnas
function streetBest(kinds){let best={n:0,run:[],near:[]};
  const scan=(cell)=>{for(let a=0;a<N;a++){let run=[];for(let b=0;b<=N;b++){const [x,y]=cell(a,b),i=b<N?idx(x,y):-1,t=i>=0?S.g[i]:null;
    if(t&&t.k==='calle'&&!t.hw){run.push(i);continue}
    if(run.length>=2){const near=new Set();for(const j of run){const jx=j%N,jy=Math.floor(j/N);for(const [dx,dy] of NB){if(!inb(jx+dx,jy+dy))continue;const q=idx(jx+dx,jy+dy),an=anchorOf(q),at=S.g[an];if(at&&kinds.includes(at.k)&&!(at.b>0)&&at.ok)near.add(an)}}
      if(near.size>best.n)best={n:near.size,run:run.slice(),near:[...near]}}run=[]}}};
  scan((a,b)=>[b,a]);scan((a,b)=>[a,b]);return best}
function domoPark(){const i=S.g.findIndex(t=>t.k==='domo'&&!(t.b>0));if(i<0)return false;const x=i%N,y=Math.floor(i/N);
  for(let yy=Math.max(0,y-2);yy<=Math.min(N-1,y+2);yy++)for(let xx=Math.max(0,x-2);xx<=Math.min(N-1,x+2);xx++){if(Math.abs(xx-x)+Math.abs(yy-y)>2)continue;const q=S.g[anchorOf(idx(xx,yy))];if(q&&(q.k==='parque'||q.k==='plaza')&&!(q.b>0))return true}return false}
const MIS=[
  {id:'cafe3',tipo:'barrio',min:150,name:'Corte y café',txt:'Ten 3 cafés, cada uno junto a un parque o una plaza.',goal:3,prog:()=>mCnt(t=>t.k==='cafe'&&t.syn&&t.ok),rew:{u:'barber'}},
  {id:'domingo',tipo:'vecinos',min:200,name:'Domingo familiar',txt:'Que las familias estén al 75% de satisfacción durante 1 minuto seguido.',hold:60,cond:()=>stats.gs.fam>=.75,rew:{b:[4,1500]}},
  {id:'fiesta',tipo:'reto',min:250,name:'Fiesta en paz',txt:'Aguanta 5 minutos seguidos sin quejas por fiestas de estudiantes. Tienes 10 minutos.',hold:300,lim:600,cond:()=>stats.nuis<.05,rew:{b:[3,1500]}},
  {id:'unas',tipo:'vecinos',min:300,name:'Uñas listas',txt:'Que vivan 40 profesionistas en el Distrito.',goal:40,prog:()=>Math.floor(S.pop.pro+1e-6),rew:{u:'unas'}},
  {id:'fotodomo',tipo:'barrio',min:400,name:'La foto del Domo',txt:'Construye El Domo con un parque o una plaza a 2 cuadras o menos.',goal:1,prog:()=>domoPark()?1:0,rew:{f:6000}},
  {id:'tormenta',tipo:'reto',min:450,name:'Tormenta regia',txt:'Se acerca una tormenta: pásala sin que la satisfacción baje de 60%.',ev:'lluvia',floor:.6,rew:{x:'sat'}},
  {id:'trasnoche',tipo:'barrio',min:600,name:'Noche de boliche',txt:'Pon 3 bares o restaurantes sobre la misma calle.',goal:3,prog:()=>streetBest(['bar','resto']).n,rew:{u:'boliche'}},
  {id:'agua',tipo:'reto',min:750,name:'Agua a tiempo',txt:'Construye una Torre de agua antes de llegar a 950 vecinos.',goal:1,prog:()=>Math.min(1,mBuilt('torreagua')),failIf:()=>S.v>=950,ok:()=>S.v<900||mBuilt('torreagua')>0,once:1,rew:{f:15000}},
  {id:'arbolada',tipo:'barrio',min:900,name:'Calle arbolada',txt:'Pon 5 áreas verdes (parque, plaza o dog park) sobre la misma calle.',goal:5,prog:()=>streetBest(['parque','plaza','dogpark']).n,rew:{x:'pv'}},
  {id:'piso10',tipo:'barrio',min:1000,name:'Piso 10',txt:'Mejora 5 edificios de vivienda a nivel 3 o más.',goal:5,prog:()=>mCnt(t=>DEFS[t.k].per&&lvOf(t)>=3),rew:{b:[5,8000]}},
  {id:'clasico',tipo:'reto',min:1200,name:'Clásico sin claxon',txt:'Viene un Clásico regio: que el estacionamiento no baje de 80% mientras dure.',ev:'clasico',cond:()=>stats.sc.park>=.8,rew:{x:'clas'}},
  {id:'swing',tipo:'vecinos',min:1500,name:'Swing de domingo',txt:'Que vivan 120 profesionistas y estén al 65% de satisfacción.',goal:120,prog:()=>Math.floor(S.pop.pro+1e-6),cond:()=>stats.gs.pro>=.65,rew:{u:'golf'}},
  {id:'parejo',tipo:'vecinos',min:1700,name:'Barrio parejo',txt:'Los tres grupos arriba de 65% al mismo tiempo durante 30 segundos.',hold:30,cond:()=>G3.every(g=>stats.gs[g]>=.65),rew:{b:[5,15000]}},
  {id:'estreno',tipo:'barrio',min:2000,name:'Función de estreno',txt:'Ten el Centro Cultural Domo y 3 negocios en nivel 3 o más.',goal:4,prog:()=>(mBuilt('cultura')?1:0)+Math.min(3,mCnt(t=>isBiz(t.k)&&lvOf(t)>=3)),rew:{u:'cine'}},
  {id:'calor',tipo:'reto',min:2200,name:'Ola de calor',txt:'Viene una ola de calor: pásala sin que la satisfacción baje de 60%.',ev:'calor',floor:.6,rew:{u:'paleteria'}},
  {id:'oficina',tipo:'barrio',min:2400,name:'Oficina en casa',txt:'Ten 4 Oficinas funcionando.',goal:4,prog:()=>mBuilt('oficinas'),rew:{u:'gym'}},
  {id:'cuentas',tipo:'reto',min:2700,name:'Cuentas claras',txt:'Aguanta 15 minutos seguidos sin números rojos. Tienes 25 minutos.',hold:900,lim:1500,cond:()=>S.$>=0,rew:{b:[5,30000]}},
  {id:'crecer',tipo:'barrio',min:2900,name:'Listos para crecer',txt:'Ten 3 Torres de agua y la Clínica en nivel 3 o más.',goal:4,prog:()=>Math.min(3,mBuilt('torreagua'))+(mCnt(t=>t.k==='clinica'&&lvOf(t)>=3)?1:0),rew:{b:[5,40000]}},
  {id:'pulmon',tipo:'barrio',min:3000,big:1,name:'Pulmón del Distrito',txt:'Ten 25 parques, plazas o campos de golf funcionando (los dog parks no cuentan) y 3 calles con 5 o más de ellos cada una.',goal:28,prog:()=>Math.min(25,greenCnt())+Math.min(3,greenStreets()),ptx:()=>`áreas verdes ${Math.min(25,greenCnt())} de 25 · calles verdes ${Math.min(3,greenStreets())} de 3`,rew:{u:'bosque'}},
  {id:'museos',tipo:'barrio',min:3200,big:1,name:'Noche de museos',txt:'Ten 2 Cines en nivel 3 o más.',goal:2,prog:()=>mCnt(t=>t.k==='cine'&&lvOf(t)>=3),ok:()=>S.unl.includes('cine'),rew:{u:'museo'}},
  {id:'horapico',tipo:'vecinos',min:3400,big:1,name:'Hora pico',txt:'Que vivan 400 profesionistas y estén al 70% de satisfacción durante 2 minutos seguidos.',hold:120,cond:()=>S.pop.pro>=400&&stats.gs.pro>=.7,hint:()=>`profesionistas ${Math.floor(S.pop.pro).toLocaleString('es-MX')} de 400 · satisfacción ${Math.round(stats.gs.pro*100)}%`,rew:{u:'rasca'}},
  {id:'pelota',tipo:'reto',min:3700,big:1,name:'Tarde de pelota',txt:'Los tres grupos arriba de 65% y el estacionamiento arriba de 70% durante 8 minutos seguidos. Tienes 15 minutos.',hold:480,lim:900,cool:900,cond:()=>lowG()>=.65&&stats.sc.park>=.7,hint:()=>`grupo más bajo ${Math.round(lowG()*100)}% · estacionamiento ${Math.round(stats.sc.park*100)}%`,rew:{u:'beis'}},
  {id:'comercial',tipo:'barrio',min:4100,big:1,name:'Calle comercial',txt:'Pon 8 negocios de tipos distintos sobre una misma calle, y que 3 de esos tipos tengan uno en nivel 4.',goal:11,prog:()=>bizStreet().sc,ptx:()=>{const b=bizStreet();return `tu mejor calle: ${Math.min(8,b.d)} de 8 tipos · ${Math.min(3,b.l4)} de 3 en nivel 4`},rew:{u:'plazacom'}},
  {id:'salida',tipo:'vecinos',min:4600,big:1,name:'Hora de salida',txt:'Ten 4,500 vecinos con el estacionamiento arriba de 80% y sin números rojos durante 10 minutos seguidos.',hold:600,cond:()=>S.v>=4500&&stats.sc.park>=.8&&S.$>=0,hint:()=>`vecinos ${Math.floor(S.v).toLocaleString('es-MX')} de 4,500 · estacionamiento ${Math.round(stats.sc.park*100)}%${S.$<0?' · en números rojos':''}`,rew:{u:'metro'}}
];
// todas las calles rectas con lo que tienen a los lados (cada tramo da el conjunto de cosas que lo tocan)
function streetRuns(pred){const out=[];
  const scan=(cell)=>{for(let a=0;a<N;a++){let run=[];for(let b=0;b<=N;b++){const [x,y]=cell(a,b),i=b<N?idx(x,y):-1,t=i>=0?S.g[i]:null;
    if(t&&t.k==='calle'&&!t.hw){run.push(i);continue}
    if(run.length>=2){const near=new Set();for(const j of run){const jx=j%N,jy=Math.floor(j/N);for(const [dx,dy] of NB){if(!inb(jx+dx,jy+dy))continue;const an=anchorOf(idx(jx+dx,jy+dy)),at=S.g[an];if(at&&DEFS[at.k]&&!(at.b>0)&&at.ok&&pred(at))near.add(an)}}if(near.size)out.push(near)}run=[]}}};
  scan((a,b)=>[b,a]);scan((a,b)=>[a,b]);return out}
const GREENK=['parque','plaza','golf'];
const greenCnt=()=>mCnt(t=>GREENK.includes(t.k)&&t.ok);
const greenStreets=()=>streetRuns(t=>GREENK.includes(t.k)).filter(s=>s.size>=5).length;
// la mejor calle comercial: cuántos tipos de negocio distintos y cuántos de esos tipos tienen uno en nivel 4
function bizStreet(){let best={d:0,l4:0,sc:0};for(const s of streetRuns(t=>isBiz(t.k))){const lv={};for(const a of s){const t=S.g[a];lv[t.k]=Math.max(lv[t.k]||0,lvOf(t))}
  const ks=Object.keys(lv),d=ks.length,l4=ks.filter(k=>lv[k]>=4).length,sc=Math.min(8,d)+Math.min(3,l4);if(sc>best.sc)best={d,l4,sc}}return best}
const lowG=()=>Math.min(...G3.map(g=>stats.gs[g]||0));

const MISI=Object.fromEntries(MIS.map(m=>[m.id,m]));
const MIS_ON=150,MIS_SWAP=300,MIS_COOL=300,MIS_COOLEV=900;
const misOf=k=>MIS.find(m=>m.rew.u===k);
function misInit(){if(!S.mis)S.mis={on:{barrio:null,vecinos:null,reto:null},st:{},done:[],ready:[],cool:{},skip:[],swapT:0,fx:{},pv:[]};const M=S.mis;
  for(const k of ['st','cool','fx'])M[k]=M[k]||{};for(const k of ['done','ready','skip','pv'])M[k]=M[k]||[];M.on=M.on||{barrio:null,vecinos:null,reto:null};
  // edificios que ya se abrieron (partidas viejas o recargas)
  for(const id of M.done){const m=MISI[id];if(m&&m.rew.u&&!S.unl.includes(m.rew.u))S.unl.push(m.rew.u)}}
function misBono(m){const [mins,fl]=m.rew.b;return Math.round(Math.max(fl,Math.min(fl*3,mins*60*Math.max(0,stats.income||0)))/100)*100}
function misRewTxt(m){const r=m.rew;if(r.u)return `Abre: ${DEFS[r.u].name}`;if(r.f)return `Bono de $${fmt(r.f)}`;if(r.b)return `Bono de $${fmt(misBono(m))}`;
  return r.x==='sat'?'Satisfacción +5% por 3 minutos':r.x==='pv'?'+4 de plusvalía en esa calle, para siempre':r.x==='clas'?'El próximo Clásico deja 50% más':''}
function misPick(tp){const M=S.mis,pt=M.clk||0;const c=MIS.filter(m=>m.tipo===tp&&!M.done.includes(m.id)&&!M.ready.includes(m.id)&&S.maxV>=m.min&&!((M.cool[m.id]||0)>pt)&&(!m.ok||m.ok()));
  c.sort((a,b)=>(M.skip.includes(a.id)?1:0)-(M.skip.includes(b.id)?1:0)||(b.big?1:0)-(a.big?1:0)||a.min-b.min);return c[0]||null}
function misStart(m,quiet){const M=S.mis;M.on[m.tipo]=m.id;M.st[m.id]={h:0,r:0,go:0,lo:1,t0:M.clk||0};
  if(m.ev&&!(S.ev&&S.ev.id===m.ev))S.evForce=m.ev;
  if(!quiet&&S.maxV>=MIS_ON)$('misb')&&$('misb').classList.add('new')}
// avance de un encargo: [actual, meta, texto]
function misProg(m){const st=S.mis.st[m.id]||{};
  if(m.ev){if(st.go)return [1,2,`¡Ya llegó! La satisfacción más baja: ${Math.round((st.lo??1)*100)}%`];return [0,2,'Esperando a que llegue…']}
  if(m.hold){const lim=m.lim?` · quedan ${Math.max(0,Math.ceil((m.lim-(st.r||0))/60))} min`:'';return [Math.min(m.hold,st.h||0),m.hold,`${fmtT(st.h||0)} de ${fmtT(m.hold)}${lim}${m.hint?' · '+m.hint():''}`]}
  const p=Math.min(m.goal,m.prog());let tx=m.ptx?m.ptx():`${fmt(p)} de ${fmt(m.goal)}`;if(m.cond&&p>=m.goal&&!m.cond())tx+=' · falta la satisfacción';if(m.failIf)tx+=` · antes de 950 (van ${fmt(Math.floor(S.v))})`;return [p,m.goal,tx]}
const fmtT=s=>{s=Math.floor(s);return s>=60?`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')} min`:`${s} s`};
function misDone(m,quiet){const M=S.mis;M.ready.push(m.id);delete M.st[m.id];if(S.evForce===m.ev)S.evForce=null;
  if(!quiet){sfx('levelup');say(`¡Encargo cumplido: «${m.name}»! Abre Encargos para cobrar tu premio (${misRewTxt(m).toLowerCase()}).`,true);const b=$('misb');if(b)b.classList.add('new')}}
function misFail(m,why,quiet){const M=S.mis;M.on[m.tipo]=null;delete M.st[m.id];M.cool[m.id]=m.once?1e12:(M.clk||0)+(m.ev?MIS_COOLEV:m.cool||MIS_COOL);if(S.evForce===m.ev)S.evForce=null;
  if(!quiet)say(`${why} El reto «${m.name}» se va sin castigo${m.once?'.':' y vuelve más tarde.'}`)}
function misClaim(id){const M=S.mis,m=MISI[id];if(!m||!M.ready.includes(id))return;M.ready=M.ready.filter(q=>q!==id);M.done.push(id);if(M.on[m.tipo]===id)M.on[m.tipo]=null;
  const r=m.rew;let tx='';
  if(r.u){if(!S.unl.includes(r.u))S.unl.push(r.u);markNew(r.u);celebrate(3);sfx('phase');tx=`¡Nuevo! Ya puedes construir: ${DEFS[r.u].name} (pestaña ${TABS.find(q=>q[2].includes(r.u))[1]}). ${infoOf(r.u)}`}
  else if(r.f||r.b){const a=r.f||misBono(m);S.$+=a;sfx('buy');tx=`Cobraste $${fmt(a)} por «${m.name}».`}
  else if(r.x==='sat'){M.fx.sat={a:.05,t:180};sfx('phase');tx='Los vecinos andan contentos: +5% de satisfacción durante 3 minutos.'}
  else if(r.x==='clas'){M.fx.clas=1;sfx('phase');tx='Listo: el próximo Clásico regio dejará 50% más en los negocios.'}
  else if(r.x==='pv'){const b=streetBest(['parque','plaza','dogpark']),set=new Set(b.run);for(const j of b.run){const x=j%N,y=Math.floor(j/N);for(const [dx,dy] of NB)if(inb(x+dx,y+dy))set.add(idx(x+dx,y+dy))}
    M.pv=[...new Set([...M.pv,...set])];recompute();sfx('phase');tx='Esa calle ya es la más bonita del Distrito: +4 de plusvalía a todo lo que tiene a los lados.'}
  say(tx,true);save();refreshUI(true)}
function misSwap(tp){const M=S.mis,cur=M.on[tp];if(!cur||M.ready.includes(cur))return;if(M.swapT>0){say(`Podrás cambiar otro encargo en ${fmtT(M.swapT)} de juego.`,true);return}
  M.skip=M.skip.filter(q=>q!==cur);M.skip.push(cur);const nx=misPick(tp);
  if(!nx||nx.id===cur){say('Por ahora no hay otro encargo de ese tipo. Sigue creciendo y saldrán más.',true);return}
  const m0=MISI[cur];if(S.evForce===m0.ev)S.evForce=null;delete M.st[cur];misStart(nx,true);M.swapT=MIS_SWAP;sfx('build');say(`Nuevo encargo: «${nx.name}». ${nx.txt}`,true);save()}
let misAcc=0;
function misStep(dt,quiet){if(!S.mis)misInit();const M=S.mis;M.clk=(M.clk||0)+dt;
  if(M.swapT>0)M.swapT=Math.max(0,M.swapT-dt);if(M.fx.sat){M.fx.sat.t-=dt;if(M.fx.sat.t<=0)delete M.fx.sat}
  if(S.maxV<MIS_ON)return;
  if(!M.intro){M.intro=1;if(!quiet){sfx('unlock');say('¡Nuevo: Encargos del Distrito! Arriba, junto a Crédito, hay 3 encargos: cúmplelos para ganar bonos y abrir edificios nuevos.',true);const b=$('misb');if(b)b.classList.add('new')}}
  misAcc+=dt;if(misAcc<.5)return;const step=misAcc;misAcc=0;
  for(const tp of ['barrio','vecinos','reto']){let id=M.on[tp];
    if(!id||(!M.ready.includes(id)&&M.done.includes(id))){const m=misPick(tp);M.on[tp]=null;if(m)misStart(m,quiet);id=M.on[tp];if(!id)continue}
    if(M.ready.includes(id))continue;const m=MISI[id];if(!m){M.on[tp]=null;continue}const st=M.st[id]=M.st[id]||{h:0,r:0,go:0,lo:1,t0:M.clk};
    if(m.ev){const on=S.ev&&S.ev.id===m.ev;
      if(on){if(!st.go){st.go=1;st.lo=1;if(S.evForce===m.ev)S.evForce=null}st.lo=Math.min(st.lo,stats.sat);
        if((m.floor&&stats.sat<m.floor)||(m.cond&&!m.cond())){misFail(m,m.floor?`La satisfacción bajó de ${Math.round(m.floor*100)}%.`:'Se llenó el estacionamiento.',quiet);continue}}
      else if(st.go){misDone(m,quiet);continue}
      else if(!S.ev&&S.evForce!==m.ev)S.evForce=m.ev;
      continue}
    if(m.hold){st.r+=step;st.h=m.cond()?st.h+step:0;if(st.h>=m.hold){misDone(m,quiet);continue}if(m.lim&&st.r>=m.lim)misFail(m,'Se acabó el tiempo.',quiet);continue}
    if(m.prog()>=m.goal&&(!m.cond||m.cond())){misDone(m,quiet);continue}
    if(m.failIf&&m.failIf())misFail(m,'Ya pasaron de 950 vecinos sin Torre de agua.',quiet)}}
function renderMis(){const box=$('misbox');if(!box||box.hidden)return;const M=S.mis;
  let h='<h2>ENCARGOS DEL DISTRITO<button class="x" id="mx" aria-label="Cerrar">✕</button></h2>';
  if(S.maxV<MIS_ON){h+=`<div class="mi-in">Los encargos empiezan a los ${MIS_ON} vecinos.</div>`}
  else{h+='<div class="mi-in">Cúmplelos para ganar bonos o abrir edificios nuevos. Ninguno castiga si no se cumple.</div>';
    for(const tp of ['barrio','vecinos','reto']){const id=M.on[tp],m=id&&MISI[id];
      if(!m){h+=`<div class="mi"><span class="tp">${MTIPO[tp]}</span><b>Sin encargo por ahora</b><small>Sigue creciendo: salen más con más vecinos.</small></div>`;continue}
      const rd=M.ready.includes(id),[a,b,tx]=rd?[1,1,'¡Cumplido!']:misProg(m);
      h+=`<div class="mi${rd?' rd':''}"><span class="tp">${MTIPO[tp]}</span><b>${m.name}</b><small>${m.txt}</small><div class="meter"><b style="width:${Math.round(Math.min(1,a/b)*100)}%"></b></div><small class="pg">${tx}</small><span class="rw">Premio: ${misRewTxt(m)}</span>`
        +(rd?`<button data-c="${id}" class="go">Cobrar</button>`:`<button data-s="${tp}" ${M.swapT>0?'disabled':''}>${M.swapT>0?'Cambiar en '+fmtT(M.swapT):'Cambiar'}</button>`)+'</div>'}
    h+=`<small class="mi-ft">Cumplidos: ${M.done.length} de ${MIS.length} · puedes cambiar un encargo cada 5 minutos de juego.</small>`}
  box.innerHTML=h;$('mx').onclick=()=>{box.hidden=true};
  box.querySelectorAll('[data-c]').forEach(b=>b.onclick=()=>{misClaim(b.dataset.c);const mb=$('misb');if(mb&&!S.mis.ready.length)mb.classList.remove('new');renderMis()});
  box.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{misSwap(b.dataset.s);renderMis()})}

