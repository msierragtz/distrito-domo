import os,sys;sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..' if os.path.basename(os.path.dirname(os.path.abspath(__file__)))=='bots' else '.'));from comun import ROOT,BUILD,lanzar
import asyncio,json,sys
from playwright.async_api import async_playwright
exec(open(ROOT+'/tests/escena.py').read().split('async def main')[0])
async def main():
  async with async_playwright() as p:
    b=await lanzar(p)
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append('PE '+str(e)+' | '+(e.stack or '')[:600]))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    await pg.evaluate(SCENE)
    # momento del Domo: terminar la obra de verdad con tick
    d=await pg.evaluate("__dd.idx(15,15)")
    await pg.evaluate(f"(()=>{{const t=__dd.S.g[{d}];t.b=.2;t.bt=45}})()")
    await pg.wait_for_timeout(600)
    for k,ms in enumerate([500,900,1200,2500]):
      await pg.wait_for_timeout(ms);await pg.screenshot(path=BUILD+f'/capturas/j64-domo-{k}.png')
      print(k,await pg.evaluate("[__dd.TS.toFixed(2),!!__dd.CINE,!!__dd.CAMG,__dd.FWn]"))
    # nivel con confeti: un café sube de nivel
    c=await pg.evaluate("__dd.idx(15,13)")
    await pg.evaluate(f"(()=>{{const t=__dd.S.g[{c}];t.lu=.1;t.lt=20}})()");await pg.evaluate(f"__dd.camTo({c},.01)");await pg.wait_for_timeout(700)
    await pg.screenshot(path=BUILD+'/capturas/j64-nivel.png')
    # zoom suave
    await pg.evaluate("__dd.zoomAt(3,300,300)");await pg.wait_for_timeout(80);print('ZA',await pg.evaluate("[!!__dd.ZA,document.querySelector('#cv').style.transform,__dd.zoom]"))
    await pg.wait_for_timeout(300);print('fin',await pg.evaluate("[!!__dd.ZA,document.querySelector('#cv').style.transform,__dd.zoom]"))
    await pg.mouse.move(640,400);await pg.mouse.wheel(0,-120);await pg.wait_for_timeout(400);print('rueda',await pg.evaluate("__dd.zoom"))
    await pg.mouse.wheel(0,120);await pg.wait_for_timeout(400);print('rueda',await pg.evaluate("__dd.zoom"))
    # inercia: arrastre rápido
    p0=await pg.evaluate("__dd.pan")
    await pg.mouse.move(600,400);await pg.mouse.down()
    for k in range(8): await pg.mouse.move(600+k*30,400);await pg.wait_for_timeout(16)
    await pg.mouse.up();p1=await pg.evaluate("[__dd.pan,!!__dd.INER]");await pg.wait_for_timeout(700);p2=await pg.evaluate("__dd.pan")
    print('inercia',p0,p1,p2)
    print('errores',errs[:5])
    await b.close()
asyncio.run(main())
