// Versión para itch.io: el mismo juego como index.html (con idioma y descripción) dentro de un .zip.
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
let s=readFileSync(join(root,'dist/distrito-domo.html'),'utf8');
const a='<!doctype html><html><head>';if(!s.startsWith(a))throw new Error('cabecera inesperada');
s='<!doctype html><html lang="es"><head>'+s.slice(a.length);
const b='</head><body>\n<title>Distrito Pixel</title>\n<meta name="claude:viewport-fit-sides" content="cover">';
if(s.split(b).length!==2)throw new Error('no encontré el título');
s=s.replace(b,'<title>Distrito Pixel</title>\n<meta name="description" content="Simulador de ciudad retro en Santa Catarina, Nuevo León.">\n<meta name="theme-color" content="#1f2540">\n</head><body>');
const dir=join(root,'dist/itch');mkdirSync(dir,{recursive:true});writeFileSync(join(dir,'index.html'),s);
rmSync(join(root,'dist/distrito-domo-itch.zip'),{force:true});
try{execFileSync('zip',['-q','-9','../distrito-domo-itch.zip','index.html'],{cwd:dir});console.log('listo: dist/distrito-domo-itch.zip')}
catch(e){console.log('listo: dist/itch/index.html (no hay «zip» instalado: comprime esa carpeta a mano)')}
