import os,sys;sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..' if os.path.basename(os.path.dirname(os.path.abspath(__file__)))=='bots' else '.'));from comun import ROOT,BUILD,lanzar
import sys,asyncio,random
from playwright.async_api import async_playwright
CIUDAD=open(ROOT+'/tests/datos/ciudad-de-prueba.js').read()
async def run(html,W,H,secs,build):
  async with async_playwright() as p:
    b=await lanzar(p)
    pg=await b.new_page(viewport={'width':W,'height':H})
    errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.goto('file://'+html);await pg.wait_for_timeout(600);await pg.click('#tcont',force=True);await pg.wait_for_timeout(300)
    if build: await pg.evaluate(CIUDAD)
    await pg.evaluate("__dd.setPause(false);__dd.S.$=1e7")
    if os.environ.get('TODO'): await pg.evaluate("for(const k of Object.keys(__dd.DEFS))if(!__dd.S.unl.includes(k))__dd.S.unl.push(k);__dd.S.maxV=Math.max(__dd.S.maxV,4800)")
    R=random.Random(7);n=0;import time;t0=time.time()
    keys=['Escape','Escape','q','e','1','2','3','4',' ','c','v','Shift+L','Shift+N','Shift+H','Shift+H','Shift+F','m','f','f']
    while time.time()-t0<secs:
      r=R.random();x=R.randint(5,W-5);y=R.randint(70,H-230)
      try:
        if r<.45: await pg.mouse.click(x,y)
        elif r<.6: await pg.keyboard.press(R.choice(keys))
        elif r<.7:
          await pg.mouse.move(x,y);await pg.mouse.down();await pg.mouse.move(x+R.randint(-300,300),y+R.randint(-200,200),steps=4);await pg.mouse.up()
        elif r<.8: await pg.mouse.wheel(0,R.choice([-200,200]))
        elif r<.92:
          btns=await pg.query_selector_all('#fotobar:not([hidden]) button:not([disabled]),#tlbar:not([hidden]) button') or await pg.query_selector_all('.tool')
          if btns: await R.choice(btns).click(force=True)
        else: await pg.mouse.move(x,y)
        n+=1
      except Exception as e: errs.append('drv:'+str(e)[:80])
    await pg.wait_for_timeout(500)
    st=await pg.evaluate("({v:__dd.S.v,cl:__dd.S.clock,money:__dd.S.$})")
    await b.close();return n,errs,st
async def main():
  for (W,H,build) in [(1366,768,True),(390,844,False)]:
    n,e,st=await run(sys.argv[1] if len(sys.argv)>1 else BUILD+'/arnes.html',W,H,int(os.environ.get('SEG','75')),build)
    print(f"{W}x{H} acciones {n} errores {len([x for x in e if not x.startswith('drv')])}",[x for x in e if not x.startswith("drv")][:5],st)
asyncio.run(main())
