import React, { useState } from 'react';
import { Play, Film } from 'lucide-react';

/**
 * Tarjeta individual de producción estilo Cuevana3
 */
export const TarjetaMedia = ({
  media,
  alSeleccionar
}) => {
  const [errorImagen, setErrorImagen] = useState(false);

  const esSerie = media.tipo?.nombre?.toLowerCase().includes('serie');
  const imagenPortada = (!errorImagen && media.imagen) 
    ? media.imagen 
    : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop';

  return (
    <article
      className="tarjeta-media animacion-aparicion"
      onClick={() => alSeleccionar(media)}
      title={`Ver ${media.titulo}`}
    >
      {/* Contenedor de Poster con Hover */}
      <div className="tarjeta-poster-contenedor">
        <img
          src={imagenPortada}
          alt={`Póster de ${media.titulo}`}
          className="tarjeta-poster-imagen"
          loading="lazy"
          onError={() => setErrorImagen(true)}
        />

        {/* Insignias Superiores */}
        <div className="tarjeta-insignias-superiores">
          <span className={`badge-tipo ${esSerie ? 'serie' : 'pelicula'}`}>
            {media.tipo?.nombre || (esSerie ? 'Serie' : 'Película')}
          </span>
          {media.anio_estreno && (
            <span className="badge-anio">{media.anio_estreno}</span>
          )}
        </div>

        {/* Superposición con Botón Play al Pasar el Cursor */}
        <div className="tarjeta-hover-overlay">
          <button
            type="button"
            className="boton-play-flotante"
            aria-label={`Reproducir ${media.titulo}`}
          >
            <Play size={24} fill="#ffffff" />
          </button>
        </div>
      </div>

      {/* Información Inferior */}
      <div className="tarjeta-informacion">
        <h3 className="tarjeta-titulo">{media.titulo}</h3>
        <div className="tarjeta-detalles">
          <span className="tarjeta-genero">
            {media.genero?.nombre || 'General'}
          </span>
          <span>{media.director?.nombre || ''}</span>
        </div>
      </div>
    </article>
  );
};
