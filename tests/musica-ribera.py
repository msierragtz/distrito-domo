"""Música de la Ribera (v71): cada pieza (bossa, bolero, samba-jazz y latin jazz) se toca completa en un contexto de audio
fuera de línea, sin errores ni compases mal sumados, sin saturar y con un volumen parecido al del Domo; en el Domo la
música sigue siendo la misma. MUESTRAS=1 guarda un mp3 de cada pieza en build/musica/ (MUESTRAS_SEG, 75 por omisión).
Uso: python3 tests/musica-ribera.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,math,json,base64,subprocess
from playwright.async_api import async_playwright
OUT=BUILD+'/musica/';os.makedirs(OUT,exist_ok=True)
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
db=lambda x:20*math.log10(max(x,1e-9))
ST={'night':0,'sat':.85,'phase':3,'vec':2500,'kiosk':False,'red':False,'ev':None}
RIB=[('orilla','bossa',{}),('luna','bolero',{'night':.85}),('malecon','samba',{}),('puente','latin',{'phase':4})]
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page();warn=[]
    pg.on('console',lambda m:m.type in('warning','error') and ('compás' in m.text or 'acorde' in m.text or 'Error' in m.text) and warn.append(m.text));pg.on('pageerror',lambda e:warn.append(str(e)))
    async def go(dist):
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.evaluate(f"localStorage.setItem('distritoDomo.distrito','{dist}')");await pg.reload();await pg.wait_for_timeout(800)
    async def R(tune,sec,st,wav=None):
      return await pg.evaluate(f"__dd.musicRender({sec},{json.dumps({'st':{**ST,**st},'tune':tune})},{json.dumps(wav)})")
    # 1) Domo: la de siempre
    await go('domo');d=await R('tarde',20,{});print('Domo',d['name'],'%.1f dB'%db(d['rms']))
    ok(d['name']=='Tarde en el Domo' and not d['errs'],'en el Domo suena su jazz de siempre')
    # 2) Ribera: cada pieza
    await go('ribera');ref=db(d['rms'])
    for tu,feel,st in RIB:
      r=await R(tu,20,st);lv=db(r['rms']);print(feel,r['name'],'%.1f dB, pico %.2f'%(lv,r['peak']),r['errs'][:1])
      ok(not r['errs'],f'{r["name"]}: se toca sin errores');ok(r['peak']<.98,f'{r["name"]}: no satura ({r["peak"]:.2f})');ok(abs(lv-ref)<4.5,f'{r["name"]}: volumen parecido al del Domo ({lv-ref:+.1f} dB)')
    ok(not warn,f'sin avisos ({warn[:2]})')
    # 3) muestras para escuchar
    if os.environ.get('MUESTRAS'):
      seg=int(os.environ.get('MUESTRAS_SEG','75'))
      for tu,feel,st in RIB:
        r=await R(tu,seg,st,{'gain':1.8});w=OUT+tu+'.wav';open(w,'wb').write(base64.b64decode(r['wav']))
        subprocess.run(['ffmpeg','-y','-loglevel','error','-i',w,'-af','afade=t=out:st=%d:d=4'%(seg-5),'-b:a','160k',OUT+tu+'.mp3'],check=True);os.remove(w);print('muestra',OUT+tu+'.mp3')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'))
  sys.exit(1 if fallas else 0)
asyncio.run(main())
