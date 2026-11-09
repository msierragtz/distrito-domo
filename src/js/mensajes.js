/* ---------- mensajes tipo GameBoy ---------- */
const dlg=document.getElementById('dialog'),SRM=document.getElementById('srmsg');let msgQ=[],cur='',shown=0,holdT=0,dlgQ=false;
// el globo se hace una tirita a los 7 s para no tapar el mapa; tocarlo lo vuelve a abrir
// el mensaje solo se puede tocar si recomienda una pestaña; si no, los toques pasan al mapa
let dlgTab=null,curO={};
// palabras que salen en muchos mensajes y no apuntan a un edificio en particular («hay 3 edificios sin…»)
const TABSTOP=new Set(['edificio','edificios']);
function tabForMsg(txt){const low=txt.toLowerCase();let best=null,bi=1e9;for(const k of ORDER){const d=DEFS[k];if(!d||d.hidden||!tabOf(k))continue;for(const nm of [d.name,...(LV[k]||[])]){const w=nm.toLowerCase().split(' ').find(x=>x.length>3&&!TABSTOP.has(x));if(!w)continue;const j=low.indexOf(w);if(j>=0&&j<bi&&nm.length>3){bi=j;best=k}}}
  return best?tabOf(best):null}
dlg.addEventListener('click',()=>{if(dlgQ){dlgQ=false;dlg.classList.remove('quiet');holdT=0;return}
  if(curO.tool&&S.unl.includes(curO.tool)){pick(curO.tool);if(curO.hint)hintFor(curO.tool,true);return}
  if(dlgTab)setTab(dlgTab)});
/* v75: prioridades. say(t, now, {p, tab, tool, hint})
   p 0 = plática (llegadas, salidas, quejas sueltas): se descarta primero
   p 1 = normal (lo de siempre)
   p 2 = aviso (agua, números rojos, trofeos): nunca se descarta y, si otro mensaje lo interrumpe antes de leerse, vuelve a la fila
   tab = pestaña que abre al tocar el globo (si no, se adivina por el texto); tool = herramienta que elige al tocarlo */
const QMAX=6;
function say(t,now,o){o=o||{};const p=o.p??1,it={t,o,p};
  if(now){const leido=shown>=cur.length&&holdT>=1.5;if(cur&&curO.p>=2&&cur!==t&&!leido)msgQ.unshift({t:cur,o:curO,p:curO.p});
    msgQ=msgQ.filter(q=>q.p>=1&&q.t!==t);cur=t;curO=o;curO.p=p;shown=0;holdT=0;msgTrim();return}
  if(cur===t||msgQ.some(q=>q.t===t))return;
  msgQ.push(it);msgTrim()}
// se descarta primero la plática y luego lo normal más viejo; los avisos (p 2) nunca
function msgTrim(){while(msgQ.length>QMAX||(msgQ.length>3&&msgQ.some(q=>q.p===0))){const lo=Math.min(...msgQ.map(q=>q.p));if(lo>=2)break;msgQ.splice(msgQ.findIndex(q=>q.p===lo),1)}}
function msgStep(dt){
  if(shown<cur.length){if(shown===0){try{dlgTab=curO.tab||(curO.tool?tabOf(curO.tool):null)||tabForMsg(cur)}catch(e){dlgTab=null}dlg.classList.toggle('go',!!dlgTab||!!curO.tool)}if(dlgQ){dlgQ=false;dlg.classList.remove('quiet')}if(shown===0&&SRM)SRM.textContent=cur;shown=Math.min(cur.length,shown+dt*55);dlg.textContent=cur.slice(0,Math.floor(shown))}
  else{holdT+=dt;if(msgQ.length&&holdT>(curO.p>=2?3.2:2.4)){const n=msgQ.shift();cur=n.t;curO=n.o;curO.p=n.p;shown=0;holdT=0}
    else if(!msgQ.length&&!dlgQ&&holdT>7&&!TITLE){dlgQ=true;dlg.classList.add('quiet')}}
}
