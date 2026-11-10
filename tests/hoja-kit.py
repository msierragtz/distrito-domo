"""Hoja de aprobación del kit de nivel (v79): antes y después, niveles 1 a 4, y una vista del mapa alejado.
Uso: python3 tests/hoja-kit.py → build/capturas/hoja-kit-*.png"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,io,base64,json
from PIL import Image,ImageDraw,ImageFont,ImageChops
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/'
F=lambda z,b=True:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if b else '')+'.ttf',z)
def img(u):return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def crop(i):
  b=ImageChops.difference(i,Image.new('RGB',i.size,i.getpixel((1,1)))).getbbox();return i.crop(b) if b else i
def hoja(name,titulo,rows,sc=2,noche=False):
  bg=(24,26,46) if noche else (240,236,226);fg=(236,236,246) if noche else (30,30,40)
  cells=[[crop(i) for i in r[1]] for r in rows];cw=max(i.width for r in cells for i in r)*sc+10;W=150+cw*8+30
  hs=[max(i.height for i in r)*sc+16 for r in cells];im=Image.new('RGB',(W,sum(hs)+110),bg);d=ImageDraw.Draw(im)
  d.text((16,14),titulo,font=F(24),fill=fg);d.text((150+cw*2-40,58),'ANTES',font=F(15),fill=fg);d.text((150+cw*6-10,58),'CON EL KIT',font=F(15),fill=fg)
  for k in range(8):d.text((150+k*cw+(30 if k>=4 else 0)+cw//2-8,82),'N%d'%(k%4+1),font=F(13,False),fill=fg)
  y=104
  for (lab,_),r,h in zip(rows,cells,hs):
    d.text((12,y+h//2-8),lab,font=F(14),fill=fg)
    for k,i in enumerate(r):
      j=i.resize((i.width*sc,i.height*sc),Image.NEAREST);cell=Image.new('RGB',j.size,i.getpixel((0,0)));im.paste(j,(150+k*cw+(30 if k>=4 else 0)+(cw-j.width)//2,y+h-8-j.height))
    y+=h
  im.save(CAP+name);print('ok',name,im.size)
FL={'edificio':[3,4,5,6],'ladrillo':[3,4,5,6],'casaf':[1,1,2,2],'mixto':[4,4,5,5]}
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000)
    async def get(lst,rib=False,nb=0):return [img(u) for u in await pg.evaluate("__dd.ribSheet("+json.dumps(lst)+","+('true' if rib else 'false')+","+str(nb)+")")]
    async def fam(ks,rib=False,nb=0):
      rows=[]
      for k in ks:
        l=[[k,L,FL.get(k,[0]*4)[L-1],3] for L in (1,2,3,4)]
        await pg.evaluate("__dd.setKit(false)");a=await get(l,rib,nb);await pg.evaluate("__dd.setKit(true)");c=await get(l,rib,nb);rows.append((k,a+c))
      return rows
    hoja('hoja-kit-vivienda.png','Kit de nivel · vivienda (Cañón)',await fam(['edificio','ladrillo','casaf','mixto']))
    hoja('hoja-kit-negocios.png','Kit de nivel · negocios y servicios (Cañón)',await fam(['cafe','resto','bar','tomates','escuela','clinica']))
    hoja('hoja-kit-ribera.png','Kit de nivel · Ribera (verde agua)',await fam(['edificio','ladrillo','cafe'],True))
    hoja('hoja-kit-noche.png','Kit de nivel · de noche',await fam(['edificio','ladrillo','cafe'],False,1),noche=True)
    # mapa alejado
    ctx=await b.new_context(viewport={'width':1100,'height':700});await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.guia','1')}")
    m=await ctx.new_page();await m.goto('file://'+BUILD+'/arnes.html');await m.wait_for_timeout(1200);await m.click('#tcont',force=True);await m.wait_for_timeout(1200)
    await m.evaluate("__dd.setPause(true);__dd.S.clock=__dd.DAY*.4;for(const s of ['#dialog','#needs','#pausebar'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
    for v,n in ((False,'antes'),(True,'kit')):
      await m.evaluate(f"__dd.setKit({'true' if v else 'false'})");await m.wait_for_timeout(2500);await m.screenshot(path=CAP+f'hoja-kit-mapa-{n}.png',clip={'x':0,'y':60,'width':1040,'height':470})
    await b.close()
asyncio.run(main())
