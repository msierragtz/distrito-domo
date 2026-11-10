"""v82: caché de sprites. Con CPU 4x más lenta, del atardecer a la madrugada ningún edificio se queda sin dibujar ni sin imagen de respaldo,
el tope sale del tamaño de la ciudad y la noche sí termina de llegar. Uso: python3 tests/arnes.py && python3 tests/v82.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
RUN="""(async()=>{const D=__dd,P=D.prof,st=P.stat,wait=ms=>new Promise(r=>setTimeout(r,ms));D.setPause(false);D.S.clock=D.DAY*.35;await wait(3000);for(const k in st)st[k]=0;
  for(let k=0;k<=20;k++){D.S.clock=D.DAY*(.55+.35*k/20);await wait(400)}const a={...st};await wait(6000);return {a,n:P.n,cap:P.cap}})()"""
async def main():
  bad=[]
  async with async_playwright() as p:
    b=await lanzar(p);ctx=await b.new_context(viewport={'width':1280,'height':800})
    await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.guia','1')}")
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));cdp=await ctx.new_cdp_session(pg);await cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(1200)
    r=await pg.evaluate(RUN);print(json.dumps(r))
    if r['a']['nul']>0:bad.append('edificios sin dibujar al anochecer: %d'%r['a']['nul'])
    if r['a']['miss']>5:bad.append('edificios sin respaldo: %d'%r['a']['miss'])
    if r['a']['clr']>0:bad.append('la caché se vació completa')
    objn,cap=r['cap']
    if objn<300 or cap<max(900,objn*1.3):bad.append('tope mal calculado: %s'%r['cap'])
    if r['n']['sprl']<r['n']['last']*.5:bad.append('la noche no terminó de llegar: %s'%r['n'])
    if errs:bad.append('errores: %s'%errs)
    await b.close()
  print('\n'.join(bad) if bad else '\nTODO BIEN');sys.exit(1 if bad else 0)
asyncio.run(main())
