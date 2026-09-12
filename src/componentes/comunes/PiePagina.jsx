import React from 'react';
import { Play, Heart } from 'lucide-react';

/**
 * Pie de página moderno estilo Cuevana3
 */
export const PiePagina = ({ alCambiarVista }) => {
  return (
    <footer className="pie-pagina">
      <div className="contenedor-pie">
        <div className="logotipo-marca" onClick={() => alCambiarVista('inicio')}>
          <div className="icono-logo-contenedor">
            <Play size={18} fill="#ffffff" color="#ffffff" />
          </div>
          <span className="texto-logo">
            Peli<span>Play</span>
          </span>
        </div>

        <div className="pie-enlaces">
          <button
            type="button"
            className="pie-enlace"
            onClick={() => alCambiarVista('inicio')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Inicio
          </button>
          <button
            type="button"
            className="pie-enlace"
            onClick={() => alCambiarVista('peliculas')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Películas
          </button>
          <button
            type="button"
            className="pie-enlace"
            onClick={() => alCambiarVista('series')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Series
          </button>
          <button
            type="button"
            className="pie-enlace"
            onClick={() => alCambiarVista('administracion')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Panel Administrativo (CRUD)
          </button>
        </div>

        <p className="pie-copyright">
          PeliPlay © {new Date().getFullYear()} — Plataforma de Streaming Fullstack conectada a Node.js y PostgreSQL.
        </p>
      </div>
    </footer>
  );
};
