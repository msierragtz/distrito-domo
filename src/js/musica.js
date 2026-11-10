/* ---------- música: jazz procedural en vivo (técnicas de Cookie Snake); en la Ribera, bossa, samba, latin jazz y bolero ----------
   Planificador con el reloj de audio (lookahead), swing en corcheas, contrabajo andante con
   aproximación cromática, piano eléctrico FM con voicings sin fundamental, ride "spang-a-lang",
   hi-hat en 2 y 4, escobillas y bombo plumeado. Reverb + eco sincronizado al tempo, compresor.
   Se adapta al juego: de noche más lento y oscuro; con satisfacción baja se apaga la melodía. */
const JAZZ=(()=>{
  const mtof=m=>440*Math.pow(2,(m-69)/12),clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),ramp=(x,a,b)=>clamp((x-a)/(b-a),0,1);
  const NI={C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
  const n2m=s=>{const m=/^([A-G][#b]?)(-?\d)$/.exec(s);return NI[m[1]]+(+m[2]+1)*12};
  function parseBars(bars){const map=new Map();bars.forEach((b,bi)=>{let s=0;b.trim().split(/\s+/).forEach(tok=>{const [n,l]=tok.split(':');if(n!=='-')map.set(bi*8+s,{midi:n2m(n),len:+l});s+=+l});if(s!==8)console.warn('compás',bi+1,'suma',s)});return map}
  /* root = fundamental del bajo; third = tercera; keys = voicing sin fundamental (7ª, 9ª, 13ª) */
  const CH={
    Cmaj7:{root:48,third:4,keys:[64,67,71,74]}, A7:{root:45,third:4,keys:[61,66,67,71]},
    Dm7:{root:50,third:3,keys:[60,64,65,69]},   G7:{root:43,third:4,keys:[59,64,65,69]},
    Em7:{root:40,third:3,keys:[62,66,67,71]},   C7:{root:48,third:4,keys:[58,62,64,69]},
    Fmaj7:{root:41,third:4,keys:[64,67,69,72]}, Fm7:{root:41,third:3,keys:[63,67,68,72]},
    Bb7:{root:46,third:4,keys:[60,62,67,68]},   Eb7:{root:51,third:4,keys:[61,65,67,72]}
  };
  const RIDE=[.8,0,.65,.5,.75,0,.65,.5];
  let curCh=null,compN=null,irBuf=null;
  let ctx=null,master,musicBus,revIn,noiseBuf,L={},keysIn,leadIn,gtrIn,glIn,dly,timer=null,step=0,next=0;
  const pref={on:true,vol:.55};try{const p=JSON.parse(localStorage.getItem('distritoDomo.musica')||'null');if(p)Object.assign(pref,p)}catch(e){}
  const st={night:0,sat:.8,ev:null,red:false,phase:1,kiosk:false,vec:0};
  /* ---------- repertorio: piezas originales que se desbloquean con la población ---------- */
  Object.assign(CH,{
    Gm7:{root:43,third:3,keys:[58,62,65,69]},  Bbmaj7:{root:46,third:4,keys:[57,60,62,65]},
    Bbm7:{root:46,third:3,keys:[56,60,61,65]}, Am7:{root:45,third:3,keys:[60,64,67,71]},
    D7:{root:50,third:4,keys:[60,64,66,71]},   Cm7:{root:48,third:3,keys:[58,62,63,67]},
    Ab7:{root:44,third:4,keys:[54,58,60,65]}
  });
  const TUNES=[
    {id:'tarde',name:'Tarde en el Cañón',from:0,feel:'swing',bpm:100,
     bars:[['Cmaj7','A7'],['Dm7','G7'],['Cmaj7','A7'],['Dm7','G7'],['Em7','A7'],['Dm7','G7'],['Cmaj7','C7'],['Fmaj7','Fmaj7'],
           ['Fm7','Bb7'],['Em7','A7'],['Dm7','G7'],['Em7','Eb7'],['Dm7','G7'],['Cmaj7','A7'],['Dm7','G7'],['Cmaj7','G7']],
     head:['E5:2 G5:2 A5:1 G5:1 E5:2','F5:3 E5:1 D5:2 -:2','E5:2 G5:2 C6:3 B5:1','A5:2 F5:2 D5:2 -:2',
           'G5:2 B5:1 A5:1 G5:2 E5:2','F5:2 A5:1 G5:1 F5:2 D5:2','E5:3 D5:1 C5:2 Bb4:2','A4:4 -:2 C5:2',
           'Ab4:2 C5:2 Eb5:3 D5:1','G4:2 B4:2 E5:2 C#5:2','D5:3 F5:1 A5:2 G5:2','G5:2 E5:2 Db5:3 -:1',
           'C5:2 D5:2 F5:2 Ab5:1 G5:1','E5:4 C#5:2 E5:2','D5:2 F5:2 B4:2 D5:2','C5:4 -:4']},
    {id:'brisa',name:'Brisa de la Huasteca',from:300,feel:'bossa',bpm:112,
     bars:[['Fmaj7','Fmaj7'],['Dm7','Dm7'],['Gm7','C7'],['Fmaj7','Fmaj7'],['Bbmaj7','Bbmaj7'],['Bbm7','Eb7'],['Am7','D7'],['Gm7','C7'],
           ['Fmaj7','Fmaj7'],['Dm7','Dm7'],['Gm7','C7'],['Am7','D7'],['Bbmaj7','Bbm7'],['Am7','D7'],['Gm7','C7'],['Fmaj7','C7']],
     head:['A4:3 C5:1 E5:4','D5:2 F5:2 A4:4','Bb4:2 D5:2 E5:3 G4:1','A4:6 -:2',
           'D5:3 F5:1 A5:4','Db5:2 F5:2 G5:3 Db5:1','C5:2 E5:2 F#5:3 C5:1','Bb4:4 -:2 C5:2',
           'A4:3 C5:1 E5:4','F5:2 A5:2 D5:4','F5:2 D5:2 E5:3 Bb4:1','C5:4 A4:2 F#4:2',
           'D5:3 C5:1 Db5:4','C5:3 A4:1 F#4:4','G4:2 Bb4:2 E5:3 D5:1','F4:4 -:4']},
    {id:'noche',name:'Noche en Ordóñez',from:800,feel:'blues',bpm:86,
     bars:[['Cm7','Cm7'],['Cm7','Cm7'],['Cm7','Cm7'],['C7','C7'],['Fm7','Fm7'],['Fm7','Fm7'],['Cm7','Cm7'],['Cm7','Cm7'],
           ['Ab7','Ab7'],['G7','G7'],['Cm7','Cm7'],['G7','G7']],
     head:['G4:2 Bb4:2 C5:3 -:1','Eb5:2 C5:2 G4:4','G4:2 Bb4:2 C5:1 Eb5:1 F5:2','Gb5:1 F5:1 Eb5:2 C5:4',
           'C5:2 Eb5:2 F5:3 -:1','Ab5:2 F5:2 C5:4','G4:2 Bb4:2 C5:3 -:1','Eb5:2 C5:2 G4:4',
           'Gb5:3 F5:1 Eb5:2 C5:2','D5:2 F5:2 B4:4','C5:2 Eb5:2 G5:3 F5:1','D5:4 B4:2 -:2']},
    {id:'sierra',name:'Sierra Madre',from:2000,feel:'modal',bpm:124,
     bars:[['Dm7','Dm7'],['Dm7','Dm7'],['Dm7','Dm7'],['Dm7','Dm7'],['Bbmaj7','Bbmaj7'],['Bbmaj7','Bbmaj7'],['C7','C7'],['C7','C7'],
           ['Dm7','Dm7'],['Dm7','Dm7'],['Dm7','Dm7'],['Dm7','Dm7'],['Gm7','Gm7'],['Gm7','Gm7'],['A7','A7'],['A7','A7']],
     head:['D5:3 E5:1 F5:2 A5:2','G5:4 E5:2 C5:2','D5:3 A4:1 C5:2 D5:2','F5:6 -:2',
           'D5:2 F5:2 A5:4','G5:3 F5:1 D5:4','E5:2 G5:2 Bb5:3 -:1','A5:4 G5:2 E5:2',
           'D5:3 E5:1 F5:2 A5:2','C6:4 A5:2 G5:2','F5:3 E5:1 D5:2 C5:2','D5:6 -:2',
           'Bb4:2 D5:2 F5:4','G5:3 F5:1 D5:4','C#5:2 E5:2 G5:3 -:1','A5:4 E5:2 C#5:2']}
  ];
  /* ---------- Distrito Ribera: bossa, samba-jazz, latin jazz y bolero (piezas originales) ---------- */
  const RIB=typeof DIST!=='undefined'&&DIST==='ribera';
  // acordes por nombre: teclas sin fundamental entre 57 y 74, como los del Cañón
  const QUAL={maj7:[4,7,11,14],m7:[3,7,10,14],'7':[4,9,10,14],m7b5:[3,6,10,12],'7b9':[4,7,10,13],'7alt':[4,8,10,15],m6:[3,7,9,14],'69':[4,7,9,14]};
  function chordOf(sym){if(CH[sym])return CH[sym];const m=/^([A-G][#b]?)(.*)$/.exec(sym),pc=NI[m[1]],q=QUAL[m[2]];if(!q)throw new Error('acorde '+sym);let root=36+pc;if(root<40)root+=12;
    return CH[sym]={root,third:/^m(?!aj)/.test(m[2])?3:4,keys:q.map(iv=>{let x=pc+iv;while(x<57)x+=12;while(x>74)x-=12;return x}).sort((a,b)=>a-b)}}
  const RTUNES=[
    {id:'orilla',name:'Orilla del Santa Catarina',from:0,feel:'bossa',bpm:128,
     bars:[['Dmaj7','Dmaj7'],['E7','E7'],['Em7','A7'],['F#m7','B7b9'],['Em7','Em7'],['Gm6','C7'],['F#m7','B7b9'],['Em7','A7'],
           ['Dmaj7','Dmaj7'],['E7','E7'],['Em7','A7'],['F#m7','B7b9'],['Gmaj7','Gm6'],['F#m7','B7b9'],['Em7','A7'],['D69','A7']],
     head:['-:1 F#5:2 A5:1 C#6:4','B5:3 G#5:1 F#5:4','G5:2 F#5:1 E5:3 C#5:2','E5:3 A5:1 D#5:2 C5:2',
           'B4:2 D5:2 F#5:4','E5:3 Bb4:1 E5:2 D5:2','C#5:3 E5:1 D#5:2 F#5:2','B4:2 D5:1 E5:1 G5:2 C#5:2',
           'D5:3 F#5:1 A5:4','G#5:3 B5:1 D6:4','C#6:2 B5:1 A5:1 G5:2 E5:2','A5:3 E5:1 F#5:2 D#5:2',
           'B5:4 Bb5:4','A5:3 C#5:1 D#5:2 A5:2','G5:2 F#5:2 E5:2 C#5:2','D5:4 -:4']},
    {id:'luna',name:'Luna sobre el Lecho',from:150,feel:'bolero',bpm:72,
     bars:[['Gmaj7','Gmaj7'],['F#m7b5','B7b9'],['Em7','Em7'],['Dm7','G7'],['Cmaj7','Cmaj7'],['Cm6','F7'],['Bm7','E7'],['Am7','D7'],
           ['Gmaj7','Gmaj7'],['F#m7b5','B7b9'],['Em7','Em7'],['Dm7','G7'],['Cmaj7','Cm6'],['Bm7','E7b9'],['Am7','D7'],['G69','D7']],
     head:['B5:5 A5:1 G5:1 F#5:1','A5:4 D#5:4','G5:3 F#5:1 E5:2 B4:2','C5:3 D5:1 F5:2 B4:2',
           'E5:5 D5:1 C5:1 B4:1','Eb5:3 G5:1 A5:2 Eb5:2','D5:3 F#5:1 G#5:2 B5:2','C6:3 B5:1 A5:2 F#5:2',
           'G5:2 B5:2 D6:3 C6:1','C6:4 B5:2 A5:2','G5:6 -:2','A5:3 F5:1 B4:2 D5:2',
           'E5:4 Eb5:4','D5:3 B4:1 G#4:2 F5:2','E5:2 C5:2 F#5:2 A5:2','G5:4 -:4']},
    {id:'malecon',name:'Samba del Malecón',from:500,feel:'samba',bpm:104,
     bars:[['Am7','Am7'],['Bm7b5','E7b9'],['Am7','Am7'],['Em7b5','A7b9'],['Dm7','Dm7'],['G7','G7'],['Cmaj7','Cmaj7'],['Bm7b5','E7b9'],
           ['Am7','Am7'],['Bm7b5','E7b9'],['Am7','Am7'],['Em7b5','A7b9'],['Dm7','G7'],['Cmaj7','Fmaj7'],['Bm7b5','E7b9'],['Am7','E7b9']],
     head:['-:1 E5:1 A5:1 C6:2 B5:1 A5:2','F5:3 D5:1 G#5:3 B5:1','A5:3 E5:1 C6:4','Bb5:2 G5:1 E5:1 C#6:3 Bb5:1',
           '-:1 A5:1 F5:1 A5:2 C6:3','B5:2 A5:1 G5:1 F5:2 D5:2','E5:3 G5:1 B5:4','A5:2 F5:1 D5:1 G#5:2 E5:2',
           '-:1 E5:1 A5:1 C6:2 E6:1 D6:2','D6:2 B5:1 F5:1 E5:3 G#5:1','A5:6 -:2','G5:2 Bb5:1 G5:1 E5:2 C#5:2',
           'D5:2 F5:1 A5:1 B5:2 G5:2','E5:3 C5:1 A5:2 E5:2','D5:2 F5:1 A5:1 G#5:2 B5:2','A5:4 -:4']},
    {id:'puente',name:'Descarga en el Puente',from:1200,feel:'latin',bpm:176,
     bars:[['Gm7','C7'],['Gm7','C7'],['Gm7','C7'],['Gm7','C7'],['Cm7','F7'],['Bbmaj7','Ebmaj7'],['Am7b5','D7b9'],['Gm7','D7b9'],
           ['Gm7','C7'],['Gm7','C7'],['Gm7','C7'],['Gm7','C7'],['Cm7','F7'],['Bbmaj7','Ebmaj7'],['Am7b5','D7b9'],['Gm7','Gm7']],
     head:['D5:1 F5:1 G5:2 -:1 Bb5:1 A5:2','G5:3 F5:1 E5:2 -:2','D5:1 F5:1 G5:2 -:1 C6:1 Bb5:2','A5:3 G5:1 E5:4',
           'Eb5:2 G5:1 Bb5:1 A5:2 F5:2','D5:3 F5:1 G5:4','C6:2 A5:1 Eb5:1 F#5:3 Eb5:1','D5:4 -:2 A4:2',
           'D5:1 F5:1 G5:2 -:1 Bb5:1 D6:2','C6:2 Bb5:1 G5:1 E5:2 -:2','D5:1 F5:1 G5:2 -:1 Bb5:1 A5:2','G5:2 F5:1 D5:1 E5:4',
           'G5:2 Bb5:1 Eb6:1 C6:2 A5:2','D6:3 Bb5:1 G5:4','Eb6:2 C6:1 A5:1 F#5:2 C6:2','G5:4 -:4']}
  ];
  if(RIB){for(const tu of RTUNES)for(const p of tu.bars)for(const c of p)chordOf(c);TUNES.length=0;TUNES.push(...RTUNES)}
  const RSOLO={bossa:['gtr','flute','vib','sax'],samba:['flute','gtr','vib','sax'],latin:['piano','vib','flute','sax'],bolero:['gtr','sax','vib']};
  function ribBass(R,tu,hb,feel){const [a,b]=tu.bars[hb],nx=tu.bars[(hb+1)%tu.bars.length][0],A=CH[a],B=CH[b],X=CH[nx],f=m=>{while(m>52)m-=12;while(m<38)m+=12;return m};
    if(feel==='samba')return [A,B].flatMap((C,i)=>[{s:i*4,m:f(C.root),l:1.5,v:1},{s:i*4+1.5,m:f(C.root-5),l:.5,v:.7},{s:i*4+2,m:f(C.root-5),l:2,v:.92}]);
    if(feel==='latin')return [{s:3,m:f(a===b?A.root+7:B.root),l:3,v:.95},{s:6,m:f(X.root),l:5,v:1}];
    if(feel==='bolero')return [{s:0,m:f(A.root),l:3,v:1},{s:3,m:f(A.root+7),l:1,v:.75},{s:4,m:f(B.root),l:3,v:.95},{s:7,m:f(X.root-1),l:1,v:.7}];
    const ant=R()<.25;return [{s:0,m:f(A.root),l:3,v:1},{s:3,m:f(A.root+7),l:1,v:.78},{s:4,m:f(B.root),l:3,v:.95},{s:7,m:ant?f(X.root):f(B.root+7),l:ant?2:1,v:.8}]}
  // acompañamiento en dieciseisavos (dos por paso): batida de bossa y partido alto
  function ribComp(R,feel,hb){const o=hb&1;if(feel==='bossa')return R()<.8?(o?[4,10]:[0,6,12]):(o?[2,8,12]:[0,6,10]);if(feel==='samba')return o?[2,6,8,11,14]:[0,3,6,10,12];return []}
  let rendering=false,forced=null;
  for(const tu of TUNES)tu.H=parseBars(tu.head);
  const XC=new Map();const xp=(c,tr)=>{if(!tr)return c;const k=c.root+'|'+tr+'|'+c.keys.join();let r=XC.get(k);if(!r){r={root:c.root+tr,third:c.third,keys:c.keys.map(m=>m+tr)};XC.set(k,r)}return r};
  /* ---------- arreglo: cada vuelta se escribe de nuevo (intro, tema, solos, final) ---------- */
  let ARR=[],CUR=null,lastTune='',setN=0;
  const RANGE={piano:[62,84],sax:[55,76],vib:[65,86],bass:[40,58],gtr:[55,76],flute:[67,86]};
  function genBass(R,tu,hb,feel){if(RIB)return ribBass(R,tu,hb,feel);const [a,b]=tu.bars[hb],nx=tu.bars[(hb+1)%tu.bars.length][0],A=CH[a],B=CH[b],X=CH[nx],fold=m=>{while(m>55)m-=12;while(m<38)m+=12;return m};
    if(feel==='bossa')return [{s:0,m:fold(A.root),l:3,v:1},{s:3,m:fold(A.root+7),l:1,v:.8},{s:4,m:fold(B.root),l:3,v:.95},{s:7,m:fold(B.root+7),l:1,v:.8}];
    const q=[A.root,A.root+(R()<.5?A.third:7),a===b?A.root+(R()<.5?12:10):B.root,X.root+(R()<.5?-1:1)].map(fold);return q.map((m,i)=>({s:i*2,m,l:2,v:i===0?1:.88}))}
  function genComp(R,feel,hb){if(RIB)return ribComp(R,feel,hb);if(feel==='bossa')return R()<.5?[0,3,6]:[2,5,7];if(feel==='blues')return R()<.7?[2,6]:[1,4,6];if(feel==='modal')return R()<.5?[0,3]:[2,5];
    const pats=[[0,3],[0,3,7],[1,4],[0,5],[2,3,6],[0,3,6],[1,5]];return pats[Math.floor(R()*pats.length)]}
  function genSolo(R,tu,hb,inst,prevRef,last){const out=new Map(),[lo,hi]=RANGE[inst];let s=0;
    const rh=[[2,1,1],[1,1,2],[3,1],[1,1,1,1],[2,2],[-1,1,2],[-2,1,1],[1,2,1],[-1,1,1,1],[4]];
    for(const half of [0,1]){const ch=CH[tu.bars[hb][half]],tones=[];for(let o=-24;o<=24;o+=12)for(const k of ch.keys.concat([ch.root+12,ch.root+24]))tones.push(k+o);
      const pool=[...new Set(tones)].filter(m=>m>=lo&&m<=hi).sort((x,y)=>x-y);if(tu.feel==='blues'&&R()<.4)pool.push(lo+((66-lo)%12+12)%12);
      const pat=(last&&half===1)?[2,-2]:rh[Math.floor(R()*rh.length)];
      for(const l of pat){const len=Math.abs(l);if(l>0){const want=prevRef.v+(R()<.5?-1:1)*(1+Math.floor(R()*3));let best=pool[0],bd=99;for(const m of pool){const d=Math.abs(m-want);if(d<bd){bd=d;best=m}}prevRef.v=best;out.set(s,{midi:best,len,inst})}s+=len}}
    return out}
  function pickTune(){if(forced){const f=TUNES.find(t=>t.id===forced);if(f)return f}const v=st.vec||0,ok=TUNES.filter(t=>v>=t.from);if(ok.length===1)return ok[0];
    const n=st.night,rw=t=>t.feel==='bolero'?(.5+3*n)*(st.ev==='lluvia'?2:1):t.feel==='bossa'?1.6-.8*n:t.feel==='samba'?(1.2-.7*n)*(st.ev==='clasico'?3:1):(1-.4*n)*(st.phase>=3?1.4:1);
    const w=ok.map(t=>(t.id===lastTune?.15:1)*(RIB?rw(t):1)*(t.id==='noche'?(1+2.5*st.night):1)*(t.id==='brisa'?(1.4-.6*st.night):1)*(t.id==='sierra'&&st.phase>=4?1.3:1)*(t.id==='noche'&&st.ev==='lluvia'?2:1));
    let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<ok.length;i++){r-=w[i];if(r<=0)return ok[i]}return ok[0]}
  function buildSet(){
    const tu=pickTune(),v=st.vec||0,R=rng((Date.now()&0xffff)+(++setN)*977),n=tu.bars.length,feel=tu.feel;lastTune=tu.id;
    const solos=[];const insts=RIB?RSOLO[feel].filter(i=>i==='vib'?st.phase>=2:i==='sax'?st.phase>=3||st.kiosk:true):['piano'];if(!RIB&&st.phase>=2)insts.push('vib');if(!RIB&&(st.phase>=3||st.kiosk))insts.push('sax');
    const nSolo=v>=1000&&R()<.6?2:1;for(let k=0;k<nSolo;k++)solos.push(insts[(setN+k)%insts.length]);if(v>=3000&&R()<.6)solos.push('bass');
    const mod=v>=1500&&R()<.7?1:0,arr=[];
    const sec=(name,tr,inst,from=0,to=n)=>{const pr={v:inst==='bass'?48:inst==='sax'?67:72};for(let hb=from;hb<to;hb++){arr.push({tu,hb,sec:name,tr,inst,bass:genBass(R,tu,hb,feel),comp:genComp(R,feel,hb),
      lead:name==='solo'?genSolo(R,tu,hb,inst,pr,hb%2===1):name==='head'||name==='out'||name==='tag'?tu.H:null,fill:hb===to-1&&feel!=='bossa'})}};
    sec('intro',0,null,n-(n===12?4:2),n);if(n!==12&&R()<.5)sec('intro',0,null,n-2,n);
    sec('head',0,'piano');for(const ins of solos)sec('solo',0,ins);sec('out',mod,'piano');
    sec('tag',mod,'piano',n-2,n);if(v>=3000)sec('tag',mod,'piano',n-2,n);
    arr.push({tu,hb:0,sec:'end',tr:mod,bass:[],comp:[],lead:null});arr.push({tu,hb:0,sec:'rest',tr:0,bass:[],comp:[],lead:null});
    ARR=arr;CUR=arr[0];return arr.length*8}
  let STEPS=buildSet();

  const bpm=()=>(CUR?CUR.tu.bpm:100)-(CUR&&CUR.tu.feel==='blues'?6:CUR&&CUR.tu.feel==='bolero'?3:CUR&&CUR.tu.feel==='latin'?14:RIB?10:16)*st.night+(st.ev==='clasico'?(RIB?8:10):0)+(st.ev==='bazar'?4:0);
  function noise(dur,vol,o){const {hp=6000,type='highpass',q=.7,at,bus}=o;const src=ctx.createBufferSource();src.buffer=noiseBuf;
    const f=ctx.createBiquadFilter();f.type=type;f.frequency.value=hp;f.Q.value=q;const g=ctx.createGain();
    g.gain.setValueAtTime(vol,at);g.gain.exponentialRampToValueAtTime(.0001,at+dur);src.connect(f);f.connect(g);g.connect(bus);
    src.start(at,Math.random()*(noiseBuf.duration-dur-.1));src.stop(at+dur+.02)}
  function epiano(midi,t,dur,vel,dest,bell){
    const f=mtof(midi),end=t+Math.max(dur,.3)+.35,pk=.12*vel,br=.75-.25*st.night;
    const env=ctx.createGain();env.gain.setValueAtTime(.0001,t);env.gain.exponentialRampToValueAtTime(pk,t+.006);env.gain.exponentialRampToValueAtTime(pk*.3,t+.6);env.gain.exponentialRampToValueAtTime(.0001,end);
    const car=ctx.createOscillator();car.frequency.value=f;const mod=ctx.createOscillator();mod.frequency.value=f;const mg=ctx.createGain();
    mg.gain.setValueAtTime(f*(bell?2:1.4)*br,t);mg.gain.exponentialRampToValueAtTime(f*.25,t+.5);mod.connect(mg);mg.connect(car.frequency);
    const har=ctx.createOscillator();har.frequency.value=f*2;const hg=ctx.createGain();hg.gain.setValueAtTime(.22,t);hg.gain.exponentialRampToValueAtTime(.0001,t+.35);
    car.connect(env);har.connect(hg);hg.connect(env);env.connect(dest);
    for(const o of [car,mod,har]){o.start(t);o.stop(end+.05)}}
  function upright(midi,t,dur,vel){
    const f=mtof(midi),end=t+dur+.06,pk=.42*vel;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.Q.value=.9;
    lp.frequency.setValueAtTime(1300,t);lp.frequency.exponentialRampToValueAtTime(380,t+.2);
    const g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(pk,t+.012);g.gain.exponentialRampToValueAtTime(pk*.45,t+.25);g.gain.exponentialRampToValueAtTime(.0001,end);
    const tri=ctx.createOscillator();tri.type='triangle';tri.frequency.value=f;const sin=ctx.createOscillator();sin.frequency.value=f;
    const saw=ctx.createOscillator();saw.type='sawtooth';saw.frequency.value=f;const sg=ctx.createGain();sg.gain.value=.22;
    tri.connect(lp);saw.connect(sg);sg.connect(lp);lp.connect(g);sin.connect(g);g.connect(L.bass);
    for(const o of [tri,sin,saw]){o.start(t);o.stop(end+.02)}
    noise(.03,.05*vel,{hp:1200,type:'bandpass',q:.8,at:t,bus:L.bass})}
  /* vibráfono (fase 2): senos con trémolo de motor */
  function vibes(midi,t,dur,vel,dest){const f=mtof(midi),end=t+dur+1.2,g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07*vel,t+.01);g.gain.exponentialRampToValueAtTime(.0001,end);
    const tr=ctx.createGain();tr.gain.value=.75;const lfo=ctx.createOscillator(),la=ctx.createGain();lfo.frequency.value=5.5;la.gain.value=.25;lfo.connect(la);la.connect(tr.gain);
    const o=ctx.createOscillator();o.frequency.value=f;const o2=ctx.createOscillator();o2.frequency.value=f*4;const g2=ctx.createGain();g2.gain.setValueAtTime(.12,t);g2.gain.exponentialRampToValueAtTime(.0001,t+.25);
    o.connect(g);o2.connect(g2);g2.connect(g);g.connect(tr);tr.connect(dest||L.vib);for(const x of [o,o2,lfo]){x.start(t);x.stop(end+.05)}}
  /* saxo (fase 3): sierra filtrada con vibrato que entra tarde y soplo */
  function sax(midi,t,dur,vel){const f=mtof(midi),end=t+dur+.08,g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.09*vel,t+.04);g.gain.setValueAtTime(.08*vel,end-.06);g.gain.exponentialRampToValueAtTime(.0001,end);
    const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.Q.value=2;lp.frequency.setValueAtTime(900,t);lp.frequency.linearRampToValueAtTime(1900,t+.12);lp.frequency.linearRampToValueAtTime(1300,end);
    const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;const v=ctx.createOscillator(),vg=ctx.createGain();v.frequency.value=5.2;vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*.008,t+Math.min(.35,dur));v.connect(vg);vg.connect(o.frequency);
    o.connect(lp);lp.connect(g);g.connect(L.sax);for(const x of [o,v]){x.start(t);x.stop(end+.05)}
    noise(.06,.012*vel,{hp:2500,type:'bandpass',q:1,at:t,bus:L.sax})}
  /* metales (fase 4): golpes cortos de acorde */
  function brass(midis,t,vel,dest){for(const m of midis){const f=mtof(m),g=ctx.createGain(),lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(600,t);lp.frequency.exponentialRampToValueAtTime(2600,t+.05);lp.frequency.exponentialRampToValueAtTime(800,t+.3);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.045*vel,t+.03);g.gain.exponentialRampToValueAtTime(.0001,t+.38);
    const o=ctx.createOscillator();o.type='sawtooth';o.frequency.value=f;const o2=ctx.createOscillator();o2.type='sawtooth';o2.frequency.value=f;o2.detune.value=9;
    o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(dest||L.brass);for(const x of [o,o2]){x.start(t);x.stop(t+.42)}}}
  function feather(t,v){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(55,t+.09);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.5*v,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g);g.connect(L.kick);o.start(t);o.stop(t+.25)}
  const ride=(t,v)=>{noise(.34,.05*v,{hp:7200,at:t,bus:L.ride});noise(.02,.045*v,{hp:10000,at:t,bus:L.ride})};
  const chick=t=>noise(.05,.12,{hp:7800,at:t,bus:L.hat});
  const swish=(t,v,long)=>noise(long?.2:.11,.05*v*(long?1.5:1),{hp:3800,type:'bandpass',q:.45,at:t,bus:L.brush});
  function snare(t,v){noise(.09,.07*v,{hp:1900,type:'bandpass',q:.9,at:t,bus:L.brush});noise(.04,.05*v,{hp:5200,at:t,bus:L.hat})}
  function rim(t,v){noise(.03,.16*v,{hp:2600,type:'bandpass',q:5,at:t,bus:L.hat})}
  function play(stepI,t,d){if(RIB)return playRib(stepI,t,d);
    const gb=stepI>>3,s=stepI&7,B=ARR[gb];if(!B)return;CUR=B;const tu=B.tu,feel=tu.feel;
    if(B.sec==='rest')return;
    const pair=tu.bars[B.hb],C=xp(CH[pair[s<4?0:1]],B.tr);curCh=C;
    const swing=feel!=='bossa',tt=t+((s&1)&&swing?d*.17:0);
    if(B.sec==='end'){if(s===0){const F=xp(CH[tu.bars[tu.bars.length-1][0]],B.tr);for(let i=0;i<F.keys.length;i++)epiano(F.keys[i],t+i*.03,d*7,.45,keysIn,false);
        upright(F.root>55?F.root-12:F.root,t,d*6,1);feather(t,1);noise(1.6,.05,{hp:6500,at:t,bus:L.ride});if(st.phase>=2)vibes(F.keys[3]+12,t+.1,d*6,.9)}return}
    for(const n of B.bass)if(n.s===s){upright(n.m+B.tr,feel==='bossa'?t:t,n.l*d*.92,n.v);if(feel!=='bossa')feather(t,n.s===0?1:.6)}
    if(feel==='bossa'&&(s===0||s===3||s===4||s===7))feather(t,s===0||s===4?.75:.45);
    if(B.comp.includes(s)){for(let i=0;i<C.keys.length;i++)epiano(C.keys[i],tt+i*.011,d*(feel==='bossa'?1.6:2.2),.34+.05*(i&1),keysIn,false)}
    const note=B.lead?B.lead.get(B.sec==='solo'?s:B.hb*8+s):null;
    if(note){const m=note.midi+B.tr,inst=note.inst||B.inst||'piano',len=note.len*d;
      if(inst==='piano'){if(B.sec==='out'&&note.len>=3&&(gb*5+s)%3===0)epiano(m-1,Math.max(tt-.075,ctx.currentTime),.08,.5,leadIn,true);epiano(m,tt,len*.95,B.sec==='solo'?.75:.85,leadIn,true)}
      else if(inst==='sax')sax(m,tt,len*.92,.9);else if(inst==='vib')vibes(m,tt,len*1.4,.95,L.lead);else if(inst==='bass')upright(m,tt,len*.9,1.05);
      if(B.sec!=='solo'){if(st.phase>=3&&B.sec!=='head')sax(m-12,tt,len*.92,.7);else if(st.kiosk&&B.sec==='head')sax(m,tt,len*.9,.55)}}
    if(st.phase>=2&&(s===0||s===4)&&(B.sec==='head'||B.sec==='out')&&feel!=='bossa'){const k=C.keys;vibes(k[(gb+s)%4]+12,tt,d*3,.8);if(s===0)vibes(k[(gb+2)%4]+12,tt+d,d*2,.55)}
    if(st.phase>=4&&B.comp.includes(s)&&(B.sec==='out'||B.sec==='tag'||(feel==='modal'&&B.sec==='head'))&&(s===3||s===7||(gb%4===3&&s===6)))brass(C.keys.map(m=>m-12),tt,.9);
    if(feel==='bossa'){const clave=(B.hb%2===0)?[0,3,6]:[2,4];if(clave.includes(s))rim(t,.9);noise(.03,.035,{hp:8000,at:t,bus:L.hat});if(s===2||s===6)swish(t,.35,false)}
    else{if(RIDE[s])ride(tt,RIDE[s]*(feel==='blues'?.7:feel==='modal'?1.15:1));if(s===2||s===6)chick(t);
      if(!(s&1))swish(t,(s===2||s===6)?.9:.45,s===2||s===6);else swish(tt,.22,false);
      if(B.fill&&s>=4&&!lowFill()){snare(tt,s===7?1:.55+.1*s/7);if(s===6)snare(tt+d*.5,.5)}}
  }
  /* ---------- Ribera: guitarra de nailon (Karplus-Strong), flauta y percusión latina ---------- */
  const KSB=new Map();   // cuerdas pulsadas a 22 kHz: la guitarra va por un pasabajos de 3 kHz, así ocupan la mitad de memoria
  function ksBuf(midi){const sr=22050,key=midi;let b=KSB.get(key);if(b)return b;
    const f=mtof(midi),Pd=sr/f,N=Math.max(2,Math.floor(Pd-.75)),dl=Pd-N-.5,C=(1-dl)/(1+dl),T60=clamp(2.7-(midi-48)*.045,1.1,2.7),rho=Math.min(.9995,Math.exp(-6.9/(f*T60))/Math.cos(Math.PI*f/sr));
    const len=Math.floor(sr*Math.min(2.6,T60*1.05)),out=new Float32Array(len),ring=new Float32Array(N),ex=new Float32Array(N);
    let lp=0;for(let i=0;i<N;i++){lp+=.5*((Math.random()*2-1)-lp);ex[i]=lp}   // pulsación suave, con la yema
    const pp=Math.max(1,Math.round(N*.13));let mx=0,mean=0;for(let i=0;i<N;i++){ring[i]=ex[i]-(i>=pp?ex[i-pp]:0);mean+=ring[i]}mean/=N;for(let i=0;i<N;i++){ring[i]-=mean;mx=Math.max(mx,Math.abs(ring[i]))}
    for(let i=0;i<N;i++)ring[i]*=.8/(mx||1);
    let w=0,pa=0,ax=0,ay=0;for(let i=0;i<len;i++){const a=ring[w];out[i]=a;const lo=.5*(a+pa);pa=a;const ap=C*lo+ax-C*ay;ax=lo;ay=ap;ring[w]=rho*ap;w=w+1===N?0:w+1}
    const fo=Math.floor(sr*.06);for(let i=0;i<fo;i++)out[len-1-i]*=i/fo;
    b=ctx.createBuffer(1,len,sr);b.getChannelData(0).set(out);KSB.set(key,b);return b}
  function nylon(midi,t,dur,vel,dest){const b=ksBuf(Math.round(midi)),src=ctx.createBufferSource();src.buffer=b;const g=ctx.createGain(),hold=Math.min(b.duration,dur+.12);
    g.gain.setValueAtTime(.3*vel,t);g.gain.setTargetAtTime(.0001,t+hold,.05);src.connect(g);g.connect(dest);src.start(t);src.stop(t+Math.min(b.duration,hold+.4))}
  function strum(C,t,len,v,up){const ks=up?[...C.keys].reverse():C.keys;ks.forEach((m,i)=>nylon(m,t+i*.009,len,v*(i===ks.length-1?1:.8),gtrIn))}
  function prewarm(){let m=48;const go=()=>{if(m>88||!ctx)return;try{ksBuf(m++);ksBuf(m++)}catch(e){}setTimeout(go,40)};setTimeout(go,300)}
  function flute(midi,t,dur,vel){const f=mtof(midi),end=t+dur+.1,a=Math.min(.07,dur*.3),g=ctx.createGain();g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.07*vel,t+a);g.gain.setValueAtTime(.064*vel,Math.max(t+a,end-.09));g.gain.linearRampToValueAtTime(.0001,end);
    const o=ctx.createOscillator();o.frequency.value=f;const o2=ctx.createOscillator();o2.frequency.value=f*2;const g2=ctx.createGain();g2.gain.value=.16;const o3=ctx.createOscillator();o3.frequency.value=f*3;const g3=ctx.createGain();g3.gain.value=.05;
    const v=ctx.createOscillator();v.frequency.value=4.8;const vg=ctx.createGain(),vg2=ctx.createGain();vg.gain.setValueAtTime(0,t);vg.gain.linearRampToValueAtTime(f*.005,t+Math.min(.45,dur));vg2.gain.setValueAtTime(0,t);vg2.gain.linearRampToValueAtTime(f*.01,t+Math.min(.45,dur));
    v.connect(vg);vg.connect(o.frequency);v.connect(vg2);vg2.connect(o2.frequency);o.connect(g);o2.connect(g2);g2.connect(g);o3.connect(g3);g3.connect(g);g.connect(L.flute);
    for(const x of [o,o2,o3,v]){x.start(t);x.stop(end+.05)}
    noise(Math.min(dur+.05,1.2),.012*vel,{hp:f*2,type:'bandpass',q:1.4,at:t,bus:L.flute});noise(.05,.02*vel,{hp:Math.min(f*3,9000),type:'bandpass',q:3,at:t,bus:L.flute})}
  function tone(f0,f1,dur,vol,at,bus,type){const o=ctx.createOscillator(),g=ctx.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,at);o.frequency.exponentialRampToValueAtTime(f1,at+dur);
    g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.003);g.gain.exponentialRampToValueAtTime(.0001,at+dur);o.connect(g);g.connect(bus);o.start(at);o.stop(at+dur+.02)}
  const shaker=(t,v)=>noise(.07,.12*v,{hp:6200,at:t,bus:L.perc});
  const claves=(t,v)=>{tone(2480,2440,.08,.09*v,t,L.perc);tone(4900,4850,.025,.015*v,t,L.perc)};
  function conga(t,k,v){if(k==='slap'){noise(.05,.16*v,{hp:1300,type:'bandpass',q:1.1,at:t,bus:L.perc});tone(340,300,.05,.06*v,t,L.perc)}
    else if(k==='heel'||k==='tip')tone(k==='heel'?150:240,k==='heel'?135:220,.045,.07*v,t,L.perc);
    else{const f=k==='low'?168:212;tone(f,f*.94,.3,.2*v,t,L.perc);noise(.025,.04*v,{hp:1600,type:'bandpass',q:1,at:t,bus:L.perc})}}
  const bongo=(t,hi,v)=>{tone(hi?470:340,hi?445:320,.11,.15*v,t,L.perc);noise(.015,.05*v,{hp:3000,at:t,bus:L.perc})};
  const surdo=(t,v)=>{tone(78,56,.5,.42*v,t,L.kick);noise(.05,.03*v,{hp:400,type:'lowpass',at:t,bus:L.kick})};
  const tamborim=(t,v)=>{tone(980,900,.045,.1*v,t,L.perc,'triangle');noise(.03,.09*v,{hp:3600,at:t,bus:L.perc})};
  const cascara=(t,v)=>{noise(.035,.08*v,{hp:3300,type:'bandpass',q:4,at:t,bus:L.perc});tone(1900,1800,.03,.025*v,t,L.perc,'triangle')};
  function cowbell(t,v){const g=ctx.createGain(),bp=ctx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1400;bp.Q.value=1.2;g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.05*v,t+.002);g.gain.exponentialRampToValueAtTime(.0001,t+.22);
    for(const f of [562,845]){const o=ctx.createOscillator();o.type='square';o.frequency.value=f;o.connect(bp);o.start(t);o.stop(t+.24)}bp.connect(g);g.connect(L.perc)}
  const timbale=(t,hi,v)=>{tone(hi?640:480,hi?610:455,.2,.11*v,t,L.perc);noise(.07,.07*v,{hp:2400,type:'bandpass',q:.8,at:t,bus:L.perc})};
  const CONGA=[['heel',.45],['tip',.3],['slap',.85],['tip',.3],['heel',.45],['tip',.3],['open',.9],['low',.85]];
  function headInst(feel,sec){const p=st.phase;
    if(feel==='bossa')return sec==='out'&&p>=3?['sax','vibD']:p>=2?['flute','vibD']:['flute'];
    if(feel==='samba')return p>=2?['flute','vib']:['flute'];
    if(feel==='latin')return p>=2?(sec==='out'&&p>=3?['vib','flute','sax']:['vib','flute']):['piano'];
    return sec==='out'&&p>=3?['sax']:['gtr']}
  function ribLead(inst,m,t,len,v,d,feel){
    if(inst==='flute')flute(m,t,len*.95,v);
    else if(inst==='gtr'){nylon(m,t,len,v*2.2,glIn);if(feel==='bolero'&&len>=3.5*d){const h=d/2;for(let k=1;k<Math.floor(len/h);k++)nylon(m,t+k*h,Math.min(d,len-k*h),v*1.2,glIn)}}
    else if(inst==='vib')vibes(m,t,len*1.3,v,L.lead);else if(inst==='vibD'){if(len>=3*d)vibes(m-12,t,len*1.2,v*.55,L.lead)}
    else if(inst==='sax')sax(m-12>=55?m-12:m,t,len*.92,v);else if(inst==='bass')upright(m,t,len*.9,1.05);
    else epiano(m,t,len*.95,v,leadIn,true)}
  function playRib(stepI,t,d){
    const gb=stepI>>3,s=stepI&7,B=ARR[gb];if(!B)return;CUR=B;const tu=B.tu,feel=tu.feel;if(B.sec==='rest')return;
    const pair=tu.bars[B.hb],C=xp(CH[pair[s<4?0:1]],B.tr);curCh=C;const odd=B.hb&1,h=d/2,ph=st.phase,clave=odd?[0,3,6]:[2,4];
    if(B.sec==='end'){if(s===0){const F=xp(CH[tu.bars[tu.bars.length-1][0]],B.tr);strum(F,t,d*7,1);nylon(F.root+12,t,d*7,.8,gtrIn);upright(F.root>52?F.root-12:F.root,t,d*6,1);
        if(feel==='latin'){timbale(t,1,1);timbale(t+h,0,.8);for(let i=0;i<F.keys.length;i++)epiano(F.keys[i]+12,t+i*.02,d*5,.4,keysIn,true)}else{shaker(t,.6);feather(t,.8)}
        if(ph>=2)vibes(F.keys[3]+12,t+.1,d*6,.85);if(feel!=='bolero')flute(F.keys[3]+12,t+.05,d*5,.55)}return}
    // bajo (algunos golpes caen a medio paso)
    for(const nb of B.bass)if(Math.floor(nb.s)===s)upright(nb.m+B.tr,t+(nb.s-s)*d,nb.l*d*.92,nb.v);
    // guitarra: batida, partido alto o arpegio de bolero; en el latin, montuno de piano en octavas
    if(feel==='bossa'||feel==='samba'){for(const q of [0,1])if(B.comp.includes(s*2+q))strum(C,t+q*h,feel==='samba'?d*.8:d*1.5,feel==='samba'?.75:.85,q===1)}
    else if(feel==='bolero'){const A=[C.root+12,C.keys[0],C.keys[2],C.keys[3]];nylon(A[s%4],t,d*3,s%4===0?.85:.6,gtrIn)}
    else if(!(odd===0&&s===0)){const r=C.root+24,pat=[r-5,r,r+C.third,r+7],m=pat[(s+odd)%4],v=clave.includes(s)?.32:.24;epiano(m,t,d*.85,v,keysIn,true);epiano(m+12,t+.004,d*.85,v*.8,keysIn,true)}
    if(ph>=2&&(feel==='bossa'||feel==='bolero')&&(s===0||(s===4&&pair[0]!==pair[1])))C.keys.forEach((m,i)=>epiano(m,t+i*.015,d*3.5,.16,keysIn,false));
    // melodía
    const note=B.lead?B.lead.get(B.sec==='solo'?s:B.hb*8+s):null;
    if(note){const m=note.midi+B.tr,len=note.len*d,tt=t+(feel==='bossa'?.012:0);
      if(B.sec==='solo')ribLead(note.inst||B.inst,m,tt,len,.85,d,feel);
      else{const hi=headInst(feel,B.sec);for(const ins of hi)ribLead(ins,m,tt,len,ins==='vib'?(feel==='latin'?1:.7):ins==='vibD'?.7:feel==='latin'&&ins!=='piano'?.6:.9,d,feel);if(st.kiosk&&B.sec==='head'&&!hi.includes('sax'))sax(m-12,tt,len*.9,.45)}}
    // metales (fase 4)
    if(ph>=4&&(B.sec==='out'||B.sec==='tag')){if(feel==='latin'&&clave.includes(s))brass(C.keys.map(m=>m-12),t,.85);else if(feel==='samba'&&odd&&(s===3||s===7))brass(C.keys.map(m=>m-12),t,.7)}
    // percusión
    if(feel==='bossa'){shaker(t,s&1?.45:.7);shaker(t+h,.3);if((odd?[2,5]:[0,3,6]).includes(s))rim(t,.75);if(s===2||s===6)swish(t,.4,true);if(s===0||s===4)feather(t,.7);else if(s===3||s===7)feather(t,.35)}
    else if(feel==='samba'){for(const q of [0,1]){const i16=s*2+q;shaker(t+q*h,i16%4===3?.85:i16%4===0?.6:.35);if([0,3,6,8,11,14].includes(i16))tamborim(t+q*h,i16%8===0?.9:.55);if(B.fill&&s>=6)tamborim(t+q*h,.8)}
      if(s===6)surdo(t,1);else if(s===2)surdo(t,.55);else if(s===0||s===4)surdo(t,.22)}
    else if(feel==='latin'){if(clave.includes(s))claves(t,.8);
      if((B.sec==='out'||B.sec==='tag')&&ph>=3){if(!(s&1))cowbell(t,s===0||s===4?1:.7)}else if((odd?[0,2,3,5,7]:[0,2,4,5,7]).includes(s))cascara(t,s===0?.9:.6);
      conga(t,CONGA[s][0],CONGA[s][1]);if(odd&&s===3)feather(t,.5);
      if(B.fill&&s>=4)for(const q of [0,1])timbale(t+q*h,(s*2+q)%3===0,.7+.05*s)}
    else{shaker(t,s&1?.35:.6);bongo(t,!(s&1),s===6?.9:.4);if(s===0||s===4)feather(t,.5);if(clave.includes(s))rim(t,.3)}
  }
  /* ---------- prueba y muestras: tocar una pieza sin bocinas, en un contexto fuera de línea ---------- */
  async function renderOffline(sec,o={}){const OAC=window.OfflineAudioContext||window.webkitOfflineAudioContext;if(!OAC)return null;
    const keep={ctx,master,musicBus,revIn,noiseBuf,L,keysIn,leadIn,gtrIn,glIn,dly,compN,irBuf,step,next,STEPS,ARR,CUR,setN},st0={...st};rendering=true;
    try{ctx=new OAC(2,Math.ceil(44100*sec),44100);L={};Object.assign(st,o.st||{});graph();master.gain.value=.3;forced=o.tune||null;
      if(o.solo)for(const k in L)if(!o.solo.includes(k)){L[k].gain.cancelScheduledValues(0);L[k].gain.value=0}
      step=0;STEPS=buildSet();const name=ARR[0]&&ARR[0].tu.name,errs=[];let t=.05;
      while(t<sec-.6){const d=60/bpm()/2;try{play(step,t,d)}catch(e){errs.push(String(e&&e.stack||e))}step++;if(step>=STEPS){step=0;STEPS=buildSet()}t+=d}
      const buf=await ctx.startRendering();return {buf,errs,name}}
    finally{forced=null;Object.assign(st,st0);({ctx,master,musicBus,revIn,noiseBuf,L,keysIn,leadIn,gtrIn,glIn,dly,compN,irBuf,step,next,STEPS,ARR,CUR,setN}=keep);rendering=false}}
  const lowFill=()=>false;
  function mix(now){
    if(!ctx)return;const n=st.night,sa=st.sat,t=ctx.currentTime,tc=now?.01:1.2;
    const M={keys:1,bass:.95-.15*n,kick:.5-.2*n,lead:(st.red?0:ramp(sa,.4,.65))*(1-.15*n),
      ride:(.8+.2*ramp(sa,.5,.9)+(st.ev==='clasico'?.3:0))*(1-.65*n),hat:1-.3*n,brush:.55+.45*n,vib:st.phase>=2?.9:0,sax:st.phase>=3||st.kiosk?(st.red?0:.85):0,brass:st.phase>=4?.8*(1-.4*n):0};
    M.gtr=1-.15*n;M.glead=M.lead*1.1;M.flute=M.lead*(1-.1*n);M.perc=(1-.35*n)*(st.ev==='clasico'?1.25:1);
    for(const k in M)L[k].gain.setTargetAtTime(M[k],t,tc);
    keysIn.frequency.setTargetAtTime(3400-1600*n,t,tc);leadIn.frequency.setTargetAtTime(4200-1800*n,t,tc);
    dly.delayTime.setTargetAtTime(60/bpm()*.75,t,.2);
  }
  function build(){
    const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return false;
    try{ctx=new AC()}catch(e){return false}
    graph();if(RIB)prewarm();return true}
  function graph(){
    master=ctx.createGain();master.gain.value=0;
    const comp=ctx.createDynamicsCompressor();comp.threshold.value=-16;comp.knee.value=20;comp.ratio.value=3.5;comp.attack.value=.004;comp.release.value=.2;
    master.connect(comp);comp.connect(ctx.destination);compN=comp;
    musicBus=ctx.createGain();musicBus.gain.value=.55;musicBus.connect(master);
    noiseBuf=ctx.createBuffer(1,ctx.sampleRate*3,ctx.sampleRate);const nd=noiseBuf.getChannelData(0);for(let i=0;i<nd.length;i++)nd[i]=Math.random()*2-1;
    revIn=ctx.createGain();const conv=ctx.createConvolver(),len=Math.floor(ctx.sampleRate*1.6),ir=ctx.createBuffer(2,len,ctx.sampleRate);
    for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,3)}
    conv.buffer=ir;irBuf=ir;const ro=ctx.createGain();ro.gain.value=.32;revIn.connect(conv);conv.connect(ro);ro.connect(musicBus);
    const dIn=ctx.createGain();dly=ctx.createDelay(1.5);dly.delayTime.value=.45;const fb=ctx.createGain();fb.gain.value=.35;
    const fbf=ctx.createBiquadFilter();fbf.type='lowpass';fbf.frequency.value=2400;const dOut=ctx.createGain();dOut.gain.value=.28;
    dIn.connect(dly);dly.connect(fbf);fbf.connect(fb);fb.connect(dly);dly.connect(dOut);dOut.connect(musicBus);
    const SENDS={gtr:{rev:.3,dly:.06},glead:{rev:.38,dly:.18},flute:{rev:.42,dly:.2},perc:{rev:.14},vib:{rev:.45,dly:.18},sax:{rev:.35,dly:.15},brass:{rev:.25},keys:{rev:.35,dly:.12},lead:{rev:.4,dly:.22},bass:{rev:.04},ride:{rev:.2},hat:{rev:.1},brush:{rev:.25},kick:{}};
    for(const k in SENDS){const g=ctx.createGain();g.gain.value=0;g.connect(musicBus);
      if(SENDS[k].rev){const r=ctx.createGain();r.gain.value=SENDS[k].rev;g.connect(r);r.connect(revIn)}
      if(SENDS[k].dly){const r=ctx.createGain();r.gain.value=SENDS[k].dly;g.connect(r);r.connect(dIn)}L[k]=g}
    keysIn=ctx.createBiquadFilter();keysIn.type='lowpass';keysIn.frequency.value=3400;keysIn.Q.value=.5;keysIn.connect(L.keys);
    leadIn=ctx.createBiquadFilter();leadIn.type='lowpass';leadIn.frequency.value=4200;leadIn.Q.value=.5;leadIn.connect(L.lead);
    gtrIn=ctx.createBiquadFilter();gtrIn.type='lowpass';gtrIn.frequency.value=3000;gtrIn.Q.value=.5;const body=ctx.createBiquadFilter();body.type='peaking';body.frequency.value=210;body.gain.value=3;body.Q.value=1;gtrIn.connect(body);body.connect(L.gtr);
    glIn=ctx.createBiquadFilter();glIn.type='lowpass';glIn.frequency.value=4200;glIn.Q.value=.5;glIn.connect(L.glead);
    const lfo=ctx.createOscillator(),la=ctx.createGain();lfo.frequency.value=4.8;la.gain.value=.05;lfo.connect(la);la.connect(L.keys.gain);lfo.start();
    mix(true);
  }
  function tick(){
    if(!ctx||rendering||ctx.state!=='running')return;const now=ctx.currentTime;
    if(next<now-.1)next=now+.05;
    while(next<now+.14){const d=60/bpm()/2;try{play(step,next,d)}catch(e){}step++;if(step>=STEPS){step=0;STEPS=buildSet()}next+=d}
  }
  function applyVol(){if(ctx)master.gain.setTargetAtTime(pref.on?pref.vol*pref.vol:0,ctx.currentTime,.25)}
  function save(){try{localStorage.setItem('distritoDomo.musica',JSON.stringify(pref))}catch(e){}}
  function start(){if(!ctx&&!build())return;if(ctx.state!=='running')ctx.resume().catch(()=>{});if(!timer){next=ctx.currentTime+.1;timer=setInterval(tick,25)}applyVol()}
  if(document.addEventListener)document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden)ctx.suspend().catch(()=>{});else if(pref.on)ctx.resume().catch(()=>{})});
  /* ---------- efectos: mismo sintetizador, notas del acorde que suena, volumen bajo y con límite ---------- */
  const fx={on:true,vol:.6};try{const p=JSON.parse(localStorage.getItem('distritoDomo.efectos')||'null');if(p)Object.assign(fx,p)}catch(e){}
  let fxBus=null,fxDry=null;const lastFx={},recentFx=[];
  const CD={trueno:1.2,foto:.3,build:.12,street:.2,done:2,levelup:.4,unlock:1,phase:3,buy:1,money:1,demolish:.3,nope:4,recover:5,event:3};
  const QUANT={done:1,levelup:1,unlock:1,phase:1,recover:1,event:1};
  function fxVol(){if(fxBus)fxBus.gain.setTargetAtTime(fx.on?fx.vol*1.25:0,ctx.currentTime,.05)}
  function ensureFx(){if(!ctx&&!build())return false;if(ctx.state!=='running')ctx.resume().catch(()=>{});
    if(!fxBus){fxBus=ctx.createGain();fxBus.gain.value=fx.on?fx.vol*1.25:0;fxBus.connect(compN);
      fxDry=ctx.createGain();fxDry.connect(fxBus);const rs=ctx.createGain();rs.gain.value=.3;const cv=ctx.createConvolver();cv.buffer=irBuf;fxDry.connect(rs);rs.connect(cv);cv.connect(fxBus)}
    return true}
  function qTime(){const now=ctx.currentTime+.01;if(!(timer&&pref.on))return now;const g=60/bpm()/4;return Math.max(now,next-Math.floor((next-now)/g)*g)}
  function wood(t,v){noise(.06,.35*v,{hp:1700,type:'bandpass',q:6,at:t,bus:fxDry});const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(820,t);o.frequency.exponentialRampToValueAtTime(600,t+.05);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.12*v,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(g);g.connect(fxDry);o.start(t);o.stop(t+.09)}
  function thump(t,v,f0=90){const o=ctx.createOscillator(),g=ctx.createGain();o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0/2,t+.16);
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.4*v,t+.005);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(g);g.connect(fxDry);o.start(t);o.stop(t+.25)}
  function felt(midi,t,v){const o=ctx.createOscillator(),lp=ctx.createBiquadFilter(),g=ctx.createGain();o.type='triangle';o.frequency.value=mtof(midi);lp.type='lowpass';lp.frequency.value=500;
    g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.18*v,t+.01);g.gain.exponentialRampToValueAtTime(.0001,t+.22);o.connect(lp);lp.connect(g);g.connect(fxDry);o.start(t);o.stop(t+.25)}
  function duck(t){if(!musicBus)return;musicBus.gain.setTargetAtTime(.38,t,.05);musicBus.gain.setTargetAtTime(.55,t+1.4,.3)}
  const SOUNDS={
    build(t){const c=curCh||CH.Cmaj7;wood(t,.8);epiano(c.root+24,t+.015,.22,.32,fxDry,false)},
    street(t){wood(t,.45)},
    done(t){const k=(curCh||CH.Cmaj7).keys;vibes(k[1]+12,t,.3,.9,fxDry);vibes(k[3]+12,t+.13,.5,.9,fxDry)},
    levelup(t){const k=[...(curCh||CH.Cmaj7).keys].sort((a,b)=>a-b);[0,1,3].forEach((i,j)=>vibes(k[i]+12,t+j*.1,.45+.2*j,1,fxDry))},
    unlock(t){const k=[...(curCh||CH.Cmaj7).keys].sort((a,b)=>a-b);epiano(k[0]+12,t,.09,.42,fxDry,true);epiano(k[1]+12,t+.09,.09,.42,fxDry,true);epiano(k[3]+12,t+.2,.6,.5,fxDry,true)},
    phase(t){const k=(curCh||CH.Cmaj7).keys;brass(k,t,.8,fxDry);brass(k,t+.42,.6,fxDry);vibes(Math.max(...k)+12,t+.42,1.2,1,fxDry);duck(t)},
    buy(t){const k=(curCh||CH.Cmaj7).keys;epiano(Math.max(...k)+12,t,.6,.45,fxDry,true);thump(t+.08,.28)},
    money(t){const k=[...(curCh||CH.Cmaj7).keys].sort((a,b)=>a-b);noise(.05,.08,{hp:6000,at:t,bus:fxDry});epiano(k[2]+12,t+.03,.15,.5,fxDry,true);epiano(k[3]+12,t+.11,.4,.5,fxDry,true)},
    demolish(t){noise(.35,.12,{hp:700,type:'lowpass',q:.7,at:t,bus:fxDry});thump(t,.3,70)},
    nope(t){felt((curCh||CH.Cmaj7).root+12,t,.25)},
    recover(t){const c=curCh||CH.Cmaj7;epiano(c.root+24,t,.18,.42,fxDry,false);epiano(c.root+24+c.third,t+.15,.4,.45,fxDry,false)},
    trueno(t){noise(2.6,.42,{hp:140,type:'lowpass',q:.5,at:t,bus:fxDry});noise(.3,.22,{hp:900,type:'lowpass',q:.7,at:t,bus:fxDry});thump(t,.45,52);thump(t+.35,.3,44)},
    foto(t){noise(.035,.28,{hp:2600,at:t,bus:fxDry});wood(t+.07,.55)},
    event(t){const k=[...(curCh||CH.Cmaj7).keys].sort((a,b)=>a-b);vibes(k[3]+12,t,.35,.9,fxDry);vibes(k[1]+12,t+.32,.6,.9,fxDry)}
  };
  function sfx(name){try{
    if(!fx.on||!SOUNDS[name])return;const w=performance.now()/1000;
    if(lastFx[name]&&w-lastFx[name]<CD[name])return;while(recentFx.length&&w-recentFx[0]>1)recentFx.shift();if(recentFx.length>=3)return;
    if(!ensureFx()||ctx.state!=='running')return;lastFx[name]=w;recentFx.push(w);
    SOUNDS[name](QUANT[name]?qTime():ctx.currentTime+.01)}catch(e){}}
  return{
    sfx,fx,
    toggleFx(){fx.on=!fx.on;try{localStorage.setItem('distritoDomo.efectos',JSON.stringify(fx))}catch(e){}if(fx.on)ensureFx();if(ctx)fxVol();return fx.on},
    pref,
    unlock(){if(pref.on&&(!ctx||ctx.state!=='running'||!timer))start()},
    playing:()=>!!ctx&&ctx.state==='running'&&pref.on,
    toggle(){if(pref.on&&(!ctx||ctx.state!=='running')){start();return true}pref.on=!pref.on;save();if(pref.on)start();else applyVol();return pref.on},
    setVol(v){pref.vol=clamp(v,0,1);save();applyVol()},
    update(o){const ch=Math.abs(o.night-st.night)>.05||Math.abs(o.sat-st.sat)>.03||o.ev!==st.ev||o.red!==st.red||o.phase!==st.phase||o.kiosk!==st.kiosk;if(rendering)return;Object.assign(st,o);if(ch)mix(false)},
    tune:()=>CUR?CUR.tu.name:'',
    __render:renderOffline
  };
})();
