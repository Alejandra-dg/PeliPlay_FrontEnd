import React from 'react';
import { Film, PlusCircle } from 'lucide-react';
import { TarjetaMedia } from './TarjetaMedia';

/**
 * Cuadrícula responsiva de producciones multimedia
 */
export const CuadriculaMedia = ({
  tituloSeccion = 'Catálogo de Producciones',
  listaMedia = [],
  cargando = false,
  alSeleccionarMedia,
  alAbrirCrear
}) => {
  return (
    <section className="contenedor-cuadricula">
      {/* Cabecera de la sección */}
      <div className="seccion-catalogo-cabecera">
        <h2 className="titulo-seccion-catalogo">
          <span className="barra-destacada" />
          {tituloSeccion}
        </h2>
        <span className="contador-resultados">
          {listaMedia.length} {listaMedia.length === 1 ? 'título' : 'títulos'}
        </span>
      </div>

      {/* Estado de Carga (Skeletons) */}
      {cargando && (
        <div className="cuadricula-media">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="tarjeta-media animacion-esqueleto"
              style={{ minHeight: '340px', borderRadius: '16px' }}
            />
          ))}
        </div>
      )}

      {/* Cuadrícula con Tarjetas */}
      {!cargando && listaMedia.length > 0 && (
        <div className="cuadricula-media">
          {listaMedia.map((media) => (
            <TarjetaMedia
              key={media.id || media.serial}
              media={media}
              alSeleccionar={alSeleccionarMedia}
            />
          ))}
        </div>
      )}

      {/* Estado Vacío */}
      {!cargando && listaMedia.length === 0 && (
        <div className="estado-vacio animacion-aparicion">
          <Film className="icono-estado-vacio" />
          <h3 className="titulo-estado-vacio">No hay producciones registradas</h3>
          <p className="descripcion-estado-vacio">
            El catálogo está vacío. Comienza registrando tus propias películas o series en la plataforma.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            {alAbrirCrear && (
              <button
                type="button"
                className="boton-primario"
                onClick={alAbrirCrear}
              >
                <PlusCircle size={17} />
                Registrar Nueva Producción
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
