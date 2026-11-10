"""v83 (una sola vez): regresan los nombres originales de los negocios inventados (los 20 de VARN y el consultorio).
Siguen cambiadas las marcas reales: banco, acerera, universidades, equipos, la torre y el nombre del juego."""
import io,glob
R=[("Consultorio Buenasalud","Consultorio Altusalud"),("La Regionalísima'","La Regional'"),("Chorizos Chema","Chochomos"),("'Panaderia'","'Panacea'"),("Señora Sartén","Señora Katana"),
 ("Lonchería El Plebe","Lonchería El Huerco"),("Mariscos El Compadre","Mariscos el Mikas"),("Asador El Carbón Feliz","Asador La Pampa"),("Beta Brew","Alpha Brew"),("'Prensa Francesa'","'Prensa Negra'"),
 ("Pastelería 90","La Pastelería 89"),("'Masa Madre'","'Dough'"),("'Pan Pretencioso'","'Éclair'"),("La Loca Luna","La Loquera Bar"),("'Reyecito Bar'","'Rey Bar'"),("Billar La Sultanita","Billar Sultana"),
 ("El Cacique Jubilado","El Cacique Azteca"),("Bar 1900","Bar 1800"),("Mezcalería El Tlacuache","Mezcalería Coyote"),("Azotea Topacio","Azotea Tupaz"),("Lounge Mica","Cuarzo Lounge")]
n=0
for f in glob.glob('src/js/*.js')+glob.glob('src/js/arte/*.js')+glob.glob('tests/datos/*.js'):
  s=io.open(f,encoding='utf8').read();o=s
  for a,b in R:s=s.replace(a,b)
  if s!=o:io.open(f,'w',encoding='utf8').write(s);n+=1;print(f)
print('archivos cambiados',n)
