"""Time-lapse: lo arma desde la ciudad de 2,600 vecinos (sin historia, así que el principio se reconstruye), toma capturas a lo largo
y revisa que al terminar la partida real quede igual. Uso: python3 tests/timelapse.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
    await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+")}")
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(800)
    antes=await pg.evaluate("JSON.stringify(__dd.S.g).length+'|'+__dd.S.clock.toFixed(2)+'|'+Math.round(__dd.S.v)")
    await pg.evaluate("__dd.setPause(false);__dd.histSnap()");print('historia',await pg.evaluate("__dd.HIST"))
    ok=await pg.evaluate("__dd.tlStart({})");print('arranca',ok,await pg.evaluate("__dd.TL"))
    for k in range(6):
      await pg.wait_for_timeout(2600);await pg.screenshot(path=BUILD+f'/capturas/tl-{k}.png');print(k,await pg.evaluate("__dd.TL"))
    ms=await pg.evaluate("(()=>{const t0=performance.now();return new Promise(res=>{let n=0;const f=()=>{n++;if(n<30)requestAnimationFrame(f);else res((performance.now()-t0)/30)};requestAnimationFrame(f)})})()")
    print('ms por cuadro',round(ms,1))
    await pg.wait_for_timeout(9000);print('final',await pg.evaluate("[__dd.TL,__dd.REAL]"))
    despues=await pg.evaluate("JSON.stringify(__dd.S.g).length+'|'+Math.round(__dd.S.v)")
    print('antes',antes,'despues',despues)
    print('errores',errs[:4]);await b.close()
asyncio.run(main())
