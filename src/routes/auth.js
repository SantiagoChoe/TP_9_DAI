import { Router } from "express";
import authRouter from "../controllers/authController.js";

const router = Router();
router.use("/auth", authRouter);
const authRouter = new AuthRouter();



export default router;