
import { Router } from "express";
import usuariosRouter from "./usuarios.js";
import publicacionesRouter from "./publicaciones.js";

const router = Router();

router.use('/usuarios', usuariosRouter);
router.use('/publicaciones', publicacionesRouter);

export default router;