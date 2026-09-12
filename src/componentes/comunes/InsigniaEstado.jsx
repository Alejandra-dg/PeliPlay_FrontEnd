import React from 'react';

/**
 * Componente para mostrar el estado Activo/Inactivo con estilo visual
 * @param {{ estado: string }} props
 */
export const InsigniaEstado = ({ estado = 'Activo' }) => {
  const esActivo = estado?.toLowerCase() === 'activo';

  return (
    <span className={`insignia-estado-badge ${esActivo ? 'activo' : 'inactivo'}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: esActivo ? '#10b981' : '#94a3b8',
          boxShadow: esActivo ? '0 0 6px #10b981' : 'none'
        }}
      />
      {estado || 'Inactivo'}
    </span>
  );
};
