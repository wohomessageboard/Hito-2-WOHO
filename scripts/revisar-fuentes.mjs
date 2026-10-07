// Revisa las páginas oficiales en las que se apoyan las guías de visa y avisa qué cambió.
//
//   npm run guias:revisar                 revisa todas las fuentes y compara con la última copia guardada
//   npm run guias:revisar -- --guardar    además guarda las copias nuevas (hazlo DESPUÉS de actualizar las guías)
//   npm run guias:revisar -- --solo=japon revisa solo las fuentes que coincidan (url, país, pasaporte)
//   npm run guias:revisar -- --lista      solo muestra las fuentes y qué guías las usan
//   npm run guias:revisar -- --ci         termina con error si algo cambió (para automatizarlo)
//
// Las fuentes salen solas de las guías (campo `enlaces`) y de los pasaportes (`fuentes`) en
// src/data/guias.js: si agregas una guía o un enlace, se revisa sin tocar este archivo.
// Los ajustes por fuente (claves a vigilar, páginas que hay que mirar con navegador) están en
// scripts/fuentes-config.json. Las copias guardadas están en scripts/fuentes-copias/.
//
// Qué NO hace: no cambia las guías. Detecta, y tú (o Claude, con /revisar-guias) actualizas
// los datos y la fecha `revisado`. Ver GUIAS-MANTENIMIENTO.md.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { GUIAS, ORIGENES, tieneEdadRegistrada } from '../src/data/guias.js';
import { REVISADO_HOY } from '../src/data/revision.js';

const args = process.argv.slice(2);
const flag = (n) => args.includes(`--${n}`);
const opt = (n) => args.find((a) => a.startsWith(`--${n}=`))?.split('=').slice(1).join('=');

const DIR = 'scripts/fuentes-copias';
const CONFIG_FILE = 'scripts/fuentes-config.json';
const config = existsSync(CONFIG_FILE) ? JSON.parse(readFileSync(CONFIG_FILE, 'utf8')) : {};
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15';
const DIAS_VENCIDA = 90;

// ── 1. Fuentes: todas las URL distintas y quién las usa ──
const fuentes = new Map();
const agrega = (href, label, quien) => {
  if (!fuentes.has(href)) fuentes.set(href, { href, label, usada: [] });
  fuentes.get(href).usada.push(quien);
};
for (const g of GUIAS) for (const e of g.enlaces) agrega(e.href, e.label, `${g.origen}/${g.slug}`);
for (const o of ORIGENES) for (const f of o.fuentes) agrega(f.href, f.label, `pasaporte:${o.slug}`);

const filtro = opt('solo')?.toLowerCase();
const lista = [...fuentes.values()]
  .filter((f) => !config[f.href]?.ignorar)
  .filter((f) => !filtro || f.href.toLowerCase().includes(filtro) || f.usada.some((u) => u.toLowerCase().includes(filtro)));

if (flag('lista')) {
  for (const f of lista) console.log(`${config[f.href]?.manual ? '[manual] ' : ''}${f.href}\n   ${f.label}\n   usada en: ${[...new Set(f.usada)].join(', ')}`);
  console.log(`\n${lista.length} fuentes.`);
  process.exit(0);
}

// ── 2. Descarga y limpieza del texto ──
const decode = (t) => t.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
const textoDe = (html) => {
  let h = html.replace(/<(script|style|noscript|svg|nav|header|footer|form)[\s\S]*?<\/\1>/gi, ' ');
  const main = h.match(/<(main|article)[\s\S]*?<\/\1>/i);
  if (main) h = main[0];
  h = h.replace(/<\/(p|div|li|h[1-6]|tr|br|section)>|<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, ' ');
  return decode(h).replace(/[ \t​]+/g, ' ').replace(/\n\s*\n+/g, '\n').trim();
};

async function descarga(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf,*/*' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const tipo = res.headers.get('content-type') || '';
  if (/pdf/i.test(tipo) || url.toLowerCase().endsWith('.pdf')) {
    const buf = Buffer.from(await res.arrayBuffer());
    return { texto: `[PDF ${buf.length} bytes]`, hash: createHash('sha256').update(buf).digest('hex') };
  }
  const texto = textoDe(await res.text());
  if (texto.length < 200) throw new Error('casi sin texto (la página carga sus datos con JavaScript)');
  return { texto, hash: createHash('sha256').update(texto).digest('hex') };
}

// ── 3. Comparación ──
const trozos = (t) => t.split(/(?<=[.!?:;])\s+|\n/).map((s) => s.trim()).filter((s) => s.length > 3);
const diff = (antes, ahora) => {
  const a = new Set(trozos(antes)), b = new Set(trozos(ahora));
  return { quitado: [...a].filter((x) => !b.has(x)), nuevo: [...b].filter((x) => !a.has(x)) };
};
const corto = (s) => (s.length > 170 ? `${s.slice(0, 167)}…` : s);
const archivo = (url) => `${DIR}/${createHash('sha1').update(url).digest('hex').slice(0, 12)}.json`;

mkdirSync(DIR, { recursive: true });
const resultados = [];
const cola = [...lista];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (cola.length) {
    const f = cola.shift();
    const cfg = config[f.href] || {};
    const r = { ...f, estado: 'igual', detalle: [], claves: [] };
    try {
      const { texto, hash } = await descarga(f.href);
      const file = archivo(f.href);
      const previa = existsSync(file) ? JSON.parse(readFileSync(file, 'utf8')) : null;
      r.texto = texto; r.hash = hash;
      if (!previa) r.estado = 'nueva';
      else if (previa.hash !== hash) { r.estado = 'cambió'; r.detalle = [diff(previa.texto, texto)]; }
      if (cfg.manual && r.estado !== 'cambió') { r.estado = 'manual'; r.error = 'el script solo ve parte de la página'; }
      for (const c of cfg.claves || []) if (!texto.toLowerCase().includes(String(c).toLowerCase())) r.claves.push(c);
    } catch (e) {
      r.estado = cfg.manual ? 'manual' : 'error';
      r.error = e.message;
    }
    resultados.push(r);
  }
}));

// ── 4. Informe ──
const orden = { 'cambió': 0, error: 1, manual: 2, nueva: 3, igual: 4 };
resultados.sort((a, b) => orden[a.estado] - orden[b.estado] || a.href.localeCompare(b.href));
const etiqueta = { 'cambió': 'CAMBIÓ  ', error: 'ERROR   ', manual: 'MANUAL  ', nueva: 'NUEVA   ', igual: 'igual   ' };
const lineas = [`Revisión de fuentes de las guías · ${new Date().toISOString().slice(0, 10)} · ${resultados.length} páginas`, ''];
for (const r of resultados) {
  lineas.push(`${etiqueta[r.estado]} ${r.href}`);
  lineas.push(`          ${r.label} · usada en: ${[...new Set(r.usada)].join(', ')}`);
  if (r.estado === 'cambió') {
    const d = r.detalle[0];
    d.quitado.slice(0, 8).forEach((x) => lineas.push(`          - ${corto(x)}`));
    d.nuevo.slice(0, 8).forEach((x) => lineas.push(`          + ${corto(x)}`));
    const mas = Math.max(0, d.quitado.length - 8) + Math.max(0, d.nuevo.length - 8);
    if (mas) lineas.push(`          … y ${mas} líneas más`);
  }
  if (r.estado === 'error' || r.estado === 'manual') lineas.push(`          ${r.estado === 'manual' ? 'Revisar a mano en el navegador' : 'No se pudo leer'}: ${r.error}${config[r.href]?.nota ? ` · ${config[r.href].nota}` : ''}`);
  if (r.claves.length) lineas.push(`          ⚠ Ya no aparece: ${r.claves.map((c) => `«${c}»`).join(', ')} (¿cambió una cifra de la guía?)`);
}

const hoy = Date.now();
const vencidas = GUIAS.filter((g) => (hoy - new Date(`${g.revisado}T12:00:00`).getTime()) / 864e5 > DIAS_VENCIDA);
lineas.push('', vencidas.length ? `Guías sin revisar hace más de ${DIAS_VENCIDA} días: ${vencidas.map((g) => `${g.origen}/${g.slug}`).join(', ')}` : `Todas las guías se revisaron hace menos de ${DIAS_VENCIDA} días (última revisión registrada: ${REVISADO_HOY}).`);

const sinEdad = GUIAS.filter((g) => !tieneEdadRegistrada(g));
if (sinEdad.length) lineas.push(`⚠ Guías sin edad máxima para el buscador (agrégalas en EDAD_MAX, src/data/guias.js): ${sinEdad.map((g) => `${g.origen}/${g.slug}`).join(', ')}`);

const n = (e) => resultados.filter((r) => r.estado === e).length;
lineas.push(`Resumen: ${n('cambió')} cambiaron · ${n('error')} con error · ${n('manual')} para revisar a mano · ${n('nueva')} nuevas · ${n('igual')} sin cambios · ${resultados.filter((r) => r.claves.length).length} con cifras que ya no aparecen.`);
console.log(lineas.join('\n'));

mkdirSync('tmp-revision', { recursive: true });
writeFileSync(`tmp-revision/informe-${new Date().toISOString().slice(0, 10)}.txt`, lineas.join('\n'));

// ── 5. Guardar copias (solo con --guardar) ──
if (flag('guardar')) {
  let guardadas = 0;
  for (const r of resultados) {
    if (!r.texto) continue;
    writeFileSync(archivo(r.href), JSON.stringify({ url: r.href, guardado: new Date().toISOString(), hash: r.hash, texto: r.texto.slice(0, 80000) }, null, 1));
    guardadas++;
  }
  console.log(`\nCopias guardadas: ${guardadas}. Recuerda actualizar la fecha \`revisado\` (src/data/revision.js) si ya repasaste las guías.`);
} else if (n('cambió') || n('nueva')) {
  console.log('\nNo se guardó nada. Cuando hayas actualizado las guías, repite con --guardar.');
}

if (flag('ci') && (n('cambió') || n('error') || resultados.some((r) => r.claves.length))) process.exit(1);
