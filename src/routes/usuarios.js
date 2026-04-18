// src/routes/usuarios.js

import { Router } from "express";

//
import {
  getAllUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  deleteUsuario
} from "../controllers/usuariosControllers.js";


// src/routes/usuarios.js
const router = Router();


// GET /api/usuarios - Obtener todos los usuarios
router.get('/', getAllUsuarios);

// GET /api/usuarios/:id - Obtener un usuario por ID
router.get('/:id', getUsuarioById);

// POST /api/usuarios - Crear un nuevo usuario
router.post('/', createUsuario); 

// PUT /api/usuarios/:id - Actualizar un usuario
router.put('/:id', updateUsuario);

// DELETE /api/usuarios/:id - Eliminar un usuario
router.delete('/:id', deleteUsuario);

export default router;