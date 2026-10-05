// Términos y Condiciones de Driftler — BORRADOR.
// Formato: cada sección tiene `id`, `title` y `blocks`. Un bloque es un párrafo (string)
// o una lista ({ list: [...] }). Escribe [[así]] lo que debes completar o decidir, y
// **así** lo que va en negrita.
const ADS = Boolean(import.meta.env.VITE_ADSENSE_CLIENT);

export const TERMINOS = {
  title: 'Términos y Condiciones',
  intro:
    'Estas reglas explican cómo funciona Driftler y qué esperamos de quienes la usan. Al crear una cuenta o usar el sitio aceptas estos Términos y la Política de Privacidad.',
  sections: [
    {
      id: 'quienes-somos',
      title: 'Quiénes somos',
      blocks: [
        'Driftler es un tablón de avisos para viajeros con visa Working Holiday, operado por [[NOMBRE COMPLETO O RAZÓN SOCIAL DEL TITULAR]] ([[RUT / DNI / IDENTIFICACIÓN]]), con domicilio en [[DIRECCIÓN, CIUDAD Y PAÍS]]. En adelante, «Driftler», «nosotros».',
        'Puedes escribirnos a [[CORREO DE CONTACTO]] o desde la página de **Contacto**.',
      ],
    },
    {
      id: 'servicio',
      title: 'Qué es Driftler (y qué no)',
      blocks: [
        'Driftler permite publicar y encontrar avisos de alojamiento, trabajo temporal, compañeros de ruta y otros temas útiles para viajeros, y contactar a quien los publica por WhatsApp.',
        '**Driftler solo facilita el encuentro.** No somos una agencia de empleo, una inmobiliaria ni una agencia de viajes; no verificamos los avisos ni a las personas, y no somos parte de los acuerdos que ustedes hagan entre sí (arriendos, trabajos, pagos, viajes compartidos u otros).',
      ],
    },
    {
      id: 'cuenta',
      title: 'Tu cuenta',
      blocks: [
        {
          list: [
            'Debes tener al menos **18 años**. Al crear tu cuenta confirmas que los tienes, y la cerraremos si descubrimos lo contrario.',
            'Los datos que das al registrarte deben ser verdaderos y actuales.',
            'Una persona, una cuenta. Eres responsable de tu contraseña y de lo que ocurra desde tu cuenta; si crees que alguien la usa sin permiso, cámbiala y avísanos.',
            'Puedes navegar los avisos sin cuenta; para publicar, guardar, seguir destinos, contactar o reportar necesitas una.',
          ],
        },
      ],
    },
    {
      id: 'contenido',
      title: 'Lo que publicas',
      blocks: [
        'Eres responsable de los avisos, textos y fotos que subes. Al publicar nos autorizas, sin costo y mientras el aviso exista, a mostrarlo en Driftler y en las tarjetas que se generan al compartir su enlace (por ejemplo en WhatsApp). Sigues siendo dueño de tu contenido.',
        'Publica solo contenido propio o que tengas derecho a usar. No está permitido:',
        {
          list: [
            'Estafas, o pedir dinero por adelantado, depósitos o pagos «por darte el trabajo» o «por reservar» sin condiciones claras.',
            'Información falsa o engañosa sobre el alojamiento, el trabajo, los precios o tu identidad.',
            'Discriminación, acoso, amenazas o contenido ofensivo.',
            'Contenido ilegal, o que incite a ofrecer o contratar trabajo en condiciones prohibidas por la ley del lugar.',
            'Fotos o datos de otras personas sin su permiso.',
            'Spam, publicidad masiva o avisos repetidos.',
          ],
        },
      ],
    },
    {
      id: 'derechos-autor',
      title: 'Fotos y derechos de autor',
      blocks: [
        'Solo debes subir fotos y textos propios o que tengas permiso de usar. Si crees que un aviso usa una foto o un texto tuyo sin tu permiso, avísanos y lo revisamos rápido: usa **Reportar** en el aviso y elige «Derechos de autor», o escribe a [[CORREO PARA AVISOS DE DERECHOS DE AUTOR]].',
        'Para que podamos actuar, indícanos:',
        {
          list: [
            'Qué obra es tuya (por ejemplo, la foto original) y dónde está publicada.',
            'El enlace del aviso de Driftler donde aparece.',
            'Tu nombre y un medio para contactarte.',
            'Que actúas de buena fe y que lo que declaras es exacto; y que eres la persona titular de los derechos o la representas.',
          ],
        },
        'Cuando recibimos un aviso válido retiramos el contenido y se lo informamos a quien lo publicó, que puede respondernos si cree que fue un error. Las cuentas que repitan infracciones serán suspendidas. [[SI QUIERES ACOGERTE A LAS PROTECCIONES DE LA LEY DE DERECHOS DE AUTOR DE EE. UU. (DMCA), REGISTRA UN AGENTE DESIGNADO EN LA OFICINA DE DERECHOS DE AUTOR DE EE. UU. E INDICA AQUÍ SUS DATOS. CONSÚLTALO CON UN ABOGADO.]]',
      ],
    },
    {
      id: 'duracion',
      title: 'Duración de los avisos',
      blocks: [
        'Los avisos caducan para que quienes buscan siempre encuentren información vigente. Al publicar eliges por cuántos días estará visible tu aviso, **hasta un máximo de 30 días**. Cuando vence, deja de aparecer en el listado; si sigue vigente, puedes publicar uno nuevo. Solo el equipo de Driftler puede publicar avisos por más tiempo o sin caducidad. Puedes editar o eliminar tu aviso cuando quieras.',
      ],
    },
    {
      id: 'contacto-whatsapp',
      title: 'Contacto entre personas',
      blocks: [
        'Para publicar debes dejar un número de WhatsApp: es el único dato de contacto que compartimos. Cuando alguien con sesión iniciada pulsa «Escribir por WhatsApp» en uno de tus avisos, se abre un chat contigo con el enlace del aviso; Driftler no lee ni guarda esa conversación. Tu correo nunca se muestra.',
        'Cada persona decide si responde y con quién se junta o contrata. **Antes de pagar o viajar, verifica el lugar y a la persona** y desconfía de los pedidos de dinero por adelantado. Usa el criterio y los consejos de la página «Cómo funciona».',
        'Para evitar abusos, limitamos la cantidad de contactos por persona al día y registramos que se hizo un contacto (quién y sobre qué aviso), sin guardar el mensaje.',
      ],
    },
    {
      id: 'moderacion',
      title: 'Moderación y reportes',
      blocks: [
        'Cualquier persona con sesión puede **reportar** un aviso. El equipo de Driftler revisa los reportes y puede, a su criterio y sin aviso previo, eliminar avisos, quitar contenido o suspender cuentas que incumplan estos Términos o la ley.',
        'Las personas administradoras pueden **eliminar** avisos, pero no editarlos: lo que ves publicado es lo que escribió quien lo creó.',
      ],
    },
    {
      id: 'cierre-cuenta',
      title: 'Cerrar tu cuenta',
      blocks: [
        'Puedes pedir la eliminación de tu cuenta desde «Editar perfil». Eliminaremos tu cuenta, tus avisos, tus fotos y tus favoritos en un plazo de **hasta 5 días**; mientras tanto tus avisos dejan de mostrarse y puedes cancelar la solicitud.',
        'Nosotros también podemos suspender o cerrar cuentas que incumplan estos Términos.',
      ],
    },
    {
      id: 'gratuidad',
      title: 'Costo del servicio',
      blocks: [
        (ADS ? 'Driftler es gratis para las personas usuarias y se financia con publicidad de terceros (Google AdSense). Esos anuncios no son avisos de Driftler ni los respaldamos, y no debes tratarlos como recomendaciones. ' : 'Driftler es gratis para las personas usuarias. ') + 'Si en el futuro agregamos funciones de pago, lo anunciaremos con al menos [[30]] días de anticipación y nada de lo que hoy es gratis pasará a ser de pago sin avisarte antes.',
      ],
    },
    {
      id: 'responsabilidad',
      title: 'Responsabilidad',
      blocks: [
        'Ofrecemos Driftler «tal como está»: hacemos lo posible por mantenerlo disponible y seguro, pero no garantizamos que funcione sin interrupciones ni errores, ni la veracidad, calidad o legalidad de los avisos.',
        'En la medida que la ley lo permita, Driftler no responde por los daños o pérdidas que resulten de acuerdos, pagos, viajes o encuentros entre personas usuarias, ni por el contenido que publican terceros. [[REVISAR CON UN ABOGADO: límites de responsabilidad según la ley de tu país y derechos irrenunciables del consumidor.]]',
        '**Límite de responsabilidad.** En la medida que la ley lo permita, la responsabilidad total de Driftler frente a ti por cualquier reclamo relacionado con el servicio no superará [[US$ 100]] (como el servicio es gratis, no hay pagos que reembolsar), y Driftler no responde por daños indirectos, lucro cesante ni pérdida de oportunidades de trabajo o alojamiento. Esto no limita la responsabilidad que la ley no permita limitar, como la derivada de dolo o culpa grave, ni tus derechos como consumidor.',
      ],
    },
    {
      id: 'propiedad',
      title: 'Propiedad intelectual de Driftler',
      blocks: [
        'El nombre Driftler, su logo, el diseño del sitio, los textos propios y el software son de Driftler o de quienes nos los licencian. No puedes copiarlos ni usarlos de forma que sugiera una relación con nosotros sin permiso.',
      ],
    },
    {
      id: 'cambios',
      title: 'Cambios en estos Términos',
      blocks: [
        'Podemos actualizar estos Términos. Cuando el cambio sea importante te pediremos aceptarlo de nuevo al entrar a tu cuenta. La versión vigente y su fecha están al inicio de esta página.',
      ],
    },
    {
      id: 'ley',
      title: 'Ley aplicable',
      blocks: [
        'Estos Términos se rigen por las leyes de [[PAÍS]], sin perjuicio de los derechos que la ley de tu país de residencia te reconozca como consumidor.',
        'Si tienes dudas o quieres reportar algo, escríbenos desde **Contacto**.',
      ],
    },
    {
      id: 'disputas',
      title: 'Cómo resolvemos los conflictos',
      blocks: [
        '**Primero, hablemos.** Antes de iniciar cualquier reclamo, escríbenos desde **Contacto** y danos [[30]] días para resolverlo.',
        '**Arbitraje.** Si no lo resolvemos, cualquier disputa entre tú y Driftler se resolverá de forma individual mediante arbitraje ante [[INSTITUCIÓN DE ARBITRAJE]], con sede en [[CIUDAD / PAÍS]] y en idioma español, en lugar de ir a tribunales. Puedes acudir a un tribunal de menor cuantía o de reclamos pequeños si tu caso califica.',
        '**Sin demandas colectivas.** En la medida que la ley lo permita, ambas partes renuncian a participar como demandantes o integrantes de una demanda colectiva o representativa contra la otra.',
        '**Lo que no se puede renunciar.** Nada de esto limita los derechos que la ley te garantice como consumidor, ni tu derecho a acudir a las autoridades de protección de datos o del consumidor de tu país, ni obliga a nadie a arbitrar donde la ley lo prohíba (por ejemplo, en muchos países un consumidor no puede ser obligado a renunciar a los tribunales de su domicilio).',
        '[[REVISAR CON UN ABOGADO: el arbitraje obligatorio y la renuncia a demandas colectivas son habituales en EE. UU., pero suelen no ser válidos frente a consumidores de la UE, Chile y otros países. Decide si los mantienes o los reemplazas por tribunales de tu domicilio.]]',
      ],
    },
  ],
};
