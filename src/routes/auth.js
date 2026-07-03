import { Router } from "express";
import { validateUser } from "../middlewares/valUser.js";
import authRouter from "../controllers/authController.js";

const router = Router();
router.use("/auth", authRouter);

router.use("/login", validateUser, logIn);
router.use("/register", validateUser, signUp);

export default router;