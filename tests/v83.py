"""v83: al girar el mapa la ciudad se ve completa desde el primer cuadro (dibujo del giro anterior en espejo mientras llega el nuevo)
y los negocios inventados conservan su nombre original. Uso: python3 tests/arnes.py && python3 tests/v83.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
RUN="""(async()=>{const D=__dd,P=D.prof,st=P.stat,wait=ms=>new Promise(r=>setTimeout(r,ms));D.setPause(false);D.S.clock=D.DAY*.35;await wait(3500);const out=[];
  for(const d of [1,1,-1,1,1,1]){for(const k in st)st[k]=0;D.turn(d);await wait(1800);out.push({...st,rot:D.ROT})}
  await wait(9000);return {out,n:P.n}})()"""
async def main():
  bad=[]
  async with async_playwright() as p:
    b=await lanzar(p);ctx=await b.new_context(viewport={'width':1280,'height':800})
    await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.guia','1')}")
    pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));cdp=await ctx.new_cdp_session(pg);await cdp.send('Emulation.setCPUThrottlingRate',{'rate':4})
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(1200)
    r=await pg.evaluate(RUN);print(json.dumps(r))
    for k,o in enumerate(r['out']):
      if o['nul']>60:bad.append('giro %d: %d veces un edificio sin dibujar (antes de la v83 eran miles)'%(k+1,o['nul']))
    if r['n']['sprl']<r['n']['last']*.3:bad.append('los dibujos nuevos no llegan después de girar: %s'%r['n'])
    nom=await pg.evaluate("JSON.stringify(__dd.VARN||0)") if await pg.evaluate("'VARN' in __dd") else open(ROOT+'/src/js/datos.js').read()
    for w in ('Chochomos','Panacea','Señora Katana','Alpha Brew','La Loquera Bar','Azotea Tupaz','Cuarzo Lounge'):
      if w not in nom:bad.append('falta el nombre original '+w)
    if errs:bad.append('errores: %s'%errs)
    await b.close()
  print('\n'.join(bad) if bad else '\nTODO BIEN');sys.exit(1 if bad else 0)
asyncio.run(main())
