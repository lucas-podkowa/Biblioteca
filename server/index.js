import express from "express";
import bookRouter from "./src/routes/book.routes.js";
import reserveRouter from "./src/routes/reserve.routes.js";
import reviewRouter from "./src/routes/review.routes.js";
import userRouter from "./src/routes/user.routes.js";
import authRouter from "./src/routes/auth.routes.js";
import "dotenv/config";
import morgan from "morgan";
import cors from "cors";
import path from "node:path";

const app = express();

app.use(cors());
app.disable("x-powered-by");

app.use(morgan("tiny"));

app.use(express.text());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api", bookRouter);
app.use("/api", reserveRouter);
app.use("/api", reviewRouter);
app.use("/api", userRouter);
app.use("/api/auth", authRouter);

app.use((req, res) => {
  res.status(404).send("Has ingresado una URL sin procesamiento");
});

app.listen(process.env.APP_PORT, () => {
  console.log(
    `Servidor escuchando en: http://localhost:${process.env.APP_PORT}`
  );
});
