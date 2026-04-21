
// src/routes/comentarios.js
import { Router } from "express";


import {
  getAllComentarios,
  getComentariosById,
  createComentarios,
  updateComentarios,
  deleteComentarios,
  getComentariosByPublicacionId
} from "../controllers/comentariosControllers.js";



// src/routes/comentarios.js
const router = Router();


// GET /api/comentarios - Obtener todos los comentarios
router.get('/', getAllComentarios);

// GET /api/comentarios/:id - Obtener un comentario por ID
router.get('/:id', getComentariosById);

// POST /api/comentarios - Crear un nuevo comentario
router.post('/', createComentarios);

// PUT /api/comentarios/:id - Actualizar un comentario
router.put('/:id', updateComentarios);

// DELETE /api/comentarios/:id - Eliminar un comentario
router.delete('/:id', deleteComentarios);

// GET /api/comentarios/publicacion/:publicacionId - Obtener comentarios por publicación
router.get('/publicacion/:publicacionId', getComentariosByPublicacionId);

export default router;