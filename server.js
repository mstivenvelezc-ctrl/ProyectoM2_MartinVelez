const { loadEnvFile } = require('node:process');
const express = require('express');
const usuariosRouter = require('./routes/usuarios');
const publicacionesRouter = require('./routes/publicaciones');

loadEnvFile('.env');
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

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});