import express from "express";
import { join, login, search } from "../controllers/userController.js";
import { home } from "../controllers/postController.js";

const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
