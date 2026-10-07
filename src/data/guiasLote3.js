// Tercer lote de guías. Mismas reglas que guias.js: solo datos comprobados en la fuente oficial
// (ver `enlaces`).
import { REVISADO_HOY } from './revision.js';

const rev = REVISADO_HOY;

export const GUIAS_LOTE3 = [
  {
    slug: 'espana',
    origen: 'argentina',
    pais: 'España',
    flag: '🇪🇸',
    destino: null,
    visa: 'Visado del Programa de Movilidad de Jóvenes',
    titulo: 'Working Holiday en España para argentinos',
    resumen: 'España y Argentina tienen un acuerdo de movilidad de jóvenes en vigor desde febrero de 2023: hasta 12 meses en España, con 500 visas al año, para personas de 18 a 35 años con estudios superiores o dos años de universidad.',
    revisado: rev,
    datos: [
      ['Visa', 'Visado del Programa de Movilidad de Jóvenes'],
      ['Edad', '18 a 35 años, ambos inclusive'],
      ['Duración', 'Visado con validez de 12 meses'],
      ['Cupo', 'Máximo de 500 visados por año; se reparte entre los consulados de España en Bahía Blanca, Buenos Aires, Córdoba, Mendoza y Rosario'],
      ['Estudios', 'Título universitario, al menos 2 años de estudios universitarios o un título equivalente de educación superior'],
      ['Residencia', 'Nacionalidad argentina y residencia habitual en la circunscripción del consulado donde se presenta'],
      ['Fondos', 'Al menos EUR 1.080 por cada mes de estancia prevista, según el Consulado de España en Córdoba'],
      ['Seguro', 'Seguro de enfermedad y accidentes completo, con hospitalización y repatriación, y cobertura mínima de EUR 30.000'],
      ['Trabajo', 'Hasta 6 meses en total durante la estancia'],
      ['Pasaje', 'Billete de vuelta o recursos para comprarlo'],
    ],
    pasos: [
      'Confirma que cumples los requisitos del acuerdo: edad, estudios, residencia en Argentina, no tener antecedentes penales y no haber participado antes en el Programa.',
      'Averigua cuál es el consulado de España que te corresponde según tu domicilio (Bahía Blanca, Buenos Aires, Córdoba, Mendoza o Rosario) y revisa en su sitio cómo se presenta la solicitud.',
      'Reúne los documentos: pasaporte ordinario vigente, DNI con tu domicilio, certificado de antecedentes penales, prueba de estudios, comprobante de fondos y seguro médico.',
      'Presenta la solicitud al consulado y paga los aranceles y tasas del visado.',
      'Espera la notificación. El Consulado de Córdoba recomienda no comprar el pasaje hasta recibir la aprobación.',
    ],
    trabajo: [
      'El empleo es un aspecto circunstancial de la estancia, no su objetivo principal: no se puede trabajar más de 6 meses en total.',
      'El acuerdo también permite hacer cursos de formación o perfeccionamiento de hasta 6 meses en total y participar en actividades de voluntariado.',
      'Quienes participan están sujetos a las normas legales y administrativas de España.',
    ],
    consejos: [
      'El requisito de estudios es distinto al de otros países: prepara el título o la constancia de los 2 años de universidad con tiempo.',
      'Los consulados reciben las solicitudes según tu lugar de residencia: no elijas el consulado por cercanía a tu preferencia, sino el que corresponde a tu domicilio.',
      'Con solo 500 visados al año para todo el país, no dejes la solicitud para el último momento.',
    ],
    faq: [
      ['¿Desde cuándo pueden los argentinos pedir la visa de movilidad de jóvenes de España?', 'El acuerdo entre España y Argentina entró en vigor el 10 de febrero de 2023, según el Boletín Oficial del Estado de España.'],
      ['¿Cuántos cupos hay?', 'El acuerdo establece un máximo de 500 visados por año para cada país, que puede modificarse por intercambio de notas diplomáticas.'],
      ['¿Hay que haber estudiado?', 'Sí. Hace falta un título universitario, al menos 2 años de estudios universitarios o un título equivalente de educación superior.'],
      ['¿Cuánto puedo trabajar?', 'Hasta 6 meses en total durante la estancia.'],
    ],
    enlaces: [
      { label: 'Acuerdo España-Argentina, Boletín Oficial del Estado (enero de 2023)', href: 'https://www.boe.es/boe/dias/2023/01/26/pdfs/BOE-A-2023-2097.pdf' },
      { label: 'Programa de Movilidad de Jóvenes, Consulado de España en Córdoba', href: 'https://www.exteriores.gob.es/Consulados/cordoba/es/Comunicacion/Noticias/Paginas/Articulos/Programa-de-Movilidad-J%C3%B3venes-argentinos.aspx' },
    ],
  },
];
