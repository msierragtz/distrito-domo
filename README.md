# Distrito Sierra

Simulador de ciudad retro, en pixel art isométrico, ambientado en Santa Catarina, Nuevo León. Idea y dirección: Mauricio. Programación, pixel art y jazz: Claude.

El juego es un solo archivo HTML sin dependencias: corre en cualquier navegador, como artifact de claude.ai o en itch.io.

## Cómo está organizado

```
src/
  index.html        la página: cabecera, barra, paneles; {{CSS}} y {{JS}} se rellenan al armar
  css/juego.css     todos los estilos
  js/orden.json     el orden en que se pegan los archivos de js/ (importa: ver abajo)
  js/*.js           el juego, por partes
  js/arte/*.js      el dibujo de cada edificio
dist/
  distrito-domo.html   el juego armado (este es el que se publica)
tools/              armar, revisar y empaquetar (Node, sin dependencias salvo eslint)
tests/              pruebas en navegador (Python + Playwright) y bots de balance
docs/               notas del proyecto
legacy/             (ya no existe en main; está en el historial: versiones v53–v64 tal como se publicaron)
```

### Las partes del juego (`src/js`, en orden)

| Archivo | Qué tiene |
|---|---|
| `errores.js` | Registro de los últimos 20 errores en el navegador |
| `datos.js` | Perillas de economía (`ECO`), opciones, `DEFS` (todos los edificios), niveles y nombres |
| `estado.js` | Partida nueva, terrenos, guardado, tipos de vecinos y gustos |
| `ribera.js` | Distrito Ribera: su mapa, el río (seco, lluvias, crecida), puentes, malecón, Puente Atirantado; el cambio entre distritos (tarjeta de los 3,000, panel «Tus distritos», viaje y llegada) |
| `obras.js` | Obras grandes: constantes y ayudas |
| `simulacion.js` | `recompute`, `satCalc`, `tick`: plusvalía, clientela, satisfacción, llegadas y salidas, eventos, quejas |
| `encargos.js` | Los 24 encargos, su motor y su panel |
| `mensajes.js`, `dia-noche.js` | Mensajes tipo GameBoy, reloj y luz |
| `dibujo.js` | Primitivas de pixel art: cajas, caras, ventanas, árboles, gente |
| `arte/*.js` | Un archivo por familia de edificios; `arte/ribera-edificios.js` tiene la vivienda y los negocios propios del Distrito Ribera (solo se usan allá); `arte/nuevos.js`, los de la v72 (casa de fraccionamiento, usos mixtos, cicloestación, banco, gasolinera y los especiales de la Ribera: alberca, parroquia y hotel) |
| `objetos.js` | `drawObj`: qué dibujo le toca a cada casilla |
| `vehiculos.js`, `cielo.js` | Tráfico de las avenidas (dos carriles por sentido, cambios de carril, paradas, freno ante peatones, orden de dibujo), coches, camión, tráiler; cielo y sierra |
| `transeuntes.js` | Cómo se ve la gente: cuerpo con caminado de 6 cuadros, poses, accesorios, carritos y balón |
| `vida.js` | A dónde va la gente y qué hace en la calle; «La voz de la calle» y seguir con la cámara |
| `temporadas.js` | Día de Muertos, Navidad y Fiestas Patrias: adornos en vivo, ofrendas, pinos, puestos, el Grito frente a La Cúpula |
| `huella.js` | Edificios de varias casillas (2×1, 2×2, 3×3) |
| `fuegos.js`, `juice.js` | Fuegos, polvo, destello, confeti, obra piso por piso, momentos de cámara, zoom suave |
| `render.js` | Imágenes en caché, sombras, suelo, el cuadro completo, la manita |
| `clima.js` | Reflejos en los charcos y relámpagos con trueno |
| `interfaz.js`, `entrada.js`, `pantalla.js` | Barra y paneles; mouse, toque, rueda y pellizco; rendimiento y orientación |
| `musica.js` | Jazz procedural y efectos de sonido; en la Ribera, su propio repertorio (bossa, bolero, samba-jazz y latin jazz) con guitarra de nailon, flauta y percusión latina |
| `foto.js` | Modo foto, paseo de cámara, grabación de video, historia del mapa y time-lapse |
| `arranque.js` | Cargar la partida y el ciclo principal |

**Importante:** todo el código vive dentro de un mismo cierre `(()=>{ … })()` que abre `datos.js` y cierra `arranque.js`. Los archivos no son módulos: se pegan uno tras otro en el orden de `orden.json`, así que todos ven las variables de todos. Un archivo nuevo se agrega a `orden.json` en el lugar que le toque. El siguiente paso de la base técnica sería pasarlos a módulos de verdad, poco a poco.

## Trabajar en el juego

Hace falta Node 18 o más (y Python 3 con Playwright para las pruebas).

```bash
npm run build      # arma dist/distrito-domo.html
npm run lint       # variables sin definir y otros errores (necesita «npm install» una vez)
npm run itch       # arma dist/distrito-domo-itch.zip para itch.io
npm test           # revisión + pruebas en navegador
npm run bots       # bots de balance (tardan: horas de juego simulado)
```

Para una versión nueva:

1. Cambiar lo que haga falta en `src/`.
2. `npm run build` y abrir `dist/distrito-domo.html` en el navegador.
3. `npm test`.
4. Subir `version` en `package.json` (0.77 → 0.78 = v78), hacer commit con lo que cambió.
5. Publicar `dist/distrito-domo.html` en el artifact y, si toca, `npm run itch` para itch.io.

`dist/distrito-domo.html` sí se guarda en git, para que siempre esté a la mano la última versión jugable.

## Pruebas

Todas abren el juego en Chromium con ganchos de prueba (`build/arnes.html`, se arma con `npm run arnes`). Lo que generan (capturas, resultados) queda en `build/`, que git ignora.

| Prueba | Qué revisa |
|---|---|
| `tests/monkey.py` | Toques, teclas, arrastres y rueda al azar en laptop y celular; falla si hay cualquier error. `TODO=1` abre todos los edificios, `SEG=40` cambia la duración, `RIBERA=1` lo corre en el Distrito Ribera |
| `tests/opciones.py` | Calidad baja, Alto contraste, Menos movimiento y Día de Muertos |
| `tests/obras.py` | Pone las 6 obras grandes en una ciudad de 2,600 vecinos y captura cada etapa de obra |
| `tests/escena.py` | Escena con todas las obras, en los 4 giros |
| `tests/juice.py` | Momento de La Cúpula, confeti, zoom con rueda e inercia |
| `tests/temporadas.py` | Capturas de la ciudad grande por temporada y hora (`SOLO=noche,lluvia-noche` para elegir) |
| `tests/detalle.py` | Acercamientos en la escena de muestra (`tests/datos/escena-muestra.js`) |
| `tests/foto.py` | Modo foto: hora, clima, temporada, filtro, guardar foto, grabar video, paseo y time-lapse; revisa que la partida no cambie |
| `tests/ribera.py` | Distrito Ribera de punta a punta: tarjeta de los 3,000, viaje y llegada, río, puentes, lecho, crecida, reparación, malecón, landmark, panel de distritos, guardado separado, ir y volver, partidas de v66 |
| `tests/transeuntes.py` | Transeúntes: destinos, banquetas, paradas, reacciones a eventos, carritos, obras, fuegos, la tarjeta de «La voz de la calle», seguir con la cámara, rendimiento y la vida en Ribera; guarda la hoja de poses |
| `tests/trafico.py` | Tráfico: nadie se encima, orden de dibujo en los 4 giros, cambios de carril, paradas, frenos y paso peatonal |
| `tests/ribera-edificios.py` | Vivienda y negocios de la Ribera: arte y nombres solo allá, todos los tipos y niveles se dibujan, barrio de muestra junto al río |
| `tests/musica-ribera.py` | Música de la Ribera: cada pieza se toca fuera de línea sin errores, sin saturar y con volumen parecido al del Cañón; `MUESTRAS=1` guarda un mp3 de cada una en `build/musica/` |
| `tests/v72.py` | Reglas de los edificios de la v72 (pisos de la casa, local de usos mixtos, banco, cicloestación, gasolinera junto a avenida, alberca, bodas y hotel) y que todos se dibujen |
| `tests/hoja-v72.py` | Hojas de aprobación del arte de la v72 |
| `tests/hoja-ribera.py` | Hojas de aprobación del arte (Cañón contra Ribera, de día y de noche, y variedad de colores) |
| `tests/timelapse.py` | Time-lapse desde una partida sin historia y regreso a la partida real |
| `tests/bots/correr.py` | Bots novato, intermedio, experto, muy experto y descuidado (`SEEDS=1,2,3`, `NOSTOP=1`) |

Para usar otro Chromium: `CHROME=/ruta/al/chrome`.

## Pendientes conocidos

Ver `docs/pendientes.md`. En la v76 salieron las marcas e instituciones reales y el juego dejó de llamarse como el desarrollo real: ahora es Distrito Sierra, con los distritos Cañón y Ribera (las llaves internas siguen siendo `domo` y `distritoDomo.*` para no perder partidas).

