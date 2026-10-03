import React from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem, Button } from '@heroui/react';
import { Search, Users, Star, Send } from '../components/ui/icons';
import Stamp from '../components/ui/Stamp';
import { useUser } from '../context/UserContext';

// Cada paso es una tarjeta con su bloque de color. Todo lo que dice coincide
// con lo que la app hace hoy; si cambia el producto, cambia este texto.
const STEPS = [
  {
    Icon: Search,
    title: 'Explora sin cuenta',
    block: 'bg-ws-tomato text-ws-ink',
    body: 'Entra a Explorar y recorre los anuncios más recientes de la comunidad. Filtra por categoría o busca por palabra clave o ciudad. Sin cuenta ves el anuncio completo; el nombre de quien lo publica queda oculto.',
    cta: { to: '/feed', label: 'Explorar anuncios' },
  },
  {
    Icon: Users,
    title: 'Crea tu cuenta',
    block: 'bg-ws-ocean text-ws-paper-light',
    body: 'Es gratis y toma un minuto: nombre, correo y contraseña. Con tu cuenta puedes guardar anuncios, seguir destinos y contactar a quien publica.',
    cta: { to: '/register', label: 'Crear mi cuenta', authHidden: true },
  },
  {
    Icon: Star,
    title: 'Sigue destinos y guarda lo que te interesa',
    block: 'bg-ws-teal text-ws-ink',
    body: 'En Destinos elige un país y pulsa «Seguir destino»: tu sección «Para ti» mostrará lo último de los lugares que sigues. Guarda anuncios con la estrella y los encuentras en tu perfil, en Favoritos.',
    cta: { to: '/destinos', label: 'Ver destinos' },
  },
  {
    Icon: Send,
    title: 'Contacta o publica',
    block: 'bg-ws-plum text-ws-paper-light',
    body: 'En un anuncio, pulsa «Escribir por WhatsApp»: se abre un chat con quien publica, con el aviso ya adjunto en el mensaje. ¿Tienes algo que ofrecer? Crea tu publicación con título, categoría, destino, descripción, hasta 5 fotos, los días que durará el aviso y tu WhatsApp.',
    cta: { to: '/new-post', label: 'Crear publicación', authOnly: true },
  },
];

const CATEGORIES = [
  { tag: 'ws-tag-blue', name: 'Alojamiento', text: 'Cuartos libres, casas rodantes y hostels para dividir la renta.' },
  { tag: 'ws-tag-tomato', name: 'Trabajo', text: 'Cosechas, hospitalidad o construcción, de viajero a viajero.' },
  { tag: 'ws-tag-olive', name: 'Social', text: 'Compañeros de roadtrip, autos a medias y planes para conocer gente.' },
  { tag: 'ws-tag-ink', name: 'Otro', text: 'Todo lo demás que le sirva a otro viajero.' },
];

const TIPS = [
  'Antes de pagar nada, conoce el lugar o habla por videollamada con quien publica.',
  'Desconfía de quien pide dinero por adelantado, depósitos sin contrato o cobros por darte un trabajo.',
  'Pide fotos, dirección y condiciones por escrito, y cuéntale tu plan a alguien de confianza.',
];

const FAQ = [
  ['¿Tiene costo?', 'Crear la cuenta y usar WOHO es gratis.'],
  ['¿Qué datos míos se comparten?', 'Solo tu WhatsApp, y únicamente a quien tiene sesión iniciada y pulsa «Escribir por WhatsApp» en uno de tus anuncios. Tu correo nunca se muestra. Sin sesión no se ve ni quién publica. Puedes cambiar tu número desde tu perfil.'],
  ['¿Cuánto dura un anuncio?', 'Lo eliges tú al publicar, en días. Cuando vence, deja de aparecer en Explorar.'],
  ['¿Puedo editar o borrar mi anuncio?', 'Sí. En tu perfil, dentro de «Mis avisos», puedes editar o eliminar tus publicaciones.'],
  ['¿Cómo aviso de un anuncio sospechoso?', 'Abre el anuncio y pulsa «Reportar». Llega al equipo de WOHO, que puede eliminarlo. Para otras dudas, usa la página de Contacto.'],
  ['¿Qué destinos hay?', 'Los de la sección Destinos. Allí entras a cada país, ves sus anuncios y puedes seguirlo.'],
];

const ComoFunciona = () => {
  const { isAuthenticated } = useUser();

  return (
    <div className="flex flex-col gap-16 md:gap-24 -mb-16">

      <header className="relative grid md:grid-cols-12 gap-8 items-end pt-2">
        <h1 className="md:col-span-7 font-display text-6xl sm:text-7xl xl:text-8xl">
          Cómo funciona <em className="text-ws-accent">WOHO</em>
        </h1>
        <p className="md:col-span-5 lg:pr-28 font-cuerpo text-lg md:text-xl leading-relaxed text-ws-ink/90">
          Un tablón de avisos hecho por viajeros. Encuentra, guarda y publica en cuatro pasos.
        </p>
        <Stamp variant="round" center={['WOHO']} top="WORKING HOLIDAY" bottom="PASO A PASO" rotate={-10} className="hidden lg:block absolute -top-4 right-0 w-28 text-ws-plum" />
      </header>

      <ol className="flex flex-col gap-6 list-none p-0 m-0">
        {STEPS.map(({ Icon, title, block, body, cta }, i) => {
          if (cta.authOnly && !isAuthenticated) cta = { to: '/register', label: 'Crear mi cuenta' };
          const showCta = !(cta.authHidden && isAuthenticated);
          return (
            <li key={title} className="ws-surface grid md:grid-cols-[14rem_1fr] overflow-hidden">
              <div className={`${block} flex md:flex-col items-center md:items-start justify-between gap-4 p-6 md:p-8`}>
                <span className="font-display text-7xl md:text-9xl leading-none" aria-hidden="true">{i + 1}</span>
                <Icon className="w-10 h-10 md:w-12 md:h-12" aria-hidden="true" />
              </div>
              <div className="p-6 md:p-8 flex flex-col gap-4 justify-center">
                <h2 className="font-display text-4xl md:text-5xl">
                  <span className="sr-only">Paso {i + 1}: </span>{title}
                </h2>
                <p className="font-cuerpo text-lg leading-relaxed max-w-2xl text-ws-ink/90">{body}</p>
                {showCta && (
                  <div>
                    <Button as={Link} to={cta.to} radius="sm" className="ws-btn ws-btn-ink h-11 px-6">
                      {cta.label}
                    </Button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="que-publicar" className="space-y-8">
        <h2 id="que-publicar" className="font-display text-5xl md:text-7xl">
          Qué puedes <em className="text-ws-accent">publicar</em>
        </h2>
        <ul className="grid sm:grid-cols-2 gap-4 list-none p-0 m-0">
          {CATEGORIES.map(({ tag, name, text }) => (
            <li key={name} className="ws-surface p-5 flex flex-col gap-3">
              <span className={`ws-tag ${tag} self-start`}>{name}</span>
              <p className="font-cuerpo text-ws-ink/90 leading-relaxed">{text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="consejos" className="ws-band ws-band-ink ws-bleed py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-12 gap-10 relative">
          <h2 id="consejos" className="md:col-span-5 font-display text-5xl md:text-7xl">
            Para viajar <em className="text-ws-mustard">tranquilo</em>
          </h2>
          <ul className="md:col-span-7 list-none p-0 m-0 flex flex-col divide-y divide-ws-paper-light/25">
            {TIPS.map((t) => (
              <li key={t} className="py-4 first:pt-0 font-cuerpo text-lg md:text-xl leading-relaxed">{t}</li>
            ))}
          </ul>
          <Stamp solid variant="oval" center="CUÍDATE" bottom="CONSEJOS" rotate={-6} className="hidden lg:block absolute left-6 bottom-0 w-36 text-ws-mustard" />
        </div>
      </section>

      <section aria-labelledby="preguntas" className="space-y-8">
        <h2 id="preguntas" className="font-display text-5xl md:text-7xl">
          Preguntas <em className="text-ws-accent">frecuentes</em>
        </h2>
        <Accordion
          variant="splitted"
          selectionMode="multiple"
          itemClasses={{
            base: "ws-surface !shadow-none px-2",
            title: "font-bold text-lg",
            trigger: "min-h-14 py-3",
            content: "pb-5 font-cuerpo text-lg leading-relaxed text-ws-ink/90",
          }}
        >
          {FAQ.map(([q, a]) => (
            <AccordionItem key={q} aria-label={q} title={q}>{a}</AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="ws-band ws-band-teal ws-bleed py-14 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid md:grid-cols-[1fr_auto] gap-8 items-center">
          <h2 className="font-display text-5xl md:text-7xl">¿Listo para <em>empezar?</em></h2>
          <Button
            as={Link}
            to={isAuthenticated ? '/new-post' : '/register'}
            size="lg"
            radius="sm"
            className="ws-btn ws-btn-ink h-14 px-8 text-lg w-full md:w-auto"
          >
            {isAuthenticated ? 'Crear publicación' : 'Crear mi cuenta'}
          </Button>
        </div>
      </section>

    </div>
  );
};

export default ComoFunciona;
