# 🛠️ GUÍA MAESTRA: CONSTRUCCIÓN DEL BACKEND PARA WOHO

Este documento es tu hoja de ruta para construir la API REST (Node.js + Express + PostgreSQL) que dará vida real al Frontend de WOHO. Guárdalo y consúltalo a medida que avanzas en el nuevo proyecto.

---

## 1. TABLAS PRINCIPALES (Base de Datos PostgreSQL)
Éste es el esquema SQL oficial con el que trabajará WOHO. Guíate por estas columnas y sus tipos de datos al crear tus migraciones:

* **`users`**: `id` (SERIAL PK), `name` (VARCHAR), `email` (VARCHAR UNIQUE), `password` (VARCHAR), `avatar_url` (TEXT), `phone_whatsapp` (VARCHAR), `instagram_handle` (VARCHAR), `facebook_url` (TEXT), `role` (VARCHAR DEFAULT 'user'), `created_at` (TIMESTAMP).
* **`countries`**: `id` (SERIAL PK), `name` (VARCHAR), `flag` (VARCHAR), `description` (TEXT), `image_url` (TEXT).
* **`cities`**: `id` (SERIAL PK), `country_id` (INTEGER FK), `name` (VARCHAR).
* **`categories`**: `id` (SERIAL PK), `name` (VARCHAR). *(Ej: Trabajo, Alojamiento, Social, Otro)*.
* **`posts`**: `id` (SERIAL PK), `user_id` (INTEGER FK), `category_id` (INTEGER FK), `country_id` (INTEGER FK), `city_id` (INTEGER FK), `title` (VARCHAR), `description` (TEXT), `price` (DECIMAL), `images` (JSONB), `duration_days` (INTEGER), `expires_at` (TIMESTAMP), `is_active` (BOOLEAN), `is_pinned` (BOOLEAN DEFAULT false), `created_at` (TIMESTAMP). *(Nota: Si un Admin crea un post sin expiración, "duration_days" y "expires_at" pueden ser almacenados como NULL)*.
* **`favorites`**: `id` (SERIAL PK), `user_id` (INTEGER FK), `post_id` (INTEGER FK). *(Con constraint UNIQUE para user_id + post_id)*.
* **`user_follows`**: `id` (SERIAL PK), `user_id` (INTEGER FK), `country_id` (INTEGER FK), `city_id` (INTEGER FK), `created_at` (TIMESTAMP).

---

## 2. LISTA EXACTA DE ENDPOINTS (Rutas de la API)

### Autenticación
* `POST /api/auth/register` (Crea usuario, encripta clave con `bcryptjs`)
* `POST /api/auth/login` (Verifica clave, devuelve `Token JWT`)

### Usuarios (Perfil)
* `GET /api/users/me` (Devuelve info del perfil logueado usando el JWT)
* `PUT /api/users/me` (Actualiza nombre, avatar, etc.)

### Posts (Avisos)
* `POST /api/posts` (Crea un aviso, inyectando silenciosamente el `user_id` desde el Token JWT)
* `GET /api/posts` (Lista avisos públicamente. Debe leer `req.query` para aplicar filtros SQL como `WHERE countries.name = $1`. ¡Recuerda hacer JOIN con categories, countries y cities!)
* `GET /api/posts/feed` (La vista "Para Ti". Exige JWT. Lee de la tabla de seguimiento `user_follows` y hace JOIN con los posts respectivos)
* `GET /api/posts/:id` (Trae los detalles completos de 1 solo post, cruzado con users, categories, countries y cities)
* `PUT /api/posts/:id` (Edita el post, EXIGIENDO que el JWT coincida con user_id)
* `DELETE /api/posts/:id` (Borra el post. Requiere ser el dueño, o tener rol 'admin' / 'superadmin')

### Categorías, Destinos y Ciudades
* `GET /api/categories` (Ruta básica que hace `SELECT * FROM categories`).
* `GET /api/countries` (Ruta básica que hace `SELECT * FROM countries`).
* `GET /api/cities` (Devuelve ciudades. Puedes filtrar por `?country_id=X`).

### Favoritos
* `POST /api/users/me/favorites/:postId` (Hace un `INSERT` en la tabla puente)
* `DELETE /api/users/me/favorites/:postId` (Elimina la fila en la tabla puente)

---

## 3. ESTRUCTURA DE CARPETAS SUGERIDA (Tu Nuevo Proyecto)
Trata de organizar tu nuevo proyecto vacío (el Backend) con este patrón MVC para mantenerlo limpio:

```text
/woho-backend
 ├── /config
 │    └── db.js          # Conexión principal a PostgreSQL (pool de de la librería 'pg')
 ├── /controllers        # La lógica (ej: postController.js con los SELECT / INSERT)
 ├── /middlewares        # Defensas (ej: verifyToken.js para usuarios, y verifyAdmin.js para superusuarios)
 ├── /routes             # Las URLs (ej: posts.routes.js donde mapeas /api/posts al controller)
 ├── index.js            # Punto de entrada de Express (app.listen)
 ├── .env                # Tus secretos (DB_PASSWORD, JWT_SECRET, PORT)
 └── package.json
```

---

## 4. LO QUE CUESTA MÁS (⚠️ ¡Cuidado con esto!)

1. **El Problema de CORS**: 
Tú tendrás el Frontend corriendo en el puerto `:5173` y el Backend en el `:3000`. De forma natural, los navegadores **bloquean** que el `5173` le hable al `3000` por seguridad.
**Solución**: Instalar la librería `cors` en el backend y habilitarla en `index.js` (`app.use(cors())`).

2. **Proteger Rutas**: 
No repitas la verificación de Token (JWT) en cada función. Crea un *Middleware* (una función interceptora). Cuando alguien intente hacer `DELETE /api/posts/5`, esa petición pasará primero por el middleware. Si el Token es falso o no existe, el middleware responde `Error 401` y la orden de borrar nunca llega al Controlador.

3. **Subida de Imágenes**: 
Por ahora el Frontend tiene URLs de internet de prueba. En la vida real, necesitarás configurar `Multer` para recibir archivos por la API, o mucho mejor, integrar el servicio **Cloudinary** para subir las fotos temporales.
