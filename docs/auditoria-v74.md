# Auditoría Distrito Domo v74 (9 nov 2026)

Documento completo con gráficas y tablas: «Auditoría Distrito Domo v74» en Claude Docs (https://claude.ai/artifact/A3JjEHhpVVV3vGaEgBDu3g).

## Hallazgos medidos
- **Necesidades**: si nadie atiende los globitos la satisfacción no pasa de 0.5 y no llega nadie. Bot `sinplusvalia`: 81 vecinos a las 4 h con $450–750 mil sin gastar.
- **Agua**: el casual (bot `novato`, nunca construye torre) se estanca en 1,355–1,430 (penalización hasta −0.16 con 500 de más). Torre: se abre a 750, $50,000 ×1.2.
- **Tiempo a 3,000 (Domo)**: optimizador 152–175 min (3/3); intermedio 168–212 min (2/3); casual y «no entiende» nunca.
- **Ribera sin bono**: mismo patrón; arranca con satisfacción 0.48 (< 0.5).
- **Valle de contenido**: 26 de 43 desbloqueos antes de 400 vecinos; entre 1,000 y 3,000 solo 6 (0.5–0.7 novedades cada 10 min); las 6 obras grandes salen de encargos de 3,000–4,600 (después de los créditos). Ningún bot completó un encargo grande en 4 h.
- **Rendimiento (ciudad de 2,600, Chromium por software)**: 59–60 fps con CPU normal; con CPU ×4: 20–34 fps, p95 117 ms al atardecer. «Calidad baja» da +34–40% sobre AUTOLOW. tick 0.1–0.2 ms, recompute 2–3 ms, guardar 0.3–1.1 ms (40 KB): la simulación no es el cuello.
- **Bugs**: errores.js escribe siempre en `distritoDomo.v4.errores` (Opciones de la Ribera lee otra llave); `CLOUD.flush()` pone `ready=false` en silencio; `tabForMsg()` manda las quejas «hay N edificios sin…» a Vivienda; `#pausebar` tapa `#needs` en 390×844; `#dialog` (aria-live) anuncia letra por letra; ningún `.focus()` en ventanas; Shift+L fuerza la tormenta para cualquiera; `misBono` usa el ingreso del momento de cobrar.

## Plan
| ID | Mejora | Jugador | Negocio | Esfuerzo (5=bajo) | Riesgo |
|---|---|---|---|---|---|
| H1-1 | Guía de 3 pasos de necesidades | 5 | 5 | 3 | 2 |
| H1-2 | Agua visible (600 vecinos, $25k la primera, aviso que abre Servicios) | 4 | 4 | 4 | 2 |
| H1-3 | Cola de mensajes con prioridad y pestaña explícita | 4 | 3 | 4 | 2 |
| H1-4 | AUTOLOW con presupuestos de OPT.low + RES 1 | 4 | 3 | 4 | 2 |
| H1-5 | Caché de sprites (LASTMAX dinámico, LRU, OUTC por RES) | 3 | 2 | 4 | 2 |
| H1-6 | Nube que avisa y reintenta; errores por distrito | 4 | 4 | 4 | 2 |
| H1-7 | Pausa que no tape el panel en celular | 3 | 2 | 5 | 1 |
| H1-8 | misBono promediado; atajos Shift solo en presentador | 2 | 2 | 5 | 1 |
| H1-9 | Arranque de la Ribera ≥ 0.55 | 3 | 3 | 5 | 1 |
| H1-10 | Mensajes de llegada variados y por distrito | 2 | 2 | 5 | 1 |
| H1-11 | Renombre de marcas reales (pendiente de aprobación) | 1 | 4 | 4 | 1 |
| H2-1 | Registro único de edificios | 1 | 4 | 2 | 3 |
| H2-2 | Encargos: obras grandes entre 1,500 y 2,500, premios en especie | 5 | 4 | 3 | 3 |
| H2-3 | Accesibilidad completa (foco, región viva, teclado en el mapa) | 3 | 3 | 3 | 2 |
| H2-4 | Simulador en Node con umbrales ±15% | 2 | 4 | 4 | 1 |
| H2-5 | Capa fija de edificios + precalentado en ratos libres | 4 | 3 | 2 | 4 |
| H2-6 | Time-lapse en IndexedDB | 3 | 3 | 3 | 3 |
| H2-7 | Telemetría con permiso (hitos, abandono por etapa, errores) | 1 | 5 | 3 | 3 |

## Herramientas
- `node tools/sim-node.mjs <perfil> <semillas> <distrito> <horas>`: el bot de balance en Node con el código real (4 h de juego en 3–12 s).
- `python3 tests/perf-auditoria.py` y `tests/perf-low.py`: sonda de rendimiento sobre `tests/datos/ciudad-2600.json`.
- `tests/bots/correr.py`: perfil nuevo `sinplusvalia` y variable `DIST=ribera`.
