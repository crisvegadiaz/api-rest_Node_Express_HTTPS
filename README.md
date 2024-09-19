---

# Proyecto de Software Api-Rest

## Descripción General

Este proyecto es una aplicación **Node.js** que utiliza una base de datos **PostgreSQL** gestionada mediante **Docker Compose**. Está diseñada para manejar la autenticación y la gestión de usuarios, implementando rutas para crear, actualizar, eliminar y consultar usuarios en la base de datos. Además, incluye un mecanismo de generación de tokens para la autenticación.

## Estructura del Proyecto

```bash
.
├── .gitignore
├── node
│   ├── .env
│   ├── package.json
│   ├── package-lock.json
│   └── src
│       ├── auth.js
│       ├── dataDB.js
│       ├── init.js
│       ├── key
│       │   ├── cert.pem
│       │   └── key.pem
│       ├── routes
│       │   ├── createToken.routes.js
│       │   ├── createUser.routes.js
│       │   ├── deleteUser.routes.js
│       │   ├── error.routes.js
│       │   ├── updateUser.routes.js
│       │   ├── userId.routes.js
│       │   └── users.routes.js
│       └── verifyData.js
└── sql
    ├── docker-compose.yaml
    └── init.sql
```

### Archivos y Carpetas Clave

#### node/
- **.env**: Variables de entorno como claves de base de datos y secretos.
- **package.json**: Define las dependencias y scripts del proyecto:
  - **name**: `"node"`
  - **version**: `"1.0.0"`
  - **main**: `"index.js"`
  - **type**: `"module"` (usa módulos de ECMAScript).
  - **scripts**: Incluye el comando `dev` para iniciar el proyecto en modo desarrollo con recarga automática:
    ```bash
    npm run dev
    ```
  - **dependencies**:
    - **bcryptjs**: Utilizado para encriptar contraseñas.
    - **dotenv**: Carga las variables de entorno desde el archivo `.env`.
    - **express**: Framework web para crear la API.
    - **helmet**: Mejora la seguridad HTTP configurando encabezados.
    - **joi**: Validación de datos para la entrada de usuario.
    - **jsonwebtoken**: Implementa la autenticación basada en tokens JWT.
    - **pg**: Cliente para conectarse a la base de datos PostgreSQL.
    - **url**: Módulo para analizar y resolver URL.
  
- **package-lock.json**: Archivo generado automáticamente para bloquear versiones de dependencias.

#### src/
- **auth.js**: Lógica de autenticación, probablemente usando JWT.
- **dataDB.js**: Conexión y operaciones con la base de datos PostgreSQL.
- **init.js**: Punto de entrada de la aplicación.
- **key/**: Certificados SSL.
- **routes/**: Define las rutas de la API:
  - **createToken.routes.js**: Ruta para generar tokens de autenticación.
  - **createUser.routes.js**: Ruta para crear un nuevo usuario.
  - **deleteUser.routes.js**: Ruta para eliminar un usuario.
  - **updateUser.routes.js**: Ruta para actualizar información del usuario.
  - **userId.routes.js**: Ruta para obtener información de un usuario por su ID.
  - **users.routes.js**: Ruta para listar usuarios.
- **verifyData.js**: Verificación y validación de datos.

#### sql/
- **docker-compose.yaml**: Configuración de servicios, incluye PostgreSQL.
- **init.sql**: Script SQL para inicializar la base de datos, probablemente creando tablas y datos iniciales.

## Requisitos

- **Node.js**: Plataforma de ejecución de JavaScript.
- **PostgreSQL**: Base de datos relacional.
- **Docker** y **Docker Compose**: Para orquestar la base de datos PostgreSQL.

## Instalación

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd <nombre-del-proyecto>
   ```

2. Configurar el archivo `.env` con las variables necesarias:

```bash
cat node/.env 
# Express
JWT_SECRET = "tu_secreto_jwt"
JWT_TIME = "La duración de validez del token formato = 4h"
EXPRESS_PORT = 3500

# Database
DB_USER = "nombre de usuario de database"
DB_PASSWORD = "12345"
DB_HOST = "192.168.1.01"
DB_PORT = 5432
DB_DATABASE = "prueba_db"
```

Este archivo define las configuraciones para la autenticación JWT y los parámetros de conexión a la base de datos PostgreSQL.

3. Instalar las dependencias del proyecto:

   ```bash
   cd node
   npm install
   ```

4. Levantar la base de datos con Docker:

   ```bash
   cd sql
   docker-compose up -d
   ```

5. Ejecutar la aplicación en modo desarrollo:

   ```bash
   npm run dev
   ```

## Uso de la API

La API expone varias rutas para la gestión de usuarios y autenticación. Algunas rutas requieren autenticación mediante **JWT**. A continuación, se describen las rutas principales:

- `POST /createUser`: Crea un nuevo usuario.
- `POST /createToken`: Genera un token JWT de autenticación.
- `GET /users`: Devuelve una lista de usuarios.
- `GET /users/:id`: Devuelve los detalles de un usuario por ID.
- `PUT /updateUser/:id`: Actualiza los datos de un usuario.
- `DELETE /deleteUser/:id`: Elimina un usuario.

### Autenticación

Para obtener un token JWT, se debe enviar una solicitud `POST` a la ruta `/createToken` con las credenciales del usuario.

El cambio está en la definición de las tablas de la base de datos y en la inserción de datos. Las tablas y sus características principales son:

**Tabla `users`**:
   - Contiene información de los usuarios, como `username`, `email`, `password_hash`, y fechas como `created_at` y `last_login`.
   - Se insertan cinco usuarios de ejemplo con sus respectivas contraseñas cifradas.

**Tabla `usertoken`**:
   - Almacena tokens de usuarios con `username` y `password`.
   - Se añade un **trigger** que encripta las contraseñas antes de insertar o actualizar, utilizando la función `crypt()` del módulo `pgcrypto`.
   - Se inserta información para tres usuarios de ejemplo con contraseñas en texto plano que serán cifradas al ser insertadas.

El cambio relevante incluye la creación de las tablas **`users`** y **`usertoken`**, la inserción de datos de prueba y la adición del **trigger** para cifrar las contraseñas.