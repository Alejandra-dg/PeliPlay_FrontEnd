import React, { useState, useEffect } from 'react';
import { X, Film, RefreshCw } from 'lucide-react';
import { generarSerialUnico } from '../../utilidades/formateadores';

/**
 * Modal de formulario para Crear y Editar producciones multimedia (Media)
 */
export const FormularioMediaModal = ({
  abierto,
  mediaAEditar,
  listaGeneros = [],
  listaDirectores = [],
  listaProductoras = [],
  listaTipos = [],
  listaMedia = [],
  alGuardar,
  alCerrar
}) => {
  const [formulario, setFormulario] = useState({
    serial: '',
    titulo: '',
    sinopsis: '',
    url: '',
    imagen: '',
    anio_estreno: new Date().getFullYear(),
    genero_id: '',
    director_id: '',
    productora_id: '',
    tipo_id: ''
  });

  const [errores, setErrores] = useState({});
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (mediaAEditar) {
      setFormulario({
        serial: mediaAEditar.serial || '',
        titulo: mediaAEditar.titulo || '',
        sinopsis: mediaAEditar.sinopsis || '',
        url: mediaAEditar.url || '',
        imagen: mediaAEditar.imagen || '',
        anio_estreno: mediaAEditar.anio_estreno || new Date().getFullYear(),
        genero_id: mediaAEditar.genero_id || mediaAEditar.genero?.id || '',
        director_id: mediaAEditar.director_id || mediaAEditar.director?.id || '',
        productora_id: mediaAEditar.productora_id || mediaAEditar.productora?.id || '',
        tipo_id: mediaAEditar.tipo_id || mediaAEditar.tipo?.id || ''
      });
    } else {
      // Valores por defecto al crear nueva
      setFormulario({
        serial: '',
        titulo: '',
        sinopsis: '',
        url: '',
        imagen: '',
        anio_estreno: new Date().getFullYear(),
        genero_id: listaGeneros[0]?.id || '',
        director_id: listaDirectores[0]?.id || '',
        productora_id: listaProductoras[0]?.id || '',
        tipo_id: listaTipos[0]?.id || ''
      });
    }
    setErrores({});
  }, [mediaAEditar, abierto, listaGeneros, listaDirectores, listaProductoras, listaTipos]);

  if (!abierto) return null;

  const validar = () => {
    const nuevosErrores = {};
    if (!formulario.serial?.trim()) {
      nuevosErrores.serial = 'El serial es obligatorio';
    } else {
      const serialNormalizado = formulario.serial.trim().toLowerCase();
      const yaExiste = listaMedia.some(
        (m) =>
          m.serial?.trim().toLowerCase() === serialNormalizado &&
          (!mediaAEditar || m.id !== mediaAEditar.id)
      );
      if (yaExiste) {
        nuevosErrores.serial = 'Este serial ya está en uso por otra producción. El serial debe ser único.';
      }
    }

    if (!formulario.titulo?.trim()) nuevosErrores.titulo = 'El título es obligatorio';
    if (!formulario.genero_id) nuevosErrores.genero_id = 'Debes seleccionar un género';
    if (!formulario.director_id) nuevosErrores.director_id = 'Debes seleccionar un director';
    if (!formulario.productora_id) nuevosErrores.productora_id = 'Debes seleccionar una productora';
    if (!formulario.tipo_id) nuevosErrores.tipo_id = 'Debes seleccionar un tipo (Película / Serie)';

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (!validar()) return;

    setGuardando(true);
    try {
      const datosAEnviar = {
        ...formulario,
        anio_estreno: formulario.anio_estreno ? parseInt(formulario.anio_estreno, 10) : null,
        genero_id: parseInt(formulario.genero_id, 10),
        director_id: parseInt(formulario.director_id, 10),
        productora_id: parseInt(formulario.productora_id, 10),
        tipo_id: parseInt(formulario.tipo_id, 10)
      };

      await alGuardar(datosAEnviar, mediaAEditar?.id);
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
        {/* Cabecera */}
        <div className="modal-cabecera">
          <h3 className="modal-titulo">
            <Film size={22} color="var(--color-primario)" />
            {mediaAEditar ? 'Editar Producción Multimedia' : 'Registrar Nueva Producción'}
          </h3>
          <button
            type="button"
            className="modal-boton-cerrar"
            onClick={alCerrar}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={manejarEnvio}>
          <div className="modal-cuerpo">
            <div className="formulario-grilla">
              {/* Título */}
              <div className="campo-formulario campo-ancho-completo">
                <label className="etiqueta-formulario">
                  Título de la Producción <span className="requerido">*</span>
                </label>
                <input
                  type="text"
                  className="entrada-formulario"
                  placeholder="Ej: Interstellar, Breaking Bad..."
                  value={formulario.titulo}
                  onChange={(e) => setFormulario({ ...formulario, titulo: e.target.value })}
                />
                {errores.titulo && <span className="mensaje-error-campo">{errores.titulo}</span>}
              </div>

              {/* Serial */}
              <div className="campo-formulario">
                <label className="etiqueta-formulario">
                  Serial Único <span className="requerido">*</span>
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="entrada-formulario"
                    placeholder="Ej: PEL-001, SER-2024-01..."
                    value={formulario.serial}
                    onChange={(e) => setFormulario({ ...formulario, serial: e.target.value })}
                  />
                  <button
                    type="button"
                    className="boton-secundario"
                    onClick={() => setFormulario({ ...formulario, serial: generarSerialUnico('MED') })}
                    title="Generar sugerencia de serial único"
                    style={{ padding: '0 0.75rem' }}
                  >
                    <RefreshCw size={15} />
                  </button>
                </div>
                {errores.serial && <span className="mensaje-error-campo">{errores.serial}</span>}
              </div>

              {/* Año de Estreno */}
              <div className="campo-formulario">
                <label className="etiqueta-formulario">Año de Estreno</label>
                <input
                  type="number"
                  className="entrada-formulario"
                  min="1900"
                  max="2099"
                  value={formulario.anio_estreno}
                  onChange={(e) => setFormulario({ ...formulario, anio_estreno: e.target.value })}
                />
              </div>

              {/* Tipo (Película / Serie) */}
              <div className="campo-formulario">
                <label className="etiqueta-formulario">
                  Tipo <span className="requerido">*</span>
                </label>
                <select
                  className="selector-formulario"
                  value={formulario.tipo_id}
                  onChange={(e) => setFormulario({ ...formulario, tipo_id: e.target.value })}
                >
                  <option value="">Selecciona un tipo</option>
                  {listaTipos.map((tip) => (
                    <option key={tip.id} value={tip.id}>
                      {tip.nombre}
                    </option>
                  ))}
                </select>
                {errores.tipo_id && <span className="mensaje-error-campo">{errores.tipo_id}</span>}
              </div>

              {/* Género */}
              <div className="campo-formulario">
                <label className="etiqueta-formulario">
                  Género <span className="requerido">*</span>
                </label>
                <select
                  className="selector-formulario"
                  value={formulario.genero_id}
                  onChange={(e) => setFormulario({ ...formulario, genero_id: e.target.value })}
                >
                  <option value="">Selecciona un género</option>
                  {listaGeneros.map((gen) => (
                    <option key={gen.id} value={gen.id}>
                      {gen.nombre}
                    </option>
                  ))}
                </select>
                {errores.genero_id && <span className="mensaje-error-campo">{errores.genero_id}</span>}
              </div>

              {/* Director */}
              <div className="campo-formulario">
                <label className="etiqueta-formulario">
                  Director <span className="requerido">*</span>
                </label>
                <select
                  className="selector-formulario"
                  value={formulario.director_id}
                  onChange={(e) => setFormulario({ ...formulario, director_id: e.target.value })}
                >
                  <option value="">Selecciona un director</option>
                  {listaDirectores.map((dir) => (
                    <option key={dir.id} value={dir.id}>
                      {dir.nombre}
                    </option>
                  ))}
                </select>
                {errores.director_id && <span className="mensaje-error-campo">{errores.director_id}</span>}
              </div>

              {/* Productora */}
              <div className="campo-formulario">
                <label className="etiqueta-formulario">
                  Productora <span className="requerido">*</span>
                </label>
                <select
                  className="selector-formulario"
                  value={formulario.productora_id}
                  onChange={(e) => setFormulario({ ...formulario, productora_id: e.target.value })}
                >
                  <option value="">Selecciona una productora</option>
                  {listaProductoras.map((prod) => (
                    <option key={prod.id} value={prod.id}>
                      {prod.nombre}
                    </option>
                  ))}
                </select>
                {errores.productora_id && <span className="mensaje-error-campo">{errores.productora_id}</span>}
              </div>

              {/* URL de Video o Trailer */}
              <div className="campo-formulario campo-ancho-completo">
                <label className="etiqueta-formulario">URL de Video / Trailer (YouTube o Enlace directo)</label>
                <input
                  type="url"
                  className="entrada-formulario"
                  placeholder="Ej: https://www.youtube.com/watch?v=... o https://servidor.com/video.mp4"
                  value={formulario.url}
                  onChange={(e) => setFormulario({ ...formulario, url: e.target.value })}
                />
              </div>

              {/* URL de Imagen / Poster */}
              <div className="campo-formulario campo-ancho-completo">
                <label className="etiqueta-formulario">URL de Portada / Imagen</label>
                <input
                  type="url"
                  className="entrada-formulario"
                  placeholder="https://imagenes.com/poster.jpg"
                  value={formulario.imagen}
                  onChange={(e) => setFormulario({ ...formulario, imagen: e.target.value })}
                />
              </div>

              {/* Sinopsis */}
              <div className="campo-formulario campo-ancho-completo">
                <label className="etiqueta-formulario">Sinopsis / Descripción</label>
                <textarea
                  className="area-texto-formulario"
                  placeholder="Breve resumen de la trama o argumento..."
                  value={formulario.sinopsis}
                  onChange={(e) => setFormulario({ ...formulario, sinopsis: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Pie */}
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
              {guardando ? 'Guardando...' : (mediaAEditar ? 'Actualizar Producción' : 'Registrar Producción')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
