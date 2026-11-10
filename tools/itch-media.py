"""Portada y capturas para la página de itch.io (Distrito Sierra), sacadas del juego real con la ciudad de 2,600 vecinos.
Uso: python3 tests/arnes.py && python3 tools/itch-media.py → dist/itch-media/portada.png (630×500, y @2x) y capturas-*.png"""
import os,sys,io,json,asyncio;R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));sys.path.insert(0,R+'/tests');from comun import BUILD,lanzar
from PIL import Image,ImageDraw,ImageFilter
from playwright.async_api import async_playwright
OUT=R+'/dist/itch-media/';os.makedirs(OUT,exist_ok=True)
# letra de pixel 5×7 propia (no dependemos de fuentes de internet)
G={'A':["01110","10001","10001","11111","10001","10001","10001"],'C':["01111","10000","10000","10000","10000","10000","01111"],'D':["11110","10001","10001","10001","10001","10001","11110"],
'E':["11111","10000","10000","11110","10000","10000","11111"],'I':["11111","00100","00100","00100","00100","00100","11111"],'L':["10000","10000","10000","10000","10000","10000","11111"],
'M':["10001","11011","10101","10101","10001","10001","10001"],'N':["10001","11001","10101","10011","10001","10001","10001"],'O':["01110","10001","10001","10001","10001","10001","01110"],
'R':["11110","10001","10001","11110","10100","10010","10001"],'S':["01111","10000","10000","01110","00001","00001","11110"],'T':["11111","00100","00100","00100","00100","00100","00100"],
'U':["10001","10001","10001","10001","10001","10001","01110"],'V':["10001","10001","10001","10001","10001","01010","00100"],'Y':["10001","10001","01010","00100","00100","00100","00100"],
'G':["01111","10000","10000","10111","10001","10001","01111"],'P':["11110","10001","10001","11110","10000","10000","10000"],'Ó':["00010","01110","10001","10001","10001","10001","01110"],
',':["00000","00000","00000","00000","00000","00100","01000"],'.':["00000","00000","00000","00000","00000","00000","00100"],' ':["000","000","000","000","000","000","000"],'·':["000","000","000","010","000","000","000"]}
def texto(d,x,y,s,px,col,sombra=None,gap=1):
  def run(ox,oy,c):
    cx=ox
    for ch in s:
      g=G[ch]
      for r,row in enumerate(g):
        for k,b in enumerate(row):
          if b=='1':d.rectangle([cx+k*px,oy+r*px,cx+(k+1)*px-1,oy+(r+1)*px-1],fill=c)
      cx+=(len(g[0])+gap)*px
    return cx-ox-gap*px
  if sombra:
    for dx,dy in sombra[1]:run(x+dx,y+dy,sombra[0])
  return run(x,y,col)
def ancho(s,px,gap=1):return sum((len(G[c][0])+gap)*px for c in s)-gap*px
big=json.loads(open(R+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
HIDE="document.body.classList.add('foto');dispatchEvent(new Event('resize'));for(const e of document.body.querySelectorAll('*')){if(e.id==='cv'||e.contains(document.getElementById('cv')))continue;e.style.visibility='hidden'}"
async def shot(b,w,h,clock,zoom,ti,name):
  ctx=await b.new_context(viewport={'width':w,'height':h},device_scale_factor=2)
  await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.guia','1');localStorage.setItem('distritoDomo.opciones','{\"season\":\"none\"}')}")
  pg=await ctx.new_page();await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(800)
  i=await pg.evaluate(f"(()=>{{let i=__dd.S.g.findIndex(t=>t.k==='{ti}');if(i<0)i=__dd.S.g.findIndex(t=>t.k==='rasca'||t.k==='torre');return i<0?__dd.idx(15,15):i}})()")
  await pg.evaluate(f"__dd.setPause(true);__dd.S.clock=__dd.DAY*{clock};__dd.zoomAt({zoom});"+HIDE);await pg.wait_for_timeout(600)
  await pg.evaluate(f"__dd.camTo({i},.01,{h*.12})");await pg.evaluate("__dd.setPause(false)");await pg.wait_for_timeout(3500);await pg.evaluate("__dd.setPause(true)");await pg.wait_for_timeout(400)
  await pg.screenshot(path=OUT+name);await ctx.close();return Image.open(OUT+name).convert('RGB')
async def main():
  async with async_playwright() as p:
    b=await lanzar(p)
    base=await shot(b,630,500,.58,2,'domo','_portada-fondo.png')
    for n,(c,z,t) in enumerate([(.36,1.4,'domo'),(.6,2,'rasca'),(.82,1.6,'domo')],1):await shot(b,960,540,c,z,t,f'captura-{n}.png')
    await b.close()
  W,H=base.size;im=base.copy();d=ImageDraw.Draw(im,'RGBA')
  # franja oscura arriba para el título y abajo para el lema, con degradado
  for y in range(int(H*.42)):a=int(215*(1-y/(H*.42))**1.4);d.line([(0,y),(W,y)],fill=(31,37,64,a))
  for y in range(int(H*.22)):a=int(200*(y/(H*.22))**1.6);d.line([(0,H-int(H*.22)+y),(W,H-int(H*.22)+y)],fill=(31,37,64,a))
  # logo: el arco naranja
  cx=W//2;r=46;d.arc([cx-r,58-r+40,cx+r,58+r+40],180,360,fill=(242,106,33),width=16)
  sh=((31,37,64),[(6,6),(6,0),(0,6)])
  for s,y,px in (('DISTRITO',130,14),('SIERRA',250,22)):texto(d,(W-ancho(s,px))//2,y,s,px,(255,244,224),sh)
  sub='SANTA CATARINA · N.L.';texto(d,(W-ancho(sub,5))//2,H-62,sub,5,(255,201,166),((31,37,64),[(3,3)]))
  im.save(OUT+'portada@2x.png');im.resize((630,500),Image.LANCZOS).save(OUT+'portada.png');os.remove(OUT+'_portada-fondo.png')
  print('listo',os.listdir(OUT))
asyncio.run(main())
