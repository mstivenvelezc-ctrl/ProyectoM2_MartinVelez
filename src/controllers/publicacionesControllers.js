// src/controllers/publicacionesControllers.js
import pool from '../db/config.js';
import { validarTitle, validarUsuariosId, validarContent, validarPublished } from '../utils/validatorsP.js';
import { notFound, badRequest, conflict, internalServerError } from '../middlewares/errorHanlder.js';


// GET /api/posts - Obtener todos las publicaciones
export const getAllPublicaciones = async (req, res, next) => {
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
    return next(internalServerError("Error obteniendo publicaciones"));
  }
};

// GET /api/posts/:id - Obtener una publicación por ID
export const getPublicacionesById = async (req, res, next) => {
    try {
    const result = await pool.query(
      'SELECT * FROM publicaciones WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Publicación no encontrada"));
    }
    res.json(result.rows[0]);
  } catch (error) {
    return next(internalServerError("Error obteniendo publicación"));
  }
};

// POST /api/posts - Crear una nueva publicación
export const createPublicaciones = async (req, res, next) => {
  const { title, content, usuario_id, published } = req.body;

  const titleError = validarTitle(title);
  const contentError = validarContent(content);
  const usuariosIdError = validarUsuariosId(usuario_id);  // pasa usuario_id
  const publishedError = validarPublished(published);

  if (titleError || contentError || usuariosIdError || publishedError) {
    return next(badRequest(titleError || contentError || usuariosIdError || publishedError));
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
      return next(notFound("El autor especificado no existe"));
    }
    return next(internalServerError("Error creando publicación"));
  }
};

// PUT /api/posts/:id - Actualizar una publicación
export const updatePublicaciones = async (req, res, next) => {
  const { title, content, published } = req.body;

  const titleError = validarTitle(title);
  const contentError = validarContent(content);
  const publishedError = validarPublished(published);

  if (titleError || contentError || publishedError) {
    return next(badRequest(titleError || contentError || publishedError));
  }

  try {
    const result = await pool.query(
      'UPDATE publicaciones SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
      [title, content, published, req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Publicación no encontrada"));
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando publicación:', error);
    return next(internalServerError("Error actualizando publicación"));
  }
};

// DELETE /api/posts/:id - Eliminar una publicación
export const deletePublicaciones = async (req, res, next) => {
    try {
    const result = await pool.query(
      'DELETE FROM publicaciones WHERE id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return next(notFound("Publicación no encontrada"));
    }
    res.json({ message: 'Publicación eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando publicación:', error);
    return next(internalServerError("Error eliminando publicación"));
  }
};

// GET /api/posts/author/:usuarioId - Obtener publicaciones por usuario
export const getPublicacionesByUsuarioId = async (req, res, next) => {
    try {
    const result = await pool.query(
      'SELECT * FROM publicaciones WHERE usuario_id = $1 ORDER BY created_at DESC',
      [req.params.usuarioId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo publicaciones del usuario:', error);
    return next(internalServerError("Error obteniendo publicaciones del usuario"));
  }
};