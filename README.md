# ProyectoM2_MartinVelez API

## Qué es el proyecto
Esta es una API REST para un blog que permite gestionar usuarios y publicaciones. Está construida con Node.js, Express y PostgreSQL, y sirve como backend para operaciones de CRUD sobre usuarios y entradas de blog.

## URL de la API
- Producción: `https://proyectom2martinvelez-production.up.railway.app/api-docs/`

## Tecnologías utilizadas
- Node.js
- Express
- PostgreSQL
- dotenv
- swagger-ui-express
- YAMLJS
- Vitest + Supertest para pruebas

## Endpoints disponibles
- `GET /api/usuarios` - Obtener todos los usuarios
- `POST /api/usuarios` - Crear un nuevo usuario
- `GET /api/usuarios/{id}` - Obtener un usuario por ID
- `PUT /api/usuarios/{id}` - Actualizar un usuario por ID
- `DELETE /api/usuarios/{id}` - Eliminar un usuario por ID

- `GET /api/publicaciones` - Obtener todas las publicaciones
- `POST /api/publicaciones` - Crear una nueva publicación
- `GET /api/publicaciones/{id}` - Obtener una publicación por ID
- `PUT /api/publicaciones/{id}` - Actualizar una publicación por ID
- `DELETE /api/publicaciones/{id}` - Eliminar una publicación por ID
- `GET /api/publicaciones/usuarios/{usuarioId}` - Obtener publicaciones de un usuario específico

`GET /api/comentarios` - Obtener todas los comentarios
- `POST /api/comentarios` - Crear un nuevo comentario
- `GET /api/comentario/{id}` - Obtener un comentario por ID
- `PUT /api/comentario/{id}` - Actualizar un comentario por ID
- `DELETE /api/comentario/{id}` - Eliminar un comentario por ID
- `GET /api/comentario/publicacion/{publicacionId}` - Obtener comentario de una publicacion en específico


## Ejemplos de uso
### Obtener todos los usuarios
```bash
curl -X GET "https://ProyectoM2_MartinVelez.railway.app/api/usuarios" \
  -H "Accept: application/json"
```

### Crear un usuario
```bash
curl -X POST "https://ProyectoM2_MartinVelez.railway.app/api/usuarios" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana García",
    "email": "ana@example.com",
    "bio": "Desarrolladora full-stack apasionada por Node.js"
  }'
```

### Obtener todas las publicaciones
```bash
curl -X GET "https://ProyectoM2_MartinVelez.railway.app/api/publicaciones" \
  -H "Accept: application/json"
```

### Crear una publicación
```bash
curl -X POST "https://proyectom2martinvelez-production.up.railway.app/api-docs/publicaciones" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mi primera publicación",
    "content": "Este es el contenido de mi primera publicación en el blog.",
    "usuarios_id": 1,
    "published": false
  }'
```

## Documentación interactiva
- Swagger UI: `https://proyectom2martinvelez-production.up.railway.app/api-docs/#/`

## Clonar el repositorio:
1. Clonar el repositorio:
   ```bash
git clone <https://github.com/mstivenvelezc-ctrl/ProyectoM2_MartinVelez>
cd ProyectoM2_MartinVelez/back
```
2. Instalar dependencias:
   ```bash
npm install
```
3. Crear un archivo `.env` en `back/` con al menos estas variables:
   ```env
PORT=3000
DATABASE_URL=postgres://usuario:password@localhost:5432/tu_base_de_datos
```
4. Ejecutar el servidor en modo desarrollo:
   ```bash
npm run dev
```
5. Abrir la API local en:
   - `http://localhost:3000`
   - Swagger UI: `http://localhost:3000/api-docs`


> ## Uso de IA — Asistencia con Claude

Durante el desarrollo de este proyecto utilicé Claude (Anthropic) como asistente para identificar errores, comprenderlos y corregirlos. A continuación se describen los casos más relevantes.

### 1. Migración de CommonJS a ES Modules

El proyecto usa `"type": "module"` en el `package.json`, lo que requiere sintaxis ESM. Varios archivos usaban `require()` y `module.exports` (CommonJS), lo que causaba errores de sintaxis al arrancar el servidor. Claude identificó el problema y proporcionó la corrección para cada archivo afectado, como `db/config.js` y `routes/usuarios.js`.


### 2. Variables de entorno no cargadas en tests

Al correr los tests con Vitest, la conexión a la base de datos fallaba con error 500 porque las variables del `.env` no se cargaban automáticamente. Claude identificó que faltaba inicializar `dotenv` y sugirió crear un `vitest.config.js` con `setupFiles` apuntando a un archivo que carga el `.env` antes de los tests.

### 3. Validadores incompatibles con Express middleware

Los validadores en `utils/validatorsU.js` estaban escritos como funciones simples que recibían un valor y retornaban un string de error. Esto era incompatible con usarlos directamente como middlewares de Express (que requieren `req, res, next`). Claude detectó el conflicto con los tests existentes y propuso moverlos al interior de los controllers, preservando la firma original para no romper los tests.


### 4. Tests fallando por datos duplicados en la BD

El test de `POST /api/usuarios` fallaba con `409 Conflict` porque el email de prueba quedaba registrado en la base de datos de la ejecución anterior. Claude propuso usar `beforeEach` y `afterEach` de Vitest para limpiar el registro antes y después de cada test.


### 5. Nombre de columna incorrecto en PostgreSQL

Al crear una publicación se obtenía un error `42703: no existe la columna usuario_id`. Claude sugirió consultar las columnas reales de la tabla con `information_schema.columns`, lo que reveló que la columna se llamaba `usuarios_id` (con s). Se corrigió el controller y el body del request en Thunder Client.
