/**
 * Servicio de comunicación para el módulo de Directores
 * Conectado a /api/directores
 */

import { clienteApi } from './clienteApi';

export const servicioDirectores = {
  listar: async () => {
    const respuesta = await clienteApi.get('/directores/listarDirectores');
    return respuesta?.data || [];
  },

  crear: async (datos) => {
    const respuesta = await clienteApi.post('/directores/crearDirectores', datos);
    return respuesta?.data;
  },

  actualizar: async (id, datos) => {
    const respuesta = await clienteApi.put(`/directores/actualizarDirectores/${id}`, datos);
    return respuesta?.data;
  },

  eliminar: async (id) => {
    const respuesta = await clienteApi.delete(`/directores/eliminarDirectores/${id}`);
    return respuesta?.success;
  }
};
