/**
 * Servicio de comunicación para el módulo de Géneros
 * Conectado a /api/generos
 */

import { clienteApi } from './clienteApi';

export const servicioGeneros = {
  listar: async () => {
    const respuesta = await clienteApi.get('/generos/listarGeneros');
    return respuesta?.data || [];
  },

  crear: async (datos) => {
    const respuesta = await clienteApi.post('/generos/crearGeneros', datos);
    return respuesta?.data;
  },

  actualizar: async (id, datos) => {
    const respuesta = await clienteApi.put(`/generos/actualizarGeneros/${id}`, datos);
    return respuesta?.data;
  },

  eliminar: async (id) => {
    const respuesta = await clienteApi.delete(`/generos/eliminarGeneros/${id}`);
    return respuesta?.success;
  }
};
