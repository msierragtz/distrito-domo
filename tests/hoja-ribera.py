"""Hoja de aprobación (v70): vivienda y negocios del Domo contra su versión de la Ribera, niveles 1 a 4, de día y de noche.
Uso: python3 tests/hoja-ribera.py  → build/capturas/hoja-vivienda.png, hoja-negocios.png, hoja-noche.png"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,io,base64,json
from PIL import Image,ImageDraw,ImageFont,ImageChops
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/'
F=lambda sz,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if b else '')+'.ttf',sz)
DOMO={'edificio':['Departamentos','Remodelados','Lofts','Residencial de lujo'],'ladrillo':['Ladrillo','Remodelado','Lofts','Boutique de ladrillo'],'torre':['Torre Caliza','Plus','Premium','Sky'],
  'cafe':['Café de olla','Cafetería','Especialidad','Brunch'],'resto':['Barbacoa','Lonchería','Hamburguesas','De autor'],'bar':['Micheladas','Cantina','Mezcalería','Azotea'],
  'paleteria':['Carrito','De barrio','Artesanal','Heladería'],'tomates':['Tomates','Market','Market','Market'],'oficinas':['Oficinas','Coworking','Corporativo','Verde']}
TIT={'edificio':'Edificio  →  Casas de la Ribera','ladrillo':'Edificio de ladrillo  →  Bodegas del río','torre':'Torre  →  Torre Malecón','cafe':'Café','resto':'Restaurante  →  mariscos y asadero',
  'bar':'Bar  →  depósito, cervecería y salón cumbiero','paleteria':'Paletería  →  aguas frescas y nevería','tomates':'Tomates  →  Mercadito de la Ribera','oficinas':'Oficinas  →  coworking en bodega'}
FL={'edificio':5,'ladrillo':5,'torre':18}
SD_,SR_=1.25,2.5
def img(u):return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def caja(lst):
  # caja común de la fila: todo lo que no es el fondo de la celda
  bx=None
  for s in lst:
    bg=s.getpixel((1,1))
    d=ImageChops.difference(s,Image.new('RGB',s.size,bg)).convert('L').point(lambda v:255 if v>6 else 0).getbbox()
    if d:bx=d if bx is None else (min(bx[0],d[0]),min(bx[1],d[1]),max(bx[2],d[2]),max(bx[3],d[3]))
  return (max(0,bx[0]-8),max(0,bx[1]-8),bx[2]+8,bx[3]+4)
def hoja(nombre,filas,dom,rib,riblv,titulo,sub,noche=False):
  # filas: [(k,[domo L1..4],[ribera L1..4])]; el Domo chico de referencia, la Ribera grande
  gap=16;pad=32;mid=40;bg=(24,26,46) if noche else (246,242,232);fg=(236,236,246) if noche else (40,36,30);mute=(150,150,170) if noche else (125,115,102)
  rows=[]
  for k,dd,rr in filas:
    bx=caja(dd+rr);cw=bx[2]-bx[0];ch=bx[3]-bx[1];rows.append((bx,cw,ch))
  cwD=max(int(r[1]*SD_) for r in rows);cwR=max(int(r[1]*SR_) for r in rows);cwR=max(cwR,230)
  W=pad*2+cwD*4+gap*3+mid+cwR*4+gap*3;H=150+sum(int(r[2]*SR_)+92 for r in rows)
  im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
  d.text((pad,24),titulo,font=F(34,True),fill=fg);d.text((pad,70),sub,font=F(18),fill=mute)
  xR=pad+cwD*4+gap*3+mid;d.text((pad,112),'DISTRITO DOMO (como está hoy)',font=F(15,True),fill=mute);d.text((xR,112),'DISTRITO RIBERA (propuesta)',font=F(15,True),fill=(43,179,163))
  y=146
  for (k,dd,rr),(bx,cw,ch) in zip(filas,rows):
    h=int(ch*SR_)
    d.text((pad,y),TIT[k],font=F(20,True),fill=fg);y+=34
    for side,lst,x0,sc,cwX in ((0,dd,pad,SD_,cwD),(1,rr,xR,SR_,cwR)):
      for i,s in enumerate(lst):
        c=s.crop(bx);s2=c.resize((int(c.width*sc),int(c.height*sc)),Image.NEAREST);x=x0+i*(cwX+gap)
        cell=Image.new('RGB',(cwX,s2.height),s.getpixel((1,1)));cell.paste(s2,((cwX-s2.width)//2,0));im.paste(cell,(x,y+h-s2.height))
        lab=(riblv[k][i] if side else '');d.text((x+2,y+h+8),f'N{i+1}',font=F(13,True),fill=(43,179,163) if side else mute);d.text((x+30,y+h+8),lab,font=F(14 if side else 12,side==1),fill=fg if side else mute)
    lx=xR-mid//2-gap//2;d.line((lx,y-30,lx,y+h+30),fill=(70,70,96) if noche else (214,206,190),width=2)
    y+=h+58
  im.save(CAP+nombre);print('ok',CAP+nombre,im.size)
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);ctx=await b.new_context(viewport={'width':900,'height':700});pg=await ctx.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='warning' and errs.append(m.text))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200)
    async def get(ks,rib,nb=0):
      lst=[[k,L,FL.get(k,0),7] for k in ks for L in (1,2,3,4)];u=await pg.evaluate(f"__dd.ribSheet({lst!r},{str(rib).lower()},{nb})".replace("'",'"'))
      return {k:[img(x) for x in u[i*4:i*4+4]] for i,k in enumerate(ks)}
    V=['edificio','ladrillo','torre'];NG=['cafe','resto','bar','paleteria','tomates','oficinas']
    names=await pg.evaluate("__dd.ribNames()")
    for ks,nm,tt in ((V,'hoja-vivienda.png','Vivienda en la Ribera'),(NG,'hoja-negocios.png','Negocios en la Ribera')):
      dd=await get(ks,False);rr=await get(ks,True)
      hoja(nm,[(k,dd[k],rr[k]) for k in ks],DOMO,None,names,tt,'Mismo costo, mismos pisos y niveles; solo cambia cómo se ven y cómo se llaman.')
    # colores: las cuatro combinaciones de las casas (N2) y los tres ladrillos de las bodegas (N2)
    u=await pg.evaluate("__dd.ribSheet("+json.dumps([['edificio',2,5,k] for k in (4,5,6,7)]+[['ladrillo',2,5,k] for k in (3,4,5)])+",true,0)")
    ims=[img(x) for x in u];bx=caja(ims);ims=[i.crop(bx) for i in ims];ims=[i.resize((int(i.width*2),int(i.height*2)),Image.NEAREST) for i in ims]
    W=sum(i.width for i in ims)+16*8+60;H=max(i.height for i in ims)+110;im=Image.new('RGB',(W,H),(246,242,232));d=ImageDraw.Draw(im)
    d.text((32,20),'Variedad de color: casas (4 combinaciones) y bodegas (3 ladrillos)',font=F(22,True),fill=(40,36,30))
    x=32
    for k,i in enumerate(ims):
      if k==4:x+=28
      im.paste(i,(x,H-20-i.height));x+=i.width+16
    im.save(CAP+'hoja-colores.png');print('ok',CAP+'hoja-colores.png',im.size)
    # noche: solo la Ribera, todo junto
    rr=await get(V+NG,True,1);dd=await get(V+NG,False,1)
    hoja('hoja-noche.png',[(k,dd[k],rr[k]) for k in V+NG],DOMO,None,names,'De noche','Ventanas, foquitos y letreros encendidos.',True)
    print('errores',errs[:5]);await b.close()
asyncio.run(main())
