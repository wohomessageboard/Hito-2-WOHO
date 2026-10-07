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

export const REVISADO_HOY = '2026-10-08';

// Países con acuerdo Working Holiday con Chile, según la Cancillería de Chile.
// `slug` solo existe si ya hay guía publicada.
export const ACUERDOS_CHILE = [
  { name: 'Alemania', flag: '🇩🇪' },
  { name: 'Australia', flag: '🇦🇺', slug: 'australia' },
  { name: 'Austria', flag: '🇦🇹' },
  { name: 'Canadá', flag: '🇨🇦', slug: 'canada' },
  { name: 'Corea del Sur', flag: '🇰🇷' },
  { name: 'Dinamarca', flag: '🇩🇰', slug: 'dinamarca' },
  { name: 'Francia', flag: '🇫🇷' },
  { name: 'Hungría', flag: '🇭🇺' },
  { name: 'Irlanda', flag: '🇮🇪', slug: 'irlanda' },
  { name: 'Islandia', flag: '🇮🇸' },
  { name: 'Japón', flag: '🇯🇵' },
  { name: 'Luxemburgo', flag: '🇱🇺' },
  { name: 'Nueva Zelanda', flag: '🇳🇿', slug: 'nueva-zelanda' },
  { name: 'Polonia', flag: '🇵🇱' },
  { name: 'Portugal', flag: '🇵🇹' },
  { name: 'República Checa', flag: '🇨🇿' },
  { name: 'Suecia', flag: '🇸🇪' },
  { name: 'Alianza del Pacífico (Colombia, México y Perú)', flag: '🌎' },
];

export const FUENTE_CHILE = { label: 'Portal Working Holiday de la Cancillería de Chile', href: 'https://www.consulado.gob.cl/workingholiday' };

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
];

export const guiaPorSlug = (slug) => GUIAS.find((g) => g.slug === slug);
