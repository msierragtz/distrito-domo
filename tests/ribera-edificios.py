"""Vivienda y negocios propios de la Ribera (v70): en la Ribera se usa su arte y sus nombres, en el Cañón todo sigue igual;
cada tipo y nivel se dibuja sin errores, de día y de noche; y un barrio de muestra junto al río (capturas en build/capturas/rib-barrio*.png).
Uso: python3 tests/ribera-edificios.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/'
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
KS=['edificio','ladrillo','torre','cafe','resto','bar','paleteria','tomates','oficinas'];FM={'edificio':10,'ladrillo':9,'torre':26}
# barrio de muestra: (x,y,tipo,nivel,pisos,semilla)
BARRIO=[(9,8,'edificio',2,5,0),(9,9,'edificio',3,6,3),(9,10,'cafe',3,0,1),(9,11,'ladrillo',2,6,1),(8,8,'torre',4,20,0),(8,9,'edificio',4,7,2),(8,10,'ladrillo',4,7,0),(8,11,'bar',3,0,1),
  (7,8,'edificio',1,4,5),(7,9,'paleteria',4,0,1),(7,10,'edificio',2,5,4),(7,11,'tomates',4,0,1),(9,13,'resto',4,0,1),(9,14,'edificio',2,6,1),(9,15,'cafe',2,0,2),(9,16,'ladrillo',3,7,2),
  (8,13,'edificio',3,5,5),(8,14,'oficinas',3,0,1),(8,15,'edificio',1,3,0),(8,16,'torre',3,18,1),(7,13,'bar',2,0,1),(7,14,'edificio',2,5,3),(7,15,'paleteria',2,0,1),(7,16,'edificio',3,6,4),
  (11,8,'resto',2,0,1),(12,8,'cafe',4,0,1),(11,10,'paleteria',3,0,1),(11,13,'bar',4,0,1),(11,14,'tomates',2,0,1),
  (19,8,'paleteria',1,0,1),(19,13,'edificio',2,5,2),(19,14,'resto',2,0,3),(19,15,'cafe',1,0,1),(21,8,'edificio',2,6,3),(21,9,'ladrillo',2,5,2),(21,10,'oficinas',2,0,1),(21,13,'edificio',3,5,4),
  (21,14,'bar',1,0,1),(21,15,'tomates',3,0,1),(21,16,'edificio',4,6,1),(22,8,'torre',2,17,1),(22,9,'edificio',1,4,5),(22,13,'mercado' if False else 'resto',1,0,1),(22,14,'edificio',2,5,0)]
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='warning' and 'dibujo' in m.text and errs.append(m.text))
    # 1) Cañón: arte y nombres de siempre
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000)
    d=await pg.evaluate("[__dd.DIST,__dd.RIBV,__dd.DEFS.edificio.name,__dd.DEFS.torre.name,__dd.nameOf({k:'cafe',s:4,lv:2}),__dd.nameOf({k:'tomates',s:0,lv:1})]");print('domo',d)
    ok(d[0]=='domo' and d[1] is False,'en el Cañón no se usa el arte de la Ribera')
    ok(d[2]=='Edificio' and d[3]=='Torre Caliza' and d[4]=='Starblocks' and d[5]=='Jitomates Market','el Cañón conserva sus nombres y marcas')
    # 2) Ribera: su arte y sus nombres
    await pg.evaluate("localStorage.setItem('distritoDomo.distrito','ribera')");await pg.reload();await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(800)
    r=await pg.evaluate("[__dd.DIST,__dd.RIBV,__dd.DEFS.edificio.name,__dd.DEFS.ladrillo.name,__dd.DEFS.torre.name,__dd.DEFS.tomates.name,__dd.nameOf({k:'cafe',s:4,lv:3}),__dd.nameOf({k:'resto',s:9,lv:2}),__dd.nameOf({k:'edificio',s:0,lv:4})]");print('ribera',r)
    ok(r[0]=='ribera' and r[1] is True,'en la Ribera se usa su arte')
    ok(r[2:6]==['Casas de la Ribera','Bodegas del río','Torre Malecón','Mercadito de la Ribera'],'nombres de la Ribera')
    ok(r[6:]==['Tostador en bodega','Palapa de mariscos','Casas de cantera'],'nombres por nivel, sin las marcas del Cañón')
    # 3) cada tipo, nivel y color se dibuja (con tinta) de día y de noche
    vac=[]
    for nb in (0,1):
      for k in KS:
        for L in (1,2,3,4):
          for s in (0,3):
            n=await pg.evaluate(f"__dd.spriteInk('{k}',{L},{FM.get(k,0)},{s},{nb})")
            if n<400:vac.append((k,L,s,nb,n))
    print('vacíos',vac[:5]);ok(not vac,f'los {len(KS)*4*2*2} dibujos tienen tinta')
    ok(not errs,'ningún dibujo falla')
    # 4) barrio de muestra junto al río
    puestos=await pg.evaluate("(()=>{const S=__dd.S,I=__dd.idx;let n=0;for(const [x,y,k,lv,f,s] of "+str([list(t) for t in BARRIO]).replace("'",'"')+"){const i=I(x,y);if(S.g[i].k!=='lote')continue;S.g[i]=f?{k,s,lv,f,b:0}:{k,s,lv,b:0};n++}S.pop={fam:900,pro:700,est:600};S.v=2200;S.ribCard=1;S.vozTip=1;S.clock=__dd.DAY*.36;S.ev=null;__dd.recompute();return n})()")
    print('puestos',puestos);ok(puestos>=35,f'barrio de muestra ({puestos} edificios)')
    await pg.evaluate("for(const s of ['#dialog','#needs','#pausebar','#ribnew'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
    await pg.evaluate("__dd.zoomAt(2,640,400)");await pg.wait_for_timeout(300);await pg.evaluate("__dd.camTo(__dd.idx(14,12),.01)");await pg.wait_for_timeout(2500)
    await pg.screenshot(path=CAP+'rib-barrio.png')
    await pg.evaluate("__dd.zoomAt(4,640,400)");await pg.wait_for_timeout(300);await pg.evaluate("__dd.camTo(__dd.idx(8,10),.01)");await pg.wait_for_timeout(2500);await pg.screenshot(path=CAP+'rib-barrio-cerca.png')
    await pg.evaluate("__dd.camTo(__dd.idx(21,13),.01)");await pg.wait_for_timeout(2500);await pg.screenshot(path=CAP+'rib-barrio-este.png')
    await pg.evaluate("__dd.S.clock=__dd.DAY*.86;__dd.camTo(__dd.idx(8,12),.01)");await pg.wait_for_timeout(2500);await pg.screenshot(path=CAP+'rib-barrio-noche.png')
    print('errores',errs[:5]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'))
  sys.exit(1 if fallas else 0)
asyncio.run(main())
