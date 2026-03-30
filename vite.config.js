import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    // Vite avisa si un archivo compilado supera 500kb. Al usar HeroUI las librerías 
    // pesan más de 500kb juntas, por lo que subimos el límite de la advertencia a 1000kb (1MB).
    chunkSizeWarningLimit: 1000,
  }
});
