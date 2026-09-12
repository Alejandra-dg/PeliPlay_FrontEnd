import React, { useState, useEffect } from 'react';
import { Play, Film, Tv, Settings, Search, X, PlusCircle, Home } from 'lucide-react';

/**
 * Barra de navegación superior estilo Cuevana3
 */
export const BarraNavegacion = ({
  vistaActual,
  alCambiarVista,
  terminoBusqueda,
  alCambiarBusqueda,
  alAbrirModalNuevaMedia
}) => {
  const [conDesplazamiento, setConDesplazamiento] = useState(false);

  useEffect(() => {
    const manejarDesplazamiento = () => {
      setConDesplazamiento(window.scrollY > 20);
    };

    window.addEventListener('scroll', manejarDesplazamiento);
    return () => window.removeEventListener('scroll', manejarDesplazamiento);
  }, []);

  return (
    <header className={`barra-navegacion ${conDesplazamiento ? 'con-desplazamiento' : ''}`}>
      <div className="contenedor-navegacion">
        {/* Logotipo PeliPlay */}
        <div
          className="logotipo-marca"
          onClick={() => alCambiarVista('inicio')}
          title="PeliPlay - Inicio"
        >
          <div className="icono-logo-contenedor">
            <Play size={20} fill="#ffffff" color="#ffffff" />
          </div>
          <span className="texto-logo">
            Peli<span>Play</span>
          </span>
        </div>

        {/* Enlaces de Navegación Principal */}
        <nav>
          <ul className="enlaces-navegacion">
            <li>
              <button
                type="button"
                className={`boton-enlace ${vistaActual === 'inicio' ? 'activo' : ''}`}
                onClick={() => alCambiarVista('inicio')}
              >
                <Home size={16} />
                Inicio
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`boton-enlace ${vistaActual === 'peliculas' ? 'activo' : ''}`}
                onClick={() => alCambiarVista('peliculas')}
              >
                <Film size={16} />
                Películas
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`boton-enlace ${vistaActual === 'series' ? 'activo' : ''}`}
                onClick={() => alCambiarVista('series')}
              >
                <Tv size={16} />
                Series
              </button>
            </li>
            <li>
              <button
                type="button"
                className={`boton-enlace ${vistaActual === 'administracion' ? 'activo' : ''}`}
                onClick={() => alCambiarVista('administracion')}
              >
                <Settings size={16} />
                Panel de Gestión
              </button>
            </li>
          </ul>
        </nav>

        {/* Buscador Rápido */}
        <div className="contenedor-buscador">
          <Search size={17} className="icono-busqueda" />
          <input
            type="text"
            className="entrada-busqueda"
            placeholder="Buscar por título o director..."
            value={terminoBusqueda}
            onChange={(e) => alCambiarBusqueda(e.target.value)}
          />
          {terminoBusqueda && (
            <button
              type="button"
              className="boton-limpiar-busqueda"
              onClick={() => alCambiarBusqueda('')}
              title="Limpiar búsqueda"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Acciones Derecha */}
        <div className="acciones-navegacion">
          {/* Botón "+ Nueva Película / Serie" */}
          <button
            type="button"
            className="boton-accion-destacada"
            onClick={alAbrirModalNuevaMedia}
            title="Registrar nueva producción"
          >
            <PlusCircle size={17} />
            <span>Nueva Producción</span>
          </button>
        </div>
      </div>
    </header>
  );
};
