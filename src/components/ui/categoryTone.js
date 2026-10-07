// Color de cada categoría de aviso. Lo comparten la etiqueta de la tarjeta (PostCard) y los
// filtros por categoría, para que un filtro marcado tenga el mismo color que sus etiquetas.
export const TAG_BY_TYPE = { Alojamiento: 'ws-tag-blue', Trabajo: 'ws-tag-tomato', Social: 'ws-tag-olive' };
export const tagClassFor = (type) => TAG_BY_TYPE[type] || 'ws-tag-ink';
// Color del icono sobre cada relleno: el tomate lleva texto oscuro y los demás, claro.
export const iconOnTag = (tagClass) => (tagClass === 'ws-tag-tomato' ? 'text-ws-ink' : 'text-ws-paper-light');
