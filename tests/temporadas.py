"""Capturas de referencia por temporada y clima: ciudad de 2,600 vecinos de día, al atardecer y de noche.
Uso: python3 tests/temporadas.py [prefijo] [temporadas separadas por coma]"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1
PRE=sys.argv[1] if len(sys.argv)>1 else 'ref'
SEAS=(sys.argv[2] if len(sys.argv)>2 else 'none,muertos,patrias,navidad').split(',')
CASOS0=[('amanecer',.03,0),('amanecer2',.07,0),('amanecer3',.1,0),('dia',.25,0),('tarde',.47,0),('noche',.7,0),('lluvia-noche',.7,1),('lluvia-dia',.3,1)]
CASOS=[c for c in CASOS0 if not os.environ.get('SOLO') or c[0] in os.environ['SOLO'].split(',')]
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    for se in SEAS:
      ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page()
      pg.on('pageerror',lambda e:errs.append(se+': '+str(e)))
      await ctx.add_init_script("localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.opciones',"+json.dumps(json.dumps({'season':se}))+")")
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(600)
      await pg.evaluate("__dd.setPause(true);for(const s of ['#dialog','#pausebar','#needs'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
      for nm,ph,rain in CASOS:
        if rain and se not in ('none',SEAS[0]): continue
        await pg.evaluate(f"(()=>{{const S=__dd.S;S.clock=__dd.DAY*{ph};S.ev={'{id:\"lluvia\",t:60}' if rain else 'null'};__dd.setPan(0,-40,2)}})()")
        await pg.wait_for_timeout(2600 if rain else 1600)
        await pg.screenshot(path=BUILD+f'/capturas/{PRE}-{se}-{nm}.png')
      await ctx.close()
    print('errores',errs[:5]);await b.close()
asyncio.run(main())
