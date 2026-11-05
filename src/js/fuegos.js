/* ---------- fuegos artificiales ---------- */
let FW=[],FWQ=0,FWlast=0;
// al terminar una obra: rebotito y polvo
const LAND=new Map();
function landed(i){LAND.set(i,T);flashAt(i,.5);const t=S.g[i],[dw,dh]=DIMT(t),sz=(dw+dh)/2,[x,y]=P(i%N+dw/2,Math.floor(i/N)+dh/2),n=lowMo()?3:OPT.low?4:7;
  for(let k=0;k<n;k++){const an=Math.PI*(k/(n-1||1)),sp=6+Math.random()*7;FW.push({x:x+Math.cos(an)*6*sz,y:y+1,vx:Math.cos(an)*sp,vy:-Math.random()*5-2,l:.55+Math.random()*.3,c:Math.random()<.5?'#d9cdb2':'#bfb397',dust:1})}}
function bounceOf(i){if(lowMo()||!LAND.size)return 0;const t0=LAND.get(i);if(t0==null)return 0;const p=(T-t0)/.45;if(p>=1||p<0){LAND.delete(i);return 0}return Math.sin(p*Math.PI)*3*(1-p)}
function celebrate(sec){FWQ=Math.max(FWQ,lowMo()?Math.min(sec,1.2):sec)}
