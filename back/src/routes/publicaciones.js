// src/routes/publicaciones.js

import { Router } from "express";


import {
  getAllPublicaciones,
  getPublicacionesById,
  createPublicaciones,
  updatePublicaciones,
  deletePublicaciones,
  getPublicacionesByUsuarioId
} from "../controllers/publicacionesControllers.js";


// src/routes/publicaciones.js
const router = Router();


// GET /api/posts - Obtener todos las publicaciones
router.get('/', getAllPublicaciones);

// GET /api/posts/:id - Obtener una publicación por ID
router.get('/:id', getPublicacionesById);

// POST /api/posts - Crear una nueva publicación
router.post('/', createPublicaciones);

// PUT /api/posts/:id - Actualizar una publicación
router.put('/:id',updatePublicaciones);

// DELETE /api/posts/:id - Eliminar una publicación
router.delete('/:id', deletePublicaciones);

// GET /api/posts/author/:usuarioId - Obtener publicaciones por usuario
router.get('/usuarios/:usuarioId', getPublicacionesByUsuarioId);

export default router;