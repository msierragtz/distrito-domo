// escena de muestra: una ciudad chica y abierta con todo lo que se quiere enseñar (se arma con act() sobre una partida nueva)
(()=>{const D=__dd,S=D.S,I=(x,y)=>D.idx(x,y);
 S.$=5e7;S.maxV=4800;S.won3=1;for(const k of Object.keys(D.DEFS))if(!S.unl.includes(k))S.unl.push(k);
 for(let y=8;y<=18;y++){S.g[I(20,y)]={k:'calle',s:1,b:0}}for(let x=17;x<20;x++)S.g[I(x,12)]={k:'calle',s:1,b:0};
 for(let x=7;x<11;x++)S.g[I(x,12)]={k:'calle',s:2,b:0};
 const put=(k,x,y)=>{D.setTool(k);D.act(I(x,y));const t=S.g[I(x,y)];if(t.k!==k)return k+':'+String(D.cur).slice(0,50);t.b=0;return k};
 const r=[put('beis',8,8),put('bosque',8,13),put('plazacom',17,8),put('museo',12,8),put('plaza',14,8),put('rasca',17,13),put('metro',9,16),put('domo',15,15)];
 for(const [x,y] of [[21,8],[21,10],[21,13],[21,15],[21,17]])r.push(put('torre',x,y));
 for(const [x,y] of [[12,13],[12,14]])r.push(put('edificio',x,y));
 for(const [x,y] of [[12,16],[12,17]])r.push(put('ladrillo',x,y));
 r.push(put('plaza',14,13),put('plaza',14,16),put('parque',15,17),put('parque',17,17),put('palma',13,13),put('cafe',15,13),put('resto',15,10),put('bar',15,11),put('cafe',13,10),put('tomates',12,11));
 for(const t of S.g){if(t.b>0)t.b=0;if(t.k==='torre')t.f=24;if(t.k==='edificio'||t.k==='ladrillo')t.f=7}D.recompute();return r})()
