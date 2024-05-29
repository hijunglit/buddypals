import express from "express";
import { posts } from "../controllers/postControllers";
import { join, login, search } from "../controllers/userController";

const globalRouter = express.Router();

globalRouter.get("/", posts);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
