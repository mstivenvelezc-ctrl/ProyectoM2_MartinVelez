
import express from "express";
import router from "./routes/index.js";

const app = express();
app.use(express.json());

app.use('/api', router);


// Log temporal para ver las rutas registradas
console.log('Rutas registradas:');
router.stack.forEach(r => {
  if (r.route) console.log(r.route.path);
  else if (r.handle.stack) {
    r.handle.stack.forEach(s => console.log(s.route?.path));
  }
});


// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProyectoM2_MartinVelez API',
    endpoints: {
      usuarios: '/api/usuarios',
      publicaciones: '/api/publicaciones',
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  if (err.code) {
    if (err.code === '23505') return res.status(409).json({ error: 'Registro duplicado' });
    if (err.code === '23503') return res.status(409).json({ error: 'Violación de relación entre tablas' });
    if (err.code === '23502') return res.status(400).json({ error: 'Campo requerido faltante' });
  }
  res.status(500).json({ error: 'Error interno del servidor' });
});


import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(
  path.join(__dirname, "../openapi.yaml")
);

// 🔥 AGREGA ESTO AQUÍ
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

export default app;