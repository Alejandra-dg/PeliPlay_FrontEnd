import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';

/**
 * Modal de confirmación para acciones destructivas como eliminación
 */
export const ModalConfirmacion = ({
  abierto,
  titulo = '¿Estás seguro?',
  mensaje = 'Esta acción no se puede deshacer.',
  textoBotonConfirmar = 'Eliminar',
  bloqueado = false,
  alertaBloqueo = null,
  alConfirmar,
  alCancelar
}) => {
  if (!abierto) return null;

  return (
    <div className="modal-superposicion animacion-desvanecer" onClick={alCancelar}>
      <div
        className="modal-caja confirmacion animacion-escala"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`icono-alerta-confirmacion ${bloqueado ? 'bloqueado' : ''}`}>
          {bloqueado ? <AlertCircle size={32} /> : <AlertTriangle size={32} />}
        </div>

        <h3 className="titulo-confirmacion">{titulo}</h3>
        
        {bloqueado && alertaBloqueo ? (
          <div className="alerta-bloqueo-eliminacion">
            {alertaBloqueo}
          </div>
        ) : (
          <p className="texto-confirmacion">{mensaje}</p>
        )}

        <div className="acciones-confirmacion">
          {bloqueado ? (
            <button
              type="button"
              className="boton-primario"
              onClick={alCancelar}
            >
              Entendido
            </button>
          ) : (
            <>
              <button
                type="button"
                className="boton-secundario"
                onClick={alCancelar}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="boton-peligro"
                onClick={alConfirmar}
              >
                {textoBotonConfirmar}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

