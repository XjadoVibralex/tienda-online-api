# Tienda Online API

Esta es una API para una tienda online construida con Node.js y MongoDB. Permite realizar operaciones básicas como la creación de usuarios, autenticación, actualización de perfil, y la gestión de productos. Esta API está diseñada para ser usada en una aplicación frontend que interactúe con ella.

## Características
- Registro y autenticación de usuarios.
- Actualización de perfil de usuario.
- Gestión de roles de usuario (usuario y administrador).
- Protección de rutas con autenticación JWT.
- Operaciones básicas de CRUD para productos.
- Gestión completa del carrito de compras.

## Tecnologías usadas
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcryptjs (para el hash de contraseñas)

## Endpoints

### Usuarios

#### Registro de usuario
- **Método:** `POST`
- **Ruta:** `/api/users/register`
- **Descripción:** Crea un nuevo usuario con los datos proporcionados.
- **Datos requeridos:**
  - `name`: Nombre del usuario.
  - `email`: Correo electrónico del usuario.
  - `password`: Contraseña del usuario.

#### Autenticación (Login)
- **Método:** `POST`
- **Ruta:** `/api/users/login`
- **Descripción:** Inicia sesión y devuelve un token JWT.
- **Datos requeridos:**
  - `email`: Correo electrónico del usuario.
  - `password`: Contraseña del usuario.

#### Obtener perfil de usuario
- **Método:** `GET`
- **Ruta:** `/api/users/profile`
- **Descripción:** Obtiene los detalles del perfil del usuario autenticado.
- **Autenticación requerida:** Sí (Token JWT en los headers).

#### Actualizar perfil de usuario
- **Método:** `PUT`
- **Ruta:** `/api/users/profile`
- **Descripción:** Actualiza el perfil del usuario autenticado (nombre y correo electrónico).
- **Autenticación requerida:** Sí (Token JWT en los headers).
- **Datos requeridos:**
  - `name`: Nuevo nombre del usuario.
  - `email`: Nuevo correo electrónico del usuario.

### Productos

#### Obtener todos los productos
- **Método:** `GET`
- **Ruta:** `/api/products`
- **Descripción:** Obtiene todos los productos de la tienda.
- **Autenticación requerida:** No.

#### Obtener un producto específico
- **Método:** `GET`
- **Ruta:** `/api/products/:id`
- **Descripción:** Obtiene un producto específico por su ID.
- **Autenticación requerida:** No.

#### Crear un nuevo producto
- **Método:** `POST`
- **Ruta:** `/api/products`
- **Descripción:** Crea un nuevo producto en la tienda (solo admin).
- **Datos requeridos:**
  - `name`: Nombre del producto.
  - `description`: Descripción del producto.
  - `price`: Precio del producto.
  - `imageUrl`: URL de la imagen del producto.
- **Autenticación requerida:** Sí (Token JWT de administrador).

#### Actualizar un producto
- **Método:** `PUT`
- **Ruta:** `/api/products/:id`
- **Descripción:** Actualiza un producto por su ID (solo admin).
- **Datos requeridos:**
  - `name`: Nuevo nombre del producto.
  - `description`: Nueva descripción del producto.
  - `price`: Nuevo precio del producto.
  - `imageUrl`: Nueva URL de la imagen del producto.
- **Autenticación requerida:** Sí (Token JWT de administrador).

#### Eliminar un producto
- **Método:** `DELETE`
- **Ruta:** `/api/products/:id`
- **Descripción:** Elimina un producto por su ID (solo admin).
- **Autenticación requerida:** Sí (Token JWT de administrador).

### Carrito

#### Obtener carrito
- **Método:** `GET`
- **Ruta:** `/api/cart`
- **Descripción:** Obtiene el carrito de compras del usuario autenticado.
- **Autenticación requerida:** Sí (Token JWT en los headers).

#### Agregar producto al carrito
- **Método:** `POST`
- **Ruta:** `/api/cart/add`
- **Descripción:** Agrega un producto al carrito de compras.
- **Datos requeridos:**
  - `productId`: ID del producto.
  - `quantity`: Cantidad de producto a agregar.
  - `price`: Precio del producto.
- **Autenticación requerida:** Sí (Token JWT en los headers).

#### Eliminar producto del carrito
- **Método:** `DELETE`
- **Ruta:** `/api/cart/remove/:productId`
- **Descripción:** Elimina un producto del carrito de compras.
- **Datos requeridos:**
  - `productId`: ID del producto a eliminar.
- **Autenticación requerida:** Sí (Token JWT en los headers).

#### Aplicar cupón de descuento
- **Método:** `POST`
- **Ruta:** `/api/cart/apply-coupon`
- **Descripción:** Aplica un descuento al carrito con un código de cupón.
- **Datos requeridos:**
  - `code`: Código de descuento.
- **Autenticación requerida:** Sí (Token JWT en los headers).

#### Vaciar el carrito
- **Método:** `DELETE`
- **Ruta:** `/api/cart/clear`
- **Descripción:** Vacía el carrito de compras del usuario autenticado.
- **Autenticación requerida:** Sí (Token JWT en los headers).

> **Nota:** Actualmente se está desarrollando una funcionalidad adicional que permitirá **migrar un carrito temporal a un usuario autenticado**. Esta funcionalidad fusionará los datos de un carrito temporal con el del usuario una vez que inicie sesión. Esto será útil para escenarios donde los usuarios agregan productos antes de registrarse o iniciar sesión.

---

## Instalación


1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/XjadoVibralex/tienda-online-api.git

2. **Navega al directorio del proyecto**:

cd tienda-online-api

3. **Instala las dependencias**:

npm install

4. **Crea un archivo .env en la raíz del proyecto y agrega las siguientes variables**:

MONGO_URI=tu_url_de_conexion_a_mongodb
JWT_SECRET=tu_clave_secreta_jwt

5. **Inicia el servidor**:

npm start

El servidor debería estar corriendo en http://localhost:3000.