/**
 * Funciones de utilidad y formateo para PeliPlay
 * Convención de nombres en Español
 */

/**
 * Formatea una fecha ISO a formato legible en español
 * @param {string|Date} fecha - Cadena o fecha
 * @returns {string}
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return 'No registrada';
  try {
    const objetoFecha = new Date(fecha);
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(objetoFecha);
  } catch {
    return String(fecha);
  }
};

/**
 * Detecta si una URL corresponde a YouTube y devuelve el enlace embebido (embed)
 * @param {string} url - URL del video o trailer
 * @returns {{ esYoutube: boolean, urlEmbebida: string }}
 */
export const procesarUrlVideo = (url) => {
  if (!url) return { esYoutube: false, urlEmbebida: '' };

  // Detección de enlaces YouTube (watch, embed o short youtu.be)
  const regExpYoutube = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const coincidencia = url.match(regExpYoutube);

  if (coincidencia && coincidencia[1]) {
    return {
      esYoutube: true,
      urlEmbebida: `https://www.youtube.com/embed/${coincidencia[1]}?autoplay=1&rel=0`
    };
  }

  // Si es un archivo de video directo (.mp4, .webm, etc.)
  const esVideoDirecto = /\.(mp4|webm|ogg)$/i.test(url);

  return {
    esYoutube: false,
    esVideoDirecto,
    urlEmbebida: url
  };
};

/**
 * Genera un serial alfanumérico único para nuevas producciones
 * @param {string} tipo - 'PEL' o 'SER'
 * @returns {string}
 */
export const generarSerialUnico = (tipo = 'PEL') => {
  const anioActual = new Date().getFullYear();
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let aleatorio = '';
  for (let i = 0; i < 4; i++) {
    aleatorio += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return `${tipo}-${anioActual}-${aleatorio}`;
};
