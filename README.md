# API REST - Clon de Instagram

Backend desarrollado con Node.js, Express y PostgreSQL para un clon de Instagram enfocado en publicaciones de gatos.

El proyecto permite registrar usuarios, iniciar sesión mediante autenticación con JWT, consultar publicaciones, crear publicaciones y administrar el perfil del usuario autenticado.

---

## Tecnologías utilizadas

* Node.js
* Express
* PostgreSQL
* `pg`
* JSON Web Tokens (JWT)
* `bcrypt`
* CORS
* Dotenv

---

## Arquitectura del proyecto

El proyecto utiliza una arquitectura por capas para separar las responsabilidades de cada parte de la aplicación.

```text
/
├── index.js
├── package.json
├── .env
├── .env.example
│
└── src/
    ├── app.js
    │
    ├── config/
    │   └── dbconfig.js
    │
    ├── controllers/
    │   ├── authcontroller.js
    │   ├── pubcontroller.js
    │   └── usercontroller.js
    │
    ├── database/
    │   └── dump-TP_09-202607030904.sql
    │
    ├── helpers/
    │   └── valHelpers.js
    │
    ├── middlewares/
    │   ├── valPost.js
    │   ├── valRegister.js
    │   ├── valUser.js
    │   └── verifyToken.js
    │
    ├── routes/
    │   ├── auth.js
    │   ├── publicaciones.js
    │   └── user.js
    │
    └── services/
        ├── authservice.js
        ├── pubservice.js
        └── userservice.js
```

### Funcionamiento de las capas

#### `config`

Contiene la configuración de conexión a la base de datos PostgreSQL. Las credenciales se obtienen mediante variables de entorno almacenadas en el archivo `.env`.

#### `routes`

Define las rutas principales de la API y las conecta con los controladores correspondientes.

#### `middlewares`

Contiene funciones que se ejecutan antes de llegar al controlador. Se utilizan para:

* Verificar tokens JWT.
* Validar datos de registro.
* Validar datos necesarios para crear publicaciones.

#### `controllers`

Reciben las peticiones HTTP, extraen la información necesaria de `req`, llaman a los servicios correspondientes y devuelven las respuestas HTTP.

#### `services`

Contienen la lógica de acceso a la base de datos. En esta capa se ejecutan las consultas SQL a PostgreSQL.

#### `app.js`

Inicializa Express, configura CORS y JSON, y registra las rutas principales de la aplicación.

---

## Base de datos

La aplicación utiliza PostgreSQL y cuenta con dos tablas principales:

### Tabla `usuario`

Almacena la información de las cuentas registradas.

| Campo             | Tipo        | Descripción                         |
| ----------------- | ----------- | ----------------------------------- |
| `id`              | `SERIAL`    | Identificador único del usuario     |
| `nombre_usuario`  | `CHARACTER` | Nombre de usuario                   |
| `nombre_completo` | `VARCHAR`   | Nombre completo                     |
| `email`           | `CHARACTER` | Correo electrónico                  |
| `password`        | `VARCHAR`   | Contraseña almacenada mediante hash |
| `biografia`       | `VARCHAR`   | Biografía del usuario               |
| `foto_perfil`     | `VARCHAR`   | URL de la foto de perfil            |

### Tabla `publicacion`

Almacena las publicaciones realizadas por los usuarios.

| Campo            | Tipo        | Descripción                           |
| ---------------- | ----------- | ------------------------------------- |
| `id`             | `SERIAL`    | Identificador único de la publicación |
| `usuariod_id`    | `INTEGER`   | Usuario propietario de la publicación |
| `url_imagen`     | `VARCHAR`   | URL de la imagen                      |
| `descripcion`    | `VARCHAR`   | Descripción de la publicación         |
| `likes`          | `INT`       | Cantidad de likes                     |
| `fecha_creacion` | `TIMESTAMP` | Fecha de creación                     |

### Relación entre las tablas

La relación entre `usuario` y `publicacion` es de tipo **One-to-Many**:

* Un usuario puede tener muchas publicaciones.
* Cada publicación pertenece a un único usuario.

La relación se establece mediante:

```text
publicacion.usuariod_id → usuario.id
```

Además, se utiliza:

```sql
ON DELETE CASCADE
```

Por lo tanto, si se elimina un usuario, también se eliminan sus publicaciones asociadas.

---

# Endpoints

## Autenticación

### POST `/api/auth/registro`

Registra un nuevo usuario.

### Tipo

Pública.

### Body esperado

```json
{
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Pérez",
  "email": "juan@email.com",
  "password": "123456",
  "biografia": "Amante de los gatos",
  "foto_perfil": "https://ejemplo.com/foto.jpg"
}
```

### Respuesta exitosa

**Código HTTP:** `201 Created`

```json
{
  "message": "Usuario registrado con éxito",
  "user": "gato_programador",
  "user_completo": "Juan Pérez",
  "email": "juan@email.com",
  "bio": "Amante de los gatos",
  "image": "https://ejemplo.com/foto.jpg"
}
```

La contraseña se almacena utilizando un hash generado mediante `bcrypt`.

---

### POST `/api/auth/login`

Permite iniciar sesión.

### Tipo

Pública.

### Body esperado

```json
{
  "nombre_usuario": "gato_programador",
  "password": "123456"
}
```

### Respuesta exitosa

**Código HTTP:** `200 OK`

```json
{
  "message": "Login successful",
  "token": "Bearer <JWT>",
  "user": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Juan Pérez",
    "email": "juan@email.com",
    "password": "<hash>",
    "biografia": "Amante de los gatos",
    "foto_perfil": "https://ejemplo.com/foto.jpg"
  }
}
```

El token generado tiene una duración de una hora.

---

# Publicaciones

### GET `/api/publicaciones`

Obtiene todas las publicaciones almacenadas en la base de datos.

### Tipo

Pública.

### Respuesta exitosa

**Código HTTP:** `200 OK`

```json
[
  {
    "id": 1,
    "usuariod_id": 1,
    "url_imagen": "https://ejemplo.com/gato.jpg",
    "descripcion": "Mi gato",
    "likes": 0,
    "fecha_creacion": "2026-07-03T12:00:00.000Z",
    "nombre_usuario": "gato_programador",
    "user_pfp": "https://ejemplo.com/perfil.jpg"
  }
]
```

Las publicaciones se ordenan por fecha de creación de forma descendente.

---

### POST `/api/publicaciones`

Crea una nueva publicación.

### Tipo

Protegida.

### Header requerido

```text
Authorization: Bearer <JWT>
```

### Body esperado

```json
{
  "url_imagen": "https://ejemplo.com/gato.jpg",
  "descripcion": "Mi gato programando"
}
```

El `usuariod_id` no se recibe desde el cliente. Se obtiene automáticamente desde el usuario identificado en el token JWT.

### Respuesta exitosa

**Código HTTP:** `201 Created`

```json
{
  "message": "Publicación creada con éxito",
  "post": {
    "id": 1,
    "url_imagen": "https://ejemplo.com/gato.jpg",
    "descripcion": "Mi gato programando",
    "likes": 0,
    "fecha_creacion": "2026-07-03T12:00:00.000Z",
    "usuariod_id": 1
  }
}
```

---

# Usuarios

### GET `/api/usuarios/perfil`

Obtiene la información del perfil del usuario autenticado y sus publicaciones.

### Tipo

Protegida.

### Header requerido

```text
Authorization: Bearer <JWT>
```

### Respuesta exitosa

**Código HTTP:** `200 OK`

```json
{
  "id": 1,
  "nombre_usuario": "gato_programador",
  "nombre_completo": "Juan Pérez",
  "email": "juan@email.com",
  "biografia": "Amante de los gatos",
  "foto_perfil": "https://ejemplo.com/perfil.jpg",
  "publications": [
    {
      "id": 1,
      "url_imagen": "https://ejemplo.com/gato.jpg",
      "descripcion": "Mi gato",
      "likes": 0,
      "fecha_creacion": "2026-07-03T12:00:00.000Z",
      "usuariod_id": 1
    }
  ]
}
```

El usuario se identifica dinámicamente mediante el `id` almacenado dentro del token JWT.

---

### PUT `/api/usuarios/perfil`

Permite editar los datos del perfil del usuario autenticado.

### Tipo

Protegida.

### Header requerido

```text
Authorization: Bearer <JWT>
```

### Body esperado

```json
{
  "nombre_completo": "Juan Pérez Actualizado",
  "biografia": "Nueva biografía",
  "foto_perfil": "https://ejemplo.com/nueva-foto.jpg"
}
```

### Respuesta exitosa

**Código HTTP:** `200 OK`

```json
{
  "message": "Perfil actualizado con éxito",
  "user": {
    "id": 1,
    "nombre_usuario": "gato_programador",
    "nombre_completo": "Juan Pérez Actualizado",
    "email": "juan@email.com",
    "foto_perfil": "https://ejemplo.com/nueva-foto.jpg",
    "biografia": "Nueva biografía"
  }
}
```

---

# Autenticación mediante JWT

La autenticación se realiza mediante JSON Web Tokens.

Después de un login exitoso, el servidor genera un token firmado utilizando la clave secreta almacenada en la variable de entorno:

```text
JWT_SECRET
```

El payload del token contiene únicamente los datos necesarios para identificar al usuario:

```json
{
  "id": 1,
  "nombre_usuario": "gato_programador"
}
```

El token tiene una duración de una hora:

```javascript
jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
```

Para acceder a las rutas protegidas, el cliente debe enviar el token en el header:

```text
Authorization: Bearer <token>
```

El middleware `verifyToken.js` realiza las siguientes acciones:

1. Comprueba que exista el header `Authorization`.
2. Comprueba que tenga el formato `Bearer <token>`.
3. Extrae el token.
4. Verifica su firma y validez mediante `jwt.verify()`.
5. Decodifica el payload.
6. Guarda la información del usuario en `req.user`.
7. Permite que la petición continúe hacia el controlador.

Si el token falta, es inválido o expiró, se devuelve:

```http
401 Unauthorized
```

---

# Variables de entorno

El proyecto utiliza un archivo `.env` para almacenar información sensible de la conexión a la base de datos y la clave secreta de JWT.

Ejemplo de `.env.example`:

```env
DB_HOST=localhost
DB_NAME=TP_09
DB_USER=postgres
DB_PASS=tu_contraseña
DB_PORT=5432

JWT_SECRET=tu_clave_secreta
```

El archivo `.env` no debe subirse al repositorio público.

---

# Instalación y ejecución

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

## 2. Instalar las dependencias

```bash
npm install
```

## 3. Configurar las variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

## 4. Configurar PostgreSQL

Crear la base de datos y ejecutar el script SQL ubicado en:

```text
src/database/dump-TP_09-202607030904.sql
```

## 5. Iniciar el servidor

```bash
node index.js
```

El servidor estará disponible en:

```text
http://localhost:3000
```

---

# Resumen de endpoints

| Método | Endpoint               | Acceso    |
| ------ | ---------------------- | --------- |
| `POST` | `/api/auth/registro`   | Público   |
| `POST` | `/api/auth/login`      | Público   |
| `GET`  | `/api/publicaciones`   | Público   |
| `POST` | `/api/publicaciones`   | Protegido |
| `GET`  | `/api/usuarios/perfil` | Protegido |
| `PUT`  | `/api/usuarios/perfil` | Protegido |

---

# Checklist de requisitos

* [x] Servidor Node.js y Express.
* [x] Base de datos PostgreSQL.
* [x] Arquitectura separada en rutas, controladores, servicios y middlewares.
* [x] Registro de usuarios.
* [x] Verificación de usuarios duplicados.
* [x] Cifrado de contraseñas mediante `bcrypt`.
* [x] Login de usuarios.
* [x] Generación de tokens JWT.
* [x] Middleware de autenticación.
* [x] Validación de datos de registro.
* [x] Validación de creación de publicaciones.
* [x] Endpoint público de publicaciones.
* [x] Endpoint protegido de creación de publicaciones.
* [x] Endpoint protegido de perfil.
* [x] Actualización del perfil.
* [x] Variables de entorno mediante `.env`.
* [x] Archivo `.env.example`.
* [x] Base de datos relacional con usuarios y publicaciones.
* [x] Relación entre usuarios y publicaciones mediante clave foránea.
