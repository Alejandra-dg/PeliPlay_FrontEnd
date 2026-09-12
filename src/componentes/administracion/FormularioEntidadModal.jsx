import React, { useState, useEffect } from 'react';
import { X, Tag } from 'lucide-react';

/**
 * Modal genérico y reutilizable para crear y editar entidades maestras
 * (Géneros, Directores, Productoras, Tipos)
 */
export const FormularioEntidadModal = ({
  abierto,
  tituloEntidad = 'Elemento',
  entidadAEditar,
  incluyeDescripcion = true,
  alGuardar,
  alCerrar
}) => {
  const [formulario, setFormulario] = useState({
    nombre: '',
    descripcion: '',
    estado: 'Activo'
  });
  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (entidadAEditar) {
      setFormulario({
        nombre: entidadAEditar.nombre || '',
        descripcion: entidadAEditar.descripcion || '',
        estado: entidadAEditar.estado || 'Activo'
      });
    } else {
      setFormulario({
        nombre: '',
        descripcion: '',
        estado: 'Activo'
      });
    }
    setErrores({});
  }, [entidadAEditar, abierto]);

  if (!abierto) return null;

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.nombre?.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setGuardando(true);
    try {
      const datosAEnviar = {
        nombre: formulario.nombre.trim(),
        estado: formulario.estado
      };

      if (incluyeDescripcion) {
        datosAEnviar.descripcion = formulario.descripcion?.trim() || null;
      }

      await alGuardar(datosAEnviar, entidadAEditar?.id);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-superposicion animacion-desvanecer" onClick={alCerrar}>
      <div
        className="modal-caja animacion-escala"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-cabecera">
          <h3 className="modal-titulo">
            <Tag size={20} color="var(--color-primario)" />
            {entidadAEditar ? `Editar ${tituloEntidad}` : `Nuevo ${tituloEntidad}`}
          </h3>
          <button
            type="button"
            className="modal-boton-cerrar"
            onClick={alCerrar}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={manejarEnvio}>
          <div className="modal-cuerpo">
            <div className="formulario-grilla">
              {/* Nombre */}
              <div className="campo-formulario campo-ancho-completo">
                <label className="etiqueta-formulario">
                  Nombre <span className="requerido">*</span>
                </label>
                <input
                  type="text"
                  className="entrada-formulario"
                  placeholder={`Ej: ${tituloEntidad === 'Director' ? 'Steven Spielberg' : 'Acción'}`}
                  value={formulario.nombre}
                  onChange={(e) => setFormulario({ ...formulario, nombre: e.target.value })}
                  autoFocus
                />
                {errores.nombre && <span className="mensaje-error-campo">{errores.nombre}</span>}
              </div>

              {/* Estado */}
              <div className="campo-formulario campo-ancho-completo">
                <label className="etiqueta-formulario">Estado</label>
                <select
                  className="selector-formulario"
                  value={formulario.estado}
                  onChange={(e) => setFormulario({ ...formulario, estado: e.target.value })}
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>

              {/* Descripción (si aplica a la entidad) */}
              {incluyeDescripcion && (
                <div className="campo-formulario campo-ancho-completo">
                  <label className="etiqueta-formulario">Descripción</label>
                  <textarea
                    className="area-texto-formulario"
                    placeholder={`Descripción o notas sobre este ${tituloEntidad.toLowerCase()}...`}
                    value={formulario.descripcion}
                    onChange={(e) => setFormulario({ ...formulario, descripcion: e.target.value })}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="modal-pie">
            <button
              type="button"
              className="boton-secundario"
              onClick={alCerrar}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="boton-primario"
              disabled={guardando}
            >
              {guardando ? 'Guardando...' : (entidadAEditar ? 'Actualizar' : 'Guardar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
