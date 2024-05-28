import "./db.js";
import express from "express";
import cors from "cors";
import records from "./routes/record.js";
import morgan from "morgan";

const PORT = process.env.PORT || 5050;
const app = express();

const globalRouter = express.Router();
const userRouter = express.Router();
const postRouter = express.Router();

const handleHome = (req, res) => res.send("Home");
const handleEditUser = (req, res) => res.send("Edit user");
const handleSeePost = (req, res) => res.send("See post");

globalRouter.get("/", handleHome);
userRouter.get("/edit", handleEditUser);
postRouter.get("/see", handleSeePost);

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("posts", postRouter);
app.use("/record", records);

const handleListening = () =>
  console.log(`✅ Server listening on http://localhost:${PORT}`);

app.listen(PORT, handleListening);
