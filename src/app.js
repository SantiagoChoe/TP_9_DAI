import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/publicaciones.js";
import usersRouter from "./routes/user.js";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRouter);
app.use("/api", postsRouter);
app.use("/api", usersRouter);

app.use('', (req, res) => {
  res.status(404).send('Página no encontrada')
})