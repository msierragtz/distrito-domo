"""Hoja de aprobación del rascacielos pulido (v79): antes y después, de día y de noche, en Cañón y en la Ribera.
Uso: python3 tests/hoja-rasca.py → build/capturas/hoja-rasca.png"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,io,base64,json
from PIL import Image,ImageDraw,ImageFont,ImageChops
from playwright.async_api import async_playwright
F=lambda z:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',z)
def img(u):return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();errs=[];pg.on('console',lambda m:m.type=='warning' and errs.append(m.text));await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000)
    async def get(rib,nb):return img((await pg.evaluate("__dd.ribSheet([['rasca',1,0,1]],"+('true' if rib else 'false')+","+str(nb)+")"))[0])
    cells=[]
    for v,rib,nb,lab in ((0,0,0,'Antes · día'),(1,0,0,'Pulido · Cañón · día'),(1,1,0,'Pulido · Ribera · día'),(0,0,1,'Antes · noche'),(1,0,1,'Pulido · Cañón · noche'),(1,1,1,'Pulido · Ribera · noche')):
      await pg.evaluate(f"__dd.setRasca({'true' if v else 'false'})");cells.append((lab,await get(rib,nb)))
    sc=3;w=max(c[1].width for c in cells)*sc;h=max(c[1].height for c in cells)*sc;im=Image.new('RGB',(w*6+70,h+70),(240,236,226));d=ImageDraw.Draw(im)
    for k,(lab,i) in enumerate(cells):
      j=i.resize((i.width*sc,i.height*sc),Image.NEAREST);im.paste(j,(10+k*(w+10),50+h-j.height));d.text((14+k*(w+10),16),lab,font=F(15),fill=(30,30,40))
    im.save(BUILD+'/capturas/hoja-rasca.png');print('ok',im.size,errs[:3]);await b.close()
asyncio.run(main())
