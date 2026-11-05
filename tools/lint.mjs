// Revisa el código del juego con ESLint: variables sin definir, claves repetidas, constantes reasignadas.
// Necesita eslint (npm install, o la variable ESLINT con la ruta a su carpeta).
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const req=createRequire(join(root,'package.json'));
let Linter;try{({Linter}=req(process.env.ESLINT||'eslint'))}catch(e){console.error('No encontré eslint. Corre «npm install» o define ESLINT=/ruta/a/node_modules/eslint.');process.exit(2)}
const BROWSER='window document localStorage sessionStorage addEventListener removeEventListener matchMedia setTimeout clearTimeout setInterval clearInterval requestAnimationFrame cancelAnimationFrame console performance screen innerWidth innerHeight devicePixelRatio navigator URL Blob AudioContext webkitAudioContext OfflineAudioContext Image ImageData Path2D OffscreenCanvas HTMLCanvasElement location history alert getComputedStyle claude'.split(' ');
const orden=JSON.parse(readFileSync(join(root,'src/js/orden.json'),'utf8'));
// se revisa el código pegado (así se ve igual que en el navegador) y cada error se ubica en su archivo
let js='',map=[];for(const f of orden){const t=readFileSync(join(root,'src/js',f),'utf8');map.push([js.split('\n').length,f]);js+=t}
const where=l=>{let r=map[0];for(const m of map)if(m[0]<=l)r=m;return `${r[1]}:${l-r[0]+1}`};
const msgs=new Linter().verify(js,{languageOptions:{ecmaVersion:2022,sourceType:'script',globals:Object.fromEntries(BROWSER.map(g=>[g,'readonly']))},rules:{'no-undef':2,'no-dupe-keys':2,'no-const-assign':2,'no-redeclare':1}});
for(const m of msgs)console.log(`${m.severity===2?'ERROR':'aviso'} ${where(m.line)} ${m.message}`);
const n=msgs.filter(m=>m.severity===2).length;console.log(n?`${n} errores`:'sin errores');process.exit(n?1:0);
