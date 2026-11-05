/* ---------- mensajes tipo GameBoy ---------- */
const dlg=document.getElementById('dialog');let msgQ=[],cur='',shown=0,holdT=0,dlgQ=false;
// el globo se hace una tirita a los 7 s para no tapar el mapa; tocarlo lo vuelve a abrir
// el mensaje solo se puede tocar si recomienda una pestaña; si no, los toques pasan al mapa
let dlgTab=null;
function tabForMsg(txt){const low=txt.toLowerCase();let best=null,bi=1e9;for(const k of ORDER){const d=DEFS[k];if(!d||d.hidden||!tabOf(k))continue;for(const nm of [d.name,...(LV[k]||[])]){const w=nm.toLowerCase().split(' ').find(x=>x.length>3);if(!w)continue;const j=low.indexOf(w);if(j>=0&&j<bi&&nm.length>3){bi=j;best=k}}}
  return best?tabOf(best):null}
dlg.addEventListener('click',()=>{if(dlgQ){dlgQ=false;dlg.classList.remove('quiet');holdT=0;return}
  if(dlgTab)setTab(dlgTab)});
function say(t,now){if(now){msgQ=[];cur=t;shown=0;holdT=0}else{msgQ.push(t);if(msgQ.length>3)msgQ.shift()}}
function msgStep(dt){
  if(shown<cur.length){if(shown===0){try{dlgTab=tabForMsg(cur)}catch(e){dlgTab=null}dlg.classList.toggle('go',!!dlgTab)}if(dlgQ){dlgQ=false;dlg.classList.remove('quiet')}shown=Math.min(cur.length,shown+dt*55);dlg.textContent=cur.slice(0,Math.floor(shown))}
  else{holdT+=dt;if(msgQ.length&&holdT>2.4){cur=msgQ.shift();shown=0;holdT=0}
    else if(!msgQ.length&&!dlgQ&&holdT>7&&!TITLE){dlgQ=true;dlg.classList.add('quiet')}}
}

