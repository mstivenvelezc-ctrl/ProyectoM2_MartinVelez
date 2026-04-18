// src/controllers/usuariosControllers.js
import pool from '../db/config.js';
import { validarName, validarEmail, validarBio } from '../utils/validatorsU.js';
import { notFound, badRequest, conflict, internalServerError } from '../middlewares/errorHanlder.js';


// GET /api/usuarios - Obtener todos los usuarios
export const getAllUsuarios = async (req, res, next) => {
    try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY ID');
    res.json(result.rows);
  } catch (error) {
    return next(internalServerError("Error obteniendo usuarios"));
  }
};

// GET /api/usuarios/:id - Obtener un usuario por ID
export const getUsuarioById = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE ID = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Usuario no encontrado"));
    }
    res.json(result.rows[0]);
  } catch (error) {
    return next(internalServerError("Error obteniendo usuario"));
  }
};

// POST /api/usuarios - Crear un nuevo usuario
export const createUsuario = async (req, res, next) => {
  const { name, email, bio } = req.body;

  const nameError = validarName(name);
  const emailError = validarEmail(email);
  const bioError = validarBio(bio);

if (nameError || emailError || bioError) {
    return next(badRequest(nameError || emailError || bioError));
  }

  
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (name, email, bio) VALUES ($1, $2, $3) RETURNING *',
      [name, email, bio || null]
    );
    res.status(201).json(result.rows[0]);
   } catch (error) {
    console.error('Error creando usuario:', error);
    if (error.code === '23505') {
      return next(conflict("El email ya está registrado"));
    }
    return next(internalServerError("Error creando usuario"));
  }
};

// PUT /api/usuarios/:id - Actualizar un usuario
export const updateUsuario = async (req, res, next) => {
    const { name, email, bio } = req.body;

    const nameError = validarName(name);
    const emailError = validarEmail(email);
    const bioError = validarBio(bio);

  if (nameError || emailError || bioError) {
    return next(badRequest(nameError || emailError || bioError));
  }

  try {
    const result = await pool.query(
      'UPDATE usuarios SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
      [name, email, bio, req.params.id]
    );
    if (result.rows.length === 0) {
      return next(notFound("Usuario no encontrado"));
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    if (error.code === '23505') {
      return next(conflict("El email ya está registrado"));
    }
    return next(internalServerError("Error actualizando usuario"));
  }
};

// DELETE /api/usuarios/:id - Eliminar un usuario
export const deleteUsuario = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return next(notFound("Usuario no encontrado"));
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    return next(internalServerError("Error eliminando usuario"));
  }
};


