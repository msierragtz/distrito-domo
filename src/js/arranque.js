
/* ---------- arranque ---------- */
function prep(d){
  S=d;S.dist=DIST;ribFix();parFix();fixPop();if(!S.pv2){S.pv2=1;if(S.seen)S.pvMsg=1}if(S.unl&&!S.unl.includes('ver'))S.unl.unshift('ver');
  // hitos retirados: se devuelven como terreno y se reembolsa la mitad
  {let ref=0;const old={tim:15000,mercado:60000,grandomo:200000};const live=i=>{const a=S.g[i];return a&&MULTI(a.k)&&!old[a.k]};for(let i=0;i<S.g.length;i++){const t=S.g[i];if(t.k==='reserva'||(t.k==='part'&&!live(t.a))||old[t.k]){if(old[t.k])ref+=old[t.k]/2;S.g[i]={k:'lote',s:t.s||1,b:0}}}if(ref)S.$+=ref}
  if(!S.g.some(t=>t.k==='lotedomo'||t.k==='domo')){let i=idx(OFF+8,OFF+8);if(!(S.g[i].k==='lote'||S.g[i].k==='arbol'))i=S.g.findIndex((t,j)=>(t.k==='lote'||t.k==='arbol')&&connected(j%N,Math.floor(j/N)));if(i>=0)S.g[i]={k:'lotedomo',s:1,b:0}}
  misInit();recompute();
  if(S.migG){const mx=stats.mix,t=mx.fam+mx.pro+mx.est;if(t>0){const v=S.v;for(const g of G3)S.pop[g]=v*mx[g]/t;fixPop()}delete S.migG;recompute()}
}
function start(data){
  distBoot();const viajando=viajeBoot();
  // la copia más reciente gana: la que dejó una recarga en caliente puede ser vieja (de antes de un viaje entre distritos)
  {const loc=load(),hot=data&&data.g&&data.g.length===N*N&&(data.dist||'domo')===DIST?data:null;prep(hot&&(!loc||(hot.t||0)>(loc.t||0))?hot:(loc||newGame()))}pruneDamaged();distUI();
  buildTools();resize();
  refreshUI(true);
  // pantalla de inicio: el botón es el gesto que todos los navegadores aceptan para arrancar el audio
  let hasSave=!!S.seen;let pname='';try{pname=localStorage.getItem('distritoDomo.nombre')||''}catch(e){}
  $('pname').value=S.name||pname;$('tmusic').checked=JAZZ.pref.on;
  const showTitle=()=>{$('tcont').textContent=hasSave?'Continuar partida':'Jugar';$('tnew').hidden=!hasSave};showTitle();
  const vec=d=>`${Math.round(d.maxV||d.v||0).toLocaleString('es-MX')} vecinos`;
  const status=(txt,cls)=>{const el=$('tsave');el.textContent=txt;el.className='tsave'+(cls?' '+cls:'')};
  // cambia la partida en pantalla por otra (de la nube o de una copia); la de antes se aparta, no se pierde
  const adopt=d=>{stashPrev();
    prep(d);walkers=[];EXTRA=[];FUT=null;vozClose();GKEY='';GC=null;SPR.clear();LASTSPR.clear();buildTools();refreshUI(true);
    hasSave=!!S.seen;$('pname').value=S.name||$('pname').value;showTitle();
    lsPut(KEY,JSON.stringify(serialize()),true)};
  // buscar la partida guardada en la cuenta antes de dejar jugar, para no empezar encima de ella
  const framed=!!(window.claude&&window.claude.use);
  if(framed){$('tcont').disabled=true;$('tnew').disabled=true;status('Buscando tu partida en tu cuenta…')}
  const unlockTitle=()=>{$('tcont').disabled=false;$('tnew').disabled=false};
  (async()=>{let res=null;await 0;
    if(framed)try{res=await Promise.race([(async()=>{const [db,user]=await Promise.all([claude.use('db'),claude.use('user')]);if(!db||!user)return null;
        const id=await user.id();if(!id)return null;const sf=DIST==='ribera'?'-ribera':'',ref=db.doc('data/users/'+id+'/partida'+sf),pref=db.doc('data/users/'+id+'/anterior'+sf);const [snap,ps]=await Promise.all([ref.get(),pref.get().catch(()=>null)]);return {ref,pref,d:snap.exists?snap.data():null,p:ps&&ps.exists?ps.data():null}})(),
      new Promise(r=>setTimeout(()=>r(null),12000))])}catch(e){res=null}
    if(!res){unlockTitle();arrive();showPrev();status(framed?'No pude conectar con tu cuenta: tu partida se guarda solo en este navegador. Descarga una copia de vez en cuando.':'Tu partida se guarda en este navegador. Descarga una copia de vez en cuando.',framed?'warn':'');return}
    CLOUD.ref=res.ref;CLOUD.prevRef=res.pref;if(res.p&&typeof res.p.s==='string'){const pc=parseSave(res.p.s);if(pc&&(!prevD||(pc.t||0)>(prevD.t||0)))prevD=pc}let msg='Tu partida se guarda en tu cuenta de Claude.';
    const c=res.d&&typeof res.d.s==='string'?parseSave(res.d.s):null;
    if(c&&TITLE&&(!hasSave||(c.t||0)>(S.t||0))){adopt(c);msg=`Recuperé tu partida de tu cuenta (${vec(c)}).`}
    CLOUD.ready=true;unlockTitle();status(msg,'ok');showPrev();arrive();
    if(hasSave&&TITLE&&(!c||(S.t||0)>(c.t||0)))CLOUD.push(JSON.stringify(S),true)})();
  // copia de seguridad en un archivo, para pasarla a otro navegador o guardarla aparte
  $('texp').onclick=async()=>{const str=JSON.stringify(serialize()),d=new Date(),fn=`distrito-domo-${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}.json`;
    let dl=null;try{dl=framed?await claude.use('downloads'):null}catch(e){}
    if(dl){try{await dl.save({filename:fn,data:str});status('Copia descargada.','ok');return}catch(e){if(e&&e.code==='declined')return}}
    try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([str],{type:'application/json'}));a.download=fn;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000);status('Copia descargada.','ok')}
    catch(e){status('No pude descargar la copia en este navegador.','warn')}};
  let prevD=null,prevT=0;try{prevD=parseSave(localStorage.getItem(KEY+'.anterior'))}catch(e){}
  const showPrev=()=>{const b=$('tprev');b.hidden=!prevD;if(prevD)b.textContent=`Recuperar anterior (${vec(prevD)})`};if(!framed)showPrev();
  $('tprev').onclick=()=>{if(!prevD)return;const dt=Date.now()-prevT;
    if(dt>600&&dt<8000){const d=prevD,wasDemo=!!S.demo;let was=null;try{was=localStorage.getItem(KEY+'.anterior')}catch(e){}adopt(d);try{const now=localStorage.getItem(KEY+'.anterior');prevD=now&&now!==was?parseSave(now):null}catch(e){prevD=null}prevT=0;showPrev();status(`Listo: recuperé tu partida anterior (${vec(S)}).${wasDemo?'':' La que tenías quedó como anterior, por si acaso.'}`,'ok');CLOUD.push(JSON.stringify(S),true);return}
    if(dt<=600)return;prevT=Date.now();status(`¿Cambiar tu partida actual (${vec(S)}) por la anterior (${vec(prevD)})? Toca otra vez para confirmar.`,'warn')};
  let impD=null,impT=0;
  $('timp').onclick=()=>{if(impD&&Date.now()-impT<8000){adopt(impD);impD=null;$('timp').textContent='Cargar copia';status(`Listo: cargué la copia (${vec(S)}).`,'ok');CLOUD.push(JSON.stringify(S),true);return}$('tfile').value='';$('tfile').click()};
  $('tfile').onchange=async()=>{const f=$('tfile').files&&$('tfile').files[0];if(!f)return;let d=null;try{d=parseSave(await f.text())}catch(e){}
    if(!d){status('Ese archivo no es una copia de Distrito Domo.','warn');return}
    if((d.dist||'domo')!==DIST){status(`Esa copia es del ${(d.dist||'domo')==='ribera'?'Distrito Ribera':'Distrito Domo'}: cámbiate a ese distrito y cárgala ahí.`,'warn');return}
    const dmsg=d.demo?' Es una partida de demostración: al terminar, toca «Recuperar anterior» para volver a la tuya.':'';
    if(!hasSave){adopt(d);status(`Listo: cargué la copia (${vec(S)}).${dmsg}`,'ok');CLOUD.push(JSON.stringify(S),true);return}
    if(d.demo){adopt(d);status(`Listo: cargué la demo (${vec(S)}).${dmsg}`,'ok');CLOUD.push(JSON.stringify(S),true);try{prevD=parseSave(localStorage.getItem(KEY+'.anterior'))}catch(e){}showPrev();return}
    impD=d;impT=Date.now();$('timp').textContent='Sí, reemplazar';status(`La copia tiene ${vec(d)} y tu partida actual ${vec(S)}. Toca "Sí, reemplazar" para cargarla.`,'warn');
    setTimeout(()=>{if(Date.now()-impT>=8000){impD=null;$('timp').textContent='Cargar copia'}},8100)};
  let newArm=0;
  // llegada de un viaje entre distritos: se entra directo (la pantalla de viaje tapa la de inicio) y se presenta el distrito
  const arrive=()=>{if(!viajando||!TITLE)return;const nuevo=!hasSave;play(nuevo);llegada(nuevo)};
  const play=fresh=>{
    const nm=$('pname').value.trim().slice(0,20);
    if($('tmusic').checked){JAZZ.pref.on=false;JAZZ.toggle()}else{JAZZ.pref.on=false;JAZZ.setVol(JAZZ.pref.vol)}
    const veterano=!!((S&&(S.maxV||0)>=300)||riberaUnl());
    if(fresh){stashPrev();S=newGame();walkers=[];EXTRA=[];FUT=null;vozClose();recompute();GKEY='';SPR.clear();LASTSPR.clear()}
    S.name=nm;try{localStorage.setItem('distritoDomo.nombre',nm)}catch(e){}
    TITLE=false;$('title').hidden=true;panX=0;panY=0;showMus();
    const who=nm?`, ${nm}`:'';
    const guia=guiaToca(fresh||!S.seen,veterano);
    if(DIST==='ribera'&&(!S.seen||fresh))ribIntro(who);else say(!S.seen||fresh?(guia?`¡Bienvenido${who}! Te enseño lo básico en 3 pasos: sigue la guía de arriba.`:`¡Bienvenido${who}! Traza calles y levanta edificios: los vecinos llegan solos si tienen todo cerca.`):`¡Qué bueno verte de vuelta${who}! El Distrito te esperó en pausa, tal como lo dejaste.`,true);
    if(guia||(S.tuto>0&&S.tuto<9))guiaStart(guia?1:S.tuto);
    {const se=SEASON();if(se)setTimeout(()=>say(se==='patrias'?'¡Viva México! Es mes patrio y el Distrito se viste de verde, blanco y rojo. La noche del 15 hay Grito frente a El Domo.':se==='navidad'?'¡Feliz Navidad! Pinos en las plazas, piñatas en los parques y foquitos en todo el Distrito.':'Día de Muertos: papel picado, cempasúchil, ofrendas en las plazas y veladoras de noche.'),5000)}
    if(S.fromBak){delete S.fromBak;cur+=' Ojo: tu guardada venía dañada y recuperé el respaldo de hace un minuto.'}
    S.seen=1;save();refreshUI(true);
  };
  $('tcont').onclick=()=>play(!hasSave);
  $('tnew').onclick=()=>{const dt=Date.now()-newArm;if(dt>600&&dt<4000){play(true);return}if(dt<=600)return;newArm=Date.now();$('tnew').textContent='¿Seguro? Se borra tu Distrito';setTimeout(()=>{$('tnew').textContent='Nueva partida'},4000)};
  $('pname').addEventListener('keydown',e=>{if(e.key==='Enter')$('tcont').click()});
  // opciones de imagen
  const applyOpt=()=>{document.body.classList.toggle('rm',lowMo());document.body.classList.toggle('hc',OPT.hc);$('oLow').checked=OPT.low;$('oRm').checked=OPT.rm;$('oHc').checked=OPT.hc;$('oSe').value=OPT.season||'auto'};applyOpt();
  const optSet=(k,v)=>{OPT[k]=v;try{localStorage.setItem('distritoDomo.opciones',JSON.stringify(OPT))}catch(e){}
    if(k==='hc'){SPR.clear();LASTSPR.clear();CARC.clear();RIDGE.length=0;GKEY='';GC=null}applyOpt()};
  $('oLow').onchange=e=>optSet('low',e.target.checked);$('oRm').onchange=e=>optSet('rm',e.target.checked);$('oHc').onchange=e=>optSet('hc',e.target.checked);$('oSe').onchange=e=>{optSet('season',e.target.value);const se=SEASON();say(se==='patrias'?'¡Viva México! El Distrito se viste de verde, blanco y rojo.':se==='muertos'?'Día de Muertos: papel picado y cempasúchil por todo el Distrito.':'Sin decoración de temporada.',true)};
  const optShow=v=>{$('opts').hidden=!v;$('optb').setAttribute('aria-expanded',v);if(v){let L=[];try{L=JSON.parse(localStorage.getItem(KEY+'.errores')||'[]')}catch(e){}
    $('oErr').textContent=CLOUD.txt()+' '+(L.length?`Errores registrados en este navegador: ${L.length}. Último: ${L[L.length-1][1]} (línea ${L[L.length-1][2]}, ${new Date(L[L.length-1][0]).toLocaleString('es-MX')}).`:'Sin errores registrados en este navegador.')}};
  $('optb').onclick=e=>{e.stopPropagation();optShow($('opts').hidden)};$('oOk').onclick=()=>optShow(false);
  const renderGuide=()=>{const g=$('guide');const row=k=>{const d=DEFS[k];if(!d||d.hidden)return '';const lk=!S.unl.includes(k);
      return `<div class="it${lk?' lk':''}"><b>${d.name}</b><span class="pr">${lk?(d.unlock===Infinity?'con un encargo':'a los '+d.unlock.toLocaleString('es-MX')+' vecinos'):k==='mejorar'||k==='demoler'||k==='ver'?'':d.cost?'$'+fmt(costOf(k)):'gratis'}</span><p>${infoOf(k)}</p></div>`};
    g.innerHTML=`<h2>Guía del Distrito<button class="x" type="button" aria-label="Cerrar">✕</button></h2>
      <p class="intro">Los vecinos pagan renta (profesionistas $0.10/s, familias $0.065, estudiantes $0.045), más si están contentos y si su zona tiene plusvalía. Llegan más si tienen cerca verde, comercio que les guste, estacionamiento y dog park.</p>`
      +[['Herramientas',FIXED],...TABS.map(t=>[t[1],t[2]])].map(([n,ks])=>`<h3>${n}</h3>`+ks.map(row).join('')).join('')
      +`<h3>Encargos</h3><p class="intro">Desde los 150 vecinos, el botón Encargos (arriba) tiene 3 encargos a la vez: uno de Barrio, uno de Vecinos y un Reto con tiempo. Al cumplirlos ganas bonos o abres edificios nuevos (barbería, salón de uñas, boliche, campo de golf, cine, paletería y gimnasio). Desde los 3,000 vecinos salen 6 encargos más difíciles que abren las obras grandes (pestaña Especiales): Bosque urbano, Museo del Domo, Rascacielos, Estadio de Béisbol, Plaza comercial y Estación del Metro. Ninguno castiga: si un reto se acaba, vuelve más tarde. Puedes cambiar un encargo cada 5 minutos.</p><h3>Teclado</h3><p class="intro">Esc: la manita (¿Qué es?) · F: modo foto (fotos, video, paseo y time-lapse de cómo creció tu Distrito) · Espacio: pausa · 1–4: pestañas · Q/E: girar · C o doble clic en el cielo: centrar · M: música · N: efectos · V: plusvalía. Para presentar el juego: Shift+D (oculta Reiniciar), Shift+L tormenta, Shift+N atardecer, Shift+H adelanta la hora, Shift+F mide el rendimiento.</p>`;
    g.querySelector('.x').onclick=()=>{g.hidden=true;$('guideb').setAttribute('aria-expanded',false)}};
  $('guideb').onclick=e=>{e.stopPropagation();const g=$('guide');g.hidden=!g.hidden;$('guideb').setAttribute('aria-expanded',!g.hidden);if(!g.hidden)renderGuide()};
  $('pauseb').onclick=e=>{e.stopPropagation();setPause(!PAUSED)};
  $('heat').onclick=e=>{e.stopPropagation();HEAT=!HEAT;$('heat').setAttribute('aria-pressed',HEAT);say(HEAT?'Mapa de plusvalía: azul vale más, naranja vale menos. Toca un terreno para ver por qué. Vuelve a tocar $ para salir.':'Saliste del mapa de plusvalía.',true)};
  $('bank').onclick=()=>{const b=$('loanbox');b.hidden=!b.hidden;$('moneybox').hidden=true;$('misbox').hidden=true;renderLoan()};
  $('misb').onclick=e=>{e.stopPropagation();const b=$('misbox');b.hidden=!b.hidden;$('loanbox').hidden=true;$('moneybox').hidden=true;if(!b.hidden&&!(S.mis&&S.mis.ready.length))$('misb').classList.remove('new');renderMis()};
  $('incBtn').onclick=e=>{e.stopPropagation();const b=$('moneybox');b.hidden=!b.hidden;$('loanbox').hidden=true;$('misbox').hidden=true;renderMoney()};
  let loanT=0;
  const mb=$('mus'),showMus=()=>mb.setAttribute('aria-pressed',JAZZ.pref.on);showMus();
  const fb=$('fxb'),showFx=()=>fb.setAttribute('aria-pressed',JAZZ.fx.on);showFx();
  fb.onclick=e=>{e.stopPropagation();JAZZ.toggleFx();showFx();say(JAZZ.fx.on?'Efectos de sonido encendidos.':'Efectos de sonido apagados. Vuelve a tocar FX o presiona N.',true)};
  mb.onclick=e=>{e.stopPropagation();JAZZ.toggle();showMus();say(JAZZ.pref.on?'Música encendida.':'Música apagada. Vuelve a tocar ♪ para encenderla.',true)};
  const wake=()=>JAZZ.unlock();for(const ev of ['pointerdown','pointerup','click','touchend','keydown'])addEventListener(ev,wake,{capture:true,passive:true});
  if(!JAZZ.pref.on)setTimeout(()=>say('La música está apagada. Tócale al botón ♪ de la derecha o presiona M para encenderla.'),3500);
  addEventListener('keydown',e=>{if(TITLE||e.target&&e.target.tagName==='INPUT')return;if(e.key==='m'||e.key==='M'){JAZZ.toggle();showMus();say(JAZZ.pref.on?'Música encendida.':'Música apagada (tecla M).',true)}if((e.key==='n'||e.key==='N')&&!e.shiftKey){JAZZ.toggleFx();showFx();say(JAZZ.fx.on?'Efectos encendidos.':'Efectos apagados (tecla N).',true)}});
  let musT=0;
  // ahorro automático (v75): se enciende abajo de ~40 cuadros por segundo, dura al menos 15 s y se apaga solo si el aparato ya va casi a 60
  let last=performance.now(),saveT=0,slowA=1/60,slowT=0,AUTOT=0;
  function loop(now){
    const rdt=(now-last)/1000,dt=(PAUSED&&!TITLE?0:Math.max(0,Math.min(1,rdt)))*TS;last=now;T+=dt;camStep(Math.min(.1,Math.max(0,rdt)));fotoStep(Math.min(.1,Math.max(0,rdt)));followStep(Math.min(.1,Math.max(0,rdt)));
    if(rdt<1&&!document.hidden){FTA=FTA*.96+rdt*.04;if(!AUTOLOW&&FTA>1/40){AUTOLOW=true;AUTOT=now}else if(AUTOLOW&&FTA<1/58&&now-AUTOT>15000)AUTOLOW=false}
    if(!TITLE&&!OPT.low&&!S.slowTip&&rdt<1&&!document.hidden){slowA=slowA*.97+rdt*.03;slowT+=dt;if(slowT>12&&slowA>1/26){S.slowTip=1;say(AUTOLOW?'Este aparato va lento: activé el modo ahorro (menos gente en la calle y sin fundidos). Si quieres dejarlo fijo, activa «Calidad baja» en el botón ⚙.':'¿El juego va lento en este aparato? En el botón ⚙ puedes activar «Calidad baja».',false,{p:1})}}
    if(TITLE){panX=Math.sin(T*.08)*140;panY=Math.cos(T*.06)*50}else if(!PAUSED&&!REAL){tick(dt);histStep(dt);distStep()}if(!TL)updWalkers(dt);msgStep(dt);guiaStep(Math.min(.25,Math.max(0,rdt)));refreshUI();{const r0=performance.now();render();perfStep(performance.now()-r0,rdt)}recFrame();
    loanT+=dt;if(loanT>1){loanT=0;renderLoan();renderMoney();renderMis()}
    musT+=dt;if(musT>.5){musT=0;JAZZ.update({night:NIGHT,sat:stats.sat,ev:S.ev?S.ev.id:null,red:S.$<0,phase:S.phase||1,kiosk:!!S.g.find(t=>t.k==='kiosco'&&!(t.b>0)),vec:S.maxV||0})}
    saveT+=dt;if(saveT>5&&!TITLE){saveT=0;save()}
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
  addEventListener('visibilitychange',()=>{if(document.hidden&&!TITLE)save(true)});addEventListener('pagehide',()=>{if(!TITLE)save(true)});
}
window.claude?.hot?.snapshot?.(()=>serialize());
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
})();
