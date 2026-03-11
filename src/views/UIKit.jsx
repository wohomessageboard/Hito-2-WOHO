import { Card, CardHeader, CardBody, CardFooter, Divider, Link, Image, Chip, Avatar, Spinner, Button, Input } from '@heroui/react';
import { Star, Pencil, Trash2 } from 'lucide-react';

const UIKit = () => {
  return (
    <div className="min-h-screen bg-woho-white p-8 md:p-12">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Encabezado */}
        <div>
          <h1 className="text-5xl font-titulo font-black mb-4">WOHO UI Kit</h1>
          <p className="text-xl text-gray-600 font-cuerpo">
            Kit de elementos reutilizables para construir las interfaces. Mezcla utilidades de Tailwind con HeroUI.
          </p>
        </div>

        <hr className="border-[1.5px] border-woho-black" />

        {/* Sección: Tipografía */}
        <section>
          <h2 className="text-3xl font-titulo font-extrabold mb-6 flex items-center gap-4">
            <span className="bg-woho-purple text-woho-white w-10 h-10 flex items-center justify-center rounded-neo border-neo border-woho-black shadow-sm">1</span>
            Tipografía (Kanit & Albert Sans)
          </h2>
          <div className="space-y-4 p-6 bg-[#f4f4f4] rounded-neo border-neo border-woho-black shadow-sm">
            <h1 className="text-4xl font-titulo font-black">h1. Titulo Principal (Kanit Black)</h1>
            <h2 className="text-3xl font-titulo font-extrabold">h2. Subtitulo (Kanit ExtraBold)</h2>
            <p className="text-lg font-cuerpo">
              Párrafo base. Esta es la tipografía Albert Sans, muy limpia y de alta legibilidad, excelente para textos largos, descripciones y cuerpos de tarjetas.
            </p>
            <p className="text-lg font-cuerpo font-bold">
              Párrafo en negrita para resaltar cosas importantes.
            </p>
          </div>
        </section>

        {/* Sección: Botones */}
        <section>
          <h2 className="text-3xl font-titulo font-extrabold mb-6 flex items-center gap-4">
            <span className="bg-woho-orange text-woho-white w-10 h-10 flex items-center justify-center rounded-neo border-neo border-woho-black shadow-sm">2</span>
            NeoButtons (Botones)
          </h2>
          <div className="flex flex-wrap gap-6">
            <Button variant="solid" radius="md" className="font-bold bg-woho-purple text-white shadow-sm">Botón Primario</Button>
            <Button variant="solid" radius="md" className="font-bold bg-woho-orange text-white shadow-sm">Botón Secundario</Button>
            <Button variant="flat" radius="md" className="font-bold bg-gray-100 text-black shadow-sm">Botón Flat (Gris)</Button>
            <Button color="danger" variant="solid" radius="md" className="font-bold bg-red-500 text-white shadow-sm">Botón Peligro</Button>
          </div>
        </section>

        {/* Sección: Inputs & Formularios */}
        <section>
          <h2 className="text-3xl font-titulo font-extrabold mb-6 flex items-center gap-4">
            <span className="bg-yellow-400 text-woho-black w-10 h-10 flex items-center justify-center rounded-neo border-neo border-woho-black shadow-sm">3</span>
            NeoInput (Inputs de Texto)
          </h2>
          <div className="max-w-md space-y-6">
            <Input label="Nombre de Usuario" placeholder="Ej. jperez123" variant="bordered" radius="md" labelPlacement="inside" classNames={{ inputWrapper: "border-2 border-solid border-black" }} />
            <Input label="Correo Electrónico" type="email" placeholder="correo@ejemplo.com" variant="bordered" radius="md" labelPlacement="inside" classNames={{ inputWrapper: "border-2 border-solid border-black" }} />
            <Input label="Contraseña" type="password" placeholder="********" variant="bordered" radius="md" labelPlacement="inside" classNames={{ inputWrapper: "border-2 border-solid border-black" }} />
            <Button fullWidth variant="solid" radius="md" className="font-bold bg-woho-purple text-white shadow-sm">Ingresar</Button>
          </div>
        </section>

        {/* Sección: Tarjetas Minimalistas (HeroUI Original) */}
        <section>
          <h2 className="text-3xl font-titulo font-extrabold mb-6 flex items-center gap-4">
            <span className="bg-[#4ade80] text-woho-black w-10 h-10 flex items-center justify-center rounded-neo border-neo border-woho-black shadow-none">4</span>
            Cards (Minimalistas con HeroUI)
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="max-w-[400px] border-[2px] border-solid border-black rounded-neo shadow-sm bg-woho-white">
              <CardHeader className="flex gap-3">
                <Image
                  alt="heroui logo"
                  height={40}
                  radius="sm"
                  src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
                  width={40}
                />
                <div className="flex flex-col">
                  <p className="text-md font-titulo font-extrabold">HeroUI</p>
                  <p className="text-small text-default-500 font-cuerpo">heroui.com</p>
                </div>
              </CardHeader>
              <Divider className="bg-woho-black opacity-20" />
              <CardBody>
                <p className="font-cuerpo">
                  Haz sitios web hermosos independientemente de tu experiencia en diseño. 
                  Este componente usa la base de HeroUI con nuestros bordes de 2px y un shadow minimalista (shadow-sm) en vez de nuestra pesada sombra sólida.
                </p>
              </CardBody>
              <Divider className="bg-woho-black opacity-20" />
              <CardFooter>
                <Link isExternal showAnchorIcon href="https://github.com/heroui-inc/heroui" className="font-bold text-woho-purple">
                  Visitar código en GitHub.
                </Link>
              </CardFooter>
            </Card>
            <Card className="max-w-[400px] border-[2px] border-solid border-black rounded-neo shadow-sm bg-woho-white">
              <CardHeader className="justify-between">
                <div className="flex gap-3">
                  <Avatar isBordered radius="full" size="md" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" className="border-[1.5px] border-black" />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-sm font-titulo font-extrabold leading-none text-black">Lucas Viajero</h4>
                    <h5 className="text-xs font-cuerpo tracking-tight text-default-500">🇦🇺 Australia, Perth</h5>
                  </div>
                </div>
                <Chip size="sm" variant="flat" color="warning" className="font-bold text-xs">
                  Expira en 7 días
                </Chip>
              </CardHeader>
              <Divider className="bg-woho-black opacity-20" />
              <CardBody className="px-4 py-3">
                <h3 className="font-titulo font-extrabold text-lg mb-1 leading-tight text-woho-black">
                  Busco compañero/a para granja en Queensland 🚜
                </h3>
                <p className="text-sm font-cuerpo text-default-600 line-clamp-3">
                  Hola gente! Estoy por subir desde Brisbane hacia Bundaberg a hacer la temporada de mangos. Busco a alguien con auto para compartir los gastos de nafta y buscar alojamiento juntos. Escríbanme!
                </p>
              </CardBody>
              <Divider className="bg-woho-black opacity-20" />
              <CardFooter className="flex justify-between gap-2">
                <Button variant="solid" radius="md" size="sm" className="font-bold bg-woho-purple text-white shadow-sm w-3/4">
                  Contactar
                </Button>
                <Button variant="flat" radius="md" size="sm" className="w-1/4 min-w-0 px-0 flex justify-center items-center group bg-gray-100 hover:bg-yellow-100 transition-colors">
                  <Star className="text-gray-400 group-hover:text-yellow-500 transition-colors w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="max-w-[400px] border-[2px] border-solid border-black rounded-neo shadow-sm bg-woho-white">
              <CardHeader className="justify-between">
                <div className="flex gap-3">
                  <Avatar isBordered radius="full" size="md" src="https://i.pravatar.cc/150?u=a0425a1f4e" className="border-[1.5px] border-black" />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-sm font-titulo font-extrabold leading-none text-black">Sofía Gómez</h4>
                    <h5 className="text-xs font-cuerpo tracking-tight text-default-500">🇳🇿 Nueva Zelanda, Auckland</h5>
                  </div>
                </div>
                <Chip size="sm" variant="flat" color="danger" className="font-bold text-xs">
                  Expira en 24 horas
                </Chip>
              </CardHeader>
              <Divider className="bg-woho-black opacity-20" />
              <CardBody className="px-4 py-3 gap-3">
                <h3 className="font-titulo font-extrabold text-lg leading-tight text-woho-black">
                  Alquilo habitación doble céntrica 🏡
                </h3>
                
                {/* Cuadrícula de 4 fotos */}
                <div className="grid grid-cols-2 gap-2">
                  <img alt="Foto 1" className="object-cover h-24 w-full rounded-md border border-black/10" src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=300" />
                  <img alt="Foto 2" className="object-cover h-24 w-full rounded-md border border-black/10" src="https://images.unsplash.com/photo-1502672260266-1c1de2d93688?auto=format&fit=crop&q=80&w=300" />
                  <img alt="Foto 3" className="object-cover h-24 w-full rounded-md border border-black/10" src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=300" />
                  <img alt="Foto 4" className="object-cover h-24 w-full rounded-md border border-black/10" src="https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=300" />
                </div>

                <p className="text-sm font-cuerpo text-default-600 line-clamp-2">
                  Queda libre una habitación grande ideal para pareja a dos cuadras de Sky Tower. Totalmente amoblada.
                </p>
              </CardBody>
              <Divider className="bg-woho-black opacity-20" />
              <CardFooter className="flex justify-between gap-2">
                <Button variant="solid" radius="md" size="sm" className="font-bold bg-woho-purple text-white shadow-sm w-3/4">
                  Contactar
                </Button>
                <Button variant="flat" radius="md" size="sm" className="w-1/4 min-w-0 px-0 flex justify-center items-center group bg-gray-100 hover:bg-yellow-100 transition-colors">
                  <Star className="text-yellow-500 fill-current w-5 h-5" />
                </Button>
              </CardFooter>
            </Card>

            <Card className="max-w-[400px] border-[2px] border-solid border-black rounded-neo shadow-sm bg-woho-white">
              <CardHeader className="justify-between">
                <div className="flex gap-3">
                  <Avatar isBordered radius="full" size="md" src="https://i.pravatar.cc/150?u=current_user" className="border-[1.5px] border-black" />
                  <div className="flex flex-col gap-1 items-start justify-center">
                    <h4 className="text-sm font-titulo font-extrabold leading-none text-black">Mi Perfil (Creador)</h4>
                    <h5 className="text-xs font-cuerpo tracking-tight text-default-500">🇯🇵 Japón, Tokyo</h5>
                  </div>
                </div>
                <Chip size="sm" variant="flat" color="success" className="font-bold text-xs">
                  Expira en 10 días
                </Chip>
              </CardHeader>
              <Divider className="bg-woho-black opacity-20" />
              <CardBody className="px-4 py-3">
                <h3 className="font-titulo font-extrabold text-lg mb-1 leading-tight text-woho-black">
                  Vendo bicicleta usada en perfecto estado 🚲
                </h3>
                <p className="text-sm font-cuerpo text-default-600 line-clamp-3">
                  Me voy de Tokyo la semana que viene y vendo mi bici con canasto. Se retira por Shinjuku. Ideal para repartos o moverse por el barrio. Precio charlable.
                </p>
              </CardBody>
              <Divider className="bg-woho-black opacity-20" />
              <CardFooter className="flex justify-between gap-2">
                <Button variant="flat" radius="md" size="sm" className="w-1/2 font-bold bg-blue-100 text-blue-700 shadow-sm flex items-center gap-2">
                  <Pencil className="w-4 h-4" /> Editar
                </Button>
                <Button variant="flat" radius="md" size="sm" className="w-1/2 font-bold bg-red-100 text-red-600 shadow-sm flex items-center gap-2">
                  <Trash2 className="w-4 h-4" /> Eliminar
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Sección: Elementos HeroUI */}
        <section>
          <h2 className="text-3xl font-titulo font-extrabold mb-6 flex items-center gap-4">
            <span className="bg-blue-400 text-woho-black w-10 h-10 flex items-center justify-center rounded-neo border-neo border-woho-black shadow-sm">5</span>
            Integrando componentes HeroUI
          </h2>
          <div className="flex flex-wrap items-center gap-8 p-6 bg-white border-neo border-woho-black rounded-neo shadow-sm">
            
            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Chips (Estados de Expiración)</span>
              <div className="flex flex-col gap-2">
                <Chip size="sm" variant="flat" color="warning" className="font-bold text-xs">Expira en 7 días</Chip>
                <Chip size="sm" variant="flat" color="danger" className="font-bold text-xs">Expira en 24 horas</Chip>
                <Chip size="sm" variant="flat" color="success" className="font-bold text-xs">Expira en 10 días</Chip>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Chips (Filtros Feed)</span>
              <div className="flex flex-wrap gap-2 justify-center">
                <Chip variant="flat" color="primary" radius="md" className="font-bold cursor-pointer hover:bg-woho-purple hover:text-white transition-colors">Alojamiento</Chip>
                <Chip variant="flat" color="warning" radius="md" className="font-bold cursor-pointer hover:bg-warning hover:text-white transition-colors">Trabajo</Chip>
                <Chip variant="flat" color="success" radius="md" className="font-bold cursor-pointer hover:bg-success hover:text-white transition-colors">Social</Chip>
                <Chip variant="flat" color="default" radius="md" className="font-bold cursor-pointer">Otro</Chip>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Avatars</span>
              <div className="flex -space-x-3">
                <Avatar className="border-2 border-woho-black" src="https://i.pravatar.cc/150?u=a04258" />
                <Avatar className="border-2 border-woho-black" src="https://i.pravatar.cc/150?u=a04259" />
                <Avatar className="border-2 border-woho-black" src="https://i.pravatar.cc/150?u=a0425a" />
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="font-bold text-sm">Spinner (Carga)</span>
              <Spinner color="secondary" size="lg" />
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default UIKit;
