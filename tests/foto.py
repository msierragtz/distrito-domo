"""Modo foto: entra con la tecla F, cambia hora, clima, temporada y filtro, guarda una foto, graba unos segundos de video,
corre el paseo y el time-lapse desde la barra, y sale con Esc. Revisa que la partida no cambie."""
import os,sys;sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)));from comun import ROOT,BUILD,lanzar
import asyncio,json
from playwright.async_api import async_playwright
ESC=open(ROOT+'/tests/datos/escena-muestra.js').read()
async def main():
  async with async_playwright() as p:
    b=await lanzar(p);errs=[]
    for vw,vh in [(1280,800),(390,844)]:
      ctx=await b.new_context(viewport={'width':vw,'height':vh},accept_downloads=True);pg=await ctx.new_page();pg.on('pageerror',lambda e:errs.append(str(e)+' '+(e.stack or '')[:300]))
      await pg.goto('file://'+BUILD+'/arnes.html');await pg.wait_for_timeout(1200);await pg.click('#tcont',force=True);await pg.wait_for_timeout(500)
      await pg.evaluate(ESC);await pg.evaluate("__dd.setPause(false)");await pg.wait_for_timeout(500)
      antes=await pg.evaluate("[__dd.S.clock.toFixed(1),JSON.stringify(__dd.S.g).length,__dd.S.ev&&__dd.S.ev.id]")
      await pg.keyboard.press('f');await pg.wait_for_timeout(500)
      print(vw,'foto',await pg.evaluate("[!!__dd.PHOTO,document.getElementById('fotobar').hidden,getComputedStyle(document.querySelector('header')).display]"))
      await pg.fill('#fHora','78');await pg.wait_for_timeout(200);await pg.click('#fLluvia');await pg.select_option('#fTemp','navidad');await pg.select_option('#fFiltro','retro')
      await pg.wait_for_timeout(2500);await pg.screenshot(path=BUILD+f'/capturas/foto-{vw}.png')
      async with pg.expect_download(timeout=15000) as d:
        await pg.click('#fFoto')
      dl=await d.value;path=BUILD+f'/capturas/foto-guardada-{vw}.png';await dl.save_as(path);print('foto guardada',dl.suggested_filename,os.path.getsize(path))
      if vw>600:
        await pg.click('#fRec');await pg.wait_for_timeout(300);await pg.click('#fPaseo');await pg.wait_for_timeout(3000)
        async with pg.expect_download(timeout=20000) as d:
          await pg.click('#fRec')
        dl=await d.value;path=BUILD+'/capturas/video-'+dl.suggested_filename;await dl.save_as(path);print('video',dl.suggested_filename,os.path.getsize(path))
        await pg.click('#fPaseo')
        await pg.click('#fTL');await pg.wait_for_timeout(1500);print('tl',await pg.evaluate("__dd.TL"));await pg.screenshot(path=BUILD+'/capturas/foto-tl.png')
        await pg.click('#tlStop');await pg.wait_for_timeout(300)
      await pg.keyboard.press('Escape');await pg.wait_for_timeout(400)
      despues=await pg.evaluate("[__dd.S.clock.toFixed(1),JSON.stringify(__dd.S.g).length,__dd.S.ev&&__dd.S.ev.id,!!__dd.PHOTO,!!__dd.REAL]")
      print('antes',antes,'despues',despues)
      await ctx.close()
    print('errores',errs[:4]);await b.close()
asyncio.run(main())
