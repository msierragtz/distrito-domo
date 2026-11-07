"""Transeúntes (v68): a dónde van, banquetas, paradas, reacciones a los eventos, carritos, obras, fuegos, «La voz de la calle»
y seguir con la cámara; en Ribera, la cascarita en el río seco y los curiosos en el puente. También mide cuánto cuesta dibujarlos
en un celular simulado 4 veces más lento. Guarda capturas en build/capturas/t-*.png y la hoja de poses en poses.png.
Uso: python3 tests/transeuntes.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json,io,base64
from PIL import Image
from playwright.async_api import async_playwright
ESC=open(ROOT+'/tests/datos/escena-muestra.js').read()
CAP=BUILD+'/capturas/'
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
CNT="(()=>{const W=__dd.W,c={};for(const w of W)c[w.st]=(c[w.st]||0)+1;return {n:W.length,c,ex:__dd.EX.map(e=>e.ent+':'+(e.L?e.L.g:'')),"+\
  "umb:W.filter(w=>w.L.umb).length,hat:W.filter(w=>w.L.hat||w.L.cap).length,pal:W.filter(w=>w.snack==='paleta').length,gar:W.filter(w=>w.L.garrafon).length,jer:W.filter(w=>w.L.jersey!=null).length,"+\
  "sign:W.filter(w=>w.L.sign).length,run:W.filter(w=>w.pose==='run').length,dest:W.filter(w=>w.dest).length,kinds:[...new Set(W.map(w=>w.trip))]}})()"
async def crop(pg,nm):
  im=Image.open(io.BytesIO(await pg.screenshot()));im.crop((440,230,840,500)).resize((1200,810),Image.NEAREST).save(CAP+f't-{nm}.png')
async def caso(pg,ph,ev,wait=4500):
  await pg.evaluate(f"(()=>{{const S=__dd.S;S.clock=__dd.DAY*{ph};S.ev={'null' if ev is None else '{id:\"'+ev+'\",t:80}'};for(const w of __dd.W)w.st='leave';__dd.W.length=0;__dd.recompute()}})()")
  await pg.wait_for_timeout(wait);return await pg.evaluate(CNT)
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000)
    d=await pg.evaluate("__dd.poseSheet()");open(CAP+'poses.png','wb').write(base64.b64decode(d.split(',')[1]))
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    await pg.evaluate(ESC);await pg.evaluate("__dd.S.pop={fam:900,pro:600,est:500};__dd.S.v=2000;__dd.S.vozTip=1;__dd.S.ribCard=1;__dd.S.ribMsg=1;__dd.recompute()")
    await pg.evaluate("for(const s of ['#dialog','#needs','#pausebar'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
    await pg.evaluate("__dd.zoomAt(3,640,400)");await pg.wait_for_timeout(700);await pg.evaluate("__dd.camTo(__dd.idx(14,12),.01)")
    r=await caso(pg,.5,None);print('tarde',r)
    ok(r['n']>=40,f"hay gente en la calle ({r['n']})")
    ok(r['dest']>=r['n']*.4,'la mayoría va a algún lado')
    ok(any(k in r['c'] for k in ('enter','exit','in','stay')),'entran y salen de los edificios')
    ok(sum(1 for e in r['ex'] if e.startswith('cart'))>=1,'carritos de elotes o raspados de día')
    await crop(pg,'tarde')
    off=await pg.evaluate("(()=>{let bad=0,n=0;for(const w of __dd.W){if(w.st!=='walk')continue;n++;const o=Math.hypot(w.ox,w.oy);if(Math.abs(o-.31)>.12&&!w.L.bike)bad++}return [n,bad]})()")
    ok(off[1]<=off[0]*.25,f'caminan por la banqueta ({off[0]-off[1]} de {off[0]})')
    r=await caso(pg,.5,'lluvia');print('lluvia',r);ok(r['umb']>0,'paraguas con lluvia')
    await pg.wait_for_timeout(2000);r=await pg.evaluate(CNT);ok(r['run']>0 or 'shelter' in r['c'],'los que no traen paraguas corren o se cubren')
    await crop(pg,'lluvia')
    r=await caso(pg,.45,'calor');print('calor',r);ok(r['hat']>0 and r['pal']>0,'sombreros, gorras y paletas en la ola de calor');await crop(pg,'calor')
    r=await caso(pg,.45,'agua');ok(r['gar']>0,'garrafones en el corte de agua')
    r=await caso(pg,.6,'clasico');ok(r['jer']>0,'playeras en el Clásico');await crop(pg,'clasico')
    r=await caso(pg,.45,None);ok(r['sign']>0,f"cartulinas donde falta algo ({r['sign']})")
    # obra: un maestro de obras con casco
    await pg.evaluate("(()=>{const S=__dd.S;for(let i=0;i<S.g.length;i++){const t=S.g[i];if(t.k!=='lote')continue;const x=i%__dd.N,y=Math.floor(i/__dd.N);if(![[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const n=S.g[__dd.idx(x+a,y+b)];return n&&n.k==='calle'&&!n.hw}))continue;__dd.setTool('cafe');__dd.act(i);if(S.g[i].k==='cafe'){S.g[i].b=60;S.g[i].bt=60;break}}__dd.recompute()})()");await pg.wait_for_timeout(800)
    ok(await pg.evaluate("__dd.EX.some(e=>e.L&&e.L.g==='worker')"),'maestro de obras junto a la obra')
    # fuegos: la gente se para a verlos
    await pg.evaluate("__dd.momento(__dd.idx(15,15))");await pg.wait_for_timeout(1500)
    r=await pg.evaluate(CNT);ok(r['c'].get('look',0)>0,f"se paran a ver los fuegos ({r['c'].get('look',0)})")
    await pg.wait_for_timeout(5000)
    # noche: menos gente
    r=await caso(pg,.9,None);print('noche',r);ok(r['n']<40,f"de noche hay menos gente ({r['n']})");await crop(pg,'noche')
    # La voz de la calle: tocar a alguien con «¿Qué es?»
    r=await caso(pg,.5,None,5000)
    await pg.evaluate("__dd.setTool('ver')")
    pos=await pg.evaluate("""(()=>{const c=document.querySelector('canvas').getBoundingClientRect();for(const w of __dd.W){if(w.st!=='walk'||w.a<1||!w.path||w.path.length-w.pi<7)continue;const [x,y]=__dd.P(w.X,w.Y),sx=c.left+x*__dd.zoom,sy=c.top+(y-(w.lift||0)-5)*__dd.zoom;
      if(sx>200&&sx<1100&&sy>150&&sy<550){__dd.setPause(true);return [sx,sy,w.id]}}return null})()""")
    ok(pos is not None,'hay alguien a la vista para tocar')
    if pos:
      await pg.wait_for_timeout(200);await pg.mouse.click(pos[0],pos[1]);await pg.wait_for_timeout(400)
      v=await pg.evaluate("[!document.getElementById('vozbox').hidden,document.querySelector('#vozbox h2 span')?.textContent,document.querySelector('#vozbox .vq')?.textContent,document.querySelector('#vozbox dl')?.textContent]")
      print('voz',v);ok(v[0] and v[1] and len(v[2] or '')>8,'tarjeta «La voz de la calle» con nombre y lo que piensa')
      await pg.screenshot(path=CAP+'t-voz.png')
      await pg.evaluate("__dd.setPause(false);document.getElementById('vzF').click()");p0=await pg.evaluate("__dd.pan");await pg.wait_for_timeout(2500);p1=await pg.evaluate("__dd.pan")
      ok(await pg.evaluate("!!__dd.FOLLOW"),'seguir con la cámara');ok(abs(p1[0]-p0[0])+abs(p1[1]-p0[1])>2,f'la cámara se mueve con la persona ({p0} → {p1})')
      await pg.mouse.move(640,420);await pg.mouse.down();await pg.mouse.move(700,460,steps=5);await pg.mouse.up();await pg.wait_for_timeout(200)
      ok(await pg.evaluate("!__dd.FOLLOW"),'al arrastrar el mapa se deja de seguir')
      await pg.evaluate("document.querySelector('#vozbox .x').click()")
    # rendimiento: ciudad de muestra, de día, celular 4× más lento
    cdp=await ctx.new_cdp_session(pg);await pg.evaluate("__dd.zoomAt(1,640,400)");await pg.wait_for_timeout(800);await caso(pg,.5,None,3000)
    await cdp.send('Emulation.setCPUThrottlingRate',{'rate':4});await pg.evaluate("window.__rt=0");await pg.wait_for_timeout(6000);con=await pg.evaluate("window.__rt")
    await pg.evaluate("__dd.S.pop={fam:4,pro:3,est:3};__dd.S.v=10;for(const w of __dd.W)w.st='leave';__dd.W.length=0");await pg.wait_for_timeout(500);await pg.evaluate("window.__rt=0");await pg.wait_for_timeout(6000);sin=await pg.evaluate("window.__rt")
    await cdp.send('Emulation.setCPUThrottlingRate',{'rate':1})
    print(f'dibujo con gente {con:.1f} ms, casi sin gente {sin:.1f} ms (celular simulado)');ok(con-sin<8,'la gente no hace lento el juego')
    await ctx.close()
    # Ribera: cascarita en el río seco y curiosos en el puente cuando crece
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
    await ctx.add_init_script("localStorage.setItem('distritoDomo.distrito','ribera');localStorage.setItem('distritoDomo.riberaUnl','1')")
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1000);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    await pg.evaluate(r"""(()=>{const D=__dd,S=D.S,I=D.idx;S.$=5e6;S.maxV=900;for(const k of Object.keys(D.DEFS))if(!S.unl.includes(k))S.unl.push(k);
      const put=(k,x,y)=>{D.setTool(k);D.act(I(x,y));const t=S.g[I(x,y)];if(t.k===k){t.b=0;if(D.DEFS[k].per)t.f=6}};
      for(let y=8;y<=18;y++){const cx=D.cxR(y);for(const x of [cx-2,cx+2]){const t=S.g[I(x,y)];if(t.k==='lote'||t.k==='arbol')put('malecon',x,y)}}
      for(const [x,y] of [[11,9],[11,11],[11,13],[11,15],[11,17],[19,9],[19,11],[19,13],[19,15],[19,17],[9,10],[9,14]])put(['edificio','ladrillo','torre'][(x+y)%3],x,y);
      for(const [x,y] of [[12,9],[12,16],[18,10],[18,16]])put(['cafe','parque','resto','plaza'][(x+y)%4],x,y);
      S.pop={fam:250,pro:150,est:150};S.v=550;S.ribCard=1;S.vozTip=1;S.clock=D.DAY*.3;S.ev=null;D.recompute()})()""")
    await pg.evaluate("for(const s of ['#dialog','#needs','#pausebar'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden')")
    await pg.evaluate("__dd.zoomAt(3,640,400)");await pg.wait_for_timeout(3500)
    fut=await pg.evaluate("__dd.FUT&&[__dd.FUT.cx,__dd.FUT.cy,__dd.FUT.pl.length]");ok(bool(fut) and fut[2]==6,'cascarita en el lecho seco')
    if fut:
      await pg.evaluate(f"__dd.camTo(__dd.idx({int(fut[0])},{int(fut[1])}),.01)");await pg.wait_for_timeout(2000)
      b0=await pg.evaluate("[__dd.FUT.ball.X,__dd.FUT.ball.Y]");await pg.wait_for_timeout(3000);b1=await pg.evaluate("[__dd.FUT.ball.X,__dd.FUT.ball.Y]")
      ok(abs(b0[0]-b1[0])+abs(b0[1]-b1[1])>.05,'el balón se mueve');await crop(pg,'futbol')
    r=await pg.evaluate(CNT);ok(any(e.startswith('cart') for e in r['ex']),'carrito junto al malecón')
    await pg.evaluate("const R=__dd.S.rio;R.cr=90;R.w=1;__dd.camTo(__dd.idx(__dd.cxR(12),12),.01)");riv=0
    for k in range(14):
      await pg.wait_for_timeout(1000);riv=max(riv,await pg.evaluate("__dd.W.filter(w=>w.st==='river').length"))
      if riv: break
    ok(riv>0,f'curiosos en el puente con la crecida ({riv})');ok(await pg.evaluate("!__dd.FUT||__dd.FUT.off"),'con la crecida se acaba la cascarita');await crop(pg,'crecida')
    print('errores',errs[:4]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'))
  sys.exit(1 if fallas else 0)
asyncio.run(main())
