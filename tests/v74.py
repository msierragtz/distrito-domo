"""v74: todo el mapa se puede comprar (también la fábrica Aceros El Cerro en el Cañón y los terrenos ajenos de partidas viejas), con
cualquier herramienta; y el progreso del Cañón no se pierde al ir a la Ribera y volver, aunque la memoria del navegador esté
casi llena. Uso: python3 tests/v74.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
SIN="""(()=>{const D=__dd,S=D.S;let n=0,v=0;for(const t of S.g){if((t.k==='ajeno'||t.k==='fabrica')&&!(t.p&&D.PARCELS[t.p]))n++;if(D.whatName(t)==='Terreno vecino')v++}return [n,v]})()"""
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    async def fresh(d):
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.evaluate(f"localStorage.clear();localStorage.setItem('distritoDomo.distrito','{d}')");await pg.reload();await pg.wait_for_timeout(900)
    for d in ('domo','ribera'):
      await fresh(d);r=await pg.evaluate(SIN);ok(r==[0,0],f'{d}: cada terreno ajeno o de fábrica pertenece a un lote a la venta {r}')
    # partida vieja del Cañón: terrenos sin lote
    await fresh('domo');await pg.click('#tcont',force=True);await pg.wait_for_timeout(400)
    await pg.evaluate("(()=>{const S=__dd.S;for(const t of S.g)if(t.k==='ajeno'||t.k==='fabrica')delete t.p;S.seen=1;localStorage.setItem('distritoDomo.v4',JSON.stringify(S))})()")
    await pg.reload();await pg.wait_for_timeout(900);r=await pg.evaluate(SIN);ok(r==[0,0],f'partida vieja: al cargar, todo queda a la venta {r}')
    # comprar la planta Aceros El Cerro con la herramienta «ver» (dos toques)
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(400)
    r=await pg.evaluate("""(()=>{const D=__dd,S=D.S;S.maxV=3000;S.$=1e7;D.setTool('ver');const i=S.g.findIndex(t=>t.p==='DS'&&t.k==='fabrica');const n0=S.g.filter(t=>t.p==='DS').length;D.act(i);D.act(i);
      const l=S.g.filter(t=>t.p==='DL'),j=S.g.indexOf(l[0]);D.setTool('calle');D.act(j);D.act(j);return [n0,S.g.filter(t=>t.p==='DS').length,S.g[i].k,S.g.filter(t=>t.p==='DL').length]})()""")
    ok(r[0]>40 and r[1]==0 and r[2] in('lote','arbol') and r[3]==0,f'la planta y los patios de Aceros El Cerro se compran con dos toques, con cualquier herramienta {r}')
    # viaje Cañón → Ribera → Cañón con la memoria casi llena
    await fresh('domo');await pg.click('#tcont',force=True);await pg.wait_for_timeout(400)
    await pg.evaluate("""(()=>{const S=__dd.S;S.maxV=3500;S.v=3200;S.$=424242;S.name='Marca';localStorage.setItem('distritoDomo.riberaUnl','1');
      const big='x'.repeat(100000);let n=0;try{for(;;n++)localStorage.setItem('distritoDomo.ribera.v1.historia'+(n?'.'+n:''),big)}catch(e){}
      // relleno que no se puede borrar: deja apenas lugar
      try{for(let k=0;;k++)localStorage.setItem('otro'+k,'y'.repeat(20000))}catch(e){}})()""")
    await pg.evaluate("__dd.goDist('ribera')");await pg.wait_for_url('**/arnes.html*',timeout=8000);await pg.wait_for_timeout(2500)
    ok(await pg.evaluate("__dd.DIST")=='ribera','llega a la Ribera')
    await pg.evaluate("__dd.S.$+=1;__dd.setPause&&__dd.setPause(false)");await pg.wait_for_timeout(2500)
    await pg.evaluate("__dd.goDist('domo')");await pg.wait_for_url('**/arnes.html*',timeout=8000);await pg.wait_for_timeout(2500)
    r=await pg.evaluate("[__dd.DIST,__dd.S.name,Math.round(__dd.S.$),__dd.S.maxV,document.getElementById('title').hidden]")
    print('de vuelta',r);ok(r[0]=='domo' and r[1]=='Marca' and r[2]>=424000 and r[3]>=3500 and r[4],'de vuelta en el Cañón, la partida sigue igual')
    rb=await pg.evaluate("!!localStorage.getItem('distritoDomo.ribera.v1')");ok(rb,'la Ribera también quedó guardada')
    print('errores',errs[:5]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'));sys.exit(1 if fallas else 0)
asyncio.run(main())
