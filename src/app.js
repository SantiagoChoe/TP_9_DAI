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
app.use("/auth", authRouter);
app.use("/publicaciones", postsRouter);
app.use("/users", usersRouter);

app.use('', (req, res) => {
  res.status(404).send('Página no encontrada')
})