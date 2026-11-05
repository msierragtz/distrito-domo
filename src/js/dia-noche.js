/* ---------- día y noche ---------- */
// cielo por hora (v54): amanecer rosado, mediodía limpio, atardecer naranja y coral, anochecer morado, noche azul
const SKY=[[0,'#8a93cf','#ffc8a2'],[.05,'#79b2e4','#ffe6c8'],[.12,'#6fb7e6','#d4f0fc'],[.38,'#6fb7e6','#d4f0fc'],[.44,'#7aa6da','#ffe2b4'],[.49,'#5a6bb0','#ffa95c'],[.53,'#3b3f80','#f2795e'],[.58,'#1e2354','#704c80'],[.64,'#0b1130','#1d2856'],[.86,'#0b1130','#1d2856'],[.92,'#272c63','#5f5488'],[.97,'#6670b0','#f4ab8c'],[1,'#8a93cf','#ffc8a2']];
const NF=[[0,0],[.42,0],[.52,.45],[.62,1],[.88,1],[.95,.45],[1,0]];
const hex2=h=>{const n=parseInt(h.slice(1),16);return[n>>16,n>>8&255,n&255]};
const mix=(a,b,f)=>{const A=hex2(a),B=hex2(b);return`rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*f))})`};
// acepta #hex o rgb(): sirve para mezclar con los colores del cielo, que ya vienen en rgb()
const c3=s=>s[0]==='#'?hex2(s):s.match(/\d+/g).slice(0,3).map(Number);
const mx=(a,b,f)=>{const A=c3(a),B=c3(b);return`rgb(${A.map((v,i)=>Math.round(v+(B[i]-v)*f))})`};
const mxa=(a,b,f,al)=>{const A=c3(a),B=c3(b);return`rgba(${A.map((v,i)=>Math.round(v+(B[i]-v)*f))},${al.toFixed(3)})`};
function keyf(arr,p,col){for(let i=1;i<arr.length;i++)if(p<=arr[i][0]){const a=arr[i-1],b=arr[i],f=(p-a[0])/(b[0]-a[0]);return col?[mix(a[1],b[1],f),mix(a[2],b[2],f)]:a[1]+(b[1]-a[1])*f}return col?[arr[0][1],arr[0][2]]:0}
let NIGHT=0,NCOL='';

