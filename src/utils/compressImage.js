// Reduce las fotos antes de subirlas: las del celular suelen pesar 4-12 MB y el
// servidor rechaza más de 10 MB por archivo (y las redimensiona igual a 1200 px).
// Si el navegador no puede decodificar el archivo (p. ej. HEIC en Chrome) o la
// compresión no ayuda, devuelve el original sin tocarlo.

// Vercel rechaza peticiones de más de 4,5 MB: con hasta 5 fotos por aviso, cada una debe
// quedar bajo ~800 KB. Se prueba con calidades/tamaños cada vez menores hasta lograrlo.
const STEPS = [
  { side: 1600, quality: 0.82 },
  { side: 1600, quality: 0.7 },
  { side: 1280, quality: 0.7 },
  { side: 1100, quality: 0.62 },
];
const TARGET_BYTES = 800 * 1024;
const SKIP_UNDER_BYTES = 600 * 1024; // ya es liviana

export async function compressImage(file) {
  try {
    if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;

    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    if (Math.max(bitmap.width, bitmap.height) <= STEPS[0].side && file.size < SKIP_UNDER_BYTES) {
      bitmap.close?.();
      return file;
    }

    let blob = null;
    for (const { side, quality } of STEPS) {
      const scale = Math.min(1, side / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#fff'; // PNG con transparencia: fondo blanco al pasar a JPEG
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= TARGET_BYTES) break;
    }
    bitmap.close?.();
    if (!blob || blob.size >= file.size) return file;

    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  }
}

export const compressImages = (files) => Promise.all(files.map(compressImage));
