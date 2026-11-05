"""Acercamientos para revisar detalles: plaza, El Domo, una torre y una calle, por temporada y hora.
Uso: python3 tests/detalle.py prefijo temporada[,temporada] [hora 0-1] [lluvia 0/1]"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json,io
from PIL import Image
from playwright.async_api import async_playwright
ESC=open(ROOT+'/tests/datos/escena-muestra.js').read()
PRE=sys.argv[1];SEAS=sys.argv[2].split(',');PH=float(sys.argv[3]) if len(sys.argv)>3 else .7;RAIN=len(sys.argv)>4 and sys.argv[4]=='1'
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    for se in SEAS:
      ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
      await ctx.add_init_script("localStorage.setItem('distritoDomo.opciones',"+json.dumps(json.dumps({'season':se}))+")")
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(600)
      await pg.evaluate(ESC)
      await pg.evaluate("__dd.setPause(true);for(const s of ['#dialog','#pausebar','#needs','header','nav','.zoom'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
      await pg.evaluate(f"(()=>{{const S=__dd.S;S.clock=__dd.DAY*{PH};S.ev={'{id:\"lluvia\",t:55}' if RAIN else 'null'}}})()")
      tg={'plaza':await pg.evaluate("__dd.idx(14,13)"),'domo':await pg.evaluate("__dd.idx(15,15)"),'torre':await pg.evaluate("__dd.idx(21,13)"),'calle':await pg.evaluate("__dd.idx(16,10)")}
      sheet=Image.new('RGB',(4*420,380),'black')
      for c,(nm,i) in enumerate(tg.items()):
        if i<0: continue
        await pg.evaluate(f"(()=>{{__dd.setPan(0,0,3);__dd.camTo({i},.01)}})()");await pg.wait_for_timeout(2500)
        q=[640,470]
        im=Image.open(io.BytesIO(await pg.screenshot()))
        sheet.paste(im.crop((int(q[0]-210),int(q[1]-300),int(q[0]+210),int(q[1]+80))),(c*420,0))
      sheet.save(BUILD+f'/capturas/{PRE}-{se}.png');await ctx.close()
    print('errores',errs[:4]);await b.close()
asyncio.run(main())
