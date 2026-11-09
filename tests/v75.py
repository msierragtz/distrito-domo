"""v75: guía de inicio en 3 pasos, agua visible (torre desde 600 vecinos, flecha azul y aviso que se puede tocar), mensajes con
prioridad y pestaña correcta, guardado en la cuenta que reintenta y avisa, errores por distrito, ahorro automático con todo lo de
«Calidad baja» y la barra de pausa que ya no tapa el panel de vecinos en celular.
Capturas: build/capturas/v75-*.png. Uso: python3 tests/v75.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/'
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);pg=await b.new_page(viewport={'width':1280,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    async def fresh(d='domo',keep=False):
      await pg.goto('file://'+BUILD+'/arnes.html')
      await pg.evaluate(("" if keep else "localStorage.clear();")+f"localStorage.setItem('distritoDomo.distrito','{d}')");await pg.reload();await pg.wait_for_timeout(800)
    E=pg.evaluate
    # ---------- 1) guía completa ----------
    await fresh();await pg.click('#tcont',force=True);await pg.wait_for_timeout(700)
    g=await E("[!document.getElementById('tuto').hidden,document.getElementById('tuto').textContent,__dd.GUIA&&__dd.GUIA.p,__dd.HINT,document.getElementById('tool-edificio').classList.contains('guia')]")
    print('guía',g[1][:90]);ok(g[0] and g[2]==1 and 'Paso 1 de 3' in g[1],'la guía arranca sola en una partida nueva')
    sel0=await E("document.getElementById('tool-edificio').getAttribute('aria-pressed')");print('paso 1',g[3],g[4],sel0)
    ok(g[3] and g[3]['k']=='guia' and await E(f"__dd.S.g[{g[3]['i']}].k==='lote'||__dd.S.g[{g[3]['i']}].k==='arbol'") and (g[4] or sel0=='true'),'paso 1: flecha amarilla en un terreno libre y Edificio elegido o resaltado')
    await pg.screenshot(path=CAP+'v75-guia-1.png')
    h=g[3]['i'];await E(f"__dd.setTool('edificio');__dd.act({h})");await pg.wait_for_timeout(700)
    g2=await E("[__dd.GUIA&&__dd.GUIA.p,document.getElementById('tuto').textContent,__dd.HINT]")
    print('paso 2',g2[1][:140]);ok(g2[0]==2 and 'globito' in g2[1],'al poner vivienda pasa al paso 2 (globitos)')
    await pg.screenshot(path=CAP+'v75-guia-2.png')
    # poner lo que pide el globito cerca del edificio de la flecha
    r=await E("""(()=>{const D=__dd,S=D.S,N=D.N,G=D.GUIA;const tx=document.getElementById('tuto').textContent;const k=['dogpark','parque','cafe','estac'].find(q=>document.getElementById('tool-'+q).classList.contains('guia'))||'parque';
      const c=D.HINT?D.HINT.i:0;let best=-1,bd=99;for(let i=0;i<N*N;i++){const t=S.g[i];if(t.k!=='lote'&&t.k!=='arbol')continue;const x=i%N,y=Math.floor(i/N);const d=Math.abs(x-c%N)+Math.abs(y-Math.floor(c/N));if(d<bd&&[[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>S.g[D.idx(Math.min(N-1,Math.max(0,x+a)),Math.min(N-1,Math.max(0,y+b)))].k==='calle')){bd=d;best=i}}
      D.setTool(k);D.act(best);return [k,best,S.g[best].k]})()""")
    await pg.wait_for_timeout(700);print('puse',r)
    g3=await E("[__dd.GUIA&&__dd.GUIA.p,document.getElementById('tuto').textContent]")
    ok(g3[0]==3 and '50%' in g3[1],'al atender el globito pasa al paso 3 (satisfacción de 50%)')
    await E("(()=>{const S=__dd.S;S.pop.fam+=30;S.v=S.pop.fam+S.pop.pro+S.pop.est})()");await pg.wait_for_timeout(900)
    g4=await E("[__dd.GUIA,document.getElementById('tuto').hidden,localStorage.getItem('distritoDomo.guia'),__dd.S.tuto,document.querySelectorAll('.guia').length]")
    ok(g4[0] is None and g4[1] and g4[2]=='1' and g4[3]==9 and g4[4]==0,'con 40 vecinos la guía termina, se cierra y no vuelve')
    # nueva partida del mismo jugador: ya no sale
    await pg.reload();await pg.wait_for_timeout(800);await E("document.getElementById('tnew').click()");await pg.wait_for_timeout(900);await E("document.getElementById('tnew').click()");await pg.wait_for_timeout(700)
    ok(await E("document.getElementById('tuto').hidden&&!__dd.GUIA"),'una partida nueva de quien ya hizo la guía empieza sin ella')
    # saltar
    await fresh();await pg.click('#tcont',force=True);await pg.wait_for_timeout(600);await E("document.querySelector('#tuto .sk').click()");await pg.wait_for_timeout(300)
    ok(await E("document.getElementById('tuto').hidden&&localStorage.getItem('distritoDomo.guia')==='1'&&!__dd.HINT"),'«Saltar guía» la cierra y no vuelve')
    # veterano: partida con 500 vecinos y nueva partida → sin guía
    await fresh();await E("localStorage.setItem('distritoDomo.v4',JSON.stringify(Object.assign({},__dd.S,{maxV:500,seen:1})))");await pg.reload();await pg.wait_for_timeout(800)
    await E("document.getElementById('tnew').click()");await pg.wait_for_timeout(900);await E("document.getElementById('tnew').click()");await pg.wait_for_timeout(700)
    ok(await E("document.getElementById('tuto').hidden&&!__dd.GUIA"),'quien ya jugó (500 vecinos) no recibe la guía al empezar de nuevo')
    # guía a medias: al recargar sigue en el mismo paso
    await fresh();await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    h=await E("__dd.HINT.i");await E(f"__dd.setTool('edificio');__dd.act({h})");await pg.wait_for_timeout(600);await E("__dd.setPause(true)");await pg.reload();await pg.wait_for_timeout(800);await pg.click('#tcont',force=True);await pg.wait_for_timeout(600)
    ok(await E("__dd.GUIA&&__dd.GUIA.p===2&&!document.getElementById('tuto').hidden"),'si se recarga a la mitad, la guía sigue en el paso 2')
    # ---------- 2) agua ----------
    ok(await E("__dd.DEFS.torreagua.unlock===600&&__dd.DEFS.torreagua.cost===50000"),'la Torre de agua se abre a los 600 vecinos y sigue costando $50,000')
    await fresh();await E("localStorage.setItem('distritoDomo.guia','1')");await pg.reload();await pg.wait_for_timeout(700);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    await E("__dd.S.maxV=620;__dd.setPause(false)");await pg.wait_for_timeout(500);await E("__dd.setPause(true)")
    w=await E("[__dd.S.unl.includes('torreagua'),__dd.cur,__dd.curO.tool]");print('desbloqueo',w[1][:120])
    ok(w[0] and 'cada torre surte a 1,000 más' in (w[1]+json.dumps(await E("__dd.msgQ.map(q=>q.t)"),ensure_ascii=False)),'a los 600 vecinos avisa de la Torre de agua y para qué sirve')
    await E("(()=>{const S=__dd.S;S.pop.fam+=800;S.v=S.pop.fam+S.pop.pro+S.pop.est;__dd.guiaStep(1)})()")
    hi=await E("__dd.HINT");ok(hi and hi['k']=='agua' and await E(f"__dd.S.g[{hi['i']}].k==='lote'||__dd.S.g[{hi['i']}].k==='arbol'"),'a 250 vecinos del límite aparece la flecha azul en un terreno libre')
    await E("__dd.camTo(__dd.HINT.i,0)");await pg.wait_for_timeout(500);await pg.screenshot(path=CAP+'v75-agua.png')
    await E("__dd.setTool('ver');__dd.say('El agua del Distrito alcanza para 1,000 vecinos. Toca este mensaje.',true,{p:2,tool:'torreagua',hint:1})");await pg.wait_for_timeout(1200)
    await pg.click('#dialog',force=True);await pg.wait_for_timeout(400)
    t=await E("[__dd.tool,document.querySelector('#tabs button[aria-selected=true]').dataset.t]") if await E("typeof __dd.tool!=='undefined'") else None
    sel=await E("[document.getElementById('tool-torreagua').getAttribute('aria-pressed'),document.querySelector('#tabs button[aria-selected=true]').dataset.t]")
    ok(sel[1]=='ser' and sel[0]=='true','tocar el aviso del agua elige la Torre de agua en Servicios')
    i=hi['i'];await E(f"__dd.S.$=1e6;__dd.setTool('torreagua');__dd.act({i});__dd.guiaStep(1)");ok(await E(f"__dd.S.g[{i}].k==='torreagua'&&!__dd.HINT"),'se construye donde marca la flecha y la flecha se va')
    # ---------- 3) mensajes ----------
    r=await E("""(()=>{const D=__dd,o={};for(const [m,want] of [['Las familias se quejan: hay 3 edificios sin estacionamiento cerca. Búscalos por el globito azul y pon estacionamiento o cicloestación a unas cuadras.','ser'],['Los profesionistas se quejan: hay 2 edificios sin área verde cerca. Búscalos por el globito verde y pon parque, plaza o dog park a unas cuadras.','ser'],['Hay 4 edificios sin dog park cerca.','ser']])o[want+m.slice(4,20)]=D.tabMsg(m)===want;return o})()""")
    ok(all(r.values()),f'«hay N edificios sin…» ya no manda a Vivienda {r}')
    q=await E("""(()=>{const D=__dd;D.say('aviso importante',true,{p:2});for(let k=0;k<8;k++)D.say('llegó alguien '+k,false,{p:0});D.say('normal 1');D.say('normal 2');D.say('interrupción',true);return [D.cur,D.msgQ.map(x=>x.t+'|'+x.p)]})()""")
    print('cola',q);ok(q[0]=='interrupción' and q[1][0].startswith('aviso importante') and not any('|0' in x for x in q[1]) and len(q[1])<=6,'un aviso interrumpido vuelve a la fila y la plática se descarta primero')
    # ---------- 4) guardado en la cuenta ----------
    c=await E("""(async()=>{const C=__dd.CLOUD;let n=0,okN=0,fail=true;C.ref={set:async()=>{n++;if(fail){const e=new Error('x');e.code='permission-denied';throw e}okN++}};C.ready=true;C.fail=0;C.down=false;C.told=false;
      for(let k=0;k<3;k++){C.pend='{}';C.lastT=0;await C.flush()}const a=[C.ready,C.down,C.fail,__dd.cur.includes('No pude guardar')];fail=false;C.pend='{}';C.lastT=0;await C.flush();return a.concat([C.down,okN,C.txt()])})()""")
    print('nube',c);ok(c[0] and c[1] and c[3],'si la cuenta falla 3 veces sigue intentando y avisa una vez')
    ok(not c[4] and c[5]==1 and 'Guardado en tu cuenta' in c[6],'cuando vuelve a funcionar, guarda y lo dice en Opciones')
    # ---------- 5) errores por distrito ----------
    await fresh('ribera');await E("window.dispatchEvent(new ErrorEvent('error',{message:'prueba ribera',lineno:7}))")
    e=await E("[localStorage.getItem('distritoDomo.ribera.v1.errores'),localStorage.getItem('distritoDomo.v4.errores')]")
    ok(e[0] and 'prueba ribera' in e[0] and not (e[1] and 'prueba ribera' in e[1]),'en la Ribera los errores se guardan en su llave y salen en su panel')
    # ---------- 6) ahorro automático ----------
    a=await E("(()=>{__dd.setAuto(true);__dd.prof.render();return [__dd.lowQ(),__dd.WBUD]})()");bq=await E("(()=>{__dd.setAuto(false);__dd.prof.render();return [__dd.lowQ(),__dd.WBUD]})()")
    ok(a==[True,2] and bq==[False,5],'con el ahorro automático se aplican los presupuestos de «Calidad baja»')
    # ---------- 7) celular: la pausa no tapa el panel ----------
    for vp in ({'width':390,'height':844},{'width':375,'height':667},{'width':430,'height':932}):
      ctx=await b.new_context(viewport=vp,device_scale_factor=2,is_mobile=True,has_touch=True);m=await ctx.new_page()
      await m.goto('file://'+BUILD+'/arnes.html');await m.evaluate("localStorage.setItem('distritoDomo.guia','1')");await m.reload();await m.wait_for_timeout(800);await m.click('#tcont',force=True);await m.wait_for_timeout(600)
      await m.evaluate("__dd.setPause(true)");await m.wait_for_timeout(300)
      R=await m.evaluate("['needs','pausebar'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [r.left,r.top,r.right,r.bottom]})")
      inter=not(R[0][2]<=R[1][0] or R[1][2]<=R[0][0] or R[0][3]<=R[1][1] or R[1][3]<=R[0][1])
      txt=await m.evaluate("document.getElementById('pausebar').textContent")
      await m.tap('#needs',timeout=3000);await m.wait_for_timeout(300);opened=await m.evaluate("!document.getElementById('needs').classList.contains('min')")
      ok(not inter and opened and 'barra espaciadora' not in txt,f"{vp['width']}×{vp['height']}: en pausa el panel de vecinos se ve y se puede abrir")
      if vp['width']==390:await m.screenshot(path=CAP+'v75-pausa-cel.png')
      await ctx.close()
    # guía en celular
    ctx=await b.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True);m=await ctx.new_page()
    await m.goto('file://'+BUILD+'/arnes.html');await m.wait_for_timeout(800);await m.click('#tcont',force=True);await m.wait_for_timeout(900)
    R=await m.evaluate("['needs','tuto','dialog','zin'].map(id=>{const r=document.getElementById(id).getBoundingClientRect();return [Math.round(r.left),Math.round(r.top),Math.round(r.right),Math.round(r.bottom)]})")
    print('celular',R);ov=lambda A,B:not(A[2]<=B[0] or B[2]<=A[0] or A[3]<=B[1] or B[3]<=A[1])
    ok(not ov(R[1],R[0]) and not ov(R[1],R[3]) and not ov(R[1],R[2]),'en celular la guía no tapa el panel, los botones ni el mensaje')
    await m.screenshot(path=CAP+'v75-guia-cel.png');await ctx.close()
    print('errores',errs[:5]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'));sys.exit(1 if fallas else 0)
asyncio.run(main())
