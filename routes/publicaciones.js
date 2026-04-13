const express = require('express');
const router = express.Router();

// Datos en memoria (se reemplazarán con base de datos)
let publicaciones = [
  { 
    id: 1, 
    title: 'Introducción a Node.js', 
    content: 'Node.js es un runtime de JavaScript...', 
    usuarios_id: 1,
    published: true
  },
  { 
    id: 2, 
    title: 'PostgreSQL vs MySQL', 
    content: 'Ambas bases de datos tienen ventajas...', 
    usuarios_id: 2,
    published: true
  },
  { 
    id: 3, 
    title: 'APIs RESTful', 
    content: 'REST es un estilo arquitectónico...', 
    usuarios_id: 1,
    published: true
  },
  { 
    id: 4, 
    title: 'Manejo de errores en Express', 
    content: 'El manejo apropiado de errores...', 
    usuarios_id: 3,
    published: false
  },
  { 
    id: 5, 
    title: 'Async/Await explicado', 
    content: 'Las promesas simplifican el código asíncrono...', 
    usuarios_id: 1,
    published: false
  }
];

// GET /api/posts - Obtener todos los posts
router.get('/', (req, res) => {
  // Opcionalmente filtrar por publicados
  const { published } = req.query;
  
  if (published !== undefined) {
    const isPublished = published === 'true';
    const filtered = publicaciones.filter(p => p.published === isPublished);
    return res.json(filtered);
  }
  
  res.json(publicaciones);
});

// GET /api/posts/:id - Obtener un post por ID
router.get('/:id', (req, res) => {
  const post = publicaciones.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Publicación no encontrada' });
  }
  
  res.json(publicaciones);
});

// GET /api/posts/author/:authorId - Obtener posts por autor
router.get('/usuarios/:usuariosId', (req, res) => {
  const usuariosPublicaciones = publicaciones.filter(p => p.usuarios_id === parseInt(req.params.usuariosId));
  res.json(usuariosPublicaciones);
});

// POST /api/posts - Crear un nuevo post
router.post('/', (req, res) => {
  const { title, content, usuarios_id, published } = req.body;
  
  if (!title || !content || !usuarios_id) {
    return res.status(400).json({ 
      error: 'Título, contenido y usuarios_id son requeridos' 
    });
  }
  
  const newPost = {
    id: publicaciones.length + 1,
    title,
    content,
    usuarios_id: parseInt(usuarios_id),
    published: published || false
  };
  
  publicaciones.push(newPost);
  res.status(201).json(newPost);
});

// PUT /api/posts/:id - Actualizar un post
router.put('/:id', (req, res) => {
  const post = publicaciones.find(p => p.id === parseInt(req.params.id));
  
  if (!post) {
    return res.status(404).json({ error: 'Publicación no encontrada' });
  }
  
  const { title, content, published } = req.body;
  
  if (title) post.title = title;
  if (content) post.content = content;
  if (published !== undefined) post.published = published;
  
  res.json(post);
});

// DELETE /api/posts/:id - Eliminar un post
router.delete('/:id', (req, res) => {
  const index = publicaciones.findIndex(p => p.id === parseInt(req.params.id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Publicación no encontrada' });
  }
  
  publicaciones.splice(index, 1);
  res.json({ message: 'Publicación eliminada exitosamente' });
});

module.exports = router;