# 📘 Guía CRUD Backend: Settings de Usuario y Categorías ADMIN

Esta guía documenta las rutas que deben crearse en el backend (Node.js/Express con PostgreSQL) para soportar las nuevas funcionalidades que acabamos de agregar al Frontend: Edición de Perfil de Usuario y Gestión de Categorías para Administradores.

---

## 📸 1. Edición de Perfil de Usuario (Frontend: `EditProfile.jsx`)

Para que el usuario pueda actualizar su nombre, biografía, enlace a Instagram y subir su foto de perfil, necesitamos ajustar la tabla y crear endpoints.

### Ajuste de Base de Datos
Debemos asegurar que la tabla `users` tenga las columnas necesarias. Puedes ejecutar esto en tu Base de Datos:
```sql
ALTER TABLE users ADD COLUMN bio TEXT;
```
*(Nota: `instagram_handle` y `name` ya existen en la tabla según revisamos).*

### A. Endpoint de Datos de Texto
*   **Ruta:** `PUT /api/users/me`
*   **Controlador actual (`updateMe`):** Solo acepta `name`. Debemos modificarlo para que acepte `name`, `bio` e `instagram_handle`.
*   **Permiso:** Cualquier usuario autenticado (`verifyToken`).
*   **Body de la petición:**
    ```json
    {
      "name": "Lucas Viajero",
      "bio": "Hola a todos, disfruto de viajar...",
      "instagram_handle": "@lucas"
    }
    ```
*   **Respuesta esperada:** El usuario actualizado (ej: `res.status(200).json(updatedUser.rows[0])`).

### B. Endpoint de Subida de Avatar (Foto de Perfil)
*   **Ruta:** `POST /api/users/me/avatar`
*   **Middlewares:** `verifyToken` y `uploadMiddleWare` (de multer, que ya tienes configurado en `middlewares/upload.middleware.js`).
*   **Lógica:** Multer tomará la imagen y la procesará en memoria. El controlador de Auth usando Cloudinary subirá el archivo y guardará la `secure_url` en la columna `avatar_url` del usuario correspondiente, retornando el link.

---

## 🗂️ 2. Gestión de Categorías (Frontend: Pestaña VIP)

Agregamos una pantalla administrativa para Crear y Borrar Categorías. Esto facilita que escales el proyecto en el futuro (ej. Añadiendo "Mascotas" o "Voluntariados", como pediste).

### A. Crear Categoría
*   **Ruta:** `POST /api/admin/categories`
*   **Middlewares:** `verifyToken`, `verifyRole` (para que solo `admin` o `superadmin` puedan acceder).
*   **Body:**
    ```json
    {
      "name": "Voluntariados"
    }
    ```
*   **Lógica en BD:**
    ```sql
    INSERT INTO categories (name) VALUES ($1) RETURNING *;
    ```
*   **Respuesta esperada:** Status `201` y un JSON con `{ id, name }`.

### B. Eliminar Categoría
*   **Ruta:** `DELETE /api/admin/categories/:id`
*   **Middlewares:** `verifyToken`, `verifyRole`.
*   **Lógica en BD:**
    ```sql
    DELETE FROM categories WHERE id = $1;
    ```
*   *(Ojo con restricciones FOREIGN KEY en los Posts. Te aconsejo no requerir Borrado en Cascada para no perder Posts, o bien setear `ON DELETE SET NULL` en la llave foránea de la tabla `posts`).*
*   **Respuesta esperada:** Status `200` y `{ message: "Categoría eliminada" }`.
