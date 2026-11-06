"""Distrito Ribera: mapa nuevo, río seco / con agua / crecido, puentes, lecho (construir, dañar, reparar), malecón,
cambio de distrito y que la partida del Distrito Domo no se toque. Uso: python3 tests/ribera.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1
DOMO=json.dumps(big)
CAP=BUILD+'/capturas/'
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
    # el Domo ya tiene 2,600; Ribera abierta y elegida, sin partida propia todavía
    await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(DOMO)+");localStorage.setItem('distritoDomo.riberaUnl','1');localStorage.setItem('distritoDomo.distrito','ribera');localStorage.setItem('distritoDomo.riberaBono','15000')}")
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200)
    await pg.screenshot(path=CAP+'rib-titulo.png')
    ok(await pg.evaluate("__dd.DIST")=='ribera','arranca en Ribera')
    ok(await pg.evaluate("!document.getElementById('tdist').hidden"),'selector de distrito visible en el inicio')
    ok('RIBERA' in await pg.evaluate("document.querySelector('#title .tt').textContent"),'título dice Ribera')
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(900)
    S=await pg.evaluate("({dist:__dd.S.dist,v:__dd.S.v,m:__dd.S.$,rio:__dd.S.rio,nr:__dd.S.g.filter(t=>t.k==='rio').length,npu:__dd.S.g.filter(t=>t.pu).length,dom:__dd.S.g.filter(t=>t.k==='lotedomo').length,fab:__dd.S.g.filter(t=>t.k==='fabrica').length})")
    print(S)
    ok(S['dist']=='ribera' and S['nr']>40 and S['npu']>=6 and S['dom']==1 and S['fab']==0,'mapa de Ribera: río, puentes, terreno del landmark, sin fábrica')
    ok(S['m']>=15600,'bono del Domo aplicado')
    await pg.evaluate("__dd.setPause(true)")
    await pg.screenshot(path=CAP+'rib-seco.png')
    # construir: puente, parque en el lecho, malecón en la orilla
    await pg.evaluate("__dd.S.$=60000;__dd.S.unl=Object.keys(__dd.DEFS)")
    r=await pg.evaluate("""(()=>{const S=__dd.S,N=__dd.N,id=__dd.idx,out={};
      const y1=10,c1=__dd.cxR(y1);__dd.setTool('calle');const m0=S.$;__dd.act(id(c1,y1));out.puente=[S.g[id(c1,y1)].k,S.g[id(c1,y1)].pu,m0-S.$];
      const y2=13,c2=__dd.cxR(y2);__dd.setTool('parque');__dd.act(id(c2,y2));out.lecho=[S.g[id(c2,y2)].k,S.g[id(c2,y2)].lecho];out.li=id(c2,y2);
      __dd.setTool('malecon');const xm=c2-2;__dd.act(id(xm,y2-1));out.malBad=S.g[id(xm,y2-1)].k;
      const xm2=__dd.cxR(y2+2)+2;__dd.act(id(xm2,y2+2));out.mal=S.g[id(xm2,y2+2)].k;
      __dd.setTool('edificio');__dd.act(id(c2,y2+1));out.edifRio=S.g[id(c2,y2+1)].k;return out})()""")
    print(r)
    ok(r['puente'][0]=='calle' and r['puente'][1]==1 and r['puente'][2]>=400,'puente: calle sobre el río, cuesta al menos $400')
    ok(r['lecho']==['parque',1],'parque en el lecho seco')
    ok(r['malBad']!='malecon','malecón lejos del río se rechaza')
    ok(r['mal']=='malecon','malecón en la orilla')
    ok(r['edifRio']=='rio','no se puede poner un edificio en el río')
    # terminar obras y avanzar un poco
    await pg.evaluate("for(const t of __dd.S.g){if(t.b>0)t.b=0}__dd.recompute()")
    li=r['li']
    ok(await pg.evaluate(f"__dd.S.g[{li}].ok"),'parque del lecho funciona en seco')
    await pg.evaluate(f"__dd.camTo({li},0)");await pg.wait_for_timeout(600)
    await pg.screenshot(path=CAP+'rib-obras.png')
    # temporada de lluvias
    await pg.evaluate("const R=__dd.S.rio;R.t=Math.ceil(R.t/(__dd.DAY*10))*__dd.DAY*10+__dd.DAY*10*.66;for(let k=0;k<400;k++)__dd.rioStep(.5,true)")
    w=await pg.evaluate("[__dd.rioFase(),__dd.rioW(),__dd.S.g["+str(li)+"].ok,__dd.S.rio.cre]");print('lluvias',w)
    ok(w[0] in('lluvias','crecida') and w[1]>.5 and w[2]==False,'con lluvias el río sube y el lecho deja de servir')
    # con agua no se construye en el lecho
    r2=await pg.evaluate("(()=>{const S=__dd.S,id=__dd.idx,y=16,c=__dd.cxR(y);__dd.setTool('cancha');__dd.act(id(c,y));return S.g[id(c,y)].k})()")
    ok(r2=='rio','con agua no se puede construir en el lecho')
    await pg.evaluate("__dd.S.clock=__dd.DAY*.3;__dd.setPause(false)");await pg.wait_for_timeout(700);await pg.screenshot(path=CAP+'rib-lluvias.png');await pg.evaluate("__dd.setPause(true)")
    # crecida
    await pg.evaluate("const R=__dd.S.rio;R.cre=1;for(let k=0;k<20;k++)__dd.rioStep(.5,true)")
    c=await pg.evaluate(f"[__dd.rioFase(),__dd.rioW(),__dd.S.g[{li}].dmg]");print('crecida',c)
    ok(c[0]=='crecida' and c[2]==1,'la crecida daña lo del lecho')
    await pg.evaluate("__dd.setPause(false)");await pg.wait_for_timeout(700);await pg.screenshot(path=CAP+'rib-crecida.png');await pg.evaluate("__dd.setPause(true)")
    await pg.evaluate("__dd.S.clock=__dd.DAY*.9");await pg.wait_for_timeout(500);await pg.screenshot(path=CAP+'rib-crecida-noche.png')
    # baja el agua: termina la temporada
    await pg.evaluate("const R=__dd.S.rio;R.cr=0;R.t=Math.ceil(R.t/(__dd.DAY*10))*__dd.DAY*10+__dd.DAY*.5;for(let k=0;k<600;k++)__dd.rioStep(.5,true);__dd.S.clock=__dd.DAY*.3")
    d=await pg.evaluate(f"[__dd.rioFase(),__dd.rioW(),__dd.S.g[{li}].ok,__dd.S.g[{li}].dmg]");print('seco',d)
    ok(d[0]=='seco' and d[1]<.5 and d[2]==False and d[3]==1,'ya seco, lo dañado sigue sin servir')
    await pg.wait_for_timeout(400);await pg.screenshot(path=CAP+'rib-danado.png')
    rep=await pg.evaluate(f"(()=>{{const S=__dd.S,m=S.$;__dd.setTool('mejorar');__dd.act({li});return [S.g[{li}].dmg,S.g[{li}].ok,m-S.$]}})()")
    print('reparar',rep);ok(rep[0] is None and rep[1]==True and rep[2]>0,'Mejorar repara lo dañado')
    # demoler el puente vuelve río
    dm=await pg.evaluate("(()=>{const S=__dd.S,id=__dd.idx,y=10,c=__dd.cxR(y);__dd.setTool('demoler');__dd.act(id(c,y));return S.g[id(c,y)].k})()")
    ok(dm=='rio','demoler un puente deja el río')
    # landmark
    lm=await pg.evaluate("(()=>{const S=__dd.S;const i=S.g.findIndex(t=>t.k==='lotedomo');__dd.setTool('domo');__dd.act(i);for(const t of S.g)if(t.b>0)t.b=0;__dd.recompute();return [i,S.g[i].k,__dd.DEFS.domo.name]})()")
    print('landmark',lm);ok(lm[1]=='domo' and 'Puente' in lm[2],'El Puente Atirantado se construye')
    await pg.evaluate(f"__dd.camTo({lm[0]},0)");await pg.wait_for_timeout(1200);await pg.screenshot(path=CAP+'rib-puente.png')
    await pg.evaluate("__dd.S.clock=__dd.DAY*.88");await pg.wait_for_timeout(600);await pg.screenshot(path=CAP+'rib-puente-noche.png')
    await pg.evaluate("__dd.S.clock=__dd.DAY*.35;__dd.setPause(false)");await pg.wait_for_timeout(3000)
    # guardar y comprobar que el Domo no se tocó
    ls=await pg.evaluate("[!!localStorage.getItem('distritoDomo.ribera.v1'),localStorage.getItem('distritoDomo.v4')]")
    ok(ls[0],'Ribera guarda en su propia llave')
    ok(ls[1]==DOMO,'la partida del Domo sigue intacta')
    # cambiar al Domo desde opciones
    await pg.evaluate("document.getElementById('opts').hidden=false")
    ok(await pg.evaluate("!document.getElementById('odist').hidden"),'selector en opciones')
    await pg.screenshot(path=CAP+'rib-opciones.png')
    await pg.evaluate("document.getElementById('odDomo').click()");await pg.wait_for_timeout(4000)
    ok(await pg.evaluate("__dd.DIST")=='domo','cambio al Domo')
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(900)
    v=await pg.evaluate("[Math.round(__dd.S.v),__dd.S.g.filter(t=>t.k==='rio').length,__dd.S.g.filter(t=>t.k==='domo').length]");print('domo',v)
    ok(v[1]==0 and v[0]>2000,'el Domo carga su propia partida')
    await pg.screenshot(path=CAP+'rib-vuelta-domo.png')
    # y de regreso a Ribera: conserva lo construido
    await pg.evaluate("document.getElementById('odRib').click()");await pg.wait_for_timeout(4000)
    await pg.click('#tcont',force=True);await pg.wait_for_timeout(900)
    v2=await pg.evaluate("[__dd.DIST,__dd.S.g.filter(t=>t.k==='domo').length,__dd.S.g.filter(t=>t.k==='malecon').length]");print('ribera otra vez',v2)
    ok(v2==['ribera',1,1],'Ribera conserva su partida')
    print('errores',errs[:5]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'))
  sys.exit(1 if fallas else 0)
asyncio.run(main())
