import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { InsigniaEstado } from '../comunes/InsigniaEstado';

/**
 * Tabla genérica y moderna para administración de entidades maestras
 */
export const TablaEntidad = ({
  titulo,
  listaDatos = [],
  cargando = false,
  tieneDescripcion = true,
  alCrear,
  alEditar,
  alSolicitarEliminar
}) => {
  const [terminoBusqueda, setTerminoBusqueda] = useState('');

  const datosFiltrados = useMemo(() => {
    if (!terminoBusqueda.trim()) return listaDatos;
    const busqueda = terminoBusqueda.toLowerCase();
    return listaDatos.filter(
      (item) =>
        item.nombre?.toLowerCase().includes(busqueda) ||
        (item.descripcion && item.descripcion.toLowerCase().includes(busqueda))
    );
  }, [listaDatos, terminoBusqueda]);

  return (
    <div className="animacion-desvanecer">
      {/* Barra de Herramientas */}
      <div className="barra-herramientas-tabla">
        <div className="buscador-tabla">
          <Search size={16} />
          <input
            type="text"
            placeholder={`Buscar en ${titulo.toLowerCase()}...`}
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
          />
        </div>

        <button
          type="button"
          className="boton-primario"
          onClick={alCrear}
        >
          <Plus size={16} />
          <span>Nuevo {titulo}</span>
        </button>
      </div>

      {/* Tabla Responsiva */}
      <div className="contenedor-tabla-responsiva">
        <table className="tabla-datos">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th>Nombre</th>
              {tieneDescripcion && <th>Descripción</th>}
              <th style={{ width: '130px' }}>Estado</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cargando ? (
              <tr>
                <td colSpan={tieneDescripcion ? 5 : 4} style={{ textAlign: 'center', padding: '3rem' }}>
                  Cargando {titulo.toLowerCase()}...
                </td>
              </tr>
            ) : datosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={tieneDescripcion ? 5 : 4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-texto-atenuado)' }}>
                  No se encontraron registros de {titulo.toLowerCase()}.
                </td>
              </tr>
            ) : (
              datosFiltrados.map((item) => (
                <tr key={item.id}>
                  <td style={{ color: 'var(--color-texto-atenuado)', fontFamily: 'monospace' }}>
                    #{item.id}
                  </td>
                  <td style={{ fontWeight: 600 }}>{item.nombre}</td>
                  {tieneDescripcion && (
                    <td style={{ color: 'var(--color-texto-secundario)', maxWidth: '300px' }}>
                      {item.descripcion || <span style={{ color: 'var(--color-texto-atenuado)' }}>Sin descripción</span>}
                    </td>
                  )}
                  <td>
                    <InsigniaEstado estado={item.estado} />
                  </td>
                  <td>
                    <div className="acciones-fila" style={{ justifyContent: 'center' }}>
                      <button
                        type="button"
                        className="boton-accion-fila editar"
                        onClick={() => alEditar(item)}
                        title={`Editar ${item.nombre}`}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        type="button"
                        className="boton-accion-fila eliminar"
                        onClick={() => alSolicitarEliminar(item)}
                        title={`Eliminar ${item.nombre}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Resumen del Pie */}
        <div className="pie-tabla-resumen">
          <span>
            Mostrando {datosFiltrados.length} de {listaDatos.length} registros
          </span>
        </div>
      </div>
    </div>
  );
};
