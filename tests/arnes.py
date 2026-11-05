"""Arma build/arnes.html (el juego con ganchos de prueba en window.__dd) y build/arnes-bots.html (además, el bot de balance).
Uso: python3 tests/arnes.py  (antes: node tools/build.mjs)"""
import os,subprocess,sys
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
from comun import ROOT,BUILD
src=sys.argv[1] if len(sys.argv)>1 else os.path.join(ROOT,'dist','distrito-domo.html')
arnes=os.path.join(BUILD,'arnes.html')
subprocess.check_call([sys.executable,os.path.join(ROOT,'tests','arnes_base.py'),src,arnes])
s=open(arnes).read()
s=s.replace("window.__dd={","window.__dd={camTo:(i,d)=>camTo(i,d),momento:i=>momento(i),zoomAt:(z,x,y)=>zoomAt(z,x,y),get ZA(){return ZA},get CAMG(){return CAMG},get TS(){return TS},get CINE(){return CINE},get INER(){return INER},get pan(){return [panX,panY]},get ROT(){return ROT},turn:d=>turn(d),misProg:id=>misProg(MISI[id]),bizStreet:()=>bizStreet(),greenCnt:()=>greenCnt(),greenStreets:()=>greenStreets(),get FWn(){return FW.length},get DAY(){return DAY},flashAt:(i,d)=>flashAt(i,d),confetti:(i,n)=>confetti(i,n),",1)
open(arnes,'w').write(s)
a="window.claude?.hot?.snapshot?.("
bot=open(os.path.join(ROOT,'tests','bots','bot.js')).read()
open(os.path.join(BUILD,'arnes-bots.html'),'w').write(s.replace(a,bot+"\n"+a,1))
print('listo: build/arnes.html y build/arnes-bots.html')
