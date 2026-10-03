// Color de fondo por sección. El layout lo escribe en --ws-paper (fondo) y
// --ws-accent (color del énfasis en cursiva de los titulares) al cambiar de ruta.
// Todos los fondos mantienen contraste AA con la tinta; el acento se elige
// para leerse sobre su fondo (rojo oscuro sobre amarillo, vino sobre los demás).
const YELLOW = { paper: '#FFD23F', accent: '#B8321A' };
const SKY    = { paper: '#86CCF2', accent: '#66023C' };
const CORAL  = { paper: '#FF8F6B', accent: '#66023C' };
const PINK   = { paper: '#FFA9C6', accent: '#66023C' };
const MINT   = { paper: '#86E0BC', accent: '#66023C' };
const LIME   = { paper: '#D6E96B', accent: '#66023C' };
const ORANGE = { paper: '#FFB454', accent: '#66023C' };
const CREAM  = { paper: '#F3EBDA', accent: '#B8321A' };

// Se evalúa en orden: la primera coincidencia gana.
const THEMES = [
  [(p) => p === '/', YELLOW],
  [(p) => p.startsWith('/feed') || p.startsWith('/post/'), SKY],
  [(p) => p.startsWith('/destinos'), CORAL],
  [(p) => p.startsWith('/manifiesto'), PINK],
  [(p) => p.startsWith('/como-funciona'), ORANGE],
  [(p) => p.startsWith('/contacto'), SKY],
  [(p) => p.startsWith('/login') || p.startsWith('/register'), MINT],
  [(p) => p.startsWith('/profile') || p.startsWith('/edit-') || p.startsWith('/new-post'), LIME],
  [(p) => p.startsWith('/admin'), CREAM],
];

export const themeForPath = (pathname) => {
  const hit = THEMES.find(([match]) => match(pathname));
  return hit ? hit[1] : YELLOW;
};
