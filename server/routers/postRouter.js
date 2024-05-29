import express from "express";
import { edit, see } from "../controllers/postControllers";

const postRouter = express.Router();

postRouter.get("/see", see);
postRouter.get("/edit", edit);

export default postRouter;
