import React from 'react';
import { RotateCcw, Filter } from 'lucide-react';

/**
 * Barra de filtros interactiva para catálogo de producciones
 */
export const BarraFiltros = ({
  filtroTipo,
  alCambiarTipo,
  filtroGenero,
  alCambiarGenero,
  filtroDirector,
  alCambiarDirector,
  filtroAnio,
  alCambiarAnio,
  listaGeneros,
  listaDirectores,
  aniosDisponibles,
  alLimpiarFiltros,
  hayFiltrosActivos
}) => {
  return (
    <div className="contenedor-filtros">
      <div className="barra-filtros-principal">
        {/* Pestañas de Tipo Rápido */}
        <div className="pestanas-tipo">
          <button
            type="button"
            className={`boton-pestana ${filtroTipo === 'todos' ? 'activa' : ''}`}
            onClick={() => alCambiarTipo('todos')}
          >
            Todas
          </button>
          <button
            type="button"
            className={`boton-pestana ${filtroTipo === 'pelicula' ? 'activa' : ''}`}
            onClick={() => alCambiarTipo('pelicula')}
          >
            Películas
          </button>
          <button
            type="button"
            className={`boton-pestana ${filtroTipo === 'serie' ? 'activa' : ''}`}
            onClick={() => alCambiarTipo('serie')}
          >
            Series
          </button>
        </div>

        {/* Selectores Avanzados de Filtro */}
        <div className="grupo-selectores">
          {/* Selector de Género */}
          <select
            className="selector-filtro"
            value={filtroGenero}
            onChange={(e) => alCambiarGenero(e.target.value)}
          >
            <option value="">Todos los géneros</option>
            {listaGeneros.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.nombre}
              </option>
            ))}
          </select>

          {/* Selector de Director */}
          <select
            className="selector-filtro"
            value={filtroDirector}
            onChange={(e) => alCambiarDirector(e.target.value)}
          >
            <option value="">Todos los directores</option>
            {listaDirectores.map((dir) => (
              <option key={dir.id} value={dir.id}>
                {dir.nombre}
              </option>
            ))}
          </select>

          {/* Selector de Año */}
          <select
            className="selector-filtro"
            value={filtroAnio}
            onChange={(e) => alCambiarAnio(e.target.value)}
          >
            <option value="">Todos los años</option>
            {aniosDisponibles.map((anio) => (
              <option key={anio} value={anio}>
                {anio}
              </option>
            ))}
          </select>

          {/* Botón para restablecer filtros */}
          {hayFiltrosActivos && (
            <button
              type="button"
              className="boton-limpiar-filtros"
              onClick={alLimpiarFiltros}
              title="Restablecer filtros"
            >
              <RotateCcw size={14} />
              Limpiar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
