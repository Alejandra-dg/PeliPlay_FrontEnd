/**
 * Cliente HTTP centralizado para comunicación con el Backend PeliPlay
 * Convención de nombres en Español
 */

// Normalizamos la URL base para admitir proxy '/api' o dominio completo en producción (Render/Netlify)
const obtenerUrlBase = () => {
  let base = (import.meta.env.VITE_API_URL || '/api').trim();
  // Elimina diagonales al final para evitar dobles barras
  base = base.replace(/\/+$/, '');
  // Si es una URL absoluta HTTP/HTTPS y no incluye el prefijo '/api', lo agrega automáticamente
  if (/^https?:\/\//i.test(base) && !base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
};

const URL_BASE = obtenerUrlBase();

/**
 * Realiza peticiones HTTP y maneja errores de forma uniforme
 * @param {string} puntoFinal - Endpoint relativo (ej: '/media/listarMedia')
 * @param {object} opciones - Opciones de fetch (method, body, headers)
 * @returns {Promise<any>}
 */
export const realizarPeticion = async (puntoFinal, opciones = {}) => {
  const rutaNormalizada = puntoFinal.startsWith('/') ? puntoFinal : `/${puntoFinal}`;
  const urlCompleta = `${URL_BASE}${rutaNormalizada}`;


  const encabezados = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(opciones.headers || {})
  };

  const configuracion = {
    ...opciones,
    headers: encabezados
  };

  if (configuracion.body && typeof configuracion.body === 'object') {
    configuracion.body = JSON.stringify(configuracion.body);
  }

  try {
    const respuesta = await fetch(urlCompleta, configuracion);
    const datosRespuesta = await respuesta.json().catch(() => null);

    if (!respuesta.ok) {
      const mensajeError = datosRespuesta?.message || `Error del servidor HTTP (${respuesta.status})`;
      const errorPersonalizado = new Error(mensajeError);
      errorPersonalizado.estado = respuesta.status;
      errorPersonalizado.detalles = datosRespuesta?.error || null;
      throw errorPersonalizado;
    }

    return datosRespuesta;
  } catch (error) {
    console.error(`Error en petición [${configuracion.method || 'GET'}] a ${urlCompleta}:`, error);
    throw error;
  }
};

/**
 * Métodos auxiliares para verbos HTTP
 */
export const clienteApi = {
  get: (puntoFinal) => realizarPeticion(puntoFinal, { method: 'GET' }),
  post: (puntoFinal, datos) => realizarPeticion(puntoFinal, { method: 'POST', body: datos }),
  put: (puntoFinal, datos) => realizarPeticion(puntoFinal, { method: 'PUT', body: datos }),
  delete: (puntoFinal) => realizarPeticion(puntoFinal, { method: 'DELETE' })
};

/**
 * Comprueba el estado de salud del servidor Backend
 * @returns {Promise<boolean>}
 */
export const verificarSaludBackend = async () => {
  try {
    const respuesta = await clienteApi.get('/health');
    return respuesta?.success === true;
  } catch {
    return false;
  }
};
