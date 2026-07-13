import { Router } from "express";
import authRouter from "../controllers/authcontroller.js";

const router = Router();
router.use("/auth", authRouter);


export default router;