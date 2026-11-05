import os,sys;sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..' if os.path.basename(os.path.dirname(os.path.abspath(__file__)))=='bots' else '.'));from comun import ROOT,BUILD,lanzar
import asyncio,sys
from playwright.async_api import async_playwright
CIUDAD=open(ROOT+'/tests/datos/ciudad-de-prueba.js').read()
async def main():
  async with async_playwright() as p:
    b=await lanzar(p)
    for o in ['{"low":true}','{"hc":true}','{"rm":true,"season":"muertos"}']:
      pg=await b.new_page(viewport={'width':1366,'height':768});errs=[]
      pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:errs.append(m.text) if m.type=='warning' else None)
      await pg.add_init_script(f"localStorage.setItem('distritoDomo.opciones','{o}')")
      await pg.goto('file://'+(sys.argv[1] if len(sys.argv)>1 else BUILD+'/arnes.html'));await pg.wait_for_timeout(1500)
      await pg.screenshot(path=BUILD+f'/capturas/title-{len(o)}.png')
      await pg.click('#tcont',force=True);await pg.wait_for_timeout(300);await pg.evaluate(CIUDAD)
      for ph in [0.5,0.75]:
        await pg.evaluate(f"__dd.setPan(0,-60,3);__dd.S.clock={ph}*360;__dd.reset()");await pg.wait_for_timeout(1200)
        await pg.screenshot(path=BUILD+f'/capturas/o{len(o)}-{ph}.png')
      print(o,errs[:4]);await pg.close()
    await b.close()
asyncio.run(main())
