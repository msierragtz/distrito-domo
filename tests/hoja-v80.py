"""Hoja de la v80: café de la Ribera con identidad propia, plaza nivel 4, Jitomates, malecón y autos con contorno y luces.
Uso: python3 tests/hoja-v80.py → build/capturas/hoja-v80.png"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,io,base64,json
from PIL import Image,ImageDraw,ImageFont,ImageChops
from playwright.async_api import async_playwright
F=lambda z:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',z)
def img(u,bg=(226,221,208)):
  i=Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGBA');b=Image.new('RGBA',i.size,bg+(255,));b.alpha_composite(i);return b.convert('RGB')
def crop(i):
  b=ImageChops.difference(i,Image.new('RGB',i.size,i.getpixel((1,1)))).getbbox();return i.crop(b) if b else i
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();errs=[];pg.on('console',lambda m:m.type=='warning' and errs.append(m.text));await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000)
    async def get(lst,rib=False,nb=0):return [crop(img(u)) for u in await pg.evaluate("__dd.ribSheet("+json.dumps(lst)+","+('true' if rib else 'false')+","+str(nb)+")")]
    rows=[('Café Ribera',await get([['cafe',L,0,1] for L in (1,2,3,4)],True)+await get([['cafe',4,0,1]],True,1)),
      ('Bar Ribera',await get([['bar',L,0,1] for L in (1,2,3,4)],True)),('Restaurante Ribera',await get([['resto',L,0,1] for L in (1,2,3,4)],True)),
      ('Plaza',await get([['plaza',L,0,1] for L in (1,2,3,4)])+await get([['plaza',4,0,1]],False,1)),
      ('Jitomates',await get([['tomates',L,0,1] for L in (1,2,3,4)])),('Malecón',await get([['malecon',1,0,2],['malecon',1,0,3]],True)+await get([['malecon',1,0,2]],True,1))]
    cars=[]
    for nb in (0,1):
      for m,c in (('car','#d62828'),('suv','#f4f4f4'),('pick','#2f6db5'),('mini','#f2c94c')):
        for d in (1,-1):cars.append(crop(img(await pg.evaluate(f"__dd.carShot('{c}','{m}',{d},{nb})"),(110,114,124))))
    rows.append(('Autos día / noche',cars))
    sc=2;cw=max(i.width for r in rows[:-1] for i in r[1])*sc+12;hs=[max(i.height for i in r[1])*(3 if 'Autos' in r[0] else sc)+18 for r in rows];im=Image.new('RGB',(170+cw*5,sum(hs)+20),(240,236,226));d=ImageDraw.Draw(im);y=10
    for (lab,cells),h in zip(rows,hs):
      d.text((8,y+h//2-8),lab,font=F(14),fill=(30,30,40));z=3 if 'Autos' in lab else sc;x=170
      for i in cells:
        j=i.resize((i.width*z,i.height*z),Image.NEAREST);im.paste(j,(x,y+h-9-j.height));x+=(j.width+10) if 'Autos' in lab else cw
      y+=h
    im.save(BUILD+'/capturas/hoja-v80.png');print('ok',im.size,errs[:4]);await b.close()
asyncio.run(main())
