"""Auditoría de rendimiento: ciudad de 2,600 vecinos, escritorio y celular, CPU normal y 4x más lenta (gama baja).
Mide el dibujo por cuadro (render), la simulación (tick, recompute, satCalc), el guardado y la reconstrucción de sprites.
Uso: python3 tests/perf-auditoria.py  → build/perf-auditoria.json"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json,statistics as st
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
MICRO="""(()=>{const D=__dd,P=D.prof,tm=(f,n)=>{const a=[];for(let k=0;k<n;k++){const t0=performance.now();f();a.push(performance.now()-t0)}a.sort((x,y)=>x-y);return +a[Math.floor(n/2)].toFixed(3)};
  return {recompute:tm(()=>D.recompute(),15),satCalc:tm(()=>P.satCalc(),40),tick:tm(()=>P.tick(1/60),60),guardar:tm(()=>P.ser(),8),bytes:P.ser(),traffic:tm(()=>P.traffic(),40),render:tm(()=>P.render(),20),n:P.n}})()"""
FRAMES="""(sec=>new Promise(res=>{const D=__dd,a=[],r=[];let last=performance.now();const t1=last+sec*1000;const f=now=>{a.push(now-last);last=now;r.push(D.perf?D.perf.r:0);if(now<t1)requestAnimationFrame(f);else{a.sort((x,y)=>x-y);const q=p=>+a[Math.min(a.length-1,Math.floor(a.length*p))].toFixed(1);res({fps:+(1000/(a.reduce((s,x)=>s+x,0)/a.length)).toFixed(1),p50:q(.5),p95:q(.95),render:+r.at(-1).toFixed(2),n:D.prof.n})}};requestAnimationFrame(f)}))"""
WARM="""(()=>new Promise(res=>{const D=__dd;D.prof.clearSpr();const t0=performance.now();let fr=0,a=[],last=t0;const f=now=>{fr++;a.push(now-last);last=now;const n=D.prof.n;if(n.sprl>=n.last*0+150&&fr>5&&now-t0>1500||now-t0>8000){res({ms:Math.round(now-t0),frames:fr,peor:+Math.max(...a).toFixed(1),n})}else requestAnimationFrame(f)};requestAnimationFrame(f)}))()"""
async def main():
  out={}
  async with async_playwright() as p:
    b=await lanzar(p)
    for vp,name in (({'width':1280,'height':800},'escritorio'),({'width':390,'height':844,'device_scale_factor':3,'is_mobile':True,'has_touch':True},'celular')):
      for thr in (1,4):
        ctx=await b.new_context(viewport={k:v for k,v in vp.items() if k in('width','height')},device_scale_factor=vp.get('device_scale_factor',1),is_mobile=vp.get('is_mobile',False),has_touch=vp.get('has_touch',False))
        await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+")}")
        pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg);await cdp.send('Emulation.setCPUThrottlingRate',{'rate':thr})
        await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(1500)
        await pg.evaluate("__dd.setPause(false);__dd.S.clock=__dd.DAY*.35");await pg.wait_for_timeout(2500)
        r={'dia':await pg.evaluate(FRAMES,5)}
        await pg.evaluate("__dd.S.clock=__dd.DAY*.8");await pg.wait_for_timeout(2500);r['noche']=await pg.evaluate(FRAMES,5)
        await pg.evaluate("__dd.S.clock=__dd.DAY*.6");await pg.wait_for_timeout(500);r['atardecer']=await pg.evaluate(FRAMES,6)
        await pg.evaluate("__dd.S.clock=__dd.DAY*.35");await pg.wait_for_timeout(1500)
        r['sprites_desde_cero']=await pg.evaluate(WARM)
        await pg.evaluate("__dd.setPause(true)");r['micro']=await pg.evaluate(MICRO)
        out[f'{name} cpu x{thr}']=r;print(name,thr,json.dumps(r)[:900]);await ctx.close()
    await b.close()
  json.dump(out,open(BUILD+'/perf-auditoria.json','w'),indent=1)
asyncio.run(main())
