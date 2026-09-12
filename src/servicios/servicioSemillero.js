/**
 * Semillero de datos demostrativos para PeliPlay
 * Permite poblar la base de datos a través de los endpoints de la API
 * y provee datos de respaldo si la base de datos está vacía.
 */

import { servicioGeneros } from './servicioGeneros';
import { servicioDirectores } from './servicioDirectores';
import { servicioProductoras } from './servicioProductoras';
import { servicioTipos } from './servicioTipos';
import { servicioMedia } from './servicioMedia';

export const DATOS_DEMO_LOCALES = [
  {
    id: 101,
    serial: 'PEL-2014-INT01',
    titulo: 'Interstellar',
    sinopsis: 'Al ver que la vida en la Tierra se está extinguiendo, un grupo de exploradores emprende la misión más importante de la historia de la humanidad: viajar más allá de nuestra galaxia para descubrir un nuevo hogar.',
    url: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
    imagen: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=800&auto=format&fit=crop',
    anio_estreno: 2014,
    genero: { id: 1, nombre: 'Ciencia Ficción' },
    director: { id: 1, nombre: 'Christopher Nolan' },
    productora: { id: 1, nombre: 'Warner Bros. Pictures' },
    tipo: { id: 1, nombre: 'Película' }
  },
  {
    id: 102,
    serial: 'PEL-2010-INC02',
    titulo: 'Inception (El Origen)',
    sinopsis: 'Dom Cobb es un ladrón experto en el peligroso arte de la extracción: robar secretos valiosos de las profundidades del subconsciente durante el estado de sueño cuando la mente está vulnerable.',
    url: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
    imagen: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop',
    anio_estreno: 2010,
    genero: { id: 1, nombre: 'Ciencia Ficción' },
    director: { id: 1, nombre: 'Christopher Nolan' },
    productora: { id: 1, nombre: 'Warner Bros. Pictures' },
    tipo: { id: 1, nombre: 'Película' }
  },
  {
    id: 103,
    serial: 'SER-2008-BRK03',
    titulo: 'Breaking Bad',
    sinopsis: 'Un profesor de química diagnosticado con cáncer pulmonar incurable recurre a la fabricación y venta de metanfetamina para asegurar el futuro financiero de su familia con ayuda de un exalumno.',
    url: 'https://www.youtube.com/watch?v=HhesaQXLuRY',
    imagen: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    anio_estreno: 2008,
    genero: { id: 2, nombre: 'Drama' },
    director: { id: 2, nombre: 'Vince Gilligan' },
    productora: { id: 2, nombre: 'Sony Pictures Television' },
    tipo: { id: 2, nombre: 'Serie de TV' }
  },
  {
    id: 104,
    serial: 'PEL-2021-DNE04',
    titulo: 'Dune: Parte 1',
    sinopsis: 'Paul Atreides, un joven brillante y talentoso nacido con un gran destino, debe viajar al planeta más peligroso del universo para asegurar el futuro de su familia y de su gente.',
    url: 'https://www.youtube.com/watch?v=8g18jFHCLXk',
    imagen: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    anio_estreno: 2021,
    genero: { id: 1, nombre: 'Ciencia Ficción' },
    director: { id: 3, nombre: 'Denis Villeneuve' },
    productora: { id: 3, nombre: 'Legendary Pictures' },
    tipo: { id: 1, nombre: 'Película' }
  },
  {
    id: 105,
    serial: 'SER-2016-STR05',
    titulo: 'Stranger Things',
    sinopsis: 'Cuando un niño desaparece en extrañas circunstancias, sus amigos, la familia y la policía local se ven envueltos en un enigma extraordinario que involucra experimentos secretos y fuerzas sobrenaturales.',
    url: 'https://www.youtube.com/watch?v=b9EkMc79ZSU',
    imagen: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop',
    anio_estreno: 2016,
    genero: { id: 3, nombre: 'Misterio y Suspenso' },
    director: { id: 4, nombre: 'The Duffer Brothers' },
    productora: { id: 4, nombre: 'Netflix Studios' },
    tipo: { id: 2, nombre: 'Serie de TV' }
  },
  {
    id: 106,
    serial: 'PEL-2008-DKN06',
    titulo: 'The Dark Knight',
    sinopsis: 'Batman se enfrenta a su mayor desafío psicológico y físico cuando una mente criminal conocida como el Guasón desata el caos en Ciudad Gótica.',
    url: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
    imagen: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=800&auto=format&fit=crop',
    anio_estreno: 2008,
    genero: { id: 4, nombre: 'Acción' },
    director: { id: 1, nombre: 'Christopher Nolan' },
    productora: { id: 1, nombre: 'Warner Bros. Pictures' },
    tipo: { id: 1, nombre: 'Película' }
  }
];

/**
 * Ejecuta el sembrado automático de datos en la base de datos a través de la API
 */
export const ejecutarSemilleroEnBaseDatos = async () => {
  const resumen = {
    generosCreados: 0,
    directoresCreados: 0,
    productorasCreadas: 0,
    tiposCreados: 0,
    mediaCreada: 0
  };

  try {
    // 1. Crear Géneros
    const listaGeneros = [
      { nombre: 'Ciencia Ficción', descripcion: 'Películas y series de universos futuristas y tecnología', estado: 'Activo' },
      { nombre: 'Drama', descripcion: 'Narrativas profundas sobre conflictos humanos y sociales', estado: 'Activo' },
      { nombre: 'Acción', descripcion: 'Aventuras intensas, batallas y ritmo dinámico', estado: 'Activo' },
      { nombre: 'Misterio y Suspenso', descripcion: 'Intriga, giros inesperados e investigaciones policiales', estado: 'Activo' }
    ];

    const generosExistentes = await servicioGeneros.listar().catch(() => []);
    const mapaGeneros = {};

    for (const gen of listaGeneros) {
      const encontrado = generosExistentes.find(g => g.nombre.toLowerCase() === gen.nombre.toLowerCase());
      if (encontrado) {
        mapaGeneros[gen.nombre] = encontrado.id;
      } else {
        const nuevo = await servicioGeneros.crear(gen);
        if (nuevo) {
          mapaGeneros[gen.nombre] = nuevo.id;
          resumen.generosCreados++;
        }
      }
    }

    // 2. Crear Directores
    const listaDirectores = [
      { nombre: 'Christopher Nolan', estado: 'Activo' },
      { nombre: 'Denis Villeneuve', estado: 'Activo' },
      { nombre: 'Vince Gilligan', estado: 'Activo' },
      { nombre: 'The Duffer Brothers', estado: 'Activo' }
    ];

    const directoresExistentes = await servicioDirectores.listar().catch(() => []);
    const mapaDirectores = {};

    for (const dir of listaDirectores) {
      const encontrado = directoresExistentes.find(d => d.nombre.toLowerCase() === dir.nombre.toLowerCase());
      if (encontrado) {
        mapaDirectores[dir.nombre] = encontrado.id;
      } else {
        const nuevo = await servicioDirectores.crear(dir);
        if (nuevo) {
          mapaDirectores[dir.nombre] = nuevo.id;
          resumen.directoresCreados++;
        }
      }
    }

    // 3. Crear Productoras
    const listaProductoras = [
      { nombre: 'Warner Bros. Pictures', descripcion: 'Compañía productora y distribuidora de cine global', estado: 'Activo' },
      { nombre: 'Legendary Pictures', descripcion: 'Estudio de cine enfocado en grandes producciones y franquicias', estado: 'Activo' },
      { nombre: 'Sony Pictures Television', descripcion: 'Estudio de producción de series y contenido televisivo', estado: 'Activo' },
      { nombre: 'Netflix Studios', descripcion: 'División de producciones originales de Netflix', estado: 'Activo' }
    ];

    const productorasExistentes = await servicioProductoras.listar().catch(() => []);
    const mapaProductoras = {};

    for (const prod of listaProductoras) {
      const encontrada = productorasExistentes.find(p => p.nombre.toLowerCase() === prod.nombre.toLowerCase());
      if (encontrada) {
        mapaProductoras[prod.nombre] = encontrada.id;
      } else {
        const nueva = await servicioProductoras.crear(prod);
        if (nueva) {
          mapaProductoras[prod.nombre] = nueva.id;
          resumen.productorasCreadas++;
        }
      }
    }

    // 4. Crear Tipos
    const listaTipos = [
      { nombre: 'Película', descripcion: 'Producción cinematográfica de largometraje', estado: 'Activo' },
      { nombre: 'Serie de TV', descripcion: 'Producción episódica para televisión o streaming', estado: 'Activo' }
    ];

    const tiposExistentes = await servicioTipos.listar().catch(() => []);
    const mapaTipos = {};

    for (const tip of listaTipos) {
      const encontrado = tiposExistentes.find(t => t.nombre.toLowerCase() === tip.nombre.toLowerCase());
      if (encontrado) {
        mapaTipos[tip.nombre] = encontrado.id;
      } else {
        const nuevo = await servicioTipos.crear(tip);
        if (nuevo) {
          mapaTipos[tip.nombre] = nuevo.id;
          resumen.tiposCreados++;
        }
      }
    }

    // 5. Crear Producciones Media
    const mediaExistente = await servicioMedia.listar().catch(() => []);

    for (const item of DATOS_DEMO_LOCALES) {
      const yaExiste = mediaExistente.some(m => m.serial === item.serial || m.titulo.toLowerCase() === item.titulo.toLowerCase());
      if (!yaExiste) {
        const generoId = mapaGeneros[item.genero.nombre] || Object.values(mapaGeneros)[0];
        const directorId = mapaDirectores[item.director.nombre] || Object.values(mapaDirectores)[0];
        const productoraId = mapaProductoras[item.productora.nombre] || Object.values(mapaProductoras)[0];
        const tipoId = mapaTipos[item.tipo.nombre] || Object.values(mapaTipos)[0];

        if (generoId && directorId && productoraId && tipoId) {
          await servicioMedia.crear({
            serial: item.serial,
            titulo: item.titulo,
            sinopsis: item.sinopsis,
            url: item.url,
            imagen: item.imagen,
            anio_estreno: item.anio_estreno,
            genero_id: generoId,
            director_id: directorId,
            productora_id: productoraId,
            tipo_id: tipoId
          });
          resumen.mediaCreada++;
        }
      }
    }

    return { exito: true, resumen };
  } catch (error) {
    console.error('Error durante la ejecución del semillero:', error);
    throw error;
  }
};
