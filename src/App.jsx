import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BarraNavegacion } from './componentes/comunes/BarraNavegacion';
import { PiePagina } from './componentes/comunes/PiePagina';
import { BannerPrincipal } from './componentes/catalogo/BannerPrincipal';
import { BarraFiltros } from './componentes/catalogo/BarraFiltros';
import { CuadriculaMedia } from './componentes/catalogo/CuadriculaMedia';
import { ModalReproductor } from './componentes/catalogo/ModalReproductor';
import { PanelGestion } from './componentes/administracion/PanelGestion';
import { FormularioMediaModal } from './componentes/administracion/FormularioMediaModal';
import { ProveedorNotificacion, useNotificacion } from './contexto/ContextoNotificacion';

// Servicios de API
import { servicioMedia } from './servicios/servicioMedia';
import { servicioGeneros } from './servicios/servicioGeneros';
import { servicioDirectores } from './servicios/servicioDirectores';
import { servicioProductoras } from './servicios/servicioProductoras';
import { servicioTipos } from './servicios/servicioTipos';
import { verificarSaludBackend } from './servicios/clienteApi';

/**
 * Componente principal interno de la aplicación PeliPlay
 */
const AplicacionPrincipal = () => {
  const { notificarExito, notificarError, notificarInfo } = useNotificacion();

  // Estados de navegación y vistas
  const [vistaActual, setVistaActual] = useState('inicio'); // 'inicio' | 'peliculas' | 'series' | 'administracion'
  const [backendConectado, setBackendConectado] = useState(false);
  const [cargando, setCargando] = useState(true);

  // Datos principales de la API
  const [listaMedia, setListaMedia] = useState([]);
  const [listaGeneros, setListaGeneros] = useState([]);
  const [listaDirectores, setListaDirectores] = useState([]);
  const [listaProductoras, setListaProductoras] = useState([]);
  const [listaTipos, setListaTipos] = useState([]);

  // Filtros del catálogo
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos'); // 'todos' | 'pelicula' | 'serie'
  const [filtroGenero, setFiltroGenero] = useState('');
  const [filtroDirector, setFiltroDirector] = useState('');
  const [filtroAnio, setFiltroAnio] = useState('');

  // Modales
  const [mediaSeleccionada, setMediaSeleccionada] = useState(null); // Para reproducción / ficha técnica
  const [modalReproductorAbierto, setModalReproductorAbierto] = useState(false);
  const [modalNuevaMediaAbierto, setModalNuevaMediaAbierto] = useState(false);
  const [mediaAEditar, setMediaAEditar] = useState(null);

  /**
   * Carga todos los datos desde el backend
   */
  const cargarDatosDelServidor = useCallback(async () => {
    setCargando(true);
    try {
      const estaConectado = await verificarSaludBackend();
      setBackendConectado(estaConectado);

      if (estaConectado) {
        const [media, generos, directores, productoras, tipos] = await Promise.all([
          servicioMedia.listar().catch(() => []),
          servicioGeneros.listar().catch(() => []),
          servicioDirectores.listar().catch(() => []),
          servicioProductoras.listar().catch(() => []),
          servicioTipos.listar().catch(() => [])
        ]);

        setListaGeneros(generos || []);
        setListaDirectores(directores || []);
        setListaProductoras(productoras || []);
        setListaTipos(tipos || []);
        setListaMedia(media || []);
      } else {
        setListaMedia([]);
      }
    } catch (error) {
      console.warn('Backend desconectado o en inicialización:', error);
      setBackendConectado(false);
      setListaMedia([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosDelServidor();
  }, [cargarDatosDelServidor]);

  // Manejo de cambio de vista
  const cambiarVista = (nuevaVista) => {
    setVistaActual(nuevaVista);
    if (nuevaVista === 'peliculas') {
      setFiltroTipo('pelicula');
    } else if (nuevaVista === 'series') {
      setFiltroTipo('serie');
    } else if (nuevaVista === 'inicio') {
      setFiltroTipo('todos');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Restablecer filtros
  const limpiarFiltros = () => {
    setFiltroTipo('todos');
    setFiltroGenero('');
    setFiltroDirector('');
    setFiltroAnio('');
    setTerminoBusqueda('');
  };

  const hayFiltrosActivos = Boolean(
    filtroTipo !== 'todos' || filtroGenero || filtroDirector || filtroAnio || terminoBusqueda
  );

  // Años únicos presentes en el catálogo para el dropdown
  const aniosDisponibles = useMemo(() => {
    const anios = listaMedia
      .map((m) => m.anio_estreno)
      .filter((a) => typeof a === 'number' && !isNaN(a));
    return [...new Set(anios)].sort((a, b) => b - a);
  }, [listaMedia]);

  // Filtrado reactivo del catálogo
  const mediaFiltrada = useMemo(() => {
    return listaMedia.filter((item) => {
      // 1. Filtro por término de búsqueda (título, sinopsis o director)
      if (terminoBusqueda.trim()) {
        const busq = terminoBusqueda.toLowerCase();
        const coincideTitulo = item.titulo?.toLowerCase().includes(busq);
        const coincideSinopsis = item.sinopsis?.toLowerCase().includes(busq);
        const coincideDirector = item.director?.nombre?.toLowerCase().includes(busq);
        const coincideSerial = item.serial?.toLowerCase().includes(busq);
        if (!coincideTitulo && !coincideSinopsis && !coincideDirector && !coincideSerial) {
          return false;
        }
      }

      // 2. Filtro por Tipo (Película vs Serie)
      if (filtroTipo === 'pelicula') {
        const esPelicula =
          item.tipo?.nombre?.toLowerCase().includes('película') ||
          item.tipo?.nombre?.toLowerCase().includes('pelicula') ||
          item.serial?.startsWith('PEL');
        if (!esPelicula) return false;
      } else if (filtroTipo === 'serie') {
        const esSerie =
          item.tipo?.nombre?.toLowerCase().includes('serie') ||
          item.serial?.startsWith('SER');
        if (!esSerie) return false;
      }

      // 3. Filtro por Género
      if (filtroGenero && item.genero_id !== parseInt(filtroGenero, 10) && item.genero?.id !== parseInt(filtroGenero, 10)) {
        return false;
      }

      // 4. Filtro por Director
      if (filtroDirector && item.director_id !== parseInt(filtroDirector, 10) && item.director?.id !== parseInt(filtroDirector, 10)) {
        return false;
      }

      // 5. Filtro por Año
      if (filtroAnio && item.anio_estreno !== parseInt(filtroAnio, 10)) {
        return false;
      }

      return true;
    });
  }, [listaMedia, terminoBusqueda, filtroTipo, filtroGenero, filtroDirector, filtroAnio]);

  // Producción destacada para el Banner Principal (Hero)
  const produccionDestacada = useMemo(() => {
    if (listaMedia.length === 0) return null;
    return listaMedia[0];
  }, [listaMedia]);

  // Abrir reproductor
  const manejarAbrirReproductor = (media) => {
    setMediaSeleccionada(media);
    setModalReproductorAbierto(true);
  };

  // Guardar nueva o editar producción desde el modal
  const guardarProduccion = async (datos, id) => {
    try {
      if (id) {
        await servicioMedia.actualizar(id, datos);
        notificarExito('Producción actualizada correctamente en la base de datos');
      } else {
        await servicioMedia.crear(datos);
        notificarExito('Producción registrada con éxito');
      }
      setModalNuevaMediaAbierto(false);
      setMediaAEditar(null);
      await cargarDatosDelServidor();
    } catch (error) {
      notificarError(`Error al guardar: ${error.message}`);
    }
  };

  return (
    <div className="aplicacion-peliplay">
      {/* Barra de Navegación Superior */}
      <BarraNavegacion
        vistaActual={vistaActual}
        alCambiarVista={cambiarVista}
        terminoBusqueda={terminoBusqueda}
        alCambiarBusqueda={setTerminoBusqueda}
        alAbrirModalNuevaMedia={() => {
          setMediaAEditar(null);
          setModalNuevaMediaAbierto(true);
        }}
      />

      {/* Contenido Dinámico */}
      <main className="contenido-principal">
        {vistaActual === 'administracion' ? (
          /* Vista: Panel de Gestión y Control */
          <PanelGestion
            listaMedia={listaMedia}
            listaGeneros={listaGeneros}
            listaDirectores={listaDirectores}
            listaProductoras={listaProductoras}
            listaTipos={listaTipos}
            alRecargarDatos={cargarDatosDelServidor}
            cargando={cargando}
          />
        ) : (
          /* Vista: Catálogo (Inicio / Películas / Series) */
          <>
            {/* Banner Destacado Hero (visible en Inicio) */}
            {vistaActual === 'inicio' && !hayFiltrosActivos && (
              <BannerPrincipal
                produccionDestacada={produccionDestacada}
                alReproducir={manejarAbrirReproductor}
                alVerDetalles={manejarAbrirReproductor}
              />
            )}

            {/* Filtros Interactivos */}
            <BarraFiltros
              filtroTipo={filtroTipo}
              alCambiarTipo={setFiltroTipo}
              filtroGenero={filtroGenero}
              alCambiarGenero={setFiltroGenero}
              filtroDirector={filtroDirector}
              alCambiarDirector={setFiltroDirector}
              filtroAnio={filtroAnio}
              alCambiarAnio={setFiltroAnio}
              listaGeneros={listaGeneros}
              listaDirectores={listaDirectores}
              aniosDisponibles={aniosDisponibles}
              alLimpiarFiltros={limpiarFiltros}
              hayFiltrosActivos={hayFiltrosActivos}
            />

            {/* Cuadrícula de Contenido */}
            <CuadriculaMedia
              tituloSeccion={
                vistaActual === 'peliculas'
                  ? 'Todas las Películas en Cartelera'
                  : vistaActual === 'series'
                  ? 'Series de TV y Temporadas'
                  : hayFiltrosActivos
                  ? 'Resultados de Búsqueda'
                  : 'Películas y Series Populares'
              }
              listaMedia={mediaFiltrada}
              cargando={cargando}
              alSeleccionarMedia={manejarAbrirReproductor}
              alAbrirCrear={() => {
                setMediaAEditar(null);
                setModalNuevaMediaAbierto(true);
              }}
            />
          </>
        )}
      </main>

      {/* Modal de Reproducción y Ficha Técnica Estilo Cuevana */}
      <ModalReproductor
        media={mediaSeleccionada}
        abierto={modalReproductorAbierto}
        alCerrar={() => {
          setModalReproductorAbierto(false);
          setMediaSeleccionada(null);
        }}
        alEditar={(media) => {
          setMediaAEditar(media);
          setModalNuevaMediaAbierto(true);
        }}
      />

      {/* Modal de Creación / Edición de Media */}
      <FormularioMediaModal
        abierto={modalNuevaMediaAbierto}
        mediaAEditar={mediaAEditar}
        listaGeneros={listaGeneros}
        listaDirectores={listaDirectores}
        listaProductoras={listaProductoras}
        listaTipos={listaTipos}
        listaMedia={listaMedia}
        alGuardar={guardarProduccion}
        alCerrar={() => {
          setModalNuevaMediaAbierto(false);
          setMediaAEditar(null);
        }}
      />

      {/* Pie de Página */}
      <PiePagina alCambiarVista={cambiarVista} />
    </div>
  );
};

/**
 * Envoltorio con el Proveedor de Contexto de Notificaciones
 */
export default function App() {
  return (
    <ProveedorNotificacion>
      <AplicacionPrincipal />
    </ProveedorNotificacion>
  );
}
