import { Router } from "express";
import pubRouter from "../controllers/pubController.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import { valPost } from "../middlewares/valPost.js";

const router = Router();
const pubRouter = new pubRouter();

router.use("/publicaciones", pubRouter);
router.get("/", pubRouter.getAll);
router.post("/", verifyToken, valPost, pubRouter.create);
export default router;