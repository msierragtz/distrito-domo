import os,sys;sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..' if os.path.basename(os.path.dirname(os.path.abspath(__file__)))=='bots' else '.'));from comun import ROOT,BUILD,lanzar
import asyncio,json,sys
from playwright.async_api import async_playwright
big=json.loads(open(ROOT+'/tests/datos/ciudad-2600.json').read())
OB=['bosque','museo','rasca','beis','plazacom','metro']
big['unl']=list(set(big['unl']+['barber','unas','paleteria','boliche','gym','cine','golf']+OB));big['$']=5e6;big['maxV']=4700;big['won3']=1
PLACE="""(()=>{const D=__dd,S=D.S,N=D.N,out={};
 const sz=k=>D.DEFS[k].sz;
 const ok=(i,s,allow)=>{const x=i%N,y=Math.floor(i/N);if(x+s>N||y+s>N)return false;for(let dy=0;dy<s;dy++)for(let dx=0;dx<s;dx++){const t=S.g[D.idx(x+dx,y+dy)];if(!allow.includes(t.k)||t.hw)return false}return true};
 const nearSt=(i,s)=>{const x=i%N,y=Math.floor(i/N);for(let dy=-1;dy<=s;dy++)for(let dx=-1;dx<=s;dx++){if(dx>=0&&dx<s&&dy>=0&&dy<s)continue;if((dx<0||dx>=s)&&(dy<0||dy>=s))continue;const X=x+dx,Y=y+dy;if(X<0||Y<0||X>=N||Y>=N)continue;const t=S.g[D.idx(X,Y)];if(t.k==='calle'&&!t.hw)return true}return false};
 for(const k of __OB__){const s=sz(k);let at=-1;
  for(let i=0;i<N*N&&at<0;i++)if(ok(i,s,['lote','arbol'])&&nearSt(i,s))at=i;
  for(let i=0;i<N*N&&at<0;i++)if(ok(i,s,['lote','arbol','ajeno','fabrica','dogpark','estac','plaza','edificio','ladrillo'])&&nearSt(i,s))at=i;
  if(at<0){out[k]='sin lugar';continue}
  const x=at%N,y=Math.floor(at/N);for(let dy=0;dy<s;dy++)for(let dx=0;dx<s;dx++){S.g[D.idx(x+dx,y+dy)]={k:'lote',s:7,b:0}}
  // el museo necesita una plaza pegada
  if(k==='museo'&&x+s<N){S.g[D.idx(x+s,y)]={k:'plaza',s:3,b:0}}
  D.recompute();D.setTool(k);D.act(at);const t=S.g[at];out[k]=[at,t.k,t.b,String(D.cur).slice(0,80)]}
 D.recompute();return out})()"""
async def main():
  async with async_playwright() as p:
    b=await lanzar(p)
    ctx=await b.new_context(viewport={'width':1366,'height':768});pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append('PE '+str(e)+' | '+(e.stack or '')[:600]))
    pg.on('console',lambda m:errs.append('C '+m.text) if m.type in ('error','warning') else None)
    await ctx.add_init_script("if(!sessionStorage.getItem('x')){sessionStorage.setItem('x','1');localStorage.setItem('distritoDomo.v4',"+json.dumps(json.dumps(big))+")}")
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(800)
    await pg.evaluate("__dd.setPause(true)")
    r=await pg.evaluate(PLACE.replace('__OB__',json.dumps(OB)));print('colocadas',r)
    anchors={k:v[0] for k,v in r.items() if isinstance(v,list)}
    await pg.evaluate("document.querySelector('#dialog').style.display='none'")
    await pg.evaluate("(()=>{for(const t of __dd.S.g)if(t.b>0)t.b=0;__dd.recompute()})()")
    pos={}
    for k,a in anchors.items():
      await pg.evaluate(f"__dd.setPan(0,0,3)");await pg.evaluate(f"__dd.camTo({a},.01)");await pg.wait_for_timeout(150)
      for pp in [.06,.3,.55,.8,1]:
        await pg.evaluate(f"(()=>{{const t=__dd.S.g[{a}];t.b=t.bt*(1-{pp});if(t.b<=0)t.b=0;__dd.recompute()}})()")
        await pg.wait_for_timeout(300)
        pos[k]=await pg.evaluate(f"(()=>{{const t=__dd.S.g[{a}],s=__dd.DEFS[t.k].sz,N=__dd.N,q=__dd.P({a}%N+s/2,Math.floor({a}/N)+s/2);return [q[0]*__dd.zoom,q[1]*__dd.zoom]}})()")
        await pg.screenshot(path=BUILD+f'/capturas/o64-{k}-{int(pp*100)}.png')
    import json as J;open(BUILD+'/capturas/o64-pos.json','w').write(J.dumps(pos))
    print('errores',errs[:8])
    await b.close()
asyncio.run(main())
