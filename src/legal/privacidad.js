// Política de Privacidad de WOHO — BORRADOR. Mismo formato que terminos.js.
// Debe mantenerse al día con lo que la aplicación realmente hace con los datos.
export const PRIVACIDAD = {
  title: 'Política de Privacidad',
  intro:
    'Aquí te contamos qué datos tuyos guardamos, para qué, con quién los compartimos y cómo puedes controlarlos. Intentamos pedir lo mínimo.',
  sections: [
    {
      id: 'responsable',
      title: 'Quién es responsable de tus datos',
      blocks: [
        '[[NOMBRE COMPLETO O RAZÓN SOCIAL DEL TITULAR]] ([[RUT / DNI / IDENTIFICACIÓN]]), con domicilio en [[DIRECCIÓN, CIUDAD Y PAÍS]]. Contacto para temas de privacidad: [[CORREO DE CONTACTO]].',
      ],
    },
    {
      id: 'datos',
      title: 'Qué datos guardamos',
      blocks: [
        {
          list: [
            '**Cuenta:** nombre, correo y contraseña (la contraseña se guarda cifrada; nosotros no podemos leerla).',
            '**Perfil (opcional):** foto, biografía y número de WhatsApp. El WhatsApp es obligatorio para publicar.',
            '**Tu actividad:** los avisos que publicas (texto, fotos, país, ciudad, categoría y duración), tus favoritos y los destinos que sigues.',
            '**Contactos:** cuando pulsas «Escribir por WhatsApp» registramos quién contactó y sobre qué aviso, con la fecha. No guardamos el mensaje.',
            '**Reportes y mensajes:** lo que nos escribes en un reporte o en el formulario de Contacto, junto con tu nombre y correo.',
            '**Aceptación de términos:** la fecha y la versión que aceptaste.',
            '**Datos técnicos:** los registros del servidor pueden incluir tu dirección IP y datos del navegador, y los usamos solo para seguridad y para limitar abusos.',
          ],
        },
        'No pedimos datos sensibles (salud, religión, etc.). Te pedimos no incluirlos en tus avisos.',
      ],
    },
    {
      id: 'para-que',
      title: 'Para qué los usamos',
      blocks: [
        {
          list: [
            'Crear y mantener tu cuenta, y mostrar tus avisos.',
            'Permitir que otras personas con sesión te contacten por WhatsApp.',
            'Moderar el sitio, atender reportes y mensajes, y prevenir fraude y abusos.',
            'Enviarte correos del servicio, como el enlace para recuperar tu contraseña. No enviamos publicidad.',
            'Cumplir obligaciones legales.',
          ],
        },
        'Nos basamos en la ejecución del servicio que pides al crear tu cuenta, en tu consentimiento (por ejemplo, al aceptar estos textos y compartir tu WhatsApp) y en nuestro interés legítimo de mantener el sitio seguro. [[AJUSTAR LAS BASES LEGALES SEGÚN LA LEY DE TU PAÍS.]]',
      ],
    },
    {
      id: 'que-ven-otros',
      title: 'Qué ven otras personas',
      blocks: [
        {
          list: [
            '**Sin sesión:** el contenido del aviso (título, texto, fotos, lugar, categoría y vencimiento). No se muestra quién lo publicó ni ningún dato de contacto.',
            '**Con sesión:** además, tu nombre y tu foto como autor del aviso.',
            '**Tu WhatsApp** solo se usa para abrir el chat cuando alguien con sesión pulsa «Escribir por WhatsApp» en uno de tus avisos. **Tu correo nunca se muestra** a otras personas.',
            'El enlace de un aviso, al compartirse, genera una tarjeta con su título, resumen y primera foto (por ejemplo en WhatsApp).',
          ],
        },
      ],
    },
    {
      id: 'terceros',
      title: 'Con quién compartimos datos',
      blocks: [
        'Usamos proveedores que tratan datos por encargo nuestro y solo para prestar el servicio:',
        {
          list: [
            '**Cloudinary** — almacenamiento y entrega de fotos.',
            '**Resend** — envío de correos del servicio.',
            '**[[PROVEEDOR DE HOSTING DEL SITIO]]** y **[[PROVEEDOR DE LA BASE DE DATOS]]** — alojamiento de la aplicación y de los datos.',
            '**WhatsApp (Meta)** — cuando una persona abre el chat; esa conversación ocurre en WhatsApp y se rige por sus condiciones, no por las de WOHO.',
          ],
        },
        'No vendemos tus datos. Podemos entregarlos si una autoridad competente nos lo exige conforme a la ley.',
        'Algunos de estos proveedores tienen servidores fuera de tu país [[CONFIRMAR UBICACIONES]]; en ese caso procuramos que ofrezcan garantías adecuadas.',
      ],
    },
    {
      id: 'conservacion',
      title: 'Cuánto tiempo los guardamos',
      blocks: [
        {
          list: [
            'Tu cuenta y sus datos, mientras la mantengas. Los avisos dejan de mostrarse al vencer, pero quedan en tu cuenta hasta que los elimines.',
            'Si pides eliminar tu cuenta, la borramos junto con tus avisos, fotos y favoritos en un plazo de **hasta 5 días**. Quedará solo una constancia de la solicitud, sin tu nombre ni tu correo.',
            'Las copias de seguridad del proveedor pueden conservar datos hasta [[30]] días más antes de borrarse por completo.',
            'Reportes y mensajes de contacto: [[12]] meses, o más si hay un trámite abierto.',
            'Códigos para recuperar contraseña: se invalidan a la hora de crearse o al usarse.',
          ],
        },
      ],
    },
    {
      id: 'derechos',
      title: 'Tus derechos y cómo ejercerlos',
      blocks: [
        'Puedes pedir acceso a tus datos, corregirlos, eliminarlos, oponerte a ciertos usos y recibir una copia. Desde la app puedes:',
        {
          list: [
            'Editar tu nombre, foto, biografía y WhatsApp en **Editar perfil**.',
            'Eliminar tus avisos cuando quieras.',
            'Pedir la **eliminación de tu cuenta** al final de «Editar perfil».',
          ],
        },
        'Para lo demás (por ejemplo, una copia de tus datos) escríbenos desde **Contacto** o a [[CORREO DE CONTACTO]] y respondemos en un plazo de [[30]] días. Si crees que no tratamos bien tus datos, también puedes acudir a la autoridad de protección de datos de tu país.',
      ],
    },
    {
      id: 'cookies',
      title: 'Cookies y almacenamiento',
      blocks: [
        'WOHO no usa cookies de publicidad ni de seguimiento. Guardamos en tu navegador (almacenamiento local) lo necesario para mantener tu sesión y recordar pequeñas preferencias, como la posición en el listado o que ya viste una guía. Puedes borrarlo desde tu navegador; si lo haces tendrás que volver a iniciar sesión.',
      ],
    },
    {
      id: 'seguridad',
      title: 'Seguridad',
      blocks: [
        'Cifrado de contraseñas, conexión segura (HTTPS), accesos limitados al panel de administración y límites contra abusos. Ningún sistema es infalible: si ocurriera una brecha que te afecte, te lo informaremos como corresponda.',
      ],
    },
    {
      id: 'menores',
      title: 'Menores de edad',
      blocks: [
        'WOHO no está dirigida a menores de [[18]] años. Si descubrimos una cuenta de una persona menor, la eliminaremos.',
      ],
    },
    {
      id: 'cambios',
      title: 'Cambios en esta política',
      blocks: [
        'Si cambiamos cómo tratamos tus datos, actualizaremos esta página y, cuando el cambio sea importante, te pediremos aceptarlo al entrar a tu cuenta.',
      ],
    },
  ],
};
