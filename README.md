# MyQRMenu Desarrollo de Aplicaciones Web

## Breve descripción

MyQRMenu es un sistema de gestión de menús digitales para restaurantes y bares. Los usuarios pueden crear y editar menús accesibles a través de códigos QR autogenerados. Es posible modificar precios, añadir secciones y publicar cambios de acuerdo a las necesidades del usuario.

## Índice

- [Instalación](#instalación)
- [Configuración de pruebas](#configuración-de-pruebas)
- [Uso](#documentacion-de-uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionamiento](#funcionamiento)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Posibles Mejoras](#posibles-mejoras)
- [Contacto](#contacto)

## Instalación

1. Asegúrate de tener instalado [pnpm](https://pnpm.io/installation).
2. Instala las dependencias del proyecto con el comando `pnpm install`.
3. Inicia la aplicación en modo desarrollo con el comando `pnpm dev`.

## Configuración de pruebas

**La aplicación hace uso de Docker para la base de datos de prueba. Asegúrate de tenerlo instalado y en funcionamiento antes de arrancar las pruebas**

1. Ejecuta el comando de inicialización `pnpm run setup:test-db`.

2. Ejecuta las pruebas `pnpm test`.

## Uso

Esta documentación describe cómo navegar y utilizar nuestra aplicación.

### Autenticación de Usuarios

Al llegar a la ruta raíz de la aplicación, se le presentará una pantalla de login.

- Autenticación como "USER": Redirige a la ruta `/menus`.
- Autenticación como "ADMIN": Redirige a la ruta `/admin`.

#### Para Usuarios (Role: USER)

**Ruta /menus**
Muestra el listado de menús creados por el usuario. Aquí los usuarios pueden:

1. Eliminar los menús.
2. Descargar el código asignado al menú.
3. Navegar a la ruta de edición del menú.

**Edición del Menú**
La edición del menú está subdivida en las siguientes subrutas:

- **/menus/:menuId**: Permite editar el título, subtítulo o la imagen del menú.
- **/menus/:menuId/sections**: Facilita la edición, adición, eliminación y cambio de posición de las secciones del menú.
- **/menus/:menuId/products**: Muestra el listado de productos del menú y permite su eliminación, navegación a la ruta de creación de un nuevo producto y la ruta de edición de un producto existente.
- **/menus/:menuId/products/:productId/edit**: Permite editar el nombre, descripción, precio, imagen y sección a la que pertenece el producto.
- **/menus/:menuId/products/new**: Facilita la creación de un nuevo producto para el menú.

#### Para Administradores (Role: ADMIN)

**Ruta /admin**
Muestra el listado de todos los usuarios y permite la edición del límite de creación de menús por usuario.

## Estructura del Proyecto

```
.
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── images/
├── public/
├── scripts/
└── src/
    ├── pages/
    ├── components/
    ├── styles/
    ├── utils/
    └── server/
        ├── api/
        ├── procedures/
        │   ├── admin/
        │   └── users/
        │       └── shared/
        └── services/

```

## Funcionamiento

### Código cliente

- **pages**: Cada archivo dentro de esta carpeta representa una ruta de la aplicación. Una carpeta especial llamada api define los endpoints RESTful API.

- **components**: Contiene todos los componentes React utilizados por las páginas.

- **styles**: Contiene valores predefinidos para colores y fuentes.

- **utils**: Contiene funciones de utilidad para el cliente.

### Código Servidor

- **server/api**: Contiene enrutadores tRPC que agrupan endpoints relacionados. Define también el contexto que será pasado a cada procedimiento tRPC a la hora de su ejecución.

- **server/procedures**: Se subdividen los casos de uso del administrador y de los usuarios. Cada subcarpeta contiene la lógica necesaria para un caso de uso en particular con archivos de tipo: .schema, .procedure, .behaviour, .types, .unit, .integration.

- **server/user/shared**: Contiene funciones que se reutilizan en los endpoints.

- **server/services**: Contiene la definición para las dependencias que serán utilizadas en el contexto de cada procedimiento.

Además, se definen las interfaces principales de la aplicación en **src/server/procedures/interfaces.ts**, la configuración para AuthJS en **src/server/procedures/auth.ts** y la configuración para Prisma en **src/server/procedures/db.ts.**

## Tecnologías Utilizadas

- Typescript (https://www.typescriptlang.org/)
- Next.js (https://nextjs.org/docs)
- Mantine Dev (https://mantine.dev/)
- Zod (https://zod.dev/)
- tRPC con ReactQuery (https://trpc.io/docs)
- Prisma ORM (https://www.prisma.io/docs)
- Cloudinary (https://cloudinary.com/)
- Vitest (https://vitest.dev/)

## Importante

Este proyecto solo tiene fines educativos.

## Posibles Mejoras

1. Se podría usar una arquitectura diferente para los esquemas ZOD de la aplicación.
   Idea: Crear un esquema zod base para cada entidad y componer con ellas los esquemas necesarios para cada endpoint, formularios, etc.
2. Se podría crear un Hook que acompañe a PublishButton con la finalidad de no tener que crear un estado para el error de publicación en cada componente Page.
3. Se podría mejorar la lógica de actualización de la caché para las rutas. De este modo no tenemos que invalidar la caché para la ruta y mejoramos el consumo de ancho de banda.
4. Se podría mejorar la tabla de productos. Añadir más opciones de filtrado o usar alguna librería para tablas (React Table).
5. Se podrían aplicar diversas mejoras a la responsividad y accesibilida del sitio.
6. Mejorar la configuración de las imagenes para una visualización más detallada de las imagenes.
7. Se debería añadir un modal de confirmación para "despublicar" ya que al hacerlo el cliente no verá ningún menú publicado.

## Contacto

email - juanma1331@gmail.com
