# Distrito Domo: plan al siguiente nivel (9 nov 2026)

Documento completo: «Distrito Domo: plan al siguiente nivel» en Claude Docs (https://claude.ai/artifact/CvMECqp8u1j6aVjpfvb8uM). Estado: propuesta; las decisiones de Mauricio están abiertas.

**Tesis.** El siguiente nivel es que un extraño encuentre el juego en itch.io, lo entienda sin ayuda y quiera volver. No es agregar sistemas.

**Escenario recomendado: B · Publicar**, con dos fases previas de pulido. Si Mauricio elige A (quedarse en claude.ai), el plan termina en la fase 2.

## Las 4 fases (10 nov 2026 a 25 ene 2027)
| Fase | Qué entra | Criterio de salida |
|---|---|---|
| 1 · Que un extraño lo entienda (2 sem) | Pendientes de la auditoría v74, renombre de marcas, `S.hitos`, «Jugar» sin espera, 5 sesiones de prueba | 4 de 5 personas ajenas llegan a 100 vecinos en 15 min; 0 marcas reales |
| 2 · Llenar el valle (3 sem) | Umbrales en `tools/sim-node.mjs`, bosque y museo antes de 3,000, premios en especie, Agenda del Distrito | ≥1.5 novedades cada 10 min entre 1,000 y 3,000; optimizador a 3,000 en 150–200 min |
| 3 · Listo para salir (2 sem) | Página de itch.io, «Descargar copia» visible, «Copiar errores», foco en ventanas, 2 celulares reales | 30 cuadros por segundo 3 min en 2 celulares; la partida sobrevive en Chrome y Safari |
| 4 · Primeras 1,000 partidas (4 sem) | Lanzamiento, 4 piezas de contenido, parches quincenales | 1,000 partidas en itch.io en 30 días |

## Los 3 KPI
- Activación: partidas nuevas que llegan a 100 vecinos en 15 min → 70%.
- Profundidad: de quienes pasan 100, llegan a 1,000 → 40%.
- Regreso: jugadores que abren el juego otro día → 25%.

## Mecánica nueva elegida: Agenda del Distrito
Cada día de juego (`DAY` = 360 s) muestra los 3 eventos que vienen; el jugador elige uno y prepara el barrio. Usa `EVENTS`, `S.evForce`, `misStep()`, `momento()` y `M.fx`; no toca `ECO` ni `satCalc()`.

## Lo que NO se hace
Tercer distrito, inglés, PWA y tiendas, backend o multijugador, más edificios baratos.

## Decisiones de Mauricio (9 nov 2026)
1. Publicar: el juego ya está en itch.io (la fase 3 se acorta a una semana).
2. Renombre de marcas: aprobado, pero tiene que seguir siendo divertido. También hay que cambiar el nombre del juego, porque «Distrito Domo» es una marca: desde la v78 se llama **Distrito Sierra** (distritos Cañón y Ribera).
3. Obras grandes: bosque y museo llegan antes de los 3,000 vecinos.
4. Tiempo: 4 horas por semana. Con eso las duraciones se duplican: fase 1 hasta el 7 dic, fase 2 hasta el 18 ene, fase 3 hasta el 25 ene, lanzamiento y fase 4 hasta el 22 mar 2027.
5. Propina opcional en itch.io: pendiente (no urgente).
