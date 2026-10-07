// Guías de visa Working Holiday. JavaScript puro (sin JSX) porque lo leen la web y los
// generadores del build (sitemap, HTML previo, datos estructurados).
//
// REGLA DE ESTE ARCHIVO: solo van datos que se comprobaron en la página oficial del país
// (fuente en `enlaces`). Lo que cambia cada año o por temporada (cupos, fechas de apertura,
// montos) lleva la fecha de revisión y la invitación a confirmar en el sitio oficial.
// Al actualizar una guía, cambia también su `revisado`.
//
// Las guías están escritas para personas con pasaporte chileno. Con otra nacionalidad los
// requisitos cambian: cada guía lo advierte y enlaza a la fuente oficial.

import { REVISADO_HOY } from './revision.js';
import { GUIAS_MAS } from './guiasMas.js';
import { GUIAS_LOTE2 } from './guiasLote2.js';
import { GUIAS_LOTE3 } from './guiasLote3.js';

export { REVISADO_HOY };

const slugify = (t) => t.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const acuerdo = (name, flag, slug) => ({ name, flag, slug: slug || slugify(name) });

// Pasaportes con guía. `acuerdos` son los países con convenio Working Holiday según el
// gobierno de origen (fuente en `fuente`). Cada acuerdo enlaza a su guía solo si ya existe
// una guía con ese origen y ese `slug`.
export const ORIGENES = [
  {
    slug: 'chile',
    nombre: 'Chile',
    flag: '🇨🇱',
    gentilicio: 'chilenos',
    pasaporte: 'chileno',
    revisado: REVISADO_HOY,
    listaCompleta: true,
    fuentes: [{ label: 'Portal Working Holiday de la Cancillería de Chile', href: 'https://www.consulado.gob.cl/workingholiday' }],
    nota: 'La Cancillería de Chile informa acuerdos con 18 países y un acuerdo de intercambio de pasantías con Suiza.',
    acuerdos: [
      acuerdo('Alemania', '🇩🇪'), acuerdo('Australia', '🇦🇺'), acuerdo('Austria', '🇦🇹'), acuerdo('Canadá', '🇨🇦'),
      acuerdo('Corea del Sur', '🇰🇷'), acuerdo('Dinamarca', '🇩🇰'), acuerdo('Francia', '🇫🇷'), acuerdo('Hungría', '🇭🇺'),
      acuerdo('Irlanda', '🇮🇪'), acuerdo('Islandia', '🇮🇸'), acuerdo('Japón', '🇯🇵'), acuerdo('Luxemburgo', '🇱🇺'),
      acuerdo('Nueva Zelanda', '🇳🇿'), acuerdo('Polonia', '🇵🇱'), acuerdo('Portugal', '🇵🇹'), acuerdo('República Checa', '🇨🇿'),
      acuerdo('Suecia', '🇸🇪'), acuerdo('Alianza del Pacífico (Colombia, México y Perú)', '🌎', 'alianza-del-pacifico'),
    ],
  },
  {
    slug: 'argentina',
    nombre: 'Argentina',
    flag: '🇦🇷',
    gentilicio: 'argentinos',
    pasaporte: 'argentino',
    revisado: REVISADO_HOY,
    listaCompleta: true,
    fuentes: [{ label: 'Cancillería Argentina: Programas de Vacaciones y Trabajo (información de enero de 2026)', href: 'https://www.cancilleria.gob.ar/es/servicios/programas-de-vacaciones-y-trabajo/extranjeros' }],
    nota: 'La Cancillería Argentina informa acuerdos con 19 países. Para las condiciones de cada uno, recomienda consultar a la embajada del país de destino.',
    acuerdos: [
      acuerdo('Alemania', '🇩🇪'), acuerdo('Armenia', '🇦🇲'), acuerdo('Australia', '🇦🇺'), acuerdo('Austria', '🇦🇹'),
      acuerdo('Corea del Sur', '🇰🇷'), acuerdo('Dinamarca', '🇩🇰'), acuerdo('Eslovaquia', '🇸🇰'), acuerdo('Eslovenia', '🇸🇮'),
      acuerdo('España', '🇪🇸'), acuerdo('Francia', '🇫🇷'), acuerdo('Hungría', '🇭🇺'), acuerdo('Irlanda', '🇮🇪'),
      acuerdo('Japón', '🇯🇵'), acuerdo('Noruega', '🇳🇴'), acuerdo('Nueva Zelanda', '🇳🇿'), acuerdo('Países Bajos', '🇳🇱'),
      acuerdo('Polonia', '🇵🇱'), acuerdo('Portugal', '🇵🇹'), acuerdo('Suecia', '🇸🇪'),
    ],
  },
  {
    slug: 'espana',
    nombre: 'España',
    flag: '🇪🇸',
    gentilicio: 'españoles',
    pasaporte: 'español',
    revisado: REVISADO_HOY,
    listaCompleta: false,
    fuentes: [
      { label: 'Estado de los cupos por país, Home Affairs (Australia)', href: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps' },
      { label: 'Spain Working Holiday Visa, Inmigración de Nueva Zelanda', href: 'https://www.immigration.govt.nz/visas/spain-working-holiday-visa/' },
      { label: 'International Experience Canada: quién puede postular', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/eligibility.html' },
    ],
    nota: 'No encontramos una lista oficial completa del gobierno de España. Aquí van los acuerdos que confirmamos en las páginas oficiales de cada país de destino.',
    acuerdos: [acuerdo('Australia', '🇦🇺'), acuerdo('Nueva Zelanda', '🇳🇿'), acuerdo('Canadá', '🇨🇦')],
  },
  {
    slug: 'peru',
    nombre: 'Perú',
    flag: '🇵🇪',
    gentilicio: 'peruanos',
    pasaporte: 'peruano',
    revisado: REVISADO_HOY,
    listaCompleta: false,
    fuentes: [
      { label: 'Estado de los cupos por país, Home Affairs (Australia)', href: 'https://immi.homeaffairs.gov.au/what-we-do/whm-program/status-of-country-caps' },
      { label: 'Peru Working Holiday Visa, Inmigración de Nueva Zelanda', href: 'https://www.immigration.govt.nz/visas/peru-working-holiday-visa/' },
      { label: 'Programa Vacaciones-Trabajo, Embajada de Francia en Perú', href: 'https://pe.diplomatie.gouv.fr/fr/aller-en-france/programme-vacances-travail' },
    ],
    nota: 'No encontramos una lista oficial completa del gobierno de Perú. Aquí van los acuerdos que confirmamos en las páginas oficiales de cada país de destino.',
    acuerdos: [acuerdo('Australia', '🇦🇺'), acuerdo('Nueva Zelanda', '🇳🇿'), acuerdo('Francia', '🇫🇷')],
  },
  {
    slug: 'mexico',
    nombre: 'México',
    flag: '🇲🇽',
    gentilicio: 'mexicanos',
    pasaporte: 'mexicano',
    revisado: REVISADO_HOY,
    listaCompleta: false,
    fuentes: [
      { label: 'Mexico Working Holiday Visa, Inmigración de Nueva Zelanda', href: 'https://www.immigration.govt.nz/visas/mexico-working-holiday-visa/' },
      { label: 'Cupos agotados 2026, Embajada de Francia en México', href: 'https://mx.diplomatie.gouv.fr/es/agotadas-visas-vacaciones-y-trabajo-2026' },
    ],
    nota: 'No encontramos una lista oficial completa del gobierno de México. Aquí van los acuerdos que confirmamos en las páginas oficiales de cada país de destino.',
    acuerdos: [acuerdo('Nueva Zelanda', '🇳🇿'), acuerdo('Francia', '🇫🇷')],
  },
  {
    slug: 'colombia',
    nombre: 'Colombia',
    flag: '🇨🇴',
    gentilicio: 'colombianos',
    pasaporte: 'colombiano',
    revisado: REVISADO_HOY,
    listaCompleta: false,
    fuentes: [
      { label: 'Visa Vacaciones-Trabajo, Embajada de Francia en Colombia', href: 'https://co.diplomatie.gouv.fr/es/vvt' },
    ],
    nota: 'No encontramos una lista oficial completa del gobierno de Colombia. Por ahora confirmamos el acuerdo con Francia; iremos sumando los demás.',
    acuerdos: [acuerdo('Francia', '🇫🇷')],
  },
];

export const origenPorSlug = (slug) => ORIGENES.find((o) => o.slug === slug);

// Consejos que valen para cualquier destino.
export const CONSEJOS_GENERALES = [
  'No reserves vuelos ni pagues alojamiento largo hasta que la visa esté aprobada.',
  'Lleva un respaldo de dinero para las primeras semanas: el primer sueldo suele tardar más de lo que uno piensa.',
  'Desconfía de quien te cobre por «conseguirte» un trabajo o un cupo. Una oferta legítima no te pide dinero por adelantado.',
  'Guarda copias digitales de tu pasaporte, la visa, el seguro y tus contratos, en la nube y en papel.',
  'Antes de pagar un arriendo, conoce el lugar o haz videollamada, y pide el contrato por escrito.',
];

export const GUIAS = [
  {
    slug: 'australia',
    origen: 'chile',
    pais: 'Australia',
    flag: '🇦🇺',
    destino: 'Australia',
    visa: 'Work and Holiday (subclase 462)',
    titulo: 'Working Holiday en Australia para chilenos',
    resumen: 'La visa Work and Holiday (462) permite a personas de 18 a 30 años pasar hasta 12 meses en Australia trabajando para financiar el viaje. Aquí tienes los datos clave, los pasos y los errores que conviene evitar.',
    revisado: REVISADO_HOY,
    datos: [
      ['Visa', 'Work and Holiday, subclase 462'],
      ['Edad', '18 a 30 años (inclusive) al momento de solicitar'],
      ['Duración', '12 meses'],
      ['Costo', 'AUD 840 la primera visa; AUD 1.000 la segunda y la tercera'],
      ['Cupo anual', '3.400 visas; estado «abierto» el 8 de octubre de 2026, según Home Affairs'],
      ['Dónde se pide', 'En línea y desde fuera de Australia'],
      ['Tiempo de trámite', 'Promedio estimado de 3 meses, según Home Affairs'],
      ['Segunda visa', 'Pide haber completado 3 meses de trabajo especificado'],
      ['Tercera visa', 'Pide 6 meses de trabajo especificado'],
    ],
    pasos: [
      'Confirma que cumples los requisitos en la página oficial de Home Affairs, incluido que tu pasaporte es de un país elegible.',
      'Reúne tus documentos y crea tu cuenta ImmiAccount, el portal donde se hace la solicitud.',
      'Presenta la solicitud en línea y paga la tasa. Hazlo estando fuera de Australia.',
      'Espera la resolución. Home Affairs pide no reservar vuelos ni asumir compromisos de viaje, trabajo o estudio hasta que la visa esté concedida.',
      'Cuando te la concedan, revisa en tu carta las condiciones y la fecha límite para entrar al país.',
    ],
    trabajo: [
      'Con esta visa puedes trabajar en Australia durante tu estadía. La carta de concesión incluye las condiciones que debes cumplir; léela completa.',
      'Para pedir una segunda o tercera visa necesitas «trabajo especificado», que es un tipo de trabajo en ciertas industrias y zonas. Home Affairs publica la lista y los códigos postales válidos: revísala antes de aceptar un empleo pensando en la segunda visa.',
      'Tus derechos laborales (pago mínimo, contrato, descansos) rigen también para personas con visa Working Holiday. El Fair Work Ombudsman explica cómo reclamar si algo no se cumple.',
    ],
    consejos: [
      'Para cobrar sueldo y pagar impuestos necesitas un Tax File Number (TFN). Se pide gratis en la página de la autoridad tributaria australiana (ATO); no pagues a nadie por tramitarlo.',
      'Abre una cuenta bancaria en tus primeras semanas: los empleadores te la pedirán.',
      'Si una agencia o un «contacto» te cobra por darte trabajo o por «asegurar» tu segunda visa, es una señal de alerta.',
      'Guarda recibos de sueldo y contratos: te sirven para demostrar el trabajo especificado.',
    ],
    faq: [
      ['¿Cuánto cuesta la visa Working Holiday de Australia?', 'Según Home Affairs, la primera visa Work and Holiday (462) cuesta AUD 840 y la segunda y la tercera AUD 1.000. Verifica el valor vigente con el estimador de precios de su sitio.'],
      ['¿Qué edad se necesita?', 'Entre 18 y 30 años, ambos inclusive, al momento de presentar la solicitud.'],
      ['¿Cuánto dura la visa?', '12 meses. Si cumples los requisitos puedes pedir una segunda y una tercera visa.'],
      ['¿Cuánto trabajo hace falta para la segunda visa?', 'Según Home Affairs, 3 meses de trabajo especificado para la segunda visa y 6 meses para la tercera.'],
    ],
    enlaces: [
      { label: 'Visa Work and Holiday (462), Home Affairs', href: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
      { label: 'Fair Work Ombudsman: derechos laborales', href: 'https://www.fairwork.gov.au/' },
      { label: 'Autoridad tributaria (ATO): Tax File Number', href: 'https://www.ato.gov.au/' },
    ],
  },
  {
    slug: 'nueva-zelanda',
    origen: 'chile',
    pais: 'Nueva Zelanda',
    flag: '🇳🇿',
    destino: null,
    visa: 'Chile Working Holiday Visa',
    titulo: 'Working Holiday en Nueva Zelanda para chilenos',
    resumen: 'Nueva Zelanda ofrece a personas chilenas de 18 a 35 años una visa Working Holiday con cupo anual limitado. Esta guía resume requisitos, montos y límites de trabajo según Inmigración de Nueva Zelanda.',
    aviso: 'Las solicitudes se abren en fechas fijas y los cupos se agotan. Según la página oficial, al 8 de octubre de 2026 la visa figura como cerrada y se abre el 15 de octubre de 2026 a las 10:00 (hora de Nueva Zelanda). Confirma la fecha en el sitio oficial antes de planificar.',
    revisado: REVISADO_HOY,
    datos: [
      ['Visa', 'Chile Working Holiday Visa'],
      ['Edad', '18 a 35 años'],
      ['Duración', 'Hasta 12 meses'],
      ['Costo', 'Desde NZD 770'],
      ['Cupo', '940 visas por año'],
      ['Fondos', 'Al menos NZD 4.200 para tus gastos de vida'],
      ['Seguro', 'Seguro médico completo por todo el tiempo de estadía'],
      ['Con un mismo empleador', 'Hasta 6 meses'],
      ['Tiempo de trámite', 'El 80% se resuelve en 2 semanas, según Inmigración NZ'],
    ],
    pasos: [
      'Revisa en la página oficial si la visa está abierta y a qué hora abre. Los cupos son limitados, así que ten todo listo antes.',
      'Prepara tus documentos: pasaporte, comprobante de fondos (al menos NZD 4.200), seguro médico completo y prueba de que saldrás del país o tienes dinero para el pasaje.',
      'Presenta la solicitud en línea y en inglés, y paga la tasa.',
      'Espera la resolución y revisa las condiciones de tu visa antes de viajar.',
    ],
    trabajo: [
      'Puedes tomar trabajos temporales, pero no un empleo permanente con esta visa.',
      'Con un mismo empleador puedes trabajar hasta 6 meses. Tenlo presente al negociar un contrato largo.',
    ],
    consejos: [
      'Como el cupo se llena, prepara los documentos antes de que abra el proceso, y no dejes el seguro médico para el final.',
      'Para trabajar y pagar impuestos necesitarás un número de contribuyente de Nueva Zelanda (número IRD). Se tramita con la autoridad tributaria del país.',
      'Evita pagar a intermediarios por «asegurarte» un cupo: la solicitud se hace directamente en el sitio oficial.',
    ],
    faq: [
      ['¿Quién puede pedir la visa Working Holiday de Nueva Zelanda siendo chileno?', 'Según Inmigración de Nueva Zelanda, personas chilenas de 18 a 35 años que cumplan los requisitos de fondos, seguro y salida del país.'],
      ['¿Cuántos cupos hay?', 'La página oficial indica 940 visas disponibles cada año.'],
      ['¿Cuánto tiempo puedo trabajar con un mismo empleador?', 'Hasta 6 meses. No se puede tomar un empleo permanente con esta visa.'],
      ['¿Cuánto dinero debo demostrar?', 'Al menos NZD 4.200 para tus gastos de vida, además de seguro médico completo y evidencia del pasaje de salida o fondos para comprarlo.'],
    ],
    enlaces: [
      { label: 'Chile Working Holiday Visa, Inmigración de Nueva Zelanda', href: 'https://www.immigration.govt.nz/visas/chile-working-holiday-visa' },
      { label: 'Autoridad tributaria de Nueva Zelanda (Inland Revenue)', href: 'https://www.ird.govt.nz/' },
    ],
  },
  {
    slug: 'canada',
    origen: 'chile',
    pais: 'Canadá',
    flag: '🇨🇦',
    destino: null,
    visa: 'International Experience Canada (IEC), categoría Working Holiday',
    titulo: 'Working Holiday en Canadá para chilenos',
    resumen: 'Canadá gestiona su Working Holiday a través del programa International Experience Canada (IEC): primero se crea un perfil, luego se espera una invitación y recién después se solicita el permiso de trabajo.',
    revisado: REVISADO_HOY,
    datos: [
      ['Programa', 'International Experience Canada (IEC)'],
      ['Categoría', 'Working Holiday'],
      ['Edad', '18 a 35 años, según la Cancillería de Chile'],
      ['Cómo se entra', 'Perfil en línea, invitación a postular (ITA) y solicitud del permiso de trabajo'],
      ['Cupos', 'Limitados por temporada y por país'],
    ],
    pasos: [
      'Entra al sitio de IEC, elige Chile como país de ciudadanía y revisa las categorías y los requisitos que te corresponden.',
      'Crea tu perfil de candidato en línea. Presentarlo no es pedir el permiso: solo te pone en el grupo de candidatos.',
      'Si te seleccionan, recibes una invitación a postular (ITA). Tienes un plazo limitado para aceptarla y presentar tu solicitud; los días exactos figuran en tu invitación.',
      'Presenta la solicitud del permiso de trabajo con tus documentos y paga las tasas.',
      'Antes de viajar, revisa las condiciones de tu permiso y las instrucciones para entrar al país.',
    ],
    trabajo: [
      'La categoría Working Holiday no exige una oferta de trabajo previa. Confirma en el sitio de IEC las condiciones exactas de tu permiso antes de aceptar un empleo.',
      'IEC también tiene categorías para jóvenes profesionales y prácticas profesionales, con requisitos distintos. Compáralas antes de elegir.',
    ],
    consejos: [
      'Entra al sitio cuando empiece la temporada y crea tu perfil temprano: las invitaciones se reparten por rondas.',
      'Revisa cuántas veces puede participar una persona chilena y en qué categorías. Cada país tiene reglas distintas.',
      'Al llegar necesitarás un número de seguridad social canadiense (SIN) para trabajar. Se tramita directamente con el gobierno; no pagues a intermediarios.',
    ],
    faq: [
      ['¿Cómo funciona el Working Holiday de Canadá?', 'A través de International Experience Canada: creas un perfil, entras a un grupo de candidatos y, si te seleccionan, recibes una invitación a postular. Solo entonces solicitas el permiso de trabajo.'],
      ['¿Qué edad se necesita?', 'La Cancillería de Chile indica 18 a 35 años para Canadá.'],
      ['¿Necesito una oferta de trabajo?', 'En la categoría Working Holiday, no. Otras categorías de IEC sí piden una oferta o una práctica.'],
    ],
    enlaces: [
      { label: 'International Experience Canada: quién puede postular', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/eligibility.html' },
      { label: 'IEC: crea tu perfil y recibe tu invitación', href: 'https://www.canada.ca/en/immigration-refugees-citizenship/services/work-canada/iec/become-candidate.html' },
    ],
  },
  {
    slug: 'irlanda',
    origen: 'chile',
    pais: 'Irlanda',
    flag: '🇮🇪',
    destino: 'Irlanda',
    visa: 'Working Holiday Authorisation',
    titulo: 'Working Holiday en Irlanda para chilenos',
    resumen: 'Irlanda tiene un acuerdo con Chile que permite a 200 jóvenes al año pasar hasta un año en el país, con empleo como parte accesoria de la estadía. Las solicitudes se hacen por rondas.',
    aviso: 'Los datos de esta guía vienen de la guía oficial de la Embajada de Irlanda en Chile (edición 2025). Las fechas de las rondas y los montos pueden cambiar cada año: confirma en el sitio de la Embajada antes de planificar.',
    revisado: REVISADO_HOY,
    datos: [
      ['Edad', '18 a 30 años (inclusive)'],
      ['Residencia', 'Haber vivido en Chile al menos los últimos 6 meses al postular'],
      ['Duración', 'Hasta un año'],
      ['Cupo', 'Hasta 200 personas por año; 100 en la primera ronda'],
      ['Costo', 'EUR 85 de tramitación y EUR 60 de visa, pagados por separado'],
      ['Fondos', 'EUR 1.500 si tienes pasaje de vuelta; EUR 3.000 si no lo tienes'],
      ['Seguro', 'Responsabilidad civil, médico y accidentes, con hospitalización y repatriación'],
    ],
    pasos: [
      'Revisa en el sitio de la Embajada de Irlanda en Chile cuándo abre la ronda y qué documentos piden.',
      'Verifica que cumples la edad y que has vivido en Chile al menos los últimos 6 meses.',
      'Reúne los documentos: pasaporte vigente, comprobante de fondos, seguro y prueba del pasaje de vuelta o de dinero para comprarlo.',
      'Paga las dos tasas por separado, como indica la guía oficial, y presenta tu solicitud en el plazo de la ronda.',
      'Espera la respuesta y revisa las condiciones de tu autorización antes de viajar.',
    ],
    trabajo: [
      'El acuerdo permite tomar empleo como un aspecto accesorio de la estadía: el objetivo principal es la estadía como vacaciones prolongadas. Revisa en la guía oficial las condiciones de trabajo.',
    ],
    consejos: [
      'Los cupos son pocos: ten los documentos listos antes de que abra la ronda.',
      'Revisa que el seguro cubra lo que exige la guía (responsabilidad civil, médico, accidentes, hospitalización y repatriación). No todos los seguros de viaje lo hacen.',
      'Al llegar a Irlanda, consulta en el sitio de inmigración irlandés qué registros te corresponden como persona que se queda más de 90 días.',
    ],
    faq: [
      ['¿Cuántos cupos hay en Irlanda para chilenos?', 'Según la guía oficial de la Embajada de Irlanda en Chile, hasta 200 personas por año, con 100 vacantes en la primera ronda (edición 2025).'],
      ['¿Cuánto cuesta?', 'EUR 85 de tramitación y EUR 60 de visa, en dos pagos separados, según la guía 2025.'],
      ['¿Cuánto dinero debo demostrar?', 'EUR 1.500 si tienes pasaje de vuelta y EUR 3.000 si no lo tienes, según la guía 2025.'],
      ['¿Hay que vivir en Chile para postular?', 'Sí. La guía exige haber residido en Chile al menos los últimos 6 meses.'],
    ],
    enlaces: [
      { label: 'Working Holiday Agreement, Embajada de Irlanda en Chile', href: 'https://www.ireland.ie/en/chile/santiago/services/visas/chile-working-holiday-agreement/' },
      { label: 'Guía oficial 2025 (PDF)', href: 'https://assets.ireland.ie/documents/Chile_2025_WHA_guidance.pdf' },
      { label: 'Servicio de Inmigración de Irlanda', href: 'https://www.irishimmigration.ie/' },
    ],
  },
  {
    slug: 'dinamarca',
    origen: 'chile',
    pais: 'Dinamarca',
    flag: '🇩🇰',
    destino: 'Dinamarca',
    visa: 'Working Holiday (permiso de residencia)',
    titulo: 'Working Holiday en Dinamarca para chilenos',
    resumen: 'Dinamarca otorga 150 permisos Working Holiday al año a personas chilenas, por orden de llegada y con trámite presencial en Santiago. Esta guía resume requisitos, costos y condiciones de trabajo según la autoridad migratoria danesa.',
    aviso: 'Los permisos se entregan por orden de llegada, en dos períodos (marzo a agosto y septiembre a febrero). Confirma en el sitio oficial cuántos quedan antes de reservar hora.',
    revisado: REVISADO_HOY,
    datos: [
      ['Edad', 'Mínimo 18 años y no haber cumplido 31 al presentar la solicitud'],
      ['Duración', 'Un año desde la entrada, con posible extensión según las condiciones'],
      ['Cupo', '150 permisos al año (ciclo marzo a febrero), por orden de llegada'],
      ['Costo', 'DKK 3.060 de tasa'],
      ['Fondos', 'DKK 20.000, o DKK 15.000 más pasaje de vuelta'],
      ['Seguro', 'Médico, con cobertura de hospitalización, durante toda la estadía'],
      ['Dónde se pide', 'En persona, en VFS en Santiago de Chile'],
      ['Trabajo', 'Máximo 6 meses calendario durante los 12 meses, solo como asalariado'],
      ['Tiempo de trámite', 'Normalmente 3 meses; hasta 4 si piden más información'],
    ],
    pasos: [
      'Revisa los requisitos en el sitio de la autoridad migratoria danesa (Nyidanmark) y confirma que quedan permisos en el período actual.',
      'Prepara el formulario en papel (no se puede usar la solicitud en línea) y los documentos, incluido un extracto bancario de no más de 30 días con tu nombre, saldo y moneda.',
      'Contrata un seguro médico que cubra hospitalización durante todo el tiempo que estarás en Dinamarca.',
      'Reserva hora y entrega la solicitud en persona en VFS Santiago. Las solicitudes presentadas en otro lugar o por internet se rechazan.',
      'Espera la resolución, que normalmente tarda 3 meses, y no viajes antes de tenerla.',
    ],
    trabajo: [
      'Puedes trabajar un máximo de 6 meses calendario durante tu estadía de 12 meses, y solo como asalariado: emprender no está permitido.',
      'Planifica tu año con ese límite en mente: si trabajas continuado, los otros meses son de estadía sin empleo.',
    ],
    consejos: [
      'Como el cupo es por orden de llegada, prepara el formulario y los documentos con anticipación para pedir hora apenas se abra el período.',
      'El extracto bancario no puede tener más de 30 días al momento de entregar la solicitud: pídelo cerca de la fecha de tu cita.',
      'Al llegar, revisa en el sitio oficial qué registros y trámites te corresponden en Dinamarca.',
    ],
    faq: [
      ['¿Cuántos permisos Working Holiday hay en Dinamarca para chilenos?', 'Según Nyidanmark, 150 permisos al año (ciclo marzo a febrero), entregados por orden de llegada.'],
      ['¿Se puede pedir la visa por internet?', 'No. La solicitud se entrega en persona en VFS Santiago y se hace con el formulario en papel; las solicitudes por otros medios se rechazan.'],
      ['¿Cuánto puedo trabajar?', 'Máximo 6 meses calendario durante los 12 meses del permiso, y solo en empleos asalariados.'],
      ['¿Cuánto dinero debo demostrar?', 'DKK 20.000 en total, o DKK 15.000 más un pasaje de vuelta, con un extracto bancario de no más de 30 días.'],
    ],
    enlaces: [
      { label: 'Working Holiday para ciudadanos de Chile, Nyidanmark', href: 'https://www.nyidanmark.dk/pl-PL/You-want-to-apply/Working-Holiday/Working-Holiday-Chile-application' },
      { label: 'VFS Global: centro de solicitudes en Santiago', href: 'https://www.vfsglobal.com/' },
    ],
  },
  // ───────────────────────── Argentina ─────────────────────────
  {
    slug: 'australia',
    origen: 'argentina',
    pais: 'Australia',
    flag: '🇦🇺',
    destino: 'Australia',
    visa: 'Work and Holiday (subclase 462)',
    titulo: 'Working Holiday en Australia para argentinos',
    resumen: 'Australia tiene un acuerdo Work and Holiday con Argentina. La visa 462 permite a personas de 18 a 30 años pasar hasta 12 meses en el país trabajando para financiar el viaje.',
    revisado: REVISADO_HOY,
    datos: [
      ['Visa', 'Work and Holiday, subclase 462'],
      ['Edad', '18 a 30 años (inclusive) al momento de solicitar'],
      ['Duración', '12 meses'],
      ['Costo', 'AUD 840 la primera visa; AUD 1.000 la segunda y la tercera'],
      ['Cupo anual', '3.400 visas; estado «abierto» el 8 de octubre de 2026, según Home Affairs'],
      ['Dónde se pide', 'En línea y desde fuera de Australia'],
      ['Tiempo de trámite', 'Promedio estimado de 3 meses, según Home Affairs'],
      ['Segunda visa', 'Pide haber completado 3 meses de trabajo especificado'],
      ['Tercera visa', 'Pide 6 meses de trabajo especificado'],
    ],
    pasos: [
      'Confirma en la página oficial de Home Affairs que tu pasaporte argentino es elegible y que cumples los requisitos.',
      'Reúne tus documentos y crea tu cuenta ImmiAccount, el portal donde se hace la solicitud.',
      'Presenta la solicitud en línea y paga la tasa, estando fuera de Australia.',
      'Espera la resolución. Home Affairs pide no reservar vuelos ni asumir compromisos de viaje, trabajo o estudio hasta que la visa esté concedida.',
      'Cuando te la concedan, revisa en tu carta las condiciones y la fecha límite para entrar al país.',
    ],
    trabajo: [
      'Con esta visa puedes trabajar en Australia durante tu estadía. La carta de concesión incluye las condiciones que debes cumplir; léela completa.',
      'Para pedir una segunda o tercera visa necesitas «trabajo especificado», que es trabajo en ciertas industrias y zonas. Home Affairs publica la lista y los códigos postales válidos: revísala antes de aceptar un empleo.',
      'Tus derechos laborales (pago mínimo, contrato, descansos) rigen también para personas con visa Working Holiday. El Fair Work Ombudsman explica cómo reclamar si algo no se cumple.',
    ],
    consejos: [
      'Para cobrar sueldo y pagar impuestos necesitas un Tax File Number (TFN). Se pide gratis en la página de la autoridad tributaria australiana (ATO); no pagues a nadie por tramitarlo.',
      'Abre una cuenta bancaria en tus primeras semanas: los empleadores te la pedirán.',
      'Si una agencia o un «contacto» te cobra por darte trabajo o por «asegurar» tu segunda visa, es una señal de alerta.',
    ],
    faq: [
      ['¿Pueden los argentinos pedir la visa Working Holiday de Australia?', 'Sí. Argentina figura entre los países con acuerdo según su Cancillería, y la visa que corresponde es la Work and Holiday (subclase 462). Confirma la elegibilidad de tu pasaporte en Home Affairs.'],
      ['¿Cuánto cuesta?', 'Según Home Affairs, la primera visa 462 cuesta AUD 840 y la segunda y la tercera AUD 1.000.'],
      ['¿Qué edad se necesita?', 'Entre 18 y 30 años, ambos inclusive, al momento de presentar la solicitud.'],
    ],
    enlaces: [
      { label: 'Visa Work and Holiday (462), Home Affairs', href: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/work-holiday-462' },
      { label: 'Cancillería Argentina: Programas de Vacaciones y Trabajo', href: 'https://www.cancilleria.gob.ar/es/servicios/programas-de-vacaciones-y-trabajo/extranjeros' },
      { label: 'Fair Work Ombudsman: derechos laborales', href: 'https://www.fairwork.gov.au/' },
    ],
  },
  {
    slug: 'nueva-zelanda',
    origen: 'argentina',
    pais: 'Nueva Zelanda',
    flag: '🇳🇿',
    destino: null,
    visa: 'Argentina Working Holiday Visa',
    titulo: 'Working Holiday en Nueva Zelanda para argentinos',
    resumen: 'Nueva Zelanda ofrece a personas argentinas de 18 a 35 años una visa Working Holiday de hasta 12 meses, con cupo anual de 1.000 visas. Aquí están los requisitos según Inmigración de Nueva Zelanda.',
    aviso: 'Según la página oficial, al 8 de octubre de 2026 esta visa está cerrada: «se puede postular el próximo año». Revisa en el sitio oficial cuándo abre la nueva convocatoria antes de planificar.',
    revisado: REVISADO_HOY,
    datos: [
      ['Visa', 'Argentina Working Holiday Visa'],
      ['Edad', '18 a 35 años'],
      ['Duración', 'Hasta 12 meses'],
      ['Costo', 'Desde NZD 770'],
      ['Cupo', '1.000 visas por año'],
      ['Fondos', 'Al menos NZD 4.200 para tus gastos de vida'],
      ['Seguro', 'Seguro médico completo por todo el tiempo de estadía'],
      ['Pasaje', 'Boleto de salida de Nueva Zelanda o fondos para comprarlo'],
      ['Estado (8 oct. 2026)', 'Cerrada por 2026'],
    ],
    pasos: [
      'Revisa en la página oficial si la visa está abierta. Los cupos son limitados y se agotan.',
      'Prepara tus documentos: pasaporte, comprobante de fondos, seguro médico completo y prueba de salida del país o dinero para el pasaje.',
      'Presenta la solicitud en línea y paga la tasa.',
      'Espera la resolución y revisa las condiciones de tu visa antes de viajar.',
    ],
    trabajo: [
      'Puedes tomar trabajos temporales, pero no un empleo permanente con esta visa.',
      'A diferencia de la visa para chilenos, la página oficial de la visa argentina no indica un máximo de tiempo con un mismo empleador. Confirma las condiciones exactas de tu visa antes de aceptar un contrato largo.',
    ],
    consejos: [
      'Como el cupo se llena, ten los documentos listos antes de que abra la convocatoria, incluido el seguro médico.',
      'Para trabajar y pagar impuestos necesitarás un número de contribuyente de Nueva Zelanda (IRD), que se tramita con la autoridad tributaria del país.',
      'Evita pagar a intermediarios por «asegurarte» un cupo: la solicitud se hace directamente en el sitio oficial.',
    ],
    faq: [
      ['¿Qué edad se necesita para la visa Working Holiday de Nueva Zelanda siendo argentino?', 'Entre 18 y 35 años, según Inmigración de Nueva Zelanda.'],
      ['¿Cuántos cupos hay?', 'La página oficial indica 1.000 visas disponibles cada año.'],
      ['¿Cuánto dinero debo demostrar?', 'Al menos NZD 4.200 para tus gastos de vida, además de seguro médico completo y evidencia de tu boleto de salida o fondos para comprarlo.'],
    ],
    enlaces: [
      { label: 'Argentina Working Holiday Visa, Inmigración de Nueva Zelanda', href: 'https://www.immigration.govt.nz/visas/argentina-working-holiday-visa' },
      { label: 'Autoridad tributaria de Nueva Zelanda (Inland Revenue)', href: 'https://www.ird.govt.nz/' },
    ],
  },
  {
    slug: 'irlanda',
    origen: 'argentina',
    pais: 'Irlanda',
    flag: '🇮🇪',
    destino: 'Irlanda',
    visa: 'Working Holiday Authorisation',
    titulo: 'Working Holiday en Irlanda para argentinos',
    resumen: 'Irlanda permite a 200 jóvenes argentinos de 18 a 35 años pasar hasta un año en el país, con empleo como parte accesoria de la estadía. La convocatoria es anual y se gestiona con la Embajada de Irlanda y VFS Global.',
    aviso: 'Según la Embajada de Irlanda en Argentina, la convocatoria 2026 abrió el 1 de junio de 2026 a las 9:00 (hora argentina). Confirma en su sitio cuándo abre la próxima y qué montos aplican ese año.',
    revisado: REVISADO_HOY,
    datos: [
      ['Edad', '18 a 35 años (inclusive)'],
      ['Duración', 'Hasta un año'],
      ['Cupo', '200 personas por año'],
      ['Costo', 'EUR 150 de tasa de visa, según la Embajada en Buenos Aires'],
      ['Fondos', 'EUR 1.500 si tienes pasaje de vuelta; EUR 3.000 si no lo tienes'],
      ['Requisitos', 'Pasaporte argentino vigente, sin antecedentes penales y no haber participado antes del programa'],
      ['Cómo se gestiona', 'Embajada de Irlanda en Argentina junto con VFS Global'],
    ],
    pasos: [
      'Revisa en el sitio de la Embajada de Irlanda en Argentina cuándo abre la convocatoria y qué documentos piden.',
      'Verifica que cumples la edad (18 a 35 años) y que no has participado antes del programa.',
      'Reúne los documentos: pasaporte vigente, certificado de antecedentes, comprobante de fondos y prueba del pasaje de vuelta o de dinero para comprarlo.',
      'Presenta tu solicitud en la fecha y hora de apertura a través de los canales oficiales y paga la tasa.',
      'Espera la respuesta y revisa las condiciones de tu autorización antes de viajar. Puede que te pidan mostrar tus fondos al entrar a Irlanda.',
    ],
    trabajo: [
      'El acuerdo permite tomar empleo como un aspecto accesorio de la estadía: el objetivo principal es la estadía como vacaciones prolongadas. Revisa las condiciones de trabajo en la guía oficial.',
    ],
    consejos: [
      'Con solo 200 cupos y apertura en fecha y hora fijas, ten todos los documentos listos antes del día de apertura.',
      'Al llegar a Irlanda, consulta en el sitio de inmigración irlandés qué registros te corresponden como persona que se queda más de 90 días.',
    ],
    faq: [
      ['¿Cuántos cupos hay en Irlanda para argentinos?', 'Según la Embajada de Irlanda en Argentina, 200 personas por año.'],
      ['¿Qué edad se necesita?', 'Entre 18 y 35 años, ambos inclusive.'],
      ['¿Cuánto dinero debo demostrar?', 'EUR 1.500 si tienes pasaje de vuelta y EUR 3.000 si no lo tienes.'],
    ],
    enlaces: [
      { label: 'Working Holiday Programme, Embajada de Irlanda en Argentina', href: 'https://www.ireland.ie/en/argentina/buenosaires/services/visas/working-holiday-programme/' },
      { label: 'Servicio de Inmigración de Irlanda', href: 'https://www.irishimmigration.ie/' },
    ],
  },
  {
    slug: 'dinamarca',
    origen: 'argentina',
    pais: 'Dinamarca',
    flag: '🇩🇰',
    destino: 'Dinamarca',
    visa: 'Working Holiday (permiso de residencia)',
    titulo: 'Working Holiday en Dinamarca para argentinos',
    resumen: 'Dinamarca otorga 150 permisos Working Holiday al año a personas argentinas, por orden de llegada y con trámite presencial en Buenos Aires. A diferencia de otros pasaportes, permite trabajar hasta 9 meses.',
    aviso: 'Los permisos se entregan por orden de llegada, en dos períodos (marzo a agosto y septiembre a febrero). Confirma en el sitio oficial cuántos quedan antes de pedir hora.',
    revisado: REVISADO_HOY,
    datos: [
      ['Edad', 'Mínimo 18 años y no haber cumplido 31 al presentar la solicitud'],
      ['Duración', 'Un año desde la entrada'],
      ['Cupo', '150 permisos al año (ciclo marzo a febrero), por orden de llegada'],
      ['Costo', 'DKK 3.060 de tasa'],
      ['Fondos', 'DKK 20.000, o DKK 15.000 más pasaje de vuelta'],
      ['Seguro', 'Médico, con cobertura de hospitalización, durante toda la estadía'],
      ['Dónde se pide', 'En persona, en VFS en Buenos Aires'],
      ['Trabajo', 'Hasta 9 meses calendario durante los 12 meses, solo como asalariado'],
      ['Tiempo de trámite', 'Normalmente 3 meses; hasta 4 si piden más información'],
    ],
    pasos: [
      'Revisa los requisitos en el sitio de la autoridad migratoria danesa (Nyidanmark) y confirma que quedan permisos en el período actual.',
      'Prepara el formulario y los documentos, incluido un extracto bancario de no más de 30 días con tu nombre, saldo y moneda.',
      'Contrata un seguro médico que cubra hospitalización durante toda la estadía, con la póliza traducida al inglés o a un idioma nórdico.',
      'Entrega la solicitud en persona en VFS Buenos Aires. Las solicitudes presentadas en otro lugar o por internet se rechazan.',
      'Espera la resolución, que normalmente tarda 3 meses, y no viajes antes de tenerla.',
    ],
    trabajo: [
      'Puedes trabajar hasta 9 meses calendario durante tu estadía de 12 meses, y solo como asalariado: emprender no está permitido.',
      'Trabajar de forma ilegal puede llevar a que te revoquen el permiso, así que confirma siempre que tu empleo cumple las condiciones.',
    ],
    consejos: [
      'Como el cupo es por orden de llegada, prepara los documentos con anticipación para pedir hora apenas se abra el período.',
      'El extracto bancario no puede tener más de 30 días al momento de entregar la solicitud: pídelo cerca de la fecha de tu cita.',
      'La póliza del seguro debe presentarse traducida al inglés o a un idioma nórdico.',
    ],
    faq: [
      ['¿Cuántos permisos hay en Dinamarca para argentinos?', 'Según Nyidanmark, 150 permisos al año (ciclo marzo a febrero), entregados por orden de llegada.'],
      ['¿Cuánto puedo trabajar?', 'Hasta 9 meses calendario durante los 12 meses del permiso, y solo en empleos asalariados.'],
      ['¿Dónde se entrega la solicitud?', 'En persona, en VFS Buenos Aires. Las solicitudes por internet u otros lugares se rechazan.'],
    ],
    enlaces: [
      { label: 'Working Holiday para ciudadanos de Argentina, Nyidanmark', href: 'https://www.nyidanmark.dk/uk-UA/You-want-to-apply/Working-Holiday/Working-Holiday-Argentina-application' },
      { label: 'VFS Global', href: 'https://www.vfsglobal.com/' },
    ],
  },
];

GUIAS.push(...GUIAS_MAS, ...GUIAS_LOTE2, ...GUIAS_LOTE3);

// Etiqueta corta de cada tarjeta: el tipo de permiso por destino. No lleva estados ni fechas
// (cambian cada año y no se mantienen aquí); el nombre oficial completo está en `visa`.
const ETIQUETAS = { australia: 'VISA 462', 'nueva-zelanda': 'WORKING HOLIDAY', canada: 'IEC', irlanda: 'AUTORIZACIÓN WH', dinamarca: 'PERMISO WH', francia: 'VVT', alemania: 'VISA WH', japon: 'VISA WH', 'corea-del-sur': 'VISA H-1', espana: 'VISA JÓVENES' };
export const etiquetaDe = (g) => ETIQUETAS[g.slug] || 'WORKING HOLIDAY';

export const guiaPor = (origen, slug) => GUIAS.find((g) => g.origen === origen && g.slug === slug);
export const guiasDe = (origen) => GUIAS.filter((g) => g.origen === origen);
