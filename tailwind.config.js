import plugin from "tailwindcss/plugin";
import { heroui } from "@heroui/react";

// Paleta "editorial de viaje retro": fondo de color vivo, superficies crema y tintas planas.
// Una sola fuente de verdad: se expone como clases Tailwind (bg-ws-tomato) y
// como variables CSS (--ws-tomato) para los tokens de src/styles/index.css.
const ws = {
  paper: '#FFD23F',      // fondo de página: amarillo vivo (cámbialo aquí para probar otro color)
  'paper-light': '#FFF9EA', // superficies: tickets, tarjetas, campos (crema)
  'paper-deep': '#E6DAC1',  // separadores y fondos hundidos
  ink: '#18130F',        // tinta de texto y filetes
  tomato: '#EE4B2B',     // rojo imprenta (texto encima: crema)
  'tomato-deep': '#B8321A', // rojo para texto pequeño sobre papel
  mustard: '#F2B51D',    // amarillo mostaza
  ocean: '#0E4FA3',      // azul tinta (texto encima: papel)
  teal: '#2F8FA6',       // azul turquesa
  plum: '#66023C',       // vino (texto encima: papel)
  olive: '#6B7420',      // verde oliva (texto sobre papel)
  citron: '#CAD183',     // verde cidra, fondos suaves
  accent: 'var(--ws-accent)', // énfasis de titulares; lo fija cada sección (src/theme/pageThemes.js)
  line: 'rgb(24 19 15 / 0.16)',        // filete fino: separa sin pesar
  'line-strong': 'rgb(24 19 15 / 0.34)', // borde de campos y controles
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ws,
        // Alias heredados: las vistas antiguas siguen funcionando y heredan la paleta nueva.
        'woho-white': ws.paper,
        'woho-black': ws.ink,
        'woho-purple': ws.plum,
        'woho-orange': ws.tomato,
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        cuerpo: ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        titulo: ['"Instrument Sans Variable"', '"Instrument Sans"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    plugin(({ addBase }) => {
      addBase({
        ':root': Object.fromEntries(Object.entries({ ...ws, accent: '#B8321A' }).map(([k, v]) => [`--ws-${k}`, v])),
      });
    }),
    heroui({
      layout: {
        radiusMedium: '6px',
        radiusLarge: '8px',
        radiusSmall: '4px',
        borderWidth: { small: '1px', medium: '1.5px', large: '2px' },
      },
      themes: {
        light: {
          colors: {
            background: ws.paper,
            foreground: ws.ink,
            focus: ws.ocean,
            primary: { DEFAULT: ws.plum, foreground: ws['paper-light'] },
            secondary: { DEFAULT: ws.ocean, foreground: ws['paper-light'] },
          },
        },
      },
    }),
  ],
};
