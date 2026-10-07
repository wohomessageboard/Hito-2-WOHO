---
description: Revisa las fuentes oficiales de las guías de visa, actualiza lo que cambió y prepara el PR
---

Revisa que las guías de visa (`/guias`) sigan al día con sus fuentes oficiales. Trabaja en la carpeta
`WOHO - DL` (frontend). Lee antes `GUIAS-MANTENIMIENTO.md`: ahí están las reglas.

Reglas que no se negocian:
- Solo escribes en las guías lo que leíste en la página oficial en esta revisión. Si no pudiste leerla, NO cambies la guía: anótalo en el informe final.
- Cifras, fechas y estados salen de la página, no de memoria ni de sitios de terceros.
- Si algo es ambiguo, deja la frase prudente («confirma en el sitio oficial») y avísalo.

Pasos:
1. Ejecuta `npm run guias:revisar` y lee el informe completo.
2. Por cada fuente **CAMBIÓ**: abre la página oficial, compara con la guía que la usa (campos `datos`, `aviso`, `faq`, `pasos`, `trabajo` en `src/data/guias.js`, `guiasMas.js`, `guiasLote2.js`) y actualiza lo que haya cambiado. Si el cambio no afecta a ninguna cifra de la guía, no toques nada.
3. Por cada fuente **MANUAL**: ábrela con el navegador integrado (`get_page_text` o JavaScript en la página) y comprueba la pista de `scripts/fuentes-config.json`. Para Home Affairs mira el precio, la edad, los meses de trabajo especificado y la tabla de cupos por país; para Cancillería de Argentina y de Chile, la lista de países con acuerdo.
4. Por cada aviso «Ya no aparece»: la cifra de la guía puede estar desactualizada; verifícala y corrige o ajusta la clave en `scripts/fuentes-config.json`.
5. Revisa los avisos con fecha (`aviso` y la fila «Estado» en `datos`): si la fecha ya pasó o cambió el estado, actualízalos. Mira también si Nueva Zelanda publicó la página de fechas de apertura del año nuevo y actualiza ese enlace.
6. Si una fuente ya no existe o cambió de dirección, corrige el enlace en las guías y en `scripts/fuentes-config.json`.
7. Cuando termines: actualiza `REVISADO_HOY` en `src/data/revision.js` solo si repasaste todas las guías; si dejaste alguna sin verificar, no lo cambies y dilo.
8. Ejecuta `npm run guias:revisar -- --guardar` para guardar las copias nuevas, luego `npm run lint` y `npm run build`.
9. Crea la rama `chore/revision-guias-AAAA-MM-DD`, haz commit con un mensaje que liste lo que cambió y súbela. Entrega el enlace del PR. No fusiones.

Informe final (en español, corto): qué cambió en cada guía, qué fuentes no pudiste leer y qué queda por revisar a mano.
