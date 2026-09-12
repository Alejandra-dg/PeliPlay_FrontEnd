import React, { useState, useMemo } from 'react';
import {
  Film,
  Tags,
  Users,
  Building,
  Layers,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { TablaEntidad } from './TablaEntidad';
import { FormularioMediaModal } from './FormularioMediaModal';
import { FormularioEntidadModal } from './FormularioEntidadModal';
import { ModalConfirmacion } from '../comunes/ModalConfirmacion';
import { useNotificacion } from '../../contexto/ContextoNotificacion';

// Servicios
import { servicioMedia } from '../../servicios/servicioMedia';
import { servicioGeneros } from '../../servicios/servicioGeneros';
import { servicioDirectores } from '../../servicios/servicioDirectores';
import { servicioProductoras } from '../../servicios/servicioProductoras';
import { servicioTipos } from '../../servicios/servicioTipos';

/**
 * Panel de Administración Integral con soporte para todas las operaciones CRUD
 */
export const PanelGestion = ({
  listaMedia = [],
  listaGeneros = [],
  listaDirectores = [],
  listaProductoras = [],
  listaTipos = [],
  alRecargarDatos,
  cargando = false
}) => {
  const { notificarExito, notificarError, notificarInfo } = useNotificacion();

  // Estado de la pestaña activa
  const [pestanaActiva, setPestanaActiva] = useState('media');

  // Filtro de búsqueda para la tabla de Media
  const [busquedaMedia, setBusquedaMedia] = useState('');

  // Estados para Modales de Media
  const [modalMediaAbierto, setModalMediaAbierto] = useState(false);
  const [mediaAEditar, setMediaAEditar] = useState(null);

  // Estados para Modales de Entidades Maestras (Géneros, Directores, etc.)
  const [modalEntidadAbierto, setModalEntidadAbierto] = useState(false);
  const [tipoEntidadModal, setTipoEntidadModal] = useState('');
  const [entidadAEditar, setEntidadAEditar] = useState(null);

  // Estados para Modal de Confirmación de Eliminación
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] = useState(false);
  const [elementoAEliminar, setElementoAEliminar] = useState(null);
  const [tipoAEliminar, setTipoAEliminar] = useState(null);

  // Filtrado de Media
  const mediaFiltrada = useMemo(() => {
    if (!busquedaMedia.trim()) return listaMedia;
    const busq = busquedaMedia.toLowerCase();
    return listaMedia.filter(
      (m) =>
        m.titulo?.toLowerCase().includes(busq) ||
        m.serial?.toLowerCase().includes(busq) ||
        m.director?.nombre?.toLowerCase().includes(busq) ||
        m.genero?.nombre?.toLowerCase().includes(busq)
    );
  }, [listaMedia, busquedaMedia]);

  // Acciones de Media
  const abrirModalCrearMedia = () => {
    setMediaAEditar(null);
    setModalMediaAbierto(true);
  };

  const abrirModalEditarMedia = (media) => {
    setMediaAEditar(media);
    setModalMediaAbierto(true);
  };

  const guardarMedia = async (datos, id) => {
    try {
      if (id) {
        await servicioMedia.actualizar(id, datos);
        notificarExito('Producción multimedia actualizada correctamente');
      } else {
        await servicioMedia.crear(datos);
        notificarExito('Producción multimedia registrada correctamente');
      }
      setModalMediaAbierto(false);
      await alRecargarDatos();
    } catch (error) {
      notificarError(`Error al guardar producción: ${error.message}`);
    }
  };

  // Acciones de Entidades Maestras (Géneros, Directores, Productoras, Tipos)
  const abrirModalCrearEntidad = (tipo) => {
    setTipoEntidadModal(tipo);
    setEntidadAEditar(null);
    setModalEntidadAbierto(true);
  };

  const abrirModalEditarEntidad = (tipo, entidad) => {
    setTipoEntidadModal(tipo);
    setEntidadAEditar(entidad);
    setModalEntidadAbierto(true);
  };

  const guardarEntidadMaestra = async (datos, id) => {
    try {
      let servicio;
      let nombreEntidad = '';

      switch (tipoEntidadModal) {
        case 'generos':
          servicio = servicioGeneros;
          nombreEntidad = 'Género';
          break;
        case 'directores':
          servicio = servicioDirectores;
          nombreEntidad = 'Director';
          break;
        case 'productoras':
          servicio = servicioProductoras;
          nombreEntidad = 'Productora';
          break;
        case 'tipos':
          servicio = servicioTipos;
          nombreEntidad = 'Tipo';
          break;
        default:
          return;
      }

      if (id) {
        await servicio.actualizar(id, datos);
        notificarExito(`${nombreEntidad} actualizado correctamente`);
      } else {
        await servicio.crear(datos);
        notificarExito(`${nombreEntidad} creado correctamente`);
      }

      setModalEntidadAbierto(false);
      await alRecargarDatos();
    } catch (error) {
      notificarError(`Error al guardar: ${error.message}`);
    }
  };

  // Producciones multimedia asociadas al elemento seleccionado para eliminar
  const produccionesAsociadas = useMemo(() => {
    if (!elementoAEliminar || !tipoAEliminar || tipoAEliminar === 'media') return [];
    return listaMedia.filter((m) => {
      if (tipoAEliminar === 'generos') return m.genero_id === elementoAEliminar.id || m.genero?.id === elementoAEliminar.id;
      if (tipoAEliminar === 'directores') return m.director_id === elementoAEliminar.id || m.director?.id === elementoAEliminar.id;
      if (tipoAEliminar === 'productoras') return m.productora_id === elementoAEliminar.id || m.productora?.id === elementoAEliminar.id;
      if (tipoAEliminar === 'tipos') return m.tipo_id === elementoAEliminar.id || m.tipo?.id === elementoAEliminar.id;
      return false;
    });
  }, [elementoAEliminar, tipoAEliminar, listaMedia]);

  // Confirmación y Eliminación
  const solicitarEliminar = (tipo, elemento) => {
    setTipoAEliminar(tipo);
    setElementoAEliminar(elemento);
    setModalConfirmacionAbierto(true);
  };

  const confirmarEliminar = async () => {
    if (!elementoAEliminar || !tipoAEliminar) return;

    try {
      switch (tipoAEliminar) {
        case 'media':
          await servicioMedia.eliminar(elementoAEliminar.id);
          notificarExito('Producción eliminada correctamente');
          break;
        case 'generos':
          await servicioGeneros.eliminar(elementoAEliminar.id);
          notificarExito('Género eliminado correctamente');
          break;
        case 'directores':
          await servicioDirectores.eliminar(elementoAEliminar.id);
          notificarExito('Director eliminado correctamente');
          break;
        case 'productoras':
          await servicioProductoras.eliminar(elementoAEliminar.id);
          notificarExito('Productora eliminada correctamente');
          break;
        case 'tipos':
          await servicioTipos.eliminar(elementoAEliminar.id);
          notificarExito('Tipo eliminado correctamente');
          break;
        default:
          break;
      }
      setModalConfirmacionAbierto(false);
      await alRecargarDatos();
    } catch (error) {
      setModalConfirmacionAbierto(false);
      notificarError(`Error al eliminar: ${error.message}`);
    }
  };

  return (
    <section className="panel-administracion animacion-desvanecer">
      {/* Cabecera del Panel */}
      <div className="panel-cabecera">
        <div className="panel-titulo-seccion">
          <h1 className="panel-titulo">
            <Film size={28} color="var(--color-primario)" />
            Panel de Gestión PeliPlay
          </h1>
          <p className="panel-subtitulo">
            Administración completa de películas, series, géneros, directores y productoras conectados a la API.
          </p>
        </div>
      </div>

      {/* Pestañas de Navegación del Panel */}
      <div className="pestanas-administracion">
        <button
          type="button"
          className={`pestana-item ${pestanaActiva === 'media' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('media')}
        >
          <Film size={17} />
          Películas y Series
          <span className="contador-pestana">{listaMedia.length}</span>
        </button>

        <button
          type="button"
          className={`pestana-item ${pestanaActiva === 'generos' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('generos')}
        >
          <Tags size={17} />
          Géneros
          <span className="contador-pestana">{listaGeneros.length}</span>
        </button>

        <button
          type="button"
          className={`pestana-item ${pestanaActiva === 'directores' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('directores')}
        >
          <Users size={17} />
          Directores
          <span className="contador-pestana">{listaDirectores.length}</span>
        </button>

        <button
          type="button"
          className={`pestana-item ${pestanaActiva === 'productoras' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('productoras')}
        >
          <Building size={17} />
          Productoras
          <span className="contador-pestana">{listaProductoras.length}</span>
        </button>

        <button
          type="button"
          className={`pestana-item ${pestanaActiva === 'tipos' ? 'activa' : ''}`}
          onClick={() => setPestanaActiva('tipos')}
        >
          <Layers size={17} />
          Tipos
          <span className="contador-pestana">{listaTipos.length}</span>
        </button>
      </div>

      {/* Contenido de la Pestaña Activa */}
      {pestanaActiva === 'media' && (
        <div className="animacion-desvanecer">
          {/* Herramientas de Media */}
          <div className="barra-herramientas-tabla">
            <div className="buscador-tabla">
              <Search size={16} />
              <input
                type="text"
                placeholder="Buscar por título, serial, director..."
                value={busquedaMedia}
                onChange={(e) => setBusquedaMedia(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="boton-primario"
              onClick={abrirModalCrearMedia}
            >
              <Plus size={16} />
              <span>Nueva Producción</span>
            </button>
          </div>

          {/* Tabla de Media */}
          <div className="contenedor-tabla-responsiva">
            <table className="tabla-datos">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Portada</th>
                  <th>Producción</th>
                  <th>Tipo</th>
                  <th>Género</th>
                  <th>Director</th>
                  <th>Productora</th>
                  <th style={{ width: '80px' }}>Año</th>
                  <th style={{ width: '120px', textAlign: 'center' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cargando ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                      Cargando producciones...
                    </td>
                  </tr>
                ) : mediaFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-texto-atenuado)' }}>
                      No se encontraron registros de películas o series.
                    </td>
                  </tr>
                ) : (
                  mediaFiltrada.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.imagen || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=200'}
                          alt={item.titulo}
                          className="miniatura-media-tabla"
                        />
                      </td>
                      <td>
                        <div className="titulo-media-tabla">{item.titulo}</div>
                        <div className="serial-media-tabla">{item.serial}</div>
                      </td>
                      <td>
                        <span className={`badge-tipo ${item.tipo?.nombre?.toLowerCase().includes('serie') ? 'serie' : 'pelicula'}`}>
                          {item.tipo?.nombre || 'Película'}
                        </span>
                      </td>
                      <td>{item.genero?.nombre || 'Sin género'}</td>
                      <td>{item.director?.nombre || 'Sin director'}</td>
                      <td>{item.productora?.nombre || 'Sin productora'}</td>
                      <td style={{ fontWeight: 600 }}>{item.anio_estreno || '—'}</td>
                      <td>
                        <div className="acciones-fila" style={{ justifyContent: 'center' }}>
                          <button
                            type="button"
                            className="boton-accion-fila editar"
                            onClick={() => abrirModalEditarMedia(item)}
                            title={`Editar ${item.titulo}`}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="boton-accion-fila eliminar"
                            onClick={() => solicitarEliminar('media', item)}
                            title={`Eliminar ${item.titulo}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pie-tabla-resumen">
              <span>
                Mostrando {mediaFiltrada.length} de {listaMedia.length} producciones registradas
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Pestaña: Géneros */}
      {pestanaActiva === 'generos' && (
        <TablaEntidad
          titulo="Género"
          listaDatos={listaGeneros}
          cargando={cargando}
          tieneDescripcion={true}
          alCrear={() => abrirModalCrearEntidad('generos')}
          alEditar={(item) => abrirModalEditarEntidad('generos', item)}
          alSolicitarEliminar={(item) => solicitarEliminar('generos', item)}
        />
      )}

      {/* Pestaña: Directores */}
      {pestanaActiva === 'directores' && (
        <TablaEntidad
          titulo="Director"
          listaDatos={listaDirectores}
          cargando={cargando}
          tieneDescripcion={false}
          alCrear={() => abrirModalCrearEntidad('directores')}
          alEditar={(item) => abrirModalEditarEntidad('directores', item)}
          alSolicitarEliminar={(item) => solicitarEliminar('directores', item)}
        />
      )}

      {/* Pestaña: Productoras */}
      {pestanaActiva === 'productoras' && (
        <TablaEntidad
          titulo="Productora"
          listaDatos={listaProductoras}
          cargando={cargando}
          tieneDescripcion={true}
          alCrear={() => abrirModalCrearEntidad('productoras')}
          alEditar={(item) => abrirModalEditarEntidad('productoras', item)}
          alSolicitarEliminar={(item) => solicitarEliminar('productoras', item)}
        />
      )}

      {/* Pestaña: Tipos */}
      {pestanaActiva === 'tipos' && (
        <TablaEntidad
          titulo="Tipo"
          listaDatos={listaTipos}
          cargando={cargando}
          tieneDescripcion={true}
          alCrear={() => abrirModalCrearEntidad('tipos')}
          alEditar={(item) => abrirModalEditarEntidad('tipos', item)}
          alSolicitarEliminar={(item) => solicitarEliminar('tipos', item)}
        />
      )}

      {/* Modal de Formulario para Media */}
      <FormularioMediaModal
        abierto={modalMediaAbierto}
        mediaAEditar={mediaAEditar}
        listaGeneros={listaGeneros}
        listaDirectores={listaDirectores}
        listaProductoras={listaProductoras}
        listaTipos={listaTipos}
        listaMedia={listaMedia}
        alGuardar={guardarMedia}
        alCerrar={() => setModalMediaAbierto(false)}
      />

      {/* Modal de Formulario para Entidades Maestras */}
      <FormularioEntidadModal
        abierto={modalEntidadAbierto}
        tituloEntidad={
          tipoEntidadModal === 'generos'
            ? 'Género'
            : tipoEntidadModal === 'directores'
            ? 'Director'
            : tipoEntidadModal === 'productoras'
            ? 'Productora'
            : 'Tipo'
        }
        entidadAEditar={entidadAEditar}
        incluyeDescripcion={tipoEntidadModal !== 'directores'}
        alGuardar={guardarEntidadMaestra}
        alCerrar={() => setModalEntidadAbierto(false)}
      />

      {/* Modal de Confirmación de Eliminación */}
      <ModalConfirmacion
        abierto={modalConfirmacionAbierto}
        titulo={
          produccionesAsociadas.length > 0
            ? `No se puede eliminar "${elementoAEliminar?.titulo || elementoAEliminar?.nombre || 'registro'}"`
            : `¿Eliminar ${elementoAEliminar?.titulo || elementoAEliminar?.nombre || 'registro'}?`
        }
        mensaje="Esta operación eliminará permanentemente el registro de la base de datos de PeliPlay."
        bloqueado={produccionesAsociadas.length > 0}
        alertaBloqueo={
          produccionesAsociadas.length > 0 && (
            <div>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 600 }}>
                Este registro está asociado a {produccionesAsociadas.length} producción(es):
              </p>
              <ul style={{ margin: '0 0 0.75rem 1.25rem', padding: 0 }}>
                {produccionesAsociadas.slice(0, 3).map((p) => (
                  <li key={p.id || p.serial}>
                    <strong>{p.titulo}</strong> {p.serial ? `(${p.serial})` : ''}
                  </li>
                ))}
                {produccionesAsociadas.length > 3 && (
                  <li>... y {produccionesAsociadas.length - 3} más</li>
                )}
              </ul>
              <p style={{ margin: 0, fontSize: '0.82rem', opacity: 0.9 }}>
                Por integridad referencial, primero debes editar esas producciones para asignarles otro valor o eliminarlas desde la pestaña <strong>Películas y Series</strong>.
              </p>
            </div>
          )
        }
        alConfirmar={confirmarEliminar}
        alCancelar={() => setModalConfirmacionAbierto(false)}
      />
    </section>
  );
};
