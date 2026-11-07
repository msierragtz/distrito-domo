"""v72: casa de fraccionamiento, usos mixtos, cicloestación, banco y gasolinera (Domo y Ribera) y los especiales de la Ribera
(alberca, parroquia y hotel). Revisa reglas: pisos de la casa y su doble estacionamiento, el local de usos mixtos (comercio y
dinero), el banco (+10% a negocios cercanos), la cicloestación (estacionamiento, +50% junto a oficinas), la gasolinera (solo
pegada a avenida), la alberca en la ola de calor, las bodas de la parroquia y los turistas del hotel; y que todo se dibuje.
Capturas: build/capturas/v72-*.png. Uso: python3 tests/v72.py"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
CAP=BUILD+'/capturas/'
fallas=[]
def ok(c,msg):
  print(('OK   ' if c else 'FALLA ')+msg)
  if not c:fallas.append(msg)
H="""const D=__dd,S=D.S,N=D.N,I=D.idx,G=(x,y)=>S.g[I(x,y)];
const nb4=(x,y)=>[[1,0],[-1,0],[0,1],[0,-1]].map(([a,b])=>[x+a,y+b]).filter(([a,b])=>a>=0&&b>=0&&a<N&&b<N);
const lote=(x,y)=>x>=0&&y>=0&&x<N&&y<N&&G(x,y).k==='lote';
const spot=(cond,used)=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++){if(!lote(x,y)||(used&&used.some(([a,b])=>a===x&&b===y)))continue;const n=nb4(x,y).map(([a,b])=>G(a,b));if(cond(n,x,y))return [x,y]}return null};
const calle=n=>n.some(t=>t.k==='calle'&&!t.hw),aven=n=>n.some(t=>t.hw);
const put=(k,x,y)=>{D.setTool(k);D.act(I(x,y));const t=G(x,y);if(t.k===k){t.b=0;D.recompute();return true}return false};
const near=(p,q,r)=>Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])<=r;
"""
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)));pg.on('console',lambda m:m.type=='warning' and ('dibujo' in m.text or 'ícono' in m.text) and errs.append(m.text))
    async def boot(dist):
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.evaluate(f"localStorage.setItem('distritoDomo.distrito','{dist}')");await pg.reload();await pg.wait_for_timeout(1000)
      await pg.click('#tcont',force=True);await pg.wait_for_timeout(600)
      await pg.evaluate("(()=>{const S=__dd.S;S.$=5e7;S.maxV=3200;S.won3=1;S.ribCard=1;S.vozTip=1;S.ev=null;S.evNext=1e9;for(const k of Object.keys(__dd.DEFS))if(__dd.DEFS[k].unlock<Infinity&&!S.unl.includes(k))S.unl.push(k);__dd.recompute()})()")
    # ---------- Domo ----------
    await boot('domo')
    o=await pg.evaluate("__dd.ORDER");ok(all(k in o for k in ['casaf','mixto','ciclo','banco','gas']),'en el Domo se pueden construir los 5 nuevos');ok(not any(k in o for k in ['alberca','parroquia','hotel']),'los especiales de la Ribera no aparecen en el Domo')
    r=await pg.evaluate("(()=>{"+H+"""const out={};
      const c=spot(n=>calle(n)&&!aven(n));out.casa=put('casaf',...c);const t=G(...c);out.f0=t.f;const grow=()=>{D.setTool('casaf');D.act(I(...c));const q=G(...c);if(q.ub>0){q.ub=.001;D.tickQ(.05)}return q.f};out.f1=grow();out.f2=grow();t.lv=3;out.f3=grow();out.f4=grow();t.lv=1;
      t.b=0;t.ub=0;D.recompute();const bb=D.stats.B.find(q=>q.i===I(...c));out.pk=bb&&bb.pk;
      const m=spot((n,x,y)=>calle(n)&&!aven(n)&&!near([x,y],c,1),[c]);out.mixto=put('mixto',...m);out.mEarn=D.earnOf(I(...m));const mb=D.stats.B.find(q=>q.i===I(...m));out.mCom=mb?mb.gotC.fam+mb.gotC.pro+mb.gotC.est:0;
      const cf=spot((n,x,y)=>calle(n)&&!aven(n)&&!near([x,y],m,5)&&!near([x,y],c,4),[c,m]);out.cafe=put('cafe',...cf);const e0=D.earnOf(I(...cf));
      const bk=spot((n,x,y)=>calle(n)&&!aven(n)&&near([x,y],cf,3),[c,m,cf]);out.banco=put('banco',...bk);const e1=D.earnOf(I(...cf));out.bankRatio=e1/e0;
      const of=spot((n,x,y)=>calle(n)&&!aven(n)&&!near([x,y],cf,2),[c,m,cf,bk]);
      const cy=spot((n,x,y)=>calle(n)&&!aven(n)&&near([x,y],c,4),[c,m,cf,bk]);const pk0=(D.stats.B.find(q=>q.i===I(...c))||{got:{park:0}}).got.park;out.ciclo=put('ciclo',...cy);
      const pk1=(D.stats.B.find(q=>q.i===I(...c))||{got:{park:0}}).got.park;out.parkUp=pk1>pk0;
      out.mAlone=(D.stats.A.find(a=>a.k==='ciclo')||{}).m;const ofi=spot((n,x,y)=>calle(n)&&near([x,y],cy,3),[c,m,cf,bk,cy]);out.ofi=put('oficinas',...ofi);out.mOfi=(D.stats.A.find(a=>a.k==='ciclo')||{}).m;
      const g0=spot(n=>calle(n)&&!aven(n),[c,m,cf,bk,cy,ofi]);D.setTool('gas');D.act(I(...g0));out.gasLejos=G(...g0).k;
      const g1=spot(n=>aven(n),[c,m,cf,bk,cy,ofi]);out.gasAv=g1?put('gas',...g1):'sin lote junto a avenida';
      return out})()""");print('domo',r)
    ok(r['casa'] and r['f0']==1 and r['f1']==2 and r['f2']==2,'la casa empieza con 1 piso, sube a 2 y no pasa de ahí en nivel 1');ok(r['f3']==3 and r['f4']==3,'desde el nivel 3 le cabe un tercer piso, y no más')
    ok(r['pk']==2,'la casa pide el doble de estacionamiento')
    ok(r['mixto'] and (r['mEarn'] or 0)>0 and r['mCom']>0,'usos mixtos: su local deja dinero y da comercio')
    ok(r['cafe'] and r['banco'] and abs(r['bankRatio']-1.1)<.02,f"un café junto al banco gana 10% más ({r['bankRatio']:.3f})")
    ok(r['ciclo'] and r['parkUp'],'la cicloestación cubre estacionamiento')
    ok(r['ofi'] and abs(r['mOfi']/r['mAlone']-1.5)<.01,'junto a oficinas la cicloestación cubre 50% más')
    ok(r['gasLejos']=='lote','la gasolinera no se puede poner lejos de la avenida');ok(r['gasAv'] is True,'la gasolinera sí va pegada a una avenida')
    # ---------- Ribera ----------
    await boot('ribera')
    o=await pg.evaluate("__dd.ORDER");ok(all(k in o for k in ['alberca','parroquia','hotel','casaf','mixto','ciclo','banco','gas']),'en la Ribera están los especiales y los 5 nuevos')
    r=await pg.evaluate("(()=>{"+H+"""const out={},used=[];
      const sq=(k)=>{for(let y=0;y<N-1;y++)for(let x=0;x<N-1;x++){const c4=[[x,y],[x+1,y],[x,y+1],[x+1,y+1]];if(!c4.every(([a,b])=>lote(a,b)))continue;if(!c4.some(([a,b])=>calle(nb4(a,b).map(([u,v])=>G(u,v)))))continue;
          for(const [a,b] of c4){D.setTool(k);D.act(I(a,b));const t=G(a,b);if(t.k===k){t.b=0;D.recompute();return [a,b]}}}return null};
      const al=sq('alberca');out.alberca=!!al;const t0=D.stats.tour;S.ev={id:'calor',t:100};D.recompute();out.calorTour=D.stats.tour-t0;S.ev=null;D.recompute();
      const pa=sq('parroquia');out.parroquia=!!pa;
      const cf=spot((n,x,y)=>calle(n)&&!aven(n)&&near([x,y],pa,3));out.cafe=cf&&put('cafe',...cf);const e0=D.earnOf(I(...cf));
      S.boda={t:.01,on:0};D.tickQ(.1);out.bodaOn=S.boda.on>0;const e1=D.earnOf(I(...cf));out.bodaRatio=e1/e0;
      const ho=sq('hotel');out.hotel=!!ho;out.hotelT=D.stats.hotelT;S.ev={id:'clasico',t:90};D.recompute();out.hotelClas=D.stats.hotelT;S.ev=null;D.recompute();
      out.pos={al,pa,ho,cf};return out})()""");print('ribera',r)
    ok(r['alberca'] and r['calorTour']>=12,'la alberca deja dinero en la ola de calor')
    ok(r['parroquia'] and r['bodaOn'] and abs(r['bodaRatio']-1.5)<.02,f"en la boda los negocios cercanos ganan 50% más ({r['bodaRatio']:.2f})")
    ok(r['hotel'] and r['hotelT']>=20 and abs(r['hotelClas']/r['hotelT']-1.5)<.01,'el hotel deja dinero de turistas, 50% más en el Clásico')
    # dibujos: todos los tipos y niveles, en los dos distritos y de noche
    vac=[]
    for nb in (0,1):
      for k in ['casaf','mixto','ciclo','banco','gas','alberca','parroquia','hotel']:
        for L in (1,2,3,4) if k not in ('alberca','parroquia','hotel') else (1,):
          for rib in ('true','false'):
            n=await pg.evaluate(f"(()=>{{const pr=__dd.RIBV;return __dd.spriteInk('{k}',{L},{ {'casaf':2,'mixto':5}.get(k,0) },3,{nb})}})()")
            if n<300:vac.append((k,L,nb,n))
    ok(not vac,f'todos los dibujos tienen tinta ({vac[:3]})')
    # capturas en el juego
    await pg.evaluate("for(const s of ['#dialog','#needs','#pausebar','#ribnew'])document.querySelectorAll(s).forEach(e=>e.style.visibility='hidden');__dd.S.clock=__dd.DAY*.32")
    await pg.evaluate("__dd.zoomAt(2.6,640,400)");await pg.wait_for_timeout(300);await pg.evaluate(f"__dd.camTo(__dd.idx({r['pos']['pa'][0]},{r['pos']['pa'][1]}),.01)");await pg.wait_for_timeout(2500);await pg.screenshot(path=CAP+'v72-ribera.png')
    await pg.evaluate("__dd.S.clock=__dd.DAY*.86");await pg.wait_for_timeout(2500);await pg.screenshot(path=CAP+'v72-ribera-noche.png')
    print('errores',errs[:5]);ok(not errs,'sin errores')
    await b.close()
  print('\n'+('TODO BIEN' if not fallas else f'{len(fallas)} FALLAS'))
  sys.exit(1 if fallas else 0)
asyncio.run(main())
