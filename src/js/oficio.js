/* ---------- v85: el nombramiento del Municipio ----------
   Al empezar una partida nueva en el Distrito Cañón, el Municipio de Santa Catarina te entrega un oficio: te encomienda el
   desarrollo del Distrito y la felicidad de sus vecinos. Lo firmas con tu nombre, cae el sello y empieza el juego. */
const MESES=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function oficioToca(fresh){return (fresh||!S.seen)&&!S.demo&&DIST==='domo'}
function oficio(nm,done){const o=$('oficio');if(!o){done(nm);return}
  const f=new Date(),fecha=`${f.getDate()} de ${MESES[f.getMonth()]} de ${f.getFullYear()}`;
  $('ofFecha').textContent=`Santa Catarina, N.L., a ${fecha}`;
  $('ofNum').textContent=`Oficio DU/${String(100+Math.floor(Math.random()*800)).padStart(4,'0')}/${f.getFullYear()}`;
  $('ofIntro').textContent='Por acuerdo del Cabildo, se le encomienda el desarrollo del Distrito Cañón, al pie de La Huasteca. Ya hay un edificio y 16 vecinos. Desde hoy, usted decide qué se construye y dónde. Su encargo:';
  const inp=$('ofName'),ok=$('ofOk');inp.value=nm||'';o.classList.remove('firmado','sale');o.hidden=false;
  const btn=()=>{ok.textContent=inp.value.trim()?'Firmar y aceptar el cargo':'Aceptar el cargo'};btn();inp.oninput=btn;
  // en celular no se abre el teclado solo: tapaba el oficio
  setTimeout(()=>{try{(matchMedia('(pointer:coarse)').matches?ok:inp).focus({preventScroll:true})}catch(e){}},60);
  let listo=false;
  const firmar=()=>{if(listo)return;listo=true;const n=inp.value.trim().slice(0,20);
    $('ofFirma').textContent=n||'Desarrollo del Distrito';$('ofSelloF').textContent=`${f.getDate()} ${MESES[f.getMonth()].slice(0,3)} ${f.getFullYear()}`;
    o.classList.add('firmado');try{sfx('sello')}catch(e){}
    const rm=lowMo();setTimeout(()=>{o.classList.add('sale');setTimeout(()=>{o.hidden=true;o.classList.remove('firmado','sale');done(n)},rm?0:500)},rm?700:1300)};
  ok.onclick=firmar;inp.onkeydown=e=>{if(e.key==='Enter')firmar()}}
