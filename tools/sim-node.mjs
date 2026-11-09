// Simulador de economía en Node, sin navegador: corre el código real del juego (src/js en el orden de orden.json)
// con el bot de balance de tests/bots/bot.js, sobre un DOM de mentira que acepta todo y no dibuja nada.
// Uso: node tools/sim-node.mjs [perfil] [semillas] [distrito] [horas]
//   node tools/sim-node.mjs intermedio 1,2,3 domo 4
// Sale un JSON por corrida en build/sim/ y una línea por corrida con los minutos a cada hito.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const rd=p=>readFileSync(join(root,p),'utf8');
const PROF={
  'novato-flecha':{every:22,acts:1,needT:.4,ignore:.5,fill:.97,reserve:60,minLots:2,buy:.05,up:.03,random:.35,water:false,domo:true,smart:false,hint:.5},
  novato:{every:22,acts:1,needT:.4,ignore:.5,fill:.97,reserve:60,minLots:2,buy:.05,up:.03,random:.35,water:false,domo:true,smart:false},
  intermedio:{every:9,acts:2,needT:.55,ignore:.15,fill:.92,reserve:100,minLots:3,buy:.3,up:.25,random:.1,water:true,domo:true,smart:false},
  experto:{every:4,acts:3,needT:.7,ignore:0,fill:.88,reserve:150,minLots:4,buy:.7,up:.6,random:0,water:true,domo:true,smart:true,stop:3200},
  sinplusvalia:{every:9,acts:2,needT:.55,ignore:1,fill:.92,reserve:100,minLots:3,buy:.3,up:0,random:.6,water:true,domo:true,smart:false}};
const [perfil='intermedio',semillas='1',dist='domo',horas='4']=process.argv.slice(2);

// un objeto que acepta cualquier propiedad, llamada o «new» y se devuelve a sí mismo: sirve de documento, lienzo, contexto 2d, audio…
function nada(){const f=function(){};const p=new Proxy(f,{get:(t,k)=>k===Symbol.toPrimitive?()=>0:k==='length'?0:k===Symbol.iterator?function*(){}:k in t?t[k]:p,
  set:()=>true,apply:()=>p,construct:()=>p,has:()=>true});return p}
const N0=nada();
const store=new Map();
const localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v)),removeItem:k=>store.delete(k),clear:()=>store.clear(),key:i=>[...store.keys()][i]??null,get length(){return store.size}};
const el=()=>{const e=nada();return e};
const document={getElementById:el,querySelector:el,querySelectorAll:()=>[],createElement:el,addEventListener(){},body:el(),documentElement:el(),hidden:false,fonts:{ready:Promise.resolve()}};
const ctx={console:{log(){},warn(){},error:console.error},Math,JSON,Date,Promise,Map,Set,WeakMap,Array,Object,Number,String,Boolean,Symbol,RegExp,Error,Proxy,Reflect,
  Float32Array,Uint8Array,Uint8ClampedArray,Int16Array,Int32Array,Uint32Array,ArrayBuffer,isFinite,isNaN,parseInt,parseFloat,Infinity,NaN,undefined,
  setTimeout:()=>0,clearTimeout(){},setInterval:()=>0,clearInterval(){},requestAnimationFrame:()=>0,cancelAnimationFrame(){},queueMicrotask,
  performance:{now:()=>Number(process.hrtime.bigint()/1000n)/1000},localStorage,sessionStorage:localStorage,document,navigator:{userAgent:'node',maxTouchPoints:0},
  location:{reload(){},href:'file://sim',search:''},matchMedia:()=>({matches:false,addEventListener(){},addListener(){}}),innerWidth:1280,innerHeight:800,devicePixelRatio:1,
  addEventListener(){},removeEventListener(){},getComputedStyle:()=>N0,Image:function(){return el()},AudioContext:undefined,OfflineAudioContext:undefined,
  MediaRecorder:undefined,Blob:function(){},URL:{createObjectURL:()=>'',revokeObjectURL(){}},structuredClone,TextEncoder,TextDecoder};
ctx.window=ctx;ctx.self=ctx;ctx.globalThis=ctx;
localStorage.setItem('distritoDomo.distrito',dist);
let js=JSON.parse(rd('src/js/orden.json')).map(f=>rd('src/js/'+f)).join('');
const gancho='window.claude?.hot?.snapshot?.(';
if(!js.includes(gancho))throw new Error('no encontré dónde meter el bot');
// el arranque real (start) se reemplaza: el bot arma su propia partida con prep(newGame())
const arranque='window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});';
if(!js.includes(arranque))throw new Error('no encontré el arranque');
js=js.replace(gancho,rd('tests/bots/bot.js')+'\n'+gancho).replace(arranque,'distBoot();prep(newGame());buildTools();');
vm.createContext(ctx);
const t0=Date.now();vm.runInContext(js,ctx,{filename:'distrito-domo.js'});
mkdirSync(join(root,'build','sim'),{recursive:true});
for(const s of semillas.split(',').map(Number)){
  const cfg={...PROF[perfil],seed:s,mis:true,maxT:Math.round(+horas*3600)};
  const t1=Date.now(),r=ctx.__bot(cfg),m=r.ms,f=k=>m[k]!=null?Math.round(m[k]/60):'—';
  writeFileSync(join(root,'build','sim',`${dist}-${perfil}-${s}.json`),JSON.stringify(r));
  console.log(`${dist} ${perfil} s${s}: 100:${f(100)} 500:${f(500)} 1k:${f(1000)} 2k:${f(2000)} 3k:${f(3000)} min · final ${r.vFin} vecinos, $${r.cash} · sin agua ${Math.round(r.tAgua/60)} min, sat<.5 ${Math.round(r.tSat/60)} min · ${((Date.now()-t1)/1000).toFixed(1)} s`);
}
console.log(`listo en ${((Date.now()-t0)/1000).toFixed(1)} s`);
