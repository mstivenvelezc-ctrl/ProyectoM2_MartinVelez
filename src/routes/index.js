
import { Router } from "express";
import usuariosRouter from "./usuarios.js";
import publicacionesRouter from "./publicaciones.js";
import comentariosRouter from "./comentarios.js";


const router = Router();

router.use('/usuarios', usuariosRouter);
router.use('/publicaciones', publicacionesRouter);
router.use('/comentarios', comentariosRouter);


export default router;