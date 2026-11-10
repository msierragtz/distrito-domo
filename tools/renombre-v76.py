"""Renombre v76 (una sola vez): el juego pasa a llamarse Distrito Sierra, el primer distrito es Cañón, su emblema es La Cúpula,
y salen las marcas reales. Las llaves internas ('domo', distritoDomo.*) no cambian: nadie pierde su partida."""
import re,glob,io
R=[ # (patrón, reemplazo) en orden
 (r"copia de Distrito Domo","copia de Distrito Sierra"),(r"<title>Distrito Domo","<title>Distrito Sierra"),(r"Distrito Domo se juega","Distrito Sierra se juega"),
 (r"DISTRITO<br>DOMO","DISTRITO<br>SIERRA"),(r"retro en el Distrito Domo de Santa Catarina","retro en Santa Catarina"),
 (r"¡EL DOMO ESTÁ LISTO!","¡LA CÚPULA ESTÁ LISTA!"),(r"Terreno del Domo","Terreno de La Cúpula"),(r"La foto del Domo","La foto de La Cúpula"),(r"Momento del Domo","Momento de La Cúpula"),
 (r"El arco naranja del Distrito","La cúpula con su arco naranja, emblema del Distrito"),
 (r"EL DOMO","LA CÚPULA"),(r"El Domo","La Cúpula"),
 (r"DISTRITO DOMO","DISTRITO CAÑÓN"),(r"Distrito Domo","Distrito Cañón"),
 (r"(?<![a-zA-Z])Domo\b","Cañón"),
 # marcas
 (r"Crédito Banregio","Crédito BanReMás"),(r"Banregio","BanReMás"),
 (r"Planta DeAcero","Planta de Aceros El Cerro"),(r"Patios DeAcero","Patios de Aceros El Cerro"),(r"Terreno DeAcero","Terreno de Aceros El Cerro"),(r"DeAcero","Aceros El Cerro"),
 (r"de la UDEM","de la Uni del Valle"),(r"a la UDEM","a la Uni del Valle"),(r"UDEM","Uni del Valle"),(r"del Tec\b","del Instituto"),
 (r"Rayados contra Tigres","Rayones contra Tigrillos"),
 (r"Tomates(?=[ ,'`\.:]| )","Jitomates"),
 (r"Consultorio Altusalud","Consultorio Buenasalud"),
 (r"La Regional'","La Regionalísima'"),(r"Chochomos","Chorizos Chema"),(r"'Panacea'","'Panaderia'"),(r"Señora Katana","Señora Sartén"),(r"Lonchería El Huerco","Lonchería El Plebe"),
 (r"Mariscos el Mikas","Mariscos El Compadre"),(r"Asador La Pampa","Asador El Carbón Feliz"),(r"Alpha Brew","Beta Brew"),(r"'Prensa Negra'","'Prensa Francesa'"),(r"La Pastelería 89","Pastelería 90"),
 (r"'Dough'","'Masa Madre'"),(r"'Éclair'","'Pan Pretencioso'"),(r"La Loquera Bar","La Loca Luna"),(r"'Rey Bar'","'Reyecito Bar'"),(r"Billar Sultana","Billar La Sultanita"),
 (r"El Cacique Azteca","El Cacique Jubilado"),(r"Bar 1800","Bar 1900"),(r"Mezcalería Coyote","Mezcalería El Tlacuache"),(r"Azotea Tupaz","Azotea Topacio"),(r"Cuarzo Lounge","Lounge Mica"),
]
files=glob.glob('src/js/*.js')+glob.glob('src/js/arte/*.js')+['src/index.html','tools/itch.mjs','package.json','README.md']+glob.glob('tests/*.py')+glob.glob('tests/bots/*')+glob.glob('tests/datos/*.js')
n=0
for f in files:
  if f.endswith('.json') and 'package' not in f:continue
  s=io.open(f,encoding='utf8').read();o=s
  for a,b in R:s=re.sub(a,b,s)
  if s!=o:io.open(f,'w',encoding='utf8').write(s);n+=1
print('archivos cambiados',n)
