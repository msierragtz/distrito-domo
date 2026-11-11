"""v85: Ribera (Centro Cultural → Cine, arranque arriba de 55%, plusvalía por vista al río) y el nombramiento del Municipio.
Uso: python3 tests/arnes.py && python3 tests/v85.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/';os.makedirs(CAP,exist_ok=True)
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    # 1) Ribera
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
    await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.distrito','ribera');localStorage.setItem('distritoDomo.riberaBono','19000');localStorage.setItem('distritoDomo.guia','1')}")
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200)
    ok(await pg.evaluate("__dd.DIST")=='ribera','arranca en Ribera')
    sat=await pg.evaluate("__dd.newG()");ok(sat>=.55,f'la Ribera arranca arriba de 55% de satisfacción ({sat:.2f})')
    d=await pg.evaluate("({h:!!__dd.DEFS.cultura.hidden,u:__dd.DEFS.cultura.unlock,n:__dd.DEFS.cultura.name,k:!!__dd.DEFS.kiosco.hidden})")
    ok(not d['h'] and d['u']==2000 and d['n']=='Centro Cultural Ribera','el Centro Cultural Ribera existe y se gana a los 2,000 vecinos')
    ok(d['k'],'los demás trofeos del Cañón siguen fuera de la Ribera')
    m=await pg.evaluate("__dd.mis('estreno')");ok('Centro Cultural Ribera' in m['txt'],'el encargo del Cine pide el Centro Cultural Ribera: '+m['txt'])
    # cumplirlo: centro cultural y 3 negocios en nivel 3
    r=await pg.evaluate("""(()=>{const D=__dd,S=D.S,g=S.g;const libres=[];g.forEach((t,i)=>{if(t.k==='lote')libres.push(i)});
      g[libres[0]]={k:'cultura',s:1,b:0,ok:true};for(let k=1;k<=3;k++)g[libres[k]]={k:'cafe',s:k,b:0,ok:true,lv:3};return D.mis('estreno')})()""")
    ok(r['prog']==r['goal']==4,f'con el Centro Cultural y 3 negocios en nivel 3 el encargo se cumple ({r["prog"]} de {r["goal"]})')
    # vista al río: una casilla junto al río vale más que sin ella
    v=await pg.evaluate("""(()=>{const D=__dd,S=D.S;D.newG();const i=S.g.findIndex((t,j)=>t.k==='lote'&&S.g[j+1]&&S.g[j+1].k==='rio');D.rioval([0,3]);D.newG();
      const a=D.stats.VAL[i];D.rioval([.05,3]);D.newG();const b=D.stats.VAL[i];return [a,b]})()""")
    ok(v[1]>v[0]+.05,f'vivir junto al río sube la plusvalía ({v[0]:.2f} → {v[1]:.2f})')
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(900)
    ok(await pg.evaluate("document.getElementById('oficio').hidden"),'en la Ribera no sale el nombramiento (ya lo tienes del Cañón)')
    ok('amplía tu nombramiento' in (await pg.evaluate("__dd.cur")),'al llegar a la Ribera el Municipio amplía el nombramiento')
    await ctx.close()
    # 2) nombramiento en una partida nueva del Cañón
    for name,kw in (('esc',dict(viewport={'width':1280,'height':800})),('cel',dict(**p.devices['iPhone 13']))):
      ctx=await b.new_context(**kw);pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)))
      await ctx.add_init_script("window.__ofAuto=false")
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200)
      ok(not await pg.is_visible('#pname'),f'{name}: quien empieza de cero no escribe su nombre en la pantalla de inicio')
      await pg.click('#tcont',force=True);await pg.wait_for_timeout(800)
      ok(await pg.is_visible('#oficio'),f'{name}: sale el nombramiento')
      ok(await pg.evaluate("__dd.TITLE!==false&&!document.getElementById('oficio').hidden"),f'{name}: el juego espera a que firmes')
      ok((await pg.text_content('#ofOk')).strip()=='Aceptar el cargo','sin nombre, el botón dice «Aceptar el cargo»')
      await pg.fill('#ofName','Mauricio');ok((await pg.text_content('#ofOk')).strip()=='Firmar y aceptar el cargo','con nombre, «Firmar y aceptar el cargo»')
      await pg.screenshot(path=CAP+f'oficio-{name}.png',full_page=True)
      bw=await pg.evaluate("document.documentElement.scrollWidth<=innerWidth");ok(bw,f'{name}: sin desplazamiento horizontal')
      await pg.click('#ofOk',force=True);await pg.wait_for_timeout(500)
      ok(await pg.evaluate("document.getElementById('oficio').classList.contains('firmado')"),f'{name}: cae el sello')
      await pg.screenshot(path=CAP+f'oficio-{name}-sello.png')
      await pg.wait_for_timeout(2200)
      r=await pg.evaluate("[document.getElementById('oficio').hidden,__dd.S.name,__dd.cur,localStorage.getItem('distritoDomo.nombre')]")
      ok(r[0] and r[1]=='Mauricio' and r[3]=='Mauricio',f'{name}: al firmar empieza el juego con tu nombre')
      ok(r[2].startswith('Ya es oficial, Mauricio'),f'{name}: primer mensaje: {r[2][:60]}')
      # al volver otro día no se repite
      await pg.reload();await pg.wait_for_timeout(1200)
      ok(await pg.is_visible('#pname'),f'{name}: al volver, la pantalla de inicio ya muestra tu nombre')
      await pg.click('#tcont',force=True);await pg.wait_for_timeout(800)
      ok(await pg.evaluate("document.getElementById('oficio').hidden"),f'{name}: «Continuar partida» no repite el nombramiento')
      await ctx.close()
    ok(not errs,f'errores {errs}')
    await b.close()
  print('\n'+('\n'.join(fallas)+f'\n{len(fallas)} FALLAS' if fallas else 'TODO BIEN'));sys.exit(1 if fallas else 0)
asyncio.run(main())
