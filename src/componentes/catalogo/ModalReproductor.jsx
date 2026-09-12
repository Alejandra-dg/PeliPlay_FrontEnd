import React, { useState } from 'react';
import { X, Play, ExternalLink, Film, Edit3, Calendar, Clapperboard, Building2 } from 'lucide-react';
import { procesarUrlVideo, formatearFecha } from '../../utilidades/formateadores';

/**
 * Modal de reproducción y ficha técnica estilo Cuevana3
 */
export const ModalReproductor = ({
  media,
  abierto,
  alCerrar,
  alEditar
}) => {
  const [servidorActivo, setServidorActivo] = useState(1);

  if (!abierto || !media) return null;

  const infoVideo = procesarUrlVideo(media.url);
  const nombreTipo = media.tipo?.nombre || 'Película';
  const nombreGenero = media.genero?.nombre || 'General';
  const nombreDirector = media.director?.nombre || 'No especificado';
  const nombreProductora = media.productora?.nombre || 'No especificada';

  return (
    <div className="modal-reproductor-fondo animacion-desvanecer" onClick={alCerrar}>
      <div
        className="modal-reproductor-contenedor animacion-escala"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón Flotante para Cerrar */}
        <button
          type="button"
          className="boton-cerrar-reproductor"
          onClick={alCerrar}
          title="Cerrar reproductor"
        >
          <X size={20} />
        </button>

        {/* Marco de Video 16:9 Estilo Cuevana */}
        <div className="reproductor-video-marco">
          {infoVideo.esYoutube && (
            <iframe
              src={infoVideo.urlEmbebida}
              title={`Reproductor para ${media.titulo}`}
              className="reproductor-iframe"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}

          {infoVideo.esVideoDirecto && (
            <video
              src={media.url}
              controls
              autoPlay
              className="reproductor-video-nativo"
            >
              Tu navegador no soporta la reproducción de video HTML5.
            </video>
          )}

          {!infoVideo.esYoutube && !infoVideo.esVideoDirecto && (
            <div
              className="reproductor-simulado"
              style={{ backgroundImage: `url(${media.imagen || ''})` }}
            >
              <div className="reproductor-simulado-overlay">
                <a
                  href={media.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="boton-reproduccion-grande"
                  title="Abrir enlace de transmisión"
                >
                  <Play size={36} fill="#ffffff" />
                </a>
                <p className="aviso-reproductor-enlace">
                  Transmisión disponible en servidor externo:{' '}
                  {media.url ? (
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enlace-servidor-externo"
                    >
                      {media.url} <ExternalLink size={14} />
                    </a>
                  ) : (
                    <span>No hay enlace URL configurado aún</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Barra de Servidores de Streaming Estilo Cuevana3 */}
        <div className="barra-servidores">
          <span className="etiqueta-servidores">Servidores de Transmisión:</span>
          <button
            type="button"
            className={`boton-servidor ${servidorActivo === 1 ? 'activo' : ''}`}
            onClick={() => setServidorActivo(1)}
          >
            Servidor Principal (HD)
          </button>
          <button
            type="button"
            className={`boton-servidor ${servidorActivo === 2 ? 'activo' : ''}`}
            onClick={() => setServidorActivo(2)}
          >
            Servidor Latino 1080p
          </button>
          <button
            type="button"
            className={`boton-servidor ${servidorActivo === 3 ? 'activo' : ''}`}
            onClick={() => setServidorActivo(3)}
          >
            Subtitulado VOSE
          </button>
        </div>

        {/* Ficha Técnica Detallada */}
        <div className="ficha-tecnica-contenedor">
          {media.imagen && (
            <img
              src={media.imagen}
              alt={`Portada de ${media.titulo}`}
              className="ficha-poster-pequeno"
            />
          )}

          <div className="ficha-informacion-cuerpo">
            <h2 className="ficha-titulo">{media.titulo}</h2>

            <div className="ficha-metadatos-fila">
              <span className="insignia-calidad">FULL HD</span>
              <span className="insignia-genero">{nombreGenero}</span>
              <span className="insignia-genero">{nombreTipo}</span>
              {media.anio_estreno && (
                <span className="insignia-calidad">{media.anio_estreno}</span>
              )}
              {media.serial && (
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>
                  Serial: {media.serial}
                </span>
              )}
            </div>

            {media.sinopsis && (
              <p className="ficha-sinopsis">{media.sinopsis}</p>
            )}

            {/* Grilla de Atributos Técnicos */}
            <div className="grilla-atributos-tecnicos">
              <div className="item-atributo">
                <span className="etiqueta-atributo">Director:</span>
                <span className="valor-atributo">{nombreDirector}</span>
              </div>

              <div className="item-atributo">
                <span className="etiqueta-atributo">Productora:</span>
                <span className="valor-atributo">{nombreProductora}</span>
              </div>

              <div className="item-atributo">
                <span className="etiqueta-atributo">Fecha de Registro:</span>
                <span className="valor-atributo">
                  {formatearFecha(media.fecha_creacion || media.createdAt)}
                </span>
              </div>

              <div className="item-atributo">
                <span className="etiqueta-atributo">Última Modificación:</span>
                <span className="valor-atributo">
                  {formatearFecha(media.fecha_actualizacion || media.updatedAt)}
                </span>
              </div>
            </div>

            {/* Acciones de Edición */}
            <div className="ficha-acciones-inferiores">
              {alEditar && (
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => {
                    alCerrar();
                    alEditar(media);
                  }}
                >
                  <Edit3 size={16} />
                  Editar Datos
                </button>
              )}
              <button
                type="button"
                className="boton-primario"
                onClick={alCerrar}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
