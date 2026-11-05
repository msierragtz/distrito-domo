import os,sys;sys.path.insert(0,os.path.join(os.path.dirname(os.path.abspath(__file__)),'..' if os.path.basename(os.path.dirname(os.path.abspath(__file__)))=='bots' else '.'));from comun import ROOT,BUILD,lanzar
import asyncio,json,sys
from playwright.async_api import async_playwright
SCENE="""(()=>{const D=__dd,S=D.S,N=D.N,I=(x,y)=>D.idx(x,y);
 S.$=5e6;S.maxV=4800;S.won3=1;for(const k of Object.keys(D.DEFS))if(!S.unl.includes(k))S.unl.push(k);
 for(let y=8;y<=18;y++){S.g[I(20,y)]={k:'calle',s:1,b:0}}for(let x=17;x<20;x++)S.g[I(x,12)]={k:'calle',s:1,b:0};
 const put=(k,x,y)=>{D.setTool(k);D.act(I(x,y));const t=S.g[I(x,y)];if(t.k!==k)return k+':'+String(D.cur).slice(0,60);t.b=0;return k};
 const r=[put('beis',8,8),put('bosque',8,13),put('plazacom',17,8),put('museo',12,8),put('plaza',14,8),put('rasca',17,13),put('metro',17,16),put('domo',15,15)];
 for(const [x,y] of [[21,8],[21,10],[21,13],[21,15],[21,17]]){r.push(put('torre',x,y))}
 for(const [x,y] of [[12,13],[12,14]]){r.push(put('edificio',x,y))}
 r.push(put('cafe',15,13));r.push(put('parque',10,16));r.push(put('resto',15,10));
 for(const t of S.g){if(t.b>0)t.b=0}D.recompute();return r})()"""
async def main():
  async with async_playwright() as p:
    b=await lanzar(p)
    ctx=await b.new_context(viewport={'width':1280,'height':800});pg=await ctx.new_page();errs=[]
    pg.on('pageerror',lambda e:errs.append('PE '+str(e)+' | '+(e.stack or '')[:600]))
    await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
    print(await pg.evaluate(SCENE))
    await pg.evaluate("__dd.setPause(true);document.querySelector('#dialog').style.visibility='hidden';document.querySelector('#needs').style.visibility='hidden'")
    from PIL import Image
    import io
    A={'beis':(8,8),'bosque':(8,13),'plazacom':(17,8),'museo':(12,8),'rasca':(17,13),'metro':(17,16)}
    night=len(sys.argv)>1
    if night: await pg.evaluate("__dd.S.clock=__dd.DAY*.62")
    W,H=380,340;sheet=Image.new('RGB',(W*4,H*6),'white')
    for row,(k,(x,y)) in enumerate(A.items()):
      i=await pg.evaluate(f"__dd.idx({x},{y})")
      for r in range(4):
        await pg.evaluate(f"(()=>{{while(__dd.ROT!=={r})__dd.turn(1);__dd.setPan(0,0,3);__dd.camTo({i},.01)}})()");await pg.wait_for_timeout(900)
        q=await pg.evaluate(f"(()=>{{const s=__dd.DEFS['{k}'].sz,q=__dd.P({x}+s/2,{y}+s/2);return [q[0]*__dd.zoom,q[1]*__dd.zoom]}})()")
        im=Image.open(io.BytesIO(await pg.screenshot()))
        sheet.paste(im.crop((int(q[0]-W/2),int(q[1]-H+70),int(q[0]+W/2),int(q[1]+70))),(r*W,row*H))
    sheet.save(BUILD+'/capturas/s64-obras-rot%s.png'%('-noche' if night else ''))
    print('errores',errs[:5])
    await b.close()
asyncio.run(main())
