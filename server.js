import "dotenv/config";
import express  from "express";

import usuariosRouter from "./routes/usuarios.js";
import publicacionesRouter from"./routes/publicaciones.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRouter);
app.use('/api/publicaciones', publicacionesRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    message: 'ProyectoM2_MartinVelez API',
    endpoints: {
      usuarios: '/api/usuarios',
      publicaciones: '/api/publicaciones'
    }
  });
});

// Middleware de manejo de errores de base de datos
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  
  // Error de PostgreSQL
  if (err.code) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Registro duplicado' });
    }
    if (err.code === '23503') {
      return res.status(409).json({ error: 'Violación de relación entre tablas' });
    }
    if (err.code === '23502') {
      return res.status(400).json({ error: 'Campo requerido faltante' });
    }
  }
  
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

