# Mantenimiento de las guías de visa

Las guías de `/guias` dependen de páginas oficiales que cambian: cupos, fechas de apertura, precios,
edades. Este documento explica cómo mantenerlas al día con un comando.

## Qué hay

| Pieza | Dónde |
|---|---|
| Datos de las guías | `src/data/guias.js`, `guiasMas.js`, `guiasLote2.js` |
| Fecha de la última revisión | `src/data/revision.js` (`REVISADO_HOY`) y el campo `revisado` de cada guía |
| Script que revisa las fuentes | `scripts/revisar-fuentes.mjs` |
| Ajustes por fuente (claves, páginas manuales) | `scripts/fuentes-config.json` |
| Últimas copias guardadas de cada página | `scripts/fuentes-copias/` |
| Comando de Claude Code | `/revisar-guias` (`.claude/commands/revisar-guias.md`) |

Las fuentes **no se escriben a mano**: el script las saca de los campos `enlaces` de cada guía y
`fuentes` de cada pasaporte. Si agregas una guía con sus enlaces, se revisa sola.

## El comando

```bash
npm run guias:revisar                  # revisa todo y compara con la última copia
npm run guias:revisar -- --solo=japon  # solo las fuentes que coincidan (url, país o pasaporte)
npm run guias:revisar -- --guardar     # guarda las copias nuevas (después de actualizar las guías)
npm run guias:revisar -- --ci          # termina con error si algo cambió
npm run guias:fuentes                  # lista las fuentes y qué guías las usan
```

Cada página termina en uno de estos estados:

- **igual**: sin cambios desde la última copia.
- **CAMBIÓ**: el texto cambió. El informe muestra las líneas quitadas (`-`) y agregadas (`+`).
- **NUEVA**: primera vez que se lee (no hay copia con qué comparar).
- **MANUAL**: el script no puede leerla entera (carga datos con JavaScript o bloquea las descargas). Hay que abrirla en el navegador. La pista de qué mirar está en `fuentes-config.json`.
- **ERROR**: no se pudo descargar. Si se repite, pásala a manual en la configuración.

Además avisa:
- **«Ya no aparece»**: una cifra que se vigila (por ejemplo `940` en Nueva Zelanda) desapareció de la página: probablemente cambió un dato de la guía.
- **Guías sin revisar hace más de 90 días**.

El informe también queda en `tmp-revision/informe-AAAA-MM-DD.txt` (no se sube a git).

## Flujo recomendado

1. Corre `npm run guias:revisar`.
2. Con cada cambio: abre la página oficial, compara con la guía y actualiza los datos (`datos`, `aviso`, `faq`, `pasos`).
3. Repasa a mano las fuentes **MANUAL**.
4. Actualiza `REVISADO_HOY` en `src/data/revision.js` solo si repasaste todas.
5. Corre `npm run guias:revisar -- --guardar`, luego `npm run lint` y `npm run build`.
6. Rama `chore/revision-guias-AAAA-MM-DD`, commit, push y PR.

Con Claude Code, todo eso lo hace el comando `/revisar-guias`. Si abres Claude en la carpeta del
proyecto, escribe `/revisar-guias`.

## Cuándo revisar

- **Una vez al mes**, como mínimo.
- **Antes de fechas conocidas**: apertura de Nueva Zelanda (cada país tiene su fecha, publicada en una página nueva cada año), convocatorias de Irlanda, temporada de IEC en Canadá, cupos de Japón (enero y julio para Argentina; se agotan en días), períodos de Dinamarca (marzo a agosto y septiembre a febrero).
- **Cuando alguien te avise** de un dato incorrecto (el formulario de Contacto sirve para eso).

## Reglas de las guías

- Solo van datos leídos en la página oficial del país en esa revisión. Nada de memoria ni de sitios de terceros.
- Lo que cambia cada año lleva fecha y la invitación a confirmar en el sitio oficial.
- Si una página no se puede leer, la guía no se cambia y se anota qué falta.
- Las guías son informativas; no reemplazan la asesoría de un profesional de migración.

## Agregar una guía nueva

1. Lee la página oficial del destino para ese pasaporte (embajada, consulado o ministerio).
2. Agrega la guía en un archivo de `src/data/` con los campos de las demás (`slug`, `origen`, `pais`, `flag`, `visa`, `titulo`, `resumen`, `revisado`, `datos`, `pasos`, `trabajo`, `consejos`, `faq`, `enlaces`).
3. Si es un destino nuevo, agrega su etiqueta corta en `ETIQUETAS` (`src/data/guias.js`).
4. Si es un pasaporte nuevo, agrégalo en `ORIGENES` con sus `fuentes` y `acuerdos`.
5. En `scripts/fuentes-config.json` agrega, para sus enlaces, las `claves` (cifras a vigilar) o `manual` si el script no los puede leer.
6. `npm run guias:revisar -- --guardar` para tener la copia inicial.
7. `npm run build`: el sitemap, el HTML previo y los datos estructurados se generan solos.
