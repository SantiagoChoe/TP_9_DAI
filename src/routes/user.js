import { Router } from "express";
import userRouter from "../controllers/userController.js";

const router = Router();
router.use("/usuarios", userRouter);

export default router;
