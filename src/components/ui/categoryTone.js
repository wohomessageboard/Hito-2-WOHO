// Color de cada categoría de aviso. Lo comparten la etiqueta de la tarjeta (PostCard) y los
// filtros por categoría, para que un filtro marcado tenga el mismo color que sus etiquetas.
export const TAG_BY_TYPE = { Alojamiento: 'ws-tag-blue', Trabajo: 'ws-tag-tomato', Social: 'ws-tag-olive' };
export const tagClassFor = (type) => TAG_BY_TYPE[type] || 'ws-tag-ink';
// Color del icono de un filtro marcado: claro sobre todos los colores de categoría.
export const iconOnTag = () => 'text-ws-paper-light';

// Orden fijo de las categorías en todos los filtros (la base las devuelve en el orden en que se
// crearon, que no es el que queremos mostrar). Las categorías desconocidas van al final.
export const CATEGORY_ORDER = ['Alojamiento', 'Trabajo', 'Social', 'Otro'];
const rank = (key) => { const i = CATEGORY_ORDER.indexOf(key); return i === -1 ? CATEGORY_ORDER.length : i; };
export const sortCategories = (cats) => [...cats].sort((a, b) => rank(a.key) - rank(b.key));
