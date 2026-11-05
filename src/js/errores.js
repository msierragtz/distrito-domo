/* registro mínimo de errores: los últimos 20 se guardan en este navegador y se ven en ⚙ Opciones */
(()=>{const K='distritoDomo.v4.errores',add=(m,l)=>{try{const L=JSON.parse(localStorage.getItem(K)||'[]');L.push([Date.now(),String(m||'?').slice(0,160),l||0]);localStorage.setItem(K,JSON.stringify(L.slice(-20)))}catch(e){}};
  addEventListener('error',e=>add(e.message,e.lineno));addEventListener('unhandledrejection',e=>add('promesa: '+((e.reason&&e.reason.message)||e.reason),0))})();
