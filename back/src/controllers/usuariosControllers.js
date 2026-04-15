import pool from '../db/config.js';

// GET /api/usuarios - Obtener todos los usuarios
export const getAllUsuarios = async (req, res) => {
     try {
    const result = await pool.query('SELECT * FROM usuarios ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({ error: 'Error obteniendo usuarios' });
  }
};

// GET /api/usuarios/:id - Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE id = $1',
      [req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({ error: 'Error obteniendo usuario' });
  }
};

// POST /api/usuarios - Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  const { name, email, bio } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nombre y email son requeridos' });
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
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error creando usuario' })
  }
};

// PUT /api/usuarios/:id - Actualizar un usuario
export const updateUsuario = async (req, res) => {
    const { name, email, bio } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET name = COALESCE($1, name), email = COALESCE($2, email), bio = COALESCE($3, bio) WHERE id = $4 RETURNING *',
      [name, email, bio, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    if (error.code === '23505') {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }
    res.status(500).json({ error: 'Error actualizando usuario' });
  }
};

// DELETE /api/usuarios/:id - Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM usuarios WHERE id = $1',
      [req.params.id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando usuario:', error);
    res.status(500).json({ error: 'Error eliminando usuario' });
  }
};
