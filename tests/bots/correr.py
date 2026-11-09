import os,sys;sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..' if os.path.basename(os.path.dirname(os.path.abspath(__file__)))=='bots' else '.'));from comun import ROOT,BUILD,lanzar
import asyncio,json,sys
from playwright.async_api import async_playwright
H=12*3600
PROF={
 'novato':dict(every=22,acts=1,needT=.4,ignore=.5,fill=.97,reserve=60,minLots=2,buy=.05,up=.03,random=.35,water=False,domo=True,smart=False,maxT=4*3600),
 'intermedio':dict(every=9,acts=2,needT=.55,ignore=.15,fill=.92,reserve=100,minLots=3,buy=.3,up=.25,random=.1,water=True,domo=True,smart=False,maxT=4*3600),
 'experto':dict(every=4,acts=3,needT=.7,ignore=0,fill=.88,reserve=150,minLots=4,buy=.7,up=.6,random=0,water=True,domo=True,smart=True,maxT=4*3600,stop=3200),
 'descuidado':dict(every=4,acts=3,needT=.7,ignore=0,fill=.88,reserve=150,minLots=4,buy=.7,up=.6,random=0,water=True,domo=True,smart=True,maxT=7*3600,neglectAt=2500),
 'sinplusvalia':dict(every=9,acts=2,needT=.55,ignore=1,fill=.92,reserve=100,minLots=3,buy=.3,up=0,random=.6,water=True,domo=True,smart=False,maxT=4*3600),
 'muy experto':dict(every=2,acts=4,needT=.78,ignore=0,fill=.85,reserve=200,minLots=5,buy=1,up=.9,random=0,water=True,domo=True,smart=True,maxT=9*3600,stop=5000),
}
import os
SEEDS=[int(x) for x in os.environ.get('SEEDS','1,2,3').split(',')]
JOBS=[('novato',10+s) for s in SEEDS]+[('intermedio',20+s) for s in SEEDS]+[('experto',30+s) for s in SEEDS]+[('muy experto',40+s) for s in SEEDS]+[('descuidado',50+s) for s in SEEDS]+[('sinplusvalia',60+s) for s in SEEDS]
async def one(b,prof,seed):
  pg=await b.new_page();errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:200]))
  await pg.goto('file://'+BUILD+'/arnes-bots.html');
  if os.environ.get('DIST'):await pg.evaluate("d=>localStorage.setItem('distritoDomo.distrito',d)",os.environ['DIST']);await pg.reload()
  await pg.wait_for_timeout(500);await pg.click('#tcont',force=True);await pg.wait_for_timeout(200)
  await pg.evaluate("__dd.setPause(true)")
  cfg=dict(PROF[prof]);
  if os.environ.get('NOSTOP'):cfg.pop('stop',None);cfg['maxT']=max(cfg['maxT'],int(os.environ.get('MAXT','0')))
  cfg['seed']=seed;cfg['mis']=os.environ.get('MIS','1')=='1'
  r=await pg.evaluate("c=>window.__bot(c)",cfg)
  await pg.close();r['perfil']=prof;r['seed']=seed;r['errores']=errs[:2];return r
async def main():
  async with async_playwright() as p:
    b=await lanzar(p)
    sel=[j for j in JOBS if (len(sys.argv)<2 or j[0] in sys.argv[1].split('|'))]
    res=await asyncio.gather(*[one(b,pr,s) for pr,s in sel])
    json.dump(res,open(BUILD+'/bots-'+(sys.argv[2] if len(sys.argv)>2 else 'all')+'.json','w'))
    for r in res:
      m=r['ms'];f=lambda k:(f"{m[k]/60:.0f}" if k in m and m[k] is not None else '—')
      print(f"{r['perfil']:11s} s{r['seed']}  100:{f('100')} 300:{f('300')} 500:{f('500')} 1k:{f('1000')} 2k:{f('2000')} 3k:{f('3000')} 5k:{f('5000')} min | final {r['vFin']} vec, ${r['cash']}, lv4 {r['lv4']}, mejoras {r['ups']}, pisos {r['floors']}, terrenos {r['lots']}, agua {r['agua']}, rojo {r['red']//60}m, encargos {r.get('misN','-')} grandes {r.get('misBig')} obras {r.get('obras')} [{r.get('nuevos','')}] | sin agua {r['tAgua']//60}m, sat<.5 {r['tSat']//60}m, lleno {r['tLleno']//60}m, dinero ocioso {r['tRico']//60}m, sin dinero {r['tPobre']//60}m {r['errores']}")
      if r.get('big'):print('   grandes:',json.dumps(r['big']))
    for r in res:
      if r.get('drop'):print('CAÍDA',r['perfil'],r['seed'],json.dumps(r['drop'],ensure_ascii=False))
    await b.close()
asyncio.run(main())
