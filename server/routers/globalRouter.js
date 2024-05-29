import express from "express";
import { posts } from "../controllers/postControllers";
import { join } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", posts);
globalRouter.get("/join", join);

export default globalRouter;
