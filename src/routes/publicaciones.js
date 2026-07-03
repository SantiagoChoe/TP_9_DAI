import { Router } from "express";
import pubRouter from "../controllers/pubController.js";

const router = Router();
router.use("/publicaciones", pubRouter);

export default router;