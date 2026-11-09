"""Compara calidad normal vs «Calidad baja» (OPT.low) con CPU 4x más lenta, celular. Uso: python3 tests/perf-low.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
FR=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'perf-auditoria.py')).read().split('FRAMES="""')[1].split('"""')[0]
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);out={}
    for low in (False,True):
      ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=3,is_mobile=True,has_touch=True)
      await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.opciones',"+json.dumps(json.dumps({'low':low}))+")}")
      pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg);await cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(1500)
      await pg.evaluate("__dd.setPause(false);__dd.S.clock=__dd.DAY*.35");await pg.wait_for_timeout(2500)
      r={'dia':await pg.evaluate(FR,6)}
      await pg.evaluate("__dd.S.clock=__dd.DAY*.6");await pg.wait_for_timeout(500);r['atardecer']=await pg.evaluate(FR,6)
      out['baja' if low else 'normal']=r;print('baja' if low else 'normal',json.dumps({k:{q:v[q] for q in ('fps','p50','p95','render')} for k,v in r.items()}));await ctx.close()
    json.dump(out,open(BUILD+'/perf-low.json','w'),indent=1);await b.close()
asyncio.run(main())
