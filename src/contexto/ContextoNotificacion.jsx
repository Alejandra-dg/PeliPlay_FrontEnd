import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

const ContextoNotificacion = createContext(null);

export const ProveedorNotificacion = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);

  const eliminarNotificacion = useCallback((id) => {
    setNotificaciones((previas) => previas.filter((n) => n.id !== id));
  }, []);

  const agregarNotificacion = useCallback((tipo, mensaje, duracion = 4000) => {
    const id = Date.now() + Math.random();
    const nuevaNotificacion = { id, tipo, mensaje };

    setNotificaciones((previas) => [...previas, nuevaNotificacion]);

    if (duracion > 0) {
      setTimeout(() => {
        eliminarNotificacion(id);
      }, duracion);
    }
  }, [eliminarNotificacion]);

  const notificarExito = useCallback((mensaje) => {
    agregarNotificacion('exito', mensaje);
  }, [agregarNotificacion]);

  const notificarError = useCallback((mensaje) => {
    agregarNotificacion('error', mensaje);
  }, [agregarNotificacion]);

  const notificarInfo = useCallback((mensaje) => {
    agregarNotificacion('info', mensaje);
  }, [agregarNotificacion]);

  return (
    <ContextoNotificacion.Provider
      value={{
        notificarExito,
        notificarError,
        notificarInfo
      }}
    >
      {children}
      {/* Contenedor Flotante de Toasts */}
      <div className="contenedor-toasts">
        {notificaciones.map((notif) => (
          <div
            key={notif.id}
            className={`toast-item ${notif.tipo} animacion-aparicion`}
          >
            <div className="toast-icono">
              {notif.tipo === 'exito' && <CheckCircle2 size={20} />}
              {notif.tipo === 'error' && <AlertTriangle size={20} />}
              {notif.tipo === 'info' && <Info size={20} />}
            </div>
            <div className="toast-texto">{notif.mensaje}</div>
            <button
              className="toast-cerrar"
              onClick={() => eliminarNotificacion(notif.id)}
              aria-label="Cerrar notificación"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ContextoNotificacion.Provider>
  );
};

export const useNotificacion = () => {
  const contexto = useContext(ContextoNotificacion);
  if (!contexto) {
    throw new Error('useNotificacion debe usarse dentro de un ProveedorNotificacion');
  }
  return contexto;
};
