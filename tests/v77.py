"""v76 y v77: el juego se llama Distrito Sierra (distritos Cañón y Ribera, emblema La Cúpula) y ya no trae marcas reales;
cada partida anota sus hitos y sus días, y «Compartir mi avance» los copia como texto. Las partidas viejas siguen cargando.
Uso: python3 tests/v77.py"""
import os,sys,re,glob,json;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio
from playwright.async_api import async_playwright
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
VIEJAS=['Torre Caliza','Distrito Pixel','DISTRITO<br>PIXEL','Distrito Domo','DISTRITO DOMO','El Domo','EL DOMO','Banregio','DeAcero','UDEM','del Tec','Rayados','Tigres','Tomates','Altusalud','Chochomos','Panacea','Señora Katana','El Huerco','el Mikas','La Pampa','Alpha Brew','Prensa Negra','Pastelería 89','Loquera','Billar Sultana','Cacique Azteca','Bar 1800','Mezcalería Coyote','Tupaz','Cuarzo Lounge']
async def main():
  html=open(ROOT+'/dist/distrito-domo.html',encoding='utf8').read()
  # los identificadores internos (artTomates, tomates:) no cuentan: solo texto que ve el jugador
  limpio=re.sub(r'artTomates|function domo\w+|domo\w*\(','',html)
  malas=[m for m in VIEJAS if m in limpio]
  ok(not malas,f'no queda ninguna marca ni el nombre viejo en el juego {malas}')
  ok('<title>Distrito Sierra</title>' in html,'el título es Distrito Sierra')
  ok(json.load(open(ROOT+'/package.json'))['version'].split('.')[1]==re.search(r'const VER=(\d+)',html).group(1),'la versión del juego coincide con package.json')
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page(viewport={'width':1280,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));E=pg.evaluate
    await pg.goto('file://'+BUILD+'/arnes.html');await E("localStorage.clear();localStorage.setItem('distritoDomo.guia','1')");await pg.reload();await pg.wait_for_timeout(800)
    t=await E("[document.querySelector('h1.tt').textContent,__dd.DEFS.domo.name,__dd.DEFS.fabrica.name,__dd.DEFS.tomates.name,document.getElementById('tdDomo').textContent]")
    print(t);ok(t[0].replace('\n','')=='DISTRITOSIERRA' and t[1]=='La Cúpula' and t[2]=='Aceros El Cerro' and t[3]=='Jitomates Market' and t[4].startswith('Cañón'),'pantalla de inicio, emblema, fábrica y súper con sus nombres nuevos')
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(600)
    ok('CAÑÓN' in await E("document.querySelector('header h1, #hud h1, h1').textContent.toUpperCase()"),'arriba dice Distrito Cañón')
    # hitos y días
    r=await E("""(()=>{const D=__dd,S=D.S;D.hitosStep();const a=JSON.stringify(S.hitos);S.playT=600;S.maxV=120;D.hitosStep();S.playT=1900;S.maxV=510;D.hitosStep();S.playT=2500;D.hitosStep();return [a,S.hitos,S.dias]})()""")
    print(r);hoy=await E("(()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')})()")
    ok(r[0]=='{}' and r[1]=={'100':600,'500':1900},'anota el segundo de juego en que cruza 100 y 500 vecinos, una sola vez')
    ok(r[2]==[hoy],'anota el día en que se abrió la partida')
    # compartir
    await E("document.getElementById('optb').click()");await pg.wait_for_timeout(200);await E("document.getElementById('oShare').click()");await pg.wait_for_timeout(400)
    tx=await E("document.getElementById('oAv').textContent");print(tx)
    ok('Distrito Sierra v81 · Distrito Cañón' in tx and '100 en 10 min' in tx and '500 en 32 min' in tx and '1 día' in tx and 'errores: 0' in tx,'«Compartir mi avance» arma el texto con hitos, días y errores')
    # se guarda y vuelve; un segundo día
    await E("__dd.S.dias=['2026-01-01'];__dd.S.seen=1");await pg.reload();await pg.wait_for_timeout(800);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    r=await E("[__dd.S.hitos,__dd.S.dias]");ok(r[0].get('100')==600 and r[1]==['2026-01-01',hoy],f'los hitos se guardan y otro día se suma a la lista {r[1]}')
    # partida vieja (antes de medir) con 600 vecinos
    await E("(()=>{const S=__dd.S;delete S.hitos;S.maxV=600;__dd.hitosStep()})()");r=await E("__dd.S.hitos")
    ok(r=={'100':-1,'500':-1},'una partida de antes marca sus hitos pasados como «antes de medir»')
    ok('100 (antes de medir)' in await E("__dd.avanceTxt()"),'y así lo dice el texto')
    # Ribera
    await E("localStorage.setItem('distritoDomo.distrito','ribera')");await pg.reload();await pg.wait_for_timeout(800)
    ok('Distrito Ribera' in await E("__dd.avanceTxt()"),'en la Ribera el avance dice Distrito Ribera')
    print('errores',errs[:4]);ok(not errs,'sin errores');await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'));sys.exit(1 if fallas else 0)
asyncio.run(main())
