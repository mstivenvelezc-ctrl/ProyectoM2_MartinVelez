
import { Router } from "express";
import usersRouter from "./usuarios.js";

const router = Router();

router.use('/usuarios', usersRouter);

export default router;