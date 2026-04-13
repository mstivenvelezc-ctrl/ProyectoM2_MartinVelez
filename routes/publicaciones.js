const { loadEnvFile } = require('node:process');
loadEnvFile('.env');

const express = require('express');
const router = express.Router();

// Datos en memoria (se reemplazarán con base de datos)
const pool = require('../db/config');

// GET /api/posts - Obtener todos las publicaciones
router.get('/', async (req, res) => {
  const { published } = req.query;
  
  try {
    let query = 'SELECT * FROM publicaciones';
    let params = [];
    
    if (published !== undefined) {
      query += ' WHERE published = $1';
      params.push(published === 'true');
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo publicaciones:', error);
    res.status(500).json({ error: 'Error obteniendo publicaciones' });
  }
});

// GET /api/posts/:id - Obtener una publicación por ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM publicaciones WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo publicación:', error);
    res.status(500).json({ error: 'Error obteniendo publicación' });
  }
});

// POST /api/posts - Crear una nueva publicación
router.post('/', async (req, res) => {
  const { title, content, author_id, published } = req.body;
  
  if (!title || !content || !author_id) {
    return res.status(400).json({ 
      error: 'Título, contenido y author_id son requeridos' 
    });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO publicaciones (title, content, usuario_id, published) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, content, usuario_id, published || false]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando publicación:', error);
    
    if (error.code === '23503') {
      return res.status(404).json({ error: 'El autor especificado no existe' });
    }
    
    res.status(500).json({ error: 'Error creando publicación' });
  }
});
// PUT /api/posts/:id - Actualizar una publicación
router.put('/:id', async (req, res) => {
  const { title, content, published } = req.body;
  
  try {
    const result = await pool.query(
      'UPDATE publicaciones SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
      [title, content, published, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando publicación:', error);
    res.status(500).json({ error: 'Error actualizando publicación' });
  }
});

// DELETE /api/posts/:id - Eliminar una publicación
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM publicaciones WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Publicación no encontrada' });
    }
    
    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando publicación:', error);
    res.status(500).json({ error: 'Error eliminando publicación' });
  }
});

// GET /api/posts/author/:authorId - Obtener publicaciones por usuario
router.get('/author/:authorId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM posts WHERE author_id = $1 ORDER BY created_at DESC',
      [req.params.authorId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo posts del autor:', error);
    res.status(500).json({ error: 'Error obteniendo posts del autor' });
  }
});

module.exports = router;