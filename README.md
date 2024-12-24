# Tienda Online API

Esta es una API para una tienda online construida con Node.js y MongoDB. Permite realizar operaciones básicas como la creación de usuarios, autenticación, actualización de perfil, y la gestión de productos. Esta API está diseñada para ser usada en una aplicación frontend que interactúe con ella.

## Características

- Registro y autenticación de usuarios.
- Actualización de perfil de usuario.
- Gestión de roles de usuario (usuario y administrador).
- Protección de rutas con autenticación JWT.
- Operaciones básicas de CRUD para productos.

## Tecnologías usadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (para el hash de contraseñas)

## Endpoints

### Registro de usuario

- **Método:** POST
- **Ruta:** `/api/users/register`
- **Descripción:** Crea un nuevo usuario con los datos proporcionados.
- **Datos requeridos:** 
    - `name`: Nombre del usuario.
    - `email`: Correo electrónico del usuario.
    - `password`: Contraseña del usuario.

### Autenticación (Login)

- **Método:** POST
- **Ruta:** `/api/users/login`
- **Descripción:** Inicia sesión y devuelve un token JWT.
- **Datos requeridos:**
    - `email`: Correo electrónico del usuario.
    - `password`: Contraseña del usuario.

### Obtener perfil de usuario

- **Método:** GET
- **Ruta:** `/api/users/profile`
- **Descripción:** Obtiene los detalles del perfil del usuario autenticado.
- **Autenticación requerida:** Sí (Token JWT en los headers).

### Actualizar perfil de usuario

- **Método:** PUT
- **Ruta:** `/api/users/profile`
- **Descripción:** Actualiza el perfil del usuario autenticado (nombre y correo electrónico).
- **Autenticación requerida:** Sí (Token JWT en los headers).
- **Datos requeridos:**
    - `name`: Nuevo nombre del usuario.
    - `email`: Nuevo correo electrónico del usuario.

## Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/XjadoVibralex/tienda-online-api.git

2. Navega al directorio del proyecto:

cd tienda-online-api

3. Instala las dependencias:

npm install

4. Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables:

MONGO_URI=tu_url_de_conexion_a_mongodb
JWT_SECRET=tu_clave_secreta_jwt

5. Inicia el servidor:

npm start

El servidor debería estar corriendo en http://localhost:3000.



