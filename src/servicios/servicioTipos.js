/**
 * Servicio de comunicación para el módulo de Tipos (Película / Serie)
 * Conectado a /api/tipos
 */

import { clienteApi } from './clienteApi';

export const servicioTipos = {
  listar: async () => {
    const respuesta = await clienteApi.get('/tipos/listarTipos');
    return respuesta?.data || [];
  },

  crear: async (datos) => {
    const respuesta = await clienteApi.post('/tipos/crearTipos', datos);
    return respuesta?.data;
  },

  actualizar: async (id, datos) => {
    const respuesta = await clienteApi.put(`/tipos/actualizarTipos/${id}`, datos);
    return respuesta?.data;
  },

  eliminar: async (id) => {
    const respuesta = await clienteApi.delete(`/tipos/eliminarTipos/${id}`);
    return respuesta?.success;
  }
};
