/**
 * Servicio de comunicación para el módulo de Media (Películas y Series)
 * Conectado a /api/media
 */

import { clienteApi } from './clienteApi';

export const servicioMedia = {
  /**
   * Obtiene el listado completo de producciones multimedia
   */
  listar: async () => {
    const respuesta = await clienteApi.get('/media/listarMedia');
    return respuesta?.data || [];
  },

  /**
   * Registra una nueva producción multimedia
   * @param {object} datos - { serial, titulo, sinopsis, url, imagen, anio_estreno, genero_id, director_id, productora_id, tipo_id }
   */
  crear: async (datos) => {
    const respuesta = await clienteApi.post('/media/crearMedia', datos);
    return respuesta?.data;
  },

  /**
   * Actualiza una producción multimedia existente por su ID
   * @param {number|string} id
   * @param {object} datos
   */
  actualizar: async (id, datos) => {
    const respuesta = await clienteApi.put(`/media/actualizarMedia/${id}`, datos);
    return respuesta?.data;
  },

  /**
   * Elimina una producción multimedia de la base de datos
   * @param {number|string} id
   */
  eliminar: async (id) => {
    const respuesta = await clienteApi.delete(`/media/eliminarMedia/${id}`);
    return respuesta?.success;
  }
};
