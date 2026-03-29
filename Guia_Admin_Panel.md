# 🛡️ GUÍA MAESTRA: PANEL DE ADMINISTRADOR (Backend)

Al construir tu Panel de Administración (SuperAdmin Toolbar), vas a requerir crear un ecosistema de APIs exclusivas y fuertemente protegidas en tu backend.

Estas rutas **SOLO** deben responder si el Token JWT enviado por el Frontend contiene el campo `role: 'admin'` o `role: 'superadmin'`.

---

## 1. RUTAS CRUD NUEVAS PARA EL PANEL (Endpoints de Admin)

### 👥 Gestión de Usuarios
Un Admin debe poder ver a todos los registrados, degradarlos, elevarlos o banearlos (eliminarlos).
* `GET /api/admin/users` -> Trae la lista completa de todos los usuarios registrados (id, nombre, email, fecha de registro, is_active).
* `PUT /api/admin/users/:id/role` -> Cambia el nivel de un usuario (Ej: Promover un 'user' a 'admin').
* `PUT /api/admin/users/:id/ban` -> **(Soft Delete - Implementado en FR)** Invierte el Booleano `is_active` (true/false). Así le bloqueas la sesión al usuario pero no pierdes sus registros ni historia en tu base de datos.
* `DELETE /api/admin/users/:id` -> Banea/Elimina totalmente al usuario de WOHO de forma definitiva (No recomendado si se usa Soft Delete).

### 🌍 Gestión de Países (Destinos)
* `POST /api/admin/countries` -> Añade un nuevo país a la base de datos (Recibe nombre, flag_emoji, descripción y foto).
* `PUT /api/admin/countries/:id` -> Actualiza los datos o cambia el banner de un país existente.
* `DELETE /api/admin/countries/:id` -> Elimina un país. *(Ojo: en tu BD pusiste `DELETE SET NULL` para posts si un país se borra, lo cual es excelente).*

### 🏙️ Gestión de Ciudades
* `POST /api/admin/cities` -> Añade una nueva ciudad anclada a un País (`country_id`).
* `PUT /api/admin/cities/:id` -> Corrige el nombre de una ciudad (ej: Si alguien la creó con mala ortografía).
* `DELETE /api/admin/cities/:id` -> Elimina una ciudad.

### 🗂️ Gestión de Categorías
* `POST /api/admin/categories` -> Permite al admin crear nuevas ramas (Ej: Añadir la categoría "Voluntariados").
* `DELETE /api/admin/categories/:id` -> Elimina una categoría.

### 🚨 Moderación Global de Posts (Avisos)
* `GET /api/admin/posts` -> A diferencia del Feed normal, el admin ve **TODOS** los posts, listados cronológicamente, incluyendo los inactivos/expirados.
* `POST /api/admin/posts` -> Permite al admin crear directamente un aviso "Sin Expiración" (Insertando SQL con valor `duration_days = null` y `expires_at = null`).
* `PUT /api/admin/posts/:id/pin` -> Fija/Desfija un post (`is_pinned: true`). Esto cambia las reglas del Feed público para que este post en DB se traiga de número 1 usando un `ORDER BY is_pinned DESC, created_at DESC`.
* `DELETE /api/admin/posts/:id` -> Borrado de posts (moderación de spam o anuncios inapropiados) saltándose la validación del "dueño".

---

### 📊 Dashboard de Métricas (Estadísticas VIP)
* `GET /api/admin/stats` -> **(Implementado en FR)** Devuelve conteos matemáticos con cruces de datos para alimentar las tarjetas con: "Usuarios Totales", "Países Creados", "País Destacado" (más posts) y "Avisos Activos" (total posts). Permite dar un pantallazo rápido a la salud de la plataforma.

---

## 2. OTRAS FUNCIONALIDADES ÉPICAS AÚN POR IMPLEMENTAR
Cuando armes tu panel al completo, puedes plantear el desarrollo de estas funciones VIP sobrantes:

1. **Aprobar / Rechazar Publicaciones Automáticamente:**
   * Al crear un nuevo Post, podrías forzar a que todos nazcan con status "Pendiente" y obligar a que el admin los lea rápido para hacer clic en el botón verde "Aprobar", transformando el `status` a "Activo", apareciendo entonces en el Explorador global del público.
