import sys;sys.path.insert(0,'/home/claude/distrito-domo/tests');from comun import BUILD,lanzar
import asyncio,io,base64,json
from PIL import Image,ImageDraw,ImageFont,ImageChops
from playwright.async_api import async_playwright
F=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf',14)
def img(u):return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def crop(i):
  b=ImageChops.difference(i,Image.new('RGB',i.size,i.getpixel((1,1)))).getbbox();return i.crop(b) if b else i
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();errs=[];pg.on('console',lambda m:m.type=='warning' and errs.append(m.text));await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000)
    async def get(lst,rib=False,nb=0):return [crop(img(u)) for u in await pg.evaluate("__dd.ribSheet("+json.dumps(lst)+","+('true' if rib else 'false')+","+str(nb)+")")]
    rows=[('Torre',await get([['torre',L,[12,14,16,18][L-1],3] for L in (1,2,3,4)])+await get([['torre',4,18,3]],False,1)),
      ('Usos mixtos',await get([['mixto',L,[4,4,5,5][L-1],3] for L in (1,2,3,4)])+await get([['mixto',4,5,3]],False,1)),
      ('Museo y plaza comercial',await get([['museo',1,0,1],['plazacom',1,0,1]])+await get([['museo',1,0,1],['plazacom',1,0,1]],False,1))]
    hs=[max(i.height for i in r[1])+16 for r in rows];W=150+sum(i.width+12 for i in max((r[1] for r in rows),key=lambda c:sum(i.width for i in c)));im=Image.new('RGB',(W,sum(hs)+20),(240,236,226));d=ImageDraw.Draw(im);y=10
    for (lab,cells),h in zip(rows,hs):
      d.text((8,y+h//2),lab,font=F,fill=(30,30,40));x=150
      for i in cells:im.paste(i,(x,y+h-8-i.height));x+=i.width+12
      y+=h
    im.save(BUILD+'/capturas/hoja-v81.png');print('ok',im.size,errs[:4]);await b.close()
asyncio.run(main())
