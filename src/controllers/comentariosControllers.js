// src/controllers/comentariosControllers.js

import pool from '../db/config.js';
import { validarTitle, validarPublicacionId, validarUsuariosId, validarContent, validarPublished } from '../utils/validatorsC.js';
import { notFound, badRequest, conflict, internalServerError } from '../middlewares/errorHanlder.js';


// GET /api/comentarios - Obtener todos los comentarios
export const getAllComentarios = async (req, res, next) => {
const { published } = req.query;
  try {
    let query = 'SELECT * FROM comentarios';
    let params = [];
    if (published !== undefined) {
      query += ' WHERE published = $1';
      params.push(published === 'true');
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    return next(internalServerError("Error obteniendo comentarios"));
  }
};


// GET /api/comentarios/:id - Obtener un comentario por ID
export const getComentariosById = async (req, res, next) => {
    try {
    const result = await pool.query(
      'SELECT * FROM comentarios WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Comentario no encontrado"));
    }
    res.json(result.rows[0]);
  } catch (error) {
    return next(internalServerError("Error obteniendo comentario"));
  }
};


// POST /api/comentarios - Crear un nuevo comentario
export const createComentarios = async (req, res, next) => {
  const { publicacion_id, usuarios_id, content } = req.body;

  const publicacionIdError = validarpublicacionId(publicacion_id);
  const usuariosIdError = validarUsuariosId(usuarios_id);
  const contentError = validarContent(content);


  if (publicacionIdError || usuariosIdError || contentError) {
    return next(badRequest(publicacionIdError || usuariosIdError || contentError));
  }

  try {
    const result = await pool.query(
      'INSERT INTO comentarios (publicacion_id, usuarios_id, content) VALUES ($1, $2, $3) RETURNING *',
      [publicacion_id, usuarios_id, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creando comentario:', error);
    if (error.code === '23503') {
      return next(notFound("El autor especificado no existe"));
    }
    return next(internalServerError("Error creando comentario"));
  }
};


// PUT /api/comentarios/:id - Actualizar un comentario
export const updateComentarios = async (req, res, next) => {
  const { title, content, published } = req.body;

  const titleError = validarTitle(title);
  const contentError = validarContent(content);
  const publishedError = validarPublished(published);

  if (titleError || contentError || publishedError) {
    return next(badRequest(titleError || contentError || publishedError));
  }

  try {
    const result = await pool.query(
      'UPDATE comentarios SET title = COALESCE($1, title), content = COALESCE($2, content), published = COALESCE($3, published) WHERE id = $4 RETURNING *',
      [title, content, published, req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Comentario no encontrado"));
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando comentario:', error);
    return next(internalServerError("Error actualizando comentario"));
  }
};


// DELETE /api/comentarios/:id - Eliminar un comentario
export const deleteComentarios = async (req, res, next) => {
    try {
    const result = await pool.query(
      'DELETE FROM comentarios WHERE id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return next(notFound("Comentario no encontrado"));
    }
    res.json({ message: 'Comentario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando comentario:', error);
    return next(internalServerError("Error eliminando comentario"));
  }
};



// GET /api/comentarios/post/:publicacionId - Obtener comentarios por publicación
export const getComentariosByPublicacionId = async (req, res, next) => {
    try {
    const result = await pool.query(
      'SELECT * FROM comentarios WHERE publicacion_id = $1 ORDER BY created_at DESC',
      [req.params.publicacionId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo comentarios de la publicación:', error);
    return next(internalServerError("Error obteniendo comentarios de la publicación"));
  }
};