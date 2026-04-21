import 'dotenv/config'; 
import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHanlder.js";


const app = express();
app.use(cors());

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
      usuarios: './api/usuarios',
      publicaciones: './api/publicaciones',
      comentarios: './api/comentarios',
      docs: './api-docs'
    }
  });
});


// Swagger UI para documentación
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDocument = YAML.load(
  path.join(__dirname, "../openapi.yaml")
);

// Configuración de Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use(errorHandler);


export default app;