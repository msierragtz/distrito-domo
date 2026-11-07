"""Partitura para guitarra de una pieza del juego (melodía con TAB, cifrado, acordes y patrón de acompañamiento), sacada
directamente de src/js/musica.js. Uso: python3 tools/partitura.py [malecon]  → build/partituras/<id>.pdf (y .png por página)
Se dibuja a mano en SVG (sin LilyPond): pentagrama de guitarra (suena una octava abajo de lo escrito) + tablatura."""
import re,json,os,sys,math,asyncio
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)));OUT=os.path.join(ROOT,'build','partituras');os.makedirs(OUT,exist_ok=True)
TID=sys.argv[1] if len(sys.argv)>1 else 'malecon'
src=open(os.path.join(ROOT,'src/js/musica.js')).read()
m=re.search(r"\{id:'"+TID+r"',name:'([^']*)',from:\d+,feel:'(\w+)',bpm:(\d+),\s*bars:(\[.*?\]\]),\s*head:(\[.*?\])\}",src,re.S)
NAME,FEEL,BPM=m.group(1),m.group(2),int(m.group(3));BARS=json.loads(m.group(4).replace("'",'"'));HEAD=json.loads(m.group(5).replace("'",'"'))
LET={'C':0,'D':1,'E':2,'F':3,'G':4,'A':5,'B':6};PC={'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def pitch(tok):
  mm=re.match(r'([A-G])([#b]?)(\d)',tok);l,a,o=mm.group(1),mm.group(2),int(mm.group(3))
  return {'l':l,'a':a,'o':o,'midi':12*(o+1)+PC[l]+(1 if a=='#' else -1 if a=='b' else 0),'diat':LET[l]+7*o}
# ---------- melodía en compases de 2/4 (cada compás del juego = dos de 2/4, uno por acorde) ----------
def melody(bars):
  ev=[];t=0
  for b in bars:
    for tok in b.split():
      n,l=tok.split(':');l=int(l)
      if n!='-':ev.append({'t':t,'len':l,**pitch(n)})
      t+=l
  return ev,t
def to24(ev,total,first=0):
  nb=total//4;out=[[] for _ in range(nb)]
  for e in ev:
    t,l=e['t'],e['len']
    while l>0:
      b=t//4;s=t%4;d=min(l,4-s);out[b].append({**e,'s':s,'d':d,'tieF':l>d,'tieB':t!=e['t']});t+=d;l-=d
  return out
def fill_rests(bar):
  items=[];occ=[None]*4
  for n in bar:
    for k in range(n['s'],n['s']+n['d']):occ[k]=n
  notes=sorted({id(n):n for n in bar}.values(),key=lambda n:n['s'])
  if not notes:return [{'rest':4,'s':0}]
  s=0
  while s<4:
    if occ[s] is None:
      g=0
      while s+g<4 and occ[s+g] is None:g+=1
      if g==4:items.append({'rest':4,'s':0});break
      if s%2==0 and g>=2:items.append({'rest':2,'s':s});s+=2
      else:items.append({'rest':1,'s':s});s+=1
    else:s+=occ[s]['d']
  return sorted(notes+items,key=lambda n:n['s'])
# ---------- digitación de la melodía en la guitarra (programación dinámica: pocas mudanzas de mano) ----------
OPEN=[64,59,55,50,45,40]   # sonando, cuerdas 1 a 6
def finger(notes):
  cands=[[(s,n['midi']-12-OPEN[s]) for s in range(6) if 0<=n['midi']-12-OPEN[s]<=15] for n in notes]
  cost=lambda c:(1.2 if c[0]>=3 else 0)+(.6 if c[1]==0 else 0)+(.4*(c[1]-12) if c[1]>12 else 0)+(.25*(4-c[1]) if 0<c[1]<4 else 0)
  best=[{c:(cost(c),None) for c in cands[0]}]
  for i in range(1,len(notes)):
    row={}
    for c in cands[i]:
      opts=[(v[0]+cost(c)+.45*abs((c[1] or best[i-1].get(p,(0,))[0]*0+p[1])-p[1])+(0 if abs(c[1]-p[1])<=3 else 1.2),p) for p,v in best[i-1].items()]
      row[c]=min(opts)
    best.append(row)
  c=min(best[-1],key=lambda k:best[-1][k][0]);path=[c]
  for i in range(len(notes)-1,0,-1):c=best[i][c][1];path.append(c)
  return path[::-1]
# ---------- dibujo ----------
SP=1.75;HS=SP/2;TS=2.25
def esc(t):return t.replace('&','&amp;').replace('<','&lt;')
class Pg:
  def __init__(s):s.o=[]
  def add(s,x):s.o.append(x)
  def line(s,x1,y1,x2,y2,w=.18,c='#111'):s.add(f'<line x1="{x1:.2f}" y1="{y1:.2f}" x2="{x2:.2f}" y2="{y2:.2f}" stroke="{c}" stroke-width="{w}"/>')
  def text(s,x,y,t,sz=3,fam='Inter',anchor='start',wt=400,c='#111',style=''):s.add(f'<text x="{x:.2f}" y="{y:.2f}" font-family="{fam}" font-size="{sz}" font-weight="{wt}" fill="{c}" text-anchor="{anchor}" {style}>{esc(t)}</text>')
  def svg(s):return '<svg xmlns="http://www.w3.org/2000/svg" width="210mm" height="297mm" viewBox="0 0 210 297">'+''.join(s.o)+'</svg>'
MUS='FreeSerif'
def chord_label(c):
  q=re.match(r'([A-G][#b]?)(.*)',c);r,x=q.group(1).replace('b','♭').replace('#','♯'),q.group(2)
  x={'m7b5':'m7(♭5)','7b9':'7(♭9)','maj7':'maj7','m7':'m7','7':'7','m6':'m6','69':'6/9','7alt':'7alt'}.get(x,x)
  return r+x
def staff_y(diat,bot):return bot-(diat-30)*HS
def draw_system(pg,y,bars,meta,first_sys,label=None,num=1,last=False,rep=None,end_text=None):
  """bars: lista de dict {items, chord, tab} de 2/4"""
  x0,x1=15,195;top=y+8;bot=top+4*SP;ttop=bot+8.5;tbot=ttop+5*TS
  for k in range(5):pg.line(x0,top+k*SP,x1,top+k*SP,.16)
  for k in range(6):pg.line(x0,ttop+k*TS,x1,ttop+k*TS,.14,'#333')
  pg.line(x0,top,x0,bot,.25);pg.line(x0,ttop,x0,tbot,.25)
  # clave, compás, TAB
  pg.text(x0+1.2,bot-1.0*SP,'\U0001D11E',8.6*SP/1.75*1.0,MUS)
  for k,ch in enumerate('TAB'):pg.text(x0+3.6,ttop+2.6+k*3.4,ch,3.1,'Inter','middle',700)
  ix=x0+9
  if first_sys:pg.text(ix+2.2,top+2*SP-.15,'2',2.6*SP,MUS,'middle',700);pg.text(ix+2.2,bot-.15,'4',2.6*SP,MUS,'middle',700);ix+=6
  if label:pg.add(f'<rect x="{x0:.2f}" y="{y-1.2:.2f}" width="{len(label)*2.1+3:.2f}" height="5" rx=".6" fill="none" stroke="#111" stroke-width=".25"/>');pg.text(x0+1.5,y+2.6,label,3.2,'Inter','start',700)
  pg.text(x0,top-1.2 if not label else y+8.4,str(num),2.2,'Inter','start',400,'#666') if not label else None
  bw=(x1-ix)/len(bars);out=[]
  for bi,b in enumerate(bars):
    bx=ix+bi*bw;pad=2.4+(2.2 if rep=='start' and bi==0 else 0);slot=(bw-pad-2.2)/4
    if b.get('chord'):
      hy=min([staff_y(i['diat'],bot)-(4.2 if i['diat']-30<4 else 1.8) for i in b['items'] if 'rest' not in i]+[top-3.2])
      pg.text(bx+pad,min(top-3.2,hy-1.2),chord_label(b['chord']),3.3,'Inter','start',600)
    acc={}
    for it in b['items']:
      xs=bx+pad+it['s']*slot+slot*.35
      if 'rest' in it:
        if b.get('chordtab'):continue
        r=it['rest']
        if r==4:pg.add(f'<rect x="{bx+bw/2-1.2:.2f}" y="{top+SP:.2f}" width="2.4" height="{.5*SP:.2f}" fill="#111"/>');continue
        g={4:'\U0001D13B',2:'\U0001D13D',1:'\U0001D13E'}[r];xx=bx+bw/2-1 if r==4 else xs
        yy={4:top+SP*1.0+.05,2:top+2*SP+1.25,1:top+2*SP+.9}[r];pg.text(xx,yy,g,3.6*SP/1.75*(1.25 if r==1 else 1.1),MUS);continue
      it['x']=xs;out.append((bi,it))
    b['x0']=bx;b['x1']=bx+bw
    pg.line(bx+bw,top,bx+bw,bot,.2);pg.line(bx+bw,ttop,bx+bw,tbot,.2)
  # notas
  notes=[it for _,it in out]
  for it in notes:
    dy=staff_y(it['diat'],bot);it['y']=dy;step=it['diat']-30
    for L in range(-2,step-1,-2):pg.line(it['x']-2,bot-L*HS,it['x']+2,bot-L*HS,.2)
    for L in range(10,step+1,2):pg.line(it['x']-2,bot-L*HS,it['x']+2,bot-L*HS,.2)
  # alteraciones (por compás)
  for bi,b in enumerate(bars):
    acc={}
    for it in b['items']:
      if 'rest' in it:continue
      key=(it['l'],it['o']);a=it['a'];prev=acc.get(key,'')
      if it.get('tieB'):acc[key]=a;continue
      if a!=prev:
        g={'#':'♯','b':'♭','':'♮'}[a];pg.text(it['x']-2.1,it['y']+(1.0 if a=='#' else .7 if a=='' else .55),g,3.4,MUS,'middle')
      acc[key]=a
  # plicas, corchetes y barras: por tiempo (2 corcheas = 1 tiempo)
  for bi,b in enumerate(bars):
    its=[i for i in b['items'] if 'rest' not in i]
    groups=[];used=set()
    for i in its:
      if i['d']==1 and id(i) not in used:
        mate=[j for j in its if j['d']==1 and j['s']==i['s']+1 and i['s']%2==0]
        if mate:groups.append([i,mate[0]]);used|={id(i),id(mate[0])}
        else:groups.append([i]);used.add(id(i))
      elif i['d']>1:groups.append([i])
    for g in groups:
      avg=sum(i['diat'] for i in g)/len(g)-30;up=avg<4;sl=3.5*SP
      for i in g:
        hollow=i['d']==4
        pg.add(f'<ellipse cx="{i["x"]:.2f}" cy="{i["y"]:.2f}" rx="{.66*SP:.2f}" ry="{.46*SP:.2f}" transform="rotate(-20 {i["x"]:.2f} {i["y"]:.2f})" fill="{"none" if hollow else "#111"}" stroke="#111" stroke-width="{.22 if hollow else .05}"/>')
        if i['d']==3:dyd=-HS/2 if (i['diat']-30)%2==0 else 0;pg.add(f'<circle cx="{i["x"]+1.75:.2f}" cy="{i["y"]+dyd:.2f}" r=".28" fill="#111"/>')
      if len(g)==2:
        a,c=g;xa=a['x']+(.6*SP if up else -.6*SP);xc=c['x']+(.6*SP if up else -.6*SP)
        ya=(min(a['y'],c['y'])-sl) if up else (max(a['y'],c['y'])+sl);slope=max(-1,min(1,(c['y']-a['y'])*.35));yb=ya+slope
        pg.line(xa,a['y'],xa,ya,.18);pg.line(xc,c['y'],xc,yb,.18)
        pg.add(f'<polygon points="{xa:.2f},{ya:.2f} {xc+.09:.2f},{yb:.2f} {xc+.09:.2f},{yb+(.5 if up else -.5):.2f} {xa:.2f},{ya+(.5 if up else -.5):.2f}" fill="#111"/>')
      else:
        i=g[0]
        if i['d']==4 and False:pass
        xs=i['x']+(.6*SP if up else -.6*SP);ye=i['y']-sl if up else i['y']+sl;pg.line(xs,i['y'],xs,ye,.18)
        if i['d']==1:
          if up:pg.add(f'<path d="M{xs:.2f},{ye:.2f} c.2,1.4 2.2,1.8 1.6,4.2 c.1,-1.6 -.9,-2.4 -1.6,-2.6 z" fill="#111"/>')
          else:pg.add(f'<path d="M{xs:.2f},{ye:.2f} c.2,-1.4 2.2,-1.8 1.6,-4.2 c.1,1.6 -.9,2.4 -1.6,2.6 z" fill="#111"/>')
  # ligaduras
  for bi,b in enumerate(bars):
    for i in b['items']:
      if 'rest' in i or not i.get('tieF'):continue
      nxt=None
      if bi+1<len(bars):nxt=next((j for j in bars[bi+1]['items'] if 'rest' not in j and j.get('tieB') and j['midi']==i['midi']),None)
      xa=i['x']+.9;xb=(nxt['x']-.9) if nxt else 196;yy=i['y']+(1.2 if i['diat']-30>=4 else -1.2);dd=1.4 if i['diat']-30>=4 else -1.4
      pg.add(f'<path d="M{xa:.2f},{yy:.2f} Q{(xa+xb)/2:.2f},{yy+dd:.2f} {xb:.2f},{yy:.2f}" fill="none" stroke="#111" stroke-width=".22"/>')
    for i in b['items']:
      if 'rest' in i or not i.get('tieB'):continue
      if bi==0:xb=i['x']-.9;xa=x0+12;yy=i['y']+(1.2 if i['diat']-30>=4 else -1.2);dd=1.4 if i['diat']-30>=4 else -1.4;pg.add(f'<path d="M{xa:.2f},{yy:.2f} Q{(xa+xb)/2:.2f},{yy+dd:.2f} {xb:.2f},{yy:.2f}" fill="none" stroke="#111" stroke-width=".22"/>')
  # tablatura
  for it in notes:
    s,f=it['fing'];yy=ttop+s*TS;t=f'({f})' if it.get('tieB') else str(f);w=len(t)*1.6+.4
    pg.add(f'<rect x="{it["x"]-w/2:.2f}" y="{yy-1.3:.2f}" width="{w:.2f}" height="2.6" fill="#fff"/>');pg.text(it['x'],yy+1.05,t,2.9,'Inter','middle',600,'#555' if it.get('tieB') else '#111')
  for b in bars:
    for (s,f) in b.get('chordtab',[]):
      x=b['x0']+b['ctx'];yy=ttop+s*TS;pg.add(f'<rect x="{x-1.2:.2f}" y="{yy-1.3:.2f}" width="2.4" height="2.6" fill="#fff"/>');pg.text(x,yy+1.05,str(f),2.9,'Inter','middle',600)
  # barras de repetición y final
  if rep=='start':
    bx=bars[0]['x0'];pg.line(bx+.2,top,bx+.2,bot,.7);pg.line(bx+1.1,top,bx+1.1,bot,.18);pg.line(bx+.2,ttop,bx+.2,tbot,.7);pg.line(bx+1.1,ttop,bx+1.1,tbot,.18)
    for yy in (top+1.5*SP,top+2.5*SP):pg.add(f'<circle cx="{bx+2:.2f}" cy="{yy:.2f}" r=".32" fill="#111"/>')
  if rep=='end' or last:
    bx=bars[-1]['x1'];pg.line(bx-1.1,top,bx-1.1,bot,.18);pg.line(bx-.35,top,bx-.35,bot,.7);pg.line(bx-1.1,ttop,bx-1.1,tbot,.18);pg.line(bx-.35,ttop,bx-.35,tbot,.7)
    if rep=='end':
      for yy in (top+1.5*SP,top+2.5*SP):pg.add(f'<circle cx="{bx-2.1:.2f}" cy="{yy:.2f}" r=".32" fill="#111"/>')
  if end_text:pg.text(195,tbot+4.6,end_text,2.7,'Inter','end',400,'#444',style='font-style="italic"')
  return tbot+7
# ---------- armar la pieza ----------
ev,total=melody(HEAD);m24=to24(ev,total)
allnotes=[n for b in m24 for n in sorted(b,key=lambda n:n['s']) if not n.get('tieB')]
fing=finger(allnotes);FM={id(n):f for n,f in zip(allnotes,fing)}
for b in m24:
  for n in b:
    if n.get('tieB'):
      src_=next(x for x in allnotes if x['t']==n['t']);n['fing']=FM[id(src_)]
    else:n['fing']=FM[id(n)]
chords24=[c for pair in BARS for c in pair]
def mk(items,chord):return {'items':fill_rests(items),'chord':chord}
intro=[{'items':[{'rest':4,'s':0}],'chord':c} for c in [c for pair in BARS[-2:] for c in pair]]
head=[mk(m24[k],chords24[k]) for k in range(len(m24))]
for k in range(1,len(head)):
  if head[k]['chord']==head[k-1]['chord']:head[k]['chord']=None
tag=[mk(m24[k],chords24[k]) for k in range(len(m24)-4,len(m24))]
for k in range(1,len(tag)):
  if tag[k]['chord']==tag[k-1]['chord']:tag[k]['chord']=None
# acorde final: Am7 en 5x555x (escrito una octava arriba de lo que suena)
final=[{'items':[{'rest':4,'s':0}],'chord':None,'chordtab':[(5,5),(3,5),(2,5),(1,5)],'ctx':8}]
VOICE={'Am7':'5x555x','Bm7b5':'7x776x','E7b9':'x7676x','Em7b5':'x7878x','A7b9':'5x5656','Dm7':'x5756x','G7':'3x343x','Cmaj7':'x3545x','Fmaj7':'1x221x'}
async def render(html,base):
  from playwright.async_api import async_playwright
  async with async_playwright() as p:
    b=await p.chromium.launch();pg=await b.new_page(viewport={'width':794,'height':1123},device_scale_factor=2)
    await pg.set_content(html);await pg.wait_for_timeout(500)
    await pg.pdf(path=base+'.pdf',format='A4',print_background=True,margin={'top':'0','bottom':'0','left':'0','right':'0'})
    n=await pg.evaluate("document.querySelectorAll('.pag').length")
    for k in range(n):
      el=(await pg.query_selector_all('.pag'))[k];await el.screenshot(path=f'{base}-p{k+1}.png')
    await b.close()
def page1():
  pg=Pg();pg.text(105,22,NAME,9,'Inter','middle',800);pg.text(105,29.5,f'Samba-jazz · negra = {BPM} · La menor · transcripción para guitarra',3.6,'Inter','middle',400,'#444')
  pg.text(195,37,'Distrito Ribera · Distrito Domo',2.8,'Inter','end',400,'#666');pg.text(15,37,'Forma: Intro · Tema · solos sobre la forma · Tema · Tag (2×) · Am7',2.8,'Inter','start',400,'#666')
  return pg
pages=[];pg=page1();y=44
systems=[('Intro',intro,None,None),('Tema',head[0:4],'start',None)]+[(None,head[k:k+4],None,None) for k in range(4,28,4)]+[(None,head[28:32],'end','2×: tema, solos sobre la forma y tema final')]+[('Tag',tag,None,'2×'),('Final',final,None,None)]
num=1
for si,(label,bars,rep,et) in enumerate(systems):
  if si==0:pass
  h=46
  if y+h>290:pages.append(pg);pg=Pg();y=16
  if label=='Final':
    # el acorde final, chiquito: un compás con el acorde y su tablatura
    bars_=final;yb=draw_system(pg,y,bars_,{},False,'Final',num,last=True)
    # notas del acorde: A3 G4 C5 E5 (escritas)
    x=bars_[0]['x0']+bars_[0]['ctx'];bot=y+8+4*SP
    for nm in ['A3','G4','C5','E5']:
      p_=pitch(nm);yy=staff_y(p_['diat'],bot);step=p_['diat']-30
      for L in range(-2,step-1,-2):pg.line(x-2,bot-L*HS,x+2,bot-L*HS,.2)
      pg.add(f'<ellipse cx="{x:.2f}" cy="{yy:.2f}" rx="{.66*SP:.2f}" ry="{.46*SP:.2f}" transform="rotate(-20 {x:.2f} {yy:.2f})" fill="none" stroke="#111" stroke-width=".22"/>')
    pg.text(x,y+8-2.6,'\U0001D110',5,MUS,'middle');pg.text(x+4,y+3,'Am7',3.3,'Inter','start',600)
    # quitar el silencio de compás que dibujó el sistema: lo tapamos
    y=yb;continue
  y=draw_system(pg,y,bars,{},si==0,label,num,rep=rep,end_text=et);num+=len(bars)
pages.append(pg)
# ---------- hoja de acompañamiento ----------
def diagram(pg,x,y,name,v):
  fr=[None if c=='x' else int(c) for c in v];used=[f for f in fr if f];lo=min(used);start=lo if max(used)>4 else 1;W,Hh=16,20;dx=W/5;dy=Hh/4
  pg.text(x+W/2,y-6,chord_label(name),4,'Inter','middle',700)
  for k in range(6):pg.line(x+k*dx,y,x+k*dx,y+Hh,.2)
  for k in range(5):pg.line(x,y+k*dy,x+W,y+k*dy,.35 if (k==0 and start==1) else .2)
  if start>1:pg.text(x-1.5,y+dy*.7,f'{start}',3,'Inter','end',600)
  for s,f in enumerate(fr):
    xx=x+s*dx
    if f is None:pg.text(xx,y-1.2,'×',3,'Inter','middle',600,'#555')
    elif f==0:pg.add(f'<circle cx="{xx:.2f}" cy="{y-2:.2f}" r=".9" fill="none" stroke="#111" stroke-width=".25"/>')
    else:pg.add(f'<circle cx="{xx:.2f}" cy="{y+(f-start+.5)*dy:.2f}" r="1.35" fill="#1f6f78"/>')
pg=Pg();pg.text(15,22,'Acompañamiento',7,'Inter','start',800);pg.text(15,29,'Acordes del tema (de la 6ª cuerda a la 1ª; × = no suena) y el ritmo de samba del juego.',3.2,'Inter','start',400,'#444')
names=['Am7','Bm7b5','E7b9','Em7b5','A7b9','Dm7','G7','Cmaj7','Fmaj7']
for k,n in enumerate(names):diagram(pg,22+(k%5)*36,48+(k//5)*40,n,VOICE[n])
# rejilla de ritmo: 2 compases de 2/4 en semicorcheas, dos vueltas (como en el juego)
def grid(pg,y,title,dedos,pulgar):
  pg.text(15,y,title,3.6,'Inter','start',700);x0,cw=48,8.6;lab=['1','e','&','a','2','e','&','a']*2
  for k in range(16):
    pg.text(x0+k*cw+cw/2,y+6,lab[k],2.8,'Inter','middle',600 if k%4==0 else 400,'#111' if k%4==0 else '#888')
  for r,(nm,hits,col) in enumerate([('Dedos (acorde)',dedos,'#1f6f78'),('Pulgar (bajo)',pulgar,'#c0603f')]):
    yy=y+9+r*8;pg.text(15,yy+4.6,nm,3,'Inter','start',500)
    for k in range(16):
      h=hits.get(k) if isinstance(hits,dict) else (k in hits and '●')
      pg.add(f'<rect x="{x0+k*cw+.4:.2f}" y="{yy:.2f}" width="{cw-.8:.2f}" height="6.4" rx=".8" fill="{col if h else "#f0ece4"}"/>')
      if h and isinstance(hits,dict):pg.text(x0+k*cw+cw/2,yy+4.4,h,2.8,'Inter','middle',700,'#fff')
  pg.line(x0+8*cw,y+8,x0+8*cw,y+26,.35,'#111')
grid(pg,140,'Partido alto · vuelta 1',[0,3,6,10,12],{0:'R',3:'5',4:'5',8:'R',11:'5',12:'5'})
grid(pg,172,'Partido alto · vuelta 2',[2,6,8,11,14],{0:'R',3:'5',4:'5',8:'R',11:'5',12:'5'})
notes_=['Cada compás de 2/4 lleva un acorde. El pulgar hace el surdo: raíz (R) en el 1, y la quinta de abajo (5) en la última',
  'semicorchea del 1 y en el 2. Los dedos tocan el acorde corto y seco (apagado con la palma o soltando la presión).',
  'El juego alterna la vuelta 1 y la vuelta 2 cada dos compases. Si apenas empiezas, toca solo el pulgar y los dedos en',
  '“1” y “&” del 2; luego suma las anticipaciones. Tempo del juego: negra = 104 (un poco más lento de noche).',
  'Melodía: en la guitarra suena una octava abajo de lo escrito (como siempre en guitarra); la tablatura indica cuerda y traste.',
  'Los números entre paréntesis en la tablatura son notas ligadas: no se vuelven a pulsar.']
for k,t in enumerate(notes_):pg.text(15,212+k*5.4,t,3.05,'Inter','start',400,'#333')
pg.text(15,250,'Forma como la toca el juego',3.6,'Inter','start',700)
for k,t in enumerate(['Intro: los dos últimos compases del tema (Bm7(♭5) · E7(♭9) · Am7 · E7(♭9)), solo acompañamiento, una o dos veces.',
  'Tema (32 compases de 2/4) · solos improvisados sobre la misma forma · tema final (a veces medio tono arriba).',
  'Tag: los últimos 4 compases, dos veces · acorde final Am7 con calderón.']):pg.text(15,257+k*5.4,t,3.05,'Inter','start',400,'#333')
pg.text(105,290,'Transcrito del motor de música de Distrito Domo / Distrito Ribera',2.6,'Inter','middle',400,'#888')
pages.append(pg)
FF='/usr/share/fonts/truetype/freefont/FreeSerif.ttf'
html=f"""<!doctype html><html><head><meta charset="utf-8"><style>@font-face{{font-family:FreeSerif;src:url(file://{FF})}}@page{{size:A4;margin:0}}body{{margin:0}}
.pag{{width:210mm;height:297mm;page-break-after:always;overflow:hidden;background:#fff}}.pag:last-child{{page-break-after:auto}}</style></head><body>"""+''.join(f'<div class="pag">{p.svg()}</div>' for p in pages)+"</body></html>"
base=os.path.join(OUT,TID);open(base+'.html','w').write(html)
asyncio.run(render(html,base));print('ok',base+'.pdf',len(pages),'páginas')
