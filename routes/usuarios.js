const express = require('express');
const router = express.Router();

// Datos en memoria (se reemplazarán con base de datos)
let usuarios = [
  { 
    id: 1, 
    name: 'Ana García', 
    email: 'ana@example.com', 
    bio: 'Desarrolladora full-stack apasionada por Node.js' 
  },
  { 
    id: 2, 
    name: 'Carlos Ruiz', 
    email: 'carlos@example.com', 
    bio: 'Escritor técnico especializado en bases de datos' 
  },
  { 
    id: 3, 
    name: 'María López', 
    email: 'maria@example.com', 
    bio: 'Ingeniera de software con foco en APIs REST' 
  }
];

// GET /api/usuarios - Obtener todos los usuarios
router.get('/', (req, res) => {
  res.json(usuarios);
});

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  res.json(usuario);
});

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', (req, res) => {
  const { name, email, bio } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
  }
  
  const newUsuario = {
    id: usuarios.length + 1,
    name,
    email,
    bio: bio || ''
  };
  
  usuarios.push(newUsuario);
  res.status(201).json(newUsuario);
});

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', (req, res) => {
  const usuario = usuarios.find(u => u.id === parseInt(req.params.id));
  
  if (!usuario) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  const { name, email, bio } = req.body;
  
  if (name) usuario.name = name;
  if (email) usuario.email = email;
  if (bio !== undefined) usuario.bio = bio;
  
  res.json(usuario);
});

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', (req, res) => {
  const index = usuarios.findIndex(u => u.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  
  usuarios.splice(index, 1);
  res.json({ message: 'Usuario eliminado exitosamente' });
});

module.exports = router;