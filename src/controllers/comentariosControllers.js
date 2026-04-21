// src/controllers/comentariosControllers.js

import pool from '../db/config.js';
import { validarPublicacionId, validarUsuariosId, validarContent } from '../utils/validatorsC.js';
import { notFound, badRequest, internalServerError } from '../middlewares/errorHanlder.js';


// GET /api/comentarios - Obtener todos los comentarios
export const getAllComentarios = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM comentarios ORDER BY created_at DESC');
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

  const publicacionIdError = validarPublicacionId(publicacion_id);
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
    console.error('mensaje:', error.message);
    console.error('codigo:', error.code);
    console.error('detalle:', error.detail);
    if (error.code === '23503') {
      return next(notFound("El autor especificado no existe"));
    }
    return next(internalServerError("Error creando comentario"));
  }
};


// PUT /api/comentarios/:id - Actualizar un comentario
export const updateComentarios = async (req, res, next) => {
  const { content } = req.body;

  const contentError = validarContent(content);

  if (contentError) {
    return next(badRequest(contentError));
  }

  try {
    const result = await pool.query(
      'UPDATE comentarios SET content = COALESCE($1, content) WHERE id = $2 RETURNING *',
      [content, req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Comentario no encontrado"));
    }
    res.json(result.rows[0]);
  } catch (error) {
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
    return next(internalServerError("Error eliminando comentario"));
  }
};


// GET /api/comentarios/publicacion/:publicacionId - Obtener comentarios por publicación
export const getComentariosByPublicacionId = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM comentarios WHERE publicacion_id = $1 ORDER BY created_at DESC',
      [req.params.publicacionId]
    );
    res.json(result.rows);
  } catch (error) {
    return next(internalServerError("Error obteniendo comentarios de la publicación"));
  }
};