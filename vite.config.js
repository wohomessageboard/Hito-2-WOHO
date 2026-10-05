import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Etiqueta de verificación de AdSense: solo se inyecta si existe VITE_ADSENSE_CLIENT al
// compilar. El script de anuncios NO va aquí: lo carga AdSlot cuando hace falta.
const adsenseMeta = (client) => ({
  name: 'adsense-account-meta',
  transformIndexHtml(html) {
    return /^ca-pub-\d{10,}$/.test(client)
      ? html.replace('</head>', `    <meta name="google-adsense-account" content="${client}" />\n  </head>`)
      : html;
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), adsenseMeta(env.VITE_ADSENSE_CLIENT || '')],
    server: {
      port: Number(process.env.PORT) || 5173,
      strictPort: false,
    },
    build: {
      chunkSizeWarningLimit: 1000,
    },
  };
});
