import express from "express";
import { join, login, search } from "../controllers/userController.js";
import { posts } from "../controllers/postController.js";

const globalRouter = express.Router();

globalRouter.get("/:id(\\d+)", posts);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
