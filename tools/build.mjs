// Arma el juego en un solo HTML (dist/distrito-domo.html) a partir de src/.
// El código del juego vive dentro de un mismo cierre (IIFE): los archivos de src/js se pegan en el orden de src/js/orden.json,
// así que el orden importa (lo de arriba define lo que usa lo de abajo al arrancar).
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(dirname(fileURLToPath(import.meta.url)),'..');
const rd=p=>readFileSync(join(root,p),'utf8');
const orden=JSON.parse(rd('src/js/orden.json'));
const js=orden.map(f=>rd('src/js/'+f)).join('');
const html=rd('src/index.html').replace('{{CSS}}',()=>rd('src/css/juego.css')).replace('{{JS}}',()=>js);
mkdirSync(join(root,'dist'),{recursive:true});
const out=process.argv[2]||'dist/distrito-domo.html';
writeFileSync(join(root,out),html);
console.log(`listo: ${out} (${(html.length/1024).toFixed(0)} KB, ${orden.length} archivos)`);
