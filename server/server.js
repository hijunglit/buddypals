import "./db.js";
import express from "express";
import cors from "cors";
import records from "./routers/record.js";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter.js";
import userRouter from "./routers/userRouter.js";
import postRouter from "./routers/postRouter.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
