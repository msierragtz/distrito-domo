"""Sonda de la caché de sprites: ciudad de 2,600 vecinos con todo el mapa a la vista, del día a la noche cerrada y un giro.
Cuenta edificios que se quedaron sin imagen de respaldo (miss), los que no se dibujaron (nul), vaciados completos (clr) y desalojos (ev).
Uso: python3 tests/arnes.py && python3 tests/perf-cache.py [cpu]  → build/perf-cache.json"""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read());big['won3']=1;big['seen']=1
THR=int(sys.argv[1]) if len(sys.argv)>1 else 4
RUN="""(async o=>{const D=__dd,P=D.prof,st=P.stat,z=()=>{for(const k in st)st[k]=0},fr=[];let last=performance.now(),on=true;
  const f=now=>{fr.push(now-last);last=now;if(on)requestAnimationFrame(f)};requestAnimationFrame(f);
  const wait=ms=>new Promise(r=>setTimeout(r,ms)),cut=()=>{const a=fr.splice(0).sort((x,y)=>x-y);return {fps:+(1000/(a.reduce((s,x)=>s+x,0)/a.length)).toFixed(1),p95:+a[Math.floor(a.length*.95)].toFixed(1),peor:+a.at(-1).toFixed(1)}};
  const out={};D.setPause(false);D.S.clock=D.DAY*.35;await wait(4000);z();cut();
  // atardecer completo: de .55 a .9 del día en 14 s (los tres escalones de noche y las ventanas que se apagan)
  for(let k=0;k<=28;k++){D.S.clock=D.DAY*(.55+.35*k/28);await wait(500)}out.atardecer={...cut(),...st,n:P.n};z();
  D.turn(1);await wait(5000);out.giro={...cut(),...st,n:P.n};z();
  D.turn(1);await wait(4000);D.turn(1);await wait(4000);D.turn(1);await wait(5000);out.vuelta={...cut(),...st,n:P.n};z();
  for(let k=0;k<=20;k++){D.S.clock=D.DAY*(.9+.2*k/20);await wait(500)}out.amanecer={...cut(),...st,n:P.n};on=false;return out})()"""
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);res={}
    for name,vp,dsf,zoom in (('escritorio',{'width':1280,'height':800},1,1),('celular',{'width':390,'height':844},3,1)):
      ctx=await b.new_context(viewport=vp,device_scale_factor=dsf,is_mobile=dsf>1,has_touch=dsf>1)
      await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+");localStorage.setItem('distritoDomo.guia','1')}")
      pg=await ctx.new_page();cdp=await ctx.new_cdp_session(pg);await cdp.send('Emulation.setCPUThrottlingRate',{'rate':THR})
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(1200)
      await pg.evaluate(f"__dd.zoomAt({zoom})");await pg.wait_for_timeout(500)
      r=await pg.evaluate(RUN);res[name]=r
      for k,v in r.items():print(name,k,json.dumps(v))
      await ctx.close()
    json.dump(res,open(BUILD+f'/perf-cache-x{THR}.json','w'),indent=1);await b.close()
asyncio.run(main())
