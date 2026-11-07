"""Tráfico de las avenidas (v69): nadie se encima (ni coches con camiones), el orden de dibujo es el correcto en los 4 giros,
los coches se cambian de carril para rebasar, los camiones se paran en sus paradas, hay luces de freno y todos se detienen
ante la gente en el paso peatonal. Guarda capturas en build/capturas/v-*.png. Uso: python3 tests/trafico.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,io
from PIL import Image
from playwright.async_api import async_playwright
ESC=open(ROOT+'/tests/datos/escena-muestra.js').read()
CAP=BUILD+'/capturas/'
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
# cuántos pares se enciman: mismo sentido, carriles que se tocan y cajas que se tocan a lo largo
SOLAPE="""(()=>{const C=__dd.CARS,W=c=>c.type?.24:.2;let n=0;const st={chg:0,dw:0,brk:0};for(const c of C){if(c.chg)st.chg++;if(c.dw>0)st.dw++;if(c.brk)st.brk++}
  for(let i=0;i<C.length;i++)for(let j=i+1;j<C.length;j++){const a=C[i],b=C[j];if(a.row!==b.row||a.dir!==b.dir)continue;if(Math.abs(a.lat-b.lat)>=(W(a)+W(b))/2-.005)continue;
    const d=Math.abs(((a.x-b.x+15)%30+30)%30-15);if(d<(a.L+b.L)/2-.03)n++}return [n,st]})()"""
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    await pg.evaluate("__dd.S.clock=__dd.DAY*.3;__dd.S.ev=null;for(const s of ['#dialog','#needs','#pausebar'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
    # 1) 40 s de tráfico: nada encimado, orden de dibujo bien, cambios de carril, paradas, frenos
    sol=0;malo=0;bk=0;chg=0;dw=0;brk=0
    for k in range(160):
      if k%40==0:await pg.evaluate("__dd.turn(1)")
      r=await pg.evaluate(SOLAPE);sol+=r[0];chg=max(chg,r[1]['chg']);dw=max(dw,r[1]['dw']);brk=max(brk,r[1]['brk'])
      o=await pg.evaluate("__dd.vord()");malo+=o[0];bk+=o[1]
      await pg.wait_for_timeout(250)
    print('encimados',sol,'orden',malo,bk,'cambios',chg,'paradas',dw,'frenos',brk)
    ok(sol==0,f'ningún vehículo se encima con otro en 40 s ({sol})')
    ok(malo==0 and bk==0,f'orden de dibujo correcto en los 4 giros ({malo}, {bk})')
    ok(chg>0,'los coches se cambian de carril');ok(dw>0,'los camiones se paran en sus paradas');ok(brk>0,'luces de freno')
    # 2) capturas de cerca: de día y de noche, junto a un camión
    await pg.evaluate("__dd.zoomAt(4,640,400)");await pg.wait_for_timeout(600)
    for nm,ph in (('dia',.3),('noche',.85)):
      await pg.evaluate(f"__dd.S.clock=__dd.DAY*{ph}")
      for k in range(60):
        r=await pg.evaluate("(()=>{const C=__dd.CARS;for(const c of C){if(c.type||!c.chg)continue;for(const b of C){if(b.type&&b.row===c.row&&b.dir===c.dir&&Math.abs(b.x-c.x)<1.4)return [b.x,b.row]}}return null})()")
        if r:break
        await pg.wait_for_timeout(250)
      if r:
        await pg.evaluate(f"__dd.camTo(__dd.idx({int(r[0])},{r[1]}),.01)");await pg.wait_for_timeout(450)
        im=Image.open(io.BytesIO(await pg.screenshot()));im.crop((440,300,840,500)).resize((1200,600),Image.NEAREST).save(CAP+f'v-{nm}.png')
    await ctx.close()
    # 3) paso peatonal: alguien parado en el cruce de la avenida y nadie pasa por encima
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    await pg.evaluate(ESC);await pg.evaluate("__dd.S.pop={fam:900,pro:600,est:500};__dd.S.v=2000;__dd.S.ribCard=1;__dd.S.vozTip=1;__dd.S.clock=__dd.DAY*.3;__dd.S.ev=null;__dd.recompute()")
    X=4;await pg.evaluate(f"(()=>{{const S=__dd.S,I=__dd.idx;for(const y of [6,8])S.g[I({X},y)]={{k:'calle',s:1,b:0}};__dd.recompute()}})()");await pg.wait_for_timeout(1500)
    ok(await pg.evaluate(f"__dd.W.length>0"),'hay gente para la prueba del cruce')
    await pg.evaluate(f"(()=>{{const w=__dd.W[0];w.st='chat';w.t=999;w.X={X}+.5;w.Y=7.5;w.cx={X}+.5;w.cy=7.5}})()")
    await pg.wait_for_timeout(1800)
    cruzan=await pg.evaluate(f"""new Promise(res=>{{const C=__dd.CARS.filter(c=>c.row===7),prev=new Map(C.map(c=>[c,c.x]));let n=0,stop=0;const t0=performance.now();
      const f=()=>{{const w=__dd.W[0];if(w){{w.st='chat';w.t=999;w.X={X}+.5;w.Y=7.5}}for(const c of C){{const a=prev.get(c),b=c.x;if(Math.abs(a-b)<2&&(a-({X}+.5))*(b-({X}+.5))<0)n++;prev.set(c,b);if(c.v<.05&&!c.type&&Math.abs(c.x-({X}+.5))<1.5)stop++}}
        if(performance.now()-t0<6000)requestAnimationFrame(f);else res([n,stop])}};f()}})""")
    print('cruce',cruzan);ok(cruzan[0]==0,f'nadie pasa por el cruce mientras hay gente ({cruzan[0]})');ok(cruzan[1]>0,'los coches se detienen antes del cruce')
    await pg.evaluate(f"__dd.zoomAt(4,640,400)");await pg.wait_for_timeout(500);await pg.evaluate(f"__dd.camTo(__dd.idx({X},7),.01)");await pg.wait_for_timeout(800)
    im=Image.open(io.BytesIO(await pg.screenshot()));im.crop((440,300,840,500)).resize((1200,600),Image.NEAREST).save(CAP+'v-cruce.png')
    print('errores',errs[:4]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'))
  sys.exit(1 if fallas else 0)
asyncio.run(main())
