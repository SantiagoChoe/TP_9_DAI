import express from "express";
import cors from "cors";
import InstagramRouter from "./src/controllers/province-controller.js";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/instagram", InstagramRouter);

app.use('', (req, res) => {
  res.status(404).send('Página no encontrada')
})