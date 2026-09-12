/**
 * Servicio de comunicación para el módulo de Productoras
 * Conectado a /api/productoras
 */

import { clienteApi } from './clienteApi';

export const servicioProductoras = {
  listar: async () => {
    const respuesta = await clienteApi.get('/productoras/listarProductoras');
    return respuesta?.data || [];
  },

  crear: async (datos) => {
    const respuesta = await clienteApi.post('/productoras/crearProductoras', datos);
    return respuesta?.data;
  },

  actualizar: async (id, datos) => {
    const respuesta = await clienteApi.put(`/productoras/actualizarProductoras/${id}`, datos);
    return respuesta?.data;
  },

  eliminar: async (id) => {
    const respuesta = await clienteApi.delete(`/productoras/eliminarProductoras/${id}`);
    return respuesta?.success;
  }
};
