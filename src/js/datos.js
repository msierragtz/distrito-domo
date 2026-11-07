(()=>{
/* economía: perillas calibradas con simulaciones (ver notas del proyecto) */
const ECO={infl:250,cRef:60,cExp:.5,cMin:.6,cMax:2.75,bizCap:.6,upk:.72,incMul:.95,fl:{torre:[2600,1.18],edificio:[170,1.34],ladrillo:[180,1.34]},lvBiz:[0,0,2.5,4,6],lvSvc:[0,0,3,6,10],infSvc:500,lvHome:[0,0,1.2,1.8,2.5],rentLv:.25,boot:[150,1.6,300,1.3]};
// arranque: los negocios rinden más mientras el Distrito es chico (simulado: quita el tiempo muerto de los primeros 10 min y a los 60 min ya casi no cambia nada)
const bootMul=()=>{const m=S?S.maxV||0:0,b=ECO.boot;return m<b[0]?b[1]:m<b[2]?b[3]:1};
// distrito activo: Domo (el original) o Ribera (se abre a los 3,000); cada uno guarda su propia partida
const DIST=(()=>{try{return localStorage.getItem('distritoDomo.distrito')==='ribera'?'ribera':'domo'}catch(e){return 'domo'}})();
const DNAME=DIST==='ribera'?'Distrito Ribera':'Distrito Domo',LM=DIST==='ribera'?'El Puente':'El Domo';
const N=30, OFF=7, TW=32, TH=16, KEY=DIST==='ribera'?'distritoDomo.ribera.v1':'distritoDomo.v4', DAY=360;
/* opciones visuales: calidad baja (celulares lentos), menos movimiento y alto contraste */
const OPT=(()=>{const o={low:false,rm:false,hc:false,season:'auto'};try{Object.assign(o,JSON.parse(localStorage.getItem('distritoDomo.opciones')||'{}'))}catch(e){}return o})();
const RMQ=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):null;let RMV=!!(RMQ&&RMQ.matches);try{RMQ&&RMQ.addEventListener('change',e=>{RMV=e.matches})}catch(e){}
const lowMo=()=>OPT.rm||RMV;
const DEFS={
  calle:{name:'Calle',cost:5,grow:1,unlock:0,bt:0,upk:.02,desc:'Todo lo que construyas necesita tocar una calle.'},
  edificio:{name:'Edificio',cost:368,grow:1.22,unlock:0,bt:20,f0:3,fmax:10,per:6,upc:150,upg:1.32,upk:.28,desc:'Concreto claro, 6 vecinos por piso: sobre todo estudiantes, luego familias. Tócalo otra vez para subirle un piso.'},
  ladrillo:{name:'Edificio de ladrillo',cost:414,grow:1.22,unlock:0,bt:20,f0:4,fmax:9,per:6,upc:161,upg:1.32,upk:.28,desc:'Ladrillo rojo: lo prefieren las familias. Tócalo otra vez para subirle un piso.'},
  casaf:{name:'Casa de fraccionamiento',cost:120,grow:1.18,unlock:30,bt:10,f0:1,fmax:2,per:5,upc:90,upg:1.5,upk:.22,desc:'Casita con cochera, patio y reja: 5 vecinos por piso, casi todos familias. Cada casa trae carro, así que pide el doble de estacionamiento. Tócala otra vez para subirle un piso.'},
  mixto:{R:3,val:[.05,2],name:'Usos mixtos',cost:450,grow:1.22,unlock:120,bt:20,f0:3,fmax:6,per:5,upc:160,upg:1.32,upk:.28,com:3,inc:2,desc:'Departamentos con un local abajo (farmacia, papelería, lavandería, panadería o tortillería): da comercio a 3 cuadras y deja algo de dinero. Viven estudiantes y profesionistas. Tócalo otra vez para subirle un piso.'},
  parque:{R:4,val:[.16,3],name:'Parque',cost:60,grow:1.12,unlock:0,bt:4,verde:6,upk:0.15,desc:'Área verde, a las familias les encanta. Junto a un café o restaurante, los hace ganar más.'},
  palma:{R:2,val:[.05,1],name:'Palmeras',cost:20,grow:1.05,unlock:0,bt:2,hidden:true,verde:2,upk:0.025,desc:'Un poquito de verde y sombra.'},
  dogpark:{R:5,val:[.12,3],name:'Dog park',cost:140,grow:1.15,unlock:12,bt:6,verde:6,dog:2,upk:0.25,desc:'Indispensable para quienes tienen mascota: cada uno alcanza para unos 18.'},
  plaza:{R:4,val:[.16,3],name:'Plaza',cost:100,grow:1.15,unlock:20,bt:6,verde:6,upk:0.2,desc:'Área verde y punto de encuentro: a familias y estudiantes también les sirve de comercio.'},
  cafe:{R:4,val:[.1,3],name:'Café y postres',cost:180,grow:1.12,unlock:10,bt:8,com:6,inc:3,upk:0.3,desc:'Les gusta a profesionistas y estudiantes. Junto a un parque o plaza gana 50% más.'},
  caseta:{val:[.1,4],name:'Caseta',cost:260,grow:1.2,unlock:25,bt:6,seg:1,upk:.7,desc:'Controla las fiestas de unos 80 estudiantes. A los estudiantes no les gusta tenerla cerca.'},
  tomates:{R:5,val:[.07,3],name:'Tomates Market',cost:260,grow:1.15,unlock:25,bt:8,com:8,inc:4.5,upk:0.4,desc:'Tienda abierta día y noche: le sirve a todos.'},
  estac:{R:4,name:'Estacionamiento',cost:220,grow:1.12,unlock:15,bt:6,park:12.5,inc:1,upk:0.15,desc:'Aquí todo mundo llega en carro. Calma el tráfico.'},
  ciclo:{R:4,val:[.06,3],name:'Cicloestación',cost:180,grow:1.12,unlock:80,bt:6,park:5,upk:.15,desc:'Bicis compartidas: baja la necesidad de estacionamiento a 4 cuadras y salen ciclistas a las calles. Junto a oficinas, la escuela o el metro cubre 50% más.'},
  padel:{R:5,val:[.1,3],name:'Pádel',cost:350,grow:1.15,unlock:40,bt:8,com:6,verde:2,inc:4,upk:0.4,desc:'Les gusta a profesionistas y familias. Da un poco de verde.'},
  resto:{R:5,val:[.12,4],name:'Restaurante',cost:900,grow:1.12,unlock:55,bt:12,com:10,inc:7,upk:0.6,desc:'Les gusta a profesionistas y familias. Junto a un parque o plaza gana 50% más.'},
  bar:{R:4,val:[.06,3],name:'Bar',cost:320,grow:1.15,unlock:60,bt:8,com:7,inc:5,upk:.45,desc:'Para profesionistas y estudiantes. A las familias les molesta tenerlo cerca, y de noche hace ruido.'},
  oficinas:{R:6,val:[.08,4],name:'Oficinas',cost:5000,grow:1.15,unlock:120,bt:30,com:12,inc:25,upk:2,desc:'Empleo y coworking para profesionistas y estudiantes. A las familias no les gusta tenerlas cerca (tráfico).'},
  banco:{R:4,val:[.08,3],name:'Banco',cost:1200,grow:1.15,unlock:250,bt:14,com:4,inc:8,upk:.8,desc:'Les sirve a profesionistas y familias. Los negocios a 4 cuadras ganan 10% más.'},
  gas:{R:4,val:[.03,2],name:'Gasolinera',cost:600,grow:1.15,unlock:100,bt:12,com:3,inc:6,upk:.5,desc:'Va pegada a una avenida, para que entren los coches. Su tiendita les sirve a profesionistas y familias, pero a las familias no les gusta tenerla cerca.'},
  torre:{name:'Torre Caliza',cost:6000,grow:1.25,unlock:160,bt:60,f0:16,fmax:26,per:6,upc:900,upg:1.15,upk:.22,desc:'16 pisos: aquí viven sobre todo profesionistas, que pagan más renta. Tócala otra vez para crecerla, o tócala sobre un edificio para convertirlo en torre sin perder vecinos.'},
  torreagua:{name:'Torre de agua',cost:50000,grow:1.2,unlock:750,bt:40,upk:.6,val:[.05,3],desc:'El tanque del Distrito alcanza para 1,000 vecinos. Cada Torre de agua surte a 1,000 más (puedes tener todas las que quieras): sin ella, arriba de 1,000 vecinos empiezan los problemas de agua.'},
  kiosco:{name:'Kiosco de la música',cost:0,unlock:500,bt:10,upk:0,max:1,trophy:1,R:4,val:[.08,3],desc:'Trofeo de 500 vecinos, gratis. De noche toca un trío: las familias de alrededor están más contentas y el jazz suma una trompeta.'},
  mirador:{name:'Mirador del Distrito',cost:0,unlock:1000,bt:20,upk:0,max:1,trophy:1,val:[.2,5],desc:'Trofeo de 1,000 vecinos, gratis. Vista a la Sierra Madre: sube la plusvalía 5 cuadras a la redonda.'},
  cultura:{name:'Centro Cultural Domo',cost:0,unlock:2000,bt:30,upk:0,max:1,trophy:1,R:6,com:14,val:[.1,4],desc:'Trofeo de 2,000 vecinos, gratis. Comercio para familias, profesionistas y estudiantes; con sus eventos hay menos fiestas.'},
  teleferico:{name:'Teleférico a La Huasteca',cost:0,unlock:3000,bt:40,upk:0,max:1,trophy:1,val:[.08,3],desc:'Trofeo de 3,000 vecinos, gratis. Los turistas suben a La Huasteca y dejan $15 por segundo.'},
  domo:{R:6,val:[.22,6],name:'El Domo',cost:25000,unlock:300,bt:45,bonus:.12,max:1,upk:5,desc:'El arco naranja del Distrito. Sube mucho la satisfacción. Solo hay uno.'},
  tanque:{val:[.12,4],name:'Tanque de agua',cost:0,unlock:0,bt:0,bonus:.05,hidden:true,fixed:true,desc:''},
  reserva:{name:'Terreno reservado',cost:0,unlock:0,bt:0,hidden:true,fixed:true,desc:''},
  rio:{name:'Río',cost:0,unlock:0,bt:0,hidden:true,fixed:true,desc:''},
  malecon:{R:4,val:[.14,3],name:'Malecón',cost:150,grow:1.12,unlock:30,bt:6,verde:5,upk:.1,desc:'Paseo en la orilla del río, con barandal, faroles y palmas. Da verde a 4 cuadras y sube la plusvalía. Solo va junto al río.'},
  alberca:{R:5,val:[.15,4],name:'Alberca pública',cost:20000,unlock:800,bt:60,sz:2,max:1,obra:1,verde:6,com:4,upk:1.5,desc:'Ocupa 2×2 terrenos. Verde y comercio para familias y estudiantes a 5 cuadras. En la ola de calor se llena: todo el distrito anda más contento y las entradas dejan $12/s. De noche cierra.'},
  parroquia:{R:6,val:[.18,5],name:'Parroquia',cost:35000,unlock:1500,bt:90,sz:2,max:1,obra:1,upk:2,desc:'Ocupa 2×2 terrenos. Las familias a 6 cuadras están más contentas. Cada tanto hay boda: cohetes y, por un minuto, los negocios a 4 cuadras ganan 50% más. En Navidad hay posada en el atrio.'},
  hotel:{R:4,val:[.12,4],name:'Hotel boutique',cost:60000,unlock:2500,bt:120,sz:2,max:1,obra:1,upk:3,desc:'Ocupa 2×2 terrenos. Los turistas dejan $20/s, $2 más por cada café, restaurante o bar a 4 cuadras (hasta 5), y 50% más durante el Clásico.'},
  lotedomo:{name:'Terreno del Domo',cost:0,unlock:0,bt:0,hidden:true,fixed:true,desc:''},
  fabrica:{name:'DeAcero',cost:0,unlock:0,bt:0,hidden:true,fixed:true,desc:''},
  escuela:{R:5,val:[.12,4],name:'Escuela',cost:1500,grow:1.15,unlock:150,bt:20,verde:2,com:3,upk:0.4,max:2,desc:'Primaria y secundaria del Distrito: a las familias les encanta tenerla cerca y ayuda a que sus hijos crezcan aquí.'},
  clinica:{R:6,val:[.1,5],name:'Clínica',cost:3000,grow:1.15,unlock:400,bt:30,bonus:.04,upk:0.6,max:1,desc:'Empieza como consultorio y puede crecer hasta hospital: sube la satisfacción de todo el Distrito. Solo hay una.'},
  cancha:{R:5,val:[.14,4],name:'Cancha de fútbol',cost:400,grow:1.12,unlock:80,bt:10,verde:6,com:4,park:4,upk:0.5,max:2,desc:'Cancha de barrio: da verde, comercio para las familias y estacionamiento (los partidos llenan todo).'},
  barber:{R:4,val:[.08,3],name:'Barbería',cost:250,grow:1.15,unlock:Infinity,bt:8,com:6,inc:3.5,upk:.35,desc:''},
  unas:{R:4,val:[.08,3],name:'Salón de uñas',cost:300,grow:1.15,unlock:Infinity,bt:8,com:6,inc:4,upk:.4,desc:''},
  paleteria:{R:4,val:[.06,3],name:'Paletería',cost:300,grow:1.15,unlock:Infinity,bt:6,com:5,inc:3,upk:.3,desc:''},
  boliche:{R:5,val:[.1,4],name:'Boliche',cost:650,grow:1.15,unlock:Infinity,bt:16,fw:2,fh:1,com:8,inc:6,upk:.6,desc:''},
  gym:{R:5,val:[.08,4],name:'Gimnasio 24 horas',cost:3500,grow:1.15,unlock:Infinity,bt:20,com:10,inc:12,upk:1.2,desc:''},
  cine:{R:6,val:[.12,5],name:'Cine',cost:8000,grow:1.15,unlock:Infinity,bt:30,fw:2,fh:1,com:14,inc:20,upk:2,desc:''},
  golf:{R:6,val:[.2,5],name:'Campo de tiro de golf',cost:4000,grow:1.2,unlock:Infinity,bt:24,fw:2,fh:1,verde:10,com:4,upk:1,desc:''},
  bosque:{R:7,val:[.3,6],name:'Bosque urbano',cost:60000,unlock:Infinity,bt:90,sz:3,max:1,obra:1,verde:30,upk:3,desc:'Ocupa 3×3 terrenos. Es el área verde más grande del juego (alcanza a 7 cuadras), calma el ruido de la avenida a 6 cuadras y en una ola de calor refresca todavía más. No deja dinero.'},
  museo:{R:6,val:[.25,6],name:'Museo del Domo',cost:80000,unlock:Infinity,bt:120,sz:2,max:1,obra:1,com:10,upk:5,desc:'Ocupa 2×2 terrenos y necesita un parque, plaza o campo de golf pegado para abrir. Sube mucho la plusvalía a 6 cuadras, da comercio a familias y profesionistas, y los turistas dejan $10/s. Mantenimiento alto.'},
  rasca:{R:7,val:[.06,6],name:'Rascacielos de oficinas',cost:150000,unlock:Infinity,bt:150,sz:2,max:1,obra:1,com:20,inc:80,upk:6,desc:'Ocupa 2×2 terrenos. Deja $80/s y da empleo y comercio a profesionistas y estudiantes a 7 cuadras. Gasta agua como 300 vecinos y su sombra baja un poco la plusvalía a 3 cuadras.'},
  beis:{R:6,val:[.15,5],name:'Estadio de Béisbol',cost:120000,unlock:Infinity,bt:150,sz:3,max:1,obra:1,com:12,upk:6,desc:'Ocupa 3×3 terrenos. Cada 8 minutos hay juego: 2 minutos de $90/s con familias y estudiantes felices, pero a 6 cuadras se necesita más del doble de estacionamiento y a 3 cuadras el ruido molesta a las familias. Fuera de juego da comercio para familias y estudiantes.'},
  plazacom:{R:7,val:[.18,5],name:'Plaza comercial',cost:100000,unlock:Infinity,bt:150,sz:3,max:1,obra:1,com:30,inc:60,park:10,upk:5,desc:'Ocupa 3×3 terrenos. Comercio para los tres grupos a 7 cuadras, estacionamiento y $60/s, pero los negocios a 4 cuadras ganan 15% menos.'},
  metro:{R:6,val:[.2,6],name:'Estación del Metro',cost:200000,unlock:Infinity,bt:240,sz:2,max:1,obra:1,park:20,upk:8,desc:'Ocupa 2×2 terrenos. Baja 30% la necesidad de estacionamiento en todo el Distrito y los vecinos llegan 30% más rápido. Es la obra más tardada (4 minutos) y hace ruido mientras se construye.'},
  mejorar:{name:'Mejorar',cost:0,unlock:40,desc:'Sube de nivel lo que toques si su zona tiene plusvalía 46, 58 o 70. Negocios: +50% de ganancia. Servicios: cubren 30% más. Vivienda: le cabe un piso más y paga 25% más de renta. La obra tarda un rato.'},
  demoler:{name:'Demoler',cost:0,unlock:0,desc:'Quita lo construido y recupera la mitad de lo que costó.'},
  ver:{name:'¿Qué es?',cost:0,unlock:0,desc:'La manita solo mira: pasa sobre cualquier cosa para ver qué es y tócala para saber más. No construye ni gasta. Tecla Esc para tomarla.'}
};
const EVENTS=[
  {id:'calor',name:'Ola de calor',dur:120,mod:{verde:1.6},msg:'¡Ola de calor! 40 grados en Santa Catarina. Los vecinos piden mucho más verde.'},
  {id:'clasico',name:'Clásico regio',dur:90,mod:{park:2.2},incMul:1.5,msg:'¡Clásico Rayados contra Tigres! Los negocios se llenan, pero no hay dónde estacionarse.'},
  {id:'agua',name:'Corte de agua',dur:90,flat:-.07,msg:'Corte de agua en el Distrito. La satisfacción baja hasta que regrese el servicio.'},
  {id:'obra',name:'Obra en Ordóñez',dur:120,noiseMul:2.5,mod:{park:1.4},msg:'Están arreglando la Av. Manuel Ordóñez: más ruido y más tráfico.'},
  {id:'lluvia',name:'Tormenta regia',dur:110,mod:{verde:.6},incMul:.9,msg:'¡Se soltó la tormenta! Las plantas agradecen el agua, pero la gente sale menos a los negocios.'},
  {id:'bazar',name:'Bazar en la plaza',dur:90,incMul:1.4,flat:.05,msg:'Bazar de fin de semana: el comercio deja más y los vecinos andan contentos.'}
];
const NEEDS=[['verde','Verde'],['com','Comercio'],['park','Estacion.'],['dog','Dog park']];
const LV={
  barber:['Barber Barrio','Estética para caballeros','Barber Hipster','Spa for Men'],
  unas:['Salón de uñas','Nail Art','Ponte Chula','Spa for Women'],
  gym:['Aparatos en el parque','Start Fit','Domo Box','Wellness Elite'],
  paleteria:['Carrito de paletas','Paletería de barrio','Nevería artesanal','Heladería del Domo'],
  boliche:['Boliche de barrio','Boliche familiar','Boliche cósmico','Bowling Lounge'],
  cine:['Cine de barrio','Cine de 4 salas','Multicinema','Cine VIP'],
  golf:['Campo de práctica','Driving range iluminado','Club de golf','Club campestre'],
  escuela:['Guardería','Escuela primaria','Colegio privado','Campus Domo'],
  clinica:['Consultorio Altusalud','Clínica con urgencias','Clínica de especialidades','Hospital Distrito'],
  cancha:['Cancha de barrio','Cancha de pasto sintético','Unidad deportiva','Estadio de barrio'],
  resto:['Puesto de barbacoa','Lonchería','Hamburguesas gourmet','Restaurante de autor'],
  cafe:['Café de olla','Cafetería','Café de especialidad','Brunch y concept store'],
  tomates:['Tomates Market','Tomates 24 horas','Tomates Gourmet','Tomates Signature'],
  padel:['Pádel','Pádel techado','Club de pádel','Club deportivo privado'],
  parque:['Parque de barrio','Parque con juegos','Jardín con fuente','Parque con lago'],
  plaza:['Plaza','Plaza con fuente','Plaza con arte','Paseo comercial'],
  dogpark:['Dog park','Dog park con agility','Dog park con cafetería','Club canino'],
  estac:['Lote con viene-viene','Estacionamiento','Estacionamiento techado','Torre de estacionamiento'],
  caseta:['Caseta','Caseta con cámaras','Central de monitoreo','Seguridad privada 24/7'],
  bar:['Micheladas','Cantina','Mezcalería','Bar de azotea'],
  oficinas:['Oficinas','Coworking','Corporativo','Corporativo verde'],
  edificio:['Departamentos','Departamentos remodelados','Lofts','Residencial de lujo'],
  ladrillo:['Edificio de ladrillo','Ladrillo restaurado','Lofts industriales','Boutique de ladrillo'],
  torre:['Torre Caliza','Torre Caliza Plus','Torre Caliza Premium','Torre Caliza Sky'],
  casaf:['Casa en obra gris','Casa pintada con cochera','Casa con terraza','Casa remodelada'],
  mixto:['Local con departamentos','Edificio de usos mixtos','Usos mixtos con balcones','Usos mixtos de diseño'],
  ciclo:['Cicloestación','Cicloestación techada','Bici-taller','Cicloestación solar'],
  banco:['Cajero automático','Sucursal bancaria','Banco con autobanco','Torre financiera'],
  gas:['Bomba de gasolina','Gasolinera','Gasolinera con tiendita','Estación de carga']};
// el estacionamiento no tenía plusvalía propia: alimenta la capa de estacionamiento con este valor
const PARKVAL=[.12,3];
const LVTH=[0,0,.55,.68,.84],LVT=[0,0,20,40,60];
{const n=LVTH.slice(2).map(v=>Math.round(v*100)),last=n.pop();DEFS.mejorar.desc=DEFS.mejorar.desc.replace('46, 58 o 70',n.join(', ')+(String(last)[0]==='8'?' u ':' o ')+last)}
const lvOf=t=>t.lv||1;
const VARN={
  resto:[['Puesto de barbacoa','Pollos al carbón','Tacos a vapor','Elotes asados'],['Lonchería El Huerco','El Pollo Pillo','Tacos de asada','Sushi Troll'],['Smash Burgers','Bison Mad Wings','Asador La Pampa','Mariscos el Mikas'],['Chochomos','Panacea','La Regional','Señora Katana']],
  cafe:[['Café de carrito','Churros Poncho','Pan dulce','Tamales'],['Jim Borbons','Starblocks','Panadería La Espiga','Nevería Ordóñez'],['Alpha Brew','Prensa Negra','La Pastelería 89','Té y Matcha'],['Dough','Galería Acero','Éclair','Brunch Domo']],
  bar:[['Micheladas','Clamatos','Litros','Depósito'],['Cantina Huasteca','Rey Bar','Billar Sultana','La Loquera Bar'],['Mezcalería Coyote','El Cacique Azteca','Bar 1800','Cervecería Lúpulo'],['Azotea Tupaz','Cuarzo Lounge','Huasteca Sky','Cúpula Bar']]};
const lvName=(t,L)=>VARN[t.k]?VARN[t.k][L-1][(t.s>>2)%4]:LV[t.k][L-1];
const nameOf=t=>LV[t.k]?lvName(t,lvOf(t)):(DEFS[t.k]?DEFS[t.k].name:'Terreno');
const isBiz=k=>!!(DEFS[k]&&DEFS[k].inc&&DEFS[k].R&&LIKE[k]&&!DEFS[k].obra);
// mejorar cuesta más en barrios caros, pero suave: ×1.1 en barrio de nivel 2, ×1.25 en nivel 3 y ×1.5 en nivel 4.
// i es el índice del terreno; si no se pasa se busca (solo en llamadas sueltas, nunca en ciclos por cuadro)
function barrioMul(i){const v=(i!=null&&i>=0&&stats.VAL)?stats.VAL[i]:0;return v>=LVTH[4]?1.5:v>=LVTH[3]?1.25:v>=LVTH[2]?1.1:1}
function lvCost(t,i){const d=DEFS[t.k],L=lvOf(t)+1,v=S?S.v:0;if(i==null)i=S.g.indexOf(t);const bm=barrioMul(i);
  if(d.per)return Math.round(upCost(t)*ECO.lvHome[L]*bm);
  if(isBiz(t.k))return Math.round(d.cost*ECO.lvBiz[L]*(1+v/ECO.infl)*bm);
  return Math.round(d.cost*ECO.lvSvc[L]*(1+v/ECO.infSvc)*bm)}
const ORDER=Object.keys(DEFS).filter(k=>!DEFS[k].hidden);
const SURN=['Garza','Treviño','Cantú','Villarreal','Elizondo','Salinas','González','Martínez','Leal','Cavazos','Guerra','Zambrano','Flores','Rodríguez','Hinojosa','Montemayor','Sepúlveda','Tamez','Benavides','Lozano'];

