import React from 'react';
import { Play, Info, Star } from 'lucide-react';

/**
 * Banner principal / Hero Billboard estilo Cuevana3
 */
export const BannerPrincipal = ({
  produccionDestacada,
  alReproducir,
  alVerDetalles
}) => {
  if (!produccionDestacada) return null;

  const imagenFondo = produccionDestacada.imagen || 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200&auto=format&fit=crop';
  const nombreTipo = produccionDestacada.tipo?.nombre || 'Película';
  const nombreGenero = produccionDestacada.genero?.nombre || 'General';

  return (
    <section
      className="banner-principal animacion-desvanecer"
      style={{ backgroundImage: `url(${imagenFondo})` }}
    >
      <div className="banner-superposicion" />

      <div className="banner-contenido animacion-aparicion">
        {/* Etiquetas de Estado y Calidad */}
        <div className="banner-etiquetas">
          <span className="insignia-destacada">Destacado</span>
          <span className="insignia-calidad">ULTRA HD 4K</span>
          <span className="insignia-genero">{nombreGenero}</span>
          <span className="insignia-genero">{nombreTipo}</span>
          {produccionDestacada.anio_estreno && (
            <span className="insignia-calidad">{produccionDestacada.anio_estreno}</span>
          )}
        </div>

        {/* Título de la Producción */}
        <h1 className="banner-titulo">{produccionDestacada.titulo}</h1>

        {/* Sinopsis */}
        {produccionDestacada.sinopsis && (
          <p className="banner-sinopsis">{produccionDestacada.sinopsis}</p>
        )}

        {/* Botones de Acción */}
        <div className="banner-botones">
          <button
            type="button"
            className="boton-reproducir-hero"
            onClick={() => alReproducir(produccionDestacada)}
          >
            <Play size={20} fill="#ffffff" />
            Ver Ahora
          </button>

          <button
            type="button"
            className="boton-detalles-hero"
            onClick={() => alVerDetalles(produccionDestacada)}
          >
            <Info size={19} />
            Más Información
          </button>
        </div>
      </div>
    </section>
  );
};
