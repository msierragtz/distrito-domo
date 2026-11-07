"""Hoja de aprobación v72: casa de fraccionamiento, usos mixtos, cicloestación, banco y gasolinera (niveles 1 a 4, en el
Domo y en la Ribera) y los especiales de la Ribera (parroquia, hotel y alberca, 2×2), de día y de noche.
Uso: python3 tests/hoja-v72.py  → build/capturas/hoja-v72-*.png"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,io,base64,json
from PIL import Image,ImageDraw,ImageFont,ImageChops
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/'
F=lambda sz,b=False:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if b else '')+'.ttf',sz)
def img(u):return Image.open(io.BytesIO(base64.b64decode(u.split(',')[1]))).convert('RGB')
def caja(lst):
  bx=None
  for s in lst:
    d=ImageChops.difference(s,Image.new('RGB',s.size,s.getpixel((1,1)))).convert('L').point(lambda v:255 if v>6 else 0).getbbox()
    if d:bx=d if bx is None else (min(bx[0],d[0]),min(bx[1],d[1]),max(bx[2],d[2]),max(bx[3],d[3]))
  return (max(0,bx[0]-8),max(0,bx[1]-8),bx[2]+8,min(lst[0].height,bx[3]+4))
def hoja(nombre,titulo,sub,filas,sc=2.2,noche=False):
  """filas: [(título, [(etiqueta, imagen), ...], separador_tras)]"""
  bg=(24,26,46) if noche else (246,242,232);fg=(236,236,246) if noche else (40,36,30);mute=(150,150,170) if noche else (125,115,102);pad=32;gap=16
  rows=[]
  for tt,cells,sep in filas:
    mh=max(c[1].height for c in cells);pad_=lambda im:im if im.height==mh else (lambda n:(n.paste(im,(0,mh-im.height)),n)[1])(Image.new('RGB',(im.width,mh),im.getpixel((1,1))))
    cells=[(l,pad_(i)) for l,i in cells];bx=caja([c[1] for c in cells]);ims=[c[1].crop(bx) for c in cells];ims=[i.resize((int(i.width*sc),int(i.height*sc)),Image.NEAREST) for i in ims];rows.append((tt,cells,ims,sep))
  cw=max(max(i.width for i in r[2]) for r in rows);ncol=max(len(r[2]) for r in rows);W=pad*2+ncol*cw+(ncol-1)*gap+max(r[3] or 0 for r in rows)*40
  H=130+sum(max(i.height for i in r[2])+92 for r in rows);im=Image.new('RGB',(W,H),bg);d=ImageDraw.Draw(im)
  d.text((pad,24),titulo,font=F(34,True),fill=fg);d.text((pad,72),sub,font=F(18),fill=mute);y=120
  for tt,cells,ims,sep in rows:
    h=max(i.height for i in ims);d.text((pad,y),tt,font=F(20,True),fill=fg);y+=34;x=pad
    for k,((lab,_),i) in enumerate(zip(cells,ims)):
      if sep and k==sep:lx=x-gap//2+12;d.line((lx,y-26,lx,y+h+30),fill=(70,70,96) if noche else (214,206,190),width=2);x+=40
      cell=Image.new('RGB',(cw,i.height),_.getpixel((1,1)));cell.paste(i,((cw-i.width)//2,0));im.paste(cell,(x,y+h-i.height))
      t1,_,t2=lab.partition('|');d.text((x+2,y+h+8),t1,font=F(13,True),fill=(43,179,163) if 'Ribera' in t2 else (242,106,33) if 'Domo' in t2 else fg);d.text((x+2+len(t1)*9+8,y+h+8),t2,font=F(14),fill=fg)
      x+=cw+gap
    y+=h+58
  im.save(CAP+nombre);print('ok',CAP+nombre,im.size)
NV={'casaf':['Obra gris','Pintada con cochera','Con terraza','Remodelada'],'mixto':['Local con deptos.','Usos mixtos','Con balcones','De diseño'],
    'ciclo':['Cicloestación','Con techo','Con taller','Techo solar'],'banco':['Cajero automático','Sucursal','Con autobanco','Torre financiera'],
    'gas':['Bomba','Gasolinera','Con tiendita','Con cargadores']}
FLOORS={'casaf':[1,1,2,2],'mixto':[4,4,5,5]}
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='warning' and errs.append(m.text))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200)
    async def get(lst,rib,nb=0):return [img(u) for u in await pg.evaluate("__dd.ribSheet("+json.dumps(lst)+","+('true' if rib else 'false')+","+str(nb)+")")]
    filas=[]
    for k,tt in (('casaf','Casa de fraccionamiento (vivienda)'),('mixto','Usos mixtos (vivienda con local abajo)')):
      d=await get([[k,L,FLOORS[k][L-1],3] for L in (1,2,3,4)],False);r=await get([[k,L,FLOORS[k][L-1],4] for L in (1,2,3,4)],True)
      filas.append((tt,[(f'N{L}|{NV[k][L-1]} · Domo',i) for L,i in zip((1,2,3,4),d)]+[(f'N{L}|Ribera',i) for L,i in zip((1,2,3,4),r)],4))
    hoja('hoja-v72-vivienda.png','Vivienda nueva','Izquierda: Distrito Domo · derecha: Distrito Ribera (mismo edificio, colores del barrio).',filas,sc=2.6)
    # variedad: casas y locales
    v=await get([['casaf',2,1,s] for s in range(4)],False)+await get([['casaf',2,2,s] for s in range(6)],True)
    m=await get([['mixto',2,4,s*2] for s in range(5)],False)
    hoja('hoja-v72-variedad.png','Variedad','Casas en el Domo (4 colores) y en la Ribera (6), y los 5 locales de usos mixtos: farmacia, papelería, lavandería, panadería y tortillería.',
      [('Casas de fraccionamiento',[(f'|Domo',i) for i in v[:4]]+[('|Ribera',i) for i in v[4:]],4),('Usos mixtos: un local distinto por edificio',[(f'|{n}',i) for n,i in zip(['farmacia','papelería','lavandería','panadería','tortillería'],m)],0)],sc=1.8)
    filas=[]
    for k,tt in (('ciclo','Cicloestación (servicio)'),('banco','Banco (negocio)'),('gas','Gasolinera (negocio)')):
      d=await get([[k,L,0,1] for L in (1,2,3,4)],False);r=await get([[k,L,0,1] for L in (1,2,3,4)],True)
      if k=='banco':filas.append((tt,[(f'N{L}|{NV[k][L-1]}',i) for L,i in zip((1,2,3,4),d)],0))
      else:filas.append((tt,[(f'N{L}|{NV[k][L-1]} · Domo',i) for L,i in zip((1,2,3,4),d)]+[(f'N{L}|Ribera',i) for L,i in zip((1,2,3,4),r)],4))
    hoja('hoja-v72-negocios.png','Servicios y negocios nuevos','Cicloestación y gasolinera llevan el color de cada distrito (naranja en el Domo, verde agua en la Ribera); el banco es igual en los dos.',filas)
    E=[]
    for k,tt in (('hotel','Hotel boutique · opción A: casona-hacienda'),('hotel2','Hotel boutique · opción B: art déco junto al río')):
      dd=await get([[k,1,0,5]],True,0);nn=await get([[k,1,0,5]],True,1);E.append((tt,[('|de día',dd[0]),('|de noche',nn[0])],0))
    hoja('hoja-v72-hotel.png','Hotel boutique: dos opciones','A: casona de dos pisos con patio y teja · B: torre art déco con letrero.',E,sc=2.3)
    # de noche: todo lo de 4 niveles en su nivel más alto
    nd=await get([[k,4,FLOORS.get(k,[0]*4)[3],3] for k in ('casaf','mixto','ciclo','banco','gas')],False,1);nr=await get([[k,4,FLOORS.get(k,[0]*4)[3],4] for k in ('casaf','mixto','ciclo','banco','gas')],True,1)
    hoja('hoja-v72-noche.png','De noche','Nivel 4 de cada uno, en el Domo y en la Ribera.',[('Domo',[(f'|{n}',i) for n,i in zip(['casa','usos mixtos','cicloestación','banco','gasolinera'],nd)],0),('Ribera',[(f'|{n}',i) for n,i in zip(['casa','usos mixtos','cicloestación','banco','gasolinera'],nr)],0)],noche=True)
    print('errores',errs[:5]);await b.close()
asyncio.run(main())
